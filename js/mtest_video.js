/* Materials Testing: link to the practical-test video on YouTube.
   The old self-hosted video player and offline download were removed (the files were too large).
   Each test with a video shows a short message and a button that opens the video in a new tab.
   Public API used by mtest.js is unchanged: has(), topHtml(), cardHtml(), after(), refresh(). */
(function () {
    'use strict';
    var URLS = {
        tensile:  'https://youtu.be/D8U4G5kcpcM',
        brinell:  'https://youtu.be/RJXJpeH78iU',
        charpy:   'https://youtu.be/tpGhqQvftAo',
        vickers:  'https://youtu.be/7Z90OZ7C2jI',
        rockwell: 'https://youtu.be/G2JGNlIvNC4'
    };
    var TX = {
        ar: { title: 'مشاهدة التجربة العملية', msg: 'شاهد التجربة العملية لهذا الاختبار على يوتيوب. يلزم اتصال بالإنترنت.', btn: 'مشاهدة الفيديو على يوتيوب' },
        en: { title: 'Watch the Practical Test', msg: 'Watch the practical test on YouTube. An internet connection is required.', btn: 'Watch the video on YouTube' }
    };
    var lang = function () { return document.documentElement.lang === 'ar' ? 'ar' : 'en'; };
    var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };

    function cardHtml(testId, cardClass, h3) {
        if (!URLS[testId]) return '';
        var t = TX[lang()];
        return '<div class="' + cardClass + '">' + h3(t.title) +
            '<p class="text-sm text-gray-700 dark:text-gray-300 mb-3">' + esc(t.msg) + '</p>' +
            '<a href="' + URLS[testId] + '" target="_blank" rel="noopener noreferrer" class="inline-block px-3 py-2 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700"><i class="fa-brands fa-youtube"></i> ' + esc(t.btn) + '</a></div>';
    }

    /* one-time cleanup: remove the old downloaded copies of the removed videos from the media cache (harmless if none) */
    try {
        if ('caches' in window) {
            caches.open('mechatlas-media').then(function (c) {
                return c.keys().then(function (ks) {
                    return Promise.all(ks.filter(function (r) { return r.url.indexOf('/media/material-tests/') !== -1; }).map(function (r) { return c.delete(r); }));
                });
            }).catch(function () {});
        }
    } catch (e) {}

    window.MTVideo = {
        has: function (id) { return !!URLS[id]; },
        topHtml: function () { return ''; },
        cardHtml: cardHtml,
        after: function () {},
        refresh: function () {},
        URLS: URLS
    };
})();
