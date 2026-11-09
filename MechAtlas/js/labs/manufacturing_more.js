/* Manufacturing & CNC lab — models 4..5: casting (solidification time & riser) and CNC pocket tool path. */
(function () {
    'use strict';
    const MF = window.MF, SM = window.SM, K = window.GearKit, FL = window.FL, HY = window.HY;
    if (!MF || !SM || !K || !FL || !HY || !window.THREE) return;
    const PI = Math.PI, L2 = MF.L2, fmt = MF.fmt, lit = SM.lit, CH = SM.CH, memo = SM.memo, clamp = MF.clamp, pp = MF.pp, trans = FL.trans, T2 = FL.T2;
    const NA = L2('—', '—'), box = HY.box, cylY = HY.cylY, cylX = HY.cylX;

    /* =====================================================================================
     * CASTING — Chvorinov's rule  t = B · (V/A)²   and riser check
     * ===================================================================================== */
    const CM = {
        alu: { n: L2('Aluminium', 'ألمنيوم'), B: 2.0, eps: 0.06, rho: 2.7 },
        iron: { n: L2('Cast iron', 'حديد زهر'), B: 2.5, eps: 0.01, rho: 7.2 },
        steel: { n: L2('Steel', 'فولاذ'), B: 3.0, eps: 0.03, rho: 7.85 },
        bronze: { n: L2('Bronze', 'برونز'), B: 2.2, eps: 0.055, rho: 8.8 }
    };
    const SHAPES = { cube: { V: 1, A: 6, M: 1 / 6 }, plate: { V: 0.25, A: 3, M: 1 / 12 }, rod: { V: 0.3927, A: 3.534, M: 1 / 9 } };
    const caCalc = memo((p) => {
        const m = CM[p.mat], sh = SHAPES[p.shape], s = p.s, mould = p.mould === 'metal' ? 0.15 : 1, B = m.B * mould;
        const Vc = (sh.V * s * s * s) / 1000, Mc = (sh.M * s) / 10, ts = B * Mc * Mc; // cm3, cm, min
        const Drec = (1.2 * Mc * 10) / 0.2143, Dr = Drec * p.k, Vr = (1.178 * Dr * Dr * Dr) / 1000, Mr = (0.2143 * Dr) / 10, tr = B * Mr * Mr;
        const feedNeeded = (m.eps * Vc) / 0.14, okTime = tr >= ts * 1.0, okVol = Vr >= feedNeeded;
        return { m, sh, s, B, Vc, Mc, ts, Drec, Dr, Vr, Mr, tr, feedNeeded, okTime, okVol, ok: okTime && okVol, mass: (Vc * m.rho) / 1000, yield: (Vc / (Vc + Vr)) * 100, shr: m.eps * Vc };
    });
    MF.addParts({
        ca_cast: pp('Casting', 'الصبّة', 'The part being made. The thick middle freezes last, so it needs extra liquid metal from the riser.', 'القطعة المراد صنعها. الوسط السميك يتجمد أخيراً لذا يحتاج معدناً سائلاً إضافياً من المغذّي.', 'Solidification time t = B · (V/A)².', 'زمن التجمد t = B · (V/A)².', 'Shrinkage cavity where the last liquid had no feeding.', 'تجويف انكماش حيث لم يصل المعدن السائل الأخير.'),
        ca_riser: pp('Riser (feeder)', 'المغذّي (الرايزر)', 'A reservoir of hot metal on top. It must freeze AFTER the casting so it can keep feeding it as the metal shrinks.', 'خزان من المعدن الساخن في الأعلى. يجب أن يتجمد بعد الصبّة كي يغذيها مع انكماش المعدن.', 'Rule of thumb: riser modulus ≥ 1.2 × casting modulus.', 'قاعدة عملية: معامل المغذّي ≥ 1.2 × معامل الصبّة.', 'Too small: it freezes first and the casting gets a hole.', 'صغير جداً: يتجمد أولاً فتظهر ثقوب في الصبّة.'),
        ca_mould: pp('Mould', 'القالب', 'Sand packed around a pattern (or a metal die). Sand insulates, so the metal cools slowly; a metal die cools it much faster.', 'رمل مكبوس حول نموذج (أو قالب معدني). الرمل عازل فيبرد المعدن ببطء؛ والقالب المعدني يبرّده أسرع بكثير.', 'Sets the cooling constant B.', 'يحدد ثابت التبريد B.', NA.en, NA.ar),
        ca_void: pp('Shrinkage cavity', 'تجويف الانكماش', 'A hole left where metal shrank and nothing fed it. It weakens the part.', 'ثقب ناتج عن انكماش المعدن دون تغذية. يضعف القطعة.', NA.en, NA.ar, 'Cracks start at such cavities.', 'تبدأ التشققات عند هذه التجاويف.')
    });
    MF.add('cast', L2('Casting & riser', 'السباكة والمغذّي'), {
        controls: () => [
            { id: 'shape', type: 'select', label: L2('Shape', 'الشكل'), options: [{ v: 'cube', label: L2('Cube', 'مكعب') }, { v: 'plate', label: L2('Thick plate', 'لوح سميك') }, { v: 'rod', label: L2('Long rod', 'قضيب طويل') }], value: 'cube', rebuild: true },
            { id: 's', type: 'range', label: L2('Size', 'المقاس'), min: 30, max: 300, step: 10, value: 100, unit: 'mm', rebuild: true },
            { id: 'mat', type: 'select', label: L2('Metal', 'المعدن'), options: Object.keys(CM).map((k) => ({ v: k, label: CM[k].n })), value: 'alu', rebuild: true },
            { id: 'k', type: 'range', label: L2('Riser size (1 = recommended)', 'حجم المغذّي (1 = الموصى به)'), min: 0.4, max: 1.6, step: 0.05, value: 1, unit: '×', rebuild: true },
            { id: 'mould', type: 'select', label: L2('Mould', 'القالب'), options: [{ v: 'sand', label: L2('Sand (slow cooling)', 'رمل (تبريد بطيء)') }, { v: 'metal', label: L2('Metal die (fast cooling)', 'قالب معدني (تبريد سريع)') }], value: 'sand', rebuild: true }
        ],
        build(p) {
            const c = caCalc(p), g = new THREE.Group(), sh = p.shape;
            const wx = sh === 'rod' ? 2 : 1, wy = sh === 'plate' ? 0.25 : sh === 'rod' ? 0.5 : 1, wz = sh === 'rod' ? 0.5 : 1; // multiples of s
            const Hc = wy * p.s, totH = Hc + 1.5 * c.Dr, totW = Math.max(wx * p.s, c.Dr) * 1.5, sc = 3.6 / Math.max(totH, totW * 0.8), cx = wx * p.s * sc, cy = Hc * sc, cz = wz * p.s * sc;
            g.add(box(9, 0.2, 5, 0x64748b, 0, -0.1, 0));
            const pad = 0.5, mh = cy + 0.6;
            const mould = box(cx + 2 * pad + 0.6, mh + 0.5, cz + 2 * pad + 0.6, p.mould === 'sand' ? 0xd6b98c : 0x475569, 0, mh / 2 - 0.25, 0, 'ca_mould'); mould.material = trans(p.mould === 'sand' ? 0xd6b98c : 0x64748b, 0.3); g.add(mould);
            const base = box(cx + 2 * pad + 0.8, 0.12, cz + 2 * pad + 0.8, p.mould === 'sand' ? 0xa8895a : 0x334155, 0, 0.06, 0); g.add(base);
            const hotMat = () => lit(0xff6a1a, { emissive: 0xff3a00, emissiveIntensity: 1, metalness: 0.2, roughness: 0.5 });
            const cast = sh === 'rod' ? cylX(cy / 2, cx, 0xff6a1a, 0, cy / 2 + 0.12, 0, 'ca_cast') : box(cx, cy, cz, 0xff6a1a, 0, cy / 2 + 0.12, 0, 'ca_cast'); cast.material = hotMat(); g.add(cast);
            const rd = Math.max(0.15, c.Dr * sc), rh = 1.5 * rd; const riser = cylY(rd / 2, rh, 0xff6a1a, 0, cy + 0.12 + rh / 2, 0, 'ca_riser'); riser.material = hotMat(); g.add(riser);
            const voidM = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), lit(0x0f172a)); voidM.userData.id = 'ca_void'; voidM.scale.setScalar(0.001); voidM.position.set(0, cy + 0.12 - Math.min(cy * 0.25, 0.4), 0); g.add(voidM);
            const vr = clamp(Math.cbrt(c.shr / Math.max(c.Vc, 1)) * Math.min(cx, cy) * 0.5, 0.1, 0.5);
            const tEnd = Math.max(c.ts, c.tr) * 1.1; let ph = 0; const per = 10;
            const col = (mesh, f) => { const u = clamp(f, 0, 1), r = 1 - 0.6 * u, gg = 0.42 + 0.03 * u, b = 0.1 + 0.4 * u; mesh.material.color.setRGB(r, gg, b); mesh.material.emissive.setRGB(1 * (1 - u), 0.23 * (1 - u), 0); };
            g.userData.update = (dt) => {
                ph = (ph + dt / per) % 1.1; const t = Math.min(1, ph / 1.0) * tEnd;
                col(cast, t / c.ts); col(riser, t / c.tr);
                const show = !c.ok && c.tr < c.ts && t > c.tr; voidM.scale.setScalar(show ? Math.max(0.001, vr * clamp((t - c.tr) / (c.ts - c.tr + 1e-9), 0, 1)) : 0.001);
            };
            g.userData.fit = { w: 2.5, h: 2.0, dir: [0.2, 0.4, 1] }; g.userData.target = [0, 1.5, 0];
            return g;
        },
        readouts(p) {
            const c = caCalc(p);
            return [
                { k: L2('Casting solidification time', 'زمن تجمد الصبّة'), v: fmt(c.ts, 1) + ' min' },
                { k: L2('Riser solidification time', 'زمن تجمد المغذّي'), v: fmt(c.tr, 1) + ' min' },
                { k: L2('Does the riser do its job?', 'هل يؤدي المغذّي عمله؟'), v: c.ok ? T2('Yes — it freezes last', 'نعم — يتجمد أخيراً') : !c.okTime ? T2('No — it freezes too early: shrinkage hole', 'لا — يتجمد مبكراً: ثقب انكماش') : T2('No — too little liquid metal to feed', 'لا — معدن سائل غير كافٍ للتغذية'), state: c.ok ? 'ok' : 'bad' },
                { k: L2('Casting weight', 'وزن الصبّة'), v: fmt(c.mass, 1) + ' kg' },
                { k: L2('Yield (casting / metal poured)', 'المردود (الصبّة / المعدن المصبوب)'), v: fmt(c.yield, 0) + ' %', state: c.yield < 40 ? 'warn' : '' },
                { k: L2('Recommended riser diameter', 'قطر المغذّي الموصى به'), v: fmt(c.Drec, 0) + ' mm' },
                { k: L2('Casting modulus  V / A', 'معامل الصبّة  V / A'), v: fmt(c.Mc * 10, 1) + ' mm' },
                { k: L2('Metal shrinkage to feed', 'انكماش المعدن المطلوب تغذيته'), v: fmt(c.shr, 0) + ' cm³' },
                { k: L2('Mould constant B used (typical textbook value; real foundries must calibrate it)', 'ثابت القالب B المستعمل (قيمة نموذجية من الكتب؛ تُعاير في المسبك الفعلي)'), v: fmt(c.B, 2) + ' min/cm²' }
            ];
        },
        bom: () => [],
        challenges: () => [
            CH('Make a shrinkage hole appear: shrink the riser until it freezes before the casting.', 'اجعل ثقب انكماش يظهر: صغّر المغذّي حتى يتجمد قبل الصبّة.', (p) => !caCalc(p).okTime),
            CH('Cast at least 20 kg with a working riser and a yield of 55 % or more.', 'اسبك 20 kg على الأقل بمغذٍّ سليم ومردود 55% أو أكثر.', (p) => { const c = caCalc(p); return c.mass >= 20 && c.ok && c.yield >= 55; }),
            CH('Solidify a 100 mm aluminium cube in under 1 minute (use the metal die).', 'جمّد مكعب ألمنيوم 100 mm في أقل من دقيقة (استعمل القالب المعدني).', (p) => { const c = caCalc(p); return p.shape === 'cube' && p.mat === 'alu' && p.s >= 100 && c.ts < 1; })
        ],
        panels(p) {
            const c = caCalc(p), a = [], b = [];
            for (let s = 30; s <= 300; s += 10) { a.push([s, caCalc(Object.assign({}, p, { s, mould: 'sand' })).ts]); b.push([s, caCalc(Object.assign({}, p, { s, mould: 'metal' })).ts]); }
            return [{ type: 'line', h: 190, title: L2('Solidification time vs size', 'زمن التجمد مقابل المقاس'), unit: 'min', xlabel: L2('Size (mm)', 'المقاس (mm)'), xmin: 30, xmax: 300, ymin: 0, series: [{ label: L2('Sand mould', 'قالب رملي'), pts: a, color: '#d97706' }, { label: L2('Metal die', 'قالب معدني'), pts: b, color: '#0284c7' }], marks: [{ x: p.s, y: c.ts, label: fmt(c.ts, 1) }] }];
        }
    });

    /* =====================================================================================
     * CNC POCKET TOOL PATH
     * ===================================================================================== */
    const cnCalc = memo((p) => {
        const d = p.d, so = p.so / 100, pts = [];
        if (p.shape === 'rect') {
            const w = Math.max(0, p.W - d), h = Math.max(0, p.H - d), nl = h <= 0 ? 1 : Math.ceil(h / (so * d)) + 1, st = nl > 1 ? h / (nl - 1) : 0;
            for (let i = 0; i < nl; i++) { const z = -h / 2 + i * st, a = i % 2 === 0 ? -w / 2 : w / 2, b = -a; pts.push([a, z], [b, z]); }
        } else {
            const rmax = Math.max(0, (p.W - d) / 2), rings = []; for (let r = rmax; r > so * d * 0.4; r -= so * d) rings.push(r); if (!rings.length) rings.push(0); else if (rings[rings.length - 1] > d / 2 + 1e-9) rings.push(Math.max(0, rings[rings.length - 1] - so * d));   // last ring must overlap the centre: no uncut island
            rings.forEach((r, k) => { const n = Math.max(8, Math.round(r * 1.2) + 8); for (let i = 0; i <= n; i++) { const a = (i / n) * 2 * PI; pts.push([Math.cos(a) * r, Math.sin(a) * r]); } });
        }
        const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
        const len = cum[cum.length - 1], np = Math.ceil(p.Z / p.ap), apEff = p.Z / np;
        /* finishing contour round the four walls (rectangle only; the circle's first ring already is the wall), at full depth */
        const wr = Math.max(0, p.W - d), hr = Math.max(0, p.H - d), lfin = p.shape === 'rect' && wr > 0 && hr > 0 ? 2 * (wr + hr) : 0;
        const tcut = (len * np + lfin) / p.vf, CLR = 1, tplunge = (p.Z + np * CLR) / (p.vf / 3);
        /* rapid / retract moves (machine rapid rate assumed 10 m/min): retract to 5 mm above the top, return to the start (between passes), go down to CLR above the last depth */
        const RAPID = 10000, dxy = pts.length > 1 ? Math.hypot(pts[pts.length - 1][0] - pts[0][0], pts[pts.length - 1][1] - pts[0][1]) : 0;
        let rapidLen = (np - 1) * dxy; for (let k = 0; k < np; k++) rapidLen += 5 + (p.Z * (k + 1)) / np + (5 - CLR) + (p.Z * k) / np;
        const trapid = rapidLen / RAPID, time = tcut + tplunge + trapid;
        /* visible finishing contour: starts where the last row ends and goes once round the four walls (same length lfin) */
        let finPts = [];
        if (lfin > 0) { const ex = pts[pts.length - 1][0], ey = pts[pts.length - 1][1]; finPts = [[ex, ey], [ex, -ey], [-ex, -ey], [-ex, ey], [ex, ey]]; }
        const fz = p.vf / (p.n * 2), fzLo = 0.0025 * d, fzHi = 0.01 * d, area = p.shape === 'rect' ? p.W * p.H : (PI * p.W * p.W) / 4, vol = (area * p.Z) / 1000;
        return { pts, finPts, cum, len, np, apEff, lfin, rapidLen, trapid, tplunge, time, tcut, fz, fzLo, fzHi, fzOk: fz >= fzLo && fz <= fzHi, MRR: (p.vf * so * d * apEff) / 1000, vol, Vc: (PI * d * p.n) / 1000, deep: p.ap > d, ap: apEff };
    });
    MF.addParts({
        cn_tool: pp('End mill', 'سكين التفريز الطرفي', 'The rotating cutter that moves along the tool path. Its centre follows the line you see; its diameter decides how wide each pass is.', 'القاطع الدوّار الذي يتحرك على مسار الأداة. مركزه يتبع الخط الذي تراه؛ وقطره يحدد عرض كل مرور.', 'Removes metal at spindle speed n and feed vf.', 'يزيل المعدن بسرعة مغزل n وتغذية vf.', 'Too deep a cut bends and snaps small cutters.', 'قطع عميق جداً يثني القواطع الصغيرة ويكسرها.'),
        cn_path: pp('Tool path', 'مسار الأداة', 'The line the centre of the tool follows (red = depth passes, orange = finishing pass round the walls, rectangle only). The CNC reads it as G-code moves (G1 X.. Y.. F..).', 'الخط الذي يتبعه مركز الأداة (أحمر = مرورات العمق، برتقالي = مرور التشطيب حول الجدران للمستطيل فقط). تقرؤه آلة CNC كحركات G-code (‏G1 X.. Y.. F..).', 'Shorter path = shorter time.', 'مسار أقصر = زمن أقصر.', NA.en, NA.ar),
        cn_work: pp('Workpiece', 'قطعة الشغل', 'The block being machined. The dark area is the pocket removed so far.', 'القطعة قيد التشغيل. المنطقة الداكنة هي الجيب المزال حتى الآن.', NA.en, NA.ar, NA.en, NA.ar)
    });
    MF.add('cnc', L2('CNC pocket tool path', 'مسار أداة CNC (جيب)'), {
        controls: (cur) => [
            { id: 'shape', type: 'select', label: L2('Pocket shape', 'شكل الجيب'), options: [{ v: 'rect', label: L2('Rectangle', 'مستطيل') }, { v: 'circ', label: L2('Circle', 'دائرة') }], value: 'rect', rebuild: true },
            { id: 'W', type: 'range', label: (cur.shape || 'rect') === 'rect' ? L2('Pocket length', 'طول الجيب') : L2('Pocket diameter', 'قطر الجيب'), min: 20, max: 120, step: 5, value: 60, unit: 'mm', rebuild: true }
        ].concat((cur.shape || 'rect') === 'rect' ? [{ id: 'H', type: 'range', label: L2('Pocket width', 'عرض الجيب'), min: 20, max: 80, step: 5, value: 40, unit: 'mm', rebuild: true }] : []).concat([
            { id: 'Z', type: 'range', label: L2('Pocket depth', 'عمق الجيب'), min: 1, max: 30, step: 1, value: 10, unit: 'mm', rebuild: true },
            { id: 'd', type: 'range', label: L2('Tool diameter', 'قطر الأداة'), min: 3, max: 20, step: 1, value: 10, unit: 'mm', rebuild: true },
            { id: 'vf', type: 'range', label: L2('Feed rate', 'سرعة التغذية'), min: 100, max: 3000, step: 50, value: 800, unit: 'mm/min', rebuild: true },
            { id: 'n', type: 'range', label: L2('Spindle speed', 'سرعة المغزل'), min: 1000, max: 12000, step: 500, value: 6000, unit: 'rpm', rebuild: true },
            { id: 'ap', type: 'range', label: L2('Depth per pass', 'العمق لكل مرور'), min: 0.5, max: 10, step: 0.5, value: 4, unit: 'mm', rebuild: true },
            { id: 'so', type: 'range', label: L2('Step-over (share of tool diameter)', 'التراكب الجانبي (نسبة من قطر الأداة)'), min: 20, max: 90, step: 5, value: 50, unit: '%', rebuild: true }
        ]),
        build(p) {
            const c = cnCalc(p), g = new THREE.Group(), sc = 0.032, bh = 0.8, Wv = (p.shape === 'rect' ? p.W : p.W) * sc, Hv = (p.shape === 'rect' ? p.H : p.W) * sc, depthVis = clamp((p.Z / 30) * 0.6, 0.1, 0.6);
            g.add(box(Wv + 1.6, 0.25, Hv + 1.6, 0x475569, 0, -0.125, 0));
            g.add(box(Wv + 1.1, bh, Hv + 1.1, 0x94a3b8, 0, bh / 2, 0, 'cn_work'));
            const pocket = p.shape === 'rect' ? box(Wv, 1, Hv, 0x0f172a, 0, bh, 0) : new THREE.Mesh(new THREE.CylinderGeometry(Wv / 2, Wv / 2, 1, 40), lit(0x0f172a)); pocket.userData.id = 'cn_work'; g.add(pocket);
            const toolR = Math.max(0.06, (p.d / 2) * sc), tool = new THREE.Group(); const body = cylY(toolR, 0.9, 0xfacc15, 0, 0.45, 0, 'cn_tool'); tool.add(body); tool.add(cylY(Math.max(toolR, 0.12), 0.8, 0x334155, 0, 1.3, 0)); g.add(tool);
            const N = c.pts.length, geo = new THREE.BufferGeometry(), arr = new Float32Array(N * 3); c.pts.forEach((q, i) => { arr[i * 3] = q[0] * sc; arr[i * 3 + 1] = 0; arr[i * 3 + 2] = q[1] * sc; });
            geo.setAttribute('position', new THREE.BufferAttribute(arr, 3)); geo.setDrawRange(0, 2);
            const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xef4444 })); line.userData.id = 'cn_path'; g.add(line);
            /* finishing contour (orange) — drawn once, run by the tool after the last depth pass */
            let finLine = null, finLen = 0; const FP = c.finPts;
            if (FP.length > 1) {
                const fa = new Float32Array(FP.length * 3); FP.forEach((q, i) => { fa[i * 3] = q[0] * sc; fa[i * 3 + 1] = bh + 0.05; fa[i * 3 + 2] = q[1] * sc; if (i) finLen += Math.hypot(q[0] - FP[i - 1][0], q[1] - FP[i - 1][1]); });
                const fg = new THREE.BufferGeometry(); fg.setAttribute('position', new THREE.BufferAttribute(fa, 3)); fg.setDrawRange(0, 0);
                finLine = new THREE.Line(fg, new THREE.LineBasicMaterial({ color: 0xf97316 })); finLine.userData.id = 'cn_path'; g.add(finLine);
            }
            const posAt = (s, out) => { const L = c.cum; let i = 1; while (i < L.length - 1 && L[i] < s) i++; const a = c.pts[i - 1], b = c.pts[i], u = L[i] > L[i - 1] ? (s - L[i - 1]) / (L[i] - L[i - 1]) : 0; out[0] = (a[0] + (b[0] - a[0]) * clamp(u, 0, 1)) * sc; out[1] = (a[1] + (b[1] - a[1]) * clamp(u, 0, 1)) * sc; return i; };
            const tp = clamp(((c.len / p.vf) * 60) / 12, 2.5, 7); let t = 0; const tf = finLen > 0 ? clamp(tp * (c.lfin / c.len), 0.8, 6) : 0, tot = tp * c.np + tf + 0.8, o = [0, 0];
            g.userData.update = (dt) => {
                t = (t + dt) % tot;
                if (finLine && t >= tp * c.np && t < tp * c.np + tf) {   // finishing phase: full depth, walking round the walls
                    const uf = (t - tp * c.np) / tf, sf = uf * finLen; let acc = 0, i = 1; while (i < FP.length - 1 && acc + Math.hypot(FP[i][0] - FP[i - 1][0], FP[i][1] - FP[i - 1][1]) < sf) { acc += Math.hypot(FP[i][0] - FP[i - 1][0], FP[i][1] - FP[i - 1][1]); i++; }
                    const a = FP[i - 1], b = FP[i], sl = Math.hypot(b[0] - a[0], b[1] - a[1]), q = sl > 0 ? clamp((sf - acc) / sl, 0, 1) : 0;
                    tool.position.set((a[0] + (b[0] - a[0]) * q) * sc, bh - depthVis, (a[1] + (b[1] - a[1]) * q) * sc);
                    finLine.geometry.setDrawRange(0, Math.min(FP.length, i + 1)); pocket.scale.y = depthVis; pocket.position.y = bh - depthVis / 2 + 0.002; tool.rotation.y += dt * 12; return;
                }
                if (finLine) finLine.geometry.setDrawRange(0, t >= tp * c.np + tf ? FP.length : 0);
                const k = Math.min(c.np - 1, Math.floor(t / tp)), u = clamp((t - k * tp) / tp, 0, 1), s = u * c.len;
                const done = (k + (t >= tp * c.np ? 1 : u * 0.0)) / c.np, depthNow = depthVis * clamp(((k + 1) / c.np), 0, 1);
                const idx = posAt(s, o); const ty = bh - depthNow + 0.0; tool.position.set(o[0], ty, o[1]);
                for (let i = 0; i < N; i++) arr[i * 3 + 1] = bh + 0.03; geo.attributes.position.needsUpdate = true; geo.setDrawRange(0, Math.max(2, Math.min(N, idx + 1)));
                const hh = Math.max(0.02, depthVis * (k / c.np) + depthNow * 0 + (depthVis / c.np) * u); pocket.scale.y = hh; pocket.position.y = bh - hh / 2 + 0.002; void done;
                tool.rotation.y += dt * 12;
            };
            g.userData.fit = { w: Math.max(2.6, Wv / 2 + 1.2), h: Math.max(1.8, Hv / 2 + 0.9), dir: [0.0, 1.0, 0.75] }; g.userData.target = [0, 0.4, 0];
            return g;
        },
        readouts(p) {
            const c = cnCalc(p), mins = (v) => { const m = Math.floor(v), s = Math.round((v - m) * 60); return m + ' min ' + s + ' s'; };
            return [
                { k: L2('Machining time (cutting + finishing pass + plunges + rapid moves)', 'زمن التشغيل (قطع + مرور تشطيب + غطس + حركات سريعة)'), v: mins(c.time) },
                { k: L2('of which rapid / retract moves (assumes a 10 m/min rapid rate)', 'منها حركات سريعة/سحب (بافتراض سرعة سريعة 10 m/min)'), v: fmt(c.trapid * 60, 1) + ' s' },
                { k: L2('Finishing pass round the walls (rectangle only; removes wall cusps)', 'مرور تشطيب حول الجدران (للمستطيل فقط؛ يزيل نتوءات الجدران)'), v: fmt(c.lfin, 0) + ' mm' },
                { k: L2('Number of depth passes', 'عدد مرورات العمق'), v: String(c.np) },
                { k: L2('Tool path length per pass', 'طول مسار الأداة في المرور الواحد'), v: fmt(c.len, 0) + ' mm' },
                { k: L2('Chip load per tooth (2-flute; typical range 0.25–1 % of Ø, depends on material)', 'سماكة الرايش لكل سن (سنّان؛ المدى النموذجي 0.25–1% من القطر ويتغير بحسب المادة)'), v: fmt(c.fz, 3) + ' mm', state: c.fzOk ? 'ok' : 'warn' },
                { k: L2('Is the chip load OK?', 'هل سماكة الرايش مناسبة؟'), v: c.fzOk ? T2('Yes', 'نعم') : c.fz < c.fzLo ? T2('Too low — the tool rubs; raise the feed', 'منخفضة — الأداة تحتك؛ ارفع التغذية') : T2('Too high — the tool may break; lower the feed', 'عالية — قد تنكسر الأداة؛ خفّض التغذية'), state: c.fzOk ? 'ok' : 'warn' },
                { k: L2('Material removed per minute', 'المادة المزالة كل دقيقة'), v: fmt(c.MRR, 1) + ' cm³/min' },
                { k: L2('Volume removed in total', 'الحجم الكلي المزال'), v: fmt(c.vol, 1) + ' cm³' },
                { k: L2('Depth per pass vs tool diameter', 'العمق لكل مرور مقابل قطر الأداة'), v: c.deep ? T2('Deeper than the tool Ø — risky', 'أعمق من قطر الأداة — خطِر') : T2('OK', 'مقبول'), state: c.deep ? 'warn' : 'ok' },
                { k: L2('Cutting speed at the tool edge', 'سرعة القطع عند حافة الأداة'), v: fmt(c.Vc, 0) + ' m/min' }
            ];
        },
        bom: () => [],
        challenges: () => [
            CH('Machine a pocket of at least 60 × 40 × 10 mm in under 1 minute with a good chip load.', 'أنجز جيباً لا يقل عن 60 × 40 × 10 mm في أقل من دقيقة مع سماكة رايش جيدة.', (p) => { const c = cnCalc(p); return p.shape === 'rect' && p.W >= 60 && p.H >= 40 && p.Z >= 10 && c.time < 1 && c.fzOk; }),
            CH('Remove at least 20 cm³/min with the depth per pass not more than the tool diameter, and a good chip load.', 'أزل 20 cm³/min على الأقل مع عمق مرور لا يزيد عن قطر الأداة وسماكة رايش جيدة.', (p) => { const c = cnCalc(p); return c.MRR >= 20 && !c.deep && c.fzOk; }),
            CH('Make the tool path of an 80 × 50 pocket shorter than 400 mm per pass.', 'اجعل مسار الأداة لجيب 80 × 50 أقصر من 400 mm في المرور الواحد.', (p) => { const c = cnCalc(p); return p.shape === 'rect' && p.W >= 80 && p.H >= 50 && c.len < 400; })
        ],
        panels(p) {
            const c = cnCalc(p), a = [], b = [];
            for (let so = 20; so <= 90; so += 5) { const q = cnCalc(Object.assign({}, p, { so })); a.push([so, q.time]); }
            for (let d = 3; d <= 20; d += 1) { const q = cnCalc(Object.assign({}, p, { d })); b.push([d, q.time]); }
            return [
                { type: 'line', h: 170, title: L2('Time vs step-over', 'الزمن مقابل التراكب الجانبي'), unit: 'min', xlabel: L2('Step-over (%)', 'التراكب (%)'), xmin: 20, xmax: 90, ymin: 0, series: [{ label: 't', pts: a, fill: true }], marks: [{ x: p.so, y: c.time, label: fmt(c.time, 1) }] },
                { type: 'line', h: 170, title: L2('Time vs tool diameter', 'الزمن مقابل قطر الأداة'), unit: 'min', xlabel: L2('Tool diameter (mm)', 'قطر الأداة (mm)'), xmin: 3, xmax: 20, ymin: 0, series: [{ label: 't', pts: b, fill: true }], marks: [{ x: p.d, y: c.time, label: fmt(c.time, 1) }] }
            ];
        }
    });
})();

