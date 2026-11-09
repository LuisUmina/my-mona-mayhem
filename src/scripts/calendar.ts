import type { BattlePlayer } from '../lib/battle.ts';
import { CALENDAR_COLORS, calendarMonths, calendarTarget } from '../lib/calendar.ts';

const fullDate = new Intl.DateTimeFormat('es', { dateStyle: 'full', timeZone: 'UTC' });
const number = new Intl.NumberFormat('es-CO');

export function renderCalendar(container: HTMLElement, player: BattlePlayer) {
    const plot = container.querySelector<HTMLElement>('[data-calendar-plot]')!;
    const grid = container.querySelector<HTMLElement>('[data-calendar-days]')!;
    const months = container.querySelector<HTMLElement>('[data-calendar-months]')!;
    const detail = container.querySelector<HTMLElement>('[data-calendar-detail]')!;
    const previous = container.querySelector<HTMLButtonElement>('[data-calendar-previous]')!;
    const next = container.querySelector<HTMLButtonElement>('[data-calendar-next]')!;
    const days = player.weeks.flatMap((week) => week.contributionDays);
    let selected = days.length - 1;
    plot.style.setProperty('--weeks', String(player.weeks.length));
    container.querySelector('[data-calendar-scroll]')!.setAttribute('aria-label', `Calendario de contribuciones de @${player.username}`);
    previous.setAttribute('aria-label', `Día anterior de @${player.username}`);
    next.setAttribute('aria-label', `Día siguiente de @${player.username}`);
    const descriptions = days.map((day) => `${fullDate.format(new Date(`${day.date}T00:00:00Z`))} · ${number.format(day.contributionCount)} ${day.contributionCount === 1 ? 'contribución' : 'contribuciones'}`);
    const fragment = document.createDocumentFragment();
    let index = 0;
    player.weeks.forEach((week, column) => week.contributionDays.forEach((day) => {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'calendar-day';
        cell.dataset.dayIndex = String(index);
        cell.dataset.date = day.date;
        cell.dataset.level = String(day.level);
        cell.setAttribute('aria-label', `${descriptions[index]}, intensidad ${day.level} de 4`);
        cell.style.backgroundColor = CALENDAR_COLORS[day.level];
        cell.style.gridColumn = String(column + 1);
        cell.style.gridRow = String(day.weekday + 1);
        cell.tabIndex = -1;
        fragment.append(cell);
        index++;
    }));
    grid.replaceChildren(fragment);
    months.replaceChildren(...calendarMonths(player.weeks).map(({ column, label }) => {
        const month = document.createElement('span');
        month.textContent = label;
        month.style.gridColumn = `${column + 1} / span ${Math.min(3, player.weeks.length - column)}`;
        return month;
    }));
    const cells = Array.from(grid.querySelectorAll<HTMLButtonElement>('.calendar-day'));
    const select = (target: number, focus = false, reveal = false) => {
        cells[selected].tabIndex = -1;
        cells[selected].classList.remove('is-selected');
        selected = target;
        const cell = cells[selected];
        cell.tabIndex = 0;
        cell.classList.add('is-selected');
        detail.textContent = descriptions[selected];
        previous.disabled = selected === 0;
        next.disabled = selected === days.length - 1;
        if (focus) cell.focus({ preventScroll: true });
        if (reveal) cell.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
    };
    // Property handlers replace the old comparison's handlers on each render.
    grid.onpointerover = (event) => {
        const cell = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('[data-day-index]') : null;
        if (cell) detail.textContent = descriptions[Number(cell.dataset.dayIndex)];
    };
    grid.onpointerleave = () => detail.textContent = descriptions[selected];
    cells.forEach((cell, index) => cell.onfocus = () => select(index));
    grid.onclick = (event) => {
        const cell = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('[data-day-index]') : null;
        if (cell) select(Number(cell.dataset.dayIndex));
    };
    grid.onkeydown = (event) => {
        if (!(event.target instanceof HTMLElement) || event.target.dataset.dayIndex === undefined) return;
        const index = Number((event.target as HTMLElement).dataset.dayIndex);
        const target = calendarTarget(index, event.key, days.length);
        if (target === null) return;
        event.preventDefault();
        select(target, true, true);
    };
    previous.onclick = () => select(Math.max(0, selected - 1), false, true);
    next.onclick = () => select(Math.min(days.length - 1, selected + 1), false, true);
    select(selected);
}
