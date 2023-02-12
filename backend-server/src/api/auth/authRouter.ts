import { Router } from "express";
import { GETNonce, POSTVerify } from "./authController";

const router = Router();

router.get("/nonce", GETNonce);
router.post("/verify", POSTVerify);

export default router;
