/* Machine Disassembly lab — core.
 *
 * Every assembly is built in MILLIMETRES inside a group scaled by DIS.U, so the numbers in the code are real dimensions.
 * A part is a Group (userData.id) with an inner "spin" group, so a rotating part can turn while its exploded offset stays put.
 * Each model (disasm_*.js) calls DIS.add(id, title, def) with
 *   controls(cur) / build(p, api) / readouts(p, group) / challenges() / panels(p)
 * and gets, for free: exploded-view slider, auto explode, assembly step-through, BOM with masses, part isolation. */
(function () {
    'use strict';
    const K = window.GearKit;
    if (!window.Labs || !K || !window.THREE) return;
    const PI = Math.PI, L2 = K.L2, fmt = K.fmt;
    const lang = () => (window.getLang ? window.getLang() : 'en');
    const ar = () => lang() === 'ar';
    const U = 0.1; // scene units per millimetre

    const DEN = { steel: 7.85e-6, alu: 2.7e-6, bronze: 8.8e-6, rubber: 1.25e-6, cast: 7.2e-6, brass: 8.5e-6, nylon: 1.14e-6 }; // kg / mm³
    const COL = { steel: 0x9aa5b1, hard: 0xb7c0cc, dark: 0x3b4452, cast: 0x5f7186, alu: 0xc9d3de, bronze: 0xc58f3a, brass: 0xd4a94c, rubber: 0x20262e, key: 0xd8b04a, blue: 0x2f80ed, amber: 0xf59e0b, gear1: 0x0ea5e9 };
    const mat = (c, o) => new THREE.MeshStandardMaterial(Object.assign({ color: c, metalness: 0.3, roughness: 0.5, side: THREE.DoubleSide }, o || {}));
    const mod1 = (x, m) => ((x % m) + m) % m;

    /* ---------- geometry helpers (all axes along Z unless noted) ---------- */
    const cylZ = (r, h, seg, m, r2) => { const g = new THREE.CylinderGeometry(r, r2 === undefined ? r : r2, h, seg || 32); g.rotateX(PI / 2); return new THREE.Mesh(g, m); };
    const tubeGeo = (ro, ri, h, seg) => {
        const s = new THREE.Shape(); s.absarc(0, 0, ro, 0, 2 * PI, false);
        if (ri > 0) { const hl = new THREE.Path(); hl.absarc(0, 0, ri, 0, 2 * PI, true); s.holes.push(hl); }
        const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: seg || 40 }); g.translate(0, 0, -h / 2); return g;
    };
    const tubeZ = (ro, ri, h, m, seg) => new THREE.Mesh(tubeGeo(ro, ri, h, seg), m);
    /* keyway helpers (ISO 773): hub bore with a slot on +Y, shaft section with a slot on +Y. kw = key width, t1 = depth in shaft, t2 = depth in hub */
    const keyHole = (ri, kw, t2) => {
        const d = Math.asin(kw / 2 / ri), yc = Math.sqrt(ri * ri - kw * kw / 4), p = new THREE.Path();
        p.absarc(0, 0, ri, PI / 2 + d, PI / 2 - d + 2 * PI, false);
        p.lineTo(kw / 2, ri + t2); p.lineTo(-kw / 2, ri + t2); p.lineTo(-kw / 2, yc);
        return p;
    };
    const keyedRingGeo = (ro, ri, h, kw, t2, seg) => {
        const s = new THREE.Shape(); s.absarc(0, 0, ro, 0, 2 * PI, false); s.holes.push(keyHole(ri, kw, t2));
        const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: seg || 40 }); g.translate(0, 0, -h / 2); return g;
    };
    const keyedShaftGeo = (r, h, kw, t1, seg) => {
        const d = Math.asin(kw / 2 / r), yc = Math.sqrt(r * r - kw * kw / 4), s = new THREE.Shape();
        s.moveTo(-kw / 2, r - t1); s.lineTo(kw / 2, r - t1); s.lineTo(kw / 2, yc);
        s.absarc(0, 0, r, PI / 2 - d, PI / 2 + d, true); s.lineTo(-kw / 2, r - t1);
        const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: seg || 40 }); g.translate(0, 0, -h / 2); return g;
    };
    const boxM = (x, y, z, m) => new THREE.Mesh(new THREE.BoxGeometry(x, y, z), m);
    const hexZ = (af, h, m) => { const g = new THREE.CylinderGeometry(af / Math.sqrt(3), af / Math.sqrt(3), h, 6); g.rotateX(PI / 2); return new THREE.Mesh(g, m); };
    const latheZ = (pts, m, seg) => { const g = new THREE.LatheGeometry(pts.map((q) => new THREE.Vector2(q[0], q[1])), seg || 64); g.rotateX(PI / 2); return new THREE.Mesh(g, m); };
    const at = (o, x, y, z) => { o.position.set(x, y || 0, z || 0); return o; };
    const volTube = (ro, ri, h) => PI * (ro * ro - ri * ri) * h;
    const volCyl = (r, h) => PI * r * r * h;

    /* ---------- ISO 286 fits (simplified formulas; match the standard tables within ±1 µm for D ≤ 500 mm) ---------- */
    const RANGES = [3, 6, 10, 18, 30, 50, 80, 120, 180, 250, 315, 400, 500];
    function dGeo(D) { let lo = 1; for (let i = 0; i < RANGES.length; i++) { if (D <= RANGES[i]) return Math.sqrt(Math.max(lo, 1) * RANGES[i]); lo = RANGES[i]; } return 500; }
    function IT(D, g) { const Dg = dGeo(D), i = 0.45 * Math.cbrt(Dg) + 0.001 * Dg; return Math.round({ 5: 7, 6: 10, 7: 16, 8: 25 }[g] * i); }
    function shaftDev(D, letter, g) {
        const Dg = dGeo(D), t = IT(D, g);
        let es, ei;
        if (letter === 'h') { es = 0; ei = -t; }
        else if (letter === 'g') { es = -Math.round(2.5 * Math.pow(Dg, 0.34)); ei = es - t; }
        else if (letter === 'f') { es = -Math.round(5.5 * Math.pow(Dg, 0.41)); ei = es - t; }
        else if (letter === 'k') { ei = Math.round(0.6 * Math.cbrt(Dg)); es = ei + t; }
        else if (letter === 'm') { ei = IT(D, 7) - IT(D, 6); es = ei + t; }
        else if (letter === 'n') { ei = Math.round(5 * Math.pow(Dg, 0.34)); es = ei + t; }
        else { es = 0; ei = -t; }
        return { es, ei, t };
    }
    function fit(D, letter, g, holeGrade) {
        const sh = shaftDev(D, letter, g), H = IT(D, holeGrade || 7);
        const cMax = H - sh.ei, cMin = 0 - sh.es;
        return { shaft: sh, holeES: H, cMax, cMin, kind: cMin >= 0 ? 'clearance' : cMax <= 0 ? 'interference' : 'transition' };
    }

    /* ---------- registry ---------- */
    const DIS = (window.DIS = { U, DEN, COL, mat, cylZ, tubeZ, tubeGeo, keyHole, keyedRingGeo, keyedShaftGeo, boxM, hexZ, latheZ, at, volTube, volCyl, mod1, IT, shaftDev, fit, models: {}, cur: { model: null, rows: [] }, lang, ar, L2, fmt, K });
    const lab = {
        id: 'disasm', icon: 'fa-screwdriver-wrench',
        title: L2('Machine Disassembly', 'تفكيك الآلات'),
        intro: L2('Educational 3D models, not a maintenance procedure: before any real work isolate and lock out every energy source, secure moving parts and follow the manufacturer\'s manual. Explode a simplified assembly, step through its assembly sequence, read the parts list with masses, and check the design: fits, bearing life, bolts, keys and loads.',
            'نماذج ثلاثية الأبعاد تعليمية وليست إجراء صيانة: قبل أي عمل فعلي افصل كل مصادر الطاقة وأمّن الأجزاء المتحركة واتبع دليل الشركة المصنّعة. فكّك تجميعاً مبسّطاً، وتابع تسلسل التركيب، واقرأ قائمة القطع مع كتلها، وافحص التصميم: التوافقات وعمر المحمل والبراغي والخوابير والأحمال.'),
        models: [],
        parts: {},
        supports: { section: true, isolate: true },
        controls(model, cur) { return DIS.models[model].controls(cur || {}); },
        build(model, p, api) {
            const def = DIS.models[model];
            const root = def.build(p, api);
            DIS.cur = { model, rows: root.userData.rows || [] };
            return root;
        },
        apply(group, p, id) { if (group.userData.layout) group.userData.layout(id); },
        readouts(model, p, api, group) {
            const M = DIS.models[model], rows = M.readouts(p, group);
            return M.scope ? rows.concat([{ k: L2('Model scope', 'نطاق النموذج'), v: M.scope[lang()] || M.scope.en }]) : rows;      // every model states what it simplifies
        },
        challenges(model) { return DIS.models[model].challenges(); },
        listParts(model) { return DIS.cur.model === model ? DIS.cur.rows : []; },
        charts: { draw(canvas, model, p, info) { K.drawPanels(canvas, DIS.models[model].panels(p), info); } }
    };
    window.Labs.register(lab);
    DIS.lab = lab;
    DIS.add = (id, title, def) => { DIS.models[id] = def; lab.models.push({ id, title }); };
    DIS.addParts = (o) => Object.assign(lab.parts, o);
    /* concise part-info record */
    DIS.P = (name, desc, material, func, mfg, tol, std, asm, fail) => ({ name, desc, material, func, mfg, tol, std, asm, fail });

    /* ---------- common controls ---------- */
    DIS.common = (maxStep, exDefault) => [
        { type: 'title', label: L2('Exploded view', 'المنظر الانفجاري') },
        { id: 'ex', type: 'range', label: L2('Explode', 'التفكيك'), min: 0, max: 100, step: 1, value: exDefault === undefined ? 60 : exDefault, unit: '%' },
        { id: 'auto', type: 'toggle', label: L2('Auto explode / assemble', 'تفكيك وتركيب تلقائي'), value: false },
        { id: 'step', type: 'range', label: L2('Assembly step (0 = all)', 'خطوة التركيب (0 = الكل)'), min: 0, max: maxStep, step: 1, value: 0 },
        { id: 'next', type: 'button', label: L2('Next assembly step ▸', 'خطوة التركيب التالية ▸'), run: (p) => { p.step = ((p.step || 0) + 1) > maxStep ? 0 : (p.step || 0) + 1; } },
        { id: 'allsteps', type: 'button', label: L2('Show everything', 'إظهار الكل'), run: (p) => { p.step = 0; } },
        /* the model is rebuilt after a button, so animation phases, selection and isolation start from zero as well */
        { id: 'resetall', type: 'button', label: L2('Reset: fully assembled ↺', 'إعادة الضبط: تجميع كامل ↺'), run: (p) => { p.ex = 0; p.step = 0; p.auto = false; } }
    ];

    /* ---------- assembly framework ---------- */
    /* defs: [{id, build(spin), home:[x,y,z] mm, off:[x,y,z] mm at 100 %, order, qty, vol mm³ (per piece), den kg/mm³, label}] */
    DIS.assemble = function (p, api, defs, opts) {
        opts = opts || {};
        const root = new THREE.Group(), world = new THREE.Group();
        world.scale.setScalar(U); root.add(world);
        const parts = defs.map((d) => {
            const g = new THREE.Group(), spin = new THREE.Group();
            g.userData.id = d.id; if (d.label === false) g.userData.label = false;
            g.add(spin); d.build(spin, g); world.add(g);
            const part = Object.assign({ home: [0, 0, 0], off: [0, 0, 0], order: 1, qty: 1, vol: 0, den: DEN.steel }, d, { g, spin });
            g.position.set(part.home[0], part.home[1], part.home[2]);
            return part;
        });
        const byOrder = {};
        parts.forEach((q) => { if (!byOrder[q.order]) byOrder[q.order] = q.id; });
        const maxStep = Math.max(...parts.map((q) => q.order));
        let lastStep = Math.min(maxStep, Math.max(0, Math.round(Number(p.step) || 0)));
        /* A part moves along `off` (mm at 100 %). For a staged explosion it may instead carry
         *   segs: [{ v:[x,y,z], w:[e0,e1] }, …]  — each leg moves during its own window of the slider (e = 0…1), so a part can
         *                                           first ride with the part it sits in and leave later (no part is dragged through another);
         *   stepOff: the vector used when the part is shown on its own in the assembly step-through (its own removal direction). */
        const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
        const place = (q, e, stepMode) => {
            let dx = 0, dy = 0, dz = 0;
            if (stepMode) { const v = q.stepOff || q.off; dx = v[0] * e; dy = v[1] * e; dz = v[2] * e; }
            else if (q.segs) q.segs.forEach((sg) => { const f = clamp01((e - sg.w[0]) / (sg.w[1] - sg.w[0])); dx += sg.v[0] * f; dy += sg.v[1] * f; dz += sg.v[2] * f; });
            else { dx = q.off[0] * e; dy = q.off[1] * e; dz = q.off[2] * e; }
            q.g.position.set(q.home[0] + dx, q.home[1] + dy, q.home[2] + dz);
        };
        const layout = () => {
            const e = Math.min(1, Math.max(0, (Number(p.ex) || 0) / 100)), step = Math.min(maxStep, Math.max(0, Math.round(Number(p.step) || 0)));
            parts.forEach((q) => {
                let ee = e, vis = true;
                if (step > 0) { vis = q.order <= step; ee = q.order === step ? Math.max(e, 0.4) : 0; }
                place(q, ee, step > 0);
                q.g.visible = vis && !q.g.userData.iso;
            });
            if (opts.afterLayout) opts.afterLayout(parts, e, step);
            if (opts.update) opts.update(0, 0, parts);      // refresh spin-frame details (e.g. a key leaving its slot) without advancing time
            if (step !== lastStep) {
                lastStep = step;
                if (step > 0 && byOrder[step]) { if (api && api.selectById) api.selectById(byOrder[step]); }
                else if (api && api.clearSelection) api.clearSelection();
            }
        };
        root.userData.parts = parts;
        root.userData.layout = layout;
        root.userData.world = world;
        root.userData.maxStep = maxStep;
        if (lastStep > 0 && byOrder[lastStep]) root.userData.autoSelect = byOrder[lastStep];
        // BOM rows (names come from the parts dictionary at read time so the language switch is live)
        root.userData.rows = parts.filter((q) => q.bom !== false).map((q) => ({ id: q.id, get name() { return lab.parts[q.id] ? lab.parts[q.id].name : q.id; }, qty: q.qty, mass: q.vol * q.qty * q.den }));
        // auto explode: 0 → 100 → 0 as a cosine; the phase is always taken from the CURRENT slider value, so switching it on, off
        // or dragging the slider while it runs never makes the model jump.
        let t = 0, autoWas = false, lastAuto = null, dirUp = true;
        const PER = 7, phaseOf = (ex, up) => { const th = Math.acos(Math.min(1, Math.max(-1, 1 - ex / 50))); return ((up ? th : 2 * PI - th) * PER) / (2 * PI); };
        const baseUpdate = opts.update;
        root.userData.update = (dt, time) => {
            if (p.auto) {
                const cur = Math.round(Number(p.ex) || 0);
                if (!autoWas || lastAuto === null || cur !== lastAuto) { t = phaseOf(cur, dirUp); autoWas = true; }     // (re)start from where the slider is
                t += dt;
                const th = (2 * PI * t) / PER;
                p.ex = Math.round(50 - 50 * Math.cos(th));
                dirUp = Math.sin(th) >= 0; lastAuto = p.ex;
                const sl = document.getElementById('c-ex'), ou = document.getElementById('o-ex');
                if (sl) sl.value = p.ex; if (ou) ou.textContent = p.ex + ' %';
                layout();
            } else { autoWas = false; lastAuto = null; }
            if (baseUpdate) baseUpdate(dt, time, parts);
        };
        layout();
        return { root, world, parts };
    };

    /* fit the camera to a box in mm (centered at c) */
    DIS.fit = (root, cx, cy, cz, hw, hh, dir) => {
        root.userData.target = [cx * U, cy * U, cz * U];
        root.userData.fit = { w: hw * U, h: hh * U, dir: dir || [0.55, 0.42, 1] };
    };

    DIS.totalMass = (root) => root.userData.rows.reduce((a, r) => a + r.mass, 0);
    DIS.fmtMass = (kg) => (kg >= 1 ? kg.toFixed(2) + ' kg' : (kg * 1000).toFixed(kg * 1000 >= 100 ? 0 : 1) + ' g');
    DIS.yes = (b) => (b ? (ar() ? 'نعم' : 'Yes') : (ar() ? 'لا' : 'No'));
    DIS.sfState = (sf) => (sf < 1 ? 'bad' : sf < 1.5 ? 'warn' : 'ok');

    /* tightening torque T = K·F·d, preload F = 0.75·Rp0.2·As (ISO 898-1 classes, K = 0.2 dry / 0.14 oiled) */
    const AS = { 6: 20.1, 8: 36.6, 10: 58, 12: 84.3, 14: 115, 16: 157, 20: 245 }, RP = { '4.6': 240, '8.8': 640, '10.9': 940, '12.9': 1100 };
    DIS.preload = (M, grade) => 0.75 * RP[grade] * AS[M];                        // N
    DIS.tighten = (M, grade, Kf) => (Kf || 0.2) * DIS.preload(M, grade) * M / 1000; // N·m
    DIS.CH = (en, a, fn) => ({ text: L2(en, a), check: fn });
    /* readout row for an ISO fit: min … max clearance in µm (negative = interference) */
    DIS.fitRow = (label, D, letter, g, hole) => {
        const f = fit(D, letter, g, hole);
        const kindL = { clearance: L2('clearance', 'خلوص'), transition: L2('transition', 'انتقالي'), interference: L2('interference', 'تداخل') }[f.kind];
        return { k: label, v: 'Ø' + D + ' H' + (hole || 7) + '/' + letter + g + ' : ' + fmt(f.cMin, 0) + ' … ' + fmt(f.cMax, 0) + ' µm · ' + kindL[lang()] };
    };
})();
