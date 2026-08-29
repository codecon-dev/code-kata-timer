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

export const DEFAULT_SECONDS = 30;
export const COUNTDOWN_THRESHOLD = 10;
const FINISHED_MESSAGE_DELAY = 1000;
export const FINISHED_MESSAGE = 'ACABOU!';

function TimerController(reference, hooks = {}) {
    const nameInput = reference.querySelector('.js-timer-name');
    const hourInput = reference.querySelector('.js-hour-input');
    const minuteInput = reference.querySelector('.js-minute-input');
    const secondInput = reference.querySelector('.js-seconds-input');

    const clockContainer = reference.querySelector('.input-stopwatch-container');
    const countdownNumber = reference.querySelector('.js-timer-countdown');

    const actionButtonsContainer = reference.querySelector('.js-stopwatch-action-buttons');
    const startButton = actionButtonsContainer.querySelector('.js-start-button');
    const stopButton = actionButtonsContainer.querySelector('.js-stop-button');
    const pauseButton = actionButtonsContainer.querySelector('.js-pause-button');
    const editButton = actionButtonsContainer.querySelector('.js-edit-button');

    const editActionButtonsContainer = reference.querySelector('.js-edit-container-stopwatch');
    const cancelEditButton = editActionButtonsContainer.querySelector('.js-cancel-edit-button');
    const finishEditButton = editActionButtonsContainer.querySelector('.js-finish-edit-button');

    let status = TimerStatus.STOPPED;
    let duration = DEFAULT_SECONDS;
    let remaining = DEFAULT_SECONDS;
    let deadline = null;
    let previousTimerValue = DEFAULT_SECONDS;
    let resetTimeoutId = null;

    function init() {
        bindInputs();
        bindButtons();
        setRemaining(DEFAULT_SECONDS);
    }

    function notifyChange() {
        if (hooks.onChange) hooks.onChange();
    }

    var bindInputs = function () {
        if (nameInput) {
            nameInput.addEventListener('input', notifyChange);
            nameInput.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    nameInput.blur();
                }
            });
        }

        hourInput.addEventListener('input', function () {
            validateInput(hourInput, 99);
        });

        hourInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                minuteInput.focus();
            }
        });

        minuteInput.addEventListener('input', function () {
            validateInput(minuteInput, 59);
        });

        minuteInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                event.stopPropagation();
                secondInput.focus();
            }
        });

        secondInput.addEventListener('input', function () {
            validateInput(secondInput, 59);
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
    }

    function openEditInput() {
        if (TimerStatus.isRunning(status) || TimerStatus.isCountdown(status)) return;

        status = TimerStatus.EDITING;
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
        toggleDisableInputs(true);
        toggleButtonsContainer(false);

        if (window.getSelection()) window.getSelection().removeAllRanges();

        let seconds = getInputsValueAsSeconds();

        if (seconds <= 0) seconds = DEFAULT_SECONDS;

        status = TimerStatus.STOPPED;
        duration = seconds;
        setRemaining(seconds);
        notifyChange();
    }

    function isEditing() {
        return status === TimerStatus.EDITING;
    }

    function isActive() {
        return TimerStatus.isRunning(status) || TimerStatus.isCountdown(status);
    }

    function start() {
        const canStart = TimerStatus.isStopped(status) || TimerStatus.isPaused(status);

        if (!canStart) return;

        clearTimeout(resetTimeoutId);
        hideCountdownNumber();
        setInverted(false);

        if (remaining <= 0) setRemaining(duration);

        deadline = Date.now() + remaining * 1000;
        status = remaining <= COUNTDOWN_THRESHOLD ? TimerStatus.COUNTDOWN : TimerStatus.RUNNING;

        startButton.hideElement();
        pauseButton.showElement();
        stopButton.showElement();
        editButton.hideElement();

        notifyChange();
    }

    function pause() {
        if (!isActive()) return;

        status = TimerStatus.PAUSED;
        deadline = null;

        startButton.showElement();
        pauseButton.hideElement();

        notifyChange();
    }

    function stop() {
        clearTimeout(resetTimeoutId);

        status = TimerStatus.STOPPED;
        deadline = null;
        setInverted(false);
        hideCountdownNumber();
        showDefaultButtons();
        setRemaining(duration);
        notifyChange();
    }

    function tick(now) {
        if (!isActive()) return null;

        const next = Math.max(0, Math.round((deadline - now) / 1000));

        if (next === remaining) return null;

        setRemaining(next);

        if (remaining > 0) {
            if (remaining <= COUNTDOWN_THRESHOLD) status = TimerStatus.COUNTDOWN;
            return { second: remaining, finished: false };
        }

        finish();

        return { second: 0, finished: true };
    }

    function finish() {
        status = TimerStatus.STOPPED;
        deadline = null;
        showDefaultButtons();

        if (hooks.onFinish) hooks.onFinish();

        resetTimeoutId = setTimeout(() => {
            if (hooks.onFinishedMessage) hooks.onFinishedMessage();
        }, FINISHED_MESSAGE_DELAY);

        notifyChange();
    }

    function toggleButtonsContainer(editing) {
        if (editing) {
            actionButtonsContainer.hideElement();
            editActionButtonsContainer.showElement();
            return;
        }

        actionButtonsContainer.showElement();
        editActionButtonsContainer.hideElement();
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

        return seconds + minuteToSeconds(minutes) + hourToSeconds(hours);
    }

    function getInputValues() {
        const hours = parseInt(hourInput.value) || 0;
        const minutes = parseInt(minuteInput.value) || 0;
        const seconds = parseInt(secondInput.value) || 0;

        return { seconds, minutes, hours };
    }

    function setInputValues(totalSeconds = 0) {
        hourInput.value = formatTimeUnit(secondsToHour(totalSeconds));
        minuteInput.value = formatTimeUnit(secondsToMinute(totalSeconds));
        secondInput.value = formatTimeUnit(remainingSeconds(totalSeconds));
    }

    function setRemaining(totalSeconds) {
        remaining = Math.max(0, totalSeconds);
        setInputValues(remaining);
    }

    function setInverted(inverted) {
        reference.classList.toggle('inverted', !!inverted);
    }

    function showCountdownNumber(seconds) {
        if (!countdownNumber) return;

        countdownNumber.textContent = seconds;
        countdownNumber.classList.remove('is-message');
        countdownNumber.showElement();
        reference.classList.remove('is-finished');
        clockContainer.hideElement();
        reference.classList.add('is-countdown');
    }

    function showFinishedMessage() {
        if (!countdownNumber) return;

        setInverted(false);
        countdownNumber.textContent = FINISHED_MESSAGE;
        countdownNumber.classList.add('is-message');
        countdownNumber.showElement();
        clockContainer.hideElement();
        reference.classList.add('is-countdown', 'is-finished');
    }

    function hideCountdownNumber() {
        if (!countdownNumber) return;

        countdownNumber.textContent = '';
        countdownNumber.classList.remove('is-message');
        countdownNumber.hideElement();
        clockContainer.showElement();
        reference.classList.remove('is-countdown', 'is-finished');
    }

    function getName() {
        return nameInput ? nameInput.value.trim() : '';
    }

    function setName(name) {
        if (nameInput) nameInput.value = name;
    }

    function setPlaceholder(placeholder) {
        if (nameInput) nameInput.placeholder = placeholder;
    }

    function serialize() {
        return {
            name: getName(),
            duration,
            remaining,
            status,
            endsAt: isActive() ? deadline : null,
        };
    }

    function restore(data = {}) {
        clearTimeout(resetTimeoutId);
        setInverted(false);
        hideCountdownNumber();

        setName(data.name || '');
        duration = data.duration > 0 ? data.duration : DEFAULT_SECONDS;

        const wasActive = data.status === TimerStatus.RUNNING || data.status === TimerStatus.COUNTDOWN;

        if (wasActive && data.endsAt) {
            const left = Math.round((data.endsAt - Date.now()) / 1000);

            if (left > 0) {
                setRemaining(left);
                deadline = data.endsAt;
                status = left <= COUNTDOWN_THRESHOLD ? TimerStatus.COUNTDOWN : TimerStatus.RUNNING;

                startButton.hideElement();
                pauseButton.showElement();
                stopButton.showElement();
                editButton.hideElement();
                return;
            }

            status = TimerStatus.STOPPED;
            deadline = null;
            showDefaultButtons();
            setRemaining(duration);
            return;
        }

        deadline = null;
        status = data.status === TimerStatus.PAUSED ? TimerStatus.PAUSED : TimerStatus.STOPPED;
        setRemaining(data.remaining > 0 ? data.remaining : duration);
        showDefaultButtons();

        if (TimerStatus.isPaused(status)) stopButton.showElement();
    }

    function destroy() {
        clearTimeout(resetTimeoutId);
    }

    init();

    return {
        element: reference,
        start,
        pause,
        stop,
        tick,
        getName,
        setName,
        setPlaceholder,
        setInverted,
        showCountdownNumber,
        showFinishedMessage,
        hideCountdownNumber,
        isActive,
        isEditing,
        getStatus: () => status,
        getRemaining: () => remaining,
        getDuration: () => duration,
        serialize,
        restore,
        destroy,
    };
}

export default TimerController;
