import os, re, urllib.request, urllib.parse, sys
from html.parser import HTMLParser
base='https://cavalcanteprofissional.github.io/portfolio/'
dir='recovery_site'
os.makedirs(dir, exist_ok=True)

def fetch(url, outpath):
    try:
        req=urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data=resp.read()
        os.makedirs(os.path.dirname(outpath), exist_ok=True)
        with open(outpath,'wb') as f: f.write(data)
        print('OK', url)
        return True
    except Exception as e:
        print('ERR', url, e)
        return False

# Fetch index
if not fetch(base, os.path.join(dir,'index.html')):
    print('Failed to download index.html; aborting')
    sys.exit(1)
html = open(os.path.join(dir,'index.html'),'rb').read().decode('utf-8',errors='ignore')
class P(HTMLParser):
    def __init__(self):
        super().__init__(); self.urls=[]
    def handle_starttag(self, tag, attrs):
        for k,v in attrs:
            if k in ('src','href') and v:
                self.urls.append(v)
p=P(); p.feed(html)
urls=set()
for u in p.urls:
    if u.startswith('http'):
        urls.add(u)
    elif u.startswith('/'):
        urls.add(urllib.parse.urljoin(base, u))
    else:
        urls.add(urllib.parse.urljoin(base, u))

for u in sorted(urls):
    parsed=urllib.parse.urlparse(u)
    path=parsed.path.lstrip('/')
    if path=='' or path.endswith('/'):
        path = os.path.join(path, 'index.html') if path else 'index.html'
    out=os.path.join(dir, path)
    fetch(u,out)

# search for sourceMappingURL in downloaded files
import glob
maps_found=set()
for filepath in glob.glob(dir+'/**/*.*', recursive=True):
    if filepath.endswith(('.js','.css','.html')):
        try:
            with open(filepath,'r',errors='ignore') as f:
                txt=f.read()
        except:
            continue
        for m in re.findall(r'sourceMappingURL=([^\s\"\']+)', txt):
            mapurl = m if m.startswith('http') else urllib.parse.urljoin(base, m)
            outpath = os.path.join(dir, urllib.parse.urlparse(mapurl).path.lstrip('/'))
            if fetch(mapurl, outpath):
                maps_found.add(outpath)

# Summary
count=0
for root,dirs,files in os.walk(dir):
    for f in files:
        count+=1
print('\nSUMMARY: files_downloaded=',count)
if maps_found:
    print('Sourcemaps found:')
    for m in maps_found:
        print(' -', m)
else:
    print('No sourcemaps found')
