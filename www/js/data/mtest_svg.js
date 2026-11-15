/* Materials Testing section: diagrams (inline SVG).
   Plots are computed from real numbers (the worked examples and the standard formulas) and drawn with axes, ticks and units.
   Specimens and indenters are drawn to scale where the dimensions are known. Only symbols and numbers appear inside the pictures,
   so they read the same in Arabic and English; the explanation is in the caption. */
(function () {
    'use strict';
    const BL = '#2563eb', RD = '#ef4444', GN = '#10b981', AM = '#f59e0b';
    const f1 = function (v) { return (Math.round(v * 10) / 10).toString(); };
    const f2 = function (v) { return (Math.round(v * 100) / 100).toString(); };
    const ah = function (x1, y1, x2, y2, c, w) {
        c = c || 'currentColor'; w = w || 1.6;
        const a = Math.atan2(y2 - y1, x2 - x1), l = 8, s = 3.6, hx = x2 - l * Math.cos(a), hy = y2 - l * Math.sin(a);
        const p = [[x2, y2], [hx + s * Math.sin(a), hy - s * Math.cos(a)], [hx - s * Math.sin(a), hy + s * Math.cos(a)]].map(function (q) { return f1(q[0]) + ',' + f1(q[1]); }).join(' ');
        return '<line x1="' + f1(x1) + '" y1="' + f1(y1) + '" x2="' + f1(hx) + '" y2="' + f1(hy) + '" stroke="' + c + '" stroke-width="' + w + '"/><polygon points="' + p + '" fill="' + c + '"/>';
    };
    const tx = function (x, y, s, o) { return '<text x="' + f1(x) + '" y="' + f1(y) + '" ' + (o || '') + '>' + s + '</text>'; };
    const ln = function (x1, y1, x2, y2, o) { return '<line x1="' + f1(x1) + '" y1="' + f1(y1) + '" x2="' + f1(x2) + '" y2="' + f1(y2) + '" ' + (o || 'stroke="currentColor" stroke-width="1.2"') + '/>'; };
    const DASH = function (c) { return 'stroke="' + (c || 'currentColor') + '" stroke-width="1" stroke-dasharray="3 3"'; };
    const dim = function (x1, x2, y, label) { return ln(x1, y, x2, y, 'stroke="currentColor" stroke-width="1"') + ln(x1, y - 4, x1, y + 4) + ln(x2, y - 4, x2, y + 4) + tx((x1 + x2) / 2, y + 13, label, 'text-anchor="middle" font-size="10"'); };
    const wrap = function (h, inner) {
        return '<svg viewBox="0 0 360 ' + h + '" role="img" aria-hidden="true" style="width:100%;max-width:520px;height:auto;display:block;margin:0 auto" font-family="sans-serif" font-size="11" fill="currentColor">' + inner + '</svg>';
    };
    const MET = 'fill="#94a3b8" stroke="currentColor" stroke-width="1.2"';
    const GRIP = 'fill="#cbd5e1" stroke="currentColor" stroke-width="1.1"';
    const pts = function (arr, X, Y) { return arr.map(function (p) { return f1(X(p[0])) + ',' + f1(Y(p[1])); }).join(' '); };
    const dot = function (x, y, c, r) { return '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + (r || 3.4) + '" fill="' + (c || BL) + '"/>'; };
    const rng = function (a, b, n) { const o = []; for (let i = 0; i <= n; i++) o.push(a + (b - a) * i / n); return o; };

    /* generic data plot: axes with ticks, light grid, axis titles, polylines, optional extra layer */
    const plot = function (o) {
        const w = 360, h = o.h || 220, l = o.l || 46, r = o.r || 16, t = o.t || 20, b = o.b || 38;
        const X = function (v) { return l + (v - o.x0) / (o.x1 - o.x0) * (w - l - r); };
        const Y = function (v) { return h - b - (v - o.y0) / (o.y1 - o.y0) * (h - b - t); };
        let s = '';
        (o.yt || []).forEach(function (k) { s += ln(l, Y(k[0]), w - r, Y(k[0]), 'stroke="currentColor" stroke-opacity=".14" stroke-width="1"') + ln(l - 3, Y(k[0]), l, Y(k[0])) + tx(l - 6, Y(k[0]) + 3.5, k[1], 'text-anchor="end" font-size="9.5"'); });
        (o.xt || []).forEach(function (k) { s += ln(X(k[0]), t, X(k[0]), h - b, 'stroke="currentColor" stroke-opacity=".14" stroke-width="1"') + ln(X(k[0]), h - b, X(k[0]), h - b + 3) + tx(X(k[0]), h - b + 14, k[1], 'text-anchor="middle" font-size="9.5"'); });
        s += ln(l, t, l, h - b, 'stroke="currentColor" stroke-width="1.4"') + ln(l, h - b, w - r, h - b, 'stroke="currentColor" stroke-width="1.4"');
        s += tx(w - r, h - 5, o.xl || '', 'text-anchor="end" font-size="10.5" font-weight="bold"') + tx(l, t - 7, o.yl || '', 'font-size="10.5" font-weight="bold"');
        (o.series || []).forEach(function (se) {
            s += '<polyline points="' + pts(se.pts, X, Y) + '" fill="none" stroke="' + (se.color || BL) + '" stroke-width="' + (se.w || 2) + '"' + (se.dash ? ' stroke-dasharray="' + se.dash + '"' : '') + ' stroke-linejoin="round"/>';
        });
        if (o.extra) s += o.extra(X, Y);
        return wrap(h, s);
    };
    const S = {};

    /* =============== 1 TENSILE =============== */
    S.tensileSpecimen = (function () {
        /* ASTM E8 round specimen: d0 = 12.5 mm, G = 50 mm, reduced section 57 mm, R = 10 mm, grips 20 mm; scale 2.26 px/mm */
        const k = 2.26, ox = 14, cy = 62, gH = 10 * k, dH = 6.25 * k, gl = 30 * k, fl = 7.8 * k, par = 57 * k;
        const g1 = ox + gl, p1 = g1 + fl, p2 = p1 + par, g2 = p2 + fl, tot = g2 + gl;
        const top = 'M' + ox + ' ' + f1(cy - gH) + 'H' + f1(g1) + 'Q' + f1(g1) + ' ' + f1(cy - dH) + ' ' + f1(p1) + ' ' + f1(cy - dH) + 'H' + f1(p2) + 'Q' + f1(g2) + ' ' + f1(cy - dH) + ' ' + f1(g2) + ' ' + f1(cy - gH) + 'H' + f1(tot) +
            'V' + f1(cy + gH) + 'H' + f1(g2) + 'Q' + f1(g2) + ' ' + f1(cy + dH) + ' ' + f1(p2) + ' ' + f1(cy + dH) + 'H' + f1(p1) + 'Q' + f1(g1) + ' ' + f1(cy + dH) + ' ' + f1(g1) + ' ' + f1(cy + gH) + 'H' + ox + 'Z';
        const mid = (p1 + p2) / 2, m1 = mid - 25 * k, m2 = mid + 25 * k;
        /* after fracture: elongated parallel part 69.5 mm, neck d_f = 8 mm */
        const cy2 = 175, par2 = 69.5 * k, q1 = ox + gl + fl, q2 = q1 + par2, mid2 = (q1 + q2) / 2, nk = 4 * k;
        const L = 'M' + ox + ' ' + f1(cy2 - gH) + 'H' + f1(ox + gl) + 'Q' + f1(ox + gl) + ' ' + f1(cy2 - dH) + ' ' + f1(q1) + ' ' + f1(cy2 - dH) + 'Q' + f1(mid2 - 30) + ' ' + f1(cy2 - dH) + ' ' + f1(mid2 - 1) + ' ' + f1(cy2 - nk) + 'V' + f1(cy2 + nk) + 'Q' + f1(mid2 - 30) + ' ' + f1(cy2 + dH) + ' ' + f1(q1) + ' ' + f1(cy2 + dH) + 'Q' + f1(ox + gl) + ' ' + f1(cy2 + dH) + ' ' + f1(ox + gl) + ' ' + f1(cy2 + gH) + 'H' + ox + 'Z';
        const gx = ox + gl + fl + par2 + fl + gl;
        const R = 'M' + f1(gx) + ' ' + f1(cy2 - gH) + 'H' + f1(gx - gl) + 'Q' + f1(gx - gl) + ' ' + f1(cy2 - dH) + ' ' + f1(q2) + ' ' + f1(cy2 - dH) + 'Q' + f1(mid2 + 30) + ' ' + f1(cy2 - dH) + ' ' + f1(mid2 + 1) + ' ' + f1(cy2 - nk) + 'V' + f1(cy2 + nk) + 'Q' + f1(mid2 + 30) + ' ' + f1(cy2 + dH) + ' ' + f1(q2) + ' ' + f1(cy2 + dH) + 'Q' + f1(gx - gl) + ' ' + f1(cy2 + dH) + ' ' + f1(gx - gl) + ' ' + f1(cy2 + gH) + 'H' + f1(gx) + 'Z';
        const m3 = mid2 - 31.25 * k, m4 = mid2 + 31.25 * k;
        return wrap(236,
            '<path d="' + top + '" ' + MET + '/>' +
            ln(m1, cy - dH - 3, m1, cy + dH + 3, 'stroke="' + RD + '" stroke-width="1.6"') + ln(m2, cy - dH - 3, m2, cy + dH + 3, 'stroke="' + RD + '" stroke-width="1.6"') +
            dim(m1, m2, cy + gH + 8, 'L₀ = 50 mm') +
            ln(ox + gl + 2, cy - gH - 6, ox + gl + 2, cy - gH - 14) + tx(p1 + 2, cy - gH - 8, 'd₀ = 12.5 mm', 'font-size="10"') + ah(p1 + 80, cy - gH - 12, p1 + 80, cy - dH - 2, 'currentColor', 1) +
            tx(8, 20, 'before', 'font-size="10" font-weight="bold"') +
            '<path d="' + L + '" ' + MET + '/><path d="' + R + '" ' + MET + '/>' +
            ln(m3, cy2 - dH - 3, m3, cy2 + dH + 3, 'stroke="' + RD + '" stroke-width="1.6"') + ln(m4, cy2 - dH - 3, m4, cy2 + dH + 3, 'stroke="' + RD + '" stroke-width="1.6"') +
            dim(m3, m4, cy2 + gH + 8, 'L_f = 62.5 mm') + tx(mid2 + 8, cy2 - dH - 8, 'd_f = 8 mm', 'font-size="10"') + ah(mid2 + 6, cy2 - dH - 7, mid2 + 1, cy2 - nk - 1, 'currentColor', 1) +
            tx(8, 133, 'after fracture', 'font-size="10" font-weight="bold"'));
    })();

    (function () {
        const E = [[0, 0], [0.041, 81.5], [0.081, 163], [0.122, 244.5], [0.163, 325.9], [0.18, 360.2], [1, 358.5], [5, 423.7], [12, 488.9], [18, 540.3], [25.2, 456.3]];
        S.tensileCurve = plot({
            h: 240, x0: 0, x1: 28, y0: 0, y1: 600, xt: rng(0, 25, 5).map(function (v) { return [v, String(v)]; }), yt: rng(0, 600, 6).map(function (v) { return [v, String(v)]; }),
            xl: 'ε (%)', yl: 'σ (MPa)', series: [{ pts: E, color: BL, w: 2 }],
            extra: function (X, Y) {
                let s = '';
                E.forEach(function (p) { s += dot(X(p[0]), Y(p[1]), BL, 2.8); });
                s += ln(X(0), Y(540.3), X(18), Y(540.3), DASH()) + ln(X(18), Y(540.3), X(18), Y(0), DASH()) + ln(X(0), Y(360.2), X(0.18), Y(360.2), DASH());
                s += tx(X(18) + 5, Y(540.3) - 6, 'U  540', 'font-size="10" font-weight="bold"') + tx(X(1.2), Y(360) + 15, 'Y  360', 'font-size="10" font-weight="bold"') + tx(X(25.2) - 2, Y(456.3) + 14, 'F  456', 'font-size="10" font-weight="bold" text-anchor="middle"');
                return s;
            }
        });
        const Z = E.slice(0, 6).concat([[0.4, 360], [0.5, 360]]);
        S.tensileElastic = plot({
            h: 220, x0: 0, x1: 0.5, y0: 0, y1: 400, xt: [0, 0.1, 0.2, 0.3, 0.4, 0.5].map(function (v) { return [v, String(v)]; }), yt: rng(0, 400, 4).map(function (v) { return [v, String(v)]; }),
            xl: 'ε (%)', yl: 'σ (MPa)', series: [{ pts: Z, color: BL, w: 2 }, { pts: [[0, 0], [0.2, 400]], color: GN, w: 1.2, dash: '4 3' }],
            extra: function (X, Y) {
                let s = ''; E.slice(0, 6).forEach(function (p) { s += dot(X(p[0]), Y(p[1]), BL, 3); });
                s += ln(X(0.18), Y(360), X(0.18), Y(0), DASH()) + tx(X(0.24), Y(360) - 8, 'Y: ε = 0.18 %, σ = 360', 'font-size="10" font-weight="bold"');
                s += tx(X(0.2), Y(150), 'slope = E = 200 000 MPa', 'font-size="10" fill="' + GN + '"');
                return s;
            }
        });
    })();

    /* =============== 2 COMPRESSION =============== */
    S.compressionShapes = wrap(206,
        /* ductile, before / after */
        '<rect x="14" y="26" width="92" height="9" ' + GRIP + '/><rect x="14" y="141" width="92" height="9" ' + GRIP + '/><rect x="42" y="35" width="36" height="106" ' + MET + '/>' + ah(60, 4, 60, 26, 'currentColor') + tx(66, 13, 'F') +
        tx(60, 168, 'before', 'text-anchor="middle" font-size="10"') +
        '<rect x="122" y="34" width="92" height="9" ' + GRIP + '/><rect x="122" y="133" width="92" height="9" ' + GRIP + '/><path d="M152 43Q136 88 152 133H184Q200 88 184 43Z" ' + MET + '/>' + ah(168, 4, 168, 34, 'currentColor') + tx(174, 15, 'F') +
        tx(168, 168, 'ductile: barrel', 'text-anchor="middle" font-size="10"') +
        /* brittle with a shear plane (concrete cylinder 150 x 300 drawn at 0.33 px/mm -> 50 x 100 px) */
        '<rect x="236" y="26" width="110" height="9" ' + GRIP + '/><rect x="236" y="141" width="110" height="9" ' + GRIP + '/><rect x="264" y="35" width="54" height="106" ' + MET + '/>' + ln(266, 40, 316, 136, 'stroke="' + RD + '" stroke-width="2"') + ah(291, 4, 291, 26, 'currentColor') + tx(297, 13, 'F') +
        tx(291, 168, 'brittle: shear plane', 'text-anchor="middle" font-size="10"') + tx(291, 188, '≈ 30° to the load axis', 'text-anchor="middle" font-size="9.5" fill="' + RD + '"'));
    (function () {
        /* concrete, Hognestad idealisation: parabola to f_c = 31.7 MPa at eps_0 = 0.002, then a line down to 0.85 f_c at 0.0038 (typical shape, not a measurement) */
        const fc = 31.7, e0 = 0.002, c = rng(0, 0.0038, 38).map(function (e) { return [e * 1000, e <= e0 ? fc * (2 * e / e0 - (e / e0) * (e / e0)) : fc * (1 - 0.15 * (e - e0) / 0.0018)]; });
        S.compressionCurve = plot({
            h: 220, x0: 0, x1: 4, y0: 0, y1: 40, xt: [0, 1, 2, 3, 4].map(function (v) { return [v, String(v)]; }), yt: [0, 10, 20, 30, 40].map(function (v) { return [v, String(v)]; }),
            xl: 'ε (×10⁻³)', yl: 'σ_c (MPa)', series: [{ pts: c, color: BL, w: 2 }],
            extra: function (X, Y) { return dot(X(2), Y(fc), RD, 4) + ln(X(0), Y(fc), X(2), Y(fc), DASH(RD)) + ln(X(2), Y(fc), X(2), Y(0), DASH(RD)) + tx(X(2) + 6, Y(fc) - 7, 'σ_c = 31.7 at ε ≈ 0.002', 'font-size="10" font-weight="bold" fill="' + RD + '"'); }
        });
    })();

    /* =============== 3 BENDING =============== */
    S.bendSetup = (function () {
        /* example bar: L = 40 mm span, b = 4, d = 3 mm; drawn 6 px/mm (the bar is thin) */
        const k = 6, L = 40 * k, x0 = 60, bl = 45 * k, bx = x0 - 2.5 * k, d = 3 * k, y = 70;
        return wrap(196,
            '<rect x="' + bx + '" y="' + y + '" width="' + bl + '" height="' + d + '" ' + MET + '/>' +
            '<polygon points="' + x0 + ',' + (y + d) + ' ' + (x0 - 9) + ',' + (y + d + 16) + ' ' + (x0 + 9) + ',' + (y + d + 16) + '" ' + GRIP + '/><polygon points="' + (x0 + L) + ',' + (y + d) + ' ' + (x0 + L - 9) + ',' + (y + d + 16) + ' ' + (x0 + L + 9) + ',' + (y + d + 16) + '" ' + GRIP + '/>' +
            '<circle cx="' + (x0 + L / 2) + '" cy="' + (y - 8) + '" r="8" ' + GRIP + '/>' + ah(x0 + L / 2, 8, x0 + L / 2, y - 18) + tx(x0 + L / 2 + 8, 18, 'F = 450 N') +
            dim(x0, x0 + L, y + d + 34, 'L = 40 mm') +
            ln(x0 + L + 22, y, x0 + L + 22, y + d, 'stroke="currentColor" stroke-width="1"') + tx(x0 + L + 28, y + d - 2, 'd = 3', 'font-size="10"') +
            tx(180, y + d + 72, 'bottom face: stretched (tension) · top face: squeezed', 'text-anchor="middle" font-size="9.5" fill="' + RD + '"') +
            tx(180, 190, 'drawn to scale (the bar is 45 × 4 × 3 mm)', 'text-anchor="middle" font-size="9.5"'));
    })();
    (function () {
        const F = 450, L = 40, M = rng(0, L, 2).map(function (x) { return [x, x <= L / 2 ? F * x / 2 : F * (L - x) / 2]; });
        S.bendMoment = plot({
            h: 200, x0: 0, x1: 40, y0: 0, y1: 5000, xt: [0, 10, 20, 30, 40].map(function (v) { return [v, String(v)]; }), yt: [0, 1000, 2000, 3000, 4000, 5000].map(function (v) { return [v, String(v)]; }),
            xl: 'x along the bar (mm)', yl: 'M (N·mm)', series: [{ pts: M, color: BL, w: 2 }],
            extra: function (X, Y) { return dot(X(20), Y(4500), RD, 4) + tx(X(22), Y(4950), 'M_max = F·L/4 = 4500', 'font-size="10" font-weight="bold" fill="' + RD + '"'); }
        });
        const m = 2025, dEnd = 450 / m;
        S.bendFD = plot({
            h: 200, x0: 0, x1: 0.25, y0: 0, y1: 500, xt: [0, 0.05, 0.1, 0.15, 0.2, 0.25].map(function (v) { return [v, String(v)]; }), yt: [0, 100, 200, 300, 400, 500].map(function (v) { return [v, String(v)]; }),
            xl: 'δ (mm)', yl: 'F (N)', series: [{ pts: [[0, 0], [dEnd, 450]], color: BL, w: 2 }],
            extra: function (X, Y) { return dot(X(dEnd), Y(450), RD, 4) + tx(X(dEnd) - 8, Y(450) - 8, 'break', 'font-size="10" text-anchor="end" font-weight="bold" fill="' + RD + '"') + tx(X(0.02), Y(260), 'slope m = 2025 N/mm', 'font-size="10" fill="' + BL + '"'); }
        });
    })();

    /* =============== 4 SHEAR =============== */
    S.shearSetup = wrap(224,
        '<rect x="30" y="92" width="300" height="28" ' + MET + '/>' +
        '<rect x="62" y="64" width="50" height="84" ' + GRIP + '/><rect x="248" y="64" width="50" height="84" ' + GRIP + '/><rect x="153" y="44" width="54" height="110" fill="#e2e8f0" stroke="currentColor" stroke-width="1.1"/>' +
        ln(112, 66, 112, 146, 'stroke="' + RD + '" stroke-width="1.8" stroke-dasharray="4 3"') + ln(248, 66, 248, 146, 'stroke="' + RD + '" stroke-width="1.8" stroke-dasharray="4 3"') +
        ah(180, 8, 180, 44) + tx(188, 22, 'F') + ah(87, 196, 87, 150) + ah(273, 196, 273, 150) + tx(95, 190, 'F/2') + tx(281, 190, 'F/2') +
        tx(112, 58, 'cut 1', 'text-anchor="middle" font-size="10" fill="' + RD + '"') + tx(248, 58, 'cut 2', 'text-anchor="middle" font-size="10" fill="' + RD + '"') +
        tx(180, 216, 'two cuts → the area that resists = 2 × (π d² / 4)', 'text-anchor="middle" font-size="10"'));
    (function () {
        const tau = 300, A = function (d) { return Math.PI * d * d / 4; }, ds = rng(4, 16, 12);
        S.shearPlot = plot({
            h: 220, x0: 4, x1: 16, y0: 0, y1: 120, xt: [4, 6, 8, 10, 12, 14, 16].map(function (v) { return [v, String(v)]; }), yt: [0, 20, 40, 60, 80, 100, 120].map(function (v) { return [v, String(v)]; }),
            xl: 'd (mm)', yl: 'load F at failure (kN), τ = 300 MPa',
            series: [{ pts: ds.map(function (d) { return [d, tau * A(d) / 1000]; }), color: BL, w: 2 }, { pts: ds.map(function (d) { return [d, 2 * tau * A(d) / 1000]; }), color: GN, w: 2 }],
            extra: function (X, Y) { return dot(X(10), Y(23.56), BL, 4) + dot(X(10), Y(47.12), GN, 4) + tx(X(10) + 6, Y(23.56) + 14, '23.6 single', 'font-size="10" fill="' + BL + '"') + tx(X(10) - 6, Y(47.12) - 8, '47.1 double', 'font-size="10" text-anchor="end" fill="' + GN + '"'); }
        });
    })();

    /* =============== 5 TORSION =============== */
    S.torsionSetup = wrap(210,
        '<rect x="70" y="40" width="220" height="44" ' + MET + '/><ellipse cx="70" cy="62" rx="8" ry="22" fill="#cbd5e1" stroke="currentColor" stroke-width="1.1"/><ellipse cx="290" cy="62" rx="8" ry="22" fill="#cbd5e1" stroke="currentColor" stroke-width="1.1"/>' +
        '<line x1="78" y1="40" x2="78" y2="84" stroke="' + GN + '" stroke-width="1.6"/><path d="M78 40L282 84" fill="none" stroke="' + RD + '" stroke-width="1.6" stroke-dasharray="4 3"/>' +
        tx(88, 98, 'a line drawn along the bar becomes a helix', 'font-size="9.5" fill="' + RD + '"') +
        '<path d="M44 46Q28 62 44 78" fill="none" stroke="currentColor" stroke-width="1.6"/><polygon points="44,78 39,70 50,72"/>' + tx(16, 66, 'T') +
        dim(70, 290, 126, 'L = 250 mm   (d = 20 mm)') +
        tx(180, 152, 'θ = angle by which one end turns relative to the other', 'text-anchor="middle" font-size="10"') +
        tx(180, 172, 'T = 100 N·m  →  θ = 1.14°', 'text-anchor="middle" font-size="10.5" font-weight="bold"'));
    (function () {
        S.torsionStress = plot({
            h: 200, x0: 0, x1: 10, y0: 0, y1: 80, xt: [0, 2, 4, 6, 8, 10].map(function (v) { return [v, String(v)]; }), yt: [0, 20, 40, 60, 80].map(function (v) { return [v, String(v)]; }),
            xl: 'r (mm), 0 = axis, 10 = surface', yl: 'τ (MPa)', series: [{ pts: [[0, 0], [10, 63.7]], color: BL, w: 2 }],
            extra: function (X, Y) { return dot(X(10), Y(63.7), RD, 4) + tx(X(10) - 6, Y(63.7) - 8, 'τ_max = 63.7', 'font-size="10" font-weight="bold" text-anchor="end" fill="' + RD + '"') + tx(X(0.2), Y(40), 'τ = 0 on the axis', 'font-size="10"'); }
        });
        S.torsionTq = plot({
            h: 200, x0: 0, x1: 1.4, y0: 0, y1: 120, xt: [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4].map(function (v) { return [v, String(v)]; }), yt: [0, 20, 40, 60, 80, 100, 120].map(function (v) { return [v, String(v)]; }),
            xl: 'θ (degrees)', yl: 'T (N·m)', series: [{ pts: [[0, 0], [1.14, 100]], color: BL, w: 2 }],
            extra: function (X, Y) { return dot(X(1.14), Y(100), RD, 4) + tx(X(1.14) - 8, Y(100) + 4, '100 N·m ↔ 1.14°', 'font-size="10" font-weight="bold" text-anchor="end" fill="' + RD + '"') + tx(X(0.1), Y(40), 'slope ∝ G·J / L', 'font-size="10"'); }
        });
    })();

    /* =============== 6 BRINELL =============== */
    S.brinellGeom = (function () {
        /* D = 10 mm, d = 4 mm: depth h = (D - sqrt(D^2 - d^2)) / 2 = 0.4175 mm; scale 11 px/mm */
        const k = 11, D = 10, d = 4, R = D / 2 * k, h = (D - Math.sqrt(D * D - d * d)) / 2 * k, sy = 120;
        const pic = function (cx, loaded) {
            let s = '<rect x="' + (cx - 78) + '" y="' + sy + '" width="156" height="46" ' + MET + '/>';
            const cyc = sy - (R - h);
            if (loaded) s += '<circle cx="' + cx + '" cy="' + f1(cyc) + '" r="' + R + '" fill="#e2e8f0" fill-opacity=".9" stroke="currentColor" stroke-width="1.2"/>' + ah(cx, 4, cx, f1(cyc - R - 2)) + tx(cx + 8, 14, 'F');
            else s += '<path d="M' + f1(cx - d * k / 2) + ' ' + sy + 'A' + R + ' ' + R + ' 0 0 0 ' + f1(cx + d * k / 2) + ' ' + sy + 'Z" fill="#475569" stroke="currentColor" stroke-width="1"/>' + dim(cx - d * k / 2, cx + d * k / 2, sy - 26, 'd = 4 mm');
            return s;
        };
        return wrap(212, pic(92, true) + tx(92, 188, 'under load F', 'text-anchor="middle" font-size="10"') + tx(92, 202, 'ball D = 10 mm', 'text-anchor="middle" font-size="9.5"') +
            pic(268, false) + tx(268, 188, 'after the load is removed', 'text-anchor="middle" font-size="10"') + tx(268, 202, 'depth h ≈ 0.42 mm', 'text-anchor="middle" font-size="9.5"') +
            tx(180, 100, 'drawn to scale', 'text-anchor="middle" font-size="9.5" fill="' + RD + '"'));
    })();
    (function () {
        const hb = function (d) { return 0.102 * 2 * 29420 / (Math.PI * 10 * (10 - Math.sqrt(100 - d * d))); };
        S.brinellPlot = plot({
            h: 230, x0: 2.5, x1: 6, y0: 0, y1: 700, xt: [2.5, 3, 3.6, 4, 4.8, 5.4, 6].map(function (v) { return [v, String(v)]; }), yt: [0, 100, 200, 300, 400, 500, 600, 700].map(function (v) { return [v, String(v)]; }),
            xl: 'd (mm)', yl: 'HBW  (D = 10 mm, F = 3000 kgf)', series: [{ pts: rng(2.5, 6, 35).map(function (d) { return [d, hb(d)]; }), color: BL, w: 2 }],
            extra: function (X, Y) { return dot(X(4), Y(hb(4)), RD, 4) + ln(X(2.5), Y(hb(4)), X(4), Y(hb(4)), DASH(RD)) + ln(X(4), Y(hb(4)), X(4), Y(0), DASH(RD)) + tx(X(4) + 8, Y(hb(4)) - 8, 'd = 4.0 → 229', 'font-size="10" font-weight="bold" fill="' + RD + '"') + tx(X(5.9), Y(60), 'bigger imprint = softer', 'font-size="10" text-anchor="end"'); }
        });
    })();

    /* =============== 7 VICKERS =============== */
    S.vickersGeom = (function () {
        /* d1 = d2 = 0.5 mm -> side a = d/sqrt2 = 0.3536 mm, depth h = d/7.0 (0.0714 mm); scale 300 px/mm */
        const k = 300, d = 0.5, a = d / Math.SQRT2, h = a / (2 * Math.tan(68 * Math.PI / 180)), cx = 95, sy = 80;
        let s = '<rect x="20" y="' + sy + '" width="150" height="50" ' + MET + '/>';
        s += '<polygon points="' + f1(cx - a * k / 2) + ',' + sy + ' ' + f1(cx + a * k / 2) + ',' + sy + ' ' + cx + ',' + f1(sy + h * k) + '" fill="#e2e8f0" stroke="currentColor" stroke-width="1.2"/>';
        s += '<polygon points="' + f1(cx - a * k / 2) + ',' + sy + ' ' + f1(cx - a * k / 2 - 28) + ',' + (sy - 60) + ' ' + f1(cx + a * k / 2 + 28) + ',' + (sy - 60) + ' ' + f1(cx + a * k / 2) + ',' + sy + '" fill="#e2e8f0" stroke="currentColor" stroke-width="1.2" fill-opacity=".6"/>';
        s += ah(cx, 2, cx, sy - 58) + tx(cx + 8, 14, 'F') + tx(cx, 160, '136° between faces', 'text-anchor="middle" font-size="10"') + tx(cx, 174, 'depth h ≈ d / 7 = 0.071 mm', 'text-anchor="middle" font-size="9.5"');
        /* the imprint seen from above: square with diagonals d1 = d2 */
        const ix = 270, iy = 90, r = d * k / 2 * 0.75;
        s += '<polygon points="' + ix + ',' + (iy - r) + ' ' + (ix + r) + ',' + iy + ' ' + ix + ',' + (iy + r) + ' ' + (ix - r) + ',' + iy + '" fill="#475569" stroke="currentColor" stroke-width="1.2"/>';
        s += ln(ix - r, iy, ix + r, iy, 'stroke="' + RD + '" stroke-width="1.4"') + ln(ix, iy - r, ix, iy + r, 'stroke="' + RD + '" stroke-width="1.4"') + tx(ix + r + 4, iy + 4, 'd₁', 'fill="' + RD + '" font-size="10"') + tx(ix + 4, iy - r - 5, 'd₂', 'fill="' + RD + '" font-size="10"');
        s += tx(ix, 160, 'the imprint from above', 'text-anchor="middle" font-size="10"') + tx(ix, 174, 'd = (d₁ + d₂) / 2', 'text-anchor="middle" font-size="9.5"');
        return wrap(190, s);
    })();
    (function () {
        const hv = function (d) { return 0.1891 * 294.2 / (d * d); };
        S.vickersPlot = plot({
            h: 230, x0: 0.3, x1: 0.8, y0: 0, y1: 700, xt: [0.3, 0.4, 0.5, 0.6, 0.7, 0.8].map(function (v) { return [v, String(v)]; }), yt: [0, 100, 200, 300, 400, 500, 600, 700].map(function (v) { return [v, String(v)]; }),
            xl: 'd (mm)', yl: 'HV  (F = 30 kgf = 294.2 N)', series: [{ pts: rng(0.3, 0.8, 40).map(function (d) { return [d, hv(d)]; }), color: BL, w: 2 }],
            extra: function (X, Y) { return dot(X(0.5), Y(hv(0.5)), RD, 4) + ln(X(0.3), Y(hv(0.5)), X(0.5), Y(hv(0.5)), DASH(RD)) + ln(X(0.5), Y(hv(0.5)), X(0.5), Y(0), DASH(RD)) + tx(X(0.5) + 8, Y(hv(0.5)) - 8, 'd = 0.50 → 223', 'font-size="10" font-weight="bold" fill="' + RD + '"'); }
        });
    })();

    /* =============== 8 ROCKWELL =============== */
    S.rockwellSteps = (function () {
        /* four panels, depths exaggerated (real depths are fractions of a millimetre) */
        const panel = function (cx, label, sub, depth, cone, arrow) {
            let s = '<rect x="' + (cx - 34) + '" y="78" width="68" height="62" ' + MET + '/>';
            if (cone !== null) {
                const tipY = 78 + depth, top = tipY - 40;
                s += '<polygon points="' + cx + ',' + tipY + ' ' + (cx - 14) + ',' + top + ' ' + (cx + 14) + ',' + top + '" fill="#e2e8f0" stroke="currentColor" stroke-width="1.1"/>';
            } else s += '<path d="M' + (cx - 5) + ' 78L' + cx + ' ' + (78 + depth) + 'L' + (cx + 5) + ' 78Z" fill="#475569"/>';
            if (arrow) s += ah(cx, 18, cx, 52 + depth - 6);
            s += tx(cx, 160, label, 'text-anchor="middle" font-size="10" font-weight="bold"') + tx(cx, 174, sub, 'text-anchor="middle" font-size="9"');
            return s;
        };
        return wrap(190, panel(48, '① touch', 'zero line', 0, 1, false) + panel(138, '② minor F₀', 'depth h₀', 5, 1, true) + panel(228, '③ + major F₁', 'deepest', 15, 1, true) + panel(318, '④ remove F₁', 'permanent h', 9, null, false) +
            ln(14, 78, 346, 78, DASH(GN)) + ln(104, 83, 172, 83, DASH()) + tx(180, 12, 'depths exaggerated (really ~0.1 mm)', 'text-anchor="middle" font-size="9.5" fill="' + RD + '"'));
    })();
    (function () {
        S.rockwellPlot = plot({
            h: 220, x0: 0.06, x1: 0.16, y0: 10, y1: 80, xt: [0.06, 0.08, 0.1, 0.12, 0.14, 0.16].map(function (v) { return [v, String(v)]; }), yt: [10, 20, 30, 40, 50, 60, 70, 80].map(function (v) { return [v, String(v)]; }),
            xl: 'h = permanent depth (mm)', yl: 'HRC  (valid range about 20 to 70)', series: [{ pts: [[0.06, 70], [0.16, 20]], color: BL, w: 2 }],
            extra: function (X, Y) { return dot(X(0.08), Y(60), RD, 4) + ln(X(0.06), Y(60), X(0.08), Y(60), DASH(RD)) + ln(X(0.08), Y(60), X(0.08), Y(10), DASH(RD)) + tx(X(0.08) + 8, Y(60) - 8, 'h = 0.080 → 60 HRC', 'font-size="10" font-weight="bold" fill="' + RD + '"') + tx(X(0.15), Y(68), 'shallower = harder', 'font-size="10" text-anchor="end"'); }
        });
    })();

    /* =============== 9 CHARPY / IZOD / PENDULUM =============== */
    S.charpyDraw = (function () {
        /* Charpy V: 55 x 10 x 10 mm, notch 2 mm deep 45 deg, supports 40 mm apart; scale 5 px/mm */
        const k = 5, x0 = 42, y0 = 40, Lg = 55 * k, H = 10 * k, cx = x0 + Lg / 2;
        let s = '<rect x="' + x0 + '" y="' + y0 + '" width="' + Lg + '" height="' + H + '" ' + MET + '/>';
        const nw = 2 * Math.tan(22.5 * Math.PI / 180) * 2 * k;
        s += '<polygon points="' + f1(cx - nw / 2) + ',' + (y0 + H) + ' ' + f1(cx + nw / 2) + ',' + (y0 + H) + ' ' + cx + ',' + (y0 + H - 2 * k) + '" fill="#fff" stroke="currentColor" stroke-width="1"/>';
        [cx - 20 * k, cx + 20 * k].forEach(function (x) { s += '<polygon points="' + x + ',' + (y0 + H) + ' ' + (x - 9) + ',' + (y0 + H + 16) + ' ' + (x + 9) + ',' + (y0 + H + 16) + '" ' + GRIP + '/>'; });
        s += '<path d="M' + (cx - 5) + ' ' + (y0 - 22) + 'H' + (cx + 5) + 'V' + (y0 - 4) + 'Q' + cx + ' ' + y0 + ' ' + (cx - 5) + ' ' + (y0 - 4) + 'Z" fill="' + BL + '"/>' + ah(cx + 30, 6, cx + 8, y0 - 14, BL, 1.8) + tx(cx + 34, 12, 'striker hits here', 'font-size="10" fill="' + BL + '"');
        s += dim(cx - 20 * k, cx + 20 * k, y0 + H + 40, 'span 40 mm') + dim(x0, x0 + Lg, y0 + H + 64, '55 mm') + tx(x0 + Lg + 8, y0 + 30, '10', 'font-size="10"') + ln(x0 + Lg + 4, y0, x0 + Lg + 4, y0 + H, 'stroke="currentColor" stroke-width="1"');
        s += tx(cx, y0 + H + 96, 'the notch is on the side AWAY from the striker', 'text-anchor="middle" font-size="10" fill="' + RD + '"');
        return wrap(214, s);
    })();
    S.notchDetail = (function () {
        const z = 40, cx = 120, top = 30, hw = Math.tan(22.5 * Math.PI / 180) * 2 * z; /* 2 mm deep, 45° included angle: half-width at the surface = 2*tan(22.5°) mm */
        return wrap(150,
            '<polygon points="' + f1(cx - hw) + ',' + top + ' ' + f1(cx + hw) + ',' + top + ' ' + cx + ',' + (top + 2 * z) + '" fill="#e2e8f0" stroke="currentColor" stroke-width="1.4"/>' +
            '<rect x="' + (cx - 110) + '" y="' + (top - 22) + '" width="220" height="22" ' + MET + '/>' +
            ln(cx + hw + 30, top, cx + hw + 30, top + 2 * z, 'stroke="currentColor" stroke-width="1"') + tx(cx + hw + 36, top + z + 4, '2 mm', 'font-size="10"') +
            tx(cx, top + 2 * z + 20, '45°   root radius 0.25 mm', 'text-anchor="middle" font-size="10"') +
            tx(250, top - 4, 'notch detail', 'font-size="9.5"') + tx(250, top + 12, '(magnified 40×)', 'font-size="9.5"'));
    })();
    S.izodDraw = (function () {
        /* plastics bar 63.5 x 12.7 x 3.2 mm, notch 2.54 mm, clamped with the notch at the top of the vise, struck 22 mm above it; scale 3.4 px/mm */
        const k = 3.4, bx = 140, w = 12.7 * k, top = 14, notchY = top + 31.8 * k, bottom = top + 63.5 * k;
        let s = '<rect x="' + (bx - 34) + '" y="' + notchY + '" width="' + (w + 68) + '" height="' + (bottom - notchY) + '" ' + GRIP + '/>';
        s += '<rect x="' + bx + '" y="' + top + '" width="' + w + '" height="' + (63.5 * k) + '" ' + MET + '/>';
        s += '<polygon points="' + (bx + w) + ',' + f1(notchY - 2.54 * k * 0.38) + ' ' + (bx + w) + ',' + f1(notchY + 2.54 * k * 0.38) + ' ' + f1(bx + w - 2.54 * k) + ',' + notchY + '" fill="#fff" stroke="currentColor" stroke-width="1"/>';
        const sy = notchY - 22 * k;
        s += ah(bx + w + 80, sy, bx + w + 2, sy, BL, 2) + tx(bx + w + 84, sy + 4, 'striker', 'font-size="10" fill="' + BL + '"');
        s += ln(bx - 20, notchY, bx - 20, sy, 'stroke="currentColor" stroke-width="1"') + ln(bx - 24, sy, bx - 16, sy) + ln(bx - 24, notchY, bx - 16, notchY) + tx(bx - 26, (sy + notchY) / 2 + 4, '22 mm', 'text-anchor="end" font-size="10"');
        s += tx(bx + w + 40, notchY - 8, 'notch faces the striker', 'font-size="10" fill="' + RD + '"') + tx(bx - 40, bottom + 14, 'clamped in a vise (cantilever)', 'font-size="10"');
        return wrap(f1(bottom + 26), s);
    })();
    S.pendulum = (function () {
        /* R = 0.8 m (drawn 125 px/m = 100 px), alpha = 120°, h0 = 1.2 m; after the break beta = 104.5°, h1 = 1.0 m */
        const R = 100, px = 180, py = 74, ang = function (deg, sgn) { const a = deg * Math.PI / 180; return [px + sgn * R * Math.sin(a), py + R * Math.cos(a)]; };
        const A = ang(120, -1), B = ang(104.5, 1), C = [px, py + R], base = py + R;
        return wrap(246,
            ln(px - 120, base, px + 120, base, DASH()) + tx(px - 120, base - 4, 'lowest point', 'font-size="9.5"') +
            ln(px, py, A[0], A[1], 'stroke="currentColor" stroke-width="1.4" stroke-dasharray="4 3"') + ln(px, py, C[0], C[1], 'stroke="currentColor" stroke-width="1.6"') + ln(px, py, B[0], B[1], 'stroke="currentColor" stroke-width="1.4" stroke-dasharray="4 3"') +
            '<circle cx="' + px + '" cy="' + py + '" r="4"/><circle cx="' + f1(A[0]) + '" cy="' + f1(A[1]) + '" r="9" fill="' + BL + '"/><circle cx="' + C[0] + '" cy="' + C[1] + '" r="8" fill="#94a3b8" stroke="currentColor"/><circle cx="' + f1(B[0]) + '" cy="' + f1(B[1]) + '" r="9" fill="' + GN + '"/>' +
            ln(A[0] - 12, A[1], A[0] - 12, base, 'stroke="' + RD + '" stroke-width="1"') + tx(A[0] - 16, (A[1] + base) / 2 + 3, 'h₀ = 1.20 m', 'text-anchor="end" font-size="10" fill="' + RD + '"') +
            ln(B[0] + 12, B[1], B[0] + 12, base, 'stroke="' + RD + '" stroke-width="1"') + tx(B[0] + 16, (B[1] + base) / 2 + 3, 'h₁ = 1.00 m', 'font-size="10" fill="' + RD + '"') +
            tx(A[0] + 10, A[1] - 12, 'start (α = 120°)', 'font-size="10"') + tx(B[0] - 4, B[1] - 12, 'after break (β ≈ 104.5°)', 'text-anchor="end" font-size="10"') + tx(px + 8, py + 18, 'R = 0.8 m', 'font-size="10"') +
            tx(180, 232, 'E = m·g·(h₀ − h₁) = 25 × 9.81 × 0.20 = 49 J', 'text-anchor="middle" font-size="10.5" font-weight="bold"'));
    })();
    (function () {
        const kv = function (T) { return 79 + 74 * Math.tanh((T + 10) / 15); };
        S.dbtt = plot({
            h: 230, x0: -80, x1: 60, y0: 0, y1: 180, xt: [-80, -60, -40, -20, 0, 20, 40, 60].map(function (v) { return [v, String(v)]; }), yt: [0, 30, 60, 90, 120, 150, 180].map(function (v) { return [v, String(v)]; }),
            xl: 'test temperature (°C)', yl: 'KV (J)  — illustrative curve', series: [{ pts: rng(-80, 60, 70).map(function (T) { return [T, kv(T)]; }), color: BL, w: 2 }],
            extra: function (X, Y) { return ln(X(-80), Y(27), X(60), Y(27), DASH(RD)) + dot(X(-23), Y(27), RD, 4) + ln(X(-23), Y(27), X(-23), Y(0), DASH(RD)) + tx(X(-23) + 6, Y(27) + 16, 'T₂₇ ≈ −23 °C', 'font-size="10" font-weight="bold" fill="' + RD + '"') + tx(X(-78), Y(27) - 5, '27 J', 'font-size="10" fill="' + RD + '"') + dot(X(-40), Y(kv(-40)), BL, 3) + dot(X(20), Y(kv(20)), BL, 3) + tx(X(-76), Y(60), 'brittle: low energy', 'font-size="10"') + tx(X(10), Y(172), 'ductile: high energy', 'font-size="10" text-anchor="middle"'); }
        });
    })();

    /* =============== 10 FATIGUE =============== */
    (function () {
        const c = rng(0, 2, 80).map(function (n) { return [n, 80 + 160 * Math.sin(2 * Math.PI * n)]; });
        S.stressCycle = plot({
            h: 220, x0: 0, x1: 2, y0: -120, y1: 280, xt: [0, 0.5, 1, 1.5, 2].map(function (v) { return [v, String(v)]; }), yt: [-100, 0, 100, 200, 280].map(function (v) { return [v, String(v)]; }),
            xl: 'cycles', yl: 'σ (MPa)', series: [{ pts: c, color: BL, w: 2 }],
            extra: function (X, Y) { return ln(X(0), Y(240), X(2), Y(240), DASH()) + ln(X(0), Y(-80), X(2), Y(-80), DASH()) + ln(X(0), Y(80), X(2), Y(80), DASH(GN)) + tx(X(2) - 2, Y(240) - 4, 'σ_max = 240', 'font-size="10" text-anchor="end"') + tx(X(2) - 2, Y(-80) + 13, 'σ_min = −80', 'font-size="10" text-anchor="end"') + tx(X(2) - 2, Y(80) - 4, 'σ_m = 80', 'font-size="10" text-anchor="end" fill="' + GN + '"') + ln(X(0.25), Y(80), X(0.25), Y(240), 'stroke="' + RD + '" stroke-width="1.6"') + tx(X(0.25) + 5, Y(160) + 3, 'σ_a = 160', 'font-size="10" fill="' + RD + '"'); }
        });
        /* illustrative S-N: steel sigma_u = 500 MPa: 0.9 sigma_u at 10^3, S_e = 0.5 sigma_u from 10^6; aluminium sigma_u = 300 MPa: 0.9 sigma_u at 10^3, 100 MPa at 5e8 */
        const st = function (lg) { return lg <= 6 ? 450 * Math.pow(250 / 450, (lg - 3) / 3) : 250; }, al = function (lg) { return 270 * Math.pow(100 / 270, (lg - 3) / (Math.log10(5e8) - 3)); };
        S.sn = plot({
            h: 230, x0: 3, x1: 9, y0: 0, y1: 500, xt: [[3, '10³'], [4, '10⁴'], [5, '10⁵'], [6, '10⁶'], [7, '10⁷'], [8, '10⁸'], [9, '10⁹']],
            yt: [0, 100, 200, 300, 400, 500].map(function (v) { return [v, String(v)]; }), xl: 'log₁₀ N  (cycles)', yl: 'σ_a (MPa) — illustrative',
            series: [{ pts: rng(3, 9, 60).map(function (lg) { return [lg, st(lg)]; }), color: BL, w: 2 }, { pts: rng(3, Math.log10(5e8), 60).map(function (lg) { return [lg, al(lg)]; }), color: GN, w: 2 }],
            extra: function (X, Y) { return ln(X(6), Y(250), X(9), Y(250), DASH(BL)) + tx(X(9) - 2, Y(250) - 5, 'S_e = 250 (steel, knee at 10⁶)', 'font-size="10" text-anchor="end" fill="' + BL + '"') + tx(X(6.5), Y(al(6.5)) - 12, 'aluminium: keeps falling', 'font-size="10" fill="' + GN + '"') + dot(X(6), Y(250), BL, 3.5); }
        });
        S.goodman = plot({
            h: 230, x0: 0, x1: 550, y0: 0, y1: 300, xt: [0, 100, 200, 300, 400, 500].map(function (v) { return [v, String(v)]; }), yt: [0, 50, 100, 150, 200, 250, 300].map(function (v) { return [v, String(v)]; }),
            xl: 'σ_m (MPa)', yl: 'σ_a (MPa)', series: [{ pts: [[0, 250], [500, 0]], color: BL, w: 2 }, { pts: [[0, 0], [100, 200]], color: GN, w: 1.2, dash: '4 3' }],
            extra: function (X, Y) { return dot(X(80), Y(160), RD, 4.5) + tx(X(112), Y(122), 'working point (80, 160)', 'font-size="10" font-weight="bold" fill="' + RD + '"') + dot(X(100), Y(200), BL, 3.5) + tx(X(100) + 6, Y(200) - 6, 'on the line (100, 200): n = 200/160 = 1.25', 'font-size="10" fill="' + GN + '"') + tx(X(250), Y(165), 'S_e = 250 · σ_u = 500', 'font-size="10"'); }
        });
    })();

    /* =============== 11 CREEP =============== */
    (function () {
        const cr = function (t, ts) { /* illustrative: instantaneous + primary + steady + tertiary, strain in % */
            return 0.3 + 0.5 * (1 - Math.exp(-t / 80)) + 0.0009 * t + 0.03 * (Math.exp(Math.max(0, t - 700) / 90) - 1) * (t > 700 ? 1 : 0);
        };
        const c1 = rng(0, 1000, 100).map(function (t) { return [t, cr(t)]; });
        const c2 = rng(0, 520, 80).map(function (t) { const s = t * 1.9; return [t, cr(s)]; }).filter(function (p) { return p[1] <= 3.3; });
        S.creep = plot({
            h: 230, x0: 0, x1: 1000, y0: 0, y1: 3.5, xt: [0, 200, 400, 600, 800, 1000].map(function (v) { return [v, String(v)]; }), yt: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5].map(function (v) { return [v, String(v)]; }),
            xl: 't (hours)', yl: 'ε (%) — illustrative', series: [{ pts: c1, color: BL, w: 2 }, { pts: c2, color: RD, w: 1.6, dash: '5 3' }],
            extra: function (X, Y) { return tx(X(10), Y(0.3) - 6, 'ε₀', 'font-size="10"') + tx(X(60), Y(1.4), 'I', 'font-size="11" font-weight="bold"') + tx(X(330), Y(0.5), 'II  steady: slope = ε̇_s', 'font-size="10" font-weight="bold"') + tx(X(860), Y(2.9), 'III', 'font-size="11" font-weight="bold"') + tx(X(300), Y(2.9), 'dashed: higher stress or T', 'font-size="10" fill="' + RD + '"'); }
        });
        const P = 20700, T = rng(800, 950, 30);
        S.larson = plot({
            h: 220, x0: 800, x1: 950, y0: 2, y1: 6, xt: [800, 850, 900, 950].map(function (v) { return [v, String(v)]; }), yt: [2, 3, 4, 5, 6].map(function (v) { return [v, String(v)]; }),
            xl: 'T (K)', yl: 'log₁₀ t_r  (t_r in hours), P = 20 700', series: [{ pts: T.map(function (k) { return [k, P / k - 20]; }), color: BL, w: 2 }],
            extra: function (X, Y) { return dot(X(900), Y(3), RD, 4.5) + dot(X(850), Y(P / 850 - 20), GN, 4.5) + tx(X(900) + 8, Y(3) - 6, '900 K: 1000 h', 'font-size="10" font-weight="bold" fill="' + RD + '"') + tx(X(850) + 8, Y(P / 850 - 20) - 8, '850 K: 22 500 h', 'font-size="10" font-weight="bold" fill="' + GN + '"'); }
        });
    })();

    /* =============== 12 FRACTURE TOUGHNESS =============== */
    S.ct = (function () {
        /* ASTM E399 C(T): W = 50, B = 25, a = 25; overall 1.25 W x 1.2 W; holes 0.25 W dia at 0.25 W; scale 3.2 px/mm */
        const k = 3.2, W = 50 * k, x0 = 70, y0 = 30, Wt = 1.25 * W, Ht = 1.2 * W, hx = x0 + 0.25 * W, hr = 0.125 * W;
        const lineX = hx, tip = lineX + 25 * k, back = x0 + Wt;
        return wrap(f1(y0 + Ht + 60),
            '<rect x="' + x0 + '" y="' + y0 + '" width="' + Wt + '" height="' + Ht + '" ' + MET + '/>' +
            '<circle cx="' + hx + '" cy="' + f1(y0 + 0.275 * W) + '" r="' + hr + '" fill="#fff" stroke="currentColor"/><circle cx="' + hx + '" cy="' + f1(y0 + Ht - 0.275 * W) + '" r="' + hr + '" fill="#fff" stroke="currentColor"/>' +
            ln(x0, y0 + Ht / 2, x0 + 0.25 * W + 18, y0 + Ht / 2, 'stroke="#fff" stroke-width="3"') + ln(x0 + 0.25 * W + 18, y0 + Ht / 2, tip, y0 + Ht / 2, 'stroke="' + RD + '" stroke-width="2.2"') + dot(tip, y0 + Ht / 2, RD, 2.6) +
            ln(lineX, y0 - 6, lineX, y0 + Ht + 8, DASH()) + ln(back, y0 + Ht / 2 - 40, back, y0 + Ht + 24, DASH()) +
            ah(hx, y0 - 4, hx, y0 + 0.275 * W - hr - 2) + tx(hx + 6, y0 + 4, 'P') + ah(hx, y0 + Ht + 4, hx, y0 + Ht - 0.275 * W + hr + 2) + tx(hx + 6, y0 + Ht + 6, 'P') +
            dim(lineX, tip, y0 + Ht + 22, 'a = 25') + dim(lineX, back, y0 + Ht + 46, 'W = 50 mm') +
            tx(x0 + 4, y0 + Ht / 2 + 16, 'machined notch', 'font-size="9.5"') + tx(tip + 4, y0 + Ht / 2 - 8, 'fatigue crack', 'font-size="9.5" text-anchor="start" fill="' + RD + '"') +
            tx(x0 + Wt + 8, y0 + 12, 'B = 25 mm', 'font-size="10"') + tx(x0 + Wt + 8, y0 + 26, '(thickness)', 'font-size="9.5"') + tx(8, y0 + Ht + 66, 'drawn to scale', 'font-size="9.5" fill="' + RD + '"'));
    })();
    S.ctPQ = (function () {
        /* illustrative record: v(P) = P/K0 + c·P² ; the 5 % secant has slope 0.95·K0 and meets the record at P_Q = 20 kN; P_max = 1.05·P_Q */
        const K0 = 40, c = 6.58e-5, v = function (p) { return p / K0 + c * p * p; };
        let PQ = 0; for (let p = 0.01; p < 60; p += 0.0005) { if (v(p) >= p / (0.95 * K0)) { PQ = p; break; } }
        const Pmax = PQ * 1.05, rec = []; for (let p = 0; p <= Pmax + 1e-9; p += Pmax / 80) rec.push([v(p), p]);
        return plot({
            h: 230, x0: 0, x1: 0.6, y0: 0, y1: 25, xt: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6].map(function (x) { return [x, String(x)]; }), yt: [0, 5, 10, 15, 20, 25].map(function (x) { return [x, String(x)]; }),
            xl: 'v (mm), illustrative record', yl: 'P (kN)', series: [{ pts: rec, color: BL, w: 2 }, { pts: [[0, 0], [0.6, 0.95 * K0 * 0.6]], color: GN, w: 1.2, dash: '4 3' }, { pts: [[0, 0], [0.6, K0 * 0.6]], color: 'currentColor', w: 0.8, dash: '2 3' }],
            extra: function (X, Y) { return dot(X(v(PQ)), Y(PQ), RD, 4.5) + ln(X(0), Y(PQ), X(v(PQ)), Y(PQ), DASH(RD)) + tx(X(v(PQ)) + 6, Y(PQ) + 16, 'P_Q = 20', 'font-size="10" font-weight="bold" fill="' + RD + '"') + ln(X(0), Y(Pmax), X(v(Pmax)), Y(Pmax), DASH()) + tx(X(0.02), Y(Pmax) - 5, 'P_max = 21: P_max / P_Q = 1.05 ≤ 1.10 ✓', 'font-size="10"') + tx(X(0.6), Y(9), 'dotted: initial slope', 'font-size="9.5" text-anchor="end"') + tx(X(0.6), Y(6.5), 'dashed: 0.95 × initial slope', 'font-size="9.5" text-anchor="end"'); }
        });
    })();
    (function () {
        const Kc = 50, sg = 300, Y1 = 1.12, K = function (a) { return Y1 * sg * Math.sqrt(Math.PI * a / 1000); };
        S.kAplot = plot({
            h: 220, x0: 0, x1: 14, y0: 0, y1: 80, xt: [0, 2, 4, 6, 8, 10, 12, 14].map(function (v) { return [v, String(v)]; }), yt: [0, 20, 40, 60, 80].map(function (v) { return [v, String(v)]; }),
            xl: 'a = crack length (mm)', yl: 'K_I (MPa·√m), σ = 300 MPa', series: [{ pts: rng(0, 14, 56).map(function (a) { return [a, K(a)]; }), color: BL, w: 2 }, { pts: [[0, Kc], [14, Kc]], color: RD, w: 1.4, dash: '5 3' }],
            extra: function (X, Y) { return dot(X(7.05), Y(Kc), RD, 4.5) + ln(X(7.05), Y(Kc), X(7.05), Y(0), DASH(RD)) + tx(X(7.05) - 7, Y(20), 'a_c = 7.05 mm', 'text-anchor="end" font-size="10" font-weight="bold" fill="' + RD + '"') + tx(X(0.3), Y(Kc) - 6, 'K_Ic = 50', 'font-size="10" fill="' + RD + '"'); }
        });
    })();

    window.MT_SVG = S;
})();
