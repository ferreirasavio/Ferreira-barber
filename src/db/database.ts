import pool from "./connection";
import { TDatabase } from "./types";

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
