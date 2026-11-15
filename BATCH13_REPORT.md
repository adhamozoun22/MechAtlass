# MechAtlas — الدفعة 13: Production Ready Push — Service Worker v45

نقطة البداية: S12 (`MechAtlas_Batch12_Capacitor.zip`). لم يُلمس الأصل ولا النسخة المنشورة، ولا نشر على Netlify. قراراتك مُطبَّقة: الحزمة `com.mechatlas.app`، خط Noto Sans Arabic نهائي، الإضافة `@capacitor-firebase/messaging` حصراً.

## 1) ما نُفِّذ
### أ) `js/push.js` — الإضافة المجتمعية فقط
- يعتمد حصراً على `FirebaseMessaging`: **`requestPermissions`** و**`getToken`** و**`subscribeToTopic({topic:'academy_updates'})`**، إضافةً إلى **`checkPermissions`** (فحص قراءة فقط، من نفس الإضافة، ضروري كي لا تظهر نافذة الإذن ثانيةً بعد رفض الطالب أو منحه) والمستمعين `tokenReceived` و`notificationActionPerformed`.
- حُذف كل ما يخص `@capacitor/push-notifications` (مسار الـ fallback والاختبارات المرتبطة به). إن وُجدت الإضافة الرسمية وحدها يتجاهلها الكود تماماً.
- السلوك (كما في S12): أول تشغيل ⇒ نافذة إذن مرة واحدة ⇒ عند السماح: `getToken` ثم الاشتراك بـ `academy_updates` من الجهاز مباشرة؛ التشغيلات التالية تجدّد الاشتراك بصمت؛ الرفض لا يُعاد السؤال بعده؛ لا زر؛ في المتصفح لا يفعل شيئاً؛ الضغط على إشعار فيه `data.route` يفتح مقالة الأكاديمية (مسارات الأكاديمية فقط).
- أبقيت احتياطاً واحداً عاماً (لا علاقة له بالإضافة الرسمية): إن لم تُدرج الجسر الإضافة في `Capacitor.Plugins` يطلبها عبر `Capacitor.registerPlugin('FirebaseMessaging')`.

### ب) الأكاديمية: المعادلات والصور (اتصال متوفر / مقطوع)
الملفات المعدّلة: `academy/api.js` و`academy/render.js` و`academy/academy.css` (`academy/core.js` لم يحتج تعديلاً؛ المعادلات والصور تُعالَج في `render.js` عند عرض أي مقال، سواء جاء من الشبكة أو من الكاش).
- **KaTeX:** لا تُحمَّل المعادلة إلا إذا توفّر **ملفا** `katex.min.js` **و** `katex.min.css` معاً. وجدتُ أن غياب الـ CSS وحده كان سيجعل كل معادلة تظهر مرتين (طبقة MathML + HTML)؛ الآن في هذه الحالة (أو غياب الـ JS) تبقى المعادلات نصاً مقروءاً (TeX) بلا أخطاء. المعادلات تعمل دون اتصال لأن المكتبة محلية.
- **الصور:** عند رؤية صورة بالاتصال، تُنزَّل **مرة واحدة**، وتُحفظ على الجهاز (Cache Storage، اسم `mechatlas-academy-img-v1`، حد 60 صورة وكل صورة حتى 4 MB، والأقدم يُحذف) وتُعرض من النسخة المحلية. دون اتصال: الصورة التي سبق رؤيتها **تظهر من الجهاز**؛ التي لم تُحمَّل من قبل تعرض ملاحظة رمادية «الصورة غير متاحة دون اتصال بالإنترنت» بدل رسالة الخطأ الحمراء.
- **فيديو يوتيوب المضمَّن وملفات PDF:** دون اتصال يُستبدل المشغّل بملاحظة «الفيديو يحتاج اتصالاً بالإنترنت»، وملف PDF بملاحظة مماثلة (لا يُحفظان).
- كل الملاحظات بالعربية والإنجليزية حسب لغة التطبيق، وتدعم الوضع الداكن.
- الكاش يعمل داخل التطبيق (`https://localhost`) وفي المتصفح؛ في نمط `file://` الصرف لا يوجد Cache API فتظهر ملاحظة «غير متاحة دون اتصال» للصور.
- `service-worker.js` → **v45**.

