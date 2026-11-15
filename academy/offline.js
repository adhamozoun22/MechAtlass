/* MechAtlas Academy: offline layer (Batch 11). Loaded after api.js, before core.js.
   Wraps the read methods of AcademyAPI: every successful answer is stored in localStorage (via app.js academyCache);
   when the request fails (no connection, blocked CDN, server down) the last stored answer is returned and the section shows
   "أنت تتصفح في وضع عدم الاتصال". Lists additionally try the plain REST function fetchAcademyArticles() before the cache,
   so the list still works when only the supabase-js CDN file is unreachable. */
(function () {
    'use strict';
    var A = window.AcademyAPI; if (!A || A.__offlineWrapped) return;
    A.__offlineWrapped = true;
    var state = { offline: false, cachedAt: 0 };
    var cache = function () { return window.academyCache || { get: function () { return null; }, put: function () {} }; };
    function ok() { state.offline = false; }
    function stale(hit) { state.offline = true; state.cachedAt = hit.t; return hit.v; }
    function wrap(name) {
        var orig = A[name]; if (typeof orig !== 'function') return;
        A[name] = function () {
            var args = Array.prototype.slice.call(arguments), key = 'api|' + name + '|' + JSON.stringify(args);
            return orig.apply(A, args).then(function (v) { ok(); if (v !== undefined) cache().put(key, v); return v; }, function (err) {
                var viaRest = name === 'list' && typeof window.fetchAcademyArticles === 'function'
                    ? window.fetchAcademyArticles(Object.assign({}, args[0], { cacheFallback: false })).then(function (v) { ok(); cache().put(key, v); return v; }) : Promise.reject(err);
                return viaRest.catch(function () {
                    var hit = cache().get(key); if (hit) return stale(hit);
                    throw err;
                });
            });
        };
    }
    ['home', 'facets', 'lookups', 'list', 'item', 'series', 'seriesList', 'seriesById'].forEach(wrap);
    /* signed media URLs expire and cannot work offline: nothing to cache, simply no media */
    window.AcademyOffline = { active: function () { return state.offline; }, cachedAt: function () { return state.cachedAt; } };
})();
