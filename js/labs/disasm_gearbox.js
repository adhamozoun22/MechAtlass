/* Disassembly lab — single-stage spur gearbox (horizontally split housing, module 2 mm).
 * Shows the real assembly order: base → shafts + bearings → gear + key → caps + seals → cover → bolts.
 * Design checks: gear bending, bearing life on both shafts, key crushing, heat balance of the housing. */
(function () {
    'use strict';
    const DIS = window.DIS;
    if (!DIS || !DIS.bearingMeshes) return;
    const { L2, mat, COL, DEN, cylZ, tubeZ, boxM, hexZ, at, volTube, volCyl, CH, fmt, K, P } = DIS;
    const KW = 12, KT1 = 5, KT2 = 3.3;           // output key 12×8: slot depth in shaft / hub (ISO 773)
    const PI = Math.PI, M = 2;                  // module, mm
    const TW = 20, WI = 44, ZB = WI / 2 + TW / 2; // end-plate thickness, inner width, bearing plane (±z)
    const GW = 20, HUB = 12;                    // gear face width and the hub on its rear side
    const KEY = { b: 12, h: 8, l: 32 };         // output shaft key (Ø40) — ISO 773
    const ETA = 0.97;                           // gears 0.98 × bearings/seals 0.99

    const dIn = () => DIS.bearingDims(6206), dOut = () => DIS.bearingDims(6208);
    const geo = (p) => {
        const z1 = p.z1, z2 = Math.max(p.z2, 82 - p.z1), a = (M * (z1 + z2)) / 2, ra1 = (M * z1) / 2 + M, ra2 = (M * z2) / 2 + M;
        const bi = dIn(), bo = dOut();
        const xmin = -Math.max(ra1 + 14, bi.D / 2 + 10), xmax = a + Math.max(ra2 + 12, bo.D / 2 + 10);
        const Hb = Math.max(ra2, bo.D / 2) + 26, Hc = Math.max(ra2, bo.D / 2) + 10;
        return { z1, z2, a, ra1, ra2, xmin, xmax, Hb, Hc, bi, bo, Lx: xmax - xmin, Wz: WI + 2 * TW };
    };
    const polyArea = (pts) => { let s = 0; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) s += pts[j][0] * pts[i][1] - pts[i][0] * pts[j][1]; return Math.abs(s) / 2; };
    const gearPts = (t) => K.gearPoints(t).map((q) => [q[0] * 10, q[1] * 10]);           // scene units → mm (module 2 mm)
    function gearMesh(t, width, holeR, color, keyed) {
        const sh = new THREE.Shape(gearPts(t).map((q) => new THREE.Vector2(q[0], q[1])));
        if (holeR) sh.holes.push(keyed ? DIS.keyHole(holeR, KW, KT2) : (() => { const h = new THREE.Path(); h.absarc(0, 0, holeR, 0, 2 * PI, true); return h; })());
        const g = new THREE.ExtrudeGeometry(sh, { depth: width, bevelEnabled: false, curveSegments: 28 }); g.translate(0, 0, -width / 2);
        return new THREE.Mesh(g, mat(color, { metalness: 0.45, roughness: 0.42 }));
    }
    const gearVol = (t, width, holeR) => polyArea(gearPts(t)) * width - volCyl(holeR || 0, width);

    /* end plate with two half-round bearing seats; lower = −1 (y ≤ 0), upper = +1 */
    function plateShape(G, side) {
        const s = new THREE.Shape(), H = side < 0 ? G.Hb : G.Hc, y1 = side < 0 ? -H : H;
        const seats = [{ x: G.a, r: G.bo.D / 2 }, { x: 0, r: G.bi.D / 2 }];   // right → left
        s.moveTo(G.xmin, y1); s.lineTo(G.xmax, y1); s.lineTo(G.xmax, 0);
        seats.forEach((st) => { s.lineTo(st.x + st.r, 0); s.absarc(st.x, 0, st.r, 0, side < 0 ? -PI : PI, side < 0); });
        s.lineTo(G.xmin, 0); s.lineTo(G.xmin, y1);
        seats.forEach((st) => [0, 1, 2, 3].forEach((k) => { const an = (k * PI) / 2 + PI / 4; if (Math.sin(an) * side > 0) { const h = new THREE.Path(); h.absarc(st.x + (st.r + 3.5) * Math.cos(an), (st.r + 3.5) * Math.sin(an), 2, 0, 2 * PI, true); s.holes.push(h); } }));
        return s;
    }
    /* flange strips on the two x-sides only (no strips on the z-sides, where the bearing caps sit) */
    const boltPos = (G) => { const o = []; const zs = [0, 1, 2, 3].map((i) => -(G.Wz / 2 - 10) + ((G.Wz - 20) * i) / 3); [G.xmin - 8, G.xmax + 8].forEach((x) => zs.forEach((z) => o.push([x, z]))); return o; };
    function rimMesh(G, y0, m) {
        const g = new THREE.Group();
        [[G.xmin - 14, G.xmin], [G.xmax, G.xmax + 14]].forEach((xr) => {
            const s = new THREE.Shape(); s.moveTo(xr[0], -G.Wz / 2); s.lineTo(xr[1], -G.Wz / 2); s.lineTo(xr[1], G.Wz / 2); s.lineTo(xr[0], G.Wz / 2); s.lineTo(xr[0], -G.Wz / 2);
            boltPos(G).forEach((b) => { if (b[0] > xr[0] && b[0] < xr[1]) { const c = new THREE.Path(); c.absarc(b[0], b[1], 4.5, 0, 2 * PI, true); s.holes.push(c); } });
            const ge = new THREE.ExtrudeGeometry(s, { depth: 12, bevelEnabled: false, curveSegments: 16 }); ge.rotateX(-PI / 2); ge.translate(0, y0, 0); g.add(new THREE.Mesh(ge, m));
        });
        return g;
    }
    /* flat slab with a round hole (drain-plug / breather) */
    function slabMesh(G, y0, hx, hr, m) {
        const s = new THREE.Shape(); s.moveTo(G.xmin, -WI / 2); s.lineTo(G.xmax, -WI / 2); s.lineTo(G.xmax, WI / 2); s.lineTo(G.xmin, WI / 2); s.lineTo(G.xmin, -WI / 2);
        const h = new THREE.Path(); h.absarc(hx, 0, hr, 0, 2 * PI, true); s.holes.push(h);
        const g = new THREE.ExtrudeGeometry(s, { depth: 8, bevelEnabled: false, curveSegments: 32 }); g.rotateX(-PI / 2); g.translate(0, y0, 0); return new THREE.Mesh(g, m);
    }
    function plateMesh(G, side, z, m) { const g = new THREE.ExtrudeGeometry(plateShape(G, side), { depth: TW, bevelEnabled: false, curveSegments: 40 }); g.translate(0, 0, z - TW / 2); return new THREE.Mesh(g, m); }

    function bearingGroup(d, s, g) {
        const m = DIS.bearingMeshes(d, 'none');
        g.add(m.outer); s.add(m.inner, m.balls, m.cageA, m.cageB);
        return m.V;
    }
    const bearVol = (V, Z) => V.outer + V.inner + V.ball * Z + V.cageA + V.cageB;

    function calc(p) {
        const G = geo(p), z2 = G.z2, i = z2 / p.z1, d1 = M * p.z1, n2 = p.rpm / i, T2 = p.torque * i * ETA;
        const Ft = (2000 * p.torque) / d1, Fr = Ft * Math.tan((20 * PI) / 180), F = Math.hypot(Ft, Fr), R = F / 2;
        const Lh1 = (Math.pow(G.bi.C * 1000 / R, 3) * 1e6) / (60 * p.rpm), Lh2 = (Math.pow(G.bo.C * 1000 / R, 3) * 1e6) / (60 * n2);
        const keyLe = KEY.l - KEY.b, pKey = (4 * T2 * 1000) / (40 * KEY.h * keyLe), tauKey = (2 * T2 * 1000) / (40 * KEY.b * keyLe);
        const sfKeyP = 120 / pKey, sfKeyS = (0.577 * 340) / tauKey;
        const tauIn = (16 * p.torque * 1000) / (PI * 30 * 30 * 30), sfIn = (0.577 * 340) / tauIn;
        const Pin = (p.torque * 2 * PI * p.rpm) / 60, Ploss = Pin * (1 - ETA);
        const Aoh = (2 * (G.Lx * G.Wz + G.Lx * (G.Hb + G.Hc) + G.Wz * (G.Hb + G.Hc))) / 1e6, dT = Ploss / (20 * Aoh);
        const v2 = (PI * M * z2 * n2) / 60000;
        return { G, i, d1, n2, T2, Ft, Fr, R, Lh1, Lh2, pKey, sfKeyP, sfKeyS, sfIn, Pin, Ploss, Aoh, dT, v2 };
    }

    DIS.addParts({
        gb_base: P(L2('Housing — lower half', 'الهيكل — النصف السفلي'), L2('Holds the oil bath and the lower halves of the four bearing seats. The shafts simply lay into it.', 'يحمل حمّام الزيت والنصفين السفليين لمقاعد المحامل الأربعة، وتُوضع الأعمدة فيه ببساطة.'),
            L2('Grey cast iron EN-GJL-250 (GG25): good damping, easy to cast', 'حديد زهر رمادي EN-GJL-250 (GG25): امتصاص اهتزاز جيد وسهل السباكة'), L2('Keeps the shafts at exactly the right centre distance and contains the oil.', 'يُبقي العمودين على المسافة الصحيحة ويحتوي الزيت.'),
            L2('Sand casting → stress relief → milling of the split face → bearing seats line-bored together with the cover', 'سباكة رملية ← إزالة الإجهادات ← تفريز وجه الفصل ← خرط مقاعد المحامل (Line boring) مع الغطاء معاً'),
            L2('Split-face flatness 0.05 mm; seat bores H7; centre distance ±0.03 mm', 'استواء وجه الفصل 0.05 mm؛ ثقوب المقاعد H7؛ المسافة بين المحورين ±0.03 mm'), L2('EN 1561 (cast iron), ISO 286', 'EN 1561 (حديد زهر)، ISO 286'),
            L2('Fit two dowel pins, then seal the split face with anaerobic sealant (no gasket — it would change the bore).', 'ركّب مسمارين تمركز ثم اغلق وجه الفصل بمانع تسريب لاهوائي (بدون جوان حتى لا يتغير الثقب).')),
        gb_cover: P(L2('Housing — cover', 'غطاء الهيكل'), L2('The upper half. It is bored together with the base, so the two are a matched pair.', 'النصف العلوي. يُخرط مع القاعدة معاً فيشكلان زوجاً متطابقاً.'),
            L2('Grey cast iron EN-GJL-250', 'حديد زهر رمادي EN-GJL-250'), L2('Closes the housing and clamps the outer rings of the bearings.', 'يغلق الهيكل ويشد الحلقات الخارجية للمحامل.'),
            L2('Cast → machined as a pair with the base', 'سباكة ← تشغيل كزوج مع القاعدة'), L2('Never swap covers between gearboxes: the seat bores are only round when the original pair is bolted together', 'لا تبدّل الأغطية بين علب التروس: الثقوب لا تكون دائرية إلا مع زوجها الأصلي'), L2('—', '—'),
            L2('Lower straight down onto the dowels; do not drag it over the shafts.', 'أنزله عمودياً على مسماري التمركز دون سحبه فوق الأعمدة.')),
        gb_bolt: P(L2('Cover bolts', 'براغي الغطاء'), L2('Eight M8 bolts clamp the cover to the base.', 'ثمانية براغٍ M8 تشدّ الغطاء إلى القاعدة.'),
            L2('Steel property class 8.8 (ISO 898-1), zinc-flake coated', 'فولاذ بفئة 8.8 (ISO 898-1) بطلاء زنك'), L2('Keep the split face tight so the oil stays in and the bearing seats stay round.', 'تُبقي وجه الفصل محكماً ليبقى الزيت داخلاً وتبقى مقاعد المحامل مستديرة.'),
            L2('Cold-headed, thread rolled, heat treated', 'تشكيل على البارد ودرفلة أسنان ومعالجة حرارية'), L2('Tighten to the torque in the manufacturer\'s manual', 'شدّ حسب عزم الشدّ في دليل الصانع'), L2('ISO 4017', 'ISO 4017'),
            L2('Tighten in a diagonal sequence, in two passes (50 %, then 100 %).', 'شدّ بتسلسل قطري على مرحلتين (50% ثم 100%).')),
        gb_in: P(L2('Input shaft with pinion', 'عمود الدخل مع البنيون'), L2('One piece: the shaft and the small gear are machined from the same bar (a "pinion shaft").', 'قطعة واحدة: العمود والترس الصغير مشغّلان من القضيب نفسه (عمود بنيون).'),
            L2('16MnCr5 (SAE 5115) case-hardened, 58–62 HRC at the teeth', '16MnCr5 (SAE 5115) مُسقّى سطحياً، 58–62 HRC عند الأسنان'), L2('Carries the motor torque into the gear mesh.', 'ينقل عزم المحرك إلى تعشيق التروس.'),
            L2('Forged → turned → teeth hobbed → carburised & hardened → bearing seats and teeth ground', 'طرق ← خراطة ← تفريز الأسنان بالهوب ← كربنة وتقسية ← جلخ مقاعد المحامل والأسنان'),
            L2('Bearing seats k5; tooth quality ISO 1328 grade 6; runout ≤ 0.02 mm', 'مقاعد المحامل k5؛ جودة الأسنان ISO 1328 درجة 6؛ اهتزاز ≤ 0.02 mm'), L2('ISO 1328, ISO 53 (tooth form)', 'ISO 1328، ISO 53 (شكل السن)'),
            L2('Press (or heat) the two bearings on by their INNER rings; then lay the shaft into the base.', 'اكبس (أو سخّن) المحملين على الحلقة الداخلية فقط ثم ضع العمود في القاعدة.')),
        gb_out: P(L2('Output shaft', 'عمود الخرج'), L2('A stepped shaft that carries the big gear on a key and leaves the box on the right.', 'عمود مدرّج يحمل الترس الكبير على خابور ويخرج من الصندوق من اليمين.'),
            L2('42CrMo4 (AISI 4140) quenched & tempered, 28–32 HRC', '42CrMo4 (AISI 4140) مُقسّى ومُرجَّع، 28–32 HRC'), L2('Takes the multiplied torque to the machine.', 'ينقل العزم المضاعف إلى الآلة.'),
            L2('Forged bar → rough turned → heat treated → finish turned → keyway milled → seats ground', 'قضيب مطروق ← خراطة خشنة ← معالجة حرارية ← خراطة نهائية ← فرز المجرى ← جلخ المقاعد'),
            L2('Gear seat Ø40 k6; bearing seats k5; keyway N9; shoulder fillet R ≥ 1 mm (stress concentration)', 'مقعد الترس Ø40 k6؛ مقاعد المحامل k5؛ المجرى N9؛ نصف قطر الكتف ≥ 1 mm (تركّز إجهاد)'), L2('ISO 286, ISO 773', 'ISO 286، ISO 773'),
            L2('Fit the key, push the gear on (heated), then the bearings, then lay it in the base.', 'ركّب الخابور وادفع الترس (مسخّناً) ثم المحملين ثم ضع العمود في القاعدة.')),
        gb_gear: P(L2('Gear wheel', 'عجلة التروس'), L2('The big gear. A short hub on the back gives the key enough length.', 'الترس الكبير. وللمحور القصير في ظهره طول كافٍ للخابور.'),
            L2('42CrMo4 quenched & tempered, teeth induction hardened', '42CrMo4 مُقسّى ومُرجَّع مع تقسية حثّية للأسنان'), L2('Receives power from the pinion and multiplies the torque by the ratio.', 'يستقبل القدرة من البنيون ويضاعف العزم بنسبة التروس.'),
            L2('Forged blank → turned → teeth hobbed → hardened → bore and keyway finished', 'قطعة مطروقة ← خراطة ← تفريز الأسنان ← تقسية ← إنهاء الثقب والمجرى'),
            L2('Bore H7 (fit H7/k6 on the shaft); tooth quality grade 7; keyway JS9', 'الثقب H7 (توافق H7/k6 مع العمود)؛ جودة الأسنان درجة 7؛ المجرى JS9'), L2('ISO 1328, ISO 286', 'ISO 1328، ISO 286'),
            L2('Heat to ≈ 100 °C and slide onto the key until it touches the shoulder.', 'سخّنه إلى ≈ 100°م وأدخله على الخابور حتى يلامس الكتف.')),
        gb_key: P(L2('Key 12×8', 'الخابور 12×8'), L2('The small bar that locks the gear to the shaft.', 'القضيب الصغير الذي يقفل الترس على العمود.'),
            L2('C45 steel', 'فولاذ C45'), L2('Passes the torque between shaft and gear. It crushes before it shears, so check the bearing pressure.', 'ينقل العزم بين العمود والترس، ويُسحق قبل أن يُقصّ لذا افحص ضغط السحق.'),
            L2('Cut from bright flat bar', 'قص من شريط مصقول'), L2('Width h9', 'العرض h9'), L2('ISO 773 / DIN 6885', 'ISO 773 / DIN 6885'), L2('Fit into the shaft keyway before the gear.', 'يُركّب في مجرى العمود قبل الترس.')),
        gb_brgIn: P(L2('Input bearings 6206', 'محملات الدخل 6206'), L2('Two deep-groove ball bearings: they carry the radial load of the pinion shaft.', 'محملان كرويان عميقا المجرى يحملان الحمل الشعاعي لعمود البنيون.'),
            L2('100Cr6 bearing steel', 'فولاذ محامل 100Cr6'), L2('Support the shaft and let it turn with very little friction.', 'يسندان العمود ويدعانه يدور بأقل احتكاك.'),
            L2('See the bearing model: rings turned, hardened and ground; balls lapped', 'انظر نموذج المحمل: حلقات مخروطة ومقسّاة ومجلّخة وكريات مصقولة'), L2('Shaft k5, housing H7', 'العمود k5، الهيكل H7'), L2('ISO 15, ISO 281', 'ISO 15، ISO 281'),
            L2('Press on by the inner ring only. One bearing is fixed axially, the other is allowed to float.', 'اكبس على الحلقة الداخلية فقط. أحد المحملين مثبّت محورياً والآخر حرّ.')),
        gb_brgOut: P(L2('Output bearings 6208', 'محملات الخرج 6208'), L2('Larger bearings for the output shaft: it sees the same force but turns slower and must live longer.', 'محملات أكبر لعمود الخرج: يتحمل القوة نفسها لكن يدور أبطأ.'),
            L2('100Cr6 bearing steel', 'فولاذ محامل 100Cr6'), L2('Support the output shaft.', 'يسندان عمود الخرج.'), L2('As the input bearings', 'مثل محملات الدخل'), L2('Shaft k5, housing H7', 'العمود k5، الهيكل H7'), L2('ISO 15, ISO 281', 'ISO 15، ISO 281'),
            L2('Same procedure as the input bearings.', 'الإجراء نفسه كما في محملات الدخل.')),
        gb_capC: P(L2('Closed end cap', 'غطاء نهاية مغلق'), L2('A blind cover that closes a bearing seat and sets the axial position of the bearing.', 'غطاء أعمى يغلق مقعد المحمل ويحدد موضعه المحوري.'),
            L2('Grey cast iron or aluminium', 'حديد زهر رمادي أو ألومنيوم'), L2('Keeps oil in and dirt out; locates the bearing axially.', 'يحبس الزيت ويمنع الأتربة ويحدد موضع المحمل محورياً.'),
            L2('Cast, turned on the spigot and face', 'سباكة وخراطة حلقة التمركز والوجه'), L2('Spigot h8 in the seat; shim pack sets 0.05–0.1 mm axial end play', 'حلقة التمركز h8؛ شرائح الضبط تعطي خلوصاً محورياً 0.05–0.1 mm'), L2('DIN 443 (similar)', 'DIN 443 (مشابه)'),
            L2('Tighten the four screws crosswise.', 'شدّ البراغي الأربعة بالتناوب المتقاطع.')),
        gb_capO: P(L2('Open end cap (shaft exit)', 'غطاء نهاية مفتوح (مخرج العمود)'), L2('A cover with a hole where the shaft leaves the box. The oil seal sits in this hole.', 'غطاء بفتحة يخرج منها العمود، ويجلس عازل الزيت في هذه الفتحة.'),
            L2('Grey cast iron or aluminium', 'حديد زهر رمادي أو ألومنيوم'), L2('Holds the radial shaft seal and locates the bearing.', 'يحمل عازل العمود الشعاعي ويحدد موضع المحمل.'),
            L2('Cast, seal bore turned H8', 'سباكة وخراطة ثقب العازل H8'), L2('Seal bore H8, Ra ≤ 3.2 µm', 'ثقب العازل H8 وخشونة Ra ≤ 3.2 µm'), L2('—', '—'),
            L2('Press the seal in first, then slide the cap over the shaft carefully (cover the keyway so it cannot cut the lip).', 'اضغط العازل أولاً ثم مرّر الغطاء على العمود بحذر (غطِّ المجرى كي لا يقطع الشفة).')),
        gb_seal: P(L2('Radial shaft seal', 'عازل العمود الشعاعي'), L2('A rubber lip ring that presses on the rotating shaft.', 'حلقة مطاطية بشفة تضغط على العمود الدوّار.'),
            L2('NBR or FKM rubber on a steel case', 'مطاط NBR أو FKM على غلاف فولاذي'), L2('Stops oil leaking out along the shaft.', 'يمنع تسرّب الزيت على طول العمود.'),
            L2('Moulded rubber bonded to a stamped steel case', 'مطاط مقولب ملتصق بغلاف فولاذي مكبوس'), L2('Shaft surface Ø h11, Ra 0.2–0.8 µm, 55–60 HRC, no lead (spiral) marks', 'سطح العمود Ø h11 وخشونة Ra 0.2–0.8 µm وصلادة 55–60 HRC دون أثر لولبي'), L2('DIN 3760 / ISO 6194', 'DIN 3760 / ISO 6194'),
            L2('Lip toward the oil; grease the lip before assembly.', 'الشفة جهة الزيت؛ وادهن الشفة بالشحم قبل التركيب.')),
        gb_capbolt: P(L2('Cap screws M4', 'براغي الأغطية M4'), L2('Small hex screws that hold the end caps.', 'براغٍ سداسية صغيرة تثبّت أغطية النهايات.'),
            L2('Steel class 8.8', 'فولاذ فئة 8.8'), L2('Clamp the end caps (and the seals) against the end plates.', 'تشدّ أغطية النهايات (والمانعات) على الصفائح الطرفية.'), L2('Cold-headed, thread rolled', 'تشكيل على البارد ودرفلة أسنان'), L2('Tighten to the torque in the manufacturer\'s manual', 'شدّ حسب عزم الشدّ في دليل الصانع'), L2('ISO 4017', 'ISO 4017'),
            L2('Tighten crosswise.', 'شدّ بالتناوب المتقاطع.')),
        gb_plug: P(L2('Drain plug', 'سدّادة التصريف'), L2('A magnetic plug at the lowest point.', 'سدّادة مغناطيسية عند أخفض نقطة.'),
            L2('Steel with a copper or aluminium sealing washer', 'فولاذ مع حلقة منع تسرّب من النحاس أو الألومنيوم'), L2('Lets you drain the oil — and its magnet collects wear particles (a free condition check).', 'تتيح تصريف الزيت، ويجمع مغناطيسها برادة التآكل (فحص حالة مجاني).'),
            L2('Turned from bar, thread cut', 'خراطة من قضيب وقطع سن'), L2('Thread G½ / M18×1.5', 'سن G½ / M18×1.5'), L2('DIN 908', 'DIN 908'), L2('Fit a new sealing washer each time.', 'ركّب حلقة منع تسرّب جديدة كل مرة.')),
        gb_breather: P(L2('Breather', 'صمام التنفس'), L2('A small vented cap on the cover.', 'غطاء صغير مُهوّى على الغطاء.'),
            L2('Plastic or brass with a filter element', 'بلاستيك أو نحاس مع عنصر ترشيح'), L2('Equalises the pressure when the oil heats up, so the seals do not blow out.', 'يعادل الضغط عند سخونة الزيت فلا تُطرد العوازل.'),
            L2('Moulded / turned', 'حقن / خراطة'), L2('Thread M12×1.25', 'سن M12×1.25'), L2('—', '—'), L2('Mount on the highest point of the cover, away from the oil splash.', 'يُركّب في أعلى نقطة من الغطاء بعيداً عن رذاذ الزيت.'))
    });

    DIS.add('gearbox', L2('Gearbox', 'علبة تروس'), {
        controls: () => [
            { type: 'title', label: L2('Gear pair (module 2 mm)', 'زوج التروس (موديول 2 mm)') },
            { id: 'z1', type: 'range', label: L2('Pinion teeth z₁', 'أسنان البنيون z₁'), min: 18, max: 28, step: 1, value: 20, rebuild: true },
            { id: 'z2', type: 'range', label: L2('Gear teeth z₂', 'أسنان الترس z₂'), min: 54, max: 90, step: 1, value: 64, rebuild: true },
            { id: 'mat', type: 'select', label: L2('Gear material', 'مادة التروس'), options: K.MATS.map((m) => ({ v: m.v, label: m.label })), value: 'alloy' },
            { type: 'title', label: L2('Duty (input shaft)', 'ظروف التشغيل (عمود الدخل)') },
            { id: 'torque', type: 'range', label: L2('Input torque', 'عزم الدخل'), min: 5, max: 200, step: 1, value: 25, unit: 'N·m' },
            { id: 'rpm', type: 'range', label: L2('Input speed', 'سرعة الدخل'), min: 100, max: 3000, step: 50, value: 1450, unit: 'rpm' },
            { id: 'oil', type: 'toggle', label: L2('Show oil level', 'إظهار مستوى الزيت'), value: false },
            ...DIS.common(13)
        ],
        build(p, api) {
            const G = geo(p), { a } = G, bi = G.bi, bo = G.bo;
            const castM = mat(COL.cast, { metalness: 0.15, roughness: 0.7 }), capM = mat(0x7f8da0), shaftM = mat(COL.steel), darkM = mat(COL.dark, { metalness: 0.4 });
            const rimOut = G.Lx + 28, rimZ = G.Wz;
            const hbBase = G.Hb, hbCov = G.Hc;
            /* ---- housing halves ---- */
            const baseBuild = (s) => {
                s.add(plateMesh(G, -1, -ZB, castM), plateMesh(G, -1, ZB, castM));
                s.add(at(boxM(8, G.Hb, WI, castM), G.xmin + 4, -G.Hb / 2, 0), at(boxM(8, G.Hb, WI, castM), G.xmax - 4, -G.Hb / 2, 0));
                s.add(slabMesh(G, -G.Hb, (G.xmin + G.xmax) / 2, 6.4, castM));
                s.add(rimMesh(G, -12, castM));
                const pad = tubeZ(16, 6.4, 3, castM, 32); pad.rotation.x = PI / 2; pad.position.set((G.xmin + G.xmax) / 2, -G.Hb - 1.5, 0); s.add(pad);   // boss pad round the drain-plug hole
            };
            const bx = (G.xmin + a) / 2 + 20;
            const coverBuild = (s) => {
                s.add(plateMesh(G, +1, -ZB, castM), plateMesh(G, +1, ZB, castM));
                s.add(at(boxM(8, G.Hc, WI, castM), G.xmin + 4, G.Hc / 2, 0), at(boxM(8, G.Hc, WI, castM), G.xmax - 4, G.Hc / 2, 0));
                s.add(slabMesh(G, G.Hc - 8, bx, 7, castM));
                s.add(rimMesh(G, 0, castM));
                const boss = tubeZ(14, 7, 6, castM, 32); boss.rotation.x = PI / 2; boss.position.set(bx, G.Hc + 3, 0); s.add(boss);   // threaded boss for the breather
            };
            const vPlate = (H, r1, r2) => (G.Lx * H - (PI * (r1 * r1 + r2 * r2)) / 2) * TW;
            const vBase = 2 * vPlate(G.Hb, bi.D / 2, bo.D / 2) + 2 * 8 * G.Hb * WI + G.Lx * 8 * WI + (rimOut * rimZ - G.Lx * G.Wz) * 12;
            const vCov = 2 * vPlate(G.Hc, bi.D / 2, bo.D / 2) + 2 * 8 * G.Hc * WI + G.Lx * 8 * WI + (rimOut * rimZ - G.Lx * G.Wz) * 12;
            /* ---- shafts, gears, key ---- */
            const inBuild = (s) => { s.add(at(cylZ(15, 134, 36, shaftM), 0, 0, -25)); s.add(gearMesh(p.z1, GW, 0, COL.gear1)); };
            const outBuild = (s) => {
                s.add(at(new THREE.Mesh(DIS.keyedShaftGeo(20, KEY.l + 20, KW, KT1, 36), shaftM), 0, 0, -16));     // keyway section (open at the left end, closed at z = +10)
                s.add(at(cylZ(20, 85, 36, shaftM), 0, 0, 52.5));                                                   // right end through the seal
            };
            const gearBuild = (s) => {
                s.add(gearMesh(G.z2, GW, 20, COL.amber, true));
                s.add(at(new THREE.Mesh(DIS.keyedRingGeo(26, 20, HUB, KW, KT2, 40), mat(COL.amber, { metalness: 0.4 })), 0, 0, -GW / 2 - HUB / 2));
            };
            const keyBuild = (s) => s.add(at(boxM(KEY.b, KEY.h, KEY.l, mat(COL.key, { metalness: 0.4 })), 0, 20 - KT1 + KEY.h / 2, -6));
            /* ---- bearings (two per shaft) ---- */
            const vbIn = (() => { const m = DIS.bearingMeshes(bi, 'none'); return bearVol(m.V, bi.Z); })(), vbOut = (() => { const m = DIS.bearingMeshes(bo, 'none'); return bearVol(m.V, bo.Z); })();
            const brg = (d) => (s, g) => bearingGroup(d, s, g);
            /* ---- caps ---- */
            const capR = (D) => D / 2 + 5.5;
            const capShape = (D, ri) => { const sh = new THREE.Shape(); sh.absarc(0, 0, capR(D), 0, 2 * PI, false); if (ri > 0) { const h = new THREE.Path(); h.absarc(0, 0, ri, 0, 2 * PI, true); sh.holes.push(h); }
                [0, 1, 2, 3].forEach((k) => { const an = (k * PI) / 2 + PI / 4, h = new THREE.Path(); h.absarc((D / 2 + 3.5) * Math.cos(an), (D / 2 + 3.5) * Math.sin(an), 2, 0, 2 * PI, true); sh.holes.push(h); }); return sh; };
            const capRing = (D, ri, h, m) => { const g = new THREE.ExtrudeGeometry(capShape(D, ri), { depth: h, bevelEnabled: false, curveSegments: 40 }); g.translate(0, 0, -h / 2); return new THREE.Mesh(g, m); };
            const capC = (D) => (s) => s.add(capRing(D, 0, 8, capM));
            /* shaft-through cap: 4 mm lip + 4 mm counterbore on the housing side that holds the seal; sg = +1 for the +z side */
            const capO = (D, r, sg) => (s) => { s.add(at(capRing(D, r + 1, 4, capM), 0, 0, sg * 2)); s.add(at(capRing(D, r + 7, 4, capM), 0, 0, -sg * 2)); };
            const sealB = (r) => (s) => s.add(tubeZ(r + 7, r, 4, mat(COL.rubber, { metalness: 0.1, roughness: 0.85 }), 32));
            const screws = (D, z, sg) => (s) => { for (let k = 0; k < 4; k++) { const an = (k * PI) / 2 + PI / 4, R = D / 2 + 3.5; const g = new THREE.Group(); g.add(at(hexZ(7, 3, darkM), 0, 0, sg * 1.5)); g.add(at(cylZ(2, 20, 12, darkM), 0, 0, -sg * 10)); g.position.set(R * Math.cos(an), R * Math.sin(an), 0); s.add(g); } };
            const bolts = (s) => { boltPos(G).forEach((b) => { const g = new THREE.Group(); g.add(at(hexZ(13, 5.3, darkM), 0, 0, 2.65)); g.add(at(cylZ(4, 32, 12, darkM), 0, 0, -13)); g.rotation.x = -PI / 2; g.position.set(b[0], 12, b[1]); s.add(g); }); };
            /* ---- definitions: sg = side, segs = staged windows on the 0-1 slider, stepOff = approach path in step mode ---- */
            const zc = ZB + TW / 2 + 4, XO = a;                       // cap plane (centre)
            const Y = (v, w) => ({ v: [0, v, 0], w }), Zs = (v, w) => ({ v: [0, 0, v], w });
            const defs = [
                { id: 'gb_base', build: baseBuild, off: [0, 0, 0], order: 1, vol: vBase, den: DEN.cast },
                { id: 'gb_plug', build: (s) => { s.add(at(hexZ(19, 10, darkM), 0, 0, 0)); s.add(at(cylZ(6, 11, 20, shaftM), 0, 0, -10.5)); s.rotation.x = PI / 2; }, home: [(G.xmin + G.xmax) / 2, -G.Hb - 8, 0], off: [0, -90, 0], segs: [Y(-90, [0, 0.1])], order: 2, vol: 5000, label: true },
                { id: 'gb_in', build: inBuild, home: [0, 0, 0], off: [0, 100, 0], segs: [Y(100, [0.5, 0.65])], order: 3, vol: volCyl(15, 134) + gearVol(p.z1, GW, 0) },
                { id: 'gb_brgIn', build: brg(bi), home: [0, 0, -ZB], off: [0, 0, -75], segs: [Y(100, [0.5, 0.65]), Zs(-75, [0.65, 0.8])], order: 4, qty: 2, vol: vbIn },
                { id: 'gb_brgIn', build: brg(bi), home: [0, 0, ZB], off: [0, 0, 75], segs: [Y(100, [0.5, 0.65]), Zs(75, [0.65, 0.8])], order: 4, bom: false, label: false, vol: vbIn },
                { id: 'gb_out', build: outBuild, home: [XO, 0, 0], off: [0, 100, 0], segs: [Y(100, [0.5, 0.65])], order: 5, vol: volCyl(20, 137) },
                { id: 'gb_key', build: keyBuild, home: [XO, 0, 0], off: [0, 100, 0], stepOff: [0, 100, 0], segs: [Y(100, [0.5, 0.65])], order: 5, vol: KEY.b * KEY.h * KEY.l },
                { id: 'gb_gear', build: gearBuild, home: [XO, 0, 0], off: [0, 0, -60], stepOff: [0, 100, 0], segs: [Y(100, [0.5, 0.65]), Zs(-60, [0.8, 0.92])], order: 5, vol: gearVol(G.z2, GW, 20) + volTube(26, 20, HUB) },
                { id: 'gb_brgOut', build: brg(bo), home: [XO, 0, -ZB], off: [0, 0, -75], segs: [Y(100, [0.5, 0.65]), Zs(-75, [0.65, 0.8])], order: 6, qty: 2, vol: vbOut },
                { id: 'gb_brgOut', build: brg(bo), home: [XO, 0, ZB], off: [0, 0, 75], segs: [Y(100, [0.5, 0.65]), Zs(75, [0.65, 0.8])], order: 6, bom: false, label: false, vol: vbOut },
                { id: 'gb_capC', build: capC(bi.D), home: [0, 0, zc], off: [0, 0, 100], segs: [Zs(100, [0.25, 0.4])], order: 7, qty: 2, vol: volCyl(capR(bi.D), 8) },
                { id: 'gb_capC', build: capC(bo.D), home: [XO, 0, -zc], off: [0, 0, -100], segs: [Zs(-100, [0.25, 0.4])], order: 7, bom: false, label: false, vol: volCyl(capR(bo.D), 8) },
                { id: 'gb_capO', build: capO(bi.D, 15, -1), home: [0, 0, -zc], off: [0, 0, -100], segs: [Zs(-100, [0.25, 0.4])], order: 8, qty: 2, vol: volTube(capR(bi.D), 16, 4) + volTube(capR(bi.D), 22, 4) },
                { id: 'gb_capO', build: capO(bo.D, 20, 1), home: [XO, 0, zc], off: [0, 0, 100], segs: [Zs(100, [0.25, 0.4])], order: 8, bom: false, label: false, vol: volTube(capR(bo.D), 21, 4) + volTube(capR(bo.D), 27, 4) },
                { id: 'gb_seal', build: sealB(15), home: [0, 0, -(zc - 2)], off: [0, 0, -86], segs: [Zs(-86, [0.4, 0.5])], order: 9, qty: 2, vol: volTube(22, 15, 4), den: DEN.rubber },
                { id: 'gb_seal', build: sealB(20), home: [XO, 0, zc - 2], off: [0, 0, 86], segs: [Zs(86, [0.4, 0.5])], order: 9, bom: false, label: false, vol: volTube(27, 20, 4), den: DEN.rubber },
                { id: 'gb_capbolt', build: screws(bi.D, 1, 1), home: [0, 0, zc + 4], off: [0, 0, 140], segs: [Zs(140, [0.1, 0.25])], order: 10, qty: 16, vol: 1300 },
                { id: 'gb_capbolt', build: screws(bi.D, -1, -1), home: [0, 0, -(zc + 4)], off: [0, 0, -140], segs: [Zs(-140, [0.1, 0.25])], order: 10, bom: false, label: false, vol: 1300 },
                { id: 'gb_capbolt', build: screws(bo.D, -1, -1), home: [XO, 0, -(zc + 4)], off: [0, 0, -140], segs: [Zs(-140, [0.1, 0.25])], order: 10, bom: false, label: false, vol: 1300 },
                { id: 'gb_capbolt', build: screws(bo.D, 1, 1), home: [XO, 0, zc + 4], off: [0, 0, 140], segs: [Zs(140, [0.1, 0.25])], order: 10, bom: false, label: false, vol: 1300 },
                { id: 'gb_cover', build: coverBuild, off: [0, 210, 0], segs: [Y(210, [0.25, 0.45])], order: 11, vol: vCov, den: DEN.cast },
                { id: 'gb_breather', build: (s) => { const gold = mat(0xd4a94c); s.add(at(cylZ(5.5, 10, 20, shaftM), 0, 0, -5)); s.add(at(cylZ(10, 8, 6, gold), 0, 0, 4)); s.add(at(cylZ(6, 4, 20, gold), 0, 0, 10)); s.rotation.x = -PI / 2; }, home: [bx, G.Hc + 6, 0], off: [0, 320, 0], segs: [Y(320, [0, 0.1])], order: 12, vol: 2500, den: DEN.brass },
                { id: 'gb_bolt', build: bolts, off: [0, 270, 0], segs: [Y(270, [0, 0.15])], order: 13, qty: 8, vol: volCyl(4, 32) + 0.866 * 13 * 13 * 5.3 }
            ];
            /* oil bath (visual only) */
            let th = 0;
            const th20 = K.meshPhase(0, 0, p.z1, PI, G.z2), rr = p.z1 / G.z2;
            let partsRef = null;
            const rot = () => {
                const by = (id) => partsRef.filter((q) => q.id === id);
                by('gb_in')[0].spin.rotation.z = th;
                ['gb_gear', 'gb_out', 'gb_key'].forEach((id) => { by(id)[0].spin.rotation.z = th20 - th * rr; });
                by('gb_brgIn').forEach((q) => { q.spin.rotation.z = th; });
                const e = Math.max(0, Math.min(1, (+p.ex || 0) / 100)), f = (p.step | 0) > 0 ? 0 : Math.max(0, Math.min(1, (e - 0.92) / 0.08));
                const km = by('gb_key')[0].spin.children[0]; if (km) km.position.y = 20 - KT1 + KEY.h / 2 + 60 * f;   // key leaves its slot radially (in the shaft's own frame)
                by('gb_brgOut').forEach((q) => { q.spin.rotation.z = th20 - th * rr; });
            };
            const { root, world, parts } = DIS.assemble(p, api, defs, {
                update(dt, time, ps) { th += K.rpmToVis(p.rpm) * dt; partsRef = ps; rot(); }
            });
            partsRef = parts; rot();
            // oil: floor at −(Hb−8), level = 3 module above the lowest gear tooth tip
            const floorY = -(G.Hb - 8), level = Math.min(-4, -((M * G.z2) / 2 + M) + 3 * M);
            const oil = new THREE.Mesh(new THREE.BoxGeometry(G.Lx - 16, level - floorY, WI), new THREE.MeshStandardMaterial({ color: 0xd9a21b, transparent: true, opacity: 0.35, roughness: 0.2, depthWrite: false }));
            oil.position.set((G.xmin + G.xmax) / 2, (level + floorY) / 2, 0); oil.visible = !!p.oil; world.add(oil);
            const layout0 = root.userData.layout;
            root.userData.layout = (id) => { layout0(id); oil.visible = !!p.oil; };
            root.userData.oilLevel = level - floorY;
            DIS.fit(root, (G.xmin + G.xmax) / 2, 160, 0, (G.xmax - G.xmin) / 2 + 60, 285, [0.5, 0.55, 1]);
            const pIn = parts.find((q) => q.id === 'gb_in'), pGear = parts.find((q) => q.id === 'gb_gear');
            root.userData.solids = [{ obj: pIn.spin, poly: gearPts(p.z1), z0: -GW / 2, z1: GW / 2, width: GW }, { obj: pGear.spin, poly: gearPts(G.z2), z0: -GW / 2, z1: GW / 2, width: GW }];
            root.userData.geoG = G;
            return root;
        },
        readouts(p) {
            const c = calc(p), st = DIS.sfState, hrs = (h) => (h >= 1e6 ? '> 1,000,000' : fmt(h));
            const mass = DIS.cur.rows.reduce((a, q) => a + q.mass, 0);
            const oilL = ((c.G.Lx - 16) * WI * Math.max(0, Math.min(-4, -((M * c.G.z2) / 2 + M) + 3 * M) + (c.G.Hb - 8))) / 1e6;
            return [
                { k: L2('Ratio i = z₂/z₁', 'النسبة i = z₂/z₁'), v: fmt(c.i) + ' : 1' + (c.G.z2 !== p.z2 ? (DIS.ar() ? ' (عُدّل z₂=' + c.G.z2 + ' لمقاعد المحامل)' : ' (z₂ raised to ' + c.G.z2 + ' so the seats fit)') : ''), state: c.G.z2 !== p.z2 ? 'warn' : '' },
                { k: L2('Output speed / torque', 'سرعة / عزم الخرج'), v: fmt(c.n2) + ' rpm · ' + fmt(c.T2) + ' N·m' },
                { k: L2('Centre distance a = m(z₁+z₂)/2', 'المسافة بين المحورين a'), v: fmt(c.G.a) + ' mm' },
                { k: L2('Tooth force Fₜ / radial Fᵣ', 'قوة السن المماسية Fₜ / الشعاعية Fᵣ'), v: fmt(c.Ft) + ' / ' + fmt(c.Fr) + ' N' },
                ...K.strengthRows({ T: p.torque, d: M * p.z1, n: p.rpm, mn: M, z: Math.min(p.z1, c.G.z2), mat: p.mat }).slice(-2)
            ];
        },
        challenges: () => [
            CH('Reach a 4 : 1 ratio with both bearings ≥ 20,000 h.', 'حقق نسبة 4 : 1 مع عمر ≥ 20,000 ساعة لكلا المحملين.', (p) => { const c = calc(p); return c.i >= 4 && Math.min(c.Lh1, c.Lh2) >= 20000; }),
            CH('Carry 60 N·m input with a gear bending safety factor ≥ 1.5.', 'انقل 60 N·m عند الدخل مع معامل أمان انحناء ≥ 1.5.', (p) => p.torque >= 60 && K.strengthCalc({ T: p.torque, d: M * p.z1, n: p.rpm, mn: M, z: Math.min(p.z1, geo(p).z2), mat: p.mat }).sf >= 1.5),
            CH('Run at 2500 rpm or more and keep the oil below 80 °C.', 'شغّل عند 2500 rpm فأكثر وأبقِ حرارة الزيت تحت 80°م.', (p) => p.rpm >= 2500 && 25 + calc(p).dT < 80),
            CH('Find the load where the output key starts crushing (SF < 1).', 'اوجد الحمل الذي يبدأ عنده سحق الخابور (SF < 1).', (p) => calc(p).sfKeyP < 1)
        ],
        panels(p) {
            const c = calc(p), cap = 20 * c.Aoh * 55;
            return [
                { title: L2('Bearing life', 'عمر المحملات'), unit: '×1000 h', rows: [{ label: L2('Input 6206', 'الدخل 6206'), value: Math.min(c.Lh1, 1e6) / 1000, color: c.Lh1 < 20000 ? '#dc2626' : undefined }, { label: L2('Output 6208', 'الخرج 6208'), value: Math.min(c.Lh2, 1e6) / 1000, color: c.Lh2 < 20000 ? '#dc2626' : undefined }, { label: L2('Target', 'الهدف'), value: 20 }] },
                { title: L2('Forces in the mesh', 'القوى في التعشيق'), unit: 'N', rows: [{ label: L2('Tangential Fₜ', 'مماسية Fₜ'), value: c.Ft }, { label: L2('Radial Fᵣ', 'شعاعية Fᵣ'), value: c.Fr }, { label: L2('Bearing reaction', 'رد فعل المحمل'), value: c.R }] },
                { title: L2('Heat balance', 'الاتزان الحراري'), unit: 'W', rows: [{ label: L2('Loss', 'الفقد'), value: c.Ploss, color: c.Ploss > cap ? '#dc2626' : undefined }, { label: L2('Dissipation at +55 K', 'الإشعاع عند +55 K'), value: cap }] },
                K.stressPanel({ T: p.torque, d: M * p.z1, n: p.rpm, mn: M, z: Math.min(p.z1, c.G.z2), mat: p.mat })
            ];
        }
    });
})();
