const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    upiId: { type: String, required: true },
    qrString: { type: String, required: true },
    qrBase64: { type: String, required: true },
    status: { type: String, default: "PENDING" },  // PENDING / SUCCESS / FAILED
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", paymentSchema);
