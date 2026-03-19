document.addEventListener('DOMContentLoaded', function() {
    var inits = [initTheme, initSplash, initHeader, initMobileMenu, initLangSwitcher,
                 initSmoothScroll, initScrollSpy, initCountUp, initRevealAnimations,
                 initBackToTop, initFAQ, initContactForm];
    for (var i = 0; i < inits.length; i++) {
        try { inits[i](); } catch(e) { /* prevent cascade failure */ }
    }
});

/* ========================================
   Splash screen
   ======================================== */
function initSplash() {
    var splash = document.getElementById('splash');
    if (!splash) return;
    document.body.style.overflow = 'hidden';
    setTimeout(function() {
        splash.classList.add('hidden');
        document.body.style.overflow = '';
    }, 2200);
    setTimeout(function() {
        splash.parentNode.removeChild(splash);
    }, 2800);
}

/* ========================================
   Theme (dark/light)
   ======================================== */
function initTheme() {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);

    var toggles = document.querySelectorAll('#themeToggle, #themeToggleMobile');
    for (var i = 0; i < toggles.length; i++) {
        toggles[i].addEventListener('click', function() {
            var current = document.documentElement.getAttribute('data-theme');
            var next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.classList.add('theme-transition');
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            setTimeout(function() {
                document.documentElement.classList.remove('theme-transition');
            }, 600);
        });
    }
}

/* ========================================
   Header scroll
   ======================================== */
function initHeader() {
    var header = document.getElementById('header');
    function onScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ========================================
   Mobile menu
   ======================================== */
function initMobileMenu() {
    var burger = document.getElementById('burger');
    var nav = document.getElementById('nav');
    if (!burger || !nav) return;

    burger.addEventListener('click', function(e) {
        e.stopPropagation();
        burger.classList.toggle('active');
        nav.classList.toggle('open');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    var links = nav.querySelectorAll('.header__nav-link');
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function() {
            burger.classList.remove('active');
            nav.classList.remove('open');
            document.body.style.overflow = '';
        });
    }
}

/* ========================================
   Language Switcher
   ======================================== */
function initLangSwitcher() {
    var saved = localStorage.getItem('lang') || 'ru';
    applyLanguage(saved);

    var langBtn = document.getElementById('langBtn');
    var dropdown = document.getElementById('langDropdown');

    if (langBtn && dropdown) {
        langBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.classList.toggle('open');
        });
    }

    document.addEventListener('click', function(e) {
        var option = e.target.closest
            ? e.target.closest('.header__lang-option')
            : findParent(e.target, 'header__lang-option');

        if (option) {
            var lang = option.getAttribute('data-lang');
            if (lang) {
                applyLanguage(lang);
                try { localStorage.setItem('lang', lang); } catch(ex) {}
            }
            if (dropdown) dropdown.classList.remove('open');
            return;
        }

        if (dropdown) dropdown.classList.remove('open');
    });
}

function findParent(el, className) {
    while (el && el !== document) {
        if (el.classList && el.classList.contains(className)) return el;
        el = el.parentElement;
    }
    return null;
}

function applyLanguage(lang) {
    if (!window.translations) return;
    var t = window.translations[lang];
    if (!t) return;

    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
        var key = els[i].getAttribute('data-i18n');
        if (t[key] !== undefined) els[i].textContent = t[key];
    }

    var htmlEls = document.querySelectorAll('[data-i18n-html]');
    for (var i = 0; i < htmlEls.length; i++) {
        var key = htmlEls[i].getAttribute('data-i18n-html');
        if (t[key] !== undefined) htmlEls[i].innerHTML = t[key];
    }

    var phEls = document.querySelectorAll('[data-i18n-placeholder]');
    for (var i = 0; i < phEls.length; i++) {
        var key = phEls[i].getAttribute('data-i18n-placeholder');
        if (t[key] !== undefined) phEls[i].placeholder = t[key];
    }

    document.documentElement.lang = (lang === 'uk') ? 'uk' : lang;

    var currentSpan = document.querySelector('.header__lang-current');
    if (currentSpan) currentSpan.textContent = lang.toUpperCase();

    var allOptions = document.querySelectorAll('.header__lang-option');
    for (var i = 0; i < allOptions.length; i++) {
        if (allOptions[i].getAttribute('data-lang') === lang) {
            allOptions[i].classList.add('active');
        } else {
            allOptions[i].classList.remove('active');
        }
    }
}

