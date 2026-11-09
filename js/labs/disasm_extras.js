/* Disassembly lab — "typical failure & fix" notes for the parts of the older models (bearing, coupling, gearbox). */
(function () {
    'use strict';
    const DIS = window.DIS;
    if (!DIS) return;
    const L2 = DIS.L2, parts = DIS.lab.parts;
    const F = {
        brg_outer: L2('Spalling on the raceway → noise and vibration; usually from misalignment or contamination. Replace the whole bearing.', 'تقشّر المسار ← ضجيج واهتزاز؛ غالباً من عدم التحاذي أو التلوّث. بدّل المحمل كاملاً.'),
        brg_inner: L2('Creep (ring turning on the shaft) → polished, hot seat; use a tighter fit (k5/m5) and replace the shaft if worn.', 'زحف (دوران الحلقة على العمود) ← مقعد لامع وساخن؛ استعمل توافقاً أضيق (k5/m5) وبدّل العمود إن تآكل.'),
        brg_balls: L2('Flaking or brinelling from shock loads or static overload; check the load rating C and avoid hammering during assembly.', 'تقشّر أو انطباع من الصدمات أو الحمل الساكن الزائد؛ افحص سعة التحميل C وتجنّب الطرق عند التركيب.'),
        brg_cageB: L2('Cage fracture from over-speed or a missing lubricant; replace the bearing.', 'كسر القفص من سرعة زائدة أو نقص التزييت؛ بدّل المحمل.'),
        brg_cageA: L2('Cage wear from poor lubrication; grease should fill 30–50 % of the free space.', 'تآكل القفص من سوء التزييت؛ يجب أن يملأ الشحم 30–50% من الفراغ.'),
        brg_sealA: L2('Hardened or torn lip lets dirt in: replace the seal and re-grease.', 'شفة متصلبة أو ممزقة تُدخل الأوساخ: بدّل المانع وأعد الشحم.'),
        brg_sealB: L2('Hardened or torn lip lets dirt in: replace the seal and re-grease.', 'شفة متصلبة أو ممزقة تُدخل الأوساخ: بدّل المانع وأعد الشحم.'),
        cp_shaftA: L2('Fretting or a worn keyway → slack hub; re-cut a wider keyway or fit a new shaft.', 'احتكاك سطحي أو مجرى متآكل ← محور مرتخٍ؛ افرز مجرى أوسع أو ركّب عموداً جديداً.'),
        cp_shaftB: L2('Fretting or a worn keyway → slack hub; check coaxiality with a dial gauge.', 'احتكاك سطحي أو مجرى متآكل ← محور مرتخٍ؛ افحص التحاذي بمؤشر ساعة.'),
        cp_hubA: L2('Cracked flange at a bolt hole from overload or misalignment; replace the hub.', 'تشقق الفلنجة عند فتحة البرغي من حمل زائد أو عدم تحاذي؛ بدّل المحور.'),
        cp_hubB: L2('Fretted spigot recess → loss of centring; machine it or replace the hub.', 'تجويف تمركز متآكل ← فقد التمركز؛ شغّله أو بدّل المحور.'),
        cp_keyA: L2('A sheared or rolled key means the torque was too high; never replace with a softer key.', 'خابور مقصوص أو مدحرج يعني عزماً زائداً؛ لا تضع خابوراً أنعم.'),
        cp_keyB: L2('A sheared or rolled key means the torque was too high; check the shaft keyway too.', 'خابور مقصوص يعني عزماً زائداً؛ افحص مجرى العمود أيضاً.'),
        cp_bolt: L2('Bolt shear or loosening from vibration; use the right class, a new set, and thread-locker.', 'قص البرغي أو ارتخاؤه من الاهتزاز؛ استعمل الفئة الصحيحة ومجموعة جديدة ومثبّت أسنان.'),
        cp_nut: L2('Self-loosening under vibration; add a lock washer or a nylon-insert nut.', 'ارتخاء ذاتي مع الاهتزاز؛ أضف حلقة قفل أو صامولة نايلون.'),
        gb_base: L2('Oil leaks at the joint → flatten the face and renew the sealant; cracks at the bearing bosses mean misuse.', 'تسرب الزيت عند الوصلة ← سوِّ الوجه وجدّد المعجون؛ تشقق عند أذرع المحامل يعني سوء استعمال.'),
        gb_cover: L2('Warped cover or damaged breather → pressure builds and pushes oil out of the seals.', 'غطاء معوج أو فتحة تنفس تالفة ← يتراكم الضغط ويدفع الزيت من المانعات.'),
        gb_bolt: L2('Stretched or corroded bolts lose clamp load; replace in sets and tighten crosswise.', 'براغي مستطيلة أو صدئة تفقد قوة الشد؛ بدّلها كمجموعة وشدّها متقاطعاً.'),
        gb_in: L2('Pinion tooth wear or pitting from poor oil or overload; check the contact pattern with marking blue.', 'تآكل أسنان البنيون أو تنقرها من زيت رديء أو حمل زائد؛ افحص أثر التلامس بالأزرق.'),
        gb_out: L2('Bent output shaft from overhung load; measure the runout and replace if above 0.05 mm.', 'عمود خرج منحنٍ من حمل معلّق؛ قِس الاهتزاز وبدّله إن زاد عن 0.05 mm.'),
        gb_gear: L2('Pitting at the pitch line = surface fatigue; lower the load, raise the hardness, or improve the lubricant.', 'تنقّر عند خط الخطوة = إجهاد سطحي؛ قلّل الحمل أو ارفع الصلادة أو حسّن الزيت.'),
        gb_key: L2('Key crushing/rounding means the hub is loose; fit a longer key or an interference fit.', 'سحق الخابور أو تدويره يعني محوراً مرتخياً؛ ركّب خابوراً أطول أو توافق تداخل.'),
        gb_brgIn: L2('Noise or heat after a few thousand hours: check preload, oil level and gear thrust.', 'ضجيج أو حرارة بعد آلاف الساعات: افحص الشد المسبق ومستوى الزيت ودفع التروس.'),
        gb_brgOut: L2('Early failure usually from misalignment of the two housing bores; re-bore in one setup.', 'عطب مبكر غالباً من عدم تحاذي ثقبي الهيكل؛ أعد التخريط بتثبيتة واحدة.'),
        gb_capC: L2('Leak at the cap face; replace the gasket and check the bearing seat.', 'تسرب عند وجه الغطاء؛ بدّل الجوان وافحص مقعد المحمل.'),
        gb_capO: L2('Leak at the cap face; replace the gasket and check the bearing seat.', 'تسرب عند وجه الغطاء؛ بدّل الجوان وافحص مقعد المحمل.'),
        gb_seal: L2('Hard lip or a scored shaft sleeve = leak. Replace the seal and polish or sleeve the shaft.', 'شفة متصلبة أو كمّ عمود مخدوش = تسرب. بدّل المانع واصقل العمود أو ركّب كُمّاً.'),
        gb_capbolt: L2('Loose cap bolts let the bearing outer ring spin; re-torque with thread-locker.', 'ارتخاء براغي الغطاء يجعل الحلقة الخارجية تدور؛ أعد الشد مع مثبّت أسنان.'),
        gb_plug: L2('Leaking drain plug: renew the copper washer each time; check the thread.', 'سدادة تصريف تسرّب: بدّل الحلقة النحاسية في كل مرة وافحص السن.'),
        gb_breather: L2('A blocked breather pushes oil out of the lip seals — clean or replace it.', 'فتحة تنفس مسدودة تدفع الزيت من مانعات الشفة — نظّفها أو بدّلها.')
    };

    /* what each model simplifies (shown as the last readout row of every model) */
    const SC = {
        bearing: L2('Schematic parts diagram. A real deep-groove bearing is NON-separable (the balls are trapped by both rings), so this exploded view is not a real dismantling procedure. Seal grooves and ring chamfer details are not modelled.', 'مخطط تعليمي للأجزاء. المحمل العميق المجرى في الواقع غير قابل للفك (الكريات محتجزة بين الحلقتين)، لذا هذا التفكيك ليس إجراء حقيقياً. أخاديد المانعات وشطفات الحلقات غير مرسومة.'),
        coupling: L2('Simplified flange coupling: threads, chamfers and the fit tolerances of the key are not drawn; bolts sit in plain holes.', 'وصلة فلنجية مبسّطة: لا تُرسم الأسنان ولا الشطفات ولا سماحات الخابور؛ البراغي في ثقوب ملساء.'),
        gearbox: L2('Simplified single-stage spur gearbox: threads, gaskets, oil galleries and shim packs are not drawn; cap screws sit in plain holes; the gear is shown on a keyed shaft without circlips.', 'علبة تروس أسطوانية مبسّطة بمرحلة واحدة: لا تُرسم الأسنان الملولبة ولا الجوانات ولا قنوات الزيت ولا شرائح الضبط؛ براغي الأغطية في ثقوب ملساء؛ الترس على عمود بخابور بلا حلقات تثبيت.'),
        pump: L2('Simplified single-stage volute pump: the casing/gasket/stud region around the nozzles overlaps slightly in the drawing, and circlips, shaft sleeve and bearing lock nuts are not drawn.', 'مضخة حلزونية مبسّطة بمرحلة واحدة: منطقة المبيت والجوان والأعمدة المسننة قرب الفوهتين تتداخل قليلاً في الرسم، ولا تُرسم حلقات التثبيت وكم العمود وصواميل قفل المحامل.'),
        engine: L2('Simplified single-cylinder engine: ports, oil galleries, valve cotters, circlips and ring gaps are not drawn. When you explode the model the crank turns back to the TDC pose so the parts can leave along clear paths.', 'محرك أسطوانة واحدة مبسّط: لا تُرسم المنافذ ولا قنوات الزيت ولا مفاتيح الصمامات ولا حلقات التثبيت ولا فتحات الشنابر. عند تفكيك النموذج يعود المرفق إلى وضع PMS لتخرج الأجزاء عبر مسارات حرة.')
    };
    Object.keys(SC).forEach((k) => { if (DIS.models[k]) DIS.models[k].scope = SC[k]; });
    Object.keys(F).forEach((k) => { if (parts[k] && !parts[k].fail) parts[k].fail = F[k]; });
})();
