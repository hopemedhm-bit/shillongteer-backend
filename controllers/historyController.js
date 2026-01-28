const Bet = require("../models/Bet");

// GET HISTORY BY FILTER
exports.getHistory = async (req, res) => {
    try {
        const { userId, filter } = req.query;

        if (!userId) {
            return res.json({
                success: false,
                message: "userId is required",
                data: null
            });
        }

        let query = { userId };
        
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = ("0" + (today.getMonth() + 1)).slice(-2);
        const dd = ("0" + today.getDate()).slice(-2);
        const todayStr = `${yyyy}-${mm}-${dd}`;

        if (filter === "today") {
            query.date = todayStr;
        }

        if (filter === "week") {
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            const wyyyy = weekAgo.getFullYear();
            const wmm = ("0" + (weekAgo.getMonth() + 1)).slice(-2);
            const wdd = ("0" + weekAgo.getDate()).slice(-2);
            const weekAgoStr = `${wyyyy}-${wmm}-${wdd}`;

            query.date = { $gte: weekAgoStr };
        }

        if (filter === "month") {
            const monthAgo = new Date(today);
            monthAgo.setMonth(today.getMonth() - 1);
            const myyyy = monthAgo.getFullYear();
            const mmm = ("0" + (monthAgo.getMonth() + 1)).slice(-2);
            const mdd = ("0" + monthAgo.getDate()).slice(-2);
            const monthAgoStr = `${myyyy}-${mmm}-${mdd}`;

            query.date = { $gte: monthAgoStr };
        }

        // Fetch history
        const history = await Bet.find(query).sort({ createdAt: -1 });

        return res.json({
            success: true,
            message: "History loaded",
            data: history
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message,
            data: null
        });
    }
};
