import {
  hourToSeconds,
  minuteToSeconds,
  secondsToHour,
  secondsToMinute,
  remainingSeconds,
  formatTimeUnit,
} from '../TimeUtils';

describe('TimeUtils', () => {
  test('hourToSeconds converts hours to seconds', () => {
    expect(hourToSeconds(1)).toBe(3600);
    expect(hourToSeconds(0)).toBe(0);
    expect(hourToSeconds(2.5)).toBe(9000);
  });

  test('minuteToSeconds converts minutes to seconds', () => {
    expect(minuteToSeconds(1)).toBe(60);
    expect(minuteToSeconds(0)).toBe(0);
    expect(minuteToSeconds(2.5)).toBe(150);
  });

  test('secondsToHour converts seconds to hours', () => {
    expect(secondsToHour(3600)).toBe(1);
    expect(secondsToHour(0)).toBe(0);
    expect(secondsToHour(3661)).toBe(1);
    expect(secondsToHour(7200)).toBe(2);
  });

  test('secondsToMinute converts seconds to minutes (excluding hours)', () => {
    expect(secondsToMinute(3600)).toBe(0);
    expect(secondsToMinute(3661)).toBe(1);
    expect(secondsToMinute(3720)).toBe(2);
    expect(secondsToMinute(0)).toBe(0);
  });

  test('remainingSeconds returns remaining seconds after minutes', () => {
    expect(remainingSeconds(3661)).toBe(1);
    expect(remainingSeconds(3725)).toBe(5);
    expect(remainingSeconds(3600)).toBe(0);
    expect(remainingSeconds(0)).toBe(0);
  });

  test('formatTimeUnit pads single digits with zero', () => {
    expect(formatTimeUnit(0)).toBe('00');
    expect(formatTimeUnit(5)).toBe('05');
    expect(formatTimeUnit(12)).toBe('12');
    expect(formatTimeUnit(123)).toBe('23');
  });
});