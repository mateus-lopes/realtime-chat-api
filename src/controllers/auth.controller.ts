import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../lib/utils.js";
import { User } from "../models/user.model.js";
import { IUser } from "../types/user.types.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, fullName, password } = req.body;

  try {
    if (!email || !fullName || !password) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }
    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
      return;
    }

    const existingUser = await User.findOne({ email }).lean<IUser>();
    if (existingUser) {
      res.status(409).json({ message: "Email already registered." });
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
      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        profilePicture: newUser.profilePicture,
      });
    } else {
      res.status(400).json({ message: "Invalid user data." });
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

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Credenciais inválidas." });
      return;
    }

    res.status(200).json({
      token: generateToken(user._id.toString(), res),
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno.";
    res.status(500).json({ message: errorMessage });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout realizado com sucesso." });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno.";
    res.status(500).json({ message: errorMessage });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;
    const { email, fullName, profilePicture } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { email, fullName, profilePicture },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado." });
      return;
    }

    res.status(200).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno.";
    res.status(500).json({ message: errorMessage });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { profilePicture, userId } = req.body;

    if (!profilePicture || !userId) {
      res.status(400).json({ message: "Dados inválidos." });
      return;
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePicture);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno.";
    res.status(500).json({ message: errorMessage });
  }
};

export const checkAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno.";
    res.status(500).json({ message: errorMessage });
  }
};
