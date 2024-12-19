"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkModel = exports.ContentModel = exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
mongoose_2.default.connect("mongodb+srv://admin:01MgMsbNB9AjA3A6@cluster0.y297w.mongodb.net/second-brain");
const UserSchema = new mongoose_1.Schema({
    username: { type: String, unique: true },
    password: String,
});
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
const ContentSchema = new mongoose_1.Schema({
    link: String,
    type: String,
    title: String,
    tags: [{ type: mongoose_2.default.Types.ObjectId, ref: "Tag" }],
    userId: [{ type: mongoose_2.default.Types.ObjectId, ref: "User" }],
});
exports.ContentModel = (0, mongoose_1.model)("Content", ContentSchema);
const LinkSchema = new mongoose_1.Schema({
    hash: String,
    userId: [
        {
            type: mongoose_2.default.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
    ],
});
exports.LinkModel = (0, mongoose_1.model)("Link", LinkSchema);
