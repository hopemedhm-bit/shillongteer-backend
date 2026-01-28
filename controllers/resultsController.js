const Result = require("../models/Result");

//
// =============================
// ANDROID — GET TODAY RESULT
// =============================
//
exports.getTodayResult = async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        let result = await Result.findOne({ date: today });

        // If today's result does NOT exist → create empty
        if (!result) {
            result = await Result.create({ date: today, round1: "", round2: "" });
        }

        return res.json({
            success: true,
            message: "Today result loaded",
            data: result
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message,
            data: null
        });
    }
};

//
// =============================
// ANDROID — GET OLD RESULTS
// =============================
// filter = today / all
// =============================
//
exports.getOldResults = async (req, res) => {
    try {
        const filter = req.query.filter || "all";
        let results;

        if (filter === "today") {
            const today = new Date().toISOString().split("T")[0];
            results = await Result.find({ date: today });
        } else {
            results = await Result.find().sort({ date: -1 }); // latest first
        }

        return res.json({
            success: true,
            message: "Old results loaded",
            data: results
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message,
            data: null
        });
    }
};

//
// =============================
// ADMIN — UPDATE TODAY RESULT
// =============================
// round1 OR round2 can update separately
// =============================
//
exports.updateResult = async (req, res) => {
    try {
        const { round1, round2 } = req.body;
        const today = new Date().toISOString().split("T")[0];

        let result = await Result.findOne({ date: today });

        // If today result not exists → create new
        if (!result) {
            result = await Result.create({
                date: today,
                round1: round1 || "",
                round2: round2 || ""
            });
        } 
        else {
            if (round1 !== undefined) result.round1 = round1;
            if (round2 !== undefined) result.round2 = round2;
            await result.save();
        }

        return res.json({
            success: true,
            message: "Result updated successfully",
            data: result
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message,
            data: null
        });
    }
};
