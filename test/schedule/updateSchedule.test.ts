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
    }));
  });

  it("Should update schedule with success", async () => {
    const response = await updateFields({
      id: 1,
      input: argsMocked as TDatabase,
    }, 1, 'admin');

    expect(response).toBeTruthy()
  });

  it("Should return error when id is not provided", async () => {
    const response = await updateFields({
      id: undefined,
      input: argsMocked as TDatabase,
    }, 1, 'admin');
    expect(response.status).toBe(400);
    expect(response.error).toBe("ID do agendamento é obrigatório");
  });

  it("Should return error when no have param corrects", async () => {
    const response = await updateFields({
      id: 1,
      name: 'teste',
      phone: '21983838282',
      type_cut: 'cabelo',
      user_id: 2
    }, 1, 'user');
    expect(response.status).toBe(400);
    expect(response.error).toMatchObject({
      type: "ValidationError",
      message: "Erro de validação nos dados fornecidos.",
    });

  });
});
