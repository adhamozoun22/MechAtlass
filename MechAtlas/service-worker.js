// MechAtlas service worker — bump VERSION whenever any cached file changes.
const VERSION = 'v31';
const MEDIA_CACHE = 'mechatlas-media';   // lesson videos/pictures the user chose to download for offline use (never auto-deleted; includes media/material-tests/*.mp4, which are NOT in LOCAL_ASSETS on purpose)
const CACHE_NAME = `mechatlas-${VERSION}`;

const LOCAL_ASSETS = [
  './', './index.html', './manifest.json', './css/app.css',
  './js/i18n.js', './js/data/dictionary.js', './js/data/processes.js', './js/app.js',
  './js/vendor/three.min.js', './js/vendor/OrbitControls.js',
  './js/labs/engine.js', './js/labs/gears.js',
  './js/labs/gears_more.js', './js/labs/disasm.js', './js/labs/disasm_bearing.js', './js/labs/disasm_coupling.js', './js/labs/disasm_gearbox.js', './js/labs/disasm_pump.js', './js/labs/disasm_engine.js', './js/labs/disasm_extras.js', './js/labs/strength.js', './js/labs/strength_more.js', './js/labs/fluids.js', './js/labs/fluids_more.js', './js/labs/hydraulics.js', './js/labs/hydraulics_more.js', './js/labs/manufacturing.js', './js/labs/manufacturing_more.js', './js/labs/manufacturing_forming.js', './js/data/cnc_series.js', './js/data/terms_a.js', './js/data/terms_b.js', './js/data/terms_c.js', './js/data/terms_d.js', './js/data/terms_e.js', './js/data/terms_f.js', './js/data/terms_g.js', './js/data/terms_h.js', './js/data/terms_i.js', './js/data/terms_load.js', './js/data/mtest_svg.js', './js/data/mtest_a.js', './js/data/mtest_b.js', './js/data/mtest_c.js', './js/mtest_video.js', './js/mtest.js', './academy/config.js', './academy/api.js', './academy/render.js', './academy/ui.js', './academy/core.js', './academy/academy.css', './js/beam_designer.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-192.png', './icons/icon-maskable-512.png'
];

// External resources (no-cors, cached opaque). A failure here must not block install.
const CDN_ASSETS = [
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;500;600&display=swap'
];

const cacheable = (res) => res && (res.ok || res.type === 'opaque');

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(LOCAL_ASSETS);
    await Promise.allSettled(CDN_ASSETS.map((url) => cache.add(new Request(url, { mode: 'no-cors' }))));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((n) => n !== CACHE_NAME && n !== MEDIA_CACHE).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  /* never intercept or cache: the Supabase backend (data, auth, storage and signed URLs) and the admin panel */
  if (/(^|\.)supabase\.(co|in)$/i.test(url.hostname) || /\/admin(\/|$)/.test(url.pathname)) return;
  if (url.pathname.indexOf('/media/') !== -1) {          // lesson media: serve the downloaded copy (with Range support for video) else straight from the network
    event.respondWith(serveMedia(req));
    return;
  }
  if (req.mode === 'navigate' && url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {            // network first, cached shell when offline
    event.respondWith(
      fetch(req).then((res) => {
        if (cacheable(res)) { const copy = res.clone(); caches.open(CACHE_NAME).then((c) => c.put('./index.html', copy)); }
        return res;
      }).catch(() => caches.match('./index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  event.respondWith(                         // stale-while-revalidate for everything else
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        if (cacheable(res)) { const copy = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});

async function serveMedia(req) {
  try {
    const cache = await caches.open(MEDIA_CACHE);
    const hit = await cache.match(req.url, { ignoreSearch: true });
    if (!hit) return fetch(req);
    const range = req.headers.get('range');
    if (!range) return hit;
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    const blob = await hit.blob();
    const size = blob.size;
    let start = m && m[1] !== '' ? parseInt(m[1], 10) : 0;
    let end = m && m[2] !== '' ? parseInt(m[2], 10) : size - 1;
    if (m && m[1] === '' && m[2] !== '') { start = Math.max(0, size - parseInt(m[2], 10)); end = size - 1; }
    end = Math.min(end, size - 1);
    if (start > end) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + size } });
    return new Response(blob.slice(start, end + 1), {
      status: 206,
      headers: { 'Content-Type': hit.headers.get('Content-Type') || 'video/mp4', 'Content-Length': String(end - start + 1), 'Content-Range': 'bytes ' + start + '-' + end + '/' + size, 'Accept-Ranges': 'bytes' }
    });
  } catch (e) { return fetch(req); }
}
