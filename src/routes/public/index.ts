import { Router } from "express";
import {
  requestToken,
  resetPassword,
  signIn,
  signUp,
} from "../../controller/users";

const publicRoutes = Router();

publicRoutes.post("/signin", async (req, res) => {
  const result = await signIn(req.body);
  return res.json(result);
});

publicRoutes.post("/signup", async (req, res) => {
  const result = await signUp(req.body);
  return res.json(result);
});

publicRoutes.post("/requestToken", async (req, res) => {
  const result = await requestToken(req.body.email);
  return res.json(result);
});

publicRoutes.post("/resetPassword", async (req, res) => {
  const result = await resetPassword(req.body.token, req.body.newPassword);
  return res.json(result);
});

export default publicRoutes;
