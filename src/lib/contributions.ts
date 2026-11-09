/** Data exposed by our API, independent of GitHub's upstream response format. */
export interface ContributionDay {
    date: string;
    weekday: number;
    contributionCount: number;
    level: number;
    color: string;
}

export interface Contributions {
    username: string;
    from: string;
    to: string;
    rangeDays: number;
    totalContributions: number;
    privateContributionsIncluded: boolean;
    generatedAt: string;
    colors: string[];
    weeks: { firstDay: string; contributionDays: ContributionDay[] }[];
}

export class ContributionError extends Error {
    status: number;
    code: string;

    constructor(status: number, code: string, message: string) {
        super(message);
        this.name = 'ContributionError';
        this.status = status;
        this.code = code;
    }
}

const DAY_MS = 86_400_000;
const USERNAME = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

function requireValid(condition: unknown): asserts condition {
    if (!condition) throw new ContributionError(502, 'INVALID_UPSTREAM_DATA', 'GitHub returned an unsupported contribution response.');
}

function object(value: unknown): Record<string, unknown> {
    requireValid(value !== null && typeof value === 'object' && !Array.isArray(value));
    return value as Record<string, unknown>;
}

function integer(value: unknown, max = Number.MAX_SAFE_INTEGER): number {
    requireValid(typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 && value <= max);
    return value;
}

function date(value: unknown): string {
    requireValid(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value));
    const parsed = new Date(`${value}T00:00:00Z`);
    requireValid(Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value);
    return value;
}

export function normalizeContributions(value: unknown, username: string): Contributions {
    const data = object(value);
    requireValid(data.schema === 'v2');
    const from = date(data.from);
    const to = date(data.to);
    const rangeDays = (Date.parse(to) - Date.parse(from)) / DAY_MS + 1;
    requireValid(rangeDays >= 1 && rangeDays <= 367 && data.range_days === rangeDays);
    requireValid(typeof data.generated_at === 'string' && Number.isFinite(Date.parse(data.generated_at)));
    requireValid(typeof data.private_contributions_included === 'boolean');
    requireValid(Array.isArray(data.colors_full) && data.colors_full.length === 5);
    const colors = data.colors_full.map((color: unknown) => {
        requireValid(typeof color === 'string' && /^#[a-f\d]{6}$/i.test(color));
        return color;
    });
    requireValid(Array.isArray(data.weeks) && data.weeks.length > 0 && data.weeks.length <= 54);
    let nextDate = Date.parse(from);
    let total = 0;
    const weeks = data.weeks.map((value: unknown) => {
        const week = object(value);
        const firstDay = date(week.first_day);
        const firstTime = Date.parse(firstDay);
        const sunday = firstTime - new Date(firstTime).getUTCDay() * DAY_MS;
        requireValid(Array.isArray(week.contribution_days) && week.contribution_days.length >= 1 && week.contribution_days.length <= 7);
        const contributionDays = week.contribution_days.map((value: unknown) => {
            const day = object(value);
            const weekday = integer(day.weekday, 6);
            const timestamp = sunday + weekday * DAY_MS;
            // Reject missing/duplicate/out-of-order days and dates outside the declared range.
            requireValid(timestamp === nextDate && timestamp <= Date.parse(to));
            nextDate += DAY_MS;
            const contributionCount = integer(day.count);
            const level = integer(day.level, 4);
            total += contributionCount;
            requireValid(Number.isSafeInteger(total));
            return { date: new Date(timestamp).toISOString().slice(0, 10), weekday, contributionCount, level, color: colors[level] };
        });
        return { firstDay, contributionDays };
    });
    requireValid(nextDate === Date.parse(to) + DAY_MS && integer(data.total_contributions) === total);
    return {
        username, from, to, rangeDays, totalContributions: total,
        privateContributionsIncluded: data.private_contributions_included,
        generatedAt: data.generated_at, colors, weeks,
    };
}

interface ServiceOptions {
    fetcher?: typeof fetch;
    now?: () => number;
    timeoutMs?: number;
    ttlMs?: number;
    maxEntries?: number;
}

/** Cache is bounded, process-local, and shared by requests handled by this server. */
export function createContributionService(options: ServiceOptions = {}) {
    const fetcher = options.fetcher ?? fetch;
    const now = options.now ?? Date.now;
    const timeoutMs = options.timeoutMs ?? 10_000;
    const ttlMs = options.ttlMs ?? 300_000;
    const maxEntries = options.maxEntries ?? 100;
    if (![timeoutMs, ttlMs, maxEntries].every((value) => Number.isSafeInteger(value) && value > 0)) {
        throw new Error('Contribution service limits must be positive integers.');
    }
    const cache = new Map<string, { expires: number; day: string; data: Contributions }>();
    const pending = new Map<string, Promise<Contributions>>();

    async function request(username: string): Promise<Contributions> {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetcher(`https://github.com/${encodeURIComponent(username)}.contribs`, {
                headers: { Accept: 'application/json', 'User-Agent': 'Mona-Mayhem' },
                signal: controller.signal,
                redirect: 'error',
            });
            if (response.status === 404) throw new ContributionError(404, 'USER_NOT_FOUND', 'GitHub user not found.');
            if (response.status === 429 || response.status === 403) {
                throw new ContributionError(503, 'UPSTREAM_UNAVAILABLE', 'GitHub is temporarily limiting requests. Try again later.');
            }
            if (!response.ok) throw new ContributionError(502, 'UPSTREAM_ERROR', 'Unable to retrieve GitHub contributions.');
            requireValid(response.headers.get('content-type')?.includes('application/json'));
            return normalizeContributions(await response.json(), username);
        } catch (error) {
            if (controller.signal.aborted) throw new ContributionError(504, 'UPSTREAM_TIMEOUT', 'GitHub took too long to respond.');
            if (error instanceof ContributionError) throw error;
            if (error instanceof SyntaxError) throw new ContributionError(502, 'INVALID_UPSTREAM_DATA', 'GitHub returned invalid JSON.');
            throw new ContributionError(502, 'UPSTREAM_ERROR', 'Unable to retrieve GitHub contributions.');
        } finally {
            clearTimeout(timer);
        }
    }

    return async function getContributions(input: string | undefined): Promise<Contributions> {
        if (!input || !USERNAME.test(input)) {
            throw new ContributionError(400, 'INVALID_USERNAME', 'Use a GitHub username of 1–39 letters, digits, or single internal hyphens.');
        }
        const username = input.toLowerCase();
        const today = new Date(now()).toISOString().slice(0, 10);
        for (const [key, entry] of cache) {
            if (entry.expires <= now() || entry.day !== today) cache.delete(key);
        }
        const hit = cache.get(username);
        if (hit) return hit.data;
        const existing = pending.get(username);
        if (existing) return existing;
        if (pending.size >= maxEntries) {
            throw new ContributionError(503, 'SERVER_BUSY', 'Too many contribution requests. Try again later.');
        }
        const result = request(username).then((data) => {
            if (cache.size >= maxEntries) cache.delete(cache.keys().next().value!);
            cache.set(username, { data, expires: now() + ttlMs, day: today });
            return data;
        }).finally(() => pending.delete(username));
        pending.set(username, result);
        return result;
    };
}

export const getContributions = createContributionService();
