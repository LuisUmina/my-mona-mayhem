import type { Contributions } from './contributions.ts';

export const CALENDAR_COLORS = ['#202b36', '#0e4429', '#006d32', '#26a641', '#39d353'];
const DAY_MS = 86_400_000;
type Calendar = Contributions['weeks'];
type Period = Pick<Contributions, 'from' | 'to' | 'rangeDays' | 'totalContributions'>;

export function isCalendarDate(value: unknown): value is string {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function record(value: unknown): Record<string, unknown> | null {
    return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

/** Check the normalized calendar again at the browser boundary before rendering it. */
export function readCalendar(value: unknown, period: Period): Calendar | null {
    if (!Array.isArray(value) || value.length < 1 || value.length > 54) return null;
    const weeks: Calendar = [];
    let nextDay = Date.parse(period.from);
    let total = 0;
    let count = 0;
    let previousSunday: number | undefined;
    for (const entry of value) {
        const week = record(entry);
        if (!week || !isCalendarDate(week.firstDay) || !Array.isArray(week.contributionDays)
            || week.contributionDays.length < 1 || week.contributionDays.length > 7) return null;
        const first = Date.parse(week.firstDay);
        const sunday = first - new Date(first).getUTCDay() * DAY_MS;
        if (previousSunday !== undefined && sunday !== previousSunday + 7 * DAY_MS) return null;
        previousSunday = sunday;
        const contributionDays: Calendar[number]['contributionDays'] = [];
        for (const entry of week.contributionDays) {
            const day = record(entry);
            if (!day || !isCalendarDate(day.date) || Date.parse(day.date) !== nextDay
                || day.weekday !== new Date(nextDay).getUTCDay()
                || nextDay < sunday || nextDay > sunday + 6 * DAY_MS
                || typeof day.contributionCount !== 'number' || !Number.isSafeInteger(day.contributionCount) || day.contributionCount < 0
                || typeof day.level !== 'number' || !Number.isInteger(day.level) || day.level < 0 || day.level > 4
                || typeof day.color !== 'string' || !/^#[a-f\d]{6}$/i.test(day.color)) return null;
            contributionDays.push({ date: day.date, weekday: day.weekday as number, contributionCount: day.contributionCount, level: day.level, color: day.color });
            total += day.contributionCount;
            count++;
            nextDay += DAY_MS;
        }
        weeks.push({ firstDay: week.firstDay, contributionDays });
    }
    return count === period.rangeDays && nextDay === Date.parse(period.to) + DAY_MS
        && Number.isSafeInteger(total) && total === period.totalContributions ? weeks : null;
}

export function calendarMonths(weeks: Calendar): { column: number; label: string }[] {
    const month = new Intl.DateTimeFormat('es', { month: 'short', timeZone: 'UTC' });
    return weeks.flatMap((week, column) => {
        const day = week.contributionDays.find((day) => day.date.endsWith('-01')) ?? (column === 0 ? week.contributionDays[0] : undefined);
        return day ? [{ column, label: month.format(new Date(`${day.date}T00:00:00Z`)).replace('.', '') }] : [];
    });
}

export function calendarTarget(index: number, key: string, length: number): number | null {
    if (length < 1) return null;
    const deltas: Record<string, number> = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 };
    if (key === 'Home') return 0;
    if (key === 'End') return length - 1;
    if (!Object.hasOwn(deltas, key)) return null;
    return Math.max(0, Math.min(length - 1, index + deltas[key]));
}
