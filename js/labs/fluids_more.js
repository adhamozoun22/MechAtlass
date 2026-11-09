/* Fluids & Pumps lab — models 3..6: venturi / orifice meter, hydrostatic gate force, buoyancy & stability, drag on bodies. */
(function () {
    'use strict';
    const SM = window.SM, FL = window.FL, K = window.GearKit;
    if (!SM || !FL || !K || !window.THREE) return;
    const PI = Math.PI, L2 = FL.L2, fmt = FL.fmt, lit = SM.lit, CH = SM.CH, memo = SM.memo, st = SM.state, G = FL.G, clamp = FL.clamp, trans = FL.trans, rand = FL.rand, pp = FL.pp;
    FL.FLUIDS.hg = { n: L2('Mercury', 'زئبق'), rho: 13600, mu: 1.5e-3, pv: 0.17 };
    const PATM = 101325;

    /* =====================================================================================
     * 3. VENTURI / ORIFICE METER
     * ===================================================================================== */
    const venCalc = memo((p) => {
        const F = FL.FLUIDS[p.fluid], D1 = p.D / 1000, b = p.beta, D2 = D1 * b, A1 = (PI * D1 * D1) / 4, A2 = (PI * D2 * D2) / 4, v1 = p.v1, Q = v1 * A1, v2 = v1 / (b * b);
        const C = p.type === 'ven' ? 0.985 : 0.5959 + 0.0312 * Math.pow(b, 2.1) - 0.184 * Math.pow(b, 8);
        const dp = (F.rho / 2) * Math.pow(Q / (C * A2), 2) * (1 - Math.pow(b, 4)), /* ISO 5167: Q = C·A2·√(2Δp/ρ)/√(1−β⁴) */ root = Math.sqrt(1 - Math.pow(b, 4) * (1 - C * C));
        const perm = p.type === 'ven' ? 0.12 * dp : dp * ((root - C * b * b) / (root + C * b * b));
        const p1 = p.p1 * 1000, p2 = p1 - dp, Rc = 0.82; // vena contracta (orifice) in units of R2
        const vmax = p.type === 'ven' ? v2 : v1 / (b * b * Rc * Rc);
        const pminRaw = p.type === 'ven' ? p2 : p1 - (dp * (vmax * vmax - v1 * v1)) / Math.max(1e-9, v2 * v2 * 1.05 - v1 * v1);
        const pmin = Math.max(pminRaw, -PATM + 1), pmeasuredAbs = p2 + PATM, cav = pminRaw + PATM < F.pv;
        return { F, D1, D2, A1, A2, v1, v2, Q, C, dp, perm, p1, p2, pmin, pminRaw, pminAbs: pminRaw + PATM, cav, vmax, dh: dp / ((13600 - F.rho) * G), sigma: (p1 + PATM - F.pv) / ((F.rho / 2) * v2 * v2), cc: Rc };
    });
    const VX0 = -6, VX1 = 6, VR1 = 1.0;
    const venR = (p, c, x) => { // pipe wall radius (venturi) or jet radius (orifice)
        const R2 = VR1 * p.beta, lerp = (a, b, u) => a + (b - a) * clamp(u, 0, 1), sm = (u) => u * u * (3 - 2 * u);
        if (p.type === 'ven') { if (x < -3) return VR1; if (x < -1.5) return lerp(VR1, R2, (x + 3) / 1.5); if (x < -0.9) return R2; if (x < 2.2) return lerp(R2, VR1, (x + 0.9) / 3.1); return VR1; }
        if (x < -0.3) return VR1;
        const Rc = R2 * c.cc; if (x < 0.5) return lerp(R2, Rc, sm((x + 0.3) / 0.8)); if (x < 4) return lerp(Rc, VR1, sm((x - 0.5) / 3.5)); return VR1;
    };
    const venWall = (p, x) => (p.type === 'ven' ? venR(p, { cc: 1 }, x) : VR1);
    const venV = (p, c, x) => { const r = venR(p, c, x); return c.v1 * Math.pow(VR1 / r, 2); };
    const venP = (p, c, x) => { // gauge pressure (Pa) at axial position x
        const v = venV(p, c, x), tapX = p.type === 'ven' ? -1.2 : 0.3, vt = venV(p, c, tapX), denom = vt * vt - c.v1 * c.v1;
        let pr = c.p1 - (c.dp * (v * v - c.v1 * c.v1)) / Math.max(1e-9, denom);
        if (p.type === 'ven' && x > -0.9) pr -= c.perm * clamp((x + 0.9) / 3.1, 0, 1);
        if (p.type === 'ori' && x > 0.5) pr = Math.min(c.p1 - c.perm * clamp((x - 0.5) / 3.5, 0, 1), pr + 0) ;
        if (p.type === 'ori' && x > 0.5) { const u = clamp((x - 0.5) / 3.5, 0, 1), vcP = c.p1 - (c.dp * (c.vmax * c.vmax - c.v1 * c.v1)) / Math.max(1e-9, denom), endP = c.p1 - c.perm; pr = vcP + (endP - vcP) * u * u * (3 - 2 * u); }
        return Math.max(pr, -PATM + 1);
    };
    FL.addParts({
        fl_venturi: pp('Meter body', 'جسم العدّاد', 'A venturi narrows smoothly and widens again; an orifice plate squeezes the stream suddenly. Colour = pressure (blue low, red high).', 'الفنتوري يضيق بسلاسة ثم يتسع؛ أما صفيحة الفتحة فتضغط الجريان فجأة. اللون = الضغط (أزرق منخفض، أحمر عالٍ).', 'Speeds the flow up in the throat, so the pressure drops (Bernoulli): Δp = ρ/2 (v₂² − v₁²). Measuring Δp gives Q.', 'يسرّع الجريان في الحلق فينخفض الضغط (برنولي): Δp = ρ/2 (v₂² − v₁²). قياس Δp يعطي Q.', 'Cavitation at the throat (pits the metal), blocked or eroded taps, fouling that changes the discharge coefficient.', 'التكهّف في الحلق (ينخّر المعدن)، انسداد أو تآكل نقاط القياس، رواسب تغيّر معامل التصريف.'),
        fl_manometer: pp('U-tube manometer', 'مانومتر أنبوبي U', 'Mercury (silver) in a U-tube joined to the two taps; the water above it carries the pressure. The height difference Δh shows Δp.', 'زئبق (فضي) في أنبوب U متصل بنقطتي القياس؛ والماء فوقه ينقل الضغط. فرق الارتفاع Δh يعطي Δp.', 'Δp = (ρ_Hg − ρ)·g·Δh.', 'Δp = (ρ_Hg − ρ)·g·Δh.', 'Air bubbles in the lines, mercury loss, overpressure blowing the liquid out.', 'فقاعات هواء في الخطوط، فقد الزئبق، ضغط زائد يقذف السائل.'),
        fl_vflow: pp('Flow particles', 'جسيمات الجريان', 'Dots move faster where the passage is narrower (continuity: v·A = constant). White dots mean the liquid is boiling — cavitation.', 'تتحرك النقاط أسرع حيث يضيق الممر (الاستمرارية: v·A = ثابت). النقاط البيضاء تعني غليان السائل — تكهّف.', 'Visualise the velocity.', 'تُظهر السرعة.')
    });
    FL.add('venturi', L2('Venturi & orifice meter', 'عدّاد فنتوري وصفيحة'), {
        controls: () => [
            { type: 'title', label: L2('Meter', 'العدّاد') },
            { id: 'type', type: 'select', label: L2('Type', 'النوع'), options: [{ v: 'ven', label: L2('Venturi tube', 'أنبوب فنتوري') }, { v: 'ori', label: L2('Orifice plate', 'صفيحة فتحة') }], value: 'ven', rebuild: true },
            { id: 'D', type: 'range', label: L2('Pipe diameter D₁', 'قطر الأنبوب D₁'), min: 50, max: 300, step: 10, value: 100, unit: 'mm', rebuild: true },
            { id: 'beta', type: 'range', label: L2('Throat ratio β = d/D', 'نسبة الحلق β = d/D'), min: 0.3, max: 0.8, step: 0.05, value: 0.5, rebuild: true },
            { type: 'title', label: L2('Flow', 'الجريان') },
            { id: 'fluid', type: 'select', label: L2('Fluid', 'المائع'), options: FL.fluidOptions(['water', 'sea', 'oil']), value: 'water', rebuild: true },
            { id: 'v1', type: 'range', label: L2('Pipe velocity v₁', 'سرعة الأنبوب v₁'), min: 0.2, max: 6, step: 0.1, value: 2, unit: 'm/s', rebuild: true },
            { id: 'p1', type: 'range', label: L2('Inlet pressure p₁ (gauge)', 'ضغط المدخل p₁ (نسبي)'), min: -50, max: 500, step: 10, value: 150, unit: 'kPa', rebuild: true }
        ],
        build(p) {
            const c = venCalc(p), g = new THREE.Group(), grid = SM.Grid(), N = 90;
            const pHi = c.p1, pLo = Math.min(c.pmin, c.p1 - 1), col = (pr) => FL.pcol((pr - pLo) / Math.max(1, pHi - pLo));
            grid.add(N, 32, (u, v) => { const x = VX0 + u * (VX1 - VX0), a = v * 2 * PI, r = venWall(p, x); return { p: [x, r * Math.cos(a), r * Math.sin(a)], c: col(venP(p, c, x)) }; });
            const body = grid.mesh(); body.material.transparent = true; body.material.opacity = 0.34; body.material.depthWrite = false; body.userData.id = 'fl_venturi'; g.add(body);
            if (p.type === 'ori') {
                const R2 = VR1 * p.beta, ring = new THREE.Mesh(new THREE.RingGeometry(R2, VR1 * 1.3, 40), lit(0x64748b, { side: THREE.DoubleSide })); ring.rotation.y = PI / 2; ring.position.x = -0.3; ring.userData.id = 'fl_venturi'; g.add(ring);
                const th = new THREE.Mesh(new THREE.CylinderGeometry(VR1 * 1.3, VR1 * 1.3, 0.12, 40, 1, true), lit(0x64748b)); th.rotation.z = PI / 2; th.position.x = -0.3; g.add(th);
            }
            // taps + U-tube manometer
            const t1 = -4.4, t2 = p.type === 'ven' ? -1.2 : 0.3, yTube = -VR1, yBase = -4.4, dhv = clamp(c.dh * 7, 0.08, 2.4), ym = -3.1;
            const mg = new THREE.Group(); mg.userData.id = 'fl_manometer';
            const wTube = 0.2, glass = trans(0xe2e8f0, 0.25);
            const vbar = (x, y0, y1, mat) => { const m = new THREE.Mesh(new THREE.BoxGeometry(wTube, Math.max(0.01, y1 - y0), wTube), mat); m.position.set(x, (y0 + y1) / 2, 0); mg.add(m); };
            const hgM = lit(0xcbd5e1, { metalness: 0.8, roughness: 0.2 }), wM = trans(0x38bdf8, 0.7);
            const topL = ym - dhv / 2, topR = ym + dhv / 2;
            vbar(t1, yBase, topL, hgM); vbar(t2, yBase, topR, hgM); const bar = new THREE.Mesh(new THREE.BoxGeometry(t2 - t1 + wTube, wTube, wTube), hgM); bar.position.set((t1 + t2) / 2, yBase, 0); mg.add(bar);
            vbar(t1, topL, yTube, wM); vbar(t2, topR, yTube, wM);
            [t1, t2].forEach((x) => { const gl = new THREE.Mesh(new THREE.BoxGeometry(wTube * 1.5, yTube - yBase, wTube * 1.5), glass); gl.position.set(x, (yTube + yBase) / 2, 0); mg.add(gl); });
            const dm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.03, 0.03), lit(0xdc2626)); dm.position.set((t1 + t2) / 2, topL, 0.25); mg.add(dm);
            const dm2 = dm.clone(); dm2.position.y = topR; mg.add(dm2);
            g.add(mg);
            // flow particles (white = cavitating)
            const NP = 260, P = FL.Particles(NP, 0.26), part = [];
            for (let i = 0; i < NP; i++) part.push({ x: VX0 + rand() * (VX1 - VX0), rf: Math.sqrt(rand()), ph: rand() * 2 * PI });
            const rad = (x) => (p.type === 'ven' ? venR(p, c, x) : venR(p, c, x));
            const place = () => { for (let i = 0; i < NP; i++) { const q = part[i], r = rad(q.x) * q.rf * 0.9, cv = c.cav && venP(p, c, q.x) + PATM < c.F.pv * 1.5; P.pos[i * 3] = q.x; P.pos[i * 3 + 1] = r * Math.cos(q.ph); P.pos[i * 3 + 2] = r * Math.sin(q.ph); const sp = clamp(venV(p, c, q.x) / Math.max(c.vmax, c.v1), 0, 1); P.col[i * 3] = cv ? 1 : 0.2 + 0.8 * sp; P.col[i * 3 + 1] = cv ? 1 : 0.8 - 0.3 * sp; P.col[i * 3 + 2] = cv ? 1 : 1 - 0.8 * sp; } P.commit(); };
            place(); const fg = new THREE.Group(); fg.userData.id = 'fl_vflow'; fg.add(P.pts); g.add(fg);
            g.userData.update = (dt) => { for (let i = 0; i < NP; i++) { const q = part[i]; q.x += clamp(venV(p, c, q.x) * 0.3, 0.1, 6.5) * dt; if (q.x > VX1) q.x = VX0; } place(); };
            g.userData.fit = { w: 6.2, h: 3.6, dir: [0.25, 0.3, 1] }; g.userData.target = [0, -1.5, 0]; g.userData.pLo = pLo;
            return g;
        },
        readouts(p) {
            const c = venCalc(p), lang = window.getLang ? window.getLang() : 'en';
            return [
                { k: L2('Flow rate Q = v₁·A₁', 'التدفق Q = v₁·A₁'), v: fmt(c.Q * 1000, 2) + ' L/s  (' + fmt(c.Q * 3600, 1) + ' m³/h)' },
                { k: L2('Throat velocity v₂ = v₁/β²', 'سرعة الحلق v₂ = v₁/β²'), v: fmt(c.v2, 2) + ' m/s' },
                { k: L2('Discharge coefficient C', 'معامل التصريف C'), v: fmt(c.C, 3) },
                { k: L2('Pressure difference between the taps Δp', 'فرق الضغط بين نقطتي القياس Δp'), v: fmt(c.dp / 1000, 2) + ' kPa' },
                { k: L2('Manometer reading Δh (mercury)', 'قراءة المانومتر Δh (زئبق)'), v: fmt(c.dh * 1000, 0) + ' mm' },
                { k: L2('Pressure at the tap p₂ (gauge)', 'الضغط عند نقطة القياس p₂ (نسبي)'), v: fmt(c.p2 / 1000, 1) + ' kPa' },
                { k: L2('Lowest pressure in the meter (absolute)', 'أخفض ضغط في العدّاد (مطلق)'), v: fmt(c.pminAbs / 1000, 1) + ' kPa  (' + (lang === 'ar' ? 'بخار ' : 'vapour ') + fmt(c.F.pv / 1000, 1) + ')', state: c.cav ? 'bad' : c.pminAbs < 3 * c.F.pv ? 'warn' : 'ok' },
                { k: L2('Cavitation', 'التكهّف'), v: c.cav ? (lang === 'ar' ? 'نعم! السائل يغلي في الحلق' : 'YES — the liquid boils in the throat') : (lang === 'ar' ? 'لا' : 'no') + '  (σ = ' + fmt(c.sigma, 1) + ')', state: c.cav ? 'bad' : 'ok' },
                { k: L2('Permanent pressure loss', 'ضياع الضغط الدائم'), v: fmt(c.perm / 1000, 2) + ' kPa  (' + fmt((c.perm / c.dp) * 100, 0) + ' % of Δp)', state: c.perm / c.dp > 0.5 ? 'warn' : 'ok' },
                { k: L2('Power lost  Q·Δp_perm', 'الاستطاعة الضائعة  Q·Δp_perm'), v: fmt(c.Q * c.perm, 0) + ' W' }
            ];
        },
        bom: () => [],
        challenges: () => [
            CH('Make the venturi cavitate: let the throat pressure fall to the liquid\'s vapour pressure.', 'اجعل الفنتوري يتكهّف: دع ضغط الحلق ينخفض إلى ضغط بخار السائل.', (p) => p.type === 'ven' && venCalc(p).cav),
            CH('Measure at least 30 L/s while keeping Δp at 50 kPa or less (a wide throat).', 'قِس 30 L/s على الأقل مع إبقاء Δp عند 50 kPa أو أقل (حلق عريض).', (p) => { const c = venCalc(p); return c.Q >= 0.03 && c.dp <= 50000; }),
            CH('Orifice plate: find a set-up where at least 60 % of Δp is lost permanently (compare with the venturi).', 'صفيحة الفتحة: جِد وضعاً يضيع فيه 60% على الأقل من Δp بشكل دائم (قارن مع الفنتوري).', (p) => p.type === 'ori' && venCalc(p).perm / venCalc(p).dp >= 0.6),
            CH('Get a clearly readable manometer (Δh ≥ 300 mm of mercury) without cavitation.', 'احصل على قراءة مانومتر واضحة (Δh ≥ 300 mm زئبق) دون تكهّف.', (p) => { const c = venCalc(p); return c.dh >= 0.3 && !c.cav; })
        ],
        panels(p) {
            const c = venCalc(p), pr = [], vl = [], dpq = [];
            for (let i = 0; i <= 60; i++) { const x = VX0 + ((VX1 - VX0) * i) / 60, pc = ((x - VX0) / (VX1 - VX0)) * 100; pr.push([pc, venP(p, c, x) / 1000]); vl.push([pc, venV(p, c, x)]); }
            for (let i = 0; i <= 20; i++) { const v = (p.v1 * 2 * i) / 20, Q = v * c.A1, d = (c.F.rho / 2) * Math.pow(Q / (c.C * c.A2), 2) * (1 - Math.pow(p.beta, 4)); dpq.push([Q * 1000, d / 1000]); }
            const pvg = (c.F.pv - PATM) / 1000, showV = pvg >= c.pmin / 1000 - 40;
            return [
                { type: 'grad', title: L2('Colour = pressure along the meter', 'اللون = الضغط على طول العدّاد'), unit: 'kPa', min: Math.min(c.pmin, c.p1 - 1) / 1000, max: c.p1 / 1000, h: 44, stops: FL.pstops },
                { type: 'line', h: 190, title: L2('Pressure along the axis (gauge)', 'الضغط على المحور (نسبي)'), unit: 'kPa', xlabel: L2('Position along the meter (%)', 'الموضع على العدّاد (%)'), xmin: 0, xmax: 100, ymin: Math.min(showV ? pvg : 1e9, c.pmin / 1000) - 5, ymax: c.p1 / 1000 + 5, series: [{ label: 'p(x)', pts: pr, fill: true }].concat(showV ? [{ label: L2('vapour pressure', 'ضغط البخار'), pts: [[0, pvg], [100, pvg]] }] : []) },
                { type: 'line', h: 160, title: L2('Velocity along the axis', 'السرعة على المحور'), unit: 'm/s', xlabel: L2('Position along the meter (%)', 'الموضع على العدّاد (%)'), xmin: 0, xmax: 100, ymin: 0, series: [{ label: 'v(x)', pts: vl, fill: true }] },
                { type: 'line', h: 170, title: L2('Δp grows with the square of the flow', 'يزداد Δp مع مربع التدفق'), unit: 'kPa', xlabel: L2('Flow Q (L/s)', 'التدفق Q (L/s)'), xmin: 0, xmax: c.Q * 2000, ymin: 0, series: [{ label: 'Δp', pts: dpq, fill: true }], marks: [{ x: c.Q * 1000, y: c.dp / 1000, label: fmt(c.dp / 1000, 1) }] }
            ];
        }
    });

    /* =====================================================================================
     * 4. HYDROSTATIC FORCE ON A GATE
     * ===================================================================================== */
    const hydCalc = memo((p) => {
        const F = FL.FLUIDS[p.fluid], th = (p.theta * PI) / 180, s = Math.sin(th), a = p.a, b = p.b, A = a * b, hc = p.h1 + (a / 2) * s, force = F.rho * G * hc * A;
        const ysc = hc / s, I = (b * a * a * a) / 12, yscp = ysc + I / (ysc * A), dcp = yscp - p.h1 / s, hcp = yscp * s;
        const dHinge = p.hinge === 'top' ? dcp : a - dcp, P = (force * dHinge) / a, R = force - P;
        return { F, th, s, A, hc, force, dcp, hcp, P, R, Fh: force * s, Fv: Math.abs(Math.cos(th)) < 1e-9 ? 0 : force * Math.cos(th), pt: F.rho * G * p.h1, pb: F.rho * G * (p.h1 + a * s), hFall: dcp / a };
    });
    FL.addParts({
        fl_gate: pp('Gate', 'البوابة', 'A plane rectangular gate under the surface. The pressure on it grows with depth, so the load is a trapezoid, not uniform.', 'بوابة مستوية مستطيلة تحت السطح. يزداد الضغط عليها مع العمق، فالحمل شبه منحرف وليس منتظماً.', 'Holds the fluid back. Total force F = ρ·g·h_c·A.', 'تحبس المائع. القوة الكلية F = ρ·g·h_c·A.', 'Hinge or seal failure, overturning of tall gates, leakage at the bottom edge where the pressure is highest.', 'تعطّل المفصلة أو الإحكام، انقلاب البوابات العالية، تسرّب عند الحافة السفلية حيث الضغط الأعلى.'),
        fl_pressure: pp('Pressure arrows', 'أسهم الضغط', 'Every arrow is ρ·g·depth. They are always perpendicular to the gate and longer at the bottom.', 'كل سهم يساوي ρ·g·العمق. تكون دائماً عمودية على البوابة وأطول عند الأسفل.', 'Show the pressure distribution.', 'تُظهر توزيع الضغط.'),
        fl_cp: pp('Centre of pressure', 'مركز الضغط', 'The orange arrow acts at the centre of pressure, always BELOW the centroid, closer to the bottom.', 'السهم البرتقالي يعمل عند مركز الضغط، دائماً أسفل المركز الهندسي وأقرب إلى القاع.', 'Where the whole force acts: y_cp = y_c + I/(y_c·A).', 'نقطة تأثير القوة الكلية: y_cp = y_c + I/(y_c·A).'),
        fl_hinge: pp('Hinge & holding force', 'المفصلة وقوة الإمساك', 'The dark ball is the hinge. The green arrow is the force needed at the other edge to keep the gate closed.', 'الكرة الداكنة هي المفصلة. السهم الأخضر هو القوة اللازمة عند الحافة الأخرى لإبقاء البوابة مغلقة.', 'From moments about the hinge: P = F·d / a.', 'من العزوم حول المفصلة: P = F·d / a.', 'Hinge overload, actuator too small.', 'حِمل زائد على المفصلة، مشغّل صغير جداً.'),
        fl_fluid: pp('Fluid', 'المائع', 'The static fluid; pressure depends only on depth (p = ρ·g·h), not on the shape of the tank.', 'المائع الساكن؛ يعتمد الضغط على العمق فقط (p = ρ·g·h) لا على شكل الخزان.', 'Loads the gate.', 'يحمّل البوابة.')
    });
    FL.add('hydro', L2('Hydrostatic gate force', 'قوة الماء على بوابة'), {
        controls: () => [
            { type: 'title', label: L2('Fluid & gate', 'المائع والبوابة') },
            { id: 'fluid', type: 'select', label: L2('Fluid', 'المائع'), options: FL.fluidOptions(['water', 'sea', 'oil', 'gly', 'hg']), value: 'water', rebuild: true },
            { id: 'a', type: 'range', label: L2('Gate height (along the slope) a', 'ارتفاع البوابة (على الميل) a'), min: 0.5, max: 4, step: 0.1, value: 2, unit: 'm', rebuild: true },
            { id: 'b', type: 'range', label: L2('Gate width b', 'عرض البوابة b'), min: 0.5, max: 4, step: 0.1, value: 1.5, unit: 'm', rebuild: true },
            { id: 'h1', type: 'range', label: L2('Depth of the top edge below the surface h₁', 'عمق الحافة العلوية تحت السطح h₁'), min: 0, max: 6, step: 0.25, value: 1, unit: 'm', rebuild: true },
            { id: 'theta', type: 'range', label: L2('Gate angle from horizontal θ (90° = vertical)', 'زاوية البوابة عن الأفق θ (90° = شاقولية)'), min: 20, max: 90, step: 5, value: 90, unit: '°', rebuild: true },
            { id: 'hinge', type: 'select', label: L2('Hinge at', 'المفصلة عند'), options: [{ v: 'top', label: L2('Top edge', 'الحافة العلوية') }, { v: 'bottom', label: L2('Bottom edge', 'الحافة السفلية') }], value: 'top', rebuild: true }
        ],
        build(p) {
            const c = hydCalc(p), g = new THREE.Group(), sc = 0.85, th = c.th, ct = Math.cos(th), sn = Math.sin(th), bv = Math.min(3.2, p.b * 0.8);
            const T = [0, -p.h1 * sc], B = [-p.a * ct * sc, -(p.h1 + p.a * sn) * sc], yF = B[1] - 0.6 * sc;
            const sh = new THREE.Shape(); sh.moveTo(-9, 0); sh.lineTo(0, 0); sh.lineTo(T[0], T[1]); sh.lineTo(B[0], B[1]); sh.lineTo(B[0], yF); sh.lineTo(-9, yF); sh.closePath();
            const fl = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: bv, bevelEnabled: false }), trans(0x38bdf8, 0.45)); fl.position.z = -bv / 2; fl.userData.id = 'fl_fluid'; g.add(fl);
            const floor = new THREE.Mesh(new THREE.BoxGeometry(10, 0.3, bv + 0.6), lit(0x64748b)); floor.position.set(-4.4, yF - 0.15, 0); g.add(floor);
            // dry-side wall above the gate (if h1 > 0)
            if (p.h1 > 0.01) { const w = new THREE.Mesh(new THREE.BoxGeometry(0.25, p.h1 * sc + 0.6, bv + 0.2), lit(0x94a3b8)); w.position.set(0.12, T[1] / 2 + 0.3 - 0.0, 0); g.add(w); }
            // the gate: a thick plate from T to B
            const len = p.a * sc, gate = new THREE.Mesh(new THREE.BoxGeometry(len, 0.22, bv), lit(0xf59e0b)); gate.userData.id = 'fl_gate';
            const mid = [(T[0] + B[0]) / 2, (T[1] + B[1]) / 2]; gate.position.set(mid[0], mid[1], 0); gate.rotation.z = Math.atan2(B[1] - T[1], B[0] - T[0]); g.add(gate);
            // pressure arrows (perpendicular, from the fluid side onto the gate)
            const n = [sn, -ct], pg = new THREE.Group(); pg.userData.id = 'fl_pressure'; const pmax = Math.max(c.pb, 1);
            for (let i = 0; i <= 8; i++) { const s = i / 8, pt = [T[0] + (B[0] - T[0]) * s, T[1] + (B[1] - T[1]) * s], d = p.h1 + p.a * s * sn, pr = c.F.rho * G * d; const l = Math.max(0.05, (pr / pmax) * 2.6); if (pr > 1) pg.add(SM.dirArrow([pt[0] - n[0] * (l + 0.12), pt[1] - n[1] * (l + 0.12), 0], [n[0], n[1], 0], l, 0xdc2626, 0.05)); }
            g.add(pg);
            // resultant at the centre of pressure
            const sCp = c.dcp / p.a, cp = [T[0] + (B[0] - T[0]) * sCp, T[1] + (B[1] - T[1]) * sCp], rg = new THREE.Group(); rg.userData.id = 'fl_cp';
            rg.add(SM.dirArrow([cp[0] - n[0] * 2.2, cp[1] - n[1] * 2.2, bv / 2 + 0.2], [n[0], n[1], 0], 2.1, 0xf97316, 0.1));
            const cg = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 10), lit(0xf97316)); cg.position.set(cp[0], cp[1], bv / 2 + 0.2); rg.add(cg);
            const cen = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), lit(0x16a34a)); cen.position.set(mid[0], mid[1], bv / 2 + 0.2); rg.add(cen);
            g.add(rg);
            // hinge + holding force
            const hg = new THREE.Group(); hg.userData.id = 'fl_hinge'; const hp = p.hinge === 'top' ? T : B, fp = p.hinge === 'top' ? B : T;
            const hb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 12), lit(0x1f2937)); hb.position.set(hp[0], hp[1], bv / 2 + 0.1); hg.add(hb);
            hg.add(SM.dirArrow([fp[0] + n[0] * 2.4, fp[1] + n[1] * 2.4, bv / 2 + 0.2], [-n[0], -n[1], 0], 2.2, 0x16a34a, 0.1));
            g.add(hg);
            // surface line marker
            const surf = new THREE.Mesh(new THREE.BoxGeometry(9, 0.04, bv + 0.4), lit(0x0ea5e9)); surf.position.set(-4.5, 0, 0); g.add(surf);
            g.userData.fit = { w: 6.2, h: 3.6, dir: [0.2, 0.1, 1] }; g.userData.target = [-2.5, -2.0, 0];
            return g;
        },
        readouts(p) {
            const c = hydCalc(p), kN = (v) => fmt(v / 1000, 2) + ' kN';
            return [
                { k: L2('Depth of the centroid h_c', 'عمق المركز الهندسي h_c'), v: fmt(c.hc, 2) + ' m' },
                { k: L2('Pressure at the top edge  /  bottom edge', 'الضغط عند الحافة العليا  /  السفلى'), v: fmt(c.pt / 1000, 1) + ' / ' + fmt(c.pb / 1000, 1) + ' kPa' },
                { k: L2('Total force F = ρ·g·h_c·A', 'القوة الكلية F = ρ·g·h_c·A'), v: kN(c.force) },
                { k: L2('Horizontal component  ·  vertical component (weight above)', 'المركبة الأفقية  ·  الشاقولية (وزن ما فوقها)'), v: kN(c.Fh) + '  ·  ' + kN(c.Fv) },
                { k: L2('Centre of pressure from the top edge  (a/2 = centroid)', 'مركز الضغط من الحافة العليا  (a/2 = المركز الهندسي)'), v: fmt(c.dcp, 3) + ' m  (' + fmt(p.a / 2, 2) + ')' },
                { k: L2('Centre of pressure below the centroid by I/(y_c·A)', 'مركز الضغط تحت المركز الهندسي بمقدار I/(y_c·A)'), v: fmt((c.dcp - p.a / 2) * 1000, 0) + ' mm' },
                { k: L2('Holding force P at the free edge', 'قوة الإمساك P عند الحافة الحرة'), v: kN(c.P) },
                { k: L2('Hinge reaction', 'ردّ فعل المفصلة'), v: kN(c.R) },
                { k: L2('Moment about the hinge', 'العزم حول المفصلة'), v: fmt((c.force * (p.hinge === 'top' ? c.dcp : p.a - c.dcp)) / 1000, 2) + ' kN·m' }
            ];
        },
        bom: () => [],
        challenges: () => [
            CH('Keep the holding force at the free edge below 20 kN with a gate at least 2 m high and 1.5 m wide (vertical, hinge at the top).', 'أبقِ قوة الإمساك عند الحافة الحرة أقل من 20 kN مع بوابة ارتفاعها 2 m على الأقل وعرضها 1.5 m (شاقولية، المفصلة في الأعلى).', (p) => { const c = hydCalc(p); return p.a >= 2 && p.b >= 1.5 && p.theta === 90 && p.hinge === 'top' && c.P < 20000; }),
            CH('Go deep: make the centre of pressure lie within 2 % of the gate height from the centroid.', 'انزل عميقاً: اجعل مركز الضغط ضمن 2% من ارتفاع البوابة عن مركزها الهندسي.', (p) => { const c = hydCalc(p); return (c.dcp - p.a / 2) / p.a <= 0.02; }),
            CH('Tilt the gate so that the weight of the liquid above it (vertical force) exceeds the horizontal force.', 'أمِل البوابة بحيث يتجاوز وزن السائل فوقها (القوة الشاقولية) القوة الأفقية.', (p) => { const c = hydCalc(p); return c.Fv > c.Fh; }),
            CH('Use mercury and get a total force of at least 100 kN on a gate of 1 m² or less.', 'استعمل الزئبق واحصل على قوة كلية 100 kN على الأقل على بوابة مساحتها 1 m² أو أقل.', (p) => { const c = hydCalc(p); return p.fluid === 'hg' && c.A <= 1.0001 && c.force >= 100000; })
        ],
        panels(p) {
            const c = hydCalc(p), pp_ = [], fv = [], cpv = [];
            for (let i = 0; i <= 20; i++) { const s = (p.a * i) / 20; pp_.push([s, (c.F.rho * G * (p.h1 + s * c.s)) / 1000]); }
            for (let i = 0; i <= 24; i++) { const h = (6 * i) / 24, q = hydCalc(Object.assign({}, p, { h1: h })); fv.push([h, q.force / 1000]); cpv.push([h, ((q.dcp - p.a / 2) / p.a) * 100]); }
            return [
                { type: 'line', h: 180, title: L2('Pressure along the gate', 'الضغط على طول البوابة'), unit: 'kPa', xlabel: L2('Distance from the top edge (m)', 'المسافة من الحافة العليا (m)'), xmin: 0, xmax: p.a, ymin: 0, series: [{ label: 'p(s)', pts: pp_, fill: true }], marks: [{ x: c.dcp, y: (c.F.rho * G * (p.h1 + c.dcp * c.s)) / 1000, label: 'CP' }] },
                { type: 'line', h: 170, title: L2('Total force vs depth of the gate', 'القوة الكلية مقابل عمق البوابة'), unit: 'kN', xlabel: L2('Depth of the top edge h₁ (m)', 'عمق الحافة العلوية h₁ (m)'), xmin: 0, xmax: 6, ymin: 0, series: [{ label: 'F', pts: fv, fill: true }], marks: [{ x: p.h1, y: c.force / 1000, label: fmt(c.force / 1000, 1) }] },
                { type: 'line', h: 170, title: L2('Centre of pressure below the centroid', 'مركز الضغط تحت المركز الهندسي'), unit: '% of a', xlabel: L2('Depth of the top edge h₁ (m)', 'عمق الحافة العلوية h₁ (m)'), xmin: 0, xmax: 6, ymin: 0, series: [{ label: 'offset', pts: cpv, fill: true }], marks: [{ x: p.h1, y: ((c.dcp - p.a / 2) / p.a) * 100, label: fmt(((c.dcp - p.a / 2) / p.a) * 100, 1) }] }
            ];
        }
    });

    /* =====================================================================================
     * 5. BUOYANCY & STABILITY (rectangular barge cross-section, exact heeled geometry)
     * ===================================================================================== */
    function clipArea(poly, w) { // polygon area & centroid of the part with y <= w
        const out = [];
        for (let i = 0; i < poly.length; i++) {
            const a = poly[i], b = poly[(i + 1) % poly.length], ina = a[1] <= w, inb = b[1] <= w;
            if (ina) out.push(a);
            if (ina !== inb) { const t = (w - a[1]) / (b[1] - a[1]); out.push([a[0] + t * (b[0] - a[0]), w]); }
        }
        let A = 0, cx = 0, cy = 0;
        for (let i = 0; i < out.length; i++) { const a = out[i], b = out[(i + 1) % out.length], cr = a[0] * b[1] - b[0] * a[1]; A += cr; cx += (a[0] + b[0]) * cr; cy += (a[1] + b[1]) * cr; }
        A /= 2; if (Math.abs(A) < 1e-12) return { A: 0, x: 0, y: 0 };
        return { A, x: cx / (6 * A), y: cy / (6 * A) };
    }
    function heel(B, H, A0, KG, phi) {
        const c = Math.cos(phi), s = Math.sin(phi), rot = ([x, y]) => [x * c + y * s, -x * s + y * c];
        const poly = [[-B / 2, 0], [B / 2, 0], [B / 2, H], [-B / 2, H]].map(rot);
        let lo = Math.min(...poly.map((q) => q[1])), hi = Math.max(...poly.map((q) => q[1]));
        for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (Math.abs(clipArea(poly, mid).A) < A0) lo = mid; else hi = mid; }
        const w = (lo + hi) / 2, r = clipArea(poly, w), G_ = [KG * s, KG * c];
        return { w, xb: Math.abs(r.x) < 1e-12 ? 0 : r.x, yb: r.y, GZ: r.x - G_[0], G: G_, poly };
    }
    const buoyCalc = memo((p) => {
        const F = FL.FLUIDS[p.fluid], B = p.B, H = p.H, Lb = p.Lb, m = p.load * 1000, A0full = B * H, A0 = Math.min(m / (F.rho * Lb), A0full * 0.999), sinks = m / (F.rho * Lb) > A0full;
        const d = A0 / B, KB = d / 2, BM = (B * B) / (12 * d), KG = p.kg * H, GM = KB + BM - KG, phi = (p.phi * PI) / 180;
        const curve = []; let gzmax = 0, angmax = 0, vanish = 90, deck = 90, found = false;
        for (let a = 0; a <= 90; a += 2) { const r = heel(B, H, A0, KG, (a * PI) / 180); curve.push([a, r.GZ]); if (r.GZ > gzmax) { gzmax = r.GZ; angmax = a; } if (!found && a > 4 && r.GZ <= 0) { vanish = a; found = true; } }
        // deck edge immersion angle: first angle where the lower deck corner touches the waterline
        for (let a = 1; a <= 90; a++) { const r = heel(B, H, A0, KG, (a * PI) / 180), c = Math.cos((a * PI) / 180), s = Math.sin((a * PI) / 180), yc = -(B / 2) * s + H * c; if (yc <= r.w) { deck = a; break; } }
        const cur = heel(B, H, A0, KG, phi), disp = m / 1000;
        return { F, B, H, Lb, A0, d, KB, BM, KM: KB + BM, KG, GM, free: H - d, sinks, curve, gzmax, angmax, vanish: GM < 0 ? 0 : found ? vanish : 90, deck, cur, GZ: cur.GZ, disp, Mr: cur.GZ * m * G };
    });
    FL.addParts({
        fl_hull: pp('Barge hull', 'جسم الصندل', 'A box-shaped barge shown in cross-section. It floats until the displaced water weighs as much as the barge (Archimedes).', 'صندل بشكل صندوق يظهر مقطعه. يطفو إلى أن يساوي وزن الماء المزاح وزن الصندل (أرخميدس).', 'Carries the load; the submerged shape sets the buoyancy force and where it acts.', 'يحمل الحمل؛ شكل الجزء المغمور يحدد قوة الطفو ومكان تأثيرها.', 'Flooding through deck openings after the deck edge is immersed; capsizing when GM is negative; overloading (no freeboard).', 'غمر المياه عبر فتحات السطح بعد غمر حافة السطح؛ الانقلاب عند GM سالبة؛ الحمولة الزائدة (انعدام الحافة الحرة).'),
        fl_G: pp('Centre of gravity G', 'مركز الثقل G', 'The yellow ball: where the whole weight acts. Putting the cargo high raises G and makes the vessel tender.', 'الكرة الصفراء: نقطة تأثير الوزن كله. وضع الحمولة عالياً يرفع G ويجعل السفينة غير مستقرة.', 'Weight W = m·g acts downward through G.', 'الوزن W = m·g يؤثر نحو الأسفل عبر G.', 'Cargo shifting or free surfaces raise G effectively.', 'انزياح الحمولة أو الأسطح الحرة يرفعان G فعلياً.'),
        fl_B: pp('Centre of buoyancy B', 'مركز الطفو B', 'The blue ball: the centroid of the submerged volume. When the ship heels, B moves toward the low side.', 'الكرة الزرقاء: مركز ثقل الحجم المغمور. عند ميلان السفينة يتحرك B نحو الجهة المنخفضة.', 'Buoyancy force acts upward through B. The horizontal gap GZ between B and G gives the righting arm.', 'قوة الطفو تؤثر للأعلى عبر B. الفجوة الأفقية GZ بين B وG تعطي ذراع الإرجاع.', 'If B does not move far enough sideways the vessel capsizes.', 'إذا لم يتحرك B بما يكفي جانبياً تنقلب السفينة.'),
        fl_M: pp('Metacentre M', 'المركز الميتاسنتري M', 'The red ball: for small heel angles B swings about M. If M is above G (GM > 0) the ship rights itself.', 'الكرة الحمراء: عند زوايا الميلان الصغيرة يتأرجح B حول M. إذا كانت M فوق G (GM > 0) تعيد السفينة نفسها للاعتدال.', 'GM = KB + BM − KG, with BM = I/V.', 'GM = KB + BM − KG حيث BM = I/V.', 'Negative GM: the ship lolls or capsizes.', 'GM سالبة: تميل السفينة أو تنقلب.'),
        fl_water: pp('Water surface', 'سطح الماء', 'Translucent water. The part of the hull below it is the displaced volume.', 'ماء شفاف. الجزء من الهيكل تحتها هو الحجم المزاح.', 'Provides the buoyancy.', 'يوفّر الطفو.')
    });
    FL.add('buoy', L2('Buoyancy & stability', 'الطفو والاتزان'), {
        controls: () => [
            { type: 'title', label: L2('Barge', 'الصندل') },
            { id: 'fluid', type: 'select', label: L2('Liquid', 'السائل'), options: FL.fluidOptions(['water', 'sea', 'oil']), value: 'sea', rebuild: true },
            { id: 'B', type: 'range', label: L2('Beam (width) B', 'العرض B'), min: 2, max: 12, step: 0.5, value: 6, unit: 'm', rebuild: true },
            { id: 'H', type: 'range', label: L2('Depth (height) H', 'العمق H'), min: 1, max: 5, step: 0.25, value: 3, unit: 'm', rebuild: true },
            { id: 'Lb', type: 'range', label: L2('Length', 'الطول'), min: 5, max: 50, step: 1, value: 20, unit: 'm', rebuild: true },
            { type: 'title', label: L2('Loading', 'التحميل') },
            { id: 'load', type: 'range', label: L2('Total mass (barge + cargo)', 'الكتلة الكلية (صندل + حمولة)'), min: 5, max: 600, step: 5, value: 150, unit: 't', rebuild: true },
            { id: 'kg', type: 'range', label: L2('Centre of gravity height KG ÷ H', 'ارتفاع مركز الثقل KG ÷ H'), min: 0.1, max: 0.95, step: 0.05, value: 0.5, rebuild: true },
            { type: 'title', label: L2('Heel', 'الميلان') },
            { id: 'phi', type: 'range', label: L2('Heel angle φ', 'زاوية الميلان φ'), min: 0, max: 90, step: 1, value: 15, unit: '°', rebuild: true }
        ],
        build(p) {
            const c = buoyCalc(p), g = new THREE.Group(), sc = 0.85, phi = c.cur.GZ !== undefined ? (p.phi * PI) / 180 : 0, cr = c.cur, depthZ = 3.2;
            const hull = new THREE.Group(), shp = new THREE.Shape();
            shp.moveTo(-p.B / 2 * sc, 0); shp.lineTo(p.B / 2 * sc, 0); shp.lineTo(p.B / 2 * sc, p.H * sc); shp.lineTo(-p.B / 2 * sc, p.H * sc); shp.closePath();
            const hole = new THREE.Path(); const t = 0.08; hole.moveTo(-p.B / 2 * sc + t, t); hole.lineTo(-p.B / 2 * sc + t, p.H * sc + 1); hole.lineTo(p.B / 2 * sc - t, p.H * sc + 1); hole.lineTo(p.B / 2 * sc - t, t); hole.closePath();
            const shell = new THREE.Mesh(new THREE.ExtrudeGeometry(shp, { depth: depthZ, bevelEnabled: false }), lit(0xf59e0b, { roughness: 0.6 })); shell.position.z = -depthZ / 2; shell.userData.id = 'fl_hull'; hull.add(shell);
            hull.rotation.z = -phi; g.add(hull);
            // everything is expressed with the waterline at y = 0 → shift by −w
            const yoff = -cr.w * sc; hull.position.set(0, yoff, 0);
            const water = new THREE.Mesh(new THREE.BoxGeometry(14, 5, depthZ + 1), trans(0x38bdf8, 0.4)); water.position.set(0, -2.5, 0); water.userData.id = 'fl_water'; g.add(water);
            const surf = new THREE.Mesh(new THREE.BoxGeometry(14, 0.04, depthZ + 1), lit(0x0ea5e9)); g.add(surf);
            const ball = (x, y, col, id, r) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r || 0.17, 14, 12), lit(col)); m.position.set(x * sc, y * sc + yoff, depthZ / 2 + 0.25); m.userData.id = id; g.add(m); return m; };
            const Gp = cr.G, Bp = [cr.xb, cr.yb], sn = Math.sin(phi), cs = Math.cos(phi), KM = c.KM;
            ball(Gp[0], Gp[1], 0xfacc15, 'fl_G', 0.2); ball(Bp[0], Bp[1], 0x2563eb, 'fl_B', 0.2); ball(KM * sn, KM * cs, 0xdc2626, 'fl_M', 0.16);
            // weight (down at G), buoyancy (up at B), lever arm
            const wl = 1.6; g.add(SM.dirArrow([Gp[0] * sc, Gp[1] * sc + yoff + wl, depthZ / 2 + 0.25], [0, -1, 0], wl, 0xca8a04, 0.07));
            g.add(SM.dirArrow([Bp[0] * sc, Bp[1] * sc + yoff - wl - 0.2, depthZ / 2 + 0.25], [0, 1, 0], wl, 0x1d4ed8, 0.07));
            const gz = Math.abs(cr.GZ) * sc; if (gz > 0.02) { const bar = new THREE.Mesh(new THREE.BoxGeometry(gz, 0.06, 0.06), lit(cr.GZ > 0 ? 0x16a34a : 0xdc2626)); bar.position.set((Gp[0] * sc + Bp[0] * sc) / 2 * 1, Bp[1] * sc + yoff - 0.9 + 0, depthZ / 2 + 0.25); bar.position.x = (Gp[0] + Bp[0]) / 2 * sc; g.add(bar); }
            g.userData.fit = { w: 6.6, h: 3.4, dir: [0.05, 0.1, 1] }; g.userData.target = [0, 0.2, 0];
            return g;
        },
        readouts(p) {
            const c = buoyCalc(p), lang = window.getLang ? window.getLang() : 'en', gmS = c.GM > 0.5 ? 'ok' : c.GM > 0 ? 'warn' : 'bad';
            return [
                { k: L2('Status', 'الحالة'), v: c.sinks ? (lang === 'ar' ? 'يغرق! الحمولة أكبر من الطفو الأقصى' : 'SINKS — heavier than the buoyancy available') : c.GM < 0 ? (lang === 'ar' ? 'غير مستقر (GM سالبة)' : 'UNSTABLE (negative GM)') : (lang === 'ar' ? 'يطفو ومستقر' : 'floats and is stable'), state: c.sinks || c.GM < 0 ? 'bad' : 'ok' },
                { k: L2('Draft d  ·  freeboard', 'الغاطس d  ·  الحافة الحرة'), v: fmt(c.d, 2) + ' m  ·  ' + fmt(c.free, 2) + ' m', state: c.free < 0.3 ? 'bad' : c.free < 0.6 ? 'warn' : 'ok' },
                { k: L2('Buoyancy = weight  ρ·g·V', 'الطفو = الوزن  ρ·g·V'), v: fmt(p.load * G, 0) + ' kN' },
                { k: L2('KB = d/2  ·  BM = B²/(12·d)  ·  KM', 'KB = d/2  ·  BM = B²/(12·d)  ·  KM'), v: fmt(c.KB, 2) + '  ·  ' + fmt(c.BM, 2) + '  ·  ' + fmt(c.KM, 2) + ' m' },
                { k: L2('KG (centre of gravity height)', 'KG (ارتفاع مركز الثقل)'), v: fmt(c.KG, 2) + ' m' },
                { k: L2('Metacentric height GM = KM − KG', 'الارتفاع الميتاسنتري GM = KM − KG'), v: fmt(c.GM, 2) + ' m', state: gmS },
                { k: L2('Righting arm GZ at φ = ' + p.phi + '°', 'ذراع الإرجاع GZ عند φ = ' + p.phi + '°'), v: fmt(c.GZ, 3) + ' m  (' + fmt(c.Mr / 1000, 0) + ' kN·m)', state: c.GZ < 0 ? 'bad' : 'ok' },
                { k: L2('Max GZ  at angle', 'أكبر GZ  عند الزاوية'), v: fmt(c.gzmax, 2) + ' m @ ' + c.angmax + '°' },
                { k: L2('Deck-edge immersion angle', 'زاوية غمر حافة السطح'), v: c.deck < 90 ? c.deck + '°' : '—' },
                { k: L2('Angle of vanishing stability', 'زاوية انعدام الاتزان'), v: c.vanish < 90 ? c.vanish + '°' : '> 90°', state: c.vanish < 40 ? 'warn' : 'ok' }
            ];
        },
        bom: () => [],
        challenges: () => [
            CH('Carry a heavy cargo safely: total mass ≥ 300 t with GM ≥ 1 m and at least 0.6 m of freeboard.', 'انقل حمولة ثقيلة بأمان: كتلة كلية ≥ 300 t مع GM ≥ 1 m وحافة حرة 0.6 m على الأقل.', (p) => { const c = buoyCalc(p); return !c.sinks && p.load >= 300 && c.GM >= 1 && c.free >= 0.6; }),
            CH('Capsize it: raise the centre of gravity until GM becomes negative (while it still floats).', 'اقلبها: ارفع مركز الثقل حتى تصبح GM سالبة (وهي ما زالت تطفو).', (p) => { const c = buoyCalc(p); return !c.sinks && c.GM < 0; }),
            CH('Design a very safe ship with the cargo stowed high (KG ≥ 0.6·H): stability must last up to at least 60° of heel (vanishing angle ≥ 60°).', 'صمّم سفينة آمنة جداً والحمولة عالية (KG ≥ 0.6·H): يجب أن يستمر الاتزان حتى ميلان 60° على الأقل (زاوية الانعدام ≥ 60°).', (p) => { const c = buoyCalc(p); return !c.sinks && p.kg >= 0.6 && c.vanish >= 60 && c.GM > 0; }),
            CH('Load it to the limit: freeboard under 0.3 m but still GM > 0.3 m.', 'حمّلها إلى الحد: حافة حرة أقل من 0.3 m لكن GM ما زالت > 0.3 m.', (p) => { const c = buoyCalc(p); return !c.sinks && c.free < 0.3 && c.GM > 0.3; })
        ],
        panels(p) {
            const c = buoyCalc(p), gm = [], rho = c.F.rho;
            for (let a = 0; a <= 90; a += 2) gm.push([a, Math.max(c.GM, 0) * Math.sin((a * PI) / 180)]);
            const gmv = []; for (let t = 5; t <= 600; t += 15) { const q = buoyCalc(Object.assign({}, p, { load: t })); if (!q.sinks && q.d >= 0.3) gmv.push([t, q.GM]); }
            const ymx = Math.max(0.2, c.gzmax * 1.15);
            return [
                { type: 'line', h: 200, title: L2('Righting arm curve GZ(φ)', 'منحنى ذراع الإرجاع GZ(φ)'), unit: 'm', xlabel: L2('Heel angle φ (°)', 'زاوية الميلان φ (°)'), xmin: 0, xmax: 90, ymin: Math.min(-0.2, Math.min(...c.curve.map((q) => q[1])) * 1.1), ymax: ymx, series: [{ label: 'GZ', pts: c.curve, fill: true }, { label: L2('GM·sin φ (small angle)', 'GM·sin φ (زاوية صغيرة)'), pts: gm.filter((q) => q[1] <= ymx * 1.2) }], marks: [{ x: p.phi, y: c.GZ, label: fmt(c.GZ, 2) }] },
                { type: 'line', h: 170, title: L2('GM vs total mass (draft)', 'GM مقابل الكتلة الكلية (الغاطس)'), unit: 'm', xlabel: L2('Total mass (t)', 'الكتلة الكلية (t)'), xmin: 5, xmax: 600, ymin: Math.min(0, ...gmv.map((q) => q[1])) - 0.2, ymax: Math.max(1, ...gmv.map((q) => q[1])) * 1.1, series: [{ label: 'GM', pts: gmv, fill: true }, { label: '0', pts: [[5, 0], [600, 0]] }], marks: c.sinks ? [] : [{ x: p.load, y: c.GM, label: fmt(c.GM, 2) }] }
            ];
        }
    });

    /* =====================================================================================
     * 6. DRAG ON BODIES
     * ===================================================================================== */
    const lg = (x) => Math.log10(x);
    const CD = {
        sphere: (Re) => {
            Re = Math.max(Re, 1e-3); let cd = (24 / Re) * (1 + 0.15 * Math.pow(Re, 0.687)) + 0.42 / (1 + 42500 * Math.pow(Re, -1.16));
            if (Re > 2e5) { const t = clamp((lg(Re) - 5.3) / 0.4, 0, 1), post = 0.1 + 0.12 * clamp((lg(Re) - 5.7) / 2, 0, 1); cd = cd * (1 - t) + post * t; }
            return cd;
        },
        cyl: (Re) => {
            Re = Math.max(Re, 1e-3); let cd = Re < 0.5 ? (8 * PI) / (Re * (2.002 - Math.log(Re))) : 1 + 10 / Math.pow(Re, 2 / 3);
            if (Re > 2e5) { const t = clamp((lg(Re) - 5.3) / 0.4, 0, 1), post = 0.35 + 0.35 * clamp((lg(Re) - 6.7) / 1.3, 0, 1); cd = cd * (1 - t) + post * t; }
            return cd;
        },
        disc: (Re) => 1.17 + 20.4 / Math.max(Re, 1e-3),
        strut: (Re) => 0.06 + 3 / Math.sqrt(Math.max(Re, 1e-2))
    };
    const dragArea = (sh, D) => (sh === 'sphere' || sh === 'disc' ? (PI * D * D) / 4 : sh === 'cyl' ? 3 * D * D : D * D);
    const dragCalc = memo((p) => {
        const F = FL.FLUIDS[p.fluid], D = p.D / 1000, Re = (F.rho * p.U * D) / F.mu, Cd = CD[p.shape](Re), A = dragArea(p.shape, D), q = 0.5 * F.rho * p.U * p.U, Fd = q * Cd * A;
        const all = ['sphere', 'cyl', 'disc', 'strut'].map((s) => ({ s, Cd: CD[s](Re), F: q * CD[s](Re) * dragArea(s, D) }));
        const regime = Re < 1 ? L2('Creeping flow — no separation', 'جريان زاحف — بلا انفصال') : Re < 20 ? L2('Attached laminar flow', 'جريان صفحي ملتصق') : Re < 1000 ? L2('Steady / periodic vortex wake', 'ذيل دوامات ثابت / دوري') : Re < 2e5 ? L2('Laminar boundary layer, wide wake', 'طبقة حدّية صفحية، ذيل عريض') : Re < 5e5 ? L2('DRAG CRISIS — boundary layer turns turbulent', 'أزمة السحب — تتحول الطبقة الحدّية لمضطربة') : L2('Turbulent boundary layer, narrow wake', 'طبقة حدّية مضطربة، ذيل ضيق');
        return { F, D, Re, Cd, A, q, Fd, P: Fd * p.U, all, regime };
    });
    FL.addParts({
        fl_body: pp('Test body', 'الجسم المختبَر', 'The body held in the stream. Streamlined shapes keep the flow attached; blunt shapes leave a wide, low-pressure wake behind them.', 'الجسم المثبّت في الجريان. الأشكال الانسيابية تبقي الجريان ملتصقاً؛ أما الأشكال الكتلية فتترك خلفها ذيلاً عريضاً منخفض الضغط.', 'Experiences drag F = ½·ρ·U²·C_d·A.', 'يتعرض لسحب F = ½·ρ·U²·C_d·A.', 'Vortex-induced vibration of cylinders, galloping, large drag at the drag crisis for blunt shapes.', 'اهتزاز ناتج عن الدوامات في الأسطوانات، الجلوب، وسحب كبير عند أزمة السحب للأشكال الكتلية.'),
        fl_streak: pp('Streamlines (particles)', 'خطوط الانسياب (جسيمات)', 'Cyan dots follow the flow around the body (schematic potential flow). Red dots are in the wake: slower and turbulent.', 'النقاط السماوية تتبع الجريان حول الجسم (جريان جهدي تخطيطي). النقاط الحمراء في الذيل: أبطأ ومضطربة.', 'Show where the flow is blocked and how wide the wake is.', 'تُظهر أين يُعاق الجريان وما اتساع الذيل.'),
        fl_force: pp('Drag force', 'قوة السحب', 'The orange arrow behind the body is the drag; its length follows the force.', 'السهم البرتقالي خلف الجسم هو السحب؛ طوله يتبع القوة.', 'Pushes the body downstream; power needed to hold it moving = F·U.', 'تدفع الجسم مع التيار؛ الاستطاعة اللازمة لإبقائه متحركاً = F·U.')
    });
    FL.add('drag', L2('Drag on bodies', 'السحب على الأجسام'), {
        controls: () => [
            { type: 'title', label: L2('Body', 'الجسم') },
            { id: 'shape', type: 'select', label: L2('Shape', 'الشكل'), options: [{ v: 'sphere', label: L2('Sphere', 'كرة') }, { v: 'cyl', label: L2('Cylinder (across the flow)', 'أسطوانة (عمودية على الجريان)') }, { v: 'disc', label: L2('Flat disc (facing the flow)', 'قرص مسطّح (مواجه للجريان)') }, { v: 'strut', label: L2('Streamlined strut', 'عمود انسيابي') }], value: 'sphere', rebuild: true },
            { id: 'D', type: 'range', label: L2('Size D (diameter / thickness)', 'المقاس D (قطر / سماكة)'), min: 10, max: 1000, step: 10, value: 200, unit: 'mm', rebuild: true },
            { type: 'title', label: L2('Flow', 'الجريان') },
            { id: 'fluid', type: 'select', label: L2('Fluid', 'المائع'), options: FL.fluidOptions(['air', 'water', 'oil', 'gly']), value: 'air', rebuild: true },
            { id: 'U', type: 'range', label: L2('Free-stream speed U', 'سرعة التيار U'), min: 0.1, max: 60, step: 0.1, value: 10, unit: 'm/s', rebuild: true }
        ],
        build(p) {
            const c = dragCalc(p), g = new THREE.Group(), R = p.shape === 'disc' ? 1.2 : 1.0, spread = 2.6;
            let body;
            if (p.shape === 'sphere') body = new THREE.Mesh(new THREE.SphereGeometry(1, 36, 28), lit(0xf59e0b, { roughness: 0.4 }));
            else if (p.shape === 'cyl') { body = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 4.6, 36), lit(0xf59e0b, { roughness: 0.4 })); body.rotation.x = PI / 2; }
            else if (p.shape === 'disc') { body = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.14, 40), lit(0xf59e0b)); body.rotation.z = PI / 2; }
            else {
                const sh = new THREE.Shape(), n = 40, tt = 0.25, ch = 4.0; const yt = (x) => 5 * tt * ch * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x * x * x - 0.1036 * x * x * x * x);
                for (let i = 0; i <= n; i++) { const x = i / n; const px = -2 + x * ch, py = yt(x); i ? sh.lineTo(px, py) : sh.moveTo(px, py); }
                for (let i = n; i >= 0; i--) { const x = i / n; sh.lineTo(-2 + x * ch, -yt(x)); }
                body = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 4.6, bevelEnabled: false }), lit(0xf59e0b, { roughness: 0.4 })); body.position.z = -2.3;
            }
            body.userData.id = 'fl_body'; g.add(body);
            // drag arrow behind the body (length follows the force relative to the disc reference)
            const ref = 0.5 * c.F.rho * p.U * p.U * 1.2 * dragArea('disc', c.D), ln = clamp(0.6 + 2.4 * (c.Fd / Math.max(ref, 1e-9)), 0.6, 3.2), ag = new THREE.Group(); ag.userData.id = 'fl_force';
            ag.add(SM.dirArrow([R + 0.3, 2.25, 0], [1, 0, 0], ln, 0xf97316, 0.1)); g.add(ag);
            // particles following potential flow + a wake
            const N = 480, P = FL.Particles(N, 0.3), part = [];
            const reset = (q, fresh) => { q.x = fresh ? -7 + rand() * 14 : -7; q.y = (rand() - 0.5) * 2 * spread; q.z = (rand() - 0.5) * 2 * spread; };
            for (let i = 0; i < N; i++) { const q = {}; reset(q, true); part.push(q); }
            const Uv = 0.8 + (p.U / 60) * 3.2, wk = clamp(c.Cd * 0.55, 0.05, 0.92), turb = c.Re > 1000 ? 1 : 0, cyl2d = p.shape === 'cyl';
            const Rf = p.shape === 'strut' ? 0.85 : R;
            const field = (q) => {
                let r2, u, v, w;
                if (cyl2d) { r2 = q.x * q.x + q.y * q.y; const r4 = r2 * r2; u = 1 - (Rf * Rf * (q.x * q.x - q.y * q.y)) / r4; v = (-2 * Rf * Rf * q.x * q.y) / r4; w = 0; }
                else { const r = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z), r3 = r * r * r, r5 = r3 * r * r, k = (Rf * Rf * Rf) / 2; u = 1 + k / r3 - (3 * k * q.x * q.x) / r5; v = (-3 * k * q.x * q.y) / r5; w = (-3 * k * q.x * q.z) / r5; }
                return [u, v, w];
            };
            const place = () => { for (let i = 0; i < N; i++) { const q = part[i]; P.pos[i * 3] = q.x; P.pos[i * 3 + 1] = q.y; P.pos[i * 3 + 2] = q.z; const wake = q.wake || 0; P.col[i * 3] = 0.2 + 0.8 * wake; P.col[i * 3 + 1] = 0.85 - 0.55 * wake; P.col[i * 3 + 2] = 1 - 0.75 * wake; } P.commit(); };
            const step = (dt) => {
                for (let i = 0; i < N; i++) {
                    const q = part[i], rr = cyl2d ? Math.hypot(q.x, q.y) : Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z);
                    if (rr < Rf * 1.02) { const k = (Rf * 1.04) / Math.max(rr, 1e-3); q.x *= k; q.y *= k; if (!cyl2d) q.z *= k; }
                    const f = field(q), perp = cyl2d ? Math.hypot(q.y, 0) : Math.hypot(q.y, q.z), wr = Rf * (1 + 0.1 * Math.max(0, q.x)), inWake = q.x > 0 && perp < wr ? Math.exp(-q.x / 7) : 0;
                    q.wake = inWake;
                    const d = 1 - wk * inWake, jit = turb * inWake * Cdjit;
                    q.x += Uv * f[0] * d * dt; q.y += Uv * (f[1] * d + (rand() - 0.5) * jit) * dt; q.z += Uv * (f[2] * d + (rand() - 0.5) * jit * (cyl2d ? 0.2 : 1)) * dt;
                    if (cyl2d) q.z = clamp(q.z, -spread, spread);
                    if (q.x > 7.5 || Math.abs(q.y) > spread * 1.3 || Math.abs(q.z) > spread * 1.3) reset(q, false);
                }
            };
            const Cdjit = clamp(c.Cd, 0.1, 1.5) * 2.2;
            for (let k = 0; k < 40; k++) step(0.05);
            place(); const sg = new THREE.Group(); sg.userData.id = 'fl_streak'; sg.add(P.pts); g.add(sg);
            g.userData.update = (dt) => { let t = Math.min(dt, 0.2); while (t > 0) { const h = Math.min(0.04, t); step(h); t -= h; } place(); };
            g.userData.fit = { w: 6.2, h: 3.4, dir: [0.35, 0.3, 1] }; g.userData.target = [0, 0, 0];
            return g;
        },
        readouts(p) {
            const c = dragCalc(p), lang = window.getLang ? window.getLang() : 'en', sphereCrisis = p.shape !== 'strut' && p.shape !== 'disc' && c.Re > 2e5 && c.Re < 5e5;
            return [
                { k: L2('Reynolds number Re = ρ·U·D/μ', 'رقم رينولدز Re = ρ·U·D/μ'), v: fmt(c.Re, c.Re < 100 ? 2 : 0) },
                { k: L2('Flow regime', 'نظام الجريان'), v: lang === 'ar' ? c.regime.ar : c.regime.en, state: sphereCrisis ? 'warn' : 'ok' },
                { k: L2('Drag coefficient C_d', 'معامل السحب C_d'), v: fmt(c.Cd, 3) },
                { k: L2('Reference area A', 'المساحة المرجعية A'), v: fmt(c.A * 1e4, 1) + ' cm²' },
                { k: L2('Dynamic pressure ½·ρ·U²', 'الضغط الديناميكي ½·ρ·U²'), v: fmt(c.q, 2) + ' Pa' },
                { k: L2('Drag force F = ½·ρ·U²·C_d·A', 'قوة السحب F = ½·ρ·U²·C_d·A'), v: fmt(c.Fd, c.Fd < 10 ? 3 : 1) + ' N' },
                { k: L2('Power to overcome drag P = F·U', 'الاستطاعة لقهر السحب P = F·U'), v: fmt(c.P, c.P < 10 ? 2 : 0) + ' W' },
                { k: L2('Same size, best shape  vs  worst shape', 'المقاس نفسه، أفضل شكل  مقابل  أسوأ شكل'), v: fmt(Math.min(...c.all.map((a) => a.F)), 3) + ' N  vs  ' + fmt(Math.max(...c.all.map((a) => a.F)), 2) + ' N' }
            ];
        },
        bom: () => [],
        challenges: () => [
            CH('Find the drag crisis of a sphere: Re between 3.5×10⁵ and 10⁶ where C_d falls below 0.2.', 'جِد أزمة السحب للكرة: Re بين 3.5×10⁵ و10⁶ حيث ينخفض C_d تحت 0.2.', (p) => { const c = dragCalc(p); return p.shape === 'sphere' && c.Re >= 3.5e5 && c.Re <= 1e6 && c.Cd < 0.2; }),
            CH('Total drag under 5 N at 20 m/s or faster in air with a body at least 100 mm thick (hint: streamline it).', 'سحب كلي أقل من 5 N عند 20 m/s أو أكثر في الهواء لجسم سماكته 100 mm على الأقل (تلميح: اجعله انسيابياً).', (p) => { const c = dragCalc(p); return p.fluid === 'air' && p.U >= 20 && p.D >= 100 && c.Fd < 5; }),
            CH('Creeping flow: get Re below 1 with a speed of at least 0.1 m/s (a very viscous fluid).', 'جريان زاحف: اجعل Re أقل من 1 مع سرعة 0.1 m/s على الأقل (مائع شديد اللزوجة).', (p) => dragCalc(p).Re < 1 && p.U >= 0.1),
            CH('Cylinder beyond the drag crisis: Re above 5×10⁵ and C_d below 0.6.', 'أسطوانة بعد أزمة السحب: Re أكبر من 5×10⁵ وC_d أقل من 0.6.', (p) => { const c = dragCalc(p); return p.shape === 'cyl' && c.Re > 5e5 && c.Cd < 0.6; })
        ],
        panels(p) {
            const c = dragCalc(p), cols = { sphere: '#0284c7', cyl: '#d97706', disc: '#7c3aed', strut: '#16a34a' }, names = { sphere: L2('sphere', 'كرة'), cyl: L2('cylinder', 'أسطوانة'), disc: L2('disc', 'قرص'), strut: L2('strut', 'عمود انسيابي') };
            const curve = (s) => { const o = []; for (let i = 0; i <= 70; i++) { const l = -1 + (8 * i) / 70; o.push([l, Math.min(100, CD[s](Math.pow(10, l)))]); } return o; };
            const fu = []; for (let i = 0; i <= 30; i++) { const U = 0.1 + ((60 - 0.1) * i) / 30, Re = (c.F.rho * U * c.D) / c.F.mu; fu.push([U, 0.5 * c.F.rho * U * U * CD[p.shape](Re) * c.A]); }
            return [
                { title: L2('Drag force of each shape (same size & speed)', 'قوة السحب لكل شكل (نفس المقاس والسرعة)'), unit: 'N', rows: c.all.map((a) => ({ label: names[a.s], value: a.F, color: cols[a.s] })) },
                { type: 'line', h: 210, title: L2('Drag coefficient vs Reynolds number', 'معامل السحب مقابل رقم رينولدز'), unit: 'C_d', xlabel: L2('log₁₀ Re', 'log₁₀ Re'), xmin: -1, xmax: 7, ymin: 0, ymax: 3, series: Object.keys(cols).map((s) => ({ label: names[s], pts: curve(s), color: cols[s] })), marks: [{ x: lg(Math.max(c.Re, 0.1)), y: Math.min(3, c.Cd), label: fmt(c.Cd, 2) }] },
                { type: 'line', h: 170, title: L2('Drag force vs speed', 'قوة السحب مقابل السرعة'), unit: 'N', xlabel: L2('Speed U (m/s)', 'السرعة U (m/s)'), xmin: 0, xmax: 60, ymin: 0, series: [{ label: 'F', pts: fu, fill: true }], marks: [{ x: p.U, y: c.Fd, label: fmt(c.Fd, 1) }] }
            ];
        }
    });
})();
