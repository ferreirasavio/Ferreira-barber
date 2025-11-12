import { ZodError } from "zod";

type HandlerFn<T> = () => Promise<T>;

interface HandleRESTResult<T> {
  status: number;
  data?: T;
  error?: {
    type: string;
    message: string;
    details?: any;
  };
}

export async function handleREST<T>(
  fn: HandlerFn<T>,
  logErrors = true
): Promise<HandleRESTResult<T>> {
  try {
    const result = await fn();

    return {
      status: 200,
      data: result,
    };
  } catch (error: any) {
    if (logErrors) console.error("REST handler error:", error);

    // --- Zod Validation Error ---
    if (error instanceof ZodError) {
      return {
        status: 400,
        error: {
          type: "ValidationError",
          message: "Erro de validação nos dados fornecidos.",
          details: error.issues.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        },
      };
    }

    // --- Custom Not Found ---
    if (error.name === "NotFoundError") {
      return {
        status: 404,
        error: {
          type: "NotFoundError",
          message: error.message || "Recurso não encontrado.",
        },
      };
    }

    // --- Custom Errors with status field ---
    if (typeof error.status === "number") {
      return {
        status: error.status,
        error: {
          type: error.name || "CustomError",
          message: error.message || "Erro customizado.",
        },
      };
    }

    // --- Fallback: Internal Error ---
    return {
      status: 500,
      error: {
        type: "InternalServerError",
        message: "Erro interno do servidor.",
      },
    };
  }
}
