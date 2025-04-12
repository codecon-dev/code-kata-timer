const hourToSeconds = hour => {
    return hour * 3600;
};

const minuteToSeconds = minute => {
    return minute * 60;
};

const secondsToHour = seconds => {
    return Math.floor(seconds / 3600);
};

const secondsToMinute = seconds => {
    return Math.floor((seconds % 3600) / 60);
};

const remainingSeconds = seconds => {
    return seconds % 60;
};

const formatTimeUnit = value => {
    return value.toString().padStart(2, '0').slice(-2);
};

export {
    hourToSeconds,
    minuteToSeconds,
    secondsToHour,
    secondsToMinute,
    remainingSeconds,
    formatTimeUnit,
};
