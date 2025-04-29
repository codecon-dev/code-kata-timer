export const mockElement = (() => {
    const cache = {};

    return () => ({
        querySelector: jest.fn(selector => {
            if (!cache[selector]) {
                if (String(selector).includes('.js-*-button')) {
                    cache[selector] = {
                        addEventListener: jest.fn(),
                        hideElement: jest.fn(),
                        showElement: jest.fn(),
                    };
                } else {
                    cache[selector] = mockElement();
                }
            }
            return cache[selector];
        }),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        focus: jest.fn(),
        hideElement: jest.fn(),
        showElement: jest.fn(),
        classList: {
            add: jest.fn(),
            remove: jest.fn(),
        },
        value: '00',
        textContent: '',
        disabled: false,
    });
})();