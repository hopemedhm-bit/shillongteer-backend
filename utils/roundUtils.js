const moment = require("moment-timezone");
const admin = require("firebase-admin");
const User = require("../models/User");

const TZ = "Asia/Kolkata";

// Prevent spam push
let last30MinAlert = null;
let last5MinAlert = null;

exports.getRoundStatus = async () => {

    const now = moment().tz(TZ);
    const today = now.format("YYYY-MM-DD");

    const firstOpen   = moment.tz(`${today} 10:45`, TZ);
    const firstClose  = moment.tz(`${today} 15:45`, TZ);
    const secondOpen  = moment.tz(`${today} 16:15`, TZ);
    const secondClose = moment.tz(`${today} 17:00`, TZ);

    let round = "closed";
    let bettingAllowed = false;
    let roundCloseTime = null;

    if (now.isBefore(firstOpen)) {
        round = "before_first";
        bettingAllowed = true;
        roundCloseTime = firstClose;
    } 
    else if (now.isBefore(firstClose)) {
        round = "first";
        bettingAllowed = true;
        roundCloseTime = firstClose;
    } 
    else if (now.isBefore(secondOpen)) {
        round = "between";
        bettingAllowed = false;
    } 
    else if (now.isBefore(secondClose)) {
        round = "second";
        bettingAllowed = true;
        roundCloseTime = secondClose;
    } 
    else {
        round = "closed";
        bettingAllowed = false;
    }

    // ============================
    // 🔥 TIME LEFT CALCULATION
    // ============================

    if (bettingAllowed && roundCloseTime) {

        const minutesLeft = roundCloseTime.diff(now, "minutes");

        // ⏳ 30 MIN ALERT
        if (minutesLeft <= 30 && minutesLeft > 5 && last30MinAlert !== today + round) {

            await sendPush(
                "⏳ Hurry Up!",
                `Only ${minutesLeft} minutes left for ${round} round!`
            );

            last30MinAlert = today + round;
        }

        // 🚨 5 MIN ALERT
        if (minutesLeft <= 5 && last5MinAlert !== today + round) {

            await sendPush(
                "🚨 Last Chance!",
                `Only ${minutesLeft} minutes left! Betting closing soon!`
            );

            last5MinAlert = today + round;
        }
    }

    return {
        round,
        bettingAllowed,
        serverTime: now.valueOf()
    };
};


// ============================
// 🔥 PUSH FUNCTION
// ============================

async function sendPush(title, body) {
    try {

        const users = await User.find({
            fcmToken: { $ne: null }
        });

        const tokens = users.map(u => u.fcmToken);

        if (tokens.length === 0) return;

        const message = {
            notification: { title, body },
            tokens
        };

        const response = await admin.messaging().sendEachForMulticast(message);
        console.log("Time alert push sent:", response.successCount);

    } catch (err) {
        console.log("Push error:", err.message);
    }
}
