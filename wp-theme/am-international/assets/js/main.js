/* ==========================================================================
   Site behaviour - Apostolos Missions International
   Progressive enhancement only: every page is usable with this file absent.
   ========================================================================== */

(function () {
  'use strict';

  // Marks that JS is running, which switches on the scroll-reveal styles.
  document.documentElement.classList.add('js');

  var prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ------------------------------------------------------- sticky header -- */

  function initHeader() {
    var header = document.querySelector('.header');
    if (!header) return;

    // The header sits transparent over the hero and turns solid after it.
    var trigger = document.querySelector('.hero, .page-hero');
    var threshold = trigger ? trigger.offsetHeight * 0.6 : 80;

    function onScroll() {
      header.classList.toggle('is-stuck', window.scrollY > threshold);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
      threshold = trigger ? trigger.offsetHeight * 0.6 : 80;
      onScroll();
    });
    onScroll();
  }

  /* ---------------------------------------------------------- mega menu -- */

  function initMegaMenu() {
    var items = document.querySelectorAll('.nav__item--has-menu');
    if (!items.length) return;

    var openItem = null;
    var closeTimer = null;

    function open(item) {
      clearTimeout(closeTimer);
      if (openItem && openItem !== item) close(openItem);
      item.classList.add('is-open');
      var btn = item.querySelector('.nav__link');
      if (btn) btn.setAttribute('aria-expanded', 'true');
      openItem = item;
    }

    function close(item) {
      item.classList.remove('is-open');
      var btn = item.querySelector('.nav__link');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (openItem === item) openItem = null;
    }

    Array.prototype.forEach.call(items, function (item) {
      var btn = item.querySelector('.nav__link');
      if (!btn) return;

      // With a mouse the menu is already open by the time a click lands, so a
      // click means "take me to the section landing page". Without hover
      // (touch, or keyboard before focus) the first click opens the menu.
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var href = btn.getAttribute('data-href');
        if (item.classList.contains('is-open') && href) {
          window.location.href = href;
          return;
        }
        if (item.classList.contains('is-open')) close(item);
        else open(item);
      });

      // Keyboard users reach the menu through this same button: Enter fires
      // the click above, which opens it because hover never happened.

      item.addEventListener('mouseenter', function () {
        open(item);
      });

      item.addEventListener('mouseleave', function () {
        closeTimer = setTimeout(function () {
          close(item);
        }, 160);
      });

      // Close when focus leaves the whole item, for keyboard users.
      item.addEventListener('focusout', function (e) {
        if (!item.contains(e.relatedTarget)) close(item);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && openItem) {
        var btn = openItem.querySelector('.nav__link');
        close(openItem);
        if (btn) btn.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (openItem && !openItem.contains(e.target)) close(openItem);
    });
  }

  /* ------------------------------------------------------ mobile drawer -- */

  function initDrawer() {
    var toggle = document.querySelector('.nav-toggle');
    var drawer = document.querySelector('.drawer');
    if (!toggle || !drawer) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      drawer.classList.toggle('is-open', open);
      document.body.classList.toggle('is-locked', open);
      drawer.setAttribute('aria-hidden', String(!open));
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Collapsible groups inside the drawer.
    var groups = drawer.querySelectorAll('.drawer__group');
    Array.prototype.forEach.call(groups, function (group) {
      var btn = group.querySelector('.drawer__toggle');
      if (!btn || btn.tagName !== 'BUTTON') return;
      btn.addEventListener('click', function () {
        var open = group.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
      });
    });

    // Close the drawer if the viewport grows to desktop while it is open.
    window.matchMedia('(min-width: 1100px)').addEventListener('change', function (e) {
      if (e.matches) setOpen(false);
    });

    setOpen(false);
  }

  /* ------------------------------------------------------ scroll reveal -- */

  function initReveal() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    if (prefersReduced || !window.IntersectionObserver) {
      Array.prototype.forEach.call(targets, function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          // Stagger siblings so grids cascade rather than popping at once.
          var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
          setTimeout(function () {
            el.classList.add('is-visible');
          }, delay);
          io.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    Array.prototype.forEach.call(targets, function (el, i) {
      if (!el.hasAttribute('data-reveal-delay')) {
        var parent = el.parentElement;
        var siblings = parent
          ? parent.querySelectorAll(':scope > [data-reveal]')
          : [];
        if (siblings.length > 1) {
          var index = Array.prototype.indexOf.call(siblings, el);
          el.setAttribute('data-reveal-delay', String(Math.min(index, 5) * 80));
        }
      }
      io.observe(el);
    });
  }

  /* ---------------------------------------------------------- counters --- */

  function initCounters() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;

    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-count-suffix') || '';
      var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;

      if (prefersReduced) {
        el.textContent = target.toFixed(decimals) + suffix;
        return;
      }

      var duration = 1400;
      var start = null;

      function step(ts) {
        if (start === null) start = ts;
        var t = Math.min(1, (ts - start) / duration);
        // easeOutCubic
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    }

    if (!window.IntersectionObserver) {
      Array.prototype.forEach.call(nums, run);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          run(entry.target);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    Array.prototype.forEach.call(nums, function (el) {
      io.observe(el);
    });
  }

  /* --------------------------------------------------- chapter filter ---- */

  function initChapterFilter() {
    var input = document.querySelector('[data-chapter-search]');
    var list = document.querySelector('[data-chapter-list]');
    if (!input || !list) return;

    var items = list.querySelectorAll('li');
    var empty = document.querySelector('[data-chapter-empty]');

    function filter() {
      var q = input.value.trim().toLowerCase();
      var shown = 0;

      Array.prototype.forEach.call(items, function (li) {
        var hay = (li.textContent || '').toLowerCase();
        var match = !q || hay.indexOf(q) !== -1;
        li.hidden = !match;
        if (match) shown++;
      });

      if (empty) empty.hidden = shown !== 0;
    }

    input.addEventListener('input', filter);

    // The form has no backend yet, so keep Enter from navigating away.
    var form = input.closest('form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        filter();
      });
    }
  }

  /* ---------------------------------------------------------- accordion -- */

  function initAccordion() {
    var items = document.querySelectorAll('.accordion__item');
    Array.prototype.forEach.call(items, function (item) {
      var trigger = item.querySelector('.accordion__trigger');
      var panel = item.querySelector('.accordion__panel');
      if (!trigger || !panel) return;

      trigger.addEventListener('click', function () {
        var open = item.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', String(open));
        panel.setAttribute('aria-hidden', String(!open));
      });
    });
  }

  /* --------------------------------------------------------- newsletter -- */

  function initForms() {
    var forms = document.querySelectorAll('[data-placeholder-form]');
    Array.prototype.forEach.call(forms, function (form) {
      var status = form.querySelector('.form-status');
      form.addEventListener('submit', function (e) {
        // No mail backend is wired up yet - see README for where to point this.
        e.preventDefault();
        if (!status) return;
        var email = form.querySelector('input[type="email"]');
        if (email && !email.checkValidity()) {
          status.textContent = 'Please enter a valid email address.';
          return;
        }
        status.textContent =
          'Thanks. This form is not connected yet, so nothing was sent.';
      });
    });
  }

  /* -------------------------------------------------------------- year --- */

  function initYear() {
    var slots = document.querySelectorAll('[data-year]');
    var year = String(new Date().getFullYear());
    Array.prototype.forEach.call(slots, function (el) {
      el.textContent = year;
    });
  }

  /* -------------------------------------------------------------- boot --- */

  function boot() {
    initHeader();
    initMegaMenu();
    initDrawer();
    initReveal();
    initCounters();
    initChapterFilter();
    initAccordion();
    initForms();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
