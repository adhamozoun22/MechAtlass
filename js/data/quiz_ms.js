/* MechAtlas — Materials Science and Metallurgy question bank. Standalone data file; loaded by index.html. */
(function () {
    window.MECHATLAS_QUIZ_BANKS = window.MECHATLAS_QUIZ_BANKS || {};
    window.MECHATLAS_QUIZ_BANKS.ms = {
 "id": "ms",
 "title": {
  "en": "Materials Science and Metallurgy",
  "ar": "علم المواد والمعادن"
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
  "crystal": {
   "en": "Crystal structures",
   "ar": "التراكيب البلورية"
  },
  "defects": {
   "en": "Imperfections and dislocations",
   "ar": "العيوب البلورية والانخلاعات"
  },
  "strength": {
   "en": "Strengthening mechanisms",
   "ar": "آليات التقوية"
  },
  "fec": {
   "en": "Fe-C diagram and lever rule",
   "ar": "مخطط Fe-C وقاعدة الرافعة"
  },
  "class": {
   "en": "Steels and cast irons",
   "ar": "الفولاذ والحديد الزهر"
  },
  "alloy": {
   "en": "Alloy and stainless steels",
   "ar": "الفولاذ السبائكي وغير القابل للصدأ"
  },
  "nonfer": {
   "en": "Non-ferrous metals",
   "ar": "المعادن اللاحديدية"
  },
  "poly": {
   "en": "Polymers, ceramics and composites",
   "ar": "البوليمرات والسيراميك والمواد المركّبة"
  },
  "corr": {
   "en": "Corrosion",
   "ar": "التآكل (الصدأ)"
  },
  "mech": {
   "en": "Mechanical properties",
   "ar": "الخواص الميكانيكية"
  },
  "solid": {
   "en": "Solidification and grain size",
   "ar": "التصلب وحجم الحبيبات"
  }
 },
 "questions": [
  {
   "id": "ms-01",
   "subject": "ms",
   "topic": "crystal",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A BCC unit cell has 2 atoms and its cube edge is a = 4R/√3 (R = atomic radius). What is its atomic packing factor (APF)?",
    "ar": "خلية BCC فيها ذرتان وطول ضلع مكعبها a = 4R/√3 (R نصف قطر الذرة). ما معامل التعبئة الذري (APF)؟"
   },
   "opts": [
    {
     "en": "0.68",
     "ar": "0.68",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "1.05",
     "ar": "1.05",
     "why": {
      "en": "a = 2R was used, but in BCC the atoms touch along the body diagonal (√3 a = 4R), not along the edge; an APF above 1 is also impossible.",
      "ar": "استُعمل a = 2R، لكن في BCC تتلامس الذرات على القطر الداخلي (√3 a = 4R) لا على الحرف؛ كما أن APF لا يمكن أن يتجاوز 1."
     }
    },
    {
     "en": "0.74",
     "ar": "0.74",
     "why": {
      "en": "This is the APF of FCC (4 atoms, a = 2√2 R), not of BCC.",
      "ar": "هذه قيمة APF لبنية FCC (4 ذرات وa = 2√2 R) وليست لـBCC."
     }
    },
    {
     "en": "0.524",
     "ar": "0.524",
     "why": {
      "en": "This is the APF of simple cubic (1 atom, a = 2R); BCC has 2 atoms per cell.",
      "ar": "هذه قيمة APF للمكعب البسيط (ذرة واحدة وa = 2R)؛ أما BCC ففيها ذرتان في الخلية."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "APF = (atoms × atom volume) / cell volume = 2 × (4/3)πR³ / (4R/√3)³ = π√3/8 = 0.68: about 68% of the volume is filled.",
    "ar": "APF = (عدد الذرات × حجم الذرة) / حجم الخلية = 2 × (4/3)πR³ / (4R/√3)³ = π√3/8 = 0.68: نحو 68% من الحجم مشغول بالذرات."
   }
  },
  {
   "id": "ms-02",
   "subject": "ms",
   "topic": "crystal",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "How many atoms belong to one FCC unit cell (8 corner positions shared by 8 cells, 6 face-centre positions shared by 2 cells)?",
    "ar": "كم ذرة تخص خلية FCC واحدة (8 مواقع في الزوايا مشتركة بين 8 خلايا و6 مواقع في مراكز الأوجه مشتركة بين خليتين)؟"
   },
   "opts": [
    {
     "en": "8",
     "ar": "8",
     "why": {
      "en": "Only the corners were counted, as whole atoms; corners contribute 8 × 1/8 = 1 and faces add 6 × 1/2 = 3.",
      "ar": "عُدّت الزوايا فقط كذرات كاملة؛ الزوايا تساهم بـ 8 × 1/8 = 1 والأوجه تضيف 6 × 1/2 = 3."
     }
    },
    {
     "en": "4",
     "ar": "4",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "2",
     "ar": "2",
     "why": {
      "en": "That is the BCC count (8 × 1/8 + 1 centre atom); FCC has face-centre atoms instead of a body-centre atom.",
      "ar": "هذا عدد BCC (8 × 1/8 + ذرة مركزية)؛ أما FCC ففيها ذرات مراكز الأوجه بدل الذرة المركزية."
     }
    },
    {
     "en": "14",
     "ar": "14",
     "why": {
      "en": "All 14 lattice positions were counted as whole atoms; shared atoms count only as a fraction.",
      "ar": "عُدّت المواقع الأربعة عشر ذرات كاملة؛ والذرات المشتركة تُحسب بجزء منها فقط."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "Atoms per cell = 8 × 1/8 + 6 × 1/2 = 1 + 3 = 4.",
    "ar": "عدد الذرات في الخلية = 8 × 1/8 + 6 × 1/2 = 1 + 3 = 4."
   }
  },
  {
   "id": "ms-03",
   "subject": "ms",
   "topic": "crystal",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "What are the coordination numbers (number of nearest neighbours) of the BCC and FCC structures, respectively?",
    "ar": "ما عدد التناسق (عدد الجيران الأقرب) في البنيتين BCC وFCC على الترتيب؟"
   },
   "opts": [
    {
     "en": "12 and 8",
     "ar": "12 و8",
     "why": {
      "en": "The two were swapped: BCC (less densely packed) has 8, FCC has 12.",
      "ar": "تبادلت القيمتان: BCC (الأقل تراصّاً) لها 8 وFCC لها 12."
     }
    },
    {
     "en": "4 and 12",
     "ar": "4 و12",
     "why": {
      "en": "4 is the number of atoms per FCC cell, not a coordination number; BCC has 8 nearest neighbours.",
      "ar": "4 هو عدد الذرات في خلية FCC لا عدد التناسق؛ وفي BCC يوجد 8 جيران أقرب."
     }
    },
    {
     "en": "6 and 8",
     "ar": "6 و8",
     "why": {
      "en": "Those are the values for simple cubic (6) and BCC (8); FCC has 12.",
      "ar": "هاتان قيمتا المكعب البسيط (6) وBCC (8)؛ أما FCC فعدد تناسقها 12."
     }
    },
    {
     "en": "8 and 12",
     "ar": "8 و12",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "In BCC the centre atom touches the 8 corner atoms (CN = 8). In FCC each atom touches 12 neighbours (CN = 12), the same as in HCP; this is why FCC and HCP have the highest APF (0.74).",
    "ar": "في BCC تلامس الذرة المركزية 8 ذرات زاوية (CN = 8). وفي FCC تلامس كل ذرة 12 جاراً (CN = 12) وهو نفسه في HCP؛ لذلك تملك FCC وHCP أعلى APF (0.74)."
   }
  },
  {
   "id": "ms-04",
   "subject": "ms",
   "topic": "crystal",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "Copper is FCC with an atomic radius R = 0.128 nm. What is the cube edge (lattice parameter) a?",
    "ar": "النحاس FCC ونصف قطر ذرته R = 0.128 nm. ما طول ضلع المكعب (ثابت الشبكة) a؟"
   },
   "opts": [
    {
     "en": "0.512 nm",
     "ar": "0.512 nm",
     "why": {
      "en": "4R is the face-diagonal length, not the edge; the edge is the diagonal divided by √2.",
      "ar": "4R هو طول قطر الوجه لا الحرف؛ والحرف = القطر ÷ √2."
     }
    },
    {
     "en": "0.362 nm",
     "ar": "0.362 nm",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "0.296 nm",
     "ar": "0.296 nm",
     "why": {
      "en": "This is the BCC relation a = 4R/√3; in FCC the atoms touch along the face diagonal: √2 a = 4R.",
      "ar": "هذه علاقة BCC وهي a = 4R/√3؛ أما في FCC فتتلامس الذرات على قطر الوجه: √2 a = 4R."
     }
    },
    {
     "en": "0.256 nm",
     "ar": "0.256 nm",
     "why": {
      "en": "a = 2R holds only for simple cubic, where atoms touch along the edge.",
      "ar": "a = 2R تصح للمكعب البسيط فقط حيث تتلامس الذرات على الحرف."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "Along the face diagonal 3 atoms touch: √2 a = 4R, so a = 4R/√2 = 2√2 R = 0.362 nm.",
    "ar": "على قطر الوجه تتلامس ذرتان وتفصل بينهما ذرة: √2 a = 4R فيكون a = 4R/√2 = 2√2 R = 0.362 nm."
   }
  },
  {
   "id": "ms-05",
   "subject": "ms",
   "topic": "mech",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "In the linear elastic region a bar shows a tensile stress of 140 MPa at a strain of 0.002 (mm/mm). What is its Young's modulus?",
    "ar": "في المنطقة المرنة الخطية يُظهر قضيب إجهاد شدّ 140 MPa عند انفعال 0.002 (mm/mm). ما معامل يونغ له؟"
   },
   "opts": [
    {
     "en": "0.28 MPa",
     "ar": "0.28 MPa",
     "why": {
      "en": "Stress and strain were multiplied; E is their ratio E = σ/ε (and has stress units).",
      "ar": "ضُرب الإجهاد في الانفعال؛ بينما E هو نسبتهما E = σ/ε."
     }
    },
    {
     "en": "70 GPa",
     "ar": "70 GPa",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "0.7 GPa",
     "ar": "0.7 GPa",
     "why": {
      "en": "The strain 0.2% was used as the number 0.2; 0.2% means 0.002.",
      "ar": "استُعمل الانفعال 0.2% على أنه الرقم 0.2؛ والنسبة 0.2% تعني 0.002."
     }
    },
    {
     "en": "7 GPa",
     "ar": "7 GPa",
     "why": {
      "en": "The strain was misread as 0.02 (a decimal slip); 0.002 gives 70 GPa.",
      "ar": "قُرئ الانفعال 0.02 (خطأ في الفاصلة)؛ والقيمة 0.002 تعطي 70 GPa."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "E = σ / ε = 140 MPa / 0.002 = 70 000 MPa = 70 GPa (the order of magnitude of aluminium).",
    "ar": "E = σ / ε = 140 MPa / 0.002 = 70 000 MPa = 70 GPa (من رتبة معامل الألمنيوم)."
   }
  },
  {
   "id": "ms-06",
   "subject": "ms",
   "topic": "mech",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A tensile specimen with gauge length 50 mm is 61 mm long after fracture. What is the percent elongation (%EL)?",
    "ar": "عينة شدّ طول قياسها 50 mm صار طولها 61 mm بعد الكسر. ما نسبة الاستطالة %EL؟"
   },
   "opts": [
    {
     "en": "122 %",
     "ar": "122 %",
     "why": {
      "en": "This is the final-to-original length ratio; the extension (Lf − L0) must be divided by L0.",
      "ar": "هذه نسبة الطول النهائي إلى الأصلي؛ يجب قسمة الزيادة (Lf − L0) على L0."
     }
    },
    {
     "en": "11 %",
     "ar": "11 %",
     "why": {
      "en": "The extension in mm (11) was reported as a percentage without dividing by L0.",
      "ar": "الزيادة بالـmm (11) ذُكرت كنسبة دون القسمة على L0."
     }
    },
    {
     "en": "22 %",
     "ar": "22 %",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "18.03 %",
     "ar": "18.03 %",
     "why": {
      "en": "The extension was divided by the final length; %EL uses the ORIGINAL gauge length.",
      "ar": "قُسمت الزيادة على الطول النهائي؛ أما %EL فتستعمل طول القياس الأصلي."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "%EL = (Lf − L0)/L0 × 100 = (61 − 50)/50 × 100 = 22 %. A higher %EL means a more ductile material.",
    "ar": "%EL = (Lf − L0)/L0 × 100 = (61 − 50)/50 × 100 = 22 %. كلما زادت %EL كانت المادة أكثر مطيلية."
   }
  },
  {
   "id": "ms-07",
   "subject": "ms",
   "topic": "fec",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "A slowly cooled plain-carbon steel of eutectoid composition (about 0.76 wt% C) passes 727 °C. Which microconstituent forms from the austenite?",
    "ar": "فولاذ كربوني بسيط بتركيب أيوتكتويدي (نحو 0.76 wt% C) يُبرَّد ببطء فيعبر 727 °C. أي مكوّن بنيوي يتكوّن من الأوستنيت؟"
   },
   "opts": [
    {
     "en": "Pearlite (alternating plates of ferrite and cementite)",
     "ar": "البيرلايت (صفائح متناوبة من الفيريت والسمنتيت)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Pure cementite only",
     "ar": "سمنتيت نقي فقط",
     "why": {
      "en": "The eutectoid reaction γ → α + Fe3C gives BOTH ferrite and cementite together.",
      "ar": "التفاعل الأيوتكتويدي γ ← α + Fe3C يعطي الفيريت والسمنتيت معاً."
     }
    },
    {
     "en": "Martensite",
     "ar": "المارتنزيت",
     "why": {
      "en": "Martensite appears only on rapid quenching and is not an equilibrium phase of the diagram; slow cooling follows the diagram.",
      "ar": "المارتنزيت يظهر عند التبريد السريع فقط وليس طوراً اتزانياً في المخطط؛ والتبريد البطيء يتبع المخطط."
     }
    },
    {
     "en": "Ledeburite",
     "ar": "اللِّيديبوريت",
     "why": {
      "en": "Ledeburite is the EUTECTIC product (liquid → austenite + cementite at about 4.3 wt% C, 1147 °C), not the eutectoid one.",
      "ar": "الليديبوريت ناتج التفاعل الأيوتكتيكي (سائل ← أوستنيت + سمنتيت عند نحو 4.3 wt% C و1147 °C) وليس الأيوتكتويدي."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Eutectoid reaction: austenite → ferrite + cementite (Fe3C) at about 727 °C. The two-phase lamellar mixture is called pearlite.",
    "ar": "التفاعل الأيوتكتويدي: أوستنيت ← فيريت + سمنتيت (Fe3C) عند نحو 727 °C. والخليط الصفائحي ثنائي الطور يسمى البيرلايت."
   }
  },
  {
   "id": "ms-08",
   "subject": "ms",
   "topic": "class",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "Which carbon content approximately separates steels from cast irons? (Use the maximum solubility of carbon in austenite, 2.14 wt% C, as the dividing value.)",
    "ar": "أي محتوى كربون يفصل تقريباً بين الفولاذ والحديد الزهر؟ (اعتبر أقصى ذوبانية للكربون في الأوستنيت 2.14 wt% C هي القيمة الفاصلة.)"
   },
   "opts": [
    {
     "en": "About 2 wt% C (steel below, cast iron above)",
     "ar": "نحو 2 wt% C (الفولاذ أدنى منها والحديد الزهر أعلى)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "About 6.67 wt% C",
     "ar": "نحو 6.67 wt% C",
     "why": {
      "en": "This is the carbon content of cementite (Fe3C), the end of the diagram, not a classification limit.",
      "ar": "هذا محتوى الكربون في السمنتيت (Fe3C) أي نهاية المخطط وليس حداً للتصنيف."
     }
    },
    {
     "en": "About 4.3 wt% C",
     "ar": "نحو 4.3 wt% C",
     "why": {
      "en": "This is the eutectic composition; cast irons start well below it (about 2 wt% C).",
      "ar": "هذا تركيب النقطة الأيوتكتيكية؛ والحديد الزهر يبدأ قبلها بكثير (نحو 2 wt% C)."
     }
    },
    {
     "en": "About 0.022 wt% C",
     "ar": "نحو 0.022 wt% C",
     "why": {
      "en": "This is the maximum solubility of carbon in FERRITE, not the steel/cast-iron limit.",
      "ar": "هذه أقصى ذوبانية للكربون في الفيريت لا الحد الفاصل بين الفولاذ والحديد الزهر."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Steels contain up to about 2 wt% C (austenite can dissolve up to 2.14 wt% C at 1147 °C, so they can solidify fully to austenite); cast irons contain more, which gives eutectic ledeburite and brittle cementite.",
    "ar": "يحتوي الفولاذ حتى نحو 2 wt% C (يذيب الأوستنيت حتى 2.14 wt% C عند 1147 °C فيتصلب كلياً إلى أوستنيت)؛ أما الحديد الزهر فكربونه أعلى فيتكوّن الليديبوريت الأيوتكتيكي والسمنتيت الهش."
   }
  },
  {
   "id": "ms-09",
   "subject": "ms",
   "topic": "nonfer",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "Why does aluminium resist atmospheric corrosion although it is a chemically reactive metal?",
    "ar": "لماذا يقاوم الألمنيوم التآكل الجوي رغم أنه فلز نشِط كيميائياً؟"
   },
   "opts": [
    {
     "en": "Its high carbon content makes a protective carbide layer",
     "ar": "محتواه العالي من الكربون يكوّن طبقة كربيد واقية",
     "why": {
      "en": "Aluminium is not a carbon-based alloy; carbon plays no role in its corrosion resistance.",
      "ar": "الألمنيوم ليس سبيكة كربونية؛ والكربون لا دور له في مقاومته للتآكل."
     }
    },
    {
     "en": "It always contains a thick zinc coating",
     "ar": "يحتوي دائماً على طلاء زنك سميك",
     "why": {
      "en": "Aluminium is not normally zinc coated; its protective film is its own oxide.",
      "ar": "الألمنيوم لا يُطلى بالزنك عادة؛ وطبقته الواقية هي أكسيده الخاص."
     }
    },
    {
     "en": "Aluminium is a noble metal that does not react with oxygen",
     "ar": "الألمنيوم فلز نبيل لا يتفاعل مع الأكسجين",
     "why": {
      "en": "Aluminium is highly reactive; it reacts with oxygen instantly. Its protection comes from the oxide it forms.",
      "ar": "الألمنيوم شديد النشاط ويتفاعل مع الأكسجين فوراً؛ وحمايته من الأكسيد الذي يكوّنه."
     }
    },
    {
     "en": "It forms a thin, adherent, self-repairing oxide (Al2O3) film that passivates the surface",
     "ar": "يكوّن طبقة أكسيد رقيقة ملتصقة ذاتية الإصلاح (Al2O3) تُخمِّل السطح",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Aluminium oxidises immediately in air; the resulting thin Al2O3 film is dense and adherent and re-forms if scratched, which blocks further attack (passivation).",
    "ar": "يتأكسد الألمنيوم فوراً في الهواء؛ وطبقة Al2O3 الرقيقة الناتجة كثيفة وملتصقة وتتجدد إذا خُدشت فتمنع استمرار التآكل (التخميل)."
   }
  },
  {
   "id": "ms-10",
   "subject": "ms",
   "topic": "corr",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "Why does a zinc coating or a zinc block protect a steel part even where the coating is scratched?",
    "ar": "لماذا يحمي طلاء الزنك أو قطعة زنك مثبّتة قطعةَ الفولاذ حتى عند خدش الطلاء؟"
   },
   "opts": [
    {
     "en": "Zinc is more noble than iron, so it shields the steel from the electrolyte",
     "ar": "الزنك أنبل من الحديد فيعزل الفولاذ عن الإلكتروليت",
     "why": {
      "en": "Zinc is LESS noble (more active) than iron; if it were more noble the steel would be the anode and corrode faster at a scratch.",
      "ar": "الزنك أقل نبلاً (أنشط) من الحديد؛ ولو كان أنبل لصار الفولاذ الأنود وتآكل أسرع عند الخدش."
     }
    },
    {
     "en": "Zinc is more active (anodic) than iron, so it corrodes preferentially and the steel becomes the protected cathode",
     "ar": "الزنك أنشط (أنودي) من الحديد فيتآكل هو أولاً ويصبح الفولاذ المهبط المحمي",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Zinc and iron form an alloy that does not rust",
     "ar": "الزنك والحديد يكوّنان سبيكة لا تصدأ",
     "why": {
      "en": "Sacrificial protection is an electrochemical effect of the galvanic couple, not the formation of a rust-proof alloy.",
      "ar": "الحماية التضحوية أثر كهروكيميائي للمزدوج الجلفاني لا تكوّن سبيكة غير قابلة للصدأ."
     }
    },
    {
     "en": "The zinc only acts as paint; once scratched, protection is lost",
     "ar": "الزنك مجرد طلاء وعند خدشه تضيع الحماية",
     "why": {
      "en": "A purely barrier coating would fail when scratched, but zinc also protects cathodically, so exposed steel stays protected nearby.",
      "ar": "الطلاء الحاجز وحده يفشل عند الخدش، لكن الزنك يحمي مهبطياً أيضاً فيبقى الفولاذ المكشوف قربه محمياً."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "In a galvanic couple the more active metal is the anode and dissolves; zinc (more active than iron) is therefore consumed instead of the steel (sacrificial or cathodic protection).",
    "ar": "في المزدوج الجلفاني يكون الفلز الأنشط هو الأنود ويذوب؛ لذا يُستهلك الزنك (الأنشط من الحديد) بدل الفولاذ (الحماية التضحوية أو المهبطية)."
   }
  },
  {
   "id": "ms-11",
   "subject": "ms",
   "topic": "crystal",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "Compute the theoretical density of copper: FCC, atomic radius 0.128 nm, atomic mass 63.55 g/mol (N_A = 6.022×10²³ atoms/mol).",
    "ar": "احسب الكثافة النظرية للنحاس: FCC ونصف قطر الذرة 0.128 nm والكتلة الذرية 63.55 g/mol (N_A = 6.022×10²³ ذرة/mol)."
   },
   "opts": [
    {
     "en": "25.2 g/cm³",
     "ar": "25.2 g/cm³",
     "why": {
      "en": "a = 2R (simple cubic) was used; in FCC the atoms touch along the face diagonal, so a is larger.",
      "ar": "استُعملت a = 2R (المكعب البسيط)؛ وفي FCC تتلامس الذرات على قطر الوجه فتكون a أكبر."
     }
    },
    {
     "en": "8.9 g/cm³",
     "ar": "8.9 g/cm³",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "4.45 g/cm³",
     "ar": "4.45 g/cm³",
     "why": {
      "en": "Only 2 atoms per cell were used (BCC count); FCC has 4 atoms per cell.",
      "ar": "استُعملت ذرتان فقط في الخلية (عدد BCC)؛ وفي FCC أربع ذرات في الخلية."
     }
    },
    {
     "en": "16.3 g/cm³",
     "ar": "16.3 g/cm³",
     "why": {
      "en": "The BCC edge relation a = 4R/√3 was used; for FCC a = 2√2 R, so the cell volume was too small.",
      "ar": "استُعملت علاقة BCC وهي a = 4R/√3؛ أما في FCC فـ a = 2√2 R فجاء حجم الخلية أصغر مما يجب."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "a = 2√2 R = 0.362 nm = 3.62e-08 cm; V = a³ = 4.75×10⁻²³ cm³;  ρ = n A / (V N_A) = 4 × 63.55 / (4.75×10⁻²³ × 6.022×10²³) = 8.9 g/cm³ (measured value is about 8.9).",
    "ar": "a = 2√2 R = 0.362 nm = 3.62e-08 cm؛ V = a³ = 4.75×10⁻²³ cm³؛ ρ = n A / (V N_A) = 4 × 63.55 / (4.75×10⁻²³ × 6.022×10²³) = 8.9 g/cm³ (القيمة المقيسة نحو 8.9)."
   }
  },
  {
   "id": "ms-12",
   "subject": "ms",
   "topic": "crystal",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A plane in a cubic crystal cuts the x, y and z axes at 1/2, 1 and ∞ (in units of the cell edge a). What are its Miller indices?",
    "ar": "مستوٍ في بلورة مكعبة يقطع المحاور x وy وz عند 1/2 و1 و∞ (بوحدة طول ضلع الخلية a). ما معاملات ميلر له؟"
   },
   "opts": [
    {
     "en": "(2 1 0)",
     "ar": "(2 1 0)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "(2 1 1)",
     "ar": "(2 1 1)",
     "why": {
      "en": "A plane parallel to the z-axis (intercept ∞) has index 0 on z, since 1/∞ = 0, not 1.",
      "ar": "المستوي الموازي لمحور z (تقاطع ∞) معامله 0 على z لأن 1/∞ = 0 وليس 1."
     }
    },
    {
     "en": "(1 2 0)",
     "ar": "(1 2 0)",
     "why": {
      "en": "The order was mixed up: the reciprocal of the x-intercept (1/2) is 2 and belongs in the first position.",
      "ar": "اختلط الترتيب: مقلوب تقاطع x (1/2) هو 2 ويوضع في الخانة الأولى."
     }
    },
    {
     "en": "(1/2 1 ∞)",
     "ar": "(1/2 1 ∞)",
     "why": {
      "en": "The intercepts were written directly; Miller indices are the RECIPROCALS of the intercepts, cleared of fractions.",
      "ar": "كُتبت نقاط التقاطع مباشرة؛ أما معاملات ميلر فهي مقلوب نقاط التقاطع بعد إزالة الكسور."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Intercepts (1/2, 1, ∞) → reciprocals (2, 1, 0) → no fractions to clear → (2 1 0).",
    "ar": "نقاط التقاطع (1/2, 1, ∞) ← المقلوبات (2, 1, 0) ← لا كسور تُزال ← (2 1 0)."
   }
  },
  {
   "id": "ms-13",
   "subject": "ms",
   "topic": "defects",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "How is the Burgers vector b oriented relative to the dislocation line for an edge dislocation and for a screw dislocation?",
    "ar": "كيف يتجه متجه برغرز b بالنسبة إلى خط الانخلاع في الانخلاع الحدّي (edge) والانخلاع اللولبي (screw)؟"
   },
   "opts": [
    {
     "en": "Both: b parallel to the line",
     "ar": "كلاهما: b موازٍ للخط",
     "why": {
      "en": "Only the screw dislocation has b parallel to its line; for the edge it is perpendicular.",
      "ar": "الموازاة للانخلاع اللولبي فقط؛ وفي الحدّي يكون b عمودياً."
     }
    },
    {
     "en": "Edge: b perpendicular to the line; screw: b parallel to the line",
     "ar": "الحدّي: b عمودي على الخط؛ واللولبي: b موازٍ للخط",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Edge: b parallel to the line; screw: b perpendicular to the line",
     "ar": "الحدّي: b موازٍ للخط؛ واللولبي: b عمودي على الخط",
     "why": {
      "en": "The two cases were reversed.",
      "ar": "عُكست الحالتان."
     }
    },
    {
     "en": "Both: b perpendicular to the line",
     "ar": "كلاهما: b عمودي على الخط",
     "why": {
      "en": "Only the edge dislocation has b perpendicular to its line; for the screw it is parallel.",
      "ar": "التعامد للانخلاع الحدّي فقط؛ وفي اللولبي يكون b موازياً."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "The Burgers vector gives the magnitude and direction of lattice distortion. Edge (extra half-plane): b ⟂ line. Screw (helical ramp): b ∥ line. Mixed dislocations have both components.",
    "ar": "يحدد متجه برغرز مقدار الانحراف في الشبكة واتجاهه. الحدّي (نصف مستوٍ إضافي): b ⟂ الخط. اللولبي (منحدر حلزوني): b ∥ الخط. والمختلط له المركّبتان."
   }
  },
  {
   "id": "ms-14",
   "subject": "ms",
   "topic": "defects",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "The equilibrium vacancy fraction is N_v/N = exp(−Q_v / kT). For Q_v = 0.9 eV and T = 1000 K (k = 8.617×10⁻⁵ eV/K), what is N_v/N?",
    "ar": "الجزء الاتزاني من الشواغر هو N_v/N = exp(−Q_v / kT). عند Q_v = 0.9 eV وT = 1000 K (k = 8.617×10⁻⁵ eV/K) ما قيمة N_v/N؟"
   },
   "opts": [
    {
     "en": "2.91×10⁻⁵",
     "ar": "2.91×10⁻⁵",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "9.90×10⁻¹",
     "ar": "9.90×10⁻¹",
     "why": {
      "en": "Q_v = 0.9 eV (= 86.8 kJ/mol) was used in kJ/mol with R in J/(mol·K); the units were not converted.",
      "ar": "استُعملت Q_v بوحدة kJ/mol (0.9 eV = 86.8 kJ/mol) مع R بوحدة J/(mol·K) دون تحويل الوحدات."
     }
    },
    {
     "en": "3.44×10⁴",
     "ar": "3.44×10⁴",
     "why": {
      "en": "The minus sign in the exponent was dropped; the fraction must be far less than 1.",
      "ar": "سقطت إشارة السالب في الأس؛ ويجب أن يكون الكسر أقل من 1 بكثير."
     }
    },
    {
     "en": "2.73×10⁻⁴",
     "ar": "2.73×10⁻⁴",
     "why": {
      "en": "273 was added to a temperature that was already in kelvin.",
      "ar": "أُضيف 273 إلى درجة حرارة معطاة أصلاً بالكلفن."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Q_v/(kT) = 0.9 / (8.617e-05 × 1000) = 10.44;  N_v/N = e^−10.44 = 2.91×10⁻⁵: about 3 vacancies per 100 000 lattice sites.",
    "ar": "Q_v/(kT) = 0.9 / (8.617e-05 × 1000) = 10.44؛ N_v/N = e^−10.44 = 2.91×10⁻⁵: نحو 3 شواغر لكل 100 000 موقع شبكي."
   }
  },
  {
   "id": "ms-15",
   "subject": "ms",
   "topic": "strength",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "Hall-Petch: σ_y = σ_0 + k d^(−1/2). For σ_0 = 70 MPa, k = 0.7 MPa·m^½ and mean grain diameter d = 25 μm, what is σ_y?",
    "ar": "هال-بيتش: σ_y = σ_0 + k d^(−1/2). عند σ_0 = 70 MPa وk = 0.7 MPa·m^½ وقطر الحبيبة الوسطي d = 25 μm، ما قيمة σ_y؟"
   },
   "opts": [
    {
     "en": "140 MPa",
     "ar": "140 MPa",
     "why": {
      "en": "The friction stress σ_0 was left out; σ_y = σ_0 + k d^(−1/2).",
      "ar": "أُهمل إجهاد الاحتكاك σ_0؛ والعلاقة σ_y = σ_0 + k d^(−1/2)."
     }
    },
    {
     "en": "210 MPa",
     "ar": "210 MPa",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "28070 MPa",
     "ar": "28070 MPa",
     "why": {
      "en": "d^(−1) was used instead of d^(−1/2); the square root was forgotten, giving an absurdly large value.",
      "ar": "استُعملت d^(−1) بدل d^(−1/2)؛ نُسي الجذر التربيعي فجاءت قيمة ضخمة غير معقولة."
     }
    },
    {
     "en": "74.43 MPa",
     "ar": "74.43 MPa",
     "why": {
      "en": "d was inserted in mm (0.025) while k is in MPa·m^½; the grain size must be in metres.",
      "ar": "أُدخلت d بالـmm (0.025) بينما k بوحدة MPa·m^½؛ يجب أن يكون حجم الحبيبة بالمتر."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "d^(−1/2) = (25×10⁻⁶ m)^(−1/2) = 200 m^(−1/2);  σ_y = 70 + 0.7 × 200 = 210 MPa. Finer grains → more grain boundaries blocking dislocations → higher strength.",
    "ar": "d^(−1/2) = (25×10⁻⁶ m)^(−1/2) = 200 m^(−1/2)؛ σ_y = 70 + 0.7 × 200 = 210 MPa. الحبيبات الأدق ← حدود حبيبات أكثر تعيق الانخلاعات ← مقاومة أعلى."
   }
  },
  {
   "id": "ms-16",
   "subject": "ms",
   "topic": "fec",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A 0.4 wt% C steel is cooled slowly and is held just above 727 °C, in the α + γ region. Take α = 0.022 wt% C and γ = 0.76 wt% C. What mass fraction of the steel is proeutectoid ferrite (α)?",
    "ar": "فولاذ 0.4 wt% C يُبرَّد ببطء ويُوقَف فوق 727 °C بقليل في منطقة α + γ. خذ α = 0.022 wt% C وγ = 0.76 wt% C. ما الكسر الكتلي للفيريت ما قبل الأيوتكتويدي (α)؟"
   },
   "opts": [
    {
     "en": "51.2 %",
     "ar": "51.2 %",
     "why": {
      "en": "The opposite lever arm was used; this is the austenite (future pearlite) fraction, not the ferrite fraction.",
      "ar": "استُعمل ذراع الرافعة المقابل؛ وهذا كسر الأوستنيت (البيرلايت لاحقاً) لا كسر الفيريت."
     }
    },
    {
     "en": "52.6 %",
     "ar": "52.6 %",
     "why": {
      "en": "The overall composition was divided by the γ composition, which is not a lever-rule expression.",
      "ar": "قُسم التركيب الكلي على تركيب γ وهذا ليس تعبيراً من قاعدة الرافعة."
     }
    },
    {
     "en": "47.4 %",
     "ar": "47.4 %",
     "why": {
      "en": "The ferrite composition (0.022) was ignored in the denominator; the tie line runs from α to γ.",
      "ar": "أُهمل تركيب الفيريت (0.022) في المقام؛ فخط الربط يمتد من α إلى γ."
     }
    },
    {
     "en": "48.8 %",
     "ar": "48.8 %",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Lever rule: W_α = (C_γ − C_0)/(C_γ − C_α) = (0.76 − 0.4)/(0.76 − 0.022) = 0.4878 → 48.8 %. The remaining 51.2 % is austenite that turns to pearlite.",
    "ar": "قاعدة الرافعة: W_α = (C_γ − C_0)/(C_γ − C_α) = (0.76 − 0.4)/(0.76 − 0.022) = 0.4878 ← 48.8 %. والباقي 51.2 % أوستنيت يتحول إلى بيرلايت."
   }
  },
  {
   "id": "ms-17",
   "subject": "ms",
   "topic": "fec",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "The same 0.4 wt% C steel is now at room temperature. Treat it as ferrite (0.022 wt% C) plus cementite (6.67 wt% C). What is the TOTAL mass fraction of cementite (free plus in pearlite)?",
    "ar": "الفولاذ نفسه (0.4 wt% C) صار عند درجة حرارة الغرفة. اعتبره فيريت (0.022 wt% C) + سمنتيت (6.67 wt% C). ما الكسر الكتلي الكلي للسمنتيت (الحر والموجود في البيرلايت)؟"
   },
   "opts": [
    {
     "en": "94.3 %",
     "ar": "94.3 %",
     "why": {
      "en": "This is the ferrite fraction (opposite lever arm), not the cementite fraction.",
      "ar": "هذا كسر الفيريت (ذراع الرافعة المقابل) لا كسر السمنتيت."
     }
    },
    {
     "en": "51.2 %",
     "ar": "51.2 %",
     "why": {
      "en": "The pearlite tie line (α to 0.76) was used; the cementite end of the tie line is 6.67 wt% C.",
      "ar": "استُعم خط ربط البيرلايت (من α إلى 0.76)؛ أما طرف السمنتيت فهو 6.67 wt% C."
     }
    },
    {
     "en": "6.0 %",
     "ar": "6.0 %",
     "why": {
      "en": "The ferrite solubility was ignored; the lever rule uses (C_0 − C_α).",
      "ar": "أُهملت ذوبانية الفيريت؛ وقاعدة الرافعة تستعمل (C_0 − C_α)."
     }
    },
    {
     "en": "5.7 %",
     "ar": "5.7 %",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "W_Fe3C = (C_0 − C_α)/(C_Fe3C − C_α) = (0.4 − 0.022)/(6.67 − 0.022) = 0.05686 → 5.7 %.",
    "ar": "كسر السمنتيت W_Fe3C = (C_0 − C_α)/(C_Fe3C − C_α) = (0.4 − 0.022)/(6.67 − 0.022) = 0.05686 ← 5.7 %."
   }
  },
  {
   "id": "ms-18",
   "subject": "ms",
   "topic": "alloy",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "By the usual definition (e.g. European standard practice), what is the MINIMUM chromium content of a stainless steel, and why does it matter?",
    "ar": "وفق التعريف المعتاد (مثلاً الممارسة القياسية الأوروبية)، ما الحد الأدنى لمحتوى الكروم في الفولاذ المقاوم للصدأ ولماذا هو مهم؟"
   },
   "opts": [
    {
     "en": "About 18 % Cr: below this the steel always rusts",
     "ar": "نحو 18 % Cr: دون ذلك يصدأ الفولاذ دائماً",
     "why": {
      "en": "18 % is the typical Cr of grade 304, not the definition limit; ferritic grades with about 11-12 % Cr are already classed as stainless.",
      "ar": "18 % هي النسبة المعتادة في الدرجة 304 لا حد التعريف؛ والدرجات الفيريتية بنحو 11-12 % Cr تُعدّ مقاومة للصدأ أيضاً."
     }
    },
    {
     "en": "About 10.5 % Cr: enough chromium forms a thin self-healing passive oxide layer",
     "ar": "نحو 10.5 % Cr: هذا القدر من الكروم يكوّن طبقة أكسيد خاملة رقيقة ذاتية الإصلاح",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "About 30 % Ni, because nickel creates the passive layer",
     "ar": "نحو 30 % Ni لأن النيكل هو الذي يكوّن الطبقة الخاملة",
     "why": {
      "en": "The passive layer is chromium-based; nickel stabilises the austenite structure and improves ductility but is not the minimum criterion.",
      "ar": "الطبقة الخاملة قائمة على الكروم؛ أما النيكل فيثبّت بنية الأوستنيت ويحسّن المطيلية وليس معيار الحد الأدنى."
     }
    },
    {
     "en": "About 2 % Cr: any chromium makes steel fully stainless",
     "ar": "نحو 2 % Cr: أي كمية كروم تجعل الفولاذ مقاوماً تماماً",
     "why": {
      "en": "A few percent Cr (as in low-alloy steels) is far too little to form a continuous passive film.",
      "ar": "بضعة بالمئة من الكروم (كما في الفولاذ منخفض السبائك) لا تكفي لتكوين طبقة خاملة متصلة."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "Stainless steels are iron alloys with at least about 10.5 % Cr (and at most about 1.2 % C). Chromium oxidises to a thin, self-repairing Cr-rich oxide film that blocks further corrosion.",
    "ar": "الفولاذ المقاوم للصدأ سبائك حديد فيها 10.5 % Cr على الأقل (وكربون لا يتجاوز نحو 1.2 %). يتأكسد الكروم مكوّناً غشاءً رقيقاً غنياً بالكروم ذاتي الإصلاح يمنع استمرار التآكل."
   }
  },
  {
   "id": "ms-19",
   "subject": "ms",
   "topic": "nonfer",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "Two identical cantilever beams (same geometry, same load, elastic range) are made of structural steel (E = 200 GPa) and of a titanium alloy (E = 110 GPa, within the typical 105-120 GPa range). What is the ratio of tip deflection, titanium / steel?",
    "ar": "جائزان كابوليان متطابقان (الهندسة نفسها والحمل نفسه ضمن المدى المرن) أحدهما من فولاذ إنشائي (E = 200 GPa) والآخر من سبيكة تيتانيوم (E = 110 GPa ضمن المدى المعتاد 105-120 GPa). ما نسبة السهم الطرفي تيتانيوم / فولاذ؟"
   },
   "opts": [
    {
     "en": "1.00",
     "ar": "1.00",
     "why": {
      "en": "Elastic deflection depends on the modulus (δ ∝ 1/E); equal geometry and load do not give equal deflection for different materials.",
      "ar": "السهم المرن يعتمد على المعامل (δ ∝ 1/E)؛ تساوي الهندسة والحمل لا يعني تساوي السهم لمادتين مختلفتين."
     }
    },
    {
     "en": "0.55",
     "ar": "0.55",
     "why": {
      "en": "The ratio was inverted: deflection is inversely proportional to E, so the less stiff titanium deflects MORE.",
      "ar": "قُلبت النسبة: السهم يتناسب عكسياً مع E فالتيتانيوم الأقل صلابة ينحني أكثر."
     }
    },
    {
     "en": "1.82",
     "ar": "1.82",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "3.31",
     "ar": "3.31",
     "why": {
      "en": "The ratio was squared; deflection is proportional to 1/E (first power).",
      "ar": "رُبّعت النسبة؛ والسهم يتناسب مع 1/E (القوة الأولى)."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "δ = P L³ / (3 E I) ∝ 1/E  →  δ_Ti / δ_steel = E_steel / E_Ti = 200/110 = 1.82. Titanium alloys are strong and light but less stiff than steel.",
    "ar": "δ = P L³ / (3 E I) ∝ 1/E ← δ_Ti / δ_steel = E_steel / E_Ti = 200/110 = 1.82. سبائك التيتانيوم قوية وخفيفة لكنها أقل صلابة من الفولاذ."
   }
  },
  {
   "id": "ms-20",
   "subject": "ms",
   "topic": "poly",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "What is the essential structural difference between a thermoplastic and a thermosetting polymer?",
    "ar": "ما الفرق البنيوي الجوهري بين البوليمر اللدن بالحرارة (thermoplastic) والبوليمر المتصلب بالحرارة (thermoset)؟"
   },
   "opts": [
    {
     "en": "Thermoplastics are always fully crystalline, thermosets always amorphous",
     "ar": "اللدنة بالحرارة بلورية تماماً دائماً والمتصلبة غير بلورية دائماً",
     "why": {
      "en": "Many thermoplastics are semicrystalline or amorphous; the classification is about cross-linking, not crystallinity.",
      "ar": "كثير من اللدائن الحرارية شبه بلورية أو غير بلورية؛ والتصنيف يخص التشابك لا البلورية."
     }
    },
    {
     "en": "Thermoplastics have linear or branched chains held by weak secondary bonds (they soften and can be remelted); thermosets have a covalent cross-linked network (they do not remelt)",
     "ar": "اللدن بالحرارة سلاسله خطية أو متفرعة تربطها روابط ثانوية ضعيفة (يلين ويمكن إعادة صهره)؛ والمتصلب بالحرارة شبكة متشابكة برابط تساهمية (لا يعاد صهره)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Thermoplastics are cross-linked networks and thermosets have free linear chains",
     "ar": "اللدن بالحرارة شبكة متشابكة والمتصلب سلاسله خطية حرة",
     "why": {
      "en": "The two were reversed; cross-linking is what makes a thermoset infusible.",
      "ar": "عُكس التعريفان؛ فالتشابك هو ما يجعل المتصلب بالحرارة غير قابل للانصهار."
     }
    },
    {
     "en": "Both can be remelted repeatedly; they differ only in colour",
     "ar": "كلاهما يعاد صهره مراراً ولا يختلفان إلا باللون",
     "why": {
      "en": "Cross-linked thermosets decompose on strong heating instead of melting.",
      "ar": "المتصلبات بالحرارة المتشابكة تتحلل عند التسخين الشديد ولا تنصهر."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "Heating a thermoplastic weakens the secondary bonds between chains, so it softens and can be reshaped. A thermoset forms permanent covalent cross-links during curing and cannot be remelted.",
    "ar": "التسخين يضعف الروابط الثانوية بين سلاسل اللدن بالحرارة فيلين ويمكن إعادة تشكيله. أما المتصلب بالحرارة فيكوّن روابط تساهمية دائمة أثناء المعالجة ولا يمكن إعادة صهره."
   }
  },
  {
   "id": "ms-21",
   "subject": "ms",
   "topic": "poly",
   "level": 3,
   "type": "multi",
   "q": {
    "en": "Multi-step problem. A unidirectional fibre composite has fibres with E_f = 70 GPa (volume fraction V_f = 0.4) in a polymer matrix with E_m = 3 GPa. Use the rule of mixtures. Answer the three steps (partial credit is given).",
    "ar": "مسألة متعددة الخطوات. مادة مركّبة بألياف أحادية الاتجاه: الألياف E_f = 70 GPa وكسرها الحجمي V_f = 0.4 في مصفوفة بوليمرية E_m = 3 GPa. استعمل قاعدة الخلط. أجب عن الخطوات الثلاث (يُمنح تقدير جزئي)."
   },
   "steps": [
    {
     "id": "a",
     "q": {
      "en": "Step 1: What is the longitudinal modulus E_c (load parallel to the fibres, equal strain in fibre and matrix)?",
      "ar": "الخطوة 1: ما المعامل الطولي E_c (الحمل موازٍ للألياف والانفعال متساوٍ في الليف والمصفوفة)؟"
     },
     "opts": [
      {
       "en": "4.86 GPa",
       "ar": "4.86 GPa",
       "why": {
        "en": "This is the series (equal-stress) value, valid for loading ACROSS the fibres, not along them.",
        "ar": "هذه قيمة التوصيل على التوالي (إجهاد متساوٍ) وتصح للتحميل بشكل عمودي على الألياف لا موازٍ لها."
       }
      },
      {
       "en": "43.2 GPa",
       "ar": "43.2 GPa",
       "why": {
        "en": "The volume fractions were swapped between fibre and matrix.",
        "ar": "تبادل الكسران الحجميان بين الليف والمصفوفة."
       }
      },
      {
       "en": "36.5 GPa",
       "ar": "36.5 GPa",
       "why": {
        "en": "A simple average ignores the volume fractions; the weights are V_f and V_m.",
        "ar": "المتوسط البسيط يتجاهل الكسور الحجمية؛ والأوزان هي V_f وV_m."
       }
      },
      {
       "en": "29.8 GPa",
       "ar": "29.8 GPa",
       "why": {
        "en": "",
        "ar": ""
       }
      }
     ],
     "ans": 3,
     "exp": {
      "en": "E_c = V_f E_f + V_m E_m = 0.4×70 + 0.6×3 = 29.8 GPa.",
      "ar": "E_c = V_f E_f + V_m E_m = 0.4×70 + 0.6×3 = 29.8 GPa."
     }
    },
    {
     "id": "b",
     "q": {
      "en": "Step 2: What fraction of the longitudinal load is carried by the fibres?",
      "ar": "الخطوة 2: ما الكسر الذي تحمله الألياف من الحمل الطولي؟"
     },
     "opts": [
      {
       "en": "40.0 %",
       "ar": "40.0 %",
       "why": {
        "en": "The volume fraction was used as the load fraction; the stiffer fibres carry a larger share than their volume share.",
        "ar": "استُعمل الكسر الحجمي ككسر للحمل؛ والألياف الأصلب تحمل نصيباً أكبر من نصيبها الحجمي."
       }
      },
      {
       "en": "95.9 %",
       "ar": "95.9 %",
       "why": {
        "en": "The volume fractions were left out; the load share is E_f V_f / (E_f V_f + E_m V_m).",
        "ar": "أُهملت الكسور الحجمية؛ ونصيب الحمل هو E_f V_f / (E_f V_f + E_m V_m)."
       }
      },
      {
       "en": "94.0 %",
       "ar": "94.0 %",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "60.0 %",
       "ar": "60.0 %",
       "why": {
        "en": "This is the matrix volume fraction, not the fibre load fraction.",
        "ar": "هذا الكسر الحجمي للمصفوفة لا كسر حمل الألياف."
       }
      }
     ],
     "ans": 2,
     "exp": {
      "en": "With equal strain, F_f / F_c = E_f V_f / E_c = 28.0 / 29.8 = 0.9396 → 94.0 %.",
      "ar": "عند تساوي الانفعال: F_f / F_c = E_f V_f / E_c = 28.0 / 29.8 = 0.9396 ← 94.0 %."
     }
    },
    {
     "id": "c",
     "q": {
      "en": "Step 3: Using the equal-stress (series) model, what is the transverse modulus E_t (load perpendicular to the fibres)?",
      "ar": "الخطوة 3: باستعمال نموذج الإجهاد المتساوي (التوالي) ما المعامل العرضي E_t (الحمل عمودي على الألياف)؟"
     },
     "opts": [
      {
       "en": "7.05 GPa",
       "ar": "7.05 GPa",
       "why": {
        "en": "The volume fractions were swapped in the series formula.",
        "ar": "تبادل الكسران الحجميان في صيغة التوالي."
       }
      },
      {
       "en": "36.5 GPa",
       "ar": "36.5 GPa",
       "why": {
        "en": "A simple mean is not the series model; 1/E_t = V_f/E_f + V_m/E_m.",
        "ar": "المتوسط البسيط ليس نموذج التوالي؛ والصحيح 1/E_t = V_f/E_f + V_m/E_m."
       }
      },
      {
       "en": "29.8 GPa",
       "ar": "29.8 GPa",
       "why": {
        "en": "This is the parallel (equal-strain) result; the transverse case adds compliances (inverse moduli).",
        "ar": "هذه نتيجة التوازي (انفعال متساوٍ)؛ أما الحالة العرضية فتجمع المرونات (مقلوب المعاملات)."
       }
      },
      {
       "en": "4.86 GPa",
       "ar": "4.86 GPa",
       "why": {
        "en": "",
        "ar": ""
       }
      }
     ],
     "ans": 3,
     "exp": {
      "en": "1/E_t = V_f/E_f + V_m/E_m = 0.4/70 + 0.6/3 = 0.2057 → E_t = 4.86 GPa. Along the fibres the material is far stiffer than across them (anisotropy).",
      "ar": "1/E_t = V_f/E_f + V_m/E_m = 0.4/70 + 0.6/3 = 0.2057 ← E_t = 4.86 GPa. المادة أصلب بكثير على امتداد الألياف منها عبرها (لا تماثلية)."
     }
    }
   ],
   "exp": {
    "en": "Along the fibres the two constituents are strained equally (upper bound, arithmetic mean by volume); across them they carry equal stress (lower bound, harmonic mean). Fibre composites are therefore anisotropic.",
    "ar": "على امتداد الألياف ينفعل المكوّنان بالقدر نفسه (الحد الأعلى، متوسط حسابي حجمي)؛ وعبرها يتحملان الإجهاد نفسه (الحد الأدنى، متوسط توافقي). لذا فالمواد المركّبة الليفية لا متماثلة."
   }
  },
  {
   "id": "ms-22",
   "subject": "ms",
   "topic": "fec",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "A hypereutectoid steel with 1.0 wt% C is cooled slowly to just below 727 °C. Take austenite at the eutectoid = 0.76 wt% C and cementite = 6.67 wt% C. What mass fraction of the steel is PROEUTECTOID cementite (the cementite formed before the pearlite)?",
    "ar": "فولاذ فوق أيوتكتويدي بـ 1.0 wt% C يُبرَّد ببطء إلى ما دون 727 °C بقليل. خذ الأوستنيت الأيوتكتويدي = 0.76 wt% C والسمنتيت = 6.67 wt% C. ما الكسر الكتلي للسمنتيت ما قبل الأيوتكتويدي (المتكوّن قبل البيرلايت)؟"
   },
   "opts": [
    {
     "en": "14.7 %",
     "ar": "14.7 %",
     "why": {
      "en": "This is the TOTAL cementite (free plus in pearlite) from the α/Fe3C tie line, not just the proeutectoid part.",
      "ar": "هذا هو السمنتيت الكلي (الحر والموجود في البيرلايت) من خط الربط α/Fe3C لا الجزء ما قبل الأيوتكتويدي فقط."
     }
    },
    {
     "en": "3.6 %",
     "ar": "3.6 %",
     "why": {
      "en": "The denominator should be the tie-line length (6.67 − 0.76), not the full cementite composition.",
      "ar": "يجب أن يكون المقام طول خط الربط (6.67 − 0.76) لا تركيب السمنتيت كاملاً."
     }
    },
    {
     "en": "4.06 %",
     "ar": "4.06 %",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "95.9 %",
     "ar": "95.9 %",
     "why": {
      "en": "The opposite lever arm gives the austenite (pearlite) fraction, not the proeutectoid cementite fraction.",
      "ar": "ذراع الرافعة المقابل يعطي كسر الأوستنيت (البيرلايت) لا كسر السمنتيت ما قبل الأيوتكتويدي."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "Just above 727 °C the phases are γ (0.76) and Fe3C (6.67): W_Fe3C′ = (C_0 − 0.76)/(6.67 − 0.76) = (1.0 − 0.76)/(6.67 − 0.76) = 0.04061 → 4.06 %.",
    "ar": "فوق 727 °C بقليل تكون الأطوار γ (0.76) وFe3C (6.67): W_Fe3C′ = (C_0 − 0.76)/(6.67 − 0.76) = (1.0 − 0.76)/(6.67 − 0.76) = 0.04061 ← 4.06 %."
   }
  },
  {
   "id": "ms-23",
   "subject": "ms",
   "topic": "solid",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "The ASTM grain-size number n is defined by N = 2^(n−1), where N is the number of grains per square inch counted on a micrograph at 100× magnification. How many grains per square inch will be counted at 100× for n = 6?",
    "ar": "يُعرَّف رقم حجم الحبيبات ASTM بالعلاقة N = 2^(n−1) حيث N عدد الحبيبات في البوصة المربعة على صورة مجهرية بتكبير 100×. كم حبيبة في البوصة المربعة تُعدّ عند 100× لـ n = 6؟"
   },
   "opts": [
    {
     "en": "32",
     "ar": "32",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "64",
     "ar": "64",
     "why": {
      "en": "The exponent used n instead of n − 1.",
      "ar": "استُعمل الأس n بدل n − 1."
     }
    },
    {
     "en": "3.2×10⁵",
     "ar": "3.2×10⁵",
     "why": {
      "en": "This is the count per square inch on the real specimen (1×), obtained by scaling the 100× count by 100²; the question asks for the 100× count.",
      "ar": "هذا العدد في البوصة المربعة على العينة الفعلية (1×) بضرب العدد عند 100× في 100²؛ والمطلوب العدد عند 100×."
     }
    },
    {
     "en": "36",
     "ar": "36",
     "why": {
      "en": "N was computed as n² instead of 2^(n−1).",
      "ar": "حُسبت N على أنها n² بدل 2^(n−1)."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "N = 2^(n−1) = 2^5 = 32 grains/in² at 100× (about 3.2×10⁵ per in² on the actual surface). A higher n means finer grains.",
    "ar": "N = 2^(n−1) = 2^5 = 32 حبيبة/in² عند 100× (نحو 3.2×10⁵ في in² على السطح الفعلي). كلما زاد n كانت الحبيبات أدق."
   }
  },
  {
   "id": "ms-24",
   "subject": "ms",
   "topic": "solid",
   "level": 3,
   "type": "concept",
   "q": {
    "en": "Why does faster cooling of a casting usually give a finer grain structure?",
    "ar": "لماذا يعطي التبريد الأسرع للمسبوكة عادةً بنية حبيبية أدق؟"
   },
   "opts": [
    {
     "en": "Larger undercooling raises the nucleation rate, so many more nuclei form and each grows less before they meet",
     "ar": "التبريد الشديد (undercooling) أكبر يرفع معدل التنوّي فتتكوّن نوى أكثر بكثير وتنمو كل منها أقل قبل أن تلتقي",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Fast cooling changes the crystal structure from FCC to HCP, which has smaller grains",
     "ar": "التبريد السريع يغيّر البنية من FCC إلى HCP ذات الحبيبات الأصغر",
     "why": {
      "en": "Grain size is not set by the crystal structure type; a metal keeps its structure (FCC stays FCC) at any cooling rate.",
      "ar": "حجم الحبيبات لا تحدده بنية البلورة؛ والفلز يحتفظ ببنيته (FCC تبقى FCC) مهما كان معدل التبريد."
     }
    },
    {
     "en": "Slow cooling gives atoms less time to diffuse, so grains grow larger",
     "ar": "التبريد البطيء يعطي الذرات وقتاً أقل للانتشار فتنمو الحبيبات أكبر",
     "why": {
      "en": "This is backwards: SLOW cooling gives more time for growth and coarser grains.",
      "ar": "هذا معكوس: التبريد البطيء يعطي وقتاً أطول للنمو فيعطي حبيبات أخشن."
     }
    },
    {
     "en": "Grain size depends only on composition, never on cooling rate",
     "ar": "حجم الحبيبات يتوقف على التركيب فقط ولا يتأثر بمعدل التبريد",
     "why": {
      "en": "Cooling rate strongly affects nucleation and growth; casting practice uses chills and grain refiners for this reason.",
      "ar": "يؤثر معدل التبريد بقوة في التنوّي والنمو؛ ولذلك تُستعمل المبرِّدات ومنقّيات الحبيبات في الصب."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Solidification is nucleation plus growth. Greater undercooling (faster extraction of heat) increases the nucleation rate, giving more, smaller grains; fine grains also raise strength (Hall-Petch).",
    "ar": "التصلب تنوٍّ ثم نمو. التبريد الشديد الأكبر (سحب حرارة أسرع) يزيد معدل التنوّي فتنتج حبيبات أكثر وأصغر؛ والحبيبات الدقيقة ترفع المقاومة (هال-بيتش)."
   }
  },
  {
   "id": "ms-25",
   "subject": "ms",
   "topic": "mech",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "Modulus of resilience U_r = σ_y² / (2E). A steel has σ_y = 250 MPa and E = 200 GPa. What is U_r?",
    "ar": "معامل المرونة الراجعة (resilience) U_r = σ_y² / (2E). فولاذ إجهاد خضوعه σ_y = 250 MPa وE = 200 GPa. ما قيمة U_r؟"
   },
   "opts": [
    {
     "en": "15.62 MJ/m³",
     "ar": "15.62 MJ/m³",
     "why": {
      "en": "The yield strain 0.00125 was inflated by 100 (read as a percentage), so the result is 100 times too large.",
      "ar": "تضخم انفعال الخضوع 0.00125 بمقدار 100 (قُرئ كنسبة مئوية) فجاءت النتيجة 100 ضعف الصحيح."
     }
    },
    {
     "en": "156.2 MJ/m³",
     "ar": "156.2 MJ/m³",
     "why": {
      "en": "E was entered as 200 MPa instead of 200 000 MPa (GPa/MPa unit slip), inflating the result 1000 times.",
      "ar": "أُدخلت E على أنها 200 MPa بدل 200 000 MPa (خطأ GPa/MPa) فتضخمت النتيجة 1000 مرة."
     }
    },
    {
     "en": "156.2 kJ/m³",
     "ar": "156.2 kJ/m³",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "312.5 kJ/m³",
     "ar": "312.5 kJ/m³",
     "why": {
      "en": "The factor ½ was dropped; the area under the elastic triangle is ½ σ_y ε_y.",
      "ar": "سقط العامل ½؛ فمساحة المثلث المرن هي ½ σ_y ε_y."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "ε_y = σ_y/E = 250/200 000 = 0.00125;  U_r = ½ σ_y ε_y = 0.15625 MJ/m³ = 156.2 kJ/m³ (energy per unit volume absorbed elastically).",
    "ar": "ε_y = σ_y/E = 250/200 000 = 0.00125؛ U_r = ½ σ_y ε_y = 0.15625 MJ/m³ = 156.2 kJ/m³ (الطاقة المختزنة مرنياً لكل وحدة حجم)."
   }
  },
  {
   "id": "ms-26",
   "subject": "ms",
   "topic": "mech",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "Before necking, a ductile bar reaches an engineering stress of 400 MPa at an engineering strain of 0.2 (constant volume deformation). What is the TRUE stress?",
    "ar": "قبل بدء التخصّر يبلغ قضيب مطيل إجهاداً هندسياً 400 MPa عند انفعال هندسي 0.2 (تشوه بثبات الحجم). ما الإجهاد الحقيقي؟"
   },
   "opts": [
    {
     "en": "480 MPa",
     "ar": "480 MPa",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "320 MPa",
     "ar": "320 MPa",
     "why": {
      "en": "The sign was wrong: the cross-section shrinks, so true stress is LARGER than engineering stress: σ_T = σ(1 + ε).",
      "ar": "الإشارة خاطئة: تتناقص المساحة فيكون الإجهاد الحقيقي أكبر من الهندسي: σ_T = σ(1 + ε)."
     }
    },
    {
     "en": "72.93 MPa",
     "ar": "72.93 MPa",
     "why": {
      "en": "The stress was multiplied by the true STRAIN ln(1 + ε); the correct factor is (1 + ε).",
      "ar": "ضُرب الإجهاد في الانفعال الحقيقي ln(1 + ε)؛ والعامل الصحيح هو (1 + ε)."
     }
    },
    {
     "en": "400 MPa",
     "ar": "400 MPa",
     "why": {
      "en": "True stress equals engineering stress only for very small strains; at 20 % strain the area change matters.",
      "ar": "يساوي الإجهاد الحقيقي الهندسي عند الانفعالات الصغيرة جداً فقط؛ وعند 20 % يؤثر تغيّر المساحة."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "With constant volume A·L = A0·L0, so A = A0/(1 + ε) and σ_T = F/A = σ(1 + ε) = 400 × 1.2 = 480 MPa (true strain = ln 1.2 = 0.1823). Valid only up to the onset of necking.",
    "ar": "بثبات الحجم A·L = A0·L0 فتكون A = A0/(1 + ε) ويكون σ_T = F/A = σ(1 + ε) = 400 × 1.2 = 480 MPa (الانفعال الحقيقي = ln 1.2 = 0.1823). تصح العلاقة حتى بدء التخصّر فقط."
   }
  },
  {
   "id": "ms-27",
   "subject": "ms",
   "topic": "corr",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "Iron corrodes by Fe → Fe²⁺ + 2e⁻. A steady corrosion current of 0.5 A flows for 1 hour. Using Faraday's law m = I t M / (n F) (M = 55.85 g/mol, F = 96485 C/mol), what mass of iron dissolves?",
    "ar": "يتآكل الحديد وفق Fe → Fe²⁺ + 2e⁻. يمر تيار تآكل ثابت 0.5 A لمدة ساعة. باستعمال قانون فاراداي m = I t M / (n F) (M = 55.85 g/mol وF = 96485 C/mol) ما كتلة الحديد الذائبة؟"
   },
   "opts": [
    {
     "en": "0.521 g",
     "ar": "0.521 g",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "1.04 g",
     "ar": "1.04 g",
     "why": {
      "en": "n = 1 was used; the number of electrons per Fe atom (2) was forgotten.",
      "ar": "استُعملت n = 1؛ نُسي عدد الإلكترونات لكل ذرة حديد (2)."
     }
    },
    {
     "en": "0.347 g",
     "ar": "0.347 g",
     "why": {
      "en": "n = 3 was used (Fe³⁺); the reaction given releases 2 electrons per atom, so n = 2.",
      "ar": "استُعملت n = 3 (Fe³⁺)؛ والتفاعل المعطى يحرر إلكترونين لكل ذرة أي n = 2."
     }
    },
    {
     "en": "0.00868 g",
     "ar": "0.00868 g",
     "why": {
      "en": "The time was taken as 60 s (1 minute) instead of 3600 s; 1 hour = 3600 s.",
      "ar": "أُخذ الزمن 60 s (دقيقة) بدل 3600 s؛ والساعة = 3600 s."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Charge Q = I t = 0.5 × 3600 = 1800 C;  m = Q M/(n F) = 1800 × 55.85 / (2 × 96485) = 0.521 g.",
    "ar": "الشحنة Q = I t = 0.5 × 3600 = 1800 C؛ m = Q M/(n F) = 1800 × 55.85 / (2 × 96485) = 0.521 g."
   }
  },
  {
   "id": "ms-28",
   "subject": "ms",
   "topic": "corr",
   "level": 3,
   "type": "applied",
   "q": {
    "en": "A steel rivet is used to join large copper plates, and in another design a copper rivet joins large steel plates, both in salt water. Which design is expected to suffer the more rapid corrosion damage, and why?",
    "ar": "يُستعمل برشام فولاذي لربط صفائح نحاسية كبيرة، وفي تصميم آخر برشام نحاسي لربط صفائح فولاذية كبيرة، كلاهما في ماء مالح. أي التصميمين يُتوقع أن يتضرر أسرع بالتآكل ولماذا؟"
   },
   "opts": [
    {
     "en": "Both corrode equally, because the same two metals are in contact",
     "ar": "كلاهما يتآكل بالقدر نفسه لأن الفلزين نفسهما متلامسان",
     "why": {
      "en": "The area ratio matters: the same current concentrated on a small anode gives a much higher corrosion current density.",
      "ar": "تؤثر نسبة المساحات: فالتيار نفسه إذا تركّز على أنود صغير يعطي كثافة تيار تآكل أعلى بكثير."
     }
    },
    {
     "en": "Neither corrodes, because salt water is not an electrolyte",
     "ar": "لا يتآكل أي منهما لأن الماء المالح ليس إلكتروليتاً",
     "why": {
      "en": "Salt water is a good electrolyte (conducts ions), which makes galvanic corrosion faster.",
      "ar": "الماء المالح إلكتروليت جيد (يوصل الأيونات) وهذا يسرّع التآكل الجلفاني."
     }
    },
    {
     "en": "The steel rivet in copper plates: steel is the anode and its small area must supply the whole galvanic current (large cathode / small anode)",
     "ar": "البرشام الفولاذي في الصفائح النحاسية: الفولاذ هو الأنود ومساحته الصغيرة تتحمل كل التيار الجلفاني (مهبط كبير / أنود صغير)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "The copper rivet in steel plates, because copper is the more active metal",
     "ar": "البرشام النحاسي في الصفائح الفولاذية لأن النحاس هو الفلز الأنشط",
     "why": {
      "en": "Copper is more noble (cathodic) than steel; the active metal, steel, is the one that corrodes.",
      "ar": "النحاس أنبل (مهبطي) من الفولاذ؛ والفلز الأنشط وهو الفولاذ هو الذي يتآكل."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "In a galvanic couple the more active metal (steel) is the anode. The cathodic reaction takes place over the large copper area, so a large total current is forced through the small steel anode, giving a very high local corrosion rate. The reverse arrangement (small cathode, large anode) spreads the attack thinly.",
    "ar": "في المزدوج الجلفاني يكون الفلز الأنشط (الفولاذ) هو الأنود. يحدث تفاعل المهبط على مساحة النحاس الكبيرة فيمرّ تيار كبير عبر أنود الفولاذ الصغير فيرتفع معدل التآكل موضعياً كثيراً. أما العكس (مهبط صغير وأنود كبير) فيوزع الهجوم بشكل رقيق."
   }
  },
  {
   "id": "ms-29",
   "subject": "ms",
   "topic": "poly",
   "level": 3,
   "type": "concept",
   "q": {
    "en": "Ceramics have very strong ionic/covalent bonds, yet they fracture in tension at stresses far below the theoretical bond strength. What is the main reason?",
    "ar": "للسيراميك روابط أيونية/تساهمية قوية جداً ومع ذلك ينكسر شداً عند إجهادات أقل بكثير من مقاومة الروابط النظرية. ما السبب الرئيسي؟"
   },
   "opts": [
    {
     "en": "Pre-existing microscopic flaws (cracks, pores) concentrate stress, and the lack of plastic flow at room temperature means the tip cannot blunt",
     "ar": "وجود عيوب مجهرية سابقة (شقوق ومسام) تركّز الإجهاد، وانعدام الانسياب اللدن في درجة حرارة الغرفة يمنع تلطيف رأس الشق",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Their Young's modulus is lower than that of metals, so they stretch too far",
     "ar": "معامل يونغ لها أقل من الفلزات فتستطيل كثيراً",
     "why": {
      "en": "Many ceramics have a HIGH modulus (often higher than steel); the failure is by fracture at flaws, not by excessive stretching.",
      "ar": "كثير من السيراميك له معامل مرونة مرتفع (غالباً أعلى من الفولاذ)؛ والفشل كسر عند العيوب لا استطالة مفرطة."
     }
    },
    {
     "en": "Ceramics contain many free dislocations that glide easily",
     "ar": "يحتوي السيراميك على انخلاعات حرة كثيرة تنزلق بسهولة",
     "why": {
      "en": "Dislocation glide in ceramics is very difficult at room temperature; that is why they are brittle, not ductile.",
      "ar": "انزلاق الانخلاعات صعب جداً في السيراميك عند درجة حرارة الغرفة؛ ولذلك هو هش لا مطيل."
     }
    },
    {
     "en": "Their bonds are metallic and weak",
     "ar": "روابطها فلزية وضعيفة",
     "why": {
      "en": "Ceramic bonds are ionic/covalent and strong, not metallic.",
      "ar": "روابط السيراميك أيونية/تساهمية وقوية لا فلزية."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Brittle fracture is governed by flaws: the stress at a crack tip is much higher than the average stress, and without plastic deformation to blunt the crack it grows catastrophically. Ceramics are much stronger in compression because cracks tend to close.",
    "ar": "يتحكم في الكسر الهش وجود العيوب: يكون الإجهاد عند رأس الشق أعلى بكثير من المتوسط، ومن دون تشوه لدن يلطّف الرأس ينمو الشق بشكل كارثي. السيراميك أقوى بكثير ضغطاً لأن الشقوق تميل إلى الانغلاق."
   }
  },
  {
   "id": "ms-30",
   "subject": "ms",
   "topic": "strength",
   "level": 3,
   "type": "concept",
   "q": {
    "en": "Why does cold working (e.g. cold rolling) of a metal increase its yield strength while reducing its ductility?",
    "ar": "لماذا يرفع التشغيل على البارد (مثل الدرفلة على البارد) إجهاد خضوع الفلز ويقلّل مطيليته؟"
   },
   "opts": [
    {
     "en": "It changes the crystal structure from FCC to BCC",
     "ar": "يغيّر البنية البلورية من FCC إلى BCC",
     "why": {
      "en": "Cold working changes defect density and grain shape, not the crystal structure.",
      "ar": "يغيّر التشغيل على البارد كثافة العيوب وشكل الحبيبات لا البنية البلورية."
     }
    },
    {
     "en": "It dissolves alloying atoms into the lattice, as in solid-solution strengthening",
     "ar": "يذيب ذرات السبائك في الشبكة كما في التقوية بالمحلول الصلب",
     "why": {
      "en": "Strain hardening needs no alloying atoms; it works in pure metals too and arises from dislocation interactions.",
      "ar": "التقسية بالتشغيل لا تحتاج ذرات سبائك؛ وهي تعمل في الفلزات النقية أيضاً وتنشأ من تفاعل الانخلاعات."
     }
    },
    {
     "en": "Cold working removes dislocations and leaves an almost perfect crystal",
     "ar": "التشغيل على البارد يزيل الانخلاعات ويترك بلورة شبه كاملة",
     "why": {
      "en": "Cold work INCREASES dislocation density (by several orders of magnitude); removing them needs annealing.",
      "ar": "التشغيل على البارد يزيد كثافة الانخلاعات (بعدة رتب)؛ أما إزالتها فتحتاج إلى التخمير."
     }
    },
    {
     "en": "Plastic deformation multiplies dislocations; they tangle and obstruct each other, so a higher stress is needed to keep them moving",
     "ar": "يضاعف التشوه اللدن عدد الانخلاعات فتتشابك وتعيق بعضها بعضاً فيلزم إجهاد أعلى لاستمرار حركتها",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Strain (work) hardening: deformation generates new dislocations, their stress fields interact and pin one another, raising the yield strength but leaving less capacity for further plastic flow (lower %EL). Annealing restores ductility.",
    "ar": "التقسية بالتشغيل: يولّد التشوه انخلاعات جديدة تتداخل حقولها الإجهادية وتثبّت بعضها بعضاً فيرتفع إجهاد الخضوع وتقل قدرة الفلز على مزيد من الانسياب اللدن (انخفاض %EL). ويعيد التخمير المطيلية."
   }
  }
 ]
};
})();
