import assert from 'node:assert/strict';
import test from 'node:test';
import { CALENDAR_COLORS, calendarMonths, calendarTarget, isCalendarDate, readCalendar } from '../src/lib/calendar.ts';

function fixture() {
    return [{ firstDay: '2024-02-25', contributionDays: [
        { date: '2024-02-28', weekday: 3, contributionCount: 1, level: 1, color: '#9be9a8' },
        { date: '2024-02-29', weekday: 4, contributionCount: 5, level: 4, color: '#216e39' },
        { date: '2024-03-01', weekday: 5, contributionCount: 0, level: 0, color: '#ebedf0' },
        { date: '2024-03-02', weekday: 6, contributionCount: 2, level: 2, color: '#40c463' },
    ] }, { firstDay: '2024-03-03', contributionDays: [
        { date: '2024-03-03', weekday: 0, contributionCount: 0, level: 0, color: '#ebedf0' },
    ] }];
}
const period = { from: '2024-02-28', to: '2024-03-03', rangeDays: 5, totalContributions: 8 };

test('reads all calendar days including partial weeks and leap day, preserving exact counts and levels', () => {
    const source = fixture();
    const weeks = readCalendar(source, period);
    assert.deepEqual(weeks, source);
    assert.equal(weeks[0].contributionDays[1].date, '2024-02-29');
    assert.equal(weeks[0].contributionDays[1].level, 4);
    assert.equal(weeks[0].contributionDays[1].contributionCount, 5);
    assert.notEqual(weeks, source);
});

test('rejects missing or duplicated days, wrong weekdays, bad levels and unsafe colors', () => {
    for (const mutate of [
        (weeks) => weeks[0].contributionDays.shift(),
        (weeks) => weeks[0].contributionDays[1].date = '2024-02-28',
        (weeks) => weeks[0].contributionDays[1].weekday = 2,
        (weeks) => weeks[0].contributionDays[0].level = 5,
        (weeks) => weeks[0].contributionDays[0].contributionCount = 8,
        (weeks) => weeks[0].contributionDays[0].contributionCount = -1,
        (weeks) => weeks[0].contributionDays[0].color = 'url(https://example.com/tracker)',
        (weeks) => weeks[0].firstDay = '2024-03-10',
        (weeks) => weeks[0].contributionDays[0].date = '2024-02-30',
        (weeks) => weeks.pop(),
        (weeks) => weeks.splice(1, 0, { firstDay: weeks[0].firstDay, contributionDays: weeks[0].contributionDays.splice(2) }),
    ]) {
        const weeks = fixture();
        mutate(weeks);
        assert.equal(readCalendar(weeks, period), null);
    }
    for (const input of [null, {}, [], [null]]) assert.equal(readCalendar(input, period), null);
});

test('strict UTC date parsing accepts leap days and rejects rollover dates', () => {
    assert.equal(isCalendarDate('2024-02-29'), true);
    for (const value of ['2023-02-29', '2024-04-31', '2024-1-1', '2024-01-01T00:00:00Z', null]) assert.equal(isCalendarDate(value), false);
});

test('keyboard navigation moves by day/week and stays inside the actual range', () => {
    for (const [index, key, expected] of [[10, 'ArrowUp', 9], [10, 'ArrowDown', 11], [10, 'ArrowLeft', 3], [10, 'ArrowRight', 17], [0, 'ArrowUp', 0], [0, 'ArrowLeft', 0], [20, 'ArrowRight', 20], [20, 'ArrowDown', 20], [10, 'Home', 0], [10, 'End', 20], [10, 'Tab', null], [10, 'Escape', null]]) {
        assert.equal(calendarTarget(index, key, 21), expected);
    }
    assert.equal(calendarTarget(0, 'ArrowRight', 0), null);
    assert.equal(calendarTarget(0, 'End', 1), 0);
});

test('month labels align with calendar weeks and handle a partial first month', () => {
    assert.deepEqual(calendarMonths(fixture()), [{ column: 0, label: 'mar' }]);
    const weeks = fixture();
    weeks[0].contributionDays = weeks[0].contributionDays.slice(0, 2);
    weeks[1].contributionDays[0].date = '2024-03-01';
    assert.deepEqual(calendarMonths(weeks), [{ column: 0, label: 'feb' }, { column: 1, label: 'mar' }]);
    assert.equal(CALENDAR_COLORS.length, 5);
    assert.equal(new Set(CALENDAR_COLORS).size, 5);
});
