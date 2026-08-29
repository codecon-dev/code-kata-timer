import { TimerApp } from '../TimerApp';
import { STORAGE_KEY } from '../TimerStorage';
import { mountApp } from '../__mocks__/timerDom';

describe('TimerApp', () => {
    let body;
    let app;

    const selectLayout = total => body.querySelector(`.js-layout-button[data-timers="${total}"]`).click();
    const storedState = () => JSON.parse(window.localStorage.getItem(STORAGE_KEY));

    beforeEach(() => {
        jest.useFakeTimers();
        window.localStorage.clear();
        body = mountApp();
        app = TimerApp(body);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('começa com um único timer e sem controles globais visíveis', () => {
        expect(app.getLayout()).toBe(1);
        expect(body.querySelectorAll('.js-timer-card')).toHaveLength(1);
        expect(body.querySelector('.js-start-all-button').classList.contains('hide')).toBe(true);
    });

    it('troca o layout para 2 e 4 timers e mostra os controles globais', () => {
        selectLayout(4);

        expect(body.querySelectorAll('.js-timer-card')).toHaveLength(4);
        expect(body.classList.contains('timers-4')).toBe(true);
        expect(body.querySelector('.js-start-all-button').classList.contains('hide')).toBe(false);

        selectLayout(2);

        expect(body.querySelectorAll('.js-timer-card')).toHaveLength(2);
        expect(body.classList.contains('timers-2')).toBe(true);
        expect(body.classList.contains('timers-4')).toBe(false);
    });

    it('preserva os timers existentes ao aumentar a quantidade', () => {
        app.getTimers()[0].setName('Palestra');

        selectLayout(2);

        expect(app.getTimers()[0].getName()).toBe('Palestra');
        expect(app.getTimers()[1].getName()).toBe('');
    });

    it('iniciar e pausar todos afeta cada timer', () => {
        selectLayout(2);

        body.querySelector('.js-start-all-button').click();
        expect(app.getTimers().every(timer => timer.isActive())).toBe(true);

        body.querySelector('.js-pause-all-button').click();
        expect(app.getTimers().some(timer => timer.isActive())).toBe(false);
    });

    it('mantém os timers em sincronia mesmo com durações diferentes', () => {
        selectLayout(2);

        const [first, second] = app.getTimers();
        second.restore({ duration: 60, remaining: 60, status: 'STOPPED' });

        body.querySelector('.js-start-all-button').click();
        jest.advanceTimersByTime(5000);

        expect(first.getRemaining()).toBe(25);
        expect(second.getRemaining()).toBe(55);
    });

    it('mostra no título o timer mais próximo de zerar, com o nome', () => {
        selectLayout(2);

        const [first, second] = app.getTimers();
        first.setName('Palestra');
        second.setName('Perguntas');
        second.restore({ name: 'Perguntas', duration: 600, remaining: 600, status: 'STOPPED' });

        body.querySelector('.js-start-all-button').click();
        jest.advanceTimersByTime(1000);

        expect(document.title).toBe('00:00:29 Palestra - Timer <Codecon>');
    });

    it('com um timer, mostra a contagem em tela cheia e termina em ACABOU!', () => {
        const [timer] = app.getTimers();
        const overlayNumber = body.querySelector('.js-countdown-number');

        timer.restore({ duration: 30, remaining: 3, status: 'PAUSED' });
        timer.start();

        jest.advanceTimersByTime(1000);
        expect(overlayNumber.textContent).toBe('2');

        jest.advanceTimersByTime(2000);
        expect(overlayNumber.textContent).toBe('0');

        jest.advanceTimersByTime(1000);
        expect(overlayNumber.textContent).toBe('ACABOU!');
        expect(body.querySelector('.js-restart-countdown-button').classList.contains('hide')).toBe(false);

        body.querySelector('.js-restart-countdown-button').click();

        expect(body.querySelector('.js-countdown-container').classList.contains('hide')).toBe(true);
        expect(timer.getRemaining()).toBe(30);
    });

    it('com vários timers, o card que zera vira o contador em destaque', () => {
        selectLayout(2);

        const [, second] = app.getTimers();
        second.restore({ duration: 30, remaining: 2, status: 'PAUSED' });
        second.start();

        jest.advanceTimersByTime(1000);
        expect(second.element.classList.contains('is-countdown')).toBe(true);
        expect(second.element.querySelector('.js-timer-countdown').textContent).toBe('1');

        jest.advanceTimersByTime(1000);
        expect(second.element.querySelector('.js-timer-countdown').textContent).toBe('0');

        jest.advanceTimersByTime(1000);
        expect(second.element.querySelector('.js-timer-countdown').textContent).toBe('ACABOU!');
        expect(second.element.classList.contains('is-finished')).toBe(true);

        second.element.querySelector('.js-start-button').click();

        expect(second.element.classList.contains('is-finished')).toBe(false);
        expect(second.getRemaining()).toBe(30);
    });

    it('persiste layout, tema e timers no localStorage', () => {
        selectLayout(2);
        app.getTimers()[0].setName('Rodada 1');
        body.querySelector('.js-versus-theme-button').click();

        const state = storedState();

        expect(state.layout).toBe(2);
        expect(state.theme).toBe('versus');
        expect(state.timers).toHaveLength(2);
        expect(state.timers[0].name).toBe('Rodada 1');
    });

    it('restaura o estado salvo ao recarregar', () => {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                layout: 4,
                theme: 'versus',
                timers: [
                    { name: 'A', duration: 120, remaining: 90, status: 'PAUSED', endsAt: null },
                    { name: 'B', duration: 60, remaining: 60, status: 'STOPPED', endsAt: null },
                    { name: 'C', duration: 30, remaining: 30, status: 'STOPPED', endsAt: null },
                    { name: 'D', duration: 30, remaining: 30, status: 'STOPPED', endsAt: null },
                ],
            })
        );

        body = mountApp();
        const restored = TimerApp(body);

        expect(restored.getLayout()).toBe(4);
        expect(body.classList.contains('versus-theme')).toBe(true);
        expect(restored.getTimers().map(timer => timer.getName())).toEqual(['A', 'B', 'C', 'D']);
        expect(restored.getTimers()[0].getRemaining()).toBe(90);
    });

    it('ignora um estado salvo inválido', () => {
        window.localStorage.setItem(STORAGE_KEY, '{ nao é json');

        body = mountApp();
        const restored = TimerApp(body);

        expect(restored.getLayout()).toBe(1);
    });
});
