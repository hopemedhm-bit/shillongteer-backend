const mongoose = require("mongoose");

const BankSchema = new mongoose.Schema({
    userId: { type: String, required: true },          // user mobile or user _id
    bank_name: { type: String, required: true },
    account_no: { type: String, required: true },
    ifsc: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Bank", BankSchema);
