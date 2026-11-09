        // Data & Variables
        let currentLang = 'en';
        let currentTheme = 'light';
        let currentProcessId = null;
        let currentQuizIndex = 0;
        let quizScore = 0;
        
        window.getLang = () => currentLang;

        let quizData = []; // Built (and shuffled) in initQuiz()

        document.addEventListener('DOMContentLoaded', () => {
            initTheme();
            const savedLang = safeStorage('get', 'lang');
            applyLanguage(savedLang === 'ar' || savedLang === 'en' ? savedLang : ((navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en'));
            navigate('home');
            filterDictionary();
            renderProcesses();
            renderCalculators();
            initQuiz();
        });

        
function navigate(pageId) {
            document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
            document.getElementById('page-' + pageId).classList.add('active');
            document.getElementById('mobile-menu').classList.add('hidden');
            document.querySelectorAll('.nav-btn').forEach(btn => {
                const on = (btn.getAttribute('onclick') || '').includes(`navigate('${pageId}')`);
                NAV_ACTIVE.forEach(c => btn.classList.toggle(c, on));
                if (on) btn.setAttribute('aria-current', 'page'); else btn.removeAttribute('aria-current');
            });
            window.scrollTo({ top: 0 });
            if (pageId === '3d-lab' && window.Labs) Labs.engine.start();
            if (pageId === 'cnc-secrets') renderCncSeries();
            if (pageId === 'beam' && window.BeamDesigner) BeamDesigner.render();
        }
        const NAV_ACTIVE = ['bg-primary-50', 'text-primary-700', 'dark:bg-gray-800', 'dark:text-primary-400'];

        function safeStorage(op, key, value) {
            try { return op === 'get' ? localStorage.getItem(key) : localStorage.setItem(key, value); } catch (e) { return null; }
        }

        function applyLanguage(lang) {
            currentLang = lang;
            document.documentElement.lang = lang;
            document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
            document.getElementById('lang-text').innerText = lang === 'en' ? 'عربي' : 'English';
            safeStorage('set', 'lang', lang);
            updateUI();
        }

        function toggleLanguage() {
            applyLanguage(currentLang === 'en' ? 'ar' : 'en');
            if (window.Labs) Labs.engine.refreshLanguage();
            filterDictionary();
            renderProcesses();
            if (currentProcessId) selectProcess(currentProcessId);
            if (document.getElementById('page-cnc-secrets').classList.contains('active')) renderCncSeries();
            if (document.getElementById('page-beam').classList.contains('active') && window.BeamDesigner) BeamDesigner.render();
            renderCalculators();
            renderQuizQuestion();
            updateScoreLabel();
        }

        function updateUI() {
            const t = translations[currentLang];
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (t[key] !== undefined) el.innerText = t[key];
            });
            document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t[el.getAttribute('data-i18n-ph')] || el.placeholder; });
            document.querySelectorAll('[data-i18n-aria]').forEach(el => {
                const label = t[el.getAttribute('data-i18n-aria')];
                if (label) { el.setAttribute('aria-label', label); el.title = label; }
            });
        }

        function applyTheme(theme) {
            currentTheme = theme;
            document.documentElement.classList.toggle('dark', theme === 'dark');
            const icon = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            document.getElementById('theme-icon').className = icon;
            document.getElementById('theme-icon-mobile').className = icon;
            const meta = document.querySelector('meta[name="theme-color"]');
            if (meta) meta.setAttribute('content', theme === 'dark' ? '#111827' : '#0ea5e9');
            if (window.Labs) Labs.engine.setTheme(theme);
        }

        function initTheme() {
            const saved = safeStorage('get', 'theme');
            applyTheme(saved === 'dark' || saved === 'light' ? saved : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
        }

        function toggleTheme() {
            const next = currentTheme === 'light' ? 'dark' : 'light';
            safeStorage('set', 'theme', next);
            applyTheme(next);
        }

        
        let dictShown = 40, dictKey = '';
        function setDictCategory(c) { document.getElementById('category-filter').value = c; filterDictionary(); }
        function dictMore() { dictShown += 60; filterDictionary(true); }
        function renderCatChips(sel) {
            const el = document.getElementById('cat-chips'); if (!el || !window.DICT_CATS) return;
            const t = translations[currentLang], cnt = {};
            dictData.forEach(i => { cnt[i.category] = (cnt[i.category] || 0) + 1; });
            const chip = (id, icon, label, n) => `<button type="button" class="lab-chip whitespace-nowrap${sel === id ? ' active' : ''}" onclick="setDictCategory('${id}')"><i class="fa-solid ${icon} mx-1"></i>${label} <span class="opacity-60">(${n})</span></button>`;
            el.innerHTML = chip('all', 'fa-layer-group', t.cat_all, dictData.length) + DICT_CATS.map(c => chip(c.id, c.icon, t['cat_' + c.id], cnt[c.id] || 0)).join('');
        }
        function filterDictionary(more) {
            const term = document.getElementById('search-input').value.trim().toLowerCase();
            const category = document.getElementById('category-filter').value;
            const en = currentLang === 'en';
            const t = translations[currentLang];
            const key = term + '|' + category; if (!more && key !== dictKey) { dictShown = 40; dictKey = key; }
            renderCatChips(category);

            const items = dictData.filter(item => {
                const haystack = (item.termEn + ' ' + item.termAr + ' ' + (term.length > 2 ? item.descEn + ' ' + item.descAr : '')).toLowerCase();
                return haystack.includes(term) && (category === 'all' || item.category === category);
            });
            const cnt = document.getElementById('dict-count'); if (cnt) cnt.textContent = items.length + (en ? ' terms' : ' مصطلح');
            const shown = items.slice(0, dictShown);

            document.getElementById('dictionary-list').innerHTML = shown.map(item => {
                if (item.light) return `
                    <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h4 class="font-bold text-lg text-primary-600 dark:text-primary-400 mb-1">
                            ${en ? item.termEn : item.termAr} <span class="text-sm font-normal text-gray-500 mx-2">(${en ? item.termAr : item.termEn})</span>
                        </h4>
                        <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">${en ? item.descEn : item.descAr}</p>
                        ${item.eq ? `<div class="mt-2 bg-blue-50 dark:bg-gray-700 p-2 rounded font-mono text-sm text-blue-800 dark:text-blue-300" dir="ltr">${item.eq}</div>` : ''}
                        ${labLinkButton(item.id)}
                    </div>`;
                const d = en ? item.detEn : item.detAr;
                const q = item.quiz;
                return `
                    <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h4 class="font-bold text-lg text-primary-600 dark:text-primary-400 mb-1">
                            ${en ? item.termEn : item.termAr} <span class="text-sm font-normal text-gray-500 mx-2">(${en ? item.termAr : item.termEn})</span>
                        </h4>
                        <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">${en ? item.descEn : item.descAr}</p>

                        <button id="dict-btn-${item.id}" onclick="toggleDictDetail('${item.id}')" aria-expanded="false" class="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline flex items-center">
                            ${t.btn_read_details} <i class="fa-solid fa-chevron-down ml-1 rtl:mr-1 rtl:ml-0"></i>
                        </button>
                        ${labLinkButton(item.id)}

                        <div id="dict-detail-${item.id}" class="detail-panel border-gray-200 dark:border-gray-700">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                                <div><strong>${en ? 'Definition:' : 'التعريف:'}</strong> ${d.def}</div>
                                <div><strong>${en ? 'Principle:' : 'مبدأ العمل:'}</strong> ${d.prin}</div>
                                <div><strong>${en ? 'Types:' : 'الأنواع:'}</strong> ${d.types}</div>
                                <div><strong>${en ? 'Materials:' : 'المواد:'}</strong> ${d.mat}</div>
                                <div><strong>${en ? 'Applications:' : 'التطبيقات:'}</strong> ${d.app}</div>
                                <div><strong>${en ? 'Pros & Cons:' : 'المزايا والعيوب:'}</strong> ${d.pros}</div>
                                <div class="md:col-span-2 bg-blue-50 dark:bg-gray-700 p-3 rounded font-mono text-blue-800 dark:text-blue-300">
                                    <strong>${en ? 'Equation:' : 'المعادلة:'}</strong><br>${d.eq}
                                </div>
                                <div class="md:col-span-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                                    <strong><i class="fa-solid fa-clipboard-question text-orange-500 mr-1 rtl:ml-1 rtl:mr-0"></i> ${t.mini_check}</strong> ${en ? q.qE : q.qA}
                                    <div class="text-green-600 dark:text-green-400 mt-1">✓ ${en ? q.optsE[q.ans] : q.optsA[q.ans]}</div>
                                </div>
                            </div>
                        </div>
                    </div>`;
            }).join('');

            const mb = document.getElementById('dict-more');
            if (mb) mb.innerHTML = items.length > shown.length ? `<button type="button" onclick="dictMore()" class="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700">${en ? 'Show more' : 'عرض المزيد'} (${items.length - shown.length})</button>` : '';
            document.getElementById('no-results').classList.toggle('hidden', items.length > 0);
        }

        
        // Encyclopedia / process entries that have a matching 3D lab model get a "Try it in the lab" button.
        const LAB_LINKS = {
            gear: ['gears', 'spur'], spur_gear: ['gears', 'spur'], helical_gear: ['gears', 'helical'],
            bevel_gear: ['gears', 'bevel'], worm_gear: ['gears', 'worm'],
            bearing: ['disasm', 'bearing'], ball_bearing: ['disasm', 'bearing'], roller_bearing: ['disasm', 'bearing'],
            coupling: ['disasm', 'coupling'], key_keyway: ['disasm', 'coupling'], shaft: ['disasm', 'gearbox'],
            centrifugal_pump: ['disasm', 'pump'], mech_seal: ['disasm', 'pump'], ic_engine: ['disasm', 'engine'], spring: ['disasm', 'engine'],
            stress: ['strength', 'beam'], strain: ['strength', 'tensile'], torque: ['strength', 'torsion'], fos: ['strength', 'beam'],
            beam_bending: ['strength', 'beam'], buckling: ['strength', 'column'], pressure_vessel: ['strength', 'vessel'], mohr_circle: ['strength', 'mohr'],
            bernoulli: ['fluids', 'venturi'], reynolds_number: ['fluids', 'pipe'], pump_curve: ['fluids', 'pumpsys'], hydrostatic_pressure: ['fluids', 'hydro'],
            buoyancy: ['fluids', 'buoy'], drag_force: ['fluids', 'drag'],
            pascal_principle: ['hydraulics', 'jack'], hydraulic_cylinder: ['hydraulics', 'hcyl'], pneumatics: ['hydraulics', 'pneu'],
            accumulator: ['hydraulics', 'accum'], hydraulic_motor: ['hydraulics', 'hmotor'],
            turning: ['mfg', 'turn'], milling: ['mfg', 'mill'], sheet_metal: ['mfg', 'press'], grinding: ['mfg', 'grind'], tensile_test: ['strength', 'tensile'], yield_strength: ['strength', 'tensile'], ultimate_tensile_strength: ['strength', 'tensile'], elongation: ['strength', 'tensile'], ductility: ['strength', 'tensile'], modulus_of_elasticity: ['strength', 'tensile'], shear_stress: ['strength', 'beam'], structural_analysis: ['strength', 'beam'],
            spark_plug: ['disasm', 'engine'], piston: ['disasm', 'engine'], crankshaft: ['disasm', 'engine'], camshaft: ['disasm', 'engine'], cylinder: ['disasm', 'engine'], engine_valve: ['disasm', 'engine'], gearbox: ['disasm', 'gearbox'], transmission: ['disasm', 'gearbox'],
            machining: ['mfg', 'turn'], cutting_speed: ['mfg', 'turn'], feed_rate: ['mfg', 'mill'], cutting_tools: ['mfg', 'turn'], surface_finish: ['mfg', 'grind'], stamping: ['mfg', 'press'],
            viscosity: ['fluids', 'pipe'], laminar_flow: ['fluids', 'pipe'], turbulent_flow: ['fluids', 'pipe'], flow_rate: ['fluids', 'pipe'], pressure_drop: ['fluids', 'pipe'], pump: ['fluids', 'pumpsys'], cavitation: ['fluids', 'pumpsys'], pressure: ['fluids', 'hydro'], density: ['fluids', 'buoy'], lift_force: ['fluids', 'drag'],
            hydraulics: ['hydraulics', 'jack'], valve: ['hydraulics', 'hcyl'], reservoir: ['hydraulics', 'hcyl'], hydraulic_fluid: ['hydraulics', 'hcyl'], shearing: ['mfg', 'shear'], sheet_bending: ['mfg', 'bend'], deep_drawing: ['mfg', 'deepdraw'], wire_drawing: ['mfg', 'wiredraw'], casting: ['mfg', 'cast'], cnc_machining: ['mfg', 'cnc'], roughness: ['mfg', 'turn'],
            planetary_gear: ['gears', 'planetary'],
            rack_and_pinion: ['gears', 'rack'],
            gear_ratio: ['gears', 'train'],
            backlash: ['gears', 'spur'],
            pinion: ['gears', 'spur'],
            speed_reducer: ['gears', 'train'],
            tensile_stress: ['strength', 'tensile'],
            compressive_stress: ['strength', 'column'],
            torsional_stress: ['strength', 'torsion'],
            bending_stress: ['strength', 'beam'],
            normal_stress: ['strength', 'mohr'],
            stress_concentration: ['strength', 'tensile'],
            von_mises_stress: ['strength', 'mohr'],
            hooke_s_law: ['strength', 'tensile'],
            poisson_s_ratio: ['strength', 'tensile'],
            shear_modulus: ['strength', 'torsion'],
            stress_strain_curve: ['strength', 'tensile'],
            allowable_stress: ['strength', 'beam'],
            elastic_deformation: ['strength', 'tensile'],
            plastic_deformation: ['strength', 'tensile'],
            hydraulic_system: ['hydraulics', 'jack'],
            pneumatic_system: ['hydraulics', 'pneu'],
            hydraulic_pump: ['hydraulics', 'jack'],
            pneumatic_cylinder: ['hydraulics', 'pneu'],
            single_acting_cylinder: ['hydraulics', 'hcyl'],
            double_acting_cylinder: ['hydraulics', 'hcyl'],
            hydraulic_press: ['hydraulics', 'jack'],
            intensifier: ['hydraulics', 'jack'],
            hydraulic_power: ['hydraulics', 'hcyl'],
            pressure_relief_valve: ['hydraulics', 'hcyl'],
            directional_control_valve: ['hydraulics', 'hcyl'],
            flow_control_valve: ['hydraulics', 'hcyl'],
            drilling: ['mfg', 'mill'],
            threading: ['mfg', 'turn'],
            rolling: ['mfg', 'press']
        };
        function labLinkButton(id) {
            const l = LAB_LINKS[id];
            if (!l) return '';
            return `<button onclick="openLab('${l[0]}','${l[1]}')" class="mt-3 px-3 py-1.5 text-sm rounded-md bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-2"><i class="fa-solid fa-cube"></i>${translations[currentLang].btn_try_lab}</button>`;
        }
        function openLab(labId, modelId) {
            navigate('3d-lab');
            if (window.Labs) Labs.engine.openLab(labId, modelId);
        }

        function toggleDictDetail(id) {
            const el = document.getElementById(`dict-detail-${id}`);
            const btn = document.getElementById(`dict-btn-${id}`);
            const isHidden = el.style.maxHeight === '0px' || !el.style.maxHeight;
            
            if(isHidden) {
                el.classList.add('expanded');
                el.style.maxHeight = el.scrollHeight + 100 + "px"; // 100px padding buffer
                btn.innerHTML = `${translations[currentLang].btn_hide_details} <i class="fa-solid fa-chevron-up ml-1 rtl:mr-1 rtl:ml-0"></i>`;
            } else {
                el.classList.remove('expanded');
                el.style.maxHeight = null;
                btn.innerHTML = `${translations[currentLang].btn_read_details} <i class="fa-solid fa-chevron-down ml-1 rtl:mr-1 rtl:ml-0"></i>`;
            }
        }

        function renderProcesses() {
            document.getElementById('process-menu').innerHTML = processesData.map(proc => {
                const isActive = currentProcessId === proc.id;
                const activeClasses = isActive ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 rtl:border-l-0 rtl:border-r-4 border-primary-500' : 'hover:bg-gray-50 dark:hover:bg-gray-700';
                return `
                    <li>
                        <button onclick="selectProcess('${proc.id}')" ${isActive ? 'aria-current="true"' : ''} class="w-full text-left rtl:text-right px-4 py-3 flex items-center transition-colors ${activeClasses}">
                            <i class="fa-solid ${proc.icon} w-6 text-gray-400 ${isActive ? 'text-primary-500' : ''}"></i>
                            <span class="font-medium ml-3 rtl:mr-3 rtl:ml-0 ${isActive ? 'text-primary-700 dark:text-primary-400' : ''}">${currentLang === 'en' ? proc.titleEn : proc.titleAr}</span>
                        </button>
                    </li>`;
            }).join('');
        }

        
        function selectProcess(id) {
            currentProcessId = id;
            renderProcesses(); // update menu active state

            const proc = processesData.find(p => p.id === id);
            if(!proc) return;
            
            const title = currentLang === 'en' ? proc.titleEn : proc.titleAr;
            const desc = currentLang === 'en' ? proc.descEn : proc.descAr;
            const details = currentLang === 'en' ? proc.detailsEn : proc.detailsAr;
            const btnText = translations[currentLang].btn_read_details;

            document.getElementById('process-content').innerHTML = `
                <div class="flex items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="w-14 h-14 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center text-2xl mr-4 rtl:ml-4 rtl:mr-0 shadow-sm">
                        <i class="fa-solid ${proc.icon}"></i>
                    </div>
                    <h3 class="text-2xl font-bold">${title}</h3>
                </div>
                <p class="text-gray-700 dark:text-gray-300 text-lg mb-4">${desc}</p>
                
                <button id="proc-btn-${proc.id}" onclick="toggleProcDetail('${proc.id}')" class="mb-2 px-4 py-2 bg-primary-100 text-primary-700 dark:bg-gray-700 dark:text-primary-400 rounded-md font-medium hover:bg-primary-200 transition">
                    ${btnText} <i class="fa-solid fa-chevron-down ml-1 rtl:mr-1 rtl:ml-0"></i>
                </button>
                
                <div id="proc-detail-${proc.id}" class="detail-panel border-t border-gray-200 dark:border-gray-700">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700 dark:text-gray-300 mt-4">
                        <div><h5 class="font-bold text-gray-900 dark:text-white mb-1"><i class="fa-solid fa-microchip text-gray-400 mr-2"></i>${currentLang==='en'?'Principle:':'مبدأ العمل:'}</h5><p>${details.prin}</p></div>
                        <div><h5 class="font-bold text-gray-900 dark:text-white mb-1"><i class="fa-solid fa-wrench text-gray-400 mr-2"></i>${currentLang==='en'?'Machines & Tools:':'الآلات والأدوات:'}</h5><p>${details.mach}</p></div>
                        <div><h5 class="font-bold text-gray-900 dark:text-white mb-1"><i class="fa-solid fa-sliders text-gray-400 mr-2"></i>${currentLang==='en'?'Key Parameters:':'المعلمات الأساسية:'}</h5><p>${details.params}</p></div>
                        <div><h5 class="font-bold text-gray-900 dark:text-white mb-1"><i class="fa-solid fa-car text-gray-400 mr-2"></i>${currentLang==='en'?'Applications:':'التطبيقات:'}</h5><p>${details.apps}</p></div>
                        <div><h5 class="font-bold text-gray-900 dark:text-white mb-1"><i class="fa-solid fa-balance-scale text-gray-400 mr-2"></i>${currentLang==='en'?'Pros & Cons:':'المزايا والعيوب:'}</h5><p>${details.pros}</p></div>
                        <div><h5 class="font-bold text-gray-900 dark:text-white mb-1"><i class="fa-solid fa-triangle-exclamation text-yellow-500 mr-2"></i>${currentLang==='en'?'Common Defects:':'العيوب الشائعة:'}</h5><p>${details.defects}</p></div>
                        <div class="md:col-span-2 bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-100 dark:border-red-800">
                            <h5 class="font-bold text-red-700 dark:text-red-400 mb-1"><i class="fa-solid fa-hard-hat mr-2"></i>${currentLang==='en'?'Safety:':'السلامة:'}</h5><p>${details.safety}</p>
                        </div>
                    </div>
                </div>
            `;
        }
        
        function toggleProcDetail(id) {
            const el = document.getElementById(`proc-detail-${id}`);
            const btn = document.getElementById(`proc-btn-${id}`);
            const isHidden = el.style.maxHeight === '0px' || !el.style.maxHeight;
            
            if(isHidden) {
                el.classList.add('expanded');
                el.style.maxHeight = el.scrollHeight + 200 + "px";
                btn.innerHTML = `${translations[currentLang].btn_hide_details} <i class="fa-solid fa-chevron-up ml-1 rtl:mr-1 rtl:ml-0"></i>`;
            } else {
                el.classList.remove('expanded');
                el.style.maxHeight = null;
                btn.innerHTML = `${translations[currentLang].btn_read_details} <i class="fa-solid fa-chevron-down ml-1 rtl:mr-1 rtl:ml-0"></i>`;
            }
        }

        // ---------- Calculators ----------
        const L = (en, ar) => ({ en, ar });
        const fmt = (x, digits = 4) => {
            if (!Number.isFinite(x)) return '—';
            if (x !== 0 && (Math.abs(x) < 1e-3 || Math.abs(x) >= 1e9)) return x.toExponential(3);
            return Number(x.toPrecision(digits)).toLocaleString('en-US', { maximumFractionDigits: 8 });
        };
        const calcDefs = [
            {
                id: 'stress', icon: 'fa-weight-hanging', title: L('Normal Stress (σ)', 'الإجهاد العمودي (σ)'), formula: 'σ = F / A',
                inputs: [
                    { id: 'f', label: L('Force (F)', 'القوة (F)'), ph: '1000', units: [['N', 1], ['kN', 1e3], ['MN', 1e6]] },
                    { id: 'a', label: L('Cross-section area (A)', 'مساحة المقطع (A)'), ph: '50', units: [['mm²', 1e-6], ['cm²', 1e-4], ['m²', 1]], positive: true }
                ],
                compute: v => { const s = v.f / v.a; return [[L('Stress', 'الإجهاد'), `${fmt(s / 1e6)} MPa  (${fmt(s)} Pa)`]]; }
            },
            {
                id: 'strain', icon: 'fa-arrows-left-right', title: L('Engineering Strain (ε)', 'الانفعال الهندسي (ε)'), formula: 'ε = ΔL / L₀',
                inputs: [
                    { id: 'dl', label: L('Change in length (ΔL)', 'التغير في الطول (ΔL)'), ph: '0.2', units: [['mm', 1e-3], ['cm', 1e-2], ['m', 1]] },
                    { id: 'l0', label: L('Original length (L₀)', 'الطول الأصلي (L₀)'), ph: '100', units: [['mm', 1e-3], ['cm', 1e-2], ['m', 1]], positive: true }
                ],
                compute: v => { const e = v.dl / v.l0; return [[L('Strain (ε)', 'الانفعال (ε)'), fmt(e, 6)], [L('Percent', 'نسبة مئوية'), `${fmt(e * 100)} %`]]; }
            },
            {
                id: 'torque', icon: 'fa-wrench', title: L('Torque (T)', 'عزم الدوران (T)'), formula: 'T = F × r',
                inputs: [
                    { id: 'f', label: L('Force (F)', 'القوة (F)'), ph: '200', units: [['N', 1], ['kN', 1e3]] },
                    { id: 'r', label: L('Lever arm / radius (r)', 'ذراع القوة / نصف القطر (r)'), ph: '0.3', units: [['m', 1], ['cm', 1e-2], ['mm', 1e-3]] }
                ],
                compute: v => { const T = v.f * v.r; return [[L('Torque', 'العزم'), `${fmt(T)} N·m`], [L('Torque', 'العزم'), `${fmt(T * 1000)} N·mm`]]; }
            },
            {
                id: 'power', icon: 'fa-bolt', title: L('Rotational Power (P)', 'القدرة الدورانية (P)'), formula: 'P = T × ω ,  ω = 2πn / 60',
                inputs: [
                    { id: 't', label: L('Torque (T)', 'العزم (T)'), ph: '50', units: [['N·m', 1], ['N·mm', 1e-3]] },
                    { id: 'n', label: L('Speed (n)', 'السرعة (n)'), ph: '1500', units: [['rpm', 1]] }
                ],
                compute: v => {
                    const w = 2 * Math.PI * v.n / 60, P = v.t * w;
                    return [[L('Angular velocity', 'السرعة الزاوية'), `${fmt(w)} rad/s`], [L('Power', 'القدرة'), `${fmt(P)} W  (${fmt(P / 1000)} kW)`], [L('Horsepower', 'حصان ميكانيكي'), `${fmt(P / 745.7)} hp`]];
                }
            },
            {
                id: 'gear', icon: 'fa-gear', title: L('Gear Ratio', 'نسبة التروس'), formula: 'i = T₂ / T₁ ,  n₂ = n₁ / i',
                inputs: [
                    { id: 't1', label: L('Driving gear teeth (T₁)', 'أسنان الترس القائد (T₁)'), ph: '12', positive: true, integer: true },
                    { id: 't2', label: L('Driven gear teeth (T₂)', 'أسنان الترس المنقاد (T₂)'), ph: '36', positive: true, integer: true },
                    { id: 'n1', label: L('Input speed (n₁) [rpm]', 'سرعة الدخل (n₁) [rpm]'), ph: '1500' }
                ],
                compute: v => {
                    const i = v.t2 / v.t1;
                    return [[L('Gear ratio (i)', 'نسبة التروس (i)'), `${fmt(i)} : 1`], [L('Output speed (n₂)', 'سرعة الخرج (n₂)'), `${fmt(v.n1 / i)} rpm`], [L('Ideal torque multiplier', 'مضاعف العزم (مثالي)'), `× ${fmt(i)}`]];
                }
            },
            {
                id: 'fos', icon: 'fa-shield-halved', title: L('Factor of Safety', 'معامل الأمان'), formula: 'FoS = σ_yield / σ_working',
                inputs: [
                    { id: 'sy', label: L('Yield strength (σ_y)', 'إجهاد الخضوع (σ_y)'), ph: '250', units: [['MPa', 1], ['GPa', 1e3], ['Pa', 1e-6]], positive: true },
                    { id: 'sw', label: L('Working stress (σ)', 'الإجهاد الفعلي (σ)'), ph: '100', units: [['MPa', 1], ['GPa', 1e3], ['Pa', 1e-6]], positive: true }
                ],
                compute: v => {
                    const n = v.sy / v.sw;
                    const status = n < 1 ? L('Unsafe — yielding expected', 'غير آمن — يُتوقع الخضوع')
                        : n < 1.5 ? L('Marginal — little reserve', 'هامشي — احتياطي قليل')
                        : n < 3 ? L('Typical for well-known loads and materials', 'نموذجي للأحمال والمواد المعروفة')
                        : L('Conservative — check weight and cost', 'متحفظ — راجع الوزن والتكلفة');
                    return [[L('Factor of safety', 'معامل الأمان'), fmt(n)], [L('Assessment', 'التقييم'), status]];
                }
            }
        ];

        const calcShown = new Set();

        function renderCalculators() {
            const grid = document.getElementById('calc-grid');
            const saved = {};
            grid.querySelectorAll('input,select').forEach(el => { saved[el.id] = el.value; });
            const en = currentLang === 'en';
            const pick = o => o[currentLang];

            grid.innerHTML = calcDefs.map(c => `
                <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                    <h3 class="text-xl font-bold mb-2 border-b pb-2 dark:border-gray-700 flex items-center gap-2"><i class="fa-solid ${c.icon} text-primary-500"></i>${pick(c.title)}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 font-mono" dir="ltr">${c.formula}</p>
                    <div class="space-y-4">
                        ${c.inputs.map(i => {
                            const fid = `calc-${c.id}-${i.id}`;
                            return `<div>
                                <label for="${fid}" class="block text-sm font-medium">${pick(i.label)}</label>
                                <div class="flex gap-2">
                                    <input type="number" step="any" inputmode="decimal" id="${fid}" class="calc-input" placeholder="${i.ph || ''}" onkeydown="if(event.key==='Enter')runCalc('${c.id}')">
                                    ${i.units ? `<select id="${fid}-u" class="calc-input w-24" aria-label="unit">${i.units.map(u => `<option value="${u[1]}">${u[0]}</option>`).join('')}</select>` : ''}
                                </div>
                            </div>`;
                        }).join('')}
                        <button onclick="runCalc('${c.id}')" class="w-full py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">${translations[currentLang].btn_calc}</button>
                        <div id="calc-${c.id}-out" class="hidden p-3 rounded-md border" aria-live="polite"></div>
                    </div>
                </div>`).join('');

            Object.entries(saved).forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.value = val; });
            calcShown.forEach(id => runCalc(id));
        }

        function runCalc(id) {
            const c = calcDefs.find(x => x.id === id);
            const out = document.getElementById(`calc-${id}-out`);
            const en = currentLang === 'en';
            const v = {}, problems = [];

            c.inputs.forEach(i => {
                const el = document.getElementById(`calc-${id}-${i.id}`);
                const raw = el.value.trim();
                const x = raw === '' ? NaN : Number(raw);
                let reason = null;
                if (!Number.isFinite(x)) reason = en ? 'enter a number' : 'أدخل رقماً';
                else if (i.positive && x <= 0) reason = en ? 'must be greater than zero' : 'يجب أن تكون أكبر من الصفر';
                else if (i.integer && !Number.isInteger(x)) reason = en ? 'must be a whole number' : 'يجب أن تكون عدداً صحيحاً';
                el.classList.toggle('border-red-500', !!reason);
                if (reason) problems.push(`${i.label[currentLang]}: ${reason}`);
                const u = document.getElementById(`calc-${id}-${i.id}-u`);
                v[i.id] = x * (u ? Number(u.value) : 1);
            });

            out.classList.remove('hidden');
            if (problems.length) {
                calcShown.delete(id);
                out.className = 'p-3 rounded-md border border-red-200 bg-red-50 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300 text-sm';
                out.innerHTML = problems.map(p => `<div><i class="fa-solid fa-circle-exclamation mr-1 rtl:ml-1 rtl:mr-0"></i>${p}</div>`).join('');
                return;
            }
            const rows = c.compute(v);
            calcShown.add(id);
            out.className = 'p-3 rounded-md border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
            out.innerHTML = rows.map(r => `<div class="text-sm text-gray-500 dark:text-gray-400">${r[0][currentLang]}</div><div class="text-lg font-bold text-primary-600 dark:text-primary-400 mb-1" dir="ltr">${typeof r[1] === 'string' ? r[1] : r[1][currentLang]}</div>`).join('');
        }

        // ---------- Quiz ----------
        let quizAnswered = false, quizAnswerIdx = null;

        function shuffle(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }

        function buildQuizData() {
            const qs = [...dictData, ...processesData].filter(it => it.quiz).map(it => it.quiz);
            return shuffle(qs.map(q => {
                const order = shuffle(q.optsE.map((_, i) => i));   // shuffle answer order too
                return {
                    qE: q.qE, qA: q.qA, expE: q.expE, expA: q.expA,
                    optsE: order.map(i => q.optsE[i]), optsA: order.map(i => q.optsA[i]),
                    ans: order.indexOf(q.ans)
                };
            }));
        }

        function updateScoreLabel() {
            document.getElementById('quiz-score').innerText = translations[currentLang].score.replace('{s}', quizScore);
        }

        function initQuiz() {
            quizData = buildQuizData();
            currentQuizIndex = 0; quizScore = 0; quizAnswered = false; quizAnswerIdx = null;
            updateScoreLabel();
            renderQuizQuestion();
        }

        function renderQuizQuestion() {
            const t = translations[currentLang];
            const container = document.getElementById('quiz-container');
            const nBtn = document.getElementById('next-btn'), rBtn = document.getElementById('restart-btn');
            document.getElementById('quiz-feedback').classList.add('hidden');

            if (currentQuizIndex >= quizData.length) {
                container.innerHTML = `<div class="text-center py-8"><i class="fa-solid fa-trophy text-6xl text-yellow-400 mb-4"></i><h3 class="text-2xl font-bold">${t.quiz_done}</h3><p class="text-lg">${t.quiz_final.replace('{s}', quizScore).replace('{t}', quizData.length)}</p></div>`;
                nBtn.classList.add('hidden'); rBtn.classList.remove('hidden');
                document.getElementById('quiz-progress').innerText = '';
                return;
            }
            nBtn.classList.remove('hidden'); rBtn.classList.add('hidden');
            nBtn.disabled = true; nBtn.classList.add('opacity-50', 'cursor-not-allowed');

            document.getElementById('quiz-progress').innerText = t.quiz_progress.replace('{n}', currentQuizIndex + 1).replace('{t}', quizData.length);
            const q = quizData[currentQuizIndex], en = currentLang === 'en';
            container.innerHTML = `<h3 class="text-xl font-bold mb-6">${en ? q.qE : q.qA}</h3><div class="space-y-3">` +
                (en ? q.optsE : q.optsA).map((opt, i) =>
                    `<button id="quiz-opt-${i}" onclick="answerQuiz(${i})" class="w-full text-left rtl:text-right p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 transition">${opt}</button>`).join('') + `</div>`;
            if (quizAnswered) applyAnswerState();
        }

        function applyAnswerState() {
            const q = quizData[currentQuizIndex], en = currentLang === 'en', fb = document.getElementById('quiz-feedback');
            const right = quizAnswerIdx === q.ans;
            document.querySelectorAll('#quiz-container button').forEach(b => {
                b.disabled = true;
                b.classList.remove('hover:bg-gray-50', 'dark:hover:bg-gray-700');
            });
            const mark = (idx, good) => document.getElementById(`quiz-opt-${idx}`).classList.add(...(good
                ? ['bg-green-100', 'border-green-500', 'dark:bg-green-900/40'] : ['bg-red-100', 'border-red-500', 'dark:bg-red-900/40']));
            mark(q.ans, true);
            if (!right) mark(quizAnswerIdx, false);
            fb.innerHTML = `<i class="fa-solid ${right ? 'fa-check-circle' : 'fa-times-circle'} mr-2 rtl:ml-2 rtl:mr-0"></i> ${right ? translations[currentLang].correct : translations[currentLang].incorrect} ${en ? q.expE : q.expA}`;
            fb.className = `mt-6 p-4 rounded-md block ${right ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`;
            const nBtn = document.getElementById('next-btn');
            nBtn.disabled = false; nBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }

        function answerQuiz(idx) {
            if (quizAnswered) return;
            quizAnswered = true; quizAnswerIdx = idx;
            if (idx === quizData[currentQuizIndex].ans) quizScore++;
            updateScoreLabel();
            applyAnswerState();
        }

        function nextQuestion() { currentQuizIndex++; quizAnswered = false; quizAnswerIdx = null; renderQuizQuestion(); }


