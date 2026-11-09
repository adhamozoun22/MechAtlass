/* MechAtlas Academy — admin panel (Group B: login, roles, team + invitations). No secrets here: only the public key. */
(function () {
    'use strict';
    var C = window.ACADEMY_CONFIG, root = document.getElementById('adm-root');
    var TX = {
        ar: { title: 'لوحة إدارة أكاديمية MechAtlas', login: 'تسجيل الدخول', email: 'البريد الإلكتروني', pass: 'كلمة المرور', go: 'دخول', forgot: 'نسيت كلمة المرور؟',
            badLogin: 'البريد أو كلمة المرور غير صحيحة.', wait: 'محاولات كثيرة. انتظر نصف دقيقة ثم أعد المحاولة.', resetSent: 'إن كان البريد مسجلاً سيصلك رابط إعادة التعيين.', needEmail: 'اكتب بريدك أولاً.',
            libErr: 'تعذر تحميل مكتبة الاتصال. تحقق من الإنترنت وأعد المحاولة.', setPw: 'تعيين كلمة المرور', newPw: 'كلمة مرور جديدة (8 أحرف على الأقل)', newPw2: 'أعد كتابتها', pwShort: 'كلمة المرور أقصر من 8 أحرف.', pwDiff: 'كلمتا المرور غير متطابقتين.', pwDone: 'تم حفظ كلمة المرور.', save: 'حفظ',
            noAccess: 'هذا الحساب لا يملك صلاحية الدخول إلى لوحة الإدارة.', out: 'تسجيل الخروج', dash: 'الرئيسية', team: 'الفريق', manager: 'مدير', editor: 'محرر', published: 'منشور', draft: 'مسودة', archived: 'مؤرشف',
            latest: 'آخر التعديلات', none: 'لا توجد مواد بعد.', invite: 'دعوة محرر', send: 'إرسال الدعوة', sending: 'جارٍ الإرسال…', badEmail: 'البريد غير صالح.', invited: 'أُرسلت الدعوة إلى', invFail: 'تعذر إرسال الدعوة', invPartial: 'قد تكون الدعوة نُفّذت جزئياً؛ تحقق من القائمة قبل إعادة الإرسال.',
            members: 'أعضاء الفريق', name: 'الاسم', role: 'الدور', since: 'منذ', remove: 'إزالة', you: '(أنت)', confirmRm: 'إزالة صلاحية هذا العضو؟ (لا يُحذف حسابه)', rmDone: 'أُزيلت الصلاحية.', rmFail: 'تعذرت الإزالة', loadFail: 'تعذر تحميل البيانات.', noName: 'بدون اسم', soon: 'محرر المحتوى يأتي في المجموعة التالية.', lang: 'English', managerOnly: 'للمدير فقط.', dname: 'الاسم المعروض', content: 'المحتوى', series: 'السلاسل', trashT: 'المحذوفات', needName: 'اكتب الاسم المعروض.', srvErr: 'ردّ الخادم' },
        en: { title: 'MechAtlas Academy — Admin', login: 'Sign in', email: 'Email', pass: 'Password', go: 'Sign in', forgot: 'Forgot password?',
            badLogin: 'Wrong email or password.', wait: 'Too many attempts. Wait 30 seconds.', resetSent: 'If the email is registered, a reset link is on its way.', needEmail: 'Enter your email first.',
            libErr: 'The connection library could not be loaded. Check your internet and retry.', setPw: 'Set your password', newPw: 'New password (min 8 characters)', newPw2: 'Repeat it', pwShort: 'Password is shorter than 8 characters.', pwDiff: 'Passwords do not match.', pwDone: 'Password saved.', save: 'Save',
            noAccess: 'This account has no access to the admin panel.', out: 'Sign out', dash: 'Overview', team: 'Team', manager: 'Manager', editor: 'Editor', published: 'Published', draft: 'Draft', archived: 'Archived',
            latest: 'Recently changed', none: 'No items yet.', invite: 'Invite an editor', send: 'Send invitation', sending: 'Sending…', badEmail: 'Invalid email.', invited: 'Invitation sent to', invFail: 'Could not send the invitation', invPartial: 'The invitation may have partly gone through; check the list before resending.',
            members: 'Team members', name: 'Name', role: 'Role', since: 'Since', remove: 'Remove', you: '(you)', confirmRm: 'Remove this member\'s role? (their account is not deleted)', rmDone: 'Role removed.', rmFail: 'Could not remove', loadFail: 'Could not load data.', noName: 'No name', soon: 'The content editor arrives in the next group.', lang: 'العربية', managerOnly: 'Managers only.', dname: 'Display name', content: 'Content', series: 'Series', trashT: 'Trash', needName: 'Enter the display name.', srvErr: 'Server said' }
    };
    var lang = 'ar'; try { lang = localStorage.getItem('adm-lang') === 'en' ? 'en' : 'ar'; } catch (e) {}
    var S = { sb: null, user: null, isManager: false, isEditor: false, name: '', tab: 'content', msg: '', mt: '', fails: 0, lockUntil: 0, setpw: /[#&?]type=(invite|recovery)\b/.test(location.hash), busy: false };
    var t = function (k) { return TX[lang][k] || k; };
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var msg = function () { return S.msg ? '<div class="' + (S.mt === 'ok' ? 'adm-ok' : 'adm-err') + '" role="status">' + esc(S.msg) + '</div>' : ''; };
    function setMsg(m, type) { S.msg = m || ''; S.mt = type || 'err'; }
    function applyLang() { document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.title = t('title'); }

    function loadLib() {
        return new Promise(function (res, rej) {
            if (window.supabase && window.supabase.createClient) return res();
            var s = document.createElement('script'); s.src = C.libs.supabase; s.onload = function () { window.supabase && window.supabase.createClient ? res() : rej(); }; s.onerror = rej; document.head.appendChild(s);
        });
    }
    function client() {
        if (!S.sb) S.sb = window.supabase.createClient(C.supabaseUrl, C.publishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'academy-admin-auth' } });
        return S.sb;
    }

    /* ---------- views ---------- */
    function langBtn() { return '<button type="button" data-act="lang">' + esc(t('lang')) + '</button>'; }
    function vLogin() {
        return '<div class="adm-wrap adm-login"><div class="adm-card"><h1>' + esc(t('login')) + '</h1><form data-form="login" novalidate>' +
            '<label for="e">' + esc(t('email')) + '</label><input id="e" name="email" type="email" autocomplete="username" required dir="ltr">' +
            '<label for="p">' + esc(t('pass')) + '</label><input id="p" name="password" type="password" autocomplete="current-password" required dir="ltr">' +
            '<button class="adm-pri adm-full" type="submit"' + (S.busy ? ' disabled' : '') + '>' + esc(t('go')) + '</button></form>' + msg() +
            '<p><button type="button" data-act="forgot">' + esc(t('forgot')) + '</button> ' + langBtn() + '</p></div></div>';
    }
    function vSetPw() {
        return '<div class="adm-wrap adm-login"><div class="adm-card"><h1>' + esc(t('setPw')) + '</h1><form data-form="setpw" novalidate>' +
            '<label for="n1">' + esc(t('newPw')) + '</label><input id="n1" name="p1" type="password" autocomplete="new-password" dir="ltr">' +
            '<label for="n2">' + esc(t('newPw2')) + '</label><input id="n2" name="p2" type="password" autocomplete="new-password" dir="ltr">' +
            '<button class="adm-pri adm-full" type="submit">' + esc(t('save')) + '</button></form>' + msg() + '</div></div>';
    }
    function vNoAccess() { return '<div class="adm-wrap adm-login"><div class="adm-card"><h1>' + esc(t('title')) + '</h1><p>' + esc(t('noAccess')) + '</p><button type="button" data-act="out" class="adm-pri">' + esc(t('out')) + '</button></div></div>'; }
    function vShell(inner) {
        var tabs = '<button type="button" data-tab="content"' + (S.tab === 'content' ? ' aria-current="true"' : '') + '>' + esc(t('content')) + '</button><button type="button" data-tab="series"' + (S.tab === 'series' ? ' aria-current="true"' : '') + '>' + esc(t('series')) + '</button><button type="button" data-tab="trash"' + (S.tab === 'trash' ? ' aria-current="true"' : '') + '>' + esc(t('trashT')) + '</button><button type="button" data-tab="dash"' + (S.tab === 'dash' ? ' aria-current="true"' : '') + '>' + esc(t('dash')) + '</button>' +
            (S.isManager ? '<button type="button" data-tab="team"' + (S.tab === 'team' ? ' aria-current="true"' : '') + '>' + esc(t('team')) + '</button>' : '');
        return '<div class="adm-wrap"><div class="adm-top"><div><h1>' + esc(t('title')) + '</h1><span class="adm-muted">' + esc(S.name || S.user.email || '') + ' · <span class="adm-badge">' + esc(S.isManager ? t('manager') : t('editor')) + '</span></span></div>' +
            '<div class="adm-tabs">' + tabs + langBtn() + '<button type="button" data-act="out">' + esc(t('out')) + '</button></div></div>' + inner + '</div>';
    }
    var STAT = { published: 'published', draft: 'draft', archived: 'archived' };
    function dash(el) {
        var sb = client(), q = function (st) { return sb.from('content_items').select('id', { count: 'exact', head: true }).eq('status', st); };
        Promise.all([q('published'), q('draft'), q('archived'), sb.from('content_items').select('id,title,status,updated_at').order('updated_at', { ascending: false }).limit(5)]).then(function (r) {
            if (r.some(function (x) { return x.error; })) throw 0;
            var h = '<div class="adm-grid">' + ['published', 'draft', 'archived'].map(function (k, i) { return '<div class="adm-card adm-stat"><b>' + (r[i].count || 0) + '</b>' + esc(t(k)) + '</div>'; }).join('') + '</div>';
            var rows = r[3].data || [];
            h += '<div class="adm-card"><h2>' + esc(t('latest')) + '</h2>' + (rows.length ? '<div class="adm-tblw"><table class="adm-tbl"><tbody>' + rows.map(function (x) { return '<tr><td dir="auto">' + esc(x.title) + '</td><td><span class="adm-badge">' + esc(t(STAT[x.status] || 'draft')) + '</span></td><td class="adm-muted">' + esc((x.updated_at || '').slice(0, 10)) + '</td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="adm-muted">' + esc(t('none')) + '</p>') + '</div>';
            el.innerHTML = h;
        }).catch(function () { el.innerHTML = '<div class="adm-card adm-err">' + esc(t('loadFail')) + '</div>'; });
    }
    /* profiles column is full_name in the schema you described, but invite-editor writes display_name: try both, never fail */
    function profNames(ids) {
        var sb = client(), nm = {};
        if (!ids.length) return Promise.resolve(nm);
        var tryCol = function (col) { return sb.from('profiles').select('id,' + col).in('id', ids).then(function (p) { if (p.error) return false; (p.data || []).forEach(function (x) { if (x[col]) nm[x.id] = x[col]; }); return true; }); };
        return tryCol('full_name').then(function () { return tryCol('display_name'); }).then(function () { return nm; }, function () { return nm; });
    }
    function team(el) {
        if (!S.isManager) { el.innerHTML = '<div class="adm-card">' + esc(t('managerOnly')) + '</div>'; return; }
        var sb = client();
        sb.from('user_roles').select('id,user_id,role,created_at').order('created_at', { ascending: true }).then(function (r) {
            if (r.error) throw 0;
            var rows = r.data || [], ids = rows.map(function (x) { return x.user_id; });
            return profNames(ids).then(function (nm) {
                el.innerHTML = '<div class="adm-card"><h2>' + esc(t('invite')) + '</h2><form data-form="invite" novalidate><div class="adm-row"><div><label for="in">' + esc(t('dname')) + '</label><input id="in" name="display_name" maxlength="80" autocomplete="off"></div><div><label for="ie">' + esc(t('email')) + '</label><input id="ie" name="email" type="email" dir="ltr" autocomplete="off"></div>' +
                    '<button class="adm-pri" type="submit">' + esc(t('send')) + '</button></div></form><div id="adm-invmsg">' + msg() + '</div></div>' +
                    '<div class="adm-card"><h2>' + esc(t('members')) + '</h2><div class="adm-tblw"><table class="adm-tbl"><thead><tr><th>' + esc(t('name')) + '</th><th>' + esc(t('role')) + '</th><th>' + esc(t('since')) + '</th><th></th></tr></thead><tbody>' +
                    rows.map(function (x) {
                        var me = x.user_id === S.user.id, canRm = !me && x.role === 'editor';
                        return '<tr><td dir="auto">' + esc(nm[x.user_id] || t('noName')) + (me ? ' ' + esc(t('you')) : '') + '</td><td><span class="adm-badge">' + esc(t(x.role === 'manager' ? 'manager' : 'editor')) + '</span></td><td class="adm-muted">' + esc((x.created_at || '').slice(0, 10)) + '</td><td>' +
                            (canRm ? '<button type="button" class="adm-dng" data-rm="' + esc(x.id) + '">' + esc(t('remove')) + '</button>' : '') + '</td></tr>';
                    }).join('') + '</tbody></table></div></div>';
            });
        }).catch(function () { el.innerHTML = '<div class="adm-card adm-err">' + esc(t('loadFail')) + '</div>'; });
    }
    function ctx() { return { client: client(), user: S.user, isManager: S.isManager, lang: function () { return lang; }, esc: esc, cfg: C }; }
    function paint() {
        applyLang();
        if (!S.sb || !S.user) { root.innerHTML = vLogin(); return; }
        if (S.setpw) { root.innerHTML = vSetPw(); return; }
        if (!S.isManager && !S.isEditor) { root.innerHTML = vNoAccess(); return; }
        root.innerHTML = vShell('<div id="adm-view"><p class="adm-muted adm-c">…</p></div>');
        var el = document.getElementById('adm-view');
        if (S.tab === 'content' && window.AdminEditor) window.AdminEditor.mount(el, ctx()); else if (S.tab === 'series' && window.AdminManage) window.AdminManage.mountSeries(el, ctx()); else if (S.tab === 'trash' && window.AdminManage) window.AdminManage.mountTrash(el, ctx()); else (S.tab === 'team' ? team : dash)(el);
    }

    /* ---------- auth / roles ---------- */
    function flag(name) { return client().rpc(name).then(function (r) { if (r.error) throw r.error; return r.data === true; }); }
    function resolve(session) {
        S.user = session && session.user ? session.user : null; S.isManager = S.isEditor = false; S.name = '';
        if (!S.user) return Promise.resolve();
        return Promise.all([flag('is_academy_manager'), flag('is_academy_editor')]).then(function (f) { S.isManager = f[0]; S.isEditor = f[1] || f[0]; }).catch(function () { S.isManager = S.isEditor = false; /* fail closed */ })
            .then(function () { if (!S.isEditor) return; return client().from('profiles').select('full_name').eq('id', S.user.id).maybeSingle().then(function (r) { S.name = (r && r.data && r.data.full_name) || ''; }, function () {}); });
    }
    function signOut() { return client().auth.signOut({ scope: 'local' }).catch(function () {}).then(function () { S.user = null; S.isManager = S.isEditor = false; S.setpw = false; S.tab = 'content'; setMsg(''); paint(); }); }

    var VALID = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
    root.addEventListener('submit', function (ev) {
        var f = ev.target.closest('form'); if (!f) return; ev.preventDefault();
        var kind = f.getAttribute('data-form'), d = new FormData(f);
        if (kind === 'login') {
            var em = String(d.get('email') || '').trim(), pw = String(d.get('password') || '');
            if (Date.now() < S.lockUntil) { setMsg(t('wait')); paint(); return; }
            if (!VALID.test(em) || !pw) { setMsg(t('badLogin')); paint(); return; }
            S.busy = true; setMsg(''); paint();
            client().auth.signInWithPassword({ email: em, password: pw }).then(function (r) {
                if (r.error || !r.data || !r.data.session) { if (++S.fails >= 5) { S.lockUntil = Date.now() + 30000; S.fails = 0; setMsg(t('wait')); } else setMsg(t('badLogin')); S.busy = false; paint(); return; }
                S.fails = 0; return resolve(r.data.session).then(function () { S.busy = false; setMsg(''); paint(); });
            }).catch(function () { S.busy = false; setMsg(t('badLogin')); paint(); });
        } else if (kind === 'setpw') {
            var a = String(d.get('p1') || ''), b = String(d.get('p2') || '');
            if (a.length < 8) { setMsg(t('pwShort')); paint(); return; } if (a !== b) { setMsg(t('pwDiff')); paint(); return; }
            client().auth.updateUser({ password: a }).then(function (r) {
                if (r.error) { setMsg(r.error.message || t('loadFail')); paint(); return; }
                S.setpw = false; try { history.replaceState(null, '', location.pathname); } catch (e) {} setMsg(''); paint();
            });
        } else if (kind === 'invite') {
            var mail = String(d.get('email') || '').trim().toLowerCase(), dn = String(d.get('display_name') || '').trim().slice(0, 80), box = document.getElementById('adm-invmsg'), btn = f.querySelector('button[type=submit]');
            if (!VALID.test(mail)) { setMsg(t('badEmail')); box.innerHTML = msg(); return; }
            if (!dn) { setMsg(t('needName')); box.innerHTML = msg(); return; }
            btn.disabled = true; setMsg(t('sending'), 'ok'); box.innerHTML = msg();
            /* Contract of invite-editor (reviewed): POST {email, display_name, redirectTo}; manager check is done by the function. */
            client().functions.invoke('invite-editor', { body: { email: mail, display_name: dn, redirectTo: location.origin + location.pathname } }).then(function (r) {
                var done = function (extra) {
                    if (r.error) setMsg(t('invFail') + (extra ? ' (' + t('srvErr') + ': ' + extra + ')' : '') + ' — ' + t('invPartial')); else setMsg(t('invited') + ' ' + mail, 'ok');
                    box.innerHTML = msg(); btn.disabled = false; if (!r.error) f.reset();
                if (S.tab === 'team') team(document.getElementById('adm-view'));
                };
                if (r.error && r.error.context && typeof r.error.context.json === 'function') r.error.context.json().then(function (j) { done(String((j && (j.error + (j.details ? ': ' + j.details : ''))) || '').slice(0, 200)); }, function () { done(''); }); else done('');
            }).catch(function () { setMsg(t('invFail') + ' — ' + t('invPartial')); box.innerHTML = msg(); btn.disabled = false; });
        }
    });
    root.addEventListener('click', function (ev) {
        var el = ev.target.closest('[data-act],[data-tab],[data-rm]'); if (!el) return;
        if (el.hasAttribute('data-tab')) { S.tab = el.getAttribute('data-tab'); setMsg(''); paint(); return; }
        if (el.hasAttribute('data-rm')) {
            if (!window.confirm(t('confirmRm'))) return;
            client().from('user_roles').delete().eq('id', el.getAttribute('data-rm')).eq('role', 'editor').then(function (r) { setMsg(r.error ? t('rmFail') : t('rmDone'), r.error ? 'err' : 'ok'); paint(); });
            return;
        }
        var a = el.getAttribute('data-act');
        if (a === 'out') signOut();
        else if (a === 'lang') { lang = lang === 'ar' ? 'en' : 'ar'; try { localStorage.setItem('adm-lang', lang); } catch (e) {} paint(); }
        else if (a === 'forgot') {
            var em2 = (document.getElementById('e') || {}).value || ''; em2 = em2.trim();
            if (!VALID.test(em2)) { setMsg(t('needEmail')); paint(); return; }
            client().auth.resetPasswordForEmail(em2, { redirectTo: location.origin + location.pathname }).then(function () { setMsg(t('resetSent'), 'ok'); paint(); }, function () { setMsg(t('resetSent'), 'ok'); paint(); });
        }
    });

    applyLang(); root.innerHTML = '<p class="adm-muted adm-c">…</p>';
    loadLib().then(function () {
        var sb = client();
        sb.auth.onAuthStateChange(function (ev) { if (ev === 'PASSWORD_RECOVERY') { S.setpw = true; } if (ev === 'SIGNED_OUT') { S.user = null; paint(); } });
        return sb.auth.getSession();
    }).then(function (r) { return resolve(r && r.data && r.data.session); }).then(paint).catch(function () { root.innerHTML = '<div class="adm-wrap adm-login"><div class="adm-card adm-err">' + esc(t('libErr')) + '</div></div>'; });
})();
