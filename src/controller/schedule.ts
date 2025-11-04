import { z } from "zod";
import {
  deleteSchedule,
  getAllSchedules,
  schedulingTime,
  updateSchedule,
} from "../db/database";
import { TDatabase } from "../db/types";
import { normalizeDate } from "../utils/formatDate";
import { schemaSchedule, schemaScheduleUpdate } from "../utils/schema";

type ScheduleArgs = {
  id?: number;
  input: TDatabase;
};

export const createSchedule = async (input: TDatabase) => {
  try {
    const parsedInput = schemaSchedule.parse(input);
    const normalizedDate = normalizeDate(parsedInput.scheduled_at);

    const schedules = await getAllSchedules();
    const alreadyScheduled = schedules.find(
      (val) => normalizeDate(val.scheduled_at) === normalizedDate
    );
    if (alreadyScheduled) {
      return {
        status: 409,
        error: "Já existe um agendamento para essa data e hora.",
      };
    }

    const newSchedule = await schedulingTime({
      ...parsedInput,
      scheduled_at: normalizedDate,
    });

    return {
      status: 201,
      data: newSchedule,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: 400,
        error: "Dados obrigatórios não informados",
        message: "Nome, telefone, data/hora e tipo de corte são obrigatórios",
      };
    }

    return {
      status: 500,
      error: "Erro interno do servidor",
      message: "Não foi possível criar o agendamento",
    };
  }
};

export const getSchedules = async () => {
  try {
    const schedules = await getAllSchedules();
    return {
      status: 200,
      data: schedules,
    };
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return {
      status: 500,
      error: "Erro interno do servidor",
      message: "Não foi possível buscar os agendamentos",
    };
  }
};

export const updateFields = async (args: ScheduleArgs) => {
  try {
    const parsedInput = schemaScheduleUpdate.parse(args.input);
    if (!parsedInput.scheduled_at) {
      return {
        status: 400,
        error: "Data/hora do agendamento é obrigatória",
      };
    }
    const normalizedDate = normalizeDate(parsedInput.scheduled_at);
    if (!args.id) {
      return {
        status: 400,
        error: "ID do agendamento é obrigatório",
      };
    }

    const schedules = await getAllSchedules();

    const alreadyScheduled = schedules.find(
      (val) => normalizeDate(val.scheduled_at) === normalizedDate
    );

    if (alreadyScheduled) {
      return {
        status: 409,
        error: "Já existe um agendamento para essa data e hora.",
      };
    }

    await updateSchedule(args.id, parsedInput);

    return {
      status: 200,
      message: "Agendamento atualizado!",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: 400,
        message: "Nenhum campo foi preenchido para atualizar",
      };
    }

    return {
      status: 500,
      error: "Erro interno do servidor",
      message: "Não foi possível atualizar o agendamento",
    };
  }
};

export const removeSchedule = async (input: { id: number }) => {
  try {
    if (!input.id) {
      return {
        status: 400,
        message: "ID do agendamento é obrigatório",
      };
    }
    const deleteCount = await deleteSchedule(input.id);
    if (deleteCount === 0) {
      return {
        status: 404,
        message: "Agendamento não encontrado",
      };
    }
    return {
      status: 200,
      message: `Agendamento ${input.id} deletado!`,
    };
  } catch (error) {
    console.error("Error deleting schedule:", error);

    return {
      status: 500,
      error: "Erro interno do servidor",
      message: "Não foi possível deletar o agendamento",
    };
  }
};
