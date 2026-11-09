/* MechAtlas Academy: section controller.
   Self-contained like the Materials Testing section: it does not call or change any other section. It only
   (1) registers its own navigation labels, (2) watches #page-academy becoming active, (3) reads <html lang>,
   and (4) handles #/academy/... links. Any failure stays inside #academy-root. */
(function () {
    'use strict';
    var root = document.getElementById('academy-root'), page = document.getElementById('page-academy');
    if (!root || !page || !window.AcademyAPI || !window.AcademyUI || !window.AcademyRender) return;
    var A = window.AcademyAPI, UI = window.AcademyUI, V = UI.V, R = window.AcademyRender;

    /* navigation / home-card texts, registered here so no shared translation file has to change */
    if (typeof translations !== 'undefined') {
        translations.en.nav_academy = 'Academy'; translations.ar.nav_academy = 'الأكاديمية';
        translations.en.feat_academy_desc = 'Engineering articles, projects and experiments in simple words.';
        translations.ar.feat_academy_desc = 'مقالات ومشاريع وتجارب هندسية مبسّطة.';
    }
    var lang = function () { return document.documentElement.lang === 'ar' ? 'ar' : 'en'; };
    var dec = function (s) { try { return decodeURIComponent(s); } catch (e) { return s; } };
    var cur = { view: 'home' }, tok = 0, listState = null, wasActive = false;

    /* ---- routes: #/academy  #/academy/item/<slug>  #/academy/series/<slug>  #/academy/field/<slug>  #/academy/type/<slug>  #/academy/search?q=... ---- */
    function parse(h) {
        var m = /^#\/academy(?:\/(.*))?$/.exec(h == null ? location.hash : h);
        if (!m) return null;
        var rest = m[1] || '', qi = rest.indexOf('?'), path = qi >= 0 ? rest.slice(0, qi) : rest, qs = qi >= 0 ? rest.slice(qi + 1) : '';
        var seg = path.split('/').filter(Boolean).map(dec), p = new URLSearchParams(qs);
        switch (seg[0]) {
            case 'item': return seg[1] ? { view: 'item', slug: seg[1] } : { view: 'home' };
            case 'series': return seg[1] ? { view: 'series', slug: seg[1] } : { view: 'home' };
            case 'field': return seg[1] ? { view: 'list', field: seg[1] } : { view: 'home' };
            case 'type': return seg[1] ? { view: 'list', type: seg[1] } : { view: 'home' };
            case 'search': return { view: 'list', q: (p.get('q') || '').slice(0, 80) };
            default: return { view: 'home' };
        }
    }
    var isActive = function () { return page.classList.contains('active'); };

    function put(html) { root.innerHTML = html; }
    function fail(e, mine) {
        if (mine !== tok) return;
        if (window.console) console.warn('[academy]', e);
        put(V.error(e && e.kind === 'lib' ? 'lib' : 'data', lang()));
    }
    function render(route) {
        cur = route || parse() || { view: 'home' };
        var mine = ++tok, L = lang();
        put(V.loading(L));
        try {
            if (cur.view === 'home') {
                A.home().then(function (d) { if (mine === tok) { put(V.home(d, L)); done(); } }).catch(function (e) { fail(e, mine); });
            } else if (cur.view === 'list') {
                Promise.all([A.list({ q: cur.q, field: cur.field, type: cur.type, page: 0 }), A.facets()]).then(function (r) {
                    if (mine !== tok) return;
                    listState = { page: 0, items: r[0].items.length, total: r[0].total, lookups: r[0].lookups };
                    put(V.list(r[0], r[1], cur, L)); done();
                }).catch(function (e) { fail(e, mine); });
            } else if (cur.view === 'item') {
                A.item(cur.slug).then(function (d) {
                    if (mine !== tok) return;
                    if (!d) { put(V.notFound(L, 'item')); done(); return; }
                    put(V.item(d, L)); R.mount(root, A); done();
                }).catch(function (e) { fail(e, mine); });
            } else if (cur.view === 'series') {
                Promise.all([A.series(cur.slug), A.lookups()]).then(function (r) {
                    if (mine !== tok) return;
                    put(r[0] ? V.series(r[0], r[1], L) : V.notFound(L, 'series')); done();
                }).catch(function (e) { fail(e, mine); });
            }
        } catch (e) { fail(e, mine); }
    }
    function done() { if (isActive()) window.scrollTo({ top: 0 }); }

    function show() {
        var r = parse();
        if (!r) { try { history.replaceState(null, '', '#/academy'); } catch (e) {} r = { view: 'home' }; }
        render(r);
    }

    /* ---- events (delegated inside the section only) ---- */
    root.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-ac-retry],[data-ac-more],[data-ac-share]'); if (!b) return;
        if (b.hasAttribute('data-ac-retry')) { A.clearCache(); render(cur); }
        else if (b.hasAttribute('data-ac-more')) loadMore(b);
        else share(b);
    });
    root.addEventListener('submit', function (ev) {
        var f = ev.target.closest('[data-ac-search]'); if (!f) return;
        ev.preventDefault();
        var q = String(f.elements.q.value || '').trim().slice(0, 80);
        var target = q ? '#/academy/search?q=' + encodeURIComponent(q) : '#/academy';
        if (location.hash === target) render(parse(target)); else location.hash = target;
    });
    function loadMore(btn) {
        if (!listState) return;
        btn.disabled = true;
        var next = listState.page + 1, mine = tok;
        A.list({ q: cur.q, field: cur.field, type: cur.type, page: next }).then(function (d) {
            if (mine !== tok) return;
            var grid = root.querySelector('[data-ac-grid]'); if (!grid) return;
            grid.insertAdjacentHTML('beforeend', V.moreCards(d.items, d.lookups, lang()));
            listState.page = next; listState.items += d.items.length;
            if (!d.items.length || listState.items >= listState.total) btn.parentNode.remove(); else btn.disabled = false;
        }).catch(function () { btn.disabled = false; });
    }
    function share(btn) {
        var url = location.origin + location.pathname + location.hash, title = btn.getAttribute('data-title') || '', note = root.querySelector('[data-ac-copied]');
        var say = function (t) { if (note) { if (t) note.textContent = t; note.hidden = false; } };
        if (navigator.share) { navigator.share({ title: title, url: url }).catch(function () {}); return; }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(function () { say(); }, function () { say(url); });
        else say(url);
    }

    /* ---- the section becoming visible / hidden (no change to app.js needed) ---- */
    new MutationObserver(function () {
        var on = isActive();
        if (on && !wasActive) show();
        if (!on && wasActive) {
            tok++;                                   /* drop any answer still on its way */
            if (/^#\/academy/.test(location.hash)) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }
        }
        wasActive = on;
    }).observe(page, { attributes: true, attributeFilter: ['class'] });
    wasActive = isActive();

    /* links to #/academy/... (typed, shared, or clicked) */
    window.addEventListener('hashchange', function () {
        var r = parse(); if (!r) return;
        if (isActive()) render(r); else if (typeof navigate === 'function') navigate('academy');
    });
    /* language switch: redraw in the new language (data is cached) */
    new MutationObserver(function () { if (isActive()) render(cur); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    /* opened directly from a shared link: app.js finishes its own start-up first, then we open the section */
    window.addEventListener('load', function () { if (parse() && typeof navigate === 'function') navigate('academy'); });

    window.Academy = { render: render, parse: parse, state: function () { return { cur: cur, active: isActive() }; } };
})();
