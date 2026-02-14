const express = require("express");
const router = express.Router();

const {
    createPayment,
    checkStatus,
    updateStatus,
    submitUtr,
    adminApprovePayment
} = require("../controllers/paymentController");


// ============================================================
// USER ROUTES
// ============================================================

// 1️⃣ Generate QR
router.post("/create", createPayment);

// 2️⃣ Submit UTR after payment
router.post("/submit-utr", submitUtr);

// 3️⃣ Check payment status (App polling)
router.get("/status/:orderId", checkStatus);


// ============================================================
// SYSTEM / WEBHOOK ROUTE
// ============================================================

// 4️⃣ Secure webhook (optional gateway usage)
router.post("/webhook", updateStatus);


// ============================================================
// ADMIN ROUTE (Manual Verification)
// ============================================================

// 5️⃣ Admin approve payment
router.patch("/admin/approve", adminApprovePayment);


module.exports = router;
