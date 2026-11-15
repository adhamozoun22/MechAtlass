/* MechAtlas — Production Engineering question bank. Standalone data file; loaded by index.html. */
(function () {
    window.MECHATLAS_QUIZ_BANKS = window.MECHATLAS_QUIZ_BANKS || {};
    window.MECHATLAS_QUIZ_BANKS.pe = {
 "id": "pe",
 "title": {
  "en": "Production Engineering",
  "ar": "هندسة الإنتاج"
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
  "turning": {
   "en": "Turning (lathe)",
   "ar": "التخريط (المخرطة)"
  },
  "milling": {
   "en": "Milling",
   "ar": "التفريز"
  },
  "drilling": {
   "en": "Drilling",
   "ar": "الثقب"
  },
  "welding": {
   "en": "Welding",
   "ar": "اللحام"
  },
  "cnc": {
   "en": "CNC and G-code",
   "ar": "CNC ولغة G"
  },
  "cutting": {
   "en": "Cutting mechanics and tools",
   "ar": "ميكانيك القطع والأدوات"
  },
  "finish": {
   "en": "Surface finish",
   "ar": "جودة السطح"
  }
 },
 "questions": [
  {
   "id": "pe-01",
   "subject": "pe",
   "topic": "turning",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "Which description fits TURNING on a lathe?",
    "ar": "أي وصف يناسب التخريط (Turning) على المخرطة؟"
   },
   "opts": [
    {
     "en": "A rotating drill is pushed into a stationary workpiece",
     "ar": "مثقاب دوّار يُدفع داخل قطعة ساكنة",
     "why": {
      "en": "This describes drilling.",
      "ar": "هذا وصف الثقب."
     }
    },
    {
     "en": "A multi-tooth cutter rotates while the workpiece is held on a moving table",
     "ar": "قاطع متعدد الأسنان يدور بينما القطعة مثبتة على طاولة متحركة",
     "why": {
      "en": "This describes milling, not turning.",
      "ar": "هذا وصف التفريز لا التخريط."
     }
    },
    {
     "en": "A long toothed bar is pulled through the workpiece",
     "ar": "قضيب مسنَّن طويل يُسحب عبر القطعة",
     "why": {
      "en": "This describes broaching.",
      "ar": "هذا وصف البرش (Broaching)."
     }
    },
    {
     "en": "The workpiece rotates while a single-point cutting tool moves along or across it",
     "ar": "تدور القطعة بينما تتحرك أداة قطع أحادية الحد بمحاذاتها أو عبرها",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "In turning the main (cutting) motion is the rotation of the workpiece, and the feed motion belongs to the single-point tool. The result is a surface of revolution (cylinders, cones, faces, threads).",
    "ar": "في التخريط حركة القطع الرئيسية هي دوران القطعة، وحركة التغذية للأداة أحادية الحد، والناتج سطح دوراني (أسطوانات، مخاريط، أوجه، سنون)."
   }
  },
  {
   "id": "pe-02",
   "subject": "pe",
   "topic": "turning",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A bar of diameter 40 mm is turned at a cutting speed of 100 m/min. What spindle speed is needed?",
    "ar": "قضيب قطره 40 mm يُخرَّط بسرعة قطع 100 m/min. ما سرعة المغزل المطلوبة؟"
   },
   "opts": [
    {
     "en": "795.8 rpm",
     "ar": "795.8 rpm",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "0.7958 rpm",
     "ar": "0.7958 rpm",
     "why": {
      "en": "The factor 1000 (m → mm) was left out.",
      "ar": "سقط العامل 1000 (تحويل m إلى mm)."
     }
    },
    {
     "en": "1592 rpm",
     "ar": "1592 rpm",
     "why": {
      "en": "The radius was used instead of the diameter, doubling the speed.",
      "ar": "استُعمل نصف القطر بدل القطر فتضاعفت السرعة."
     }
    },
    {
     "en": "2500 rpm",
     "ar": "2500 rpm",
     "why": {
      "en": "π was left out of the formula.",
      "ar": "سقط π من المعادلة."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "n = 1000 Vc / (π D) = 1000 × 100 / (π × 40) = 795.8 rpm.",
    "ar": "n = 1000 Vc / (π D) = 1000 × 100 / (π × 40) = 795.8 rpm."
   }
  },
  {
   "id": "pe-03",
   "subject": "pe",
   "topic": "drilling",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "In drilling on a drilling machine (drill press), which motions does the drill make?",
    "ar": "في الثقب على آلة الثقب (الثقّابة)، ما الحركتان اللتان يؤديهما المثقاب؟"
   },
   "opts": [
    {
     "en": "It rotates (cutting motion) and moves axially into the work (feed)",
     "ar": "يدور (حركة القطع) ويتحرك محورياً داخل القطعة (التغذية)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "It stays still while the workpiece spins at high speed",
     "ar": "يبقى ساكناً بينما تدور القطعة بسرعة",
     "why": {
      "en": "That is how a drill is used on a LATHE; on a drilling machine the drill spins.",
      "ar": "هكذا يُستعمل المثقاب على المخرطة؛ أما في الثقّابة فالمثقاب هو الذي يدور."
     }
    },
    {
     "en": "It moves back and forth like a reciprocating saw blade",
     "ar": "يتحرك ذهاباً وإياباً كشفرة منشار ترددي",
     "why": {
      "en": "A twist drill cuts by continuous rotation, not reciprocation.",
      "ar": "المثقاب اللولبي يقطع بالدوران المستمر لا بالترددي."
     }
    },
    {
     "en": "It only moves sideways across the work",
     "ar": "يتحرك جانبياً عبر القطعة فقط",
     "why": {
      "en": "Sideways motion cuts slots (milling); a drill feeds along its own axis.",
      "ar": "الحركة الجانبية تُقطّع مجاري (تفريز)؛ والمثقاب يتغذى على محوره."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "The drill rotates to give the cutting speed and is fed along its axis; chips leave through the flutes.",
    "ar": "يدور المثقاب ليعطي سرعة القطع ويتغذى على محوره؛ وتخرج البُرادة عبر الأخاديد."
   }
  },
  {
   "id": "pe-04",
   "subject": "pe",
   "topic": "milling",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "In CONVENTIONAL (up) milling the cutter rotates against the feed direction. How does the chip thickness change along each tooth cut?",
    "ar": "في التفريز التقليدي (Up milling) يدور القاطع عكس اتجاه التغذية. كيف يتغير سُمك الرائش على طول قطع كل سن؟"
   },
   "opts": [
    {
     "en": "It stays constant",
     "ar": "يبقى ثابتاً",
     "why": {
      "en": "The tooth path is a curve, so the chip thickness varies.",
      "ar": "مسار السن منحنٍ فيتغير سُمك الرائش."
     }
    },
    {
     "en": "It starts at its maximum and falls to zero",
     "ar": "يبدأ من أقصاه وينقص إلى الصفر",
     "why": {
      "en": "That is CLIMB (down) milling, where the cutter and the feed move in the same direction.",
      "ar": "هذا هو التفريز المصاحب (Climb)، حيث يتحرك القاطع والتغذية بالاتجاه نفسه."
     }
    },
    {
     "en": "It is zero at both ends and maximum only at the middle",
     "ar": "صفر عند الطرفين وأقصى في المنتصف فقط",
     "why": {
      "en": "In up milling the maximum is reached at the exit, not in the middle.",
      "ar": "في الـUp milling يكون الأقصى عند الخروج لا في المنتصف."
     }
    },
    {
     "en": "It starts at zero and increases to its maximum at the end of the cut",
     "ar": "يبدأ من الصفر ويزداد إلى أقصاه عند نهاية القطع",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Up milling: chip thickness 0 → maximum (the tooth first rubs before it bites). Down milling: maximum → 0 (the tooth bites immediately and leaves a thin chip).",
    "ar": "الـUp milling: السُمك من 0 إلى الأقصى (يحتك السن أولاً ثم يقطع). الـDown milling: من الأقصى إلى 0 (يقطع السن فوراً ويخرج رائش رقيق)."
   }
  },
  {
   "id": "pe-05",
   "subject": "pe",
   "topic": "welding",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "Which arc-welding process uses a NON-consumable tungsten electrode?",
    "ar": "أي عملية لحام بالقوس تستعمل قطباً غير مستهلك من التنغستن؟"
   },
   "opts": [
    {
     "en": "Submerged arc (SAW)",
     "ar": "اللحام المغمور (SAW)",
     "why": {
      "en": "A consumable wire is fed under a blanket of flux.",
      "ar": "يُغذّى سلك مستهلك تحت غطاء من المساعد (Flux)."
     }
    },
    {
     "en": "Stick (SMAW)",
     "ar": "القطب المغلّف (SMAW)",
     "why": {
      "en": "The coated rod melts and fills the joint.",
      "ar": "القضيب المغلّف ينصهر ويملأ الوصلة."
     }
    },
    {
     "en": "MIG/MAG (GMAW)",
     "ar": "MIG/MAG (GMAW)",
     "why": {
      "en": "The wire electrode is consumed and becomes part of the weld.",
      "ar": "سلك القطب يُستهلك ويصير جزءاً من اللحام."
     }
    },
    {
     "en": "TIG (GTAW)",
     "ar": "TIG (GTAW)",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "In TIG the arc is struck by a tungsten electrode that does not melt appreciably; filler rod is added separately if needed, and an inert gas shields the pool.",
    "ar": "في TIG ينشأ القوس بقطب تنغستن لا ينصهر عملياً؛ ويُضاف سلك حشو منفصل عند الحاجة، ويحمي غاز خامل بركة اللحام."
   }
  },
  {
   "id": "pe-06",
   "subject": "pe",
   "topic": "welding",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "What is the main purpose of the shielding gas (or flux) in arc welding?",
    "ar": "ما الغرض الرئيس من غاز الحماية (أو المساعد Flux) في اللحام بالقوس؟"
   },
   "opts": [
    {
     "en": "To protect the molten weld pool from oxygen and nitrogen in the air",
     "ar": "حماية بركة اللحام المنصهرة من أكسجين الهواء ونتروجينه",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "To increase the welding current",
     "ar": "زيادة تيار اللحام",
     "why": {
      "en": "Current is set by the power source, not by the gas.",
      "ar": "التيار يحدده مصدر القدرة لا الغاز."
     }
    },
    {
     "en": "To make the weld bead thicker",
     "ar": "جعل خط اللحام أسمك",
     "why": {
      "en": "Bead size depends on wire feed, current and travel speed.",
      "ar": "حجم الخط يتحدد بتغذية السلك والتيار وسرعة الحركة."
     }
    },
    {
     "en": "To cool the weld as fast as possible",
     "ar": "تبريد اللحام بأسرع ما يمكن",
     "why": {
      "en": "Very fast cooling is usually harmful (hard, brittle zones); cooling is not the purpose.",
      "ar": "التبريد السريع جداً مضرّ غالباً (مناطق صلبة قصفة)؛ وليس هذا الغرض."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Hot molten metal reacts with air (oxides, nitrides, pores). The shield displaces air from the arc zone, giving a sound weld.",
    "ar": "المعدن المنصهر الساخن يتفاعل مع الهواء (أكاسيد، نتريدات، مسامات). والحماية تُبعد الهواء عن منطقة القوس فينتج لحام سليم."
   }
  },
  {
   "id": "pe-07",
   "subject": "pe",
   "topic": "cnc",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "In standard G-code, what is the difference between G00 and G01?",
    "ar": "في لغة G القياسية، ما الفرق بين G00 وG01؟"
   },
   "opts": [
    {
     "en": "Both are rapid moves; G01 is only for the Z axis",
     "ar": "كلاهما سريع؛ وG01 للمحور Z فقط",
     "why": {
      "en": "G01 is a feed move on any programmed axes.",
      "ar": "G01 حركة تغذية على أي محاور مبرمجة."
     }
    },
    {
     "en": "G00 = clockwise arc; G01 = counter-clockwise arc",
     "ar": "G00 = قوس باتجاه عقارب الساعة؛ G01 = عكسها",
     "why": {
      "en": "Arcs are G02 (clockwise) and G03 (counter-clockwise).",
      "ar": "الأقواس هي G02 (مع عقارب الساعة) وG03 (عكسها)."
     }
    },
    {
     "en": "G00 = rapid positioning (non-cutting move); G01 = linear move at the programmed feed rate",
     "ar": "G00 = تموضع سريع (حركة بلا قطع)؛ G01 = حركة خطية بمعدل التغذية المبرمج",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "G00 = linear cutting at feed; G01 = rapid positioning",
     "ar": "G00 = قطع خطي بالتغذية؛ G01 = تموضع سريع",
     "why": {
      "en": "The two are swapped.",
      "ar": "تبدّل الرمزان."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "G00 moves as fast as possible to a position (never use it to cut); G01 moves in a straight line at the feed rate F, which is how material is cut.",
    "ar": "يتحرك G00 بأسرع ما يمكن إلى موضع (لا يُستعمل للقطع)؛ بينما يتحرك G01 في خط مستقيم بالتغذية F وبه يُقطع المعدن."
   }
  },
  {
   "id": "pe-08",
   "subject": "pe",
   "topic": "cnc",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "On a standard CNC machining centre (ISO 841 convention), the Z axis is the axis…",
    "ar": "في مركز تشغيل CNC قياسي (اصطلاح ISO 841)، المحور Z هو المحور…"
   },
   "opts": [
    {
     "en": "along the longest slide of the machine bed",
     "ar": "على أطول مزلاق في سرير الآلة",
     "why": {
      "en": "The axes are named by the spindle and right-hand rule, not by slide length.",
      "ar": "تُسمّى المحاور بالمغزل وقاعدة اليد اليمنى لا بطول المزلاق."
     }
    },
    {
     "en": "chosen freely by each programmer",
     "ar": "يختاره كل مبرمج بحرية",
     "why": {
      "en": "The axes are standardised so programs mean the same thing on different machines.",
      "ar": "المحاور موحّدة كي يعني البرنامج الشيء نفسه على الآلات المختلفة."
     }
    },
    {
     "en": "parallel to the principal spindle (the one that gives the cutting power)",
     "ar": "الموازي للمغزل الرئيسي (الذي يعطي قدرة القطع)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "always the horizontal axis towards the operator",
     "ar": "دائماً المحور الأفقي باتجاه المشغّل",
     "why": {
      "en": "On a vertical machining centre Z is vertical; it follows the spindle.",
      "ar": "في مركز التشغيل العمودي يكون Z رأسياً؛ فهو يتبع المغزل."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "ISO 841: the Z axis is identified by the spindle that imparts cutting power, and X, Y, Z form a right-handed Cartesian system.",
    "ar": "ISO 841: يُعرَّف المحور Z بالمغزل الذي يعطي قدرة القطع، وتشكل X وY وZ جملة ديكارتية يمنى."
   }
  },
  {
   "id": "pe-09",
   "subject": "pe",
   "topic": "turning",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A lathe turns at 500 rpm with a feed of 0.2 mm per revolution. What is the feed rate (carriage speed)?",
    "ar": "مخرطة تدور 500 rpm بتغذية 0.2 mm لكل دورة. ما معدل التغذية (سرعة العربة)؟"
   },
   "opts": [
    {
     "en": "2500 mm/min",
     "ar": "2500 mm/min",
     "why": {
      "en": "The quotient n / f was taken; the feed rate is the PRODUCT f × n.",
      "ar": "أُخذ الحاصل n / f؛ ومعدل التغذية هو الجداء f × n."
     }
    },
    {
     "en": "4.00e-04 mm/min",
     "ar": "4.00e-04 mm/min",
     "why": {
      "en": "The quotient f / n was taken instead of the product.",
      "ar": "أُخذ الحاصل f / n بدل الجداء."
     }
    },
    {
     "en": "100 mm/min",
     "ar": "100 mm/min",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "0.2 mm/min",
     "ar": "0.2 mm/min",
     "why": {
      "en": "The feed per revolution was used as if it were per minute.",
      "ar": "استُعملت التغذية لكل دورة كأنها لكل دقيقة."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "v_f = f × n = 0.2 × 500 = 100 mm/min.",
    "ar": "v_f = f × n = 0.2 × 500 = 100 mm/min."
   }
  },
  {
   "id": "pe-10",
   "subject": "pe",
   "topic": "cutting",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "In turning, Vc = 100 m/min, feed f = 0.2 mm/rev and depth of cut a_p = 2 mm. What is the material removal rate Q = Vc · f · a_p?",
    "ar": "في التخريط: Vc = 100 m/min والتغذية f = 0.2 mm/rev وعمق القطع a_p = 2 mm. ما معدل إزالة المعدن Q = Vc · f · a_p؟"
   },
   "opts": [
    {
     "en": "400 cm³/min",
     "ar": "400 cm³/min",
     "why": {
      "en": "mm³ → cm³ needs ÷1000, not ÷100.",
      "ar": "تحويل mm³ إلى cm³ يحتاج ÷1000 لا ÷100."
     }
    },
    {
     "en": "0.04 cm³/min",
     "ar": "0.04 cm³/min",
     "why": {
      "en": "Vc was not converted from m/min to mm/min (×1000).",
      "ar": "لم يُحوَّل Vc من m/min إلى mm/min (×1000)."
     }
    },
    {
     "en": "40000 cm³/min",
     "ar": "40000 cm³/min",
     "why": {
      "en": "The number is right in mm³/min but the unit is wrong: dividing by 1000 gives cm³/min.",
      "ar": "الرقم صحيح بـmm³/min لكن الوحدة خاطئة: القسمة على 1000 تعطي cm³/min."
     }
    },
    {
     "en": "40 cm³/min",
     "ar": "40 cm³/min",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Q = Vc f a_p = 100000 mm/min × 0.2 × 2 = 40000 mm³/min = 40 cm³/min.",
    "ar": "Q = Vc f a_p = 100000 mm/min × 0.2 × 2 = 40000 mm³/min = 40 cm³/min."
   }
  },
  {
   "id": "pe-11",
   "subject": "pe",
   "topic": "turning",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "How long does one turning pass of length 120 mm take at f = 0.25 mm/rev and n = 480 rpm?",
    "ar": "كم يستغرق تمرير تخريط واحد بطول 120 mm عند f = 0.25 mm/rev وn = 480 rpm؟"
   },
   "opts": [
    {
     "en": "1 min",
     "ar": "1 min",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "14400 min",
     "ar": "14400 min",
     "why": {
      "en": "The three numbers were multiplied; time = length / feed rate.",
      "ar": "ضُربت الأرقام الثلاثة؛ والزمن = الطول / معدل التغذية."
     }
    },
    {
     "en": "480 min",
     "ar": "480 min",
     "why": {
      "en": "The speed n was left out (this is the number of revolutions, not minutes).",
      "ar": "سقطت السرعة n (هذا عدد الدورات لا الدقائق)."
     }
    },
    {
     "en": "0.25 min",
     "ar": "0.25 min",
     "why": {
      "en": "The feed per revolution was left out.",
      "ar": "سقطت التغذية لكل دورة."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "v_f = f n = 0.25 × 480 = 120 mm/min;  t = L / v_f = 120 / 120 = 1 min.",
    "ar": "v_f = f n = 0.25 × 480 = 120 mm/min؛ t = L / v_f = 120 / 120 = 1 min."
   }
  },
  {
   "id": "pe-12",
   "subject": "pe",
   "topic": "cutting",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "Specific cutting force k_c = 2000 N/mm², a_p = 2 mm, f = 0.2 mm/rev, Vc = 100 m/min. What is the cutting power P_c = k_c a_p f Vc / 60 000 (kW)?",
    "ar": "قوة القطع النوعية k_c = 2000 N/mm² وa_p = 2 mm وf = 0.2 mm/rev وVc = 100 m/min. ما قدرة القطع P_c = k_c a_p f Vc / 60 000 (kW)؟"
   },
   "opts": [
    {
     "en": "80 kW",
     "ar": "80 kW",
     "why": {
      "en": "Divided by 1000 only; the 60 (N·m/s conversion from m/min) was left out.",
      "ar": "قُسم على 1000 فقط؛ ونُسي العامل 60 (من m/min إلى m/s)."
     }
    },
    {
     "en": "2.667 kW",
     "ar": "2.667 kW",
     "why": {
      "en": "A factor 2 appears from nowhere (no efficiency is given, so this is the cutting power itself).",
      "ar": "ظهر عامل 2 بلا سبب (لا توجد كفاءة معطاة، فهذه قدرة القطع نفسها)."
     }
    },
    {
     "en": "0.02222 kW",
     "ar": "0.02222 kW",
     "why": {
      "en": "An hour-based conversion (3.6×10⁶) was used instead of 60 000.",
      "ar": "استُعمل تحويل بالساعة (3.6×10⁶) بدل 60 000."
     }
    },
    {
     "en": "1.333 kW",
     "ar": "1.333 kW",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Fc = k_c a_p f = 800 N;  P_c = Fc Vc / 60 000 = 800 × 100 / 60 000 = 1.333 kW. The machine motor must supply more because of its efficiency.",
    "ar": "Fc = k_c a_p f = 800 N؛ P_c = Fc Vc / 60 000 = 800 × 100 / 60 000 = 1.333 kW. ويجب أن يوفر محرك الآلة أكثر بسبب كفاءته."
   }
  },
  {
   "id": "pe-13",
   "subject": "pe",
   "topic": "drilling",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A hole of Ø10 mm and depth 30 mm is drilled at n = 1000 rpm and f = 0.1 mm/rev. Assume the drill point adds 0.3·D to the travel. How long does the drilling take?",
    "ar": "يُثقب ثقب Ø10 mm بعمق 30 mm عند n = 1000 rpm وf = 0.1 mm/rev. افترض أن رأس المثقاب يضيف 0.3·D إلى الشوط. كم يستغرق الثقب؟"
   },
   "opts": [
    {
     "en": "330 min",
     "ar": "330 min",
     "why": {
      "en": "The spindle speed n was left out of the denominator.",
      "ar": "سقطت سرعة المغزل n من المقام."
     }
    },
    {
     "en": "0.33 min",
     "ar": "0.33 min",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "3.3 min",
     "ar": "3.3 min",
     "why": {
      "en": "A power-of-ten slip (f taken as 0.01 mm/rev).",
      "ar": "خطأ بقوة العشرة (أُخذت f = 0.01 mm/rev)."
     }
    },
    {
     "en": "0.3 min",
     "ar": "0.3 min",
     "why": {
      "en": "The extra travel of the drill point (0.3 D) was not included.",
      "ar": "لم تُحسب مسافة رأس المثقاب الإضافية (0.3 D)."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "Travel L = 30 + 0.3 × 10 = 33 mm;  v_f = f n = 100 mm/min;  t = L / v_f = 0.33 min.",
    "ar": "الشوط L = 30 + 0.3 × 10 = 33 mm؛ v_f = f n = 100 mm/min؛ t = L / v_f = 0.33 min."
   }
  },
  {
   "id": "pe-14",
   "subject": "pe",
   "topic": "welding",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A MAG weld is made at 24 V, 200 A and a travel speed of 300 mm/min. With a thermal efficiency factor k = 0.8, what is the heat input in kJ/mm?",
    "ar": "لحام MAG بـ24 V و200 A وسرعة حركة 300 mm/min. بمعامل كفاءة حرارية k = 0.8، ما الحرارة المدخلة بـkJ/mm؟"
   },
   "opts": [
    {
     "en": "0.768 kJ/mm",
     "ar": "0.768 kJ/mm",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "768 kJ/mm",
     "ar": "768 kJ/mm",
     "why": {
      "en": "The conversion J → kJ (÷1000) was forgotten.",
      "ar": "نُسي تحويل J إلى kJ (÷1000)."
     }
    },
    {
     "en": "0.96 kJ/mm",
     "ar": "0.96 kJ/mm",
     "why": {
      "en": "This is the arc energy; the efficiency factor k was not applied.",
      "ar": "هذه طاقة القوس؛ ولم يُطبَّق معامل الكفاءة k."
     }
    },
    {
     "en": "0.0128 kJ/mm",
     "ar": "0.0128 kJ/mm",
     "why": {
      "en": "The factor 60 (seconds per minute, since speed is in mm/min) was left out.",
      "ar": "سقط العامل 60 (ثواني/دقيقة لأن السرعة بـmm/min)."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Arc energy = V I × 60 / (v × 1000) = 24×200×60 / (300×1000) = 0.96 kJ/mm;  heat input = k × arc energy = 0.8 × 0.96 = 0.768 kJ/mm.",
    "ar": "طاقة القوس = V I × 60 / (v × 1000) = 24×200×60 / (300×1000) = 0.96 kJ/mm؛ الحرارة المدخلة = k × طاقة القوس = 0.8 × 0.96 = 0.768 kJ/mm."
   }
  },
  {
   "id": "pe-15",
   "subject": "pe",
   "topic": "welding",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "Which is the most likely cause of round gas pores (porosity) inside a weld?",
    "ar": "ما السبب الأرجح للمسامات الغازية المستديرة داخل اللحام؟"
   },
   "opts": [
    {
     "en": "Using a slightly larger electrode than necessary",
     "ar": "استعمال قطب أكبر قليلاً من اللازم",
     "why": {
      "en": "Electrode size does not by itself generate gas in the pool.",
      "ar": "حجم القطب لا يولّد غازاً في بركة اللحام بمفرده."
     }
    },
    {
     "en": "Contaminated or damp base metal/consumables, or shielding-gas coverage disturbed by draughts",
     "ar": "قطعة أو مواد لحام ملوثة أو رطبة، أو غاز حماية اضطربت تغطيته بتيار هواء",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Letting the weld cool slowly",
     "ar": "ترك اللحام يبرد ببطء",
     "why": {
      "en": "Slow cooling gives gas time to escape; fast freezing traps gas.",
      "ar": "التبريد البطيء يمنح الغاز وقتاً للخروج؛ والتجمد السريع يحبسه."
     }
    },
    {
     "en": "Preheating the plate before welding",
     "ar": "تسخين القطعة مسبقاً قبل اللحام",
     "why": {
      "en": "Preheating drives off moisture and helps hydrogen escape; it reduces porosity risk.",
      "ar": "التسخين المسبق يطرد الرطوبة ويساعد الهيدروجين على الخروج؛ فيقلل خطر المسامات."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "Gas (hydrogen, nitrogen, CO) dissolved in the molten metal is trapped as it freezes. Sources: moisture, oil, rust, damp electrodes, poor shielding. Remedies: clean and dry material, correct gas flow, windshields.",
    "ar": "الغازات (هيدروجين، نتروجين، CO) المنحلة في المعدن المنصهر تُحبس عند تجمده. المصادر: رطوبة، زيت، صدأ، أقطاب رطبة، حماية ضعيفة. العلاج: تنظيف وتجفيف، تدفق غاز صحيح، حواجز رياح."
   }
  },
  {
   "id": "pe-16",
   "subject": "pe",
   "topic": "welding",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A 45° equal-leg fillet weld has a leg length of 8 mm. What is its effective throat thickness a?",
    "ar": "لحام زاوية (Fillet) متساوي الساقين بزاوية 45° وطول ساقه 8 mm. ما سُمك الحلق الفعّال a؟"
   },
   "opts": [
    {
     "en": "11.31 mm",
     "ar": "11.31 mm",
     "why": {
      "en": "The relation was inverted: a = leg × 0.707, not leg / 0.707.",
      "ar": "قُلبت العلاقة: a = leg × 0.707 لا leg / 0.707."
     }
    },
    {
     "en": "5.657 mm",
     "ar": "5.657 mm",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "4 mm",
     "ar": "4 mm",
     "why": {
      "en": "Half the leg is not the throat of a 45° fillet.",
      "ar": "نصف الساق ليس حلق لحام زاوية 45°."
     }
    },
    {
     "en": "8 mm",
     "ar": "8 mm",
     "why": {
      "en": "This is the leg length, not the throat (the throat is the shortest distance from the root to the face).",
      "ar": "هذا طول الساق لا الحلق (الحلق أقصر مسافة بين الجذر والوجه)."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "The throat is the height of the isosceles right triangle: a = leg / √2 = 0.707 × 8 = 5.657 mm. Fillet-weld strength is checked on the throat area.",
    "ar": "الحلق هو ارتفاع المثلث القائم المتساوي الساقين: a = leg / √2 = 0.707 × 8 = 5.657 mm. وتُفحص متانة لحام الزاوية على مساحة الحلق."
   }
  },
  {
   "id": "pe-17",
   "subject": "pe",
   "topic": "cnc",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "The tool is at X10. The next block is \"G91 G01 X5 F100\". Where is the tool afterwards?",
    "ar": "الأداة عند X10. الكتلة التالية \"G91 G01 X5 F100\". أين تصبح الأداة بعدها؟"
   },
   "opts": [
    {
     "en": "X5 (that is what G90 absolute would give)",
     "ar": "X5 (وهذا ما كان سيعطيه G90 المطلق)",
     "why": {
      "en": "G91 is incremental; X5 is the answer only in absolute mode (G90).",
      "ar": "G91 تزايدي؛ وX5 تكون الإجابة في الوضع المطلق (G90) فقط."
     }
    },
    {
     "en": "X−5",
     "ar": "X−5",
     "why": {
      "en": "An incremental move of +5 goes in the positive direction from X10.",
      "ar": "حركة تزايدية +5 تتجه موجباً من X10."
     }
    },
    {
     "en": "X10 (no move)",
     "ar": "X10 (بلا حركة)",
     "why": {
      "en": "The block commands a 5 mm move.",
      "ar": "الكتلة تأمر بحركة 5 mm."
     }
    },
    {
     "en": "X15 (G91 = incremental: 5 mm from the present position)",
     "ar": "X15 (G91 = تزايدي: 5 mm من الموضع الحالي)",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "G90: coordinates measured from the work origin (absolute). G91: coordinates are distances from where the tool is now (incremental). 10 + 5 = 15.",
    "ar": "G90: الإحداثيات من أصل القطعة (مطلق). G91: الإحداثيات مسافات من موضع الأداة الحالي (تزايدي). 10 + 5 = 15."
   }
  },
  {
   "id": "pe-18",
   "subject": "pe",
   "topic": "cnc",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "What does the tool-length offset (G43 with an H number) do on a machining centre?",
    "ar": "ماذا يفعل تعويض طول الأداة (G43 مع رقم H) في مركز التشغيل؟"
   },
   "opts": [
    {
     "en": "It sets the diameter of the cutter",
     "ar": "يحدد قطر القاطع",
     "why": {
      "en": "Diameter is handled by cutter-radius compensation (G41/G42), not by length offset.",
      "ar": "القطر تعالجه تعويض نصف القطر (G41/G42) لا تعويض الطول."
     }
    },
    {
     "en": "It limits the spindle speed",
     "ar": "يحدّ من سرعة المغزل",
     "why": {
      "en": "Spindle speed is set by S, not by the length offset.",
      "ar": "سرعة المغزل تُحدد بـS لا بتعويض الطول."
     }
    },
    {
     "en": "It moves the work origin to a new fixture",
     "ar": "ينقل أصل القطعة إلى تثبيت جديد",
     "why": {
      "en": "That is the work offset (G54–G59).",
      "ar": "هذا هو إزاحة القطعة (G54–G59)."
     }
    },
    {
     "en": "It compensates for the different lengths of tools so each tool tip reaches the programmed Z position",
     "ar": "يعوّض اختلاف أطوال الأدوات فيصل رأس كل أداة إلى الموضع Z المبرمج",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Each tool is measured and its length stored in an offset register. G43 H# adds that value to Z so different tools cut at the same programmed depth.",
    "ar": "يُقاس كل أداة ويُخزَّن طولها في سجل إزاحة. وتضيف G43 H# تلك القيمة إلى Z فتقطع الأدوات المختلفة على العمق المبرمج نفسه."
   }
  },
  {
   "id": "pe-19",
   "subject": "pe",
   "topic": "cutting",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "Which one is NOT a purpose of cutting fluid in machining?",
    "ar": "أيٌّ مما يلي ليس من أغراض سائل القطع في التشغيل؟"
   },
   "opts": [
    {
     "en": "To cool the tool and the workpiece",
     "ar": "تبريد الأداة والقطعة",
     "why": {
      "en": "Cooling IS a main purpose.",
      "ar": "التبريد غرض رئيس فعلاً."
     }
    },
    {
     "en": "To increase friction at the tool–chip interface",
     "ar": "زيادة الاحتكاك عند سطح التماس بين الأداة والرائش",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "To lubricate the tool–chip contact",
     "ar": "تزييت تماس الأداة والرائش",
     "why": {
      "en": "Lubrication IS a purpose (it reduces friction and built-up edge).",
      "ar": "التزييت غرض فعلي (يقلل الاحتكاك والحافة المتراكمة)."
     }
    },
    {
     "en": "To flush chips away from the cutting zone",
     "ar": "جرف الرائش بعيداً عن منطقة القطع",
     "why": {
      "en": "Chip removal IS a purpose.",
      "ar": "إزالة الرائش غرض فعلي."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "Cutting fluids cool, lubricate and wash away chips (and protect against corrosion). Higher friction would raise heat, wear and power, the opposite of the aim.",
    "ar": "تقوم سوائل القطع بالتبريد والتزييت وجرف الرائش (وحماية من التآكل الكيميائي). زيادة الاحتكاك ترفع الحرارة والبلى والقدرة وهو عكس المطلوب."
   }
  },
  {
   "id": "pe-20",
   "subject": "pe",
   "topic": "cutting",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "Taylor tool life: V·Tⁿ = C with n = 0.25. A tool lasts 60 min at 100 m/min. How long will it last at 120 m/min?",
    "ar": "عمر الأداة (تايلور): V·Tⁿ = C مع n = 0.25. تدوم الأداة 60 min عند 100 m/min. كم تدوم عند 120 m/min؟"
   },
   "opts": [
    {
     "en": "28.94 min",
     "ar": "28.94 min",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "124.4 min",
     "ar": "124.4 min",
     "why": {
      "en": "The ratio was inverted: a HIGHER speed gives a SHORTER life.",
      "ar": "قُلبت النسبة: السرعة الأعلى تعطي عمراً أقصر."
     }
    },
    {
     "en": "50 min",
     "ar": "50 min",
     "why": {
      "en": "A linear relation was assumed; tool life falls much faster than speed rises (exponent 1/n = 4).",
      "ar": "افتُرضت علاقة خطية؛ يهبط العمر أسرع بكثير من ارتفاع السرعة (الأس 1/n = 4)."
     }
    },
    {
     "en": "41.67 min",
     "ar": "41.67 min",
     "why": {
      "en": "The exponent 2 was used instead of 1/n = 4.",
      "ar": "استُعمل الأس 2 بدل 1/n = 4."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "T2 = T1 (V1 / V2)^(1/n) = 60 × (100/120)⁴ = 28.94 min. A 20% speed increase cuts tool life by about half.",
    "ar": "T2 = T1 (V1 / V2)^(1/n) = 60 × (100/120)⁴ = 28.94 min. زيادة السرعة 20% تقلّص عمر الأداة إلى نحو النصف."
   }
  },
  {
   "id": "pe-21",
   "subject": "pe",
   "topic": "milling",
   "level": 3,
   "type": "multi",
   "q": {
    "en": "Multi-step problem. A face mill removes a width a_e = 80 mm at depth a_p = 3 mm with a table feed v_f = 400 mm/min. Specific cutting force k_c = 2200 N/mm², machine efficiency 0.8. Answer the three steps (partial credit is given).",
    "ar": "مسألة متعددة الخطوات. فريزة وجهية تزيل عرضاً a_e = 80 mm بعمق a_p = 3 mm وتغذية طاولة v_f = 400 mm/min. قوة القطع النوعية k_c = 2200 N/mm² وكفاءة الآلة 0.8. أجب عن الخطوات الثلاث (يُمنح تقدير جزئي)."
   },
   "steps": [
    {
     "id": "a",
     "q": {
      "en": "Step 1: What is the material removal rate Q = a_p a_e v_f / 1000?",
      "ar": "الخطوة 1: ما معدل إزالة المعدن Q = a_p a_e v_f / 1000؟"
     },
     "opts": [
      {
       "en": "96 cm³/min",
       "ar": "96 cm³/min",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "96000 cm³/min",
       "ar": "96000 cm³/min",
       "why": {
        "en": "The division by 1000 (mm³ → cm³) was left out.",
        "ar": "سقطت القسمة على 1000 (mm³ إلى cm³)."
       }
      },
      {
       "en": "9.6 cm³/min",
       "ar": "9.6 cm³/min",
       "why": {
        "en": "Divided by 10 000 instead of 1000.",
        "ar": "قُسم على 10 000 بدل 1000."
       }
      },
      {
       "en": "32 cm³/min",
       "ar": "32 cm³/min",
       "why": {
        "en": "The depth of cut a_p was left out of the product.",
        "ar": "سقط عمق القطع a_p من الجداء."
       }
      }
     ],
     "ans": 0,
     "exp": {
      "en": "Q = 3 × 80 × 400 / 1000 = 96 cm³/min.",
      "ar": "Q = 3 × 80 × 400 / 1000 = 96 cm³/min."
     }
    },
    {
     "id": "b",
     "q": {
      "en": "Step 2: What is the cutting power P_c = a_e a_p v_f k_c / (60 × 10⁶) (kW)?",
      "ar": "الخطوة 2: ما قدرة القطع P_c = a_e a_p v_f k_c / (60 × 10⁶) (kW)؟"
     },
     "opts": [
      {
       "en": "0.05867 kW",
       "ar": "0.05867 kW",
       "why": {
        "en": "The factor 60 was applied twice.",
        "ar": "طُبّق العامل 60 مرتين."
       }
      },
      {
       "en": "3.52 kW",
       "ar": "3.52 kW",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "2.816 kW",
       "ar": "2.816 kW",
       "why": {
        "en": "Efficiency was multiplied in; cutting power does not include machine losses.",
        "ar": "ضُربت الكفاءة؛ وقدرة القطع لا تشمل خسائر الآلة."
       }
      },
      {
       "en": "211.2 kW",
       "ar": "211.2 kW",
       "why": {
        "en": "The factor 60 (min → s) was left out of the denominator.",
        "ar": "سقط العامل 60 (دقيقة إلى ثانية) من المقام."
       }
      }
     ],
     "ans": 1,
     "exp": {
      "en": "P_c = 80 × 3 × 400 × 2200 / (60 × 10⁶) = 3.52 kW.",
      "ar": "P_c = 80 × 3 × 400 × 2200 / (60 × 10⁶) = 3.52 kW."
     }
    },
    {
     "id": "c",
     "q": {
      "en": "Step 3: What motor power is needed at the machine (efficiency 0.8)?",
      "ar": "الخطوة 3: ما قدرة المحرك اللازمة في الآلة (الكفاءة 0.8)؟"
     },
     "opts": [
      {
       "en": "4.4 kW",
       "ar": "4.4 kW",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "2.816 kW",
       "ar": "2.816 kW",
       "why": {
        "en": "Efficiency was multiplied; losses mean the MOTOR must supply MORE than the cutting power.",
        "ar": "ضُربت الكفاءة؛ الخسائر تعني أن المحرك يجب أن يعطي أكثر من قدرة القطع."
       }
      },
      {
       "en": "3.52 kW",
       "ar": "3.52 kW",
       "why": {
        "en": "This is the cutting power; machine losses were ignored.",
        "ar": "هذه قدرة القطع؛ وأُهملت خسائر الآلة."
       }
      },
      {
       "en": "5.5 kW",
       "ar": "5.5 kW",
       "why": {
        "en": "The efficiency was applied twice.",
        "ar": "طُبّقت الكفاءة مرتين."
       }
      }
     ],
     "ans": 0,
     "exp": {
      "en": "P_motor = P_c / η = 3.52 / 0.8 = 4.4 kW.",
      "ar": "P_motor = P_c / η = 3.52 / 0.8 = 4.4 kW."
     }
    }
   ],
   "exp": {
    "en": "Q = a_p a_e v_f / 1000 (cm³/min), P_c = Q k_c / (60 000) kW, and the motor must supply P_c / η (formulas as in the Sandvik Coromant milling formulas).",
    "ar": "Q = a_p a_e v_f / 1000 (cm³/min) وP_c = Q k_c / 60 000 kW، وعلى المحرك أن يعطي P_c / η (الصيغ كما في صيغ التفريز عند Sandvik Coromant)."
   }
  },
  {
   "id": "pe-22",
   "subject": "pe",
   "topic": "turning",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "Facing with constant surface speed (G96) at 150 m/min: the spindle speed is 477.5 rpm at D = 100 mm. What speed is needed when the tool reaches D = 20 mm?",
    "ar": "تسوية الوجه بسرعة سطحية ثابتة (G96) 150 m/min: سرعة المغزل 477.5 rpm عند D = 100 mm. ما السرعة اللازمة عند وصول الأداة إلى D = 20 mm؟"
   },
   "opts": [
    {
     "en": "95.49 rpm",
     "ar": "95.49 rpm",
     "why": {
      "en": "The ratio was inverted: a SMALLER diameter needs a HIGHER speed.",
      "ar": "قُلبت النسبة: القطر الأصغر يحتاج سرعة أعلى."
     }
    },
    {
     "en": "2387 rpm",
     "ar": "2387 rpm",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "4775 rpm",
     "ar": "4775 rpm",
     "why": {
      "en": "The radius was used instead of the diameter.",
      "ar": "استُعمل نصف القطر بدل القطر."
     }
    },
    {
     "en": "477.5 rpm",
     "ar": "477.5 rpm",
     "why": {
      "en": "The speed would stay constant only in constant-rpm mode (G97), not in constant surface speed.",
      "ar": "تبقى السرعة ثابتة فقط في نمط الدورات الثابتة (G97) لا في السرعة السطحية الثابتة."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "n = 1000 Vc / (π D): n(20 mm) = 1000 × 150 / (π × 20) = 2387 rpm, five times n(100 mm). Real controllers cap the speed (G50 S…) to protect the chuck.",
    "ar": "n = 1000 Vc / (π D): n(20 mm) = 1000 × 150 / (π × 20) = 2387 rpm أي خمسة أضعاف n(100 mm). وتحدّ المتحكمات الفعلية السرعة (G50 S…) لحماية الظرف."
   }
  },
  {
   "id": "pe-23",
   "subject": "pe",
   "topic": "cutting",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "k_c = 2000 N/mm², a_p = 3 mm, f = 0.3 mm/rev on a bar of Ø60 mm. What is the torque the cutting force creates on the workpiece (F_c = k_c a_p f acts tangentially at the surface)?",
    "ar": "k_c = 2000 N/mm² وa_p = 3 mm وf = 0.3 mm/rev على قضيب Ø60 mm. ما العزم الذي تولّده قوة القطع على القطعة (F_c = k_c a_p f تؤثر مماسياً عند السطح)؟"
   },
   "opts": [
    {
     "en": "1.8 N·m",
     "ar": "1.8 N·m",
     "why": {
      "en": "The force in kN was labelled N·m; the lever arm was not used.",
      "ar": "وُضعت القوة بـkN كأنها N·m ولم يُستعمل الذراع."
     }
    },
    {
     "en": "108 N·m",
     "ar": "108 N·m",
     "why": {
      "en": "The diameter was used as the lever arm; the arm is the RADIUS.",
      "ar": "استُعمل القطر كذراع؛ والذراع هو نصف القطر."
     }
    },
    {
     "en": "54 N·m",
     "ar": "54 N·m",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "27 N·m",
     "ar": "27 N·m",
     "why": {
      "en": "D/4 is not the lever arm; it is D/2.",
      "ar": "D/4 ليس الذراع؛ بل D/2."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "F_c = k_c a_p f = 2000 × 3 × 0.3 = 1800 N;  T = F_c × D/2 = 1800 × 0.030 = 54 N·m.",
    "ar": "F_c = k_c a_p f = 2000 × 3 × 0.3 = 1800 N؛ T = F_c × D/2 = 1800 × 0.030 = 54 N·m."
   }
  },
  {
   "id": "pe-24",
   "subject": "pe",
   "topic": "cnc",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "The tool is at X0 Y0. The block \"G02 X20 Y0 I10 J0\" is executed (I, J measured from the arc START point to the arc centre). What are the arc radius and the highest Y reached?",
    "ar": "الأداة عند X0 Y0. تُنفَّذ الكتلة \"G02 X20 Y0 I10 J0\" (I وJ مقيسان من نقطة بداية القوس إلى مركزه). ما نصف قطر القوس وأعلى Y يبلغه؟"
   },
   "opts": [
    {
     "en": "Radius 20 mm; highest Y = +20 mm",
     "ar": "نصف القطر 20 mm؛ أعلى Y = ‎+20 mm",
     "why": {
      "en": "The end point X20 is a chord length, not the radius: the centre is at (10, 0), so the radius is 10.",
      "ar": "النقطة النهائية X20 طول وتر لا نصف القطر: المركز عند (10، 0) فنصف القطر 10."
     }
    },
    {
     "en": "Radius 5 mm; highest Y = +5 mm",
     "ar": "نصف القطر 5 mm؛ أعلى Y = ‎+5 mm",
     "why": {
      "en": "I = 10 is the distance from the start to the CENTRE, which is the radius here (not half of it).",
      "ar": "I = 10 هو المسافة من البداية إلى المركز وهي نصف القطر هنا (لا نصفه)."
     }
    },
    {
     "en": "Radius 10 mm; highest Y = +10 mm (clockwise semicircle through (10, 10))",
     "ar": "نصف القطر 10 mm؛ أعلى Y = ‎+10 mm (نصف دائرة باتجاه عقارب الساعة عبر (10، 10))",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Radius 10 mm; lowest Y = −10 mm (it passes below the X axis)",
     "ar": "نصف القطر 10 mm؛ أدنى Y = ‎−10 mm (يمر أسفل المحور X)",
     "why": {
      "en": "G02 is CLOCKWISE; from the left end of the circle clockwise goes up and over the top. The path below would be G03.",
      "ar": "G02 باتجاه عقارب الساعة؛ من الطرف الأيسر للدائرة يصعد المسار فوق القمة. والمسار السفلي هو G03."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "Centre = start + (I, J) = (10, 0); radius = 10. Going clockwise (viewed from +Z) from the left point (0, 0) to the right point (20, 0) the tool passes over the top, so Y reaches +10.",
    "ar": "المركز = البداية + (I، J) = (10، 0)؛ نصف القطر = 10. بالسير مع عقارب الساعة (من +Z) من النقطة اليسرى (0، 0) إلى اليمنى (20، 0) تمر الأداة فوق القمة فيبلغ Y قيمة +10."
   }
  },
  {
   "id": "pe-25",
   "subject": "pe",
   "topic": "cnc",
   "level": 3,
   "type": "concept",
   "q": {
    "en": "A Ø16 mm end mill machines a contour with cutter-radius compensation active (G41 or G42). The tool CENTRE path is offset from the programmed contour by…",
    "ar": "فريزة طرفية Ø16 mm تشغّل محيطاً مع تفعيل تعويض نصف قطر القاطع (G41 أو G42). مسار مركز الأداة يزاح عن المحيط المبرمج بمقدار…"
   },
   "opts": [
    {
     "en": "0 mm (the centre follows the contour)",
     "ar": "0 mm (يتبع المركز المحيط)",
     "why": {
      "en": "That is what happens with compensation cancelled (G40): the cut would be over- or under-size by a radius.",
      "ar": "هذا ما يحدث عند إلغاء التعويض (G40): فيكون القطع أصغر/أكبر بمقدار نصف قطر."
     }
    },
    {
     "en": "4 mm (a quarter of the diameter)",
     "ar": "4 mm (ربع القطر)",
     "why": {
      "en": "No geometric reason: the offset equals the radius.",
      "ar": "لا سبب هندسياً: الإزاحة تساوي نصف القطر."
     }
    },
    {
     "en": "8 mm (the cutter radius), to the left (G41) or right (G42) of the path direction",
     "ar": "8 mm (نصف قطر القاطع)، إلى يسار (G41) أو يمين (G42) اتجاه المسار",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "16 mm (the cutter diameter)",
     "ar": "16 mm (قطر القاطع)",
     "why": {
      "en": "The tool edge touches the contour, so its centre is one radius away, not a diameter.",
      "ar": "حافة الأداة تلامس المحيط فمركزها على بعد نصف قطر لا قطر."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "G41/G42 shift the path sideways by the radius stored in the tool offset, so the programmer can write the finished contour dimensions directly and wear or re-grinding is corrected by editing one number.",
    "ar": "تزيح G41/G42 المسار جانبياً بنصف القطر المخزن في إزاحة الأداة، فيكتب المبرمج أبعاد المحيط النهائي مباشرة ويُصحَّح البلى أو إعادة الشحذ بتعديل رقم واحد."
   }
  },
  {
   "id": "pe-26",
   "subject": "pe",
   "topic": "welding",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "A steel contains (wt %) C 0.2, Mn 1.2, Cr 0.1, Mo 0.05, V 0.02, Ni 0.3, Cu 0.1. What is its IIW carbon equivalent CE = C + Mn/6 + (Cr + Mo + V)/5 + (Ni + Cu)/15?",
    "ar": "فولاذ يحوي (نسبة وزنية %) C 0.2 وMn 1.2 وCr 0.1 وMo 0.05 وV 0.02 وNi 0.3 وCu 0.1. ما الكربون المكافئ IIW حيث CE = C + Mn/6 + (Cr + Mo + V)/5 + (Ni + Cu)/15؟"
   },
   "opts": [
    {
     "en": "0.4607 %",
     "ar": "0.4607 %",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "0.4913 %",
     "ar": "0.4913 %",
     "why": {
      "en": "The divisors 5 and 15 were swapped between the two groups.",
      "ar": "تبادل المقسومان 5 و15 بين المجموعتين."
     }
    },
    {
     "en": "0.97 %",
     "ar": "0.97 %",
     "why": {
      "en": "The divisors 5 and 15 were left out.",
      "ar": "سقط المقسومان 5 و15."
     }
    },
    {
     "en": "0.4 %",
     "ar": "0.4 %",
     "why": {
      "en": "Only C and Mn were counted; the alloying elements also raise hardenability.",
      "ar": "حُسب C وMn فقط؛ وعناصر السبك ترفع قابلية التصلب أيضاً."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "CE = 0.2 + 1.2/6 + (0.1+0.05+0.02)/5 + (0.3+0.1)/15 = 0.2 + 0.2 + 0.034 + 0.02667 = 0.4607. Values of about 0.45–0.60 are indicatively where preheat is normally required (the standard decides, not the CE alone).",
    "ar": "CE = 0.2 + 1.2/6 + (0.1+0.05+0.02)/5 + (0.3+0.1)/15 = 0.2 + 0.2 + 0.034 + 0.02667 = 0.4607. القيم بين نحو 0.45 و0.60 تعني إرشادياً أن التسخين المسبق مطلوب عادة (والمعيار هو الذي يحسم لا CE وحدها)."
   }
  },
  {
   "id": "pe-27",
   "subject": "pe",
   "topic": "welding",
   "level": 3,
   "type": "concept",
   "q": {
    "en": "Why are welds on a plate often placed symmetrically and in a balanced (alternating) sequence?",
    "ar": "لماذا تُوضع لحامات اللوح غالباً بتماثل وبتسلسل متوازن (متناوب)؟"
   },
   "opts": [
    {
     "en": "To avoid the need for any shielding gas",
     "ar": "لتجنب الحاجة إلى غاز الحماية",
     "why": {
      "en": "The sequence does not replace shielding.",
      "ar": "التسلسل لا يغني عن الحماية."
     }
    },
    {
     "en": "To increase the weld current",
     "ar": "لزيادة تيار اللحام",
     "why": {
      "en": "The current is set on the power source, unrelated to the sequence.",
      "ar": "التيار يُضبط في مصدر القدرة ولا علاقة له بالتسلسل."
     }
    },
    {
     "en": "To make the weld metal harder",
     "ar": "لجعل معدن اللحام أصلد",
     "why": {
      "en": "Hardness depends on composition and cooling, not on the sequence.",
      "ar": "الصلادة تتبع التركيب والتبريد لا التسلسل."
     }
    },
    {
     "en": "To balance the shrinkage forces on both sides so the distortion (bending, angular change) is reduced",
     "ar": "لموازنة قوى الانكماش على الجانبين فيقل التشوه (الانحناء والتغير الزاوي)",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Each weld shrinks as it cools and pulls the plate towards it. Welding one side only bends the part; alternating or symmetric welds make the pulls cancel, so residual distortion is smaller.",
    "ar": "كل لحام ينكمش عند تبريده ويسحب اللوح نحوه. اللحام على جانب واحد يحني القطعة؛ والتناوب أو التماثل يجعل السحوب تلغي بعضها فيقل التشوه المتبقي."
   }
  },
  {
   "id": "pe-28",
   "subject": "pe",
   "topic": "finish",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "In finish turning with feed f = 0.2 mm/rev and tool nose radius r = 0.8 mm, the ideal (geometric) peak-to-valley height is approximately h ≈ f² / (8 r). What is it?",
    "ar": "في التخريط النهائي بتغذية f = 0.2 mm/rev ونصف قطر رأس الأداة r = 0.8 mm، ارتفاع القمة إلى الوادي النظري (الهندسي) يقارب h ≈ f² / (8 r). كم قيمته؟"
   },
   "opts": [
    {
     "en": "6.25 µm",
     "ar": "6.25 µm",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "31.25 µm",
     "ar": "31.25 µm",
     "why": {
      "en": "The feed was not squared: roughness depends on f².",
      "ar": "لم تُربَّع التغذية: الخشونة تتناسب مع f²."
     }
    },
    {
     "en": "0.00625 µm",
     "ar": "0.00625 µm",
     "why": {
      "en": "The conversion mm → µm (×1000) was forgotten.",
      "ar": "نُسي تحويل mm إلى µm (×1000)."
     }
    },
    {
     "en": "1.563 µm",
     "ar": "1.563 µm",
     "why": {
      "en": "This is the approximate Ra = f² / (32 r), the arithmetic mean roughness, not the peak-to-valley height.",
      "ar": "هذه Ra التقريبية = f² / (32 r) أي متوسط الخشونة الحسابي لا ارتفاع القمة إلى الوادي."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "h ≈ f² / (8 r) = 0.2² / (8 × 0.8) = 0.00625 mm = 6.25 µm. Halving the feed cuts it to a quarter; a larger nose radius also helps (ideal geometry only; real surfaces are rougher).",
    "ar": "h ≈ f² / (8 r) = 0.2² / (8 × 0.8) = 0.00625 mm = 6.25 µm. تنصيف التغذية يخفضها إلى الربع؛ وزيادة نصف قطر الرأس تفيد أيضاً (هندسة مثالية فقط؛ والسطح الفعلي أخشن)."
   }
  },
  {
   "id": "pe-29",
   "subject": "pe",
   "topic": "cutting",
   "level": 3,
   "type": "concept",
   "q": {
    "en": "Why is the highest possible cutting speed usually NOT the most economical?",
    "ar": "لماذا لا تكون أعلى سرعة قطع ممكنة هي الأوفر غالباً؟"
   },
   "opts": [
    {
     "en": "Because the workpiece becomes magnetic",
     "ar": "لأن القطعة تصبح ممغنطة",
     "why": {
      "en": "No such effect.",
      "ar": "لا وجود لهذا التأثير."
     }
    },
    {
     "en": "Because the spindle power always decreases at high speed",
     "ar": "لأن قدرة المغزل تنقص دائماً عند السرعة العالية",
     "why": {
      "en": "Cutting power rises with speed for the same cut.",
      "ar": "قدرة القطع ترتفع مع السرعة للقطع نفسه."
     }
    },
    {
     "en": "Tool life falls very quickly with speed (Taylor), so tool cost and tool-change downtime outweigh the time saved",
     "ar": "لأن عمر الأداة ينهار بسرعة مع السرعة (تايلور) فتفوق كلفة الأدوات وتوقف تغييرها الزمن الموفَّر",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Because chips cannot be produced above a certain speed",
     "ar": "لأن الرائش لا يتكوّن فوق سرعة معينة",
     "why": {
      "en": "Chips form over a very wide speed range; the limit is tool wear.",
      "ar": "يتكون الرائش في مدى سرعات واسع جداً؛ والحد هو بلى الأداة."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "Total cost per part has a minimum at a moderate speed (Taylor equation V Tⁿ = C): faster means shorter tool life, more tool changes and more tool cost. The minimum-cost speed is lower than the maximum-production-rate speed.",
    "ar": "للكلفة الكلية للقطعة حداً أدنى عند سرعة معتدلة (معادلة تايلور V Tⁿ = C): الأسرع يعني عمراً أقصر وتغييرات أكثر وكلفة أدوات أعلى. وسرعة الكلفة الأدنى أقل من سرعة أقصى إنتاج."
   }
  },
  {
   "id": "pe-30",
   "subject": "pe",
   "topic": "cnc",
   "level": 3,
   "type": "concept",
   "q": {
    "en": "What does a work offset such as G54 do?",
    "ar": "ماذا يفعل إزاحة القطعة مثل G54؟"
   },
   "opts": [
    {
     "en": "It stores the distance from the machine zero to the workpiece datum, so the program can use part coordinates wherever the part is clamped",
     "ar": "يخزّن المسافة من صفر الآلة إلى مرجع القطعة، فيستعمل البرنامج إحداثيات القطعة أينما ثُبّتت",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "It changes the tool length for every tool",
     "ar": "يغيّر طول كل أداة",
     "why": {
      "en": "Tool length is handled by tool offsets (G43/H), not by G54.",
      "ar": "طول الأداة تعالجه إزاحات الأدوات (G43/H) لا G54."
     }
    },
    {
     "en": "It switches the machine to metric units",
     "ar": "يحوّل الآلة إلى الوحدات المترية",
     "why": {
      "en": "Units are set by G21 (mm) / G20 (inch).",
      "ar": "الوحدات تُحدد بـG21 (mm) / G20 (inch)."
     }
    },
    {
     "en": "It turns the coolant on",
     "ar": "يشغّل سائل التبريد",
     "why": {
      "en": "Coolant is an M-code (e.g. M8).",
      "ar": "التبريد رمز M (مثل M8)."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "G54 (and G55–G59) store fixture/work offsets: the program zero (X0 Y0 Z0 on the part) is related to the machine coordinates, so the same program can run on different fixtures by choosing another offset.",
    "ar": "تخزّن G54 (وG55–G59) إزاحات التثبيت/القطعة: يُربط صفر البرنامج (X0 Y0 Z0 على القطعة) بإحداثيات الآلة، فيمكن تشغيل البرنامج نفسه على تثبيتات مختلفة باختيار إزاحة أخرى."
   }
  }
 ]
};
})();
