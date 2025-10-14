import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSchedule } from "../../src/controller/schedule";
import { TDatabase } from "../../src/db/types";

const args = {
  id: 1,
  input: {
    name: "João",
    phone: "11999999999",
    scheduled_at: "2025-09-23T10:00:00",
    type_cut: "cabelo",
  },
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
    }));
  });

  it("Should create schedule with success", async () => {
    const response = await createSchedule(args.input as TDatabase);

    expect(response.status).toBe(201);
    expect(response.data).toEqual({
      id: 1,
      name: "João",
      phone: "11999999999",
      scheduled_at: "2025-09-23T10:00:00",
      type_cut: "cabelo",
    });
  });

  it("Should return required data", async () => {
    const response = await createSchedule({} as TDatabase);

    expect(response).toEqual({
      status: 400,
      error: "Dados obrigatórios não informados",
      message: "Nome, telefone, data/hora e tipo de corte são obrigatórios",
    });
  });
});
