const Bet = require("../models/Bet");
const User = require("../models/User");
const admin = require("firebase-admin");

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

        // ===========================
        // 🔥 SEND PUSH NOTIFICATION
        // ===========================
        try {
            const user = await User.findById(userId);

            if (user && user.fcmToken) {

                const message = {
                    token: user.fcmToken,
                    notification: {
                        title: "Bet Placed Successfully 🎯",
                        body: `Your bet of ₹${total_amount} has been placed for ${round} round.`
                    }
                };

                await admin.messaging().send(message);

                console.log("Push sent successfully to user:", userId);
            } else {
                console.log("No FCM token found for user:", userId);
            }

        } catch (pushError) {
            console.log("Push sending failed:", pushError.message);
        }

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
