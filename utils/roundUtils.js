const moment = require("moment-timezone");

const TZ = "Asia/Kolkata";

exports.getRoundStatus = () => {

    const now = moment().tz(TZ);

    const today = now.format("YYYY-MM-DD");

    const firstOpen   = moment.tz(`${today} 10:45`, TZ);
    const firstClose  = moment.tz(`${today} 15:45`, TZ);
    const secondOpen  = moment.tz(`${today} 16:15`, TZ);
    const secondClose = moment.tz(`${today} 17:00`, TZ);

    let round = "closed";
    let bettingAllowed = false;

    if (now.isBefore(firstOpen)) {
        round = "before_first";
        bettingAllowed = true;
    } 
    else if (now.isBefore(firstClose)) {
        round = "first";
        bettingAllowed = true;
    } 
    else if (now.isBefore(secondOpen)) {
        round = "between";
        bettingAllowed = false;
    } 
    else if (now.isBefore(secondClose)) {
        round = "second";
        bettingAllowed = true;
    } 
    else {
        round = "closed";
        bettingAllowed = false;
    }

    return {
        round,
        bettingAllowed,
        serverTime: now.valueOf()
    };
};
