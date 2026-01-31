// controllers/statusController.js

const roundUtils = require("../utils/roundUtils");

exports.getStatus = (req, res) => {
    try {
        const serverTime = Date.now();

        const round = roundUtils.getCurrentRound(serverTime);
        const bettingAllowed = round === "first" || round === "second";

        res.status(200).json({
            success: true,
            serverTime,
            round,
            bettingAllowed
        });

    } catch (error) {
        console.error("StatusController Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch status"
        });
    }
};