## 2) الاختبارات
| الاختبار | النتيجة |
|---|---|
| `b13_academy` — مقال به معادلات وصور، مع **KaTeX الحقيقي 0.16.22** (نُزّل من GitHub Releases لهذا الاختبار) | **17/17** |
| — اتصال متوفر: 5 معادلات (سطرية وفي قائمة وبارزة) تُرسم، لا نص خام، طبقة MathML مخفية (بلا تكرار)، الصورة تُعرض وتُحفظ، الصورة المفقودة برسالة الخطأ العادية | PASS |
| — الاتصال مقطوع (الأكاديمية من الكاش بعد إعادة تحميل الصفحة): شريط عدم الاتصال، المعادلات ما زالت مرسومة، الصورة السابقة من الجهاز **بلا أي طلب شبكة**، ملاحظة الصورة غير المحمّلة، استبدال مشغّل يوتيوب، والترجمة للإنجليزية | PASS |
| — غياب `katex.min.js` أو `katex.min.css`: المقال مقروء والمعادلات نص TeX، بلا أخطاء | PASS |
| `b13_push` — منطق الإشعارات مع **محاكاة** لجسر Capacitor | **15/15** (كُرّر 3 مرات) |
| جولة الواجهة الكاملة بلا شبكة (EN/AR/داكن، 9 صفحات، مختبر 3D، اختبار، حاسبات، بحث 518 مصطلح، الأكاديمية بالكاش) بنمط Capacitor (`http://localhost`) | **57/57**، صفر طلبات خارجية |
| نفس الجولة بنمط `file://` | **57/57** |
| `s11_tests` | 50/50 (v45) |
| `final_audit` | 11/11 |
| `webgl_stress` | 41 نموذجاً، بلا أخطاء صفحة |
| نسخة الهاتف (HTML واحد) | 48/50 (الفشلان بحكم التصميم: لا SW، والصور مضمّنة) |
اللقطات `academy_katex_online.png` و`academy_katex_offline.png` ضمن أرشيف التقارير.

## 3) الدليل النهائي لبناء الـ APK (VS Code)
**المتطلبات:** Node.js LTS، وAndroid Studio (يوفّر Android SDK وJDK؛ يُستخدم كأداة بناء فقط).

