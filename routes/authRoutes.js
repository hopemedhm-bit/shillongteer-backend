const router = require("express").Router();
const response = require("../utils/response");
const User = require("../models/User");
const admin = require("../firebase");
const jwt = require("jsonwebtoken");

// ======================
// FIREBASE LOGIN
// ======================
router.post("/firebase-login", async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.json(response(false, "ID token required"));
        }

        // ✅ Verify Firebase ID Token
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        const mobile = decodedToken.phone_number;

        if (!mobile) {
            return res.json(response(false, "Phone number not found"));
        }

        // 🔥 Create user if not exists
        let user = await User.findOne({ mobile });

        if (!user) {
            user = await User.create({ mobile });
            console.log("New user created:", mobile);
        }

        // ✅ Create JWT for your backend
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        return res.json(response(true, "Login success", {
            token,
            mobile
        }));

    } catch (err) {
        console.error("Firebase login error:", err);
        return res.json(response(false, "Invalid Firebase token"));
    }
});

module.exports = router;
