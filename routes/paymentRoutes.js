const express = require("express");
const router = express.Router();

const {
    createPayment,
    checkStatus,
    updateStatus
} = require("../controllers/paymentController");


// ============================================================
// 1️⃣ Create Dynamic QR (Android → Backend)
// ============================================================
router.post("/create", createPayment);


// ============================================================
// 2️⃣ Check Payment Status (Android Polling)
// ============================================================
router.get("/status/:orderId", checkStatus);


// ============================================================
// 3️⃣ PSP / Manual Status Update Webhook (Optional Admin Tool)
// ============================================================
router.post("/webhook", updateStatus);


module.exports = router;
