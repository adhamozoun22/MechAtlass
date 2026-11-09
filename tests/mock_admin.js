/* TEST-ONLY mock of supabase-js for the admin panel */
(function(){
const U=n=>'00000000-0000-4000-8000-'+String(n).padStart(12,'0');
const users={'mgr@x.com':{pw:'Password1',id:U(1),email:'mgr@x.com'},'ed@x.com':{pw:'Password1',id:U(2),email:'ed@x.com'},'none@x.com':{pw:'Password1',id:U(3),email:'none@x.com'}};
const D={user_roles:[{id:U(101),user_id:U(1),role:'manager',created_at:'2026-09-01T00:00:00Z'},{id:U(102),user_id:U(2),role:'editor',created_at:'2026-09-02T00:00:00Z'}],
 profiles:[{id:U(1),full_name:'المدير أدهم'},{id:U(2),full_name:'Editor <b>Eve</b>'}],
 series:[{id:'s1',title:'سلسلة الشد',slug:'tensile-series',description:'d',field_id:'f1',created_at:'2026-10-01T00:00:00Z'}],
 series_items:[{id:'si1',series_id:'s1',content_item_id:'a',sort_order:0},{id:'si2',series_id:'s1',content_item_id:'c',sort_order:1}],
 engineering_fields:[{id:'f1',name_ar:'التصنيع',name_en:'Manufacturing'}],content_types:[{id:'t1',name_ar:'مقال',name_en:'Article'}],media_files:[],
 content_blocks:[{id:'b1',content_item_id:'a',block_type:'heading',content:{text:'مقدمة',level:2},sort_order:0},{id:'b2',content_item_id:'a',block_type:'paragraph',content:{text:'نص $x$'},sort_order:1},{id:'b3',content_item_id:'a',block_type:'weird',content:{},sort_order:2}],
 content_items:[{id:'a',title:'مادة 1',slug:'mada-1',summary:'',status:'published',published_at:'2026-10-01T00:00:00Z',updated_at:'2026-10-01T00:00:00Z'},{id:'b',title:'<img src=x onerror=1>',status:'draft',updated_at:'2026-10-02T00:00:00Z'},{id:'c',title:'c',status:'draft',updated_at:'2026-10-03T00:00:00Z'},{id:'d',title:'محذوفة',slug:'d',status:'archived',updated_at:'2026-10-04T00:00:00Z'}]};
const M=window.__MOCK={log:[],invites:[],fail:{},session:null,opts:null,listeners:[],updatedPw:null,reset:[],uploads:[],signCalls:[],D:D};
function role(uid,r){return D.user_roles.some(x=>x.user_id===uid&&x.role===r)}
let nid=1000;
function Q(table){const f=[];let ord=null,lim=null,cnt=false,head=false,op='select',single=false,vals=null,sel=false;
 const b={select(c,o){sel=true;if(o&&o.count)cnt=true;if(o&&o.head)head=true;return b},eq(k,v){f.push(['eq',k,v]);return b},neq(k,v){f.push(['neq',k,v]);return b},in(k,v){f.push(['in',k,v]);return b},order(k,o){ord=[k,o];return b},limit(n){lim=n;return b},maybeSingle(){single=true;return b},single(){single=true;return b},delete(){op='delete';return b},insert(v){op='insert';vals=v;return b},update(v){op='update';vals=v;return b},
 then(res,rej){M.log.push({table,op,filters:f.slice(),vals});
  const R=x=>Promise.resolve(x).then(res,rej);
  try{let rows=D[table]=D[table]||[];if(!M.session)return R({data:null,error:{message:'no session'}});
   if(M.fail[table]||M.fail[table+'_'+op])return R({data:null,error:{message:'boom'}});
   if(op==='insert'){const arr=Array.isArray(vals)?vals:[vals];if((table==='content_items'||table==='series')&&arr.some(v=>rows.some(r=>r.slug===v.slug)))return R({data:null,error:{code:'23505',message:'dup'}});
    const made=arr.map(v=>Object.assign({id:'n'+(++nid)},v));D[table]=rows.concat(made);return R({data:sel?(single?made[0]:made):null,error:null})}
   rows=rows.filter(r=>f.every(([t,k,v])=>t==='eq'?r[k]===v:t==='neq'?r[k]!==v:v.includes(r[k])));
   if(op==='update'&&(table==='series'||table==='content_items')&&vals.slug&&D[table].some(r=>r.slug===vals.slug&&!rows.includes(r)))return R({data:null,error:{code:'23505',message:'dup'}});
   if(op==='update'){if(!M.noUpdate)rows.forEach(r=>Object.assign(r,vals));const hit=M.noUpdate?[]:rows;return R({data:sel?hit.map(r=>({id:r.id})):null,error:null})}
   if(op==='delete'){if(!M.noDelete)D[table]=D[table].filter(r=>!rows.includes(r));const hit=M.noDelete?[]:rows;return R({data:sel?hit.map(r=>({id:r.id})):null,error:null})}
   if(ord)rows=[...rows].sort((a,c)=>(a[ord[0]]>c[ord[0]]?1:-1)*(ord[1]&&ord[1].ascending===false?-1:1));if(lim)rows=rows.slice(0,lim);
   const out={data:head?null:(single?(rows[0]||null):rows),error:null};if(cnt)out.count=rows.length;return R(out)}catch(e){return Promise.reject(e).then(res,rej)}}};return b}
function sess(u){return {user:{id:u.id,email:u.email}}}
const client={auth:{
 async getSession(){return {data:{session:M.session},error:null}},
 onAuthStateChange(cb){M.listeners.push(cb);return {data:{subscription:{unsubscribe(){}}}}},
 async signInWithPassword({email,password}){M.log.push({auth:'signIn',email});const u=users[email];if(!u||u.pw!==password)return {data:{session:null,user:null},error:{message:'Invalid login credentials'}};M.session=sess(u);return {data:{session:M.session,user:M.session.user},error:null}},
 async signOut(o){M.log.push({auth:'signOut',scope:o&&o.scope});M.session=null;M.listeners.forEach(c=>c('SIGNED_OUT'));return {error:null}},
 async updateUser(o){M.updatedPw=o.password;return {data:{},error:null}},
 async resetPasswordForEmail(e,o){M.reset.push([e,o]);return {data:{},error:null}}},
 rpc(n){M.log.push({rpc:n});const id=M.session&&M.session.user.id;if(M.fail.rpc)return Promise.resolve({data:null,error:{message:'x'}});const r=n==='is_academy_manager'?role(id,'manager'):role(id,'editor');return Promise.resolve({data:!!id&&r,error:null})},
 from:Q,
 storage:{from(bk){return {async upload(p,file,o){M.log.push({upload:p,bucket:bk,type:o&&o.contentType,size:file.size});if(M.fail.upload)return {data:null,error:{message:'x'}};M.uploads.push({p,type:o.contentType,size:file.size});return {data:{path:p},error:null}},async createSignedUrls(ps,sec){M.signCalls.push(ps);return {data:ps.map(p=>({path:p,signedUrl:'https://krifmzrzzytdstjrbbtq.supabase.co/storage/v1/object/sign/'+bk+'/'+p+'?token=t',error:null})),error:null}}}}},
 functions:{async invoke(n,o){M.log.push({fn:n,body:o.body});if(!(M.session&&role(M.session.user.id,'manager')))return {data:null,error:{message:'forbidden'}};if(M.fail.invite)return {data:null,error:{message:'boom'}};M.invites.push(o.body.email);D.user_roles.push({id:U(200+M.invites.length),user_id:U(50+M.invites.length),role:'editor',created_at:'2026-11-03T00:00:00Z'});return {data:{ok:true},error:null}}}};
window.supabase={createClient(u,k,o){M.url=u;M.key=k;M.opts=o;if(window.__PRE&&!M.session)M.session=sess(users[window.__PRE]);return client}};
})();
