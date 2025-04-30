import { TimerStatus } from '../TimerStatus';

describe('TimerStatus', () => {
  test('should have correct status values', () => {
    expect(TimerStatus.STOPPED).toBe('STOPPED');
    expect(TimerStatus.PAUSED).toBe('PAUSED');
    expect(TimerStatus.COUNTDOWN).toBe('COUNTDOWN');
    expect(TimerStatus.RUNNING).toBe('RUNNING');
    expect(TimerStatus.EDITING).toBe('EDITING');
  });

  test('isRunning returns true only for RUNNING', () => {
    expect(TimerStatus.isRunning('RUNNING')).toBe(true);
    expect(TimerStatus.isRunning('PAUSED')).toBe(false);
  });

  test('isCountdown returns true only for COUNTDOWN', () => {
    expect(TimerStatus.isCountdown('COUNTDOWN')).toBe(true);
    expect(TimerStatus.isCountdown('RUNNING')).toBe(false);
  });

  test('isPaused returns true only for PAUSED', () => {
    expect(TimerStatus.isPaused('PAUSED')).toBe(true);
    expect(TimerStatus.isPaused('STOPPED')).toBe(false);
  });

  test('isStopped returns true only for STOPPED', () => {
    expect(TimerStatus.isStopped('STOPPED')).toBe(true);
    expect(TimerStatus.isStopped('EDITING')).toBe(false);
  });
});
