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

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      id: 1,
      name: "João",
      phone: "11999999999",
      scheduled_at: "2025-09-23T10:00:00",
      type_cut: "cabelo",
    });
  });

  it("Should return error repeated schedule", async () => {
    vi.spyOn(database, "getAllSchedules").mockResolvedValueOnce([
      {
        ...argsMocked,
        scheduled_at: "2025-09-23 10:00:00",
      },
    ]);
    const response = await createSchedule(argsMocked as TDatabase);

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      status: 409,
      error: "Já existe um agendamento para essa data e hora.",
    });
  });

  it("Should return required data", async () => {
    vi.spyOn(database, "getAllSchedules").mockResolvedValueOnce([]);
    const response = await createSchedule({} as TDatabase);

    expect(response.status).toBe(400);
    expect(response.error).toEqual({
      type: "ValidationError",
      message: "Erro de validação nos dados fornecidos.",
      details: expect.arrayContaining([
        expect.objectContaining({ path: "name" }),
        expect.objectContaining({ path: "phone" }),
        expect.objectContaining({ path: "scheduled_at" }),
        expect.objectContaining({ path: "type_cut" }),
      ]),
    });
  });
});
