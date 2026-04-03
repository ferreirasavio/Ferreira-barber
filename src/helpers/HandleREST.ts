import { ZodError } from "zod";

// Ajustamos o tipo da função para aceitar o sucesso (T) ou um erro manual
type HandlerFn<T> = () => Promise<T | ManualError>;

interface HandleRESTResult<T> {
  status: number;
  data?: T;
  error?:
    | string
    | {
        type: string;
        message: string;
        details?: any;
      };
}

interface ManualError {
  status: number;
  error: string;
}

export async function handleREST<T>(
  fn: HandlerFn<T>,
  logErrors = true,
): Promise<HandleRESTResult<T>> {
  try {
    const result = await fn();

    // Verificação de Erro Manual (Type Guard)
    // Checamos se o resultado é um objeto que contém a propriedade 'error'
    if (
      result &&
      typeof result === "object" &&
      "status" in result &&
      typeof (result as any).status === "number"
    ) {
      const res = result as any;

      // Se for um erro manual (>= 400), retorna como erro
      if (res.status >= 400) {
        return {
          status: res.status,
          error: res.error || res.message,
        };
      }

      // Se for um sucesso customizado (ex: 201), retorna o status dele e os dados
      return {
        status: res.status,
        data: res.data !== undefined ? res.data : res,
      };
    }

    // Se não caiu no if anterior, o TS entende que é o sucesso (T)
    return {
      status: 200,
      data: result as T,
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

    // --- NotFound Error ---
    if (error.name === "NotFoundError") {
      return {
        status: 404,
        error: {
          type: "NotFoundError",
          message: error.message || "Recurso não encontrado.",
        },
      };
    }

    // --- Custom Errors with status field (disparados via throw) ---
    if (typeof error?.status === "number") {
      return {
        status: error.status,
        error: {
          type: error.name || "CustomError",
          message: error.message || "Erro customizado.",
        },
      };
    }

    // --- Fallback 500 ---
    return {
      status: 500,
      error: {
        type: "InternalServerError",
        message: "Erro interno do servidor.",
      },
    };
  }
}
