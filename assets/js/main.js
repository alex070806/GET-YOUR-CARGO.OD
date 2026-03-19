document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initSplash();
    initHeader();
    initMobileMenu();
    initLangSwitcher();
    initSmoothScroll();
    initScrollSpy();
    initCountUp();
    initRevealAnimations();
    initBackToTop();
    initFAQ();
    initContactForm();
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
    var btn = document.getElementById('langBtn');
    var dropdown = document.getElementById('langDropdown');
    if (!btn || !dropdown) return;

    var saved = localStorage.getItem('lang') || 'ru';
    applyLanguage(saved);

    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });

    var options = dropdown.querySelectorAll('.header__lang-option');
    for (var i = 0; i < options.length; i++) {
        options[i].addEventListener('click', function(e) {
            e.stopPropagation();
            var lang = this.getAttribute('data-lang');
            applyLanguage(lang);
            localStorage.setItem('lang', lang);
            dropdown.classList.remove('open');
        });
    }

    document.addEventListener('click', function() {
        dropdown.classList.remove('open');
    });
}

function applyLanguage(lang) {
    var t = window.translations && window.translations[lang];
    if (!t) return;

    var textEls = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < textEls.length; i++) {
        var key = textEls[i].getAttribute('data-i18n');
        if (t[key] !== undefined) {
            textEls[i].textContent = t[key];
        }
    }

    var htmlEls = document.querySelectorAll('[data-i18n-html]');
    for (var i = 0; i < htmlEls.length; i++) {
        var key = htmlEls[i].getAttribute('data-i18n-html');
        if (t[key] !== undefined) {
            htmlEls[i].innerHTML = t[key];
        }
    }

    var placeholderEls = document.querySelectorAll('[data-i18n-placeholder]');
    for (var i = 0; i < placeholderEls.length; i++) {
        var key = placeholderEls[i].getAttribute('data-i18n-placeholder');
        if (t[key] !== undefined) {
            placeholderEls[i].placeholder = t[key];
        }
    }

    document.documentElement.lang = lang === 'uk' ? 'uk' : lang;

    var langBtn = document.getElementById('langBtn');
    if (langBtn) {
        var currentSpan = langBtn.querySelector('.header__lang-current');
        if (currentSpan) currentSpan.textContent = lang.toUpperCase();
    }

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
   Count-up with scroll/roll animation
   ======================================== */
function initCountUp() {
    var rollers = document.querySelectorAll('.hero__stat-roller[data-count]');
    var animated = false;

    function animate() {
        if (animated) return;
        animated = true;
        for (var i = 0; i < rollers.length; i++) {
            (function(roller) {
                var target = parseInt(roller.getAttribute('data-count'), 10);
                var numberEl = roller.querySelector('.hero__stat-number');
                var duration = 2000;
                var startTime = null;

                function easeOutCubic(t) {
                    return 1 - Math.pow(1 - t, 3);
                }

                function tick(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var progress = Math.min((timestamp - startTime) / duration, 1);
                    var eased = easeOutCubic(progress);
                    var current = Math.round(eased * target);

                    numberEl.textContent = current;

                    var speed = (1 - progress) * 3;
                    numberEl.style.transform = 'translateY(' + (Math.sin(progress * Math.PI * 4) * speed) + 'px)';

                    if (progress < 1) {
                        requestAnimationFrame(tick);
                    } else {
                        numberEl.style.transform = '';
                    }
                }

                requestAnimationFrame(tick);
            })(rollers[i]);
        }
    }

    var stats = document.querySelector('.hero__stats');
    if (!stats) return;

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) { animate(); observer.disconnect(); }
            }
        }, { threshold: 0.5 });
        observer.observe(stats);
    } else {
        animate();
    }
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
