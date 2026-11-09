/* MechAtlas — shared 3D lab engine.
 *
 * ONE WebGL renderer + ONE scene serve every lab, so adding labs doesn't add GPU cost.
 * A lab is a plain object registered with Labs.register(def):
 *
 *   {
 *     id, icon, title:{en,ar}, intro:{en,ar},
 *     models: [{id, title:{en,ar}}],
 *     parts:  { partId: {name:{en,ar}, desc:{en,ar}, material:{en,ar}} },
 *     controls(modelId, params) -> [control specs]      // see renderControls()
 *     build(modelId, params, api) -> THREE.Group         // group.userData: cam, target, update(dt)
 *     apply(group, params, changedId, api)               // optional: cheap live update (no rebuild)
 *     readouts(modelId, params, api) -> [{k:{en,ar}, v:'text', state:'ok|warn|bad'}]
 *     challenges(modelId) -> [{text:{en,ar}, check(params, api) -> bool}]
 *     charts: { draw(canvas, modelId, params) }          // optional 2D charts under the stage
 *     supports: { section:true }                         // optional
 *   }
 */
(function () {
    'use strict';

    const Labs = (window.Labs = {
        list: [],
        byId: {},
        register(def) { this.list.push(def); this.byId[def.id] = def; }
    });

    const lang = () => (window.getLang ? window.getLang() : 'en');
    const tr = (o) => (o == null ? '' : typeof o === 'string' ? o : (o[lang()] || o.en || ''));
    Labs.tr = tr;

    const $ = (id) => document.getElementById(id);
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

    const UI = {
        en: { labels: 'Labels', wire: 'Wireframe', section: 'Cutaway', play: 'Play', pause: 'Pause', reset: 'Reset view', full: 'Expand', closeFull: 'Close',
              speed: 'Animation speed', moreVals: 'More values', lessVals: 'Fewer values', moreSet: 'More settings', graphs: 'Graphs', parts: 'Parts list', challenge: 'Challenges', params: 'Parameters', material: 'Material', function: 'Function', failed: '3D could not start on this device.',
              retry: 'Try again', lowq: 'Light mode', isolate: 'Isolate part', showAll: 'Show all', bom: 'Parts list (BOM)', qty: 'Qty', mass: 'Mass ≈', total: 'Total', mfg: 'Manufacturing', tol: 'Tolerance / finish', std: 'Standard', asm: 'Assembly', fail: 'Typical failure & fix', part: 'Part', hint: 'Tap a part to learn about it · drag to rotate · pinch to zoom' },
        ar: { labels: 'الأسماء', wire: 'هيكل شبكي', section: 'مقطع', play: 'تشغيل', pause: 'إيقاف', reset: 'إعادة الكاميرا', full: 'تكبير', closeFull: 'إغلاق',
              speed: 'سرعة الحركة', moreVals: 'قيم إضافية', lessVals: 'إخفاء القيم', moreSet: 'إعدادات إضافية', graphs: 'المخططات', parts: 'قائمة القطع', challenge: 'تحديات', params: 'المعطيات', material: 'المادة', function: 'الوظيفة', failed: 'تعذّر تشغيل الـ3D على هذا الجهاز.',
              retry: 'حاول مجدداً', lowq: 'وضع خفيف', isolate: 'عزل القطعة', showAll: 'إظهار الكل', bom: 'قائمة القطع (BOM)', qty: 'العدد', mass: 'الكتلة ≈', total: 'المجموع', mfg: 'التصنيع', tol: 'السماحية / السطح', std: 'المواصفة', asm: 'التركيب', fail: 'العطل الشائع وإصلاحه', part: 'القطعة', hint: 'المس قطعة لتعرف عنها · اسحب للتدوير · قرّص للتكبير' }
    };
    const ui = (k) => UI[lang()][k];

    const E = (Labs.engine = {
        inited: false,
        failed: false,
        scene: null, camera: null, renderer: null, controls: null, raycaster: null,
        group: null,
        lab: null,
        modelId: null,
        params: {},
        playing: true,
        speed: 1,
        showLabels: false,
        wire: false,
        section: false,
        lowQuality: false,
        selected: null,
        selectedEmissive: new Map(),
        clipPlane: null,
        _last: 0,
        _ema: 16,
        _slow: 0,
        _readoutT: 0,
        _rebuildTimer: null,
        _labelPool: [],
        api: null,

        /* ---------- lifecycle ---------- */
        start() {
            if (!this.inited) {
                this.buildShell();
                this.bindInfo();
                if (!this.initGL()) return;
                this.resize();   // size first, so the first camera fit uses the real aspect ratio
            }
            if (this.failed) return;
            if (!this.lab) this.openLab(Labs.list[0].id);
            this.resize();
            this.requestFrame();
        },

        initGL() {
            const host = $('canvas-container');
            try {
                if (typeof THREE === 'undefined') throw new Error('THREE missing');
                const r = (this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }));
                this.setPixelRatio();
                r.localClippingEnabled = true;
                r.domElement.setAttribute('aria-label', '3D view');
                r.domElement.style.display = 'block';
                r.domElement.style.touchAction = 'none';
                host.insertBefore(r.domElement, host.firstChild);

                this.scene = new THREE.Scene();
                this.setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
                this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 300);
                this.camera.position.set(6, 5, 9);

                this.scene.add(new THREE.HemisphereLight(0xffffff, 0x556070, 0.85));
                const key = new THREE.DirectionalLight(0xffffff, 0.95); key.position.set(6, 10, 8); this.scene.add(key);
                const fill = new THREE.DirectionalLight(0x9db8ff, 0.4); fill.position.set(-8, -2, -6); this.scene.add(fill);

                this.controls = new THREE.OrbitControls(this.camera, r.domElement);
                this.controls.enableDamping = true;
                this.controls.dampingFactor = 0.08;
                this.controls.minDistance = 1.5;
                this.controls.maxDistance = 60;

                this.raycaster = new THREE.Raycaster();
                this.clipPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);

                // tap (not drag) selects a part
                let dx = 0, dy = 0;
                r.domElement.addEventListener('pointerdown', (e) => { dx = e.clientX; dy = e.clientY; });
                r.domElement.addEventListener('pointerup', (e) => {
                    if (Math.hypot(e.clientX - dx, e.clientY - dy) > 6) return;
                    this.pick(e);
                });

                if (window.ResizeObserver) new ResizeObserver(() => this.resize()).observe(host);
                window.addEventListener('resize', () => this.resize());
                document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('lab-wrap').classList.contains('lab-expanded')) this.toggleExpand(); });

                this.api = {
                    THREE,
                    get params() { return E.params; },
                    get playing() { return E.playing; },
                    get lang() { return lang(); },
                    tr,
                    rebuild: () => this.scheduleRebuild(),
                    refresh: () => this.refreshReadouts(),
                    selectById: (id) => this.selectById(id),
                    clearSelection: () => this.clearSelection(),
                    scene: this.scene
                };
                this.inited = true;
                return true;
            } catch (err) {
                console.error(err);
                this.failed = true;
                this.showFailure(err);
                return false;
            }
        },

        showFailure() {
            const f = $('viewer-fallback');
            if (f) { f.style.display = 'flex'; f.querySelector('p').innerText = ui('failed'); }
        },

        setPixelRatio() {
            const dpr = window.devicePixelRatio || 1;
            this.renderer.setPixelRatio(this.lowQuality ? 1 : Math.min(dpr, 2));
        },

        setTheme(theme) {
            if (!this.scene) return;
            this.scene.background = new THREE.Color(theme === 'dark' ? 0x1b2433 : 0xe8edf3);
        },

        resize() {
            if (!this.renderer) return;
            const host = $('canvas-container');
            const w = host.clientWidth, h = host.clientHeight;
            if (!w || !h) return;
            this.renderer.setSize(w, h);
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
        },

        /* ---------- render loop ---------- */
        requestFrame() {
            if (this._raf) return;
            const step = (t) => {
                this._raf = requestAnimationFrame(step);
                const active = $('page-3d-lab').classList.contains('active') && !document.hidden;
                if (!active) { this._last = 0; return; }
                const dt = this._last ? Math.min(0.05, (t - this._last) / 1000) : 0.016;
                this._last = t;
                this.tick(dt, t);
            };
            this._raf = requestAnimationFrame(step);
        },

        tick(dt, t) {
            try {
                if (this.group && this.group.userData.update && this.playing) this.group.userData.update(dt * this.speed, t / 1000);
                this.controls.update();
                this.renderer.render(this.scene, this.camera);
                if (this.showLabels) this.updateLabels();
                // live readouts ~4x/s
                if (t - this._readoutT > 250) { this._readoutT = t; this.refreshReadouts(true); }
                this.adaptQuality(dt);
            } catch (err) {
                console.error(err);
                if (!this._errShown) { this._errShown = true; this.showFailure(err); }
            }
        },

        // If frames are consistently slow, drop to pixel ratio 1 (and flag light mode for labs).
        adaptQuality(dt) {
            this._ema = this._ema * 0.95 + dt * 1000 * 0.05;
            if (this._ema > 40 && !this.lowQuality) {
                this._slow++;
                if (this._slow > 90) { this.lowQuality = true; this.setPixelRatio(); this.resize(); this.syncToolbar(); }
            } else this._slow = 0;
        },

        /* ---------- lab / model loading ---------- */
        openLab(labId, modelId) {
            const lab = Labs.byId[labId];
            if (!lab) return;
            this.lab = lab;
            this.renderLabTabs();
            this.loadModel(modelId || lab.models[0].id);
        },

        loadModel(modelId) {
            this.modelId = modelId;
            this.params = {};
            this.clearSelection(true);
            const specs = this.lab.controls(modelId, {});
            specs.forEach((c) => { if (c.id && c.value !== undefined) this.params[c.id] = c.value; });
            this.renderModelTabs();
            this.rebuild(true);
            this.renderChallenges();
        },

        scheduleRebuild() {
            clearTimeout(this._rebuildTimer);
            this._rebuildTimer = setTimeout(() => this.rebuild(false), 60);
        },

        rebuild(resetCamera) {
            if (!this.lab) return;
            /* controls that only appear for some options (e.g. hollow-shaft ratio) get their default as soon as they exist */
            try { this.lab.controls(this.modelId, this.params).forEach((c) => { if (c.id && c.value !== undefined && this.params[c.id] === undefined) this.params[c.id] = c.value; }); } catch (e) { /* ignore */ }
            const old = this.group;
            if (old) { this.scene.remove(old); this.disposeGroup(old); }
            this.clearSelection(true);
            try {
                this.group = this.lab.build(this.modelId, this.params, this.api);
                this.scene.add(this.group);
                this.applyViewFlags();
                if (this.group.userData.autoSelect) this.selectById(this.group.userData.autoSelect);
                if (resetCamera || !this._camSet) { this.resetCamera(); this._camSet = true; }
                $('viewer-fallback').style.display = 'none';
            } catch (err) {
                console.error(err);
                this.group = null;
                this.showFailure(err);
            }
            this.renderControls();
            this.refreshReadouts();
            this.drawCharts();
            this.updateInfo();
        },

        disposeGroup(g) {
            g.traverse((o) => {
                if (o.geometry) o.geometry.dispose();
                if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
            });
        },

        resetCamera() {
            const ud = (this.group && this.group.userData) || {};
            const t = ud.target || [0, 0, 0];
            let c = ud.cam || [6, 5, 9];
            if (ud.fit) {
                // place the camera so a box of half-size fit.w × fit.h always fits the current aspect ratio
                const dir = new THREE.Vector3().fromArray(ud.fit.dir || [0, 0.25, 1]).normalize();
                const th = Math.tan((this.camera.fov * Math.PI) / 360);
                const d = Math.max(ud.fit.h / th, ud.fit.w / (th * this.camera.aspect)) * 1.18;
                c = [t[0] + dir.x * d, t[1] + dir.y * d, t[2] + dir.z * d];
                this.controls.maxDistance = Math.max(60, d * 1.5); this.camera.far = Math.max(300, d * 4); this.camera.updateProjectionMatrix();
            } else { this.controls.maxDistance = 60; }
            this.camera.position.set(c[0], c[1], c[2]);
            this.controls.target.set(t[0], t[1], t[2]);
            this.controls.update();
        },

        /* ---------- view flags: wireframe / cutaway ---------- */
        applyViewFlags() {
            if (!this.group) return;
            const cut = this.section && this.lab.supports && this.lab.supports.section;
            this.group.traverse((o) => {
                if (!o.material || o.userData.noView) return;
                (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
                    m.wireframe = this.wire;
                    m.clippingPlanes = cut ? [this.clipPlane] : null;
                    if (m.userData.origSide === undefined) m.userData.origSide = m.side;
                    m.side = cut ? THREE.DoubleSide : m.userData.origSide;
                    m.needsUpdate = true;
                });
            });
        },

        /* ---------- picking & info ---------- */
        pick(ev) {
            if (!this.group) return;
            const rect = this.renderer.domElement.getBoundingClientRect();
            const m = new THREE.Vector2(((ev.clientX - rect.left) / rect.width) * 2 - 1, -((ev.clientY - rect.top) / rect.height) * 2 + 1);
            this.raycaster.setFromCamera(m, this.camera);
            const hits = this.raycaster.intersectObjects(this.group.children, true);
            for (const h of hits) {
                let o = h.object;
                while (o && !(o.userData && o.userData.id)) o = o.parent;
                if (o && o.userData.id && this.lab.parts && this.lab.parts[o.userData.id]) { this.select(o); return; }
            }
            this.clearSelection();
        },

        select(obj) {
            this.clearSelection(true);
            this.selected = obj;
            obj.traverse((c) => {
                if (c.material && c.material.emissive) {
                    this.selectedEmissive.set(c, c.material.emissive.getHex());
                    c.material.emissive.setHex(0x2a4a7a);
                }
            });
            this.updateInfo();
        },

        clearSelection(silent) {
            this.selectedEmissive.forEach((hex, c) => { if (c.material && c.material.emissive) c.material.emissive.setHex(hex); });
            this.selectedEmissive.clear();
            this.selected = null;
            if (!silent) this.updateInfo();
        },

        updateInfo() {
            const box = $('lab-info');
            if (!box || !this.lab) return;
            const sel = this.selected && this.lab.parts && this.lab.parts[this.selected.userData.id];
            const row = (label, text) => (text ? `<p class="text-sm mt-2"><strong>${esc(label)}:</strong> ${esc(tr(text))}</p>` : '');
            const list = this.lab.listParts ? this.lab.listParts(this.modelId, this.params) : null;
            const fm = (kg) => (kg >= 1 ? kg.toFixed(2) + ' kg' : (kg * 1000).toFixed(kg * 1000 >= 100 ? 0 : 1) + ' g');
            let html;
            if (sel) {
                const id = this.selected.userData.id;
                html = `<h4 class="font-bold text-lg text-primary-700 dark:text-primary-400 mb-1"><i class="fa-solid fa-cube mr-1 rtl:ml-1 rtl:mr-0"></i>${esc(tr(sel.name))}</h4>
                    <p class="text-sm leading-relaxed">${esc(tr(sel.desc))}</p>${row(ui('material'), sel.material)}${row(ui('function'), sel.func)}${row(ui('mfg'), sel.mfg)}${row(ui('tol'), sel.tol)}${row(ui('std'), sel.std)}${row(ui('asm'), sel.asm)}${row(ui('fail'), sel.fail)}`;
                const r = list && list.find((x) => x.id === id);
                if (r) html += `<p class="text-sm mt-2"><strong>${esc(ui('qty'))}:</strong> ${r.qty} · <strong>${esc(ui('mass'))}</strong> ${fm(r.mass)}</p>`;
                if (this.lab.supports && this.lab.supports.isolate) html += `<div class="info-actions"><button type="button" class="lab-action" data-iso="1">${esc(ui('isolate'))}</button><button type="button" class="lab-action" data-iso="0">${esc(ui('showAll'))}</button></div>`;
            } else {
                html = `<h4 class="font-bold text-lg text-primary-700 dark:text-primary-400 mb-1"><i class="fa-solid fa-circle-info mr-1 rtl:ml-1 rtl:mr-0"></i>${esc(tr(this.lab.title))}</h4>
                    <p class="text-sm leading-relaxed">${esc(String(tr(this.lab.intro)).split(/(?<=[.؟!])\s/)[0])}</p><p class="text-xs text-gray-500 dark:text-gray-400 mt-2">${esc(ui('hint'))}</p>`;
            }
            if (list && list.length) {
                const selId = this.selected && this.selected.userData.id;
                const tot = list.reduce((a, r) => a + r.mass, 0);
                html += `<details class="lab-more mt-3" ${this._bomOpen || sel ? 'open' : ''}><summary>${esc(ui('parts'))}</summary><table class="bom"><thead><tr><th>${esc(ui('part'))}</th><th>${esc(ui('qty'))}</th><th>${esc(ui('mass'))}</th></tr></thead><tbody>` +
                    list.map((r) => `<tr data-part="${esc(r.id)}" class="${r.id === selId ? 'on' : ''}"><td>${esc(tr(r.name))}</td><td>${r.qty}</td><td dir="ltr">${fm(r.mass)}</td></tr>`).join('') +
                    `<tr class="bom-total"><td>${esc(ui('total'))}</td><td>${list.reduce((a, r) => a + r.qty, 0)}</td><td dir="ltr">${fm(tot)}</td></tr></tbody></table></details>`;
            }
            box.innerHTML = html;
            const bd = box.querySelector('details'); if (bd) bd.addEventListener('toggle', () => { this._bomOpen = bd.open; });
        },

        selectById(id) {
            let found = null;
            this.group && this.group.traverse((o) => { if (!found && o.userData && o.userData.id === id) found = o; });
            if (found) this.select(found);
        },

        isolate(on) {
            if (!this.group) return;
            const keep = on ? this.selected : null;
            this.group.traverse((o) => {
                if (!(o.userData && o.userData.id)) return;
                const hide = !!keep && o !== keep;
                o.userData.iso = hide; o.visible = !hide;
            });
            if (this.lab && this.lab.apply) this.lab.apply(this.group, this.params, '__iso', this.api);
        },

        /* ---------- labels overlay ---------- */
        updateLabels() {
            const layer = $('lab-labels');
            const items = [];
            this.group && this.group.traverse((o) => { if (o.userData && o.userData.id && o.userData.label !== false && this.lab.parts && this.lab.parts[o.userData.id]) items.push(o); });
            const host = $('canvas-container');
            const w = host.clientWidth, h = host.clientHeight;
            const v = new THREE.Vector3();
            const box = new THREE.Box3();
            while (this._labelPool.length < items.length) {
                const d = document.createElement('div'); d.className = 'lab-label'; layer.appendChild(d); this._labelPool.push(d);
            }
            this._labelPool.forEach((d, i) => {
                const o = items[i];
                if (!o) { d.style.display = 'none'; return; }
                box.setFromObject(o);
                box.getCenter(v);
                if (o.userData.labelAt) v.copy(o.localToWorld(new THREE.Vector3().fromArray(o.userData.labelAt)));
                v.project(this.camera);
                if (v.z > 1) { d.style.display = 'none'; return; }
                d.style.display = 'block';
                d.style.left = ((v.x * 0.5 + 0.5) * w) + 'px';
                d.style.top = ((-v.y * 0.5 + 0.5) * h) + 'px';
                d.textContent = tr(this.lab.parts[o.userData.id].name);
            });
        },

        /* ---------- UI: shell, tabs, toolbar ---------- */
        buildShell() {
            const bar = $('lab-toolbar');
            const btn = (id, icon, key, extra) => `<button type="button" id="${id}" class="lab-btn" data-k="${key}" aria-label="" ${extra || ''}><i class="fa-solid ${icon}"></i></button>`;
            bar.innerHTML =
                btn('lb-play', 'fa-pause', 'pause') + btn('lb-reset', 'fa-crosshairs', 'reset') +
                btn('lb-labels', 'fa-tags', 'labels') +
                btn('lb-section', 'fa-scissors', 'section') + btn('lb-full', 'fa-expand', 'full');
            $('lb-play').onclick = () => { this.playing = !this.playing; this.syncToolbar(); };
            $('lb-reset').onclick = () => this.resetCamera();
            $('lb-labels').onclick = () => { this.showLabels = !this.showLabels; if (!this.showLabels) this._labelPool.forEach((d) => (d.style.display = 'none')); this.syncToolbar(); };
            $('lb-section').onclick = () => { this.section = !this.section; this.applyViewFlags(); this.syncToolbar(); };
            $('lb-full').onclick = () => this.toggleExpand();
            $('lab-controls').addEventListener('input', (e) => this.onControl(e));
            $('lab-controls').addEventListener('change', (e) => this.onControl(e, true));
            $('lab-controls').addEventListener('click', (e) => {
                const b = e.target.closest('[data-action]');
                if (b && this.lab) { const spec = this.findSpec(b.dataset.action); if (spec && spec.run) { spec.run(this.params, this.api); this.rebuild(false); } }
            });
        },

        bindInfo() {
            const box = $('lab-info');
            if (!box || box._bound) return;
            box._bound = true;
            box.addEventListener('click', (e) => {
                const tr_ = e.target.closest('tr[data-part]');
                if (tr_) { this.selectById(tr_.dataset.part); return; }
                const b = e.target.closest('[data-iso]');
                if (b) this.isolate(b.dataset.iso === '1');
            });
        },

        syncToolbar() {
            const set = (id, on, label, icon) => {
                const b = $(id); if (!b) return;
                b.classList.toggle('on', !!on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
                b.setAttribute('aria-label', label); b.title = label;
                if (icon) b.querySelector('i').className = 'fa-solid ' + icon;
            };
            set('lb-play', !this.playing, this.playing ? ui('pause') : ui('play'), this.playing ? 'fa-pause' : 'fa-play');
            set('lb-reset', false, ui('reset'));
            set('lb-labels', this.showLabels, ui('labels'));
            const canSection = !!(this.lab && this.lab.supports && this.lab.supports.section);
            $('lb-section').style.display = canSection ? '' : 'none';
            set('lb-section', this.section, ui('section'));
            const ex = $('lab-wrap').classList.contains('lab-expanded');
            set('lb-full', ex, ex ? ui('closeFull') : ui('full'), ex ? 'fa-compress' : 'fa-expand');
        },

        toggleExpand() {
            const w = $('lab-wrap');
            const on = w.classList.toggle('lab-expanded');
            document.body.style.overflow = on ? 'hidden' : '';
            this.syncToolbar();
            setTimeout(() => this.resize(), 50);
        },

        renderLabTabs() {
            $('lab-tabs').innerHTML = Labs.list.map((l) =>
                `<button type="button" class="lab-tab ${this.lab && l.id === this.lab.id ? 'active' : ''}" data-lab="${l.id}"><i class="fa-solid ${l.icon}"></i><span>${esc(tr(l.title))}</span></button>`).join('');
            $('lab-tabs').onclick = (e) => { const b = e.target.closest('[data-lab]'); if (b) this.openLab(b.dataset.lab); };
        },

        renderModelTabs() {
            const lab = this.lab, box = $('lab-models');
            box.style.display = lab.models.length > 1 || lab.action ? '' : 'none';
            box.innerHTML = lab.models.map((m) => `<button type="button" class="lab-chip ${m.id === this.modelId ? 'active' : ''}" data-model="${m.id}">${esc(tr(m.title))}</button>`).join('')
                + (lab.action ? `<button type="button" class="lab-chip" data-action="1" style="border-style:dashed"><i class="fa-solid ${lab.action.icon || 'fa-arrow-up-right-from-square'}"></i> ${esc(tr(lab.action.label))}</button>` : '');
            box.onclick = (e) => { if (e.target.closest('[data-action]') && lab.action) { lab.action.run(); return; } const b = e.target.closest('[data-model]'); if (b && b.dataset.model !== this.modelId) this.loadModel(b.dataset.model); };
            this.syncToolbar();
        },

        /* ---------- UI: controls ---------- */
        specs() { return this.lab ? this.lab.controls(this.modelId, this.params) : []; },
        findSpec(id) { return this.specs().find((c) => c.id === id); },

        renderControls() {
            const specs = this.specs();
            const MAIN = 5; let n = 0, opened = false;
            const one = (c) => {
                if (c.type === 'title') return `<h5 class="lab-ctl-title">${esc(tr(c.label))}</h5>`;
                if (c.type === 'note') return `<p class="text-xs text-gray-500 dark:text-gray-400 mb-2">${esc(tr(c.label))}</p>`;
                const val = this.params[c.id];
                if (c.type === 'range') {
                    return `<div class="lab-ctl"><label for="c-${c.id}"><span>${esc(tr(c.label))}</span><output id="o-${c.id}" dir="ltr">${this.fmt(c, val)}</output></label>
                        <input type="range" id="c-${c.id}" data-cid="${c.id}" min="${c.min}" max="${c.max}" step="${c.step || 1}" value="${val}"></div>`;
                }
                if (c.type === 'select') {
                    return `<div class="lab-ctl"><label for="c-${c.id}"><span>${esc(tr(c.label))}</span></label>
                        <select id="c-${c.id}" data-cid="${c.id}" class="calc-input">${c.options.map((o) => `<option value="${o.v}" ${String(o.v) === String(val) ? 'selected' : ''}>${esc(tr(o.label))}</option>`).join('')}</select></div>`;
                }
                if (c.type === 'toggle') {
                    return `<div class="lab-ctl lab-ctl-row"><label for="c-${c.id}"><span>${esc(tr(c.label))}</span></label><input type="checkbox" id="c-${c.id}" data-cid="${c.id}" ${val ? 'checked' : ''}></div>`;
                }
                if (c.type === 'textarea') {
                    return `<div class="lab-ctl"><label for="c-${c.id}"><span>${esc(tr(c.label))}</span></label>
                        <textarea id="c-${c.id}" data-cid="${c.id}" class="calc-input" dir="ltr" rows="${c.rows || 10}" maxlength="${c.maxlength || 20000}" spellcheck="false" autocapitalize="off" autocomplete="off" style="width:100%;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;line-height:1.35;white-space:pre;overflow:auto;resize:vertical">${esc(String(val === undefined ? '' : val))}</textarea></div>`;
                }
                if (c.type === 'button') return `<button type="button" class="lab-action" data-action="${c.id}">${esc(tr(c.label))}</button>`;
                return '';
            };
            let html = '';
            specs.forEach((c, i) => {
                const interactive = c.type !== 'title' && c.type !== 'note';
                if (interactive) n++;
                if (!opened && interactive && n > MAIN) {
                    // pull a heading that directly precedes this control into the "more" box
                    const prev = specs[i - 1];
                    if (prev && prev.type === 'title') { const k = html.lastIndexOf('<h5'); const h = html.slice(k); html = html.slice(0, k); html += `<details class="lab-more" ${this._moreOpen ? 'open' : ''}><summary>${esc(ui('moreSet'))}</summary>` + h; }
                    else html += `<details class="lab-more" ${this._moreOpen ? 'open' : ''}><summary>${esc(ui('moreSet'))}</summary>`;
                    opened = true;
                }
                html += one(c);
            });
            const speed = `<div class="lab-ctl"><label for="c-speed"><span>${esc(ui('speed'))}</span><output id="o-speed" dir="ltr">×${this.speed.toFixed(1)}</output></label>
                <input type="range" id="c-speed" data-cid="__speed" min="0.1" max="3" step="0.1" value="${this.speed}"></div>`;
            if (!opened) html += `<details class="lab-more" ${this._moreOpen ? 'open' : ''}><summary>${esc(ui('moreSet'))}</summary>`;
            html += speed + '</details>';
            const box = $('lab-controls');
            box.innerHTML = html;
            box.querySelectorAll('details.lab-more').forEach((d) => d.addEventListener('toggle', () => { this._moreOpen = d.open; }));
        },

        fmt(c, v) {
            const n = Number(v);
            const d = c.decimals !== undefined ? c.decimals : (c.step && c.step < 1 ? (String(c.step).split('.')[1] || '').length : 0);
            return n.toFixed(d) + (c.unit ? ' ' + c.unit : '');
        },

        onControl(e, isChange) {
            const el = e.target;
            const id = el.dataset && el.dataset.cid;
            if (!id) return;
            if (id === '__speed') { this.speed = parseFloat(el.value); $('o-speed').textContent = '×' + this.speed.toFixed(1); return; }
            const spec = this.findSpec(id);
            if (!spec) return;
            let v;
            if (spec.type === 'textarea') { if (!isChange) return; v = String(el.value).slice(0, spec.maxlength || 20000); }
            else if (el.type === 'checkbox') v = el.checked;
            else if (spec.type === 'select') v = isNaN(Number(el.value)) ? el.value : Number(el.value);
            else v = parseFloat(el.value);
            if (spec.type === 'range') { if (isChange) return; $('o-' + id).textContent = this.fmt(spec, v); }
            this.params[id] = v;
            if (spec.onEdit) { try { spec.onEdit(this.params, v); } catch (err) { /* ignore */ } }
            try { this.lab.controls(this.modelId, this.params).forEach((c) => { if (c.id && c.value !== undefined && this.params[c.id] === undefined) this.params[c.id] = c.value; }); } catch (e) { /* ignore */ }
            if (spec.rebuild) {
                if (spec.panel) { this.rebuild(false); } else this.scheduleRebuild();
            } else if (this.lab.apply && this.group) {
                this.lab.apply(this.group, this.params, id, this.api);
                this.applyViewFlags();
            }
            this.refreshReadouts();
            this.drawCharts();
        },

        /* ---------- readouts, challenges, charts ---------- */
        refreshReadouts(live) {
            if (!this.lab || !this.group) return;
            const items = this.lab.readouts ? this.lab.readouts(this.modelId, this.params, this.api, this.group) : [];
            const bar = $('lab-readouts');
            const key = JSON.stringify(items.map((i) => [tr(i.k), i.v, i.state]));
            if (key === this._readKey) { if (live) this.checkChallenges(); return; }
            this._readKey = key;
            const card = (i) => `<div class="readout ${i.state || ''}"><span class="rk">${esc(tr(i.k))}</span><span class="rv" dir="ltr">${esc(i.v)}</span></div>`;
            const SHOW = 4, more = items.slice(SHOW);
            // warnings/failures are never hidden
            const vis = items.slice(0, SHOW).concat(more.filter((i) => i.state === 'bad'));
            const rest = more.filter((i) => i.state !== 'bad');
            bar.innerHTML = vis.map(card).join('') + (rest.length ? `<details class="readout-more" ${this._readOpen ? 'open' : ''}><summary>${esc(ui('moreVals'))} (${rest.length})</summary><div class="readout-bar">${rest.map(card).join('')}</div></details>` : '');
            const d = bar.querySelector('details'); if (d) d.addEventListener('toggle', () => { this._readOpen = d.open; });
            this.checkChallenges();
        },

        renderChallenges() {
            const box = $('lab-challenges');
            const list = this.lab.challenges ? this.lab.challenges(this.modelId) : [];
            this._challenges = list;
            box.style.display = list.length ? '' : 'none';
            box.innerHTML = list.length ? `<details class="lab-more" id="ch-box" ${this._chOpen ? 'open' : ''}><summary><i class="fa-solid fa-trophy text-yellow-500"></i> ${esc(ui('challenge'))} <span id="ch-count"></span></summary>` +
                list.map((c, i) => `<div class="challenge" id="ch-${i}"><i class="fa-regular fa-circle"></i><span>${esc(tr(c.text))}</span></div>`).join('') + '</details>' : '';
            const d = box.querySelector('details'); if (d) d.addEventListener('toggle', () => { this._chOpen = d.open; });
        },

        checkChallenges() {
            (this._challenges || []).forEach((c, i) => {
                const el = $('ch-' + i); if (!el) return;
                let ok = false; try { ok = !!c.check(this.params, this.api, this.group); } catch (e) { /* ignore */ }
                el.classList.toggle('done', ok);
                el.querySelector('i').className = ok ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle';
            });
            const cc = $('ch-count'); if (cc) cc.textContent = '(' + document.querySelectorAll('#lab-challenges .challenge.done').length + '/' + (this._challenges || []).length + ')';
        },

        drawCharts() {
            const wrap = $('lab-charts');
            const has = this.lab && this.lab.charts;
            wrap.style.display = has ? '' : 'none';
            if (!has) return;
            let tg = $('lab-charts-toggle');
            if (!tg) {
                tg = document.createElement('button'); tg.type = 'button'; tg.id = 'lab-charts-toggle'; tg.className = 'lab-action lab-charts-btn';
                wrap.parentNode.insertBefore(tg, wrap);
                tg.onclick = () => { this._chartsOpen = !this._chartsOpen; this.drawCharts(); };
            }
            tg.style.display = '';
            tg.innerHTML = `<i class="fa-solid fa-chart-line"></i> ${esc(ui('graphs'))} <i class="fa-solid fa-chevron-${this._chartsOpen ? 'up' : 'down'}"></i>`;
            wrap.style.display = this._chartsOpen ? '' : 'none';
            if (this._chartsOpen) { const cv = $('lab-chart-canvas'); this.lab.charts.draw(cv, this.modelId, this.params, { lang: lang(), dark: document.documentElement.classList.contains('dark') }); }
        },

        refreshLanguage() {
            if (!this.lab) return;
            this.renderLabTabs(); this.renderModelTabs(); this.renderControls(); this.renderChallenges();
            this._readKey = null; this.refreshReadouts(); this.updateInfo(); this.drawCharts(); this.syncToolbar();
        }
    });
})();
