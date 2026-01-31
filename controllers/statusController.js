// controllers/statusController.js

// --- Shillong Teer Round Logic ---
function getTeerStatus(serverTime) {
    // Convert server time to IST
    const istNow = new Date(
        new Date(serverTime).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const hours = istNow.getHours();
    const minutes = istNow.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // Shillong Teer Time Windows
    const FIRST_OPEN = 10 * 60 + 45;   // 10:45 AM
    const FIRST_CLOSE = 15 * 60 + 45;  // 3:45 PM

    const SECOND_OPEN = 16 * 60 + 15;  // 4:15 PM
    const SECOND_CLOSE = 17 * 60;      // 5:00 PM

    if (totalMinutes < FIRST_OPEN)
        return { round: "before_first", bettingAllowed: false };

    if (totalMinutes >= FIRST_OPEN && totalMinutes < FIRST_CLOSE)
        return { round: "first", bettingAllowed: true };

    if (totalMinutes >= FIRST_CLOSE && totalMinutes < SECOND_OPEN)
        return { round: "between", bettingAllowed: false };

    if (totalMinutes >= SECOND_OPEN && totalMinutes < SECOND_CLOSE)
        return { round: "second", bettingAllowed: true };

    return { round: "closed", bettingAllowed: false };
}


// ---------------------
// MAIN STATUS CONTROLLER
// ---------------------
exports.getStatus = (req, res) => {
    try {
        const serverTime = Date.now();

        const status = getTeerStatus(serverTime);

        res.status(200).json({
            success: true,
            serverTime,
            round: status.round,
            bettingAllowed: status.bettingAllowed
        });

    } catch (error) {
        console.error("StatusController Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch status"
        });
    }
};
