const { getRoundStatus } = require("../utils/roundUtils");

exports.getStatus = (req, res) => {
    try {

        const data = getRoundStatus();

        res.json({
            success: true,
            round: data.round,
            bettingAllowed: data.bettingAllowed,
            serverTime: data.serverTime
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Status error"
        });
    }
};
