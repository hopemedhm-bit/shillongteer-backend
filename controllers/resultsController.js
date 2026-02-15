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
        let bodyParts = [];

        if (round1 !== undefined && round1 !== "") {
            bodyParts.push(`🎯 FR: ${round1}`);
        }

        if (round2 !== undefined && round2 !== "") {
            bodyParts.push(`🎯 SR: ${round2}`);
        }

        if (bodyParts.length > 0) {

            const body = bodyParts.join(" | ");

            // Get all users with valid FCM tokens
            const users = await User.find({
                fcmToken: { $ne: null }
            });

            const tokens = users.map(u => u.fcmToken).filter(Boolean);

            if (tokens.length > 0) {

                const chunkSize = 500;

                for (let i = 0; i < tokens.length; i += chunkSize) {

                    const chunk = tokens.slice(i, i + chunkSize);

                    const message = {
                        notification: {
                            title: title,
                            body: body
                        },
                        data: {
                            type: "RESULT_UPDATE",
                            round1: round1 || "",
                            round2: round2 || "",
                            date: today
                        },
                        tokens: chunk
                    };

                    try {
                        const response = await admin.messaging().sendEachForMulticast(message);

                        console.log("Push success:", response.successCount);

                        // Remove invalid tokens
                        response.responses.forEach(async (resp, idx) => {
                            if (!resp.success) {
                                const failedToken = chunk[idx];
                                await User.updateOne(
                                    { fcmToken: failedToken },
                                    { $set: { fcmToken: null } }
                                );
                                console.log("Removed invalid token:", failedToken);
                            }
                        });

                    } catch (pushError) {
                        console.log("Push error:", pushError.message);
                    }
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
