const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

const {
    getLimits,      // Android → fetch limit items
    updateLimit     // Admin → update one limit item
} = require("../controllers/limitsController");

// USER (Android)
router.get("/", getLimits);

// ADMIN
router.post("/update", adminAuth, updateLimit);

module.exports = router;

