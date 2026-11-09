import assert from 'node:assert/strict';
import test from 'node:test';
import { ContributionError, createContributionService, normalizeContributions } from '../src/lib/contributions.ts';
import { contributionResponse } from '../src/lib/contribution-response.ts';

// Representative v2 response, including two partial weeks and a year boundary.
function fixture() {
    return {
        schema: 'v2', generated_at: '2026-01-06T12:00:00Z',
        from: '2025-12-31', to: '2026-01-06', range_days: 7,
        total_contributions: 6, private_contributions_included: true,
        colors_full: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
        weeks: [
            { first_day: '2025-12-28', contribution_days: [
                { weekday: 3, count: 0, level: 0 }, { weekday: 4, count: 1, level: 1 },
                { weekday: 5, count: 2, level: 2 }, { weekday: 6, count: 3, level: 3 },
            ] },
            { first_day: '2026-01-04', contribution_days: [
                { weekday: 0, count: 0, level: 0 }, { weekday: 1, count: 0, level: 0 },
                { weekday: 2, count: 0, level: 0 },
            ] },
        ],
    };
}
const json = (data = fixture()) => Response.json(data);
const errorCode = (code, status) => (error) => error instanceof ContributionError && error.code === code && error.status === status;

test('normalizes v2 into explicitly dated days, correct colors, totals and privacy metadata', () => {
    const result = normalizeContributions(fixture(), 'octocat');
    assert.equal(result.username, 'octocat');
    assert.equal(result.totalContributions, 6);
    assert.equal(result.rangeDays, 7);
    assert.equal(result.privateContributionsIncluded, true);
    const days = result.weeks.flatMap((week) => week.contributionDays);
    assert.deepEqual(days.map((day) => day.date), ['2025-12-31', '2026-01-01', '2026-01-02', '2026-01-03', '2026-01-04', '2026-01-05', '2026-01-06']);
    assert.equal(days[2].color, '#40c463');
    assert.equal(days[2].contributionCount, 2);
});

test('supports users with no contributions', () => {
    const data = fixture();
    for (const week of data.weeks) for (const day of week.contribution_days) { day.count = 0; day.level = 0; }
    data.total_contributions = 0;
    assert.equal(normalizeContributions(data, 'octocat').totalContributions, 0);
});

test('uses UTC dates and includes February 29 in a leap year', () => {
    const data = fixture();
    data.from = '2024-02-28';
    data.to = '2024-03-05';
    data.weeks[0].first_day = '2024-02-25';
    data.weeks[1].first_day = '2024-03-03';
    const days = normalizeContributions(data, 'octocat').weeks.flatMap((week) => week.contributionDays);
    assert.equal(days[1].date, '2024-02-29');
    assert.equal(days.at(-1).date, '2024-03-05');
});

test('rejects incompatible, malformed, incomplete, duplicate or inconsistent upstream data', () => {
    for (const mutate of [
        (data) => data.schema = 'v3',
        (data) => data.from = '2025-02-30',
        (data) => data.to = '2025-01-01',
        (data) => data.range_days = 8,
        (data) => data.total_contributions++,
        (data) => data.colors_full[0] = 'javascript:alert(1)',
        (data) => data.weeks[0].contribution_days[0].level = 5,
        (data) => data.weeks[0].contribution_days[0].count = -1,
        (data) => data.weeks[0].contribution_days[0].count = 0.5,
        (data) => data.weeks[0].contribution_days[1].weekday = 3,
        (data) => data.weeks[0].contribution_days.shift(),
        (data) => data.weeks.pop(),
        (data) => data.generated_at = 'invalid',
        (data) => data.private_contributions_included = 'yes',
    ]) {
        const data = fixture();
        mutate(data);
        assert.throws(() => normalizeContributions(data, 'octocat'), errorCode('INVALID_UPSTREAM_DATA', 502));
    }
    for (const data of [null, [], {}, 'invalid']) assert.throws(() => normalizeContributions(data, 'octocat'), errorCode('INVALID_UPSTREAM_DATA', 502));
});

test('rejects invalid usernames before making any upstream request', async () => {
    const load = createContributionService({ fetcher: () => { throw new Error('Should not fetch'); } });
    for (const username of [undefined, '', '-user', 'user-', 'user--name', 'two words', 'user/name', '../admin', '@user', 'a'.repeat(40), 'ñ']) {
        await assert.rejects(load(username), errorCode('INVALID_USERNAME', 400));
    }
});

test('accepts valid username boundaries and only calls the fixed GitHub host', async () => {
    const urls = [];
    const load = createContributionService({ fetcher: async (url, options) => {
        urls.push(url);
        assert.equal(options.redirect, 'error');
        return json();
    } });
    for (const username of ['A', 'a'.repeat(39), 'valid-user-123']) await load(username);
    assert.deepEqual(urls, ['https://github.com/a.contribs', `https://github.com/${'a'.repeat(39)}.contribs`, 'https://github.com/valid-user-123.contribs']);
});

