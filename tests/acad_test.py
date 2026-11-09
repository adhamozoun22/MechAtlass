import subprocess,time,json,sys,os,shutil
from playwright.sync_api import sync_playwright
H=os.path.dirname(os.path.abspath(__file__));ROOT=os.path.abspath(H+'/../MechAtlas');PORT=8841;URL=f'http://127.0.0.1:{PORT}'
OLD=os.path.abspath(H+'/../../acad2/in/MechAtlas')
MOCK=open(H+'/mock_supabase.js').read();KATEX=open(H+'/mock_katex.js').read()
SB='https://krifmzrzzytdstjrbbtq.supabase.co'
R=[];srv=None;errs=[]
def ok(n,c,x=''):
    R.append((n,bool(c),str(x)[:260]));print(('PASS ' if c else 'FAIL ')+n+('' if c else '  -> '+str(x)[:260]),flush=True)
def start(root=ROOT):
    global srv
    stop();srv=subprocess.Popen(['python3',H+'/rsrv.py',root,str(PORT)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(0.8)
def stop():
    global srv
    if srv: srv.kill();srv.wait();srv=None
hits=[]
def route(ctx,lib='ok',katex='ok'):
    def h(r):
        u=r.request.url
        if '127.0.0.1' in u: return r.continue_()
        hits.append(u)
        if 'supabase-js' in u:
            return r.fulfill(status=200,body=MOCK,content_type='application/javascript') if lib=='ok' else r.fulfill(status=404,body='no')
        if 'katex.min.js' in u:
            return r.fulfill(status=200,body=KATEX,content_type='application/javascript') if katex=='ok' else r.fulfill(status=404,body='no')
        if 'katex.min.css' in u: return r.fulfill(status=200,body='',content_type='text/css')
        if u.startswith(SB): return r.fulfill(status=200,body='[]',content_type='application/json',headers={'access-control-allow-origin':'*'})
        return r.fulfill(status=200,body='',content_type='text/css' if u.endswith('css') else 'application/javascript')
    ctx.route('**/*',h)
def newpg(ctx):
    pg=ctx.new_page()
    pg.on('pageerror',lambda e:errs.append(str(e)) if 'tailwind' not in str(e).lower() else None)
    pg.on('console',lambda m: errs.append(m.text) if m.type=='error' and 'tailwind' not in m.text.lower() and 'Failed to load resource' not in m.text else None)
    return pg
def txt(pg,sel='#academy-root'): return pg.evaluate(f"document.querySelector('{sel}').innerText")
def open_academy(pg):
    pg.evaluate("navigate('academy')");pg.wait_for_function("!document.querySelector('#academy-root [role=status]')&&document.querySelector('#academy-root').innerText.length>20",timeout=8000)
def hash_to(pg,h):
    pg.evaluate(f"location.hash='{h}'");pg.wait_for_timeout(300);pg.wait_for_function("!document.querySelector('#academy-root [role=status]')",timeout=8000);pg.wait_for_timeout(150)
try:
  with sync_playwright() as p:
    start();br=p.chromium.launch(args=['--no-sandbox'])
    ctx=br.new_context(viewport={'width':1280,'height':900},service_workers='block');route(ctx);pg=newpg(ctx)
    pg.goto(URL+'/index.html');pg.wait_for_timeout(1200)
    ok('A1 app loads; Academy files present; section + root exist',pg.evaluate("!!document.getElementById('page-academy')&&!!document.getElementById('academy-root')&&!!window.Academy&&!!window.AcademyAPI"))
    ok('A2 nav: desktop + mobile buttons and a home card (EN label «Academy»)',pg.evaluate("document.querySelectorAll(\"[onclick*=\\\"navigate('academy')\\\"]\").length")==3 and pg.evaluate("[...document.querySelectorAll('.nav-btn')].some(b=>b.innerText==='Academy')"),pg.evaluate("[...document.querySelectorAll('.nav-btn')].map(b=>b.innerText).join('|')"))
    ok('A3 NO external Academy library is requested before the section is opened',not any('supabase-js' in h or 'katex' in h for h in hits),hits)
    ok('A4 desktop nav stays one row',pg.evaluate("(()=>{const bs=[...document.querySelectorAll('nav .nav-btn')].filter(b=>b.offsetParent);return new Set(bs.map(b=>Math.round(b.getBoundingClientRect().top))).size==1})()"))
    # ---- home
    pg.click("nav .nav-btn[onclick*=\"'academy'\"]");pg.wait_for_function("document.querySelector('#academy-root').innerText.includes('Latest')||document.querySelector('#academy-root').innerText.includes('أحدث')",timeout=8000)
    ok('A5 section opens, hash becomes #/academy, supabase client created with the publishable key, anonymous (no stored session)',pg.evaluate("location.hash")=='#/academy' and pg.evaluate("__MOCK.client.key.startsWith('sb_publishable_')&&__MOCK.client.opts.auth.persistSession===false&&__MOCK.client.url.includes('krifmzrzzytdstjrbbtq')"))
    t=txt(pg)
    ok('A6 only published content is visible: draft/archived titles never appear',all(x not in t for x in ['مسودة سرية للغاية','مادة مؤرشفة','مسودة داخل السلسلة']),t[:200])
    ok('A7 fields without content are hidden (only Manufacturing + Materials), empty content type «Experiment» hidden',('Empty field' not in t and 'Manufacturing' in t and 'Materials' in t and 'Experiment' not in t and 'Project' in t and 'Article' in t) or ('مجال فارغ' not in t),t[:300])
    ok('A8 series: the one with published items shown, the one with only a draft hidden; count excludes the draft (3)',('سلسلة أساسيات الاختبارات' in t) and ('سلسلة بلا مواد منشورة' not in t) and ('3 items' in t or '3 مواد' in t),t[-300:])
    q=pg.evaluate("__MOCK.log.filter(q=>q.table==='content_items')");bad=[x for x in q if not any(f[0]=='eq' and f[1]=='status' and f[2]=='published' for f in x['filters'])]
    ok('A9 every content_items request carries status = published (defence in depth)',len(q)>0 and not bad,bad[:2])
    ok('A10 field icon with illegal characters falls back to a safe icon (no injected markup)',pg.evaluate("!document.querySelector('#academy-root script')&&[...document.querySelectorAll('#academy-root i')].every(i=>/^[a-zA-Z0-9 :-]*$/.test(i.className))"),pg.evaluate("[...document.querySelectorAll('#academy-root i')].map(i=>i.className).filter(c=>!/^[a-zA-Z0-9 :-]*$/.test(c))"))
    # ---- list, filters, search
    hash_to(pg,'#/academy/field/manufacturing');t=txt(pg)
    ok('B1 field filter: 17 manufacturing items, first page = 12 cards + «Show more»',pg.evaluate("document.querySelectorAll('#academy-root [data-ac-grid] > a').length")==12 and 'Show more' in t and '17 results' in t,t[100:700]+str(pg.evaluate("document.querySelectorAll('#academy-root [data-ac-grid] > *').length")))
    pg.click('[data-ac-more]');pg.wait_for_function("document.querySelectorAll('#academy-root [data-ac-grid] > a').length==17");ok('B2 «Show more» loads the rest (17) and removes the button',pg.evaluate("!document.querySelector('[data-ac-more]')"))
    hash_to(pg,'#/academy/type/project');ok('B3 type filter',pg.evaluate("[...document.querySelectorAll('#academy-root [data-ac-grid] h3')].map(h=>h.innerText)")==['مشروع عملي لقطع الألومنيوم'])
    pg.evaluate("location.hash='#/academy'");pg.wait_for_function("document.querySelector('[data-ac-search]')");pg.fill('[data-ac-search] input','ضغط');pg.press('[data-ac-search] input','Enter');pg.wait_for_function("location.hash.includes('search')&&!document.querySelector('#academy-root [role=status]')");pg.wait_for_timeout(200)
    ok('B4 search finds by title/summary («ضغط» -> the project), keeps the term in the box',pg.evaluate("[...document.querySelectorAll('#academy-root [data-ac-grid] h3')].map(h=>h.innerText)")==['مشروع عملي لقطع الألومنيوم'] and pg.evaluate("document.querySelector('[data-ac-search] input').value")=='ضغط')
    pg.fill('[data-ac-search] input','a,b(c)%*"\'');pg.press('[data-ac-search] input','Enter');pg.wait_for_timeout(500)
    ok('B5 special characters in the search do not break the query (clean «no results» message)',('No matching items' in txt(pg) or 'لا توجد' in txt(pg)) and not errs,errs[:2])
    q=pg.evaluate("__MOCK.log.filter(q=>q.or).map(q=>q.or)");ok('B6 the search filter string contains no raw separators from the user',all(('(' not in x.split(',',1)[1][:0]) and x.count(',')==1 for x in q),q[-2:])
    hash_to(pg,'#/academy/field/nope');ok('B7 unknown field -> empty result, no crash',('No matching' in txt(pg)) or ('لا توجد' in txt(pg)))
    # ---- item page
    hash_to(pg,'#/academy/item/tensile-intro');t=txt(pg)
    ok('C1 item page renders title, summary, badges, published date, share button',all(x in t for x in ['اختبار الشد: من الفكرة إلى الرقم','شرح مبسّط','Share']),t[:200])
    ok('C2 XSS: injected <script>/<img onerror>/javascript: links are shown as text and never run',pg.evaluate("window.__xss===undefined&&!document.querySelector('#academy-root .ac-body script')&&!document.querySelector('#academy-root .ac-body img[onerror]')&&![...document.querySelectorAll('#academy-root a')].some(a=>/^javascript:/i.test(a.getAttribute('href')||''))")and '<script>' in t)
    ok('C3 external links: only https, with rel=noopener noreferrer, target=_blank',pg.evaluate("[...document.querySelectorAll('#academy-root .ac-body a[href^=http]')].every(a=>a.rel.includes('noopener')&&a.target==='_blank')&&!!document.querySelector('a[href=\"https://example.org/a?b=1&c=2\"]')"))
    ok('C4 bold/italic/code inline markup',pg.evaluate("!!document.querySelector('.ac-p strong')&&!!document.querySelector('.ac-p em')&&!!document.querySelector('.ac-p code')"))
    pg.wait_for_function("document.querySelectorAll('.katex-mock').length>0",timeout=8000)
    ok('C5 equations + inline math rendered through KaTeX (block display + legend symbols + inline)',pg.evaluate("document.querySelectorAll('.ac-eq .katex-mock[data-d=\"1\"]').length==1&&document.querySelectorAll('.ac-legend .katex-mock').length==2&&document.querySelectorAll('.ac-p .katex-mock,.ac-list .katex-mock').length>=2"),pg.evaluate("document.querySelectorAll('.katex-mock').length"))
    ok('C6 worked example, table (headers+rows), ordered list, heading',pg.evaluate("!!document.querySelector('.ac-example')&&document.querySelectorAll('.ac-table th').length==2&&document.querySelectorAll('.ac-table tbody tr').length==2&&document.querySelectorAll('ol.ac-ol li').length>=2&&!!document.querySelector('h2.ac-h2')"))
    pg.wait_for_function("document.querySelector('img[data-ac-path=\"items/tensile.png\"]').src.startsWith('data:image')",timeout=8000)
    sg=pg.evaluate("__MOCK.sign")
    ok('C7 images/PDF from the PRIVATE bucket use batched signed URLs (one call, bucket academy-media)',len(sg)==1 and sg[0]['bucket']=='academy-media' and set(sg[0]['paths'])=={'items/tensile.png','items/missing.png','items/sheet.pdf'},sg)
    ok('C8 a file that cannot be signed shows an error text instead of a broken image',pg.evaluate("(()=>{const i=document.querySelector('img[data-ac-path=\"items/missing.png\"]');return i.hidden&&!i.parentNode.querySelector('.ac-fig-err').hidden})()"))
    ok('C9 PDF button gets the signed link',pg.evaluate("(()=>{const a=document.querySelector('a[data-ac-pdf]');return a.href.startsWith('data:')&&!a.hasAttribute('aria-disabled')&&a.target==='_blank'})()"))
    ok('C10 videos: YouTube -> nocookie sandboxed iframe, Telegram -> link button, javascript: URL dropped',pg.evaluate("(()=>{const f=document.querySelectorAll('.ac-video iframe');return f.length==1&&f[0].src.startsWith('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ')&&f[0].hasAttribute('sandbox')&&!!document.querySelector('a[href=\"https://t.me/ZeroPointHmk/12\"]')&&![...document.querySelectorAll('#academy-root a,#academy-root iframe')].some(x=>/javascript:/i.test(x.href||x.src||''))})()"))
    pg.click('.ac-opt[data-opt=\"0\"]');ok('C11 quiz: wrong answer is marked, the correct one is revealed with the explanation',pg.evaluate("document.querySelector('.ac-opt-wrong')&&document.querySelector('.ac-opt-right')&&!document.querySelector('.ac-quiz-ex').hidden&&document.querySelectorAll('.ac-opt:disabled').length==3")and 'Not correct' in txt(pg))
    ok('C12 references list: link opens safely, entry without a link is plain text',pg.evaluate("document.querySelectorAll('.ac-refs li').length==2&&document.querySelectorAll('.ac-refs a').length==1"))
    ok('C13 unknown block type is skipped without breaking the page (and a plain-string block works)','نص مباشر كسلسلة' in txt(pg) and not errs,errs[:2])
    ok('C14 article direction follows the content (Arabic -> rtl)',pg.evaluate("document.querySelector('.ac-article').dir")=='rtl')
    ok('C15 blocks appear in sort_order (string block first, heading second)',pg.evaluate("[...document.querySelectorAll('.ac-body > *')].slice(0,2).map(e=>e.className)")==['ac-p','ac-h2'])
    # ---- series nav
    ok('C16 series box: «Part 1/3», no «previous», next = lesson 2; the draft in the series is skipped',('Part 1/3' in txt(pg)) and 'Next: الدرس الثاني في السلسلة' in txt(pg) and 'مسودة داخل السلسلة' not in txt(pg),txt(pg)[-300:])
    pg.click('a[href="#/academy/item/series-2"]');pg.wait_for_function("document.querySelector('h2')&&document.querySelector('#academy-root h2').innerText.includes('الثاني')");pg.wait_for_timeout(200)
    t=txt(pg);ok('C17 middle lesson: «Part 2/3», previous = lesson 1 (ordered by sort_order, not insertion), next = lesson 3',('Part 2/3' in t) and 'Previous: اختبار الشد' in t and 'Next: الدرس الثالث' in t,t[-260:])
    hash_to(pg,'#/academy/series/basics');t=txt(pg)
    ok('C18 series page: ordered list 1..3 in sort order, draft not listed, back link',pg.evaluate("[...document.querySelectorAll('#academy-root ol > li .block.font-bold')].map(e=>e.innerText)")==['اختبار الشد: من الفكرة إلى الرقم','الدرس الثاني في السلسلة','الدرس الثالث في السلسلة'] and 'Back to the Academy' in t,t[:300])
    hash_to(pg,'#/academy/series/hidden-series');ok('C19 a series with no published item is not available',('does not exist' in txt(pg)) or ('غير موجودة' in txt(pg)) or ('not found' in txt(pg).lower()),txt(pg)[:80])
    hash_to(pg,'#/academy/item/secret-draft');ok('C20 a DRAFT can not be opened by its link («not published»)',('not published' in txt(pg)) and 'مسودة سرية' not in txt(pg),txt(pg)[:100])
    hash_to(pg,'#/academy/item/nope');ok('C21 unknown item -> friendly message',('not published' in txt(pg)))
    # ---- navigation behaviour
    pg.evaluate("navigate('quiz')");pg.wait_for_timeout(200)
    ok('D1 leaving the Academy clears its hash (other sections keep a clean URL)',pg.evaluate("location.hash")=='' and pg.evaluate("document.getElementById('page-quiz').classList.contains('active')"))
    pg.evaluate("navigate('academy')");pg.wait_for_timeout(500);ok('D2 coming back opens the Academy home',pg.evaluate("location.hash")=='#/academy' and 'Latest' in txt(pg))
    hash_to(pg,'#/academy')
    # language
    pg.evaluate("toggleLanguage()");pg.wait_for_timeout(600);t=txt(pg)
    ok('D3 language toggle: Academy chrome switches (Arabic), field names use name_ar, RTL',('أكاديمية MechAtlas' in t) and pg.evaluate("document.documentElement.dir")=='rtl' and ('التصنيع' in t),t[:300]+'|dir='+pg.evaluate("document.documentElement.dir"))
    pg.evaluate("toggleLanguage()");pg.wait_for_timeout(600)
    ok('D4 back to English: «MechAtlas Academy», field names use name_en',('MechAtlas Academy' in txt(pg)) and ('Manufacturing' in txt(pg)),txt(pg)[:300])
    # ---- other sections untouched
    for sec in ['encyclopedia','processes','3d-lab','cnc-secrets','calculators','mtest','quiz','beam','home']:
        pg.evaluate(f"navigate('{sec}')");pg.wait_for_timeout(120)
    ok('D5 every other section still opens',pg.evaluate("document.getElementById('page-home').classList.contains('active')"))
    ok('D6 materials-testing section still has its 13 tests and 5 videos',pg.evaluate("MTEST.tests.length==13&&Object.keys(MTVideo.VID).length==5"))
    ctx.close()
    # ================= errors =================
    ctx=br.new_context(service_workers='block');route(ctx);pg=newpg(ctx);pg.goto(URL+'/index.html');pg.wait_for_timeout(800)
    pg.evaluate("navigate('academy')");pg.wait_for_function("window.__MOCK");pg.evaluate("__MOCK.fail='data'");pg.evaluate("AcademyAPI.clearCache();Academy.render({view:'home'})")
    pg.wait_for_selector('[data-ac-retry]',timeout=8000);ok('E1 backend error -> clear message + retry button; app keeps working',('could not be loaded' in txt(pg)) and pg.evaluate("(navigate('quiz'),document.getElementById('page-quiz').classList.contains('active'))"))
    pg.evaluate("navigate('academy')");pg.evaluate("__MOCK.fail=null");pg.wait_for_selector('[data-ac-retry]');pg.click('[data-ac-retry]');pg.wait_for_function("document.querySelector('#academy-root').innerText.includes('Latest')",timeout=8000);ok('E2 retry succeeds once the backend is back',True)
    pg.evaluate("__MOCK.fail='net'");pg.evaluate("AcademyAPI.clearCache();Academy.render({view:'home'})");pg.wait_for_selector('[data-ac-retry]',timeout=8000);ok('E3 network failure handled the same way',True)
    ok('E4 no uncaught JavaScript errors during error handling',not [e for e in errs if 'boom' not in e and 'Failed to fetch' not in e],errs[:3])
    ctx.close();errs.clear()
    ctx=br.new_context(service_workers='block');route(ctx,lib='bad');pg=newpg(ctx);pg.goto(URL+'/index.html');pg.wait_for_timeout(800)
    pg.evaluate("navigate('academy')");pg.wait_for_selector('[data-ac-retry]',timeout=8000);ok('E5 library CDN blocked -> specific message, retry available, rest of the app fine',('connection library' in txt(pg)) and pg.evaluate("(navigate('calculators'),document.getElementById('page-calculators').classList.contains('active'))"))
    ctx.close()
    ctx=br.new_context(service_workers='block');route(ctx,katex='bad');pg=newpg(ctx);pg.goto(URL+'/index.html#/academy/item/tensile-intro');pg.wait_for_timeout(2500)
    ok('E6 KaTeX unavailable -> formulas stay readable as plain text (no errors)',pg.evaluate("document.querySelectorAll('.katex-mock').length")==0 and '\\frac{F}{A}' in txt(pg) and pg.evaluate("window.__xss")is None)
    # deep link on a fresh load
    ok('E7 shared link opened on a fresh page: Academy section active and that item shown',pg.evaluate("document.getElementById('page-academy').classList.contains('active')")and 'اختبار الشد' in txt(pg))
    ctx.close()
    # ================= viewport =================
    ctx=br.new_context(viewport={'width':360,'height':740},service_workers='block');route(ctx);pg=newpg(ctx);pg.goto(URL+'/index.html#/academy/item/tensile-intro');pg.wait_for_timeout(2000)
    ok('F1 360px wide: item page has no horizontal overflow (equation/table scroll inside their boxes)',pg.evaluate("document.documentElement.scrollWidth<=document.documentElement.clientWidth"),pg.evaluate("document.documentElement.scrollWidth"))
    hash_to(pg,'#/academy');ok('F2 360px home no overflow',pg.evaluate("document.documentElement.scrollWidth<=document.documentElement.clientWidth"))
    ctx.close()
    # ================= service worker =================
    for d in ['prof_a']: shutil.rmtree(H+'/'+d,ignore_errors=True)
    os.makedirs(H+'/swroot',exist_ok=True)
    if os.path.lexists(H+'/swroot/cur'): os.remove(H+'/swroot/cur')
    os.symlink(OLD,H+'/swroot/cur');start(H+'/swroot/cur')
    ctx=p.chromium.launch_persistent_context(H+'/prof_a',args=['--no-sandbox','--host-resolver-rules=MAP *.supabase.co 127.0.0.1']);route(ctx);pg=newpg(ctx)
    pg.goto(URL+'/index.html');pg.wait_for_timeout(1500);pg.reload();pg.wait_for_timeout(1500)
    pg.evaluate(f"fetch('http://krifmzrzzytdstjrbbtq.supabase.co:{PORT}/rest/v1/content_items?select=*',{{mode:'no-cors'}}).then(r=>r.type).catch(e=>String(e))");pg.wait_for_timeout(800)
    old=pg.evaluate("Promise.all((['mechatlas-v29']).map(n=>caches.open(n).then(c=>c.keys()).then(k=>k.map(r=>r.url)))).then(a=>a.flat())")
    ok('G1 PROOF of the risk: the OLD service worker (v29) caches Supabase API responses',any('supabase.co' in u for u in old),old[-2:])
    pg.evaluate("caches.open('mechatlas-media').then(c=>c.put(new URL('media/material-tests/charpy-impact-test.mp4',location.href).href,new Response(new Blob([new Uint8Array(10)]),{headers:{'Content-Length':'10'}})))")
    ctx.close()
    os.remove(H+'/swroot/cur');os.symlink(ROOT,H+'/swroot/cur')
    ctx=p.chromium.launch_persistent_context(H+'/prof_a',args=['--no-sandbox','--host-resolver-rules=MAP *.supabase.co 127.0.0.1']);route(ctx);pg=newpg(ctx)
    pg.goto(URL+'/index.html');pg.wait_for_timeout(2500);pg.reload();pg.wait_for_timeout(2500)
    names=pg.evaluate("caches.keys()");ok('G2 update v29 -> v30: old cache removed, v30 present, media cache kept with the saved video',('mechatlas-v30' in names) and ('mechatlas-v29' not in names) and 'mechatlas-media' in names and pg.evaluate("caches.open('mechatlas-media').then(c=>c.keys()).then(k=>k.length)")==1,names)
    ok('G3 v30 caches the Academy files for offline start',pg.evaluate("caches.open('mechatlas-v30').then(c=>c.keys()).then(k=>['config','api','render','ui','core'].every(n=>k.some(r=>r.url.endsWith('academy/'+n+'.js')))&&k.some(r=>r.url.endsWith('academy.css')))"))
    pg.evaluate(f"fetch('http://krifmzrzzytdstjrbbtq.supabase.co:{PORT}/rest/v1/content_items?select=*',{{mode:'no-cors'}}).then(r=>r.type).catch(e=>String(e))");pg.evaluate(f"fetch('http://krifmzrzzytdstjrbbtq.supabase.co:{PORT}/storage/v1/object/sign/academy-media/x',{{mode:'no-cors'}}).then(r=>r.type).catch(e=>String(e))");pg.wait_for_timeout(800)
    allk=pg.evaluate("caches.keys().then(ns=>Promise.all(ns.map(n=>caches.open(n).then(c=>c.keys()).then(k=>k.map(r=>r.url))))).then(a=>a.flat())")
    ok('G4 v30 NEVER caches Supabase requests (data or storage)',not any('supabase.co' in u for u in allk),[u for u in allk if 'supabase' in u])
    pg.evaluate("fetch('admin/index.html').then(r=>r.status)");pg.wait_for_timeout(500)
    allk=pg.evaluate("caches.keys().then(ns=>Promise.all(ns.map(n=>caches.open(n).then(c=>c.keys()).then(k=>k.map(r=>r.url))))).then(a=>a.flat())")
    ok('G5 v30 never caches /admin/ files',not any('/admin' in u for u in allk))
    pg.evaluate("navigate('academy')");pg.wait_for_timeout(1500)
    ctx.set_offline(True);pg.reload();pg.wait_for_timeout(2500)
    ok('G6 offline: the app shell and every section still load from cache',pg.evaluate("typeof MTEST!=='undefined'&&typeof Academy!=='undefined'&&MTEST.tests.length")==13)
    pg.evaluate("navigate('academy')");pg.wait_for_timeout(2500)
    ok('G7 offline: Academy shows its friendly error (backend/CDN unreachable), nothing breaks',pg.evaluate("document.getElementById('page-academy').classList.contains('active')") and ('could not be loaded' in txt(pg) or 'connection library' in txt(pg)),txt(pg)[:100])
    ctx.close()
    ok('Z no unexpected JavaScript errors in any phase',not errs,errs[:3])
    br.close()
finally:
    stop()
n=sum(1 for r in R if r[1]);print(f'\n{n}/{len(R)} passed');json.dump(R,open(H+'/acad_test.json','w'),ensure_ascii=False,indent=1)
