import express from "express";
import { upload } from "../config/storage.js";
import {
  createMenuItem,
  deleteMenuItem,
  getMenuList,
  getMenuListByCurrentDay,
  updateMenuItem,
} from "../controllers/menuController.js";
import { authenticateToken } from "../middleware/auth.js";
import { endpoints } from "./endpoints.js";
import { validateCreateMenuItem, validateUpdateMenuItem } from "../middleware/validation/menuValidate.js";

const menuRoutes = express.Router();

menuRoutes.get(endpoints.menu.list, authenticateToken(), getMenuList);

menuRoutes.post(
  endpoints.menu.createItem,
  authenticateToken(),
  upload.single("file"),
  validateCreateMenuItem,
  createMenuItem
);

menuRoutes.put(
  endpoints.menu.edit,
  authenticateToken(),
  upload.single("file"),
  validateUpdateMenuItem,
  updateMenuItem
);

menuRoutes.delete(endpoints.menu.delete, authenticateToken(), deleteMenuItem);

menuRoutes.get(endpoints.menu.currentDayList, authenticateToken(), getMenuListByCurrentDay)

export default menuRoutes;
