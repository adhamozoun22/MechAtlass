/* MechAtlas — calc_extra.js
 * Additive file (loaded AFTER app.js). It does not redefine anything global:
 *   1) wraps the six existing calculators with clearer messages, notes and solution steps (their own maths is untouched);
 *   2) adds new calculators with calcDefs.push(...) — rendering, validation, units and the language toggle are handled by app.js.
 * Uses the existing globals L, fmt, calcDefs only. */
(function () {
    'use strict';
    if (typeof calcDefs === 'undefined' || typeof L === 'undefined' || typeof fmt === 'undefined') return;

    /* ---------- tiny helpers (all private to this file) ---------- */
    const f5 = x => fmt(x, 5);
    const wrap = (cls, en, ar) => L(
        `<span dir="ltr" class="block text-sm font-normal ${cls}" style="text-align:left">${en}</span>`,
        `<span dir="rtl" class="block text-sm font-normal ${cls}" style="text-align:right">${ar}</span>`);
    const info = (en, ar) => [L('Assumptions / notes', 'الافتراضات / ملاحظات'), wrap('text-gray-600 dark:text-gray-300', en, ar)];
    const warn = (en, ar) => [L('⚠ Warning', '⚠ تنبيه'), wrap('text-amber-700 dark:text-amber-300', en, ar)];
    const steps = lines => [L('Solution steps', 'خطوات الحل'),
        L(`<span dir="ltr" class="block text-sm font-normal font-mono text-gray-700 dark:text-gray-200" style="text-align:left">${lines.join('<br>')}</span>`,
          `<span dir="ltr" class="block text-sm font-normal font-mono text-gray-700 dark:text-gray-200" style="text-align:left">${lines.join('<br>')}</span>`)];
    const fail = (en, ar) => [[L('Cannot calculate', 'تعذّر الحساب'), wrap('text-red-700 dark:text-red-300', en, ar)]];
    const bad = rows => rows.some(r => typeof r[1] === 'string' && r[1].indexOf('—') >= 0);
    const OUT_OF_RANGE = () => fail('The result is outside the numeric range (overflow). Check the values and the units.',
        'النتيجة خارج المدى الرقمي (تجاوز). راجع القيم والوحدات.');

    /* ---------- 1) improve the six existing calculators (maths unchanged) ---------- */
    function enhance(id, extra) {
        const c = calcDefs.find(x => x.id === id);
        if (!c || c._enh) return;
        const orig = c.compute;
        c.compute = function (v) {
            const rows = orig(v);
            if (bad(rows)) return OUT_OF_RANGE();
            return extra(v, rows);
        };
        c._enh = true;
    }

    enhance('stress', (v, rows) => {
        const s = v.f / v.a, out = rows.slice();
        out.push(steps([`σ = F / A = ${f5(v.f)} N / ${f5(v.a)} m²`, `σ = ${f5(s)} Pa = ${f5(s / 1e6)} MPa`]));
        if (v.f < 0) out.push(info('Negative force = compression, so σ is negative (compressive).', 'القوة السالبة = ضغط، لذا الإجهاد سالب (إجهاد ضغط).'));
        if (Math.abs(s) > 1e10) out.push(warn('This stress is unrealistically large for engineering materials. Check the units of F and A.', 'هذا الإجهاد غير واقعي للمواد الهندسية. راجع وحدات F وA.'));
        out.push(info('Valid for an axial force spread uniformly over the cross-section A (perpendicular to the force), away from holes, notches and supports (no stress concentration). 1 MPa = 1 N/mm².',
            'صالحة لقوة محورية موزعة بانتظام على مساحة المقطع A (العمودية على القوة) وبعيداً عن الثقوب والشقوق والمساند (دون تركّز إجهاد). 1 MPa = 1 N/mm².'));
        return out;
    });

    enhance('strain', (v, rows) => {
        const e = v.dl / v.l0, out = rows.slice();
        out.push(steps([`ε = ΔL / L₀ = ${f5(v.dl)} m / ${f5(v.l0)} m = ${f5(e)}`, `ε × 100 = ${f5(e * 100)} %`]));
        if (e <= -1) out.push(warn('ΔL ≤ −L₀ would make the final length zero or negative: impossible. Check ΔL and L₀.', 'ΔL ≤ −L₀ تعني طولاً نهائياً صفراً أو سالباً: مستحيل. راجع ΔL وL₀.'));
        else if (Math.abs(e) >= 0.2) out.push(warn('Large strain (20 % or more). This is engineering strain ΔL/L₀; for large plastic deformation the true strain ln(L/L₀) is different.', 'انفعال كبير (20% أو أكثر). هذا هو الانفعال الهندسي ΔL/L₀؛ وفي التشوه اللدن الكبير يختلف الانفعال الحقيقي ln(L/L₀).'));
        if (v.dl < 0) out.push(info('Negative ΔL = shortening (compression), so ε is negative.', 'ΔL السالب = تقصّر (ضغط)، لذا الانفعال سالب.'));
        out.push(info('Engineering strain is dimensionless (length ratio). L₀ is the ORIGINAL length.', 'الانفعال الهندسي بلا وحدة (نسبة أطوال). L₀ هو الطول الأصلي.'));
        return out;
    });

    enhance('torque', (v, rows) => {
        const T = v.f * v.r, out = rows.slice();
        out.push(steps([`T = F × r = ${f5(v.f)} N × ${f5(v.r)} m`, `T = ${f5(T)} N·m = ${f5(T * 1000)} N·mm`]));
        if (v.r === 0) out.push(warn('Lever arm is zero, so the torque is zero.', 'ذراع القوة صفر، فالعزم صفر.'));
        else if (v.r < 0 || v.f < 0) out.push(warn('A negative F or r only reverses the direction (sign) of the torque; lengths and force magnitudes are normally positive.', 'سالب F أو r يعكس اتجاه (إشارة) العزم فقط؛ والأطوال ومقادير القوة عادةً موجبة.'));
        out.push(info('T = F × r holds when the force is perpendicular to the lever arm. For an angle θ between them: T = F × r × sin θ.', 'T = F × r صحيحة عندما تكون القوة عمودية على ذراع القوة. وإذا كانت بينهما زاوية θ: T = F × r × sin θ.'));
        return out;
    });

    enhance('power', (v, rows) => {
        const w = 2 * Math.PI * v.n / 60, P = v.t * w, out = rows.slice();
        out.push(steps([`ω = 2π n / 60 = 2π × ${f5(v.n)} / 60 = ${f5(w)} rad/s`, `P = T × ω = ${f5(v.t)} N·m × ${f5(w)} rad/s = ${f5(P)} W`]));
        if (v.n === 0) out.push(info('Speed is zero, so the power is zero (the shaft is not rotating).', 'السرعة صفر، فالقدرة صفر (العمود لا يدور).'));
        if (v.t < 0 || v.n < 0) out.push(warn('A negative torque or speed gives a negative power: the sign shows direction (for example braking, power flowing back). Use positive values for ordinary driving power.', 'العزم أو السرعة السالبة تعطي قدرة سالبة: الإشارة تدل على الاتجاه (كالكبح أو رجوع القدرة). استعمل قيماً موجبة للقدرة المُحرِّكة العادية.'));
        out.push(info('Valid for constant torque and speed. This is the power at the shaft; losses (friction, efficiency) are not included. Horsepower here is mechanical hp (745.7 W).', 'صالحة لعزم وسرعة ثابتين. هذه القدرة عند العمود دون فواقد (احتكاك، كفاءة). الحصان هنا ميكانيكي (745.7 W).'));
        return out;
    });

    enhance('gear', (v, rows) => {
        const i = v.t2 / v.t1, out = rows.slice();
        out.push(steps([`i = T₂ / T₁ = ${f5(v.t2)} / ${f5(v.t1)} = ${f5(i)}`, `n₂ = n₁ / i = ${f5(v.n1)} / ${f5(i)} = ${f5(v.n1 / i)} rpm`]));
        out.push(info(i > 1 ? 'i > 1: speed reduction and torque increase.' : (i < 1 ? 'i < 1: speed increase (overdrive) and torque decrease.' : 'i = 1: same speed and torque.'),
            i > 1 ? 'i أكبر من 1: خفض سرعة وزيادة عزم.' : (i < 1 ? 'i أقل من 1: زيادة سرعة (تسريع) ونقصان عزم.' : 'i = 1: السرعة والعزم نفسهما.')));
        if (v.n1 < 0) out.push(warn('A negative input speed only means the opposite direction of rotation.', 'السرعة السالبة للدخل تعني اتجاه دوران معاكساً فقط.'));
        out.push(info('Ideal gear pair (efficiency = 1). In an EXTERNAL mesh the driven gear turns in the opposite direction; an internal mesh keeps the direction. Real output torque = T_in × i × η.',
            'زوج تروس مثالي (الكفاءة = 1). في التعشيق الخارجي يدور الترس المنقاد بعكس الاتجاه؛ والتعشيق الداخلي يحفظ الاتجاه. العزم الحقيقي للخرج = T_in × i × η.'));
        return out;
    });

    enhance('fos', (v, rows) => {
        const n = v.sy / v.sw, out = rows.slice();
        if (n <= 1) out[1] = [L('Assessment', 'التقييم'), n < 1 ? L('Unsafe — yielding expected', 'غير آمن — يُتوقع الخضوع') : L('No reserve — exactly at yield', 'لا احتياطي — عند حد الخضوع تماماً')];
        out.push(steps([`FoS = σ_y / σ = ${f5(v.sy)} MPa / ${f5(v.sw)} MPa = ${f5(n)}`]));
        out.push(info('Definition for static loading of ductile materials (yielding). The assessment bands are rough teaching guides; the required factor depends on load certainty, material data, consequences of failure and the applicable code. Fatigue, buckling and brittle materials need other criteria.',
            'التعريف للأحمال الساكنة على المواد المطيلة (الخضوع). نطاقات التقييم إرشادية تعليمية؛ والمعامل المطلوب يتوقف على يقين الأحمال وبيانات المادة وعواقب الفشل والمواصفة المعتمدة. الكلال والانبعاج والمواد القصفة تحتاج معايير أخرى.'));
        return out;
    });

    /* ---------- 2) new calculators ---------- */
    const add = def => { if (!calcDefs.some(c => c.id === def.id)) calcDefs.push(def); };

    /* Shaft sizing for torque only */
    add({
        id: 'shaft', icon: 'fa-ruler-combined',
        title: L('Shaft Diameter from Power (torsion)', 'قطر العمود من القدرة (التواء)'),
        formula: 'T = 60P / (2πn) ;  d = (16T / (π τ_allow))^(1/3) ;  θ = T L / (G J)',
        inputs: [
            { id: 'p', label: L('Transmitted power (P)', 'القدرة المنقولة (P)'), ph: '10', units: [['kW', 1], ['W', 1e-3], ['hp', 0.7457]], positive: true },
            { id: 'n', label: L('Speed (n) [rpm]', 'السرعة (n) [rpm]'), ph: '1500', positive: true },
            { id: 'tau', label: L('Allowable shear stress (τ_allow)', 'إجهاد القص المسموح (τ_allow)'), ph: '40', units: [['MPa', 1], ['Pa', 1e-6]], positive: true },
            { id: 'l', label: L('Shaft length (L)', 'طول العمود (L)'), ph: '500', units: [['mm', 1], ['cm', 10], ['m', 1000]], positive: true },
            { id: 'g', label: L('Shear modulus (G)', 'معامل القص (G)'), ph: '80', units: [['GPa', 1], ['MPa', 1e-3]], positive: true }
        ],
        compute: v => {
            const T = v.p * 1000 * 60 / (2 * Math.PI * v.n);         // N·m   (P in kW -> W)
            const Tmm = T * 1000;                                      // N·mm
            const d = Math.cbrt(16 * Tmm / (Math.PI * v.tau));        // mm   (tau in MPa = N/mm²)
            const J = Math.PI * Math.pow(d, 4) / 32;                   // mm⁴
            const th = Tmm * v.l / (v.g * 1000 * J);                   // rad  (G GPa -> MPa)
            const deg = th * 180 / Math.PI;
            const rows = [
                [L('Torque (T)', 'العزم (T)'), `${fmt(T)} N·m`],
                [L('Minimum shaft diameter (d)', 'أصغر قطر للعمود (d)'), `${fmt(d)} mm`],
                [L('Angle of twist over L (for this d)', 'زاوية اللي على الطول L (لهذا القطر)'), `${fmt(deg)} °  (${fmt(deg / v.l * 1000)} °/m)`]
            ];
            if (bad(rows)) return OUT_OF_RANGE();
            rows.push(steps([`T = 60 P / (2π n) = 60 × ${f5(v.p * 1000)} W / (2π × ${f5(v.n)}) = ${f5(T)} N·m`,
                `d = (16 T / (π τ))^(1/3) = (16 × ${f5(Tmm)} / (π × ${f5(v.tau)}))^(1/3) = ${f5(d)} mm`,
                `J = π d⁴ / 32 = ${f5(J)} mm⁴`,
                `θ = T L / (G J) = ${f5(Tmm)} × ${f5(v.l)} / (${f5(v.g * 1000)} × ${f5(J)}) = ${f5(th)} rad = ${f5(deg)} °`]));
            rows.push(info('Solid round shaft in PURE torsion with steady torque (T = 9549·P[kW]/n[rpm]). Bending, axial load, keyways, shoulders (stress concentration), shock and fatigue are NOT included: the result is only a lower limit, so round UP to the next available size and check the other loads.',
                'عمود دائري مصمت في التواء بحت وبعزم ثابت (T = 9549·P[kW]/n[rpm]). لا يشمل الانحناء ولا الحمل المحوري ولا خابور الدفع ولا الأكتاف (تركّز الإجهاد) ولا الصدمات ولا الكلال: النتيجة حدّ أدنى فقط، فقرّب إلى المقاس المتاح الأكبر وافحص الأحمال الأخرى.'));
            return rows;
        }
    });

    /* Rolling bearing basic rating life */
    add({
        id: 'bearing', icon: 'fa-circle-dot',
        title: L('Bearing Rating Life (L10)', 'العمر الاسمي للمحمل (L10)'),
        formula: 'L10 = (C / P)^p  [million rev] ;  L10h = 10⁶ L10 / (60 n)',
        inputs: [
            { id: 'c', label: L('Basic dynamic load rating (C)', 'الحمل الديناميكي الأساسي (C)'), ph: '30', units: [['kN', 1], ['N', 1e-3]], positive: true },
            { id: 'p', label: L('Equivalent dynamic load (P)', 'الحمل الديناميكي المكافئ (P)'), ph: '5', units: [['kN', 1], ['N', 1e-3]], positive: true },
            { id: 'n', label: L('Speed (n) [rpm]', 'السرعة (n) [rpm]'), ph: '1000', positive: true },
            { id: 'x', label: L('Life exponent (p): 3 ball, 10/3 roller', 'أس العمر (p): 3 كروي، 10/3 أسطواني'), ph: '3', positive: true }
        ],
        compute: v => {
            const r = v.c / v.p, L10 = Math.pow(r, v.x), L10h = L10 * 1e6 / (60 * v.n);
            const rows = [
                [L('Rating life L10', 'العمر الاسمي L10'), `${fmt(L10)} million rev`],
                [L('Rating life L10h', 'العمر الاسمي L10h'), `${fmt(L10h)} h`],
                [L('Load ratio C / P', 'نسبة الحمل C / P'), fmt(r)]
            ];
            if (bad(rows)) return OUT_OF_RANGE();
            rows.push(steps([`C / P = ${f5(v.c)} / ${f5(v.p)} = ${f5(r)}`, `L10 = (C/P)^p = ${f5(r)}^${f5(v.x)} = ${f5(L10)} million rev`, `L10h = 10⁶ × L10 / (60 n) = 10⁶ × ${f5(L10)} / (60 × ${f5(v.n)}) = ${f5(L10h)} h`]));
            if (v.p > v.c) rows.push(warn('P is greater than C: the life is below 1 million revolutions. Choose a bearing with a larger C.', 'P أكبر من C: العمر أقل من مليون دورة. اختر محملاً بقيمة C أكبر.'));
            if (v.x < 2.5 || v.x > 4) rows.push(warn('The usual basic-life exponents are 3 (ball bearings) and 10/3 (roller bearings). Check p.', 'أسّا العمر المعتادان: 3 (محامل كروية) و10/3 (محامل أسطوانية). راجع p.'));
            rows.push(info('L10 is the life reached or exceeded by 90 % of identical bearings under the same conditions (basic rating life). P must be the equivalent dynamic load (combined radial and axial, from the catalogue method). Modification factors (reliability, lubrication, contamination) are NOT included.',
                'L10 هو العمر الذي تبلغه أو تتجاوزه 90% من المحامل المتماثلة في الظروف نفسها (العمر الاسمي الأساسي). يجب أن يكون P هو الحمل الديناميكي المكافئ (شعاعي ومحوري معاً بطريقة الكتالوج). لا تشمل النتيجة معاملات التعديل (الموثوقية والتزييت والتلوث).'));
            return rows;
        }
    });

    /* Bolt preload and tightening torque */
    add({
        id: 'bolt', icon: 'fa-screwdriver-wrench',
        title: L('Bolt Preload & Tightening Torque', 'الشد المسبق للبرغي وعزم الربط'),
        formula: 'A_t = π/4 (d − 0.9382 p)² ;  F_i = f · S_p · A_t ;  T = K · F_i · d',
        inputs: [
            { id: 'd', label: L('Nominal diameter (d) [mm]', 'القطر الاسمي (d) [mm]'), ph: '10', positive: true },
            { id: 'pitch', label: L('Thread pitch (p) [mm]', 'خطوة السن (p) [mm]'), ph: '1.5', positive: true },
            { id: 'sp', label: L('Proof strength (S_p) [MPa]', 'إجهاد الإثبات (S_p) [MPa]'), ph: '640', positive: true },
            { id: 'f', label: L('Preload as % of proof load', 'الشد المسبق كنسبة % من حمل الإثبات'), ph: '75', positive: true },
            { id: 'k', label: L('Nut (torque) factor (K)', 'معامل الربط (K)'), ph: '0.2', positive: true }
        ],
        compute: v => {
            if (v.f > 100) return fail('Preload cannot exceed 100 % of the proof load.', 'لا يمكن أن يتجاوز الشد المسبق 100% من حمل الإثبات.');
            const dm = v.d - 0.9382 * v.pitch;
            if (!(dm > 0) || v.pitch >= v.d) return fail('The pitch is too large for this diameter. Check d and p.', 'الخطوة كبيرة جداً بالنسبة لهذا القطر. راجع d وp.');
            const At = Math.PI / 4 * dm * dm, Fi = v.f / 100 * v.sp * At, T = v.k * Fi * v.d / 1000;
            const rows = [
                [L('Tensile stress area (A_t)', 'مساحة الإجهاد الشدّي (A_t)'), `${fmt(At)} mm²`],
                [L('Preload force (F_i)', 'قوة الشد المسبق (F_i)'), `${fmt(Fi / 1000)} kN`],
                [L('Tightening torque (T)', 'عزم الربط (T)'), `${fmt(T)} N·m`]
            ];
            if (bad(rows)) return OUT_OF_RANGE();
            rows.push(steps([`A_t = π/4 (d − 0.9382 p)² = π/4 (${f5(v.d)} − 0.9382 × ${f5(v.pitch)})² = ${f5(At)} mm²`,
                `F_i = f × S_p × A_t = ${f5(v.f / 100)} × ${f5(v.sp)} × ${f5(At)} = ${f5(Fi)} N`,
                `T = K × F_i × d = ${f5(v.k)} × ${f5(Fi)} N × ${f5(v.d / 1000)} m = ${f5(T)} N·m`]));
            if (v.f > 90) rows.push(warn('Preload above 90 % of the proof load is very high. Check the value required by your standard or design rule.', 'شد مسبق فوق 90% من حمل الإثبات مرتفع جداً. راجع القيمة التي تتطلبها مواصفتك أو قاعدة التصميم.'));
            rows.push(info('Check: M10 × 1.5 gives A_t = 58.0 mm² and M12 × 1.75 gives 84.3 mm². S_p is the proof strength of the bolt class (take it from the bolt-class table of your standard). K depends on friction (threads and under-head, lubrication, plating): the real preload from a given torque scatters widely, so critical joints need a controlled method (calibrated tool, angle or direct tension).',
                'تحقق: M10 × 1.5 تعطي A_t = 58.0 mm² وM12 × 1.75 تعطي 84.3 mm². S_p هو إجهاد الإثبات لفئة البرغي (خذه من جدول فئات البراغي في مواصفتك). K يتغير مع الاحتكاك (السنون وتحت الرأس والتزييت والطلاء): فالشد المسبق الفعلي لعزم معيّن يتشتت كثيراً، لذا تحتاج الوصلات الحرجة طريقة مضبوطة (أداة معايَرة أو زاوية أو شد مباشر).'));
            return rows;
        }
    });

    /* Fatigue safety factor, Goodman and Soderberg */
    add({
        id: 'fatigue', icon: 'fa-wave-square',
        title: L('Fatigue Safety Factor (Goodman / Soderberg)', 'معامل أمان الكلال (غودمان / سودربرغ)'),
        formula: 'σa = (σmax−σmin)/2 ;  σm = (σmax+σmin)/2 ;  1/n = σa/Se + σm/Sut  (Goodman)',
        inputs: [
            { id: 'smax', label: L('Maximum stress in the cycle (σ_max)', 'أكبر إجهاد في الدورة (σ_max)'), ph: '240', units: [['MPa', 1], ['GPa', 1e3]] },
            { id: 'smin', label: L('Minimum stress in the cycle (σ_min)', 'أصغر إجهاد في الدورة (σ_min)'), ph: '-80', units: [['MPa', 1], ['GPa', 1e3]] },
            { id: 'se', label: L('Corrected endurance limit (S_e)', 'حد التحمل المصحَّح (S_e)'), ph: '250', units: [['MPa', 1], ['GPa', 1e3]], positive: true },
            { id: 'sut', label: L('Ultimate tensile strength (S_ut)', 'مقاومة الشد القصوى (S_ut)'), ph: '500', units: [['MPa', 1], ['GPa', 1e3]], positive: true },
            { id: 'sy', label: L('Yield strength (S_y)', 'إجهاد الخضوع (S_y)'), ph: '350', units: [['MPa', 1], ['GPa', 1e3]], positive: true }
        ],
        compute: v => {
            if (v.smax < v.smin) return fail('σ_max must be greater than or equal to σ_min (compression is negative).', 'يجب أن يكون σ_max أكبر من أو يساوي σ_min (الضغط سالب).');
            if (v.smax === 0 && v.smin === 0) return fail('The stress is zero: there is no load, so the safety factor is unlimited.', 'الإجهاد صفر: لا يوجد حمل، فمعامل الأمان غير محدود.');
            if (v.sy > v.sut) return fail('S_y cannot be greater than S_ut. Check the strengths.', 'لا يمكن أن يكون S_y أكبر من S_ut. راجع المقاومات.');
            const sa = (v.smax - v.smin) / 2, sm = (v.smax + v.smin) / 2, sme = Math.max(sm, 0);
            if (sa === 0 && sme === 0) return fail('There is no alternating stress and no tensile mean stress, so the fatigue safety factor is unlimited (only the static yield check applies).', 'لا يوجد إجهاد متناوب ولا إجهاد متوسط شدّي، فمعامل أمان الكلال غير محدود (يبقى فحص الخضوع الساكن فقط).');
            const nG = 1 / (sa / v.se + sme / v.sut), nS = 1 / (sa / v.se + sme / v.sy);
            const nY = v.sy / Math.max(Math.abs(v.smax), Math.abs(v.smin));
            const R = v.smax === 0 ? null : v.smin / v.smax;
            const rows = [
                [L('Stress amplitude (σa) / mean (σm)', 'سعة الإجهاد (σa) / المتوسط (σm)'), `${fmt(sa)} / ${fmt(sm)} MPa`],
                [L('Stress ratio (R)', 'نسبة الإجهاد (R)'), R === null ? 'undefined' : fmt(R)],
                [L('Goodman safety factor', 'معامل أمان غودمان'), fmt(nG)],
                [L('Soderberg safety factor', 'معامل أمان سودربرغ'), fmt(nS)],
                [L('Static yield check (S_y / max |σ|)', 'فحص الخضوع الساكن (S_y / max |σ|)'), fmt(nY)]
            ];
            if (bad(rows)) return OUT_OF_RANGE();
            rows.push([L('Assessment (Goodman)', 'التقييم (غودمان)'), nG < 1 ? L('Fatigue failure predicted (n below 1)', 'يُتوقع فشل كلال (n أقل من 1)') : (nG === 1 ? L('Exactly on the Goodman line — no margin', 'على خط غودمان تماماً — بلا هامش') : L('Inside the Goodman line — infinite life predicted', 'داخل خط غودمان — يُتوقع عمر لا نهائي'))]);
            rows.push(steps([`σa = (σmax − σmin) / 2 = (${f5(v.smax)} − ${f5(v.smin)}) / 2 = ${f5(sa)} MPa`,
                `σm = (σmax + σmin) / 2 = ${f5(sm)} MPa` + (sm < 0 ? '  (compressive: σm taken as 0 in the lines)' : ''),
                `Goodman: 1/n = σa/Se + σm/Sut = ${f5(sa / v.se)} + ${f5(sme / v.sut)}  →  n = ${f5(nG)}`,
                `Soderberg: 1/n = σa/Se + σm/Sy = ${f5(sa / v.se)} + ${f5(sme / v.sy)}  →  n = ${f5(nS)}`,
                `Yield: n = Sy / max(|σmax|, |σmin|) = ${f5(nY)}`]));
            if (nY < 1) rows.push(warn('The maximum stress exceeds the yield strength: the part yields on the first cycle, whatever the fatigue result.', 'الإجهاد الأقصى يتجاوز إجهاد الخضوع: ستخضع القطعة في الدورة الأولى مهما كانت نتيجة الكلال.'));
            if (v.se > v.sut) rows.push(warn('S_e is greater than S_ut, which is not realistic. Check the endurance limit.', 'S_e أكبر من S_ut وهذا غير واقعي. راجع حد التحمل.'));
            rows.push(info('Uniaxial stress, ductile material, infinite-life check. S_e must already be the CORRECTED endurance limit of the part (surface, size, load type, temperature, reliability). Soderberg is more conservative than Goodman. A compressive mean stress is treated as zero (conservative). Finite life, notches and multiaxial stress are not covered.',
                'إجهاد أحادي المحور، مادة مطيلة، فحص عمر لا نهائي. يجب أن يكون S_e هو حد التحمل المصحَّح للقطعة (السطح والحجم ونوع الحمل والحرارة والموثوقية). سودربرغ أكثر تحفظاً من غودمان. يُعامل الإجهاد المتوسط الضاغط كصفر (تحفظاً). لا تشمل الحساب العمر المحدود ولا الشقوق ولا الإجهاد متعدد المحاور.'));
            return rows;
        }
    });

    /* Cutting speed, feed and material removal rate (milling form) */
    add({
        id: 'cut', icon: 'fa-compass-drafting',
        title: L('Cutting Speed, Feed & MRR (milling)', 'سرعة القطع والتغذية ومعدل الإزالة (التفريز)'),
        formula: 'n = 1000 Vc / (π D) ;  vf = fz · z · n ;  MRR = ae · ap · vf',
        inputs: [
            { id: 'd', label: L('Cutter diameter (D) [mm]', 'قطر القاطع (D) [mm]'), ph: '50', positive: true },
            { id: 'vc', label: L('Cutting speed (Vc)', 'سرعة القطع (Vc)'), ph: '100', units: [['m/min', 1], ['ft/min', 0.3048]], positive: true },
            { id: 'fz', label: L('Feed per tooth (fz) [mm]', 'التغذية لكل سن (fz) [mm]'), ph: '0.1', positive: true },
            { id: 'z', label: L('Number of teeth (z)', 'عدد الأسنان (z)'), ph: '4', positive: true, integer: true },
            { id: 'ap', label: L('Axial depth of cut (ap) [mm]', 'عمق القطع المحوري (ap) [mm]'), ph: '2', positive: true },
            { id: 'ae', label: L('Radial width of cut (ae) [mm]', 'عرض القطع الشعاعي (ae) [mm]'), ph: '10', positive: true }
        ],
        compute: v => {
            const n = 1000 * v.vc / (Math.PI * v.d), vf = v.fz * v.z * n, mrr = v.ae * v.ap * vf / 1000;
            const rows = [
                [L('Spindle speed (n)', 'سرعة الدوران (n)'), `${fmt(n)} rpm`],
                [L('Table feed (vf)', 'تغذية الطاولة (vf)'), `${fmt(vf)} mm/min`],
                [L('Material removal rate (MRR)', 'معدل إزالة المعدن (MRR)'), `${fmt(mrr)} cm³/min`]
            ];
            if (bad(rows)) return OUT_OF_RANGE();
            rows.push(steps([`n = 1000 Vc / (π D) = 1000 × ${f5(v.vc)} / (π × ${f5(v.d)}) = ${f5(n)} rpm`,
                `vf = fz × z × n = ${f5(v.fz)} × ${f5(v.z)} × ${f5(n)} = ${f5(vf)} mm/min`,
                `MRR = ae × ap × vf / 1000 = ${f5(v.ae)} × ${f5(v.ap)} × ${f5(vf)} / 1000 = ${f5(mrr)} cm³/min`]));
            if (v.ae > v.d) rows.push(warn('The radial width of cut is larger than the cutter diameter: impossible for a normal milling cutter. Check ae and D.', 'عرض القطع الشعاعي أكبر من قطر القاطع: مستحيل لقاطع تفريز عادي. راجع ae وD.'));
            rows.push(info('Milling form. For turning use D = workpiece diameter, z = 1 and fz = feed per revolution (the MRR of turning is π·D·n·f·ap, not the line above). Vc should come from the tool maker\'s data for your material; spindle power and surface finish are not calculated here.',
                'صيغة التفريز. للخراطة استعمل D = قطر الشغلة وz = 1 وfz = التغذية لكل دورة (ومعدل إزالة الخراطة هو π·D·n·f·ap وليس السطر أعلاه). خذ Vc من بيانات صانع الأداة لمادتك؛ ولا تُحسب هنا قدرة المغزل ولا نعومة السطح.'));
            return rows;
        }
    });

    /* Hardness: Brinell */
    add({
        id: 'hbw', icon: 'fa-hammer',
        title: L('Hardness — Brinell (HBW)', 'الصلادة — برينل (HBW)'),
        formula: 'HBW = 0.102 · 2F / ( π D ( D − √(D² − d²) ) )',
        inputs: [
            { id: 'f', label: L('Test force (F)', 'قوة الاختبار (F)'), ph: '3000', units: [['kgf', 9.80665], ['N', 1]], positive: true },
            { id: 'D', label: L('Ball diameter (D) [mm]', 'قطر الكرة (D) [mm]'), ph: '10', positive: true },
            { id: 'd', label: L('Mean indent diameter (d) [mm]', 'متوسط قطر الأثر (d) [mm]'), ph: '4.0', positive: true }
        ],
        compute: v => {
            if (v.d >= v.D) return fail('The indent diameter d must be smaller than the ball diameter D.', 'يجب أن يكون قطر الأثر d أصغر من قطر الكرة D.');
            const s = Math.sqrt(v.D * v.D - v.d * v.d), hb = 0.102 * 2 * v.f / (Math.PI * v.D * (v.D - s));
            const rows = [[L('Brinell hardness (HBW)', 'صلادة برينل (HBW)'), fmt(hb)]];
            if (bad(rows)) return OUT_OF_RANGE();
            rows.push([L('Rough UTS estimate (steels only)', 'تقدير تقريبي لـ UTS (للفولاذ فقط)'), `≈ ${fmt(3.45 * hb)} MPa`]);
            rows.push(steps([`√(D² − d²) = √(${f5(v.D)}² − ${f5(v.d)}²) = ${f5(s)} mm`,
                `HBW = 0.102 × 2 × ${f5(v.f)} N / (π × ${f5(v.D)} × (${f5(v.D)} − ${f5(s)})) = ${f5(hb)}`,
                `UTS ≈ 3.45 × HB = ${f5(3.45 * hb)} MPa`]));
            if (v.d < 0.24 * v.D || v.d > 0.6 * v.D) rows.push(warn(`The indent diameter is outside the valid range 0.24 D to 0.6 D (here ${f5(0.24 * v.D)} to ${f5(0.6 * v.D)} mm). Repeat the test with another force or ball.`, `قطر الأثر خارج المدى الصالح 0.24 D إلى 0.6 D (هنا ${f5(0.24 * v.D)} إلى ${f5(0.6 * v.D)} mm). أعد الاختبار بقوة أو كرة أخرى.`));
            rows.push(info('0.102 = 1/9.81 converts newtons to kgf so the number matches the traditional tables. HBW has no unit. The UTS ≈ 3.45 × HB rule is a rough estimate for most steels only; it is not valid for other metals.',
                '0.102 = 1/9.81 تحوّل النيوتن إلى kgf ليطابق الرقم الجداول التقليدية. HBW بلا وحدة. قاعدة UTS ≈ 3.45 × HB تقدير تقريبي لمعظم الفولاذ فقط، ولا تصح لمعادن أخرى.'));
            return rows;
        }
    });

    /* Hardness: Vickers */
    add({
        id: 'hv', icon: 'fa-hammer',
        title: L('Hardness — Vickers (HV)', 'الصلادة — فيكرز (HV)'),
        formula: 'HV = 0.1891 · F / d²  (F in N, d = (d₁+d₂)/2 in mm)',
        inputs: [
            { id: 'f', label: L('Test force (F)', 'قوة الاختبار (F)'), ph: '30', units: [['kgf', 9.80665], ['N', 1]], positive: true },
            { id: 'd1', label: L('Diagonal 1 (d₁) [mm]', 'القطر الأول (d₁) [mm]'), ph: '0.50', positive: true },
            { id: 'd2', label: L('Diagonal 2 (d₂) [mm]', 'القطر الثاني (d₂) [mm]'), ph: '0.50', positive: true }
        ],
        compute: v => {
            const d = (v.d1 + v.d2) / 2, hv = 0.1891 * v.f / (d * d);
            const rows = [[L('Vickers hardness (HV)', 'صلادة فيكرز (HV)'), fmt(hv)],
                [L('Approx. indent depth / minimum specimen thickness', 'عمق الأثر التقريبي / أدنى سماكة للعينة'), `${fmt(d / 7)} mm / ${fmt(1.5 * d)} mm`]];
            if (bad(rows)) return OUT_OF_RANGE();
            rows.push(steps([`d = (d₁ + d₂) / 2 = (${f5(v.d1)} + ${f5(v.d2)}) / 2 = ${f5(d)} mm`, `HV = 0.1891 × F / d² = 0.1891 × ${f5(v.f)} N / ${f5(d * d)} mm² = ${f5(hv)}`, `h ≈ d / 7 = ${f5(d / 7)} mm ;  t_min = 1.5 d = ${f5(1.5 * d)} mm`]));
            if (Math.abs(v.d1 - v.d2) / d > 0.05) rows.push(warn('The two diagonals differ by more than about 5 %: the indent may be distorted (uneven surface or anisotropy). Check the measurement.', 'القطران يختلفان بأكثر من 5% تقريباً: قد يكون الأثر مشوهاً (سطح غير مستوٍ أو تباين اتجاهي). راجع القياس.'));
            rows.push(info('0.1891 = 2 sin 68° / 9.81 (136° diamond pyramid, force in newtons; with kgf the constant is 1.8544). The specimen must be at least 1.5 d thick, otherwise the result is wrong. Conversion tables between HV, HB and HRC are not included here.',
                '0.1891 = 2 sin 68° / 9.81 (هرم ماسي 136°، القوة بالنيوتن؛ ومع kgf يكون الثابت 1.8544). يجب ألا تقل سماكة العينة عن 1.5 d وإلا كانت النتيجة خاطئة. جداول التحويل بين HV وHB وHRC غير مضمّنة هنا.'));
            return rows;
        }
    });

    /* Hardness: Rockwell C / B */
    add({
        id: 'hr', icon: 'fa-hammer',
        title: L('Hardness — Rockwell (HRC / HRB)', 'الصلادة — روكويل (HRC / HRB)'),
        formula: 'HR = N − h / 0.002  (N = 100 for HRC, 130 for HRB; h in mm)',
        inputs: [
            { id: 'h', label: L('Permanent extra depth (h)', 'زيادة العمق الدائمة (h)'), ph: '0.080', units: [['mm', 1], ['µm', 1e-3]], positive: true },
            { id: 'n', label: L('Scale constant (N): 100 = HRC, 130 = HRB', 'ثابت المقياس (N): 100 = HRC، 130 = HRB'), ph: '100', positive: true }
        ],
        compute: v => {
            const hr = v.n - v.h / 0.002;
            const rows = [[L('Rockwell hardness (HR)', 'صلادة روكويل (HR)'), fmt(hr)]];
            if (bad(rows)) return OUT_OF_RANGE();
            rows.push(steps([`h / 0.002 = ${f5(v.h)} / 0.002 = ${f5(v.h / 0.002)} scale points`, `HR = N − h / 0.002 = ${f5(v.n)} − ${f5(v.h / 0.002)} = ${f5(hr)}`]));
            if (hr < 0 || hr > 100) rows.push(warn('The result is outside 0 to 100, the range of the Rockwell number. Check h and N, or use another scale.', 'النتيجة خارج المدى 0 إلى 100 لرقم روكويل. راجع h وN أو استعمل مقياساً آخر.'));
            rows.push(info('Only the HRC (diamond cone, N = 100) and HRB (steel ball, N = 130) scales are covered; every scale point is 0.002 mm of depth. Other Rockwell scales use other constants. The number falls as the dent gets deeper.',
                'يغطي المقياسين HRC (مخروط ماسي، N = 100) وHRB (كرة فولاذية، N = 130) فقط؛ وكل نقطة مقياس تساوي 0.002 mm عمقاً. المقاييس الأخرى لروكويل لها ثوابت أخرى. ويقل الرقم كلما ازداد عمق الأثر.'));
            return rows;
        }
    });
    /* ===== Batch 2 ===== */

    /* Helical compression spring */
    add({
        id: 'spring', icon: 'fa-compass-drafting',
        title: L('Helical Compression Spring', 'النابض الحلزوني الانضغاطي'),
        formula: 'k = G d⁴ / (8 D³ Na) ;  C = D/d ;  τ = Ks · 8 F D / (π d³) ,  Ks = 1 + 0.5/C',
        inputs: [
            { id: 'g', label: L('Shear modulus (G)', 'معامل القص (G)'), ph: '79.3', units: [['GPa', 1], ['MPa', 1e-3]], positive: true },
            { id: 'd', label: L('Wire diameter (d) [mm]', 'قطر السلك (d) [mm]'), ph: '4', positive: true },
            { id: 'D', label: L('Mean coil diameter (D) [mm]', 'القطر المتوسط للملف (D) [mm]'), ph: '32', positive: true },
            { id: 'na', label: L('Active coils (Na)', 'عدد اللفات الفعّالة (Na)'), ph: '8', positive: true },
            { id: 'f', label: L('Axial load (F)', 'الحمل المحوري (F)'), ph: '200', units: [['N', 1], ['kN', 1000]], positive: true }
        ],
        compute: v => {
            if (v.D <= v.d) return fail('The mean coil diameter D must be larger than the wire diameter d.', 'يجب أن يكون القطر المتوسط D أكبر من قطر السلك d.');
            const C = v.D / v.d, k = v.g * 1000 * Math.pow(v.d, 4) / (8 * Math.pow(v.D, 3) * v.na), defl = v.f / k;
            const Ks = 1 + 0.5 / C, Kw = (4 * C - 1) / (4 * C - 4) + 0.615 / C, base = 8 * v.f * v.D / (Math.PI * Math.pow(v.d, 3));
            const rows = [
                [L('Spring index (C = D/d)', 'دليل النابض (C = D/d)'), fmt(C)],
                [L('Spring rate (k)', 'ثابت النابض (k)'), `${fmt(k)} N/mm`],
                [L('Deflection (δ = F/k)', 'الانضغاط (δ = F/k)'), `${fmt(defl)} mm`],
                [L('Shear stress (with Ks)', 'إجهاد القص (بالمعامل Ks)'), `${fmt(Ks * base)} MPa`],
                [L('Shear stress (with Wahl factor Kw)', 'إجهاد القص (بمعامل وال Kw)'), `${fmt(Kw * base)} MPa`]
            ];
            if (bad(rows)) return OUT_OF_RANGE();
            rows.push(steps([`C = D / d = ${f5(v.D)} / ${f5(v.d)} = ${f5(C)}`,
                `k = G d⁴ / (8 D³ Na) = ${f5(v.g * 1000)} × ${f5(v.d)}⁴ / (8 × ${f5(v.D)}³ × ${f5(v.na)}) = ${f5(k)} N/mm`,
                `δ = F / k = ${f5(v.f)} / ${f5(k)} = ${f5(defl)} mm`,
                `Ks = 1 + 0.5/C = ${f5(Ks)} ;  Kw = (4C−1)/(4C−4) + 0.615/C = ${f5(Kw)}`,
                `τ = K × 8 F D / (π d³) = K × ${f5(base)} MPa`]));
            if (C < 4 || C > 12) rows.push(warn('The spring index is usually between about 4 and 12. Very small C is hard to coil; very large C tends to tangle and buckle.', 'دليل النابض يتراوح عادةً بين 4 و12 تقريباً. C الصغير جداً يصعب لفّه، والكبير جداً يميل إلى التشابك والانبعاج.'));
            rows.push(info('Round wire, static load, ends already accounted for in Na (active coils only). Compare τ with the allowable shear stress of the spring material. Fatigue, buckling of long springs, solid height and surge are not checked.',
                'سلك دائري، حمل ساكن، وNa هو عدد اللفات الفعّالة فقط (الأطراف محسوبة خارجه). قارن τ مع إجهاد القص المسموح لمادة النابض. لا تُفحص هنا مسائل الكلال وانبعاج النوابض الطويلة والطول الصلب والاهتزاز.'));
            return rows;
        }
    });

    /* Reynolds number and pipe pressure drop */
    add({
        id: 'pipe', icon: 'fa-ruler-combined',
        title: L('Reynolds Number & Pipe Pressure Drop', 'رقم رينولدز وفقد الضغط في الأنبوب'),
        formula: 'Re = ρ v D / μ ;  h_f = f (L/D) v²/(2g) ;  Δp = f (L/D) ρ v²/2',
        inputs: [
            { id: 'rho', label: L('Density (ρ) [kg/m³]', 'الكثافة (ρ) [kg/m³]'), ph: '998', positive: true },
            { id: 'mu', label: L('Dynamic viscosity (μ)', 'اللزوجة الديناميكية (μ)'), ph: '0.001', units: [['Pa·s', 1], ['mPa·s (cP)', 1e-3]], positive: true },
            { id: 'v', label: L('Mean velocity (v) [m/s]', 'السرعة المتوسطة (v) [m/s]'), ph: '2', positive: true },
            { id: 'd', label: L('Inside diameter (D)', 'القطر الداخلي (D)'), ph: '50', units: [['mm', 1], ['cm', 10], ['m', 1000]], positive: true },
            { id: 'l', label: L('Pipe length (L) [m]', 'طول الأنبوب (L) [m]'), ph: '100', positive: true },
            { id: 'e', label: L('Absolute roughness (ε) [mm]', 'الخشونة المطلقة (ε) [mm]'), ph: '0.045' }
        ],
        compute: v => {
            if (v.e < 0) return fail('The roughness ε cannot be negative.', 'لا يمكن أن تكون الخشونة ε سالبة.');
            const D = v.d / 1000, Re = v.rho * v.v * D / v.mu, rel = v.e / v.d;
            const fl = 64 / Re, ft = 0.25 / Math.pow(Math.log10(rel / 3.7 + 5.74 / Math.pow(Re, 0.9)), 2);
            let f, regime, fshow;
            if (Re < 2300) { f = fl; regime = L('Laminar', 'انسيابي (صفحي)'); fshow = fmt(fl); }
            else if (Re >= 4000) { f = ft; regime = L('Turbulent', 'مضطرب'); fshow = fmt(ft); }
            else { f = ft; regime = L('Transitional (unpredictable)', 'انتقالي (غير قابل للتنبؤ)'); fshow = `${fmt(fl)} (laminar) / ${fmt(ft)} (turbulent)`; }
            const hf = f * v.l / D * v.v * v.v / (2 * 9.80665), dp = f * v.l / D * v.rho * v.v * v.v / 2;
            const rows = [
                [L('Reynolds number (Re)', 'رقم رينولدز (Re)'), fmt(Re)],
                [L('Flow regime', 'نمط الجريان'), regime],
                [L('Friction factor (f)', 'معامل الاحتكاك (f)'), fshow],
                [L('Head loss (h_f)', 'الفاقد في الضغط (h_f)'), `${fmt(hf)} m`],
                [L('Pressure drop (Δp)', 'هبوط الضغط (Δp)'), `${fmt(dp / 1000)} kPa`]
            ];
            if (bad(rows)) return OUT_OF_RANGE();
            rows.push(steps([`Re = ρ v D / μ = ${f5(v.rho)} × ${f5(v.v)} × ${f5(D)} / ${f5(v.mu)} = ${f5(Re)}`,
                Re < 2300 ? `f = 64 / Re = ${f5(fl)}` : `f = 0.25 / [log10(ε/(3.7D) + 5.74/Re^0.9)]² = ${f5(ft)}   (ε/D = ${f5(rel)})`,
                `h_f = f (L/D) v² / (2g) = ${f5(f)} × ${f5(v.l / D)} × ${f5(v.v * v.v / (2 * 9.80665))} = ${f5(hf)} m`,
                `Δp = ρ g h_f = ${f5(dp)} Pa = ${f5(dp / 1000)} kPa`]));
            if (Re >= 2300 && Re < 4000) rows.push(warn('The flow is in the transition zone: the friction factor is uncertain, both formulas are shown and the turbulent value is used for h_f and Δp.', 'الجريان في المنطقة الانتقالية: معامل الاحتكاك غير مؤكد، عُرضت الصيغتان واستُعملت قيمة المضطرب في h_f وΔp.'));
            if (Re >= 4000 && (Re < 5000 || Re > 1e8 || rel < 1e-6 || rel > 1e-2)) rows.push(warn('Outside the stated validity range of the Swamee–Jain formula (Re 5000 to 10⁸, ε/D 10⁻⁶ to 10⁻²): the result is less accurate.', 'خارج مدى صلاحية معادلة Swamee–Jain (Re من 5000 إلى 10⁸، وε/D من 10⁻⁶ إلى 10⁻²): الدقة أقل.'));
            rows.push(info('Full circular pipe, steady incompressible flow, straight pipe only. Fittings, valves, bends and elevation change are NOT included (add minor losses K·v²/2g separately). Roughness ε depends on pipe material and age.',
                'أنبوب دائري ممتلئ، جريان مستقر لمائع غير قابل للانضغاط، أنبوب مستقيم فقط. لا تشمل النتيجة الوصلات والصمامات والانحناءات وفرق الارتفاع (أضف الفواقد الثانوية K·v²/2g على حدة). تعتمد الخشونة ε على مادة الأنبوب وعمره.'));
            return rows;
        }
    });

    /* Hydraulic cylinder */
    add({
        id: 'hcyl', icon: 'fa-gears',
        title: L('Hydraulic Cylinder: Force, Speed & Power', 'الاسطوانة الهيدروليكية: القوة والسرعة والقدرة'),
        formula: 'F = p A ;  F_ret = p (A − A_rod) ;  v = Q / A ;  P = p Q',
        inputs: [
            { id: 'p', label: L('Pressure (p)', 'الضغط (p)'), ph: '160', units: [['bar', 1], ['MPa', 10], ['kPa', 0.01]], positive: true },
            { id: 'D', label: L('Bore diameter (D) [mm]', 'قطر الاسطوانة (D) [mm]'), ph: '80', positive: true },
            { id: 'd', label: L('Rod diameter (d) [mm]', 'قطر الذراع (d) [mm]'), ph: '45', positive: true },
            { id: 'q', label: L('Pump flow (Q)', 'تدفق المضخة (Q)'), ph: '20', units: [['L/min', 1], ['m³/h', 1000 / 60], ['US gpm', 3.785411784]], positive: true }
        ],
        compute: v => {
            if (v.d >= v.D) return fail('The rod diameter d must be smaller than the bore diameter D.', 'يجب أن يكون قطر الذراع d أصغر من قطر الاسطوانة D.');
            const A = Math.PI / 4 * v.D * v.D, Ar = Math.PI / 4 * (v.D * v.D - v.d * v.d);   // mm²
            const Pa = v.p * 1e5, Fe = Pa * A * 1e-6, Fr = Pa * Ar * 1e-6;                    // N
            const qmm = v.q * 1e6 / 60;                                                          // mm³/s
            const ve = qmm / A, vr = qmm / Ar, P = v.p * v.q / 600;                            // mm/s, kW
            const rows = [
                [L('Extend force (F)', 'قوة الدفع (F)'), `${fmt(Fe / 1000)} kN`],
                [L('Retract force', 'قوة السحب'), `${fmt(Fr / 1000)} kN`],
                [L('Extend speed / retract speed', 'سرعة الدفع / سرعة السحب'), `${fmt(ve)} / ${fmt(vr)} mm/s`],
                [L('Hydraulic power (P = p·Q)', 'القدرة الهيدروليكية (P = p·Q)'), `${fmt(P)} kW`]
            ];
            if (bad(rows)) return OUT_OF_RANGE();
            rows.push(steps([`A = π/4 D² = π/4 × ${f5(v.D)}² = ${f5(A)} mm² ;  A_ann = π/4 (D² − d²) = ${f5(Ar)} mm²`,
                `F = p A = ${f5(v.p)} bar × ${f5(A)} mm² = ${f5(Fe)} N ;  F_ret = p A_ann = ${f5(Fr)} N`,
                `v = Q / A = ${f5(qmm)} mm³/s / ${f5(A)} mm² = ${f5(ve)} mm/s ;  v_ret = Q / A_ann = ${f5(vr)} mm/s`,
                `P = p Q = ${f5(v.p)} bar × ${f5(v.q)} L/min / 600 = ${f5(P)} kW`]));
            rows.push(info('Ideal cylinder: no friction, no leakage, no back-pressure on the other side. Real force is lower; real speed is lower if the pump flow leaks. The smaller (annulus) area on the retract stroke gives a smaller force but a higher speed. P in kW = p [bar] × Q [L/min] / 600.',
                'اسطوانة مثالية: بلا احتكاك ولا تسرب ولا ضغط عكسي في الجهة الأخرى. القوة الفعلية أقل، والسرعة أقل إن كان في تسرب. المساحة الحلقية الأصغر أثناء السحب تعطي قوة أقل وسرعة أعلى. P بالكيلوواط = p [bar] × Q [L/min] / 600.'));
            return rows;
        }
    });

    /* Spur gear geometry */
    add({
        id: 'spur', icon: 'fa-gears',
        title: L('Spur Gear Geometry (module system)', 'هندسة الترس المستقيم (نظام المودول)'),
        formula: 'd = m z ;  da = m (z+2) ;  df = m (z−2.5) ;  p = π m ;  a = m (z₁+z₂)/2',
        inputs: [
            { id: 'm', label: L('Module (m) [mm]', 'المودول (m) [mm]'), ph: '2', positive: true },
            { id: 'z1', label: L('Teeth of pinion (z₁)', 'عدد أسنان الترس الصغير (z₁)'), ph: '20', positive: true, integer: true },
            { id: 'z2', label: L('Teeth of gear (z₂)', 'عدد أسنان الترس الكبير (z₂)'), ph: '50', positive: true, integer: true },
            { id: 'a', label: L('Pressure angle (α) [°]', 'زاوية الضغط (α) [°]'), ph: '20', positive: true }
        ],
        compute: v => {
            if (v.a >= 45) return fail('The pressure angle must be less than 45°. Standard values are 20° (14.5° and 25° also occur).', 'يجب أن تكون زاوية الضغط أقل من 45°. القيمة القياسية 20° (وتوجد 14.5° و25°).');
            const ca = Math.cos(v.a * Math.PI / 180), sa = Math.sin(v.a * Math.PI / 180);
            const d1 = v.m * v.z1, d2 = v.m * v.z2, da1 = v.m * (v.z1 + 2), da2 = v.m * (v.z2 + 2), df1 = v.m * (v.z1 - 2.5), df2 = v.m * (v.z2 - 2.5);
            const cd = v.m * (v.z1 + v.z2) / 2, p = Math.PI * v.m, i = v.z2 / v.z1, zmin = 2 / (sa * sa);
            const rows = [
                [L('Pitch diameters d₁ / d₂', 'قطرا الخطوة d₁ / d₂'), `${fmt(d1)} / ${fmt(d2)} mm`],
                [L('Outside diameters da₁ / da₂', 'القطران الخارجيان da₁ / da₂'), `${fmt(da1)} / ${fmt(da2)} mm`],
                [L('Root diameters df₁ / df₂', 'قطرا الجذر df₁ / df₂'), `${fmt(df1)} / ${fmt(df2)} mm`],
                [L('Circular pitch (p) / centre distance (a)', 'الخطوة الدائرية (p) / المسافة بين المركزين (a)'), `${fmt(p)} / ${fmt(cd)} mm`],
                [L('Base diameters db₁ / db₂', 'قطرا الأساس db₁ / db₂'), `${fmt(d1 * ca)} / ${fmt(d2 * ca)} mm`],
                [L('Ratio (i = z₂/z₁)', 'نسبة التروس (i = z₂/z₁)'), fmt(i)]
            ];
            if (bad(rows)) return OUT_OF_RANGE();
            rows.push(steps([`d = m z :  d₁ = ${f5(v.m)} × ${f5(v.z1)} = ${f5(d1)} mm ;  d₂ = ${f5(d2)} mm`,
                `da = m (z + 2) :  ${f5(da1)} / ${f5(da2)} mm ;  df = m (z − 2.5) :  ${f5(df1)} / ${f5(df2)} mm`,
                `p = π m = ${f5(p)} mm ;  a = m (z₁ + z₂) / 2 = ${f5(cd)} mm`,
                `db = d cos α = d₁ × ${f5(ca)} = ${f5(d1 * ca)} mm ;  z_min = 2 / sin²α = ${f5(zmin)}`]));
            if (v.z1 < zmin || v.z2 < zmin) rows.push(warn(`A tooth count below about ${f5(zmin)} (theoretical, for a standard full-depth rack tooth) gives undercutting of the tooth root unless profile shift is used.`, `عدد أسنان أقل من نحو ${f5(zmin)} (نظرياً، لسن قياسي كامل العمق) يسبب قطعاً سفلياً لجذر السن ما لم تُستعمل إزاحة الجانب.`));
            rows.push(info('Standard full-depth teeth: addendum = m, dedendum = 1.25 m, no profile shift, external mesh, no backlash. Real gears may use a different tooth system. Use the same module and pressure angle on both gears.',
                'أسنان قياسية كاملة العمق: الارتفاع الرأسي = m والجذري = 1.25 m، دون إزاحة جانبية، تعشيق خارجي، بلا خلوص. قد تستعمل تروس حقيقية نظام أسنان آخر. استعمل المودول وزاوية الضغط نفسيهما للترسين.'));
            return rows;
        }
    });

    /* Open belt drive */
    add({
        id: 'belt', icon: 'fa-circle-dot',
        title: L('Belt Drive (open belt)', 'نقل الحركة بالسير (سير مفتوح)'),
        formula: 'i = d₂/d₁ ;  v = π d₁ n₁ / 60000 ;  L = 2C + π(D+d)/2 + (D−d)²/(4C) ;  θ = π − 2 asin((D−d)/(2C))',
        inputs: [
            { id: 'd1', label: L('Driver pulley diameter (d₁) [mm]', 'قطر بكرة المحرك (d₁) [mm]'), ph: '100', positive: true },
            { id: 'd2', label: L('Driven pulley diameter (d₂) [mm]', 'قطر البكرة المنقادة (d₂) [mm]'), ph: '250', positive: true },
            { id: 'c', label: L('Centre distance (C) [mm]', 'المسافة بين المركزين (C) [mm]'), ph: '600', positive: true },
            { id: 'n1', label: L('Driver speed (n₁) [rpm]', 'سرعة المحرك (n₁) [rpm]'), ph: '1450', positive: true }
        ],
        compute: v => {
            const D = Math.max(v.d1, v.d2), d = Math.min(v.d1, v.d2);
            if (v.c <= (D - d) / 2) return fail('The centre distance is too small for these pulleys (it must be larger than (D − d)/2).', 'المسافة بين المركزين صغيرة جداً لهاتين البكرتين (يجب أن تكون أكبر من (D − d)/2).');
            const i = v.d2 / v.d1, n2 = v.n1 / i, vb = Math.PI * v.d1 * v.n1 / 60000;
            const Lb = 2 * v.c + Math.PI * (D + d) / 2 + (D - d) * (D - d) / (4 * v.c);
            const th = (Math.PI - 2 * Math.asin((D - d) / (2 * v.c))) * 180 / Math.PI;
            const rows = [
                [L('Speed ratio (i) / driven speed (n₂)', 'نسبة السرعة (i) / سرعة المنقاد (n₂)'), `${fmt(i)} / ${fmt(n2)} rpm`],
                [L('Belt speed (v)', 'سرعة السير (v)'), `${fmt(vb)} m/s`],
                [L('Belt length (L)', 'طول السير (L)'), `${fmt(Lb)} mm`],
                [L('Wrap angle on the small pulley (θ)', 'زاوية التماس على البكرة الصغيرة (θ)'), `${fmt(th)} °`]
            ];
            if (bad(rows)) return OUT_OF_RANGE();
            rows.push(steps([`i = d₂ / d₁ = ${f5(v.d2)} / ${f5(v.d1)} = ${f5(i)} ;  n₂ = n₁ / i = ${f5(n2)} rpm`,
                `v = π d₁ n₁ / 60000 = ${f5(vb)} m/s`,
                `L = 2C + π(D + d)/2 + (D − d)² / (4C) = ${f5(Lb)} mm   (D = ${f5(D)}, d = ${f5(d)})`,
                `θ = 180° − 2 asin((D − d) / (2C)) = ${f5(th)} °`]));
            if (th < 120) rows.push(warn('The wrap angle is below 120°: the belt may slip. A larger centre distance or a smaller ratio gives more wrap.', 'زاوية التماس أقل من 120°: قد ينزلق السير. مسافة أكبر بين المركزين أو نسبة أصغر تعطي تماساً أكبر.'));
            rows.push(info('Open belt, pulley diameters taken as the pitch diameters of the belt, ideal drive without slip or creep (real driven speed is slightly lower). Belt tension, power capacity and belt selection are not calculated. Choose the nearest standard belt length from the maker\'s table.',
                'سير مفتوح، وتُعتبر أقطار البكرات هي أقطار الخطوة للسير، ونقل مثالي بلا انزلاق ولا زحف (سرعة المنقاد الفعلية أقل قليلاً). لا تُحسب شدّة السير ولا القدرة المسموحة ولا اختيار السير. اختر أقرب طول قياسي من جدول الصانع.'));
            return rows;
        }
    });

    /* Thermal expansion and thermal stress */
    add({
        id: 'thermal', icon: 'fa-wave-square',
        title: L('Thermal Expansion & Thermal Stress', 'التمدد الحراري والإجهاد الحراري'),
        formula: 'ΔL = α L₀ ΔT ;  σ = −E α ΔT  (fully constrained)',
        inputs: [
            { id: 'a', label: L('Expansion coefficient (α) [10⁻⁶ /K]', 'معامل التمدد (α) [10⁻⁶ /K]'), ph: '12', positive: true },
            { id: 'l0', label: L('Original length (L₀)', 'الطول الأصلي (L₀)'), ph: '2', units: [['m', 1000], ['mm', 1], ['cm', 10]], positive: true },
            { id: 'dt', label: L('Temperature change (ΔT) [K or °C]', 'تغير الحرارة (ΔT) [K أو °C]'), ph: '80' },
            { id: 'e', label: L('Young\'s modulus (E)', 'معامل المرونة (E)'), ph: '200', units: [['GPa', 1], ['MPa', 1e-3]], positive: true }
        ],
        compute: v => {
            const dL = v.a * 1e-6 * v.l0 * v.dt, eps = v.a * 1e-6 * v.dt, sig = -v.e * 1000 * eps;
            const rows = [
                [L('Free expansion (ΔL)', 'التمدد الحر (ΔL)'), `${fmt(dL)} mm`],
                [L('Thermal strain (ε_th)', 'الانفعال الحراري (ε_th)'), fmt(eps)],
                [L('Stress if fully constrained (σ)', 'الإجهاد إذا كان مقيداً بالكامل (σ)'), `${fmt(sig)} MPa`]
            ];
            if (bad(rows)) return OUT_OF_RANGE();
            rows.push(steps([`ΔL = α L₀ ΔT = ${f5(v.a)}×10⁻⁶ × ${f5(v.l0)} mm × ${f5(v.dt)} = ${f5(dL)} mm`,
                `ε_th = α ΔT = ${f5(eps)}`,
                `σ = −E α ΔT = −${f5(v.e * 1000)} MPa × ${f5(eps)} = ${f5(sig)} MPa`]));
            if (v.dt === 0) rows.push(info('ΔT is zero: no expansion and no thermal stress.', 'ΔT = 0: لا تمدد ولا إجهاد حراري.'));
            else rows.push(info(v.dt > 0 ? 'Heating a fully constrained bar gives compression (negative σ); cooling gives tension.' : 'Cooling a fully constrained bar gives tension (positive σ); heating gives compression.',
                v.dt > 0 ? 'تسخين قضيب مقيّد بالكامل يعطي ضغطاً (σ سالب)، والتبريد يعطي شداً.' : 'تبريد قضيب مقيّد بالكامل يعطي شداً (σ موجب)، والتسخين يعطي ضغطاً.'));
            rows.push(info('Linear elastic behaviour, α constant over the temperature range, uniform temperature, completely rigid constraints (the real stress is lower if the supports yield). Compare |σ| with the yield strength: if it is larger the material yields and the formula is no longer valid. Take α from the material data of your alloy.',
                'سلوك مرن خطي، α ثابت في مدى الحرارة، حرارة منتظمة، قيود صلبة تماماً (الإجهاد الفعلي أقل إن لانت المساند). قارن |σ| بإجهاد الخضوع: إن كان أكبر فالمادة تخضع ولا تصح المعادلة. خذ α من بيانات سبيكتك.'));
            return rows;
        }
    });
})();
