import { BattleError, runBattle, validatePlayers } from '../lib/battle.ts';
import type { BattleResult } from '../lib/battle.ts';
import { renderCalendar } from './calendar.ts';

const form = document.querySelector<HTMLFormElement>('#battle-form')!;
const fieldset = document.querySelector<HTMLFieldSetElement>('#battle-fields')!;
const inputs = [document.querySelector<HTMLInputElement>('#player-one')!, document.querySelector<HTMLInputElement>('#player-two')!];
const button = document.querySelector<HTMLButtonElement>('#compare-button')!;
const status = document.querySelector<HTMLElement>('#battle-status')!;
const errorBox = document.querySelector<HTMLElement>('#battle-error')!;
const results = document.querySelector<HTMLElement>('#battle-results')!;
const empty = document.querySelector<HTMLElement>('#empty-state')!;
const resultTitle = document.querySelector<HTMLElement>('#result-title')!;
const number = new Intl.NumberFormat('es-CO');
const date = new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeZone: 'UTC' });
let busy = false;

function renderResult(result: BattleResult) {
    const { players, winner, difference } = result;
    document.querySelector('#result-kicker')!.textContent = winner === null ? 'PARTIDA IGUALADA' : 'VICTORIA CONFIRMADA';
    resultTitle.textContent = winner === null ? '¡Empate!' : `@${players[winner].username} gana la batalla`;
    document.querySelector('#result-detail')!.textContent = winner === null
        ? 'Los dos jugadores tienen el mismo total de contribuciones.'
        : `${number.format(difference)} ${difference === 1 ? 'contribución de ventaja' : 'contribuciones de ventaja'}.`;
    document.querySelector('#result-period')!.textContent = `${date.format(new Date(`${players[0].from}T00:00:00Z`))} — ${date.format(new Date(`${players[0].to}T00:00:00Z`))} · ${players[0].rangeDays} días`;
    players.forEach((player, index) => {
        const card = document.querySelector<HTMLElement>(`#result-player-${index}`)!;
        card.classList.toggle('is-winner', winner === index);
        card.querySelector('[data-result-badge]')!.textContent = winner === null ? 'Empate' : winner === index ? 'Ganador' : 'Jugador ' + (index + 1);
        const profile = card.querySelector<HTMLAnchorElement>('[data-result-user]')!;
        profile.textContent = `@${player.username}`;
        profile.href = `https://github.com/${player.username}`;
        card.querySelector('[data-result-total]')!.textContent = number.format(player.totalContributions);
        card.querySelector('[data-result-privacy]')!.textContent = player.privateContributionsIncluded
            ? 'GitHub incluye conteos de contribuciones privadas.'
            : 'GitHub no incluye conteos de contribuciones privadas.';
        renderCalendar(card.querySelector<HTMLElement>('[data-calendar]')!, player);
    });
    empty.hidden = true;
    results.hidden = false;
    results.querySelectorAll<HTMLElement>('[data-calendar-scroll]').forEach((scroll) => scroll.scrollLeft = scroll.scrollWidth);
}

function showError(error: unknown) {
    const failure = error instanceof BattleError ? error : new BattleError('No se pudo completar la comparación. Vuelve a intentarlo.');
    errorBox.textContent = failure.message;
    errorBox.hidden = false;
    status.textContent = '';
    button.textContent = 'Reintentar comparación';
    empty.hidden = true;
    if (failure.inputIndex !== undefined) {
        inputs[failure.inputIndex].setAttribute('aria-invalid', 'true');
        inputs[failure.inputIndex].focus();
    } else {
        errorBox.focus();
    }
}

inputs.forEach((input) => input.addEventListener('input', () => {
    if (busy) return;
    results.hidden = true;
    empty.hidden = false;
    errorBox.hidden = true;
    inputs.forEach((field) => field.removeAttribute('aria-invalid'));
    button.textContent = 'Comparar contribuciones';
    status.textContent = '';
}));

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (busy) return;
    results.hidden = true;
    errorBox.hidden = true;
    inputs.forEach((input) => input.removeAttribute('aria-invalid'));
    let usernames: [string, string];
    try {
        usernames = validatePlayers(inputs[0].value, inputs[1].value);
    } catch (error) {
        showError(error);
        return;
    }
    inputs.forEach((input, index) => input.value = usernames[index]);
    busy = true;
    fieldset.disabled = true;
    form.setAttribute('aria-busy', 'true');
    empty.hidden = true;
    button.textContent = 'Comparando…';
    status.textContent = 'Consultando las contribuciones de los dos jugadores…';
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15_000);
    let failure: unknown;
    try {
        renderResult(await runBattle(usernames[0], usernames[1], { signal: controller.signal }));
        status.textContent = 'Comparación completada.';
    } catch (error) {
        failure = controller.signal.aborted
            ? new BattleError('La comparación tardó demasiado. Vuelve a intentarlo.')
            : error;
    } finally {
        window.clearTimeout(timer);
        controller.abort();
        busy = false;
        fieldset.disabled = false;
        form.setAttribute('aria-busy', 'false');
        button.textContent = 'Comparar contribuciones';
    }
    if (failure) showError(failure);
    else resultTitle.focus();
});
