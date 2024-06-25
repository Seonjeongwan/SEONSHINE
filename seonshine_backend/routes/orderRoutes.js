import express from "express";
import { getOrderPeriod, orderItemCurrentDay } from "../controllers/orderController.js";
import { authenticateToken } from "../middleware/auth.js";
import { endpoints } from "./endpoints.js";

const orderRoute = express.Router();

orderRoute.post(
  endpoints.order.orderItemCurrentDay,
  // authenticateToken({ role: UserRole.user }),
  authenticateToken(),
  orderItemCurrentDay
);

orderRoute.get(
  endpoints.order.getOrderPeriod,
  authenticateToken(),
  getOrderPeriod
);

export default orderRoute;
