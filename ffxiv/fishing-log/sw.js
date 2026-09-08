/* No response cache: the notebook and its collection data always use current files. */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
// Notifications are scheduled by the open page. No Push API subscription or background server.
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  event.waitUntil((async()=>{
    const fallback=self.registration.scope,url=new URL(event.notification.data?.url||fallback,fallback);
    if(url.origin!==self.location.origin||!url.pathname.startsWith(new URL(fallback).pathname))return;
    const tabs=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    const tab=tabs.find(t=>new URL(t.url).pathname===url.pathname);
    if(tab){await tab.navigate(url.href);await tab.focus();}else await self.clients.openWindow(url.href);
  })());
});
