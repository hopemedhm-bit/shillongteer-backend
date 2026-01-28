require("dotenv").config();
const mongoose = require("mongoose");
const LimitItem = require("../models/LimitItem");

// Connect & Run
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("MongoDB Connected");

        // Clear old items
        await LimitItem.deleteMany({});
        console.log("Old limit items removed");

        // ---------------- NUMBER LIMITS (00–99) ---------------- //
        const numbers = [];
        for (let i = 0; i <= 99; i++) {
            const label = i.toString().padStart(2, "0");
            numbers.push({
                label,
                min: 10,
                max: 200,
                remaining: 200   // initial remaining = max
            });
        }

        // ---------------- HOUSE LIMITS (0–9) ---------------- //
        const houses = [];
        for (let i = 0; i <= 9; i++) {
            houses.push({
                label: `house_${i}`,
                min: 20,
                max: 1000,
                remaining: 1000
            });
        }

        // ---------------- ENDING LIMITS (0–9) ---------------- //
        const endings = [];
        for (let i = 0; i <= 9; i++) {
            endings.push({
                label: `ending_${i}`,
                min: 10,
                max: 500,
                remaining: 500
            });
        }

        // SAVE ALL
        const allItems = [...numbers, ...houses, ...endings];
        await LimitItem.insertMany(allItems);

        console.log("✔ Limit items seeded (" + allItems.length + " items)");
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
