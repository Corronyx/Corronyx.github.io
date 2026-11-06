/* cx-groupdesc.js (Агент 3, R13 п.5): описание групп партнёров (до 300 символов), поле description из GET /api/partner-categories (R33).
   Если сервер поля не отдаёт, описаний просто нет и ничего не ломается («не проверено с сервером»). Текст выводится только через textContent. */
(function (g) {
  'use strict';
  var map = {}, loaded = null, listeners = [];
  function base() { return typeof g.CX_API_BASE === 'string' ? g.CX_API_BASE : ''; }
  var G = {
    get: function (key) { return map[key] || ''; },
    all: function () { return map; },
    onLoad: function (f) { listeners.push(f); if (loaded === true) f(map); },
    load: function () {
      if (loaded !== null && loaded !== true) return loaded; if (loaded === true) return Promise.resolve(map);
      loaded = g.fetch(base() + '/api/partner-categories', { headers: { 'X-Lang': (g.CxSession && g.CxSession.lang) ? g.CxSession.lang() : 'ru' } }).then(function (r) { return r.ok ? r.json() : []; }).then(function (rows) {
        (Array.isArray(rows) ? rows : []).forEach(function (r) { if (r && r.key && typeof r.description === 'string' && r.description.trim()) map[String(r.key)] = r.description.trim().slice(0, 300); });
        loaded = true; listeners.forEach(function (f) { try { f(map); } catch (e) {} }); return map;
      }, function () { loaded = true; return map; });
      return loaded;
    }
  };
  g.CxGroupDesc = G;
})(window);
