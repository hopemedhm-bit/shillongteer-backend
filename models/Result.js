const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
    date: { type: String, required: true },        // Example: "2024-01-26"
    round1: { type: String, default: "-" },        // Example: "45"
    round2: { type: String, default: "-" },        // Example: "78"
}, { timestamps: true });

module.exports = mongoose.model("Result", ResultSchema);
