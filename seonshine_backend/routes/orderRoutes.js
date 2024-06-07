const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/order_history", orderController.orderHistory);
router.post("/order_menu", orderController.orderMenu);

module.exports = router;
