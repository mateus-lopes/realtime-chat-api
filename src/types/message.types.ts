import mongoose from "mongoose";

export type IMessage = {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  content?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
