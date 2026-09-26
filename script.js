/* =================================
   جیمی Gymi | اسکریپت اصلی
   ================================= */

(function () {
    'use strict';

    /* ===== Preloader ===== */
    const preloader = document.getElementById('preloader');

    window.addEventListener('load', function () {
        setTimeout(function () {
            if (preloader) {
                preloader.classList.add('hidden');
            }
        }, 600);
    });

    // Fallback: hide preloader after 3s even if load doesn't fire
    setTimeout(function () {
        if (preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
        }
    }, 3000);

    /* ===== Scroll Progress Bar ===== */
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (scrollProgress) {
            scrollProgress.style.width = progress + '%';
        }
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    /* ===== Navbar Scroll Effect ===== */
    const navbar = document.getElementById('navbar');

    function handleNavbarScroll() {
        if (window.pageYOffset > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    /* ===== Mobile Menu ===== */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.classList.remove('no-scroll');
    }

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMenu);

        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('click', function (e) {
            if (
                navMenu.classList.contains('open') &&
                !navMenu.contains(e.target) &&
                !hamburger.contains(e.target)
            ) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    /* ===== Smooth Scroll for Anchor Links ===== */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });


    /* ===== Scroll Reveal Animation ===== */
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        const delay = parseInt(entry.target.dataset.delay || 0, 10);
                        setTimeout(function () {
                            entry.target.classList.add('active');
                        }, delay);
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        revealElements.forEach(function (el) {
            el.classList.add('active');
        });
    }

    /* ===== Animated Counter (Persian digits) ===== */
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

    function toPersian(number) {
        return String(number).replace(/\d/g, function (d) {
            return persianDigits[d];
        });
    }

    function animateCounter(el) {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo for a premium feel
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.round(target * eased);
            el.textContent = toPersian(current) + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = toPersian(target) + suffix;
            }
        }

        requestAnimationFrame(update);
    }

    const statNumbers = document.querySelectorAll('.stat-number');

    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        statNumbers.forEach(function (el) {
            counterObserver.observe(el);
        });
    } else {
        statNumbers.forEach(function (el) {
            el.textContent = toPersian(el.dataset.count) + (el.dataset.suffix || '');
        });
    }

    /* ===== Brands Marquee (duplicate for seamless loop) ===== */
    const marqueeTrack = document.getElementById('marqueeTrack');
    if (marqueeTrack) {
        marqueeTrack.innerHTML += marqueeTrack.innerHTML;
    }

    /* ===== Active Nav Link on Scroll ===== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavLink() {
        const scrollY = window.pageYOffset + 120;

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }


    /* ===== Showcase Tabs ===== */
    const tabs = document.querySelectorAll('.tab');
    const stagePhone = document.getElementById('stagePhone');
    const stageTitle = document.getElementById('stageTitle');
    const stageSub = document.getElementById('stageSub');

    const tabContent = [
        { title: 'داشبورد', sub: 'نمای کلی باشگاه' },
        { title: 'مدیریت اعضا', sub: 'لیست کامل اعضا' },
        { title: 'کیف پول و پرداخت', sub: 'تراکنش‌های مالی' },
        { title: 'کلاس‌ها', sub: 'زمان‌بندی هفتگی' }
    ];

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            const index = parseInt(tab.dataset.tab, 10);

            tabs.forEach(function (t) { t.classList.remove('active'); });
            tab.classList.add('active');

            // Animate phone switch
            if (stagePhone) {
                stagePhone.classList.add('switching');
                setTimeout(function () {
                    stageTitle.textContent = tabContent[index].title;
                    stageSub.textContent = tabContent[index].sub;
                    stagePhone.classList.remove('switching');
                }, 250);
            }
        });
    });

    /* ===== Parallax on Hero Phone (subtle) ===== */
    const heroVisual = document.querySelector('.hero-visual');

    if (heroVisual && window.innerWidth > 1024) {
        window.addEventListener('scroll', function () {
            const scrolled = window.pageYOffset;
            if (scrolled < 800) {
                heroVisual.style.transform = 'translateY(' + scrolled * 0.12 + 'px)';
            }
        }, { passive: true });
    }

    /* ===== 3D Tilt effect on cards ===== */
    const featureCards = document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card');

    featureCards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -3;
            const rotateY = (x - centerX) / centerX * 3;

            card.style.transform =
                'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
        });
    });

    console.log(
        '%c💪 جیمی',
        'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #6366f1, #06b6d4); -webkit-background-clip: text; color: transparent;'
    );
    console.log('%cاپلیکیشن مدیریت باشگاه‌های ورزشی', 'font-size: 12px; color: #a8b0d4;');

    /* ===== Trigger initial nav highlight ===== */
    highlightNavLink();

})();
