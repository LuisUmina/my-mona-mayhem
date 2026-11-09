import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { startApplication, openApplication, eventually } from '../helpers/application.mjs';

let application;
before(async () => { application = await startApplication(); });
after(async () => { await application?.stop(); });

async function screen(t, options) {
    const ui = await openApplication(application, options);
    t.after(() => { ui.close(); assert.deepEqual(ui.errors, [], 'No DOM/runtime errors'); });
    return ui;
}

async function settled(ui) {
    await eventually(() => assert.equal(ui.query('#battle-form').getAttribute('aria-busy'), 'false'));
}

test('built HTTP API validates usernames and returns normalized data and controlled errors', async () => {
    for (const [name, status, code] of [['alice', 200], ['bad--name', 400, 'INVALID_USERNAME'], ['ghost', 404, 'USER_NOT_FOUND'], ['broken', 502, 'INVALID_UPSTREAM_DATA']]) {
        const response = await fetch(new URL(`api/contributions/${name}`, application.base));
        assert.equal(response.status, status);
        assert.equal(response.headers.get('Cache-Control'), 'no-store');
        assert.match(response.headers.get('Content-Type'), /application\/json/);
        const body = await response.json();
        if (code) assert.equal(body.code, code);
        else {
            assert.equal(body.totalContributions, 10);
            assert.equal(body.weeks.flatMap((week) => week.contributionDays).length, 7);
        }
    }
});

test('empty and invalid fields focus the affected user without submitting a battle', async (t) => {
    const ui = await screen(t);
    ui.submit();
    assert.match(ui.query('#battle-error').textContent, /Jugador 1/);
    assert.equal(ui.window.document.activeElement, ui.query('#player-one'));
    assert.equal(ui.query('#player-one').getAttribute('aria-invalid'), 'true');
    ui.fill('#player-one', 'alice');
    ui.fill('#player-two', '@bob');
    ui.submit();
    assert.match(ui.query('#battle-error').textContent, /Jugador 2/);
    assert.equal(ui.window.document.activeElement, ui.query('#player-two'));
    assert.equal(ui.query('#battle-results').hidden, true);
    assert.equal(ui.query('#battle-fields').disabled, false);
});

test('form submission shows loading, real API totals, winner, calendars and result focus', async (t) => {
    const ui = await screen(t);
    ui.fill('#player-one', '  ALICE  ');
    ui.fill('#player-two', 'bob');
    ui.query('#compare-button').click();
    assert.equal(ui.query('#battle-fields').disabled, true);
    assert.equal(ui.query('#battle-form').getAttribute('aria-busy'), 'true');
    assert.match(ui.query('#battle-status').textContent, /Consultando/);
    await settled(ui);
    assert.equal(ui.query('#battle-results').hidden, false);
    assert.equal(ui.query('#player-one').value, 'alice');
    assert.equal(ui.query('#result-title').textContent, '@alice gana la batalla');
    assert.match(ui.query('#result-detail').textContent, /6 contribuciones/);
    assert.equal(ui.query('#result-player-0 [data-result-total]').textContent, '10');
    assert.equal(ui.query('#result-player-1 [data-result-total]').textContent, '4');
    assert.equal(ui.query('#result-player-0').classList.contains('is-winner'), true);
    assert.match(ui.query('#result-player-0 [data-result-privacy]').textContent, /^GitHub incluye/);
    assert.equal(ui.window.document.querySelectorAll('.calendar-day').length, 14);
    assert.equal(ui.window.document.activeElement, ui.query('#result-title'));
    assert.equal(ui.query('#battle-fields').disabled, false);
});

test('editing clears a previous result and the next comparison removes the old winner', async (t) => {
    const ui = await screen(t);
    ui.fill('#player-one', 'alice'); ui.fill('#player-two', 'bob'); ui.submit();
    await settled(ui);
    ui.fill('#player-two', 'equal');
    assert.equal(ui.query('#battle-results').hidden, true);
    assert.equal(ui.query('#empty-state').hidden, false);
    ui.submit(); await settled(ui);
    assert.equal(ui.query('#result-title').textContent, '¡Empate!');
    assert.equal(ui.window.document.querySelectorAll('.is-winner').length, 0);
    assert.equal(ui.window.document.querySelectorAll('.calendar-day').length, 14, 'Calendars are replaced, not appended');
});

