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
      return {
        status: 409,
        error: "usuário já existe.",
      };
    }

    await createUserTable({
      ...user,
      password: hashed,
    });
    return true;
  });
};

export const signIn = async (user: TDatabaseUser) => {
  return handleREST(async () => {
    const userDb = await getUserByEmail(user.email);

    if (!userDb) {
      return {
        status: 404,
        error: "usuário não encontrado.",
      };
    }

    const passwordMatch = await bcrypt.compare(user.password, userDb.password);

    if (!passwordMatch) {
      return {
        status: 401,
        error: "senha incorreta.",
      };
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return {
        status: 500,
        error: "JWT_SECRET não configurado.",
      };
    }

    const token = jwt.sign({ userId: userDb.id }, secret, {
      expiresIn: "8h",
    });
    return token;
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

    const token = jwt.sign({ email: user.email }, secret, {
      expiresIn: "15m",
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    if (process.env.NODE_ENV === "development") {
      console.log("=".repeat(80));
      console.log("🔑 TOKEN DE RESET DE SENHA (DESENVOLVIMENTO)");
      console.log("=".repeat(80));
      console.log("Email:", user.email);
      console.log("Token:", token);
      console.log("Link completo:", resetLink);
      console.log("=".repeat(80));
    }

    await sendEmail({
      to: user.email,
      subject: "Recuperação de senha",
      html: `
        <p>Você solicitou recuperação de senha.</p>
        <p>
          <a href="${resetLink}">
            Clique aqui para redefinir sua senha
          </a>
        </p>
        <p>Este link expira em 15 minutos.</p>
      `,
    });

    return true;
  });
};

export const resetPassword = async (token: string, newPassword: string) => {
  return handleREST(async () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return {
        status: 500,
        error: "JWT_SECRET não configurado.",
      };
    }

    let decoded: any;

    try {
      decoded = jwt.verify(token, secret);
    } catch (error) {
      return {
        status: 401,
        error: "Token inválido ou expirado.",
      };
    }

    const { email } = decoded;

    if (!email) {
      return {
        status: 400,
        error: "Token inválido.",
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
