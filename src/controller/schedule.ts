import { Request, Response } from "express";
import {
  deleteSchedule,
  getAllSchedules,
  schedulingTime,
  updateSchedule,
} from "../db/database";

type ScheduleBody = {
  name: string;
  phone: string;
  scheduled_at: string;
  type_cut: "cabelo" | "barba" | "cabelo e barba";
};

type ScheduleParams = {
  id: number;
};

export const createSchedule = async (req: Request, res: Response) => {
  try {
    const { name, phone, scheduled_at, type_cut } = req.body;
    const newSchedule = await schedulingTime({
      name,
      phone,
      scheduled_at,
      type_cut,
    });
    res.status(201).json(newSchedule);
  } catch (error) {
    console.error("Error creating schedule:", error);
  }
};

export const getSchedules = async (req: Request, res: Response) => {
  try {
    const schedules = await getAllSchedules();
    res.status(200).json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
  }
};

export const updateFields = async (
  req: Request<ScheduleParams, ScheduleBody>,
  res: Response
) => {
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
    await updateSchedule(id, { name, phone, scheduled_at, type_cut });

    res.status(200).json({ message: "Agendamento atualizado!" });
  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({ error: "Erro ao atualizar agendamento" });
  }
};

export const removeSchedule = async (
  req: Request<ScheduleParams>,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID do agendamento é obrigatório" });
    }
    const deleteCount = await deleteSchedule(id);
    if (deleteCount === 0) {
      return res.status(404).json({ error: "Agendamento não encontrado" });
    }
    res.status(200).json({ message: `Agendamento ${id} deletado!` });
  } catch (error) {
    console.error("Error deleting schedule:", error);
  }
};
