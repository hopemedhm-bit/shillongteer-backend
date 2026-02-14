const router = require("express").Router();
const response = require("../utils/response");
const User = require("../models/User");

// ======================
// SEND OTP
// ======================
router.post("/send-otp", (req, res) => {
    const { mobile } = req.body;
    return res.json(response(true, "OTP sent", "123456"));
});

// ======================
// VERIFY OTP
// ======================
router.post("/verify-otp", async (req, res) => {
    try {
        const { mobile, otp } = req.body;

        if (otp !== "123456") {
            return res.json(response(false, "Invalid OTP"));
        }

        // 🔥 CREATE USER IF NOT EXISTS
        let user = await User.findOne({ mobile });

        if (!user) {
            user = await User.create({ mobile });
            console.log("New user created:", mobile);
        }

        return res.json(response(true, "Login success", {
            token: "dummy-jwt-token",
            mobile: mobile
        }));

    } catch (err) {
        return res.json(response(false, err.message));
    }
});

module.exports = router;
