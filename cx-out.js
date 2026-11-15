/* cx-out.js (R42): booking happens on the hotel or tour operator site. The guest only sees availability and follows a button.
   Works only when the server reports guest_booking:false (GET /api/public-config); old booking UI is kept for GUEST_BOOKING=on. */
(function(){
  var cfg = null, loadP = null, timer = null;
  function T(k){ return (typeof window.t === 'function') ? window.t(k) : k; }
  function api(){ return (typeof CxApi !== 'undefined') ? CxApi : window.CxApi; }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function safeUrl(u){ try { var x = new URL(String(u)); return (x.protocol === 'https:' && !x.username && !x.password) ? x.href : ''; } catch(e){ return ''; } }
  function ymd(d){ return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); }
  var CxOut = {
    cfg: function(){ return cfg; },
    off: function(){ return !!(cfg && cfg.guest_booking === false); },
    load: function(){
      if(!loadP){
        var A = api(); if(!A) return Promise.resolve(null);
        loadP = A.get('/api/public-config').then(function(c){
          var was = CxOut.off(); cfg = c || {};
          if(CxOut.off() && !was){ try { var C0 = (typeof CX !== 'undefined') ? CX : window.CX; if(C0 && C0.view === 'wizard' && typeof renderWizard === 'function') renderWizard(); } catch(e){} }
          return cfg;
        }).catch(function(){ loadP = null; return null; });
      }
      return loadP;
    },
    /* open the advertiser site first (synchronously, so the browser allows it), then record the click for logged-in people */
    go: function(type, id, url){
      var u = safeUrl(url); if(!u) return false;
      var w = window.open(u, '_blank', 'noopener,noreferrer');
      try { var A = api(); if(A && A.token && A.token()) A.post('/api/outbound', { type: type, id: Number(id) }).catch(function(){}); } catch(e){}
      return !!w;
    },
    goBtn: function(el){ return CxOut.go(el.getAttribute('data-type'), el.getAttribute('data-id'), el.getAttribute('data-url')); },
    button: function(type, id, url, labelKey){
      if(!safeUrl(url)) return '';
      return '<button class="btn btn-primary" style="width:100%;margin-top:10px;" data-type="' + esc(type) + '" data-id="' + esc(id) + '" data-url="' + esc(url) + '" onclick="CxOut.goBtn(this)">' + esc(T(labelKey)) + '</button>'
        + '<div class="cx-out-note" style="color:var(--muted);font-size:12px;margin-top:8px;">' + esc(T('out_notice')) + '</div>';
    },
    hotelBlock: function(h){ return CxOut.button('hotel', h.serverId, h.bookingUrl, 'out_book_hotel'); },
    tourBlock: function(tr){
      var deps = (tr.departures || []).map(function(d){
        var ok = d.seats_booked < d.seats_total;
        return '<div style="display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px solid rgba(128,128,128,.2);"><span>' + esc(String(d.departure_date).slice(0,10)) + '</span><b style="color:' + (ok ? 'var(--gold)' : 'var(--muted)') + '">' + esc(T(ok ? 'out_seats_yes' : 'out_seats_no')) + '</b></div>';
      }).join('');
      return '<div style="margin:8px 0;">' + (deps || '<div style="color:var(--muted)">' + esc(T('tr_no_departures')) + '</div>') + '</div>'
        + '<div style="color:var(--muted);font-size:12px;">' + esc(T('out_check_site')) + '</div>'
        + CxOut.button('touroperator', tr.touroperator_id, tr.touroperator_booking_url, 'out_book_tour');
    },
    /* fill "free/busy" labels under room classes (they carry data-cx-room); called by the observer after every render */
    fillAvail: function(){
      var els = document.querySelectorAll('.cx-avail[data-cx-room]:not([data-cx-done])'); if(!els.length) return;
      var C1 = (typeof CX !== 'undefined') ? CX : window.CX, w = C1 && C1.wizard, h = w && w.hotel; if(!h || !h.serverId) return;
      var ci = (document.getElementById('detailCheckin') || {}).value || w.checkin, co = (document.getElementById('detailCheckout') || {}).value || w.checkout; if(!ci || !co) return;
      var last = new Date(co + 'T00:00:00'); last.setDate(last.getDate() - 1); var to = ymd(last); if(to < ci) to = ci;
      els.forEach(function(e){ e.setAttribute('data-cx-done', '1'); });
      var A = api(); if(!A) return;
      A.get('/api/hotels/' + encodeURIComponent(h.serverId) + '/availability?from=' + encodeURIComponent(ci) + '&to=' + encodeURIComponent(to)).then(function(r){
        var rooms = {}; (r.rooms || []).forEach(function(x){ rooms[String(x.id)] = x; });
        els.forEach(function(e){
          var x = rooms[e.getAttribute('data-cx-room')]; if(!x) return;
          var all = Object.keys(x.free).length > 0 && Object.keys(x.free).every(function(k){ return x.free[k]; });
          e.style.cssText = 'margin-top:6px;font-weight:600;color:' + (all ? 'var(--gold)' : 'var(--muted)');
          e.textContent = T(all ? 'out_free' : 'out_busy') + ' · ' + T('out_check_site');
        });
      }).catch(function(){ els.forEach(function(e){ e.removeAttribute('data-cx-done'); }); });
    }
  };
  window.CxOut = CxOut;
  /* partner and afisha cards: a tap on a link inside [data-cx-contact="partner:ID"] counts as contacting the advertiser (needed for the right to rate) */
  document.addEventListener('click', function(e){
    try {
      var a = e.target && e.target.closest ? e.target.closest('a') : null; if(!a) return;
      var box = a.closest('[data-cx-contact]'); if(!box) return;
      var p = String(box.getAttribute('data-cx-contact')).split(':'), A = api();
      if((p[0] === 'partner' || p[0] === 'afisha') && Number(p[1]) > 0 && A && A.token && A.token()) A.post('/api/outbound', { type: p[0], id: Number(p[1]) }).catch(function(){});
    } catch(err){}
  }, true);
  document.addEventListener('DOMContentLoaded', function(){
    CxOut.load();
    try { new MutationObserver(function(){ clearTimeout(timer); timer = setTimeout(CxOut.fillAvail, 150); }).observe(document.body, { childList: true, subtree: true }); } catch(e){}
  });
})();