/* ========================================
   Smooth scroll
   ======================================== */
function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var headerHeight = document.getElementById('header').offsetHeight || 80;
                var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    }
}

/* ========================================
   Scroll spy
   ======================================== */
function initScrollSpy() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.header__nav-link[data-section]');

    function onScroll() {
        var scrollY = window.scrollY + 200;
        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                for (var j = 0; j < navLinks.length; j++) {
                    if (navLinks[j].getAttribute('data-section') === id) {
                        navLinks[j].classList.add('active');
                    } else {
                        navLinks[j].classList.remove('active');
                    }
                }
            }
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ========================================
   Count-up animation
   ======================================== */
function initCountUp() {
    runCounters();
    window.addEventListener('pageshow', function() { runCounters(); });
}

function runCounters() {
    var counters = document.querySelectorAll('.hero__stat-number[data-count]');
    if (!counters.length) return;

    for (var i = 0; i < counters.length; i++) {
        counters[i].textContent = '0';
        counters[i].removeAttribute('data-done');
    }

    function go() {
        for (var i = 0; i < counters.length; i++) {
            if (counters[i].getAttribute('data-done')) continue;
            animateOne(counters[i]);
        }
    }

    setTimeout(go, 2500);
}

function animateOne(el) {
    if (el.getAttribute('data-done')) return;
    el.setAttribute('data-done', '1');
    var target = parseInt(el.getAttribute('data-count'), 10);
    var start = Date.now();
    var duration = 1800;

    function step() {
        var t = Math.min((Date.now() - start) / duration, 1);
        var ease = 1 - Math.pow(1 - t, 3);
        var val = Math.round(ease * target);
        el.textContent = val;

        var shake = (1 - t) * 3;
        el.style.transform = 'translateY(' + Math.round(Math.sin(t * 20) * shake) + 'px)';

        if (t < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = target;
            el.style.transform = '';
        }
    }
    requestAnimationFrame(step);
}

/* ========================================
   Reveal on scroll
   ======================================== */
function initRevealAnimations() {
    var selectors = '.about__card,.about__feature,.services__card,.containers__card,.geography__info-card,.contact__card,.contact__form-wrapper,.cta__inner,.section-header,.faq__item';
    var elements = document.querySelectorAll(selectors);

    for (var i = 0; i < elements.length; i++) {
        elements[i].classList.add('reveal');
    }

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    entries[i].target.classList.add('visible');
                    observer.unobserve(entries[i].target);
                }
            }
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        for (var i = 0; i < elements.length; i++) {
            observer.observe(elements[i]);
        }
    } else {
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.add('visible');
        }
    }
}

/* ========================================
   Back to top
   ======================================== */
function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', function() {
        if (window.scrollY > 600) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });
    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ========================================
   FAQ Accordion
   ======================================== */
function initFAQ() {
    var questions = document.querySelectorAll('.faq__question');

    for (var i = 0; i < questions.length; i++) {
        questions[i].addEventListener('click', function() {
            var item = this.parentElement;
            var answer = item.querySelector('.faq__answer');
            var isOpen = item.classList.contains('active');

            var allItems = document.querySelectorAll('.faq__item');
            for (var j = 0; j < allItems.length; j++) {
                if (allItems[j] !== item && allItems[j].classList.contains('active')) {
                    allItems[j].classList.remove('active');
                    allItems[j].querySelector('.faq__question').setAttribute('aria-expanded', 'false');
                    allItems[j].querySelector('.faq__answer').style.maxHeight = '0px';
                }
            }

            if (isOpen) {
                item.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = '0px';
            } else {
                item.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 20 + 'px';
            }
        });
    }
}

/* ========================================
   Contact form
   ======================================== */
function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        var original = btn.textContent;
        btn.textContent = '\u2713';
        btn.style.background = '#2d5e43';
        btn.style.borderColor = '#2d5e43';
        btn.style.color = '#fff';
        btn.disabled = true;
        setTimeout(function() {
            btn.textContent = original;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = '';
            btn.disabled = false;
            form.reset();
        }, 3000);
    });
}
