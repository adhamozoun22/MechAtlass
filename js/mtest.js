/* Materials Testing section (page-mtest): home page with categories and one detail page per test.
   Self-contained: it only reads window.MTEST and renders into #mtest-root; language follows <html lang>. */
(function () {
    'use strict';
    const M = window.MTEST;
    const root = document.getElementById('mtest-root');
    if (!M || !root) return;

    /* the navigation label is registered here so no shared translation file has to change */
    if (typeof translations !== 'undefined') {
        translations.en.nav_mtest = 'Materials Testing';
        translations.ar.nav_mtest = 'اختبارات المواد';
    }

    const state = { view: 'home', cat: 'all', q: '' };
    const lang = function () { return document.documentElement.lang === 'ar' ? 'ar' : 'en'; };
    const L = function (o) { return o ? (o[lang()] || o.en || '') : ''; };
    const esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
    const byId = function (id) { return M.tests.filter(function (x) { return x.id === id; })[0]; };
    const catOf = function (id) { return M.cats.filter(function (c) { return c.id === id; })[0]; };

    const T = {
        en: {
            title: 'Materials Testing', sub: 'How engineers measure the properties of materials: the main tests, each explained in simple words with the apparatus, the specimen, the procedure, equations with the meaning of every symbol, a worked example and the typical mistakes.',
            search: 'Search tests…', all: 'All', open: 'Open the test', none: 'No test matches your search.', back: 'All tests', std: 'Standards',
            gist: 'In one sentence', terms: 'Simple words first', where: 'where', words: 'Basic concepts', purpose: 'What it is for', principle: 'How it works', figures: 'Diagrams', apparatus: 'Apparatus', specimen: 'Specimen', procedure: 'Procedure', results: 'What you obtain',
            eqs: 'Equations and units', example: 'Worked example', pitfalls: 'Sources of error', confuse: 'Do not confuse', apps: 'Engineering applications', related: 'Related tests', refs: 'References',
            prev: 'Previous', next: 'Next', enc: 'Encyclopedia entry', ssLink: 'Explanation of the stress–strain diagram', ssNote: 'The theory of the diagram (stages, true vs engineering values, areas, comparison of materials) is in the encyclopedia, under Mechanical Properties of Materials.', guide: 'Which test answers which question?', count: ' tests',
            gh: ['Question', 'Test'], note: 'Standards and references are listed for orientation; always use the current edition of the standard that applies to your contract or laboratory.',
            guideRows: [['Strength, yield, elongation, E', 'tensile'], ['Strength of a brittle material in use under compression', 'compression'], ['Flexural strength of ceramics, plastics, composites', 'bending'], ['Shear strength of a pin, rivet or plate', 'shear'], ['Shear modulus G, torsional behaviour of shafts', 'torsion'], ['Hardness of castings, forgings, soft and medium metals (big dent)', 'brinell'], ['Hardness of thin parts, hardened layers, tiny areas, any material', 'vickers'], ['Fast hardness check in the workshop, especially hardened steel', 'rockwell'], ['Notch toughness of steel, also in the cold', 'charpy'], ['Notch toughness of plastics', 'izod'], ['Largest crack a part can carry', 'fracture'], ['Life under repeated loading, endurance limit', 'fatigue'], ['Slow stretching and life at high temperature', 'creep']],
        },
        ar: {
            title: 'اختبارات المواد', sub: 'كيف يقيس المهندسون خواص المواد: الاختبارات الأساسية، كل اختبار بشرح مبسّط مع الجهاز والعينة وطريقة الإجراء والمعادلات مع معنى كل رمز ومثال محلول وأشهر الأخطاء.',
            search: 'ابحث في الاختبارات…', all: 'الكل', open: 'افتح الاختبار', none: 'لا يوجد اختبار مطابق لبحثك.', back: 'كل الاختبارات', std: 'المعايير',
            gist: 'بجملة واحدة', terms: 'كلمات بسيطة أولاً', where: 'حيث', words: 'مفاهيم أساسية', purpose: 'الغاية منه', principle: 'كيف يعمل', figures: 'المخططات', apparatus: 'الجهاز', specimen: 'العينة', procedure: 'طريقة الإجراء', results: 'ما نحصل عليه',
            eqs: 'المعادلات والوحدات', example: 'مثال محلول', pitfalls: 'مصادر الخطأ', confuse: 'لا تخلط', apps: 'التطبيقات الهندسية', related: 'اختبارات ذات صلة', refs: 'المراجع',
            prev: 'السابق', next: 'التالي', enc: 'مدخل الموسوعة', ssLink: 'شرح مخطط الإجهاد والانفعال', ssNote: 'نظرية المخطط (المراحل، والقيم الهندسية والحقيقية، والمساحات، ومقارنة المواد) في الموسوعة ضمن «الخواص الميكانيكية للمواد».', guide: 'أي اختبار يجيب عن أي سؤال؟', count: ' اختبار',
            gh: ['السؤال', 'الاختبار'], note: 'المعايير والمراجع مذكورة للاسترشاد؛ استعمل دائماً الإصدار الحالي للمعيار المعتمد في عقدك أو مختبرك.',
            guideRows: null
        }
    };
    T.ar.guideRows = [['المقاومة وحد الخضوع والاستطالة وE', 'tensile'], ['مقاومة مادة قصفة تعمل ضغطاً', 'compression'], ['مقاومة الانحناء للسيراميك واللدائن والمركبات', 'bending'], ['مقاومة القص لوتد أو برشام أو صفيحة', 'shear'], ['معامل القص G وسلوك الأعمدة تحت اللي', 'torsion'], ['صلادة المسبوكات والمطروقات والمعادن الطرية ومتوسطة الصلادة (أثر كبير)', 'brinell'], ['صلادة القطع الرقيقة والطبقات المقسّاة والمساحات الصغيرة ولأي مادة', 'vickers'], ['فحص سريع للصلادة في الورشة خاصة للفولاذ المقسّى', 'rockwell'], ['المتانة مع الشق للفولاذ وفي البرد أيضاً', 'charpy'], ['المتانة مع الشق للدائن', 'izod'], ['أكبر شق تتحمله القطعة', 'fracture'], ['العمر تحت الأحمال المتكررة وحد التحمل', 'fatigue'], ['التمدد البطيء والعمر عند الحرارة المرتفعة', 'creep']];
    /* encyclopedia entries that explain the same topic */
    const ENC = { tensile: 'Tensile test', brinell: 'Hardness', vickers: 'Hardness', rockwell: 'Hardness', charpy: 'Impact test', izod: 'Impact test', fatigue: 'Fatigue test', creep: 'Creep test', fracture: 'Toughness', torsion: 'Shear modulus' };

    /* words that appear in many tests, explained once in plain language */
    const WORDS = [
        [{ en: 'Force F', ar: 'القوة F' }, { en: 'a push or a pull, measured in newtons (N).', ar: 'دفع أو شد، وتُقاس بالنيوتن (N).' }],
        [{ en: 'Stress σ', ar: 'الإجهاد σ' }, { en: 'force divided by the area that carries it (N/mm² = MPa). It tells how hard the material is being loaded, whatever the size of the part.', ar: 'القوة مقسومة على المساحة التي تحملها (N/mm² = MPa). يبيّن مدى شدة تحميل المادة مهما كان حجم القطعة.' }],
        [{ en: 'Strain ε', ar: 'الانفعال ε' }, { en: 'how much the length changes compared with the original length (no unit, or %).', ar: 'مقدار تغيّر الطول مقارنةً بالطول الأصلي (بلا وحدة أو %).' }],
        [{ en: 'Elastic / plastic', ar: 'مرن / لدن' }, { en: 'elastic: the material returns to its shape when the load is removed. Plastic: part of the deformation stays.', ar: 'مرن: تعود المادة إلى شكلها عند إزالة الحمل. لدن: يبقى جزء من التشوه.' }],
        [{ en: 'Yield', ar: 'الخضوع' }, { en: 'the stress at which permanent (plastic) deformation begins.', ar: 'الإجهاد الذي يبدأ عنده التشوه الدائم (اللدن).' }],
        [{ en: 'Strength', ar: 'المقاومة' }, { en: 'the stress a material can carry (yield or ultimate).', ar: 'الإجهاد الذي تتحمله المادة (عند الخضوع أو القصوى).' }],
        [{ en: 'Stiffness (E)', ar: 'الصلابة (E)' }, { en: 'how little the material deforms under load. Steel is about three times stiffer than aluminium.', ar: 'قلة تشوه المادة تحت الحمل. الفولاذ أصلب من الألمنيوم بنحو ثلاث مرات.' }],
        [{ en: 'Hardness', ar: 'الصلادة' }, { en: 'how well the surface resists a dent or a scratch.', ar: 'مدى مقاومة السطح للانغراس أو الخدش.' }],
        [{ en: 'Toughness', ar: 'المتانة' }, { en: 'how much energy the material absorbs before it breaks.', ar: 'مقدار الطاقة التي تمتصها المادة قبل أن تنكسر.' }],
        [{ en: 'Ductile / brittle', ar: 'مطيل / قصف' }, { en: 'ductile: stretches a lot before breaking. Brittle: breaks suddenly with almost no stretching.', ar: 'مطيل: يستطيل كثيراً قبل الكسر. قصف: ينكسر فجأة دون استطالة تقريباً.' }],
        [{ en: 'Specimen', ar: 'العينة' }, { en: 'the standard piece of material that is tested.', ar: 'القطعة القياسية من المادة التي تُختبر.' }],
        [{ en: 'Standard (ASTM, ISO)', ar: 'المعيار (ASTM وISO)' }, { en: 'the official document that fixes the shape of the specimen and the way to test, so that results are comparable.', ar: 'الوثيقة الرسمية التي تحدد شكل العينة وطريقة الاختبار لتكون النتائج قابلة للمقارنة.' }]
    ];

    /* the words inside the diagrams, in Arabic (symbols and numbers stay as they are) */
    const SVGAR = {
 "before": "قبل",
 "after fracture": "بعد الكسر",
 "slope = E = 200 000 MPa": "الميل = E = 200 000 MPa",
 "ductile: barrel": "مطيل: شكل برميل",
 "brittle: shear plane": "قصف: مستوي قص",
 "≈ 30° to the load axis": "≈ 30° مع محور الحمل",
 "bottom face: stretched (tension) · top face: squeezed": "الوجه السفلي مشدود · الوجه العلوي مضغوط",
 "drawn to scale (the bar is 45 × 4 × 3 mm)": "بمقياس رسم (القضيب 45 × 4 × 3 مم)",
 "x along the bar (mm)": "x على طول القضيب (mm)",
 "break": "كسر",
 "slope m = 2025 N/mm": "الميل m = 2025 N/mm",
 "cut 1": "قطع 1",
 "cut 2": "قطع 2",
 "two cuts → the area that resists = 2 × (π d² / 4)": "قطعان ← المساحة المقاومة = 2 × (π d² / 4)",
 "load F at failure (kN), τ = 300 MPa": "قوة الانهيار F (kN) عند τ = 300 MPa",
 "23.6 single": "23.6 مفرد",
 "47.1 double": "47.1 مزدوج",
 "a line drawn along the bar becomes a helix": "الخط المرسوم على القضيب يصبح حلزونياً",
 "θ = angle by which one end turns relative to the other": "θ = الزاوية التي يدورها طرف بالنسبة للآخر",
 "r (mm), 0 = axis, 10 = surface": "r (mm)، 0 = المحور و10 = السطح",
 "τ = 0 on the axis": "τ = 0 على المحور",
 "θ (degrees)": "θ (درجة)",
 "slope ∝ G·J / L": "الميل ∝ G·J / L",
 "under load F": "تحت الحمل F",
 "ball D = 10 mm": "الكرة D = 10 مم",
 "after the load is removed": "بعد إزالة الحمل",
 "depth h ≈ 0.42 mm": "العمق h ≈ 0.42 مم",
 "drawn to scale": "بمقياس رسم",
 "HBW  (D = 10 mm, F = 3000 kgf)": "HBW (D = 10 مم وF = 3000 kgf)",
 "bigger imprint = softer": "أثر أكبر = أطرى",
 "136° between faces": "136° بين الوجهين",
 "depth h ≈ d / 7 = 0.071 mm": "العمق h ≈ d / 7 = 0.071 مم",
 "the imprint from above": "الأثر من الأعلى",
 "HV  (F = 30 kgf = 294.2 N)": "HV (F = 30 kgf = 294.2 N)",
 "① touch": "① تلامس",
 "zero line": "خط الصفر",
 "② minor F₀": "② الحمل الأولي F₀",
 "depth h₀": "العمق h₀",
 "③ + major F₁": "③ + الرئيسي F₁",
 "deepest": "أعمق نقطة",
 "④ remove F₁": "④ إزالة F₁",
 "permanent h": "العمق الدائم h",
 "depths exaggerated (really ~0.1 mm)": "العمق مبالغ فيه (الحقيقي نحو 0.1 مم)",
 "h = permanent depth (mm)": "h = العمق الدائم (mm)",
 "shallower = harder": "أضحل = أصلد",
 "HRC  (valid range about 20 to 70)": "HRC (المدى الصالح نحو 20 إلى 70)",
 "striker hits here": "المطرقة تضرب هنا",
 "span 40 mm": "الباع 40 مم",
 "the notch is on the side AWAY from the striker": "الشق على الجهة البعيدة عن المطرقة",
 "45°   root radius 0.25 mm": "45° ونصف قطر القاعدة 0.25 مم",
 "notch detail": "تفصيل الشق",
 "(magnified 40×)": "(تكبير 40 مرة)",
 "striker": "المطرقة",
 "notch faces the striker": "الشق يواجه المطرقة",
 "clamped in a vise (cantilever)": "مثبّت في ملزمة (كابول)",
 "lowest point": "أدنى نقطة",
 "start (α = 120°)": "البدء (α = 120°)",
 "after break (β ≈ 104.5°)": "بعد الكسر (β ≈ 104.5°)",
 "test temperature (°C)": "درجة حرارة الاختبار (°م)",
 "KV (J)  — illustrative curve": "KV (J) — منحنى توضيحي",
 "brittle: low energy": "قصف: طاقة منخفضة",
 "ductile: high energy": "مطيل: طاقة عالية",
 "cycles": "دورات",
 "log₁₀ N  (cycles)": "log₁₀ N (دورات)",
 "σ_a (MPa) — illustrative": "σ_a (MPa) — توضيحي",
 "S_e = 250 (steel, knee at 10⁶)": "S_e = 250 (فولاذ، الركبة عند 10⁶)",
 "aluminium: keeps falling": "الألمنيوم: يواصل الانخفاض",
 "working point (80, 160)": "نقطة التشغيل (80، 160)",
 "on the line (100, 200): n = 200/160 = 1.25": "على الخط (100، 200): n = 200/160 = 1.25",
 "t (hours)": "t (ساعة)",
 "ε (%) — illustrative": "ε (%) — توضيحي",
 "II  steady: slope = ε̇_s": "II مستقر: الميل = ε̇_s",
 "dashed: higher stress or T": "المتقطع: إجهاد أو حرارة أعلى",
 "log₁₀ t_r  (t_r in hours), P = 20 700": "log₁₀ t_r (t_r بالساعة)، P = 20 700",
 "machined notch": "شق مشغَّل",
 "fatigue crack": "شق كلل",
 "(thickness)": "(السماكة)",
 "v (mm), illustrative record": "v (mm) — سجل توضيحي",
 "dotted: initial slope": "منقط: الميل الأولي",
 "dashed: 0.95 × initial slope": "متقطع: 0.95 × الميل الأولي",
 "a = crack length (mm)": "a = طول الشق (mm)",
 "K_I (MPa·√m), σ = 300 MPa": "K_I (MPa·√m) عند σ = 300 MPa",
 "P_max = 21: P_max / P_Q = 1.05 ≤ 1.10 ✓": "P_max = 21: P_max / P_Q = 1.05 ≤ 1.10 ✓"
};
    const svgL = function (svg) { return lang() === 'ar' ? svg.replace(/(<text[^>]*>)([^<]*)(<\/text>)/g, function (a, o, t, c) { return SVGAR[t] ? o + SVGAR[t] + c : a; }) : svg; };

    const card = 'bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700';
    const h3 = function (s) { return '<h3 class="font-bold text-lg mb-2 text-primary-600 dark:text-primary-400">' + esc(s) + '</h3>'; };
    const para = function (o) { return '<p class="text-sm leading-relaxed text-gray-700 dark:text-gray-300">' + esc(L(o)) + '</p>'; };
    const list = function (arr, ordered) {
        const tag = ordered ? 'ol' : 'ul';
        return '<' + tag + ' class="text-sm leading-relaxed text-gray-700 dark:text-gray-300 space-y-1.5" style="padding-inline-start:1.4rem;list-style:' + (ordered ? 'decimal' : 'disc') + '">' + arr.map(function (x) { return '<li>' + esc(L(x)) + '</li>'; }).join('') + '</' + tag + '>';
    };
    const eqBox = function (s) { return '<div dir="ltr" class="bg-blue-50 dark:bg-gray-700 px-3 py-2 rounded-md font-mono text-base text-blue-800 dark:text-blue-300" style="overflow-x:auto;text-align:left;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.7">' + esc(s) + '</div>'; };
    const varsBox = function (v, tx) {
        if (!v || !v.length) return '';
        return '<div class="mt-2 text-sm"><div class="text-xs font-semibold text-gray-500 mb-1">' + esc(tx.where) + ':</div><table class="w-full"><tbody>' + v.map(function (r) { return '<tr class="align-top"><td class="py-0.5 pe-3 font-mono whitespace-nowrap" dir="ltr" style="text-align:start">' + esc(r[0]) + '</td><td class="py-0.5 text-gray-700 dark:text-gray-300">' + esc(L(r[1])) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    };
    const eqBlock = function (e, tx) { return '<div class="mb-4 last:mb-0 pb-4 last:pb-0 border-b last:border-b-0 border-gray-100 dark:border-gray-700"><div class="text-sm font-semibold mb-1">' + esc(L(e.l)) + '</div>' + eqBox(e.e) + varsBox(e.v, tx) + (L(e.n) ? '<div class="text-xs text-gray-600 dark:text-gray-400 mt-2">' + esc(L(e.n)) + '</div>' : '') + '</div>'; };
    const termsBlock = function (arr, tx) { return '<div class="' + card + '" style="border-inline-start:4px solid #f59e0b">' + h3(tx.terms) + '<dl class="text-sm space-y-1.5">' + arr.map(function (r) { return '<div><dt class="font-semibold inline">' + esc(L(r[0])) + ': </dt><dd class="inline text-gray-700 dark:text-gray-300">' + esc(L(r[1])) + '</dd></div>'; }).join('') + '</dl></div>'; };

    function chips(tx) {
        const mk = function (id, label) {
            const on = state.cat === id;
            return '<button type="button" data-mt-cat="' + id + '" aria-pressed="' + on + '" class="px-3 py-1.5 rounded-full text-sm font-medium border ' + (on ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700') + '">' + esc(label) + '</button>';
        };
        return '<div class="flex flex-wrap gap-2 mb-5" role="group">' + mk('all', tx.all) + M.cats.map(function (c) { return mk(c.id, L(c.name)); }).join('') + '</div>';
    }

    function homeHtml() {
        const tx = T[lang()], q = state.q.trim().toLowerCase();
        const match = function (x) {
            if (state.cat !== 'all' && x.cat !== state.cat) return false;
            if (!q) return true;
            return (x.name.en + ' ' + x.name.ar + ' ' + x.short.en + ' ' + x.short.ar + ' ' + x.std + ' ' + L(x.gist)).toLowerCase().indexOf(q) >= 0;
        };
        const shown = M.tests.filter(match);
        let h = '<div class="mb-6"><h2 class="text-3xl font-bold mb-2">' + esc(tx.title) + '</h2><p class="text-gray-600 dark:text-gray-400 max-w-3xl">' + esc(tx.sub) + '</p></div>';
        if (window.MTVideo) h += window.MTVideo.topHtml();
        h += '<div class="mb-4"><input id="mtest-search" type="search" value="' + esc(state.q) + '" placeholder="' + esc(tx.search) + '" aria-label="' + esc(tx.search) + '" class="w-full sm:w-80 px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"></div>';
        h += chips(tx);
        h += '<div class="text-sm text-gray-500 mb-3" aria-live="polite">' + shown.length + esc(tx.count) + '</div>';
        if (!shown.length) h += '<p class="text-gray-500 py-8">' + esc(tx.none) + '</p>';
        M.cats.forEach(function (c) {
            const rows = shown.filter(function (x) { return x.cat === c.id; });
            if (!rows.length) return;
            h += '<div class="mb-8"><div class="flex items-center gap-2 mb-1"><i class="fa-solid ' + c.icon + ' text-primary-600 dark:text-primary-400"></i><h3 class="text-xl font-bold">' + esc(L(c.name)) + '</h3></div><p class="text-sm text-gray-500 mb-3">' + esc(L(c.desc)) + '</p>';
            h += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">' + rows.map(function (x) {
                return '<div class="' + card + ' flex flex-col"><div class="flex items-center gap-3 mb-2"><div class="w-10 h-10 rounded-lg bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0"><i class="fa-solid ' + x.icon + '"></i></div><h4 class="font-bold text-lg leading-snug">' + esc(L(x.name)) + '</h4></div>' +
                    '<p class="text-sm text-gray-600 dark:text-gray-300 mb-2 flex-grow">' + esc(L(x.short)) + '</p><p class="text-xs text-gray-500 mb-3" dir="ltr" style="text-align:start">' + esc(x.std) + '</p>' +
                    '<button type="button" data-mt-open="' + x.id + '" class="self-start text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">' + esc(tx.open) + ' <i class="fa-solid fa-arrow-right rtl:rotate-180"></i></button></div>';
            }).join('') + '</div></div>';
        });
        /* simple words */
        h += '<div class="' + card + ' mt-4"><h3 class="font-bold text-lg mb-3">' + esc(tx.words) + '</h3><dl class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">' + WORDS.map(function (w) { return '<div><dt class="font-semibold inline">' + esc(L(w[0])) + ': </dt><dd class="inline text-gray-700 dark:text-gray-300">' + esc(L(w[1])) + '</dd></div>'; }).join('') + '</dl></div>';
        /* decision guide */
        h += '<div class="' + card + ' mt-4"><h3 class="font-bold text-lg mb-3">' + esc(tx.guide) + '</h3><div style="overflow-x:auto"><table class="w-full text-sm"><thead><tr class="text-start border-b border-gray-200 dark:border-gray-700"><th class="py-2 pe-3 text-start">' + esc(tx.gh[0]) + '</th><th class="py-2 text-start">' + esc(tx.gh[1]) + '</th></tr></thead><tbody>' +
            tx.guideRows.map(function (r) { const x = byId(r[1]); return '<tr class="border-b border-gray-100 dark:border-gray-700"><td class="py-2 pe-3">' + esc(r[0]) + '</td><td class="py-2"><button type="button" data-mt-open="' + r[1] + '" class="text-primary-600 dark:text-primary-400 hover:underline text-start">' + esc(L(x.name)) + '</button></td></tr>'; }).join('') + '</tbody></table></div></div>';
        h += '<p class="text-xs text-gray-500 mt-4">' + esc(tx.note) + '</p>';
        return h;
    }

    function detailHtml(x) {
        const tx = T[lang()], i = M.tests.indexOf(x), prev = M.tests[i - 1], next = M.tests[i + 1], c = catOf(x.cat);
        let h = '<button type="button" data-mt-home="1" class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline mb-4"><i class="fa-solid fa-arrow-left rtl:rotate-180"></i> ' + esc(tx.back) + '</button>';
        h += '<div class="mb-5"><div class="text-xs text-gray-500 mb-1">' + esc(L(c.name)) + ' · ' + (i + 1) + '/' + M.tests.length + '</div><h2 class="text-3xl font-bold mb-2"><i class="fa-solid ' + x.icon + ' text-primary-600 dark:text-primary-400"></i> ' + esc(L(x.name)) + '</h2>' +
            '<p class="text-xs text-gray-500" dir="ltr" style="text-align:start"><b>' + esc(tx.std) + ':</b> ' + esc(x.std) + '</p></div>';
        h += '<div class="space-y-4">';
        h += '<div class="' + card + '" style="border-inline-start:4px solid #2563eb"><div class="text-xs font-semibold text-gray-500 mb-1">' + esc(tx.gist) + '</div><p class="text-base font-medium leading-relaxed">' + esc(L(x.gist)) + '</p></div>';
        h += termsBlock(x.terms, tx);
        h += '<div class="' + card + '">' + h3(tx.purpose) + para(x.purpose) + '</div>';
        h += '<div class="' + card + '">' + h3(tx.principle) + para(x.principle) + '</div>';
        if (x.figs && x.figs.length) h += '<div class="' + card + '">' + h3(tx.figures) + x.figs.map(function (f) { return '<figure class="mb-4 last:mb-0" style="margin:0 0 1rem"><div class="rounded-lg bg-gray-50 dark:bg-gray-900 p-2" dir="ltr">' + svgL(f.svg || (window.MT_SVG && window.MT_SVG[f.k]) || '') + '</div><figcaption class="text-xs text-gray-600 dark:text-gray-400 mt-1">' + esc(L(f.cap)) + '</figcaption></figure>'; }).join('') + '</div>';
        h += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="' + card + '">' + h3(tx.apparatus) + para(x.apparatus) + '</div><div class="' + card + '">' + h3(tx.specimen) + para(x.specimen) + '</div></div>';
        h += '<div class="' + card + '">' + h3(tx.procedure) + list(x.procedure, true) + '</div>';
        if (window.MTVideo && window.MTVideo.has(x.id)) h += window.MTVideo.cardHtml(x.id, card, h3);
        h += '<div class="' + card + '">' + h3(tx.results) + para(x.results) + '</div>';
        if (x.id === 'tensile') h += '<div class="' + card + '"><button type="button" data-mt-enc="Stress–strain curve" class="px-3 py-1.5 rounded-md text-sm font-medium bg-primary-600 text-white hover:bg-primary-700"><i class="fa-solid fa-book"></i> ' + esc(tx.ssLink) + '</button></div>';
        h += '<div class="' + card + '">' + h3(tx.eqs) + x.eqs.map(function (e) { return eqBlock(e, tx); }).join('') + '</div>';
        h += '<div class="' + card + '" style="border-inline-start:4px solid #2563eb">' + h3(L(x.example.title)) + list(x.example.steps, true) + '<p class="text-sm font-semibold mt-3 text-gray-800 dark:text-gray-100">= ' + esc(L(x.example.result)) + '</p></div>';
        h += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="' + card + '">' + h3(tx.pitfalls) + list(x.pitfalls, false) + '</div><div class="' + card + '" style="border-inline-start:4px solid #f59e0b">' + h3(tx.confuse) + para(x.notConfuse) + '</div></div>';
        h += '<div class="' + card + '">' + h3(tx.apps) + list(x.apps, false) + '</div>';
        h += '<div class="' + card + '">' + h3(tx.related) + '<div class="flex flex-wrap gap-2">' + x.see.map(function (id) { const r = byId(id); return r ? '<button type="button" data-mt-open="' + id + '" class="px-3 py-1.5 rounded-full text-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">' + esc(L(r.name)) + '</button>' : ''; }).join('') + (ENC[x.id] ? '<button type="button" data-mt-enc="' + esc(ENC[x.id]) + '" class="px-3 py-1.5 rounded-full text-sm border border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700"><i class="fa-solid fa-book"></i> ' + esc(tx.enc) + '</button>' : '') + '</div></div>';
        h += '</div>';
        h += '<div class="flex justify-between gap-3 mt-6">' +
            (prev ? '<button type="button" data-mt-open="' + prev.id + '" class="text-sm text-primary-600 dark:text-primary-400 hover:underline text-start"><i class="fa-solid fa-arrow-left rtl:rotate-180"></i> ' + esc(tx.prev) + ': ' + esc(L(prev.name)) + '</button>' : '<span></span>') +
            (next ? '<button type="button" data-mt-open="' + next.id + '" class="text-sm text-primary-600 dark:text-primary-400 hover:underline text-end">' + esc(tx.next) + ': ' + esc(L(next.name)) + ' <i class="fa-solid fa-arrow-right rtl:rotate-180"></i></button>' : '<span></span>') + '</div>';
        return h;
    }

    function render(keepSearchFocus) {
        const x = state.view === 'home' ? null : byId(state.view);
        root.innerHTML = x ? detailHtml(x) : homeHtml();
        if (window.MTVideo) window.MTVideo.after();
        if (keepSearchFocus) { const s = document.getElementById('mtest-search'); if (s) { s.focus(); const n = s.value.length; try { s.setSelectionRange(n, n); } catch (e) {} } }
    }
    function go(view) { state.view = view; render(); window.scrollTo({ top: 0 }); }

    root.addEventListener('click', function (ev) {
        const b = ev.target.closest('button'); if (!b) return;
        if (b.hasAttribute('data-mt-open')) go(b.getAttribute('data-mt-open'));
        else if (b.hasAttribute('data-mt-home')) go('home');
        else if (b.hasAttribute('data-mt-cat')) { state.cat = b.getAttribute('data-mt-cat'); render(); }
        else if (b.hasAttribute('data-mt-enc')) { if (typeof navigate === 'function' && window.encSee) { navigate('encyclopedia'); window.encSee(b.getAttribute('data-mt-enc')); } }
    });
    root.addEventListener('input', function (ev) { if (ev.target.id === 'mtest-search') { state.q = ev.target.value; render(true); } });

    /* language switch: <html lang> changes -> redraw in the new language */
    new MutationObserver(function () { render(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    window.MTestUI = { go: go, render: render, state: state };
    render();
})();
