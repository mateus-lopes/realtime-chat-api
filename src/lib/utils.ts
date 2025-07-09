import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateTokens = (
  userId: string,
  res: Response
): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.cookie("jwt", accessToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return { accessToken, refreshToken: accessToken };
};
