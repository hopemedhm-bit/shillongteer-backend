const express = require("express");
const router = express.Router();

const { saveFcmToken } = require("../controllers/fcmController");

// Android will call this
router.post("/save", saveFcmToken);

module.exports = router;
