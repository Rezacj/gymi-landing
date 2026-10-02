/* =================================
   جیمی Gymi | اسکریپت اصلی
   ================================= */

(function () {
    'use strict';

    /* ===== Theme Switcher ===== */
    var THEME_KEY = 'gymi-theme';

    function setTheme(theme) {
        if (theme !== 'light' && theme !== 'dark') {
            theme = 'light';
        }
        document.documentElement.setAttribute('data-theme', theme);
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) {
            /* storage may be blocked (private mode, file://) — keep it in-memory only */
        }
        syncThemeToggles(theme);
    }

    function syncThemeToggles(theme) {
        document.querySelectorAll('.theme-toggle').forEach(function (btn) {
            btn.setAttribute('aria-label', theme === 'dark' ? 'فعال‌سازی تم روشن' : 'فعال‌سازی تم تیره');
            btn.setAttribute('title', theme === 'dark' ? 'فعال‌سازی تم روشن' : 'فعال‌سازی تم تیره');
        });
    }

    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var current = document.documentElement.getAttribute('data-theme') || 'light';
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    });

    /* The inline <head> script already applied the stored theme before render
       (no FOUC). Here we only sync the toggle button states on load. */
    var initialTheme = 'light';
    try {
        initialTheme = localStorage.getItem(THEME_KEY) || 'light';
    } catch (e) {}
    syncThemeToggles(initialTheme);

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
    const roleButtons = document.querySelectorAll('.role-btn');
    const tabsContainers = document.querySelectorAll('[data-role-tabs]');
    const stageImage = document.getElementById('stageImage');

    // داده‌های هر نقش
    const showcaseData = {
        coach: {
            tabs: [
                {
                    src: 'images/app/coach/dashboard.webp',
                    alt: 'صفحه داشبورد مربی در اپلیکیشن جیمی — نمای کلی باشگاه'
                },
                {
                    src: 'images/app/coach/reports.webp',
                    alt: 'صفحه گزارش مالی در اپلیکیشن جیمی — درآمد و تراکنش‌ها'
                },
                {
                    src: 'images/app/coach/members.webp',
                    alt: 'صفحه مدیریت اعضا در اپلیکیشن جیمی — لیست اعضای باشگاه'
                },
                {
                    src: 'images/app/coach/notifications.webp',
                    alt: 'صفحه اعلان‌های مربی در اپلیکیشن جیمی'
                },
                {
                    src: 'images/app/coach/payments.webp',
                    alt: 'صفحه مدیریت پرداخت‌ها در اپلیکیشن جیمی'
                }
            ]
        },
        member: {
            tabs: [
                {
                    src: 'images/app/member/dashboard.webp',
                    alt: 'صفحه داشبورد عضو باشگاه در اپلیکیشن جیمی'
                },
                {
                    src: 'images/app/member/payments.webp',
                    alt: 'صفحه پرداخت شهریه در اپلیکیشن جیمی'
                },
                {
                    src: 'images/app/member/notifications.webp',
                    alt: 'صفحه اعلان‌های عضو باشگاه در اپلیکیشن جیمی'
                }
            ]
        }
    };

    let currentRole = 'coach';

    // Preload عکس‌های نقش غیرفعال بعد از لود کامل صفحه
    function preloadShowcaseImages() {
        const otherRole = currentRole === 'coach' ? 'member' : 'coach';
        showcaseData[otherRole].tabs.forEach(function (img) {
            const preloadImg = new Image();
            preloadImg.src = img.src;
        });
    }

    if (window.requestIdleCallback) {
        window.requestIdleCallback(preloadShowcaseImages);
    } else {
        window.addEventListener('load', preloadShowcaseImages);
    }

    // تغییر عکس با انیمیشن
    function switchStageImage(src, alt) {
        if (!stageImage) return;

        stageImage.classList.add('switching');

        setTimeout(function () {
            stageImage.src = src;
            stageImage.alt = alt;

            if (stageImage.complete) {
                stageImage.classList.remove('switching');
            } else {
                stageImage.addEventListener('load', function onLoad() {
                    stageImage.classList.remove('switching');
                    stageImage.removeEventListener('load', onLoad);
                });
            }
        }, 250);
    }

    // مدیریت کلیک روی تب‌های هر نقش
    tabsContainers.forEach(function (container) {
        const tabs = container.querySelectorAll('.tab');

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                const index = parseInt(tab.dataset.tab, 10);
                const roleTabs = showcaseData[currentRole].tabs;
                if (!roleTabs[index]) return;

                // حذف active از همه‌ی تب‌های این کانتینر
                tabs.forEach(function (t) { t.classList.remove('active'); });
                tab.classList.add('active');

                switchStageImage(roleTabs[index].src, roleTabs[index].alt);
            });
        });
    });

    // مدیریت کلیک روی دکمه‌های نقش
    roleButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const newRole = btn.dataset.role;
            if (newRole === currentRole) return;

            // آپدیت وضعیت دکمه‌های نقش
            roleButtons.forEach(function (b) {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // نمایش کانتینر تب‌های مربوطه، مخفی کردن بقیه
            tabsContainers.forEach(function (container) {
                if (container.dataset.roleTabs === newRole) {
                    container.hidden = false;
                } else {
                    container.hidden = true;
                }
            });

            currentRole = newRole;

            // ریست تب فعال به اولی
            const activeContainer = document.querySelector('[data-role-tabs="' + newRole + '"]');
            const tabs = activeContainer.querySelectorAll('.tab');
            tabs.forEach(function (t, i) {
                t.classList.toggle('active', i === 0);
            });

            // عوض کردن عکس به اولین عکس نقش جدید
            const firstTab = showcaseData[newRole].tabs[0];
            switchStageImage(firstTab.src, firstTab.alt);
        });
    });

    
    

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
