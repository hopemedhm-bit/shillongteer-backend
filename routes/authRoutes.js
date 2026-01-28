const router = require("express").Router();
const response = require("../utils/response");

router.post("/send-otp", (req, res) => {
    const { mobile } = req.body;
    return res.json(response(true, "OTP sent", "123456"));
});

router.post("/verify-otp", (req, res) => {
    const { mobile, otp } = req.body;

    if (otp !== "123456") {
        return res.json(response(false, "Invalid OTP"));
    }

    return res.json(response(true, "Login success", {
        token: "dummy-jwt-token",
        mobile: mobile
    }));
});

module.exports = router;
