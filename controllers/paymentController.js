const QRCode = require("qrcode");
const Payment = require("../models/paymentModel");
const { v4: uuidv4 } = require("uuid");

// ⭐ Your merchant UPI ID
const MERCHANT_UPI = "6000120935@okbizaxis";

// ⭐ Clean merchant display name
const MERCHANT_NAME = "TeerApp";


// ============================================================
// 1️⃣ CREATE PAYMENT (Generate Dynamic QR)
// ============================================================
exports.createPayment = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({
                success: false,
                message: "Amount is required",
            });
        }

        // Generate unique order ID
        const orderId = "ORD" + uuidv4().replace(/-/g, "").slice(0, 12);

        // Construct secure UPI string
        const upiString =
            `upi://pay?pa=${MERCHANT_UPI}` +
            `&pn=${encodeURIComponent(MERCHANT_NAME)}` +
            `&am=${amount}` +
            `&cu=INR` +
            `&tn=${orderId}`;

        // Create QR (Base64)
        const qrBase64 = await QRCode.toDataURL(upiString);

        // Save in DB - ⭐ ALWAYS PENDING
        await Payment.create({
            orderId,
            amount,
            upiId: MERCHANT_UPI,
            qrString: upiString,
            qrBase64,
            status: "PENDING",
        });

        return res.json({
            success: true,
            orderId,
            amount,
            qrBase64,
            upiString,
        });

    } catch (err) {
        console.error("QR Create Error:", err);
        res.status(500).json({
            success: false,
            message: "Server error creating QR",
        });
    }
};


// ============================================================
// 2️⃣ CHECK PAYMENT STATUS (Android Polling)
// ============================================================
exports.checkStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        const payment = await Payment.findOne({ orderId });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        return res.json({
            success: true,
            status: payment.status,   // PENDING / SUCCESS / FAILED
        });

    } catch (err) {
        console.error("Status Error:", err);
        res.status(500).json({
            success: false,
            message: "Server error checking status",
        });
    }
};


// ============================================================
// 3️⃣ MANUAL / PSP WEBHOOK PAYMENT UPDATE
// ============================================================
exports.updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const allowed = ["PENDING", "SUCCESS", "FAILED"];

        const finalStatus = allowed.includes(status)
            ? status
            : "SUCCESS";

        await Payment.findOneAndUpdate(
            { orderId },
            { status: finalStatus }
        );

        return res.json({ success: true });

    } catch (err) {
        console.error("Webhook Error:", err);
        res.status(500).json({ success: false });
    }
};
