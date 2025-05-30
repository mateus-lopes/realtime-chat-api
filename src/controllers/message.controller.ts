import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSidebar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const loggedInUserId = req.user?._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password -__v");

    res.status(200).json(filteredUsers);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno.";
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
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno.";
    res.status(500).json({ message: errorMessage });
  }
};

export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { text, image } = req.body;
    const { id: userToChatId } = req.params;
    const myId = req.user?._id;

    let imageUrl: string | undefined;

    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId: myId,
      receiverId: userToChatId,
      content: text,
      image: imageUrl,
    });

    await newMessage.save();

    // todo: realtime functionality goes here => socket.io

    res.status(201).json(newMessage);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro interno.";
    res.status(500).json({ message: errorMessage });
  }
};
