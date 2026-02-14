const Bet = require("../models/Bet");
const User = require("../models/User");
const LimitItem = require("../models/LimitItem");
const admin = require("firebase-admin");


//
// ========================
// USER (ANDROID) — SUBMIT BET
// ========================
//
exports.submitBet = async (req, res) => {
    try {
        const { userId, bets, total_amount, round } = req.body;

        if (!userId || !bets || !Array.isArray(bets) || bets.length === 0) {
            return res.json({
                success: false,
                message: "Invalid bet request",
                data: null
            });
        }

        const date = new Date().toISOString().split("T")[0];

        // ============================================
        // 1️⃣ VALIDATE REMAINING BEFORE SAVING
        // ============================================
        for (const bet of bets) {

            const limit = await LimitItem.findOne({ label: bet.number });

            if (!limit) {
                return res.json({
                    success: false,
                    message: `Limit not found for ${bet.number}`,
                    data: null
                });
            }

            let requiredAmount = bet.amount;

            if (bet.type === "house" || bet.type === "ending") {
                requiredAmount = bet.amount * 10;
            }

            if (limit.remaining < requiredAmount) {
                return res.json({
                    success: false,
                    message: `${bet.number} is full or insufficient remaining`,
                    data: null
                });
            }
        }

        // ============================================
        // 2️⃣ SAVE BET
        // ============================================
        const saved = await Bet.create({
            userId,
            bets,
            total_amount,
            round,
            date
        });

        // ============================================
        // 3️⃣ DECREASE REMAINING
        // ============================================
        for (const bet of bets) {

            let decrementAmount = bet.amount;

            if (bet.type === "house" || bet.type === "ending") {
                decrementAmount = bet.amount * 10;
            }

            await LimitItem.updateOne(
                { label: bet.number },
                { $inc: { remaining: -decrementAmount } }
            );
        }

        // ============================================
        // 4️⃣ SEND PUSH NOTIFICATION
        // ============================================
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
