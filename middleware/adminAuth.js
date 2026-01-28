const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.json({
            success: false,
            message: "No token provided",
            data: null
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Must be admin
        if (decoded.role !== "admin") {
            return res.json({
                success: false,
                message: "Unauthorized access",
                data: null
            });
        }

        req.admin = decoded;
        next();

    } catch (error) {
        return res.json({
            success: false,
            message: "Invalid or expired token",
            data: null
        });
    }
};
