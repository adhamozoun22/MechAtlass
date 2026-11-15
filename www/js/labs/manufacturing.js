/* Manufacturing & CNC lab — core + turning + milling + punching press.
 * Same student-first design as the other labs: few controls, the key numbers first. Needs strength.js / fluids.js / hydraulics.js helpers. */
(function () {
    'use strict';
    const SM = window.SM, K = window.GearKit, FL = window.FL, HY = window.HY;
    if (!SM || !K || !FL || !HY || !window.THREE || !window.Labs) return;
    const PI = Math.PI, L2 = SM.L2, fmt = K.fmt, lit = SM.lit, CH = SM.CH, memo = SM.memo, clamp = FL.clamp, trans = FL.trans, T2 = FL.T2;
    const NA = L2('—', '—'), box = HY.box, cylY = HY.cylY, cylX = HY.cylX;

    const MF = (window.MF = { models: {}, L2, fmt, clamp });
    const lab = {
        id: 'mfg', icon: 'fa-industry', title: L2('Manufacturing & CNC', 'التصنيع والـ CNC'),
        intro: L2('See how a machine removes, cuts and forms metal — and how speed, feed and size change the time, the force and the power. Simplified educational models with typical material and tool constants; for real jobs use the tool and machine maker\'s data. Includes a simple G-code simulator (a subset of commands, for learning only).',
            'شاهد كيف تقصّ الآلة المعدن وتقطعه وتشكّله — وكيف تغيّر السرعة والتغذية والأبعاد الزمن والقوة والاستطاعة. نماذج تعليمية مبسّطة بثوابت نموذجية للمواد والأدوات؛ في العمل الفعلي استعمل بيانات صانع الأداة والآلة. يتضمن محاكي G-code بسيطاً (مجموعة جزئية من الأوامر، للتعلم فقط).'),
        models: [], parts: {}, supports: { section: false },
        controls(model, cur) { return MF.models[model].controls(cur || {}); },
        build(model, p, api) { return MF.models[model].build(p, api); },
        apply() { },
        readouts(model, p, api, group) { return MF.models[model].readouts(p, group); },
        challenges(model) { return MF.models[model].challenges(); },
        listParts(model, p) { const m = MF.models[model]; return m.bom ? m.bom(p) : []; },
        charts: { draw(canvas, model, p, info) { K.drawPanels(canvas, MF.models[model].panels(p), info); } }
    };
    window.Labs.register(lab);
    MF.lab = lab;
    lab.action = { icon: 'fa-rotate-left', label: L2('Reset settings', 'إعادة الضبط'), run() { const E = window.Labs.engine; if (E && E.modelId) E.loadModel(E.modelId); } };
    MF.add = (id, title, def) => { MF.models[id] = def; lab.models.push({ id, title }); };
    MF.addParts = (o) => Object.assign(lab.parts, o);
    MF.pp = HY.pp;
    const pp = MF.pp;

    /* kc1.1 / mc (Kienzle) checked against the Sandvik-style material-group table republished by machiningdoctor.com (2026-10): C45 1500/0.22, austenitic stainless 2150/0.20,
     * grey cast iron (pearlitic GG25-40) 1350/0.28, aluminium 700/0.25, brass 700/0.27.  E (GPa) = typical handbook values; Y (MPa) = typical yield assumed for the UTS used here
     * (steel: EN 10083-2 C45+N min. 340; the others are assumed typical values and vary strongly with temper). */
    /* materials for cutting: specific cutting force kc1.1, exponent mc, recommended carbide cutting speed, shear / tensile strength, bend radius factor */
    MF.MAT = {
        steel: { n: L2('Steel C45', 'فولاذ C45'), kc: 1500, mc: 0.22, vrec: 200, tau: 400, uts: 650, rmin: 1.0, E: 210, Y: 340, col: 0x64748b },
        stain: { n: L2('Stainless steel', 'فولاذ لا يصدأ'), kc: 2150, mc: 0.20, vrec: 130, tau: 500, uts: 700, rmin: 1.5, E: 193, Y: 300, col: 0x94a3b8 },
        iron: { n: L2('Cast iron', 'حديد زهر'), kc: 1350, mc: 0.28, vrec: 150, tau: 250, uts: 250, rmin: 99, E: 110, Y: 250, col: 0x475569 },
        alu: { n: L2('Aluminium', 'ألمنيوم'), kc: 700, mc: 0.25, vrec: 500, tau: 100, uts: 180, rmin: 0.5, E: 70, Y: 120, col: 0xcbd5e1 },
        brass: { n: L2('Brass', 'نحاس أصفر'), kc: 700, mc: 0.27, vrec: 300, tau: 250, uts: 400, rmin: 0.5, E: 100, Y: 250, col: 0xfacc15 }
    };
    MF.matOpts = (keys) => keys.map((k) => ({ v: k, label: MF.MAT[k].n }));

    /* =====================================================================================
     * 1. TURNING
     * ===================================================================================== */
    const PMACH = 7.5; // machine spindle power, kW
    const turnCalc = memo((p) => {
        const m = MF.MAT[p.mat], n = (1000 * p.Vc) / (PI * p.D), kc = m.kc * Math.pow(p.f, -m.mc), Fc = kc * p.ap * p.f, P = (Fc * p.Vc) / 60000 / 0.8;
        const MRR = p.Vc * p.f * p.ap, t = p.Lc / (p.f * n), Ra = ((p.f * p.f) / (32 * p.rn)) * 1000, T = 60 * Math.pow(m.vrec / p.Vc, 4);
        return { m, n, kc, Fc, P, MRR, t, Ra, T, over: P > PMACH, fast: n > 4000, parts: Math.max(1, Math.floor(T / Math.max(t, 1e-6))) };
    });
    MF.addParts({
        tn_work: pp('Workpiece', 'قطعة الشغل', 'The bar being turned. It spins in the chuck while the tool removes a layer from its surface.', 'القضيب الذي يُخرط. يدور في الظرف بينما تزيل الأداة طبقة من سطحه.', 'Cutting speed Vc = π·D·n / 1000.', 'سرعة القطع Vc = π·D·n / 1000.', 'Thin long bars bend away from the tool (chatter).', 'القضبان الطويلة الرفيعة تنحني بعيداً عن الأداة (اهتزاز).'),
        tn_tool: pp('Cutting tool (insert)', 'أداة القطع (الشفرة)', 'A hard carbide insert. It shears the metal into chips. Feed f is how far it advances per revolution; depth of cut ap is how deep it bites.', 'شفرة كربيد صلبة. تقصّ المعدن إلى رايش. التغذية f هي تقدمها في كل دورة؛ وعمق القطع ap هو عمق عضّها.', 'Removes material: Fc = kc · ap · f.', 'تزيل المادة: Fc = kc · ap · f.', 'Worn edge: rough surface, more heat, finally breakage.', 'حافة بالية: سطح خشن وحرارة أكثر ثم كسر.'),
        tn_chuck: pp('Chuck', 'الظرف', 'Grips the bar and turns it.', 'يمسك القضيب ويديره.', 'Transmits the spindle torque.', 'ينقل عزم المغزل.', NA.en, NA.ar),
        tn_chip: pp('Chips', 'الرايش', 'Metal removed from the bar. Long thin chips mean smooth cutting; hot blue chips carry most of the heat away.', 'المعدن المزال من القضيب. الرايش الطويل الرفيع يعني قطعاً ناعماً؛ والرايش الأزرق الساخن يحمل معظم الحرارة.', 'Takes ~80 % of the heat out of the cut.', 'يحمل نحو 80% من الحرارة بعيداً عن القطع.', NA.en, NA.ar)
    });
    MF.add('turn', L2('Turning (lathe)', 'الخراطة (المخرطة)'), {
        controls: () => [
            { id: 'mat', type: 'select', label: L2('Material', 'المادة'), options: MF.matOpts(['steel', 'stain', 'iron', 'alu', 'brass']), value: 'steel', rebuild: true },
            { id: 'Vc', type: 'range', label: L2('Cutting speed Vc', 'سرعة القطع Vc'), min: 30, max: 600, step: 10, value: 150, unit: 'm/min', rebuild: true },
            { id: 'f', type: 'range', label: L2('Feed per revolution f', 'التغذية لكل دورة f'), min: 0.05, max: 0.6, step: 0.01, value: 0.2, unit: 'mm/rev', rebuild: true },
            { id: 'ap', type: 'range', label: L2('Depth of cut ap', 'عمق القطع ap'), min: 0.2, max: 6, step: 0.1, value: 2, unit: 'mm', rebuild: true },
            { id: 'D', type: 'range', label: L2('Bar diameter D', 'قطر القضيب D'), min: 20, max: 150, step: 5, value: 60, unit: 'mm', rebuild: true },
            { id: 'rn', type: 'range', label: L2('Tool nose radius', 'نصف قطر رأس الأداة'), min: 0.2, max: 1.6, step: 0.2, value: 0.8, unit: 'mm', rebuild: true },
            { id: 'Lc', type: 'range', label: L2('Length to turn', 'الطول المراد خرطه'), min: 20, max: 500, step: 10, value: 150, unit: 'mm', rebuild: true }
        ],
        build(p) {
            const c = turnCalc(p), g = new THREE.Group(), R = 0.5 + (p.D / 150) * 0.7, axisY = 1.5, x0 = -3, x1 = 3, dv = clamp((p.ap / (p.D / 2)) * R, 0.07, R * 0.45), Rc = R - dv;
            g.add(box(10, 0.2, 3.4, 0x64748b, 0, 0.0, 0)); g.add(box(0.9, 1.2, 1.2, 0x475569, -3.9, 0.7, 0));
            const spin = new THREE.Group(); spin.position.set(0, axisY, 0); g.add(spin);
            const mat = lit(c.m.col, { metalness: 0.2, roughness: 0.55 }), matC = lit(c.m.col, { metalness: 0.15, roughness: 0.3 });
            const un = cylX(R, 1, c.m.col, 0, 0, 0, 'tn_work', mat), cut = cylX(Rc, 1, c.m.col, 0, 0, 0, 'tn_work', matC); spin.add(un); spin.add(cut);
            const stripe = box(x1 - x0, 0.06, 0.08, 0xdc2626, 0, R + 0.0, 0); spin.add(stripe); stripe.position.y = R * 0.995;
            const chuck = cylX(1.2, 0.6, 0x1f2937, x0 - 0.3, 0, 0, 'tn_chuck'); spin.add(chuck);
            const tool = new THREE.Group(); const body = box(1.1, 0.5, 0.5, 0xb45309, 0.95, 0.5, 0, 'tn_tool'); tool.add(body);
            const ins = box(0.35, 0.12, 0.4, 0xfacc15, 0.15, 0.2, 0, 'tn_tool'); ins.rotation.z = -0.5; tool.add(ins); g.add(tool);
            const holder = box(2.2, 0.5, 1.2, 0x334155, 0, axisY + R + 1.1, 0); g.add(holder);
            const PSN = 46, PS = FL.Particles(PSN, 0.2); g.add(PS.pts); PS.pts.userData.id = 'tn_chip';
            const vel = new Float32Array(PSN * 3), life = new Float32Array(PSN).map((_, i) => i / PSN);
            const wv = Math.max(0.5, K.rpmToVis(c.n) * 0.7);
            let xt = x1, spinA = 0; const adv = clamp(p.f * 2.2, 0.12, 1.1); // visual carriage speed (units/s)
            g.userData.update = (dt) => {
                spinA += wv * dt; spin.rotation.x = spinA;
                xt -= adv * dt; if (xt < x0 + 0.4) xt = x1;
                const lu = Math.max(0.01, xt - x0), lc = Math.max(0.01, x1 - xt);
                un.scale.y = lu; un.position.x = x0 + lu / 2; cut.scale.y = lc; cut.position.x = xt + lc / 2;
                const ty = axisY + Rc; tool.position.set(xt, ty - 0.05, 0); holder.position.set(xt + 1.0, ty + 1.0, 0);
                const sp = 1.6 + wv * 0.5;
                for (let i = 0; i < PSN; i++) {
                    life[i] += dt * 0.9;
                    if (life[i] >= 1) { life[i] = 0; vel[i * 3] = 0.5 + Math.random() * 0.8; vel[i * 3 + 1] = 0.9 + Math.random() * 1.1; vel[i * 3 + 2] = (Math.random() - 0.5) * 1.2; PS.pos[i * 3] = xt + 0.1; PS.pos[i * 3 + 1] = ty; PS.pos[i * 3 + 2] = 0; }
                    vel[i * 3 + 1] -= 4.5 * dt; PS.pos[i * 3] += vel[i * 3] * dt * (sp * 0.3); PS.pos[i * 3 + 1] += vel[i * 3 + 1] * dt; PS.pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
                    if (PS.pos[i * 3 + 1] < 0.15) { PS.pos[i * 3 + 1] = 0.15; vel[i * 3 + 1] = 0; vel[i * 3] = 0; }
                    const h = 1 - life[i], hot = Math.min(1, c.P / PMACH + 0.2);
                    PS.col[i * 3] = 0.45 + 0.5 * h * hot; PS.col[i * 3 + 1] = 0.5 + 0.1 * h; PS.col[i * 3 + 2] = 0.75 - 0.3 * h * hot;
                }
                PS.commit();
            };
            g.userData.fit = { w: 4.8, h: 2.6, dir: [0.15, 0.35, 1] }; g.userData.target = [-0.5, 1.7, 0];
            return g;
        },
        readouts(p) {
            const c = turnCalc(p);
            return [
                { k: L2('Spindle speed  (this machine: up to 4000 rpm)', 'سرعة المغزل  (هذه الآلة: حتى 4000 rpm)'), v: fmt(c.n, 0) + ' rpm', state: c.fast ? 'bad' : '' },
                { k: L2('Motor power needed = cutting power ÷ 0.8  (machine has 7.5 kW)', 'استطاعة المحرك اللازمة = استطاعة القطع ÷ 0.8  (الآلة 7.5 kW)'), v: fmt(c.P, 2) + ' kW', state: c.over ? 'bad' : c.P > PMACH * 0.8 ? 'warn' : 'ok' },
                { k: L2('Time to turn the length', 'زمن خرط الطول'), v: fmt(c.t, 2) + ' min' },
                { k: L2('Surface roughness Ra', 'خشونة السطح Ra'), v: fmt(c.Ra, 2) + ' µm', state: c.Ra > 6.3 ? 'bad' : c.Ra > 3.2 ? 'warn' : 'ok' },
                { k: L2('Cutting force Fc = kc · ap · f', 'قوة القطع Fc = kc · ap · f'), v: fmt(c.Fc, 0) + ' N' },
                { k: L2('Material removed per minute', 'المادة المزالة كل دقيقة'), v: fmt(c.MRR, 0) + ' cm³/min' },
                { k: L2('Tool life at this speed', 'عمر الأداة عند هذه السرعة'), v: fmt(c.T, 0) + ' min', state: c.T < 15 ? 'bad' : c.T < 30 ? 'warn' : 'ok' },
                { k: L2('Parts per tool edge', 'عدد القطع لكل حافة أداة'), v: String(c.parts) }
            ];
        },
        bom: () => [],
        challenges: () => [
            CH('Get a smooth surface (Ra ≤ 1.6 µm) while removing at least 90 cm³/min.', 'احصل على سطح ناعم (Ra ≤ 1.6 µm) مع إزالة 90 cm³/min على الأقل.', (p) => { const c = turnCalc(p); return c.Ra <= 1.6 && c.MRR >= 90 && !c.over; }),
            CH('Remove at least 150 cm³/min and keep the tool life above 30 min (use aluminium).', 'أزل 150 cm³/min على الأقل وأبقِ عمر الأداة فوق 30 دقيقة (استعمل الألمنيوم).', (p) => { const c = turnCalc(p); return p.mat === 'alu' && c.MRR >= 150 && c.T >= 30 && !c.over; }),
            CH('Overload the machine: make the cutting power exceed 7.5 kW.', 'حمّل الآلة فوق طاقتها: اجعل استطاعة القطع تتجاوز 7.5 kW.', (p) => turnCalc(p).over),
            CH('Turn stainless steel with a tool life of at least 45 min and MRR of 40 cm³/min or more.', 'اخرط فولاذاً لا يصدأ بعمر أداة 45 دقيقة على الأقل وإزالة 40 cm³/min أو أكثر.', (p) => { const c = turnCalc(p); return p.mat === 'stain' && c.T >= 45 && c.MRR >= 40 && !c.over; })
        ],
        panels(p) {
            const c = turnCalc(p), tl = [], pw = [];
            for (let V = 30; V <= 600; V += 15) { const q = turnCalc(Object.assign({}, p, { Vc: V })); tl.push([V, Math.min(q.T, 600)]); }
            for (let f = 0.05; f <= 0.601; f += 0.025) { const q = turnCalc(Object.assign({}, p, { f })); pw.push([f, q.P]); }
            return [
                { type: 'line', h: 170, title: L2('Tool life vs cutting speed', 'عمر الأداة مقابل سرعة القطع'), unit: 'min', xlabel: L2('Cutting speed (m/min)', 'سرعة القطع (m/min)'), xmin: 30, xmax: 600, ymin: 0, ymax: 200, series: [{ label: 'T', pts: tl.map((q) => [q[0], Math.min(q[1], 200)]), fill: true }], marks: [{ x: p.Vc, y: Math.min(c.T, 200), label: fmt(c.T, 0) }] },
                { type: 'line', h: 170, title: L2('Cutting power vs feed', 'استطاعة القطع مقابل التغذية'), unit: 'kW', xlabel: L2('Feed (mm/rev)', 'التغذية (mm/rev)'), xmin: 0.05, xmax: 0.6, ymin: 0, series: [{ label: 'P', pts: pw, fill: true }, { label: L2('Machine limit', 'حد الآلة'), pts: [[0.05, PMACH], [0.6, PMACH]], color: '#dc2626' }], marks: [{ x: p.f, y: c.P, label: fmt(c.P, 1) }] }
            ];
        }
    });

    /* =====================================================================================
     * 2. MILLING
     * ===================================================================================== */
    const millCalc = memo((p) => {
        const m = MF.MAT[p.mat], n = (1000 * p.Vc) / (PI * p.Dc), vf = p.fz * p.z * n, ae = Math.min(p.ae, p.Dc), hm = Math.max(0.01, p.fz * Math.sqrt(Math.min(1, ae / p.Dc))), kc = m.kc * Math.pow(hm, -m.mc);
        const MRR = (ae * p.ap * vf) / 1000, P = (kc * MRR) / 60000 / 0.8, t = (p.Lc + p.Dc) / vf, Fc = (P * 0.8 * 60000) / Math.max(p.Vc, 1), T = 60 * Math.pow(m.vrec * 0.9 / p.Vc, 4);
        return { m, n, vf, hm, kc, MRR, P, t, Fc, T, ae, aeCut: p.ae > p.Dc, over: P > PMACH, fast: n > 12000, Ra: ((p.fz * p.fz) / (8 * p.Dc)) * 1000 };
    });
    MF.addParts({
        ml_cutter: pp('Milling cutter', 'قاطع التفريز', 'A rotating tool with several teeth. Each tooth takes a small bite (feed per tooth fz) and leaves.', 'أداة دوّارة بعدة أسنان. يأخذ كل سن قضمة صغيرة (التغذية لكل سن fz) ثم يغادر.', 'Table feed vf = fz · z · n.', 'تغذية الطاولة vf = fz · z · n.', 'Too much fz breaks teeth; too little rubs and wears them.', 'تغذية كبيرة تكسر الأسنان؛ وصغيرة جداً تحتك وتبلي.'),
        ml_block: pp('Workpiece', 'قطعة الشغل', 'The block clamped on the machine table.', 'القطعة المشبوكة على طاولة الآلة.', NA.en, NA.ar, NA.en, NA.ar),
        ml_cut: pp('Cut (slot)', 'القطع (المجرى)', 'The groove made by the cutter. Its width is the radial engagement ae and its depth is the axial depth ap.', 'المجرى الذي يصنعه القاطع. عرضه هو الانغماس الشعاعي ae وعمقه هو العمق المحوري ap.', 'Material removal rate = ae · ap · vf.', 'معدل إزالة المادة = ae · ap · vf.', NA.en, NA.ar),
        ml_table: pp('Machine table', 'طاولة الآلة', 'Carries the workpiece and moves it past the cutter at the feed rate vf.', 'تحمل القطعة وتحركها أمام القاطع بسرعة التغذية vf.', 'Positions the work.', 'تحدد موضع الشغل.', NA.en, NA.ar)
    });
    MF.add('mill', L2('Milling', 'التفريز'), {
        controls: (cur) => [
            { id: 'mat', type: 'select', label: L2('Material', 'المادة'), options: MF.matOpts(['steel', 'stain', 'iron', 'alu', 'brass']), value: 'steel', rebuild: true },
            { id: 'Dc', type: 'range', label: L2('Cutter diameter', 'قطر القاطع'), min: 6, max: 50, step: 2, value: 20, unit: 'mm', rebuild: true },
            { id: 'z', type: 'range', label: L2('Number of teeth z', 'عدد الأسنان z'), min: 2, max: 8, step: 1, value: 4, rebuild: true },
            { id: 'Vc', type: 'range', label: L2('Cutting speed Vc', 'سرعة القطع Vc'), min: 30, max: 600, step: 10, value: 120, unit: 'm/min', rebuild: true },
            { id: 'fz', type: 'range', label: L2('Feed per tooth fz', 'التغذية لكل سن fz'), min: 0.02, max: 0.3, step: 0.01, value: 0.08, unit: 'mm', rebuild: true },
            { id: 'ap', type: 'range', label: L2('Depth of cut ap', 'عمق القطع ap'), min: 0.5, max: 20, step: 0.5, value: 4, unit: 'mm', rebuild: true },
            { id: 'ae', type: 'range', label: L2('Width of cut ae (not more than the cutter diameter)', 'عرض القطع ae (لا يزيد عن قطر القاطع)'), min: 1, max: Math.max(6, Math.min(50, +cur.Dc || 20)), step: 1, value: 10, unit: 'mm', rebuild: true },
            { id: 'Lc', type: 'range', label: L2('Length of the cut', 'طول القطع'), min: 50, max: 500, step: 10, value: 200, unit: 'mm', rebuild: true }
        ],
        build(p) {
            const c = millCalc(p), g = new THREE.Group(), r = 0.3 + (p.Dc / 50) * 0.5, bw = 6, bh = 1.0, bd = 2.6;
            g.add(box(9, 0.4, 3.6, 0x475569, 0, -0.2, 0, 'ml_table'));
            g.add(box(bw, bh, bd, c.m.col, 0, bh / 2, 0, 'ml_block'));
            const cutW = clamp((c.ae / p.Dc) * 2 * r, 0.1, 2 * r), cutD = clamp((p.ap / 20) * 0.7, 0.06, 0.7);
            const trench = box(1, cutD, cutW, 0x1f2937, 0, bh - cutD / 2 + 0.003, 0, 'ml_cut'); g.add(trench);
            const cu = new THREE.Group(); g.add(cu);
            const sh = cylY(r, 1.2, 0xcbd5e1, 0, 0, 0, 'ml_cutter'); sh.material = lit(0xcbd5e1, { metalness: 0.2, roughness: 0.4 }); cu.add(sh);
            for (let i = 0; i < p.z; i++) { const a = (i / p.z) * 2 * PI, t = box(0.1, 1.2, 0.2, 0xfacc15, Math.cos(a) * r, 0, Math.sin(a) * r, 'ml_cutter'); t.rotation.y = -a; cu.add(t); }
            const spindle = box(0.5, 1.6, 0.5, 0x334155, 0, 0, 0); g.add(spindle);
            const wv = Math.max(0.6, K.rpmToVis(c.n) * 0.7); let x = -bw / 2 + 0.2, spinA = 0; const spd = clamp(c.vf / 500, 0.2, 1.4);
            const zc = -r + cutW / 2, cy = bh - cutD + 0.6;
            g.userData.update = (dt) => {
                spinA += wv * dt; cu.rotation.y = spinA; x += spd * dt; if (x > bw / 2 - 0.2) x = -bw / 2 + 0.2;
                cu.position.set(x, cy, 0); spindle.position.set(x, cy + 1.4, 0);
                trench.scale.x = Math.max(0.01, x + bw / 2); trench.position.x = -bw / 2 + trench.scale.x / 2; trench.position.z = zc;
            };
            g.userData.fit = { w: 3.9, h: 2.0, dir: [0.2, 0.45, 1] }; g.userData.target = [0, 1.2, 0];
            return g;
        },
        readouts(p) {
            const c = millCalc(p);
            return [
                ...(c.aeCut ? [{ k: L2('Width of cut', 'عرض القطع'), v: T2('Limited to the cutter diameter (' + fmt(c.ae, 0) + ' mm, full slot)', 'محدود بقطر القاطع (' + fmt(c.ae, 0) + ' mm، مجرى كامل)'), state: 'warn' }] : []),
                { k: L2('Spindle speed  (this machine: up to 12000 rpm)', 'سرعة المغزل  (هذه الآلة: حتى 12000 rpm)'), v: fmt(c.n, 0) + ' rpm', state: c.fast ? 'bad' : '' },
                { k: L2('Table feed  vf = fz · z · n', 'تغذية الطاولة  vf = fz · z · n'), v: fmt(c.vf, 0) + ' mm/min' },
                { k: L2('Motor power needed = cutting power ÷ 0.8  (machine has 7.5 kW)', 'استطاعة المحرك اللازمة = استطاعة القطع ÷ 0.8  (الآلة 7.5 kW)'), v: fmt(c.P, 2) + ' kW', state: c.over ? 'bad' : c.P > PMACH * 0.8 ? 'warn' : 'ok' },
                { k: L2('Time for one pass', 'زمن مرور واحد'), v: fmt(c.t, 2) + ' min' },
                { k: L2('Material removed per minute', 'المادة المزالة كل دقيقة'), v: fmt(c.MRR, 1) + ' cm³/min' },
                { k: L2('Chip thickness per tooth', 'سماكة الرايش لكل سن'), v: fmt(c.hm * 1000, 0) + ' µm', state: c.hm < 0.03 ? 'warn' : '' },
                { k: L2('Tool life (estimate)', 'عمر الأداة (تقدير)'), v: fmt(c.T, 0) + ' min', state: c.T < 15 ? 'bad' : c.T < 30 ? 'warn' : 'ok' }
            ];
        },
        bom: () => [],
        challenges: () => [
            CH('Remove at least 30 cm³/min in steel while keeping the power under 5 kW.', 'أزل 30 cm³/min على الأقل من الفولاذ مع إبقاء الاستطاعة تحت 5 kW.', (p) => { const c = millCalc(p); return p.mat === 'steel' && c.MRR >= 30 && c.P < 5; }),
            CH('Cut aluminium at 3000 mm/min or faster without exceeding the machine power.', 'قطّع ألمنيوم بسرعة 3000 mm/min أو أكثر دون تجاوز استطاعة الآلة.', (p) => { const c = millCalc(p); return p.mat === 'alu' && c.vf >= 3000 && !c.over && !c.fast; }),
            CH('Finish one pass of a 200 mm cut in under 1 minute in cast iron.', 'أنهِ مروراً واحداً بطول 200 mm في أقل من دقيقة في حديد زهر.', (p) => { const c = millCalc(p); return p.mat === 'iron' && p.Lc >= 200 && c.t < 1 && !c.over; })
        ],
        panels(p) {
            const c = millCalc(p), a = [], b = [];
            for (let fz = 0.02; fz <= 0.301; fz += 0.01) { const q = millCalc(Object.assign({}, p, { fz })); a.push([fz, q.vf]); }
            for (let ae = 1; ae <= 50; ae += 1) { const q = millCalc(Object.assign({}, p, { ae })); b.push([ae, q.P]); }
            return [
                { type: 'line', h: 170, title: L2('Table feed vs feed per tooth', 'تغذية الطاولة مقابل التغذية لكل سن'), unit: 'mm/min', xlabel: L2('fz (mm)', 'fz (mm)'), xmin: 0.02, xmax: 0.3, ymin: 0, series: [{ label: 'vf', pts: a, fill: true }], marks: [{ x: p.fz, y: c.vf, label: fmt(c.vf, 0) }] },
                { type: 'line', h: 170, title: L2('Power vs width of cut', 'الاستطاعة مقابل عرض القطع'), unit: 'kW', xlabel: L2('ae (mm)', 'ae (mm)'), xmin: 1, xmax: 50, ymin: 0, series: [{ label: 'P', pts: b, fill: true }, { label: L2('Machine limit', 'حد الآلة'), pts: [[1, PMACH], [50, PMACH]], color: '#dc2626' }], marks: [{ x: p.ae, y: c.P, label: fmt(c.P, 1) }] }
            ];
        }
    });

    /* =====================================================================================
     * 3. PUNCHING PRESS
     * ===================================================================================== */
    const prCalc = memo((p) => {
        const m = MF.MAT[p.mat], t = p.t, F = PI * p.d * t * m.tau, ps = F / ((PI * p.d * p.d) / 4), clr = (p.clr / 100) * t;
        return { m, F, ps, clr, ok: ps < 1500, tons: F / 9810, energy: 0.5 * F * t / 1000, dRec: p.d, bad: p.d < t };
    });
    MF.addParts({
        pr_punch: pp('Punch', 'المثقب (الزنبة)', 'The hardened tool that pushes down.', 'الأداة المقساة التي تضغط للأسفل.', 'Force F = π·d·t·τ.', 'القوة F = π·d·t·τ.', 'A punch thinner than the sheet buckles or snaps.', 'مثقب أرفع من الصفيحة ينبعج أو ينكسر.'),
        pr_die: pp('Die', 'القالب', 'The block below the sheet. Its hole is slightly bigger than the punch (the clearance).', 'الكتلة تحت الصفيحة. ثقبها أكبر قليلاً من المثقب (الخلوص).', 'Supports the sheet and shapes the cut.', 'يسند الصفيحة ويشكل القطع.', 'Wrong clearance: burrs or fast wear.', 'خلوص خاطئ: نتوءات أو بلى سريع.'),
        pr_sheet: pp('Sheet metal', 'الصفيحة المعدنية', 'The workpiece. Thicker and stronger sheet needs far more force.', 'قطعة الشغل. الصفيحة الأسمك والأقوى تحتاج قوة أكبر بكثير.', 'Thickness t and strength decide the force.', 'السماكة t والمتانة تحددان القوة.', 'Too thin a sheet for the punch bends instead of cutting.', 'صفيحة رقيقة جداً بالنسبة للمثقب تنثني بدل أن تُقص.'),
        pr_slug: pp('Slug (punched-out piece)', 'القطعة المثقوبة (القرص)', 'The disc that falls out of the sheet when it is punched.', 'القرص الذي يسقط من الصفيحة عند ثقبها.', NA.en, NA.ar, NA.en, NA.ar),
        pr_ram: pp('Press ram', 'مكبس الضغط', 'Pushes the punch down with the required force (tonnage).', 'يدفع المثقب للأسفل بالقوة اللازمة (الحمولة).', 'The press must be rated above the needed force.', 'يجب أن تفوق سعة المكبس القوة المطلوبة.', NA.en, NA.ar)
    });
    MF.add('press', L2('Punching press', 'مكبس الثقب (الصفائح)'), {
        controls: () => [
            { id: 'mat', type: 'select', label: L2('Material', 'المادة'), options: MF.matOpts(['steel', 'stain', 'alu', 'brass']), value: 'steel', rebuild: true },
            { id: 't', type: 'range', label: L2('Sheet thickness t', 'سماكة الصفيحة t'), min: 0.5, max: 6, step: 0.5, value: 2, unit: 'mm', rebuild: true },
            { id: 'd', type: 'range', label: L2('Hole diameter d', 'قطر الثقب d'), min: 4, max: 100, step: 1, value: 20, unit: 'mm', rebuild: true },
            { id: 'clr', type: 'range', label: L2('Die clearance (per side)', 'خلوص القالب (لكل جهة)'), min: 2, max: 20, step: 1, value: 8, unit: '% t', rebuild: true }
        ],
        build(p) {
            const c = prCalc(p), g = new THREE.Group(), th = 0.06 + p.t * 0.045, y0 = 1.0;
            g.add(box(9, 0.3, 3.2, 0x475569, 0, -0.15, 0)); g.add(box(0.5, 4.6, 0.8, 0x334155, -3.6, 2.2, 0)); g.add(box(0.5, 4.6, 0.8, 0x334155, 3.6, 2.2, 0)); g.add(box(7.7, 0.7, 0.9, 0x1d4ed8, 0, 4.7, 0, 'pr_ram'));
            const ramTop = 4.35;
            
                const r = 0.15 + (p.d / 100) * 0.85, hole = r * (1 + (p.clr / 100) * 2 * 0.6 + 0.05);
                const die = new THREE.Mesh(new THREE.CylinderGeometry(r * 2.4 + 1, r * 2.4 + 1, y0 - 0.2, 40), lit(0x1f2937)); die.position.set(0, (y0 - 0.2) / 2 - 0.0, 0); die.userData.id = 'pr_die'; g.add(die);
                const dh = cylY(hole, y0 - 0.1, 0x0f172a, 0, (y0 - 0.2) / 2 + 0.02, 0); dh.scale.set(1, 1.001, 1); g.add(dh);
                const sh = new THREE.Shape(), W = r * 6 + 2; sh.moveTo(-W / 2, -1.5); sh.lineTo(W / 2, -1.5); sh.lineTo(W / 2, 1.5); sh.lineTo(-W / 2, 1.5); sh.closePath();
                const hp = new THREE.Path(); hp.absarc(0, 0, r, 0, PI * 2, true); sh.holes.push(hp);
                const sheet = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: th, bevelEnabled: false }), lit(c.m.col, { metalness: 0.1, roughness: 0.6 })); sheet.rotation.x = -PI / 2; sheet.position.y = y0; sheet.userData.id = 'pr_sheet'; g.add(sheet);
                const slug = cylY(r * 0.995, th, 0xfacc15, 0, y0 + th / 2, 0, 'pr_slug'); g.add(slug);
                const pun = cylY(r * 0.98, 1.4, 0xcbd5e1, 0, 3.5, 0, 'pr_punch'); g.add(pun);
                const stem = box(0.5 + r * 0.4, 1.2, 0.5 + r * 0.4, 0x94a3b8, 0, 4.2, 0); g.add(stem);
                let ph = 0; const per = 3.2, top = 3.2, bot = y0 + th + 0.7;
                g.userData.update = (dt) => {
                    ph = (ph + dt / per) % 1; let u = 0; if (ph < 0.4) u = ph / 0.4; else if (ph < 0.5) u = 1; else if (ph < 0.8) u = 1 - (ph - 0.5) / 0.3; else u = 0;
                    const y = top + (bot - top) * Math.sin(u * PI / 2) * 1.0; pun.position.y = y; stem.position.y = y + 1.0;
                    if (ph >= 0.4 && ph < 0.85) { const f = clamp((ph - 0.4) / 0.2, 0, 1); slug.position.y = y0 + th / 2 - f * (y0 - 0.1) * 0.9; slug.material.opacity = 1; } else if (ph >= 0.85) { slug.position.y = y0 + th / 2; } else slug.position.y = y0 + th / 2;
                };
            
            g.userData.fit = { w: 4.6, h: 3.1, dir: [0.15, 0.2, 1] }; g.userData.target = [0, 2.2, 0];
            return g;
        },
        readouts(p) {
            const c = prCalc(p);
            return [
                { k: L2('Punching force F = π · d · t · τ', 'قوة الثقب F = π · d · t · τ'), v: fmt(c.F / 1000, 1) + ' kN' },
                { k: L2('Press size needed', 'حجم المكبس اللازم'), v: fmt(c.tons * 1.2, 1) + ' t' },
                { k: L2('Stress in the punch', 'الإجهاد في المثقب'), v: fmt(c.ps, 0) + ' MPa', state: c.ps > 1500 ? 'bad' : c.ps > 1000 ? 'warn' : 'ok' },
                { k: L2('Hole diameter vs thickness', 'قطر الثقب مقابل السماكة'), v: c.bad ? T2('Too small: the punch may snap', 'صغير جداً: قد ينكسر المثقب') : T2('OK', 'مقبول'), state: c.bad ? 'bad' : 'ok' },
                { k: L2('Clearance per side', 'الخلوص لكل جهة'), v: fmt(c.clr, 2) + ' mm', state: p.clr >= 5 && p.clr <= 12 ? 'ok' : 'warn' },
                { k: L2('Work done per hole', 'الشغل لكل ثقب'), v: fmt(c.energy, 1) + ' J' }
            ];
        },
        bom: () => [],
        challenges: () => [
            CH('Punch a 30 mm hole in 3 mm steel with a press of 20 t or smaller.', 'اثقب ثقباً 30 mm في فولاذ 3 mm بمكبس 20 t أو أصغر.', (p) => { const c = prCalc(p); return p.mat === 'steel' && p.d >= 30 && p.t >= 3 && c.tons * 1.2 <= 20; }),
            CH('Make the punch fail on purpose: a hole smaller than the sheet thickness.', 'اجعل المثقب يفشل عمداً: ثقب أصغر من سماكة الصفيحة.', (p) => prCalc(p).bad)
        ],
        panels(p) {
            const c = prCalc(p), a = [];
            for (let d = 4; d <= 100; d += 4) a.push([d, prCalc(Object.assign({}, p, { d })).F / 1000]);
            return [{ type: 'line', h: 180, title: L2('Punching force vs hole diameter', 'قوة الثقب مقابل قطر الثقب'), unit: 'kN', xlabel: L2('Hole diameter (mm)', 'قطر الثقب (mm)'), xmin: 4, xmax: 100, ymin: 0, series: [{ label: 'F', pts: a, fill: true }], marks: [{ x: p.d, y: c.F / 1000, label: fmt(c.F / 1000, 0) }] }];
        }
    });
})();
