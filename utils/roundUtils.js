// utils/roundUtils.js

module.exports = {
    // Time windows (IST)
    FIRST_OPEN: 10 * 60 + 45,    // 10:45 AM
    FIRST_CLOSE: 15 * 60 + 45,   // 3:45 PM

    SECOND_OPEN: 16 * 60 + 15,   // 4:15 PM
    SECOND_CLOSE: 17 * 60,       // 5:00 PM

    // Get current round using IST
    getCurrentRound(serverTime) {
        const istNow = new Date(
            new Date(serverTime).toLocaleString("en-US", {
                timeZone: "Asia/Kolkata",
            })
        );

        const hours = istNow.getHours();
        const minutes = istNow.getMinutes();
        const totalMinutes = hours * 60 + minutes;

        // Before 10:45 AM
        if (totalMinutes < this.FIRST_OPEN) {
            return "before_first";
        }

        // First round: 10:45 AM – 3:45 PM
        if (totalMinutes >= this.FIRST_OPEN && totalMinutes < this.FIRST_CLOSE) {
            return "first";
        }

        // Between rounds: 3:45 PM – 4:15 PM
        if (totalMinutes >= this.FIRST_CLOSE && totalMinutes < this.SECOND_OPEN) {
            return "between";
        }

        // Second round: 4:15 PM – 5:00 PM
        if (totalMinutes >= this.SECOND_OPEN && totalMinutes < this.SECOND_CLOSE) {
            return "second";
        }

        // After 5:00 PM
        return "closed";
    }
};
