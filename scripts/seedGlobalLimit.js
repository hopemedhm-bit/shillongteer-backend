require("dotenv").config();
const mongoose = require("mongoose");
const GlobalLimit = require("../models/GlobalLimit");

const defaultLimits = {
    min_bid: 1,
    max_bid: 5000,
    max_single_number: 500,
    max_house: 1000,
    max_ending: 2000,
    round1_open: "10:00",
    round1_close: "10:45",
    round2_open: "12:00",
    round2_close: "12:45"
};

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("MongoDB Connected");

        let exists = await GlobalLimit.findOne();
        if (exists) {
            console.log("Global limits exist. Updating...");
            Object.assign(exists, defaultLimits);
            await exists.save();
        } else {
            console.log("Creating default global limits...");
            await GlobalLimit.create(defaultLimits);
        }

        console.log("✔ Global limits seeded");
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
