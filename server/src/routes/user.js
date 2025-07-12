import express from "express";
import * as userController from "../controller/user.js";
import { upload } from "../middleware/upload.js";
import { AuthCheck } from "../middleware/auth.js";

const router = express.Router();

router.put(
  "/profile",
  AuthCheck,
  upload.single("profile"),
  userController.updateProfile
);

export default router;
