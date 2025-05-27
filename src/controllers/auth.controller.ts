import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../lib/utils";
import { User } from "../models/user.model";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, fullName, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "Email already registered." });
      return;
    }
    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id.toString(), res);
      await newUser.save();
      res.status(201).json({ message: "Usuário criado com sucesso." });
    } else {
      res.status(500).json({ message: "Erro interno." });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno.";
    res.status(500).json({ message: errorMessage });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Credenciais inválidas." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Credenciais inválidas." });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno.";
    res.status(500).json({ message: errorMessage });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  // logout é feito no front-end
  res.status(200).json({ message: "Logout realizado com sucesso." });
};
