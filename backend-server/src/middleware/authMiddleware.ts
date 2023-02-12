import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = (address: string) => {
  return jwt.sign(address, process.env.JWT_SECRET as string);
};

export const requireToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.sendStatus(401);
    return;
  }
  jwt.verify(authHeader, process.env.JWT_SECRET as string, (err, payload) => {
    if (err || !payload) {
      res.sendStatus(403);
      return;
    }
    req.ethereumAddress = payload.toString();
    next();
  });
};
