// controllers/timeController.js

/**
 * This API returns the exact server time in milliseconds.
 * Android uses this to calculate a secure time offset so
 * users cannot cheat by changing device/system time.
 */

exports.getServerTime = (req, res) => {
    try {
        res.status(200).json({
            success: true,
            serverTime: Date.now()   // <-- main value
        });
    } catch (error) {
        console.error("TimeController Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch server time"
        });
    }
};
