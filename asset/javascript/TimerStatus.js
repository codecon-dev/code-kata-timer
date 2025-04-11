export const TimerStatus = {
    STOPPED: 'STOPPED',
    PAUSED: 'PAUSED',
    COUNTDOWN: 'COUNTDOWN',
    RUNNING: 'RUNNING',
    EDITING: 'EDITING',
    isRunning: status => status === TimerStatus.RUNNING,
    isCountdown: status => status === TimerStatus.COUNTDOWN,
    isPaused: status => status === TimerStatus.PAUSED,
    isStopped: status => status === TimerStatus.STOPPED,
};
