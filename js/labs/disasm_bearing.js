/* Disassembly lab — deep-groove ball bearing (series 62xx) with life and defect-frequency calculations. */
(function () {
    'use strict';
    const DIS = window.DIS;
    if (!DIS) return;
    const { L2, mat, COL, DEN, latheZ, tubeZ, cylZ, boxM, at, volTube, CH, fmt, K, P } = DIS;
    const PI = Math.PI;

    const BRG = {
        6204: { d: 20, D: 47, B: 14, C: 13.5, Db: 7.94 },
        6205: { d: 25, D: 52, B: 15, C: 14.8, Db: 7.94 },
        6206: { d: 30, D: 62, B: 16, C: 20.3, Db: 9.53 },
        6208: { d: 40, D: 80, B: 18, C: 32.5, Db: 12.7 },
        6210: { d: 50, D: 90, B: 20, C: 35.1, Db: 12.7 }
    };
    function dims(code) {
        const b = BRG[code] || BRG[6205];
        const dm = (b.d + b.D) / 2, Z = Math.round((0.62 * PI * dm) / b.Db), rg = 0.52 * b.Db, f0 = (50 * PI) / 180;
        const rco = dm / 2 + b.Db / 2 - rg, rci = dm / 2 - b.Db / 2 + rg;
        return Object.assign({ code, dm, Z, rg, f0, z0: rg * Math.sin(f0), rco, rci, Rso: rco + rg * Math.cos(f0), Rsi: rci - rg * Math.cos(f0) }, b);
    }
    DIS.bearingDims = dims;
    const tolBore = (d) => (d <= 30 ? 10 : d <= 50 ? 12 : 15);
    const tolOD = (D) => (D <= 50 ? 9 : D <= 80 ? 11 : 13);

    /* All meshes of one bearing, ready to be placed in parts. */
    function bearingMeshes(d, seal) {
        const { D, B, Db, dm, Z, rg, f0, z0, rco, rci, Rso, Rsi } = d;
        const ring = mat(COL.hard, { metalness: 0.3, roughness: 0.42 });
        const arc = (rc, sign, a, b, n) => { const o = []; for (let i = 0; i <= n; i++) { const f = a + ((b - a) * i) / n; o.push([rc + sign * rg * Math.cos(f), rg * Math.sin(f)]); } return o; };
        const outerPts = [[D / 2, -B / 2], [D / 2, B / 2], [Rso, B / 2], [Rso, z0], ...arc(rco, +1, f0, -f0, 18), [Rso, -z0], [Rso, -B / 2], [D / 2, -B / 2]];
        const innerPts = [[d.d / 2, -B / 2], [Rsi, -B / 2], [Rsi, -z0], ...arc(rci, -1, -f0, f0, 18), [Rsi, z0], [Rsi, B / 2], [d.d / 2, B / 2], [d.d / 2, -B / 2]];
        const outer = latheZ(outerPts, ring, 72), inner = latheZ(innerPts, ring, 72);
        // orientation mark on the inner ring face
        const mk = boxM(1.6, 1.0, 0.5, mat(0xf59e0b)); mk.position.set((d.d / 2 + Rsi) / 2, 0, B / 2 + 0.2); inner.add(mk);
        const balls = new THREE.Group(), bgeo = new THREE.SphereGeometry(Db / 2, 22, 16), bmat = mat(0xe8edf3, { metalness: 0.35, roughness: 0.25 });
        for (let k = 0; k < Z; k++) { const a = (k * 2 * PI) / Z; const m = new THREE.Mesh(bgeo, bmat); m.position.set((dm / 2) * Math.cos(a), (dm / 2) * Math.sin(a), 0); balls.add(m); }
        const cm = mat(0x6b7a8d, { metalness: 0.3, roughness: 0.5 });
        const ro = dm / 2 + 0.3 * Db, ri = dm / 2 - 0.3 * Db, th = 0.13 * Db;
        const cageB = new THREE.Group(); cageB.add(at(tubeZ(ro, ri, th, cm, 64), 0, 0, -0.575 * Db));
        const cageA = new THREE.Group(); cageA.add(at(tubeZ(ro, ri, th, cm, 64), 0, 0, 0.575 * Db));
        for (let k = 0; k < Z; k++) { const a = ((k + 0.5) * 2 * PI) / Z; cageA.add(at(cylZ(0.1 * Db, 1.085 * Db, 10, cm), (dm / 2) * Math.cos(a), (dm / 2) * Math.sin(a), 0.0325 * Db)); }
        let sealA = null, sealB = null;
        if (seal !== 'none') {
            const sm = seal === 'seal' ? mat(COL.rubber, { metalness: 0.1, roughness: 0.8 }) : mat(0xaab4c0, { metalness: 0.7, roughness: 0.3 });
            const mkS = (z) => at(tubeZ(Rso + 0.3, Rsi + 0.5, 0.8, sm, 64), 0, 0, z);
            sealA = mkS(B / 2 - 0.6); sealB = mkS(-(B / 2 - 0.6));
        }
        const V = {
            outer: PI * B * Math.pow(D / 2, 2) - PI * B * Math.pow((Rso + rco + rg) / 2, 2),
            inner: PI * B * Math.pow((Rsi + (dm / 2 - Db / 2)) / 2, 2) - PI * B * Math.pow(d.d / 2, 2),
            ball: (4 / 3) * PI * Math.pow(Db / 2, 3),
            cageB: volTube(ro, ri, th), cageA: volTube(ro, ri, th) + Z * PI * Math.pow(0.1 * Db, 2) * 1.085 * Db,
            seal: volTube(Rso + 0.3, Rsi + 0.5, 0.8)
        };
        return { outer, inner, balls, cageA, cageB, sealA, sealB, V };
    }
    DIS.bearingMeshes = bearingMeshes;

    const lifeH = (d, p) => (Math.pow(d.C / p.fr, 3) * 1e6) / (60 * p.rpm);

    DIS.addParts({
        brg_outer: P(L2('Outer ring', 'الحلقة الخارجية'), L2('Sits in the housing bore. Its inner groove (raceway) guides the balls.', 'تجلس داخل ثقب الهيكل، ومجراها الداخلي (المسار) يوجّه الكريات.'),
            L2('100Cr6 (SAE 52100) bearing steel, 58–65 HRC', 'فولاذ المحامل 100Cr6 (SAE 52100) بصلادة 58–65 HRC'), L2('Carries the load from the balls into the housing.', 'تنقل الحمل من الكريات إلى الهيكل.'),
            L2('Rolled/forged ring → turned → through-hardened → raceway ground and superfinished', 'حلقة مدرفلة/مطروقة ← خراطة ← تقسية شاملة ← جلخ المسار وتشطيب فائق'),
            L2('OD tolerance −9…−13 µm (normal class); raceway Ra ≈ 0.1 µm', 'سماحية القطر الخارجي −9…−13 µm (فئة عادية)؛ خشونة المسار Ra ≈ 0.1 µm'), L2('ISO 15 (dimensions), ISO 492 (tolerances)', 'ISO 15 (الأبعاد)، ISO 492 (السماحيات)'),
            L2('Press into the housing bore (H7) with a tube that pushes on the OUTER ring only.', 'تُكبس في ثقب الهيكل (H7) بأنبوب يضغط على الحلقة الخارجية فقط.')),
        brg_inner: P(L2('Inner ring', 'الحلقة الداخلية'), L2('Fits on the shaft and turns with it. Its groove carries the balls.', 'تركّب على العمود وتدور معه، ومجراها يحمل الكريات.'),
            L2('100Cr6 bearing steel, 58–65 HRC', 'فولاذ المحامل 100Cr6 بصلادة 58–65 HRC'), L2('Transfers the shaft load to the balls.', 'تنقل حمل العمود إلى الكريات.'),
            L2('Same route as the outer ring; bore ground to a tight tolerance', 'نفس مسار الحلقة الخارجية؛ ويُجلخ الثقب بسماحية ضيقة'),
            L2('Bore tolerance 0…−10 µm (d ≤ 30 mm); shaft seat k5/k6 gives a light interference fit', 'سماحية الثقب 0…−10 µm (d ≤ 30 mm)؛ ومقعد العمود k5/k6 يعطي توافقاً مشدوداً خفيفاً'), L2('ISO 492', 'ISO 492'),
            L2('Press onto the shaft pushing only the inner-ring face — never through the balls.', 'تُكبس على العمود بالدفع على وجه الحلقة الداخلية فقط — وليس عبر الكريات.')),
        brg_balls: P(L2('Balls', 'الكريات'), L2('The rolling elements. They turn the sliding friction of a plain bearing into low rolling friction.', 'عناصر التدحرج. تحوّل احتكاك الانزلاق إلى احتكاك تدحرج صغير.'),
            L2('100Cr6, grade G10–G28', '100Cr6 بدرجة G10–G28'), L2('Carry the load between the two raceways.', 'تحمل الحمل بين المسارين.'),
            L2('Cold-headed → flashed → rough-ground → hardened → lapped to a mirror finish', 'تشكيل على البارد ← إزالة الزوائد ← جلخ خشن ← تقسية ← صقل مرآوي'),
            L2('Sphericity ≤ 0.25 µm (grade G10); diameter variation within a bearing ≤ 0.5 µm', 'الكروية ≤ 0.25 µm (درجة G10)؛ تفاوت القطر داخل المحمل ≤ 0.5 µm'), L2('ISO 3290', 'ISO 3290'),
            L2('Conrad method: offset the inner ring, drop the balls into the crescent gap, then space them evenly.', 'طريقة كونراد: إزاحة الحلقة الداخلية وإسقاط الكريات في الفراغ الهلالي ثم توزيعها بالتساوي.')),
        brg_cageB: P(L2('Cage — rear half', 'القفص — النصف الخلفي'), L2('Half of the ball separator.', 'نصف فاصل الكريات.'),
            L2('Pressed low-carbon steel strip (or glass-filled polyamide PA66)', 'شريط فولاذ منخفض الكربون مكبوس (أو بولي أميد PA66 مقوّى)'), L2('Keeps the balls evenly spaced and stops ball-to-ball contact.', 'يُبقي الكريات متباعدة بانتظام ويمنع تلامسها.'),
            L2('Stamped and pressed from strip', 'تقطيع وكبس من شريط'), L2('Pocket clearance ≈ 0.05 Db around each ball', 'خلوص الجيب ≈ 0.05 من قطر الكرة'), L2('—', '—'),
            L2('Place against the balls from the back side.', 'تُوضع على الكريات من الجهة الخلفية.')),
        brg_cageA: P(L2('Cage — front half with posts', 'القفص — النصف الأمامي مع الأعمدة'), L2('The other half; the posts between the balls hold both halves together.', 'النصف الثاني؛ والأعمدة بين الكريات تربط النصفين.'),
            L2('Pressed steel, riveted', 'فولاذ مكبوس ومبرشم'), L2('Closes the cage around the balls.', 'يُغلق القفص حول الكريات.'),
            L2('Stamped, then riveted to the rear half', 'تقطيع ثم برشمة مع النصف الخلفي'), L2('Rivet head flush with the plate', 'رأس البرشام مستوٍ مع اللوح'), L2('—', '—'),
            L2('Clamp over the balls and rivet the two halves together.', 'يُثبَّت فوق الكريات ثم يُبرشم النصفان معاً.')),
        brg_sealA: P(L2('Shield / seal (front)', 'غطاء / عازل (أمامي)'), L2('A metal shield (ZZ) or a rubber contact seal (2RS) that closes the bearing.', 'غطاء معدني (ZZ) أو عازل مطاطي (2RS) يغلق المحمل.'),
            L2('Sheet steel (shield) or NBR rubber bonded to a steel core (seal)', 'صفيحة فولاذ (غطاء) أو مطاط NBR على قلب فولاذي (عازل)'), L2('Keeps grease in and dirt/water out — the bearing is lubricated for life.', 'يحبس الشحم ويمنع دخول الغبار والماء — المحمل مُشحَّم مدى الحياة.'),
            L2('Stamped steel; rubber vulcanised onto the core', 'فولاذ مكبوس؛ ويُفلكَن المطاط على القلب'), L2('Seal lip interference ≈ 0.1–0.2 mm', 'تداخل شفة العازل ≈ 0.1–0.2 mm'), L2('ISO 15 (2RS/ZZ suffix)', 'ISO 15 (اللاحقة 2RS/ZZ)'),
            L2('Snaps into the groove in the outer ring.', 'ينطبق داخل مجرى في الحلقة الخارجية.')),
        brg_sealB: P(L2('Shield / seal (rear)', 'غطاء / عازل (خلفي)'), L2('Same as the front one, fitted on the other face.', 'مثل الأمامي، ويركّب على الوجه الآخر.'),
            L2('Sheet steel or NBR rubber', 'صفيحة فولاذ أو مطاط NBR'), L2('Closes the second face.', 'يغلق الوجه الثاني.'), L2('Stamped steel; vulcanised rubber', 'فولاذ مكبوس ومطاط مُفلكَن'), L2('—', '—'), L2('ISO 15', 'ISO 15'),
            L2('Snap into the outer-ring groove on the rear face.', 'ينطبق في مجرى الحلقة الخارجية على الوجه الخلفي.'))
    });

    DIS.add('bearing', L2('Ball bearing', 'محمل كريات'), {
        controls(cur) {
            const maxStep = (cur.seal || 'none') === 'none' ? 5 : 7;
            return [
                { type: 'title', label: L2('Bearing', 'المحمل') },
                { id: 'series', type: 'select', label: L2('Designation (d×D×B)', 'الرمز (d×D×B)'), options: Object.keys(BRG).map((k) => ({ v: k, label: k + '  ' + BRG[k].d + '×' + BRG[k].D + '×' + BRG[k].B })), value: 6205, rebuild: true },
                { id: 'seal', type: 'select', label: L2('Closure', 'الإغلاق'), options: [{ v: 'none', label: L2('Open', 'مفتوح') }, { v: 'shield', label: L2('Metal shield (ZZ)', 'غطاء معدني (ZZ)') }, { v: 'seal', label: L2('Rubber seal (2RS)', 'عازل مطاطي (2RS)') }], value: 'none', rebuild: true },
                { type: 'title', label: L2('Duty', 'ظروف التشغيل') },
                { id: 'fr', type: 'range', label: L2('Radial load Fr', 'الحمل الشعاعي Fr'), min: 0.2, max: 20, step: 0.1, value: 3, unit: 'kN', decimals: 1 },
                { id: 'rpm', type: 'range', label: L2('Speed', 'السرعة'), min: 50, max: 10000, step: 50, value: 1500, unit: 'rpm' },
                ...DIS.common(maxStep)
            ];
        },
        build(p, api) {
            const d = dims(p.series), D = d.D, B = d.B, seal = p.seal || 'none';
            const m = bearingMeshes(d, seal);
            const defs = [
                { id: 'brg_outer', build: (s) => s.add(m.outer), off: [0, 0, 0], order: 1, vol: m.V.outer },
                { id: 'brg_inner', build: (s) => s.add(m.inner), off: [0, 0, 0.95 * D], segs: [{ v: [0, 0, 0.95 * D], w: [0.12, 0.45] }], order: 2, vol: m.V.inner },
                { id: 'brg_balls', build: (s) => s.add(m.balls), off: [0, 0, -0.45 * D], segs: [{ v: [0, 0, -0.45 * D], w: [0.52, 1] }], order: 3, qty: d.Z, vol: m.V.ball },
                { id: 'brg_cageB', build: (s) => s.add(m.cageB), off: [0, 0, -0.65 * D], segs: [{ v: [0, 0, -0.65 * D], w: [0.52, 1] }], stepOff: [0, 0, -0.35 * D], order: 4, vol: m.V.cageB },
                { id: 'brg_cageA', build: (s) => s.add(m.cageA), off: [0, 0, -0.25 * D], segs: [{ v: [0, 0, -0.25 * D], w: [0.52, 1] }], stepOff: [0, 0, 0.35 * D], order: 5, vol: m.V.cageA }
            ];
            if (m.sealA) {
                defs.push({ id: 'brg_sealA', build: (s) => s.add(m.sealA), off: [0, 0, 0.45 * D], segs: [{ v: [0, 0, 0.45 * D], w: [0, 0.15] }], order: 6, vol: m.V.seal, den: seal === 'seal' ? DEN.rubber : DEN.steel });
                defs.push({ id: 'brg_sealB', build: (s) => s.add(m.sealB), off: [0, 0, -0.95 * D], segs: [{ v: [0, 0, -0.95 * D], w: [0, 0.15] }], order: 7, vol: m.V.seal, den: seal === 'seal' ? DEN.rubber : DEN.steel, label: false });
            }
            let thI = 0;
            /* reverse "Conrad" assembly: once the inner ring is off, the balls and the cage dip slightly towards the axis so that they clear the outer-ring shoulders, then slide out axially */
            const s0 = Math.max(0.5, Math.min(1, (d.Rso - 0.5 * d.Db - 0.3) / (d.dm / 2)));
            const orig = { balls: m.balls.children.map((c) => c.position.clone()), cageA: m.cageA.children.map((c) => c.position.clone()) };
            const T = (x) => Math.max(0, Math.min(1, x)), sm = (x) => T(x) * T(x) * (3 - 2 * T(x));
            const squeeze = (parts_, e, step) => {
                const k = step > 0 ? 0 : sm((e - 0.45) / 0.07) * (1 - sm((e - 0.85) / 0.1)), sc = 1 - (1 - s0) * k;
                m.balls.children.forEach((c, i) => c.position.set(orig.balls[i].x * sc, orig.balls[i].y * sc, orig.balls[i].z));
                m.cageA.children.forEach((c, i) => { if (i === 0) c.scale.set(sc, sc, 1); else c.position.set(orig.cageA[i].x * sc, orig.cageA[i].y * sc, orig.cageA[i].z); });
                m.cageB.children[0].scale.set(sc, sc, 1);
            };
            const { root, parts } = DIS.assemble(p, api, defs, {
                afterLayout: squeeze,
                update(dt, time, ps) {
                    thI += K.rpmToVis(p.rpm) * dt;
                    const thC = (thI * (1 - d.Db / d.dm)) / 2;
                    const g = (id) => ps.find((q) => q.id === id);
                    g('brg_inner').spin.rotation.z = thI;
                    ['brg_balls', 'brg_cageA', 'brg_cageB'].forEach((id) => { g(id).spin.rotation.z = thC; });
                }
            });
            const zmin = -0.95 * D - 4, zmax = 0.95 * D + B / 2;
            DIS.fit(root, 0, -0.24 * D, (zmin + zmax) / 2, 1.16 * D, 0.78 * D, [0.7, 0.5, 1]);
            root.userData.bearing = d;
            return root;
        },
        readouts(p) {
            const d = dims(p.series), n = p.rpm, f = n / 60;
            const L10 = Math.pow(d.C / p.fr, 3), L10h = lifeH(d, p), r = d.Db / d.dm;
            const sh = DIS.shaftDev(d.d, 'k', 5), tb = tolBore(d.d), tD = tolOD(d.D), H7 = DIS.IT(d.D, 7);
            return [
                { k: L2('Designation · d×D×B', 'الرمز · d×D×B'), v: d.code + ' · ' + d.d + '×' + d.D + '×' + d.B + ' mm' },
                { k: L2('Rating C / load P', 'السعة C / الحمل P'), v: fmt(d.C) + ' / ' + fmt(p.fr) + ' kN' },
                { k: L2('Rating life L10 = (C/P)³', 'العمر الاسمي L10 = (C/P)³'), v: fmt(L10) + ' Mrev' },
                { k: L2('Life in hours L10h', 'العمر بالساعات L10h'), v: fmt(L10h) + ' h', state: L10h < 8000 ? 'bad' : L10h < 20000 ? 'warn' : 'ok' },
                { k: L2('Balls', 'الكريات'), v: d.Z + ' × Ø' + d.Db + ' mm' },
                { k: L2('Cage speed', 'سرعة القفص'), v: fmt((n * (1 - r)) / 2) + ' rpm' },
                { k: L2('Outer-race defect BPFO', 'تردد عطب المسار الخارجي BPFO'), v: fmt(((d.Z / 2) * f * (1 - r))) + ' Hz' },
                { k: L2('Inner-race defect BPFI', 'تردد عطب المسار الداخلي BPFI'), v: fmt(((d.Z / 2) * f * (1 + r))) + ' Hz' },
                { k: L2('Shaft seat k5 → interference', 'مقعد العمود k5 ← تداخل'), v: fmt(sh.ei, 0) + ' … ' + fmt(sh.es + tb, 0) + ' µm' },
                { k: L2('Housing H7 → clearance', 'ثقب الهيكل H7 ← خلوص'), v: '0 … ' + fmt(H7 + tD, 0) + ' µm' },
                { k: L2('Mass (calc.)', 'الكتلة (تقديرية)'), v: DIS.fmtMass(DIS.cur.rows.reduce((a, q) => a + q.mass, 0)) }
            ];
        },
        challenges: () => [
            CH('Rating life ≥ 3,500 h while carrying at least 5 kN at 1500 rpm or more (which series can do it?).', 'عمر اسمي ≥ 3,500 ساعة مع حمل 5 kN على الأقل وسرعة 1500 rpm أو أكثر (أي سلسلة تستطيع؟).', (p) => p.fr >= 5 && p.rpm >= 1500 && lifeH(dims(p.series), p) >= 3500),
            CH('Pick a sealed bearing (ZZ or 2RS) and still reach 20,000 h at 3 kN.', 'اختر محملاً مغلقاً (ZZ أو 2RS) وحقق 20,000 ساعة عند 3 kN.', (p) => p.seal !== 'none' && p.fr >= 3 && lifeH(dims(p.series), p) >= 20000),
            CH('Explode the bearing completely (100 %).', 'فكّك المحمل بالكامل (100%).', (p) => p.ex >= 100)
        ],
        panels(p) {
            const d = dims(p.series), f = p.rpm / 60, r = d.Db / d.dm;
            return [
                { title: L2('Load rating vs applied load', 'سعة التحميل مقابل الحمل'), unit: 'kN', rows: [{ label: L2('Rating C', 'السعة C'), value: d.C }, { label: L2('Applied P', 'الحمل P'), value: p.fr }] },
                { title: L2('Rating life', 'العمر الاسمي'), unit: '×1000 h', rows: [{ label: 'L10h', value: lifeH(d, p) / 1000, color: lifeH(d, p) < 20000 ? '#dc2626' : undefined }, { label: L2('Target', 'الهدف'), value: 20 }] },
                { title: L2('Defect frequencies', 'ترددات الأعطاب'), unit: 'Hz', rows: [{ label: 'BPFO', value: (d.Z / 2) * f * (1 - r) }, { label: 'BPFI', value: (d.Z / 2) * f * (1 + r) }, { label: L2('Cage FTF', 'القفص FTF'), value: (f / 2) * (1 - r) }, { label: 'BSF', value: (d.dm / (2 * d.Db)) * f * (1 - r * r) }] }
            ];
        }
    });
})();
