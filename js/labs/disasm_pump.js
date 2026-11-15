/* Disassembly lab — end-suction centrifugal pump (back-pull-out design) with pump curve, system curve, NPSH,
 * radial / axial thrust, bearing life, shaft deflection and wear-ring leakage. All dimensions in mm. */
(function () {
    'use strict';
    const DIS = window.DIS;
    if (!DIS || !DIS.bearingMeshes) return;
    const { L2, mat, COL, DEN, cylZ, tubeZ, boxM, hexZ, at, volTube, volCyl, CH, fmt, K, P } = DIS;
    const PI = Math.PI, G = 9.81;

    /* ---------------- fixed frame (one pump size, impeller can be trimmed) ---------------- */
    const RB = 116, RT = 180, WALL = 13;        // volute: base radius, final radius, wall thickness
    const ZC0 = -12, ZC1 = -5, ZR0 = -4, ZR1 = 22, ZF1 = 30;   // cover, ring, front plate (z)
    const B2 = 12, TV = 3.5, D1 = 96, DWR = 102, DHUB = 40;    // impeller width, vane thickness, eye Ø, wear-ring Ø, hub Ø
    const BRG = 6206;
    const NB = 8, ANG0 = 0.4, ANGD = 0.769;     // casing studs: first angle, spacing (rad)
    const K0 = 73060;                           // system resistance at 100 % valve opening (s²/m⁵)
    const FL = {
        water: { rho: 998, eta: 1, h: 1, name: L2('Clean water 20 °C', 'ماء نظيف 20°م') },
        sea: { rho: 1025, eta: 1, h: 1, name: L2('Sea water', 'ماء بحر') },
        oil: { rho: 870, eta: 0.9, h: 0.95, name: L2('Light oil (20 cSt)', 'زيت خفيف (20 cSt)') }
    };
    const IM = {
        bronze: { col: 0xc58f3a, den: DEN.bronze, cav: 3, name: L2('Bronze CC480K', 'برونز CC480K') },
        ss: { col: 0xb9c2cc, den: 7.98e-6, cav: 5, name: L2('Stainless 316', 'ستانلس 316') },
        cast: { col: 0x6a7c91, den: DEN.cast, cav: 2, name: L2('Cast iron GG25', 'حديد زهر GG25') }
    };
    const MOTORS = [1.1, 1.5, 2.2, 3, 4, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90, 110];

    /* ---------------- hydraulic model ---------------- */
    function hyd(p) {
        const D2 = p.D2 / 1000, n = p.rpm, z = p.z, b = (p.beta * PI) / 180, fl = FL[p.fluid] || FL.water;
        const u2 = (PI * D2 * n) / 60, eps = 1 - (z * (TV / 1000)) / (PI * D2 * Math.sin(b));
        const area = PI * D2 * (B2 / 1000) * eps, sigma = Math.max(0.5, 1 - Math.sqrt(Math.sin(b)) / Math.pow(z, 0.7)), cot = 1 / Math.tan(b);
        const Qb = 0.1 * u2 * area;
        const Hth = (Q) => (sigma * u2 * (u2 - (Q / area) * cot)) / G;
        const H = (Q) => Math.max(0, Hth(Q) * (0.86 - 0.12 * Math.pow(Q / Qb - 1, 2)) * fl.h);
        const Hb = H(Qb), nq = (n * Math.sqrt(Qb)) / Math.pow(Hb, 0.75);
        const etaMax = Math.min(0.85, Math.max(0.5, 0.84 - 0.00015 * Math.pow(nq - 45, 2))) * fl.eta;
        // wear-ring leakage: Q_l = Cd·π·D·c·√(2gΔH), ΔH ≈ 0.6 H
        const lf = (c) => Math.min(0.5, (0.6 * PI * (DWR / 1000) * (c / 1000) * Math.sqrt(2 * G * 0.6 * Hb)) / Qb);
        const fw = (1 - lf(p.wc)) / (1 - lf(0.3));
        const eta = (Q) => { const x = Q / Qb; return x < 1 ? etaMax * fw * (2 * x - x * x) : Math.max(0.03, etaMax * fw * (2 * x - x * x)); };
        const Pk = (Q) => { Q = Math.max(Q, 1e-7); return (fl.rho * G * Q * H(Q)) / eta(Q) / 1000; };
        // operating point: pump curve = Hs + K·Q²,  K = K0 / valve²
        const Ks = K0 / Math.pow(p.valve / 100, 2), f = (Q) => H(Q) - p.Hs - Ks * Q * Q;
        let Q = 0, note = '';
        if (f(0) <= 0) note = 'deadhead';
        else if (f(1.9 * Qb) > 0) { Q = 1.9 * Qb; note = 'runout'; }
        else { let lo = 0, hi = 1.9 * Qb; for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (f(m) > 0) lo = m; else hi = m; } Q = (lo + hi) / 2; }
        const x = Q / Qb, Ho = H(Q), et = Q > 0 ? eta(Q) : 0, Po = Q > 0 ? Pk(Q) : Pk(0);
        // NPSH required (Pfleiderer-type): λ1·c1²/2g + λ2·w1²/2g
        const npshr = (q) => { const c1 = q / ((PI / 4) * D1 * D1 / 1e6), u1 = (PI * (D1 / 1000) * n) / 60; return (1.2 * c1 * c1 + 0.3 * (c1 * c1 + u1 * u1)) / (2 * G); };
        // loads
        const Kr = Math.max(0.05, 0.36 * Math.abs(1 - x * x)), Fr = Kr * fl.rho * G * Ho * D2 * 0.02;
        const Fa = (0.55 * fl.rho * G * Ho * (PI / 4) * (Math.pow(DWR / 1000, 2) - Math.pow(DHUB / 1000, 2))) * (p.bal ? 0.2 : 1);
        const a = 102, l = 46, RA = (Fr * (a + l)) / l, RBr = (Fr * a) / l, C = DIS.bearingDims(BRG).C * 1000;
        const e = 0.27, Pa = RA > 0 && Fa / RA > e ? 0.56 * RA + 1.6 * Fa : RA + 0;
        const Lh = (Pe) => (Math.pow(C / Math.max(Pe, 1), 3) * 1e6) / (60 * n);
        const Iz = (PI * Math.pow(29, 4)) / 64, defl = (Fr * a * a * (a + l)) / (3 * 210000 * Iz) * 1000;      // µm
        const w = (2 * PI * n) / 60, T = (Po * 1000) / w, tau = (16 * T * 1000) / (PI * Math.pow(24, 3)), sfS = (0.577 * 340) / tau;
        const motor = MOTORS.find((m) => m >= 1.15 * Po) || MOTORS[MOTORS.length - 1];
        return { D2, u2, Qb, Hb, nq, etaMax, fw, Hs: p.Hs, Ks, H, eta, Pk, npshr, Q, x, Ho, et, Po, note, Fr, Fa, RA, RBr, LhA: Lh(Pa), LhB: Lh(RBr), defl, T, tau, sfS, motor, fl, lf: lf(p.wc), Qleak: lf(p.wc) * Qb, Hth };
    }
    const m3h = (q) => q * 3600;

    /* ---------------- geometry helpers ---------------- */
    const Rsp = (t) => RB + ((RT - RB) * t) / (2 * PI);
    function spiralPts(off, t0, t1, n) { const a = []; for (let i = 0; i <= n; i++) { const t = t0 + ((t1 - t0) * i) / n, r = Rsp(t) + off; a.push(new THREE.Vector2(r * Math.cos(t), r * Math.sin(t))); } return a; }
    const polyArea = (pts) => { let s = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; s += a.x * b.y - b.x * a.y; } return Math.abs(s) / 2; };
    const studAt = (k) => { const t = ANG0 + k * ANGD, r = Rsp(t) + WALL / 2; return [r * Math.cos(t), r * Math.sin(t)]; };
    const hole = (x, y, r) => { const h = new THREE.Path(); h.absarc(x, y, r, 0, 2 * PI, true); return h; };
    const AO = polyArea(spiralPts(WALL, 0, 2 * PI, 96)), AH = polyArea(spiralPts(0, 0, 2 * PI - 0.12, 96));
    function outerShape(holes) { const s = new THREE.Shape(spiralPts(WALL, 0, 2 * PI, 96)); (holes || []).forEach((h) => s.holes.push(h)); return s; }
    function ext(shape, z0, z1, seg) { const g = new THREE.ExtrudeGeometry(shape, { depth: z1 - z0, bevelEnabled: false, curveSegments: seg || 24 }); g.translate(0, 0, z0); return g; }
    function studHoles(r) { const a = []; for (let k = 0; k < NB; k++) { const [x, y] = studAt(k); a.push(hole(x, y, r)); } return a; }
    /* flange disc: axis Z, with holes on a pitch circle */
    function flangeGeo(Ro, Ri, t, nh, pcd, hr, a0) {
        const s = new THREE.Shape(); s.absarc(0, 0, Ro, 0, 2 * PI, false); s.holes.push(hole(0, 0, Ri));
        for (let k = 0; k < nh; k++) { const a = (a0 || 0) + (k * 2 * PI) / nh; s.holes.push(hole((pcd / 2) * Math.cos(a), (pcd / 2) * Math.sin(a), hr)); }
        const g = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false, curveSegments: 28 }); g.translate(0, 0, -t / 2); return g;
    }
    function vaneGeo(r1, r2, beta, t, h) {
        const n = 16, c = [];
        for (let i = 0; i <= n; i++) { const r = r1 + ((r2 - r1) * i) / n, th = -Math.log(r / r1) / Math.tan(beta); c.push([r * Math.cos(th), r * Math.sin(th)]); }
        const L = [], R = [];
        for (let i = 0; i <= n; i++) {
            const a = c[Math.max(0, i - 1)], b = c[Math.min(n, i + 1)], tx = b[0] - a[0], ty = b[1] - a[1], m = Math.hypot(tx, ty), nx = -ty / m, ny = tx / m;
            L.push(new THREE.Vector2(c[i][0] + (nx * t) / 2, c[i][1] + (ny * t) / 2)); R.push(new THREE.Vector2(c[i][0] - (nx * t) / 2, c[i][1] - (ny * t) / 2));
        }
        const s = new THREE.Shape(L.concat(R.reverse()));
        return new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false });
    }
    const hexA = (af) => 0.866 * af * af;

    /* ---------------- part information ---------------- */
    DIS.addParts({
        pp_frame: P(L2('Bearing frame', 'هيكل المحامل'), L2('The cast housing that holds both bearings. It bolts to the seal cover, so the whole rotating assembly can be pulled out backwards without touching the pipes.', 'الهيكل المصبوب الذي يحمل المحملين. يُربَط بغطاء المانع فيمكن سحب الجزء الدوّار كاملاً إلى الخلف دون فكّ الأنابيب.'),
            L2('Cast iron GG25', 'حديد زهر GG25'), L2('Locates the shaft, takes the pump loads and carries the oil or grease.', 'يموضع العمود ويتحمل أحمال المضخة ويحتوي الزيت أو الشحم.'),
            L2('Sand casting → bore both bearing seats in one setup → face the flange', 'صب رملي ← تخريط مقعدَي المحملين بتثبيتة واحدة ← تشغيل وجه الفلنجة'), L2('Bearing bores H7 (Ø62), coaxiality ≤ 0.03 mm, flange face runout ≤ 0.05 mm', 'ثقبا المحمل H7 (Ø62)، التحاذي ≤ 0.03 mm، اهتزاز وجه الفلنجة ≤ 0.05 mm'), L2('ISO 5199 / API 610 frame', 'ISO 5199 / API 610'),
            L2('First part to be fixed on the base plate; shim the feet until the shaft is level.', 'أول قطعة تُثبَّت على القاعدة؛ تُضبَط بالشيمات حتى يصبح العمود أفقياً.'),
            L2('Misaligned bores overload the bearings → re-bore or replace; oil leaks → renew the end-cap lip seals.', 'عدم تحاذي الثقوب يُحمّل المحامل زائداً ← إعادة تخريط أو استبدال؛ تسرّب الزيت ← تبديل مانع الشفة بالغطاء.')),
        pp_shaft: P(L2('Pump shaft', 'عمود المضخة'), L2('A stepped shaft: Ø30 at the bearings, Ø28 under the seal and impeller hub, Ø20 thread for the impeller nut and Ø24 stub for the coupling.', 'عمود متدرّج: Ø30 عند المحملين، وØ28 تحت المانع ومحور الدفّاعة، وسن Ø20 لصامولة الدفّاعة، وطرف Ø24 للوصلة.'),
            L2('Stainless 1.4021 (AISI 420) or C45 with a sleeve', 'ستانلس 1.4021 (AISI 420) أو C45 مع كُمّ'), L2('Transmits torque from the motor to the impeller and carries the radial overhung load.', 'ينقل العزم من المحرك إلى الدفّاعة ويتحمل الحمل الشعاعي المعلّق.'),
            L2('Turned from bar → keyways milled → bearing and seal seats ground', 'خراطة من قضيب ← فرز المجاري ← جلخ مقاعد المحامل والمانع'), L2('Bearing seats k5, seal seat h6 Ra 0.4 µm, runout ≤ 0.03 mm', 'مقاعد المحامل k5، مقعد المانع h6 وRa 0.4 µm، الاهتزاز ≤ 0.03 mm'), L2('ISO 286, ISO 773, API 610 (deflection ≤ 50 µm)', 'ISO 286، ISO 773، API 610 (الانحناء ≤ 50 µm)'),
            L2('Slide it through the bearings from the pump side after the frame is mounted.', 'يُدخَل عبر المحملين من جهة المضخة بعد تثبيت الهيكل.'),
            L2('Bent or fretted shaft shakes the seal → measure runout with a dial gauge and replace above 0.05 mm.', 'عمود منحنٍ أو متآكل يهزّ المانع ← قِس الاهتزاز بمؤشر ساعة واستبدله إن زاد عن 0.05 mm.')),
        pp_brg: P(L2('Bearings (2×) 6206', 'المحملان (2×) 6206'), L2('Two deep-groove ball bearings. The one near the impeller is the "fixed" bearing that also takes axial thrust; the other floats.', 'محملان كرويان عميقا المجرى. القريب من الدفّاعة هو المحمل "الثابت" الذي يتحمل الدفع المحوري أيضاً، والآخر حرّ الحركة.'),
            L2('Bearing steel 100Cr6, brass cage', 'فولاذ محامل 100Cr6 وقفص نحاسي'), L2('Support the shaft with low friction.', 'يسندان العمود بأقل احتكاك.'),
            L2('Rings turned and ground, balls lapped, heat treated', 'الحلقات تُخرط وتُجلخ والكريات تُصقل وتُعالج حرارياً'), L2('Inner ring on shaft k5; outer ring in housing H7 (floating side M7)', 'الحلقة الداخلية على العمود k5؛ والخارجية في الهيكل H7 (جهة الحركة الحرة M7)'), L2('ISO 15 (6206), ISO 281 life', 'ISO 15 (6206)، ISO 281 للعمر'),
            L2('Press only on the ring that is being fitted; heat the inner ring to ≈ 80 °C for a clean fit.', 'اضغط على الحلقة المُركَّبة فقط؛ وسخّن الداخلية ≈ 80°م لتركيب سلس.'),
            L2('Spalling or noise → almost always misalignment, over-greasing or running at shut-off; replace both.', 'تقشّر أو ضجيج ← غالباً بسبب عدم التحاذي أو الإفراط بالشحم أو التشغيل بالصمام مغلقاً؛ بدّل الاثنين.')),
        pp_capP: P(L2('End cap — pump side', 'غطاء النهاية — جهة المضخة'), L2('Retains the fixed bearing and has a lip seal that keeps oil in and splash out.', 'يثبّت المحمل الثابت وفيه مانع شفة يحبس الزيت ويمنع الرذاذ.'),
            L2('Cast iron with NBR lip seal', 'حديد زهر مع مانع شفة NBR'), L2('Axial location of the bearing, sealing of the frame.', 'تثبيت المحمل محورياً وإغلاق الهيكل.'),
            L2('Turned from casting', 'خراطة من قطعة مصبوبة'), L2('Spigot h7, face flatness 0.02 mm', 'التمركز h7، استواء الوجه 0.02 mm'), L2('DIN 3760 lip seal', 'مانع شفة DIN 3760'),
            L2('Fit after the bearing; tighten the cap screws crosswise.', 'يُركَّب بعد المحمل؛ وتُشدّ براغيه بالتناوب.'),
            L2('Hard lip = oil leak: replace the lip seal whenever the shaft is out.', 'الشفة المتصلبة تسرّب الزيت: بدّل المانع كلما سُحب العمود.')),
        pp_capM: P(L2('End cap — motor side', 'غطاء النهاية — جهة المحرك'), L2('Closes the other end of the frame and keeps the floating bearing in line.', 'يغلق الطرف الآخر من الهيكل ويحافظ على محاذاة المحمل الحرّ.'),
            L2('Cast iron', 'حديد زهر'), L2('Protects the bearing from dirt.', 'يحمي المحمل من الأتربة.'), L2('Turned', 'خراطة'), L2('Spigot h7', 'التمركز h7'), L2('—', '—'),
            L2('Leave 0.5 mm axial play so the floating bearing can follow thermal growth.', 'اترك خلوصاً محورياً 0.5 mm ليتبع المحمل الحر التمدد الحراري.'),
            L2('Blocked breather → pressure pushes oil past the seal.', 'انسداد فتحة التنفس ← الضغط يدفع الزيت عبر المانع.')),
        pp_cover: P(L2('Seal cover (back plate)', 'غطاء المانع (اللوحة الخلفية)'), L2('The plate that closes the back of the volute. It has the stuffing-box housing for the mechanical seal and the flange for the bearing frame.', 'اللوحة التي تغلق ظهر الحلزون. فيها حجرة المانع الميكانيكي وفلنجة الاتصال بهيكل المحامل.'),
            L2('Cast iron GG25', 'حديد زهر GG25'), L2('Contains the pressure at the back and holds the seal.', 'يحتوي الضغط من الخلف ويحمل المانع.'),
            L2('Cast → face and bore on a lathe → drill and tap stud holes', 'صب ← تشغيل الوجه والثقب على المخرطة ← تثقيب فتحات الأعمدة'), L2('Seal bore H7 Ra 1.6; face runout ≤ 0.05 mm', 'ثقب المانع H7 وRa 1.6؛ اهتزاز الوجه ≤ 0.05 mm'), L2('ISO 21049 seal chamber', 'ISO 21049 (حجرة المانع)'),
            L2('Bolt it to the frame first, then slide the shaft assembly through.', 'يُربَط أولاً بالهيكل ثم يمرّ تجميع العمود عبره.'),
            L2('Scored seal bore → seal leaks even when new; re-sleeve or replace.', 'ثقب مانع مخدوش ← يتسرّب المانع حتى وهو جديد؛ أعد التكميم أو استبدل.')),
        pp_fbolt: P(L2('Frame bolts M10', 'براغي الهيكل M10'), L2('Four screws that join the bearing frame to the seal cover (they thread into the cover flange).', 'أربعة براغٍ تصل هيكل المحامل بغطاء المانع (تُسنّ في فلنجة الغطاء).'),
            L2('Steel 8.8', 'فولاذ 8.8'), L2('Hold the rotating assembly in line with the casing.', 'تبقي الجزء الدوّار على محور المبيت.'), L2('Cold-headed, rolled thread', 'تشكيل على البارد ودرفلة السن'), L2('6g thread', 'السن 6g'), L2('ISO 4014 / 898-1', 'ISO 4014 / 898-1'),
            L2('Tighten crosswise in two passes to the torque in the readouts.', 'شدّ متقاطعاً على مرحلتين حتى العزم المذكور في القراءات.'),
            L2('Loose bolts show as fretting rust at the flange: re-torque and renew.', 'البراغي المرتخية تظهر كصدأ احتكاكي عند الفلنجة: أعد الشد وبدّل.')),
        pp_seal: P(L2('Mechanical seal', 'المانع الميكانيكي'), L2('A hard ceramic ring fixed in the cover and a carbon ring that turns with the shaft. They press flat against each other and leave only a micro-film of water.', 'حلقة سيراميك صلبة ثابتة بالغطاء وحلقة كربون تدور مع العمود. تنضغطان بتماس مستوٍ ويبقى بينهما فيلم مائي مجهري.'),
            L2('Carbon vs. silicon carbide, EPDM elastomers, stainless spring', 'كربون مقابل كربيد السيليكون، مطاط EPDM، نابض ستانلس'), L2('Stops the pumped liquid from leaking along the shaft.', 'يمنع تسرّب السائل على طول العمود.'),
            L2('Faces lapped to 3 helium light bands (≈ 0.9 µm flatness)', 'تُصقل الوجوه حتى 3 حزم ضوء هيليوم (استواء ≈ 0.9 µm)'), L2('Face flatness ≤ 0.9 µm, shaft runout ≤ 0.05 mm, compression ±0.5 mm', 'استواء الوجه ≤ 0.9 µm، اهتزاز العمود ≤ 0.05 mm، الانضغاط ±0.5 mm'), L2('EN 12756 (DIN 24960)', 'EN 12756 (DIN 24960)'),
            L2('Never touch the faces with fingers; wet the shaft with water, not oil, before sliding the rotating part.', 'لا تلمس الوجوه بالأصابع؛ بلّل العمود بالماء لا بالزيت قبل إدخال الجزء الدوّار.'),
            L2('Dry running destroys it in seconds: vent the pump before starting.', 'التشغيل الجاف يدمّره خلال ثوانٍ: أخرج الهواء من المضخة قبل التشغيل.')),
        pp_key: P(L2('Impeller key 8×7×28', 'خابور الدفّاعة 8×7×28'), L2('Small steel bar that locks the impeller to the shaft.', 'قضيب فولاذي صغير يربط الدفّاعة بالعمود.'),
            L2('C45 steel', 'فولاذ C45'), L2('Carries the torque by shear.', 'ينقل العزم بالقص.'), L2('Cut from bright bar, ends rounded', 'قص من قضيب مصقول مع تدوير الأطراف'), L2('h9, keyway N9 / JS9', 'h9، المجرى N9 / JS9'), L2('ISO 773 / DIN 6885 A', 'ISO 773 / DIN 6885 A'),
            L2('Seat it before the impeller; it must not protrude above the keyway.', 'يُركَّب قبل الدفّاعة ولا يجوز أن يبرز عن المجرى.'),
            L2('A rounded keyway edge means the impeller was loose: replace the key and check the bore.', 'حافة مجرى مستديرة تعني أن الدفّاعة كانت مرتخية: بدّل الخابور وافحص الثقب.')),
        pp_imp: P(L2('Impeller (closed)', 'الدفّاعة (مغلقة)'), L2('The heart of the pump. The vanes curve backwards; the front and back shrouds guide the water from the eye to the rim.', 'قلب المضخة. الريش منحنية للخلف، والغلافان الأمامي والخلفي يوجّهان الماء من العين إلى الحافة.'),
            L2('Bronze CC480K, stainless 316 or cast iron', 'برونز CC480K أو ستانلس 316 أو حديد زهر'), L2('Converts shaft work into velocity, then the volute turns velocity into pressure.', 'يحوّل شغل العمود إلى سرعة ثم يحوّلها الحلزون إلى ضغط.'),
            L2('Investment or sand casting → bore and hub turned → dynamically balanced to G6.3', 'صب بالشمع المفقود أو الرمل ← خراطة الثقب والمحور ← موازنة ديناميكية G6.3'), L2('Bore H7 Ø28; tip runout ≤ 0.05 mm; wear-ring neck Ø102 h8', 'الثقب H7 Ø28؛ اهتزاز الحافة ≤ 0.05 mm؛ رقبة حلقة التآكل Ø102 h8'), L2('ISO 5199, ISO 1940 balance', 'ISO 5199، ISO 1940 للموازنة'),
            L2('Slide on the shaft with the key, then lock with the impeller nut.', 'تنزلق على العمود مع الخابور ثم تُقفل بصامولة الدفّاعة.'),
            L2('Pitted vane inlets = cavitation: raise suction head or reduce flow. Worn tips: trim or replace.', 'تنقّر مداخل الريش = تكهّف: ارفع ضغط الشفط أو قلّل التدفق. تآكل الأطراف: قصّ أو استبدل.')),
        pp_nut: P(L2('Impeller nut M20', 'صامولة الدفّاعة M20'), L2('Locks the impeller on the shaft end. The thread runs against the rotation, so the nut tightens itself.', 'تقفل الدفّاعة على طرف العمود. اتجاه السن عكس الدوران فتزداد الصامولة إحكاماً.'),
            L2('Stainless steel A4-70', 'ستانلس A4-70'), L2('Axial retention of the impeller.', 'تثبيت الدفّاعة محورياً.'), L2('Hex bar, tapped, passivated', 'سداسي من قضيب وتسنين ومعالجة تخميل'), L2('6H', '6H'), L2('DIN 934', 'DIN 934'),
            L2('Use a locking washer or thread-locker; torque as listed.', 'استعمل حلقة قفل أو مثبّت أسنان؛ وشدّ حسب العزم المذكور.'),
            L2('A loose nut lets the impeller rub the casing: stop immediately.', 'صامولة مرتخية تجعل الدفّاعة تحتك بالمبيت: أوقف المضخة فوراً.')),
        pp_gasket: P(L2('Casing gasket', 'جوان المبيت'), L2('A thin sheet gasket between the volute and the cover.', 'جوان رقيق بين الحلزون والغطاء.'),
            L2('Aramid fibre sheet 1 mm', 'ألواح ألياف أراميد 1 mm'), L2('Seals the pressurised water at the joint.', 'يمنع تسرّب الماء المضغوط عند الوصلة.'), L2('Die-cut from sheet', 'قص بالقالب من لوح'), L2('Thickness 1.0 ±0.1 mm', 'السماكة 1.0 ±0.1 mm'), L2('EN 1514 / EN 1514-1', 'EN 1514'),
            L2('Always use a new gasket after opening.', 'استعمل جواناً جديداً عند كل فتح.'), L2('Weeping at the joint → uneven stud torque or re-used gasket.', 'نضح عند الوصلة ← شد غير متساوٍ أو جوان مُعاد الاستعمال.')),
        pp_wring: P(L2('Wear ring', 'حلقة التآكل'), L2('A sacrificial ring in the casing that runs a fraction of a millimetre from the impeller neck. It limits leakage from the high-pressure side back to the suction.', 'حلقة تضحية في المبيت تدور على جزء من المليمتر من رقبة الدفّاعة وتحدّ من التسرب الراجع من الضغط العالي إلى الشفط.'),
            L2('Bronze or stainless, softer than the impeller', 'برونز أو ستانلس، أنعم من الدفّاعة'), L2('Keeps volumetric efficiency high; replaced instead of the casing.', 'تُبقي الكفاءة الحجمية عالية وتُستبدل بدل المبيت.'),
            L2('Turned, pressed in with an interference fit and pinned', 'خراطة وكبس بتداخل وتثبيت بمسمار'), L2('Radial running clearance 0.25–0.40 mm; replace at 2× new', 'خلوص التشغيل الشعاعي 0.25–0.40 mm؛ تُستبدل عند ضعف الجديد'), L2('API 610 clearances', 'خلوصات API 610'),
            L2('Press into the casing before the impeller goes in.', 'تُكبس في المبيت قبل إدخال الدفّاعة.'),
            L2('Clearance doubled → efficiency drops several %. Try the "wear ring clearance" slider.', 'تضاعف الخلوص ← تنخفض الكفاءة عدة %. جرّب شريط "خلوص حلقة التآكل".')),
        pp_casing: P(L2('Volute casing', 'مبيت الحلزون'), L2('The spiral body that collects the water leaving the impeller and slows it down so velocity turns into pressure. It has the axial suction nozzle and the tangential discharge nozzle.', 'الجسم الحلزوني الذي يجمع الماء الخارج من الدفّاعة ويبطّئه فتتحول السرعة إلى ضغط. يضم فوهة الشفط المحورية وفوهة الدفع المماسية.'),
            L2('Cast iron GG25 (stainless for corrosive duty)', 'حديد زهر GG25 (ستانلس للخدمات الأكالة)'), L2('Contains the pressure and connects to the pipes.', 'يحتوي الضغط ويتصل بالأنابيب.'),
            L2('Sand casting with cores → hydro-tested at 1.5× design pressure → flanges faced', 'صب رملي بقلوب ← اختبار هيدروليكي 1.5× ضغط التصميم ← تشغيل الفلنجات'), L2('Flange faces flat 0.1 mm, bolt PCD ±0.2 mm; wear-ring bore H7', 'استواء الفلنجة 0.1 mm، PCD البراغي ±0.2 mm؛ ثقب حلقة التآكل H7'), L2('EN 733 / ISO 2858, flanges EN 1092-2 PN16', 'EN 733 / ISO 2858، فلنجات EN 1092-2 PN16'),
            L2('Stays bolted to the pipework; only the back-pull-out unit is removed for service.', 'يبقى مربوطاً بالأنابيب؛ ويُسحب للصيانة الجزء الخلفي فقط.'),
            L2('Erosion at the tongue (cut-water) from sand or cavitation: weld-repair or replace.', 'تآكل عند اللسان من الرمل أو التكهّف: لحام إصلاح أو استبدال.')),
        pp_stud: P(L2('Studs and nuts M10 (8×)', 'الأعمدة المسننة والصواميل M10 (8×)'), L2('Eight threaded studs with nuts that clamp the cover and gasket to the casing.', 'ثمانية أعمدة مسننة وصواميل تشد الغطاء والجوان إلى المبيت.'),
            L2('Steel class 8.8 / nut class 8', 'فولاذ 8.8 / صامولة فئة 8'), L2('Clamp force against the internal pressure.', 'قوة الشد في مواجهة الضغط الداخلي.'), L2('Rolled thread, zinc plated', 'درفلة السن وجلفنة'), L2('6g / 6H', '6g / 6H'), L2('DIN 939 / ISO 4032', 'DIN 939 / ISO 4032'),
            L2('Tighten in a star pattern, 50 % then 100 % of the torque.', 'شدّ بنمط نجمي: 50% ثم 100% من العزم.'),
            L2('Corroded studs stick and break: soak in penetrating oil first, replace as a set.', 'الأعمدة الصدئة تلتصق وتنكسر: انقعها بزيت نفّاذ أولاً وبدّلها كمجموعة.'))
    });

    /* ---------------- the model ---------------- */
    DIS.add('pump', L2('Centrifugal pump', 'مضخة طرد مركزي'), {
        controls: () => [
            { type: 'title', label: L2('Impeller', 'الدفّاعة') },
            { id: 'D2', type: 'range', label: L2('Impeller diameter (trim)', 'قطر الدفّاعة (قصّ)'), min: 160, max: 220, step: 5, value: 200, unit: 'mm', rebuild: true },
            { id: 'z', type: 'range', label: L2('Number of vanes', 'عدد الريش'), min: 4, max: 8, step: 1, value: 6, rebuild: true },
            { id: 'beta', type: 'range', label: L2('Vane exit angle β₂', 'زاوية خروج الريشة β₂'), min: 15, max: 35, step: 1, value: 25, unit: '°', rebuild: true },
            { id: 'impMat', type: 'select', label: L2('Impeller material', 'مادة الدفّاعة'), options: Object.keys(IM).map((v) => ({ v, label: IM[v].name })), value: 'bronze', rebuild: true },
            { id: 'bal', type: 'toggle', label: L2('Balance holes in back shroud', 'ثقوب موازنة في الغلاف الخلفي'), value: true, rebuild: true },
            { id: 'wc', type: 'range', label: L2('Wear-ring clearance', 'خلوص حلقة التآكل'), min: 0.2, max: 2, step: 0.1, value: 0.3, unit: 'mm' },
            { type: 'title', label: L2('Duty', 'نقطة التشغيل') },
            { id: 'rpm', type: 'range', label: L2('Speed', 'السرعة'), min: 1450, max: 3600, step: 50, value: 2900, unit: 'rpm' },
            { id: 'fluid', type: 'select', label: L2('Fluid', 'السائل'), options: Object.keys(FL).map((v) => ({ v, label: FL[v].name })), value: 'water' },
            { id: 'Hs', type: 'range', label: L2('Static head of the system', 'الارتفاع الساكن للمنظومة'), min: 0, max: 50, step: 1, value: 20, unit: 'm' },
            { id: 'valve', type: 'range', label: L2('Discharge valve opening', 'فتح صمام الدفع'), min: 10, max: 100, step: 1, value: 100, unit: '%' },
            { id: 'npsha', type: 'range', label: L2('NPSH available at the suction', 'NPSH المتاح عند الشفط'), min: 1, max: 12, step: 0.5, value: 7, unit: 'm' },
            ...DIS.common(15)
        ],
        build(p, api) {
            const R2 = p.D2 / 2, im = IM[p.impMat], steel = mat(COL.steel), cast = mat(COL.cast, { roughness: 0.6 }), bronze = mat(COL.bronze), dark = mat(COL.dark, { metalness: 0.4 });
            const impM = mat(im.col, { metalness: 0.55, roughness: 0.35 }), keyM = mat(COL.key, { metalness: 0.4 });
            const meshOf = (g, m) => new THREE.Mesh(g, m);
            /* shapes */
            const ringGeo = ext(outerShape([new THREE.Path(spiralPts(0, 0, 2 * PI - 0.12, 96)), ...studHoles(5.6)]), ZR0, ZR1, 24);
            const frontGeo = ext(outerShape([hole(0, 0, 59)]), ZR1, ZF1, 24);
            const coverGeo = ext(outerShape([hole(0, 0, 30), ...studHoles(5.6)]), ZC0, ZC1, 24);
            const gasketGeo = ext(outerShape([new THREE.Path(spiralPts(0, 0, 2 * PI - 0.12, 96)), ...studHoles(5.6)]), ZC1, ZR0, 24);
            const fbA = [45, 135, 225, 315].map((d) => (d * PI) / 180), FR = 63;
            /* ---- frame ---- */
            const frame = (s) => {
                s.add(at(tubeZ(52, 31, 94, cast, 48), 0, 0, -103));
                const fl = meshOf(flangeGeo(70, 31, 8, 4, 2 * FR, 5.6, PI / 4), cast); fl.position.z = -52; s.add(fl);
            };
            const shaft = (s) => {
                s.add(at(cylZ(12, 36, 28, steel), 0, 0, -172)); s.add(at(cylZ(15, 94, 36, steel), 0, 0, -107));
                s.add(at(cylZ(14, 56, 36, steel), 0, 0, -32)); s.add(at(new THREE.Mesh(DIS.keyedShaftGeo(14, 28, 8, 4, 36), steel), 0, 0, 10)); s.add(at(cylZ(10, 20, 24, steel), 0, 0, 34));
            };
            const bearings = (s, g) => {
                [-92, -138].forEach((z) => {
                    const d = DIS.bearingDims(BRG), m = DIS.bearingMeshes(d, 'none');
                    m.outer.position.z = z; g.add(m.outer);
                    [m.inner, m.balls, m.cageA, m.cageB].forEach((o) => { o.position.z = z; s.add(o); });
                });
            };
            const capP = (s) => s.add(at(tubeZ(30.8, 17, 8, cast, 40), 0, 0, -80));
            const capM = (s) => { s.add(at(tubeZ(52, 17, 4, cast, 40), 0, 0, -152)); s.add(at(tubeZ(30.8, 17, 4, cast, 40), 0, 0, -148)); };
            const cover = (s) => {
                s.add(meshOf(coverGeo, cast)); s.add(at(tubeZ(38, 22, 36, cast, 40), 0, 0, -30));
                const fl = meshOf(flangeGeo(70, 22, 8, 4, 2 * FR, 5.6, PI / 4), cast); fl.position.z = -44; s.add(fl);
            };
            const fbolt = (s) => fbA.forEach((a) => {
                const gp = new THREE.Group();
                gp.add(at(hexZ(17, 6.4, dark), 0, 0, -59.2)); gp.add(at(cylZ(5, 18, 14, dark), 0, 0, -51));
                gp.position.set(FR * Math.cos(a), FR * Math.sin(a), 0); s.add(gp);
            });
            const seal = (s, g) => {
                g.add(at(tubeZ(21.8, 16, 6, mat(0xe9e4d6, { metalness: 0.1, roughness: 0.4 }), 40), 0, 0, -40));       // ceramic seat (stationary)
                s.add(at(tubeZ(20, 14.1, 12, mat(0x2b2f36, { metalness: 0.2, roughness: 0.6 }), 40), 0, 0, -31));      // carbon face
                s.add(at(tubeZ(19, 14.1, 8, mat(0xaab4c0, { metalness: 0.7, roughness: 0.3 }), 40), 0, 0, -22));       // metal bellows / drive
            };
            const key = (s) => s.add(at(boxM(8, 7, 28, keyM), 0, 13.5, 10));
            const imp = (s) => {
                s.add(at(new THREE.Mesh(DIS.keyedRingGeo(20, 14, 34, 8, 3.3, 40), impM), 0, 0, 7));
                const bs = new THREE.Shape(); bs.absarc(0, 0, R2, 0, 2 * PI, false); bs.holes.push(hole(0, 0, 20));
                if (p.bal) for (let k = 0; k < 4; k++) { const a = (k * PI) / 2 + PI / 4; bs.holes.push(hole(32 * Math.cos(a), 32 * Math.sin(a), 4.5)); }
                s.add(meshOf(ext(bs, 0, 4, 40), impM));
                s.add(at(tubeZ(R2 - 1, 48, 4, impM, 56), 0, 0, 18)); s.add(at(tubeZ(51, 48, 14, impM, 40), 0, 0, 27));
                const vg = vaneGeo(50, R2 - 1.5, (p.beta * PI) / 180, TV, 12);
                for (let k = 0; k < p.z; k++) { const v = meshOf(vg, impM); v.rotation.z = (k * 2 * PI) / p.z; v.position.z = 4; s.add(v); }
            };
            const nut = (s) => { const R = 30 / Math.sqrt(3), hx = new THREE.Shape(); for (let i = 0; i < 6; i++) { const x = R * Math.cos((i * PI) / 3), y = R * Math.sin((i * PI) / 3); if (i === 0) hx.moveTo(x, y); else hx.lineTo(x, y); } hx.closePath(); hx.holes.push(hole(0, 0, 10)); const m = meshOf(new THREE.ExtrudeGeometry(hx, { depth: 16, bevelEnabled: false, curveSegments: 16 }), mat(0xb9c2cc, { metalness: 0.6 })); m.position.z = 24; s.add(m); };
            const gasket = (s) => s.add(meshOf(gasketGeo, mat(0x1f2937, { metalness: 0.05, roughness: 0.9 })));
            const wring = (s) => s.add(at(tubeZ(59, 51.4, 8, bronze, 56), 0, 0, 26));
            const casing = (s) => {
                s.add(meshOf(ringGeo, cast)); s.add(meshOf(frontGeo, cast));
                s.add(at(tubeZ(64, 52, 100, cast, 56), 0, 0, 80));
                const sf = meshOf(flangeGeo(100, 52, 10, 8, 156, 6.5, PI / 8), cast); sf.position.z = 127; s.add(sf);
                const dn = tubeZ(40, 32, 100, cast, 40); dn.rotation.x = -PI / 2; dn.position.set(148, 50, 9); s.add(dn);
                const df = meshOf(flangeGeo(80, 32, 10, 4, 125, 6, PI / 4), cast); df.rotation.x = -PI / 2; df.position.set(148, 105, 9); s.add(df);
            };
            const stud = (s) => {
                for (let k = 0; k < NB; k++) {
                    const [x, y] = studAt(k), gp = new THREE.Group();
                    gp.add(at(cylZ(5, 38, 14, dark), 0, 0, -3)); gp.add(at(hexZ(17, 8.4, dark), 0, 0, -16.2));
                    gp.position.set(x, y, 0); s.add(gp);
                }
            };
            const hexNut = (af, h, d) => (hexA(af) - (PI * d * d) / 4) * h;
            const vCasing = (AO - AH) * (ZR1 - ZR0) + AO * (ZF1 - ZR1) - PI * 59 * 59 * (ZF1 - ZR1) + volTube(64, 52, 100) + volTube(100, 52, 10) * 0.9 + volTube(40, 32, 100) + volTube(80, 32, 10) * 0.85;
            const vImp = volTube(20, 14, 34) + PI * (R2 * R2 - 400) * 4 + PI * ((R2 - 1) * (R2 - 1) - 48 * 48) * 4 + volTube(51, 48, 14) + p.z * TV * 12 * ((R2 - 51.5) / Math.sin((p.beta * PI) / 180)) - (p.bal ? 4 * PI * 4.5 * 4.5 * 4 : 0);
            const bearVol = (() => { const d = DIS.bearingDims(BRG), m = DIS.bearingMeshes(d, 'none'); return m.V.outer + m.V.inner + m.V.ball * d.Z + m.V.cageA + m.V.cageB; })();
            const defs = [
                { id: 'pp_frame', build: frame, off: [0, 0, 0], order: 1, vol: volTube(52, 31, 94) + volTube(70, 31, 8) * 0.95, den: DEN.cast },
                { id: 'pp_shaft', build: shaft, off: [0, 0, -210], segs: [{ v: [0, 0, -210], w: [0.5, 1] }], order: 2, vol: volCyl(12, 36) + volCyl(15, 94) + volCyl(14, 84) + volCyl(10, 20) },
                { id: 'pp_brg', build: bearings, off: [0, 0, -105], segs: [{ v: [0, 0, -105], w: [0.5, 1] }], order: 3, qty: 2, vol: bearVol, den: DEN.steel },
                { id: 'pp_capP', build: capP, off: [0, 0, 50], order: 4, vol: volTube(30.8, 17, 8), den: DEN.cast },
                { id: 'pp_capM', build: capM, off: [0, 0, -175], segs: [{ v: [0, 0, -175], w: [0.5, 1] }], order: 5, vol: volTube(52, 17, 4) + volTube(30.8, 17, 4), den: DEN.cast, label: false },
                { id: 'pp_cover', build: cover, off: [0, 0, 110], segs: [{ v: [0, 0, 110], w: [0.4, 0.5] }], order: 6, vol: AO * 7 - PI * 900 * 7 + volTube(38, 22, 36) + volTube(70, 22, 8) * 0.9, den: DEN.cast },
                { id: 'pp_fbolt', build: fbolt, off: [0, 0, -105], order: 7, qty: 4, vol: volCyl(5, 18) + hexA(17) * 6.4, label: false },
                { id: 'pp_seal', build: seal, off: [0, 0, 80], segs: [{ v: [0, 0, 80], w: [0.6, 0.75] }], order: 8, vol: volTube(21.8, 16, 6) + volTube(20, 14.1, 12) * 1.3 + volTube(19, 14.1, 8), den: 5.5e-6 },
                { id: 'pp_key', build: key, segs: [], stepOff: [0, 160, 0], off: [0, 160, 0], order: 9, vol: 8 * 7 * 28 },
                { id: 'pp_imp', build: imp, off: [0, 0, 125], segs: [{ v: [0, 0, 125], w: [0.1, 0.4] }], order: 10, vol: vImp, den: im.den },
                { id: 'pp_nut', build: nut, off: [0, 0, 205], segs: [{ v: [0, 0, 205], w: [0, 0.2] }], order: 11, vol: hexNut(30, 16, 20), den: DEN.steel, label: true },
                { id: 'pp_gasket', build: gasket, off: [0, 0, 225], order: 12, vol: (AO - AH) * 1 - 8 * PI * 31.4, den: 1.4e-6, label: false },
                { id: 'pp_wring', build: wring, off: [0, 0, 340], order: 13, vol: volTube(59, 51.4, 8), den: DEN.bronze, label: false },
                { id: 'pp_casing', build: casing, off: [0, 0, 340], order: 14, vol: vCasing, den: DEN.cast },
                { id: 'pp_stud', build: stud, off: [0, 0, -100], order: 15, qty: NB, vol: volCyl(5, 38) + hexNut(17, 8.4, 10), label: false }
            ];
            let th = 0;
            const ROT = ['pp_shaft', 'pp_key', 'pp_imp', 'pp_nut'];
            const { root, world, parts } = DIS.assemble(p, api, defs, {
                update(dt, time, ps) { th += K.rpmToVis(p.rpm) * dt; ps.forEach((q) => { if (ROT.includes(q.id)) q.spin.rotation.z = th; else if (q.id === 'pp_brg' || q.id === 'pp_seal') q.spin.rotation.z = th; });
                    const e = Math.max(0, Math.min(1, (+p.ex || 0) / 100)), f = (p.step | 0) > 0 ? 0 : Math.max(0, Math.min(1, (e - 0.5) / 0.1)), kq = ps.find((q) => q.id === 'pp_key'); if (kq && kq.spin.children[0]) kq.spin.children[0].position.y = 13.5 + 160 * f; }
            });
            world.rotation.x = -PI / 2;   // axis vertical: suction nozzle up
            DIS.fit(root, 0, 70, 0, 235, 440, [0.6, 0.25, 1]);
            root.userData.target = [0, 4, 0];
            return root;
        },
        readouts(p) {
            const c = hyd(p), st = DIS.sfState, hr = (v) => (v >= 1e6 ? '> 1 M' : fmt(v, 0)), Qh = m3h(c.Q);
            const Hh = (v) => (v < 8000 ? 'bad' : v < 20000 ? 'warn' : 'ok');
            const nr = c.npshr(c.Q), mg = nr > 0 ? p.npsha / nr : 9;
            const fl = DIS.lang();
            const rows = [];
            if (c.note === 'deadhead') rows.push({ k: L2('Operating point', 'نقطة التشغيل'), v: L2('No flow — static head is above the pump shut-off head', 'لا تدفق — الارتفاع الساكن أعلى من ارتفاع الإغلاق للمضخة')[fl], state: 'bad' });
            else rows.push({ k: L2('Duty point (pump curve = system curve)', 'نقطة العمل (منحنى المضخة = منحنى المنظومة)'), v: fmt(Qh) + ' m³/h @ ' + fmt(c.Ho) + ' m' + (c.note === 'runout' ? ' · run-out' : ''), state: c.note === 'runout' ? 'warn' : undefined });
            rows.push(
                { k: L2('Best-efficiency point (BEP)', 'نقطة أعلى كفاءة (BEP)'), v: fmt(m3h(c.Qb)) + ' m³/h @ ' + fmt(c.Hb) + ' m · η ' + fmt(c.etaMax * 100, 0) + ' %' },
                { k: L2('Operating flow vs. BEP', 'التدفق الفعلي إلى BEP'), v: fmt(c.x * 100, 0) + ' %' + (c.x < 0.7 ? ' ↓' : c.x > 1.2 ? ' ↑' : ''), state: c.x < 0.5 || c.x > 1.4 ? 'bad' : c.x < 0.7 || c.x > 1.2 ? 'warn' : 'ok' },
                { k: L2('Efficiency η', 'الكفاءة η'), v: fmt(c.et * 100, 0) + ' %', state: c.et < 0.5 ? 'warn' : 'ok' },
                { k: L2('Shaft power → motor', 'قدرة العمود ← المحرك'), v: fmt(c.Po) + ' kW → ' + c.motor + ' kW' },
                { k: L2('Specific speed nq', 'السرعة النوعية nq'), v: fmt(c.nq, 0) },
                { k: L2('Impeller tip speed u₂', 'سرعة حافة الدفّاعة u₂'), v: fmt(c.u2) + ' m/s', state: c.u2 > 50 ? 'warn' : 'ok' },
                { k: L2('NPSHr / NPSHa (margin)', 'NPSHr / NPSHa (الهامش)'), v: fmt(nr) + ' / ' + fmt(p.npsha) + ' m · ×' + fmt(mg), state: mg < 1 ? 'bad' : mg < 1.3 ? 'warn' : 'ok' },
                { k: L2('Radial force on impeller', 'القوة الشعاعية على الدفّاعة'), v: fmt(c.Fr, 0) + ' N' },
                { k: L2('Axial thrust (' + (p.bal ? 'balanced' : 'unbalanced') + ')', 'الدفع المحوري (' + (p.bal ? 'موازَن' : 'غير موازَن') + ')'), v: fmt(c.Fa, 0) + ' N' },
                { k: L2('Shaft deflection at impeller (≤ 50 µm)', 'انحناء العمود عند الدفّاعة (≤ 50 µm)'), v: fmt(c.defl, 0) + ' µm', state: c.defl > 50 ? 'bad' : c.defl > 35 ? 'warn' : 'ok' },
                { k: L2('Bearing A (fixed) 6206 · L10h', 'المحمل A (الثابت) 6206 · L10h'), v: hr(c.LhA) + ' h', state: Hh(c.LhA) },
                { k: L2('Bearing B (floating) 6206 · L10h', 'المحمل B (الحر) 6206 · L10h'), v: hr(c.LhB) + ' h', state: Hh(c.LhB) },
                { k: L2('Shaft stub torsion Ø24 (T = ' + fmt(c.T) + ' N·m)', 'التواء طرف العمود Ø24 (T = ' + fmt(c.T) + ' N·m)'), v: fmt(c.tau) + ' MPa · SF ' + fmt(c.sfS), state: st(c.sfS) },
                { k: L2('Wear-ring leakage (clearance ' + fmt(p.wc) + ' mm)', 'تسرب حلقة التآكل (الخلوص ' + fmt(p.wc) + ' mm)'), v: fmt(m3h(c.Qleak)) + ' m³/h · η ×' + fmt(c.fw, 2), state: c.fw < 0.9 ? 'warn' : 'ok' },
                { k: L2('Cavitation erosion resistance of ' + IM[p.impMat].name.en, 'مقاومة التكهّف لـ ' + IM[p.impMat].name.ar), v: '★'.repeat(IM[p.impMat].cav) + '☆'.repeat(5 - IM[p.impMat].cav) },
                { k: L2('Torque — casing studs M10-8.8', 'عزم الشد — أعمدة المبيت M10-8.8'), v: fmt(DIS.tighten(10, '8.8'), 0) + ' N·m (star pattern)' },
                { k: L2('Torque — frame bolts M10-8.8 / impeller nut M20-A4', 'عزم الشد — براغي الهيكل M10-8.8 / صامولة الدفّاعة M20'), v: fmt(DIS.tighten(10, '8.8'), 0) + ' N·m / ' + (DIS.ar() ? 'الصامولة: حسب كتيّب المضخة' : 'nut: per the pump manual') },
                DIS.fitRow(L2('Impeller bore on shaft', 'ثقب الدفّاعة على العمود'), 28, 'k', 6),
                { k: L2('Mass (calc.)', 'الكتلة (تقديرية)'), v: DIS.fmtMass(DIS.cur.rows.reduce((a, q) => a + q.mass, 0)) }
            );
            return rows;
        },
        challenges: () => [
            CH('Deliver at least 100 m³/h at 80 m head or more, with efficiency ≥ 70 %.', 'وفّر 100 m³/h على الأقل عند ارتفاع 80 m أو أكثر وبكفاءة ≥ 70%.', (p) => { const c = hyd(p); return m3h(c.Q) >= 100 && c.Ho >= 80 && c.et >= 0.7; }),
            CH('Deliver ≥ 100 m³/h inside the best-efficiency zone (90–110 % of BEP) with NPSH margin ≥ 1.3.', 'وفّر ≥ 100 m³/h داخل منطقة أعلى كفاءة (90–110% من BEP) مع هامش NPSH ≥ 1.3.', (p) => { const c = hyd(p); return m3h(c.Q) >= 100 && c.x >= 0.9 && c.x <= 1.1 && p.npsha / c.npshr(c.Q) >= 1.3; }),
            CH('Close the valve to ≤ 25 % and still keep bearing life ≥ 20 000 h (hint: balance holes and speed).', 'أغلق الصمام إلى ≤ 25% وحافظ على عمر المحمل ≥ 20 000 ساعة (تلميح: ثقوب الموازنة والسرعة).', (p) => { const c = hyd(p); return p.valve <= 25 && c.Q > 0 && Math.min(c.LhA, c.LhB) >= 20000; }),
            CH('Worn wear ring (clearance ≥ 1.0 mm): still reach η ≥ 55 % at a duty of 40 m³/h or more.', 'حلقة تآكل مهترئة (خلوص ≥ 1.0 mm): ومع ذلك حقّق η ≥ 55% عند تدفق 40 m³/h فأكثر.', (p) => { const c = hyd(p); return p.wc >= 1 && m3h(c.Q) >= 40 && c.et >= 0.55; })
        ],
        panels(p) {
            const c = hyd(p), Qm = 1.8 * c.Qb, n = 36, pts = (fn, sc) => { const a = []; for (let i = 0; i <= n; i++) { const Q = (Qm * i) / n; a.push([m3h(Q), fn(Q) * (sc || 1)]); } return a; };
            const xl = L2('Flow Q (m³/h)', 'التدفق Q (m³/h)'), xm = m3h(Qm), mk = (y, lab) => (c.note === 'deadhead' ? [] : [{ x: m3h(c.Q), y, label: lab }]);
            const nr = (Q) => c.npshr(Q);
            return [
                { type: 'line', h: 190, title: L2('Head curve and system curve', 'منحنى الارتفاع ومنحنى المنظومة'), unit: 'm', xlabel: xl, xmin: 0, xmax: xm, series: [{ label: L2('Pump H(Q)', 'المضخة H(Q)'), pts: pts((Q) => c.H(Q)) }, { label: L2('System', 'المنظومة'), pts: pts((Q) => Math.min(150, c.Hs + c.Ks * Q * Q)) }], marks: mk(c.Ho, L2('Duty', 'العمل')[DIS.lang()]) },
                { type: 'line', h: 170, title: L2('Efficiency', 'الكفاءة'), unit: '%', xlabel: xl, xmin: 0, xmax: xm, ymin: 0, series: [{ label: 'η', pts: pts((Q) => c.eta(Q), 100) }], marks: mk(c.et * 100, fmt(c.et * 100, 0) + ' %') },
                { type: 'line', h: 170, title: L2('Shaft power', 'قدرة العمود'), unit: 'kW', xlabel: xl, xmin: 0, xmax: xm, ymin: 0, series: [{ label: 'P', pts: pts((Q) => c.Pk(Q)), color: '#d97706' }], marks: mk(c.Po, fmt(c.Po) + ' kW') },
                { type: 'line', h: 170, title: L2('NPSH required vs. available', 'NPSH المطلوب مقابل المتاح'), unit: 'm', xlabel: xl, xmin: 0, xmax: xm, ymin: 0, series: [{ label: 'NPSHr', pts: pts((Q) => nr(Q)), color: '#dc2626' }, { label: 'NPSHa', pts: [[0, p.npsha], [xm, p.npsha]], color: '#16a34a' }], marks: mk(nr(c.Q), 'NPSHr') }
            ];
        }
    });
    DIS.pumpCalc = hyd;
})();
