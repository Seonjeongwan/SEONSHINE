import express from "express";
import { getMenuList } from "../controllers/menuController.js";
import { authenticateToken } from "../middleware/auth.js";
import { endpoints } from "./endpoints.js";

const menuRoutes = express.Router();

menuRoutes.get(endpoints.menu.list, authenticateToken(), getMenuList);

export default menuRoutes;
