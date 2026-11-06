/* cx-content-translate.js (Агент 3, R13 п.4): перевод текстов людей (описания карточек) через серверный POST /api/translate (Агент 2, R33).
   Ключей в браузере нет, запросов к чужим сервисам нет. Контракт сервера R34: запрос {texts:[..], target}, ответ {error, translations:[{text,status}]}; берётся только status ok.
   Если сервер ручку не знает (404/405/501), автоперевод тихо выключается («не проверено с сервером»). Перевод помечается «переведено автоматически» с кнопкой «оригинал». */
(function (g) {
  'use strict';
  var D = g.document, LANGS = ['ru', 'en', 'es', 'zh', 'hi', 'ar', 'fr', 'pt', 'de', 'tr'];
  var NOTE = ['Переведено автоматически', 'Translated automatically', 'Traducido automáticamente', '自动翻译', 'स्वचालित अनुवाद', 'تمت الترجمة تلقائيًا', 'Traduit automatiquement', 'Traduzido automaticamente', 'Automatisch übersetzt', 'Otomatik çevrildi'];
  var ORIG = ['Показать оригинал', 'Show original', 'Ver original', '显示原文', 'मूल दिखाएँ', 'عرض الأصل', 'Voir l’original', 'Ver original', 'Original anzeigen', 'Orijinali göster'];
  var TRN = ['Показать перевод', 'Show translation', 'Ver traducción', '显示译文', 'अनुवाद दिखाएँ', 'عرض الترجمة', 'Voir la traduction', 'Ver tradução', 'Übersetzung anzeigen', 'Çeviriyi göster'];
  var cache = {}, supported = null, getLang = function () { return 'ru'; }, busy = false, timer = null, MAX = 12;
  function idx(l) { var i = LANGS.indexOf(l); return i < 0 ? 1 : i; }
  function base() { return typeof g.CX_API_BASE === 'string' ? g.CX_API_BASE : ''; }
  var C = {
    supported: function () { return supported; },
    translate: function (text, target) {
      text = String(text || '').trim(); if (!text || text.length > 5000 || supported === false) return Promise.resolve(null);
      var key = target + '|' + text; if (cache[key]) return Promise.resolve(cache[key]);
      return g.fetch(base() + '/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Lang': target }, body: JSON.stringify({ texts: [text], target: target }) }).then(function (r) {
        if (r.status === 404 || r.status === 405 || r.status === 501) { supported = false; return null; }
        if (!r.ok) return null;
        return r.json().then(function (d) { if (!d || d.error) return null; var x = d.translations && d.translations[0]; if (!x || x.status !== 'ok' || typeof x.text !== 'string' || !x.text.trim()) return null; supported = true; cache[key] = x.text; return x.text; }, function () { return null; });
      }, function () { return null; });
    },
    pass: function (root) {
      var lang = getLang(); if (busy || lang === 'ru' || supported === false) return Promise.resolve(); busy = true;
      var list = [].slice.call((root || D).querySelectorAll('.card-desc-text')).filter(function (e) { return !e.hasAttribute('data-cxat') && e.textContent.trim().length > 1; }).slice(0, MAX);
      list.forEach(function (e) { e.setAttribute('data-cxat', '1'); });
      var p = Promise.resolve();
      list.forEach(function (e) {
        p = p.then(function () {
          var orig = e.textContent; return C.translate(orig, lang).then(function (tr) {
            if (!tr || !e.isConnected || tr === orig) return;
            var wrap = e.parentElement, btn = wrap && wrap.parentElement && wrap.parentElement.querySelector('.translate-btn'); if (btn) btn.style.display = 'none';
            e.textContent = tr; e.setAttribute('data-cx-orig', orig);
            var note = D.createElement('span'); note.className = 'cx-auto-note'; note.style.cssText = 'display:block;font-size:11px;opacity:.75;margin-top:2px';
            var lab = D.createElement('span'); lab.textContent = NOTE[idx(lang)] + ' · '; var b = D.createElement('button'); b.type = 'button'; b.textContent = ORIG[idx(lang)]; b.style.cssText = 'background:none;border:0;padding:0;color:inherit;text-decoration:underline;cursor:pointer;font-size:11px';
            var shown = true; b.onclick = function () { shown = !shown; e.textContent = shown ? tr : orig; b.textContent = shown ? ORIG[idx(lang)] : TRN[idx(lang)]; };
            note.appendChild(lab); note.appendChild(b); e.parentNode.insertBefore(note, e.nextSibling);
          });
        });
      });
      return p.then(function () { busy = false; }, function () { busy = false; });
    },
    start: function (o) {
      o = o || {}; if (o.getLang) getLang = o.getLang; if (o.max) MAX = o.max;
      function sched() { g.clearTimeout(timer); timer = g.setTimeout(function () { C.pass(D); }, 300); }
      new g.MutationObserver(sched).observe(D.documentElement, { childList: true, subtree: true }); sched();
    },
    reset: function () { [].slice.call(D.querySelectorAll('[data-cxat]')).forEach(function (e) { e.removeAttribute('data-cxat'); }); }
  };
  g.CxContent = C;
})(window);
