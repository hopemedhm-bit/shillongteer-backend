const express = require("express");
const router = express.Router();

const {
    createPayment,
    checkStatus,
    submitUtr,
    adminApprovePayment
} = require("../controllers/paymentController");


// ================= USER ROUTES =================

// 1️⃣ Generate QR
router.post("/create", createPayment);

// 2️⃣ Submit UTR
router.post("/submit-utr", submitUtr);

// 3️⃣ Check Status
router.get("/status/:orderId", checkStatus);


// ================= ADMIN ROUTE =================

// 4️⃣ Admin approve payment
router.patch("/admin/approve", adminApprovePayment);


module.exports = router;
