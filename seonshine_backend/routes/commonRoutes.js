const express = require("express");
const router = express.Router();
const commonController = require("../controllers/commonController");

router.post("/add-branch", commonController.addBranch);

module.exports = router;
