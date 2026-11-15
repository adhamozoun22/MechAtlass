/* MechAtlas — dropdowns of typical values for the calculators (additive file; app.js renders input.presets).
   Choosing an item only fills the number field(s); manual entry always stays possible. Values are TYPICAL textbook/handbook
   figures (they vary with alloy, temperature and source) — the page tells the user to check their own data sheet. */
(function () {
    'use strict';
    if (typeof calcDefs === 'undefined') return;
    const T = (en, ar) => ({ en, ar });
    // ---- material tables: [en, ar, E GPa, G GPa, rho kg/m3, alpha 1e-6/K, k W/mK]
    const MAT = [
        ['Carbon / structural steel', 'فولاذ كربوني / إنشائي', 200, 79, 7850, 12, 50],
        ['Stainless steel 304', 'فولاذ مقاوم للصدأ 304', 193, 77, 8000, 17, 16],
        ['Aluminium 6061', 'ألمنيوم 6061', 69, 26, 2700, 23, 167],
        ['Copper', 'نحاس أحمر', 117, 44, 8960, 17, 390],
        ['Brass', 'نحاس أصفر (براص)', 100, 37, 8500, 19, 120],
        ['Titanium Ti-6Al-4V', 'تيتانيوم Ti-6Al-4V', 114, 44, 4430, 9, 7],
        ['Concrete', 'خرسانة', 30, null, 2400, 10, 1.4],
        ['Grey cast iron', 'حديد زهر رمادي', null, null, 7200, 10.5, null]
    ];
    const col = (idx, unit, fmtLabel) => MAT.filter(m => m[idx] !== null).map(m => ({ label: T(`${m[0]} — ${m[idx]}${fmtLabel || ''}`, `${m[1]} — ${m[idx]}${fmtLabel || ''}`), v: m[idx], u: unit }));
    const list = (rows, unit) => rows.map(r => ({ label: T(r[0], r[1]), v: r[2], u: unit }));
    const E = col(2, 1, ' GPa'), G = col(3, 1, ' GPa'), RHO = col(4, 1, ' kg/m³'), ALPHA = col(5, undefined, ' ×10⁻⁶/K'), K = col(6, undefined, ' W/mK');
    const GSPRING = [{ label: T('Spring steel — 79.3 GPa', 'فولاذ نوابض — 79.3 GPa'), v: 79.3, u: 1 }, ...G.slice(1)];
    // mass calculators use a g/cm3-capable unit select; rho presets always set kg/m3 (multiplier 1)
    const LIQ = [['Water 20 °C — 998 kg/m³', 'ماء 20°م — 998 kg/m³', 998], ['Seawater — 1025 kg/m³', 'ماء البحر — 1025 kg/m³', 1025], ['Diesel — 840 kg/m³', 'ديزل — 840 kg/m³', 840], ['Engine oil (typical) — 880 kg/m³', 'زيت محرك (نموذجي) — 880 kg/m³', 880]];
    const YS = [['S235 structural steel — 235 MPa', 'فولاذ إنشائي S235 — 235 MPa', 235], ['S355 structural steel — 355 MPa', 'فولاذ إنشائي S355 — 355 MPa', 355], ['Aluminium 6061-T6 — 276 MPa', 'ألمنيوم 6061-T6 — 276 MPa', 276], ['Stainless 304 annealed — 215 MPa', 'ستانلس 304 ملدّن — 215 MPa', 215]];
    const UTS = [['S235 structural steel — 360 MPa (min.)', 'فولاذ إنشائي S235 — 360 MPa (أدنى)', 360], ['S355 structural steel — 470 MPa (min.)', 'فولاذ إنشائي S355 — 470 MPa (أدنى)', 470], ['Aluminium 6061-T6 — 310 MPa', 'ألمنيوم 6061-T6 — 310 MPa', 310], ['Stainless 304 annealed — 505 MPa', 'ستانلس 304 ملدّن — 505 MPa', 505]];
    const RPM = [['3000 rpm (2-pole motor, 50 Hz sync.)', '3000 rpm (محرك قطبين، 50Hz تزامني)', 3000], ['1500 rpm (4-pole, 50 Hz sync.)', '1500 rpm (4 أقطاب، 50Hz تزامني)', 1500], ['1000 rpm (6-pole, 50 Hz sync.)', '1000 rpm (6 أقطاب، 50Hz تزامني)', 1000], ['750 rpm (8-pole, 50 Hz sync.)', '750 rpm (8 أقطاب، 50Hz تزامني)', 750], ['3600 rpm (2-pole, 60 Hz sync.)', '3600 rpm (قطبان، 60Hz تزامني)', 3600], ['1800 rpm (4-pole, 60 Hz sync.)', '1800 rpm (4 أقطاب، 60Hz تزامني)', 1800]];
    const set = (cid, iid, presets) => {
        const c = calcDefs.find(x => x.id === cid), i = c && c.inputs.find(x => x.id === iid);
        if (i) i.presets = presets;
    };

    // ---- materials
    set('thermal', 'a', ALPHA); set('thermal', 'e', E);
    set('spring', 'g', GSPRING); set('shaft', 'g', G);
    set('massr', 'rho', RHO); set('massb', 'rho', RHO); set('flywheel', 'rho', RHO.filter(p => !/Concrete/.test(p.label.en)));
    set('wall', 'k1', K.concat(list([['Red brick — 0.72', 'طوب أحمر — 0.72', 0.72], ['Window glass — 0.78', 'زجاج نوافذ — 0.78', 0.78], ['Pine wood — 0.12', 'خشب صنوبر — 0.12', 0.12], ['Mineral / glass wool — 0.04', 'صوف معدني / زجاجي — 0.04', 0.04], ['Expanded polystyrene — 0.035', 'بوليستيرين ممدد — 0.035', 0.035]])));
    set('wall', 'k2', calcDefs.find(x => x.id === 'wall').inputs.find(x => x.id === 'k1').presets);
    set('pipe', 'rho', LIQ.map(r => ({ label: T(r[0], r[1]), v: r[2] })).concat([{ label: T('Air 20 °C — 1.204 kg/m³', 'هواء 20°م — 1.204 kg/m³'), v: 1.204 }]));
    set('pump', 'rho', LIQ.map(r => ({ label: T(r[0], r[1]), v: r[2] })));
    set('pipe', 'mu', [{ label: T('Water 20 °C — 1.0 mPa·s (cP)', 'ماء 20°م — 1.0 mPa·s (cP)'), v: 1.0, u: 0.001 }, { label: T('Air 20 °C — 0.018 mPa·s (cP)', 'هواء 20°م — 0.018 mPa·s (cP)'), v: 0.018, u: 0.001 }]);
    set('pipe', 'e', [['Drawn tubing / smooth plastic — 0.0015 mm', 'أنابيب مسحوبة / بلاستيك أملس — 0.0015 mm', 0.0015], ['Commercial steel — 0.045 mm', 'فولاذ تجاري — 0.045 mm', 0.045], ['Galvanised iron — 0.15 mm', 'حديد مغلفن — 0.15 mm', 0.15], ['Cast iron — 0.26 mm', 'حديد زهر — 0.26 mm', 0.26]].map(r => ({ label: T(r[0], r[1]), v: r[2] })));
    set('fos', 'sy', YS.map(r => ({ label: T(r[0], r[1]), v: r[2], u: 1 })));
    set('fatigue', 'sy', YS.map(r => ({ label: T(r[0], r[1]), v: r[2], u: 1 })));
    set('fatigue', 'sut', UTS.map(r => ({ label: T(r[0], r[1]), v: r[2], u: 1 })));

    // ---- speeds
    [['power', 'n'], ['shaft', 'n'], ['bearing', 'n'], ['flywheel', 'n'], ['unbal', 'n'], ['gear', 'n1'], ['belt', 'n1']].forEach(a => set(a[0], a[1], RPM.map(r => ({ label: T(r[0], r[1]), v: r[2], u: 1 }))));

    // ---- standard sizes / grades
    const BOLT = [[6, 1], [8, 1.25], [10, 1.5], [12, 1.75], [16, 2], [20, 2.5], [24, 3], [30, 3.5]];
    set('bolt', 'd', BOLT.map(b => ({ label: T(`M${b[0]} (coarse pitch ${b[1]} mm)`, `M${b[0]} (خطوة خشنة ${b[1]} mm)`), v: b[0], fills: { pitch: b[1] } })));
    set('bolt', 'sp', [['4.6 — 225 MPa', 225], ['5.8 — 380 MPa', 380], ['8.8, ≤M16 — 580 MPa', 580], ['8.8, >M16 — 600 MPa', 600], ['10.9 — 830 MPa', 830], ['12.9 — 970 MPa', 970]].map(r => ({ label: T('Grade ' + r[0], 'الصنف ' + r[0]), v: r[1] })));
    set('bolt', 'k', [['Zinc-plated — 0.20', 'مغلفن بالزنك — 0.20', 0.2], ['Lubricated — 0.18', 'مزيّت — 0.18', 0.18], ['Cadmium-plated — 0.16', 'مطلي بالكادميوم — 0.16', 0.16], ['Plain black finish — 0.30', 'أسود غير مطلي — 0.30', 0.3]].map(r => ({ label: T(r[0], r[1]), v: r[2] })));
    set('bearing', 'x', [{ label: T('Ball bearing — 3', 'محمل كريات — 3'), v: 3 }, { label: T('Roller bearing — 10/3', 'محمل أسطواني — 10/3'), v: 10 / 3 }]);
    set('spur', 'm', [1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20].map(m => ({ label: T(`m = ${m} mm (ISO 54 series)`, `m = ${m} mm (سلسلة ISO 54)`), v: m })));
    set('spur', 'a', [{ label: T('20° (standard)', '20° (القياسية)'), v: 20 }, { label: T('25°', '25°'), v: 25 }, { label: T('14.5° (old standard)', '14.5° (قديمة)'), v: 14.5 }]);
    set('hbw', 'D', [10, 5, 2.5, 1].map(d => ({ label: T(`Ball Ø ${d} mm`, `كرة Ø ${d} mm`), v: d })));
    set('hbw', 'f', [['HBW 10/3000 — Ø10, 3000 kgf', 'HBW 10/3000 — Ø10، 3000 kgf', 3000, 10], ['HBW 10/1000 — Ø10, 1000 kgf', 'HBW 10/1000 — Ø10، 1000 kgf', 1000, 10], ['HBW 5/750 — Ø5, 750 kgf', 'HBW 5/750 — Ø5، 750 kgf', 750, 5], ['HBW 2.5/187.5 — Ø2.5, 187.5 kgf', 'HBW 2.5/187.5 — Ø2.5، 187.5 kgf', 187.5, 2.5]].map(r => ({ label: T(r[0], r[1]), v: r[2], u: 9.80665, fills: { D: r[3] } })));
    set('hr', 'n', [{ label: T('HRC / HRA — 100', 'HRC / HRA — 100'), v: 100 }, { label: T('HRB — 130', 'HRB — 130'), v: 130 }]);
    set('unbal', 'g', [['G 0.4 — precision grinder spindles', 'G 0.4 — محاور مطاحن دقيقة', 0.4], ['G 1 — grinding-machine drives', 'G 1 — محركات آلات الطحن', 1], ['G 2.5 — turbines, compressors', 'G 2.5 — توربينات، ضواغط', 2.5], ['G 6.3 — pumps, fans, motors', 'G 6.3 — مضخات، مراوح، محركات', 6.3], ['G 16', 'G 16', 16], ['G 40', 'G 40', 40]].map(r => ({ label: T(r[0], r[1]), v: r[2] })));
    set('hcyl', 'D', [32, 40, 50, 63, 80, 100, 125, 160, 200].map(d => ({ label: T(`Bore Ø ${d} mm (ISO 3320)`, `قطر أسطوانة Ø ${d} mm (ISO 3320)`), v: d })));
    set('key', 'w', [['Ø10–12 → 4×4', 4, 4], ['Ø12–17 → 5×5', 5, 5], ['Ø17–22 → 6×6', 6, 6], ['Ø22–30 → 8×7', 8, 7], ['Ø30–38 → 10×8', 10, 8], ['Ø38–44 → 12×8', 12, 8], ['Ø44–50 → 14×9', 14, 9], ['Ø50–58 → 16×10', 16, 10], ['Ø58–65 → 18×11', 18, 11], ['Ø65–75 → 20×12', 20, 12]].map(r => ({ label: T(`Shaft ${r[0].replace('→', ':')} (w×h, DIN 6885 / ISO 773)`, `عمود ${r[0].replace('→', ':')} (عرض×ارتفاع، DIN 6885 / ISO 773)`), v: r[1], fills: { h: r[2] } })));
})();