test('maps upstream status, invalid JSON, HTML and network failures to safe API errors', async () => {
    for (const [fetcher, code, status] of [
        [async () => new Response('', { status: 404 }), 'USER_NOT_FOUND', 404],
        [async () => new Response('', { status: 403 }), 'UPSTREAM_UNAVAILABLE', 503],
        [async () => new Response('', { status: 429 }), 'UPSTREAM_UNAVAILABLE', 503],
        [async () => new Response('', { status: 500 }), 'UPSTREAM_ERROR', 502],
        [async () => new Response('{', { headers: { 'Content-Type': 'application/json' } }), 'INVALID_UPSTREAM_DATA', 502],
        [async () => new Response('<html>upstream login</html>'), 'INVALID_UPSTREAM_DATA', 502],
        [async () => { throw new TypeError('internal network details'); }, 'UPSTREAM_ERROR', 502],
    ]) await assert.rejects(createContributionService({ fetcher })('octocat'), errorCode(code, status));
});

test('timeout aborts the upstream request and also covers response body reads', async () => {
    for (const bodyWait of [false, true]) {
        let aborted = false;
        const load = createContributionService({ timeoutMs: 10, fetcher: async (_, { signal }) => {
            const waiting = () => new Promise((_, reject) => signal.addEventListener('abort', () => {
                aborted = true;
                reject(new DOMException('Aborted', 'AbortError'));
            }, { once: true }));
            return bodyWait ? { ok: true, headers: new Headers({ 'Content-Type': 'application/json' }), json: waiting } : waiting();
        } });
        await assert.rejects(load('octocat'), errorCode('UPSTREAM_TIMEOUT', 504));
        assert.equal(aborted, true);
    }
});

test('shares concurrent requests, caches case-insensitively and expires at TTL and UTC rollover', async () => {
    let calls = 0;
    let clock = Date.parse('2026-01-06T23:59:59Z');
    const load = createContributionService({ now: () => clock, ttlMs: 5000, fetcher: async () => { calls++; return json(); } });
    const [first, second] = await Promise.all([load('Octocat'), load('octocat')]);
    assert.deepEqual(first, second);
    await load('OCTOCAT');
    assert.equal(calls, 1);
    clock += 1000;
    await load('octocat');
    assert.equal(calls, 2, 'new UTC day refreshes data even before TTL');
    clock += 5000;
    await load('octocat');
    assert.equal(calls, 3, 'TTL boundary refreshes data');
});

test('bounds cache storage and concurrent unique requests', async () => {
    let calls = 0;
    const load = createContributionService({ maxEntries: 1, fetcher: async () => { calls++; return json(); } });
    await load('one'); await load('two'); await load('one');
    assert.equal(calls, 3);
    let release;
    const waiting = createContributionService({ maxEntries: 1, fetcher: () => new Promise((resolve) => release = () => resolve(json())) });
    const first = waiting('one');
    await assert.rejects(waiting('two'), errorCode('SERVER_BUSY', 503));
    release();
    await first;
});

test('failures are not cached and do not leave stuck in-flight requests', async () => {
    let calls = 0;
    const load = createContributionService({ fetcher: async () => ++calls === 1 ? new Response('', { status: 500 }) : json() });
    await assert.rejects(load('octocat'));
    await load('octocat');
    assert.equal(calls, 2);
});

test('HTTP response contract includes JSON, no-store and stable errors without internal details', async () => {
    const response = await contributionResponse('octocat', createContributionService({ fetcher: async () => json() }));
    assert.equal(response.status, 200);
    assert.match(response.headers.get('Content-Type'), /application\/json/);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.equal((await response.json()).totalContributions, 6);
    for (const [error, status, code] of [
        [new ContributionError(404, 'USER_NOT_FOUND', 'GitHub user not found.'), 404, 'USER_NOT_FOUND'],
        [new ContributionError(503, 'UPSTREAM_UNAVAILABLE', 'Try later.'), 503, 'UPSTREAM_UNAVAILABLE'],
        [new Error('secret infrastructure details'), 500, 'INTERNAL_ERROR'],
    ]) {
        const response = await contributionResponse('octocat', async () => { throw error; });
        assert.equal(response.status, status);
        assert.equal(response.headers.get('Cache-Control'), 'no-store');
        assert.equal(response.headers.get('Retry-After'), status === 503 ? '60' : null);
        const body = await response.json();
        assert.equal(body.code, code);
        assert.ok(!body.error.includes('secret'));
    }
});
