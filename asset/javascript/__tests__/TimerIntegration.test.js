import TimerController from '../TimeController';
import { mockElement } from '../__mocks__/domMocks';

jest.mock('../TimeUtils');

describe('TimerController Integration', () => {
    let mockReference;

    beforeEach(() => {
        mockReference = {
            querySelector: jest.fn(selector => {
                if (selector === '.js-stopwatch-action-buttons') {
                    return mockElement();
                }
                if (selector === '.js-edit-container-stopwatch') {
                    return mockElement();
                }
                if (selector === '.js-countdown-container') {
                    return mockElement();
                }
                return mockElement();
            }),
        };
    });

    it('deve iniciar, pausar e parar o timer corretamente', () => {
        const timerController = new TimerController(mockReference);
    
        const startButton = mockReference.querySelector('.js-stopwatch-action-buttons').querySelector('.js-start-button');
        expect(startButton.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    
        const startHandler = startButton.addEventListener.mock.calls[0][1];
        startHandler();
    
        expect(startButton.hideElement).toHaveBeenCalled();
    
        const pauseButton = mockReference.querySelector('.js-stopwatch-action-buttons').querySelector('.js-pause-button');
        expect(pauseButton.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    
        const pauseHandler = pauseButton.addEventListener.mock.calls[0][1];
        pauseHandler();
    
        expect(pauseButton.hideElement).toHaveBeenCalled();
    });
});