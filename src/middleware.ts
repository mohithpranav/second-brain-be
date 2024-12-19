//if someone has sent the token in the header, then we will decode it and set the userId in the request object
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { JWT_PASSWORD } from "./config";

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];

  const decoded = jwt.verify(token as string, JWT_PASSWORD);
  if (decoded) {
    //decoded.id is string, so we are casting it to string to make it compatible with req.userId
    req.userId = (decoded as JwtPayload).id;
    next();
  } else {
    res.status(403).json({ message: "You are not authorized" });
  }
};
