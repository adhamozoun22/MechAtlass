/* Materials Testing section: content, part C: impact (Charpy, Izod), fracture toughness, fatigue, creep. Generated from the reviewed source; figures are referenced by key and resolved from window.MT_SVG. */
(function () {
    'use strict';
    const M = window.MTEST = window.MTEST || { cats: [], tests: [] };
M.tests.push({
 "id": "charpy",
 "cat": "toughness",
 "icon": "fa-gavel",
 "name": {
  "en": "Charpy impact test",
  "ar": "اختبار شاربي للصدم"
 },
 "short": {
  "en": "A hammer breaks a notched bar lying on two supports: the energy absorbed shows how tough the metal is, also at low temperatures.",
  "ar": "مطرقة تكسر قضيباً مشقوقاً على مسندين: الطاقة الممتصة تبيّن مدى متانة المعدن، وفي الحرارة المنخفضة أيضاً."
 },
 "gist": {
  "en": "A swinging hammer hits a notched bar lying on two supports; we measure the energy the bar absorbs when it breaks.",
  "ar": "تضرب مطرقة متأرجحة قضيباً مشقوقاً موضوعاً على مسندين ونقيس الطاقة التي يمتصها عند كسره."
 },
 "std": "ISO 148-1 · ASTM E23",
 "purpose": {
  "en": "To find out whether a metal breaks in a tough or a brittle way when it is hit suddenly, especially in the cold. Steel that is tough at room temperature can become brittle at −20 °C. Ships, bridges, pipelines and pressure vessels are chosen with this test.",
  "ar": "لمعرفة هل ينكسر المعدن بطريقة متينة أم قصفة عند ضربه فجأة، خاصة في البرد. فالفولاذ المتين في درجة حرارة الغرفة قد يصبح قصفاً عند −20 °م. وتُختار السفن والجسور وخطوط الأنابيب وأوعية الضغط بهذا الاختبار."
 },
 "principle": {
  "en": "A heavy pendulum hammer is raised to a fixed height h₀ and released. At the bottom of its swing it hits the middle of the bar (on the face opposite the notch) and breaks it. The hammer then swings up on the other side, but only to a lower height h₁, because the bar took energy from it. The lost energy is the absorbed energy E = m·g·(h₀ − h₁). The test is repeated at several temperatures.",
  "ar": "تُرفع مطرقة بندولية ثقيلة إلى ارتفاع ثابت h₀ وتُترك. عند أسفل أرجوحتها تضرب منتصف القضيب (على الوجه المقابل للشق) وتكسره. ثم ترتفع المطرقة في الجهة الأخرى لكن إلى ارتفاع أقل h₁ لأن القضيب أخذ منها طاقة. والطاقة المفقودة هي الطاقة الممتصة E = m·g·(h₀ − h₁). ويُكرَّر الاختبار عند عدة درجات حرارة."
 },
 "apparatus": {
  "en": "A pendulum impact machine (often 300 J) with a striker whose tip has a radius of 2 mm or 8 mm, two supports 40 mm apart, and a scale that shows the energy. For other temperatures, a cooling or heating bath; the bar must be broken within 5 seconds after leaving the bath.",
  "ar": "آلة صدم بندولية (غالباً 300 J) برأس مطرقة نصف قطره 2 مم أو 8 مم ومسندين بينهما 40 مم ومقياس يبيّن الطاقة. ولدرجات الحرارة الأخرى حمام تبريد أو تسخين؛ ويجب كسر القضيب خلال 5 ثوانٍ بعد إخراجه من الحمام."
 },
 "specimen": {
  "en": "The standard Charpy V-notch bar: 55 mm long, 10 × 10 mm cross-section, with a V-shaped notch in the middle that is 2 mm deep, 45° wide and has a root radius of 0.25 mm. The result is written KV (V-notch). Smaller \"sub-size\" bars are used for thin material.",
  "ar": "قضيب شاربي القياسي بشق V: طوله 55 مم ومقطعه 10 × 10 مم وبه شق على شكل V في المنتصف عمقه 2 مم وزاويته 45° ونصف قطر قاعدته 0.25 مم. ويُكتب الناتج KV (شق V). وتُستعمل قضبان أصغر «دون القياسية» للمواد الرقيقة."
 },
 "procedure": [
  {
   "en": "Machine the bar and the notch to the exact standard size. Cool or heat the bar to the test temperature and keep it there long enough.",
   "ar": "اصنع القضيب والشق بالأبعاد القياسية الدقيقة. برّد القضيب أو سخّنه إلى درجة حرارة الاختبار وأبقِه فيها زمناً كافياً."
  },
  {
   "en": "Place it on the two supports with the notch facing away from the striker, exactly in the middle.",
   "ar": "ضعه على المسندين والشق بعيد عن المطرقة وبالضبط في المنتصف."
  },
  {
   "en": "Release the pendulum. Read the absorbed energy on the scale.",
   "ar": "أطلق البندول. اقرأ الطاقة الممتصة على المقياس."
  },
  {
   "en": "Look at the broken surface: shiny and grainy means brittle, dull and fibrous means ductile. Measure the lateral expansion (how much the sides bulged).",
   "ar": "انظر إلى سطح الكسر: اللامع المحبب يعني قصفاً والمعتم الليفي يعني مطيلاً. وقِس التمدد الجانبي (مقدار انتفاخ الجانبين)."
  },
  {
   "en": "Repeat at several temperatures (usually 3 bars each) and plot the energy against the temperature.",
   "ar": "كرّر عند عدة حرارات (عادة 3 قضبان لكل درجة) وارسم الطاقة مقابل الحرارة."
  }
 ],
 "results": {
  "en": "The absorbed energy KV in joules at each temperature; the percentage of fibrous (ductile) area on the broken surface; and the transition temperature, where the metal changes from brittle to tough. Codes often specify a simple requirement such as \"at least 27 J at −20 °C\".",
  "ar": "الطاقة الممتصة KV بالجول عند كل درجة حرارة؛ ونسبة المنطقة الليفية (المطيلة) على سطح الكسر؛ ودرجة حرارة الانتقال التي يتحول عندها المعدن من قصف إلى متين. وكثيراً ما تحدد المواصفات شرطاً بسيطاً مثل «27 J على الأقل عند −20 °م»."
 },
 "terms": [
  [
   {
    "en": "Impact",
    "ar": "الصدم"
   },
   {
    "en": "a sudden, very fast blow.",
    "ar": "ضربة مفاجئة سريعة جداً."
   }
  ],
  [
   {
    "en": "Notch",
    "ar": "الشق"
   },
   {
    "en": "a small V-shaped cut in the bar; it makes the break start easily.",
    "ar": "قطع صغير على شكل V في القضيب؛ يجعل بدء الكسر سهلاً."
   }
  ],
  [
   {
    "en": "Absorbed energy",
    "ar": "الطاقة الممتصة"
   },
   {
    "en": "the energy the bar takes from the hammer when it breaks. Unit: joule (J). A tough bar absorbs a lot, a brittle bar very little.",
    "ar": "الطاقة التي يأخذها القضيب من المطرقة عند كسره. الوحدة: جول (J). القضيب المتين يمتص كثيراً والقصف قليلاً جداً."
   }
  ],
  [
   {
    "en": "Ductile-to-brittle transition",
    "ar": "الانتقال من المطيل إلى القصف"
   },
   {
    "en": "many steels break with high energy when warm but with very low energy when cold.",
    "ar": "كثير من الفولاذات تنكسر بطاقة عالية في الحرارة وبطاقة منخفضة جداً في البرد."
   }
  ],
  [
   {
    "en": "KV",
    "ar": "KV"
   },
   {
    "en": "Charpy energy measured with a V-notch bar, in joules.",
    "ar": "طاقة شاربي المقاسة بقضيب ذي شق V، بالجول."
   }
  ]
 ],
 "eqs": [
  {
   "l": {
    "en": "Absorbed energy from the heights",
    "ar": "الطاقة الممتصة من الارتفاعين"
   },
   "e": "E = m · g · ( h₀ − h₁ )",
   "v": [
    [
     "E",
     {
      "en": "energy absorbed by the bar (J)",
      "ar": "الطاقة التي امتصها القضيب (J)"
     }
    ],
    [
     "m",
     {
      "en": "mass of the hammer (kg)",
      "ar": "كتلة المطرقة (kg)"
     }
    ],
    [
     "g",
     {
      "en": "9.81 m/s²",
      "ar": "9.81 m/s²"
     }
    ],
    [
     "h₀",
     {
      "en": "starting height of the hammer (m)",
      "ar": "ارتفاع بدء المطرقة (m)"
     }
    ],
    [
     "h₁",
     {
      "en": "height reached after the break (m)",
      "ar": "الارتفاع الذي بلغته بعد الكسر (m)"
     }
    ]
   ],
   "n": {
    "en": "The machine is calibrated so friction and air resistance are already removed.",
    "ar": "تُعاير الآلة بحيث يُستبعد الاحتكاك ومقاومة الهواء."
   }
  },
  {
   "l": {
    "en": "The same with the angles (what the machine really measures)",
    "ar": "المعادلة نفسها بالزوايا (ما تقيسه الآلة فعلاً)"
   },
   "e": "E = m · g · R · ( cos β − cos α )",
   "v": [
    [
     "R",
     {
      "en": "distance from the pivot to the centre of the hammer (m)",
      "ar": "المسافة من محور الدوران إلى مركز المطرقة (m)"
     }
    ],
    [
     "α",
     {
      "en": "starting angle from the hanging position",
      "ar": "زاوية البدء من وضع التدلي"
     }
    ],
    [
     "β",
     {
      "en": "angle reached after the break",
      "ar": "الزاوية التي بلغتها بعد الكسر"
     }
    ]
   ],
   "n": {
    "en": "Because h = R·(1 − cos angle).",
    "ar": "لأن h = R·(1 − cos الزاوية)."
   }
  },
  {
   "l": {
    "en": "Transition temperature (two common definitions)",
    "ar": "درجة حرارة الانتقال (تعريفان شائعان)"
   },
   "e": "KV ( T₂₇ ) = 27 J\nfibrous area ( T₅₀ ) = 50 %",
   "v": [
    [
     "T₂₇",
     {
      "en": "temperature at which the absorbed energy is 27 J",
      "ar": "درجة الحرارة التي تكون عندها الطاقة الممتصة 27 J"
     }
    ],
    [
     "T₅₀",
     {
      "en": "temperature at which half of the broken surface is fibrous (ductile)",
      "ar": "درجة الحرارة التي يكون عندها نصف سطح الكسر ليفياً (مطيلاً)"
     }
    ]
   ],
   "n": {
    "en": "The definition must always be stated. Specifications choose their own.",
    "ar": "يجب دائماً ذكر التعريف. وتختار المواصفات تعريفها."
   }
  }
 ],
 "example": {
  "title": {
   "en": "Worked example: one bar",
   "ar": "مثال محلول: قضيب واحد"
  },
  "steps": [
   {
    "en": "Hammer mass m = 25 kg, released from h₀ = 1.20 m (pendulum length R = 0.8 m, so the start angle is α = 120°).",
    "ar": "كتلة المطرقة m = 25 kg وتُترك من h₀ = 1.20 م (طول البندول R = 0.8 م وزاوية البدء α = 120°)."
   },
   {
    "en": "Energy at the start: m·g·h₀ = 25 × 9.81 × 1.20 = 294 J.",
    "ar": "الطاقة عند البدء: m·g·h₀ = 25 × 9.81 × 1.20 = 294 J."
   },
   {
    "en": "After breaking the bar the hammer rises only to h₁ = 1.00 m.",
    "ar": "بعد كسر القضيب ترتفع المطرقة إلى h₁ = 1.00 م فقط."
   },
   {
    "en": "E = 25 × 9.81 × (1.20 − 1.00) = 49.05 J ≈ 49 J.",
    "ar": "E = 25 × 9.81 × (1.20 − 1.00) = 49.05 J ≈ 49 J."
   },
   {
    "en": "Check with angles: β = arccos(1 − 1.00/0.8) = 104.5°, and 25 × 9.81 × 0.8 × (cos 104.5° − cos 120°) = 196.2 × (−0.25 + 0.5) = 49 J ✓.",
    "ar": "تحقق بالزوايا: β = arccos(1 − 1.00/0.8) = 104.5° و25 × 9.81 × 0.8 × (cos 104.5° − cos 120°) = 196.2 × (−0.25 + 0.5) = 49 J ✓."
   }
  ],
  "result": {
   "en": "KV = 49 J at the test temperature. If the same steel gave 8 J at −40 °C and 150 J at +20 °C, it is brittle in the cold and tough when warm.",
   "ar": "KV = 49 J عند درجة حرارة الاختبار. ولو أعطى الفولاذ نفسه 8 J عند −40 °م و150 J عند +20 °م فهو قصف في البرد ومتين في الدفء."
  }
 },
 "pitfalls": [
  {
   "en": "The result depends on the notch shape and the bar size; only compare bars of the same type.",
   "ar": "تعتمد النتيجة على شكل الشق وحجم القضيب؛ قارن فقط القضبان من النوع نفسه."
  },
  {
   "en": "If the bar warms up on the way from the cooling bath, the result is too high (too optimistic).",
   "ar": "إذا سخن القضيب في الطريق من حمام التبريد جاءت النتيجة أعلى من الحقيقة (متفائلة)."
  },
  {
   "en": "Energy in joules cannot be converted exactly to fracture toughness K_Ic; only rough relations exist.",
   "ar": "لا تُحوَّل الطاقة بالجول بدقة إلى متانة الكسر K_Ic؛ توجد علاقات تقريبية فقط."
  },
  {
   "en": "Aluminium, copper and austenitic stainless steel do not show a sharp transition: their energy stays high in the cold.",
   "ar": "الألمنيوم والنحاس والفولاذ الأوستنيتي لا تُظهر انتقالاً حاداً: تبقى طاقتها عالية في البرد."
  }
 ],
 "notConfuse": {
  "en": "Charpy is not Izod: in Charpy the bar lies on two supports and is hit on the side opposite the notch; in Izod it stands clamped like a diving board and is hit on the notch side. Their numbers cannot be exchanged. Impact energy is not fracture toughness K_Ic, which describes a body with a real crack.",
  "ar": "شاربي ليس إيزود: في شاربي يرقد القضيب على مسندين ويُضرب من الجهة المقابلة للشق؛ وفي إيزود يقف مثبّتاً كلوح القفز ويُضرب من جهة الشق. ولا يتبادل رقماهما. وطاقة الصدم ليست متانة الكسر K_Ic التي تصف جسماً به شق حقيقي."
 },
 "apps": [
  {
   "en": "Choosing steel for cold climates and low-temperature service: ships, bridges, pipelines, pressure vessels, offshore platforms.",
   "ar": "اختيار الفولاذ للمناخ البارد والخدمة في الحرارة المنخفضة: السفن والجسور وخطوط الأنابيب وأوعية الضغط والمنصات البحرية."
  },
  {
   "en": "Quality control of welds and heat treatment.",
   "ar": "ضبط جودة اللحام والمعالجة الحرارية."
  },
  {
   "en": "Checking that a steel plate meets the required value (for example 27 J at the specified temperature).",
   "ar": "التحقق من أن لوح الفولاذ يحقق القيمة المطلوبة (مثل 27 J عند الحرارة المحددة)."
  }
 ],
 "figs": [
  {
   "k": "charpyDraw",
   "cap": {
    "en": "The standard Charpy bar (55 × 10 × 10 mm) drawn to scale on its two supports 40 mm apart. The striker hits the middle on the side opposite the notch, so the notch is pulled open.",
    "ar": "قضيب شاربي القياسي (55 × 10 × 10 مم) مرسوماً بمقياس رسم على مسنديه البعيدين 40 مم. تضرب المطرقة المنتصف من الجهة المقابلة للشق فيُفتح الشق شدّاً."
   }
  },
  {
   "k": "notchDetail",
   "cap": {
    "en": "The V-notch enlarged: 2 mm deep, 45° angle, root radius 0.25 mm.",
    "ar": "الشق V مكبّراً: عمقه 2 مم وزاويته 45° ونصف قطر قاعدته 0.25 مم."
   }
  },
  {
   "k": "pendulum",
   "cap": {
    "en": "The pendulum of the worked example (R = 0.8 m, m = 25 kg): start height 1.20 m (α = 120°); after the break it rises to 1.00 m (β ≈ 104.5°). The difference, 49 J, was absorbed by the bar.",
    "ar": "بندول المثال المحلول (R = 0.8 م وm = 25 kg): ارتفاع البدء 1.20 م (α = 120°)؛ وبعد الكسر يرتفع إلى 1.00 م (β ≈ 104.5°). والفرق 49 J امتصه القضيب."
   }
  },
  {
   "k": "dbtt",
   "cap": {
    "en": "Energy against test temperature for a typical structural steel (an illustrative curve, not measured data; it passes through 8 J at −40 °C and about 150 J at +20 °C). Low temperature: brittle, low energy. High temperature: tough, high energy. The 27 J line crosses the curve at about −23 °C (T₂₇).",
    "ar": "الطاقة مقابل درجة حرارة الاختبار لفولاذ إنشائي نموذجي (منحنى توضيحي وليس بيانات مقاسة؛ يمر بـ 8 J عند −40 °م ونحو 150 J عند +20 °م). الحرارة المنخفضة: قصف وطاقة منخفضة. الحرارة المرتفعة: متين وطاقة عالية. ويقطع الخط 27 J المنحنى عند نحو −23 °م (T₂₇)."
   }
  }
 ],
 "see": [
  "izod",
  "fracture",
  "tensile"
 ]
});
M.tests.push({
 "id": "izod",
 "cat": "toughness",
 "icon": "fa-hammer",
 "name": {
  "en": "Izod impact test",
  "ar": "اختبار إيزود للصدم"
 },
 "short": {
  "en": "A clamped, notched bar is hit by a swinging hammer: the usual test for the notch toughness of plastics.",
  "ar": "مطرقة متأرجحة تضرب قضيباً مشقوقاً مثبّتاً: الاختبار المعتاد لمتانة اللدائن مع الشق."
 },
 "gist": {
  "en": "The notched bar stands clamped at the bottom like a diving board, and a swinging hammer hits its free end on the notch side.",
  "ar": "يقف القضيب المشقوق مثبّتاً من الأسفل كلوح القفز وتضرب مطرقة متأرجحة طرفه الحر من جهة الشق."
 },
 "std": "ASTM D256 · ISO 180 (plastics) · ASTM E23 (metals)",
 "purpose": {
  "en": "To compare how well different plastics (and some metals) resist a sudden blow when there is a notch. It is the standard way to rank plastics such as ABS, nylon and polycarbonate for toughness.",
  "ar": "لمقارنة مدى مقاومة اللدائن المختلفة (وبعض المعادن) لضربة مفاجئة عند وجود شق. وهو الطريقة القياسية لترتيب اللدائن مثل ABS والنايلون والبولي كربونات بحسب المتانة."
 },
 "principle": {
  "en": "The bar is clamped vertically in a vise, like a cantilever, so that the notch is level with the top of the vise and faces the hammer. A pendulum hammer swings down and hits the free end, about 22 mm above the notch. The bar bends and breaks at the notch. As in the Charpy test, the energy lost by the hammer is the energy absorbed by the bar. For plastics the result is divided by the thickness of the bar, so we get joules per metre (J/m).",
  "ar": "يُثبَّت القضيب عمودياً في ملزمة كأنه كابول بحيث يكون الشق بمستوى أعلى الملزمة ويواجه المطرقة. تهبط مطرقة بندولية وتضرب الطرف الحر على بعد نحو 22 مم فوق الشق. ينحني القضيب وينكسر عند الشق. وكما في شاربي، الطاقة التي تفقدها المطرقة هي ما امتصه القضيب. وفي اللدائن تُقسم النتيجة على سماكة القضيب فنحصل على جول لكل متر (J/m)."
 },
 "apparatus": {
  "en": "A pendulum impact machine like the Charpy one, but with a vise to clamp the bar and a hammer shaped for the Izod blow; plastics machines have small hammers (for example 1 to 5 J).",
  "ar": "آلة صدم بندولية كآلة شاربي لكن مع ملزمة لتثبيت القضيب ومطرقة مهيأة لضربة إيزود؛ وآلات اللدائن لها مطارق صغيرة (مثل 1 إلى 5 J)."
 },
 "specimen": {
  "en": "Plastics (ASTM D256): a bar 63.5 mm long and 12.7 mm deep, usually 3.2 mm wide (3.0 to 12.7 mm is allowed), with a 45° notch 2.54 mm deep (10.16 mm of material is left under it), a root radius of 0.25 mm, and the notch 31.8 mm from one end. The notch is cut with a special cutter, never with a file, because a rough notch changes the result. Metals (ASTM E23): a 10 × 10 mm bar with a V-notch.",
  "ar": "اللدائن (ASTM D256): قضيب طوله 63.5 مم وعمقه 12.7 مم وعرضه عادة 3.2 مم (يُسمح من 3.0 إلى 12.7 مم) بشق 45° عمقه 2.54 مم (يبقى تحته 10.16 مم من المعدن) ونصف قطر قاعدته 0.25 مم، والشق على بعد 31.8 مم من أحد الطرفين. يُقطع الشق بقاطع خاص وليس بمبرد أبداً لأن الشق الخشن يغيّر النتيجة. والمعادن (ASTM E23): قضيب 10 × 10 مم بشق V."
 },
 "procedure": [
  {
   "en": "Cut the notch with the special cutter. Keep the bar at the test temperature (usually 23 °C) for at least 40 hours before testing.",
   "ar": "اقطع الشق بالقاطع الخاص. أبقِ القضيب عند درجة حرارة الاختبار (عادة 23 °م) 40 ساعة على الأقل قبل الاختبار."
  },
  {
   "en": "Measure the thickness of the bar at the notch.",
   "ar": "قِس سماكة القضيب عند الشق."
  },
  {
   "en": "Clamp the bar in the vise with the notch level with the top of the vise and facing the hammer.",
   "ar": "ثبّت القضيب في الملزمة والشق بمستوى أعلاها ومواجهاً للمطرقة."
  },
  {
   "en": "Release the pendulum and read the energy on the scale. Apply the corrections the standard asks for (friction and the energy used to throw the broken piece).",
   "ar": "أطلق البندول واقرأ الطاقة على المقياس. وطبّق التصحيحات التي يطلبها المعيار (الاحتكاك والطاقة المستهلكة في قذف القطعة المكسورة)."
  },
  {
   "en": "Test at least 5 bars and average. Note how each broke (complete, hinge, partial).",
   "ar": "اختبر 5 قضبان على الأقل وخذ المتوسط. دوّن كيف انكسر كل منها (كامل أو مفصلي أو جزئي)."
  }
 ],
 "results": {
  "en": "The impact strength, in J/m (ASTM D256) or kJ/m² (ISO 180), averaged over several bars, and the type of break. A higher value means a tougher plastic.",
  "ar": "مقاومة الصدم بوحدة J/m (ASTM D256) أو kJ/m² (ISO 180) بمتوسط عدة قضبان، ونوع الكسر. والقيمة الأعلى تعني لدائن أمتن."
 },
 "terms": [
  [
   {
    "en": "Impact",
    "ar": "الصدم"
   },
   {
    "en": "a sudden, very fast blow.",
    "ar": "ضربة مفاجئة سريعة جداً."
   }
  ],
  [
   {
    "en": "Notch",
    "ar": "الشق"
   },
   {
    "en": "a small V-shaped cut in the bar; it makes the break start easily.",
    "ar": "قطع صغير على شكل V في القضيب؛ يجعل بدء الكسر سهلاً."
   }
  ],
  [
   {
    "en": "Absorbed energy",
    "ar": "الطاقة الممتصة"
   },
   {
    "en": "the energy the bar takes from the hammer when it breaks. Unit: joule (J). A tough bar absorbs a lot, a brittle bar very little.",
    "ar": "الطاقة التي يأخذها القضيب من المطرقة عند كسره. الوحدة: جول (J). القضيب المتين يمتص كثيراً والقصف قليلاً جداً."
   }
  ],
  [
   {
    "en": "Ductile-to-brittle transition",
    "ar": "الانتقال من المطيل إلى القصف"
   },
   {
    "en": "many steels break with high energy when warm but with very low energy when cold.",
    "ar": "كثير من الفولاذات تنكسر بطاقة عالية في الحرارة وبطاقة منخفضة جداً في البرد."
   }
  ],
  [
   {
    "en": "Cantilever",
    "ar": "الكابول"
   },
   {
    "en": "a bar fixed at one end and free at the other.",
    "ar": "قضيب مثبّت من طرف وحرّ من الآخر."
   }
  ],
  [
   {
    "en": "Vise",
    "ar": "الملزمة"
   },
   {
    "en": "the clamp that holds the bar.",
    "ar": "المشبك الذي يمسك القضيب."
   }
  ]
 ],
 "eqs": [
  {
   "l": {
    "en": "Impact strength of plastics (ASTM D256)",
    "ar": "مقاومة الصدم للدائن (ASTM D256)"
   },
   "e": "IS = E / t",
   "v": [
    [
     "IS",
     {
      "en": "impact strength (J/m)",
      "ar": "مقاومة الصدم (J/m)"
     }
    ],
    [
     "E",
     {
      "en": "corrected energy absorbed by the bar (J)",
      "ar": "الطاقة المصحَّحة التي امتصها القضيب (J)"
     }
    ],
    [
     "t",
     {
      "en": "width of the bar along the notch (m); the 3.2 mm of the standard bar",
      "ar": "عرض القضيب على طول الشق (m)؛ أي الـ 3.2 مم في القضيب القياسي"
     }
    ]
   ],
   "n": {
    "en": "Convert the thickness to metres: 3.2 mm = 0.0032 m.",
    "ar": "حوّل السماكة إلى أمتار: 3.2 مم = 0.0032 م."
   }
  },
  {
   "l": {
    "en": "ISO 180 version",
    "ar": "صيغة ISO 180"
   },
   "e": "a_iN = E / ( h · b_N ) × 10³",
   "v": [
    [
     "a_iN",
     {
      "en": "impact strength (kJ/m²)",
      "ar": "مقاومة الصدم (kJ/m²)"
     }
    ],
    [
     "h",
     {
      "en": "thickness of the bar (mm)",
      "ar": "سماكة القضيب (mm)"
     }
    ],
    [
     "b_N",
     {
      "en": "width left under the notch (mm)",
      "ar": "العرض المتبقي تحت الشق (mm)"
     }
    ],
    [
     "E",
     {
      "en": "energy (J)",
      "ar": "الطاقة (J)"
     }
    ]
   ],
   "n": {
    "en": "Here energy is divided by the area left under the notch.",
    "ar": "هنا تُقسم الطاقة على المساحة المتبقية تحت الشق."
   }
  },
  {
   "l": {
    "en": "The energy itself (as in Charpy)",
    "ar": "الطاقة نفسها (كما في شاربي)"
   },
   "e": "E = m · g · ( h₀ − h₁ )",
   "v": [
    [
     "m, g, h₀, h₁",
     {
      "en": "same meaning as in the Charpy test",
      "ar": "المعنى نفسه كما في اختبار شاربي"
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
   "en": "Worked example: ABS plastic bar",
   "ar": "مثال محلول: قضيب لدائن ABS"
  },
  "steps": [
   {
    "en": "Bar width t = 3.2 mm = 0.0032 m. Corrected energy absorbed E = 0.80 J.",
    "ar": "عرض القضيب t = 3.2 مم = 0.0032 م. الطاقة المصحَّحة الممتصة E = 0.80 J."
   },
   {
    "en": "IS = E / t = 0.80 / 0.0032 = 250 J/m.",
    "ar": "IS = E / t = 0.80 / 0.0032 = 250 J/m."
   },
   {
    "en": "The same break in ISO 180 terms, for a 4 mm thick bar with 8 mm left under the notch: 0.80 / (4 × 8) × 1000 = 25 kJ/m².",
    "ar": "الكسر نفسه بصيغة ISO 180 لقضيب سماكته 4 مم وعرضه المتبقي تحت الشق 8 مم: 0.80 / (4 × 8) × 1000 = 25 kJ/m²."
   }
  ],
  "result": {
   "en": "IS = 250 J/m, a moderately tough plastic. Comparing with another plastic that gives 50 J/m, the first absorbs five times more energy per unit thickness.",
   "ar": "IS = 250 J/m، لدائن متوسطة المتانة. وبالمقارنة مع لدائن أخرى تعطي 50 J/m فالأولى تمتص طاقة أكبر بخمس مرات لكل وحدة سماكة."
  }
 },
 "pitfalls": [
  {
   "en": "A notch cut with a file or a blunt cutter gives wrong results. Notch quality is critical.",
   "ar": "الشق المقطوع بمبرد أو بقاطع كليل يعطي نتائج خاطئة. جودة الشق حاسمة."
  },
  {
   "en": "Plastics change with temperature and humidity; always state them.",
   "ar": "تتغير اللدائن مع الحرارة والرطوبة؛ اذكرهما دائماً."
  },
  {
   "en": "Results from different thicknesses or different standards (J/m and kJ/m²) cannot be compared.",
   "ar": "لا تُقارَن النتائج من سماكات مختلفة أو معايير مختلفة (J/m وkJ/m²)."
  },
  {
   "en": "If the bar does not break completely, the number is not a true measurement of its toughness.",
   "ar": "إن لم ينكسر القضيب كاملاً فليس الرقم قياساً حقيقياً لمتانته."
  }
 ],
 "notConfuse": {
  "en": "Izod is not Charpy. In Izod the bar is clamped at one end (cantilever), and the hammer hits the notch side; in Charpy the bar lies on two supports and the hammer hits the side opposite the notch. Izod results of plastics are in J/m or kJ/m², while Charpy results of metals are in J; do not compare them.",
  "ar": "إيزود ليس شاربي. في إيزود يُثبَّت القضيب من طرف (كابول) وتضرب المطرقة جهة الشق؛ وفي شاربي يرقد القضيب على مسندين وتضرب المطرقة الجهة المقابلة للشق. ونتائج إيزود للدائن بوحدة J/m أو kJ/m² أما نتائج شاربي للمعادن فبوحدة J؛ فلا تقارن بينهما."
 },
 "apps": [
  {
   "en": "Ranking plastics for toughness: ABS, nylon, polycarbonate, polypropylene, and filled or reinforced grades.",
   "ar": "ترتيب اللدائن بحسب المتانة: ABS والنايلون والبولي كربونات والبولي بروبيلين والدرجات المحشوة أو المقوّاة."
  },
  {
   "en": "Quality control of plastic parts: housings, bumpers, tool handles and pipes.",
   "ar": "ضبط جودة القطع البلاستيكية: الأغلفة والمصدّات ومقابض الأدوات والأنابيب."
  },
  {
   "en": "Checking the effect of fillers, recycled material and temperature on toughness.",
   "ar": "فحص أثر المواد المالئة والمادة المعاد تدويرها والحرارة على المتانة."
  }
 ],
 "figs": [
  {
   "k": "izodDraw",
   "cap": {
    "en": "A plastics Izod bar (63.5 × 12.7 × 3.2 mm, drawn to scale) clamped in the vise with the notch level with the top of the vise and facing the striker, which hits 22 mm above the notch.",
    "ar": "قضيب إيزود للدائن (63.5 × 12.7 × 3.2 مم، بمقياس رسم) مثبّت في الملزمة والشق بمستوى أعلاها ومواجه للمطرقة التي تضرب على بعد 22 مم فوق الشق."
   }
  },
  {
   "k": "pendulum",
   "cap": {
    "en": "The pendulum works as in the Charpy test: the energy lost by the hammer, m·g·(h₀ − h₁), is the energy absorbed by the bar (the numbers shown are the Charpy example).",
    "ar": "يعمل البندول كما في اختبار شاربي: الطاقة التي تفقدها المطرقة m·g·(h₀ − h₁) هي ما امتصه القضيب (الأرقام المعروضة هي مثال شاربي)."
   }
  }
 ],
 "see": [
  "charpy",
  "fracture",
  "tensile"
 ]
});
M.tests.push({
 "id": "fracture",
 "cat": "toughness",
 "icon": "fa-burst",
 "name": {
  "en": "Fracture toughness test (K_Ic)",
  "ar": "اختبار متانة الكسر (K_Ic)"
 },
 "short": {
  "en": "Load a bar with a sharp crack to find K_Ic: how well the metal resists a crack running through it.",
  "ar": "تحميل قضيب فيه شق حاد لإيجاد K_Ic: مدى مقاومة المعدن لانطلاق شق فيه."
 },
 "gist": {
  "en": "Load a bar that already has a sharp crack, and find the stress \"intensity\" at which the crack starts to run.",
  "ar": "نحمّل قضيباً فيه شق حاد أصلاً ونجد «شدة» الإجهاد التي يبدأ الشق عندها بالانطلاق."
 },
 "std": "ASTM E399 · ISO 12737 (K_Ic) · ASTM E1820 (J, CTOD)",
 "purpose": {
  "en": "Real parts always contain small cracks and flaws. The question is: how big a crack can the part carry at a given stress before it suddenly runs? Fracture toughness K_Ic is the property of the material that answers this. It is used to decide the safe crack size and how often to inspect.",
  "ar": "القطع الحقيقية فيها دائماً شقوق وعيوب صغيرة. والسؤال: ما حجم الشق الذي تتحمله القطعة عند إجهاد معين قبل أن ينطلق فجأة؟ ومتانة الكسر K_Ic هي خاصية المادة التي تجيب عن ذلك. وتُستعمل لتحديد حجم الشق الآمن وعدد مرات الفحص."
 },
 "principle": {
  "en": "A bar with a sharp crack (made by fatigue, so its tip is really sharp) is pulled slowly while the force P and the opening of the crack mouth v are recorded. Around a crack tip the stress is very high, and the measure of how high is the stress intensity factor K, which grows with the load and with the crack length. The value of K at which the crack starts to run, in thick material (plane strain), is K_Ic. The test is valid only if the bar is thick enough.",
  "ar": "يُشدّ ببطء قضيب فيه شق حاد (يُصنع بالكلل ليكون رأسه حاداً فعلاً) مع تسجيل القوة P وانفتاح فم الشق v. حول رأس الشق يكون الإجهاد عالياً جداً، ومقياس ارتفاعه هو معامل شدة الإجهاد K الذي يكبر مع الحمل ومع طول الشق. والقيمة التي يبدأ عندها الشق بالانطلاق في المادة السميكة (الانفعال المستوي) هي K_Ic. ولا يكون الاختبار صالحاً إلا إذا كان القضيب سميكاً كفاية."
 },
 "apparatus": {
  "en": "A testing machine with pin grips, a clip gauge that measures the crack-mouth opening v, and a machine able to apply small repeated loads to grow the fatigue crack.",
  "ar": "آلة اختبار بفكوك ذات أوتاد ومقياس انفتاح فم الشق (clip gauge) يقيس انفتاح فم الشق v وآلة قادرة على تطبيق أحمال صغيرة متكررة لتنمية شق الكلل."
 },
 "specimen": {
  "en": "The compact-tension specimen C(T): a rectangular block with two loading holes, a machined notch and a fatigue crack, so that the total crack length is a (about half of the width W). Its thickness B and crack length a must both be at least 2.5·(K_Q/σ_ys)²; otherwise the result is not called K_Ic.",
  "ar": "عينة الشد المدمجة C(T): كتلة مستطيلة بثقبي تحميل وشق مشغَّل وشق كلل بحيث يكون طول الشق الكلي a (نحو نصف العرض W). ويجب أن تكون سماكتها B وطول الشق a كلاهما 2.5·(K_Q/σ_ys)² على الأقل؛ وإلا فلا تُسمّى النتيجة K_Ic."
 },
 "procedure": [
  {
   "en": "Machine the specimen and notch; grow a fatigue pre-crack at a low stress intensity so the crack tip is sharp.",
   "ar": "اصنع العينة والشق؛ وأنمِ شق كلل مسبق عند شدة إجهاد منخفضة ليصبح رأس الشق حاداً."
  },
  {
   "en": "Measure B, W and the crack length a (on the fracture surface afterwards).",
   "ar": "قِس B وW وطول الشق a (على سطح الكسر بعد الاختبار)."
  },
  {
   "en": "Load at a rate that raises K at the prescribed speed, recording P and v.",
   "ar": "حمّل بمعدل يرفع K بالسرعة المحددة مع تسجيل P وv."
  },
  {
   "en": "Draw the 5 % secant line, find P_Q and check P_max/P_Q ≤ 1.10.",
   "ar": "ارسم خط القاطع 5% وأوجد P_Q وتحقق من P_max/P_Q ≤ 1.10."
  },
  {
   "en": "Calculate K_Q from P_Q and the geometry; check the thickness and crack-length validity criteria. If they fail, K_Q is only a conditional value and a thicker specimen is needed.",
   "ar": "احسب K_Q من P_Q والهندسة؛ وتحقق من معياري صلاحية السماكة وطول الشق. إن فشلا فـ K_Q قيمة مشروطة فقط ويلزم عينة أسمك."
  }
 ],
 "results": {
  "en": "The fracture toughness K_Ic in MPa·√m. Typical orders: high-strength steels about 50 to 100, aluminium alloys about 25 to 40, technical ceramics such as alumina about 3 to 5 (they vary with alloy and heat treatment). A high K_Ic means the metal tolerates cracks well. (This test is for metals; ceramics have their own methods.)",
  "ar": "متانة الكسر K_Ic بوحدة MPa·√m. رتب نموذجية: الفولاذ عالي المقاومة نحو 50 إلى 100 وسبائك الألمنيوم نحو 25 إلى 40 والسيراميك التقني كالألومينا نحو 3 إلى 5 (وتختلف بالسبيكة والمعالجة الحرارية). و K_Ic العالية تعني أن المعدن يتحمل الشقوق جيداً. (هذا الاختبار للمعادن؛ وللسيراميك طرائقه الخاصة.)"
 },
 "terms": [
  [
   {
    "en": "Crack length a",
    "ar": "طول الشق a"
   },
   {
    "en": "the length of the crack (for an edge crack, from the surface).",
    "ar": "طول الشق (من السطح في شق الحافة)."
   }
  ],
  [
   {
    "en": "Stress intensity K",
    "ar": "شدة الإجهاد K"
   },
   {
    "en": "how severe the stress is at the crack tip. Unit: MPa·√m.",
    "ar": "مدى شدة الإجهاد عند رأس الشق. الوحدة: MPa·√m."
   }
  ],
  [
   {
    "en": "K_Ic",
    "ar": "K_Ic"
   },
   {
    "en": "the critical K: the crack runs when K reaches it. A property of the material.",
    "ar": "قيمة K الحرجة: ينطلق الشق عندما يبلغها K. خاصية للمادة."
   }
  ],
  [
   {
    "en": "Plane strain",
    "ar": "الانفعال المستوي"
   },
   {
    "en": "the condition in thick material where the crack tip cannot deform sideways; it gives the lowest, safest toughness.",
    "ar": "حالة المادة السميكة التي لا يستطيع رأس الشق فيها التشوه جانبياً؛ وتعطي أقل متانة وأكثرها أماناً."
   }
  ]
 ],
 "eqs": [
  {
   "l": {
    "en": "Stress intensity at a crack",
    "ar": "شدة الإجهاد عند الشق"
   },
   "e": "K_I = Y · σ · √( π · a )",
   "v": [
    [
     "K_I",
     {
      "en": "stress intensity (MPa·√m)",
      "ar": "شدة الإجهاد (MPa·√m)"
     }
    ],
    [
     "σ",
     {
      "en": "stress far from the crack (MPa)",
      "ar": "الإجهاد بعيداً عن الشق (MPa)"
     }
    ],
    [
     "a",
     {
      "en": "crack length (m!)",
      "ar": "طول الشق (بالمتر!)"
     }
    ],
    [
     "Y",
     {
      "en": "shape factor, about 1.12 for a small edge crack, 1.0 for a centre crack in a wide plate (for a centre crack, a is half of the crack length)",
      "ar": "عامل الشكل نحو 1.12 لشق حافة صغير و1.0 لشق مركزي في صفيحة عريضة (وفي الشق المركزي a نصف طول الشق)"
     }
    ]
   ],
   "n": {
    "en": "Put a in metres to get MPa·√m.",
    "ar": "ضع a بالمتر لتحصل على MPa·√m."
   }
  },
  {
   "l": {
    "en": "When does the crack run?",
    "ar": "متى ينطلق الشق؟"
   },
   "e": "K_I ≥ K_Ic",
   "v": [],
   "n": {
    "en": "",
    "ar": ""
   }
  },
  {
   "l": {
    "en": "Critical crack length (from the two equations above)",
    "ar": "طول الشق الحرج (من المعادلتين أعلاه)"
   },
   "e": "a_c = ( 1 / π ) · ( K_Ic / ( Y · σ ) )²",
   "v": [
    [
     "a_c",
     {
      "en": "crack length at which the crack runs (m)",
      "ar": "طول الشق الذي ينطلق عنده (m)"
     }
    ]
   ],
   "n": {
    "en": "A higher stress or a lower K_Ic gives a smaller safe crack.",
    "ar": "الإجهاد الأعلى أو K_Ic الأقل يعطيان شقاً آمناً أصغر."
   }
  },
  {
   "l": {
    "en": "Result of the C(T) test",
    "ar": "نتيجة اختبار C(T)"
   },
   "e": "K_Q = P_Q / ( B · √W ) · f( a / W )",
   "v": [
    [
     "K_Q",
     {
      "en": "candidate value of the toughness (MPa·√m)",
      "ar": "القيمة المرشَّحة للمتانة (MPa·√m)"
     }
    ],
    [
     "P_Q",
     {
      "en": "load found from the 5 % secant line (N)",
      "ar": "الحمل الموجود من خط القاطع 5% (N)"
     }
    ],
    [
     "B, W",
     {
      "en": "thickness and width of the specimen (mm)",
      "ar": "سماكة وعرض العينة (mm)"
     }
    ],
    [
     "f( a / W )",
     {
      "en": "a number from the standard; f(0.5) ≈ 9.66",
      "ar": "رقم من المعيار؛ f(0.5) ≈ 9.66"
     }
    ]
   ],
   "n": {
    "en": "With P in N and B, W in mm the result is in MPa·√mm; divide by 31.62 to get MPa·√m.",
    "ar": "مع P بالنيوتن وB وW بالمم تكون النتيجة MPa·√mm؛ اقسم على 31.62 لتحصل على MPa·√m."
   }
  },
  {
   "l": {
    "en": "Is the test valid? (size rule)",
    "ar": "هل الاختبار صالح؟ (قاعدة الحجم)"
   },
   "e": "B ≥ 2.5 · ( K_Q / σ_ys )²\na ≥ 2.5 · ( K_Q / σ_ys )²\nP_max / P_Q ≤ 1.10",
   "v": [
    [
     "σ_ys",
     {
      "en": "yield strength of the material (MPa)",
      "ar": "حد خضوع المادة (MPa)"
     }
    ],
    [
     "P_max",
     {
      "en": "highest load in the test (N)",
      "ar": "أعلى حمل في الاختبار (N)"
     }
    ]
   ],
   "n": {
    "en": "If any condition fails, K_Q is not K_Ic: a thicker specimen is needed.",
    "ar": "إن فشل أي شرط فـ K_Q ليست K_Ic: يلزم قضيب أسمك."
   }
  }
 ],
 "example": {
  "title": {
   "en": "Worked examples",
   "ar": "أمثلة محلولة"
  },
  "steps": [
   {
    "en": "Example 1, critical crack: steel with K_Ic = 50 MPa·√m under σ = 300 MPa, edge crack Y = 1.12 → a_c = (1/π)·(50 / (1.12·300))² = (1/π)·(0.1488)² = 7.05 mm.",
    "ar": "المثال 1، الشق الحرج: فولاذ K_Ic = 50 MPa·√m تحت σ = 300 MPa وشق حافة Y = 1.12 ← a_c = (1/π)·(50 / (1.12·300))² = (1/π)·(0.1488)² = 7.05 مم."
   },
   {
    "en": "Example 2, size requirement: Ti alloy K_Ic = 55 MPa·√m, σ_ys = 1000 MPa → B ≥ 2.5·(55/1000)² = 2.5·0.003025 m = 7.56 mm.",
    "ar": "المثال 2، شرط الحجم: سبيكة تيتانيوم K_Ic = 55 MPa·√m وσ_ys = 1000 MPa ← B ≥ 2.5·(55/1000)² = 2.5·0.003025 م = 7.56 مم."
   },
   {
    "en": "Example 3, C(T) test: B = 25 mm, W = 50 mm, a = 25 mm (α = 0.5, f = 9.66), P_Q = 20 kN → K_Q = 20 000/(25·√50)·9.66 = 1093 MPa·√mm = 34.6 MPa·√m.",
    "ar": "المثال 3، اختبار C(T): B = 25 مم وW = 50 مم وa = 25 مم (α = 0.5 وf = 9.66) وP_Q = 20 kN ← K_Q = 20 000/(25·√50)·9.66 = 1093 MPa·√mm = 34.6 MPa·√m."
   },
   {
    "en": "Validity: if σ_ys = 500 MPa → 2.5·(34.6/500)² = 12.0 mm ≤ B = 25 mm ✓ (also a = 25 mm ≥ 11.9 mm ✓), so K_Q can be reported as K_Ic provided P_max/P_Q ≤ 1.10.",
    "ar": "الصلاحية: إن كان σ_ys = 500 MPa ← 2.5·(34.6/500)² = 12.0 مم ≤ B = 25 مم ✓ (وa = 25 مم ≥ 11.9 مم ✓)، فيمكن إعلان K_Q بوصفها K_Ic بشرط P_max/P_Q ≤ 1.10."
   }
  ],
  "result": {
   "en": "A 7 mm edge crack would run at 300 MPa in that steel; the C(T) test gives K_Ic ≈ 34.6 MPa·√m for the tested material.",
   "ar": "شق حافة بطول 7 مم سينتشر عند 300 MPa في ذلك الفولاذ؛ ويعطي اختبار C(T) قيمة K_Ic ≈ 34.6 MPa·√m للمادة المختبرة."
  }
 },
 "pitfalls": [
  {
   "en": "A blunt notch instead of a fatigue crack gives a too-high toughness.",
   "ar": "الشق الكليل بدل الشق الكللي يعطي متانة عالية أكثر من اللازم."
  },
  {
   "en": "If the specimen is too thin the test measures a plane-stress (higher) toughness that is not K_Ic and depends on thickness.",
   "ar": "إن كانت العينة رقيقة جداً فالاختبار يقيس متانة في الإجهاد المستوي (أعلى) ليست K_Ic وتتبع السماكة."
  },
  {
   "en": "Ductile, tough materials need a very large specimen for K_Ic; then J-integral or CTOD tests (ASTM E1820) are used.",
   "ar": "المواد المطيلة المتينة تحتاج عينة كبيرة جداً لـ K_Ic؛ فتُستعمل حينها اختبارات تكامل J أو CTOD (ASTM E1820)."
  },
  {
   "en": "K_Ic changes with temperature, rate, and orientation (rolling direction).",
   "ar": "تتغير K_Ic مع الحرارة والمعدل والاتجاه (اتجاه الدرفلة)."
  }
 ],
 "notConfuse": {
  "en": "Fracture toughness K_Ic (MPa·√m) is how well a cracked body resists the crack running. It is not the area under the stress–strain curve (also called toughness, in J/m³), not Charpy energy (J), and not hardness. A hard, high-strength steel can have a low K_Ic.",
  "ar": "متانة الكسر K_Ic (MPa·√m) هي مدى مقاومة جسم مشقق لانطلاق الشق. وليست المساحة تحت منحنى الإجهاد والانفعال (وتسمى أيضاً متانة وبوحدة J/m³) ولا طاقة شاربي (J) ولا الصلادة. وقد يكون للفولاذ الصلد العالي المقاومة K_Ic منخفضة."
 },
 "apps": [
  {
   "en": "Damage-tolerant design of aircraft, pressure vessels, pipelines and rotors: finding the critical crack size and inspection intervals.",
   "ar": "التصميم المتحمل للضرر للطائرات وأوعية الضغط وخطوط الأنابيب والدوّارات: إيجاد حجم الشق الحرج وفواصل الفحص."
  },
  {
   "en": "Choosing materials and heat treatments (higher K_Ic often means lower strength).",
   "ar": "اختيار المواد والمعالجات الحرارية (فـ K_Ic الأعلى تعني غالباً مقاومة أقل)."
  },
  {
   "en": "Assessing ceramics, glass and composites with small flaws.",
   "ar": "تقييم السيراميك والزجاج والمركبات ذات العيوب الصغيرة."
  }
 ],
 "figs": [
  {
   "k": "ct",
   "cap": {
    "en": "The C(T) specimen drawn to scale with W = 50 mm, a = 25 mm and B = 25 mm (the example): two loading holes, the machined notch and the red fatigue crack.",
    "ar": "عينة C(T) مرسومة بمقياس رسم عند W = 50 مم وa = 25 مم وB = 25 مم (المثال): ثقبا التحميل والشق المشغَّل وشق الكلل الأحمر."
   }
  },
  {
   "k": "ctPQ",
   "cap": {
    "en": "A load–opening record (illustrative shape): the dashed line with 95 % of the starting slope (the \"5 % secant\") meets the record at P_Q = 20 kN. The highest load is P_max = 21 kN, so P_max/P_Q = 1.05 ≤ 1.10 and the test passes this condition.",
    "ar": "سجل حمل–انفتاح (شكل توضيحي): الخط المتقطع بـ 95% من الميل الأولي («القاطع 5%») يقابل السجل عند P_Q = 20 kN. وأعلى حمل P_max = 21 kN فتكون P_max/P_Q = 1.05 ≤ 1.10 فيحقق الاختبار هذا الشرط."
   }
  },
  {
   "k": "kAplot",
   "cap": {
    "en": "K_I = Y·σ·√(π·a) for σ = 300 MPa and Y = 1.12, plotted against the crack length. It crosses K_Ic = 50 MPa·√m at a_c = 7.05 mm (worked example): a longer crack runs.",
    "ar": "K_I = Y·σ·√(π·a) عند σ = 300 MPa وY = 1.12 مرسومة مقابل طول الشق. تقطع K_Ic = 50 MPa·√m عند a_c = 7.05 مم (المثال المحلول): الشق الأطول ينطلق."
   }
  }
 ],
 "see": [
  "charpy",
  "brinell",
  "fatigue"
 ]
});
M.tests.push({
 "id": "fatigue",
 "cat": "longterm",
 "icon": "fa-rotate-right",
 "name": {
  "en": "Fatigue test",
  "ar": "اختبار الكلل"
 },
 "short": {
  "en": "Load a bar again and again until it breaks: gives how many cycles it lasts and the stress it can survive for ever.",
  "ar": "تحميل قضيب مراراً حتى ينكسر: يعطي عدد الدورات التي يتحملها والإجهاد الذي يتحمله إلى ما لا نهاية."
 },
 "gist": {
  "en": "Load a smooth bar again and again with a stress that goes up and down, and count how many cycles it survives.",
  "ar": "نحمّل قضيباً أملس مراراً بإجهاد يصعد ويهبط ونعدّ كم دورة يتحمل."
 },
 "std": "ASTM E466 (axial, force-controlled) · ASTM E739 (S–N data analysis) · ISO 1099 (axial) · ISO 1143 (rotating bending)",
 "purpose": {
  "en": "Most machine parts do not break from one big load, but from small loads repeated millions of times, even when each load is far below the strength of the metal. The fatigue test tells how many repetitions a metal survives at a given stress, and the stress below which it can run (almost) for ever.",
  "ar": "معظم أجزاء الآلات لا تنكسر من حمل واحد كبير بل من أحمال صغيرة تتكرر ملايين المرات، حتى لو كان كل حمل أقل بكثير من مقاومة المعدن. يبيّن اختبار الكلل كم تكراراً يتحمل المعدن عند إجهاد معين، والإجهاد الذي تحته يعمل (تقريباً) إلى ما لا نهاية."
 },
 "principle": {
  "en": "A smooth polished bar is loaded again and again, so that the stress goes up and down like a wave with a constant size. The machine counts the cycles N until the bar breaks, or stops at a very large number (10⁷ for steel) if it does not break. Each bar gives one point (N, stress). Many bars at different stresses give the S–N curve. The break starts as a tiny crack on the surface, which grows a little at every cycle until the rest of the bar suddenly breaks.",
  "ar": "يُحمَّل قضيب أملس مصقول مراراً بحيث يصعد الإجهاد ويهبط كموجة بحجم ثابت. تعدّ الآلة الدورات N حتى ينكسر القضيب، أو تتوقف عند عدد كبير جداً (10⁷ للفولاذ) إن لم ينكسر. يعطي كل قضيب نقطة (N، الإجهاد). وتعطي قضبان كثيرة عند إجهادات مختلفة منحنى S–N. يبدأ الكسر بشق صغير جداً على السطح ينمو قليلاً مع كل دورة حتى ينكسر باقي القضيب فجأة."
 },
 "apparatus": {
  "en": "A rotating-bending machine (the bar turns while a weight bends it, so each point of the surface is stretched and squeezed once per turn), or a servo-hydraulic machine for pull–push or bending. A counter and an automatic stop when the bar breaks. Frequencies from tens to hundreds of cycles per second.",
  "ar": "آلة انحناء دوّار (يدور القضيب بينما يثنيه ثقل فتُشدّ كل نقطة على السطح وتُضغط مرة في كل دورة)، أو آلة هيدروليكية مؤازرة للشد والضغط أو الانحناء. وعدّاد وإيقاف آلي عند كسر القضيب. والترددات من عشرات إلى مئات الدورات في الثانية."
 },
 "specimen": {
  "en": "A round (or flat) bar with a smooth, polished, gradually curved middle part, free of scratches. The surface decides the life, so it must be perfect. Real parts have rougher surfaces, notches and a larger size, so the laboratory value is reduced for design.",
  "ar": "قضيب دائري (أو مسطح) بجزء أوسط أملس مصقول متدرج الانحناء وخالٍ من الخدوش. السطح هو الذي يحدد العمر لذا يجب أن يكون مثالياً. وللقطع الحقيقية أسطح أخشن وشقوق وحجم أكبر، فتُخفَّض القيمة المخبرية في التصميم."
 },
 "procedure": [
  {
   "en": "Prepare identical polished specimens (a dozen or more).",
   "ar": "حضّر عينات متطابقة مصقولة (اثنتي عشرة فأكثر)."
  },
  {
   "en": "Choose the first stress amplitude σ_a (about 0.6–0.7 σ_u for steels) and the mean stress or stress ratio R.",
   "ar": "اختر سعة الإجهاد الأولى σ_a (نحو 0.6–0.7 σ_u للفولاذ) والإجهاد المتوسط أو النسبة R."
  },
  {
   "en": "Run until fracture or the run-out and record N.",
   "ar": "شغّل حتى الكسر أو الحد الأقصى وسجّل N."
  },
  {
   "en": "Lower the stress for the next specimen and repeat to cover about 10³–10⁷ cycles.",
   "ar": "أنقص الإجهاد للعينة التالية وكرّر لتغطية نحو 10³–10⁷ دورة."
  },
  {
   "en": "Plot σ_a against log N, fit the curve, and examine the fracture surface (initiation site, beach marks, final fracture zone).",
   "ar": "ارسم σ_a مقابل log N وطابق المنحنى وافحص سطح الكسر (موضع البدء وعلامات الشاطئ ومنطقة الكسر النهائي)."
  }
 ],
 "results": {
  "en": "The S–N curve; fatigue (endurance) limit S_e for steels, which show a knee near 10⁶–10⁷ cycles; fatigue strength at a stated life (e.g. 5 × 10⁸ cycles) for aluminium and other metals without a true limit; scatter of life at each level.",
  "ar": "منحنى S–N؛ وحد الكلل (حد التحمل) S_e للفولاذ الذي يُظهر ركبة قرب 10⁶–10⁷ دورة؛ ومقاومة الكلل عند عمر محدد (مثل 5 × 10⁸ دورة) للألمنيوم وغيره مما ليس له حد حقيقي؛ وتبعثر العمر عند كل مستوى."
 },
 "terms": [
  [
   {
    "en": "Cycle",
    "ar": "الدورة"
   },
   {
    "en": "one complete up-and-down of the stress.",
    "ar": "صعود وهبوط كاملان للإجهاد."
   }
  ],
  [
   {
    "en": "Stress amplitude σ_a",
    "ar": "سعة الإجهاد σ_a"
   },
   {
    "en": "half of the total up-and-down range of the stress.",
    "ar": "نصف المدى الكلي لصعود الإجهاد وهبوطه."
   }
  ],
  [
   {
    "en": "Mean stress σ_m",
    "ar": "الإجهاد المتوسط σ_m"
   },
   {
    "en": "the middle value around which the stress goes up and down.",
    "ar": "القيمة الوسطى التي يصعد الإجهاد ويهبط حولها."
   }
  ],
  [
   {
    "en": "S–N curve",
    "ar": "منحنى S–N"
   },
   {
    "en": "stress (S) against the number of cycles to failure (N).",
    "ar": "الإجهاد (S) مقابل عدد الدورات حتى الانهيار (N)."
   }
  ],
  [
   {
    "en": "Endurance limit S_e",
    "ar": "حد التحمل S_e"
   },
   {
    "en": "the stress below which a steel, for practical purposes, does not break from fatigue (about 10⁷ cycles, no corrosion).",
    "ar": "الإجهاد الذي لا ينكسر الفولاذ تحته عملياً بالكلل (نحو 10⁷ دورة ودون تآكل)."
   }
  ]
 ],
 "eqs": [
  {
   "l": {
    "en": "Stress amplitude",
    "ar": "سعة الإجهاد"
   },
   "e": "σ_a = ( σ_max − σ_min ) / 2",
   "v": [
    [
     "σ_max",
     {
      "en": "highest stress in the cycle (MPa)",
      "ar": "أعلى إجهاد في الدورة (MPa)"
     }
    ],
    [
     "σ_min",
     {
      "en": "lowest stress in the cycle (MPa)",
      "ar": "أقل إجهاد في الدورة (MPa)"
     }
    ]
   ],
   "n": {
    "en": "Compression is negative.",
    "ar": "الضغط سالب."
   }
  },
  {
   "l": {
    "en": "Mean stress",
    "ar": "الإجهاد المتوسط"
   },
   "e": "σ_m = ( σ_max + σ_min ) / 2",
   "v": [],
   "n": {
    "en": "",
    "ar": ""
   }
  },
  {
   "l": {
    "en": "Stress ratio",
    "ar": "نسبة الإجهاد"
   },
   "e": "R = σ_min / σ_max",
   "v": [
    [
     "R",
     {
      "en": "stress ratio (no unit)",
      "ar": "نسبة الإجهاد (بلا وحدة)"
     }
    ]
   ],
   "n": {
    "en": "R = −1: fully reversed (rotating bar). R = 0: pulsating from zero.",
    "ar": "R = −1: انعكاس كامل (القضيب الدوّار). R = 0: نبض من الصفر."
   }
  },
  {
   "l": {
    "en": "Rule of thumb: endurance limit of steel",
    "ar": "قاعدة تقريبية: حد التحمل للفولاذ"
   },
   "e": "S′_e ≈ 0.5 · σ_u      (for σ_u ≤ 1400 MPa)",
   "v": [
    [
     "S′_e",
     {
      "en": "endurance limit of the polished test bar (MPa)",
      "ar": "حد التحمل للقضيب المخبري المصقول (MPa)"
     }
    ],
    [
     "σ_u",
     {
      "en": "ultimate tensile strength (MPa)",
      "ar": "مقاومة الشد القصوى (MPa)"
     }
    ]
   ],
   "n": {
    "en": "For real parts, reduce it for surface, size, load type and reliability.",
    "ar": "وللقطع الحقيقية يُخفَّض لأثر السطح والحجم ونوع الحمل والموثوقية."
   }
  },
  {
   "l": {
    "en": "Life in the sloping part of the S–N curve (Basquin)",
    "ar": "العمر في الجزء المائل من منحنى S–N (باسكوين)"
   },
   "e": "σ_a = σ′_f · ( 2N )^b",
   "v": [
    [
     "σ′_f",
     {
      "en": "fatigue strength coefficient (MPa), from the data",
      "ar": "معامل مقاومة الكلل (MPa) من البيانات"
     }
    ],
    [
     "b",
     {
      "en": "exponent, about −0.05 to −0.12",
      "ar": "الأس، نحو −0.05 إلى −0.12"
     }
    ],
    [
     "N",
     {
      "en": "cycles to failure",
      "ar": "عدد الدورات حتى الانهيار"
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
    "en": "Goodman line (effect of the mean stress)",
    "ar": "خط غودمان (أثر الإجهاد المتوسط)"
   },
   "e": "σ_a / S_e + σ_m / σ_u = 1 / n",
   "v": [
    [
     "S_e",
     {
      "en": "corrected endurance limit (MPa)",
      "ar": "حد التحمل المصحَّح (MPa)"
     }
    ],
    [
     "n",
     {
      "en": "safety factor against fatigue failure",
      "ar": "عامل الأمان ضد انهيار الكلل"
     }
    ]
   ],
   "n": {
    "en": "If n is larger than 1, the working point is below the line and the life is predicted to be unlimited. Also check separately that σ_max stays below the yield strength.",
    "ar": "إذا كان n أكبر من 1 فنقطة التشغيل تحت الخط ويُتوقع عمر غير محدود. وتحقق أيضاً بشكل منفصل أن σ_max أقل من حد الخضوع."
   }
  }
 ],
 "example": {
  "title": {
   "en": "Worked example: Goodman check",
   "ar": "مثال محلول: فحص غودمان"
  },
  "steps": [
   {
    "en": "A steel part (σ_u = 500 MPa, corrected endurance limit S_e = 250 MPa) sees σ_max = +240 MPa and σ_min = −80 MPa.",
    "ar": "قطعة فولاذ (σ_u = 500 MPa وحد التحمل المصحَّح S_e = 250 MPa) تتعرض لـ σ_max = +240 MPa وσ_min = −80 MPa."
   },
   {
    "en": "σ_a = (240 − (−80))/2 = 160 MPa; σ_m = (240 + (−80))/2 = 80 MPa; R = −80/240 = −0.33.",
    "ar": "σ_a = (240 − (−80))/2 = 160 MPa؛ σ_m = (240 + (−80))/2 = 80 MPa؛ R = −80/240 = −0.33."
   },
   {
    "en": "1/n = 160/250 + 80/500 = 0.64 + 0.16 = 0.80 → n = 1.25.",
    "ar": "1/n = 160/250 + 80/500 = 0.64 + 0.16 = 0.80 ← n = 1.25."
   }
  ],
  "result": {
   "en": "n = 1.25 > 1: the point is inside the Goodman line, so infinite life is predicted, with a 25 % margin.",
   "ar": "n = 1.25 > 1: النقطة داخل خط غودمان فيُتوقع عمر لانهائي بهامش 25%."
  }
 },
 "pitfalls": [
  {
   "en": "Life scatter is large: one specimen per level is not enough; use statistics (e.g. ASTM E739).",
   "ar": "تبعثر العمر كبير: عينة واحدة لكل مستوى لا تكفي؛ استعمل الإحصاء (مثل ASTM E739)."
  },
  {
   "en": "Surface finish, size, notches, corrosion and residual stress can cut the real endurance limit far below the laboratory value.",
   "ar": "قد تخفض نهاية السطح والحجم والشقوق والتآكل والإجهاد المتبقي حد التحمل الحقيقي كثيراً دون القيمة المخبرية."
  },
  {
   "en": "Aluminium and many non-ferrous metals have no true endurance limit; quote the strength at a stated number of cycles.",
   "ar": "الألمنيوم وكثير من المعادن غير الحديدية بلا حد تحمل حقيقي؛ اذكر المقاومة عند عدد دورات محدد."
  },
  {
   "en": "The S–N approach is for high-cycle fatigue (stresses mostly elastic); low-cycle fatigue uses strain-life methods.",
   "ar": "نهج S–N للكلل عالي الدورات (إجهادات مرنة غالباً)؛ أما منخفض الدورات فيستعمل طرائق الانفعال–العمر."
  }
 ],
 "notConfuse": {
  "en": "Fatigue is failure under repeated loading, even when the highest stress is below the yield strength. It is not static overload, not creep (slow stretching under a constant load at high temperature), and the endurance limit is not the yield strength. The final break of a fatigued part is sudden, but the crack grew slowly before.",
  "ar": "الكلل انهيار تحت حمل متكرر حتى لو كان أعلى إجهاد دون حد الخضوع. وهو ليس حملاً ساكناً زائداً وليس الزحف (تمدد بطيء تحت حمل ثابت عند حرارة عالية)، وحد التحمل ليس حد الخضوع. والكسر النهائي للقطعة المكلولة مفاجئ لكن الشق نما ببطء قبل ذلك."
 },
 "apps": [
  {
   "en": "Shafts, gears, springs, connecting rods, crankshafts, bolts and welded structures.",
   "ar": "الأعمدة والتروس والنوابض وأذرع التوصيل وأعمدة المرفق والمسامير والمنشآت الملحومة."
  },
  {
   "en": "Aircraft, rail and wind-turbine components with millions of cycles.",
   "ar": "مكونات الطائرات والقطارات وتوربينات الرياح بملايين الدورات."
  },
  {
   "en": "Design with the S–N curve and the Goodman diagram (see the gear lab for the bending-stress check).",
   "ar": "التصميم بمنحنى S–N ومخطط غودمان (انظر مختبر التروس لفحص إجهاد الانحناء)."
  }
 ],
 "figs": [
  {
   "k": "stressCycle",
   "cap": {
    "en": "Two cycles of the load of the worked example: the stress goes up and down between σ_max = 240 MPa and σ_min = −80 MPa, so the mean is σ_m = 80 MPa and the amplitude σ_a = 160 MPa.",
    "ar": "دورتان من حمل المثال المحلول: يصعد الإجهاد ويهبط بين σ_max = 240 MPa وσ_min = −80 MPa، فالمتوسط σ_m = 80 MPa والسعة σ_a = 160 MPa."
   }
  },
  {
   "k": "sn",
   "cap": {
    "en": "S–N curves (illustrative, built from the rules of thumb: 0.9 σ_u at 10³ cycles; steel with σ_u = 500 MPa levels off at S_e = 250 MPa from 10⁶ cycles; aluminium with σ_u = 300 MPa keeps falling). They are not measured data.",
    "ar": "منحنيا S–N (توضيحيان مبنيان على القواعد التقريبية: 0.9 σ_u عند 10³ دورة؛ فولاذ σ_u = 500 MPa يستقر عند S_e = 250 MPa من 10⁶ دورة؛ وألمنيوم σ_u = 300 MPa يواصل الانخفاض). وليسا بيانات مقاسة."
   }
  },
  {
   "k": "goodman",
   "cap": {
    "en": "The Goodman line for S_e = 250 MPa and σ_u = 500 MPa. The working point (σ_m, σ_a) = (80, 160) lies below it. Moving along the same ray to the line gives (100, 200), so n = 200 / 160 = 1.25.",
    "ar": "خط غودمان عند S_e = 250 MPa وσ_u = 500 MPa. نقطة التشغيل (σ_m، σ_a) = (80، 160) تقع تحته. وبالتحرك على الشعاع نفسه إلى الخط نصل إلى (100، 200) فيكون n = 200 / 160 = 1.25."
   }
  }
 ],
 "see": [
  "creep",
  "tensile",
  "fracture"
 ]
});
M.tests.push({
 "id": "creep",
 "cat": "longterm",
 "icon": "fa-hourglass-half",
 "name": {
  "en": "Creep test",
  "ar": "اختبار الزحف"
 },
 "short": {
  "en": "Hold a constant load on a hot bar for hundreds of hours and record how it slowly stretches.",
  "ar": "إبقاء حمل ثابت على قضيب ساخن مئات الساعات وتسجيل تمدده البطيء."
 },
 "gist": {
  "en": "Hang a constant load on a hot bar and watch how it slowly keeps stretching with time.",
  "ar": "نعلّق حملاً ثابتاً على قضيب ساخن ونراقب كيف يستمر في التمدد ببطء مع الزمن."
 },
 "std": "ASTM E139 · ISO 204",
 "purpose": {
  "en": "At high temperature a metal slowly stretches under a constant load, even a load far below its yield strength, and finally it can break. This matters for boiler tubes, steam pipes, turbine blades and furnace parts, which must last for years. The creep test measures this slow stretching and the time to break.",
  "ar": "عند الحرارة العالية يتمدد المعدن ببطء تحت حمل ثابت، حتى لو كان الحمل أقل بكثير من حد الخضوع، وقد ينكسر في النهاية. وهذا مهم لأنابيب المراجل وأنابيب البخار وريش التوربينات وأجزاء الأفران التي يجب أن تعمل سنوات. يقيس اختبار الزحف هذا التمدد البطيء وزمن الكسر."
 },
 "principle": {
  "en": "A tensile bar is loaded with a constant force inside a furnace at a constant temperature, and its stretch is recorded against time for hundreds or thousands of hours. The curve has an instant first stretch ε₀ followed by three stages: (I) primary, the stretching slows down; (II) secondary, the stretching goes at an almost constant slowest rate ε̇_s (this stage is most of the life); (III) tertiary, the stretching speeds up until the bar breaks. Creep becomes important above about 0.4 of the melting temperature in kelvin.",
  "ar": "يُحمَّل قضيب شد بقوة ثابتة داخل فرن بدرجة حرارة ثابتة ويُسجَّل تمدده مقابل الزمن لمئات أو آلاف الساعات. يبدأ المنحنى بتمدد لحظي أول ε₀ تتبعه ثلاث مراحل: (I) أولية يتباطأ فيها التمدد؛ (II) ثانوية يسير فيها التمدد بمعدل أدنى شبه ثابت ε̇_s (وهي معظم العمر)؛ (III) ثالثية يتسارع فيها التمدد حتى ينكسر القضيب. ويصبح الزحف مهماً فوق نحو 0.4 من درجة الانصهار بالكلفن."
 },
 "apparatus": {
  "en": "A creep frame (a lever or direct dead-weight loading), a furnace with very accurate temperature control (within a degree or two), thermocouples on the bar, an extensometer outside the hot zone, and a data logger that runs for the whole test, sometimes for months.",
  "ar": "إطار زحف (بذراع رافعة أو بتحميل مباشر بالأثقال)، وفرن بضبط دقيق جداً للحرارة (في حدود درجة أو درجتين)، ومزدوجات حرارية على القضيب، ومقياس استطالة خارج المنطقة الساخنة، ومسجّل بيانات يعمل طوال الاختبار، وأحياناً أشهراً."
 },
 "specimen": {
  "en": "A round or flat tensile bar like the tensile test bar, with ends for the pull rods. The gauge length, the grain size and the surface condition are recorded, because they affect creep.",
  "ar": "قضيب شد دائري أو مسطح كقضيب اختبار الشد وبنهايتين لقضبان الشد. يُسجَّل الطول القياسي وحجم الحبيبات وحالة السطح لأنها تؤثر في الزحف."
 },
 "procedure": [
  {
   "en": "Fit the specimen and extensometer; heat to the test temperature and let it stabilise.",
   "ar": "ركّب العينة ومقياس الاستطالة؛ وسخّن إلى حرارة الاختبار واتركها تستقر."
  },
  {
   "en": "Apply the load smoothly (the instantaneous strain ε₀ appears).",
   "ar": "طبّق الحمل بسلاسة (يظهر الانفعال اللحظي ε₀)."
  },
  {
   "en": "Record elongation against time while holding the load and temperature constant.",
   "ar": "سجّل الاستطالة مقابل الزمن مع إبقاء الحمل والحرارة ثابتين."
  },
  {
   "en": "Stop at rupture (creep-rupture test) or at a chosen strain or time (interrupted test).",
   "ar": "أوقف عند القطع (اختبار زحف–قطع) أو عند انفعال أو زمن مختار (اختبار موقوف)."
  },
  {
   "en": "Repeat at several stresses and temperatures to build the design map.",
   "ar": "كرّر عند عدة إجهادات وحرارات لبناء خريطة التصميم."
  }
 ],
 "results": {
  "en": "The creep curve ε(t), the minimum (steady-state) creep rate ε̇_s, the time to rupture t_r, the creep strength (stress giving a stated strain in a stated time) and the rupture ductility.",
  "ar": "منحنى الزحف ε(t) ومعدل الزحف الأدنى (المستقر) ε̇_s وزمن القطع t_r ومقاومة الزحف (الإجهاد الذي يعطي انفعالاً محدداً في زمن محدد) ومطيلية القطع."
 },
 "terms": [
  [
   {
    "en": "Creep",
    "ar": "الزحف"
   },
   {
    "en": "slow, continuing stretching under a constant load, mainly at high temperature.",
    "ar": "تمدد بطيء مستمر تحت حمل ثابت، خاصة عند الحرارة العالية."
   }
  ],
  [
   {
    "en": "Creep rate ε̇",
    "ar": "معدل الزحف ε̇"
   },
   {
    "en": "how fast the strain grows: strain per hour.",
    "ar": "سرعة نمو الانفعال: الانفعال في الساعة."
   }
  ],
  [
   {
    "en": "Rupture time t_r",
    "ar": "زمن القطع t_r"
   },
   {
    "en": "the time until the bar breaks.",
    "ar": "الزمن حتى ينكسر القضيب."
   }
  ],
  [
   {
    "en": "Melting temperature T_m",
    "ar": "درجة الانصهار T_m"
   },
   {
    "en": "in kelvin (K = °C + 273).",
    "ar": "بالكلفن (K = °م + 273)."
   }
  ]
 ],
 "eqs": [
  {
   "l": {
    "en": "When must creep be checked?",
    "ar": "متى يجب فحص الزحف؟"
   },
   "e": "T / T_m > 0.4",
   "v": [
    [
     "T",
     {
      "en": "working temperature (K)",
      "ar": "درجة حرارة التشغيل (K)"
     }
    ],
    [
     "T_m",
     {
      "en": "melting temperature (K)",
      "ar": "درجة الانصهار (K)"
     }
    ]
   ],
   "n": {
    "en": "Both in kelvin.",
    "ar": "كلتاهما بالكلفن."
   }
  },
  {
   "l": {
    "en": "Steady creep rate (Norton law)",
    "ar": "معدل الزحف المستقر (قانون نورتون)"
   },
   "e": "ε̇_s = A · σⁿ · exp( −Q / ( R · T ) )",
   "v": [
    [
     "ε̇_s",
     {
      "en": "steady creep rate (1/h)",
      "ar": "معدل الزحف المستقر (1/h)"
     }
    ],
    [
     "A, n",
     {
      "en": "constants of the material (n is about 3 to 8)",
      "ar": "ثوابت المادة (n نحو 3 إلى 8)"
     }
    ],
    [
     "σ",
     {
      "en": "stress (MPa)",
      "ar": "الإجهاد (MPa)"
     }
    ],
    [
     "Q",
     {
      "en": "activation energy (J/mol)",
      "ar": "طاقة التنشيط (J/mol)"
     }
    ],
    [
     "R",
     {
      "en": "8.314 J/(mol·K)",
      "ar": "8.314 J/(mol·K)"
     }
    ],
    [
     "T",
     {
      "en": "temperature (K)",
      "ar": "درجة الحرارة (K)"
     }
    ]
   ],
   "n": {
    "en": "The rate grows quickly with both the stress and the temperature.",
    "ar": "يزداد المعدل بسرعة مع الإجهاد ومع الحرارة معاً."
   }
  },
  {
   "l": {
    "en": "Larson–Miller parameter (to predict long life from short tests)",
    "ar": "وسيط لارسون–ميلر (للتنبؤ بالعمر الطويل من اختبارات قصيرة)"
   },
   "e": "P = T · ( C + log₁₀ t_r )",
   "v": [
    [
     "P",
     {
      "en": "Larson–Miller parameter",
      "ar": "وسيط لارسون–ميلر"
     }
    ],
    [
     "T",
     {
      "en": "temperature (K)",
      "ar": "درجة الحرارة (K)"
     }
    ],
    [
     "t_r",
     {
      "en": "time to rupture (hours)",
      "ar": "زمن القطع (ساعات)"
     }
    ],
    [
     "C",
     {
      "en": "a constant, about 20 for many steels",
      "ar": "ثابت نحو 20 لكثير من الفولاذات"
     }
    ]
   ],
   "n": {
    "en": "The same P (at the same stress) means equivalent conditions: a short hot test can stand for a long, cooler service.",
    "ar": "تساوي P (عند الإجهاد نفسه) يعني ظروفاً متكافئة: اختبار ساخن قصير يمثل خدمة طويلة أبرد."
   }
  }
 ],
 "example": {
  "title": {
   "en": "Worked example: Larson–Miller",
   "ar": "مثال محلول: لارسون–ميلر"
  },
  "steps": [
   {
    "en": "A steel under a given stress ruptured in t_r = 1000 h at T = 900 K. With C = 20: P = 900·(20 + log₁₀ 1000) = 900·(20 + 3) = 20 700.",
    "ar": "فولاذ تحت إجهاد معين انقطع في t_r = 1000 ساعة عند T = 900 K. مع C = 20: P = 900·(20 + log₁₀ 1000) = 900·(20 + 3) = 20 700."
   },
   {
    "en": "Same stress at T = 850 K: 20 700 = 850·(20 + log₁₀ t_r) → log₁₀ t_r = 24.35 − 20 = 4.35.",
    "ar": "الإجهاد نفسه عند T = 850 K: 20 700 = 850·(20 + log₁₀ t_r) ← log₁₀ t_r = 24.35 − 20 = 4.35."
   },
   {
    "en": "t_r = 10^4.35 ≈ 22 500 h (about 2.6 years).",
    "ar": "t_r = 10^4.35 ≈ 22 500 ساعة (نحو 2.6 سنة)."
   }
  ],
  "result": {
   "en": "Lowering the temperature by 50 K extends the predicted life from 1000 h to about 22 500 h, so short hot tests can be used to estimate long lives (an extrapolation that must be validated).",
   "ar": "خفض الحرارة 50 K يمدّ العمر المتوقع من 1000 ساعة إلى نحو 22 500 ساعة، فتُستعمل اختبارات ساخنة قصيرة لتقدير أعمار طويلة (استقراء يجب التحقق منه)."
  }
 },
 "pitfalls": [
  {
   "en": "Temperature control matters: a few kelvin change the rate by a large factor.",
   "ar": "للتحكم بالحرارة أهمية: تغيّر بضع درجات كلفن المعدل بعامل كبير."
  },
  {
   "en": "Extrapolating short tests to decades is uncertain (new mechanisms may appear).",
   "ar": "استقراء الاختبارات القصيرة إلى عقود غير مؤكد (قد تظهر آليات جديدة)."
  },
  {
   "en": "Constant-load tests see a rising true stress as the area shrinks (the tertiary stage); constant-stress tests differ.",
   "ar": "اختبارات الحمل الثابت يرتفع فيها الإجهاد الحقيقي مع تناقص المساحة (المرحلة الثالثة)؛ بخلاف اختبارات الإجهاد الثابت."
  },
  {
   "en": "Oxidation of the specimen changes the cross-section in long tests.",
   "ar": "تأكسد العينة يغيّر المقطع في الاختبارات الطويلة."
  }
 ],
 "notConfuse": {
  "en": "Creep is slow stretching under a constant load. It is not fatigue (repeated loading) and not stress relaxation (the stress falls while the length is held constant). Lead, solder and many plastics creep even at room temperature, because room temperature is already \"hot\" for them.",
  "ar": "الزحف تمدد بطيء تحت حمل ثابت. وهو ليس الكلل (حمل متكرر) وليس استرخاء الإجهاد (يهبط الإجهاد بينما يُثبَّت الطول). والرصاص واللحام وكثير من اللدائن تزحف حتى في درجة حرارة الغرفة لأنها «ساخنة» أصلاً بالنسبة إليها."
 },
 "apps": [
  {
   "en": "Steam pipes, boiler tubes and pressure vessels in power plants.",
   "ar": "أنابيب البخار وأنابيب المراجل وأوعية الضغط في محطات الطاقة."
  },
  {
   "en": "Gas-turbine and jet-engine blades (nickel superalloys), furnace parts, exhaust systems.",
   "ar": "ريش التوربينات الغازية ومحركات الطائرات (سبائك النيكل الفائقة) وأجزاء الأفران وأنظمة العادم."
  },
  {
   "en": "Solder joints, plastic pipes and lead sheeting where creep occurs near room temperature.",
   "ar": "وصلات اللحام وأنابيب اللدائن وصفائح الرصاص حيث يحدث الزحف قرب حرارة الغرفة."
  }
 ],
 "figs": [
  {
   "k": "creep",
   "cap": {
    "en": "A creep curve (illustrative shape, not measured data): instant stretch ε₀, then stage I (slowing), stage II (almost straight, slope = ε̇_s) and stage III (speeding up to the break). The dashed curve: a higher stress or temperature makes everything faster and the life shorter.",
    "ar": "منحنى زحف (شكل توضيحي وليس بيانات مقاسة): تمدد لحظي ε₀ ثم المرحلة I (تباطؤ) والمرحلة II (شبه مستقيمة وميلها ε̇_s) والمرحلة III (تسارع حتى الكسر). المنحنى المتقطع: الإجهاد أو الحرارة الأعلى يجعل كل شيء أسرع ويقصّر العمر."
   }
  },
  {
   "k": "larson",
   "cap": {
    "en": "The numbers of the worked example, from log₁₀ t_r = P/T − 20 with P = 20 700: rupture after 1000 h at 900 K and after about 22 500 h at 850 K. A 50 K lower temperature gives a life about 22 times longer.",
    "ar": "أرقام المثال المحلول من log₁₀ t_r = P/T − 20 عند P = 20 700: القطع بعد 1000 ساعة عند 900 K وبعد نحو 22 500 ساعة عند 850 K. خفض الحرارة 50 K يعطي عمراً أطول بنحو 22 مرة."
   }
  }
 ],
 "see": [
  "fatigue",
  "tensile"
 ]
});
})();
