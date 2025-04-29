import TimerController from '../TimeController';
import * as TimeUtils from '../TimeUtils';

jest.mock('../TimeUtils');

describe('TimerController', () => {
    let mockReference;

    beforeEach(() => {
        mockReference = {
            querySelector: jest.fn(selector => {
                if (String(selector).includes('input')) {
                    return {
                        addEventListener: jest.fn(),
                        value: '00',
                        disabled: false,
                    };
                }
                if (selector === '.js-stopwatch-action-buttons') {
                    return {
                        querySelector: jest.fn(innerSelector => {
                            if (innerSelector === '.js-start-button') {
                                return {
                                    addEventListener: jest.fn(),
                                    hideElement: jest.fn(),
                                    showElement: jest.fn(),
                                };
                            }
                            return {
                                addEventListener: jest.fn(),
                                hideElement: jest.fn(),
                                showElement: jest.fn(),
                            };
                        }),
                        hideElement: jest.fn(),
                        showElement: jest.fn(),
                    };
                }
                if (selector === '.js-edit-container-stopwatch') {
                    return {
                        querySelector: jest.fn(innerSelector => ({
                            addEventListener: jest.fn(),
                            hideElement: jest.fn(),
                            showElement: jest.fn(),
                        })),
                        hideElement: jest.fn(),
                        showElement: jest.fn(),
                    };
                }
                if (selector === '.js-countdown-container') {
                    return {
                        querySelector: jest.fn(innerSelector => {
                            if (innerSelector === '.js-close-countdown-button') {
                                return {
                                    addEventListener: jest.fn(),
                                };
                            }
                            return {
                                textContent: '',
                            };
                        }),
                        hideElement: jest.fn(),
                        showElement: jest.fn(),
                        classList: {
                            add: jest.fn(),
                            remove: jest.fn(),
                        },
                        textContent: '',
                    };
                }
                if (selector === '.js-stopwatch-action-buttons') {
                    return {
                        querySelector: jest.fn(innerSelector => {
                            if (innerSelector === '.js-start-button') {
                                const mockAddEventListener = jest.fn();
                                return {
                                    addEventListener: mockAddEventListener,
                                    hideElement: jest.fn(),
                                    showElement: jest.fn(),
                                };
                            }
                            if (innerSelector === '.js-pause-button') {
                                return {
                                    addEventListener: jest.fn(),
                                    hideElement: jest.fn(),
                                    showElement: jest.fn(),
                                };
                            }
                            return {
                                addEventListener: jest.fn(),
                                hideElement: jest.fn(),
                                showElement: jest.fn(),
                            };
                        }),
                        hideElement: jest.fn(),
                        showElement: jest.fn(),
                    };
                }
                return {
                    addEventListener: jest.fn(),
                    hideElement: jest.fn(),
                    showElement: jest.fn(),
                    focus: jest.fn(),
                    value: '00',
                    classList: { add: jest.fn(), remove: jest.fn() },
                };
            }),
        };
    });


    it('deve inicializar corretamente', () => {
        const timerController = new TimerController(mockReference);
        expect(mockReference.querySelector).toHaveBeenCalledWith('.js-hour-input');
    });

    it('deve formatar corretamente os valores de tempo', () => {
        TimeUtils.formatTimeUnit.mockReturnValue('05');
        const result = TimeUtils.formatTimeUnit(5);
        expect(result).toBe('05');
        expect(TimeUtils.formatTimeUnit).toHaveBeenCalledWith(5);
    });
});