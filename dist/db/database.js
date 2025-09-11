"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulingTime = schedulingTime;
exports.getAllSchedules = getAllSchedules;
exports.updateSchedule = updateSchedule;
exports.deleteSchedule = deleteSchedule;
const connection_1 = __importDefault(require("./connection"));
async function schedulingTime(schedule) {
    try {
        const query = `
      INSERT INTO schedule (name, phone, scheduled_at, type_cut)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
        const values = [
            schedule.name,
            schedule.phone,
            schedule.scheduled_at,
            schedule.type_cut,
        ];
        const result = await connection_1.default.query(query, values);
        return result.rows[0];
    }
    catch (error) {
        console.error("Error scheduling time:", error);
        throw error;
    }
}
async function getAllSchedules() {
    try {
        const query = `SELECT * FROM schedule;`;
        const result = await connection_1.default.query(query);
        return result.rows;
    }
    catch (error) {
        console.error("Error fetching schedules:", error);
        throw error;
    }
}
async function updateSchedule(id, updatedFields) {
    try {
        const setClauses = [];
        const values = [];
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
        const query = `UPDATE schedule SET ${setClauses.join(", ")} WHERE id = $${index} RETURNING *;`;
        values.push(id);
        const result = await connection_1.default.query(query, values);
        return result.rows[0];
    }
    catch (error) {
        console.error("Error updating schedule:", error);
        throw error;
    }
}
async function deleteSchedule(id) {
    try {
        const query = `DELETE FROM schedule WHERE id=$1;`;
        const result = await connection_1.default.query(query, [id]);
        return result.rowCount;
    }
    catch (error) {
        console.error("Error deleting schedule:", error);
        throw error;
    }
}
