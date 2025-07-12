import express from "express";
import * as itemController from "../controller/items.js";
import { upload } from "../middleware/upload.js";
import { AuthCheck } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/create",
  AuthCheck,
  upload.single("image"),
  itemController.createItem
);

router.get("/", AuthCheck, itemController.getAllItems);
router.get("/:id", AuthCheck, itemController.getCurrentItem);

export default router;
