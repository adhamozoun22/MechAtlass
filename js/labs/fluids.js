/* Fluids & Pumps lab — core + pipe-flow model + pump-and-system model.
 * Needs strength.js (shares small helpers through window.SM). Animated flow particles, Darcy-Weisbach / Colebrook friction,
 * pump curves with affinity laws, system curves, operating point, NPSH, throttling vs speed control. */
(function () {
    'use strict';
    const SM = window.SM, K = window.GearKit;
    if (!SM || !K || !window.THREE || !window.Labs) return;
    const PI = Math.PI, L2 = SM.L2, fmt = K.fmt, lit = SM.lit, CH = SM.CH, memo = SM.memo, st = SM.state;
    const G = 9.81, NA = L2('—', '—');
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const T2 = (a, b) => (window.getLang && window.getLang() === 'ar' ? b : a);

    const FL = (window.FL = { models: {}, L2, fmt, G, clamp, T2 });
    const lab = {
        id: 'fluids', icon: 'fa-water', title: L2('Fluids & Pumps', 'المضخات والموائع'),
        intro: L2('Watch water move through pipes, pumps, venturis and around bodies. Particles show the velocity, colours show the pressure, and the charts give the numbers an engineer needs.',
            'شاهد الماء يتحرك في الأنابيب والمضخات والفنتوري وحول الأجسام. الجسيمات تُظهر السرعة، والألوان تُظهر الضغط، والمخططات تعطي الأرقام التي يحتاجها المهندس.'),
        models: [], parts: {}, supports: { section: false },
        controls(model, cur) { return FL.models[model].controls(cur || {}); },
        build(model, p, api) { return FL.models[model].build(p, api); },
        apply() { },
        readouts(model, p, api, group) { return FL.models[model].readouts(p, group); },
        challenges(model) { return FL.models[model].challenges(); },
        listParts(model, p) { const m = FL.models[model]; return m.bom ? m.bom(p) : []; },
        charts: { draw(canvas, model, p, info) { const m = FL.models[model]; if (m.draw) m.draw(canvas, p, info); else K.drawPanels(canvas, m.panels(p), info); } }
    };
    window.Labs.register(lab);
    FL.lab = lab;
    FL.add = (id, title, def) => { FL.models[id] = def; lab.models.push({ id, title }); };
    FL.addParts = (o) => Object.assign(lab.parts, o);
    FL.pp = (nEn, nAr, dEn, dAr, fEn, fAr, failEn, failAr) => SM.P(L2(nEn, nAr), L2(dEn, dAr), NA, L2(fEn, fAr), NA, NA, NA, NA, failEn ? L2(failEn, failAr) : NA);
    FL.bomOf = (id, mass) => [{ id, get name() { return FL.lab.parts[id].name; }, qty: 1, mass }];

    /* ---------------- fluids ---------------- */
    FL.FLUIDS = {
        water: { n: L2('Water 20 °C', 'ماء 20 °م'), rho: 998, mu: 1.0e-3, pv: 2340 },
        sea: { n: L2('Sea water', 'ماء البحر'), rho: 1025, mu: 1.08e-3, pv: 2300 },
        oil: { n: L2('Light oil (SAE 10)', 'زيت خفيف (SAE 10)'), rho: 870, mu: 0.04, pv: 500 },
        gly: { n: L2('Glycerin', 'غليسرين'), rho: 1260, mu: 1.4, pv: 100 },
        air: { n: L2('Air 20 °C', 'هواء 20 °م'), rho: 1.2, mu: 1.8e-5, pv: 0 }
    };
    FL.fluidOptions = (keys) => keys.map((k) => ({ v: k, label: FL.FLUIDS[k].n }));
    FL.MATS = {
        pvc: { n: L2('PVC / plastic (ε 0.0015 mm)', 'PVC / بلاستيك (ε 0.0015 mm)'), e: 0.0015 },
        steel: { n: L2('Commercial steel (ε 0.045 mm)', 'فولاذ تجاري (ε 0.045 mm)'), e: 0.045 },
        cast: { n: L2('Cast iron (ε 0.26 mm)', 'حديد زهر (ε 0.26 mm)'), e: 0.26 },
        conc: { n: L2('Concrete (ε 1.0 mm)', 'خرسانة (ε 1.0 mm)'), e: 1.0 },
        rust: { n: L2('Old rusty steel (ε 3 mm)', 'فولاذ صدئ قديم (ε 3 mm)'), e: 3 }
    };
    /* Darcy friction factor: laminar 64/Re, Colebrook for turbulent, linear blend in the critical zone */
    FL.fric = (Re, rr) => {
        const turb = (R) => { let f = 0.25 / Math.pow(Math.log10(rr / 3.7 + 5.74 / Math.pow(R, 0.9)), 2); for (let i = 0; i < 8; i++) f = Math.pow(-2 * Math.log10(rr / 3.7 + 2.51 / (R * Math.sqrt(f))), -2); return f; };
        if (Re < 2300) return 64 / Math.max(Re, 1e-6);
        if (Re < 4000) { const a = 64 / 2300, b = turb(4000), u = (Re - 2300) / 1700; return a + (b - a) * u; }
        return turb(Re);
    };
    FL.regime = (Re) => (Re < 2300 ? L2('Laminar', 'صفحي') : Re < 4000 ? L2('Transitional', 'انتقالي') : L2('Turbulent', 'مضطرب'));
    FL.pcol = (t) => { // 0 = low pressure (blue) … 1 = high (red)
        const u = clamp(t, 0, 1), S = [[0.11, 0.31, 0.85], [0.02, 0.71, 0.83], [0.92, 0.7, 0.03], [0.86, 0.15, 0.15]], x = u * 3, i = Math.min(2, Math.floor(x)), f = x - i;
        return [0, 1, 2].map((k) => S[i][k] + (S[i + 1][k] - S[i][k]) * f);
    };
    FL.pstops = [[0, '#1c50d9'], [0.33, '#06b6d4'], [0.66, '#eab308'], [1, '#dc2626']];

    /* ---------------- 3D helpers ---------------- */
    const trans = (color, op, extra) => lit(color, Object.assign({ transparent: true, opacity: op, depthWrite: false, metalness: 0.1, roughness: 0.4 }, extra || {}));
    FL.trans = trans;
    FL.tank = (cx, yBase, w, h, d, level, wall) => {
        const g = new THREE.Group(), t = 0.08, m = trans(wall || 0x94a3b8, 0.22);
        const box = (sx, sy, sz, x, y, z) => { const b = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), m); b.position.set(x, y, z); g.add(b); };
        box(w, t, d, 0, t / 2, 0); box(t, h, d, -w / 2, h / 2, 0); box(t, h, d, w / 2, h / 2, 0); box(w, h, t, 0, h / 2, -d / 2); box(w, h, t, 0, h / 2, d / 2);
        if (level > 0.01) { const wt = new THREE.Mesh(new THREE.BoxGeometry(w - t * 2, level, d - t * 2), trans(0x38bdf8, 0.5)); wt.position.set(0, level / 2 + t, 0); g.add(wt); }
        g.position.set(cx, yBase, 0); return g;
    };
    /* polyline chain for particles + pipes */
    FL.Chain = (pts) => {
        const seg = [], cum = [0];
        for (let i = 0; i < pts.length - 1; i++) {
            const a = pts[i], b = pts[i + 1], d = new THREE.Vector3().subVectors(b, a), len = d.length(), t = d.clone().divideScalar(len || 1);
            let up = Math.abs(t.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
            const n1 = new THREE.Vector3().crossVectors(t, up).normalize(), n2 = new THREE.Vector3().crossVectors(t, n1).normalize();
            seg.push({ a, t, n1, n2, len }); cum.push(cum[i] + len);
        }
        const total = cum[cum.length - 1];
        return {
            total, pts, seg, cum,
            at(s, rad, ph, out) {
                s = ((s % total) + total) % total; let i = 0; while (i < seg.length - 1 && cum[i + 1] < s) i++;
                const q = seg[i], u = s - cum[i], c = Math.cos(ph) * rad, sn = Math.sin(ph) * rad;
                out[0] = q.a.x + q.t.x * u + q.n1.x * c + q.n2.x * sn; out[1] = q.a.y + q.t.y * u + q.n1.y * c + q.n2.y * sn; out[2] = q.a.z + q.t.z * u + q.n1.z * c + q.n2.z * sn;
                return i;
            }
        };
    };
    FL.tubeMeshes = (pts, r, color, op) => {
        const g = new THREE.Group(), m = trans(color, op || 0.3, { side: THREE.DoubleSide });
        for (let i = 0; i < pts.length - 1; i++) {
            const a = pts[i], b = pts[i + 1], d = new THREE.Vector3().subVectors(b, a), len = d.length(); if (len < 1e-6) continue;
            const c = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 18, 1, true), m);
            c.position.copy(a).add(b).multiplyScalar(0.5); c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()); g.add(c);
            if (i < pts.length - 2) { const j = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), m); j.position.copy(b); g.add(j); }
        }
        return g;
    };
    FL.Particles = (n, size) => {
        const geo = new THREE.BufferGeometry(), pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
        const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: size || 0.2, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 0.95, depthWrite: false }));
        pts.frustumCulled = false;
        return { pts, pos, col, n, commit() { geo.attributes.position.needsUpdate = true; geo.attributes.color.needsUpdate = true; } };
    };
    const rand = (() => { let s = 12345; return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296); })();
    FL.rand = rand;

    /* =====================================================================================
     * 1. PIPE FLOW
     * ===================================================================================== */
    const pipeCalc = memo((p) => {
        const F = FL.FLUIDS[p.fluid], D = p.D / 1000, A = (PI * D * D) / 4, rr = FL.MATS[p.rough].e / 1000 / D;
        const Kv = 0.15 * Math.pow(100 / Math.max(2, p.open), 2.4), Kel = 0.9 * p.elb, Kt = 0.5 + Kv + Kel;
        /* energy equation H = v²/2g·(1 + ΣK + f·L/D) solved by bisection (the residual rises monotonically with v), so it also converges for very viscous / tiny-Re cases */
        const resid = (vv) => { const R_ = (F.rho * vv * D) / F.mu, ff = FL.fric(Math.max(R_, 1e-12), rr); return (vv * vv) / (2 * G) * (1 + Kt + (ff * p.L) / D) - p.H; };
        let lo = 0, hi = Math.sqrt((2 * G * p.H) / (1 + Kt));
        for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (resid(mid) < 0) lo = mid; else hi = mid; }
        let v = (lo + hi) / 2, Re = (F.rho * v * D) / F.mu, f = FL.fric(Math.max(Re, 1e-12), rr);
        const hv = (v * v) / (2 * G), hfr = (f * p.L / D) * hv, hmin = Kt * hv, Q = v * A;
        return { F, D, A, rr, Kv, Kel, Kt, v, Re, f, hv, hfr, hmin, Q, Ploss: F.rho * G * Q * (hfr + hmin) };
    });
    const pipeProfile = (p, c) => { // [x, EGL, HGL] along the pipe
        const pts = [[0, p.H, p.H]], hv = c.hv, e0 = p.H - 0.5 * hv, fl = (c.f / c.D) * hv, el = 0.9 * p.elb * hv;
        const N = 24; pts.push([0, e0, e0 - hv]);
        for (let i = 1; i <= N; i++) { const x = (p.L * i) / N; let e = e0 - fl * x; if (x > p.L / 2) e -= el; pts.push([x, e, e - hv]); }
        pts.push([p.L, p.H - 0.5 * hv - fl * p.L - el - c.Kv * hv, 0]);
        return pts;
    };
    FL.addParts({
        fl_tank: FL.pp('Supply tank', 'خزان التغذية', 'The water level H above the pipe gives the driving head. Nothing else pushes the water.', 'مستوى الماء H فوق الأنبوب يعطي الشحنة الدافعة. لا شيء آخر يدفع الماء.', 'Stores the fluid and sets the energy: p = ρ·g·H.', 'يخزّن المائع ويحدد الطاقة: p = ρ·g·H.', 'Level drop (less head), vortex at the outlet drawing air in, sediment blocking the entrance.', 'هبوط المستوى (شحنة أقل)، دوامة عند المخرج تسحب الهواء، ترسبات تسد المدخل.'),
        fl_pipe: FL.pp('Pipe', 'الأنبوب', 'Colour = gauge pressure along the pipe (red high → blue low). It falls steadily because of wall friction.', 'اللون = الضغط النسبي على طول الأنبوب (أحمر عالٍ ← أزرق منخفض). ينخفض باستمرار بسبب احتكاك الجدار.', 'Carries the flow; friction loss h_f = f·(L/D)·v²/2g (Darcy–Weisbach).', 'ينقل الجريان؛ ضياع الاحتكاك h_f = f·(L/D)·v²/2g (دارسي–فايسباخ).', 'Roughening and scaling (f rises), erosion at elbows, water hammer when valves close fast.', 'التخشّن والترسّبات (يزداد f)، تآكل عند الأكواع، المطرقة المائية عند الإغلاق السريع للصمامات.'),
        fl_valve: FL.pp('Valve', 'الصمام', 'The orange gate at the end. Closing it raises its loss coefficient K enormously and throttles the flow.', 'البوابة البرتقالية عند النهاية. إغلاقها يرفع معامل الضياع K كثيراً فيخنق الجريان.', 'Controls the flow by adding a controllable loss.', 'يتحكم بالجريان بإضافة ضياع يمكن ضبطه.', 'Cavitation damage downstream of a nearly closed valve, seat wear, stem leakage.', 'ضرر التكهّف بعد صمام شبه مغلق، تآكل المقعد، تسرّب من الساق.'),
        fl_elbow: FL.pp('Elbows / fittings', 'الأكواع / الوصلات', 'Each ring marks a 90° elbow (K ≈ 0.9). Fittings are "minor" losses but can dominate short pipes.', 'كل حلقة تمثل كوعاً 90° (K ≈ 0.9). الوصلات ضياعات «ثانوية» لكنها قد تهيمن في الأنابيب القصيرة.', 'Change the pipe direction.', 'تغيّر اتجاه الأنبوب.', 'Erosion on the outer wall, pressure drop and noise.', 'تآكل الجدار الخارجي، هبوط ضغط وضجيج.'),
        fl_flow: FL.pp('Flow particles', 'جسيمات الجريان', 'Each dot is a fluid particle. Laminar flow: the centre moves much faster than the wall (parabola). Turbulent flow: nearly flat profile.', 'كل نقطة جسيم مائع. الجريان الصفحي: المركز أسرع بكثير من الجدار (قطع مكافئ). المضطرب: شكل شبه مسطح.', 'Shows the velocity profile; colour = distance from the wall (orange centre, cyan wall).', 'تُظهر شكل توزيع السرعة؛ اللون = البعد عن الجدار (برتقالي مركز، سماوي جدار).')
    });
    FL.add('pipe', L2('Pipe flow & losses', 'الجريان في الأنابيب'), {
        controls: () => [
            { type: 'title', label: L2('Fluid & pipe', 'المائع والأنبوب') },
            { id: 'fluid', type: 'select', label: L2('Fluid', 'المائع'), options: FL.fluidOptions(['water', 'oil', 'gly']), value: 'water', rebuild: true },
            { id: 'H', type: 'range', label: L2('Tank level above the outlet H', 'مستوى الخزان فوق المخرج H'), min: 1, max: 30, step: 0.5, value: 8, unit: 'm', rebuild: true },
            { id: 'L', type: 'range', label: L2('Pipe length L', 'طول الأنبوب L'), min: 1, max: 500, step: 1, value: 60, unit: 'm', rebuild: true },
            { id: 'D', type: 'range', label: L2('Pipe diameter D', 'قطر الأنبوب D'), min: 10, max: 300, step: 5, value: 50, unit: 'mm', rebuild: true },
            { id: 'rough', type: 'select', label: L2('Pipe material (roughness)', 'مادة الأنبوب (الخشونة)'), options: Object.keys(FL.MATS).map((v) => ({ v, label: FL.MATS[v].n })), value: 'steel', rebuild: true },
            { type: 'title', label: L2('Fittings', 'الوصلات') },
            { id: 'open', type: 'range', label: L2('Valve opening', 'فتحة الصمام'), min: 5, max: 100, step: 5, value: 100, unit: '%', rebuild: true },
            { id: 'elb', type: 'range', label: L2('Number of 90° elbows', 'عدد الأكواع 90°'), min: 0, max: 10, step: 1, value: 2, rebuild: true }
        ],
        build(p) {
            const c = pipeCalc(p), g = new THREE.Group(), x0 = -5, x1 = 5, Rv = 0.3 + (p.D / 300) * 0.5, Hv = 1.2 + (p.H / 30) * 3.8;
            const tank = FL.tank(-6.6, -Rv - 0.2, 3, Hv + 0.6, 3, Hv, 0x94a3b8); tank.userData.id = 'fl_tank'; g.add(tank);
            const prof = pipeProfile(p, c), grid = SM.Grid();
            const hAt = (x01) => { const x = x01 * p.L; let k = 1; while (k < prof.length - 2 && prof[k + 1][0] < x) k++; const a = prof[k], b = prof[Math.min(prof.length - 2, k + 1)], u = b[0] > a[0] ? (x - a[0]) / (b[0] - a[0]) : 0; return a[2] + (b[2] - a[2]) * clamp(u, 0, 1); };
            grid.add(60, 28, (u, v) => { const a = v * 2 * PI, cc = FL.pcol(hAt(u) / p.H); return { p: [x0 + u * (x1 - x0), Rv * Math.cos(a), Rv * Math.sin(a)], c: cc }; });
            const pipe = grid.mesh(); pipe.material.transparent = true; pipe.material.opacity = 0.32; pipe.material.depthWrite = false; pipe.userData.id = 'fl_pipe'; g.add(pipe);
            // valve (gate across the end) + outlet jet
            const vg = new THREE.Group(); vg.userData.id = 'fl_valve';
            const gate = new THREE.Mesh(new THREE.BoxGeometry(0.2, Rv * 2.6, Rv * 2.6), lit(0xf97316)); gate.position.set(x1 - 0.5, (Rv * 2.6) / 2 * (1 - p.open / 100) * 1.0 + 0 - Rv * 1.3 * 0 + Rv * 1.3 * (1 - p.open / 100) * 0, 0);
            gate.scale.y = Math.max(0.06, 1 - p.open / 100); gate.position.y = -Rv * 1.3 + Rv * 1.3 * gate.scale.y; vg.add(gate);
            const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, Rv * 2.6, Rv * 2.6), trans(0x64748b, 0.35)); body.position.set(x1 - 0.5, 0, 0); vg.add(body); g.add(vg);
            if (p.elb > 0) { const eg = new THREE.Group(); eg.userData.id = 'fl_elbow'; for (let i = 0; i < p.elb; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(Rv * 1.12, 0.05, 8, 24), lit(0x7c3aed)); r.rotation.y = PI / 2; r.position.x = -1 + (i * 3.2) / Math.max(1, p.elb - 1) * (p.elb > 1 ? 1 : 0) + (p.elb === 1 ? 1 : 0); eg.add(r); } g.add(eg); }
            // particles
            const N = 220, P = FL.Particles(N, 0.3), part = [], lam = c.Re < 2300, tr = c.Re >= 2300 && c.Re < 4000;
            for (let i = 0; i < N; i++) {
                const rf = Math.sqrt(rand()), ph = rand() * 2 * PI, x = x0 + rand() * (x1 - x0);
                const prof_ = lam ? 2 * (1 - rf * rf) : tr ? 0.5 * (2 * (1 - rf * rf)) + 0.5 * 1.22 * Math.pow(Math.max(0.0, 1 - rf), 1 / 7) : 1.22 * Math.pow(Math.max(0.0, 1 - rf), 1 / 7);
                part.push({ x, rf, ph, k: Math.min(1.9, prof_) });
                const cl = [0.98 - 0.9 * rf + 0.02, 0.55 + 0.35 * rf, 0.15 + 0.8 * rf]; P.col[i * 3] = cl[0]; P.col[i * 3 + 1] = cl[1]; P.col[i * 3 + 2] = cl[2];
            }
            const vs = clamp(0.5 + c.v * 0.45, 0.5, 5);
            const place = () => { for (let i = 0; i < N; i++) { const q = part[i]; P.pos[i * 3] = q.x; P.pos[i * 3 + 1] = q.rf * Rv * 0.92 * Math.cos(q.ph); P.pos[i * 3 + 2] = q.rf * Rv * 0.92 * Math.sin(q.ph); } P.commit(); };
            place(); const fg = new THREE.Group(); fg.userData.id = 'fl_flow'; fg.add(P.pts); g.add(fg);
            // outlet jet (parabolic spray)
            const J = FL.Particles(40, 0.25), jp = []; for (let i = 0; i < 40; i++) { jp.push({ t: rand() * 1.4, a: rand() * 2 * PI, r: rand() * Rv * 0.8 }); J.col[i * 3] = 0.5; J.col[i * 3 + 1] = 0.8; J.col[i * 3 + 2] = 1; }
            g.add(J.pts);
            g.userData.update = (dt) => {
                for (let i = 0; i < N; i++) { const q = part[i]; q.x += vs * q.k * dt; if (q.x > x1 - 0.5) q.x = x0 + 0.01; }
                place();
                for (let i = 0; i < 40; i++) { const q = jp[i]; q.t += dt; if (q.t > 1.4) q.t = 0; const sp = vs * 1.1 * (p.open / 100 < 0.2 ? 0.4 : 1); J.pos[i * 3] = x1 - 0.4 + sp * q.t; J.pos[i * 3 + 1] = q.r * Math.cos(q.a) - 1.6 * q.t * q.t; J.pos[i * 3 + 2] = q.r * Math.sin(q.a); }
                J.commit();
            };
            g.userData.fit = { w: 6.6, h: 3.4, dir: [0.3, 0.3, 1] }; g.userData.target = [-0.8, Hv / 2 - 1.2, 0];
            return g;
        },
        readouts(p) {
            const c = pipeCalc(p), lang = window.getLang ? window.getLang() : 'en', rg = FL.regime(c.Re), fric = c.hfr, tot = p.H;
            return [
                { k: L2('Flow rate Q', 'التدفق Q'), v: fmt(c.Q * 1000, 2) + ' L/s  (' + fmt(c.Q * 3600, 1) + ' m³/h)' },
                { k: L2('Mean velocity v', 'السرعة المتوسطة v'), v: fmt(c.v, 2) + ' m/s', state: c.v > 4 ? 'warn' : 'ok' },
                { k: L2('Reynolds number Re = ρ·v·D/μ', 'رقم رينولدز Re = ρ·v·D/μ'), v: fmt(c.Re, 0) + ' · ' + (lang === 'ar' ? rg.ar : rg.en) },
                { k: L2('Friction factor f  ·  relative roughness ε/D', 'معامل الاحتكاك f  ·  الخشونة النسبية ε/D'), v: fmt(c.f, 4) + '  ·  ' + fmt(c.rr, 5) },
                { k: L2('Velocity head v²/2g', 'شحنة السرعة v²/2g'), v: fmt(c.hv, 3) + ' m' },
                { k: L2('Friction loss h_f = f·(L/D)·v²/2g', 'ضياع الاحتكاك h_f = f·(L/D)·v²/2g'), v: fmt(c.hfr, 2) + ' m  (' + fmt((c.hfr / tot) * 100, 0) + ' % of H)' },
                { k: L2('Minor losses (entrance + elbows + valve), ΣK', 'الضياعات الثانوية (مدخل + أكواع + صمام)، ΣK'), v: fmt(c.hmin, 2) + ' m · ΣK = ' + fmt(c.Kt, 1) },
                { k: L2('Valve loss coefficient K_v', 'معامل ضياع الصمام K_v'), v: fmt(c.Kv, 2) },
                { k: L2('Pressure at the pipe inlet (gauge)', 'الضغط عند مدخل الأنبوب (نسبي)'), v: fmt((c.F.rho * G * (p.H - 1.5 * c.hv)) / 1000, 1) + ' kPa' },
                { k: L2('Power dissipated as heat', 'الاستطاعة الضائعة كحرارة'), v: fmt(c.Ploss, 0) + ' W' }
            ];
        },
        bom: () => [],
        challenges: () => [
            CH('Deliver at least 20 L/s through a pipe of 100 m or more using no more than 10 m of tank head.', 'مرّر 20 L/s على الأقل عبر أنبوب طوله 100 m أو أكثر باستعمال شحنة خزان لا تزيد عن 10 m.', (p) => { const c = pipeCalc(p); return c.Q >= 0.02 && p.L >= 100 && p.H <= 10; }),
            CH('Make the flow laminar (Re < 2300) while still moving at least 0.2 L/s (hint: a viscous fluid).', 'اجعل الجريان صفحياً (Re < 2300) مع تدفق 0.2 L/s على الأقل (تلميح: مائع لزج).', (p) => { const c = pipeCalc(p); return c.Re < 2300 && c.Q >= 0.0002; }),
            CH('Throttle the valve until the flow is at most half of the fully-open flow.', 'اخنق الصمام حتى يصبح التدفق نصف تدفق الفتح الكامل أو أقل.', (p) => pipeCalc(p).Q <= 0.5 * pipeCalc(Object.assign({}, p, { open: 100 })).Q),
            CH('Short pipe, many fittings: make the minor losses larger than the friction loss (L ≤ 5 m, 6+ elbows).', 'أنبوب قصير ووصلات كثيرة: اجعل الضياعات الثانوية أكبر من الاحتكاك (L ≤ 5 m و6 أكواع أو أكثر).', (p) => { const c = pipeCalc(p); return p.L <= 5 && p.elb >= 6 && c.hmin > c.hfr; })
        ],
        panels(p) {
            const c = pipeCalc(p), pr = pipeProfile(p, c), egl = pr.map((q) => [q[0], q[1]]), hgl = pr.map((q) => [q[0], q[2]]);
            const moody = (rr, a, b) => { const o = []; for (let i = 0; i <= 40; i++) { const lr = a + ((b - a) * i) / 40, Re = Math.pow(10, lr); o.push([lr, FL.fric(Re, rr)]); } return o; };
            const q = []; for (let d = 10; d <= 300; d += 10) { const cc = pipeCalc(Object.assign({}, p, { D: d })); q.push([d, cc.Q * 1000]); }
            return [
                { type: 'grad', title: L2('Colour = gauge pressure (0 → static head)', 'اللون = الضغط النسبي (0 ← الشحنة الساكنة)'), unit: 'kPa', min: 0, max: (c.F.rho * G * p.H) / 1000, h: 44, stops: FL.pstops },
                { type: 'line', h: 190, title: L2('Energy line (EGL) and hydraulic grade line (HGL)', 'خط الطاقة (EGL) وخط الميل الهيدروليكي (HGL)'), unit: 'm', xlabel: L2('Distance along the pipe x (m)', 'المسافة على الأنبوب x (m)'), xmin: 0, xmax: p.L, ymin: 0, ymax: p.H * 1.05, series: [{ label: 'EGL', pts: egl, fill: true }, { label: 'HGL', pts: hgl }] },
                { type: 'line', h: 190, title: L2('Moody diagram', 'مخطط مودي'), unit: 'f', xlabel: L2('log₁₀ Re', 'log₁₀ Re'), xmin: 3, xmax: 8, ymin: 0, ymax: 0.1, series: [{ label: L2('smooth', 'أملس'), pts: moody(1e-6, 3.6, 8) }, { label: 'ε/D', pts: moody(c.rr, 3.6, 8) }, { label: L2('very rough', 'خشن جداً'), pts: moody(0.03, 3.6, 8) }, { label: L2('laminar', 'صفحي'), pts: moody(0, 3, Math.log10(2300)).map((q) => [q[0], 64 / Math.pow(10, q[0])]) }], marks: [{ x: Math.log10(Math.max(10, c.Re)), y: c.f, label: 'f' }] },
                { type: 'line', h: 160, title: L2('Flow vs pipe diameter (other settings fixed)', 'التدفق مقابل قطر الأنبوب (باقي المعطيات ثابتة)'), unit: 'L/s', xlabel: L2('Diameter D (mm)', 'القطر D (mm)'), xmin: 10, xmax: 300, ymin: 0, series: [{ label: 'Q', pts: q, fill: true }], marks: [{ x: p.D, y: c.Q * 1000, label: fmt(c.Q * 1000, 1) }] }
            ];
        }
    });

    /* =====================================================================================
     * 2. PUMP & SYSTEM
     * ===================================================================================== */
    const PUMPS = {
        small: { n: L2('Small pump (H₀ 32 m, Q_max 70 m³/h)', 'مضخة صغيرة (H₀ 32 m، Q_max 70 m³/h)'), H0: 32, Qm: 70, eta: 0.68, npsh: 2.0, mass: 45 },
        medium: { n: L2('Medium pump (H₀ 45 m, Q_max 150 m³/h)', 'مضخة متوسطة (H₀ 45 m، Q_max 150 m³/h)'), H0: 45, Qm: 150, eta: 0.78, npsh: 3.0, mass: 120 },
        large: { n: L2('Large pump (H₀ 60 m, Q_max 300 m³/h)', 'مضخة كبيرة (H₀ 60 m، Q_max 300 m³/h)'), H0: 60, Qm: 300, eta: 0.84, npsh: 4.5, mass: 260 }
    };
    const N0 = 1450, MOTORS = [0.55, 0.75, 1.1, 1.5, 2.2, 3, 4, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90, 110];
    const pumpHead = (S, Qh, n) => S.H0 * Math.pow(n / N0, 2) - (S.H0 * Qh * Qh) / (S.Qm * S.Qm);
    const pumpEta = (S, Qeq) => Math.max(0.02, S.eta * (1 - 0.95 * Math.pow((Qeq - 0.55 * S.Qm) / (0.55 * S.Qm), 2)));
    const npshr = (S, Qeq, n) => (S.npsh + 2.2 * S.npsh * Math.pow(Qeq / S.Qm, 2)) * Math.pow(n / N0, 2);
    const cfgHead = (S, cfg, Qh, n) => (cfg === 'ser' ? 2 * pumpHead(S, Qh, n) : cfg === 'par' ? pumpHead(S, Qh / 2, n) : pumpHead(S, Qh, n));
    const pumpCalc = memo((p) => {
        const S = PUMPS[p.size], F = FL.FLUIDS[p.fluid], D = p.D / 1000, A = (PI * D * D) / 4, rr = 0.045 / p.D;
        const Kv = 0.15 * Math.pow(100 / Math.max(2, p.open), 2.4), Kt = 6 + Kv;
        const Hsys = (Qh) => { const v = Qh / 3600 / A, Re = Math.max(1e-9, (F.rho * v * D) / F.mu), f = FL.fric(Re, rr); return p.Hs + ((f * p.L) / D + Kt) * (v * v) / (2 * G); };
        const Qmax = (S.Qm * (p.cfg === 'par' ? 2 : 1)) * Math.max(1, p.n / N0) * 1.05;
        let Q = 0;
        if (cfgHead(S, p.cfg, 0, p.n) > Hsys(0)) { let lo = 0, hi = Qmax; for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (cfgHead(S, p.cfg, mid, p.n) > Hsys(mid)) lo = mid; else hi = mid; } Q = (lo + hi) / 2; }
        const H = Hsys(Q), npump = p.cfg === 'par' ? 2 : 1, Qp = p.cfg === 'par' ? Q / 2 : Q, Qeq = (Qp * N0) / p.n, eta = pumpEta(S, Qeq);
        const Qm3 = Q / 3600, Phyd = F.rho * G * Qm3 * H, Pshaft = Q > 0 ? Phyd / eta : 0;
        const vs = Qm3 / (A * 1.5625), hfs = (0.5 + (0.02 * 5) / (1.25 * D) + 1.0) * (vs * vs) / (2 * G);
        const npa = (101325 - F.pv) / (F.rho * G) + p.zs - hfs, npr = npshr(S, Qeq, p.n);
        // same flow, but at 1450 rpm throttled
        const Hth = cfgHead(S, p.cfg, Q, N0), Qeq0 = Qp, eta0 = pumpEta(S, Qeq0), Pth = Q > 0 ? (F.rho * G * Qm3 * Math.max(H, Hth)) / eta0 : 0;
        const Qbep = 0.55 * S.Qm * (p.cfg === 'par' ? 2 : 1) * (p.n / N0), Hshut = cfgHead(S, p.cfg, 0, p.n);
        return { S, F, A, Hsys, Q, H, Qp, Qeq, eta, Phyd, Pshaft, npa, npr, Pth, Qbep, Hshut, Kv, npump, motor: MOTORS.find((m) => m >= 1.15 * Pshaft / 1000 / (p.cfg === 'ser' ? 2 : p.cfg === 'par' ? 2 : 1)) || 110, Qmax, vd: Qm3 / A };
    });
    FL.addParts({
        fl_tankA: FL.pp('Suction tank', 'خزان الشفط', 'Source tank. If its water is below the pump the pump must LIFT the water; if above, the pump is "flooded" and cavitates less.', 'خزان المصدر. إذا كان مستوى مائه أدنى من المضخة فعليها رفع الماء؛ وإن كان أعلى فالمضخة «مغمورة» ويقل التكهّف.', 'Gives the suction pressure p_atm and the level z_s used in NPSH_a.', 'يعطي ضغط الشفط p_atm والمستوى z_s المستعمل في NPSH_a.', 'Vortices pulling in air, low level, clogged strainer.', 'دوامات تسحب الهواء، مستوى منخفض، مصفاة مسدودة.'),
        fl_tankB: FL.pp('Delivery tank', 'خزان التسليم', 'The water must be lifted by the static head H_s before any friction is added.', 'يجب رفع الماء بمقدار الشحنة الساكنة H_s قبل إضافة أي احتكاك.', 'Defines the static head of the system curve.', 'يحدد الشحنة الساكنة لمنحنى النظام.', 'Overflow, level-control failure.', 'فيضان، عطل ضبط المستوى.'),
        fl_pump: FL.pp('Centrifugal pump', 'مضخة طاردة مركزية', 'The casing is transparent: inside, the impeller spins and throws the liquid outwards. Its head curve falls as the flow increases.', 'الغلاف شفاف: في داخله تدور الدفّاعة وتقذف السائل نحو الخارج. ينخفض منحنى شحنتها كلما زاد التدفق.', 'Adds energy: head H = Δp/(ρ·g). Affinity laws: Q ∝ n, H ∝ n², P ∝ n³.', 'تضيف طاقة: الشحنة H = Δp/(ρ·g). قوانين التشابه: Q ∝ n وH ∝ n² وP ∝ n³.', 'Cavitation (NPSH_a < NPSH_r), running far from the best-efficiency point (vibration, bearing wear), dry running.', 'التكهّف (NPSH_a < NPSH_r)، التشغيل بعيداً عن نقطة أفضل مردود (اهتزاز، تآكل المحامل)، التشغيل الجاف.'),
        fl_impeller: FL.pp('Impeller', 'الدفّاعة', 'The rotating wheel with curved vanes; its speed n sets the pump curve.', 'العجلة الدوّارة ذات الريش المنحنية؛ سرعتها n تحدد منحنى المضخة.', 'Transfers shaft energy to the liquid.', 'تنقل طاقة العمود إلى السائل.', 'Erosion and cavitation pitting on the vanes.', 'تآكل وتنخّر تكهّفي على الريش.'),
        fl_motor: FL.pp('Motor', 'المحرك', 'Drives the pump. Its size is chosen from the shaft power with a 15 % reserve.', 'يدير المضخة. يُختار حجمه من استطاعة العمود مع احتياط 15%.', 'Provides the shaft power P = ρ·g·Q·H / η.', 'يعطي استطاعة العمود P = ρ·g·Q·H / η.', 'Overload when the pump runs at too large a flow.', 'حِمل زائد عندما تعمل المضخة عند تدفق كبير جداً.'),
        fl_suction: FL.pp('Suction pipe', 'أنبوب الشفط', 'Blue = low pressure. Keep it short, large and straight so NPSH_a stays high.', 'الأزرق = ضغط منخفض. اجعله قصيراً وكبيراً ومستقيماً ليبقى NPSH_a عالياً.', 'Feeds the pump.', 'يغذّي المضخة.', 'Air leaks, blockage and too much friction (cavitation).', 'تسرّب هواء، انسداد، احتكاك زائد (تكهّف).'),
        fl_discharge: FL.pp('Discharge pipe & valve', 'أنبوب الدفع والصمام', 'Red = high pressure. The valve adds loss: closing it moves the operating point left along the pump curve.', 'الأحمر = ضغط عالٍ. الصمام يضيف ضياعاً: إغلاقه يزيح نقطة التشغيل لليسار على منحنى المضخة.', 'Carries the flow up to the delivery tank.', 'ينقل الجريان إلى خزان التسليم.', 'Water hammer, leaks, erosion.', 'مطرقة مائية، تسرّبات، تآكل.')
    });
    FL.add('pumpsys', L2('Pump & system curve', 'المضخة ومنحنى النظام'), {
        controls: () => [
            { type: 'title', label: L2('Pump', 'المضخة') },
            { id: 'size', type: 'select', label: L2('Pump size', 'حجم المضخة'), options: Object.keys(PUMPS).map((v) => ({ v, label: PUMPS[v].n })), value: 'medium', rebuild: true },
            { id: 'cfg', type: 'select', label: L2('Arrangement', 'الترتيب'), options: [{ v: 'one', label: L2('One pump', 'مضخة واحدة') }, { v: 'par', label: L2('Two in parallel (more flow)', 'اثنتان على التوازي (تدفق أكبر)') }, { v: 'ser', label: L2('Two in series (more head)', 'اثنتان على التسلسل (شحنة أكبر)') }], value: 'one', rebuild: true },
            { id: 'n', type: 'range', label: L2('Speed n (reference 1450 rpm)', 'السرعة n (المرجع 1450 rpm)'), min: 600, max: 1800, step: 50, value: 1450, unit: 'rpm', rebuild: true },
            { id: 'fluid', type: 'select', label: L2('Fluid', 'المائع'), options: FL.fluidOptions(['water', 'sea', 'oil']), value: 'water', rebuild: true },
            { type: 'title', label: L2('System', 'النظام') },
            { id: 'Hs', type: 'range', label: L2('Static lift H_s', 'الرفع الساكن H_s'), min: 0, max: 40, step: 1, value: 15, unit: 'm', rebuild: true },
            { id: 'L', type: 'range', label: L2('Discharge pipe length', 'طول أنبوب الدفع'), min: 10, max: 500, step: 10, value: 150, unit: 'm', rebuild: true },
            { id: 'D', type: 'range', label: L2('Pipe diameter', 'قطر الأنبوب'), min: 50, max: 250, step: 10, value: 100, unit: 'mm', rebuild: true },
            { id: 'open', type: 'range', label: L2('Discharge valve opening', 'فتحة صمام الدفع'), min: 5, max: 100, step: 5, value: 100, unit: '%', rebuild: true },
            { id: 'zs', type: 'range', label: L2('Suction level vs pump (+ flooded, − lift)', 'مستوى الشفط بالنسبة للمضخة (+ مغمورة، − رفع)'), min: -8, max: 5, step: 0.5, value: 1, unit: 'm', rebuild: true }
        ],
        build(p) {
            const c = pumpCalc(p), g = new THREE.Group(), S = c.S, Rt = 0.2 + (p.D / 250) * 0.18;
            const yB = 1.8 + p.Hs * 0.1, yA = clamp(p.zs * 0.3, -2.4, 1.5), ydis = yB - 0.4;
            const tA = FL.tank(-7.2, yA - 2, 3, 2.6, 3.4, 2, 0x94a3b8); tA.userData.id = 'fl_tankA'; g.add(tA);
            const tB = FL.tank(7, yB - 2.4, 3, 3.2, 3.4, 2.4, 0x94a3b8); tB.userData.id = 'fl_tankB'; g.add(tB);
            const pumps = p.cfg === 'par' ? [[0, 0, -1.4], [0, 0, 1.4]] : p.cfg === 'ser' ? [[-1.8, 0, 0], [1.9, 0, 0]] : [[0, 0, 0]];
            const V = (x, y, z) => new THREE.Vector3(x, y, z), ya0 = yA - 1.7, chains = [], rot = [];
            const sucCol = 0x2563eb, disCol = 0xdc2626, midCol = 0xf59e0b;
            const suc = new THREE.Group(); suc.userData.id = 'fl_suction'; const dis = new THREE.Group(); dis.userData.id = 'fl_discharge';
            const pg = new THREE.Group(); pg.userData.id = 'fl_pump';
            const mkPump = (x, y, z, idx) => {
                const gp = new THREE.Group(); gp.position.set(x, y, z);
                const cas = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.9, 40), trans(0x94a3b8, 0.3)); cas.rotation.x = PI / 2; gp.add(cas);
                const imp = new THREE.Group(); imp.userData.id = 'fl_impeller';
                const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.12, 32), lit(0xf59e0b)); disc.rotation.x = PI / 2; imp.add(disc);
                for (let i = 0; i < 7; i++) { const v = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.07, 0.34), lit(0xd97706)); v.position.set(0.34 * Math.cos((i * 2 * PI) / 7), 0.34 * Math.sin((i * 2 * PI) / 7), 0); v.rotation.z = (i * 2 * PI) / 7 + 0.5; imp.add(v); }
                gp.add(imp); rot.push(imp);
                const mo = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 1.5, 28), lit(0x1d4ed8)); mo.rotation.x = PI / 2; mo.position.z = -1.2; mo.userData.id = 'fl_motor'; gp.add(mo);
                const base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.2, 2.2), lit(0x475569)); base.position.set(0, -1.1, -0.5); gp.add(base);
                return gp;
            };
            pumps.forEach((q, i) => pg.add(mkPump(q[0], q[1], q[2], i)));
            g.add(pg);
            if (p.cfg === 'one') {
                const A_ = [V(-6, ya0, 0), V(-3.2, ya0, 0), V(-3.2, 0, 0), V(-0.9, 0, 0)], D_ = [V(0, 0.9, 0), V(0, ydis, 0), V(5.5, ydis, 0)];
                suc.add(FL.tubeMeshes(A_, Rt, sucCol, 0.35)); dis.add(FL.tubeMeshes(D_, Rt, disCol, 0.35));
                chains.push({ pts: A_.concat([V(0, 0, 0)], D_), cut1: A_.length });
            } else if (p.cfg === 'par') {
                pumps.forEach((q) => { const z = q[2], A_ = [V(-6, ya0, z * 0.6), V(-3.2, ya0, z * 0.6), V(-3.2, 0, z), V(-0.9, 0, z)], D_ = [V(0, 0.9, z), V(0, ydis, z * 0.6), V(5.5, ydis, z * 0.6)]; suc.add(FL.tubeMeshes(A_, Rt * 0.8, sucCol, 0.35)); dis.add(FL.tubeMeshes(D_, Rt * 0.8, disCol, 0.35)); chains.push({ pts: A_.concat([V(0, 0, z)], D_), cut1: A_.length }); });
            } else {
                const A_ = [V(-6, ya0, 0), V(-4.2, ya0, 0), V(-4.2, 0, 0), V(-2.7, 0, 0)], M_ = [V(-1.8, 0.9, 0), V(-1.8, 1.6, 0), V(0.95, 1.6, 0), V(0.95, 0, 0)], D_ = [V(1.9, 0.9, 0), V(1.9, ydis, 0), V(5.5, ydis, 0)];
                suc.add(FL.tubeMeshes(A_, Rt, sucCol, 0.35)); suc.add(FL.tubeMeshes(M_, Rt, midCol, 0.35)); dis.add(FL.tubeMeshes(D_, Rt, disCol, 0.35));
                chains.push({ pts: A_.concat([V(-1.8, 0, 0)], M_, [V(1.9, 0, 0)], D_), cut1: A_.length, cut2: A_.length + 1 + M_.length });
            }
            g.add(suc, dis);
            // valve on the discharge line
            const vz = p.cfg === 'par' ? 0 : 0, valve = new THREE.Mesh(new THREE.BoxGeometry(0.22, Rt * 3, Rt * 3), lit(0xf97316)); valve.scale.y = Math.max(0.08, p.open / 100); valve.position.set(3.2, ydis, vz); dis.add(valve);
            // particles
            const parts = []; let Ptot = 0;
            chains.forEach((ch) => { const chain = FL.Chain(ch.pts); parts.push({ chain, ch, n: p.cfg === 'par' ? 90 : 160, arr: [] }); });
            const total = parts.reduce((a, q) => a + q.n, 0), P = FL.Particles(total, 0.28);
            let k = 0; parts.forEach((q) => { for (let i = 0; i < q.n; i++) { q.arr.push({ s: rand() * q.chain.total, rad: Math.sqrt(rand()) * Rt * 0.8, ph: rand() * 2 * PI, idx: k }); k++; } });
            const colFor = (q, seg) => { const ch = q.ch; if (seg < ch.cut1 - 1) return [0.25, 0.55, 1]; if (ch.cut2 && seg < ch.cut2) return [0.98, 0.7, 0.1]; if (!ch.cut2 || seg >= ch.cut2) return seg >= ch.cut1 - 1 + 0 && !ch.cut2 ? [1, 0.35, 0.25] : [1, 0.35, 0.25]; return [1, 0.35, 0.25]; };
            const tmp = [0, 0, 0], vsd = clamp(0.4 + (c.Q / (S.Qm * (p.cfg === 'par' ? 2 : 1))) * 5, 0.2, 5.5);
            const place = (dt) => { parts.forEach((q) => { q.arr.forEach((a) => { a.s += vsd * dt; const seg = q.chain.at(a.s, a.rad, a.ph, tmp); P.pos[a.idx * 3] = tmp[0]; P.pos[a.idx * 3 + 1] = tmp[1]; P.pos[a.idx * 3 + 2] = tmp[2]; const cl = colFor(q, seg); P.col[a.idx * 3] = cl[0]; P.col[a.idx * 3 + 1] = cl[1]; P.col[a.idx * 3 + 2] = cl[2]; }); }); P.commit(); };
            place(0); g.add(P.pts);
            let ang = 0;
            g.userData.update = (dt) => { if (c.Q > 0) place(dt); ang += K.rpmToVis(p.n) * dt; rot.forEach((r) => { r.rotation.z = -ang; }); };
            g.userData.fit = { w: 8.4, h: 4.2, dir: [0.3, 0.35, 1] }; g.userData.target = [0, yB / 2 - 0.8, 0];
            return g;
        },
        readouts(p) {
            const c = pumpCalc(p), lang = window.getLang ? window.getLang() : 'en', npState = c.npa < c.npr ? 'bad' : c.npa < c.npr * 1.3 ? 'warn' : 'ok';
            const bepR = c.Qbep > 0 ? (c.Q / c.Qbep) : 0, bepState = bepR < 0.5 || bepR > 1.3 ? 'bad' : bepR < 0.7 || bepR > 1.15 ? 'warn' : 'ok';
            const save = c.Pth > 0 ? (1 - c.Pshaft / c.Pth) * 100 : 0;
            return [
                { k: L2('Operating point: flow Q', 'نقطة التشغيل: التدفق Q'), v: c.Q > 0 ? fmt(c.Q, 1) + ' m³/h  (' + fmt(c.Q / 3.6, 1) + ' L/s)' : (lang === 'ar' ? 'لا تدفق (الرفع أكبر من شحنة الإغلاق)' : 'no flow (lift > shut-off head)'), state: c.Q > 0 ? 'ok' : 'bad' },
                { k: L2('Operating point: head H  ·  shut-off head', 'نقطة التشغيل: الشحنة H  ·  شحنة الإغلاق'), v: fmt(c.H, 1) + ' m  ·  ' + fmt(c.Hshut, 1) + ' m' },
                { k: L2('Efficiency η (per pump)', 'المردود η (لكل مضخة)'), v: fmt(c.eta * 100, 0) + ' %', state: c.eta < 0.5 ? 'bad' : c.eta < 0.65 ? 'warn' : 'ok' },
                { k: L2('Distance from best-efficiency point Q/Q_BEP', 'البعد عن نقطة أفضل مردود Q/Q_BEP'), v: fmt(bepR * 100, 0) + ' %  (' + (lang === 'ar' ? 'جيد 70–115' : 'good 70–115') + ')', state: bepState },
                { k: L2('Hydraulic power ρ·g·Q·H', 'الاستطاعة الهيدروليكية ρ·g·Q·H'), v: fmt(c.Phyd / 1000, 2) + ' kW' },
                { k: L2('Shaft power (all pumps)  ·  motor to choose', 'استطاعة العمود (كل المضخات)  ·  المحرك المناسب'), v: fmt(c.Pshaft / 1000, 2) + ' kW  ·  ' + c.motor + ' kW' + (p.cfg === 'one' ? '' : ' ×2') },
                { k: L2('NPSH available  ·  required', 'NPSH المتاح  ·  المطلوب'), v: fmt(c.npa, 1) + ' m  ·  ' + fmt(c.npr, 1) + ' m', state: npState },
                { k: L2('Pipe velocity', 'سرعة الأنبوب'), v: fmt(c.vd, 2) + ' m/s', state: c.vd > 3.5 ? 'warn' : 'ok' },
                { k: L2('Same flow with the speed at 1450 rpm and the valve throttled', 'التدفق نفسه بسرعة 1450 rpm وصمام مخنوق'), v: fmt(c.Pth / 1000, 2) + ' kW' },
                { k: L2('Saving from speed control vs throttling', 'التوفير بضبط السرعة مقابل الخنق'), v: fmt(Math.max(0, save), 0) + ' %' }
            ];
        },
        bom: (p) => { const c = pumpCalc(p); return FL.bomOf('fl_pump', c.S.mass * c.npump); },
        challenges: () => [
            CH('Deliver at least 100 m³/h to a static lift of 20 m with the pump running within 70–115 % of its best-efficiency flow.', 'سلّم 100 m³/h على الأقل إلى رفع ساكن 20 m مع تشغيل المضخة ضمن 70–115% من تدفق أفضل مردود.', (p) => { const c = pumpCalc(p); const r = c.Qbep > 0 ? c.Q / c.Qbep : 0; return p.Hs >= 20 && c.Q >= 100 && r >= 0.7 && r <= 1.15; }),
            CH('Make the pump cavitate: bring NPSH_a below NPSH_r (hint: a big suction lift).', 'اجعل المضخة تتكهّف: اجعل NPSH_a أقل من NPSH_r (تلميح: رفع شفط كبير).', (p) => { const c = pumpCalc(p); return c.Q > 0 && c.npa < c.npr; }),
            CH('Lift water 35 m with the SMALL pump by using two in series.', 'ارفع الماء 35 m بالمضخة الصغيرة باستعمال اثنتين على التسلسل.', (p) => p.size === 'small' && p.cfg === 'ser' && p.Hs >= 35 && pumpCalc(p).Q > 5),
            CH('Reduce the flow to under 60 % of the fully-open valve flow using SPEED (valve ≥ 95 % open) and save at least 20 % power compared with throttling.', 'اخفض التدفق إلى أقل من 60% من تدفق الصمام المفتوح بالسرعة (الصمام ≥ 95% مفتوح) ووفّر 20% على الأقل من الاستطاعة مقارنةً بالخنق.', (p) => { if (p.open < 95) return false; const c = pumpCalc(p), c0 = pumpCalc(Object.assign({}, p, { n: N0 })); return c.Q > 5 && c.Q < 0.6 * c0.Q && c.Pth > 0 && 1 - c.Pshaft / c.Pth >= 0.2; })
        ],
        panels(p) {
            const c = pumpCalc(p), S = c.S, kmax = S.Qm * (p.cfg === 'par' ? 2 : 1) * Math.max(1, p.n / N0) * 1.05, pts = (fn, n) => { const o = []; for (let i = 0; i <= 40; i++) { const Q = (kmax * i) / 40; o.push([Q, fn(Q)]); } return o; }, Hmax = Math.max(cfgHead(S, p.cfg, 0, p.n), cfgHead(S, p.cfg, 0, N0), c.Hsys(kmax)) * 1.08;
            const pc = pts((Q) => Math.max(0, cfgHead(S, p.cfg, Q, p.n))).filter((q) => q[1] >= 0), sc = pts((Q) => c.Hsys(Q)), p0 = pts((Q) => cfgHead(S, p.cfg, Q, N0)).filter((q) => q[1] >= 0);
            const np = p.cfg === 'par' ? 2 : 1, effP = pts((Q) => { const qe = ((Q / np) * N0) / p.n; return qe > S.Qm * 1.0 ? 0 : pumpEta(S, qe) * 100; });
            const nsh = pts((Q) => npshr(S, ((Q / np) * N0) / p.n, p.n)), pw = pts((Q) => { if (Q <= 0) return 0; const H = cfgHead(S, p.cfg, Q, p.n), qe = ((Q / np) * N0) / p.n; return Math.max(0, (c.F.rho * G * (Q / 3600) * Math.max(0, H)) / pumpEta(S, qe) / 1000); });
            const m = c.Q > 0 ? [{ x: c.Q, y: c.H, label: 'Q*' }] : [];
            return [
                { type: 'line', h: 210, title: L2('Pump curve vs system curve', 'منحنى المضخة مقابل منحنى النظام'), unit: 'm', xlabel: L2('Flow Q (m³/h)', 'التدفق Q (m³/h)'), xmin: 0, xmax: kmax, ymin: 0, ymax: Hmax, series: [{ label: L2('pump (now)', 'المضخة (الآن)'), pts: pc }, { label: L2('system', 'النظام'), pts: sc }, { label: '1450 rpm', pts: p0, color: '#9ca3af' }], marks: m.concat([{ x: c.Qbep, y: Math.max(0, cfgHead(S, p.cfg, c.Qbep, p.n)), label: 'BEP', color: '#16a34a' }]) },
                { type: 'line', h: 160, title: L2('Efficiency', 'المردود'), unit: '%', xlabel: L2('Flow Q (m³/h)', 'التدفق Q (m³/h)'), xmin: 0, xmax: kmax, ymin: 0, ymax: 100, series: [{ label: 'η', pts: effP, fill: true }], marks: c.Q > 0 ? [{ x: c.Q, y: c.eta * 100, label: fmt(c.eta * 100, 0) + '%' }] : [] },
                { type: 'line', h: 170, title: L2('NPSH required vs available', 'NPSH المطلوب مقابل المتاح'), unit: 'm', xlabel: L2('Flow Q (m³/h)', 'التدفق Q (m³/h)'), xmin: 0, xmax: kmax, ymin: 0, ymax: Math.max(c.npa, ...nsh.map((q) => q[1])) * 1.15, series: [{ label: 'NPSH_r', pts: nsh }, { label: 'NPSH_a', pts: [[0, c.npa], [kmax, c.npa]] }], marks: c.Q > 0 ? [{ x: c.Q, y: c.npr, label: 'r' }] : [] },
                { type: 'line', h: 160, title: L2('Shaft power', 'استطاعة العمود'), unit: 'kW', xlabel: L2('Flow Q (m³/h)', 'التدفق Q (m³/h)'), xmin: 0, xmax: kmax, ymin: 0, series: [{ label: 'P', pts: pw, fill: true }], marks: c.Q > 0 ? [{ x: c.Q, y: c.Pshaft / 1000, label: fmt(c.Pshaft / 1000, 1) }] : [] }
            ];
        }
    });
})();
