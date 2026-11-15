/* cx-site.js (R42): booking website address field with the owner's notice (hotel and tour operator cabinets)
   + occupancy sync helper (chessboard blocks -> server marks). Texts are kept here in 10 languages (no Cyrillic in the HTML pages). */
(function(){
  var DICT = {"ru": {"full_note": "Если на всех выездах тура мест нет, тур временно скрывается из общего списка для гостей и снова появляется, когда вы освободите места. Это нормально, ничего чинить не нужно.", "booked": "Занято мест", "title": "Адрес вашего сайта для бронирования", "hint": "Гости будут переходить с Corronyx на этот адрес и бронировать у вас. Без адреса вашу карточку гости не увидят.", "save": "Сохранить адрес", "saved": "Адрес сохранён", "bad": "Укажите адрес, который начинается с https://", "err": "Не удалось сохранить, попробуйте ещё раз", "note_hotel": "Гости бронируют на вашем сайте. Отмечайте занятость в шахматке, чтобы гости видели её на Corronyx, и синхронизируйте её со своей шахматкой обязательно.", "note_tour": "Гости бронируют на вашем сайте. Указывайте актуальное число свободных мест на выездах, чтобы гости видели его на Corronyx, и синхронизируйте его со своей системой обязательно."}, "en": {"full_note": "If a tour has no seats left on any departure, it is temporarily hidden from the guests’ list and appears again when you free up seats. This is normal, nothing needs fixing.", "booked": "Seats taken", "title": "Your booking website address", "hint": "Guests will go from Corronyx to this address and book with you. Without an address, guests will not see your listing.", "save": "Save address", "saved": "Address saved", "bad": "Enter an address starting with https://", "err": "Could not save, please try again", "note_hotel": "Guests book on your website. Mark occupancy in the chessboard so guests can see it on Corronyx, and always keep it in sync with your own system.", "note_tour": "Guests book on your website. Keep the number of free seats on departures up to date so guests can see it on Corronyx, and always keep it in sync with your own system."}, "es": {"full_note": "Si un tour no tiene plazas en ninguna salida, se oculta temporalmente de la lista y vuelve a aparecer cuando libere plazas. Es normal, no hay nada que arreglar.", "booked": "Plazas ocupadas", "title": "Dirección de su sitio de reservas", "hint": "Los huéspedes irán desde Corronyx a esta dirección y reservarán con usted. Sin dirección, su ficha no será visible.", "save": "Guardar dirección", "saved": "Dirección guardada", "bad": "Indique una dirección que empiece por https://", "err": "No se pudo guardar, inténtelo de nuevo", "note_hotel": "Los huéspedes reservan en su sitio. Marque la ocupación en el tablero para que los huéspedes la vean en Corronyx y sincronícela siempre con su propio sistema.", "note_tour": "Los clientes reservan en su sitio. Mantenga actualizado el número de plazas libres en las salidas para que lo vean en Corronyx y sincronícelo siempre con su propio sistema."}, "zh": {"full_note": "如果某个旅游产品所有出发日都已满员,它会暂时从客人列表中隐藏,待您释放名额后会重新出现。这是正常现象,无需处理。", "booked": "已占名额", "title": "您的预订网站地址", "hint": "客人将从 Corronyx 跳转到此地址并向您预订。没有地址,客人看不到您的信息。", "save": "保存地址", "saved": "地址已保存", "bad": "请填写以 https:// 开头的地址", "err": "保存失败,请重试", "note_hotel": "客人在您的网站上预订。请在房态表中标记占用情况,让客人在 Corronyx 上看到,并务必与您自己的系统同步。", "note_tour": "客人在您的网站上预订。请及时更新各出发日期的空余名额,让客人在 Corronyx 上看到,并务必与您自己的系统同步。"}, "hi": {"full_note": "यदि किसी टूर की सभी प्रस्थान तिथियों पर सीटें नहीं हैं, तो वह अतिथियों की सूची से अस्थायी रूप से हट जाता है और सीटें खाली करने पर फिर दिखता है। यह सामान्य है, कुछ ठीक करने की ज़रूरत नहीं।", "booked": "भरी सीटें", "title": "आपकी बुकिंग वेबसाइट का पता", "hint": "मेहमान Corronyx से इस पते पर जाकर आपसे बुक करेंगे। पते के बिना आपकी लिस्टिंग मेहमानों को नहीं दिखेगी।", "save": "पता सहेजें", "saved": "पता सहेजा गया", "bad": "https:// से शुरू होने वाला पता दर्ज करें", "err": "सहेजा नहीं जा सका, फिर कोशिश करें", "note_hotel": "मेहमान आपकी वेबसाइट पर बुक करते हैं। शतरंज तालिका में अधिभोग चिह्नित करें ताकि मेहमान उसे Corronyx पर देखें, और इसे अपने सिस्टम के साथ हमेशा सिंक रखें।", "note_tour": "मेहमान आपकी वेबसाइट पर बुक करते हैं। प्रस्थान पर खाली सीटों की संख्या अद्यतन रखें ताकि मेहमान उसे Corronyx पर देखें, और इसे अपने सिस्टम के साथ हमेशा सिंक रखें।"}, "ar": {"full_note": "إذا لم تتوفر مقاعد في أي موعد للرحلة، تُخفى الرحلة مؤقتاً من قائمة الضيوف وتعود للظهور عند توفر مقاعد. هذا أمر طبيعي ولا يحتاج إلى إصلاح.", "booked": "المقاعد المحجوزة", "title": "عنوان موقع الحجز الخاص بك", "hint": "سينتقل الضيوف من Corronyx إلى هذا العنوان ويحجزون لديك. بدون عنوان لن يظهر إعلانك للضيوف.", "save": "حفظ العنوان", "saved": "تم حفظ العنوان", "bad": "أدخل عنواناً يبدأ بـ https://", "err": "تعذر الحفظ، حاول مرة أخرى", "note_hotel": "يحجز الضيوف على موقعك. حدّد الإشغال في الجدول ليراه الضيوف على Corronyx، وزامنه دائماً مع نظامك.", "note_tour": "يحجز العملاء على موقعك. حدّث عدد المقاعد الشاغرة في الرحلات ليراه العملاء على Corronyx، وزامنه دائماً مع نظامك."}, "fr": {"full_note": "Si un circuit n’a plus de places à aucun départ, il est masqué temporairement de la liste et réapparaît dès que vous libérez des places. C’est normal, rien à corriger.", "booked": "Places occupées", "title": "Adresse de votre site de réservation", "hint": "Les clients iront de Corronyx vers cette adresse et réserveront chez vous. Sans adresse, votre fiche ne sera pas visible.", "save": "Enregistrer l’adresse", "saved": "Adresse enregistrée", "bad": "Indiquez une adresse commençant par https://", "err": "Échec de l’enregistrement, réessayez", "note_hotel": "Les clients réservent sur votre site. Indiquez l’occupation dans le planning pour qu’elle soit visible sur Corronyx et synchronisez-la toujours avec votre propre système.", "note_tour": "Les clients réservent sur votre site. Tenez à jour le nombre de places libres par départ pour qu’il soit visible sur Corronyx et synchronisez-le toujours avec votre propre système."}, "pt": {"full_note": "Se um passeio não tem vagas em nenhuma saída, ele fica oculto temporariamente da lista e volta a aparecer quando você liberar vagas. Isso é normal, nada precisa ser corrigido.", "booked": "Vagas ocupadas", "title": "Endereço do seu site de reservas", "hint": "Os hóspedes irão da Corronyx para este endereço e reservarão com você. Sem endereço, seu anúncio não será exibido.", "save": "Salvar endereço", "saved": "Endereço salvo", "bad": "Informe um endereço que comece com https://", "err": "Não foi possível salvar, tente novamente", "note_hotel": "Os hóspedes reservam no seu site. Marque a ocupação no mapa para que os hóspedes a vejam na Corronyx e sincronize-a sempre com o seu sistema.", "note_tour": "Os clientes reservam no seu site. Mantenha atualizado o número de vagas livres nas saídas para que apareça na Corronyx e sincronize-o sempre com o seu sistema."}, "de": {"full_note": "Wenn bei keiner Abfahrt einer Tour mehr Plätze frei sind, wird sie vorübergehend aus der Gästeliste ausgeblendet und erscheint wieder, sobald Plätze frei werden. Das ist normal, es muss nichts repariert werden.", "booked": "Belegte Plätze", "title": "Adresse Ihrer Buchungswebsite", "hint": "Gäste wechseln von Corronyx zu dieser Adresse und buchen bei Ihnen. Ohne Adresse ist Ihr Eintrag nicht sichtbar.", "save": "Adresse speichern", "saved": "Adresse gespeichert", "bad": "Geben Sie eine Adresse mit https:// am Anfang an", "err": "Speichern fehlgeschlagen, bitte erneut versuchen", "note_hotel": "Gäste buchen auf Ihrer Website. Tragen Sie die Belegung im Belegungsplan ein, damit Gäste sie auf Corronyx sehen, und synchronisieren Sie sie stets mit Ihrem eigenen System.", "note_tour": "Kunden buchen auf Ihrer Website. Halten Sie die Zahl freier Plätze je Abfahrt aktuell, damit sie auf Corronyx sichtbar ist, und synchronisieren Sie sie stets mit Ihrem eigenen System."}, "tr": {"full_note": "Bir turun hiçbir çıkışında yer kalmadıysa tur geçici olarak misafir listesinden gizlenir ve yer açtığınızda yeniden görünür. Bu normaldir, düzeltilecek bir şey yok.", "booked": "Dolu yerler", "title": "Rezervasyon sitenizin adresi", "hint": "Misafirler Corronyx’ten bu adrese gidip sizden rezervasyon yapar. Adres yoksa ilanınız görünmez.", "save": "Adresi kaydet", "saved": "Adres kaydedildi", "bad": "https:// ile başlayan bir adres girin", "err": "Kaydedilemedi, tekrar deneyin", "note_hotel": "Misafirler sizin sitenizde rezervasyon yapar. Doluluğu tabloda işaretleyin ki misafirler Corronyx’te görsün ve her zaman kendi sisteminizle senkronize edin.", "note_tour": "Müşteriler sizin sitenizde rezervasyon yapar. Çıkışlardaki boş yer sayısını güncel tutun ki Corronyx’te görünsün ve her zaman kendi sisteminizle senkronize edin."}};
  function lang(){ var l = ''; try { l = (localStorage.getItem('cx_lang') || '').replace(/"/g, ''); } catch(e){} l = l || document.documentElement.lang || 'en'; l = String(l).slice(0, 2).toLowerCase(); return DICT[l] ? l : 'en'; }
  function T(k){ return DICT[lang()][k] || DICT.en[k] || k; }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function api(){ return (typeof CxApi !== 'undefined') ? CxApi : window.CxApi; }
  function okUrl(u){ try { var x = new URL(String(u).trim()); return x.protocol === 'https:' && !x.username && !x.password && x.hostname.indexOf('.') > 0 && String(u).trim().length <= 300; } catch(e){ return false; } }
  var state = { box: null, kind: 'hotel', hotelId: null, loaded: false };
  function paint(msg, bad){
    var b = state.box; if(!b) return; var el = b.querySelector('[data-cxs-msg]'); if(!el) return;
    el.textContent = msg || ''; el.style.color = bad ? '#c0392b' : 'var(--gold)';
  }
  var CxSite = {
    T: T, okUrl: okUrl,
    /* registration forms: optional field with the same address check (empty is allowed, the card stays hidden from guests until it is filled) */
    regRow: function(){ return '<div class="form-row"><label>' + esc(T('title')) + '</label><input type="url" id="regBookingUrl" maxlength="300" placeholder="https://"><div style="color:var(--muted);font-size:12px;margin-top:4px;">' + esc(T('hint')) + '</div></div>'; },
    regRead: function(){ var i = document.getElementById('regBookingUrl'), v = i ? i.value.trim() : ''; if(!v) return { url: '', bad: false }; return okUrl(v) ? { url: v, bad: false } : { url: '', bad: true }; },
    html: function(kind, value){
      return '<div style="border:2px solid var(--gold);border-radius:12px;padding:14px;margin:14px 0;">'
        + '<div data-cxs-note style="font-size:17px;font-weight:700;line-height:1.4;margin-bottom:12px;">' + esc(T(kind === 'tour' ? 'note_tour' : 'note_hotel')) + '</div>'
        + '<label style="display:block;font-weight:600;margin-bottom:6px;">' + esc(T('title')) + '</label>'
        + '<div style="color:var(--muted);font-size:13px;margin-bottom:8px;">' + esc(T('hint')) + '</div>'
        + '<input type="url" data-cxs-url maxlength="300" placeholder="https://" value="' + esc(value || '') + '" style="width:100%;margin-bottom:8px;">'
        + '<button type="button" class="btn btn-primary" data-cxs-save onclick="CxSite.save()">' + esc(T('save')) + '</button>'
        + '<div data-cxs-msg style="margin-top:8px;font-size:13px;"></div></div>';
    },
    mount: function(boxId, kind){
      var box = document.getElementById(boxId); if(!box) return; state.box = box; state.kind = kind === 'tour' ? 'tour' : 'hotel'; state.loaded = false;
      box.innerHTML = CxSite.html(state.kind, '');
      return CxSite.load();
    },
    load: function(){
      var A = api(); if(!A || !state.box || !A.token || !A.token()) return Promise.resolve(false);
      return A.get('/api/hotels/me').then(function(h){
        state.hotelId = h && h.id; state.loaded = true;
        var i = state.box.querySelector('[data-cxs-url]'); if(i && h && h.booking_url) i.value = h.booking_url;
        return true;
      }).catch(function(){ return false; });
    },
    save: function(){
      var b = state.box; if(!b) return Promise.resolve(false); var i = b.querySelector('[data-cxs-url]'), v = (i && i.value || '').trim();
      if(!okUrl(v)){ paint(T('bad'), true); return Promise.resolve(false); }
      var A = api(); if(!A) return Promise.resolve(false);
      var go = state.hotelId ? Promise.resolve() : CxSite.load();
      return go.then(function(){
        if(!state.hotelId){ paint(T('err'), true); return false; }
        return A.put('/api/hotels/' + state.hotelId, { booking_url: v }).then(function(){ paint(T('saved'), false); return true; }).catch(function(){ paint(T('err'), true); return false; });
      });
    },
    /* ---------- occupancy: which chessboard blocks must be sent to the server ---------- */
    runs: function(days){
      days = days.slice().sort(); var out = [], s = null, p = null;
      function nxt(d){ var x = new Date(d + 'T00:00:00Z'); x.setUTCDate(x.getUTCDate() + 1); return x.toISOString().slice(0, 10); }
      days.forEach(function(d){ if(s === null){ s = p = d; } else if(nxt(p) === d){ p = d; } else { out.push([s, p]); s = p = d; } });
      if(s !== null) out.push([s, p]); return out;
    },
    /* blocked: {"roomId_num_YYYY-MM-DD": truthy}; units: {"roomId_num": serverUnitId}; prev: array of keys sent earlier (null on the first run).
       First run only adds (never removes), later runs add and remove exactly what changed since the last successful run. */
    diff: function(blocked, prev, units, from, to){
      var cur = {}, k;
      for(k in blocked){ if(!blocked[k]) continue; var m = /^(.+)_(\d{4}-\d{2}-\d{2})$/.exec(k); if(!m || m[2] < from || m[2] > to || !units[m[1]]) continue; cur[k] = 1; }
      var prevSet = {}; (prev || []).forEach(function(x){ prevSet[x] = 1; });
      var add = {}, del = {};
      for(k in cur) if(!prevSet[k]) add[k] = 1;
      if(prev) for(k in prevSet){ var mm = /^(.+)_(\d{4}-\d{2}-\d{2})$/.exec(k); if(mm && mm[2] >= from && mm[2] <= to && units[mm[1]] && !cur[k]) del[k] = 1; }
      var ops = [];
      function group(set, busy){
        var by = {}; for(var key in set){ var q = /^(.+)_(\d{4}-\d{2}-\d{2})$/.exec(key); (by[q[1]] = by[q[1]] || []).push(q[2]); }
        Object.keys(by).forEach(function(u){ CxSite.runs(by[u]).forEach(function(r){ ops.push({ unit_id: units[u], from: r[0], to: r[1], busy: busy }); }); });
      }
      group(add, true); group(del, false);
      return { ops: ops, next: Object.keys(cur) };
    }
  };
  window.CxSite = CxSite;
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('[data-cx-full-note]').forEach(function(e){ e.style.cssText = 'color:var(--muted);font-size:14px;margin:8px 0 14px;max-width:760px;'; e.textContent = T('full_note'); });
    document.querySelectorAll('[data-cx-reg-site]').forEach(function(e){ e.innerHTML = CxSite.regRow(); });
    var els = document.querySelectorAll('[data-cx-site-box]'); if(!els.length) return;
    /* the box is empty and hidden until the cabinet opens its section, so poll instead of IntersectionObserver (zero-size targets are unreliable) */
    var iv = setInterval(function(){
      var A = api(); if(!A || !A.token || !A.token()) return; var left = 0;
      els.forEach(function(e){
        if(e.getAttribute('data-cxs-mounted')) return; left++;
        if(e.offsetParent === null) return;
        e.setAttribute('data-cxs-mounted', '1'); CxSite.mount(e.id, e.getAttribute('data-kind'));
      });
      if(!left) clearInterval(iv);
    }, 1200);
  });
})();
