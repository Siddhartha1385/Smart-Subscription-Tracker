import express from "express";
import { register, login } from "../controllers/authcontroller.js";

const router = express.Router();

// Matches POST /api/auth/register
router.post("/register", register);

// Matches POST /api/auth/login
router.post("/login", login);

export default router;