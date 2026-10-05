"""Recopila candidatas públicas. No publica imágenes ni modifica decisiones."""
import concurrent.futures, hashlib, html, ipaddress, json, re, socket, threading, time, unicodedata
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit
from urllib.request import Request, build_opener, HTTPRedirectHandler
from urllib.robotparser import RobotFileParser
from urllib.error import HTTPError

ROOT=Path(__file__).resolve().parents[2]
WORK=ROOT/'.revision-fotos'
WORK.mkdir(exist_ok=True)
CACHE=WORK/'paginas'
CACHE.mkdir(exist_ok=True)
ROWS=json.loads((WORK/'pendientes.json').read_text())
SEED=json.loads((ROOT/'scripts/revision-fotos/candidatas.json').read_text())
if (WORK/'candidatas.json').exists() and (WORK/'seleccion.json').exists():
 previous=json.loads((WORK/'candidatas.json').read_text())
 decisions=json.loads((WORK/'seleccion.json').read_text())
 keep={r['idLab']:r for r in SEED}
 keep.update({r['idLab']:r for r in previous if decisions.get(str(r['idLab']),{}).get('estado')=='aprobado'})
 SEED=list(keep.values())
LOCK=threading.Lock()
HOSTS={}
ROBOTS={}
OUTPUT={}
STOP={'laboratorio','laboratorios','unidad','investigacion','analisis','nacional','universitario','unam','para','sistemas','centro','apoyo','estudios','servicios','especializados','especializada','del','las','los','con','una','por','de','en','y','e','la','el'}
def plain(s):
 return ''.join(c for c in unicodedata.normalize('NFD',s.lower()) if unicodedata.category(c)!='Mn')
def tokens(s): return set(re.findall(r'[a-z0-9]{3,}',plain(s)))-STOP
def safe(url):
 u=urlsplit(url)
 if u.scheme not in ('http','https') or not u.hostname or u.username or u.password: raise ValueError('Dirección no válida')
 if u.port not in (None,80,443):raise ValueError('Puerto no público')
 for addr in socket.getaddrinfo(u.hostname,u.port or 443,type=socket.SOCK_STREAM):
  if not ipaddress.ip_address(addr[4][0]).is_global:raise ValueError('Dirección no pública')
 return url
class Redirect(HTTPRedirectHandler):
 def redirect_request(self,req,fp,code,msg,headers,newurl):
  safe(newurl)
  return super().redirect_request(req,fp,code,msg,headers,newurl)
def request(url):
 safe(url)
 with build_opener(Redirect).open(Request(url,headers={'User-Agent':'LabUNAM-ImageReview/1.0'}),timeout=9) as r:
  data=r.read(2500001)
  if len(data)>2500000:raise ValueError('Página demasiado grande')
  return data.decode(r.headers.get_content_charset() or 'utf-8','replace'),r.url
def allowed(url):
 u=urlsplit(url);origin=u.scheme+'://'+u.netloc
 with LOCK: check=ROBOTS.get(origin)
 if check is None:
  rp=RobotFileParser()
  try:
   data,_=request(origin+'/robots.txt');rp.parse(data.splitlines());check=rp
  except HTTPError as e: check=False if e.code in (401,403) else True
  except Exception: check=True
  with LOCK:ROBOTS[origin]=check
 return check if isinstance(check,bool) else check.can_fetch('LabUNAM-ImageReview',url)
def fetch(url):
 key=hashlib.sha256(url.encode()).hexdigest()
 file=CACHE/(key+'.json')
 if file.exists():return json.loads(file.read_text())
 with LOCK: sem=HOSTS.setdefault(urlsplit(url).hostname,threading.Semaphore(2))
 with sem:
  try:
   if not allowed(url):raise ValueError('Excluida por robots.txt')
   body,final=request(url);result={'body':body,'url':final,'error':''}
  except Exception as e:result={'body':'','url':url,'error':type(e).__name__+': '+str(e)[:120]}
 file.write_text(json.dumps(result,ensure_ascii=False))
 return result
