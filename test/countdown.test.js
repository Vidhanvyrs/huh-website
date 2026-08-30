import test from 'node:test';
import assert from 'node:assert/strict';
import { formatLaunchLabel, formatUnit, getCountdown } from '../src/countdown.js';

test('countdown exposes all 48 launch hours instead of resetting at 24', () => {
    const now = Date.parse('2026-08-30T20:06:00+05:30');
    const result = getCountdown('2026-09-01T20:06:00+05:30', now);

    assert.deepEqual(result, { complete: false, hours: 48, minutes: 0, seconds: 0 });
    assert.equal(formatUnit(result.hours), '48');
});

test('countdown stops cleanly at zero after launch', () => {
    const result = getCountdown(
        '2026-09-01T20:06:00+05:30',
        Date.parse('2026-09-01T20:07:00+05:30'),
    );

    assert.deepEqual(result, { complete: true, hours: 0, minutes: 0, seconds: 0 });
});

test('launch label is derived from the configured timestamp in IST', () => {
    assert.equal(
        formatLaunchLabel('2026-09-01T20:06:00+05:30'),
        '01 SEP 2026 · 8:06 PM IST',
    );
});
