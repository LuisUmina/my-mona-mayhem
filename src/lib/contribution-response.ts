import { ContributionError, getContributions } from './contributions.ts';

export async function contributionResponse(username: string | undefined, load = getContributions): Promise<Response> {
    try {
        const data = await load(username);
        return Response.json(data, {
            // The service manages TTL and UTC rollover. Avoid a second, stale HTTP cache.
            headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
        });
    } catch (error) {
        const failure = error instanceof ContributionError
            ? error
            : new ContributionError(500, 'INTERNAL_ERROR', 'Unable to process contribution request.');
        return Response.json({ error: failure.message, code: failure.code }, {
            status: failure.status,
            headers: {
                'Cache-Control': 'no-store',
                'X-Content-Type-Options': 'nosniff',
                ...(failure.status === 503 ? { 'Retry-After': '60' } : {}),
            },
        });
    }
}
