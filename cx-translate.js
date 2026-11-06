/* cx-translate.js (Агент 3, R12 п.4): перевод страницы Google Translate ТОЛЬКО по нажатию и после пояснения.
   До нажатия «Перевести» ни одного запроса к Google. Выбор не запоминается. API: CxTranslate.init({container, pageLanguage}), .translateTo(code), .ensureLoaded(), .cancel(), .isLoaded() */
(function (g) {
  'use strict';
  var D = g.document, LANGS = ['ru', 'en', 'es', 'zh', 'hi', 'ar', 'fr', 'pt', 'de', 'tr'];
  var T = { // ru en es zh hi ar fr pt de tr (es..tr без носителя)
    title: ['Перевод страницы', 'Translate this page', 'Traducir la página', '翻译本页', 'पेज का अनुवाद', 'ترجمة الصفحة', 'Traduire la page', 'Traduzir a página', 'Seite übersetzen', 'Sayfayı çevir'],
    expl: ['Страница будет отправлена в Google для перевода. Google получит текст страницы и ваш IP-адрес. Выбор не запоминается.', 'The page will be sent to Google for translation. Google will receive the page text and your IP address. Your choice is not remembered.', 'La página se enviará a Google para traducirla. Google recibirá el texto de la página y su dirección IP. La elección no se guarda.', '本页将发送给 Google 进行翻译。Google 将获得页面文本和您的 IP 地址。此选择不会被保存。', 'पेज अनुवाद के लिए Google को भेजा जाएगा। Google को पेज का टेक्स्ट और आपका IP पता मिलेगा। आपका चुनाव याद नहीं रखा जाता।', 'سيتم إرسال الصفحة إلى Google للترجمة. ستحصل Google على نص الصفحة وعنوان IP الخاص بك. لا يتم حفظ اختيارك.', 'La page sera envoyée à Google pour traduction. Google recevra le texte de la page et votre adresse IP. Votre choix n’est pas mémorisé.', 'A página será enviada ao Google para tradução. O Google receberá o texto da página e seu endereço IP. A escolha não é lembrada.', 'Die Seite wird zur Übersetzung an Google gesendet. Google erhält den Seitentext und Ihre IP-Adresse. Die Auswahl wird nicht gespeichert.', 'Sayfa çeviri için Google’a gönderilecek. Google sayfa metnini ve IP adresinizi alacak. Seçiminiz hatırlanmaz.'],
    go: ['Перевести', 'Translate', 'Traducir', '翻译', 'अनुवाद करें', 'ترجمة', 'Traduire', 'Traduzir', 'Übersetzen', 'Çevir'],
    no: ['Отмена', 'Cancel', 'Cancelar', '取消', 'रद्द करें', 'إلغاء', 'Annuler', 'Cancelar', 'Abbrechen', 'İptal'],
    undo: ['Отменить перевод', 'Cancel translation', 'Cancelar traducción', '取消翻译', 'अनुवाद रद्द करें', 'إلغاء الترجمة', 'Annuler la traduction', 'Cancelar tradução', 'Übersetzung abbrechen', 'Çeviriyi iptal et'],
    active: ['Страница переведена с помощью Google.', 'This page was translated by Google.', 'Página traducida con Google.', '本页由 Google 翻译。', 'यह पेज Google द्वारा अनुवादित है।', 'تمت ترجمة الصفحة بواسطة Google.', 'Page traduite par Google.', 'Página traduzida pelo Google.', 'Seite von Google übersetzt.', 'Sayfa Google ile çevrildi.'],
    fail: ['Не удалось загрузить переводчик. Страница осталась на прежнем языке.', 'Could not load the translator. The page stays in its original language.', 'No se pudo cargar el traductor. La página sigue en su idioma original.', '无法加载翻译工具，页面保持原语言。', 'अनुवादक लोड नहीं हो सका। पेज मूल भाषा में ही रहेगा।', 'تعذّر تحميل المترجم. بقيت الصفحة بلغتها الأصلية.', 'Impossible de charger le traducteur. La page reste dans sa langue d’origine.', 'Não foi possível carregar o tradutor. A página continua no idioma original.', 'Der Übersetzer konnte nicht geladen werden. Die Seite bleibt in der Originalsprache.', 'Çevirmen yüklenemedi. Sayfa özgün dilinde kalıyor.']
  };
  function lang() { var l = ''; try { l = g.localStorage.getItem('cx_lang') || ''; } catch (e) {} if (LANGS.indexOf(l) < 0) { var n = ((g.navigator && g.navigator.language) || 'ru').slice(0, 2); l = LANGS.indexOf(n) >= 0 ? n : 'ru'; } return l; }
  function tr(k) { var a = T[k]; return a[LANGS.indexOf(lang())] || a[1]; }
  function el(tag, attrs, kids) { var e = D.createElement(tag); for (var k in (attrs || {})) { if (k === 'text') e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]); } (kids || []).forEach(function (c) { if (c) e.appendChild(c); }); return e; }
  var S = { container: 'google_translate_element', pageLanguage: 'ru', _loading: null, _loaded: false, _reload: function () { g.location.reload(); } };
  function cookieOff() { // удалить googtrans на всех вариантах домена и пути
    var host = g.location.hostname, parts = host.split('.'), doms = ['', host, '.' + host]; if (parts.length > 2) doms.push('.' + parts.slice(-2).join('.'));
    doms.forEach(function (d) { D.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : ''); });
  }
  function sel() { return D.querySelector('#' + S.container + ' select.goog-te-combo'); }
  function dialog() {
    return new Promise(function (resolve) {
      var ov = el('div', { id: 'cxtDlg', style: 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:100002;display:flex;align-items:center;justify-content:center;padding:16px' });
      var box = el('div', { role: 'dialog', 'aria-modal': 'true', 'aria-label': tr('title'), style: 'background:#fff;color:#1d1d24;border:1px solid #c9a24b;border-radius:14px;max-width:420px;width:100%;padding:18px;font:16px/1.4 system-ui,sans-serif' });
      var btn = 'min-height:44px;border-radius:10px;border:1px solid #c9a24b;font-size:16px;padding:8px 16px;cursor:pointer;';
      var go = el('button', { type: 'button', id: 'cxtGo', text: tr('go'), style: btn + 'background:#c9a24b;color:#1d1d24;font-weight:600' }), no = el('button', { type: 'button', id: 'cxtNo', text: tr('no'), style: btn + 'background:#fff;color:#1d1d24' });
      box.appendChild(el('h2', { text: tr('title'), style: 'margin:0 0 10px;font-size:20px' })); box.appendChild(el('p', { text: tr('expl'), style: 'margin:0 0 14px' }));
      box.appendChild(el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap' }, [go, no])); ov.appendChild(box);
      function done(v) { D.removeEventListener('keydown', key); ov.remove(); resolve(v); }
      function key(e) { if (e.key === 'Escape') done(false); }
      go.onclick = function () { done(true); }; no.onclick = function () { done(false); }; ov.addEventListener('mousedown', function (e) { if (e.target === ov) done(false); });
      D.addEventListener('keydown', key); D.body.appendChild(ov); no.focus();
    });
  }
  function note(text, withUndo) {
    var old = D.getElementById('cxtBar'); if (old) old.remove();
    var kids = [el('span', { text: text })]; if (withUndo) { var u = el('button', { type: 'button', id: 'cxtUndo', text: tr('undo'), style: 'min-height:40px;border-radius:8px;border:1px solid #c9a24b;background:#fff;color:#1d1d24;font-size:15px;padding:6px 12px;cursor:pointer' }); u.onclick = function () { S.cancel(); }; kids.push(u); }
    var bar = el('div', { id: 'cxtBar', role: 'status', style: 'position:fixed;left:8px;right:8px;bottom:8px;z-index:100001;background:#fff3cd;color:#3b2f00;border:1px solid #c9a24b;border-radius:10px;padding:10px 12px;display:flex;gap:10px;align-items:center;justify-content:space-between;font:15px system-ui,sans-serif' }, kids);
    D.body.appendChild(bar); return bar;
  }
  function loadScript() {
    return new Promise(function (resolve) {
      var done = false, tm = null;
      function fin(ok) { if (done) return; done = true; if (tm) g.clearTimeout(tm); resolve(ok); }
      g.cxTranslateInit = function () { try { new g.google.translate.TranslateElement({ pageLanguage: S.pageLanguage, autoDisplay: false }, S.container); } catch (e) { return fin(false); } var n = 0, iv = g.setInterval(function () { n++; if (sel()) { g.clearInterval(iv); fin(true); } else if (n > 40) { g.clearInterval(iv); fin(false); } }, 250); };
      var s = el('script', { id: 'cxtScript', src: 'https://translate.google.com/translate_a/element.js?cb=cxTranslateInit' }); s.onerror = function () { fin(false); };
      tm = g.setTimeout(function () { fin(false); }, 15000); D.head.appendChild(s);
    });
  }
  S.init = function (o) { o = o || {}; if (o.container) S.container = o.container; if (o.pageLanguage) S.pageLanguage = o.pageLanguage; cookieOff(); return S; }; // выбор не запоминается: старую cookie убираем
  S.isLoaded = function () { return S._loaded && !!sel(); };
  S.ensureLoaded = function () {
    if (S.isLoaded()) return Promise.resolve(true);
    if (S._loading) return S._loading;
    S._loading = dialog().then(function (yes) {
      if (!yes) return false;
      return loadScript().then(function (ok) { if (ok) { S._loaded = true; note(tr('active'), true); } else { var s = D.getElementById('cxtScript'); if (s) s.remove(); note(tr('fail'), false); g.setTimeout(function () { var b = D.getElementById('cxtBar'); if (b) b.remove(); }, 8000); } return ok; });
    }).then(function (r) { S._loading = null; return r; }, function () { S._loading = null; return false; });
    return S._loading;
  };
  S.translateTo = function (code) { return S.ensureLoaded().then(function (ok) { if (!ok) return false; var s = sel(); if (!s) return false; s.value = code; s.dispatchEvent(new g.Event('change')); return true; }); };
  S.cancel = function () { // убрать виджет, cookie, перезагрузить страницу
    var c = D.getElementById(S.container); if (c) c.textContent = ''; ['cxtScript', 'cxtBar'].forEach(function (id) { var e = D.getElementById(id); if (e) e.remove(); });
    D.querySelectorAll('.skiptranslate, iframe.goog-te-banner-frame').forEach(function (e) { if (e.id !== S.container) e.remove(); });
    cookieOff(); S._loaded = false; S._reload();
  };
  g.CxTranslate = S;
})(window);
