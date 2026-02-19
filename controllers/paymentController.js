const QRCode = require("qrcode");
const Payment = require("../models/paymentModel");
const { v4: uuidv4 } = require("uuid");

// ⭐ Merchant Config
const MERCHANT_UPI = "6000120935@okbizaxis";
const MERCHANT_NAME = "TeerApp";

// 🔥 FIXED DISCOUNT %
const DISCOUNT_PERCENT = 7;

// ============================================================
// 1️⃣ CREATE PAYMENT (Generate Dynamic QR with 7% Discount)
// ============================================================

exports.createPayment = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment amount"
            });
        }

        const originalAmount = Number(amount);

        // 🔥 Calculate 7% Discount
        const discountAmount = Math.floor(
            (originalAmount * DISCOUNT_PERCENT) / 100
        );

        const finalAmount = originalAmount - discountAmount;

        const numericAmount = finalAmount.toFixed(2);

        const orderId =
            "ORD" + uuidv4().replace(/-/g, "").slice(0, 12);

        const upiString =
            `upi://pay?pa=${MERCHANT_UPI}` +
            `&pn=${encodeURIComponent(MERCHANT_NAME)}` +
            `&am=${numericAmount}` +
            `&cu=INR` +
            `&tn=${orderId}`;

        const qrBase64 = await QRCode.toDataURL(upiString);

        await Payment.create({
            orderId,
            originalAmount,
            discountAmount,
            amount: numericAmount, // final payable
            upiId: MERCHANT_UPI,
            qrString: upiString,
            qrBase64,
            status: "PENDING",
            utr: null
        });

        return res.json({
            success: true,
            orderId,
            originalAmount,
            discountAmount,
            finalAmount: numericAmount,
            qrBase64
        });

    } catch (err) {
        console.error("CREATE PAYMENT ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Server error while creating payment"
        });
    }
};


// ============================================================
// 2️⃣ SUBMIT UTR (User submits transaction reference)
// ============================================================

exports.submitUtr = async (req, res) => {
    try {
        const { orderId, utr } = req.body;

        if (!orderId || !utr) {
            return res.status(400).json({
                success: false,
                message: "Order ID and UTR required"
            });
        }

        const payment = await Payment.findOne({ orderId });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (payment.status === "SUCCESS") {
            return res.json({
                success: true,
                status: "SUCCESS"
            });
        }

        payment.utr = utr;
        payment.status = "UNDER_REVIEW";
        await payment.save();

        return res.json({
            success: true,
            status: "UNDER_REVIEW"
        });

    } catch (err) {
        console.error("SUBMIT UTR ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Server error submitting UTR"
        });
    }
};


// ============================================================
// 3️⃣ CHECK PAYMENT STATUS (Android Polling)
// ============================================================

exports.checkStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID required"
            });
        }

        const payment = await Payment.findOne({ orderId });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.json({
            success: true,
            status: payment.status
        });

    } catch (err) {
        console.error("CHECK STATUS ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Server error checking status"
        });
    }
};


// ============================================================
// 4️⃣ ADMIN APPROVE PAYMENT (Manual Verification)
// ============================================================

exports.adminApprovePayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID required"
            });
        }

        const payment = await Payment.findOne({ orderId });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        payment.status = "SUCCESS";
        await payment.save();

        return res.json({
            success: true,
            status: "SUCCESS"
        });

    } catch (err) {
        console.error("ADMIN APPROVE ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Server error approving payment"
        });
    }
};