class Page(HTMLParser):
 def __init__(self,base):super().__init__();self.base=base;self.images=[];self.links=[];self.anchor=None;self.title='';self.in_title=False
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='title':self.in_title=True
  if tag=='a':self.anchor={'url':urljoin(self.base,a.get('href','')),'text':''}
  if tag=='img':
   src=a.get('data-src') or a.get('data-lazy-src') or a.get('src','')
   ss=a.get('data-srcset') or a.get('srcset','')
   if ss:
    opts=[x.strip().split() for x in ss.split(',')]
    opts=[x for x in opts if len(x)==2 and re.match(r'^\d+w$',x[1])]
    if opts:src=max(opts,key=lambda x:int(x[1][:-1]))[0]
   self.add(src,a.get('alt',''),a.get('width',''),a.get('height',''))
  if tag=='meta' and (a.get('property')=='og:image' or a.get('name')=='twitter:image'):self.add(a.get('content',''),'Imagen para compartir')
  for src in re.findall(r'url\([\'"]?([^\)\'"]+)',a.get('style','')):self.add(src,'Fondo de página')
 def add(self,src,alt,w='',h=''):
  if src and not src.startswith('data:'):self.images.append({'url':urljoin(self.base,html.unescape(src)),'alt':alt,'ancho':int(w) if str(w).isdigit() else 0,'alto':int(h) if str(h).isdigit() else 0})
 def handle_data(self,data):
  if self.anchor:self.anchor['text']+=data
  if self.in_title:self.title+=data
 def handle_endtag(self,tag):
  if tag=='title':self.in_title=False
  if tag=='a' and self.anchor:self.links.append(self.anchor);self.anchor=None
def normalize(raw):
 raw=(raw or '').strip()
 if not raw:return ''
 if not re.match(r'^https?://',raw,re.I):raw='https://'+raw
 u=urlsplit(raw)
 return urlunsplit((u.scheme.lower(),u.netloc.lower(),u.path or '/',u.query,''))
COUNTS={}
for r in ROWS:
 url=normalize(r.get('webLab'))
 if url:COUNTS[url]=COUNTS.get(url,0)+1
