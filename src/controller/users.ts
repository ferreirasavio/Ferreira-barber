import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUserTable, getAllUsers, getUserByEmail } from "../db/database";
import { TDatabaseUser } from "../db/types";
import { handleREST } from "../helpers/HandleREST";

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
