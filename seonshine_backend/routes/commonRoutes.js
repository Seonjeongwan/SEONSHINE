
import express from 'express';
import { addBranch, getAllBranch, getBranchById } from '../controllers/commonController.js';

const commonRouter = express.Router();

commonRouter.post("/branches", addBranch);
commonRouter.get("/branches", getAllBranch);
commonRouter.get("/branches/:id", getBranchById);

export default commonRouter;