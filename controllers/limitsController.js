const LimitItem = require("../models/LimitItem");

// ========================
// USER → GET ALL LIMIT ITEMS
// ========================
exports.getLimits = async (req, res) => {
    try {
        // Return as-is because frontend expects:
        // [
        //   { label:"01", min:10, max:200, remaining:200 },
        //   { label:"house_3", ... },
        //   { label:"ending_7", ... }
        // ]
        const items = await LimitItem.find().sort({ label: 1 });

        return res.json({
            success: true,
            message: "Limits loaded",
            data: items
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message,
            data: null
        });
    }
};


// ========================
// ADMIN → UPDATE ONE LIMIT ITEM
// ========================
exports.updateLimit = async (req, res) => {
    try {
        const { label, min, max, remaining } = req.body;

        if (!label) {
            return res.json({
                success: false,
                message: "label is required",
                data: null
            });
        }

        const updated = await LimitItem.findOneAndUpdate(
            { label: label },
            { min, max, remaining },
            { new: true }
        );

        if (!updated) {
            return res.json({
                success: false,
                message: "Limit item not found",
                data: null
            });
        }

        return res.json({
            success: true,
            message: "Limit updated successfully",
            data: updated
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message,
            data: null
        });
    }
};
