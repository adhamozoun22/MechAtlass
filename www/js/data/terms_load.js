/* Encyclopedia glossary loader: turns the short glossary entries into dictionary items and defines the categories. */
(function () {
    'use strict';
    if (typeof dictData === 'undefined' || !window.TERMS_EXTRA) return;
    /* the categories, in display order */
    window.DICT_CATS = [
        { id: 'design_process', icon: 'fa-diagram-project', en: 'Design Process & Fundamentals', ar: 'أساسيات التصميم ومراحله' },
        { id: 'drafting', icon: 'fa-pencil-ruler', en: 'Engineering Drafting', ar: 'الرسم الهندسي والمخططات' },
        { id: 'design', icon: 'fa-gears', en: 'Machine Elements & Fasteners', ar: 'عناصر الآلات والوصلات' },
        { id: 'transmission', icon: 'fa-gear', en: 'Gears & Power Transmission', ar: 'التروس ونقل الحركة' },
        { id: 'tolerances', icon: 'fa-ruler-combined', en: 'Limits, Fits & Metrology', ar: 'التسامحات والقياس' },
        { id: 'metals', icon: 'fa-layer-group', en: 'Material Selection & Metals', ar: 'اختيار المواد والمعادن' },
        { id: 'materials', icon: 'fa-cubes', en: 'Stresses & Strength', ar: 'الإجهادات ومقاومة المواد' },
        { id: 'matprops', icon: 'fa-hammer', en: 'Mechanical Properties of Materials', ar: 'الخواص الميكانيكية للمواد' },
        { id: 'cadcae', icon: 'fa-laptop-code', en: 'CAD & CAE', ar: 'التصميم والتحليل بالحاسوب' },
        { id: 'testing', icon: 'fa-vial', en: 'Material Testing & Quality', ar: 'اختبار المواد والجودة' },
        { id: 'manufacturing', icon: 'fa-industry', en: 'Production & Manufacturing', ar: 'الإنتاج وعمليات التصنيع' },
        { id: 'maintenance', icon: 'fa-wrench', en: 'Maintenance & Operation', ar: 'الصيانة والتشغيل' },
        { id: 'project_safety', icon: 'fa-clipboard-check', en: 'Projects & Safety', ar: 'إدارة المشاريع والسلامة' },
        { id: 'automotive', icon: 'fa-car', en: 'Cars & Combustion Engines', ar: 'السيارات ومحركات الاحتراق' },
        { id: 'robotics', icon: 'fa-robot', en: 'Robotics & Automation', ar: 'الروبوتات والأتمتة' },
        { id: 'thermo', icon: 'fa-temperature-half', en: 'Thermodynamics & Heat Transfer', ar: 'الديناميكا الحرارية وانتقال الحرارة' },
        { id: 'fluids', icon: 'fa-droplet', en: 'Fluid Mechanics', ar: 'ميكانيكا الموائع' },
        { id: 'hydraulics', icon: 'fa-oil-can', en: 'Hydraulic & Pneumatic Systems', ar: 'الأنظمة الهيدروليكية والهوائية' },
        { id: 'dynamics', icon: 'fa-wave-square', en: 'Dynamics & Vibration', ar: 'الديناميكا والاهتزازات والتحكم' }
    ];
    /* the older detailed entries move into the new categories */
    const MAP = {
        transmission: ['gear', 'spur_gear', 'helical_gear', 'bevel_gear', 'worm_gear'],
        design: ['shaft', 'bearing', 'ball_bearing', 'roller_bearing', 'key_keyway', 'coupling', 'mech_seal', 'spring', 'fastener'],
        materials: ['stress', 'strain', 'fos', 'beam_bending', 'buckling', 'pressure_vessel', 'mohr_circle'],
        tolerances: ['tolerance', 'roughness'],
        manufacturing: ['turning', 'milling', 'sheet_metal', 'casting', 'cnc_machining', 'shearing', 'sheet_bending', 'deep_drawing', 'wire_drawing'],
        automotive: ['ic_engine'],
        dynamics: ['torque'],
        fluids: ['centrifugal_pump', 'bernoulli', 'reynolds_number', 'pump_curve', 'hydrostatic_pressure', 'buoyancy', 'drag_force', 'pascal_principle'],
        hydraulics: ['hydraulic_cylinder', 'pneumatics', 'accumulator', 'hydraulic_motor']
    };
    const catOf = {}; Object.keys(MAP).forEach(function (c) { MAP[c].forEach(function (id) { catOf[id] = c; }); });
    const ids = {};
    dictData.forEach(function (e) { e.category = catOf[e.id] || 'design'; ids[e.id] = 1; });
    const slug = function (s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, ''); };
    /* group the new entries by category order of DICT_CATS, keep file order inside */
    window.TERMS_EXTRA.forEach(function (r) {
        let id = slug(r.en); while (ids[id]) id += '_t'; ids[id] = 1;
        dictData.push({ id: id, termEn: r.en, termAr: r.ar, category: r.cat, descEn: r.dEn, descAr: r.dAr, eq: r.eq, light: true });
    });
    /* the material-property terms (ids) belong to their own category */
    const PROPS = ['stress_strain_curve', 'modulus_of_elasticity', 'elastic_deformation', 'plastic_deformation', 'yield_strength', 'ultimate_tensile_strength', 'toughness', 'brittleness', 'ductility', 'hardness_and_toughness', 'mechanical_properties'];
    dictData.forEach(function (e) { if (PROPS.indexOf(e.id) >= 0) e.category = 'matprops'; });
    const order = {}; DICT_CATS.forEach(function (c, i) { order[c.id] = i; });
    dictData.forEach(function (e, i) { e._i = i; });
    dictData.sort(function (a, b) { return (order[a.category] - order[b.category]) || (a._i - b._i); });
    /* cross-links inside the encyclopedia: fill the search box with a term */
    window.encSee = function (q) {
        const s = document.getElementById('search-input'), c = document.getElementById('category-filter');
        if (!s) return false;
        s.value = q; if (c) c.value = 'all';
        if (typeof filterDictionary === 'function') filterDictionary();
        const key = q.toLowerCase(), hs = document.querySelectorAll('#dictionary-list h4');
        let hit = null; hs.forEach(function (h) { if (!hit && h.textContent.toLowerCase().indexOf(key) >= 0) hit = h; });
        const box = hit ? hit.parentNode : s;
        box.scrollIntoView({ block: 'start', behavior: 'smooth' });
        if (hit) { box.style.outline = '2px solid #0284c7'; setTimeout(function () { box.style.outline = ''; }, 1800); }
        return false;
    };
    /* from an encyclopedia entry to a page of the Materials Testing section */
    window.encTest = function (id) {
        if (typeof navigate === 'function' && window.MTestUI) { navigate('mtest'); MTestUI.go(id); }
        return false;
    };
    /* names for the category chips in both languages */
    if (typeof translations !== 'undefined') DICT_CATS.forEach(function (c) { translations.en['cat_' + c.id] = c.en; translations.ar['cat_' + c.id] = c.ar; });
})();
