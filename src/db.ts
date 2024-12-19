import { model, Schema } from "mongoose";
import mongoose from "mongoose";

mongoose.connect(
  "mongodb+srv://admin:01MgMsbNB9AjA3A6@cluster0.y297w.mongodb.net/second-brain"
);

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
});

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
  link: String,
  type: String,
  title: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

export const ContentModel = model("Content", ContentSchema);

const LinkSchema = new Schema({
  hash: String,
  userId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  ],
});

export const LinkModel = model("Link", LinkSchema);
