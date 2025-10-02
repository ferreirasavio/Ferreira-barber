import { beforeEach, describe, expect, it, vi } from "vitest";

// Mocke ANTES de importar o controller!
vi.mock("../../src/db/database", () => ({
  schedulingTime: vi.fn().mockResolvedValue({
    id: 1,
    name: "João",
    phone: "11999999999",
    scheduled_at: "2025-09-23T10:00:00",
    type_cut: "cabelo",
  }),
}));

import { createSchedule } from "../../src/controller/schedule";

describe("createSchedule", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: {
        name: "João",
        phone: "11999999999",
        scheduled_at: "2025-09-23T10:00:00",
        type_cut: "cabelo",
      },
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  it("Should create schedule with success", async () => {
    await createSchedule(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      ...req.body,
    });
  });

  it("Should return required data", async () => {
    req.body = {};
    await createSchedule(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Dados obrigatórios não informados",
      message: "Nome, telefone, data/hora e tipo de corte são obrigatórios",
    });
  });
});
