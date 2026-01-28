const Bet = require("../models/Bet");

//
// ========================
// USER (ANDROID) — SUBMIT BET
// ========================
//
exports.submitBet = async (req, res) => {
    try {
        const { userId, bets, total_amount, round } = req.body;

        // Store only YYYY-MM-DD
        const date = new Date().toISOString().split("T")[0];

        const saved = await Bet.create({
            userId,
            bets,
            total_amount,
            round,
            date
        });

        return res.json({
            success: true,
            message: "Bet submitted successfully",
            data: saved
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message,
            data: null
        });
    }
};

//
// ========================
// USER (ANDROID) — GET HISTORY
// ========================
//
exports.getUserHistory = async (req, res) => {
    try {
        const userId = req.query.userId;
        const filter = req.query.filter || "today";

        let query = { userId };

        if (filter === "today") {
            const today = new Date().toISOString().split("T")[0];
            query.date = today;
        }

        const history = await Bet.find(query).sort({ createdAt: -1 });

        return res.json({
            success: true,
            message: "History loaded",
            data: history
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message,
            data: null
        });
    }
};

//
// ========================
// ADMIN PANEL — GET ALL BETS
// ========================
//
exports.getAllBets = async (req, res) => {
    try {
        const bets = await Bet.find().sort({ _id: -1 });

        return res.json({
            success: true,
            message: "All bets loaded",
            data: bets
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message,
            data: null
        });
    }
};
