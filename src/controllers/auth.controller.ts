import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateTokens } from "../lib/utils.js";
import { User } from "../models/user.model.js";
import { IUser } from "../types/user.types.js";
import cloudinary from "../lib/cloudinary.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../lib/constants.js";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, fullName, password } = req.body;

  try {
    if (!email || !fullName || !password) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: ERROR_MESSAGES.REQUIRED_FIELDS });
      return;
    }
    if (password.length < 6) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: ERROR_MESSAGES.PASSWORD_MIN_LENGTH });
      return;
    }

    const existingUser = await User.findOne({ email }).lean<IUser>();
    if (existingUser) {
      res
        .status(HTTP_STATUS.CONFLICT)
        .json({ message: ERROR_MESSAGES.EMAIL_ALREADY_EXISTS });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
    });

    const { accessToken } = generateTokens(newUser._id.toString(), res);
    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      fullName: newUser.fullName,
      profilePicture: newUser.profilePicture,
      accessToken,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    res.status(500).json({ message: errorMessage });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(401).json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(),
      res
    );

    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    res.status(500).json({ message: errorMessage });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    res.status(500).json({ message: errorMessage });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user._id) {
      res.status(401).json({ message: ERROR_MESSAGES.USER_NOT_AUTHENTICATED });
      return;
    }

    const { fullName, about, profilePicture, isOnline } = req.body;
    const updateData: Partial<IUser> = {};

    if (fullName !== undefined) updateData.fullName = fullName;
    if (about !== undefined) updateData.about = about;
    if (isOnline !== undefined) updateData.isOnline = isOnline;

    if (profilePicture) {
      if (!profilePicture.startsWith("data:image/")) {
        res.status(400).json({ message: ERROR_MESSAGES.INVALID_IMAGE_FORMAT });
        return;
      }

      const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
        resource_type: "image",
        quality: "auto:good",
        width: 1000,
        height: 1000,
        crop: "limit",
      });

      updateData.profilePicture = uploadResponse.secure_url;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    }).select("-password");

    if (!user) {
      res.status(404).json({ message: ERROR_MESSAGES.USER_NOT_FOUND });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    res.status(500).json({ message: errorMessage });
  }
};

export const checkAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    res.status(500).json({ message: errorMessage });
  }
};
