import express from "express";
import { UserRole } from "../constants/auth.js";
import {
  addBranch,
  getAllBranch,
  getBranchById,
  getCurrentProfile,
  getDashboardSummary,
  saveOrderPeriod,
} from "../controllers/commonController.js";
import { authenticateToken } from "../middleware/auth.js";
import { endpoints } from "./endpoints.js";
import { validateSaveOrderPeriod } from "../middleware/validation/commomValidate.js";

const commonRouter = express.Router();

commonRouter.post(
  endpoints.branches.add,
  authenticateToken({ role: UserRole.admin }),
  addBranch
);
commonRouter.get(endpoints.branches.getAll, getAllBranch);
commonRouter.get(endpoints.branches.getById, getBranchById);

commonRouter.get(endpoints.dashboard, authenticateToken(), getDashboardSummary);

commonRouter.get(
  endpoints.currentProfile,
  authenticateToken(),
  getCurrentProfile
);

commonRouter.post(
  endpoints.saveOrderPeriod,
  authenticateToken({ role: UserRole.admin }),
  validateSaveOrderPeriod,
  saveOrderPeriod
);

export default commonRouter;
