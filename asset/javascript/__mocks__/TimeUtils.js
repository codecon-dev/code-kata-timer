export const formatTimeUnit = jest.fn(value => value.toString().padStart(2, '0'));
export const hourToSeconds = jest.fn(hours => hours * 3600);
export const minuteToSeconds = jest.fn(minutes => minutes * 60);
export const remainingSeconds = jest.fn(seconds => seconds % 60);
export const secondsToHour = jest.fn(seconds => Math.floor(seconds / 3600));
export const secondsToMinute = jest.fn(seconds => Math.floor((seconds % 3600) / 60));