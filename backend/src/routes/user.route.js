import { Router } from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getAllUsers } from "../controller/user.controller.js";

const router = Router();

router.get("/", protectedRoute, getAllUsers);
//get messages between two users todo

export default router;
