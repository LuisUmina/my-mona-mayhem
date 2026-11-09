(function () {
    const portalRoot = new URL('.', document.currentScript.src);
    const locales = ['en', 'es', 'pt_BR'];

    function localeUrl(href, targetLocale) {
        if (!locales.includes(targetLocale)) throw new Error('Unsupported locale');
        const url = new URL(href);
        if (url.origin !== portalRoot.origin || !url.pathname.startsWith(portalRoot.pathname)) {
            throw new Error('Page is outside the workshop portal');
        }
        const parts = url.pathname.slice(portalRoot.pathname.length).split('/');
        if (['es', 'pt_BR'].includes(parts[0])) parts.shift();
        if (targetLocale !== 'en') parts.unshift(targetLocale);
        url.pathname = portalRoot.pathname + parts.join('/');
        return url.href;
    }

    function contentBase(locale) {
        if (!locales.includes(locale)) throw new Error('Unsupported locale');
        const configured = window.MONA_WORKSHOP_CONFIG?.contentBase;
        // Preserve local development when serving the checkout at /docs/.
        const checkout = ['localhost', '127.0.0.1', '[::1]'].includes(portalRoot.hostname)
            && portalRoot.pathname.endsWith('/docs/');
        const base = new URL(configured ?? (checkout ? '../workshop/' : 'workshop/'), portalRoot);
        if (!base.pathname.endsWith('/')) base.pathname += '/';
        return new URL(locale === 'en' ? './' : `${locale}/`, base).href;
    }

    window.MonaWorkshop = { localeUrl, contentBase };

    document.addEventListener('DOMContentLoaded', () => {
        const picker = document.getElementById('localePicker');
        if (!picker) return;
        const button = picker.querySelector('.locale-toggle');
        const list = picker.querySelector('ul');
        const firstSegment = location.pathname.slice(portalRoot.pathname.length).split('/')[0];
        const locale = ['es', 'pt_BR'].includes(firstSegment) ? firstSegment : 'en';
        const close = () => {
            list.style.display = 'none';
            button.setAttribute('aria-expanded', 'false');
        };
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const open = list.style.display !== 'block';
            list.style.display = open ? 'block' : 'none';
            button.setAttribute('aria-expanded', String(open));
        });
        document.addEventListener('click', close);
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') close();
        });
        list.querySelectorAll('li').forEach((item) => {
            const target = item.dataset.locale.replace('pt-BR', 'pt_BR');
            item.classList.toggle('active', target === locale);
            item.setAttribute('aria-selected', String(target === locale));
            item.addEventListener('click', (event) => {
                event.stopPropagation();
                if (target === locale) return close();
                try {
                    localStorage.setItem('preferred-locale', target);
                } catch (error) {
                    console.warn('Unable to persist language preference.', error);
                }
                window.location.href = localeUrl(window.location.href, target);
            });
        });
    });
})();
