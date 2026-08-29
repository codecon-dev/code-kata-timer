import './helper.js';
import TimerController, { COUNTDOWN_THRESHOLD } from './TimeController.js';
import { CountdownOverlay } from './CountdownOverlay.js';
import { SoundController } from './SoundController.js';
import { ThemeController } from './ThemeController.js';
import { loadState, saveState } from './TimerStorage.js';
import { formatTimeUnit, remainingSeconds, secondsToHour, secondsToMinute } from './TimeUtils.js';

const TICK_INTERVAL = 250;
const AVAILABLE_LAYOUTS = [1, 2, 4];
const DEFAULT_LAYOUT = 1;

export function TimerApp(reference) {
    const grid = reference.querySelector('.js-timers-grid');
    const template = reference.querySelector('.js-timer-template');

    const globalControls = reference.querySelector('.js-global-controls');
    const startAllButton = globalControls.querySelector('.js-start-all-button');
    const pauseAllButton = globalControls.querySelector('.js-pause-all-button');
    const stopAllButton = globalControls.querySelector('.js-stop-all-button');
    const enterFullscreenButton = globalControls.querySelector('.js-enter-fullscreen-button');
    const exitFullscreenButton = globalControls.querySelector('.js-exit-fullscreen-button');

    const layoutButtons = Array.from(reference.querySelectorAll('.js-layout-button'));
    const themeMenuContainer = reference.querySelector('.js-theme-menu-container');

    const overlay = CountdownOverlay(reference);
    const sound = SoundController();
    const theme = ThemeController(reference);

    let timers = [];
    let layout = DEFAULT_LAYOUT;
    let tickIntervalId = null;

    function init() {
        bindGlobalButtons();
        bindLayoutButtons();
        bindFullscreenEvents();
        overlay.onClose(handleOverlayClose);
        overlay.onRestart(handleOverlayRestart);
        theme.onChange(persist);

        restoreFromStorage();
    }

    function restoreFromStorage() {
        const state = loadState();

        if (state && AVAILABLE_LAYOUTS.includes(state.layout)) {
            theme.setTheme(state.theme);
            applyLayout(state.layout, state.timers || []);
            return;
        }

        applyLayout(DEFAULT_LAYOUT, []);
    }

    function bindGlobalButtons() {
        startAllButton.addEventListener('click', () => forEachTimer(timer => timer.start()));
        pauseAllButton.addEventListener('click', () => forEachTimer(timer => timer.pause()));
        stopAllButton.addEventListener('click', () => {
            sound.stopAll();
            overlay.reset();
            forEachTimer(timer => timer.stop());
        });

        enterFullscreenButton.addEventListener('click', handleFullscreen);
        exitFullscreenButton.addEventListener('click', handleFullscreen);
    }

    function bindLayoutButtons() {
        layoutButtons.forEach(button => {
            button.addEventListener('click', () => {
                const total = parseInt(button.dataset.timers, 10);

                if (!AVAILABLE_LAYOUTS.includes(total)) return;

                applyLayout(total, serializeTimers());
                theme.closeMenu();
                persist();
            });
        });
    }

    function bindFullscreenEvents() {
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) updatePageTitle();
        });
    }

    function forEachTimer(callback) {
        timers.forEach(callback);
        ensureTicking();
        persist();
    }

    function applyLayout(total, savedTimers) {
        layout = total;

        timers.forEach(timer => timer.destroy());
        timers = [];
        grid.innerHTML = '';

        AVAILABLE_LAYOUTS.forEach(option => {
            reference.classList.toggle(`timers-${option}`, option === total);
        });

        layoutButtons.forEach(button => {
            const isActive = parseInt(button.dataset.timers, 10) === total;
            button.classList.toggle('is-active', isActive);
        });

        for (let index = 0; index < total; index++) {
            timers.push(createTimer(index, savedTimers[index]));
        }

        globalControls.classList.toggle('is-multiple', total > 1);
        startAllButton.classList.toggle('hide', total === 1);
        pauseAllButton.classList.toggle('hide', total === 1);
        stopAllButton.classList.toggle('hide', total === 1);

        overlay.reset();
        ensureTicking();
        updatePageTitle();
    }

    function createTimer(index, savedTimer) {
        const fragment = template.content.cloneNode(true);
        const card = fragment.querySelector('.js-timer-card');

        grid.appendChild(fragment);

        let timer;

        timer = TimerController(card, {
            onChange: handleTimerChange,
            onFinish: () => handleFinish(timer),
            onFinishedMessage: () => handleFinishedMessage(timer),
        });

        timer.setPlaceholder(`Timer ${index + 1}`);

        if (savedTimer) timer.restore(savedTimer);

        return timer;
    }

    function handleFinish(timer) {
        if (isSingleLayout()) {
            overlay.show(0);
            return;
        }

        timer.setInverted(false);
        timer.showCountdownNumber(0);
    }

    function handleFinishedMessage(timer) {
        if (isSingleLayout()) {
            overlay.showFinished();
            return;
        }

        timer.showFinishedMessage();
    }

    function handleOverlayRestart() {
        themeMenuContainer.showElement();
        timers.forEach(timer => timer.stop());
        overlay.reset();
    }

    function handleTimerChange() {
        releaseOverlayWhenRestarted();
        ensureTicking();
        updatePageTitle();
        persist();
    }

    function releaseOverlayWhenRestarted() {
        if (!isSingleLayout() || !timers[0]) return;

        const isBackToNormal = timers[0].getRemaining() > COUNTDOWN_THRESHOLD;

        if (!isBackToNormal) return;

        overlay.reset();
        themeMenuContainer.showElement();
    }

    function ensureTicking() {
        const hasActive = timers.some(timer => timer.isActive());

        if (hasActive && !tickIntervalId) {
            tickIntervalId = setInterval(tick, TICK_INTERVAL);
            return;
        }

        if (!hasActive && tickIntervalId) {
            clearInterval(tickIntervalId);
            tickIntervalId = null;
        }
    }

    function tick() {
        const now = Date.now();

        let shouldPlayTick = false;
        let shouldPlayStop = false;
        let countdownTimer = null;

        timers.forEach(timer => {
            const result = timer.tick(now);

            if (!result) return;

            if (result.finished) {
                shouldPlayStop = true;
                return;
            }

            if (result.second <= COUNTDOWN_THRESHOLD) {
                shouldPlayTick = true;
                if (!countdownTimer) countdownTimer = timer;
            }
        });

        if (shouldPlayStop) sound.playStop();
        if (shouldPlayTick && !shouldPlayStop) sound.playTick();

        if (countdownTimer) renderCountdown(countdownTimer);
        updatePageTitle();
        persist();
        ensureTicking();
    }

    function renderCountdown(timer) {
        if (isSingleLayout()) {
            if (!overlay.isDismissed()) themeMenuContainer.hideElement();
            overlay.show(timer.getRemaining());
            return;
        }

        timer.showCountdownNumber(timer.getRemaining());
        timer.setInverted(timer.getRemaining() % 2 === 0);
    }

    function isSingleLayout() {
        return layout === 1;
    }

    function handleOverlayClose() {
        themeMenuContainer.showElement();
    }

    function handleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            return;
        }

        document.exitFullscreen();
    }

    function handleFullscreenChange() {
        if (document.fullscreenElement) {
            exitFullscreenButton.showElement();
            enterFullscreenButton.hideElement();
            return;
        }

        enterFullscreenButton.showElement();
        exitFullscreenButton.hideElement();
    }

    function getLeadingTimer() {
        const active = timers.filter(timer => timer.isActive());

        if (active.length === 0) return timers[0];

        return active.reduce((closest, timer) => (timer.getRemaining() < closest.getRemaining() ? timer : closest));
    }

    function updatePageTitle() {
        const timer = getLeadingTimer();

        if (!timer) return;

        const total = timer.getRemaining();
        const time = [secondsToHour(total), secondsToMinute(total), remainingSeconds(total)]
            .map(formatTimeUnit)
            .join(':');

        const name = timer.getName();
        const label = name && timers.length > 1 ? `${time} ${name}` : time;

        document.title = `${label} - Timer <Codecon>`;
    }

    function serializeTimers() {
        return timers.map(timer => timer.serialize());
    }

    function persist() {
        saveState({
            layout,
            theme: theme.getTheme(),
            timers: serializeTimers(),
        });
    }

    init();

    return {
        getTimers: () => timers,
        getLayout: () => layout,
        setLayout: total => applyLayout(total, serializeTimers()),
    };
}

document.addEventListener('DOMContentLoaded', function () {
    const reference = document.querySelector('.js-body');
    window.timerApp = TimerApp(reference);
});

export default TimerApp;
