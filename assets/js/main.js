document.addEventListener('DOMContentLoaded', () => {
    initTheme();
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
   Theme (dark/light)
   ======================================== */
function initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);

    document.querySelectorAll('#themeToggle, #themeToggleMobile').forEach(btn => {
        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    });
}

/* ========================================
   Header scroll
   ======================================== */
function initHeader() {
    const header = document.getElementById('header');
    function onScroll() {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ========================================
   Mobile menu
   ======================================== */
function initMobileMenu() {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('open');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });
    nav.querySelectorAll('.header__nav-link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/* ========================================
   Language Switcher
   ======================================== */
function initLangSwitcher() {
    const btn = document.getElementById('langBtn');
    const dropdown = document.getElementById('langDropdown');
    if (!btn || !dropdown) return;

    const saved = localStorage.getItem('lang') || 'ru';
    setLanguage(saved);

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });

    dropdown.querySelectorAll('.header__lang-option').forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.dataset.lang;
            setLanguage(lang);
            localStorage.setItem('lang', lang);
            dropdown.classList.remove('open');
        });
    });

    document.addEventListener('click', () => dropdown.classList.remove('open'));
}

function setLanguage(lang) {
    if (!translations[lang]) return;
    const t = translations[lang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (t[key]) el.innerHTML = t[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.placeholder = t[key];
    });

    document.documentElement.lang = lang === 'uk' ? 'uk' : lang;

    const btn = document.getElementById('langBtn');
    if (btn) btn.querySelector('.header__lang-current').textContent = lang.toUpperCase();

    document.querySelectorAll('.header__lang-option').forEach(o => {
        o.classList.toggle('active', o.dataset.lang === lang);
    });
}

/* ========================================
   Smooth scroll
   ======================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/* ========================================
   Scroll spy
   ======================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__nav-link[data-section]');
    function onScroll() {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.dataset.section === id);
                });
            }
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ========================================
   Count-up animation
   ======================================== */
function initCountUp() {
    const counters = document.querySelectorAll('.hero__stat-number[data-count]');
    let animated = false;
    function animate() {
        if (animated) return;
        animated = true;
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count, 10);
            const duration = 2000;
            const step = Math.max(1, Math.ceil(target / (duration / 16)));
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) { current = target; clearInterval(timer); }
                counter.textContent = current;
            }, 16);
        });
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { animate(); observer.disconnect(); }
        });
    }, { threshold: 0.5 });
    const stats = document.querySelector('.hero__stats');
    if (stats) observer.observe(stats);
}

/* ========================================
   Reveal on scroll
   ======================================== */
function initRevealAnimations() {
    const selectors = [
        '.about__card', '.about__feature', '.services__card',
        '.containers__card', '.geography__info-card', '.geography__map-wrapper',
        '.contact__card', '.contact__form-wrapper', '.cta__inner',
        '.section-header', '.faq__item'
    ];
    const elements = document.querySelectorAll(selectors.join(','));
    elements.forEach(el => el.classList.add('reveal'));
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 60);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    elements.forEach(el => observer.observe(el));
}

/* ========================================
   Back to top
   ======================================== */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ========================================
   FAQ Accordion
   ======================================== */
function initFAQ() {
    document.querySelectorAll('.faq__question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq__item');
            const answer = item.querySelector('.faq__answer');
            const isOpen = item.classList.contains('active');

            document.querySelectorAll('.faq__item.active').forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove('active');
                    openItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
                    openItem.querySelector('.faq__answer').style.maxHeight = '0';
                }
            });

            if (isOpen) {
                item.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = '0';
            } else {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

/* ========================================
   Contact form
   ======================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const original = btn.textContent;
        btn.textContent = '✓';
        btn.style.background = '#2d5e43';
        btn.style.borderColor = '#2d5e43';
        btn.style.color = '#fff';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = original;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = '';
            btn.disabled = false;
            form.reset();
        }, 3000);
    });
}
