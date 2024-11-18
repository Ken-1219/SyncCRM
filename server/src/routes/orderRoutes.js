import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/orderControllers.js";

const router = express.Router();

router.get("/", getOrders);

router.post("/createOrder", createOrder);

router.get("/:id", getOrderById);

router.put("/updateOrder/:id", updateOrder);

router.delete("/:id", deleteOrder);

export default router;
