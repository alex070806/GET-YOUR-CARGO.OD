document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initLangSwitcher();
    initSmoothScroll();
    initScrollSpy();
    initCountUp();
    initRevealAnimations();
    initBackToTop();
    initContactForm();
});

/* ========================================
   Header scroll effect
   ======================================== */
function initHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    function onScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = scrollY;
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

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });

    dropdown.querySelectorAll('.header__lang-option').forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.dataset.lang;
            dropdown.querySelectorAll('.header__lang-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            btn.querySelector('.header__lang-current').textContent = lang.toUpperCase();
            dropdown.classList.remove('open');
        });
    });

    document.addEventListener('click', () => {
        dropdown.classList.remove('open');
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
   Scroll spy for active nav links
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
                    link.classList.remove('active');
                    if (link.dataset.section === id) {
                        link.classList.add('active');
                    }
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

    function animateCounters() {
        if (animated) return;
        animated = true;

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count, 10);
            const duration = 2000;
            const step = Math.ceil(target / (duration / 16));
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = current;
            }, 16);
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.hero__stats');
    if (statsContainer) {
        observer.observe(statsContainer);
    }
}

/* ========================================
   Reveal on scroll
   ======================================== */
function initRevealAnimations() {
    const revealSelectors = [
        '.about__card',
        '.about__feature',
        '.services__card',
        '.geography__card',
        '.geography__countries',
        '.contact__card',
        '.contact__form-wrapper',
        '.cta__inner',
        '.section-header'
    ];

    const elements = document.querySelectorAll(revealSelectors.join(','));

    elements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* ========================================
   Back to top button
   ======================================== */
function initBackToTop() {
    const btn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ========================================
   Contact form (visual feedback only)
   ======================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Отправлено!';
        btn.style.background = '#2d5e43';
        btn.style.borderColor = '#2d5e43';
        btn.style.color = '#fff';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = '';
            btn.disabled = false;
            form.reset();
        }, 3000);
    });
}