def scan(row):
 id=row['idLab'];name=row['labNombre'].strip();url=normalize(row.get('webLab'))
 if not url and int(row.get('marcaAutorizaInfoWeb') or 0)==2:url='https://labunam.unam.mx/micrositio/index.php?il='+str(id)
 result={'idLab':id,'nombre':name,'origen':url,'urlFinal':url,'estado':'Sin candidata en esta revisión','nota':'','imagenes':[],'autorizacion':'Raúl informa autorización del Dr. José Sámano para usar imágenes de las páginas de los laboratorios; selección editorial pendiente.'}
 if not url:result['nota']='Sin sitio web registrado; pendiente de localizar una fuente.';return result
 if any(h in (urlsplit(url).hostname or '') for h in ['facebook.com','youtube.com','youtu.be','instagram.com','twitter.com','x.com','drive.google.com']):
  result['nota']='El enlace registrado corresponde a una red social, vídeo o archivo; requiere revisión manual.';return result
 data=fetch(url)
 if data['error']:result['nota']='No se pudo revisar el sitio: '+data['error'];return result
 page=Page(data['url']);page.feed(data['body'])
 wanted=tokens(name)
 match=lambda text:len(wanted & tokens(text))
 specific=match(page.title)>=min(2,max(1,len(wanted))) or (COUNTS.get(url,0)==1 and urlsplit(data['url']).path not in ('','/','/index.html','/index.php'))
 # Una portada compartida sólo sirve como índice para localizar páginas específicas.
 if not specific:
  links=sorted([a for a in page.links if urlsplit(a['url']).hostname==urlsplit(data['url']).hostname and match(a['text'])>=min(2,max(1,len(wanted)))],key=lambda a:match(a['text']),reverse=True)
  for link in links[:2]:
   sub=fetch(link['url'])
   if not sub['error']:
    subpage=Page(sub['url']);subpage.feed(sub['body'])
    if match(subpage.title+' '+link['text'])>=min(2,max(1,len(wanted))):
     page=subpage;data=sub;specific=True;break
 # Dominio dedicado con un laboratorio en su título.
 if not specific and COUNTS.get(url,0)==1 and ('laborator' in plain(page.title) or match(page.title)>=1):specific=True
 result['urlFinal']=data['url']
 if not specific:
  result['nota']='La dirección es general o compartida. No se encontró una página específica con suficiente coincidencia; no se asignan sus imágenes.';return result
 pool={}
 for image in page.images:
  u=image['url'];text=plain(u+' '+image['alt']);label=plain(urlsplit(u).path+' '+image['alt'])
  if urlsplit(u).scheme not in ('http','https'):continue
  if 'static.wixstatic.com/media/' in u and '/v1/' in u:
   u=u.split('/v1/')[0];image['url']=u
  if 'sites.google.com/sitesv-images' in u:
   u=re.sub(r'=w\d+$','=w1280',u);image['url']=u
  if re.search(r'icon[o_-]|favicon|escudo|banner|facebook|twitter|instagram|whatsapp|youtube|captcha|spinner|loading|aviso|privacidad|unam[_\-.]|logo[-_/]*(unam|facultad|instituto|footer)|footer|menu|profile.image',label):continue
  if re.search(r'counter|tracking|pixel|analytics',u,re.I):continue
  imagehost=urlsplit(u).hostname or ''
  sourcehost=urlsplit(data['url']).hostname or ''
  if imagehost!=sourcehost and not (imagehost.endswith('.unam.mx') or imagehost.endswith('.wixstatic.com') or imagehost.endswith('.googleusercontent.com') or imagehost in ('sites.google.com','images.squarespace-cdn.com')):continue
  if re.search(r'\.(svg|gif)(\?|$)',u,re.I):continue
  if (image['ancho'] and image['ancho']<180) or (image['alto'] and image['alto']<100):continue
  logo=bool(re.search(r'logo|logotipo',text))
  score=match(text)*5+(0 if logo else 3)+(2 if re.search(r'laborat|instala|infraestr|equipo|galer|lab[_/-]',text) else 0)
  if re.search(r'notici|evento|cartel|convoc|curso|flyer|poster|news',text):score-=6
  if score<0:continue
  pool[u]={**image,'id':str(id)+'-'+hashlib.sha256(u.encode()).hexdigest()[:12],'tipo':'logo' if logo else 'foto','puntuacion':score}
 photos=sorted([i for i in pool.values() if i['tipo']=='foto'],key=lambda i:i['puntuacion'],reverse=True)
 logos=sorted([i for i in pool.values() if i['tipo']=='logo'],key=lambda i:i['puntuacion'],reverse=True)
 result['imagenes']=(photos[:3] if photos else logos[:3])
 result['alternativasLogo']=logos[:2] if photos else []
 result['origen']=data['url']
 result['estado']='Candidatas para revisión' if result['imagenes'] else 'Sin candidata en esta revisión'
 result['nota']='Preselección automática de una página relacionada. Confirma que cada imagen corresponde a este laboratorio.' if photos else ('Logos candidatos: confirmar que son propios del laboratorio, no de la institución.' if logos else 'Página revisada sin imágenes específicas aprovechables detectadas.')
 return result
def save():
 seed={r['idLab']:r for r in SEED}
 # Las opciones existentes del piloto conservan IDs y decisiones.
 for id,r in OUTPUT.items():
  if id not in seed or not seed[id]['imagenes']:seed[id]=r
 target=WORK/'candidatas.json';temp=target.with_suffix('.nuevo')
 temp.write_text(json.dumps(sorted(seed.values(),key=lambda r:(not bool(r['imagenes']),r['idLab'])),ensure_ascii=False,indent=2));temp.replace(target)
 report={'revisados':len(OUTPUT),'objetivo':len(ROWS),'conCandidatas':sum(bool(r['imagenes']) for r in OUTPUT.values()),'imagenes':sum(len(r['imagenes']) for r in OUTPUT.values())}
 (WORK/'progreso.json').write_text(json.dumps(report))
 print(json.dumps(report),flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
 futures={pool.submit(scan,r):r for r in ROWS}
 for future in concurrent.futures.as_completed(futures):
  row=futures[future]
  try:result=future.result()
  except Exception as e:result={'idLab':row['idLab'],'nombre':row['labNombre'],'origen':normalize(row.get('webLab')),'imagenes':[],'nota':'Revisión pendiente: '+type(e).__name__}
  OUTPUT[row['idLab']]=result
  if len(OUTPUT)%20==0:save()
save()
