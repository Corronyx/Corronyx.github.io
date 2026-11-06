/* Corronyx i18n v1 (08.10.2026, Агент 1). Подключение: <script src="i18n.js"></script> до основного скрипта.
 * CxI18n.init({storageKey:'cx_lang'});            // у каждого портала свой ключ (cx_lang, cx_hp_lang, cx_admin_lang)
 * CxI18n.t('err_generic',{code:'x'})               // перевод по цепочке: выбранный язык -> en -> ru -> ключ
 * CxI18n.errText(e.payload || e)                   // текст ошибки сервера на языке пользователя (по полю error)
 * CxI18n.fmt.number(n) / .date(iso) / .money(amount,'RUB'|'USD')  // по языку пользователя, не 'ru-RU'
 * CxI18n.setLang('de')                             // сохранить выбор, загрузить lang/de.json, dir=rtl для ar/he/fa/ur
 * Валюта по правилу проекта: РФ рубли, остальной мир доллары: CxI18n.currencyForCountry('RU') -> 'RUB'.
 * CxI18n.tr('Русский текст')                       // перевод по русскому оригиналу из пакета (раздел messages), иначе сам текст
 * CxI18n.available(cb)                             // языки для меню из lang/index.json (cb([{code,label}]))
 * ФОРМАТ ПАКЕТА lang/<код>.json (единый для всех порталов): {meta:{code,label,dir}, keys:{ключ:текст}, messages:{русский оригинал:текст}, errors:{код_ошибки:текст}}.
 *   Плоский словарь {ключ:текст} тоже читается. Цепочка: пакет выбранного языка -> en -> ru. Ключи порталов с префиксом (adm_, hp_, ix_, pp_, ap_).
 * Не охваченные словарём строки остаются на RU/EN и переводятся виджетом Google по выбору человека. */
