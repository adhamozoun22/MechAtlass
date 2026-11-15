/* MechAtlas — Heat Treatment question bank. Standalone data file; loaded by index.html. */
(function () {
    window.MECHATLAS_QUIZ_BANKS = window.MECHATLAS_QUIZ_BANKS || {};
    window.MECHATLAS_QUIZ_BANKS.ht = {
 "id": "ht",
 "title": {
  "en": "Heat Treatment",
  "ar": "المعالجة الحرارية"
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
  "annealing": {
   "en": "Annealing, normalizing, spheroidizing",
   "ar": "التخمير والتطبيع والتكوير"
  },
  "hardening": {
   "en": "Hardening and martensite",
   "ar": "التصليد والمارتنسايت"
  },
  "tempering": {
   "en": "Tempering",
   "ar": "المراجعة (التطبيع بعد التصليد)"
  },
  "hardenability": {
   "en": "Hardenability (Jominy)",
   "ar": "قابلية التصليد (جومني)"
  },
  "ttt": {
   "en": "TTT and CCT diagrams",
   "ar": "مخططات TTT وCCT"
  },
  "case": {
   "en": "Case hardening and surface hardening",
   "ar": "التصليد السطحي والتكربن والنترجة"
  },
  "crit": {
   "en": "Critical temperatures (A1, A3, Acm)",
   "ar": "درجات الحرارة الحرجة (A1 وA3 وAcm)"
  },
  "quench": {
   "en": "Quench media and cooling rate",
   "ar": "وسائط التبريد السريع ومعدل التبريد"
  },
  "stress": {
   "en": "Residual stress, cracking and distortion",
   "ar": "الإجهادات المتبقية والتشقق والتشوه"
  },
  "ppt": {
   "en": "Precipitation hardening",
   "ar": "التصليد بالترسيب"
  },
  "lever": {
   "en": "Fe-C diagram and lever rule",
   "ar": "مخطط Fe-C وقاعدة الرافعة"
  }
 },
 "questions": [
  {
   "id": "ht-01",
   "subject": "ht",
   "topic": "crit",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "Which statement correctly describes the eutectoid reaction of plain-carbon steel on the Fe-Fe3C diagram?",
    "ar": "أي عبارة تصف بشكل صحيح التفاعل الأيوتكتويدي للفولاذ الكربوني العادي على مخطط Fe-Fe3C؟"
   },
   "opts": [
    {
     "en": "Liquid transforms into austenite + cementite at about 727 °C",
     "ar": "ينقلب السائل إلى أوستنايت + سمنتايت عند نحو 727 °C",
     "why": {
      "en": "That is the EUTECTIC reaction, which occurs near 1148 °C and 4.3 wt% C, not at 727 °C.",
      "ar": "هذا هو التفاعل الأيوتكتيكي (اليوتكتيك) ويحدث قرب 1148 °C و4.3 wt% C وليس عند 727 °C."
     }
    },
    {
     "en": "On slow cooling, austenite (about 0.77 wt% C) transforms at about 727 °C into pearlite (ferrite + cementite)",
     "ar": "عند التبريد البطيء يتحول الأوستنايت (نحو 0.77 wt% C) عند نحو 727 °C إلى بيرلايت (فرايت + سمنتايت)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Austenite transforms into martensite at 727 °C",
     "ar": "يتحول الأوستنايت إلى مارتنسايت عند 727 °C",
     "why": {
      "en": "Martensite is not an equilibrium phase and does not appear on the Fe-Fe3C diagram; it forms only by rapid quenching.",
      "ar": "المارتنسايت ليس طوراً اتزانياً ولا يظهر على مخطط Fe-Fe3C؛ ويتكوّن فقط بالتبريد السريع."
     }
    },
    {
     "en": "Ferrite melts and becomes austenite at 727 °C",
     "ar": "ينصهر الفرايت ويصبح أوستنايت عند 727 °C",
     "why": {
      "en": "The 727 °C reaction is a solid-state transformation; no melting occurs at that temperature.",
      "ar": "التفاعل عند 727 °C تحول في الحالة الصلبة ولا يحدث انصهار عند هذه الدرجة."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "The eutectoid reaction is γ → α + Fe3C at about 727 °C and about 0.76-0.77 wt% C. The lamellar mixture of ferrite and cementite is called pearlite.",
    "ar": "التفاعل الأيوتكتويدي هو γ ← α + Fe3C عند نحو 727 °C وتركيز كربون نحو 0.76-0.77 wt%. والخليط الصفائحي من الفرايت والسمنتايت يسمى بيرلايت."
   }
  },
  {
   "id": "ht-02",
   "subject": "ht",
   "topic": "lever",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A 0.4 wt% C steel is cooled very slowly from the austenite region to just below 727 °C. Take the carbon content of ferrite as 0.022 wt% and of the eutectoid (pearlite) as 0.76 wt%. What mass fraction of the steel is pearlite?",
    "ar": "فولاذ يحوي 0.4 wt% كربون بُرّد ببطء شديد من منطقة الأوستنايت إلى ما دون 727 °C بقليل. اعتبر تركيز الكربون في الفرايت 0.022 wt% وفي الأيوتكتويد (البيرلايت) 0.76 wt%. ما الكسر الكتلي للبيرلايت؟"
   },
   "opts": [
    {
     "en": "51.22 %",
     "ar": "51.22 %",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "48.78 %",
     "ar": "48.78 %",
     "why": {
      "en": "This is the proeutectoid ferrite fraction (the other end of the lever), not the pearlite fraction.",
      "ar": "هذا كسر الفرايت السابق للأيوتكتويد (الطرف الآخر للرافعة) وليس كسر البيرلايت."
     }
    },
    {
     "en": "52.63 %",
     "ar": "52.63 %",
     "why": {
      "en": "The solubility of carbon in ferrite (0.022 wt%) was ignored; the lever starts at C_alpha, not at zero.",
      "ar": "أُهملت ذوبانية الكربون في الفرايت (0.022 wt%)؛ فالرافعة تبدأ من C_alpha لا من الصفر."
     }
    },
    {
     "en": "5.97 %",
     "ar": "5.97 %",
     "why": {
      "en": "This is roughly the cementite fraction if the whole alloy were Fe3C-based; the pearlite lever uses the eutectoid point (0.76), not cementite (6.70).",
      "ar": "هذه نسبة تقريبية للسمنتايت؛ أما رافعة البيرلايت فتستعمل نقطة الأيوتكتويد (0.76) لا السمنتايت (6.70)."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Lever rule just below 727 °C: W_pearlite = (C0 − Cα) / (Ce − Cα) = (0.4 − 0.022) / (0.76 − 0.022) = 0.5122 = 51.22 %. The rest (48.78 %) is proeutectoid ferrite.",
    "ar": "قاعدة الرافعة تحت 727 °C مباشرة: W_pearlite = (C0 − Cα) / (Ce − Cα) = (0.4 − 0.022) / (0.76 − 0.022) = 0.5122 = 51.22 %. والباقي (48.78 %) فرايت سابق للأيوتكتويد."
   }
  },
  {
   "id": "ht-03",
   "subject": "ht",
   "topic": "hardening",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "What is martensite in a quenched steel?",
    "ar": "ما المارتنسايت في الفولاذ المصلَّد بالتبريد السريع؟"
   },
   "opts": [
    {
     "en": "An equilibrium phase shown on the Fe-Fe3C phase diagram",
     "ar": "طور اتزاني يظهر على مخطط الاتزان Fe-Fe3C",
     "why": {
      "en": "Martensite is metastable; the equilibrium diagram shows only ferrite, austenite and cementite.",
      "ar": "المارتنسايت طور شبه مستقر؛ والمخطط الاتزاني يبيّن الفرايت والأوستنايت والسمنتايت فقط."
     }
    },
    {
     "en": "A soft phase formed by slow furnace cooling of austenite",
     "ar": "طور لين يتكوّن بالتبريد البطيء في الفرن للأوستنايت",
     "why": {
      "en": "Slow cooling gives diffusional products (pearlite/ferrite), not martensite.",
      "ar": "التبريد البطيء يعطي نواتج انتشارية (بيرلايت/فرايت) لا مارتنسايت."
     }
    },
    {
     "en": "The lamellar mixture of ferrite and cementite",
     "ar": "الخليط الصفائحي من الفرايت والسمنتايت",
     "why": {
      "en": "That is pearlite, formed by diffusion of carbon during slow cooling.",
      "ar": "ذلك هو البيرلايت المتكوّن بانتشار الكربون أثناء التبريد البطيء."
     }
    },
    {
     "en": "A hard, brittle phase formed by a diffusionless (shear) transformation of austenite; carbon is trapped in a supersaturated body-centred tetragonal lattice",
     "ar": "طور صلد وهش يتكوّن بتحول بلا انتشار (قصّي) من الأوستنايت؛ يبقى الكربون محبوساً في شبكة رباعية متمركزة الجسم فوق مشبعة",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "If austenite is cooled fast enough to avoid pearlite and bainite, carbon has no time to diffuse out and the lattice shears to martensite, which is hard but brittle.",
    "ar": "إذا بُرّد الأوستنايت بسرعة كافية لتفادي البيرلايت والبينايت فلا يجد الكربون وقتاً للانتشار وتنقصّ الشبكة إلى مارتنسايت، وهو صلد لكنه هش."
   }
  },
  {
   "id": "ht-04",
   "subject": "ht",
   "topic": "tempering",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "What is the main purpose of tempering a quenched steel?",
    "ar": "ما الغرض الرئيس من مراجعة (tempering) الفولاذ بعد التصليد؟"
   },
   "opts": [
    {
     "en": "To increase the hardness further",
     "ar": "زيادة الصلادة أكثر",
     "why": {
      "en": "Tempering generally lowers hardness; it trades hardness for toughness.",
      "ar": "المراجعة تخفض الصلادة عموماً؛ فهي تبادل الصلادة بالمتانة."
     }
    },
    {
     "en": "To relieve quenching stresses and increase toughness, accepting some loss of hardness",
     "ar": "تخفيف إجهادات التبريد وزيادة المتانة (الصلابة الضدية) مع القبول بفقد بعض الصلادة",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "To transform the steel back to austenite",
     "ar": "إعادة تحويل الفولاذ إلى أوستنايت",
     "why": {
      "en": "Tempering is done below A1 (727 °C), so austenite does not form.",
      "ar": "تُجرى المراجعة تحت A1 (727 °C) فلا يتكوّن أوستنايت."
     }
    },
    {
     "en": "To add carbon to the surface",
     "ar": "إضافة كربون إلى السطح",
     "why": {
      "en": "That is carburizing, a different process.",
      "ar": "هذا هو التكربن (carburizing) وهو عملية مختلفة."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "Untempered martensite is very hard but brittle and highly stressed. Reheating below A1 relieves stress and lets fine carbides form, giving a tougher tempered martensite.",
    "ar": "المارتنسايت غير المراجَع صلد جداً لكنه هش وعالي الإجهاد. إعادة التسخين تحت A1 تخفف الإجهاد وتسمح بتكوّن كربيدات دقيقة فينتج مارتنسايت مراجَع أمتن."
   }
  },
  {
   "id": "ht-05",
   "subject": "ht",
   "topic": "quench",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "For the same part and no agitation difference, which order lists common quenchants from the MOST severe (fastest cooling) to the LEAST severe?",
    "ar": "لنفس القطعة ودون اختلاف في التحريك، أي ترتيب يسرد وسائط التبريد الشائعة من الأشد (الأسرع تبريداً) إلى الأقل شدة؟"
   },
   "opts": [
    {
     "en": "Still air > oil > water > brine",
     "ar": "هواء ساكن > زيت > ماء > محلول ملحي",
     "why": {
      "en": "The order is exactly reversed: air is the mildest quench.",
      "ar": "الترتيب معكوس تماماً: الهواء أخف وسط تبريد."
     }
    },
    {
     "en": "Water > brine > still air > oil",
     "ar": "ماء > محلول ملحي > هواء ساكن > زيت",
     "why": {
      "en": "Brine is faster than water, and oil is much faster than still air.",
      "ar": "المحلول الملحي أسرع من الماء، والزيت أسرع بكثير من الهواء الساكن."
     }
    },
    {
     "en": "Oil > water > brine > still air",
     "ar": "زيت > ماء > محلول ملحي > هواء ساكن",
     "why": {
      "en": "Oil cools more slowly than water because of its lower heat-extraction ability; brine is faster than plain water.",
      "ar": "الزيت أبطأ تبريداً من الماء لضعف قدرته على سحب الحرارة؛ والمحلول الملحي أسرع من الماء العادي."
     }
    },
    {
     "en": "Brine > water > oil > still air",
     "ar": "محلول ملحي > ماء > زيت > هواء ساكن",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Brine breaks the insulating vapour film quickly and cools fastest, followed by water, then oil, then air. A more severe quench gives higher hardness depth but more risk of distortion and cracking.",
    "ar": "يكسر المحلول الملحي غشاء البخار العازل بسرعة فيبرّد أسرع، ثم الماء، ثم الزيت، ثم الهواء. والتبريد الأشد يعطي عمق تصليد أكبر لكن مع خطر أكبر للتشوه والتشقق."
   }
  },
  {
   "id": "ht-06",
   "subject": "ht",
   "topic": "annealing",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "What does full annealing of a steel typically involve, and what is its aim?",
    "ar": "ماذا يتضمن التخمير الكامل (full annealing) للفولاذ عادةً وما هدفه؟"
   },
   "opts": [
    {
     "en": "Heating into the austenite range and cooling very slowly (e.g. in the furnace) to obtain a soft, ductile, easily machined structure",
     "ar": "التسخين إلى منطقة الأوستنايت ثم التبريد البطيء جداً (مثلاً داخل الفرن) للحصول على بنية لينة مطيلة سهلة التشغيل",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Heating and quenching in water to maximise hardness",
     "ar": "التسخين ثم التبريد في الماء لأقصى صلادة",
     "why": {
      "en": "That is hardening (quenching), the opposite of annealing.",
      "ar": "هذا تصليد بالتبريد السريع وهو عكس التخمير."
     }
    },
    {
     "en": "Heating just below 300 °C to relieve stress in martensite",
     "ar": "التسخين إلى ما دون 300 °C لتخفيف الإجهاد في المارتنسايت",
     "why": {
      "en": "That describes low-temperature tempering, not full annealing.",
      "ar": "هذا وصف للمراجعة عند حرارة منخفضة لا للتخمير الكامل."
     }
    },
    {
     "en": "Diffusing carbon into the surface of low-carbon steel",
     "ar": "نشر الكربون في سطح فولاذ منخفض الكربون",
     "why": {
      "en": "That is carburizing, a surface-hardening process.",
      "ar": "هذا هو التكربن وهو عملية تصليد سطحي."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Slow cooling lets austenite transform near equilibrium into coarse pearlite (plus ferrite or cementite), the softest condition, which also relieves residual stress and refines machinability.",
    "ar": "التبريد البطيء يسمح للأوستنايت بالتحول قرب الاتزان إلى بيرلايت خشن (مع فرايت أو سمنتايت) وهي أنعم حالة، كما تُزال الإجهادات المتبقية وتتحسن قابلية التشغيل."
   }
  },
  {
   "id": "ht-07",
   "subject": "ht",
   "topic": "case",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "What is the goal of case hardening a gear made of low-carbon steel?",
    "ar": "ما هدف التصليد السطحي (case hardening) لترس من فولاذ منخفض الكربون؟"
   },
   "opts": [
    {
     "en": "Removal of carbon from the surface (decarburization)",
     "ar": "إزالة الكربون من السطح (إزالة الكربنة)",
     "why": {
      "en": "Decarburization softens the surface and is an unwanted defect, not a hardening process.",
      "ar": "إزالة الكربنة تلين السطح وهي عيب غير مرغوب لا عملية تصليد."
     }
    },
    {
     "en": "A soft, ductile surface over a hard core",
     "ar": "سطح لين مطيل فوق قلب صلد",
     "why": {
      "en": "The opposite: the surface is made hard, the core tough.",
      "ar": "العكس: يُجعل السطح صلداً والقلب متيناً."
     }
    },
    {
     "en": "A hard, wear-resistant surface layer with a tough, ductile core",
     "ar": "طبقة سطحية صلدة مقاومة للبلى مع قلب متين مطيل",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "A uniformly hard part from surface to centre",
     "ar": "قطعة متجانسة الصلادة من السطح إلى المركز",
     "why": {
      "en": "Case hardening deliberately keeps the core soft and tough.",
      "ar": "التصليد السطحي يُبقي القلب لينّاً ومتيناً عمداً."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "Gears and cams need high surface hardness against wear and contact fatigue but a tough core against shock. Carburizing, nitriding, induction or flame hardening give this combination.",
    "ar": "تحتاج التروس والكامات صلادة سطحية عالية ضد البلى وكلال التلامس مع قلب متين ضد الصدمات. ويعطي ذلك التكربن أو النترجة أو التصليد بالحث أو باللهب."
   }
  },
  {
   "id": "ht-08",
   "subject": "ht",
   "topic": "stress",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A free steel bar 200 mm long (α = 12×10⁻⁶ /K) is heated from 20 °C to 820 °C. By how much does it elongate?",
    "ar": "قضيب فولاذي حر طوله 200 mm (α = 12×10⁻⁶ /K) سُخّن من 20 °C إلى 820 °C. كم يستطيل؟"
   },
   "opts": [
    {
     "en": "1.968 mm",
     "ar": "1.968 mm",
     "why": {
      "en": "The final temperature was used instead of the temperature CHANGE ΔT = 800 K.",
      "ar": "استُعملت الحرارة النهائية بدل التغير في الحرارة ΔT = 800 K."
     }
    },
    {
     "en": "0.00192 mm",
     "ar": "0.00192 mm",
     "why": {
      "en": "A unit slip: the length was converted to metres but the result was still labelled mm.",
      "ar": "خطأ وحدات: حُوّل الطول إلى متر ثم كُتبت النتيجة بـmm."
     }
    },
    {
     "en": "1.92 mm",
     "ar": "1.92 mm",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "0.0096 mm",
     "ar": "0.0096 mm",
     "why": {
      "en": "The length was left out; α ΔT is the dimensionless strain, which must be multiplied by L.",
      "ar": "أُهمل الطول؛ α ΔT هو الانفعال (بلا أبعاد) ويجب ضربه في L."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "ΔL = α L ΔT = 12×10⁻⁶ × 200 mm × 800 K = 1.92 mm.",
    "ar": "ΔL = α L ΔT = 12×10⁻⁶ × 200 mm × 800 K = 1.92 mm."
   }
  },
  {
   "id": "ht-09",
   "subject": "ht",
   "topic": "crit",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "For a hypoeutectoid steel (less than 0.77 wt% C) heated slowly, what does the critical temperature A3 (Ac3) mark?",
    "ar": "عند تسخين فولاذ تحت أيوتكتويدي (أقل من 0.77 wt% C) ببطء، ماذا تمثل درجة الحرارة الحرجة A3 (Ac3)؟"
   },
   "opts": [
    {
     "en": "The temperature above which the structure has become fully austenitic",
     "ar": "الدرجة التي تصبح البنية فوقها أوستنايتية بالكامل",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "The temperature at which pearlite first forms from cementite",
     "ar": "الدرجة التي يتكون عندها البيرلايت أول مرة من السمنتايت",
     "why": {
      "en": "Pearlite forms from austenite at A1 (727 °C), not from cementite.",
      "ar": "يتكون البيرلايت من الأوستنايت عند A1 (727 °C) لا من السمنتايت."
     }
    },
    {
     "en": "The temperature at which the steel starts to melt",
     "ar": "الدرجة التي يبدأ عندها الفولاذ بالانصهار",
     "why": {
      "en": "Melting begins at much higher temperature (the solidus, above about 1400 °C for low-carbon steels).",
      "ar": "يبدأ الانصهار عند حرارة أعلى بكثير (خط الصلبية، فوق نحو 1400 °C للفولاذ منخفض الكربون)."
     }
    },
    {
     "en": "The temperature at which martensite starts to form on quenching",
     "ar": "الدرجة التي يبدأ عندها تكوّن المارتنسايت عند التبريد السريع",
     "why": {
      "en": "That is the Ms temperature, a different quantity, far below A1.",
      "ar": "تلك هي درجة Ms وهي كمية مختلفة وأقل بكثير من A1."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Between A1 (727 °C) and A3 a hypoeutectoid steel is austenite + proeutectoid ferrite. Above A3 only austenite remains, so hardening heat treatments austenitize a little above A3.",
    "ar": "بين A1 (727 °C) وA3 يكون الفولاذ التحت أيوتكتويدي أوستنايت + فرايت سابق للأيوتكتويد. وفوق A3 يبقى الأوستنايت وحده، لذلك يُسخَّن للتصليد قليلاً فوق A3."
   }
  },
  {
   "id": "ht-10",
   "subject": "ht",
   "topic": "ppt",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "In which order are the three basic steps of precipitation (age) hardening of an aluminium alloy carried out?",
    "ar": "بأي ترتيب تُنفَّذ الخطوات الثلاث الأساسية للتصليد بالترسيب (التعتيق) لسبيكة ألمنيوم؟"
   },
   "opts": [
    {
     "en": "Solution heat treatment → rapid quench → aging",
     "ar": "معالجة المحلول (solution treatment) ← تبريد سريع ← تعتيق (aging)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Solution heat treatment → slow furnace cooling → aging",
     "ar": "معالجة المحلول ← تبريد بطيء في الفرن ← تعتيق",
     "why": {
      "en": "Slow cooling lets coarse equilibrium precipitates form, so no supersaturated solution is left to harden on aging.",
      "ar": "التبريد البطيء يسمح بتكوّن رواسب اتزانية خشنة فلا يبقى محلول فوق مشبع يتصلب عند التعتيق."
     }
    },
    {
     "en": "Quench → solution heat treatment → aging",
     "ar": "تبريد سريع ← معالجة المحلول ← تعتيق",
     "why": {
      "en": "The quench must come AFTER heating into the single-phase region; otherwise there is nothing to trap.",
      "ar": "يجب أن يأتي التبريد السريع بعد التسخين إلى منطقة الطور الواحد؛ وإلا فلا شيء يُحتجز."
     }
    },
    {
     "en": "Aging → quench → solution heat treatment",
     "ar": "تعتيق ← تبريد سريع ← معالجة المحلول",
     "why": {
      "en": "Precipitates cannot be formed before the solute has been dissolved and retained by quenching.",
      "ar": "لا يمكن تكوين الرواسب قبل إذابة المذاب واحتجازه بالتبريد السريع."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Heating dissolves the alloying element (e.g. Cu) into a single-phase solid solution; quenching traps a supersaturated solution; aging at a lower temperature precipitates fine particles that block dislocations.",
    "ar": "التسخين يذيب عنصر السبك (مثل Cu) في محلول صلب أحادي الطور؛ والتبريد السريع يحتجز محلولاً فوق مشبع؛ والتعتيق عند حرارة أقل يرسّب جسيمات دقيقة تعيق حركة الانخلاعات."
   }
  },
  {
   "id": "ht-11",
   "subject": "ht",
   "topic": "lever",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A 1.2 wt% C steel is slowly cooled from the austenite region. Just above 727 °C it is austenite (0.76 wt% C at that temperature) plus proeutectoid cementite (6.7 wt% C). What mass fraction of the steel is proeutectoid cementite?",
    "ar": "فولاذ يحوي 1.2 wt% C بُرّد ببطء من منطقة الأوستنايت. فوق 727 °C بقليل يتكوّن من أوستنايت (فيه 0.76 wt% C عند هذه الدرجة) وسمنتايت سابق للأيوتكتويد (6.7 wt% C). ما الكسر الكتلي للسمنتايت السابق للأيوتكتويد؟"
   },
   "opts": [
    {
     "en": "7.407 %",
     "ar": "7.407 %",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "17.64 %",
     "ar": "17.64 %",
     "why": {
      "en": "This is the TOTAL cementite fraction after the eutectoid reaction (it includes cementite inside pearlite).",
      "ar": "هذا كسر السمنتايت الكلي بعد التفاعل الأيوتكتويدي (يشمل السمنتايت داخل البيرلايت)."
     }
    },
    {
     "en": "92.59 %",
     "ar": "92.59 %",
     "why": {
      "en": "The lever arms were swapped: this is the austenite (future pearlite) fraction.",
      "ar": "تبادلت أذرع الرافعة: هذا هو كسر الأوستنايت (البيرلايت المستقبلي)."
     }
    },
    {
     "en": "6.567 %",
     "ar": "6.567 %",
     "why": {
      "en": "The tie-line must run between the austenite (0.76) and cementite (6.70) compositions, so the denominator is 6.70 − 0.76, not 6.70.",
      "ar": "يجب أن يمتد خط الربط بين تركيبي الأوستنايت (0.76) والسمنتايت (6.70) فالمقام 6.70 − 0.76 لا 6.70."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "W_cementite = (C0 − Cγ) / (C_Fe3C − Cγ) = (1.2 − 0.76) / (6.7 − 0.76) = 0.07407 = 7.407 %.",
    "ar": "W_cementite = (C0 − Cγ) / (C_Fe3C − Cγ) = (1.2 − 0.76) / (6.7 − 0.76) = 0.07407 = 7.407 %."
   }
  },
  {
   "id": "ht-12",
   "subject": "ht",
   "topic": "hardenability",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "In Jominy end-quench tests, steels A and B both reach about 60 HRC at the water-quenched end. A drops below 40 HRC by 5 mm from the end; B stays above 50 HRC out to 20 mm. Which statement is correct?",
    "ar": "في اختبار جومني للتبريد من الطرف، يصل الفولاذان A وB إلى نحو 60 HRC عند الطرف المبرَّد بالماء. ينخفض A تحت 40 HRC عند 5 mm من الطرف بينما يبقى B فوق 50 HRC حتى 20 mm. أي عبارة صحيحة؟"
   },
   "opts": [
    {
     "en": "The two have equal hardenability because their end hardness is equal",
     "ar": "للفولاذين قابلية تصليد متساوية لأن صلادة الطرف متساوية",
     "why": {
      "en": "Hardenability means the DEPTH of hardening, not the maximum hardness (which depends mainly on carbon).",
      "ar": "قابلية التصليد تعني عمق التصليد لا أقصى صلادة (التي تعتمد أساساً على الكربون)."
     }
    },
    {
     "en": "Hardenability cannot be compared from a Jominy test",
     "ar": "لا يمكن مقارنة قابلية التصليد من اختبار جومني",
     "why": {
      "en": "Comparing the hardness-versus-distance curves is exactly what the Jominy test is designed for.",
      "ar": "مقارنة منحنيات الصلادة مقابل المسافة هي بالضبط غاية اختبار جومني."
     }
    },
    {
     "en": "B has the higher hardenability, because it keeps martensite to a greater depth",
     "ar": "B أعلى قابلية للتصليد لأنه يحتفظ بالمارتنسايت إلى عمق أكبر",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "A has the higher hardenability because its hardness drops faster",
     "ar": "A أعلى قابلية للتصليد لأن صلادته تنخفض أسرع",
     "why": {
      "en": "A fast drop shows that cooling away from the end is too slow to give martensite: LOW hardenability.",
      "ar": "الانخفاض السريع يبيّن أن التبريد بعيداً عن الطرف بطيء لا يعطي مارتنسايت: قابلية تصليد منخفضة."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "The Jominy bar is quenched on one end only; cooling slows with distance. A shallow hardness drop means martensite forms even at slow cooling rates, i.e. high hardenability.",
    "ar": "يُبرَّد قضيب جومني من طرف واحد فقط ويبطؤ التبريد مع المسافة. والانخفاض الضحل في الصلادة يعني تكوّن المارتنسايت حتى بمعدلات تبريد بطيئة أي قابلية تصليد عالية."
   }
  },
  {
   "id": "ht-13",
   "subject": "ht",
   "topic": "ttt",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "What does an isothermal transformation (TTT) diagram of a steel show?",
    "ar": "ماذا يبيّن مخطط التحول متساوي الحرارة (TTT) للفولاذ؟"
   },
   "opts": [
    {
     "en": "How long austenite takes to start and finish transforming when held at a constant temperature below A1 (time on a log scale)",
     "ar": "المدة التي يستغرقها الأوستنايت ليبدأ التحول وينتهي عند تثبيته على درجة حرارة ثابتة تحت A1 (الزمن بمقياس لوغاريتمي)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "The equilibrium phases as a function of carbon content",
     "ar": "الأطوار الاتزانية بدلالة نسبة الكربون",
     "why": {
      "en": "That is the Fe-Fe3C phase diagram; a TTT diagram is about kinetics.",
      "ar": "هذا مخطط الاتزان Fe-Fe3C؛ أما TTT فيتعلق بالحركية."
     }
    },
    {
     "en": "Stress against strain at different temperatures",
     "ar": "الإجهاد مقابل الانفعال عند درجات حرارة مختلفة",
     "why": {
      "en": "That is a tensile-test result and has nothing to do with phase transformation kinetics.",
      "ar": "هذه نتيجة اختبار شد ولا علاقة لها بحركية تحولات الأطوار."
     }
    },
    {
     "en": "Transformation during continuous cooling at a constant rate",
     "ar": "التحول أثناء التبريد المستمر بمعدل ثابت",
     "why": {
      "en": "That is the CCT (continuous cooling) diagram; TTT curves refer to constant-temperature holds.",
      "ar": "هذا مخطط CCT (التبريد المستمر)؛ أما منحنيات TTT فتخص التثبيت على حرارة ثابتة."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Each C-shaped curve gives the time for a given fraction of austenite to transform at a fixed temperature. The \"nose\" is where transformation is fastest; below it martensite forms from Ms downward if cooling is quick enough.",
    "ar": "يعطي كل منحنى على شكل C الزمن اللازم لتحول كسر معيّن من الأوستنايت عند حرارة ثابتة. و«الأنف» هو موضع أسرع تحول؛ وتحته يتكوّن المارتنسايت من Ms نزولاً إذا كان التبريد سريعاً بما يكفي."
   }
  },
  {
   "id": "ht-14",
   "subject": "ht",
   "topic": "hardening",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "For a plain-carbon steel that is fully transformed to martensite, which factor mainly sets the maximum hardness reached?",
    "ar": "لفولاذ كربوني عادي تحوّل كلياً إلى مارتنسايت، أي عامل يحدد أساساً أقصى صلادة يبلغها؟"
   },
   "opts": [
    {
     "en": "Its carbon content",
     "ar": "نسبة الكربون فيه",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "The chromium content of the steel",
     "ar": "نسبة الكروم في الفولاذ",
     "why": {
      "en": "A plain-carbon steel has no significant chromium; and alloying mainly raises hardenability rather than maximum hardness.",
      "ar": "الفولاذ الكربوني العادي لا يحوي كروماً يُعتد به؛ والسبائك ترفع أساساً قابلية التصليد لا أقصى صلادة."
     }
    },
    {
     "en": "The length of the part",
     "ar": "طول القطعة",
     "why": {
      "en": "Size affects how deep martensite forms (hardenability, cooling rate) but not the hardness of the martensite itself.",
      "ar": "الحجم يؤثر في عمق تكوّن المارتنسايت (قابلية التصليد ومعدل التبريد) لا في صلادة المارتنسايت نفسه."
     }
    },
    {
     "en": "The temperature of the quench bath",
     "ar": "درجة حرارة حوض التبريد",
     "why": {
      "en": "The bath only has to be cold/fast enough to form martensite; beyond that it does not raise the maximum hardness.",
      "ar": "يكفي أن يكون الحوض بارداً/سريعاً بما يكفي لتكوين المارتنسايت؛ وما بعد ذلك لا يرفع أقصى صلادة."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Martensite hardness is controlled by how much carbon is trapped in the lattice. Quench severity and alloying decide whether and how deep martensite forms, not its maximum hardness.",
    "ar": "تتحدد صلادة المارتنسايت بكمية الكربون المحبوسة في الشبكة. أما شدة التبريد والسبائك فتقرران هل يتكوّن المارتنسايت وإلى أي عمق، لا أقصى صلادته."
   }
  },
  {
   "id": "ht-15",
   "subject": "ht",
   "topic": "case",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "Why is gas nitriding of an alloy-steel part usually associated with less distortion than carburizing followed by a quench?",
    "ar": "لماذا ترتبط نترجة الغاز لقطعة من فولاذ سبائكي عادةً بتشوه أقل مقارنة بالتكربن يعقبه تبريد سريع؟"
   },
   "opts": [
    {
     "en": "It is done at a higher temperature than carburizing",
     "ar": "تُجرى عند حرارة أعلى من التكربن",
     "why": {
      "en": "Nitriding is done at lower temperature (about 480-590 °C) than carburizing (about 815-980 °C).",
      "ar": "النترجة تُجرى عند حرارة أدنى (نحو 480-590 °C) من التكربن (نحو 815-980 °C)."
     }
    },
    {
     "en": "It melts the surface layer, which relaxes the stresses",
     "ar": "تصهر الطبقة السطحية فتخفف الإجهادات",
     "why": {
      "en": "The surface is not melted; nitriding is a solid-state diffusion process.",
      "ar": "لا ينصهر السطح؛ فالنترجة عملية انتشار في الحالة الصلبة."
     }
    },
    {
     "en": "It requires a brine quench from above A3 to form the nitrides",
     "ar": "تتطلب تبريداً في محلول ملحي من فوق A3 لتكوين النتريدات",
     "why": {
      "en": "The hard nitrides form during the nitriding treatment itself; no austenitizing and quench is needed.",
      "ar": "تتكوّن النتريدات الصلدة أثناء المعالجة نفسها ولا حاجة إلى أوستنة وتبريد سريع."
     }
    },
    {
     "en": "It is done at a lower temperature (about 480-590 °C, below A1) and needs no quench, so there is no phase change or severe thermal shock",
     "ar": "تُجرى عند حرارة أدنى (نحو 480-590 °C، أقل من A1) ولا تحتاج تبريداً سريعاً فلا يحدث تحول طوري ولا صدمة حرارية شديدة",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Carburized parts are austenitized and quenched, producing martensite expansion and thermal gradients. Nitriding stays in the ferritic condition at roughly 500 °C and relies on hard nitrides, so dimensional change is small.",
    "ar": "تُؤوستَن القطع المكربنة وتُبرَّد سريعاً فيحدث تمدد المارتنسايت وتدرجات حرارية. أما النترجة فتبقى في الحالة الفرايتية عند نحو 500 °C وتعتمد على نتريدات صلدة فيكون التغير البُعدي صغيراً."
   }
  },
  {
   "id": "ht-16",
   "subject": "ht",
   "topic": "quench",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A steel part is oil-quenched from 850 °C. It takes 3.0 s to cool from 850 °C to 400 °C (the range containing the pearlite/bainite nose). What is the average cooling rate over this range?",
    "ar": "قطعة فولاذية تُبرَّد بالزيت من 850 °C. تستغرق 3.0 s لتنخفض من 850 °C إلى 400 °C (النطاق الذي يضم أنف البيرلايت/البينايت). ما متوسط معدل التبريد في هذا النطاق؟"
   },
   "opts": [
    {
     "en": "283.3 °C/s",
     "ar": "283.3 °C/s",
     "why": {
      "en": "The starting temperature (850 °C) was divided by the time; the rate uses the temperature DROP (450 K).",
      "ar": "قُسمت الحرارة الابتدائية (850 °C) على الزمن؛ والمعدل يستعمل انخفاض الحرارة (450 K)."
     }
    },
    {
     "en": "1350 °C/s",
     "ar": "1350 °C/s",
     "why": {
      "en": "The temperature drop was multiplied by the time instead of divided by it.",
      "ar": "ضُرب انخفاض الحرارة في الزمن بدل قسمته عليه."
     }
    },
    {
     "en": "208.3 °C/s",
     "ar": "208.3 °C/s",
     "why": {
      "en": "The mean temperature was used instead of the temperature difference.",
      "ar": "استُعملت الحرارة المتوسطة بدل فرق الحرارة."
     }
    },
    {
     "en": "150 °C/s",
     "ar": "150 °C/s",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Rate = ΔT / Δt = (850 − 400) / 3.0 = 150 °C/s. If this exceeds the critical cooling rate of the steel (a value read from its CCT/TTT diagram), martensite forms.",
    "ar": "المعدل = ΔT / Δt = (850 − 400) / 3.0 = 150 °C/s. فإذا تجاوز معدل التبريد الحرج للفولاذ (يُقرأ من مخطط CCT/TTT) تكوّن المارتنسايت."
   }
  },
  {
   "id": "ht-17",
   "subject": "ht",
   "topic": "stress",
   "level": 2,
   "type": "applied",
   "q": {
    "en": "A complex tool steel part with sharp internal corners cracks when quenched in brine. Which corrective measure is most appropriate?",
    "ar": "قطعة معقدة من فولاذ العدد ذات زوايا داخلية حادة تتشقق عند تبريدها في محلول ملحي. ما الإجراء التصحيحي الأنسب؟"
   },
   "opts": [
    {
     "en": "Use a less severe quenchant (e.g. oil), add fillet radii, and temper promptly after the quench",
     "ar": "استعمال وسط تبريد أقل شدة (مثل الزيت) وإضافة أنصاف أقطار تدوير للزوايا والمراجعة فور التبريد",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Make the internal corners even sharper to help the heat leave",
     "ar": "جعل الزوايا الداخلية أحد لتسهيل خروج الحرارة",
     "why": {
      "en": "Sharp corners are stress concentrators where quench cracks start.",
      "ar": "الزوايا الحادة مركّزات إجهاد تبدأ منها شقوق التبريد."
     }
    },
    {
     "en": "Quench in a still more severe medium to shorten the cooling time",
     "ar": "التبريد في وسط أشد لتقصير زمن التبريد",
     "why": {
      "en": "A more severe quench increases thermal gradients and transformation stresses, making cracking MORE likely.",
      "ar": "التبريد الأشد يزيد التدرجات الحرارية وإجهادات التحول فيزيد احتمال التشقق."
     }
    },
    {
     "en": "Leave the part untempered for several days to relax",
     "ar": "ترك القطعة دون مراجعة عدة أيام لترتخي",
     "why": {
      "en": "Untempered martensite stays highly stressed and brittle; delayed cracking can occur, so tempering should follow promptly.",
      "ar": "المارتنسايت غير المراجَع يبقى عالي الإجهاد وهشاً وقد يحدث تشقق متأخر؛ لذا تجب المراجعة سريعاً."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Quench cracks come from steep thermal gradients and the volume expansion of martensite, concentrated at sharp corners. Milder quenching, generous fillets and prompt tempering reduce the risk.",
    "ar": "تنشأ شقوق التبريد من التدرجات الحرارية الحادة وتمدد المارتنسايت وتتركز عند الزوايا الحادة. والتبريد الألطف والتدوير السخي للزوايا والمراجعة الفورية تقلل الخطر."
   }
  },
  {
   "id": "ht-18",
   "subject": "ht",
   "topic": "annealing",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "What is the purpose of spheroidizing a high-carbon steel, and how is it done?",
    "ar": "ما الغرض من تكوير (spheroidizing) فولاذ عالي الكربون وكيف يُجرى؟"
   },
   "opts": [
    {
     "en": "To make cementite form rounded particles in a ferrite matrix (soft, machinable); done by prolonged holding just below A1 (about 700 °C)",
     "ar": "لتكوين السمنتايت جسيمات مستديرة في أرضية فرايتية (لين وقابل للتشغيل)؛ يتم بالتثبيت الطويل تحت A1 مباشرة (نحو 700 °C)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "To make cementite into fine plates to maximise hardness; done by quenching in water",
     "ar": "لتكوين السمنتايت صفائح دقيقة لأقصى صلادة؛ يتم بالتبريد في الماء",
     "why": {
      "en": "Spheroidizing aims at SOFTNESS; a water quench gives martensite instead.",
      "ar": "التكوير يهدف إلى اللين؛ والتبريد في الماء يعطي مارتنسايت."
     }
    },
    {
     "en": "To increase the carbon content at the surface",
     "ar": "لزيادة نسبة الكربون عند السطح",
     "why": {
      "en": "That is carburizing; spheroidizing does not change the carbon content.",
      "ar": "هذا هو التكربن؛ والتكوير لا يغيّر نسبة الكربون."
     }
    },
    {
     "en": "To dissolve all cementite into austenite; done by heating above Acm and quenching",
     "ar": "لإذابة كل السمنتايت في الأوستنايت؛ يتم بالتسخين فوق Acm والتبريد السريع",
     "why": {
      "en": "Heating above Acm dissolves cementite but quenching then gives hard martensite; this is not spheroidizing.",
      "ar": "التسخين فوق Acm يذيب السمنتايت لكن التبريد السريع يعطي مارتنسايت صلداً؛ وهذا ليس تكويراً."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Spheroidite (rounded Fe3C in ferrite) has less interface area than lamellar pearlite and is the softest, most machinable form of a high-carbon steel.",
    "ar": "السفيرويدايت (سمنتايت مستدير في الفرايت) مساحة سطوح بينية أقل من البيرلايت الصفائحي وهو أنعم وأسهل شكل لتشغيل الفولاذ عالي الكربون."
   }
  },
  {
   "id": "ht-19",
   "subject": "ht",
   "topic": "annealing",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "How does a normalized steel differ from a fully annealed steel of the same composition?",
    "ar": "كيف يختلف الفولاذ المطبَّع (normalized) عن الفولاذ المخمَّر كلياً من التركيب نفسه؟"
   },
   "opts": [
    {
     "en": "Normalizing cools more slowly than annealing, giving coarser pearlite",
     "ar": "التطبيع أبطأ تبريداً من التخمير فينتج بيرلايت أخشن",
     "why": {
      "en": "The opposite: furnace cooling (annealing) is the slower of the two.",
      "ar": "العكس: التبريد في الفرن (التخمير) هو الأبطأ."
     }
    },
    {
     "en": "There is no difference between the two treatments",
     "ar": "لا فرق بين المعالجتين",
     "why": {
      "en": "The different cooling rates give different pearlite spacing and so different properties.",
      "ar": "اختلاف معدل التبريد يعطي تباعداً مختلفاً للبيرلايت وبالتالي خواص مختلفة."
     }
    },
    {
     "en": "Normalizing cools in still air, which is faster than furnace cooling, giving finer pearlite and somewhat higher strength and hardness",
     "ar": "يُبرَّد التطبيع في هواء ساكن وهو أسرع من التبريد في الفرن فينتج بيرلايت أنعم وقوة وصلادة أعلى قليلاً",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Normalizing quenches in water and produces martensite",
     "ar": "التطبيع تبريد في الماء وينتج مارتنسايت",
     "why": {
      "en": "Normalizing uses air cooling; a water quench is hardening.",
      "ar": "التطبيع يستعمل التبريد بالهواء؛ والتبريد بالماء تصليد."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "Faster cooling lowers the transformation temperature and gives a finer lamellar spacing, so normalized steel is a little stronger and harder, with a more uniform structure than annealed steel.",
    "ar": "التبريد الأسرع يخفض حرارة التحول ويعطي تباعداً صفائحياً أدق، فالفولاذ المطبَّع أقوى وأصلد قليلاً وأكثر تجانساً من المخمَّر."
   }
  },
  {
   "id": "ht-20",
   "subject": "ht",
   "topic": "stress",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A steel bar fully restrained between rigid walls is heated by 100 K (E = 200 GPa, α = 12×10⁻⁶ /K; stress-free at the start, elastic behaviour). What compressive thermal stress develops?",
    "ar": "قضيب فولاذي مقيَّد كلياً بين جدارين صلبين سُخّن بمقدار 100 K (E = 200 GPa وα = 12×10⁻⁶ /K؛ خالٍ من الإجهاد في البداية وسلوك مرن). ما إجهاد الضغط الحراري المتولد؟"
   },
   "opts": [
    {
     "en": "240 MPa",
     "ar": "240 MPa",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "0.24 MPa",
     "ar": "0.24 MPa",
     "why": {
      "en": "E was entered in GPa while the answer is in MPa (a factor 1000 unit slip).",
      "ar": "أُدخل E بـGPa والنتيجة بـMPa (خطأ وحدات بعامل 1000)."
     }
    },
    {
     "en": "2.4 MPa",
     "ar": "2.4 MPa",
     "why": {
      "en": "ΔT was left out: σ = E α ΔT.",
      "ar": "أُهمل ΔT: σ = E α ΔT."
     }
    },
    {
     "en": "480 MPa",
     "ar": "480 MPa",
     "why": {
      "en": "The contribution of the two walls was doubled; the stress is σ = E ε with ε = α ΔT, once.",
      "ar": "ضوعفت مساهمة الجدارين؛ والإجهاد σ = E ε مع ε = α ΔT مرة واحدة."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "The prevented free expansion is ε = α ΔT = 0.0012; σ = E ε = 200 000 MPa × 0.0012 = 240 MPa (compressive). Such stresses are why heating and cooling must be uniform and slow in stress relieving.",
    "ar": "التمدد الحر الممنوع ε = α ΔT = 0.0012؛ σ = E ε = 200 000 MPa × 0.0012 = 240 MPa (ضغط). ولهذه الإجهادات يجب أن يكون التسخين والتبريد منتظمين وبطيئين في تخفيف الإجهاد."
   }
  },
  {
   "id": "ht-21",
   "subject": "ht",
   "topic": "lever",
   "level": 3,
   "type": "multi",
   "q": {
    "en": "Multi-step problem. A 0.6 wt% C steel is cooled very slowly to just below 727 °C. Use: ferrite 0.022 wt% C, eutectoid 0.76 wt% C, cementite 6.7 wt% C. Answer the three steps (partial credit is given).",
    "ar": "مسألة متعددة الخطوات. فولاذ 0.6 wt% C بُرّد ببطء شديد إلى ما دون 727 °C بقليل. استعمل: الفرايت 0.022 wt% C والأيوتكتويد 0.76 wt% C والسمنتايت 6.7 wt% C. أجب عن الخطوات الثلاث (يُمنح تقدير جزئي)."
   },
   "steps": [
    {
     "id": "a",
     "q": {
      "en": "Step 1: What is the mass fraction of proeutectoid ferrite?",
      "ar": "الخطوة 1: ما الكسر الكتلي للفرايت السابق للأيوتكتويد؟"
     },
     "opts": [
      {
       "en": "2.396 %",
       "ar": "2.396 %",
       "why": {
        "en": "The wrong denominator was used (cementite end of the diagram instead of the eutectoid–ferrite tie-line).",
        "ar": "استُعمل مقام خاطئ (طرف السمنتايت بدل خط الربط أيوتكتويد–فرايت)."
       }
      },
      {
       "en": "21.68 %",
       "ar": "21.68 %",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "78.32 %",
       "ar": "78.32 %",
       "why": {
        "en": "This is the pearlite fraction, the other lever arm.",
        "ar": "هذا كسر البيرلايت وهو ذراع الرافعة الآخر."
       }
      },
      {
       "en": "21.05 %",
       "ar": "21.05 %",
       "why": {
        "en": "The 0.022 wt% solubility of carbon in ferrite was ignored; the tie-line starts at Cα.",
        "ar": "أُهملت ذوبانية الكربون في الفرايت (0.022 wt%)؛ فخط الربط يبدأ من Cα."
       }
      }
     ],
     "ans": 1,
     "exp": {
      "en": "W_α′ = (Ce − C0) / (Ce − Cα) = (0.76 − 0.6) / (0.76 − 0.022) = 21.68 %.",
      "ar": "W_α′ = (Ce − C0) / (Ce − Cα) = (0.76 − 0.6) / (0.76 − 0.022) = 21.68 %."
     }
    },
    {
     "id": "b",
     "q": {
      "en": "Step 2: What is the mass fraction of pearlite?",
      "ar": "الخطوة 2: ما الكسر الكتلي للبيرلايت؟"
     },
     "opts": [
      {
       "en": "91.34 %",
       "ar": "91.34 %",
       "why": {
        "en": "This is the ferrite fraction (total, in both proeutectoid ferrite and pearlite), not the pearlite fraction.",
        "ar": "هذا كسر الفرايت الكلي (في السابق للأيوتكتويد وفي البيرلايت) لا كسر البيرلايت."
       }
      },
      {
       "en": "21.68 %",
       "ar": "21.68 %",
       "why": {
        "en": "This is the proeutectoid ferrite fraction.",
        "ar": "هذا كسر الفرايت السابق للأيوتكتويد."
       }
      },
      {
       "en": "78.95 %",
       "ar": "78.95 %",
       "why": {
        "en": "Cα was neglected in the lever rule.",
        "ar": "أُهمل Cα في قاعدة الرافعة."
       }
      },
      {
       "en": "78.32 %",
       "ar": "78.32 %",
       "why": {
        "en": "",
        "ar": ""
       }
      }
     ],
     "ans": 3,
     "exp": {
      "en": "W_p = 1 − W_α′ = (C0 − Cα) / (Ce − Cα) = 78.32 %.",
      "ar": "W_p = 1 − W_α′ = (C0 − Cα) / (Ce − Cα) = 78.32 %."
     }
    },
    {
     "id": "c",
     "q": {
      "en": "Step 3: What is the total mass fraction of cementite (all of it lies inside pearlite)?",
      "ar": "الخطوة 3: ما الكسر الكتلي الكلي للسمنتايت (كله داخل البيرلايت)؟"
     },
     "opts": [
      {
       "en": "8.655 %",
       "ar": "8.655 %",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "8.955 %",
       "ar": "8.955 %",
       "why": {
        "en": "The carbon dissolved in ferrite (0.022 wt%) was ignored.",
        "ar": "أُهمل الكربون المذاب في الفرايت (0.022 wt%)."
       }
      },
      {
       "en": "11.05 %",
       "ar": "11.05 %",
       "why": {
        "en": "This is the cementite fraction inside pure pearlite; it must be multiplied by the pearlite fraction of this steel.",
        "ar": "هذا كسر السمنتايت في البيرلايت الصرف؛ ويجب ضربه في كسر البيرلايت في هذا الفولاذ."
       }
      },
      {
       "en": "91.34 %",
       "ar": "91.34 %",
       "why": {
        "en": "This is the total ferrite fraction, not cementite.",
        "ar": "هذا كسر الفرايت الكلي لا السمنتايت."
       }
      }
     ],
     "ans": 0,
     "exp": {
      "en": "W_Fe3C = (C0 − Cα) / (C_Fe3C − Cα) = (0.6 − 0.022) / (6.7 − 0.022) = 8.655 %. Check: pearlite × 11.05 % = 8.655 %.",
      "ar": "W_Fe3C = (C0 − Cα) / (C_Fe3C − Cα) = (0.6 − 0.022) / (6.7 − 0.022) = 8.655 %. تحقق: البيرلايت × 11.05 % = 8.655 %."
     }
    }
   ],
   "exp": {
    "en": "Hypoeutectoid steel at room temperature = proeutectoid ferrite + pearlite; the cementite sits only in the pearlite lamellae. Mass balance on carbon gives the same totals either way.",
    "ar": "الفولاذ التحت أيوتكتويدي عند حرارة الغرفة = فرايت سابق للأيوتكتويد + بيرلايت؛ والسمنتايت موجود فقط في صفائح البيرلايت. وموازنة الكتلة للكربون تعطي المجاميع نفسها بالطريقتين."
   }
  },
  {
   "id": "ht-22",
   "subject": "ht",
   "topic": "quench",
   "level": 3,
   "type": "multi",
   "q": {
    "en": "Multi-step problem. A small steel part at 850 °C is quenched in oil at 50 °C. Assume lumped (Newtonian) cooling: T(t) = T_oil + (T0 − T_oil) e^(−t/τ) with time constant τ = 4 s. Answer the three steps (partial credit is given).",
    "ar": "مسألة متعددة الخطوات. قطعة فولاذية صغيرة عند 850 °C تُبرَّد في زيت عند 50 °C. افترض تبريداً نيوتنياً (سعة مجمّعة): T(t) = T_oil + (T0 − T_oil) e^(−t/τ) بثابت زمني τ = 4 s. أجب عن الخطوات الثلاث (يُمنح تقدير جزئي)."
   },
   "steps": [
    {
     "id": "a",
     "q": {
      "en": "Step 1: What is the part temperature after 2.0 s?",
      "ar": "الخطوة 1: ما حرارة القطعة بعد 2.0 s؟"
     },
     "opts": [
      {
       "en": "485.2 °C",
       "ar": "485.2 °C",
       "why": {
        "en": "The oil temperature was not added back: the exponential decays the DIFFERENCE (T − T_oil).",
        "ar": "لم تُضف حرارة الزيت مجدداً: الأسّ يُضمحل الفرق (T − T_oil)."
       }
      },
      {
       "en": "515.6 °C",
       "ar": "515.6 °C",
       "why": {
        "en": "The exponential was applied to T0 itself; the part cools toward T_oil, not toward zero.",
        "ar": "طُبّق الأسّ على T0 نفسها؛ فالقطعة تبرد نحو T_oil لا نحو الصفر."
       }
      },
      {
       "en": "535.2 °C",
       "ar": "535.2 °C",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "50.27 °C",
       "ar": "50.27 °C",
       "why": {
        "en": "The exponent was t × τ instead of t / τ.",
        "ar": "كان الأس t × τ بدل t / τ."
       }
      }
     ],
     "ans": 2,
     "exp": {
      "en": "T = 50 + 800 × e^(−2/4) = 535.2 °C.",
      "ar": "T = 50 + 800 × e^(−2/4) = 535.2 °C."
     }
    },
    {
     "id": "b",
     "q": {
      "en": "Step 2: How long does it take to cool to 400 °C?",
      "ar": "الخطوة 2: كم يستغرق التبريد إلى 400 °C؟"
     },
     "opts": [
      {
       "en": "2.25 s",
       "ar": "2.25 s",
       "why": {
        "en": "A linear temperature drop was assumed; Newtonian cooling is exponential.",
        "ar": "افتُرض انخفاض خطي في الحرارة؛ والتبريد النيوتني أسّي."
       }
      },
      {
       "en": "3.015 s",
       "ar": "3.015 s",
       "why": {
        "en": "The oil temperature was forgotten in the ratio: it must be (T0 − T_oil)/(400 − T_oil).",
        "ar": "نُسيت حرارة الزيت في النسبة: يجب أن تكون (T0 − T_oil)/(400 − T_oil)."
       }
      },
      {
       "en": "1.436 s",
       "ar": "1.436 s",
       "why": {
        "en": "log10 was used instead of the natural logarithm ln.",
        "ar": "استُعمل log10 بدل اللوغاريتم الطبيعي ln."
       }
      },
      {
       "en": "3.307 s",
       "ar": "3.307 s",
       "why": {
        "en": "",
        "ar": ""
       }
      }
     ],
     "ans": 3,
     "exp": {
      "en": "t = τ ln[(T0 − T_oil)/(400 − T_oil)] = 4 × ln(800/350) = 3.307 s.",
      "ar": "t = τ ln[(T0 − T_oil)/(400 − T_oil)] = 4 × ln(800/350) = 3.307 s."
     }
    },
    {
     "id": "c",
     "q": {
      "en": "Step 3: What is the average cooling rate from 850 °C to 400 °C?",
      "ar": "الخطوة 3: ما متوسط معدل التبريد من 850 °C إلى 400 °C؟"
     },
     "opts": [
      {
       "en": "1488 °C/s",
       "ar": "1488 °C/s",
       "why": {
        "en": "The temperature drop was multiplied by the time instead of divided.",
        "ar": "ضُرب انخفاض الحرارة في الزمن بدل القسمة."
       }
      },
      {
       "en": "136.1 °C/s",
       "ar": "136.1 °C/s",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "149.2 °C/s",
       "ar": "149.2 °C/s",
       "why": {
        "en": "This uses the wrong time from step 2 (oil temperature ignored).",
        "ar": "يستعمل زمناً خاطئاً من الخطوة 2 (أُهملت حرارة الزيت)."
       }
      },
      {
       "en": "200 °C/s",
       "ar": "200 °C/s",
       "why": {
        "en": "This uses the linear-cooling time (2.25 s), not the exponential result.",
        "ar": "يستعمل زمن التبريد الخطي (2.25 s) لا النتيجة الأسية."
       }
      }
     ],
     "ans": 1,
     "exp": {
      "en": "Rate = (850 − 400) / 3.307 = 136.1 °C/s (average; the instantaneous rate is highest at the start and falls with time).",
      "ar": "المعدل = (850 − 400) / 3.307 = 136.1 °C/s (متوسط؛ والمعدل اللحظي أعلى ما يكون في البداية ثم يتناقص)."
     }
    }
   ],
   "exp": {
    "en": "Real quenching has a vapour-blanket / boiling / convection sequence, so this lumped first-order model is only an idealisation, but it shows why the surface cools quickly at first and slows as the part approaches the bath temperature.",
    "ar": "للتبريد الفعلي مراحل غشاء بخار/غليان/حمل، لذا هذا النموذج المجمّع من الدرجة الأولى تبسيط فقط، لكنه يبيّن لماذا يبرد السطح بسرعة أولاً ثم يبطؤ كلما اقتربت القطعة من حرارة الحوض."
   }
  },
  {
   "id": "ht-23",
   "subject": "ht",
   "topic": "hardenability",
   "level": 3,
   "type": "concept",
   "q": {
    "en": "Why does adding Cr, Mo or Mn to a steel increase its hardenability?",
    "ar": "لماذا تزيد إضافة Cr أو Mo أو Mn قابلية التصليد للفولاذ؟"
   },
   "opts": [
    {
     "en": "They make the steel conduct heat faster so the core cools faster",
     "ar": "تجعل الفولاذ يوصل الحرارة أسرع فيبرد القلب أسرع",
     "why": {
      "en": "Alloying generally lowers thermal conductivity slightly; hardenability is increased by changing the kinetics, not the cooling rate.",
      "ar": "السبائك عموماً تخفض التوصيل الحراري قليلاً؛ وتزداد قابلية التصليد بتغيير الحركية لا معدل التبريد."
     }
    },
    {
     "en": "They raise the maximum hardness of martensite far above what carbon alone gives",
     "ar": "ترفع أقصى صلادة للمارتنسايت كثيراً فوق ما يعطيه الكربون وحده",
     "why": {
      "en": "Maximum martensite hardness is set mainly by carbon; alloying increases the DEPTH to which it forms.",
      "ar": "أقصى صلادة للمارتنسايت يحددها الكربون أساساً؛ والسبائك تزيد العمق الذي يتكوّن إليه."
     }
    },
    {
     "en": "They delay the diffusional pearlite/bainite reactions, shifting the TTT/CCT noses to longer times, so slower cooling still produces martensite",
     "ar": "تؤخر التفاعلات الانتشارية للبيرلايت/البينايت فتزيح أنوف مخططات TTT/CCT إلى أزمنة أطول فيتكوّن المارتنسايت حتى بتبريد أبطأ",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "They shift the TTT noses to shorter times so martensite forms first",
     "ar": "تزيح أنوف TTT إلى أزمنة أقصر فيتكوّن المارتنسايت أولاً",
     "why": {
      "en": "The shift is to the RIGHT (longer times); shifting left would make martensite harder to obtain.",
      "ar": "الإزاحة إلى اليمين (أزمنة أطول)؛ والإزاحة إلى اليسار تجعل الحصول على المارتنسايت أصعب."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "These elements dissolve in austenite and slow down the nucleation and growth of pearlite and bainite (solute drag, carbide formation). The critical cooling rate falls, so larger sections can be through-hardened.",
    "ar": "تذوب هذه العناصر في الأوستنايت وتبطئ تنوّي ونمو البيرلايت والبينايت (سحب المذاب وتكوّن الكربيدات). فينخفض معدل التبريد الحرج وتصبح الأقسام الأكبر قابلة للتصليد عبر المقطع."
   }
  },
  {
   "id": "ht-24",
   "subject": "ht",
   "topic": "hardening",
   "level": 3,
   "type": "concept",
   "q": {
    "en": "A 1.0 wt% C steel is quenched to room temperature and still contains retained austenite. What is the main reason?",
    "ar": "فولاذ 1.0 wt% C بُرّد إلى حرارة الغرفة ولا يزال يحوي أوستنايتاً محتجزاً. ما السبب الرئيس؟"
   },
   "opts": [
    {
     "en": "Austenite is thermodynamically stable below 727 °C",
     "ar": "الأوستنايت مستقر ترموديناميكياً تحت 727 °C",
     "why": {
      "en": "Below A1 austenite is unstable (metastable at best); it persists only because the shear transformation is incomplete.",
      "ar": "تحت A1 يكون الأوستنايت غير مستقر (شبه مستقر على الأكثر)؛ ويبقى فقط لأن التحول القصّي غير مكتمل."
     }
    },
    {
     "en": "The steel contained no carbon to form martensite",
     "ar": "لم يكن في الفولاذ كربون لتكوين المارتنسايت",
     "why": {
      "en": "The steel has 1.0 wt% C; high carbon is exactly what lowers Ms/Mf.",
      "ar": "يحوي الفولاذ 1.0 wt% C؛ والكربون العالي هو بالضبط ما يخفض Ms/Mf."
     }
    },
    {
     "en": "Martensite needs a long holding time at room temperature to finish",
     "ar": "يحتاج المارتنسايت زمن تثبيت طويلاً عند حرارة الغرفة ليكتمل",
     "why": {
      "en": "The martensite reaction is athermal: the amount formed depends on temperature reached, not on time.",
      "ar": "تفاعل المارتنسايت لاحراري: الكمية المتكوّنة تعتمد على الحرارة التي بُلغت لا على الزمن."
     }
    },
    {
     "en": "Carbon lowers the Ms and Mf temperatures; Mf lies below room temperature, so the martensite transformation is not completed at room temperature",
     "ar": "الكربون يخفض درجتي Ms وMf؛ وMf تقع تحت حرارة الغرفة فلا يكتمل تحول المارتنسايت عند حرارة الغرفة",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Higher carbon lowers the martensite start and finish temperatures. If Mf is below room temperature, some austenite is retained; sub-zero cooling can transform more of it.",
    "ar": "الكربون الأعلى يخفض درجتي بدء وانتهاء المارتنسايت. وإذا كانت Mf تحت حرارة الغرفة بقي بعض الأوستنايت؛ والتبريد تحت الصفر يحوّل منه مزيداً."
   }
  },
  {
   "id": "ht-25",
   "subject": "ht",
   "topic": "ttt",
   "level": 3,
   "type": "applied",
   "q": {
    "en": "Using the TTT diagram of a eutectoid steel (Ms about 230 °C, bainite forms roughly between 250 and 550 °C), which route gives a fully bainitic structure?",
    "ar": "باستعمال مخطط TTT لفولاذ أيوتكتويدي (Ms نحو 230 °C ويتكوّن البينايت تقريباً بين 250 و550 °C)، أي مسار يعطي بنية بينايتية كاملة؟"
   },
   "opts": [
    {
     "en": "Austenitize and quench directly to room temperature",
     "ar": "أوستنة ثم تبريد سريع مباشر إلى حرارة الغرفة",
     "why": {
      "en": "Cooling through Ms without a hold produces martensite, not bainite.",
      "ar": "التبريد عبر Ms دون تثبيت يعطي مارتنسايت لا بينايت."
     }
    },
    {
     "en": "Austenitize, quench quickly to about 300 °C (above Ms), hold until the transformation is complete, then cool (austempering)",
     "ar": "أوستنة ثم تبريد سريع إلى نحو 300 °C (فوق Ms) والتثبيت حتى اكتمال التحول ثم التبريد (austempering)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Austenitize and cool slowly in the furnace",
     "ar": "أوستنة ثم تبريد بطيء في الفرن",
     "why": {
      "en": "Furnace cooling passes through the pearlite region at high temperature, giving coarse pearlite.",
      "ar": "التبريد في الفرن يمر بمنطقة البيرلايت عند حرارة عالية فينتج بيرلايت خشن."
     }
    },
    {
     "en": "Austenitize, quench to about 700 °C and hold",
     "ar": "أوستنة ثم تبريد إلى نحو 700 °C والتثبيت",
     "why": {
      "en": "A hold just below A1 (727 °C) gives coarse pearlite, not bainite.",
      "ar": "التثبيت تحت A1 (727 °C) مباشرة يعطي بيرلايت خشناً لا بينايت."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "Bainite forms isothermally below the pearlite nose but above Ms. Austempering avoids the quench stresses of martensite and gives a tough structure with less distortion and cracking risk.",
    "ar": "يتكوّن البينايت متساوي الحرارة تحت أنف البيرلايت وفوق Ms. ويتفادى التبريد المتساوي الحرارة (austempering) إجهادات تكوّن المارتنسايت فينتج بنية متينة مع تشوه وخطر تشقق أقل."
   }
  },
  {
   "id": "ht-26",
   "subject": "ht",
   "topic": "case",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "In gas carburizing at constant temperature and carbon potential, case depth is diffusion-controlled, so depth ∝ √time. A case depth of 0.5 mm is obtained after 4 h. How long is needed for a case depth of 1.0 mm?",
    "ar": "في التكربن الغازي عند حرارة ودرجة جهد كربون ثابتتين يتحكم الانتشار بعمق الطبقة فيكون العمق ∝ √الزمن. يُنال عمق 0.5 mm بعد 4 h. كم يلزم من الزمن لعمق 1.0 mm؟"
   },
   "opts": [
    {
     "en": "32 h",
     "ar": "32 h",
     "why": {
      "en": "A cube law was used; diffusion distance goes as √t, so time goes as d².",
      "ar": "استُعمل قانون تكعيبي؛ مسافة الانتشار تتبع √t فيتبع الزمن d²."
     }
    },
    {
     "en": "16 h",
     "ar": "16 h",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "5.657 h",
     "ar": "5.657 h",
     "why": {
      "en": "The square root was applied to the wrong quantity: t ∝ d², not √d.",
      "ar": "طُبّق الجذر على الكمية الخطأ: t ∝ d² وليس √d."
     }
    },
    {
     "en": "8 h",
     "ar": "8 h",
     "why": {
      "en": "Linear scaling was assumed; because depth ∝ √t, doubling the depth takes 4 times as long, not 2.",
      "ar": "افتُرض تناسب خطي؛ ولأن العمق ∝ √t فمضاعفة العمق تحتاج 4 أضعاف الزمن لا ضعفين."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "d ∝ √t ⇒ t ∝ d². t₂ = t₁ (d₂/d₁)² = 4 × (1.0/0.5)² = 16 h.",
    "ar": "d ∝ √t ⇒ t ∝ d². t₂ = t₁ (d₂/d₁)² = 4 × (1.0/0.5)² = 16 h."
   }
  },
  {
   "id": "ht-27",
   "subject": "ht",
   "topic": "stress",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "On quenching, the austenite → martensite transformation causes a volume increase. Assume ΔV/V = 3 % for a long bar of length 200 mm, uniform and isotropic, and use the small-strain relation ΔL/L ≈ ΔV/(3V). What is the length change due to the transformation alone?",
    "ar": "عند التبريد السريع يسبب تحول الأوستنايت ← مارتنسايت زيادة في الحجم. افترض ΔV/V = 3 % لقضيب طويل طوله 200 mm، منتظم ومتماثل الخواص، واستعمل علاقة الانفعالات الصغيرة ΔL/L ≈ ΔV/(3V). ما تغير الطول الناتج عن التحول وحده؟"
   },
   "opts": [
    {
     "en": "2 mm",
     "ar": "2 mm",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "0.02 mm",
     "ar": "0.02 mm",
     "why": {
      "en": "The percentage was converted to a fraction twice (÷100 applied two times).",
      "ar": "حُوّلت النسبة المئوية إلى كسر مرتين (قسمة على 100 مرتين)."
     }
    },
    {
     "en": "0.6667 mm",
     "ar": "0.6667 mm",
     "why": {
      "en": "The volume strain was divided by 3 twice.",
      "ar": "قُسم الانفعال الحجمي على 3 مرتين."
     }
    },
    {
     "en": "6 mm",
     "ar": "6 mm",
     "why": {
      "en": "The volumetric strain was used as if it were linear; the linear strain is one third of it.",
      "ar": "استُعمل الانفعال الحجمي كأنه خطي؛ والانفعال الخطي ثلثه."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "ΔL/L ≈ ΔV/(3V) = 3 % / 3 = 1 % = 0.01;  ΔL = 0.01 × 200 mm = 2 mm. Together with thermal contraction this volume change is a source of distortion and residual stress.",
    "ar": "ΔL/L ≈ ΔV/(3V) = 3 % / 3 = 1 % = 0.01؛ ΔL = 0.01 × 200 mm = 2 mm. ومع الانكماش الحراري يُعد تغير الحجم هذا مصدراً للتشوه والإجهادات المتبقية."
   }
  },
  {
   "id": "ht-28",
   "subject": "ht",
   "topic": "ppt",
   "level": 3,
   "type": "concept",
   "q": {
    "en": "An aged Al-Cu alloy is kept too long at the aging temperature and its strength falls. What has happened?",
    "ar": "سبيكة Al-Cu معتَّقة بقيت مدة أطول من اللازم عند حرارة التعتيق فانخفضت متانتها. ماذا حدث؟"
   },
   "opts": [
    {
     "en": "Overaging: the precipitates have coarsened and are further apart (and have lost coherency), so they obstruct dislocations less effectively",
     "ar": "فرط التعتيق: خشنت الرواسب وتباعدت (وفقدت التماسك) فصارت أقل فاعلية في إعاقة الانخلاعات",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "The alloy has recrystallised into larger grains at the aging temperature",
     "ar": "أعادت السبيكة التبلور إلى حبيبات أكبر عند حرارة التعتيق",
     "why": {
      "en": "Recrystallisation needs prior cold work and a higher temperature; the observed softening is due to the precipitate coarsening.",
      "ar": "إعادة التبلور تحتاج شغلاً بارداً سابقاً وحرارة أعلى؛ واللين الملاحَظ سببه تخشن الرواسب."
     }
    },
    {
     "en": "The precipitates have dissolved completely into solid solution",
     "ar": "ذابت الرواسب كلياً في المحلول الصلب",
     "why": {
      "en": "Aging is below the solvus; precipitates do not redissolve, they coarsen.",
      "ar": "التعتيق يتم تحت خط الذوبانية؛ فالرواسب لا تذوب مجدداً بل تخشن."
     }
    },
    {
     "en": "More and finer precipitates keep forming, which always increases strength",
     "ar": "تتكوّن رواسب أكثر وأدق باستمرار مما يزيد المتانة دائماً",
     "why": {
      "en": "After the peak, coarsening reduces the number density; strength then declines.",
      "ar": "بعد الذروة يقلل التخشن كثافة الرواسب فتنخفض المتانة."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Peak strength is reached with a fine, dense precipitate distribution. Longer or hotter aging coarsens precipitates, increasing spacing so dislocations bow between them (Orowan looping) at lower stress.",
    "ar": "تُبلغ ذروة المتانة بتوزيع دقيق وكثيف للرواسب. والتعتيق الأطول أو الأسخن يخشّن الرواسب ويزيد التباعد فتنحني الانخلاعات بينها (حلقات أوروان) عند إجهاد أدنى."
   }
  },
  {
   "id": "ht-29",
   "subject": "ht",
   "topic": "crit",
   "level": 3,
   "type": "concept",
   "q": {
    "en": "A 1.2 wt% C steel is to be hardened. Why is it usually austenitized between A1 and Acm rather than above Acm?",
    "ar": "يراد تصليد فولاذ 1.2 wt% C. لماذا يُؤوستَن عادةً بين A1 وAcm لا فوق Acm؟"
   },
   "opts": [
    {
     "en": "Undissolved cementite particles remain (good for wear resistance), the austenite carries less than 1.2 wt% C so less austenite is retained, and grain growth and cracking risk are lower",
     "ar": "يبقى سمنتايت غير ذائب (مفيد لمقاومة البلى) ويحمل الأوستنايت أقل من 1.2 wt% C فيقل الأوستنايت المحتجز ويقل نمو الحبيبات وخطر التشقق",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Above Acm the steel melts",
     "ar": "فوق Acm ينصهر الفولاذ",
     "why": {
      "en": "Acm is far below the melting range; no melting occurs there.",
      "ar": "Acm أدنى بكثير من مدى الانصهار؛ فلا انصهار عندها."
     }
    },
    {
     "en": "Martensite cannot form from austenite above Acm",
     "ar": "لا يمكن تكوّن المارتنسايت من الأوستنايت فوق Acm",
     "why": {
      "en": "Martensite can form; the problem is high carbon in austenite (more retained austenite) and coarse grains, not impossibility.",
      "ar": "يمكن أن يتكوّن المارتنسايت؛ والمشكلة هي الكربون العالي في الأوستنايت (أوستنايت محتجز أكثر) والحبيبات الخشنة لا الاستحالة."
     }
    },
    {
     "en": "Between A1 and Acm the steel is fully ferritic, which hardens best",
     "ar": "بين A1 وAcm يكون الفولاذ فرايتياً بالكامل وهو الأفضل تصليداً",
     "why": {
      "en": "Between A1 and Acm the structure is austenite + cementite, not ferrite; ferrite does not form martensite.",
      "ar": "بين A1 وAcm تكون البنية أوستنايت + سمنتايت لا فرايت؛ والفرايت لا يعطي مارتنسايت."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "For hypereutectoid steels, quenching from just above A1 leaves hard cementite particles in a martensite matrix and avoids the high-carbon, coarse-grained austenite that gives more retained austenite and brittleness. (Hypoeutectoid steels are austenitized above A3.)",
    "ar": "في الفولاذ فوق الأيوتكتويدي يترك التبريد من فوق A1 بقليل جسيمات سمنتايت صلدة في أرضية مارتنسايتية ويتفادى الأوستنايت عالي الكربون خشن الحبيبات الذي يعطي أوستنايتاً محتجزاً أكثر وهشاشة. (أما الفولاذ التحت أيوتكتويدي فيُؤوستَن فوق A3.)"
   }
  },
  {
   "id": "ht-30",
   "subject": "ht",
   "topic": "tempering",
   "level": 3,
   "type": "concept",
   "q": {
    "en": "A quenched low-alloy steel is tempered at about 300 °C and shows lower Charpy impact toughness than the same steel tempered at 200 °C, even though it is softer. What is the likely explanation?",
    "ar": "فولاذ سبائكي منخفض السبائك مصلَّد ثم مُراجَع عند نحو 300 °C يُظهر متانة صدم (تشاربي) أقل من الفولاذ نفسه المراجَع عند 200 °C رغم أنه أنعم. ما التفسير المرجَّح؟"
   },
   "opts": [
    {
     "en": "Tempered martensite embrittlement (roughly 260-370 °C): toughness can dip in this range, so it is usually avoided",
     "ar": "هشاشة المارتنسايت المراجَع (نحو 260-370 °C): قد تنخفض المتانة في هذا المدى ولذلك يُتجنَّب عادةً",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Toughness always increases with tempering temperature, so the measurement must be wrong",
     "ar": "تزداد المتانة دائماً مع حرارة المراجعة لذلك القياس خاطئ",
     "why": {
      "en": "In general toughness rises with tempering temperature, but not monotonically: a dip occurs in the TME range.",
      "ar": "عموماً تزداد المتانة مع حرارة المراجعة لكن ليس بتزايد رتيب: يحدث انخفاض في مدى TME."
     }
    },
    {
     "en": "At 300 °C the steel has transformed back to austenite",
     "ar": "عند 300 °C عاد الفولاذ إلى أوستنايت",
     "why": {
      "en": "Austenite forms only above A1 (727 °C); 300 °C is far below.",
      "ar": "يتكوّن الأوستنايت فقط فوق A1 (727 °C)؛ و300 °C أدنى بكثير."
     }
    },
    {
     "en": "Softer steel is always less tough",
     "ar": "الفولاذ الألين أقل متانة دائماً",
     "why": {
      "en": "Normally softer (more tempered) steel is tougher; the dip here is an exception due to the embrittlement mechanism.",
      "ar": "عادةً الفولاذ الأنعم (الأكثر مراجعة) أمتن؛ والانخفاض هنا استثناء سببه آلية الهشاشة."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Toughness generally rises with tempering temperature, but a trough appears in the tempered-martensite-embrittlement range (about 260-370 °C, quoted as 250-400 °C in some sources). A different effect, temper embrittlement, occurs above about 425 °C.",
    "ar": "تزداد المتانة عموماً مع حرارة المراجعة لكن يظهر هبوط في مدى هشاشة المارتنسايت المراجَع (نحو 260-370 °C وتُذكر 250-400 °C في بعض المصادر). وهناك أثر مختلف، هشاشة المراجعة، يحدث فوق نحو 425 °C."
   }
  }
 ]
};
})();
