import mongoose, { Document, Model } from "mongoose";
import { IMessage } from "../types/message.types.js";

type MessageDocument = IMessage & Document;

const messageSchema = new mongoose.Schema<MessageDocument>(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Message: Model<MessageDocument> = mongoose.model(
  "Message",
  messageSchema
);
