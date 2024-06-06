const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/sign_up", userController.signUp);
router.post("/login", userController.login);
router.post("/check_id_email", userController.checkIdEmail);
router.post("/confirm_signin", userController.confirmSignin);

module.exports = router;
