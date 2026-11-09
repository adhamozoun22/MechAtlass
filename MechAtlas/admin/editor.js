/* MechAtlas Academy — visual block editor + uploads (Group C). Loaded by admin/index.html; mounted by admin.js (tab "Content"). */
(function () {
    'use strict';
    var TX = {
        ar: { new: 'مادة جديدة', all: 'كل الحالات', empty: 'لا توجد مواد.', back: 'رجوع للقائمة', save: 'حفظ', saving: 'جارٍ الحفظ…', saved: 'تم الحفظ.', title: 'العنوان', slug: 'الرابط (slug)', summary: 'ملخص قصير', type: 'نوع المحتوى', field: 'المجال', status: 'الحالة', none: '— بلا —',
            draft: 'مسودة', published: 'منشور', archived: 'مؤرشف', blocks: 'الكتل', add: 'إضافة كتلة', preview: 'معاينة', hidePreview: 'إخفاء المعاينة', up: 'أعلى', down: 'أسفل', del: 'حذف', confirmDel: 'حذف هذه الكتلة؟', confirmLeave: 'توجد تغييرات غير محفوظة. تجاهلها؟',
            need_title: 'العنوان مطلوب.', bad_slug: 'الرابط: حروف وأرقام وشرطات فقط.', slug_taken: 'هذا الرابط مستخدم لمادة أخرى.', fail: 'تعذر الحفظ', loadFail: 'تعذر تحميل البيانات.', blockN: 'الكتلة', emptyBlock: 'كتلة فارغة', needFile: 'ارفع ملفاً أولاً', badUrl: 'رابط غير صالح (http/https فقط)', quizOpts: 'السؤال يحتاج خيارين على الأقل ورقم إجابة صحيحاً', tooMany: 'عدد الكتل أكبر من المسموح (200).',
            noPerm: 'لا صلاحية للتعديل على هذه المادة.', partial: 'حُفظت المادة، لكن تعذر حذف الكتل القديمة؛ قد تظهر نسخ مكررة. أعد الحفظ.', blocksFail: 'حُفظت بيانات المادة، لكن فشل حفظ الكتل — لم يُفقد شيء من الكتل القديمة.',
            upload: 'رفع ملف', uploading: 'جارٍ الرفع…', uploaded: 'تم الرفع', badType: 'نوع الملف غير مسموح (JPEG / PNG / WebP / PDF فقط) أو محتواه لا يطابق امتداده.', tooBig: 'الملف أكبر من المسموح', upFail: 'تعذر رفع الملف', replace: 'استبدال', noFile: 'لم يُرفع ملف',
            heading: 'عنوان', paragraph: 'فقرة', list: 'قائمة', image: 'صورة', equation: 'معادلة', example: 'مثال محلول', table: 'جدول', pdf: 'ملف PDF', video: 'فيديو (رابط)', quiz: 'سؤال', references: 'مراجع',
            f_text: 'النص', f_level: 'المستوى', f_ordered: 'قائمة مرقّمة', f_items: 'العناصر (كل سطر عنصر)', f_alt: 'نص بديل', f_caption: 'تعليق', f_tex: 'المعادلة (LaTeX)', f_label: 'اسم المعادلة', f_legend: 'الرموز (سطر: رمز = معناه)', f_etitle: 'عنوان المثال', f_steps: 'الخطوات (كل سطر خطوة)', f_result: 'النتيجة',
            f_tcap: 'عنوان الجدول', f_headers: 'رؤوس الأعمدة (افصل بـ |)', f_rows: 'الصفوف (سطر لكل صف، الخلايا بـ |)', f_ptitle: 'عنوان الملف', f_url: 'رابط (YouTube أو تيليغرام أو غيره)', f_vtitle: 'عنوان الفيديو', f_q: 'السؤال', f_opts: 'الخيارات (كل سطر خيار)', f_ans: 'رقم الإجابة الصحيحة', f_exp: 'التفسير', f_refs: 'المراجع (سطر: العنوان | الرابط | ملاحظة)', hint: 'تنسيق داخل النص: **غامق** *مائل* `كود` [نص](https://رابط) و $معادلة$' },
        en: { new: 'New item', all: 'All statuses', empty: 'No items.', back: 'Back to list', save: 'Save', saving: 'Saving…', saved: 'Saved.', title: 'Title', slug: 'Slug', summary: 'Short summary', type: 'Content type', field: 'Field', status: 'Status', none: '— none —',
            draft: 'Draft', published: 'Published', archived: 'Archived', blocks: 'Blocks', add: 'Add a block', preview: 'Preview', hidePreview: 'Hide preview', up: 'Up', down: 'Down', del: 'Delete', confirmDel: 'Delete this block?', confirmLeave: 'You have unsaved changes. Discard them?',
            need_title: 'Title is required.', bad_slug: 'Slug: letters, digits and dashes only.', slug_taken: 'This slug belongs to another item.', fail: 'Could not save', loadFail: 'Could not load data.', blockN: 'Block', emptyBlock: 'empty block', needFile: 'upload a file first', badUrl: 'invalid link (http/https only)', quizOpts: 'A question needs at least 2 options and a valid correct number', tooMany: 'Too many blocks (max 200).',
            noPerm: 'You may not edit this item.', partial: 'The item was saved but the old blocks could not be removed; duplicates may appear. Save again.', blocksFail: 'Item data saved, but saving the blocks failed — nothing of the old blocks was lost.',
            upload: 'Upload file', uploading: 'Uploading…', uploaded: 'Uploaded', badType: 'File type not allowed (JPEG / PNG / WebP / PDF only) or its content does not match its extension.', tooBig: 'File is too large', upFail: 'Upload failed', replace: 'Replace', noFile: 'No file uploaded',
            heading: 'Heading', paragraph: 'Paragraph', list: 'List', image: 'Image', equation: 'Equation', example: 'Worked example', table: 'Table', pdf: 'PDF file', video: 'Video (link)', quiz: 'Question', references: 'References',
            f_text: 'Text', f_level: 'Level', f_ordered: 'Numbered list', f_items: 'Items (one per line)', f_alt: 'Alt text', f_caption: 'Caption', f_tex: 'Equation (LaTeX)', f_label: 'Equation name', f_legend: 'Symbols (line: symbol = meaning)', f_etitle: 'Example title', f_steps: 'Steps (one per line)', f_result: 'Result',
            f_tcap: 'Table caption', f_headers: 'Column headers (separate with |)', f_rows: 'Rows (one per line, cells with |)', f_ptitle: 'File title', f_url: 'Link (YouTube, Telegram, other)', f_vtitle: 'Video title', f_q: 'Question', f_opts: 'Options (one per line)', f_ans: 'Correct option number', f_exp: 'Explanation', f_refs: 'References (line: Title | URL | note)', hint: 'Inline: **bold** *italic* `code` [text](https://link) and $math$' }
    };
    var TYPES = ['heading', 'paragraph', 'list', 'image', 'equation', 'example', 'table', 'pdf', 'video', 'quiz', 'references'];
    var MAX_BLOCKS = 200, MAX_TEXT = 20000, IMG_MAX = 10 * 1024 * 1024, PDF_MAX = 50 * 1024 * 1024;
    var X = null, E = null, host = null;
    var L = function () { return X.lang(); }, t = function (k) { return TX[L()][k] || k; }, esc = function (s) { return X.esc(s); };

    /* ---------- raw (what the inputs hold) <-> content (what is stored) ---------- */
    var lines = function (s) { return String(s || '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean); };
    var pipes = function (s) { return String(s || '').split('|').map(function (x) { return x.trim(); }); };
    var strOf = function (v) { return v && typeof v === 'object' ? String(v.ar || v.en || '') : (v == null ? '' : String(v)); };
    function toRaw(type, c) {
        c = c && typeof c === 'object' ? c : {};
        switch (type) {
            case 'heading': return { text: strOf(c.text), level: Number(c.level) === 3 ? '3' : '2' };
            case 'paragraph': return { text: strOf(c.text) };
            case 'list': return { ordered: !!c.ordered, items: (c.items || []).map(strOf).join('\n') };
            case 'image': return { path: String(c.path || ''), alt: strOf(c.alt), caption: strOf(c.caption) };
            case 'equation': return { tex: String(c.tex || ''), label: strOf(c.label), legend: (c.legend || []).map(function (p) { return strOf(p[0]) + ' = ' + strOf(p[1]); }).join('\n') };
            case 'example': return { title: strOf(c.title), steps: (c.steps || []).map(strOf).join('\n'), result: strOf(c.result) };
            case 'table': return { caption: strOf(c.caption), headers: (c.headers || []).map(strOf).join(' | '), rows: (c.rows || []).map(function (r) { return (r || []).map(strOf).join(' | '); }).join('\n') };
            case 'pdf': return { path: String(c.path || ''), title: strOf(c.title) };
            case 'video': return { url: String(c.url || ''), title: strOf(c.title) };
            case 'quiz': return { question: strOf(c.question), options: (c.options || []).map(strOf).join('\n'), answer: String((Number(c.answer) || 0) + 1), explanation: strOf(c.explanation) };
            case 'references': return { items: (c.items || []).map(function (r) { return [strOf(r.title), String(r.url || ''), strOf(r.note)].join(' | '); }).join('\n') };
        }
        return {};
    }
    function build(type, r) {
        var u = function (k) { return String(r[k] || '').trim(); };
        switch (type) {
            case 'heading': return { text: u('text'), level: r.level === '3' ? 3 : 2 };
            case 'paragraph': return { text: u('text') };
            case 'list': return { ordered: !!r.ordered, items: lines(r.items) };
            case 'image': return { path: u('path'), alt: u('alt'), caption: u('caption') };
            case 'equation': return { tex: u('tex'), label: u('label'), legend: lines(r.legend).map(function (l) { var i = l.indexOf('='); return i < 0 ? [l, ''] : [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }) };
            case 'example': return { title: u('title'), steps: lines(r.steps), result: u('result') };
            case 'table': return { caption: u('caption'), headers: u('headers') ? pipes(r.headers) : [], rows: lines(r.rows).map(pipes) };
            case 'pdf': return { path: u('path'), title: u('title') };
            case 'video': return { url: u('url'), title: u('title') };
            case 'quiz': return { question: u('question'), options: lines(r.options), answer: (parseInt(r.answer, 10) || 1) - 1, explanation: u('explanation') };
            case 'references': return { items: lines(r.items).map(function (l) { var p = pipes(l); return { title: p[0] || '', url: p[1] || '', note: p[2] || '' }; }) };
        }
        return {};
    }
    function problem(b) {   /* returns a message key or '' */
        var c = build(b.type, b.raw), has = function (v) { return String(v || '').trim().length > 0; };
        if (JSON.stringify(b.raw).length > MAX_TEXT * 2) return 'tooBig';
        switch (b.type) {
            case 'heading': case 'paragraph': return has(c.text) ? '' : 'emptyBlock';
            case 'list': return c.items.length ? '' : 'emptyBlock';
            case 'image': case 'pdf': return has(c.path) ? '' : 'needFile';
            case 'equation': return has(c.tex) ? '' : 'emptyBlock';
            case 'example': return c.steps.length || has(c.result) ? '' : 'emptyBlock';
            case 'table': return c.rows.length ? '' : 'emptyBlock';
            case 'video': return /^https?:\/\/[^\s"'<>]+$/i.test(c.url) ? '' : 'badUrl';
            case 'quiz': return has(c.question) && c.options.length >= 2 && c.answer >= 0 && c.answer < c.options.length ? '' : 'quizOpts';
            case 'references': return c.items.length && c.items.every(function (i) { return has(i.title) && (!i.url || /^https?:\/\/[^\s"'<>]+$/i.test(i.url)); }) ? '' : (c.items.length ? 'badUrl' : 'emptyBlock');
        }
        return 'emptyBlock';
    }

    /* ---------- form field specs ---------- */
    var SPEC = {
        heading: [['text', 'f_text', 'in'], ['level', 'f_level', 'sel', ['2', '3']]],
        paragraph: [['text', 'f_text', 'ta', 5]],
        list: [['ordered', 'f_ordered', 'ck'], ['items', 'f_items', 'ta', 5]],
        image: [['path', 'upload', 'file', 'image'], ['alt', 'f_alt', 'in'], ['caption', 'f_caption', 'in']],
        equation: [['tex', 'f_tex', 'ta', 3, 'ltr'], ['label', 'f_label', 'in'], ['legend', 'f_legend', 'ta', 3]],
        example: [['title', 'f_etitle', 'in'], ['steps', 'f_steps', 'ta', 5], ['result', 'f_result', 'in']],
        table: [['caption', 'f_tcap', 'in'], ['headers', 'f_headers', 'in'], ['rows', 'f_rows', 'ta', 5]],
        pdf: [['path', 'upload', 'file', 'pdf'], ['title', 'f_ptitle', 'in']],
        video: [['url', 'f_url', 'in', 0, 'ltr'], ['title', 'f_vtitle', 'in']],
        quiz: [['question', 'f_q', 'in'], ['options', 'f_opts', 'ta', 4], ['answer', 'f_ans', 'num'], ['explanation', 'f_exp', 'ta', 2]],
        references: [['items', 'f_refs', 'ta', 5, 'ltr']]
    };
    var uid = 0;
    function fieldHtml(bi, b, s) {
        var k = s[0], id = 'f' + (++uid), v = b.raw[k], lab = '<label for="' + id + '">' + esc(t(s[1])) + '</label>';
        var at = ' id="' + id + '" data-b="' + bi + '" data-f="' + k + '"' + (s[4] === 'ltr' ? ' dir="ltr"' : '');
        switch (s[2]) {
            case 'in': return lab + '<input type="text" maxlength="500"' + at + ' value="' + esc(v) + '">';
            case 'ta': return lab + '<textarea rows="' + s[3] + '" maxlength="' + MAX_TEXT + '"' + at + '>' + esc(v) + '</textarea>';
            case 'num': return lab + '<input type="number" min="1" max="20"' + at + ' value="' + esc(v) + '">';
            case 'sel': return lab + '<select' + at + '>' + s[3].map(function (o) { return '<option' + (o === v ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select>';
            case 'ck': return '<label class="adm-ck"><input type="checkbox"' + at + (v ? ' checked' : '') + '> ' + esc(t(s[1])) + '</label>';
            case 'file': return '<div class="adm-file"><span class="adm-badge" data-fname="' + bi + '">' + (v ? esc(String(v).split('/').pop()) : esc(t('noFile'))) + '</span> <button type="button" data-upload="' + bi + '" data-kind="' + s[3] + '">' + esc(v ? t('replace') : t('upload')) + '</button>' +
                '<input type="file" class="adm-hid" data-pick="' + bi + '" accept="' + (s[3] === 'pdf' ? 'application/pdf' : 'image/jpeg,image/png,image/webp') + '"><span class="adm-muted" data-ustat="' + bi + '"></span></div>';
        }
        return '';
    }
    function blockHtml(b, i, n) {
        return '<div class="adm-card adm-blk" data-blk="' + i + '"><div class="adm-blkhd"><b>' + (i + 1) + '. ' + esc(t(b.type)) + '</b><span><button type="button" data-mv="-1" data-i="' + i + '"' + (i === 0 ? ' disabled' : '') + '>' + esc(t('up')) + '</button> <button type="button" data-mv="1" data-i="' + i + '"' + (i === n - 1 ? ' disabled' : '') + '>' + esc(t('down')) + '</button> <button type="button" class="adm-dng" data-bdel="' + i + '">' + esc(t('del')) + '</button></span></div>' +
            SPEC[b.type].map(function (s) { return fieldHtml(i, b, s); }).join('') + ((b.type === 'paragraph' || b.type === 'list' || b.type === 'example') ? '<div class="adm-muted">' + esc(t('hint')) + '</div>' : '') + '</div>';
    }

    /* ---------- list view ---------- */
    function lookups() {
        if (E.lk) return Promise.resolve(E.lk);
        return Promise.all([X.client.from('engineering_fields').select('id,name_ar,name_en').order('name_en'), X.client.from('content_types').select('id,name_ar,name_en').order('name_en')]).then(function (r) {
            E.lk = { fields: r[0].data || [], types: r[1].data || [] }; return E.lk;
        });
    }
    var nm = function (o) { return o ? (L() === 'ar' ? o.name_ar || o.name_en : o.name_en || o.name_ar) : ''; };
    function showList() {
        E.view = 'list'; host.innerHTML = '<p class="adm-muted adm-c">…</p>';
        var q = X.client.from('content_items').select('id,title,status,field_id,content_type_id,updated_at').order('updated_at', { ascending: false }).limit(200);
        if (E.filter) q = q.eq('status', E.filter);
        Promise.all([q, lookups()]).then(function (r) {
            if (r[0].error) throw 0;
            var rows = r[0].data || [], lk = r[1], by = function (a, id) { return a.filter(function (x) { return x.id === id; })[0]; };
            host.innerHTML = '<div class="adm-card"><div class="adm-row"><div><select data-filter aria-label="' + esc(t('status')) + '"><option value="">' + esc(t('all')) + '</option>' + ['draft', 'published', 'archived'].map(function (s) { return '<option value="' + s + '"' + (E.filter === s ? ' selected' : '') + '>' + esc(t(s)) + '</option>'; }).join('') + '</select></div>' +
                '<button type="button" class="adm-pri" data-new>' + esc(t('new')) + '</button></div>' + (E.msg ? '<div class="adm-ok" role="status">' + esc(E.msg) + '</div>' : '') + '</div>' +
                '<div class="adm-card">' + (rows.length ? '<div class="adm-tblw"><table class="adm-tbl"><tbody>' + rows.map(function (x) {
                    return '<tr><td><button type="button" class="adm-lnk" data-open="' + esc(x.id) + '" dir="auto">' + esc(x.title || '—') + '</button></td><td class="adm-muted">' + esc(nm(by(lk.types, x.content_type_id))) + '</td><td class="adm-muted">' + esc(nm(by(lk.fields, x.field_id))) + '</td><td><span class="adm-badge">' + esc(t(x.status === 'published' || x.status === 'archived' ? x.status : 'draft')) + '</span></td><td class="adm-muted">' + esc((x.updated_at || '').slice(0, 10)) + '</td></tr>';
                }).join('') + '</tbody></table></div>' : '<p class="adm-muted">' + esc(t('empty')) + '</p>') + '</div>';
            E.msg = '';
        }).catch(function () { host.innerHTML = '<div class="adm-card adm-err">' + esc(t('loadFail')) + '</div>'; });
    }

    /* ---------- edit view ---------- */
    function blank() { return { id: null, title: '', slug: '', summary: '', content_type_id: '', field_id: '', status: 'draft', published_at: null, slugAuto: true }; }
    function openItem(id) {
        host.innerHTML = '<p class="adm-muted adm-c">…</p>';
        Promise.all([X.client.from('content_items').select('id,title,slug,summary,content_type_id,field_id,status,published_at').eq('id', id).maybeSingle(), X.client.from('content_blocks').select('id,block_type,content,sort_order').eq('content_item_id', id).order('sort_order', { ascending: true }), lookups()]).then(function (r) {
            if (r[0].error || r[1].error || !r[0].data) throw 0;
            var it = r[0].data; E.item = { id: it.id, title: it.title || '', slug: it.slug || '', summary: it.summary || '', content_type_id: it.content_type_id || '', field_id: it.field_id || '', status: it.status || 'draft', published_at: it.published_at, slugAuto: false };
            E.blocks = (r[1].data || []).filter(function (b) { return SPEC[b.block_type]; }).map(function (b) { return { type: b.block_type, raw: toRaw(b.block_type, b.content) }; });
            E.oldIds = (r[1].data || []).filter(function (b) { return SPEC[b.block_type]; }).map(function (b) { return b.id; }); /* unknown block types are never touched */ E.dirty = false; E.preview = false; E.err = ''; E.ok = ''; showEdit();
        }).catch(function () { host.innerHTML = '<div class="adm-card adm-err">' + esc(t('loadFail')) + '</div>'; });
    }
    function newItem() { E.item = blank(); E.blocks = []; E.oldIds = []; E.dirty = false; E.preview = false; E.err = ''; E.ok = ''; lookups().then(showEdit); }
    function opts(list, sel) { return '<option value="">' + esc(t('none')) + '</option>' + list.map(function (o) { return '<option value="' + esc(o.id) + '"' + (o.id === sel ? ' selected' : '') + '>' + esc(nm(o)) + '</option>'; }).join(''); }
    function showEdit() {
        E.view = 'edit'; var it = E.item, lk = E.lk;
        host.innerHTML = '<div class="adm-card"><div class="adm-row"><button type="button" data-back>' + esc(t('back')) + '</button><button type="button" data-prev>' + esc(E.preview ? t('hidePreview') : t('preview')) + '</button><button type="button" class="adm-pri" data-save>' + esc(t('save')) + '</button></div><div id="adm-emsg">' + emsg() + '</div></div>' +
            '<div class="adm-card"><label for="m-title">' + esc(t('title')) + '</label><input id="m-title" data-m="title" maxlength="200" dir="auto" value="' + esc(it.title) + '">' +
            '<label for="m-slug">' + esc(t('slug')) + '</label><input id="m-slug" data-m="slug" maxlength="80" dir="ltr" value="' + esc(it.slug) + '">' +
            '<label for="m-sum">' + esc(t('summary')) + '</label><textarea id="m-sum" data-m="summary" rows="2" maxlength="500" dir="auto">' + esc(it.summary) + '</textarea>' +
            '<div class="adm-row"><div><label for="m-type">' + esc(t('type')) + '</label><select id="m-type" data-m="content_type_id">' + opts(lk.types, it.content_type_id) + '</select></div><div><label for="m-field">' + esc(t('field')) + '</label><select id="m-field" data-m="field_id">' + opts(lk.fields, it.field_id) + '</select></div>' +
            '<div><label for="m-st">' + esc(t('status')) + '</label><select id="m-st" data-m="status">' + ['draft', 'published', 'archived'].map(function (s) { return '<option value="' + s + '"' + (it.status === s ? ' selected' : '') + '>' + esc(t(s)) + '</option>'; }).join('') + '</select></div></div></div>' +
            '<h2>' + esc(t('blocks')) + '</h2><div id="adm-blocks"></div><div class="adm-card"><div class="adm-row"><div><label for="m-add">' + esc(t('add')) + '</label><select id="m-add">' + TYPES.map(function (k) { return '<option value="' + k + '">' + esc(t(k)) + '</option>'; }).join('') + '</select></div><button type="button" data-addblk>' + esc(t('add')) + '</button></div></div>' +
            '<div id="adm-prev"></div>';
        drawBlocks(); drawPreview();
    }
    function emsg() { return E.err ? '<div class="adm-err" role="alert">' + esc(E.err) + '</div>' : (E.ok ? '<div class="adm-ok" role="status">' + esc(E.ok) + '</div>' : ''); }
    function say(err, ok) { E.err = err || ''; E.ok = ok || ''; var b = document.getElementById('adm-emsg'); if (b) b.innerHTML = emsg(); }
    function drawBlocks() { var el = document.getElementById('adm-blocks'); if (el) el.innerHTML = E.blocks.map(function (b, i) { return blockHtml(b, i, E.blocks.length); }).join(''); }

    /* ---------- preview (same renderer as the public Academy) ---------- */
    function signedFor(paths) {
        var list = Array.from(new Set((paths || []).filter(Boolean)));
        if (!list.length) return Promise.resolve({});
        return X.client.storage.from(X.cfg.bucket).createSignedUrls(list, 600).then(function (r) { var m = {}; ((r && r.data) || []).forEach(function (x) { if (x && x.signedUrl && !x.error) m[x.path] = x.signedUrl; }); return m; }).catch(function () { return {}; });
    }
    function drawPreview() {
        var el = document.getElementById('adm-prev'); if (!el) return;
        if (!E.preview || !window.AcademyRender) { el.innerHTML = ''; return; }
        var R = window.AcademyRender, bl = E.blocks.map(function (b, i) { return { id: 'p' + i, block_type: b.type, content: build(b.type, b.raw), sort_order: i }; });
        el.innerHTML = '<div class="adm-card"><div id="page-academy"><article class="ac-article" dir="' + (/[؀-ۿ]/.test(E.item.title) ? 'rtl' : 'ltr') + '"><h2 class="ac-h2">' + esc(E.item.title) + '</h2><div class="ac-body">' + R.blocksHtml(bl, L()) + '</div></article></div></div>';
        R.mount(el, { signed: signedFor, loadKatex: window.AcademyAPI ? window.AcademyAPI.loadKatex : function () { return Promise.reject(); } });
    }

    /* ---------- uploads ---------- */
    function sig(buf) {
        var b = new Uint8Array(buf), s = function (a) { return a.every(function (v, i) { return b[i] === v; }); };
        if (s([0xFF, 0xD8, 0xFF])) return 'image/jpeg'; if (s([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) return 'image/png';
        if (s([0x52, 0x49, 0x46, 0x46]) && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp'; if (s([0x25, 0x50, 0x44, 0x46])) return 'application/pdf';
        return '';
    }
    function shrink(file) {   /* saves Free-plan storage: max 1600 px, re-encoded as WebP when that is really smaller */
        if (!window.createImageBitmap || !window.HTMLCanvasElement) return Promise.resolve(file);
        return createImageBitmap(file).then(function (bm) {
            var sc = Math.min(1, 1600 / Math.max(bm.width, bm.height)); if (sc === 1 && file.size < 400 * 1024) return file;
            var c = document.createElement('canvas'); c.width = Math.max(1, Math.round(bm.width * sc)); c.height = Math.max(1, Math.round(bm.height * sc)); c.getContext('2d').drawImage(bm, 0, 0, c.width, c.height);
            return new Promise(function (res) { c.toBlob(function (bl) { res(bl && bl.size && bl.size < file.size ? bl : file); }, 'image/webp', 0.85); });
        }).catch(function () { return file; });
    }
    var EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'application/pdf': 'pdf' };
    function upload(file, kind) {
        var want = kind === 'pdf' ? ['application/pdf'] : ['image/jpeg', 'image/png', 'image/webp'];
        if (file.size > (kind === 'pdf' ? PDF_MAX : IMG_MAX)) return Promise.reject('tooBig');
        return file.slice(0, 16).arrayBuffer().then(function (buf) {
            var mime = sig(buf); if (want.indexOf(mime) < 0) throw 'badType';
            return (kind === 'pdf' ? Promise.resolve(file) : shrink(file)).then(function (out) {
                var mt = out.type && EXT[out.type] ? out.type : mime, id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
                var base = (file.name || 'file').replace(/\.[^.]*$/, '').replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'file';
                var path = (kind === 'pdf' ? 'pdf/' : 'img/') + id + '-' + base + '.' + EXT[mt];
                return X.client.storage.from(X.cfg.bucket).upload(path, out, { contentType: mt, upsert: false, cacheControl: '3600' }).then(function (r) {
                    if (r.error) throw 'upFail';
                    X.client.from('media_files').insert({ file_path: path, file_name: String(file.name || base).slice(0, 200), file_size: out.size, mime_type: mt, bucket_name: X.cfg.bucket, uploaded_by: X.user.id }).then(function () {}, function () {});
                    return path;
                });
            });
        });
    }

    /* ---------- save ---------- */
    var slugify = function (s) { return String(s || '').trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 80); };
    var SLUG = /^[\p{L}\p{N}][\p{L}\p{N}-]{0,79}$/u;
    function save() {
        if (E.saving) return; var it = E.item;
        if (!it.title.trim()) return say(t('need_title'));
        if (!it.slug) it.slug = slugify(it.title) || 'item-' + Date.now().toString(36);
        if (!SLUG.test(it.slug)) return say(t('bad_slug'));
        if (E.blocks.length > MAX_BLOCKS) return say(t('tooMany'));
        for (var i = 0; i < E.blocks.length; i++) { var p = problem(E.blocks[i]); if (p) return say(t('blockN') + ' ' + (i + 1) + ': ' + t(p)); }
        E.saving = true; say('', t('saving'));
        var row = { title: it.title.trim(), slug: it.slug, summary: it.summary.trim() || null, content_type_id: it.content_type_id || null, field_id: it.field_id || null, status: it.status, updated_at: new Date().toISOString() };
        if (it.status === 'published' && !it.published_at) { it.published_at = new Date().toISOString(); } if (it.published_at) row.published_at = it.published_at;
        var c = X.client, step1 = it.id ? c.from('content_items').update(row).eq('id', it.id).select('id') : c.from('content_items').insert(Object.assign({ author_id: X.user.id }, row)).select('id').single();
        step1.then(function (r) {
            if (r.error) { E.saving = false; return say(r.error.code === '23505' ? t('slug_taken') : t('fail') + ': ' + String(r.error.message || '').slice(0, 160)); }
            if (it.id && !(r.data && r.data.length)) { E.saving = false; return say(t('fail') + ': ' + t('noPerm')); }
            var id = it.id || (r.data && r.data.id); if (!id) { E.saving = false; return say(t('fail')); } it.id = id;
            var rows = E.blocks.map(function (b, i) { return { content_item_id: id, block_type: b.type, content: build(b.type, b.raw), sort_order: i }; });
            /* safe order: write the NEW blocks first, remove the OLD ones afterwards, so a failure never loses content */
            return (rows.length ? c.from('content_blocks').insert(rows).select('id') : Promise.resolve({ data: [], error: null })).then(function (r2) {
                if (r2.error) { E.saving = false; return say(t('blocksFail')); }
                var fresh = (r2.data || []).map(function (x) { return x.id; }), old = E.oldIds.slice();
                return (old.length ? c.from('content_blocks').delete().in('id', old).select('id') : Promise.resolve({ error: null })).then(function (r3) {
                    E.saving = false;
                    if (r3.error || (r3.data && r3.data.length < old.length)) { E.oldIds = old.concat(fresh); return say(t('partial')); }
                    E.oldIds = fresh; E.dirty = false; say('', t('saved'));
                });
            });
        }).catch(function () { E.saving = false; say(t('fail')); });
    }
    function leave(go) { if (E.dirty && !window.confirm(t('confirmLeave'))) return; E.dirty = false; go(); }

    /* ---------- events ---------- */
    function onInput(ev) {
        var el = ev.target;
        if (ev.type === 'input' && (el.hasAttribute('data-pick') || el.hasAttribute('data-filter'))) return;
        if (el.hasAttribute('data-m')) {
            var k = el.getAttribute('data-m'); E.item[k] = el.value; E.dirty = true;
            if (k === 'title' && E.item.slugAuto) { E.item.slug = slugify(el.value); var sl = document.getElementById('m-slug'); if (sl) sl.value = E.item.slug; }
            if (k === 'slug') E.item.slugAuto = false;
        } else if (el.hasAttribute('data-b')) {
            var b = E.blocks[Number(el.getAttribute('data-b'))]; if (!b) return; b.raw[el.getAttribute('data-f')] = el.type === 'checkbox' ? el.checked : el.value; E.dirty = true;
            if (E.preview) { clearTimeout(E.pt); E.pt = setTimeout(drawPreview, 500); }
        } else if (el.hasAttribute('data-filter')) { E.filter = el.value; showList(); }
        else if (el.hasAttribute('data-pick') && el.files && el.files[0]) {
            var bi = Number(el.getAttribute('data-pick')), blk = E.blocks[bi], kind = blk.type === 'pdf' ? 'pdf' : 'image', st = host.querySelector('[data-ustat="' + bi + '"]'), f = el.files[0]; el.value = '';
            if (st) st.textContent = t('uploading');
            upload(f, kind).then(function (path) { blk.raw.path = path; E.dirty = true; drawBlocks(); drawPreview(); var s2 = host.querySelector('[data-ustat="' + bi + '"]'); if (s2) s2.textContent = t('uploaded'); },
                function (e) { var s2 = host.querySelector('[data-ustat="' + bi + '"]'); if (s2) s2.textContent = t(typeof e === 'string' && TX.ar[e] ? e : 'upFail'); });
        }
    }
    function onClick(ev) {
        var el = ev.target.closest('button'); if (!el) return;
        if (el.hasAttribute('data-new')) return newItem();
        if (el.hasAttribute('data-open')) return openItem(el.getAttribute('data-open'));
        if (el.hasAttribute('data-back')) return leave(showList);
        if (el.hasAttribute('data-save')) return save();
        if (el.hasAttribute('data-prev')) { E.preview = !E.preview; el.textContent = E.preview ? t('hidePreview') : t('preview'); return drawPreview(); }
        if (el.hasAttribute('data-addblk')) { var ty = document.getElementById('m-add').value; if (!SPEC[ty]) return; if (E.blocks.length >= MAX_BLOCKS) return say(t('tooMany')); E.blocks.push({ type: ty, raw: toRaw(ty, {}) }); E.dirty = true; drawBlocks(); drawPreview(); return; }
        if (el.hasAttribute('data-bdel')) { if (!window.confirm(t('confirmDel'))) return; E.blocks.splice(Number(el.getAttribute('data-bdel')), 1); E.dirty = true; drawBlocks(); drawPreview(); return; }
        if (el.hasAttribute('data-mv')) { var i = Number(el.getAttribute('data-i')), j = i + Number(el.getAttribute('data-mv')); if (j < 0 || j >= E.blocks.length) return; var tmp = E.blocks[i]; E.blocks[i] = E.blocks[j]; E.blocks[j] = tmp; E.dirty = true; drawBlocks(); drawPreview(); return; }
        if (el.hasAttribute('data-upload')) { var inp = host.querySelector('[data-pick="' + el.getAttribute('data-upload') + '"]'); if (inp) inp.click(); }
    }
    window.addEventListener('beforeunload', function (e) { if (E && E.dirty) { e.preventDefault(); e.returnValue = ''; } });

    window.AdminEditor = {
        mount: function (el, ctx) {
            X = ctx; host = el;
            if (E && E.uid !== ctx.user.id) E = null;
            if (!E) E = { uid: ctx.user.id, view: 'list', filter: '', lk: null, item: null, blocks: [], oldIds: [], dirty: false, msg: '' };
            if (!host.__ae) { host.__ae = true; }
            host.addEventListener('input', onInput); host.addEventListener('change', onInput); host.addEventListener('click', onClick);
            if (E.view === 'edit' && E.item) showEdit(); else showList();
        },
        _build: build, _toRaw: toRaw, _sig: sig
    };
})();
