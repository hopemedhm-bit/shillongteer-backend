const LimitItem = require("../models/LimitItem");
const User = require("../models/User");
const admin = require("firebase-admin");

//
// ========================
// USER → GET ALL LIMIT ITEMS
// ========================
exports.getLimits = async (req, res) => {
    try {
        const items = await LimitItem.find().sort({ label: 1 });

        return res.json({
            success: true,
            message: "Limits loaded",
            data: items
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
// ADMIN → UPDATE ONE LIMIT ITEM
// ========================
exports.updateLimit = async (req, res) => {
    try {
        const { label, min, max, remaining } = req.body;

        if (!label) {
            return res.json({
                success: false,
                message: "label is required",
                data: null
            });
        }

        const updated = await LimitItem.findOneAndUpdate(
            { label: label },
            { min, max, remaining },
            { new: true }
        );

        if (!updated) {
            return res.json({
                success: false,
                message: "Limit item not found",
                data: null
            });
        }

        // =====================================
        // 🔥 SEND PUSH IF REMAINING < 100
        // =====================================

        if (remaining !== undefined && remaining < 100) {

            const users = await User.find({
                fcmToken: { $ne: null }
            });

            const tokens = users.map(u => u.fcmToken);

            if (tokens.length > 0) {

                const message = {
                    notification: {
                        title: "⚡ Hurry Up!",
                        body: `${label} is filling very fast! Only ${remaining} left`
                    },
                    tokens: tokens
                };

                try {
                    const response = await admin.messaging().sendEachForMulticast(message);
                    console.log("Limit push sent:", response.successCount);
                } catch (pushError) {
                    console.log("Limit push error:", pushError.message);
                }
            }
        }

        return res.json({
            success: true,
            message: "Limit updated successfully",
            data: updated
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message,
            data: null
        });
    }
};
