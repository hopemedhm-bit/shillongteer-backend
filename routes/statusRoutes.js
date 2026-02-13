const express = require("express");
const router = express.Router();

const { getServerTime } = require("../controllers/timeController");
const { getStatus } = require("../controllers/statusController");

router.get("/time", getServerTime);
router.get("/status", getStatus);

module.exports = router;
