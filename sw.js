const C='nomato-fit-v21';
self.addEventListener('install',e=>{ self.skipWaiting(); e.waitUntil(caches.open(C).then(c=>c.addAll(['./icon-192.png','./icon-512.png','./apple-touch-icon.png','./manifest.webmanifest'])).catch(()=>{})); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin!==location.origin) return; // CDN/Firebase/YouTube: passthrough
  if(req.mode==='navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('index.html')){
    e.respondWith(fetch(req).catch(()=>caches.match('./icon-192.png'))); // siempre red para el HTML
    return;
  }
  e.respondWith(caches.match(req).then(m=>m||fetch(req)));
});
