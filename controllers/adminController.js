const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Get from .env
        const adminUser = process.env.ADMIN_USERNAME;
        const adminPass = process.env.ADMIN_PASSWORD;

        if (username !== adminUser || password !== adminPass) {
            return res.json({
                success: false,
                message: "Invalid username or password",
                data: null
            });
        }

        // Create token
        const token = jwt.sign(
            { role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return res.json({
            success: true,
            message: "Login successful",
            data: { token }
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message,
            data: null
        });
    }
};
