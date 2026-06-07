import { Router } from "express";
import { userModel } from "../../database/model/user.model.js";
import {
  changPassword,
  editUser,
  getLogOut,
  getUser,
  login,
  signUp,
} from "./user.service.js";
import { auth } from "../../common/middleware/auth.js";
const router = Router();
router.post("/sign-up", signUp);
router.post("/login", login);
router.get("/logout", async (req, res) => {
  const user = await getLogOut();
  res.status(200).json(user);
});
router.get("/get-profile", auth, async (req, res) => {
  const user = await getUser(req.user.id);
  res.status(200).json(user);
});
router.put("/edit-profile", auth, async (req, res) => {
  const editedUser = await editUser(req.user.id, req.body);
  res.status(200).json(editedUser);
});
router.put("/change-password", auth, async (req, res) => {
  const changedPassword = await changPassword(req.user.id, req.body);
  res.status(200).json(changedPassword);
});
export default router;
