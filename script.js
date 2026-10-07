// =========================================================
// MODERN ANIMATED PORTFOLIO INTERACTIONS
// - IntersectionObserver Scroll Animations
// - Active Section Navigation ScrollSpy
// - Theme Toggle with Browser Media Query Detection
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------
    // 1. PAGE LOAD ANIMATION
    // -----------------------------------------------------
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 80);

    // -----------------------------------------------------
    // 2. SCROLL REVEAL (IntersectionObserver)
    // -----------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-card, .timeline-item, .skill-card, .project-card, .achievement-card, .contact-card');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Once revealed, unobserve to maintain performance
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    // -----------------------------------------------------
    // 3. NAVIGATION SCROLLSPY (ACTIVE SECTION HIGHLIGHTING)
    // -----------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function updateActiveNav() {
        const scrollY = window.pageYOffset;
        const headerEl = document.querySelector('.glass-header');
        const navHeight = (headerEl ? headerEl.offsetHeight : 70) + 20;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - navHeight;
            const sectionId = current.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav(); // Initial call

    // -----------------------------------------------------
    // 4. VERTICAL NAVBAR DRAWER (MOBILE / TABLET INTERACTION)
    // -----------------------------------------------------
    const menuToggleBtn = document.getElementById('menu-toggle');
    const navLinksList = document.getElementById('nav-links');
    const navOverlay = document.getElementById('nav-overlay');

    function setDrawerState(isOpen) {
        if (menuToggleBtn) {
            menuToggleBtn.classList.toggle('active', isOpen);
            menuToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }
        if (navLinksList) {
            navLinksList.classList.toggle('mobile-open', isOpen);
        }
        if (navOverlay) {
            navOverlay.classList.toggle('active', isOpen);
        }
        document.body.classList.toggle('nav-drawer-open', isOpen);
    }

    if (menuToggleBtn && navLinksList) {
        menuToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const willOpen = !navLinksList.classList.contains('mobile-open');
            setDrawerState(willOpen);
        });

        // Close on clicking backdrop overlay
        if (navOverlay) {
            navOverlay.addEventListener('click', () => {
                setDrawerState(false);
            });
        }

        // Close on ESC key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinksList.classList.contains('mobile-open')) {
                setDrawerState(false);
            }
        });

        // Auto-close drawer if window resized to desktop view
        window.addEventListener('resize', () => {
            if (window.innerWidth > 880 && navLinksList.classList.contains('mobile-open')) {
                setDrawerState(false);
            }
        }, { passive: true });
    }

    // -----------------------------------------------------
    // 5. SMOOTH SCROLLING FOR ALL ANCHOR LINKS
    // -----------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                // Close vertical navbar if it was open
                setDrawerState(false);

                const headerEl = document.querySelector('.glass-header');
                const navHeight = headerEl ? headerEl.offsetHeight : 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // -----------------------------------------------------
    // 6. NIGHT MODE TOGGLE (MEDIA QUERY & USER OVERRIDE)
    // -----------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const toggleIcon = themeToggleBtn.querySelector('.toggle-icon');
        const toggleText = themeToggleBtn.querySelector('.toggle-text');
        const browserDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const savedTheme = localStorage.getItem('portfolio-theme');

        function updateToggleUI(theme) {
            if (toggleIcon && toggleText) {
                if (theme === 'dark') {
                    toggleIcon.textContent = '☀️';
                    toggleText.textContent = 'Light Mode';
                } else {
                    toggleIcon.textContent = '🌙';
                    toggleText.textContent = 'Dark Mode';
                }
            }
        }

        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            updateToggleUI(savedTheme);
        } else {
            const isDark = browserDarkQuery.matches;
            updateToggleUI(isDark ? 'dark' : 'light');
        }

        browserDarkQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('portfolio-theme')) {
                updateToggleUI(e.matches ? 'dark' : 'light');
            }
        });

        themeToggleBtn.addEventListener('click', () => {
            const currentAttr = document.documentElement.getAttribute('data-theme');
            let currentTheme;
            if (currentAttr) {
                currentTheme = currentAttr;
            } else {
                currentTheme = browserDarkQuery.matches ? 'dark' : 'light';
            }

            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
            updateToggleUI(newTheme);
        });
    }
});
