// utils/roundUtils.js

module.exports = {
    FIRST_START: "09:00",
    FIRST_END: "15:45",
    SECOND_START: "16:00",
    SECOND_END: "16:45",

    getCurrentRound(serverTime) {
        const now = new Date(serverTime);

        const firstStart = this.toTodayTime(this.FIRST_START);
        const firstEnd = this.toTodayTime(this.FIRST_END);

        const secondStart = this.toTodayTime(this.SECOND_START);
        const secondEnd = this.toTodayTime(this.SECOND_END);

        if (now < firstStart) return "before_first";
        if (now >= firstStart && now <= firstEnd) return "first";
        if (now > firstEnd && now < secondStart) return "between";
        if (now >= secondStart && now <= secondEnd) return "second";
        return "closed";
    },

    toTodayTime(timeStr) {
        const [h, m] = timeStr.split(":").map(Number);
        const d = new Date();
        d.setHours(h, m, 0, 0);
        return d;
    }
};
