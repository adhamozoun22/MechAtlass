/* Strength of Materials lab — models 2..6: tensile test, torsion, column buckling, pressure vessel, Mohr's circle.
 * Needs strength.js (window.SM). Every model: SI calculation (memoised) + coloured 3D body + charts + challenges. */
(function () {
    'use strict';
    const SM = window.SM, K = window.GearKit;
    if (!SM || !K || !window.THREE) return;
    const PI = Math.PI, L2 = SM.L2, fmt = SM.fmt, lit = SM.lit, MATS = SM.MATS, CH = SM.CH, st = SM.state, memo = SM.memo;
    const NA = L2('—', '—');
    const pp = (nEn, nAr, dEn, dAr, fEn, fAr, failEn, failAr) => SM.P(L2(nEn, nAr), L2(dEn, dAr), NA, L2(fEn, fAr), NA, NA, NA, NA, failEn ? L2(failEn, failAr) : NA);
    const bomOf = (id, mass) => [{ id, get name() { return SM.lab.parts[id].name; }, qty: 1, mass }];
    const T2 = (a, b) => (window.getLang && window.getLang() === 'ar' ? b : a);
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    /* surface builder: grids of vertices with per-vertex colour */
    function Grid() {
        const pos = [], col = [], idx = [];
        return {
            add(nu, nv, fn) {
                const base = pos.length / 3;
                for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) { const o = fn(i / nu, j / nv); pos.push(o.p[0], o.p[1], o.p[2]); col.push(o.c[0], o.c[1], o.c[2]); }
                for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const a = base + i * (nv + 1) + j, b = a + 1, c = a + nv + 1, d = c + 1; idx.push(a, b, d, a, d, c); }
            },
            mesh() {
                const g = new THREE.BufferGeometry();
                g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
                g.setIndex(idx); g.computeVertexNormals();
                return new THREE.Mesh(g, lit(0xffffff, { vertexColors: true, metalness: 0.1, roughness: 0.6 }));
            }
        };
    }
    function dirArrow(pos, dir, len, color, r) {
        const g = SM.arrowUp(0, len, len, color, r), w = new THREE.Group(); w.add(g);
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(dir[0], dir[1], dir[2]).normalize());
        w.quaternion.copy(q); w.position.set(pos[0], pos[1], pos[2]); return w;
    }
    SM.Grid = Grid; SM.dirArrow = dirArrow;
    const jaw = (w, h, d) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), lit(0x64748b, { roughness: 0.7 }));
    const matCtl = (def) => ({ id: 'mat', type: 'select', label: L2('Material', 'المادة'), options: SM.matOptions(), value: def || 's235', rebuild: true });

    /* =====================================================================================
     * 1. TENSILE TEST
     * ===================================================================================== */
    const TP = {
        s235: { pl: 0.02, eu: 0.20, ef: 0.28, Z: 0.55, sf: 0.78 }, s355: { pl: 0.012, eu: 0.14, ef: 0.22, Z: 0.5, sf: 0.8 },
        al: { pl: 0, eu: 0.10, ef: 0.14, Z: 0.4, sf: 0.85 }, ti: { pl: 0, eu: 0.08, ef: 0.12, Z: 0.35, sf: 0.88 },
        oak: { brit: true }, ci: { brit: true }
    };
    const tensCache = {};
    function tens(mat) {
        if (tensCache[mat]) return tensCache[mat];
        const m = MATS[mat], t = TP[mat], E = m.E, sy = m.sy, su = m.su, ey = sy / E, brit = !!t.brit, plateau = !brit && t.pl > 0;
        const ef = brit ? (mat === 'ci' ? 0.006 : su / E) : t.ef, eu = brit ? ef : t.eu, sfr = brit ? su : t.sf * su;
        /* mild steel: upper yield point -> sudden drop -> Lueders plateau with small ripples -> strain hardening -> necking.
           Aluminium / titanium: no sharp yield, smooth knee (0.2 % offset proof stress) -> hardening -> necking. */
        const euy = 1.05 * ey, ed = euy + 0.0007, ep = brit ? ey : plateau ? ey + t.pl : ey + 0.002;
        const knee = (x) => x / Math.pow(1 + Math.pow(x / sy, 7), 1 / 7);
        const hard = (e) => {
            if (plateau) { const u = clamp((e - ep) / (eu - ep), 0, 1); return sy + (su - sy) * (1 - Math.pow(1 - u, 2.4)); }
            const u = clamp((e - ey) / (eu - ey), 0, 1); return knee(E * e) + (su - sy) * (1 - Math.pow(1 - u, 3));
        };
        const sHard = hard(eu);
        const sig = (e) => {
            if (brit) { if (mat === 'ci') { const k = (E * ef) / su; return su * (1 - Math.pow(Math.max(0, 1 - e / ef), k)); } return Math.min(su, E * e); }
            if (plateau) {
                if (e <= euy) return E * e;
                if (e <= ed) { const u = (e - euy) / (ed - euy); return sy * (1.05 - 0.06 * (1 - Math.cos(PI * u)) / 2 * 1.0); }
                if (e <= ep) { const w = (e - ed) / (ep - ed); return sy * (0.99 + 0.01 * w + 0.007 * (1 - w) * Math.sin((2 * PI * (e - ed)) / 0.0024)); }
            }
            if (e <= eu) return hard(e);
            const u = (e - eu) / (ef - eu); return sHard - (sHard - sfr) * u * u;
        };
        const au = 1 / (1 + eu), af = brit ? 1 / (1 + ef) : 1 - t.Z;
        const area = (e) => { if (brit || e <= eu) return 1 / (1 + e); const u = (e - eu) / (ef - eu); return au + (af - au) * Math.pow(u, 1.5); };
        const e25 = brit ? ey : plateau ? euy : ep;
        const eps = (pr) => (brit ? (ef * pr) / 100 : pr <= 25 ? (e25 * pr) / 25 : pr <= (plateau ? 35 : 25.0001) ? (plateau ? e25 + ((ep - e25) * (pr - 25)) / 10 : e25) : pr <= 60 ? (plateau ? ep + ((eu - ep) * (pr - 35)) / 25 : e25 + ((eu - e25) * (pr - 25)) / 35) : eu + ((ef - eu) * (pr - 60)) / 40);
        /* dense sampling in strain so the yield drop and the ripples are visible on the chart */
        const es = []; const seg = (a, b, n) => { for (let i = 0; i < n; i++) es.push(a + ((b - a) * i) / n); };
        if (brit) seg(0, ef, 120);
        else if (plateau) { seg(0, euy, 40); seg(euy, ed, 14); seg(ed, ep, 60); seg(ep, eu, 70); seg(eu, ef, 50); }
        else { seg(0, ep, 60); seg(ep, eu, 80); seg(eu, ef, 50); }
        es.push(ef);
        const pts = [], tr = [];
        es.forEach((e) => { const sg = sig(e); pts.push([e * 100, sg / 1e6]); tr.push([e * 100, sg / area(e) / 1e6]); });
        let W = 0; for (let i = 1; i < pts.length; i++) W += ((pts[i][1] + pts[i - 1][1]) / 2) * ((pts[i][0] - pts[i - 1][0]) / 100);
        return (tensCache[mat] = { m, t, E, sy, su, ey, ep, eu, ef, sfr, sig, area, eps, brit, pts, tr, W });
    }
    const tensState = (p) => { const T = tens(p.mat), pr = clamp(p.prog, 0, 100), e = T.eps(pr), s = T.sig(e), a = T.area(e), A0 = (PI * p.d * p.d) / 4; return { T, pr, e, s, a, A0, F: s * A0 * 1e-6, frac: pr >= 100 }; };

    SM.addParts({
        st_spec: pp('Test specimen', 'عيّنة الاختبار', 'Dog-bone bar: thick grips at the ends, a thinner gauge length in the middle where the stress is uniform. Colour = true local stress.', 'قضيب على شكل عظمة: طرفان سميكان للقبض وجزء قياس أرفع في الوسط يكون فيه الإجهاد منتظماً. اللون = الإجهاد الحقيقي الموضعي.', 'Gives the stress–strain curve of the material.', 'تعطي منحنى الإجهاد–التشوه للمادة.', 'Ductile metals neck and fracture as a cup-and-cone; brittle materials snap flat with almost no necking.', 'المعادن المطيلة تتخصّر وتنكسر بشكل كأس ومخروط؛ المواد الهشة تنكسر مستوية دون تخصّر يُذكر.'),
        st_jaw: pp('Grips', 'فكّا القبض', 'Steel jaws of the testing machine; one is fixed, the other moves and pulls.', 'فكّان فولاذيان في آلة الاختبار؛ أحدهما ثابت والآخر يتحرك ويسحب.', 'Transmit the load to the specimen without slipping or crushing it.', 'ينقلان الحمل إلى العيّنة دون انزلاق أو سحق.'),
        st_force: pp('Tensile force F', 'قوة الشد F', 'The load cell reading; engineering stress σ = F / A₀.', 'قراءة خلية الحمل؛ الإجهاد الهندسي σ = F / A₀.', 'The pull applied to the bar.', 'السحب المطبّق على القضيب.')
    });

    SM.add('tensile', L2('Tensile test', 'اختبار الشد'), {
        controls: () => [
            { type: 'title', label: L2('Specimen', 'العيّنة') }, matCtl('s235'),
            { id: 'd', type: 'range', label: L2('Gauge diameter d₀', 'قطر العيّنة d₀'), min: 6, max: 20, step: 1, value: 10, unit: 'mm', rebuild: true },
            { type: 'title', label: L2('Test', 'الاختبار') },
            { id: 'prog', type: 'range', label: L2('Test progress (0 = start, 25 = yield, 60 = max load, 100 = fracture)', 'تقدّم الاختبار (0 بداية، 25 خضوع، 60 أعلى حمل، 100 كسر)'), min: 0, max: 100, step: 1, value: 0, unit: '%', rebuild: true },
            { id: 'toY', type: 'button', label: L2('Go to yield', 'إلى الخضوع'), run: (p) => { p.prog = 25; } },
            { id: 'toU', type: 'button', label: L2('Go to max load (necking starts)', 'إلى أعلى حمل (بداية التخصّر)'), run: (p) => { p.prog = 60; } },
            { id: 'toF', type: 'button', label: L2('Run to fracture', 'تشغيل حتى الكسر'), run: (p) => { p.prog = 100; } },
            { id: 'rst', type: 'button', label: L2('Reset', 'إعادة'), run: (p) => { p.prog = 0; } },
            { type: 'note', label: L2('Elastic stretch is exaggerated ×40 so you can see it. Brittle materials (cast iron, timber) have one stage only.', 'الاستطالة المرنة مكبّرة ×40 لتُرى. المواد الهشة (حديد الزهر، الخشب) لها مرحلة واحدة فقط.') }
        ],
        build(p) {
            const S = tensState(p), T = S.T, g = new THREE.Group(), d = p.d, rv = 0.35 + ((d - 6) / 14) * 0.35, rg = rv * 1.9;
            const ev = S.e + (40 * S.s) / T.E, hv = (6 * (1 + ev)) / 2, tr = 0.7, Yt = hv + tr + 1.8;
            const ru = rv * Math.sqrt(T.brit ? S.a : T.area(Math.min(S.e, T.eu))), rc = T.brit ? ru : rv * Math.sqrt(S.a);
            const sm = (u) => u * u * (3 - 2 * u);
            const R = (y) => { const ay = Math.abs(y); if (ay >= hv + tr) return rg; if (ay >= hv) return ru + (rg - ru) * sm((ay - hv) / tr); return ru - (ru - rc) * Math.exp(-Math.pow(y / 0.9, 2)); };
            const colAt = (r) => SM.colorOf(S.frac ? 0 : (S.s * rv * rv) / (r * r) / T.sy);
            const half = (y0, y1, shift) => {
                const pts = [], cols = [], n = 70;
                pts.push(new THREE.Vector2(0, y0 + shift)); cols.push(colAt(R(y0)));
                for (let i = 0; i <= n; i++) { const y = y0 + ((y1 - y0) * i) / n, r = R(y); pts.push(new THREE.Vector2(r, y + shift)); cols.push(colAt(r)); }
                pts.push(new THREE.Vector2(0, y1 + shift)); cols.push(colAt(R(y1)));
                const geo = new THREE.LatheGeometry(pts, 36), c = [], np = pts.length;
                for (let i = 0; i <= 36; i++) for (let j = 0; j < np; j++) c.push(cols[j][0], cols[j][1], cols[j][2]);
                geo.setAttribute('color', new THREE.Float32BufferAttribute(c, 3)); geo.computeVertexNormals();
                return new THREE.Mesh(geo, lit(0xffffff, { vertexColors: true, metalness: 0.15, roughness: 0.55 }));
            };
            const spec = new THREE.Group(); spec.userData.id = 'st_spec';
            let topY = Yt, botY = -Yt;
            if (S.frac) { spec.add(half(0, Yt, 0.3), half(-Yt, 0, -0.3)); topY = Yt + 0.3; botY = -Yt - 0.3; } else spec.add(half(-Yt, Yt, 0));
            g.add(spec);
            const jg = new THREE.Group(); jg.userData.id = 'st_jaw';
            const jt = jaw(rg * 2.8, 1.8, rg * 2.8); jt.position.y = topY - 0.9; const jb = jaw(rg * 2.8, 1.8, rg * 2.8); jb.position.y = botY + 0.9; jg.add(jt, jb);
            const rod1 = jaw(0.3, 2.2, 0.3); rod1.position.y = topY + 1.1; const rod2 = jaw(0.3, 2.2, 0.3); rod2.position.y = botY - 1.1; jg.add(rod1, rod2); g.add(jg);
            const fg = new THREE.Group(); fg.userData.id = 'st_force';
            if (!S.frac && S.F > 0) { const len = 0.8 + 1.6 * clamp(S.s / T.su, 0, 1); fg.add(SM.arrowUp(0, topY + 2.4 + len, len, 0xdc2626, 0.1), SM.arrowDown(0, botY - 2.4 - len, len, 0xdc2626, 0.1)); }
            g.add(fg);
            g.userData.fit = { w: 4.5, h: 10.5, dir: [0.35, 0.15, 1] }; g.userData.target = [0, 0, 0];
            return g;
        },
        readouts(p) {
            const S = tensState(p), T = S.T, MPa = (v) => fmt(v / 1e6, 0) + ' MPa, ', stage = T.brit ? (S.frac ? L2('Fractured (brittle)', 'انكسر (هش)') : L2('Elastic loading', 'تحميل مرن')) : S.frac ? L2('Fractured — cup & cone', 'انكسر — كأس ومخروط') : S.pr < 25 ? L2('Elastic', 'مرن') : S.pr < 60 ? L2('Plastic, uniform strain', 'لدن، تشوه منتظم') : L2('Necking', 'تخصّر');
            const lang = window.getLang ? window.getLang() : 'en', stT = lang === 'ar' ? stage.ar : stage.en;
            const Wcur = (() => { let w = 0; const n = 60; let prev = 0; for (let i = 1; i <= n; i++) { const e = (S.e * i) / n, s = T.sig(e); w += ((s + T.sig((S.e * (i - 1)) / n)) / 2) * (S.e / n); } return w; })();
            return [
                { k: L2('Stage', 'المرحلة'), v: stT, state: S.frac ? 'bad' : S.pr >= 60 && !T.brit ? 'warn' : 'ok' },
                { k: L2('Force F  ·  A₀', 'القوة F  ·  A₀'), v: fmt(S.frac ? 0 : S.F / 1000, 1) + ' kN  ·  ' + fmt(S.A0, 1) + ' mm²' },
                { k: L2('Engineering stress σ = F/A₀', 'الإجهاد الهندسي σ = F/A₀'), v: fmt(S.frac ? 0 : S.s / 1e6, 0) + ' MPa' },
                { k: L2('Engineering strain ε', 'التشوه الهندسي ε'), v: fmt(S.e * 100, 2) + ' %' },
                { k: L2('True stress σ_t = σ/(A/A₀)', 'الإجهاد الحقيقي σ_t'), v: fmt(S.frac ? 0 : S.s / S.a / 1e6, 0) + ' MPa' },
                { k: L2('Young\'s modulus E (slope)', 'معامل يونغ E (الميل)'), v: fmt(T.E / 1e9, 0) + ' GPa' },
                { k: T.brit ? L2('Proportional limit', 'حد التناسب') : L2('Yield strength σ_y', 'إجهاد الخضوع σ_y'), v: fmt(T.sy / 1e6, 0) + ' MPa' },
                { k: L2('Ultimate strength σ_u', 'مقاومة الشد القصوى σ_u'), v: fmt(T.su / 1e6, 0) + ' MPa · F_max ' + fmt((T.su * S.A0) / 1e9, 1) + ' kN' },
                { k: L2('Elongation at fracture', 'الاستطالة عند الكسر'), v: fmt((T.ef - T.sfr / T.E) * 100, 1) + ' %' + (T.brit ? L2(' (brittle)', ' (هش)').en : ''), state: T.brit ? 'bad' : 'ok' },
                { k: L2('Reduction of area Z', 'النقص في المساحة Z'), v: fmt(T.brit ? 0 : T.t.Z * 100, 0) + ' %' },
                { k: L2('Toughness so far (area under curve)', 'المتانة حتى الآن (المساحة تحت المنحنى)'), v: fmt(Wcur / 1e6, 1) + ' MJ/m³  (' + fmt(T.W, 1) + (lang === 'ar' ? ' إجمالاً)' : ' total)') }
            ];
        },
        bom: (p) => bomOf('st_spec', (PI * p.d * p.d / 4 * 1e-6) * 0.15 * MATS[p.mat].rho),
        challenges: () => [
            CH('Break a ductile specimen: run to fracture with an elongation of at least 20 %.', 'اكسر عيّنة مطيلة: شغّل حتى الكسر باستطالة لا تقل عن 20%.', (p) => p.prog >= 100 && tens(p.mat).ef >= 0.2),
            CH('Pick the SMALLEST bar diameter that carries 40 kN of tension with a yield safety factor ≥ 1.5.', 'اختر أصغر قطر قضيب يحمل 40 kN شدّاً بمعامل أمان خضوع ≥ 1.5.', (p) => { const ok = (d) => (MATS[p.mat].sy * PI * d * d / 4 * 1e-6) / 40000 >= 1.5; return ok(p.d) && (p.d <= 6 || !ok(p.d - 1)); }),
            CH('Break a brittle material (cast iron or timber) and see it fail with under 2 % strain.', 'اكسر مادة هشة (حديد زهر أو خشب) وشاهدها تنهار بتشوه أقل من 2%.', (p) => p.prog >= 100 && tens(p.mat).brit && tens(p.mat).ef < 0.02),
            CH('Aluminium: stop in the necking stage (after max load, before fracture).', 'ألومنيوم: توقّف في مرحلة التخصّر (بعد أعلى حمل وقبل الكسر).', (p) => p.mat === 'al' && p.prog > 60 && p.prog < 100)
        ],
        panels(p) {
            const S = tensState(p), T = S.T, ymax = Math.ceil(Math.max(T.su, T.tr ? Math.max(...T.tr.map((q) => q[1])) * 1e6 : 0) / 1e8) * 100;
            const cur = S.frac ? [] : [{ x: S.e * 100, y: S.s / 1e6, label: T2('now', 'الآن') }];
            return [
                { type: 'grad', title: L2('Colour = true local stress / yield', 'اللون = الإجهاد الحقيقي / الخضوع'), unit: 'MPa', min: -T.sy / 1e6, max: T.sy / 1e6, h: 44 },
                { type: 'line', h: 210, title: L2('Stress–strain curve', 'منحنى الإجهاد–التشوه'), unit: 'MPa', xlabel: L2('Engineering strain ε (%)', 'التشوه الهندسي ε (%)'), xmin: 0, xmax: Math.ceil(T.ef * 100 * 1.02), ymin: 0, ymax: Math.max(100, ymax), series: [{ label: L2('Engineering σ', 'هندسي σ'), pts: T.pts, fill: true }, { label: L2('True σ_t', 'حقيقي σ_t'), pts: T.tr }], marks: cur },
                { type: 'line', h: 150, title: L2('Elastic zone (zoom ×)', 'المنطقة المرنة (تكبير)'), unit: 'MPa', xlabel: L2('ε (%)', 'ε (%)'), xmin: 0, xmax: (T.sy / T.E) * 100 * 1.4, ymin: 0, ymax: (T.sy / 1e6) * 1.2, series: [{ label: 'σ = E·ε', pts: [[0, 0], [(T.sy / T.E) * 140, (T.sy / 1e6) * 1.4]] }, { label: L2('curve', 'المنحنى'), pts: T.pts.filter((q) => q[0] <= (T.sy / T.E) * 140) }] }
            ];
        }
    });

    /* =====================================================================================
     * 2. TORSION
     * ===================================================================================== */
    const torCalc = memo((p) => {
        const m = MATS[p.mat], D = p.D / 1000, di = p.hollow === 'hollow' ? D * p.ratio : 0, J = (PI * (Math.pow(D, 4) - Math.pow(di, 4))) / 32;
        const T = p.drive === 'power' ? (9550 * p.kW) / Math.max(1, p.rpm) : p.T * 1000, tauMax = (T * D) / 2 / J, tauIn = (T * di) / 2 / J, ty = 0.577 * m.sy;
        const phi = (T * p.L) / (m.G * J), mass = m.rho * (PI / 4) * (D * D - di * di) * p.L, Ty = (ty * J) / (D / 2);
        return { m, D, di, J, T, tauMax, tauIn, ty, phi, sf: ty / Math.max(1e-9, tauMax), mass, Ty, kt: (m.G * J) / p.L };
    });
    SM.addParts({
        st_shaft: pp('Shaft', 'عمود الدوران', 'Solid or hollow round shaft. Colour = shear stress; the dark lines show how a straight line on the surface twists into a helix.', 'عمود دائري مصمت أو مجوّف. اللون = إجهاد القص؛ الخطوط الداكنة تُظهر كيف ينقلب الخط المستقيم على السطح إلى حلزون.', 'Transmits torque (power ÷ speed) from the driver to the load.', 'ينقل العزم (الاستطاعة ÷ السرعة) من المحرّك إلى الحمل.', 'Shear yielding at the surface, fatigue cracks at keyways and shoulders (45° helical cracks in brittle shafts), or too much twist.', 'خضوع القص عند السطح، تشققات إجهاد عند مجاري الخوابير والأكتاف (شقوق حلزونية 45° في الأعمدة الهشة) أو التواء مفرط.'),
        st_wall: pp('Fixed end', 'الطرف المثبّت', 'The left end cannot rotate; it reacts the torque.', 'الطرف الأيسر لا يدور ويقاوم العزم.', 'Holds the shaft.', 'يثبّت العمود.'),
        st_torque: pp('Applied torque T', 'العزم المطبّق T', 'The orange curved arrow on the flange: torque = force × lever arm.', 'السهم البرتقالي المنحني على الفلنشة: العزم = قوة × ذراع.', 'Twists the free end.', 'يلوي الطرف الحر.')
    });
    SM.add('torsion', L2('Torsion shaft', 'التواء العمود'), {
        controls: (p) => {
            const c = [
                { type: 'title', label: L2('Shaft', 'العمود') },
                { id: 'hollow', type: 'select', label: L2('Type', 'النوع'), options: [{ v: 'solid', label: L2('Solid', 'مصمت') }, { v: 'hollow', label: L2('Hollow tube', 'أنبوب مجوّف') }], value: 'solid', rebuild: true },
                { id: 'D', type: 'range', label: L2('Outer diameter D', 'القطر الخارجي D'), min: 20, max: 200, step: 2, value: 60, unit: 'mm', rebuild: true }
            ];
            if ((p || {}).hollow === 'hollow') c.push({ id: 'ratio', type: 'range', label: L2('Inner ÷ outer diameter', 'القطر الداخلي ÷ الخارجي'), min: 0.3, max: 0.9, step: 0.05, value: 0.6, rebuild: true });
            c.push({ id: 'L', type: 'range', label: L2('Length L', 'الطول L'), min: 0.3, max: 3, step: 0.1, value: 1, unit: 'm', rebuild: true }, matCtl('s235'), { type: 'title', label: L2('Load', 'الحمل') },
                { id: 'drive', type: 'select', label: L2('Specify by', 'التحديد بـ'), options: [{ v: 'torque', label: L2('Torque T', 'العزم T') }, { v: 'power', label: L2('Power & speed', 'الاستطاعة والسرعة') }], value: 'torque', rebuild: true });
            if ((p || {}).drive === 'power') c.push({ id: 'kW', type: 'range', label: L2('Power', 'الاستطاعة'), min: 1, max: 500, step: 1, value: 50, unit: 'kW', rebuild: true }, { id: 'rpm', type: 'range', label: L2('Speed', 'السرعة'), min: 50, max: 6000, step: 50, value: 1500, unit: 'rpm', rebuild: true });
            else c.push({ id: 'T', type: 'range', label: L2('Torque T', 'العزم T'), min: 0, max: 60, step: 0.1, value: 2, unit: 'kN·m', rebuild: true });
            return c;
        },
        build(p) {
            const c = torCalc(p), g = new THREE.Group(), XL = 10, sx = XL / p.L, Ro = Math.max((p.D / 2000) * sx, 0.6), Ri = c.di > 0 ? Ro * p.ratio : 0;
            const phiDeg = (c.phi * 180) / PI, mg = phiDeg > 0 ? clamp(30 / phiDeg, 1, 200) : 1, tw = Math.min(c.phi * mg, 2.2 * PI);
            const dark = [0.12, 0.12, 0.18], grid = Grid(), tOut = SM.colorOf(c.tauMax / c.ty), tIn = SM.colorOf(c.tauIn / c.ty);
            const x = (u) => -XL / 2 + u * XL;
            grid.add(60, 48, (u, v) => { const a = v * 2 * PI + tw * u, s = Math.round(v * 48) % 12 === 0; return { p: [x(u), Ro * Math.cos(a), Ro * Math.sin(a)], c: s ? dark : tOut }; });
            if (Ri > 0) grid.add(20, 48, (u, v) => { const a = v * 2 * PI + tw * u; return { p: [x(u), Ri * Math.cos(a), Ri * Math.sin(a)], c: tIn }; });
            [0, 1].forEach((u) => grid.add(10, 48, (rr, v) => { const r = Ri + (Ro - Ri) * rr, a = v * 2 * PI + tw * u; return { p: [x(u), r * Math.cos(a), r * Math.sin(a)], c: SM.colorOf((c.tauMax * (r / Ro)) / c.ty) }; }));
            const sh = grid.mesh(); sh.userData.id = 'st_shaft'; g.add(sh);
            const w = jaw(0.7, Ro * 2 + 1.6, Ro * 2 + 1.6); w.position.x = x(0) - 0.35; w.userData.id = 'st_wall'; g.add(w);
            const fl = new THREE.Mesh(new THREE.CylinderGeometry(Ro * 1.35, Ro * 1.35, 0.3, 40), lit(0x64748b)); fl.rotation.z = PI / 2; fl.position.x = x(1) + 0.15; fl.rotation.x = 0; g.add(fl);
            const tg = new THREE.Group(); tg.userData.id = 'st_torque';
            const arc = 0.5 * PI + 1.2 * PI * clamp(c.T / c.Ty, 0.05, 1), Ra = Ro * 1.9 + 0.3, ring = new THREE.Group();
            ring.add(new THREE.Mesh(new THREE.TorusGeometry(Ra, 0.07, 8, 48, arc), lit(0xf97316, { metalness: 0.1 })));
            const head = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.5, 14), lit(0xf97316, { metalness: 0.1 })); head.position.set(Ra * Math.cos(arc), Ra * Math.sin(arc), 0); head.rotation.z = arc; ring.add(head);
            ring.rotation.y = PI / 2; ring.position.x = x(1) + 0.7; if (c.T > 0) tg.add(ring); g.add(tg);
            g.userData.fit = { w: XL / 2 + 0.6, h: 3.0, dir: [0.55, 0.35, 1] }; g.userData.target = [0, 0, 0]; g.userData.mg = mg;
            return g;
        },
        readouts(p, group) {
            const c = torCalc(p), mg = (group && group.userData.mg) || 1;
            return [
                { k: L2('Torque T' + (p.drive === 'power' ? ' = 9550·P/n' : ''), 'العزم T' + (p.drive === 'power' ? ' = 9550·P/n' : '')), v: fmt(c.T, 0) + ' N·m' },
                { k: L2('Polar moment J = π(D⁴−d⁴)/32', 'العزم القطبي J = π(D⁴−d⁴)/32'), v: fmt(c.J * 1e8, 1) + ' cm⁴' },
                { k: L2('Max shear stress τ = T·R/J (outer surface)', 'أكبر إجهاد قص τ = T·R/J (السطح الخارجي)'), v: fmt(c.tauMax / 1e6, 1) + ' MPa', state: st(c.sf) },
                { k: L2('Shear yield τ_y ≈ 0.577·σ_y  ·  safety factor', 'خضوع القص τ_y ≈ 0.577·σ_y  ·  معامل الأمان'), v: fmt(c.ty / 1e6, 0) + ' MPa  ·  SF ' + fmt(c.sf), state: st(c.sf) },
                { k: L2('Angle of twist φ = T·L/(G·J)', 'زاوية الالتواء φ = T·L/(G·J)'), v: fmt((c.phi * 180) / PI, 2) + '°  (' + fmt(((c.phi * 180) / PI) / p.L, 2) + '°/m)', state: ((c.phi * 180) / PI) / p.L > 1 ? 'warn' : 'ok' },
                                                { k: L2('Power at 1500 rpm', 'الاستطاعة عند 1500 rpm'), v: fmt((c.T * 1500 * 2 * PI) / 60 / 1000, 1) + ' kW' },
                { k: L2('Mass of shaft', 'كتلة العمود'), v: fmt(c.mass, 1) + ' kg' },
                            ];
        },
        bom: (p) => bomOf('st_shaft', torCalc(p).mass),
        challenges: () => [
            CH('Carry T ≥ 3 kN·m with SF ≥ 2, total twist ≤ 1° and a shaft lighter than 20 kg (hint: go hollow).', 'احمل T ≥ 3 kN·m بمعامل أمان ≥ 2 والتواء كلي ≤ 1° وعمود أخف من 20 kg (تلميح: اجعله مجوّفاً).', (p) => { const c = torCalc(p); return p.drive === 'torque' && p.T >= 3 && c.sf >= 2 && (c.phi * 180) / PI <= 1 && c.mass < 20; }),
            CH('Find the yield point: bring the shear safety factor to between 1.00 and 1.10.', 'جِد نقطة الخضوع: اجعل معامل أمان القص بين 1.00 و1.10.', (p) => { const c = torCalc(p); return c.sf >= 1 && c.sf <= 1.1; }),
            CH('Aluminium shaft carrying at least 1 kN·m with SF ≥ 1.5.', 'عمود ألومنيوم يحمل 1 kN·m على الأقل بمعامل أمان ≥ 1.5.', (p) => { const c = torCalc(p); return p.mat === 'al' && c.T >= 1000 && c.sf >= 1.5; }),
            CH('Power drive: transmit 100 kW at ≤ 1000 rpm with SF ≥ 2.', 'نقل استطاعة: انقل 100 kW بسرعة ≤ 1000 rpm بمعامل أمان ≥ 2.', (p) => p.drive === 'power' && p.kW >= 100 && p.rpm <= 1000 && torCalc(p).sf >= 2)
        ],
        panels(p) {
            const c = torCalc(p), Ro = (p.D / 2), Ri = (c.di * 1000) / 2, pts = [];
            for (let i = 0; i <= 20; i++) { const r = Ri + ((Ro - Ri) * i) / 20; pts.push([r, (c.tauMax / 1e6) * (r / Ro)]); }
            const Dp = []; for (let D = 20; D <= 200; D += 10) { const Dm = D / 1000, dm = p.hollow === 'hollow' ? Dm * p.ratio : 0, J = (PI * (Math.pow(Dm, 4) - Math.pow(dm, 4))) / 32; Dp.push([D, (c.ty * J) / (Dm / 2) / 1000]); }
            const ph = (c.phi * 180) / PI;
            return [
                { type: 'grad', title: L2('Colour = shear stress / shear yield', 'اللون = إجهاد القص / خضوع القص'), unit: 'MPa', min: 0, max: c.ty / 1e6, h: 44 },
                { type: 'line', h: 170, title: L2('Shear stress across the section', 'إجهاد القص عبر المقطع'), unit: 'MPa', xlabel: L2('Radius r (mm)', 'نصف القطر r (mm)'), xmin: 0, xmax: Ro, ymin: 0, ymax: Math.max(c.ty / 1e6, c.tauMax / 1e6) * 1.1, series: [{ label: 'τ(r)', pts, fill: true }, { label: 'τ_y', pts: [[0, c.ty / 1e6], [Ro, c.ty / 1e6]] }] },
                { type: 'line', h: 150, title: L2('Twist along the shaft', 'الالتواء على طول العمود'), unit: '°', xlabel: L2('Position x (m)', 'الموضع x (m)'), xmin: 0, xmax: p.L, ymin: 0, ymax: Math.max(0.1, ph * 1.1), series: [{ label: 'φ(x)', pts: [[0, 0], [p.L, ph]] }] },
                { type: 'line', h: 170, title: L2('Torque capacity at yield vs diameter', 'سعة العزم عند الخضوع مقابل القطر'), unit: 'kN·m', xlabel: L2('Outer diameter D (mm)', 'القطر الخارجي D (mm)'), xmin: 20, xmax: 200, ymin: 0, ymax: Math.max(...Dp.map((q) => q[1])) * 1.05, series: [{ label: 'T_y', pts: Dp }, { label: L2('your T', 'عزمك T'), pts: [[20, c.T / 1000], [200, c.T / 1000]] }], marks: [{ x: p.D, y: c.Ty / 1000, label: 'D' }] }
            ];
        }
    });

    /* =====================================================================================
     * 3. COLUMN BUCKLING
     * ===================================================================================== */
    const KF = { pp: 1, fc: 2, fp: 0.7, ff: 0.5 };
    function weakSec(p) {
        if (p.sec === 'rect') return SM.section({ sec: 'rect', b: Math.max(p.b, p.h), h: Math.min(p.b, p.h) });
        if (p.sec === 'ipe') {
            const s = SM.section(p), e = SM.IPE[p.ipe] || SM.IPE[200];
            const Iw = (2 * e.tf * Math.pow(e.b, 3) / 12 + (e.h - 2 * e.tf) * Math.pow(e.tw, 3) / 12) / 1e12;
            return Object.assign({}, s, { I: Iw, c: e.b / 2000, h: e.b, w: e.h, loops: s.loops.map((l) => ({ pts: l.pts.map((q) => [q[1], q[0]]) })) });
        }
        return SM.section(p);
    }
    const colCalc = memo((p) => {
        const m = MATS[p.mat], s = weakSec(p), K_ = KF[p.ends], Le = K_ * p.L, r = Math.sqrt(s.I / s.A), lam = Le / r;
        const lamC = PI * Math.sqrt((2 * m.E) / m.sy), Pe = (PI * PI * m.E * s.I) / (Le * Le), euler = lam >= lamC;
        const scr = euler ? (PI * PI * m.E) / (lam * lam) : m.sy - (m.sy * m.sy * lam * lam) / (4 * PI * PI * m.E), Pcr = scr * s.A, P = p.P * 1000;
        return { m, s, K: K_, Le, r, lam, lamC, Pe, euler, scr, Pcr, P, sf: P > 0 ? Pcr / P : Infinity, sigA: P / s.A, mass: m.rho * s.A * p.L, buckled: P >= Pcr };
    });
    const colScr = (m, lam) => { const lc = PI * Math.sqrt((2 * m.E) / m.sy); return lam >= lc ? (PI * PI * m.E) / (lam * lam) : m.sy - (m.sy * m.sy * lam * lam) / (4 * PI * PI * m.E); };
    const modeShape = { pp: (x) => Math.sin(PI * x), fc: (x) => 1 - Math.cos((PI * x) / 2), fp: (x) => 6.75 * x * x * (1 - x), ff: (x) => (1 - Math.cos(2 * PI * x)) / 2 };
    SM.addParts({
        st_col: pp('Column', 'العمود (الدعامة)', 'A slender compression member. Colour = axial + bending stress (blue = compression). It bows sideways as the load nears the critical load.', 'عنصر نحيل مضغوط. اللون = إجهاد محوري + انحناء (الأزرق ضغط). ينحني جانبياً كلما اقترب الحمل من الحمل الحرج.', 'Carries axial load down to the foundation.', 'ينقل الحمل المحوري إلى الأساس.', 'Buckling (sudden sideways collapse) long before the material yields; slender columns fail by instability, not strength.', 'الانبعاج (انهيار جانبي مفاجئ) قبل خضوع المادة بكثير؛ الأعمدة النحيلة تفشل بعدم الاستقرار لا بالمقاومة.'),
        st_end: pp('End supports', 'مساند الطرفين', 'Pinned ends rotate freely; fixed ends do not. The more the ends are restrained, the shorter the effective length K·L.', 'الطرف المفصلي يدور بحرية والمثبّت لا يدور. كلما زاد تقييد الطرفين قصر الطول الفعّال K·L.', 'Define the effective-length factor K.', 'تحدد معامل الطول الفعّال K.'),
        st_pload: pp('Axial load P', 'الحمل المحوري P', 'The red arrow: compressive load. Its length is relative to the critical load.', 'السهم الأحمر: حمل ضغط. طوله نسبي إلى الحمل الحرج.', 'Compresses the column.', 'يضغط العمود.')
    });
    SM.add('column', L2('Column buckling', 'انبعاج الأعمدة'), {
        controls: (p) => {
            const sec = (p || {}).sec || 'circle', c = [
                { type: 'title', label: L2('Column', 'العمود') },
                { id: 'ends', type: 'select', label: L2('End conditions', 'شروط الطرفين'), options: [{ v: 'pp', label: L2('Pinned – pinned (K = 1)', 'مفصلي – مفصلي (K = 1)') }, { v: 'fc', label: L2('Fixed – free (K = 2)', 'مثبّت – حر (K = 2)') }, { v: 'fp', label: L2('Fixed – pinned (K ≈ 0.7)', 'مثبّت – مفصلي (K ≈ 0.7)') }, { v: 'ff', label: L2('Fixed – fixed (K = 0.5)', 'مثبّت – مثبّت (K = 0.5)') }], value: 'pp', rebuild: true },
                { id: 'L', type: 'range', label: L2('Length L', 'الطول L'), min: 0.5, max: 6, step: 0.1, value: 2, unit: 'm', rebuild: true },
                { id: 'sec', type: 'select', label: L2('Section', 'المقطع'), options: [{ v: 'circle', label: L2('Solid round', 'دائري مصمت') }, { v: 'rect', label: L2('Rectangle', 'مستطيل') }, { v: 'tube', label: L2('Round tube', 'أنبوب دائري') }, { v: 'ipe', label: L2('I-beam (IPE)', 'مقطع I (IPE)') }], value: 'circle', rebuild: true }
            ];
            if (sec === 'circle') c.push({ id: 'd', type: 'range', label: L2('Diameter d', 'القطر d'), min: 10, max: 200, step: 5, value: 40, unit: 'mm', rebuild: true });
            if (sec === 'rect') c.push({ id: 'b', type: 'range', label: L2('Width b', 'العرض b'), min: 10, max: 200, step: 5, value: 40, unit: 'mm', rebuild: true }, { id: 'h', type: 'range', label: L2('Depth h', 'العمق h'), min: 10, max: 200, step: 5, value: 80, unit: 'mm', rebuild: true });
            if (sec === 'tube') c.push({ id: 'D', type: 'range', label: L2('Outer Ø D', 'القطر الخارجي D'), min: 20, max: 250, step: 5, value: 80, unit: 'mm', rebuild: true }, { id: 't', type: 'range', label: L2('Wall t', 'السماكة t'), min: 2, max: 20, step: 1, value: 4, unit: 'mm', rebuild: true });
            if (sec === 'ipe') c.push({ id: 'ipe', type: 'select', label: L2('IPE size', 'مقاس IPE'), options: Object.keys(SM.IPE).map((v) => ({ v, label: 'IPE ' + v })), value: 160, rebuild: true });
            c.push(matCtl('s235'), { type: 'title', label: L2('Load', 'الحمل') }, { id: 'P', type: 'range', label: L2('Axial load P', 'الحمل المحوري P'), min: 0, max: 1500, step: 5, value: 50, unit: 'kN', rebuild: true },
                { type: 'note', label: L2('Buckling is about the WEAK axis. A small initial crookedness L/500 is assumed, so the column bows more and more as P → P_cr.', 'الانبعاج حول المحور الضعيف. يُفترض اعوجاج أولي صغير L/500، فينحني العمود أكثر فأكثر كلما اقترب P من P_cr.') });
            return c;
        },
        build(p) {
            const c = colCalc(p), s = c.s, g = new THREE.Group(), VLc = 9, sx = VLc / p.L, n = 60;
            const kk = Math.max(1, 0.9 / ((Math.max(s.h, s.w) / 1000) * sx)), sc = (sx / 1000) * kk;
            const e0 = p.L / 500, amp = c.buckled ? 0.1 * p.L : e0 / (1 - c.P / c.Pcr), shape = modeShape[p.ends], mgv = 0.15 / (e0 * sx);
            const xsV = [], defV = [], dReal = [];
            for (let i = 0; i < n; i++) { const t = i / (n - 1), dr = amp * shape(t); xsV.push(-VLc / 2 + t * VLc); dReal.push(dr); defV.push(dr * sx * mgv); }
            const mxv = Math.max(1e-9, ...defV.map(Math.abs)), fv = Math.min(1, 2.4 / mxv); for (let i = 0; i < n; i++) defV[i] *= fv;
            const colorFn = (i, ymm) => SM.colorOf((-c.P / s.A + (c.P * dReal[i] * (ymm / 1000)) / s.I) / c.m.sy);
            const mesh = SM.beamMesh({ s }, p, xsV, defV, sc, colorFn); mesh.rotation.z = PI / 2;
            const col = new THREE.Group(); col.userData.id = 'st_col'; col.add(mesh); g.add(col);
            const xTop = -defV[n - 1], hh = Math.max(s.h, s.w) * sc, eg = new THREE.Group(); eg.userData.id = 'st_end';
            const slab = (y) => { const b = jaw(3.2, 0.35, 3.2); b.position.set(0, y, 0); return b; };
            const pin = (y, dir) => { const m = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.8, 4), lit(0x64748b)); m.position.set(0, y + dir * 0.4, 0); m.rotation.z = dir > 0 ? PI : 0; return m; };
            const yb = -VLc / 2, yt = VLc / 2;
            if (p.ends === 'pp') eg.add(pin(yb - 0.0, -1)); else eg.add(slab(yb - 0.18));
            if (p.ends === 'pp' || p.ends === 'fp') { const m = pin(yt + 0.0, 1); eg.add(m); } else if (p.ends === 'ff') eg.add(slab(yt + 0.18));
            if (p.ends === 'pp') eg.add(slab(yb - 0.9)); if (p.ends === 'pp' || p.ends === 'fp') { const b = slab(yt + 0.9); eg.add(b); }
            g.add(eg);
            const lg = new THREE.Group(); lg.userData.id = 'st_pload';
            if (c.P > 0) { const len = 1.0 + 1.4 * Math.min(1.6, c.P / c.Pcr); lg.add(SM.arrowDown(xTop, yt + 1.0, len, 0xdc2626, 0.1)); }
            g.add(lg);
            g.userData.fit = { w: 5, h: VLc / 2 + 2.2, dir: [0.35, 0.18, 1] }; g.userData.target = [0, 0, 0];
            return g;
        },
        readouts(p) {
            const c = colCalc(p), reg = c.euler ? L2('Euler (slender)', 'أولر (نحيل)') : L2('Johnson (intermediate)', 'جونسون (متوسط)'), lang = window.getLang ? window.getLang() : 'en';
            return [
                { k: L2('Status', 'الحالة'), v: c.buckled ? (lang === 'ar' ? 'انبعاج!' : 'BUCKLED!') : c.sf < 1.5 ? (lang === 'ar' ? 'قريب من الانبعاج' : 'close to buckling') : (lang === 'ar' ? 'مستقر' : 'stable'), state: c.buckled ? 'bad' : c.sf < 1.5 ? 'warn' : 'ok' },
                { k: L2('End-condition factor K', 'معامل شروط الطرفين K'), v: String(c.K) },
                { k: L2('Effective length K·L', 'الطول الفعّال K·L'), v: fmt(c.Le, 2) + ' m' },
                { k: L2('Radius of gyration r = √(I/A)  (weak axis)', 'نصف قطر العطالة r = √(I/A) (المحور الضعيف)'), v: fmt(c.r * 1000, 1) + ' mm' },
                { k: L2('Slenderness λ = K·L/r', 'النحافة λ = K·L/r'), v: fmt(c.lam, 0) },
                { k: L2('Slenderness limit λ_c = π√(2E/σ_y)', 'حد النحافة λ_c = π√(2E/σ_y)'), v: fmt(c.lamC, 0) },
                { k: L2('Formula in use', 'القانون المستعمل'), v: lang === 'ar' ? reg.ar : reg.en },
                { k: L2('Euler load P_e = π²EI/(KL)²', 'حمل أولر P_e = π²EI/(KL)²'), v: fmt(c.Pe / 1000, 0) + ' kN' },
                { k: L2('Critical load P_cr = σ_cr·A', 'الحمل الحرج P_cr = σ_cr·A'), v: fmt(c.Pcr / 1000, 0) + ' kN' },
                { k: L2('Critical stress σ_cr', 'الإجهاد الحرج σ_cr'), v: fmt(c.scr / 1e6, 0) + ' MPa' },
                { k: L2('Applied load P', 'الحمل المطبّق P'), v: fmt(c.P / 1000, 0) + ' kN' },
                { k: L2('Axial stress σ = P/A', 'الإجهاد المحوري σ = P/A'), v: fmt(c.sigA / 1e6, 0) + ' MPa' },
                { k: L2('Buckling safety factor P_cr / P', 'معامل أمان الانبعاج P_cr / P'), v: c.P > 0 ? fmt(c.sf, 2) : '—', state: c.P > 0 ? st(c.sf) : 'ok' },
                                { k: L2('Mass', 'الكتلة'), v: fmt(c.mass, 1) + ' kg' }
            ];
        },
        bom: (p) => bomOf('st_col', colCalc(p).mass),
        challenges: () => [
            CH('Round steel bar Ø ≤ 60, L ≥ 1 m: carry P ≥ 100 kN with buckling SF ≥ 2.', 'قضيب فولاذ دائري Ø ≤ 60 وL ≥ 1 m: احمل P ≥ 100 kN بمعامل أمان انبعاج ≥ 2.', (p) => p.sec === 'circle' && p.d <= 60 && p.L >= 1 && p.P >= 100 && colCalc(p).sf >= 2),
            CH('Fix both ends with an IPE ≤ 160: carry 200 kN on a column of at least 3 m with SF ≥ 1.5.', 'ثبّت الطرفين بمقطع IPE ≤ 160: احمل 200 kN على عمود طوله 3 m فأكثر بمعامل أمان ≥ 1.5.', (p) => p.ends === 'ff' && p.sec === 'ipe' && p.ipe <= 160 && p.L >= 3 && p.P >= 200 && colCalc(p).sf >= 1.5),
            CH('Make a slender column where EULER is the governing formula (λ ≥ λ limit) and it stands with a safety factor of at least 2.', 'اصنع عموداً نحيلاً يحكمه قانون أولر (λ ≥ حد النحافة) ويبقى واقفاً بمعامل أمان لا يقل عن 2.', (p) => { const c = colCalc(p); return c.euler && c.P > 0 && c.sf >= 2; }),
            CH('Buckle it! Raise P beyond P_cr.', 'انسف العمود! ارفع P فوق P_cr.', (p) => colCalc(p).buckled)
        ],
        panels(p) {
            const c = colCalc(p), cur = [{ x: c.lam, y: c.sigA / 1e6, label: 'P/A' }, { x: c.lam, y: c.scr / 1e6, label: 'σ_cr' }], lam = [], pl = [];
            for (let l = 20; l <= 300; l += 5) lam.push([l, Math.min(c.m.sy / 1e6, colScr(c.m, l) / 1e6)]);
            for (let L = 0.5; L <= 6.01; L += 0.25) { const lm = (c.K * L) / c.r, Pc = colScr(c.m, lm) * c.s.A; pl.push([L, Pc / 1000]); }
            const eu = []; for (let l = Math.max(c.lamC * 0.7, 20); l <= 300; l += 5) eu.push([l, Math.min(c.m.sy / 1e6 * 1.5, (PI * PI * c.m.E) / (l * l) / 1e6)]);
            return [
                { type: 'grad', title: L2('Colour = axial + bending stress', 'اللون = إجهاد محوري + انحناء'), unit: 'MPa', min: -c.m.sy / 1e6, max: c.m.sy / 1e6, h: 44 },
                { type: 'line', h: 200, title: L2('Critical stress vs slenderness', 'الإجهاد الحرج مقابل النحافة'), unit: 'MPa', xlabel: L2('Slenderness λ = KL/r', 'النحافة λ = KL/r'), xmin: 20, xmax: 300, ymin: 0, ymax: (c.m.sy / 1e6) * 1.15, series: [{ label: L2('σ_cr (Johnson → Euler)', 'σ_cr (جونسون ← أولر)'), pts: lam, fill: true }, { label: L2('Euler only', 'أولر فقط'), pts: eu }, { label: 'σ_y', pts: [[20, c.m.sy / 1e6], [300, c.m.sy / 1e6]] }], marks: cur },
                { type: 'line', h: 180, title: L2('Critical load vs column length', 'الحمل الحرج مقابل طول العمود'), unit: 'kN', xlabel: L2('Length L (m)', 'الطول L (m)'), xmin: 0.5, xmax: 6, ymin: 0, ymax: Math.max(...pl.map((q) => q[1]), c.P / 1000) * 1.1, series: [{ label: 'P_cr', pts: pl, fill: true }, { label: 'P', pts: [[0.5, c.P / 1000], [6, c.P / 1000]] }], marks: [{ x: p.L, y: c.Pcr / 1000, label: T2('here', 'هنا') }] }
            ];
        }
    });

    /* =====================================================================================
     * 4. PRESSURE VESSEL (Lamé)
     * ===================================================================================== */
    function lame(shape, ri, ro, pr, r) {
        if (shape === 'sph') { const k = (pr * Math.pow(ri, 3)) / (Math.pow(ro, 3) - Math.pow(ri, 3)); const t = k * (1 + Math.pow(ro, 3) / (2 * Math.pow(r, 3))), rr = k * (1 - Math.pow(ro, 3) / Math.pow(r, 3)); return { th: t, rad: rr, ax: t }; }
        const k = (pr * ri * ri) / (ro * ro - ri * ri); return { th: k * (1 + (ro * ro) / (r * r)), rad: k * (1 - (ro * ro) / (r * r)), ax: k };
    }
    const vm3 = (a, b, c) => Math.sqrt(0.5 * ((a - b) * (a - b) + (b - c) * (b - c) + (c - a) * (c - a)));
    const vesCalc = memo((p) => {
        const m = MATS[p.mat], ri = p.D / 2000, t = p.t / 1000, ro = ri + t, pr = p.p * 1e6, i = lame(p.shape, ri, ro, pr, ri), o = lame(p.shape, ri, ro, pr, ro);
        const vmI = vm3(i.th, i.rad, i.ax), tresca = Math.max(Math.abs(i.th - i.rad), Math.abs(i.th), Math.abs(i.rad), Math.abs(i.ax - i.rad)), rm = ri + t / 2;
        const thin = p.shape === 'sph' ? (pr * ri) / (2 * t) : (pr * ri) / t, err = (i.th - thin) / thin;
        const vol = p.shape === 'sph' ? (4 / 3) * PI * (Math.pow(ro, 3) - Math.pow(ri, 3)) : PI * (ro * ro - ri * ri) * (p.shape === 'cyl' ? 4 * ri : 0);
        const volIn = p.shape === 'sph' ? (4 / 3) * PI * Math.pow(ri, 3) : PI * ri * ri * 4 * ri;
        const sfOf = (tt) => { const R2 = ri + tt, a = lame(p.shape, ri, R2, pr, ri); return m.sy / vm3(a.th, a.rad, a.ax); };
        let lo = 1e-4, hi = 5; for (let k = 0; k < 40; k++) { const mid = (lo + hi) / 2; if (sfOf(mid) < 1.5) lo = mid; else hi = mid; }
        return { m, ri, ro, t, pr, i, o, vmI, tresca, sf: m.sy / Math.max(1, vmI), sfT: m.sy / Math.max(1, tresca), thin, err, ratio: t / ri, thick: t / ri > 0.1, tmin: hi, mass: m.rho * vol, E: pr * volIn, sfOf, pY: pr * (m.sy / Math.max(1, vmI)) };
    });
    SM.addParts({
        st_shell: pp('Vessel wall', 'جدار الوعاء', 'A quarter is cut away so you can see through the wall. Colour = von Mises stress. The inside surface is always the most stressed (Lamé).', 'قُطع ربع الوعاء لترى داخل الجدار. اللون = إجهاد فون ميزس. السطح الداخلي هو الأكثر إجهاداً دائماً (لامي).', 'Contains the pressure; carries hoop stress (around) and axial stress (along).', 'يحتوي الضغط؛ يتحمل إجهاد الحلقة (حول المحيط) والإجهاد المحوري (على الطول).', 'Bursts along the length (hoop stress is twice the axial one in a cylinder), fatigue from pressure cycling, corrosion thinning the wall.', 'ينفجر على طول الوعاء (إجهاد الحلقة ضعف المحوري في الأسطوانة)، إجهاد التعب من تكرار الضغط، والتآكل الذي يُنحف الجدار.'),
        st_cap: pp('End closures', 'الأغطية الطرفية', 'Closed ends add axial stress to the cylinder wall.', 'الأغطية المغلقة تضيف إجهاداً محورياً لجدار الأسطوانة.', 'Close the vessel.', 'تغلق الوعاء.'),
        st_press: pp('Internal pressure', 'الضغط الداخلي', 'The arrows inside show the pressure pushing the wall outwards in every direction.', 'الأسهم الداخلية تُظهر الضغط الذي يدفع الجدار نحو الخارج في كل الاتجاهات.', 'Loads the wall.', 'يحمّل الجدار.')
    });
    SM.add('vessel', L2('Pressure vessel', 'وعاء الضغط'), {
        controls: () => [
            { type: 'title', label: L2('Vessel', 'الوعاء') },
            { id: 'shape', type: 'select', label: L2('Shape', 'الشكل'), options: [{ v: 'cyl', label: L2('Cylinder (closed ends)', 'أسطوانة (بأغطية مغلقة)') }, { v: 'sph', label: L2('Sphere', 'كرة') }], value: 'cyl', rebuild: true },
            { id: 'D', type: 'range', label: L2('Inner diameter', 'القطر الداخلي'), min: 100, max: 2000, step: 50, value: 500, unit: 'mm', rebuild: true },
            { id: 't', type: 'range', label: L2('Wall thickness t', 'سماكة الجدار t'), min: 2, max: 100, step: 1, value: 10, unit: 'mm', rebuild: true },
            matCtl('s235'),
            { id: 'p', type: 'range', label: L2('Internal pressure p', 'الضغط الداخلي p'), min: 0.5, max: 40, step: 0.5, value: 5, unit: 'MPa', rebuild: true }
        ],
        build(p) {
            const c = vesCalc(p), g = new THREE.Group(), cyl = p.shape === 'cyl', Ri = 2.2, tv = clamp((c.t / c.ri) * Ri, 0.1, 2.6), Ro = Ri + tv, HL = 4.2, A = 1.5 * PI;
            const rOf = (v) => c.ri + (c.ro - c.ri) * v, vmAt = (v) => { const a = lame(p.shape, c.ri, c.ro, c.pr, rOf(v)); return SM.colorOf(vm3(a.th, a.rad, a.ax) / c.m.sy); };
            const gr = Grid(), rv = (v) => Ri + tv * v;
            if (cyl) {
                const P = (x, r, th) => [x, r * Math.cos(th), r * Math.sin(th)];
                gr.add(40, 60, (u, v) => ({ p: P(-HL + 2 * HL * v, Ro, u * A), c: vmAt(1) }));
                gr.add(40, 60, (u, v) => ({ p: P(-HL + 2 * HL * v, Ri, u * A), c: vmAt(0) }));
                [0, A].forEach((th) => gr.add(10, 30, (u, v) => ({ p: P(-HL + 2 * HL * v, rv(u), th), c: vmAt(u) })));
            } else {
                const P = (r, th, ph) => [-r * Math.cos(ph) * Math.sin(th), r * Math.cos(th), r * Math.sin(ph) * Math.sin(th)];
                gr.add(40, 48, (u, v) => ({ p: P(Ro, v * PI, u * A), c: vmAt(1) }));
                gr.add(40, 48, (u, v) => ({ p: P(Ri, v * PI, u * A), c: vmAt(0) }));
                [0, A].forEach((ph) => gr.add(10, 36, (u, v) => ({ p: P(rv(u), v * PI, ph), c: vmAt(u) })));
            }
            const sh = gr.mesh(); sh.userData.id = 'st_shell'; g.add(sh);
            if (cyl) {
                const cg = new THREE.Group(); cg.userData.id = 'st_cap';
                [-1, 1].forEach((sd) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(Ro, Ro, 0.3, 40, 1, false, -PI, A), lit(0x64748b)); m.rotation.z = PI / 2; m.position.x = sd * (HL + 0.15); cg.add(m); });
                g.add(cg);
            }
            const pg = new THREE.Group(); pg.userData.id = 'st_press'; const ln = 0.5 + Math.min(0.9, c.pr / 30e6);
            const nth = 5, nx = cyl ? 4 : 5;
            if (cyl) { for (let i = 0; i < nx; i++) for (let j = 0; j < nth; j++) { const x = -HL + 0.6 + (i * (2 * HL - 1.2)) / (nx - 1), th = 0.15 * PI + (j * (A - 0.3 * PI)) / (nth - 1); pg.add(dirArrow([x, (Ri - 0.12 - ln) * Math.cos(th), (Ri - 0.12 - ln) * Math.sin(th)], [0, Math.cos(th), Math.sin(th)], ln, 0x2563eb, 0.05)); } }
            else { for (let i = 1; i < 5; i++) for (let j = 0; j < 5; j++) { const th = (i * PI) / 5, ph = 0.15 * PI + (j * (A - 0.3 * PI)) / 4, d = [-Math.cos(ph) * Math.sin(th), Math.cos(th), Math.sin(ph) * Math.sin(th)], r0 = Ri - 0.12 - ln; pg.add(dirArrow([d[0] * r0, d[1] * r0, d[2] * r0], d, ln, 0x2563eb, 0.05)); } }
            g.add(pg);
            if (cyl) g.rotation.x = PI / 2; else g.rotation.y = PI;
            g.userData.fit = { w: cyl ? 7 : 4.6, h: 4.6, dir: [0.7, 0.55, 1] }; g.userData.target = [0, 0, 0];
            return g;
        },
        readouts(p) {
            const c = vesCalc(p), cyl = p.shape === 'cyl';
            return [
                { k: L2('Wall class  (t / r_i)', 'نوع الجدار  (t / r_i)'), v: (window.getLang && window.getLang() === 'ar' ? (c.thick ? 'جدار سميك' : 'جدار رقيق') : (c.thick ? 'thick-wall' : 'thin-wall')) + ' · ' + fmt(c.ratio, 3), state: c.thick ? 'warn' : 'ok' },
                { k: L2('Hoop stress σ_θ  inner → outer', 'إجهاد الحلقة σ_θ  داخلي ← خارجي'), v: fmt(c.i.th / 1e6, 1) + ' → ' + fmt(c.o.th / 1e6, 1) + ' MPa' },
                { k: cyl ? L2('Axial stress σ_a (closed ends)', 'الإجهاد المحوري σ_a (أغطية مغلقة)') : L2('Sphere: equal in all tangent directions', 'الكرة: متساوٍ في كل الاتجاهات المماسية'), v: fmt(c.i.ax / 1e6, 1) + ' MPa' },
                { k: L2('Radial stress σ_r (inner = −p)', 'الإجهاد الشعاعي σ_r (داخلي = −p)'), v: fmt(c.i.rad / 1e6, 1) + ' MPa' },
                { k: L2('Thin-wall estimate  p·r/t' + (cyl ? '' : '/2') + '  (error vs Lamé)', 'تقدير الجدار الرقيق  p·r/t' + (cyl ? '' : '/2') + '  (الخطأ عن لامي)'), v: fmt(c.thin / 1e6, 1) + ' MPa  (' + fmt(c.err * 100, 1) + ' %)', state: Math.abs(c.err) > 0.1 ? 'warn' : 'ok' },
                { k: L2('von Mises at the bore  ·  SF', 'فون ميزس عند التجويف  ·  SF'), v: fmt(c.vmI / 1e6, 1) + ' MPa · SF ' + fmt(c.sf, 2), state: st(c.sf) },
                                { k: L2('Pressure at first yield', 'الضغط عند أول خضوع'), v: fmt(c.pY / 1e6, 1) + ' MPa' },
                { k: L2('Minimum wall for SF = 1.5', 'أقل سماكة لـ SF = 1.5'), v: fmt(c.tmin * 1000, 1) + ' mm  (now ' + p.t + ' mm)', state: p.t * 1 >= c.tmin * 1000 ? 'ok' : 'bad' },
                { k: L2('Stored energy ≈ p·V  ·  mass', 'الطاقة المخزّنة ≈ p·V  ·  الكتلة'), v: fmt(c.E / 1e6, 2) + ' MJ  ·  ' + fmt(c.mass, 0) + ' kg' }
            ];
        },
        bom: (p) => bomOf('st_shell', vesCalc(p).mass),
        challenges: () => [
            CH('Hold p ≥ 10 MPa in a vessel of Ø ≥ 500: SF between 2 and 2.4 (safe, but no wasted steel).', 'احتوِ ضغطاً p ≥ 10 MPa في وعاء Ø ≥ 500: معامل أمان بين 2 و2.4 (آمن دون هدر فولاذ).', (p) => { const c = vesCalc(p); return p.p >= 10 && p.D >= 500 && c.sf >= 2 && c.sf <= 2.4; }),
            CH('Sphere: make its peak stress ≤ 55 % of the same-size cylinder at the same pressure.', 'كرة: اجعل أقصى إجهاد فيها ≤ 55% من أسطوانة بنفس المقاس والضغط.', (p) => { if (p.shape !== 'sph') return false; const a = vesCalc(p), b = vesCalc(Object.assign({}, p, { shape: 'cyl' })); return a.i.th <= 0.55 * b.i.th; }),
            CH('Thick wall: find a vessel where the thin-wall formula is wrong by more than 15 % (cylinder).', 'جدار سميك: جِد وعاءً تخطئ فيه صيغة الجدار الرقيق بأكثر من 15% (أسطوانة).', (p) => p.shape === 'cyl' && Math.abs(vesCalc(p).err) > 0.15),
            CH('Aluminium air vessel: p ≥ 20 MPa, Ø ≥ 300, SF ≥ 1.5.', 'وعاء هواء من الألومنيوم: p ≥ 20 MPa وØ ≥ 300 وSF ≥ 1.5.', (p) => p.mat === 'al' && p.p >= 20 && p.D >= 300 && vesCalc(p).sf >= 1.5)
        ],
        panels(p) {
            const c = vesCalc(p), s1 = [], s2 = [], s3 = [], sf = [];
            for (let i = 0; i <= 20; i++) { const r = c.ri + ((c.ro - c.ri) * i) / 20, a = lame(p.shape, c.ri, c.ro, c.pr, r), x = r * 1000; s1.push([x, a.th / 1e6]); s2.push([x, a.rad / 1e6]); s3.push([x, a.ax / 1e6]); }
            for (let t = 2; t <= 100; t += 2) sf.push([t, Math.min(8, c.sfOf(t / 1000))]);
            const all = s1.concat(s2, s3).map((q) => q[1]);
            const cur = [{ x: p.t, y: Math.min(8, c.sf), label: T2('now', 'الآن') }];
            return [
                { type: 'grad', title: L2('Colour = von Mises / yield', 'اللون = فون ميزس / الخضوع'), unit: 'MPa', min: 0, max: c.m.sy / 1e6, h: 44 },
                { type: 'line', h: 190, title: L2('Stress through the wall (Lamé)', 'الإجهاد عبر الجدار (لامي)'), unit: 'MPa', xlabel: L2('Radius r (mm)', 'نصف القطر r (mm)'), xmin: c.ri * 1000, xmax: c.ro * 1000, ymin: Math.min(0, ...all) * 1.1, ymax: Math.max(...all) * 1.1, series: [{ label: 'σ_θ', pts: s1, fill: true }, { label: 'σ_r', pts: s2 }, { label: 'σ_a', pts: s3 }] },
                { type: 'line', h: 170, title: L2('Safety factor vs wall thickness', 'معامل الأمان مقابل سماكة الجدار'), unit: 'SF', xlabel: L2('Wall t (mm)', 'الجدار t (mm)'), xmin: 2, xmax: 100, ymin: 0, ymax: 8, series: [{ label: 'SF', pts: sf, fill: true }, { label: 'SF = 1.5', pts: [[2, 1.5], [100, 1.5]] }], marks: cur }
            ];
        }
    });

    /* =====================================================================================
     * 5. MOHR'S CIRCLE (plane stress)
     * ===================================================================================== */
    const mohrCalc = memo((p) => {
        const a = (p.sx + p.sy) / 2, d = (p.sx - p.sy) / 2, R = Math.hypot(d, p.txy), s1 = a + R, s2 = a - R, thp = 0.5 * Math.atan2(p.txy, d), th = (p.th * PI) / 180;
        const sxr = a + d * Math.cos(2 * th) + p.txy * Math.sin(2 * th), syr = a - d * Math.cos(2 * th) - p.txy * Math.sin(2 * th), txr = -d * Math.sin(2 * th) + p.txy * Math.cos(2 * th);
        const sy = MATS[p.mat].sy / 1e6, vm = Math.sqrt(s1 * s1 - s1 * s2 + s2 * s2), tr = Math.max(Math.abs(s1 - s2), Math.abs(s1), Math.abs(s2)), tabs = tr / 2;
        return { a, d, R, s1, s2, thp: (thp * 180) / PI, th, sxr, syr, txr, vm, tr, tabs, sfV: sy / Math.max(1e-6, vm), sfT: sy / Math.max(1e-6, tr), sy };
    });
    SM.addParts({
        st_elem: pp('Stress element', 'عنصر الإجهاد', 'A tiny square of material at the point of interest, shown rotated by θ. Red arrows pull (tension), blue push (compression), orange arrows are shear.', 'مربع صغير من المادة عند النقطة المدروسة، مدوّر بزاوية θ. الأسهم الحمراء شدّ والزرقاء ضغط والبرتقالية قص.', 'Shows that the same stress state gives different numbers on different planes.', 'يُظهر أن حالة الإجهاد نفسها تعطي أرقاماً مختلفة على مستويات مختلفة.'),
        st_stress: pp('Stress arrows', 'أسهم الإجهاد', 'Arrow length is proportional to the stress magnitude on that face.', 'طول السهم يتناسب مع مقدار الإجهاد على ذلك الوجه.', 'Visualise σ and τ.', 'تصوّر σ و τ.')
    });
    SM.add('mohr', L2("Mohr's circle", 'دائرة مور'), {
        controls: () => [
            { type: 'title', label: L2('Stress state (plane stress, MPa)', 'حالة الإجهاد (إجهاد مستوٍ، MPa)') },
            { id: 'sx', type: 'range', label: L2('σx (+ tension)', 'σx (+ شد)'), min: -200, max: 200, step: 5, value: 80, unit: 'MPa', rebuild: true },
            { id: 'sy', type: 'range', label: L2('σy', 'σy'), min: -200, max: 200, step: 5, value: -20, unit: 'MPa', rebuild: true },
            { id: 'txy', type: 'range', label: L2('τxy', 'τxy'), min: -200, max: 200, step: 5, value: 40, unit: 'MPa', rebuild: true },
            { id: 'th', type: 'range', label: L2('Rotate element θ', 'تدوير العنصر θ'), min: -90, max: 90, step: 1, value: 0, unit: '°', rebuild: true },
            { id: 'goP', type: 'button', label: L2('Go to principal planes (τ′ = 0)', 'إلى المستويات الرئيسية (τ′ = 0)'), run: (p) => { p.th = Math.round(mohrCalc(Object.assign({}, p)).thp); } },
            { id: 'goS', type: 'button', label: L2('Go to max shear planes', 'إلى مستويات القص الأعظم'), run: (p) => { const t = Math.round(mohrCalc(p).thp + 45); p.th = t > 90 ? t - 90 : t; } },
            { id: 'z', type: 'button', label: L2('θ = 0', 'θ = 0'), run: (p) => { p.th = 0; } },
            matCtl('s235')
        ],
        build(p) {
            const c = mohrCalc(p), g = new THREE.Group(), ref = Math.max(60, Math.abs(c.s1), Math.abs(c.s2), Math.abs(c.sxr), Math.abs(c.syr), Math.abs(c.txr)), S = 1.7;
            const colF = (v) => new THREE.Color().setRGB(...SM.colorOf(v / ref * 0.8));
            const mats = [colF(c.sxr), colF(c.sxr), colF(c.syr), colF(c.syr), new THREE.Color(0xe5e7eb), new THREE.Color(0xe5e7eb)].map((cl) => lit(cl, { roughness: 0.6 }));
            const box = new THREE.Mesh(new THREE.BoxGeometry(2 * S, 2 * S, 0.5), mats); const el = new THREE.Group(); el.userData.id = 'st_elem'; el.add(box);
            const ghost = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2 * S, 2 * S, 0.5)), new THREE.LineBasicMaterial({ color: 0x64748b }));
            g.add(ghost);
            const sg = new THREE.Group(); sg.userData.id = 'st_stress';
            const len = (v) => 0.35 + (1.5 * Math.abs(v)) / ref;
            // normal arrows: tension pulls outward (arrow starts at face, points out), compression pushes inward (arrow ends at face)
            const nArrow = (axis, sgn, v) => {
                if (Math.abs(v) < 0.5) return; const l = len(v), col = v > 0 ? 0xdc2626 : 0x2563eb, out = axis === 'x' ? [sgn, 0, 0] : [0, sgn, 0];
                const start = v > 0 ? S + 0.05 : S + 0.05 + l, dir = v > 0 ? out : out.map((q) => -q);
                sg.add(dirArrow(axis === 'x' ? [sgn * start, 0, 0.3] : [0, sgn * start, 0.3], dir, l, col, 0.07));
            };
            nArrow('x', 1, c.sxr); nArrow('x', -1, c.sxr); nArrow('y', 1, c.syr); nArrow('y', -1, c.syr);
            // shear: +x face → +y, −x face → −y, +y face → +x, −y face → −x for positive τ'
            const sArrow = (pos, dir, v) => { if (Math.abs(v) < 0.5) return; const l = len(v) * 0.9, s = Math.sign(v); sg.add(dirArrow([pos[0] - (dir[0] * s * l) / 2, pos[1] - (dir[1] * s * l) / 2, 0.3], [dir[0] * s, dir[1] * s, 0], l, 0xf97316, 0.06)); };
            sArrow([S + 0.2, 0], [0, 1], c.txr); sArrow([-S - 0.2, 0], [0, -1], c.txr); sArrow([0, S + 0.2], [1, 0], c.txr); sArrow([0, -S - 0.2], [-1, 0], c.txr);
            el.add(sg); el.rotation.z = c.th; g.add(el);
            // original axes
            const ax = (dx, dy, col) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.6, 6), lit(col)); m.position.set(dx * -4.6 + (dx ? 0.8 : 0), dy * -3.3 + (dy ? 0.8 : 0), 0); if (dx) m.rotation.z = PI / 2; return m; };
            const axg = new THREE.Group(); const xa = ax(1, 0, 0xdc2626); xa.position.set(-4.6, -3.3, 0); const ya = ax(0, 1, 0x16a34a); ya.position.set(-5.4, -2.5, 0); axg.add(xa, ya); g.add(axg);
            g.userData.fit = { w: 6, h: 4.6, dir: [0.1, 0.1, 1] }; g.userData.target = [0, 0, 0];
            return g;
        },
        readouts(p) {
            const c = mohrCalc(p), f = (v) => fmt(v, 1) + ' MPa', f0 = (v) => fmt(v, 1);
            return [
                { k: L2('Centre σ_avg = (σx+σy)/2', 'المركز σ_avg = (σx+σy)/2'), v: f0(c.a) + ' MPa' },
                { k: L2('Radius R', 'نصف القطر R'), v: f0(c.R) + ' MPa' },
                { k: L2('Principal stresses σ₁ / σ₂', 'الإجهادان الرئيسيان σ₁ / σ₂'), v: f0(c.s1) + ' / ' + f0(c.s2) + ' MPa' },
                { k: L2('Principal angle θ_p (from x-axis)', 'الزاوية الرئيسية θ_p (من محور x)'), v: fmt(c.thp, 1) + '°' },
                { k: L2('Max in-plane shear τ_max = R', 'أكبر قص في المستوى τ_max = R'), v: f(c.R) + ' @ ' + fmt(((c.thp + 45 + 90) % 90) > 45 ? c.thp - 45 : c.thp + 45, 1) + '°' },
                { k: L2('Absolute max shear (incl. σ₃ = 0)', 'أكبر قص مطلق (مع σ₃ = 0)'), v: f(c.tabs) },
                { k: L2('Element at θ = ' + p.th + '°:  σx′ / σy′ / τ′', 'العنصر عند θ = ' + p.th + '°:  σx′ / σy′ / τ′'), v: f0(c.sxr) + ' / ' + f0(c.syr) + ' / ' + f0(c.txr) + ' MPa' },
                                                { k: L2('Tresca  ·  SF', 'تريسكا  ·  SF'), v: f0(c.tr) + ' MPa · SF ' + fmt(c.sfT, 2), state: st(c.sfT) },
                            ];
        },
        challenges: () => [
            CH('Pure shear: σx = σy = 0, τ ≥ 50, then rotate to 45° — principal stresses are ±τ.', 'قص صرف: σx = σy = 0 وτ ≥ 50، ثم دوّر إلى 45° — الإجهادان الرئيسيان ±τ.', (p) => Math.abs(p.sx) < 1 && Math.abs(p.sy) < 1 && Math.abs(p.txy) >= 50 && Math.abs(Math.abs(p.th) - 45) < 1),
            CH('Rotate to the principal planes (shear on the element ≈ 0) for a state with σ₁ ≥ 100 MPa.', 'دوّر إلى المستويات الرئيسية (القص على العنصر ≈ 0) لحالة فيها σ₁ ≥ 100 MPa.', (p) => { const c = mohrCalc(p); return c.s1 >= 100 && c.R > 5 && Math.abs(c.txr) <= 0.02 * c.R; }),
            CH('Uniaxial tension σx ≥ 100 (σy = τ = 0): rotate to 45° — the max shear is half of σx.', 'شد أحادي σx ≥ 100 (σy = τ = 0): دوّر إلى 45° — أكبر قص نصف σx.', (p) => p.sx >= 100 && p.sy === 0 && p.txy === 0 && Math.abs(Math.abs(p.th) - 45) < 1)
        ],
        draw(canvas, p, info) {
            const c = mohrCalc(p), dpr = Math.min(window.devicePixelRatio || 1, 2), W = Math.max(280, canvas.clientWidth || 320), H1 = Math.round(W * 0.88), H2 = 170, H = H1 + H2 + 30;
            canvas.style.height = H + 'px'; canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
            const x = canvas.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, W, H);
            const dark = info && info.dark, ink = dark ? '#e5e7eb' : '#111827', mute = dark ? '#9ca3af' : '#6b7280', grid = dark ? '#374151' : '#e5e7eb', blue = dark ? '#38bdf8' : '#0284c7', red = dark ? '#f87171' : '#dc2626', orange = dark ? '#fbbf24' : '#d97706', green = dark ? '#4ade80' : '#16a34a';
            const ar = info && info.lang === 'ar', tx = (a, b) => (ar ? b : a);
            x.fillStyle = ink; x.font = '700 13px Cairo, Inter, sans-serif'; x.textAlign = ar ? 'right' : 'left'; x.textBaseline = 'middle';
            x.fillText(tx("Mohr's circle", 'دائرة مور') + '  (MPa)', ar ? W - 8 : 8, 14);
            const pad = 34, top = 30, pw = W - 2 * pad, ph = H1 - top - 26;
            const xmin = Math.min(0, c.s2) - 0.15 * c.R - 10, xmax = Math.max(0, c.s1) + 0.15 * c.R + 10, ymax = Math.max(c.R * 1.25, 20);
            const sc = Math.min(pw / (xmax - xmin), ph / (2 * ymax)), cx0 = pad + (pw - sc * (xmax - xmin)) / 2, cy0 = top + ph / 2;
            const X = (s) => cx0 + (s - xmin) * sc, Y = (t) => cy0 - t * sc;
            // axes
            x.strokeStyle = mute; x.lineWidth = 1; x.beginPath(); x.moveTo(pad - 8, Y(0)); x.lineTo(W - pad + 8, Y(0)); x.moveTo(X(0), top - 4); x.lineTo(X(0), top + ph + 4); x.stroke();
            x.fillStyle = mute; x.font = '11px Inter, sans-serif'; x.textAlign = 'center'; x.fillText('σ', W - pad + 6, Y(0) - 9); x.fillText('τ', X(0) + 9, top - 8);
            // ticks
            const step = [10, 20, 25, 50, 100, 200].find((s) => (xmax - xmin) / s <= 8) || 200;
            x.strokeStyle = grid; for (let v = Math.ceil(xmin / step) * step; v <= xmax; v += step) { x.beginPath(); x.moveTo(X(v), Y(0) - 3); x.lineTo(X(v), Y(0) + 3); x.strokeStyle = mute; x.stroke(); x.fillStyle = mute; x.textAlign = 'center'; if (Math.abs(v) > 1e-6) x.fillText(String(v), X(v), Y(0) + 14); }
            // circle
            x.strokeStyle = blue; x.lineWidth = 2; x.beginPath(); x.arc(X(c.a), Y(0), c.R * sc, 0, 2 * PI); x.stroke();
            x.globalAlpha = 0.07; x.fillStyle = blue; x.fill(); x.globalAlpha = 1;
            const dot = (s, t, col, lab, dx, dy) => { x.fillStyle = col; x.beginPath(); x.arc(X(s), Y(t), 4, 0, 2 * PI); x.fill(); x.font = '700 11px Inter, sans-serif'; x.textAlign = 'center'; x.fillText(lab, X(s) + dx, Y(t) + dy); };
            // X (σx, −τxy) and Y (σy, +τxy)
            x.strokeStyle = mute; x.lineWidth = 1.2; x.setLineDash([4, 3]); x.beginPath(); x.moveTo(X(p.sx), Y(-p.txy)); x.lineTo(X(p.sy), Y(p.txy)); x.stroke(); x.setLineDash([]);
            // rotated diameter
            x.strokeStyle = red; x.lineWidth = 2; x.beginPath(); x.moveTo(X(c.sxr), Y(-c.txr)); x.lineTo(X(c.syr), Y(c.txr)); x.stroke();
            // arc 2θ
            const a0 = Math.atan2(-p.txy, c.d), r0 = Math.max(14, c.R * sc * 0.28);
            if (Math.abs(c.th) > 0.01) { x.strokeStyle = green; x.lineWidth = 1.6; x.beginPath(); x.arc(X(c.a), Y(0), r0, -a0, -(a0 + 2 * c.th), c.th > 0); x.stroke(); x.fillStyle = green; x.font = '700 11px Inter, sans-serif'; x.textAlign = 'center'; x.fillText('2θ', X(c.a) + (r0 + 12) * Math.cos(a0 + c.th), Y(0) - (r0 + 12) * Math.sin(a0 + c.th)); }
            dot(c.a, 0, mute, '', 0, 0);
            dot(p.sx, -p.txy, blue, 'X', 0, -10); dot(p.sy, p.txy, blue, 'Y', 0, 14);
            dot(c.sxr, -c.txr, red, "X′", 0, c.txr > 0 ? 14 : -10); dot(c.syr, c.txr, red, "Y′", 0, c.txr > 0 ? -10 : 14);
            dot(c.s1, 0, orange, 'σ₁', 0, 16); dot(c.s2, 0, orange, 'σ₂', 0, 16);
            dot(c.a, c.R, orange, 'τmax', 22, -6); dot(c.a, -c.R, orange, '', 0, 0);
            // value sinusoids
            const y0 = H1 + 20; x.fillStyle = ink; x.font = '700 13px Cairo, Inter, sans-serif'; x.textAlign = ar ? 'right' : 'left'; x.fillText(tx('Stress on the plane vs. angle θ', 'الإجهاد على المستوى مقابل الزاوية θ'), ar ? W - 8 : 8, y0);
            const gx0 = pad, gx1 = W - pad, gy0 = y0 + 14, gh = H2 - 30, vm = Math.max(c.R + Math.abs(c.a), 20) * 1.1, GX = (t) => gx0 + ((t + 90) / 180) * (gx1 - gx0), GY = (v) => gy0 + gh / 2 - (v / vm) * (gh / 2);
            x.strokeStyle = grid; x.lineWidth = 1; x.beginPath(); x.moveTo(gx0, GY(0)); x.lineTo(gx1, GY(0)); x.moveTo(GX(0), gy0); x.lineTo(GX(0), gy0 + gh); x.stroke();
            const plot = (fn, col) => { x.strokeStyle = col; x.lineWidth = 2; x.beginPath(); for (let t = -90; t <= 90; t += 2) { const v = fn((t * PI) / 180), px = GX(t), py = GY(v); if (t === -90) x.moveTo(px, py); else x.lineTo(px, py); } x.stroke(); };
            plot((q) => c.a + c.d * Math.cos(2 * q) + p.txy * Math.sin(2 * q), blue); plot((q) => -c.d * Math.sin(2 * q) + p.txy * Math.cos(2 * q), orange);
            x.fillStyle = red; x.beginPath(); x.arc(GX(p.th), GY(c.sxr), 4, 0, 2 * PI); x.fill(); x.beginPath(); x.arc(GX(p.th), GY(c.txr), 4, 0, 2 * PI); x.fill();
            x.direction = 'ltr'; x.font = '11px Inter, sans-serif'; x.textAlign = 'left'; x.fillStyle = blue; x.fillText("σx′", gx0, gy0 + gh + 12); x.fillStyle = orange; x.fillText("τ′", gx0 + 30, gy0 + gh + 12); x.fillStyle = mute; x.textAlign = 'right'; x.fillText('θ: −90° … +90°', gx1, gy0 + gh + 12);
        }
    });
})();
