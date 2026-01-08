import pool from "./connection";
import { TDatabase, TDatabaseUser } from "./types";

export async function schedulingTime(schedule: TDatabase) {
  try {
    const query = `
      INSERT INTO schedules (name, phone, scheduled_at, type_cut)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [
      schedule.name,
      schedule.phone,
      schedule.scheduled_at,
      schedule.type_cut,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error scheduling time:", error);
    throw error;
  }
}

export async function getAllSchedules() {
  try {
    const query = `SELECT * FROM schedules;`;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw error;
  }
}

export async function updateSchedule(
  id: number,
  updatedFields: Partial<TDatabase>
) {
  try {
    const setClauses: string[] = [];
    const values: any[] = [];
    let index = 1;

    for (const [key, value] of Object.entries(updatedFields)) {
      if (value !== undefined) {
        setClauses.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
    }

    if (setClauses.length === 0) {
      throw new Error("Nenhum campo fornecido para atualização.");
    }

    const query = `UPDATE schedules SET ${setClauses.join(
      ", "
    )} WHERE id = $${index} RETURNING *;`;
    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating schedule:", error);
    throw error;
  }
}

export async function deleteSchedule(id: number) {
  try {
    const query = `DELETE FROM schedules WHERE id=$1;`;
    const result = await pool.query(query, [id]);
    return result.rowCount;
  } catch (error) {
    console.error("Error deleting schedule:", error);
    throw error;
  }
}

export async function createUserTable(user: TDatabaseUser) {
  try {
    const query = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const values = [user.name, user.email, user.password];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    const query = `SELECT * FROM users;`;
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const query = `SELECT * FROM users WHERE email = $1 LIMIT 1;`;
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
}

export async function resetPassword(email: string, newPassword: string) {
  try {
    const query = `
      UPDATE users
      SET password = $1
      WHERE email = $2
      RETURNING *;
    `;

    const values = [newPassword, email];

    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
}
