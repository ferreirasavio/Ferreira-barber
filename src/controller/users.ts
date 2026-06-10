import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUserTable,
  getAllUsers,
  getUserByEmail,
  resetPassword as updateUserPassword,
} from "../db/database";
import { TDatabaseUser } from "../db/types";
import { handleREST } from "../helpers/HandleREST";
import { sendEmail } from "../helpers/sendEmail";

export const signUp = async (user: TDatabaseUser) => {
  return handleREST(async () => {
    const hashed = await bcrypt.hash(user.password, 10);

    const users = await getAllUsers();
    const userExists = users.find((userDb) => userDb.email === user.email);

    if (userExists) {
      return { status: 409, error: "usuário já existe." };
    }

    await createUserTable({
      ...user,
      password: hashed,
      role: user.role || 'user',
    });

    return { status: 201, message: "Usuário criado com sucesso!" };
  });
};

export const signIn = async (user: TDatabaseUser) => {
  return handleREST(async () => {
    const userDb = await getUserByEmail(user.email);

    if (!userDb) {
      return { status: 404, error: "usuário não encontrado." };
    }

    const passwordMatch = await bcrypt.compare(user.password, userDb.password);

    if (!passwordMatch) {
      return { status: 401, error: "senha incorreta." };
    }

    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({ userId: userDb.id, role: userDb.role }, secret!, { expiresIn: "8h" });

    return {
      token, status: 200, user: {
        userId: userDb.id,
        role: userDb.role
      }
    };
  });
};

export const requestToken = async (email: string) => {
  return handleREST(async () => {
    const user = await getUserByEmail(email);

    if (!user) return true;

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return {
        status: 500,
        error: "JWT_SECRET não configurado.",
      };
    }
    // 1. Gera o código numérico de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const token = jwt.sign({ email: user.email, code }, secret, {
      expiresIn: "15m",
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    if (process.env.NODE_ENV === "development") {
      console.log("=".repeat(80));
      console.log("🔑 RECUPERAÇÃO DE SENHA (JWT + 6 DÍGITOS)");
      console.log("=".repeat(80));
      console.log("Email:", user.email);
      console.log("Código de 6 dígitos:", code);
      console.log("Link completo com Token:", resetLink);
      console.log("=".repeat(80));
    }
    await sendEmail({
      to: user.email,
      subject: "Código de recuperação de senha",
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <p>Você solicitou a recuperação de senha da sua conta.</p>
          <p>Seu código de verificação é:</p>
          <h1 style="color: #2563eb; letter-spacing: 4px; font-size: 32px; font-weight: bold;">${code}</h1>
          <p>Clique no link abaixo para ir à página de redefinição e insira o código acima:</p>
          <p><a href="${resetLink}" style="color: #2563eb; font-weight: bold;">Clique aqui para redefinir sua senha</a></p>
          <p>Este código e link expiram em 15 minutos.</p>
        </div>
      `,
    });

    return true;
  });
};

export const resetPassword = async ({ token, code, newPassword }: { token: string; code: string; newPassword: string }) => {
  return handleREST(async () => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return {
        status: 500,
        error: "JWT_SECRET não configurado.",
      };
    }

    if (!code) {
      return {
        status: 400,
        error: "O código de 6 dígitos é obrigatório.",
      };
    }

    let decoded: any;

    try {

      decoded = jwt.verify(token, secret);
    } catch (error: any) {
      console.error("ERRO REAL DO JWT.VERIFY:", error.message);

      return {
        status: 401,
        error: `Erro no JWT: ${error.message}`,
      };
    }

    const { email, code: originalCode } = decoded;

    if (!email || !originalCode) {
      return {
        status: 400,
        error: "Token inválido.",
      };
    }

    if (String(code).trim() !== String(originalCode).trim()) {
      return {
        status: 401,
        error: "Código de verificação incorreto.",
      };
    }

    const userDb = await getUserByEmail(email);
    if (!userDb) {
      return {
        status: 404,
        error: "Usuário não encontrado.",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(email, hashedPassword);

    return true;
  });
};