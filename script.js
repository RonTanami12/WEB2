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
    enterHome();
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

  // ——— Login -> Home (letter + hub). Quiz stays optional on the page ———
  function enterHome() {
    enterBtn.disabled = true;
    playHeartSplash(splashHearts, successSplash);

    window.setTimeout(function () {
      loginSection.classList.add('is-leaving');

      window.setTimeout(function () {
        loginSection.setAttribute('hidden', '');
        loginSection.style.display = 'none';
        successSplash.classList.remove('is-active');

        openHomeExperience();
      }, 850);
    }, 1200);
  }

  function openHomeExperience() {
    const hub = document.getElementById('main-hub');
    const personal = document.getElementById('sec-personal');
    const home = document.getElementById('home-menu');

    if (hub) {
      hub.hidden = false;
      hub.classList.add('is-visible');
    }
    if (home) {
      home.hidden = false;
      home.removeAttribute('hidden');
    }
    if (letterSection) {
      letterSection.hidden = false;
      letterSection.style.display = '';
      letterSection.classList.add('is-entering', 'is-journey');
      letterSection.classList.remove('is-leaving');
    }
    if (storySection) {
      storySection.hidden = false;
      storySection.classList.add('is-visible', 'is-inline');
    }
    if (personal) personal.hidden = false;
    if (quizSection) {
      quizSection.hidden = false;
      quizSection.classList.remove('is-leaving');
      quizSection.classList.add('is-entering');
      startQuiz();
    }

    body.classList.remove('is-locked', 'stage-letter');
    body.classList.add('is-unlocked', 'has-app-nav', 'stage-hub', 'site-panels');

    showAppNav();
    bindQuizSkip();
    showPanel('home');

    requestAnimationFrame(function () {
      if (typeof initReasons === 'function') initReasons();
      if (typeof initLoveQuotes === 'function') initLoveQuotes();
      if (typeof initPrivateCorner === 'function') initPrivateCorner();
      if (typeof initPrescriptionBox === 'function') initPrescriptionBox();
      if (typeof initCigarettePack === 'function') initCigarettePack();
      if (typeof initFunWheel === 'function') initFunWheel();
      if (typeof initCatchTheVibe === 'function') initCatchTheVibe();
      if (typeof initAdminUnlock === 'function') initAdminUnlock();
      if (typeof initPersonalToggle === 'function') initPersonalToggle();
      if (typeof startTogetherTimer === 'function') startTogetherTimer();
      requestAnimationFrame(function () {
        if (typeof initVouchers === 'function') initVouchers();
      });
    });
  }

  function bindQuizSkip() {
    const skipBtn = document.getElementById('quiz-skip-btn');
    if (!skipBtn || skipBtn.dataset.bound) return;
    skipBtn.dataset.bound = '1';
    skipBtn.addEventListener('click', function () {
      skipQuizKeepOnPage();
    });
  }

  function skipQuizKeepOnPage() {
    quizLocked = true;
    if (quizSection) {
      quizSection.classList.add('is-collapsed');
    }
    // Ensure a small done note exists
    let badge = document.getElementById('quiz-done-badge');
    if (!badge && quizSection) {
      badge = document.createElement('p');
      badge.id = 'quiz-done-badge';
      badge.className = 'quiz-done-badge';
      badge.textContent = 'דילגת על החידון — הוא תמיד כאן למעלה אם תרצי לשחק 💫';
      const shell = quizSection.querySelector('.quiz-card') || quizSection;
      shell.appendChild(badge);
    }
    if (badge) badge.style.display = 'block';

    // Jump gently to the letter
    const target = document.getElementById('sec-letter') || letterSection;
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function goToQuiz() {
    // Back-compat: scrolling to optional quiz on home
    openHomeExperience();
    window.setTimeout(function () {
      const q = document.getElementById('sec-quiz') || quizSection;
      if (q) q.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
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
      heart.style.color = i % 2 === 0 ? '#C4878F' : '#F3E2B5';
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
      h.style.color = i % 2 === 0 ? '#C4878F' : '#F3E2B5';
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
    ],
  };

  let letterOpened = false;
  let typingTimer = null;

  function finishQuiz() {
    quizProgressFill.style.width = '100%';
    playGrandCelebration();
    if (typeof spawnLetterConfetti === 'function') spawnLetterConfetti();

    window.setTimeout(function () {
      if (quizCelebrate) quizCelebrate.classList.remove('is-active');
      if (quizSection) {
        quizSection.classList.add('is-collapsed');
        let badge = document.getElementById('quiz-done-badge');
        if (!badge) {
          badge = document.createElement('p');
          badge.id = 'quiz-done-badge';
          badge.className = 'quiz-done-badge';
          const shell = quizSection.querySelector('.quiz-card') || quizSection;
          shell.appendChild(badge);
        }
        badge.textContent = 'כל הכבוד! סיימת את החידון 💍 אפשר לחזור לבית או לבחור משהו אחר';
        badge.style.display = 'block';
      }
    }, 1800);
  }

  function showLetterStage() {
    // Used if letter needs focus; home already opened by enterHome
    if (letterSection) {
      letterSection.hidden = false;
      letterSection.style.display = '';
      letterSection.classList.add('is-entering', 'is-journey');
      letterSection.classList.remove('is-leaving');
    }
    body.classList.remove('is-locked');
    body.classList.add('is-unlocked', 'has-app-nav', 'stage-hub');
  }

  function spawnLetterConfetti() {
    if (!letterConfetti) return;
    letterConfetti.innerHTML = '';
    const symbols = ['❤', '✦', '✨', '◆', '❤'];
    const colors = ['#C4878F', '#F3E2B5', '#D4AF37', '#E8C4C8', '#f5efe6'];
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


  function revealLetterInstant() {
    if (typingTimer) {
      clearTimeout(typingTimer);
      typingTimer = null;
    }
    var boomWrap = document.getElementById('letter-boom-wrap');
    if (boomWrap) boomWrap.hidden = true;

    letterTitleEl.textContent = LETTER.title;
    letterBodyEl.innerHTML = '';
    LETTER.paragraphs.forEach(function (text) {
      var p = document.createElement('p');
      var parts = String(text).split('\n');
      parts.forEach(function (part, idx) {
        if (idx) p.appendChild(document.createElement('br'));
        p.appendChild(document.createTextNode(part));
      });
      letterBodyEl.appendChild(p);
    });
    loveLetter.classList.add('is-boom');
    finishLetterTyping();
  }

  function bindLetterBoom() {
    var boomBtn = document.getElementById('letter-boom-btn');
    var boomWrap = document.getElementById('letter-boom-wrap');
    if (!boomBtn || boomBtn.dataset.bound) return;
    boomBtn.dataset.bound = '1';
    boomBtn.addEventListener('click', function () {
      revealLetterInstant();
    });
    if (boomWrap) boomWrap.hidden = false;
  }

  function startTypewriter() {
    letterTitleEl.textContent = '';
    letterBodyEl.innerHTML = '';
    continueStoryBtn.hidden = true;
    continueStoryBtn.classList.remove('is-shown');
    bindLetterBoom();
    var boomWrap = document.getElementById('letter-boom-wrap');
    if (boomWrap) boomWrap.hidden = false;

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
    var boomWrap = document.getElementById('letter-boom-wrap');
    if (boomWrap) boomWrap.hidden = true;
    showLetterExtras();
    if (continueStoryBtn) {
      continueStoryBtn.hidden = false;
      requestAnimationFrame(function () {
        continueStoryBtn.classList.add('is-shown');
      });
    }
  }

  if (continueStoryBtn) {
    continueStoryBtn.addEventListener('click', function () {
      if (typeof showPanel === 'function') showPanel('home');
      else goToStory();
    });
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

  const letterExtras = document.getElementById('letter-extras');
  const reasonCard = document.getElementById('reason-card');
  const reasonText = document.getElementById('reason-text');
  const reasonBtn = document.getElementById('reason-btn');
  const vouchersGrid = document.getElementById('vouchers-grid');
  const voucherLockMsg = document.getElementById('voucher-lock-msg');

  let timerInterval = null;
  let lastReasonIndex = -1;

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
    if (!letterExtras) return;
    letterExtras.hidden = false;
    void letterExtras.offsetWidth;
    letterExtras.classList.add('is-visible');
    startTogetherTimer();
    initReasons();
    initVouchers();

    // Continue button lives in extras now
    if (continueStoryBtn) {
      continueStoryBtn.hidden = false;
      requestAnimationFrame(function () {
        continueStoryBtn.classList.add('is-shown');
      });
    }
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


  function normalizeVoucherState(raw) {
    // Supports legacy {id, redeemed} and new {extraSlots, scratched:{}}
    if (!raw || typeof raw !== 'object') {
      return { extraSlots: 0, scratched: {} };
    }
    if (raw.scratched) {
      return {
        extraSlots: typeof raw.extraSlots === 'number' ? raw.extraSlots : 0,
        scratched: raw.scratched || {},
      };
    }
    if (raw.id) {
      var scratched = {};
      scratched[raw.id] = { redeemed: !!raw.redeemed, at: raw.at || Date.now() };
      return { extraSlots: 0, scratched: scratched };
    }
    return { extraSlots: 0, scratched: {} };
  }

  function readVoucherState() {
    try {
      var raw = localStorage.getItem(LS_VOUCHER);
      if (raw) return normalizeVoucherState(JSON.parse(raw));
      // migrate v1
      var legacy = localStorage.getItem('avital_voucher_v1');
      if (legacy) {
        var migrated = normalizeVoucherState(JSON.parse(legacy));
        writeVoucherState(migrated);
        return migrated;
      }
    } catch (e) { /* ignore */ }
    return { extraSlots: 0, scratched: {} };
  }

  function writeVoucherState(state) {
    try {
      localStorage.setItem(LS_VOUCHER, JSON.stringify(state));
    } catch (e) { /* ignore */ }
  }

  function allowedVoucherCount(state) {
    return 1 + (state.extraSlots || 0);
  }

  function scratchedCount(state) {
    return Object.keys(state.scratched || {}).length;
  }

  function refreshVoucherLocks() {
    var state = readVoucherState();
    var allowed = allowedVoucherCount(state);
    var used = scratchedCount(state);
    var remaining = Math.max(0, allowed - used);

    if (voucherLockMsg) {
      if (used >= 1 && remaining === 0) {
        voucherLockMsg.hidden = false;
        voucherLockMsg.textContent = 'הגעת למכסת השוברים. אפשר לבקש אישור מנהל לשובר נוסף ✨';
      } else if (remaining > 0 && used >= 1) {
        voucherLockMsg.hidden = false;
        voucherLockMsg.textContent = 'נשאר לך עוד ' + remaining + ' שובר' + (remaining > 1 ? 'ים' : '') + ' לפתוח 🎁';
      } else {
        voucherLockMsg.hidden = false;
        voucherLockMsg.textContent = 'בחרי שובר אחד, גרדי אותו וצלמי לי מסך כדי לממש!';
      }
    }

    if (!vouchersGrid) return;
    vouchersGrid.querySelectorAll('.voucher-card').forEach(function (c) {
      var id = c.dataset.id;
      var isScratched = !!(state.scratched && state.scratched[id]);
      if (isScratched) {
        c.classList.remove('is-disabled');
        c.classList.add('is-chosen');
      } else if (remaining <= 0) {
        c.classList.add('is-disabled');
      } else {
        c.classList.remove('is-disabled');
      }
    });
  }

  function initAdminUnlock() {
    var btn = document.getElementById('voucher-admin-btn');
    var hint = document.getElementById('voucher-admin-hint');
    if (!btn || btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', function () {
      var code = window.prompt('הכניסי קוד אישור מנהל:');
      if (code === null) return;
      if (String(code).trim() === ADMIN_CODE) {
        var state = readVoucherState();
        state.extraSlots = (state.extraSlots || 0) + 1;
        writeVoucherState(state);
        refreshVoucherLocks();
        // unlock disabled cards visually for new slot
        vouchersGrid && vouchersGrid.querySelectorAll('.voucher-card.is-disabled').forEach(function (c) {
          // refreshVoucherLocks already handles
        });
        if (hint) {
          hint.hidden = false;
          hint.classList.add('is-ok');
          hint.textContent = 'אושר! נפתח שובר נוסף אחד (סה״כ ' + allowedVoucherCount(state) + ') 🔑';
        }
      } else if (hint) {
        hint.hidden = false;
        hint.classList.remove('is-ok');
        hint.textContent = 'קוד שגוי... נסי שוב 😉';
      }
    });
  }

  function initVouchers() {
    if (!vouchersGrid || vouchersGrid.dataset.ready) return;
    vouchersGrid.dataset.ready = '1';

    var saved = readVoucherState();

    VOUCHERS.forEach(function (v, index) {
      var card = document.createElement('div');
      card.className = 'voucher-card';
      card.dataset.id = v.id;

      var prize = document.createElement('div');
      prize.className = 'voucher-prize';
      prize.innerHTML =
        '<span class="voucher-prize-label">שובר ' + (index + 1) + '</span>' +
        '<p class="voucher-prize-text"></p>';
      prize.querySelector('.voucher-prize-text').textContent = v.text;

      var statusBtn = document.createElement('button');
      statusBtn.type = 'button';
      statusBtn.className = 'voucher-status-btn';
      statusBtn.hidden = true;
      statusBtn.textContent = 'טרם מומש ⏳';
      prize.appendChild(statusBtn);

      var canvas = document.createElement('canvas');
      canvas.className = 'voucher-scratch';
      canvas.setAttribute('aria-label', 'גרדי כדי לחשוף את השובר');

      var hint = document.createElement('div');
      hint.className = 'voucher-hint';
      hint.innerHTML = '<span>🎁 גרדי כאן</span><small>שובר מס׳ ' + (index + 1) + '</small>';

      card.appendChild(prize);
      card.appendChild(canvas);
      card.appendChild(hint);
      vouchersGrid.appendChild(card);

      setupScratchCard(card, canvas, hint, statusBtn, v, saved);
    });

    refreshVoucherLocks();
    initAdminUnlock();
  }

  function setupScratchCard(card, canvas, hint, statusBtn, voucher, saved) {
    var ctx = canvas.getContext('2d');
    var scratching = false;
    var revealed = false;

    function resizeCanvas() {
      var rect = card.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!revealed) paintCover(rect.width, rect.height);
    }

    function paintCover(w, h) {
      var grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#F3E2B5');
      grad.addColorStop(0.45, '#D4AF37');
      grad.addColorStop(1, '#C4878F');
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      for (var i = -h; i < w + h; i += 14) {
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
      var rect = canvas.getBoundingClientRect();
      var x = clientX - rect.left;
      var y = clientY - rect.top;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
    }

    function clearedRatio() {
      var w = canvas.width;
      var h = canvas.height;
      if (!w || !h) return 0;
      var data = ctx.getImageData(0, 0, w, h).data;
      var clear = 0;
      var step = 4 * 8;
      for (var i = 3; i < data.length; i += step) {
        if (data[i] < 128) clear += 1;
      }
      return clear / Math.ceil(data.length / step);
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

    function revealCard(redeemed) {
      if (revealed) return;
      revealed = true;
      card.classList.add('is-revealed', 'is-chosen');
      canvas.classList.add('is-done');
      hint.style.opacity = '0';
      statusBtn.hidden = false;
      setRedeemedUI(!!redeemed);

      var state = readVoucherState();
      state.scratched[voucher.id] = { redeemed: !!redeemed, at: Date.now() };
      writeVoucherState(state);
      refreshVoucherLocks();
    }

    function canScratch() {
      var state = readVoucherState();
      if (state.scratched[voucher.id]) return true;
      return scratchedCount(state) < allowedVoucherCount(state);
    }

    statusBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var state = readVoucherState();
      if (!state.scratched[voucher.id]) return;
      var next = !state.scratched[voucher.id].redeemed;
      state.scratched[voucher.id].redeemed = next;
      state.scratched[voucher.id].at = Date.now();
      writeVoucherState(state);
      setRedeemedUI(next);
    });

    if (saved.scratched && saved.scratched[voucher.id]) {
      var entry = saved.scratched[voucher.id];
      revealed = true;
      card.classList.add('is-revealed', 'is-chosen');
      canvas.classList.add('is-done');
      hint.style.opacity = '0';
      statusBtn.hidden = false;
      setRedeemedUI(!!entry.redeemed);
      resizeCanvas();
      var rect = card.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width || canvas.width, rect.height || canvas.height);
    } else {
      resizeCanvas();
    }

    function onStart(e) {
      if (revealed || !canScratch()) return;
      scratching = true;
      card.classList.add('is-scratching');
      var point = e.touches ? e.touches[0] : e;
      scratchAt(point.clientX, point.clientY);
      e.preventDefault();
    }

    function onMove(e) {
      if (!scratching || revealed) return;
      var point = e.touches ? e.touches[0] : e;
      scratchAt(point.clientX, point.clientY);
      if (clearedRatio() > 0.45) {
        revealCard(false);
        scratching = false;
      }
      e.preventDefault();
    }

    function onEnd() {
      scratching = false;
      if (!revealed && clearedRatio() > 0.45) revealCard(false);
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
      { label: 'זיכרון פנימי שלנו', text: 'השיחות על איחוד הצלה והמסאז\' במאזדה השחורה 😉' },
      { label: 'רק שלנו', text: 'כשאומרים "נצא לנסיעה קצרה" ופתאום זה הופך לשיחת נשמות של שעתיים.' },
      { label: 'הקוד הסודי', text: '1105 זה לא רק קוד — זה תאריך קטן בלב עם חיוך גדול.' },
      { label: 'פייסבוק', text: 'הודעה אחת בפייסבוק... ופתאום כל החיים קיבלו פלייליסט חדש.' },
      { label: 'יין לבן', text: 'תכנית ערב: יין לבן, צחוק, ואת. שאר הפרטים — מסווגים.' },
    ],
    blonde: [
      { label: 'בלונדינית וקליטה', text: 'למה בלונדינית שמה את הטלפון על הרצפה? כדי לבדוק אם יש קליטה מהרצפה.' },
      { label: 'בלונדינית ודג', text: 'איך בלונדינית מנסה להרוג דג? היא מנסה להטביע אותו במים.' },
      { label: 'בלונדינית ושלג', text: 'מה בלונדינית עושה כשהיא רואה שלג? מביאה כפית כי זה נראה כמו גלידה.' },
      { label: 'בלונדינית וקיר', text: 'למה בלונדינית מטפסת על קיר זכוכית? כדי לראות מה יש בצד השני.' },
      { label: 'בלונדינית וג\'לי', text: 'בלונדינית פותחת את המקרר, רואה את הג\'לי רועד ואומרת: \'אל תפחד, אני רק רוצה לקחת משהו לשתות!\'' },
      { label: 'בלונדינית ומעלית', text: 'בלונדינית נכנסת למעלית, המעלית אומרת "קומה 3" והיא עונה: "תודה, גם אני בלונדינית".' },
      { label: 'בלונדינית ומראה', text: 'בלונדינית מסתכלת במראה עם עיניים עצומות. למה? כדי לראות איך היא נראית כשהיא ישנה.' },
      { label: 'בלונדינית ואוטובוס', text: 'למה בלונדינית מחכה באוטובוס עם כרטיס טיסה? כי כתוב עליו "boarding pass".' },
      { label: 'בלונדינית וגשם', text: 'בלונדינית רואה גשם ופותחת שמשייה בתוך הבית — "כדי להתאמן לפני שיוצאים".' },
      { label: 'בלונדינית וחשמל', text: 'למה בלונדינית שמה סוללות במקרר? כדי שיהיה לה חשמל קר.' },
      { label: 'בלונדינית ופיצה', text: 'בלונדינית מזמינה פיצה ואומרת: "תחתוך ל־4, אני לא אצליח לסיים 8".' },
      { label: 'בלונדינית ושעון', text: 'למה בלונדינית מסתכלת על השעון דרך החלון? כדי לראות מה השעה בחוץ.' },
      { label: 'בלונדינית וים', text: 'בלונדינית הולכת לים עם מייבש שיער — "כדי לייבש את הגלים".' },
      { label: 'בלונדינית וסמס', text: 'למה בלונדינית שולחת סמס לעצמה? כדי לקבל הודעה ממישהי חכמה.' },
      { label: 'בלונדינית וקפה', text: 'בלונדינית שמה סוכר על העיניים — "כי אמרו לי שהבוקר צריך להיות מתוק".' },
      { label: 'בלונדינית ורמזור', text: 'למה בלונדינית שמחה כשהרמזור אדום? כי היא חושבת שזה פלאש של צילום.' },
      { label: 'בלונדינית וספר', text: 'בלונדינית קנתה ספר דיאטה ואכלה את הפרק הראשון — "כי כתוב chew on this".' },
      { label: 'בלונדינית וחלון', text: 'למה בלונדינית סוגרת את העיניים ליד החלון? כדי לא לראות את עצמה משתקפת בחושך.' },
      { label: 'בלונדינית וברז', text: 'בלונדינית פותחת ברז חם וקר ביחד — "כדי לקבל מים פושרים של ספא".' },
      { label: 'בלונדינית וווייז', text: 'בלונדינית צועקת על ווייז: "למה אתה תמיד יודע איפה אני??"' },
      { label: 'בלונדינית וכרית', text: 'למה בלונדינית שמה כרית על הטלוויזיה? כדי שהסרט יישן טוב בלילה.' },
      { label: 'בלונדינית ומטריה', text: 'בלונדינית לוקחת מטריה ביום שמש — "כדי שהשמש לא תירטב".' },
      { label: 'בלונדינית וחשבון', text: 'בלונדינית בודקת אם 2+2=4 בגוגל... "רק לוודא שהאינטרנט עובד".' },
      { label: 'בלונדינית ובלון', text: 'למה בלונדינית מחבקת בלון? כי אמרו לה "תתרוממי מעל הבעיות".' },
      { label: 'בלונדינית ולילה', text: 'בלונדינית מדליקה פנס ביום — "כדי שהחושך לא יופתע בערב".' },
      { label: 'בלונדינית וסושי', text: 'בלונדינית מבקשת סושי בלי דג... "כי אני על דיאטה מדגים".' },
      { label: 'בלונדינית וזיפ', text: 'למה בלונדינית סוגרת קובץ בזיפ? כדי שיהיה לו חורף חם.' },
      { label: 'בלונדינית וסוללה', text: 'בלונדינית טוענת את הפלאפון על הגז — "כי כתוב Hotspot".' },
      { label: 'בלונדינית ויוגה', text: 'בלונדינית בשיעור יוגה שואלת: "מתי מגיעים לפוזה של נטפליקס?"' },
      { label: 'בלונדינית ולב', text: 'למה בלונדינית שמה לב על המקרר? כדי שהאוכל יידע שאוהבים אותו.' },
    ],
  };

  function renderJokeCategory(vault, title, items, kind) {
    var wrap = document.createElement('div');
    wrap.className = 'joke-category';
    var h = document.createElement('p');
    h.className = 'joke-category-title';
    h.textContent = title;
    wrap.appendChild(h);

    items.forEach(function (joke) {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'joke-card joke-card--' + kind;
      card.innerHTML =
        '<div class="joke-card-face"><span class="joke-card-tag"></span><div class="joke-card-label"></div></div>' +
        '<div class="joke-card-body"></div>';
      card.querySelector('.joke-card-tag').textContent = kind === 'inside' ? 'בדיחה פנימית' : 'בדיחת בלונדינית';
      card.querySelector('.joke-card-label').textContent = joke.label + ' ▾';
      card.querySelector('.joke-card-body').textContent = joke.text;
      card.addEventListener('click', function () {
        var open = card.classList.contains('is-open');
        vault.querySelectorAll('.joke-card').forEach(function (c) {
          c.classList.remove('is-open');
          var lab = c.querySelector('.joke-card-label');
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


  // ——— Love Prescription Box ———
  const RX_MEDS = {
    stress: {
      emoji: '💊',
      title: 'כדור לחץ',
      label: 'הוראות שימוש — רוגע מיידי',
      body: 'קחי נשימה עמוקה, תני לכתפיים ליפול, ותזכרי: את לא לבד בזה. אני כאן — האוזן, החיבוק, והשקט שלך.',
      side: 'תופעת לוואי מאושרת: חיוך קטן בצד הפה תוך 10 שניות. אם הגעגוע גובר — חזרי על המנה.',
    },
    miss: {
      emoji: '💓',
      title: 'ויטמין געגוע',
      label: 'תוסף תזונה רגשי',
      body: 'רכיב פעיל: זיכרון של הצחוק שלך בנסיעה במאזדה. מנה מומלצת: לחשוב עלייך עכשיו… אופס, כבר קרה.',
      side: 'אייקון רשמי: 🌙✨ · כיתוב על הבקבוק: "חסרה לי גם כשאת ממש לידי".',
    },
    bandaid: {
      emoji: '🩹',
      title: 'פלסטר לריב',
      label: 'עזרה ראשונה זוגית',
      body: 'שלב 1: חיבוק של לפחות 7 שניות. שלב 2: "אני מצטער/ת גם אם זה מסובך". שלב 3: נשיקה על המצח. ריפוי מובטח.',
      side: 'הערה רפואית: אסור לשמור טינה במקרר ליד הג\'לי. רק שוקולד וסליחה.',
    },
    syrup: {
      emoji: '🧴',
      title: 'סירופ מתוק',
      label: 'מגביר מצב רוח',
      body: 'את יפה בלי איפור, חזקה בלי להעמיד פנים, ומתוקה גם כשאת עייפה. המנה היומית שלי ממך — תמיד מעל לנדרש.',
      side: 'אזהרה: עלול לגרום להתאהבות חוזרת. אין צורך במרשם נוסף — כבר נרשמת לי על הלב.',
    },
  };


  // ——— Romantic Cigarette Pack ———
  const CIG_NOTES = [
    {
      id: 'c1',
      emoji: '☕',
      title: 'קופון רשמי',
      text: 'קופון רשמי: הפסקת קפה וסיגריה במרפסת לפי דרישה – הקפה עלי!',
    },
    {
      id: 'c2',
      emoji: '🔥',
      title: 'הדלקה',
      text: 'את מעשנת, אבל את זאת שהדלקת בי משהו חזק.',
    },
    {
      id: 'c3',
      emoji: '🩹',
      title: 'כרטיס פיוס',
      text: 'כרטיס פיוס: עוצרים הכל, יוצאים למרפסת ועוברים לחיבוק.',
    },
    {
      id: 'c4',
      emoji: '🌙',
      title: 'הסיבה האמיתית',
      text: 'הסיבה האמיתית: אני פשוט מת על השיחות השקטות שלנו בלילה.',
    },
    {
      id: 'c5',
      emoji: '💆',
      title: 'קופון VIP',
      text: 'קופון VIP: מסז\' כתפיים מפנק בזמן הפסקת הסיגריה.',
    },
  ];

  const LS_CIG = 'avital_cig_read_v1';

  function readCigState() {
    try {
      var raw = localStorage.getItem(LS_CIG);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function writeCigState(state) {
    try {
      localStorage.setItem(LS_CIG, JSON.stringify(state));
    } catch (e) { /* ignore */ }
  }


  // ——— Late Night Wheel of Fun ———
  const WHEEL_TASKS = [
    { emoji: '💆', text: 'מסאז׳ מרגיע לכתפיים ולגב למשך 3 דקות — בלי טלפונים 💆', color: '#8B3A4A' },
    { emoji: '😘', text: 'נשיקה איטית ומלטפת על המצח, על הלחי, ואז על השפתיים 😘', color: '#C4878F' },
    { emoji: '🤗', text: 'חיבוק מוחץ של 30 שניות בלי לדבר בכלל 🤗', color: '#B76E79' },
    { emoji: '✋', text: 'להחזיק ידיים ולהסתכל אחד לשנייה בעיניים במשך דקה ✋', color: '#D4A5AB' },
    { emoji: '🎶', text: 'שיר אחד איטי — ריקוד צמוד בסלון עכשיו 🎶', color: '#9A6B3F' },
    { emoji: '🫶', text: 'ללחוש משהו שאת/ה אוהב/ת בי במיוחד — ואז חיבוק חם 🫶', color: '#E0C078' },
  ];

  function initFunWheel() {
    var canvas = document.getElementById('wheel-canvas');
    var spinBtn = document.getElementById('wheel-spin-btn');
    var modal = document.getElementById('wheel-modal');
    if (!canvas || !spinBtn || !modal || spinBtn.dataset.bound) return;
    spinBtn.dataset.bound = '1';

    var ctx = canvas.getContext('2d');
    var size = canvas.width;
    var cx = size / 2;
    var cy = size / 2;
    var radius = size / 2 - 8;
    var n = WHEEL_TASKS.length;
    var slice = (Math.PI * 2) / n;
    var rotation = 0;
    var spinning = false;
    var rafId = null;

    // Audio: soft tick using Web Audio API (no external files)
    var audioCtx = null;
    function ensureAudio() {
      if (audioCtx) return audioCtx;
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        audioCtx = null;
      }
      return audioCtx;
    }

    function playTick(freq) {
      var ac = ensureAudio();
      if (!ac) return;
      if (ac.state === 'suspended') ac.resume();
      var osc = ac.createOscillator();
      var gain = ac.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq || 680;
      gain.gain.value = 0.0001;
      gain.gain.exponentialRampToValueAtTime(0.05, ac.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start();
      osc.stop(ac.currentTime + 0.09);
    }

    function playWin() {
      var ac = ensureAudio();
      if (!ac) return;
      if (ac.state === 'suspended') ac.resume();
      [523, 659, 784].forEach(function (f, i) {
        var osc = ac.createOscillator();
        var gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        gain.gain.value = 0.0001;
        var t = ac.currentTime + i * 0.1;
        gain.gain.exponentialRampToValueAtTime(0.06, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(t);
        osc.stop(t + 0.28);
      });
    }

    function drawWheel() {
      ctx.clearRect(0, 0, size, size);
      for (var i = 0; i < n; i++) {
        var start = rotation + i * slice - Math.PI / 2;
        var end = start + slice;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, start, end);
        ctx.closePath();
        ctx.fillStyle = WHEEL_TASKS[i].color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,246,239,0.22)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // label
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(start + slice / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff6ef';
        ctx.font = 'bold 13px Heebo, sans-serif';
        var label = WHEEL_TASKS[i].emoji;
        ctx.fillText(label, radius - 18, 5);
        ctx.restore();
      }

      // inner ring
      ctx.beginPath();
      ctx.arc(cx, cy, 48, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(12, 8, 14, 0.92)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(243, 226, 181, 0.45)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    function currentIndex() {
      // pointer at top (-PI/2). Convert rotation to index
      var normalized = ((-rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      var idx = Math.floor(normalized / slice) % n;
      return idx;
    }

    function spin() {
      if (spinning) return;
      spinning = true;
      spinBtn.disabled = true;
      canvas.classList.add('is-spinning');
      ensureAudio();

      var extraTurns = 4 + Math.random() * 3; // 4-7 full turns
      var targetIndex = Math.floor(Math.random() * n);
      // We want targetIndex under pointer when done
      var targetRot = extraTurns * Math.PI * 2 + (n - targetIndex) * slice - slice / 2;
      // continue from current rotation smoothly
      var startRot = rotation;
      // align so final index matches targetIndex
      var base = ((-startRot % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      var desired = targetIndex * slice + slice / 2;
      var delta = ((desired - base) + Math.PI * 2) % (Math.PI * 2);
      var totalDelta = extraTurns * Math.PI * 2 + delta;
      // spin direction: increase rotation clockwise visually
      // our draw uses rotation added to angles; increasing rotation spins CCW labels — fine
      var endRot = startRot - totalDelta; // negative so wheel spins "forward" under top pointer

      var duration = 3400 + Math.random() * 700;
      var t0 = performance.now();
      var lastTickSlice = -1;

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function frame(now) {
        var p = Math.min(1, (now - t0) / duration);
        var e = easeOutCubic(p);
        rotation = startRot + (endRot - startRot) * e;
        drawWheel();

        var tickSlice = Math.floor((((-rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) / slice);
        if (tickSlice !== lastTickSlice) {
          lastTickSlice = tickSlice;
          playTick(520 + Math.random() * 200);
        }

        if (p < 1) {
          rafId = requestAnimationFrame(frame);
        } else {
          spinning = false;
          spinBtn.disabled = false;
          canvas.classList.remove('is-spinning');
          var idx = currentIndex();
          // snap center of slice
          playWin();
          showWheelMission(WHEEL_TASKS[idx]);
        }
      }

      rafId = requestAnimationFrame(frame);
    }

    function showWheelMission(task) {
      var titleEl = document.getElementById('wheel-modal-title');
      var bodyEl = document.getElementById('wheel-modal-body');
      var emojiEl = document.getElementById('wheel-modal-emoji');
      var confetti = document.getElementById('wheel-modal-confetti');
      if (titleEl) titleEl.textContent = 'המשימה לשניכם עכשיו!';
      if (bodyEl) bodyEl.textContent = task.text;
      if (emojiEl) emojiEl.textContent = task.emoji;

      modal.hidden = false;
      modal.removeAttribute('hidden');
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(function () {
        modal.classList.add('is-open');
        if (confetti) {
          confetti.innerHTML = '';
          var symbols = ['🎉', '✨', '❤', '✦', '🎊'];
          for (var i = 0; i < 22; i++) {
            var s = document.createElement('span');
            s.textContent = symbols[i % symbols.length];
            s.style.fontSize = (0.8 + Math.random() * 1.1) + 'rem';
            s.style.setProperty('--wx', ((Math.random() - 0.5) * 240) + 'px');
            s.style.setProperty('--wy', ((Math.random() - 0.5) * 200) + 'px');
            s.style.setProperty('--wr', ((Math.random() - 0.5) * 120) + 'deg');
            s.style.animationDelay = (Math.random() * 0.25) + 's';
            confetti.appendChild(s);
          }
        }
      });
    }

    function closeWheelModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      window.setTimeout(function () {
        modal.hidden = true;
        modal.style.display = '';
        var confetti = document.getElementById('wheel-modal-confetti');
        if (confetti) confetti.innerHTML = '';
      }, 350);
    }

    spinBtn.addEventListener('click', spin);

    var okBtn = document.getElementById('wheel-modal-ok');
    if (okBtn && !okBtn.dataset.bound) {
      okBtn.dataset.bound = '1';
      okBtn.addEventListener('click', closeWheelModal);
    }
    var closeBtn = modal.querySelector('[data-close-modal]');
    if (closeBtn && !closeBtn.dataset.wheelBound) {
      closeBtn.dataset.wheelBound = '1';
      closeBtn.addEventListener('click', closeWheelModal);
    }
    if (!modal.dataset.wheelOverlay) {
      modal.dataset.wheelOverlay = '1';
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeWheelModal();
      });
    }

    drawWheel();

    // redraw on resize for sharpness
    window.addEventListener('resize', function () {
      if (!spinning) drawWheel();
    });
  }



  var CATCH_TARGET = 10;
  var CATCH_ITEMS = [
    { emoji: '☕', points: 1, kind: 'good', weight: 3 },
    { emoji: '💖', points: 1, kind: 'good', weight: 3 },
    { emoji: '🤗', points: 1, kind: 'good', weight: 2 },
    { emoji: '🚬', points: 2, kind: 'bonus', weight: 2 },
    { emoji: '🚫🚬', points: -1, kind: 'bad', weight: 2 }
  ];

  function initCatchTheVibe() {
    var canvas = document.getElementById('catch-canvas');
    var startBtn = document.getElementById('catch-start-btn');
    var overlay = document.getElementById('catch-overlay');
    var scoreEl = document.getElementById('catch-score');
    var modal = document.getElementById('catch-modal');
    if (!canvas || !startBtn || !overlay || !scoreEl || !modal || startBtn.dataset.bound) return;
    startBtn.dataset.bound = '1';

    var ctx = canvas.getContext('2d');
    var W = canvas.width;
    var H = canvas.height;
    var playing = false;
    var won = false;
    var score = 0;
    var items = [];
    var particles = [];
    var spawnTimer = 0;
    var lastTs = 0;
    var rafId = null;
    var keys = { left: false, right: false };
    var pointerActive = false;

    var basket = {
      w: 78,
      h: 40,
      x: W / 2,
      y: H - 58,
      speed: 420
    };

    var audioCtx = null;
    function ensureAudio() {
      if (audioCtx) return audioCtx;
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        audioCtx = null;
      }
      return audioCtx;
    }

    function beep(freq, dur, type, vol) {
      var ac = ensureAudio();
      if (!ac) return;
      if (ac.state === 'suspended') ac.resume();
      var osc = ac.createOscillator();
      var gain = ac.createGain();
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      gain.gain.value = 0.0001;
      var t = ac.currentTime;
      gain.gain.exponentialRampToValueAtTime(vol || 0.05, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + (dur || 0.12));
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(t);
      osc.stop(t + (dur || 0.12) + 0.02);
    }

    function pickItem() {
      var total = 0;
      for (var i = 0; i < CATCH_ITEMS.length; i++) total += CATCH_ITEMS[i].weight;
      var r = Math.random() * total;
      for (var j = 0; j < CATCH_ITEMS.length; j++) {
        r -= CATCH_ITEMS[j].weight;
        if (r <= 0) return CATCH_ITEMS[j];
      }
      return CATCH_ITEMS[0];
    }

    function spawnItem() {
      var def = pickItem();
      var size = def.kind === 'bad' ? 34 : 30;
      items.push({
        emoji: def.emoji,
        points: def.points,
        kind: def.kind,
        x: 28 + Math.random() * (W - 56),
        y: -30,
        vy: 110 + Math.random() * 130,
        size: size,
        rot: (Math.random() - 0.5) * 0.4,
        spin: (Math.random() - 0.5) * 1.2
      });
    }

    function burst(x, y, good) {
      var symbols = good ? ['✨', '❤', '✦', '☕'] : ['💨', '·', '×'];
      for (var i = 0; i < 8; i++) {
        particles.push({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 180,
          vy: -40 - Math.random() * 120,
          life: 0.55 + Math.random() * 0.35,
          age: 0,
          emoji: symbols[i % symbols.length],
          size: 10 + Math.random() * 8
        });
      }
    }

    function setScore(n) {
      score = Math.max(0, n);
      scoreEl.textContent = String(score);
    }

    function resetGame() {
      items = [];
      particles = [];
      spawnTimer = 0.35;
      setScore(0);
      basket.x = W / 2;
      won = false;
      playing = false;
      canvas.classList.remove('is-playing');
      overlay.classList.remove('is-hidden');
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      drawFrame(0);
    }

    function startGame() {
      ensureAudio();
      items = [];
      particles = [];
      spawnTimer = 0.2;
      setScore(0);
      basket.x = W / 2;
      won = false;
      playing = true;
      lastTs = 0;
      canvas.classList.add('is-playing');
      overlay.classList.add('is-hidden');
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(loop);
    }

    function pointerToX(clientX) {
      var rect = canvas.getBoundingClientRect();
      var scale = W / rect.width;
      return (clientX - rect.left) * scale;
    }

    function onPointerDown(e) {
      if (!playing || won) return;
      pointerActive = true;
      basket.x = Math.max(basket.w / 2, Math.min(W - basket.w / 2, pointerToX(e.clientX)));
      if (canvas.setPointerCapture) {
        try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
      }
      e.preventDefault();
    }

    function onPointerMove(e) {
      if (!playing || won || !pointerActive) return;
      basket.x = Math.max(basket.w / 2, Math.min(W - basket.w / 2, pointerToX(e.clientX)));
      e.preventDefault();
    }

    function onPointerUp() {
      pointerActive = false;
    }

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);

    window.addEventListener('keydown', function (e) {
      if (!playing || won) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keys.left = true;
        e.preventDefault();
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keys.right = true;
        e.preventDefault();
      }
    });
    window.addEventListener('keyup', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
    });

    function hitTest(item) {
      var bx = basket.x - basket.w / 2;
      var by = basket.y - 8;
      var bw = basket.w;
      var bh = basket.h;
      return (
        item.x > bx + 6 &&
        item.x < bx + bw - 6 &&
        item.y + item.size * 0.25 > by &&
        item.y < by + bh
      );
    }

    function drawBasket() {
      var x = basket.x;
      var y = basket.y;
      var w = basket.w;
      var h = basket.h;

      // cup body
      var grad = ctx.createLinearGradient(x - w / 2, y, x + w / 2, y + h);
      grad.addColorStop(0, '#f6e7c8');
      grad.addColorStop(0.45, '#e0c078');
      grad.addColorStop(1, '#c4878f');
      ctx.beginPath();
      ctx.moveTo(x - w / 2 + 6, y);
      ctx.lineTo(x + w / 2 - 6, y);
      ctx.quadraticCurveTo(x + w / 2 - 2, y + h, x + w / 2 - 14, y + h);
      ctx.lineTo(x - w / 2 + 14, y + h);
      ctx.quadraticCurveTo(x - w / 2 + 2, y + h, x - w / 2 + 6, y);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(26, 12, 18, 0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // rim
      ctx.beginPath();
      ctx.ellipse(x, y, w / 2 - 4, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#fff6ef';
      ctx.fill();
      ctx.strokeStyle = 'rgba(196, 122, 138, 0.55)';
      ctx.stroke();

      // heart on cup
      ctx.font = '16px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('❤', x, y + h * 0.55);
    }

    function drawBackground() {
      ctx.clearRect(0, 0, W, H);

      // soft scanlines / arcade vibe
      ctx.fillStyle = 'rgba(255, 246, 239, 0.015)';
      for (var y = 0; y < H; y += 4) {
        ctx.fillRect(0, y, W, 1);
      }

      // top glow
      var g = ctx.createRadialGradient(W / 2, 0, 10, W / 2, 0, 220);
      g.addColorStop(0, 'rgba(232, 160, 171, 0.12)');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, 220);

      // floor line
      ctx.strokeStyle = 'rgba(243, 226, 181, 0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(16, H - 28);
      ctx.lineTo(W - 16, H - 28);
      ctx.stroke();
    }

    function drawFrame(dt) {
      drawBackground();

      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        ctx.save();
        ctx.translate(it.x, it.y);
        ctx.rotate(it.rot);
        ctx.font = it.size + 'px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = it.kind === 'bad' ? 'rgba(255,80,80,0.35)' : 'rgba(243,226,181,0.35)';
        ctx.shadowBlur = 10;
        ctx.fillText(it.emoji, 0, 0);
        ctx.restore();
      }

      for (var p = 0; p < particles.length; p++) {
        var pt = particles[p];
        var alpha = 1 - pt.age / pt.life;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.font = pt.size + 'px serif';
        ctx.textAlign = 'center';
        ctx.fillText(pt.emoji, pt.x, pt.y);
        ctx.globalAlpha = 1;
      }

      drawBasket();

      if (!playing && !won) {
        // idle floating hint emoji
        var t = performance.now() / 1000;
        ctx.globalAlpha = 0.35;
        ctx.font = '28px serif';
        ctx.textAlign = 'center';
        ctx.fillText('☕', W * 0.28, 120 + Math.sin(t) * 8);
        ctx.fillText('💖', W * 0.72, 150 + Math.cos(t * 1.2) * 10);
        ctx.globalAlpha = 1;
      }
    }

    function loop(ts) {
      if (!playing) return;
      if (!lastTs) lastTs = ts;
      var dt = Math.min(0.033, (ts - lastTs) / 1000);
      lastTs = ts;

      if (!pointerActive) {
        if (keys.left) basket.x -= basket.speed * dt;
        if (keys.right) basket.x += basket.speed * dt;
        basket.x = Math.max(basket.w / 2, Math.min(W - basket.w / 2, basket.x));
      }

      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        spawnItem();
        spawnTimer = 0.55 + Math.random() * 0.55;
      }

      for (var i = items.length - 1; i >= 0; i--) {
        var it = items[i];
        it.y += it.vy * dt;
        it.rot += it.spin * dt;
        if (hitTest(it)) {
          var next = score + it.points;
          setScore(next);
          burst(it.x, it.y, it.points > 0);
          if (it.points > 0) beep(it.points > 1 ? 780 : 620, 0.1, 'triangle', 0.05);
          else beep(180, 0.14, 'sawtooth', 0.035);
          items.splice(i, 1);
          if (score >= CATCH_TARGET) {
            winGame();
            return;
          }
          continue;
        }
        if (it.y > H + 40) items.splice(i, 1);
      }

      for (var p = particles.length - 1; p >= 0; p--) {
        var pt = particles[p];
        pt.age += dt;
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.vy += 220 * dt;
        if (pt.age >= pt.life) particles.splice(p, 1);
      }

      drawFrame(dt);
      rafId = requestAnimationFrame(loop);
    }

    function showWinModal() {
      var confetti = document.getElementById('catch-modal-confetti');
      modal.hidden = false;
      modal.removeAttribute('hidden');
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(function () {
        modal.classList.add('is-open');
        if (confetti) {
          confetti.innerHTML = '';
          var symbols = ['🎉', '✨', '❤', '☕', '🎊', '😘'];
          for (var i = 0; i < 24; i++) {
            var s = document.createElement('span');
            s.textContent = symbols[i % symbols.length];
            s.style.fontSize = (0.85 + Math.random() * 1.1) + 'rem';
            s.style.setProperty('--cx', ((Math.random() - 0.5) * 250) + 'px');
            s.style.setProperty('--cy', ((Math.random() - 0.5) * 210) + 'px');
            s.style.setProperty('--cr', ((Math.random() - 0.5) * 140) + 'deg');
            s.style.animationDelay = (Math.random() * 0.28) + 's';
            confetti.appendChild(s);
          }
        }
      });
    }

    function closeWinModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      window.setTimeout(function () {
        modal.hidden = true;
        modal.style.display = '';
        var confetti = document.getElementById('catch-modal-confetti');
        if (confetti) confetti.innerHTML = '';
        resetGame();
      }, 350);
    }

    function winGame() {
      won = true;
      playing = false;
      canvas.classList.remove('is-playing');
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      drawFrame(0);
      beep(523, 0.12, 'sine', 0.05);
      window.setTimeout(function () { beep(659, 0.12, 'sine', 0.05); }, 100);
      window.setTimeout(function () { beep(784, 0.2, 'sine', 0.06); }, 200);
      showWinModal();
    }

    startBtn.addEventListener('click', startGame);

    var okBtn = document.getElementById('catch-modal-ok');
    if (okBtn && !okBtn.dataset.bound) {
      okBtn.dataset.bound = '1';
      okBtn.addEventListener('click', closeWinModal);
    }
    var closeBtn = modal.querySelector('[data-close-modal]');
    if (closeBtn && !closeBtn.dataset.catchBound) {
      closeBtn.dataset.catchBound = '1';
      closeBtn.addEventListener('click', closeWinModal);
    }
    if (!modal.dataset.catchOverlay) {
      modal.dataset.catchOverlay = '1';
      modal.addEventListener('pointerdown', function (e) {
        if (e.target === modal) closeWinModal();
      });
    }

    drawFrame(0);
  }


  function initCigarettePack() {
    var pack = document.getElementById('cig-pack');
    var sticksWrap = document.getElementById('cig-sticks');
    var sticksRow = document.getElementById('cig-sticks-row');
    var modal = document.getElementById('cig-modal');
    if (!pack || !sticksWrap || !sticksRow || !modal || pack.dataset.bound) return;
    pack.dataset.bound = '1';

    var titleEl = document.getElementById('cig-modal-title');
    var bodyEl = document.getElementById('cig-modal-body');
    var emojiEl = document.getElementById('cig-modal-emoji');
    var okBtn = document.getElementById('cig-modal-ok');
    var sparkle = document.getElementById('cig-sparkle');
    var readMap = readCigState();

    CIG_NOTES.forEach(function (note, index) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cig-stick';
      btn.dataset.id = note.id;
      btn.setAttribute('aria-label', 'מקל אהבה ' + (index + 1));
      btn.innerHTML = '<span class="cig-stick-visual" data-n="' + (index + 1) + '"></span>';
      if (readMap[note.id]) btn.classList.add('is-smoked');

      btn.addEventListener('click', function () {
        if (!pack.classList.contains('is-open')) return;
        btn.classList.add('is-pulling');
        window.setTimeout(function () {
          btn.classList.remove('is-pulling');
          openCigNote(note, btn);
        }, 320);
      });
      sticksRow.appendChild(btn);
    });

    pack.addEventListener('click', function () {
      var open = pack.classList.toggle('is-open');
      pack.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        sticksWrap.hidden = false;
        requestAnimationFrame(function () {
          sticksWrap.classList.add('is-visible');
        });
      } else {
        sticksWrap.classList.remove('is-visible');
        window.setTimeout(function () {
          if (!pack.classList.contains('is-open')) sticksWrap.hidden = true;
        }, 400);
      }
    });

    function openCigNote(note, stickBtn) {
      if (emojiEl) emojiEl.textContent = note.emoji;
      if (titleEl) titleEl.textContent = note.title;
      if (bodyEl) bodyEl.textContent = note.text;

      modal.hidden = false;
      modal.removeAttribute('hidden');
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(function () {
        modal.classList.add('is-open');
        burstSparkle();
      });

      stickBtn.classList.add('is-smoked');
      readMap[note.id] = true;
      writeCigState(readMap);
    }

    function closeCigModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      window.setTimeout(function () {
        modal.hidden = true;
        modal.style.display = '';
        if (sparkle) sparkle.innerHTML = '';
      }, 350);
    }

    function burstSparkle() {
      if (!sparkle) return;
      sparkle.innerHTML = '';
      var symbols = ['✦', '✨', '❤', '✧'];
      for (var i = 0; i < 14; i++) {
        var s = document.createElement('span');
        s.textContent = symbols[i % symbols.length];
        s.style.color = i % 2 === 0 ? '#F3E2B5' : '#E8A0AB';
        s.style.fontSize = (0.75 + Math.random() * 0.9) + 'rem';
        s.style.setProperty('--sx', ((Math.random() - 0.5) * 200) + 'px');
        s.style.setProperty('--sy', ((Math.random() - 0.5) * 160) + 'px');
        s.style.animationDelay = (Math.random() * 0.2) + 's';
        sparkle.appendChild(s);
      }
    }

    if (okBtn && !okBtn.dataset.bound) {
      okBtn.dataset.bound = '1';
      okBtn.addEventListener('click', closeCigModal);
    }
    var closeBtn = modal.querySelector('[data-close-modal]');
    if (closeBtn && !closeBtn.dataset.cigBound) {
      closeBtn.dataset.cigBound = '1';
      closeBtn.addEventListener('click', closeCigModal);
    }
    if (!modal.dataset.cigOverlay) {
      modal.dataset.cigOverlay = '1';
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeCigModal();
      });
    }
  }


  function initPrescriptionBox() {
    var grid = document.getElementById('rx-grid');
    var modal = document.getElementById('rx-modal');
    if (!grid || !modal || grid.dataset.bound) return;
    grid.dataset.bound = '1';

    var titleEl = document.getElementById('rx-modal-title');
    var labelEl = document.getElementById('rx-modal-label');
    var bodyEl = document.getElementById('rx-modal-body');
    var sideEl = document.getElementById('rx-modal-side');
    var emojiEl = document.getElementById('rx-modal-emoji');
    var okBtn = document.getElementById('rx-modal-ok');
    var confetti = document.getElementById('rx-confetti');

    function openRxModal(key) {
      var med = RX_MEDS[key];
      if (!med) return;
      if (emojiEl) emojiEl.textContent = med.emoji;
      if (titleEl) titleEl.textContent = med.title;
      if (labelEl) labelEl.textContent = med.label;
      if (bodyEl) bodyEl.textContent = med.body;
      if (sideEl) sideEl.textContent = med.side;

      modal.hidden = false;
      modal.removeAttribute('hidden');
      modal.style.display = 'flex';
      modal.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(function () {
        modal.classList.add('is-open');
        burstRxConfetti();
      });
    }

    function closeRxModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      window.setTimeout(function () {
        modal.hidden = true;
        modal.style.display = '';
        if (confetti) confetti.innerHTML = '';
      }, 350);
    }

    function burstRxConfetti() {
      if (!confetti) return;
      confetti.innerHTML = '';
      var symbols = ['❤', '✦', '💊', '✨', '💕'];
      for (var i = 0; i < 16; i++) {
        var s = document.createElement('span');
        s.textContent = symbols[i % symbols.length];
        s.style.color = i % 2 === 0 ? '#E8A0AB' : '#F3E2B5';
        s.style.fontSize = (0.8 + Math.random() * 0.9) + 'rem';
        s.style.setProperty('--rx', ((Math.random() - 0.5) * 220) + 'px');
        s.style.setProperty('--ry', ((Math.random() - 0.5) * 180) + 'px');
        s.style.animationDelay = (Math.random() * 0.25) + 's';
        confetti.appendChild(s);
      }
    }

    grid.querySelectorAll('[data-rx]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openRxModal(btn.getAttribute('data-rx'));
      });
    });

    if (okBtn && !okBtn.dataset.bound) {
      okBtn.dataset.bound = '1';
      okBtn.addEventListener('click', closeRxModal);
    }

    var closeBtn = modal.querySelector('[data-close-modal]');
    if (closeBtn && !closeBtn.dataset.rxBound) {
      closeBtn.dataset.rxBound = '1';
      closeBtn.addEventListener('click', closeRxModal);
    }

    if (!modal.dataset.rxOverlay) {
      modal.dataset.rxOverlay = '1';
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeRxModal();
      });
    }
  }


  function initPrivateCorner() {
    var promisesBtn = document.getElementById('promises-btn');
    var jokesBtn = document.getElementById('jokes-btn');
    var promisesModal = document.getElementById('promises-modal');
    var jokesModal = document.getElementById('jokes-modal');
    var jokesVault = document.getElementById('jokes-vault');

    if (jokesVault && !jokesVault.dataset.ready) {
      jokesVault.dataset.ready = '1';
      renderJokeCategory(jokesVault, '🤫 בדיחות פנימיות / זיכרונות שלנו', PRIVATE_JOKES.inside, 'inside');
      renderJokeCategory(jokesVault, '💇 בדיחות בלונדיניות', PRIVATE_JOKES.blonde, 'blonde');
    }

    function openModal(modal) {
      if (!modal) return;
      modal.hidden = false;
      modal.removeAttribute('hidden');
      modal.setAttribute('aria-hidden', 'false');
      // force display in case CSS [hidden] fights us
      modal.style.display = 'flex';
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
        modal.style.display = '';
      }, 350);
    }

    function bindOpen(btn, modal) {
      if (!btn || btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(modal);
      });
    }

    bindOpen(promisesBtn, promisesModal);
    bindOpen(jokesBtn, jokesModal);

    document.querySelectorAll('[data-close-modal]').forEach(function (btn) {
      if (btn.dataset.boundClose) return;
      btn.dataset.boundClose = '1';
      btn.addEventListener('click', function () {
        closeModal(btn.closest('.modal-overlay'));
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
      if (overlay.dataset.boundOverlay) return;
      overlay.dataset.boundOverlay = '1';
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
        window.setTimeout(function () { panel.hidden = true; }, 350);
      } else {
        panel.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
        requestAnimationFrame(function () { panel.classList.add('is-open'); });
        if (typeof startTogetherTimer === 'function') startTogetherTimer();
        if (typeof initLoveQuotes === 'function') initLoveQuotes();
      }
    });
  }


  // ——— Panel navigation (light, no endless scroll) ———
  var PANEL_MAP = {
    home: 'home-menu',
    letter: 'letter-section',
    quiz: 'quiz-section',
    story: 'story-section',
    vouchers: 'sec-vouchers',
    private: 'sec-private',
    prescription: 'sec-prescription',
    cigpack: 'sec-cigpack',
    wheel: 'sec-wheel',
    catch: 'sec-catch',
    personal: 'sec-personal'
  };

  function showPanel(name) {
    var key = name || 'home';
    if (!PANEL_MAP[key]) key = 'home';
    body.classList.add('site-panels');

    var hub = document.getElementById('main-hub');
    if (hub) {
      hub.hidden = false;
      hub.classList.add('is-visible');
    }

    // ensure all mapped nodes are visible to the panel system (not [hidden])
    Object.keys(PANEL_MAP).forEach(function (k) {
      var el = document.getElementById(PANEL_MAP[k]);
      if (!el) return;
      el.hidden = false;
      el.removeAttribute('hidden');
      el.style.display = '';
      el.classList.remove('is-active-panel');
      if (k === 'story') el.classList.add('is-visible', 'is-inline');
      if (k === 'quiz') {
        el.classList.remove('is-leaving');
      }
      if (k === 'letter') {
        el.classList.add('is-entering', 'is-journey');
        el.classList.remove('is-leaving');
      }
    });

    var home = document.getElementById('home-menu');
    if (home) {
      home.hidden = false;
      home.removeAttribute('hidden');
    }

    var active = document.getElementById(PANEL_MAP[key]);
    if (active) {
      active.classList.add('is-active-panel');
      active.scrollTop = 0;
    }

    var nav = document.getElementById('app-nav');
    if (nav) {
      nav.querySelectorAll('.app-nav-btn').forEach(function (b) {
        b.classList.toggle('is-active', b.getAttribute('data-panel') === key);
      });
    }

    if (key === 'quiz' && quizSection) {
      quizSection.classList.remove('is-collapsed');
      var badge = document.getElementById('quiz-done-badge');
      if (badge) badge.style.display = 'none';
      if (!quizSection.querySelector('.quiz-question') && typeof startQuiz === 'function') {
        quizLocked = false;
        startQuiz();
      }
    }

    if (key === 'personal' && typeof initPersonalToggle === 'function') {
      initPersonalToggle();
    }
    if (key === 'catch' && typeof initCatchTheVibe === 'function') initCatchTheVibe();
    if (key === 'wheel' && typeof initFunWheel === 'function') initFunWheel();

    window.setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 80);
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
    if (typeof initPersonalToggle === 'function') initPersonalToggle();
  }

  function initAppNav() {
    const nav = document.getElementById('app-nav');
    if (!nav || nav.dataset.bound) return;
    nav.dataset.bound = '1';

    function bindPanelBtn(btn) {
      btn.addEventListener('click', function () {
        const name = btn.getAttribute('data-panel');
        if (name) showPanel(name);
      });
    }

    nav.querySelectorAll('[data-panel]').forEach(bindPanelBtn);

    document.querySelectorAll('.home-card[data-panel]').forEach(function (btn) {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      bindPanelBtn(btn);
    });
  }

  function goToStory() {
    const hub = document.getElementById('main-hub');
    const personal = document.getElementById('sec-personal');

    if (letterSection) {
      letterSection.hidden = false;
      letterSection.style.display = '';
      letterSection.classList.add('is-journey');
      letterSection.classList.remove('is-leaving');
    }
    if (hub) {
      hub.hidden = false;
      hub.classList.add('is-visible');
    }
    if (storySection) {
      storySection.hidden = false;
      storySection.classList.add('is-visible', 'is-inline');
    }
    if (personal) personal.hidden = false;

    body.classList.remove('is-locked');
    body.classList.add('is-unlocked', 'has-app-nav', 'stage-hub');
    showAppNav();
    initScrollReveals();
    initParallax();

    if (typeof showPanel === 'function') showPanel('story');
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
      p.style.color = i % 2 === 0 ? '#C4878F' : '#F3E2B5';
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
        color: Math.random() > 0.5 ? '196,122,138' : '224,192,120',
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
