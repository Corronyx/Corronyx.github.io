/* Corronyx: оценки в шесть звёзд под карточками (R40, 12.11.2026). Место под звёзды: <div class="cxr" data-cxr="тип:номер"></div> (CxRating.slot).
   Типы: hotel, touroperator, partner, afisha. Оценивают только вошедшие; свой тип карточек оценивать нельзя (решает сервер). Комментариев нет. */
(function () {
  'use strict';
  var MAX = 6, TXT = {
    ru: { few: 'мало оценок', n: 'оценок', login: 'Войдите, чтобы поставить оценку', outbound: 'Оценить можно после перехода к рекламодателю по нашей ссылке: сайт, телефон или почта', same: 'Карточки своего вида оценивать нельзя', own: 'Свою карточку оценить нельзя', limit: 'Слишком много оценок за час, попробуйте позже', fail: 'Не удалось сохранить оценку', thanks: 'Спасибо! Ваша оценка', of: 'из', rm: 'Убрать мою оценку', admin: 'Администратор оценки не ставит' },
    en: { few: 'not enough ratings', n: 'ratings', login: 'Sign in to rate', outbound: 'You can rate after contacting the advertiser through our link: website, phone or email', same: 'You can\u2019t rate cards of your own kind', own: 'You can\u2019t rate your own card', limit: 'Too many ratings this hour, try later', fail: 'Could not save your rating', thanks: 'Thank you! Your rating', of: 'of', rm: 'Remove my rating', admin: 'Administrators do not rate' }
  };
  function L() { return /^ru/i.test(document.documentElement.lang || navigator.language || 'ru') ? TXT.ru : TXT.en; }
  function base() { try { return typeof CX_API_BASE !== 'undefined' ? CX_API_BASE : (window.CX_API_BASE || ''); } catch (e) { return ''; } }
  function token() { try { return (typeof CxApi !== 'undefined' && CxApi.token) ? CxApi.token() : ''; } catch (e) { return ''; } }
  function call(method, path, body) {
    var h = { 'Content-Type': 'application/json' }, t = token(); if (t) h.Authorization = 'Bearer ' + t;
    return fetch(base() + path, { method: method, headers: h, body: body ? JSON.stringify(body) : undefined }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) { var e = new Error(d.error || 'failed'); e.status = r.status; throw e; } return d; }); });
  }
  var css = document.createElement('style');
  css.textContent = '.cxr{margin-top:8px;display:flex;flex-wrap:wrap;align-items:center;gap:6px;font-size:12px;color:var(--muted,#888)}' +
    '.cxr-s{display:inline-flex;gap:0}.cxr-s button{background:none;border:0;padding:2px 1px;cursor:pointer;font-size:20px;line-height:1;color:rgba(128,128,128,.45)}' +
    '.cxr-s button.on{color:var(--gold,#c9a24b)}.cxr-s button.mine{text-shadow:0 0 0 #000;outline:none}.cxr-m{min-height:14px;flex-basis:100%;font-size:11px}';
  (document.head || document.documentElement).appendChild(css);
  var R = {
    slot: function (type, id) { id = Number(id); return (Number.isInteger(id) && id > 0 && /^(hotel|touroperator|partner|afisha)$/.test(type)) ? '<div class="cxr" data-cxr="' + type + ':' + id + '"></div>' : ''; },
    hydrate: function (root) {
      root = root || document; var slots = [].slice.call(root.querySelectorAll('.cxr[data-cxr]:not([data-cxr-done])')); if (!slots.length) return;
      var groups = {}; slots.forEach(function (el) { el.setAttribute('data-cxr-done', '1'); var p = el.getAttribute('data-cxr').split(':'); (groups[p[0]] = groups[p[0]] || []).push({ el: el, id: Number(p[1]) }); });
      Object.keys(groups).forEach(function (type) {
        var ids = groups[type].map(function (x) { return x.id; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 100).join(',');
        var sum = call('GET', '/api/ratings/summary?type=' + type + '&ids=' + ids).catch(function () { return {}; });
        var mine = token() ? call('GET', '/api/ratings/mine?type=' + type + '&ids=' + ids).catch(function () { return {}; }) : Promise.resolve({});
        Promise.all([sum, mine]).then(function (r) { R.cache[type] = R.cache[type] || {}; groups[type].forEach(function (x) { if (r[0][x.id]) R.cache[type][x.id] = r[0][x.id]; draw(x.el, type, x.id, r[0][x.id] || { count: 0, avg: null, min: 6 }, r[1][x.id] || 0); }); });
      });
    }
  };
  function draw(el, type, id, s, mine) {
    var T = L(); el.textContent = '';
    el.addEventListener('click', function (e) { e.stopPropagation(); });
    var box = document.createElement('span'); box.className = 'cxr-s'; box.setAttribute('role', 'group');
    var shown = s.avg !== null && s.avg !== undefined ? Math.round(s.avg) : 0, i;
    for (i = 1; i <= MAX; i++) (function (n) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = '\u2605'; b.setAttribute('aria-label', n + ' ' + T.of + ' ' + MAX);
      if (n <= shown) b.className = 'on'; if (n === mine) b.className += ' mine'; b.title = n + ' / ' + MAX;
      b.addEventListener('click', function (e) { e.stopPropagation(); e.preventDefault(); rate(el, type, id, n, T); });
      box.appendChild(b);
    })(i);
    var txt = document.createElement('span');
    txt.textContent = s.avg !== null && s.avg !== undefined ? s.avg.toFixed(1) + ' \u00b7 ' + s.count : (s.count ? T.few + ' (' + s.count + ' ' + T.of + ' ' + (s.min || 6) + ')' : T.few);
    var msg = document.createElement('span'); msg.className = 'cxr-m'; if (mine) msg.textContent = T.thanks + ': ' + mine + ' / ' + MAX;
    el.appendChild(box); el.appendChild(txt); el.appendChild(msg);
  }
  function rate(el, type, id, n, T) {
    var msg = el.querySelector('.cxr-m');
    if (!token()) { if (msg) msg.textContent = T.login; try { if (window.CxSession && CxSession.openAuth) CxSession.openAuth({ here: (location.pathname.split('/').pop() || 'index.html') }); } catch (e) {} return; }
    call('POST', '/api/ratings', { type: type, id: id, stars: n }).then(function (d) { el.removeAttribute('data-cxr-done'); draw(el, type, id, d, d.mine); }).catch(function (e) {
      var er = e && e.message; if (msg) msg.textContent = e.status === 401 ? T.login : er === 'same_type_cannot_rate' ? T.same : er === 'own_object' ? T.own : er === 'outbound_required' ? T.outbound : er === 'role_cannot_rate' ? T.admin : e.status === 429 ? T.limit : T.fail;
    });
  }
  R.cache = {};   // сводки оценок, которые уже загружены (нужны помощнику для подбора)
  R.ensure = function (type, ids) {
    var c = R.cache[type] = R.cache[type] || {}, need = (ids || []).filter(function (v, i, a) { return Number.isInteger(v) && v > 0 && !c[v] && a.indexOf(v) === i; }).slice(0, 100);
    if (!need.length) return Promise.resolve();
    return call('GET', '/api/ratings/summary?type=' + type + '&ids=' + need.join(',')).then(function (d) { need.forEach(function (id) { c[id] = d[id] || { count: 0, avg: null }; }); }).catch(function () {});
  };
  window.CxRating = R;
  var timer = null, mo = new MutationObserver(function () { clearTimeout(timer); timer = setTimeout(function () { R.hydrate(document); }, 150); });
  function start() { R.hydrate(document); try { mo.observe(document.body, { childList: true, subtree: true }); } catch (e) {} }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
