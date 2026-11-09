import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { Script, createContext } from 'node:vm';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const source = await readFile(new URL('docs/workshop.js', root), 'utf8');
const locales = ['en', 'es', 'pt_BR'];
const folder = (locale) => locale === 'en' ? '' : `${locale}/`;

function loadPortal(base, config = {}, documentOverrides = {}) {
    const context = createContext({
        URL,
        console,
        document: { currentScript: { src: `${base}workshop.js` }, addEventListener() {}, ...documentOverrides },
        MONA_WORKSHOP_CONFIG: config,
    });
    context.window = context;
    new Script(source).runInContext(context);
    return context;
}

test('language navigation preserves page, lesson, track and fragment across all locales', () => {
    for (const base of ['https://example.com/', 'https://example.com/my-mona-mayhem/', 'https://example.com/es/', 'http://localhost:8080/docs/']) {
        const { MonaWorkshop } = loadPortal(base);
        for (const from of locales) {
            for (const to of locales) {
                for (const page of ['', 'index.html', 'step.html']) {
                    const suffix = `${page}?step=03-agent-mode&track=cli#task-2`;
                    assert.equal(MonaWorkshop.localeUrl(`${base}${folder(from)}${suffix}`, to), `${base}${folder(to)}${suffix}`);
                }
            }
        }
    }
});

test('lessons default to the deployed fork; overrides and local checkout paths work', () => {
    for (const locale of locales) {
        assert.equal(loadPortal('https://example.com/fork/').MonaWorkshop.contentBase(locale), `https://example.com/fork/workshop/${folder(locale)}`);
        assert.equal(loadPortal('http://localhost:8080/docs/').MonaWorkshop.contentBase(locale), `http://localhost:8080/workshop/${folder(locale)}`);
        assert.equal(loadPortal('http://localhost:8080/_site/').MonaWorkshop.contentBase(locale), `http://localhost:8080/_site/workshop/${folder(locale)}`);
        assert.equal(loadPortal('https://example.com/fork/', { contentBase: 'https://content.example.org/lessons' }).MonaWorkshop.contentBase(locale), `https://content.example.org/lessons/${folder(locale)}`);
        assert.equal(loadPortal('https://example.com/fork/', { contentBase: '../lessons/' }).MonaWorkshop.contentBase(locale), `https://example.com/lessons/${folder(locale)}`);
    }
});

test('the language picker navigates even when preference storage is blocked', () => {
    let ready;
    let click;
    const item = {
        dataset: { locale: 'pt-BR' },
        classList: { toggle() {} }, setAttribute() {},
        addEventListener(type, handler) { if (type === 'click') click = handler; },
    };
    const button = { setAttribute() {}, addEventListener() {} };
    const list = { style: {}, querySelectorAll: () => [item] };
    const picker = { querySelector: (selector) => selector === 'ul' ? list : button };
    const context = loadPortal('https://example.com/fork/', {}, {
        addEventListener(type, handler) { if (type === 'DOMContentLoaded') ready = handler; },
        getElementById: () => picker,
    });
    context.location = { pathname: '/fork/es/step.html', href: 'https://example.com/fork/es/step.html?step=04-design-vibes&track=cli#task-1' };
    context.localStorage = { setItem() { throw new Error('Storage blocked'); } };
    context.console = { warn() {} };
    ready();
    click({ stopPropagation() {} });
    assert.equal(context.location.href, 'https://example.com/fork/pt_BR/step.html?step=04-design-vibes&track=cli#task-1');
});

test('deployment contains every lesson and loads shared scripts before page code', async () => {
    execFileSync(process.execPath, ['scripts/prepare-docs.mjs'], { cwd: root });
    for (const locale of locales) {
        for (const page of ['index.html', 'step.html']) {
            const html = await readFile(new URL(`_site/${folder(locale)}${page}`, root), 'utf8');
            const prefix = locale === 'en' ? '' : '../';
            assert.ok(html.includes(`src="${prefix}workshop-config.js"`));
            assert.ok(html.includes(`src="${prefix}workshop.js"`));
            // Compile the actual inline scripts too, so syntax errors fail this check.
            for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) new Script(match[1]);
            if (page !== 'step.html') continue;
            assert.ok(html.indexOf('workshop.js') < html.indexOf('MonaWorkshop.contentBase'));
            assert.ok(!html.includes('raw.githubusercontent.com'));
            const context = loadPortal('https://example.com/fork/');
            for (const match of html.matchAll(/file: '([^']+\.md)'/g)) {
                const url = new URL(match[1], context.MonaWorkshop.contentBase(locale));
                const relative = url.pathname.slice('/fork/'.length);
                await access(new URL(`_site/${relative}`, root));
            }
        }
    }
});
