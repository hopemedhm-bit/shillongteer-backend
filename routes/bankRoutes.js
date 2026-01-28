const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

const {
    getBanks,       // User → get user's banks
    saveBank,       // User → save bank
    deleteBank,     // User → delete bank
    getAllBanks     // Admin → get all banks
} = require("../controllers/bankController");


// =============================
// USER ROUTES (Android App)
// =============================

// GET banks of a user
router.get("/", getBanks);

// SAVE bank (user)
router.post("/save", saveBank);

// DELETE bank (user)
router.post("/delete", deleteBank);


// =============================
// ADMIN ROUTE (Admin Panel)
// =============================

// GET all banks (Admin only)
router.get("/all", adminAuth, getAllBanks);


module.exports = router;
