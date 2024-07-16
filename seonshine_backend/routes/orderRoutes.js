import express from "express";
import {
  discardCurrentOrderItem,
  getCurrentOrder,
  getOrderHistory,
  getOrderListDetail,
  getOrderListSummary,
  getOrderPeriod,
  orderItemCurrentDay,
} from "../controllers/orderController.js";
import { authenticateToken } from "../middleware/auth.js";
import {
  validateOrderHistory,
  validateOrderList,
} from "../middleware/validation/orderValidate.js";
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
  validateOrderList,
  getOrderListSummary
);

orderRoute.get(
  endpoints.order.getOrderListDetail,
  authenticateToken(),
  validateOrderList,
  getOrderListDetail
);

orderRoute.get(
  endpoints.order.getCurrentOrder,
  authenticateToken(),
  getCurrentOrder
);

orderRoute.get(
  endpoints.order.getOrderHistoryList,
  authenticateToken(),
  validateOrderHistory,
  getOrderHistory
);

export default orderRoute;
