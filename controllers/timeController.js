exports.getServerTime = (req, res) => {
    try {
        res.json({
            success: true,
            serverTime: Date.now()
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server time error"
        });
    }
};
