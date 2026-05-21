import { Router } from "express";
import {
  createSchedule,
  getMySchedules,
  getSchedules,
  removeSchedule,
  updateFields,
} from "../../controller/schedule";
import { checkRole } from "../../middleware/checkRole";

const privateRoutes = Router();

privateRoutes.post("/schedules", async (req, res) => {
  const userId = (req as any).user.userId

  const inputWithUser = {
    ...req.body,
    user_id: userId
  };

  const result = await createSchedule(inputWithUser);
  res.json(result);
});

privateRoutes.get("/schedules", checkRole(["admin"]), async (_req, res) => {
  const result = await getSchedules();
  res.json(result);
});

privateRoutes.get("/my-schedules", async (req, res) => {
  const { userId } = req.query;

  const result = await getMySchedules(parseInt(userId as any));
  res.json(result);
});

privateRoutes.put("/schedules/:id", async (req, res) => {
  const args = {
    id: parseInt(req.params.id, 10),
    input: req.body,
  };
  const result = await updateFields(args);
  res.json(result);
});

privateRoutes.delete("/schedules/:id", async (req, res) => {
  const result = await removeSchedule({ id: parseInt(req.params.id, 10) });
  res.json(result);
});

export default privateRoutes;
