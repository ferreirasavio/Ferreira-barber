import {
  deleteSchedule,
  getAllSchedules,
  schedulingTime,
  updateSchedule,
} from "../db/database";
import { TDatabase } from "../db/types";

type ScheduleArgs = {
  id?: number;
  input: TDatabase;
};

export const createSchedule = async (input: TDatabase) => {
  try {
    const { name, phone, scheduled_at, type_cut } = input;
    console.log(input);
    if (!name || !phone || !scheduled_at || !type_cut) {
      console.log("Input recebido:", input);
      return {
        status: 400,
        error: "Dados obrigatórios não informados",
        message: "Nome, telefone, data/hora e tipo de corte são obrigatórios",
      };
    }

    const newSchedule = await schedulingTime({
      name,
      phone,
      scheduled_at,
      type_cut,
    });
    return {
      status: 201,
      data: newSchedule,
    };
  } catch (error) {
    console.error("Error creating schedule:", error);

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
    const { name, phone, scheduled_at, type_cut } = args.input;

    if (!args.id) {
      return {
        status: 400,
        error: "ID do agendamento é obrigatório",
      };
    }

    if (!name && !phone && !scheduled_at && !type_cut) {
      return {
        status: 400,
        error: "Nenhum campo foi preenchido para atualizar",
      };
    }
    await updateSchedule(args.id, { name, phone, scheduled_at, type_cut });

    return {
      status: 200,
      message: "Agendamento atualizado!",
    };
  } catch (error) {
    console.error("Error updating schedule:", error);
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
        error: "ID do agendamento é obrigatório",
      };
    }
    const deleteCount = await deleteSchedule(input.id);
    if (deleteCount === 0) {
      return {
        status: 404,
        error: "Agendamento não encontrado",
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
