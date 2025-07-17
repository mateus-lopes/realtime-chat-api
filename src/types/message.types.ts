import mongoose from "mongoose";
export interface IMessage {
  _id?: string;
  senderId: {
    type: mongoose.Schema.Types.ObjectId;
    ref: "User";
    required: true;
  };
  receiverId: {
    type: mongoose.Schema.Types.ObjectId;
    ref: "User";
    required: true;
  };
  text?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