**0) قبل أي شيء — ملفات `www/js/vendor/`:** (راجع `www/js/vendor/README_VENDOR.md`)
- `supabase.min.js` ← افتح https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.110.9 واحفظ الصفحة باسم `supabase.min.js` (يجب أن تعرّف `window.supabase`).
- `katex.min.js` و`katex.min.css` من https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/ ، ومجلد `fonts` من `katex.zip` (https://github.com/KaTeX/KaTeX/releases/download/v0.16.22/katex.zip، المجلد `katex/fonts`) إلى `www/js/vendor/fonts/`. **الثلاثة (js وcss وfonts) مطلوبة معاً.**

**1)** فك الضغط، ثم في VS Code: File ▸ Open Folder ▸ `MechAtlas_Capacitor`، وافتح Terminal (Ctrl+`).

**2) تثبيت المكتبات** (`package.json` موجود؛ لو أردته من الصفر: `npm init -y` أولاً):
```
npm install @capacitor/core @capacitor/cli @capacitor/android
npm install @capacitor-firebase/messaging firebase
```
**الإضافة المجتمعية فقط — لا تثبّت `@capacitor/push-notifications`.** يجب أن يتطابق الرقم الرئيسي لإصدار الإضافة مع `@capacitor/core` (تحقق: `npm ls @capacitor/core @capacitor-firebase/messaging`). إن اشتكى npm من تعارض ثبّت المطابق: `npm install @capacitor-firebase/messaging@<الرقم الرئيسي>`. اقرأ في README الإضافة قسم Android (إن طلبت خطوات إضافية في إصدارك فهي لها الأولوية على هذا الدليل).

**3) `capacitor.config.json`** جاهز:
```json
{ "appId": "com.mechatlas.app", "appName": "MechAtlas", "webDir": "www",
  "server": { "androidScheme": "https" }, "android": { "allowMixedContent": false } }
```
**4) مشروع أندرويد:** `npx cap add android` (ينشئ `android/`).

**5) Firebase:** console.firebase.google.com ▸ مشروع ▸ Add app ▸ Android ▸ Package name = `com.mechatlas.app` ▸ نزّل `google-services.json` وضعه هنا:
```
MechAtlas_Capacitor/android/app/google-services.json
```
**6) أيقونة الإشعار والصلاحية:** انسخ `android-extras/ic_stat_mechatlas.xml` إلى `android/app/src/main/res/drawable/`، وأضف الأسطر الواردة في `android-extras/AndroidManifest_additions.txt` إلى `android/app/src/main/AndroidManifest.xml` (صلاحية `POST_NOTIFICATIONS` لأندرويد 13+ ووسما meta-data).

**7) المزامنة** (بعد أي تعديل في `www/` أو تثبيت إضافة): `npx cap sync android`

**8) تجربة على جوال:** فعّل USB debugging ثم `npx cap run android`.

**9) تصدير APK:** `npx cap open android` ▸ انتظر Gradle Sync ▸ **Build ▸ Build Bundle(s)/APK(s) ▸ Build APK(s)**. الملف: `android/app/build/outputs/apk/debug/app-debug.apk`. للنسخة النهائية: **Build ▸ Generate Signed Bundle / APK ▸ APK** وأنشئ keystore **واحتفظ به ولا تفقده** (بدونه لا يمكن تحديث التطبيق). بالطرفية: `cd android` ثم `gradlew assembleDebug` (ويندوز: `.\gradlew assembleDebug`). أيقونة التطبيق: Android Studio ▸ كليك يمين على `res` ▸ New ▸ Image Asset ▸ `resources/icon-512.png`.

**10) اختبار الإشعارات:** أول تشغيل ⇒ نافذة الإذن ⇒ سمح. Firebase Console ▸ Messaging ▸ New campaign ▸ Notification ▸ الاستهداف **Topic = `academy_updates`** (قد يتأخر ظهور الموضوع في القائمة حتى يشترك أول جهاز؛ اكتبه يدوياً). لفتح مقال بالضغط: أضف بياناً مخصصاً `route` = `#/academy/item/<slug>`. للتشخيص: `chrome://inspect` ثم `MechAtlasPush.state()` يعرض (plugin, permission, token, topic).

## 4) لم يُختبر / قيود صريحة
- **لم أبنِ APK ولم أشغّل Capacitor ولا Gradle ولا أندرويد** (npm محجوب عندي). أوامر القسم 3 مكتوبة من معرفتي بـ Capacitor ومن مصادر عامة، غير مجرَّبة هنا؛ إن ظهر خطأ أرسله لي.
- منطق الإشعارات اختُبر على **محاكاة** للجسر؛ أسماء الدوال والمستمعات مأخوذة من توثيق الإضافة (صفحة npm ودليل Capawesome) ولم أتحقق منها على الإضافة الحقيقية. لم يُرسَل إشعار فعلي ولم يُختبر الاشتراك الحقيقي بالموضوع.
- لا أعرف إن كانت الإضافة تضيف `POST_NOTIFICATIONS` تلقائياً؛ أضفها يدوياً (الخطوة 6).
- الإشعارات التي تصل **والتطبيق مفتوح** في المقدمة لا يعرضها النظام تلقائياً على أندرويد (سلوك FCM)؛ لا يوجد عرض داخل التطبيق لها حالياً. تصل كإشعار عادي عندما يكون التطبيق في الخلفية أو مغلقاً.
- الاختبارات استخدمت KaTeX **الحقيقي**، لكن supabase-js **الحقيقي** لم يُختبر (استُخدمت نسخة تجريبية)؛ ولم يُختبر Supabase الحقيقي ولا سياسات RLS. الصور الموقّعة الحقيقية: تحميلها بـ `fetch` يحتاج CORS من التخزين (متوقع أنه مفتوح)، وإن فشل يُعرض الرابط مباشرة دون حفظ محلي.
- كاش الصور لم يُختبر عند امتلاء التخزين أو عند بلوغ حد 60 صورة (منطق الحذف مكتوب لكن غير مُختبَر).
- الفيديوهات والروابط تحتاج إنترنت (قرارك). فيديو يوتيوب المضمَّن داخل التطبيق لم يُجرَّب على WebView حقيقي.
- اختبارات `s5_tests` والكويز الارتدادي و`ui_extra` و`baseline` لم تُعَد (سكربتاتها ضاعت)؛ هذه الدفعة لم تلمس الكويز ولا البحث ولا المحتوى.
- فحص الواجهة بصرياً على جهازك يبقى لك.

## 5) الملفات
معدّلة (6): `academy/api.js`، `academy/render.js`، `academy/academy.css`، `js/push.js`، `service-worker.js` (v45)، `README.txt`. لا ملفات جديدة ولا محذوفة. القائمة والهاشات قبل/بعد: `changed_files.txt`، `batch13_sha256_start_S12.txt`، `batch13_sha256_after.txt`، `capacitor_project_sha256.txt` (في `MechAtlas_Batch13_reports.zip`).

**المصادر:** [@capacitor-firebase/messaging على npm](https://www.npmjs.com/package/@capacitor-firebase/messaging) — [دليل Capawesome (مكان google-services.json في `android/app/`)](https://capawesome.io/blog/capacitor-push-notifications-guide/)
