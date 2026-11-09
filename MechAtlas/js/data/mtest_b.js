/* Materials Testing section: content, part B: the three hardness tests (Brinell, Vickers, Rockwell). Generated from the reviewed source; figures are referenced by key and resolved from window.MT_SVG. */
(function () {
    'use strict';
    const M = window.MTEST = window.MTEST || { cats: [], tests: [] };
M.tests.push({
 "id": "brinell",
 "cat": "hardness",
 "icon": "fa-circle",
 "name": {
  "en": "Brinell hardness test (HBW)",
  "ar": "اختبار برينل للصلادة (HBW)"
 },
 "short": {
  "en": "A hard ball makes a round dent; the hardness is the load divided by the dent area. Best for coarse metals such as castings.",
  "ar": "تصنع كرة صلدة أثراً دائرياً؛ والصلادة هي الحمل مقسوماً على مساحة الأثر. الأنسب للمعادن الخشنة كالمسبوكات."
 },
 "gist": {
  "en": "Press a hard ball into the metal, measure the width of the round dent, and calculate the hardness.",
  "ar": "نضغط كرة صلدة في المعدن ونقيس عرض الأثر الدائري ونحسب الصلادة."
 },
 "std": "ISO 6506-1 · ASTM E10",
 "purpose": {
  "en": "To get a quick number for how hard a metal is. Brinell makes a large dent, so it averages over a big area. That is why it suits castings, forgings and other metals whose structure is coarse and uneven.",
  "ar": "للحصول على رقم سريع لمدى صلادة المعدن. يترك برينل أثراً كبيراً فيأخذ متوسطاً على مساحة كبيرة، ولذلك يناسب المسبوكات والمطروقات وغيرها من المعادن ذات البنية الخشنة غير المنتظمة."
 },
 "principle": {
  "en": "A ball of hard material (tungsten carbide, written HBW) of diameter D is pressed into the surface with a force F and held for 10–15 seconds. After the load is removed, we measure the diameter d of the round dent with a microscope. A bigger dent means a softer metal. The Brinell number is the force divided by the curved surface area of the dent.",
  "ar": "تُضغط كرة من مادة صلدة (كربيد التنغستن ويُرمز HBW) قطرها D في السطح بقوة F وتُترك 10–15 ثانية. بعد إزالة الحمل نقيس قطر الأثر الدائري d بمجهر. الأثر الأكبر يعني معدناً أطرى. ورقم برينل هو القوة مقسومة على مساحة سطح الأثر المنحني."
 },
 "apparatus": {
  "en": "A hardness tester that applies the force (for steel usually 3000 kgf = 29.42 kN), a carbide ball of D = 10 mm, and a measuring microscope for the dent diameter.",
  "ar": "جهاز صلادة يطبّق القوة (للفولاذ غالباً 3000 kgf = 29.42 kN) وكرة كربيد D = 10 مم ومجهر قياس لقطر الأثر."
 },
 "specimen": {
  "en": "A flat, clean, smooth surface, thick enough that the dent does not show on the back (the standard asks for a thickness of at least 8 times the dent depth). Keep the dents far from the edge and from each other: at least 2.5 times the dent diameter from the edge and 3 times between dents.",
  "ar": "سطح مستوٍ نظيف أملس وسماكة كافية كي لا يظهر الأثر على الوجه الخلفي (يشترط المعيار سماكة لا تقل عن 8 أضعاف عمق الأثر). وأبعِد الآثار عن الحافة وعن بعضها: مسافة لا تقل عن 2.5 ضعف قطر الأثر عن الحافة و3 أضعاف بين الأثرين."
 },
 "procedure": [
  {
   "en": "Grind the surface flat and clean it. Put the specimen firmly on the anvil.",
   "ar": "اطحن السطح مستوياً ونظّفه. ضع العينة بثبات على السندان."
  },
  {
   "en": "Bring the ball to the surface and apply the force smoothly. Hold it for 10–15 s.",
   "ar": "قرّب الكرة من السطح وطبّق القوة بسلاسة. أبقِها 10–15 ث."
  },
  {
   "en": "Remove the force. Measure the dent diameter in two directions at right angles and take the average d.",
   "ar": "أزل القوة. قِس قطر الأثر باتجاهين متعامدين وخذ المتوسط d."
  },
  {
   "en": "Check that d is between 0.24·D and 0.6·D; if not, change the force.",
   "ar": "تأكد أن d بين 0.24·D و0.6·D؛ وإلا غيّر القوة."
  },
  {
   "en": "Calculate HBW (or read it from the standard table) and write the full name, for example 229 HBW 10/3000.",
   "ar": "احسب HBW (أو اقرأه من جدول المعيار) واكتب الاسم الكامل مثل 229 HBW 10/3000."
  }
 ],
 "results": {
  "en": "One hardness number, written with the ball size and the force: for example \"229 HBW 10/3000\" means 229, carbide ball 10 mm, force 3000 kgf. For steels it gives a rough estimate of the tensile strength.",
  "ar": "رقم صلادة واحد يُكتب مع حجم الكرة والقوة: فمثلاً «229 HBW 10/3000» تعني 229 وكرة كربيد 10 مم وقوة 3000 kgf. وفي الفولاذ يعطي تقديراً تقريبياً لمقاومة الشد."
 },
 "terms": [
  [
   {
    "en": "Hardness",
    "ar": "الصلادة"
   },
   {
    "en": "how well the surface resists being dented or scratched. It is not the same as strength or toughness.",
    "ar": "مدى مقاومة السطح للانغراس أو الخدش. وليست المقاومة ولا المتانة."
   }
  ],
  [
   {
    "en": "Indenter",
    "ar": "الغارز"
   },
   {
    "en": "the very hard tip (ball, pyramid or cone) that is pressed into the surface.",
    "ar": "الرأس الصلد جداً (كرة أو هرم أو مخروط) الذي يُضغط في السطح."
   }
  ],
  [
   {
    "en": "Indentation (imprint)",
    "ar": "الأثر (الانغراس)"
   },
   {
    "en": "the small permanent dent left in the surface.",
    "ar": "التجويف الدائم الصغير الذي يبقى في السطح."
   }
  ],
  [
   {
    "en": "HBW",
    "ar": "HBW"
   },
   {
    "en": "Brinell hardness measured with a tungsten-carbide (W) ball.",
    "ar": "صلادة برينل المقاسة بكرة كربيد التنغستن (W)."
   }
  ],
  [
   {
    "en": "kgf",
    "ar": "kgf"
   },
   {
    "en": "kilogram-force, the old unit of force: 1 kgf = 9.807 N.",
    "ar": "كيلوغرام-قوة، وحدة القوة القديمة: 1 kgf = 9.807 N."
   }
  ]
 ],
 "eqs": [
  {
   "l": {
    "en": "Brinell hardness",
    "ar": "صلادة برينل"
   },
   "e": "HBW = 0.102 · 2 · F / ( π · D · ( D − √(D² − d²) ) )",
   "v": [
    [
     "HBW",
     {
      "en": "Brinell hardness number (no unit is written)",
      "ar": "رقم صلادة برينل (لا تُكتب وحدة)"
     }
    ],
    [
     "F",
     {
      "en": "test force (N)",
      "ar": "قوة الاختبار (N)"
     }
    ],
    [
     "D",
     {
      "en": "ball diameter (mm)",
      "ar": "قطر الكرة (mm)"
     }
    ],
    [
     "d",
     {
      "en": "dent diameter (mm)",
      "ar": "قطر الأثر (mm)"
     }
    ],
    [
     "0.102",
     {
      "en": "= 1/9.81: converts N to kgf so the number matches the old tables",
      "ar": "= 1/9.81: يحوّل N إلى kgf ليطابق الرقم الجداول القديمة"
     }
    ]
   ],
   "n": {
    "en": "Valid when 0.24·D < d < 0.6·D.",
    "ar": "صالحة عند 0.24·D < d < 0.6·D."
   }
  },
  {
   "l": {
    "en": "Choosing the force (so that the dent size is right)",
    "ar": "اختيار القوة (ليكون حجم الأثر مناسباً)"
   },
   "e": "F [kgf] = k · D²",
   "v": [
    [
     "k",
     {
      "en": "30 for steel and cast iron, 10 for copper alloys, 5 for aluminium alloys",
      "ar": "30 للفولاذ وحديد الزهر و10 لسبائك النحاس و5 لسبائك الألمنيوم"
     }
    ]
   ],
   "n": {
    "en": "With D = 10 mm and k = 30: F = 3000 kgf.",
    "ar": "مع D = 10 مم وk = 30: F = 3000 kgf."
   }
  },
  {
   "l": {
    "en": "Rough tensile strength of steels",
    "ar": "مقاومة الشد التقريبية للفولاذ"
   },
   "e": "σ_u ≈ 3.45 · HB",
   "v": [
    [
     "σ_u",
     {
      "en": "ultimate tensile strength (MPa)",
      "ar": "مقاومة الشد القصوى (MPa)"
     }
    ],
    [
     "HB",
     {
      "en": "Brinell number",
      "ar": "رقم برينل"
     }
    ]
   ],
   "n": {
    "en": "A rule of thumb for steels only, not a test result.",
    "ar": "قاعدة تقريبية للفولاذ فقط وليست نتيجة اختبار."
   }
  }
 ],
 "example": {
  "title": {
   "en": "Worked example: steel part",
   "ar": "مثال محلول: قطعة فولاذ"
  },
  "steps": [
   {
    "en": "D = 10 mm, F = 3000 kgf = 29 420 N, measured d = 4.0 mm.",
    "ar": "D = 10 مم وF = 3000 kgf = 29 420 N وd المقيس = 4.0 مم."
   },
   {
    "en": "√(D² − d²) = √(100 − 16) = 9.165 mm, so D − 9.165 = 0.835 mm.",
    "ar": "√(D² − d²) = √(100 − 16) = 9.165 مم، إذن D − 9.165 = 0.835 مم."
   },
   {
    "en": "Denominator: π · 10 · 0.835 = 26.2.",
    "ar": "المقام: π · 10 · 0.835 = 26.2."
   },
   {
    "en": "HBW = 0.102 · 2 · 29 420 / 26.2 = 6000 / 26.2 ≈ 229.",
    "ar": "HBW = 0.102 · 2 · 29 420 / 26.2 = 6000 / 26.2 ≈ 229."
   },
   {
    "en": "Estimated strength: σ_u ≈ 3.45 × 229 ≈ 790 MPa.",
    "ar": "المقاومة المقدّرة: σ_u ≈ 3.45 × 229 ≈ 790 MPa."
   }
  ],
  "result": {
   "en": "229 HBW 10/3000 (a medium-hard steel, σ_u about 790 MPa).",
   "ar": "229 HBW 10/3000 (فولاذ متوسط الصلادة وσ_u نحو 790 MPa)."
  }
 },
 "pitfalls": [
  {
   "en": "The result is meaningless without the ball size and the force (write 229 HBW 10/3000).",
   "ar": "النتيجة بلا معنى دون حجم الكرة والقوة (اكتب 229 HBW 10/3000)."
  },
  {
   "en": "A rough surface or a dent near the edge gives a wrong diameter.",
   "ar": "السطح الخشن أو الأثر قرب الحافة يعطيان قطراً خاطئاً."
  },
  {
   "en": "The big ball is too large for thin sheets and thin hardened layers: use Vickers or Rockwell instead.",
   "ar": "الكرة الكبيرة أكبر من اللازم للصفائح الرقيقة والطبقات المقسّاة الرقيقة: استعمل فيكرز أو روكويل."
  },
  {
   "en": "A very hard steel can flatten the ball and give a low reading: use Vickers or Rockwell C for hardened steel.",
   "ar": "قد يفلطح الفولاذ الشديد الصلادة الكرة ويعطي قراءة منخفضة: استعمل فيكرز أو روكويل C للفولاذ المقسّى."
  }
 ],
 "notConfuse": {
  "en": "Hardness is not strength and not toughness: a very hard steel can be brittle. In Arabic: الصلادة = hardness, الصلابة = stiffness, المتانة = toughness. Brinell numbers (HBW) cannot be compared directly with Vickers or Rockwell numbers; only conversion tables, which are approximate, relate them.",
  "ar": "الصلادة ليست المقاومة وليست المتانة: فالفولاذ الشديد الصلادة قد يكون قصفاً. وبالعربية: الصلادة = hardness والصلابة = stiffness والمتانة = toughness. ولا تُقارَن أرقام برينل (HBW) مباشرة بأرقام فيكرز أو روكويل؛ وإنما تربط بينها جداول تحويل تقريبية."
 },
 "apps": [
  {
   "en": "Castings, forgings and bar stock (large dents average the coarse structure).",
   "ar": "المسبوكات والمطروقات وقضبان الخام (الأثر الكبير يأخذ متوسط البنية الخشنة)."
  },
  {
   "en": "Quick acceptance check of delivered steel and a rough estimate of its strength.",
   "ar": "فحص قبول سريع للفولاذ المسلَّم وتقدير تقريبي لمقاومته."
  },
  {
   "en": "Soft and medium-hard metals: aluminium, copper, annealed and normalised steel.",
   "ar": "المعادن الطرية ومتوسطة الصلادة: الألمنيوم والنحاس والفولاذ المُخمَّر والمُطبَّع."
  }
 ],
 "figs": [
  {
   "k": "brinellGeom",
   "cap": {
    "en": "The ball (D = 10 mm) pressed into the metal, and the dent left after the load is removed (d = 4 mm, depth h = 0.42 mm). Both drawn to the same scale.",
    "ar": "الكرة (D = 10 مم) مضغوطة في المعدن، والأثر الباقي بعد إزالة الحمل (d = 4 مم وعمق h = 0.42 مم). كلاهما بمقياس الرسم نفسه."
   }
  },
  {
   "k": "brinellPlot",
   "cap": {
    "en": "HBW against the dent diameter d, calculated from the equation for D = 10 mm and F = 3000 kgf. The bigger the dent, the lower the hardness. The marked point is the worked example (d = 4.0 mm → 229).",
    "ar": "قيمة HBW مقابل قطر الأثر d محسوبة من المعادلة عند D = 10 مم وF = 3000 kgf. كلما كبر الأثر انخفضت الصلادة. والنقطة المعلّمة هي المثال المحلول (d = 4.0 مم ← 229)."
   }
  }
 ],
 "see": [
  "vickers",
  "rockwell",
  "tensile"
 ]
});
M.tests.push({
 "id": "vickers",
 "cat": "hardness",
 "icon": "fa-diamond",
 "name": {
  "en": "Vickers hardness test (HV)",
  "ar": "اختبار فيكرز للصلادة (HV)"
 },
 "short": {
  "en": "A diamond pyramid makes a square dent; one scale for all materials, soft or hard, thick or thin.",
  "ar": "يصنع هرم ماسي أثراً مربعاً؛ مقياس واحد لكل المواد، الطرية والصلدة، السميكة والرقيقة."
 },
 "gist": {
  "en": "Press a small diamond pyramid into the surface, measure the two diagonals of the square dent, and calculate the hardness.",
  "ar": "نضغط هرماً ماسياً صغيراً في السطح ونقيس قطري الأثر المربع ونحسب الصلادة."
 },
 "std": "ISO 6507-1 · ASTM E92 (micro: ASTM E384)",
 "purpose": {
  "en": "To measure hardness with one scale for every material, from soft metals to hardened steel and ceramics. Because the dent is small and the force can be small, Vickers also measures thin layers and tiny areas, for example the hardened layer on a gear tooth.",
  "ar": "لقياس الصلادة بمقياس واحد لكل المواد من المعادن الطرية إلى الفولاذ المقسّى والسيراميك. ولأن الأثر صغير والقوة يمكن أن تكون صغيرة، يقيس فيكرز أيضاً الطبقات الرقيقة والمساحات الصغيرة، مثل الطبقة المقسّاة على سن مسنن."
 },
 "principle": {
  "en": "A diamond in the shape of a square pyramid (the angle between opposite faces is 136°) is pressed into the polished surface with a force F for 10–15 s. The dent is a small square. We measure its two diagonals d₁ and d₂ with a microscope. The Vickers number is the force divided by the surface area of the dent. Because the pyramid always has the same shape, the number does not depend on the force (for normal loads).",
  "ar": "يُضغط ماس على شكل هرم قاعدته مربعة (الزاوية بين وجهين متقابلين 136°) في السطح المصقول بقوة F مدة 10–15 ث. الأثر مربع صغير. نقيس قطريه d₁ وd₂ بمجهر. ورقم فيكرز هو القوة مقسومة على مساحة سطح الأثر. ولأن الهرم له الشكل نفسه دائماً فلا يعتمد الرقم على القوة (في الأحمال العادية)."
 },
 "apparatus": {
  "en": "A hardness tester with a diamond pyramid and a measuring microscope. Forces from a few grams (micro-hardness) up to about 100 kgf (HV100).",
  "ar": "جهاز صلادة بهرم ماسي ومجهر قياس. القوى من غرامات قليلة (الصلادة المجهرية) إلى نحو 100 kgf (HV100)."
 },
 "specimen": {
  "en": "A flat, polished surface (a rough surface makes the diagonals hard to read). The thickness must be at least 1.5 times the diagonal d. Keep the dents at least 2.5 diagonals from the edge and 3 diagonals from each other (for steel).",
  "ar": "سطح مستوٍ مصقول (السطح الخشن يصعّب قراءة القطرين). يجب ألا تقل السماكة عن 1.5 ضعف القطر d. وأبعِد الآثار 2.5 قطر على الأقل عن الحافة و3 أقطار عن بعضها (للفولاذ)."
 },
 "procedure": [
  {
   "en": "Polish the surface so that the dent edges are sharp and clear.",
   "ar": "اصقل السطح لتكون حواف الأثر حادة وواضحة."
  },
  {
   "en": "Choose the force (for example 30 kgf) and apply it smoothly. Hold it for 10–15 s.",
   "ar": "اختر القوة (مثلاً 30 kgf) وطبّقها بسلاسة. أبقِها 10–15 ث."
  },
  {
   "en": "Remove the force. Measure the two diagonals d₁ and d₂ with the microscope.",
   "ar": "أزل القوة. قِس القطرين d₁ وd₂ بالمجهر."
  },
  {
   "en": "Take d = (d₁ + d₂) / 2 and calculate HV (or read the table).",
   "ar": "خذ d = (d₁ + d₂) / 2 واحسب HV (أو اقرأ الجدول)."
  },
  {
   "en": "Write the result with the force: for example 223 HV30.",
   "ar": "اكتب النتيجة مع القوة: مثلاً 223 HV30."
  }
 ],
 "results": {
  "en": "A hardness number with the force: \"223 HV30\" means 223, tested with 30 kgf. The two diagonals should be nearly equal; if they differ a lot, the specimen is tilted or the metal is not uniform.",
  "ar": "رقم صلادة مع القوة: «223 HV30» تعني 223 باختبار بقوة 30 kgf. ويجب أن يتقارب القطران؛ وإن اختلفا كثيراً فالعينة مائلة أو المعدن غير متجانس."
 },
 "terms": [
  [
   {
    "en": "Hardness",
    "ar": "الصلادة"
   },
   {
    "en": "how well the surface resists being dented or scratched. It is not the same as strength or toughness.",
    "ar": "مدى مقاومة السطح للانغراس أو الخدش. وليست المقاومة ولا المتانة."
   }
  ],
  [
   {
    "en": "Indenter",
    "ar": "الغارز"
   },
   {
    "en": "the very hard tip (ball, pyramid or cone) that is pressed into the surface.",
    "ar": "الرأس الصلد جداً (كرة أو هرم أو مخروط) الذي يُضغط في السطح."
   }
  ],
  [
   {
    "en": "Indentation (imprint)",
    "ar": "الأثر (الانغراس)"
   },
   {
    "en": "the small permanent dent left in the surface.",
    "ar": "التجويف الدائم الصغير الذي يبقى في السطح."
   }
  ],
  [
   {
    "en": "Diagonal d₁, d₂",
    "ar": "القطران d₁ وd₂"
   },
   {
    "en": "the two lines from corner to corner of the square dent.",
    "ar": "الخطان من زاوية إلى زاوية في الأثر المربع."
   }
  ],
  [
   {
    "en": "Micro-hardness",
    "ar": "الصلادة المجهرية"
   },
   {
    "en": "Vickers with very small forces to test tiny areas or thin layers.",
    "ar": "فيكرز بقوى صغيرة جداً لاختبار مساحات صغيرة أو طبقات رقيقة."
   }
  ],
  [
   {
    "en": "Case depth",
    "ar": "عمق الطبقة المقسّاة"
   },
   {
    "en": "how deep the hardened surface layer goes.",
    "ar": "مدى عمق طبقة السطح المقسّاة."
   }
  ]
 ],
 "eqs": [
  {
   "l": {
    "en": "Average diagonal",
    "ar": "متوسط القطر"
   },
   "e": "d = ( d₁ + d₂ ) / 2",
   "v": [
    [
     "d₁, d₂",
     {
      "en": "the two diagonals of the dent (mm)",
      "ar": "قطرا الأثر (mm)"
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
    "en": "Vickers hardness (force in newtons)",
    "ar": "صلادة فيكرز (القوة بالنيوتن)"
   },
   "e": "HV = 0.1891 · F / d²",
   "v": [
    [
     "HV",
     {
      "en": "Vickers hardness number",
      "ar": "رقم صلادة فيكرز"
     }
    ],
    [
     "F",
     {
      "en": "test force (N)",
      "ar": "قوة الاختبار (N)"
     }
    ],
    [
     "d",
     {
      "en": "average diagonal (mm)",
      "ar": "متوسط القطر (mm)"
     }
    ]
   ],
   "n": {
    "en": "If the force is in kgf: HV = 1.8544 · F / d².",
    "ar": "إن كانت القوة بـ kgf: HV = 1.8544 · F / d²."
   }
  },
  {
   "l": {
    "en": "Depth of the dent (for the thickness check)",
    "ar": "عمق الأثر (لفحص السماكة)"
   },
   "e": "h ≈ d / 7",
   "v": [
    [
     "h",
     {
      "en": "depth of the dent (mm)",
      "ar": "عمق الأثر (mm)"
     }
    ]
   ],
   "n": {
    "en": "The specimen must be thick enough: at least 1.5·d.",
    "ar": "يجب أن تكون العينة سميكة كفاية: 1.5·d على الأقل."
   }
  }
 ],
 "example": {
  "title": {
   "en": "Worked example: steel",
   "ar": "مثال محلول: فولاذ"
  },
  "steps": [
   {
    "en": "Force F = 30 kgf = 294.2 N. Measured diagonals d₁ = d₂ = 0.50 mm, so d = 0.50 mm.",
    "ar": "القوة F = 30 kgf = 294.2 N. القطران المقيسان d₁ = d₂ = 0.50 مم إذن d = 0.50 مم."
   },
   {
    "en": "HV = 0.1891 × 294.2 / 0.50² = 55.63 / 0.25 = 222.5 ≈ 223.",
    "ar": "HV = 0.1891 × 294.2 / 0.50² = 55.63 / 0.25 = 222.5 ≈ 223."
   },
   {
    "en": "Check: with kgf, 1.8544 × 30 / 0.25 = 222.5 ✓.",
    "ar": "تحقق: بوحدة kgf يكون 1.8544 × 30 / 0.25 = 222.5 ✓."
   },
   {
    "en": "Minimum thickness: 1.5 × 0.50 = 0.75 mm.",
    "ar": "أقل سماكة: 1.5 × 0.50 = 0.75 مم."
   }
  ],
  "result": {
   "en": "223 HV30.",
   "ar": "223 HV30."
  }
 },
 "pitfalls": [
  {
   "en": "Always give the force (HV30, HV10…). With small forces the number can change with the force.",
   "ar": "اذكر دائماً القوة (HV30 وHV10…). وعند القوى الصغيرة قد يتغير الرقم مع القوة."
  },
  {
   "en": "Reading the corners of the dent by eye is the main error: use good light and a good microscope.",
   "ar": "قراءة زوايا الأثر بالعين هي الخطأ الرئيسي: استعمل إضاءة ومجهراً جيدين."
  },
  {
   "en": "A dent too close to the edge or to another dent gives a falsely low or high value.",
   "ar": "الأثر القريب جداً من الحافة أو من أثر آخر يعطي قيمة منخفضة أو مرتفعة زائفة."
  },
  {
   "en": "Vibration or a tilted surface makes the dent lopsided (d₁ very different from d₂).",
   "ar": "الاهتزاز أو السطح المائل يجعل الأثر مائلاً (d₁ يختلف كثيراً عن d₂)."
  }
 ],
 "notConfuse": {
  "en": "Vickers (HV) and Brinell (HB) give similar numbers for soft and medium metals (up to about 350), but they are different tests and above that Brinell reads lower. Vickers is not Rockwell. Hardness is not toughness: a very hard material can be brittle.",
  "ar": "يعطي فيكرز (HV) وبرينل (HB) أرقاماً متقاربة للمعادن الطرية ومتوسطة الصلادة (حتى نحو 350)، لكنهما اختباران مختلفان وفوق ذلك يقرأ برينل أقل. وفيكرز ليس روكويل. والصلادة ليست المتانة: فالمادة الشديدة الصلادة قد تكون قصفة."
 },
 "apps": [
  {
   "en": "Thin sheets, wires and small parts.",
   "ar": "الصفائح الرقيقة والأسلاك والقطع الصغيرة."
  },
  {
   "en": "Depth of the hardened layer on carburised or nitrided parts: a row of dents from the surface inwards (hardness profile).",
   "ar": "عمق الطبقة المقسّاة على القطع المكربنة أو المنتردة: صف من الآثار من السطح إلى الداخل (مقطع الصلادة)."
  },
  {
   "en": "Welds and the heat-affected zone, and research on small grains or phases (micro-hardness).",
   "ar": "اللحامات والمنطقة المتأثرة بالحرارة، وأبحاث الحبيبات أو الأطوار الصغيرة (الصلادة المجهرية)."
  }
 ],
 "figs": [
  {
   "k": "vickersGeom",
   "cap": {
    "en": "The 136° diamond pyramid in the metal, drawn to scale for d = 0.50 mm (depth only 0.071 mm), and the square dent seen from above with its two diagonals.",
    "ar": "الهرم الماسي 136° في المعدن مرسوماً بمقياس رسم عند d = 0.50 مم (العمق 0.071 مم فقط)، والأثر المربع من الأعلى مع قطريه."
   }
  },
  {
   "k": "vickersPlot",
   "cap": {
    "en": "HV against the average diagonal d, calculated for F = 30 kgf. A larger diagonal means a softer metal. The marked point is the worked example (d = 0.50 mm → 223).",
    "ar": "قيمة HV مقابل متوسط القطر d محسوبة عند F = 30 kgf. القطر الأكبر يعني معدناً أطرى. والنقطة المعلّمة هي المثال المحلول (d = 0.50 مم ← 223)."
   }
  }
 ],
 "see": [
  "brinell",
  "rockwell",
  "tensile"
 ]
});
M.tests.push({
 "id": "rockwell",
 "cat": "hardness",
 "icon": "fa-gauge",
 "name": {
  "en": "Rockwell hardness test (HR)",
  "ar": "اختبار روكويل للصلادة (HR)"
 },
 "short": {
  "en": "The fastest hardness test: you read the number straight from the machine, no microscope needed.",
  "ar": "أسرع اختبار صلادة: تقرأ الرقم مباشرة من الجهاز دون مجهر."
 },
 "gist": {
  "en": "Press a cone or ball in two steps and read the hardness directly from how deep it stays in.",
  "ar": "نضغط مخروطاً أو كرة على خطوتين ونقرأ الصلادة مباشرة من العمق الذي يبقى مغروساً."
 },
 "std": "ISO 6508-1 · ASTM E18",
 "purpose": {
  "en": "To get a hardness number in a few seconds, with no measuring microscope. That is why Rockwell is the usual test in workshops and production lines, especially for hardened steel (scale C).",
  "ar": "للحصول على رقم صلادة في ثوانٍ دون مجهر قياس. ولهذا فإن روكويل هو الاختبار المعتاد في الورش وخطوط الإنتاج، خاصة للفولاذ المقسّى (المقياس C)."
 },
 "principle": {
  "en": "Instead of measuring the size of a dent, Rockwell measures how deep the indenter goes. First a small load F₀ (minor load, 10 kgf) seats the indenter and sets the zero. Then a large load F₁ is added, and after a short time removed again, leaving F₀. The extra permanent depth h is what counts: a deeper dent means a softer metal. The machine shows the number on a dial or screen.",
  "ar": "بدل قياس حجم أثر، يقيس روكويل العمق الذي يصل إليه الغارز. أولاً يثبّت حمل صغير F₀ (الحمل الأولي 10 kgf) الغارز ويحدد الصفر. ثم يُضاف حمل كبير F₁ ويُزال بعد وقت قصير ويبقى F₀. وما يهم هو زيادة العمق الدائمة h: العمق الأكبر يعني معدناً أطرى. ويعرض الجهاز الرقم على قرص أو شاشة."
 },
 "apparatus": {
  "en": "A Rockwell tester with a diamond cone (120°) for hard metals or a small steel ball (1/16 inch = 1.588 mm) for soft metals, a dial or digital display, and an anvil. Each scale has its own indenter and total force: HRC uses the cone and 150 kgf; HRB uses the ball and 100 kgf.",
  "ar": "جهاز روكويل بمخروط ماسي (120°) للمعادن الصلدة أو كرة فولاذية صغيرة (1/16 إنش = 1.588 مم) للمعادن الطرية، وقرص أو شاشة رقمية وسندان. ولكل مقياس غارزه وقوته الكلية: HRC يستعمل المخروط و150 kgf؛ وHRB يستعمل الكرة و100 kgf."
 },
 "specimen": {
  "en": "A clean, smooth, flat surface on a firm support. Thick enough (the standard asks for at least about 10 times the dent depth), and the dents at least 3 dent diameters apart and well away from the edge. Thin sheets and thin hardened layers use the \"superficial\" scales (HR15N etc.) with smaller loads.",
  "ar": "سطح نظيف أملس مستوٍ على سند ثابت. سماكة كافية (يشترط المعيار نحو 10 أضعاف عمق الأثر على الأقل) وأن تبعد الآثار عن بعضها 3 أقطار أثر على الأقل وعن الحافة بمسافة كافية. والصفائح الرقيقة والطبقات المقسّاة الرقيقة تستعمل مقاييس «السطحي» (HR15N وغيره) بأحمال أصغر."
 },
 "procedure": [
  {
   "en": "Choose the scale (indenter and force) for the material: C for hardened steel, B for soft steel and brass.",
   "ar": "اختر المقياس (الغارز والقوة) بحسب المادة: C للفولاذ المقسّى وB للفولاذ الطري والنحاس الأصفر."
  },
  {
   "en": "Put the specimen on the anvil and bring it up until the indenter touches and the minor load F₀ is applied. The machine sets the zero.",
   "ar": "ضع العينة على السندان وارفعها حتى يلامس الغارز ويُطبَّق الحمل الأولي F₀. يضبط الجهاز الصفر."
  },
  {
   "en": "The major load F₁ is applied smoothly and held for a few seconds.",
   "ar": "يُطبَّق الحمل الرئيسي F₁ بسلاسة ويُترك بضع ثوانٍ."
  },
  {
   "en": "F₁ is removed (F₀ stays). The permanent extra depth h is measured by the machine.",
   "ar": "يُزال F₁ (ويبقى F₀). يقيس الجهاز زيادة العمق الدائمة h."
  },
  {
   "en": "Read the number from the dial or screen. Take several readings and average them.",
   "ar": "اقرأ الرقم من القرص أو الشاشة. خذ عدة قراءات واحسب المتوسط."
  }
 ],
 "results": {
  "en": "A hardness number with its scale letter: for example \"60 HRC\". The scale must always be written, because 60 HRC and 60 HRB are completely different hardnesses. HRC is meant for roughly 20 to 70 HRC.",
  "ar": "رقم صلادة مع حرف مقياسه: مثل «60 HRC». ويجب كتابة المقياس دائماً لأن 60 HRC و60 HRB صلادتان مختلفتان تماماً. والمقياس HRC مخصص لنحو 20 إلى 70 HRC."
 },
 "terms": [
  [
   {
    "en": "Hardness",
    "ar": "الصلادة"
   },
   {
    "en": "how well the surface resists being dented or scratched. It is not the same as strength or toughness.",
    "ar": "مدى مقاومة السطح للانغراس أو الخدش. وليست المقاومة ولا المتانة."
   }
  ],
  [
   {
    "en": "Indenter",
    "ar": "الغارز"
   },
   {
    "en": "the very hard tip (ball, pyramid or cone) that is pressed into the surface.",
    "ar": "الرأس الصلد جداً (كرة أو هرم أو مخروط) الذي يُضغط في السطح."
   }
  ],
  [
   {
    "en": "Indentation (imprint)",
    "ar": "الأثر (الانغراس)"
   },
   {
    "en": "the small permanent dent left in the surface.",
    "ar": "التجويف الدائم الصغير الذي يبقى في السطح."
   }
  ],
  [
   {
    "en": "Minor load F₀",
    "ar": "الحمل الأولي F₀"
   },
   {
    "en": "the small first load (10 kgf) that seats the indenter and sets the zero.",
    "ar": "الحمل الصغير الأول (10 kgf) الذي يثبّت الغارز ويحدد الصفر."
   }
  ],
  [
   {
    "en": "Major load F₁",
    "ar": "الحمل الرئيسي F₁"
   },
   {
    "en": "the extra large load that makes the real dent.",
    "ar": "الحمل الكبير الإضافي الذي يصنع الأثر الحقيقي."
   }
  ],
  [
   {
    "en": "Scale (A, B, C…)",
    "ar": "المقياس (A وB وC…)"
   },
   {
    "en": "a letter that says which indenter and total force were used.",
    "ar": "حرف يبيّن الغارز والقوة الكلية المستعملين."
   }
  ]
 ],
 "eqs": [
  {
   "l": {
    "en": "Rockwell C (diamond cone, 150 kgf)",
    "ar": "روكويل C (مخروط ماسي، 150 kgf)"
   },
   "e": "HRC = 100 − h / 0.002",
   "v": [
    [
     "HRC",
     {
      "en": "Rockwell C number",
      "ar": "رقم روكويل C"
     }
    ],
    [
     "h",
     {
      "en": "permanent extra depth (mm)",
      "ar": "زيادة العمق الدائمة (mm)"
     }
    ],
    [
     "0.002",
     {
      "en": "one scale point = 0.002 mm of depth",
      "ar": "نقطة مقياس واحدة = 0.002 مم عمق"
     }
    ]
   ],
   "n": {
    "en": "The deeper the dent, the smaller the number.",
    "ar": "كلما كان الأثر أعمق صغر الرقم."
   }
  },
  {
   "l": {
    "en": "Rockwell B (steel ball, 100 kgf)",
    "ar": "روكويل B (كرة فولاذية، 100 kgf)"
   },
   "e": "HRB = 130 − h / 0.002",
   "v": [
    [
     "130",
     {
      "en": "the constant of the B scale",
      "ar": "ثابت المقياس B"
     }
    ]
   ],
   "n": {
    "en": "The same rule with a different constant.",
    "ar": "القاعدة نفسها بثابت مختلف."
   }
  },
  {
   "l": {
    "en": "General form",
    "ar": "الصيغة العامة"
   },
   "e": "HR = N − h / S",
   "v": [
    [
     "N",
     {
      "en": "100 or 130 depending on the scale",
      "ar": "100 أو 130 بحسب المقياس"
     }
    ],
    [
     "S",
     {
      "en": "scale unit: 0.002 mm",
      "ar": "وحدة المقياس: 0.002 مم"
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
   "en": "Worked example: hardened steel",
   "ar": "مثال محلول: فولاذ مقسّى"
  },
  "steps": [
   {
    "en": "Scale C (diamond cone, minor load 10 kgf, total 150 kgf).",
    "ar": "المقياس C (مخروط ماسي وحمل أولي 10 kgf وكلي 150 kgf)."
   },
   {
    "en": "After the major load is removed, the cone stays h = 0.080 mm deeper than at the zero line.",
    "ar": "بعد إزالة الحمل الرئيسي يبقى المخروط أعمق بمقدار h = 0.080 مم عن خط الصفر."
   },
   {
    "en": "h / 0.002 = 0.080 / 0.002 = 40 scale points.",
    "ar": "h / 0.002 = 0.080 / 0.002 = 40 نقطة مقياس."
   },
   {
    "en": "HRC = 100 − 40 = 60.",
    "ar": "HRC = 100 − 40 = 60."
   }
  ],
  "result": {
   "en": "60 HRC: a fully hardened steel (such as a cutting tool).",
   "ar": "60 HRC: فولاذ مقسّى تماماً (مثل أداة قطع)."
  }
 },
 "pitfalls": [
  {
   "en": "Always write the scale letter: the number alone means nothing.",
   "ar": "اكتب حرف المقياس دائماً: الرقم وحده لا يعني شيئاً."
  },
  {
   "en": "A soft support, dirt under the specimen or a curved surface changes the depth reading.",
   "ar": "السند الطري أو الأوساخ تحت العينة أو السطح المنحني تغيّر قراءة العمق."
  },
  {
   "en": "Too thin a specimen: the anvil \"shows through\" and gives a false high reading. Use a superficial scale.",
   "ar": "العينة الرقيقة جداً: يظهر أثر السندان ويعطي قراءة عالية كاذبة. استعمل مقياساً سطحياً."
  },
  {
   "en": "Soft metals with a cone, or hard steel with a ball, are outside the range of the scale.",
   "ar": "المعادن الطرية بالمخروط أو الفولاذ الصلد بالكرة خارج مدى المقياس."
  }
 ],
 "notConfuse": {
  "en": "The Rockwell numbers of different scales (HRB, HRC, HRA…) cannot be compared with each other. A Rockwell number is not a Brinell or Vickers number: only approximate conversion tables connect them. Remember also that a higher Rockwell number means a harder metal, although the machine measures a smaller depth.",
  "ar": "لا تُقارَن أرقام روكويل في المقاييس المختلفة (HRB وHRC وHRA…) ببعضها. ورقم روكويل ليس رقم برينل أو فيكرز: وإنما تربطها جداول تحويل تقريبية. وتذكّر أن رقم روكويل الأكبر يعني معدناً أصلد مع أن الجهاز يقيس عمقاً أصغر."
 },
 "apps": [
  {
   "en": "Production and workshop control of hardened parts: tools, bearings, gears and shafts.",
   "ar": "ضبط الإنتاج والورش للقطع المقسّاة: العدد والمحامل والتروس والأعمدة."
  },
  {
   "en": "Checking heat treatment (hardening): a gear tooth surface is usually about 58–62 HRC.",
   "ar": "فحص المعالجة الحرارية (التقسية): سطح سن المسنن نحو 58–62 HRC عادة."
  },
  {
   "en": "Sorting parts quickly: the test takes seconds and leaves a very small mark.",
   "ar": "فرز القطع بسرعة: الاختبار يستغرق ثوانٍ ويترك أثراً صغيراً جداً."
  }
 ],
 "figs": [
  {
   "k": "rockwellSteps",
   "cap": {
    "en": "The four stages: ① the indenter touches the surface (zero line); ② the minor load F₀ sets the reference; ③ the major load F₁ is added (deepest); ④ F₁ is removed and the permanent depth h remains. The depths are drawn exaggerated; the real depth is only about 0.06 to 0.16 mm.",
    "ar": "المراحل الأربع: ① يلامس الغارز السطح (خط الصفر)؛ ② الحمل الأولي F₀ يحدد المرجع؛ ③ يُضاف الحمل الرئيسي F₁ (أعمق نقطة)؛ ④ يُزال F₁ ويبقى العمق الدائم h. العمق مرسوم مبالغاً فيه؛ والعمق الحقيقي نحو 0.06 إلى 0.16 مم فقط."
   }
  },
  {
   "k": "rockwellPlot",
   "cap": {
    "en": "HRC against the permanent depth h, from HRC = 100 − h/0.002. The marked point is the worked example (h = 0.080 mm → 60 HRC). A shallower dent gives a higher number.",
    "ar": "قيمة HRC مقابل العمق الدائم h من HRC = 100 − h/0.002. والنقطة المعلّمة هي المثال المحلول (h = 0.080 مم ← 60 HRC). الأثر الأضحل يعطي رقماً أعلى."
   }
  }
 ],
 "see": [
  "brinell",
  "vickers",
  "tensile"
 ]
});
})();
