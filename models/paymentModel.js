const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

    orderId: { 
        type: String, 
        required: true, 
        unique: true 
    },

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

    // 🔥 NEW: Store UTR submitted by user
    utr: {
        type: String,
        default: null
    },

    // 🔥 Updated status flow
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
