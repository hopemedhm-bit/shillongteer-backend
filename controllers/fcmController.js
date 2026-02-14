const User = require("../models/User");

//
// ========================
// SAVE / UPDATE FCM TOKEN
// ========================
//
exports.saveFcmToken = async (req, res) => {
    try {
        const { mobile, fcmToken } = req.body;

        if (!mobile || !fcmToken) {
            return res.json({
                success: false,
                message: "Mobile and FCM token are required",
                data: null
            });
        }

        const updatedUser = await User.findOneAndUpdate(
            { mobile: mobile },
            { fcmToken: fcmToken },
            { new: true }
        );

        if (!updatedUser) {
            return res.json({
                success: false,
                message: "User not found",
                data: null
            });
        }

        console.log("FCM token saved for:", mobile);

        return res.json({
            success: true,
            message: "FCM token saved successfully",
            data: null
        });

    } catch (err) {
        console.log("Save FCM error:", err);
        return res.json({
            success: false,
            message: err.message,
            data: null
        });
    }
};

