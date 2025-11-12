import {
  deleteSchedule,
  getAllSchedules,
  schedulingTime,
  updateSchedule,
} from "../db/database";
import { TDatabase } from "../db/types";
import { handleREST } from "../helpers/HandleREST";
import { schemaSchedule, schemaScheduleUpdate } from "../helpers/schema";
import { normalizeDate } from "../utils/formatDate";

type ScheduleArgs = {
  id?: number;
  input: TDatabase;
};

export const createSchedule = async (input: TDatabase) => {
  return handleREST(async () => {
    const parsed = schemaSchedule.parse(input);
    const normalizedDate = normalizeDate(input.scheduled_at);

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
      ...parsed,
      scheduled_at: normalizedDate,
    });
    return newSchedule;
  });
};

export const getSchedules = async () => {
  return handleREST(async () => {
    const schedules = await getAllSchedules();
    return schedules;
  });
};

export const updateFields = async (args: ScheduleArgs) => {
  return handleREST(async () => {
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

    return true;
  });
};

export const removeSchedule = async (input: { id: number }) => {
  return handleREST(async () => {
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
    return true;
  });
};
