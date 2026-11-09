import http.server, socketserver, os, sys, re, threading, json, time
ROOT=sys.argv[1]; PORT=int(sys.argv[2]); LOG=sys.argv[3] if len(sys.argv)>3 else None
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(s,*a,**k): super().__init__(*a,directory=ROOT,**k)
    def log_message(s,f,*a):
        if LOG: open(LOG,'a').write(json.dumps({'p':s.path,'r':s.headers.get('Range'),'c':s.command})+'\n')
    def send_head(s):
        path=s.translate_path(s.path)
        rng=s.headers.get('Range')
        if os.path.isfile(path) and path.endswith(('.mp4','.webm')):
            size=os.path.getsize(path); st,en=0,size-1; code=200
            if rng:
                m=re.match(r'bytes=(\d*)-(\d*)',rng)
                if m:
                    if m.group(1)!='': st=int(m.group(1))
                    if m.group(2)!='': en=min(int(m.group(2)),size-1)
                    if m.group(1)=='' and m.group(2)!='': st=max(0,size-int(m.group(2))); en=size-1
                    code=206
            f=open(path,'rb'); f.seek(st)
            s.send_response(code); s.send_header('Content-Type','video/webm' if path.endswith('.webm') else 'video/mp4'); s.send_header('Accept-Ranges','bytes')
            s.send_header('Content-Length',str(en-st+1))
            if code==206: s.send_header('Content-Range',f'bytes {st}-{en}/{size}')
            s.end_headers(); s._left=en-st+1; return f
        return super().send_head()
    def copyfile(s,src,dst):
        left=getattr(s,'_left',None)
        try:
            if left is None: return super().copyfile(src,dst)
            while left>0:
                b=src.read(min(65536,left))
                if not b:break
                dst.write(b); left-=len(b); time.sleep(0.003)
        except (BrokenPipeError,ConnectionResetError): pass
        finally: s._left=None
class T(socketserver.ThreadingMixIn,http.server.HTTPServer): daemon_threads=True; allow_reuse_address=True
T(('127.0.0.1',PORT),H).serve_forever()
