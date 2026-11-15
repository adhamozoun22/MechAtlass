/* Gear lab: spur pair, idler gear train, helical pair. */
(function () {
    'use strict';
    const MOD = 0.2;              // scene units per module (scene geometry only)
    const L2 = (en, ar) => ({ en, ar });
    const PI = Math.PI;

    /* Tooth profile: straight flanks at 20° pressure angle, tooth thickness ≈ half the pitch at the pitch circle. */
    function gearPoints(t, thin, hs) {
        const pr = (t * MOD) / 2, ro = pr + MOD * (hs || 1), rr = pr - 1.25 * MOD * (hs || 1), step = (2 * PI) / t;
        const tanA = Math.tan((20 * PI) / 180);
        const sp = (PI * MOD) / 4 - 0.18 * MOD - (thin || 0); // half tooth thickness at pitch circle (small backlash)
        const half = (r) => Math.min((sp + (pr - r) * tanA) / r, step * 0.47);
        const hr = half(rr), ht = half(ro);
        const pts = [];
        const P = (r, a) => pts.push([r * Math.cos(a), r * Math.sin(a)]);
        for (let i = 0; i < t; i++) {
            const c = (i + 0.5) * step;
            P(rr, c - hr); P(ro, c - ht); P(ro, c + ht); P(rr, c + hr);
            const gapStart = c + hr, gapEnd = c + step - hr;
            if (gapEnd - gapStart > 0.05) { P(rr, gapStart + (gapEnd - gapStart) / 3); P(rr, gapStart + (2 * (gapEnd - gapStart)) / 3); }
        }
        return pts;
    }

    function gearShape(t) {
        const pts = gearPoints(t);
        const shape = new THREE.Shape(pts.map((p) => new THREE.Vector2(p[0], p[1])));
        const bore = Math.max(0.3, ((t * MOD) / 2) * 0.22);
        const hole = new THREE.Path(); hole.absarc(0, 0, bore, 0, 2 * PI, true); shape.holes.push(hole);
        return { shape, bore };
    }

    /* Which angle must gear 2 have so its teeth fit the gaps of gear 1 at the contact point? */
    function meshPhase(phi1, th1, t1, phi2, t2) {
        const s1 = (2 * PI) / t1, s2 = (2 * PI) / t2;
        let u1 = ((phi1 - th1) / s1) % 1; if (u1 < 0) u1 += 1;
        const u2 = (((0.5 - u1) % 1) + 1) % 1;
        return phi2 - u2 * s2;
    }

    const matCache = {};
    function mat(color) { return new THREE.MeshStandardMaterial({ color, metalness: 0.45, roughness: 0.42 }); }

    /* A gear as a Group (so the whole thing, shaft included, rotates together). twist = total helical twist in radians over the face width. */
    function makeGear(t, width, color, id, twist) {
        const g = new THREE.Group();
        g.userData.id = id;
        const { shape, bore } = gearShape(t);
        const slices = twist ? 12 : 1;
        const m = mat(color);
        for (let i = 0; i < slices; i++) {
            const geo = new THREE.ExtrudeGeometry(shape, { depth: width / slices, bevelEnabled: false, curveSegments: 4 });
            geo.translate(0, 0, -width / 2 + (i * width) / slices);
            const mesh = new THREE.Mesh(geo, m);
            if (twist) mesh.rotation.z = twist * ((-width / 2 + ((i + 0.5) * width) / slices) / width);
            g.add(mesh);
        }
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(bore * 0.92, bore * 0.92, width + 1.2, 20), new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.6, roughness: 0.35 }));
        shaft.rotation.x = PI / 2; g.add(shaft);
        // a marker line so rotation is easy to see
        const mk = new THREE.Mesh(new THREE.BoxGeometry(bore * 0.9, 0.06, width + 1.25), new THREE.MeshStandardMaterial({ color: 0x111827 }));
        mk.position.x = bore * 0.45; g.add(mk);
        g.userData.pitchR = (t * MOD) / 2;
        return g;
    }

    function pitchRing(r, z) {
        const pts = []; for (let i = 0; i <= 96; i++) pts.push(new THREE.Vector3(r * Math.cos((i / 96) * 2 * PI), r * Math.sin((i / 96) * 2 * PI), z));
        const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xfacc15 }));
        l.userData.pitch = true; l.userData.noView = true; return l;
    }

    function dirArrow(radius, ccw, z) {
        const g = new THREE.Group();
        const arcLen = PI * 1.15;
        const arc = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.05, 8, 32, arcLen), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.38, 14), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
        cone.position.set(radius * Math.cos(arcLen), radius * Math.sin(arcLen), 0);
        cone.rotation.z = arcLen; // tangent direction for ccw
        g.add(arc, cone);
        if (!ccw) g.scale.y = -1;
        g.position.z = z; g.userData.noView = true; g.userData.arrow = true;
        return g;
    }

    function rpmToVis(rpm) { return (rpm / 60) * 2 * PI * 0.03; } // visual speed: real rpm scaled down so teeth stay readable

    function fmt(x, d) {
        if (!isFinite(x)) return '—';
        const a = Math.abs(x);
        if (a !== 0 && (a >= 1e5 || a < 1e-2)) return x.toExponential(2);
        return Number(x.toFixed(d === undefined ? (a >= 100 ? 0 : a >= 10 ? 1 : 2) : d)).toLocaleString('en-US');
    }

    /* ---- build a gear line (2 or 3 gears along x). defs: [{t, color, id, twist, ccw}] ---- */
    function buildLine(defs, width, p, cfg) {
        const group = new THREE.Group();
        const gears = [], solids = [];
        let x = 0;
        defs.forEach((d, i) => {
            const r = (d.t * MOD) / 2;
            if (i > 0) x += gears[i - 1].r + r; else x = 0;
            const g = makeGear(d.t, width, d.color, d.id, d.twist);
            g.position.x = x;
            group.add(g);
            const a = dirArrow(Math.min(r * 0.55, 1.2), d.ccw, width / 2 + 0.75);
            a.position.x = x; group.add(a);   // arrow stays put while the gear spins
            const ring = pitchRing(r, width / 2 + 0.01); ring.visible = !!p.pitch; g.add(ring);
            gears.push({ g, r, x, t: d.t, sign: d.sign, th0: 0 });
            solids.push({ obj: g, poly: gearPoints(d.t), z0: -width / 2, z1: width / 2, twist: d.twist || 0, width });
        });
        // phases (gear i-1 contact is at angle 0 -> toward gear i, which sees it at angle PI)
        gears[0].th0 = 0;
        for (let i = 1; i < gears.length; i++) {
            gears[i].th0 = meshPhase(0, gears[i - 1].th0, gears[i - 1].t, PI, gears[i].t);
        }
        gears.forEach((o) => { o.g.rotation.z = o.th0; });
        const total = x, cx = total / 2;
        const maxR = Math.max(...gears.map((o) => o.r));
        const span = total + maxR * 2;
        group.position.x = -cx;
        group.userData.fit = { w: span / 2 + 0.6, h: maxR + 1.2, dir: [0, 0.28, 1] };
        group.userData.target = [0, 0, 0];
        group.userData.gears = gears;
        group.userData.solids = solids;
        let theta = 0;
        group.userData.update = function (dt) {
            theta += rpmToVis(p.rpm) * dt;
            gears.forEach((o) => { o.g.rotation.z = o.th0 + o.sign * theta * (gears[0].t / o.t); });
        };
        return group;
    }


    /* ---- strength & contact helpers (shared with gears_more.js) ---- */
    const MATS = [
        { v: 'ci', label: L2('Cast iron', 'حديد زهر'), s: 56, E: 100000, nu: 0.26, sH: 350 },
        { v: 'steel', label: L2('Steel C45', 'صلب C45'), s: 140, E: 206000, nu: 0.3, sH: 500 },
        { v: 'alloy', label: L2('Hardened alloy steel', 'صلب سبائكي مُقسّى'), s: 250, E: 206000, nu: 0.3, sH: 1100 },
        { v: 'nylon', label: L2('Nylon', 'نايلون'), s: 35, E: 2800, nu: 0.4, sH: 50 }
    ];
    // Lewis form factor Y (20° full-depth teeth), interpolated
    const Y_TAB = [[12, 0.245], [15, 0.289], [17, 0.311], [20, 0.324], [25, 0.339], [30, 0.349], [40, 0.364], [50, 0.371], [75, 0.383], [100, 0.39], [300, 0.402]];
    function interpY(tab, z) {
        if (z <= tab[0][0]) return tab[0][1] * Math.max(0.6, z / 12);
        for (let i = 1; i < tab.length; i++) {
            if (z <= tab[i][0]) { const a = tab[i - 1], b = tab[i]; return a[1] + ((z - a[0]) / (b[0] - a[0])) * (b[1] - a[1]); }
        }
        return tab[tab.length - 1][1];
    }
    function lewisY(z) { return interpY(Y_TAB, z); }   // old table, kept only so GearKit.lewisY still exists; no calculation uses it any more
    /* Lewis form factor Y (incl. π), 20° full-depth teeth — Shigley's Mechanical Engineering Design, Table 14-2. Used by every Lewis calculation. */
    const Y_STD = [[12, 0.245], [13, 0.261], [14, 0.277], [15, 0.29], [16, 0.296], [17, 0.303], [18, 0.309], [19, 0.314], [20, 0.322], [21, 0.328], [22, 0.331], [24, 0.337], [26, 0.346], [28, 0.353], [30, 0.359], [34, 0.371], [38, 0.384], [43, 0.397], [50, 0.409], [60, 0.422], [75, 0.435], [100, 0.447], [150, 0.46], [300, 0.472], [1000, 0.485]];
    function lewisYStd(z) { return interpY(Y_STD, z); }
    /* o: {T N·m on the pinion, d mm (pitch Ø of pinion), n rpm, mn module mm, z weakest gear teeth (virtual teeth for helical), mat, showFt} */
    function strengthCalc(o) {
        const m = (MATS.find((x) => x.v === o.mat) || MATS[1]);
        const cb = Math.cos(((o.beta || 0) * PI) / 180);
        const d = o.zp ? (o.mn * o.zp) / cb : o.d;      // pinion pitch Ø (transverse); old-style callers pass d directly
        const Ft = (2000 * o.T) / d;
        const v = (PI * d * o.n) / 60000;      // m/s
        const Cv = 6.1 / (6.1 + v);               // Barth velocity factor
        const b = 10 * o.mn;                      // assumed face width 10 m
        const sigma = Ft / (Cv * b * o.mn * lewisYStd(o.z));
        const r = { Ft, v, Cv, b, sigma, allow: m.s, sf: m.s / sigma };
        if (o.zc1) {   // Hertz line-contact stress at the pitch point (educational; same material on both gears, no AGMA/ISO factors)
            const at = Math.atan(Math.tan((20 * PI) / 180) / cb), sa = Math.sin(at);
            const inv = 2 / ((o.mn * o.zc1 / cb) * sa) + (o.zc2 === Infinity ? 0 : ((o.int ? -1 : 1) * 2) / ((o.mn * o.zc2 / cb) * sa));
            const c2 = (2 * (1 - m.nu * m.nu)) / m.E;
            r.sigH = Math.sqrt(((Ft / Cv) / (b * Math.cos(at))) * inv / (PI * c2));
            r.allowH = m.sH; r.sfH = m.sH / r.sigH;
        }
        return r;
    }
    /* smallest standard module for which bending (and contact, when available) safety factors reach 1.5 */
    const STD_MODULES = [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
    function suggestModule(o) {
        if (!o.zp) return null;
        for (const m of STD_MODULES) { const c = strengthCalc(Object.assign({}, o, { mn: m })); if (c.sf >= 1.5 && (c.sfH === undefined || c.sfH >= 1.5)) return m; }
        return Infinity;
    }
    function strengthRows(o) {
        const c = strengthCalc(o), ar = lang() === 'ar';
        const rows = [];
        if (o.showFt) rows.push({ k: L2('Tangential force Fₜ', 'القوة المماسية Fₜ'), v: fmt(c.Ft) + ' N' });
        rows.push({ k: L2('Pitch-line speed', 'السرعة على دائرة الخطوة'), v: fmt(c.v) + ' m/s' });
        rows.push({ k: L2('Bending stress σ (Lewis, b = 10 m)', 'إجهاد الانحناء σ (لويس، b = 10 m)'), v: fmt(c.sigma) + ' MPa', state: c.sf < 1 ? 'bad' : c.sf < 1.5 ? 'warn' : 'ok' });
        rows.push({ k: L2('Safety factor (σ_allow ' + c.allow + ' MPa)', 'معامل الأمان (σ المسموح ' + c.allow + ' MPa)'), v: fmt(c.sf) + (c.sf < 1 ? (ar ? ' — يكسر!' : ' — fails!') : ''), state: c.sf < 1 ? 'bad' : c.sf < 1.5 ? 'warn' : 'ok' });
        if (c.sigH !== undefined) {
            rows.push({ k: L2('Contact stress σH (Hertz, pitch point)', 'إجهاد التلامس σH (هيرتز، نقطة الخطوة)'), v: fmt(c.sigH) + ' MPa', state: c.sfH < 1 ? 'bad' : c.sfH < 1.5 ? 'warn' : 'ok' });
            rows.push({ k: L2('Contact safety factor (σH_allow ' + c.allowH + ' MPa)', 'معامل أمان التلامس (σH المسموح ' + c.allowH + ' MPa)'), v: fmt(c.sfH) + (c.sfH < 1 ? (ar ? ' — تنخر السطح!' : ' — pitting!') : ''), state: c.sfH < 1 ? 'bad' : c.sfH < 1.5 ? 'warn' : 'ok' });
        }
        if (o.zp) {
            const ms = suggestModule(o);
            rows.push({ k: L2('Smallest standard module for SF ≥ 1.5', 'أصغر موديول قياسي لمعامل أمان ≥ 1.5'), v: ms === Infinity ? (ar ? 'أكبر من 10 mm' : '> 10 mm') : fmt(ms) + ' mm', state: ms === Infinity || ms > o.mn ? 'warn' : 'ok' });
        }
        return rows;
    }
    /* transverse contact ratio of an external pair (module 1 scale), optional helix */
    function contactRatio(z1, z2, beta) {
        const b = ((beta || 0) * PI) / 180, cb = Math.cos(b), a0 = (20 * PI) / 180;
        const at = Math.atan(Math.tan(a0) / cb), mt = 1 / cb;
        const r1 = (z1 * mt) / 2, r2 = (z2 * mt) / 2;
        const ra1 = r1 + 1, ra2 = r2 + 1, rb1 = r1 * Math.cos(at), rb2 = r2 * Math.cos(at);
        const ea = (Math.sqrt(Math.max(0, ra1 * ra1 - rb1 * rb1)) + Math.sqrt(Math.max(0, ra2 * ra2 - rb2 * rb2)) - (r1 + r2) * Math.sin(at)) / (PI * mt * Math.cos(at));
        const eb = (10 * Math.sin(b)) / PI;
        return { ea, eb, total: ea + eb };
    }
    function contactRow(z1, z2, beta) {
        const c = contactRatio(z1, z2, beta);
        const tot = c.total;
        return { k: L2(beta ? 'Contact ratio (ε_α + ε_β)' : 'Contact ratio ε', beta ? 'نسبة التلامس (ε_α + ε_β)' : 'نسبة التلامس ε'), v: fmt(tot, 2), state: tot < 1.2 ? 'warn' : 'ok' };
    }

    /* strength/contact input of each model, built in one place (teeth + module, so the module suggestion can vary the module) */
    function gearO(model, p, extra) {
        const o = { T: p.torque, n: p.rpm, mn: p.mod, mat: p.mat };
        if (model === 'spur') Object.assign(o, { zp: p.t1, zc1: p.t1, zc2: p.t2, z: Math.min(p.t1, p.t2) });
        else if (model === 'train') { const a = p.ta, i = p.ti, b = p.tb, first = 1 / a + 1 / i >= 1 / i + 1 / b; Object.assign(o, { zp: a, zc1: first ? a : i, zc2: first ? i : b, z: Math.min(a, i, b) }); }
        else if (model === 'helical') { const cb = Math.cos((p.beta * PI) / 180); Object.assign(o, { beta: p.beta, zp: p.t1, zc1: p.t1, zc2: p.t2, z: Math.min(p.t1, p.t2) / (cb * cb * cb) }); }
        else if (model === 'rack') Object.assign(o, { zp: p.t, zc1: p.t, zc2: Infinity, z: p.t });
        else if (model === 'internal') { const zr = Math.max(p.zr, p.zp + 2); Object.assign(o, { zp: p.zp, zc1: p.zp, zc2: zr, int: true, z: p.zp }); }
        return Object.assign(o, extra || {});
    }

    /* ---- generic point-in-solid used by the automated meshing tests ---- */
    function pip(poly, x, y) {
        let c = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
            if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
        }
        return c;
    }
    function insideSolid(s, wp) {
        if (s.inside) return s.inside(wp);
        const l = s.obj.worldToLocal(wp.clone());
        if (l.z < s.z0 || l.z > s.z1) return false;
        let x = l.x, y = l.y;
        if (s.taper) { const k = 1 + l.z / s.taper; x /= k; y /= k; }
        if (s.twist) { const a = -s.twist * (l.z / s.width), c = Math.cos(a), sn = Math.sin(a); const xx = x * c - y * sn; y = x * sn + y * c; x = xx; }
        if (s.ring) { if (Math.hypot(x, y) > s.ring) return false; return !pip(s.poly, x, y); }
        return pip(s.poly, x, y);
    }



    /* colour-scale bar: {type:'grad', min, max, unit, stops:[[t,'#rrggbb'],…], left:{en,ar}, right:{en,ar}} */
    function drawGrad(c, pn, y, W, k) {
        const x0 = 14, x1 = W - 14, bh = 14, yy = y + 4;
        const g = c.createLinearGradient(x0, 0, x1, 0);
        (pn.stops || [[0, '#2563eb'], [0.5, '#e5e7eb'], [1, '#dc2626']]).forEach((s) => g.addColorStop(s[0], s[1]));
        c.fillStyle = g; c.fillRect(x0, yy, x1 - x0, bh);
        c.strokeStyle = k.mute; c.strokeRect(x0, yy, x1 - x0, bh);
        c.font = '11px Inter, sans-serif'; c.fillStyle = k.ink; c.textBaseline = 'top'; c.direction = 'ltr';
        c.textAlign = 'left'; c.fillText(fmt(pn.min, 0), x0, yy + bh + 3);
        c.textAlign = 'center'; c.fillText(fmt((pn.min + pn.max) / 2, 0), (x0 + x1) / 2, yy + bh + 3);
        c.textAlign = 'right'; c.fillText(fmt(pn.max, 0), x1, yy + bh + 3);
        c.textBaseline = 'middle';
    }

    /* line chart panel: {type:'line', title, unit, h, xlabel:{en,ar}, series:[{label, pts:[[x,y],…], color}], marks:[{x,y,label}], xmin,xmax,ymin,ymax} */
    function drawLine(c, pn, y, W, k) {
        const h = pn.h || 190, L = 46, R = 12, T = 6, B = 40, x0 = L, x1 = W - R, y0 = y + T, y1 = y + h - B;
        const xs = [], ys = [];
        pn.series.forEach((s) => s.pts.forEach((q) => { xs.push(q[0]); ys.push(q[1]); }));
        const xmin = pn.xmin !== undefined ? pn.xmin : Math.min(...xs), xmax = pn.xmax !== undefined ? pn.xmax : Math.max(...xs);
        const ymin = pn.ymin !== undefined ? pn.ymin : Math.min(0, ...ys), ymax = pn.ymax !== undefined ? pn.ymax : (Math.max(...ys) * 1.08 || 1);
        const X = (v) => x0 + ((v - xmin) / (xmax - xmin || 1)) * (x1 - x0), Y = (v) => y1 - ((v - ymin) / (ymax - ymin || 1)) * (y1 - y0);
        c.font = '11px Inter, sans-serif'; c.textBaseline = 'middle'; c.direction = 'ltr';
        for (let i = 0; i <= 4; i++) {
            const v = ymin + ((ymax - ymin) * i) / 4, yy = Y(v);
            c.strokeStyle = k.grid; c.beginPath(); c.moveTo(x0, yy); c.lineTo(x1, yy); c.stroke();
            c.fillStyle = k.mute; c.textAlign = 'right'; c.fillText(fmt(v, Math.abs(ymax) < 1 ? 3 : Math.abs(ymax) < 10 ? 1 : 0), x0 - 4, yy);
        }
        c.textAlign = 'center';
        const xd = xmax - xmin < 3 ? 2 : xmax - xmin < 30 ? 1 : 0;
        for (let i = 0; i <= 4; i++) { const v = xmin + ((xmax - xmin) * i) / 4; c.fillStyle = k.mute; c.fillText(fmt(v, xd), X(v), y1 + 10); }
        const lang = k.ar ? 'ar' : 'en';
        if (pn.xlabel) { c.fillStyle = k.mute; c.fillText(pn.xlabel[lang] || pn.xlabel.en, (x0 + x1) / 2, y1 + 22); }
        pn.series.forEach((s, i) => {
            c.strokeStyle = s.color || k.palette[i % k.palette.length]; c.lineWidth = 2; c.beginPath();
            s.pts.forEach((q, j) => (j ? c.lineTo(X(q[0]), Y(q[1])) : c.moveTo(X(q[0]), Y(q[1])))); c.stroke(); c.lineWidth = 1;
            if (s.fill) { const y0z = Y(Math.max(ymin, Math.min(ymax, 0))); c.lineTo(X(s.pts[s.pts.length - 1][0]), y0z); c.lineTo(X(s.pts[0][0]), y0z); c.closePath(); c.globalAlpha = 0.16; c.fillStyle = s.color || k.palette[i % k.palette.length]; c.fill(); c.globalAlpha = 1; }
        });
        (pn.marks || []).forEach((m) => {
            c.fillStyle = m.color || '#dc2626'; c.beginPath(); c.arc(X(m.x), Y(m.y), 4.5, 0, 2 * PI); c.fill();
            if (m.label) { c.fillStyle = k.ink; c.font = '600 11px Inter, sans-serif'; c.textAlign = X(m.x) > (x0 + x1) / 2 ? 'right' : 'left'; c.fillText(m.label, X(m.x) + (X(m.x) > (x0 + x1) / 2 ? -8 : 8), Y(m.y) - 9); c.font = '11px Inter, sans-serif'; }
        });
        // legend
        let lx = x0;
        c.textAlign = 'left';
        pn.series.forEach((s, i) => {
            const lab = typeof s.label === 'string' ? s.label : (s.label[lang] || s.label.en);
            c.fillStyle = s.color || k.palette[i % k.palette.length]; c.fillRect(lx, y1 + 32, 10, 4);
            c.fillStyle = k.ink; c.fillText(lab, lx + 14, y1 + 34); lx += 22 + c.measureText(lab).width + 8;
        });
    }

    /* ---- stacked horizontal-bar panels drawn on the 2D canvas ---- */
    function drawPanels(canvas, panels, info) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const W = Math.max(280, canvas.clientWidth || 320);
        const rowH = 22, titleH = 26, gap = 10, pad = 8;
        const panelH = (pn) => (pn.type === 'line' ? (pn.h || 190) : pn.type === 'grad' ? (pn.h || 40) : pn.rows.length * rowH);
        const H = pad * 2 + panels.reduce((a, pn) => a + titleH + panelH(pn) + gap, 0);
        canvas.style.height = H + 'px';
        canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
        const c = canvas.getContext('2d');
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        c.clearRect(0, 0, W, H);
        const dark = info && info.dark, ar = info && info.lang === 'ar';
        const ink = dark ? '#e5e7eb' : '#111827', mute = dark ? '#9ca3af' : '#6b7280', grid = dark ? '#374151' : '#e5e7eb';
        const palette = dark ? ['#38bdf8', '#fbbf24', '#a78bfa', '#4ade80', '#f87171'] : ['#0284c7', '#d97706', '#7c3aed', '#16a34a', '#dc2626'];
        c.textBaseline = 'middle';
        let y = pad;
        const labW = Math.min(120, W * 0.34), valW = 78, x0 = ar ? valW + 6 : labW + 6, x1 = ar ? W - labW - 6 : W - valW - 6;
        panels.forEach((pn) => {
            c.fillStyle = ink; c.font = '700 13px Cairo, Inter, sans-serif'; c.textAlign = ar ? 'right' : 'left';
            c.fillText((ar ? pn.title.ar : pn.title.en) + (pn.unit ? '  (' + pn.unit + ')' : ''), ar ? W - 6 : 6, y + titleH / 2);
            y += titleH;
            if (pn.type === 'line') { drawLine(c, pn, y, W, { ink, mute, grid, palette, ar }); y += panelH(pn) + gap; return; }
            if (pn.type === 'grad') { drawGrad(c, pn, y, W, { ink, mute }); y += panelH(pn) + gap; return; }
            const mx = Math.max(1e-9, ...pn.rows.map((r) => Math.abs(r.value)));
            const signed = pn.rows.some((r) => r.value < 0);
            const zero = signed ? (x0 + x1) / 2 : (ar ? x1 : x0), span = signed ? (x1 - x0) / 2 : x1 - x0;
            pn.rows.forEach((r, i) => {
                const cy = y + rowH / 2;
                c.fillStyle = mute; c.font = '12px Cairo, Inter, sans-serif'; c.textAlign = ar ? 'right' : 'left';
                const lab = typeof r.label === 'string' ? r.label : (ar ? r.label.ar : r.label.en);
                c.fillText(lab, ar ? W - 6 : 6, cy);
                c.strokeStyle = grid; c.beginPath(); c.moveTo(zero, y + 2); c.lineTo(zero, y + rowH - 2); c.stroke();
                const len = (Math.abs(r.value) / mx) * span * (signed ? 0.96 : 1);
                const dirn = (r.value < 0 ? -1 : 1) * (ar && !signed ? -1 : 1);
                c.fillStyle = r.color || palette[i % palette.length];
                const bx = dirn > 0 ? zero : zero - len;
                c.fillRect(Math.min(bx, bx + len), y + 4, Math.max(1, len), rowH - 8);
                c.fillStyle = ink; c.font = '600 12px Inter, sans-serif'; c.textAlign = ar ? 'left' : 'right'; c.direction = 'ltr';
                c.fillText(fmt(r.value), ar ? 4 : W - 4, cy); c.direction = 'inherit';
                y += rowH;
            });
            y += gap;
        });
    }
    const panelsPair = (rpm1, rpm2, T1, T2, extra) => [
        { title: L2('Shaft speed', 'سرعة الأعمدة'), unit: 'rpm', rows: [{ label: L2('Input', 'الدخل'), value: rpm1 }, { label: L2('Output', 'الخرج'), value: rpm2 }] },
        { title: L2('Shaft torque', 'عزم الأعمدة'), unit: 'N·m', rows: [{ label: L2('Input', 'الدخل'), value: T1 }, { label: L2('Output', 'الخرج'), value: T2 }] },
        ...(extra || [])
    ];
    function stressPanel(o) {
        const c = strengthCalc(o);
        return { title: L2('Stress vs allowable', 'الإجهاد مقابل المسموح'), unit: 'MPa', rows: [{ label: L2('Actual σ', 'الفعلي σ'), value: c.sigma, color: c.sf < 1 ? '#dc2626' : undefined }, { label: L2('Allowable', 'المسموح'), value: c.allow }].concat(c.sigH !== undefined ? [{ label: L2('Contact σH', 'تلامس σH'), value: c.sigH, color: c.sfH < 1 ? '#dc2626' : undefined }, { label: L2('Contact allowable', 'تلامس مسموح'), value: c.allowH }] : []) };
    }

    /* ---- shared control blocks ---- */
    const commonControls = (p) => [
        { type: 'title', label: L2('Input', 'الدخل') },
        { id: 'rpm', type: 'range', label: L2('Input speed', 'سرعة الدخل'), min: 30, max: 3000, step: 10, value: 600, unit: 'rpm' },
        { id: 'torque', type: 'range', label: L2('Input torque', 'عزم الدخل'), min: 1, max: 200, step: 1, value: 20, unit: 'N·m' },
        { id: 'eta', type: 'range', label: L2('Efficiency per mesh η', 'الكفاءة η لكل تعشيق'), min: 50, max: 100, step: 1, value: 98, unit: '%' },
        { id: 'mod', type: 'range', label: L2('Module', 'الموديول (m)'), min: 1, max: 8, step: 0.5, value: 2, unit: 'mm', decimals: 1 },
        { id: 'mat', type: 'select', label: L2('Gear material', 'مادة الترس'), options: MATS.map((m) => ({ v: m.v, label: m.label })), value: 'steel' },
        { id: 'pitch', type: 'toggle', label: L2('Show pitch circles', 'إظهار دوائر الخطوة'), value: false }
    ];

    const ETA = 0.98; // default efficiency of one spur/helical mesh (the 'eta' slider overrides it)
    const etaOf = (p, d) => { const e = Number(p && p.eta); return isFinite(e) && e > 0 ? Math.min(1, e / 100) : (d === undefined ? ETA : d); };

    function pairReadouts(p, t1, t2, extra) {
        const i = t2 / t1, n2 = p.rpm / i, T2 = p.torque * i * etaOf(p), P = (p.torque * (2 * PI * p.rpm)) / 60;
        const d1 = p.mod * t1, d2 = p.mod * t2;
        const minT = Math.min(t1, t2), zlim = Math.ceil(p.zmin || 17);
        const out = [
            { k: L2('Gear ratio i = T₂/T₁', 'نسبة التروس i = T₂/T₁'), v: fmt(i) + ' : 1' },
            { k: L2('Output speed', 'سرعة الخرج'), v: fmt(n2) + ' rpm' },
            { k: L2('Output torque', 'عزم الخرج'), v: fmt(T2) + ' N·m' },
            { k: L2('Input power', 'القدرة'), v: fmt(P / 1000) + ' kW' },
            { k: L2('Output power (η)', 'القدرة الخارجة (η)'), v: fmt((P * etaOf(p)) / 1000) + ' kW' },
            { k: L2('Center distance', 'المسافة بين المحورين'), v: fmt((p.mod * (t1 + t2)) / 2) + ' mm' },
            { k: L2('Pitch Ø d₁ / d₂', 'قطر الخطوة d₁ / d₂'), v: fmt(d1) + ' / ' + fmt(d2) + ' mm' }
        ];
        if (extra) out.push(...extra);
        out.push({ k: L2(`Undercut risk (z<${zlim})`, `خطر القطع السفلي (z<${zlim})`), v: minT < zlim ? (lang() === 'ar' ? 'نعم' : 'Yes') : (lang() === 'ar' ? 'لا' : 'No'), state: minT < zlim ? 'warn' : 'ok' });
        return out;
    }
    const lang = () => (window.getLang ? window.getLang() : 'en');
    /* ---- input guard: the sliders cannot produce these, but saved/injected values can. Invalid or out-of-range values are replaced and the user is told. ---- */
    const GUARD = { msgs: [] };
    function sanitize(model, p) {
        const out = [];
        const specs = (Labs.byId.gears && Labs.byId.gears.controls(model, p)) || [];
        specs.forEach((c) => {
            if (!c.id || c.type === 'title' || c.type === 'toggle') return;
            const v = p[c.id];
            if (v === undefined) { if (c.value !== undefined) p[c.id] = c.value; return; }
            let nv = v;
            if (c.type === 'range') {
                const raw = (v === null || v === '' || typeof v === 'boolean') ? NaN : Number(v);
                if (!isFinite(raw)) nv = c.value;
                else {
                    nv = Math.min(c.max, Math.max(c.min, raw));
                    if (c.step) { const sn = c.min + Math.round((nv - c.min) / c.step) * c.step; if (Math.abs(sn - nv) > c.step * 1e-6) nv = Math.min(c.max, Math.max(c.min, sn)); }
                }
                if (typeof v === 'number' && Math.abs(nv - v) < 1e-9) return;
            } else if (c.type === 'select') {
                if (c.options.some((o) => o.v === v)) return;
                nv = c.value;
            } else return;
            p[c.id] = nv;
            out.push({ label: c.label, bad: v, to: nv, min: c.min, max: c.max });
        });
        return out;
    }
    const guardText = (f) => {
        const sh = (x) => { const s = (x === null || x === undefined || (typeof x === 'number' && !isFinite(x))) ? '—' : String(x); return s.length > 10 ? s.slice(0, 10) + '…' : s; };
        const rng = f.min !== undefined ? f.min + '–' + f.max : '';
        return L2('Invalid value for "' + f.label.en + '" (' + sh(f.bad) + ') — replaced by ' + sh(f.to) + (rng ? ' (allowed ' + rng + ')' : ''), 'قيمة غير صالحة لـ «' + f.label.ar + '» (' + sh(f.bad) + ') — استُبدلت بـ ' + sh(f.to) + (rng ? ' (المسموح ' + rng + ')' : ''));
    };
    function geomNotes(model, p) {
        const o = [];
        if (model === 'internal' && p.zr < p.zp + 2) o.push(L2('An internal pair needs more ring teeth than pinion teeth: ring teeth raised to z₁ + 2 = ' + (p.zp + 2) + '.', 'الترس الداخلي يحتاج أسناناً في الحلقة أكثر من البنيون: رُفعت أسنان الحلقة إلى z₁ + 2 = ' + (p.zp + 2) + '.'));
        return o;
    }
    function guardRows(model, p) {
        const fixed = sanitize(model, p);
        if (fixed.length) GUARD.msgs = fixed.map(guardText);
        const msgs = GUARD.msgs.concat(geomNotes(model, p));
        if (!msgs.length) return [];
        const ar = lang() === 'ar';
        return [{ k: L2('Input check', 'فحص المدخلات'), v: msgs.map((m) => (ar ? m.ar : m.en)).join(' • '), state: 'bad' }];
    }


    const PARTS = {
        gear_drive: { name: L2('Driving gear (pinion)', 'الترس القائد (البنيون)'), desc: L2('Connected to the motor. The smaller gear in a reduction pair.', 'متصل بالمحرك، وهو عادةً الترس الأصغر في أزواج تخفيض السرعة.'), material: L2('Case-hardened alloy steel (e.g. 20MnCr5)', 'صلب سبائكي مُسقّى سطحياً (مثل 20MnCr5)'), func: L2('Delivers input torque to the mesh.', 'ينقل عزم الدخل إلى التعشيق.') },
        gear_driven: { name: L2('Driven gear', 'الترس المنقاد'), desc: L2('Receives motion from the driving gear. More teeth → slower and stronger.', 'يستقبل الحركة من الترس القائد. أسنان أكثر ← سرعة أقل وعزم أكبر.'), material: L2('Alloy steel or cast iron', 'صلب سبائكي أو حديد زهر'), func: L2('Delivers output torque to the load.', 'يوصل عزم الخرج إلى الحمل.') },
        gear_idler: { name: L2('Idler gear', 'الترس الوسيط'), desc: L2('Sits between two gears. It reverses nothing in the ratio — it only changes direction and bridges the distance.', 'يقع بين ترسين. لا يغيّر نسبة التروس، بل يغيّر الاتجاه ويغطي المسافة بين المحورين.'), material: L2('Steel', 'صلب'), func: L2('Keeps driver and driven gears turning the same way.', 'يجعل القائد والمنقاد يدوران بنفس الاتجاه.') }
    };

    const CH = (en, ar, fn) => ({ text: L2(en, ar), check: fn });

    const EXTRA = {};

    Labs.register({
        id: 'gears', icon: 'fa-gear',
        title: L2('Gears & Transmission', 'التروس ونقل الحركة'),
        intro: L2('Change the number of teeth and the input speed. Watch how speed drops and torque rises, and see simplified straight-flank teeth mesh (a teaching profile, not a true involute).',
                  'غيّر عدد الأسنان وسرعة الدخل، وشاهد كيف تنخفض السرعة ويزداد العزم، مع تعشيق مبسّط لأسنان بجوانب مستقيمة (للتعليم، وليس منحنى إيفولوت حقيقياً).'),
        models: [
            { id: 'spur', title: L2('Spur pair', 'زوج تروس عدلة') },
            { id: 'train', title: L2('Gear train (idler)', 'قطار تروس (ترس وسيط)') },
            { id: 'helical', title: L2('Helical pair', 'زوج تروس حلزونية') }
        ],
        parts: PARTS,

        controls(model, cur) {
            if (EXTRA[model]) return EXTRA[model].controls(cur || {});
            if (model === 'spur') return [
                { type: 'title', label: L2('Gears', 'التروس') },
                { id: 't1', type: 'range', label: L2('Driving gear teeth T₁', 'أسنان الترس القائد T₁'), min: 8, max: 60, step: 1, value: 12, rebuild: true },
                { id: 't2', type: 'range', label: L2('Driven gear teeth T₂', 'أسنان الترس المنقاد T₂'), min: 8, max: 60, step: 1, value: 24, rebuild: true },
                ...commonControls()
            ];
            if (model === 'train') return [
                { type: 'title', label: L2('Gears', 'التروس') },
                { id: 'ta', type: 'range', label: L2('Driver teeth', 'أسنان القائد'), min: 8, max: 40, step: 1, value: 16, rebuild: true },
                { id: 'ti', type: 'range', label: L2('Idler teeth', 'أسنان الوسيط'), min: 8, max: 50, step: 1, value: 24, rebuild: true },
                { id: 'tb', type: 'range', label: L2('Driven teeth', 'أسنان المنقاد'), min: 8, max: 60, step: 1, value: 40, rebuild: true },
                ...commonControls()
            ];
            return [
                { type: 'title', label: L2('Gears', 'التروس') },
                { id: 't1', type: 'range', label: L2('Pinion teeth T₁', 'أسنان البنيون T₁'), min: 12, max: 40, step: 1, value: 16, rebuild: true },
                { id: 't2', type: 'range', label: L2('Gear teeth T₂', 'أسنان الترس T₂'), min: 12, max: 60, step: 1, value: 32, rebuild: true },
                { id: 'beta', type: 'range', label: L2('Helix angle β', 'زاوية الحلزون β'), min: 0, max: 35, step: 1, value: 20, unit: '°', rebuild: true },
                ...commonControls()
            ];
        },

        build(model, p, api) {
            GUARD.msgs = sanitize(model, p).map(guardText);
            if (EXTRA[model]) return EXTRA[model].build(p, api);
            if (model === 'spur') {
                return buildLine([
                    { t: p.t1, color: 0x0ea5e9, id: 'gear_drive', sign: +1, ccw: true },
                    { t: p.t2, color: 0xf59e0b, id: 'gear_driven', sign: -1, ccw: false }
                ], 1.0, p);
            }
            if (model === 'train') {
                return buildLine([
                    { t: p.ta, color: 0x0ea5e9, id: 'gear_drive', sign: +1, ccw: true },
                    { t: p.ti, color: 0x94a3b8, id: 'gear_idler', sign: -1, ccw: false },
                    { t: p.tb, color: 0xf59e0b, id: 'gear_driven', sign: +1, ccw: true }
                ], 1.0, p);
            }
            const width = 1.5, tb = Math.tan((p.beta * PI) / 180);
            const k1 = tb / ((p.t1 * MOD) / 2), k2 = tb / ((p.t2 * MOD) / 2);
            return buildLine([
                { t: p.t1, color: 0x0ea5e9, id: 'gear_drive', sign: +1, ccw: true, twist: k1 * width },
                { t: p.t2, color: 0xf59e0b, id: 'gear_driven', sign: -1, ccw: false, twist: -k2 * width }
            ], width, p);
        },

        charts: {
            draw(canvas, model, p, info) {
                sanitize(model, p);
                let panels;
                if (EXTRA[model]) panels = EXTRA[model].panels(p);
                else if (model === 'spur') {
                    const i = p.t2 / p.t1, T2 = p.torque * i * etaOf(p);
                    panels = panelsPair(p.rpm, -p.rpm / i, p.torque, T2, [stressPanel(gearO('spur', p))]);
                } else if (model === 'train') {
                    const i = p.tb / p.ta, T2 = p.torque * i * etaOf(p) * etaOf(p);
                    panels = panelsPair(p.rpm, p.rpm / i, p.torque, T2, [stressPanel(gearO('train', p))]);
                } else {
                    const i = p.t2 / p.t1, cb = Math.cos((p.beta * PI) / 180), T2 = p.torque * i * etaOf(p);
                    panels = panelsPair(p.rpm, -p.rpm / i, p.torque, T2, [stressPanel(gearO('helical', p))]);
                }
                drawPanels(canvas, panels, info);
            }
        },

        apply(group, p, id) {
            if (id === 'pitch') group.traverse((o) => { if (o.userData.pitch) o.visible = !!p.pitch; });
        },

        readouts(model, p, api, group) { return guardRows(model, p).concat(this.readoutsCore(model, p, api, group)); },

        readoutsCore(model, p, api, group) {
            if (EXTRA[model]) return EXTRA[model].readouts(p, group);
            if (model === 'spur') return [...pairReadouts(p, p.t1, p.t2, [contactRow(p.t1, p.t2)]), ...strengthRows(gearO('spur', p, { showFt: true }))];
            if (model === 'train') {
                const i = p.tb / p.ta, n2 = p.rpm / i, T2 = p.torque * i * Math.pow(etaOf(p), 2), P = (p.torque * 2 * PI * p.rpm) / 60;
                const out = [
                    { k: L2('Overall ratio (idler cancels)', 'النسبة الكلية (الوسيط لا يؤثر)'), v: fmt(i) + ' : 1' },
                    { k: L2('Output speed', 'سرعة الخرج'), v: fmt(n2) + ' rpm' },
                    { k: L2('Output torque (2 meshes)', 'عزم الخرج (تعشيقان)'), v: fmt(T2) + ' N·m' },
                    { k: L2('Input power', 'القدرة'), v: fmt(P / 1000) + ' kW' },
                    { k: L2('Output power (η²)', 'القدرة الخارجة (η²)'), v: fmt((P * Math.pow(etaOf(p), 2)) / 1000) + ' kW' },
                    { k: L2('Output direction', 'اتجاه الخرج'), v: lang() === 'ar' ? 'نفس الدخل' : 'Same as input' },
                    { k: L2('Center distance A–B', 'المسافة A–B'), v: fmt((p.mod * (p.ta + 2 * p.ti + p.tb)) / 2) + ' mm' },
                    ...strengthRows(gearO('train', p, { showFt: true }))
                ];
                return out;
            }
            const b = (p.beta * PI) / 180, cb = Math.cos(b);
            const d1 = (p.mod * p.t1) / cb;
            const Ft = (2 * p.torque * 1000) / d1; // N  (torque in N·mm / d in mm)
            const Fa = Ft * Math.tan(b);
            const base = pairReadouts({ ...p, mod: p.mod / cb, zmin: 17 * cb * cb * cb }, p.t1, p.t2, [
                { k: L2('Tangential force Fₜ', 'القوة المماسية Fₜ'), v: fmt(Ft) + ' N' },
                { k: L2('Axial thrust Fₐ = Fₜ·tanβ', 'الدفع المحوري Fₐ = Fₜ·tanβ'), v: fmt(Fa) + ' N', state: p.beta > 25 ? 'warn' : '' },
                contactRow(p.t1, p.t2, p.beta)
            ]);
            base.push(...strengthRows(gearO('helical', p)));
            return base;
        },

        challenges(model) {
            if (EXTRA[model]) return EXTRA[model].challenges();
            if (model === 'spur') return [
                CH('Reduce the speed to one third (ratio 3 : 1).', 'اخفض السرعة إلى الثلث (نسبة 3 : 1).', (p) => Math.abs(p.t2 / p.t1 - 3) < 0.001),
                CH('Get ≥ 100 N·m output from ≤ 20 N·m input.', 'احصل على عزم خرج ≥ 100 N·m من دخل ≤ 20 N·m.', (p) => p.torque <= 20 && (p.torque * (p.t2 / p.t1) * etaOf(p)) >= 100),
                CH('Make a speed multiplier (output faster than input).', 'اصنع مضاعف سرعة (الخرج أسرع من الدخل).', (p) => p.t2 < p.t1)
            ];
            if (model === 'train') return [
                CH('Make the driven gear 2× slower, same direction.', 'اجعل المنقاد أبطأ مرتين وبنفس اتجاه الدخل.', (p) => Math.abs(p.tb / p.ta - 2) < 0.001),
                CH('Set the ratio to 2 : 1, then change the idler — the ratio does not change.', 'اجعل النسبة 2 : 1 ثم غيّر الوسيط — النسبة لا تتغير.', (p) => p.ti !== 24 && Math.abs(p.tb / p.ta - 2) < 0.001)
            ];
            return [
                CH('Keep axial thrust below 15 % of the tangential force.', 'اجعل الدفع المحوري أقل من 15% من القوة المماسية.', (p) => Math.tan((p.beta * PI) / 180) < 0.15 && p.beta > 0),
                CH('Reach a 3 : 1 reduction with a helix angle ≥ 15°.', 'حقق تخفيضاً 3 : 1 مع زاوية حلزون ≥ 15°.', (p) => Math.abs(p.t2 / p.t1 - 3) < 0.001 && p.beta >= 15)
            ];
        }
    });

    // shared kit for gears_more.js and the automated tests
    window.GearKit = {
        MOD, PI, L2, gearPoints, gearShape, meshPhase, makeGear, mat, pitchRing, dirArrow, rpmToVis, fmt,
        MATS, lewisY, lewisYStd, strengthCalc, strengthRows, contactRatio, contactRow, pip, insideSolid, drawPanels, panelsPair, stressPanel,
        ETA, etaOf, gearO, suggestModule, extra: EXTRA, lab: () => Labs.byId.gears
    };
    window.__gearTest = { gearPoints, meshPhase, MOD, insideSolid, GearKit: window.GearKit };
})();
