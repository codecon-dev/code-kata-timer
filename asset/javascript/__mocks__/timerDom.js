export const TIMER_CARD_MARKUP = `
    <div class="timer-card js-timer-card">
        <input type="text" class="timer-name js-timer-name" maxlength="24" placeholder="Timer" />
        <div class="input-stopwatch-container">
            <input type="number" min="00" disabled class="js-hour-input" />
            :
            <input type="number" min="00" disabled class="js-minute-input" />
            :
            <input type="number" min="00" disabled class="js-seconds-input" />
        </div>
        <span class="timer-countdown js-timer-countdown hide"></span>
        <div class="action-button-container js-stopwatch-action-buttons">
            <button class="as-icon js-edit-button"></button>
            <button class="as-icon js-stop-button hide"></button>
            <button class="as-icon js-start-button"></button>
            <button class="as-icon js-pause-button hide"></button>
        </div>
        <div class="action-button-container js-edit-container-stopwatch hide">
            <button class="as-icon js-cancel-edit-button"></button>
            <button class="as-icon js-finish-edit-button"></button>
        </div>
    </div>
`;

export const APP_MARKUP = `
    <template class="js-timer-template">${TIMER_CARD_MARKUP}</template>

    <div class="timers-grid js-timers-grid"></div>

    <div class="action-button-container global-controls js-global-controls">
        <button class="as-icon js-enter-fullscreen-button"></button>
        <button class="as-icon js-exit-fullscreen-button hide"></button>
        <button class="as-icon js-stop-all-button hide"></button>
        <button class="as-icon js-start-all-button hide"></button>
        <button class="as-icon js-pause-all-button hide"></button>
    </div>

    <div class="js-theme-menu-container theme-menu-container">
        <button class="theme-menu-button js-theme-menu-button as-icon">⋮</button>
        <div class="theme-dropdown js-theme-dropdown hide">
            <div class="layout-options">
                <button class="js-layout-button layout-button is-active" data-timers="1">1</button>
                <button class="js-layout-button layout-button" data-timers="2">2</button>
                <button class="js-layout-button layout-button" data-timers="4">4</button>
            </div>
            <button class="js-default-theme-button"></button>
            <button class="js-versus-theme-button"></button>
        </div>
    </div>

    <div class="js-countdown-container countdown-container hide">
        <span class="js-countdown-number countdown-number"></span>
        <div class="action-button-container">
            <button class="as-icon js-restart-countdown-button hide"></button>
            <button class="as-icon js-close-countdown-button"></button>
        </div>
    </div>
`;

export function mountTimerCard() {
    document.body.className = 'js-body timers-1';
    document.body.innerHTML = TIMER_CARD_MARKUP;

    return document.body.querySelector('.js-timer-card');
}

export function mountApp() {
    document.body.className = 'js-body timers-1';
    document.body.innerHTML = APP_MARKUP;

    return document.body;
}
