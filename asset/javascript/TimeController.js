import tickTackSoundUrl from '../sound/tick-tack.wav';
import stopSoundUrl from '../sound/stop.mp3';
import './helper.js';
import { TimerStatus } from './TimerStatus.js';
import {
    formatTimeUnit,
    hourToSeconds,
    minuteToSeconds,
    remainingSeconds,
    secondsToHour,
    secondsToMinute,
} from './TimeUtils.js';

function TimerController(reference) {
    const hourInput = reference.querySelector('.js-hour-input');
    const minuteInput = reference.querySelector('.js-minute-input');
    const secondInput = reference.querySelector('.js-seconds-input');

    const actionButtonsContainer = reference.querySelector('.js-stopwatch-action-buttons');
    const enterFullscreenButton = actionButtonsContainer.querySelector('.js-enter-fullscreen-button');
    const exitFullscreenButton = actionButtonsContainer.querySelector('.js-exit-fullscreen-button');
    const startButton = actionButtonsContainer.querySelector('.js-start-button');
    const stopButton = actionButtonsContainer.querySelector('.js-stop-button');
    const pauseButton = actionButtonsContainer.querySelector('.js-pause-button');
    const editButton = actionButtonsContainer.querySelector('.js-edit-button');

    const editActionButtonsContainer = reference.querySelector('.js-edit-container-stopwatch');
    const cancelEditButton = editActionButtonsContainer.querySelector('.js-cancel-edit-button');
    const finishEditButton = editActionButtonsContainer.querySelector('.js-finish-edit-button');

    const countdownContainerReference = reference.querySelector('.js-countdown-container');
    const countdownNumber = countdownContainerReference.querySelector('.js-countdown-number');
    const closeCountdownButton = countdownContainerReference.querySelector('.js-close-countdown-button');

    const DEFAULT_INTERVAL = 1000;
    const DEFAULT_SECONDS = 30;

    const tickTackSound = new Audio(tickTackSoundUrl);
    const stopSound = new Audio(stopSoundUrl);
    tickTackSound.addEventListener('error', e => {
        console.error('Erro ao carregar tick-tack.wav:', e);
    });

    stopSound.addEventListener('error', e => {
        console.error('Erro ao carregar stop.mp3:', e);
    });

    let lastTimerStatus = TimerStatus.STOPPED;
    let previousTimerValue = DEFAULT_SECONDS;
    let timerIntervalId = null;
    let preventOpenCountdown = false;

    function init() {
        bindInputs();
        bindButtons();
        bindFullscreenEvents();
        setInputValues(DEFAULT_SECONDS);
    }

    var bindInputs = function () {
        hourInput.addEventListener('input', function () {
            let maxHours = 99;
            validateInput(hourInput, maxHours);
        });

        hourInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                minuteInput.focus();
            }
        });

        minuteInput.addEventListener('input', function () {
            let maxMinutes = 59;
            validateInput(minuteInput, maxMinutes);
        });

        minuteInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                secondInput.focus();
            }
        });

        secondInput.addEventListener('input', function () {
            let maxSeconds = 59;
            validateInput(secondInput, maxSeconds);
        });

        secondInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                finishEditInput();
                startButton.focus();
            }
        });
    };

    function bindFullscreenEvents() {
        document.addEventListener('fullscreenchange', handleButtonFullscreenChange);
    }

    function validateInput(input, maxValue) {
        let value = parseInt(input.value) || 0;

        if (value < 0) value = 0;
        if (value > maxValue) value = maxValue;

        input.value = formatTimeUnit(value);
    }

    function bindButtons() {
        editButton.addEventListener('click', openEditInput);
        cancelEditButton.addEventListener('click', cancelEditInput);
        finishEditButton.addEventListener('click', finishEditInput);

        startButton.addEventListener('click', start);
        stopButton.addEventListener('click', stop);
        pauseButton.addEventListener('click', pause);

        enterFullscreenButton.addEventListener('click', handleFullscreen);
        exitFullscreenButton.addEventListener('click', handleFullscreen);
        closeCountdownButton.addEventListener('click', closeCountdownContainer);
    }

    function openEditInput() {
        lastTimerStatus = TimerStatus.EDITING;
        previousTimerValue = getInputsValueAsSeconds();

        toggleDisableInputs(false);
        toggleButtonsContainer(true);

        setTimeout(() => {
            hourInput.focus();
        }, 10);
    }

    function cancelEditInput() {
        setInputValues(previousTimerValue);
        finishEditInput();
    }

    function finishEditInput() {
        lastTimerStatus = TimerStatus.PAUSED;
        toggleDisableInputs(true);
        toggleButtonsContainer(false);
        window.getSelection().removeAllRanges();

        let seconds = getInputsValueAsSeconds();

        if (seconds <= 0) {
            setInputValues(DEFAULT_SECONDS);
        }
    }

    function start() {
        const canStart = TimerStatus.isStopped(lastTimerStatus) || TimerStatus.isPaused(lastTimerStatus);

        if (!canStart) return;

        startButton.hideElement();
        pauseButton.showElement();
        stopButton.showElement();
        editButton.hideElement();

        lastTimerStatus = TimerStatus.RUNNING;
        initTimer();
    }

    function initTimer() {
        timerIntervalId = setInterval(() => {
            var canStart =
                TimerStatus.isRunning(lastTimerStatus) ||
                TimerStatus.isCountdown(lastTimerStatus) ||
                TimerStatus.isPaused(lastTimerStatus);

            if (canStart) {
                let seconds = getInputsValueAsSeconds();
                seconds--;
                if (seconds <= 10) {
                    lastTimerStatus = TimerStatus.COUNTDOWN;
                    playCountdownSound();

                    if (!preventOpenCountdown) executeCountdown(seconds);
                }

                setInputValues(seconds);

                if (seconds == 0) {
                    preventOpenCountdown = false;
                    lastTimerStatus = TimerStatus.STOPPED;

                    showDefaultButtons();
                    playStopSound();
                    clearInterval(timerIntervalId);
                }
            } else {
                clearInterval(timerIntervalId);
            }
        }, DEFAULT_INTERVAL);
    }

    function playCountdownSound() {
        tickTackSound.volume = 0.5;
        tickTackSound.loop = false;
        tickTackSound.currentTime = 0;
        tickTackSound.play();
    }

    function playStopSound() {
        stopSound.volume = 0.5;
        stopSound.loop = false;
        stopSound.currentTime = 0;
        stopSound.play();

        setTimeout(() => {
            const fade = setInterval(() => {
                if (stopSound.volume > 0.05) {
                    stopSound.volume -= 0.05;
                } else {
                    stopSound.volume = 0;
                    stopSound.pause();
                    stopSound.currentTime = 0;
                    clearInterval(fade);
                    setInputValues(DEFAULT_SECONDS);
                    preventOpenCountdown = false;
                }
            }, 200);
        }, 3000);
    }

    function executeCountdown(seconds) {
        countdownContainerReference.showElement();
        countdownNumber.textContent = seconds;

        if (seconds % 2 === 0) {
            countdownContainerReference.classList.add('even');
            countdownContainerReference.classList.remove('odd');
            return;
        }

        countdownContainerReference.classList.add('odd');
        countdownContainerReference.classList.remove('even');
    }

    function stop() {
        if (TimerStatus.isStopped(lastTimerStatus)) return;

        preventOpenCountdown = false;
        lastTimerStatus = TimerStatus.STOPPED;
        showDefaultButtons();
        setInputValues(DEFAULT_SECONDS);
        clearInterval(timerIntervalId);
    }

    function pause() {
        if (lastTimerStatus === TimerStatus.RUNNING || lastTimerStatus === TimerStatus.COUNTDOWN) {
            lastTimerStatus = TimerStatus.PAUSED;
            startButton.showElement();
            pauseButton.hideElement();
            clearInterval(timerIntervalId);
        }
    }

    function isInFullscreen() {
        return !!document.fullscreenElement
    }
    
    function handleButtonFullscreenChange() {
        if (isInFullscreen()) {
            exitFullscreenButton.showElement();
            enterFullscreenButton.hideElement();
            return;
        }

        enterFullscreenButton.showElement();
        exitFullscreenButton.hideElement();
    }

    function handleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            return;
        }

        document.exitFullscreen();
    }

    function closeCountdownContainer() {
        preventOpenCountdown = true;
        countdownContainerReference.hideElement();
        countdownContainerReference.classList.remove('even', 'odd');
        countdownNumber.textContent = '';
        stopSound.pause();
        stopSound.currentTime = 0;
        stopSound.volume = 0;
    }

    function toggleButtonsContainer(isEditing) {
        if (isEditing) {
            actionButtonsContainer.hideElement();
            editActionButtonsContainer.showElement();
        } else {
            actionButtonsContainer.showElement();
            editActionButtonsContainer.hideElement();
        }
    }

    function toggleDisableInputs(disable) {
        hourInput.disabled = disable;
        minuteInput.disabled = disable;
        secondInput.disabled = disable;
    }

    function showDefaultButtons() {
        startButton.showElement();
        pauseButton.hideElement();
        stopButton.hideElement();
        editButton.showElement();
    }

    function getInputsValueAsSeconds() {
        const { seconds, minutes, hours } = getInputValues();

        const minutesAsSeconds = minuteToSeconds(minutes);
        const hourAsSeconds = hourToSeconds(hours);

        return seconds + minutesAsSeconds + hourAsSeconds;
    }

    function getInputValues() {
        const hours = parseInt(hourInput.value) || 0;
        const minutes = parseInt(minuteInput.value) || 0;
        const seconds = parseInt(secondInput.value) || 0;

        return { seconds, minutes, hours };
    }

    function setInputValues(totalSeconds = 0) {
        const hours = secondsToHour(totalSeconds);
        const minutes = secondsToMinute(totalSeconds);
        const seconds = remainingSeconds(totalSeconds);

        hourInput.value = formatTimeUnit(hours);
        minuteInput.value = formatTimeUnit(minutes);
        secondInput.value = formatTimeUnit(seconds);
    }

    init();
}

document.addEventListener('DOMContentLoaded', function () {
    let reference = document.querySelector('.js-body');
    const timerController = new TimerController(reference);
    window.timerController = timerController;
});
