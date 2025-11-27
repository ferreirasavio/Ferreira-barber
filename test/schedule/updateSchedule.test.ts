import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateFields } from "../../src/controller/schedule";
import { TDatabase } from "../../src/db/types";

const argsMocked = {
  name: "João",
  phone: "11999999999",
  scheduled_at: "2025-09-23T10:00:00",
  type_cut: "cabelo",
};

describe("updateFields", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mock("../../src/db/database", () => ({
      updateSchedule: vi.fn().mockResolvedValue({
        id: 1,
        name: "João",
        phone: "11999999999",
        scheduled_at: "2025-09-23T10:00:00",
        type_cut: "cabelo",
      }),
      getAllSchedules: vi.fn().mockResolvedValue([]),
    }));
  });

  it("Should update schedule with success", async () => {
    const response = await updateFields({
      id: 1,
      input: argsMocked as TDatabase,
    });

    expect(response.status).toBe(200);
    expect(response.data).toBe(true);
  });

  it("Should return error when id is not provided", async () => {
    const response = await updateFields({
      id: undefined,
      input: argsMocked as TDatabase,
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      status: 400,
      error: "ID do agendamento é obrigatório",
    });
  });

  it("Should return error when no fields are provided", async () => {
    const response = await updateFields({
      id: 1,
      input: {} as TDatabase,
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      status: 400,
      error: "Data/hora do agendamento é obrigatória",
    });
  });
});
