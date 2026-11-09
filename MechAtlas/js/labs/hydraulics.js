/* Hydraulics & Pneumatics lab — core + hydraulic jack (Pascal) + hydraulic cylinder circuit + pneumatic cylinder circuit.
 * Built for students: few controls, the key numbers first, everything else tucked away. Needs strength.js / fluids.js helpers. */
(function () {
    'use strict';
    const SM = window.SM, K = window.GearKit, FL = window.FL;
    if (!SM || !K || !FL || !window.THREE || !window.Labs) return;
    const PI = Math.PI, L2 = SM.L2, fmt = K.fmt, lit = SM.lit, CH = SM.CH, memo = SM.memo;
    const T2 = FL.T2, G = 9.81, clamp = FL.clamp, trans = FL.trans, NA = L2('—', '—');

    const HY = (window.HY = { models: {}, L2, fmt, clamp });
    const lab = {
        id: 'hydraulics', icon: 'fa-gauge-high', title: L2('Hydraulics & Pneumatics', 'الهيدروليك والنيوماتيك'),
        intro: L2('Oil and air that push, lift and turn. Change a value and watch the force, speed and pressure respond.',
            'زيت وهواء يدفعان ويرفعان ويديران. غيّر قيمة وشاهد القوة والسرعة والضغط كيف تتغير.'),
        models: [], parts: {}, supports: { section: false },
        controls(model, cur) { return HY.models[model].controls(cur || {}); },
        build(model, p, api) { return HY.models[model].build(p, api); },
        apply() { },
        readouts(model, p, api, group) { return HY.models[model].readouts(p, group); },
        challenges(model) { return HY.models[model].challenges(); },
        listParts(model, p) { const m = HY.models[model]; return m.bom ? m.bom(p) : []; },
        charts: { draw(canvas, model, p, info) { K.drawPanels(canvas, HY.models[model].panels(p), info); } }
    };
    window.Labs.register(lab);
    HY.lab = lab;
    HY.add = (id, title, def) => { HY.models[id] = def; lab.models.push({ id, title }); };
    HY.addParts = (o) => Object.assign(lab.parts, o);
    HY.pp = (nEn, nAr, dEn, dAr, fEn, fAr, failEn, failAr) => SM.P(L2(nEn, nAr), L2(dEn, dAr), NA, L2(fEn, fAr), NA, NA, NA, NA, failEn ? L2(failEn, failAr) : NA);
    const pp = HY.pp;

    /* ---------- small 3D helpers ---------- */
    const box = (w, h, d, color, x, y, z, id) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), lit(color)); m.position.set(x, y, z); if (id) m.userData.id = id; return m; };
    const cylY = (r, h, color, x, y, z, id) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 28), lit(color)); m.position.set(x, y, z); if (id) m.userData.id = id; return m; };
    const cylX = (r, len, color, x, y, z, id, mat) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 28), mat || lit(color)); m.rotation.z = PI / 2; m.position.set(x, y, z); if (id) m.userData.id = id; return m; };
    const colMat = (u) => { const c = FL.pcol(u); return new THREE.Color(c[0], c[1], c[2]); };
    HY.box = box; HY.cylY = cylY; HY.cylX = cylX; HY.colMat = colMat;
    HY.gauge = (x, y, z, id) => {
        const g = new THREE.Group(); g.position.set(x, y, z); g.userData.id = id;
        const face = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.1, 28), lit(0xf8fafc)); face.rotation.x = PI / 2; g.add(face);
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.04, 8, 28), lit(0x475569)); g.add(rim);
        const nd = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.3, 0.04), lit(0xdc2626)); nd.position.y = 0.15; const pv = new THREE.Group(); pv.add(nd); pv.position.z = 0.08; g.add(pv);
        const stem = cylY(0.08, 0.3, 0x475569, 0, -0.45, 0); g.add(stem);
        g.userData.needle = pv; g.userData.setU = (u) => { pv.rotation.z = (0.75 - clamp(u, 0, 1) * 1.5) * PI; };
        g.userData.setU(0); return g;
    };

    /* =====================================================================================
     * 1. HYDRAULIC JACK — Pascal's principle
     * ===================================================================================== */
    const jackCalc = memo((p) => {
        const A1 = (PI * Math.pow(p.D1 / 1000, 2)) / 4, A2 = (PI * Math.pow(p.D2 / 1000, 2)) / 4, ratio = A2 / A1;
        const pr = p.F1 / A1, F2 = pr * A2 * 0.95, W = p.load * 1000 * G; // 5 % friction
        return { A1, A2, ratio, p: pr, F2, W, lifts: F2 >= W, kg: F2 / G, F1req: W / (0.95 * ratio), stroke: 25, rise: 25 / ratio, strokes100: Math.ceil(100 / (25 / ratio)), Win: p.F1 * 0.025, Wout: F2 * (0.025 / ratio) };
    });
    HY.addParts({
        hy_small: pp('Small piston (effort side)', 'المكبس الصغير (جهة الجهد)', 'You push this piston with a small force. It moves a long way but makes high pressure.', 'تدفع هذا المكبس بقوة صغيرة. يتحرك مسافة طويلة لكنه يولّد ضغطاً عالياً.', 'Turns your small force into oil pressure: p = F₁ / A₁.', 'يحوّل قوتك الصغيرة إلى ضغط في الزيت: p = F₁ / A₁.', 'Worn seals leak and the pressure drops.', 'تآكل الأختام يسبب تسرباً وانخفاضاً بالضغط.'),
        hy_big: pp('Big piston (load side)', 'المكبس الكبير (جهة الحمل)', 'The same pressure acts on a much bigger area, so the force is multiplied.', 'نفس الضغط يؤثر على مساحة أكبر بكثير فتتضاعف القوة.', 'Lifts the load: F₂ = p · A₂.', 'يرفع الحمل: F₂ = p · A₂.', 'Overloading the jack beyond its rated pressure can burst the cylinder.', 'تحميل الرافعة فوق ضغطها المقنن قد يفجّر الأسطوانة.'),
        hy_oil: pp('Hydraulic oil', 'الزيت الهيدروليكي', 'Oil is almost incompressible, so it passes pressure from one piston to the other (Pascal\'s principle).', 'الزيت شبه غير قابل للانضغاط فينقل الضغط من مكبس لآخر (مبدأ باسكال).', 'Transmits pressure equally in every direction.', 'ينقل الضغط بالتساوي في كل الاتجاهات.', 'Air bubbles make the jack feel spongy.', 'فقاعات الهواء تجعل الرافعة "إسفنجية".'),
        hy_load: pp('Load', 'الحمل', 'The weight to be lifted. The box grows with the load you choose.', 'الوزن المراد رفعه. يكبر المكعب مع الحمل الذي تختاره.', 'The jack must produce F₂ ≥ weight.', 'يجب أن تعطي الرافعة F₂ ≥ الوزن.', NA.en, NA.ar),
        hy_handle: pp('Handle / effort', 'المقبض (الجهد)', 'Where you apply the effort force F₁.', 'مكان تطبيق قوة الجهد F₁.', 'Moves the small piston up and down; check valves keep the oil going to the big piston.', 'يحرك المكبس الصغير صعوداً وهبوطاً؛ والصمامات اللارجوعية تبقي الزيت متجهاً للمكبس الكبير.', NA.en, NA.ar)
    });
    HY.add('jack', L2('Hydraulic jack (Pascal)', 'الرافعة الهيدروليكية (باسكال)'), {
        controls: () => [
            { id: 'F1', type: 'range', label: L2('Force on the small piston F₁', 'القوة على المكبس الصغير F₁'), min: 50, max: 2000, step: 10, value: 400, unit: 'N', rebuild: true },
            { id: 'D1', type: 'range', label: L2('Small piston diameter', 'قطر المكبس الصغير'), min: 10, max: 40, step: 1, value: 20, unit: 'mm', rebuild: true },
            { id: 'D2', type: 'range', label: L2('Big piston diameter', 'قطر المكبس الكبير'), min: 50, max: 300, step: 5, value: 120, unit: 'mm', rebuild: true },
            { id: 'load', type: 'range', label: L2('Load to lift', 'الحمل المراد رفعه'), min: 0.1, max: 30, step: 0.1, value: 2, unit: 't', rebuild: true }
        ],
        build(p) {
            const c = jackCalc(p), g = new THREE.Group();
            const r1 = 0.2 + (p.D1 / 40) * 0.2, r2 = 0.5 + (p.D2 / 300) * 0.85, H = 3.2, x1 = -3.0, x2 = 0.6 + r2 * 0.25;
            g.add(box(11, 0.25, 3, 0x64748b, -0.5, -0.125, 0));
            const shell = trans(0x94a3b8, 0.25, { side: THREE.DoubleSide });
            const sA = cylY(r1, H, 0x94a3b8, x1, H / 2, 0); sA.material = shell; sA.userData.id = 'hy_small'; g.add(sA);
            const sB = cylY(r2, H, 0x94a3b8, x2, H / 2, 0); sB.material = shell; sB.userData.id = 'hy_big'; g.add(sB);
            const pipe = cylX(0.1, x2 - x1, 0x38bdf8, (x1 + x2) / 2, 0.25, 0, 'hy_oil'); pipe.material = trans(0x38bdf8, 0.6); g.add(pipe);
            const u = clamp(c.p / 8e7, 0, 1);
            const oilS = cylY(r1 * 0.96, 1, 0x38bdf8, x1, 0.5, 0, 'hy_oil'), oilB = cylY(r2 * 0.96, 1, 0x38bdf8, x2, 0.5, 0, 'hy_oil');
            [oilS, oilB].forEach((o) => { o.material = trans(0x38bdf8, 0.6); o.material.color = colMat(u); g.add(o); });
            // small piston + handle
            const pS = new THREE.Group(); pS.add(cylY(r1 * 0.95, 0.2, 0x334155, 0, 0, 0, 'hy_small')); pS.add(cylY(0.05, 1.2, 0x94a3b8, 0, 0.7, 0));
            const hd = box(1.6, 0.14, 0.3, 0xf59e0b, 0, 1.35, 0, 'hy_handle'); pS.add(hd); pS.position.set(x1, 2.2, 0); g.add(pS);
            const fArrow = SM.dirArrow([x1, 3.9, 0], [0, -1, 0], 1.4, 0xdc2626, 0.07); g.add(fArrow);
            // big piston, platform, load
            const pB = new THREE.Group(); pB.add(cylY(r2 * 0.95, 0.2, 0x334155, 0, 0, 0, 'hy_big')); pB.add(cylY(0.12, 1.0, 0x94a3b8, 0, 0.6, 0));
            const plat = box(r2 * 2.3, 0.14, 1.6, 0x475569, 0, 1.15, 0); pB.add(plat);
            const sz = 0.5 + Math.cbrt(p.load / 30) * 1.1; const ld = box(sz, sz, sz, 0xb45309, 0, 1.22 + sz / 2, 0, 'hy_load'); pB.add(ld);
            pB.position.set(x2, 0.6, 0); g.add(pB);
            const f2 = SM.dirArrow([x2 + r2 + 0.5, 0.3, 0.8], [0, 1, 0], 1.4, 0x16a34a, 0.07); g.add(f2);
            const topB = H - 1.9 - 0.2; let rise = 0, ph = 0, stalled = !c.lifts;
            g.userData.update = (dt) => {
                const per = 1.1; ph = (ph + dt / per) % 1;
                const down = ph < 0.5, k = down ? ph * 2 : (1 - (ph - 0.5) * 2); // 0..1..0
                const sY = 2.3 - (stalled ? 0 : k * 0.7);
                pS.position.y = sY; fArrow.position.y = sY + 1.7; oilS.scale.y = Math.max(0.1, sY - 0.2); oilS.position.y = oilS.scale.y / 2 + 0.2;
                if (!stalled && down && k > 0) rise = Math.min(topB, rise + dt * (0.7 / per) * 2 * (1 / c.ratio));
                if (!stalled && rise >= topB - 1e-3) rise = 0;
                pB.position.y = 0.6 + rise; oilB.scale.y = Math.max(0.1, 0.6 + rise - 0.2); oilB.position.y = oilB.scale.y / 2 + 0.2; f2.position.y = 0.3 + rise;
            };
            g.userData.fit = { w: 4.9, h: 2.7, dir: [0.15, 0.15, 1] }; g.userData.target = [-0.9, 1.9, 0];
            return g;
        },
        readouts(p) {
            const c = jackCalc(p);
            return [
                { k: L2('Oil pressure p = F₁ / A₁', 'ضغط الزيت p = F₁ / A₁'), v: fmt(c.p / 1e5, 1) + ' bar', state: c.p > 4e7 ? 'warn' : '' },
                { k: L2('Lifting force F₂ = p · A₂', 'قوة الرفع F₂ = p · A₂'), v: fmt(c.F2 / 1000, 2) + ' kN  (≈ ' + fmt(c.kg / 1000, 2) + ' t)' },
                { k: L2('Force multiplication A₂ / A₁', 'تضخيم القوة A₂ / A₁'), v: '× ' + fmt(c.ratio, 1) },
                { k: L2('Can it lift the load?', 'هل ترفع الحمل؟'), v: c.lifts ? T2('Yes', 'نعم') : T2('No — push harder or use a bigger piston', 'لا — ادفع أكثر أو استعمل مكبساً أكبر'), state: c.lifts ? 'ok' : 'bad' },
                { k: L2('Big piston rises for every 25 mm pushed', 'يرتفع المكبس الكبير مقابل كل 25 mm تدفعها'), v: fmt(c.rise, 2) + ' mm' },
                { k: L2('Pushes needed to lift 100 mm', 'عدد الدفعات لرفع 100 mm'), v: String(c.strokes100) },
                { k: L2('Force you need for this load', 'القوة التي تلزمك لهذا الحمل'), v: fmt(c.F1req, 0) + ' N' },
                { k: L2('Work in = work out (no free energy!)', 'الشغل المبذول = الشغل الناتج (لا طاقة مجانية!)'), v: fmt(c.Win, 1) + ' J → ' + fmt(c.Wout, 1) + ' J' }
            ];
        },
        bom: () => [],
        challenges: () => [
            CH('Lift a 10 t load pushing with 500 N or less.', 'ارفع حملاً 10 t بقوة 500 N أو أقل.', (p) => { const c = jackCalc(p); return p.load >= 10 && p.F1 <= 500 && c.lifts; }),
            CH('Make the lifting force 50 times the effort (or more).', 'اجعل قوة الرفع 50 ضعف الجهد (أو أكثر).', (p) => jackCalc(p).ratio >= 50),
            CH('Keep the oil pressure below 100 bar while lifting 5 t.', 'أبقِ ضغط الزيت أقل من 100 bar أثناء رفع 5 t.', (p) => { const c = jackCalc(p); return p.load >= 5 && c.lifts && c.p < 1e7; })
        ],
        panels(p) {
            const c = jackCalc(p), pts = [];
            for (let d = 50; d <= 300; d += 10) pts.push([d, (jackCalc(Object.assign({}, p, { D2: d })).F2) / 1000]);
            return [{ type: 'line', h: 190, title: L2('Lifting force vs big piston diameter', 'قوة الرفع مقابل قطر المكبس الكبير'), unit: 'kN', xlabel: L2('Big piston diameter (mm)', 'قطر المكبس الكبير (mm)'), xmin: 50, xmax: 300, ymin: 0, series: [{ label: 'F₂', pts, fill: true }, { label: L2('Weight of the load', 'وزن الحمل'), pts: [[50, c.W / 1000], [300, c.W / 1000]], color: '#dc2626' }], marks: [{ x: p.D2, y: c.F2 / 1000, label: fmt(c.F2 / 1000, 1) }] }];
        }
    });

    /* =====================================================================================
     * 2. + 3. CYLINDER CIRCUITS — hydraulic (oil, pump, relief valve) and pneumatic (air, compressor, regulator)
     * ===================================================================================== */
    const hcCalc = memo((p) => {
        const D = p.D / 1000, d = D * p.rodr, A = (PI * D * D) / 4, Aann = A - (PI * d * d) / 4, F = p.load * 1000, Q = (p.Q / 60000) * 0.92;
        const preq = F / (0.95 * A), prv = p.prv * 1e5, ok = preq <= prv, vext = Q / A, vret = Q / Aann, S = 0.4;
        const Fmax = prv * A * 0.95, pret = (0.1 * F) / (0.95 * Aann);
        const Pin = ((ok ? preq : prv) * (p.Q / 60000)) / 0.85;
        return { D, d, A, Aann, F, Q, preq, prv, ok, vext, vret, S, text: S / vext, tret: S / vret, Fmax, pret, Pin, Pwaste: ok ? 0 : (prv * p.Q) / 60000, Dmin: Math.sqrt((4 * F) / (PI * 0.95 * prv)) * 1000 };
    });
    HY.addParts({
        hc_tank: pp('Oil tank (reservoir)', 'خزان الزيت', 'Stores the oil, lets air and heat escape, and receives the oil that comes back.', 'يخزن الزيت ويسمح بخروج الهواء والحرارة ويستقبل الزيت العائد.', 'Supply and return of the circuit.', 'مصدر الزيت ومرجعه في الدارة.', 'Low level makes the pump suck air (noise, damage).', 'انخفاض المستوى يجعل المضخة تسحب هواءً (ضجيج وتلف).'),
        hc_pump: pp('Pump + motor', 'المضخة والمحرك', 'The electric motor turns the pump, which pushes a fixed amount of oil each minute. A pump makes FLOW, not pressure — the load makes the pressure.', 'المحرك الكهربائي يدير المضخة التي تدفع كمية ثابتة من الزيت كل دقيقة. المضخة تصنع التدفق لا الضغط — الحمل هو الذي يصنع الضغط.', 'Flow Q sets the cylinder speed.', 'التدفق Q يحدد سرعة الأسطوانة.', 'Cavitation if the suction is starved.', 'تكهف إذا جاعت المضخة من جهة السحب.'),
        hc_relief: pp('Relief valve', 'صمام الأمان (التحرير)', 'Opens when the pressure reaches its setting and dumps the oil back to the tank. It protects the pump, pipes and cylinder.', 'يفتح عند وصول الضغط إلى قيمة ضبطه ويصرّف الزيت إلى الخزان. يحمي المضخة والأنابيب والأسطوانة.', 'Limits the maximum pressure — and so the maximum force.', 'يحدّ من الضغط الأعلى — وبالتالي من القوة الأعلى.', 'Set too high: dangerous. Stuck open: no pressure.', 'مضبوط عالياً: خطر. عالق مفتوحاً: لا ضغط.'),
        hc_valve: pp('Directional valve', 'صمام التوجيه', 'Sends the oil to one side of the cylinder or the other, so the rod goes out or comes back.', 'يوجه الزيت إلى أحد جانبي الأسطوانة فيخرج الذراع أو يعود.', 'Controls the direction of motion.', 'يتحكم باتجاه الحركة.', 'Leakage inside the valve makes the cylinder creep.', 'التسرب داخل الصمام يجعل الأسطوانة تزحف.'),
        hc_cyl: pp('Cylinder barrel', 'جسم الأسطوانة', 'Holds the pressure. Force = pressure × piston area.', 'يتحمل الضغط. القوة = الضغط × مساحة المكبس.', 'F = p · A', 'F = p · A', 'Scored bore wears the seals.', 'السطح المخدوش يبلي الأختام.'),
        hc_piston: pp('Piston and rod', 'المكبس والذراع', 'Moves with the oil. On the rod side the area is smaller (rod takes space), so the rod comes back faster but pulls with less force.', 'يتحرك مع الزيت. في جهة الذراع المساحة أصغر (الذراع يأخذ حيزاً) فيعود أسرع لكن بقوة سحب أقل.', 'Transfers force to the load.', 'ينقل القوة إلى الحمل.', 'Long rods can buckle when pushing.', 'الأذرع الطويلة قد تنبعج عند الدفع.'),
        hc_load: pp('Load', 'الحمل', 'The thing being pushed. A bigger load needs more pressure.', 'الشيء الذي يُدفع. حمل أكبر يحتاج ضغطاً أكبر.', 'Sets the pressure the circuit works at.', 'يحدد الضغط الذي تعمل عنده الدارة.', NA.en, NA.ar),
        hc_gauge: pp('Pressure gauge', 'مانومتر الضغط', 'Shows the pressure in the supply line.', 'يبين الضغط في خط التغذية.', 'The first thing a technician reads.', 'أول ما يقرأه الفني.', NA.en, NA.ar),
        pn_comp: pp('Compressor + air tank', 'الضاغط وخزان الهواء', 'Compresses air and stores it in a tank so it is ready when needed.', 'يضغط الهواء ويخزنه في خزان ليكون جاهزاً عند الحاجة.', 'Supplies compressed air.', 'يمد الهواء المضغوط.', 'Condensed water in the tank causes rust.', 'تكاثف الماء في الخزان يسبب الصدأ.'),
        pn_reg: pp('Pressure regulator', 'منظّم الضغط', 'Keeps the pressure at the value you set, whatever the tank pressure is.', 'يثبّت الضغط على القيمة التي تضبطها مهما كان ضغط الخزان.', 'Sets the working pressure (and so the force).', 'يحدد ضغط العمل (وبالتالي القوة).', NA.en, NA.ar),
        pn_flow: pp('Flow control valve', 'صمام ضبط التدفق', 'Throttles the air leaving the cylinder to control how fast the rod moves.', 'يخنق الهواء الخارج من الأسطوانة ليضبط سرعة الذراع.', 'Sets the speed.', 'يحدد السرعة.', NA.en, NA.ar)
    });

    function circuit(p, air) {
        const c = air ? pnCalc(p) : hcCalc(p), g = new THREE.Group();
        const R = 0.42 + (p.D / (air ? 100 : 160)) * 0.32, axisY = 0.95, x0 = -0.4, x1 = 2.8, travel = 2.5, xp0 = x0 + 0.2, rodLen = 3.0, xc = -0.1, xr = 2.55, top = axisY + R + 0.05;
        g.add(box(15, 0.15, 3.2, 0x64748b, 0.8, -0.075, 0));
        // supply tank / compressor tank
        if (!air) { const tk = FL.tank(-4.6, 0, 1.8, 1.4, 1.4, 0.95); tk.traverse((o) => { if (o.isMesh) o.userData.id = 'hc_tank'; }); g.add(tk); }
        else { const t = cylX(0.55, 1.9, 0x2563eb, -4.6, 0.75, 0, 'pn_comp'); g.add(t); }
        const pump = air ? box(0.8, 0.6, 0.8, 0x1d4ed8, -4.6, 1.9, 0, 'pn_comp') : cylY(0.35, 0.75, 0x0284c7, -4.6, 2.2, 0, 'hc_pump');
        g.add(pump); g.add(box(air ? 0.7 : 0.55, 0.45, 0.55, 0x475569, -4.6, air ? 2.45 : 2.75, 0));
        const relief = box(0.5, 0.5, 0.5, air ? 0x16a34a : 0xea580c, -3.4, 3.0, 0, air ? 'pn_reg' : 'hc_relief'); g.add(relief);
        const valve = box(1.5, 1.2, 0.8, 0x7c3aed, -1.2, 2.55, 0, 'hc_valve'); g.add(valve);
        const spool = box(0.4, 0.5, 0.82, 0xfacc15, -1.2, 2.55, 0); g.add(spool);
        if (air) { const fc = box(0.45, 0.45, 0.45, 0xf97316, 1.3, 1.75, 0, 'pn_flow'); g.add(fc); }
        // pipes
        const pipeMat = (pts) => { const m = FL.tubeMeshes(pts, 0.07, 0x94a3b8, 0.45); g.add(m); };
        const P0 = [-4.0, 2.4, 0], supExt = [P0, [-1.2, 2.4, 0], [-1.2, 1.75, 0], [xc, 1.75, 0], [xc, axisY, 0]], supRet = [P0, [-1.2, 2.4, 0], [-1.2, 1.75, 0], [xr, 1.75, 0], [xr, axisY, 0]],
            retExt = [[xr + 0.12, axisY, 0], [xr + 0.12, 3.0, 0], [-4.6, 3.0, 0], [-4.6, 1.45, 0]], retRet = [[xc - 0.12, axisY, 0], [xc - 0.12, 3.0, 0], [-4.6, 3.0, 0], [-4.6, 1.45, 0]], relP = [[-3.6, 2.4, 0], [-3.6, 3.0, 0], [-4.6, 3.0, 0], [-4.6, 1.45, 0]];
        const V = (a) => a.map((q) => new THREE.Vector3(q[0], q[1], q[2]));
        if (air) { retExt.pop(); retRet.pop(); retExt[retExt.length - 1] = [-3.0, 3.0, 0]; retRet[retRet.length - 1] = [-3.0, 3.0, 0]; }
        [supExt, supRet, retExt].forEach((a) => pipeMat(V(a)));
        pipeMat(V([P0, [-3.6, 2.4, 0], [-3.6, 3.0, 0]])); if (!air) pipeMat(V([[-4.6, 3.0, 0], [-4.6, 1.45, 0]]));
        const ch = { se: FL.Chain(V(supExt)), sr: FL.Chain(V(supRet)), re: FL.Chain(V(retExt)), rr: FL.Chain(V(retRet)), rl: FL.Chain(V(relP)) };
        // cylinder
        const barrel = cylX(R, x1 - x0, 0x94a3b8, (x0 + x1) / 2, axisY, 0, 'hc_cyl', trans(0x94a3b8, 0.3, { side: THREE.DoubleSide })); g.add(barrel);
        g.add(cylX(R + 0.04, 0.12, 0x334155, x0, axisY, 0, 'hc_cyl')); g.add(cylX(R + 0.04, 0.12, 0x334155, x1, axisY, 0, 'hc_cyl'));
        const pist = new THREE.Group(); pist.add(cylX(R * 0.97, 0.25, 0x1f2937, 0, 0, 0, 'hc_piston'));
        const rod = cylX(0.1 + R * 0.12, rodLen, 0xcbd5e1, rodLen / 2, 0, 0, 'hc_piston'); pist.add(rod);
        const sz = air ? 0.7 + Math.min(1, p.load / 5000) * 0.6 : 0.7 + Math.min(1, p.load / 200) * 0.9, ld = box(sz, sz, sz, 0xb45309, rodLen + sz / 2, 0, 0, 'hc_load'); pist.add(ld); g.add(pist);
        const oilC = cylX(R * 0.94, 1, 0x38bdf8, 0, axisY, 0), oilR = cylX(R * 0.94, 1, 0x38bdf8, 0, axisY, 0);
        [oilC, oilR].forEach((o) => { o.material = trans(air ? 0xe2e8f0 : 0x38bdf8, 0.55); g.add(o); });
        const gauge = HY.gauge(-2.6, 3.0, 0.2, 'hc_gauge'); g.add(gauge);
        const parts = air ? 70 : 90, PS = FL.Particles(parts + 40, air ? 0.2 : 0.17); g.add(PS.pts);
        const st = { frac: 0, dir: 1, dw: 0, ph: 0, cur: 0 }, tmax = 10, tmin = 0.7;
        const pmaxScale = air ? 10e5 : 250e5;
        const tE = clamp(air ? c.t : c.text, tmin, tmax), tR = clamp(air ? c.t : c.tret, tmin, tmax);
        g.userData.update = (dt, tt) => {
            const stalled = air ? !c.moves : !c.ok;
            if (stalled) st.frac = 0;
            else if (st.dw > 0) { st.dw -= dt; }
            else if (st.dir > 0) { st.frac += dt / tE; if (st.frac >= 1) { st.frac = 1; st.dir = -1; st.dw = 0.5; } }
            else { st.frac -= dt / tR; if (st.frac <= 0) { st.frac = 0; st.dir = 1; st.dw = 0.5; } }
            const xp = xp0 + st.frac * travel; pist.position.set(xp, axisY, 0);
            const lc = Math.max(0.01, xp - 0.12 - (x0 + 0.06)), lr = Math.max(0.01, x1 - 0.06 - (xp + 0.12));
            oilC.scale.y = lc; oilC.position.x = x0 + 0.06 + lc / 2; oilR.scale.y = lr; oilR.position.x = xp + 0.12 + lr / 2;
            const pHi = air ? c.psup : (stalled ? c.prv : Math.min(c.preq, c.prv)), uHi = clamp(pHi / pmaxScale, 0, 1), uLo = air ? 0.04 : 0.05;
            const ext = st.dir > 0 && st.dw <= 0, retr = st.dir < 0 && st.dw <= 0, idle = st.dw > 0 && !stalled;
            const hiC = (stalled || ext) ? uHi : uLo, hiR = retr ? uHi : uLo;
            if (!air) { oilC.material.color.copy(colMat(hiC)); oilR.material.color.copy(colMat(hiR)); }
            gauge.userData.setU(idle ? uHi * 0.15 : uHi);
            relief.material.emissive && relief.material.emissive.setHex(!air && stalled ? 0xdc2626 : 0x000000);
            spool.position.x = -1.2 + (st.dir > 0 ? -0.3 : 0.3);
            // particles
            const vel = (1 + (air ? c.flowVis : p.Q * 0.08)) * (idle || (air && stalled) ? 0 : 1), n1 = parts;
            const o = [0, 0, 0], sup = stalled && !air ? ch.rl : (st.dir > 0 ? ch.se : ch.sr), ret = st.dir > 0 ? ch.re : ch.rr;
            for (let i = 0; i < PS.n; i++) {
                const isSup = i < n1, chn = isSup ? sup : ret, spd = isSup ? vel : vel * (st.dir > 0 ? (air ? 0.9 : c.Aann / c.A) : (air ? 1.1 : c.A / c.Aann)) * 0.9;
                if (!PS._s) PS._s = new Float32Array(PS.n).map((_, k) => ((k * 0.173) % 1) * 12);
                PS._s[i] += spd * dt * 1.8;
                const L = chn.total; const s = (PS._s[i] % L + L) % L; chn.at(s, 0.0, 0, o);
                PS.pos[i * 3] = o[0]; PS.pos[i * 3 + 1] = o[1]; PS.pos[i * 3 + 2] = o[2] + ((i * 7) % 5 - 2) * 0.01;
                const u = isSup ? uHi : uLo, cc = air ? [0.9, 0.95, 1] : FL.pcol(u);
                PS.col[i * 3] = cc[0]; PS.col[i * 3 + 1] = cc[1]; PS.col[i * 3 + 2] = cc[2];
            }
            PS.commit();
        };
        g.userData.fit = { w: 6.4, h: 2.3, dir: [0.1, 0.12, 1] }; g.userData.target = [0.7, 1.6, 0];
        return g;
    }
    HY.circuit = circuit;

    HY.add('hcyl', L2('Hydraulic cylinder circuit', 'دارة أسطوانة هيدروليكية'), {
        controls: () => [
            { id: 'load', type: 'range', label: L2('Load to push', 'الحمل المراد دفعه'), min: 2, max: 200, step: 1, value: 40, unit: 'kN', rebuild: true },
            { id: 'D', type: 'range', label: L2('Cylinder bore (piston diameter)', 'قطر الأسطوانة'), min: 30, max: 160, step: 5, value: 80, unit: 'mm', rebuild: true },
            { id: 'Q', type: 'range', label: L2('Pump flow', 'تدفق المضخة'), min: 5, max: 80, step: 1, value: 20, unit: 'L/min', rebuild: true },
            { id: 'prv', type: 'range', label: L2('Relief valve setting', 'ضبط صمام الأمان'), min: 40, max: 250, step: 5, value: 160, unit: 'bar', rebuild: true },
            { id: 'rodr', type: 'range', label: L2('Rod diameter / bore', 'قطر الذراع / قطر الأسطوانة'), min: 0.3, max: 0.7, step: 0.05, value: 0.5, rebuild: true }
        ],
        build: (p) => circuit(Object.assign({}, p), false),
        readouts(p) {
            const c = hcCalc(p), bar = (v) => fmt(v / 1e5, 0) + ' bar';
            return [
                { k: L2('Pressure the load needs', 'الضغط الذي يحتاجه الحمل'), v: bar(c.preq), state: c.ok ? 'ok' : 'bad' },
                { k: L2('Rod speed — going out', 'سرعة الذراع — عند الخروج'), v: fmt(c.vext * 1000, 0) + ' mm/s' },
                { k: L2('Max force at the relief setting', 'أقصى قوة عند ضبط الصمام'), v: fmt(c.Fmax / 1000, 1) + ' kN' },
                { k: L2('Pump power needed', 'استطاعة المضخة اللازمة'), v: fmt(c.Pin / 1000, 2) + ' kW' },
                { k: L2('Will it move?', 'هل ستتحرك؟'), v: c.ok ? L2('Yes', 'نعم') : L2('No — the relief valve opens', 'لا — يفتح صمام الأمان'), state: c.ok ? 'ok' : 'bad' },
                { k: L2('Rod speed — coming back', 'سرعة الذراع — عند العودة'), v: fmt(c.vret * 1000, 0) + ' mm/s' },
                { k: L2('Time out / back (400 mm stroke)', 'زمن الخروج / العودة (شوط 400 mm)'), v: fmt(c.text, 1) + ' s / ' + fmt(c.tret, 1) + ' s' },
                { k: L2('Smallest bore for this load', 'أصغر قطر لهذا الحمل'), v: fmt(c.Dmin, 0) + ' mm' },
                { k: L2('Power wasted as heat', 'استطاعة ضائعة كحرارة'), v: fmt(c.Pwaste / 1000, 2) + ' kW', state: c.Pwaste > 0 ? 'bad' : '' }
            ];
        },
        bom: () => [],
        challenges: () => [
            CH('Push a 100 kN load with the relief valve set to 200 bar or less.', 'ادفع حملاً 100 kN مع ضبط صمام الأمان على 200 bar أو أقل.', (p) => { const c = hcCalc(p); return p.load >= 100 && p.prv <= 200 && c.ok; }),
            CH('Move a load of at least 50 kN out in less than 4 seconds.', 'حرّك حملاً لا يقل عن 50 kN إلى الخارج بأقل من 4 ثوانٍ.', (p) => { const c = hcCalc(p); return p.load >= 50 && c.ok && c.text < 4; }),
            CH('Make the relief valve open (the load is too big for the setting).', 'اجعل صمام الأمان يفتح (الحمل أكبر من الضبط).', (p) => !hcCalc(p).ok),
            CH('Lift 30 kN using a pump of 3 kW or less.', 'ادفع 30 kN باستعمال مضخة 3 kW أو أقل.', (p) => { const c = hcCalc(p); return p.load >= 30 && c.ok && c.Pin <= 3000; })
        ],
        panels(p) {
            const c = hcCalc(p), fp = [], sp = [];
            for (let D = 30; D <= 160; D += 5) { const q = hcCalc(Object.assign({}, p, { D })); fp.push([D, (q.prv * q.A * 0.95) / 1000]); sp.push([D, q.vext * 1000]); }
            return [
                { type: 'line', h: 170, title: L2('Max force vs bore (at the relief setting)', 'أقصى قوة مقابل القطر (عند ضبط الصمام)'), unit: 'kN', xlabel: L2('Bore (mm)', 'القطر (mm)'), xmin: 30, xmax: 160, ymin: 0, series: [{ label: 'F max', pts: fp, fill: true }, { label: L2('Load', 'الحمل'), pts: [[30, p.load], [160, p.load]], color: '#dc2626' }], marks: [{ x: p.D, y: c.Fmax / 1000, label: fmt(c.Fmax / 1000, 0) }] },
                { type: 'line', h: 170, title: L2('Rod speed vs bore (same pump flow)', 'سرعة الذراع مقابل القطر (نفس التدفق)'), unit: 'mm/s', xlabel: L2('Bore (mm)', 'القطر (mm)'), xmin: 30, xmax: 160, ymin: 0, series: [{ label: 'v', pts: sp, fill: true }], marks: [{ x: p.D, y: c.vext * 1000, label: fmt(c.vext * 1000, 0) }] }
            ];
        }
    });

    /* ----- pneumatic ----- */
    const pnCalc = memo((p) => {
        const D = p.D / 1000, A = (PI * D * D) / 4, ps = p.ps * 1e5, F = ps * A, Feff = 0.9 * F, ratio = p.load / Math.max(1, Feff), moves = Feff > p.load, S = p.stroke / 1000;
        const vmax = 0.8, v = moves ? Math.max(0.02, vmax * (p.open / 100) * Math.sqrt(Math.max(0.02, 1 - ratio))) : 0, t = moves ? S / v : 99, cycle = 2 * t + 0.4, cpm = 60 / cycle;
        const free = A * S * 2 * 1000 * ((p.ps + 1.013) / 1.013), perMin = free * cpm;
        const eSpec = 0.11 * Math.log((p.ps + 1.013) / 1.013) / Math.log(8.013 / 1.013); // kWh per m3 free air
        return { D, A, psup: ps, prvOrSup: ps, F, Feff, ratio, moves, v, t, cycle, cpm, free, perMin, Pcomp: (perMin / 1000) * eSpec * 60, flowVis: 3 * (p.open / 100) };
    });
    HY.add('pneu', L2('Pneumatic cylinder circuit', 'دارة أسطوانة هوائية'), {
        controls: () => [
            { id: 'ps', type: 'range', label: L2('Working pressure', 'ضغط العمل'), min: 2, max: 10, step: 0.5, value: 6, unit: 'bar', rebuild: true },
            { id: 'D', type: 'select', label: L2('Cylinder bore', 'قطر الأسطوانة'), options: [16, 20, 25, 32, 40, 50, 63, 80, 100].map((d) => ({ v: d, label: L2(d + ' mm', d + ' mm') })), value: 50, rebuild: true },
            { id: 'load', type: 'range', label: L2('Load to push', 'الحمل المراد دفعه'), min: 0, max: 5000, step: 50, value: 400, unit: 'N', rebuild: true },
            { id: 'open', type: 'range', label: L2('Speed control (flow valve opening)', 'ضبط السرعة (فتحة صمام التدفق)'), min: 10, max: 100, step: 5, value: 60, unit: '%', rebuild: true },
            { id: 'stroke', type: 'range', label: L2('Stroke', 'الشوط'), min: 20, max: 400, step: 10, value: 100, unit: 'mm', rebuild: true }
        ],
        build: (p) => { const c = pnCalc(p); return circuit(Object.assign({ Q: 20, rodr: 0.3, prv: 0 }, p), true); },
        readouts(p) {
            const c = pnCalc(p);
            return [
                { k: L2('Real force available', 'القوة الفعلية المتاحة'), v: fmt(c.Feff, 0) + ' N', state: c.moves ? 'ok' : 'bad' },
                { k: L2('Load as % of available force', 'الحمل كنسبة من القوة المتاحة'), v: fmt(c.ratio * 100, 0) + ' %', state: c.ratio > 0.9 ? 'bad' : c.ratio > 0.7 ? 'warn' : 'ok' },
                { k: L2('Time for one stroke', 'زمن شوط واحد'), v: c.moves ? fmt(c.t, 2) + ' s' : '—' },
                { k: L2('Air used (free air)', 'الهواء المستهلك (هواء حر)'), v: fmt(c.perMin, 0) + ' L/min' },
                { k: L2('Will it move?', 'هل ستتحرك؟'), v: c.moves ? L2('Yes', 'نعم') : L2('No — load too big', 'لا — الحمل كبير'), state: c.moves ? 'ok' : 'bad' },
                { k: L2('Theoretical force p · A', 'القوة النظرية p · A'), v: fmt(c.F, 0) + ' N' },
                { k: L2('Rod speed', 'سرعة الذراع'), v: c.moves ? fmt(c.v * 1000, 0) + ' mm/s' : '—' },
                { k: L2('Air per full cycle', 'الهواء لكل دورة كاملة'), v: fmt(c.free, 2) + ' L' },
                { k: L2('Compressor power for this', 'استطاعة الضاغط لهذا'), v: fmt(c.Pcomp, 2) + ' kW' }
            ];
        },
        bom: () => [],
        challenges: () => [
            CH('Push at least 1 kN using no more than 6 bar.', 'ادفع 1 kN على الأقل باستعمال 6 bar أو أقل.', (p) => p.load >= 1000 && p.ps <= 6 && pnCalc(p).moves),
            CH('Finish a stroke in 0.2 s or less with the load under 50 % of the available force.', 'أنهِ الشوط في 0.2 s أو أقل بحمل أقل من 50% من القوة المتاحة.', (p) => { const c = pnCalc(p); return c.moves && c.t <= 0.2 && c.ratio < 0.5 && p.stroke >= 100; }),
            CH('Save air: use less than 60 L/min while still pushing 300 N or more.', 'وفّر الهواء: استهلك أقل من 60 L/min مع دفع 300 N أو أكثر.', (p) => { const c = pnCalc(p); return p.load >= 300 && c.moves && c.perMin < 60; })
        ],
        panels(p) {
            const c = pnCalc(p), s = [];
            [3, 6, 10].forEach((ps, i) => { const pts = []; [16, 20, 25, 32, 40, 50, 63, 80, 100].forEach((D) => pts.push([D, pnCalc(Object.assign({}, p, { ps, D })).Feff])); s.push({ label: ps + ' bar', pts, color: ['#38bdf8', '#d97706', '#dc2626'][i] }); });
            return [{ type: 'line', h: 190, title: L2('Real force vs bore', 'القوة الفعلية مقابل القطر'), unit: 'N', xlabel: L2('Bore (mm)', 'القطر (mm)'), xmin: 16, xmax: 100, ymin: 0, series: s.concat([{ label: L2('Your load', 'حملك'), pts: [[16, p.load], [100, p.load]], color: '#111827' }]), marks: [{ x: p.D, y: c.Feff, label: fmt(c.Feff, 0) }] }];
        }
    });
})();
