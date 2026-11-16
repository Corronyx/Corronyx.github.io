/* cx-admin-site.js (R42): admin sections "Client site" (visits, registrations, contact channels) and "Tour operators",
   plus contact-channel boxes (Telegram, VK, MAX, Instagram, TikTok, email, phone) for every site; the admin switches each channel on or off.
   The admin panel is RU/EN only, so texts are kept here in those two languages. */
(function(){
  var D = {
    ru: { client: 'Клиентский сайт', hotel: 'Отели', partner: 'Сервисы города', afisha: 'Афиша', tour: 'Туроператоры',
      chTitle: 'Каналы связи сайта', chHint: 'Канал виден на сайте только после включения. Пока не включён, его никто не видит.', save: 'Сохранить', on: 'Включить', off: 'Отключить', stOn: 'Включён', stOff: 'Выключен', saved: 'Сохранено',
      bad_channel_value: 'Неверная ссылка, почта или телефон', channel_empty: 'Сначала укажите значение', err: 'Не удалось сохранить', mail: 'Почта', phone: 'Телефон',
      statTitle: 'Посещаемость и регистрации', statHint: 'Только числа, без личных данных. Уникальные посетители считаются по необратимому хэшу.', days: 'дней', site: 'Сайт', visits: 'Визиты', uniques: 'Уникальные', day: 'День',
      regs: 'Новые регистрации за период', total: 'Итого', load: 'Загрузка…', none: 'Данных пока нет', opTitle: 'Туроператоры', opName: 'Название', opCity: 'Город', opStatus: 'Статус', opUrl: 'Сайт для бронирования', opNoUrl: 'не указан (карточка скрыта)', approve: 'Одобрить', pause: 'Приостановить', opEmpty: 'Туроператоров пока нет' },
    en: { client: 'Client site', hotel: 'Hotels', partner: 'City services', afisha: 'Afisha', tour: 'Tour operators',
      chTitle: 'Site contact channels', chHint: 'A channel is visible on the site only after you switch it on.', save: 'Save', on: 'Switch on', off: 'Switch off', stOn: 'On', stOff: 'Off', saved: 'Saved',
      bad_channel_value: 'Invalid link, email or phone', channel_empty: 'Enter a value first', err: 'Could not save', mail: 'Email', phone: 'Phone',
      statTitle: 'Traffic and registrations', statHint: 'Numbers only, no personal data. Unique visitors are counted by an irreversible hash.', days: 'days', site: 'Site', visits: 'Visits', uniques: 'Unique', day: 'Day',
      regs: 'New registrations in the period', total: 'Total', load: 'Loading…', none: 'No data yet', opTitle: 'Tour operators', opName: 'Name', opCity: 'City', opStatus: 'Status', opUrl: 'Booking website', opNoUrl: 'not set (listing hidden)', approve: 'Approve', pause: 'Pause', opEmpty: 'No tour operators yet' }
  };
  var KINDS = ['telegram', 'vk', 'max', 'instagram', 'tiktok', 'email', 'phone'];
  var PH = { telegram: 'https://t.me/…', vk: 'https://vk.com/…', max: 'https://max.ru/…', instagram: 'https://instagram.com/…', tiktok: 'https://www.tiktok.com/@…', email: 'name@domain.ru', phone: '+7 …' };
  var BRAND = { telegram: 'Telegram', vk: 'VK', max: 'MAX', instagram: 'Instagram', tiktok: 'TikTok' };
  function lang(){ var l = ''; try { l = (typeof LANG !== 'undefined' && LANG) || ''; } catch(e){} if(!l){ try { l = (localStorage.getItem('cx_lang') || '').replace(/"/g, ''); } catch(e){} } if(!l) l = document.documentElement.lang; return String(l || 'ru').slice(0, 2) === 'en' ? 'en' : 'ru'; }
  function T(k){ return D[lang()][k] || D.ru[k] || k; }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function api(){ return (typeof CxApi !== 'undefined') ? CxApi : window.CxApi; }
  function kindLabel(k){ return BRAND[k] || T(k === 'email' ? 'mail' : 'phone'); }
  function errText(e){ var c = e && e.payload && e.payload.error; return D[lang()][c] || T('err'); }
  var cache = null;
  function loadAll(force){ if(cache && !force) return Promise.resolve(cache); return api().get('/api/admin/site-channels').then(function(r){ cache = r || []; return cache; }); }
  function rowHtml(scope, kind, row){
    var on = !!(row && row.enabled), v = row ? row.value : '';
    return '<div data-cxa-row="' + scope + ':' + kind + '" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px;">'
      + '<b style="width:90px;">' + esc(kindLabel(kind)) + '</b>'
      + '<input data-cxa-val maxlength="300" placeholder="' + esc(PH[kind]) + '" value="' + esc(v) + '" style="flex:1;min-width:200px;">'
      + '<button type="button" class="btn btn-ghost" data-cxa-save>' + esc(T('save')) + '</button>'
      + '<span data-cxa-state style="min-width:80px;font-weight:600;color:' + (on ? 'var(--gold)' : 'var(--muted)') + '">' + esc(T(on ? 'stOn' : 'stOff')) + '</span>'
      + '<button type="button" class="btn btn-primary" data-cxa-toggle data-on="' + (on ? 1 : 0) + '">' + esc(T(on ? 'off' : 'on')) + '</button>'
      + '<span data-cxa-msg style="font-size:12px;"></span></div>';
  }
  function bind(box, scope){
    box.querySelectorAll('[data-cxa-row]').forEach(function(row){
      var kind = row.getAttribute('data-cxa-row').split(':')[1], inp = row.querySelector('[data-cxa-val]'), msg = row.querySelector('[data-cxa-msg]');
      function send(body, okMsg){
        body.scope = scope; body.kind = kind; msg.style.color = 'var(--muted)'; msg.textContent = '';
        return api().put('/api/admin/site-channels', body).then(function(r){
          cache = null; msg.style.color = 'var(--gold)'; msg.textContent = T('saved');
          var st = row.querySelector('[data-cxa-state]'), tg = row.querySelector('[data-cxa-toggle]');
          st.textContent = T(r.enabled ? 'stOn' : 'stOff'); st.style.color = r.enabled ? 'var(--gold)' : 'var(--muted)';
          tg.setAttribute('data-on', r.enabled ? 1 : 0); tg.textContent = T(r.enabled ? 'off' : 'on'); inp.value = r.value; return true;
        }).catch(function(e){ msg.style.color = '#c0392b'; msg.textContent = errText(e); return false; });
      }
      row.querySelector('[data-cxa-save]').onclick = function(){ return send({ value: inp.value }); };
      row.querySelector('[data-cxa-toggle]').onclick = function(){ var on = this.getAttribute('data-on') === '1'; return send({ value: inp.value, enabled: !on }); };
    });
  }
  function mountChannels(box){
    var scope = box.getAttribute('data-cxa-ch'); if(!scope) return Promise.resolve();
    return loadAll(true).then(function(all){
      var rows = {}; all.forEach(function(r){ if(r.scope === scope) rows[r.kind] = r; });
      box.innerHTML = '<div style="border:1px solid var(--line);border-radius:12px;padding:14px;margin:12px 0;max-width:900px;"><div style="font-weight:700;margin-bottom:4px;">' + esc(T('chTitle')) + ' · ' + esc(T(scope)) + '</div><div style="color:var(--muted);font-size:13px;margin-bottom:10px;">' + esc(T('chHint')) + '</div>'
        + KINDS.map(function(k){ return rowHtml(scope, k, rows[k]); }).join('') + '</div>';
      bind(box, scope);
    }).catch(function(){ box.innerHTML = ''; });
  }
  function loadStats(box, days){
    box.innerHTML = '<div style="color:var(--muted)">' + esc(T('load')) + '</div>';
    return api().get('/api/admin/site-stats?days=' + days).then(function(s){
      var sites = ['client', 'hotel', 'partner', 'afisha', 'tour'];
      var sel = [7, 30, 90].map(function(n){ return '<button type="button" class="btn ' + (n === days ? 'btn-primary' : 'btn-ghost') + '" data-cxa-days="' + n + '">' + n + ' ' + esc(T('days')) + '</button>'; }).join(' ');
      var tot = sites.map(function(k){ return '<tr><td>' + esc(T(k)) + '</td><td>' + s.totals[k].visits + '</td><td>' + s.totals[k].uniques + '</td></tr>'; }).join('');
      var byDay = {}; (s.visits || []).forEach(function(v){ (byDay[v.day] = byDay[v.day] || {})[v.scope] = v; });
      var dayRows = Object.keys(byDay).sort().reverse().slice(0, 31).map(function(d){ return '<tr><td>' + esc(d) + '</td>' + sites.map(function(k){ var v = byDay[d][k]; return '<td>' + (v ? v.visits + ' / ' + v.uniques : '0') + '</td>'; }).join('') + '</tr>'; }).join('');
      var rg = {}; (s.registrations || []).forEach(function(r){ rg[r.role] = (rg[r.role] || 0) + r.n; });
      var rgRows = Object.keys(rg).map(function(r){ return '<tr><td>' + esc(r) + '</td><td>' + rg[r] + '</td></tr>'; }).join('');
      box.innerHTML = '<div style="font-weight:700;margin:6px 0;">' + esc(T('statTitle')) + '</div><div style="color:var(--muted);font-size:13px;margin-bottom:8px;">' + esc(T('statHint')) + '</div><div style="margin-bottom:10px;">' + sel + '</div>'
        + '<div class="table-wrap"><table><thead><tr><th>' + esc(T('site')) + '</th><th>' + esc(T('visits')) + '</th><th>' + esc(T('uniques')) + '</th></tr></thead><tbody>' + tot + '</tbody></table></div>'
        + '<div class="table-wrap" style="margin-top:12px;"><table><thead><tr><th>' + esc(T('day')) + '</th>' + sites.map(function(k){ return '<th>' + esc(T(k)) + '</th>'; }).join('') + '</tr></thead><tbody>' + (dayRows || '<tr><td colspan="6">' + esc(T('none')) + '</td></tr>') + '</tbody></table></div>'
        + '<div style="font-weight:700;margin:14px 0 6px;">' + esc(T('regs')) + ': ' + s.registrations_total + '</div><div class="table-wrap"><table><tbody>' + (rgRows || '<tr><td>' + esc(T('none')) + '</td></tr>') + '</tbody></table></div>';
      box.querySelectorAll('[data-cxa-days]').forEach(function(b){ b.onclick = function(){ loadStats(box, Number(b.getAttribute('data-cxa-days'))); }; });
    }).catch(function(){ box.innerHTML = '<div style="color:#c0392b">' + esc(T('err')) + '</div>'; });
  }
  var CxAdminSite = {
    T: T, mountChannels: mountChannels, loadStats: loadStats,
    onNav: function(section){
      var sec = document.getElementById('sec-' + section); if(!sec) return;
      sec.querySelectorAll('[data-cxa-ch]').forEach(function(b){ mountChannels(b); });
      if(section === 'client'){ var s = document.getElementById('cxaStats'); if(s) loadStats(s, 30); }
    },
    titles: function(){ document.querySelectorAll('[data-cxa-title]').forEach(function(e){ e.textContent = T(e.getAttribute('data-cxa-title')); }); }
  };
  window.CxAdminSite = CxAdminSite;
})();
