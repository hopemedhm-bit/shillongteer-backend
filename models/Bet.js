const mongoose = require("mongoose");

const BetSchema = new mongoose.Schema({
    userId: { type: String, required: true },     // user mobile or _id
    bets: [
        {
            number: { type: String, required: true },
            amount: { type: Number, required: true },
            type: { type: String, required: true }     // single, house, ending
        }
    ],
    total_amount: { type: Number, required: true },
    round: { type: String, required: true },          // "round1" or "round2"
    date: { type: String, required: true }            // YYYY-MM-DD
}, { timestamps: true });

module.exports = mongoose.model("Bet", BetSchema);
