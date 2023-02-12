import { verify } from "./authService";
import { RequestHandler } from "express";
import { generateNonce } from "siwe";

export const GETNonce: RequestHandler = (req, res, next) => {
  res.status(200).json(generateNonce());
};

export const POSTVerify: RequestHandler = async (req, res, next) => {
  const result = await verify(req.body);
  if (!result) {
    res.sendStatus(400);
    return;
  }
  res.status(200).json(result);
};