(function (g) {
  var LANGS = ['ru','en','es','zh','hi','ar','fr','pt','de','tr'], RTL = ['ar','he','fa','ur'];
  var LOCALE = {ru:'ru-RU',en:'en-US',es:'es-ES',zh:'zh-CN',hi:'hi-IN',ar:'ar',fr:'fr-FR',pt:'pt-BR',de:'de-DE',tr:'tr-TR'};
  var ALIAS = {too_many_requests:'too_many_attempts',no_token:'invalid_token',wrong_token_type:'invalid_token',bad_proof_url:'bad_file',bad_file_content:'bad_file',no_file_or_bad_type:'bad_file',
    not_your_hotel:'forbidden',not_your_booking:'forbidden',not_your_event:'forbidden',not_your_code:'forbidden',not_your_listing:'forbidden',departure_started:'departure_in_past',checkin_started:'cannot_cancel',
    not_found_or_already_deleted:'not_found',hotel_not_found:'not_found',partner_not_found:'not_found',room_not_found:'not_found',departure_not_found:'not_found',invoice_not_found:'not_found',already_marked_paid:'already_paid',
    already_confirmed:'already_processed',already_cancelled:'already_processed',not_pending:'already_processed',bad_seats_total:'bad_number',bad_price:'bad_amount',no_amount:'bad_amount',below_minimum:'bad_amount',
    missing_name:'missing_fields',missing_type:'missing_fields',missing_country:'missing_fields',missing_132fz_fields:'missing_fields',bad_dates:'dates_unavailable'};
  var EMB = {
    en:{err_generic:'Something went wrong ({code})',err_network:'Server unavailable. Check your connection and try again',err_server_error:'Server error. Please try again',err_bad_amount:'Enter a valid amount greater than 0',err_bad_number:'Enter a valid number',err_bad_credentials:'Wrong email or password',err_bad_email_format:'Invalid email address',err_email_taken:'This email is already registered',err_password_too_short:'Password must be at least 6 characters',err_email_not_verified:'Please confirm your email first',err_cookie_consent_required:'Please accept the cookie policy first',err_code_expired:'The code has expired. Request a new one',err_bad_code:'Wrong code',err_too_many_attempts:'Too many attempts. Try again later',err_invalid_token:'Please sign in again',err_contact_required:'Provide a phone, email or website',err_bad_url:'Invalid website address',err_bad_file:'Invalid file. Upload a PNG, JPEG, WEBP or PDF',err_proof_too_large:'The file is too large',err_missing_fields:'Please fill in all required fields',err_not_found:'Not found',err_forbidden:'You do not have access to this item',err_wrong_role:'This action is not available for your account type',err_not_enough_seats:'Not enough seats available',err_bad_travelers_count:'Number of travelers must be from 1 to 50',err_departure_in_past:'This departure date has already passed',err_price_not_set:'The price for this tour is not set',err_already_paid:'Already marked as paid',err_already_processed:'This request has already been processed',err_no_pending_request:'There is no pending request',err_hotel_not_active:'This hotel has not passed moderation yet',err_cannot_cancel:'This booking can no longer be cancelled. Contact the hotel directly',err_dates_unavailable:'These dates are not available',err_profile_exists:'You already have a profile of this type',err_tx_hash_or_proof_required:'Provide a transaction hash or a receipt'},
    ru:{err_generic:'Что-то пошло не так ({code})',err_network:'Сервер недоступен. Проверьте соединение и повторите',err_server_error:'Ошибка сервера. Повторите попытку',err_bad_amount:'Введите корректную сумму больше 0',err_bad_number:'Введите корректное число',err_bad_credentials:'Неверный email или пароль',err_bad_email_format:'Некорректный email',err_email_taken:'Этот email уже зарегистрирован',err_password_too_short:'Пароль должен быть не короче 6 символов',err_email_not_verified:'Сначала подтвердите почту',err_cookie_consent_required:'Сначала примите условия использования cookie',err_code_expired:'Срок действия кода истёк. Запросите новый',err_bad_code:'Неверный код',err_too_many_attempts:'Слишком много попыток. Повторите позже',err_invalid_token:'Войдите заново',err_contact_required:'Укажите телефон, email или сайт',err_bad_url:'Некорректный адрес сайта',err_bad_file:'Неверный файл. Загрузите PNG, JPEG, WEBP или PDF',err_proof_too_large:'Файл слишком большой',err_missing_fields:'Заполните все обязательные поля',err_not_found:'Не найдено',err_forbidden:'У вас нет доступа к этому объекту',err_wrong_role:'Действие недоступно для вашего типа аккаунта',err_not_enough_seats:'Недостаточно свободных мест',err_bad_travelers_count:'Число туристов должно быть от 1 до 50',err_departure_in_past:'Дата вылета уже прошла',err_price_not_set:'Цена этого тура не задана',err_already_paid:'Уже отмечено как оплаченное',err_already_processed:'Эта заявка уже обработана',err_no_pending_request:'Нет ожидающей заявки',err_hotel_not_active:'Этот отель ещё не прошёл модерацию',err_cannot_cancel:'Эту бронь уже нельзя отменить. Свяжитесь с отелем напрямую',err_dates_unavailable:'Эти даты недоступны',err_profile_exists:'У вас уже есть профиль этого типа',err_tx_hash_or_proof_required:'Укажите хэш транзакции или приложите чек'}
  };
  var LABELS = {ru:'Русский',en:'English',es:'Español',zh:'中文',hi:'हिन्दी',ar:'العربية',fr:'Français',pt:'Português',de:'Deutsch',tr:'Türkçe'};
  var BASE = g.CX_I18N_BASE || (function () { var sc = g.document && g.document.currentScript; return sc && sc.src ? sc.src.replace(/[^/]*$/, '') : ''; })();
  var cache = {}, msgs = {}, merged = {}, state = { lang: 'en', key: 'cx_lang' };
  function norm(j, l) {
    var d = {}, m = {}, k;
    if (j && (j.errors || j.keys || j.messages || j.meta)) {
      for (k in (j.keys || {})) d[k] = j.keys[k];
      for (k in (j.errors || {})) d['err_' + k] = j.errors[k];
      m = j.messages || {};
    } else { d = j || {}; }
    cache[l] = d; msgs[l] = m; delete merged[l];
  }
  function ls(a, k, v) { try { return a === 'g' ? g.localStorage.getItem(k) : g.localStorage.setItem(k, v); } catch (e) { return null; } }
  function pick(list) { for (var i = 0; i < (list || []).length; i++) { var c = String(list[i] || '').toLowerCase().split('-')[0]; if (LANGS.indexOf(c) >= 0) return c; } return null; }
  function detect() {
    var saved = ls('g', state.key); if (LANGS.indexOf(saved) >= 0) return saved;
    var nav = g.navigator || {}; return pick(nav.languages && nav.languages.length ? nav.languages : [nav.language]) || 'en';
  }
  function apply(l) {
    state.lang = l; var d = g.document;
    if (d && d.documentElement) { d.documentElement.setAttribute('lang', l); d.documentElement.setAttribute('dir', RTL.indexOf(l) >= 0 ? 'rtl' : 'ltr'); }
  }
  function load(l, cb) { load1(l, function () { if (l === 'en') return cb(); load1('en', cb); }); } // запасной язык en грузится всегда
  function load1(l, cb) {
    if (cache[l] || !g.fetch) return cb();
    var base = g.CX_I18N_BASE || BASE;
    g.fetch(base + 'lang/' + l + '.json').then(function (r) { return r.ok ? r.json() : {}; }).then(function (j) { norm(j, l); cb(); }, function () { norm({}, l); cb(); });
  }
  function dict(l) {
    if (!merged[l]) { var o = {}, k, a = EMB[l] || {}, b = cache[l] || {}; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; merged[l] = o; }
    return merged[l];
  }
  var I = {
    LANGS: LANGS, RTL: RTL,
    init: function (o) { state.key = (o && o.storageKey) || 'cx_lang'; var l = detect(); apply(l); load(l, function () { if (o && o.onReady) o.onReady(l); }); return l; },
    get lang() { return state.lang; },
    dict: dict,
    tr: function (text) { var m = msgs[state.lang] && msgs[state.lang][text]; if (m == null) m = msgs.en && msgs.en[text]; return m == null ? text : m; },
    available: function (cb) {
      var base = g.CX_I18N_BASE || BASE, fb = LANGS.map(function (c) { return { code: c, label: LABELS[c] }; });
      if (!g.fetch) return cb(fb);
      g.fetch(base + 'lang/index.json').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { cb(j && j.languages && j.languages.length ? j.languages : fb); }, function () { cb(fb); });
    },
    setLang: function (l, cb) { if (LANGS.indexOf(l) < 0) return false; ls('s', state.key, l); apply(l); load(l, function () { if (cb) cb(l); if (g.dispatchEvent && g.CustomEvent) g.dispatchEvent(new g.CustomEvent('cx-lang', { detail: l })); }); return true; },
    t: function (k, p) {
      var s = dict(state.lang)[k]; if (s == null) s = dict('en')[k]; if (s == null) s = dict('ru')[k]; if (s == null) return k;
      return String(s).replace(/\{(\w+)\}/g, function (m, n) { return p && p[n] != null ? p[n] : m; });
    },
    errText: function (e) {
      if (!e) return I.t('err_generic', { code: '' });
      if (e.isNetwork || e.status === 0) return I.t('err_network');
      var p = e.payload || e, code = (p && p.error) || e.error || e.message || ''; code = ALIAS[code] || code;
      var k = 'err_' + code; var s = I.t(k); return s === k ? I.t('err_generic', { code: (p && p.error) || code }) : s;
    },
    currencyForCountry: function (c) { return String(c || '').toUpperCase() === 'RU' ? 'RUB' : 'USD'; },
    locale: function () { return LOCALE[state.lang] || 'en-US'; },
    fmt: {
      number: function (n, o) { return new Intl.NumberFormat(I.locale(), o).format(Number(n)); },
      money: function (n, cur) { return new Intl.NumberFormat(I.locale(), { style: 'currency', currency: cur || 'USD', currencyDisplay: 'narrowSymbol', maximumFractionDigits: cur === 'RUB' ? 0 : 2 }).format(Number(n)); },
      date: function (v, o) { var d = v instanceof Date ? v : new Date(v); return isNaN(d) ? '' : new Intl.DateTimeFormat(I.locale(), o || { year: 'numeric', month: 'short', day: 'numeric' }).format(d); }
    }
  };
  g.CxI18n = I;
})(typeof window !== 'undefined' ? window : globalThis);
