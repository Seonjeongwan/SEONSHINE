import express from "express";
import {
  discardCurrentOrderItem,
  getCurrentOrder,
  getOrderListDetail,
  getOrderListSummary,
  getOrderPeriod,
  orderItemCurrentDay,
} from "../controllers/orderController.js";
import { authenticateToken } from "../middleware/auth.js";
import { endpoints } from "./endpoints.js";

const orderRoute = express.Router();

orderRoute.post(
  endpoints.order.orderItemCurrentDay,
  // authenticateToken({ role: UserRole.user }),
  authenticateToken(),
  orderItemCurrentDay
);

orderRoute.post(
  endpoints.order.discardCurrentOrder,
  authenticateToken(),
  discardCurrentOrderItem
);

orderRoute.get(
  endpoints.order.getOrderPeriod,
  authenticateToken(),
  getOrderPeriod
);

orderRoute.get(
  endpoints.order.getOrderListSummary,
  authenticateToken(),
  getOrderListSummary
);

orderRoute.get(
  endpoints.order.getOrderListDetail,
  authenticateToken(),
  getOrderListDetail
);

orderRoute.get(
  endpoints.order.getCurrentOrder,
  authenticateToken(),
  getCurrentOrder
);

export default orderRoute;
