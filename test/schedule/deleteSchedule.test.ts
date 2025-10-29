import { beforeEach, describe, expect, it, vi } from "vitest";
import { removeSchedule } from "../../src/controller/schedule";
import { deleteSchedule } from "../../src/db/database";

describe("deleteSchedule", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mock("../../src/db/database", () => ({
      deleteSchedule: vi.fn().mockResolvedValue({
        id: 1,
        name: "João",
        phone: "11999999999",
        scheduled_at: "2025-09-23T10:00:00",
        type_cut: "cabelo",
      }),
    }));
  });

  it("Should delete schedule with success", async () => {
    const response = await removeSchedule({ id: 1 });

    expect(response.status).toBe(200);
    expect(response.message).toBe("Agendamento 1 deletado!");
  });

  it("Should return error message ID required", async () => {
    const response = await removeSchedule({} as any);

    expect(response.status).toBe(400);
    expect(response.message).toBe("ID do agendamento é obrigatório");
  });

  it("Should return not found when schedule does not exist", async () => {
    vi.mocked(deleteSchedule).mockResolvedValueOnce(0);

    const response = await removeSchedule({ id: 3 });

    expect(response.status).toBe(404);
    expect(response.message).toBe("Agendamento não encontrado");
  });
});
