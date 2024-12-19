declare global {
  namespace Express {
    export interface Request {
      userId?: string;
    }
  }
}

import express from "express";
import { ContentModel, LinkModel, UserModel } from "./db";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";
import { userMiddleware } from "./middleware";
import { random } from "./utils";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    await UserModel.create({
      username: username,
      password: password,
    });
    res.status(200).json({ message: "User created successfully" });
  } catch (e) {
    res.status(411).json({ message: "User already exists" });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const existingUser = await UserModel.findOne({ username, password });

  if (existingUser) {
    const token = jwt.sign({ id: existingUser._id }, JWT_PASSWORD);
    res.json({ token });
  } else {
    res.status(403).json({ message: "Invalid credentials" });
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const link = req.body.link;
  const type = req.body.type;
  const title = req.body.title;

  await ContentModel.create({
    link,
    type,
    title,
    //@ts-ignore
    userId: req.userId,
    tags: [],
  });

  res.json({ message: "Content created successfully" });
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const content = await ContentModel.find({ userId: userId }).populate(
    "userId",
    "username" // gets only username of user instead of all details
  ); //populate is used to get all details of the userId field
  res.json({ content });
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;

  await ContentModel.deleteMany({
    contentId, //contentID is id of that specific content
    userId: req.userId, //  i can delete only my content not others, userId is user id
  });
  res.json({ message: "Content deleted successfully" });
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const share = req.body.share;

  if (share) {
    const existingLink = await LinkModel.findOne({
      userId: req.userId,
    });

    if (existingLink) {
      res.json({
        hash: existingLink.hash,
      });
      return;
    }

    const hash = random(10);
    await LinkModel.create({
      userId: req.userId,
      hash: hash,
    });

    res.json({ hash });
  } else {
    await LinkModel.deleteMany({
      userId: req.userId,
    });
    res.json({ message: "Link deleted successfully" });
  }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;

  const link = await LinkModel.findOne({ hash });

  if (!link) {
    res.status(404).json({ message: "Link not found" });
    return;
  }

  const content = await ContentModel.findOne({
    userId: link.userId,
  });

  const user = await UserModel.findOne({
    _id: link.userId,
  });

  if (!user) {
    res.status(411).json({
      message: "User not found",
    });
    return;
  }

  res.json({
    username: user.username,
    content: content,
  });
});
app.listen(3000);
