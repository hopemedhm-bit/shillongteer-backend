const { getRoundStatus } = require("../utils/roundUtils");

exports.getStatus = async (req, res) => {
    try {

        const data = await getRoundStatus();

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
