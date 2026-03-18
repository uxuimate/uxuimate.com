/**
 * UX UI MATE – EN/BG language switcher
 * Reads UXUI_TRANSLATIONS (from translations.js), applies on load and when flag is clicked.
 */
(function () {
    var STORAGE_KEY = 'uxuimate-lang';

    function getLang() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (stored === 'bg' || stored === 'en') return stored;
        } catch (e) {}
        return 'en';
    }

    function setLang(lang) {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {}
    }

    function applyTranslations(lang) {
        if (typeof window.UXUI_TRANSLATIONS === 'undefined' || !window.UXUI_TRANSLATIONS[lang]) return;
        var T = window.UXUI_TRANSLATIONS[lang];

        document.documentElement.lang = lang === 'bg' ? 'bg' : 'en';

        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (T[key] != null) el.textContent = T[key];
        });

        document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-html');
            if (T[key] != null) el.innerHTML = T[key];
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-placeholder');
            if (T[key] != null) el.placeholder = T[key];
        });

        document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-title');
            if (T[key] != null) el.setAttribute('title', T[key]);
        });

        document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-aria-label');
            if (T[key] != null) el.setAttribute('aria-label', T[key]);
        });

        var backToTop = document.querySelector('.mil-back-to-top .mil-link span');
        if (backToTop && T['common.backToTop']) backToTop.textContent = T['common.backToTop'];

        var currentPage = document.querySelector('.mil-current-page');
        if (currentPage && currentPage.textContent) {
            var navKey = currentPage.getAttribute('data-i18n-current');
            if (navKey && T[navKey]) currentPage.textContent = T[navKey];
        }
    }

    function updateFlagActiveState(lang) {
        document.querySelectorAll('.mil-lang-flag').forEach(function (a) {
            var isEn = a.getAttribute('href') === '#en';
            if ((lang === 'en' && isEn) || (lang === 'bg' && !isEn)) {
                a.classList.add('mil-lang-active');
            } else {
                a.classList.remove('mil-lang-active');
            }
        });
        var summary = document.querySelector('.mil-lang-mobile summary.mil-lang-current-btn');
        if (summary && summary.querySelector('img')) {
            var img = summary.querySelector('img');
            img.src = lang === 'bg' ? 'img/icons/Bulgaria.png' : 'img/icons/United Kingdom.png';
            img.alt = lang === 'bg' ? 'Български' : 'English';
        }
    }

    function switchTo(lang) {
        setLang(lang);
        applyTranslations(lang);
        updateFlagActiveState(lang);
    }

    function init() {
        var lang = getLang();
        applyTranslations(lang);
        updateFlagActiveState(lang);

        document.addEventListener('click', function (e) {
            var flag = e.target.closest('.mil-lang-flag');
            if (!flag) return;
            e.preventDefault();
            var href = flag.getAttribute('href');
            if (href === '#en') switchTo('en');
            else if (href === '#bg') switchTo('bg');
        });

        document.querySelectorAll('.mil-lang-dropdown a').forEach(function (a) {
            a.addEventListener('click', function (e) {
                e.preventDefault();
                if (a.getAttribute('href') === '#bg') switchTo('bg');
                else switchTo('en');
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.UXUI_i18n = { getLang: getLang, setLang: setLang, apply: applyTranslations, switchTo: switchTo };
})();
