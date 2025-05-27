import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Request, Response, NextFunction } from "express";

export const protectGuard = async (req: any, res: any, next: NextFunction) => {
  try {
    const token = req.cookies?.jwt;

    if (!token)
      return res.status(401).json({ message: "Unauthorized access." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (!decoded || typeof decoded !== "object" || !decoded.userId) {
      return res.status(401).json({ message: "Invalid token." });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found." });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};
