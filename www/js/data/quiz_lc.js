/* MechAtlas — Lifting and Conveying Machines question bank. Standalone data file; loaded by index.html. */
(function () {
    window.MECHATLAS_QUIZ_BANKS = window.MECHATLAS_QUIZ_BANKS || {};
    window.MECHATLAS_QUIZ_BANKS.lc = {
 "id": "lc",
 "title": {
  "en": "Lifting and Conveying Machines",
  "ar": "آلات الرفع والنقل"
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
  "ropes": {
   "en": "Wire ropes and design factor",
   "ar": "الحبال السلكية ومعامل الأمان"
  },
  "pulleys": {
   "en": "Pulleys and block-and-tackle",
   "ar": "البكرات ونظام البكرات المركّبة"
  },
  "hoist": {
   "en": "Hoist power and efficiency",
   "ar": "قدرة الرافعة وكفاءتها"
  },
  "drums": {
   "en": "Winches and drums",
   "ar": "الونشات والأسطوانات"
  },
  "hooks": {
   "en": "Hooks",
   "ar": "الخطاطيف"
  },
  "brakes": {
   "en": "Hoist brakes",
   "ar": "فرامل الرفع"
  },
  "cranes": {
   "en": "Cranes and stability",
   "ar": "الرافعات والاتزان"
  },
  "belt": {
   "en": "Belt conveyors",
   "ar": "النواقل السيرية"
  },
  "conveyors": {
   "en": "Screw, bucket and chain conveyors",
   "ar": "النواقل اللولبية والدلوية والسلسلية"
  },
  "forklift": {
   "en": "Forklifts",
   "ar": "الرافعات الشوكية"
  },
  "safety": {
   "en": "Lifting safety (WLL, tests)",
   "ar": "سلامة الرفع (الحمل الآمن والاختبار)"
  }
 },
 "questions": [
  {
   "id": "lc-01",
   "subject": "lc",
   "topic": "ropes",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A wire rope has a minimum breaking force (MBS) of 50 kN. A design factor of 5 is assumed (WLL = MBS / design factor). What is the working load limit (WLL)?",
    "ar": "حبل سلكي حمل الانقطاع الأدنى له (MBS) يساوي 50 kN. يُفترض معامل تصميم قدره 5 (WLL = MBS / معامل التصميم). ما الحمل الآمن (WLL)؟"
   },
   "opts": [
    {
     "en": "10 kN",
     "ar": "10 kN",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "45 kN",
     "ar": "45 kN",
     "why": {
      "en": "The factor was subtracted; it is a ratio, not an amount in kN.",
      "ar": "طُرح المعامل؛ إنه نسبة وليس قيمة بوحدة kN."
     }
    },
    {
     "en": "5 kN",
     "ar": "5 kN",
     "why": {
      "en": "A factor of 2 × 5 = 10 was used instead of the stated factor 5.",
      "ar": "استُعمل معامل 2 × 5 = 10 بدل المعامل المذكور 5."
     }
    },
    {
     "en": "250 kN",
     "ar": "250 kN",
     "why": {
      "en": "The MBS was multiplied by the design factor; the factor is a reserve, so the MBS is divided by it.",
      "ar": "ضُرب MBS في معامل التصميم؛ والمعامل احتياطي لذلك يُقسم MBS عليه."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "WLL = MBS / design factor = 50 / 5 = 10 kN. The reserve covers wear, shock, fatigue and unknown effects.",
    "ar": "WLL = MBS / معامل التصميم = 50 / 5 = 10 kN. يغطي الاحتياطي البلى والصدمات والكلال والتأثيرات المجهولة."
   }
  },
  {
   "id": "lc-02",
   "subject": "lc",
   "topic": "pulleys",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "An ideal (frictionless) block and tackle has 4 rope parts supporting the moving block. What pull is needed to hold a 2000 N load in equilibrium?",
    "ar": "نظام بكرات مركّب مثالي (بلا احتكاك) فيه 4 أجزاء حبل تحمل الكتلة المتحركة. ما قوة الشد اللازمة لحفظ حمل 2000 N في حالة اتزان؟"
   },
   "opts": [
    {
     "en": "1500 N",
     "ar": "1500 N",
     "why": {
      "en": "The effort was subtracted from the load; the relation is a division W / n.",
      "ar": "طُرح الجهد من الحمل؛ والعلاقة قسمة W / n."
     }
    },
    {
     "en": "500 N",
     "ar": "500 N",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "8000 N",
     "ar": "8000 N",
     "why": {
      "en": "The load was multiplied by the number of parts; the tackle divides the effort by n.",
      "ar": "ضُرب الحمل في عدد الأجزاء؛ والنظام يقسم الجهد على n."
     }
    },
    {
     "en": "1000 N",
     "ar": "1000 N",
     "why": {
      "en": "Only 2 parts were counted (e.g. two pulleys); the count must be the rope parts that carry the moving block.",
      "ar": "عُدّ جزءان فقط (مثلاً بكرتان)؛ والمطلوب عدد أجزاء الحبل التي تحمل الكتلة المتحركة."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "Ideal tackle: F = W / n = 2000 / 4 = 500 N (mechanical advantage = n).",
    "ar": "النظام المثالي: F = W / n = 2000 / 4 = 500 N (الفائدة الميكانيكية = n)."
   }
  },
  {
   "id": "lc-03",
   "subject": "lc",
   "topic": "pulleys",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "The same tackle has 4 supporting rope parts. How much rope must be hauled in to raise the load by 1.5 m?",
    "ar": "النظام نفسه فيه 4 أجزاء حبل حاملة. كم طول الحبل الذي يجب سحبه لرفع الحمل مسافة 1.5 m؟"
   },
   "opts": [
    {
     "en": "0.375 m",
     "ar": "0.375 m",
     "why": {
      "en": "The ratio was inverted: the rope travels n times the load distance, not 1/n.",
      "ar": "قُلبت النسبة: يقطع الحبل n ضعف مسافة الحمل لا 1/n."
     }
    },
    {
     "en": "1.5 m",
     "ar": "1.5 m",
     "why": {
      "en": "This ignores the mechanical advantage: each rope part must shorten by the full lift height.",
      "ar": "هذا يتجاهل الفائدة الميكانيكية: يجب أن يقصر كل جزء من الحبل بمقدار ارتفاع الرفع كاملاً."
     }
    },
    {
     "en": "6 m",
     "ar": "6 m",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "3 m",
     "ar": "3 m",
     "why": {
      "en": "Only 2 parts were used; with 4 supporting parts the rope travel is 4 × the lift.",
      "ar": "استُعمل جزءان فقط؛ مع 4 أجزاء حاملة يكون سحب الحبل 4 أمثال الرفع."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "Work balance: effort × rope travel = load × lift, so rope travel = n × h = 4 × 1.5 = 6 m. Less effort costs more rope.",
    "ar": "اتزان الشغل: الجهد × طول الحبل = الحمل × الارتفاع، فطول الحبل = n × h = 4 × 1.5 = 6 m. الجهد الأقل يكلف حبلاً أطول."
   }
  },
  {
   "id": "lc-04",
   "subject": "lc",
   "topic": "hoist",
   "level": 1,
   "type": "applied",
   "q": {
    "en": "A hoist lifts a 500 kg load at a constant 0.2 m/s. Take g = 9.81 m/s² and neglect all losses. What is the useful lifting power?",
    "ar": "رافعة ترفع حملاً كتلته 500 kg بسرعة ثابتة 0.2 m/s. خذ g = 9.81 m/s² وأهمل جميع الفواقد. ما قدرة الرفع المفيدة؟"
   },
   "opts": [
    {
     "en": "981 W",
     "ar": "981 W",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "4905 W",
     "ar": "4905 W",
     "why": {
      "en": "This is the weight in newtons; it must be multiplied by the speed to get power.",
      "ar": "هذا هو الوزن بالنيوتن؛ يجب ضربه في السرعة للحصول على القدرة."
     }
    },
    {
     "en": "100 W",
     "ar": "100 W",
     "why": {
      "en": "The weight was replaced by the mass: P = m g v, so g was forgotten.",
      "ar": "استُبدل الوزن بالكتلة: P = m g v فنُسي g."
     }
    },
    {
     "en": "981 kW",
     "ar": "981 kW",
     "why": {
      "en": "Unit slip: 981 is in watts; calling it kW overstates the power by 1000.",
      "ar": "خطأ في الوحدة: القيمة 981 بالواط؛ وتسميتها kW تضخّم القدرة 1000 مرة."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "P = F v = m g v = 500 × 9.81 × 0.2 = 981 W.",
    "ar": "القدرة P = F v = m g v = 500 × 9.81 × 0.2 = 981 W."
   }
  },
  {
   "id": "lc-05",
   "subject": "lc",
   "topic": "brakes",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "When is a worm-gear hoist drive self-locking (the load cannot turn the worm backwards)?",
    "ar": "متى يكون ناقل الحركة الدودي في الرافعة ذاتي القفل (أي لا يستطيع الحمل إدارة الدودة عكسياً)؟"
   },
   "opts": [
    {
     "en": "Whenever the wheel has many more teeth than the worm has starts, whatever the lead angle",
     "ar": "كلما كان عدد أسنان العجلة أكبر بكثير من عدد مداخل الدودة مهما كانت زاوية الميل",
     "why": {
      "en": "The speed ratio alone does not decide; the lead angle compared with the friction angle does.",
      "ar": "نسبة السرعة وحدها لا تحسم ذلك؛ المهم مقارنة زاوية الميل بزاوية الاحتكاك."
     }
    },
    {
     "en": "When the lead angle is larger than the friction angle",
     "ar": "عندما تكون زاوية الميل أكبر من زاوية الاحتكاك",
     "why": {
      "en": "A large lead angle lets the wheel drive the worm (back-driving), so the drive is NOT self-locking.",
      "ar": "زاوية الميل الكبيرة تسمح للعجلة بإدارة الدودة (قيادة عكسية) فلا يكون القفل ذاتياً."
     }
    },
    {
     "en": "When the lead angle is not larger than the friction angle (tan λ ≤ μ); such a drive necessarily has low efficiency",
     "ar": "عندما لا تزيد زاوية الميل (الخطوة) عن زاوية الاحتكاك (tan λ ≤ μ)؛ ومثل هذا الناقل كفاءته منخفضة بالضرورة",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "When the drive efficiency is above 90 %",
     "ar": "عندما تزيد كفاءة الناقل عن 90%",
     "why": {
      "en": "High efficiency means little friction, which is exactly what allows back-driving.",
      "ar": "الكفاءة العالية تعني احتكاكاً قليلاً وهذا ما يسمح بالقيادة العكسية."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "Back-driving is possible only if the axial load can overcome friction. For tan λ ≤ μ friction wins and the drive holds the load, but the same friction wastes power, so efficiency is below 50 %.",
    "ar": "تكون القيادة العكسية ممكنة فقط إذا تغلب الحمل المحوري على الاحتكاك. عند tan λ ≤ μ يغلب الاحتكاك فيحمل الناقل الحمل، لكن الاحتكاك نفسه يبدد القدرة فتقل الكفاءة عن 50%."
   }
  },
  {
   "id": "lc-06",
   "subject": "lc",
   "topic": "cranes",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "What is the main purpose of the counterweight on a tower or jib crane?",
    "ar": "ما الغرض الرئيسي من الثقل الموازن في الرافعة البرجية أو ذات الذراع؟"
   },
   "opts": [
    {
     "en": "To replace the hoist brake when the load is held",
     "ar": "استبدال فرملة الرفع عند تثبيت الحمل",
     "why": {
      "en": "Holding the load in the air is the brake’s job; the counterweight only balances moments about the tipping line.",
      "ar": "تثبيت الحمل في الهواء مهمة الفرملة؛ والثقل الموازن يوازن العزوم حول خط الانقلاب فقط."
     }
    },
    {
     "en": "To raise the design factor of the wire rope",
     "ar": "رفع معامل تصميم الحبل السلكي",
     "why": {
      "en": "The rope design factor depends on rope strength versus rope load; the counterweight does not change it.",
      "ar": "معامل تصميم الحبل يعتمد على متانة الحبل مقابل حمله؛ ولا يغيّره الثقل الموازن."
     }
    },
    {
     "en": "To increase the hoisting speed",
     "ar": "زيادة سرعة الرفع",
     "why": {
      "en": "Hoisting speed is set by the motor, drum and reeving, not by the counterweight.",
      "ar": "سرعة الرفع تحددها المحرك والأسطوانة وترتيب الحبال لا الثقل الموازن."
     }
    },
    {
     "en": "To provide a restoring moment that balances the overturning moment of the load and jib",
     "ar": "توليد عزم استعادة يوازن عزم الانقلاب الناتج عن الحمل والذراع",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "A load far from the tower produces an overturning moment W × r. The counterweight on the opposite side produces a moment in the opposite sense, so the net moment on the foundation stays small.",
    "ar": "الحمل البعيد عن البرج يولد عزم انقلاب W × r. والثقل الموازن في الجهة المقابلة يولد عزماً بعكس الاتجاه فيبقى العزم الصافي على الأساس صغيراً."
   }
  },
  {
   "id": "lc-07",
   "subject": "lc",
   "topic": "belt",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "On a belt conveyor the cross-section of the material is 0.04 m², the belt speed is 2.0 m/s and the bulk density is 1.2 t/m³. What is the mass capacity in t/h?",
    "ar": "على ناقل سيري مساحة مقطع المادة 0.04 m² وسرعة السير 2.0 m/s والكثافة الحجمية 1.2 t/m³. ما السعة الكتلية بوحدة t/h؟"
   },
   "opts": [
    {
     "en": "0.096 t/h",
     "ar": "0.096 t/h",
     "why": {
      "en": "This is in t/s; multiply by 3600 s/h to obtain t/h.",
      "ar": "هذه القيمة بوحدة t/s؛ تُضرب في 3600 s/h للحصول على t/h."
     }
    },
    {
     "en": "345.6 t/h",
     "ar": "345.6 t/h",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "288 t/h",
     "ar": "288 t/h",
     "why": {
      "en": "This is the volume flow in m³/h; it was not multiplied by the density.",
      "ar": "هذا هو التدفق الحجمي بوحدة m³/h؛ ولم يُضرب في الكثافة."
     }
    },
    {
     "en": "5.76 t/h",
     "ar": "5.76 t/h",
     "why": {
      "en": "Minutes were used instead of hours (60 instead of 3600), giving t/min.",
      "ar": "استُعملت الدقائق بدل الساعات (60 بدل 3600) فخرجت النتيجة t/min."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "Q = A v ρ × 3600 = 0.04 × 2.0 × 1.2 × 3600 = 345.6 t/h (volume per second × density × seconds per hour).",
    "ar": "Q = A v ρ × 3600 = 0.04 × 2.0 × 1.2 × 3600 = 345.6 t/h (الحجم في الثانية × الكثافة × عدد الثواني في الساعة)."
   }
  },
  {
   "id": "lc-08",
   "subject": "lc",
   "topic": "forklift",
   "level": 1,
   "type": "applied",
   "q": {
    "en": "A forklift is rated 3000 kg at a load center of 500 mm. Assuming the limiting factor is a constant load moment (weight × load center), what load can it carry when the load center is 700 mm?",
    "ar": "رافعة شوكية سعتها 3000 kg عند مركز حمل 500 mm. بافتراض أن العامل المحدِّد هو عزم حمل ثابت (الوزن × مركز الحمل)، ما الحمل الذي تستطيع رفعه عندما يكون مركز الحمل 700 mm؟"
   },
   "opts": [
    {
     "en": "1531 kg",
     "ar": "1531 kg",
     "why": {
      "en": "The ratio was squared; the moment is linear in the load center.",
      "ar": "رُبعت النسبة؛ العزم خطي بالنسبة لمركز الحمل."
     }
    },
    {
     "en": "2143 kg",
     "ar": "2143 kg",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "2800 kg",
     "ar": "2800 kg",
     "why": {
      "en": "The distance difference in mm was subtracted from the kg rating; the moment is a product, so the capacity scales by a ratio.",
      "ar": "طُرح فرق المسافة بالـ mm من السعة بالـ kg؛ فالعزم حاصل ضرب لذلك تتناسب السعة بنسبة."
     }
    },
    {
     "en": "4200 kg",
     "ar": "4200 kg",
     "why": {
      "en": "The ratio was inverted: a longer load center REDUCES the capacity.",
      "ar": "قُلبت النسبة: مركز الحمل الأبعد يخفّض السعة ولا يرفعها."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "Constant moment: W₁ d₁ = W₂ d₂, so W₂ = 3000 × 500 / 700 = 2143 kg. The rating applies only at the data-plate load center.",
    "ar": "عزم ثابت: W₁ d₁ = W₂ d₂ فيكون W₂ = 3000 × 500 / 700 = 2143 kg. السعة المقدّرة تنطبق فقط عند مركز الحمل المكتوب على لوحة البيانات."
   }
  },
  {
   "id": "lc-09",
   "subject": "lc",
   "topic": "safety",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "A wire rope has MBS = 60 kN and is marked WLL = 12 kN. Which statement is correct?",
    "ar": "حبل سلكي حمل الانقطاع الأدنى له MBS = 60 kN ومكتوب عليه WLL = 12 kN. أي عبارة صحيحة؟"
   },
   "opts": [
    {
     "en": "The rope may be loaded to 60 kN occasionally",
     "ar": "يجوز تحميل الحبل حتى 60 kN أحياناً",
     "why": {
      "en": "MBS is the failure level of a new rope in ideal conditions; the rope must never be used at it.",
      "ar": "MBS هو مستوى انقطاع حبل جديد في ظروف مثالية؛ ولا يجوز استعمال الحبل عنده أبداً."
     }
    },
    {
     "en": "12 kN is the maximum load for normal service; the 5:1 margin covers wear, shock and other unknowns",
     "ar": "12 kN أقصى حمل للخدمة العادية؛ وهامش 5:1 يغطي البلى والصدمات وغيرها من المجهولات",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "WLL is the load at which the rope starts to yield",
     "ar": "WLL هو الحمل الذي يبدأ عنده الحبل بالخضوع",
     "why": {
      "en": "WLL is a permitted service load set by the design factor, not a material yield point.",
      "ar": "WLL حمل خدمة مسموح به يحدده معامل التصميم وليس نقطة خضوع للمادة."
     }
    },
    {
     "en": "The 48 kN difference is spare capacity to use for overloads",
     "ar": "الفرق 48 kN سعة احتياطية تُستخدم للأحمال الزائدة",
     "why": {
      "en": "The margin exists to protect against effects not in the calculation; using it removes the safety.",
      "ar": "الهامش موجود للحماية من تأثيرات غير محسوبة؛ واستعماله يلغي الأمان."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "WLL = MBS / design factor = 60 / 5 = 12 kN. The design factor (here 5:1) is a reserve for wear, corrosion, fatigue and dynamic loads, so the WLL must not be exceeded.",
    "ar": "WLL = MBS / معامل التصميم = 60 / 5 = 12 kN. معامل التصميم (هنا 5:1) احتياطي للبلى والتآكل والكلال والأحمال الديناميكية فلا يجوز تجاوز WLL."
   }
  },
  {
   "id": "lc-10",
   "subject": "lc",
   "topic": "drums",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A winch rope pulls with 5 kN at a drum whose effective diameter (to the rope centre) is 0.4 m. What torque must the drum shaft supply?",
    "ar": "حبل ونش يشد بقوة 5 kN على أسطوانة قطرها الفعّال (حتى محور الحبل) 0.4 m. ما العزم الذي يجب أن يوفره عمود الأسطوانة؟"
   },
   "opts": [
    {
     "en": "1 N·m",
     "ar": "1 N·m",
     "why": {
      "en": "Unit slip: F was left in kN, so the answer is in kN·m (1.0 kN·m = 1000 N·m).",
      "ar": "خطأ وحدة: تُركت F بالـ kN فالجواب بوحدة kN·m (1.0 kN·m = 1000 N·m)."
     }
    },
    {
     "en": "12500 N·m",
     "ar": "12500 N·m",
     "why": {
      "en": "The force was divided by the diameter; torque is force multiplied by the arm.",
      "ar": "قُسمت القوة على القطر؛ والعزم هو القوة مضروبة في الذراع."
     }
    },
    {
     "en": "1000 N·m",
     "ar": "1000 N·m",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "2000 N·m",
     "ar": "2000 N·m",
     "why": {
      "en": "The diameter was used as if it were the radius; torque = F × D / 2.",
      "ar": "استُعمل القطر كأنه نصف القطر؛ العزم = F × D / 2."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "T = F r = F D / 2 = 5000 × 0.4 / 2 = 1000 N·m.",
    "ar": "العزم T = F r = F D / 2 = 5000 × 0.4 / 2 = 1000 N·m."
   }
  },
  {
   "id": "lc-11",
   "subject": "lc",
   "topic": "safety",
   "level": 2,
   "type": "applied",
   "q": {
    "en": "A two-leg sling lifts a 10 kN load. Each leg makes 30° with the vertical and the load is shared equally. What is the tension in each leg?",
    "ar": "حبل رفع بساقين يرفع حملاً مقداره 10 kN. تصنع كل ساق زاوية 30° مع الرأسي ويتوزع الحمل بالتساوي. ما الشد في كل ساق؟"
   },
   "opts": [
    {
     "en": "5.774 kN",
     "ar": "5.774 kN",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "10 kN",
     "ar": "10 kN",
     "why": {
      "en": "Sine was used with the angle from the vertical; the vertical component involves cosine.",
      "ar": "استُعمل الجيب مع الزاوية عن الرأسي؛ والمركبة الرأسية تتضمن جيب التمام."
     }
    },
    {
     "en": "4.33 kN",
     "ar": "4.33 kN",
     "why": {
      "en": "The load was multiplied by cos θ; it must be divided, which makes the tension larger than W/2.",
      "ar": "ضُرب الحمل في cos θ؛ يجب القسمة فيزداد الشد عن W/2."
     }
    },
    {
     "en": "5 kN",
     "ar": "5 kN",
     "why": {
      "en": "This ignores the leg angle; the vertical component of each leg force must be W/2, so the tension is larger.",
      "ar": "هذا يتجاهل زاوية الساق؛ يجب أن تكون المركبة الرأسية لقوة كل ساق W/2 فيكون الشد أكبر."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Vertical equilibrium: 2 T cos θ = W, so T = W / (2 cos 30°) = 5.774 kN. The wider the legs, the larger T.",
    "ar": "اتزان رأسي: 2 T cos θ = W فيكون T = W / (2 cos 30°) = 5.774 kN. كلما اتسع زاوية الساقين زاد الشد."
   }
  },
  {
   "id": "lc-12",
   "subject": "lc",
   "topic": "pulleys",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A block and tackle with 4 supporting parts has an overall efficiency of 85 %. What pull is needed to raise an 8000 N load slowly?",
    "ar": "نظام بكرات مركّب فيه 4 أجزاء حاملة وكفاءته الكلية 85%. ما قوة الشد اللازمة لرفع حمل 8000 N ببطء؟"
   },
   "opts": [
    {
     "en": "1700 N",
     "ar": "1700 N",
     "why": {
      "en": "The efficiency was multiplied; losses make the effort LARGER, so divide by η.",
      "ar": "ضُربت الكفاءة؛ الفواقد تجعل الجهد أكبر لذلك تُقسم على η."
     }
    },
    {
     "en": "2353 N",
     "ar": "2353 N",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "2000 N",
     "ar": "2000 N",
     "why": {
      "en": "This is the ideal effort; friction losses were ignored.",
      "ar": "هذا هو الجهد المثالي؛ أُهملت فواقد الاحتكاك."
     }
    },
    {
     "en": "2300 N",
     "ar": "2300 N",
     "why": {
      "en": "Adding 15 % is not the same as dividing by η = 0.85 (which adds about 17.6 %).",
      "ar": "إضافة 15% لا تساوي القسمة على η = 0.85 (التي تضيف نحو 17.6%)."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "F = W / (n η) = 8000 / (4 × 0.85) = 2353 N.",
    "ar": "قوة الشد F = W / (n η) = 8000 / (4 × 0.85) = 2353 N."
   }
  },
  {
   "id": "lc-13",
   "subject": "lc",
   "topic": "hoist",
   "level": 2,
   "type": "applied",
   "q": {
    "en": "A hoist raises 2000 kg at 0.15 m/s. The overall efficiency from motor to load is 0.8. With g = 9.81 m/s², what motor power is required in kW?",
    "ar": "رافعة ترفع 2000 kg بسرعة 0.15 m/s. الكفاءة الكلية من المحرك إلى الحمل 0.8. بأخذ g = 9.81 m/s²، ما قدرة المحرك المطلوبة بالـ kW؟"
   },
   "opts": [
    {
     "en": "3.679 kW",
     "ar": "3.679 kW",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "2.354 kW",
     "ar": "2.354 kW",
     "why": {
      "en": "The output power was multiplied by η; the input must be larger, so divide by η.",
      "ar": "ضُربت قدرة الخرج في η؛ يجب أن تكون قدرة الدخل أكبر لذلك تُقسم على η."
     }
    },
    {
     "en": "2.943 kW",
     "ar": "2.943 kW",
     "why": {
      "en": "This is the useful output power; the losses (η = 0.8) were not added.",
      "ar": "هذه قدرة الخرج المفيدة؛ لم تُضف الفواقد (η = 0.8)."
     }
    },
    {
     "en": "0.375 kW",
     "ar": "0.375 kW",
     "why": {
      "en": "g was left out; the force to lift is the weight m g, not the mass.",
      "ar": "نُسي g؛ فقوة الرفع هي الوزن m g وليست الكتلة."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "P_motor = m g v / η = 2000 × 9.81 × 0.15 / 0.8 = 3679 W = 3.679 kW.",
    "ar": "قدرة المحرك P = m g v / η = 2000 × 9.81 × 0.15 / 0.8 = 3679 W = 3.679 kW."
   }
  },
  {
   "id": "lc-14",
   "subject": "lc",
   "topic": "brakes",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "Why are hoist holding brakes usually spring-applied and released electrically or hydraulically?",
    "ar": "لماذا تكون فرامل التثبيت في الرافعات عادةً مطبّقة بنابض ومحرَّرة كهربائياً أو هيدروليكياً؟"
   },
   "opts": [
    {
     "en": "Because a spring gives more braking torque than any electromagnet",
     "ar": "لأن النابض يعطي عزم فرملة أكبر من أي مغناطيس كهربائي",
     "why": {
      "en": "Torque depends on the friction radius and clamping force, not on the type of actuator; the reason is fail-safe action.",
      "ar": "العزم يتوقف على نصف قطر الاحتكاك وقوة الضغط لا على نوع المشغّل؛ والسبب هو الأمان الذاتي."
     }
    },
    {
     "en": "To reduce spring wear because springs are only loaded when the hoist runs",
     "ar": "لتقليل بلى النابض لأنه لا يُحمَّل إلا أثناء تشغيل الرافعة",
     "why": {
      "en": "The spring is loaded (compressed) when the brake is released during hoisting; wear is not the design reason.",
      "ar": "يكون النابض مضغوطاً عندما تُحرَّر الفرملة أثناء الرفع؛ وليس البلى سبب التصميم."
     }
    },
    {
     "en": "So that the brake can slip slowly and lower the load during a power failure",
     "ar": "لكي تنزلق الفرملة ببطء وتُنزل الحمل عند انقطاع الكهرباء",
     "why": {
      "en": "A holding brake must hold, not slip; a controlled lowering needs a separate load-lowering device.",
      "ar": "فرملة التثبيت يجب أن تثبّت لا أن تنزلق؛ والإنزال المضبوط يحتاج وسيلة منفصلة."
     }
    },
    {
     "en": "So that the brake closes automatically and holds the load if power or pressure is lost (fail-safe)",
     "ar": "لكي تُطبق الفرملة تلقائياً وتثبّت الحمل عند فقدان الطاقة أو الضغط (أمان ذاتي)",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "If the release signal (power or pressure) fails, the spring force closes the brake. A fail-safe design holds the load in the most likely failure case, loss of supply.",
    "ar": "إذا فُقدت إشارة التحرير (الكهرباء أو الضغط) تُغلق قوة النابض الفرملة. والتصميم الآمن ذاتياً يثبّت الحمل في أرجح حالات العطل وهي فقد التغذية."
   }
  },
  {
   "id": "lc-15",
   "subject": "lc",
   "topic": "belt",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A belt conveyor drive pulley has μ = 0.3 and a wrap angle of 210°. The slack-side tension is T₂ = 4 kN and the belt is about to slip. What is the effective (driving) tension Tₑ = T₁ − T₂?",
    "ar": "بكرة قيادة ناقل سيري فيها μ = 0.3 وزاوية التفاف 210°. شد الجانب المرتخي T₂ = 4 kN والسير على وشك الانزلاق. ما الشد الفعّال (القائد) Tₑ = T₁ − T₂؟"
   },
   "opts": [
    {
     "en": "4.398 kN",
     "ar": "4.398 kN",
     "why": {
      "en": "The exponential was dropped; the capstan law is T₁/T₂ = e^(μθ), not μθ.",
      "ar": "أُسقطت الدالة الأسية؛ قانون الكابستان هو T₁/T₂ = e^(μθ) وليس μθ."
     }
    },
    {
     "en": "12.01 kN",
     "ar": "12.01 kN",
     "why": {
      "en": "This is the tight-side tension T₁, not the effective tension T₁ − T₂.",
      "ar": "هذا شد الجانب المشدود T₁ وليس الشد الفعّال T₁ − T₂."
     }
    },
    {
     "en": "6.265 kN",
     "ar": "6.265 kN",
     "why": {
      "en": "A wrap angle of 180° was used instead of the given 210°.",
      "ar": "استُعملت زاوية التفاف 180° بدل 210° المعطاة."
     }
    },
    {
     "en": "8.011 kN",
     "ar": "8.011 kN",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "θ = 210° = 3.665 rad, e^(μθ) = 3.003. T₁ = 12.01 kN, so Tₑ = T₂ (e^(μθ) − 1) = 8.011 kN.",
    "ar": "θ = 210° = 3.665 rad و e^(μθ) = 3.003. T₁ = 12.01 kN فيكون Tₑ = T₂ (e^(μθ) − 1) = 8.011 kN."
   }
  },
  {
   "id": "lc-16",
   "subject": "lc",
   "topic": "belt",
   "level": 2,
   "type": "applied",
   "q": {
    "en": "A belt conveyor needs an effective tension Tₑ = 5 kN at belt speed 2 m/s. The drive efficiency (motor to pulley) is 90 %. What motor power is needed in kW?",
    "ar": "يحتاج ناقل سيري إلى شد فعّال Tₑ = 5 kN عند سرعة سير 2 m/s. كفاءة الإدارة (من المحرك إلى البكرة) 90%. ما قدرة المحرك المطلوبة بالـ kW؟"
   },
   "opts": [
    {
     "en": "10 kW",
     "ar": "10 kW",
     "why": {
      "en": "This is the power at the pulley; the drive losses were ignored.",
      "ar": "هذه القدرة عند البكرة؛ أُهملت فواقد الإدارة."
     }
    },
    {
     "en": "11.11 kW",
     "ar": "11.11 kW",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "11 kW",
     "ar": "11 kW",
     "why": {
      "en": "Adding 10 % is not dividing by 0.9 (which adds 11.1 %).",
      "ar": "إضافة 10% لا تساوي القسمة على 0.9 (التي تضيف 11.1%)."
     }
    },
    {
     "en": "9 kW",
     "ar": "9 kW",
     "why": {
      "en": "The efficiency was multiplied; the motor must supply MORE than the pulley needs.",
      "ar": "ضُربت الكفاءة؛ يجب أن يوفر المحرك أكثر مما تحتاجه البكرة."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "P = Tₑ v / η = 5 × 2 / 0.9 = 11.11 kW (kN × m/s = kW).",
    "ar": "القدرة P = Tₑ v / η = 5 × 2 / 0.9 = 11.11 kW (kN × m/s = kW)."
   }
  },
  {
   "id": "lc-17",
   "subject": "lc",
   "topic": "cranes",
   "level": 2,
   "type": "applied",
   "q": {
    "en": "A jib crane lifts 5 t with the hook 12 m from the tipping edge. The counterweight acts 4 m from the tipping edge on the opposite side. Ignoring the crane’s own weight and any safety margin, what counterweight mass just balances the load?",
    "ar": "رافعة بذراع ترفع 5 t والخطاف على بعد 12 m من حافة الانقلاب. يؤثر الثقل الموازن على بعد 4 m من حافة الانقلاب في الجهة المقابلة. بإهمال وزن الرافعة نفسها وأي هامش أمان، ما كتلة الثقل الموازن التي توازن الحمل تماماً؟"
   },
   "opts": [
    {
     "en": "60 t",
     "ar": "60 t",
     "why": {
      "en": "This is the moment in t·m, not a mass; it must be divided by the counterweight arm.",
      "ar": "هذا هو العزم بوحدة t·m وليس كتلة؛ يجب قسمته على ذراع الثقل الموازن."
     }
    },
    {
     "en": "1.667 t",
     "ar": "1.667 t",
     "why": {
      "en": "The ratio was inverted; the farther load needs a heavier counterweight, not a lighter one.",
      "ar": "قُلبت النسبة؛ الحمل الأبعد يحتاج ثقلاً موازناً أثقل لا أخف."
     }
    },
    {
     "en": "15 t",
     "ar": "15 t",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "3.75 t",
     "ar": "3.75 t",
     "why": {
      "en": "The two distances were added; both arms are measured from the same tipping edge, so they are not added.",
      "ar": "جُمعت المسافتان؛ كلا الذراعين مقيس من حافة الانقلاب نفسها فلا تُجمعان."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "Moments about the tipping edge: W r = M d, so M = 5 × 12 / 4 = 15 t.",
    "ar": "العزوم حول حافة الانقلاب: W r = M d فيكون M = 5 × 12 / 4 = 15 t."
   }
  },
  {
   "id": "lc-18",
   "subject": "lc",
   "topic": "conveyors",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A screw conveyor has flight diameter 0.25 m, shaft diameter 0.05 m and pitch 0.25 m, and turns at 60 rpm. Assume the material advances one pitch per revolution, the trough is 30 % filled (of the annular volume) and the bulk density is 0.8 t/m³. What is the capacity in t/h?",
    "ar": "ناقل لولبي قطر لولبه 0.25 m وقطر عموده 0.05 m وخطوته 0.25 m ويدور بسرعة 60 rpm. افترض أن المادة تتقدم خطوة واحدة في كل دورة وأن المجرى مملوء بنسبة 30% (من الحجم الحلقي) وأن الكثافة الحجمية 0.8 t/m³. ما السعة بالـ t/h؟"
   },
   "opts": [
    {
     "en": "0.1696 t/h",
     "ar": "0.1696 t/h",
     "why": {
      "en": "The result is per minute (rpm used directly); multiply by 60 min/h.",
      "ar": "النتيجة لكل دقيقة (استُعملت rpm مباشرة)؛ تُضرب في 60 min/h."
     }
    },
    {
     "en": "33.93 t/h",
     "ar": "33.93 t/h",
     "why": {
      "en": "The fill factor was omitted; the trough is only partly full.",
      "ar": "أُهمل معامل التعبئة؛ المجرى مملوء جزئياً فقط."
     }
    },
    {
     "en": "10.18 t/h",
     "ar": "10.18 t/h",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "10.6 t/h",
     "ar": "10.6 t/h",
     "why": {
      "en": "The shaft volume was not subtracted; the material occupies only the annulus between shaft and flight.",
      "ar": "لم يُطرح حجم العمود؛ فالمادة تشغل الحيز الحلقي بين العمود واللولب فقط."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "Volume per rev = π/4 (D² − d²) p = 0.01178 m³. Q = V × n × 60 × fill × ρ = 0.01178 × 60 × 60 × 0.3 × 0.8 = 10.18 t/h.",
    "ar": "الحجم لكل دورة = π/4 (D² − d²) p = 0.01178 m³. Q = V × n × 60 × التعبئة × ρ = 0.01178 × 60 × 60 × 0.3 × 0.8 = 10.18 t/h."
   }
  },
  {
   "id": "lc-19",
   "subject": "lc",
   "topic": "ropes",
   "level": 2,
   "type": "applied",
   "q": {
    "en": "An overhead crane has a rated load of 10000 kg lifted on 4 parts of rope. The OSHA rule 29 CFR 1910.179(h)(2)(i) requires rated load / number of parts ≤ 20 % of the rope’s nominal breaking strength. Take g = 9.81 m/s². What is the minimum nominal breaking strength?",
    "ar": "رافعة جسرية حملها المقدّر 10000 kg مرفوعاً على 4 أجزاء حبل. تشترط قاعدة OSHA رقم 29 CFR 1910.179(h)(2)(i) أن يكون الحمل المقدّر / عدد الأجزاء ≤ 20% من قوة الانقطاع الاسمية للحبل. خذ g = 9.81 m/s². ما أصغر قوة انقطاع اسمية؟"
   },
   "opts": [
    {
     "en": "24.52 kN",
     "ar": "24.52 kN",
     "why": {
      "en": "This is the load per part; the 20 % limit (design factor 5) was not applied.",
      "ar": "هذا هو الحمل لكل جزء؛ لم يُطبَّق حد 20% (معامل التصميم 5)."
     }
    },
    {
     "en": "490.5 kN",
     "ar": "490.5 kN",
     "why": {
      "en": "The load was not divided among the rope parts.",
      "ar": "لم يُقسم الحمل على أجزاء الحبل."
     }
    },
    {
     "en": "12.5 kN",
     "ar": "12.5 kN",
     "why": {
      "en": "g was forgotten: the load on the rope is the weight m g, so the result is 9.81 times too small.",
      "ar": "نُسي g: الحمل على الحبل هو الوزن m g فتخرج القيمة أصغر بـ 9.81 مرة."
     }
    },
    {
     "en": "122.6 kN",
     "ar": "122.6 kN",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Weight = 98.1 kN; per part = 24.52 kN; this is at most 20 % of NBS, so NBS ≥ 24.52 / 0.2 = 122.6 kN (design factor 5).",
    "ar": "الوزن = 98.1 kN؛ الحمل لكل جزء = 24.52 kN؛ وهو لا يتجاوز 20% من NBS فيكون NBS ≥ 24.52 / 0.2 = 122.6 kN (معامل التصميم 5)."
   }
  },
  {
   "id": "lc-20",
   "subject": "lc",
   "topic": "belt",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "Why are belt-conveyor drive pulleys often lagged (covered with rubber or ceramic)?",
    "ar": "لماذا تُغلَّف بكرات قيادة النواقل السيرية غالباً (بالمطاط أو السيراميك)؟"
   },
   "opts": [
    {
     "en": "Lagging raises the friction coefficient μ, so a larger T₁/T₂ = e^(μθ) can be carried without slip",
     "ar": "التغليف يرفع معامل الاحتكاك μ فيمكن نقل نسبة T₁/T₂ = e^(μθ) أكبر دون انزلاق",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Lagging makes the capstan equation inapplicable",
     "ar": "التغليف يجعل معادلة الكابستان غير قابلة للتطبيق",
     "why": {
      "en": "The equation still applies; lagging only changes the value of μ used in it.",
      "ar": "تبقى المعادلة صالحة؛ والتغليف يغيّر قيمة μ المستعملة فيها فقط."
     }
    },
    {
     "en": "Lagging increases the wrap angle to 360°",
     "ar": "التغليف يزيد زاوية الالتفاف إلى 360°",
     "why": {
      "en": "Wrap angle is set by the geometry (snub pulleys, dual drums), not by the surface covering.",
      "ar": "زاوية الالتفاف تحددها الهندسة (بكرات الضغط والأسطوانات المزدوجة) لا غطاء السطح."
     }
    },
    {
     "en": "Lagging lowers μ so the belt can slide freely over the pulley",
     "ar": "التغليف يخفض μ فينزلق السير بحرية على البكرة",
     "why": {
      "en": "A drive pulley must grip the belt; low friction would cause slip and reduce the effective tension.",
      "ar": "بكرة القيادة يجب أن تمسك السير؛ والاحتكاك المنخفض يسبب الانزلاق ويقلل الشد الفعّال."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "The slip limit is T₁/T₂ = e^(μθ). Rubber or ceramic lagging increases μ (the coefficient depends on the lagging), so the same wrap angle transmits a higher effective tension.",
    "ar": "حد الانزلاق هو T₁/T₂ = e^(μθ). التغليف بالمطاط أو السيراميك يرفع μ (فالمعامل يعتمد على التغليف) فتنقل نفس زاوية الالتفاف شداً فعّالاً أكبر."
   }
  },
  {
   "id": "lc-21",
   "subject": "lc",
   "topic": "hoist",
   "level": 3,
   "type": "multi",
   "q": {
    "en": "Multi-step problem. A hoist lifts 3000 kg with a 4-part tackle of overall efficiency 0.9. The drum effective diameter is 0.4 m, g = 9.81 m/s². Assume the design factor 5 is applied to the line pull found in step 1. Answer the three steps (partial credit is given).",
    "ar": "مسألة متعددة الخطوات. رافعة ترفع 3000 kg بنظام بكرات من 4 أجزاء وكفاءته الكلية 0.9. القطر الفعّال للأسطوانة 0.4 m وg = 9.81 m/s². افترض أن معامل التصميم 5 يُطبق على قوة سحب الحبل الناتجة في الخطوة 1. أجب عن الخطوات الثلاث (يُمنح تقدير جزئي)."
   },
   "steps": [
    {
     "id": "a",
     "q": {
      "en": "Step 1: What is the line pull at the drum?",
      "ar": "الخطوة 1: ما قوة سحب الحبل عند الأسطوانة؟"
     },
     "opts": [
      {
       "en": "833.3 N",
       "ar": "833.3 N",
       "why": {
        "en": "The mass was used instead of the weight (g forgotten).",
        "ar": "استُعملت الكتلة بدل الوزن (نُسي g)."
       }
      },
      {
       "en": "8175 N",
       "ar": "8175 N",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "6622 N",
       "ar": "6622 N",
       "why": {
        "en": "The efficiency multiplied instead of dividing; losses increase the pull.",
        "ar": "ضُربت الكفاءة بدل القسمة؛ الفواقد تزيد قوة السحب."
       }
      },
      {
       "en": "7358 N",
       "ar": "7358 N",
       "why": {
        "en": "This is the ideal pull; the efficiency was ignored.",
        "ar": "هذا هو السحب المثالي؛ أُهملت الكفاءة."
       }
      }
     ],
     "ans": 1,
     "exp": {
      "en": "F = m g / (n η) = 3000 × 9.81 / (4 × 0.9) = 8175 N.",
      "ar": "F = m g / (n η) = 3000 × 9.81 / (4 × 0.9) = 8175 N."
     }
    },
    {
     "id": "b",
     "q": {
      "en": "Step 2: What torque is needed on the drum?",
      "ar": "الخطوة 2: ما العزم اللازم على الأسطوانة؟"
     },
     "opts": [
      {
       "en": "5886 N·m",
       "ar": "5886 N·m",
       "why": {
        "en": "The full load weight was used, but the drum carries only the line pull F.",
        "ar": "استُعمل وزن الحمل كاملاً؛ والأسطوانة تحمل قوة السحب F فقط."
       }
      },
      {
       "en": "3270 N·m",
       "ar": "3270 N·m",
       "why": {
        "en": "The diameter was used as the radius.",
        "ar": "استُعمل القطر كنصف قطر."
       }
      },
      {
       "en": "20440 N·m",
       "ar": "20440 N·m",
       "why": {
        "en": "The force was divided by the diameter.",
        "ar": "قُسمت القوة على القطر."
       }
      },
      {
       "en": "1635 N·m",
       "ar": "1635 N·m",
       "why": {
        "en": "",
        "ar": ""
       }
      }
     ],
     "ans": 3,
     "exp": {
      "en": "T = F D / 2 = 8175 × 0.4 / 2 = 1635 N·m.",
      "ar": "T = F D / 2 = 8175 × 0.4 / 2 = 1635 N·m."
     }
    },
    {
     "id": "c",
     "q": {
      "en": "Step 3: What minimum breaking force must the rope have?",
      "ar": "الخطوة 3: ما أصغر قوة انقطاع يجب أن يتحملها الحبل؟"
     },
     "opts": [
      {
       "en": "40.88 kN",
       "ar": "40.88 kN",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "8.175 kN",
       "ar": "8.175 kN",
       "why": {
        "en": "The design factor was not applied.",
        "ar": "لم يُطبَّق معامل التصميم."
       }
      },
      {
       "en": "40880 kN",
       "ar": "40880 kN",
       "why": {
        "en": "Unit slip: the product is in newtons; it was not divided by 1000 to give kN.",
        "ar": "خطأ وحدة: الناتج بالنيوتن ولم يُقسم على 1000 ليصبح kN."
       }
      },
      {
       "en": "1.635 kN",
       "ar": "1.635 kN",
       "why": {
        "en": "The line pull was divided by the design factor; it must be multiplied to get the required breaking force.",
        "ar": "قُسمت قوة السحب على معامل التصميم؛ يجب ضربها للحصول على قوة الانقطاع المطلوبة."
       }
      }
     ],
     "ans": 0,
     "exp": {
      "en": "MBS ≥ 5 × 8175 N = 40.88 kN.",
      "ar": "MBS ≥ 5 × 8175 N = 40.88 kN."
     }
    }
   ],
   "exp": {
    "en": "Efficiency losses raise the line pull; the drum torque follows from the pull and the radius, and the rope is sized by the design factor on the pull.",
    "ar": "الفواقد ترفع قوة سحب الحبل؛ ويُستنتج عزم الأسطوانة من قوة السحب ونصف القطر، ويُحدَّد الحبل بمعامل التصميم المطبّق على قوة السحب."
   }
  },
  {
   "id": "lc-22",
   "subject": "lc",
   "topic": "belt",
   "level": 3,
   "type": "multi",
   "q": {
    "en": "Multi-step problem. A belt conveyor carries 360 t/h up a lift height of 8 m (g = 9.81 m/s²). The power to overcome belt and idler friction is taken as 5 kW, and the drive efficiency is 0.9. Answer the three steps.",
    "ar": "مسألة متعددة الخطوات. ناقل سيري ينقل 360 t/h إلى ارتفاع رفع 8 m (g = 9.81 m/s²). تُؤخذ قدرة التغلب على احتكاك السير والبكرات المساعدة 5 kW وكفاءة الإدارة 0.9. أجب عن الخطوات الثلاث."
   },
   "steps": [
    {
     "id": "a",
     "q": {
      "en": "Step 1: What is the mass flow in kg/s?",
      "ar": "الخطوة 1: ما معدل التدفق الكتلي بالـ kg/s؟"
     },
     "opts": [
      {
       "en": "1296 kg/s",
       "ar": "1296 kg/s",
       "why": {
        "en": "The factor 3.6 was multiplied instead of divided (1 t/h = 1/3.6 kg/s).",
        "ar": "ضُرب العامل 3.6 بدل القسمة (1 t/h = 1/3.6 kg/s)."
       }
      },
      {
       "en": "0.1 kg/s",
       "ar": "0.1 kg/s",
       "why": {
        "en": "This is t/s; multiply by 1000 to get kg/s.",
        "ar": "هذه القيمة بوحدة t/s؛ تُضرب في 1000 للحصول على kg/s."
       }
      },
      {
       "en": "6 kg/s",
       "ar": "6 kg/s",
       "why": {
        "en": "The t/h value was divided by 60 only, and the t → kg conversion was skipped.",
        "ar": "قُسمت قيمة t/h على 60 فقط وأُهمل تحويل t إلى kg."
       }
      },
      {
       "en": "100 kg/s",
       "ar": "100 kg/s",
       "why": {
        "en": "",
        "ar": ""
       }
      }
     ],
     "ans": 3,
     "exp": {
      "en": "ṁ = 360 × 1000 / 3600 = 100 kg/s.",
      "ar": "ṁ = 360 × 1000 / 3600 = 100 kg/s."
     }
    },
    {
     "id": "b",
     "q": {
      "en": "Step 2: What power is needed just to lift the material (kW)?",
      "ar": "الخطوة 2: ما القدرة اللازمة لرفع المادة فقط (kW)؟"
     },
     "opts": [
      {
       "en": "7.848 kW",
       "ar": "7.848 kW",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "28.25 kW",
       "ar": "28.25 kW",
       "why": {
        "en": "The t/h number was used as if it were kg/s.",
        "ar": "استُعمل رقم t/h كأنه kg/s."
       }
      },
      {
       "en": "7848 kW",
       "ar": "7848 kW",
       "why": {
        "en": "Unit slip: the result is in watts; divide by 1000 for kW.",
        "ar": "خطأ وحدة: النتيجة بالواط؛ تُقسم على 1000 لتصبح kW."
       }
      },
      {
       "en": "0.8 kW",
       "ar": "0.8 kW",
       "why": {
        "en": "g was left out of ṁ g H.",
        "ar": "نُسي g في ṁ g H."
       }
      }
     ],
     "ans": 0,
     "exp": {
      "en": "P = ṁ g H = 100 × 9.81 × 8 = 7848 W = 7.848 kW.",
      "ar": "P = ṁ g H = 100 × 9.81 × 8 = 7848 W = 7.848 kW."
     }
    },
    {
     "id": "c",
     "q": {
      "en": "Step 3: What motor power is required in total?",
      "ar": "الخطوة 3: ما قدرة المحرك الكلية المطلوبة؟"
     },
     "opts": [
      {
       "en": "14.28 kW",
       "ar": "14.28 kW",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "12.85 kW",
       "ar": "12.85 kW",
       "why": {
        "en": "The drive efficiency was ignored.",
        "ar": "أُهملت كفاءة الإدارة."
       }
      },
      {
       "en": "8.72 kW",
       "ar": "8.72 kW",
       "why": {
        "en": "The friction power was left out.",
        "ar": "أُهملت قدرة الاحتكاك."
       }
      },
      {
       "en": "11.56 kW",
       "ar": "11.56 kW",
       "why": {
        "en": "The efficiency was multiplied; the motor must supply more than the shaft power.",
        "ar": "ضُربت الكفاءة؛ يجب أن يوفر المحرك أكثر من قدرة العمود."
       }
      }
     ],
     "ans": 0,
     "exp": {
      "en": "P = (P_lift + P_friction) / η = (7.848 + 5) / 0.9 = 14.28 kW.",
      "ar": "P = (P_lift + P_friction) / η = (7.848 + 5) / 0.9 = 14.28 kW."
     }
    }
   ],
   "exp": {
    "en": "Belt power is the sum of the lift power (ṁ g H) and the friction power, divided by the drive efficiency.",
    "ar": "قدرة الناقل مجموع قدرة الرفع (ṁ g H) وقدرة الاحتكاك مقسوماً على كفاءة الإدارة."
   }
  },
  {
   "id": "lc-23",
   "subject": "lc",
   "topic": "belt",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "A belt must transmit an effective tension Tₑ = 9 kN over a drive pulley with μ = 0.25 and a wrap angle of 180°. What is the minimum slack-side tension T₂ to avoid slip?",
    "ar": "يجب أن ينقل سير شداً فعّالاً Tₑ = 9 kN فوق بكرة قيادة فيها μ = 0.25 وزاوية التفاف 180°. ما أقل شد للجانب المرتخي T₂ لتجنب الانزلاق؟"
   },
   "opts": [
    {
     "en": "7.542 kN",
     "ar": "7.542 kN",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "10.74 kN",
     "ar": "10.74 kN",
     "why": {
      "en": "Tₑ was multiplied by (e^(μθ) − 1) instead of divided.",
      "ar": "ضُرب Tₑ في (e^(μθ) − 1) بدل القسمة."
     }
    },
    {
     "en": "11.46 kN",
     "ar": "11.46 kN",
     "why": {
      "en": "The exponential was replaced by μθ.",
      "ar": "استُبدلت الدالة الأسية بالمقدار μθ."
     }
    },
    {
     "en": "4.103 kN",
     "ar": "4.103 kN",
     "why": {
      "en": "Tₑ was divided by e^(μθ); but Tₑ = T₂ (e^(μθ) − 1), so the denominator needs the −1.",
      "ar": "قُسم Tₑ على e^(μθ)؛ لكن Tₑ = T₂ (e^(μθ) − 1) فيجب أن يتضمن المقام الطرح 1."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "e^(μθ) = e^(0.7854) = 2.193. Tₑ = T₂ (e^(μθ) − 1) → T₂ = 9 / 1.193 = 7.542 kN. Lower tension causes slip.",
    "ar": "e^(μθ) = e^(0.7854) = 2.193. Tₑ = T₂ (e^(μθ) − 1) ومنه T₂ = 9 / 1.193 = 7.542 kN. أي شد أقل يسبب الانزلاق."
   }
  },
  {
   "id": "lc-24",
   "subject": "lc",
   "topic": "hoist",
   "level": 3,
   "type": "applied",
   "q": {
    "en": "A 2000 kg load is being LOWERED at 1.0 m/s. The brake stops it uniformly in 0.4 s. With g = 9.81 m/s² and ignoring rope mass, what is the rope force during the stop?",
    "ar": "حمل كتلته 2000 kg يُنزَل بسرعة 1.0 m/s. تُوقفه الفرملة بتباطؤ منتظم خلال 0.4 s. بأخذ g = 9.81 m/s² وإهمال كتلة الحبل، ما قوة الحبل أثناء التوقف؟"
   },
   "opts": [
    {
     "en": "19.62 kN",
     "ar": "19.62 kN",
     "why": {
      "en": "This is the static weight; the deceleration adds m a to the rope force.",
      "ar": "هذا هو الوزن الساكن؛ التباطؤ يضيف m a إلى قوة الحبل."
     }
    },
    {
     "en": "24.62 kN",
     "ar": "24.62 kN",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "5 kN",
     "ar": "5 kN",
     "why": {
      "en": "Only the inertial term m a was taken; the weight must be carried too.",
      "ar": "أُخذ حد القصور m a فقط؛ ويجب حمل الوزن أيضاً."
     }
    },
    {
     "en": "14.62 kN",
     "ar": "14.62 kN",
     "why": {
      "en": "The sign is wrong: when a downward-moving load slows, the acceleration points UP, so the rope force exceeds the weight.",
      "ar": "الإشارة خاطئة: عندما يتباطأ حمل نازل يكون التسارع للأعلى فتزيد قوة الحبل عن الوزن."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "a = v / t = 2.5 m/s² (upwards). Newton: T − m g = m a → T = m (g + a) = 2000 × 12.31 = 24.62 kN. A quick stop loads the rope more than the static weight.",
    "ar": "a = v / t = 2.5 m/s² (للأعلى). نيوتن: T − m g = m a ومنه T = m (g + a) = 2000 × 12.31 = 24.62 kN. التوقف السريع يحمّل الحبل أكثر من الوزن الساكن."
   }
  },
  {
   "id": "lc-25",
   "subject": "lc",
   "topic": "brakes",
   "level": 3,
   "type": "applied",
   "q": {
    "en": "A hoist drum of effective diameter 0.5 m carries a 4000 kg load. A gearbox of ratio 20:1 lies between the motor shaft (where the brake acts) and the drum. When the load drives the gearbox backwards, take the load torque on the motor shaft as (drum torque / ratio) × η with η = 0.9. The brake must hold 1.5 × this torque. With g = 9.81 m/s², what is the required brake torque?",
    "ar": "أسطوانة رافعة قطرها الفعّال 0.5 m تحمل حملاً 4000 kg. بين عمود المحرك (حيث تعمل الفرملة) والأسطوانة علبة تروس نسبتها 20:1. عندما يدير الحمل علبة التروس عكسياً، خذ عزم الحمل على عمود المحرك = (عزم الأسطوانة / النسبة) × η حيث η = 0.9. يجب أن تتحمل الفرملة 1.5 × هذا العزم. بأخذ g = 9.81 m/s²، ما عزم الفرملة المطلوب؟"
   },
   "opts": [
    {
     "en": "1324 N·m",
     "ar": "1324 N·m",
     "why": {
      "en": "The diameter was used instead of the radius for the drum torque.",
      "ar": "استُعمل القطر بدل نصف القطر في عزم الأسطوانة."
     }
    },
    {
     "en": "662.2 N·m",
     "ar": "662.2 N·m",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "441.4 N·m",
     "ar": "441.4 N·m",
     "why": {
      "en": "The brake safety factor 1.5 was not applied.",
      "ar": "لم يُطبَّق معامل أمان الفرملة 1.5."
     }
    },
    {
     "en": "817.5 N·m",
     "ar": "817.5 N·m",
     "why": {
      "en": "η was divided; when the load back-drives the gearbox, losses reduce the torque reaching the brake, so η multiplies.",
      "ar": "قُسمت η؛ عندما يدير الحمل علبة التروس عكسياً تقلل الفواقد العزم الواصل للفرملة فتُضرب η."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "Drum torque = m g D / 2 = 9810 N·m. On the motor shaft: / 20 × 0.9 = 441.4 N·m. With the factor 1.5: 662.2 N·m.",
    "ar": "عزم الأسطوانة = m g D / 2 = 9810 N·m. على عمود المحرك: / 20 × 0.9 = 441.4 N·m. مع المعامل 1.5: 662.2 N·m."
   }
  },
  {
   "id": "lc-26",
   "subject": "lc",
   "topic": "drums",
   "level": 3,
   "type": "concept",
   "q": {
    "en": "A winch drum winds the rope in several layers while the motor torque and speed stay constant. What happens as the layers build up?",
    "ar": "أسطوانة ونش تلف الحبل في عدة طبقات بينما عزم المحرك وسرعته ثابتان. ماذا يحدث مع تراكم الطبقات؟"
   },
   "opts": [
    {
     "en": "The effective drum radius grows, so the rope pull falls (T = F r) and the rope speed rises (v = ω r)",
     "ar": "يزداد نصف القطر الفعّال للأسطوانة فتنخفض قوة سحب الحبل (T = F r) وتزداد سرعته (v = ω r)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "The pull rises and the speed rises, because power increases",
     "ar": "ترتفع القوة والسرعة معاً لأن القدرة تزداد",
     "why": {
      "en": "Power T ω is constant here; force and speed cannot both increase.",
      "ar": "القدرة T ω ثابتة هنا؛ ولا يمكن أن تزداد القوة والسرعة معاً."
     }
    },
    {
     "en": "Both pull and speed stay constant because torque and speed are constant",
     "ar": "تبقى القوة والسرعة ثابتتين لأن العزم والسرعة ثابتان",
     "why": {
      "en": "Torque and angular speed are constant, but force = T / r and linear speed = ω r both depend on the radius.",
      "ar": "العزم والسرعة الزاوية ثابتان لكن القوة = T / r والسرعة الخطية = ω r يعتمدان على نصف القطر."
     }
    },
    {
     "en": "The rope pull rises and the rope speed falls",
     "ar": "ترتفع قوة سحب الحبل وتنخفض سرعته",
     "why": {
      "en": "The opposite: a larger radius means less force for the same torque and more speed for the same ω.",
      "ar": "العكس: نصف القطر الأكبر يعني قوة أقل لنفس العزم وسرعة أكبر لنفس ω."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Each layer adds about one rope diameter to the winding radius r. For constant T and ω: F = T / r decreases and v = ω r increases, so the rated pull must be checked on the outermost layer.",
    "ar": "كل طبقة تضيف نحو قطر حبل إلى نصف قطر اللف r. عند T و ω ثابتين: F = T / r تنقص وv = ω r تزداد، لذلك يجب فحص قوة السحب المقدّرة عند الطبقة الخارجية."
   }
  },
  {
   "id": "lc-27",
   "subject": "lc",
   "topic": "conveyors",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "A bucket elevator has buckets of 4.0 litres each, spaced 0.3 m apart on the chain, moving at 1.2 m/s. Each bucket is filled to 75 % of its volume and the material density is 1.0 t/m³. What is the capacity in t/h?",
    "ar": "مصعد دلاء فيه دلاء سعة كل منها 4.0 لتر على مسافة 0.3 m بين الواحد والآخر على السلسلة وتتحرك بسرعة 1.2 m/s. يُملأ كل دلو بنسبة 75% من حجمه وكثافة المادة 1.0 t/m³. ما السعة بالـ t/h؟"
   },
   "opts": [
    {
     "en": "43.2 t/h",
     "ar": "43.2 t/h",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "0.72 t/h",
     "ar": "0.72 t/h",
     "why": {
      "en": "Minutes were used instead of hours (60 instead of 3600); the result is t/min.",
      "ar": "استُعملت الدقائق بدل الساعات (60 بدل 3600) فالنتيجة t/min."
     }
    },
    {
     "en": "2.7 t/h",
     "ar": "2.7 t/h",
     "why": {
      "en": "The bucket rate was inverted: buckets per second = v / pitch, not pitch / v.",
      "ar": "قُلب معدل الدلاء: عدد الدلاء في الثانية = v / الخطوة وليس الخطوة / v."
     }
    },
    {
     "en": "57.6 t/h",
     "ar": "57.6 t/h",
     "why": {
      "en": "The fill factor was ignored; the buckets are not full.",
      "ar": "أُهمل معامل التعبئة؛ فالدلاء ليست ممتلئة."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Buckets per second = v / pitch = 4. Volume flow = 4 × 0.004 × 0.75 = 0.012 m³/s; × ρ × 3600 = 43.2 t/h.",
    "ar": "عدد الدلاء في الثانية = v / الخطوة = 4. التدفق الحجمي = 4 × 0.004 × 0.75 = 0.012 m³/s؛ × ρ × 3600 = 43.2 t/h."
   }
  },
  {
   "id": "lc-28",
   "subject": "lc",
   "topic": "forklift",
   "level": 3,
   "type": "applied",
   "q": {
    "en": "A forklift of mass 3200 kg has its centre of gravity 0.6 m behind the front-axle tipping line. The load centre is 0.65 m ahead of that line. Considering only static equilibrium about the front axle (no margin, no dynamics), what load mass makes the truck just start to tip forward?",
    "ar": "رافعة شوكية كتلتها 3200 kg ومركز ثقلها خلف خط الانقلاب عند المحور الأمامي بمسافة 0.6 m. ومركز الحمل أمام هذا الخط بمسافة 0.65 m. بالنظر إلى الاتزان الساكن حول المحور الأمامي فقط (دون هامش ودون ديناميكا)، ما كتلة الحمل التي تجعل الرافعة تبدأ بالانقلاب للأمام؟"
   },
   "opts": [
    {
     "en": "3467 kg",
     "ar": "3467 kg",
     "why": {
      "en": "The ratio was inverted: the load’s longer arm must give a SMALLER tipping load.",
      "ar": "قُلبت النسبة: الذراع الأطول للحمل يجب أن يعطي حملاً انقلابياً أصغر."
     }
    },
    {
     "en": "1248 kg",
     "ar": "1248 kg",
     "why": {
      "en": "The two distances were multiplied; moments are mass × ONE distance, and the equation must be solved for the load.",
      "ar": "ضُربت المسافتان؛ العزم كتلة × مسافة واحدة والمعادلة تُحل لإيجاد الحمل."
     }
    },
    {
     "en": "3200 kg",
     "ar": "3200 kg",
     "why": {
      "en": "Equal masses would balance only if both arms were equal; here the arms differ.",
      "ar": "تتساوى الكتلتان في الاتزان فقط إن تساوى الذراعان؛ وهنا الذراعان مختلفان."
     }
    },
    {
     "en": "2954 kg",
     "ar": "2954 kg",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Tipping moment = restoring moment: L × 0.65 = 3200 × 0.6 → L = 2954 kg. The rated load is far below this because of the stability margin and dynamic effects.",
    "ar": "عزم الانقلاب = عزم الاستعادة: L × 0.65 = 3200 × 0.6 ومنه L = 2954 kg. السعة المقدّرة أقل بكثير من ذلك بسبب هامش الاتزان والتأثيرات الديناميكية."
   }
  },
  {
   "id": "lc-29",
   "subject": "lc",
   "topic": "safety",
   "level": 3,
   "type": "applied",
   "q": {
    "en": "An overhead crane of rated load 8 t (rope of 4 parts) is proof-tested at the maximum test load permitted by 29 CFR 1910.179(k)(2), i.e. 125 % of the rated load. With g = 9.81 m/s² and equal sharing, what is the rope force per part during the test?",
    "ar": "تُختبر رافعة جسرية حملها المقدّر 8 t (حبلها من 4 أجزاء) عند أقصى حمل اختبار تسمح به 29 CFR 1910.179(k)(2) أي 125% من الحمل المقدّر. بأخذ g = 9.81 m/s² وتوزع متساوٍ، ما قوة الحبل في كل جزء أثناء الاختبار؟"
   },
   "opts": [
    {
     "en": "19.62 kN",
     "ar": "19.62 kN",
     "why": {
      "en": "The 125 % test factor was not applied.",
      "ar": "لم يُطبَّق معامل الاختبار 125%."
     }
    },
    {
     "en": "15.7 kN",
     "ar": "15.7 kN",
     "why": {
      "en": "The rated load was divided by 1.25; the test load is 1.25 times larger.",
      "ar": "قُسم الحمل المقدّر على 1.25؛ بينما حمل الاختبار أكبر بمقدار 1.25 مرة."
     }
    },
    {
     "en": "24.53 kN",
     "ar": "24.53 kN",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "98.1 kN",
     "ar": "98.1 kN",
     "why": {
      "en": "The total test weight was not divided among the rope parts.",
      "ar": "لم يُقسم وزن الاختبار الكلي على أجزاء الحبل."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "Test load = 1.25 × 8 = 10 t = 98.1 kN; per part = 98.1 / 4 = 24.53 kN.",
    "ar": "حمل الاختبار = 1.25 × 8 = 10 t = 98.1 kN؛ لكل جزء = 98.1 / 4 = 24.53 kN."
   }
  },
  {
   "id": "lc-30",
   "subject": "lc",
   "topic": "hooks",
   "level": 3,
   "type": "concept",
   "q": {
    "en": "A crane hook loaded in its bowl acts like a curved beam at the critical section. Where is the peak tensile stress usually found?",
    "ar": "خطّاف رافعة محمَّل في تجويفه يعمل كعتبة منحنية عند المقطع الحرج. أين يقع عادةً أعلى إجهاد شدّ؟"
   },
   "opts": [
    {
     "en": "At the inner fibre of the section (the side nearest the bowl’s centre of curvature), where direct tension and bending tension add",
     "ar": "عند الليف الداخلي للمقطع (الأقرب لمركز انحناء التجويف) حيث يجتمع الشد المباشر مع شد الانحناء",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "At the outer fibre, which is in compression and is the weakest",
     "ar": "عند الليف الخارجي الذي يكون مضغوطاً وهو الأضعف",
     "why": {
      "en": "The bending moment opens the hook, so the outer fibre sees compression from bending, which reduces its net tension.",
      "ar": "عزم الانحناء يفتح الخطّاف فيتعرض الليف الخارجي لضغط ناتج عن الانحناء ما يخفض الشد الصافي فيه."
     }
    },
    {
     "en": "Exactly at the centroid, as in a straight beam under tension only",
     "ar": "عند المركز بالضبط كما في عتبة مستقيمة تحت الشد فقط",
     "why": {
      "en": "The section is bent as well as pulled; for a curved beam the neutral axis is shifted and the stress varies across the section.",
      "ar": "المقطع مسحوب ومنحنٍ معاً؛ وفي العتبة المنحنية يزاح المحور المحايد ويتغير الإجهاد عبر المقطع."
     }
    },
    {
     "en": "At the tip of the hook, where the latch is attached",
     "ar": "عند طرف الخطّاف حيث يُركب المزلاج",
     "why": {
      "en": "The latch carries no load; the tip is lightly stressed compared with the throat section.",
      "ar": "المزلاج لا يحمل حملاً؛ والطرف قليل الإجهاد مقارنة بمقطع عنق الخطّاف."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "The load line passes outside the section centroid, so the section carries direct tension plus a bending moment that tends to straighten the hook. In a curved beam the stress is highest at the inner (concave) fibre, which is why hooks are made thickest at the inner side.",
    "ar": "خط الحمل يمر خارج مركز ثقل المقطع فيحمل المقطع شداً مباشراً وعزم انحناء يميل إلى فتح الخطّاف. وفي العتبة المنحنية يكون الإجهاد أعلى ما يمكن عند الليف الداخلي (المقعّر) ولهذا يُصنع الخطّاف أثخن من الجهة الداخلية."
   }
  }
 ]
};
})();
