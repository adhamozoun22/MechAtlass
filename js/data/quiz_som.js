/* MechAtlas — Strength of Materials question bank (pilot, 30 questions). Standalone data file: not loaded by index.html until approved. */
(function () {
    window.MECHATLAS_QUIZ_BANKS = window.MECHATLAS_QUIZ_BANKS || {};
    window.MECHATLAS_QUIZ_BANKS.som = {
 "id": "som",
 "title": {
  "en": "Strength of Materials",
  "ar": "مقاومة المواد"
 },
 "levels": {
  "1": {
   "en": "Basic",
   "ar": "أساسي"
  },
  "2": {
   "en": "Intermediate",
   "ar": "متوسط"
  },
  "3": {
   "en": "Advanced",
   "ar": "متقدم"
  }
 },
 "topics": {
  "stress-strain": {
   "en": "Stress and strain",
   "ar": "الإجهاد والانفعال"
  },
  "hooke": {
   "en": "Hooke's law and E",
   "ar": "قانون هوك ومعامل المرونة"
  },
  "axial": {
   "en": "Axial deformation",
   "ar": "التشوه المحوري"
  },
  "shear": {
   "en": "Shear",
   "ar": "القص"
  },
  "torsion": {
   "en": "Torsion",
   "ar": "الالتواء"
  },
  "bending": {
   "en": "Bending",
   "ar": "الانحناء"
  },
  "thermal": {
   "en": "Thermal stress",
   "ar": "الإجهاد الحراري"
  },
  "combined": {
   "en": "Combined stresses",
   "ar": "الإجهادات المركبة"
  },
  "columns": {
   "en": "Columns (buckling)",
   "ar": "الأعمدة (الانبعاج)"
  },
  "vessels": {
   "en": "Thin-walled vessels",
   "ar": "الأوعية رقيقة الجدار"
  }
 },
 "questions": [
  {
   "id": "som-01",
   "subject": "som",
   "topic": "stress-strain",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "Which of these quantities is dimensionless (has no unit)?",
    "ar": "أي من هذه الكميات بلا وحدة (لا بعد لها)؟"
   },
   "opts": [
    {
     "en": "Torque (T)",
     "ar": "العزم (T)",
     "why": {
      "en": "Torque is force × distance, in N·m.",
      "ar": "العزم قوة × مسافة، بوحدة N·m."
     }
    },
    {
     "en": "Strain (ε = ΔL / L₀)",
     "ar": "الانفعال (ε = ΔL / L₀)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Modulus of elasticity (E)",
     "ar": "معامل المرونة (E)",
     "why": {
      "en": "E = σ/ε has the same unit as stress (Pa or GPa).",
      "ar": "E = σ/ε له وحدة الإجهاد نفسها (Pa أو GPa)."
     }
    },
    {
     "en": "Stress (σ = F / A)",
     "ar": "الإجهاد (σ = F / A)",
     "why": {
      "en": "Stress is force per area, so it has the unit Pa (N/m²).",
      "ar": "الإجهاد قوة لكل مساحة، فوحدته Pa (N/m²)."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "Strain is a ratio of two lengths (change in length / original length), so the units cancel.",
    "ar": "الانفعال نسبة بين طولين (التغير في الطول / الطول الأصلي) فتُلغى الوحدات."
   }
  },
  {
   "id": "som-02",
   "subject": "som",
   "topic": "hooke",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "Hooke's law, σ = E·ε, is valid…",
    "ar": "قانون هوك σ = E·ε صالح…"
   },
   "opts": [
    {
     "en": "only for brittle materials",
     "ar": "للمواد القصفة فقط",
     "why": {
      "en": "It applies to ductile materials too, inside their elastic range.",
      "ar": "ينطبق على المواد المطيلة أيضاً داخل مداها المرن."
     }
    },
    {
     "en": "only inside the linear elastic (proportional) region of the material",
     "ar": "داخل المنطقة المرنة الخطية (التناسبية) للمادة فقط",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "only after the material has yielded",
     "ar": "بعد أن تخضع المادة فقط",
     "why": {
      "en": "After yielding the deformation is plastic and stress is not proportional to strain.",
      "ar": "بعد الخضوع يصبح التشوه لدناً والإجهاد غير متناسب مع الانفعال."
     }
    },
    {
     "en": "up to the ultimate tensile strength for every metal",
     "ar": "حتى مقاومة الشد القصوى لكل المعادن",
     "why": {
      "en": "The curve is no longer a straight line beyond the proportional/yield region.",
      "ar": "المنحنى لم يعد خطاً مستقيماً بعد منطقة التناسب/الخضوع."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "Stress and strain are proportional only in the elastic range, where E is the (constant) slope of the straight part of the curve.",
    "ar": "الإجهاد والانفعال متناسبان في المدى المرن فقط، حيث E هو ميل الجزء المستقيم من المنحنى (ثابت)."
   }
  },
  {
   "id": "som-03",
   "subject": "som",
   "topic": "stress-strain",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A bar carries an axial tensile force of 30 kN. Its cross-sectional area is 300 mm². What is the normal stress?",
    "ar": "قضيب يحمل قوة شد محورية مقدارها 30 kN، ومساحة مقطعه 300 mm². ما الإجهاد العمودي؟"
   },
   "opts": [
    {
     "en": "0.1 MPa",
     "ar": "0.1 MPa",
     "why": {
      "en": "The force was used in kN instead of N (a factor 1000 is missing).",
      "ar": "استُعملت القوة بـkN بدل N (ينقص عامل 1000)."
     }
    },
    {
     "en": "1,000 MPa",
     "ar": "1,000 MPa",
     "why": {
      "en": "A power-of-ten slip in the unit conversion.",
      "ar": "خطأ في قوة العشرة أثناء تحويل الوحدات."
     }
    },
    {
     "en": "100 MPa",
     "ar": "100 MPa",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "9.000e+06 MPa",
     "ar": "9.000e+06 MPa",
     "why": {
      "en": "The force was multiplied by the area; stress is force DIVIDED by area.",
      "ar": "ضُربت القوة في المساحة؛ والإجهاد = القوة مقسومة على المساحة."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "σ = F / A = 30000 N / 300 mm² = 100 N/mm² = 100 MPa (1 N/mm² = 1 MPa).",
    "ar": "σ = F / A = 30000 N / 300 mm² = 100 N/mm² = 100 MPa (1 N/mm² = 1 MPa)."
   }
  },
  {
   "id": "som-04",
   "subject": "som",
   "topic": "stress-strain",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A 250 mm long wire stretches by 0.5 mm under load. What is the engineering strain?",
    "ar": "سلك طوله 250 mm يستطيل 0.5 mm تحت الحمل. ما الانفعال الهندسي؟"
   },
   "opts": [
    {
     "en": "0.02",
     "ar": "0.02",
     "why": {
      "en": "A power-of-ten slip (0.5 / 25 instead of 0.5 / 250).",
      "ar": "خطأ في قوة العشرة (0.5 / 25 بدل 0.5 / 250)."
     }
    },
    {
     "en": "500",
     "ar": "500",
     "why": {
      "en": "The ratio was inverted: strain is ΔL / L₀, not L₀ / ΔL.",
      "ar": "قُلبت النسبة: الانفعال = ΔL / L₀ وليس L₀ / ΔL."
     }
    },
    {
     "en": "0.002 (= 0.2 %)",
     "ar": "0.002 (= 0.2%)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "0.5",
     "ar": "0.5",
     "why": {
      "en": "That is the elongation itself; strain is elongation divided by the original length.",
      "ar": "هذه الاستطالة نفسها؛ والانفعال = الاستطالة مقسومة على الطول الأصلي."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "ε = ΔL / L₀ = 0.5 / 250 = 0.002, i.e. 0.2 %.",
    "ar": "ε = ΔL / L₀ = 0.5 / 250 = 0.002 أي 0.2%."
   }
  },
  {
   "id": "som-05",
   "subject": "som",
   "topic": "stress-strain",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "With the common sign convention (tension positive), a bar that is squeezed by two axial forces has…",
    "ar": "في اصطلاح الإشارة الشائع (الشد موجب)، القضيب الذي تضغطه قوتان محوريتان له…"
   },
   "opts": [
    {
     "en": "only shear stress and no normal stress",
     "ar": "إجهاد قص فقط دون إجهاد عمودي",
     "why": {
      "en": "The forces are along the axis, so on a cross-section they cause normal stress.",
      "ar": "القوى على المحور فتسبب إجهاداً عمودياً على المقطع."
     }
    },
    {
     "en": "zero stress",
     "ar": "إجهاد صفر",
     "why": {
      "en": "The forces are not zero, so stress exists.",
      "ar": "القوى ليست صفراً فالإجهاد موجود."
     }
    },
    {
     "en": "a positive normal stress",
     "ar": "إجهاد عمودي موجب",
     "why": {
      "en": "Positive is used for tension in this convention.",
      "ar": "الموجب يُستعمل للشد في هذا الاصطلاح."
     }
    },
    {
     "en": "a negative normal stress (compression)",
     "ar": "إجهاد عمودي سالب (ضغط)",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Axial compression gives a normal stress on the cross-section; in the tension-positive convention it is negative.",
    "ar": "الضغط المحوري يسبب إجهاداً عمودياً على المقطع؛ وهو سالب في اصطلاح الشد الموجب."
   }
  },
  {
   "id": "som-06",
   "subject": "som",
   "topic": "hooke",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "Two steel grades have the same modulus of elasticity E but different yield strengths. Under the same stress (below both yield strengths) they…",
    "ar": "نوعان من الفولاذ لهما معامل المرونة E نفسه لكن إجهاد خضوعهما مختلف. تحت الإجهاد نفسه (أقل من خضوع كليهما) فإنهما…"
   },
   "opts": [
    {
     "en": "the weaker steel stretches more",
     "ar": "الفولاذ الأضعف يستطيل أكثر",
     "why": {
      "en": "Same E and same σ give the same ε.",
      "ar": "E نفسه وσ نفسه يعطيان ε نفسه."
     }
    },
    {
     "en": "show the same elastic strain",
     "ar": "يُظهران الانفعال المرن نفسه",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "cannot be compared without the ultimate strength",
     "ar": "لا يمكن المقارنة دون مقاومة الشد القصوى",
     "why": {
      "en": "ε = σ / E in the elastic range is enough.",
      "ar": "ε = σ / E في المدى المرن كافية."
     }
    },
    {
     "en": "the stronger steel stretches less",
     "ar": "الفولاذ الأقوى يستطيل أقل",
     "why": {
      "en": "Elastic strain is σ / E; strength does not change it, only E does.",
      "ar": "الانفعال المرن = σ / E؛ والمقاومة لا تغيّره، بل E وحده."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "E measures stiffness (resistance to elastic deformation), not strength. ε = σ / E is the same for both.",
    "ar": "E مقياس الصلابة (مقاومة التشوه المرن) لا المقاومة. ε = σ / E متساوية للنوعين."
   }
  },
  {
   "id": "som-07",
   "subject": "som",
   "topic": "axial",
   "level": 1,
   "type": "applied",
   "q": {
    "en": "Two rods have the same length and cross-section and carry the same axial load. Steel has E ≈ 200 GPa and aluminium has E ≈ 70 GPa. Which one lengthens more, and by roughly how much?",
    "ar": "قضيبان بالطول ومساحة المقطع نفسيهما ويحملان الحمل المحوري نفسه. للفولاذ E ≈ 200 GPa وللألمنيوم E ≈ 70 GPa. أيهما يستطيل أكثر وبكم تقريباً؟"
   },
   "opts": [
    {
     "en": "Both lengthen the same, because the load is the same",
     "ar": "كلاهما يستطيل بالمقدار نفسه لأن الحمل نفسه",
     "why": {
      "en": "δ also depends on E, which differs.",
      "ar": "δ تتوقف على E أيضاً وهو مختلف."
     }
    },
    {
     "en": "Steel, about 2.9 times as much",
     "ar": "الفولاذ، بنحو 2.9 مرة",
     "why": {
      "en": "The lower E gives the larger elongation (δ = PL / AE), so it is aluminium.",
      "ar": "الأقل E يعطي استطالة أكبر (δ = PL / AE) فهو الألمنيوم."
     }
    },
    {
     "en": "Aluminium, about 1.4 times as much",
     "ar": "الألمنيوم، بنحو 1.4 مرة",
     "why": {
      "en": "The ratio is E_steel / E_Al = 200 / 70, not its square root.",
      "ar": "النسبة = E_steel / E_Al = 200 / 70 وليس جذرها."
     }
    },
    {
     "en": "Aluminium, about 2.9 times as much",
     "ar": "الألمنيوم، بنحو 2.9 مرة",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "δ = P L / (A E): with equal P, L, A the elongation is inversely proportional to E, so δ_Al / δ_steel = 200 / 70 ≈ 2.9.",
    "ar": "δ = P L / (A E): عند تساوي P وL وA تتناسب الاستطالة عكسياً مع E فتكون δ_Al / δ_steel = 200 / 70 ≈ 2.9."
   }
  },
  {
   "id": "som-08",
   "subject": "som",
   "topic": "shear",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "Shear stress acts…",
    "ar": "يعمل إجهاد القص…"
   },
   "opts": [
    {
     "en": "along the axis of the bar in every case",
     "ar": "على محور القضيب في كل الحالات",
     "why": {
      "en": "Its direction is set by the plane it acts on, not always the bar axis.",
      "ar": "اتجاهه يحدده المستوى المتأثر لا محور القضيب دائماً."
     }
    },
    {
     "en": "only on surfaces that are free of load",
     "ar": "على الأسطح الخالية من الحمل فقط",
     "why": {
      "en": "It acts on loaded internal planes, such as the section of a bolt in shear.",
      "ar": "يؤثر على مستويات داخلية محمّلة كمقطع برغي معرَّض للقص."
     }
    },
    {
     "en": "perpendicular to the surface it acts on",
     "ar": "عمودياً على السطح الذي يؤثر عليه",
     "why": {
      "en": "That describes normal stress (tension or compression).",
      "ar": "هذا وصف الإجهاد العمودي (شد أو ضغط)."
     }
    },
    {
     "en": "parallel (tangent) to the surface it acts on",
     "ar": "موازياً (مماساً) للسطح الذي يؤثر عليه",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Normal stress is perpendicular to a plane; shear stress is the component in the plane (tangential), as in a bolt or rivet cut by two plates sliding.",
    "ar": "الإجهاد العمودي عمودي على المستوى، وإجهاد القص مركّبته في المستوى (مماسية) كما في برغي أو برشام تقصّه صفيحتان منزلقتان."
   }
  },
  {
   "id": "som-09",
   "subject": "som",
   "topic": "shear",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A bolt of diameter 10 mm is in single shear and carries a shear force of 10 kN. What is the average shear stress?",
    "ar": "برغي قطره 10 mm معرَّض لقص مفرد وقوة القص 10 kN. ما متوسط إجهاد القص؟"
   },
   "opts": [
    {
     "en": "100 MPa",
     "ar": "100 MPa",
     "why": {
      "en": "The area was taken as d² (a square), not the circle π d² / 4.",
      "ar": "أُخذت المساحة d² (مربع) بدل الدائرة π d² / 4."
     }
    },
    {
     "en": "127.3 MPa",
     "ar": "127.3 MPa",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "31.83 MPa",
     "ar": "31.83 MPa",
     "why": {
      "en": "The area was taken as π d² instead of π d² / 4.",
      "ar": "أُخذت المساحة π d² بدل π d² / 4."
     }
    },
    {
     "en": "63.66 MPa",
     "ar": "63.66 MPa",
     "why": {
      "en": "That is the value for double shear (two planes), not single shear.",
      "ar": "هذه قيمة القص المزدوج (مستويان) لا المفرد."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "A = π d² / 4 = 78.54 mm²;  τ = F / A = 10000 / 78.54 = 127.3 MPa.",
    "ar": "A = π d² / 4 = 78.54 mm²;  τ = F / A = 10000 / 78.54 = 127.3 MPa."
   }
  },
  {
   "id": "som-10",
   "subject": "som",
   "topic": "axial",
   "level": 1,
   "type": "applied",
   "q": {
    "en": "A bar carries a fixed axial load. If its length AND its cross-sectional area are both doubled (same material), the elongation δ = PL / (AE)…",
    "ar": "قضيب يحمل حملاً محورياً ثابتاً. إذا تضاعف طوله ومساحة مقطعه معاً (المادة نفسها) فإن الاستطالة δ = PL / (AE)…"
   },
   "opts": [
    {
     "en": "stays the same",
     "ar": "تبقى كما هي",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "becomes four times larger",
     "ar": "تصبح أربعة أضعاف",
     "why": {
      "en": "δ is proportional to L and inversely proportional to A, not to L².",
      "ar": "δ تتناسب طردياً مع L وعكسياً مع A لا مع L²."
     }
    },
    {
     "en": "doubles",
     "ar": "تتضاعف",
     "why": {
      "en": "Doubling L doubles δ, but doubling A halves it: the effects cancel.",
      "ar": "مضاعفة L تضاعف δ لكن مضاعفة A تنصّفها: الأثران يتعادلان."
     }
    },
    {
     "en": "is halved",
     "ar": "تصبح النصف",
     "why": {
      "en": "Only the area effect was counted; the length effect was ignored.",
      "ar": "حُسب أثر المساحة فقط وأُهمل أثر الطول."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "δ ∝ L / A. With L → 2L and A → 2A, the ratio L / A is unchanged, so δ is unchanged (stress is also unchanged).",
    "ar": "δ ∝ L / A. عند L → 2L وA → 2A تبقى النسبة L / A ثابتة فتبقى δ ثابتة (والإجهاد ثابت أيضاً)."
   }
  },
  {
   "id": "som-11",
   "subject": "som",
   "topic": "axial",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A steel rod (E = 200 GPa) of diameter 20 mm and length 2 m carries an axial tensile load of 50 kN. What is its elongation?",
    "ar": "قضيب فولاذي (E = 200 GPa) قطره 20 mm وطوله 2 m يحمل حمل شد محورياً 50 kN. ما استطالته؟"
   },
   "opts": [
    {
     "en": "1.592 mm",
     "ar": "1.592 mm",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "0.001592 mm",
     "ar": "0.001592 mm",
     "why": {
      "en": "The length was left in metres while the other quantities are in mm and N.",
      "ar": "تُرك الطول بالمتر بينما بقية الكميات بـmm وN."
     }
    },
    {
     "en": "0.3979 mm",
     "ar": "0.3979 mm",
     "why": {
      "en": "The radius was replaced by the diameter in the area, giving an area four times too large (A = π d²).",
      "ar": "استُعمل القطر مكان نصف القطر في المساحة فخرجت أكبر 4 مرات (A = π d²)."
     }
    },
    {
     "en": "1,592 mm",
     "ar": "1,592 mm",
     "why": {
      "en": "E was entered as 200 (GPa) instead of 200 000 (MPa) while the stress is in MPa.",
      "ar": "أُدخل E على أنه 200 (GPa) بدل 200 000 (MPa) بينما الإجهاد بـMPa."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "A = π d² / 4 = 314.2 mm²;  δ = P L / (A E) = 50000 × 2000 / (314.2 × 200000) = 1.592 mm.",
    "ar": "A = π d² / 4 = 314.2 mm²;  δ = P L / (A E) = 50000 × 2000 / (314.2 × 200000) = 1.592 mm."
   }
  },
  {
   "id": "som-12",
   "subject": "som",
   "topic": "hooke",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "In the straight elastic part of a tensile test a specimen shows a stress of 150 MPa at a strain of 0.00075. What is the modulus of elasticity?",
    "ar": "في الجزء المرن المستقيم من اختبار شد أظهرت عينة إجهاداً 150 MPa عند انفعال 0.00075. ما معامل المرونة؟"
   },
   "opts": [
    {
     "en": "200 GPa",
     "ar": "200 GPa",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "0.005 GPa",
     "ar": "0.005 GPa",
     "why": {
      "en": "The ratio was inverted (ε / σ).",
      "ar": "قُلبت النسبة (ε / σ)."
     }
    },
    {
     "en": "112.5 GPa",
     "ar": "112.5 GPa",
     "why": {
      "en": "Not a result of σ / ε; it comes from using a wrong strain value.",
      "ar": "لا ينتج عن σ / ε؛ ناتج عن استعمال قيمة انفعال خاطئة."
     }
    },
    {
     "en": "200 MPa",
     "ar": "200 MPa",
     "why": {
      "en": "The magnitude is right but the unit is not: 150 MPa / 0.00075 = 200 000 MPa = 200 GPa.",
      "ar": "المقدار صحيح لكن الوحدة خاطئة: 150 MPa / 0.00075 = 200 000 MPa = 200 GPa."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "E = σ / ε = 150 / 0.00075 = 200 000 MPa = 200 GPa, a typical value for steel.",
    "ar": "E = σ / ε = 150 / 0.00075 = 200 000 MPa = 200 GPa وهي قيمة نموذجية للفولاذ."
   }
  },
  {
   "id": "som-13",
   "subject": "som",
   "topic": "stress-strain",
   "level": 2,
   "type": "applied",
   "q": {
    "en": "A tie bar has a cross-section of 200 mm² and a yield strength of 250 MPa. With a factor of safety of 2 against yielding, what is the largest allowable axial load?",
    "ar": "قضيب شد مساحة مقطعه 200 mm² وإجهاد خضوعه 250 MPa. مع معامل أمان 2 ضد الخضوع، ما أكبر حمل محوري مسموح؟"
   },
   "opts": [
    {
     "en": "12.5 kN",
     "ar": "12.5 kN",
     "why": {
      "en": "The factor of safety was applied twice.",
      "ar": "طُبّق معامل الأمان مرتين."
     }
    },
    {
     "en": "100 kN",
     "ar": "100 kN",
     "why": {
      "en": "The factor of safety was multiplied instead of dividing the yield load.",
      "ar": "ضُرب معامل الأمان بدل أن يُقسم عليه حمل الخضوع."
     }
    },
    {
     "en": "50 kN",
     "ar": "50 kN",
     "why": {
      "en": "This is the load that reaches yield; the factor of safety was forgotten.",
      "ar": "هذا الحمل الذي يبلغ الخضوع؛ نُسي معامل الأمان."
     }
    },
    {
     "en": "25 kN",
     "ar": "25 kN",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "σ_allow = σ_y / n = 250 / 2 = 125 MPa;  F_allow = σ_allow × A = 125 × 200 = 25,000 N = 25 kN.",
    "ar": "σ_allow = σ_y / n = 250 / 2 = 125 MPa;  F_allow = σ_allow × A = 125 × 200 = 25,000 N = 25 kN."
   }
  },
  {
   "id": "som-14",
   "subject": "som",
   "topic": "hooke",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "A metal bar in the elastic range is stretched along its axis. What happens to its cross-section?",
    "ar": "قضيب معدني في المدى المرن يُشدّ على طول محوره. ماذا يحدث لمقطعه؟"
   },
   "opts": [
    {
     "en": "It does not change at all",
     "ar": "لا يتغير إطلاقاً",
     "why": {
      "en": "Real materials always contract sideways when stretched (ν > 0).",
      "ar": "المواد الحقيقية تنكمش جانبياً دائماً عند الشد (ν > 0)."
     }
    },
    {
     "en": "It gets slightly larger",
     "ar": "يكبر قليلاً",
     "why": {
      "en": "Lateral strain has the opposite sign of the axial strain: ε_lat = −ν ε_axial.",
      "ar": "الانفعال الجانبي إشارته عكس إشارة المحوري: ε_lat = −ν ε_axial."
     }
    },
    {
     "en": "It becomes elliptical",
     "ar": "يصبح إهليلجياً",
     "why": {
      "en": "For an isotropic material the contraction is the same in every lateral direction.",
      "ar": "في المادة المتماثلة الخواص يكون الانكماش نفسه في كل اتجاه جانبي."
     }
    },
    {
     "en": "It becomes slightly smaller (lateral contraction, governed by Poisson’s ratio ν)",
     "ar": "يصغر قليلاً (انكماش جانبي تحدده نسبة بواسون ν)",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Poisson’s ratio ν = −ε_lateral / ε_axial (about 0.3 for many metals): stretching a bar makes it thinner.",
    "ar": "نسبة بواسون ν = −ε_lateral / ε_axial (نحو 0.3 لكثير من المعادن): شدّ القضيب يجعله أنحف."
   }
  },
  {
   "id": "som-15",
   "subject": "som",
   "topic": "torsion",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A solid round shaft of diameter 40 mm transmits a torque of 500 N·m. What is the maximum shear stress (τ = 16 T / (π d³))?",
    "ar": "عمود دائري مصمت قطره 40 mm ينقل عزماً 500 N·m. ما أكبر إجهاد قص (τ = 16 T / (π d³))؟"
   },
   "opts": [
    {
     "en": "2.487 MPa",
     "ar": "2.487 MPa",
     "why": {
      "en": "The factor 16 was left out of the formula.",
      "ar": "سقط العامل 16 من المعادلة."
     }
    },
    {
     "en": "79.58 MPa",
     "ar": "79.58 MPa",
     "why": {
      "en": "The factor 32 (from J = π d⁴ / 32) was used instead of 16; the radius c = d / 2 was forgotten.",
      "ar": "استُعمل العامل 32 (من J = π d⁴ / 32) بدل 16؛ ونُسي نصف القطر c = d / 2."
     }
    },
    {
     "en": "0.03979 MPa",
     "ar": "0.03979 MPa",
     "why": {
      "en": "The torque was left in N·m while the diameter is in mm (a factor 1000 is missing).",
      "ar": "تُرك العزم بـN·m بينما القطر بـmm (ينقص عامل 1000)."
     }
    },
    {
     "en": "39.79 MPa",
     "ar": "39.79 MPa",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "T = 500000 N·mm;  τ = 16 T / (π d³) = 16 × 500000 / (π × 64000) = 39.79 MPa.",
    "ar": "T = 500000 N·mm;  τ = 16 T / (π d³) = 16 × 500000 / (π × 64000) = 39.79 MPa."
   }
  },
  {
   "id": "som-16",
   "subject": "som",
   "topic": "torsion",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "In a twisted solid circular shaft, where is the shear stress largest?",
    "ar": "في عمود دائري مصمت معرَّض للي، أين يكون إجهاد القص أكبر ما يمكن؟"
   },
   "opts": [
    {
     "en": "At the outer surface (τ = T r / J, largest at the largest radius)",
     "ar": "عند السطح الخارجي (τ = T r / J وهو أكبر عند أكبر نصف قطر)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "At half the radius",
     "ar": "عند نصف نصف القطر",
     "why": {
      "en": "τ grows linearly with r, so the middle value is half of the maximum.",
      "ar": "يزداد τ خطياً مع r فتكون القيمة الوسطى نصف الأقصى."
     }
    },
    {
     "en": "It is the same everywhere in the section",
     "ar": "متساوٍ في كل نقاط المقطع",
     "why": {
      "en": "τ is proportional to the distance from the axis.",
      "ar": "τ يتناسب مع البعد عن المحور."
     }
    },
    {
     "en": "At the centre of the shaft",
     "ar": "في مركز العمود",
     "why": {
      "en": "At the centre r = 0, so τ = 0.",
      "ar": "في المركز r = 0 فيكون τ = 0."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "For a circular shaft τ = T r / J varies linearly from zero at the centre to the maximum at the surface.",
    "ar": "في العمود الدائري τ = T r / J يتغير خطياً من الصفر في المركز إلى أقصى قيمة عند السطح."
   }
  },
  {
   "id": "som-17",
   "subject": "som",
   "topic": "bending",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A simply supported beam of span 2 m has a rectangular section 50 mm wide and 100 mm deep (the 100 mm side vertical). A 10 kN load acts at mid-span. What is the maximum bending stress?",
    "ar": "عارضة بسيطة الإسناد باتساع 2 m مقطعها مستطيل عرضه 50 mm وعمقه 100 mm (الضلع 100 mm رأسي). يؤثر حمل 10 kN في منتصف الباع. ما أكبر إجهاد انحناء؟"
   },
   "opts": [
    {
     "en": "30 MPa",
     "ar": "30 MPa",
     "why": {
      "en": "M = P L / 8 (a uniformly distributed load) was used for a point load.",
      "ar": "استُعملت M = P L / 8 (حمل موزع) لحمل مركّز."
     }
    },
    {
     "en": "120 MPa",
     "ar": "120 MPa",
     "why": {
      "en": "M = P L / 2 was used; for a central point load M_max = P L / 4.",
      "ar": "استُعملت M = P L / 2؛ وللحمل المركزي M_max = P L / 4."
     }
    },
    {
     "en": "240 MPa",
     "ar": "240 MPa",
     "why": {
      "en": "M = P L (a cantilever-type moment) was used; for a simply supported beam with a central load M_max = P L / 4.",
      "ar": "استُعملت M = P L (عزم من نوع الكابولي)؛ وللعارضة البسيطة بحمل مركزي M_max = P L / 4."
     }
    },
    {
     "en": "60 MPa",
     "ar": "60 MPa",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "M_max = P L / 4 = 5.000e+06 N·mm;  S = b h² / 6 = 83,330 mm³;  σ = M / S = 60 MPa.",
    "ar": "M_max = P L / 4 = 5.000e+06 N·mm;  S = b h² / 6 = 83,330 mm³;  σ = M / S = 60 MPa."
   }
  },
  {
   "id": "som-18",
   "subject": "som",
   "topic": "bending",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "In a beam under pure bending, where is the bending (normal) stress zero and where is it largest?",
    "ar": "في عارضة معرَّضة لانحناء بحت، أين يكون إجهاد الانحناء (العمودي) صفراً وأين هو أكبر؟"
   },
   "opts": [
    {
     "en": "Constant over the whole depth",
     "ar": "ثابت على كامل العمق",
     "why": {
      "en": "The stress varies linearly with y.",
      "ar": "الإجهاد يتغير خطياً مع y."
     }
    },
    {
     "en": "Zero at the top fibre and largest at the bottom fibre in all cases",
     "ar": "صفر في الليف العلوي وأكبر في الليف السفلي دائماً",
     "why": {
      "en": "For a symmetric section both outer fibres have equal magnitude (one in tension, one in compression).",
      "ar": "في المقطع المتماثل تتساوى قيمتا الليفين الخارجيين (أحدهما شد والآخر ضغط)."
     }
    },
    {
     "en": "Largest on the neutral axis; zero at the outer fibres",
     "ar": "أكبر على المحور المحايد؛ وصفر عند الألياف الخارجية",
     "why": {
      "en": "It is the other way round: σ = M y / I grows with the distance y from the neutral axis.",
      "ar": "العكس هو الصحيح: σ = M y / I يزداد مع البعد y عن المحور المحايد."
     }
    },
    {
     "en": "Zero on the neutral axis; largest at the outer fibres (top and bottom)",
     "ar": "صفر على المحور المحايد؛ وأكبر عند الألياف الخارجية (العليا والسفلى)",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "σ = M y / I: linear in y, zero at y = 0 (neutral axis), maximum magnitude at y = c, the farthest fibre.",
    "ar": "σ = M y / I: خطي مع y، وصفر عند y = 0 (المحور المحايد)، وأكبر مقدار عند y = c أبعد ليف."
   }
  },
  {
   "id": "som-19",
   "subject": "som",
   "topic": "bending",
   "level": 2,
   "type": "applied",
   "q": {
    "en": "Looking for the position of the largest bending moment in a beam, which relation is useful?",
    "ar": "للعثور على موضع أكبر عزم انحناء في عارضة، أي علاقة مفيدة؟"
   },
   "opts": [
    {
     "en": "The bending moment is largest where the deflection is zero",
     "ar": "العزم أكبر حيث يكون التدلي صفراً",
     "why": {
      "en": "For a simply supported beam the deflection is zero at the supports, where M is zero.",
      "ar": "في العارضة البسيطة التدلي صفر عند المسندين حيث M صفر."
     }
    },
    {
     "en": "The bending moment is largest where the load intensity is largest",
     "ar": "يكون العزم أكبر حيث شدة الحمل أكبر",
     "why": {
      "en": "The load intensity w is related to V (dV/dx = −w), not directly to the largest M.",
      "ar": "شدة الحمل w ترتبط بـV (dV/dx = −w) لا بأكبر M مباشرة."
     }
    },
    {
     "en": "dM/dx = V: the bending moment has a maximum or minimum where the shear force is zero (or changes sign)",
     "ar": "dM/dx = V: للعزم قيمة عظمى أو صغرى حيث تنعدم قوة القص (أو تغيّر إشارتها)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "The bending moment is always largest at the supports",
     "ar": "العزم دائماً أكبر عند المساند",
     "why": {
      "en": "A simply supported beam has zero moment at its end supports.",
      "ar": "العارضة البسيطة عزمها صفر عند مسنديها الطرفيين."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "Since V = dM/dx, M reaches an extreme value where V = 0 (or jumps through zero). Draw the shear diagram first, then locate M_max.",
    "ar": "بما أن V = dM/dx يبلغ M قيمة قصوى حيث V = 0 (أو يعبر الصفر). ارسم مخطط القص أولاً ثم حدد موضع M_max."
   }
  },
  {
   "id": "som-20",
   "subject": "som",
   "topic": "torsion",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "For the same torque and material, the diameter of a solid shaft is doubled. The maximum shear stress becomes…",
    "ar": "لعزم ومادة ثابتين تُضاعَف قطر عمود مصمت. يصبح أكبر إجهاد قص…"
   },
   "opts": [
    {
     "en": "one sixteenth",
     "ar": "جزءاً من ستة عشر",
     "why": {
      "en": "That is the dependence of the angle of twist (θ ∝ 1 / d⁴), not of the stress.",
      "ar": "هذه علاقة زاوية اللي (θ ∝ 1 / d⁴) لا الإجهاد."
     }
    },
    {
     "en": "one half",
     "ar": "النصف",
     "why": {
      "en": "That would be the case if τ were proportional to 1 / d, but it goes as 1 / d³.",
      "ar": "هذا إن كان τ يتناسب مع 1 / d لكنه يتناسب مع 1 / d³."
     }
    },
    {
     "en": "one eighth (τ = 16 T / (π d³) is proportional to 1 / d³)",
     "ar": "ثُمناً (τ = 16 T / (π d³) تتناسب مع 1 / d³)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "one quarter",
     "ar": "الربع",
     "why": {
      "en": "That would be the case for 1 / d², which is the area effect only.",
      "ar": "هذا لـ1 / d² وهو أثر المساحة فقط."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "τ ∝ 1 / d³ so doubling d divides τ by 2³ = 8. (The twist angle θ ∝ 1 / d⁴ falls by 16.)",
    "ar": "τ ∝ 1 / d³ فمضاعفة d تقسم τ على 2³ = 8. (أما زاوية اللي θ ∝ 1 / d⁴ فتقل 16 مرة.)"
   }
  },
  {
   "id": "som-21",
   "subject": "som",
   "topic": "thermal",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "A steel bar (E = 200 GPa, α = 12×10⁻⁶ /K) is held between two rigid walls so that it cannot expand. It is heated by 50 K. What is the thermal stress?",
    "ar": "قضيب فولاذي (E = 200 GPa وα = 12×10⁻⁶ /K) مثبّت بين جدارين صلبين فلا يستطيع التمدد. سُخّن بمقدار 50 K. ما الإجهاد الحراري؟"
   },
   "opts": [
    {
     "en": "120 MPa (compression)",
     "ar": "120 MPa (ضغط)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "120 MPa (tension)",
     "ar": "120 MPa (شد)",
     "why": {
      "en": "Heating a constrained bar tries to lengthen it; the walls push back, so the stress is compressive.",
      "ar": "تسخين القضيب المقيّد يحاول إطالته فتدفعه الجدران فيكون الإجهاد ضغطاً."
     }
    },
    {
     "en": "60 MPa",
     "ar": "60 MPa",
     "why": {
      "en": "The stress was halved without reason; the walls are rigid so the whole expansion is prevented.",
      "ar": "نُصّف الإجهاد دون سبب؛ الجدران صلبة فيُمنع التمدد كله."
     }
    },
    {
     "en": "1,200 MPa",
     "ar": "1,200 MPa",
     "why": {
      "en": "A power-of-ten slip (E taken as 2000 GPa or α ten times too large).",
      "ar": "خطأ في قوة العشرة (E مأخوذ 2000 GPa أو α أكبر 10 مرات)."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Free expansion would be ε = α ΔT = 6.000e-04. The walls prevent it, so |σ| = E α ΔT = 200,000 × 6.000e-04 = 120 MPa, compressive (valid while σ stays below yield).",
    "ar": "التمدد الحر يعطي ε = α ΔT = 6.000e-04. تمنعه الجدران فيكون |σ| = E α ΔT = 200,000 × 6.000e-04 = 120 MPa ضغطاً (صالح ما دام σ دون الخضوع)."
   }
  },
  {
   "id": "som-22",
   "subject": "som",
   "topic": "axial",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "A stepped steel bar (E = 200 GPa) carries an axial load of 20 kN. Segment 1: A = 400 mm², L = 500 mm. Segment 2: A = 200 mm², L = 300 mm. What is the total elongation?",
    "ar": "قضيب فولاذي مدرَّج (E = 200 GPa) يحمل حملاً محورياً 20 kN. المقطع 1: A = 400 mm² وL = 500 mm. المقطع 2: A = 200 mm² وL = 300 mm. ما الاستطالة الكلية؟"
   },
   "opts": [
    {
     "en": "0.275 mm",
     "ar": "0.275 mm",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "0.4 mm",
     "ar": "0.4 mm",
     "why": {
      "en": "The smaller area was used for both segments.",
      "ar": "استُعملت المساحة الأصغر للمقطعين."
     }
    },
    {
     "en": "0.2 mm",
     "ar": "0.2 mm",
     "why": {
      "en": "The larger area was used for both segments.",
      "ar": "استُعملت المساحة الأكبر للمقطعين."
     }
    },
    {
     "en": "0.2667 mm",
     "ar": "0.2667 mm",
     "why": {
      "en": "An average area was used for the whole length. The elongation of each segment must be computed with its own area and added.",
      "ar": "استُعملت مساحة متوسطة لكامل الطول. يجب حساب استطالة كل مقطع بمساحته ثم الجمع."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "The internal force is 20 kN in both segments. δ = Σ P L / (A E) = (20 000 / 200 000)(500/400 + 300/200) = 0.1 × (1.25 + 1.5) = 0.275 mm.",
    "ar": "القوة الداخلية 20 kN في المقطعين. δ = Σ P L / (A E) = (20 000 / 200 000)(500/400 + 300/200) = 0.1 × (1.25 + 1.5) = 0.275 mm."
   }
  },
  {
   "id": "som-23",
   "subject": "som",
   "topic": "torsion",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "A solid steel shaft (G = 80 GPa), diameter 50 mm and length 1.5 m, carries a torque of 1.0 kN·m. What is the angle of twist?",
    "ar": "عمود فولاذي مصمت (G = 80 GPa) قطره 50 mm وطوله 1.5 m ينقل عزماً 1.0 kN·m. ما زاوية اللي؟"
   },
   "opts": [
    {
     "en": "0.03056°",
     "ar": "0.03056°",
     "why": {
      "en": "The answer in radians was labelled as degrees.",
      "ar": "وُضعت الإجابة بالراديان على أنها بالدرجات."
     }
    },
    {
     "en": "1.751° (0.03056 rad)",
     "ar": "1.751° (0.03056 rad)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "0.001751°",
     "ar": "0.001751°",
     "why": {
      "en": "G was left in GPa while the other quantities are in N and mm (a unit slip).",
      "ar": "ترك G بـGPa بينما بقية الكميات بـN وmm (خطأ وحدات)."
     }
    },
    {
     "en": "3.502°",
     "ar": "3.502°",
     "why": {
      "en": "J = π d⁴ / 64 (the area moment of inertia I) was used instead of the polar moment J = π d⁴ / 32.",
      "ar": "استُعملت J = π d⁴ / 64 (عزم القصور المساحي I) بدل عزم القصور القطبي J = π d⁴ / 32."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "J = π d⁴ / 32 = 613,600 mm⁴;  θ = T L / (G J) = 1.000e+06 × 1500 / (80,000 × 613,600) = 0.03056 rad = 1.751°.",
    "ar": "J = π d⁴ / 32 = 613,600 mm⁴;  θ = T L / (G J) = 1.000e+06 × 1500 / (80,000 × 613,600) = 0.03056 rad = 1.751°."
   }
  },
  {
   "id": "som-24",
   "subject": "som",
   "topic": "torsion",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "A shaft transmits 15 kW at 1200 rpm. The allowable shear stress is 40 MPa (pure torsion, solid round shaft). What is the minimum diameter?",
    "ar": "عمود ينقل 15 kW بسرعة 1200 rpm. إجهاد القص المسموح 40 MPa (التواء بحت، عمود دائري مصمت). ما أصغر قطر؟"
   },
   "opts": [
    {
     "en": "11.68 mm",
     "ar": "11.68 mm",
     "why": {
      "en": "The speed in rpm was used directly as if it were rad/s: T = P / n. It must be converted with ω = 2π n / 60.",
      "ar": "استُعملت السرعة بـrpm كما لو كانت rad/s: T = P / n. يجب تحويلها بـω = 2π n / 60."
     }
    },
    {
     "en": "31.21 mm",
     "ar": "31.21 mm",
     "why": {
      "en": "The factor 32 was used instead of 16 (J / c = π d³ / 16 for the shear stress).",
      "ar": "استُعمل العامل 32 بدل 16 (J / c = π d³ / 16 لإجهاد القص)."
     }
    },
    {
     "en": "24.77 mm",
     "ar": "24.77 mm",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "2.477 mm",
     "ar": "2.477 mm",
     "why": {
      "en": "The torque was used in N·m while the stress is in N/mm²; it must be in N·mm.",
      "ar": "استُعمل العزم بـN·m بينما الإجهاد بـN/mm²؛ يجب أن يكون بـN·mm."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "ω = 2π × 1200 / 60 = 125.7 rad/s;  T = P / ω = 15000 / 125.7 = 119.4 N·m;  d = (16 T / (π τ))^(1/3) = (16 × 119,400 / (π × 40))^(1/3) = 24.77 mm. Round up to the next available size.",
    "ar": "ω = 2π × 1200 / 60 = 125.7 rad/s;  T = P / ω = 15000 / 125.7 = 119.4 N·m;  d = (16 T / (π τ))^(1/3) = (16 × 119,400 / (π × 40))^(1/3) = 24.77 mm. قرّب إلى أقرب مقاس متاح أكبر."
   }
  },
  {
   "id": "som-25",
   "subject": "som",
   "topic": "combined",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "At a point in a plate (plane stress): σx = 80 MPa, σy = -40 MPa and τxy = 30 MPa. What is the maximum principal stress σ₁?",
    "ar": "عند نقطة في صفيحة (إجهاد مستوٍ): σx = 80 MPa وσy = -40 MPa وτxy = 30 MPa. ما الإجهاد الرئيسي الأكبر σ₁؟"
   },
   "opts": [
    {
     "en": "80 MPa",
     "ar": "80 MPa",
     "why": {
      "en": "σx is a normal stress on a particular plane, not the maximum over all planes (the shear stress raises the maximum).",
      "ar": "σx إجهاد عمودي على مستوى معين وليس الأكبر على كل المستويات (إجهاد القص يرفع الأكبر)."
     }
    },
    {
     "en": "67.08 MPa",
     "ar": "67.08 MPa",
     "why": {
      "en": "This is the radius of Mohr’s circle (the maximum shear stress); σ₁ = centre + radius.",
      "ar": "هذا نصف قطر دائرة مور (أكبر إجهاد قص)؛ وσ₁ = المركز + نصف القطر."
     }
    },
    {
     "en": "-47.08 MPa",
     "ar": "-47.08 MPa",
     "why": {
      "en": "This is the minimum principal stress σ₂ (centre − radius), not σ₁.",
      "ar": "هذا الإجهاد الرئيسي الأصغر σ₂ (المركز − نصف القطر) وليس σ₁."
     }
    },
    {
     "en": "87.08 MPa",
     "ar": "87.08 MPa",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "σ₁,₂ = (σx + σy)/2 ± √[((σx − σy)/2)² + τxy²] = 20 ± √(60² + 30²) = 20 ± 67.08;  σ₁ = 87.08 MPa, σ₂ = -47.08 MPa.",
    "ar": "σ₁,₂ = (σx + σy)/2 ± √[((σx − σy)/2)² + τxy²] = 20 ± √(60² + 30²) = 20 ± 67.08;  σ₁ = 87.08 MPa, σ₂ = -47.08 MPa."
   }
  },
  {
   "id": "som-26",
   "subject": "som",
   "topic": "combined",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "A ductile part (yield strength 300 MPa) has a state of stress σx = 100 MPa, σy = 0 and τxy = 50 MPa. What is the factor of safety against yielding by the von Mises criterion?",
    "ar": "قطعة من مادة مطيلة (إجهاد الخضوع 300 MPa) حالة إجهادها σx = 100 MPa وσy = 0 وτxy = 50 MPa. ما معامل الأمان ضد الخضوع بمعيار فون ميزس؟"
   },
   "opts": [
    {
     "en": "2.485",
     "ar": "2.485",
     "why": {
      "en": "The maximum principal stress was compared with the yield strength (maximum normal stress criterion), which is not suitable for ductile yielding.",
      "ar": "قورن الإجهاد الرئيسي الأكبر بإجهاد الخضوع (معيار أقصى إجهاد عمودي) وهو غير مناسب لخضوع المواد المطيلة."
     }
    },
    {
     "en": "2.121",
     "ar": "2.121",
     "why": {
      "en": "This is the Tresca (maximum shear) factor; it is a different, slightly more conservative criterion, not von Mises.",
      "ar": "هذا معامل تريسكا (أقصى قص)؛ وهو معيار آخر أكثر تحفظاً قليلاً وليس فون ميزس."
     }
    },
    {
     "en": "2.268",
     "ar": "2.268",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "3",
     "ar": "3",
     "why": {
      "en": "The shear stress was ignored; only σx was used.",
      "ar": "أُهمل إجهاد القص واستُعمل σx وحده."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "σ′ = √(σx² − σxσy + σy² + 3τxy²) = √(100² + 3 × 50²) = 132.3 MPa;  n = σ_y / σ′ = 300 / 132.3 = 2.268. (Tresca would give 2.121.)",
    "ar": "σ′ = √(σx² − σxσy + σy² + 3τxy²) = √(100² + 3 × 50²) = 132.3 MPa;  n = σ_y / σ′ = 300 / 132.3 = 2.268. (ويعطي تريسكا 2.121.)"
   }
  },
  {
   "id": "som-27",
   "subject": "som",
   "topic": "columns",
   "level": 3,
   "type": "concept",
   "q": {
    "en": "A slender column fails by elastic buckling (Euler). If its length is doubled (same section, material and end conditions), its critical load becomes…",
    "ar": "عمود نحيف ينهار بالانبعاج المرن (أويلر). إذا تضاعف طوله (المقطع والمادة وشروط الطرفين نفسها) يصبح حمله الحرج…"
   },
   "opts": [
    {
     "en": "one quarter (P_cr = π² E I / (K L)² is proportional to 1 / L²)",
     "ar": "الربع (P_cr = π² E I / (K L)² تتناسب مع 1 / L²)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "one half",
     "ar": "النصف",
     "why": {
      "en": "P_cr depends on 1 / L², not 1 / L.",
      "ar": "P_cr تتناسب مع 1 / L² لا 1 / L."
     }
    },
    {
     "en": "one eighth",
     "ar": "الثمن",
     "why": {
      "en": "That would need a 1 / L³ dependence.",
      "ar": "هذا يحتاج اعتماداً على 1 / L³."
     }
    },
    {
     "en": "unchanged, because buckling depends only on the material strength",
     "ar": "لا يتغير لأن الانبعاج يتوقف على مقاومة المادة فقط",
     "why": {
      "en": "Euler buckling depends on stiffness E I and length, not on strength.",
      "ar": "انبعاج أويلر يتوقف على الصلابة E I والطول لا على المقاومة."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Euler: P_cr = π² E I / (K L)². Doubling L multiplies the denominator by 4, so P_cr falls to 1/4. It is valid for slender columns only (high slenderness ratio).",
    "ar": "أويلر: P_cr = π² E I / (K L)². مضاعفة L تضرب المقام في 4 فيصبح P_cr الربع. وهو صالح للأعمدة النحيفة فقط (نسبة نحافة كبيرة)."
   }
  },
  {
   "id": "som-28",
   "subject": "som",
   "topic": "vessels",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "A thin-walled cylindrical vessel has an inside diameter of 600 mm, wall thickness 6 mm and an internal pressure of 2 MPa. What is the hoop (circumferential) stress?",
    "ar": "وعاء أسطواني رقيق الجدار قطره الداخلي 600 mm وسماكة جداره 6 mm وضغطه الداخلي 2 MPa. ما الإجهاد الحلقي (المحيطي)؟"
   },
   "opts": [
    {
     "en": "100 MPa",
     "ar": "100 MPa",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "200 MPa",
     "ar": "200 MPa",
     "why": {
      "en": "The factor 2 was left out of the denominator (p D / t).",
      "ar": "سقط العامل 2 من المقام (p D / t)."
     }
    },
    {
     "en": "50 MPa",
     "ar": "50 MPa",
     "why": {
      "en": "This is the longitudinal (axial) stress p D / (4 t), half of the hoop stress.",
      "ar": "هذا هو الإجهاد الطولي p D / (4 t) وهو نصف الحلقي."
     }
    },
    {
     "en": "2 MPa",
     "ar": "2 MPa",
     "why": {
      "en": "The wall stress is not equal to the pressure; it is multiplied by the ratio D / (2 t).",
      "ar": "إجهاد الجدار لا يساوي الضغط؛ بل يُضرب في النسبة D / (2 t)."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "σ_hoop = p D / (2 t) = 2 × 600 / (2 × 6) = 100 MPa;  σ_long = p D / (4 t) = 50 MPa. (Thin-wall theory: D / t large, about 10 or more.)",
    "ar": "σ_hoop = p D / (2 t) = 2 × 600 / (2 × 6) = 100 MPa؛ σ_long = p D / (4 t) = 50 MPa. (نظرية الجدار الرقيق: D / t كبيرة، نحو 10 فأكثر.)"
   }
  },
  {
   "id": "som-29",
   "subject": "som",
   "topic": "torsion",
   "level": 3,
   "type": "multi",
   "q": {
    "en": "Multi-step problem. A solid steel shaft of diameter 30 mm transmits 20 kW at 1500 rpm. The yield strength in tension is 250 MPa; use the maximum-shear (Tresca) estimate τ_y = σ_y / 2. Answer the three steps (partial credit is given).",
    "ar": "مسألة متعددة الخطوات. عمود فولاذي مصمت قطره 30 mm ينقل 20 kW بسرعة 1500 rpm. إجهاد الخضوع في الشد 250 MPa؛ استعمل تقدير أقصى قص (تريسكا) τ_y = σ_y / 2. أجب عن الخطوات الثلاث (يُمنح تقدير جزئي)."
   },
   "steps": [
    {
     "id": "a",
     "q": {
      "en": "Step 1: What torque does the shaft carry?",
      "ar": "الخطوة 1: ما العزم الذي ينقله العمود؟"
     },
     "opts": [
      {
       "en": "13.33 N·m",
       "ar": "13.33 N·m",
       "why": {
        "en": "rpm was used as if it were rad/s.",
        "ar": "استُعملت rpm كأنها rad/s."
       }
      },
      {
       "en": "127.3 N·m",
       "ar": "127.3 N·m",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "0.1273 N·m",
       "ar": "0.1273 N·m",
       "why": {
        "en": "The power was left in kW (a factor 1000 is missing).",
        "ar": "تُركت القدرة بـkW (ينقص عامل 1000)."
       }
      },
      {
       "en": "800 N·m",
       "ar": "800 N·m",
       "why": {
        "en": "ω was multiplied instead of dividing the power by it.",
        "ar": "ضُربت ω بدل أن تُقسم القدرة عليها."
       }
      }
     ],
     "ans": 1,
     "exp": {
      "en": "ω = 2π × 1500 / 60 = 157.1 rad/s;  T = P / ω = 20000 / 157.1 = 127.3 N·m.",
      "ar": "ω = 2π × 1500 / 60 = 157.1 rad/s؛ T = P / ω = 20000 / 157.1 = 127.3 N·m."
     }
    },
    {
     "id": "b",
     "q": {
      "en": "Step 2: What is the maximum shear stress in the shaft (use your correct torque)?",
      "ar": "الخطوة 2: ما أكبر إجهاد قص في العمود (استعمل العزم الصحيح)؟"
     },
     "opts": [
      {
       "en": "0.02402 MPa",
       "ar": "0.02402 MPa",
       "why": {
        "en": "The torque was left in N·m instead of N·mm.",
        "ar": "تُرك العزم بـN·m بدل N·mm."
       }
      },
      {
       "en": "24.02 MPa",
       "ar": "24.02 MPa",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "48.03 MPa",
       "ar": "48.03 MPa",
       "why": {
        "en": "The factor 32 was used instead of 16.",
        "ar": "استُعمل العامل 32 بدل 16."
       }
      },
      {
       "en": "1.501 MPa",
       "ar": "1.501 MPa",
       "why": {
        "en": "The factor 16 was omitted.",
        "ar": "أُهمل العامل 16."
       }
      }
     ],
     "ans": 1,
     "exp": {
      "en": "τ = 16 T / (π d³) = 16 × 127,300 / (π × 27000) = 24.02 MPa.",
      "ar": "τ = 16 T / (π d³) = 16 × 127,300 / (π × 27000) = 24.02 MPa."
     }
    },
    {
     "id": "c",
     "q": {
      "en": "Step 3: What is the factor of safety against yielding (τ_y = 125 MPa)?",
      "ar": "الخطوة 3: ما معامل الأمان ضد الخضوع (τ_y = 125 MPa)؟"
     },
     "opts": [
      {
       "en": "10.41",
       "ar": "10.41",
       "why": {
        "en": "σ_y was compared with the shear stress; the shear yield strength τ_y = σ_y / 2 must be used.",
        "ar": "قورن σ_y بإجهاد القص؛ يجب استعمال إجهاد خضوع القص τ_y = σ_y / 2."
       }
      },
      {
       "en": "5.205",
       "ar": "5.205",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "0.1921",
       "ar": "0.1921",
       "why": {
        "en": "The ratio was inverted (stress / strength).",
        "ar": "قُلبت النسبة (الإجهاد / المقاومة)."
       }
      },
      {
       "en": "2.602",
       "ar": "2.602",
       "why": {
        "en": "A factor 2 error in the shear stress (32 instead of 16) carried over from step 2.",
        "ar": "خطأ بعامل 2 في إجهاد القص (32 بدل 16) انتقل من الخطوة 2."
       }
      }
     ],
     "ans": 1,
     "exp": {
      "en": "n = τ_y / τ = 125 / 24.02 = 5.205.",
      "ar": "n = τ_y / τ = 125 / 24.02 = 5.205."
     }
    }
   ],
   "exp": {
    "en": "The torque follows from P = T ω, the maximum shear stress from τ = 16 T / (π d³), and the safety factor from the shear yield strength.",
    "ar": "يأتي العزم من P = T ω، وأكبر إجهاد قص من τ = 16 T / (π d³)، ومعامل الأمان من إجهاد خضوع القص."
   }
  },
  {
   "id": "som-30",
   "subject": "som",
   "topic": "bending",
   "level": 3,
   "type": "multi",
   "q": {
    "en": "Multi-step problem. A cantilever of length 1000 mm carries a 2.0 kN load at its free end. Its section is rectangular, 40 mm wide and 80 mm deep (vertical), E = 200 GPa. Answer the three steps (partial credit is given).",
    "ar": "مسألة متعددة الخطوات. كابولي طوله 1000 mm يحمل حملاً 2.0 kN عند طرفه الحر. مقطعه مستطيل عرضه 40 mm وعمقه 80 mm (رأسي) وE = 200 GPa. أجب عن الخطوات الثلاث (يُمنح تقدير جزئي)."
   },
   "steps": [
    {
     "id": "a",
     "q": {
      "en": "Step 1: What is the maximum bending moment (at the fixed end)?",
      "ar": "الخطوة 1: ما أكبر عزم انحناء (عند الطرف المثبّت)؟"
     },
     "opts": [
      {
       "en": "1 kN·m",
       "ar": "1 kN·m",
       "why": {
        "en": "P L / 2 is the moment for a simply supported beam variant, not the cantilever end load.",
        "ar": "P L / 2 ليست عزم الكابولي بحمل طرفي."
       }
      },
      {
       "en": "2 kN·m",
       "ar": "2 kN·m",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "0.5 kN·m",
       "ar": "0.5 kN·m",
       "why": {
        "en": "P L / 4 is for a simply supported beam with a central load.",
        "ar": "P L / 4 لعارضة بسيطة بحمل مركزي."
       }
      },
      {
       "en": "4 kN·m",
       "ar": "4 kN·m",
       "why": {
        "en": "The load was counted twice (e.g. adding both reactions), doubling the moment.",
        "ar": "حُسب الحمل مرتين (كجمع ردّي الفعل) فتضاعف العزم."
       }
      }
     ],
     "ans": 1,
     "exp": {
      "en": "M_max = P × L = 2000 N × 1000 mm = 2.000e+06 N·mm = 2 kN·m.",
      "ar": "M_max = P × L = 2000 N × 1000 mm = 2.000e+06 N·mm = 2 kN·m."
     }
    },
    {
     "id": "b",
     "q": {
      "en": "Step 2: What is the maximum bending stress?",
      "ar": "الخطوة 2: ما أكبر إجهاد انحناء؟"
     },
     "opts": [
      {
       "en": "23.44 MPa",
       "ar": "23.44 MPa",
       "why": {
        "en": "The factor 6 in S = b h² / 6 was replaced by 12.",
        "ar": "استُبدل العامل 6 في S = b h² / 6 بالعامل 12."
       }
      },
      {
       "en": "46.88 MPa",
       "ar": "46.88 MPa",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "4.688 MPa",
       "ar": "4.688 MPa",
       "why": {
        "en": "A power-of-ten slip in the unit conversion (kN·m to N·mm).",
        "ar": "خطأ بقوة العشرة في تحويل الوحدات (kN·m إلى N·mm)."
       }
      },
      {
       "en": "93.75 MPa",
       "ar": "93.75 MPa",
       "why": {
        "en": "The section was turned on its side (S = h b² / 6).",
        "ar": "قُلب المقطع (S = h b² / 6)."
       }
      }
     ],
     "ans": 1,
     "exp": {
      "en": "S = b h² / 6 = 40 × 80² / 6 = 42,670 mm³;  σ = M / S = 2.000e+06 / 42,670 = 46.88 MPa.",
      "ar": "S = b h² / 6 = 40 × 80² / 6 = 42,670 mm³؛ σ = M / S = 2.000e+06 / 42,670 = 46.88 MPa."
     }
    },
    {
     "id": "c",
     "q": {
      "en": "Step 3: What is the tip deflection δ = P L³ / (3 E I)?",
      "ar": "الخطوة 3: ما تدلي الطرف الحر δ = P L³ / (3 E I)؟"
     },
     "opts": [
      {
       "en": "0.001953 mm",
       "ar": "0.001953 mm",
       "why": {
        "en": "The length was used in metres while the rest is in N and mm.",
        "ar": "استُعمل الطول بالمتر بينما البقية بـN وmm."
       }
      },
      {
       "en": "1.953 mm",
       "ar": "1.953 mm",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "5.859 mm",
       "ar": "5.859 mm",
       "why": {
        "en": "The factor 3 in the denominator was left out (P L³ / (E I)).",
        "ar": "سقط العامل 3 من المقام (P L³ / (E I))."
       }
      },
      {
       "en": "7.812 mm",
       "ar": "7.812 mm",
       "why": {
        "en": "I was taken about the wrong axis (h b³ / 12); bending is in the vertical plane so I = b h³ / 12.",
        "ar": "أُخذت I حول المحور الخطأ (h b³ / 12)؛ والانحناء في المستوى الرأسي فتكون I = b h³ / 12."
       }
      }
     ],
     "ans": 1,
     "exp": {
      "en": "I = b h³ / 12 = 1.707e+06 mm⁴;  δ = P L³ / (3 E I) = 2000 × 1000³ / (3 × 200,000 × 1.707e+06) = 1.953 mm.",
      "ar": "I = b h³ / 12 = 1.707e+06 mm⁴؛ δ = P L³ / (3 E I) = 2000 × 1000³ / (3 × 200,000 × 1.707e+06) = 1.953 mm."
     }
    }
   ],
   "exp": {
    "en": "M_max = P L at the wall, σ = M / S with S = b h² / 6, and the tip deflection of an end-loaded cantilever is δ = P L³ / (3 E I).",
    "ar": "M_max = P L عند الجدار، وσ = M / S مع S = b h² / 6، وتدلي طرف الكابولي بحمل طرفي δ = P L³ / (3 E I)."
   }
  }
 ]
};
})();
