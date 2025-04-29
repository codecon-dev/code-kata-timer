import { jest } from '@jest/globals';

// Mock de dependências externas
jest.mock('../../sound/tick-tack.wav', () => 'tick-tack.wav');
jest.mock('../../sound/stop.mp3', () => 'stop.mp3');
jest.mock('../helper.js', () => ({}), { virtual: true });

// Mock do TimerStatus e TimeUtils
jest.mock('../TimerStatus.js', () => ({
  TimerStatus: {
    STOPPED: 'STOPPED',
    PAUSED: 'PAUSED',
    COUNTDOWN: 'COUNTDOWN',
    RUNNING: 'RUNNING',
    EDITING: 'EDITING',
    isRunning: jest.fn(),
    isCountdown: jest.fn(),
    isPaused: jest.fn(),
    isStopped: jest.fn(),
  }
}));

jest.mock('../TimeUtils.js', () => ({
  formatTimeUnit: jest.fn(v => String(v).padStart(2, '0').slice(-2)),
  hourToSeconds: jest.fn(h => h * 3600),
  minuteToSeconds: jest.fn(m => m * 60),
  remainingSeconds: jest.fn(s => s % 60),
  secondsToHour: jest.fn(s => Math.floor(s / 3600)),
  secondsToMinute: jest.fn(s => Math.floor((s % 3600) / 60)),
}));
function createMockInput() {
  return {
    value: '00',
    addEventListener: jest.fn(),
    focus: jest.fn(),
    disabled: false,
  };
}
function createMockButton() {
  return {
    addEventListener: jest.fn(),
    showElement: jest.fn(),
    hideElement: jest.fn(),
    focus: jest.fn(),
  };
}
function createMockContainer() {
  return {
    querySelector: jest.fn((selector) => {
      if (selector.includes('input')) return createMockInput();
      if (selector.includes('button')) return createMockButton();
      if (selector.includes('number')) return { textContent: '', classList: { add: jest.fn(), remove: jest.fn() } };
      return {};
    }),
    showElement: jest.fn(),
    hideElement: jest.fn(),
    classList: { add: jest.fn(), remove: jest.fn() },
  };
}

export { createMockInput, createMockButton, createMockContainer };