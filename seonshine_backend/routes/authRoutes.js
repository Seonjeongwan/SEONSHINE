import express from 'express';
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/request-code", authController.requestCode);
router.post("/verify-code", authController.verifyCode);

export default router;
