import express, { Router } from "express";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";
import { protectGuard } from "../middleware/auth.middleware.js";

const router: Router = express.Router();

router.get("/users", protectGuard, getUsersForSidebar);
router.get("/:id", protectGuard, getMessages);
router.post("/send/:id", protectGuard, sendMessage);

export { router };
