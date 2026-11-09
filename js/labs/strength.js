/* Strength of Materials lab — core + beam bending model.
 * Beam: 4 support types (pin-roller, cantilever, propped, fixed-fixed), 5 load patterns, 4 section families (rectangle,
 * solid round, tube, IPE), 6 materials. Statically indeterminate cases are solved by the flexibility method
 * (double integration of M/EI with compatibility at the free end). Stress colours are drawn on the 3D beam. */
(function () {
    'use strict';
    const K = window.GearKit;
    if (!window.Labs || !K || !window.THREE) return;
    const PI = Math.PI, L2 = K.L2, fmt = K.fmt;
    const lang = () => (window.getLang ? window.getLang() : 'en');

    const SM = (window.SM = { models: {}, L2, fmt });
    const lab = {
        id: 'strength', icon: 'fa-ruler-combined',
        title: L2('Strength of Materials', 'مقاومة المواد'),
        intro: L2('Load a beam, pull a bar, twist a shaft, buckle a column, pressurise a vessel and draw Mohr\'s circle. Colours show the stress in the part; the charts show the diagrams an engineer draws by hand.',
            'حمّل عارضة، اسحب قضيباً، لُفّ عمود نقل، أنبِع عموداً، ضغّط وعاءً وارسم دائرة مور. الألوان تُظهر الإجهاد داخل القطعة، والمخططات هي ما يرسمه المهندس بيده.'),
        models: [], parts: {}, supports: { section: false },
        controls(model, cur) { return SM.models[model].controls(cur || {}); },
        build(model, p, api) { return SM.models[model].build(p, api); },
        apply(group, p, id) { if (group.userData.apply) group.userData.apply(p, id); },
        readouts(model, p, api, group) { return SM.models[model].readouts(p, group); },
        challenges(model) { return SM.models[model].challenges(); },
        listParts(model, p) { const m = SM.models[model]; return m.bom ? m.bom(p) : []; },
        charts: {
            draw(canvas, model, p, info) {
                const m = SM.models[model];
                if (m.draw) m.draw(canvas, p, info); else K.drawPanels(canvas, m.panels(p), info);
            }
        }
    };
    window.Labs.register(lab);
    SM.lab = lab;
    SM.add = (id, title, def) => { SM.models[id] = def; lab.models.push({ id, title }); };
    SM.addParts = (o) => Object.assign(lab.parts, o);
    SM.P = (name, desc, material, func, mfg, tol, std, asm, fail) => ({ name, desc, material, func, mfg, tol, std, asm, fail });
    SM.CH = (en, ar, fn) => ({ text: L2(en, ar), check: fn });
    SM.state = (sf) => (sf < 1 ? 'bad' : sf < 1.5 ? 'warn' : 'ok');
    SM.memo = (fn) => { let k = null, v = null; return (p) => { const key = JSON.stringify(p); if (key !== k) { v = fn(p); k = key; } return v; }; };

    /* ---------------- materials (SI) ---------------- */
    SM.MATS = {
        s235: { n: L2('Steel S235', 'فولاذ S235'), E: 210e9, G: 81e9, sy: 235e6, su: 360e6, rho: 7850, nu: 0.3 },
        s355: { n: L2('Steel S355', 'فولاذ S355'), E: 210e9, G: 81e9, sy: 355e6, su: 510e6, rho: 7850, nu: 0.3 },
        al: { n: L2('Aluminium 6061-T6', 'ألومنيوم 6061-T6'), E: 69e9, G: 26e9, sy: 240e6, su: 290e6, rho: 2700, nu: 0.33 },
        ti: { n: L2('Titanium Ti-6Al-4V', 'تيتانيوم Ti-6Al-4V'), E: 114e9, G: 42e9, sy: 880e6, su: 950e6, rho: 4430, nu: 0.34 },
        oak: { n: L2('Oak timber (along grain)', 'خشب سنديان (مع الألياف)'), E: 11e9, G: 0.8e9, sy: 40e6, su: 60e6, rho: 700, nu: 0.35 },
        ci: { n: L2('Cast iron GG25 (tension)', 'حديد زهر GG25 (شد)'), E: 100e9, G: 40e9, sy: 200e6, su: 250e6, rho: 7200, nu: 0.26 }
    };
    SM.matOptions = () => Object.keys(SM.MATS).map((v) => ({ v, label: SM.MATS[v].n }));

    /* diverging stress colour: blue (compression) – grey (0) – red (tension); beyond yield turns dark */
    SM.colorOf = (t) => {
        const a = Math.max(-1.25, Math.min(1.25, t)), u = Math.min(1, Math.abs(a)), g = [0.9, 0.91, 0.92], hot = a > 0 ? [0.86, 0.15, 0.15] : [0.15, 0.39, 0.92];
        let c = [g[0] + (hot[0] - g[0]) * u, g[1] + (hot[1] - g[1]) * u, g[2] + (hot[2] - g[2]) * u];
        if (Math.abs(a) > 1) { const f = Math.min(1, (Math.abs(a) - 1) / 0.25); c = [c[0] * (1 - 0.55 * f) + 0.3 * f, c[1] * (1 - 0.7 * f), c[2] * (1 - 0.35 * f) + 0.25 * f]; }
        return c;
    };
    SM.gradStops = [[0, '#1d4ed8'], [0.5, '#e5e7eb'], [1, '#dc2626']];

    /* ---------------- sections ---------------- */
    const IPE = {
        100: { h: 100, b: 55, tw: 4.1, tf: 5.7, A: 10.3, I: 171, m: 8.1 }, 120: { h: 120, b: 64, tw: 4.4, tf: 6.3, A: 13.2, I: 318, m: 10.4 },
        140: { h: 140, b: 73, tw: 4.7, tf: 6.9, A: 16.4, I: 541, m: 12.9 }, 160: { h: 160, b: 82, tw: 5.0, tf: 7.4, A: 20.1, I: 869, m: 15.8 },
        180: { h: 180, b: 91, tw: 5.3, tf: 8.0, A: 23.9, I: 1317, m: 18.8 }, 200: { h: 200, b: 100, tw: 5.6, tf: 8.5, A: 28.5, I: 1943, m: 22.4 },
        220: { h: 220, b: 110, tw: 5.9, tf: 9.2, A: 33.4, I: 2772, m: 26.2 }, 240: { h: 240, b: 120, tw: 6.2, tf: 9.8, A: 39.1, I: 3892, m: 30.7 },
        270: { h: 270, b: 135, tw: 6.6, tf: 10.2, A: 45.9, I: 5790, m: 36.1 }, 300: { h: 300, b: 150, tw: 7.1, tf: 10.7, A: 53.8, I: 8356, m: 42.2 }
    };
    SM.IPE = IPE;
    const ngon = (r, n) => { const a = []; for (let i = 0; i < n; i++) { const t = (i * 2 * PI) / n; a.push([r * Math.sin(t), r * Math.cos(t)]); } return a; };
    /* returns SI properties + outline loops in mm as [y(up), z] */
    SM.section = (p) => {
        let s;
        if (p.sec === 'rect') {
            const b = p.b, h = p.h;
            s = { A: (b * h) / 1e6, I: (b * Math.pow(h, 3)) / 12 / 1e12, c: h / 2000, h, w: b, tauK: 1.5, loops: [{ pts: [[-h / 2, -b / 2], [-h / 2, b / 2], [h / 2, b / 2], [h / 2, -b / 2]] }], name: L2('Rectangle ' + b + '×' + h, 'مستطيل ' + b + '×' + h), shear: 'rect' };
        } else if (p.sec === 'circle') {
            const d = p.d;
            s = { A: (PI * d * d) / 4 / 1e6, I: (PI * Math.pow(d, 4)) / 64 / 1e12, c: d / 2000, h: d, w: d, tauK: 4 / 3, loops: [{ pts: ngon(d / 2, 48) }], name: L2('Solid round Ø' + d, 'دائري مصمت Ø' + d), shear: 'circle' };
        } else if (p.sec === 'tube') {
            const D = p.D, t = Math.max(0.1, Math.min(p.t, D / 2 - 1)), di = D - 2 * t, Ro = D / 2, Ri = di / 2;
            s = { A: (PI * (D * D - di * di)) / 4 / 1e6, I: (PI * (Math.pow(D, 4) - Math.pow(di, 4))) / 64 / 1e12, c: D / 2000, h: D, w: D, tauK: (4 / 3) * (Ro * Ro + Ro * Ri + Ri * Ri) / (Ro * Ro + Ri * Ri), loops: [{ pts: ngon(D / 2, 48) }, { pts: ngon(di / 2, 48), hole: true }], name: L2('Tube Ø' + D + '×' + t, 'أنبوب Ø' + D + '×' + t), shear: 'tube' };
        } else {
            const e = IPE[p.ipe] || IPE[200], h = e.h, b = e.b, tw = e.tw, tf = e.tf;
            s = {
                A: e.A / 1e4, I: e.I / 1e8, c: h / 2000, h, w: b, tw, mpl: e.m,
                /* exact peak web shear of the idealised I: tau = V·Q/(I·tw) = tauK·V/A, Q = first moment of the half section about the neutral axis */
                tauK: ((b * tf * (h - tf)) / 2 + (tw * Math.pow(h / 2 - tf, 2)) / 2) * (e.A * 100) / (((b * Math.pow(h, 3) - (b - tw) * Math.pow(h - 2 * tf, 3)) / 12) * tw),
                loops: [{ pts: [[-h / 2, -b / 2], [-h / 2, b / 2], [-h / 2 + tf, b / 2], [-h / 2 + tf, tw / 2], [h / 2 - tf, tw / 2], [h / 2 - tf, b / 2], [h / 2, b / 2], [h / 2, -b / 2], [h / 2 - tf, -b / 2], [h / 2 - tf, -tw / 2], [-h / 2 + tf, -tw / 2], [-h / 2 + tf, -b / 2]] }],
                name: L2('IPE ' + p.ipe, 'IPE ' + p.ipe), shear: 'ipe'
            };
        }
        s.W = s.I / s.c;
        return s;
    };
    /* shear stress at height y (mm from neutral axis) for V (N) — exact for rect / circle, web average for others */
    SM.tauAt = (s, V, ymm) => {
        const u = ymm / (s.h / 2);
        if (s.shear === 'rect') return 1.5 * (V / s.A) * (1 - u * u);
        if (s.shear === 'circle') return (4 / 3) * (V / s.A) * (1 - u * u);
        return null;
    };

    /* ---------------- beam solver ---------------- */
    const NG = 300;
    const SUP = { ss: 'ss', cant: 'cant', prop: 'prop', fixed: 'fixed' };
    function loadsOf(p, L, wsw) {
        const pts = [];
        const add = (x, F) => pts.push({ x, F });
        const dist = (x0, x1, w0, w1) => { const n = 120, dx = (x1 - x0) / n; for (let k = 0; k < n; k++) { const xm = x0 + (k + 0.5) * dx, q = w0 + ((w1 - w0) * (xm - x0)) / (x1 - x0); add(xm, q * dx); } };
        const t = p.load, P = p.P * 1000, a = (L * p.a) / 100, w = p.w * 1000;
        if (t === 'point' || t === 'both') add(a, P);
        if (t === 'two') { add(a, P); add(L - a, P); }
        if (t === 'udl' || t === 'both') dist(0, L, w, w);
        if (t === 'tri') dist(0, L, 0, 2 * w);
        if (wsw > 0) dist(0, L, wsw, wsw);
        return pts;
    }
    function beamCalc(p) {
        const m = SM.MATS[p.mat], s = SM.section(p), L = p.L, EI = m.E * s.I, wsw = p.sw ? m.rho * 9.81 * s.A : 0;
        const loads = loadsOf(p, L, wsw), N = NG, dx = L / N, xs = [], Mc = [];
        for (let i = 0; i <= N; i++) xs.push(i * dx);
        const Ftot = loads.reduce((a, q) => a + q.F, 0), Mx0 = loads.reduce((a, q) => a + q.F * q.x, 0);
        xs.forEach((x) => { let v = 0; for (let j = 0; j < loads.length; j++) { const d = loads[j].x - x; if (d > 0) v -= loads[j].F * d; } Mc.push(v); });
        const integ = (Mf, th0) => {
            const th = [th0 || 0], y = [0];
            for (let i = 0; i < N; i++) { th.push(th[i] + ((Mf[i] + Mf[i + 1]) / 2 / EI) * dx); y.push(y[i] + ((th[i] + th[i + 1]) / 2) * dx); }
            return { th, y };
        };
        let M, V, RA, RB = 0, MA = 0, MB = 0, y, th;
        const sup = p.support;
        const shearC = (R) => xs.map((x) => { let v = 0; for (let j = 0; j < loads.length; j++) if (loads[j].x > x) v += loads[j].F; return v - R; });
        if (sup === 'cant') {
            M = Mc; V = shearC(0); RA = Ftot; MA = Mc[0]; const r = integ(M); y = r.y; th = r.th;
        } else if (sup === 'ss') {
            RB = Mx0 / L; RA = Ftot - RB;
            M = xs.map((x) => { let v = RA * x; for (let j = 0; j < loads.length; j++) { const d = x - loads[j].x; if (d > 0) v -= loads[j].F * d; } return v; });
            V = xs.map((x) => { let v = RA; for (let j = 0; j < loads.length; j++) if (loads[j].x < x) v -= loads[j].F; return v; });
            const r = integ(M, 0), t0 = -r.y[N] / L; y = r.y.map((v, i) => v + t0 * xs[i]); th = r.th.map((v) => v + t0);
        } else if (sup === 'prop') {
            const r0 = integ(Mc), r1 = integ(xs.map((x) => L - x));
            const R = -r0.y[N] / r1.y[N]; RB = R; RA = Ftot - R;
            M = xs.map((x, i) => Mc[i] + R * (L - x)); V = shearC(R); MA = M[0];
            const r = integ(M); y = r.y; th = r.th;
        } else {
            const r0 = integ(Mc), rR = integ(xs.map((x) => L - x)), rM = integ(xs.map(() => 1));
            const a11 = rR.y[N], a12 = rM.y[N], a21 = rR.th[N], a22 = rM.th[N], b1 = -r0.y[N], b2 = -r0.th[N], det = a11 * a22 - a12 * a21;
            const R = (b1 * a22 - a12 * b2) / det, Mb = (a11 * b2 - a21 * b1) / det;
            RB = R; RA = Ftot - R; MB = Mb;
            M = xs.map((x, i) => Mc[i] + R * (L - x) + Mb); V = shearC(R); MA = M[0];
            const r = integ(M); y = r.y; th = r.th;
        }
        let Mmax = 0, xM = 0, Vmax = 0, dmax = 0, xD = 0;
        for (let i = 0; i <= N; i++) {
            if (Math.abs(M[i]) > Math.abs(Mmax)) { Mmax = M[i]; xM = xs[i]; }
            if (Math.abs(V[i]) > Vmax) Vmax = Math.abs(V[i]);
            if (Math.abs(y[i]) > dmax) { dmax = Math.abs(y[i]); xD = xs[i]; }
        }
        const sig = (Math.abs(Mmax) * s.c) / s.I;
        let tau;
        tau = (s.tauK * Vmax) / s.A;
        const mu = m.rho * s.A, lam2 = { ss: 9.8696, cant: 3.516, prop: 15.418, fixed: 22.373 }[sup];
        const f1 = (lam2 / (2 * PI * L * L)) * Math.sqrt(EI / mu);
        return { m, s, L, EI, xs, M, V, y, th, RA, RB, MA, MB, Ftot, Mmax, xM, Vmax, dmax, xD, sig, tau, sfS: m.sy / Math.max(sig, 1), sfT: (0.577 * m.sy) / Math.max(tau, 1), mass: mu * L, mu, f1, wsw };
    }
    SM.beamCalc = SM.memo(beamCalc);
    const bc = SM.beamCalc;

    /* ---------------- beam part info ---------------- */
    SM.addParts({
        st_beam: SM.P(L2('Beam', 'العارضة'), L2('The colours show the bending stress σ = −M·y / I: blue = compression, red = tension, grey = neutral axis. If a colour turns dark, the material has passed its yield strength.', 'الألوان تُظهر إجهاد الانحناء σ = −M·y / I: الأزرق ضغط، الأحمر شد، الرمادي المحور المحايد. إذا اسودّ اللون فقد تجاوزت المادة حد الخضوع.'),
            L2('Structural steel, aluminium, titanium, timber or cast iron', 'فولاذ إنشائي أو ألومنيوم أو تيتانيوم أو خشب أو حديد زهر'), L2('Carries transverse loads by bending and shear.', 'تحمل الأحمال العرضية بالانحناء والقص.'),
            L2('Hot-rolled sections (IPE), extruded or machined bar', 'مقاطع مدرفلة على الساخن (IPE) أو قضبان مسحوبة أو مشغّلة'), L2('Straightness L/1000; section ±1 %', 'الاستقامة L/1000؛ المقطع ±1%'), L2('EN 10365 (IPE), EN 1993 (steel design), ISO 2394', 'EN 10365 (IPE)، EN 1993، ISO 2394'),
            L2('Check bending, shear and deflection — the weakest of the three decides the size.', 'افحص الانحناء والقص والتدلي — أضعفها يحدد المقاس.'),
            L2('Yielding at mid-span or at the fixed end; lateral-torsional buckling of slender I-beams; fatigue cracks at welds.', 'خضوع عند منتصف الباع أو عند الحامل المثبّت؛ انبعاج جانبي التوائي للعوارض النحيلة؛ شقوق إجهاد عند اللحامات.')),
        st_load: SM.P(L2('Applied load', 'الحمل المطبّق'), L2('Red arrows: a point load P and / or a distributed load w (force per metre).', 'الأسهم الحمراء: حمل نقطي P و/أو حمل موزّع w (قوة لكل متر).'),
            L2('—', '—'), L2('Creates shear force and bending moment in the beam.', 'يولّد قوة قص وعزم انحناء في العارضة.'), L2('—', '—'), L2('—', '—'), L2('EN 1991 (actions on structures)', 'EN 1991 (الأحمال على المنشآت)'), L2('Multiply by a load factor (≈ 1.35–1.5) in design.', 'يُضرب بمعامل حمل (≈ 1.35–1.5) في التصميم.'), L2('Real loads move, impact and repeat: design for the worst case.', 'الأحمال الحقيقية تتحرك وتصطدم وتتكرر: صمّم للحالة الأسوأ.')),
        st_support: SM.P(L2('Supports', 'المساند'), L2('Pin: stops movement, allows rotation. Roller: stops vertical movement only. Fixed wall: stops movement and rotation, so it also carries a moment.', 'مسند مفصلي: يمنع الحركة ويسمح بالدوران. مسند دحرجة: يمنع الحركة الرأسية فقط. جدار مثبّت: يمنع الحركة والدوران فيحمل عزماً أيضاً.'),
            L2('Concrete, steel plate, bearing pad', 'خرسانة أو صفيحة فولاذ أو وسادة إسناد'), L2('Hold the beam and provide reactions.', 'تسند العارضة وتعطي ردود الأفعال.'), L2('—', '—'), L2('—', '—'), L2('EN 1337 (structural bearings)', 'EN 1337 (المساند الإنشائية)'), L2('More restraint = stiffer and less deflection, but heavier supports and thermal stress.', 'تقييد أكثر = عارضة أصلب وتدلي أقل، لكن مساند أثقل وإجهاد حراري.'), L2('Settlement or a worn bearing changes the moment distribution.', 'هبوط المسند أو تآكل الوسادة يغيّر توزيع العزم.')),
        st_react: SM.P(L2('Reactions', 'ردود الأفعال'), L2('Green arrows: the forces the supports push back with so the beam stays in equilibrium (ΣF = 0, ΣM = 0).', 'الأسهم الخضراء: القوى التي تدفع بها المساند لتبقى العارضة متوازنة (ΣF = 0، ΣM = 0).'),
            L2('—', '—'), L2('Balance the load.', 'توازن الحمل.'), L2('—', '—'), L2('—', '—'), L2('—', '—'), L2('Statically indeterminate beams need the deflection to find the reactions.', 'العوارض غير المعيّنة سكونياً تحتاج التدلي لإيجاد ردود الأفعال.'), L2('—', '—')),
        st_na: SM.P(L2('Neutral axis', 'المحور المحايد'), L2('The yellow line: the fibres on this line neither stretch nor shorten, so the bending stress is zero here.', 'الخط الأصفر: الألياف عليه لا تستطيل ولا تقصر فينعدم إجهاد الانحناء.'),
            L2('—', '—'), L2('Separates the compressed fibres from the stretched ones.', 'يفصل الألياف المضغوطة عن الممطوطة.'), L2('—', '—'), L2('—', '—'), L2('—', '—'), L2('Material near it carries little bending stress — that is why I-beams have thin webs.', 'المادة القريبة منه تحمل إجهاداً قليلاً — ولهذا تكون جذوع العوارض I رقيقة.'), L2('—', '—'))
    });

    /* ---------------- 3D helpers ---------------- */
    const VL = 12;
    function lit(color, o) { return new THREE.MeshStandardMaterial(Object.assign({ color, metalness: 0.25, roughness: 0.55, side: THREE.DoubleSide }, o || {})); }
    SM.lit = lit;
    SM.arrowDown = (x, yTip, len, color, r) => {
        const g = new THREE.Group(), m = lit(color, { metalness: 0.1 }), rr = r || 0.07, hh = Math.min(0.5, len * 0.45);
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr, len - hh, 10), m); shaft.position.y = yTip + hh + (len - hh) / 2;
        const head = new THREE.Mesh(new THREE.ConeGeometry(rr * 2.6, hh, 12), m); head.rotation.z = PI; head.position.y = yTip + hh / 2;
        g.add(shaft, head); g.position.x = x; return g;
    };
    SM.arrowUp = (x, yTip, len, color, r) => { const g = SM.arrowDown(0, 0, len, color, r); g.rotation.z = PI; g.position.set(x, yTip, 0); return g; };
    function wall(x, hVis, dVis, side) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.7, hVis + 1.6, dVis + 1.6), lit(0x7b8794, { roughness: 0.9 })); m.position.set(x + side * 0.35, 0, 0); return m; }

    function beamMesh(c, p, xsV, defV, sc, colorFn) {
        const s = c.s, loops = s.loops, n = xsV.length, pos = [], col = [], idx = [];
        loops.forEach((lp) => {
            const P = lp.pts, m = P.length;
            for (let j = 0; j < m; j++) {
                const a = P[j], b = P[(j + 1) % m], base = pos.length / 3;
                for (let i = 0; i < n; i++) [a, b].forEach((q) => { pos.push(xsV[i], q[0] * sc + defV[i], q[1] * sc); const cc = colorFn(i, q[0]); col.push(cc[0], cc[1], cc[2]); });
                for (let i = 0; i < n - 1; i++) { const v = base + i * 2; idx.push(v, v + 1, v + 3, v, v + 3, v + 2); }
            }
        });
        const outer = loops[0].pts.map((q) => new THREE.Vector2(q[0], q[1])), holes = loops.slice(1).map((l) => l.pts.map((q) => new THREE.Vector2(q[0], q[1])));
        const tri = THREE.ShapeUtils.triangulateShape(outer, holes), all = outer.concat(...holes);
        [0, n - 1].forEach((i) => {
            const base = pos.length / 3;
            all.forEach((q) => { pos.push(xsV[i], q.x * sc + defV[i], q.y * sc); const cc = colorFn(i, q.x); col.push(cc[0], cc[1], cc[2]); });
            tri.forEach((t) => idx.push(base + t[0], base + t[1], base + t[2]));
        });
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals();
        return new THREE.Mesh(g, lit(0xffffff, { vertexColors: true, metalness: 0.1, roughness: 0.6 }));
    }
    SM.beamMesh = beamMesh;

    /* ---------------- the beam model ---------------- */
    SM.add('beam', L2('Beam bending', 'انحناء العارضة'), {
        controls: (p) => {
            const ctl = [
                { type: 'title', label: L2('Beam', 'العارضة') },
                { id: 'support', type: 'select', label: L2('Supports', 'المساند'), options: [{ v: 'ss', label: L2('Simply supported (pin + roller)', 'مرتكزة ببساطة (مفصل + دحرجة)') }, { v: 'cant', label: L2('Cantilever (fixed + free)', 'كابولي (مثبّت + حرّ)') }, { v: 'prop', label: L2('Fixed + roller (propped)', 'مثبّت + دحرجة') }, { v: 'fixed', label: L2('Fixed both ends', 'مثبّت من الطرفين') }], value: 'ss', rebuild: true },
                { id: 'L', type: 'range', label: L2('Span L', 'الباع L'), min: 0.5, max: 6, step: 0.1, value: 2, unit: 'm', rebuild: true },
                { id: 'sec', type: 'select', label: L2('Section', 'المقطع'), options: [{ v: 'rect', label: L2('Rectangle', 'مستطيل') }, { v: 'circle', label: L2('Solid round', 'دائري مصمت') }, { v: 'tube', label: L2('Round tube', 'أنبوب دائري') }, { v: 'ipe', label: L2('I-beam (IPE)', 'مقطع I (IPE)') }], value: 'rect', rebuild: true }
            ];
            const sec = p.sec || 'rect';
            if (sec === 'rect') ctl.push({ id: 'b', type: 'range', label: L2('Width b', 'العرض b'), min: 10, max: 200, step: 5, value: 50, unit: 'mm', rebuild: true }, { id: 'h', type: 'range', label: L2('Height h', 'الارتفاع h'), min: 10, max: 400, step: 5, value: 100, unit: 'mm', rebuild: true });
            if (sec === 'circle') ctl.push({ id: 'd', type: 'range', label: L2('Diameter d', 'القطر d'), min: 10, max: 300, step: 5, value: 80, unit: 'mm', rebuild: true });
            if (sec === 'tube') ctl.push({ id: 'D', type: 'range', label: L2('Outer Ø D', 'القطر الخارجي D'), min: 20, max: 300, step: 5, value: 100, unit: 'mm', rebuild: true }, { id: 't', type: 'range', label: L2('Wall t', 'السماكة t'), min: 2, max: 25, step: 1, value: 5, unit: 'mm', rebuild: true });
            if (sec === 'ipe') ctl.push({ id: 'ipe', type: 'select', label: L2('IPE size', 'مقاس IPE'), options: Object.keys(IPE).map((v) => ({ v, label: 'IPE ' + v })), value: 200, rebuild: true });
            ctl.push({ id: 'mat', type: 'select', label: L2('Material', 'المادة'), options: SM.matOptions(), value: 's235', rebuild: true });
            ctl.push({ type: 'title', label: L2('Load', 'الحمل') }, { id: 'load', type: 'select', label: L2('Load pattern', 'نمط الحمل'), options: [{ v: 'point', label: L2('One point load', 'حمل نقطي واحد') }, { v: 'udl', label: L2('Uniform load (UDL)', 'حمل موزّع منتظم') }, { v: 'both', label: L2('Point + uniform', 'نقطي + موزّع') }, { v: 'two', label: L2('Two equal point loads', 'حملان نقطيان متساويان') }, { v: 'tri', label: L2('Triangular load', 'حمل مثلثي') }], value: 'point', rebuild: true });
            const ld = p.load || 'point';
            if (ld !== 'udl' && ld !== 'tri') ctl.push({ id: 'P', type: 'range', label: L2('Point load P', 'الحمل النقطي P'), min: 0, max: 100, step: 1, value: 10, unit: 'kN', rebuild: true }, { id: 'a', type: 'range', label: L2('Position from left', 'الموضع من اليسار'), min: 5, max: 95, step: 5, value: 50, unit: '%', rebuild: true });
            if (ld !== 'point' && ld !== 'two') ctl.push({ id: 'w', type: 'range', label: ld === 'tri' ? L2('Peak intensity (right end) ÷ 2', 'الشدة العظمى ÷ 2') : L2('Distributed load w', 'الحمل الموزّع w'), min: 0, max: 60, step: 1, value: 5, unit: 'kN/m', rebuild: true });
            ctl.push({ id: 'sw', type: 'toggle', label: L2('Include self-weight', 'احتساب الوزن الذاتي'), value: false, rebuild: true }, { id: 'def', type: 'toggle', label: L2('Show deflected shape (magnified)', 'عرض الشكل المنحني (مكبّر)'), value: true, rebuild: true });
            return ctl;
        },
        build(p, api) {
            const c = bc(p), s = c.s, g = new THREE.Group(), L = p.L, sx = VL / L, N = c.xs.length - 1;
            // visual section scale (small sections would be invisible next to a 12-unit-long beam)
            const secV = (s.h / 1000) * sx, kk = Math.max(1, 0.9 / secV), sc = (sx / 1000) * kk;
            const dv = c.dmax * sx, mg = p.def ? (dv > 1e-9 ? Math.min(400, Math.max(1, 1.1 / dv)) : 1) : 0;
            const n = 90, xsV = [], defV = [], Msl = [];
            for (let i = 0; i < n; i++) { const t = i / (n - 1), gi = Math.round(t * N); xsV.push(-VL / 2 + t * VL); defV.push(c.y[gi] * sx * mg); Msl.push(c.M[gi]); }
            const colorFn = (i, ymm) => SM.colorOf((-Msl[i] * (ymm / 1000)) / c.s.I / c.m.sy);
            const mesh = beamMesh(c, p, xsV, defV, sc, colorFn); mesh.userData.id = 'st_beam'; g.add(mesh);
            const topV = (s.h / 2) * sc, defAt = (frac) => defV[Math.round(frac * (n - 1))];
            // neutral axis ribbon
            const pts = []; for (let i = 0; i < n; i++) pts.push(new THREE.Vector3(xsV[i], defV[i], ((s.shear === 'ipe' ? s.tw : s.w) / 2) * sc + 0.02));
            const na = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.025, 6, false), lit(0xfacc15, { emissive: 0x7a5d00 })); na.userData.id = 'st_na'; g.add(na);
            // loads
            const lg = new THREE.Group(); lg.userData.id = 'st_load'; const red = 0xdc2626, ld = p.load;
            const pt = (frac, F) => { if (F <= 0) return; const len = 1.2 + Math.min(1.6, F / 50); lg.add(SM.arrowDown(-VL / 2 + frac * VL, topV + defAt(frac), len, red, 0.09)); };
            if (ld === 'point' || ld === 'both') pt(p.a / 100, p.P);
            if (ld === 'two') { pt(p.a / 100, p.P); pt(1 - p.a / 100, p.P); }
            if (ld === 'udl' || ld === 'both' || ld === 'tri') {
                const q = ld === 'tri' ? 2 * p.w : p.w; if (q > 0) for (let k = 0; k <= 16; k++) { const f = k / 16, h = (ld === 'tri' ? f : 1) * (0.5 + Math.min(1, q / 40)); if (h > 0.05) lg.add(SM.arrowDown(-VL / 2 + f * VL, topV + defAt(f), h + 0.25, 0xf97316, 0.045)); }
            }
            g.add(lg);
            // supports and reactions
            const sg = new THREE.Group(); sg.userData.id = 'st_support';
            const botV = -topV;
            const pin = (x) => { const m = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.8, 4), lit(0x64748b)); m.position.set(x, botV - 0.4, 0); sg.add(m); const b = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.15, 1.5), lit(0x475569)); b.position.set(x, botV - 0.88, 0); sg.add(b); };
            const roller = (x) => { const m = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.55, 4), lit(0x64748b)); m.position.set(x, botV - 0.27 + defV[n - 1], 0); sg.add(m); const r = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 1.2, 14), lit(0x475569)); r.rotation.x = PI / 2; r.position.set(x, botV - 0.77 + defV[n - 1], 0); sg.add(r); const b = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 1.6), lit(0x475569)); b.position.set(x, botV - 1.04 + defV[n - 1], 0); sg.add(b); };
            const hV = s.h * sc, dV = s.w * sc;
            const xL = -VL / 2, xR = VL / 2;
            if (p.support === 'ss') { pin(xL); roller(xR); }
            if (p.support === 'cant') sg.add(wall(xL, hV, dV, -1));
            if (p.support === 'prop') { sg.add(wall(xL, hV, dV, -1)); roller(xR); }
            if (p.support === 'fixed') { sg.add(wall(xL, hV, dV, -1)); sg.add(wall(xR, hV, dV, 1)); }
            g.add(sg);
            const rg = new THREE.Group(); rg.userData.id = 'st_react';
            const ra = (x, F) => { if (Math.abs(F) < 1e-6) return; const len = 0.9 + Math.min(1.6, Math.abs(F) / 40000); rg.add(F > 0 ? SM.arrowUp(x, botV - 1.15 - len + (x > 0 ? defV[n - 1] : 0), len, 0x16a34a, 0.08) : SM.arrowDown(x, botV - 1.0, len, 0x16a34a, 0.08)); };
            if (p.support !== 'cant' && p.support !== 'fixed' && p.support !== 'prop') { ra(xL, c.RA); ra(xR, c.RB); } else { ra(xL - (p.support === 'ss' ? 0 : 1.2), c.RA); if (p.support !== 'cant') ra(xR + (p.support === 'fixed' ? 1.2 : 0), c.RB); }
            g.add(rg);
            g.userData.fit = { w: VL / 2 + 1.5, h: 4.2, dir: [0.35, 0.28, 1] };
            g.userData.target = [0, 0, 0];
            g.userData.cal = { kk, mg };
            return g;
        },
        readouts(p, group) {
            const c = bc(p), s = c.s, st = SM.state, kN = (v) => fmt(v / 1000, 2) + ' kN', cal = (group && group.userData.cal) || { kk: 1, mg: 1 };
            const ratio = c.dmax > 1e-9 ? p.L / c.dmax : 99999, dl = ratio < 250 ? 'bad' : ratio < 360 ? 'warn' : 'ok';
            const rows = [];
            if (p.support === 'cant') rows.push({ k: L2('Fixed-end reaction R + moment M', 'ردّ الحامل R + العزم M'), v: kN(c.RA) + ' · ' + fmt(Math.abs(c.MA) / 1000, 2) + ' kN·m' });
            else if (p.support === 'ss') rows.push({ k: L2('Reactions R_A / R_B', 'ردّا الفعل R_A / R_B'), v: kN(c.RA) + ' / ' + kN(c.RB) });
            else rows.push({ k: L2('Reactions R_A / R_B, M_A' + (p.support === 'fixed' ? ' / M_B' : ''), 'ردود الفعل R_A / R_B، M_A' + (p.support === 'fixed' ? ' / M_B' : '')), v: kN(c.RA) + ' / ' + kN(c.RB) + ' · ' + fmt(Math.abs(c.MA) / 1000, 2) + (p.support === 'fixed' ? ' / ' + fmt(Math.abs(c.MB) / 1000, 2) : '') + ' kN·m' });
            rows.push(
                { k: L2('Max bending moment (at x)', 'أكبر عزم انحناء (عند x)'), v: fmt(Math.abs(c.Mmax) / 1000, 2) + ' kN·m @ ' + fmt(c.xM, 2) + ' m' },
                { k: L2('Max shear force', 'أكبر قوة قص'), v: kN(c.Vmax) },
                { k: L2('Bending stress σ = M·c/I', 'إجهاد الانحناء σ = M·c/I'), v: fmt(c.sig / 1e6, 1) + ' MPa · SF ' + fmt(c.sfS), state: st(c.sfS) },
                { k: L2('Shear stress τ (max)', 'إجهاد القص τ (الأعظم)'), v: fmt(c.tau / 1e6, 1) + ' MPa · SF ' + fmt(c.sfT), state: st(c.sfT) },
                { k: L2('Max deflection δ (L/δ, limit L/250–360)', 'أكبر تدلي δ (L/δ، الحد L/250–360)'), v: fmt(c.dmax * 1000, 2) + ' mm · L/' + fmt(ratio, 0), state: dl },
                                                                                            );
            return rows;
        },
        bom: (p) => { const c = bc(p); return [{ id: 'st_beam', get name() { return SM.lab.parts.st_beam.name; }, qty: 1, mass: c.mass }]; },
        challenges: () => [
            SM.CH('Carry a total load of at least 30 kN with bending safety factor ≥ 2, shear safety factor ≥ 1.5 and deflection ≤ L/300.', 'احمل حملاً كلياً لا يقل عن 30 kN بمعامل أمان انحناء ≥ 2 ومعامل أمان قص ≥ 1.5 وتدلي ≤ L/300.', (p) => { const c = bc(p); return c.Ftot >= 30000 && c.sfS >= 2 && c.dmax <= p.L / 300 && c.sfT >= 1.5; }),
            SM.CH('Uniform load with fixed ends: make δ ≤ 21 % of the simply-supported deflection (a classic: 1/5).', 'حمل منتظم مع التثبيت من الطرفين: اجعل δ ≤ 21% من تدلي المرتكزة ببساطة (الكلاسيكي: 1/5).', (p) => { if (p.support !== 'fixed' || p.load !== 'udl' || p.sw) return false; const a = bc(p), b = bc(Object.assign({}, p, { support: 'ss' })); return b.dmax > 0 && a.dmax / b.dmax <= 0.21; }),
            SM.CH('IPE beam: pick the LIGHTEST IPE that still has SF ≥ 1.5 and L/δ ≥ 300 for your load.', 'عارضة IPE: اختر أخفّ IPE يحقق SF ≥ 1.5 وL/δ ≥ 300 لحملك.', (p) => {
                if (p.sec !== 'ipe') return false;
                const ok = (q) => { const c = bc(q); return c.sfS >= 1.5 && c.sfT >= 1.5 && c.dmax <= q.L / 300; };
                if (!ok(p) || bc(p).Ftot < 100) return false;
                return !Object.keys(IPE).some((k) => IPE[k].m < IPE[p.ipe].m && ok(Object.assign({}, p, { ipe: Number(k) })));
            }),
            SM.CH('Cantilever with a 5 kN tip load on a 1.5 m span: keep the tip deflection under 5 mm with a round bar ≤ Ø120.', 'كابولي بحمل 5 kN عند الطرف وباع 1.5 m: أبقِ التدلي تحت 5 mm بقضيب دائري ≤ Ø120.', (p) => p.support === 'cant' && p.sec === 'circle' && p.d <= 120 && p.load === 'point' && p.P >= 5 && p.a >= 95 && p.L >= 1.5 && bc(p).dmax <= 0.005)
        ],
        panels(p) {
            const c = bc(p), s = c.s, st = Math.max(1, Math.floor(c.xs.length / 120)), pick = (f) => { const a = []; for (let i = 0; i < c.xs.length; i += st) a.push([c.xs[i], f(i)]); if ((c.xs.length - 1) % st) a.push([c.xs[c.xs.length - 1], f(c.xs.length - 1)]); return a; };
            const xl = L2('Position x (m)', 'الموضع x (m)'), sy = c.m.sy / 1e6;
            const mi = Math.round((c.xM / p.L) * (c.xs.length - 1)), sgn = c.Mmax >= 0 ? 1 : -1, sg = (Math.abs(c.Mmax) * s.c) / s.I / 1e6, cm = (s.h / 2);
            const sec = [{ label: L2('Bending σ', 'انحناء σ'), pts: [[-sgn * sg, cm], [sgn * sg, -cm]] }];
            const t0 = SM.tauAt(s, c.Vmax, 0);
            if (t0 !== null) { const q = []; for (let k = -10; k <= 10; k++) { const y = (cm * k) / 10; q.push([SM.tauAt(s, c.Vmax, y) / 1e6, y]); } sec.push({ label: L2('Shear τ', 'قص τ'), pts: q, color: '#d97706' }); }
            return [
                { type: 'grad', title: L2('Colour = bending stress on the beam', 'اللون = إجهاد الانحناء على العارضة'), unit: 'MPa', min: -sy, max: sy, h: 44 },
                { type: 'line', h: 170, title: L2('Shear force diagram (SFD)', 'مخطط قوة القص (SFD)'), unit: 'kN', xlabel: xl, xmin: 0, xmax: p.L, ymin: -(Math.abs(c.Vmax) / 1000) * 1.15 - 0.01, ymax: (Math.abs(c.Vmax) / 1000) * 1.15 + 0.01, series: [{ label: 'V', pts: pick((i) => c.V[i] / 1000), fill: true }] },
                { type: 'line', h: 170, title: L2('Bending moment diagram (BMD)', 'مخطط عزم الانحناء (BMD)'), unit: 'kN·m', xlabel: xl, xmin: 0, xmax: p.L, series: [{ label: 'M', pts: pick((i) => c.M[i] / 1000), fill: true, color: '#d97706' }], marks: [{ x: c.xM, y: c.Mmax / 1000, label: fmt(Math.abs(c.Mmax) / 1000, 2) + ' kN·m' }] },
                { type: 'line', h: 170, title: L2('Deflection (downward +)', 'التدلي (للأسفل +)'), unit: 'mm', xlabel: xl, xmin: 0, xmax: p.L, series: [{ label: 'δ', pts: pick((i) => -c.y[i] * 1000), color: '#7c3aed', fill: true }], marks: [{ x: c.xD, y: c.dmax * 1000 * (c.y[Math.round((c.xD / p.L) * (c.xs.length - 1))] <= 0 ? 1 : -1), label: fmt(c.dmax * 1000, 2) + ' mm' }] },
                { type: 'line', h: 190, title: L2('Stress through the depth at the critical section', 'الإجهاد عبر العمق عند المقطع الحرج'), unit: 'MPa', xlabel: L2('Stress (MPa) · vertical axis = height y (mm)', 'الإجهاد (MPa) · المحور الرأسي = الارتفاع y (mm)'), series: sec }
            ];
        }
    });
})();
