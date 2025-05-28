import express, { Router } from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectGuard } from "../middleware/auth.middleware.js";

const router: Router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.put("/update", protectGuard, updateProfile);
router.get("/me", protectGuard, checkAuth);

export { router };
