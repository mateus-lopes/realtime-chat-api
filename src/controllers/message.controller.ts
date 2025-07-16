import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { IMessage } from "../types/message.types.js";
import cloudinary from "../lib/cloudinary.js";
import { ERROR_MESSAGES, HTTP_STATUS } from "../lib/constants.js";
import { Message } from "../models/message.model.js";

export const getUsersForSidebar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const loggedInUserId = req.user?._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    res.status(500).json({ message: errorMessage });
  }
};

export const getMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user?._id;
    const messages = await Message.find({
      $or: [
        { sender: myId, receiverId: userToChatId },
        { sender: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    res.status(500).json({ message: errorMessage });
  }
};

export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user?._id;
    const { text, image } = req.body as IMessage;

    if (!receiverId || !senderId) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: ERROR_MESSAGES.REQUIRED_FIELDS,
      });
      return;
    }

    let imageUrl: string | undefined;
    if (image) {
        // Upload base64 image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: "messages",
      });
      imageUrl = uploadResult.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
    res.status(500).json({ message: errorMessage });
  }
};
