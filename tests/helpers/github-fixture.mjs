// Loaded ONLY by the integration test's child process through node --import.
// Production code has no fixture switch or test-only HTTP route.
const attempts = new Map();

function calendar(username) {
    const totals = { alice: 10, bob: 4, equal: 10, zero: 0 };
    const total = totals[username] ?? 6;
    const start = Date.parse(username === 'different' ? '2026-01-02' : '2026-01-01');
    const weeks = new Map();
    for (let index = 0; index < 7; index++) {
        const timestamp = start + index * 86_400_000;
        const weekday = new Date(timestamp).getUTCDay();
        const firstDay = new Date(timestamp - weekday * 86_400_000).toISOString().slice(0, 10);
        if (!weeks.has(firstDay)) weeks.set(firstDay, { first_day: firstDay, contribution_days: [] });
        weeks.get(firstDay).contribution_days.push({ weekday, count: index === 0 ? total : 0, level: index === 0 && total > 0 ? 3 : 0 });
    }
    return {
        schema: 'v2', generated_at: '2026-01-08T12:00:00Z',
        from: new Date(start).toISOString().slice(0, 10),
        to: new Date(start + 6 * 86_400_000).toISOString().slice(0, 10),
        range_days: 7, total_contributions: total,
        private_contributions_included: username === 'alice',
        colors_full: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
        weeks: [...weeks.values()],
    };
}

globalThis.fetch = async (input, options = {}) => {
    const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url);
    if (url.origin !== 'https://github.com' || !/^\/[a-z\d-]+\.contribs$/.test(url.pathname)) {
        throw new Error('Unexpected outbound request blocked by integration fixture');
    }
    const username = url.pathname.slice(1, -'.contribs'.length);
    const attempt = (attempts.get(username) ?? 0) + 1;
    attempts.set(username, attempt);
    if (username === 'ghost') return Response.json({ error: 'Not Found' }, { status: 404 });
    if (username === 'busy' && attempt === 1) return Response.json({ error: 'Rate limited' }, { status: 429 });
    if (username === 'broken') return Response.json({ schema: 'unsupported' });
    if (username === 'slow') {
        await new Promise((resolve, reject) => {
            const timer = setTimeout(resolve, 250);
            options.signal?.addEventListener('abort', () => {
                clearTimeout(timer);
                reject(new DOMException('Aborted', 'AbortError'));
            }, { once: true });
        });
    }
    return Response.json(calendar(username));
};
