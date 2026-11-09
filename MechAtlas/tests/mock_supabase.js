/* TEST-ONLY stand-in for the supabase-js library: an in-memory database with the same chainable calls the Academy uses. It does NOT enforce RLS on purpose, so the tests can prove the app itself only asks for published rows. */
(function(){
const U=(n)=>'00000000-0000-0000-0000-'+String(n).padStart(12,'0');
const D={
 engineering_fields:[{id:U(1),name_ar:'التصنيع',name_en:'Manufacturing',slug:'manufacturing',description:'',icon:'fa-industry'},{id:U(2),name_ar:'المواد',name_en:'Materials',slug:'materials',description:'',icon:'bad class <script>'},{id:U(3),name_ar:'مجال فارغ',name_en:'Empty field',slug:'empty-field',description:'',icon:'fa-gear'}],
 content_types:[{id:U(11),name_ar:'مقالة',name_en:'Article',slug:'article',description:''},{id:U(12),name_ar:'مشروع',name_en:'Project',slug:'project',description:''},{id:U(13),name_ar:'تجربة',name_en:'Experiment',slug:'experiment',description:''}],
 content_items:[], content_blocks:[], series:[], series_items:[]
};
let n=100;
function item(o){const x=Object.assign({id:U(++n),title:'',slug:'',summary:'',content_type_id:U(11),field_id:U(1),status:'published',author_id:null,published_at:'2026-10-01T10:00:00Z',created_at:'2026-09-01T10:00:00Z',updated_at:'2026-09-01T10:00:00Z'},o);D.content_items.push(x);return x}
const main=item({title:'اختبار الشد: من الفكرة إلى الرقم',slug:'tensile-intro',summary:'شرح مبسّط لاختبار الشد.',field_id:U(2),content_type_id:U(11),published_at:'2026-10-20T10:00:00Z'});
const s2=item({title:'الدرس الثاني في السلسلة',slug:'series-2',summary:'ثانياً',published_at:'2026-10-19T10:00:00Z'});
const s3=item({title:'الدرس الثالث في السلسلة',slug:'series-3',summary:'ثالثاً',published_at:'2026-10-18T10:00:00Z'});
const sdraft=item({title:'مسودة داخل السلسلة (لا تظهر)',slug:'series-draft',status:'draft'});
item({title:'مسودة سرية للغاية',slug:'secret-draft',status:'draft',summary:'لا يجوز أن تظهر'});
item({title:'مادة مؤرشفة',slug:'archived-one',status:'archived'});
item({title:'مشروع عملي لقطع الألومنيوم',slug:'cnc-project',content_type_id:U(12),field_id:U(1),summary:'مشروع ضغط وقطع',published_at:'2026-10-10T10:00:00Z'});
for(let i=1;i<=14;i++) item({title:'مادة تصنيع رقم '+i,slug:'mfg-'+i,field_id:U(1),content_type_id:U(11),published_at:'2026-09-'+String(i).padStart(2,'0')+'T10:00:00Z'});
const blk=(t,c,o)=>D.content_blocks.push({id:U(++n),content_item_id:main.id,block_type:t,content:c,sort_order:o});
blk('heading',{text:'المقدمة',level:2},1);
blk('paragraph',{text:'الإجهاد **σ** يساوي القوة على المساحة، ورمزه $\\sigma = F/A$ و *مثال* و `code` و <script>window.__xss=1</script> و <img src=x onerror="window.__xss=2"> و [رابط خبيث](javascript:alert(1)) و [موقع](https://example.org/a?b=1&c=2)'},2);
blk('list',{ordered:true,items:['الأول','الثاني $E=\\sigma/\\varepsilon$']},3);
blk('equation',{tex:'\\sigma = \\frac{F}{A}',label:'تعريف الإجهاد',legend:[['\\sigma','الإجهاد بالميغاباسكال'],['F','القوة بالنيوتن']]},4);
blk('example',{title:'مثال محلول',steps:['F = 20 kN','A = 100 mm²','σ = 200 MPa'],result:'σ = 200 MPa'},5);
blk('table',{caption:'خواص',headers:['المادة','E (GPa)'],rows:[['فولاذ','200'],['ألمنيوم','70']]},6);
blk('image',{path:'items/tensile.png',alt:'مخطط',caption:'منحنى الإجهاد'},7);
blk('image',{path:'items/missing.png',alt:'مفقودة'},8);
blk('pdf',{path:'items/sheet.pdf',title:'ورقة عمل'},9);
blk('video',{url:'https://www.youtube.com/watch?v=dQw4w9WgXcQ',title:'فيديو يوتيوب'},10);
blk('video',{url:'https://t.me/ZeroPointHmk/12',title:'فيديو تيليغرام'},11);
blk('video',{url:'javascript:alert(1)',title:'خبيث'},12);
blk('quiz',{question:'ما وحدة الإجهاد؟',options:['N','MPa','kg'],answer:1,explanation:'MPa = N/mm²'},13);
blk('references',{items:[{title:'ASTM E8',url:'https://www.astm.org',note:'المعيار'},{title:'كتاب بلا رابط'}]},14);
blk('totally_new_block',{x:1},15);
blk('paragraph','نص مباشر كسلسلة',0);
const sr=D.series; const S1={id:U(900),title:'سلسلة أساسيات الاختبارات',slug:'basics',description:'سلسلة من ثلاثة دروس',field_id:U(2),created_at:'2026-10-01T00:00:00Z'};
const S2={id:U(901),title:'سلسلة بلا مواد منشورة',slug:'hidden-series',description:'',field_id:U(1),created_at:'2026-10-02T00:00:00Z'};
sr.push(S1,S2);
D.series_items.push({id:U(1),series_id:S1.id,content_item_id:s3.id,sort_order:3},{id:U(2),series_id:S1.id,content_item_id:main.id,sort_order:1},{id:U(3),series_id:S1.id,content_item_id:s2.id,sort_order:2},{id:U(4),series_id:S1.id,content_item_id:sdraft.id,sort_order:4},{id:U(5),series_id:S2.id,content_item_id:sdraft.id,sort_order:1});
window.__MOCK={D:D,log:[],fail:null,sign:[]};
function exec(st){
  const M=window.__MOCK; M.log.push({table:st.table,filters:st.f.map(x=>x.slice(0,2).concat([Array.isArray(x[2])?'[..]':x[2]])),or:st.or,range:st.range});
  if(M.fail==='net') return Promise.reject(new TypeError('Failed to fetch'));
  if(M.fail==='data') return Promise.resolve({data:null,error:{message:'boom'}});
  let rows=(D[st.table]||[]).slice();
  st.f.forEach(([op,k,v])=>{rows=rows.filter(r=>op==='eq'?r[k]===v:v.includes(r[k]))});
  if(st.or){const parts=st.or.split(',').map(p=>/^(\w+)\.ilike\.\*(.*)\*$/.exec(p));rows=rows.filter(r=>parts.some(m=>m&&String(r[m[1]]||'').toLowerCase().includes(m[2].toLowerCase())))}
  st.order.slice().reverse().forEach(([k,o])=>{const asc=o.ascending!==false;rows.sort((a,b)=>{const x=a[k],y=b[k];if(x==null&&y==null)return 0;if(x==null)return 1;if(y==null)return -1;return (x<y?-1:x>y?1:0)*(asc?1:-1)})});
  const total=rows.length; if(st.range) rows=rows.slice(st.range[0],st.range[1]+1); if(st.limit) rows=rows.slice(0,st.limit);
  if(st.single) return Promise.resolve({data:rows[0]||null,error:null});
  return Promise.resolve({data:rows,error:null,count:st.count?total:null});
}
function Q(table){const st={table,f:[],order:[]};const b={select(c,o){st.count=o&&o.count;return b},eq(k,v){st.f.push(['eq',k,v]);return b},in(k,a){st.f.push(['in',k,a]);return b},or(s){st.or=s;return b},order(k,o){st.order.push([k,o||{}]);return b},limit(n){st.limit=n;return b},range(a,z){st.range=[a,z];return b},maybeSingle(){st.single=1;return b},then(a,r){return exec(st).then(a,r)}};return b}
window.supabase={createClient:function(url,key,opts){window.__MOCK.client={url:url,key:key,opts:opts};return{from:Q,storage:{from:function(bucket){return{createSignedUrls:function(paths,exp){window.__MOCK.sign.push({bucket:bucket,paths:paths,exp:exp});return Promise.resolve({data:paths.map(p=>/missing/.test(p)?{path:p,signedUrl:null,error:'Object not found'}:{path:p,signedUrl:'data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20"><rect width="40" height="20" fill="#09c"/></svg>')+'#'+encodeURIComponent(p),error:null}),error:null})}}}}}}};
})();
