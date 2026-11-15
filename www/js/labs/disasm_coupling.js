/* Disassembly lab — rigid flange coupling with bolt / key / shaft strength checks (ISO 773 keys, ISO 898 bolts). */
(function () {
    'use strict';
    const DIS = window.DIS;
    if (!DIS) return;
    const { L2, mat, COL, DEN, cylZ, tubeZ, boxM, hexZ, at, volTube, volCyl, CH, fmt, K, P } = DIS;
    const PI = Math.PI;

    // per shaft diameter: hub OD, flange OD, bolt pitch circle, bolt size, flange thickness, hub length, key b×h×L
    const T = {
        20: { Dh: 40, Df: 90, pcd: 65, M: 8, tf: 12, Lh: 40, kb: 6, kh: 6, kl: 28 },
        25: { Dh: 50, Df: 105, pcd: 78, M: 8, tf: 14, Lh: 45, kb: 8, kh: 7, kl: 32 },
        30: { Dh: 60, Df: 120, pcd: 90, M: 10, tf: 16, Lh: 55, kb: 8, kh: 7, kl: 40 },
        40: { Dh: 78, Df: 150, pcd: 114, M: 12, tf: 20, Lh: 70, kb: 12, kh: 8, kl: 56 },
        50: { Dh: 96, Df: 175, pcd: 135, M: 16, tf: 24, Lh: 85, kb: 14, kh: 9, kl: 70 },
        60: { Dh: 115, Df: 205, pcd: 160, M: 16, tf: 28, Lh: 100, kb: 18, kh: 11, kl: 80 }
    };
    const BOLT = { 8: { af: 13, hh: 5.3, nut: 6.8, As: 36.6 }, 10: { af: 17, hh: 6.4, nut: 8.4, As: 58 }, 12: { af: 19, hh: 7.5, nut: 10.8, As: 84.3 }, 16: { af: 24, hh: 10, nut: 14.8, As: 157 } };
    const GRADE = { '4.6': 240, '8.8': 640, '10.9': 940 };   // yield strength, MPa
    const RE_SHAFT = 340, RE_KEY = 340, P_ALLOW = 100;        // C45 shaft / key, allowable bearing pressure on hub, MPa

    function calc(p) {
        const d = p.d, t = T[d], b = BOLT[t.M];
        const Tn = p.torque * 1000;                                     // N·mm
        const F = (2 * Tn) / (t.pcd * p.nb);                            // N per bolt
        const tauB = F / b.As, sfB = (0.577 * GRADE[p.grade]) / tauB;
        const Le = t.kl - t.kb;
        const tauK = (2 * Tn) / (d * t.kb * Le), pK = (4 * Tn) / (d * t.kh * Le);
        const sfK = (0.577 * RE_KEY) / tauK, sfP = P_ALLOW / pK;
        const tauS = (16 * Tn) / (PI * d * d * d), sfS = (0.577 * RE_SHAFT) / tauS;
        const sfs = { bolts: sfB, key: sfK, crush: sfP, shaft: sfS };
        const weakest = Object.keys(sfs).reduce((a, k) => (sfs[k] < sfs[a] ? k : a), 'bolts');
        return { t, b, F, tauB, sfB, tauK, pK, sfK, sfP, tauS, sfS, weakest, min: sfs[weakest], Tcap: { bolts: p.torque * sfB, key: p.torque * sfK, crush: p.torque * sfP, shaft: p.torque * sfS } };
    }
    const nameOf = { bolts: L2('bolts (shear)', 'البراغي (قص)'), key: L2('key (shear)', 'الخابور (قص)'), crush: L2('key (crushing)', 'الخابور (سحق)'), shaft: L2('shaft (torsion)', 'العمود (التواء)') };

    DIS.addParts({
        cp_shaftA: P(L2('Shaft A (driving)', 'العمود A (القائد)'), L2('The motor-side shaft. A keyway is milled in its end.', 'عمود جهة المحرك، وفي طرفه مجرى خابور مفرّز.'),
            L2('C45 / 1045 steel, normalized', 'فولاذ C45 / 1045 معالج حرارياً'), L2('Brings torque from the motor to the hub.', 'ينقل العزم من المحرك إلى المحور.'),
            L2('Turned from bar → keyway end-milled → journals ground', 'خراطة من قضيب ← فرز مجرى الخابور ← جلخ المحاور'),
            L2('Seat Ø: k6 (transition fit); keyway width N9; Ra 1.6 µm', 'قطر المقعد k6 (توافق انتقالي)؛ عرض المجرى N9؛ Ra 1.6 µm'), L2('ISO 286 (fits), ISO 773 (keys)', 'ISO 286 (التوافقات)، ISO 773 (الخوابير)'),
            L2('Slide the key into the keyway first, then push the hub on.', 'ضع الخابور في المجرى أولاً ثم ادفع المحور فوقه.')),
        cp_shaftB: P(L2('Shaft B (driven)', 'العمود B (المقاد)'), L2('The load-side shaft, identical seat to shaft A.', 'عمود جهة الحمل، ومقعده مطابق للعمود A.'),
            L2('C45 steel', 'فولاذ C45'), L2('Takes torque from the hub to the machine.', 'يأخذ العزم من المحور إلى الآلة.'),
            L2('Turned, keyway milled, ground', 'خراطة وفرز مجرى وجلخ'), L2('Same as shaft A; coaxiality within 0.05 mm', 'مثل العمود A؛ التحاذي ضمن 0.05 mm'), L2('ISO 286', 'ISO 286'),
            L2('Mount last, aligning with a dial indicator on the flanges.', 'يُركَّب أخيراً مع ضبط التحاذي بمؤشر ساعة على الفلنجتين.')),
        cp_hubA: P(L2('Flange hub A', 'محور فلنجة A'), L2('A hub with a flange. The spigot ring on its face centres the two halves.', 'محور بفلنجة، وحلقة التمركز على وجهه تُحاذي النصفين.'),
            L2('Forged C45 steel (GG25 cast iron for light duty)', 'فولاذ C45 مطروق (أو حديد زهر GG25 للأحمال الخفيفة)'), L2('Locks to the shaft with the key and transmits torque through the bolts.', 'يتثبت بالعمود بالخابور وينقل العزم عبر البراغي.'),
            L2('Forged blank → turned (bore, spigot, faces) → keyway broached → bolt holes drilled & reamed', 'قطعة مطروقة ← خراطة (الثقب والتمركز والوجوه) ← تثقيب مجرى بالبروش ← ثقب وتوسيع فتحات البراغي'),
            L2('Bore H7; face runout ≤ 0.03 mm; bolt-hole PCD ±0.1 mm', 'الثقب H7؛ اهتزاز الوجه ≤ 0.03 mm؛ ‏PCD لفتحات البراغي ±0.1 mm'), L2('DIN 116 / ISO 286', 'DIN 116 / ISO 286'),
            L2('Heat the hub to ≈ 80 °C (or press) onto the shaft, keyway aligned with the key.', 'سخّن المحور إلى ≈ 80°م (أو اكبسه) على العمود مع محاذاة المجرى بالخابور.')),
        cp_hubB: P(L2('Flange hub B', 'محور فلنجة B'), L2('The mating hub. Its face has the recess for the spigot.', 'المحور المقابل، ووجهه فيه تجويف لحلقة التمركز.'),
            L2('Forged C45 steel', 'فولاذ C45 مطروق'), L2('Receives torque from the bolts and passes it to shaft B.', 'يستقبل العزم من البراغي وينقله إلى العمود B.'),
            L2('Same route as hub A, recess bored for the spigot', 'نفس مسار المحور A مع تجويف مخروط لحلقة التمركز'), L2('Recess H8 against spigot h8; bolt holes to match hub A', 'التجويف H8 مقابل حلقة h8؛ فتحات البراغي مطابقة للمحور A'), L2('DIN 116', 'DIN 116'),
            L2('Fit onto shaft B, then slide the shafts together until the spigot seats.', 'يُركَّب على العمود B ثم يُقرَّب العمودان حتى تستقر حلقة التمركز.')),
        cp_keyA: P(L2('Key A', 'الخابور A'), L2('A small steel bar in the shaft keyway. It stops the hub from slipping on the shaft.', 'قضيب فولاذي صغير في مجرى العمود يمنع انزلاق المحور.'),
            L2('C45 steel bright bar (b × h per ISO 773)', 'قضيب C45 مصقول (b × h حسب ISO 773)'), L2('Carries the torque between shaft and hub by shear.', 'ينقل العزم بين العمود والمحور بالقص.'),
            L2('Cut from bright flat bar, ends rounded', 'قص من شريط مصقول مع تدوير الأطراف'), L2('Width h9; fits keyway N9 / hub keyway JS9', 'العرض h9؛ ويناسب المجرى N9 / مجرى المحور JS9'), L2('ISO 773 / DIN 6885 form A', 'ISO 773 / DIN 6885 شكل A'),
            L2('Tap it lightly into the shaft keyway before the hub goes on.', 'اطرقه بخفة في مجرى العمود قبل تركيب المحور.')),
        cp_keyB: P(L2('Key B', 'الخابور B'), L2('Same key on the second shaft.', 'الخابور نفسه على العمود الثاني.'), L2('C45 steel', 'فولاذ C45'), L2('Carries torque into shaft B.', 'ينقل العزم إلى العمود B.'),
            L2('Cut from bright flat bar', 'قص من شريط مصقول'), L2('h9', 'h9'), L2('ISO 773', 'ISO 773'), L2('Fit before hub B.', 'يُركَّب قبل المحور B.')),
        cp_bolt: P(L2('Bolts', 'البراغي'), L2('Hex-head bolts that clamp the two flanges. They carry the torque in shear.', 'براغٍ سداسية الرأس تشدّ الفلنجتين وتنقل العزم بالقص.'),
            L2('Steel, property class 4.6 / 8.8 / 10.9 (ISO 898-1)', 'فولاذ بفئة مقاومة 4.6 / 8.8 / 10.9 (ISO 898-1)'), L2('Joins the flanges; torque goes through them as shear.', 'تصل الفلنجتين ويمرّ العزم عبرها بقص.'),
            L2('Cold-headed → thread rolled → heat-treated → zinc-plated', 'تشكيل على البارد ← درفلة الأسنان ← معالجة حرارية ← جلفنة'), L2('Hole clearance 6H/6g; fitted bolts use reamed holes (H7/k6)', 'خلوص الثقب 6H/6g؛ والبراغي المضبوطة تستعمل ثقوباً موسّعة (H7/k6)'), L2('ISO 4014 / ISO 898-1', 'ISO 4014 / ISO 898-1'),
            L2('Insert all bolts, then tighten the nuts crosswise to the specified torque.', 'ضع كل البراغي ثم شدّ الصواميل بالتناوب المتقاطع حتى العزم المحدد.')),
        cp_nut: P(L2('Nuts', 'الصواميل'), L2('Hex nuts that lock the bolts.', 'صواميل سداسية تثبّت البراغي.'), L2('Steel, class 8 for 8.8 bolts', 'فولاذ فئة 8 لبراغي 8.8'), L2('Create the clamping force.', 'تولّد قوة الشد.'),
            L2('Cold-formed, tapped, heat-treated', 'تشكيل على البارد وتسنين ومعالجة حرارية'), L2('Thread 6H', 'السن 6H'), L2('ISO 4032', 'ISO 4032'),
            L2('Tighten crosswise; add a lock washer or thread-locker if there is vibration.', 'شدّ متقاطعاً؛ وأضف حلقة قفل أو مثبّت أسنان عند وجود اهتزاز.'))
    });

    DIS.add('coupling', L2('Flange coupling', 'وصلة فلنجة'), {
        controls: () => [
            { type: 'title', label: L2('Coupling', 'الوصلة') },
            { id: 'd', type: 'select', label: L2('Shaft diameter', 'قطر العمود'), options: [20, 25, 30, 40, 50, 60].map((v) => ({ v, label: 'Ø' + v + ' mm' })), value: 40, rebuild: true },
            { id: 'nb', type: 'range', label: L2('Number of bolts', 'عدد البراغي'), min: 3, max: 8, step: 1, value: 6, rebuild: true },
            { id: 'grade', type: 'select', label: L2('Bolt class', 'فئة البراغي'), options: Object.keys(GRADE).map((v) => ({ v, label: v })), value: '8.8' },
            { type: 'title', label: L2('Duty', 'ظروف التشغيل') },
            { id: 'torque', type: 'range', label: L2('Transmitted torque', 'العزم المنقول'), min: 10, max: 3000, step: 10, value: 300, unit: 'N·m' },
            { id: 'rpm', type: 'range', label: L2('Speed', 'السرعة'), min: 10, max: 3000, step: 10, value: 300, unit: 'rpm' },
            ...DIS.common(8)
        ],
        build(p, api) {
            const d = p.d, t = T[d], b = BOLT[t.M], nb = p.nb, Ls = t.Lh + 40;
            const steel = mat(COL.steel), hub = mat(0x7f8da0), bolt = mat(COL.dark, { metalness: 0.4 }), keyM = mat(COL.key, { metalness: 0.4 });
            /* ---- keyway geometry: shaft keyway depth t1 = 0.6·h, hub keyway depth t2 = 0.4·h (+0.4 clearance) ---- */
            const kw = t.kb / 2, t1 = 0.6 * t.kh, t2 = 0.4 * t.kh + 0.4;
            const yc = (r) => Math.sqrt(r * r - kw * kw);
            const notchedDisc = () => {                         // shaft section with the keyway milled in its top
                const r = d / 2, y0 = r - t1, a1 = Math.atan2(yc(r), kw), sh = new THREE.Shape();
                sh.moveTo(kw, y0); sh.lineTo(kw, yc(r)); sh.absarc(0, 0, r, a1, Math.PI - a1 - 2 * PI, true); sh.lineTo(-kw, y0); sh.closePath(); return sh;
            };
            const keywayHole = (path) => {                      // hub bore with a keyway slot
                const r = d / 2, yt = r + t2;
                path.moveTo(kw, yc(r)); path.lineTo(kw, yt); path.lineTo(-kw, yt); path.lineTo(-kw, yc(r)); path.absarc(0, 0, r, Math.PI - Math.atan2(yc(r), kw), Math.atan2(yc(r), kw) + 2 * PI, false); return path;   // the long way round the bore: the old arc went the short way over the slot, so the bore itself was never cut
            };
            const ext = (shape, depth, z0, m) => { const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 32 }); const mm = new THREE.Mesh(g, m); mm.position.z = z0; return mm; };
            const spR = t.pcd / 2 - (t.M / 2 + 0.6) - 1.5, spW = 4, spH = 3, spC = 0.3;   // centring spigot: inside the bolt circle, 3 mm high, 0.3 mm radial clearance in the recess
            const discShape = (R) => { const sh = new THREE.Shape(); sh.absarc(0, 0, R, 0, 2 * PI, false); return sh; };
            const boltHoles = (sh) => { for (let k = 0; k < nb; k++) { const a = (k * 2 * PI) / nb, h = new THREE.Path(); h.absarc((t.pcd / 2) * Math.cos(a), (t.pcd / 2) * Math.sin(a), t.M / 2 + 0.6, 0, 2 * PI, true); sh.holes.push(h); } return sh; };
            const hubBuild = (side) => (s) => {
                const sg = side;                                // −1 = A, +1 = B
                if (sg < 0) {
                    const fl = discShape(t.Df / 2); fl.holes.push(keywayHole(new THREE.Path())); boltHoles(fl);
                    s.add(ext(fl, t.tf, -t.tf, hub));
                    const sp = new THREE.Shape(); sp.absarc(0, 0, spR, 0, 2 * PI, false); const spi = new THREE.Path(); spi.absarc(0, 0, spR - spW, 0, 2 * PI, true); sp.holes.push(spi);
                    s.add(ext(sp, spH, 0, hub));                                                   // spigot ring on the face of hub A
                } else {
                    const outer = discShape(t.Df / 2), rec = new THREE.Path(); rec.absarc(0, 0, spR + spC, 0, 2 * PI, true); outer.holes.push(rec); boltHoles(outer);
                    s.add(ext(outer, spH, 0, hub));                                                // outer land of the face, with the annular recess for the spigot
                    const isl = discShape(spR - spW - spC); isl.holes.push(keywayHole(new THREE.Path()));
                    s.add(ext(isl, spH, 0, hub));                                                  // inner land
                    const fl = discShape(t.Df / 2); fl.holes.push(keywayHole(new THREE.Path())); boltHoles(fl);
                    s.add(ext(fl, t.tf - spH, spH, hub));
                }
                const hb = new THREE.Shape(); hb.absarc(0, 0, t.Dh / 2, 0, 2 * PI, false); hb.holes.push(keywayHole(new THREE.Path()));
                s.add(ext(hb, t.Lh - t.tf, sg < 0 ? -t.Lh : t.tf, hub));
            };
            const kz0 = t.Lh - t.kl - 6, kz1 = t.Lh - 6;          // keyway / key position along the hub, measured from the flange face
            const shaftBuild = (side) => (s) => {
                const r = d / 2, z = (a, c) => (side > 0 ? [a, c] : [-c, -a]);
                const seg = (a, c, m) => { const [lo, hi] = z(a, c); s.add(ext(m, hi - lo, lo, steel)); };
                const disc = (len) => { const sh = new THREE.Shape(); sh.absarc(0, 0, r, 0, 2 * PI, false); return sh; };
                seg(1, kz0, disc()); seg(kz0, kz1, notchedDisc()); seg(kz1, 1 + Ls, disc());
            };
            const keyMesh = {};
            const keyBase = d / 2 - t1 + t.kh / 2, keyLift = 0.9 * t.Dh;
            const keyBuild = (side) => (s) => { const m = at(boxM(t.kb, t.kh, t.kl, keyM), 0, keyBase, side * ((kz0 + kz1) / 2)); keyMesh[side] = m; s.add(m); };
            const vFlange = (volTube(t.Df / 2, d / 2, t.tf) - nb * volCyl(t.M / 2 + 0.6, t.tf)) + volTube(t.Dh / 2, d / 2, t.Lh - t.tf);
            const hexA = 0.866 * b.af * b.af;
            const defs = [
                { id: 'cp_shaftA', build: shaftBuild(-1), off: [0, 0, -2.2 * t.Lh], order: 1, vol: volCyl(d / 2, Ls) },
                { id: 'cp_keyA', build: keyBuild(-1), off: [0, 0, -2.2 * t.Lh], order: 2, vol: t.kb * t.kh * t.kl },
                { id: 'cp_hubA', build: hubBuild(-1), off: [0, 0, -1.0 * t.Lh], order: 3, vol: vFlange },
                { id: 'cp_shaftB', build: shaftBuild(1), off: [0, 0, 2.2 * t.Lh], order: 4, vol: volCyl(d / 2, Ls), label: false },
                { id: 'cp_keyB', build: keyBuild(1), off: [0, 0, 2.2 * t.Lh], order: 5, vol: t.kb * t.kh * t.kl, label: false },
                { id: 'cp_hubB', build: hubBuild(1), off: [0, 0, 1.0 * t.Lh], order: 6, vol: vFlange, label: false },
                {
                    id: 'cp_bolt', order: 7, qty: nb, off: [0, 0, -2.0 * t.Lh], vol: volCyl(t.M / 2, 2 * t.tf + b.hh + b.nut + 2) + hexA * b.hh,
                    build: (s) => {
                        for (let k = 0; k < nb; k++) {
                            const a = (k * 2 * PI) / nb, g = new THREE.Group();
                            g.add(at(hexZ(b.af, b.hh, bolt), 0, 0, -t.tf - b.hh / 2));
                            const L = 2 * t.tf + b.hh + b.nut + 2;
                            g.add(at(cylZ(t.M / 2, L, 14, bolt), 0, 0, -t.tf - b.hh + L / 2));
                            g.position.set((t.pcd / 2) * Math.cos(a), (t.pcd / 2) * Math.sin(a), 0); s.add(g);
                        }
                    }
                },
                {
                    id: 'cp_nut', order: 8, qty: nb, off: [0, 0, 1.9 * t.Lh], vol: (hexA - PI * (t.M / 2) * (t.M / 2)) * b.nut, label: true,
                    build: (s) => { for (let k = 0; k < nb; k++) { const a = (k * 2 * PI) / nb, R = b.af / Math.sqrt(3), hx = new THREE.Shape(); for (let i = 0; i < 6; i++) { const x = R * Math.cos((i * PI) / 3 + PI / 6), y = R * Math.sin((i * PI) / 3 + PI / 6); if (i === 0) hx.moveTo(x, y); else hx.lineTo(x, y); } hx.closePath(); const bore = new THREE.Path(); bore.absarc(0, 0, t.M / 2, 0, 2 * PI, true); hx.holes.push(bore); s.add(at(new THREE.Mesh(new THREE.ExtrudeGeometry(hx, { depth: b.nut, bevelEnabled: false, curveSegments: 14 }), bolt), (t.pcd / 2) * Math.cos(a), (t.pcd / 2) * Math.sin(a), t.tf)); } }
                }
            ];
            let th = 0;
            const { root, world, parts } = DIS.assemble(p, api, defs, {
                update(dt, time, ps) { th += K.rpmToVis(p.rpm) * dt; ps.forEach((q) => { q.spin.rotation.z = th; }); },
                afterLayout(ps, e, step) { ps.forEach((q) => { if (q.id === 'cp_keyA' || q.id === 'cp_keyB') { const ee = step > 0 ? (q.order === step ? Math.max(e, 0.4) : 0) : Math.max(0, (e - 0.78) / 0.22), m = keyMesh[q.id === 'cp_keyA' ? -1 : 1]; if (m) m.position.y = keyBase + ee * keyLift; } }); }
            });
            world.rotation.x = -PI / 2;     // axis vertical: tall assemblies fill a portrait screen
            DIS.fit(root, 0, 0, 0, 0.62 * t.Df, 3.35 * t.Lh + 32, [0.55, 0.22, 1]);
            root.userData.target = [0, 0, 0];
            return root;
        },
        readouts(p) {
            const c = calc(p), t = c.t, w = (2 * PI * p.rpm) / 60;
            const st = DIS.sfState;
            return [
                { k: L2('Power P = T·ω', 'القدرة P = T·ω'), v: fmt((p.torque * w) / 1000) + ' kW' },
                { k: L2('Hub Ø / flange Ø / PCD', 'قطر المحور / الفلنجة / PCD'), v: t.Dh + ' / ' + t.Df + ' / ' + t.pcd + ' mm' },
                { k: L2('Bolts', 'البراغي'), v: p.nb + ' × M' + t.M + ' · ' + p.grade },
                { k: L2('Bolt shear τ (force ' + fmt(c.F) + ' N each)', 'قص البراغي τ (القوة ' + fmt(c.F) + ' N لكل برغي)'), v: fmt(c.tauB) + ' MPa · SF ' + fmt(c.sfB), state: st(c.sfB) },
                { k: L2('Key ' + t.kb + '×' + t.kh + '×' + t.kl + ' shear τ', 'قص الخابور ' + t.kb + '×' + t.kh + '×' + t.kl), v: fmt(c.tauK) + ' MPa · SF ' + fmt(c.sfK), state: st(c.sfK) },
                { k: L2('Key crushing pressure', 'ضغط سحق الخابور'), v: fmt(c.pK) + ' MPa · SF ' + fmt(c.sfP), state: st(c.sfP) },
                { k: L2('Shaft torsion τ', 'التواء العمود τ'), v: fmt(c.tauS) + ' MPa · SF ' + fmt(c.sfS), state: st(c.sfS) },
                { k: L2('Weakest link', 'أضعف حلقة'), v: nameOf[c.weakest][DIS.lang()] + ' · SF ' + fmt(c.min), state: st(c.min) },
                DIS.fitRow(L2('Hub bore on shaft', 'ثقب المحور على العمود'), p.d, 'k', 6),
                { k: L2('Mass (calc.)', 'الكتلة (تقديرية)'), v: DIS.fmtMass(DIS.cur.rows.reduce((a, q) => a + q.mass, 0)) }
            ];
        },
        challenges: () => [
            CH('Transmit 600 N·m with every safety factor ≥ 1.5 (which shaft size can do it?).', 'انقل 600 N·m مع معامل أمان ≥ 1.5 لكل العناصر (أي قطر عمود يستطيع؟).', (p) => p.torque >= 600 && calc(p).min >= 1.5),
            CH('Ø40 shaft, class 8.8: use the fewest bolts that still give SF ≥ 2 at 400 N·m or more.', 'عمود Ø40 وفئة 8.8: استعمل أقل عدد براغي يحقق SF ≥ 2 عند 400 N·m فأكثر.', (p) => {
                if (p.d !== 40 || p.grade !== '8.8' || p.torque < 400 || calc(p).sfB < 2) return false;
                return p.nb === 3 || calc({ ...p, nb: p.nb - 1 }).sfB < 2;
            }),
            CH('Ø40 shaft, class 8.8, 6 bolts: find the highest torque (10 N·m steps) at which every safety factor is still ≥ 1.', 'عمود Ø40 وفئة 8.8 و6 براغٍ: اوجد أعلى عزم (بخطوات 10 N·m) يبقى عنده كل معامل أمان ≥ 1.', (p) => p.d === 40 && p.grade === '8.8' && p.nb === 6 && calc(p).min >= 1 && calc({ ...p, torque: p.torque + 10 }).min < 1)
        ],
        panels(p) {
            const c = calc(p);
            return [
                { title: L2('Safety factors (≥ 1.5 recommended)', 'معاملات الأمان (يُنصح ≥ 1.5)'), unit: '', rows: [{ label: nameOf.bolts, value: c.sfB, color: c.sfB < 1 ? '#dc2626' : undefined }, { label: nameOf.key, value: c.sfK, color: c.sfK < 1 ? '#dc2626' : undefined }, { label: nameOf.crush, value: c.sfP, color: c.sfP < 1 ? '#dc2626' : undefined }, { label: nameOf.shaft, value: c.sfS, color: c.sfS < 1 ? '#dc2626' : undefined }] },
                { title: L2('Torque capacity at SF = 1', 'سعة العزم عند SF = 1'), unit: 'N·m', rows: [{ label: nameOf.bolts, value: c.Tcap.bolts }, { label: nameOf.key, value: c.Tcap.key }, { label: nameOf.crush, value: c.Tcap.crush }, { label: nameOf.shaft, value: c.Tcap.shaft }, { label: L2('Applied', 'المطبّق'), value: p.torque, color: '#16a34a' }] }
            ];
        }
    });
})();
