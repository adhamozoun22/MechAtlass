/* MechAtlas — Statics and Dynamics question bank. Standalone data file; loaded by index.html. */
(function () {
    window.MECHATLAS_QUIZ_BANKS = window.MECHATLAS_QUIZ_BANKS || {};
    window.MECHATLAS_QUIZ_BANKS.sd = {
 "id": "sd",
 "title": {
  "en": "Statics and Dynamics",
  "ar": "الستاتيكا والديناميكا"
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
  "force": {
   "en": "Force vectors and resultants",
   "ar": "متجهات القوى والمحصلة"
  },
  "moment": {
   "en": "Moments and couples",
   "ar": "العزوم وأزواج القوى"
  },
  "equil": {
   "en": "Equilibrium and free-body diagrams",
   "ar": "الاتزان ومخططات الجسم الحر"
  },
  "truss": {
   "en": "Trusses",
   "ar": "الجمالونات"
  },
  "friction": {
   "en": "Friction",
   "ar": "الاحتكاك"
  },
  "centroid": {
   "en": "Centroids",
   "ar": "مراكز الثقل (المراكز الهندسية)"
  },
  "kin": {
   "en": "Kinematics",
   "ar": "الكينماتيكا (دراسة الحركة)"
  },
  "newton": {
   "en": "Newton's laws",
   "ar": "قوانين نيوتن"
  },
  "energy": {
   "en": "Work and energy",
   "ar": "الشغل والطاقة"
  },
  "momentum": {
   "en": "Impulse and momentum",
   "ar": "الدفع وكمية الحركة"
  },
  "rot": {
   "en": "Rotational dynamics and moment of inertia",
   "ar": "الديناميكا الدورانية وعزم القصور الذاتي"
  },
  "vib": {
   "en": "Vibration basics",
   "ar": "أساسيات الاهتزاز"
  }
 },
 "questions": [
  {
   "id": "sd-01",
   "subject": "sd",
   "topic": "force",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "Two forces of 30 N and 40 N act on the same point at 90° to each other. What is the magnitude of their resultant?",
    "ar": "قوتان مقدارهما 30 N و40 N تؤثران في النقطة نفسها وبينهما زاوية 90°. ما مقدار محصلتهما؟"
   },
   "opts": [
    {
     "en": "2500 N",
     "ar": "2500 N",
     "why": {
      "en": "The square root was forgotten: R = √(a² + b²), not a² + b².",
      "ar": "نُسي الجذر التربيعي: R = √(a² + b²) وليس a² + b²."
     }
    },
    {
     "en": "50 N",
     "ar": "50 N",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "70 N",
     "ar": "70 N",
     "why": {
      "en": "The magnitudes were added; this is valid only when both forces point in the same direction.",
      "ar": "جُمع المقداران؛ وهذا صحيح فقط إذا كانت القوتان في الاتجاه نفسه."
     }
    },
    {
     "en": "10 N",
     "ar": "10 N",
     "why": {
      "en": "The magnitudes were subtracted; this is valid only for forces in exactly opposite directions.",
      "ar": "طُرح المقداران؛ وهذا صحيح فقط للقوتين المتعاكستين تماماً."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "For perpendicular forces R = √(30² + 40²) = √2500 = 50 N (a 3-4-5 triangle).",
    "ar": "للقوتين المتعامدتين R = √(30² + 40²) = √2500 = 50 N (مثلث 3-4-5)."
   }
  },
  {
   "id": "sd-02",
   "subject": "sd",
   "topic": "moment",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A force of 50 N acts perpendicular to a spanner at a distance of 0.4 m from the nut. What is the moment about the nut?",
    "ar": "قوة مقدارها 50 N تؤثر عمودياً على مفتاح ربط على بعد 0.4 m من الصامولة. ما العزم حول الصامولة؟"
   },
   "opts": [
    {
     "en": "20 N·m",
     "ar": "20 N·m",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "125 N·m",
     "ar": "125 N·m",
     "why": {
      "en": "The force was divided by the distance; a moment is the PRODUCT F × d.",
      "ar": "قُسمت القوة على البعد؛ العزم هو حاصل الضرب F × d."
     }
    },
    {
     "en": "50.4 N·m",
     "ar": "50.4 N·m",
     "why": {
      "en": "Force and distance were added; quantities with different units cannot be added.",
      "ar": "جُمعت القوة والبعد؛ لا يمكن جمع كميتين مختلفتي الوحدة."
     }
    },
    {
     "en": "2000 N·m",
     "ar": "2000 N·m",
     "why": {
      "en": "The distance was used as 40 (cm) while the force is in N; a unit slip: 0.4 m = 40 cm gives 2000 N·cm, not N·m.",
      "ar": "استُعمل البعد 40 (cm) مع قوة بالنيوتن؛ خطأ وحدات: النتيجة 2000 N·cm وليست N·m."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "M = F × d = 50 × 0.4 = 20 N·m (the force is perpendicular to the lever arm).",
    "ar": "M = F × d = 50 × 0.4 = 20 N·m (القوة عمودية على ذراع العزم)."
   }
  },
  {
   "id": "sd-03",
   "subject": "sd",
   "topic": "equil",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "Which set of conditions must be satisfied for a rigid body in a plane (2D) to be in equilibrium?",
    "ar": "ما مجموعة الشروط اللازمة لاتزان جسم صلب في مستوٍ (ثنائي البعد)؟"
   },
   "opts": [
    {
     "en": "ΣM = 0 only",
     "ar": "ΣM = 0 فقط",
     "why": {
      "en": "A net force with zero moment about the chosen point still accelerates the body; the force conditions are also required.",
      "ar": "قوة محصلة غير صفرية بعزم صفري حول النقطة المختارة تُسرّع الجسم؛ فشرطا القوى لازمان أيضاً."
     }
    },
    {
     "en": "ΣFx = 0 and ΣFy = 0 only",
     "ar": "ΣFx = 0 وΣFy = 0 فقط",
     "why": {
      "en": "Two equal and opposite parallel forces (a couple) give ΣF = 0 but still rotate the body, so the moment condition is also required.",
      "ar": "قوتان متساويتان متعاكستان متوازيتان (زوج) تعطيان ΣF = 0 ومع ذلك تُدوّران الجسم، لذا يلزم شرط العزوم أيضاً."
     }
    },
    {
     "en": "ΣFx = 0, ΣFy = 0 and ΣM = 0 about any point",
     "ar": "ΣFx = 0 وΣFy = 0 وΣM = 0 حول أي نقطة",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "ΣFx = 0 and ΣM = 0 only",
     "ar": "ΣFx = 0 وΣM = 0 فقط",
     "why": {
      "en": "The vertical force balance ΣFy = 0 is also needed, otherwise the body can accelerate vertically.",
      "ar": "يلزم أيضاً توازن القوى الرأسية ΣFy = 0 وإلا تسارع الجسم رأسياً."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "A planar rigid body is in equilibrium when the resultant force and the resultant moment are both zero: ΣFx = 0, ΣFy = 0, ΣM = 0 (the moment point can be chosen freely).",
    "ar": "يتزن الجسم الصلب المستوي عندما تكون المحصلة والعزم المحصل كلاهما صفراً: ΣFx = 0 وΣFy = 0 وΣM = 0 (ويمكن اختيار نقطة العزوم بحرية)."
   }
  },
  {
   "id": "sd-04",
   "subject": "sd",
   "topic": "equil",
   "level": 1,
   "type": "concept",
   "q": {
    "en": "Which forces must be drawn on a free-body diagram of a body?",
    "ar": "ما القوى التي يجب رسمها على مخطط الجسم الحر لجسم ما؟"
   },
   "opts": [
    {
     "en": "Only the applied loads; support reactions are left out",
     "ar": "الأحمال المطبقة فقط وتُهمل ردود الأفعال",
     "why": {
      "en": "Support reactions are external forces on the body and are usually the unknowns to be found.",
      "ar": "ردود أفعال المساند قوى خارجية على الجسم وهي عادةً المجاهيل المطلوبة."
     }
    },
    {
     "en": "All external forces and moments acting ON the isolated body (loads, weight, support reactions)",
     "ar": "جميع القوى والعزوم الخارجية المؤثرة في الجسم المعزول (الأحمال والوزن وردود الأفعال)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Internal forces between the particles of the body",
     "ar": "القوى الداخلية بين جسيمات الجسم",
     "why": {
      "en": "Internal forces occur in equal and opposite pairs and cancel; they appear only if the body is cut into parts.",
      "ar": "القوى الداخلية تأتي بأزواج متساوية متعاكسة وتلغي بعضها؛ وتظهر فقط عند قطع الجسم إلى أجزاء."
     }
    },
    {
     "en": "The forces the body exerts on its surroundings",
     "ar": "القوى التي يؤثر بها الجسم في ما حوله",
     "why": {
      "en": "Those act on other bodies and do not enter the equilibrium of this body (they are the reaction partners of the forces already drawn).",
      "ar": "هذه القوى تؤثر في أجسام أخرى ولا تدخل في اتزان هذا الجسم (فهي القوى المقابلة لرد الفعل للقوى المرسومة)."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "A free-body diagram isolates the body from its surroundings and shows every external force and moment that acts on it, including the reactions of the supports it was separated from.",
    "ar": "يعزل مخطط الجسم الحر الجسم عن محيطه ويبيّن كل قوة وعزم خارجي مؤثر فيه، بما في ذلك ردود أفعال المساند التي فُصل عنها."
   }
  },
  {
   "id": "sd-05",
   "subject": "sd",
   "topic": "friction",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A 20 kg block rests on a level floor with a coefficient of static friction μs = 0.4. Taking g = 9.81 m/s², what minimum horizontal force starts it sliding?",
    "ar": "كتلة 20 kg ساكنة على أرض أفقية ومعامل الاحتكاك السكوني μs = 0.4. بأخذ g = 9.81 m/s²، ما أقل قوة أفقية تبدأ انزلاقها؟"
   },
   "opts": [
    {
     "en": "8 N",
     "ar": "8 N",
     "why": {
      "en": "The mass was used instead of the weight: the normal force is N = m g, not m.",
      "ar": "استُعملت الكتلة بدل الوزن: القوة العمودية N = m g وليست m."
     }
    },
    {
     "en": "3.924 N",
     "ar": "3.924 N",
     "why": {
      "en": "The mass was left out; μs g is an acceleration (m/s²), not a force.",
      "ar": "سقطت الكتلة؛ μs g تسارع (m/s²) وليست قوة."
     }
    },
    {
     "en": "490.5 N",
     "ar": "490.5 N",
     "why": {
      "en": "The ratio was inverted: the limiting friction is μs N, not N / μs.",
      "ar": "قُلبت النسبة: الاحتكاك الحدّي هو μs N وليس N / μs."
     }
    },
    {
     "en": "78.48 N",
     "ar": "78.48 N",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "N = m g = 20 × 9.81 = 196.2 N;  F_max = μs N = 0.4 × 196.2 = 78.48 N.",
    "ar": "N = m g = 20 × 9.81 = 196.2 N؛ F_max = μs N = 0.4 × 196.2 = 78.48 N."
   }
  },
  {
   "id": "sd-06",
   "subject": "sd",
   "topic": "kin",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A car starts from rest and accelerates uniformly at 3 m/s² for 8 s. What is its speed at the end?",
    "ar": "سيارة تنطلق من السكون وتتسارع بانتظام بمعدل 3 m/s² مدة 8 s. ما سرعتها في النهاية؟"
   },
   "opts": [
    {
     "en": "0.375 m/s",
     "ar": "0.375 m/s",
     "why": {
      "en": "The ratio was inverted: v = a × t, not a / t.",
      "ar": "قُلبت النسبة: v = a × t وليس a / t."
     }
    },
    {
     "en": "11 m/s",
     "ar": "11 m/s",
     "why": {
      "en": "Acceleration and time were added; the units differ, v = a t.",
      "ar": "جُمع التسارع والزمن؛ الوحدتان مختلفتان وv = a t."
     }
    },
    {
     "en": "96 m/s",
     "ar": "96 m/s",
     "why": {
      "en": "This is the DISTANCE travelled (½ a t² = 96 m), not the speed.",
      "ar": "هذه المسافة المقطوعة (½ a t² = 96 m) وليست السرعة."
     }
    },
    {
     "en": "24 m/s",
     "ar": "24 m/s",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "v = v0 + a t = 0 + 3 × 8 = 24 m/s.",
    "ar": "الحل: v = v0 + a t = 0 + 3 × 8 = 24 m/s."
   }
  },
  {
   "id": "sd-07",
   "subject": "sd",
   "topic": "newton",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A net force of 3000 N acts on a 1200 kg car. What is its acceleration?",
    "ar": "قوة محصلة مقدارها 3000 N تؤثر في سيارة كتلتها 1200 kg. ما تسارعها؟"
   },
   "opts": [
    {
     "en": "0.2548 m/s²",
     "ar": "0.2548 m/s²",
     "why": {
      "en": "The mass was multiplied by g (i.e. the weight was used) in the denominator; Newton's second law uses the mass.",
      "ar": "ضُربت الكتلة في g (أي استُعمل الوزن) في المقام؛ قانون نيوتن الثاني يستعمل الكتلة."
     }
    },
    {
     "en": "2.5 m/s²",
     "ar": "2.5 m/s²",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "0.4 m/s²",
     "ar": "0.4 m/s²",
     "why": {
      "en": "The ratio was inverted: a = F / m.",
      "ar": "قُلبت النسبة: a = F / m."
     }
    },
    {
     "en": "3.6e+06 m/s²",
     "ar": "3.6e+06 m/s²",
     "why": {
      "en": "The force and mass were multiplied instead of divided.",
      "ar": "ضُربت القوة في الكتلة بدل قسمتها."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "Newton's second law: a = ΣF / m = 3000 / 1200 = 2.5 m/s².",
    "ar": "قانون نيوتن الثاني: a = ΣF / m = 3000 / 1200 = 2.5 m/s²."
   }
  },
  {
   "id": "sd-08",
   "subject": "sd",
   "topic": "energy",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "What is the kinetic energy of a 2 kg body moving at 6 m/s?",
    "ar": "ما الطاقة الحركية لجسم كتلته 2 kg يتحرك بسرعة 6 m/s؟"
   },
   "opts": [
    {
     "en": "36 J",
     "ar": "36 J",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "12 J",
     "ar": "12 J",
     "why": {
      "en": "This is the momentum m v (kg·m/s), not the kinetic energy.",
      "ar": "هذه كمية الحركة m v (kg·m/s) وليست الطاقة الحركية."
     }
    },
    {
     "en": "18 J",
     "ar": "18 J",
     "why": {
      "en": "The mass was left out of the formula.",
      "ar": "سقطت الكتلة من الصيغة."
     }
    },
    {
     "en": "72 J",
     "ar": "72 J",
     "why": {
      "en": "The factor ½ was left out: KE = ½ m v².",
      "ar": "سقط العامل ½: KE = ½ m v²."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "KE = ½ m v² = ½ × 2 × 6² = 36 J.",
    "ar": "الحل: KE = ½ m v² = ½ × 2 × 6² = 36 J."
   }
  },
  {
   "id": "sd-09",
   "subject": "sd",
   "topic": "momentum",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "What is the linear momentum of a 1000 kg car travelling at 20 m/s?",
    "ar": "ما كمية الحركة الخطية لسيارة كتلتها 1000 kg تسير بسرعة 20 m/s؟"
   },
   "opts": [
    {
     "en": "50 kg·m/s",
     "ar": "50 kg·m/s",
     "why": {
      "en": "The mass was divided by the speed; p = m × v.",
      "ar": "قُسمت الكتلة على السرعة؛ p = m × v."
     }
    },
    {
     "en": "200000 kg·m/s",
     "ar": "200000 kg·m/s",
     "why": {
      "en": "This number is the kinetic energy ½ m v² (in joules), not momentum.",
      "ar": "هذا الرقم هو الطاقة الحركية ½ m v² (بالجول) وليس كمية الحركة."
     }
    },
    {
     "en": "10000 kg·m/s",
     "ar": "10000 kg·m/s",
     "why": {
      "en": "A factor ½ was inserted; it belongs to kinetic energy, not momentum (p = m v).",
      "ar": "أُدخل العامل ½ وهو خاص بالطاقة الحركية لا بكمية الحركة (p = m v)."
     }
    },
    {
     "en": "20000 kg·m/s",
     "ar": "20000 kg·m/s",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "p = m v = 1000 × 20 = 20000 kg·m/s.",
    "ar": "الحل: p = m v = 1000 × 20 = 20000 kg·m/s."
   }
  },
  {
   "id": "sd-10",
   "subject": "sd",
   "topic": "centroid",
   "level": 1,
   "type": "calc",
   "q": {
    "en": "A uniform thin triangular plate has a base of 0.6 m and a height of 0.9 m. How high above the base is its centroid?",
    "ar": "صفيحة رقيقة منتظمة مثلثة الشكل قاعدتها 0.6 m وارتفاعها 0.9 m. ما ارتفاع مركز ثقلها (المركز الهندسي) فوق القاعدة؟"
   },
   "opts": [
    {
     "en": "0.6 m",
     "ar": "0.6 m",
     "why": {
      "en": "Two-thirds of the height is measured from the apex (top vertex), not from the base.",
      "ar": "ثلثا الارتفاع يُقاسان من الرأس (القمة) وليس من القاعدة."
     }
    },
    {
     "en": "0.45 m",
     "ar": "0.45 m",
     "why": {
      "en": "h/2 is the centroid height of a rectangle, not of a triangle.",
      "ar": "h/2 ارتفاع مركز المستطيل وليس المثلث."
     }
    },
    {
     "en": "0.3 m",
     "ar": "0.3 m",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "0.225 m",
     "ar": "0.225 m",
     "why": {
      "en": "h/4 is not a triangle centroid location; the medians meet at h/3 from the base.",
      "ar": "h/4 ليس موضع مركز المثلث؛ فالمتوسطات تتلاقى على ارتفاع h/3 من القاعدة."
     }
    }
   ],
   "ans": 2,
   "exp": {
    "en": "The centroid of a triangle lies at one third of the height measured from the base: ȳ = h/3 = 0.9/3 = 0.3 m.",
    "ar": "يقع مركز المثلث عند ثلث الارتفاع مقيساً من القاعدة: ȳ = h/3 = 0.9/3 = 0.3 m."
   }
  },
  {
   "id": "sd-11",
   "subject": "sd",
   "topic": "force",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "Two forces, 100 N and 80 N, are applied at one point and the angle between their directions (both drawn away from the point) is 60°. What is the magnitude of the resultant?",
    "ar": "قوتان 100 N و80 N مطبقتان في نقطة واحدة والزاوية بين اتجاهيهما (كلتاهما خارجتان من النقطة) 60°. ما مقدار المحصلة؟"
   },
   "opts": [
    {
     "en": "180 N",
     "ar": "180 N",
     "why": {
      "en": "Adding magnitudes is valid only when the angle is 0°.",
      "ar": "جمع المقدارين صحيح فقط عندما تكون الزاوية 0°."
     }
    },
    {
     "en": "128.1 N",
     "ar": "128.1 N",
     "why": {
      "en": "This treats the forces as perpendicular (R = √(P² + Q²)) and ignores the actual 60° angle.",
      "ar": "هذا يعامل القوتين كأنهما متعامدتان (R = √(P² + Q²)) ويتجاهل الزاوية الفعلية 60°."
     }
    },
    {
     "en": "91.65 N",
     "ar": "91.65 N",
     "why": {
      "en": "The sign of the cosine term is wrong: with the angle between the force directions, R² = P² + Q² + 2PQ cos θ (the minus sign belongs to the interior angle of the force triangle).",
      "ar": "إشارة حد جيب التمام خاطئة: مع الزاوية بين اتجاهي القوتين R² = P² + Q² + 2PQ cos θ (الإشارة السالبة تخص الزاوية الداخلية لمثلث القوى)."
     }
    },
    {
     "en": "156.2 N",
     "ar": "156.2 N",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "R² = P² + Q² + 2 P Q cos θ = 10000 + 6400 + 2×100×80×cos 60° = 24400;  R = 156.2 N.",
    "ar": "R² = P² + Q² + 2 P Q cos θ = 10000 + 6400 + 2×100×80×cos 60° = 24400؛ R = 156.2 N."
   }
  },
  {
   "id": "sd-12",
   "subject": "sd",
   "topic": "moment",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A couple consists of two parallel forces of 150 N each, equal and opposite, with a perpendicular distance of 0.6 m between their lines of action. What is the moment of the couple?",
    "ar": "زوج قوى يتكون من قوتين متوازيتين مقدار كل منهما 150 N متساويتين ومتعاكستين والبعد العمودي بين خطي عملهما 0.6 m. ما عزم الزوج؟"
   },
   "opts": [
    {
     "en": "90 N·m",
     "ar": "90 N·m",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "180 N·m",
     "ar": "180 N·m",
     "why": {
      "en": "Both forces were counted separately with the full distance; the couple moment is F × d once (F d/2 from each force about the midpoint).",
      "ar": "حُسبت القوتان كلٌّ بالمسافة كاملة؛ عزم الزوج F × d مرة واحدة (F d/2 لكل قوة حول المنتصف)."
     }
    },
    {
     "en": "0 N·m",
     "ar": "0 N·m",
     "why": {
      "en": "The resultant FORCE is zero, but the couple still has a moment equal to F × d; a couple is a pure moment.",
      "ar": "محصلة القوى صفر لكن للزوج عزماً يساوي F × d؛ فالزوج عزم صرف."
     }
    },
    {
     "en": "45 N·m",
     "ar": "45 N·m",
     "why": {
      "en": "Only one force acting at half the distance was taken; both forces contribute, giving F × d.",
      "ar": "أُخذت قوة واحدة بنصف المسافة فقط؛ كلتا القوتين تسهمان فيكون العزم F × d."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "M = F × d = 150 × 0.6 = 90 N·m, the same about every point (a couple is a free vector).",
    "ar": "M = F × d = 150 × 0.6 = 90 N·m، وهو نفسه حول أي نقطة (الزوج متجه حر)."
   }
  },
  {
   "id": "sd-13",
   "subject": "sd",
   "topic": "equil",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A simply supported beam AB, span 6 m, carries one vertical load of 12 kN at 2 m from support A. What is the vertical reaction at support B?",
    "ar": "جائز بسيط الإسناد AB فتحته 6 m يحمل حملاً رأسياً 12 kN على بعد 2 m من المسند A. ما رد الفعل الرأسي عند المسند B؟"
   },
   "opts": [
    {
     "en": "8 kN",
     "ar": "8 kN",
     "why": {
      "en": "This is the reaction at A (nearer to the load); B, the farther support, carries less.",
      "ar": "هذا رد الفعل عند A (الأقرب إلى الحمل)؛ أما B الأبعد فيحمل أقل."
     }
    },
    {
     "en": "4 kN",
     "ar": "4 kN",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "6 kN",
     "ar": "6 kN",
     "why": {
      "en": "An equal split only holds for a load at mid-span.",
      "ar": "التقسيم المتساوي يصح فقط لحمل في منتصف الفتحة."
     }
    },
    {
     "en": "24 kN",
     "ar": "24 kN",
     "why": {
      "en": "The moment W × x (kN·m) was not divided by the span L; R_B = W x / L.",
      "ar": "لم يُقسم العزم W × x (kN·m) على الفتحة L؛ R_B = W x / L."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "ΣM_A = 0: R_B × 6 − 12 × 2 = 0, so R_B = 4 kN; then R_A = 12 − 4 = 8 kN.",
    "ar": "ΣM_A = 0: R_B × 6 − 12 × 2 = 0 فيكون R_B = 4 kN؛ ثم R_A = 12 − 4 = 8 kN."
   }
  },
  {
   "id": "sd-14",
   "subject": "sd",
   "topic": "truss",
   "level": 2,
   "type": "concept",
   "q": {
    "en": "In a plane truss, a joint connects three members. Two of them are collinear (on the same straight line) and no external load or support reaction acts at the joint. What is the force in the third member?",
    "ar": "في جمالون مستوٍ تلتقي ثلاثة عناصر في عقدة؛ اثنان منها على استقامة واحدة ولا يؤثر في العقدة حمل خارجي ولا رد فعل مسند. ما القوة في العنصر الثالث؟"
   },
   "opts": [
    {
     "en": "Equal to the force in the collinear members",
     "ar": "تساوي القوة في العنصرين على الاستقامة",
     "why": {
      "en": "Nothing balances a force from the third member perpendicular to the line; ΣF perpendicular to the line = F₃ sin θ = 0 forces F₃ = 0.",
      "ar": "لا شيء يوازن مركّبة عمودية للعنصر الثالث على الخط؛ ΣF العمودي على الخط = F₃ sin θ = 0 فتكون F₃ = 0."
     }
    },
    {
     "en": "Zero (a zero-force member)",
     "ar": "صفر (عنصر صفري القوة)",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "Half the force in each collinear member",
     "ar": "نصف القوة في كل من العنصرين على الاستقامة",
     "why": {
      "en": "No fraction of the collinear force can be balanced in the perpendicular direction, since the collinear members have no perpendicular component.",
      "ar": "لا يمكن موازنة أي جزء من قوة العنصرين على الاستقامة في الاتجاه العمودي لأنه لا مركّبة عمودية لهما."
     }
    },
    {
     "en": "It cannot be determined without the angle",
     "ar": "لا يمكن تحديدها دون معرفة الزاوية",
     "why": {
      "en": "The angle cancels out: F₃ sin θ = 0 gives F₃ = 0 for any angle θ ≠ 0.",
      "ar": "الزاوية تُختصر: F₃ sin θ = 0 تعطي F₃ = 0 لأي زاوية θ ≠ 0."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "Resolve forces perpendicular to the collinear members: the collinear members contribute nothing, so F₃ sin θ = 0 and F₃ = 0. Along the line, the two collinear members carry equal forces.",
    "ar": "بتحليل القوى عمودياً على العنصرين المستقيمين: لا إسهام لهما، فتكون F₃ sin θ = 0 أي F₃ = 0. وعلى امتداد الخط يحمل العنصران قوتين متساويتين."
   }
  },
  {
   "id": "sd-15",
   "subject": "sd",
   "topic": "truss",
   "level": 2,
   "type": "applied",
   "q": {
    "en": "A symmetric two-member bracket (light members, pin-jointed at all three joints) carries a vertical load of 10 kN at the apex joint. Each member makes 30° with the horizontal. What is the axial force in each member (magnitude)?",
    "ar": "حامل متماثل من عنصرين (عنصران خفيفان موصولان بمفاصل عند العقد الثلاث) يحمل حملاً رأسياً 10 kN عند العقدة العلوية. كل عنصر يصنع 30° مع الأفقي. ما مقدار القوة المحورية في كل عنصر؟"
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
     "en": "5.774 kN",
     "ar": "5.774 kN",
     "why": {
      "en": "cos was used instead of sin: the vertical component of each member force is F sin θ for an angle measured from the horizontal.",
      "ar": "استُعمل cos بدل sin: المركّبة الرأسية لقوة كل عنصر F sin θ للزاوية المقاسة من الأفقي."
     }
    },
    {
     "en": "5 kN",
     "ar": "5 kN",
     "why": {
      "en": "The inclination was ignored: this is only the vertical share, not the axial force.",
      "ar": "أُهمل الميل: هذه الحصة الرأسية فقط وليست القوة المحورية."
     }
    },
    {
     "en": "20 kN",
     "ar": "20 kN",
     "why": {
      "en": "The load was not shared between the two members; each carries half the vertical load.",
      "ar": "لم يُقسم الحمل بين العنصرين؛ يحمل كل عنصر نصف الحمل الرأسي."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Vertical equilibrium of the joint: 2 F sin 30° = 10 kN, so F = 10 / (2 × 0.5) = 10 kN, compression in both members.",
    "ar": "اتزان العقدة رأسياً: 2 F sin 30° = 10 kN فيكون F = 10 / (2 × 0.5) = 10 kN، ضغط في العنصرين."
   }
  },
  {
   "id": "sd-16",
   "subject": "sd",
   "topic": "friction",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A block rests on a rough inclined plane with μs = 0.5. At what maximum incline angle (from the horizontal) can the block stay at rest?",
    "ar": "كتلة موضوعة على مستوٍ مائل خشن ومعامل الاحتكاك السكوني μs = 0.5. ما أكبر زاوية ميل (عن الأفقي) تبقى عندها الكتلة ساكنة؟"
   },
   "opts": [
    {
     "en": "26.57°",
     "ar": "26.57°",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "60.00°",
     "ar": "60.00°",
     "why": {
      "en": "cos θ = μs was used; the limit condition is tan θ = μs.",
      "ar": "استُعملت cos θ = μs؛ والشرط الحدّي هو tan θ = μs."
     }
    },
    {
     "en": "63.43°",
     "ar": "63.43°",
     "why": {
      "en": "The ratio was inverted: tan θ = μs, not 1/μs.",
      "ar": "قُلبت النسبة: tan θ = μs وليس 1/μs."
     }
    },
    {
     "en": "30.00°",
     "ar": "30.00°",
     "why": {
      "en": "sin θ = μs was used; at the limit the equilibrium gives tan θ = μs (sin θ = μs cos θ).",
      "ar": "استُعملت sin θ = μs؛ والاتزان الحدّي يعطي tan θ = μs (أي sin θ = μs cos θ)."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Along the plane: m g sin θ = μs m g cos θ at the limit, so tan θ = μs and θ = tan⁻¹(0.5) = 26.57° (the angle of friction); independent of mass.",
    "ar": "على امتداد المستوي: m g sin θ = μs m g cos θ عند الحد، فيكون tan θ = μs وθ = tan⁻¹(0.5) = 26.57° (زاوية الاحتكاك)؛ ولا تعتمد على الكتلة."
   }
  },
  {
   "id": "sd-17",
   "subject": "sd",
   "topic": "centroid",
   "level": 2,
   "type": "applied",
   "q": {
    "en": "An L-shaped section is made of two rectangles: a base flange 60 mm wide × 20 mm tall, and a vertical web 20 mm wide × 80 mm tall standing on top of the flange. How high is the centroid of the whole section above the bottom of the flange?",
    "ar": "مقطع على شكل L مكوّن من مستطيلين: شفة قاعدية عرضها 60 mm وارتفاعها 20 mm، وجذع رأسي عرضه 20 mm وارتفاعه 80 mm قائم فوق الشفة. ما ارتفاع مركز ثقل المقطع كاملاً فوق أسفل الشفة؟"
   },
   "opts": [
    {
     "en": "61.43 mm",
     "ar": "61.43 mm",
     "why": {
      "en": "This is the distance of the centroid from the TOP of the section, not from the bottom.",
      "ar": "هذه مسافة المركز عن أعلى المقطع وليس عن أسفله."
     }
    },
    {
     "en": "38.57 mm",
     "ar": "38.57 mm",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "35 mm",
     "ar": "35 mm",
     "why": {
      "en": "The two centroid heights were averaged without weighting by their areas; ȳ = ΣA y / ΣA.",
      "ar": "أُخذ متوسط ارتفاعي المركزين دون ترجيح بالمساحة؛ ȳ = ΣA y / ΣA."
     }
    },
    {
     "en": "50 mm",
     "ar": "50 mm",
     "why": {
      "en": "Half of the overall height (100 mm) would be the centroid only for a rectangle; the section has more area low down.",
      "ar": "نصف الارتفاع الكلي (100 mm) هو المركز للمستطيل فقط؛ أما هنا فالمساحة الأكبر في الأسفل."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "Flange: A = 1200 mm², y = 10 mm; web: A = 1600 mm², y = 20 + 40 = 60 mm. ȳ = (A₁y₁ + A₂y₂)/(A₁ + A₂) = (1200×10 + 1600×60) / 2800 = 38.57 mm.",
    "ar": "الشفة: A = 1200 mm² وy = 10 mm؛ الجذع: A = 1600 mm² وy = 20 + 40 = 60 mm. ȳ = (A₁y₁ + A₂y₂)/(A₁ + A₂) = (1200×10 + 1600×60) / 2800 = 38.57 mm."
   }
  },
  {
   "id": "sd-18",
   "subject": "sd",
   "topic": "kin",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "A ball is thrown vertically upward at 20 m/s. Neglecting air resistance and taking g = 9.81 m/s², what maximum height does it reach above the release point?",
    "ar": "كرة تُقذف رأسياً إلى الأعلى بسرعة 20 m/s. بإهمال مقاومة الهواء وأخذ g = 9.81 m/s²، ما أقصى ارتفاع تبلغه فوق نقطة الإطلاق؟"
   },
   "opts": [
    {
     "en": "20.39 m",
     "ar": "20.39 m",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "40.77 m",
     "ar": "40.77 m",
     "why": {
      "en": "The factor 2 in the denominator was forgotten: from v² = v0² − 2 g h, h = v0² / (2 g).",
      "ar": "نُسي العامل 2 في المقام: من v² = v0² − 2 g h يكون h = v0² / (2 g)."
     }
    },
    {
     "en": "2.039 m",
     "ar": "2.039 m",
     "why": {
      "en": "v0 / g is the TIME to the top (about 2.04 s), not the height.",
      "ar": "v0 / g هو الزمن حتى القمة (نحو 2.04 s) وليس الارتفاع."
     }
    },
    {
     "en": "200 m",
     "ar": "200 m",
     "why": {
      "en": "Dividing by g was forgotten: v0² / 2 is not a length.",
      "ar": "نُسيت القسمة على g: v0² / 2 ليست طولاً."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "At the top v = 0: 0 = 20² − 2 × 9.81 × h, so h = 20² / (2 × 9.81) = 20.39 m.",
    "ar": "عند القمة v = 0: 0 = 20² − 2 × 9.81 × h فيكون h = 20² / (2 × 9.81) = 20.39 m."
   }
  },
  {
   "id": "sd-19",
   "subject": "sd",
   "topic": "newton",
   "level": 2,
   "type": "calc",
   "q": {
    "en": "Two masses 5 kg and 3 kg hang from the ends of a light inextensible string passing over a frictionless, massless pulley (Atwood machine). Taking g = 9.81 m/s², what is the magnitude of their acceleration?",
    "ar": "كتلتان 5 kg و3 kg معلقتان بطرفي خيط خفيف غير مطاطي يمر على بكرة بلا احتكاك وعديمة الكتلة (آلة أتوود). بأخذ g = 9.81 m/s²، ما مقدار تسارعهما؟"
   },
   "opts": [
    {
     "en": "19.62 m/s²",
     "ar": "19.62 m/s²",
     "why": {
      "en": "This is the net force (N), not an acceleration; it must be divided by the total mass.",
      "ar": "هذه القوة المحصلة (N) وليست تسارعاً؛ يجب قسمتها على الكتلة الكلية."
     }
    },
    {
     "en": "39.24 m/s²",
     "ar": "39.24 m/s²",
     "why": {
      "en": "The ratio was inverted: a = (m₁ − m₂) g / (m₁ + m₂).",
      "ar": "قُلبت النسبة: a = (m₁ − m₂) g / (m₁ + m₂)."
     }
    },
    {
     "en": "3.924 m/s²",
     "ar": "3.924 m/s²",
     "why": {
      "en": "Only the heavier mass was divided by; both masses move together, so the total mass m₁ + m₂ must be used.",
      "ar": "قُسم على الكتلة الأكبر فقط؛ الكتلتان تتحركان معاً فيجب استعمال الكتلة الكلية m₁ + m₂."
     }
    },
    {
     "en": "2.453 m/s²",
     "ar": "2.453 m/s²",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Net force = (m₁ − m₂) g = 19.62 N moves the total mass m₁ + m₂ = 8 kg: a = 19.62 / 8 = 2.453 m/s².",
    "ar": "القوة المحصلة = (m₁ − m₂) g = 19.62 N تحرك الكتلة الكلية m₁ + m₂ = 8 kg: a = 19.62 / 8 = 2.453 m/s²."
   }
  },
  {
   "id": "sd-20",
   "subject": "sd",
   "topic": "energy",
   "level": 2,
   "type": "applied",
   "q": {
    "en": "A 5 kg block is released from rest on a smooth (frictionless) incline at 30° and slides 4 m along the incline. Taking g = 9.81 m/s², what is its speed after sliding?",
    "ar": "كتلة 5 kg تُترك من السكون على مستوٍ مائل أملس (بلا احتكاك) بزاوية 30° وتنزلق مسافة 4 m على امتداد المستوي. بأخذ g = 9.81 m/s²، ما سرعتها بعد الانزلاق؟"
   },
   "opts": [
    {
     "en": "8.859 m/s",
     "ar": "8.859 m/s",
     "why": {
      "en": "The slope length was used as the vertical drop; the height lost is L sin θ.",
      "ar": "استُعمل طول المستوي كأنه الهبوط الرأسي؛ والارتفاع المفقود هو L sin θ."
     }
    },
    {
     "en": "4.429 m/s",
     "ar": "4.429 m/s",
     "why": {
      "en": "The factor 2 was lost: m g h = ½ m v² gives v² = 2 g h.",
      "ar": "ضاع العامل 2: m g h = ½ m v² يعطي v² = 2 g h."
     }
    },
    {
     "en": "39.24 m/s",
     "ar": "39.24 m/s",
     "why": {
      "en": "This is v², not v; the square root was not taken.",
      "ar": "هذه قيمة v² وليست v؛ لم يُؤخذ الجذر التربيعي."
     }
    },
    {
     "en": "6.264 m/s",
     "ar": "6.264 m/s",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "Energy: m g (L sin θ) = ½ m v², so v = √(2 g L sin θ) = √(2 × 9.81 × 4 × 0.5) = 6.264 m/s (independent of the mass).",
    "ar": "الطاقة: m g (L sin θ) = ½ m v² فيكون v = √(2 g L sin θ) = √(2 × 9.81 × 4 × 0.5) = 6.264 m/s (ولا تعتمد على الكتلة)."
   }
  },
  {
   "id": "sd-21",
   "subject": "sd",
   "topic": "momentum",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "A 1500 kg car moving at 20 m/s collides head-on with a stationary 1000 kg car, and the two stick together (perfectly inelastic). Ignoring external horizontal forces during the impact, how much kinetic energy is lost?",
    "ar": "سيارة كتلتها 1500 kg تسير بسرعة 20 m/s تصطدم وجهاً لوجه بسيارة ساكنة كتلتها 1000 kg ويلتحمان معاً (تصادم عديم المرونة تماماً). بإهمال القوى الأفقية الخارجية أثناء التصادم، كم مقدار الطاقة الحركية المفقودة؟"
   },
   "opts": [
    {
     "en": "120 kJ",
     "ar": "120 kJ",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "300 kJ",
     "ar": "300 kJ",
     "why": {
      "en": "This is the whole initial kinetic energy; the combined cars still move after the impact, so not all energy is lost.",
      "ar": "هذه الطاقة الحركية الابتدائية كلها؛ السيارتان الملتحمتان تتحركان بعد التصادم فلا تُفقد الطاقة كلها."
     }
    },
    {
     "en": "0 kJ",
     "ar": "0 kJ",
     "why": {
      "en": "Momentum is conserved in every collision, but kinetic energy is not conserved when the bodies stick together.",
      "ar": "كمية الحركة محفوظة في كل تصادم لكن الطاقة الحركية لا تُحفظ عندما يلتحم الجسمان."
     }
    },
    {
     "en": "180 kJ",
     "ar": "180 kJ",
     "why": {
      "en": "This is the kinetic energy remaining after the impact, not the amount lost.",
      "ar": "هذه الطاقة الحركية المتبقية بعد التصادم وليست المفقودة."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Momentum: v′ = 1500×20 / 2500 = 12 m/s. KE before = 300 kJ; after = 180 kJ; loss = 120 kJ (turned into deformation and heat).",
    "ar": "كمية الحركة: v′ = 1500×20 / 2500 = 12 m/s. الطاقة قبل = 300 kJ؛ بعد = 180 kJ؛ المفقود = 120 kJ (تحول إلى تشوه وحرارة)."
   }
  },
  {
   "id": "sd-22",
   "subject": "sd",
   "topic": "rot",
   "level": 3,
   "type": "multi",
   "q": {
    "en": "Multi-step problem. A uniform solid disk of mass 20 kg and radius 0.3 m is mounted on a frictionless fixed axle through its centre and starts from rest. A constant torque of 12 N·m is applied about the axle for 5 s. Answer the three steps (partial credit is given).",
    "ar": "مسألة متعددة الخطوات. قرص مصمت منتظم كتلته 20 kg ونصف قطره 0.3 m مركّب على محور ثابت عديم الاحتكاك يمر بمركزه ويبدأ من السكون. يؤثر عزم ثابت 12 N·m حول المحور مدة 5 s. أجب عن الخطوات الثلاث (يُمنح تقدير جزئي)."
   },
   "steps": [
    {
     "id": "a",
     "q": {
      "en": "Step 1: What is the moment of inertia of the disk about its axle?",
      "ar": "الخطوة 1: ما عزم القصور الذاتي للقرص حول محوره؟"
     },
     "opts": [
      {
       "en": "0.9 kg·m²",
       "ar": "0.9 kg·m²",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "3 kg·m²",
       "ar": "3 kg·m²",
       "why": {
        "en": "The radius was not squared: I = ½ m R².",
        "ar": "لم يُربَّع نصف القطر: I = ½ m R²."
       }
      },
      {
       "en": "0.72 kg·m²",
       "ar": "0.72 kg·m²",
       "why": {
        "en": "This is the formula for a solid sphere (2/5) m R², not a disk.",
        "ar": "هذه صيغة الكرة المصمتة (2/5) m R² وليست القرص."
       }
      },
      {
       "en": "1.8 kg·m²",
       "ar": "1.8 kg·m²",
       "why": {
        "en": "This is the value for a thin ring (hoop), m R²; a solid disk has half of that.",
        "ar": "هذه قيمة الحلقة الرقيقة m R²؛ والقرص المصمت نصفها."
       }
      }
     ],
     "ans": 0,
     "exp": {
      "en": "I = ½ m R² = ½ × 20 × 0.3² = 0.9 kg·m².",
      "ar": "الحل: I = ½ m R² = ½ × 20 × 0.3² = 0.9 kg·m²."
     }
    },
    {
     "id": "b",
     "q": {
      "en": "Step 2: What is the angular acceleration?",
      "ar": "الخطوة 2: ما التسارع الزاوي؟"
     },
     "opts": [
      {
       "en": "13.33 rad/s²",
       "ar": "13.33 rad/s²",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "0.075 rad/s²",
       "ar": "0.075 rad/s²",
       "why": {
        "en": "The ratio was inverted (I / T).",
        "ar": "قُلبت النسبة (I / T)."
       }
      },
      {
       "en": "6.667 rad/s²",
       "ar": "6.667 rad/s²",
       "why": {
        "en": "The ring formula m R² was used for I instead of ½ m R².",
        "ar": "استُعملت صيغة الحلقة m R² لـI بدل ½ m R²."
       }
      },
      {
       "en": "10.8 rad/s²",
       "ar": "10.8 rad/s²",
       "why": {
        "en": "The torque was multiplied by I; the law is α = T / I.",
        "ar": "ضُرب العزم في I؛ والقانون α = T / I."
       }
      }
     ],
     "ans": 0,
     "exp": {
      "en": "T = I α, so α = 12 / 0.9 = 13.33 rad/s².",
      "ar": "T = I α فيكون α = 12 / 0.9 = 13.33 rad/s²."
     }
    },
    {
     "id": "c",
     "q": {
      "en": "Step 3: What is the angular speed after 5 s?",
      "ar": "الخطوة 3: ما السرعة الزاوية بعد 5 s؟"
     },
     "opts": [
      {
       "en": "33.33 rad/s",
       "ar": "33.33 rad/s",
       "why": {
        "en": "A factor ½ was wrongly applied: ω = α t from rest.",
        "ar": "طُبّق العامل ½ خطأً: ω = α t من السكون."
       }
      },
      {
       "en": "166.7 rad/s",
       "ar": "166.7 rad/s",
       "why": {
        "en": "This is the ANGLE turned (½ α t² in rad), not the angular speed.",
        "ar": "هذه الزاوية المقطوعة (½ α t² بالراديان) وليست السرعة الزاوية."
       }
      },
      {
       "en": "66.67 rad/s",
       "ar": "66.67 rad/s",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "636.6 rad/s",
       "ar": "636.6 rad/s",
       "why": {
        "en": "This value is the speed in rpm; it was left unconverted and labelled rad/s.",
        "ar": "هذه القيمة بوحدة rpm؛ تُركت دون تحويل وسُميت rad/s."
       }
      }
     ],
     "ans": 2,
     "exp": {
      "en": "ω = ω0 + α t = 0 + 13.33 × 5 = 66.67 rad/s (about 636.6 rpm).",
      "ar": "ω = ω0 + α t = 0 + 13.33 × 5 = 66.67 rad/s (نحو 636.6 rpm)."
     }
    }
   ],
   "exp": {
    "en": "A bigger moment of inertia resists angular acceleration: torque, moment of inertia and angular acceleration are linked by T = I α, exactly like F = m a.",
    "ar": "كلما زاد عزم القصور الذاتي زادت مقاومة التسارع الزاوي: يرتبط العزم وعزم القصور والتسارع الزاوي بالعلاقة T = I α تماماً كما F = m a."
   }
  },
  {
   "id": "sd-23",
   "subject": "sd",
   "topic": "friction",
   "level": 3,
   "type": "multi",
   "q": {
    "en": "Multi-step problem. A 10 kg block slides DOWN a rough incline at 30° to the horizontal. The coefficient of kinetic friction is μk = 0.2; take g = 9.81 m/s². Answer the three steps (partial credit is given).",
    "ar": "مسألة متعددة الخطوات. كتلة 10 kg تنزلق إلى الأسفل على مستوٍ مائل خشن بزاوية 30° مع الأفقي. معامل الاحتكاك الحركي μk = 0.2؛ خذ g = 9.81 m/s². أجب عن الخطوات الثلاث (يُمنح تقدير جزئي)."
   },
   "steps": [
    {
     "id": "a",
     "q": {
      "en": "Step 1: What is the normal force from the incline on the block?",
      "ar": "الخطوة 1: ما القوة العمودية التي يؤثر بها المستوي في الكتلة؟"
     },
     "opts": [
      {
       "en": "49.05 N",
       "ar": "49.05 N",
       "why": {
        "en": "The sine component (along the slope) was taken; the normal force balances the component perpendicular to the slope, m g cos θ.",
        "ar": "أُخذت مركّبة الجيب (على امتداد المستوي)؛ والقوة العمودية توازن المركّبة العمودية m g cos θ."
       }
      },
      {
       "en": "84.96 N",
       "ar": "84.96 N",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "113.3 N",
       "ar": "113.3 N",
       "why": {
        "en": "The weight was divided by cos θ instead of multiplied.",
        "ar": "قُسم الوزن على cos θ بدل ضربه."
       }
      },
      {
       "en": "98.1 N",
       "ar": "98.1 N",
       "why": {
        "en": "The full weight is the normal force only on a horizontal surface; on an incline N = m g cos θ.",
        "ar": "الوزن كله هو القوة العمودية على سطح أفقي فقط؛ وعلى المستوي المائل N = m g cos θ."
       }
      }
     ],
     "ans": 1,
     "exp": {
      "en": "N = m g cos θ = 10 × 9.81 × cos 30° = 84.96 N.",
      "ar": "الحل: N = m g cos θ = 10 × 9.81 × cos 30° = 84.96 N."
     }
    },
    {
     "id": "b",
     "q": {
      "en": "Step 2: What is the kinetic friction force?",
      "ar": "الخطوة 2: ما قوة الاحتكاك الحركي؟"
     },
     "opts": [
      {
       "en": "19.62 N",
       "ar": "19.62 N",
       "why": {
        "en": "The full weight was used instead of the normal force N = m g cos θ.",
        "ar": "استُعمل الوزن كله بدل القوة العمودية N = m g cos θ."
       }
      },
      {
       "en": "9.81 N",
       "ar": "9.81 N",
       "why": {
        "en": "Friction is proportional to the normal force, not to the component along the slope.",
        "ar": "الاحتكاك يتناسب مع القوة العمودية لا مع المركّبة الموازية للمستوي."
       }
      },
      {
       "en": "424.8 N",
       "ar": "424.8 N",
       "why": {
        "en": "The normal force was divided by μk; friction is μk N.",
        "ar": "قُسمت القوة العمودية على μk؛ والاحتكاك μk N."
       }
      },
      {
       "en": "16.99 N",
       "ar": "16.99 N",
       "why": {
        "en": "",
        "ar": ""
       }
      }
     ],
     "ans": 3,
     "exp": {
      "en": "F_k = μk N = 0.2 × 84.96 = 16.99 N, directed up the slope.",
      "ar": "F_k = μk N = 0.2 × 84.96 = 16.99 N في اتجاه أعلى المستوي."
     }
    },
    {
     "id": "c",
     "q": {
      "en": "Step 3: What is the acceleration of the block down the slope?",
      "ar": "الخطوة 3: ما تسارع الكتلة إلى أسفل المستوي؟"
     },
     "opts": [
      {
       "en": "7.515 m/s²",
       "ar": "7.515 m/s²",
       "why": {
        "en": "The sine and cosine components were swapped: the driving term is g sin θ and the friction term is μk g cos θ.",
        "ar": "تبادلت مركّبتا الجيب وجيب التمام: الحد المحرك g sin θ وحد الاحتكاك μk g cos θ."
       }
      },
      {
       "en": "6.604 m/s²",
       "ar": "6.604 m/s²",
       "why": {
        "en": "Friction was added to the driving force; while sliding down it acts up the slope, so it is subtracted.",
        "ar": "أُضيف الاحتكاك إلى القوة المحركة؛ أثناء الانزلاق إلى الأسفل يعمل نحو أعلى المستوي فيُطرح."
       }
      },
      {
       "en": "3.206 m/s²",
       "ar": "3.206 m/s²",
       "why": {
        "en": "",
        "ar": ""
       }
      },
      {
       "en": "4.905 m/s²",
       "ar": "4.905 m/s²",
       "why": {
        "en": "Friction was ignored; it opposes the motion and reduces the acceleration.",
        "ar": "أُهمل الاحتكاك؛ وهو يعاكس الحركة ويقلل التسارع."
       }
      }
     ],
     "ans": 2,
     "exp": {
      "en": "m a = m g sin θ − μk m g cos θ, so a = g (sin θ − μk cos θ) = 9.81 × (0.5 − 0.2 × 0.866) = 3.206 m/s² (mass cancels).",
      "ar": "m a = m g sin θ − μk m g cos θ فيكون a = g (sin θ − μk cos θ) = 9.81 × (0.5 − 0.2 × 0.866) = 3.206 m/s² (تُختصر الكتلة)."
     }
    }
   ],
   "exp": {
    "en": "Resolve the weight along and perpendicular to the plane: the perpendicular part sets N and hence the friction; the parallel part minus friction drives the acceleration.",
    "ar": "حلّل الوزن إلى مركّبتين موازية للمستوي وعمودية عليه: العمودية تحدد N ومنها الاحتكاك؛ والموازية مطروحاً منها الاحتكاك تحدد التسارع."
   }
  },
  {
   "id": "sd-24",
   "subject": "sd",
   "topic": "vib",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "A 4 kg mass on a linear spring of stiffness k = 900 N/m oscillates freely without damping. What is its natural frequency f in hertz?",
    "ar": "كتلة 4 kg على نابض خطي صلابته k = 900 N/m تهتز اهتزازاً حراً دون تخميد. ما ترددها الطبيعي f بالهرتز؟"
   },
   "opts": [
    {
     "en": "2.387 Hz",
     "ar": "2.387 Hz",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "15 Hz",
     "ar": "15 Hz",
     "why": {
      "en": "This is the ANGULAR frequency ω = √(k/m) in rad/s; f = ω / 2π.",
      "ar": "هذا هو التردد الزاوي ω = √(k/m) بوحدة rad/s؛ وf = ω / 2π."
     }
    },
    {
     "en": "94.25 Hz",
     "ar": "94.25 Hz",
     "why": {
      "en": "ω was multiplied by 2π instead of divided: f = ω / (2π).",
      "ar": "ضُرب ω في 2π بدل قسمته: f = ω / (2π)."
     }
    },
    {
     "en": "0.4189 Hz",
     "ar": "0.4189 Hz",
     "why": {
      "en": "This is the PERIOD T = 1/f in seconds, not the frequency.",
      "ar": "هذه هي الدورة الزمنية T = 1/f بالثواني وليست التردد."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "ω = √(k/m) = √(900/4) = 15 rad/s;  f = ω / 2π = 2.387 Hz (period T = 0.4189 s).",
    "ar": "ω = √(k/m) = √(900/4) = 15 rad/s؛ f = ω / 2π = 2.387 Hz (الدورة الزمنية T = 0.4189 s)."
   }
  },
  {
   "id": "sd-25",
   "subject": "sd",
   "topic": "vib",
   "level": 3,
   "type": "concept",
   "q": {
    "en": "The mass of an undamped spring–mass system (spring stiffness unchanged) is made four times larger. How does its natural frequency change?",
    "ar": "تُضاعف كتلة منظومة نابض–كتلة غير مخمدة أربع مرات (وصلابة النابض لا تتغير). كيف يتغير ترددها الطبيعي؟"
   },
   "opts": [
    {
     "en": "It doubles",
     "ar": "يتضاعف",
     "why": {
      "en": "A larger mass makes the system more sluggish, which lowers the frequency, not raises it.",
      "ar": "الكتلة الأكبر تجعل المنظومة أبطأ فتخفض التردد ولا ترفعه."
     }
    },
    {
     "en": "It becomes four times smaller",
     "ar": "يصبح أصغر بأربع مرات",
     "why": {
      "en": "The frequency depends on √m, not on m itself: 4 times the mass gives only half the frequency.",
      "ar": "يعتمد التردد على √m لا على m نفسها: أربعة أمثال الكتلة تعطي نصف التردد فقط."
     }
    },
    {
     "en": "It does not change, because k is unchanged",
     "ar": "لا يتغير لأن k لم تتغير",
     "why": {
      "en": "ω = √(k/m) depends on both k and m; changing m changes the frequency.",
      "ar": "ω = √(k/m) تعتمد على k وm معاً؛ وتغيير m يغيّر التردد."
     }
    },
    {
     "en": "It is halved (f ∝ 1/√m)",
     "ar": "يصبح النصف (f ∝ 1/√m)",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "ω = √(k/m): for m → 4m, ω → ω/√4 = ω/2, so the natural frequency is halved (and the period is doubled).",
    "ar": "ω = √(k/m): عند m → 4m تصبح ω → ω/√4 = ω/2 فينخفض التردد الطبيعي إلى النصف (وتتضاعف الدورة الزمنية)."
   }
  },
  {
   "id": "sd-26",
   "subject": "sd",
   "topic": "friction",
   "level": 3,
   "type": "applied",
   "q": {
    "en": "A car on a level road brakes at the limit of tyre grip (no skidding), with a constant maximum friction coefficient μ = 0.8 between tyre and road. Starting from 25 m/s and taking g = 9.81 m/s², what is the stopping distance?",
    "ar": "سيارة على طريق أفقي تكبح عند حد تماسك الإطارات (دون انزلاق) بمعامل احتكاك أقصى ثابت μ = 0.8 بين الإطار والطريق. بدءاً من 25 m/s وبأخذ g = 9.81 m/s²، ما مسافة التوقف؟"
   },
   "opts": [
    {
     "en": "39.82 m",
     "ar": "39.82 m",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "3.186 m",
     "ar": "3.186 m",
     "why": {
      "en": "v / a is the stopping TIME (about 3.19 s), not the distance.",
      "ar": "v / a هو زمن التوقف (نحو 3.19 s) وليس المسافة."
     }
    },
    {
     "en": "390.6 m",
     "ar": "390.6 m",
     "why": {
      "en": "g was left out of the deceleration: a = μ g, not μ.",
      "ar": "سقطت g من التباطؤ: a = μ g وليس μ."
     }
    },
    {
     "en": "79.64 m",
     "ar": "79.64 m",
     "why": {
      "en": "The factor 2 was forgotten: v² = 2 a d gives d = v² / (2 a).",
      "ar": "نُسي العامل 2: v² = 2 a d يعطي d = v² / (2 a)."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Maximum deceleration a = μ g = 0.8 × 9.81 = 7.848 m/s² (independent of mass). d = v² / (2a) = 25² / (2 × 7.848) = 39.82 m.",
    "ar": "أقصى تباطؤ a = μ g = 0.8 × 9.81 = 7.848 m/s² (لا يعتمد على الكتلة). d = v² / (2a) = 25² / (2 × 7.848) = 39.82 m."
   }
  },
  {
   "id": "sd-27",
   "subject": "sd",
   "topic": "rot",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "A uniform solid disk of mass 5 kg and radius 0.2 m rotates about an axis perpendicular to its plane, parallel to the axis through its centre and a distance 0.5 m from it. What is its moment of inertia about that axis?",
    "ar": "قرص مصمت منتظم كتلته 5 kg ونصف قطره 0.2 m يدور حول محور عمودي على مستواه وموازٍ للمحور المار بمركزه وعلى بعد 0.5 m منه. ما عزم قصوره الذاتي حول ذلك المحور؟"
   },
   "opts": [
    {
     "en": "1.35 kg·m²",
     "ar": "1.35 kg·m²",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "1.25 kg·m²",
     "ar": "1.25 kg·m²",
     "why": {
      "en": "The disk's own moment of inertia about its centre (½ m R²) was left out of the parallel-axis theorem.",
      "ar": "أُهمل عزم القصور الذاتي للقرص حول مركزه (½ m R²) في نظرية المحاور المتوازية."
     }
    },
    {
     "en": "0.1 kg·m²",
     "ar": "0.1 kg·m²",
     "why": {
      "en": "This is only the value about the centre axis; the offset adds m d².",
      "ar": "هذه قيمته حول محور المركز فقط؛ والإزاحة تضيف m d²."
     }
    },
    {
     "en": "2.6 kg·m²",
     "ar": "2.6 kg·m²",
     "why": {
      "en": "The offset distance was not squared: the term is m d².",
      "ar": "لم تُربَّع مسافة الإزاحة: الحد هو m d²."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Parallel-axis theorem: I = I_cm + m d² = ½ m R² + m d² = ½×5×0.2² + 5×0.5² = 0.1 + 1.25 = 1.35 kg·m².",
    "ar": "نظرية المحاور المتوازية: I = I_cm + m d² = ½ m R² + m d² = ½×5×0.2² + 5×0.5² = 0.1 + 1.25 = 1.35 kg·m²."
   }
  },
  {
   "id": "sd-28",
   "subject": "sd",
   "topic": "kin",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "At one instant a point on a wheel at radius r = 0.5 m has angular speed ω = 6 rad/s and angular acceleration α = 24 rad/s². What is the magnitude of the point's total acceleration?",
    "ar": "في لحظة معينة لنقطة على عجلة على بعد r = 0.5 m من المركز سرعة زاوية ω = 6 rad/s وتسارع زاوي α = 24 rad/s². ما مقدار التسارع الكلي للنقطة؟"
   },
   "opts": [
    {
     "en": "12 m/s²",
     "ar": "12 m/s²",
     "why": {
      "en": "Only the tangential component r α was taken; the centripetal component r ω² is also present.",
      "ar": "أُخذت المركّبة المماسية r α فقط؛ والمركّبة الجاذبة r ω² موجودة أيضاً."
     }
    },
    {
     "en": "30 m/s²",
     "ar": "30 m/s²",
     "why": {
      "en": "The tangential (r α) and normal (r ω²) components are perpendicular; they add as vectors, √(a_t² + a_n²), not arithmetically.",
      "ar": "المركّبتان المماسية (r α) والعمودية (r ω²) متعامدتان؛ تُجمعان اتجاهياً √(a_t² + a_n²) لا حسابياً."
     }
    },
    {
     "en": "18 m/s²",
     "ar": "18 m/s²",
     "why": {
      "en": "Only the centripetal component r ω² was taken; the tangential component r α also exists when α ≠ 0.",
      "ar": "أُخذت المركّبة الجاذبة r ω² فقط؛ والمماسية r α موجودة أيضاً عندما α ≠ 0."
     }
    },
    {
     "en": "21.63 m/s²",
     "ar": "21.63 m/s²",
     "why": {
      "en": "",
      "ar": ""
     }
    }
   ],
   "ans": 3,
   "exp": {
    "en": "a_t = r α = 0.5 × 24 = 12 m/s²;  a_n = r ω² = 0.5 × 6² = 18 m/s²;  a = √(a_t² + a_n²) = 21.63 m/s².",
    "ar": "a_t = r α = 0.5 × 24 = 12 m/s²؛ a_n = r ω² = 0.5 × 6² = 18 m/s²؛ a = √(a_t² + a_n²) = 21.63 m/s²."
   }
  },
  {
   "id": "sd-29",
   "subject": "sd",
   "topic": "momentum",
   "level": 3,
   "type": "applied",
   "q": {
    "en": "A 0.15 kg ball arrives at 30 m/s and leaves the bat in the opposite direction at 40 m/s. The contact lasts 5 ms. What is the average force of the bat on the ball?",
    "ar": "كرة كتلتها 0.15 kg تصل بسرعة 30 m/s وتغادر المضرب في الاتجاه المعاكس بسرعة 40 m/s. يدوم التلامس 5 ms. ما متوسط قوة المضرب في الكرة؟"
   },
   "opts": [
    {
     "en": "2100 N",
     "ar": "2100 N",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "2.1 N",
     "ar": "2.1 N",
     "why": {
      "en": "The time in ms was used as if it were seconds: 5 ms = 0.005 s.",
      "ar": "استُعمل الزمن بـms كأنه ثوانٍ: 5 ms = 0.005 s."
     }
    },
    {
     "en": "10.5 N",
     "ar": "10.5 N",
     "why": {
      "en": "This is the impulse (N·s), not the force; the impulse must be divided by the contact time.",
      "ar": "هذا هو الدفع (N·s) وليس القوة؛ يجب قسمة الدفع على زمن التلامس."
     }
    },
    {
     "en": "300 N",
     "ar": "300 N",
     "why": {
      "en": "The speeds were subtracted; because the direction reverses, the change in velocity is vo + vi (taking the sign of the direction).",
      "ar": "طُرحت السرعتان؛ ولأن الاتجاه ينعكس يكون تغير السرعة vo + vi (مع مراعاة إشارة الاتجاه)."
     }
    }
   ],
   "ans": 0,
   "exp": {
    "en": "Impulse–momentum: F_avg Δt = m Δv = 0.15 × (30 + 40) = 10.5 N·s; F_avg = 10.5 / 0.005 = 2100 N.",
    "ar": "نظرية الدفع–كمية الحركة: F_avg Δt = m Δv = 0.15 × (30 + 40) = 10.5 N·s؛ F_avg = 10.5 / 0.005 = 2100 N."
   }
  },
  {
   "id": "sd-30",
   "subject": "sd",
   "topic": "truss",
   "level": 3,
   "type": "calc",
   "q": {
    "en": "A plane truss has j = 7 joints and is supported by one pin and one roller (r = 3 reaction components). Using the condition m + r = 2j for a statically determinate truss, how many members m does it need?",
    "ar": "جمالون مستوٍ فيه j = 7 عقد ومسنود بمسند مفصلي ومسند دحرجة (r = 3 مركّبات ردود أفعال). باستعمال شرط الجمالون المحدد استاتيكياً m + r = 2j، كم عنصراً m يلزمه؟"
   },
   "opts": [
    {
     "en": "12",
     "ar": "12",
     "why": {
      "en": "The pin was counted as 1 reaction and the roller as 1 (r = 2); a pin gives 2 components, so r = 3.",
      "ar": "عُدّ المسند المفصلي رد فعل واحداً والدحرجة واحداً (r = 2)؛ المفصلي يعطي مركّبتين فتكون r = 3."
     }
    },
    {
     "en": "11",
     "ar": "11",
     "why": {
      "en": "",
      "ar": ""
     }
    },
    {
     "en": "14",
     "ar": "14",
     "why": {
      "en": "The reaction components were forgotten: m + r = 2j means m = 2j − r.",
      "ar": "نُسيت مركّبات ردود الأفعال: m + r = 2j تعني m = 2j − r."
     }
    },
    {
     "en": "13",
     "ar": "13",
     "why": {
      "en": "Only one reaction component was subtracted; a pin gives 2 and a roller 1, so r = 3.",
      "ar": "طُرحت مركّبة رد فعل واحدة فقط؛ المسند المفصلي يعطي 2 والدحرجة 1 فتكون r = 3."
     }
    }
   ],
   "ans": 1,
   "exp": {
    "en": "Unknowns: m member forces + r = 3 reactions; equations: 2 per joint = 2j = 14. Determinate when m + 3 = 14, so m = 11.",
    "ar": "المجاهيل: m قوة عناصر + r = 3 ردود أفعال؛ المعادلات: 2 لكل عقدة = 2j = 14. يكون محدداً عندما m + 3 = 14 أي m = 11."
   }
  }
 ]
};
})();
