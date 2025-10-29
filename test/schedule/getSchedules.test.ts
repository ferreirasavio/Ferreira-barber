import { beforeEach, describe, expect, it, vi } from "vitest";

const argsMocked = {
  name: "João",
  phone: "11999999999",
  scheduled_at: "2025-09-23T10:00:00",
  type_cut: "cabelo",
};

describe("getSchedules", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mock("../../src/db/database", () => ({
      getAllSchedules: vi.fn().mockResolvedValue([argsMocked]),
    }));
  });

  it("Should get schedules with success", async () => {
    const { getSchedules } = await import("../../src/controller/schedule");
    const response = await getSchedules();
    expect(response.status).toBe(200);
    expect(response.data).toEqual([argsMocked]);
  });
});