/* =========================================================================================
 * G-CODE SIMULATOR (educational) — parser + motion/time model + height-map material removal.
 * Supported subset only: G0 G1 G2 G3 (IJ or R, helical Z allowed) G4 G17 G20 G21 G90 G91 G94
 * (G40 G49 G54 G80 accepted and ignored; G54 = program zero, no work offset is applied; G55-G59 are errors), M3 M4 M5 M2 M30 (M0 M1 M6 M8 M9 accepted and ignored),
 * N, F, S, T words, ( ) and ; comments. Everything else is reported as an error with its line number.
 * It never talks to a machine and never evaluates the text as code.
 * ========================================================================================= */
(function () {
    'use strict';
    const MF = window.MF, SM = window.SM, K = window.GearKit, FL = window.FL, HY = window.HY;
    if (!MF || !SM || !K || !FL || !HY || !window.THREE) return;
    const PI = Math.PI, L2 = MF.L2, fmt = MF.fmt, lit = SM.lit, CH = SM.CH, memo = SM.memo, clamp = MF.clamp, pp = MF.pp, T2 = FL.T2;
    const NA = L2('—', '—'), box = HY.box, cylY = HY.cylY;

    const LIM = { chars: 120000, lines: 8000, moves: 8000, pts: 150000, coord: 100000, arcTol: 0.01, maxSeg: 720 };
    const MSG = {
        too_long: ['The program is longer than {0} characters; the rest was ignored.', 'البرنامج أطول من {0} حرفاً؛ تم تجاهل الباقي.'],
        too_many_lines: ['More than {0} lines; the rest was ignored.', 'أكثر من {0} سطراً؛ تم تجاهل الباقي.'],
        too_many_moves: ['Too many motion blocks (limit {0}); the rest was ignored.', 'حركات كثيرة جداً (الحد {0})؛ تم تجاهل الباقي.'],
        bad_text: ['Cannot read "{0}".', 'تعذّرت قراءة "{0}".'],
        bad_comment: ['Unbalanced parenthesis in a comment.', 'قوس غير متوازن في تعليق.'],
        dup_word: ['Word {0} appears twice in one block.', 'الحرف {0} مكرر في السطر نفسه.'],
        too_big: ['Value of {0} is out of range.', 'قيمة {0} خارج المدى.'],
        g_unsup: ['G{0} is not supported by this simulator.', 'الأمر G{0} غير مدعوم في هذا المحاكي.'],
        m_unsup: ['M{0} is not supported by this simulator.', 'الأمر M{0} غير مدعوم في هذا المحاكي.'],
        word_unsup: ['Word {0} is not supported.', 'الحرف {0} غير مدعوم.'],
        two_motion: ['Two motion commands (G0–G3) in one block.', 'أمرا حركة (G0–G3) في سطر واحد.'],
        no_motion: ['Axis move without a motion mode: start with G0 or G1.', 'حركة محاور دون نمط حركة: ابدأ بـ G0 أو G1.'],
        no_feed: ['Cutting move without a feed rate (F).', 'حركة قطع دون سرعة تغذية (F).'],
        bad_feed: ['Feed rate must be greater than zero.', 'يجب أن تكون سرعة التغذية أكبر من الصفر.'],
        arc_noctr: ['Arc needs I/J (centre) or R.', 'القوس يحتاج I/J (المركز) أو R.'],
        arc_both: ['Arc gives both R and I/J; use only one.', 'القوس يعطي R و I/J معاً؛ استعمل أحدهما فقط.'],
        arc_radius: ['Arc start and end are not the same distance from the centre (differ by {0} mm).', 'بداية القوس ونهايته ليستا على البعد نفسه من المركز (الفرق {0} mm).'],
        arc_r_small: ['Arc radius R={0} is too small for the chord {1} mm.', 'نصف القطر R={0} صغير جداً بالنسبة للوتر {1} mm.'],
        arc_r_full: ['A full circle cannot be given with R; use I/J.', 'لا يمكن إعطاء دائرة كاملة بـ R؛ استعمل I/J.'],
        arc_zero: ['Arc radius is zero.', 'نصف قطر القوس صفر.'],
        arc_plane: ['Arcs need X/Y (plane G17) — only G17 is supported.', 'الأقواس تحتاج X/Y (المستوى G17) — المدعوم G17 فقط.'],
        dwell: ['G4 needs a time P (seconds), 0 to 1000.', 'الأمر G4 يحتاج زمناً P (بالثواني) بين 0 و1000.'],
        spindle_off: ['Cutting move with the spindle stopped (no M3/M4 and S).', 'قطع والمغزل متوقف (لا M3/M4 مع S).'],
        spindle_s: ['M3/M4 with spindle speed S = 0.', 'M3/M4 مع سرعة مغزل S = 0.'],
        below_bottom: ['The tool goes below the stock bottom (Z = {0}) — it would hit the fixture.', 'الأداة تنزل تحت قاع الخام (Z = {0}) — ستصطدم بالمثبّت.'],
        rapid_crash: ['Rapid move (G0) goes into material at Z = {0}.', 'حركة سريعة (G0) تدخل المادة عند Z = {0}.'],
        start_pos: ['Simulator assumes the tool starts at X0 Y0 Z{0}.', 'يفترض المحاكي أن الأداة تبدأ عند X0 Y0 Z{0}.'],
        no_end: ['No M30/M2 at the end (allowed, but good practice).', 'لا يوجد M30/M2 في النهاية (مسموح لكن يُفضّل).'],
        empty: ['The program has no motion.', 'البرنامج لا يحتوي أي حركة.'],
        sim_trunc: ['Material-removal simulation stopped early (too many operations).', 'توقفت محاكاة إزالة المادة مبكراً (عمليات كثيرة جداً).'],
        deep_cut: ['Cut deeper than the tool diameter at line {0}.', 'قطع أعمق من قطر الأداة في السطر {0}.']
    };
    const fmtMsg = (m) => {
        const t = MSG[m.code] || [m.code, m.code], tpl = (window.getLang && window.getLang() === 'ar') ? t[1] : t[0];
        return tpl.replace(/\{(\d)\}/g, (a, i) => (m.args && m.args[+i] !== undefined ? m.args[+i] : ''));
    };

    /* ---------------------------------------- parser ---------------------------------------- */
    function parse(text, opts) {
        opts = opts || {};
        const startZ = opts.startZ === undefined ? 25 : opts.startZ, rapidRate = opts.rapid > 0 ? opts.rapid : 10000, bottom = opts.bottomZ === undefined ? -Infinity : opts.bottomZ;
        const errors = [], warns = [], moves = [];
        const err = (line, code, ...args) => { if (errors.length < 50) errors.push({ line, code, args }); };
        const warn = (line, code, ...args) => { if (warns.length < 200) warns.push({ line, code, args }); };
        let src = String(text === undefined || text === null ? '' : text);
        if (src.length > LIM.chars) { err(0, 'too_long', LIM.chars); src = src.slice(0, LIM.chars); }
        let lines = src.split(/\r\n|\r|\n/);
        if (lines.length > LIM.lines) { err(0, 'too_many_lines', LIM.lines); lines = lines.slice(0, LIM.lines); }
        const st = { x: 0, y: 0, z: startZ, mode: null, unit: 1, abs: true, F: 0, S: 0, spin: false, ended: false };
        const stat = { time: 0, tFeed: 0, tRapid: 0, tDwell: 0, lenFeed: 0, lenRapid: 0, nPts: 0, ended: false, maxF: 0, minZ: Infinity, lines: 0, gLines: 0, blocks: 0 };
        let nPtsTotal = 0, stopped = false;
        for (let li = 0; li < lines.length && !stopped; li++) {
            const ln = li + 1; let s = lines[li];
            s = s.replace(/\([^()]*\)/g, ' ');
            if (/[()]/.test(s)) { err(ln, 'bad_comment'); s = s.replace(/[()]/g, ' '); }
            const k = s.indexOf(';'); if (k >= 0) s = s.slice(0, k);
            s = s.toUpperCase().trim();
            if (!s || s === '%') continue;
            stat.lines++;
            s = s.replace(/^N\s*\d+\s*/, '');
            const words = [], re = /([A-Z])\s*([+-]?(?:\d+\.?\d*|\.\d+))/g; let m, used = s;
            while ((m = re.exec(s))) words.push([m[1], parseFloat(m[2]), m[2]]);
            used = s.replace(re, '').replace(/\s+/g, '');
            if (used) { err(ln, 'bad_text', used.slice(0, 20)); continue; }
            if (!words.length) continue;
            stat.gLines++;
            const val = {}, gs = [], ms = []; let bad = false;
            for (const [w, v] of words) {
                if (!isFinite(v) || Math.abs(v) > LIM.coord) { err(ln, 'too_big', w); bad = true; break; }
                if (w === 'G') gs.push(v);
                else if (w === 'M') ms.push(v);
                else { if (val[w] !== undefined) { err(ln, 'dup_word', w); bad = true; break; } val[w] = v; }
            }
            if (bad) continue;
            for (const w of Object.keys(val)) if ('XYZIJRFSPTHDLN'.indexOf(w) < 0) { err(ln, 'word_unsup', w); bad = true; }
            if (bad) continue;
            // G and M words (non-motion first, motion applied after modal updates)
            let motion = null, dwell = false, lineBad = false;
            for (const g of gs) {
                const gi = Math.round(g * 10) / 10;
                if (gi === 0 || gi === 1 || gi === 2 || gi === 3) { if (motion !== null) { err(ln, 'two_motion'); lineBad = true; } motion = gi; }
                else if (gi === 4) dwell = true;
                else if (gi === 17) { /* XY plane: default */ }
                else if (gi === 20) st.unit = 25.4;
                else if (gi === 21) st.unit = 1;
                else if (gi === 90) st.abs = true;
                else if (gi === 91) st.abs = false;
                else if (gi === 94 || gi === 40 || gi === 49 || gi === 80 || gi === 54) { /* accepted, no effect (G54 = program zero, no work offset is applied) */ }
                else { err(ln, 'g_unsup', String(g)); lineBad = true; }
            }
            for (const mm of ms) {
                if (mm === 3 || mm === 4) st.spin = true;
                else if (mm === 5) st.spin = false;
                else if (mm === 2 || mm === 30) { st.ended = true; }
                else if (mm === 0 || mm === 1 || mm === 6 || mm === 8 || mm === 9) { /* accepted, no effect */ }
                else { err(ln, 'm_unsup', String(mm)); lineBad = true; }
            }
            if (val.S !== undefined) { st.S = val.S; }
            if (val.F !== undefined) { if (val.F <= 0) { err(ln, 'bad_feed'); lineBad = true; } else st.F = val.F * st.unit; }
            if (ms.some((q) => q === 3 || q === 4) && st.S <= 0) warn(ln, 'spindle_s');
            if (lineBad) continue;
            if (dwell) {
                const P = val.P !== undefined ? val.P : val.X;
                if (P === undefined || P < 0 || P > 1000) { err(ln, 'dwell'); continue; }
                stat.tDwell += P; stat.time += P; if (motion === null) continue;
            }
            if (motion !== null) st.mode = motion;
            const hasAxis = val.X !== undefined || val.Y !== undefined || val.Z !== undefined;
            if (!hasAxis) { if (motion !== null && (st.mode === 2 || st.mode === 3) && (val.I !== undefined || val.J !== undefined || val.R !== undefined)) { /* full circle at current point */ } else { if (st.ended) { stat.ended = true; break; } continue; } }
            if (st.mode === null) { err(ln, 'no_motion'); continue; }
            if (stat.blocks >= LIM.moves) { err(ln, 'too_many_moves', LIM.moves); stopped = true; break; }
            const u = st.unit, nx = val.X === undefined ? st.x : (st.abs ? val.X * u : st.x + val.X * u), ny = val.Y === undefined ? st.y : (st.abs ? val.Y * u : st.y + val.Y * u), nz = val.Z === undefined ? st.z : (st.abs ? val.Z * u : st.z + val.Z * u);
            if (Math.abs(nx) > LIM.coord || Math.abs(ny) > LIM.coord || Math.abs(nz) > LIM.coord) { err(ln, 'too_big', 'XYZ'); continue; }
            const rapid = st.mode === 0;
            if (!rapid && !(st.F > 0)) { err(ln, 'no_feed'); continue; }
            let pts, len, F = rapid ? rapidRate : st.F;
            if (st.mode === 0 || st.mode === 1) {
                pts = [[st.x, st.y, st.z], [nx, ny, nz]]; len = Math.hypot(nx - st.x, ny - st.y, nz - st.z);
            } else {
                const cw = st.mode === 2, hasIJ = val.I !== undefined || val.J !== undefined, hasR = val.R !== undefined;
                if (!hasIJ && !hasR) { err(ln, 'arc_noctr'); continue; }
                if (hasIJ && hasR) { err(ln, 'arc_both'); continue; }
                let cx, cy; const x0 = st.x, y0 = st.y, chord = Math.hypot(nx - x0, ny - y0);
                if (hasIJ) { cx = x0 + (val.I || 0) * u; cy = y0 + (val.J || 0) * u; }
                else {
                    const R = val.R * u;
                    if (chord < 1e-9) { err(ln, 'arc_r_full'); continue; }
                    if (chord > 2 * Math.abs(R) + 1e-6) { err(ln, 'arc_r_small', fmt(val.R, 3), fmt(chord / u, 3)); continue; }
                    const h = Math.sqrt(Math.max(0, R * R - (chord / 2) * (chord / 2))), dx = (nx - x0) / chord, dy = (ny - y0) / chord, sg = (cw ? -1 : 1) * (R > 0 ? 1 : -1);
                    cx = (x0 + nx) / 2 + sg * (-dy) * h; cy = (y0 + ny) / 2 + sg * dx * h;
                }
                const r0 = Math.hypot(x0 - cx, y0 - cy), r1 = Math.hypot(nx - cx, ny - cy);
                if (r0 < 1e-6) { err(ln, 'arc_zero'); continue; }
                if (hasIJ && Math.abs(r0 - r1) > Math.max(0.01, 0.005 * r0)) { err(ln, 'arc_radius', fmt(Math.abs(r0 - r1), 3)); continue; }
                const a0 = Math.atan2(y0 - cy, x0 - cx), a1 = Math.atan2(ny - cy, nx - cx);
                let sw;
                if (chord < 1e-9) sw = cw ? -2 * PI : 2 * PI;
                else { sw = a1 - a0; if (cw) { while (sw >= -1e-12) sw -= 2 * PI; } else { while (sw <= 1e-12) sw += 2 * PI; } }
                const r = (r0 + r1) / 2, nseg = clamp(Math.ceil(Math.abs(sw) / (2 * Math.acos(Math.max(0, 1 - Math.min(LIM.arcTol, r) / r)) || 1)), 1, LIM.maxSeg);
                pts = []; for (let i = 0; i <= nseg; i++) { const f = i / nseg, a = a0 + sw * f, rr = r0 + (r1 - r0) * f; pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a), st.z + (nz - st.z) * f]); }
                pts[nseg] = [nx, ny, nz];
                len = Math.hypot(r * Math.abs(sw), nz - st.z);
            }
            nPtsTotal += pts.length;
            if (nPtsTotal > LIM.pts) { err(ln, 'too_many_moves', LIM.moves); stopped = true; break; }
            const t = (len / F) * 60;
            moves.push({ kind: rapid ? 'rapid' : 'feed', pts, len, F, line: ln, t, t0: stat.time, arc: st.mode > 1, S: st.S, spin: st.spin });
            stat.blocks++; stat.time += t;
            if (rapid) { stat.tRapid += t; stat.lenRapid += len; } else { stat.tFeed += t; stat.lenFeed += len; stat.maxF = Math.max(stat.maxF, F); if (!st.spin) warn(ln, 'spindle_off'); }
            stat.minZ = Math.min(stat.minZ, nz, st.z);
            if (nz < bottom - 1e-9 && !rapid) warn(ln, 'below_bottom', fmt(nz / 1, 2));
            st.x = nx; st.y = ny; st.z = nz;
            if (st.ended) { stat.ended = true; break; }
        }
        if (stat.ended === false && st.ended) stat.ended = true;
        if (!moves.length && !errors.length) warn(0, 'empty');
        if (moves.length && !stat.ended) warn(0, 'no_end');
        stat.S = st.S; stat.end = [st.x, st.y, st.z];
        return { moves, errors, warns, stat, startZ };
    }

    /* ------------------------------- material-removal height map ------------------------------- */
    function simulate(moves, stock, tool, o) {
        o = o || {};
        const SX = stock.SX, SY = stock.SY, T = stock.T, r = tool.d / 2, cell0 = o.cell || Math.max(0.5, Math.max(SX, SY) / 120);
        const nx = Math.max(1, Math.round(SX / cell0)), ny = Math.max(1, Math.round(SY / cell0)), dx = SX / nx, dy = SY / ny, h = new Float32Array(nx * ny), step = Math.min(dx, dy);
        const budget = o.budget || 30e6, r2 = r * r;
        let removed = 0, ops = 0, trunc = false; const crashes = [], crashLines = {};
        const stamp = (x, y, z, cut) => {
            const zc = Math.max(z, -T); if (zc >= 0) return false;
            const iy0 = Math.max(0, Math.floor((y - r) / dy) - 1), iy1 = Math.min(ny - 1, Math.ceil((y + r) / dy) + 1);
            let hit = false;
            for (let iy = iy0; iy <= iy1; iy++) {
                const cy = (iy + 0.5) * dy - y, w2 = r2 - cy * cy; if (w2 < 0) continue;
                const w = Math.sqrt(w2), ix0 = Math.max(0, Math.ceil((x - w) / dx - 0.5)), ix1 = Math.min(nx - 1, Math.floor((x + w) / dx - 0.5));
                ops += ix1 - ix0 + 2; if (ops > budget) { trunc = true; return false; }
                for (let ix = ix0; ix <= ix1; ix++) {
                    const k = ix + iy * nx;
                    if (h[k] > zc + 1e-6) { hit = true; if (cut) { removed += (h[k] - zc) * dx * dy; h[k] = zc; } else return true; }
                }
            }
            return hit;
        };
        for (const mv of moves) {
            if (trunc) break;
            const rapid = mv.kind === 'rapid';
            for (let i = 0; i < mv.pts.length - 1 && !trunc; i++) {
                const a = mv.pts[i], b = mv.pts[i + 1], dist = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]), n = Math.max(1, Math.ceil(dist / step));
                if (rapid && Math.min(a[2], b[2]) >= 0) continue;
                for (let j = (i === 0 ? 0 : 1); j <= n && !trunc; j++) {
                    const f = j / n, x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f, z = a[2] + (b[2] - a[2]) * f;
                    if (rapid) { if (stamp(x, y, z, false) && !crashLines[mv.line]) { crashLines[mv.line] = 1; if (crashes.length < 10) crashes.push({ line: mv.line, z: z }); } }
                    else stamp(x, y, z, true);
                }
            }
        }
        return { nx, ny, dx, dy, h, removed, trunc, crashes, ops };
    }
    function compare(sim, stock, target, d) {
        const { nx, ny, dx, dy, h } = sim, A = dx * dy; let Vt = 0, residual = 0, overcut = 0;
        for (let iy = 0; iy < ny; iy++) for (let ix = 0; ix < nx; ix++) {
            const cx = (ix + 0.5) * dx, cy = (iy + 0.5) * dy, inside = target.round ? ((cx - target.cx) * (cx - target.cx) + (cy - target.cy) * (cy - target.cy) < target.R * target.R) : (cx >= target.x0 && cx < target.x1 && cy >= target.y0 && cy < target.y1), tz = inside ? -target.depth : 0, hh = h[ix + iy * nx];
            if (inside) Vt += target.depth * A;
            if (hh > tz + 1e-6) residual += (hh - tz) * A; else if (hh < tz - 1e-6) overcut += (tz - hh) * A;
        }
        const r = d / 2, w = target.x1 - target.x0, hgt = target.y1 - target.y0, corner = (w >= d && hgt >= d && !target.round) ? 4 * (1 - PI / 4) * r * r * target.depth : 0;
        return { Vt, residual, overcut, resPct: Vt > 0 ? (residual / Vt) * 100 : 0, overPct: Vt > 0 ? (overcut / Vt) * 100 : 0, corner, cornerPct: Vt > 0 ? (corner / Vt) * 100 : 0 };
    }

    /* ------------------------------- program generators ------------------------------- */
    const f3 = (v) => { const s = (Math.round(v * 1000) / 1000).toFixed(3).replace(/\.?0+$/, ''); return s === '-0' || s === '' ? '0' : s; };
    function genRect(q) {
        const d = q.d, so = q.so / 100, cx = q.px + q.pw / 2, cy = q.py + q.ph / 2, w = Math.max(0, q.pw - d), h = Math.max(0, q.ph - d), nl = h <= 0 ? 1 : Math.ceil(h / (so * d)) + 1, st = nl > 1 ? h / (nl - 1) : 0, np = Math.ceil(q.pd / q.ap), zs = 5;
        const out = ['(Rectangular pocket ' + f3(q.pw) + ' x ' + f3(q.ph) + ' x ' + f3(q.pd) + ', tool D' + f3(d) + ')', 'G21 G90 G17 G94', 'M3 S' + Math.round(q.n), 'G0 Z' + zs];
        const a0 = -w / 2, y0 = cy - h / 2;
        for (let k = 0; k < np; k++) {
            const zk = -(q.pd * (k + 1)) / np, zp = -(q.pd * k) / np;
            out.push('(pass ' + (k + 1) + ' of ' + np + ')', 'G0 X' + f3(cx + a0) + ' Y' + f3(y0), 'G0 Z' + f3(Math.min(zs, zp + 1)), 'G1 Z' + f3(zk) + ' F' + f3(q.vf / 3));
            for (let i = 0; i < nl; i++) {
                const b = i % 2 === 0 ? w / 2 : -w / 2;
                out.push('G1 X' + f3(cx + b) + (i === 0 && k === 0 ? ' F' + f3(q.vf) : (i === 0 ? ' F' + f3(q.vf) : '')));
                if (i < nl - 1) out.push('G1 Y' + f3(y0 + (i + 1) * st));
            }
            if (k === np - 1 && w > 0 && h > 0) {   // finishing pass round the walls at full depth (removes the wall cusps left by the rows)
                const bl = nl % 2 === 1 ? w / 2 : -w / 2;
                out.push('(finishing contour)', 'G1 Y' + f3(y0), 'G1 X' + f3(cx - bl), 'G1 Y' + f3(y0 + h), 'G1 X' + f3(cx + bl));
            }
            out.push('G0 Z' + zs);
        }
        out.push('M5', 'M30'); return out.join('\n');
    }
    function genCirc(q) {
        const d = q.d, so = q.so / 100, cx = q.px + q.pw / 2, cy = q.py + q.ph / 2, D = Math.min(q.pw, q.ph), rmax = Math.max(0, (D - d) / 2), rings = [], np = Math.ceil(q.pd / q.ap), zs = 5;
        for (let r = rmax; r > so * d * 0.4; r -= so * d) rings.push(r);
        if (!rings.length) rings.push(0); else if (rings[rings.length - 1] > d / 2 + 1e-9) rings.push(Math.max(0, rings[rings.length - 1] - so * d));
        const out = ['(Circular pocket D' + f3(D) + ' x ' + f3(q.pd) + ', tool D' + f3(d) + ', arcs G3)', 'G21 G90 G17 G94', 'M3 S' + Math.round(q.n), 'G0 Z' + zs];
        for (let k = 0; k < np; k++) {
            const zk = -(q.pd * (k + 1)) / np, zp = -(q.pd * k) / np;
            out.push('(pass ' + (k + 1) + ' of ' + np + ')', 'G0 X' + f3(cx + rings[0]) + ' Y' + f3(cy), 'G0 Z' + f3(Math.min(zs, zp + 1)), 'G1 Z' + f3(zk) + ' F' + f3(q.vf / 3));
            rings.forEach((r, i) => { out.push('G1 X' + f3(cx + r) + (i === 0 ? ' F' + f3(q.vf) : '')); if (r > 1e-9) out.push('G3 X' + f3(cx + r) + ' Y' + f3(cy) + ' I' + f3(-r) + ' J0'); });
            out.push('G0 Z' + zs);
        }
        out.push('M5', 'M30'); return out.join('\n');
    }
    function genContour(q) {
        const d = q.d, cx = q.px + q.pw / 2, cy = q.py + q.ph / 2, w = Math.max(0, q.pw - d), h = Math.max(0, q.ph - d), rc = Math.max(0.5, Math.min(8, w / 2 - 0.01, h / 2 - 0.01)), np = Math.ceil(q.pd / q.ap), zs = 5;
        const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2;
        const out = ['(Groove along a rounded rectangle, corner R' + f3(rc) + ', arcs G3)', 'G21 G90 G17 G94', 'M3 S' + Math.round(q.n), 'G0 Z' + zs];
        for (let k = 0; k < np; k++) {
            const zk = -(q.pd * (k + 1)) / np;
            out.push('G0 X' + f3(x0 + rc) + ' Y' + f3(y0), 'G0 Z1', 'G1 Z' + f3(zk) + ' F' + f3(q.vf / 3),
                'G1 X' + f3(x1 - rc) + ' F' + f3(q.vf), 'G3 X' + f3(x1) + ' Y' + f3(y0 + rc) + ' R' + f3(rc),
                'G1 Y' + f3(y1 - rc), 'G3 X' + f3(x1 - rc) + ' Y' + f3(y1) + ' R' + f3(rc),
                'G1 X' + f3(x0 + rc), 'G3 X' + f3(x0) + ' Y' + f3(y1 - rc) + ' R' + f3(rc),
                'G1 Y' + f3(y0 + rc), 'G3 X' + f3(x0 + rc) + ' Y' + f3(y0) + ' R' + f3(rc), 'G0 Z' + zs);
        }
        out.push('M5', 'M30'); return out.join('\n');
    }
    const FAULTY = '(Faulty example - find the mistakes)\nG21 G90\nG1 X10 Y10\nG0 X20 Y20 Z-5\nG77 X0\nG2 X30 Y10 R2\nM3\nG1 X50 F300\nG1 Z-3\nM30';

    MF.gcode = { parse, simulate, compare, genRect, genCirc, genContour, FAULTY, LIM, MSG, fmtMsg };

    /* ------------------------------------ model ------------------------------------ */
    const DEF = { src: 'rect', SX: 100, SY: 80, T: 20, px: 20, py: 20, pw: 60, ph: 40, pd: 10, d: 10, zf: 2, vf: 800, n: 6000, ap: 4, so: 50, rapid: 10000, cmp: true };
    const progFor = (p) => {
        const src = p.src || 'rect';
        if (src === 'custom') return String(p.prog === undefined || p.prog === null ? '' : p.prog);
        const q = { px: p.px, py: p.py, pw: p.pw, ph: p.ph, pd: p.pd, d: p.d, vf: p.vf, n: p.n, ap: p.ap, so: p.so };
        return (src === 'circ' ? genCirc : src === 'cont' ? genContour : genRect)(q);
    };
    const gcCalc = memo((p) => {
        const prog = progFor(p), SX = p.SX, SY = p.SY, T = p.T;
        const par = parse(prog, { startZ: 25, rapid: p.rapid, bottomZ: -T });
        const sim = simulate(par.moves, { SX, SY, T }, { d: p.d });
        const warns = par.warns.slice();
        sim.crashes.forEach((q) => warns.push({ line: q.line, code: 'rapid_crash', args: [fmt(q.z, 1)] }));
        if (sim.trunc) warns.push({ line: 0, code: 'sim_trunc', args: [] });
        const src = p.src || 'rect'; let cmp = null, target = null;
        if (p.cmp) {
            const x0 = clamp(p.px, 0, SX), y0 = clamp(p.py, 0, SY), x1 = clamp(p.px + p.pw, 0, SX), y1 = clamp(p.py + p.ph, 0, SY), depth = Math.min(p.pd, T);
            target = src === 'circ' ? { round: true, cx: p.px + p.pw / 2, cy: p.py + p.ph / 2, R: Math.min(p.pw, p.ph) / 2, depth, x0, y0, x1, y1 } : { x0, y0, x1, y1, depth };
            cmp = compare(sim, { SX, SY, T }, target, p.d);
        }
        const st = par.stat, vol = sim.removed / 1000, Fmean = st.tFeed > 0 ? (st.lenFeed / st.tFeed) * 60 : 0, fz = st.S > 0 && Fmean > 0 ? Fmean / (st.S * p.zf) : 0, d = p.d;
        const fzLo = 0.0025 * d, fzHi = 0.01 * d;
        return { prog, par, sim, warns, cmp, target, time: st.time, vol, MRR: st.tFeed > 0 ? vol / (st.tFeed / 60) : 0, Fmean, fz, fzLo, fzHi, fzOk: fz >= fzLo && fz <= fzHi, Vc: st.S > 0 ? (PI * d * st.S) / 1000 : 0, errors: par.errors, ok: par.errors.length === 0 && st.blocks > 0 };
    });
    const mmss = (s) => { const m = Math.floor(s / 60), r = s - m * 60; return m > 0 ? m + ' min ' + fmt(r, 0) + ' s' : fmt(r, 1) + ' s'; };

    MF.addParts({
        g_tool: pp('End mill', 'سكين التفريز', 'The cutter. It follows the programmed X Y Z points, stepping through the program line by line (animation speed is compressed).', 'القاطع. يتبع نقاط X Y Z المبرمجة سطراً بعد سطر (سرعة العرض مضغوطة).', 'A flat end mill removes material under its whole diameter.', 'السكين المسطح يزيل المادة تحت كامل قطره.', 'The simulator cuts with a flat end mill only.', 'المحاكي يقطع بسكين مسطح فقط.'),
        g_path: pp('Programmed path', 'المسار المبرمج', 'Red = feed moves (G1, G2, G3). Blue = rapid moves (G0).', 'الأحمر = حركات التغذية (G1 وG2 وG3). الأزرق = الحركات السريعة (G0).', 'A rapid move must never go into material.', 'يجب ألا تدخل الحركة السريعة في المادة أبداً.', NA.en, NA.ar),
        g_stock: pp('Stock (height map)', 'الخام (خريطة ارتفاعات)', 'The block after the program has run. Dark = deeper. Surface is a grid of heights, so walls look slightly sloped.', 'القطعة بعد تنفيذ البرنامج. الأغمق = أعمق. السطح شبكة ارتفاعات لذا تبدو الجدران مائلة قليلاً.', 'Z = 0 is the top face of the stock.', 'Z = 0 هو الوجه العلوي للخام.', 'Educational estimate: volumes depend on the grid size (about ±3 %).', 'تقدير تعليمي: الحجوم تتأثر بدقة الشبكة (نحو ±3%).')
    });
    MF.add('gcode', L2('G-code simulator', 'محاكي G-code'), {
        controls: (cur) => {
            const T = cur.T || DEF.T, SXm = cur.SX || DEF.SX;
            return [
                { type: 'note', label: L2('Educational simulator for a SUBSET of G-code: G0 G1 G2 G3 G4 G17 G20 G21 G90 G91 G94 (G54 = program zero; other work offsets G55-G59 are NOT supported), M3 M4 M5 M30, F S N and comments. Flat end mill, no tool compensation (G41/G42) or canned cycles. The tool is assumed to start at X0 Y0 Z25. Do NOT send these programs to a real machine.', 'محاكٍ تعليمي لمجموعة جزئية من G-code: ‏G0 G1 G2 G3 G4 G17 G20 G21 G90 G91 G94 (G54 = صفر البرنامج؛ إزاحات الشغل G55–G59 غير مدعومة) و M3 M4 M5 M30 وF وS وN والتعليقات. سكين مسطح، بلا تعويض أداة (G41/G42) أو دورات جاهزة. يُفترض أن الأداة تبدأ عند X0 Y0 Z25. لا ترسل هذه البرامج إلى آلة حقيقية.') },
                { id: 'src', type: 'select', label: L2('Program source', 'مصدر البرنامج'), options: [{ v: 'rect', label: L2('Generated: rectangular pocket', 'مُولَّد: جيب مستطيل') }, { v: 'circ', label: L2('Generated: circular pocket (arcs)', 'مُولَّد: جيب دائري (أقواس)') }, { v: 'cont', label: L2('Generated: rounded groove (arcs)', 'مُولَّد: مجرى بزوايا مدورة (أقواس)') }, { v: 'custom', label: L2('My own program (edit below)', 'برنامجي الخاص (عدّل أدناه)') }], value: DEF.src, rebuild: true },
                { id: 'prog', type: 'textarea', rows: 12, maxlength: LIM.chars, label: L2('G-code program (edit, then click outside the box)', 'برنامج G-code (عدّل ثم انقر خارج الصندوق)'), value: progFor(DEF), rebuild: true, onEdit: (p) => { p.src = 'custom'; } },
                { id: 'ld_bad', type: 'button', label: L2('Load the faulty example (find the mistakes)', 'حمّل المثال المعيب (اكتشف الأخطاء)'), run: (p) => { p.src = 'custom'; p.prog = FAULTY; } },
                { id: 'pw', type: 'range', label: L2('Pocket length (X)', 'طول الجيب (X)'), min: 10, max: 180, step: 5, value: DEF.pw, unit: 'mm', rebuild: true },
                { id: 'ph', type: 'range', label: L2('Pocket width (Y)', 'عرض الجيب (Y)'), min: 10, max: 140, step: 5, value: DEF.ph, unit: 'mm', rebuild: true },
                { type: 'title', label: L2('Pocket position and depth', 'موضع الجيب وعمقه') },
                { id: 'px', type: 'range', label: L2('Pocket X start', 'بداية الجيب X'), min: 0, max: 180, step: 5, value: DEF.px, unit: 'mm', rebuild: true },
                { id: 'py', type: 'range', label: L2('Pocket Y start', 'بداية الجيب Y'), min: 0, max: 140, step: 5, value: DEF.py, unit: 'mm', rebuild: true },
                { id: 'pd', type: 'range', label: L2('Pocket depth', 'عمق الجيب'), min: 1, max: 30, step: 1, value: DEF.pd, unit: 'mm', rebuild: true },
                { type: 'title', label: L2('Cutting data used by the generated programs', 'بيانات القطع في البرامج المولَّدة') },
                { id: 'd', type: 'range', label: L2('Tool diameter', 'قطر الأداة'), min: 3, max: 20, step: 1, value: DEF.d, unit: 'mm', rebuild: true },
                { id: 'vf', type: 'range', label: L2('Feed rate', 'سرعة التغذية'), min: 100, max: 3000, step: 50, value: DEF.vf, unit: 'mm/min', rebuild: true },
                { id: 'n', type: 'range', label: L2('Spindle speed S', 'سرعة المغزل S'), min: 1000, max: 12000, step: 500, value: DEF.n, unit: 'rpm', rebuild: true },
                { id: 'ap', type: 'range', label: L2('Depth per pass', 'العمق لكل مرور'), min: 1, max: 10, step: 0.5, value: DEF.ap, unit: 'mm', rebuild: true },
                { id: 'so', type: 'range', label: L2('Step-over (share of tool diameter)', 'التراكب الجانبي (نسبة من قطر الأداة)'), min: 30, max: 90, step: 5, value: DEF.so, unit: '%', rebuild: true },
                { type: 'title', label: L2('Stock and machine', 'الخام والآلة') },
                { id: 'SX', type: 'range', label: L2('Stock length (X)', 'طول الخام (X)'), min: 30, max: 200, step: 10, value: DEF.SX, unit: 'mm', rebuild: true },
                { id: 'SY', type: 'range', label: L2('Stock width (Y)', 'عرض الخام (Y)'), min: 30, max: 150, step: 10, value: DEF.SY, unit: 'mm', rebuild: true },
                { id: 'T', type: 'range', label: L2('Stock thickness', 'سماكة الخام'), min: 5, max: 40, step: 5, value: DEF.T, unit: 'mm', rebuild: true },
                { id: 'zf', type: 'select', label: L2('Number of flutes (for chip load)', 'عدد الأسنان (لسماكة الرايش)'), options: [{ v: 1, label: L2('1', '1') }, { v: 2, label: L2('2', '2') }, { v: 3, label: L2('3', '3') }, { v: 4, label: L2('4', '4') }], value: DEF.zf, rebuild: true },
                { id: 'rapid', type: 'range', label: L2('Machine rapid rate (G0) — machine dependent', 'سرعة الحركة السريعة G0 — تختلف بين الآلات'), min: 2000, max: 30000, step: 1000, value: DEF.rapid, unit: 'mm/min', rebuild: true },
                { id: 'cmp', type: 'toggle', label: L2('Compare with the target pocket (position/size/depth above)', 'قارن بالجيب المطلوب (الموضع/الحجم/العمق أعلاه)'), value: DEF.cmp, rebuild: true }
            ];
        },
        build(p) {
            if ((p.src || 'rect') !== 'custom') p.prog = progFor(p);
            const c = gcCalc(p), g = new THREE.Group(), sc = 0.032, SX = p.SX, SY = p.SY, T = p.T, Hs = T * sc, sim = c.sim;
            const X = (x) => (x - SX / 2) * sc, Z = (y) => -(y - SY / 2) * sc, Y = (z) => Hs + z * sc;
            g.add(box(SX * sc + 1.2, 0.25, SY * sc + 1.2, 0x475569, 0, -0.125, 0));
            g.add(box(SX * sc, Math.max(0.01, Hs - 0.006), SY * sc, 0x64748b, 0, (Hs - 0.006) / 2, 0));
            const nx = sim.nx, ny = sim.ny, pos = new Float32Array(nx * ny * 3), col = new Float32Array(nx * ny * 3), top = new THREE.Color(0xcbd5e1), deep = new THREE.Color(0x1e293b), cc = new THREE.Color();
            for (let iy = 0; iy < ny; iy++) for (let ix = 0; ix < nx; ix++) {
                const k = ix + iy * nx, x = ix === 0 ? 0 : ix === nx - 1 ? SX : (ix + 0.5) * sim.dx, y = iy === 0 ? 0 : iy === ny - 1 ? SY : (iy + 0.5) * sim.dy, hh = sim.h[k];
                pos[k * 3] = X(x); pos[k * 3 + 1] = Y(hh) + 0.002; pos[k * 3 + 2] = Z(y);
                cc.copy(top).lerp(deep, clamp(-hh / T, 0, 1)); col[k * 3] = cc.r; col[k * 3 + 1] = cc.g; col[k * 3 + 2] = cc.b;
            }
            const idx = []; for (let iy = 0; iy < ny - 1; iy++) for (let ix = 0; ix < nx - 1; ix++) { const a = ix + iy * nx, b = a + 1, d = a + nx, e = d + 1; idx.push(a, d, b, b, d, e); }
            const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); geo.setIndex(idx); geo.computeVertexNormals();
            const surf = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0.35, side: THREE.DoubleSide })); surf.userData.id = 'g_stock'; g.add(surf);
            // path lines: feed (red) and rapid (blue)
            const segs = [], cols = []; const cf = new THREE.Color(0xef4444), cr = new THREE.Color(0x38bdf8);
            c.par.moves.forEach((mv) => { const cl = mv.kind === 'rapid' ? cr : cf; for (let i = 0; i < mv.pts.length - 1; i++) { const a = mv.pts[i], b = mv.pts[i + 1]; segs.push(X(a[0]), Y(a[2]) + 0.012, Z(a[1]), X(b[0]), Y(b[2]) + 0.012, Z(b[1])); cols.push(cl.r, cl.g, cl.b, cl.r, cl.g, cl.b); } });
            if (segs.length) { const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(segs), 3)); lg.setAttribute('color', new THREE.BufferAttribute(new Float32Array(cols), 3)); const ln = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ vertexColors: true })); ln.userData.id = 'g_path'; g.add(ln); }
            const toolR = Math.max(0.06, (p.d / 2) * sc), tool = new THREE.Group(); tool.add(cylY(toolR, 0.9, 0xfacc15, 0, 0.45, 0, 'g_tool')); tool.add(cylY(Math.max(toolR, 0.12), 0.8, 0x334155, 0, 1.3, 0)); g.add(tool);
            const mv = c.par.moves, total = Math.max(c.par.stat.time, 1e-6), loop = clamp(total / 6, 6, 18); let t = 0;
            const place = (pt) => {
                let x = 0, y = 0, z = c.par.startZ;
                if (mv.length) {
                    let lo = 0, hi = mv.length - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (mv[mid].t0 <= pt) lo = mid; else hi = mid - 1; }
                    const m = mv[lo], u = m.t > 0 ? clamp((pt - m.t0) / m.t, 0, 1) : 1, f = u * (m.pts.length - 1), i = Math.min(m.pts.length - 2, Math.floor(f)), a = m.pts[i], b = m.pts[i + 1], q = f - i;
                    if (pt < mv[0].t0) { x = 0; y = 0; z = c.par.startZ; } else { x = a[0] + (b[0] - a[0]) * q; y = a[1] + (b[1] - a[1]) * q; z = a[2] + (b[2] - a[2]) * q; }
                }
                tool.position.set(X(x), Y(z), Z(y));
            };
            place(0);
            g.userData.update = (dt) => { t = (t + dt) % loop; place((t / loop) * total); tool.rotation.y += dt * 12; };
            g.userData.fit = { w: Math.max(2.6, (SX * sc) / 2 + 1.0), h: Math.max(1.8, (SY * sc) / 2 + 0.9), dir: [0.0, 1.0, 0.75] }; g.userData.target = [0, Hs / 2, 0];
            return g;
        },
        readouts(p) {
            const c = gcCalc(p), st = c.par.stat, rows = [], e = c.errors, w = c.warns;
            rows.push({ k: L2('Program check', 'فحص البرنامج'), v: e.length ? e.length + ' ' + T2('error(s) — fix them first', 'خطأ — صحّحها أولاً') : (st.blocks ? T2('No errors', 'لا أخطاء') : T2('No motion in the program', 'لا حركة في البرنامج')), state: e.length ? 'bad' : st.blocks ? 'ok' : 'warn' });
            e.slice(0, 3).forEach((q) => rows.push({ k: L2(q.line ? 'Line ' + q.line : 'Program', q.line ? 'السطر ' + q.line : 'البرنامج'), v: MF.gcode.fmtMsg(q), state: 'bad' }));
            rows.push({ k: L2('Estimated run time (feed + rapid + dwell)', 'زمن التنفيذ المقدّر (تغذية + سريع + توقف)'), v: mmss(c.time) });
            rows.push({ k: L2('Cutting time', 'زمن القطع'), v: mmss(st.tFeed) });
            rows.push({ k: L2('Material removed (grid estimate ±3 %)', 'المادة المزالة (تقدير الشبكة ±3%)'), v: fmt(c.vol, 1) + ' cm³' });
            rows.push({ k: L2('Average removal rate while cutting', 'متوسط معدل الإزالة أثناء القطع'), v: fmt(c.MRR, 1) + ' cm³/min' });
            if (c.cmp) {
                const m = c.cmp, okRes = m.resPct <= m.cornerPct + 1.5, okOver = m.overPct <= 1;
                rows.push({ k: L2('Target left uncut (tool corner radius explains ' + fmt(m.cornerPct, 1) + ' %)', 'المتبقي من الجيب المطلوب دون قطع (نصف قطر زاوية الأداة يفسّر ' + fmt(m.cornerPct, 1) + '%)'), v: fmt(m.resPct, 1) + ' %', state: okRes ? 'ok' : 'warn' });
                rows.push({ k: L2('Overcut (outside the target or too deep)', 'قطع زائد (خارج المطلوب أو أعمق منه)'), v: fmt(m.overPct, 1) + ' %', state: okOver ? 'ok' : 'warn' });
            }
            rows.push({ k: L2('Feed moves / rapid moves', 'حركات التغذية / السريعة'), v: c.par.moves.filter((q) => q.kind === 'feed').length + ' / ' + c.par.moves.filter((q) => q.kind === 'rapid').length });
            rows.push({ k: L2('Feed path / rapid path length', 'طول مسار التغذية / السريع'), v: fmt(st.lenFeed, 0) + ' / ' + fmt(st.lenRapid, 0) + ' mm' });
            if (c.Vc > 0) rows.push({ k: L2('Chip load per tooth at the mean feed (typical 0.25–1 % of Ø)', 'سماكة الرايش لكل سن عند متوسط التغذية (النموذجي 0.25–1% من القطر)'), v: fmt(c.fz, 3) + ' mm', state: c.fzOk ? 'ok' : 'warn' });
            rows.push({ k: L2('Warnings', 'تحذيرات'), v: w.length ? String(w.length) : T2('None', 'لا شيء'), state: w.length ? 'warn' : 'ok' });
            w.slice(0, 3).forEach((q) => rows.push({ k: L2(q.line ? 'Line ' + q.line : 'Program', q.line ? 'السطر ' + q.line : 'البرنامج'), v: MF.gcode.fmtMsg(q), state: 'warn' }));
            return rows;
        },
        bom: () => [],
        challenges: () => [
            CH('Run the pocket program with no errors and no warnings, removing the target without overcut, in under 75 seconds.', 'نفّذ برنامج الجيب دون أخطاء أو تحذيرات، وأزل المطلوب دون قطع زائد، في أقل من 75 ثانية.', (p) => { const c = gcCalc(p); return c.ok && c.warns.length === 0 && c.cmp && c.cmp.overPct <= 1 && c.cmp.resPct <= c.cmp.cornerPct + 1.5 && c.time < 75; }),
            CH('Remove at least 15 cm³/min while cutting, with a good chip load and no errors or warnings.', 'أزل 15 cm³/min على الأقل أثناء القطع مع سماكة رايش جيدة ودون أخطاء أو تحذيرات.', (p) => { const c = gcCalc(p); return c.ok && c.warns.length === 0 && c.MRR >= 15 && c.fzOk; }),
            CH('Make a 60 × 60 pocket program with a tool of 16 mm or more that leaves no more than 5 % uncut.', 'اصنع برنامج جيب 60 × 60 بأداة قطرها 16 mm أو أكثر لا يترك أكثر من 5% دون قطع.', (p) => { const c = gcCalc(p); return c.ok && c.cmp && p.pw >= 60 && p.ph >= 60 && p.d >= 16 && c.cmp.resPct <= 5 && c.cmp.overPct <= 1; })
        ],
        panels(p) {
            const c = gcCalc(p), pts = [], mv = c.par.moves, step = Math.max(1, Math.ceil(mv.length / 150));
            pts.push([0, c.par.startZ]);
            for (let i = 0; i < mv.length; i += step) { const m = mv[i]; pts.push([m.t0 / 60, m.pts[0][2]]); pts.push([(m.t0 + m.t) / 60, m.pts[m.pts.length - 1][2]]); }
            const last = pts[pts.length - 1][0], tmax = Math.max(c.time / 60, last, 0.01);
            return [{ type: 'line', h: 170, title: L2('Tool height Z over the program', 'ارتفاع الأداة Z خلال البرنامج'), unit: 'mm', xlabel: L2('Time (min)', 'الزمن (min)'), xmin: 0, xmax: tmax, series: [{ label: 'Z', pts: pts }] }];
        }
    });
})();
