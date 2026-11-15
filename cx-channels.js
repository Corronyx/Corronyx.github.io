/* cx-channels.js (R42): shows only the contact channels the admin has switched on for this site, and counts one visit per tab session (numbers only, no personal data).
   Usage: <script src="cx-channels.js" data-scope="client|hotel|partner|afisha|tour"></script> */
(function(){
  var me = document.currentScript, scope = me && me.getAttribute('data-scope');
  var NAMES = { telegram: 'Telegram', vk: 'VK', max: 'MAX', instagram: 'Instagram', tiktok: 'TikTok' };
  function api(){ return (typeof CxApi !== 'undefined') ? CxApi : window.CxApi; }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function safe(u){ try { var x = new URL(String(u)); return (x.protocol === 'https:' && !x.username && !x.password) ? x.href : ''; } catch(e){ return ''; } }
  function link(c){
    if(c.kind === 'email') return /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(c.value) ? { href: 'mailto:' + c.value, text: c.value } : null;
    if(c.kind === 'phone') return /^\+?[0-9 ()\-]{5,24}$/.test(c.value) ? { href: 'tel:' + c.value.replace(/[^0-9+]/g, ''), text: c.value } : null;
    var h = safe(c.value); return (h && NAMES[c.kind]) ? { href: h, text: NAMES[c.kind], ext: true } : null;
  }
  function html(list){
    return list.map(link).filter(Boolean).map(function(l){
      return '<a href="' + esc(l.href) + '"' + (l.ext ? ' target="_blank" rel="noopener noreferrer"' : '') + ' style="margin:0 8px;color:inherit;text-decoration:underline;">' + esc(l.text) + '</a>';
    }).join('');
  }
  function render(list){
    var h = html(list || []), el = document.getElementById('cxChannels');
    if(!h){ if(el) el.remove(); return; }
    if(!el){ el = document.createElement('div'); el.id = 'cxChannels'; el.style.cssText = 'text-align:center;padding:14px 10px;font-size:14px;'; var f = document.querySelector('footer'); if(f) f.appendChild(el); else document.body.appendChild(el); }
    el.innerHTML = h;
  }
  function start(){
    var A = api(); if(!A || !scope) return;
    try { if(!sessionStorage.getItem('cx_visit_' + scope)) { sessionStorage.setItem('cx_visit_' + scope, '1'); A.post('/api/visit', { scope: scope }).catch(function(){}); } } catch(e){}
    A.get('/api/site-channels?scope=' + encodeURIComponent(scope)).then(function(r){ render(r && r.channels); }).catch(function(){});
  }
  window.CxChannels = { html: html, render: render, start: start };
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
