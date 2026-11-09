/* MechAtlas Academy: visitor views. Pure functions: data in, HTML string out (all values escaped).
   Links are ordinary hash links (#/academy/...), so every item, series, field and search is shareable. */
(function () {
    'use strict';
    var R = window.AcademyRender, esc = R.esc;
    var TX = {
        ar: {
            title: 'أكاديمية MechAtlas', sub: 'مقالات ومشاريع وتجارب هندسية مبسّطة، مفتوحة للجميع دون حساب.',
            search: 'ابحث في الأكاديمية…', go: 'بحث', fields: 'المجالات الهندسية', types: 'أنواع المحتوى', latest: 'أحدث المواد', series: 'السلاسل التعليمية',
            all: 'الكل', home: 'الأكاديمية', back: 'العودة إلى الأكاديمية', items: 'مواد', item: 'مادة', results: 'نتيجة', none: 'لا توجد مواد مطابقة.', more: 'عرض المزيد',
            empty: 'المحتوى قادم قريباً. سننشر هنا المقالات والمشاريع والتجارب الهندسية فور جاهزيتها.',
            err: 'تعذّر تحميل الأكاديمية. تأكد من الاتصال بالإنترنت ثم أعد المحاولة. باقي أقسام التطبيق تعمل كالمعتاد.', retry: 'إعادة المحاولة',
            lib: 'تعذّر تحميل مكتبة الاتصال بالأكاديمية. تأكد من الاتصال بالإنترنت ثم أعد المحاولة.',
            notFound: 'هذه المادة غير موجودة أو غير منشورة.', share: 'مشاركة', copied: 'تم نسخ الرابط', published: 'نُشر في', inSeries: 'ضمن سلسلة', part: 'الدرس',
            prev: 'السابق', next: 'التالي', toSeries: 'صفحة السلسلة', seriesItems: 'مواد هذه السلسلة', seriesNF: 'هذه السلسلة غير موجودة.', loading: 'جارٍ التحميل…',
            filterField: 'المجال', filterType: 'النوع', clear: 'إزالة التصفية'
        },
        en: {
            title: 'MechAtlas Academy', sub: 'Simple engineering articles, projects and experiments, open to everyone without an account.',
            search: 'Search the Academy…', go: 'Search', fields: 'Engineering fields', types: 'Content types', latest: 'Latest', series: 'Series',
            all: 'All', home: 'Academy', back: 'Back to the Academy', items: 'items', item: 'item', results: 'results', none: 'No matching items.', more: 'Show more',
            empty: 'Content is coming soon. Articles, projects and experiments will appear here as soon as they are ready.',
            err: 'The Academy could not be loaded. Check your internet connection and try again. The rest of the app works as usual.', retry: 'Try again',
            lib: 'The connection library could not be loaded. Check your internet connection and try again.',
            notFound: 'This item does not exist or is not published.', share: 'Share', copied: 'Link copied', published: 'Published', inSeries: 'Part of the series', part: 'Part',
            prev: 'Previous', next: 'Next', toSeries: 'Series page', seriesItems: 'Items in this series', seriesNF: 'This series does not exist.', loading: 'Loading…',
            filterField: 'Field', filterType: 'Type', clear: 'Clear filter'
        }
    };
    var card = 'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700';
    var chipOn = 'bg-primary-600 text-white border-primary-600', chipOff = 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700';
    var name = function (o, lang) { return o ? String((lang === 'ar' ? o.name_ar || o.name_en : o.name_en || o.name_ar) || '') : ''; };
    var href = function (p) { return '#/academy' + (p ? '/' + p : ''); };
    var enc = encodeURIComponent;
    function icon(cls) {
        var toks = String(cls || '').split(/\s+/).filter(function (t) { return /^fa-[a-z0-9-]+$/.test(t); });
        if (!toks.length) toks = ['fa-gear'];
        if (!toks.some(function (t) { return t === 'fa-solid' || t === 'fa-brands' || t === 'fa-regular'; })) toks.unshift('fa-solid');
        return toks.join(' ');
    }
    function date(d, lang) {
        if (!d) return '';
        var x = new Date(d); if (isNaN(x)) return '';
        try { return x.toLocaleDateString(lang === 'ar' ? 'ar-u-nu-latn' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }); } catch (e) { return x.toISOString().slice(0, 10); }
    }
    var isAr = function (s) { return /[؀-ۿ]/.test(String(s || '')); };
    var badge = function (t, c) { return t ? '<span class="ac-badge ' + (c || '') + '">' + esc(t) + '</span>' : ''; };

    function searchBox(tx, q) {
        return '<form data-ac-search class="ac-search" role="search"><input type="search" name="q" value="' + esc(q || '') + '" placeholder="' + esc(tx.search) + '" aria-label="' + esc(tx.search) + '" maxlength="80" class="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700">' +
            '<button type="submit" class="px-4 py-2 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700">' + esc(tx.go) + '</button></form>';
    }
    function itemCard(it, lk, lang) {
        var f = lk.fields.filter(function (x) { return x.id === it.field_id; })[0], t = lk.types.filter(function (x) { return x.id === it.content_type_id; })[0];
        return '<a href="' + href('item/' + enc(it.slug)) + '" class="ac-card ' + card + ' block p-4 hover:border-primary-500 transition-colors" dir="auto">' +
            '<div class="flex flex-wrap gap-1 mb-2">' + badge(name(t, lang), 'ac-badge-type') + badge(name(f, lang)) + '</div>' +
            '<h3 class="font-bold text-lg mb-1 leading-snug">' + esc(it.title) + '</h3>' +
            (it.summary ? '<p class="text-sm text-gray-600 dark:text-gray-300 ac-clamp">' + esc(it.summary) + '</p>' : '') +
            (it.published_at ? '<div class="text-xs text-gray-500 mt-2">' + esc(date(it.published_at, lang)) + '</div>' : '') + '</a>';
    }
    function seriesCard(s, tx) {
        return '<a href="' + href('series/' + enc(s.slug)) + '" class="ac-card ' + card + ' block p-4 hover:border-primary-500 transition-colors" dir="auto"><div class="flex items-center gap-2 mb-1"><i class="fa-solid fa-layer-group text-primary-600 dark:text-primary-400"></i><h3 class="font-bold text-lg leading-snug">' + esc(s.title) + '</h3></div>' +
            (s.description ? '<p class="text-sm text-gray-600 dark:text-gray-300 ac-clamp">' + esc(s.description) + '</p>' : '') + '<div class="text-xs text-gray-500 mt-2">' + s.count + ' ' + esc(tx.items) + '</div></a>';
    }
    function chips(facets, lang, tx, cur) {
        var h = '<div class="flex flex-wrap gap-2 mb-3" role="group" aria-label="' + esc(tx.types) + '">';
        h += '<a href="' + href('') + '" class="ac-chip ' + (!cur.type && !cur.field ? chipOn : chipOff) + '">' + esc(tx.all) + '</a>';
        facets.types.forEach(function (t) { h += '<a href="' + href('type/' + enc(t.slug)) + '" class="ac-chip ' + (cur.type === t.slug ? chipOn : chipOff) + '">' + esc(name(t, lang)) + ' <span class="opacity-70">' + t.count + '</span></a>'; });
        h += '</div><div class="flex flex-wrap gap-2 mb-4" role="group" aria-label="' + esc(tx.fields) + '">';
        facets.fields.forEach(function (f) { h += '<a href="' + href('field/' + enc(f.slug)) + '" class="ac-chip ' + (cur.field === f.slug ? chipOn : chipOff) + '"><i class="' + icon(f.icon) + '"></i> ' + esc(name(f, lang)) + ' <span class="opacity-70">' + f.count + '</span></a>'; });
        return h + '</div>';
    }
    function head(tx) { return '<div class="mb-5"><h2 class="text-3xl font-bold mb-2"><i class="fa-solid fa-graduation-cap text-primary-600 dark:text-primary-400"></i> ' + esc(tx.title) + '</h2><p class="text-gray-600 dark:text-gray-400 max-w-3xl">' + esc(tx.sub) + '</p></div>'; }

    var V = {
        loading: function (lang) { return '<div class="py-16 text-center text-gray-500" role="status"><i class="fa-solid fa-spinner fa-spin"></i> ' + esc(TX[lang].loading) + '</div>'; },
        error: function (kind, lang) {
            var tx = TX[lang];
            return '<div class="' + card + ' p-6 text-center" role="alert"><p class="mb-4">' + esc(kind === 'lib' ? tx.lib : tx.err) + '</p><button type="button" data-ac-retry class="px-4 py-2 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700"><i class="fa-solid fa-rotate-right"></i> ' + esc(tx.retry) + '</button></div>';
        },
        notFound: function (lang, what) { var tx = TX[lang]; return '<div class="' + card + ' p-6 text-center"><p class="mb-4">' + esc(what === 'series' ? tx.seriesNF : tx.notFound) + '</p><a href="' + href('') + '" class="text-primary-600 dark:text-primary-400 hover:underline">' + esc(tx.back) + '</a></div>'; },
        home: function (d, lang) {
            var tx = TX[lang], h = head(tx) + searchBox(tx, '');
            if (!d.total) return h + '<div class="' + card + ' p-8 text-center mt-5 text-gray-600 dark:text-gray-300"><i class="fa-solid fa-hourglass-half text-3xl text-primary-600 mb-3"></i><p>' + esc(tx.empty) + '</p></div>';
            if (d.fields.length) h += '<h3 class="text-xl font-bold mt-6 mb-3">' + esc(tx.fields) + '</h3><div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">' + d.fields.map(function (f) {
                return '<a href="' + href('field/' + enc(f.slug)) + '" class="ac-card ' + card + ' block p-4 hover:border-primary-500 transition-colors"><div class="w-10 h-10 rounded-lg bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-2"><i class="' + icon(f.icon) + '"></i></div><div class="font-bold leading-snug">' + esc(name(f, lang)) + '</div><div class="text-xs text-gray-500 mt-1">' + f.count + ' ' + esc(tx.items) + '</div></a>'; }).join('') + '</div>';
            if (d.types.length) h += '<h3 class="text-xl font-bold mt-6 mb-3">' + esc(tx.types) + '</h3><div class="flex flex-wrap gap-2">' + d.types.map(function (t) {
                return '<a href="' + href('type/' + enc(t.slug)) + '" class="ac-chip ' + chipOff + '">' + esc(name(t, lang)) + ' <span class="opacity-70">' + t.count + '</span></a>'; }).join('') + '</div>';
            if (d.latest.length) h += '<h3 class="text-xl font-bold mt-6 mb-3">' + esc(tx.latest) + '</h3><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">' + d.latest.map(function (it) { return itemCard(it, d.lookups, lang); }).join('') + '</div>';
            if (d.series.length) h += '<h3 class="text-xl font-bold mt-6 mb-3">' + esc(tx.series) + '</h3><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">' + d.series.map(function (s) { return seriesCard(s, tx); }).join('') + '</div>';
            return h;
        },
        /* d: {items,total,lookups}, facets, cur: {q, field, type} */
        list: function (d, facets, cur, lang) {
            var tx = TX[lang], f = facets.fields.filter(function (x) { return x.slug === cur.field; })[0], t = facets.types.filter(function (x) { return x.slug === cur.type; })[0];
            var h = '<a href="' + href('') + '" class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"><i class="fa-solid fa-arrow-left rtl:rotate-180"></i> ' + esc(tx.back) + '</a><div class="mt-3"></div>' + head(tx) + searchBox(tx, cur.q) + '<div class="mt-4"></div>' + chips(facets, lang, tx, cur);
            var label = [cur.q ? '“' + cur.q + '”' : '', f ? tx.filterField + ': ' + name(f, lang) : '', t ? tx.filterType + ': ' + name(t, lang) : ''].filter(Boolean).join(' · ');
            h += '<div class="text-sm text-gray-500 mb-3" aria-live="polite">' + esc(label ? label + ' — ' : '') + d.total + ' ' + esc(tx.results) + '</div>';
            if (!d.items.length) return h + '<p class="text-gray-500 py-8">' + esc(tx.none) + '</p>';
            h += '<div data-ac-grid class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">' + d.items.map(function (it) { return itemCard(it, d.lookups, lang); }).join('') + '</div>';
            if (d.items.length < d.total) h += '<div class="text-center mt-5"><button type="button" data-ac-more class="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">' + esc(tx.more) + '</button></div>';
            return h;
        },
        moreCards: function (items, lk, lang) { return items.map(function (it) { return itemCard(it, lk, lang); }).join(''); },
        item: function (d, lang) {
            var tx = TX[lang], it = d.item, lk = d.lookups, f = lk.fields.filter(function (x) { return x.id === it.field_id; })[0], t = lk.types.filter(function (x) { return x.id === it.content_type_id; })[0];
            var dir = isAr(it.title + ' ' + (it.summary || '')) ? 'rtl' : 'ltr';
            var h = '<a href="' + href('') + '" class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"><i class="fa-solid fa-arrow-left rtl:rotate-180"></i> ' + esc(tx.back) + '</a>';
            h += '<article class="ac-article mt-3" dir="' + dir + '"><div class="flex flex-wrap gap-1 mb-2">' +
                (t ? '<a href="' + href('type/' + enc(t.slug)) + '">' + badge(name(t, lang), 'ac-badge-type') + '</a>' : '') + (f ? '<a href="' + href('field/' + enc(f.slug)) + '">' + badge(name(f, lang)) + '</a>' : '') + '</div>' +
                '<h2 class="text-3xl font-bold mb-2 leading-snug">' + esc(it.title) + '</h2>' + (it.summary ? '<p class="text-lg text-gray-600 dark:text-gray-300 mb-3">' + esc(it.summary) + '</p>' : '') +
                '<div class="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-5">' + (it.published_at ? '<span>' + esc(tx.published) + ': ' + esc(date(it.published_at, lang)) + '</span>' : '') +
                '<button type="button" data-ac-share data-title="' + esc(it.title) + '" class="px-3 py-1.5 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"><i class="fa-solid fa-share-nodes"></i> ' + esc(tx.share) + '</button><span data-ac-copied class="text-green-700 dark:text-green-400" hidden>' + esc(tx.copied) + '</span></div>' +
                '<div class="ac-body">' + R.blocksHtml(d.blocks, lang) + '</div></article>';
            if (d.series && d.series.items.length) {
                var s = d.series, i = s.items.map(function (x) { return x.id; }).indexOf(it.id), prev = s.items[i - 1], next = s.items[i + 1];
                h += '<nav class="' + card + ' p-4 mt-8" aria-label="' + esc(tx.inSeries) + '" dir="auto"><div class="text-sm text-gray-500 mb-1">' + esc(tx.inSeries) + (i >= 0 ? ' · ' + esc(tx.part) + ' ' + (i + 1) + '/' + s.items.length : '') + '</div>' +
                    '<a href="' + href('series/' + enc(s.slug)) + '" class="font-bold text-primary-600 dark:text-primary-400 hover:underline">' + esc(s.title) + '</a>' +
                    '<div class="flex justify-between gap-3 mt-3 text-sm">' +
                    (prev ? '<a href="' + href('item/' + enc(prev.slug)) + '" class="text-primary-600 dark:text-primary-400 hover:underline text-start"><i class="fa-solid fa-arrow-left rtl:rotate-180"></i> ' + esc(tx.prev) + ': ' + esc(prev.title) + '</a>' : '<span></span>') +
                    (next ? '<a href="' + href('item/' + enc(next.slug)) + '" class="text-primary-600 dark:text-primary-400 hover:underline text-end">' + esc(tx.next) + ': ' + esc(next.title) + ' <i class="fa-solid fa-arrow-right rtl:rotate-180"></i></a>' : '<span></span>') + '</div></nav>';
            }
            return h;
        },
        series: function (s, lk, lang) {
            var tx = TX[lang];
            var h = '<a href="' + href('') + '" class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"><i class="fa-solid fa-arrow-left rtl:rotate-180"></i> ' + esc(tx.back) + '</a>' +
                '<div class="mt-3 mb-5" dir="auto"><div class="text-sm text-gray-500 mb-1"><i class="fa-solid fa-layer-group"></i> ' + esc(tx.series) + '</div><h2 class="text-3xl font-bold mb-2 leading-snug">' + esc(s.title) + '</h2>' + (s.description ? '<p class="text-gray-600 dark:text-gray-300 max-w-3xl">' + esc(s.description) + '</p>' : '') + '</div>';
            if (!s.items.length) return h + '<p class="text-gray-500">' + esc(tx.none) + '</p>';
            return h + '<h3 class="text-xl font-bold mb-3">' + esc(tx.seriesItems) + ' (' + s.items.length + ')</h3><ol class="space-y-3">' + s.items.map(function (it, i) {
                return '<li><a href="' + href('item/' + enc(it.slug)) + '" class="ac-card ' + card + ' flex items-start gap-3 p-4 hover:border-primary-500 transition-colors" dir="auto"><span class="w-9 h-9 shrink-0 rounded-full bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">' + (i + 1) + '</span><span class="min-w-0"><span class="block font-bold leading-snug">' + esc(it.title) + '</span>' + (it.summary ? '<span class="block text-sm text-gray-600 dark:text-gray-300 mt-1 ac-clamp">' + esc(it.summary) + '</span>' : '') + '</span></a></li>'; }).join('') + '</ol>';
        }
    };
    window.AcademyUI = { V: V, TX: TX };
})();
