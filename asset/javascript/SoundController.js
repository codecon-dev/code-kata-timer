import tickTackSoundUrl from '../sound/tick-tack.wav';
import stopSoundUrl from '../sound/stop.mp3';

const FADE_DELAY = 3000;
const FADE_INTERVAL = 200;
const FADE_STEP = 0.05;

export function SoundController() {
    const tickTackSound = new Audio(tickTackSoundUrl);
    const stopSound = new Audio(stopSoundUrl);

    let fadeIntervalId = null;
    let fadeTimeoutId = null;

    tickTackSound.addEventListener('error', e => {
        console.error('Erro ao carregar tick-tack.wav:', e);
    });

    stopSound.addEventListener('error', e => {
        console.error('Erro ao carregar stop.mp3:', e);
    });

    function safePlay(sound) {
        const played = sound.play();

        if (played && typeof played.catch === 'function') {
            played.catch(() => {});
        }
    }

    function playTick() {
        tickTackSound.volume = 0.5;
        tickTackSound.loop = false;
        tickTackSound.currentTime = 0;
        safePlay(tickTackSound);
    }

    function playStop() {
        clearFade();

        stopSound.volume = 0.5;
        stopSound.loop = false;
        stopSound.currentTime = 0;
        safePlay(stopSound);

        fadeTimeoutId = setTimeout(() => {
            fadeIntervalId = setInterval(() => {
                if (stopSound.volume > FADE_STEP) {
                    stopSound.volume -= FADE_STEP;
                    return;
                }

                stopAll();
            }, FADE_INTERVAL);
        }, FADE_DELAY);
    }

    function clearFade() {
        clearTimeout(fadeTimeoutId);
        clearInterval(fadeIntervalId);
        fadeTimeoutId = null;
        fadeIntervalId = null;
    }

    function stopAll() {
        clearFade();

        stopSound.pause();
        stopSound.currentTime = 0;
        stopSound.volume = 0;

        tickTackSound.pause();
        tickTackSound.currentTime = 0;
    }

    return { playTick, playStop, stopAll };
}

export default SoundController;
