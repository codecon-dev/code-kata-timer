global.Audio = jest.fn().mockImplementation(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    addEventListener: jest.fn(),
    volume: 0,
    loop: false,
    currentTime: 0,
}));