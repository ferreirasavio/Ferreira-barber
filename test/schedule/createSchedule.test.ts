import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSchedule } from "../../src/controller/schedule";
import * as database from "../../src/db/database";
import { TDatabase } from "../../src/db/types";

const argsMocked = {
  name: "João",
  phone: "11999999999",
  scheduled_at: "2025-09-23T10:00:00",
  type_cut: "cabelo",
};

describe("createSchedule", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mock("../../src/db/database", () => ({
      schedulingTime: vi.fn().mockResolvedValue({
        id: 1,
        name: "João",
        phone: "11999999999",
        scheduled_at: "2025-09-23T10:00:00",
        type_cut: "cabelo",
      }),
      getAllSchedules: vi.fn().mockResolvedValue([]),
    }));
  });

  it("Should create schedule with success", async () => {
    vi.spyOn(database, "getAllSchedules").mockResolvedValueOnce([]);
    const response = await createSchedule(argsMocked as TDatabase);

    expect(response.status).toBe(201);
    expect(response.data).toEqual({
      id: 1,
      name: "João",
      phone: "11999999999",
      scheduled_at: "2025-09-23T10:00:00",
      type_cut: "cabelo",
    });
  });

  it("Should return error repeated schedule", async () => {
    vi.spyOn(database, "getAllSchedules").mockResolvedValueOnce([argsMocked]);
    const response = await createSchedule(argsMocked as TDatabase);

    expect(response.status).toBe(409);
    expect(response.error).toEqual(
      "Já existe um agendamento para essa data e hora."
    );
  });

  it("Should return required data", async () => {
    vi.spyOn(database, "getAllSchedules").mockResolvedValueOnce([]);
    const response = await createSchedule({} as TDatabase);

    expect(response).toEqual({
      status: 400,
      error: "Dados obrigatórios não informados",
      message: "Nome, telefone, data/hora e tipo de corte são obrigatórios",
    });
  });
});
