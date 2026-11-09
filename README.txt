MechAtlas — project structure (stage 1)
=======================================
index.html              page shell (navigation + sections)
css/app.css             all custom styles
js/i18n.js              UI translations (EN/AR)
js/data/                encyclopedia + manufacturing-process content
js/app.js               navigation, language/theme, encyclopedia, calculators, quiz
js/labs/engine.js       shared 3D lab engine (ONE renderer for every lab: controls, live readouts,
                        labels, wireframe, expand mode, challenges, adaptive quality)
js/labs/gears.js        Gears lab  (add a new lab = add one file + one <script> line + one line in service-worker.js)
js/vendor/              three.min.js r128 + OrbitControls (self-hosted, work offline)
service-worker.js       offline cache — bump VERSION whenever you change ANY file
manifest.json, icons/   PWA

Hosting: upload this whole folder to Netlify (drag the folder, not a zip). A service worker needs HTTPS or localhost.

--- Stage 2 (gear lab expansion) ---
New gear models: rack & pinion, bevel pair 90 deg, worm drive, planetary set (4 drive modes), internal gear.
Extras: Lewis bending-stress + safety factor with material choice, contact ratio, worm efficiency / self-locking,
bevel thrust loads, planetary Willis kinematics, live bar charts (speed / torque / power / stress).
Service worker is now v4: the first open after upload may need one extra reload (or clear app data once).
Upload the whole "mechatlas" folder CONTENTS to Netlify (index.html must be at the site root).

--- Stage 3 (machine disassembly lab) ---
New lab "Machine Disassembly": ball bearing 62xx, rigid flange coupling, single-stage gearbox.
Exploded view slider, auto explode, assembly step-through, BOM with calculated masses, isolate part, cutaway,
manufacturing / tolerance / standard / assembly notes per part, ISO 286 fits, bearing life + defect frequencies,
bolt / key / shaft checks, gearbox heat balance. The gears lab is unchanged.

--- Stage 4 (pump + engine + lab upgrades) ---
Disassembly lab: two new models.
  Centrifugal pump (end-suction, back-pull-out): closed impeller with log-spiral vanes, volute casing, seal cover,
  mechanical seal, wear ring, 2x 6206 bearings, studs. Controls: impeller trim, vanes, beta2, material, balance holes,
  wear-ring clearance, rpm, fluid, static head, discharge valve, NPSHa. Results: duty point (pump curve x system curve),
  BEP, efficiency, power & motor, NPSH margin, radial/axial thrust, shaft deflection, bearing life, leakage, charts.
  4-stroke petrol engine (DOHC): block, crank, flywheel, rod + cap + shells + bolts, piston, rings, pin, head, valves, springs,
  tappets, 2 cams, spark plug. LIVE animation of piston, rod, valves and cams. Cylinder pressure cycle, gas / inertia forces,
  torque, IMEP/BMEP/power, bearing pressures, rod-bolt margin, valve-float rpm, flywheel Cs, valve-lift chart.
Lab-wide: "Typical failure & fix" for every part (old models too), tightening torques (T = K*F*d), line-chart panels,
camera distance limit now follows the model size. Encyclopedia: new entries Centrifugal Pump + Internal Combustion Engine
(with "Try in 3D lab" buttons; Mechanical Seal -> pump, Spring -> engine).
Service worker is now v5 (one extra reload or clear app data after updating).

--- Stage 5 (Strength of Materials lab) ---
New lab "Strength of Materials" with six 3D models, all coloured by stress (blue = compression, red = tension, dark = beyond yield):
  Beam bending: 4 support types (incl. statically indeterminate), 5 load patterns, rect / round / tube / IPE sections, 6 materials,
    self-weight; reactions, SFD, BMD, deflection curve, stress through the depth, natural frequency.
  Tensile test: dog-bone specimen with necking and cup-and-cone fracture; stress-strain curve (engineering + true), E, yield, UTS,
    elongation, reduction of area, toughness; ductile vs brittle materials.
  Torsion shaft: solid / hollow, torque or power & rpm; shear stress, twist angle, torque capacity vs diameter.
  Column buckling: 4 end conditions, Euler + Johnson, sigma_cr vs slenderness, P_cr vs length, bowing shape as P approaches P_cr.
  Pressure vessel: cylinder / sphere, Lame thick-wall stresses, thin-wall error, von Mises & Tresca, minimum wall.
  Mohr's circle: stress element you can rotate, circle + sigma/tau vs theta plot, principal / max-shear buttons, yield criteria.
