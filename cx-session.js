/* cx-session.js (Агент 3, R12 п.2): единая сессия Corronyx. Подключение: <script src="shared/cx-session.js" data-role="hotel"></script>
   data-role: guest|hotel|touroperator|partner|afisha_organizer (роль страницы). Без внешних сервисов, без innerHTML с данными. */
(function (g) {
  'use strict';
  var D = g.document, LSx = null;
  try { LSx = g.localStorage; } catch (e) { LSx = null; }
  var mem = {};
  var RAW_SET = LSx ? Storage.prototype.setItem : null, RAW_REM = LSx ? Storage.prototype.removeItem : null;
  var KEY = 'cx_token', K_ROLES = 'cx_roles', K_LANG = 'cx_lang', K_OLDLANG = 'cx_hp_lang';
  var LEGACY = { guest: 'cx_guest_jwt', hotel: 'cx_hp_jwt', touroperator: 'cx_tp_jwt', partner: 'cx_pp_jwt', afisha_organizer: 'cx_ap_jwt' }; // admin намеренно отдельно (скрытый вход)
  var PAGES = { guest: 'index.html', hotel: 'hotel-portal.html', touroperator: 'tour-portal.html', partner: 'partner-portal.html', afisha_organizer: 'afisha-portal.html', admin: 'admin-dashboard.html' };
  var BUSINESS = ['hotel', 'touroperator', 'partner', 'afisha_organizer'];
  var LANGS = ['ru', 'en', 'es', 'zh', 'hi', 'ar', 'fr', 'pt', 'de', 'tr'];
  var T = { // ru en es zh hi ar fr pt de tr (es..tr без носителя, см. отчёт)
    tab_login: ['Войти', 'Log in', 'Entrar', '登录', 'लॉग इन', 'دخول', 'Connexion', 'Entrar', 'Anmelden', 'Giriş'],
    tab_reg: ['Регистрация', 'Sign up', 'Registro', '注册', 'पंजीकरण', 'تسجيل', 'Inscription', 'Cadastro', 'Registrieren', 'Kayıt'],
    f_email: ['Электронная почта', 'Email', 'Correo electrónico', '电子邮箱', 'ईमेल', 'البريد الإلكتروني', 'E-mail', 'E-mail', 'E-Mail', 'E-posta'],
    f_pass: ['Пароль (не короче 6 знаков)', 'Password (6+ characters)', 'Contraseña (mín. 6)', '密码（至少6位）', 'पासवर्ड (कम से कम 6)', 'كلمة المرور (6 على الأقل)', 'Mot de passe (6+)', 'Senha (mín. 6)', 'Passwort (mind. 6)', 'Şifre (en az 6)'],
    f_name: ['Ваше имя', 'Your name', 'Su nombre', '您的姓名', 'आपका नाम', 'اسمك', 'Votre nom', 'Seu nome', 'Ihr Name', 'Adınız'],
    kind: ['Я регистрируюсь как', 'I am signing up as', 'Me registro como', '我注册为', 'मैं इस रूप में पंजीकरण कर रहा हूँ', 'أسجّل بصفة', "Je m'inscris en tant que", 'Estou me cadastrando como', 'Ich registriere mich als', 'Şu olarak kaydoluyorum'],
    k_tourist: ['Турист', 'Traveler', 'Viajero', '游客', 'यात्री', 'مسافر', 'Voyageur', 'Viajante', 'Reisender', 'Gezgin'],
    k_business: ['Бизнес', 'Business', 'Negocio', '商家', 'व्यवसाय', 'نشاط تجاري', 'Professionnel', 'Empresa', 'Unternehmen', 'İşletme'],
    r_hotel: ['Отель', 'Hotel', 'Hotel', '酒店', 'होटल', 'فندق', 'Hôtel', 'Hotel', 'Hotel', 'Otel'],
    r_touroperator: ['Туроператор', 'Tour operator', 'Operador turístico', '旅行社', 'टूर ऑपरेटर', 'منظم رحلات', 'Tour-opérateur', 'Operadora de turismo', 'Reiseveranstalter', 'Tur operatörü'],
    r_partner: ['Партнёр', 'Partner', 'Socio', '合作伙伴', 'पार्टनर', 'شريك', 'Partenaire', 'Parceiro', 'Partner', 'Ortak'],
    r_afisha_organizer: ['Организатор афиши', 'Event organizer', 'Organizador de eventos', '活动组织者', 'इवेंट आयोजक', 'منظم فعاليات', "Organisateur d'événements", 'Organizador de eventos', 'Veranstalter', 'Etkinlik organizatörü'],
    chk_adult: ['Мне исполнилось 18 лет', 'I am 18 or older', 'Tengo 18 años o más', '我已年满18岁', 'मेरी आयु 18 वर्ष या अधिक है', 'عمري 18 عامًا أو أكثر', "J'ai 18 ans ou plus", 'Tenho 18 anos ou mais', 'Ich bin mindestens 18', '18 yaşındayım veya daha büyüğüm'],
    chk_pd: ['Согласен на обработку персональных данных', 'I agree to personal data processing', 'Acepto el tratamiento de mis datos personales', '我同意处理个人数据', 'मैं व्यक्तिगत डेटा के प्रसंस्करण से सहमत हूँ', 'أوافق على معالجة بياناتي الشخصية', 'J’accepte le traitement de mes données personnelles', 'Concordo com o tratamento dos meus dados pessoais', 'Ich stimme der Verarbeitung personenbezogener Daten zu', 'Kişisel verilerimin işlenmesini kabul ediyorum'],
    doc_terms: ['Пользовательское соглашение', 'Terms of Service', 'Términos de servicio', '用户协议', 'सेवा की शर्तें', 'شروط الخدمة', 'Conditions d’utilisation', 'Termos de Uso', 'Nutzungsbedingungen', 'Kullanım Koşulları'],
    doc_privacy: ['Политика конфиденциальности', 'Privacy Policy', 'Política de privacidad', '隐私政策', 'गोपनीयता नीति', 'سياسة الخصوصية', 'Politique de confidentialité', 'Política de Privacidade', 'Datenschutzerklärung', 'Gizlilik Politikası'],
    doc_consent: ['Согласие на обработку персональных данных', 'Consent to personal data processing', 'Consentimiento de tratamiento de datos', '个人数据处理同意书', 'व्यक्तिगत डेटा प्रसंस्करण की सहमति', 'الموافقة على معالجة البيانات الشخصية', 'Consentement au traitement des données', 'Consentimento de tratamento de dados', 'Einwilligung in die Datenverarbeitung', 'Kişisel veri işleme onayı'],
    forgot: ['Забыли пароль?', 'Forgot your password?', '¿Olvidó su contraseña?', '忘记密码？', 'पासवर्ड भूल गए?', 'نسيت كلمة المرور؟', 'Mot de passe oublié ?', 'Esqueceu a senha?', 'Passwort vergessen?', 'Şifrenizi mi unuttunuz?'],
    chk_ref: ['Хочу участвовать в реферальной программе', 'I want to join the referral program', 'Quiero unirme al programa de referidos', '我想参加推荐计划', 'मैं रेफरल कार्यक्रम में शामिल होना चाहता हूँ', 'أرغب في الانضمام إلى برنامج الإحالة', 'Je veux rejoindre le programme de parrainage', 'Quero participar do programa de indicação', 'Ich möchte am Empfehlungsprogramm teilnehmen', 'Tavsiye programına katılmak istiyorum'],
    btn_login: ['Войти', 'Log in', 'Entrar', '登录', 'लॉग इन', 'دخول', 'Se connecter', 'Entrar', 'Anmelden', 'Giriş yap'],
    btn_reg: ['Зарегистрироваться', 'Create account', 'Crear cuenta', '创建账户', 'खाता बनाएँ', 'إنشاء حساب', 'Créer un compte', 'Criar conta', 'Konto erstellen', 'Hesap oluştur'],
    btn_close: ['Закрыть', 'Close', 'Cerrar', '关闭', 'बंद करें', 'إغلاق', 'Fermer', 'Fechar', 'Schließen', 'Kapat'],
    e_generic: ['Не получилось. Попробуйте ещё раз.', 'Something went wrong. Please try again.', 'No se pudo. Inténtelo de nuevo.', '出错了，请重试。', 'कुछ गलत हो गया। फिर से प्रयास करें।', 'حدث خطأ. حاول مرة أخرى.', "Une erreur s'est produite. Réessayez.", 'Algo deu errado. Tente novamente.', 'Etwas ist schiefgelaufen. Bitte erneut versuchen.', 'Bir sorun oluştu. Tekrar deneyin.'],
    e_creds: ['Неверная почта или пароль. Если вы удаляли аккаунт, зарегистрируйтесь заново.', 'Wrong email or password. If you deleted your account, sign up again.', 'Correo o contraseña incorrectos. Si eliminó su cuenta, regístrese de nuevo.', '邮箱或密码错误。如果您删除过账户，请重新注册。', 'ईमेल या पासवर्ड गलत है। यदि आपने खाता हटाया है, तो फिर से पंजीकरण करें।', 'البريد أو كلمة المرور غير صحيحة. إذا حذفت حسابك فسجّل من جديد.', "E-mail ou mot de passe incorrect. Si vous avez supprimé votre compte, inscrivez-vous à nouveau.", 'E-mail ou senha incorretos. Se você excluiu a conta, cadastre-se novamente.', 'E-Mail oder Passwort falsch. Wenn Sie Ihr Konto gelöscht haben, registrieren Sie sich neu.', 'E-posta veya şifre hatalı. Hesabınızı sildiyseniz yeniden kaydolun.'],
    e_taken: ['Эта почта уже зарегистрирована. Войдите.', 'This email is already registered. Please log in.', 'Este correo ya está registrado. Inicie sesión.', '该邮箱已注册，请登录。', 'यह ईमेल पहले से पंजीकृत है। लॉग इन करें।', 'هذا البريد مسجّل بالفعل. سجّل الدخول.', 'Cet e-mail est déjà inscrit. Connectez-vous.', 'Este e-mail já está cadastrado. Faça login.', 'Diese E-Mail ist bereits registriert. Bitte anmelden.', 'Bu e-posta zaten kayıtlı. Giriş yapın.'],
    e_email: ['Проверьте адрес почты.', 'Check the email address.', 'Revise el correo.', '请检查邮箱地址。', 'ईमेल पता जाँचें।', 'تحقق من عنوان البريد.', "Vérifiez l'adresse e-mail.", 'Verifique o e-mail.', 'Bitte E-Mail prüfen.', 'E-posta adresini kontrol edin.'],
    e_short: ['Пароль короче 6 знаков.', 'Password is shorter than 6 characters.', 'La contraseña tiene menos de 6 caracteres.', '密码少于6位。', 'पासवर्ड 6 अक्षरों से छोटा है।', 'كلمة المرور أقل من 6 أحرف.', 'Le mot de passe fait moins de 6 caractères.', 'A senha tem menos de 6 caracteres.', 'Das Passwort hat weniger als 6 Zeichen.', 'Şifre 6 karakterden kısa.'],
    e_need: ['Заполните все поля и поставьте нужные галочки.', 'Fill in all fields and tick the required boxes.', 'Complete todos los campos y marque las casillas.', '请填写所有字段并勾选必要选项。', 'सभी फ़ील्ड भरें और आवश्यक बॉक्स चुनें।', 'املأ جميع الحقول وحدّد المربعات المطلوبة.', 'Remplissez tous les champs et cochez les cases requises.', 'Preencha todos os campos e marque as caixas obrigatórias.', 'Alle Felder ausfüllen und Pflichtfelder anhaken.', 'Tüm alanları doldurun ve gerekli kutuları işaretleyin.'],
    e_adult: ['Сервис доступен только с 18 лет.', 'The service is available from age 18 only.', 'El servicio es solo para mayores de 18.', '本服务仅限年满18岁者使用。', 'यह सेवा केवल 18+ के लिए है।', 'الخدمة متاحة لمن بلغ 18 عامًا فقط.', 'Le service est réservé aux 18 ans et plus.', 'O serviço é apenas para maiores de 18 anos.', 'Der Dienst ist erst ab 18 Jahren verfügbar.', 'Hizmet yalnızca 18 yaş ve üzeri içindir.'],
    e_many: ['Слишком много попыток. Подождите немного.', 'Too many attempts. Please wait a little.', 'Demasiados intentos. Espere un poco.', '尝试次数过多，请稍候。', 'बहुत अधिक प्रयास। कृपया प्रतीक्षा करें।', 'محاولات كثيرة. انتظر قليلًا.', 'Trop de tentatives. Patientez un peu.', 'Muitas tentativas. Aguarde um pouco.', 'Zu viele Versuche. Bitte kurz warten.', 'Çok fazla deneme. Biraz bekleyin.'],
    e_net: ['Нет связи с сервером. Проверьте интернет.', 'No connection to the server. Check your internet.', 'Sin conexión con el servidor. Revise su internet.', '无法连接服务器，请检查网络。', 'सर्वर से कनेक्शन नहीं है। इंटरनेट जाँचें।', 'لا اتصال بالخادم. تحقق من الإنترنت.', 'Pas de connexion au serveur. Vérifiez internet.', 'Sem conexão com o servidor. Verifique a internet.', 'Keine Verbindung zum Server. Internet prüfen.', 'Sunucuya bağlanılamıyor. İnterneti kontrol edin.'],
    card_hint: ['Профиль добавлен. Заполните карточку: почта и пароль уже есть, вводить их не нужно. Введённое сохраняется на этом устройстве.', 'Profile added. Fill in the card: your email and password are already set. What you type is saved on this device.', 'Perfil añadido. Complete la ficha: ya tiene correo y contraseña. Lo que escriba se guarda en este dispositivo.', '身份已添加。请填写资料卡：邮箱和密码已有，无需再输入。已填内容会保存在本设备。', 'प्रोफ़ाइल जुड़ गई। कार्ड भरें: ईमेल और पासवर्ड पहले से हैं। आपकी भरी जानकारी इस डिवाइस पर सहेजी जाती है।', 'تمت إضافة الملف. أكمل البطاقة: البريد وكلمة المرور موجودان. ما تكتبه يُحفظ على هذا الجهاز.', 'Profil ajouté. Remplissez la fiche : e-mail et mot de passe déjà enregistrés. Votre saisie est conservée sur cet appareil.', 'Perfil adicionado. Preencha a ficha: e-mail e senha já existem. O que digitar fica salvo neste dispositivo.', 'Profil hinzugefügt. Füllen Sie die Karte aus: E-Mail und Passwort sind schon vorhanden. Eingaben werden auf diesem Gerät gespeichert.', 'Profil eklendi. Kartı doldurun: e-posta ve şifre zaten var. Yazdıklarınız bu cihazda saklanır.'],
    btn_ok: ['Подтвердить', 'Confirm', 'Confirmar', '确认', 'पुष्टि करें', 'تأكيد', 'Confirmer', 'Confirmar', 'Bestätigen', 'Onayla'],
    resend: ['Отправить код ещё раз', 'Send the code again', 'Enviar el código otra vez', '重新发送验证码', 'कोड फिर से भेजें', 'إعادة إرسال الرمز', 'Renvoyer le code', 'Enviar o código novamente', 'Code erneut senden', 'Kodu tekrar gönder'],
    code_label: ['Код из письма', 'Code from the email', 'Código del correo', '邮件中的验证码', 'ईमेल में आया कोड', 'الرمز من البريد', 'Code reçu par e-mail', 'Código do e-mail', 'Code aus der E-Mail', 'E-postadaki kod'],
    s_ended: ['Сессия закончилась. Войдите снова.', 'Your session has ended. Please log in again.', 'Su sesión terminó. Inicie sesión de nuevo.', '会话已结束，请重新登录。', 'सत्र समाप्त हो गया। फिर से लॉग इन करें।', 'انتهت الجلسة. سجّل الدخول مرة أخرى.', 'Votre session a expiré. Reconnectez-vous.', 'Sua sessão terminou. Entre novamente.', 'Ihre Sitzung ist abgelaufen. Bitte erneut anmelden.', 'Oturumunuz sona erdi. Tekrar giriş yapın.'],
    sw_label: ['Профиль', 'Profile', 'Perfil', '身份', 'प्रोफ़ाइल', 'الملف', 'Profil', 'Perfil', 'Profil', 'Profil'],
    sw_add: ['Добавить профиль', 'Add a profile', 'Añadir perfil', '添加身份', 'प्रोफ़ाइल जोड़ें', 'إضافة ملف', 'Ajouter un profil', 'Adicionar perfil', 'Profil hinzufügen', 'Profil ekle'],
    sw_choose: ['Выберите профиль', 'Choose a profile', 'Elija un perfil', '请选择身份', 'प्रोफ़ाइल चुनें', 'اختر الملف', 'Choisissez un profil', 'Escolha um perfil', 'Profil wählen', 'Profil seçin'],
    r_guest: ['Турист', 'Traveler', 'Viajero', '游客', 'यात्री', 'مسافر', 'Voyageur', 'Viajante', 'Reisender', 'Gezgin'],
    logout: ['Выйти', 'Log out', 'Salir', '退出', 'लॉग आउट', 'خروج', 'Déconnexion', 'Sair', 'Abmelden', 'Çıkış'],
    logout_all: ['Выйти на всех устройствах', 'Log out on all devices', 'Salir en todos los dispositivos', '在所有设备上退出', 'सभी उपकरणों पर लॉग आउट', 'الخروج من جميع الأجهزة', 'Se déconnecter partout', 'Sair em todos os dispositivos', 'Auf allen Geräten abmelden', 'Tüm cihazlarda çıkış yap'],
    retry: ['Код уже отправлен. Повторить можно через {n} с.', 'The code has already been sent. You can retry in {n} s.', 'El código ya fue enviado. Reintente en {n} s.', '验证码已发送，可在 {n} 秒后重试。', 'कोड भेजा जा चुका है। {n} सेकंड बाद पुनः प्रयास करें।', 'تم إرسال الرمز. يمكنك إعادة المحاولة بعد {n} ث.', 'Le code a déjà été envoyé. Réessayez dans {n} s.', 'O código já foi enviado. Tente novamente em {n} s.', 'Der Code wurde bereits gesendet. Erneut möglich in {n} s.', 'Kod zaten gönderildi. {n} sn sonra tekrar deneyin.']
  };
  function lang() { var l = ''; try { l = (LSx && LSx.getItem(K_LANG)) || (LSx && LSx.getItem(K_OLDLANG)) || ''; } catch (e) {} if (LANGS.indexOf(l) < 0) { var n = (g.navigator && g.navigator.language || 'ru').slice(0, 2); l = LANGS.indexOf(n) >= 0 ? n : 'ru'; } return l; }
  function tr(k, p) { var a = T[k]; var s = a ? (a[LANGS.indexOf(lang())] || a[1]) : k; if (p) for (var q in p) s = s.replace('{' + q + '}', p[q]); return s; }
  function rd(k) { try { return LSx ? LSx.getItem(k) : (mem[k] || null); } catch (e) { return mem[k] || null; } }
  function wr(k, v) { try { if (LSx) RAW_SET.call(LSx, k, v); else mem[k] = v; } catch (e) { mem[k] = v; } }
  function rm(k) { try { if (LSx) RAW_REM.call(LSx, k); delete mem[k]; } catch (e) {} }
  function jwt(t) { try { var p = String(t).split('.')[1].replace(/-/g, '+').replace(/_/g, '/'); return JSON.parse(decodeURIComponent(escape(g.atob(p)))); } catch (e) { return null; } }
  function alive(t) { var p = jwt(t); return !!(p && (!p.exp || p.exp * 1000 > Date.now())); }
  function normRole(r) { return r === 'afisha' ? 'afisha_organizer' : r; }
  function base() { return (typeof g.CX_API_BASE === 'string') ? g.CX_API_BASE : ''; }

  var S = {
    LEGACY: LEGACY, PAGES: PAGES, BUSINESS: BUSINESS, t: tr, lang: lang,
    token: function () { var t = rd(KEY); return t && alive(t) ? t : ''; },
    role: function () { var p = jwt(this.token()); return p ? normRole(p.role) : ''; },
    roles: function () { try { return JSON.parse(rd(K_ROLES) || '[]'); } catch (e) { return []; } },
    setSession: function (resp) { // resp = ответ login/switch-role/add-role
      if (!resp || !resp.token) return;
      wr(KEY, resp.token);
      if (resp.roles) wr(K_ROLES, JSON.stringify((resp.roles || []).map(function (r) { return normRole(r.role || r); })));
      var role = normRole(resp.active_role || resp.role || (jwt(resp.token) || {}).role);
      if (LEGACY[role]) wr(LEGACY[role], resp.token);
    },
    clear: function () { rm(KEY); rm(K_ROLES); Object.keys(LEGACY).forEach(function (r) { rm(LEGACY[r]); }); },
    deviceId: function () { try { var v = g.localStorage.getItem('cx_device_id'); if (!v || v.length < 16) { v = (g.crypto && g.crypto.randomUUID) ? g.crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (ch) { var r = (g.crypto && g.crypto.getRandomValues) ? g.crypto.getRandomValues(new Uint8Array(1))[0] & 15 : Math.floor(Math.random() * 16); return (ch === 'x' ? r : (r & 3 | 8)).toString(16); }); g.localStorage.setItem('cx_device_id', v); } return v; } catch (e) { return ''; } },   // R15: X-CX-Device (защита от самореферала), не отпечаток браузера
    api: function (method, path, body) {
      var h = { 'Content-Type': 'application/json', 'X-Lang': lang() }, tok = this.token();
      if (/^\/api\/(referrals\/)?register(\?|$)/.test(String(path))) { var dv = this.deviceId(); if (dv) h['X-CX-Device'] = dv; }

      if (tok) h.Authorization = 'Bearer ' + tok;
      return g.fetch(base() + path, { method: method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok) { var e = new Error(data.error || 'request_failed'); e.status = res.status; e.payload = data; if (res.status === 401 && tok && path.indexOf('/api/login') < 0) S.sessionEnded(); throw e; }
          return data;
        });
      }, function () { var e = new Error('network'); e.isNetwork = true; throw e; });
    },
    errText: function (e) {
      if (!e) return tr('e_generic'); if (e.isNetwork) return tr('e_net');
      var c = (e.payload && e.payload.error) || ''; var m = { bad_credentials: 'e_creds', email_taken: 'e_taken', bad_email_format: 'e_email', password_too_short: 'e_short', too_many_attempts: 'e_many', too_many_requests: 'e_many', adult_confirmation_required: 'e_adult', missing_fields: 'e_need' };
      return tr(m[c] || 'e_generic');
    },
    login: function (email, pass) { return this.api('POST', '/api/login', { email: String(email).trim().toLowerCase(), password: pass }).then(function (r) { S.setSession(r); return r; }); },
    register: function (o) { // o: {email,password,name,kind:'tourist'|'business',role?,referral:bool,referralOn?}
      var body = { email: String(o.email).trim().toLowerCase(), password: o.password, name: o.name, role: 'guest', pd_consent: true, adult_confirmed: true };
      return this.api('POST', '/api/register', body).then(function () { return S.login(o.email, o.password); }).then(function (r) {
        var step = (o.kind === 'business' && BUSINESS.indexOf(o.role) >= 0) ? S.addRole(o.role) : Promise.resolve(r);
        return step.then(function (r2) {
          if (o.referral) return S.api('POST', '/api/referrals', { referral_consent: true }).then(function () { return r2; }, function () { r2.referral_failed = true; return r2; });
          return r2;
        });
      });
    },
    switchRole: function (role) { return this.api('POST', '/api/auth/switch-role', { role: role }).then(function (r) { S.setSession(r); return r; }); },
    addRole: function (role) { return this.api('POST', '/api/auth/add-role', { role: role }).then(function (r) { S.setSession(r); return r; }); },
    logout: function () { this.clear(); },
    logoutAll: function () { return this.api('POST', '/api/auth/logout-all', {}).then(function () { S.clear(); }); },
    redirectByRole: function (resp, here) { // здесь: имя текущей страницы
      var role = normRole((resp && (resp.active_role || resp.role)) || this.role()); var owned = (resp && resp.roles ? resp.roles.map(function (r) { return normRole(r.role || r); }) : this.roles());
      var biz = owned.filter(function (r) { return BUSINESS.indexOf(r) >= 0; });
      if (role === 'admin') return PAGES.admin;
      if (role === 'guest' && biz.length > 1) return { choose: biz };
      var dest = PAGES[role] || PAGES.guest;
      return (dest === here) ? null : dest;
    },
    sessionEnded: function () { this.clear(); banner(tr('s_ended')); },
    retryHint: function (sec, el) { // «код уже отправлен, повторить через N с»; el получает текст, по окончании вызывает onDone
      var n = Math.max(0, parseInt(sec, 10) || 0), done = null, id = null;
      function paint() { el.textContent = n > 0 ? tr('retry', { n: n }) : ''; }
      paint(); if (n > 0) id = g.setInterval(function () { n--; paint(); if (n <= 0) { g.clearInterval(id); if (done) done(); } }, 1000);
      return { stop: function () { if (id) g.clearInterval(id); }, onDone: function (f) { done = f; if (n <= 0) f(); } };
    }
  };

  /* ---- мини-DOM ---- */
  function el(tag, attrs, kids) { var e = D.createElement(tag); for (var k in (attrs || {})) { if (k === 'text') e.textContent = attrs[k]; else if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]); } (kids || []).forEach(function (c) { if (c) e.appendChild(c); }); return e; }
  function css() {
    if (D.getElementById('cxsStyle')) return;
    var st = el('style', { id: 'cxsStyle' }); st.textContent = '.cxs-ov{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:100000;display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:16px}.cxs-box{background:#fff;color:#1d1d24;border:1px solid #c9a24b;border-radius:14px;max-width:420px;width:100%;margin:auto;padding:18px;font:16px/1.4 system-ui,sans-serif}.cxs-box h2{margin:0 0 12px;font-size:20px}.cxs-tabs{display:flex;gap:8px;margin-bottom:12px}.cxs-tabs button,.cxs-btn{min-height:44px;border-radius:10px;border:1px solid #c9a24b;background:#fff;color:#1d1d24;font-size:16px;padding:8px 14px;cursor:pointer}.cxs-tabs button{flex:1}.cxs-tabs button[aria-selected=true],.cxs-btn.cxs-pri{background:#c9a24b;color:#1d1d24;font-weight:600}.cxs-box input[type=text],.cxs-box input[type=email],.cxs-box input[type=password],.cxs-box select{width:100%;min-height:44px!important;font-size:16px!important;margin:4px 0 10px;padding:8px;border:1px solid #999;border-radius:8px;box-sizing:border-box}.cxs-box label{display:block;font-size:14px;margin:4px 0}.cxs-chk{display:flex;gap:8px;align-items:flex-start;font-size:14px;margin:6px 0}.cxs-chk input{margin-top:3px;min-width:20px;min-height:20px}.cxs-msg{color:#b00020;min-height:20px;font-size:14px;margin:6px 0}.cxs-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.cxs-sel{width:100%;margin-top:6px;font-size:16px;min-height:40px;box-sizing:border-box}.cxs-ban{position:fixed;left:8px;right:8px;top:8px;z-index:100001;background:#fff3cd;color:#3b2f00;border:1px solid #c9a24b;border-radius:10px;padding:12px;display:flex;gap:10px;align-items:center;justify-content:space-between;font:16px system-ui,sans-serif}@media(prefers-color-scheme:dark){.cxs-box{background:#24242c;color:#f1ece0}.cxs-tabs button,.cxs-btn{background:#24242c;color:#f1ece0}.cxs-box input,.cxs-box select{background:#1a1a20;color:#f1ece0;border-color:#666}}';
    D.head.appendChild(st);
  }
  function banner(text) {
    css(); var old = D.getElementById('cxsBan'); if (old) old.remove();
    var b = el('div', { id: 'cxsBan', class: 'cxs-ban', role: 'alert' }, [el('span', { text: text }), el('button', { type: 'button', class: 'cxs-btn cxs-pri', text: tr('btn_login') })]);
    b.querySelector('button').onclick = function () { b.remove(); S.openAuth({ mode: 'login' }); };
    D.body.appendChild(b);
  }
  function field(label, type, id, ac) { var i = el('input', { type: type, id: id, autocomplete: ac || 'off' }); return { wrap: el('div', {}, [el('label', { for: id, text: label }), i]), input: i }; }
  function docLinks(label) { // ссылки на документы внутри подписи галочки (R12: как в прежней форме регистрации)
    [['terms-of-service.html', 'doc_terms'], ['privacy-policy.html', 'doc_privacy'], ['consent-personal-data.html', 'doc_consent']].forEach(function (d) {
      var a = el('a', { href: d[0], target: '_blank', rel: 'noopener', text: tr(d[1]) }); a.style.cssText = 'text-decoration:underline;margin-left:6px;display:inline-block;'; label.appendChild(el('br')); label.appendChild(a);
    });
  }
  function chk(id, label) { var i = el('input', { type: 'checkbox', id: id }); return { wrap: el('div', { class: 'cxs-chk' }, [i, el('label', { for: id, text: label })]), input: i }; }

  S.openAuth = function (opts) {
    opts = opts || {}; css(); var here = opts.here || (g.location.pathname.split('/').pop() || 'index.html'), mode = opts.mode === 'register' ? 'register' : 'login';
    var ov = el('div', { class: 'cxs-ov' }), box = el('div', { class: 'cxs-box', role: 'dialog', 'aria-modal': 'true', 'aria-label': tr('tab_login') }); ov.appendChild(box);
    var prevFocus = D.activeElement;
    function close() { if (S._authSetMode === setMode) S._authSetMode = null; ov.remove(); D.removeEventListener('keydown', onKey); if (prevFocus && prevFocus.focus) try { prevFocus.focus(); } catch (e) {} }
    function onKey(e) { if (e.key === 'Escape') close(); }
    D.addEventListener('keydown', onKey);
    ov.addEventListener('mousedown', function (e) { if (e.target === ov) close(); });
    function setMode(m) { mode = m === 'register' ? 'register' : 'login'; draw(); }
    S._authSetMode = setMode;
    function draw() {
      box.textContent = '';
      var tl = el('button', { type: 'button', role: 'tab', 'aria-selected': String(mode === 'login'), text: tr('tab_login') }), tg = el('button', { type: 'button', role: 'tab', 'aria-selected': String(mode === 'register'), text: tr('tab_reg') });
      tl.onclick = function () { mode = 'login'; draw(); }; tg.onclick = function () { mode = 'register'; draw(); };
      box.appendChild(el('div', { class: 'cxs-tabs', role: 'tablist' }, [tl, tg]));
      var name, kind, role, adult, pd, ref, em = field(tr('f_email'), 'email', 'authEmail', 'email'), pw = field(tr('f_pass'), 'password', 'authPass', mode === 'login' ? 'current-password' : 'new-password'), msg = el('div', { class: 'cxs-msg', role: 'alert' });
      if (mode === 'register') {
        name = field(tr('f_name'), 'text', 'cxsName', 'name'); box.appendChild(name.wrap);
        kind = el('select', { id: 'cxsKind' }, [el('option', { value: 'tourist', text: tr('k_tourist') }), el('option', { value: 'business', text: tr('k_business') })]);
        role = el('select', { id: 'cxsRole' }, BUSINESS.map(function (r) { return el('option', { value: r, text: tr('r_' + r) }); })); role.style.display = 'none';
        kind.onchange = function () { role.style.display = kind.value === 'business' ? '' : 'none'; if (ref) ref.wrap.style.display = kind.value === 'tourist' ? '' : 'none'; };
        box.appendChild(el('div', {}, [el('label', { for: 'cxsKind', text: tr('kind') }), kind, role]));
      }
      box.appendChild(em.wrap); box.appendChild(pw.wrap);
      if (mode === 'register') {
        adult = chk('cxsAdult', tr('chk_adult')); pd = chk('cxsPd', tr('chk_pd')); docLinks(pd.wrap.querySelector('label')); pd.wrap.id = 'authAgreePdRow'; box.appendChild(adult.wrap); box.appendChild(pd.wrap);
        if (opts.referralOn) { ref = chk('cxsRef', tr('chk_ref')); box.appendChild(ref.wrap); }
      }
      box.appendChild(msg);
      if (mode === 'login' && typeof opts.onForgot === 'function') { var fg = el('button', { type: 'button', text: tr('forgot') }); fg.style.cssText = 'background:none;border:0;padding:8px 0;min-height:44px;color:inherit;text-decoration:underline;font-size:15px;cursor:pointer'; fg.onclick = function () { close(); opts.onForgot(); }; box.appendChild(fg); }
      var go = el('button', { type: 'button', class: 'cxs-btn cxs-pri', text: tr(mode === 'login' ? 'btn_login' : 'btn_reg') }), cl = el('button', { type: 'button', class: 'cxs-btn', text: tr('btn_close') }); cl.onclick = close;
      box.appendChild(el('div', { class: 'cxs-row' }, [go, cl]));
      var busy = false;
      go.onclick = function () {
        if (busy) return; msg.textContent = '';
        var email = em.input.value.trim(), pass = pw.input.value;
        if (!email || !pass) { msg.textContent = tr('e_need'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { msg.textContent = tr('e_email'); return; }
        var p;
        if (mode === 'login') p = S.login(email, pass);
        else {
          if (pass.length < 6) { msg.textContent = tr('e_short'); return; }
          if (!name.input.value.trim() || !pd.input.checked) { msg.textContent = tr('e_need'); return; }
          if (!adult.input.checked) { msg.textContent = tr('e_adult'); return; }
          p = S.register({ email: email, password: pass, name: name.input.value.trim(), kind: kind.value, role: role.value, referral: !!(ref && ref.input.checked && kind.value === 'tourist') });
        }
        busy = true; go.disabled = true;
        p.then(function (r) { busy = false; close(); S.afterAuth(r, here, opts); }, function (e) { busy = false; go.disabled = false; msg.textContent = S.errText(e); if (e && e.payload && e.payload.retry_after_sec) S.retryHint(e.payload.retry_after_sec, msg); });
      };
      (em.input).focus();
    }
    draw(); D.body.appendChild(ov); return { close: close };
  };
  S.afterAuth = function (resp, here, opts) {
    var dest = S.redirectByRole(resp, here);
    if (dest && dest.choose) return S.chooseProfile(dest.choose, here);
    if (typeof dest === 'string') { g.location.href = dest; return; }
    if (opts && typeof opts.onDone === 'function') opts.onDone(resp); else g.location.reload();
  };
  S.chooseProfile = function (list, here) { // экран «Выберите профиль»
    css(); var ov = el('div', { class: 'cxs-ov' }), box = el('div', { class: 'cxs-box', role: 'dialog', 'aria-modal': 'true' }); ov.appendChild(box);
    box.appendChild(el('h2', { text: tr('sw_choose') }));
    ['guest'].concat(list).forEach(function (r) {
      var b = el('button', { type: 'button', class: 'cxs-btn', text: tr('r_' + r) }); b.style.cssText = 'display:block;width:100%;margin:6px 0';
      b.onclick = function () { S.switchRole(r).then(function (x) { var d = S.redirectByRole(x, here); ov.remove(); if (typeof d === 'string') g.location.href = d; else g.location.reload(); }, function (e) { alert(S.errText(e)); }); };
      box.appendChild(b);
    });
    D.body.appendChild(ov);
  };
  S.refreshRoles = function () { return this.api('GET', '/api/auth/me').then(function (r) { if (r && r.roles) wr(K_ROLES, JSON.stringify(r.roles.map(function (x) { return normRole(x.role || x); }))); return r; }); };
  S.mountSwitcher = function (container, opts) { // переключатель профилей + «Добавить профиль» + выход; opts.noLogout: у страницы свой «Выйти»
    opts = opts || {}; css();
    function draw() {
      container.textContent = ''; var roles = S.roles().filter(function (r) { return r !== 'admin'; }), cur = S.role(), here = g.location.pathname.split('/').pop();
      function go(x) { var d = S.redirectByRole(x, here); if (typeof d === 'string') g.location.href = d; else g.location.reload(); }
      var sel = el('select', { 'aria-label': tr('sw_label'), class: 'cxs-sel' }, roles.map(function (r) { var o = el('option', { value: r, text: tr('r_' + r) }); if (r === cur) o.selected = true; return o; }));
      sel.onchange = function () { S.switchRole(sel.value).then(go, function (e) { g.alert(S.errText(e)); sel.value = cur; }); };
      var free = BUSINESS.filter(function (r) { return roles.indexOf(r) < 0; });
      var add = el('select', { 'aria-label': tr('sw_add'), class: 'cxs-sel' }, [el('option', { value: '', text: tr('sw_add') })].concat(free.map(function (r) { return el('option', { value: r, text: tr('r_' + r) }); })));
      add.onchange = function () { if (!add.value) return; S.addRole(add.value).then(function (x) { var d = S.redirectByRole(x, ''); g.location.href = typeof d === 'string' ? d : PAGES[add.value]; }, function (e) { g.alert(S.errText(e)); add.value = ''; }); };
      var all = el('button', { type: 'button', class: 'cxs-btn cxs-sel', text: tr('logout_all') });
      all.onclick = function () { S.logoutAll().then(function () { g.location.href = PAGES.guest; }, function (e) { g.alert(S.errText(e)); }); };
      container.appendChild(sel); if (free.length) container.appendChild(add); container.appendChild(all);
      if (!opts.noLogout) { var out = el('button', { type: 'button', class: 'cxs-btn cxs-sel', text: tr('logout') }); out.onclick = function () { S.logout(); g.location.href = PAGES.guest; }; container.appendChild(out); }
    }
    if (!S.token()) { container.textContent = ''; return container; }
    if (!S.roles().length) S.refreshRoles().then(draw, draw); else draw();
    return container;
  };

  /* окно ввода кода вместо prompt(): Promise<строка|null>; opts: {title, retry_after_sec, onResend: () => Promise<{retry_after_sec}>} */
  S.askCode = function (opts) {
    opts = opts || {}; css();
    return new Promise(function (resolve) {
      var ov = el('div', { class: 'cxs-ov' }), box = el('div', { class: 'cxs-box', role: 'dialog', 'aria-modal': 'true', 'aria-label': tr('code_label') }); ov.appendChild(box);
      var prev = D.activeElement, timer = null;
      var inp = el('input', { type: 'text', id: 'cxsCode', inputmode: 'numeric', autocomplete: 'one-time-code', maxlength: '12' });
      var note = el('div', { class: 'cxs-msg', role: 'status' });
      note.style.color = 'inherit';
      var ok = el('button', { type: 'button', class: 'cxs-btn cxs-pri', text: tr('btn_ok') }), cancel = el('button', { type: 'button', class: 'cxs-btn', text: tr('btn_close') }), again = el('button', { type: 'button', class: 'cxs-btn', text: tr('resend') });
      if (opts.title) box.appendChild(el('h2', { text: opts.title }));
      box.appendChild(el('label', { for: 'cxsCode', text: tr('code_label') })); box.appendChild(inp); box.appendChild(note);
      box.appendChild(el('div', { class: 'cxs-row' }, [ok, cancel, opts.onResend ? again : null]));
      function done(v) { if (timer) timer.stop(); ov.remove(); D.removeEventListener('keydown', onKey); if (prev && prev.focus) try { prev.focus(); } catch (e) {} resolve(v); }
      function onKey(e) { if (e.key === 'Escape') done(null); else if (e.key === 'Enter' && D.activeElement === inp) ok.click(); }
      function wait(n) { again.disabled = n > 0; if (timer) timer.stop(); timer = S.retryHint(n, note); }
      ok.onclick = function () { var v = inp.value.trim(); if (v) done(v); };
      cancel.onclick = function () { done(null); };
      again.onclick = function () { again.disabled = true; Promise.resolve(opts.onResend()).then(function (r) { wait((r && r.retry_after_sec) || 0); }, function (e) { note.textContent = S.errText(e); again.disabled = false; }); };
      if (opts.retry_after_sec > 0) { wait(opts.retry_after_sec); timer.onDone(function () { again.disabled = false; }); }
      D.addEventListener('keydown', onKey); ov.addEventListener('mousedown', function (e) { if (e.target === ov) done(null); });
      D.body.appendChild(ov); inp.focus();
    });
  };

  /* режим карточки: после add-role нет карточки отеля/оператора (GET /api/hotels/me -> 404 hotel_not_found); вместо выхода показываем форму без почты/пароля */
  var CARD_IDS = { hotel: ['regName', 'regCountry', 'regCity', 'regAddress', 'regStars'], touroperator: ['topName', 'regCountry', 'regCity', 'topInn', 'topReestr', 'topFinObespechenie', 'topSfera'] };
  S.enterCardMode = function (kind) {
    css(); ['regEmail', 'regPass', 'regPass2', 'hpAgree'].forEach(function (id) { var e = D.getElementById(id), row = e && e.closest('.form-row'); if (row) row.style.display = 'none'; });
    try { HP.showTab('register'); } catch (e) {}   // HP объявлен как const страницы: через window недоступен
    var err = D.getElementById('registerErr');
    if (err && !D.getElementById('cxsCardHint')) { var h = el('div', { id: 'cxsCardHint', text: tr('card_hint') }); h.style.cssText = 'margin:8px 0;font-size:14px;color:var(--ok,#2e7d32)'; err.parentNode.insertBefore(h, err); }
    var key = 'cx_card_draft_' + kind, draft = {}; try { draft = JSON.parse(rd(key) || '{}'); } catch (e) { draft = {}; }
    (CARD_IDS[kind] || []).forEach(function (id) { var f = D.getElementById(id); if (!f) return; if (draft[id] && !f.value) f.value = draft[id]; f.addEventListener('input', function () { var d = {}; try { d = JSON.parse(rd(key) || '{}'); } catch (e) {} d[id] = f.value; wr(key, JSON.stringify(d)); }); });
  };
  S.cardDraftClear = function (kind) { rm('cx_card_draft_' + kind); };

  /* R13 п.7: галочка «Мне исполнилось 18 лет» в формах регистрации кабинетов (после строки согласия с id=agreeId); adult_confirmed:true шлём только при отметке */
  S.adultRow = function (agreeId) {
    var a = D.getElementById(agreeId); if (!a || D.getElementById('cxAdult18')) return; css();
    var row = (a.closest && a.closest('.form-row')) || a.parentNode, i = el('input', { type: 'checkbox', id: 'cxAdult18' });
    var w = el('div', { class: 'cxs-chk', id: 'cxAdult18Row' }, [i, el('label', { for: 'cxAdult18', text: tr('chk_adult') })]); w.style.marginTop = '8px';
    row.parentNode.insertBefore(w, row.nextSibling);
  };
  S.adultChecked = function () { var c = D.getElementById('cxAdult18'); return !!(c && c.checked); };

  /* ---- перехват записи легаси-ключей: страницы Агентов 2/4 и старый код синхронизируются без правок ---- */
  if (LSx && RAW_SET) {
    var legacyKeys = Object.keys(LEGACY).map(function (r) { return LEGACY[r]; });
    Storage.prototype.setItem = function (k, v) {
      RAW_SET.call(this, k, v);
      if (this === LSx && legacyKeys.indexOf(k) >= 0 && v && alive(v)) RAW_SET.call(LSx, KEY, v);
    };
    Storage.prototype.removeItem = function (k) {
      RAW_REM.call(this, k);
      if (this === LSx && legacyKeys.indexOf(k) >= 0) { var t = LSx.getItem(KEY); if (t && legacyKeys.every(function (x) { return LSx.getItem(x) !== t; })) RAW_REM.call(LSx, KEY); }
    };
  }
  /* ---- миграция при загрузке ---- */
  (function boot() {
    if (LSx && !rd(K_LANG) && rd(K_OLDLANG)) { wr(K_LANG, rd(K_OLDLANG)); rm(K_OLDLANG); } else if (LSx && rd(K_OLDLANG)) rm(K_OLDLANG);
    var sc = D.currentScript, pageRole = normRole((sc && sc.getAttribute('data-role')) || '');
    var tok = rd(KEY); if (tok && !alive(tok)) { rm(KEY); tok = null; }
    if (!tok) { // взять любой живой легаси-токен: сначала свой, потом остальные
      var order = [pageRole].concat(Object.keys(LEGACY)).filter(function (r) { return LEGACY[r]; });
      for (var i = 0; i < order.length && !tok; i++) { var c = rd(LEGACY[order[i]]); if (c && alive(c)) tok = c; }
      if (tok) wr(KEY, tok);
    }
    if (!tok || !pageRole || !LEGACY[pageRole]) return;
    var cur = normRole((jwt(tok) || {}).role);
    if (cur === pageRole) { wr(LEGACY[pageRole], tok); try { g.sessionStorage.removeItem('cx_sw_try'); } catch (e) {} return; }
    var own = rd(LEGACY[pageRole]); if (own && alive(own) && normRole((jwt(own) || {}).role) === pageRole) return; // у страницы уже свой рабочий токен
    if (S.roles().indexOf(pageRole) < 0 && S.roles().length) return; // профиля нет: страница покажет свой вход
    if (g.sessionStorage && g.sessionStorage.getItem('cx_sw_try')) return; // защита от петли
    S.switchRole(pageRole).then(function () { try { g.sessionStorage.setItem('cx_sw_try', '1'); } catch (e) {} g.location.reload(); }, function () {});
  })();
  g.CxSession = S;
})(window);
