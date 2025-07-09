import mongoose, { Document, Model } from "mongoose";
import { IUser } from "../types/user.types.js";

type UserDocument = IUser & Document;

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    profilePicture: { type: String, default: "" },
    about: { type: String, default: "" },
  },
  { timestamps: true }
);

export const User: Model<UserDocument> = mongoose.model("User", userSchema);
