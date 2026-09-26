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
      question: '\u05d0\u05d9\u05e4\u05d4 \u05d4\u05d9\u05ea\u05d4 \u05d4\u05e0\u05e9\u05d9\u05e7\u05d4 \u05d4\u05e8\u05d0\u05e9\u05d5\u05e0\u05d4 \u05e9\u05dc\u05e0\u05d5?',
      options: [
        '\u05e2\u05dc \u05e1\u05e4\u05e1\u05dc \u05d1\u05e4\u05d0\u05e8\u05e7',
        '\u05d1\u05de\u05db\u05d5\u05e0\u05d9\u05ea \u05d0\u05d7\u05e8\u05d9 \u05d4\u05d3\u05d9\u05d9\u05d8',
        '\u05e2\u05dc \u05d4\u05d2\u05d2 \u05ea\u05d7\u05ea \u05d4\u05db\u05d5\u05db\u05d1\u05d9\u05dd',
        '\u05d1\u05db\u05e0\u05d9\u05e1\u05d4 \u05dc\u05d1\u05e0\u05d9\u05d9\u05df \u05e9\u05dc\u05da',
      ],
      // <<< Change this index to set the correct answer (0–3)
      correctIndex: 1,
    },
    {
      id: 2,
      type: 'choice',
      question: '\u05de\u05d9 \u05e9\u05dc\u05d7 \u05d4\u05d5\u05d3\u05e2\u05d4 \u05e8\u05d0\u05e9\u05d5\u05df \u05d1\u05e4\u05d9\u05d9\u05e1\u05d1\u05d5\u05e7?',
      options: [
        '\u05d0\u05e0\u05d9 (\u05d0\u05ea\u05d4)',
        '\u05d0\u05d1\u05d9\u05d8\u05dc',
        '\u05e9\u05e0\u05d9\u05e0\u05d5 \u05d1\u05d9\u05d7\u05d3',
      ],
      // <<< Change this index — 0 = "\u05d0\u05e0\u05d9"
      correctIndex: 0,
    },
    {
      id: 3,
      type: 'choice',
      question: '\u05de\u05d4 \u05d4\u05de\u05d0\u05db\u05dc \u05e9\u05e9\u05e0\u05d9\u05e0\u05d5 \u05d4\u05db\u05d9 \u05d0\u05d5\u05d4\u05d1\u05d9\u05dd \u05dc\u05d4\u05d6\u05de\u05d9\u05df?',
      options: [
        '\u05e1\u05d5\u05e9\u05d9',
        '\u05e4\u05d9\u05e6\u05d4',
        '\u05d4\u05de\u05d1\u05d5\u05e8\u05d2\u05e8',
        '\u05d4\u05db\u05dc!',
      ],
      correctIndex: 3, // "\u05d4\u05db\u05dc!"
    },
    {
      id: 4,
      type: 'pin',
      question: '\u05de\u05d4 \u05d4\u05e7\u05d5\u05d3 \u05dc\u05e6\u05d0\u05d8 \u05d4\u05e1\u05d5\u05d3\u05d9?',
      // <<< Change the secret pin here
      correctAnswer: '1105',
      placeholder: '****',
      submitLabel: '\u05d1\u05d3\u05d9\u05e7\u05d4',
    },
    {
      id: 5,
      type: 'choice',
      question: '\u05de\u05d4 \u05de\u05e7\u05d5\u05dd \u05d4\u05d1\u05d9\u05dc\u05d5\u05d9 \u05e9\u05d0\u05e0\u05d7\u05e0\u05d5 \u05d4\u05db\u05d9 \u05d0\u05d5\u05d4\u05d1\u05d9\u05dd?',
      options: [
        '\u05de\u05e1\u05e2\u05d3\u05d4 \u05d9\u05d5\u05e7\u05e8\u05ea\u05d9\u05ea',
        '\u05d4\u05d9\u05dd \u05d1\u05e2\u05e8\u05d1',
        '\u05d0\u05d9\u05d7\u05d5\u05d3 \u05d4\u05e6\u05dc\u05d4',
        '\u05e1\u05e8\u05d8 \u05d1\u05d1\u05d9\u05ea',
      ],
      correctIndex: 2, // "\u05d0\u05d9\u05d7\u05d5\u05d3 \u05d4\u05e6\u05dc\u05d4"
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
          showQuizFeedback(MSG.wrong, false);
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
    letterSection.classList.add('is-entering');
    body.classList.add('is-locked');
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
    continueStoryBtn.hidden = false;
    requestAnimationFrame(function () {
      continueStoryBtn.classList.add('is-shown');
    });
  }

  if (continueStoryBtn) {
    continueStoryBtn.addEventListener('click', goToStory);
  }

  function goToStory() {
    letterSection.classList.remove('is-entering');
    letterSection.classList.add('is-leaving');

    window.setTimeout(function () {
      letterSection.setAttribute('hidden', '');
      letterSection.style.display = 'none';

      storySection.hidden = false;
      void storySection.offsetWidth;
      storySection.classList.add('is-visible');

      body.classList.remove('is-locked');
      body.classList.add('is-unlocked');

      initScrollReveals();
      initParallax();
      window.scrollTo(0, 0);
    }, 850);
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
