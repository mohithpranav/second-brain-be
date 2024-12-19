"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
//if someone has sent the token in the header, then we will decode it and set the userId in the request object
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const userMiddleware = (req, res, next) => {
    const token = req.headers["authorization"];
    const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_PASSWORD);
    if (decoded) {
        //decoded.id is string, so we are casting it to string to make it compatible with req.userId
        req.userId = decoded.id;
        next();
    }
    else {
        res.status(403).json({ message: "You are not authorized" });
    }
};
exports.userMiddleware = userMiddleware;