/* ---------- CNC Secrets series: lessons (text + images + video) stored inside the app ---------- */
function renderCncSeries() {
    const box = document.getElementById('cnc-list'); if (!box) return;
    const ar = getLang() === 'ar', list = window.CNC_SERIES || [], esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    document.getElementById('cnc-sub').textContent = ar ? 'سلسلة دروس مبسّطة عن ماكينات الـ CNC: نص وصور، ورابط الفيديو على تيليغرام لكل درس.' : 'A simple lesson series about CNC machines: text, pictures and a Telegram link to the video of each lesson.';
    renderCncOffline();
    if (!list.length) { box.innerHTML = `<p class="text-center text-gray-500 py-10">${ar ? 'الدروس قيد الإضافة، ترقّبوها قريباً.' : 'Lessons are being added — coming soon.'}</p>`; return; }
    box.innerHTML = list.map((it, i) => {
        const d = (ar ? it.ar : it.en) || it.ar || it.en, body = (d.body || []).map((t) => `<p class="text-sm leading-relaxed mb-2 whitespace-pre-line">${esc(t)}</p>`).join('');
        const imgs = (it.img || []).map((s) => `<img src="${s}" alt="" loading="lazy" class="w-full rounded-lg mb-3">`).join('');
        const vid = it.link ? `<a href="${it.link}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 mt-2 mb-1 px-3 py-2 rounded-md text-sm font-medium bg-sky-100 text-sky-700 dark:bg-gray-700 dark:text-sky-300"><i class="fa-brands fa-telegram"></i> ${ar ? 'شاهد فيديو هذا الدرس على تيليغرام (اختياري)' : 'Watch this lesson\'s video on Telegram (optional)'}</a>` : '';
        const labBtn = it.lab ? `<button type="button" class="mt-1 px-3 py-2 rounded-md text-sm font-medium bg-primary-100 text-primary-700 dark:bg-gray-700 dark:text-primary-400" onclick="openLabFromSeries('${it.lab[0]}','${it.lab[1]}')"><i class="fa-solid fa-cube"></i> ${ar ? 'جرّبه في المخبر ثلاثي الأبعاد' : 'Try it in the 3D lab'}</button>` : '';
        return `<details class="cnc-lesson bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700" ontoggle="if(!this.open)this.querySelectorAll('video').forEach(v=>v.pause())">
            <summary class="flex items-center gap-3 p-4 cursor-pointer select-none"><span class="w-9 h-9 shrink-0 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">${i + 1}</span><span class="flex-1 min-w-0"><span class="block font-bold text-base leading-snug">${esc(d.title)}</span><span class="cnc-more block text-xs text-primary-600 dark:text-primary-400 mt-1">${ar ? 'انقر للمزيد' : 'Tap to read more'}</span></span><i class="fa-solid fa-chevron-down cnc-chev text-gray-400"></i></summary>
            <div class="px-4 pb-4">${imgs}${body}${vid}${labBtn}</div></details>`;
    }).join('');
}
function openLabFromSeries(lab, model) { navigate('3d-lab'); if (window.Labs) { Labs.engine.start(); Labs.engine.openLab(lab, model); } }


