import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { SourceTextModule } from 'node:vm';
import { JSDOM, VirtualConsole } from 'jsdom';

const root = new URL('../../', import.meta.url);

export async function startApplication() {
    const portProbe = createServer();
    await new Promise((resolve) => portProbe.listen(0, '127.0.0.1', resolve));
    const port = portProbe.address().port;
    await new Promise((resolve) => portProbe.close(resolve));
    const child = spawn(process.execPath, ['--import', './tests/helpers/github-fixture.mjs', 'dist/server/entry.mjs'], {
        cwd: root,
        env: { ...process.env, HOST: '127.0.0.1', PORT: String(port), NODE_ENV: 'production', ASTRO_TELEMETRY_DISABLED: '1' },
        stdio: ['ignore', 'pipe', 'pipe'],
    });
    const base = `http://127.0.0.1:${port}/`;
    let logs = '';
    let spawnError;
    child.on('error', (error) => spawnError = error);
    child.stdout.on('data', (data) => logs = (logs + data).slice(-5000));
    child.stderr.on('data', (data) => logs = (logs + data).slice(-5000));
    const stop = async () => {
        if (child.exitCode === null && child.signalCode === null && child.pid) {
            const closed = once(child, 'close');
            child.kill();
            await closed;
        }
    };
    try {
        await eventually(() => {
            if (spawnError) throw spawnError;
            assert.equal(child.exitCode, null, logs);
            assert.match(logs, /Server listening/);
        }, 10_000);
        const response = await fetch(base);
        assert.equal(response.status, 200);
        const html = await response.text();
        return { base, html, stop };
    } catch (error) {
        await stop();
        throw new Error(`Built application did not start. Run npm run build first.\n${logs}`, { cause: error });
    }
}

export async function eventually(assertion, timeout = 3000) {
    const deadline = Date.now() + timeout;
    let lastError;
    do {
        try { await assertion(); return; }
        catch (error) { lastError = error; }
        await new Promise((resolve) => setTimeout(resolve, 10));
    } while (Date.now() < deadline);
    throw lastError;
}

/** Execute the real server-rendered HTML and built ES modules in an isolated DOM. */
export async function openApplication(application, { clientTimeoutMs } = {}) {
    const errors = [];
    const virtualConsole = new VirtualConsole();
    virtualConsole.on('jsdomError', (error) => errors.push(error));
    const dom = new JSDOM(application.html, { url: application.base, runScripts: 'outside-only', virtualConsole });
    const { window } = dom;
    window.AbortController = AbortController;
    window.fetch = (url, options) => fetch(new URL(url, application.base), options);
    // jsdom has no layout/scrolling engine. Real-browser layout was checked separately.
    window.HTMLElement.prototype.scrollIntoView = function () {};
    const nativeSetTimeout = window.setTimeout.bind(window);
    if (clientTimeoutMs !== undefined) {
        window.setTimeout = (callback, delay, ...args) => nativeSetTimeout(callback, delay === 15_000 ? clientTimeoutMs : delay, ...args);
    }
    const modules = new Map();
    const load = async (url) => {
        const asset = new URL(url, application.base);
        assert.equal(asset.origin, new URL(application.base).origin, 'Only built local modules may execute');
        if (modules.has(asset.href)) return modules.get(asset.href);
        const response = await fetch(asset);
        assert.equal(response.status, 200, asset.href);
        const module = new SourceTextModule(await response.text(), {
            context: dom.getInternalVMContext(), identifier: asset.href,
            initializeImportMeta(meta) { meta.url = asset.href; },
        });
        modules.set(asset.href, module);
        await module.link((specifier, importer) => load(new URL(specifier, importer.identifier)));
        return module;
    };
    try {
        const scripts = [...window.document.querySelectorAll('script[type="module"][src]')];
        assert.ok(scripts.length > 0, 'Built page must include the interactive module');
        for (const script of scripts) await (await load(script.src)).evaluate();
    } catch (error) {
        window.close();
        throw error;
    }
    const query = (selector) => {
        const node = window.document.querySelector(selector);
        assert.ok(node, selector);
        return node;
    };
    const fill = (selector, value) => {
        query(selector).value = value;
        query(selector).dispatchEvent(new window.Event('input', { bubbles: true }));
    };
    const submit = () => query('#battle-form').requestSubmit();
    return { window, query, fill, submit, errors, restoreTimeout: () => window.setTimeout = nativeSetTimeout, close: () => window.close() };
}
