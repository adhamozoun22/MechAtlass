/* Disassembly lab — single-cylinder 4-stroke petrol engine (DOHC, 2 valves) with live piston–crank–valve animation.
 * Slider-crank kinematics, cylinder-pressure cycle, gas / inertia forces, torque, bearing pressures, rod-bolt margin,
 * valve-float limit and flywheel speed fluctuation. All dimensions in mm, crank axis = Z, cylinder axis = +Y. */
(function () {
    'use strict';
    const DIS = window.DIS;
    if (!DIS) return;
    const { L2, mat, COL, DEN, cylZ, tubeZ, tubeGeo, boxM, hexZ, at, volTube, volCyl, CH, fmt, K, P } = DIS;
    const PI = Math.PI, D2R = PI / 180;

    const SPR = { std: { F0: 130, k: 24, name: L2('Standard valve springs', 'نوابض صمامات عادية') }, heavy: { F0: 190, k: 38, name: L2('Heavy (racing) springs', 'نوابض ثقيلة (سباق)') } };
    const LIFT = 8, PSI_D = PI / 3, BASE = 12;            // cam lift, half-duration (cam angle), base circle radius
    const PK_I = 460, PK_E = 260;                          // crank angle of peak lift (° after firing TDC): IVO 340°, IVC 580°, EVO 140°, EVC 380°
    const lobe = (psi) => (Math.abs(psi) < PSI_D ? 0.5 * (1 + Math.cos((PI * psi) / PSI_D)) : 0);
    const wrap = (x) => { x = ((x + PI) % (2 * PI)); if (x < 0) x += 2 * PI; return x - PI; };
    const liftAt = (phiRad, pk) => LIFT * lobe(wrap((phiRad - pk * D2R) / 2));

    /* ---------------- derived dimensions ---------------- */
    function geo(p) {
        const B = p.B, S = p.S, r = S / 2, l = p.rr * r, CHt = 0.42 * B, SK = 0.45 * B, dp = Math.round(0.28 * B);
        const yd = r + l + CHt, yb = l - r - SK - 1, yseat = yd + S / (p.CR - 1), Hh = 52, yht = yseat + Hh, Ls = 30;
        const yc = yht + 62.5, xi = -0.3 * B, xe = 0.3 * B, hx = B / 2 + 22, hz = B / 2 + 14, Xc = r + 38, Zc = 56, Yb = -(r + 28);
        return { B, S, r, l, CHt, SK, dp, yd, yb, yseat, Hh, yht, Ls, yc, xi, xe, hx, hz, Xc, Zc, Yb, Ri: B * 0.17, Re: B * 0.155, bx: B / 2 + 13, bz: B / 2 + 4 };
    }
    /* volumes (mm³) → masses */
    function vols(p) {
        const g = geo(p), B = g.B, Rp = B / 2 - 0.4;
        const piston = PI * Rp * Rp * 11 - PI * (Rp * Rp - (B / 2 - 3.2) ** 2) * 4.8 + volTube(Rp, Rp - 3, g.SK + g.CHt - 11) + 2 * volTube(g.dp / 2 + 6, g.dp / 2, B / 2 - 12);
        const rings = volTube(B / 2, B / 2 - 3.2, 1.2) * 2 + volTube(B / 2, B / 2 - 3.2, 2.4);
        const pin = volTube(g.dp / 2, g.dp / 2 - 4, B - 12);
        const half = 0.5 * PI * (27 * 27 - 18.5 * 18.5) * 22, Lb = g.l - 26 - (g.dp / 2 + 6);
        const rod = half + Lb * 152 + volTube(g.dp / 2 + 6, g.dp / 2, 18);
        const cap = half + 2 * 13.5 * 20 * 22, shell = volTube(18.5, 17, 20);
        const rbolt = PI * 16 * 36 + 0.866 * 13 * 13 * 5.3;
        return { g, piston, rings, pin, rod, cap, shell, rbolt };
    }
    function masses(p) {
        const v = vols(p), a = DEN.alu, s = DEN.steel;
        return { piston: v.piston * a, rings: v.rings * 7.2e-6, pin: v.pin * s, rod: v.rod * s, cap: v.cap * s, shell: v.shell * 7.5e-6, rbolt: v.rbolt * s };
    }
    /* flywheel: disc t = 30 mm, bore r = 15, six lightening holes exactly as drawn (same radius and pitch circle as in the model) */
    const flyGeo = (p) => { const R = p.flyD / 2, rh = Math.max(8, (R - 15) * 0.22), d = (R + 15) * 0.5 + 4; return { R, rh, d }; };
    const flyMass = (p) => { const f = flyGeo(p); return (PI * (f.R * f.R - 15 * 15) * 30 - 6 * PI * f.rh * f.rh * 30) * DEN.steel; };
    const flyInertia = (p) => { const f = flyGeo(p); return DEN.steel * 30 * PI * (0.5 * (Math.pow(f.R, 4) - Math.pow(15, 4)) - 6 * f.rh * f.rh * (0.5 * f.rh * f.rh + f.d * f.d)) * 1e-6; };   // kg·m²

    /* ---------------- engine cycle model ---------------- */
    function calc(p) {
        const g = geo(p), B = p.B, S = p.S, r = g.r, l = g.l, lam = r / l, A = (PI / 4) * B * B, Vd = A * S, Vc = Vd / (p.CR - 1);
        const w = (2 * PI * p.rpm) / 60, Sp = (2 * S * p.rpm) / 60000;
        const Vof = (a) => { const f = a * D2R, x = r + l - (r * Math.cos(f) + Math.sqrt(l * l - Math.pow(r * Math.sin(f), 2))); return Vc + A * x; };
        const pin = 0.3 + (0.7 * p.load) / 100, pex = 1.05, gam = 1.3, arr = new Array(720).fill(pex);
        for (let a = 360; a < 580; a++) arr[a] = pin;
        const ptdc = pin * Math.pow(p.CR, gam), Qtot = (2.6 * ptdc * Vc) / (gam - 1);
        const xb = (th) => (th <= -20 ? 0 : 1 - Math.exp(-5 * Math.pow((th + 20) / 50, 3)));
        let pc = pin;
        const da = 0.5;
        for (let k = 0; k < 560; k++) {
            const a = 580 + k * da, V1 = Vof(a), V2 = Vof(a + da), th1 = a >= 720 ? a - 720 : a - 720 + 0, th2 = a + da >= 720 ? a + da - 720 : a + da - 720;
            const dQ = Qtot * (xb(th2) - xb(th1));
            pc += ((gam - 1) * dQ - gam * pc * (V2 - V1)) / ((V1 + V2) / 2);
            if (k % 2 === 0) arr[Math.round(a) % 720] = pc;
        }
        const pevo = arr[140];
        for (let a = 141; a < 180; a++) arr[a] = pex + (pevo - pex) * Math.exp(-(a - 140) / 8);
        // forces / torque
        const m = masses(p), mrec = m.piston + m.rings + m.pin + m.rod / 3;
        const Fg = [], Fi = [], F = [], T = [], N = [], Fr = [];
        let imepW = 0, Fmax = 0, Fmin = 0, Frmax = 0, Nmax = 0, Fgmax = 0, pmax = 0, apmax = 0;
        for (let a = 0; a < 720; a++) {
            const f = a * D2R, sp = lam * Math.sin(f), psi = Math.asin(sp), cp = Math.cos(psi);
            const fg = (arr[a] - 1) * A * 0.1, fi = -mrec * (r / 1000) * w * w * (Math.cos(f) + lam * Math.cos(2 * f)), ft = fg + fi;
            Fg.push(fg); Fi.push(fi); F.push(ft); Fr.push(ft / cp); N.push(ft * Math.tan(psi));
            T.push(((ft * Math.sin(f + psi)) / cp) * r / 1000);
            imepW += arr[a] * 1e5 * (Vof(a + 1) - Vof(a)) * 1e-9;
            Fmax = Math.max(Fmax, ft); Fmin = Math.min(Fmin, ft); Frmax = Math.max(Frmax, Math.abs(ft / cp)); Nmax = Math.max(Nmax, Math.abs(ft * Math.tan(psi))); Fgmax = Math.max(Fgmax, fg);
            if (arr[a] > pmax) { pmax = arr[a]; apmax = a; }
        }
        const imep = imepW / (Vd * 1e-9) / 1e5, fmep = 0.6 + 0.1 * Sp + 0.003 * Sp * Sp, bmep = Math.max(0, imep - fmep);
        const Pw = (bmep * 1e5 * Vd * 1e-9 * p.rpm) / 120 / 1000, Tb = Pw > 0 ? (Pw * 1000) / w : 0;
        const Tm = T.reduce((x, y) => x + y, 0) / 720;
        let e = 0, emin = 0, emax = 0;
        for (let a = 0; a < 720; a++) { e += (T[a] - Tm) * D2R; emin = Math.min(emin, e); emax = Math.max(emax, e); }
        const dE = emax - emin, If = flyInertia(p), Cs = dE / (If * w * w);
        // bearings
        const pBig = Frmax / (34 * 20), pPin = Math.max(Fmax, -Fmin) / (g.dp * 18);
        // rod bolts: inertia of everything above the split at TDC exhaust vs. clamp load
        const Fb = ((m.piston + m.rings + m.pin + 0.6 * m.rod) * (r / 1000) * w * w * (1 + lam) + m.cap * (r / 1000) * w * w) / 2;
        const preload = DIS.preload(8, p.rb), sepSF = preload / Math.max(Fb, 1);
        // valve float
        const vol = { valve: 3750 * DEN.steel, ret: 0.008, tap: 0.02, spring: 0.045 / 3 }, mv = vol.valve + vol.ret + vol.tap + vol.spring;
        const spr = SPR[p.spring], Fpk = spr.F0 + spr.k * LIFT, aN = 4.5 * (LIFT / 1000) * 1, wf = Math.sqrt(Fpk / (mv * aN)) * 2, rpmFloat = (wf * 60) / (2 * PI);
        // arrays for charts
        return { g, A, Vd, Vc, w, Sp, arr, Fg, Fi, F, Fr, N, T, Tm, imep, fmep, bmep, Pw, Tb, pmax, apmax, Fmax, Fmin, Frmax, Nmax, Fgmax, dE, If, Cs, pBig, pPin, Fb, preload, sepSF, mrec, m, mv, Fpk, rpmFloat, pin, spr };
    }

    /* ---------------- part information ---------------- */
    const info = {
        en_block: P(L2('Cylinder block + crankcase', 'كتلة الأسطوانة وصندوق المرافق'), L2('One aluminium casting with a cooled cylinder, a deck face for the head, and a crankcase whose end walls carry the main bearings. The side walls are drawn transparent so you can see the crank.', 'صبّة ألومنيوم واحدة فيها أسطوانة مبرّدة بزعانف، ووجه علوي للرأس، وصندوق مرافق تحمل جدرانه الطرفية المحامل الرئيسية. رُسمت الجدران الجانبية شفافة لترى عمود المرفق.'),
            L2('Aluminium alloy AlSi9Cu3 with a nickel-silicon (Nikasil) bore', 'سبيكة ألومنيوم AlSi9Cu3 مع جدار أسطوانة نيكاسيل'), L2('Guides the piston, contains the combustion pressure and carries the crankshaft.', 'يوجّه المكبس ويحتوي ضغط الاحتراق ويحمل عمود المرفق.'),
            L2('High-pressure die casting → deck and bore honed → main-bearing line bored in one setup', 'صب بالضغط العالي ← جلخ السطح العلوي وصقل الأسطوانة ← تخريط محور المحامل الرئيسية بتثبيتة واحدة'), L2('Bore H7, cylindricity ≤ 0.01 mm, Rz 2–4 µm cross-hatch; deck flatness 0.05 mm', 'قطر الأسطوانة H7، الاستدارة ≤ 0.01 mm، Rz 2–4 µm بخطوط متقاطعة؛ استواء السطح 0.05 mm'), L2('ISO 4287 (surface), ISO 1101 (GD&T)', 'ISO 4287 (السطح)، ISO 1101 (GD&T)'),
            L2('Start here: the crank drops into the upper half of the crankcase from below, the sump closes it, then the piston goes in from above.', 'ابدأ بها: يُوضع المرفق في النصف العلوي لعلبة المرفق من الأسفل ثم يُغلقه حوض الزيت ثم يدخل المكبس من الأعلى.'),
            L2('Worn or scuffed bore → blue smoke and low compression; rehone and fit oversize rings or re-sleeve.', 'أسطوانة مهترئة أو مخدوشة ← دخان أزرق وانضغاط ضعيف؛ أعد الصقل وركّب شنابر أكبر أو بطانة جديدة.')),
        en_sump: P(L2('Oil sump (lower crankcase)', 'حوض الزيت (النصف السفلي لعلبة المرفق)'), L2('The lower half of the crankcase. It closes the main-bearing seats from below, holds the oil and comes off first when the crank must be removed.', 'النصف السفلي لعلبة المرفق. يغلق مقاعد المحامل الرئيسية من الأسفل ويحمل الزيت ويُفكّ أولاً عند إخراج المرفق.'),
            L2('Cast aluminium or pressed steel', 'ألومنيوم مصبوب أو فولاذ مكبوس'), L2('Holds the oil and the lower halves of the main-bearing seats.', 'يحمل الزيت والنصفين السفليين لمقاعد المحامل الرئيسية.'),
            L2('Cast or pressed → split face machined', 'صب أو كبس ← تشغيل وجه الفصل'), L2('Split face flat so the oil stays in', 'وجه الفصل مستوٍ ليبقى الزيت داخلاً'), L2('Manufacturer drawings', 'مخططات الصانع'),
            L2('Fit it last on the crank side, with a new gasket and the tightening torque from the manual.', 'يُركَّب أخيراً من جهة المرفق مع جوان جديد وبعزم الشدّ الوارد في الدليل.'),
            L2('Oil seepage at the split face: check the flatness and replace the gasket.', 'تسرّب زيت عند وجه الفصل: افحص الاستواء وبدّل الجوان.')),
        en_crank: P(L2('Crankshaft', 'عمود المرفق'), L2('Turns the up-and-down motion of the piston into rotation. The two counterweights balance part of the piston inertia.', 'يحوّل حركة المكبس الترددية إلى دوران. ثقلا الموازنة يعادلان جزءاً من عطالة المكبس.'),
            L2('Forged 42CrMo4 steel, induction-hardened journals', 'فولاذ مطروق 42CrMo4 مع تقسية حثية للمحاور'), L2('Delivers torque and carries the big-end of the rod.', 'ينقل العزم ويحمل الطرف الكبير للذراع.'),
            L2('Closed-die forged → rough turned → pin and journals ground → balanced', 'طرق بقالب مغلق ← خراطة خشنة ← جلخ الرقبة والمحاور ← موازنة'), L2('Pin Ø34 h6, Ra 0.2 µm, ovality ≤ 0.005 mm; runout ≤ 0.03 mm', 'رقبة Ø34 h6، Ra 0.2 µm، البيضوية ≤ 0.005 mm؛ الاهتزاز ≤ 0.03 mm'), L2('ISO 1940 balance G6.3', 'ISO 1940 موازنة G6.3'),
            L2('Lay it in the upper half-bearings from below, then bolt on the flywheel.', 'يُوضع في أنصاف المحامل العلوية من الأسفل ثم يُركَّب الدولاب.'),
            L2('Scored pin = oil starvation: regrind to the next undersize and use matching shells.', 'رقبة مخدوشة = نقص تزييت: أعد الجلخ للمقاس الأصغر التالي واستعمل قشور مناسبة.')),
        en_fly: P(L2('Flywheel', 'الدولاب'), L2('A heavy disc that stores energy during the power stroke and gives it back during the other three, so a single cylinder runs smoothly.', 'قرص ثقيل يخزّن الطاقة في شوط القدرة ويعيدها في الأشواط الثلاثة الأخرى فيدور محرك الأسطوانة الواحدة بسلاسة.'),
            L2('Cast iron GG25 or steel', 'حديد زهر GG25 أو فولاذ'), L2('Smooths speed fluctuation; carries the starter ring gear.', 'يخفّف تذبذب السرعة ويحمل تاج المارش.'),
            L2('Cast → turned → balanced by drilling', 'صب ← خراطة ← موازنة بالتثقيب'), L2('Face runout ≤ 0.05 mm', 'اهتزاز الوجه ≤ 0.05 mm'), L2('ISO 1940', 'ISO 1940'),
            L2('Fit with the taper, key and a nut tightened to the specified torque.', 'يُركَّب على المخروط مع خابور وصامولة بالعزم المحدد.'),
            L2('Loose flywheel = knock at idle: check the key and nut at once.', 'دولاب مرتخٍ = طرق عند الدوران البطيء: افحص الخابور والصامولة فوراً.')),
        en_rod: P(L2('Connecting rod', 'ذراع التوصيل'), L2('An I-section forged rod. The small end holds the wrist pin; the big end is split so it can be clamped on the crank pin.', 'ذراع بمقطع I مطروق. الطرف الصغير يحمل مسمار المكبس، والطرف الكبير مقسوم ليُشدّ على رقبة المرفق.'),
            L2('Forged C70S6 (fracture-split) or 42CrMo4 steel', 'فولاذ مطروق C70S6 (كسر مقسوم) أو 42CrMo4'), L2('Transmits the gas force from the piston to the crank and turns back the inertia.', 'ينقل قوة الغاز من المكبس إلى المرفق ويعكس قوة العطالة.'),
            L2('Drop forged → shot-peened → big-end bore honed (with cap bolted) → weight-sorted', 'طرق بالمطرقة ← تنظيف بالكرات ← صقل ثقب الطرف الكبير (والغطاء مشدود) ← فرز بالوزن'), L2('Big-end bore H6 Ø37; centre distance ±0.03 mm; weight ±2 g', 'ثقب الطرف الكبير H6 Ø37؛ المسافة بين المركزين ±0.03 mm؛ الوزن ±2 g'), L2('ISO 6336 style strength checks, DIN 17200', 'فحوص مقاومة على نمط ISO 6336، DIN 17200'),
            L2('The cap and the rod are a matched pair — never mix caps between rods.', 'الغطاء والذراع زوج مطابق — لا تبدّل الأغطية بين الأذرع.'),
            L2('Bent rod or buckling at over-rev: scrap it, never straighten.', 'ذراع منحنٍ أو مثني عند السرعة الزائدة: يُتلف ولا يُعدَّل أبداً.')),
        en_shell: P(L2('Big-end bearing shells', 'قشور الطرف الكبير'), L2('Thin half-shells with a soft lining that sit between the rod and the crank pin. Oil pressure floats the pin on a film.', 'نصفا قشرة رقيقة ببطانة ناعمة بين الذراع ورقبة المرفق. ضغط الزيت يعوّم الرقبة على فيلم.'),
            L2('Steel back with aluminium-tin or tri-metal lining', 'ظهر فولاذ مع بطانة ألومنيوم-قصدير أو ثلاثية المعادن'), L2('Low-friction sliding bearing; sacrificial.', 'محمل انزلاقي قليل الاحتكاك؛ يُضحّى به.'),
            L2('Strip rolled → blanked → formed → bored', 'درفلة شريط ← قص ← تشكيل ← تخريط'), L2('Wall thickness ±0.003 mm; crush height 0.05 mm', 'سماكة الجدار ±0.003 mm؛ ارتفاع الضغط 0.05 mm'), L2('ISO 4381 / ISO 4383', 'ISO 4381 / ISO 4383'),
            L2('Oil the shell, lock the tang in its notch, and do not touch the lining.', 'زيّت القشرة وثبّت لسانها في الشق ولا تلمس البطانة.'),
            L2('Grey, scratched shells = dirt or low oil pressure. Replace on every rebuild.', 'قشور رمادية أو مخدوشة = أوساخ أو ضغط زيت منخفض. تُبدَّل في كل إعادة تجميع.')),
        en_cap: P(L2('Rod cap', 'غطاء الذراع'), L2('The lower half of the big end, bolted to the rod around the crank pin.', 'النصف السفلي للطرف الكبير، يُربط بالذراع حول رقبة المرفق.'),
            L2('Same steel as the rod', 'نفس فولاذ الذراع'), L2('Lets the rod be assembled on a one-piece crankshaft.', 'يسمح بتركيب الذراع على عمود مرفق من قطعة واحدة.'),
            L2('Fracture-split from the rod blank so the break surfaces locate it exactly', 'يُكسَر من جسم الذراع فتعمل أسطح الكسر كمُمركِز دقيق'), L2('Cap seating 100 % contact', 'تلامس 100% لسطح التركيب'), L2('—', '—'),
            L2('Match the marks; tighten the two bolts in steps to the specified torque.', 'طابق العلامات؛ شدّ البرغيين على مراحل حتى العزم المحدد.'),
            L2('Cap shift = bearing noise. Check bore roundness after every tightening.', 'إزاحة الغطاء = ضجيج المحمل. افحص استدارة الثقب بعد كل شد.')),
        en_rbolt: P(L2('Rod bolts M8', 'براغي الذراع M8'), L2('Two high-strength bolts that clamp the cap. They are the most heavily loaded fasteners in the engine.', 'برغيان عاليا المقاومة يشدّان الغطاء. هما أكثر البراغي تحميلاً في المحرك.'),
            L2('Steel class 10.9 or 12.9', 'فولاذ فئة 10.9 أو 12.9'), L2('Hold the cap against inertia at TDC overlap.', 'يحافظان على الغطاء ضد قوة العطالة عند التقاطع في النقطة الميتة العليا.'),
            L2('Cold-headed, rolled thread after heat treatment', 'تشكيل على البارد ودرفلة السن بعد المعالجة الحرارية'), L2('Class 6g; stretch-controlled tightening', 'فئة 6g؛ شد بمراقبة الاستطالة'), L2('ISO 898-1', 'ISO 898-1'),
            L2('Always use new bolts; tighten by torque + angle.', 'استعمل براغي جديدة دائماً؛ الشد بالعزم + الزاوية.'),
            L2('A stretched bolt lets the cap separate and the engine "throws a rod". Never re-use.', 'برغي مستطيل يفصل الغطاء ويقذف المحرك الذراع. لا يُعاد استعماله أبداً.')),
        en_piston: P(L2('Piston', 'المكبس'), L2('A forged aluminium cup. The crown takes the gas pressure, the ring grooves hold the rings and the skirt guides it in the bore.', 'كأس ألومنيوم مطروق. التاج يتحمل ضغط الغاز، والمجاري تحمل الشنابر، والتنورة توجّهه في الأسطوانة.'),
            L2('Hypereutectic aluminium AlSi12CuNiMg, forged', 'ألومنيوم AlSi12CuNiMg مطروق'), L2('Converts gas pressure into force on the rod.', 'يحوّل ضغط الغاز إلى قوة على الذراع.'),
            L2('Forged → turned (barrel/oval profile) → grooves cut → skirt coated with graphite', 'طرق ← خراطة (شكل برميلي/بيضوي) ← فتح المجاري ← طلاء التنورة بالجرافيت'), L2('Skirt clearance 0.03–0.05 mm; groove width +0.03 mm; pin bore H5', 'خلوص التنورة 0.03–0.05 mm؛ عرض المجرى +0.03 mm؛ ثقب المسمار H5'), L2('ISO 6621 (rings), ISO 2282', 'ISO 6621 (الشنابر)، ISO 2282'),
            L2('Heat to ≈ 80 °C so the wrist pin slides in by hand; arrow on the crown points to the exhaust side.', 'يُسخَّن ≈ 80°م ليدخل المسمار باليد؛ السهم على التاج يتجه نحو جانب العادم.'),
            L2('Melted crown = detonation or lean mixture; seized skirt = overheating or tight clearance.', 'تاج منصهر = فرقعة أو خليط فقير؛ تنورة ملتصقة = ارتفاع حرارة أو خلوص ضيق.')),
        en_ring: P(L2('Piston rings (3)', 'شنابر المكبس (3)'), L2('Two compression rings seal the combustion gas; the lower oil-control ring wipes excess oil from the wall.', 'شنبران انضغاطيان يمنعان تسرّب غاز الاحتراق، والسفلي شنبر الزيت يكشط الزيت الزائد عن الجدار.'),
            L2('Cast iron / steel, chrome or nitride coated', 'حديد زهر أو فولاذ بطلاء كروم أو نيتريد'), L2('Seal, transfer heat to the wall and control oil.', 'تمنع التسرب وتنقل الحرارة للجدار وتتحكم بالزيت.'),
            L2('Wound / cast, ground to profile, end gap cut', 'لف أو صب، جلخ الشكل، قطع فتحة الطرفين'), L2('End gap 0.20–0.35 mm in the bore; side clearance 0.04 mm', 'فتحة الطرفين 0.20–0.35 mm في الأسطوانة؛ الخلوص الجانبي 0.04 mm'), L2('ISO 6621', 'ISO 6621'),
            L2('Stagger the end gaps 120° apart; fit with a ring tool, never over-expand.', 'وزّع فتحات الشنابر بزاوية 120°؛ ركّبها بأداة ولا تفتحها زيادة.'),
            L2('Stuck (coked) rings → blow-by and oil burning: clean the grooves or replace.', 'شنابر ملتصقة بالكربون ← تسرّب غاز واحتراق زيت: نظّف المجاري أو بدّل.')),
        en_pin: P(L2('Wrist (gudgeon) pin', 'مسمار المكبس'), L2('A hollow steel pin that joins the piston to the small end of the rod.', 'مسمار فولاذي أجوف يصل المكبس بالطرف الصغير للذراع.'),
            L2('Case-hardened 16MnCr5, ground', 'فولاذ 16MnCr5 مكربن ومجلوخ'), L2('Transfers the piston force to the rod.', 'ينقل قوة المكبس إلى الذراع.'), L2('Tube drawn → case hardened → centreless ground → lapped', 'سحب أنبوب ← كربنة ← جلخ بلا مراكز ← صقل'), L2('Ø h5, Ra 0.1 µm; clearance in boss 0.005–0.010 mm', 'القطر h5، Ra 0.1 µm؛ الخلوص في الزر 0.005–0.010 mm'), L2('ISO 18669', 'ISO 18669'),
            L2('Slide it through the boss and rod, then secure it with two circlips.', 'يُدخَل عبر الزر والذراع ثم يُثبَّت بحلقتي قفل.'),
            L2('A missing circlip lets the pin walk into the cylinder wall — scores the bore.', 'غياب حلقة القفل يجعل المسمار يتحرك ويخدش الأسطوانة.')),
        en_gasket: P(L2('Head gasket', 'جوان الرأس'), L2('A multilayer steel gasket between the block and the head.', 'جوان معدني متعدد الطبقات بين الكتلة والرأس.'),
            L2('Multi-layer steel (MLS) with elastomer beads', 'فولاذ متعدد الطبقات مع حلقات مطاطية'), L2('Seals compression, oil and coolant passages.', 'يمنع تسرب الانضغاط والزيت والتبريد.'), L2('Stamped from sheet and coated', 'ختم من صفائح مع طلاء'), L2('Thickness 1.2 ±0.05 mm', 'السماكة 1.2 ±0.05 mm'), L2('ISO 7500', 'ISO 7500'),
            L2('Always new, dry, correct side up.', 'جديد دائماً وجافّ وبالاتجاه الصحيح.'), L2('Blown gasket → white smoke and loss of compression; check head flatness before refitting.', 'جوان محروق ← دخان أبيض وفقد انضغاط؛ افحص استواء الرأس قبل إعادة التركيب.')),
        en_head: P(L2('Cylinder head', 'رأس الأسطوانة'), L2('Closes the top of the cylinder with the combustion chamber, the valve seats, the inlet and exhaust ports, the spark-plug thread and the camshaft towers.', 'يغلق أعلى الأسطوانة وفيه غرفة الاحتراق ومقاعد الصمامات ومجريا السحب والعادم وسن الشمعة وأبراج عمود الحدبات.'),
            L2('Aluminium AlSi7Mg (T6) with sintered-steel seats and bronze valve guides', 'ألومنيوم AlSi7Mg (T6) مع مقاعد فولاذ ملبّد ودلائل برونزية'), L2('Gas exchange: lets air in and the burnt gas out.', 'تبادل الغاز: يُدخل الهواء ويُخرج الغاز المحترق.'),
            L2('Gravity die cast with sand cores → CNC machined in one clamping → ports flowed', 'صب بالجاذبية مع قلوب رملية ← تشغيل CNC بتثبيتة واحدة ← تحسين المجاري'), L2('Gasket face flatness 0.03 mm; seat concentric to guide 0.03 mm', 'استواء وجه الجوان 0.03 mm؛ تمركز المقعد مع الدليل 0.03 mm'), L2('ISO 1101', 'ISO 1101'),
            L2('Fit the gasket, lower the head on the locating dowels, then tighten the bolts in a cross pattern.', 'ضع الجوان وأنزل الرأس على المسامير الموجهة ثم شدّ البراغي بنمط متقاطع.'),
            L2('Warped or cracked head from overheating: check flatness with a straight edge.', 'رأس معوج أو متشقق بسبب الحرارة: افحص الاستواء بمسطرة.')),
        en_hbolt: P(L2('Head bolts M10 (4)', 'براغي الرأس M10 (4)'), L2('Four long bolts that clamp the head to the block through the gasket.', 'أربعة براغٍ طويلة تشد الرأس للكتلة عبر الجوان.'),
            L2('Steel class 10.9', 'فولاذ فئة 10.9'), L2('Hold the joint closed against gas pressure.', 'تبقي الوصلة مغلقة ضد ضغط الغاز.'), L2('Cold-headed, rolled thread', 'تشكيل على البارد ودرفلة السن'), L2('6g', '6g'), L2('ISO 898-1', 'ISO 898-1'),
            L2('Tighten crosswise in 3 passes (30 % → 60 % → 100 %).', 'شدّ متقاطعاً على 3 مراحل (30% ← 60% ← 100%).'), L2('Stretch bolts must be replaced at each rebuild.', 'براغي الاستطالة يجب استبدالها عند كل إعادة تجميع.')),
        en_valve: P(L2('Valves (inlet + exhaust)', 'الصمامات (سحب + عادم)'), L2('Poppet valves. The larger one lets the fresh mixture in; the smaller, hotter one lets the burnt gas out.', 'صمامات فطرية. الأكبر يدخل الخليط الجديد والأصغر الأسخن يُخرج الغاز المحترق.'),
            L2('Inlet: 21-4N steel. Exhaust: Nimonic / sodium-filled for heat.', 'السحب: فولاذ 21-4N. العادم: نيمونيك أو معبّأ بالصوديوم للتبريد.'), L2('Open and close the ports at the right crank angle.', 'تفتح المجاري وتغلقها عند زاوية المرفق الصحيحة.'),
            L2('Extruded head, friction-welded stem, ground face and stem', 'رأس مبثوق وساق ملحومة بالاحتكاك وجلخ الوجه والساق'), L2('Seat angle 45° ±0.25°; stem h6; runout 0.02 mm', 'زاوية المقعد 45° ±0.25°؛ الساق h6؛ الاهتزاز 0.02 mm'), L2('ISO 6621 / DIN 73 / SAE J775', 'ISO 6621 / DIN 73 / SAE J775'),
            L2('Lap the face to its seat with fine paste until a continuous grey ring shows.', 'اصقل الوجه على مقعده بمعجون ناعم حتى تظهر حلقة رمادية متصلة.'),
            L2('Burnt exhaust valve edge = lean mixture or no clearance. Bent valve = timing failure.', 'حافة صمام عادم محروقة = خليط فقير أو عدم خلوص. صمام منحنٍ = فشل في التوقيت.')),
        en_spring: P(L2('Valve springs (2)', 'نوابض الصمامات (2)'), L2('Coil springs that close the valve and keep the follower on the cam. They are compressed by the cam and shown moving live.', 'نوابض لولبية تغلق الصمام وتبقي التابع ملامساً للحدبة. تنضغط بالحدبة وتظهر حية.'),
            L2('Chrome-silicon wire (valve-spring quality)', 'سلك كروم-سيليكون خاص بنوابض الصمامات'), L2('Prevent valve float at high speed.', 'تمنع طفو الصمام عند السرعات العالية.'), L2('Wound, ground ends, shot-peened, pre-set', 'لف، جلخ الأطراف، تنظيف بالكرات، ضغط مسبق'), L2('Free length ±0.5 mm; load ±5 %', 'الطول الحر ±0.5 mm؛ الحمل ±5%'), L2('DIN 2095', 'DIN 2095'),
            L2('Use a spring compressor; keepers sit in the retainer groove.', 'استعمل ضاغط نوابض؛ والأقفال تجلس في مجرى الحامل.'),
            L2('Weak spring → valve float and power loss above the float rpm.', 'نابض ضعيف ← طفو الصمام وفقد القدرة فوق سرعة الطفو.')),
        en_tappet: P(L2('Bucket tappets (2)', 'الكؤوس التابعة (2)'), L2('Cups that sit on the valve stems and ride on the cam. A calibrated shim under the cup sets the valve clearance.', 'كؤوس على سيقان الصمامات تلامس الحدبة. وشيمة معايَرة تحتها تضبط خلوص الصمام.'),
            L2('Case-hardened steel with DLC-coated top', 'فولاذ مكربن مع طلاء DLC للسطح العلوي'), L2('Pass the cam motion straight to the valve.', 'تنقل حركة الحدبة مباشرة إلى الصمام.'), L2('Cold formed, hardened, ground', 'تشكيل على البارد وتقسية وجلخ'), L2('Outer Ø h6 in head bore; flat to 0.002 mm', 'القطر الخارجي h6 في ثقب الرأس؛ الاستواء 0.002 mm'), L2('—', '—'),
            L2('Measure valve clearance cold: inlet 0.10–0.15 mm, exhaust 0.20–0.25 mm.', 'قِس خلوص الصمام على البارد: السحب 0.10–0.15 mm، العادم 0.20–0.25 mm.'),
            L2('Clearance too tight → valve never fully closes and burns; too loose → tapping noise.', 'خلوص ضيق ← الصمام لا يغلق تماماً ويحترق؛ وواسع ← صوت طرق.')),
        en_camI: P(L2('Inlet camshaft', 'عمود حدبات السحب'), L2('The lobe pushes the tappet down once every two crank turns. The shape of the lobe sets the lift (8 mm) and duration (240° of crank).', 'تضغط الحدبة الكأس مرة كل دورتين للمرفق. شكل الحدبة يحدد الرفع (8 mm) والمدة (240° مرفق).'),
            L2('Chilled cast iron or hardened 16MnCr5', 'حديد زهر مبرّد أو 16MnCr5 مقسّى'), L2('Times the opening and closing of the inlet valve.', 'يضبط توقيت فتح صمام السحب وإغلاقه.'), L2('Forged → ground on a cam grinder → induction hardened', 'طرق ← جلخ على آلة جلخ الحدبات ← تقسية حثية'), L2('Lobe profile ±0.01 mm; journal h6; runout 0.02 mm', 'شكل الحدبة ±0.01 mm؛ المحور h6؛ الاهتزاز 0.02 mm'), L2('—', '—'),
            L2('Line up the timing marks on the sprocket and the crank; the cam turns at HALF crank speed.', 'طابق علامات التوقيت بين الترس والمرفق؛ تدور الحدبة بنصف سرعة المرفق.'),
            L2('Worn lobe nose → less lift and a power drop; check with a dial gauge.', 'تآكل ذروة الحدبة ← رفع أقل وهبوط قدرة؛ افحص بمؤشر ساعة.')),
        en_plug: P(L2('Spark plug', 'شمعة الإشعال'), L2('A ceramic-insulated electrode that makes the spark in the middle of the chamber, 20° before TDC.', 'قطب معزول بالسيراميك يولّد الشرارة في منتصف الغرفة قبل النقطة الميتة العليا بـ 20°.'),
            L2('Alumina ceramic, nickel-alloy electrodes', 'سيراميك ألومينا وأقطاب سبيكة نيكل'), L2('Ignites the mixture.', 'يشعل الخليط.'), L2('Ceramic pressed and fired, electrode welded, gap set', 'كبس السيراميك وحرقه، لحام القطب، ضبط الفجوة'), L2('Gap 0.8 mm ±0.05', 'الفجوة 0.8 mm ±0.05'), L2('ISO 28741 (M14×1.25)', 'ISO 28741 (M14×1.25)'),
            L2('Torque: use the plug maker\'s value for this thread and seat type (do not over-tighten the aluminium head).', 'العزم: استعمل قيمة صانع الشمعة لهذا السن ونوع المقعد (لا تفرط في الشد على الرأس الألمنيومي).'), L2('Black sooty plug = rich mixture; white = lean or too hot.', 'شمعة سوداء ملوّثة = خليط غني؛ بيضاء = فقير أو حرارة عالية.'))
    };
    info.en_camE = Object.assign({}, info.en_camI, { name: L2('Exhaust camshaft', 'عمود حدبات العادم'), desc: L2('Same design as the inlet cam but timed 200° earlier. Its lobe opens the exhaust valve at 40° before the bottom of the power stroke.', 'تصميمه كالسحب لكنه مضبوط قبله بـ 200°. حدبته تفتح صمام العادم قبل نهاية شوط القدرة بـ 40°.') });
    DIS.addParts(info);

    /* ---------------- geometry helpers ---------------- */
    const cylY = (r, h, seg, m) => new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg || 32), m);
    const tubeY = (ro, ri, h, m, seg) => { const g = tubeGeo(ro, ri, h, seg || 40); g.rotateX(-PI / 2); return new THREE.Mesh(g, m); };
    const hole = (x, y, r) => { const h = new THREE.Path(); h.absarc(x, y, r, 0, 2 * PI, true); return h; };
    function rectShape(hx, hz, holes) { const s = new THREE.Shape(); s.moveTo(-hx, -hz); s.lineTo(hx, -hz); s.lineTo(hx, hz); s.lineTo(-hx, hz); s.closePath(); (holes || []).forEach((h) => s.holes.push(h)); return s; }
    function extY(shape, y0, y1) { const g = new THREE.ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false, curveSegments: 28 }); g.rotateX(-PI / 2); g.translate(0, y0, 0); return g; }
    function hullPts(circles) {
        const pts = []; circles.forEach((c) => { for (let i = 0; i < 28; i++) { const a = (i * 2 * PI) / 28; pts.push([c[0] + c[2] * Math.cos(a), c[1] + c[2] * Math.sin(a)]); } });
        pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
        const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
        pts.forEach((q) => { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); });
        for (let i = pts.length - 1; i >= 0; i--) { const q = pts[i]; while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
        return lo.slice(0, -1).concat(up.slice(0, -1)).map((q) => new THREE.Vector2(q[0], q[1]));
    }
    const polyA = (pts) => { let s = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; s += a.x * b.y - b.x * a.y; } return Math.abs(s) / 2; };
    const helix = (R, h, turns, wire, m) => {
        const pts = []; const n = Math.round(turns * 16);
        for (let i = 0; i <= n; i++) { const t = i / n, a = t * turns * 2 * PI; pts.push(new THREE.Vector3(R * Math.cos(a), t * h, R * Math.sin(a))); }
        return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), n * 2, wire, 6, false), m);
    };
    const valveGeo = (R, L) => { const pts = [[0, 0], [R, 0], [R, 1.4], [4.2, 5], [3, 9], [3, L - 6], [2.4, L - 5], [2.4, L - 2], [3, L - 2], [3, L], [0, L]]; return new THREE.LatheGeometry(pts.map((q) => new THREE.Vector2(q[0], q[1])), 28); };
    const camShape = () => { const pts = []; for (let i = 0; i < 90; i++) { const psi = -PI + (i * 2 * PI) / 90, r = BASE + LIFT * lobe(psi); pts.push(new THREE.Vector2(r * Math.sin(psi), -r * Math.cos(psi))); } return new THREE.Shape(pts); };

    /* ---------------- the model ---------------- */
    DIS.add('engine', L2('Petrol engine (4-stroke)', 'محرك بنزين (4 أشواط)'), {
        controls: () => [
            { type: 'title', label: L2('Engine geometry', 'أبعاد المحرك') },
            { id: 'B', type: 'range', label: L2('Bore', 'قطر الأسطوانة'), min: 65, max: 90, step: 1, value: 75, unit: 'mm', rebuild: true },
            { id: 'S', type: 'range', label: L2('Stroke', 'شوط المكبس'), min: 55, max: 80, step: 1, value: 65, unit: 'mm', rebuild: true },
            { id: 'rr', type: 'range', label: L2('Rod ratio l / r', 'نسبة الذراع l / r'), min: 3, max: 4.2, step: 0.1, value: 3.5, rebuild: true },
            { id: 'CR', type: 'range', label: L2('Compression ratio', 'نسبة الانضغاط'), min: 8, max: 11.5, step: 0.5, value: 10, rebuild: true },
            { id: 'flyD', type: 'range', label: L2('Flywheel diameter', 'قطر الدولاب'), min: 140, max: 240, step: 10, value: 200, unit: 'mm', rebuild: true },
            { id: 'spring', type: 'select', label: L2('Valve springs', 'نوابض الصمامات'), options: Object.keys(SPR).map((v) => ({ v, label: SPR[v].name })), value: 'std' },
            { id: 'rb', type: 'select', label: L2('Rod-bolt class', 'فئة براغي الذراع'), options: [{ v: '8.8', label: '8.8' }, { v: '10.9', label: '10.9' }, { v: '12.9', label: '12.9' }], value: '10.9' },
            { type: 'title', label: L2('Operation', 'التشغيل') },
            { id: 'rpm', type: 'range', label: L2('Engine speed', 'سرعة المحرك'), min: 600, max: 9000, step: 100, value: 3000, unit: 'rpm' },
            { id: 'load', type: 'range', label: L2('Throttle / load', 'الخنق / الحمل'), min: 20, max: 100, step: 5, value: 100, unit: '%' },
            ...DIS.common(17)
        ],
        build(p, api) {
            const g = geo(p), B = g.B, r = g.r, l = g.l, Rp = B / 2 - 0.4;
            const alu = mat(COL.alu, { metalness: 0.45, roughness: 0.4 }), cast = mat(0x7a8696, { metalness: 0.4 }), steel = mat(COL.steel), dark = mat(COL.dark, { metalness: 0.4 }), glass = mat(0x8fb3d9, { metalness: 0.1, roughness: 0.2, transparent: true, opacity: 0.22, depthWrite: false });
            const rodM = mat(0x8b97a6, { metalness: 0.55, roughness: 0.4 }), brz = mat(COL.bronze), keyM = mat(COL.key, { metalness: 0.4 });
            const holes4 = (R) => [[1, 1], [1, -1], [-1, 1], [-1, -1]].map((q) => hole(q[0] * g.bx, q[1] * g.bz, R));
            const mesh = (geom, m) => new THREE.Mesh(geom, m);
            const vv = vols(p);
            let phi = 0;
            const ref = {};
            /* ---- block (upper crankcase) + sump (lower crankcase): split on the crank axis so the crank can drop out ---- */
            const halfRing = (ro, ri, lower, h) => { const sh = new THREE.Shape(), a0 = lower ? PI : 0; sh.absarc(0, 0, ro, a0, a0 + PI, false); sh.absarc(0, 0, ri, a0 + PI, a0, true); sh.closePath(); const gg = new THREE.ExtrudeGeometry(sh, { depth: h, bevelEnabled: false, curveSegments: 36 }); gg.translate(0, 0, -h / 2); return gg; };
            const endPlate = (lower) => {
                const X = g.Xc + 8, sh = new THREE.Shape();
                if (!lower) { sh.moveTo(-X, 0); sh.lineTo(-15.5, 0); sh.absarc(0, 0, 15.5, PI, 0, true); sh.lineTo(X, 0); sh.lineTo(X, g.yb); sh.lineTo(-X, g.yb); }
                else { sh.moveTo(-X, g.Yb - 8); sh.lineTo(X, g.Yb - 8); sh.lineTo(X, 0); sh.lineTo(15.5, 0); sh.absarc(0, 0, 15.5, 0, -PI, true); sh.lineTo(-X, 0); }
                sh.closePath(); return sh;
            };
            const endWalls = (s, lower) => [-1, 1].forEach((sz) => {
                const gg = new THREE.ExtrudeGeometry(endPlate(lower), { depth: 8, bevelEnabled: false, curveSegments: 28 }); gg.translate(0, 0, sz < 0 ? -g.Zc : g.Zc - 8); s.add(mesh(gg, alu));
                s.add(at(mesh(halfRing(26, 15.5, lower, 14), alu), 0, 0, sz * (g.Zc + 7)));
            });
            const block = (s) => {
                const yt = g.yd - 14;
                s.add(mesh(extY(rectShape(g.hx, g.hz, [hole(0, 0, B / 2), ...holes4(5.5)]), yt, g.yd), alu));
                s.add(at(tubeY(B / 2 + 7, B / 2, yt - g.yb, alu, 56), 0, (yt + g.yb) / 2, 0));
                for (let k = 0; k < 5; k++) s.add(at(tubeY(B / 2 + 15, B / 2 + 6.5, 3, alu, 56), 0, g.yb + 10 + (k * (yt - g.yb - 26)) / 4, 0));
                s.add(mesh(extY(rectShape(g.Xc + 8, g.Zc, [hole(0, 0, B / 2)]), g.yb - 6, g.yb), alu));
                [-1, 1].forEach((sx) => s.add(at(boxM(8, g.yb - 6, 2 * g.Zc, glass), sx * (g.Xc + 4), (g.yb - 6) / 2, 0)));
                endWalls(s, false);
            };
            const sump = (s) => {
                [-1, 1].forEach((sx) => s.add(at(boxM(8, -g.Yb, 2 * g.Zc, glass), sx * (g.Xc + 4), g.Yb / 2, 0)));
                s.add(at(boxM(2 * g.Xc + 16, 8, 2 * g.Zc, alu), 0, g.Yb - 4, 0));
                endWalls(s, true);
            };
            /* ---- crank + flywheel ---- */
            const Rc = r + 20;
            const crank = (s) => {
                s.add(at(cylZ(15, 53, 36, steel), 0, 0, -48.5)); s.add(at(cylZ(15, 58, 36, steel), 0, 0, 51)); s.add(at(cylZ(17, 22, 40, mat(0xc9d1da, { metalness: 0.7, roughness: 0.25 })), 0, r, 0));
                const web = new THREE.Shape(hullPts([[0, 0, 27], [0, r, 21]])), cw = new THREE.Shape(); cw.moveTo(0, 0); cw.absarc(0, 0, Rc, -PI / 2 - 1.22, -PI / 2 + 1.22, false); cw.lineTo(0, 0);
                [[-22, -11], [11, 22]].forEach((zz) => { [web, cw].forEach((sh) => { const gg = new THREE.ExtrudeGeometry(sh, { depth: 11, bevelEnabled: false, curveSegments: 20 }); gg.translate(0, 0, zz[0]); s.add(mesh(gg, steel)); }); });
                ref.crank = s;
            };
            const fly = (s) => {
                const fg = flyGeo(p), R = fg.R, sh = new THREE.Shape(); sh.absarc(0, 0, R, 0, 2 * PI, false); sh.holes.push(hole(0, 0, 15));
                for (let k = 0; k < 6; k++) { const a = (k * PI) / 3; sh.holes.push(hole(fg.d * Math.cos(a), fg.d * Math.sin(a), fg.rh)); }
                const gg = new THREE.ExtrudeGeometry(sh, { depth: 30, bevelEnabled: false, curveSegments: 40 }); gg.translate(0, 0, 80); s.add(mesh(gg, cast));
                s.add(at(boxM(6, 10, 3, mat(0xf59e0b)), R - 7, 0, 110.5));
            };
            /* ---- rod group ---- */
            const sector = (d0, d1) => { const a0 = d0 * D2R, a1 = d1 * D2R, sh = new THREE.Shape(); sh.absarc(0, 0, 27, a0, a1, false); sh.absarc(0, 0, 18.5, a1, a0, true); sh.closePath(); const gg = new THREE.ExtrudeGeometry(sh, { depth: 22, bevelEnabled: false, curveSegments: 36 }); gg.translate(0, 0, -11); return gg; };
            const ear = (sx, y0, y1) => at(mesh(extY(rectShape(5.75, 11, [hole(0, 0, 4)]), y0, y1), rodM), sx * 24.25, 0, 0);
            const half = (a0, a1) => { const sh = new THREE.Shape(); sh.absarc(0, 0, 27, a0, a1, false); const ex = a1 === PI ? -18.5 : 18.5; sh.lineTo(ex, 0); sh.absarc(0, 0, 18.5, a1, a0, true); sh.closePath(); const gg = new THREE.ExtrudeGeometry(sh, { depth: 22, bevelEnabled: false, curveSegments: 36 }); gg.translate(0, 0, -11); return gg; };
            const rod = (s) => {
                s.add(mesh(sector(40, 140), rodM)); [-1, 1].forEach((sx) => s.add(ear(sx, 0, 16)));
                const Lb = l - 26 - (g.dp / 2 + 6);
                s.add(at(boxM(14, Lb, 4, rodM), 0, 26 + Lb / 2 - 2, 0)); [-7, 7].forEach((x) => s.add(at(boxM(3, Lb, 16, rodM), x, 26 + Lb / 2 - 2, 0)));
                s.add(at(tubeZ(g.dp / 2 + 6.5, g.dp / 2, 18, rodM, 36), 0, l, 0));
            };
            const cap = (s) => { s.add(mesh(sector(220, 320), rodM)); [-1, 1].forEach((sx) => s.add(ear(sx, -20, 0))); };
            const shellHalf = (lower) => (s) => { const sh = new THREE.Shape(), a0 = lower ? PI : 0; sh.absarc(0, 0, 18.5, a0, a0 + PI, false); sh.absarc(0, 0, 17, a0 + PI, a0, true); sh.closePath(); const gg = new THREE.ExtrudeGeometry(sh, { depth: 20, bevelEnabled: false, curveSegments: 40 }); gg.translate(0, 0, -10); s.add(mesh(gg, mat(0xb08a4a, { metalness: 0.6, roughness: 0.35 }))); };
            const rbolt = (s) => [-1, 1].forEach((sx) => { const gp = new THREE.Group(); gp.add(at(cylY(4, 39, 16, dark), 0, -5.5, 0)); gp.add(at(cylY(7.5, 5.3, 6, dark), 0, -22.65, 0)); gp.position.x = sx * 24.25; s.add(gp); });
            /* ---- piston group ---- */
            const piston = (s) => {
                const top = g.CHt, root = B / 2 - 3.2, pts = [[0, top], [Rp, top]];
                [[g.CHt - 3.2, 1.2], [g.CHt - 5.9, 1.2], [g.CHt - 9, 2.4]].forEach((q) => { pts.push([Rp, q[0] + q[1] / 2], [root, q[0] + q[1] / 2], [root, q[0] - q[1] / 2], [Rp, q[0] - q[1] / 2]); });
                pts.push([Rp, top - 11], [0, top - 11]);
                const lg = new THREE.LatheGeometry(pts.map((q) => new THREE.Vector2(q[0], q[1])), 56); s.add(mesh(lg, alu));
                /* skirt = two thrust faces (±60° about the x axis); the sides are open so the wrist pin can be pulled out sideways */
                [[-PI / 3, PI / 3], [PI - PI / 3, PI + PI / 3]].forEach((a) => { const sh = new THREE.Shape(); sh.absarc(0, 0, Rp, a[0], a[1], false); sh.absarc(0, 0, Rp - 3, a[1], a[0], true); sh.closePath(); s.add(mesh(extY(sh, -g.SK, g.CHt - 11), alu)); });
                [-1, 1].forEach((sz) => {
                    const L = B / 2 - 12, yt = g.CHt - 11 + 0.5, y0 = g.dp / 2 + 3;
                    s.add(at(tubeZ(g.dp / 2 + 6, g.dp / 2, L, alu, 28), 0, 0, sz * (9 + L / 2)));
                    s.add(at(boxM(10, yt - y0, L, alu), 0, (yt + y0) / 2, sz * (9 + L / 2)));
                });
            };
            const rings = (s) => [[g.CHt - 3.2, 1.2], [g.CHt - 5.9, 1.2], [g.CHt - 9, 2.4]].forEach((q) => s.add(at(tubeY(B / 2 - 0.15, B / 2 - 3.2, q[1], mat(0x2b3037, { metalness: 0.6, roughness: 0.3 }), 56), 0, q[0], 0)));
            const pin = (s) => s.add(tubeZ(g.dp / 2, g.dp / 2 - 4, B - 12, mat(0xdfe6ee, { metalness: 0.7, roughness: 0.25 }), 28));
            /* ---- head ---- */
            const head = (s) => {
                const ys = g.yseat, hb = holes4(5.5);
                s.add(mesh(extY(rectShape(g.hx, g.hz, [hole(0, 0, B / 2 - 0.5), ...hb]), g.yd + 1.2, ys), alu));
                s.add(mesh(extY(rectShape(g.hx, g.hz, [hole(0, 0, 7.3), hole(g.xi, 0, g.Ri + 0.3), hole(g.xe, 0, g.Re + 0.3), ...hb]), ys, ys + 9), alu));   // valve pockets + spark-plug thread hole
                s.add(mesh(extY(rectShape(g.hx, g.hz, [hole(0, 0, 7.3), hole(g.xi, 0, 3.05), hole(g.xe, 0, 3.05), ...hb]), ys + 9, g.yht), alu));   // valve guides
                [g.xi, g.xe].forEach((x) => [-1, 1].forEach((sz) => {
                    const H = g.yc - g.yht, sh = new THREE.Shape(); sh.moveTo(-16, 0); sh.lineTo(16, 0); sh.lineTo(16, H); sh.lineTo(11.5, H); sh.absarc(0, H, 11.5, 0, PI, true); sh.lineTo(-16, H); sh.closePath();
                    const gg = new THREE.ExtrudeGeometry(sh, { depth: 9, bevelEnabled: false, curveSegments: 24 }); gg.translate(x, g.yht, sz * 39 - 4.5); s.add(mesh(gg, alu));
                }));
                [-1, 1].forEach((sx) => { const st = tubeZ(14, 10, 26, alu, 28); st.rotation.y = PI / 2; st.position.set(sx * (g.hx + 13), ys + 18, 0); s.add(st); });
            };
            const hboltB = (s) => [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach((q) => { const gp = new THREE.Group(); const len = g.yht - (g.yd - 8); gp.add(at(cylY(5, len, 14, dark), 0, g.yd - 8 + len / 2, 0)); gp.add(at(cylY(9.8, 7, 6, dark), 0, g.yht + 3.5, 0)); gp.position.set(q[0] * g.bx, 0, q[1] * g.bz); s.add(gp); });
            const gasket = (s) => s.add(mesh(extY(rectShape(g.hx, g.hz, [hole(0, 0, B / 2 + 1), ...holes4(5.5)]), g.yd, g.yd + 1.2), mat(0x1f2937, { metalness: 0.05, roughness: 0.9 })));
            /* ---- valve train ---- */
            const Lv = g.Hh + g.Ls + 3 + 14;
            const valves = (s) => {
                [[g.xi, g.Ri, 'vI'], [g.xe, g.Re, 'vE']].forEach((v) => { const m = mesh(valveGeo(v[1], Lv), steel); const grp = new THREE.Group(); grp.add(m); grp.position.x = v[0]; s.add(grp); ref[v[2]] = grp; });
            };
            const springs = (s) => {
                [[g.xi, 'sI'], [g.xe, 'sE']].forEach((v) => {
                    const grp = new THREE.Group(), coil = new THREE.Group(), ret = tubeY(10.2, 3.1, 3, steel, 24);
                    { const hx = helix(8.5, g.Ls - 1.4, 7, 1.4, mat(0xd1d5db, { metalness: 0.7, roughness: 0.3 })); hx.position.y = 1.4; coil.add(hx); } ret.position.y = g.Ls + 1.5; grp.add(coil, ret); grp.position.x = v[0]; s.add(grp); ref[v[1]] = { coil, ret };
                });
            };
            const tappets = (s) => {
                [[g.xi, 'tI'], [g.xe, 'tE']].forEach((v) => {
                    const grp = new THREE.Group(); grp.add(at(tubeY(14, 12.5, 30, mat(0x9aa5b1, { metalness: 0.6, roughness: 0.3 }), 32), 0, 35.5, 0)); grp.add(at(cylY(14, 3.5, 32, steel), 0, 48.75, 0)); grp.position.x = v[0]; s.add(grp); ref[v[1]] = grp;
                });
            };
            const camB = (key) => (s) => {
                s.add(cylZ(11, 100, 28, mat(0x6b7a8d, { metalness: 0.5 })));
                const gg = new THREE.ExtrudeGeometry(camShape(), { depth: 14, bevelEnabled: false }); gg.translate(0, 0, -7); s.add(mesh(gg, mat(0xb7c0cc, { metalness: 0.6, roughness: 0.3 })));
                s.add(at(cylZ(17, 5, 14, dark), 0, 0, -55));
                ref[key] = s;
            };
            const plug = (s) => {
                const th = g.Hh, sp = mat(0xe8e4d8, { metalness: 0.1, roughness: 0.4 });
                s.add(at(cylY(7, th, 20, steel), 0, th / 2, 0)); s.add(at(cylY(1.5, 3, 8, steel), 0, -1.5, 0));
                s.add(at(new THREE.Mesh(new THREE.CylinderGeometry(9.24, 9.24, 8, 6), steel), 0, th + 4, 0)); s.add(at(cylY(4.5, 37, 20, sp), 0, th + 26.5, 0)); s.add(at(cylY(2, 10, 12, steel), 0, th + 50, 0));
            };
            const vHead = (2 * g.hx) * (2 * g.hz) * (g.yht - g.yd) * 0.55;
            const Y = (v, w) => ({ v: [0, v, 0], w }), Zs = (v, w) => ({ v: [0, 0, v], w });
            const volBlock = PI * ((B / 2 + 7) ** 2 - (B / 2) ** 2) * (g.yd - 14 - g.yb) + (2 * g.hx) * (2 * g.hz) * 14 * 0.8 + (2 * g.Xc + 16) * 8 * 2 * g.Zc * 0.8 + 2 * (2 * g.Xc + 16) * g.yb * 8 * 0.7;
            const volSump = (2 * g.Xc + 16) * 8 * 2 * g.Zc * 0.8 + 2 * (2 * g.Xc + 16) * (-g.Yb) * 8 * 0.7;
            const defs = [
                { id: 'en_block', build: block, off: [0, 0, 0], order: 1, vol: volBlock, den: DEN.alu },
                { id: 'en_crank', build: crank, off: [0, -150, 0], segs: [Y(-150, [0.9, 1])], order: 2, vol: volCyl(15, 111) + volCyl(17, 22) + 2 * (polyA(hullPts([[0, 0, 27], [0, r, 21]])) + 0.39 * PI * Rc * Rc) * 11 },
                { id: 'en_fly', build: fly, off: [0, 0, 135], segs: [Zs(135, [0, 0.1])], order: 3, vol: flyMass(p) / DEN.steel, label: false },
                { id: 'en_rod', build: rod, off: [0, 70, 0], segs: [Y(100, [0.62, 0.72]), Y(-30, [0.8, 0.88])], order: 4, vol: vv.rod },
                { id: 'en_shell', build: shellHalf(false), off: [0, 70, 0], segs: [Y(100, [0.62, 0.72]), Y(-30, [0.8, 0.88])], order: 4, qty: 2, vol: vv.shell / 2, den: 7.5e-6, label: false },
                { id: 'en_cap', build: cap, off: [0, -115, 0], segs: [Y(-115, [0.1, 0.2]), Zs(-110, [0.2, 0.28])], order: 5, vol: vv.cap },
                { id: 'en_shell', build: shellHalf(true), off: [0, -115, 0], segs: [Y(-115, [0.1, 0.2]), Zs(-110, [0.2, 0.28])], order: 5, bom: false, label: false, vol: vv.shell / 2, den: 7.5e-6 },
                { id: 'en_rbolt', build: rbolt, off: [0, -185, 0], segs: [Y(-185, [0.05, 0.12]), Zs(110, [0.12, 0.2])], order: 6, qty: 2, vol: vv.rbolt, label: false },
                { id: 'en_sump', build: sump, off: [0, -250, 0], segs: [Y(-250, [0, 0.1])], order: 7, vol: volSump, den: DEN.alu },
                { id: 'en_piston', build: piston, home: [0, r + l, 0], off: [0, 100, 0], segs: [Y(100, [0.62, 0.72])], order: 8, vol: vv.piston, den: DEN.alu },
                { id: 'en_pin', build: pin, home: [0, r + l, 0], off: [0, 0, 120], stepOff: [0, 100, 0], segs: [Y(100, [0.62, 0.72]), Zs(120, [0.72, 0.8])], order: 8, vol: vv.pin },
                { id: 'en_ring', build: rings, home: [0, r + l, 0], off: [0, 60, 0], segs: [Y(100, [0.62, 0.72]), Y(60, [0.8, 0.9])], order: 9, qty: 1, vol: vv.rings, den: 7.2e-6, label: false },
                { id: 'en_gasket', build: gasket, off: [0, 215, 0], segs: [Y(215, [0.5, 0.58])], order: 10, vol: (2 * g.hx) * (2 * g.hz) * 1.2 * 0.6, den: 5e-6, label: false },
                { id: 'en_head', build: head, off: [0, 255, 0], segs: [Y(255, [0.36, 0.5])], order: 11, vol: vHead, den: DEN.alu },
                { id: 'en_valve', build: valves, home: [0, g.yseat, 0], off: [0, 255, 0], segs: [Y(255, [0.36, 0.5]), Y(-110, [0.58, 0.68])], order: 11, qty: 2, vol: 3750, label: false },
                { id: 'en_hbolt', build: hboltB, off: [0, 345, 0], segs: [Y(345, [0.05, 0.15])], order: 12, qty: 4, vol: volCyl(5, g.yht - g.yd + 8) + 0.866 * 17 * 17 * 7, label: false },
                { id: 'en_spring', build: springs, home: [0, g.yht, 0], off: [0, 270, 0], segs: [Y(270, [0.18, 0.28])], order: 13, qty: 2, vol: 5800 + volCyl(11, 3), den: DEN.steel, label: false },
                { id: 'en_tappet', build: tappets, home: [0, g.yht, 0], off: [0, 350, 0], segs: [Y(350, [0.1, 0.2])], order: 14, qty: 2, vol: volTube(14, 12.5, 30) + volCyl(14, 3.5), label: false },
                { id: 'en_camI', build: camB('cI'), home: [g.xi, g.yc, 0], off: [0, 395, 0], segs: [Y(395, [0, 0.1])], order: 15, vol: volCyl(11, 100) + 700 * 14 + volCyl(17, 5), label: true },
                { id: 'en_camE', build: camB('cE'), home: [g.xe, g.yc, 0], off: [0, 395, 0], segs: [Y(395, [0, 0.1])], order: 16, vol: volCyl(11, 100) + 700 * 14 + volCyl(17, 5), label: false },
                { id: 'en_plug', build: plug, home: [0, g.yseat, 0], off: [0, 315, 0], segs: [Y(315, [0.28, 0.36])], order: 17, vol: volCyl(7, g.Hh) + 0.866 * 16 * 16 * 8 + volCyl(4.5, 37) * 0.7, label: false }
            ];
            const animate = () => {
                const e0 = Math.max(0, Math.min(1, (+p.ex || 0) / 100)), w0 = (p.step | 0) > 0 ? 0 : 1 - Math.min(1, e0 / 0.06) * Math.min(1, e0 / 0.06) * (3 - 2 * Math.min(1, e0 / 0.06)), f = (((phi % (4 * PI)) + 4 * PI) % (4 * PI)) * w0, lam = r / l, sn = Math.sin(f), cs = Math.cos(f), yp = r * cs + Math.sqrt(l * l - r * r * sn * sn), psi = Math.asin(lam * sn);
                const by = (id) => ps.find((q) => q.id === id);
                ['en_crank', 'en_fly'].forEach((id) => { by(id).spin.rotation.z = -f; });
                ['en_piston', 'en_pin', 'en_ring'].forEach((id) => { by(id).spin.position.y = yp - (r + l); });
                ['en_rod', 'en_cap', 'en_shell', 'en_rbolt'].forEach((id) => ps.filter((q) => q.id === id).forEach((q) => { q.spin.position.set(r * sn, r * cs, 0); q.spin.rotation.z = psi; }));
                { const ring = by('en_ring'), st = p.step | 0, T = (x) => Math.max(0, Math.min(1, x)), sm = (x) => T(x) * T(x) * (3 - 2 * T(x)); const ks = st > 0 ? (ring.order === st ? 1 : 0) : sm((e0 - 0.77) / 0.03) * (1 - sm((e0 - 0.88) / 0.02)); ring.g.scale.set(1 + 0.12 * ks, 1, 1 + 0.12 * ks); }
                const lI = liftAt(f, PK_I), lE = liftAt(f, PK_E);
                [['vI', 'tI', 'sI', lI], ['vE', 'tE', 'sE', lE]].forEach((v) => {
                    ref[v[0]].position.y = -v[3]; ref[v[1]].position.y = -v[3]; ref[v[2]].coil.scale.y = (g.Ls - v[3]) / g.Ls; ref[v[2]].ret.position.y = g.Ls + 1.5 - v[3];
                });
                ref.cI.rotation.z = -wrap((f - PK_I * D2R) / 2); ref.cE.rotation.z = -wrap((f - PK_E * D2R) / 2);
            };
            let ps = null;
            const { root, world, parts } = DIS.assemble(p, api, defs, {
                update(dt, time, arr) { phi += K.rpmToVis(p.rpm) * dt; ps = arr; animate(); }
            });
            ps = parts; animate();
            DIS.fit(root, 0, 217, 0, 230, 495, [0.75, 0.2, 1]);
            root.userData.target = [0, 19, 0];
            return root;
        },
        readouts(p) {
            const c = calc(p), g = c.g, st = DIS.sfState, lim = c.rpmFloat, tq = DIS.tighten, f1 = (v, d) => fmt(v, d === undefined ? 1 : d);
            const lamS = g.S / g.B;
            return [
                { k: L2('Displacement Vd / clearance volume Vc', 'سعة الأسطوانة Vd / حجم الاحتراق Vc'), v: f1(c.Vd / 1000, 0) + ' cc / ' + f1(c.Vc / 1000) + ' cc' },
                { k: L2('Stroke / bore (' + (lamS > 1 ? 'under-square' : 'over-square') + ')', 'الشوط / القطر (' + (lamS > 1 ? 'شوط طويل' : 'قطر كبير') + ')'), v: f1(lamS, 2) },
                { k: L2('Mean piston speed', 'متوسط سرعة المكبس'), v: f1(c.Sp) + ' m/s', state: c.Sp > 22 ? 'bad' : c.Sp > 18 ? 'warn' : 'ok' },
                { k: L2('Peak cylinder pressure', 'أعلى ضغط في الأسطوانة'), v: f1(c.pmax, 0) + ' bar @ ' + c.apmax + '° ATDC' },
                { k: L2('IMEP / FMEP / BMEP', 'IMEP / FMEP / BMEP'), v: f1(c.imep) + ' / ' + f1(c.fmep) + ' / ' + f1(c.bmep) + ' bar' },
                { k: L2('Brake power · torque', 'القدرة الفرملية · العزم'), v: f1(c.Pw) + ' kW (' + f1(c.Pw * 1.341, 0) + ' hp) · ' + f1(c.Tb) + ' N·m' },
                { k: L2('Peak gas force / inertia force at TDC', 'أقصى قوة غاز / قوة العطالة عند PMS'), v: f1(c.Fgmax / 1000) + ' / ' + f1(Math.abs(Math.min(...c.Fi)) / 1000) + ' kN' },
                { k: L2('Peak side thrust on the cylinder wall', 'أقصى دفع جانبي على جدار الأسطوانة'), v: f1(c.Nmax, 0) + ' N' },
                { k: L2('Big-end bearing peak pressure (≤ 45 MPa)', 'أقصى ضغط في محمل الطرف الكبير (≤ 45 MPa)'), v: f1(c.pBig, 0) + ' MPa', state: c.pBig > 55 ? 'bad' : c.pBig > 45 ? 'warn' : 'ok' },
                { k: L2('Wrist-pin bearing peak pressure (≤ 60 MPa)', 'أقصى ضغط في محمل مسمار المكبس (≤ 60 MPa)'), v: f1(c.pPin, 0) + ' MPa', state: c.pPin > 75 ? 'bad' : c.pPin > 60 ? 'warn' : 'ok' },
                { k: L2('Rod bolts: clamp load ' + f1(c.preload / 1000) + ' kN vs inertia ' + f1(c.Fb / 1000) + ' kN each', 'براغي الذراع: الشد ' + f1(c.preload / 1000) + ' kN مقابل العطالة ' + f1(c.Fb / 1000) + ' kN لكل برغي'), v: 'SF ' + f1(c.sepSF), state: c.sepSF < 1 ? 'bad' : c.sepSF < 1.5 ? 'warn' : 'ok' },
                { k: L2('Valve-float limit (' + SPR[p.spring].name.en + ')', 'حد طفو الصمام (' + SPR[p.spring].name.ar + ')'), v: f1(lim, 0) + ' rpm', state: p.rpm > lim ? 'bad' : p.rpm > 0.9 * lim ? 'warn' : 'ok' },
                { k: L2('Flywheel: speed fluctuation Cs (≤ 0.05)', 'الدولاب: تذبذب السرعة Cs (≤ 0.05)'), v: f1(c.Cs, 3) + ' · I = ' + f1(c.If, 3) + ' kg·m²', state: c.Cs > 0.1 ? 'bad' : c.Cs > 0.05 ? 'warn' : 'ok' },
                { k: L2('Valve timing (crank °)', 'توقيت الصمامات (° مرفق)'), v: 'IVO 20° BTDC · IVC 40° ABDC · EVO 40° BBDC · EVC 20° ATDC · overlap 40°' },
                { k: L2('Torque — head bolts M10-10.9 (3 passes)', 'عزم الشد — براغي الرأس M10-10.9 (3 مراحل)'), v: f1(tq(10, '10.9', 0.14), 0) + ' N·m (oiled, T = K·F·d guide value)' },
                { k: L2('Torque — rod bolts M8-' + p.rb, 'عزم الشد — براغي الذراع M8-' + p.rb), v: f1(tq(8, p.rb, 0.14), 0) + ' N·m (oiled, T = K·F·d guide value; use the engine manual)' },
                DIS.fitRow(L2('Piston in bore', 'المكبس في الأسطوانة'), g.B, 'f', 7),
                DIS.fitRow(L2('Wrist pin in piston boss', 'المسمار في زر المكبس'), g.dp, 'm', 6),
                { k: L2('Mass (calc.)', 'الكتلة (تقديرية)'), v: DIS.fmtMass(DIS.cur.rows.reduce((a, q) => a + q.mass, 0)) }
            ];
        },
        challenges: () => [
            CH('Make at least 10 kW with a mean piston speed ≤ 16 m/s.', 'حقّق 10 kW على الأقل بمتوسط سرعة مكبس ≤ 16 m/s.', (p) => { const c = calc(p); return c.Pw >= 10 && c.Sp <= 16; }),
            CH('Reach 7000 rpm without valve float and with rod-bolt safety ≥ 1.2.', 'بلوغ 7000 rpm بدون طفو الصمام وبمعامل أمان لبراغي الذراع ≥ 1.2.', (p) => { const c = calc(p); return p.rpm >= 7000 && p.rpm < 0.95 * c.rpmFloat && c.sepSF >= 1.2; }),
            CH('Smooth idle: Cs ≤ 0.04 between 1000 and 1500 rpm at 20–40 % load.', 'دوران هادئ: Cs ≤ 0.04 بين 1000 و1500 rpm عند حمل 20–40%.', (p) => { const c = calc(p); return p.rpm >= 1000 && p.rpm <= 1500 && p.load <= 40 && c.Cs <= 0.04; }),
            CH('Big-engine layout at full load: displacement ≥ 400 cc while the big-end bearing stays ≤ 45 MPa.', 'محرك كبير عند الحمل الكامل: سعة ≥ 400 cc مع بقاء ضغط المحمل الكبير ≤ 45 MPa.', (p) => { const c = calc(p); return p.load >= 90 && c.Vd >= 400000 && c.pBig <= 45; })
        ],
        panels(p) {
            const c = calc(p), n = 180, X = (f) => { const a = []; for (let i = 0; i <= n; i++) { const d = (720 * i) / n, di = Math.min(719, Math.round(d)); a.push([d, f(di, d)]); } return a; };
            const xl = L2('Crank angle (° from firing TDC)', 'زاوية المرفق (° من PMS الاحتراق)');
            const lift = (pk) => X((i, d) => liftAt(d * D2R, pk));
            return [
                { type: 'line', h: 180, title: L2('Cylinder pressure', 'ضغط الأسطوانة'), unit: 'bar', xlabel: xl, xmin: 0, xmax: 720, ymin: 0, series: [{ label: 'p', pts: X((i) => c.arr[i]) }], marks: [{ x: c.apmax, y: c.pmax, label: Math.round(c.pmax) + ' bar' }] },
                { type: 'line', h: 190, title: L2('Forces on the piston', 'القوى على المكبس'), unit: 'kN', xlabel: xl, xmin: 0, xmax: 720, series: [{ label: L2('Gas', 'الغاز'), pts: X((i) => c.Fg[i] / 1000) }, { label: L2('Inertia', 'العطالة'), pts: X((i) => c.Fi[i] / 1000) }, { label: L2('Net', 'المحصلة'), pts: X((i) => c.F[i] / 1000), color: '#16a34a' }] },
                { type: 'line', h: 180, title: L2('Crankshaft torque', 'عزم عمود المرفق'), unit: 'N·m', xlabel: xl, xmin: 0, xmax: 720, series: [{ label: L2('Instantaneous', 'اللحظي'), pts: X((i) => c.T[i]) }, { label: L2('Mean', 'المتوسط'), pts: [[0, c.Tm], [720, c.Tm]], color: '#d97706' }] },
                { type: 'line', h: 170, title: L2('Valve lift', 'رفع الصمامات'), unit: 'mm', xlabel: xl, xmin: 0, xmax: 720, ymin: 0, ymax: 9, series: [{ label: L2('Inlet', 'السحب'), pts: lift(PK_I), color: '#0284c7' }, { label: L2('Exhaust', 'العادم'), pts: lift(PK_E), color: '#dc2626' }] }
            ];
        }
    });
    DIS.engineCalc = calc;
})();
