import { Router } from "express";
import { signIn, signUp } from "../../controller/users";

const publicRoutes = Router();

publicRoutes.post("/signin", async (req, res) => {
  const result = await signIn(req.body);
  return res.json(result);
});

publicRoutes.post("/signup", async (req, res) => {
  const result = await signUp(req.body);
  return res.json(result);
});

export default publicRoutes;
