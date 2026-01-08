import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetPassword } from "../../src/controller/users";
import * as database from "../../src/db/database";

// Mock do Resend para evitar erro de API key
vi.mock("resend", () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: vi.fn().mockResolvedValue({ id: "mock-email-id" }),
      },
    })),
  };
});

describe("resetPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test_secret_key";
    process.env.RESEND_API_KEY = "re_test_key";
  });

  it("Should reset password successfully with valid token", async () => {
    const mockUser = {
      id: 1,
      name: "João Silva",
      email: "joao@example.com",
      password: "old_hashed_password",
    };

    const token = jwt.sign({ email: "joao@example.com" }, "test_secret_key", {
      expiresIn: "15m",
    });

    vi.spyOn(database, "getUserByEmail").mockResolvedValueOnce(mockUser);
    vi.spyOn(database, "resetPassword").mockResolvedValueOnce({
      ...mockUser,
      password: "new_hashed_password",
    });
    vi.spyOn(bcrypt, "hash").mockImplementation(
      () => Promise.resolve("new_hashed_password") as any
    );

    const response = await resetPassword(token, "newPassword123");

    expect(response.status).toBe(200);
    expect(response.data).toBe(true);
    expect(database.getUserByEmail).toHaveBeenCalledWith("joao@example.com");
    expect(bcrypt.hash).toHaveBeenCalledWith("newPassword123", 10);
    expect(database.resetPassword).toHaveBeenCalledWith(
      "joao@example.com",
      "new_hashed_password"
    );
  });

  it("Should return error with invalid token", async () => {
    const invalidToken = "invalid_token_string";

    const response = await resetPassword(invalidToken, "newPassword123");

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      status: 401,
      error: "Token inválido ou expirado.",
    });
  });

  it("Should return error with expired token", async () => {
    const expiredToken = jwt.sign(
      { email: "joao@example.com" },
      "test_secret_key",
      {
        expiresIn: "0s",
      }
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = await resetPassword(expiredToken, "newPassword123");

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      status: 401,
      error: "Token inválido ou expirado.",
    });
  });

  it("Should return error if JWT_SECRET is not configured", async () => {
    delete process.env.JWT_SECRET;

    const token = "any_token";

    const response = await resetPassword(token, "newPassword123");

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      status: 500,
      error: "JWT_SECRET não configurado.",
    });
  });

  it("Should return error if user is not found", async () => {
    const token = jwt.sign(
      { email: "naoexiste@example.com" },
      "test_secret_key",
      {
        expiresIn: "15m",
      }
    );

    vi.spyOn(database, "getUserByEmail").mockResolvedValueOnce(null);

    const response = await resetPassword(token, "newPassword123");

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      status: 404,
      error: "Usuário não encontrado.",
    });
  });

  it("Should return error if token does not contain email", async () => {
    const token = jwt.sign({ userId: 123 }, "test_secret_key", {
      expiresIn: "15m",
    });

    const response = await resetPassword(token, "newPassword123");

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      status: 400,
      error: "Token inválido.",
    });
  });
});
