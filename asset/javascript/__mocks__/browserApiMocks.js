Object.defineProperty(document, 'fullscreenElement', {
    value: null,
    writable: true,
});

document.documentElement.requestFullscreen = jest.fn();
document.exitFullscreen = jest.fn();