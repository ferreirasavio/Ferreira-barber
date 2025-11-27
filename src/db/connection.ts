import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  // Supabase já vem com SSL configurado
  ssl: process.env.DB_HOST?.includes("supabase")
    ? { rejectUnauthorized: false }
    : false,
  // Configurações otimizadas para Lambda
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;
