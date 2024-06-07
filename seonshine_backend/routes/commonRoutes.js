const express = require("express");
const router = express.Router();
const commonController = require("../controllers/commonController");

router.post("/add-branch", commonController.addBranch);
router.get("/get-branch", commonController.getBranch);

module.exports = router;
