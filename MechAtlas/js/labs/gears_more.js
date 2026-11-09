/* Gear lab, part 2: rack & pinion, bevel pair, worm drive, planetary set, internal gear pair.
 * Plugs into the gears lab through GearKit.extra[modelId]. Every model exposes
 *   controls(cur) / build(p, api) / readouts(p, group) / challenges() / panels(p)
 * and fills group.userData.solids so the automated tests can verify that the teeth really mesh. */
(function () {
    'use strict';
    const K = window.GearKit;
    if (!K || !window.Labs) return;
    const { MOD, PI, L2, gearPoints, makeGear, meshPhase, pitchRing, dirArrow, rpmToVis, fmt, MATS, ETA } = K;
    const lang = () => (window.getLang ? window.getLang() : 'en');
    const ar = () => lang() === 'ar';
    const TANA = Math.tan((20 * PI) / 180);
    const BEVEL_H = 1;
    const BEVEL_THIN = 0.1 * MOD;                      // bevel teeth are slimmed a little: their flanks are measured on a cone, not on a cylinder
    const SP = (PI * MOD) / 4 - 0.18 * MOD;            // half tooth thickness at the pitch line (same backlash as the spur pair)
    const CH = (en, ar_, fn) => ({ text: L2(en, ar_), check: fn });
    const mod1 = (x, m) => ((x % m) + m) % m;
    const lab = K.lab();

    const rpmCtl = (v) => ({ id: 'rpm', type: 'range', label: L2('Input speed', 'سرعة الدخل'), min: 30, max: 3000, step: 10, value: v || 600, unit: 'rpm' });
    const torqueCtl = (v) => ({ id: 'torque', type: 'range', label: L2('Input torque', 'عزم الدخل'), min: 1, max: 200, step: 1, value: v || 20, unit: 'N·m' });
    const etaCtl = (v, en, ar_) => ({ id: 'eta', type: 'range', label: L2(en || 'Efficiency per mesh η', ar_ || 'الكفاءة η لكل تعشيق'), min: 50, max: 100, step: 1, value: v || 98, unit: '%' });
    const eOf = (p, d) => K.etaOf(p, d);
    const modCtl = () => ({ id: 'mod', type: 'range', label: L2('Module', 'الموديول (m)'), min: 1, max: 8, step: 0.5, value: 2, unit: 'mm', decimals: 1 });
    const matCtl = () => ({ id: 'mat', type: 'select', label: L2('Gear material', 'مادة الترس'), options: MATS.map((m) => ({ v: m.v, label: m.label })), value: 'steel' });
    const pitchCtl = (label) => ({ id: 'pitch', type: 'toggle', label: label || L2('Show pitch circles', 'إظهار دوائر الخطوة'), value: false });
    const stdMat = (c) => new THREE.MeshStandardMaterial({ color: c, metalness: 0.45, roughness: 0.42 });
    const yes = (b) => (b ? (ar() ? 'نعم' : 'Yes') : (ar() ? 'لا' : 'No'));
    const powerPanel = (Pin, eta) => ({ title: L2('Power flow', 'تدفق القدرة'), unit: 'kW', rows: [{ label: L2('Input', 'الدخل'), value: Pin / 1000 }, { label: L2('Output', 'الخرج'), value: (Pin * eta) / 1000 }, { label: L2('Lost as heat', 'ضائع حرارة'), value: (Pin * (1 - eta)) / 1000, color: '#dc2626' }] });
    const pinPower = (T, rpm) => (T * 2 * PI * rpm) / 60;

    /* ---------------------------------------------------------------- parts info */
    Object.assign(lab.parts, {
        gear_rack: { name: L2('Rack', 'الجريدة المسننة'), desc: L2('A gear with infinite radius: its teeth lie on a straight line. It turns rotation into straight-line motion.', 'ترس نصف قطره لانهائي، أسنانه على خط مستقيم، يحوّل الدوران إلى حركة خطية.'), material: L2('Steel or hardened steel bar', 'قضيب فولاذ أو فولاذ مُقسّى'), func: L2('Pushes a load along a line (steering, lathe carriage, presses).', 'يدفع الحمل على خط مستقيم (المقود، عربة المخرطة، المكابس).') },
        bevel_pinion: { name: L2('Bevel pinion', 'البنيون المخروطي'), desc: L2('The smaller bevel gear. Its teeth are cut on a cone whose tip (apex) meets the apex of the mating gear.', 'الترس المخروطي الأصغر. أسنانه على مخروط يلتقي رأسه برأس مخروط الترس الآخر.'), material: L2('Case-hardened alloy steel', 'صلب سبائكي مُسقّى سطحياً'), func: L2('Turns power through a corner (here 90°).', 'ينقل القدرة عبر زاوية (هنا 90°).') },
        bevel_gear: { name: L2('Bevel gear', 'الترس المخروطي'), desc: L2('The larger bevel gear. Teeth shrink toward the apex, so the tooth profile gets smaller along the face.', 'الترس المخروطي الأكبر. تصغر الأسنان باتجاه الرأس، فيتناقص مقطع السن على عرض الوجه.'), material: L2('Alloy steel', 'صلب سبائكي'), func: L2('Receives the turned power; ratio = teeth ratio.', 'يستقبل القدرة بعد تغيير الاتجاه؛ نسبة السرعة = نسبة الأسنان.') },
        worm: { name: L2('Worm (screw)', 'الدودة (اللولب)'), desc: L2('A screw-shaped gear. One turn of a single-start worm advances the wheel by only one tooth, giving huge reduction.', 'ترس على شكل لولب. دورة واحدة لدودة ذات مدخل واحد تحرّك العجلة سنّاً واحداً فقط، فينتج تخفيض كبير.'), material: L2('Hardened steel, ground thread', 'فولاذ مُقسّى بلولب مجلّخ'), func: L2('Drives the wheel; the sliding contact makes it quiet but less efficient.', 'يقود العجلة؛ التلامس الانزلاقي يجعله هادئاً لكن أقل كفاءة.') },
        worm_wheel: { name: L2('Worm wheel', 'عجلة الدودة'), desc: L2('Gear with slanted teeth that fit the worm thread. Axes cross at 90° without meeting.', 'ترس بأسنان مائلة تناسب لولب الدودة. المحوران متعامدان دون أن يتقاطعا.'), material: L2('Phosphor bronze (soft, good sliding)', 'برونز فوسفوري (ليّن، انزلاق جيد)'), func: L2('Gives the output; with a low lead angle it can self-lock.', 'يعطي الخرج؛ وبزاوية تقدّم صغيرة قد يقفل ذاتياً.') },
        sun: { name: L2('Sun gear', 'الترس الشمسي'), desc: L2('The central gear. All planets mesh with it.', 'الترس المركزي. تتعشّق معه كل التروس الكوكبية.'), material: L2('Case-hardened steel', 'صلب مُسقّى سطحياً'), func: L2('Usually the input in a reducer.', 'غالباً هو الدخل في صندوق التخفيض.') },
        planet: { name: L2('Planet gear', 'الترس الكوكبي'), desc: L2('Spins on its own pin while orbiting the sun. Several planets share the load equally.', 'يدور حول محوره ويدور أيضاً حول الشمس. عدة كواكب تتقاسم الحمل بالتساوي.'), material: L2('Case-hardened steel', 'صلب مُسقّى سطحياً'), func: L2('Links sun and ring and carries the torque.', 'يصل بين الشمس والحلقة وينقل العزم.') },
        ring: { name: L2('Ring gear (internal)', 'الترس الحلقي (داخلي)'), desc: L2('Teeth are cut on the inside. It turns the same way as the gear inside it.', 'أسنانه على الداخل. يدور بنفس اتجاه الترس الذي بداخله.'), material: L2('Steel or nodular iron', 'فولاذ أو حديد مطيل'), func: L2('Fixed in most reducers, so it takes the reaction torque.', 'ثابت في أغلب المخفّضات فيتحمل عزم رد الفعل.') },
        carrier: { name: L2('Planet carrier', 'حامل الكواكب'), desc: L2('The arm that holds the planet pins. Its speed is the orbit speed of the planets.', 'الذراع الذي يحمل محاور الكواكب. سرعته هي سرعة دوران الكواكب حول الشمس.'), material: L2('Steel plate', 'صفيحة فولاذ'), func: L2('Usually the output of a planetary reducer.', 'غالباً هو الخرج في مخفّض كوكبي.') }
    });

    /* ---------------------------------------------------------------- shared geometry */
    function addPitchToggle(group, p) { group.traverse((o) => { if (o.userData && o.userData.pitch) o.visible = !!p.pitch; }); }

    function ringPoly(z) {
        const Rp = (z * MOD) / 2, step = (2 * PI) / z;
        const half = (r) => Math.min((SP + (r - Rp) * TANA) / r, step * 0.47);
        const rRoot = Rp + 1.25 * MOD, rTip = Rp - MOD, hr = half(rRoot), ht = half(rTip);
        const pts = [], P = (r, a) => pts.push([r * Math.cos(a), r * Math.sin(a)]);
        for (let i = 0; i < z; i++) {
            const c = (i + 0.5) * step;
            P(rRoot, c - hr); P(rTip, c - ht); P(rTip, c + ht); P(rRoot, c + hr);
            const g0 = c + hr, g1 = c + step - hr;
            if (g1 - g0 > 0.05) { P(rRoot, g0 + (g1 - g0) / 3); P(rRoot, g0 + (2 * (g1 - g0)) / 3); }
        }
        return { pts, Rp, rRoot, Rout: rRoot + 0.7 };
    }
    function makeRing(z, width, color, id) {
        const { pts, Rp, Rout } = ringPoly(z);
        const shape = new THREE.Shape(); shape.absarc(0, 0, Rout, 0, 2 * PI, false);
        const hole = new THREE.Path(); pts.forEach((q, i) => (i ? hole.lineTo(q[0], q[1]) : hole.moveTo(q[0], q[1]))); shape.holes.push(hole);
        const geo = new THREE.ExtrudeGeometry(shape, { depth: width, bevelEnabled: false, curveSegments: 48 });
        geo.translate(0, 0, -width / 2);
        const g = new THREE.Group(); g.userData.id = id;
        g.add(new THREE.Mesh(geo, stdMat(color)));
        const mk = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, width + 0.02), new THREE.MeshStandardMaterial({ color: 0x111827 })); mk.position.x = Rout - 0.3; g.add(mk);
        g.userData.pitchR = Rp;
        return { g, pts, Rp, Rout };
    }

    /* ================================================================ RACK & PINION */
    const PP = PI * MOD;
    function rackPoly(Kh) {
        const tipH = MOD, rootH = -1.25 * MOD, bodyY = rootH - 0.55;
        const w = (h) => SP - h * TANA;
        const pts = [[-Kh * PP - PP / 2, bodyY], [-Kh * PP - PP / 2, rootH]];
        for (let k = -Kh; k <= Kh; k++) {
            const xc = k * PP;
            pts.push([xc - w(rootH), rootH], [xc - w(tipH), tipH], [xc + w(tipH), tipH], [xc + w(rootH), rootH]);
        }
        pts.push([Kh * PP + PP / 2, rootH], [Kh * PP + PP / 2, bodyY]);
        return pts;
    }
    function makeRack(Kh, width, color) {
        const pts = rackPoly(Kh);
        const geo = new THREE.ExtrudeGeometry(new THREE.Shape(pts.map((q) => new THREE.Vector2(q[0], q[1]))), { depth: width, bevelEnabled: false });
        geo.translate(0, 0, -width / 2);
        const m = new THREE.Mesh(geo, stdMat(color)); m.userData.id = 'gear_rack';
        return { mesh: m, pts };
    }

    K.extra.rack = {
        controls: () => [
            { type: 'title', label: L2('Pinion', 'البنيون') },
            { id: 't', type: 'range', label: L2('Pinion teeth', 'أسنان البنيون'), min: 8, max: 40, step: 1, value: 16, rebuild: true },
            { type: 'title', label: L2('Input', 'الدخل') },
            rpmCtl(300), torqueCtl(20), etaCtl(98), modCtl(), matCtl(), pitchCtl()
        ],
        build(p) {
            const T = p.t, r = (T * MOD) / 2, s = (2 * PI) / T, width = 1.3, Kh = 11, S = 4 * PP;
            const group = new THREE.Group();
            const pin = makeGear(T, width, 0x0ea5e9, 'gear_drive'); pin.position.set(0, r, 0); group.add(pin);
            const ring = pitchRing(r, width / 2 + 0.01); pin.add(ring);
            const { mesh: rack, pts } = makeRack(Kh, width, 0x94a3b8); group.add(rack);
            const pl = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-Kh * PP, 0, width / 2 + 0.01), new THREE.Vector3(Kh * PP, 0, width / 2 + 0.01)]), new THREE.LineBasicMaterial({ color: 0xfacc15 }));
            pl.userData.pitch = true; pl.userData.noView = true; pl.visible = !!p.pitch; group.add(pl);
            const arrow = dirArrow(Math.min(r * 0.55, 1.2), true, width / 2 + 0.75); arrow.position.set(0, r, width / 2 + 0.75); arrow.position.z = width / 2 + 0.75; group.add(arrow);
            const c0 = mod1((0.5 * s + PI / 2) * r + PP / 2, PP);
            let pos = 0, dir = 1;
            const place = () => { const th = pos / r; pin.rotation.z = th; rack.position.x = c0 + th * r; arrow.scale.y = dir; };
            place();
            group.userData.update = (dt) => {
                pos += dir * rpmToVis(p.rpm) * r * dt;
                if (pos > S) { pos = S; dir = -1; } else if (pos < -S) { pos = -S; dir = 1; }
                place();
            };
            group.userData.fit = { w: Math.max(r + 1.4, 4.6), h: r + 1.1, dir: [0, 0.25, 1] };
            group.userData.target = [0, r - 0.3, 0];
            group.userData.solids = [
                { obj: pin, poly: gearPoints(T), z0: -width / 2, z1: width / 2, width },
                { obj: rack, poly: pts, z0: -width / 2, z1: width / 2, width }
            ];
            return group;
        },
        readouts(p) {
            const d = p.mod * p.t, v = (PI * d * p.rpm) / 60000, F = (2000 * p.torque) / d;
            const P = pinPower(p.torque, p.rpm);
            return [
                { k: L2('Pinion pitch Ø d = m·z', 'قطر الخطوة d = m·z'), v: fmt(d) + ' mm' },
                { k: L2('Rack speed v = π·d·n', 'سرعة الجريدة v = π·d·n'), v: fmt(v * 1000) + ' mm/s' },
                { k: L2('Travel per pinion turn (π·d)', 'المشوار لكل دورة (π·d)'), v: fmt(PI * d) + ' mm' },
                { k: L2('Rack force F = 2T/d·η', 'قوة الجريدة F = 2T/d·η'), v: fmt(F * eOf(p)) + ' N' },
                { k: L2('Input power', 'القدرة'), v: fmt(P / 1000) + ' kW' },
                { k: L2('Undercut risk (z<17)', 'خطر القطع السفلي (z<17)'), v: yes(p.t < 17), state: p.t < 17 ? 'warn' : 'ok' },
                ...K.strengthRows(K.gearO('rack', p))
            ];
        },
        challenges: () => [
            CH('Make the rack travel at least 150 mm per pinion turn.', 'اجعل مشوار الجريدة 150 mm على الأقل لكل دورة.', (p) => PI * p.mod * p.t >= 150),
            CH('Push with ≥ 2500 N using ≤ 20 N·m of torque (hint: a small pinion).', 'ادفع بقوة ≥ 2500 N بعزم ≤ 20 N·m (تلميح: بنيون صغير).', (p) => p.torque <= 20 && ((2000 * p.torque) / (p.mod * p.t)) * eOf(p) >= 2500),
            CH('Keep the safety factor ≥ 2 at 100 N·m or more.', 'حافظ على معامل أمان ≥ 2 مع عزم 100 N·m فأكثر.', (p) => p.torque >= 100 && K.strengthCalc(K.gearO('rack', p)).sf >= 2)
        ],
        panels(p) {
            const d = p.mod * p.t;
            return [powerPanel(pinPower(p.torque, p.rpm), eOf(p)), K.stressPanel(K.gearO('rack', p))];
        }
    };

    /* ================================================================ BEVEL PAIR (90°) */
    function makeBevel(t, W, zA, color, id) {
        const { shape, bore } = (function () {
            const sh = new THREE.Shape(gearPoints(t, BEVEL_THIN, BEVEL_H).map((q) => new THREE.Vector2(q[0], q[1])));
            const b = Math.max(0.3, ((t * MOD) / 2) * 0.22);
            const h = new THREE.Path(); h.absarc(0, 0, b, 0, 2 * PI, true); sh.holes.push(h);
            return { shape: sh, bore: b };
        })();
        const geo = new THREE.ExtrudeGeometry(shape, { depth: W, bevelEnabled: false, curveSegments: 4 });
        geo.translate(0, 0, -W);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) { const k = 1 + pos.getZ(i) / zA; pos.setX(i, pos.getX(i) * k); pos.setY(i, pos.getY(i) * k); }
        geo.computeVertexNormals();
        const g = new THREE.Group(); g.userData.id = id;
        g.add(new THREE.Mesh(geo, stdMat(color)));
        const kmin = 1 - W / zA;
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(bore * kmin * 0.9, bore * kmin * 0.9, W + 1.8, 20), new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.6, roughness: 0.35 }));
        shaft.rotation.x = PI / 2; shaft.position.z = (1.5 - W) / 2 - 0.0; g.add(shaft);
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(bore * 1.5, bore * 1.5, 0.5, 24), stdMat(color)); hub.rotation.x = PI / 2; hub.position.z = 0.25; g.add(hub);
        const mk = new THREE.Mesh(new THREE.BoxGeometry(bore * 0.9, 0.06, 0.6), new THREE.MeshStandardMaterial({ color: 0x111827 })); mk.position.set(bore * 0.9, 0, 0.3); g.add(mk);
        return g;
    }
    const basisQuat = (xa, ya, za) => new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(...xa), new THREE.Vector3(...ya), new THREE.Vector3(...za)));

    K.extra.bevel = {
        controls: () => [
            { type: 'title', label: L2('Gears (shafts at 90°)', 'التروس (المحوران 90°)') },
            { id: 't1', type: 'range', label: L2('Pinion teeth T₁', 'أسنان البنيون T₁'), min: 10, max: 40, step: 1, value: 16, rebuild: true },
            { id: 't2', type: 'range', label: L2('Gear teeth T₂', 'أسنان الترس T₂'), min: 10, max: 60, step: 1, value: 24, rebuild: true },
            { type: 'title', label: L2('Input', 'الدخل') },
            rpmCtl(600), torqueCtl(20), etaCtl(98), modCtl(), pitchCtl(L2('Show pitch cones', 'إظهار المخاريط'))
        ],
        build(p) {
            const t1 = p.t1, t2 = p.t2, r1 = (t1 * MOD) / 2, r2 = (t2 * MOD) / 2;
            const A = Math.hypot(r1, r2), Fw = A / 3;
            const d1 = Math.atan2(t1, t2), d2 = PI / 2 - d1;
            const W1 = Fw * Math.cos(d1), W2 = Fw * Math.cos(d2);
            const group = new THREE.Group();
            // gear 1: axis +x, big end at x = r2   |   gear 2: axis +y, big end at y = r1   (apexes meet at the origin)
            const F1 = new THREE.Group(); F1.position.set(r2, 0, 0); F1.quaternion.copy(basisQuat([0, 1, 0], [0, 0, 1], [1, 0, 0]));
            const F2 = new THREE.Group(); F2.position.set(0, r1, 0); F2.quaternion.copy(basisQuat([1, 0, 0], [0, 0, -1], [0, 1, 0]));
            const g1 = makeBevel(t1, W1, r2, 0x0ea5e9, 'bevel_pinion'), g2 = makeBevel(t2, W2, r1, 0xf59e0b, 'bevel_gear');
            F1.add(g1); F2.add(g2);
            const a1 = dirArrow(Math.min(r1 * 0.6, 1.1), true, 1.3); F1.add(a1);
            const a2 = dirArrow(Math.min(r2 * 0.45, 1.1), false, 1.3); F2.add(a2);
            group.add(F1, F2);
            // pitch cones as thin wire cones
            [[F1, r1, r2, 'c1'], [F2, r2, r1, 'c2']].forEach(([F, R, h]) => {
                const cone = new THREE.Mesh(new THREE.ConeGeometry(R, h, 48, 1, true), new THREE.MeshBasicMaterial({ color: 0xfacc15, wireframe: true }));
                cone.rotation.x = -PI / 2; cone.position.z = -h / 2; cone.userData.pitch = true; cone.userData.noView = true; cone.visible = !!p.pitch; F.add(cone);
            });
            const th20 = meshPhase(0, 0, t1, 0, t2);
            g2.rotation.z = th20;
            let th = 0;
            group.userData.update = (dt) => {
                th += rpmToVis(p.rpm) * dt;
                g1.rotation.z = th; g2.rotation.z = th20 - th * (t1 / t2);
            };
            group.userData.fit = { w: r2 + 1.9, h: Math.max(r1, 1.6) + 1.7, dir: [0.35, 0.4, 1] };
            group.userData.target = [0.2, 0.5, 0];
            group.userData.solids = [
                { obj: g1, poly: gearPoints(t1, BEVEL_THIN, BEVEL_H), z0: -W1, z1: 0, taper: r2 },
                { obj: g2, poly: gearPoints(t2, BEVEL_THIN, BEVEL_H), z0: -W2, z1: 0, taper: r1 }
            ];
            group.userData.geom = { d1, d2, A, Fw };
            return group;
        },
        readouts(p) {
            const i = p.t2 / p.t1, d1 = Math.atan2(p.t1, p.t2), d2 = PI / 2 - d1;
            const A = (p.mod / 2) * Math.hypot(p.t1, p.t2), b = A / 3, dm1 = p.mod * p.t1 * (1 - b / (2 * A));
            const Ft = (2000 * p.torque) / dm1, Fa1 = Ft * TANA * Math.sin(d1), Fr1 = Ft * TANA * Math.cos(d1);
            const zv1 = p.t1 / Math.cos(d1), zv2 = p.t2 / Math.cos(d2);
            return [
                { k: L2('Ratio i = T₂/T₁', 'النسبة i = T₂/T₁'), v: fmt(i) + ' : 1' },
                { k: L2('Output speed', 'سرعة الخرج'), v: fmt(p.rpm / i) + ' rpm' },
                { k: L2('Output torque', 'عزم الخرج'), v: fmt(p.torque * i * eOf(p)) + ' N·m' },
                { k: L2('Pitch-cone angles δ₁ / δ₂', 'زاويتا مخروط الخطوة δ₁ / δ₂'), v: fmt((d1 * 180) / PI) + '° / ' + fmt((d2 * 180) / PI) + '°' },
                { k: L2('Cone distance A', 'طول المولّد A'), v: fmt(A) + ' mm' },
                { k: L2('Face width b = A/3', 'عرض الوجه b = A/3'), v: fmt(b) + ' mm' },
                { k: L2('Tangential force Fₜ (mean Ø)', 'القوة المماسية Fₜ (القطر المتوسط)'), v: fmt(Ft) + ' N' },
                { k: L2('Axial thrust on pinion', 'الدفع المحوري على البنيون'), v: fmt(Fa1) + ' N', state: Fa1 > 0.25 * Ft ? 'warn' : 'ok' },
                { k: L2('Radial load on pinion', 'الحمل الشعاعي على البنيون'), v: fmt(Fr1) + ' N' },
                { k: L2('Virtual teeth z/cosδ (≥17)', 'الأسنان الافتراضية z/cosδ (≥17)'), v: fmt(zv1, 0) + ' / ' + fmt(zv2, 0), state: Math.min(zv1, zv2) < 17 ? 'warn' : 'ok' }
            ];
        },
        challenges: () => [
            CH('Build a miter pair: equal teeth, 1 : 1 ratio.', 'اصنع زوج ميتر: أسنان متساوية ونسبة 1 : 1.', (p) => p.t1 === p.t2),
            CH('Get a 3 : 1 reduction through the corner.', 'احصل على تخفيض 3 : 1 عبر الزاوية.', (p) => Math.abs(p.t2 / p.t1 - 3) < 0.001),
            CH('Keep axial thrust on the pinion below 20 % of Fₜ.', 'اجعل الدفع المحوري على البنيون أقل من 20% من Fₜ.', (p) => TANA * Math.sin(Math.atan2(p.t1, p.t2)) < 0.2)
        ],
        panels(p) {
            const i = p.t2 / p.t1, d1 = Math.atan2(p.t1, p.t2);
            const A = (p.mod / 2) * Math.hypot(p.t1, p.t2), dm1 = p.mod * p.t1 * (1 - 1 / 6);
            const Ft = (2000 * p.torque) / dm1;
            return [
                { title: L2('Shaft speed', 'سرعة الأعمدة'), unit: 'rpm', rows: [{ label: L2('Pinion', 'البنيون'), value: p.rpm }, { label: L2('Gear', 'الترس'), value: -p.rpm / i }] },
                { title: L2('Shaft torque', 'عزم الأعمدة'), unit: 'N·m', rows: [{ label: L2('Pinion', 'البنيون'), value: p.torque }, { label: L2('Gear', 'الترس'), value: p.torque * i * eOf(p) }] },
                { title: L2('Loads on the pinion', 'الأحمال على البنيون'), unit: 'N', rows: [{ label: L2('Tangential', 'مماسية'), value: Ft }, { label: L2('Axial', 'محورية'), value: Ft * TANA * Math.sin(d1) }, { label: L2('Radial', 'شعاعية'), value: Ft * TANA * Math.cos(d1) }] }
            ];
        }
    };

    /* ================================================================ WORM DRIVE */
    const Q = 10;                                    // worm diameter factor: d_worm = q·m
    const RW = (Q * MOD) / 2, TIP = RW + MOD, ROOT = RW - 1.25 * MOD, PX = PI * MOD, WL = 8 * PX;
    function wormRho(d) { return Math.min(TIP, Math.max(ROOT, RW + (SP - d) / TANA)); }
    function wormD(z, phi, lead) { const u = mod1(z - (lead * phi) / (2 * PI), PX); return Math.min(u, PX - u); }
    function makeWormGeometry(n) {
        const lead = n * PX, nphi = 128, nz = Math.round(WL / 0.02);
        const verts = [], idx = [];
        for (let i = 0; i <= nz; i++) {
            const z = -WL / 2 + (WL * i) / nz;
            for (let j = 0; j < nphi; j++) {
                const phi = (2 * PI * j) / nphi, rho = wormRho(wormD(z, phi, lead));
                verts.push(rho * Math.cos(phi), rho * Math.sin(phi), z);
            }
        }
        for (let i = 0; i < nz; i++) for (let j = 0; j < nphi; j++) {
            const a = i * nphi + j, b = i * nphi + ((j + 1) % nphi), c = (i + 1) * nphi + j, d = (i + 1) * nphi + ((j + 1) % nphi);
            idx.push(a, b, c, b, d, c);
        }
        [0, nz].forEach((i, e) => {
            const cIdx = verts.length / 3; verts.push(0, 0, -WL / 2 + (WL * i) / nz);
            for (let j = 0; j < nphi; j++) { const a = i * nphi + j, b = i * nphi + ((j + 1) % nphi); if (e === 0) idx.push(cIdx, b, a); else idx.push(cIdx, a, b); }
        });
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3)); geo.setIndex(idx); geo.computeVertexNormals();
        return geo;
    }
    const wormEff = (n, mu) => { const g = Math.atan(n / Q), ca = Math.cos((20 * PI) / 180); return (ca - mu * Math.tan(g)) / (ca + mu / Math.tan(g)); };

    K.extra.worm = {
        controls: () => [
            { type: 'title', label: L2('Worm & wheel', 'الدودة والعجلة') },
            { id: 'n', type: 'range', label: L2('Worm starts (threads)', 'عدد مداخل الدودة'), min: 1, max: 4, step: 1, value: 1, rebuild: true },
            { id: 'T', type: 'range', label: L2('Wheel teeth', 'أسنان العجلة'), min: 20, max: 60, step: 1, value: 30, rebuild: true },
            { id: 'mu', type: 'range', label: L2('Friction coefficient μ', 'معامل الاحتكاك μ'), min: 0.02, max: 0.15, step: 0.01, value: 0.06, decimals: 2 },
            { type: 'title', label: L2('Input (worm)', 'الدخل (الدودة)') },
            rpmCtl(900), torqueCtl(10), modCtl(), pitchCtl()
        ],
        build(p) {
            const n = p.n, T = p.T, rg = (T * MOD) / 2, a = rg + RW, Fw = 1.1, lead = n * PX;
            const tg = lead / (2 * PI * RW), twist = (Fw * tg) / rg;
            const group = new THREE.Group();
            const wheel = makeGear(T, Fw, 0xf59e0b, 'worm_wheel', twist);
            const ring = pitchRing(rg, Fw / 2 + 0.01); wheel.add(ring); group.add(wheel);
            const frame = new THREE.Group(); frame.position.set(0, -a, 0); frame.quaternion.copy(basisQuat([0, 1, 0], [0, 0, 1], [1, 0, 0]));
            const worm = new THREE.Mesh(makeWormGeometry(n), new THREE.MeshStandardMaterial({ color: 0x0ea5e9, metalness: 0.5, roughness: 0.38 }));
            worm.userData.id = 'worm'; frame.add(worm);
            const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, WL + 1.6, 16), new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.6, roughness: 0.35 })); shaft.rotation.x = PI / 2; frame.add(shaft);
            const wmk = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.3), new THREE.MeshStandardMaterial({ color: 0x111827 })); wmk.position.set(0.3, 0, WL / 2 + 0.7); worm.add(wmk);
            group.add(frame);
            const arrow = dirArrow(Math.min(rg * 0.5, 1.2), false, Fw / 2 + 0.75); group.add(arrow);
            let thw = 0;
            const place = () => { worm.rotation.z = thw; wheel.rotation.z = -PI / 2 - (lead * thw) / (2 * PI * rg); };
            place();
            group.userData.update = (dt) => { thw += rpmToVis(p.rpm) * dt; place(); };
            const top = rg + 0.4, bot = -(a + RW + 0.4);
            group.userData.fit = { w: Math.max(WL / 2 + 0.5, rg + 0.5), h: (top - bot) / 2 + 0.2, dir: [0.25, 0.3, 1] };
            group.userData.target = [0, (top + bot) / 2, 0];
            const rotW = (wp) => worm.worldToLocal(wp.clone());
            group.userData.solids = [
                { obj: wheel, poly: gearPoints(T), z0: -Fw / 2, z1: Fw / 2, twist, width: Fw },
                { inside: (wp) => { const l = rotW(wp); if (Math.abs(l.z) > WL / 2) return false; const rho = Math.hypot(l.x, l.y); if (rho > TIP) return false; return rho <= wormRho(wormD(l.z, Math.atan2(l.y, l.x), lead)); }, obj: worm }
            ];
            return group;
        },
        readouts(p) {
            const i = p.T / p.n, eta = wormEff(p.n, p.mu), g = Math.atan(p.n / Q), dg = p.mod * p.T, dw = p.mod * Q;
            const Tout = p.torque * i * eta, Pin = pinPower(p.torque, p.rpm);
            const lock = Math.tan(g) <= p.mu / Math.cos((20 * PI) / 180);
            return [
                { k: L2('Ratio i = T / starts', 'النسبة i = T / المداخل'), v: fmt(i) + ' : 1' },
                { k: L2('Wheel speed', 'سرعة العجلة'), v: fmt(p.rpm / i) + ' rpm' },
                { k: L2('Output torque', 'عزم الخرج'), v: fmt(Tout) + ' N·m' },
                { k: L2('Efficiency η', 'الكفاءة η'), v: fmt(eta * 100) + ' %', state: eta < 0.5 ? 'warn' : 'ok' },
                { k: L2('Lead angle γ = atan(starts/q)', 'زاوية التقدّم γ'), v: fmt((g * 180) / PI) + '°' },
                { k: L2('Self-locking (wheel cannot drive the worm)', 'قفل ذاتي (العجلة لا تحرّك الدودة)'), v: yes(lock), state: lock ? 'ok' : '' },
                { k: L2('Center distance', 'المسافة بين المحورين'), v: fmt((dw + dg) / 2) + ' mm' },
                { k: L2('Pitch Ø worm / wheel', 'قطر الخطوة دودة / عجلة'), v: fmt(dw) + ' / ' + fmt(dg) + ' mm' },
                { k: L2('Axial thrust on worm = wheel Fₜ', 'الدفع المحوري على الدودة = Fₜ للعجلة'), v: fmt((2000 * Tout) / dg) + ' N' },
                { k: L2('Heat loss', 'الحرارة الضائعة'), v: fmt((Pin * (1 - eta)) / 1000, 2) + ' kW', state: (1 - eta) * Pin > 1500 ? 'warn' : '' }
            ];
        },
        challenges: () => [
            CH('Get a 50 : 1 (or more) single-stage reduction.', 'احصل على تخفيض 50 : 1 أو أكثر في مرحلة واحدة.', (p) => p.T / p.n >= 50),
            CH('Make it self-locking.', 'اجعلها ذاتية القفل.', (p) => Math.tan(Math.atan(p.n / Q)) <= p.mu / Math.cos((20 * PI) / 180)),
            CH('Reach efficiency ≥ 85 % (hint: more starts, less friction).', 'اوصل إلى كفاءة ≥ 85% (تلميح: مداخل أكثر واحتكاك أقل).', (p) => wormEff(p.n, p.mu) >= 0.85)
        ],
        panels(p) {
            const i = p.T / p.n, eta = wormEff(p.n, p.mu);
            return [
                { title: L2('Shaft speed', 'سرعة الأعمدة'), unit: 'rpm', rows: [{ label: L2('Worm', 'الدودة'), value: p.rpm }, { label: L2('Wheel', 'العجلة'), value: -p.rpm / i }] },
                { title: L2('Shaft torque', 'عزم الأعمدة'), unit: 'N·m', rows: [{ label: L2('Worm', 'الدودة'), value: p.torque }, { label: L2('Wheel', 'العجلة'), value: p.torque * i * eta }] },
                powerPanel(pinPower(p.torque, p.rpm), eta)
            ];
        }
    };

    /* ================================================================ PLANETARY SET */
    const CFG = {
        a: { en: 'Sun in → Carrier out (ring fixed)', ar: 'شمس دخل ← حامل خرج (الحلقة ثابتة)' },
        b: { en: 'Sun in → Ring out (carrier fixed)', ar: 'شمس دخل ← حلقة خرج (الحامل ثابت)' },
        c: { en: 'Ring in → Carrier out (sun fixed)', ar: 'حلقة دخل ← حامل خرج (الشمس ثابتة)' },
        d: { en: 'Carrier in → Sun out (ring fixed)', ar: 'حامل دخل ← شمس خرج (الحلقة ثابتة)' }
    };
    function effN(zs, zp, N) {
        for (let n = N; n >= 2; n--) if ((2 * (zs + zp)) % n === 0 && (zs + zp) * Math.sin(PI / n) >= zp + 2.2) return n;
        return 2;
    }
    /* speeds (rpm) of sun, carrier, ring for a configuration. Willis: zs·ωs + zr·ωr = (zs+zr)·ωc */
    function planetSpeeds(p) {
        const zs = p.zs, zr = p.zs + 2 * p.zp, w = p.rpm;
        if (p.cfg === 'b') return { ws: w, wc: 0, wr: -(zs * w) / zr, inn: 's', out: 'r', fix: 'c' };
        if (p.cfg === 'c') return { ws: 0, wc: (zr * w) / (zs + zr), wr: w, inn: 'r', out: 'c', fix: 's' };
        if (p.cfg === 'd') return { ws: ((zs + zr) * w) / zs, wc: w, wr: 0, inn: 'c', out: 's', fix: 'r' };
        return { ws: w, wc: (zs * w) / (zs + zr), wr: 0, inn: 's', out: 'c', fix: 'r' };
    }
    const nameOf = { s: L2('Sun', 'الشمس'), c: L2('Carrier', 'الحامل'), r: L2('Ring', 'الحلقة') };
    const planetPhase = (zs, zp) => {
        const zr = zs + 2 * zp, sr = (2 * PI) / zr, sp = (2 * PI) / zp;
        const thp0 = PI - 0.5 * sp;
        return { zr, sr, sp, thr0: mod1(sr * (thp0 / sp + 0.5), sr) };
    };

    K.extra.planetary = {
        controls: () => [
            { type: 'title', label: L2('Drive configuration', 'نمط التشغيل') },
            { id: 'cfg', type: 'select', label: L2('Input → Output', 'الدخل ← الخرج'), options: Object.keys(CFG).map((k) => ({ v: k, label: CFG[k] })), value: 'a' },
            { type: 'title', label: L2('Gears (ring = sun + 2·planet)', 'التروس (الحلقة = شمس + 2×كوكب)') },
            { id: 'zs', type: 'range', label: L2('Sun teeth', 'أسنان الشمس'), min: 12, max: 30, step: 1, value: 18, rebuild: true },
            { id: 'zp', type: 'range', label: L2('Planet teeth', 'أسنان الكوكب'), min: 10, max: 30, step: 1, value: 12, rebuild: true },
            { id: 'N', type: 'range', label: L2('Planets (requested)', 'عدد الكواكب (المطلوب)'), min: 2, max: 5, step: 1, value: 3, rebuild: true },
            { type: 'title', label: L2('Input', 'الدخل') },
            rpmCtl(600), torqueCtl(20), etaCtl(97, 'Overall efficiency η', 'الكفاءة الكلية η'), modCtl(), pitchCtl()
        ],
        build(p) {
            const zs = p.zs, zp = p.zp, N = effN(zs, zp, p.N), width = 1.0;
            const { zr, sr, sp, thr0 } = planetPhase(zs, zp);
            const R = ((zs + zp) * MOD) / 2;
            const group = new THREE.Group();
            const sun = makeGear(zs, width, 0x0ea5e9, 'sun'); sun.add(pitchRing((zs * MOD) / 2, width / 2 + 0.01)); group.add(sun);
            const ringO = makeRing(zr, width, 0x64748b, 'ring'); const ring = ringO.g; ring.add(pitchRing(ringO.Rp, width / 2 + 0.01)); ring.rotation.z = thr0; group.add(ring);
            const planets = [], th0s = [];
            for (let i = 0; i < N; i++) {
                const psi = (2 * PI * i) / N, g = makeGear(zp, width, 0xf59e0b, 'planet');
                if (i > 0) g.userData.label = false;
                g.add(pitchRing((zp * MOD) / 2, width / 2 + 0.01));
                planets.push(g); th0s.push(meshPhase(psi, 0, zs, psi + PI, zp)); group.add(g);
            }
            const carrier = new THREE.Group(); carrier.userData.id = 'carrier';
            const cmat = new THREE.MeshStandardMaterial({ color: 0x16a34a, metalness: 0.3, roughness: 0.6 });
            const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.22, 28), cmat); hub.rotation.x = PI / 2; hub.position.z = -width / 2 - 0.16; carrier.add(hub);
            for (let i = 0; i < N; i++) {
                const arm = new THREE.Mesh(new THREE.BoxGeometry(R, 0.4, 0.2), cmat);
                arm.position.set((R / 2) * Math.cos((2 * PI * i) / N), (R / 2) * Math.sin((2 * PI * i) / N), -width / 2 - 0.16); arm.rotation.z = (2 * PI * i) / N; carrier.add(arm);
            }
            group.add(carrier);
            let ths = 0, thc = 0, inA = 0;
            const layout = () => {
                sun.rotation.z = ths; carrier.rotation.z = thc;
                ring.rotation.z = thr0 + ((zs + zr) * thc - zs * ths) / zr;
                planets.forEach((g, i) => {
                    const psi = thc + (2 * PI * i) / N;
                    g.position.set(R * Math.cos(psi), R * Math.sin(psi), 0);
                    g.rotation.z = th0s[i] + thc - ((ths - thc) * zs) / zp;
                });
            };
            const drive = () => {
                if (p.cfg === 'b') { ths = inA; thc = 0; }
                else if (p.cfg === 'c') { ths = 0; thc = (zr * inA) / (zs + zr); }
                else if (p.cfg === 'd') { thc = inA; ths = ((zs + zr) * inA) / zs; }
                else { ths = inA; thc = (zs * inA) / (zs + zr); }
            };
            // when the ring is the input (cfg c) its own angle = inA, so ring phase follows Willis automatically
            drive(); layout();
            group.userData.update = (dt) => { inA += rpmToVis(p.rpm) * dt; drive(); layout(); };
            group.userData.fit = { w: ringO.Rout + 0.5, h: ringO.Rout + 0.5, dir: [0.18, 0.3, 1] };
            group.userData.target = [0, 0, 0];
            group.userData.effN = N;
            group.userData.solids = [
                { obj: sun, poly: gearPoints(zs), z0: -width / 2, z1: width / 2, width },
                { obj: ring, poly: ringO.pts, z0: -width / 2, z1: width / 2, ring: ringO.Rout, width },
                ...planets.map((g) => ({ obj: g, poly: gearPoints(zp), z0: -width / 2, z1: width / 2, width }))
            ];
            return group;
        },
        readouts(p, group) {
            const zr = p.zs + 2 * p.zp, S = planetSpeeds(p), W = { s: S.ws, c: S.wc, r: S.wr };
            const win = W[S.inn], wout = W[S.out], i = win / wout;
            const Pin = pinPower(p.torque, p.rpm), Tout = Math.abs(p.torque * i) * eOf(p, 0.97);
            const Tfix = Math.abs(p.torque * Math.sign(win) - Math.sign(wout) * Tout);
            const wp = S.wc - ((S.ws - S.wc) * p.zs) / p.zp;
            const eN = group && group.userData.effN ? group.userData.effN : effN(p.zs, p.zp, p.N);
            const clear = (p.zs + p.zp) * Math.sin(PI / eN) >= p.zp + 2.2;
            return [
                { k: L2('Mode', 'النمط'), v: CFG[p.cfg][lang()] },
                { k: L2('Ratio i = ω_in / ω_out', 'النسبة i = ω_in / ω_out'), v: fmt(i) + ' : 1' + (i < 0 ? (ar() ? ' (عكس الاتجاه)' : ' (reversed)') : '') },
                { k: L2('Output speed (' + nameOf[S.out].en + ')', 'سرعة الخرج (' + nameOf[S.out].ar + ')'), v: fmt(wout) + ' rpm' },
                { k: L2('Output torque', 'عزم الخرج'), v: fmt(Tout) + ' N·m' },
                { k: L2('Reaction on fixed ' + nameOf[S.fix].en.toLowerCase(), 'عزم رد الفعل على ' + nameOf[S.fix].ar + ' الثابتة'), v: fmt(Tfix) + ' N·m' },
                { k: L2('Planet spin (own axis)', 'دوران الكوكب حول محوره'), v: fmt(wp) + ' rpm' },
                { k: L2('Ring teeth z_r = z_s + 2·z_p', 'أسنان الحلقة z_r = z_s + 2·z_p'), v: String(zr) },
                { k: L2('Planets used', 'الكواكب المستخدمة'), v: eN + (eN !== p.N ? (ar() ? ' (عُدّل ليتحقق التجميع)' : ' (adjusted for assembly)') : ''), state: eN !== p.N ? 'warn' : 'ok' },
                { k: L2('Planets clear each other', 'الكواكب لا تتصادم'), v: yes(clear), state: clear ? 'ok' : 'bad' },
                { k: L2('Input power', 'القدرة'), v: fmt(Pin / 1000) + ' kW' }
            ];
        },
        challenges: () => [
            CH('Reduction of 5 : 1 or more with the ring fixed (sun in, carrier out).', 'تخفيض 5 : 1 أو أكثر مع ثبات الحلقة (شمس دخل، حامل خرج).', (p) => p.cfg === 'a' && 1 + (p.zs + 2 * p.zp) / p.zs >= 5),
            CH('Make the output turn the opposite way to the input.', 'اجعل الخرج يدور عكس الدخل.', (p) => p.cfg === 'b'),
            CH('Build an overdrive: output at least 3× faster than the input.', 'اصنع مضاعف سرعة: الخرج أسرع من الدخل 3 مرات على الأقل.', (p) => p.cfg === 'd' && 1 + (p.zs + 2 * p.zp) / p.zs >= 3)
        ],
        panels(p) {
            const S = planetSpeeds(p), W = { s: S.ws, c: S.wc, r: S.wr }, win = W[S.inn], wout = W[S.out];
            const Tout = Math.abs((p.torque * win) / wout) * eOf(p, 0.97), Tfix = Math.abs(p.torque * Math.sign(win) - Math.sign(wout) * Tout);
            const wp = S.wc - ((S.ws - S.wc) * p.zs) / p.zp;
            return [
                { title: L2('Element speeds', 'سرعة العناصر'), unit: 'rpm', rows: [{ label: nameOf.s, value: S.ws }, { label: nameOf.c, value: S.wc }, { label: nameOf.r, value: S.wr }, { label: L2('Planet spin', 'دوران الكوكب'), value: wp }] },
                { title: L2('Torques', 'العزوم'), unit: 'N·m', rows: [{ label: L2('Input', 'الدخل'), value: p.torque }, { label: L2('Output', 'الخرج'), value: Tout }, { label: L2('Fixed part', 'الجزء الثابت'), value: Tfix }] },
                powerPanel(pinPower(p.torque, p.rpm), eOf(p, 0.97))
            ];
        }
    };

    /* ================================================================ INTERNAL GEAR PAIR */
    K.extra.internal = {
        controls: () => [
            { type: 'title', label: L2('Gears', 'التروس') },
            { id: 'zp', type: 'range', label: L2('Pinion teeth z₁', 'أسنان البنيون z₁'), min: 10, max: 30, step: 1, value: 16, rebuild: true },
            { id: 'zr', type: 'range', label: L2('Ring teeth z₂', 'أسنان الحلقة z₂'), min: 30, max: 80, step: 1, value: 40, rebuild: true },
            { type: 'title', label: L2('Input (pinion)', 'الدخل (البنيون)') },
            rpmCtl(600), torqueCtl(20), etaCtl(98), modCtl(), matCtl(), pitchCtl()
        ],
        build(p) {
            const zp = p.zp, zr = Math.max(p.zr, zp + 2), width = 1.1, a = ((zr - zp) * MOD) / 2;
            const sp = (2 * PI) / zp, sr = (2 * PI) / zr;
            const group = new THREE.Group();
            const ringO = makeRing(zr, width, 0x64748b, 'ring'); const ring = ringO.g; ring.add(pitchRing(ringO.Rp, width / 2 + 0.01)); group.add(ring);
            const pin = makeGear(zp, width, 0x0ea5e9, 'gear_drive'); pin.position.set(a, 0, 0); pin.add(pitchRing((zp * MOD) / 2, width / 2 + 0.01)); group.add(pin);
            // contact at psi = 0.  ring tooth fraction there → pinion phase
            const thr0 = 0, ur = mod1((0 - thr0) / sr, 1), thp0 = 0 - sp * (0.5 + ur);
            let th = 0;
            const layout = () => { ring.rotation.z = thr0 + (th * zp) / zr; pin.rotation.z = thp0 + th; };
            layout();
            group.userData.update = (dt) => { th += rpmToVis(p.rpm) * dt; layout(); };
            group.userData.fit = { w: ringO.Rout + 0.5, h: ringO.Rout + 0.5, dir: [0.15, 0.25, 1] };
            group.userData.target = [0, 0, 0];
            group.userData.solids = [
                { obj: ring, poly: ringO.pts, z0: -width / 2, z1: width / 2, ring: ringO.Rout, width },
                { obj: pin, poly: gearPoints(zp), z0: -width / 2, z1: width / 2, width }
            ];
            return group;
        },
        readouts(p) {
            const zr = Math.max(p.zr, p.zp + 2), i = zr / p.zp, d1 = p.mod * p.zp, ok = zr - p.zp >= 8;
            const P = pinPower(p.torque, p.rpm);
            return [
                { k: L2('Ratio i = z₂/z₁', 'النسبة i = z₂/z₁'), v: fmt(i) + ' : 1' },
                { k: L2('Ring speed (same direction)', 'سرعة الحلقة (نفس الاتجاه)'), v: fmt(p.rpm / i) + ' rpm' },
                { k: L2('Ring torque', 'عزم الحلقة'), v: fmt(p.torque * i * eOf(p)) + ' N·m' },
                { k: L2('Center distance (z₂−z₁)·m/2', 'المسافة بين المحورين'), v: fmt(((zr - p.zp) * p.mod) / 2) + ' mm' },
                { k: L2('Input power', 'القدرة'), v: fmt(P / 1000) + ' kW' },
                { k: L2('Tooth-difference ≥ 8 (no tip interference)', 'فرق الأسنان ≥ 8 (بدون تصادم رؤوس)'), v: yes(ok), state: ok ? 'ok' : 'bad' },
                ...K.strengthRows(K.gearO('internal', p, { showFt: true }))
            ];
        },
        challenges: () => [
            CH('Get a 3 : 1 reduction (ring turns the same way).', 'احصل على تخفيض 3 : 1 (الحلقة بنفس الاتجاه).', (p) => Math.abs(p.zr / p.zp - 3) < 0.001),
            CH('Make the unit as compact as possible: center distance under 100 mm at module 3.', 'اجعل الوحدة مدمجة: المسافة بين المحورين أقل من 100 mm عند موديول 3.', (p) => p.mod === 3 && ((p.zr - p.zp) * p.mod) / 2 < 100)
        ],
        panels(p) {
            const zr = Math.max(p.zr, p.zp + 2), i = zr / p.zp;
            return [
                ...K.panelsPair(p.rpm, p.rpm / i, p.torque, p.torque * i * eOf(p), [K.stressPanel(K.gearO('internal', p))])
            ];
        }
    };

    /* ---------------------------------------------------------------- register the models in the tab bar */
    lab.models.push(
        { id: 'rack', title: L2('Rack & pinion', 'جريدة وترس') },
        { id: 'bevel', title: L2('Bevel pair 90°', 'ترس مخروطي 90°') },
        { id: 'worm', title: L2('Worm drive', 'دودة وعجلة') },
        { id: 'planetary', title: L2('Planetary set', 'تروس كوكبية') },
        { id: 'internal', title: L2('Internal gear', 'ترس داخلي') }
    );
    lab.intro = L2('Spur, helical, rack, bevel, worm, planetary and internal gears — change teeth, speed, torque and material, and watch simplified teeth mesh (straight flanks, for teaching) with live strength and contact checks.',
        'تروس عدلة وحلزونية وجريدة ومخروطية ودودة وكوكبية وداخلية — غيّر الأسنان والسرعة والعزم والمادة وشاهد تعشيق أسنان مبسّطة (جوانب مستقيمة للتعليم) مع فحص لحظي للمتانة والتلامس.');
})();
