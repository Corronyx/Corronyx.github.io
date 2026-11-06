/* cx-map.js (Агент 3, R13 п.2): кнопка «Проложить маршрут». Карта по СТРАНЕ ОБЪЕКТА: РФ -> Яндекс Карты, иначе Google Maps.
   Страна: поле country объекта; если нет, страна, выбранная гостем; иначе Google. Есть координаты lat/lng -> маршрут к точке; нет -> по адресу; нет ни того ни другого -> кнопки нет.
   API: CxMap.url(obj, opts) -> {url, provider} | null; CxMap.html(obj, opts) -> строка HTML (все значения экранированы) или ''. */
(function (g) {
  'use strict';
  var LANGS = ['ru', 'en', 'es', 'zh', 'hi', 'ar', 'fr', 'pt', 'de', 'tr'];
  var LBL = ['Проложить маршрут', 'Get directions', 'Cómo llegar', '规划路线', 'रास्ता देखें', 'احصل على الاتجاهات', 'Itinéraire', 'Traçar rota', 'Route planen', 'Yol tarifi al'];
  function lang() { var l = ''; try { l = (g.CxSession && g.CxSession.lang) ? g.CxSession.lang() : (g.localStorage.getItem('cx_lang') || ''); } catch (e) {} return LANGS.indexOf(l) >= 0 ? l : 'en'; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function num(v, lim) { if (v === null || v === undefined || v === '') return null; var n = Number(v); return isFinite(n) && Math.abs(n) <= lim ? n : null; }
  function guestCountry() { try { var w = g.CX && g.CX.wizard; var c = w && (w.country || (w.hotel && w.hotel.country)); return c ? String(c).toUpperCase() : ''; } catch (e) { return ''; } }
  var CxMap = {
    label: function () { return LBL[LANGS.indexOf(lang())]; },
    provider: function (o, opts) { var c = String((o && o.country) || '').trim().toUpperCase() || String((opts && opts.guestCountry) || guestCountry() || '').trim().toUpperCase(); return c === 'RU' ? 'yandex' : 'google'; },
    url: function (o, opts) {
      if (!o) return null; var prov = this.provider(o, opts), lat = num(o.lat, 90), lng = num(o.lng !== undefined ? o.lng : o.lon, 180), addr = String(o.address || '').trim(), city = String(o.city || '').trim();
      if (addr && city && addr.toLowerCase().indexOf(city.toLowerCase()) < 0) addr += ', ' + city;
      if (lat !== null && lng !== null) return { provider: prov, url: prov === 'yandex' ? 'https://yandex.ru/maps/?rtext=~' + lat + '%2C' + lng + '&rtt=auto' : 'https://www.google.com/maps/dir/?api=1&destination=' + lat + '%2C' + lng };
      if (addr) return { provider: prov, url: prov === 'yandex' ? 'https://yandex.ru/maps/?text=' + encodeURIComponent(addr) : 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(addr) };
      return null;
    },
    html: function (o, opts) { var r = this.url(o, opts); if (!r) return ''; return '<a class="btn btn-ghost cx-route" style="display:inline-block;margin-top:8px;min-height:40px" href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer" data-provider="' + r.provider + '">\uD83D\uDCCD ' + esc(this.label()) + '</a>'; }
  };
  g.CxMap = CxMap;
})(typeof window !== 'undefined' ? window : this);
