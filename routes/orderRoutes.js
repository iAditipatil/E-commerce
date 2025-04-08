import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createOrder,
  verifyPayment,
  getUserOrders,
} from "../controllers/orderController.js";

const router = express. Router();

router.post("/create", authMiddleware, createOrder);
router.post("/verify", authMiddleware, verifyPayment);
router.get("/", authMiddleware, getUserOrders);

export default router;