import { Router } from "express";
import {
  createSchedule,
  getSchedules,
  removeSchedule,
  updateFields,
} from "../controller/schedule";

const router = Router();

router.post("/schedules", async (req, res) => {
  const result = await createSchedule(req.body);
  res.json(result);
});
router.get("/schedules", async (_req, res) => {
  const result = await getSchedules();
  res.json(result);
});
router.put("/schedules/:id", async (req, res) => {
  const args = {
    id: parseInt(req.params.id, 10),
    input: req.body,
  };
  const result = await updateFields(args);
  res.json(result);
});
router.delete("/schedules/:id", async (req, res) => {
  const result = await removeSchedule({ id: parseInt(req.params.id, 10) });
  res.json(result);
});

export default router;
