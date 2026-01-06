import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { createUserTable, getAllUsers, getUserByEmail } from "../db/database";
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

export const forgotPasswordReset = async (email: string) => {
  return handleREST(async () => {
    const user = await getUserByEmail(email);

    if (!user) return true;

    const token = crypto.randomBytes(32).toString("hex");

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

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
