/* MechAtlas — Thermodynamics question bank. Standalone data file; loaded by index.html. */
(function () {
    window.MECHATLAS_QUIZ_BANKS = window.MECHATLAS_QUIZ_BANKS || {};
    window.MECHATLAS_QUIZ_BANKS.th = {
 "id": "th",
 "title": {
  "en": "Thermodynamics",
  "ar": "الديناميكا الحرارية"
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
  "firstlaw": {
   "en": "First law and energy balance",
   "ar": "القانون الأول وميزان الطاقة"
  },
  "idealgas": {
   "en": "Ideal gas law",
   "ar": "قانون الغاز المثالي"
  },
  "processes": {
   "en": "Gas processes",
   "ar": "عمليات الغازات"
  },
  "secondlaw": {
   "en": "Second law and Carnot",
   "ar": "القانون الثاني وكارنو"
  },
  "entropy": {
   "en": "Entropy",
   "ar": "الإنتروبيا"
  },
  "cycles": {
   "en": "Power cycles",
   "ar": "دورات القدرة"
  },
  "refrig": {
   "en": "Refrigeration and heat pumps",
   "ar": "التبريد والمضخات الحرارية"
  },
  "steam": {
   "en": "Steam and Rankine cycle",
   "ar": "البخار ودورة رانكين"
  },
  "heattransfer": {
   "en": "Heat transfer",
   "ar": "انتقال الحرارة"
  },
  "enthalpy": {
   "en": "Enthalpy and specific heats",
   "ar": "الإنثالبي والحرارة النوعية"
  }
 },
 "questions": [
  {
   "id": "th-01",
   "subject": "th",
   "topic": "firstlaw",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A closed system receives 500 J of heat and does 200 J of work on its surroundings. What is the change in its internal energy?",
    "ar": "نظام مغلق يستقبل حرارة 500 J ويبذل شغلاً مقداره 200 J على محيطه. ما التغير في طاقته الداخلية؟"
   },
   "opts": [
    {
     "en": "500 J",
     "ar": "500 J",
     "why": {
      "en": "The work output was ignored; part of the heat leaves as work and does not raise the internal energy.",
      "ar": "أُهمل الشغل الخارج؛ فجزء من الحرارة يخرج على شكل شغل ولا يرفع الطاقة الداخلية."
     }
    },
    {
     "en": "-300 J",
     "ar": "-300 J",
     "why": {
      "en": "The terms were reversed (sign error): ΔU = Q − W, not W − Q.",
      "ar": "انعكس ترتيب الحدين (خطأ إشارة): ΔU = Q − W وليس W − Q."
     }
    },
    {
     "en": "300 J",
     "ar": "300 J",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "700 J",
     "ar": "700 J",
     "why": {
      "en": "The work was added; work done BY the system leaves it, so it is subtracted (ΔU = Q − W).",
      "ar": "جُمع الشغل؛ فالشغل المبذول من النظام يخرج منه ويُطرح (ΔU = Q − W)."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "First law for a closed system: ΔU = Q − W = 500 − 200 = 300 J (heat in positive, work done by the system positive).",
    "ar": "القانون الأول للنظام المغلق: ΔU = Q − W = 500 − 200 = 300 J (الحرارة الداخلة موجبة والشغل المبذول من النظام موجب)."
   }
  },
  {
   "id": "th-02",
   "subject": "th",
   "topic": "idealgas",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "2 mol of an ideal gas is at 300 K and 100 kPa. Using R = 8.314 J/(mol·K), what volume does it occupy?",
    "ar": "2 mol من غاز مثالي عند 300 K وضغط 100 kPa. باستعمال R = 8.314 J/(mol·K)، ما الحجم الذي يشغله؟"
   },
   "opts": [
    {
     "en": "0.04988 m³",
     "ar": "0.04988 m³",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "0.00449 m³",
     "ar": "0.00449 m³",
     "why": {
      "en": "The temperature was converted to °C; the gas law needs absolute temperature (K).",
      "ar": "حُوّلت الحرارة إلى °C؛ قانون الغاز يتطلب درجة حرارة مطلقة (K)."
     }
    },
    {
     "en": "0.02494 m³",
     "ar": "0.02494 m³",
     "why": {
      "en": "The number of moles was left out: V = n R T / P.",
      "ar": "سقط عدد المولات: V = n R T / P."
     }
    },
    {
     "en": "49.88 m³",
     "ar": "49.88 m³",
     "why": {
      "en": "Pressure was entered in kPa without converting to Pa (a factor of 1000 error).",
      "ar": "أُدخل الضغط بـ kPa دون تحويله إلى Pa (خطأ بعامل 1000)."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "P V = n R T → V = n R T / P = 2 × 8.314 × 300 / 100000 = 0.04988 m³.",
    "ar": "P V = n R T ← V = n R T / P = 2 × 8.314 × 300 / 100000 = 0.04988 m³."
   }
  },
  {
   "id": "th-03",
   "subject": "th",
   "topic": "secondlaw",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A Carnot engine operates between reservoirs at 527 °C and 27 °C (use T(K) = T(°C) + 273). What is its thermal efficiency?",
    "ar": "محرك كارنو يعمل بين مستودعين عند 527 °C و27 °C (استعمل T(K) = T(°C) + 273). ما كفاءته الحرارية؟"
   },
   "opts": [
    {
     "en": "166.7 %",
     "ar": "166.7 %",
     "why": {
      "en": "The temperature difference was divided by T_c; the correct denominator is T_h, and efficiency can never exceed 100%.",
      "ar": "قُسم فرق الحرارة على T_c؛ والمقام الصحيح T_h، ولا يمكن للكفاءة أن تتجاوز 100%."
     }
    },
    {
     "en": "62.5 %",
     "ar": "62.5 %",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "37.5 %",
     "ar": "37.5 %",
     "why": {
      "en": "This is T_c / T_h; the efficiency is 1 − T_c / T_h.",
      "ar": "هذه T_c / T_h؛ والكفاءة هي 1 − T_c / T_h."
     }
    },
    {
     "en": "94.88 %",
     "ar": "94.88 %",
     "why": {
      "en": "Celsius temperatures were used; Carnot efficiency needs absolute temperatures.",
      "ar": "استُعملت درجات سيلزيوس؛ كفاءة كارنو تتطلب درجات حرارة مطلقة."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "T_h = 800 K, T_c = 300 K; η = 1 − T_c / T_h = 1 − 300/800 = 0.625 = 62.5 %.",
    "ar": "T_h = 800 K وT_c = 300 K؛ η = 1 − T_c / T_h = 1 − 300/800 = 0.625 = 62.5 %."
   }
  },
  {
   "id": "th-04",
   "subject": "th",
   "topic": "secondlaw",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "Which statement correctly expresses the Kelvin–Planck form of the second law?",
    "ar": "أي عبارة تعبّر بشكل صحيح عن صيغة كلفن–بلانك للقانون الثاني؟"
   },
   "opts": [
    {
     "en": "A heat engine can reach 100% efficiency if friction is eliminated",
     "ar": "يمكن لمحرك حراري أن يبلغ كفاءة 100% إذا أُزيل الاحتكاك",
     "why": {
      "en": "Even a frictionless, reversible engine is limited by 1 − T_c / T_h < 1; the limit is not about friction.",
      "ar": "حتى المحرك العكوس الخالي من الاحتكاك محدود بـ 1 − T_c / T_h < 1؛ فالحد لا علاقة له بالاحتكاك."
     }
    },
    {
     "en": "It follows from the first law alone",
     "ar": "ينتج عن القانون الأول وحده",
     "why": {
      "en": "The first law would allow 100% conversion; a separate law (the second) is needed to forbid it.",
      "ar": "القانون الأول يسمح بتحويل كامل؛ ويلزم قانون مستقل (الثاني) لمنعه."
     }
    },
    {
     "en": "Energy is destroyed whenever heat is converted to work",
     "ar": "تُفنى الطاقة كلما تحولت الحرارة إلى شغل",
     "why": {
      "en": "Energy is conserved (first law); the second law restricts the DIRECTION and completeness of conversion, not the total energy.",
      "ar": "الطاقة محفوظة (القانون الأول)؛ والقانون الثاني يقيّد اتجاه التحويل واكتماله لا مجموع الطاقة."
     }
    },
    {
     "en": "No device operating in a cycle can receive heat from a single reservoir and convert all of it into work",
     "ar": "لا يمكن لأي جهاز يعمل في دورة أن يستقبل حرارة من مستودع واحد ويحوّلها كلها إلى شغل",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Part of the heat taken from the hot reservoir must be rejected to a colder sink, so η < 1 for any cyclic heat engine.",
    "ar": "يجب أن يُطرح جزء من الحرارة المأخوذة من المستودع الساخن إلى مصرف أبرد، لذا η < 1 لأي محرك حراري دوري."
   }
  },
  {
   "id": "th-05",
   "subject": "th",
   "topic": "enthalpy",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "How is the specific enthalpy h of a simple compressible substance defined?",
    "ar": "كيف تُعرَّف الإنثالبي النوعية h لمادة بسيطة قابلة للانضغاط؟"
   },
   "opts": [
    {
     "en": "h = u − T s",
     "ar": "h = u − T s",
     "why": {
      "en": "u − T s is the Helmholtz function, a different property.",
      "ar": "u − T s هي دالة هلمهولتز، وهي خاصية مختلفة."
     }
    },
    {
     "en": "h = u + P v",
     "ar": "h = u + P v",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "h = P v",
     "ar": "h = P v",
     "why": {
      "en": "P v is only the flow-work part; the internal energy u is also part of h.",
      "ar": "P v هو جزء شغل الجريان فقط؛ والطاقة الداخلية u جزء من h أيضاً."
     }
    },
    {
     "en": "h = u − P v",
     "ar": "h = u − P v",
     "why": {
      "en": "The sign is wrong: the flow-work term P v is added to the internal energy.",
      "ar": "الإشارة خاطئة: يُضاف حد شغل الجريان P v إلى الطاقة الداخلية."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "h = u + P v. For an open system the term P v is the flow work needed to push the fluid across the boundary.",
    "ar": "h = u + P v. في النظام المفتوح يمثل الحد P v شغل الجريان اللازم لدفع المائع عبر الحدود."
   }
  },
  {
   "id": "th-06",
   "subject": "th",
   "topic": "processes",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A gas expands at a constant pressure of 200 kPa from 0.1 m³ to 0.3 m³. How much boundary work does it do?",
    "ar": "يتمدد غاز عند ضغط ثابت 200 kPa من 0.1 m³ إلى 0.3 m³. كم الشغل الحدودي الذي يبذله؟"
   },
   "opts": [
    {
     "en": "20 kJ",
     "ar": "20 kJ",
     "why": {
      "en": "The initial volume was used instead of the change in volume.",
      "ar": "استُعمل الحجم الابتدائي بدل التغير في الحجم."
     }
    },
    {
     "en": "40 kJ",
     "ar": "40 kJ",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "60 kJ",
     "ar": "60 kJ",
     "why": {
      "en": "The final volume was used instead of the CHANGE in volume.",
      "ar": "استُعمل الحجم النهائي بدل التغير في الحجم."
     }
    },
    {
     "en": "80 kJ",
     "ar": "80 kJ",
     "why": {
      "en": "The volumes were added; work is P (V2 − V1).",
      "ar": "جُمع الحجمان؛ والشغل هو P (V2 − V1)."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "W = P (V2 − V1) = 200 × (0.3 − 0.1) = 40 kJ (kPa × m³ = kJ).",
    "ar": "W = P (V2 − V1) = 200 × (0.3 − 0.1) = 40 kJ (kPa × m³ = kJ)."
   }
  },
  {
   "id": "th-07",
   "subject": "th",
   "topic": "heattransfer",
   "level": 1,
   "type": "applied",
   "q": {
    "en": "A wall of area 10 m² and thickness 0.2 m has thermal conductivity k = 0.8 W/(m·K). The temperature difference across it is 20 K. What is the steady conduction heat loss?",
    "ar": "جدار مساحته 10 m² وسُمكه 0.2 m ومعامل توصيله الحراري k = 0.8 W/(m·K). فرق الحرارة بين وجهيه 20 K. ما الفقد الحراري بالتوصيل في الحالة المستقرة؟"
   },
   "opts": [
    {
     "en": "160 W",
     "ar": "160 W",
     "why": {
      "en": "The wall thickness was omitted; Q = k A ΔT / L.",
      "ar": "أُهمل سُمك الجدار؛ Q = k A ΔT / L."
     }
    },
    {
     "en": "8 W",
     "ar": "8 W",
     "why": {
      "en": "The thickness was entered in cm (20) instead of m (0.2): a unit slip.",
      "ar": "أُدخل السُّمك بالـ cm (20) بدل m (0.2): خطأ وحدات."
     }
    },
    {
     "en": "32 W",
     "ar": "32 W",
     "why": {
      "en": "The thickness was multiplied instead of divided: Fourier's law has L in the denominator.",
      "ar": "ضُرب السُّمك بدل أن يُقسم: قانون فورييه يضع L في المقام."
     }
    },
    {
     "en": "800 W",
     "ar": "800 W",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Fourier: Q = k A ΔT / L = 0.8 × 10 × 20 / 0.2 = 800 W.",
    "ar": "فورييه: Q = k A ΔT / L = 0.8 × 10 × 20 / 0.2 = 800 W."
   }
  },
  {
   "id": "th-08",
   "subject": "th",
   "topic": "refrig",
   "level": 1,
   "type": "applied",
   "q": {
    "en": "A refrigerator removes 300 kJ from the cold space per cycle while consuming 100 kJ of work. What is its coefficient of performance (COP)?",
    "ar": "ثلاجة تسحب 300 kJ من الحيز البارد في كل دورة وتستهلك شغلاً 100 kJ. ما معامل أدائها (COP)؟"
   },
   "opts": [
    {
     "en": "0.75",
     "ar": "0.75",
     "why": {
      "en": "Q_c was divided by the heat rejected Q_h = Q_c + W instead of by the work.",
      "ar": "قُسمت Q_c على الحرارة المطروحة Q_h = Q_c + W بدل الشغل."
     }
    },
    {
     "en": "0.3333",
     "ar": "0.3333",
     "why": {
      "en": "The ratio was inverted: COP = Q_c / W (desired effect over input).",
      "ar": "قُلبت النسبة: COP = Q_c / W (المفيد على المبذول)."
     }
    },
    {
     "en": "3",
     "ar": "3",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "4",
     "ar": "4",
     "why": {
      "en": "This is the heat-pump COP (heat delivered to the hot side / work); a refrigerator is rated by the heat removed.",
      "ar": "هذا COP المضخة الحرارية (الحرارة المسلَّمة للجانب الساخن / الشغل)؛ أما الثلاجة فتُقيَّم بالحرارة المسحوبة."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "COP_R = Q_c / W = 300 / 100 = 3. Note COP can exceed 1 because heat is moved, not created.",
    "ar": "COP_R = Q_c / W = 300 / 100 = 3. ويمكن أن يتجاوز COP الواحد لأن الحرارة تُنقل ولا تُولَّد."
   }
  },
  {
   "id": "th-09",
   "subject": "th",
   "topic": "processes",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "An ideal gas undergoes a slow isothermal (constant-temperature) expansion. Which statement is true?",
    "ar": "يتمدد غاز مثالي ببطء بعملية أيزوثيرمية (ثابتة الحرارة). أي العبارات صحيحة؟"
   },
   "opts": [
    {
     "en": "No heat is exchanged with the surroundings (Q = 0)",
     "ar": "لا تُتبادل حرارة مع المحيط (Q = 0)",
     "why": {
      "en": "That describes an adiabatic process; in an isothermal expansion heat must flow in to keep T constant.",
      "ar": "هذا وصف العملية الكاتمة للحرارة؛ وفي التمدد الأيزوثيرمي يجب أن تدخل حرارة لتبقى T ثابتة."
     }
    },
    {
     "en": "Its internal energy does not change, so the heat absorbed equals the work done by the gas",
     "ar": "لا تتغير طاقته الداخلية، فالحرارة الممتصة تساوي الشغل الذي يبذله الغاز",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "The pressure stays constant",
     "ar": "يبقى الضغط ثابتاً",
     "why": {
      "en": "Constant pressure is an isobaric process; for isothermal P V = constant, so P falls as V rises.",
      "ar": "ثبات الضغط عملية ثابتة الضغط؛ وفي الأيزوثيرمية P V = ثابت فينخفض P بزيادة V."
     }
    },
    {
     "en": "The gas does no work because T is constant",
     "ar": "لا يبذل الغاز شغلاً لأن T ثابتة",
     "why": {
      "en": "Work depends on the volume change, not the temperature change; here W = n R T ln(V2/V1) > 0.",
      "ar": "الشغل يتوقف على تغير الحجم لا تغير الحرارة؛ وهنا W = n R T ln(V2/V1) > 0."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "For an ideal gas u depends on T only, so ΔT = 0 gives ΔU = 0 and the first law reduces to Q = W.",
    "ar": "للغاز المثالي تتوقف u على T فقط، فـ ΔT = 0 تعطي ΔU = 0 ويؤول القانون الأول إلى Q = W."
   }
  },
  {
   "id": "th-10",
   "subject": "th",
   "topic": "enthalpy",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "How much heat is needed to raise the temperature of 2 kg of air by 50 K at constant pressure? Take c_p = 1005 J/(kg·K).",
    "ar": "كم الحرارة اللازمة لرفع حرارة 2 kg من الهواء بمقدار 50 K عند ضغط ثابت؟ خذ c_p = 1005 J/(kg·K)."
   },
   "opts": [
    {
     "en": "50.25 kJ",
     "ar": "50.25 kJ",
     "why": {
      "en": "The mass was forgotten: Q = m c_p ΔT.",
      "ar": "سقطت الكتلة: Q = m c_p ΔT."
     }
    },
    {
     "en": "100.5 kJ",
     "ar": "100.5 kJ",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "100500 kJ",
     "ar": "100500 kJ",
     "why": {
      "en": "The result in J was labelled kJ (missing division by 1000).",
      "ar": "نتيجة بالـ J وُسمت kJ (نُسيت القسمة على 1000)."
     }
    },
    {
     "en": "71.8 kJ",
     "ar": "71.8 kJ",
     "why": {
      "en": "c_v (constant volume) was used; at constant pressure the heat equals the enthalpy change, with c_p.",
      "ar": "استُعملت c_v (حجم ثابت)؛ وعند ضغط ثابت تساوي الحرارة تغير الإنثالبي وبـ c_p."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "Q = m c_p ΔT = 2 × 1005 × 50 = 100500 J = 100.5 kJ.",
    "ar": "Q = m c_p ΔT = 2 × 1005 × 50 = 100500 J = 100.5 kJ."
   }
  },
  {
   "id": "th-11",
   "subject": "th",
   "topic": "processes",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "Air (k = 1.4) at 300 K is compressed reversibly and adiabatically (isentropically) to 8 times its initial pressure. What is the final temperature?",
    "ar": "هواء (k = 1.4) عند 300 K يُضغط بعملية عكوسة كاتمة للحرارة (أيزنتروبية) حتى يصبح ضغطه 8 أمثال الضغط الابتدائي. ما درجة الحرارة النهائية؟"
   },
   "opts": [
    {
     "en": "1325 K",
     "ar": "1325 K",
     "why": {
      "en": "The exponent 1/k belongs to P v^k = const for the volume; T–P needs (k − 1)/k.",
      "ar": "الأس 1/k يخص الحجم في P v^k = ثابت؛ وعلاقة T–P تحتاج (k − 1)/k."
     }
    },
    {
     "en": "543.4 K",
     "ar": "543.4 K",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "2400 K",
     "ar": "2400 K",
     "why": {
      "en": "T was scaled by the pressure ratio directly, as if the volume were constant (T ∝ P only for isochoric heating).",
      "ar": "ضُربت T في نسبة الضغط مباشرة كأن الحجم ثابت (T ∝ P فقط في التسخين ثابت الحجم)."
     }
    },
    {
     "en": "689.2 K",
     "ar": "689.2 K",
     "why": {
      "en": "The volume-ratio exponent (k − 1) was applied to the pressure ratio; with pressures the exponent is (k − 1)/k.",
      "ar": "طُبق أس نسبة الحجم (k − 1) على نسبة الضغط؛ مع الضغوط يكون الأس (k − 1)/k."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "T2 = T1 (P2/P1)^((k−1)/k) = 300 × 8^0.2857 = 543.4 K.",
    "ar": "T2 = T1 (P2/P1)^((k−1)/k) = 300 × 8^0.2857 = 543.4 K."
   }
  },
  {
   "id": "th-12",
   "subject": "th",
   "topic": "processes",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "1 mol of an ideal gas expands isothermally at 300 K until its volume triples. Using R = 8.314 J/(mol·K), what work does the gas do?",
    "ar": "1 mol من غاز مثالي يتمدد أيزوثيرمياً عند 300 K حتى يتضاعف حجمه ثلاث مرات. باستعمال R = 8.314 J/(mol·K)، ما الشغل الذي يبذله الغاز؟"
   },
   "opts": [
    {
     "en": "7483 J",
     "ar": "7483 J",
     "why": {
      "en": "The volume ratio was used directly instead of its logarithm.",
      "ar": "استُعملت نسبة الحجم مباشرة بدل لوغاريتمها."
     }
    },
    {
     "en": "2740 J",
     "ar": "2740 J",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "4988 J",
     "ar": "4988 J",
     "why": {
      "en": "Work was computed as P ΔV with the initial pressure; but P falls during isothermal expansion, which gives the ln form.",
      "ar": "حُسب الشغل بـ P ΔV بالضغط الابتدائي؛ لكن P ينخفض أثناء التمدد الأيزوثيرمي مما يعطي صيغة ln."
     }
    },
    {
     "en": "1190 J",
     "ar": "1190 J",
     "why": {
      "en": "The base-10 logarithm was used; isothermal work needs the natural logarithm ln.",
      "ar": "استُعمل اللوغاريتم العشري؛ والشغل الأيزوثيرمي يتطلب اللوغاريتم الطبيعي ln."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "W = ∫P dV = n R T ln(V2/V1) = 1 × 8.314 × 300 × ln 3 = 2740 J.",
    "ar": "W = ∫P dV = n R T ln(V2/V1) = 1 × 8.314 × 300 × ln 3 = 2740 J."
   }
  },
  {
   "id": "th-13",
   "subject": "th",
   "topic": "cycles",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "An ideal Otto cycle uses air (k = 1.4) with a compression ratio of 8. What is its thermal efficiency?",
    "ar": "دورة أوتو مثالية تستعمل هواءً (k = 1.4) بنسبة انضغاط 8. ما كفاءتها الحرارية؟"
   },
   "opts": [
    {
     "en": "87.5 %",
     "ar": "87.5 %",
     "why": {
      "en": "The exponent (k − 1) was left out: η = 1 − 1/r^(k−1), not 1 − 1/r.",
      "ar": "سقط الأس (k − 1): η = 1 − 1/r^(k−1) وليس 1 − 1/r."
     }
    },
    {
     "en": "94.56 %",
     "ar": "94.56 %",
     "why": {
      "en": "The exponent k was used instead of (k − 1).",
      "ar": "استُعمل الأس k بدل (k − 1)."
     }
    },
    {
     "en": "43.53 %",
     "ar": "43.53 %",
     "why": {
      "en": "This is 1/r^(k−1), the fraction of heat rejected; the efficiency is 1 minus it.",
      "ar": "هذه 1/r^(k−1) أي نسبة الحرارة المطروحة؛ والكفاءة هي 1 ناقصها."
     }
    },
    {
     "en": "56.47 %",
     "ar": "56.47 %",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "η = 1 − 1/r^(k−1) = 1 − 1/8^0.4 = 0.5647 = 56.47 %.",
    "ar": "η = 1 − 1/r^(k−1) = 1 − 1/8^0.4 = 0.5647 = 56.47 %."
   }
  },
  {
   "id": "th-14",
   "subject": "th",
   "topic": "refrig",
   "level": 2,
   "type": "applied",
   "q": {
    "en": "A reversible (Carnot) refrigerator keeps a cold space at -10 °C while rejecting heat to surroundings at 30 °C (use T(K) = T(°C) + 273). What is its COP?",
    "ar": "ثلاجة عكوسة (كارنو) تُبقي حيزاً بارداً عند -10 °C وتطرح الحرارة إلى محيط عند 30 °C (استعمل T(K) = T(°C) + 273). ما معامل أدائها COP؟"
   },
   "opts": [
    {
     "en": "7.575",
     "ar": "7.575",
     "why": {
      "en": "This is the Carnot heat-pump COP T_h/(T_h − T_c); a refrigerator uses T_c in the numerator.",
      "ar": "هذا COP كارنو للمضخة الحرارية T_h/(T_h − T_c)؛ والثلاجة تضع T_c في البسط."
     }
    },
    {
     "en": "6.575",
     "ar": "6.575",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "0.132",
     "ar": "0.132",
     "why": {
      "en": "This is the Carnot ENGINE efficiency, not a refrigerator COP.",
      "ar": "هذه كفاءة محرك كارنو لا معامل أداء ثلاجة."
     }
    },
    {
     "en": "0.25",
     "ar": "0.25",
     "why": {
      "en": "The Celsius value of T_c was used; absolute temperatures are required.",
      "ar": "استُعملت قيمة T_c بالسيلزيوس؛ والمطلوب درجات حرارة مطلقة."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "COP_R,Carnot = T_c / (T_h − T_c) = 263 / (303 − 263) = 6.575.",
    "ar": "COP_R,Carnot = T_c / (T_h − T_c) = 263 / (303 − 263) = 6.575."
   }
  },
  {
   "id": "th-15",
   "subject": "th",
   "topic": "entropy",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "2 kg of liquid water (treat c = 4.18 kJ/(kg·K) as constant) is heated from 300 K to 350 K. What is the entropy change of the water?",
    "ar": "2 kg من الماء السائل (اعتبر c = 4.18 kJ/(kg·K) ثابتة) تُسخَّن من 300 K إلى 350 K. ما تغير إنتروبيا الماء؟"
   },
   "opts": [
    {
     "en": "1.194 kJ/K",
     "ar": "1.194 kJ/K",
     "why": {
      "en": "Q was divided by the final temperature only; the exact result is m c ln(T2/T1).",
      "ar": "قُسمت Q على الحرارة النهائية فقط؛ والنتيجة الدقيقة m c ln(T2/T1)."
     }
    },
    {
     "en": "1.393 kJ/K",
     "ar": "1.393 kJ/K",
     "why": {
      "en": "Q was divided by the initial temperature only; T changes during heating, so ∫dQ/T gives a logarithm.",
      "ar": "قُسمت Q على الحرارة الابتدائية فقط؛ وT تتغير أثناء التسخين فيعطي ∫dQ/T لوغاريتماً."
     }
    },
    {
     "en": "1.289 kJ/K",
     "ar": "1.289 kJ/K",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "0.5597 kJ/K",
     "ar": "0.5597 kJ/K",
     "why": {
      "en": "The base-10 logarithm was used instead of the natural logarithm.",
      "ar": "استُعمل اللوغاريتم العشري بدل الطبيعي."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "ΔS = ∫ m c dT / T = m c ln(T2/T1) = 2 × 4.18 × ln(350/300) = 1.289 kJ/K.",
    "ar": "ΔS = ∫ m c dT / T = m c ln(T2/T1) = 2 × 4.18 × ln(350/300) = 1.289 kJ/K."
   }
  },
  {
   "id": "th-16",
   "subject": "th",
   "topic": "steam",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "In an ideal Rankine cycle the boiler pressure and turbine inlet state are kept fixed, but the condenser pressure is lowered. What happens to the cycle?",
    "ar": "في دورة رانكين مثالية يبقى ضغط المرجل وحالة دخول التوربين ثابتين، لكن يُخفَّض ضغط المكثف. ماذا يحدث للدورة؟"
   },
   "opts": [
    {
     "en": "Efficiency falls because the pump work becomes larger than the turbine work",
     "ar": "تنخفض الكفاءة لأن شغل المضخة يصبح أكبر من شغل التوربين",
     "why": {
      "en": "Pump work (v ΔP for a liquid) stays very small compared with the turbine work, so it cannot outweigh the gain.",
      "ar": "شغل المضخة (v ΔP لسائل) يبقى صغيراً جداً مقارنة بشغل التوربين فلا يمكن أن يرجح على المكسب."
     }
    },
    {
     "en": "Efficiency rises only if the boiler pressure is raised as well",
     "ar": "ترتفع الكفاءة فقط إذا رُفع ضغط المرجل أيضاً",
     "why": {
      "en": "Lowering the condenser pressure improves efficiency by itself; boiler pressure is an independent lever.",
      "ar": "خفض ضغط المكثف يحسّن الكفاءة بمفرده؛ وضغط المرجل عامل مستقل."
     }
    },
    {
     "en": "Nothing changes, because efficiency depends only on the boiler temperature",
     "ar": "لا شيء يتغير لأن الكفاءة تتوقف على حرارة المرجل فقط",
     "why": {
      "en": "The heat-rejection temperature matters too; a lower condenser pressure means lower saturation temperature and a larger expansion.",
      "ar": "حرارة طرح الحرارة مؤثرة أيضاً؛ فضغط المكثف الأقل يعني حرارة تشبّع أقل وتمدداً أكبر."
     }
    },
    {
     "en": "The turbine expands to a lower pressure, giving more net work and a higher thermal efficiency",
     "ar": "يتمدد البخار في التوربين إلى ضغط أقل فيزداد الشغل الصافي وترتفع الكفاءة الحرارية",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "A lower condenser pressure lowers the temperature at which heat is rejected, so the cycle comes closer to the Carnot ideal. In one MIT worked example the efficiency was about 27.4 % with a condenser near 20 °C but only about 13.4 % if the steam were exhausted at 1 atm.",
    "ar": "خفض ضغط المكثف يخفض حرارة طرح الحرارة فتقترب الدورة من دورة كارنو المثالية. في مثال محلول من MIT كانت الكفاءة نحو 27.4 % بمكثف قرب 20 °C ونحو 13.4 % فقط لو طُرد البخار عند 1 atm."
   }
  },
  {
   "id": "th-17",
   "subject": "th",
   "topic": "heattransfer",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A surface of area 2 m² and emissivity 0.9 is at 500 K and exchanges radiation with large surroundings at 300 K. Using σ = 5.67×10⁻⁸ W/(m²·K⁴), what is the net radiative heat loss?",
    "ar": "سطح مساحته 2 m² وانبعاثيته 0.9 عند 500 K يتبادل الإشعاع مع محيط كبير عند 300 K. باستعمال σ = 5.67×10⁻⁸ W/(m²·K⁴)، ما صافي الفقد الحراري بالإشعاع؟"
   },
   "opts": [
    {
     "en": "270.9 W",
     "ar": "270.9 W",
     "why": {
      "en": "Celsius temperatures were used; radiation laws need absolute temperatures.",
      "ar": "استُعملت درجات سيلزيوس؛ قوانين الإشعاع تتطلب درجات حرارة مطلقة."
     }
    },
    {
     "en": "163.3 W",
     "ar": "163.3 W",
     "why": {
      "en": "The temperature DIFFERENCE was raised to the 4th power; it must be T_s⁴ − T_surr⁴.",
      "ar": "رُفع فرق الحرارة إلى القوة الرابعة؛ والصحيح T_s⁴ − T_surr⁴."
     }
    },
    {
     "en": "6379 W",
     "ar": "6379 W",
     "why": {
      "en": "The radiation received from the surroundings was ignored; the NET loss subtracts σ ε A T_surr⁴.",
      "ar": "أُهمل الإشعاع الوارد من المحيط؛ والصافي يطرح σ ε A T_surr⁴."
     }
    },
    {
     "en": "5552 W",
     "ar": "5552 W",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Q = ε σ A (T_s⁴ − T_surr⁴) = 0.9 × 5.67×10⁻⁸ × 2 × (500⁴ − 300⁴) = 5552 W.",
    "ar": "Q = ε σ A (T_s⁴ − T_surr⁴) = 0.9 × 5.67×10⁻⁸ × 2 × (500⁴ − 300⁴) = 5552 W."
   }
  },
  {
   "id": "th-18",
   "subject": "th",
   "topic": "heattransfer",
   "level": 2,
   "type": "applied",
   "q": {
    "en": "A wall consists of 0.2 m of brick (k = 0.8 W/(m·K)) and 0.1 m of insulation (k = 0.04 W/(m·K)) in series. The temperature difference across the whole wall is 30 K. What is the heat flux per m² of wall?",
    "ar": "جدار من طبقتين على التوالي: طوب سُمكه 0.2 m (k = 0.8 W/(m·K)) وعازل سُمكه 0.1 m (k = 0.04 W/(m·K)). فرق الحرارة عبر الجدار كله 30 K. ما الفيض الحراري لكل m² من الجدار؟"
   },
   "opts": [
    {
     "en": "42 W/m²",
     "ar": "42 W/m²",
     "why": {
      "en": "Conductivities were simply averaged; the layers must be treated as resistances L/k in series.",
      "ar": "أُخذ متوسط معاملي التوصيل ببساطة؛ ويجب معاملة الطبقات كمقاومات L/k على التوالي."
     }
    },
    {
     "en": "120 W/m²",
     "ar": "120 W/m²",
     "why": {
      "en": "The insulation layer was ignored; it provides most of the thermal resistance.",
      "ar": "أُهملت طبقة العازل؛ وهي تُشكّل معظم المقاومة الحرارية."
     }
    },
    {
     "en": "132 W/m²",
     "ar": "132 W/m²",
     "why": {
      "en": "The layer resistances were combined as in PARALLEL; layers in series add their resistances.",
      "ar": "جُمعت مقاومات الطبقات كأنها على التوازي؛ والطبقات المتتالية تُجمع مقاوماتها."
     }
    },
    {
     "en": "10.91 W/m²",
     "ar": "10.91 W/m²",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "R = L1/k1 + L2/k2 = 0.2/0.8 + 0.1/0.04 = 2.75 m²·K/W;  q = ΔT / R = 30 / 2.75 = 10.91 W/m².",
    "ar": "R = L1/k1 + L2/k2 = 0.2/0.8 + 0.1/0.04 = 2.75 m²·K/W؛ q = ΔT / R = 30 / 2.75 = 10.91 W/m²."
   }
  },
  {
   "id": "th-19",
   "subject": "th",
   "topic": "cycles",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "An ideal Brayton (gas-turbine) cycle uses air with k = 1.4 and a pressure ratio of 10. What is its thermal efficiency?",
    "ar": "دورة برايتون المثالية (توربين غازي) تستعمل هواءً بـ k = 1.4 ونسبة ضغط 10. ما كفاءتها الحرارية؟"
   },
   "opts": [
    {
     "en": "48.21 %",
     "ar": "48.21 %",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "51.79 %",
     "ar": "51.79 %",
     "why": {
      "en": "This is 1/r_p^((k−1)/k), the heat-rejection fraction; the efficiency is 1 minus it.",
      "ar": "هذه 1/r_p^((k−1)/k) أي نسبة الحرارة المطروحة؛ والكفاءة هي 1 ناقصها."
     }
    },
    {
     "en": "90 %",
     "ar": "90 %",
     "why": {
      "en": "The exponent (k − 1)/k was omitted: η = 1 − 1/r_p^((k−1)/k).",
      "ar": "سقط الأس (k − 1)/k: η = 1 − 1/r_p^((k−1)/k)."
     }
    },
    {
     "en": "60.19 %",
     "ar": "60.19 %",
     "why": {
      "en": "The exponent (k − 1) of the Otto (volume-ratio) formula was used; for a pressure ratio it is (k − 1)/k.",
      "ar": "استُعمل الأس (k − 1) من صيغة أوتو (نسبة الحجم)؛ ومع نسبة الضغط يكون (k − 1)/k."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "η = 1 − r_p^(−(k−1)/k) = 1 − 10^(−0.2857) = 0.4821 = 48.21 %.",
    "ar": "η = 1 − r_p^(−(k−1)/k) = 1 − 10^(−0.2857) = 0.4821 = 48.21 %."
   }
  },
  {
   "id": "th-20",
   "subject": "th",
   "topic": "refrig",
   "level": 2,
   "type": "applied",
   "q": {
    "en": "A heat pump has a COP (heating) of 3.5 and its compressor draws 2 kW. At what rate does it deliver heat to the room?",
    "ar": "مضخة حرارية معامل أدائها للتدفئة 3.5 ويسحب ضاغطها 2 kW. ما معدل الحرارة التي تسلّمها للغرفة؟"
   },
   "opts": [
    {
     "en": "5.5 kW",
     "ar": "5.5 kW",
     "why": {
      "en": "COP is a dimensionless ratio and cannot be added to a power.",
      "ar": "COP نسبة بلا بُعد ولا يمكن جمعها إلى قدرة."
     }
    },
    {
     "en": "7 kW",
     "ar": "7 kW",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "5 kW",
     "ar": "5 kW",
     "why": {
      "en": "This is the heat taken from the cold source (COP − 1) × W; the room receives that plus the work.",
      "ar": "هذا معدل الحرارة المسحوبة من المصدر البارد (COP − 1) × W؛ والغرفة تتلقاها مضافاً إليها الشغل."
     }
    },
    {
     "en": "0.5714 kW",
     "ar": "0.5714 kW",
     "why": {
      "en": "The ratio was inverted: Q_h = COP × W.",
      "ar": "قُلبت النسبة: Q_h = COP × W."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "COP_HP = Q_h / W → Q_h = 3.5 × 2 = 7 kW. Of this, 2 kW is the electrical work and 5 kW is heat taken from outside.",
    "ar": "COP_HP = Q_h / W ← Q_h = 3.5 × 2 = 7 kW. منها 2 kW شغل كهربائي و5 kW حرارة مسحوبة من الخارج."
   }
  },
  {
   "id": "th-21",
   "subject": "th",
   "topic": "cycles",
   "level": 3,
   "type": "multi",
   "q": {
    "en": "Multi-step problem. An ideal air-standard Otto cycle has T1 = 300 K at the start of compression, compression ratio r = 8, and maximum temperature T3 = 1800 K. Take k = 1.4 and c_v = 0.718 kJ/(kg·K). Answer the three steps (partial credit is given).",
    "ar": "مسألة متعددة الخطوات. دورة أوتو مثالية بالهواء القياسي: T1 = 300 K في بداية الانضغاط ونسبة الانضغاط r = 8 وأعلى حرارة T3 = 1800 K. خذ k = 1.4 وc_v = 0.718 kJ/(kg·K). أجب عن الخطوات الثلاث (يُمنح تقدير جزئي)."
   },
   "steps": [
    {
     "id": "a",
     "q": {
      "en": "Step 1: What is the temperature T2 at the end of isentropic compression?",
      "ar": "الخطوة 1: ما الحرارة T2 في نهاية الانضغاط الأيزنتروبي؟"
     },
     "opts": [
      {
       "en": "1325 K",
       "ar": "1325 K",
       "why": {
        "en": "The exponent 1/k was used instead of (k − 1).",
        "ar": "استُعمل الأس 1/k بدل (k − 1)."
       }
      },
      {
       "en": "689.2 K",
       "ar": "689.2 K",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "2400 K",
       "ar": "2400 K",
       "why": {
        "en": "T is not proportional to the volume ratio; T2 = T1 r^(k−1).",
        "ar": "T لا تتناسب مع نسبة الحجم؛ T2 = T1 r^(k−1)."
       }
      },
      {
       "en": "543.4 K",
       "ar": "543.4 K",
       "why": {
        "en": "The pressure-ratio exponent (k − 1)/k was applied to the VOLUME ratio.",
        "ar": "طُبق أس نسبة الضغط (k − 1)/k على نسبة الحجم."
       }
      }
     ],
     "ans": 1,
     "exp": {
      "en": "T2 = T1 r^(k−1) = 300 × 8^0.4 = 689.2 K.",
      "ar": "T2 = T1 r^(k−1) = 300 × 8^0.4 = 689.2 K."
     }
    },
    {
     "id": "b",
     "q": {
      "en": "Step 2: What is the heat added per kg in the constant-volume combustion process 2→3?",
      "ar": "الخطوة 2: ما الحرارة المضافة لكل kg في عملية الاحتراق ثابتة الحجم 2→3؟"
     },
     "opts": [
      {
       "en": "1116 kJ/kg",
       "ar": "1116 kJ/kg",
       "why": {
        "en": "c_p was used; heat addition at constant VOLUME uses c_v.",
        "ar": "استُعملت c_p؛ والحرارة المضافة عند حجم ثابت تستعمل c_v."
       }
      },
      {
       "en": "1077 kJ/kg",
       "ar": "1077 kJ/kg",
       "why": {
        "en": "T1 was used instead of T2 as the start of heat addition.",
        "ar": "استُعملت T1 بدل T2 كبداية لإضافة الحرارة."
       }
      },
      {
       "en": "797.5 kJ/kg",
       "ar": "797.5 kJ/kg",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "1292 kJ/kg",
       "ar": "1292 kJ/kg",
       "why": {
        "en": "The starting temperature T2 was not subtracted: q = c_v (T3 − T2).",
        "ar": "لم تُطرح حرارة البداية T2: q = c_v (T3 − T2)."
       }
      }
     ],
     "ans": 2,
     "exp": {
      "en": "q_in = c_v (T3 − T2) = 0.718 × (1800 − 689.2) = 797.5 kJ/kg.",
      "ar": "q_in = c_v (T3 − T2) = 0.718 × (1800 − 689.2) = 797.5 kJ/kg."
     }
    },
    {
     "id": "c",
     "q": {
      "en": "Step 3: What is the net work output per kg of air?",
      "ar": "الخطوة 3: ما الشغل الصافي الناتج لكل kg من الهواء؟"
     },
     "opts": [
      {
       "en": "450.4 kJ/kg",
       "ar": "450.4 kJ/kg",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "697.8 kJ/kg",
       "ar": "697.8 kJ/kg",
       "why": {
        "en": "The efficiency was taken as 1 − 1/r; for Otto it is 1 − 1/r^(k−1).",
        "ar": "أُخذت الكفاءة 1 − 1/r؛ وفي أوتو هي 1 − 1/r^(k−1)."
       }
      },
      {
       "en": "797.5 kJ/kg",
       "ar": "797.5 kJ/kg",
       "why": {
        "en": "This is the heat input; some heat must be rejected, so work is smaller.",
        "ar": "هذه الحرارة الداخلة؛ ويجب طرح جزء منها فيكون الشغل أقل."
       }
      },
      {
       "en": "347.1 kJ/kg",
       "ar": "347.1 kJ/kg",
       "why": {
        "en": "This is the heat REJECTED q_out = c_v (T4 − T1), not the work.",
        "ar": "هذه الحرارة المطروحة q_out = c_v (T4 − T1) لا الشغل."
       }
      }
     ],
     "ans": 0,
     "exp": {
      "en": "T4 = T3 / r^0.4 = 783.5 K;  q_out = c_v (T4 − T1) = 347.1 kJ/kg;  w_net = q_in − q_out = 450.4 kJ/kg (= η q_in).",
      "ar": "T4 = T3 / r^0.4 = 783.5 K؛ q_out = c_v (T4 − T1) = 347.1 kJ/kg؛ w_net = q_in − q_out = 450.4 kJ/kg (= η q_in)."
     }
    }
   ],
   "exp": {
    "en": "Net cycle work equals heat added minus heat rejected; the efficiency 1 − 1/r^(k−1) depends only on compression ratio, while T3 sets how much heat is added.",
    "ar": "الشغل الصافي للدورة يساوي الحرارة المضافة ناقص المطروحة؛ والكفاءة 1 − 1/r^(k−1) تتوقف على نسبة الانضغاط فقط أما T3 فتحدد مقدار الحرارة المضافة."
   }
  },
  {
   "id": "th-22",
   "subject": "th",
   "topic": "cycles",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "An ideal air-standard Diesel cycle has compression ratio r = 18 and cutoff ratio r_c = V3/V2 = 2. Take k = 1.4. What is its thermal efficiency, from η = 1 − [1/r^(k−1)] · [(r_c^k − 1) / (k (r_c − 1))]?",
    "ar": "دورة ديزل مثالية بالهواء القياسي نسبة انضغاطها r = 18 ونسبة القطع r_c = V3/V2 = 2. خذ k = 1.4. ما كفاءتها الحرارية من η = 1 − [1/r^(k−1)] · [(r_c^k − 1) / (k (r_c − 1))]؟"
   },
   "opts": [
    {
     "en": "68.53 %",
     "ar": "68.53 %",
     "why": {
      "en": "The cutoff-ratio bracket was dropped, which gives the Otto efficiency at the same r; the Diesel cycle is less efficient than that.",
      "ar": "سقط قوس نسبة القطع فنتجت كفاءة أوتو عند r نفسها؛ ودورة ديزل أقل كفاءة منها."
     }
    },
    {
     "en": "73.12 %",
     "ar": "73.12 %",
     "why": {
      "en": "The bracket was inverted; it is always greater than 1 and makes Diesel less efficient than Otto.",
      "ar": "قُلب القوس؛ وهو دائماً أكبر من 1 ويجعل ديزل أقل كفاءة من أوتو."
     }
    },
    {
     "en": "48.42 %",
     "ar": "48.42 %",
     "why": {
      "en": "The factor k in the denominator of the bracket was forgotten.",
      "ar": "نُسي العامل k في مقام القوس."
     }
    },
    {
     "en": "63.16 %",
     "ar": "63.16 %",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "1/r^(k−1) = 0.3147;  bracket = (2^1.4 − 1)/(1.4 × 1) = 1.171;  η = 1 − 0.3147 × 1.171 = 0.6316 = 63.16 %.",
    "ar": "1/r^(k−1) = 0.3147؛ القوس = (2^1.4 − 1)/(1.4 × 1) = 1.171؛ η = 1 − 0.3147 × 1.171 = 0.6316 = 63.16 %."
   }
  },
  {
   "id": "th-23",
   "subject": "th",
   "topic": "cycles",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "An ideal Brayton cycle takes air in at T1 = 300 K, with pressure ratio 8 and turbine inlet temperature T3 = 1200 K. Take k = 1.4 and c_p = 1005 J/(kg·K). What is the net specific work?",
    "ar": "دورة برايتون مثالية يدخل إليها الهواء عند T1 = 300 K بنسبة ضغط 8 وحرارة دخول التوربين T3 = 1200 K. خذ k = 1.4 وc_p = 1005 J/(kg·K). ما الشغل النوعي الصافي؟"
   },
   "opts": [
    {
     "en": "540.2 kJ/kg",
     "ar": "540.2 kJ/kg",
     "why": {
      "en": "Only the turbine work was counted; the compressor consumes part of it.",
      "ar": "حُسب شغل التوربين فقط؛ والضاغط يستهلك جزءاً منه."
     }
    },
    {
     "en": "904.5 kJ/kg",
     "ar": "904.5 kJ/kg",
     "why": {
      "en": "This ignores the compression temperature rise and mixes heat added with work.",
      "ar": "هذا يُهمل ارتفاع الحرارة بالانضغاط ويخلط الحرارة المضافة بالشغل."
     }
    },
    {
     "en": "784.9 kJ/kg",
     "ar": "784.9 kJ/kg",
     "why": {
      "en": "The compressor work was added instead of subtracted (sign error).",
      "ar": "أُضيف شغل الضاغط بدل أن يُطرح (خطأ إشارة)."
     }
    },
    {
     "en": "295.6 kJ/kg",
     "ar": "295.6 kJ/kg",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "T2 = 300 × 8^0.2857 = 543.4 K;  T4 = 1200 / 8^0.2857 = 662.5 K;  w_net = c_p [(T3 − T4) − (T2 − T1)] = 295.6 kJ/kg.",
    "ar": "T2 = 300 × 8^0.2857 = 543.4 K؛ T4 = 1200 / 8^0.2857 = 662.5 K؛ w_net = c_p [(T3 − T4) − (T2 − T1)] = 295.6 kJ/kg."
   }
  },
  {
   "id": "th-24",
   "subject": "th",
   "topic": "entropy",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "1000 kJ of heat flows directly from a reservoir at 500 K to a reservoir at 300 K through a conducting rod that stays in steady state. What is the entropy generated?",
    "ar": "تنتقل حرارة 1000 kJ مباشرة من مستودع عند 500 K إلى مستودع عند 300 K عبر قضيب موصل في حالة مستقرة. ما الإنتروبيا المتولدة؟"
   },
   "opts": [
    {
     "en": "5.333 kJ/K",
     "ar": "5.333 kJ/K",
     "why": {
      "en": "Both terms were added; the hot reservoir LOSES entropy (−Q/T_h) while the cold one gains it.",
      "ar": "جُمع الحدان؛ والمستودع الساخن يفقد إنتروبيا (−Q/T_h) بينما يكسبها البارد."
     }
    },
    {
     "en": "1.333 kJ/K",
     "ar": "1.333 kJ/K",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "-1.333 kJ/K",
     "ar": "-1.333 kJ/K",
     "why": {
      "en": "Sign error: the cold reservoir gains more entropy than the hot one loses, so S_gen is positive (negative would violate the second law).",
      "ar": "خطأ إشارة: المستودع البارد يكسب إنتروبيا أكثر مما يفقد الساخن، فـ S_gen موجبة (السالبة تخالف القانون الثاني)."
     }
    },
    {
     "en": "5 kJ/K",
     "ar": "5 kJ/K",
     "why": {
      "en": "Q was divided by the temperature difference; entropy changes are Q/T for each reservoir separately.",
      "ar": "قُسمت Q على فرق الحرارة؛ وتغيرات الإنتروبيا هي Q/T لكل مستودع على حدة."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "ΔS_hot = −1000/500 = -2 kJ/K;  ΔS_cold = +1000/300 = 3.333 kJ/K;  S_gen = ΔS_total = 1.333 kJ/K > 0 (irreversible).",
    "ar": "ΔS_hot = −1000/500 = -2 kJ/K؛ ΔS_cold = +1000/300 = 3.333 kJ/K؛ S_gen = ΔS_total = 1.333 kJ/K > 0 (عملية لا عكوسة)."
   }
  },
  {
   "id": "th-25",
   "subject": "th",
   "topic": "entropy",
   "level": 3,
   "type": "concept",
   "q": {
    "en": "An ideal gas inside a thermally insulated rigid container is initially confined to half of it by a partition; the other half is vacuum. The partition is removed and the gas expands freely to fill the container. Which statement is correct?",
    "ar": "غاز مثالي داخل وعاء صلب معزول حرارياً محصور في نصفه بحاجز، والنصف الآخر فراغ. يُزال الحاجز فيتمدد الغاز تمدداً حراً ليملأ الوعاء. أي العبارات صحيحة؟"
   },
   "opts": [
    {
     "en": "The entropy decreases, because the pressure falls",
     "ar": "تنقص الإنتروبيا لأن الضغط ينخفض",
     "why": {
      "en": "The entropy of the gas increases by n R ln(V2/V1) > 0, because the volume available increased; a pressure drop does not decrease it here.",
      "ar": "تزداد إنتروبيا الغاز بمقدار n R ln(V2/V1) > 0 لأن الحجم المتاح ازداد؛ وانخفاض الضغط لا ينقصها هنا."
     }
    },
    {
     "en": "The entropy is unchanged, because Q = 0",
     "ar": "الإنتروبيا لا تتغير لأن Q = 0",
     "why": {
      "en": "Q = 0 gives ΔS = 0 only for a REVERSIBLE adiabatic process; free expansion is irreversible and generates entropy.",
      "ar": "Q = 0 تعطي ΔS = 0 فقط في العملية الكاتمة العكوسة؛ والتمدد الحر لا عكوس ويولّد إنتروبيا."
     }
    },
    {
     "en": "The gas cools, because it expands and does work",
     "ar": "يبرد الغاز لأنه يتمدد ويبذل شغلاً",
     "why": {
      "en": "It expands against a vacuum, so no work is done (W = 0); with Q = 0 as well, ΔU = 0 and T of an ideal gas is unchanged.",
      "ar": "يتمدد في فراغ فلا يُبذل شغل (W = 0)؛ ومع Q = 0 تكون ΔU = 0 وحرارة الغاز المثالي لا تتغير."
     }
    },
    {
     "en": "ΔU = 0 and the temperature is unchanged, but the entropy of the gas increases",
     "ar": "ΔU = 0 وتبقى الحرارة دون تغير، لكن إنتروبيا الغاز تزداد",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Free expansion: Q = 0 and W = 0, so ΔU = 0 and T is constant for an ideal gas. The initial and final states can be joined by a reversible isothermal path, giving ΔS = n R ln(V2/V1) > 0.",
    "ar": "التمدد الحر: Q = 0 وW = 0 فـ ΔU = 0 وT ثابتة للغاز المثالي. ويمكن وصل الحالتين بمسار أيزوثيرمي عكوس فينتج ΔS = n R ln(V2/V1) > 0."
   }
  },
  {
   "id": "th-26",
   "subject": "th",
   "topic": "steam",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "An ideal Rankine cycle has these specific enthalpies (given values, kJ/kg): pump inlet h1 = 192, pump outlet h2 = 207, turbine inlet h3 = 3400, turbine outlet h4 = 2200. What is the thermal efficiency?",
    "ar": "دورة رانكين مثالية بالإنثالبيات النوعية التالية (قيم معطاة، kJ/kg): دخول المضخة h1 = 192 وخروجها h2 = 207 ودخول التوربين h3 = 3400 وخروجه h4 = 2200. ما الكفاءة الحرارية؟"
   },
   "opts": [
    {
     "en": "37.11 %",
     "ar": "37.11 %",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "38.05 %",
     "ar": "38.05 %",
     "why": {
      "en": "The pump work was added; the pump CONSUMES work, so it is subtracted from the turbine work.",
      "ar": "أُضيف شغل المضخة؛ والمضخة تستهلك شغلاً فيُطرح من شغل التوربين."
     }
    },
    {
     "en": "37.58 %",
     "ar": "37.58 %",
     "why": {
      "en": "The pump work was neglected; η = (w_turbine − w_pump) / q_in, and here the pump work is not zero.",
      "ar": "أُهمل شغل المضخة؛ η = (w_turbine − w_pump) / q_in وشغل المضخة هنا ليس صفراً."
     }
    },
    {
     "en": "36.94 %",
     "ar": "36.94 %",
     "why": {
      "en": "The heat input was taken from h1; the boiler receives liquid already at h2, so q_in = h3 − h2.",
      "ar": "أُخذت الحرارة الداخلة من h1؛ والمرجل يستقبل السائل عند h2 فتكون q_in = h3 − h2."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "w_T = h3 − h4 = 1200;  w_p = h2 − h1 = 15;  q_in = h3 − h2 = 3193;  η = (1200 − 15) / 3193 = 0.3711 = 37.11 %.",
    "ar": "w_T = h3 − h4 = 1200؛ w_p = h2 − h1 = 15؛ q_in = h3 − h2 = 3193؛ η = (1200 − 15) / 3193 = 0.3711 = 37.11 %."
   }
  },
  {
   "id": "th-27",
   "subject": "th",
   "topic": "heattransfer",
   "level": 3,
   "type": "applied",
   "q": {
    "en": "A 5 m² wall separates indoor air and outdoor air that differ by 25 K. Inside convection coefficient h_i = 10 W/(m²·K); wall thickness 0.1 m with k = 0.5 W/(m·K); outside coefficient h_o = 25 W/(m²·K). What is the steady heat loss?",
    "ar": "جدار مساحته 5 m² يفصل هواءً داخلياً عن خارجي يختلفان بمقدار 25 K. معامل الحمل الداخلي h_i = 10 W/(m²·K)؛ سُمك الجدار 0.1 m وk = 0.5 W/(m·K)؛ ومعامل الحمل الخارجي h_o = 25 W/(m²·K). ما الفقد الحراري في الحالة المستقرة؟"
   },
   "opts": [
    {
     "en": "5000 W",
     "ar": "5000 W",
     "why": {
      "en": "The coefficients were added; in series it is the resistances (1/h, L/k) that add, not the conductances.",
      "ar": "جُمعت المعاملات؛ وفي التوالي تُجمع المقاومات (1/h وL/k) لا الموصلات."
     }
    },
    {
     "en": "367.6 W",
     "ar": "367.6 W",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "416.7 W",
     "ar": "416.7 W",
     "why": {
      "en": "The outside film resistance 1/h_o was forgotten.",
      "ar": "نُسيت مقاومة طبقة الهواء الخارجية 1/h_o."
     }
    },
    {
     "en": "625 W",
     "ar": "625 W",
     "why": {
      "en": "The convection resistances were ignored; both air films add thermal resistance in series.",
      "ar": "أُهملت مقاومتا الحمل؛ فطبقتا الهواء تُضيفان مقاومة حرارية على التوالي."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "R″ = 1/h_i + L/k + 1/h_o = 0.1 + 0.2 + 0.04 = 0.34 m²·K/W;  Q = A ΔT / R″ = 5 × 25 / 0.34 = 367.6 W.",
    "ar": "R″ = 1/h_i + L/k + 1/h_o = 0.1 + 0.2 + 0.04 = 0.34 m²·K/W؛ Q = A ΔT / R″ = 5 × 25 / 0.34 = 367.6 W."
   }
  },
  {
   "id": "th-28",
   "subject": "th",
   "topic": "processes",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "Air (R = 287 J/(kg·K)) at 100 kPa and 300 K is compressed in a polytropic process P v^n = const with n = 1.3 to 500 kPa. What work per kg must be supplied to the air?",
    "ar": "هواء (R = 287 J/(kg·K)) عند 100 kPa و300 K يُضغط بعملية بوليتروبية P v^n = ثابت مع n = 1.3 حتى 500 kPa. ما الشغل لكل kg الذي يجب تزويد الهواء به؟"
   },
   "opts": [
    {
     "en": "138.6 kJ/kg",
     "ar": "138.6 kJ/kg",
     "why": {
      "en": "This is the isothermal (n = 1) work; the polytropic exponent 1.3 gives a different temperature rise and more work in this case.",
      "ar": "هذا شغل العملية الأيزوثيرمية (n = 1)؛ والأس البوليتروبي 1.3 يعطي ارتفاعاً مختلفاً في الحرارة وشغلاً أكبر هنا."
     }
    },
    {
     "en": "129.1 kJ/kg",
     "ar": "129.1 kJ/kg",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "125.7 kJ/kg",
     "ar": "125.7 kJ/kg",
     "why": {
      "en": "The isentropic exponent k = 1.4 was used instead of the given n = 1.3.",
      "ar": "استُعمل أس الأيزنتروبية k = 1.4 بدل n = 1.3 المعطاة."
     }
    },
    {
     "en": "38.73 kJ/kg",
     "ar": "38.73 kJ/kg",
     "why": {
      "en": "The division by (n − 1) was forgotten: w = R (T2 − T1) / (n − 1).",
      "ar": "نُسيت القسمة على (n − 1): w = R (T2 − T1) / (n − 1)."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "T2 = T1 (P2/P1)^((n−1)/n) = 300 × 5^0.2308 = 434.9 K;  w_in = R (T2 − T1) / (n − 1) = 287 × 134.9 / 0.3 = 129100 J/kg = 129.1 kJ/kg.",
    "ar": "T2 = T1 (P2/P1)^((n−1)/n) = 300 × 5^0.2308 = 434.9 K؛ w_in = R (T2 − T1) / (n − 1) = 287 × 134.9 / 0.3 = 129100 J/kg = 129.1 kJ/kg."
   }
  },
  {
   "id": "th-29",
   "subject": "th",
   "topic": "firstlaw",
   "level": 3,
   "type": "applied",
   "q": {
    "en": "Air flows steadily through an adiabatic nozzle (no work, negligible change in elevation). It enters at 500 K with negligible velocity and leaves at 400 K. Take c_p = 1005 J/(kg·K) as constant. What is the exit velocity?",
    "ar": "يتدفق هواء بحالة مستقرة عبر فوهة كاتمة للحرارة (بلا شغل ولا تغير يُذكر في الارتفاع). يدخل عند 500 K بسرعة مهملة ويخرج عند 400 K. خذ c_p = 1005 J/(kg·K) ثابتة. ما سرعة الخروج؟"
   },
   "opts": [
    {
     "en": "448.3 m/s",
     "ar": "448.3 m/s",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "378.9 m/s",
     "ar": "378.9 m/s",
     "why": {
      "en": "c_v was used; in a flow device the energy balance involves the enthalpy change, i.e. c_p ΔT.",
      "ar": "استُعملت c_v؛ وفي أجهزة الجريان يتضمن ميزان الطاقة تغير الإنثالبي أي c_p ΔT."
     }
    },
    {
     "en": "14.18 m/s",
     "ar": "14.18 m/s",
     "why": {
      "en": "c_p was entered in kJ/(kg·K) while the energy was kept in J/kg: units were mixed.",
      "ar": "أُدخلت c_p بـ kJ/(kg·K) مع بقاء الطاقة بـ J/kg: خُلطت الوحدات."
     }
    },
    {
     "en": "317 m/s",
     "ar": "317 m/s",
     "why": {
      "en": "The factor 2 was dropped: h1 = h2 + V²/2 gives V = √(2 c_p ΔT).",
      "ar": "سقط العامل 2: h1 = h2 + V²/2 تعطي V = √(2 c_p ΔT)."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Steady flow, Q = W = 0: h1 = h2 + V²/2 → V = √[2 c_p (T1 − T2)] = √[2 × 1005 × 100] = 448.3 m/s.",
    "ar": "جريان مستقر وQ = W = 0: h1 = h2 + V²/2 ← V = √[2 c_p (T1 − T2)] = √[2 × 1005 × 100] = 448.3 m/s."
   }
  },
  {
   "id": "th-30",
   "subject": "th",
   "topic": "steam",
   "level": 3,
   "type": "concept",
   "q": {
    "en": "Water is a liquid–vapour mixture (wet steam) at a fixed pressure of 200 kPa. More heat is added while both phases remain present. How does the temperature change?",
    "ar": "الماء خليط سائل–بخار (بخار رطب) عند ضغط ثابت 200 kPa. يُضاف مزيد من الحرارة وما زال الطوران موجودين. كيف تتغير الحرارة؟"
   },
   "opts": [
    {
     "en": "It falls, because the vapour expands",
     "ar": "تنخفض لأن البخار يتمدد",
     "why": {
      "en": "At constant pressure the saturation temperature does not fall; the added heat only changes the proportion of vapour.",
      "ar": "عند ضغط ثابت لا تنخفض حرارة التشبع؛ والحرارة المضافة تغيّر نسبة البخار فقط."
     }
    },
    {
     "en": "It stays constant at the saturation temperature for 200 kPa; the added heat increases the quality x",
     "ar": "تبقى ثابتة عند حرارة التشبع المقابلة لـ 200 kPa؛ والحرارة المضافة تزيد النوعية x",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "It depends on the mass of liquid present",
     "ar": "تتوقف على كتلة السائل الموجودة",
     "why": {
      "en": "In the two-phase region T is fixed by pressure alone; the mass fractions change only the quality.",
      "ar": "في منطقة الطورين تتحدد T بالضغط وحده؛ ونِسَب الكتلة تغيّر النوعية فقط."
     }
    },
    {
     "en": "It rises steadily, because heat is being added",
     "ar": "ترتفع باستمرار لأن الحرارة تُضاف",
     "why": {
      "en": "During phase change at constant P, the added heat (latent heat h_fg) converts liquid to vapour instead of raising T.",
      "ar": "أثناء تغير الطور عند P ثابت تُحوّل الحرارة المضافة (الحرارة الكامنة h_fg) السائل إلى بخار بدل رفع T."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "In the saturated mixture region, pressure and temperature are not independent: T = T_sat(P). Heat added at constant P raises x via h = h_f + x h_fg until all liquid has evaporated.",
    "ar": "في منطقة الخليط المشبع لا يكون الضغط والحرارة مستقلين: T = T_sat(P). والحرارة المضافة عند P ثابت ترفع x وفق h = h_f + x h_fg حتى يتبخر كل السائل."
   }
  }
 ]
};
})();
