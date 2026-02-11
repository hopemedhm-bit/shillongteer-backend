const express = require("express");
const router = express.Router();

const {
    createPayment,
    checkStatus,
    updateStatus
} = require("../controllers/paymentController");

// Generate Dynamic QR
router.post("/create", createPayment);

// Poll status
router.get("/status/:orderId", checkStatus);

// PSP webhook (optional)
router.post("/webhook", updateStatus);

module.exports = router;