Encyclopedia: new entries Beam Bending, Column Buckling, Pressure Vessel, Mohr's Circle; Stress / Strain / Torque / Factor of Safety
now have "Try in 3D lab" buttons. Engine: controls that appear only for some options now get their default value immediately.
Service worker is now v6.

--- Stage 6 (Fluids & Pumps lab) ---
New lab "Fluids & Pumps" with six 3D models:
  Pipe flow & losses: tank + pipe + valve + elbows, laminar/turbulent velocity profile, Darcy-Weisbach with minor losses,
    EGL/HGL, Moody chart, pressure colouring.
  Pump & system curve: one / parallel / series pumps, 3 sizes, speed (affinity laws), fluid, static head, pipe length/diameter,
    valve; operating point, efficiency, NPSH (cavitation risk), power, speed control vs throttling.
  Venturi & orifice meter: flow, pressure drop, discharge coefficient, permanent loss, cavitation check, mercury U-tube.
  Hydrostatic gate: force, centre of pressure, hinge/holding force.
  Buoyancy & stability: exact heeled waterline, GM, GZ curve, deck immersion, vanishing angle.
  Drag on bodies: sphere / cylinder / disc / strut, drag crisis, streak lines with wake.
Encyclopedia: new entries Bernoulli, Reynolds Number, Pump Curves, Hydrostatic Pressure, Buoyancy, Drag Force with "Try in 3D lab" buttons.
Service worker is now v7.

--- Stage 7 (Hydraulics & Pneumatics lab + simpler lab screens) ---
SIMPLER LABS (all labs): each model now shows only the 4 key values first (a "More values" button shows the rest; warnings are never hidden),
  the 5 main controls first (a "More settings" button holds the rest + animation speed), graphs behind a "Graphs" button, challenges and the
  parts list collapsed, a one-sentence intro, and the wireframe button was removed.
New lab "Hydraulics & Pneumatics" with five 3D models: Hydraulic jack (Pascal), Hydraulic cylinder circuit (pump, relief valve, valve,
  cylinder), Pneumatic cylinder circuit, Accumulator, Hydraulic motor. Encyclopedia: Pascal's Principle, Hydraulic Cylinder Circuit,
  Pneumatics, Accumulator, Hydraulic Motor, each with a "Try in 3D lab" button.
Service worker is now v8.

--- Stage 8 (Manufacturing & CNC lab) ---
New lab "Manufacturing & CNC" with five 3D models: Turning (lathe: spindle speed, cutting power, time, roughness Ra, tool life, chips),
  Milling (table feed, power, MRR, chip thickness), Sheet-metal press (punching force, press size, punch stress, clearance; V-bending
  force, minimum radius, springback), Casting & riser (Chvorinov solidification time, riser check, shrinkage hole, yield),
  CNC pocket tool path (path length, passes, time, chip load, MRR). Encyclopedia: Turning, Milling, Punching & Bending,
  Casting, CNC Tool Path (each with a "Try in 3D lab" button; Surface Roughness now links to the turning model).
Service worker is now v9.

--- Stage 9 (CNC Secrets series) ---
New section "CNC Secrets" (menu + home card): lessons with text, pictures and a video stored INSIDE the app (no Telegram needed).
Lessons are listed in js/data/cnc_series.js (see the comment in that file); pictures and videos go in the folder media/cnc/.
Every lesson is collapsed (title + "Tap to read more") and opens on tap. 11 lessons; lesson 9 has no video.
Offline: a "Download for offline" button at the top of the section stores all lesson videos+pictures (~28 MB) in the browser cache (Cache API, cache name mechatlas-media); the service worker (now v12) serves them with Range support. Needs https (Netlify).
The service worker never caches /media/ (videos need to stream). Service worker is now v11.

--- Stage 10 (Beam Designer) ---
New page "Beam Designer" (home card + button "Beam Designer" inside the Strength lab): the user draws a simple statically determinate beam
(pin + roller anywhere on the beam, so overhangs work, or a cantilever fixed at left/right), adds point / uniform / triangular-trapezoid loads
and applied moments (drag them on the drawing or type values), picks section + material, and gets reactions, SFD, BMD, deflection,
max stress and safety factor, plus a step-by-step solution table. Code: js/beam_designer.js. Service worker v13.

