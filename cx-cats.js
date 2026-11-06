/* cx-cats.js (Агент 3, R17): группы и подгруппы партнёров ТОЛЬКО с сервера (GET /api/partner-categories), своего списка нет.
   Названия: ru/en берутся с сервера, остальные 8 языков из пакетов shared/lang (ключи cg_<группа>, cs_<группа>_<подгруппа>, cd_<группа>) через CxI18n;
   нет перевода — английское название с сервера. Метки 18+/риск — по ключам подгрупп. Тексты в DOM выводить только через textContent/esc. */
(function (g) {
  'use strict';
  var byCountry = {}, list = [], map = {}, state = null, failed = false, listeners = [];
  var ADULT_GROUPS = { leisure: 1 };
  var GAMBLING = { casino: 1, poker: 1, betting: 1 };
  var INVEST = { trading: 1, cryptowallet: 1, investment: 1 };
  var LIC_GROUPS = { finance: 1, leisure: 1 }, LIC_FREE = { esports: 1, vip_tickets: 1 };
  var UI = {
    ru: { adult: '18+', gamble: 'Участие в азартных играх сопряжено с риском', invest: 'Не является инвестиционной рекомендацией. Риск потери средств', verified: '✔ Проверено: работает законно', search: 'Найти направление', none: 'Ничего не найдено', err: 'Не удалось загрузить группы', retry: 'Повторить', nofee: 'цена не задана', total: 'Итого в месяц', lic_t: 'Лицензия', lic_n: 'Номер лицензии', lic_c: 'Страна выдачи', lic_a: 'Орган, выдавший лицензию', lic_hint: 'Лицензия обязательна для этих направлений. Карточка появится на сайте после проверки администратором.', multi: 'Можно выбрать несколько направлений', sel: 'Выбрано' },
    en: { adult: '18+', gamble: 'Gambling involves risk', invest: 'Not investment advice. Risk of losing funds', verified: '✔ Verified: operates legally', search: 'Find a specialization', none: 'Nothing found', err: 'Could not load groups', retry: 'Retry', nofee: 'price not set', total: 'Total per month', lic_t: 'License', lic_n: 'License number', lic_c: 'Country of issue', lic_a: 'Issuing authority', lic_hint: 'A license is required for these specializations. The listing appears on the site after admin review.', multi: 'You can choose several specializations', sel: 'Selected' }
  };
  function base() { return typeof g.CX_API_BASE === 'string' ? g.CX_API_BASE : ''; }
  function dict(lang) { try { return g.CxI18n && g.CxI18n.dict ? g.CxI18n.dict(lang) : null; } catch (e) { return null; } }
  var own = {};
  function pack(lang, k) { var d = dict(lang) || own[lang], v = d && d[k]; return typeof v === 'string' && v !== '' ? v : null; }
  function norm(rows) {
    return (Array.isArray(rows) ? rows : []).filter(function (r) { return r && typeof r.key === 'string'; }).map(function (r) {
      return { key: r.key, icon: r.icon || '', name_ru: r.name_ru || r.key, name_en: r.name_en || r.name_ru || r.key, description: typeof r.description === 'string' ? r.description.trim().slice(0, 300) : '', admin_edited: !!r.admin_edited, subgroups: (Array.isArray(r.subgroups) ? r.subgroups : []).filter(function (s) { return s && s.key; }).map(function (s) { return { key: s.key, icon: s.icon || '', ru: s.ru || s.key, en: s.en || s.ru || s.key }; }) };
    });
  }
  var C = {
    /* страницы без CxI18n (кабинет): подгрузить пакет языка самим */
    loadPack: function (lang) {
      if (!/^[a-z]{2}$/.test(String(lang || '')) || dict(lang) || own[lang] !== undefined || typeof g.fetch !== 'function') return Promise.resolve();
      own[lang] = null;
      return g.fetch((g.CX_I18N_BASE || '') + 'lang/' + lang + '.json').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j && j.keys && typeof j.keys === 'object') own[lang] = j.keys; }, function () { delete own[lang]; });
    },
    ui: function (lang, k) { return pack(lang, 'gl_' + k) || (UI[lang] && UI[lang][k]) || UI.en[k] || k; },
    list: function () { return list; }, get: function (k) { return map[k] || null; }, failed: function () { return failed; }, loaded: function () { return state === true; },
    onLoad: function (f) { listeners.push(f); if (state === true) { try { f(list); } catch (e) {} } },
    load: function (force) {
      if (state && !force) return state === true ? Promise.resolve(list) : state;
      failed = false;
      state = g.fetch(base() + '/api/partner-categories').then(function (r) { if (!r.ok) throw new Error('http_' + r.status); return r.json(); }).then(function (rows) {
        list = norm(rows); map = {}; list.forEach(function (c) { map[c.key] = c; }); if (!list.length) failed = true; state = true;
      }, function () { list = []; map = {}; failed = true; state = true; }).then(function () { listeners.forEach(function (f) { try { f(list); } catch (e) {} }); return list; });
      return state;
    },
    /* список для страны (скрытые для неё подгруппы сервер не отдаёт); общий список не трогает */
    forCountry: function (cc) {
      cc = String(cc || '').toUpperCase().slice(0, 2); if (!cc) return Promise.resolve(list);
      if (!byCountry[cc]) byCountry[cc] = g.fetch(base() + '/api/partner-categories?country=' + encodeURIComponent(cc)).then(function (r) { if (!r.ok) throw new Error('http'); return r.json(); }).then(norm, function () { delete byCountry[cc]; return list; });
      return byCountry[cc];
    },
    gname: function (c, lang) { if (!c) return ''; if (lang === 'ru') return c.name_ru; if (lang === 'en') return c.name_en; return pack(lang, 'cg_' + c.key) || c.name_en; },
    sname: function (gk, s, lang) { if (!s) return ''; if (lang === 'ru') return s.ru; if (lang === 'en') return s.en; return pack(lang, 'cs_' + gk + '_' + s.key) || s.en; },
    gdesc: function (c, lang) { if (!c || !c.description) return ''; if (lang === 'ru' || c.admin_edited) return c.description; return pack(lang, 'cd_' + c.key) || pack('en', 'cd_' + c.key) || ''; },
    /* метки по выбранным подгруппам: 18+, азарт, инвестиции */
    flags: function (gk, subs) {
      var f = { adult: !!ADULT_GROUPS[gk], gamble: false, invest: false };
      (subs || []).forEach(function (s) { if (gk === 'leisure' && GAMBLING[s]) f.gamble = true; if (gk === 'finance' && INVEST[s]) f.invest = true; });
      return f;
    },
    /* нужна ли лицензия (подсказка для формы; решает сервер: license_required) */
    needsLicense: function (gk, subs) { return !!LIC_GROUPS[gk] && (subs || []).some(function (s) { return !/^jobs_/.test(s) && !LIC_FREE[s]; }); },
    isLicenseGroup: function (gk) { return !!LIC_GROUPS[gk]; },
    /* поиск по названиям групп и подгрупп (любой язык, без регистра) */
    search: function (q, lang) {
      q = String(q || '').trim().toLowerCase(); if (!q) return [];
      var out = [];
      list.forEach(function (c) {
        var gn = C.gname(c, lang), gm = (gn + ' ' + c.name_en + ' ' + c.name_ru).toLowerCase().indexOf(q) >= 0;
        c.subgroups.forEach(function (s) {
          var sn = C.sname(c.key, s, lang);
          if (gm || (sn + ' ' + s.en + ' ' + s.ru).toLowerCase().indexOf(q) >= 0) out.push({ group: c, sub: s, gname: gn, sname: sn });
        });
      });
      return out;
    }
  };
  g.CxCats = C;
})(window);
