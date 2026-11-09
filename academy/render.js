/* MechAtlas Academy: turns content blocks (content_blocks rows) into safe HTML.
   Nothing from the database is ever inserted as raw HTML: every value is escaped, links are limited to http(s),
   and the only embedded frames are YouTube (youtube-nocookie) videos. Unknown block types are skipped, never fatal.

   Block shapes understood (block_type -> content jsonb). Any text may be a string or {ar:'..', en:'..'}:
     heading    {text, level: 2|3}            paragraph {text}                list {ordered:false, items:[text]}
     image      {path, alt, caption}          equation  {tex, label, legend:[[symbol, meaning]]}
     example    {title, steps:[text], result} table     {caption, headers:[text], rows:[[text]]}
     pdf        {path, title}                 video     {url, title}          (YouTube / Telegram / any http(s) link)
     quiz       {question, options:[text], answer: index, explanation}
     references {items:[{title, url, note}]}
   Inline markup in text: **bold**  *italic*  `code`  [label](https://link)  and $tex$ for inline math. */
(function () {
    'use strict';
    var T = {
        ar: { example: 'مثال محلول', where: 'حيث', result: 'النتيجة', quiz: 'سؤال قصير', show: 'أظهر الإجابة', right: 'إجابة صحيحة ✓', wrong: 'إجابة غير صحيحة ✗',
              pdf: 'فتح ملف PDF', video: 'مشاهدة الفيديو', fileErr: 'تعذّر تحميل الملف', refs: 'المراجع والمصادر', youtube: 'يوتيوب', telegram: 'تيليغرام', link: 'رابط' },
        en: { example: 'Worked example', where: 'where', result: 'Result', quiz: 'Quick question', show: 'Show the answer', right: 'Correct ✓', wrong: 'Not correct ✗',
              pdf: 'Open the PDF', video: 'Watch the video', fileErr: 'The file could not be loaded', refs: 'References and sources', youtube: 'YouTube', telegram: 'Telegram', link: 'Link' }
    };
    var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); };
    var loc = function (v, lang) { if (v && typeof v === 'object' && !Array.isArray(v)) return String(v[lang] || v.ar || v.en || ''); return v == null ? '' : String(v); };
    var arr = function (v) { return Array.isArray(v) ? v : []; };
    var safeUrl = function (u) { u = String(u || '').trim(); return /^https?:\/\/[^\s"'<>]+$/i.test(u) ? u : ''; };

    /* ---- inline text: escape first, then apply the small markup set ---- */
    function inlineText(raw) {
        var s = esc(raw);
        s = s.replace(/`([^`\n]+)`/g, '<code class="ac-code">$1</code>');
        s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
        s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
        s = s.replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)"'<>]+)\)/g, function (m, t, u) { return '<a href="' + u + '" target="_blank" rel="noopener noreferrer" class="text-primary-600 dark:text-primary-400 underline">' + t + '</a>'; });
        return s.replace(/\n/g, '<br>');
    }
    /* text with $inline math$ (math is rendered by KaTeX later; until then it shows as plain text) */
    function rich(raw) {
        var str = String(raw == null ? '' : raw), out = '', last = 0, re = /\$(?=\S)([^$\n]*?\S)\$/g, m;
        while ((m = re.exec(str))) {
            out += inlineText(str.slice(last, m.index)) + '<span class="ac-math" dir="ltr" data-tex="' + esc(m[1]) + '">' + esc(m[1]) + '</span>';
            last = m.index + m[0].length;
        }
        return out + inlineText(str.slice(last));
    }

    function youtubeId(u) {
        var m = /^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i.exec(u);
        return m ? m[1] : '';
    }
    var isTelegram = function (u) { return /^https?:\/\/(?:www\.)?(?:t\.me|telegram\.me)\//i.test(u); };

    var B = {
        heading: function (c, lang) {
            var lv = Number(c.level) === 3 ? 3 : 2, t = loc(c.text, lang);
            return '<h' + lv + ' class="ac-h' + lv + '">' + rich(t) + '</h' + lv + '>';
        },
        paragraph: function (c, lang) { return '<p class="ac-p">' + rich(loc(c.text, lang)) + '</p>'; },
        list: function (c, lang) {
            var tag = c.ordered ? 'ol' : 'ul';
            return '<' + tag + ' class="ac-list ' + (c.ordered ? 'ac-ol' : 'ac-ul') + '">' + arr(c.items).map(function (i) { return '<li>' + rich(loc(i, lang)) + '</li>'; }).join('') + '</' + tag + '>';
        },
        image: function (c, lang) {
            var path = String(c.path || c.file_path || '');
            if (!path) return '';
            return '<figure class="ac-fig"><img data-ac-path="' + esc(path) + '" alt="' + esc(loc(c.alt, lang)) + '" loading="lazy" class="ac-img">' +
                '<div class="ac-fig-err" hidden>' + esc(T[lang].fileErr) + '</div>' + (loc(c.caption, lang) ? '<figcaption>' + rich(loc(c.caption, lang)) + '</figcaption>' : '') + '</figure>';
        },
        equation: function (c, lang) {
            var tex = String(c.tex || c.text || ''), t = T[lang];
            if (!tex) return '';
            var legend = arr(c.legend).filter(function (r) { return Array.isArray(r) && r.length >= 2; });
            return '<div class="ac-eqwrap">' + (loc(c.label, lang) ? '<div class="ac-eqlabel">' + rich(loc(c.label, lang)) + '</div>' : '') +
                '<div class="ac-eq" dir="ltr" data-tex="' + esc(tex) + '" data-display="1">' + esc(tex) + '</div>' +
                (legend.length ? '<div class="ac-legend"><div class="ac-legend-h">' + esc(t.where) + ':</div><table><tbody>' + legend.map(function (r) {
                    return '<tr><td dir="ltr"><span class="ac-math" data-tex="' + esc(r[0]) + '">' + esc(r[0]) + '</span></td><td>' + rich(loc(r[1], lang)) + '</td></tr>'; }).join('') + '</tbody></table></div>' : '') + '</div>';
        },
        example: function (c, lang) {
            var t = T[lang];
            return '<div class="ac-example"><div class="ac-example-h">' + esc(loc(c.title, lang) || t.example) + '</div>' +
                '<ol class="ac-list ac-ol">' + arr(c.steps).map(function (s) { return '<li>' + rich(loc(s, lang)) + '</li>'; }).join('') + '</ol>' +
                (loc(c.result, lang) ? '<p class="ac-result"><b>' + esc(t.result) + ':</b> ' + rich(loc(c.result, lang)) + '</p>' : '') + '</div>';
        },
        table: function (c, lang) {
            var head = arr(c.headers), rows = arr(c.rows);
            return '<div class="ac-tablewrap"><table class="ac-table">' + (loc(c.caption, lang) ? '<caption>' + esc(loc(c.caption, lang)) + '</caption>' : '') +
                (head.length ? '<thead><tr>' + head.map(function (h) { return '<th>' + rich(loc(h, lang)) + '</th>'; }).join('') + '</tr></thead>' : '') +
                '<tbody>' + rows.map(function (r) { return '<tr>' + arr(r).map(function (d) { return '<td>' + rich(loc(d, lang)) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
        },
        pdf: function (c, lang) {
            var path = String(c.path || c.file_path || '');
            if (!path) return '';
            return '<div class="ac-file"><a data-ac-pdf="' + esc(path) + '" href="#" target="_blank" rel="noopener noreferrer" class="ac-btn" aria-disabled="true"><i class="fa-solid fa-file-pdf"></i> ' +
                esc(loc(c.title, lang) || T[lang].pdf) + '</a><span class="ac-fig-err" hidden>' + esc(T[lang].fileErr) + '</span></div>';
        },
        video: function (c, lang) {
            var u = safeUrl(c.url), t = T[lang];
            if (!u) return '';
            var yt = youtubeId(u), title = loc(c.title, lang);
            if (yt) return '<figure class="ac-fig"><div class="ac-video"><iframe src="https://www.youtube-nocookie.com/embed/' + yt + '" title="' + esc(title || t.video) + '" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"></iframe></div>' + (title ? '<figcaption>' + esc(title) + '</figcaption>' : '') + '</figure>';
            return '<div class="ac-file"><a href="' + esc(u) + '" target="_blank" rel="noopener noreferrer" class="ac-btn"><i class="' + (isTelegram(u) ? 'fa-brands fa-telegram' : 'fa-solid fa-circle-play') + '"></i> ' + esc(title || t.video) + '</a></div>';
        },
        quiz: function (c, lang, idx) {
            var t = T[lang], opts = arr(c.options);
            if (!loc(c.question, lang) || opts.length < 2) return '';
            return '<div class="ac-quiz" data-ac-quiz data-answer="' + (Number(c.answer) | 0) + '"><div class="ac-quiz-h">' + esc(t.quiz) + '</div><p class="ac-p ac-quiz-q">' + rich(loc(c.question, lang)) + '</p>' +
                opts.map(function (o, i) { return '<button type="button" class="ac-opt" data-opt="' + i + '">' + rich(loc(o, lang)) + '</button>'; }).join('') +
                '<div class="ac-quiz-fb" hidden></div>' + (loc(c.explanation, lang) ? '<div class="ac-quiz-ex" hidden>' + rich(loc(c.explanation, lang)) + '</div>' : '') + '</div>';
        },
        references: function (c, lang) {
            var items = arr(c.items);
            if (!items.length) return '';
            return '<div class="ac-refs"><h2 class="ac-h2">' + esc(T[lang].refs) + '</h2><ol class="ac-list ac-ol">' + items.map(function (r) {
                var u = safeUrl(r && r.url), t = loc(r && r.title, lang) || u;
                return '<li>' + (u ? '<a href="' + esc(u) + '" target="_blank" rel="noopener noreferrer" class="text-primary-600 dark:text-primary-400 underline" dir="auto">' + esc(t) + '</a>' : '<span dir="auto">' + esc(t) + '</span>') + (loc(r && r.note, lang) ? ' <span class="ac-note">' + rich(loc(r.note, lang)) + '</span>' : '') + '</li>'; }).join('') + '</ol></div>';
        }
    };
    /* alternative names a content editor might use */
    var ALIAS = { text: 'paragraph', p: 'paragraph', h2: 'heading', h3: 'heading', ul: 'list', ol: 'list', math: 'equation', formula: 'equation', worked_example: 'example', quiz_question: 'quiz', refs: 'references', reference: 'references' };

    function blocksHtml(blocks, lang) {
        lang = lang === 'en' ? 'en' : 'ar';
        return arr(blocks).map(function (b, i) {
            var type = String(b && b.block_type || '').toLowerCase(), c = b && b.content;
            if (typeof c === 'string') { try { c = JSON.parse(c); } catch (e) { c = { text: c }; } }
            c = c && typeof c === 'object' ? c : {};
            if (type === 'ol') c.ordered = true;
            if (type === 'h3' && !c.level) c.level = 3;
            type = ALIAS[type] || type;
            var fn = B[type];
            if (!fn) { if (window.console) console.warn('[academy] unknown block type:', b && b.block_type); return ''; }
            try { return fn(c, lang, i); } catch (e) { if (window.console) console.warn('[academy] block failed:', type, e); return ''; }
        }).join('');
    }

    /* after the HTML is in the page: signed URLs for private files, math, quizzes */
    function mount(root, api) {
        var imgs = [].slice.call(root.querySelectorAll('img[data-ac-path]')), pdfs = [].slice.call(root.querySelectorAll('a[data-ac-pdf]'));
        var paths = imgs.map(function (i) { return i.getAttribute('data-ac-path'); }).concat(pdfs.map(function (a) { return a.getAttribute('data-ac-pdf'); }));
        if (paths.length) api.signed(paths).then(function (map) {
            if (!root.isConnected) return;
            imgs.forEach(function (im) {
                var u = map[im.getAttribute('data-ac-path')];
                if (u) im.src = u; else { im.hidden = true; var e = im.parentNode.querySelector('.ac-fig-err'); if (e) e.hidden = false; }
            });
            pdfs.forEach(function (a) {
                var u = map[a.getAttribute('data-ac-pdf')];
                if (u) { a.href = u; a.removeAttribute('aria-disabled'); } else { a.style.display = 'none'; var e = a.parentNode.querySelector('.ac-fig-err'); if (e) e.hidden = false; }
            });
        });
        var maths = [].slice.call(root.querySelectorAll('[data-tex]'));
        if (maths.length) api.loadKatex().then(function (katex) {
            maths.forEach(function (el) {
                try { el.innerHTML = katex.renderToString(el.getAttribute('data-tex'), { displayMode: el.getAttribute('data-display') === '1', throwOnError: false, strict: 'ignore', trust: false }); el.classList.add('ac-math-done'); } catch (e) { /* keep the plain text */ }
            });
        }).catch(function () { /* KaTeX unavailable: the formulas stay readable as plain text */ });
        [].slice.call(root.querySelectorAll('[data-ac-quiz]')).forEach(function (q) {
            var done = false, ans = Number(q.getAttribute('data-answer')), lang = document.documentElement.lang === 'en' ? 'en' : 'ar';
            q.addEventListener('click', function (ev) {
                var b = ev.target.closest('.ac-opt'); if (!b || done) return; done = true;
                var i = Number(b.getAttribute('data-opt')), fb = q.querySelector('.ac-quiz-fb'), ex = q.querySelector('.ac-quiz-ex');
                [].slice.call(q.querySelectorAll('.ac-opt')).forEach(function (o) { o.disabled = true; if (Number(o.getAttribute('data-opt')) === ans) o.classList.add('ac-opt-right'); });
                if (i !== ans) b.classList.add('ac-opt-wrong');
                fb.textContent = i === ans ? T[lang].right : T[lang].wrong; fb.hidden = false; if (ex) ex.hidden = false;
            });
        });
    }
    window.AcademyRender = { blocksHtml: blocksHtml, mount: mount, rich: rich, esc: esc, loc: loc, safeUrl: safeUrl, youtubeId: youtubeId };
})();
