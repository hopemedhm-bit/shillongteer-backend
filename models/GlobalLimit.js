const mongoose = require("mongoose");

const GlobalLimitSchema = new mongoose.Schema({
    min_bid: { type: Number, required: true },
    max_bid: { type: Number, required: true },

    max_single_number: { type: Number, required: true },
    max_house: { type: Number, required: true },
    max_ending: { type: Number, required: true },

    round1_open: { type: String, required: true },
    round1_close: { type: String, required: true },

    round2_open: { type: String, required: true },
    round2_close: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("GlobalLimit", GlobalLimitSchema);