--- Stage 11 ---
Beam Designer: each support (A and B) can be pin or roller; thermal load (uniform dT + top/bottom gradient, restrained axial force when both supports are pins);
export of the drawing, diagrams and results as PNG image or PDF (Web Share when available, else download).
Arabic word for deflection is now "التدلي" everywhere.
Strength lab: beam model keeps only shear stress + max sag in "more values"; tensile curve made realistic (upper yield point, yield drop, Lueders plateau,
hardening, necking for steels; smooth 0.2 % offset knee for aluminium/titanium); torsion extra values trimmed; column readouts are one law/value/unit per cell
(squash load removed); Mohr's circle shows only the values obtained from the circle; disassembly gearbox keeps the first four values + bending stress + safety factor.
Service worker v14.

--- Stage 12 ---
Disassembly lab fixes: gearbox drain plug now has a threaded shank through a boss pad and the base wall; the breather has a threaded stem, cap and dome seated in a boss on the cover;
engine head got a spark-plug thread hole so the spark plug is visibly mounted. Service worker v15.
Stage 12b: coupling lab: shafts and hubs now have real keyways, each key sits in its shaft keyway and lifts out radially (turning with the shaft) instead of floating beside the hub; removed the unlabeled orange mark on the flange. Service worker v16.

--- Stage 13 ---
Manufacturing lab now has 5 new models: Surface grinding (power, removal rate, roughness, burn risk), Guillotine shearing (force with tilted vs flat blade, clearance and edge quality),
Press-brake bending (force, springback, cracking, bend allowance), Deep drawing of a cup (draw ratio, blank size, blank-holder, wrinkling/tearing) and Wire drawing (draw stress, die angle, breaking).
The old punching press no longer has the bending option (bending has its own model). New file: js/labs/manufacturing_forming.js. Encyclopedia: 4 new entries (shearing, sheet bending, deep drawing, wire drawing).
Service worker v17.

--- Stage 14 ---
Encyclopedia: 213 new glossary terms (project management & safety, maintenance & operation, material testing & quality, cars & engines, robotics & automation, production, thermodynamics & heat transfer, fluids & hydraulics, dynamics & vibration, design, materials, tolerances & metrology), each with an English and Arabic explanation (and a formula where useful).
The encyclopedia is now split into 12 categories shown as a scrollable chip bar with term counts (like the lab tabs); "Show more" loads long lists in pages; search also looks inside explanations. Older detailed entries were moved into the new categories.
New files: js/data/terms_a..e.js, js/data/terms_load.js. Service worker v18.

Stage 15 (encyclopedia, second batch)
- 188 new terms from the second 10 images; terms that already existed were skipped and not modified.
- New categories: design process, engineering drafting, gears & transmission, material selection & metals, CAD & CAE, hydraulic & pneumatic systems (18 categories, 447 terms).
- Old gear entries moved to Gears & Transmission, old hydraulic/pneumatic entries moved to Hydraulic & Pneumatic Systems (category only; content unchanged).
- Service worker v19.
- Stage 15b: CNC series videos restored to the original uploaded files (no re-encoding); SW v20.
- Stage 15c: CNC series videos removed; each lesson shows its text plus an optional Telegram link (currently the channel link; per-post links to be filled). SW v21.
- Stage 15d: per-post Telegram links filled in for lessons 1-8 and 10.
- Audit stages (details in each lab's own audit report):
  - v22: audits of the strength, fluids & pumps and gears labs.
  - v23: disassembly lab audit.
  - v24: CNC & manufacturing lab audit, stage 1 (milling ae limited to the cutter diameter; CNC pocket MRR/circular rings; wire-drawing power).
  - v25: CNC & manufacturing lab stage 2: "Reset settings" chip, Kienzle kc/mc constants updated from published tables, finishing pass + rapid time in the CNC pocket model, springback and blank-holder pressure from textbook formulas, G-code simulator (subset of commands, educational only; G54 = program zero, G55-G59 not supported); shared lab engine got an optional "textarea" control type and an "onEdit" hook (no other lab uses them).
