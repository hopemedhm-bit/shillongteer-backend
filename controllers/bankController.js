const Bank = require("../models/Bank");

//
// ========================
// USER (ANDROID) — GET BANK LIST
// ========================
//
exports.getBanks = async (req, res) => {
    try {
        const userId = req.query.userId;

        const banks = await Bank.find({ userId }).sort({ createdAt: -1 });

        return res.json({
            success: true,
            message: "Bank list loaded",
            data: banks
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
// ========================
// USER (ANDROID) — SAVE BANK
// ========================
//
exports.saveBank = async (req, res) => {
    try {
        const { userId, bank_name, account_no, ifsc } = req.body;

        const bank = await Bank.create({
            userId,
            bank_name,
            account_no,
            ifsc
        });

        return res.json({
            success: true,
            message: "Bank saved successfully",
            data: bank
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
// ========================
// USER (ANDROID) — DELETE BANK
// ========================
//
exports.deleteBank = async (req, res) => {
    try {
        const bankId = req.query.id;

        await Bank.findByIdAndDelete(bankId);

        return res.json({
            success: true,
            message: "Bank deleted successfully",
            data: null
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
// ========================
// ADMIN PANEL — GET ALL BANKS
// ========================
//
exports.getAllBanks = async (req, res) => {
    try {
        const banks = await Bank.find().sort({ createdAt: -1 });

        return res.json({
            success: true,
            message: "All banks loaded",
            data: banks
        });

    } catch (err) {
        return res.json({
            success: false,
            message: err.message,
            data: null
        });
    }
};
