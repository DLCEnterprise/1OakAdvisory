/* 1 Oak Advisory — Interactive JS */

(function () {
  'use strict';

  /* Respect the OS "reduce motion" setting for every effect below. */
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================================================================
     1. PAGE TRANSITION
     Black overlay wipes up to reveal on load; sweeps in from below
     on navigation, then navigates after the cover completes.
  ================================================================ */
  var overlay = document.querySelector('.page-transition');

  if (overlay && !reduceMotion) {
    /* Reveal: slide the overlay up off the screen */
    overlay.style.transform = 'translateY(0)';
    overlay.style.transition = 'none';

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.style.transition = 'transform 0.78s cubic-bezier(0.76, 0, 0.24, 1)';
        overlay.style.transform  = 'translateY(-105%)';
      });
    });

    /* bfcache — browser back/forward */
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        overlay.style.transition = 'none';
        overlay.style.transform  = 'translateY(-105%)';
        setTimeout(function () { overlay.style.transition = ''; }, 60);
      }
    });

    /* Intercept internal link clicks */
    document.addEventListener('click', function (e) {
      if (
        e.defaultPrevented || e.button !== 0 ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
      ) return;

      var link = e.target.closest('a');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href) return;
      if (link.hasAttribute('download')) return;
      if (
        href.indexOf('http') === 0 ||
        href.indexOf('//') === 0 ||
        href.indexOf('#') === 0 ||
        href.indexOf('mailto:') === 0 ||
        href.indexOf('tel:') === 0 ||
        link.target === '_blank'
      ) return;

      e.preventDefault();

      /* Snap overlay to below viewport, then animate it up to cover */
      overlay.style.transition  = 'none';
      overlay.style.transform   = 'translateY(105%)';
      overlay.style.pointerEvents = 'all';

      /* Force reflow so the snap takes effect before we re-enable transition */
      overlay.getBoundingClientRect();

      overlay.style.transition = 'transform 0.78s cubic-bezier(0.76, 0, 0.24, 1)';
      overlay.style.transform  = 'translateY(0)';

      setTimeout(function () {
        window.location.href = href;
      }, 800);

      /* If the navigation never happens (blocked, cancelled, slow), uncover the page. */
      setTimeout(function () {
        overlay.style.transition = 'transform 0.5s ease';
        overlay.style.transform  = 'translateY(-105%)';
        overlay.style.pointerEvents = 'none';
      }, 4000);
    });
  }

  /* Fire entrance animations after the transition reveal completes */
  if (reduceMotion) {
    document.body.classList.add('page-loaded');
  } else {
    setTimeout(function () {
      document.body.classList.add('page-loaded');
    }, 820);
  }


  /* ================================================================
     2. CUSTOM CURSOR (desktop only)
     Ring follows with lerp; dot snaps to mouse instantly.
  ================================================================ */
  var ring = document.querySelector('.cursor-ring');
  var dot  = document.querySelector('.cursor-dot');
  var isPointerFine = !!(window.matchMedia &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches);

  if (ring && dot && isPointerFine && !reduceMotion) {
    var mx = -100, my = -100;
    var rx = -100, ry = -100;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    document.addEventListener('mousedown', function () {
      document.body.classList.add('cursor-active');
    });

    document.addEventListener('mouseup', function () {
      document.body.classList.remove('cursor-active');
    });

    /* Lerp ring to cursor */
    function lerpCursor() {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(lerpCursor);
    }
    lerpCursor();

    /* Expand ring on interactive elements */
    document.querySelectorAll('a, button, input, textarea, label, [role="button"]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
    });

  } else {
    if (ring) ring.style.display = 'none';
    if (dot)  dot.style.display  = 'none';
  }


  /* ================================================================
     3. SCROLL PROGRESS BAR
  ================================================================ */
  var progressBar = document.querySelector('.scroll-progress');

  if (progressBar) {
    var ticking = false;

    function updateProgress() {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        progressBar.style.transform = 'scaleX(' + (window.scrollY / total) + ')';
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
  }


  /* ================================================================
     4. NAV SCROLL STATE (backdrop blur)
  ================================================================ */
  var nav = document.querySelector('.nav');

  if (nav) {
    function updateNav() {
      nav.classList.toggle('is-scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', updateNav, { passive: true });
  }


  /* ================================================================
     5. HAMBURGER / MOBILE MENU
  ================================================================ */
  var hamburger  = document.querySelector('.nav__hamburger');
  var mobileMenu = document.querySelector('.nav__mobile');

  if (hamburger && mobileMenu) {
    function setMenu(isOpen) {
      hamburger.classList.toggle('open', isOpen);
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    }

    hamburger.addEventListener('click', function () {
      setMenu(!hamburger.classList.contains('open'));
      if (hamburger.classList.contains('open')) {
        var first = mobileMenu.querySelector('a');
        if (first) first.focus();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && hamburger.classList.contains('open')) {
        setMenu(false);
        hamburger.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        setMenu(false);
      }
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });

    /* Widening past the desktop breakpoint must not strand the menu open. */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1010 && hamburger.classList.contains('open')) setMenu(false);
    });
  }


  /* ================================================================
     6. SCROLL REVEAL — fade-in + staggered pillars
  ================================================================ */
  var fadeEls      = document.querySelectorAll('.fade-in');
  var pillarGroups = document.querySelectorAll('.pillars');

  if ('IntersectionObserver' in window) {
    var fadeObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });

    fadeEls.forEach(function (el) { fadeObs.observe(el); });

    var pillarObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('stagger-visible');
          pillarObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });

    pillarGroups.forEach(function (g) {
      g.classList.add('stagger-in');
      pillarObs.observe(g);
    });

  } else {
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
    pillarGroups.forEach(function (g) { g.classList.add('stagger-visible'); });
  }


  /* ================================================================
     7. MAGNETIC BUTTONS
     Buttons subtly follow the cursor on hover.
  ================================================================ */
  if (!reduceMotion) document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var dx   = (e.clientX - (rect.left + rect.width  / 2)) * 0.10;
      var dy   = (e.clientY - (rect.top  + rect.height / 2)) * 0.14;
      btn.style.transition = 'transform 0.15s ease';
      btn.style.transform  = 'translate(' + dx + 'px, ' + dy + 'px)';
    });

    btn.addEventListener('mouseleave', function () {
      btn.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
      btn.style.transform  = '';
    });
  });


  /* ================================================================
     8. PARALLAX — hero tree watermark drifts slowly on scroll
  ================================================================ */
  var heroImg = document.querySelector('.hero__visual img');

  if (heroImg && !reduceMotion) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.5) {
        heroImg.style.transform = 'translateY(' + (y * 0.07) + 'px)';
      }
    }, { passive: true });
  }


  /* ================================================================
     9. ACTIVE NAV LINK
  ================================================================ */
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === page) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
      if (!link.classList.contains('nav__cta')) {
        link.classList.remove('active');
      }
    }
  });


  /* ================================================================
     10. CONTACT FORM FEEDBACK
  ================================================================ */
  /* Form vendors return here with ?sent=1 (see the _next field on contact.html). */
  var successPanel = document.getElementById('form-success');
  if (successPanel && /[?&]sent=1/.test(window.location.search)) {
    successPanel.hidden = false;
    successPanel.scrollIntoView({ block: 'center' });
  }

  var form = document.querySelector('.contact-form');
  if (form) {
    var submitBtn   = form.querySelector('button[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.textContent : '';

    /* Native constraint validation blocks an invalid form before this fires. */
    form.addEventListener('submit', function () {
      if (!submitBtn) return;
      submitBtn.textContent = 'Sending\u2026';
      submitBtn.disabled    = true;
    });

    /* Restore the button when the browser restores the page from bfcache. */
    window.addEventListener('pageshow', function (e) {
      if (e.persisted && submitBtn) {
        submitBtn.textContent = submitLabel;
        submitBtn.disabled    = false;
      }
    });
  }

}());
