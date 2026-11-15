/* MechAtlas — Machine Design question bank. Standalone data file; loaded by index.html. */
(function () {
    window.MECHATLAS_QUIZ_BANKS = window.MECHATLAS_QUIZ_BANKS || {};
    window.MECHATLAS_QUIZ_BANKS.md = {
 "id": "md",
 "title": {
  "en": "Machine Design",
  "ar": "تصميم الآلات"
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
  "gears": {
   "en": "Gears",
   "ar": "التروس"
  },
  "fasteners": {
   "en": "Fasteners and joints",
   "ar": "الوصلات والبراغي"
  },
  "shafts": {
   "en": "Shafts and keys",
   "ar": "الأعمدة والخوابير"
  },
  "bearings": {
   "en": "Bearings",
   "ar": "المحامل"
  },
  "fits": {
   "en": "Fits and tolerances",
   "ar": "التوافقات والسماحات"
  },
  "fatigue": {
   "en": "Fatigue and stress concentration",
   "ar": "الكلال وتركّز الإجهاد"
  },
  "springs": {
   "en": "Springs",
   "ar": "النوابض"
  },
  "belts": {
   "en": "Belts and flexible drives",
   "ar": "السيور والنقل المرن"
  },
  "power": {
   "en": "Power, torque and speed",
   "ar": "القدرة والعزم والسرعة"
  },
  "design": {
   "en": "Design factor",
   "ar": "معامل التصميم"
  },
  "flywheel": {
   "en": "Flywheels",
   "ar": "الحدافات"
  }
 },
 "questions": [
  {
   "id": "md-01",
   "subject": "md",
   "topic": "gears",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A spur gear has 40 teeth and module m = 3 mm. What is its pitch-circle diameter?",
    "ar": "ترس مستقيم له 40 سناً وموديوله m = 3 mm. ما قطر دائرة الخطوة؟"
   },
   "opts": [
    {
     "en": "120 mm",
     "ar": "120 mm",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "60 mm",
     "ar": "60 mm",
     "why": {
      "en": "This is the pitch RADIUS; the question asks for the diameter.",
      "ar": "هذا نصف قطر دائرة الخطوة؛ والمطلوب القطر."
     }
    },
    {
     "en": "126 mm",
     "ar": "126 mm",
     "why": {
      "en": "This is the addendum (outside) diameter m(z + 2), not the pitch diameter.",
      "ar": "هذا قطر دائرة الرأس m(z + 2) وليس قطر دائرة الخطوة."
     }
    },
    {
     "en": "13.33 mm",
     "ar": "13.33 mm",
     "why": {
      "en": "The ratio was inverted: m = d / z, so d = m × z.",
      "ar": "قُلبت النسبة: m = d / z فيكون d = m × z."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Module is defined as m = d / z, so d = m z = 3 × 40 = 120 mm.",
    "ar": "الموديول m = d / z إذن d = m z = 3 × 40 = 120 mm."
   }
  },
  {
   "id": "md-02",
   "subject": "md",
   "topic": "gears",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A pinion with 20 teeth at 1500 rpm drives a gear with 60 teeth. What is the gear speed?",
    "ar": "بنيون له 20 سناً يدور 1500 rpm يُدير ترساً له 60 سناً. ما سرعة الترس؟"
   },
   "opts": [
    {
     "en": "37.5 rpm",
     "ar": "37.5 rpm",
     "why": {
      "en": "The speed ratio is a quotient of teeth numbers, not their difference.",
      "ar": "نسبة السرعة هي حاصل قسمة عدد الأسنان لا فرقه."
     }
    },
    {
     "en": "4500 rpm",
     "ar": "4500 rpm",
     "why": {
      "en": "The ratio was inverted. The larger gear turns SLOWER than the pinion.",
      "ar": "قُلبت النسبة. الترس الأكبر يدور أبطأ من البنيون."
     }
    },
    {
     "en": "1500 rpm",
     "ar": "1500 rpm",
     "why": {
      "en": "Gears of different sizes do not turn at the same speed; n1 z1 = n2 z2.",
      "ar": "ترسان مختلفا الحجم لا يدوران بالسرعة نفسها؛ n1 z1 = n2 z2."
     }
    },
    {
     "en": "500 rpm",
     "ar": "500 rpm",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "n2 = n1 × z1 / z2 = 1500 × 20 / 60 = 500 rpm (speed ratio 3:1 reduction).",
    "ar": "n2 = n1 × z1 / z2 = 1500 × 20 / 60 = 500 rpm (تخفيض 3:1)."
   }
  },
  {
   "id": "md-03",
   "subject": "md",
   "topic": "fasteners",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "Why is the tensile stress of a bolt calculated with the \"tensile stress area\" A_t and not with π d²/4 of the nominal (major) diameter?",
    "ar": "لماذا يُحسب إجهاد الشد في البرغي بـ«مساحة إجهاد الشد» A_t وليس بـ π d²/4 للقطر الاسمي (الأكبر)؟"
   },
   "opts": [
    {
     "en": "Because the thread grooves reduce the effective load-carrying area; A_t lies between the minor-diameter and pitch-diameter areas",
     "ar": "لأن أخاديد السنن تقلّل المساحة الحاملة الفعلية؛ وA_t تقع بين مساحة القطر الأصغر ومساحة قطر الخطوة",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Because the nut carries the whole load",
     "ar": "لأن الصامولة تحمل الحمل كله",
     "why": {
      "en": "The nut transfers load to the bolt; the stress in the bolt itself is still tensile over its threaded area.",
      "ar": "الصامولة تنقل الحمل إلى البرغي؛ وإجهاد البرغي نفسه شدّ على مساحته المسنَّنة."
     }
    },
    {
     "en": "Because A_t is always larger than π d²/4, which is safer",
     "ar": "لأن A_t دائماً أكبر من π d²/4 وهذا أكثر أماناً",
     "why": {
      "en": "A_t is SMALLER than the nominal area, so using the nominal area would underestimate the stress.",
      "ar": "A_t أصغر من المساحة الاسمية، فاستعمال الاسمية يقلّل الإجهاد المحسوب بخطأ."
     }
    },
    {
     "en": "Because the bolt head is wider than the shank",
     "ar": "لأن رأس البرغي أعرض من الساق",
     "why": {
      "en": "The head width does not enter the tensile area of the threaded section.",
      "ar": "عرض الرأس لا يدخل في مساحة الشد للجزء المسنَّن."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "The threaded section is weakened by the thread roots, so the stress is computed on A_t, an effective area found from standard tables (about the mean of the pitch and minor diameters).",
    "ar": "القسم المسنَّن يضعفه جذر السنن، فيُحسب الإجهاد على A_t وهي مساحة فعلية من الجداول القياسية (قريبة من متوسط قطر الخطوة والقطر الأصغر)."
   }
  },
  {
   "id": "md-04",
   "subject": "md",
   "topic": "shafts",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "What is the main job of a key between a shaft and a hub (gear, pulley)?",
    "ar": "ما الوظيفة الرئيسية للخابور بين العمود والمحور (ترس، بكرة)؟"
   },
   "opts": [
    {
     "en": "To transmit torque and prevent relative rotation between shaft and hub",
     "ar": "نقل العزم ومنع الدوران النسبي بين العمود والمحور",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "To carry the axial thrust of the shaft",
     "ar": "حمل الدفع المحوري للعمود",
     "why": {
      "en": "Axial location is done by shoulders, collars or retaining rings, not by an ordinary key.",
      "ar": "التثبيت المحوري بالأكتاف أو الأطواق أو حلقات الاحتجاز لا بالخابور العادي."
     }
    },
    {
     "en": "To increase the strength of the shaft",
     "ar": "زيادة متانة العمود",
     "why": {
      "en": "A keyway actually weakens the shaft (stress concentration).",
      "ar": "مجرى الخابور يُضعف العمود فعلياً (تركّز إجهاد)."
     }
    },
    {
     "en": "To lubricate the contact surface",
     "ar": "تزييت سطح التماس",
     "why": {
      "en": "A key has no lubrication function.",
      "ar": "ليس للخابور وظيفة تزييت."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "A key sits half in the shaft keyway and half in the hub keyway; it is loaded in shear (and bearing) and so transmits the torque.",
    "ar": "يجلس الخابور نصفه في مجرى العمود ونصفه في مجرى المحور؛ يتعرض للقص والتحميل السطحي فينقل العزم."
   }
  },
  {
   "id": "md-05",
   "subject": "md",
   "topic": "fits",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "Which of these ISO hole-basis fits is an interference (press) fit?",
    "ar": "أي من هذه التوافقات (أساس الثقب ISO) هو توافق تداخل (كبس)؟"
   },
   "opts": [
    {
     "en": "H7/p6",
     "ar": "H7/p6",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "H11/c11",
     "ar": "H11/c11",
     "why": {
      "en": "c11 gives a large clearance: a loose running fit.",
      "ar": "c11 تعطي خلوصاً كبيراً: توافق دوران فضفاض."
     }
    },
    {
     "en": "H7/h6",
     "ar": "H7/h6",
     "why": {
      "en": "h6 has zero fundamental deviation: a locational clearance fit (minimum clearance zero).",
      "ar": "h6 انحرافها الأساسي صفر: توافق تحديد موضع بخلوص (الخلوص الأدنى صفر)."
     }
    },
    {
     "en": "H7/g6",
     "ar": "H7/g6",
     "why": {
      "en": "g6 gives a small guaranteed clearance (close running/sliding fit).",
      "ar": "g6 تعطي خلوصاً صغيراً مضموناً (توافق انزلاق/دوران قريب)."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "In the hole-basis system H7 is paired with shaft zones. g and h (and c) are clearance; p, s, u are interference (p6 = locational interference, s6 = medium drive, u6 = force fit).",
    "ar": "في نظام أساس الثقب يُقرن H7 بمناطق العمود: g وh وc خلوص؛ وp وs وu تداخل (p6 تحديد موضع بتداخل، s6 كبس متوسط، u6 كبس قوي)."
   }
  },
  {
   "id": "md-06",
   "subject": "md",
   "topic": "design",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A part has a yield strength of 300 MPa and a working stress of 100 MPa. What is the factor of safety against yielding?",
    "ar": "قطعة إجهاد خضوعها 300 MPa وإجهاد التشغيل 100 MPa. ما معامل الأمان ضد الخضوع؟"
   },
   "opts": [
    {
     "en": "3",
     "ar": "3",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "400",
     "ar": "400",
     "why": {
      "en": "Strength and stress are divided, not added.",
      "ar": "تُقسم المقاومة على الإجهاد ولا تُجمعان."
     }
    },
    {
     "en": "200",
     "ar": "200",
     "why": {
      "en": "A factor of safety is a ratio, not a difference, and has no unit.",
      "ar": "معامل الأمان نسبة لا فرق، وبلا وحدة."
     }
    },
    {
     "en": "0.3333",
     "ar": "0.3333",
     "why": {
      "en": "The ratio was inverted: n = strength / stress.",
      "ar": "قُلبت النسبة: n = المقاومة / الإجهاد."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "n = S_y / σ = 300 / 100 = 3.",
    "ar": "n = S_y / σ = 300 / 100 = 3."
   }
  },
  {
   "id": "md-07",
   "subject": "md",
   "topic": "power",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A shaft carries a torque of 50 N·m at 1200 rpm. What power does it transmit?",
    "ar": "عمود ينقل عزماً 50 N·m عند 1200 rpm. ما القدرة المنقولة؟"
   },
   "opts": [
    {
     "en": "60 kW",
     "ar": "60 kW",
     "why": {
      "en": "rpm was used directly as if it were rad/s (P = T n / 1000).",
      "ar": "استُعملت rpm مباشرة كأنها rad/s (P = T n / 1000)."
     }
    },
    {
     "en": "377 kW",
     "ar": "377 kW",
     "why": {
      "en": "rpm was converted with 2π only (rad/min); it must also be divided by 60 to get rad/s.",
      "ar": "حُوّلت rpm بـ2π فقط (rad/min)؛ يجب القسمة على 60 للحصول على rad/s."
     }
    },
    {
     "en": "1 kW",
     "ar": "1 kW",
     "why": {
      "en": "The factor 2π was left out when converting rpm to rad/s.",
      "ar": "سقط العامل 2π عند تحويل rpm إلى rad/s."
     }
    },
    {
     "en": "6.283 kW",
     "ar": "6.283 kW",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "ω = 2π × 1200 / 60 = 125.7 rad/s;  P = T ω = 50 × 125.7 = 6283 W = 6.283 kW.",
    "ar": "ω = 2π × 1200 / 60 = 125.7 rad/s؛ P = T ω = 50 × 125.7 = 6283 W = 6.283 kW."
   }
  },
  {
   "id": "md-08",
   "subject": "md",
   "topic": "belts",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A belt drive has a driver pulley of 100 mm at 1500 rpm and a driven pulley of 250 mm. Neglecting slip, what is the driven speed?",
    "ar": "نقل بسير: بكرة قائدة 100 mm عند 1500 rpm وبكرة مقودة 250 mm. بإهمال الانزلاق، ما سرعة المقودة؟"
   },
   "opts": [
    {
     "en": "1500 rpm",
     "ar": "1500 rpm",
     "why": {
      "en": "The belt has the same linear speed on both pulleys, not the same rpm.",
      "ar": "للسير السرعة الخطية نفسها على البكرتين لا عدد الدورات نفسه."
     }
    },
    {
     "en": "3750 rpm",
     "ar": "3750 rpm",
     "why": {
      "en": "The ratio was inverted: the larger driven pulley turns slower.",
      "ar": "قُلبت النسبة: البكرة المقودة الأكبر تدور أبطأ."
     }
    },
    {
     "en": "600 rpm",
     "ar": "600 rpm",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "1350 rpm",
     "ar": "1350 rpm",
     "why": {
      "en": "Speeds follow the diameter ratio, not the difference of diameters.",
      "ar": "تتبع السرعات نسبة الأقطار لا فرقها."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "Same belt speed: n1 d1 = n2 d2, so n2 = 1500 × 100 / 250 = 600 rpm.",
    "ar": "السرعة الخطية للسير واحدة: n1 d1 = n2 d2 فيكون n2 = 1500 × 100 / 250 = 600 rpm."
   }
  },
  {
   "id": "md-09",
   "subject": "md",
   "topic": "bearings",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "Why can a roller bearing usually carry a heavier radial load than a ball bearing of the same size?",
    "ar": "لماذا يحمل المحمل الأسطواني عادةً حملاً شعاعياً أكبر من محمل كريات بالحجم نفسه؟"
   },
   "opts": [
    {
     "en": "Roller bearings have more rolling elements in every case",
     "ar": "المحمل الأسطواني فيه عناصر دوارة أكثر دائماً",
     "why": {
      "en": "The number of elements is not the main reason; the contact geometry is.",
      "ar": "عدد العناصر ليس السبب الرئيس؛ بل شكل التلامس."
     }
    },
    {
     "en": "Rollers are always made of a much harder steel",
     "ar": "الأسطوانات تُصنع دائماً من فولاذ أشد صلادة بكثير",
     "why": {
      "en": "Both use similar bearing steels; hardness is not the reason.",
      "ar": "كلاهما من فولاذ محامل متشابه؛ والصلادة ليست السبب."
     }
    },
    {
     "en": "Rollers make LINE contact, balls make POINT contact, so the load is spread over a larger area (lower contact stress)",
     "ar": "الأسطوانات تلامس بخط والكريات تلامس بنقطة، فيتوزع الحمل على مساحة أكبر (إجهاد تلامس أقل)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Roller bearings run faster than ball bearings",
     "ar": "المحامل الأسطوانية أسرع من محامل الكريات",
     "why": {
      "en": "Ball bearings generally allow higher speeds (less friction); speed is not related to load capacity here.",
      "ar": "محامل الكريات تسمح عادة بسرعات أعلى (احتكاك أقل)؛ والسرعة لا تفسّر السعة."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "Contact stress (Hertz) is much lower for a line contact than for a point contact at the same load, so rollers have a higher load rating. Balls tolerate higher speed and misalignment better.",
    "ar": "إجهاد التلامس (هيرتز) أقل بكثير في التلامس الخطي منه في النقطي عند الحمل نفسه، لذا سعة الأسطوانات أعلى. أما الكريات فتتحمل سرعة وعدم محاذاة أفضل."
   }
  },
  {
   "id": "md-10",
   "subject": "md",
   "topic": "fasteners",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A double-start screw has a thread pitch of 3 mm. How far does the nut advance in one full turn?",
    "ar": "برغي مزدوج المدخل خطوة سنّه 3 mm. كم يتقدم الصامولة في دورة كاملة؟"
   },
   "opts": [
    {
     "en": "1.5 mm",
     "ar": "1.5 mm",
     "why": {
      "en": "Extra starts increase the lead; they do not reduce it.",
      "ar": "زيادة المداخل تزيد الشوط ولا تقلّله."
     }
    },
    {
     "en": "9 mm",
     "ar": "9 mm",
     "why": {
      "en": "A double-start thread has two starts, not three (lead = 2 × pitch).",
      "ar": "السن المزدوج له مدخلان لا ثلاثة (الشوط = 2 × الخطوة)."
     }
    },
    {
     "en": "3 mm",
     "ar": "3 mm",
     "why": {
      "en": "That is the advance of a single-start thread (lead = pitch).",
      "ar": "هذه إزاحة السن المفرد المدخل (الشوط = الخطوة)."
     }
    },
    {
     "en": "6 mm",
     "ar": "6 mm",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Lead L = (number of starts) × pitch = 2 × 3 = 6 mm per turn.",
    "ar": "الشوط L = (عدد المداخل) × الخطوة = 2 × 3 = 6 mm لكل دورة."
   }
  },
  {
   "id": "md-11",
   "subject": "md",
   "topic": "fasteners",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "An M12 bolt must have a preload of 20 kN. With the torque–tension relation T = K F d and K = 0.2, what tightening torque is needed?",
    "ar": "يجب أن يكون الشدّ الابتدائي لبرغي M12 مقدار 20 kN. بعلاقة T = K F d وK = 0.2، ما عزم الربط اللازم؟"
   },
   "opts": [
    {
     "en": "48000 N·m",
     "ar": "48000 N·m",
     "why": {
      "en": "The product is in N·mm; the diameter in mm was not converted to metres.",
      "ar": "الناتج بـN·mm؛ لم يُحوَّل القطر من mm إلى m."
     }
    },
    {
     "en": "240 N·m",
     "ar": "240 N·m",
     "why": {
      "en": "The nut factor K was left out.",
      "ar": "سقط معامل الصامولة K."
     }
    },
    {
     "en": "9.6 N·m",
     "ar": "9.6 N·m",
     "why": {
      "en": "K was applied twice.",
      "ar": "طُبّق K مرتين."
     }
    },
    {
     "en": "48 N·m",
     "ar": "48 N·m",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "T = K F d = 0.2 × 20000 N × 0.012 m = 48 N·m. (K depends strongly on lubrication and finish, so this is an estimate.)",
    "ar": "T = K F d = 0.2 × 20000 N × 0.012 m = 48 N·m. (K يتأثر كثيراً بالتزييت وحالة السطح فالنتيجة تقدير.)"
   }
  },
  {
   "id": "md-12",
   "subject": "md",
   "topic": "shafts",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A parallel key (width 12 mm, length 50 mm) transmits 300 N·m on a shaft of diameter 40 mm. What is the average shear stress in the key?",
    "ar": "خابور متوازٍ (عرضه 12 mm وطوله 50 mm) ينقل 300 N·m على عمود قطره 40 mm. ما متوسط إجهاد القص في الخابور؟"
   },
   "opts": [
    {
     "en": "0.025 MPa",
     "ar": "0.025 MPa",
     "why": {
      "en": "T was left in N·m while the dimensions are in mm.",
      "ar": "تُرك T بـN·m بينما الأبعاد بـmm."
     }
    },
    {
     "en": "25 MPa",
     "ar": "25 MPa",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "12.5 MPa",
     "ar": "12.5 MPa",
     "why": {
      "en": "F = T / d was used (the diameter taken as the radius); the key force is F = 2T / d.",
      "ar": "استُعملت F = T / d (القطر كأنه نصف القطر)؛ وقوة الخابور F = 2T / d."
     }
    },
    {
     "en": "300 MPa",
     "ar": "300 MPa",
     "why": {
      "en": "The shear area is width × length, not the length alone.",
      "ar": "مساحة القص = العرض × الطول لا الطول وحده."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "F = 2T/d = 2 × 300000 / 40 = 15000 N;  A_shear = w L = 600 mm²;  τ = F / A = 25 MPa.",
    "ar": "F = 2T/d = 2 × 300000 / 40 = 15000 N؛ مساحة القص = w L = 600 mm²؛ τ = F / A = 25 MPa."
   }
  },
  {
   "id": "md-13",
   "subject": "md",
   "topic": "fatigue",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "For a wrought steel with S_ut = 600 MPa, a common first estimate of the endurance limit of a polished rotating-beam specimen is…",
    "ar": "لفولاذ مطاوع S_ut = 600 MPa، التقدير الأولي الشائع لحد التعب لعينة صقيلة بالانحناء الدوّار هو…"
   },
   "opts": [
    {
     "en": "about 0.05 S_ut = 30 MPa",
     "ar": "نحو 0.05 S_ut = 30 MPa",
     "why": {
      "en": "Much too low; typical steels show roughly half of S_ut (for S_ut up to about 1400 MPa).",
      "ar": "منخفض جداً؛ الفولاذ النموذجي نحو نصف S_ut (حتى S_ut ≈ 1400 MPa)."
     }
    },
    {
     "en": "about 2 S_ut = 1200 MPa",
     "ar": "نحو 2 S_ut = 1200 MPa",
     "why": {
      "en": "The endurance limit can never exceed the ultimate strength.",
      "ar": "حد التعب لا يتجاوز أبداً المقاومة القصوى."
     }
    },
    {
     "en": "about 0.5 S_ut ≈ 300 MPa",
     "ar": "نحو 0.5 S_ut ≈ 300 MPa",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "about S_ut = 600 MPa",
     "ar": "نحو S_ut = 600 MPa",
     "why": {
      "en": "Fatigue strength at ~10⁶ cycles is far below the static ultimate strength.",
      "ar": "مقاومة الكلال عند ~10⁶ دورة أقل بكثير من المقاومة القصوى الساكنة."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "For steels S_e′ ≈ 0.5 S_ut up to about 1400 MPa. The real part value is lower after applying surface, size, load, temperature and reliability factors.",
    "ar": "للفولاذ S_e′ ≈ 0.5 S_ut حتى نحو 1400 MPa. والقيمة الفعلية للقطعة أقل بعد تطبيق معاملات السطح والحجم والحمل والحرارة والموثوقية."
   }
  },
  {
   "id": "md-14",
   "subject": "md",
   "topic": "fatigue",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A tension bar carries 12 kN. The net area at a notch is 150 mm² and the theoretical stress concentration factor is K_t = 2.5. What is the maximum local stress at the notch (elastic)?",
    "ar": "قضيب شدّ يحمل 12 kN. المساحة الصافية عند الشق 150 mm² ومعامل تركّز الإجهاد النظري K_t = 2.5. ما أكبر إجهاد موضعي عند الشق (مرن)؟"
   },
   "opts": [
    {
     "en": "200 MPa",
     "ar": "200 MPa",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "80 MPa",
     "ar": "80 MPa",
     "why": {
      "en": "This is the nominal stress; the notch multiplies it by K_t.",
      "ar": "هذا الإجهاد الاسمي؛ والشق يضربه في K_t."
     }
    },
    {
     "en": "32 MPa",
     "ar": "32 MPa",
     "why": {
      "en": "The nominal stress was divided by K_t instead of multiplied.",
      "ar": "قُسم الإجهاد الاسمي على K_t بدل أن يُضرب."
     }
    },
    {
     "en": "82.5 MPa",
     "ar": "82.5 MPa",
     "why": {
      "en": "K_t is a multiplier, not an amount added to the stress.",
      "ar": "K_t مُضاعِف لا قيمة تُضاف للإجهاد."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "σ_nom = F / A = 12000 / 150 = 80 MPa;  σ_max = K_t σ_nom = 2.5 × 80 = 200 MPa.",
    "ar": "σ_nom = F / A = 12000 / 150 = 80 MPa؛ σ_max = K_t σ_nom = 2.5 × 80 = 200 MPa."
   }
  },
  {
   "id": "md-15",
   "subject": "md",
   "topic": "bearings",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A roller bearing has a basic dynamic load rating C = 40 kN and carries an equivalent load P = 10 kN. What is its basic rating life L10 (millions of revolutions)?",
    "ar": "محمل أسطواني سعته الديناميكية C = 40 kN ويحمل حملاً مكافئاً P = 10 kN. ما عمره الأساسي L10 (بملايين الدورات)؟"
   },
   "opts": [
    {
     "en": "64 million rev",
     "ar": "64 million rev",
     "why": {
      "en": "The ball-bearing exponent 3 was used; roller bearings use p = 10/3.",
      "ar": "استُعمل أس محامل الكريات 3؛ والمحامل الأسطوانية p = 10/3."
     }
    },
    {
     "en": "101.6 million rev",
     "ar": "101.6 million rev",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "1.516 million rev",
     "ar": "1.516 million rev",
     "why": {
      "en": "The exponent was inverted (3/10 instead of 10/3).",
      "ar": "قُلب الأس (3/10 بدل 10/3)."
     }
    },
    {
     "en": "4 million rev",
     "ar": "4 million rev",
     "why": {
      "en": "The ratio C/P was not raised to the power p.",
      "ar": "لم تُرفع النسبة C/P إلى الأس p."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "L10 = (C/P)^p with p = 10/3 for roller bearings: (40/10)^(10/3) = 101.6 million revolutions (reliability 90%).",
    "ar": "L10 = (C/P)^p مع p = 10/3 للمحامل الأسطوانية: (40/10)^(10/3) = 101.6 مليون دورة (موثوقية 90%)."
   }
  },
  {
   "id": "md-16",
   "subject": "md",
   "topic": "gears",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A spur gear with pressure angle 20° transmits a tangential force of 2000 N. What is the radial (separating) force on the shaft?",
    "ar": "ترس مستقيم زاوية ضغطه 20° ينقل قوة مماسية 2000 N. ما القوة الشعاعية (الفاصلة) على العمود؟"
   },
   "opts": [
    {
     "en": "5495 N",
     "ar": "5495 N",
     "why": {
      "en": "The ratio was inverted (F_t / tan α).",
      "ar": "قُلبت النسبة (F_t / tan α)."
     }
    },
    {
     "en": "684 N",
     "ar": "684 N",
     "why": {
      "en": "sin α is the radial part of the TOTAL force, not of the tangential force F_t (F_r = F_t tan α).",
      "ar": "sin α جزء من القوة الكلية لا من المماسية F_t (F_r = F_t tan α)."
     }
    },
    {
     "en": "727.9 N",
     "ar": "727.9 N",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "1879 N",
     "ar": "1879 N",
     "why": {
      "en": "cos α was used; the radial component is F_t tan α.",
      "ar": "استُعمل cos α؛ والمركّبة الشعاعية F_t tan α."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "F_r = F_t tan α = 2000 × tan 20° = 727.9 N. (The total tooth force is F_t / cos α = 2128 N.)",
    "ar": "F_r = F_t tan α = 2000 × tan 20° = 727.9 N. (القوة الكلية على السن F_t / cos α = 2128 N.)"
   }
  },
  {
   "id": "md-17",
   "subject": "md",
   "topic": "springs",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "Two springs, 20 N/mm and 30 N/mm, are connected in SERIES (the same force passes through both). What is the combined stiffness?",
    "ar": "نابضان 20 N/mm و30 N/mm موصولان على التوالي (القوة نفسها تمر بكليهما). ما الصلابة المكافئة؟"
   },
   "opts": [
    {
     "en": "50 N/mm",
     "ar": "50 N/mm",
     "why": {
      "en": "This is the PARALLEL combination (stiffnesses add).",
      "ar": "هذا توصيل التوازي (تُجمع الصلابات)."
     }
    },
    {
     "en": "600 N/mm",
     "ar": "600 N/mm",
     "why": {
      "en": "The product k1 k2 must be divided by the sum k1 + k2.",
      "ar": "يجب قسمة الجداء k1 k2 على المجموع k1 + k2."
     }
    },
    {
     "en": "12 N/mm",
     "ar": "12 N/mm",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "25 N/mm",
     "ar": "25 N/mm",
     "why": {
      "en": "An average has no meaning here; for springs in series 1/k = 1/k1 + 1/k2.",
      "ar": "المتوسط لا معنى له هنا؛ في التوالي 1/k = 1/k1 + 1/k2."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "1/k = 1/20 + 1/30 so k = 20×30/(20+30) = 12 N/mm (softer than either spring).",
    "ar": "1/k = 1/20 + 1/30 فيكون k = 20×30/(20+30) = 12 N/mm (أليَن من كل نابض)."
   }
  },
  {
   "id": "md-18",
   "subject": "md",
   "topic": "belts",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A flat belt wraps a pulley by 180° (π rad) with a friction coefficient μ = 0.3. At the point of slip, what is the tension ratio T1 / T2 (capstan equation)?",
    "ar": "سير مسطح يلتف 180° (π rad) على بكرة بمعامل احتكاك μ = 0.3. عند لحظة الانزلاق، ما نسبة الشد T1 / T2 (معادلة الكابستان)؟"
   },
   "opts": [
    {
     "en": "1.942",
     "ar": "1.942",
     "why": {
      "en": "A linear approximation 1 + μθ is not the capstan equation; the growth is exponential.",
      "ar": "التقريب الخطي 1 + μθ ليس معادلة الكابستان؛ فالنمو أسّي."
     }
    },
    {
     "en": "0.9425",
     "ar": "0.9425",
     "why": {
      "en": "This is only the exponent μθ; the ratio is e^(μθ).",
      "ar": "هذا الأس μθ فقط؛ والنسبة e^(μθ)."
     }
    },
    {
     "en": "2.83e23",
     "ar": "2.83e23",
     "why": {
      "en": "The angle was used in degrees (180); it must be in radians (π).",
      "ar": "استُعملت الزاوية بالدرجات (180)؛ يجب أن تكون بالراديان (π)."
     }
    },
    {
     "en": "2.566",
     "ar": "2.566",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "T1 / T2 = e^(μθ) = e^(0.3 × π) = e^0.9425 = 2.566.",
    "ar": "T1 / T2 = e^(μθ) = e^(0.3 × π) = e^0.9425 = 2.566."
   }
  },
  {
   "id": "md-19",
   "subject": "md",
   "topic": "fits",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "Hole: Ø40 with limits +0.025 / 0 mm. Shaft: Ø40 with limits −0.009 / −0.025 mm. What is the MAXIMUM clearance?",
    "ar": "ثقب Ø40 بحدود +0.025 / 0 mm. عمود Ø40 بحدود −0.009 / −0.025 mm. ما أكبر خلوص؟"
   },
   "opts": [
    {
     "en": "0.050 mm",
     "ar": "0.050 mm",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "0.034 mm",
     "ar": "0.034 mm",
     "why": {
      "en": "0.025 + 0.009 mixes a hole limit with the shaft upper limit; the shaft lower limit −0.025 is needed.",
      "ar": "0.025 + 0.009 يخلط حد الثقب بالحد الأعلى للعمود؛ المطلوب الحد الأدنى للعمود −0.025."
     }
    },
    {
     "en": "0.016 mm",
     "ar": "0.016 mm",
     "why": {
      "en": "The upper deviations were subtracted (0.025 − 0.009); the maximum clearance uses the largest hole and the SMALLEST shaft.",
      "ar": "طُرح الانحرافان العلويان (0.025 − 0.009)؛ أكبر خلوص = أكبر ثقب − أصغر عمود."
     }
    },
    {
     "en": "0.009 mm",
     "ar": "0.009 mm",
     "why": {
      "en": "This is the MINIMUM clearance (smallest hole − largest shaft).",
      "ar": "هذا أصغر خلوص (أصغر ثقب − أكبر عمود)."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "C_max = D_max − d_min = (40.025) − (39.975) = 0.050 mm;  C_min = D_min − d_max = 40.000 − 39.991 = 0.009 mm. Both positive, so it is a clearance fit.",
    "ar": "C_max = D_max − d_min = (40.025) − (39.975) = 0.050 mm؛ C_min = D_min − d_max = 40.000 − 39.991 = 0.009 mm. كلاهما موجب فهو توافق خلوص."
   }
  },
  {
   "id": "md-20",
   "subject": "md",
   "topic": "fatigue",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "Compared with the Goodman line, the Soderberg line (which uses the yield strength S_y instead of S_ut) gives…",
    "ar": "مقارنةً بخط غودمان، يعطي خط سودربرغ (الذي يستعمل إجهاد الخضوع S_y بدل S_ut)…"
   },
   "opts": [
    {
     "en": "a less conservative design, since S_y is larger",
     "ar": "تصميماً أقل تحفظاً لأن S_y أكبر",
     "why": {
      "en": "S_y is smaller than S_ut for metals, so the Soderberg line is lower (more conservative).",
      "ar": "S_y أصغر من S_ut في المعادن فخط سودربرغ أدنى (أكثر تحفظاً)."
     }
    },
    {
     "en": "a line that is valid only for brittle materials",
     "ar": "خطاً صالحاً للمواد القصفة فقط",
     "why": {
      "en": "Soderberg and Goodman are both used for ductile materials under fatigue.",
      "ar": "سودربرغ وغودمان يُستعملان للمواد المطيلة تحت الكلال."
     }
    },
    {
     "en": "a more conservative (safer, smaller allowable stress) design",
     "ar": "تصميماً أكثر تحفظاً (أمان أعلى، إجهاد مسموح أصغر)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "the same safety factor as Goodman for every mean stress",
     "ar": "معامل الأمان نفسه كما في غودمان لأي إجهاد متوسط",
     "why": {
      "en": "They agree only when the mean stress is zero (both give S_e); for any positive mean stress Soderberg gives a smaller factor.",
      "ar": "يتفقان فقط عند إجهاد متوسط صفر (كلاهما يعطي S_e)؛ ولأي إجهاد متوسط موجب يعطي سودربرغ معاملاً أصغر."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "Soderberg: σa/S_e + σm/S_y = 1/n; Goodman: σa/S_e + σm/S_ut = 1/n. Because S_y < S_ut, Soderberg predicts a smaller safe region.",
    "ar": "سودربرغ: σa/S_e + σm/S_y = 1/n؛ غودمان: σa/S_e + σm/S_ut = 1/n. وبما أن S_y < S_ut فمنطقة الأمان في سودربرغ أصغر."
   }
  },
  {
   "id": "md-21",
   "subject": "md",
   "topic": "fatigue",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "A ductile part has σa = 80 MPa, σm = 100 MPa, endurance limit S_e = 250 MPa and S_ut = 600 MPa. What is the fatigue factor of safety by the Goodman criterion?",
    "ar": "قطعة مطيلة σa = 80 MPa وσm = 100 MPa وحد التعب S_e = 250 MPa وS_ut = 600 MPa. ما معامل الأمان للكلال بمعيار غودمان؟"
   },
   "opts": [
    {
     "en": "2.055",
     "ar": "2.055",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "6",
     "ar": "6",
     "why": {
      "en": "Only the mean stress was used; the alternating stress also consumes margin.",
      "ar": "استُعمل الإجهاد المتوسط فقط؛ والمتناوب يستهلك جزءاً من الهامش أيضاً."
     }
    },
    {
     "en": "3.125",
     "ar": "3.125",
     "why": {
      "en": "Only the alternating part was used; the mean stress also consumes margin.",
      "ar": "استُعمل الجزء المتناوب فقط؛ والإجهاد المتوسط يستهلك جزءاً من الهامش أيضاً."
     }
    },
    {
     "en": "9.125",
     "ar": "9.125",
     "why": {
      "en": "The factors were added; Goodman adds the stress RATIOS and then inverts: 1/n = σa/S_e + σm/S_ut.",
      "ar": "جُمعت المعاملات؛ غودمان يجمع نِسَب الإجهاد ثم يقلب: 1/n = σa/S_e + σm/S_ut."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "1/n = σa/S_e + σm/S_ut = 80/250 + 100/600 = 0.4867;  n = 2.055.",
    "ar": "1/n = σa/S_e + σm/S_ut = 80/250 + 100/600 = 0.4867؛ n = 2.055."
   }
  },
  {
   "id": "md-22",
   "subject": "md",
   "topic": "fasteners",
   "level": 3,
   "type": "multi",
   "q": {
    "en": "Multi-step problem. A bolted joint has preload F_i = 20 kN, an external tensile load P = 10 kN shared according to the joint constant C = k_b / (k_b + k_m) = 0.25. Answer the three steps (partial credit is given).",
    "ar": "مسألة متعددة الخطوات. وصلة مبرغاة بشدّ ابتدائي F_i = 20 kN وحمل شدّ خارجي P = 10 kN يتوزع وفق ثابت الوصلة C = k_b / (k_b + k_m) = 0.25. أجب عن الخطوات الثلاث (يُمنح تقدير جزئي)."
   },
   "steps": [
    {
     "id": "a",
     "q": {
      "en": "Step 1: What is the total load in the bolt?",
      "ar": "الخطوة 1: ما الحمل الكلي في البرغي؟"
     },
     "opts": [
      {
       "en": "20 kN",
       "ar": "20 kN",
       "why": {
        "en": "This is the preload alone; an external load increases the bolt load.",
        "ar": "هذا الشدّ الابتدائي وحده؛ والحمل الخارجي يزيد حمل البرغي."
       }
      },
      {
       "en": "30 kN",
       "ar": "30 kN",
       "why": {
        "en": "The bolt does not take all of P; only the fraction C P is added to the preload.",
        "ar": "البرغي لا يأخذ كل P؛ فقط الجزء C P يُضاف إلى الشدّ الابتدائي."
       }
      },
      {
       "en": "22.5 kN",
       "ar": "22.5 kN",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "17.5 kN",
       "ar": "17.5 kN",
       "why": {
        "en": "The sign is wrong: the external tension adds to the bolt load.",
        "ar": "الإشارة خاطئة: الشد الخارجي يُضاف إلى حمل البرغي."
       }
      }
     ],
     "ans": 2,
     "exp": {
      "en": "F_b = F_i + C P = 20 + 0.25 × 10 = 22.5 kN.",
      "ar": "F_b = F_i + C P = 20 + 0.25 × 10 = 22.5 kN."
     }
    },
    {
     "id": "b",
     "q": {
      "en": "Step 2: What clamping force remains in the members?",
      "ar": "الخطوة 2: ما قوة الضم المتبقية بين القطع؟"
     },
     "opts": [
      {
       "en": "10 kN",
       "ar": "10 kN",
       "why": {
        "en": "This assumes the members lose the whole P; they lose only (1 − C) P.",
        "ar": "يفترض أن القطع تفقد كل P؛ وهي تفقد (1 − C) P فقط."
       }
      },
      {
       "en": "17.5 kN",
       "ar": "17.5 kN",
       "why": {
        "en": "C P was subtracted; the members unload by (1 − C) P.",
        "ar": "طُرح C P؛ والقطع تُخفَّف بمقدار (1 − C) P."
       }
      },
      {
       "en": "22.5 kN",
       "ar": "22.5 kN",
       "why": {
        "en": "This is the bolt load (step 1), not the clamping force.",
        "ar": "هذا حمل البرغي (الخطوة 1) لا قوة الضم."
       }
      },
      {
       "en": "12.5 kN",
       "ar": "12.5 kN",
       "why": {
        "en": "",
        "ar": ""
       }
      }
     ],
     "ans": 3,
     "exp": {
      "en": "F_m = F_i − (1 − C) P = 20 − 0.75 × 10 = 12.5 kN.",
      "ar": "F_m = F_i − (1 − C) P = 20 − 0.75 × 10 = 12.5 kN."
     }
    },
    {
     "id": "c",
     "q": {
      "en": "Step 3: At what external load P does the joint start to separate (clamping force = 0)?",
      "ar": "الخطوة 3: عند أي حمل خارجي P تبدأ الوصلة بالانفصال (قوة الضم = 0)؟"
     },
     "opts": [
      {
       "en": "30 kN",
       "ar": "30 kN",
       "why": {
        "en": "F_i + P is not related to the separation condition F_m = 0.",
        "ar": "F_i + P لا علاقة له بشرط الانفصال F_m = 0."
       }
      },
      {
       "en": "26.67 kN",
       "ar": "26.67 kN",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "80 kN",
       "ar": "80 kN",
       "why": {
        "en": "The wrong fraction was used: separation needs (1 − C), not C.",
        "ar": "استُعمل الكسر الخطأ: الانفصال يحتاج (1 − C) لا C."
       }
      },
      {
       "en": "20 kN",
       "ar": "20 kN",
       "why": {
        "en": "This would be true only if the bolt took none of the load (C = 0).",
        "ar": "هذا صحيح فقط إن لم يأخذ البرغي أي حمل (C = 0)."
       }
      }
     ],
     "ans": 1,
     "exp": {
      "en": "F_m = 0 gives F_i − (1 − C) P_0 = 0, so P_0 = F_i / (1 − C) = 20 / 0.75 = 26.67 kN.",
      "ar": "F_m = 0 تعطي F_i − (1 − C) P_0 = 0 فيكون P_0 = F_i / (1 − C) = 20 / 0.75 = 26.67 kN."
     }
    }
   ],
   "exp": {
    "en": "Stiff members take most of the external load, so a high preload keeps the bolt load almost constant (good for fatigue) as long as the joint does not separate.",
    "ar": "القطع الصلبة تأخذ معظم الحمل الخارجي، فالشدّ الابتدائي العالي يُبقي حمل البرغي شبه ثابت (جيد للكلال) ما لم تنفصل الوصلة."
   }
  },
  {
   "id": "md-23",
   "subject": "md",
   "topic": "gears",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "For a standard 20° full-depth involute spur gear, theory gives z_min = 2 / sin²α. What is the smallest whole number of teeth that avoids undercutting?",
    "ar": "لترس مستقيم بتوليفة أيفولوتية قياسية بزاوية 20° وعمق كامل، تعطي النظرية z_min = 2 / sin²α. ما أصغر عدد صحيح للأسنان يتفادى القطع السفلي؟"
   },
   "opts": [
    {
     "en": "18 (z_min = 17.1)",
     "ar": "18 (z_min = 17.1)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "17",
     "ar": "17",
     "why": {
      "en": "The theoretical value is 17.1, which is above 17, so 17 teeth still undercut slightly. (17 is often used in practice as an accepted slight undercut.)",
      "ar": "القيمة النظرية 17.1 أكبر من 17 فسن 17 يبقى فيه قطع سفلي طفيف. (يُستعمل 17 عملياً مع قطع مقبول.)"
     }
    },
    {
     "en": "32",
     "ar": "32",
     "why": {
      "en": "This is the value for the old 14.5° pressure angle, not 20°.",
      "ar": "هذه قيمة زاوية الضغط القديمة 14.5° لا 20°."
     }
    },
    {
     "en": "6",
     "ar": "6",
     "why": {
      "en": "sin α was used instead of sin²α.",
      "ar": "استُعمل sin α بدل sin²α."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "sin 20° = 0.342;  sin² 20° = 0.117;  z_min = 2 / 0.117 = 17.1 → 18 teeth. Higher pressure angles allow fewer teeth.",
    "ar": "sin 20° = 0.342؛ sin² 20° = 0.117؛ z_min = 2 / 0.117 = 17.1 ← 18 سناً. زوايا الضغط الأكبر تسمح بأسنان أقل."
   }
  },
  {
   "id": "md-24",
   "subject": "md",
   "topic": "shafts",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "A solid shaft of diameter 30 mm carries a bending moment 150 N·m and a torque 100 N·m (static loading, yield strength 350 MPa). What is the factor of safety by the von Mises (distortion-energy) criterion?",
    "ar": "عمود مصمت قطره 30 mm يحمل عزم انحناء 150 N·m وعزم فتل 100 N·m (حمل ساكن وإجهاد الخضوع 350 MPa). ما معامل الأمان بمعيار فون ميزس (طاقة التشوه)؟"
   },
   "opts": [
    {
     "en": "6.185",
     "ar": "6.185",
     "why": {
      "en": "The torsional shear stress was ignored.",
      "ar": "أُهمل إجهاد القص الناتج عن الفتل."
     }
    },
    {
     "en": "5.356",
     "ar": "5.356",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "5.868",
     "ar": "5.868",
     "why": {
      "en": "√(σ² + τ²) lacks the factor 3 on τ² (that is a different measure, not von Mises).",
      "ar": "الصيغة √(σ² + τ²) ينقصها العامل 3 على τ² (مقياس آخر لا فون ميزس)."
     }
    },
    {
     "en": "4.639",
     "ar": "4.639",
     "why": {
      "en": "The stresses were added directly; they must be combined as √(σ² + 3τ²).",
      "ar": "جُمع الإجهادان مباشرة؛ يجب دمجهما بـ√(σ² + 3τ²)."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "σ = 32 M / (π d³) = 56.59 MPa;  τ = 16 T / (π d³) = 18.86 MPa;  σ′ = √(σ² + 3τ²) = 65.34 MPa;  n = S_y / σ′ = 5.356.",
    "ar": "σ = 32 M / (π d³) = 56.59 MPa؛ τ = 16 T / (π d³) = 18.86 MPa؛ σ′ = √(σ² + 3τ²) = 65.34 MPa؛ n = S_y / σ′ = 5.356."
   }
  },
  {
   "id": "md-25",
   "subject": "md",
   "topic": "bearings",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "A ball bearing (C = 30 kN) carries a radial load F_r = 4 kN and an axial load F_a = 2 kN. For this load ratio the catalogue gives X = 0.56 and Y = 1.6 in P = X F_r + Y F_a. What is L10 in millions of revolutions?",
    "ar": "محمل كريات (C = 30 kN) يحمل حملاً شعاعياً F_r = 4 kN ومحورياً F_a = 2 kN. لهذه النسبة يعطي الكتالوج X = 0.56 وY = 1.6 في P = X F_r + Y F_a. ما L10 بملايين الدورات؟"
   },
   "opts": [
    {
     "en": "421.9 million rev",
     "ar": "421.9 million rev",
     "why": {
      "en": "The axial load was ignored (P = F_r).",
      "ar": "أُهمل الحمل المحوري (P = F_r)."
     }
    },
    {
     "en": "167.7 million rev",
     "ar": "167.7 million rev",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "125 million rev",
     "ar": "125 million rev",
     "why": {
      "en": "The loads were simply added; the catalogue factors X and Y weigh them.",
      "ar": "جُمع الحملان ببساطة؛ والمعاملان X وY في الكتالوج هما اللذان يوزنانهما."
     }
    },
    {
     "en": "63.49 million rev",
     "ar": "63.49 million rev",
     "why": {
      "en": "X and Y were swapped (X belongs to the radial load).",
      "ar": "تبادل X وY (X للحمل الشعاعي)."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "P = X F_r + Y F_a = 0.56×4 + 1.6×2 = 5.44 kN;  L10 = (C/P)³ = (30/5.44)³ = 167.7 million rev.",
    "ar": "P = X F_r + Y F_a = 0.56×4 + 1.6×2 = 5.44 kN؛ L10 = (C/P)³ = (30/5.44)³ = 167.7 مليون دورة."
   }
  },
  {
   "id": "md-26",
   "subject": "md",
   "topic": "fits",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "A hub bore has an interference of 0.04 mm on a Ø50 mm shaft. To slip it on with 0.02 mm of assembly clearance, the hub (α = 12×10⁻⁶ /K) is heated. What temperature rise is needed?",
    "ar": "ثقب محور له تداخل 0.04 mm على عمود Ø50 mm. لإدخاله بخلوص تركيب 0.02 mm يُسخَّن المحور (α = 12×10⁻⁶ /K). ما ارتفاع الحرارة اللازم؟"
   },
   "opts": [
    {
     "en": "200 K",
     "ar": "200 K",
     "why": {
      "en": "The radius was used instead of the diameter; the interference is on the diameter, so ΔD = α D ΔT.",
      "ar": "استُعمل نصف القطر بدل القطر؛ التداخل على القطر فتكون ΔD = α D ΔT."
     }
    },
    {
     "en": "100 K",
     "ar": "100 K",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "66.67 K",
     "ar": "66.67 K",
     "why": {
      "en": "The assembly clearance was forgotten: the bore must grow by interference + clearance.",
      "ar": "نُسي خلوص التركيب: يجب أن يكبر الثقب بمقدار التداخل + الخلوص."
     }
    },
    {
     "en": "33.33 K",
     "ar": "33.33 K",
     "why": {
      "en": "Only the clearance was used; the interference must also be taken up.",
      "ar": "استُعمل الخلوص فقط؛ ويجب استيعاب التداخل أيضاً."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "ΔD = α D ΔT  →  ΔT = (δ + c) / (α D) = (0.04 + 0.02) / (12×10⁻⁶ × 50) = 100 K.",
    "ar": "ΔD = α D ΔT ← ΔT = (δ + c) / (α D) = (0.04 + 0.02) / (12×10⁻⁶ × 50) = 100 K."
   }
  },
  {
   "id": "md-27",
   "subject": "md",
   "topic": "flywheel",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "A machine must absorb an energy fluctuation ΔE = 500 J per cycle with a coefficient of speed fluctuation C_s = 0.05 at a mean speed of 600 rpm. What flywheel inertia I is required (ΔE = C_s I ω²)?",
    "ar": "يجب أن تمتص آلة تذبذب طاقة ΔE = 500 J في الدورة بمعامل تذبذب سرعة C_s = 0.05 عند سرعة وسطية 600 rpm. ما عزم القصور I المطلوب للحدّافة (ΔE = C_s I ω²)؟"
   },
   "opts": [
    {
     "en": "0.02778 kg·m²",
     "ar": "0.02778 kg·m²",
     "why": {
      "en": "The speed in rpm was used as if it were rad/s.",
      "ar": "استُعملت السرعة بـrpm كأنها rad/s."
     }
    },
    {
     "en": "5.066 kg·m²",
     "ar": "5.066 kg·m²",
     "why": {
      "en": "A factor ½ (from kinetic energy) was wrongly inserted: here ΔE = C_s I ω² exactly as stated.",
      "ar": "أُدخل العامل ½ (من الطاقة الحركية) خطأً: هنا ΔE = C_s I ω² كما في النص."
     }
    },
    {
     "en": "2.533 kg·m²",
     "ar": "2.533 kg·m²",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "0.1267 kg·m²",
     "ar": "0.1267 kg·m²",
     "why": {
      "en": "The coefficient of speed fluctuation C_s was left out.",
      "ar": "سقط معامل تذبذب السرعة C_s."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "ω = 2π × 600 / 60 = 62.83 rad/s;  I = ΔE / (C_s ω²) = 500 / (0.05 × 3948) = 2.533 kg·m².",
    "ar": "ω = 2π × 600 / 60 = 62.83 rad/s؛ I = ΔE / (C_s ω²) = 500 / (0.05 × 3948) = 2.533 kg·m²."
   }
  },
  {
   "id": "md-28",
   "subject": "md",
   "topic": "belts",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "A belt runs at 10 m/s with a tight-side tension of 800 N and a slack-side tension of 300 N. What power does it transmit?",
    "ar": "سير يتحرك بسرعة 10 m/s وشدّ الجانب المشدود 800 N والجانب المرتخي 300 N. ما القدرة المنقولة؟"
   },
   "opts": [
    {
     "en": "8 kW",
     "ar": "8 kW",
     "why": {
      "en": "The slack-side tension was ignored; it pulls back against the tight side.",
      "ar": "أُهمل شدّ الجانب المرتخي؛ فهو يسحب عكس الجانب المشدود."
     }
    },
    {
     "en": "5 kW",
     "ar": "5 kW",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "11 kW",
     "ar": "11 kW",
     "why": {
      "en": "The tensions were added; the useful force is their DIFFERENCE (T1 − T2).",
      "ar": "جُمع الشدّان؛ والقوة المفيدة هي فرقهما (T1 − T2)."
     }
    },
    {
     "en": "3 kW",
     "ar": "3 kW",
     "why": {
      "en": "The slack-side tension alone does not transmit the power.",
      "ar": "شدّ الجانب المرتخي وحده لا ينقل القدرة."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "P = (T1 − T2) v = (800 − 300) × 10 = 5000 W = 5 kW.",
    "ar": "P = (T1 − T2) v = (800 − 300) × 10 = 5000 W = 5 kW."
   }
  },
  {
   "id": "md-29",
   "subject": "md",
   "topic": "fatigue",
   "level": 3,
   "type": "concept",
   "q": {
    "en": "Two identical shafts have the same material and diameter. One has a ground surface, the other a hot-rolled (as-forged) surface. Which has the higher endurance limit and why?",
    "ar": "عمودان متطابقان في المادة والقطر؛ سطح الأول مجلّخ وسطح الثاني مدرفل على الساخن. أيهما حد التعب له أعلى ولماذا؟"
   },
   "opts": [
    {
     "en": "Both are equal, because the endurance limit depends only on the material",
     "ar": "متساويان لأن حد التعب يتوقف على المادة فقط",
     "why": {
      "en": "Surface finish is one of the Marin factors that modify the endurance limit.",
      "ar": "حالة السطح أحد معاملات مارين التي تعدّل حد التعب."
     }
    },
    {
     "en": "The ground shaft: a smoother surface has fewer micro-notches, so the surface factor k_a is higher",
     "ar": "العمود المجلّخ: السطح الأنعم فيه شقوق مجهرية أقل فمعامل السطح k_a أعلى",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "The hot-rolled shaft: the rough scale makes it stronger",
     "ar": "العمود المدرفل: القشرة الخشنة تجعله أقوى",
     "why": {
      "en": "Scale and decarburisation of a hot-rolled surface lower the fatigue strength.",
      "ar": "القشرة وفقد الكربون في السطح المدرفل يخفضان مقاومة الكلال."
     }
    },
    {
     "en": "They differ only in yield strength, not in fatigue",
     "ar": "يختلفان في الخضوع فقط لا في الكلال",
     "why": {
      "en": "Fatigue cracks start at the surface, so surface condition matters directly.",
      "ar": "تبدأ شقوق الكلال من السطح فحالة السطح مؤثرة مباشرة."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "S_e = k_a k_b k_c k_d k_e S_e′: surface factor k_a is lower for rougher surfaces (machined < ground < polished, hot-rolled and as-forged lowest). Fatigue cracks usually start at the surface.",
    "ar": "S_e = k_a k_b k_c k_d k_e S_e′: معامل السطح k_a أقل للأسطح الأخشن (مشغّل < مجلّخ < مصقول، والمدرفل على الساخن والمطروق أدناها). وتبدأ شقوق الكلال عادةً من السطح."
   }
  },
  {
   "id": "md-30",
   "subject": "md",
   "topic": "fatigue",
   "level": 3,
   "type": "concept",
   "q": {
    "en": "A shaft rotates at constant speed under a steady (non-rotating) transverse load. What stress cycle does a point on its surface see?",
    "ar": "عمود يدور بسرعة ثابتة تحت حمل عرضي ثابت (غير دوّار). ما دورة الإجهاد التي يراها نقطة على سطحه؟"
   },
   "opts": [
    {
     "en": "A fully reversed bending cycle: mean stress = 0, alternating stress = maximum bending stress",
     "ar": "دورة انحناء متعاكسة كلياً: الإجهاد المتوسط = 0 والمتناوب = أكبر إجهاد انحناء",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "A cycle with a high mean stress equal to the maximum",
     "ar": "دورة بإجهاد متوسط عالٍ يساوي الأقصى",
     "why": {
      "en": "For a rotating shaft with a steady bending moment the mean stress is zero.",
      "ar": "في عمود دوّار بعزم انحناء ثابت يكون الإجهاد المتوسط صفراً."
     }
    },
    {
     "en": "A pulsating cycle from 0 to maximum tension",
     "ar": "دورة نابضة من 0 إلى أعلى شد",
     "why": {
      "en": "The stress goes to compression as well, with equal magnitude, so it is fully reversed, not pulsating.",
      "ar": "يصل الإجهاد إلى الضغط أيضاً بالقيمة نفسها فالدورة متعاكسة كلياً لا نابضة."
     }
    },
    {
     "en": "A constant tensile stress (no cycling)",
     "ar": "إجهاد شدّ ثابت (بلا تذبذب)",
     "why": {
      "en": "The point moves from the tension side to the compression side every revolution, so the stress cycles.",
      "ar": "تنتقل النقطة من جانب الشد إلى جانب الضغط في كل دورة فيتذبذب الإجهاد."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "σ = ±M c / I: a surface point alternates between +σ_max (tension side) and −σ_max (compression side) once per revolution. This is why rotating-beam tests give the endurance limit.",
    "ar": "σ = ±M c / I: تتناوب نقطة السطح بين +σ_max (جانب الشد) و−σ_max (جانب الضغط) مرة كل دورة. ولهذا تعطي اختبارات الانحناء الدوّار حد التعب."
   }
  }
 ]
};
})();
