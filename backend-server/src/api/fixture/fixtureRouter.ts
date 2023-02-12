import { GETList } from "./fixtureController";
import { Router } from "express";

const router = Router();

router.get("/", GETList);

export default router;
