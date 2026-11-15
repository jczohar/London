const V="london-20261115-01";
const SHELL=["./","index.html","manifest.json","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x.startsWith("london-")).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("message",e=>{if(e.data==="skip")self.skipWaiting()});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  const netFirst=r.mode==="navigate"||u.hostname.includes("open-meteo")||u.hostname.includes("er-api");
  if(netFirst){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(k=>k.put(r,c));return x}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));return}
  e.respondWith(caches.match(r).then(m=>{const f=fetch(r).then(x=>{if(x&&(x.ok||x.type==="opaque")){const c=x.clone();caches.open(V).then(k=>k.put(r,c))}return x}).catch(()=>m);return m||f}))});
