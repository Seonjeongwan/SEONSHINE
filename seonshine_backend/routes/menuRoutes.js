import express from "express";
import { upload } from "../config/storage.js";
import { createMenuItem, getMenuList } from "../controllers/menuController.js";
import { authenticateToken } from "../middleware/auth.js";
import { endpoints } from "./endpoints.js";

const menuRoutes = express.Router();

menuRoutes.get(endpoints.menu.list, authenticateToken(), getMenuList);
menuRoutes.post(
  endpoints.menu.createItem,
  authenticateToken(),
  upload.single("file"),
  createMenuItem
);

export default menuRoutes;
