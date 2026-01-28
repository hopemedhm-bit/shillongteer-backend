const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

const {
    getTodayResult,   // Android → today's result
    getOldResults,    // Android → previous results
    updateResult      // Admin → update result
} = require("../controllers/resultsController");


// =============================
// USER ROUTES (Android App)
// =============================

// GET today's result (public)
router.get("/today", getTodayResult);

// GET old results (public)
router.get("/old", getOldResults);


// =============================
// ADMIN ROUTE (Admin panel)
// =============================

// UPDATE result (admin only)
router.post("/update", adminAuth, updateResult);


module.exports = router;
