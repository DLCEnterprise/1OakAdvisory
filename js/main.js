/* 1 Oak Advisory — Interactive JS */

(function () {
  'use strict';

  /* ================================================================
     1. PAGE TRANSITION
     Black overlay wipes up to reveal on load; sweeps in from below
     on navigation, then navigates after the cover completes.
  ================================================================ */
  var overlay = document.querySelector('.page-transition');

  if (overlay) {
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
      var link = e.target.closest('a');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href) return;
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
    });
  }

  /* Fire entrance animations after the transition reveal completes */
  setTimeout(function () {
    document.body.classList.add('page-loaded');
  }, 820);


  /* ================================================================
     2. CUSTOM CURSOR (desktop only)
     Ring follows with lerp; dot snaps to mouse instantly.
  ================================================================ */
  var ring = document.querySelector('.cursor-ring');
  var dot  = document.querySelector('.cursor-dot');
  var isPointerFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (ring && dot && isPointerFine) {
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
    hamburger.addEventListener('click', function () {
      var isOpen = this.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      this.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
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
    }, { threshold: 0.08 });

    fadeEls.forEach(function (el) { fadeObs.observe(el); });

    var pillarObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('stagger-visible');
          pillarObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

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
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var dx   = (e.clientX - (rect.left + rect.width  / 2)) * 0.22;
      var dy   = (e.clientY - (rect.top  + rect.height / 2)) * 0.28;
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

  if (heroImg) {
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
  document.querySelectorAll('.nav__links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === page) {
      link.classList.add('active');
    } else if (!link.classList.contains('nav__cta')) {
      link.classList.remove('active');
    }
  });


  /* ================================================================
     10. CONTACT FORM FEEDBACK
  ================================================================ */
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function () {
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Sending\u2026';
        btn.disabled    = true;
      }
    });
  }

}());
