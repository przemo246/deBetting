import { RequestHandler } from "express";
import { list } from "./fixtureService";

export const GETList: RequestHandler = async (req, res, next) => {
  const result = await list(Number(req.query["leagueId"]) || undefined);
  res.status(200).json(result);
};
