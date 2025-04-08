import express from "express";
import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/authMiddleware.js";
import {
getAllOrders,
updateOrderStatus,
} from "../controllers/orderController.js";

const router = express. Router();

router.get("/orders", authMiddleware, adminMiddleware, getAllOrders);
router.put("/order/update", authMiddleware, adminMiddleware, updateOrderStatus); 

export default router;
