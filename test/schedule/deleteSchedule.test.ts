import { beforeEach, describe, expect, it, vi } from "vitest";
import { removeSchedule } from "../../src/controller/schedule";
import { deleteSchedule } from "../../src/db/database";

describe("deleteSchedule", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mock("../../src/db/database", () => ({
      deleteSchedule: vi.fn().mockResolvedValue(1),
    }));
  });

  it("Should delete schedule with success", async () => {
    const response = await removeSchedule({ id: 1 });

    expect(response.status).toBe(200);
    expect(response.data).toBe(true);
  });

  it("Should return error message ID required", async () => {
    const response = await removeSchedule({} as any);

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      status: 400,
      message: "ID do agendamento é obrigatório",
    });
  });

  it("Should return not found when schedule does not exist", async () => {
    vi.mocked(deleteSchedule).mockResolvedValueOnce(0);

    const response = await removeSchedule({ id: 3 });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      status: 404,
      message: "Agendamento não encontrado",
    });
  });
});
