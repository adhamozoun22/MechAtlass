/* Manufacturing lab — models 6..10: surface grinding, guillotine shearing, press-brake bending, deep drawing, wire drawing.
 * Same student-first design: few controls, key numbers first. Needs manufacturing.js (MF). */
(function () {
    'use strict';
    const MF = window.MF, SM = window.SM, K = window.GearKit, FL = window.FL, HY = window.HY;
    if (!MF || !SM || !K || !FL || !HY || !window.THREE) return;
    const PI = Math.PI, L2 = MF.L2, fmt = MF.fmt, lit = SM.lit, CH = SM.CH, memo = SM.memo, clamp = MF.clamp, pp = MF.pp, T2 = FL.T2;
    const NA = L2('—', '—'), box = HY.box, cylY = HY.cylY, cylX = HY.cylX, MAT = MF.MAT;
    const V2 = (a, b) => new THREE.Vector2(a, b);

    /* =====================================================================================
     * 6. SURFACE GRINDING
     * ===================================================================================== */
    const GM = { // u0: specific grinding energy (J/mm3) at 20 um depth; qlim: burn limit heat flux (W/mm2)
        steel: { u0: 40, qlim: 100 }, stain: { u0: 50, qlim: 70 }, iron: { u0: 25, qlim: 130 }, brass: { u0: 18, qlim: 150 }
    };
    const GRIT = { coarse: { Ra: 1.1, f: 0.9 }, medium: { Ra: 0.6, f: 1.0 }, fine: { Ra: 0.3, f: 1.15 } };
    const GP = 4, GD = 200, GLEN = 200; // machine power kW, wheel diameter mm, stroke length mm
    const grCalc = memo((p) => {
        const g = GM[p.mat], gr = GRIT[p.grit], ae = p.ae / 1000, MRR = ae * p.vw * 1000 * p.b; // mm3/min
        const u = g.u0 * Math.pow(p.ae / 20, -0.3) * gr.f, P = (u * MRR) / 60 / 1000; // kW
        const lc = Math.sqrt(ae * GD), q = (P * 1000) / (p.b * lc), n = (p.vs * 60000) / (PI * GD);
        const Ra = gr.Ra * Math.pow(p.ae / 20, 0.25) * Math.pow(p.vw / 10, 0.25) * Math.pow(30 / p.vs, 0.3);
        const passes = Math.ceil(500 / p.ae), tPass = (GLEN / (p.vw * 1000)) * 60;
        return { m: MAT[p.mat], g, MRR, u, P, lc, q, n, Ra, burn: q > g.qlim, hot: q > 0.75 * g.qlim, over: P > GP, passes, tTotal: passes * tPass };
    });
    MF.addParts({
        gr_wheel: pp('Grinding wheel', 'حجر التجليخ', 'A wheel of hard abrasive grains glued together. Every grain is a tiny cutting edge that scrapes off a micro-chip.', 'عجلة من حبيبات كاشطة صلبة ملصوقة معاً. كل حبة حافة قطع صغيرة تكشط رايشاً مجهرياً.', 'Surface speed vs (m/s) and fineness of the grain decide the finish.', 'سرعة السطح vs ‏(m/s) ونعومة الحبيبات تحدد جودة السطح.', 'Too fast = the wheel can burst. Never exceed the speed printed on it.', 'السرعة الزائدة قد تفجّر الحجر. لا تتجاوز السرعة المطبوعة عليه.'),
        gr_work: pp('Workpiece', 'قطعة الشغل', 'The hardened part being finished. It slides under the wheel and a few microns are removed each pass.', 'القطعة المقساة التي تُنهى. تنزلق تحت الحجر ويُزال منها بضعة ميكرونات في كل مرور.', 'Grinding gives tolerances and finish that turning and milling cannot.', 'يعطي التجليخ دقة ونعومة لا تحققها الخراطة والتفريز.', 'Too much heat burns the surface (blue-brown colour) and can crack it.', 'الحرارة الزائدة تحرق السطح (لون أزرق-بني) وقد تشققه.'),
        gr_chuck: pp('Magnetic chuck', 'الظرف المغناطيسي', 'A table that holds steel parts with a magnet — no clamps in the way of the wheel.', 'طاولة تمسك القطع الفولاذية بمغناطيس — دون مشابك تعترض الحجر.', 'Moves the part back and forth under the wheel.', 'يحرك القطعة ذهاباً وإياباً تحت الحجر.', 'Non-magnetic metals (brass) need another way of holding.', 'المعادن غير المغناطيسية (النحاس) تحتاج طريقة تثبيت أخرى.'),
        gr_spark: pp('Sparks', 'الشرر', 'Tiny glowing chips. More sparks = more material removed and more heat.', 'رايش صغير متوهج. شرر أكثر = مادة أكثر مزالة وحرارة أكثر.', NA.en, NA.ar, NA.en, NA.ar)
    });
    MF.add('grind', L2('Surface grinding', 'التجليخ (السطحي)'), {
        controls: () => [
            { id: 'mat', type: 'select', label: L2('Material', 'المادة'), options: MF.matOpts(['steel', 'stain', 'iron', 'brass']), value: 'steel', rebuild: true },
            { id: 'grit', type: 'select', label: L2('Wheel grain', 'خشونة حبيبات الحجر'), options: [{ v: 'coarse', label: L2('Coarse (rough, fast)', 'خشنة (سريع)') }, { v: 'medium', label: L2('Medium', 'متوسطة') }, { v: 'fine', label: L2('Fine (smooth)', 'ناعمة (سطح ناعم)') }], value: 'medium', rebuild: true },
            { id: 'ae', type: 'range', label: L2('Depth of cut per pass', 'عمق القطع في المرور'), min: 5, max: 50, step: 1, value: 15, unit: 'µm', rebuild: true },
            { id: 'vw', type: 'range', label: L2('Table speed vw', 'سرعة الطاولة vw'), min: 2, max: 30, step: 1, value: 10, unit: 'm/min', rebuild: true },
            { id: 'vs', type: 'range', label: L2('Wheel surface speed vs', 'سرعة سطح الحجر vs'), min: 15, max: 45, step: 1, value: 30, unit: 'm/s', rebuild: true },
            { id: 'b', type: 'range', label: L2('Width of cut b', 'عرض القطع b'), min: 10, max: 40, step: 2, value: 20, unit: 'mm', rebuild: true }
        ],
        build(p) {
            const c = grCalc(p), g = new THREE.Group(), Rw = 1.2, ww = 0.5 + (p.b / 40) * 0.9, wy = 1.4 + Rw - 0.02 - (p.ae / 50) * 0.1;
            g.add(box(9, 0.3, 4, 0x475569, 0, -0.15, 0)); g.add(box(7.2, 0.5, 2.8, 0x1f2937, 0, 0.35, 0)); g.add(box(0.8, 4.4, 0.8, 0x334155, 0, 2.2, -1.7));
            g.add(box(0.55, 0.55, 1.9, 0x1d4ed8, 0, wy, -0.85));
            const wheel = new THREE.Group(); wheel.position.set(0, wy, 0); g.add(wheel);
            const wm = new THREE.Mesh(new THREE.CylinderGeometry(Rw, Rw, ww, 48), lit(0xb45309, { metalness: 0.05, roughness: 0.9 })); wm.rotation.x = PI / 2; wm.userData.id = 'gr_wheel'; wheel.add(wm);
            const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, ww + 0.1, 20), lit(0x94a3b8)); hub.rotation.x = PI / 2; hub.userData.id = 'gr_wheel'; wheel.add(hub);
            wheel.add(box(Rw * 0.8, 0.08, ww + 0.02, 0xfef3c7, Rw * 0.55, 0, 0, 'gr_wheel'));
            const wp = new THREE.Group(); g.add(wp);
            wp.add(box(3.6, 0.3, 2.0, 0x111827, 0, 0.75, 0, 'gr_chuck'));
            wp.add(box(3.0, 0.5, 1.6, c.burn ? 0x6d5a9a : c.m.col, 0, 1.15, 0, 'gr_work'));
            const sp = []; for (let i = 0; i < 16; i++) { const s = box(0.05, 0.05, 0.05, 0xfde047, 0, 0, 0, 'gr_spark'); s.material = new THREE.MeshBasicMaterial({ color: i % 3 ? 0xfde047 : 0xfb923c }); g.add(s); sp.push({ m: s, ph: i / 16, z: ((i * 7) % 11) / 11 - 0.5 }); }
            const amp = 1.5, nSp = clamp(c.P / 3, 0.2, 1) * sp.length;
            let t = 0;
            g.userData.update = (dt) => {
                t += dt; wp.position.x = amp * Math.sin(t * (0.4 + p.vw / 14)); wheel.rotation.z -= dt * (4 + p.vs / 4);
                sp.forEach((o, i) => { o.ph = (o.ph + dt * 1.6) % 1; const u = o.ph; o.m.visible = i < nSp; o.m.position.set(-0.1 - u * 1.5, 1.42 + u * 0.5 - u * u * 1.4, o.z * ww); });
            };
            g.userData.fit = { w: 5.0, h: 3.4, dir: [0.2, 0.25, 1] }; g.userData.target = [0, 1.9, 0];
            return g;
        },
        readouts(p) {
            const c = grCalc(p);
            return [
                { k: L2('Grinding power', 'استطاعة التجليخ'), v: fmt(c.P, 2) + ' kW', state: c.over ? 'bad' : c.P > 0.75 * GP ? 'warn' : 'ok' },
                { k: L2('Material removal rate', 'معدل إزالة المادة'), v: fmt(c.MRR / 1000, 2) + ' cm³/min' },
                { k: L2('Surface roughness Ra', 'خشونة السطح Ra'), v: fmt(c.Ra, 2) + ' µm' },
                { k: L2('Burn risk (rough estimate: typical energy and burn limits)', 'خطر الحرق (تقدير تقريبي: طاقة وحدود حرق نموذجية)'), v: c.burn ? T2('Burned — reduce depth or speed', 'محروق — قلّل العمق أو السرعة') : c.hot ? T2('Close to burning', 'قريب من الحرق') : T2('Safe', 'آمن'), state: c.burn ? 'bad' : c.hot ? 'warn' : 'ok' },
                { k: L2('Energy to remove 1 mm³', 'الطاقة لإزالة 1 mm³'), v: fmt(c.u, 0) + ' J' },
                { k: L2('Wheel speed', 'سرعة دوران الحجر'), v: fmt(c.n, 0) + ' rpm', state: p.vs > 35 ? 'warn' : 'ok' },
                { k: L2('Time to remove 0.5 mm of stock', 'زمن إزالة 0.5 mm من المادة'), v: fmt(c.tTotal, 0) + ' s' }
            ];
        },
        bom: () => [],
        challenges: () => [
            CH('Mirror finish: Ra ≤ 0.35 µm on steel with no burning and power ≤ 4 kW.', 'سطح مرآة: Ra ≤ 0.35 µm على الفولاذ دون حرق وباستطاعة ≤ 4 kW.', (p) => { const c = grCalc(p); return p.mat === 'steel' && c.Ra <= 0.35 && !c.burn && !c.over; }),
            CH('Burn the part on purpose: grind stainless steel too deep and too fast.', 'احرق القطعة عمداً: جلّخ فولاذاً لا يصدأ بعمق وسرعة زائدين.', (p) => p.mat === 'stain' && grCalc(p).burn),
            CH('Remove at least 6 cm³/min from cast iron without burning and within 4 kW.', 'أزل ما لا يقل عن 6 cm³/min من حديد الزهر دون حرق وضمن 4 kW.', (p) => { const c = grCalc(p); return p.mat === 'iron' && c.MRR >= 6000 && !c.burn && !c.over; })
        ],
        panels(p) {
            const c = grCalc(p), a = [], b = [];
            for (let ae = 5; ae <= 50; ae += 5) a.push([ae, grCalc(Object.assign({}, p, { ae })).q]);
            for (let vw = 2; vw <= 30; vw += 2) b.push([vw, grCalc(Object.assign({}, p, { vw })).Ra]);
            return [
                { type: 'line', h: 170, title: L2('Heat flux into the part vs depth of cut', 'تدفق الحرارة إلى القطعة مقابل عمق القطع'), unit: 'W/mm²', xlabel: L2('Depth of cut (µm)', 'عمق القطع (µm)'), xmin: 5, xmax: 50, ymin: 0, series: [{ label: 'q', pts: a, fill: true }, { label: L2('Burn limit', 'حد الحرق'), pts: [[5, c.g.qlim], [50, c.g.qlim]], color: '#dc2626' }], marks: [{ x: p.ae, y: c.q, label: fmt(c.q, 0) }] },
                { type: 'line', h: 170, title: L2('Roughness vs table speed', 'الخشونة مقابل سرعة الطاولة'), unit: 'µm', xlabel: L2('vw (m/min)', 'vw (m/min)'), xmin: 2, xmax: 30, ymin: 0, series: [{ label: 'Ra', pts: b, fill: true }], marks: [{ x: p.vw, y: c.Ra, label: fmt(c.Ra, 2) }] }
            ];
        }
    });

    /* =====================================================================================
     * 7. GUILLOTINE SHEARING
     * ===================================================================================== */
    const shCalc = memo((p) => {
        const m = MAT[p.mat], th = Math.tan((p.th * PI) / 180), Ff = p.L * p.t * m.tau, Fi = (0.5 * m.tau * p.t * p.t) / th, F = Math.min(Ff, Fi);
        const burr = p.t * (0.02 + 0.012 * Math.abs(p.clr - 7));
        let edge = 'ok'; if (p.clr < 5) edge = 'tight'; else if (p.clr > 15) edge = 'loose'; else if (p.clr > 10) edge = 'rough';
        return { m, Ff, F, tons: F / 9810, burr, edge, hold: 0.1 * F, twist: p.th > 4 };
    });
    MF.addParts({
        sh_upper: pp('Upper blade', 'السكين العلوية', 'A long blade pushed down by the ram. It is tilted a little (the rake or shear angle) so it cuts along the sheet gradually, not all at once.', 'سكين طويلة يدفعها الكبس للأسفل. تكون مائلة قليلاً (زاوية الميل) فتقص الصفيحة تدريجياً لا دفعة واحدة.', 'A bigger tilt = a smaller cutting force.', 'ميل أكبر = قوة قص أصغر.', 'Too much tilt makes the cut strip twist and bow.', 'الميل الكبير يجعل الشريط المقصوص يلتوي ويتقوس.'),
        sh_lower: pp('Lower blade', 'السكين السفلية', 'The fixed blade on the table. The gap between the two blades is the clearance.', 'السكين الثابتة على الطاولة. الفراغ بين السكينتين هو الخلوص.', 'Clearance of about 5–10 % of the thickness gives a clean edge.', 'خلوص بحدود 5–10 % من السماكة يعطي حافة نظيفة.', 'Too tight wears the blades; too loose leaves burrs.', 'الضيق جداً يبلي السكاكين؛ والواسع جداً يترك نتوءات.'),
        sh_sheet: pp('Sheet', 'الصفيحة', 'The metal being cut. Force grows with thickness and with the shear strength of the material.', 'المعدن المقصوص. تزداد القوة مع السماكة ومع مقاومة القص للمادة.', 'F = L · t · τ for a flat blade.', 'F = L · t · τ للسكين المستوية.', NA.en, NA.ar),
        sh_hold: pp('Hold-down foot', 'قدم التثبيت', 'Presses the sheet onto the table just before the blade comes down, so it cannot lift or slip.', 'تضغط الصفيحة على الطاولة قبيل نزول السكين كي لا ترتفع أو تنزلق.', 'Needs about 10 % of the cutting force.', 'تحتاج نحو 10 % من قوة القص.', NA.en, NA.ar),
        sh_strip: pp('Cut-off strip', 'الشريط المقصوص', 'The piece that falls away on the front side of the lower blade.', 'القطعة التي تسقط أمام السكين السفلية.', NA.en, NA.ar, NA.en, NA.ar)
    });
    MF.add('shear', L2('Guillotine shearing', 'القص (المقص الجيلوتين)'), {
        controls: () => [
            { id: 'mat', type: 'select', label: L2('Material', 'المادة'), options: MF.matOpts(['steel', 'stain', 'alu', 'brass']), value: 'steel', rebuild: true },
            { id: 't', type: 'range', label: L2('Sheet thickness t', 'سماكة الصفيحة t'), min: 0.5, max: 10, step: 0.5, value: 3, unit: 'mm', rebuild: true },
            { id: 'L', type: 'range', label: L2('Length of cut L', 'طول القص L'), min: 100, max: 2500, step: 50, value: 1000, unit: 'mm', rebuild: true },
            { id: 'th', type: 'range', label: L2('Blade tilt (rake angle)', 'ميل السكين (زاوية الميل)'), min: 0.5, max: 6, step: 0.5, value: 2, unit: '°', rebuild: true },
            { id: 'clr', type: 'range', label: L2('Blade clearance', 'خلوص السكاكين'), min: 2, max: 20, step: 1, value: 8, unit: '% t', rebuild: true }
        ],
        build(p) {
            const c = shCalc(p), g = new THREE.Group(), th = 0.07 + p.t * 0.035, yT = 1.0, W = 6.4, vis = clamp(p.th * 2.2, 1.5, 12) * PI / 180;
            g.add(box(9, 0.3, 4.4, 0x475569, 0, -0.15, 0)); g.add(box(8.2, yT, 2.4, 0x334155, 0, yT / 2, -1.3));
            g.add(box(0.6, 5.0, 1.2, 0x1f2937, -3.9, 2.5, 0)); g.add(box(0.6, 5.0, 1.2, 0x1f2937, 3.9, 2.5, 0));
            g.add(box(W, 0.3, 0.35, 0x94a3b8, 0, yT - 0.15, 0.05, 'sh_lower'));
            const rg = new THREE.Group(); g.add(rg);
            rg.add(box(W + 0.4, 0.5, 0.5, 0x1d4ed8, 0, 0.9, -0.1)); rg.add(box(W, 0.9, 0.18, 0xcbd5e1, 0, 0.2, 0.05, 'sh_upper')); rg.rotation.z = vis;
            const hold = box(W - 0.6, 0.35, 0.35, 0xb45309, 0, 2.6, -0.55, 'sh_hold'); g.add(hold);
            g.add(box(W - 0.6, th, 2.2, c.m.col, 0, yT + th / 2, -1.2, 'sh_sheet'));
            const strip = new THREE.Group(); strip.position.set(0, yT + th / 2, 0.1); g.add(strip);
            strip.add(box(W - 0.6, th, 1.4, c.m.col, 0, 0, 0.7, 'sh_strip'));
            const yTop = 3.6, yBot = yT + 0.3 + Math.sin(vis) * W / 2; let ph = 0;
            g.userData.update = (dt) => {
                ph = (ph + dt / 3.8) % 1; let u = 0; if (ph < 0.45) u = ph / 0.45; else if (ph < 0.58) u = 1; else if (ph < 0.9) u = 1 - (ph - 0.58) / 0.32;
                const cutF = ph < 0.9 ? clamp((u - 0.5) / 0.5, 0, 1) : 0, hu = ph < 0.85 ? clamp(ph / 0.12, 0, 1) : 1 - (ph - 0.85) / 0.15;
                rg.position.y = yTop - u * (yTop - yBot); hold.position.y = 2.6 - hu * (2.6 - (yT + th + 0.18));
                strip.rotation.x = cutF * 0.5; strip.position.y = yT + th / 2 - cutF * 0.05;
            };
            g.userData.fit = { w: 6.2, h: 4.0, dir: [0.3, 0.2, 1] }; g.userData.target = [0, 2.2, 0];
            return g;
        },
        readouts(p) {
            const c = shCalc(p), edgeTxt = { ok: T2('Clean edge', 'حافة نظيفة'), tight: T2('Too tight — blades wear fast', 'ضيق جداً — تبلى السكاكين بسرعة'), rough: T2('Rough edge', 'حافة خشنة'), loose: T2('Too loose — big burr', 'واسع جداً — نتوء كبير') };
            return [
                { k: L2('Shearing force', 'قوة القص'), v: fmt(c.F / 1000, 1) + ' kN' },
                { k: L2('Machine size needed', 'حجم المقص اللازم'), v: fmt(c.tons * 1.2, 1) + ' t' },
                { k: L2('Cut edge quality', 'جودة حافة القص'), v: edgeTxt[c.edge], state: c.edge === 'ok' ? 'ok' : c.edge === 'rough' ? 'warn' : 'bad' },
                { k: L2('Strip twisting (too much tilt)', 'التواء الشريط (ميل زائد)'), v: c.twist ? T2('Yes — reduce the tilt', 'نعم — قلّل الميل') : T2('No', 'لا'), state: c.twist ? 'warn' : 'ok' },
                { k: L2('Force with a flat blade (no tilt)', 'القوة بسكين مستوية (دون ميل)'), v: fmt(c.Ff / 1000, 0) + ' kN' },
                { k: L2('Burr height (rough estimate)', 'ارتفاع النتوء (تقدير تقريبي)'), v: fmt(c.burr, 2) + ' mm' },
                { k: L2('Hold-down force', 'قوة قدم التثبيت'), v: fmt(c.hold / 1000, 1) + ' kN' }
            ];
        },
        bom: () => [],
        challenges: () => [
            CH('Shear 6 mm steel plate with a force below 150 kN.', 'قصّ صفيحة فولاذ 6 mm بقوة أقل من 150 kN.', (p) => p.mat === 'steel' && p.t >= 6 && shCalc(p).F < 150000),
            CH('Cut 4 mm aluminium over 1.5 m using less than 30 kN.', 'قصّ ألمنيوم 4 mm على طول 1.5 m بقوة أقل من 30 kN.', (p) => p.mat === 'alu' && p.t >= 4 && p.L >= 1500 && shCalc(p).F < 30000),
            CH('Make a bad edge on purpose: clearance above 15 % of the thickness.', 'اصنع حافة سيئة عمداً: خلوص أكبر من 15 % من السماكة.', (p) => p.clr > 15)
        ],
        panels(p) {
            const c = shCalc(p), a = [], b = [], d = [];
            for (let t = 0.5; t <= 10.01; t += 0.5) { const q = shCalc(Object.assign({}, p, { t })); a.push([t, q.F / 1000]); d.push([t, q.Ff / 1000]); }
            for (let th = 0.5; th <= 6.01; th += 0.5) b.push([th, shCalc(Object.assign({}, p, { th })).F / 1000]);
            return [
                { type: 'line', h: 170, title: L2('Force vs thickness (tilted vs flat blade)', 'القوة مقابل السماكة (سكين مائلة مقابل مستوية)'), unit: 'kN', xlabel: L2('Thickness (mm)', 'السماكة (mm)'), xmin: 0.5, xmax: 10, ymin: 0, series: [{ label: L2('Tilted', 'مائلة'), pts: a, fill: true }, { label: L2('Flat', 'مستوية'), pts: d, color: '#dc2626' }], marks: [{ x: p.t, y: c.F / 1000, label: fmt(c.F / 1000, 0) }] },
                { type: 'line', h: 170, title: L2('Force vs blade tilt', 'القوة مقابل ميل السكين'), unit: 'kN', xlabel: L2('Tilt (°)', 'الميل (°)'), xmin: 0.5, xmax: 6, ymin: 0, series: [{ label: 'F', pts: b, fill: true }], marks: [{ x: p.th, y: c.F / 1000, label: fmt(c.F / 1000, 0) }] }
            ];
        }
    });

    /* =====================================================================================
     * 8. PRESS-BRAKE BENDING (air bending in a V die)
     * ===================================================================================== */
    const bnCalc = memo((p) => {
        const m = MAT[p.mat], Vf = +p.Vf, V = Vf * p.t, ri = 0.16 * V, Rmin = m.rmin * p.t, F = (1.33 * m.uts * p.b * p.t * p.t) / V;
        /* springback of pure bending (Kalpakjian): (2Ri+t)/(2Rf+t) = 4x³ − 3x + 1 with x = Ri·Y/(E·t); final angle = K × set angle */
        const xs = Math.min(0.4, (ri * m.Y) / (m.E * 1000 * p.t)), Ksb = 4 * xs * xs * xs - 3 * xs + 1, spr = m.rmin >= 99 ? 0 : Math.min(20, p.ang / Ksb - p.ang), rt = ri / p.t, Kf = rt < 0.5 ? 0.33 : rt < 3 ? 0.42 : 0.5;
        return { m, V, ri, Rmin, F, tons: F / 9810, spr, set: p.ang + spr, crack: ri < Rmin, flange: 0.7 * V, BA: ((p.ang * PI) / 180) * (ri + Kf * p.t) };
    });
    MF.addParts({
        bn_punch: pp('Punch', 'المثقب (سكين الثني)', 'A wedge with a rounded tip. It pushes the sheet down into the V groove.', 'إسفين برأس مدور يدفع الصفيحة إلى داخل مجرى V.', 'How deep it goes decides the bend angle.', 'عمق نزوله يحدد زاوية الثني.', 'The punch must go further than the target angle to allow for springback.', 'يجب أن ينزل أبعد من الزاوية المطلوبة تعويضاً عن الارتداد.'),
        bn_die: pp('V-die', 'قالب V', 'A block with a V groove. The sheet rests on its two shoulders; the opening V sets the bend radius.', 'كتلة بمجرى V. تستند الصفيحة على كتفيها؛ وفتحة V تحدد نصف قطر الثني.', 'Wide opening = big radius and small force. Narrow = tight radius and big force.', 'فتحة واسعة = نصف قطر كبير وقوة صغيرة. ضيقة = نصف قطر ضيق وقوة كبيرة.', 'Too narrow for the thickness and the outside of the bend cracks.', 'ضيق جداً بالنسبة للسماكة فيتشقق الوجه الخارجي للثني.'),
        bn_sheet: pp('Sheet', 'الصفيحة', 'The metal being bent. The outside stretches and the inside shrinks; the middle (neutral axis) keeps its length.', 'المعدن المثني. يتمدد الوجه الخارجي ويتقلص الداخلي؛ ويحافظ الوسط (المحور المحايد) على طوله.', 'Flat blank length = legs + bend allowance.', 'طول الشكل المسطح = الساقان + سماحية الثني.', 'After the punch lifts the sheet springs open by a degree or two.', 'بعد رفع المثقب تنفتح الصفيحة درجة أو درجتين.')
    });
    MF.add('bend', L2('Press-brake bending', 'الثني (ماكينة ثني الصفائح)'), {
        controls: () => [
            { id: 'mat', type: 'select', label: L2('Material', 'المادة'), options: MF.matOpts(['steel', 'stain', 'alu', 'brass']), value: 'steel', rebuild: true },
            { id: 't', type: 'range', label: L2('Sheet thickness t', 'سماكة الصفيحة t'), min: 0.5, max: 6, step: 0.5, value: 2, unit: 'mm', rebuild: true },
            { id: 'b', type: 'range', label: L2('Length of the bend line b', 'طول خط الثني b'), min: 100, max: 2000, step: 50, value: 500, unit: 'mm', rebuild: true },
            { id: 'Vf', type: 'select', label: L2('V-die opening (× thickness)', 'فتحة قالب V (× السماكة)'), options: [{ v: 6, label: L2('6 × t (tight)', '6 × t (ضيق)') }, { v: 8, label: L2('8 × t (normal)', '8 × t (عادي)') }, { v: 10, label: L2('10 × t', '10 × t') }, { v: 12, label: L2('12 × t (wide)', '12 × t (واسع)') }], value: 8, rebuild: true },
            { id: 'ang', type: 'range', label: L2('Bend angle', 'زاوية الثني'), min: 30, max: 95, step: 5, value: 90, unit: '°', rebuild: true }
        ],
        build(p) {
            const c = bnCalc(p), g = new THREE.Group(), th = 0.06 + p.t * 0.035, Vv = 1.1 + (c.V / 72) * 2.4, S = Vv / 2, ySup = 2.4, Ll = 2.3, hb = S * 1.11 + 0.4;
            g.add(box(9, 0.3, 3.4, 0x475569, 0, -0.15, 0)); g.add(box(0.5, 6.6, 0.9, 0x334155, -3.7, 3.3, 0)); g.add(box(0.5, 6.6, 0.9, 0x334155, 3.7, 3.3, 0));
            const ram = box(7.9, 0.7, 1.1, 0x1d4ed8, 0, 6.0, 0); g.add(ram);
            const dw = 2.4, ds = new THREE.Shape(); [[-dw, -hb], [dw, -hb], [dw, 0], [S, 0], [0, -S * 1.11], [-S, 0], [-dw, 0]].forEach((q, i) => (i ? ds.lineTo(q[0], q[1]) : ds.moveTo(q[0], q[1])));
            const die = new THREE.Mesh(new THREE.ExtrudeGeometry(ds, { depth: 2.4, bevelEnabled: false }), lit(0x1f2937)); die.position.set(0, ySup, -1.2); die.userData.id = 'bn_die'; g.add(die);
            if (ySup - hb > 0.02) g.add(box(5.0, ySup - hb, 2.4, 0x111827, 0, (ySup - hb) / 2, 0));
            const gl = new THREE.Group(), gr = new THREE.Group(); gl.add(box(Ll, th, 2.0, c.m.col, -Ll / 2, 0, 0, 'bn_sheet')); gr.add(box(Ll, th, 2.0, c.m.col, Ll / 2, 0, 0, 'bn_sheet')); g.add(gl); g.add(gr);
            const ps = new THREE.Shape(); [[0, 0], [0.7, 0.8], [0.35, 0.8], [0.35, 1.6], [-0.35, 1.6], [-0.35, 0.8], [-0.7, 0.8]].forEach((q, i) => (i ? ps.lineTo(q[0], q[1]) : ps.moveTo(q[0], q[1]))); ps.closePath();
            const pun = new THREE.Mesh(new THREE.ExtrudeGeometry(ps, { depth: 2.2, bevelEnabled: false }), lit(0xcbd5e1)); pun.userData.id = 'bn_punch'; pun.position.z = -1.1; g.add(pun);
            const pt = (p.ang / 2) * PI / 180, sv = (c.spr / 2) * PI / 180, po = pt + sv; let ph = 0;
            g.userData.update = (dt) => {
                ph = (ph + dt / 4.6) % 1; let f;
                if (ph < 0.4) f = po * Math.sin(((ph / 0.4) * PI) / 2); else if (ph < 0.55) f = po; else if (ph < 0.7) f = po - sv * ((ph - 0.55) / 0.15); else if (ph < 0.88) f = pt; else f = pt * (1 - (ph - 0.88) / 0.12);
                const dl = Math.min(S * Math.tan(f), S * 1.11 - 0.05), yc = ySup + th / 2 - dl;
                gl.position.set(0, yc, 0); gr.position.set(0, yc, 0); gl.rotation.z = -f; gr.rotation.z = f;
                const lift = ph < 0.55 ? 0 : ph < 0.88 ? clamp((ph - 0.55) / 0.12, 0, 1) * 1.6 : (1 - (ph - 0.88) / 0.12) * 1.6;
                pun.position.y = yc + th / 2 + lift; ram.position.y = pun.position.y + 1.95;
            };
            g.userData.fit = { w: 5.0, h: 5.4, dir: [0.15, 0.2, 1] }; g.userData.target = [0, 3.2, 0];
            return g;
        },
        readouts(p) {
            const c = bnCalc(p);
            return [
                { k: L2('Bending force', 'قوة الثني'), v: fmt(c.F / 1000, 1) + ' kN' },
                { k: L2('Press size needed', 'حجم المكبس اللازم'), v: fmt(c.tons * 1.2, 1) + ' t' },
                { k: L2('Will it crack?', 'هل ستتشقق؟'), v: c.crack ? T2('Yes — radius too small', 'نعم — نصف القطر صغير جداً') : T2('No', 'لا'), state: c.crack ? 'bad' : 'ok' },
                { k: L2('Press the punch down to (allowing springback)', 'انزل بالمثقب حتى زاوية (مع تعويض الارتداد)'), v: fmt(c.set, 1) + ' °' },
                { k: L2('Springback (pure-bending formula with typical E and Y; rough estimate)', 'الارتداد (معادلة الثني الصافي بقيم E وY نموذجية؛ تقدير تقريبي)'), v: fmt(c.spr, 1) + ' °' },
                { k: L2('Inside bend radius', 'نصف قطر الثني الداخلي'), v: fmt(c.ri, 1) + ' mm' },
                { k: L2('Smallest safe inside radius', 'أصغر نصف قطر داخلي آمن'), v: c.Rmin > 50 ? T2('Brittle: do not bend', 'هشّ: لا يُثنى') : fmt(c.Rmin, 1) + ' mm' },
                { k: L2('Shortest flange you can bend', 'أقصر جناح يمكن ثنيه'), v: fmt(c.flange, 1) + ' mm' },
                { k: L2('Bend allowance (length used by the bend)', 'سماحية الثني (الطول الذي يستهلكه الثني)'), v: fmt(c.BA, 1) + ' mm' }
            ];
        },
        bom: () => [],
        challenges: () => [
            CH('Bend 3 mm steel over 200 mm with less than 50 kN and no cracking.', 'اثنِ فولاذ 3 mm على طول 200 mm بقوة أقل من 50 kN ودون تشقق.', (p) => { const c = bnCalc(p); return p.mat === 'steel' && p.t >= 3 && p.b >= 200 && !c.crack && c.F < 50000; }),
            CH('Crack the part on purpose: 6 mm stainless steel with the tight 6 × t die.', 'شقّق القطعة عمداً: فولاذ لا يصدأ 6 mm مع قالب ضيق 6 × t.', (p) => p.mat === 'stain' && bnCalc(p).crack),
            CH('Bend aluminium over 1 m with a force under 40 kN and no cracking.', 'اثنِ ألمنيوم على طول 1 m بقوة أقل من 40 kN ودون تشقق.', (p) => { const c = bnCalc(p); return p.mat === 'alu' && p.b >= 1000 && c.F < 40000 && !c.crack; })
        ],
        panels(p) {
            const c = bnCalc(p), a = [], b = [];
            for (let t = 0.5; t <= 6.01; t += 0.5) a.push([t, bnCalc(Object.assign({}, p, { t })).F / 1000]);
            [6, 8, 10, 12].forEach((Vf) => b.push([Vf, bnCalc(Object.assign({}, p, { Vf })).F / 1000]));
            return [
                { type: 'line', h: 170, title: L2('Bending force vs thickness', 'قوة الثني مقابل السماكة'), unit: 'kN', xlabel: L2('Thickness (mm)', 'السماكة (mm)'), xmin: 0.5, xmax: 6, ymin: 0, series: [{ label: 'F', pts: a, fill: true }], marks: [{ x: p.t, y: c.F / 1000, label: fmt(c.F / 1000, 0) }] },
                { type: 'line', h: 170, title: L2('Bending force vs die opening', 'قوة الثني مقابل فتحة القالب'), unit: 'kN', xlabel: L2('V opening (× t)', 'فتحة V (× t)'), xmin: 6, xmax: 12, ymin: 0, series: [{ label: 'F', pts: b, fill: true }], marks: [{ x: +p.Vf, y: c.F / 1000, label: fmt(c.F / 1000, 0) }] }
            ];
        }
    });

    /* =====================================================================================
     * 9. DEEP DRAWING (a cup from a flat disc)
     * ===================================================================================== */
    const LDR = { steel: 2.0, stain: 1.8, alu: 1.9, brass: 2.1 }, LUBE = { good: 0.05, poor: 0.12, dry: 0.25 };
    const ddCalc = memo((p) => {
        const m = MAT[p.mat], D = Math.sqrt(p.d * p.d + 4 * p.d * p.h), beta = D / p.d, ldr = LDR[p.mat], rd = 6 * p.t, mu = LUBE[p.lube];
        const bhArea = Math.max(0, (PI / 4) * (D * D - Math.pow(p.d + 2 * rd, 2))), Fbh = bhArea * p.p;
        const b1 = Math.min(beta, ldr), Fd = PI * p.d * p.t * m.uts * Math.max(b1 - 0.7, 0.05), Ft = Fd + 2 * mu * Fbh, Fcap = PI * p.d * p.t * m.uts * (ldr - 0.7);
        const draws = beta <= ldr ? 1 : 1 + Math.ceil(Math.log(beta / ldr) / Math.log(1.3)), pmin = 0.015 * m.Y;   // blank-holding pressure ≈ 0.015 × yield strength (Groover)
        return { m, D, beta, ldr, rd, Fbh, Fd, Ft, Fcap, draws, pmin, wrinkle: p.p < pmin && beta > 1.15, tear: Ft > Fcap && beta <= ldr, tons: Ft / 9810 };
    });
    MF.addParts({
        dd_punch: pp('Punch', 'المثقب (الكبّاس)', 'A rounded cylinder that pushes the middle of the disc down through the die and gives the cup its inside shape.', 'أسطوانة مدورة الحافة تدفع وسط القرص عبر القالب وتعطي الكأس شكله الداخلي.', 'Draw force F = π · d · t · UTS · (β − 0.7).', 'قوة السحب F = π · d · t · UTS · (β − 0.7).', 'The sharp corner of a punch tears the bottom of the cup.', 'الحافة الحادة للكباس تمزق قاع الكأس.'),
        dd_die: pp('Draw die', 'قالب السحب', 'A ring with a smooth rounded entry. The metal flows over this corner into the cup.', 'حلقة بمدخل مدور ناعم. يتدفق المعدن فوق هذه الحافة إلى داخل الكأس.', 'Die corner radius is about 6 × the thickness.', 'نصف قطر حافة القالب نحو 6 × السماكة.', 'A sharp die corner cuts the metal instead of letting it flow.', 'الحافة الحادة تقص المعدن بدل أن تتركه يتدفق.'),
        dd_holder: pp('Blank holder', 'حلقة التثبيت (ماسك القرص)', 'A ring that presses the outer part of the disc flat while the middle is pulled in.', 'حلقة تضغط الجزء الخارجي من القرص مسطحاً بينما يُسحب الوسط للداخل.', 'Stops wrinkles from forming in the flange.', 'تمنع تكوّن التجاعيد في الحافة المسطحة.', 'Too little force: wrinkles. Too much: friction tears the cup.', 'قوة قليلة: تجاعيد. قوة كبيرة: الاحتكاك يمزق الكأس.'),
        dd_blank: pp('Blank / cup', 'القرص / الكأس', 'A flat round disc that is pulled into a cup. The area stays the same, so the disc gets smaller as the cup gets deeper.', 'قرص مسطح يُسحب إلى كأس. تبقى المساحة ثابتة لذا يصغر القرص كلما تعمق الكأس.', 'Blank diameter D = √(d² + 4·d·h).', 'قطر القرص D = √(d² + 4·d·h).', 'A disc more than about 2× the cup diameter cannot be drawn in one step.', 'قرص أكبر من نحو ضعف قطر الكأس لا يُسحب في خطوة واحدة.')
    });
    MF.add('deepdraw', L2('Deep drawing (cup)', 'السحب العميق (كأس)'), {
        controls: () => [
            { id: 'mat', type: 'select', label: L2('Material', 'المادة'), options: MF.matOpts(['steel', 'stain', 'alu', 'brass']), value: 'steel', rebuild: true },
            { id: 't', type: 'range', label: L2('Sheet thickness t', 'سماكة الصفيحة t'), min: 0.5, max: 3, step: 0.1, value: 1, unit: 'mm', rebuild: true },
            { id: 'd', type: 'range', label: L2('Cup diameter d', 'قطر الكأس d'), min: 30, max: 150, step: 5, value: 60, unit: 'mm', rebuild: true },
            { id: 'h', type: 'range', label: L2('Cup height h', 'ارتفاع الكأس h'), min: 10, max: 120, step: 5, value: 30, unit: 'mm', rebuild: true },
            { id: 'p', type: 'range', label: L2('Blank-holder pressure', 'ضغط حلقة التثبيت'), min: 0.5, max: 8, step: 0.5, value: 5.5, unit: 'MPa', rebuild: true },
            { id: 'lube', type: 'select', label: L2('Lubricant', 'مادة التزييت'), options: [{ v: 'good', label: L2('Good (oil / soap)', 'جيدة (زيت / صابون)') }, { v: 'poor', label: L2('Poor', 'ضعيفة') }, { v: 'dry', label: L2('None (dry)', 'بدون (جاف)') }], value: 'good', rebuild: true }
        ],
        build(p) {
            const c = ddCalc(p), g = new THREE.Group(), th = 0.05 + p.t * 0.04, yS = 3.0, bv = Math.min(Math.max(c.beta, 1.1), 2.4);
            const dr = Math.min(0.5 + (p.d / 150) * 0.7, 2.7 / bv), Rb = dr * bv, umax = (Rb * Rb - dr * dr) / (2 * dr), rh = dr + 0.06;
            g.add(box(10, 0.3, 4, 0x475569, 0, -0.15, 0)); g.add(box(0.5, 8.4, 0.8, 0x334155, -4.4, 4.2, 0)); g.add(box(0.5, 8.4, 0.8, 0x334155, 4.4, 4.2, 0));
            g.add(box(0.5, yS - 0.6, 0.8, 0x334155, -3.3, (yS - 0.6) / 2, 0)); g.add(box(0.5, yS - 0.6, 0.8, 0x334155, 3.3, (yS - 0.6) / 2, 0));
            const ring = (r0, r1, y0, y1, col, id) => { const m = new THREE.Mesh(new THREE.LatheGeometry([V2(r0, y0), V2(r1, y0), V2(r1, y1), V2(r0, y1), V2(r0, y0)], 48), lit(col)); m.userData.id = id; return m; };
            g.add(ring(rh, 3.6, yS - 0.6, yS, 0x1f2937, 'dd_die'));
            const holder = ring(rh + 0.02, 3.4, 0, 0.45, 0xb45309, 'dd_holder'); holder.material.transparent = true; holder.material.opacity = 0.4; g.add(holder);
            const blank = new THREE.Mesh(new THREE.BufferGeometry(), lit(c.m.col, { metalness: 0.2, roughness: 0.45 })); blank.userData.id = 'dd_blank'; g.add(blank);
            const H = 3.0, punch = cylY(dr - th - 0.03, H, 0xcbd5e1, 0, 0, 0, 'dd_punch'); g.add(punch);
            const ramp = box(8.4, 0.6, 1.1, 0x1d4ed8, 0, 0, 0); g.add(ramp);
            const setCup = (u, lift) => {
                const Rf = Math.sqrt(Math.max(Rb * Rb - 2 * dr * u, dr * dr)), yb = yS - u;
                blank.geometry.dispose(); blank.geometry = new THREE.LatheGeometry([V2(0, yb), V2(dr, yb), V2(dr, yS), V2(Rf, yS), V2(Rf, yS + th), V2(dr - th, yS + th), V2(dr - th, yb + th), V2(0, yb + th)], 48);
                punch.position.y = yb + th + H / 2 + 0.01 + lift; ramp.position.y = punch.position.y + H / 2 + 0.3; holder.position.y = yS + th + 0.02 + lift * 0.1;
            };
            let ph = 0; setCup(0, 0);
            g.userData.update = (dt) => {
                ph = (ph + dt / 5) % 1;
                const u = ph < 0.5 ? Math.sin((ph / 0.5) * PI / 2) : 1, lift = ph < 0.62 ? 0 : ph < 0.85 ? ((ph - 0.62) / 0.23) * 3.0 : 3.0;
                setCup(umax * u, lift);
            };
            g.userData.fit = { w: 8.0, h: 8.0, dir: [0.2, 0.25, 1] }; g.userData.target = [0, 3.6, 0];
            return g;
        },
        readouts(p) {
            const c = ddCalc(p), verdict = c.beta > c.ldr ? T2('Needs ' + c.draws + ' draws (one is not enough)', 'يحتاج ' + c.draws + ' عمليات سحب (واحدة لا تكفي)') : c.tear ? T2('Tears at the corner', 'يتمزق عند الزاوية') : c.wrinkle ? T2('Wrinkles in the flange', 'تجاعيد في الحافة') : T2('Good cup', 'كأس سليم');
            return [
                { k: L2('Draw ratio β = D / d  (limit ≈ ' + c.ldr.toFixed(1) + ')', 'نسبة السحب β = D / d  (الحد ≈ ' + c.ldr.toFixed(1) + ')'), v: fmt(c.beta, 2), state: c.beta > c.ldr ? 'bad' : c.beta > 0.9 * c.ldr ? 'warn' : 'ok' },
                { k: L2('Blank (disc) diameter D', 'قطر القرص D'), v: fmt(c.D, 0) + ' mm' },
                { k: L2('Drawing force', 'قوة السحب'), v: fmt(c.Ft / 1000, 0) + ' kN' },
                { k: L2('Result', 'النتيجة'), v: verdict, state: c.beta > c.ldr || c.tear ? 'bad' : c.wrinkle ? 'warn' : 'ok' },
                { k: L2('Blank-holder force', 'قوة حلقة التثبيت'), v: fmt(c.Fbh / 1000, 1) + ' kN' },
                { k: L2('Minimum holder pressure to avoid wrinkles (≈ 0.015 × yield strength)', 'أقل ضغط تثبيت يمنع التجاعيد (≈ 0.015 × إجهاد الخضوع)'), v: fmt(c.pmin, 1) + ' MPa' },
                { k: L2('Press size needed', 'حجم المكبس اللازم'), v: fmt(c.tons * 1.2, 0) + ' t' },
                { k: L2('Die corner radius', 'نصف قطر حافة القالب'), v: fmt(c.rd, 1) + ' mm' }
            ];
        },
        bom: () => [],
        challenges: () => [
            CH('Draw a cup at least 60 mm wide and 40 mm tall in a single draw.', 'اسحب كأساً بعرض 60 mm على الأقل وارتفاع 40 mm على الأقل بسحبة واحدة.', (p) => { const c = ddCalc(p); return p.d >= 60 && p.h >= 40 && c.draws === 1 && !c.wrinkle && !c.tear; }),
            CH('Make it wrinkle on purpose: lower the blank-holder pressure.', 'اجعل الكأس يتجعد عمداً: خفّض ضغط حلقة التثبيت.', (p) => ddCalc(p).wrinkle),
            CH('Find a cup so deep that it needs 3 or more draws.', 'ابحث عن كأس عميق لدرجة تحتاج 3 سحبات أو أكثر.', (p) => ddCalc(p).draws >= 3)
        ],
        panels(p) {
            const c = ddCalc(p), a = [], b = [];
            for (let h = 10; h <= 120; h += 5) a.push([h, ddCalc(Object.assign({}, p, { h })).beta]);
            for (let t = 0.5; t <= 3.01; t += 0.1) b.push([t, ddCalc(Object.assign({}, p, { t })).Ft / 1000]);
            return [
                { type: 'line', h: 170, title: L2('Draw ratio vs cup height', 'نسبة السحب مقابل ارتفاع الكأس'), unit: 'β', xlabel: L2('Cup height h (mm)', 'ارتفاع الكأس h (mm)'), xmin: 10, xmax: 120, ymin: 1, series: [{ label: 'β', pts: a, fill: true }, { label: L2('Limit', 'الحد'), pts: [[10, c.ldr], [120, c.ldr]], color: '#dc2626' }], marks: [{ x: p.h, y: c.beta, label: fmt(c.beta, 2) }] },
                { type: 'line', h: 170, title: L2('Drawing force vs thickness', 'قوة السحب مقابل السماكة'), unit: 'kN', xlabel: L2('Thickness (mm)', 'السماكة (mm)'), xmin: 0.5, xmax: 3, ymin: 0, series: [{ label: 'F', pts: b, fill: true }], marks: [{ x: p.t, y: c.Ft / 1000, label: fmt(c.Ft / 1000, 0) }] }
            ];
        }
    });

    /* =====================================================================================
     * 10. WIRE DRAWING
     * ===================================================================================== */
    const wdCalc = memo((p) => {
        const m = MAT[p.mat], r = p.r / 100, eps = -Math.log(1 - r), d1 = p.d0 * Math.sqrt(1 - r), mu = LUBE[p.lube], A1 = (PI * d1 * d1) / 4;
        const stress = (alpha, rr) => { const e = -Math.log(1 - rr), dd = p.d0 * Math.sqrt(1 - rr), sa = Math.sin((alpha * PI) / 180), De = ((p.d0 + dd) / Math.max(p.d0 - dd, 1e-6)) * sa; return m.uts * e * (1 + mu / Math.tan((alpha * PI) / 180)) * (0.88 + 0.12 * De); };
        const sd = stress(p.alpha, r), F = sd * A1, P = (F * (p.v / (1 - r))) / 60 / 1000;   // the pull acts on the wire leaving the die, which moves at v / (1 - r)
        let aopt = 3, smin = 1e9; for (let a = 3; a <= 20; a += 0.5) { const s = stress(a, r); if (s < smin) { smin = s; aopt = a; } }
        let rmax = 0.05; for (let q = 0.05; q <= 0.8; q += 0.005) { if (stress(p.alpha, q) <= 0.9 * m.uts) rmax = q; else break; }
        return { m, eps, d1, mu, sd, F, P, ratio: sd / m.uts, break: sd > 0.9 * m.uts, aopt, rmax, stress };
    });
    MF.addParts({
        wd_die: pp('Drawing die', 'قالب السحب (الحدّادة)', 'A hard block (tungsten carbide) with a cone-shaped hole. The wire is pulled through and squeezed to a smaller diameter.', 'كتلة صلبة (كربيد التنغستن) بثقب مخروطي. يُسحب السلك عبره فيُضغط إلى قطر أصغر.', 'The cone half-angle is usually 6–10°.', 'نصف زاوية المخروط عادة 6–10°.', 'Too steep: extra distortion. Too shallow: long contact and friction.', 'حاد جداً: تشوه زائد. ضحل جداً: تلامس طويل واحتكاك.'),
        wd_in: pp('Incoming wire', 'السلك الداخل', 'The thick wire going into the die, moving slowly.', 'السلك السميك الداخل إلى القالب، يتحرك ببطء.', 'Area A0 = π·d0²/4.', 'المساحة A0 = π·d0²/4.', NA.en, NA.ar),
        wd_out: pp('Drawn wire', 'السلك الخارج', 'The thinner, longer, stronger wire. The same volume of metal leaves faster than it entered, so it moves faster.', 'السلك الأرفع والأطول والأقوى. يخرج نفس حجم المعدن أسرع مما دخل لذا يتحرك أسرع.', 'Exit speed = entry speed × A0 / A1.', 'سرعة الخروج = سرعة الدخول × A0 / A1.', 'If the pull is more than the wire can take, it snaps after the die.', 'إذا زاد الشد عما يتحمله السلك ينقطع بعد القالب.')
    });
    MF.add('wiredraw', L2('Wire drawing', 'سحب الأسلاك'), {
        controls: () => [
            { id: 'mat', type: 'select', label: L2('Material', 'المادة'), options: MF.matOpts(['steel', 'stain', 'alu', 'brass']), value: 'steel', rebuild: true },
            { id: 'd0', type: 'range', label: L2('Wire diameter before d0', 'قطر السلك قبل السحب d0'), min: 2, max: 12, step: 0.5, value: 6, unit: 'mm', rebuild: true },
            { id: 'r', type: 'range', label: L2('Area reduction in this pass', 'نقصان المساحة في هذا المرور'), min: 5, max: 50, step: 1, value: 25, unit: '%', rebuild: true },
            { id: 'alpha', type: 'range', label: L2('Die half-angle', 'نصف زاوية القالب'), min: 3, max: 20, step: 1, value: 14, unit: '°', rebuild: true },
            { id: 'lube', type: 'select', label: L2('Lubricant', 'مادة التزييت'), options: [{ v: 'good', label: L2('Good (soap / oil)', 'جيدة (صابون / زيت)') }, { v: 'poor', label: L2('Poor', 'ضعيفة') }, { v: 'dry', label: L2('None (dry)', 'بدون (جاف)') }], value: 'good', rebuild: true },
            { id: 'v', type: 'range', label: L2('Wire speed entering the die', 'سرعة دخول السلك إلى القالب'), min: 10, max: 300, step: 10, value: 60, unit: 'm/min', rebuild: true }
        ],
        build(p) {
            const c = wdCalc(p), g = new THREE.Group(), R0 = 0.3 + (p.d0 / 12) * 0.45, R1 = R0 * Math.sqrt(1 - p.r / 100), al = (p.alpha * PI) / 180;
            const Lc = clamp((R0 - R1) / Math.tan(al), 0.25, 1.6), y0 = (Lc + 0.6) / 2, ratio = 1 / (1 - p.r / 100);
            g.add(box(10, 0.3, 3, 0x475569, 0, -1.55, 0)); g.add(box(0.5, 1.2, 2.4, 0x334155, 0, -0.95, 0));
            const die = new THREE.Mesh(new THREE.LatheGeometry([V2(1.0, -y0), V2(1.0, y0), V2(R0, y0), V2(R1, y0 - Lc), V2(R1, -y0 + 0.3), V2(R1 + 0.2, -y0), V2(1.0, -y0)], 40), lit(0x1f2937)); die.rotation.z = -PI / 2; die.userData.id = 'wd_die'; g.add(die);
            g.add(cylX(R0, 4.2, c.m.col, y0 + 2.1, 0, 0, 'wd_in')); g.add(cylX(R1, 4.2, c.m.col, -y0 - 2.1, 0, 0, 'wd_out'));
            const N = 7, sp = 0.6, len = N * sp, mk = (R, id) => { const a = []; for (let i = 0; i < N; i++) { const m = cylX(R * 1.1, 0.07, 0xdc2626, 0, 0, 0, id); g.add(m); a.push(m); } return a; };
            const mIn = mk(R0, 'wd_in'), mOut = mk(R1, 'wd_out'); let t = 0;
            g.userData.update = (dt) => {
                t += dt * 0.5;
                mIn.forEach((m, i) => { const u = (((i * sp - t) % len) + len) % len; m.position.x = y0 + 0.02 + (u / len) * 4.1; });
                mOut.forEach((m, i) => { const u = (((i * sp + t * ratio) % len) + len) % len; m.position.x = -y0 - 0.02 - (u / len) * 4.1; });
            };
            g.userData.fit = { w: 6.0, h: 2.4, dir: [0.1, 0.25, 1] }; g.userData.target = [0, -0.2, 0];
            return g;
        },
        readouts(p) {
            const c = wdCalc(p);
            return [
                { k: L2('Wire diameter after the die', 'قطر السلك بعد القالب'), v: fmt(p.d0, 1) + ' → ' + fmt(c.d1, 2) + ' mm' },
                { k: L2('Drawing force', 'قوة السحب'), v: fmt(c.F / 1000, 2) + ' kN' },
                { k: L2('Pull stress as a share of wire strength', 'إجهاد الشد كنسبة من متانة السلك'), v: fmt(c.ratio * 100, 0) + ' %', state: c.break ? 'bad' : c.ratio > 0.7 ? 'warn' : 'ok' },
                { k: L2('Does the wire break?', 'هل ينقطع السلك؟'), v: c.break ? T2('Yes — pull too high', 'نعم — الشد عالٍ جداً') : T2('No', 'لا'), state: c.break ? 'bad' : 'ok' },
                { k: L2('Drawing power', 'استطاعة السحب'), v: fmt(c.P, 1) + ' kW' },
                { k: L2('Largest safe reduction per pass', 'أكبر نقصان آمن في المرور'), v: fmt(c.rmax * 100, 0) + ' %' },
                { k: L2('Best die half-angle (least force)', 'أفضل نصف زاوية للقالب (أقل قوة)'), v: fmt(c.aopt, 1) + ' °' },
                { k: L2('Exit speed of the wire', 'سرعة خروج السلك'), v: fmt(p.v / (1 - p.r / 100), 0) + ' m/min' }
            ];
        },
        bom: () => [],
        challenges: () => [
            CH('Reduce the area by 40 % in one pass without breaking the wire.', 'انقص المساحة 40 % في مرور واحد دون أن ينقطع السلك.', (p) => p.r >= 40 && !wdCalc(p).break),
            CH('Break the wire on purpose: too much reduction for the lubricant and die.', 'اقطع السلك عمداً: نقصان زائد عن حدّ التزييت والقالب.', (p) => wdCalc(p).break),
            CH('Set the die angle to within 1° of the best one for the least force.', 'اضبط زاوية القالب ضمن 1° من الزاوية الأفضل لأقل قوة.', (p) => Math.abs(p.alpha - wdCalc(p).aopt) <= 1)
        ],
        panels(p) {
            const c = wdCalc(p), a = [], b = [];
            for (let al = 3; al <= 20; al += 1) a.push([al, c.stress(al, p.r / 100)]);
            for (let r = 5; r <= 50; r += 1) b.push([r, c.stress(p.alpha, r / 100)]);
            return [
                { type: 'line', h: 170, title: L2('Pull stress vs die half-angle', 'إجهاد الشد مقابل نصف زاوية القالب'), unit: 'MPa', xlabel: L2('Half-angle (°)', 'نصف الزاوية (°)'), xmin: 3, xmax: 20, ymin: 0, series: [{ label: 'σ', pts: a, fill: true }], marks: [{ x: p.alpha, y: c.sd, label: fmt(c.sd, 0) }] },
                { type: 'line', h: 170, title: L2('Pull stress vs reduction', 'إجهاد الشد مقابل نقصان المساحة'), unit: 'MPa', xlabel: L2('Reduction (%)', 'النقصان (%)'), xmin: 5, xmax: 50, ymin: 0, series: [{ label: 'σ', pts: b, fill: true }, { label: L2('Wire strength limit', 'حد متانة السلك'), pts: [[5, 0.9 * c.m.uts], [50, 0.9 * c.m.uts]], color: '#dc2626' }], marks: [{ x: p.r, y: c.sd, label: fmt(c.sd, 0) }] }
            ];
        }
    });
})();
