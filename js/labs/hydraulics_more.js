/* Hydraulics & Pneumatics lab — models 4..5: accumulator (gas spring) and hydraulic motor. */
(function () {
    'use strict';
    const HY = window.HY, SM = window.SM, K = window.GearKit, FL = window.FL;
    if (!HY || !SM || !K || !FL || !window.THREE) return;
    const PI = Math.PI, L2 = HY.L2, fmt = HY.fmt, lit = SM.lit, CH = SM.CH, memo = SM.memo, clamp = HY.clamp, pp = HY.pp, trans = FL.trans, T2 = FL.T2;
    const NA = L2('—', '—'), box = HY.box, cylY = HY.cylY, colMat = HY.colMat;

    /* =====================================================================================
     * ACCUMULATOR
     * ===================================================================================== */
    const acCalc = memo((p) => {
        const n = p.proc === 'fast' ? 1.4 : 1.0, p0 = p.p0, p1 = p.pmin, p2 = Math.max(p.pmax, p.pmin + 10), V0 = p.V0;
        const gv = (pr, nn) => (pr <= p0 ? V0 : V0 * Math.pow(p0 / pr, 1 / (nn || n)));
        const V1 = gv(p1), V2 = gv(p2), dV = Math.max(0, V1 - V2);
        const energy = (nn) => { const a = gv(p1, nn), b = gv(p2, nn); return nn === 1 ? p1 * a * Math.log(p2 / p1) * 100 : ((p2 * b - p1 * a) / (nn - 1)) * 100; };
        return { n, p0, p1, p2, V0, V1, V2, dV, pct: (dV / V0) * 100, best: 0.9 * p1, ratio: p2 / Math.max(1, p0), E: energy(n), dVslow: V0 * Math.max(0, (p0 >= p1 ? 1 : Math.pow(p0 / p1, 1)) - Math.pow(p0 / p2, 1)), dVfast: V0 * Math.max(0, (p0 >= p1 ? 1 : Math.pow(p0 / p1, 1 / 1.4)) - Math.pow(p0 / p2, 1 / 1.4)), gv };
    });
    HY.addParts({
        ac_shell: pp('Accumulator shell', 'جسم المراكم', 'A steel pressure vessel. Oil enters at the bottom; a gas bladder (nitrogen) sits on top and works like a spring.', 'وعاء ضغط فولاذي. يدخل الزيت من الأسفل وتوجد في الأعلى مثانة غاز (نيتروجين) تعمل كالنابض.', 'Stores hydraulic energy for later.', 'يخزن طاقة هيدروليكية لوقت لاحق.', 'Must be discharged before servicing — the gas side stays under pressure.', 'يجب تفريغه قبل الصيانة — جهة الغاز تبقى تحت الضغط.'),
        ac_gas: pp('Gas bladder (nitrogen)', 'مثانة الغاز (نيتروجين)', 'Filled to the precharge pressure p₀. When oil enters, the gas is squeezed; when oil leaves, it expands and pushes the oil out.', 'تُملأ حتى ضغط الشحن المسبق p₀. عند دخول الزيت يُضغط الغاز وعند خروجه يتمدد ويدفع الزيت.', 'A spring made of gas: p · Vⁿ = constant.', 'نابض من الغاز: p · Vⁿ = ثابت.', 'Wrong precharge: little oil stored, or the bladder is crushed against the valve.', 'شحن مسبق خاطئ: زيت قليل مخزن أو تُسحق المثانة على الصمام.'),
        ac_oil: pp('Hydraulic oil', 'الزيت الهيدروليكي', 'The oil that goes in and out. Its volume is what the accumulator can give back.', 'الزيت الداخل والخارج. حجمه هو ما يستطيع المراكم إعادته.', 'Delivers the stored energy to the system.', 'يسلّم الطاقة المخزنة للمنظومة.', NA.en, NA.ar),
        ac_gauge: pp('Pressure gauge', 'مانومتر الضغط', 'System pressure, going up while charging and down while discharging.', 'ضغط المنظومة: يرتفع أثناء الشحن وينخفض أثناء التفريغ.', NA.en, NA.ar, NA.en, NA.ar)
    });
    HY.add('accum', L2('Accumulator', 'المراكم الهيدروليكي'), {
        controls: () => [
            { id: 'V0', type: 'range', label: L2('Accumulator size', 'حجم المراكم'), min: 1, max: 50, step: 1, value: 10, unit: 'L', rebuild: true },
            { id: 'p0', type: 'range', label: L2('Gas precharge pressure', 'ضغط الشحن المسبق للغاز'), min: 10, max: 280, step: 5, value: 90, unit: 'bar', rebuild: true },
            { id: 'pmin', type: 'range', label: L2('Lowest system pressure', 'أدنى ضغط للمنظومة'), min: 40, max: 250, step: 5, value: 100, unit: 'bar', rebuild: true },
            { id: 'pmax', type: 'range', label: L2('Highest system pressure', 'أعلى ضغط للمنظومة'), min: 60, max: 350, step: 5, value: 200, unit: 'bar', rebuild: true },
            { id: 'proc', type: 'select', label: L2('Discharge speed', 'سرعة التفريغ'), options: [{ v: 'slow', label: L2('Slow (gas keeps its temperature)', 'بطيء (الغاز يحافظ على حرارته)') }, { v: 'fast', label: L2('Fast (gas cools down)', 'سريع (الغاز يبرد)') }], value: 'slow', rebuild: true }
        ],
        build(p) {
            const c = acCalc(p), g = new THREE.Group(), R = 0.8 + Math.cbrt(p.V0 / 50) * 0.5, H = 2.6 + Math.cbrt(p.V0 / 50) * 1.0, y0 = 0.5;
            g.add(box(7, 0.15, 3, 0x64748b, 0, -0.075, 0));
            const shell = cylY(R, H, 0x94a3b8, 0, y0 + H / 2, 0, 'ac_shell'); shell.material = trans(0x94a3b8, 0.25, { side: THREE.DoubleSide }); g.add(shell);
            const capT = new THREE.Mesh(new THREE.SphereGeometry(R, 24, 12, 0, PI * 2, 0, PI / 2), lit(0x64748b)); capT.position.y = y0 + H; capT.userData.id = 'ac_shell'; g.add(capT);
            const base = cylY(R * 1.05, 0.25, 0x475569, 0, y0 - 0.12, 0, 'ac_shell'); g.add(base);
            g.add(cylY(0.18, 0.9, 0x475569, 0, 0.0, 0));
            const oil = cylY(R * 0.95, 1, 0x38bdf8, 0, y0, 0, 'ac_oil'); oil.material = trans(0x38bdf8, 0.6); g.add(oil);
            const gas = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), trans(0xe2e8f0, 0.85)); gas.userData.id = 'ac_gas'; g.add(gas);
            const gauge = HY.gauge(R + 1.0, y0 + H * 0.65, 0.2, 'ac_gauge'); g.add(gauge);
            const arr = SM.dirArrow([0, -0.7, 0.7], [0, 1, 0], 1.0, 0x16a34a, 0.07); g.add(arr);
            let ph = 0; const per = 5; const Hin = H - 0.1;
            g.userData.update = (dt) => {
                ph = (ph + dt / per) % 1; const s = 0.5 - 0.5 * Math.cos(ph * 2 * PI), rising = ph < 0.5;
                const pr = c.p1 + (c.p2 - c.p1) * s, V = c.gv(pr), f = clamp(V / c.V0, 0.04, 1);
                const h = Hin * f, rr = R * 0.94;
                gas.scale.set(rr, Math.max(0.05, h / 2), rr); gas.position.y = y0 + H - 0.05 - h / 2;
                const oh = Math.max(0.02, Hin - h); oil.scale.y = oh; oil.position.y = y0 + oh / 2; oil.material.color.copy(colMat(pr / 350));
                gauge.userData.setU(pr / 350);
                arr.rotation.z = rising ? PI : 0; arr.position.y = -0.7;
            };
            g.userData.fit = { w: R + 1.7, h: H / 2 + 0.9, dir: [0.15, 0.12, 1] }; g.userData.target = [0.5, H / 2 + 0.5, 0];
            return g;
        },
        readouts(p) {
            const c = acCalc(p), bad = c.p0 >= c.p2, warn = c.p0 > c.p1 * 0.95 || c.ratio > 4;
            return [
                { k: L2('Usable oil between min and max pressure', 'الزيت القابل للاستعمال بين أدنى وأعلى ضغط'), v: fmt(c.dV, 2) + ' L', state: bad ? 'bad' : warn ? 'warn' : 'ok' },
                { k: L2('That is … of the accumulator size', 'أي ما يعادل … من حجم المراكم'), v: fmt(c.pct, 0) + ' %' },
                { k: L2('Good precharge ≈ 90 % of the lowest pressure', 'الشحن المسبق الجيد ≈ 90% من أدنى ضغط'), v: fmt(c.best, 0) + ' bar', state: Math.abs(c.p0 - c.best) <= c.best * 0.1 ? 'ok' : 'warn' },
                { k: L2('Energy it can give back', 'الطاقة التي يعيدها'), v: fmt(c.E / 1000, 2) + ' kJ' },
                { k: L2('Gas volume at lowest / highest pressure', 'حجم الغاز عند أدنى / أعلى ضغط'), v: fmt(c.V1, 1) + ' / ' + fmt(c.V2, 1) + ' L' },
                { k: L2('Pressure ratio p_max / precharge (keep ≤ 4)', 'نسبة p_max / الشحن (أبقِها ≤ 4)'), v: fmt(c.ratio, 1), state: c.ratio > 4 ? 'warn' : '' },
                { k: L2('Oil if discharged slowly  /  quickly', 'الزيت عند التفريغ البطيء  /  السريع'), v: fmt(c.dVslow, 2) + ' / ' + fmt(c.dVfast, 2) + ' L' }
            ];
        },
        bom: () => [],
        challenges: () => [
            CH('Get at least 6 litres of oil from an accumulator of 10 L or smaller.', 'احصل على 6 لترات زيت على الأقل من مراكم حجمه 10 L أو أقل.', (p) => p.V0 <= 10 && acCalc(p).dV >= 6),
            CH('Set the precharge too high (above the lowest pressure) so that a 10 L accumulator gives less than 1 L.', 'اضبط الشحن المسبق عالياً جداً (فوق أدنى ضغط) بحيث يعطي مراكم 10 L أقل من 1 L.', (p) => p.V0 >= 10 && p.p0 >= p.pmin && p.pmax > p.pmin && acCalc(p).dV < 1),
            CH('Fast discharge: still deliver 3.5 L or more from a 10 L accumulator.', 'تفريغ سريع: ومع ذلك أعطِ 3.5 L أو أكثر من مراكم 10 L.', (p) => p.proc === 'fast' && p.V0 <= 10 && acCalc(p).dV >= 3.5)
        ],
        panels(p) {
            const c = acCalc(p), mk = (n) => { const pts = []; for (let i = 0; i <= 40; i++) { const V = c.V2 * 0.8 + (c.V0 - c.V2 * 0.8) * (i / 40); pts.push([V, c.p0 * Math.pow(c.V0 / V, n)]); } return pts; };
            const pmaxPlot = Math.min(400, c.p0 * Math.pow(c.V0 / (c.V2 * 0.8), 1.4));
            return [{ type: 'line', h: 200, title: L2('Gas pressure vs gas volume', 'ضغط الغاز مقابل حجم الغاز'), unit: 'bar', xlabel: L2('Gas volume (L)', 'حجم الغاز (L)'), xmin: c.V2 * 0.8, xmax: c.V0, ymin: 0, ymax: Math.max(c.p2 * 1.15, 50), series: [{ label: L2('slow', 'بطيء'), pts: mk(1), color: '#0284c7' }, { label: L2('fast', 'سريع'), pts: mk(1.4), color: '#dc2626' }], marks: [{ x: c.V1, y: c.p1, label: 'p min' }, { x: c.V2, y: c.p2, label: 'p max' }] }];
        }
    });

    /* =====================================================================================
     * HYDRAULIC MOTOR (external gear)
     * ===================================================================================== */
    const hmCalc = memo((p) => {
        const D = p.D * 1e-6, Q = p.Q / 60000, dp = p.dp * 1e5, n = ((Q * p.ev) / D) * 60, T = (dp * D * p.em) / (2 * PI), w = (2 * PI * n) / 60;
        return { D, Q, dp, n, T, Pout: T * w, Pin: dp * Q, eta: p.ev * p.em, w };
    });
    HY.addParts({
        hm_gear: pp('Gears', 'التروس', 'Two meshing gears. The pressurised oil pushes on the teeth and turns the shaft — the pump in reverse.', 'ترسان متعشقان. الزيت المضغوط يدفع الأسنان ويدير العمود — هي المضخة بالعكس.', 'Makes torque: T = Δp · D / 2π.', 'يصنع العزم: T = Δp · D / 2π.', 'Worn tooth tips leak, speed drops.', 'تآكل رؤوس الأسنان يسبب تسرباً وانخفاض السرعة.'),
        hm_housing: pp('Housing', 'الهيكل', 'Holds the gears and the oil. The oil is carried around the outside in the gaps between teeth and the wall.', 'يحتوي الترسين والزيت. يُحمل الزيت على المحيط في الفراغات بين الأسنان والجدار.', 'Seals the pressurised side from the return side.', 'يفصل جهة الضغط عن جهة العودة.', 'Scored housing wall = internal leakage.', 'خدش جدار الهيكل = تسرب داخلي.'),
        hm_in: pp('High-pressure port (in)', 'منفذ الضغط العالي (دخول)', 'Oil from the pump arrives here at high pressure.', 'الزيت القادم من المضخة يصل هنا بضغط عالٍ.', NA.en, NA.ar, NA.en, NA.ar),
        hm_out: pp('Return port (out)', 'منفذ العودة (خروج)', 'Oil leaves here at low pressure and goes back to the tank.', 'يخرج الزيت من هنا بضغط منخفض ويعود للخزان.', NA.en, NA.ar, NA.en, NA.ar),
        hm_shaft: pp('Output shaft', 'عمود الخرج', 'Delivers torque and speed to the machine you want to drive.', 'يعطي العزم والسرعة للآلة المراد تدويرها.', NA.en, NA.ar, NA.en, NA.ar)
    });
    HY.add('hmotor', L2('Hydraulic motor', 'المحرك الهيدروليكي'), {
        controls: () => [
            { id: 'D', type: 'range', label: L2('Displacement (oil per revolution)', 'الإزاحة (الزيت لكل دورة)'), min: 5, max: 100, step: 1, value: 30, unit: 'cm³/rev', rebuild: true },
            { id: 'Q', type: 'range', label: L2('Oil flow from the pump', 'تدفق الزيت من المضخة'), min: 5, max: 80, step: 1, value: 30, unit: 'L/min', rebuild: true },
            { id: 'dp', type: 'range', label: L2('Pressure drop across the motor', 'هبوط الضغط عبر المحرك'), min: 10, max: 250, step: 5, value: 100, unit: 'bar', rebuild: true },
            { id: 'ev', type: 'range', label: L2('Volumetric efficiency (leakage)', 'المردود الحجمي (التسرب)'), min: 0.8, max: 0.99, step: 0.01, value: 0.95, rebuild: true },
            { id: 'em', type: 'range', label: L2('Mechanical efficiency (friction)', 'المردود الميكانيكي (الاحتكاك)'), min: 0.8, max: 0.99, step: 0.01, value: 0.9, rebuild: true }
        ],
        build(p) {
            const c = hmCalc(p), g = new THREE.Group(), r = 0.62, rt = 0.78, N = 10, a = 1.4, Hh = 1.0;
            g.add(box(8, 0.15, 3, 0x64748b, 0, -2.3, 0));
            const hous = box(3.5, 2.0, Hh + 0.2, 0x94a3b8, 0, 0, 0, 'hm_housing'); hous.material = trans(0x94a3b8, 0.18); g.add(hous);
            const mkGear = (cx, id) => { const gr = new THREE.Group(); gr.position.set(cx, 0, 0); const b = cylY(r, Hh, 0xf59e0b, 0, 0, 0, id); b.rotation.x = PI / 2; gr.add(b); for (let i = 0; i < N; i++) { const t = box(0.2, rt - r + 0.05, Hh, 0xf59e0b, 0, 0, 0, id); const ang = (i / N) * 2 * PI; t.position.set(-Math.sin(ang) * (r + (rt - r) / 2), Math.cos(ang) * (r + (rt - r) / 2), 0); t.rotation.z = ang; gr.add(t); } return gr; };
            const gA = mkGear(-a / 2, 'hm_gear'), gB = mkGear(a / 2, 'hm_gear'); g.add(gA); g.add(gB);
            const shaft = cylY(0.14, 1.8, 0x94a3b8, -a / 2, 0, 0.9, 'hm_shaft'); shaft.rotation.x = PI / 2; shaft.position.z = Hh / 2 + 0.7; g.add(shaft);
            const fly = cylY(0.42, 0.12, 0x475569, -a / 2, 0, Hh / 2 + 1.5, 'hm_shaft'); fly.rotation.x = PI / 2; g.add(fly); const mark = box(0.1, 0.3, 0.14, 0xdc2626, -a / 2, 0.4, Hh / 2 + 1.5); g.add(mark);
            const inP = [new THREE.Vector3(0, 1.0, 0), new THREE.Vector3(0, 2.4, 0)], outP = [new THREE.Vector3(0, -1.0, 0), new THREE.Vector3(0, -2.2, 0)];
            g.add(FL.tubeMeshes(inP, 0.2, 0xdc2626, 0.3)); g.add(FL.tubeMeshes(outP, 0.2, 0x2563eb, 0.3));
            const inT = box(0.6, 0.3, 0.6, 0xdc2626, 0, 2.6, 0, 'hm_in'); const outT = box(0.6, 0.3, 0.6, 0x2563eb, 0, -2.4, 0, 'hm_out'); g.add(inT); g.add(outT);
            const u = clamp(c.dp / 350e5 * 1.0, 0, 1), hi = FL.pcol(Math.max(0.55, u)), lo = FL.pcol(0.05);
            const NA_ = 14, NI = 10, NO = 10, PS = FL.Particles(2 * NA_ + NI + NO, 0.16); g.add(PS.pts);
            const U = new Float32Array(PS.n).map((_, k) => (k < 2 * NA_ ? (k % NA_) / NA_ : ((k - 2 * NA_) % 10) / 10));
            let th = 0; const wv = Math.max(0.15, K.rpmToVis(c.n) * 1.0);
            g.userData.update = (dt) => {
                th += wv * dt; gA.rotation.z = th; gB.rotation.z = -th + PI / N; fly.rotation.z = 0; mark.position.set(-a / 2 + Math.sin(th) * -0.4, Math.cos(th) * 0.4, Hh / 2 + 1.5); mark.rotation.z = th;
                const o = [0, 0, 0];
                for (let i = 0; i < PS.n; i++) {
                    let x, y; let cc = hi;
                    if (i < NA_) { U[i] = (U[i] + (wv * dt) / PI) % 1; const t = PI / 2 + U[i] * PI; x = -a / 2 + Math.cos(t) * (rt + 0.1); y = Math.sin(t) * (rt + 0.1); }
                    else if (i < 2 * NA_) { U[i] = (U[i] + (wv * dt) / PI) % 1; const t = PI / 2 - U[i] * PI; x = a / 2 + Math.cos(t) * (rt + 0.1); y = Math.sin(t) * (rt + 0.1); }
                    else if (i < 2 * NA_ + NI) { U[i] = (U[i] + dt * (0.4 + c.Q * 40)) % 1; x = ((i % 3) - 1) * 0.09; y = 2.4 - U[i] * 1.4; }
                    else { U[i] = (U[i] + dt * (0.4 + c.Q * 40)) % 1; x = ((i % 3) - 1) * 0.09; y = -1.0 - U[i] * 1.2; cc = lo; }
                    PS.pos[i * 3] = x; PS.pos[i * 3 + 1] = y; PS.pos[i * 3 + 2] = ((i * 7) % 5 - 2) * 0.12;
                    PS.col[i * 3] = cc[0]; PS.col[i * 3 + 1] = cc[1]; PS.col[i * 3 + 2] = cc[2];
                }
                PS.commit();
            };
            g.userData.fit = { w: 2.1, h: 2.9, dir: [0.2, 0.15, 1] }; g.userData.target = [0, 0.1, 0.4];
            return g;
        },
        readouts(p) {
            const c = hmCalc(p);
            return [
                { k: L2('Shaft speed', 'سرعة العمود'), v: fmt(c.n, 0) + ' rpm' },
                { k: L2('Shaft torque', 'عزم العمود'), v: fmt(c.T, 1) + ' N·m' },
                { k: L2('Output power', 'الاستطاعة الناتجة'), v: fmt(c.Pout / 1000, 2) + ' kW' },
                { k: L2('Overall efficiency', 'المردود الكلي'), v: fmt(c.eta * 100, 0) + ' %' },
                { k: L2('Hydraulic power going in  (Δp · Q)', 'الاستطاعة الهيدروليكية الداخلة  (Δp · Q)'), v: fmt(c.Pin / 1000, 2) + ' kW' },
                { k: L2('Speed if the flow doubled', 'السرعة إذا تضاعف التدفق'), v: fmt(c.n * 2, 0) + ' rpm' },
                { k: L2('Torque if the pressure doubled', 'العزم إذا تضاعف الضغط'), v: fmt(c.T * 2, 1) + ' N·m' }
            ];
        },
        bom: () => [],
        challenges: () => [
            CH('Get at least 60 N·m at 700 rpm or more, using no more than 7 kW of hydraulic power.', 'احصل على 60 N·m على الأقل عند 700 rpm أو أكثر، مع استعمال 7 kW هيدروليكية أو أقل.', (p) => { const c = hmCalc(p); return c.T >= 60 && c.n >= 700 && c.Pin <= 7000; }),
            CH('Reach 1500 rpm with a pump flow of 30 L/min or less.', 'بلغ 1500 rpm بتدفق مضخة 30 L/min أو أقل.', (p) => p.Q <= 30 && hmCalc(p).n >= 1500),
            CH('Deliver 100 N·m using a pressure of 150 bar or less.', 'أعطِ 100 N·m باستعمال ضغط 150 bar أو أقل.', (p) => { const c = hmCalc(p); return c.T >= 100 && p.dp <= 150; })
        ],
        panels(p) {
            const c = hmCalc(p), tp = [], sp = [];
            for (let dp = 0; dp <= 250; dp += 10) tp.push([dp, hmCalc(Object.assign({}, p, { dp })).T]);
            for (let Q = 5; Q <= 80; Q += 5) sp.push([Q, hmCalc(Object.assign({}, p, { Q })).n]);
            return [
                { type: 'line', h: 170, title: L2('Torque vs pressure', 'العزم مقابل الضغط'), unit: 'N·m', xlabel: L2('Pressure drop (bar)', 'هبوط الضغط (bar)'), xmin: 0, xmax: 250, ymin: 0, series: [{ label: 'T', pts: tp, fill: true }], marks: [{ x: p.dp, y: c.T, label: fmt(c.T, 0) }] },
                { type: 'line', h: 170, title: L2('Speed vs flow', 'السرعة مقابل التدفق'), unit: 'rpm', xlabel: L2('Flow (L/min)', 'التدفق (L/min)'), xmin: 5, xmax: 80, ymin: 0, series: [{ label: 'n', pts: sp, fill: true }], marks: [{ x: p.Q, y: c.n, label: fmt(c.n, 0) }] }
            ];
        }
    });
})();
