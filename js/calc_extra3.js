/* MechAtlas — calc_extra3.js  (batch S3)
 * Additive file, loaded AFTER app.js and calc_extra.js. Adds the last ten planned calculators with calcDefs.push(...).
 * Uses only the existing globals L, fmt, calcDefs. Nothing global is defined or redefined. */
(function () {
    'use strict';
    if (typeof calcDefs === 'undefined' || typeof L === 'undefined' || typeof fmt === 'undefined') return;

    /* ---------- private helpers (same look as calc_extra.js) ---------- */
    const f5 = x => fmt(x, 5);
    const wrap = (cls, en, ar) => L(
        `<span dir="ltr" class="block text-sm font-normal ${cls}" style="text-align:left">${en}</span>`,
        `<span dir="rtl" class="block text-sm font-normal ${cls}" style="text-align:right">${ar}</span>`);
    const info = (en, ar) => [L('Assumptions / notes', 'الافتراضات / ملاحظات'), wrap('text-gray-600 dark:text-gray-300', en, ar)];
    const warn = (en, ar) => [L('⚠ Warning', '⚠ تنبيه'), wrap('text-amber-700 dark:text-amber-300', en, ar)];
    const steps = lines => {
        const h = `<span dir="ltr" class="block text-sm font-normal font-mono text-gray-700 dark:text-gray-200" style="text-align:left">${lines.join('<br>')}</span>`;
        return [L('Solution steps', 'خطوات الحل'), L(h, h)];
    };
    const fail = (en, ar) => [[L('Cannot calculate', 'تعذّر الحساب'), wrap('text-red-700 dark:text-red-300', en, ar)]];
    const bad = rows => rows.some(r => typeof r[1] === 'string' && r[1].indexOf('—') >= 0);
    const OUT = () => fail('The result is outside the numeric range (overflow). Check the values and the units.', 'النتيجة خارج المدى الرقمي (تجاوز). راجع القيم والوحدات.');
    const add = def => { if (!calcDefs.some(c => c.id === def.id)) calcDefs.push(def); };
    const G = 9.80665;
    const MM = [['mm', 1], ['cm', 10], ['m', 1000]];

    /* 13) Composite plane wall heat transfer */
    add({
        id: 'wall', icon: 'fa-compass-drafting',
        title: L('Composite Wall Heat Transfer', 'انتقال الحرارة عبر جدار مركّب'),
        formula: 'R = L/(kA) ;  R_film = 1/(hA) ;  q = (T_hot − T_cold) / ΣR ;  U = 1/(A ΣR)',
        inputs: [
            { id: 'th', label: L('Hot-side fluid temperature [°C]', 'حرارة المائع في الجهة الساخنة [°C]'), ph: '200' },
            { id: 'tc', label: L('Cold-side fluid temperature [°C]', 'حرارة المائع في الجهة الباردة [°C]'), ph: '25' },
            { id: 'hh', label: L('Hot-side film coefficient (h) [W/m²K]', 'معامل الغشاء في الجهة الساخنة (h) [W/m²K]'), ph: '50', positive: true },
            { id: 'hc', label: L('Cold-side film coefficient (h) [W/m²K]', 'معامل الغشاء في الجهة الباردة (h) [W/m²K]'), ph: '10', positive: true },
            { id: 'l1', label: L('Layer 1 thickness (L₁)', 'سماكة الطبقة 1 (L₁)'), ph: '200', units: MM, positive: true },
            { id: 'k1', label: L('Layer 1 conductivity (k₁) [W/mK]', 'التوصيل الحراري للطبقة 1 (k₁) [W/mK]'), ph: '0.7', positive: true },
            { id: 'l2', label: L('Layer 2 thickness (L₂)', 'سماكة الطبقة 2 (L₂)'), ph: '50', units: MM, positive: true },
            { id: 'k2', label: L('Layer 2 conductivity (k₂) [W/mK]', 'التوصيل الحراري للطبقة 2 (k₂) [W/mK]'), ph: '0.04', positive: true },
            { id: 'a', label: L('Wall area (A)', 'مساحة الجدار (A)'), ph: '10', units: [['m²', 1], ['cm²', 1e-4]], positive: true }
        ],
        compute: v => {
            const Rh = 1 / (v.hh * v.a), R1 = v.l1 / 1000 / (v.k1 * v.a), R2 = v.l2 / 1000 / (v.k2 * v.a), Rc = 1 / (v.hc * v.a);
            const R = Rh + R1 + R2 + Rc, dT = v.th - v.tc, q = dT / R, U = 1 / (R * v.a);
            const Ts1 = v.th - q * Rh, Ti = Ts1 - q * R1, Ts2 = Ti - q * R2;
            const rows = [
                [L('Total thermal resistance (ΣR)', 'المقاومة الحرارية الكلية (ΣR)'), `${fmt(R)} K/W`],
                [L('Heat rate (q)', 'معدل انتقال الحرارة (q)'), `${fmt(q)} W`],
                [L('Heat flux (q/A) / overall U', 'التدفق الحراري (q/A) / المعامل الكلي U'), `${fmt(q / v.a)} W/m² / ${fmt(U)} W/m²K`],
                [L('Surface temps: hot side / interface / cold side', 'حرارة الأسطح: الساخن / البيني / البارد'), `${fmt(Ts1)} / ${fmt(Ti)} / ${fmt(Ts2)} °C`]
            ];
            if (bad(rows)) return OUT();
            rows.push(steps([`R_hot = 1/(h A) = ${f5(Rh)} ;  R₁ = L₁/(k₁ A) = ${f5(R1)} ;  R₂ = L₂/(k₂ A) = ${f5(R2)} ;  R_cold = ${f5(Rc)}  K/W`,
                `ΣR = ${f5(R)} K/W ;  q = (${f5(v.th)} − ${f5(v.tc)}) / ${f5(R)} = ${f5(q)} W`,
                `T_surface,hot = T_hot − q R_hot = ${f5(Ts1)} °C ;  T_interface = ${f5(Ti)} °C ;  T_surface,cold = ${f5(Ts2)} °C`,
                `U = 1 / (A ΣR) = ${f5(U)} W/m²K`]));
            if (dT === 0) rows.push(info('The two temperatures are equal: no heat flows.', 'الحرارتان متساويتان: لا ينتقل أي حرارة.'));
            else if (dT < 0) rows.push(warn('The "cold" side is hotter than the "hot" side: the heat rate is negative, meaning heat flows the other way.', 'الجهة «الباردة» أسخن من «الساخنة»: معدل الحرارة سالب، أي أن الحرارة تنتقل بالاتجاه المعاكس.'));
            rows.push(info('Steady one-dimensional conduction through a plane wall, constant k, perfect contact between the layers (no contact resistance), radiation included in the film coefficients h. For a single layer, split it into two layers of the same material (the resistance is the same). Ignores edge effects and thermal bridges.',
                'توصيل مستقر أحادي البعد عبر جدار مستوٍ، وk ثابت، وتلامس تام بين الطبقات (بلا مقاومة تلامس)، والإشعاع مضمَّن في معاملي الغشاء h. لطبقة واحدة قسّمها إلى طبقتين من المادة نفسها (المقاومة نفسها). تُهمل تأثيرات الحواف والجسور الحرارية.'));
            return rows;
        }
    });

    /* 14) LMTD of a heat exchanger (counterflow and parallel flow) */
    const lm = (a, b) => (Math.abs(a - b) <= 1e-9 * Math.max(a, b)) ? a : (a - b) / Math.log(a / b);
    add({
        id: 'lmtd', icon: 'fa-wave-square',
        title: L('Heat Exchanger LMTD', 'فرق الحرارة اللوغاريتمي المتوسط للمبادل (LMTD)'),
        formula: 'LMTD = (ΔT₁ − ΔT₂) / ln(ΔT₁/ΔT₂) ;  Q = U A · LMTD',
        inputs: [
            { id: 'thi', label: L('Hot fluid inlet [°C]', 'دخول المائع الساخن [°C]'), ph: '120' },
            { id: 'tho', label: L('Hot fluid outlet [°C]', 'خروج المائع الساخن [°C]'), ph: '70' },
            { id: 'tci', label: L('Cold fluid inlet [°C]', 'دخول المائع البارد [°C]'), ph: '20' },
            { id: 'tco', label: L('Cold fluid outlet [°C]', 'خروج المائع البارد [°C]'), ph: '55' },
            { id: 'u', label: L('Overall coefficient (U) [W/m²K]', 'المعامل الكلي (U) [W/m²K]'), ph: '500', positive: true },
            { id: 'a', label: L('Heat transfer area (A) [m²]', 'مساحة انتقال الحرارة (A) [m²]'), ph: '2', positive: true }
        ],
        compute: v => {
            if (!(v.thi > v.tho)) return fail('The hot fluid must cool down: its inlet temperature must be higher than its outlet temperature.', 'يجب أن يبرد المائع الساخن: حرارة دخوله أعلى من حرارة خروجه.');
            if (!(v.tco > v.tci)) return fail('The cold fluid must heat up: its outlet temperature must be higher than its inlet temperature.', 'يجب أن يسخن المائع البارد: حرارة خروجه أعلى من حرارة دخوله.');
            const c1 = v.thi - v.tco, c2 = v.tho - v.tci, p1 = v.thi - v.tci, p2 = v.tho - v.tco;
            const okC = c1 > 0 && c2 > 0, okP = p1 > 0 && p2 > 0;
            if (!okC && !okP) return fail('Both arrangements are impossible with these temperatures (a temperature difference at one end is zero or negative: temperature cross). Check the four temperatures.', 'الترتيبان مستحيلان بهذه الحرارات (فرق الحرارة عند أحد الطرفين صفر أو سالب: تقاطع حراري). راجع الحرارات الأربع.');
            const lc = okC ? lm(c1, c2) : NaN, lp = okP ? lm(p1, p2) : NaN, imp = 'not possible';
            const rows = [
                [L('LMTD — counterflow', 'LMTD — تيارات متعاكسة'), okC ? `${fmt(lc)} K` : imp],
                [L('LMTD — parallel flow', 'LMTD — تيارات متوازية'), okP ? `${fmt(lp)} K` : imp],
                [L('Heat duty Q = U A LMTD — counterflow', 'الحمل الحراري Q = U A LMTD — متعاكس'), okC ? `${fmt(v.u * v.a * lc / 1000)} kW` : imp],
                [L('Heat duty Q = U A LMTD — parallel flow', 'الحمل الحراري Q = U A LMTD — متوازٍ'), okP ? `${fmt(v.u * v.a * lp / 1000)} kW` : imp]
            ];
            if (bad(rows)) return OUT();
            rows.push(steps([`Counterflow:  ΔT₁ = T_h,in − T_c,out = ${f5(c1)} K ;  ΔT₂ = T_h,out − T_c,in = ${f5(c2)} K` + (okC ? `  →  LMTD = ${f5(lc)} K` : '  → impossible'),
                `Parallel:  ΔT₁ = T_h,in − T_c,in = ${f5(p1)} K ;  ΔT₂ = T_h,out − T_c,out = ${f5(p2)} K` + (okP ? `  →  LMTD = ${f5(lp)} K` : '  → impossible'),
                `Q = U A LMTD = ${f5(v.u)} × ${f5(v.a)} × LMTD`]));
            if (okC && okP && lc > lp) rows.push(info('For the same four temperatures the counterflow arrangement has the larger LMTD, so it needs less area for the same duty.', 'عند الحرارات الأربع نفسها يملك الترتيب المتعاكس LMTD أكبر، فيحتاج مساحة أقل للحمل نفسه.'));
            rows.push(info('Single-pass double-pipe type (pure counterflow or pure parallel flow), constant U, no heat loss to the surroundings, no phase change. For shell-and-tube multipass or cross-flow exchangers LMTD must be multiplied by a correction factor F (not included). If ΔT₁ = ΔT₂ the LMTD equals that common value. The temperatures must agree with a heat balance m·cp·ΔT on each side (not checked here).',
                'مبادل أنبوب مزدوج أحادي المسار (متعاكس صرف أو متوازٍ صرف)، وU ثابت، ولا فقد حراري للمحيط، ولا تغير طور. للمبادلات متعددة المسارات أو متقاطعة التيار يُضرب LMTD بمعامل تصحيح F (غير مضمَّن). إذا كان ΔT₁ = ΔT₂ فإن LMTD يساوي هذه القيمة المشتركة. يجب أن تتفق الحرارات مع موازنة حرارية m·cp·ΔT لكل جانب (لا تُفحص هنا).'));
            return rows;
        }
    });

    /* 15) Natural frequency and damping of a single-degree-of-freedom system */
    add({
        id: 'natfreq', icon: 'fa-wave-square',
        title: L('Natural Frequency & Damping (1 DOF)', 'التردد الطبيعي والإخماد (درجة حرية واحدة)'),
        formula: 'ω_n = √(k/m) ;  f_n = ω_n/(2π) ;  ζ = c / (2√(k m)) ;  ω_d = ω_n √(1−ζ²)',
        inputs: [
            { id: 'k', label: L('Stiffness (k)', 'الصلابة (k)'), ph: '50000', units: [['N/m', 1], ['N/mm', 1000], ['kN/m', 1000]], positive: true },
            { id: 'm', label: L('Mass (m)', 'الكتلة (m)'), ph: '20', units: [['kg', 1], ['g', 1e-3], ['tonne', 1000]], positive: true },
            { id: 'c', label: L('Viscous damping (c) [N·s/m]  (0 = undamped)', 'التخميد اللزج (c) [N·s/m]  (0 = بلا تخميد)'), ph: '200' }
        ],
        compute: v => {
            if (v.c < 0) return fail('The damping coefficient c cannot be negative.', 'لا يمكن أن يكون معامل التخميد c سالباً.');
            const w = Math.sqrt(v.k / v.m), fn = w / (2 * Math.PI), T = 1 / fn, cc = 2 * Math.sqrt(v.k * v.m), z = v.c / cc;
            const rows = [
                [L('Natural frequency ω_n / f_n', 'التردد الطبيعي ω_n / f_n'), `${fmt(w)} rad/s / ${fmt(fn)} Hz`],
                [L('Natural period (T)', 'الدور الطبيعي (T)'), `${fmt(T)} s`],
                [L('Critical damping (c_c) / damping ratio (ζ)', 'التخميد الحرج (c_c) / نسبة التخميد (ζ)'), `${fmt(cc)} N·s/m / ${fmt(z)}`]
            ];
            if (z > 0 && z < 1) {
                const wd = w * Math.sqrt(1 - z * z);
                rows.push([L('Damped frequency (f_d)', 'التردد المخمَّد (f_d)'), `${fmt(wd / (2 * Math.PI))} Hz`]);
                rows.push([L('Log decrement (δ) / amplification at resonance 1/(2ζ)', 'التناقص اللوغاريتمي (δ) / التضخيم عند الرنين 1/(2ζ)'), `${fmt(2 * Math.PI * z / Math.sqrt(1 - z * z))} / ${fmt(1 / (2 * z))}`]);
            }
            rows.push([L('Type of motion', 'نوع الحركة'), z === 0 ? L('Undamped — oscillates forever', 'بلا تخميد — يهتز إلى ما لا نهاية') : z < 1 ? L('Underdamped — decaying oscillation', 'تخميد ناقص — اهتزاز متناقص') : z === 1 ? L('Critically damped', 'تخميد حرج') : L('Overdamped — no oscillation', 'تخميد زائد — لا اهتزاز')]);
            if (bad(rows)) return OUT();
            rows.push(steps([`ω_n = √(k/m) = √(${f5(v.k)} / ${f5(v.m)}) = ${f5(w)} rad/s ;  f_n = ω_n / 2π = ${f5(fn)} Hz ;  T = 1/f_n = ${f5(T)} s`,
                `c_c = 2√(k m) = ${f5(cc)} N·s/m ;  ζ = c / c_c = ${f5(z)}`].concat(z > 0 && z < 1 ? [`ω_d = ω_n √(1 − ζ²) = ${f5(w * Math.sqrt(1 - z * z))} rad/s ;  δ = 2πζ/√(1−ζ²) ;  resonance amplification = 1/(2ζ) = ${f5(1 / (2 * z))}`] : [])));
            if (z === 0) rows.push(warn('With no damping the response at resonance is theoretically unbounded: any excitation at f_n is dangerous.', 'بلا تخميد تكون الاستجابة عند الرنين غير محدودة نظرياً: أي إثارة عند f_n خطرة.'));
            rows.push(info('Linear single-degree-of-freedom system: one rigid mass on a massless linear spring with viscous damping. For a shaft or beam use its equivalent stiffness k and equivalent mass m. Check that the operating frequency is well away from f_n. Units: k in N/m, m in kg.',
                'منظومة خطية بدرجة حرية واحدة: كتلة صلبة واحدة على نابض خطي عديم الكتلة مع تخميد لزج. للعمود أو العارضة استعمل الصلابة المكافئة k والكتلة المكافئة m. تأكد أن تردد التشغيل بعيد عن f_n. الوحدات: k بـN/m وm بـkg.'));
            return rows;
        }
    });

    /* 16) Flywheel sizing */
    add({
        id: 'flywheel', icon: 'fa-gears',
        title: L('Flywheel Sizing', 'تصميم دولاب الموازنة'),
        formula: 'I = ΔE / (C_s ω₀²) ;  E_k = ½ I ω₀² ;  disc: I = ½ ρ π b r⁴',
        inputs: [
            { id: 'de', label: L('Energy fluctuation per cycle (ΔE)', 'تذبذب الطاقة في الدورة (ΔE)'), ph: '800', units: [['J', 1], ['kJ', 1000]], positive: true },
            { id: 'n', label: L('Mean speed (n) [rpm]', 'السرعة المتوسطة (n) [rpm]'), ph: '1200', positive: true },
            { id: 'cs', label: L('Coefficient of speed fluctuation (C_s)', 'معامل تذبذب السرعة (C_s)'), ph: '0.03', positive: true },
            { id: 'd', label: L('Chosen disc diameter (D)', 'قطر القرص المختار (D)'), ph: '500', units: [['mm', 1], ['cm', 10], ['m', 1000]], positive: true },
            { id: 'rho', label: L('Material density (ρ)', 'كثافة المادة (ρ)'), ph: '7200', units: [['kg/m³', 1], ['g/cm³', 1000]], positive: true }
        ],
        compute: v => {
            if (v.cs >= 1) return fail('C_s must be less than 1 (it is the fractional speed variation, for example 0.03 = 3 %).', 'يجب أن يكون C_s أقل من 1 (هو نسبة تغير السرعة، مثلاً 0.03 = 3%).');
            const w = 2 * Math.PI * v.n / 60, I = v.de / (v.cs * w * w), Ek = 0.5 * I * w * w;
            const r = v.d / 2000, b = 2 * I / (v.rho * Math.PI * Math.pow(r, 4)), m = v.rho * Math.PI * r * r * b, vr = w * r;
            const rows = [
                [L('Mean angular speed (ω₀)', 'السرعة الزاوية المتوسطة (ω₀)'), `${fmt(w)} rad/s`],
                [L('Required moment of inertia (I)', 'عزم القصور الذاتي المطلوب (I)'), `${fmt(I)} kg·m²`],
                [L('Kinetic energy at mean speed', 'الطاقة الحركية عند السرعة المتوسطة'), `${fmt(Ek)} J`],
                [L('Solid disc: thickness (b) / mass (m)', 'قرص مصمت: السماكة (b) / الكتلة (m)'), `${fmt(b * 1000)} mm / ${fmt(m)} kg`],
                [L('Rim speed (v = ω₀ r)', 'السرعة المحيطية (v = ω₀ r)'), `${fmt(vr)} m/s`]
            ];
            if (bad(rows)) return OUT();
            rows.push(steps([`ω₀ = 2π n / 60 = ${f5(w)} rad/s`, `I = ΔE / (C_s ω₀²) = ${f5(v.de)} / (${f5(v.cs)} × ${f5(w)}²) = ${f5(I)} kg·m²`,
                `Solid disc: I = ½ m r² = ½ ρ π b r⁴  →  b = 2 I / (ρ π r⁴) = ${f5(b * 1000)} mm ;  m = ρ π r² b = ${f5(m)} kg`, `v = ω₀ r = ${f5(w)} × ${f5(r)} = ${f5(vr)} m/s`]));
            if (b > r) rows.push(warn('The disc would be thicker than its radius: it behaves less like a thin disc. Choose a larger diameter (a rim-type wheel puts the mass farther out).', 'القرص سيكون أسمك من نصف قطره: ولن يتصرف كقرص رقيق. اختر قطراً أكبر (والدولاب ذو الطوق يضع الكتلة أبعد).'));
            rows.push(info('ΔE is the maximum energy fluctuation per cycle (from the turning-moment diagram or the load and driver curves), C_s = (ω_max − ω_min)/ω₀, mean speed ω₀. The inertia of the rest of the rotating parts is ignored (it lowers the size needed). The rim speed is shown but NOT checked against the material\'s bursting limit: do this separately, together with the stress in the rim and the hub and the key. The thickness b assumes a plain solid disc of the chosen D.',
                'ΔE هي أقصى تذبذب للطاقة في الدورة (من مخطط العزم الدوراني أو منحنيي الحمل والمحرك)، وC_s = (ω_max − ω_min)/ω₀، وω₀ السرعة المتوسطة. يُهمل قصور بقية الأجزاء الدوارة (وهو يقلل الحجم المطلوب). تُعرض السرعة المحيطية لكن لا تُقارن بحد التمزق للمادة: افحصها على حدة مع إجهاد الطوق والمحور والخابور. السماكة b تفترض قرصاً مصمتاً بسيطاً بالقطر D المختار.'));
            return rows;
        }
    });

    /* 17) Unbalance */
    add({
        id: 'unbal', icon: 'fa-circle-dot',
        title: L('Rotor Unbalance & Balance Grade', 'عدم اتزان الدوار ودرجة الاتزان'),
        formula: 'F = m_u r ω² ;  U = m_u r ;  U_per = 9549 G M / n  [g·mm]',
        inputs: [
            { id: 'mu', label: L('Unbalance mass (m_u) [g]', 'كتلة عدم الاتزان (m_u) [g]'), ph: '5', positive: true },
            { id: 'r', label: L('Radius of that mass (r) [mm]', 'نصف قطر تلك الكتلة (r) [mm]'), ph: '100', positive: true },
            { id: 'n', label: L('Speed (n) [rpm]', 'السرعة (n) [rpm]'), ph: '3000', positive: true },
            { id: 'M', label: L('Rotor mass (M) [kg]', 'كتلة الدوار (M) [kg]'), ph: '20', positive: true },
            { id: 'g', label: L('Balance quality grade (G) [mm/s]', 'درجة جودة الاتزان (G) [mm/s]'), ph: '6.3', positive: true }
        ],
        compute: v => {
            const w = 2 * Math.PI * v.n / 60, U = v.mu * v.r, F = v.mu / 1000 * v.r / 1000 * w * w;
            const Up = 9549.296585513721 * v.g * v.M / v.n, ep = 1000 * v.g / w;
            const rows = [
                [L('Centrifugal force from the unbalance (F)', 'قوة الطرد المركزي الناتجة (F)'), `${fmt(F)} N  (${fmt(F / (v.M * G))} × rotor weight)`],
                [L('Unbalance present (U = m_u·r)', 'عدم الاتزان الموجود (U = m_u·r)'), `${fmt(U)} g·mm`],
                [L('Permissible residual unbalance (U_per)', 'عدم الاتزان المتبقي المسموح (U_per)'), `${fmt(Up)} g·mm`],
                [L('Permissible eccentricity (e_per)', 'اللامركزية المسموحة (e_per)'), `${fmt(ep)} µm`],
                [L('Verdict', 'الحكم'), U <= Up ? L(`Within grade G ${f5(v.g)} (${fmt(U / Up * 100)} % of the limit)`, `ضمن الدرجة G ${f5(v.g)} (${fmt(U / Up * 100)}% من الحد)`) : L(`Exceeds grade G ${f5(v.g)} (${fmt(U / Up * 100)} % of the limit): balance the rotor`, `يتجاوز الدرجة G ${f5(v.g)} (${fmt(U / Up * 100)}% من الحد): وازن الدوار`)]
            ];
            if (bad(rows)) return OUT();
            rows.push(steps([`ω = 2π n / 60 = ${f5(w)} rad/s`, `F = m_u r ω² = ${f5(v.mu / 1000)} kg × ${f5(v.r / 1000)} m × ${f5(w)}² = ${f5(F)} N`,
                `U = m_u r = ${f5(v.mu)} × ${f5(v.r)} = ${f5(U)} g·mm`, `U_per = 9549 G M / n = 9549 × ${f5(v.g)} × ${f5(v.M)} / ${f5(v.n)} = ${f5(Up)} g·mm ;  e_per = G/ω = ${f5(ep)} µm`]));
            rows.push(info('A single concentrated unbalance mass on a rigid rotor. G is the balance quality grade (e_per × ω in mm/s, for example G 2.5, G 6.3, G 16) chosen from the standard for your machine type; U_per applies to the whole rotor, and how it is split between the correction planes is set by the standard (not covered here). Flexible rotors running near a critical speed need a more detailed method. The force F is a rotating force that loads the bearings and the foundation.',
                'كتلة عدم اتزان مركّزة واحدة على دوار صلب. G درجة جودة الاتزان (e_per × ω بوحدة mm/s، مثل G 2.5 وG 6.3 وG 16) تُختار من المواصفة حسب نوع الآلة؛ وU_per للدوار كله، وتوزيعه على مستويي التصحيح تحدده المواصفة (غير مشمول هنا). الدوارات المرنة قرب السرعة الحرجة تحتاج طريقة أدق. القوة F قوة دوّارة تحمّل المحامل والأساس.'));
            return rows;
        }
    });

    /* 18) Material mass: round bar / tube and rectangular bar / plate */
    const massRows = (volMm3, v, n) => {
        const dens = v.rho, vol = volMm3 / 1e9, m1 = vol * dens, mt = m1 * n;
        return { vol, m1, mt, rows: [
            [L('Volume per piece', 'الحجم للقطعة الواحدة'), `${fmt(volMm3 / 1000)} cm³`],
            [L('Mass per piece', 'الكتلة للقطعة الواحدة'), `${fmt(m1)} kg`],
            [L('Total mass (all pieces)', 'الكتلة الكلية (كل القطع)'), `${fmt(mt)} kg`],
            [L('Total weight (m·g)', 'الوزن الكلي (m·g)'), `${fmt(mt * G)} N`]
        ] };
    };
    const densNote = info('Mass = density × volume. Typical densities: steel about 7850 kg/m³, aluminium about 2700, copper about 8960 (check the datasheet of your alloy; 1 g/cm³ = 1000 kg/m³). Nominal dimensions only: no machining allowance, tolerance, coating or weld metal.',
        'الكتلة = الكثافة × الحجم. كثافات نموذجية: الفولاذ نحو 7850 kg/m³ والألمنيوم نحو 2700 والنحاس نحو 8960 (راجع بيانات سبيكتك؛ 1 g/cm³ = 1000 kg/m³). أبعاد اسمية فقط: دون سماح تشغيل أو تفاوت أو طلاء أو معدن لحام.');
    add({
        id: 'massr', icon: 'fa-ruler-combined',
        title: L('Material Mass — Round Bar / Tube', 'كتلة المادة — قضيب دائري / أنبوب'),
        formula: 'V = π (D² − d²) L / 4 ;  m = ρ V',
        inputs: [
            { id: 'do', label: L('Outer diameter (D) [mm]', 'القطر الخارجي (D) [mm]'), ph: '50', positive: true },
            { id: 'di', label: L('Inner diameter (d) [mm]  (0 = solid bar)', 'القطر الداخلي (d) [mm]  (0 = قضيب مصمت)'), ph: '0' },
            { id: 'l', label: L('Length (L)', 'الطول (L)'), ph: '1', units: [['m', 1000], ['mm', 1], ['cm', 10]], positive: true },
            { id: 'n', label: L('Number of pieces', 'عدد القطع'), ph: '1', positive: true, integer: true },
            { id: 'rho', label: L('Density (ρ)', 'الكثافة (ρ)'), ph: '7850', units: [['kg/m³', 1], ['g/cm³', 1000]], positive: true }
        ],
        compute: v => {
            if (v.di < 0) return fail('The inner diameter cannot be negative (use 0 for a solid bar).', 'لا يمكن أن يكون القطر الداخلي سالباً (استعمل 0 للقضيب المصمت).');
            if (v.di >= v.do) return fail('The inner diameter must be smaller than the outer diameter.', 'يجب أن يكون القطر الداخلي أصغر من القطر الخارجي.');
            const V = Math.PI * (v.do * v.do - v.di * v.di) * v.l / 4, o = massRows(V, v, v.n);
            const rows = o.rows.slice();
            rows.splice(2, 0, [L('Mass per metre', 'الكتلة لكل متر'), `${fmt(o.m1 / (v.l / 1000))} kg/m`]);
            if (bad(rows)) return OUT();
            rows.push(steps([`V = π (D² − d²) L / 4 = π (${f5(v.do)}² − ${f5(v.di)}²) × ${f5(v.l)} / 4 = ${f5(V)} mm³ = ${f5(o.vol)} m³`, `m = ρ V = ${f5(v.rho)} × ${f5(o.vol)} = ${f5(o.m1)} kg ;  total = ${f5(o.m1)} × ${f5(v.n)} = ${f5(o.mt)} kg`]), densNote);
            return rows;
        }
    });
    add({
        id: 'massb', icon: 'fa-ruler-combined',
        title: L('Material Mass — Rectangular Bar / Plate', 'كتلة المادة — قضيب مستطيل / صفيحة'),
        formula: 'V = w h L ;  m = ρ V',
        inputs: [
            { id: 'w', label: L('Width (w)', 'العرض (w)'), ph: '100', units: MM, positive: true },
            { id: 'h', label: L('Thickness / height (h)', 'السماكة / الارتفاع (h)'), ph: '10', units: MM, positive: true },
            { id: 'l', label: L('Length (L)', 'الطول (L)'), ph: '2', units: [['m', 1000], ['mm', 1], ['cm', 10]], positive: true },
            { id: 'n', label: L('Number of pieces', 'عدد القطع'), ph: '1', positive: true, integer: true },
            { id: 'rho', label: L('Density (ρ)', 'الكثافة (ρ)'), ph: '7850', units: [['kg/m³', 1], ['g/cm³', 1000]], positive: true }
        ],
        compute: v => {
            const V = v.w * v.h * v.l, o = massRows(V, v, v.n), rows = o.rows.slice();
            rows.splice(2, 0, [L('Mass per metre', 'الكتلة لكل متر'), `${fmt(o.m1 / (v.l / 1000))} kg/m`]);
            if (bad(rows)) return OUT();
            rows.push(steps([`V = w h L = ${f5(v.w)} × ${f5(v.h)} × ${f5(v.l)} = ${f5(V)} mm³ = ${f5(o.vol)} m³`, `m = ρ V = ${f5(v.rho)} × ${f5(o.vol)} = ${f5(o.m1)} kg ;  total = ${f5(o.m1)} × ${f5(v.n)} = ${f5(o.mt)} kg`]), densNote);
            return rows;
        }
    });

    /* 19) Parallel (sunk) key check */
    add({
        id: 'key', icon: 'fa-screwdriver-wrench',
        title: L('Parallel Key Check (shear & bearing)', 'فحص الخابور المتوازي (قص وسحق)'),
        formula: 'F = 2T/d ;  τ = F/(w L) ;  σ_b = F / ((h/2) L)',
        inputs: [
            { id: 't', label: L('Transmitted torque (T)', 'العزم المنقول (T)'), ph: '200', units: [['N·m', 1], ['N·mm', 1e-3]], positive: true },
            { id: 'd', label: L('Shaft diameter (d) [mm]', 'قطر العمود (d) [mm]'), ph: '40', positive: true },
            { id: 'w', label: L('Key width (w) [mm]', 'عرض الخابور (w) [mm]'), ph: '12', positive: true },
            { id: 'h', label: L('Key height (h) [mm]', 'ارتفاع الخابور (h) [mm]'), ph: '8', positive: true },
            { id: 'l', label: L('Key length (L) [mm]', 'طول الخابور (L) [mm]'), ph: '50', positive: true },
            { id: 'ta', label: L('Allowable shear stress of the key (τ_allow) [MPa]', 'إجهاد القص المسموح للخابور (τ_allow) [MPa]'), ph: '60', positive: true },
            { id: 'sa', label: L('Allowable bearing (crushing) stress (σ_allow) [MPa]', 'إجهاد السحق المسموح (σ_allow) [MPa]'), ph: '120', positive: true }
        ],
        compute: v => {
            if (v.w >= v.d || v.h >= v.d) return fail('The key width and height must be smaller than the shaft diameter.', 'يجب أن يكون عرض الخابور وارتفاعه أصغر من قطر العمود.');
            const Tn = v.t * 1000, F = 2 * Tn / v.d, tau = F / (v.w * v.l), sb = F / ((v.h / 2) * v.l);
            const ns = v.ta / tau, nb = v.sa / sb, Ls = F / (v.w * v.ta), Lb = F / ((v.h / 2) * v.sa);
            const rows = [
                [L('Force on the key (F = 2T/d)', 'القوة على الخابور (F = 2T/d)'), `${fmt(F / 1000)} kN`],
                [L('Shear stress (τ) / bearing stress (σ_b)', 'إجهاد القص (τ) / إجهاد السحق (σ_b)'), `${fmt(tau)} / ${fmt(sb)} MPa`],
                [L('Safety factor: shear / bearing', 'معامل الأمان: قص / سحق'), `${fmt(ns)} / ${fmt(nb)}`],
                [L('Minimum key length: shear / bearing', 'أدنى طول للخابور: قص / سحق'), `${fmt(Ls)} / ${fmt(Lb)} mm`],
                [L('Verdict', 'الحكم'), Math.min(ns, nb) >= 1 ? L(`Acceptable for the allowables given (governing: ${ns <= nb ? 'shear' : 'bearing'})`, `مقبول بحسب المسموحات المعطاة (الحاكم: ${ns <= nb ? 'القص' : 'السحق'})`) : L(`Not acceptable (governing: ${ns <= nb ? 'shear' : 'bearing'}): lengthen or change the key`, `غير مقبول (الحاكم: ${ns <= nb ? 'القص' : 'السحق'}): زد طول الخابور أو غيّره`)]
            ];
            if (bad(rows)) return OUT();
            rows.push(steps([`F = 2T / d = 2 × ${f5(Tn)} N·mm / ${f5(v.d)} mm = ${f5(F)} N`, `τ = F / (w L) = ${f5(F)} / (${f5(v.w)} × ${f5(v.l)}) = ${f5(tau)} MPa`,
                `σ_b = F / ((h/2) L) = ${f5(F)} / (${f5(v.h / 2)} × ${f5(v.l)}) = ${f5(sb)} MPa`, `L_min,shear = F / (w τ_allow) = ${f5(Ls)} mm ;  L_min,bearing = F / ((h/2) σ_allow) = ${f5(Lb)} mm`]));
            rows.push(info('Rectangular parallel (sunk) key, torque transmitted by the side faces, load spread uniformly along the length (a rough model). The allowable stresses depend on the weaker of the key, shaft and hub materials: take them from your material data and design rule. Keyway stress concentration and the shaft check are separate. Tapered (wedge) keys carry torque partly by friction and need a different analysis: NOT covered here. Standard key sizes for a given shaft diameter come from the key standard (not included).',
                'خابور متوازٍ مستطيل (غاطس)، العزم ينتقل بالوجهين الجانبيين، والحمل موزع بانتظام على الطول (نموذج تقريبي). تتوقف الإجهادات المسموحة على أضعف المواد: الخابور أو العمود أو الصرة؛ خذها من بيانات مادتك وقاعدة التصميم. تركّز الإجهاد في مجرى الخابور وفحص العمود أمران منفصلان. الخوابير المخروطية (الأوتاد) تنقل العزم جزئياً بالاحتكاك وتحتاج تحليلاً مختلفاً: غير مشمولة هنا. أبعاد الخابور القياسية لقطر عمود معين تؤخذ من مواصفة الخوابير (غير مضمّنة).'));
            return rows;
        }
    });

    /* 20) Tensile test analysis */
    add({
        id: 'tensile', icon: 'fa-wave-square',
        title: L('Tensile Test Analysis', 'تحليل نتائج اختبار الشد'),
        formula: 'σ = F/A₀ ;  %EL = (L_f − L₀)/L₀ ×100 ;  %RA = (A₀ − A_f)/A₀ ×100 ;  E = σ/ε (elastic)',
        inputs: [
            { id: 'd0', label: L('Original diameter (d₀) [mm]', 'القطر الأصلي (d₀) [mm]'), ph: '12.5', positive: true },
            { id: 'l0', label: L('Original gauge length (L₀) [mm]', 'طول القياس الأصلي (L₀) [mm]'), ph: '50', positive: true },
            { id: 'fy', label: L('Yield load (0.2 % offset)', 'حمل الخضوع (بإزاحة 0.2%)'), ph: '44200', units: [['N', 1], ['kN', 1000]], positive: true },
            { id: 'fm', label: L('Maximum load', 'الحمل الأقصى'), ph: '66300', units: [['N', 1], ['kN', 1000]], positive: true },
            { id: 'lf', label: L('Final gauge length after fracture (L_f) [mm]', 'طول القياس النهائي بعد الكسر (L_f) [mm]'), ph: '62.5', positive: true },
            { id: 'df', label: L('Final diameter at the neck (d_f) [mm]', 'القطر النهائي عند الاختناق (d_f) [mm]'), ph: '8', positive: true },
            { id: 'fe', label: L('A load in the straight elastic part', 'حمل في الجزء المرن المستقيم'), ph: '20000', units: [['N', 1], ['kN', 1000]], positive: true },
            { id: 'de', label: L('Elongation at that load [mm]', 'الاستطالة عند ذلك الحمل [mm]'), ph: '0.0407', positive: true }
        ],
        compute: v => {
            if (v.fm < v.fy) return fail('The maximum load cannot be smaller than the yield load.', 'لا يمكن أن يكون الحمل الأقصى أصغر من حمل الخضوع.');
            if (v.fe > v.fy) return fail('The elastic-region load must not exceed the yield load.', 'يجب ألا يتجاوز حمل الجزء المرن حمل الخضوع.');
            const A0 = Math.PI * v.d0 * v.d0 / 4, Af = Math.PI * v.df * v.df / 4, sy = v.fy / A0, su = v.fm / A0;
            const el = (v.lf - v.l0) / v.l0 * 100, ra = (A0 - Af) / A0 * 100, E = (v.fe / A0) / (v.de / v.l0) / 1000;
            const rows = [
                [L('Original area (A₀)', 'المساحة الأصلية (A₀)'), `${fmt(A0)} mm²`],
                [L('Yield strength (σ_y) / tensile strength (σ_u)', 'إجهاد الخضوع (σ_y) / مقاومة الشد (σ_u)'), `${fmt(sy)} / ${fmt(su)} MPa`],
                [L('Elongation (%EL) / reduction of area (%RA)', 'الاستطالة (%EL) / نقصان المساحة (%RA)'), `${fmt(el)} % / ${fmt(ra)} %`],
                [L('Elastic modulus (E)', 'معامل المرونة (E)'), `${fmt(E)} GPa`],
                [L('σ_y / σ_u ratio', 'نسبة σ_y / σ_u'), fmt(sy / su)]
            ];
            if (bad(rows)) return OUT();
            rows.push(steps([`A₀ = π d₀² / 4 = ${f5(A0)} mm² ;  A_f = π d_f² / 4 = ${f5(Af)} mm²`, `σ_y = F_y / A₀ = ${f5(v.fy)} / ${f5(A0)} = ${f5(sy)} MPa ;  σ_u = F_max / A₀ = ${f5(su)} MPa`,
                `%EL = (L_f − L₀) / L₀ × 100 = ${f5(el)} % ;  %RA = (A₀ − A_f) / A₀ × 100 = ${f5(ra)} %`, `E = (F_e / A₀) / (ΔL_e / L₀) = ${f5(v.fe / A0)} MPa / ${f5(v.de / v.l0)} = ${f5(E * 1000)} MPa = ${f5(E)} GPa`]));
            if (v.lf < v.l0) rows.push(warn('The final gauge length is shorter than the original: check L_f.', 'طول القياس النهائي أقصر من الأصلي: راجع L_f.'));
            if (v.df > v.d0) rows.push(warn('The neck diameter is larger than the original diameter: check d_f.', 'قطر الاختناق أكبر من القطر الأصلي: راجع d_f.'));
            if (E < 1 || E > 1200) rows.push(warn('The elastic modulus is outside the range of ordinary engineering materials (about 1 to 1200 GPa). Check the elastic load and elongation (extensometer readings are needed; machine crosshead movement gives too small an E).', 'معامل المرونة خارج مدى المواد الهندسية المعتادة (نحو 1 إلى 1200 GPa). راجع حمل المرن واستطالته (يلزم مقياس استطالة؛ وحركة رأس الآلة تعطي E أصغر من الحقيقي).'));
            rows.push(info('Engineering stress and strain, based on the ORIGINAL area and length (not true stress). The yield load must come from the 0.2 % offset construction on the load–elongation curve; %EL depends on the gauge length used, so quote L₀ with it. The elastic pair of readings must lie on the straight part of the curve. Round test bar; for a flat specimen replace A₀ by width × thickness.',
                'إجهاد وانفعال هندسيان، مبنيان على المساحة والطول الأصليين (ليسا الحقيقيين). يجب أن يؤخذ حمل الخضوع من إنشاء الإزاحة 0.2% على منحنى الحمل–الاستطالة؛ و%EL تتوقف على طول القياس فاذكر L₀ معه. وقراءتا الجزء المرن يجب أن تقعا على الجزء المستقيم من المنحنى. عينة دائرية؛ وللعينة المسطحة استبدل A₀ بالعرض × السماكة.'));
            return rows;
        }
    });

    /* 21) Punching / blanking force */
    add({
        id: 'punch', icon: 'fa-hammer',
        title: L('Punching / Blanking Force', 'قوة القص الثاقب (التثقيب والقطع)'),
        formula: 'F = L_cut · t · τ_s ;  L_cut = π d (round hole) or 2(a + b) (rectangle)',
        inputs: [
            { id: 'p', label: L('Cut perimeter per stroke (L_cut) [mm]', 'محيط القطع في الضربة (L_cut) [mm]'), ph: '157.08', positive: true },
            { id: 't', label: L('Sheet thickness (t) [mm]', 'سماكة الصفيحة (t) [mm]'), ph: '2', positive: true },
            { id: 'ts', label: L('Shear strength of the sheet (τ_s)', 'مقاومة القص للصفيحة (τ_s)'), ph: '300', units: [['MPa', 1], ['Pa', 1e-6]], positive: true }
        ],
        compute: v => {
            const F = v.p * v.t * v.ts;
            const rows = [
                [L('Maximum punching force (F)', 'أقصى قوة تثقيب (F)'), `${fmt(F / 1000)} kN`],
                [L('Force in tonnes-force', 'القوة بالطن-قوة'), `${fmt(F / 1000 / G)} tf`],
                [L('Shear area (L_cut × t)', 'مساحة القص (L_cut × t)'), `${fmt(v.p * v.t)} mm²`]
            ];
            if (bad(rows)) return OUT();
            rows.push(steps([`A_shear = L_cut × t = ${f5(v.p)} × ${f5(v.t)} = ${f5(v.p * v.t)} mm²`, `F = A_shear × τ_s = ${f5(v.p * v.t)} × ${f5(v.ts)} = ${f5(F)} N = ${f5(F / 1000)} kN = ${f5(F / 1000 / G)} tf`]));
            rows.push(info('The force of cutting the whole perimeter at once by a flat punch: the maximum force, reached when the sheet shears through. Stripping force, die clearance, a shear-angled (stepped) punch that lowers the peak force, and the press energy (work) are not calculated. Take the shear strength τ_s of the sheet from material data (do not substitute the tensile strength). Choose a press with a rated capacity above F. Perimeter examples: round hole π·d; rectangle 2(a + b).',
                'قوة قطع المحيط كله دفعة واحدة بمثقب مسطح: أقصى قوة تُبلغ عند انقطاع الصفيحة بالقص. لا تُحسب قوة التجريد ولا خلوص القالب ولا المثقب المائل (المتدرج) الذي يخفض ذروة القوة ولا طاقة المكبس (الشغل). خذ مقاومة القص τ_s من بيانات المادة (لا تضع مقاومة الشد بدلها). اختر مكبساً سعته المقدّرة أكبر من F. أمثلة المحيط: ثقب دائري π·d؛ مستطيل 2(a + b).'));
            return rows;
        }
    });

    /* 22) Pump power */
    add({
        id: 'pump', icon: 'fa-gears',
        title: L('Pump Power', 'قدرة المضخة'),
        formula: 'P_hyd = ρ g Q H ;  P_shaft = P_hyd / η_pump ;  P_elec = P_shaft / η_motor',
        inputs: [
            { id: 'q', label: L('Flow rate (Q)', 'التدفق (Q)'), ph: '30', units: [['L/s', 1], ['m³/h', 1000 / 3600], ['L/min', 1 / 60], ['m³/s', 1000]], positive: true },
            { id: 'h', label: L('Total head (H) [m of liquid]', 'الارتفاع الكلي (H) [m من السائل]'), ph: '40', positive: true },
            { id: 'rho', label: L('Liquid density (ρ) [kg/m³]', 'كثافة السائل (ρ) [kg/m³]'), ph: '998', positive: true },
            { id: 'ep', label: L('Pump efficiency (η_pump) [%]', 'كفاءة المضخة (η_pump) [%]'), ph: '70', positive: true },
            { id: 'em', label: L('Motor efficiency (η_motor) [%]', 'كفاءة المحرك (η_motor) [%]'), ph: '90', positive: true }
        ],
        compute: v => {
            if (v.ep > 100 || v.em > 100) return fail('An efficiency cannot be greater than 100 %.', 'لا يمكن أن تتجاوز الكفاءة 100%.');
            const Q = v.q / 1000, Ph = v.rho * G * Q * v.h, Ps = Ph / (v.ep / 100), Pe = Ps / (v.em / 100), dp = v.rho * G * v.h;
            const rows = [
                [L('Hydraulic (water) power (P_hyd)', 'القدرة الهيدروليكية (P_hyd)'), `${fmt(Ph / 1000)} kW`],
                [L('Pump shaft power (P_shaft)', 'قدرة عمود المضخة (P_shaft)'), `${fmt(Ps / 1000)} kW`],
                [L('Electrical input power (P_elec)', 'القدرة الكهربائية الداخلة (P_elec)'), `${fmt(Pe / 1000)} kW`],
                [L('Pressure rise (Δp = ρ g H)', 'ارتفاع الضغط (Δp = ρ g H)'), `${fmt(dp / 1e5)} bar`]
            ];
            if (bad(rows)) return OUT();
            rows.push(steps([`Q = ${f5(v.q)} L/s = ${f5(Q)} m³/s`, `P_hyd = ρ g Q H = ${f5(v.rho)} × ${f5(G)} × ${f5(Q)} × ${f5(v.h)} = ${f5(Ph)} W`,
                `P_shaft = P_hyd / η_pump = ${f5(Ph)} / ${f5(v.ep / 100)} = ${f5(Ps)} W ;  P_elec = P_shaft / η_motor = ${f5(Pe)} W`, `Δp = ρ g H = ${f5(dp)} Pa = ${f5(dp / 1e5)} bar`]));
            rows.push(info('H is the TOTAL head the pump must develop at the duty point: static lift + pressure difference in head + friction and fitting losses + velocity head difference (from your system analysis). The efficiencies must be those of the pump at that duty point and of the motor at its load; a motor with margin above P_shaft is selected. Suction conditions (NPSH) are not checked.',
                'H هي الارتفاع الكلي الذي يجب أن تولّده المضخة عند نقطة التشغيل: الرفع الساكن + فرق الضغط بدلالة الارتفاع + فواقد الاحتكاك والوصلات + فرق ارتفاع السرعة (من تحليل منظومتك). يجب أن تكون الكفاءتان للمضخة عند نقطة التشغيل وللمحرك عند حمله؛ ويُختار محرك بهامش فوق P_shaft. شروط السحب (NPSH) لا تُفحص.'));
            return rows;
        }
    });
})();
