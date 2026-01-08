import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { requestToken } from "../../src/controller/users";
import * as database from "../../src/db/database";
import * as sendEmailModule from "../../src/helpers/sendEmail";

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

describe("requestToken", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test_secret_key";
    process.env.FRONTEND_URL = "http://localhost:3000";
    process.env.NODE_ENV = "test";
    process.env.RESEND_API_KEY = "re_test_key";
  });

  it("Should generate token and send email successfully", async () => {
    const mockUser = {
      id: 1,
      name: "João Silva",
      email: "joao@example.com",
      password: "hashed_password",
    };

    vi.spyOn(database, "getUserByEmail").mockResolvedValueOnce(mockUser);
    vi.spyOn(sendEmailModule, "sendEmail").mockResolvedValueOnce(undefined);
    vi.spyOn(jwt, "sign");

    const response = await requestToken("joao@example.com");

    expect(response.status).toBe(200);
    expect(response.data).toBe(true);
    expect(database.getUserByEmail).toHaveBeenCalledWith("joao@example.com");
    expect(jwt.sign).toHaveBeenCalledWith(
      { email: "joao@example.com" },
      "test_secret_key",
      { expiresIn: "15m" }
    );
    expect(sendEmailModule.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "joao@example.com",
        subject: "Recuperação de senha",
      })
    );
  });

  it("Should return true even if user does not exist (security)", async () => {
    vi.spyOn(database, "getUserByEmail").mockResolvedValueOnce(null);
    vi.spyOn(sendEmailModule, "sendEmail");

    const response = await requestToken("naoexiste@example.com");

    expect(response.status).toBe(200);
    expect(response.data).toBe(true);
    expect(database.getUserByEmail).toHaveBeenCalledWith(
      "naoexiste@example.com"
    );
    expect(sendEmailModule.sendEmail).not.toHaveBeenCalled();
  });

  it("Should return error if JWT_SECRET is not configured", async () => {
    const mockUser = {
      id: 1,
      name: "João Silva",
      email: "joao@example.com",
      password: "hashed_password",
    };

    delete process.env.JWT_SECRET;
    vi.spyOn(database, "getUserByEmail").mockResolvedValueOnce(mockUser);

    const response = await requestToken("joao@example.com");

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      status: 500,
      error: "JWT_SECRET não configurado.",
    });
  });
});
