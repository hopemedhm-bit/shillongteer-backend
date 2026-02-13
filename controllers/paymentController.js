const QRCode = require("qrcode");
const Payment = require("../models/paymentModel");
const { v4: uuidv4 } = require("uuid");

// ⭐ Merchant Config
const MERCHANT_UPI = "6000120935@okbizaxis";
const MERCHANT_NAME = "TeerApp";

// ============================================================
// 1️⃣ CREATE PAYMENT (Generate Dynamic QR)
// ============================================================

exports.createPayment = async (req, res) => {
    try {
        const { amount } = req.body;

        // ✅ Strict validation
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment amount"
            });
        }

        const numericAmount = Number(amount).toFixed(2);

        // Generate secure unique orderId
        const orderId = "ORD" + uuidv4().replace(/-/g, "").slice(0, 12);

        // Construct UPI string
        const upiString =
            `upi://pay?pa=${MERCHANT_UPI}` +
            `&pn=${encodeURIComponent(MERCHANT_NAME)}` +
            `&am=${numericAmount}` +
            `&cu=INR` +
            `&tn=${orderId}`;

        // Generate QR as Base64
        const qrBase64 = await QRCode.toDataURL(upiString);

        // Save payment as PENDING
        await Payment.create({
            orderId,
            amount: numericAmount,
            upiId: MERCHANT_UPI,
            qrString: upiString,
            qrBase64,
            status: "PENDING"
        });

        return res.json({
            success: true,
            orderId,
            amount: numericAmount,
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
// 2️⃣ CHECK PAYMENT STATUS (Android Polling)
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
// 3️⃣ SECURE WEBHOOK (Update Payment Status)
// ============================================================

exports.updateStatus = async (req, res) => {
    try {
        // ✅ Webhook secret verification
        const webhookSecret = req.headers["x-webhook-secret"];

        if (webhookSecret !== process.env.PAYMENT_WEBHOOK_SECRET) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized webhook"
            });
        }

        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({
                success: false,
                message: "Invalid webhook payload"
            });
        }

        const allowedStatuses = ["PENDING", "SUCCESS", "FAILED"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment status"
            });
        }

        const updated = await Payment.findOneAndUpdate(
            { orderId },
            { status },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.json({ success: true });

    } catch (err) {
        console.error("WEBHOOK ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Server error updating payment"
        });
    }
};
