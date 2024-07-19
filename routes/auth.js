import express from "express";
import { login, register, getProfile } from "../controllers/authController.js";
import { verifyUser,  } from "../utils/verifyToken.js";
const router = express.Router()

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyUser, getProfile);

export default router;
