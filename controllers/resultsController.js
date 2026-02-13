const Result = require("../models/Result");
const User = require("../models/User");
const admin = require("firebase-admin");

//
// =============================
// ANDROID — GET TODAY RESULT
// =============================
//
exports.getTodayResult = async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0];

        let result = await Result.findOne({ date: today });

        if (!result) {
            result = await Result.create({
                date: today,
                round1: "",
                round2: ""
            });
        }

        return res.json({
            success: true,
            message: "Today result loaded",
            data: result
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
// =============================
// ANDROID — GET OLD RESULTS
// =============================
//
exports.getOldResults = async (req, res) => {
    try {
        const filter = req.query.filter || "all";
        let results;

        if (filter === "today") {
            const today = new Date().toISOString().split("T")[0];
            results = await Result.find({ date: today });
        } else {
            results = await Result.find().sort({ date: -1 });
        }

        return res.json({
            success: true,
            message: "Old results loaded",
            data: results
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
// =============================
// ADMIN — UPDATE TODAY RESULT
// =============================
//
exports.updateResult = async (req, res) => {
    try {
        const { round1, round2 } = req.body;
        const today = new Date().toISOString().split("T")[0];

        let result = await Result.findOne({ date: today });

        if (!result) {
            result = await Result.create({
                date: today,
                round1: round1 || "",
                round2: round2 || ""
            });
        } else {
            if (round1 !== undefined) result.round1 = round1;
            if (round2 !== undefined) result.round2 = round2;
            await result.save();
        }

        // ==============================
        // 🔥 SEND PUSH NOTIFICATION
        // ==============================

        let title = "Shillong Teer Result 🎯";
        let body = "";

        if (round1 !== undefined) {
            body = `First Round Result: ${round1}`;
        }

        if (round2 !== undefined) {
            body = `Second Round Result: ${round2}`;
        }

        if (body !== "") {

            const users = await User.find({
                fcmToken: { $ne: null }
            });

            const tokens = users.map(u => u.fcmToken);

            if (tokens.length > 0) {

                const message = {
                    notification: {
                        title: title,
                        body: body
                    },
                    tokens: tokens
                };

                try {
                    const response = await admin.messaging().sendEachForMulticast(message);
                    console.log("Result push sent:", response.successCount);
                } catch (pushError) {
                    console.log("Result push error:", pushError.message);
                }
            }
        }

        return res.json({
            success: true,
            message: "Result updated successfully",
            data: result
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message,
            data: null
        });
    }
};
