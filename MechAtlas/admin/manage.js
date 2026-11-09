/* MechAtlas Academy — Group D: series management + trash. Mounted by admin.js (tabs "Series" and "Trash"). */
(function () {
    'use strict';
    var TX = {
        ar: { newS: 'سلسلة جديدة', empty: 'لا توجد سلاسل.', items: 'مادة', back: 'رجوع', save: 'حفظ', saved: 'تم الحفظ.', saving: 'جارٍ الحفظ…', title: 'العنوان', slug: 'الرابط (slug)', desc: 'وصف', field: 'المجال', none: '— بلا —', members: 'مواد السلسلة (بالترتيب)', noMembers: 'لا مواد بعد.', add: 'إضافة', pick: 'اختر مادة…', up: 'أعلى', down: 'أسفل', rm: 'إزالة من السلسلة', draftNote: 'المسودات لا تظهر للزوار حتى تُنشر.',
            draft: 'مسودة', published: 'منشور', archived: 'مؤرشف', need_title: 'العنوان مطلوب.', bad_slug: 'الرابط: حروف وأرقام وشرطات فقط.', slug_taken: 'هذا الرابط مستخدم.', fail: 'تعذر الحفظ', loadFail: 'تعذر تحميل البيانات.', noPerm: 'لا صلاحية للتعديل.', partial: 'حُفظت السلسلة جزئياً؛ راجع الترتيب وأعد الحفظ.',
            delS: 'حذف السلسلة (المواد نفسها تبقى)', confirmDelS: 'حذف هذه السلسلة نهائياً؟ المواد لا تُحذف.', mgrOnly: 'للمدير فقط.', confirmLeave: 'توجد تغييرات غير محفوظة. تجاهلها؟', deleted: 'حُذفت السلسلة.',
            trash: 'المحذوفات (المؤرشفة)', trashEmpty: 'سلة المحذوفات فارغة.', restore: 'استعادة كمسودة', purge: 'حذف نهائي', confirmPurge: 'حذف نهائي لا رجعة فيه. اكتب كلمة DELETE للتأكيد:', purged: 'حُذفت المادة نهائياً.', restored: 'استُعيدت كمسودة.', purgeFail: 'تعذر الحذف النهائي (قد تكون المادة مرتبطة بسجلات أخرى)', trashHint: 'المادة تنتقل إلى هنا حين تضبط حالتها «مؤرشف» من المحرر.' },
        en: { newS: 'New series', empty: 'No series.', items: 'items', back: 'Back', save: 'Save', saved: 'Saved.', saving: 'Saving…', title: 'Title', slug: 'Slug', desc: 'Description', field: 'Field', none: '— none —', members: 'Items in this series (in order)', noMembers: 'No items yet.', add: 'Add', pick: 'Pick an item…', up: 'Up', down: 'Down', rm: 'Remove from series', draftNote: 'Drafts stay hidden from visitors until published.',
            draft: 'Draft', published: 'Published', archived: 'Archived', need_title: 'Title is required.', bad_slug: 'Slug: letters, digits and dashes only.', slug_taken: 'This slug is taken.', fail: 'Could not save', loadFail: 'Could not load data.', noPerm: 'You may not edit this.', partial: 'The series was saved partly; check the order and save again.',
            delS: 'Delete series (items stay)', confirmDelS: 'Delete this series permanently? The items are NOT deleted.', mgrOnly: 'Managers only.', confirmLeave: 'You have unsaved changes. Discard them?', deleted: 'Series deleted.',
            trash: 'Trash (archived)', trashEmpty: 'The trash is empty.', restore: 'Restore as draft', purge: 'Delete forever', confirmPurge: 'Permanent deletion cannot be undone. Type DELETE to confirm:', purged: 'Item deleted permanently.', restored: 'Restored as draft.', purgeFail: 'Could not delete permanently (the item may be referenced elsewhere)', trashHint: 'An item lands here when you set its status to "Archived" in the editor.' }
    };
    var X, host, S = null, mode = '';
    var L = function () { return X.lang(); }, t = function (k) { return TX[L()][k] || k; }, esc = function (s) { return X.esc(s); };
    var SLUG = /^[\p{L}\p{N}][\p{L}\p{N}-]{0,79}$/u;
    var slugify = function (s) { return String(s || '').trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 80); };
    var nm = function (o) { return o ? (L() === 'ar' ? o.name_ar || o.name_en : o.name_en || o.name_ar) : ''; };
    var st = function (s) { return t(s === 'published' || s === 'archived' ? s : 'draft'); };

    /* ================= series ================= */
    function listSeries() {
        S = null; mode = 'list'; host.innerHTML = '<p class="adm-muted adm-c">…</p>';
        Promise.all([X.client.from('series').select('id,title,slug,created_at').order('created_at', { ascending: false }).limit(200), X.client.from('series_items').select('series_id')]).then(function (r) {
            if (r[0].error || r[1].error) throw 0;
            var cnt = {}; (r[1].data || []).forEach(function (x) { cnt[x.series_id] = (cnt[x.series_id] || 0) + 1; });
            var rows = r[0].data || [];
            host.innerHTML = '<div class="adm-card"><button type="button" class="adm-pri" data-snew>' + esc(t('newS')) + '</button>' + (S0.msg ? '<div class="adm-ok" role="status">' + esc(S0.msg) + '</div>' : '') + '</div><div class="adm-card">' +
                (rows.length ? '<div class="adm-tblw"><table class="adm-tbl"><tbody>' + rows.map(function (x) { return '<tr><td><button type="button" class="adm-lnk" data-sopen="' + esc(x.id) + '" dir="auto">' + esc(x.title) + '</button></td><td class="adm-muted">' + (cnt[x.id] || 0) + ' ' + esc(t('items')) + '</td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="adm-muted">' + esc(t('empty')) + '</p>') + '</div>';
            S0.msg = '';
        }).catch(function () { host.innerHTML = '<div class="adm-card adm-err">' + esc(t('loadFail')) + '</div>'; });
    }
    var S0 = { msg: '' };
    function fields() { return X.client.from('engineering_fields').select('id,name_ar,name_en').order('name_en').then(function (r) { return r.data || []; }, function () { return []; }); }
    function openSeries(id) {
        host.innerHTML = '<p class="adm-muted adm-c">…</p>';
        var p = id ? Promise.all([X.client.from('series').select('id,title,slug,description,field_id').eq('id', id).maybeSingle(), X.client.from('series_items').select('id,content_item_id,sort_order').eq('series_id', id).order('sort_order', { ascending: true })]) : Promise.resolve([{ data: { id: null, title: '', slug: '', description: '', field_id: '' } }, { data: [] }]);
        Promise.all([p, X.client.from('content_items').select('id,title,status').neq('status', 'archived').order('title').limit(500), fields()]).then(function (r) {
            var a = r[0][0], b = r[0][1]; if (a.error || b.error || !a.data || r[1].error) throw 0;
            var all = {}; (r[1].data || []).forEach(function (x) { all[x.id] = x; });
            S = { id: a.data.id, title: a.data.title || '', slug: a.data.slug || '', description: a.data.description || '', field_id: a.data.field_id || '', auto: !id, all: all, fields: r[2], rows: (b.data || []).map(function (x) { return { rid: x.id, cid: x.content_item_id }; }), orig: (b.data || []).map(function (x) { return { rid: x.id, cid: x.content_item_id, ord: x.sort_order }; }), dirty: false, err: '', ok: '' };
            // items of the series that are archived/missing from `all` are shown by id only
            drawSeries();
        }).catch(function () { host.innerHTML = '<div class="adm-card adm-err">' + esc(t('loadFail')) + '</div>'; });
    }
    function sm() { return S.err ? '<div class="adm-err" role="alert">' + esc(S.err) + '</div>' : (S.ok ? '<div class="adm-ok" role="status">' + esc(S.ok) + '</div>' : ''); }
    function say(e, o) { S.err = e || ''; S.ok = o || ''; var b = document.getElementById('adm-smsg'); if (b) b.innerHTML = sm(); }
    function drawSeries() {
        mode = 'edit';
        var used = {}; S.rows.forEach(function (r) { used[r.cid] = 1; });
        var avail = Object.keys(S.all).filter(function (k) { return !used[k]; }).map(function (k) { return S.all[k]; });
        host.innerHTML = '<div class="adm-card"><div class="adm-row"><button type="button" data-sback>' + esc(t('back')) + '</button><button type="button" class="adm-pri" data-ssave>' + esc(t('save')) + '</button>' + (S.id && X.isManager ? '<button type="button" class="adm-dng" data-sdel>' + esc(t('delS')) + '</button>' : '') + '</div><div id="adm-smsg">' + sm() + '</div></div>' +
            '<div class="adm-card"><label for="s-t">' + esc(t('title')) + '</label><input id="s-t" data-s="title" maxlength="200" dir="auto" value="' + esc(S.title) + '"><label for="s-s">' + esc(t('slug')) + '</label><input id="s-s" data-s="slug" maxlength="80" dir="ltr" value="' + esc(S.slug) + '">' +
            '<label for="s-d">' + esc(t('desc')) + '</label><textarea id="s-d" data-s="description" rows="3" maxlength="1000" dir="auto">' + esc(S.description) + '</textarea>' +
            '<label for="s-f">' + esc(t('field')) + '</label><select id="s-f" data-s="field_id"><option value="">' + esc(t('none')) + '</option>' + S.fields.map(function (f) { return '<option value="' + esc(f.id) + '"' + (f.id === S.field_id ? ' selected' : '') + '>' + esc(nm(f)) + '</option>'; }).join('') + '</select></div>' +
            '<div class="adm-card"><h2>' + esc(t('members')) + '</h2>' + (S.rows.length ? '<div class="adm-tblw"><table class="adm-tbl"><tbody>' + S.rows.map(function (r, i) {
                var it = S.all[r.cid];
                return '<tr><td>' + (i + 1) + '</td><td dir="auto">' + esc(it ? it.title : r.cid) + '</td><td><span class="adm-badge">' + esc(it ? st(it.status) : st('archived')) + '</span></td><td><button type="button" data-smv="-1" data-i="' + i + '"' + (i === 0 ? ' disabled' : '') + '>' + esc(t('up')) + '</button> <button type="button" data-smv="1" data-i="' + i + '"' + (i === S.rows.length - 1 ? ' disabled' : '') + '>' + esc(t('down')) + '</button> <button type="button" class="adm-dng" data-srm="' + i + '">' + esc(t('rm')) + '</button></td></tr>';
            }).join('') + '</tbody></table></div>' : '<p class="adm-muted">' + esc(t('noMembers')) + '</p>') +
            '<div class="adm-row"><div><select id="s-add" aria-label="' + esc(t('add')) + '"><option value="">' + esc(t('pick')) + '</option>' + avail.map(function (it) { return '<option value="' + esc(it.id) + '">' + esc(it.title) + ' — ' + esc(st(it.status)) + '</option>'; }).join('') + '</select></div><button type="button" data-sadd>' + esc(t('add')) + '</button></div><p class="adm-muted">' + esc(t('draftNote')) + '</p></div>';
    }
    var busy = false;
    function saveSeries() {
        if (busy) return; if (!S.title.trim()) return say(t('need_title'));
        if (!S.slug) S.slug = slugify(S.title) || 'series-' + Date.now().toString(36); if (!SLUG.test(S.slug)) return say(t('bad_slug'));
        busy = true; say('', t('saving')); var c = X.client;
        var row = { title: S.title.trim(), slug: S.slug, description: S.description.trim() || null, field_id: S.field_id || null };
        var s1 = S.id ? c.from('series').update(row).eq('id', S.id).select('id') : c.from('series').insert(row).select('id').single();
        s1.then(function (r) {
            if (r.error) { busy = false; return say(r.error.code === '23505' ? t('slug_taken') : t('fail') + ': ' + String(r.error.message || '').slice(0, 160)); }
            if (S.id && !(r.data && r.data.length)) { busy = false; return say(t('noPerm')); }
            var sid = S.id || (r.data && r.data.id); if (!sid) { busy = false; return say(t('fail')); } S.id = sid;
            /* diff (no delete-all): update kept rows' order, insert new, delete removed — never leaves duplicates */
            var keepIds = {}, ops = [], ins = [];
            S.rows.forEach(function (x, i) { if (x.rid) { keepIds[x.rid] = 1; var o = S.orig.filter(function (q) { return q.rid === x.rid; })[0]; if (!o || o.ord !== i) ops.push(c.from('series_items').update({ sort_order: i }).eq('id', x.rid).select('id')); } else ins.push({ series_id: sid, content_item_id: x.cid, sort_order: i }); });
            var gone = S.orig.filter(function (q) { return !keepIds[q.rid]; }).map(function (q) { return q.rid; });
            return Promise.all(ops).then(function (u) {
                var bad = u.some(function (z) { return z.error || !(z.data && z.data.length); });
                return (ins.length ? c.from('series_items').insert(ins).select('id,content_item_id') : Promise.resolve({ data: [], error: null })).then(function (n) {
                    return (gone.length ? c.from('series_items').delete().in('id', gone).select('id') : Promise.resolve({ data: [], error: null })).then(function (d) {
                        busy = false;
                        var newRows = n.data || []; S.rows.forEach(function (x) { if (!x.rid) { var f = newRows.filter(function (y) { return y.content_item_id === x.cid; })[0]; if (f) x.rid = f.id; } });
                        S.orig = S.rows.filter(function (x) { return x.rid; }).map(function (x, i) { return { rid: x.rid, cid: x.cid, ord: S.rows.indexOf(x) }; });
                        if (bad || n.error || d.error || (gone.length && !(d.data && d.data.length === gone.length))) return say(t('partial'));
                        S.dirty = false; say('', t('saved'));
                    });
                });
            });
        }).catch(function () { busy = false; say(t('fail')); });
    }

    /* ================= trash ================= */
    function trash() {
        host.innerHTML = '<p class="adm-muted adm-c">…</p>';
        X.client.from('content_items').select('id,title,updated_at').eq('status', 'archived').order('updated_at', { ascending: false }).limit(200).then(function (r) {
            if (r.error) throw 0; var rows = r.data || [];
            host.innerHTML = '<div class="adm-card">' + (T0.msg ? '<div class="adm-ok" role="status">' + esc(T0.msg) + '</div>' : '') + (T0.err ? '<div class="adm-err" role="alert">' + esc(T0.err) + '</div>' : '') + '<h2>' + esc(t('trash')) + '</h2><p class="adm-muted">' + esc(t('trashHint')) + '</p>' +
                (rows.length ? '<div class="adm-tblw"><table class="adm-tbl"><tbody>' + rows.map(function (x) { return '<tr><td dir="auto">' + esc(x.title) + '</td><td class="adm-muted">' + esc((x.updated_at || '').slice(0, 10)) + '</td><td><button type="button" data-restore="' + esc(x.id) + '">' + esc(t('restore')) + '</button> ' + (X.isManager ? '<button type="button" class="adm-dng" data-purge="' + esc(x.id) + '">' + esc(t('purge')) + '</button>' : '') + '</td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="adm-muted">' + esc(t('trashEmpty')) + '</p>') + '</div>';
            T0.msg = T0.err = '';
        }).catch(function () { host.innerHTML = '<div class="adm-card adm-err">' + esc(t('loadFail')) + '</div>'; });
    }
    var T0 = { msg: '', err: '' };
    function purge(id) {
        if (!X.isManager) return; var w = window.prompt(t('confirmPurge')); if (w !== 'DELETE') return; var c = X.client;
        /* children first, item last; any failure stops and is reported (nothing else is touched) */
        c.from('content_blocks').delete().eq('content_item_id', id).then(function (a) {
            if (a.error) throw 0; return c.from('series_items').delete().eq('content_item_id', id);
        }).then(function (b) { if (b.error) throw 0; return c.from('content_items').delete().eq('id', id).eq('status', 'archived').select('id'); })
            .then(function (d) { if (d.error || !(d.data && d.data.length)) throw 0; T0.msg = t('purged'); trash(); }, function () { T0.err = t('purgeFail'); trash(); }).catch(function () { T0.err = t('purgeFail'); trash(); });
    }
    function restore(id) {
        X.client.from('content_items').update({ status: 'draft', updated_at: new Date().toISOString() }).eq('id', id).eq('status', 'archived').select('id').then(function (r) {
            if (r.error || !(r.data && r.data.length)) T0.err = t('noPerm'); else T0.msg = t('restored'); trash();
        });
    }

    /* ================= events ================= */
    function onInput(ev) {
        var el = ev.target; if (!el.hasAttribute('data-s') || !S) return;
        var k = el.getAttribute('data-s'); S[k] = el.value; S.dirty = true; if (k === 'title' && S.auto) { S.slug = slugify(el.value); var sl = document.getElementById('s-s'); if (sl) sl.value = S.slug; } if (k === 'slug') S.auto = false;
    }
    function onClick(ev) {
        var el = ev.target.closest('button'); if (!el) return;
        var g = function (a) { return el.getAttribute(a); };
        if (el.hasAttribute('data-snew')) return openSeries(null);
        if (el.hasAttribute('data-sopen')) return openSeries(g('data-sopen'));
        if (el.hasAttribute('data-sback')) { if (S && S.dirty && !window.confirm(t('confirmLeave'))) return; return listSeries(); }
        if (el.hasAttribute('data-ssave')) return saveSeries();
        if (el.hasAttribute('data-sadd')) { var v = document.getElementById('s-add').value; if (v && S.all[v]) { S.rows.push({ rid: null, cid: v }); S.dirty = true; drawSeries(); } return; }
        if (el.hasAttribute('data-srm')) { S.rows.splice(Number(g('data-srm')), 1); S.dirty = true; return drawSeries(); }
        if (el.hasAttribute('data-smv')) { var i = Number(g('data-i')), j = i + Number(g('data-smv')); if (j < 0 || j >= S.rows.length) return; var tmp = S.rows[i]; S.rows[i] = S.rows[j]; S.rows[j] = tmp; S.dirty = true; return drawSeries(); }
        if (el.hasAttribute('data-sdel')) {
            if (!X.isManager || !window.confirm(t('confirmDelS'))) return; var c = X.client, id = S.id;
            return c.from('series_items').delete().eq('series_id', id).then(function (a) { if (a.error) throw 0; return c.from('series').delete().eq('id', id).select('id'); }).then(function (b) { if (b.error || !(b.data && b.data.length)) throw 0; S0.msg = t('deleted'); listSeries(); }).catch(function () { say(t('fail')); });
        }
        if (el.hasAttribute('data-restore')) return restore(g('data-restore'));
        if (el.hasAttribute('data-purge')) return purge(g('data-purge'));
    }
    window.addEventListener('beforeunload', function (e) { if (S && S.dirty) { e.preventDefault(); e.returnValue = ''; } });
    function mount(el, ctx, which) {
        X = ctx; host = el; el.addEventListener('input', onInput); el.addEventListener('change', onInput); el.addEventListener('click', onClick);
        if (which === 'trash') trash(); else listSeries();
    }
    window.AdminManage = { mountSeries: function (el, ctx) { mount(el, ctx, 'series'); }, mountTrash: function (el, ctx) { mount(el, ctx, 'trash'); } };
})();
