import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES } from "../lib/constants.js";

interface AuthRequest extends Request {
  user?: any;
}

export const protectGuard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = req.cookies?.jwt;

    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      } else {
        token = authHeader;
      }
    }

    if (!token) {
      res.status(401).json({
        message: ERROR_MESSAGES.TOKEN_MISSING,
        code: "TOKEN_MISSING",
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (!decoded || typeof decoded !== "object" || !decoded.userId) {
      res.status(401).json({
        message: ERROR_MESSAGES.TOKEN_INVALID,
        code: "TOKEN_INVALID",
      });
      return;
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(404).json({
        message: ERROR_MESSAGES.USER_NOT_FOUND,
        code: "USER_NOT_FOUND",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: ERROR_MESSAGES.TOKEN_EXPIRED,
        code: "TOKEN_EXPIRED",
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        message: ERROR_MESSAGES.TOKEN_INVALID,
        code: "TOKEN_INVALID",
      });
      return;
    }

    res.status(401).json({
      message: ERROR_MESSAGES.AUTH_FAILED,
      code: "AUTH_FAILED",
    });
    return;
  }
};
