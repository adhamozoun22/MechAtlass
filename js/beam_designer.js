/* Beam Designer — draw a simple statically determinate beam, add supports + loads, get reactions, SFD, BMD, deflection.
 * Scope: pin + roller anywhere on the beam (overhangs allowed) OR a cantilever (fixed at left/right end).
 * Euler–Bernoulli theory (bending only). Units: m, kN, kN·m, section in mm. */
(function () {
    'use strict';
    const lang = () => (window.getLang ? window.getLang() : 'en');
    const T = (en, ar) => (lang() === 'ar' ? ar : en);
    const $ = (id) => document.getElementById(id);
    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const f = (v, d) => { if (!isFinite(v)) return '—'; d = d == null ? 2 : d; let s = parseFloat(v.toFixed(d)).toString(); if (s === '-0') s = '0'; return s; };
    const ALPHA = { s235: 12e-6, s355: 12e-6, al: 23.6e-6, ti: 8.6e-6, oak: 5e-6, ci: 10.5e-6 };
    const EPS = 1e-7, W = 1000, X0 = 90, X1 = 910;
    let S = null, R = null, uid = 1, root = null, cursorX = null;

    const defaults = () => ({
        L: 6, sup: { type: 'ss', a: 0, b: 6, ta: 'pin', tb: 'roller' },
        loads: [{ id: uid++, t: 'point', x: 3, x2: 3, v: 10, v2: 10, dir: 'down' }],
        sec: { sec: 'ipe', b: 100, h: 200, d: 100, D: 100, t: 5, ipe: 200 }, mat: 's235', sw: false, tens: true
    });
    const PRESETS = {
        center: () => ({ L: 6, sup: { type: 'ss', a: 0, b: 6 }, loads: [{ t: 'point', x: 3, v: 10, dir: 'down' }] }),
        udl: () => ({ L: 6, sup: { type: 'ss', a: 0, b: 6 }, loads: [{ t: 'udl', x: 0, x2: 6, v: 5, dir: 'down' }] }),
        tri: () => ({ L: 6, sup: { type: 'ss', a: 0, b: 6 }, loads: [{ t: 'trap', x: 0, x2: 6, v: 0, v2: 8, dir: 'down' }] }),
        over: () => ({ L: 7, sup: { type: 'ss', a: 1, b: 5 }, loads: [{ t: 'udl', x: 0, x2: 7, v: 4, dir: 'down' }, { t: 'point', x: 7, v: 8, dir: 'down' }] }),
        cant: () => ({ L: 3, sup: { type: 'cantL', a: 0, b: 3 }, loads: [{ t: 'point', x: 3, v: 10, dir: 'down' }, { t: 'udl', x: 0, x2: 3, v: 2, dir: 'down' }] }),
        mom: () => ({ L: 6, sup: { type: 'ss', a: 0, b: 6 }, loads: [{ t: 'moment', x: 2, v: 12, dir: 'cw' }, { t: 'point', x: 4.5, v: 6, dir: 'down' }] })
    };
    function loadPreset(k) {
        const p = PRESETS[k](); S = defaults(); S.L = p.L; S.sup = Object.assign({ ta: 'pin', tb: 'roller' }, p.sup);
        S.loads = p.loads.map((l) => Object.assign({ id: uid++, x2: l.x, v2: l.v }, l));
        full();
    }

    function save() { try { localStorage.setItem('beamDesigner', JSON.stringify(S)); } catch (e) {} }
    function restore() {
        try { const j = JSON.parse(localStorage.getItem('beamDesigner') || 'null'); if (j && j.L && j.sup && Array.isArray(j.loads)) { S = Object.assign(defaults(), j); S.loads.forEach((l) => { l.id = uid++; }); return; } } catch (e) {}
        S = defaults();
    }

    /* ============================ solver ============================ */
    function segInt(it, c) {
        c = Math.min(c, it.b); if (c <= it.a) return { R: 0, I: 0 };
        const s = c - it.a, l = it.b - it.a, k = (it.w2 - it.w1) / l, Rr = it.w1 * s + (k * s * s) / 2;
        return { R: Rr, I: it.a * Rr + (it.w1 * s * s) / 2 + (k * s * s * s) / 3 };
    }
    /* second moment about the WEAK axis (m^4): used for the thermal-buckling warning */
    function weakI(p, sec) {
        if (p.sec === 'rect') return Math.min(p.b * Math.pow(p.h, 3), p.h * Math.pow(p.b, 3)) / 12 / 1e12;
        if (p.sec === 'ipe') { const e = SM.IPE[p.ipe] || SM.IPE[200]; return ((2 * e.tf * Math.pow(e.b, 3)) / 12 + ((e.h - 2 * e.tf) * Math.pow(e.tw, 3)) / 12) / 1e12; }
        return sec.I;
    }
    function solve(S) {
        const L = S.L, sup = S.sup, sec = window.SM ? SM.section(S.sec) : null, mat = window.SM ? SM.MATS[S.mat] : null;
        const items = []; let thDT = 0, thDG = 0, hasTh = false;
        S.loads.forEach((l) => {
            if (l.t === 'thermal') { thDT += l.v; thDG += l.v2; hasTh = true; return; }
            if (l.t === 'point') items.push({ k: 'F', x: l.x, F: (l.dir === 'down' ? -1 : 1) * l.v });
            else if (l.t === 'moment') items.push({ k: 'M', x: l.x, M: (l.dir === 'cw' ? 1 : -1) * l.v });
            else { const a = l.x, b = l.x2; if (b - a < 1e-6) return; items.push({ k: 'D', a, b, w1: l.v, w2: l.t === 'udl' ? l.v : l.v2, s: l.dir === 'down' ? -1 : 1 }); }
        });
        if (S.sw && sec && mat) { const w = (mat.rho * 9.81 * sec.A) / 1000; items.push({ k: 'D', a: 0, b: L, w1: w, w2: w, s: -1, sw: true }); }
        let sumF = 0, sumFx = 0, sumM = 0;
        items.forEach((it) => {
            if (it.k === 'F') { sumF += it.F; sumFx += it.F * it.x; } else if (it.k === 'M') sumM += it.M;
            else { const q = segInt(it, it.b); sumF += it.s * q.R; sumFx += it.s * q.I; }
        });
        const out = { ok: true, items, sumF, sumFx, sumM, reac: [], steps: [], L };
        const all = items.slice();
        if (sup.type === 'ss') {
            const xa = sup.a, xb = sup.b;
            if (Math.abs(xb - xa) < 0.05) return { ok: false, msg: T('Put the two supports at different places.', 'ضع المسندين في مكانين مختلفين.') };
            const By = (-(sumFx - xa * sumF) + sumM) / (xb - xa), Ay = -sumF - By;
            out.reac = [{ n: 'A', x: xa, Fy: Ay, kind: sup.ta || 'pin' }, { n: 'B', x: xb, Fy: By, kind: sup.tb || 'roller' }];
            all.push({ k: 'F', x: xa, F: Ay }, { k: 'F', x: xb, F: By });
            out.steps = [
                T('ΣFy = 0:  Ay + By = ', 'ΣFy = 0:  Ay + By = ') + f(-sumF) + ' kN',
                T('ΣM about A = 0:  By × ', 'ΣM حول A = 0:  By × ') + f(xb - xa) + ' = ' + f(-(sumFx - xa * sumF) + sumM) + ' kN·m',
                'By = ' + f(By) + ' kN   →   Ay = ' + f(-sumF) + ' − (' + f(By) + ') = ' + f(Ay) + ' kN'
            ];
        } else {
            const xf = sup.type === 'cantL' ? 0 : L, Ry = -sumF, Mr = -(sumFx - xf * sumF) + sumM;
            out.reac = [{ n: 'A', x: xf, Fy: Ry, Mr, kind: 'fixed' }];
            all.push({ k: 'F', x: xf, F: Ry }, { k: 'M', x: xf, M: -Mr });
            out.steps = [
                'ΣFy = 0:  Ry = ' + f(-sumF) + ' kN',
                T('ΣM about the wall = 0:  M_wall = ', 'ΣM حول الحائط = 0:  M_wall = ') + f(Mr) + ' kN·m ' + (Mr >= 0 ? T('(counter-clockwise)', '(عكس عقارب الساعة)') : T('(clockwise)', '(مع عقارب الساعة)'))
            ];
        }
        if (hasTh) {
            const al = (window.SM && SM.MATS[S.mat] ? (ALPHA[S.mat] || 12e-6) : 12e-6);
            out.steps.push(T('Thermal: ΔT = ', 'الحرارة: ΔT = ') + f(thDT) + ' °C,  ' + T('gradient (top − bottom) = ', 'التدرج (أعلى − أسفل) = ') + f(thDG) + ' °C,  α = ' + f(al * 1e6, 1) + '×10⁻⁶ /°C');
            out.steps.push(T('Free expansion ΔL = α·ΔT·L = ', 'التمدد الحر ΔL = α·ΔT·L = ') + f(al * thDT * L * 1000, 3) + ' mm');
            out.steps.push(T('Thermal curvature κ = −α·ΔT_gradient / h  (adds to M/EI in the sag)', 'انحناء حراري κ = −α·ΔT_التدرج / h (يُضاف إلى M/EI في التدلي)'));
        }
        const evalAt = (x) => {
            let V = 0, M = 0;
            for (let i = 0; i < all.length; i++) {
                const it = all[i];
                if (it.k === 'F') { if (it.x <= x) { V += it.F; M += it.F * (x - it.x); } }
                else if (it.k === 'M') { if (it.x <= x) M += it.M; }
                else { const q = segInt(it, x); V += it.s * q.R; M += it.s * (x * q.R - q.I); }
            }
            return { V, M };
        };
        out.evalAt = evalAt;
        /* sample points: uniform grid + both sides of every critical x */
        const cps = [0, L]; all.forEach((it) => { if (it.k === 'D') cps.push(it.a, it.b); else cps.push(it.x); });
        const cp = Array.from(new Set(cps.map((c) => Math.min(L, Math.max(0, +c.toFixed(6)))))).sort((a, b) => a - b);
        const xs = []; const N = 600;
        for (let i = 0; i <= N; i++) xs.push((i * L) / N);
        cp.forEach((c) => { if (c <= 0) xs.push(0); else if (c >= L) xs.push(L - EPS * L, L); else { xs.push(c - EPS * L, c + EPS * L); } });
        xs.sort((a, b) => a - b);
        const V = [], M = [];
        xs.forEach((x) => { const e = evalAt(sup.type === 'cantR' && x >= L ? L - EPS * L : x); V.push(e.V); M.push(e.M); });
        out.cp = cp; out.xs = xs; out.V = V; out.M = M;
        /* deflection */
        if (sec && mat) {
            const EI = mat.E * sec.I, n = xs.length, th = [0], y = [0];
            const alpha = ALPHA[S.mat] || 12e-6, kappa = -alpha * thDG / (sec.h / 1000);
            out.therm = hasTh ? { dT: thDT, dg: thDG, alpha, kappa } : null;
            for (let i = 0; i < n - 1; i++) {
                const dx = xs[i + 1] - xs[i];
                th.push(th[i] + ((((M[i] + M[i + 1]) / 2) * 1e3 / EI) + kappa) * dx);
                y.push(y[i] + ((th[i] + th[i + 1]) / 2) * dx);
            }
            const near = (x) => { let b = 0, bd = 1e9; for (let i = 0; i < n; i++) { const d = Math.abs(xs[i] - x); if (d < bd) { bd = d; b = i; } } return b; };
            let th0, y0;
            if (sup.type === 'ss') {
                const ia = near(sup.a), ib = near(sup.b);
                th0 = -(y[ib] - y[ia]) / (xs[ib] - xs[ia]); y0 = -y[ia] - th0 * xs[ia];
            } else { const i = near(sup.type === 'cantL' ? 0 : L); th0 = -th[i]; y0 = -y[i] - th0 * xs[i]; }
            out.defl = y.map((v, i) => v + th0 * xs[i] + y0);
        }
        const mx = (arr, sgn) => { let b = 0; for (let i = 0; i < arr.length; i++) if (sgn * arr[i] > sgn * arr[b]) b = i; return b; };
        out.iVmax = (() => { let b = 0; for (let i = 0; i < V.length; i++) if (Math.abs(V[i]) > Math.abs(V[b])) b = i; return b; })();
        out.iMpos = mx(M, 1); out.iMneg = mx(M, -1);
        out.Mmax = Math.max(Math.abs(M[out.iMpos]), Math.abs(M[out.iMneg]));
        out.iM = Math.abs(M[out.iMpos]) >= Math.abs(M[out.iMneg]) ? out.iMpos : out.iMneg;
        out.Vmax = Math.abs(V[out.iVmax]);
        if (out.defl) { let b = 0; for (let i = 0; i < out.defl.length; i++) if (Math.abs(out.defl[i]) > Math.abs(out.defl[b])) b = i; out.iD = b; out.dmax = Math.abs(out.defl[b]) * 1000; }
        if (sec && mat) {
            out.sec = sec; out.mat = mat;
            out.sigmaB = (out.Mmax * 1e3) / sec.W / 1e6; out.sigma = out.sigmaB;
            if (out.therm) {
                const th = out.therm, bothPins = sup.type === 'ss' && (sup.ta || 'pin') === 'pin' && (sup.tb || 'roller') === 'pin';
                th.dL = th.alpha * th.dT * L * 1000;
                th.restrained = bothPins && Math.abs(th.dT) > 1e-9;
                th.sigN = th.restrained ? mat.E * th.alpha * th.dT / 1e6 : 0;
                th.N = th.restrained ? -(mat.E * sec.A * th.alpha * th.dT) / 1e3 : 0;
                /* restrained heating = axial compression: compare with the Euler load of the weak axis (pinned-pinned, no lateral bracing assumed) */
                th.Pe = (Math.PI * Math.PI * mat.E * weakI(S.sec, sec)) / (L * L) / 1e3;
                th.buckle = th.restrained && th.N < 0 && -th.N > th.Pe;
                out.sigma = out.sigmaB + Math.abs(th.sigN);
            }
            const Vn = out.Vmax * 1e3;
            out.tau = sec.tauK * Vn / sec.A / 1e6;
            out.sf = out.sigma > 1e-9 ? (mat.sy / 1e6) / out.sigma : Infinity;
            out.sfT = out.tau > 1e-9 ? (0.577 * mat.sy / 1e6) / out.tau : Infinity;
            out.dlim = (L * 1000) / 250;
        }
        /* key-point table */
        out.table = cp.map((c) => {
            const a = evalAt(Math.max(0, c - EPS * L)), b = evalAt(Math.min(L, c + EPS * L));
            return { x: c, V1: c <= 0 ? null : a.V, V2: c >= L ? null : b.V, M1: c <= 0 ? null : a.M, M2: c >= L ? null : b.M };
        });
        return out;
    }

    /* ============================ drawing ============================ */
    const sx = (x) => X0 + (x / S.L) * (X1 - X0);
    const arrow = (x, y1, y2, c, wd) => {
        const d = y2 > y1 ? 1 : -1;
        return `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2 - d * 8}" stroke="${c}" stroke-width="${wd || 2.5}"/><polygon points="${x},${y2} ${x - 5},${y2 - d * 10} ${x + 5},${y2 - d * 10}" fill="${c}"/>`;
    };
    function momentArc(x, y, cw, c) {
        const r = 26, a0 = cw ? -150 : -30, a1 = cw ? 60 : 240;
        const p = (a) => [x + r * Math.cos((a * Math.PI) / 180), y + r * Math.sin((a * Math.PI) / 180)];
        const s = p(cw ? -150 : -30), e = p(cw ? 60 : 210);
        const sweep = cw ? 1 : 0;
        const ang = ((cw ? 60 : 210) * Math.PI) / 180, tx = -Math.sin(ang) * (cw ? 1 : -1), ty = Math.cos(ang) * (cw ? 1 : -1);
        const nx = -ty, ny = tx;
        const hx = e[0], hy = e[1];
        return `<path d="M${s[0]},${s[1]} A${r},${r} 0 ${cw ? 1 : 1} ${sweep} ${e[0]},${e[1]}" fill="none" stroke="${c}" stroke-width="2.5"/><polygon points="${hx + tx * 9},${hy + ty * 9} ${hx + nx * 5},${hy + ny * 5} ${hx - nx * 5},${hy - ny * 5}" fill="${c}"/>`;
    }
    function drawBeam() {
        const L = S.L, yb = 135, th = 12, loads = S.loads, g = [];
        const wmax = Math.max(1e-9, ...loads.filter((l) => l.t === 'udl' || l.t === 'trap').map((l) => Math.max(l.v, l.t === 'udl' ? l.v : l.v2)));
        /* loads */
        loads.forEach((l) => {
            if (l.t === 'thermal') return;
            const col = '#dc2626', up = l.dir === 'up';
            if (l.t === 'point') {
                const x = sx(l.x);
                g.push(`<g>${up ? arrow(x, 215, yb + th + 2, col) : arrow(x, 40, yb - 2, col)}<text x="${x}" y="${up ? 232 : 30}" text-anchor="middle" font-size="26" fill="${col}" font-weight="700">${f(l.v)} kN</text><circle data-drag="ld:${l.id}" cx="${x}" cy="${up ? 180 : 80}" r="48" fill="transparent" style="touch-action:none;cursor:ew-resize"/></g>`);
            } else if (l.t === 'moment') {
                const x = sx(l.x);
                g.push(`<g>${momentArc(x, yb + th / 2, l.dir === 'cw', '#7c3aed')}<text x="${x}" y="${yb - 44}" text-anchor="middle" font-size="25" fill="#7c3aed" font-weight="700">${f(l.v)} kN·m</text><circle data-drag="ld:${l.id}" cx="${x}" cy="${yb + 6}" r="50" fill="transparent" style="touch-action:none;cursor:ew-resize"/></g>`);
            } else {
                const a = sx(l.x), b = sx(l.x2), w1 = l.v, w2 = l.t === 'udl' ? l.v : l.v2, H = 62, h1 = (w1 / wmax) * H, h2 = (w2 / wmax) * H;
                const yTop = up ? yb + th : yb, sgn = up ? 1 : -1;
                const pts = `${a},${yTop} ${b},${yTop} ${b},${yTop + sgn * h2} ${a},${yTop + sgn * h1}`;
                let ar = ''; const n = Math.max(2, Math.round((b - a) / 34));
                for (let i = 0; i <= n; i++) { const x = a + ((b - a) * i) / n, hh = h1 + ((h2 - h1) * i) / n; if (hh > 9) ar += arrow(x, yTop + sgn * hh, yTop + (up ? 2 : -2), col, 1.8); }
                const ty = up ? yTop + Math.max(h1, h2) + 22 : yTop - Math.max(h1, h2) - 8;
                const lab = l.t === 'udl' ? f(w1) + ' kN/m' : f(w1) + ' → ' + f(w2) + ' kN/m';
                g.push(`<g><polygon points="${pts}" fill="${col}" fill-opacity="0.12" stroke="${col}" stroke-width="1.5"/>${ar}<text x="${(a + b) / 2}" y="${ty}" text-anchor="middle" font-size="25" fill="${col}" font-weight="700">${lab}</text><rect data-drag="ld:${l.id}" x="${a}" y="${Math.min(yTop, yTop + sgn * Math.max(h1, h2))}" width="${Math.max(10, b - a)}" height="${Math.max(56, Math.max(h1, h2))}" fill="transparent" style="touch-action:none;cursor:ew-resize"/></g>`);
            }
        });
        /* beam */
        g.push(`<rect x="${X0}" y="${yb}" width="${X1 - X0}" height="${th}" fill="#94a3b8" stroke="#475569" stroke-width="1.5" rx="2"/>`);
        loads.forEach((l) => { if (l.t === 'thermal') g.push(`<text x="${X0}" y="26" font-size="25" font-weight="700" fill="#ea580c">ΔT = ${f(l.v)} °C  |  Δ(top−bottom) = ${f(l.v2)} °C</text><rect x="${X0}" y="${yb}" width="${X1 - X0}" height="4" fill="${l.v2 > 0 ? '#ef4444' : l.v2 < 0 ? '#3b82f6' : '#94a3b8'}"/><rect x="${X0}" y="${yb + th - 4}" width="${X1 - X0}" height="4" fill="${l.v2 > 0 ? '#3b82f6' : l.v2 < 0 ? '#ef4444' : '#94a3b8'}"/>`); });
        /* supports + reactions */
        if (R && R.ok) R.reac.forEach((r) => {
            const x = sx(r.x), y0 = yb + th, gc = '#16a34a';
            if (r.kind === 'pin') g.push(`<g><polygon points="${x},${y0} ${x - 20},${y0 + 32} ${x + 20},${y0 + 32}" fill="#e2e8f0" stroke="#334155" stroke-width="2"/><line x1="${x - 28}" y1="${y0 + 34}" x2="${x + 28}" y2="${y0 + 34}" stroke="#334155" stroke-width="3"/><circle data-drag="sup:${r.n.toLowerCase()}" cx="${x}" cy="${y0 + 20}" r="56" fill="transparent" style="touch-action:none;cursor:ew-resize"/></g>`);
            else if (r.kind === 'roller') g.push(`<g><polygon points="${x},${y0} ${x - 20},${y0 + 26} ${x + 20},${y0 + 26}" fill="#e2e8f0" stroke="#334155" stroke-width="2"/><circle cx="${x - 10}" cy="${y0 + 32}" r="6" fill="#e2e8f0" stroke="#334155" stroke-width="2"/><circle cx="${x + 10}" cy="${y0 + 32}" r="6" fill="#e2e8f0" stroke="#334155" stroke-width="2"/><line x1="${x - 28}" y1="${y0 + 39}" x2="${x + 28}" y2="${y0 + 39}" stroke="#334155" stroke-width="3"/><circle data-drag="sup:${r.n.toLowerCase()}" cx="${x}" cy="${y0 + 20}" r="56" fill="transparent" style="touch-action:none;cursor:ew-resize"/></g>`);
            else { const left = S.sup.type === 'cantL', xw = left ? x - 14 : x; let h = ''; for (let i = 0; i < 9; i++) { const yy = yb - 40 + i * 12; h += `<line x1="${left ? xw : xw + 14}" y1="${yy + 12}" x2="${left ? xw - 10 : xw + 24}" y2="${yy}" stroke="#334155" stroke-width="1.5"/>`; } g.push(`<g><rect x="${xw}" y="${yb - 40}" width="14" height="108" fill="#cbd5e1" stroke="#334155" stroke-width="2"/>${h}</g>`); }
            const up = r.Fy >= 0;
            g.push(`<g>${arrow(x + (r.kind === 'fixed' ? (S.sup.type === 'cantL' ? 34 : -34) : 0), up ? 232 : 182, up ? 182 : 232, gc, 3)}<text x="${x + (r.kind === 'fixed' ? (S.sup.type === 'cantL' ? 34 : -34) : 0)}" y="252" text-anchor="middle" font-size="25" fill="${gc}" font-weight="700">${r.kind === 'fixed' ? 'Ry' : 'R' + r.n}=${f(Math.abs(r.Fy))} kN</text></g>`);
            if (r.kind === 'fixed') { const mx = x + (S.sup.type === 'cantL' ? 18 : -18); g.push(`<text x="${mx}" y="${yb - 52}" text-anchor="middle" font-size="25" fill="${gc}" font-weight="700">M=${f(Math.abs(r.Mr))} kN·m ${r.Mr >= 0 ? '↺' : '↻'}</text>`); }
        });
        /* ruler */
        const ticks = [0, L]; R && R.ok && R.reac.forEach((r) => ticks.push(r.x));
        const tt = Array.from(new Set(ticks.map((v) => +v.toFixed(3)))).sort((a, b) => a - b);
        let rl = `<line x1="${X0}" y1="268" x2="${X1}" y2="268" stroke="#94a3b8" stroke-width="1"/>`;
        tt.forEach((v) => { rl += `<line x1="${sx(v)}" y1="262" x2="${sx(v)}" y2="274" stroke="#94a3b8" stroke-width="1.5"/><text x="${sx(v)}" y="288" text-anchor="middle" font-size="22" fill="currentColor" opacity=".7">${f(v)}${v === L ? ' m' : ''}</text>`; });
        return `<svg id="bd-beam" viewBox="0 0 ${W} 296" class="w-full select-none" style="direction:ltr;max-height:300px" xmlns="http://www.w3.org/2000/svg">${g.join('')}${rl}</svg>`;
    }

    function panel(title, unit, xs, vals, color, flip, fmtv, opt) {
        const H = 190, top = 34, bot = 18, h = H - top - bot;
        const pv = vals.map((v) => (flip ? -v : v));
        let lo = Math.min(0, ...pv), hi = Math.max(0, ...pv); if (hi - lo < 1e-9) { hi = 1; lo = -1; }
        const pad = (hi - lo) * 0.18; lo -= pad; hi += pad;
        const py = (v) => top + ((hi - v) / (hi - lo)) * h, y0 = py(0);
        let d = '', last = null;
        xs.forEach((x, i) => { d += (i ? 'L' : 'M') + sx(x).toFixed(1) + ',' + py(pv[i]).toFixed(1); });
        const area = d + `L${sx(xs[xs.length - 1]).toFixed(1)},${y0.toFixed(1)}L${sx(xs[0]).toFixed(1)},${y0.toFixed(1)}Z`;
        let guides = ''; R.cp.forEach((c) => { guides += `<line x1="${sx(c)}" y1="${top - 6}" x2="${sx(c)}" y2="${H - bot + 6}" stroke="currentColor" stroke-opacity=".18" stroke-dasharray="4 4"/>`; });
        /* labels: global extremes + non-zero end values */
        const marks = new Map(); const addM = (i) => { marks.set(i, 1); };
        let iMax = 0, iMin = 0; vals.forEach((v, i) => { if (v > vals[iMax]) iMax = i; if (v < vals[iMin]) iMin = i; });
        const ref = Math.max(Math.abs(vals[iMax]), Math.abs(vals[iMin]), 1e-12);
        [iMax, iMin, 0, vals.length - 1].forEach((i) => { if (Math.abs(vals[i]) > ref * 0.02) addM(i); });
        if (opt && opt.extra) opt.extra.forEach((i) => { if (Math.abs(vals[i]) > ref * 0.02) addM(i); });
        let lab = ''; const used = [];
        Array.from(marks.keys()).sort((a, b) => Math.abs(vals[b]) - Math.abs(vals[a])).forEach((i) => {
            const x = sx(xs[i]), yv = py(pv[i]); if (used.some((u) => Math.abs(u - x) < 110)) return; used.push(x);
            const below = pv[i] < 0 || (pv[i] === 0 && false), ty = below ? yv + 26 : yv - 10;
            lab += `<circle cx="${x}" cy="${yv}" r="4" fill="${color}"/><text x="${Math.min(X1 + 20, Math.max(X0 - 20, x))}" y="${Math.min(H - 2, Math.max(24, ty))}" text-anchor="middle" font-size="23" font-weight="700" fill="${color}">${fmtv(vals[i])}</text>`;
        });
        return `<div class="mb-1"><div class="flex justify-between items-baseline text-sm font-bold px-1"><span>${title}</span><span class="text-xs font-normal opacity-70">${unit}</span></div>
        <svg viewBox="0 0 ${W} ${H}" class="w-full bd-chart" style="direction:ltr" xmlns="http://www.w3.org/2000/svg">${guides}<line x1="${X0}" y1="${y0}" x2="${X1}" y2="${y0}" stroke="currentColor" stroke-opacity=".5" stroke-width="1.5"/><path d="${area}" fill="${color}" fill-opacity=".22"/><path d="${d}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>${lab}<line class="bd-cur" x1="0" y1="${top - 6}" x2="0" y2="${H - bot + 6}" stroke="currentColor" stroke-width="1.5" style="display:none"/><rect class="bd-hit" x="${X0}" y="0" width="${X1 - X0}" height="${H}" fill="transparent" style="touch-action:pan-y"/></svg></div>`;
    }

    /* ============================ UI ============================ */
    const INP = 'w-full px-2 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm';
    const CARD = 'bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-4 mb-4';
    const num = (path, label, val, step) => `<label class="block text-xs"><span class="opacity-70">${label}</span><input type="number" inputmode="decimal" step="${step || 'any'}" class="${INP}" data-f="${path}" value="${val}"></label>`;
    const opt = (v, cur, label) => `<option value="${v}" ${v === cur ? 'selected' : ''}>${esc(label)}</option>`;
    const seg = (act, cur, items) => `<div class="flex flex-wrap gap-2">${items.map((i) => `<button type="button" data-act="${act}" data-v="${i[0]}" class="px-3 py-2 rounded-md text-sm font-medium border ${i[0] === cur ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600'}">${esc(i[1])}</button>`).join('')}</div>`;
    const step = (n, t) => `<div class="flex items-center gap-2 mb-3"><span class="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-bold">${n}</span><h3 class="font-bold">${t}</h3></div>`;

    function loadCard(l) {
        const dirOpts = l.t === 'moment' ? opt('cw', l.dir, T('Clockwise ↻', 'مع عقارب الساعة ↻')) + opt('ccw', l.dir, T('Counter-clockwise ↺', 'عكس عقارب الساعة ↺')) : opt('down', l.dir, T('Down ↓', 'للأسفل ↓')) + opt('up', l.dir, T('Up ↑', 'للأعلى ↑'));
        const name = { point: T('Point load', 'حمل مركّز'), udl: T('Uniform load', 'حمل موزّع منتظم'), trap: T('Triangular / trapezoid load', 'حمل مثلثي / شبه منحرف'), moment: T('Applied moment', 'عزم مطبّق'), thermal: T('Thermal load', 'حمل حراري') }[l.t];
        let fields = '';
        const p = 'ld.' + l.id + '.';
        if (l.t === 'point') fields = num(p + 'x', T('Position (m)', 'الموضع (م)'), l.x) + num(p + 'v', T('Force (kN)', 'القوة (kN)'), l.v);
        else if (l.t === 'moment') fields = num(p + 'x', T('Position (m)', 'الموضع (م)'), l.x) + num(p + 'v', T('Moment (kN·m)', 'العزم (kN·m)'), l.v);
        else if (l.t === 'udl') fields = num(p + 'x', T('From (m)', 'من (م)'), l.x) + num(p + 'x2', T('To (m)', 'إلى (م)'), l.x2) + num(p + 'v', T('Intensity (kN/m)', 'الشدة (kN/m)'), l.v);
        else if (l.t === 'thermal') fields = num(p + 'v', T('Uniform temperature change ΔT (°C)', 'تغيّر الحرارة المنتظم ΔT (°م)'), l.v) + num(p + 'v2', T('Gradient: top − bottom (°C)', 'التدرج: أعلى − أسفل (°م)'), l.v2);
        else fields = num(p + 'x', T('From (m)', 'من (م)'), l.x) + num(p + 'x2', T('To (m)', 'إلى (م)'), l.x2) + num(p + 'v', T('Start (kN/m)', 'عند البداية (kN/m)'), l.v) + num(p + 'v2', T('End (kN/m)', 'عند النهاية (kN/m)'), l.v2);
        return `<div class="border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-2"><div class="flex items-center justify-between mb-2"><span class="font-semibold text-sm">${name}</span><button type="button" data-act="del" data-v="${l.id}" class="text-red-600 text-sm px-2 py-1"><i class="fa-solid fa-trash"></i> ${T('Delete', 'حذف')}</button></div>
        <div class="grid grid-cols-2 gap-2">${fields}${l.t === 'thermal' ? '' : `<label class="block text-xs"><span class="opacity-70">${T('Direction', 'الاتجاه')}</span><select class="${INP}" data-f="${p}dir">${dirOpts}</select></label>`}</div>${l.t === 'thermal' ? `<p class="text-xs opacity-70 mt-2">${T('Uniform ΔT: free expansion (stress only if both supports are pins). Gradient: bends the beam freely, so it only adds sag.', 'ΔT المنتظم: تمدد حر (يظهر إجهاد فقط إذا كان المسندان مفصليين). التدرج: يحني الجائز بحرية فيزيد التدلي فقط.')}</p>` : ''}</div>`;
    }
    function secFields() {
        const s = S.sec, o = [];
        if (s.sec === 'rect') o.push(num('sec.b', T('Width b (mm)', 'العرض b (مم)'), s.b), num('sec.h', T('Height h (mm)', 'الارتفاع h (مم)'), s.h));
        else if (s.sec === 'circle') o.push(num('sec.d', T('Diameter d (mm)', 'القطر d (مم)'), s.d));
        else if (s.sec === 'tube') o.push(num('sec.D', T('Outer Ø D (mm)', 'القطر الخارجي D (مم)'), s.D), num('sec.t', T('Wall t (mm)', 'السماكة t (مم)'), s.t));
        else o.push(`<label class="block text-xs"><span class="opacity-70">IPE</span><select class="${INP}" data-f="sec.ipe">${Object.keys(SM.IPE).map((k) => opt(k, String(s.ipe), 'IPE ' + k)).join('')}</select></label>`);
        return o.join('');
    }
    function renderForm() {
        if (!root || !S) return;
        const t = S.sup.type;
        root.querySelector('#bd-form').innerHTML = `
        <div class="${CARD}">${step(1, T('Beam and supports', 'الجائز والمساند'))}
            <div class="mb-3 text-xs opacity-70">${T('Examples:', 'أمثلة جاهزة:')}</div>
            <div class="flex flex-wrap gap-2 mb-4">${[['center', T('Point load', 'حمل مركّز')], ['udl', T('Uniform load', 'حمل منتظم')], ['tri', T('Triangular', 'حمل مثلثي')], ['over', T('Overhang', 'جائز ببروز')], ['cant', T('Cantilever', 'كابولي')], ['mom', T('With moment', 'مع عزم')]].map((e) => `<button type="button" data-act="preset" data-v="${e[0]}" class="px-3 py-1.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-gray-700 dark:text-primary-400">${e[1]}</button>`).join('')}</div>
            <div class="grid grid-cols-2 gap-2 mb-3">${num('L', T('Beam length (m)', 'طول الجائز (م)'), S.L)}</div>
            ${seg('suptype', t, [['ss', T('Two supports (pin / roller)', 'مسندان (مفصل / متحرك)')], ['cantL', T('Cantilever (fixed left)', 'كابولي (تثبيت يسار)')], ['cantR', T('Cantilever (fixed right)', 'كابولي (تثبيت يمين)')]])}
            ${t === 'ss' ? `<div class="grid grid-cols-2 gap-2 mt-3">${num('sup.a', T('Support A at (m)', 'المسند A عند (م)'), S.sup.a)}${num('sup.b', T('Support B at (m)', 'المسند B عند (م)'), S.sup.b)}
                <label class="block text-xs"><span class="opacity-70">${T('Type of A', 'نوع المسند A')}</span><select class="${INP}" data-f="sup.ta">${opt('pin', S.sup.ta || 'pin', T('Pin (hinge)', 'مفصل'))}${opt('roller', S.sup.ta || 'pin', T('Roller', 'متحرك'))}</select></label>
                <label class="block text-xs"><span class="opacity-70">${T('Type of B', 'نوع المسند B')}</span><select class="${INP}" data-f="sup.tb">${opt('pin', S.sup.tb || 'roller', T('Pin (hinge)', 'مفصل'))}${opt('roller', S.sup.tb || 'roller', T('Roller', 'متحرك'))}</select></label></div><p class="text-xs opacity-70 mt-2">${T('Put the supports inside the beam to get overhangs. You can also drag them on the drawing.', 'ضع المساند داخل الجائز لتحصل على بروزات. وتقدر تسحبهم على الرسمة.')}</p>` : ''}
        </div>
        <div class="${CARD}">${step(2, T('Loads', 'الأحمال'))}
            <div id="bd-loads">${S.loads.map(loadCard).join('') || `<p class="text-sm opacity-70 mb-2">${T('No loads yet — add one.', 'ما في أحمال بعد، أضف حملاً.')}</p>`}</div>
            <div class="flex flex-wrap gap-2 mt-2">${[['point', 'fa-arrow-down', T('Point load', 'حمل مركّز')], ['udl', 'fa-grip-lines', T('Uniform', 'موزّع منتظم')], ['trap', 'fa-caret-down', T('Triangular', 'مثلثي')], ['moment', 'fa-rotate-right', T('Moment', 'عزم')], ['thermal', 'fa-temperature-half', T('Thermal', 'حراري')]].map((a) => `<button type="button" data-act="add" data-v="${a[0]}" class="px-3 py-2 rounded-md text-sm font-medium bg-primary-600 text-white"><i class="fa-solid ${a[1]}"></i> ${a[2]}</button>`).join('')}</div>
        </div>
        <div class="${CARD}">${step(3, T('Section and material', 'المقطع والمادة'))}
            ${seg('sectype', S.sec.sec, [['rect', T('Rectangle', 'مستطيل')], ['circle', T('Round', 'دائري')], ['tube', T('Tube', 'أنبوب')], ['ipe', 'IPE']])}
            <div class="grid grid-cols-2 gap-2 mt-3">${secFields()}
            <label class="block text-xs col-span-2"><span class="opacity-70">${T('Material', 'المادة')}</span><select class="${INP}" data-f="mat">${SM.matOptions().map((m) => opt(m.v, S.mat, T(m.label.en, m.label.ar))).join('')}</select></label></div>
            <label class="flex items-center gap-2 text-sm mt-3"><input type="checkbox" data-f="sw" ${S.sw ? 'checked' : ''}> ${T('Include the beam\'s own weight', 'احسب وزن الجائز نفسه')}</label>
        </div>`;
    }
    function fullStr(o) { return o; }

    function renderOut() {
        if (!root || !S) return;
        const box = root.querySelector('#bd-out');
        R = solve(S);
        if (!R.ok) { box.innerHTML = `<div class="${CARD} text-red-600 font-semibold">${esc(R.msg)}</div>`; return; }
        const fl = S.tens, sfx = (x) => f(x, 2);
        const reacTxt = R.reac.map((r) => (r.kind === 'fixed' ? `Ry = ${f(r.Fy)} kN ${r.Fy >= 0 ? '↑' : '↓'},  M = ${f(Math.abs(r.Mr))} kN·m ${r.Mr >= 0 ? '↺' : '↻'}` : `R${r.n} = ${f(r.Fy)} kN ${r.Fy >= 0 ? '↑' : '↓'}`)).join('<br>');
        const sfv = R.sf, sfT = R.sfT, sfCls = sfv < 1 ? 'text-red-600' : sfv < 1.5 ? 'text-amber-600' : 'text-green-600';
        const dOK = R.dmax <= R.dlim;
        const tile = (k, v, sub, cls) => `<div class="rounded-lg bg-gray-50 dark:bg-gray-900 p-3"><div class="text-xs opacity-70">${k}</div><div class="font-bold ${cls || ''}">${v}</div>${sub ? `<div class="text-xs opacity-70">${sub}</div>` : ''}</div>`;
        const mp = R.M[R.iM], xM = R.xs[R.iM];
        const verdict = sfv < 1 ? T('The beam FAILS: the stress exceeds the yield strength.', 'الجائز غير آمن: الإجهاد تجاوز حد الخضوع.') : sfv < 1.5 ? T('Marginal: safety factor is below 1.5.', 'هامش الأمان ضعيف: عامل الأمان أقل من 1.5.') : T('The section is safe for bending.', 'المقطع آمن على الانحناء.');
        const tbl = R.table.map((r) => `<tr class="border-t border-gray-200 dark:border-gray-700"><td class="py-1 px-1">${f(r.x)}</td><td class="px-1">${r.V1 == null ? '—' : f(r.V1)}</td><td class="px-1">${r.V2 == null ? '—' : f(r.V2)}</td><td class="px-1">${r.M1 == null ? '—' : f(r.M1)}</td><td class="px-1">${r.M2 == null ? '—' : f(r.M2)}</td></tr>`).join('');
        box.innerHTML = `
        <div class="${CARD}">${step(4, T('Results', 'النتائج'))}
            <div class="grid grid-cols-2 gap-2">
                ${tile(T('Reactions', 'ردود الأفعال'), reacTxt)}
                ${tile(T('Max shear |V|', 'أكبر قوة قص |V|'), f(R.Vmax) + ' kN', T('at x = ', 'عند x = ') + f(R.xs[R.iVmax]) + ' m')}
                ${tile(T('Max moment |M|', 'أكبر عزم |M|'), f(R.Mmax) + ' kN·m', T('at x = ', 'عند x = ') + f(xM) + ' m')}
                ${tile(T('Max stress', 'أكبر إجهاد'), f(R.sigma, 1) + ' MPa', (R.therm && R.therm.restrained ? T('bending ', 'انحناء ') + f(R.sigmaB, 1) + ' + ' + T('thermal ', 'حراري ') + f(Math.abs(R.therm.sigN), 1) + ' · ' : T('bending · ', 'انحناء · ')) + 'τmax = ' + f(R.tau, 1) + ' MPa (' + T('shear SF ', 'أمان القص ') + (isFinite(sfT) ? f(sfT, 2) : '∞') + ')')}
                ${tile(T('Safety factor', 'عامل الأمان'), isFinite(sfv) ? f(sfv, 2) : '∞', T('yield ', 'خضوع ') + f(R.mat.sy / 1e6, 0) + ' MPa', sfCls)}
                ${R.therm ? tile(T('Thermal effect', 'الأثر الحراري'), (R.therm.restrained ? T('Axial N = ', 'قوة محورية N = ') + f(R.therm.N, 1) + ' kN' : T('free ΔL = ', 'تمدد حر ΔL = ') + f(R.therm.dL, 2) + ' mm'), R.therm.restrained ? T('stress ', 'إجهاد ') + f(Math.abs(R.therm.sigN), 1) + ' MPa' : T('no thermal stress', 'بدون إجهاد حراري')) : ''}
                ${tile(T('Max deflection', 'أكبر تدلي'), f(R.dmax, 2) + ' mm', T('limit L/250 = ', 'الحد L/250 = ') + f(R.dlim, 1) + ' mm', dOK ? 'text-green-600' : 'text-red-600')}
            </div>
            <p class="mt-3 text-sm font-semibold ${sfCls}">${verdict}${dOK ? '' : ' ' + T('Deflection is too large.', 'التدلي كبير.')}</p>
            ${sfT < 1 ? `<p class="mt-1 text-sm font-semibold text-red-600">${T('The beam FAILS in shear: τmax exceeds the shear yield strength (0.577·σy).', 'الجائز غير آمن على القص: τmax تجاوز إجهاد خضوع القص (0.577·σy).')}</p>` : ''}
            ${R.therm && R.therm.buckle ? `<p class="mt-1 text-sm font-semibold text-red-600">${T('Warning: the restrained thermal compression (' + f(-R.therm.N, 1) + ' kN) is above the Euler buckling load of the weak axis (' + f(R.therm.Pe, 1) + ' kN). The beam may buckle sideways, so the stress shown is NOT reliable.', 'تحذير: قوة الضغط الحرارية المقيّدة (' + f(-R.therm.N, 1) + ' kN) أكبر من حمل أولر للانبعاج حول المحور الضعيف (' + f(R.therm.Pe, 1) + ' kN). قد ينبعج الجائز جانبياً فلا يُعتمد على الإجهاد المعروض.')}</p>` : ''}
            ${S.sup.type === 'ss' && (S.sup.ta || 'pin') === 'roller' && (S.sup.tb || 'roller') === 'roller' ? `<p class="text-xs text-amber-600 mt-1">${T('Both supports are rollers: no horizontal restraint, valid for vertical loads only.', 'المسندان متحركان: لا يوجد قيد أفقي، والحل صالح للأحمال العمودية فقط.')}</p>` : ''}
            <div class="flex flex-wrap gap-2 mt-3"><button type="button" data-act="export" data-v="png" class="px-3 py-2 rounded-md text-sm font-medium bg-primary-600 text-white"><i class="fa-solid fa-image"></i> ${T('Export image', 'تصدير صورة')}</button><button type="button" data-act="export" data-v="pdf" class="px-3 py-2 rounded-md text-sm font-medium bg-primary-600 text-white"><i class="fa-solid fa-file-pdf"></i> ${T('Export PDF', 'تصدير PDF')}</button></div><div id="bd-export-msg" class="text-xs mt-2 opacity-80"></div>
            <p class="text-xs opacity-70 mt-1">${T('Section:', 'المقطع:')} ${esc(T(R.sec.name.en, R.sec.name.ar))} — I = ${f(R.sec.I * 1e8, 1)} cm⁴, W = ${f(R.sec.W * 1e6, 1)} cm³</p>
        </div>
        <div class="${CARD}"><div class="flex items-center justify-between mb-2"><h3 class="font-bold">${T('Diagrams', 'المخططات')}</h3><label class="text-xs flex items-center gap-1"><input type="checkbox" data-f="tens" ${fl ? 'checked' : ''}> ${T('Moment on tension side', 'العزم على جهة الشد')}</label></div>
            <div id="bd-read" class="text-sm rounded-md bg-gray-50 dark:bg-gray-900 px-3 py-2 mb-2" style="direction:ltr;min-height:2.4em">${T('Touch or hover the diagrams to read values at any point.', 'المس المخططات أو مرّر عليها لقراءة القيم عند أي نقطة.')}</div>
            ${panel(T('Shear force V', 'قوة القص V'), 'kN', R.xs, R.V, '#2563eb', false, (v) => f(v), {})}
            ${panel(T('Bending moment M', 'عزم الانحناء M'), 'kN·m' + (fl ? T(' (positive drawn down)', ' (الموجب للأسفل)') : ''), R.xs, R.M, '#dc2626', fl, (v) => f(v), { extra: [R.iM] })}
            ${R.defl ? panel(T('Deflection y', 'التدلي y'), 'mm', R.xs, R.defl.map((v) => v * 1000), '#059669', false, (v) => f(v, 2), { extra: [R.iD] }) : ''}
        </div>
        <details class="${CARD}"><summary class="font-bold cursor-pointer">${T('Show the solution step by step', 'اشرح الحل خطوة بخطوة')}</summary>
            <div class="mt-3 text-sm space-y-2" style="direction:ltr">
                <p class="font-semibold">${T('1) Reactions (equilibrium)', '1) ردود الأفعال (التوازن)')}</p>
                ${R.steps.map((s) => `<p class="font-mono text-xs">${esc(s)}</p>`).join('')}
                <p class="font-semibold">${T('2) Shear and moment at the key points', '2) القص والعزم عند النقاط المفتاحية')}</p>
                <div class="overflow-x-auto"><table class="text-xs w-full text-left"><thead><tr><th class="px-1">x (m)</th><th class="px-1">V− (kN)</th><th class="px-1">V+ (kN)</th><th class="px-1">M− (kN·m)</th><th class="px-1">M+ (kN·m)</th></tr></thead><tbody>${tbl}</tbody></table></div>
                <p class="text-xs opacity-70">${T('V−/M− = just left of the point, V+/M+ = just right. A point load makes V jump; an applied moment makes M jump. M is maximum where V crosses zero.', 'V−/M− = قبل النقطة مباشرة، V+/M+ = بعدها. الحمل المركّز يعمل قفزة بالقص، والعزم المطبّق يعمل قفزة بالعزم. العزم يكون أعظمياً حيث يقطع القص الصفر.')}</p>
                <p class="font-semibold">${T('3) Stress', '3) الإجهاد')}</p>
                <p class="font-mono text-xs">σmax = Mmax / W = ${f(R.Mmax)}×10⁶ / ${f(R.sec.W * 1e9, 0)} = ${f(R.sigma, 1)} MPa</p>
                <p class="font-mono text-xs">n = σy / σmax = ${f(R.mat.sy / 1e6, 0)} / ${f(R.sigma, 1)} = ${isFinite(sfv) ? f(sfv, 2) : '∞'}</p>
            </div>
            <p class="text-xs opacity-70 mt-3">${T('Euler–Bernoulli beam theory (bending only). Use a certified engineer for real structures.', 'نظرية أويلر–برنولي (انحناء فقط). للمنشآت الحقيقية يلزم مهندس معتمد.')}</p>
        </details>`;
        root.querySelector('#bd-diagram').innerHTML = drawBeam();
        attachChartEvents();
        save();
    }

    function nearestIdx(x) { let lo = 0, hi = R.xs.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (R.xs[m] < x) lo = m; else hi = m; } return Math.abs(R.xs[lo] - x) < Math.abs(R.xs[hi] - x) ? lo : hi; }
    function attachChartEvents() {
        root.querySelectorAll('.bd-hit').forEach((h) => {
            const mv = (e) => {
                const svg = h.ownerSVGElement, r = svg.getBoundingClientRect(), X = ((e.clientX - r.left) / r.width) * W, x = Math.min(S.L, Math.max(0, ((X - X0) / (X1 - X0)) * S.L));
                const i = nearestIdx(x), xc = sx(R.xs[i]);
                root.querySelectorAll('.bd-cur').forEach((l) => { l.setAttribute('x1', xc); l.setAttribute('x2', xc); l.style.display = ''; });
                $('bd-read').textContent = 'x = ' + f(R.xs[i], 2) + ' m   |   V = ' + f(R.V[i]) + ' kN   |   M = ' + f(R.M[i]) + ' kN·m' + (R.defl ? '   |   y = ' + f(R.defl[i] * 1000, 2) + ' mm' : '');
            };
            h.addEventListener('pointermove', mv); h.addEventListener('pointerdown', mv);
        });
    }

    /* ---- state access by path ---- */
    function loadById(id) { return S.loads.find((l) => l.id === +id); }
    function getField(path) {
        const p = path.split('.');
        if (p[0] === 'ld') return loadById(p[1])[p[2]];
        if (p.length === 1) return S[p[0]];
        return S[p[0]][p[1]];
    }
    function setField(path, raw) {
        const p = path.split('.');
        const isNum = !(path === 'mat' || path.endsWith('.ta') || path.endsWith('.tb') || path.endsWith('.dir') || path === 'sw' || path === 'tens');
        let v = raw;
        if (isNum) { v = parseFloat(raw); if (!isFinite(v)) return false; }
        if (p[0] === 'ld') { const l = loadById(p[1]); l[p[2]] = v; } else if (p.length === 1) S[p[0]] = v; else S[p[0]][p[1]] = (p[1] === 'ipe') ? v : v;
        clampAll(); return true;
    }
    function clampAll() {
        S.L = Math.min(100, Math.max(0.2, S.L));
        const c = (x) => Math.min(S.L, Math.max(0, x));
        S.sup.a = c(S.sup.a); S.sup.b = c(S.sup.b);
        S.loads.forEach((l) => {
            l.x = c(l.x);
            if (l.t === 'udl' || l.t === 'trap') { l.x2 = c(l.x2); if (l.x2 < l.x) { const t = l.x; l.x = l.x2; l.x2 = t; if (l.t === 'trap') { const w = l.v; l.v = l.v2; l.v2 = w; } } }
            if (l.t === 'thermal') { l.v = Math.max(-200, Math.min(200, l.v)); l.v2 = Math.max(-200, Math.min(200, l.v2)); return; }
            l.v = Math.max(0, l.v); if (l.v2 != null) l.v2 = Math.max(0, l.v2);
        });
        const s = S.sec; ['b', 'h', 'd', 'D', 't'].forEach((k) => { s[k] = Math.max(1, s[k]); }); s.D = Math.max(5, s.D); s.t = Math.max(0.5, Math.min(s.t, s.D / 2 - 1));
    }
    function syncInputs() {
        root.querySelectorAll('[data-f]').forEach((el) => {
            if (el === document.activeElement || el.type === 'checkbox') return;
            try { const v = getField(el.dataset.f); if (v !== undefined && el.type === 'number' && parseFloat(el.value) !== v) el.value = f(v, 3); } catch (e) {}
        });
    }
    function full() { renderForm(); renderOut(); }

    function addLoad(t) {
        const L = S.L, base = { id: uid++, t, x: +(L / 2).toFixed(2), x2: +(L / 2).toFixed(2), v: 10, v2: 10, dir: t === 'moment' ? 'cw' : 'down' };
        if (t === 'udl') { base.x = 0; base.x2 = L; base.v = 5; base.v2 = 5; }
        if (t === 'trap') { base.x = 0; base.x2 = L; base.v = 0; base.v2 = 8; }
        if (t === 'moment') base.v = 10;
        if (t === 'thermal') { base.v = 40; base.v2 = 20; }
        S.loads.push(base);
    }

    function onDrag(e) {
        const el = e.target.closest('[data-drag]'); if (!el) return;
        const svg = $('bd-beam'); if (!svg) return;
        const toX = (ev) => { const cur = $('bd-beam') || svg, r = cur.getBoundingClientRect(); if (!(r.width > 0)) return null; const X = ((ev.clientX - r.left) / r.width) * W; return Math.min(S.L, Math.max(0, ((X - X0) / (X1 - X0)) * S.L)); };   /* the SVG is re-created at every redraw: always measure the live one */
        const snap = (v) => { const st = S.L <= 3 ? 0.01 : 0.05; return +(Math.round(v / st) * st).toFixed(3); };
        const [kind, id] = el.dataset.drag.split(':'); const x0 = toX(e); if (x0 == null) return;
        let l = kind === 'ld' ? loadById(id) : null; const start = l ? { x: l.x, x2: l.x2 } : null;
        e.preventDefault(); try { el.setPointerCapture(e.pointerId); } catch (er) {}
        const mv = (ev) => {
            const xn = toX(ev); if (xn == null) return;
            const dx = xn - x0;
            if (kind === 'sup') S.sup[id] = snap(xn);
            else if (l.t === 'udl' || l.t === 'trap') { const len = start.x2 - start.x; let nx = Math.min(S.L - len, Math.max(0, start.x + dx)); l.x = snap(nx); l.x2 = +(l.x + len).toFixed(3); }
            else l.x = snap(Math.min(S.L, Math.max(0, start.x + dx)));
            renderOut(); syncInputs();
        };
        const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); };
        window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    }

    function build() {
        root.innerHTML = `<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${T('Draw your beam: choose the supports, add the loads, and get the shear force, bending moment and deflection diagrams instantly.', 'ارسم جائزك: اختر المساند وأضف الأحمال، وبتحصل فوراً على مخططات القص والعزم والتدلي.')}</p>
        <div class="${CARD}"><div id="bd-diagram"></div></div>
        <div id="bd-note" class="text-xs font-semibold text-amber-600 mb-2" role="status"></div>
        <div id="bd-form"></div><div id="bd-out"></div>`;
        root.oninput = (e) => {
            const el = e.target.closest('[data-f]'); if (!el || el.type === 'checkbox' || el.tagName === 'SELECT') return;
            const nt = root.querySelector('#bd-note'); if (nt) nt.textContent = '';
            if (setField(el.dataset.f, el.value)) renderOut();
        };
        root.onchange = (e) => {
            const el = e.target.closest('[data-f]'); if (!el) return;
            if (el.type === 'checkbox') { setField(el.dataset.f, el.checked); renderOut(); return; }
            if (el.tagName === 'SELECT') { setField(el.dataset.f, el.value); renderOut(); return; }
            const typed = parseFloat(el.value), ok = setField(el.dataset.f, el.value);
            if (ok) { renderOut(); syncInputs(); }
            const nt = root.querySelector('#bd-note'); if (nt) { let msg = ''; try { const cur = getField(el.dataset.f); if (!ok) msg = T('Not a valid number: the previous value was kept.', 'قيمة غير صالحة: بقيت القيمة السابقة.'); else if (typeof cur === 'number' && Math.abs(cur - typed) > 1e-9 * Math.max(1, Math.abs(typed))) msg = T('The value was adjusted to the allowed range: ', 'تم ضبط القيمة ضمن المجال المسموح: ') + f(cur, 3); } catch (e) {} nt.textContent = msg; }
            if (!ok) syncInputs();
        };
        root.onclick = (e) => {
            const b = e.target.closest('[data-act]'); if (!b) return; const a = b.dataset.act, v = b.dataset.v;
            if (a === 'preset') loadPreset(v);
            else if (a === 'add') { addLoad(v); full(); }
            else if (a === 'del') { S.loads = S.loads.filter((l) => l.id !== +v); full(); }
            else if (a === 'suptype') { S.sup.type = v; if (v === 'ss' && Math.abs(S.sup.b - S.sup.a) < 0.05) { S.sup.a = 0; S.sup.b = S.L; } full(); }
            else if (a === 'sectype') { S.sec.sec = v; full(); }
            else if (a === 'export') doExport(v);
        };
        root.onpointerdown = onDrag;
    }


    /* ============================ export (PNG / PDF) ============================ */
    const svgToImg = (svgEl) => new Promise((res, rej) => {
        const c = svgEl.cloneNode(true); c.querySelectorAll('.bd-hit,.bd-cur').forEach((n) => n.remove());
        const vb = c.getAttribute('viewBox').split(' ').map(Number); c.setAttribute('width', vb[2]); c.setAttribute('height', vb[3]);
        c.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); c.style.color = '#334155'; c.removeAttribute('class'); c.removeAttribute('style');
        let xml = new XMLSerializer().serializeToString(c).replace(/currentColor/g, '#334155');
        const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
    });
    async function renderExportCanvas() {
        const ar = lang() === 'ar', Wd = 1200, M = 40, IW = Wd - 2 * M;
        const beamSvg = $('bd-beam'), charts = Array.from(root.querySelectorAll('.bd-chart'));
        const imgs = await Promise.all([beamSvg].concat(charts).map(svgToImg));
        const titles = [T('Beam and loads', 'الجائز والأحمال'), T('Shear force V (kN)', 'قوة القص V (kN)'), T('Bending moment M (kN·m)' + (S.tens ? ' — ' + T('positive drawn down', 'الموجب للأسفل') : ''), 'عزم الانحناء M (kN·m)' + (S.tens ? ' — الموجب للأسفل' : '')), T('Deflection y (mm)', 'التدلي y (mm)')];
        const L = [];
        const supTxt = S.sup.type === 'ss' ? T('Supports: A = ', 'المساند: A = ') + ((S.sup.ta || 'pin') === 'pin' ? T('pin', 'مفصل') : T('roller', 'متحرك')) + ' @ ' + f(S.sup.a) + ' m,  B = ' + ((S.sup.tb || 'roller') === 'pin' ? T('pin', 'مفصل') : T('roller', 'متحرك')) + ' @ ' + f(S.sup.b) + ' m' : T('Cantilever, fixed at the ', 'كابولي، مثبّت من ') + (S.sup.type === 'cantL' ? T('left end', 'اليسار') : T('right end', 'اليمين'));
        L.push([T('Length L = ', 'الطول L = ') + f(S.L) + ' m', 0], [supTxt, 0]);
        S.loads.forEach((l) => {
            const d = l.dir === 'down' ? T('down', 'للأسفل') : l.dir === 'up' ? T('up', 'للأعلى') : l.dir === 'cw' ? T('clockwise', 'مع عقارب الساعة') : T('counter-clockwise', 'عكس عقارب الساعة');
            if (l.t === 'point') L.push([T('Point load ', 'حمل مركّز ') + f(l.v) + ' kN @ ' + f(l.x) + ' m (' + d + ')', 0]);
            else if (l.t === 'udl') L.push([T('Uniform load ', 'حمل منتظم ') + f(l.v) + ' kN/m  ' + f(l.x) + '→' + f(l.x2) + ' m (' + d + ')', 0]);
            else if (l.t === 'trap') L.push([T('Triangular/trapezoid ', 'حمل مثلثي/شبه منحرف ') + f(l.v) + '→' + f(l.v2) + ' kN/m  ' + f(l.x) + '→' + f(l.x2) + ' m (' + d + ')', 0]);
            else if (l.t === 'moment') L.push([T('Moment ', 'عزم ') + f(l.v) + ' kN·m @ ' + f(l.x) + ' m (' + d + ')', 0]);
            else L.push([T('Thermal: ΔT = ', 'حراري: ΔT = ') + f(l.v) + ' °C, ' + T('gradient ', 'التدرج ') + f(l.v2) + ' °C', 0]);
        });
        L.push([T('Section: ', 'المقطع: ') + (ar ? R.sec.name.ar : R.sec.name.en) + ' — ' + SM.MATS[S.mat].n[ar ? 'ar' : 'en'] + (S.sw ? T(' (self-weight included)', ' (مع الوزن الذاتي)') : ''), 0]);
        L.push(['', 0]);
        R.reac.forEach((r) => L.push([(r.kind === 'fixed' ? 'Ry = ' + f(r.Fy) + ' kN,  M = ' + f(Math.abs(r.Mr)) + ' kN·m' : 'R' + r.n + ' = ' + f(r.Fy) + ' kN') + (r.Fy >= 0 ? ' ↑' : ' ↓'), 1]));
        L.push([T('Max |V| = ', 'أكبر |V| = ') + f(R.Vmax) + ' kN @ x = ' + f(R.xs[R.iVmax]) + ' m', 1], [T('Max |M| = ', 'أكبر |M| = ') + f(R.Mmax) + ' kN·m @ x = ' + f(R.xs[R.iM]) + ' m', 1],
            [T('Max stress = ', 'أكبر إجهاد = ') + f(R.sigma, 1) + ' MPa,  τmax = ' + f(R.tau, 1) + ' MPa,  ' + T('safety factor = ', 'عامل الأمان = ') + (isFinite(R.sf) ? f(R.sf, 2) : '∞'), 1],
            [T('Max deflection = ', 'أكبر تدلي = ') + f(R.dmax, 2) + ' mm  (' + T('limit L/250 = ', 'الحد L/250 = ') + f(R.dlim, 1) + ' mm)', 1]);
        if (R.therm) L.push([R.therm.restrained ? T('Thermal axial force N = ', 'القوة المحورية الحرارية N = ') + f(R.therm.N, 1) + ' kN, σ = ' + f(Math.abs(R.therm.sigN), 1) + ' MPa' : T('Free thermal expansion ΔL = ', 'التمدد الحراري الحر ΔL = ') + f(R.therm.dL, 2) + ' mm', 1]);
        if (ar) L.forEach((r) => { r[0] = r[0].replace(/([A-Za-z0-9|][A-Za-z0-9.,@=→\-+°·²³\/|×≈ ]*[A-Za-z0-9°²³|])/g, '\u2066$1\u2069'); });
        const lh = 38, ratio = IW / 1000;
        let H = 120 + L.length * lh + 20;
        H += 40 + imgs[0].height * ratio; for (let i = 1; i < imgs.length; i++) H += 44 + imgs[i].height * ratio;
        H += 70;
        const cv = document.createElement('canvas'); cv.width = Wd; cv.height = Math.round(H);
        const x = cv.getContext('2d'); x.fillStyle = '#ffffff'; x.fillRect(0, 0, Wd, H); x.textBaseline = 'middle';
        const rtl = ar, tx = rtl ? Wd - M : M; x.direction = rtl ? 'rtl' : 'ltr'; x.textAlign = rtl ? 'right' : 'left';
        x.fillStyle = '#0f766e'; x.fillRect(0, 0, Wd, 80); x.fillStyle = '#fff'; x.font = '700 34px Cairo, Inter, Arial, sans-serif';
        x.fillText('MechAtlas — ' + T('Beam Designer', 'مصمّم الجوائز'), tx, 40);
        let y = 120; x.font = '500 25px Cairo, Inter, Arial, sans-serif';
        L.forEach((r) => { x.fillStyle = r[1] ? '#0f172a' : '#334155'; x.font = (r[1] ? '700 ' : '500 ') + '25px Cairo, Inter, Arial, sans-serif'; if (r[0]) x.fillText(r[0], tx, y); y += lh; });
        y += 10;
        imgs.forEach((im, i) => {
            x.fillStyle = '#0f172a'; x.font = '700 26px Cairo, Inter, Arial, sans-serif'; x.fillText(titles[i], tx, y + 14); y += 34;
            const hh = im.height * ratio; x.drawImage(im, M, y, IW, hh); y += hh + (i ? 10 : 6);
        });
        x.fillStyle = '#64748b'; x.font = '500 20px Cairo, Inter, Arial, sans-serif'; x.textAlign = 'center'; x.direction = 'ltr';
        x.fillText('MechAtlas · ' + T('Euler–Bernoulli beam theory — for learning, not a substitute for a certified engineer.', 'نظرية أويلر–برنولي — للتعلّم ولا تغني عن مهندس معتمد.') + ' · ' + new Date().toISOString().slice(0, 10), Wd / 2, H - 30);
        return cv;
    }
    function pdfFromJpeg(jpeg, w, h) {
        const enc = (str) => new TextEncoder().encode(str), parts = [], off = []; let len = 0;
        const push = (u8) => { parts.push(u8); len += u8.length; };
        const pw = 595, scale = (pw - 40) / w, ph = Math.round(h * scale + 40), iw = w * scale, ih = h * scale;
        push(enc('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'));
        const obj = (n, body) => { off[n] = len; push(enc(n + ' 0 obj\n')); push(typeof body === 'string' ? enc(body) : body); push(enc('\nendobj\n')); };
        obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
        obj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
        obj(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + pw + ' ' + ph + '] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');
        const head = enc('<< /Type /XObject /Subtype /Image /Width ' + w + ' /Height ' + h + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpeg.length + ' >>\nstream\n');
        const tail = enc('\nendstream');
        const img = new Uint8Array(head.length + jpeg.length + tail.length); img.set(head, 0); img.set(jpeg, head.length); img.set(tail, head.length + jpeg.length);
        obj(4, img);
        const cs = 'q ' + iw.toFixed(2) + ' 0 0 ' + ih.toFixed(2) + ' 20 20 cm /Im0 Do Q';
        obj(5, '<< /Length ' + cs.length + ' >>\nstream\n' + cs + '\nendstream');
        const xr = len; let t = 'xref\n0 6\n0000000000 65535 f \n'; for (let i = 1; i <= 5; i++) t += String(off[i]).padStart(10, '0') + ' 00000 n \n';
        t += 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xr + '\n%%EOF';
        push(enc(t));
        const out = new Uint8Array(len); let p = 0; parts.forEach((u) => { out.set(u, p); p += u.length; });
        return out;
    }
    async function deliver(blob, name, mime) {
        const msg = $('bd-export-msg'), ar = lang() === 'ar';
        try {
            const file = new File([blob], name, { type: mime });
            if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: name }); msg.textContent = ar ? 'تمت المشاركة.' : 'Shared.'; return; }
        } catch (e) { if (e && e.name === 'AbortError') return; }
        const url = URL.createObjectURL(blob);
        try { const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); } catch (e) {}
        if (mime === 'image/png') {
            msg.innerHTML = (ar ? 'إذا ما نزل الملف، اضغط مطولاً على الصورة واحفظها:' : 'If nothing downloaded, long-press the image and save it:') + `<img src="${url}" alt="" class="w-full mt-2 rounded-md border border-gray-200">`;
        } else msg.innerHTML = (ar ? 'إذا ما نزل الملف، ' : 'If nothing downloaded, ') + `<a class="underline text-primary-600" href="${url}" target="_blank" download="${name}">${ar ? 'اضغط هنا' : 'tap here'}</a>`;
    }
    async function doExport(kind) {
        const msg = $('bd-export-msg'), ar = lang() === 'ar';
        if (!R || !R.ok) return;
        msg.textContent = ar ? 'جاري التجهيز…' : 'Preparing…';
        try {
            const cv = await renderExportCanvas(), stamp = new Date().toISOString().slice(0, 10);
            if (kind === 'png') { const blob = await new Promise((r) => cv.toBlob(r, 'image/png')); await deliver(blob, 'beam-' + stamp + '.png', 'image/png'); }
            else {
                const d = cv.toDataURL('image/jpeg', 0.92).split(',')[1], bin = atob(d), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
                await deliver(new Blob([pdfFromJpeg(u8, cv.width, cv.height)], { type: 'application/pdf' }), 'beam-' + stamp + '.pdf', 'application/pdf');
            }
            if (!msg.innerHTML.includes('<')) { /* keep message from deliver */ }
        } catch (e) { msg.textContent = (ar ? 'تعذّر التصدير: ' : 'Export failed: ') + (e && e.message ? e.message : e); }
    }

    if (window.SM && SM.lab) SM.lab.action = { icon: 'fa-chart-area', label: window.GearKit.L2('Beam Designer', 'مصمّم الجوائز'), run() { window.navigate('beam'); } };
    window.BeamDesigner = {
        render() {
            root = $('bd-root'); if (!root || !window.SM) { if (root) root.innerHTML = '<p class="text-center py-10">…</p>'; return; }
            if (!S) restore();
            build(); full();
        },
        _solve: (st) => solve(st), _state: () => S, _set: (s) => { S = s; }
    };
})();
