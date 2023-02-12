import { requireToken } from "./../../middleware/authMiddleware";
import { Router } from "express";
import { GETBets, POSTBets } from "./betController";

const router = Router();

router.get("/", requireToken, GETBets);
router.post("/", requireToken, POSTBets);

export default router;
