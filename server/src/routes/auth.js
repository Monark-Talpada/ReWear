import express from "express";
import * as authController from "../controller/auth.js";
import { AuthCheck } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", AuthCheck, authController.getAuthUser);

export default router;
