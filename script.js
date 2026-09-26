/**
 * Avital & Me — One Year Anniversary
 * Login -> Quiz -> Story
 */

(function () {
  'use strict';

  // ——— Valid access codes ———
  const VALID_CODES = new Set([
    '0547866885',
    '05.11.2000',
    '05112000',
  ]);

  /**
   * QUIZ CONFIG — edit correctIndex / correctAnswer to customize
   * For multiple-choice: correctIndex is 0-based index into options[]
   * For pin: correctAnswer is the expected string
   */
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      type: 'choice',
      question: 'איפה היתה הנשיקה הראשונה שלנו?',
      options: [
        'על ספסל בפארק',
        'במכונית אחרי הדייט',
        'על הגג תחת הכוכבים',
        'בכניסה לבניין שלך',
      ],
      // <<< Change this index to set the correct answer (0–3)
      correctIndex: 1,
    },
    {
      id: 2,
      type: 'choice',
      question: 'מי שלח הודעה ראשון בפייסבוק?',
      options: [
        'רון',
        'אביטל',
        'שנינו ביחד',
      ],
      // <<< Correct answer: "רון"
      correctIndex: 0,
    },
    {
      id: 3,
      type: 'choice',
      question: 'מה המאכל ששנינו הכי אוהבים להזמין?',
      options: [
        'סושי',
        'פיצה',
        'המבורגר',
        'הכל!',
      ],
      correctIndex: 3, // "הכל!"
    },
    {
      id: 4,
      type: 'choice',
      question: 'מה מקום הבילוי שאנחנו הכי אוהבים?',
      options: [
        'מסעדה יוקרתית',
        'הים בערב',
        'איחוד הצלה',
        'סרט בבית',
      ],
      correctIndex: 2, // "איחוד הצלה"
    },
    {
      id: 5,
      type: 'pin',
      question: 'מה הקוד לצאט הסודי?',
      // <<< Final unlock code — correct answer unlocks the Love Letter
      correctAnswer: '1105',
      placeholder: '****',
      submitLabel: 'פתחי את המכתב',
    },
  ];

  const MSG = {
    wrong: '\u05db\u05de\u05e2\u05d8... \u05e0\u05e1\u05d9 \u05e9\u05d5\u05d1! \U0001f609',
    correct: [
      '\u05e0\u05db\u05d5\u05df! \u2764',
      '\u05d1\u05d3\u05d9\u05d5\u05e7 \u05e9\u05dc\u05da \u2728',
      '\u05db\u05da \u05d9\u05d5\u05d3\u05e2\u05ea \u05d0\u05d5\u05ea\u05d9 \u05d4\u05db\u05d9 \u05d8\u05d5\u05d1 \U0001f495',
      '\u05de\u05d5\u05e9\u05dc\u05de\u05ea! \u2726',
    ],
    progress: function (n, total) {
      return '\u05e9\u05d0\u05dc\u05d4 ' + n + ' \u05de\u05ea\u05d5\u05da ' + total;
    },
  };

  // ——— DOM ———
  const body = document.body;
  const loginSection = document.getElementById('login-section');
  const quizSection = document.getElementById('quiz-section');
  const storySection = document.getElementById('story-section');
  const accessForm = document.getElementById('access-form');
  const accessInput = document.getElementById('access-code');
  const errorMessage = document.getElementById('error-message');
  const enterBtn = document.getElementById('enter-btn');
  const successSplash = document.getElementById('success-splash');
  const splashHearts = document.getElementById('splash-hearts');
  const canvas = document.getElementById('particles');
  const quizStage = document.getElementById('quiz-stage');
  const quizFeedback = document.getElementById('quiz-feedback');
  const quizProgressText = document.getElementById('quiz-progress-text');
  const quizProgressFill = document.getElementById('quiz-progress-fill');
  const quizProgressBar = document.getElementById('quiz-progress-bar');
  const quizCelebrate = document.getElementById('quiz-celebrate');
  const celebrateBurst = document.getElementById('celebrate-burst');
  const letterSection = document.getElementById('letter-section');
  const envelope = document.getElementById('envelope');
  const loveLetter = document.getElementById('love-letter');
  const letterTitleEl = document.getElementById('letter-title');
  const letterBodyEl = document.getElementById('letter-body');
  const continueStoryBtn = document.getElementById('continue-story-btn');
  const letterConfetti = document.getElementById('letter-confetti');

  let quizIndex = 0;
  let quizLocked = false;

  body.classList.add('is-locked');

  // ——— Normalize & validate login ———
  function normalizeCode(raw) {
    return String(raw || '')
      .trim()
      .replace(/\s+/g, '')
      .replace(/-/g, '')
      .replace(/\//g, '.');
  }

  function isValidCode(value) {
    const code = normalizeCode(value);
    if (VALID_CODES.has(code)) return true;

    const withDashes = String(value || '')
      .trim()
      .replace(/\s+/g, '');
    if (withDashes === '05-11-2000') return true;

    const digits = code.replace(/\D/g, '');
    if (digits === '0547866885' || digits === '05112000') return true;

    return false;
  }

  accessForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const value = accessInput.value;
    if (!isValidCode(value)) {
      showError();
      return;
    }
    hideError();
    goToQuiz();
  });

  function showError() {
    errorMessage.hidden = false;
    accessInput.classList.add('is-error');
    accessInput.focus();
    window.setTimeout(function () {
      accessInput.classList.remove('is-error');
    }, 500);
  }

  function hideError() {
    errorMessage.hidden = true;
    accessInput.classList.remove('is-error');
  }

  // ——— Login -> Quiz ———
  function goToQuiz() {
    enterBtn.disabled = true;
    playHeartSplash(splashHearts, successSplash);

    window.setTimeout(function () {
      loginSection.classList.add('is-leaving');

      window.setTimeout(function () {
        loginSection.setAttribute('hidden', '');
        loginSection.style.display = 'none';
        successSplash.classList.remove('is-active');

        quizSection.hidden = false;
        void quizSection.offsetWidth;
        quizSection.classList.add('is-entering');

        startQuiz();
      }, 850);
    }, 1200);
  }

  function playHeartSplash(container, overlay) {
    if (overlay) {
      overlay.classList.add('is-active');
      overlay.setAttribute('aria-hidden', 'false');
    }
    container.innerHTML = '';
    for (let i = 0; i < 18; i++) {
      const heart = document.createElement('span');
      heart.className = 'splash-heart';
      heart.textContent = i % 3 === 0 ? '\u2726' : '\u2764';
      heart.style.left = 35 + Math.random() * 30 + '%';
      heart.style.top = 40 + Math.random() * 20 + '%';
      heart.style.fontSize = 0.9 + Math.random() * 1.4 + 'rem';
      heart.style.color = i % 2 === 0 ? '#B76E79' : '#E8D5A3';
      heart.style.setProperty('--hx', (Math.random() - 0.5) * 280 + 'px');
      heart.style.setProperty('--hy', -80 - Math.random() * 220 + 'px');
      heart.style.animationDelay = Math.random() * 0.35 + 's';
      container.appendChild(heart);
    }
  }

  // ——— Quiz engine ———
  function startQuiz() {
    quizIndex = 0;
    quizLocked = false;
    updateProgress();
    renderQuestion(quizIndex);
  }

  function updateProgress() {
    const total = QUIZ_QUESTIONS.length;
    const current = quizIndex + 1;
    quizProgressText.textContent = MSG.progress(current, total);
    const pct = (current / total) * 100;
    quizProgressFill.style.width = pct + '%';
    quizProgressBar.setAttribute('aria-valuenow', String(current));
  }

  function renderQuestion(index) {
    const q = QUIZ_QUESTIONS[index];
    quizStage.innerHTML = '';
    hideQuizFeedback();

    const wrap = document.createElement('div');
    wrap.className = 'quiz-question';
    wrap.dataset.qid = String(q.id);

    const title = document.createElement('p');
    title.className = 'quiz-q-text';
    title.textContent = q.question;
    wrap.appendChild(title);

    if (q.type === 'pin') {
      const pinWrap = document.createElement('div');
      pinWrap.className = 'quiz-pin-wrap';

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'quiz-pin-input';
      input.inputMode = 'numeric';
      input.maxLength = 8;
      input.placeholder = q.placeholder || '****';
      input.setAttribute('aria-label', q.question);
      input.autocomplete = 'off';

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-pin-btn';
      btn.textContent = q.submitLabel || '\u05d1\u05d3\u05d9\u05e7\u05d4';

      function submitPin() {
        if (quizLocked) return;
        const val = String(input.value || '').trim().replace(/\s+/g, '');
        if (val === String(q.correctAnswer)) {
          onCorrect(null);
        } else {
          input.classList.add('is-error');
          showQuizFeedback(MSG.wrongPin || MSG.wrong, false);
          window.setTimeout(function () {
            input.classList.remove('is-error');
          }, 500);
        }
      }

      btn.addEventListener('click', submitPin);
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          submitPin();
        }
      });

      pinWrap.appendChild(input);
      pinWrap.appendChild(btn);
      wrap.appendChild(pinWrap);

      quizStage.appendChild(wrap);
      requestAnimationFrame(function () {
        wrap.classList.add('is-active');
        input.focus();
      });
      return;
    }

    const list = document.createElement('div');
    list.className = 'quiz-options';
    list.setAttribute('role', 'group');
    list.setAttribute('aria-label', q.question);

    q.options.forEach(function (label, i) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-option';
      btn.textContent = label;
      btn.addEventListener('click', function () {
        if (quizLocked) return;
        if (i === q.correctIndex) {
          onCorrect(btn);
        } else {
          btn.classList.add('is-wrong');
          showQuizFeedback(MSG.wrong, false);
          window.setTimeout(function () {
            btn.classList.remove('is-wrong');
          }, 500);
        }
      });
      list.appendChild(btn);
    });

    wrap.appendChild(list);
    quizStage.appendChild(wrap);
    requestAnimationFrame(function () {
      wrap.classList.add('is-active');
    });
  }

  function onCorrect(correctBtn) {
    quizLocked = true;
    if (correctBtn) correctBtn.classList.add('is-correct');

    const msg = MSG.correct[quizIndex % MSG.correct.length];
    showQuizFeedback(msg, true);
    spawnMiniHearts();

    const current = quizStage.querySelector('.quiz-question');

    window.setTimeout(function () {
      if (current) current.classList.add('is-exit');

      window.setTimeout(function () {
        quizIndex += 1;
        if (quizIndex >= QUIZ_QUESTIONS.length) {
          finishQuiz();
          return;
        }
        quizLocked = false;
        updateProgress();
        renderQuestion(quizIndex);
      }, 420);
    }, 900);
  }

  function showQuizFeedback(text, success) {
    quizFeedback.hidden = false;
    quizFeedback.textContent = text;
    quizFeedback.classList.toggle('is-success', !!success);
  }

  function hideQuizFeedback() {
    quizFeedback.hidden = true;
    quizFeedback.textContent = '';
    quizFeedback.classList.remove('is-success');
  }

  function spawnMiniHearts() {
    const layer = document.createElement('div');
    layer.className = 'quiz-mini-hearts';
    for (let i = 0; i < 10; i++) {
      const h = document.createElement('span');
      h.className = 'quiz-mini-heart';
      h.textContent = i % 2 === 0 ? '\u2764' : '\u2726';
      h.style.color = i % 2 === 0 ? '#B76E79' : '#E8D5A3';
      h.style.setProperty('--qx', (Math.random() - 0.5) * 160 + 'px');
      h.style.setProperty('--qy', -40 - Math.random() * 100 + 'px');
      h.style.animationDelay = Math.random() * 0.2 + 's';
      layer.appendChild(h);
    }
    quizStage.appendChild(layer);
    window.setTimeout(function () {
      layer.remove();
    }, 1100);
  }

  // ——— Quiz complete -> Story ———

  // ——— Love Letter content (edit freely) ———
  const LETTER = {
    title: 'אביטל אהובתי ❤',
    paragraphs: [
      'קודם כל אני רוצה להגיד לך שאני את האמת לא יודע מאיפה להתחיל... תקחי אותי אחורה, אולי אני באמת אצליח להגיד מזל טוב קטן כי זה קצת היה פחות מורכב.. אבל עכשיו? איך אומרים? מה אומרים? אף פעם לא הרגשתי ככה.',
      'אביטל אהובתי, אני באמת באמת קודם כל רוצה לאחל לך שרק תקרעי מצחוק כמו שאני אוהב שאת צוחקת, ושרק תחייכי – כי יש לך חיוך פשוט מושלם, שלא לדבר על המראה. מאחל לך נחת ושקט מהילדים, מהמשפחה ובעיקר מהחיים. תמשיכי לקחת את החיים בקלות, בשמחה, לראות את האור ואת העולם הורוד בכל דבר שקורה לך ובכל תפנית בעלילה שה׳ יתברך שם אותך בה (וכנראה שגם לא סתם, כי רק את יכולה לעבור את זה ולהצליח להמשיך).',
      'אני מודה עלייך בכל יום שהכרתי אותך. שיש לי איזה שותפה שאפשר לדבר איתה על איחוד או אפילו סתם על החיים, ללמוד איתה דברים, לשתף אותה בדברים הכי מפגרים ביום יום וגם הכי קשים שיש. אני מעריך אותך ברמות ומאחל לכל בחורה בעולם הזה לקחת אותך בתור דמות להשראה, עם הלב הענק שיש לך והאופי המושלם שלך.',
      'בעולם אחר שנינו נמצאים על איזה יאכטה או בית מלון בחדר מסאז\', אבל כנראה שהמסאז\' היחיד שיהיה זה במאזדה שחורה שבוע הבא... בנתיים גם שם אני מודה שלא אפסיק להתאהב 😉.',
      'אני מתגעגע אלייך מאוד האמת, וכיף לקחת חלק ואת ההרגשה שהיום זה היום שלך שבאת לעולם – ובעיקר באת לעולם שלי ותפסת בו מקום לא קטן. אני תמיד פה בשבילך להכל, והלוואי שגם לבייביסיטר. אני תמיד אהיה לצידך ותמיד אתמוך בך בהכל – גם בחיים וגם מול כל הבנים שעומדים בדלת ומחכים לך...',
      'בא לי לתת לך חיבוק ענק ויותר מחיבוק חברי, ופשוט לקחת יין לבן ומשם ימים יגידו 🍷.',
      'אז המון המון המון מזל טוב! שיהיה לך אושר ועושר בחיים, רק הצלחה בכל מה שאת נוגעת בו ומתעסקת בו בחייך. הלוואי שבעזרת ה\' ירפו ממך גם כל הבנים... אבל האמת שאני מבין אותם, זה ממש קשה ובצדק, אין לי כל כך זכות דיבור על זה.\n\nאני אוהב אותך ברמות, ובעזרת ה\' שבוע הבא לכי תדעי מה תקבלי ❤🫣',
    ],
  };

  let letterOpened = false;
  let typingTimer = null;

  function finishQuiz() {
    quizProgressFill.style.width = '100%';
    playGrandCelebration();
    spawnLetterConfetti();

    window.setTimeout(function () {
      quizSection.classList.remove('is-entering');
      quizSection.classList.add('is-leaving');

      window.setTimeout(function () {
        quizSection.setAttribute('hidden', '');
        quizSection.style.display = 'none';

        showLetterStage();
      }, 850);
    }, 2200);
  }

  function showLetterStage() {
    letterSection.hidden = false;
    void letterSection.offsetWidth;
    letterSection.classList.add('is-entering', 'is-letter-only');
    body.classList.remove('is-locked', 'has-app-nav', 'stage-hub');
    body.classList.add('is-unlocked', 'stage-letter');
    // Nav stays hidden in stage 3
    const nav = document.getElementById('app-nav');
    if (nav) {
      nav.hidden = true;
      nav.classList.remove('is-visible');
    }
  }

  function spawnLetterConfetti() {
    if (!letterConfetti) return;
    letterConfetti.innerHTML = '';
    const symbols = ['❤', '✦', '✨', '◆', '❤'];
    const colors = ['#B76E79', '#E8D5A3', '#D4AF37', '#E8C4C8', '#f5efe6'];
    for (let i = 0; i < 48; i++) {
      const p = document.createElement('span');
      p.className = 'confetti-piece';
      p.textContent = symbols[i % symbols.length];
      p.style.left = Math.random() * 100 + '%';
      p.style.color = colors[i % colors.length];
      p.style.fontSize = 0.7 + Math.random() * 1.1 + 'rem';
      p.style.animationDelay = Math.random() * 1.2 + 's';
      p.style.animationDuration = 2.4 + Math.random() * 1.8 + 's';
      letterConfetti.appendChild(p);
    }
    window.setTimeout(function () {
      letterConfetti.innerHTML = '';
    }, 5000);
  }

  if (envelope) {
    envelope.addEventListener('click', openEnvelope);
  }

  function openEnvelope() {
    if (letterOpened) return;
    letterOpened = true;
    envelope.disabled = true;
    envelope.classList.add('is-opening');
    spawnLetterConfetti();

    window.setTimeout(function () {
      envelope.classList.add('is-hidden');
      loveLetter.hidden = false;
      void loveLetter.offsetWidth;
      loveLetter.classList.add('is-visible');
      startTypewriter();
    }, 900);
  }

  function startTypewriter() {
    letterTitleEl.textContent = '';
    letterBodyEl.innerHTML = '';
    continueStoryBtn.hidden = true;
    continueStoryBtn.classList.remove('is-shown');

    const cursor = document.createElement('span');
    cursor.className = 'letter-cursor';
    cursor.setAttribute('aria-hidden', 'true');

    let titleDone = false;
    let titleIdx = 0;
    const title = LETTER.title;

    function typeTitle() {
      if (titleIdx < title.length) {
        letterTitleEl.textContent = title.slice(0, titleIdx + 1);
        letterTitleEl.appendChild(cursor);
        titleIdx += 1;
        typingTimer = window.setTimeout(typeTitle, 55);
      } else {
        titleDone = true;
        letterTitleEl.textContent = title;
        typeParagraphs(0);
      }
    }

    function typeParagraphs(pIndex) {
      if (pIndex >= LETTER.paragraphs.length) {
        cursor.remove();
        finishLetterTyping();
        return;
      }

      const p = document.createElement('p');
      letterBodyEl.appendChild(p);
      p.appendChild(cursor);

      const text = LETTER.paragraphs[pIndex];
      let i = 0;

      function tick() {
        if (i < text.length) {
          // Handle newlines inside a paragraph
          if (text[i] === '\n') {
            p.appendChild(document.createElement('br'));
          } else {
            p.insertBefore(document.createTextNode(text[i]), cursor);
          }
          i += 1;
          const delay = text[i - 1] === '.' || text[i - 1] === '!' || text[i - 1] === '?' ? 90
            : text[i - 1] === ',' || text[i - 1] === '–' ? 45
            : 18;
          typingTimer = window.setTimeout(tick, delay);
          // gentle auto-scroll as letter grows
          loveLetter.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
          cursor.remove();
          typingTimer = window.setTimeout(function () {
            typeParagraphs(pIndex + 1);
          }, 280);
        }
      }

      tick();
    }

    typeTitle();
  }

  function finishLetterTyping() {
    if (continueStoryBtn) {
      continueStoryBtn.hidden = false;
      requestAnimationFrame(function () {
        continueStoryBtn.classList.add('is-shown');
      });
    }
  }

  if (continueStoryBtn) {
    continueStoryBtn.addEventListener('click', goToStory);
  }


  // ——— Post-letter extras: timer, reasons, scratch vouchers ———
  const TOGETHER_SINCE = new Date(2025, 8, 28, 0, 0, 0); // 28.09.2025 (month is 0-indexed)

  const LOVE_REASONS = [
    'את החברה הכי טובה שלי בעולם, שאפשר לסמוך עליה בעיניים עצומות.',
    'את הכי אמינה ונאמנה לי שיש, תמיד שם בשבילי.',
    'את האמא הכי טובה בעולם, עם הלב הכי ענקי שיש.',
    'אני יודע שאת תעזרי לי בכל דבר שרק אבקש, בלי להסס.',
    'את מעריכה אותי ואת כל מה שאנחנו בונים יחד.',
    'בגלל החיוך המושלם שלך שמריץ לי את הלב בכל פעם מחדש.',
    'כי אין עוד שותפה כמוך לשיחות עומק על החיים ועל איחוד הצלה.',
    'בגלל הצחוק המשחרר והאמיתי שלך שגורם לי להתאהב מחדש.',
  ];

  const VOUCHERS = [
    { id: 'v1', text: 'ערב יין לבן מפנק במאזדה השחורה (או בבית)' },
    { id: 'v2', text: 'ארוחת ערב מושקעת לבחירתך מעשה ידי' },
    { id: 'v3', text: 'פטור מלא מנקיונות ומטלות ליומיים' },
    { id: 'v4', text: 'יום כיף מפנק ורגוע רק שנינו' },
  ];

  const LS_VOUCHER = 'avital_voucher_v2';
  const ADMIN_CODE = '1105';

  const LOVE_QUOTES = [
    'כל פעם שאני חושב עלייך, העולם פתאום מרגיש קצת יותר טוב.',
    'את לא סתם בחורה בחיי — את הבית שאליו הלב שלי חוזר.',
    'יש אנשים שמדברים על אהבה. איתך אני פשוט מרגיש אותה.',
    'החיוך שלך עושה לי סדר גם בימים הכי מבולגנים.',
    'אני אוהב אותך בגרסה השקטה, בגרסה הצוחקת, ובגרסה האמיתית ביותר שלך.',
    'את ההוכחה שלי שגם הודעה אחת בפייסבוק יכולה לשנות חיים.',
    'תודה שאת נותנת לי מקום בלב שלך — זה המקום הכי יקר לי.',
    'איתך אני מרגיש שאפשר גם לעוף וגם לנחות בבטחה.',
    'את החזקה והרכה באותו זמן, וזה פשוט מדהים.',
    'כל שיחה איתך מרגישה כמו חיבוק במילים.',
    'אני גאה בך יותר ממה שמילים יכולות להחזיק.',
    'הלב שלי מכיר אותך גם כשאת שותקת.',
    'את מלמדת אותי לאהוב טוב יותר, בכל יום מחדש.',
    'גם מרחוק, את קרובה אליי יותר מהכל.',
    'יש לי מזל שדווקא אותך פגשתי בדרך.',
    'את האור הוורוד שאני בוחר לראות בעולם.',
    'אוהב את האמת שלך, את הצחוק שלך, ואת מי שאת כשאת פשוט את.',
    'בשבילי את לא עוד פרק — את כל הספר.',
    'אם אהבה הייתה מקום, הייתי בונה בו בית איתך.',
    'אני כאן. תמיד. גם כשקשה, גם כשכיף, ובעיקר כשצריך לב.',
  ];

  const letterExtras = document.getElementById('letter-extras');
  const reasonCard = document.getElementById('reason-card');
  const reasonText = document.getElementById('reason-text');
  const reasonBtn = document.getElementById('reason-btn');
  const vouchersGrid = document.getElementById('vouchers-grid');
  const voucherLockMsg = document.getElementById('voucher-lock-msg');
  const voucherAdminBtn = document.getElementById('voucher-admin-btn');
  const voucherAdminHint = document.getElementById('voucher-admin-hint');
  const quoteCard = document.getElementById('quote-card');
  const quoteText = document.getElementById('quote-text');
  const quoteBtn = document.getElementById('quote-btn');

  let timerInterval = null;
  let lastReasonIndex = -1;
  let lastQuoteIndex = -1;

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function updateTogetherTimer() {
    const now = new Date();
    let diff = Math.max(0, now - TOGETHER_SINCE);
    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const mins = Math.floor(diff / 60000);
    diff -= mins * 60000;
    const secs = Math.floor(diff / 1000);

    const d = document.getElementById('tc-days');
    const h = document.getElementById('tc-hours');
    const m = document.getElementById('tc-mins');
    const s = document.getElementById('tc-secs');
    if (d) d.textContent = String(days);
    if (h) h.textContent = pad2(hours);
    if (m) m.textContent = pad2(mins);
    if (s) s.textContent = pad2(secs);
  }

  function startTogetherTimer() {
    updateTogetherTimer();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTogetherTimer, 1000);
  }

  function showLetterExtras() {
    // Stage 3 no longer reveals extras; hub opens via continue button
  }

  function initReasons() {
    if (!reasonBtn || reasonBtn.dataset.bound) return;
    reasonBtn.dataset.bound = '1';
    reasonBtn.addEventListener('click', function () {
      let idx = Math.floor(Math.random() * LOVE_REASONS.length);
      if (LOVE_REASONS.length > 1) {
        while (idx === lastReasonIndex) {
          idx = Math.floor(Math.random() * LOVE_REASONS.length);
        }
      }
      lastReasonIndex = idx;
      reasonCard.classList.add('is-flipping');
      window.setTimeout(function () {
        reasonText.textContent = LOVE_REASONS[idx];
        reasonText.classList.remove('reason-placeholder');
        reasonCard.classList.remove('is-flipping');
      }, 280);
    });
  }

  function initLoveQuotes() {
    if (!quoteBtn || quoteBtn.dataset.bound) return;
    quoteBtn.dataset.bound = '1';
    quoteBtn.addEventListener('click', function () {
      let idx = Math.floor(Math.random() * LOVE_QUOTES.length);
      if (LOVE_QUOTES.length > 1) {
        while (idx === lastQuoteIndex) {
          idx = Math.floor(Math.random() * LOVE_QUOTES.length);
        }
      }
      lastQuoteIndex = idx;
      if (quoteCard) quoteCard.classList.add('is-fading');
      window.setTimeout(function () {
        if (quoteText) quoteText.textContent = LOVE_QUOTES[idx];
        if (quoteCard) quoteCard.classList.remove('is-fading');
      }, 280);
    });
  }

  function defaultVoucherState() {
    return { extraSlots: 0, scratched: {} };
  }

  function readVoucherState() {
    try {
      const raw = localStorage.getItem(LS_VOUCHER);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          if (!parsed.scratched) parsed.scratched = {};
          if (typeof parsed.extraSlots !== 'number') parsed.extraSlots = 0;
          return parsed;
        }
      }
      // migrate legacy v1 format { id, redeemed }
      const legacy = localStorage.getItem('avital_voucher_v1');
      if (legacy) {
        const old = JSON.parse(legacy);
        if (old && old.id) {
          const migrated = {
            extraSlots: 0,
            scratched: {},
          };
          migrated.scratched[old.id] = {
            redeemed: !!old.redeemed,
            at: old.at || Date.now(),
          };
          writeVoucherState(migrated);
          return migrated;
        }
      }
    } catch (e) { /* ignore */ }
    return defaultVoucherState();
  }

  function writeVoucherState(state) {
    try {
      localStorage.setItem(LS_VOUCHER, JSON.stringify(state));
    } catch (e) { /* ignore quota */ }
  }

  function allowedVoucherCount(state) {
    return 1 + (state.extraSlots || 0);
  }

  function scratchedCount(state) {
    return Object.keys(state.scratched || {}).length;
  }

  function refreshVoucherLocks() {
    const state = readVoucherState();
    const allowed = allowedVoucherCount(state);
    const used = scratchedCount(state);
    const remaining = Math.max(0, allowed - used);

    if (voucherLockMsg) {
      if (used >= 1 && remaining === 0) {
        voucherLockMsg.hidden = false;
        voucherLockMsg.textContent = 'הגעת למכסת השוברים. אפשר לבקש אישור מנהל לשובר נוסף ✨';
      } else if (remaining > 0 && used >= 1) {
        voucherLockMsg.hidden = false;
        voucherLockMsg.textContent = 'נשאר לך עוד ' + remaining + ' שובר' + (remaining > 1 ? 'ים' : '') + ' לפתוח 🎁';
      } else if (used === 0) {
        voucherLockMsg.hidden = false;
        voucherLockMsg.textContent = 'בחרי שובר אחד, גרדי אותו וצלמי לי מסך כדי לממש!';
      } else {
        voucherLockMsg.hidden = true;
      }
    }

    if (!vouchersGrid) return;
    vouchersGrid.querySelectorAll('.voucher-card').forEach(function (c) {
      const id = c.dataset.id;
      const isScratched = !!(state.scratched && state.scratched[id]);
      if (isScratched) {
        c.classList.remove('is-disabled');
        c.classList.add('is-chosen');
      } else if (remaining <= 0) {
        c.classList.add('is-disabled');
      } else {
        c.classList.remove('is-disabled');
      }
    });

    if (voucherAdminHint && state.extraSlots > 0) {
      // keep last success message if any
    }
  }

  function initAdminUnlock() {
    if (!voucherAdminBtn || voucherAdminBtn.dataset.bound) return;
    voucherAdminBtn.dataset.bound = '1';
    voucherAdminBtn.addEventListener('click', function () {
      const code = window.prompt('הכניסי קוד אישור מנהל:');
      if (code === null) return;
      const normalized = String(code).trim();
      if (normalized === ADMIN_CODE) {
        const state = readVoucherState();
        state.extraSlots = (state.extraSlots || 0) + 1;
        writeVoucherState(state);
        refreshVoucherLocks();
        if (voucherAdminHint) {
          voucherAdminHint.hidden = false;
          voucherAdminHint.classList.add('is-ok');
          voucherAdminHint.textContent =
            'אושר! נפתח לך שובר נוסף אחד (' + allowedVoucherCount(state) + ' סה״כ) 🔑';
        }
      } else {
        if (voucherAdminHint) {
          voucherAdminHint.hidden = false;
          voucherAdminHint.classList.remove('is-ok');
          voucherAdminHint.textContent = 'קוד שגוי... נסי שוב 😉';
        }
      }
    });
  }

  function initVouchers() {
    if (!vouchersGrid || vouchersGrid.dataset.ready) return;
    vouchersGrid.dataset.ready = '1';

    const saved = readVoucherState();

    VOUCHERS.forEach(function (v, index) {
      const card = document.createElement('div');
      card.className = 'voucher-card';
      card.dataset.id = v.id;

      const prize = document.createElement('div');
      prize.className = 'voucher-prize';
      prize.innerHTML =
        '<span class="voucher-prize-label">שובר ' + (index + 1) + '</span>' +
        '<p class="voucher-prize-text"></p>';
      prize.querySelector('.voucher-prize-text').textContent = v.text;

      const statusBtn = document.createElement('button');
      statusBtn.type = 'button';
      statusBtn.className = 'voucher-status-btn';
      statusBtn.hidden = true;
      statusBtn.textContent = 'טרם מומש ⏳';
      prize.appendChild(statusBtn);

      const canvas = document.createElement('canvas');
      canvas.className = 'voucher-scratch';
      canvas.setAttribute('aria-label', 'גרדי כדי לחשוף את השובר');

      const hint = document.createElement('div');
      hint.className = 'voucher-hint';
      hint.innerHTML = '<span>🎁 גרדי כאן</span><small>שובר מס׳ ' + (index + 1) + '</small>';

      card.appendChild(prize);
      card.appendChild(canvas);
      card.appendChild(hint);
      vouchersGrid.appendChild(card);

      setupScratchCard(card, canvas, hint, statusBtn, v, saved);
    });

    refreshVoucherLocks();
  }

  function setupScratchCard(card, canvas, hint, statusBtn, voucher, saved) {
    const ctx = canvas.getContext('2d');
    let scratching = false;
    let revealed = false;

    function resizeCanvas() {
      const rect = card.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!revealed) paintCover(rect.width, rect.height);
    }

    function paintCover(w, h) {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#E8D5A3');
      grad.addColorStop(0.45, '#D4AF37');
      grad.addColorStop(1, '#B76E79');
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      for (let i = -h; i < w + h; i += 14) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 8, 0);
        ctx.lineTo(i - h + 8, h);
        ctx.lineTo(i - h, h);
        ctx.closePath();
        ctx.fill();
      }
    }

    function scratchAt(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
    }

    function clearedRatio() {
      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) return 0;
      const data = ctx.getImageData(0, 0, w, h).data;
      let clear = 0;
      const step = 4 * 8;
      for (let i = 3; i < data.length; i += step) {
        if (data[i] < 128) clear += 1;
      }
      const samples = Math.ceil(data.length / step);
      return clear / samples;
    }

    function revealCard(redeemed) {
      if (revealed) return;
      revealed = true;
      card.classList.add('is-revealed', 'is-chosen');
      canvas.classList.add('is-done');
      hint.style.opacity = '0';
      statusBtn.hidden = false;
      setRedeemedUI(!!redeemed);

      const state = readVoucherState();
      state.scratched[voucher.id] = {
        redeemed: !!redeemed,
        at: Date.now(),
      };
      writeVoucherState(state);
      refreshVoucherLocks();
    }

    function setRedeemedUI(redeemed) {
      if (redeemed) {
        statusBtn.textContent = 'מומש בהצלחה ✅';
        statusBtn.classList.add('is-redeemed');
      } else {
        statusBtn.textContent = 'טרם מומש ⏳';
        statusBtn.classList.remove('is-redeemed');
      }
    }

    function canScratch() {
      const state = readVoucherState();
      if (state.scratched[voucher.id]) return true;
      return scratchedCount(state) < allowedVoucherCount(state);
    }

    statusBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const state = readVoucherState();
      if (!state.scratched[voucher.id]) return;
      const next = !state.scratched[voucher.id].redeemed;
      state.scratched[voucher.id].redeemed = next;
      state.scratched[voucher.id].at = Date.now();
      writeVoucherState(state);
      setRedeemedUI(next);
    });

    // Restore
    if (saved.scratched && saved.scratched[voucher.id]) {
      const entry = saved.scratched[voucher.id];
      revealed = true;
      card.classList.add('is-revealed', 'is-chosen');
      canvas.classList.add('is-done');
      hint.style.opacity = '0';
      statusBtn.hidden = false;
      setRedeemedUI(!!entry.redeemed);
      resizeCanvas();
      const rect = card.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width || canvas.width, rect.height || canvas.height);
    } else {
      resizeCanvas();
    }

    function onStart(e) {
      if (revealed || !canScratch()) return;
      scratching = true;
      card.classList.add('is-scratching');
      const point = e.touches ? e.touches[0] : e;
      scratchAt(point.clientX, point.clientY);
      e.preventDefault();
    }

    function onMove(e) {
      if (!scratching || revealed) return;
      const point = e.touches ? e.touches[0] : e;
      scratchAt(point.clientX, point.clientY);
      if (clearedRatio() > 0.45) {
        revealCard(false);
        scratching = false;
      }
      e.preventDefault();
    }

    function onEnd() {
      scratching = false;
      if (!revealed && clearedRatio() > 0.45) {
        revealCard(false);
      }
    }

    canvas.addEventListener('mousedown', onStart);
    canvas.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    canvas.addEventListener('touchstart', onStart, { passive: false });
    canvas.addEventListener('touchmove', onMove, { passive: false });
    canvas.addEventListener('touchend', onEnd);

    window.addEventListener('resize', function () {
      if (!revealed) resizeCanvas();
    });
  }





  // ——— Private corner: promises + jokes vault ———
  const PRIVATE_JOKES = {
    inside: [
      {
        label: 'זיכרון פנימי שלנו',
        text: 'השיחות על איחוד הצלה והמסאז\' במאזדה השחורה 😉',
      },
    ],
    blonde: [
      {
        label: 'בלונדינית וקליטה',
        text: 'למה בלונדינית שמה את הטלפון על הרצפה? כדי לבדוק אם יש קליטה מהרצפה.',
      },
      {
        label: 'בלונדינית ודג',
        text: 'איך בלונדינית מנסה להרוג דג? היא מנסה להטביע אותו במים.',
      },
      {
        label: 'בלונדינית ושלג',
        text: 'מה בלונדינית עושה כשהיא רואה שלג? מביאה כפית כי זה נראה כמו גלידה.',
      },
      {
        label: 'בלונדינית וקיר',
        text: 'למה בלונדינית מטפסת על קיר זכוכית? כדי לראות מה יש בצד השני.',
      },
      {
        label: 'בלונדינית וג\'לי',
        text: 'בלונדינית פותחת את המקרר, רואה את הג\'לי רועד ואומרת: \'אל תפחד, אני רק רוצה לקחת משהו לשתות!\'',
      },
    ],
  };

  function renderJokeCategory(vault, title, items, kind) {
    const wrap = document.createElement('div');
    wrap.className = 'joke-category';
    const h = document.createElement('p');
    h.className = 'joke-category-title';
    h.textContent = title;
    wrap.appendChild(h);

    items.forEach(function (joke) {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'joke-card joke-card--' + kind;
      card.innerHTML =
        '<div class="joke-card-face"><span class="joke-card-tag"></span><div class="joke-card-label"></div></div>' +
        '<div class="joke-card-body"></div>';
      card.querySelector('.joke-card-tag').textContent = kind === 'inside' ? 'בדיחה פנימית' : 'בדיחת בלונדינית';
      card.querySelector('.joke-card-label').textContent = joke.label + ' ▾';
      card.querySelector('.joke-card-body').textContent = joke.text;
      card.addEventListener('click', function () {
        const open = card.classList.contains('is-open');
        vault.querySelectorAll('.joke-card').forEach(function (c) {
          c.classList.remove('is-open');
          const lab = c.querySelector('.joke-card-label');
          if (lab) lab.textContent = lab.textContent.replace(' ▴', ' ▾');
        });
        if (!open) {
          card.classList.add('is-open');
          card.querySelector('.joke-card-label').textContent = joke.label + ' ▴';
        }
      });
      wrap.appendChild(card);
    });
    vault.appendChild(wrap);
  }

  function initPrivateCorner() {
    const promisesBtn = document.getElementById('promises-btn');
    const jokesBtn = document.getElementById('jokes-btn');
    const promisesModal = document.getElementById('promises-modal');
    const jokesModal = document.getElementById('jokes-modal');
    const jokesVault = document.getElementById('jokes-vault');

    if (jokesVault && !jokesVault.dataset.ready) {
      jokesVault.dataset.ready = '1';
      renderJokeCategory(jokesVault, '🤫 בדיחות פנימיות / זיכרונות שלנו', PRIVATE_JOKES.inside, 'inside');
      renderJokeCategory(jokesVault, '💇 בדיחות בלונדיניות', PRIVATE_JOKES.blonde, 'blonde');
    }

    function openModal(modal) {
      if (!modal) return;
      modal.hidden = false;
      modal.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(function () {
        modal.classList.add('is-open');
      });
    }

    function closeModal(modal) {
      if (!modal) return;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      window.setTimeout(function () {
        modal.hidden = true;
      }, 350);
    }

    function bindOpen(btn, modal) {
      if (!btn || btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', function () {
        openModal(modal);
      });
    }

    bindOpen(promisesBtn, promisesModal);
    bindOpen(jokesBtn, jokesModal);

    document.querySelectorAll('[data-close-modal]').forEach(function (btn) {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', function () {
        const overlay = btn.closest('.modal-overlay');
        closeModal(overlay);
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
      if (overlay.dataset.bound) return;
      overlay.dataset.bound = '1';
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal(overlay);
      });
    });

    if (!window.__privateEscBound) {
      window.__privateEscBound = true;
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          document.querySelectorAll('.modal-overlay.is-open').forEach(closeModal);
        }
      });
    }
  }



  function showAppNav() {
    const nav = document.getElementById('app-nav');
    if (!nav) return;
    nav.hidden = false;
    requestAnimationFrame(function () {
      nav.classList.add('is-visible');
    });
    body.classList.add('has-app-nav');
    initAppNav();
    initPersonalToggle();
  }

  function initAppNav() {
    const nav = document.getElementById('app-nav');
    if (!nav || nav.dataset.bound) return;
    nav.dataset.bound = '1';
    nav.querySelectorAll('[data-scroll]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const id = btn.getAttribute('data-scroll');
        // Ensure destination sections are visible
        const hub = document.getElementById('main-hub');
        if (hub) {
          hub.hidden = false;
          hub.classList.add('is-visible');
        }
        body.classList.add('stage-hub', 'has-app-nav');
        body.classList.remove('stage-letter');
        if (storySection) {
          storySection.hidden = false;
          storySection.classList.add('is-visible', 'is-inline');
        }
        const personal = document.getElementById('sec-personal');
        if (personal) personal.hidden = false;
        if (id === 'story-section') initScrollReveals();
        if (id === 'sec-vouchers') {
          requestAnimationFrame(function () { initVouchers(); });
        }
        const el = document.getElementById(id);
        if (!el) return;
        nav.querySelectorAll('.app-nav-btn').forEach(function (b) {
          b.classList.remove('is-active');
        });
        btn.classList.add('is-active');
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function initPersonalToggle() {
    const toggle = document.getElementById('personal-toggle');
    const panel = document.getElementById('personal-panel');
    if (!toggle || !panel || toggle.dataset.bound) return;
    toggle.dataset.bound = '1';
    toggle.addEventListener('click', function () {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      if (open) {
        toggle.setAttribute('aria-expanded', 'false');
        panel.classList.remove('is-open');
        window.setTimeout(function () {
          panel.hidden = true;
        }, 350);
      } else {
        panel.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
        requestAnimationFrame(function () {
          panel.classList.add('is-open');
        });
        startTogetherTimer();
        initLoveQuotes();
      }
    });
  }


  function goToStory() {
    const hub = document.getElementById('main-hub');
    const personal = document.getElementById('sec-personal');

    // Keep letter available for revisit; mark journey mode
    letterSection.classList.add('is-journey');
    letterSection.classList.remove('is-leaving');
    letterSection.hidden = false;
    letterSection.style.display = '';

    if (hub) {
      hub.hidden = false;
      hub.classList.add('is-visible');
    }

    if (storySection) {
      storySection.hidden = false;
      storySection.classList.add('is-visible', 'is-inline');
    }
    if (personal) personal.hidden = false;

    body.classList.remove('is-locked', 'stage-letter');
    body.classList.add('is-unlocked', 'has-app-nav', 'stage-hub');

    showAppNav();
    initScrollReveals();
    initParallax();
    initReasons();
    initLoveQuotes();
    initPrivateCorner();
    initAdminUnlock();
    initPersonalToggle();
    startTogetherTimer();

    // Init vouchers after layout
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        initVouchers();
      });
    });

    window.setTimeout(function () {
      if (hub) hub.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else if (storySection) storySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  }


  function playGrandCelebration() {
    quizCelebrate.classList.add('is-active');
    quizCelebrate.setAttribute('aria-hidden', 'false');
    celebrateBurst.innerHTML = '';

    const symbols = ['\u2764', '\u2726', '\u2728', '\u2764', '\u2726'];
    for (let i = 0; i < 36; i++) {
      const p = document.createElement('span');
      p.className = 'burst-piece';
      p.textContent = symbols[i % symbols.length];
      p.style.fontSize = 0.9 + Math.random() * 1.6 + 'rem';
      p.style.color = i % 2 === 0 ? '#B76E79' : '#E8D5A3';
      const angle = (Math.PI * 2 * i) / 36;
      const dist = 80 + Math.random() * 180;
      p.style.setProperty('--bx', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--by', Math.sin(angle) * dist + 'px');
      p.style.setProperty('--br', (Math.random() * 80 - 40) + 'deg');
      p.style.animationDelay = Math.random() * 0.35 + 's';
      celebrateBurst.appendChild(p);
    }
  }

  // ——— Scroll reveal ———
  function initScrollReveals() {
    const els = document.querySelectorAll('.reveal-story');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * 0.05, 0.35) + 's';
      observer.observe(el);
    });

    const heroReveals = document.querySelectorAll('.story-hero .reveal-story');
    heroReveals.forEach(function (el, i) {
      window.setTimeout(function () {
        el.classList.add('is-visible');
      }, 200 + i * 120);
    });
  }

  // ——— Soft parallax ———
  function initParallax() {
    const nodes = document.querySelectorAll('[data-parallax]');
    if (!nodes.length) return;

    let ticking = false;

    function update() {
      nodes.forEach(function (node) {
        const speed = parseFloat(node.getAttribute('data-parallax')) || 0.1;
        const rect = node.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
        node.style.transform = 'translate3d(0, ' + offset.toFixed(2) + 'px, 0)';
      });
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );

    update();
  }

  // ——— Floating romantic particles ———
  function initParticles() {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let rafId = null;
    const prefersReduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      canvas.style.display = 'none';
      return;
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticle() {
      const isHeart = Math.random() > 0.55;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: isHeart ? 8 + Math.random() * 10 : 1.2 + Math.random() * 2.2,
        speedY: 0.15 + Math.random() * 0.45,
        speedX: (Math.random() - 0.5) * 0.25,
        opacity: 0.15 + Math.random() * 0.45,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.008 + Math.random() * 0.015,
        isHeart: isHeart,
        color: Math.random() > 0.5 ? '183,110,121' : '212,175,55',
      };
    }

    function drawHeart(x, y, size, color, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(size / 16, size / 16);
      ctx.beginPath();
      ctx.moveTo(0, 3);
      ctx.bezierCurveTo(0, 0, -5, 0, -5, 3.5);
      ctx.bezierCurveTo(-5, 7, 0, 10, 0, 13);
      ctx.bezierCurveTo(0, 10, 5, 7, 5, 3.5);
      ctx.bezierCurveTo(5, 0, 0, 0, 0, 3);
      ctx.fillStyle = 'rgba(' + color + ',' + alpha + ')';
      ctx.fill();
      ctx.restore();
    }

    function init() {
      resize();
      const count = Math.min(48, Math.floor((width * height) / 28000));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(createParticle());
      }
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.wobble += p.wobbleSpeed;
        p.y -= p.speedY;
        p.x += p.speedX + Math.sin(p.wobble) * 0.3;

        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        if (p.isHeart) {
          drawHeart(p.x, p.y, p.size, p.color, p.opacity * 0.7);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + p.color + ',' + p.opacity + ')';
          ctx.fill();
        }
      }

      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener('resize', init);
    init();
    tick();

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!rafId) {
        tick();
      }
    });
  }

  window.addEventListener('load', function () {
    initParticles();
    if (accessInput) {
      window.setTimeout(function () {
        accessInput.focus();
      }, 700);
    }
  });
})();