/* ---------- Offline download of the series media (Cache API; served by the service worker) ---------- */
const CNC_MEDIA_CACHE = 'mechatlas-media';
function cncMediaUrls() {
    const out = [];
    if (!(window.CNC_SERIES || []).some((it) => it.video)) return out;   // no videos inside the app: nothing to download
    (window.CNC_SERIES || []).forEach((it) => { (it.img || []).forEach((u) => out.push(u)); if (it.poster) out.push(it.poster); if (it.video) out.push(it.video); });
    return out.filter((u) => u && u.indexOf('data:') !== 0);
}
async function cncOfflineStatus() {
    const urls = cncMediaUrls(); let have = 0;
    try { const c = await caches.open(CNC_MEDIA_CACHE); for (const u of urls) { if (await c.match(new URL(u, location.href).href)) have++; } } catch (e) {}
    return { have, total: urls.length };
}
async function renderCncOffline(msg) {
    const el = document.getElementById('cnc-offline'); if (!el) return;
    const ar = getLang() === 'ar';
    if (!('caches' in window) || !/^https?:$/.test(location.protocol) || !cncMediaUrls().length) { el.innerHTML = ''; return; }
    const st = await cncOfflineStatus(), done = st.have === st.total;
    const btn = 'px-3 py-2 rounded-md text-sm font-medium ';
    el.innerHTML = `<div class="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-4 flex flex-wrap items-center gap-3">
        <i class="fa-solid ${done ? 'fa-circle-check text-green-600' : 'fa-cloud-arrow-down text-primary-600'} text-xl"></i>
        <div class="flex-1 min-w-[10rem] text-sm">${msg || (done ? (ar ? 'الدروس محمّلة وتشتغل بدون إنترنت ✓' : 'Lessons are downloaded and work offline ✓') : (ar ? 'حمّل الدروس والفيديوهات لتشتغل بدون إنترنت (حوالي 28 ميغابايت).' : 'Download the lessons and videos to use them offline (about 28 MB).'))}<div id="cnc-dl-bar" class="hidden h-2 mt-2 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden"><div class="h-2 bg-primary-600" style="width:0%"></div></div></div>
        ${done ? `<button type="button" class="${btn} bg-red-100 text-red-700" onclick="cncOfflineRemove()">${ar ? 'حذف التحميل' : 'Remove'}</button>`
               : `<button id="cnc-dl-btn" type="button" class="${btn} bg-primary-600 text-white" onclick="cncOfflineDownload()"><i class="fa-solid fa-download"></i> ${ar ? 'تحميل للاستخدام بدون إنترنت' : 'Download for offline'}</button>`}
    </div>`;
}
async function cncOfflineDownload() {
    const ar = getLang() === 'ar', urls = cncMediaUrls(), btn = document.getElementById('cnc-dl-btn'), bar = document.getElementById('cnc-dl-bar');
    if (btn) { btn.disabled = true; btn.classList.add('opacity-50'); }
    if (bar) bar.classList.remove('hidden');
    let failed = 0;
    try {
        const c = await caches.open(CNC_MEDIA_CACHE);
        for (let i = 0; i < urls.length; i++) {
            const abs = new URL(urls[i], location.href).href;
            if (!(await c.match(abs))) {
                try { const r = await fetch(abs, { cache: 'no-store' }); if (r.ok && r.status === 200) await c.put(abs, r); else failed++; } catch (e) { failed++; }
            }
            if (bar) bar.firstElementChild.style.width = Math.round(((i + 1) / urls.length) * 100) + '%';
        }
    } catch (e) { failed = urls.length; }
    renderCncOffline(failed ? (ar ? 'تعذّر تحميل بعض الملفات، تأكد من الإنترنت وجرّب مرة ثانية.' : 'Some files failed — check your connection and try again.') : '');
}
async function cncOfflineRemove() {
    /* delete only the lesson files: the same cache also holds the Materials Testing videos, which must stay */
    try { const c = await caches.open(CNC_MEDIA_CACHE); for (const r of await c.keys()) { if (new URL(r.url).pathname.indexOf('/media/material-tests/') === -1) await c.delete(r); } } catch (e) {}
    renderCncOffline();
}
