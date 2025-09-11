import { Pool } from "pg";

const pool = new Pool({
  user: "savio.ferreira", // se precisar pegar do ambiente, usar process.env.USER
  host: "localhost", // se precisar pegar do ambiente, usar process.env.HOST
  database: "db_ferreira_barber", // se precisar pegar do ambiente, usar process
  port: 5432, // se precisar pegar do ambiente, usar process.env.PORT
});

export default pool;
