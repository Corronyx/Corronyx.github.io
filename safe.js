/* Corronyx safe-HTML v1 (08.10.2026, Агент 1). Подключение: <script src="safe.js"></script> до основного скрипта.
 * Любое значение из сервера/пользователя в HTML-атрибуте или тексте: CxSafe.esc(v) и CxSafe.url(v[, forImg]).
 * Пример:  `<img src="${CxSafe.url(h.images[0], true)}" alt="${CxSafe.esc(h.name)}">`  `<a href="${CxSafe.url(e.link)}">`
 * url(): только http(s)://…, /uploads/<имя> (с добавлением CX_API_BASE) и, если forImg, data:image/png|jpeg|webp|gif;base64; всё остальное даёт ''. */
(function (g) {
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
  function url(u, forImg) {
    u = String(u == null ? '' : u).trim(); if (!u) return '';
    if (/^https?:\/\/[^\s"'<>]+$/i.test(u)) return esc(u);
    if (/^\/uploads\/[A-Za-z0-9._\-]+$/.test(u)) return esc((g.CX_API_BASE || '') + u);
    if (forImg && /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+\/=]+$/.test(u)) return u;
    return '';
  }
  g.CxSafe = { esc: esc, url: url };
})(typeof window !== 'undefined' ? window : globalThis);
