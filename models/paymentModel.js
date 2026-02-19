const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

    orderId: { 
        type: String, 
        required: true, 
        unique: true 
    },

    // 🔥 Original amount before discount
    originalAmount: {
        type: Number,
        required: true
    },

    // 🔥 Discount value applied (7%)
    discountAmount: {
        type: Number,
        default: 0
    },

    // 🔥 Final payable amount (QR amount)
    amount: { 
        type: Number, 
        required: true 
    },

    upiId: { 
        type: String, 
        required: true 
    },

    qrString: { 
        type: String, 
        required: true 
    },

    qrBase64: { 
        type: String, 
        required: true 
    },

    // UTR submitted by user
    utr: {
        type: String,
        default: null
    },

    status: {
        type: String,
        enum: ["PENDING", "UNDER_REVIEW", "SUCCESS", "FAILED"],
        default: "PENDING"
    },

    createdAt: { 
        type: Date, 
        default: Date.now 
    }

});

module.exports = mongoose.model("Payment", paymentSchema);
