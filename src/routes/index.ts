import { Router } from "express";
import {
  createSchedule,
  getSchedules,
  removeSchedule,
  updateFields,
} from "../controller/schedule";

const router = Router();

router.post("/schedules", createSchedule);
router.get("/schedules", getSchedules);
router.put("/schedules/:id", updateFields);
router.delete("/schedules/:id", removeSchedule);

export default router;
