const mongoose = require("mongoose");

const LimitItemSchema = new mongoose.Schema({
    label: { type: String, required: true },     // "01", "house_3", "ending_7"
    min: { type: Number, required: true },       // min bet allowed
    max: { type: Number, required: true },       // max bet allowed
    remaining: { type: Number, required: true }  // remaining limit
}, { timestamps: true });

module.exports = mongoose.model("LimitItem", LimitItemSchema);
