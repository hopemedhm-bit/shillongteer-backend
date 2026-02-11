const QRCode = require("qrcode");
const Payment = require("../models/paymentModel");
const { v4: uuidv4 } = require("uuid");

// Your merchant UPI ID
const MERCHANT_UPI = "6000120935@okbizaxis";

exports.createPayment = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ success: false, message: "Amount is required" });
        }

        // Generate unique order ID
        const orderId = "ORD" + uuidv4().replace(/-/g, "").slice(0, 12);

        // UPI payment string (Dynamic QR)
        const upiString = `upi://pay?pa=${MERCHANT_UPI}&pn=TeerApp&am=${amount}&cu=INR&tn=${orderId}`;

        // Generate QR as Base64
        const qrBase64 = await QRCode.toDataURL(upiString);

        // Save transaction in DB
        await Payment.create({
            orderId,
            amount,
            upiId: MERCHANT_UPI,
            qrString: upiString,
            qrBase64,
        });

        return res.json({
            success: true,
            orderId,
            amount,
            qrBase64,
            upiString
        });

    } catch (err) {
        console.error("QR Create Error:", err);
        res.status(500).json({ success: false, message: "Server error creating QR" });
    }
};

// Android polls this
exports.checkStatus = async (req, res) => {
    try {
        const { orderId } = req.params;

        const payment = await Payment.findOne({ orderId });

        if (!payment) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        return res.json({
            success: true,
            status: payment.status
        });

    } catch (err) {
        console.error("Status Error:", err);
        res.status(500).json({ success: false, message: "Server error checking status" });
    }
};

// PSP webhook (optional)
exports.updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        await Payment.findOneAndUpdate(
            { orderId },
            { status: status || "SUCCESS" }
        );

        return res.json({ success: true });

    } catch (err) {
        console.error("Webhook Error:", err);
        res.status(500).json({ success: false });
    }
};
