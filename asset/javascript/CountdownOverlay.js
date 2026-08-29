import './helper.js';

export const FINISHED_MESSAGE = 'ACABOU!';

export function CountdownOverlay(reference) {
    const container = reference.querySelector('.js-countdown-container');
    const number = container.querySelector('.js-countdown-number');
    const closeButton = container.querySelector('.js-close-countdown-button');
    const restartButton = container.querySelector('.js-restart-countdown-button');

    let dismissed = false;
    let onCloseCallback = null;
    let onRestartCallback = null;

    function init() {
        closeButton.addEventListener('click', close);

        if (restartButton) restartButton.addEventListener('click', restart);
    }

    function show(seconds) {
        if (dismissed) return;

        container.showElement();
        number.classList.remove('is-message');
        number.textContent = seconds;

        container.classList.toggle('even');
        container.classList.toggle('odd');

        const isEven = seconds % 2 === 0;
        container.classList.toggle('inverted', isEven);
        reference.classList.toggle('inverted', isEven);
    }

    function showFinished() {
        if (dismissed) return;

        container.showElement();
        container.classList.remove('even', 'odd', 'inverted');
        reference.classList.remove('inverted');

        number.classList.add('is-message');
        number.textContent = FINISHED_MESSAGE;

        if (restartButton) restartButton.showElement();
    }

    function restart() {
        hide();

        if (onRestartCallback) onRestartCallback();
    }

    function close() {
        dismissed = true;
        hide();

        if (onCloseCallback) onCloseCallback();
    }

    function hide() {
        reference.classList.remove('inverted');
        container.classList.remove('inverted');
        container.classList.remove('even', 'odd');
        container.hideElement();

        number.classList.remove('is-message');
        number.textContent = '';

        if (restartButton) restartButton.hideElement();
    }

    function reset() {
        dismissed = false;
        hide();
    }

    function isDismissed() {
        return dismissed;
    }

    function onClose(callback) {
        onCloseCallback = callback;
    }

    function onRestart(callback) {
        onRestartCallback = callback;
    }

    init();

    return { show, showFinished, hide, reset, close, isDismissed, onClose, onRestart };
}

export default CountdownOverlay;
