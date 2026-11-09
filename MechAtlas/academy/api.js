/* MechAtlas Academy: read-only data layer for visitors.
   Only PUBLISHED content is ever requested (status = 'published'); Supabase RLS enforces it again on the server.
   No embedded joins are used (they would depend on foreign-key names): related rows are fetched separately and joined here. */
(function () {
    'use strict';
    var C = window.ACADEMY_CONFIG, PUB = 'published';
    var client = null, loading = null, memo = {};

    function loadScript(src) {
        return new Promise(function (ok, bad) {
            var s = document.createElement('script');
            s.src = src; s.async = true; s.crossOrigin = 'anonymous';
            s.onload = ok; s.onerror = function () { bad(Object.assign(new Error('script ' + src), { kind: 'lib' })); };
            document.head.appendChild(s);
        });
    }
    function loadCss(href) {
        if (document.querySelector('link[data-ac-css="' + href + '"]')) return;
        var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; l.setAttribute('data-ac-css', href); document.head.appendChild(l);
    }
    function getClient() {
        if (client) return Promise.resolve(client);
        if (!loading) {
            loading = (window.supabase && window.supabase.createClient ? Promise.resolve() : loadScript(C.libs.supabase)).then(function () {
                if (!(window.supabase && window.supabase.createClient)) throw Object.assign(new Error('supabase library missing'), { kind: 'lib' });
                /* visitors are always anonymous: no session is stored or read, so this client can never touch an admin session */
                client = window.supabase.createClient(C.supabaseUrl, C.publishableKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
                return client;
            }).catch(function (e) { loading = null; throw e; });
        }
        return loading;
    }
    function fail(error) { var e = new Error(error && error.message || 'query failed'); e.kind = 'data'; e.detail = error; return e; }
    function run(builder) {
        return Promise.resolve(builder).then(function (r) { if (r.error) throw fail(r.error); return r; });
    }
    function rows(builder) { return run(builder).then(function (r) { return r.data || []; }); }
    function cached(key, ttl, fn) {
        var m = memo[key];
        if (m && Date.now() - m.t < ttl) return Promise.resolve(m.v);
        return fn().then(function (v) { memo[key] = { t: Date.now(), v: v }; return v; });
    }
    var ITEM_COLS = 'id,title,slug,summary,content_type_id,field_id,published_at,created_at';
    var byId = function (arr) { var o = {}; arr.forEach(function (x) { o[x.id] = x; }); return o; };

    function lookups() {
        return cached('lookups', 300000, function () {
            return getClient().then(function (c) {
                return Promise.all([
                    rows(c.from('engineering_fields').select('id,name_ar,name_en,slug,description,icon').order('name_ar')),
                    rows(c.from('content_types').select('id,name_ar,name_en,slug,description').order('name_ar'))
                ]).then(function (r) { return { fields: r[0], types: r[1] }; });
            });
        });
    }
    /* which fields / types actually have published content (empty ones are never shown to visitors) */
    function publishedIndex() {
        return cached('pubIndex', 60000, function () {
            return getClient().then(function (c) {
                return rows(c.from('content_items').select('id,content_type_id,field_id').eq('status', PUB).limit(2000));
            });
        });
    }
    function seriesIndex() {
        return cached('seriesIdx', 60000, function () {
            return getClient().then(function (c) {
                return Promise.all([
                    rows(c.from('series').select('id,title,slug,description,field_id,created_at').order('created_at', { ascending: false })),
                    rows(c.from('series_items').select('series_id,content_item_id,sort_order').limit(5000)),
                    publishedIndex()
                ]).then(function (r) {
                    var pub = byId(r[2]), count = {};
                    r[1].forEach(function (si) { if (pub[si.content_item_id]) count[si.series_id] = (count[si.series_id] || 0) + 1; });
                    return r[0].filter(function (s) { return count[s.id]; }).map(function (s) { return Object.assign({}, s, { count: count[s.id] }); });
                });
            });
        });
    }

    var api = {
        ready: getClient,
        loadKatex: function () {
            if (window.katex) return Promise.resolve(window.katex);
            loadCss(C.libs.katexCss);
            return loadScript(C.libs.katexJs).then(function () { if (!window.katex) throw new Error('katex missing'); return window.katex; });
        },
        lookups: lookups,
        /* fields and content types that really have published content, with counts (empty ones are never returned) */
        facets: function () {
            return Promise.all([lookups(), publishedIndex()]).then(function (r) {
                var fieldCount = {}, typeCount = {};
                r[1].forEach(function (x) {
                    if (x.field_id) fieldCount[x.field_id] = (fieldCount[x.field_id] || 0) + 1;
                    if (x.content_type_id) typeCount[x.content_type_id] = (typeCount[x.content_type_id] || 0) + 1;
                });
                return {
                    total: r[1].length, lookups: r[0],
                    fields: r[0].fields.filter(function (f) { return fieldCount[f.id]; }).map(function (f) { return Object.assign({}, f, { count: fieldCount[f.id] }); }),
                    types: r[0].types.filter(function (t) { return typeCount[t.id]; }).map(function (t) { return Object.assign({}, t, { count: typeCount[t.id] }); })
                };
            });
        },
        home: function () {
            return Promise.all([api.facets(), seriesIndex(), api.list({ page: 0, size: 6 })]).then(function (r) {
                return { total: r[0].total, fields: r[0].fields, types: r[0].types, lookups: r[0].lookups, series: r[1], latest: r[2].items };
            });
        },
        /* list published items. opts: {q, field (slug), type (slug), page, size} */
        list: function (o) {
            o = o || {};
            var size = o.size || C.pageSize, page = o.page || 0;
            return Promise.all([getClient(), lookups()]).then(function (r) {
                var c = r[0], lk = r[1], b = c.from('content_items').select(ITEM_COLS, { count: 'exact' }).eq('status', PUB);
                if (o.field) { var f = lk.fields.filter(function (x) { return x.slug === o.field; })[0]; if (!f) return { items: [], total: 0, lookups: lk }; b = b.eq('field_id', f.id); }
                if (o.type) { var t = lk.types.filter(function (x) { return x.slug === o.type; })[0]; if (!t) return { items: [], total: 0, lookups: lk }; b = b.eq('content_type_id', t.id); }
                var q = String(o.q || '').replace(/[,()%*\\"']/g, ' ').trim();
                if (q) b = b.or('title.ilike.*' + q + '*,summary.ilike.*' + q + '*');
                b = b.order('published_at', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false }).range(page * size, page * size + size - 1);
                return run(b).then(function (res) { return { items: res.data || [], total: res.count == null ? (res.data || []).length : res.count, lookups: lk }; });
            });
        },
        /* one published item with its blocks and (first) series navigation */
        item: function (slug) {
            return Promise.all([getClient(), lookups()]).then(function (r) {
                var c = r[0], lk = r[1];
                return run(c.from('content_items').select('*').eq('slug', slug).eq('status', PUB).maybeSingle()).then(function (res) {
                    var it = res.data; if (!it) return null;
                    return Promise.all([
                        rows(c.from('content_blocks').select('id,block_type,content,sort_order').eq('content_item_id', it.id).order('sort_order', { ascending: true })),
                        rows(c.from('series_items').select('series_id,sort_order').eq('content_item_id', it.id))
                    ]).then(function (x) {
                        var out = { item: it, blocks: x[0], lookups: lk, series: null };
                        if (!x[1].length) return out;
                        return api.seriesById(x[1][0].series_id).then(function (s) { out.series = s; return out; });
                    });
                });
            });
        },
        /* a series with its PUBLISHED items in order */
        seriesById: function (id) { return seriesFetch(function (b) { return b.eq('id', id); }); },
        series: function (slug) { return seriesFetch(function (b) { return b.eq('slug', slug); }); },
        seriesList: seriesIndex,
        /* batch signed URLs for private files: {path: url} (a path that cannot be signed is simply missing) */
        signed: function (paths) {
            var list = Array.from(new Set((paths || []).filter(Boolean)));
            if (!list.length) return Promise.resolve({});
            return getClient().then(function (c) {
                return c.storage.from(C.bucket).createSignedUrls(list, C.signedUrlSeconds);
            }).then(function (r) {
                var map = {};
                ((r && r.data) || []).forEach(function (x) { if (x && x.signedUrl && !x.error) map[x.path] = x.signedUrl; });
                return map;
            }).catch(function () { return {}; });
        },
        clearCache: function () { memo = {}; }
    };

    function seriesFetch(filter) {
        return getClient().then(function (c) {
            return run(filter(c.from('series').select('id,title,slug,description,field_id,created_at')).maybeSingle()).then(function (res) {
                var s = res.data; if (!s) return null;
                return rows(c.from('series_items').select('content_item_id,sort_order').eq('series_id', s.id).order('sort_order', { ascending: true })).then(function (si) {
                    var ids = si.map(function (x) { return x.content_item_id; });
                    if (!ids.length) return null; /* a series without published items is not shown */
                    return rows(c.from('content_items').select('id,title,slug,summary,content_type_id,field_id,published_at').in('id', ids).eq('status', PUB)).then(function (its) {
                        var m = byId(its);
                        var list = ids.map(function (id) { return m[id]; }).filter(Boolean); return list.length ? Object.assign({}, s, { items: list }) : null;
                    });
                });
            });
        });
    }
    window.AcademyAPI = api;
})();