test('missing user error can be corrected and zero-activity profiles produce a tie', async (t) => {
    const ui = await screen(t);
    ui.fill('#player-one', 'zero'); ui.fill('#player-two', 'ghost'); ui.submit();
    await settled(ui);
    assert.equal(ui.query('#battle-error').hidden, false);
    assert.match(ui.query('#battle-error').textContent, /@ghost/);
    assert.equal(ui.window.document.activeElement, ui.query('#player-two'));
    assert.equal(ui.query('#compare-button').textContent, 'Reintentar comparación');
    ui.fill('#player-two', 'zero'); ui.submit(); await settled(ui);
    assert.equal(ui.query('#battle-error').hidden, true);
    assert.equal(ui.query('#result-title').textContent, '¡Empate!');
    assert.equal(ui.window.document.querySelectorAll('.calendar-day:not([data-level="0"])').length, 0);
});

test('rate limiting can be retried without editing inputs or reloading the page', async (t) => {
    const ui = await screen(t);
    ui.fill('#player-one', 'alice'); ui.fill('#player-two', 'busy'); ui.submit();
    await settled(ui);
    assert.match(ui.query('#battle-error').textContent, /minuto/);
    assert.equal(ui.window.document.activeElement, ui.query('#battle-error'));
    assert.equal(ui.query('#battle-fields').disabled, false);
    ui.query('#compare-button').click(); await settled(ui);
    assert.equal(ui.query('#battle-error').hidden, true);
    assert.equal(ui.query('#result-title').textContent, '@alice gana la batalla');
});

test('incompatible periods and invalid upstream responses never show partial results', async (t) => {
    const ui = await screen(t);
    ui.fill('#player-one', 'alice'); ui.fill('#player-two', 'different'); ui.submit(); await settled(ui);
    assert.match(ui.query('#battle-error').textContent, /períodos/);
    assert.equal(ui.query('#battle-results').hidden, true);
    ui.fill('#player-two', 'broken'); ui.submit(); await settled(ui);
    assert.match(ui.query('#battle-error').textContent, /obtener las contribuciones/);
    assert.equal(ui.query('#battle-results').hidden, true);
});

test('client timeout unlocks the form and a fresh retry can complete', async (t) => {
    const ui = await screen(t, { clientTimeoutMs: 5 });
    ui.fill('#player-one', 'alice'); ui.fill('#player-two', 'slow'); ui.submit(); await settled(ui);
    assert.match(ui.query('#battle-error').textContent, /tardó demasiado/);
    assert.equal(ui.query('#battle-results').hidden, true);
    assert.equal(ui.query('#battle-fields').disabled, false);
    // Restore the normal deadline; the preceding request must not write stale results.
    ui.restoreTimeout();
    ui.query('#compare-button').click(); await settled(ui);
    assert.equal(ui.query('#battle-error').hidden, true);
    assert.equal(ui.query('#result-title').textContent, '@alice gana la batalla');
});

test('calendar keyboard and pointer events update exact counts with one tab stop per calendar', async (t) => {
    const ui = await screen(t);
    ui.fill('#player-one', 'alice'); ui.fill('#player-two', 'bob'); ui.submit(); await settled(ui);
    const calendar = ui.query('#result-player-0 [data-calendar-days]');
    const active = () => calendar.querySelector('[tabindex="0"]');
    const key = (value) => active().dispatchEvent(new ui.window.KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true }));
    key('Home');
    assert.equal(active().dataset.date, '2026-01-01');
    assert.equal(ui.window.document.activeElement, active());
    assert.match(ui.query('#result-player-0 [data-calendar-detail]').textContent, /10 contribuciones/);
    key('ArrowDown'); assert.equal(active().dataset.date, '2026-01-02');
    key('End'); assert.equal(active().dataset.date, '2026-01-07');
    assert.equal(ui.query('#result-player-0 [data-calendar-next]').disabled, true);
    ui.query('#result-player-0 [data-calendar-previous]').click();
    assert.equal(active().dataset.date, '2026-01-06');
    calendar.querySelector('[data-date="2026-01-01"]').dispatchEvent(new ui.window.MouseEvent('pointerover', { bubbles: true }));
    assert.match(ui.query('#result-player-0 [data-calendar-detail]').textContent, /10 contribuciones/);
    assert.equal(active().dataset.date, '2026-01-06', 'Hover does not move the keyboard entry point');
    calendar.dispatchEvent(new ui.window.MouseEvent('pointerleave'));
    assert.match(ui.query('#result-player-0 [data-calendar-detail]').textContent, /0 contribuciones/);
    assert.equal(calendar.querySelectorAll('[tabindex="0"]').length, 1);
});
