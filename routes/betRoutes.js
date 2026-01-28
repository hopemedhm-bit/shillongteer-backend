const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

const {
    submitBet,       // user submit bet
    getUserHistory,  // user history
    getAllBets       // admin get all bets
} = require("../controllers/betController");


// =============================
// USER ROUTES (Android App)
// =============================

// SUBMIT BET
router.post("/submit", submitBet);

// USER HISTORY
// /bets/history?userId=123&filter=today/week/all
router.get("/history", getUserHistory);


// =============================
// ADMIN ROUTES (Admin Panel)
// =============================

// GET all bets (Admin only)
router.get("/all", adminAuth, getAllBets);


module.exports = router;
