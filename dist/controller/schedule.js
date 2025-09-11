"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeSchedule = exports.updateFields = exports.getSchedules = exports.createSchedule = void 0;
const database_1 = require("../db/database");
const createSchedule = async (req, res) => {
    try {
        const { name, phone, scheduled_at, type_cut } = req.body;
        const newSchedule = await (0, database_1.schedulingTime)({
            name,
            phone,
            scheduled_at,
            type_cut,
        });
        res.status(201).json(newSchedule);
    }
    catch (error) {
        console.error("Error creating schedule:", error);
    }
};
exports.createSchedule = createSchedule;
const getSchedules = async (req, res) => {
    try {
        const schedules = await (0, database_1.getAllSchedules)();
        res.status(200).json(schedules);
    }
    catch (error) {
        console.error("Error fetching schedules:", error);
    }
};
exports.getSchedules = getSchedules;
const updateFields = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, scheduled_at, type_cut } = req.body;
        if (!id) {
            return res.status(400).json({ error: "ID do agendamento é obrigatório" });
        }
        if (!name && !phone && !scheduled_at && !type_cut) {
            return res
                .status(400)
                .json({ error: "Nenhum campo foi preenchido para atualizar" });
        }
        await (0, database_1.updateSchedule)(id, { name, phone, scheduled_at, type_cut });
        res.status(200).json({ message: "Agendamento atualizado!" });
    }
    catch (error) {
        console.error("Error updating schedule:", error);
        res.status(500).json({ error: "Erro ao atualizar agendamento" });
    }
};
exports.updateFields = updateFields;
const removeSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "ID do agendamento é obrigatório" });
        }
        const deleteCount = await (0, database_1.deleteSchedule)(id);
        if (deleteCount === 0) {
            return res.status(404).json({ error: "Agendamento não encontrado" });
        }
        res.status(200).json({ message: `Agendamento ${id} deletado!` });
    }
    catch (error) {
        console.error("Error deleting schedule:", error);
    }
};
exports.removeSchedule = removeSchedule;
