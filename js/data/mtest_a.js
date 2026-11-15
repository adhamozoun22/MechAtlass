/* Materials Testing section: content, part A: static strength tests. Generated from the reviewed source; figures are referenced by key and resolved from window.MT_SVG. */
(function () {
    'use strict';
    const M = window.MTEST = window.MTEST || { cats: [], tests: [] };
M.cats = [
 {
  "id": "static",
  "icon": "fa-weight-hanging",
  "name": {
   "en": "Static strength tests",
   "ar": "اختبارات المقاومة الساكنة"
  },
  "desc": {
   "en": "Load applied slowly in one direction until deformation or fracture.",
   "ar": "حمل يُطبَّق ببطء في اتجاه واحد حتى التشوه أو الكسر."
  }
 },
 {
  "id": "hardness",
  "icon": "fa-hammer",
  "name": {
   "en": "Hardness testing",
   "ar": "اختبار الصلادة"
  },
  "desc": {
   "en": "Resistance of the surface to a local permanent indentation.",
   "ar": "مقاومة السطح لانغراس دائم موضعي."
  }
 },
 {
  "id": "toughness",
  "icon": "fa-bolt",
  "name": {
   "en": "Toughness and fracture",
   "ar": "المتانة والكسر"
  },
  "desc": {
   "en": "Energy absorbed in fracture and resistance of cracked bodies.",
   "ar": "الطاقة الممتصة عند الكسر ومقاومة الأجسام المشققة."
  }
 },
 {
  "id": "longterm",
  "icon": "fa-clock",
  "name": {
   "en": "Long-term loading",
   "ar": "التحميل طويل الأمد"
  },
  "desc": {
   "en": "Repeated loads (fatigue) and constant load at high temperature (creep).",
   "ar": "أحمال متكررة (الكلل) وحمل ثابت عند حرارة مرتفعة (الزحف)."
  }
 }
];
M.tests.push({
 "id": "tensile",
 "cat": "static",
 "icon": "fa-arrows-left-right",
 "name": {
  "en": "Tensile test",
  "ar": "اختبار الشد"
 },
 "short": {
  "en": "Pull a bar until it breaks: gives strength, stiffness and how much the metal stretches.",
  "ar": "شدّ قضيب حتى ينكسر: يعطي المقاومة والصلابة ومقدار استطالة المعدن."
 },
 "gist": {
  "en": "Pull a bar until it breaks, and record how much force it needs and how much it stretches.",
  "ar": "نشدّ قضيباً حتى ينكسر ونسجّل القوة التي يحتاجها ومقدار استطالته."
 },
 "std": "ASTM E8/E8M · ISO 6892-1",
 "purpose": {
  "en": "This is the most important test for metals. One pull tells us how strong the metal is, how stiff it is and how much it can stretch before it breaks. Almost every design calculation uses these numbers.",
  "ar": "هذا أهم اختبار للمعادن. شدّة واحدة تخبرنا كم المعدن قوي، وكم هو صلب، وكم يستطيع أن يستطيل قبل أن ينكسر. وتستعمل حسابات التصميم كلها تقريباً هذه الأرقام."
 },
 "principle": {
  "en": "A bar of standard shape is gripped at both ends in a testing machine and pulled slowly. The machine measures the force F, and a small gauge on the bar measures how much a marked length grows (ΔL). We then divide the force by the bar cross-section to get the stress σ, and divide the growth by the marked length to get the strain ε. Plotting σ against ε gives the stress–strain curve.",
  "ar": "يُثبَّت قضيب بشكل قياسي من طرفيه في آلة اختبار ويُشدّ ببطء. تقيس الآلة القوة F، ويقيس مقياس صغير على القضيب مقدار نمو طول مُعلَّم (ΔL). ثم نقسم القوة على مساحة مقطع القضيب فنحصل على الإجهاد σ، ونقسم النمو على الطول المُعلَّم فنحصل على الانفعال ε. ورسم σ مقابل ε يعطي منحنى الإجهاد والانفعال."
 },
 "apparatus": {
  "en": "A universal testing machine (it can pull and push), two grips, a load cell that measures the force, and an extensometer, a small clip-on gauge that measures the stretch.",
  "ar": "آلة اختبار شاملة (تشدّ وتضغط)، وفكّان للإمساك، وخلية حمل تقيس القوة، ومقياس استطالة (extensometer) وهو مقياس صغير يُثبَّت على العينة ليقيس التمدد."
 },
 "specimen": {
  "en": "A \"dog-bone\" bar: thick ends for the grips and a thinner straight middle, so that the bar breaks in the middle where we measure. Standard round bar (ASTM E8): diameter 12.5 mm with a marked length of 50 mm. Two marks are punched 50 mm apart before the test (the gauge length L₀).",
  "ar": "قضيب على شكل «عظمة كلب»: طرفان سميكان للإمساك وجزء أوسط أنحف مستقيم، كي ينكسر القضيب في الوسط حيث نقيس. القضيب الدائري القياسي (ASTM E8): قطره 12.5 مم وطوله المُعلَّم 50 مم. تُوسَم علامتان تبعدان 50 مم قبل الاختبار (الطول القياسي L₀)."
 },
 "procedure": [
  {
   "en": "Measure the diameter d₀ and calculate the area A₀. Mark the length L₀ on the bar.",
   "ar": "قِس القطر d₀ واحسب المساحة A₀، وعلِّم الطول L₀ على القضيب."
  },
  {
   "en": "Fix the bar straight in the grips (a crooked bar bends and gives a wrong result) and clip on the extensometer.",
   "ar": "ثبّت القضيب مستقيماً في الفكّين (القضيب المائل ينحني ويعطي نتيجة خاطئة) وركّب مقياس الاستطالة."
  },
  {
   "en": "Pull slowly at the speed the standard asks for, while the machine records F and ΔL.",
   "ar": "اشدّ ببطء بالسرعة التي يطلبها المعيار، والآلة تسجّل F وΔL."
  },
  {
   "en": "Keep pulling through yielding and necking (the bar gets thin at one place) until it breaks.",
   "ar": "تابع الشد عبر الخضوع والتخصّر (يصبح القضيب رفيعاً في مكان واحد) حتى ينكسر."
  },
  {
   "en": "Put the two broken halves together and measure the final length L_f and the smallest diameter d_f.",
   "ar": "ضمّ نصفي القضيب المكسور وقِس الطول النهائي L_f وأصغر قطر d_f."
  },
  {
   "en": "Convert the record to a σ–ε curve and read the properties from it.",
   "ar": "حوّل السجل إلى منحنى σ–ε واقرأ الخواص منه."
  }
 ],
 "results": {
  "en": "From the curve we read: E (stiffness), σ_y (the stress where permanent stretching starts), σ_u (the highest stress the bar carries), %EL (how much it stretched, in %) and %RA (how much its thickness shrank at the break, in %).",
  "ar": "نقرأ من المنحنى: E (الصلابة)، وσ_y (الإجهاد الذي يبدأ عنده الاستطالة الدائمة)، وσ_u (أعلى إجهاد يتحمله القضيب)، و%EL (مقدار الاستطالة بالنسبة المئوية)، و%RA (مقدار نقص السماكة عند الكسر بالنسبة المئوية)."
 },
 "terms": [
  [
   {
    "en": "Stress σ",
    "ar": "الإجهاد σ"
   },
   {
    "en": "force divided by the area that carries it. Unit: MPa (= N/mm²).",
    "ar": "القوة مقسومة على المساحة التي تحملها. الوحدة: MPa (= N/mm²)."
   }
  ],
  [
   {
    "en": "Strain ε",
    "ar": "الانفعال ε"
   },
   {
    "en": "how much the length grew compared with the original length. No unit (or %).",
    "ar": "مقدار نمو الطول مقارنةً بالطول الأصلي. بلا وحدة (أو %)."
   }
  ],
  [
   {
    "en": "Elastic",
    "ar": "مرن"
   },
   {
    "en": "the bar returns to its shape when the force is removed.",
    "ar": "يعود القضيب إلى شكله عند إزالة القوة."
   }
  ],
  [
   {
    "en": "Yield",
    "ar": "الخضوع"
   },
   {
    "en": "the point after which the stretching stays even if the force is removed.",
    "ar": "النقطة التي بعدها يبقى التمدد حتى لو أُزيلت القوة."
   }
  ],
  [
   {
    "en": "Necking",
    "ar": "التخصّر"
   },
   {
    "en": "the bar becomes thin at one place just before it breaks.",
    "ar": "يصبح القضيب رفيعاً في مكان واحد قبل الكسر مباشرة."
   }
  ],
  [
   {
    "en": "Ductile",
    "ar": "مطيل"
   },
   {
    "en": "stretches a lot before breaking (e.g. mild steel, copper).",
    "ar": "يستطيل كثيراً قبل الكسر (مثل الفولاذ الطري والنحاس)."
   }
  ]
 ],
 "eqs": [
  {
   "l": {
    "en": "Area of a round bar",
    "ar": "مساحة قضيب دائري"
   },
   "e": "A₀ = π · d₀² / 4",
   "v": [
    [
     "A₀",
     {
      "en": "original cross-section area (mm²)",
      "ar": "مساحة المقطع الأصلية (mm²)"
     }
    ],
    [
     "d₀",
     {
      "en": "original diameter (mm)",
      "ar": "القطر الأصلي (mm)"
     }
    ]
   ],
   "n": {
    "en": "Example: d₀ = 12.5 mm → A₀ = 122.7 mm².",
    "ar": "مثال: d₀ = 12.5 مم ← A₀ = 122.7 mm²."
   }
  },
  {
   "l": {
    "en": "Stress",
    "ar": "الإجهاد"
   },
   "e": "σ = F / A₀",
   "v": [
    [
     "σ",
     {
      "en": "stress (MPa)",
      "ar": "الإجهاد (MPa)"
     }
    ],
    [
     "F",
     {
      "en": "force (N)",
      "ar": "القوة (N)"
     }
    ],
    [
     "A₀",
     {
      "en": "original area (mm²)",
      "ar": "المساحة الأصلية (mm²)"
     }
    ]
   ],
   "n": {
    "en": "N divided by mm² gives MPa directly.",
    "ar": "قسمة N على mm² تعطي MPa مباشرة."
   }
  },
  {
   "l": {
    "en": "Strain",
    "ar": "الانفعال"
   },
   "e": "ε = ΔL / L₀      with   ΔL = L − L₀",
   "v": [
    [
     "ε",
     {
      "en": "strain (no unit; × 100 for %)",
      "ar": "الانفعال (بلا وحدة؛ × 100 للنسبة المئوية)"
     }
    ],
    [
     "ΔL",
     {
      "en": "increase in the marked length (mm)",
      "ar": "الزيادة في الطول المُعلَّم (mm)"
     }
    ],
    [
     "L₀",
     {
      "en": "original marked length (mm)",
      "ar": "الطول المُعلَّم الأصلي (mm)"
     }
    ],
    [
     "L",
     {
      "en": "marked length now (mm)",
      "ar": "الطول المُعلَّم الحالي (mm)"
     }
    ]
   ],
   "n": {
    "en": "",
    "ar": ""
   }
  },
  {
   "l": {
    "en": "Stiffness (modulus of elasticity)",
    "ar": "الصلابة (معامل المرونة)"
   },
   "e": "E = σ / ε      (in the straight part only)",
   "v": [
    [
     "E",
     {
      "en": "modulus of elasticity (MPa or GPa)",
      "ar": "معامل المرونة (MPa أو GPa)"
     }
    ]
   ],
   "n": {
    "en": "E is the slope of the straight part. Steel ≈ 200 GPa, aluminium ≈ 70 GPa.",
    "ar": "E هو ميل الجزء المستقيم. الفولاذ ≈ 200 GPa والألمنيوم ≈ 70 GPa."
   }
  },
  {
   "l": {
    "en": "Elongation (how much it stretched)",
    "ar": "الاستطالة (مقدار التمدد)"
   },
   "e": "%EL = (L_f − L₀) / L₀ × 100",
   "v": [
    [
     "L_f",
     {
      "en": "length between the marks after the break (mm)",
      "ar": "الطول بين العلامتين بعد الكسر (mm)"
     }
    ]
   ],
   "n": {
    "en": "Always quote the gauge length used (for example 50 mm).",
    "ar": "اذكر دائماً الطول القياسي المستعمل (مثل 50 مم)."
   }
  },
  {
   "l": {
    "en": "Reduction of area (how thin the neck became)",
    "ar": "نقص المقطع (مدى رقّة العنق)"
   },
   "e": "%RA = (A₀ − A_f) / A₀ × 100      with   A_f = π · d_f² / 4",
   "v": [
    [
     "A_f",
     {
      "en": "smallest area at the break (mm²)",
      "ar": "أصغر مساحة عند الكسر (mm²)"
     }
    ],
    [
     "d_f",
     {
      "en": "smallest diameter at the break (mm)",
      "ar": "أصغر قطر عند الكسر (mm)"
     }
    ]
   ],
   "n": {
    "en": "",
    "ar": ""
   }
  },
  {
   "l": {
    "en": "True stress (only until necking starts)",
    "ar": "الإجهاد الحقيقي (حتى بدء التخصّر فقط)"
   },
   "e": "σ_true = σ · (1 + ε)",
   "v": [
    [
     "σ_true",
     {
      "en": "force divided by the real (smaller) area (MPa)",
      "ar": "القوة مقسومة على المساحة الفعلية الأصغر (MPa)"
     }
    ]
   ],
   "n": {
    "en": "Because the bar gets thinner as it stretches.",
    "ar": "لأن القضيب يصبح أنحف كلما استطال."
   }
  },
  {
   "l": {
    "en": "True strain (only until necking starts)",
    "ar": "الانفعال الحقيقي (حتى بدء التخصّر فقط)"
   },
   "e": "ε_true = ln(1 + ε)",
   "v": [
    [
     "ln",
     {
      "en": "natural logarithm",
      "ar": "اللوغاريتم الطبيعي"
     }
    ]
   ],
   "n": {
    "en": "",
    "ar": ""
   }
  }
 ],
 "example": {
  "title": {
   "en": "Worked example: mild steel round bar",
   "ar": "مثال محلول: قضيب فولاذ طري دائري"
  },
  "steps": [
   {
    "en": "Specimen d₀ = 12.5 mm → A₀ = π·12.5²/4 = 122.7 mm²; L₀ = 50 mm.",
    "ar": "العينة d₀ = 12.5 مم ← A₀ = π·12.5²/4 = 122.7 mm²؛ L₀ = 50 مم."
   },
   {
    "en": "Yield load 44.2 kN → σ_y = 44 200 / 122.7 = 360 MPa.",
    "ar": "حمل الخضوع 44.2 kN ← σ_y = 44 200 / 122.7 = 360 MPa."
   },
   {
    "en": "Maximum load 66.3 kN → σ_u = 66 300 / 122.7 = 540 MPa.",
    "ar": "الحمل الأقصى 66.3 kN ← σ_u = 66 300 / 122.7 = 540 MPa."
   },
   {
    "en": "After fracture L_f = 62.5 mm → %EL = (62.5 − 50)/50 × 100 = 25 %.",
    "ar": "بعد الكسر L_f = 62.5 مم ← %EL = (62.5 − 50)/50 × 100 = 25%."
   },
   {
    "en": "Neck diameter d_f = 8.0 mm → A_f = 50.3 mm² → %RA = (122.7 − 50.3)/122.7 × 100 = 59 %.",
    "ar": "قطر العنق d_f = 8.0 مم ← A_f = 50.3 mm² ← %RA = (122.7 − 50.3)/122.7 × 100 = 59%."
   }
  ],
  "result": {
   "en": "σ_y = 360 MPa, σ_u = 540 MPa, %EL = 25 %, %RA = 59 % — a ductile steel (the ratio σ_y/σ_u = 0.67).",
   "ar": "σ_y = 360 MPa وσ_u = 540 MPa و%EL = 25% و%RA = 59% — فولاذ مطيل (النسبة σ_y/σ_u = 0.67)."
  }
 },
 "pitfalls": [
  {
   "en": "Misalignment adds bending and lowers the apparent strength.",
   "ar": "سوء المحاذاة يضيف انحناءً ويخفض المقاومة الظاهرية."
  },
  {
   "en": "Crosshead displacement includes machine and grip compliance, so E from it is too low — use an extensometer.",
   "ar": "إزاحة الرأس تشمل مرونة الآلة والفكوك فيأتي E منها منخفضاً — استعمل مقياس استطالة."
  },
  {
   "en": "Elongation depends on gauge length and specimen shape; compare only like with like.",
   "ar": "تعتمد الاستطالة على الطول القياسي وشكل العينة؛ قارن المتماثل فقط."
  },
  {
   "en": "Results depend on strain rate and temperature.",
   "ar": "تعتمد النتائج على معدل الانفعال والحرارة."
  },
  {
   "en": "After necking the stress is no longer uniform, so the engineering curve falling does not mean the metal is weakening.",
   "ar": "بعد التخصر لا يبقى الإجهاد منتظماً، فهبوط المنحنى الهندسي لا يعني أن المعدن يضعف."
  }
 ],
 "notConfuse": {
  "en": "Strength (σ_u, a stress) is not stiffness (E) and not toughness (the energy needed to break). A material can be strong but not stiff, or stiff but brittle.",
  "ar": "المقاومة (σ_u وهي إجهاد) ليست الصلابة (E) وليست المتانة (الطاقة اللازمة للكسر). فقد تكون المادة قوية وليست صلبة، أو صلبة لكنها قصفة."
 },
 "apps": [
  {
   "en": "Material certification and acceptance of steel bars, plates and bolts.",
   "ar": "اعتماد المواد وقبول قضبان الفولاذ والصفائح والمسامير."
  },
  {
   "en": "Supplying σ_y and σ_u to strength and safety-factor calculations.",
   "ar": "تزويد حسابات المقاومة وعامل الأمان بـ σ_y وσ_u."
  },
  {
   "en": "Quality control of welds and heat treatment; comparing materials for selection.",
   "ar": "ضبط جودة اللحام والمعالجة الحرارية؛ والمفاضلة بين المواد عند الاختيار."
  }
 ],
 "figs": [
  {
   "k": "tensileSpecimen",
   "cap": {
    "en": "The standard round bar drawn to scale (d₀ = 12.5 mm, marked length 50 mm), before the test (top) and after the break with the neck (bottom).",
    "ar": "القضيب الدائري القياسي مرسوماً بمقياس رسم (d₀ = 12.5 مم والطول المُعلَّم 50 مم) قبل الاختبار (أعلى) وبعد الكسر مع العنق (أسفل)."
   }
  },
  {
   "k": "tensileElastic",
   "cap": {
    "en": "A zoom on the first 0.5 % of strain, plotted from the test data: the elastic part is a straight line whose slope is E = 200 000 MPa (200 GPa). The line ends at the yield point (0.18 %, 360 MPa).",
    "ar": "تكبير لأول 0.5% من الانفعال مرسوماً من بيانات الاختبار: الجزء المرن خط مستقيم ميله E = 200 000 MPa (200 GPa). وينتهي الخط عند نقطة الخضوع (0.18% و360 MPa)."
   }
  },
  {
   "k": "tensileCurve",
   "cap": {
    "en": "The whole curve plotted from the same test data: yield Y, the highest point U (ultimate strength) and the break F. The straight part looks vertical because the scale is very different from the zoom above.",
    "ar": "المنحنى كاملاً مرسوماً من بيانات الاختبار نفسها: الخضوع Y وأعلى نقطة U (أقصى مقاومة) والكسر F. ويبدو الجزء المستقيم رأسياً لأن المقياس يختلف كثيراً عن التكبير أعلاه."
   }
  }
 ],
 "see": [
  "compression",
  "bending",
  "fracture"
 ]
});
M.tests.push({
 "id": "compression",
 "cat": "static",
 "icon": "fa-compress",
 "name": {
  "en": "Compression test",
  "ar": "اختبار الضغط"
 },
 "short": {
  "en": "Squash a short bar; the key test for concrete, cast iron and other brittle materials.",
  "ar": "ضغط قضيب قصير؛ الاختبار الأساسي للخرسانة وحديد الزهر والمواد القصفة."
 },
 "gist": {
  "en": "Squash a short bar and record the force it can carry.",
  "ar": "نضغط قضيباً قصيراً ونسجّل القوة التي يتحملها."
 },
 "std": "ASTM E9 (metals) · ASTM C39 (concrete cylinders)",
 "purpose": {
  "en": "Some materials, such as concrete and cast iron, are weak when pulled but strong when squeezed, and they are used under squeezing loads. This test tells us how much squeezing force they can take.",
  "ar": "بعض المواد، كالخرسانة وحديد الزهر، ضعيفة عند الشد وقوية عند الضغط، وتُستعمل تحت أحمال ضاغطة. يبيّن هذا الاختبار مقدار قوة الضغط التي تتحملها."
 },
 "principle": {
  "en": "A short bar is placed between two flat plates and squeezed. We record the force and the shortening, and calculate the stress σ_c = F / A₀ in the same way as in the tensile test. A ductile metal does not break: it gets shorter and fatter, like a barrel. A brittle material breaks along a slanted plane or crumbles.",
  "ar": "يوضع قضيب قصير بين صفيحتين مستويتين ويُضغط. نسجّل القوة والتقصّر ونحسب إجهاد الضغط σ_c = F / A₀ كما في اختبار الشد. المعدن المطيل لا ينكسر: يقصر ويتسع كالبرميل. أما المادة القصفة فتنكسر على مستوٍ مائل أو تتفتت."
 },
 "apparatus": {
  "en": "A testing machine with two hard, flat, parallel plates (one can tilt slightly to fix small misalignment) and a load cell. For concrete, a larger compression machine.",
  "ar": "آلة اختبار بصفيحتين صلبتين مستويتين متوازيتين (إحداهما تميل قليلاً لتصحيح الانحراف الصغير) وخلية حمل. وللخرسانة آلة ضغط أكبر."
 },
 "specimen": {
  "en": "A short cylinder or block with flat, parallel ends. It must not be too long, or it bends sideways (buckles) instead of being squashed. Concrete: a cylinder 150 mm in diameter and 300 mm tall (ASTM C39).",
  "ar": "أسطوانة أو كتلة قصيرة بطرفين مستويين متوازيين. يجب ألا تكون طويلة وإلا انحنت جانبياً (انبعجت) بدل أن تُضغط. الخرسانة: أسطوانة قطرها 150 مم وارتفاعها 300 مم (ASTM C39)."
 },
 "procedure": [
  {
   "en": "Measure dimensions; ensure the end faces are flat and parallel (grind or cap them).",
   "ar": "قِس الأبعاد؛ وتأكد أن الوجهين الطرفيين مسطحان ومتوازيان (بالطحن أو التغطية)."
  },
  {
   "en": "Lubricate the ends (metals) to reduce friction and barrelling, or specify the friction condition.",
   "ar": "زلّق الطرفين (للمعادن) لتقليل الاحتكاك والتبرمل، أو حدّد شرط الاحتكاك."
  },
  {
   "en": "Centre the specimen on the lower platen; bring the spherical seat into light contact.",
   "ar": "ضع العينة في مركز الصفيحة السفلى؛ وقرّب المقعد الكروي بتماس خفيف."
  },
  {
   "en": "Load at the specified rate while recording F and shortening.",
   "ar": "حمّل بالمعدل المحدد مع تسجيل F والتقصّر."
  },
  {
   "en": "Stop at fracture (brittle) or at a stated strain (ductile) and record the failure mode.",
   "ar": "أوقف عند الكسر (القصف) أو عند انفعال محدد (المطيل) وسجّل نمط الانهيار."
  }
 ],
 "results": {
  "en": "Compressive yield strength and modulus for ductile metals; compressive strength σ_c (maximum stress) for brittle materials and the failure pattern.",
  "ar": "حد الخضوع الانضغاطي والمعامل للمعادن المطيلة؛ ومقاومة الضغط σ_c (أقصى إجهاد) للمواد القصفة ونمط الانهيار."
 },
 "terms": [
  [
   {
    "en": "Brittle",
    "ar": "قصف"
   },
   {
    "en": "breaks suddenly with almost no stretching (glass, cast iron, concrete).",
    "ar": "ينكسر فجأة دون استطالة تقريباً (الزجاج وحديد الزهر والخرسانة)."
   }
  ],
  [
   {
    "en": "Platen",
    "ar": "الصفيحة الضاغطة"
   },
   {
    "en": "the flat steel plate that presses on the specimen.",
    "ar": "الصفيحة الفولاذية المستوية التي تضغط على العينة."
   }
  ],
  [
   {
    "en": "Buckling",
    "ar": "الانبعاج"
   },
   {
    "en": "a long thin piece bends sideways under compression.",
    "ar": "ينحني الجسم الطويل النحيف جانبياً تحت الضغط."
   }
  ],
  [
   {
    "en": "Shear plane",
    "ar": "مستوي القص"
   },
   {
    "en": "the slanted surface along which a brittle specimen slides and breaks.",
    "ar": "السطح المائل الذي تنزلق عليه العينة القصفة وتنكسر."
   }
  ]
 ],
 "eqs": [
  {
   "l": {
    "en": "Compressive stress",
    "ar": "إجهاد الضغط"
   },
   "e": "σ_c = F / A₀",
   "v": [
    [
     "σ_c",
     {
      "en": "compressive stress (MPa)",
      "ar": "إجهاد الضغط (MPa)"
     }
    ],
    [
     "F",
     {
      "en": "squeezing force (N)",
      "ar": "قوة الضغط (N)"
     }
    ],
    [
     "A₀",
     {
      "en": "original cross-section area (mm²)",
      "ar": "مساحة المقطع الأصلية (mm²)"
     }
    ]
   ],
   "n": {
    "en": "For a round bar A₀ = π·d²/4.",
    "ar": "للقضيب الدائري A₀ = π·d²/4."
   }
  },
  {
   "l": {
    "en": "Compressive strain",
    "ar": "انفعال الضغط"
   },
   "e": "ε = (L₀ − L) / L₀",
   "v": [
    [
     "L₀",
     {
      "en": "original height (mm)",
      "ar": "الارتفاع الأصلي (mm)"
     }
    ],
    [
     "L",
     {
      "en": "height under load (mm)",
      "ar": "الارتفاع تحت الحمل (mm)"
     }
    ]
   ],
   "n": {
    "en": "Shortening divided by the original height.",
    "ar": "التقصّر مقسوماً على الارتفاع الأصلي."
   }
  },
  {
   "l": {
    "en": "Slenderness (how thin and tall the specimen is)",
    "ar": "النحافة (مدى طول العينة ورقّتها)"
   },
   "e": "L / D",
   "v": [
    [
     "L",
     {
      "en": "height (mm)",
      "ar": "الارتفاع (mm)"
     }
    ],
    [
     "D",
     {
      "en": "diameter (mm)",
      "ar": "القطر (mm)"
     }
    ]
   ],
   "n": {
    "en": "Keep it small, otherwise the specimen buckles.",
    "ar": "أبقِها صغيرة وإلا انبعجت العينة."
   }
  }
 ],
 "example": {
  "title": {
   "en": "Worked example: concrete cylinder",
   "ar": "مثال محلول: أسطوانة خرسانة"
  },
  "steps": [
   {
    "en": "Cylinder 150 mm × 300 mm → A₀ = π·150²/4 = 17 671 mm².",
    "ar": "الأسطوانة 150 × 300 مم ← A₀ = π·150²/4 = 17 671 mm²."
   },
   {
    "en": "Failure load F = 560 kN = 560 000 N.",
    "ar": "حمل الانهيار F = 560 kN = 560 000 N."
   },
   {
    "en": "σ_c = 560 000 / 17 671 = 31.7 MPa.",
    "ar": "σ_c = 560 000 / 17 671 = 31.7 MPa."
   }
  ],
  "result": {
   "en": "Compressive strength ≈ 31.7 MPa. Concrete is typically tested only in compression because its tensile strength is only a small fraction of this.",
   "ar": "مقاومة الضغط ≈ 31.7 MPa. وتُختبر الخرسانة عادة ضغطاً فقط لأن مقاومتها شدّاً جزء صغير من ذلك."
  }
 },
 "pitfalls": [
  {
   "en": "End friction creates a triaxial stress state and the barrel shape; results depend on lubrication.",
   "ar": "احتكاك الطرفين يولّد حالة إجهاد ثلاثية المحاور وشكل البرميل؛ فتعتمد النتائج على التزليق."
  },
  {
   "en": "Non-parallel faces cause eccentric loading and low strengths.",
   "ar": "الوجوه غير المتوازية تسبب تحميلاً لامركزياً ومقاومات منخفضة."
  },
  {
   "en": "A ductile metal has no fracture point: do not report a \"compressive strength\" without stating the strain at which it was taken.",
   "ar": "المعدن المطيل بلا نقطة كسر: لا تذكر «مقاومة ضغط» دون ذكر الانفعال الذي أُخذت عنده."
  },
  {
   "en": "Too slender a specimen buckles instead of crushing.",
   "ar": "العينة النحيلة جداً تنبعج بدل أن تُسحق."
  }
 ],
 "notConfuse": {
  "en": "Squashing a short specimen is not the same as column buckling. Buckling is a failure of a long thin member by bending sideways, not by crushing. Also, a brittle material is usually much stronger in compression than in tension (grey cast iron: about 3 to 4 times).",
  "ar": "ضغط عينة قصيرة ليس انبعاج العمود. فالانبعاج فشل لعضو طويل نحيف بانحنائه جانبياً وليس بسحقه. كما أن المادة القصفة أقوى عادة بكثير ضغطاً منها شدّاً (حديد الزهر الرمادي: نحو 3 إلى 4 أضعاف)."
 },
 "apps": [
  {
   "en": "Concrete and masonry quality control on site.",
   "ar": "ضبط جودة الخرسانة والبناء في الموقع."
  },
  {
   "en": "Cast-iron machine bases, bearing materials, ceramics and foams.",
   "ar": "قواعد الآلات من حديد الزهر ومواد المحامل والسيراميك والرغوات."
  },
  {
   "en": "Forming data: flow stress for forging and upsetting.",
   "ar": "بيانات التشكيل: إجهاد الجريان للطرق والتكبيس."
  }
 ],
 "figs": [
  {
   "k": "compressionShapes",
   "cap": {
    "en": "Three cases: the specimen before the test; a ductile metal after squeezing (it gets short and barrel-shaped); a brittle specimen that breaks on a slanted plane.",
    "ar": "ثلاث حالات: العينة قبل الاختبار؛ ومعدن مطيل بعد الضغط (يقصر ويتخذ شكل البرميل)؛ وعينة قصفة تنكسر على مستوٍ مائل."
   }
  },
  {
   "k": "compressionCurve",
   "cap": {
    "en": "Typical stress–strain curve of concrete in compression (a rising parabola to the peak 31.7 MPa at ε ≈ 0.002, then a falling line; the numbers of the worked example). It is an idealised shape, not a measured record.",
    "ar": "منحنى الإجهاد والانفعال النموذجي للخرسانة في الضغط (قطع مكافئ صاعد حتى القمة 31.7 MPa عند ε ≈ 0.002 ثم خط هابط، وهي أرقام المثال المحلول). شكل مثالي وليس سجلاً مقاساً."
   }
  }
 ],
 "see": [
  "tensile",
  "bending"
 ]
});
M.tests.push({
 "id": "bending",
 "cat": "static",
 "icon": "fa-minus",
 "name": {
  "en": "Bending (flexure) test",
  "ar": "اختبار الانحناء"
 },
 "short": {
  "en": "Load a bar on two supports at its middle: gives bending strength and stiffness.",
  "ar": "تحميل قضيب على مسندين عند منتصفه: يعطي مقاومة الانحناء والصلابة."
 },
 "gist": {
  "en": "Put a bar on two supports, push down in the middle, and record the force at which it bends or breaks.",
  "ar": "نضع قضيباً على مسندين ونضغط من الوسط ونسجّل القوة التي ينحني أو ينكسر عندها."
 },
 "std": "ASTM E290 / ISO 7438 (bend ductility, metals) · ASTM D790 / ISO 178 (plastics) · ASTM C1161 (ceramics)",
 "purpose": {
  "en": "Many parts are loaded in bending, like a beam or a shelf. This test is also used when a tensile bar is hard to make, for example for ceramics, glass, plastics and cast iron.",
  "ar": "كثير من القطع تُحمَّل انحناءً، كالعارضة والرف. ويُستعمل هذا الاختبار أيضاً حين يصعب صنع قضيب شد، كما في السيراميك والزجاج واللدائن وحديد الزهر."
 },
 "principle": {
  "en": "A rectangular bar lies on two supports, a distance L apart (the span), and a rounded \"nose\" pushes down at the middle (three-point bending). The bottom face is stretched (tension) and the top face is squeezed (compression). The largest stress is on the bottom face under the load. For a brittle material, the stress when it breaks is the flexural strength.",
  "ar": "يستقر قضيب مستطيل على مسندين تفصل بينهما مسافة L (الباع) ويضغط نتوء مستدير من الأعلى عند المنتصف (انحناء بثلاث نقاط). يُشَدّ الوجه السفلي (شدّ) ويُضغَط الوجه العلوي (ضغط). وأكبر إجهاد على الوجه السفلي تحت الحمل. وفي المادة القصفة يكون الإجهاد عند الكسر هو مقاومة الانحناء."
 },
 "apparatus": {
  "en": "A testing machine with a bending fixture: two supporting rollers, one loading nose, a load cell and a gauge that measures the sag (deflection) at the middle.",
  "ar": "آلة اختبار مع تجهيزة انحناء: دلفينان للإسناد ونتوء تحميل واحد وخلية حمل ومقياس للتدلّي (السهم) عند المنتصف."
 },
 "specimen": {
  "en": "A rectangular bar of width b and depth d, a little longer than the span (the example ceramic bar is 45 × 4 × 3 mm on a 40 mm span, as in ASTM C1161). For plastics the span is usually 16 times the depth (ASTM D790). For metals (ASTM E290 / ISO 7438) the bar is bent around a rounded pin through a given angle and the stretched face is checked for cracks.",
  "ar": "قضيب مستطيل عرضه b وعمقه d وأطول قليلاً من الباع (قضيب السيراميك في المثال 45 × 4 × 3 مم على باع 40 مم كما في ASTM C1161). وللدائن يكون الباع عادة 16 ضعف العمق (ASTM D790). وللمعادن (ASTM E290 / ISO 7438) يُثنى القضيب حول مدرفل مستدير بزاوية محددة ويُفحص الوجه المشدود بحثاً عن شقوق."
 },
 "procedure": [
  {
   "en": "Measure b and d at mid-span; set the support span L.",
   "ar": "قِس b وd عند المنتصف؛ واضبط باع المسندين L."
  },
  {
   "en": "Place the bar centrally, tension face down, with the noses touching lightly.",
   "ar": "ضع القضيب في المركز ووجه الشد للأسفل والنتوءات تلامسه بخفة."
  },
  {
   "en": "Load at a constant crosshead rate, recording F and mid-span deflection δ.",
   "ar": "حمّل بمعدل رأس ثابت مع تسجيل F والتدلي δ عند المنتصف."
  },
  {
   "en": "Stop at fracture, or at the stated strain/deflection for materials that do not break.",
   "ar": "أوقف عند الكسر أو عند الانفعال/التدلي المحدد للمواد التي لا تنكسر."
  },
  {
   "en": "Compute σ_f from the peak load and E_f from the initial slope of F–δ.",
   "ar": "احسب σ_f من الحمل الأقصى وE_f من الميل الأولي لـ F–δ."
  }
 ],
 "results": {
  "en": "Flexural strength σ_f (modulus of rupture), flexural modulus E_f, deflection at break, and for ductile metals whether cracks appear after bending.",
  "ar": "مقاومة الانحناء σ_f (معامل الانكسار)، ومعامل الانحناء E_f، والتدلي عند الكسر، وللمعادن المطيلة ظهور الشقوق بعد الثني من عدمه."
 },
 "terms": [
  [
   {
    "en": "Span L",
    "ar": "الباع L"
   },
   {
    "en": "the distance between the two supports.",
    "ar": "المسافة بين المسندين."
   }
  ],
  [
   {
    "en": "Deflection δ",
    "ar": "التدلّي δ"
   },
   {
    "en": "how far the middle of the bar moves down.",
    "ar": "مقدار هبوط منتصف القضيب."
   }
  ],
  [
   {
    "en": "Bending moment M",
    "ar": "عزم الانحناء M"
   },
   {
    "en": "the \"bending effect\" of the force. Unit: N·mm.",
    "ar": "مفعول «الانحناء» الذي تسببه القوة. الوحدة: N·mm."
   }
  ],
  [
   {
    "en": "Flexural strength σ_f",
    "ar": "مقاومة الانحناء σ_f"
   },
   {
    "en": "the largest stress on the surface when the bar breaks.",
    "ar": "أكبر إجهاد على السطح عند كسر القضيب."
   }
  ]
 ],
 "eqs": [
  {
   "l": {
    "en": "Bending moment at the middle (three-point)",
    "ar": "عزم الانحناء عند المنتصف (ثلاث نقاط)"
   },
   "e": "M_max = F · L / 4",
   "v": [
    [
     "M_max",
     {
      "en": "largest bending moment (N·mm)",
      "ar": "أكبر عزم انحناء (N·mm)"
     }
    ],
    [
     "F",
     {
      "en": "load at the middle (N)",
      "ar": "الحمل عند المنتصف (N)"
     }
    ],
    [
     "L",
     {
      "en": "span between supports (mm)",
      "ar": "الباع بين المسندين (mm)"
     }
    ]
   ],
   "n": {
    "en": "",
    "ar": ""
   }
  },
  {
   "l": {
    "en": "Flexural strength (three-point, rectangular bar)",
    "ar": "مقاومة الانحناء (ثلاث نقاط، قضيب مستطيل)"
   },
   "e": "σ_f = 3 · F · L / ( 2 · b · d² )",
   "v": [
    [
     "σ_f",
     {
      "en": "flexural strength (MPa)",
      "ar": "مقاومة الانحناء (MPa)"
     }
    ],
    [
     "F",
     {
      "en": "load at break (N)",
      "ar": "حمل الكسر (N)"
     }
    ],
    [
     "L",
     {
      "en": "span (mm)",
      "ar": "الباع (mm)"
     }
    ],
    [
     "b",
     {
      "en": "width of the bar (mm)",
      "ar": "عرض القضيب (mm)"
     }
    ],
    [
     "d",
     {
      "en": "depth (thickness) of the bar (mm)",
      "ar": "عمق (سماكة) القضيب (mm)"
     }
    ]
   ],
   "n": {
    "en": "It comes from σ = M·c / I with M = F·L/4, c = d/2 and I = b·d³/12.",
    "ar": "تأتي من σ = M·c / I مع M = F·L/4 وc = d/2 وI = b·d³/12."
   }
  },
  {
   "l": {
    "en": "Flexural modulus (stiffness in bending)",
    "ar": "معامل الانحناء (الصلابة في الانحناء)"
   },
   "e": "E_f = L³ · m / ( 4 · b · d³ )",
   "v": [
    [
     "E_f",
     {
      "en": "flexural modulus (MPa)",
      "ar": "معامل الانحناء (MPa)"
     }
    ],
    [
     "m",
     {
      "en": "slope of the straight start of the F–δ record (N/mm)",
      "ar": "ميل بداية سجل F–δ المستقيمة (N/mm)"
     }
    ]
   ],
   "n": {
    "en": "Use only the straight part at the start of the record.",
    "ar": "استعمل الجزء المستقيم من بداية السجل فقط."
   }
  },
  {
   "l": {
    "en": "Four-point bending (loads at the quarter points)",
    "ar": "انحناء بأربع نقاط (الحملان عند الربعين)"
   },
   "e": "σ_f = 3 · F · L / ( 4 · b · d² )",
   "v": [
    [
     "F",
     {
      "en": "total load (N), shared by the two noses",
      "ar": "الحمل الكلي (N) موزَّع على النتوءين"
     }
    ]
   ],
   "n": {
    "en": "The moment is constant between the two noses, so a larger part of the bar is equally stressed.",
    "ar": "العزم ثابت بين النتوءين فيُجهَد جزء أكبر من القضيب بالتساوي."
   }
  }
 ],
 "example": {
  "title": {
   "en": "Worked example: ceramic bar, three-point",
   "ar": "مثال محلول: قضيب سيراميك، ثلاث نقاط"
  },
  "steps": [
   {
    "en": "Bar b = 4 mm, d = 3 mm, support span L = 40 mm; fracture load F = 450 N.",
    "ar": "القضيب b = 4 مم وd = 3 مم وباع المسندين L = 40 مم؛ حمل الكسر F = 450 N."
   },
   {
    "en": "σ_f = 3·450·40 / (2·4·3²) = 54 000 / 72 = 750 MPa.",
    "ar": "σ_f = 3·450·40 / (2·4·3²) = 54 000 / 72 = 750 MPa."
   },
   {
    "en": "If the initial slope is m = 2025 N/mm: E_f = 40³·2025 / (4·4·3³) = 129 600 000 / 432 = 300 000 MPa = 300 GPa.",
    "ar": "إن كان الميل الأولي m = 2025 N/mm: E_f = 40³·2025 / (4·4·3³) = 129 600 000 / 432 = 300 000 MPa = 300 GPa."
   }
  ],
  "result": {
   "en": "σ_f = 750 MPa and E_f = 300 GPa (values typical of a technical ceramic).",
   "ar": "σ_f = 750 MPa وE_f = 300 GPa (قيم نموذجية لسيراميك تقني)."
  }
 },
 "pitfalls": [
  {
   "en": "The equations assume a linear elastic material and small deflection; for plastics that deform a lot use the strain-limit rule of the standard.",
   "ar": "المعادلات تفترض مادة خطية مرنة وتدلياً صغيراً؛ وللدائن كثيرة التشوه تُتّبع قاعدة حد الانفعال في المعيار."
  },
  {
   "en": "Flexural strength of a ceramic is usually higher than its tensile strength, because only a small volume near the surface sees the peak stress.",
   "ar": "مقاومة الانحناء للسيراميك أعلى عادة من مقاومته شدّاً لأن حجماً صغيراً قرب السطح فقط يتعرض للإجهاد الأقصى."
  },
  {
   "en": "Friction at the supports and edge chips change the result.",
   "ar": "احتكاك المساند وتشظّي الحواف يغيّران النتيجة."
  },
  {
   "en": "Shear deformation matters for short, thick specimens or composites; use a long enough span.",
   "ar": "للتشوه القصّي أهمية في العينات القصيرة السميكة والمركبات؛ استعمل باعاً طويلاً كفاية."
  }
 ],
 "notConfuse": {
  "en": "Flexural strength is a stress on the surface at the break. It is not the same number as tensile strength (for a ceramic it is usually higher, because only a small volume sees the highest stress). Bending a ductile metal around a pin is a ductility check, not a strength measurement.",
  "ar": "مقاومة الانحناء إجهاد على السطح عند الكسر، وليست الرقم نفسه لمقاومة الشد (في السيراميك هي أعلى عادة لأن حجماً صغيراً فقط يتعرض لأكبر إجهاد). وثني معدن مطيل حول مدرفل فحص للمطيلية وليس قياساً للمقاومة."
 },
 "apps": [
  {
   "en": "Ceramics, glass, cast iron and rock where tension tests are hard.",
   "ar": "السيراميك والزجاج وحديد الزهر والصخر حيث يصعب اختبار الشد."
  },
  {
   "en": "Plastics and fibre composites: flexural modulus for design of panels and beams.",
   "ar": "اللدائن والمواد المركبة الليفية: معامل الانحناء لتصميم الألواح والعوارض."
  },
  {
   "en": "Guided-bend tests of welds and rebar to prove ductility.",
   "ar": "اختبارات الثني الموجّه للحامات وحديد التسليح لإثبات المطيلية."
  }
 ],
 "figs": [
  {
   "k": "bendSetup",
   "cap": {
    "en": "The example bar drawn to scale (45 × 4 × 3 mm, span 40 mm) on two supports, with the load F at the middle.",
    "ar": "قضيب المثال مرسوماً بمقياس رسم (45 × 4 × 3 مم والباع 40 مم) على مسندين مع الحمل F عند المنتصف."
   }
  },
  {
   "k": "bendMoment",
   "cap": {
    "en": "The bending moment along the bar for F = 450 N and L = 40 mm: zero at the supports and the largest, F·L/4 = 4500 N·mm, at the middle.",
    "ar": "عزم الانحناء على طول القضيب عند F = 450 N وL = 40 مم: صفر عند المسندين وأكبر قيمة F·L/4 = 4500 N·mm عند المنتصف."
   }
  },
  {
   "k": "bendFD",
   "cap": {
    "en": "The load–deflection record of the example (a brittle ceramic): a straight line with slope m = 2025 N/mm up to the break at 450 N (δ = 0.22 mm).",
    "ar": "سجل الحمل–التدلّي للمثال (سيراميك قصف): خط مستقيم ميله m = 2025 N/mm حتى الكسر عند 450 N (δ = 0.22 مم)."
   }
  }
 ],
 "see": [
  "tensile",
  "shear",
  "torsion"
 ]
});
M.tests.push({
 "id": "shear",
 "cat": "static",
 "icon": "fa-scissors",
 "name": {
  "en": "Direct shear test",
  "ar": "اختبار القص"
 },
 "short": {
  "en": "Cut a pin or rivet across: gives the shear strength of joints.",
  "ar": "قصّ وتد أو برشام عرضياً: يعطي مقاومة القص للوصلات."
 },
 "gist": {
  "en": "Cut a pin across with two blades, and record the force at which it is sheared off.",
  "ar": "نقصّ وتداً بنصلين عرضياً ونسجّل القوة التي ينقطع عندها."
 },
 "std": "ASTM B565 (rivets) · ASTM D732 (plastics, punch) · ASTM D5379 (composites, V-notched beam)",
 "purpose": {
  "en": "Bolts, pins, rivets and keys are often loaded across their section, like scissors cutting paper. This test gives the force at which such a part is sheared off.",
  "ar": "المسامير والأوتاد والبراشيم والخوابير تُحمَّل غالباً عبر مقطعها كما تقصّ المقصّ الورق. يعطي هذا الاختبار القوة التي تنقطع عندها هذه القطع."
 },
 "principle": {
  "en": "The pin sits in a fixture. Parts of the fixture slide past each other and force the pin to shear (to be cut) along one plane (single shear) or two planes (double shear). The force is carried by the cross-section area on the cut planes, so the shear stress is the force divided by that area. The stress is not perfectly even over the section, so the number is an average.",
  "ar": "يوضع الوتد في تجهيزة. ينزلق جزءان من التجهيزة أحدهما على الآخر ويجبران الوتد على القص (القطع) على مستوٍ واحد (قص مفرد) أو مستويين (قص مزدوج). تحمل مساحة المقطع على مستويات القطع القوة، فإجهاد القص هو القوة مقسومة على هذه المساحة. والإجهاد ليس منتظماً تماماً على المقطع فالرقم متوسط."
 },
 "apparatus": {
  "en": "A testing machine with a shear fixture: hardened blocks with a tight hole for the pin. For sheet, a punch and die.",
  "ar": "آلة اختبار مع تجهيزة قص: كتل مقسّاة بثقب ضيق للوتد. وللصفائح مثقب وقالب."
 },
 "specimen": {
  "en": "A round pin or rod of diameter d (area A = π·d²/4), a rivet, or a flat plate. The standards fix the gap between the fixture parts so that the pin is cut, not bent.",
  "ar": "وتد أو قضيب دائري قطره d (المساحة A = π·d²/4) أو برشام أو صفيحة مستوية. تحدد المعايير الفراغ بين أجزاء التجهيزة كي يُقطَع الوتد ولا ينحني."
 },
 "procedure": [
  {
   "en": "Measure the pin diameter and place it in the fixture with the clearance specified.",
   "ar": "قِس قطر الوتد وضعه في التجهيزة بالخلوص المحدد."
  },
  {
   "en": "Apply the load slowly at a constant crosshead rate.",
   "ar": "طبّق الحمل ببطء بمعدل رأس ثابت."
  },
  {
   "en": "Record the maximum force F at which the pin separates.",
   "ar": "سجّل أقصى قوة F تنفصل عندها القطعة."
  },
  {
   "en": "Divide by the total sheared area (one plane or two).",
   "ar": "اقسم على إجمالي مساحة القص (مستوٍ واحد أو اثنان)."
  },
  {
   "en": "Inspect the fracture surface to confirm a clean shear failure.",
   "ar": "افحص سطح الكسر للتأكد من انهيار قصّي نظيف."
  }
 ],
 "results": {
  "en": "Average ultimate shear strength τ_u of the pin or specimen (and the load–displacement curve). For design, the shear yield strength is usually estimated from the tensile yield rather than measured directly.",
  "ar": "متوسط مقاومة القص القصوى τ_u للوتد أو العينة (ومنحنى الحمل–الإزاحة). وفي التصميم يُقدَّر حد خضوع القص عادة من خضوع الشد بدل قياسه مباشرة."
 },
 "terms": [
  [
   {
    "en": "Shear",
    "ar": "القص"
   },
   {
    "en": "two parts of a body are pushed in opposite directions along a plane, like cutting with scissors.",
    "ar": "دفع جزأين من جسم في اتجاهين متعاكسين على مستوٍ، كالقطع بالمقص."
   }
  ],
  [
   {
    "en": "Shear stress τ",
    "ar": "إجهاد القص τ"
   },
   {
    "en": "shear force divided by the area being cut.",
    "ar": "قوة القص مقسومة على المساحة المقطوعة."
   }
  ],
  [
   {
    "en": "Single / double shear",
    "ar": "قص مفرد / مزدوج"
   },
   {
    "en": "the pin is cut at one plane / at two planes at the same time.",
    "ar": "يُقطَع الوتد عند مستوٍ واحد / عند مستويين معاً."
   }
  ],
  [
   {
    "en": "Bearing",
    "ar": "التحميل التماسي"
   },
   {
    "en": "crushing of the hole wall by the pin; it is a different failure from shear.",
    "ar": "سحق جدار الثقب بالوتد؛ وهو انهيار مختلف عن القص."
   }
  ]
 ],
 "eqs": [
  {
   "l": {
    "en": "Single shear",
    "ar": "قص مفرد"
   },
   "e": "τ = F / A",
   "v": [
    [
     "τ",
     {
      "en": "average shear stress (MPa)",
      "ar": "متوسط إجهاد القص (MPa)"
     }
    ],
    [
     "F",
     {
      "en": "force at failure (N)",
      "ar": "القوة عند الانهيار (N)"
     }
    ],
    [
     "A",
     {
      "en": "area of one cut = π·d²/4 (mm²)",
      "ar": "مساحة قطع واحد = π·d²/4 (mm²)"
     }
    ]
   ],
   "n": {
    "en": "",
    "ar": ""
   }
  },
  {
   "l": {
    "en": "Double shear",
    "ar": "قص مزدوج"
   },
   "e": "τ = F / ( 2 · A )",
   "v": [
    [
     "2·A",
     {
      "en": "two cut planes carry the force",
      "ar": "مستويان مقطوعان يحملان القوة"
     }
    ]
   ],
   "n": {
    "en": "Forgetting the factor 2 gives a result twice too large.",
    "ar": "نسيان العامل 2 يعطي نتيجة أكبر بمرتين."
   }
  },
  {
   "l": {
    "en": "Estimate from the tensile yield (ductile metals)",
    "ar": "تقدير من خضوع الشد (المعادن المطيلة)"
   },
   "e": "τ_y ≈ 0.577 · σ_y      (von Mises)\nτ_y ≈ 0.5 · σ_y        (Tresca)",
   "v": [
    [
     "τ_y",
     {
      "en": "shear yield strength (MPa)",
      "ar": "إجهاد خضوع القص (MPa)"
     }
    ],
    [
     "σ_y",
     {
      "en": "tensile yield strength (MPa)",
      "ar": "إجهاد خضوع الشد (MPa)"
     }
    ]
   ],
   "n": {
    "en": "Two yield criteria used in design. They are estimates, not test results.",
    "ar": "معياران للخضوع يُستعملان في التصميم. وهما تقديران وليسا نتيجة اختبار."
   }
  },
  {
   "l": {
    "en": "Link with the shear modulus",
    "ar": "العلاقة مع معامل القص"
   },
   "e": "G = E / ( 2 · (1 + ν) )",
   "v": [
    [
     "G",
     {
      "en": "shear modulus (MPa)",
      "ar": "معامل القص (MPa)"
     }
    ],
    [
     "ν",
     {
      "en": "Poisson ratio (≈ 0.3 for steel)",
      "ar": "نسبة بواسون (≈ 0.3 للفولاذ)"
     }
    ]
   ],
   "n": {
    "en": "G is measured much better with the torsion test.",
    "ar": "يُقاس G بدقة أفضل بكثير باختبار اللي."
   }
  }
 ],
 "example": {
  "title": {
   "en": "Worked example: pin in double shear",
   "ar": "مثال محلول: وتد في قص مزدوج"
  },
  "steps": [
   {
    "en": "Pin d = 10 mm → A = π·10²/4 = 78.54 mm².",
    "ar": "الوتد d = 10 مم ← A = π·10²/4 = 78.54 mm²."
   },
   {
    "en": "Failure load F = 47.1 kN = 47 100 N, two shear planes.",
    "ar": "حمل الانهيار F = 47.1 kN = 47 100 N وبمستويي قص."
   },
   {
    "en": "τ_u = 47 100 / (2 × 78.54) = 299.8 ≈ 300 MPa.",
    "ar": "τ_u = 47 100 / (2 × 78.54) = 299.8 ≈ 300 MPa."
   }
  ],
  "result": {
   "en": "Average shear strength ≈ 300 MPa. A single-shear pin of the same material would fail at half this load (23.6 kN).",
   "ar": "متوسط مقاومة القص ≈ 300 MPa. ووتد من المادة نفسها في قص مفرد ينهار عند نصف هذا الحمل (23.6 kN)."
  }
 },
 "pitfalls": [
  {
   "en": "Clearance too large adds bending of the pin; too small adds friction.",
   "ar": "الخلوص الكبير جداً يضيف انحناءً للوتد والصغير جداً يضيف احتكاكاً."
  },
  {
   "en": "Forgetting that double shear has two planes gives a value twice as large.",
   "ar": "نسيان أن القص المزدوج له مستويان يعطي قيمة تساوي الضعف."
  },
  {
   "en": "The stress is an average and is not uniform across the section.",
   "ar": "الإجهاد متوسط وغير منتظم عبر المقطع."
  },
  {
   "en": "Bearing (crushing) of the hole can precede shear failure and must be checked separately.",
   "ar": "قد يسبق سحق الثقب (التحميل التماسي) انهيار القص ويجب فحصه منفصلاً."
  }
 ],
 "notConfuse": {
  "en": "Direct shear gives an average over a cut section and is not pure shear. The ultimate shear strength is usually about 0.6 to 0.8 of the ultimate tensile strength. Torsion of a thin tube gives a nearly uniform shear and is the proper way to find the shear modulus G.",
  "ar": "القص المباشر يعطي متوسطاً على مقطع مقصوص وليس قصاً نقياً. وتبلغ مقاومة القص القصوى عادة نحو 0.6 إلى 0.8 من مقاومة الشد القصوى. أما لي أنبوب رقيق فيعطي قصاً شبه منتظم وهو الطريقة الصحيحة لإيجاد معامل القص G."
 },
 "apps": [
  {
   "en": "Sizing pins, rivets, bolts in shear, keys and shear pins.",
   "ar": "تحجيم الأوتاد والبراشيم والمسامير المقصوصة والخوابير ومسامير القص."
  },
  {
   "en": "Sheet-metal shearing and blanking force (see the manufacturing lab, shearing model).",
   "ar": "قوة قص الصفائح والقطع (انظر مختبر التصنيع، نموذج القص)."
  },
  {
   "en": "Adhesive joints and composite interlaminar shear.",
   "ar": "الوصلات اللاصقة والقص بين الطبقات في المركبات."
  }
 ],
 "figs": [
  {
   "k": "shearSetup",
   "cap": {
    "en": "A pin in double shear: the middle block pushes down with F, the two outer blocks hold with F/2 each, and the pin is cut at two planes (red).",
    "ar": "وتد في قص مزدوج: تدفع الكتلة الوسطى بالقوة F وتسند الكتلتان الخارجيتان بـ F/2 لكل منهما، ويُقطَع الوتد عند مستويين (أحمر)."
   }
  },
  {
   "k": "shearPlot",
   "cap": {
    "en": "Force needed to shear a pin of diameter d for τ = 300 MPa, from F = τ·A and F = 2·τ·A. For d = 10 mm: 23.6 kN in single shear and 47.1 kN in double shear.",
    "ar": "القوة اللازمة لقصّ وتد قطره d عند τ = 300 MPa من F = τ·A وF = 2·τ·A. وعند d = 10 مم: 23.6 kN قصاً مفرداً و47.1 kN قصاً مزدوجاً."
   }
  }
 ],
 "see": [
  "torsion",
  "tensile"
 ]
});
M.tests.push({
 "id": "torsion",
 "cat": "static",
 "icon": "fa-rotate",
 "name": {
  "en": "Torsion test",
  "ar": "اختبار اللي"
 },
 "short": {
  "en": "Twist a round bar: gives the shear modulus G and the shear strength.",
  "ar": "لي قضيب دائري: يعطي معامل القص G ومقاومة القص."
 },
 "gist": {
  "en": "Twist a round bar and record the torque and the twist angle.",
  "ar": "نلوي قضيباً دائرياً ونسجّل العزم وزاوية اللي."
 },
 "std": "ASTM E143 (shear modulus) · ISO 7800 (wire, simple torsion)",
 "purpose": {
  "en": "Shafts, springs and drill bits work by twisting. The torsion test shows how a material behaves when twisted and gives its shear modulus G, which cannot be found easily with a tensile test.",
  "ar": "الأعمدة والنوابض وريش الثقب تعمل باللي. يبيّن اختبار اللي سلوك المادة عند اللي ويعطي معامل القص G الذي يصعب إيجاده باختبار الشد."
 },
 "principle": {
  "en": "One end of a round bar is held and a torque T (a twisting moment) is applied to the other end. Every cross-section turns a little relative to the next, and the total angle of twist θ over the length L is recorded. In a solid bar the shear stress is zero on the axis and grows in a straight line up to the largest value τ_max at the surface.",
  "ar": "يُمسَك أحد طرفي قضيب دائري ويُطبَّق عزم T (عزم لي) على الطرف الآخر. يدور كل مقطع قليلاً بالنسبة للذي يليه وتُسجَّل زاوية اللي الكلية θ على الطول L. وفي القضيب المصمت يكون إجهاد القص صفراً على المحور ويزداد خطياً حتى أكبر قيمة τ_max عند السطح."
 },
 "apparatus": {
  "en": "A torsion testing machine: a rotating head, a torque cell, an angle gauge (torsiometer) and grips that transmit the torque without crushing the bar.",
  "ar": "آلة اختبار لي: رأس دوّار وخلية عزم ومقياس زاوية (torsiometer) وفكوك تنقل العزم دون سحق القضيب."
 },
 "specimen": {
  "en": "A round bar with a thinner middle part (for example 10 to 20 mm diameter) and thicker, often splined, ends for the grips. A thin-walled tube gives the most even shear stress; a solid bar is easier to make.",
  "ar": "قضيب دائري بجزء أوسط أنحف (قطره مثلاً من 10 إلى 20 مم) وطرفين أسمك غالباً مخددان للإمساك. يعطي الأنبوب الرقيق الجدار أكثر الإجهادات انتظاماً، والقضيب المصمت أسهل صنعاً."
 },
 "procedure": [
  {
   "en": "Measure d (and wall thickness for a tube) and the gauge length L; fit the torsiometer.",
   "ar": "قِس d (وسماكة الجدار للأنبوب) والطول القياسي L؛ وركّب مقياس اللي."
  },
  {
   "en": "Grip the ends so that torque is transmitted without axial load.",
   "ar": "أمسك الطرفين بحيث ينتقل العزم دون حمل محوري."
  },
  {
   "en": "Rotate at a slow constant rate while recording T and θ.",
   "ar": "أدِر بمعدل بطيء ثابت مع تسجيل T وθ."
  },
  {
   "en": "Continue to fracture; note the fracture plane (ductile metals shear flat across the section, brittle ones break on a helix at 45°).",
   "ar": "تابع حتى الكسر ودوّن مستوي الكسر (المعادن المطيلة تُقصّ مستوية عبر المقطع والقصفة تنكسر حلزونياً عند 45°)."
  },
  {
   "en": "Convert T–θ to τ–γ and read G and the strengths.",
   "ar": "حوّل T–θ إلى τ–γ واستخرج G والمقاومات."
  }
 ],
 "results": {
  "en": "Shear modulus G (from the elastic slope), shear yield strength, modulus of rupture in torsion, and the fracture mode.",
  "ar": "معامل القص G (من الميل المرن) وحد خضوع القص ومعامل الانكسار في اللي ونمط الكسر."
 },
 "terms": [
  [
   {
    "en": "Torque T",
    "ar": "العزم T"
   },
   {
    "en": "the twisting effect of a force: force × distance. Unit: N·m.",
    "ar": "مفعول اللي للقوة: القوة × المسافة. الوحدة: N·m."
   }
  ],
  [
   {
    "en": "Angle of twist θ",
    "ar": "زاوية اللي θ"
   },
   {
    "en": "how many radians (or degrees) one end turns relative to the other.",
    "ar": "عدد الراديانات (أو الدرجات) التي يدورها طرف بالنسبة للآخر."
   }
  ],
  [
   {
    "en": "Shear modulus G",
    "ar": "معامل القص G"
   },
   {
    "en": "the stiffness in shear; steel ≈ 80 GPa.",
    "ar": "الصلابة في القص؛ الفولاذ ≈ 80 GPa."
   }
  ],
  [
   {
    "en": "Polar moment J",
    "ar": "عزم القصور القطبي J"
   },
   {
    "en": "a number that depends only on the section shape; it tells how well a round bar resists twisting.",
    "ar": "رقم يعتمد على شكل المقطع فقط؛ يبيّن مدى مقاومة القضيب الدائري للي."
   }
  ]
 ],
 "eqs": [
  {
   "l": {
    "en": "Polar moment of a solid round bar",
    "ar": "عزم القصور القطبي لقضيب دائري مصمت"
   },
   "e": "J = π · d⁴ / 32",
   "v": [
    [
     "J",
     {
      "en": "polar moment of area (mm⁴)",
      "ar": "عزم القصور القطبي (mm⁴)"
     }
    ],
    [
     "d",
     {
      "en": "diameter (mm)",
      "ar": "القطر (mm)"
     }
    ]
   ],
   "n": {
    "en": "Example: d = 20 mm → J = 15 708 mm⁴.",
    "ar": "مثال: d = 20 مم ← J = 15 708 mm⁴."
   }
  },
  {
   "l": {
    "en": "Shear stress at the surface",
    "ar": "إجهاد القص عند السطح"
   },
   "e": "τ_max = T · r / J = 16 · T / ( π · d³ )",
   "v": [
    [
     "τ_max",
     {
      "en": "largest shear stress (MPa)",
      "ar": "أكبر إجهاد قص (MPa)"
     }
    ],
    [
     "T",
     {
      "en": "torque (N·mm; 1 N·m = 1000 N·mm)",
      "ar": "العزم (N·mm؛ 1 N·m = 1000 N·mm)"
     }
    ],
    [
     "r",
     {
      "en": "radius = d/2 (mm)",
      "ar": "نصف القطر = d/2 (mm)"
     }
    ]
   ],
   "n": {
    "en": "Inside the bar: τ = T·ρ / J, where ρ is the distance from the axis.",
    "ar": "داخل القضيب: τ = T·ρ / J حيث ρ البعد عن المحور."
   }
  },
  {
   "l": {
    "en": "Angle of twist",
    "ar": "زاوية اللي"
   },
   "e": "θ = T · L / ( G · J )",
   "v": [
    [
     "θ",
     {
      "en": "angle of twist (radians; × 57.3 for degrees)",
      "ar": "زاوية اللي (راديان؛ × 57.3 للدرجات)"
     }
    ],
    [
     "L",
     {
      "en": "length of the twisted part (mm)",
      "ar": "طول الجزء الملتوي (mm)"
     }
    ],
    [
     "G",
     {
      "en": "shear modulus (MPa)",
      "ar": "معامل القص (MPa)"
     }
    ]
   ],
   "n": {
    "en": "",
    "ar": ""
   }
  },
  {
   "l": {
    "en": "Shear modulus from the test",
    "ar": "معامل القص من الاختبار"
   },
   "e": "G = T · L / ( J · θ )",
   "v": [],
   "n": {
    "en": "The same equation rearranged: measure T and θ, then calculate G.",
    "ar": "المعادلة نفسها بعد إعادة ترتيبها: نقيس T وθ ثم نحسب G."
   }
  },
  {
   "l": {
    "en": "Shear strain at the surface",
    "ar": "انفعال القص عند السطح"
   },
   "e": "γ = r · θ / L",
   "v": [
    [
     "γ",
     {
      "en": "shear strain (no unit)",
      "ar": "انفعال القص (بلا وحدة)"
     }
    ]
   ],
   "n": {
    "en": "",
    "ar": ""
   }
  },
  {
   "l": {
    "en": "Thin-walled tube",
    "ar": "أنبوب رقيق الجدار"
   },
   "e": "τ ≈ T / ( 2 · π · r² · t )",
   "v": [
    [
     "r",
     {
      "en": "mean radius of the tube (mm)",
      "ar": "متوسط نصف قطر الأنبوب (mm)"
     }
    ],
    [
     "t",
     {
      "en": "wall thickness (mm)",
      "ar": "سماكة الجدار (mm)"
     }
    ]
   ],
   "n": {
    "en": "The stress is almost the same across the thin wall.",
    "ar": "الإجهاد متقارب عبر الجدار الرقيق."
   }
  }
 ],
 "example": {
  "title": {
   "en": "Worked example: steel shaft",
   "ar": "مثال محلول: عمود فولاذ"
  },
  "steps": [
   {
    "en": "Shaft d = 20 mm, L = 250 mm, torque T = 100 N·m = 100 000 N·mm, G = 80 GPa = 80 000 MPa.",
    "ar": "العمود d = 20 مم وL = 250 مم وعزم T = 100 N·m = 100 000 N·mm وG = 80 GPa = 80 000 MPa."
   },
   {
    "en": "J = π·20⁴/32 = 15 708 mm⁴.",
    "ar": "J = π·20⁴/32 = 15 708 mm⁴."
   },
   {
    "en": "τ_max = 16·100 000 / (π·20³) = 63.7 MPa.",
    "ar": "τ_max = 16·100 000 / (π·20³) = 63.7 MPa."
   },
   {
    "en": "θ = T·L/(G·J) = 100 000·250 / (80 000·15 708) = 0.0199 rad = 1.14°.",
    "ar": "θ = T·L/(G·J) = 100 000·250 / (80 000·15 708) = 0.0199 rad = 1.14°."
   }
  ],
  "result": {
   "en": "τ_max ≈ 63.7 MPa at the surface and a twist of about 1.14° over 250 mm.",
   "ar": "τ_max ≈ 63.7 MPa عند السطح ولي نحو 1.14° على 250 مم."
  }
 },
 "pitfalls": [
  {
   "en": "The formulas are elastic: beyond yield τ = 16T/(πd³) overestimates the true surface stress (plastic correction needed).",
   "ar": "الصيغ مرنة: بعد الخضوع تبالغ τ = 16T/(πd³) في الإجهاد السطحي الحقيقي (يلزم تصحيح لدن)."
  },
  {
   "en": "Angle measured at the machine head includes grip slip and end compliance; use a torsiometer on the gauge length.",
   "ar": "الزاوية المقيسة عند رأس الآلة تشمل انزلاق الفكوك ومرونة الطرفين؛ استعمل مقياس لي على الطول القياسي."
  },
  {
   "en": "Axial load or bending from misalignment contaminates the pure-torsion state.",
   "ar": "الحمل المحوري أو الانحناء الناتج عن عدم المحاذاة يفسدان حالة اللي النقي."
  }
 ],
 "notConfuse": {
  "en": "Torsion is not direct shear. Torsion twists a long bar and the shear stress changes with the radius; direct shear cuts a short section. The torsion test is the one that gives G.",
  "ar": "اللي ليس القص المباشر. اللي يبرم قضيباً طويلاً ويتغير إجهاد القص مع نصف القطر، أما القص المباشر فيقطع مقطعاً قصيراً. واختبار اللي هو الذي يعطي G."
 },
 "apps": [
  {
   "en": "Shafts, axles, drive and propeller shafts, springs and drill bits.",
   "ar": "الأعمدة والمحاور وأعمدة النقل والمراوح والنوابض وريش الثقب."
  },
  {
   "en": "Determining G for materials, wires and fibres.",
   "ar": "تحديد G للمواد والأسلاك والألياف."
  },
  {
   "en": "Studying large plastic deformation and torsional fatigue.",
   "ar": "دراسة التشوه اللدن الكبير وكلل اللي."
  }
 ],
 "figs": [
  {
   "k": "torsionSetup",
   "cap": {
    "en": "The example shaft (d = 20 mm, L = 250 mm) twisted by a torque T. A straight line drawn along the bar becomes a helix.",
    "ar": "عمود المثال (d = 20 مم وL = 250 مم) ملتوياً بعزم T. الخط المستقيم المرسوم على طول القضيب يصبح حلزونياً."
   }
  },
  {
   "k": "torsionStress",
   "cap": {
    "en": "Shear stress across the radius for T = 100 N·m: it grows in a straight line from 0 on the axis to τ_max = 63.7 MPa at the surface (r = 10 mm).",
    "ar": "إجهاد القص على نصف القطر عند T = 100 N·m: يزداد خطياً من 0 على المحور إلى τ_max = 63.7 MPa عند السطح (r = 10 مم)."
   }
  },
  {
   "k": "torsionTq",
   "cap": {
    "en": "Torque against twist angle for the example (G = 80 GPa): a straight line, 100 N·m gives θ = 1.14° over 250 mm. The slope is G·J/L.",
    "ar": "العزم مقابل زاوية اللي للمثال (G = 80 GPa): خط مستقيم، 100 N·m يعطي θ = 1.14° على 250 مم. والميل هو G·J/L."
   }
  }
 ],
 "see": [
  "shear",
  "tensile"
 ]
});
})();
