import TimerController, { DEFAULT_SECONDS } from '../TimeController';
import { TimerStatus } from '../TimerStatus';
import { mountTimerCard } from '../__mocks__/timerDom';

describe('TimerController', () => {
    let card;
    let timer;

    const click = selector => card.querySelector(selector).click();
    const displayedTime = () =>
        [
            card.querySelector('.js-hour-input').value,
            card.querySelector('.js-minute-input').value,
            card.querySelector('.js-seconds-input').value,
        ].join(':');

    beforeEach(() => {
        jest.useFakeTimers();
        card = mountTimerCard();
        timer = TimerController(card);
    });

    afterEach(() => {
        timer.destroy();
        jest.useRealTimers();
    });

    it('inicia com o tempo padrão e parado', () => {
        expect(displayedTime()).toBe('00:00:30');
        expect(timer.getStatus()).toBe(TimerStatus.STOPPED);
    });

    it('inicia, pausa e para alternando os botões', () => {
        click('.js-start-button');

        expect(timer.getStatus()).toBe(TimerStatus.RUNNING);
        expect(card.querySelector('.js-start-button').classList.contains('hide')).toBe(true);
        expect(card.querySelector('.js-pause-button').classList.contains('hide')).toBe(false);

        click('.js-pause-button');

        expect(timer.getStatus()).toBe(TimerStatus.PAUSED);
        expect(card.querySelector('.js-start-button').classList.contains('hide')).toBe(false);

        click('.js-stop-button');

        expect(timer.getStatus()).toBe(TimerStatus.STOPPED);
        expect(displayedTime()).toBe('00:00:30');
    });

    it('decrementa com base no relógio, sem depender da frequência do tick', () => {
        const now = Date.now();
        click('.js-start-button');

        expect(timer.tick(now + 500)).toBeNull();
        expect(timer.tick(now + 1000)).toEqual({ second: 29, finished: false });
        expect(displayedTime()).toBe('00:00:29');

        // pulou 5 segundos de uma vez: o tempo restante acompanha o relógio
        expect(timer.tick(now + 6000)).toEqual({ second: 24, finished: false });
    });

    it('entra em countdown nos últimos 10 segundos e finaliza em zero', () => {
        const now = Date.now();
        click('.js-start-button');

        timer.tick(now + 20000);
        expect(timer.getStatus()).toBe(TimerStatus.COUNTDOWN);

        expect(timer.tick(now + 30000)).toEqual({ second: 0, finished: true });
        expect(timer.getStatus()).toBe(TimerStatus.STOPPED);
        expect(card.querySelector('.js-start-button').classList.contains('hide')).toBe(false);
    });

    it('mantém o tempo zerado ao terminar e só volta ao ser reiniciado', () => {
        card.querySelector('.js-edit-button').click();
        card.querySelector('.js-minute-input').value = '02';
        card.querySelector('.js-seconds-input').value = '00';
        card.querySelector('.js-finish-edit-button').click();

        expect(timer.getDuration()).toBe(120);

        const now = Date.now();
        click('.js-start-button');
        timer.tick(now + 120000);

        expect(displayedTime()).toBe('00:00:00');

        jest.advanceTimersByTime(5000);

        expect(displayedTime()).toBe('00:00:00');

        click('.js-stop-button');

        expect(displayedTime()).toBe('00:02:00');
    });

    it('avisa o fim e, um segundo depois, pede a mensagem final', () => {
        const onFinish = jest.fn();
        const onFinishedMessage = jest.fn();

        const otherCard = mountTimerCard();
        const other = TimerController(otherCard, { onFinish, onFinishedMessage });

        const now = Date.now();
        otherCard.querySelector('.js-start-button').click();
        other.tick(now + 30000);

        expect(onFinish).toHaveBeenCalledTimes(1);
        expect(onFinishedMessage).not.toHaveBeenCalled();

        jest.advanceTimersByTime(1000);

        expect(onFinishedMessage).toHaveBeenCalledTimes(1);

        other.destroy();
    });

    it('não mostra a mensagem final se o timer for reiniciado antes', () => {
        const onFinishedMessage = jest.fn();

        const otherCard = mountTimerCard();
        const other = TimerController(otherCard, { onFinishedMessage });

        const now = Date.now();
        otherCard.querySelector('.js-start-button').click();
        other.tick(now + 30000);
        otherCard.querySelector('.js-start-button').click();

        jest.advanceTimersByTime(2000);

        expect(onFinishedMessage).not.toHaveBeenCalled();

        other.destroy();
    });

    it('limpa a mensagem final do card ao reiniciar', () => {
        timer.showFinishedMessage();

        expect(card.classList.contains('is-finished')).toBe(true);
        expect(card.querySelector('.js-timer-countdown').textContent).toBe('ACABOU!');

        click('.js-start-button');

        expect(card.classList.contains('is-finished')).toBe(false);
        expect(card.querySelector('.js-timer-countdown').classList.contains('hide')).toBe(true);
    });

    it('cancelar a edição restaura o valor anterior', () => {
        card.querySelector('.js-edit-button').click();
        card.querySelector('.js-hour-input').value = '05';
        card.querySelector('.js-cancel-edit-button').click();

        expect(displayedTime()).toBe('00:00:30');
        expect(timer.getDuration()).toBe(DEFAULT_SECONDS);
    });

    it('não permite editar enquanto está rodando', () => {
        click('.js-start-button');
        card.querySelector('.js-edit-button').click();

        expect(timer.getStatus()).toBe(TimerStatus.RUNNING);
        expect(card.querySelector('.js-edit-container-stopwatch').classList.contains('hide')).toBe(true);
    });

    it('serializa e restaura nome, duração e tempo restante', () => {
        timer.setName('Rodada 1');
        const snapshot = timer.serialize();

        expect(snapshot).toMatchObject({ name: 'Rodada 1', duration: 30, remaining: 30 });

        const otherCard = mountTimerCard();
        const other = TimerController(otherCard);
        other.restore({ name: 'Rodada 2', duration: 90, remaining: 45, status: TimerStatus.PAUSED });

        expect(other.getName()).toBe('Rodada 2');
        expect(other.getDuration()).toBe(90);
        expect(other.getRemaining()).toBe(45);
        expect(other.getStatus()).toBe(TimerStatus.PAUSED);

        other.destroy();
    });

    it('retoma um timer que estava rodando usando o horário de término salvo', () => {
        timer.restore({
            name: 'Ao vivo',
            duration: 300,
            remaining: 300,
            status: TimerStatus.RUNNING,
            endsAt: Date.now() + 60000,
        });

        expect(timer.getStatus()).toBe(TimerStatus.RUNNING);
        expect(timer.getRemaining()).toBe(60);
    });

    it('restaura um timer que já tinha zerado com a duração cheia', () => {
        timer.restore({ name: 'Bloco', duration: 90, remaining: 0, status: 'STOPPED' });

        expect(timer.getRemaining()).toBe(90);
    });

    it('não retoma um timer cujo horário de término já passou', () => {
        timer.restore({
            duration: 300,
            remaining: 10,
            status: TimerStatus.RUNNING,
            endsAt: Date.now() - 5000,
        });

        expect(timer.getStatus()).toBe(TimerStatus.STOPPED);
        expect(timer.getRemaining()).toBe(300);
    });
});
