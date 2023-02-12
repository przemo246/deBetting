import { RequestHandler } from "express";
import { createBet, getBets } from "./betService";

export const GETBets: RequestHandler = async (req, res, next) => {
  const result = await getBets(req.ethereumAddress);
  res.status(200).json(result);
};

export const POSTBets: RequestHandler = async (req, res, next) => {
  const result = await createBet({ ...req.body, address: req.ethereumAddress });
  res.status(200).json(result);
};
