/**
 * Avital & Me — One Year Anniversary
 * Access gate + story unlock + particles + scroll reveals
 */

(function () {
  'use strict';

  // ——— Valid access codes ———
  const VALID_CODES = new Set([
    '0547866885',
    '05.11.2000',
    '05112000',
  ]);

  // ——— DOM ———
  const body = document.body;
  const loginSection = document.getElementById('login-section');
  const storySection = document.getElementById('story-section');
  const accessForm = document.getElementById('access-form');
  const accessInput = document.getElementById('access-code');
  const errorMessage = document.getElementById('error-message');
  const enterBtn = document.getElementById('enter-btn');
  const successSplash = document.getElementById('success-splash');
  const splashHearts = document.getElementById('splash-hearts');
  const canvas = document.getElementById('particles');

  body.classList.add('is-locked');

  // ——— Normalize & validate ———
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

    // Accept birthday with dashes: 05-11-2000
    const withDashes = String(value || '')
      .trim()
      .replace(/\s+/g, '');
    if (withDashes === '05-11-2000') return true;

    const digits = code.replace(/\D/g, '');
    if (digits === '0547866885' || digits === '05112000') return true;

    return false;
  }

  // ——— Form submit ———
  accessForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const value = accessInput.value;

    if (!isValidCode(value)) {
      showError();
      return;
    }

    hideError();
    unlockStory();
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

  // ——— Unlock transition ———
  function unlockStory() {
    enterBtn.disabled = true;
    playHeartSplash();

    window.setTimeout(function () {
      loginSection.classList.add('is-leaving');

      window.setTimeout(function () {
        loginSection.setAttribute('hidden', '');
        loginSection.style.display = 'none';

        storySection.hidden = false;
        void storySection.offsetWidth;
        storySection.classList.add('is-visible');

        body.classList.remove('is-locked');
        body.classList.add('is-unlocked');

        initScrollReveals();
        initParallax();

        window.scrollTo(0, 0);
      }, 850);
    }, 1400);
  }

  function playHeartSplash() {
    successSplash.classList.add('is-active');
    successSplash.setAttribute('aria-hidden', 'false');
    splashHearts.innerHTML = '';

    const count = 18;
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('span');
      heart.className = 'splash-heart';
      heart.textContent = i % 3 === 0 ? '✦' : '❤';
      heart.style.left = 35 + Math.random() * 30 + '%';
      heart.style.top = 40 + Math.random() * 20 + '%';
      heart.style.fontSize = 0.9 + Math.random() * 1.4 + 'rem';
      heart.style.color = i % 2 === 0 ? '#B76E79' : '#E8D5A3';
      heart.style.setProperty('--hx', (Math.random() - 0.5) * 280 + 'px');
      heart.style.setProperty('--hy', -80 - Math.random() * 220 + 'px');
      heart.style.animationDelay = Math.random() * 0.35 + 's';
      splashHearts.appendChild(heart);
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
      const scrollY = window.scrollY || window.pageYOffset;
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

    window.addEventListener('resize', function () {
      init();
    });

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