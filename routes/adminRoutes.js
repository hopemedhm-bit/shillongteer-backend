const express = require("express");
const router = express.Router();
const { adminLogin } = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");

// LOGIN
router.post("/login", adminLogin);

// Example protected route
router.get("/check", adminAuth, (req, res) => {
    res.json({
        success: true,
        message: "Admin authenticated",
        data: null
    });
});

module.exports = router;
