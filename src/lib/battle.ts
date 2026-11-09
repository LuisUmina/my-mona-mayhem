import type { Contributions } from './contributions.ts';
import { isGitHubUsername } from './github-username.ts';

export type BattlePlayer = Pick<Contributions,
    'username' | 'from' | 'to' | 'rangeDays' | 'totalContributions' | 'privateContributionsIncluded'>;

export interface BattleResult {
    players: [BattlePlayer, BattlePlayer];
    winner: 0 | 1 | null;
    difference: number;
}

export class BattleError extends Error {
    inputIndex: number | undefined;

    constructor(message: string, inputIndex?: number) {
        super(message);
        this.name = 'BattleError';
        this.inputIndex = inputIndex;
    }
}

export function validatePlayers(first: string, second: string): [string, string] {
    return [first, second].map((input, index) => {
        const username = input.trim().toLowerCase();
        if (!username) throw new BattleError(`Jugador ${index + 1}: escribe un usuario de GitHub.`, index);
        if (!isGitHubUsername(username)) {
            throw new BattleError(`Jugador ${index + 1}: usa de 1 a 39 letras, números o guiones simples entre caracteres.`, index);
        }
        return username;
    }) as [string, string];
}

function isDate(value: unknown): value is string {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function readPlayer(value: unknown, username: string): BattlePlayer {
    if (!value || typeof value !== 'object') throw new BattleError('La respuesta no contiene datos válidos. Vuelve a intentarlo.');
    const data = value as Record<string, unknown>;
    if (data.username !== username || !isDate(data.from) || !isDate(data.to)
        || typeof data.totalContributions !== 'number' || !Number.isSafeInteger(data.totalContributions) || data.totalContributions < 0
        || typeof data.rangeDays !== 'number' || !Number.isInteger(data.rangeDays) || data.rangeDays < 1 || data.rangeDays > 367
        || (Date.parse(data.to) - Date.parse(data.from)) / 86_400_000 + 1 !== data.rangeDays
        || typeof data.privateContributionsIncluded !== 'boolean') {
        throw new BattleError('La respuesta no contiene datos válidos. Vuelve a intentarlo.');
    }
    return {
        username, from: data.from, to: data.to, rangeDays: data.rangeDays,
        totalContributions: data.totalContributions, privateContributionsIncluded: data.privateContributionsIncluded,
    };
}

async function fetchPlayer(username: string, index: number, fetcher: typeof fetch, signal?: AbortSignal): Promise<BattlePlayer> {
    let response: Response;
    try {
        response = await fetcher(`/api/contributions/${encodeURIComponent(username)}`, { signal });
    } catch (error) {
        if (signal?.aborted) throw error;
        throw new BattleError('No pudimos conectar con el servidor. Comprueba tu conexión y vuelve a intentarlo.');
    }
    if (!response.ok) {
        if (response.status === 400) throw new BattleError(`Jugador ${index + 1}: revisa el nombre de usuario.`, index);
        if (response.status === 404) throw new BattleError(`No encontramos a @${username} en GitHub. Revisa el jugador ${index + 1}.`, index);
        if (response.status === 503) throw new BattleError('El servicio está ocupado. Espera un minuto y vuelve a intentarlo.');
        if (response.status === 504) throw new BattleError('GitHub tardó demasiado en responder. Vuelve a intentarlo.');
        throw new BattleError('No pudimos obtener las contribuciones de GitHub. Vuelve a intentarlo.');
    }
    let data: unknown;
    try {
        data = await response.json();
    } catch (error) {
        if (signal?.aborted) throw error;
        throw new BattleError('No pudimos leer la respuesta del servidor. Vuelve a intentarlo.');
    }
    return readPlayer(data, username);
}

export function comparePlayers(first: BattlePlayer, second: BattlePlayer): BattleResult {
    if (first.from !== second.from || first.to !== second.to || first.rangeDays !== second.rangeDays) {
        throw new BattleError('Los períodos de los usuarios no coinciden. Vuelve a comparar para actualizar los datos.');
    }
    const difference = Math.abs(first.totalContributions - second.totalContributions);
    const winner = difference === 0 ? null : first.totalContributions > second.totalContributions ? 0 : 1;
    return { players: [first, second], winner, difference };
}

export async function runBattle(first: string, second: string, options: { fetcher?: typeof fetch; signal?: AbortSignal } = {}): Promise<BattleResult> {
    const usernames = validatePlayers(first, second);
    const players = await Promise.all(usernames.map((username, index) => fetchPlayer(username, index, options.fetcher ?? fetch, options.signal)));
    return comparePlayers(players[0], players[1]);
}
