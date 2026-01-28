const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    mobile: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
