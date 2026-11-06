/* cx-ads.js (Агент 3, R13 п.1): интерфейс платной рекламы по docs/ADS_UI_SPEC.md для кабинетов партнёра и афиши.
   Подключение: <script src="cx-ads.js"></script> после cx-session.js; затем CxAds.mount(контейнер, {kind:'partner'|'afisha'}).
   Все данные от людей выводятся через textContent. Тексты ошибок: CxI18n.errText (пакеты lang/*.json, раздел errors). Тексты интерфейса: ru и en (остальные языки: английский). */
(function (g) {
  'use strict';
  var D = g.document;
  var T = {
    ru: { tab: 'Реклама', h_buy: 'Купить рекламу', f_target: 'Объект', f_level: 'Где показывать', lv_world: 'Весь мир', lv_country: 'Страна', lv_city: 'Город', f_country: 'Страна', f_city: 'Город', f_shop: 'Ссылка на площадку (Booking, Ozon и т.д.)', shop_busy: 'Ключ магазина: {k}. Если этот магазин уже занят другим человеком, заказ не пройдёт.', f_grant: 'Подарок или скидка', no_grant: 'Без подарка', grant_opt: '{p}% (осталось {n}, до {d})', price: 'Цена: {p}', price_none: 'Цена будет показана после оформления заказа', btn_order: 'Оформить заказ', no_targets: 'Нет объектов: сначала создайте и отправьте карточку на одобрение.', ord_created: 'Заказ №{n} создан', pay_sum: 'Сумма', pay_req: 'Реквизиты для оплаты', pay_until: 'Оплатить до', left: 'осталось', rc_title: 'Загрузить чек', rc_amount: 'Сумма по чеку', rc_date: 'Дата операции', rc_op: 'Номер операции (4–64 знака)', rc_file: 'Файл чека (png, jpeg, webp или pdf, до 5 МБ)', rc_send: 'Отправить чек', rc_sent: 'Чек принят: {s}', rc_cond: 'Показ включён условно на 24 часа', btn_cancel: 'Отменить заказ', ton_wallet: 'Адрес кошелька (сеть TON, токен USDT)', ton_comment: 'Комментарий к платежу (обязателен, без него платёж не найдётся)', ton_amount: 'Сумма в USDT', ton_copy: 'Копировать', copied: 'Скопировано', ton_paid: 'Я оплатил(а)', ton_wait: 'Ждём подтверждение в сети TON, обычно 1–2 минуты. Страницу можно закрыть: придёт уведомление.', ton_active: 'Оплата подтверждена, размещение включено.', ton_expired: 'Время оплаты истекло. Оформите заказ заново.', ton_unmatched: 'Если вы оплатили, а размещение не включилось, напишите в поддержку, указав номер заказа {n}.', ton_off: 'Оплата временно недоступна.', h_orders: 'Мои заказы', no_orders: 'Заказов пока нет', st_awaiting_payment: 'Ждём оплату', st_pending_review: 'Чек на проверке', st_conditional: 'Показ включён условно', st_active: 'Показывается', st_paused: 'Приостановлено из-за жалоб, администратор проверяет', st_ended: 'Срок закончился', st_expired: 'Не оплачено вовремя', st_cancelled: 'Отменено вами', st_removed: 'Снято за нарушение условий (без возврата)', st_refunded: 'Возврат оформлен; деньги вернёт администратор вручную', until: 'до {d}', frozen: 'срок заморожен, пока объект не показывается', ad_label: 'Реклама', h_gifts: 'Подарки и скидки', no_gifts: 'Подарков нет', gift_line: 'Скидка {p}%, осталось {n}, действует до {d}', oc_btn: 'Этот магазин мой: подать заявление владельца', oc_contact: 'Как с вами связаться (почта или телефон)', oc_comment: 'Комментарий (необязательно)', oc_send: 'Отправить заявление', oc_sent: 'Заявление отправлено, администратор рассмотрит его.', h_bl: 'Ограничения и обжалование', bl_none: 'Записей нет', bl_active: 'Действует ограничение: {r}', bl_unblocked: 'Ограничение снято', bl_appeal: 'Обжаловать', bl_text: 'Объясните, почему решение неверно (10–2000 знаков)', bl_send: 'Отправить обжалование', bl_open: 'Обжалование рассматривается', bl_sent: 'Обжалование отправлено', ap_rejected: 'Отклонено: {r}', ap_approved: 'Одобрено', loading: 'Загрузка…', retry: 'Повторить', need_login: 'Войдите, чтобы покупать рекламу.', fix_fields: 'Проверьте выделенные поля.' },
    en: { tab: 'Advertising', h_buy: 'Buy advertising', f_target: 'Listing', f_level: 'Where to show', lv_world: 'Worldwide', lv_country: 'Country', lv_city: 'City', f_country: 'Country', f_city: 'City', f_shop: 'Link to the marketplace (Booking, Ozon, etc.)', shop_busy: 'Shop key: {k}. If another person already advertises this shop, the order will be rejected.', f_grant: 'Gift or discount', no_grant: 'No gift', grant_opt: '{p}% ({n} left, until {d})', price: 'Price: {p}', price_none: 'The price is shown after the order is created', btn_order: 'Place order', no_targets: 'No listings yet: create a card and send it for approval first.', ord_created: 'Order #{n} created', pay_sum: 'Amount', pay_req: 'Payment details', pay_until: 'Pay before', left: 'left', rc_title: 'Upload the receipt', rc_amount: 'Amount on the receipt', rc_date: 'Date of the payment', rc_op: 'Operation number (4–64 characters)', rc_file: 'Receipt file (png, jpeg, webp or pdf, up to 5 MB)', rc_send: 'Send the receipt', rc_sent: 'Receipt accepted: {s}', rc_cond: 'Display is enabled conditionally for 24 hours', btn_cancel: 'Cancel the order', ton_wallet: 'Wallet address (TON network, USDT token)', ton_comment: 'Payment comment (required, the payment cannot be found without it)', ton_amount: 'Amount in USDT', ton_copy: 'Copy', copied: 'Copied', ton_paid: 'I have paid', ton_wait: 'Waiting for confirmation in the TON network, usually 1–2 minutes. You can close the page: you will get a notification.', ton_active: 'Payment confirmed, the placement is on.', ton_expired: 'Payment time has expired. Place the order again.', ton_unmatched: 'If you paid but the placement did not start, write to support and give order number {n}.', ton_off: 'Payment is temporarily unavailable.', h_orders: 'My orders', no_orders: 'No orders yet', st_awaiting_payment: 'Waiting for payment', st_pending_review: 'Receipt under review', st_conditional: 'Displayed conditionally', st_active: 'Displayed', st_paused: 'Paused because of complaints, an administrator is checking', st_ended: 'Period ended', st_expired: 'Not paid in time', st_cancelled: 'Cancelled by you', st_removed: 'Removed for violating the terms (no refund)', st_refunded: 'Refund recorded; the administrator returns the money manually', until: 'until {d}', frozen: 'period is frozen while the listing is not shown', ad_label: 'Ad', h_gifts: 'Gifts and discounts', no_gifts: 'No gifts', gift_line: '{p}% discount, {n} left, valid until {d}', oc_btn: 'This shop is mine: send an owner claim', oc_contact: 'How to contact you (email or phone)', oc_comment: 'Comment (optional)', oc_send: 'Send the claim', oc_sent: 'Claim sent, an administrator will review it.', h_bl: 'Restrictions and appeals', bl_none: 'No entries', bl_active: 'Restriction in force: {r}', bl_unblocked: 'Restriction lifted', bl_appeal: 'Appeal', bl_text: 'Explain why the decision is wrong (10–2000 characters)', bl_send: 'Send the appeal', bl_open: 'The appeal is being reviewed', bl_sent: 'Appeal sent', ap_rejected: 'Rejected: {r}', ap_approved: 'Approved', loading: 'Loading…', retry: 'Retry', need_login: 'Log in to buy advertising.', fix_fields: 'Check the highlighted fields.' }
  };
  Object.assign(T.ru, { c_btn: 'Пожаловаться', c_title: 'Жалоба на рекламу', c_reason: 'Причина', c_text: 'Пояснение (необязательно, до 500 знаков)', c_send: 'Отправить жалобу', c_cancel: 'Закрыть', c_sent: 'Жалоба отправлена, спасибо', c_login: 'Чтобы пожаловаться, войдите в аккаунт', lbl_pl: 'Партнёрская ссылка', c_open: 'Открыть', r_illegal: 'Незаконный контент', r_copyright: 'Нарушение авторских прав', r_minors: 'Затрагивает несовершеннолетних', r_misleading: 'Вводит в заблуждение', r_spam: 'Спам', r_other: 'Другое' });
  Object.assign(T.en, { c_btn: 'Report', c_title: 'Report this ad', c_reason: 'Reason', c_text: 'Details (optional, up to 500 characters)', c_send: 'Send report', c_cancel: 'Close', c_sent: 'Report sent, thank you', c_login: 'Please sign in to report an ad', lbl_pl: 'Affiliate link', c_open: 'Open', r_illegal: 'Illegal content', r_copyright: 'Copyright violation', r_minors: 'Involves minors', r_misleading: 'Misleading', r_spam: 'Spam', r_other: 'Other' });
  T.de = { ad_label: 'Werbung', lbl_pl: 'Affiliate-Link' }; // R16 A1: только две метки, остальные строки берутся из en (t() делает откат)
  T.fr = { ad_label: 'Publicité', lbl_pl: 'Lien d’affiliation' }; // R16 A1: только две метки, остальные строки берутся из en (t() делает откат)
  T.es = { ad_label: 'Publicidad', lbl_pl: 'Enlace de afiliado' }; // R16 A1: только две метки, остальные строки берутся из en (t() делает откат)
  T.pt = { ad_label: 'Publicidade', lbl_pl: 'Link de afiliado' }; // R16 A1: только две метки, остальные строки берутся из en (t() делает откат)
  T.tr = { ad_label: 'Reklam', lbl_pl: 'Ortaklık bağlantısı' }; // R16 A1: только две метки, остальные строки берутся из en (t() делает откат)
  T.zh = { ad_label: '广告', lbl_pl: '联盟推广链接' }; // R16 A1: только две метки, остальные строки берутся из en (t() делает откат)
  T.hi = { ad_label: 'विज्ञापन', lbl_pl: 'एफिलिएट लिंक' }; // R16 A1: только две метки, остальные строки берутся из en (t() делает откат)
  T.ar = { ad_label: 'إعلان', lbl_pl: 'رابط تسويق بالعمولة' }; // R16 A1: только две метки, остальные строки берутся из en (t() делает откат)
  function lang() { var l = ''; if (g.CxSession && CxSession.lang) l = CxSession.lang(); else { try { l = g.localStorage.getItem('cx_lang') || ''; } catch (e) {} } return T[l] ? l : (l ? 'en' : 'ru'); }   // один язык с остальным сайтом: cx_lang, иначе язык браузера
  function t(k, p) { var s = (T[lang()] || T.en)[k] || T.en[k] || k; if (p) for (var q in p) s = s.split('{' + q + '}').join(p[q]); return s; }
  function el(tag, attrs, kids) { var e = D.createElement(tag); for (var k in (attrs || {})) { if (k === 'text') e.textContent = attrs[k]; else if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]); } (kids || []).forEach(function (c) { if (c) e.appendChild(c); }); return e; }
  function fmtDate(x) { try { return new Date(x).toLocaleString(lang() === 'ru' ? 'ru-RU' : 'en-GB', { dateStyle: 'short', timeStyle: 'short' }); } catch (e) { return String(x); } }
  var ERRS = { cur: null, en: null, lang: '' };   // коды ошибок из lang/<язык>.json (раздел errors), грузятся при монтировании
  function loadErrors() {
    var l = (g.CxSession && CxSession.lang) ? CxSession.lang() : lang(); if (ERRS.lang === l && ERRS.cur) return Promise.resolve();
    function one(x) { return g.fetch('lang/' + x + '.json').then(function (r) { return r.ok ? r.json() : {}; }).then(function (j) { return j.errors || {}; }, function () { return {}; }); }
    return Promise.all([one(l), l === 'en' ? null : one('en')]).then(function (r) { ERRS.cur = r[0]; ERRS.en = r[1] || r[0]; ERRS.lang = l; });
  }
  function errText(e) {
    if (e && e.isNetwork) return (g.CxSession && CxSession.errText) ? CxSession.errText(e) : 'Network error';
    var p = (e && e.payload) || { error: 'server_error' }, code = p.error || 'server_error';
    if (g.CxI18n && CxI18n.errText) { try { var x = CxI18n.errText(p); if (x) return x; } catch (z) {} }
    var m = (ERRS.cur && ERRS.cur[code]) || (ERRS.en && ERRS.en[code]);
    if (m) return m;
    return (g.CxSession && CxSession.errText) ? CxSession.errText(e) : String(code);
  }
  function api(method, path, body) { return CxSession.api(method, path, body); }
  function money(a, c) { return String(a) + ' ' + (c === 'RUB' ? '₽' : c); }
  function tonLink(o) { var u = Math.round((o.amount || 0) * 1e6); return 'ton://transfer/' + o.wallet + '?jetton=' + encodeURIComponent(o.master || '') + '&amount=' + u + '&text=' + encodeURIComponent(o.comment || ''); }
  function countdown(node, iso, onEnd) {
    var end = new Date(iso).getTime(), id = null;
    function tick() { var s = Math.max(0, Math.floor((end - Date.now()) / 1000)); var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), ss = s % 60; node.textContent = t('left') + ' ' + (h ? h + ':' : '') + String(m).padStart(2, '0') + ':' + String(ss).padStart(2, '0'); if (s <= 0) { g.clearInterval(id); if (onEnd) onEnd(); } }
    tick(); id = g.setInterval(tick, 1000); return { stop: function () { g.clearInterval(id); } };
  }
  function copyBtn(text) { var b = el('button', { type: 'button', class: 'btn btn-ghost btn-sm', text: t('ton_copy') }); b.onclick = function () { try { g.navigator.clipboard.writeText(text); b.textContent = t('copied'); g.setTimeout(function () { b.textContent = t('ton_copy'); }, 1500); } catch (e) {} }; return b; }
  function field(label, node) { return el('div', { class: 'form-row cxad-row' }, [el('label', { text: label }), node]); }
  function opt(v, txt) { return el('option', { value: v, text: txt }); }

  function css() {
    if (D.getElementById('cxadStyle')) return;
    var st = el('style', { id: 'cxadStyle' }); st.textContent = '.cxad-sec{margin:0 0 22px;padding:14px;border:1px solid rgba(201,164,94,.45);border-radius:12px}.cxad-sec h3{margin:0 0 10px}.cxad-row{margin:8px 0}.cxad-row label{display:block;font-size:14px;margin-bottom:4px}.cxad-row select,.cxad-row input[type=text],.cxad-row input[type=date],.cxad-row input[type=file]{width:100%;min-height:44px;font-size:16px;box-sizing:border-box}.cxad-msg{color:#e04646;min-height:20px;font-size:14px;margin:6px 0}.cxad-note{font-size:13px;opacity:.85;margin:6px 0}.cxad-price{font-weight:600;margin:10px 0}.cxad-order{border:1px solid rgba(201,164,94,.35);border-radius:10px;padding:10px;margin:8px 0}.cxad-order-h{font-weight:600}.cxad-adlabel{display:inline-block;font-size:12px;border:1px solid currentColor;border-radius:6px;padding:1px 6px;margin-right:8px}.cxad-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.cxad-copyrow{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:8px 0}.cxad-copyrow code{word-break:break-all}.cxad-req dt{font-size:13px;opacity:.8}.cxad-req dd{margin:0 0 8px;word-break:break-word}.cxad-qr{display:block;margin:10px 0;background:#fff;padding:6px;border-radius:8px}#cxAdsBox textarea{width:100%;font-size:16px;box-sizing:border-box}';
    D.head.appendChild(st);
  }
  var Ads = {
    _timers: [], t: t,
    stopTimers: function () { this._timers.forEach(function (x) { try { x.stop(); } catch (e) {} }); this._timers = []; },
    mount: function (box, o) {
      o = o || {}; css(); var kind = o.kind === 'afisha' ? 'afisha' : 'partner'; var self = this; box.textContent = '';
      if (!g.CxSession || !CxSession.token()) { box.appendChild(el('p', { text: t('need_login') })); return; }
      loadErrors();
      var secBuy = el('section', { class: 'cxad-sec' }), secPay = el('section', { class: 'cxad-sec', id: 'cxadPay' }), secOrd = el('section', { class: 'cxad-sec' }), secGift = el('section', { class: 'cxad-sec' }), secBl = el('section', { class: 'cxad-sec' });
      [secBuy, secPay, secOrd, secGift, secBl].forEach(function (s) { box.appendChild(s); });
      self.buyForm(secBuy, secPay, kind, function () { self.orders(secOrd); });
      self.orders(secOrd); self.gifts(secGift); self.blacklist(secBl);
    },
    buyForm: function (sec, payBox, kind, refresh) {
      var self = this; sec.textContent = ''; sec.appendChild(el('h3', { text: t('h_buy') })); var msg = el('div', { class: 'cxad-msg', role: 'alert' });
      var targetSel = el('select', { id: 'cxadTarget' }), levelSel = el('select', { id: 'cxadLevel' }), countrySel = el('select', { id: 'cxadCountry' }), citySel = el('select', { id: 'cxadCity' }), shop = el('input', { type: 'text', id: 'cxadShop', maxlength: '500', placeholder: 'https://' }), grantSel = el('select', { id: 'cxadGrant' }), price = el('div', { class: 'cxad-price' }), shopNote = el('div', { class: 'cxad-note' });
      var go = el('button', { type: 'button', class: 'btn btn-primary', id: 'cxadOrderBtn', text: t('btn_order') });
      var rowLevel = field(t('f_level'), levelSel), rowCountry = field(t('f_country'), countrySel), rowCity = field(t('f_city'), citySel), rowShop = field(t('f_shop'), shop);
      var prices = [], overrides = [], targets = [];
      if (kind === 'partner') { levelSel.appendChild(opt('city', t('lv_city'))); rowLevel.style.display = 'none'; rowShop.style.display = ''; } else { levelSel.appendChild(opt('world', t('lv_world'))); levelSel.appendChild(opt('country', t('lv_country'))); levelSel.appendChild(opt('city', t('lv_city'))); rowShop.style.display = 'none'; }
      grantSel.appendChild(opt('', t('no_grant')));
      function cc() { return countrySel.value || ''; }
      var hasPrice = false;
      function setGo() { go.disabled = !hasPrice || !targets.length; }
      function est() {
        var lv = levelSel.value, base = prices.filter(function (p) { return p.kind === kind && p.level === lv; })[0], a = base ? { r: base.amount_rub, u: base.amount_usdt } : null;
        overrides.forEach(function (x) { if (x.kind !== kind || x.level !== lv) return; if ((x.scope === 'country' && x.scope_key === cc()) || (x.scope === 'city' && String(x.scope_key) === String(citySel.value))) { a = a || {}; if (x.amount_rub != null) a.r = x.amount_rub; if (x.amount_usdt != null) a.u = x.amount_usdt; } });
        price.textContent = a && (a.r != null || a.u != null) ? t('price', { p: (a.r != null ? a.r + ' ₽' : '') + (a.r != null && a.u != null ? ' / ' : '') + (a.u != null ? a.u + ' USDT' : '') }) : t('price_none');
        hasPrice = !!(a && (a.r != null || a.u != null)); setGo();
      }
      function syncRows() { var lv = levelSel.value; rowCountry.style.display = (lv === 'country' || lv === 'city') ? '' : 'none'; rowCity.style.display = lv === 'city' ? '' : 'none'; est(); }
      function loadCities() { citySel.textContent = ''; if (!cc()) { est(); return; } api('GET', '/api/cities?country=' + encodeURIComponent(cc())).then(function (rows) { rows.forEach(function (c) { citySel.appendChild(opt(String(c.id), c.name)); }); est(); }, function () { est(); }); }
      levelSel.onchange = syncRows; countrySel.onchange = function () { loadCities(); est(); }; citySel.onchange = est;
      var tmr = null; shop.oninput = function () { g.clearTimeout(tmr); shopNote.textContent = ''; var v = shop.value.trim(); if (v.length < 8) return; tmr = g.setTimeout(function () { api('GET', '/api/ads/shop-key?url=' + encodeURIComponent(v)).then(function (r) { shopNote.textContent = t('shop_busy', { k: r.key }); }, function (e) { shopNote.textContent = errText(e); }); }, 500); };
      sec.appendChild(field(t('f_target'), targetSel)); sec.appendChild(rowLevel); sec.appendChild(rowCountry); sec.appendChild(rowCity); sec.appendChild(rowShop); sec.appendChild(shopNote); sec.appendChild(field(t('f_grant'), grantSel)); sec.appendChild(price); sec.appendChild(msg); sec.appendChild(go);
      var loads = [api('GET', kind === 'partner' ? '/api/partners/me' : '/api/afisha/events/mine'), api('GET', '/api/ads/prices'), api('GET', '/api/ads/price-overrides'), api('GET', '/api/countries'), api('GET', '/api/ads/me/grants')];
      Promise.all(loads.map(function (p) { return p.then(function (v) { return v; }, function () { return null; }); })).then(function (r) {
        targets = (r[0] || []).filter(function (x) { return x.status === 'approved' || x.status === 'active' || x.status === 'published' || !x.status; }); prices = r[1] || []; overrides = r[2] || [];
        targets.forEach(function (x) { targetSel.appendChild(opt(String(x.id), x.name || x.title || ('#' + x.id))); });
        if (!targets.length) { msg.textContent = t('no_targets'); go.disabled = true; }
        (r[3] || []).forEach(function (c) { countrySel.appendChild(opt(c.country, c.country)); }); if (countrySel.options.length) { loadCities(); }
        (r[4] || []).forEach(function (gr) { grantSel.appendChild(opt(String(gr.id), t('grant_opt', { p: gr.discount_pct, n: gr.remaining, d: fmtDate(gr.expires_at) }))); });
        syncRows();
      });
      go.onclick = function () {
        msg.textContent = ''; var lv = levelSel.value, body = { kind: kind, level: lv, target_id: Number(targetSel.value) };
        if (lv === 'country') body.country = cc(); if (lv === 'city') body.city_id = Number(citySel.value);
        if (kind === 'partner') body.shop_url = shop.value.trim(); if (grantSel.value) body.grant_id = Number(grantSel.value);
        go.disabled = true;
        api('POST', '/api/ads/orders', body).then(function (r) { setGo(); self.payPanel(payBox, r); refresh(); }, function (e) { setGo(); msg.textContent = errText(e); if (e && e.payload && e.payload.error === 'shop_taken') self.ownerClaim(sec, body.shop_url); });
      };
    },
    ownerClaim: function (sec, shopUrl) { // заявление владельца магазина (ADS_UI_SPEC §7)
      var old = D.getElementById('cxadClaim'); if (old) old.remove();
      var box = el('div', { id: 'cxadClaim', class: 'cxad-order' }), contact = el('input', { type: 'text', id: 'cxadClaimContact', maxlength: '200' }), comment = el('textarea', { id: 'cxadClaimComment', rows: '2', maxlength: '1000' }), m = el('div', { class: 'cxad-msg', role: 'alert' }), b = el('button', { type: 'button', class: 'btn btn-ghost btn-sm', id: 'cxadClaimSend', text: t('oc_send') });
      box.appendChild(el('h4', { text: t('oc_btn') })); box.appendChild(field(t('oc_contact'), contact)); box.appendChild(field(t('oc_comment'), comment)); box.appendChild(m); box.appendChild(b); sec.appendChild(box);
      b.onclick = function () { m.textContent = ''; b.disabled = true; var body = { shop_url: shopUrl, contact: contact.value.trim() }; if (comment.value.trim()) body.comment = comment.value.trim(); api('POST', '/api/ads/owner-claims', body).then(function () { m.style.color = 'inherit'; m.textContent = t('oc_sent'); }, function (e) { b.disabled = false; m.textContent = errText(e); }); };
    },
    payPanel: function (box, o) {
      var self = this; self.stopTimers(); box.textContent = ''; box.appendChild(el('h3', { text: t('ord_created', { n: o.order_id }) }));
      var cond = o.conditional_notice; if (cond) box.appendChild(el('p', { class: 'cxad-note', text: cond[lang()] || cond.en || cond.ru || '' }));
      if (o.status === 'active') { box.appendChild(el('p', { text: t('ton_active') })); return; }
      box.appendChild(el('p', { text: t('pay_sum') + ': ' + money(o.amount, o.currency) }));
      if (o.method === 'ton' && o.ton) return self.tonPanel(box, o);
      if (o.method === 'ton') { box.appendChild(el('p', { text: t('ton_off') })); return; }
      // рубли, чек
      var req = el('dl', { class: 'cxad-req' }); var r = o.requisites || {};
      Object.keys(r).forEach(function (k) { req.appendChild(el('dt', { text: k })); req.appendChild(el('dd', { text: String(r[k]) })); });
      box.appendChild(el('h4', { text: t('pay_req') })); box.appendChild(req);
      var left = el('p'); box.appendChild(el('p', { text: t('pay_until') + ': ' + fmtDate(o.awaiting_until) })); box.appendChild(left); self._timers.push(countdown(left, o.awaiting_until));
      box.appendChild(el('h4', { text: t('rc_title') }));
      var amount = el('input', { type: 'text', id: 'cxadRcAmount', inputmode: 'decimal', value: String(o.amount) }), date = el('input', { type: 'date', id: 'cxadRcDate' }), op = el('input', { type: 'text', id: 'cxadRcOp', maxlength: '64' }), file = el('input', { type: 'file', id: 'cxadRcFile', accept: '.png,.jpg,.jpeg,.webp,.pdf,image/png,image/jpeg,image/webp,application/pdf' }), msg = el('div', { class: 'cxad-msg', role: 'alert' });
      var rows = { amount: field(t('rc_amount'), amount), date: field(t('rc_date'), date), operation_no: field(t('rc_op'), op) };
      box.appendChild(rows.amount); box.appendChild(rows.date); box.appendChild(rows.operation_no); box.appendChild(field(t('rc_file'), file)); box.appendChild(msg);
      var send = el('button', { type: 'button', class: 'btn btn-primary', id: 'cxadRcSend', text: t('rc_send') }), cancel = el('button', { type: 'button', class: 'btn btn-ghost', id: 'cxadCancel', text: t('btn_cancel') });
      box.appendChild(el('div', { class: 'cxad-actions' }, [send, cancel]));
      send.onclick = function () {
        msg.textContent = ''; Object.keys(rows).forEach(function (k) { rows[k].style.outline = ''; });
        if (!file.files || !file.files[0]) { msg.textContent = t('fix_fields'); return; }
        var fd = new g.FormData(); fd.append('order_id', String(o.order_id)); fd.append('amount', amount.value.trim()); fd.append('date', date.value); fd.append('operation_no', op.value.trim()); fd.append('file', file.files[0]);
        send.disabled = true;
        g.fetch((typeof g.CX_API_BASE === 'string' ? g.CX_API_BASE : '') + '/api/payments/receipts', { method: 'POST', headers: { Authorization: 'Bearer ' + CxSession.token(), 'X-Lang': CxSession.lang() }, body: fd }).then(function (res) { return res.json().catch(function () { return {}; }).then(function (d) { return { ok: res.ok, d: d }; }); }, function () { return { ok: false, d: { error: 'network' } }; }).then(function (r2) {
          send.disabled = false;
          if (r2.ok) { msg.style.color = 'inherit'; msg.textContent = t('rc_sent', { s: r2.d.status }) + (r2.d.conditional ? '. ' + t('rc_cond') : ''); if (r2.d.conditional_notice) box.appendChild(el('p', { class: 'cxad-note', text: r2.d.conditional_notice[lang()] || r2.d.conditional_notice.en || r2.d.conditional_notice.ru || '' })); self.refreshOrders && self.refreshOrders(); return; }
          msg.textContent = errText({ payload: r2.d, isNetwork: r2.d.error === 'network' });
          if (r2.d.error === 'fields_mismatch' && r2.d.fields) { r2.d.fields.forEach(function (k) { if (rows[k]) rows[k].style.outline = '2px solid #e04646'; }); msg.textContent += ' ' + t('fix_fields'); }
        });
      };
      cancel.onclick = function () { api('POST', '/api/ads/orders/' + o.order_id + '/cancel', {}).then(function () { self.stopTimers(); box.textContent = ''; self.refreshOrders && self.refreshOrders(); }, function (e) { msg.textContent = errText(e); }); };
    },
    tonPanel: function (box, o) {
      var self = this, x = o.ton; box.appendChild(el('p', { text: t('ton_amount') + ': ' + x.amount + ' ' + x.currency }));
      box.appendChild(el('div', { class: 'cxad-copyrow' }, [el('span', { text: t('ton_wallet') + ': ' }), el('code', { id: 'cxadWallet', text: x.wallet }), copyBtn(x.wallet)]));
      box.appendChild(el('div', { class: 'cxad-copyrow' }, [el('span', { text: t('ton_comment') + ': ' }), el('code', { id: 'cxadComment', text: x.comment }), copyBtn(x.comment)]));
      try { if (g.CxQR && CxQR.dataUrl) { var img = el('img', { class: 'cxad-qr', alt: 'QR', width: '200', height: '200' }); img.src = CxQR.dataUrl(tonLink(x), { level: 'M', cellSize: 4, margin: 4 }); box.appendChild(img); } } catch (e) {}
      var left = el('p'); box.appendChild(left); self._timers.push(countdown(left, x.expires_at, function () { st.textContent = t('ton_expired'); stopPoll(); }));
      var st = el('div', { class: 'cxad-msg', role: 'status' }); st.style.color = 'inherit'; var paid = el('button', { type: 'button', class: 'btn btn-primary', id: 'cxadPaid', text: t('ton_paid') });
      box.appendChild(paid); box.appendChild(st); box.appendChild(el('p', { class: 'cxad-note', text: t('ton_unmatched', { n: o.order_id }) }));
      var poll = null, started = 0;
      function stopPoll() { if (poll) { g.clearInterval(poll); poll = null; } }
      function once() { api('GET', '/api/payments/ton/' + o.order_id).then(function (r) { if (r.status === 'active') { st.textContent = t('ton_active'); stopPoll(); self.refreshOrders && self.refreshOrders(); } else if (r.status === 'expired') { st.textContent = t('ton_expired'); stopPoll(); } }, function (e) { st.textContent = errText(e); }); }
      function begin() { st.textContent = t('ton_wait'); stopPoll(); started = Date.now(); poll = g.setInterval(function () { if (Date.now() - started > 600000) { stopPoll(); return; } once(); }, 12000); self._timers.push({ stop: stopPoll }); }
      paid.onclick = function () { paid.disabled = true; api('POST', '/api/payments/ton/' + o.order_id + '/check', {}).then(function () { begin(); g.setTimeout(function () { paid.disabled = false; }, 15000); }, function (e) { st.textContent = errText(e); g.setTimeout(function () { paid.disabled = false; }, e && e.status === 429 ? 15000 : 0); }); };
      begin();
    },
    complain: function (adId, card) {   // ADS_UI_SPEC §7: POST /api/ads/:id/complaints {reason, text?}; вход и подтверждённая почта нужны серверу
      var old = card.querySelector('.cxad-cform'); if (old) { old.remove(); return; }
      var f = el('div', { class: 'cxad-cform', style: 'margin-top:8px;padding:8px;border:1px dashed rgba(201,164,94,.6);border-radius:8px' }), msg = el('div', { class: 'cxad-msg', role: 'alert' });
      f.appendChild(el('strong', { text: t('c_title') }));
      if (!g.CxSession || !CxSession.token()) { f.appendChild(el('div', { class: 'cxad-msg', text: t('c_login') })); card.appendChild(f); return; }
      var sel = el('select', { class: 'cxad-reason' }); ['illegal', 'copyright', 'minors', 'misleading', 'spam', 'other'].forEach(function (r) { sel.appendChild(opt(r, t('r_' + r))); });
      var ta = el('textarea', { class: 'cxad-ctext', maxlength: '500', rows: '3', style: 'width:100%' }), send = el('button', { type: 'button', class: 'btn btn-primary btn-sm', text: t('c_send') }), close = el('button', { type: 'button', class: 'btn btn-ghost btn-sm', text: t('c_cancel') });
      close.onclick = function () { f.remove(); };
      send.onclick = function () { send.disabled = true; var body = { reason: sel.value }; var x = ta.value.trim(); if (x) body.text = x.slice(0, 500);
        loadErrors().then(function () { return api('POST', '/api/ads/' + encodeURIComponent(adId) + '/complaints', body); }).then(function () { msg.textContent = t('c_sent'); msg.setAttribute('data-ok', '1'); send.remove(); }, function (e) { msg.textContent = errText(e); send.disabled = false; }); };
      f.appendChild(field(t('c_reason'), sel)); f.appendChild(field(t('c_text'), ta)); f.appendChild(msg); f.appendChild(send); f.appendChild(close); card.appendChild(f);
    },
    renderItems: function (box, rows, max) {   // карточки рекламы: метка всегда, «Пожаловаться» у каждой
      var self = this; css(); box.textContent = ''; var n = 0;
      (rows || []).forEach(function (r) {
        if (max && n >= max) return; n++;
        var card = el('div', { class: 'cxad-pub', 'data-ad-id': String(r.id) }); card.appendChild(el('span', { class: 'cxad-adlabel', text: r.label === 'partner_link' ? t('lbl_pl') : t('ad_label') }));
        var d = r.partner || r.event || r, title = d.name || d.title || '', text = d.description || d.text || d.venue || '';
        var img = d.logo || d.poster || d.image || ''; if (/^\/uploads\/[A-Za-z0-9._\/-]+$/.test(img)) img = (typeof g.CX_API_BASE === 'string' ? g.CX_API_BASE : '') + img; else if (!/^https:\/\/[^\s"'<>]+$/i.test(img)) img = '';
        if (img) card.appendChild(el('img', { src: img, alt: '', loading: 'lazy', style: 'max-width:100%;max-height:120px;object-fit:cover;border-radius:8px;display:block;margin:6px 0' }));
        if (title) card.appendChild(el('div', { class: 'cxad-pub-t', text: title })); if (text) card.appendChild(el('div', { class: 'cxad-pub-d', text: String(text).slice(0, 300) }));
        var href = r.link || (r.partner && r.partner.url) || ''; if (/^https?:\/\//i.test(href)) card.appendChild(el('a', { href: href, target: '_blank', rel: 'noopener noreferrer sponsored', text: t('c_open') }));
        var b = el('button', { type: 'button', class: 'btn btn-ghost btn-sm cxad-cbtn', text: t('c_btn') }); b.onclick = function () { self.complain(r.id, card); }; card.appendChild(b); box.appendChild(card);
      });
      return n;
    },
    mountPublic: function (box, o) {   // публичный показ без фильтра по месту (служебный/тестовый)
      o = o || {}; var self = this, qs = []; ['kind', 'level', 'city_id', 'country'].forEach(function (k) { if (o[k]) qs.push(k + '=' + encodeURIComponent(o[k])); });
      return api('GET', '/api/ads' + (qs.length ? '?' + qs.join('&') : '')).then(function (rows) { self.renderItems(box, rows, o.max); }, function () {});
    },
    // R15 п.1: реклама для места показа. o = {kind:'partner'|'afisha', country:'DE'|null, city:'Berlin'|null, levels:['world','country','city'], max:6}
    // уровень world — всегда; country — если страна выбрана и совпадает; city — если город выбран и совпадает с городом заказа (по /api/cities). Ротация по минутам, не больше max (6) за раз.
    paint: function (box, o) {
      if (!box) return Promise.resolve(0); o = o || {}; var self = this, now = Date.now(), lv = o.levels || ['world', 'country', 'city'], max = o.max || 6;
      function cached(key, path) { var c = self._c = self._c || {}; if (c[key] && now - c[key].t < 60000) return Promise.resolve(c[key].v); return api('GET', path).then(function (v) { c[key] = { t: now, v: v }; return v; }); }
      return cached('ads:' + (o.kind || ''), '/api/ads' + (o.kind ? '?kind=' + encodeURIComponent(o.kind) : '')).then(function (rows) {
        rows = (rows || []).filter(function (r) { return lv.indexOf(r.level) >= 0; });
        var needCity = rows.some(function (r) { return r.level === 'city'; }) && o.city;
        return (needCity ? cached('cities:' + (o.country || ''), '/api/cities' + (o.country ? '?country=' + encodeURIComponent(o.country) : '')) : Promise.resolve([])).then(function (cities) {
          var cn = String(o.city || '').trim().toLowerCase(), ids = {};
          (cities || []).forEach(function (c) { if (String(c.name || '').toLowerCase() === cn || String(c.name_en || '').toLowerCase() === cn) ids[c.id] = 1; });
          var out = rows.filter(function (r) { return r.level === 'world' || (r.level === 'country' && o.country && r.country === o.country) || (r.level === 'city' && o.city && ids[r.city_id]); });
          if (out.length > 1) { var k = Math.floor(now / 60000) % out.length; out = out.slice(k).concat(out.slice(0, k)); }
          var n = self.renderItems(box, out, max); box.style.display = n ? '' : 'none'; return n;
        });
      }, function () { box.textContent = ''; box.style.display = 'none'; return 0; });
    },
    orders: function (sec) {
      var self = this; self.refreshOrders = function () { self.orders(sec); }; sec.textContent = ''; sec.appendChild(el('h3', { text: t('h_orders') })); var list = el('div', { id: 'cxadOrders' }); sec.appendChild(list); list.textContent = t('loading');
      api('GET', '/api/ads/orders/mine').then(function (rows) {
        list.textContent = ''; if (!rows.length) { list.textContent = t('no_orders'); return; }
        rows.forEach(function (r) {
          var card = el('div', { class: 'cxad-order', 'data-status': r.status }), line = el('div', { class: 'cxad-order-h', text: '#' + r.id + ' · ' + r.kind + ' · ' + r.level + (r.country ? ' ' + r.country : '') + ' · ' + money(r.amount, r.currency) });
          var st = t('st_' + r.status); if (r.status === 'conditional' && r.conditional_until) st += ' ' + t('until', { d: fmtDate(r.conditional_until) }); if (r.status === 'active' && r.ends_at) st += ' ' + t('until', { d: fmtDate(r.ends_at) });
          card.appendChild(line); card.appendChild(el('div', { class: 'cxad-order-s', text: st })); if (r.frozen) card.appendChild(el('div', { class: 'cxad-note', text: t('frozen') })); if (r.status === 'active' || r.status === 'conditional') card.appendChild(el('span', { class: 'cxad-adlabel', text: t('ad_label') }));
          if (r.status === 'awaiting_payment' || r.status === 'pending_review') { var c = el('button', { type: 'button', class: 'btn btn-ghost btn-sm', text: t('btn_cancel') }); c.onclick = function () { api('POST', '/api/ads/orders/' + r.id + '/cancel', {}).then(function () { self.orders(sec); }, function (e) { card.appendChild(el('div', { class: 'cxad-msg', text: errText(e) })); }); }; card.appendChild(c); }
          list.appendChild(card);
        });
      }, function (e) { list.textContent = errText(e); });
    },
    gifts: function (sec) {
      sec.textContent = ''; sec.appendChild(el('h3', { text: t('h_gifts') })); var list = el('div', { id: 'cxadGifts' }); sec.appendChild(list);
      api('GET', '/api/ads/me/grants').then(function (rows) { if (!rows.length) { list.textContent = t('no_gifts'); return; } rows.forEach(function (gr) { list.appendChild(el('div', { text: t('gift_line', { p: gr.discount_pct, n: gr.remaining, d: fmtDate(gr.expires_at) }) })); }); }, function (e) { list.textContent = errText(e); });
    },
    blacklist: function (sec) {
      var self = this; sec.textContent = ''; sec.appendChild(el('h3', { text: t('h_bl') })); var list = el('div', { id: 'cxadBl' }); sec.appendChild(list);
      Promise.all([api('GET', '/api/blacklist/mine'), api('GET', '/api/appeals/mine')]).then(function (r) {
        var bl = r[0] || [], ap = r[1] || []; if (!bl.length) { list.textContent = t('bl_none'); return; }
        bl.forEach(function (e) {
          var card = el('div', { class: 'cxad-order' }); card.appendChild(el('div', { text: e.status === 'active' ? t('bl_active', { r: e.reason }) : t('bl_unblocked') }));
          ap.filter(function (a) { return a.entry_id === e.id; }).forEach(function (a) { card.appendChild(el('div', { class: 'cxad-note', text: a.status === 'open' ? t('bl_open') : a.status === 'approved' ? t('ap_approved') : t('ap_rejected', { r: a.admin_reply || '' }) })); });
          if (e.status === 'active' && !e.open_appeal_id) {
            var ta = el('textarea', { rows: '3', maxlength: '2000', placeholder: t('bl_text') }), btn = el('button', { type: 'button', class: 'btn btn-ghost btn-sm', text: t('bl_send') }), m = el('div', { class: 'cxad-msg', role: 'alert' });
            btn.onclick = function () { m.textContent = ''; btn.disabled = true; api('POST', '/api/appeals', { entry_id: e.id, text: ta.value.trim() }).then(function () { m.style.color = 'inherit'; m.textContent = t('bl_sent'); self.blacklist(sec); }, function (er) { btn.disabled = false; m.textContent = errText(er); }); };
            card.appendChild(ta); card.appendChild(btn); card.appendChild(m);
          }
          list.appendChild(card);
        });
      }, function (e) { list.textContent = errText(e); });
    }
  };
  Ads.loadErrors = loadErrors; Ads.errText = errText;
  g.CxAds = Ads;
})(window);
