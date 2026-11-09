import assert from 'node:assert/strict';
import test from 'node:test';
import { BattleError, comparePlayers, runBattle, validatePlayers } from '../src/lib/battle.ts';

const player = (username, totalContributions = 10, changes = {}) => {
    const weeks = [
        { firstDay: '2025-12-28', contributionDays: [] },
        { firstDay: '2026-01-04', contributionDays: [] },
    ];
    for (let index = 0; index < 7; index++) {
        const date = `2026-01-0${index + 1}`;
        const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
        weeks[index < 3 ? 0 : 1].contributionDays.push({ date, weekday, contributionCount: index === 0 ? totalContributions : 0, level: index === 0 && totalContributions > 0 ? 2 : 0, color: '#40c463' });
    }
    return { username, totalContributions, from: '2026-01-01', to: '2026-01-07', rangeDays: 7, privateContributionsIncluded: false, weeks, ...changes };
};

test('validates both players, trims whitespace and normalizes casing before querying', async () => {
    assert.deepEqual(validatePlayers('  Octocat ', ' LuisUmina  '), ['octocat', 'luisumina']);
    for (const [first, second, index] of [['', 'valid', 0], ['valid', ' ', 1], ['@user', 'valid', 0], ['valid', 'bad--name', 1], ['a'.repeat(40), 'valid', 0]]) {
        let calls = 0;
        await assert.rejects(runBattle(first, second, { fetcher: async () => { calls++; } }),
            (error) => error instanceof BattleError && error.inputIndex === index);
        assert.equal(calls, 0);
    }
});

test('compares totals fairly in both directions, including ties and zero activity', () => {
    for (const [first, second, winner, difference] of [[10, 3, 0, 7], [3, 10, 1, 7], [5, 5, null, 0], [0, 0, null, 0], [0, 1, 1, 1]]) {
        const result = comparePlayers(player('one', first), player('two', second));
        assert.equal(result.winner, winner);
        assert.equal(result.difference, difference);
        assert.equal(result.players[0].username, 'one');
    }
});

test('refuses to declare a winner when contribution periods differ', () => {
    for (const changes of [{ from: '2025-12-31' }, { to: '2026-01-08' }, { rangeDays: 8 }]) {
        assert.throws(() => comparePlayers(player('one'), player('two', 99, changes)), /períodos/);
    }
});

test('starts both requests in parallel and passes the shared cancellation signal', async () => {
    const requests = [];
    const controller = new AbortController();
    const fetcher = (url, options) => new Promise((resolve) => requests.push({ url, signal: options.signal, resolve }));
    const pending = runBattle('  ONE ', 'Two', { fetcher, signal: controller.signal });
    assert.equal(requests.length, 2, 'both requests start without waiting for the first');
    assert.equal(requests[0].signal, controller.signal);
    assert.equal(requests[1].signal, controller.signal);
    assert.deepEqual(requests.map((request) => request.url), ['/api/contributions/one', '/api/contributions/two']);
    requests[1].resolve(Response.json(player('two', 30, { privateContributionsIncluded: true })));
    requests[0].resolve(Response.json(player('one', 10)));
    const result = await pending;
    assert.equal(result.winner, 1);
    assert.equal(result.players[1].privateContributionsIncluded, true);
    assert.equal(result.players[1].weeks.flatMap((week) => week.contributionDays).length, 7);
});

test('permits comparing the same username and returns a tie', async () => {
    const result = await runBattle('Octocat', 'octocat', { fetcher: async () => Response.json(player('octocat')) });
    assert.equal(result.winner, null);
    assert.equal(result.difference, 0);
});

test('reports invalid and nonexistent users with the correct field, without exposing upstream content', async () => {
    for (const index of [0, 1]) {
        for (const status of [400, 404]) {
            await assert.rejects(runBattle('one', 'two', { fetcher: async (url) => url.endsWith(index === 0 ? 'one' : 'two')
                ? new Response('<script>upstream details</script>', { status })
                : Response.json(player(index === 0 ? 'two' : 'one')) }),
            (error) => error instanceof BattleError && error.inputIndex === index && !error.message.includes('script'));
        }
    }
});

test('handles unavailable service, server timeout and network errors with actionable messages', async () => {
    for (const [fetcher, message] of [
        [async () => new Response('', { status: 503 }), /minuto/],
        [async () => new Response('', { status: 504 }), /demasiado/],
        [async () => new Response('', { status: 502 }), /obtener/],
        [async () => { throw new TypeError('secret internal details'); }, /conexión/],
    ]) await assert.rejects(runBattle('one', 'two', { fetcher }), message);
});

test('rejects malformed JSON and incomplete or inconsistent successful responses', async () => {
    for (const data of [null, {}, [], player('other-user'), player('one', -1), player('one', 1.5), player('one', 10, { from: '2026-02-30' }), player('one', 10, { rangeDays: 8 }), player('one', 10, { privateContributionsIncluded: 'yes' }), player('one', 10, { weeks: [] })]) {
        await assert.rejects(runBattle('one', 'two', { fetcher: async (url) => Response.json(url.endsWith('one') ? data : player('two')) }), /datos válidos/);
    }
    await assert.rejects(runBattle('one', 'two', { fetcher: async () => new Response('<html>not JSON</html>') }), /leer la respuesta/);
});

test('allows retrying after a failed request', async () => {
    const fetcher = async (url) => Response.json(player(url.split('/').at(-1)));
    await assert.rejects(runBattle('one', 'two', { fetcher: async () => new Response('', { status: 503 }) }));
    assert.equal((await runBattle('one', 'two', { fetcher })).winner, null);
});

test('propagates cancellation instead of misreporting it as a connection failure', async () => {
    const controller = new AbortController();
    const pending = runBattle('one', 'two', { signal: controller.signal, fetcher: (_, { signal }) => new Promise((_, reject) => {
        signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
    }) });
    controller.abort();
    await assert.rejects(pending, { name: 'AbortError' });
});
