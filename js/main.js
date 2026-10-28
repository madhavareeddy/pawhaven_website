
document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const root = document.documentElement;
    const body = document.body;
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // --------------------------------------------------
    // LUCIDE ICONS
    // --------------------------------------------------

    function renderIcons() {
        if (
            window.lucide &&
            typeof window.lucide.createIcons === "function"
        ) {
            window.lucide.createIcons();
        }
    }

    renderIcons();

    // --------------------------------------------------
    // RTL / LTR DIRECTION
    // No inline CSS styles
    // --------------------------------------------------

    const directionButtons = document.querySelectorAll(
        "[data-direction-toggle]"
    );

    const brandNames = document.querySelectorAll(
        ".brand-name, .signup-brand-name"
    );

    function renderBrandName() {
        // Keep the English wordmark in the same reading order in both layouts.
        brandNames.forEach((brand) => {
            brand.setAttribute("dir", "ltr");
            brand.classList.add("brand-name-ltr");
        });
    }
    function applyDirection(direction) {
        const selectedDirection =
            direction === "rtl" ? "rtl" : "ltr";

        root.setAttribute("dir", selectedDirection);
        root.dataset.direction = selectedDirection;
        body.setAttribute("dir", selectedDirection);

        renderBrandName();

        directionButtons.forEach((button) => {
            const label = selectedDirection === "rtl"
                ? "Switch to left-to-right layout"
                : "Switch to right-to-left layout";

            button.setAttribute("aria-label", label);
            button.setAttribute("title", label);
            button.setAttribute(
                "aria-pressed",
                String(selectedDirection === "rtl")
            );
        });

        renderIcons();
    }

    let savedDirection = "ltr";

    try {
        savedDirection =
            localStorage.getItem("paw-haven-direction") || "ltr";
    } catch (error) {
        // Use LTR when browser storage is unavailable.
    }

    applyDirection(savedDirection);

    directionButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();

            const currentDirection =
                root.getAttribute("dir") || "ltr";

            const nextDirection =
                currentDirection === "rtl" ? "ltr" : "rtl";

            applyDirection(nextDirection);

            try {
                localStorage.setItem(
                    "paw-haven-direction",
                    nextDirection
                );
            } catch (error) {
                // Direction remains active for the current page.
            }
        });
    });

    // --------------------------------------------------
    // DARK / LIGHT THEME
    // --------------------------------------------------

    const themeButtons = document.querySelectorAll(
        "[data-theme-toggle]"
    );

    function applyTheme(theme) {
        const selectedTheme =
            theme === "dark" ? "dark" : "light";

        root.dataset.theme = selectedTheme;

        document.querySelectorAll("[data-theme-icon]").forEach(
            (container) => {
                const icon = document.createElement("i");

                icon.setAttribute(
                    "data-lucide",
                    selectedTheme === "dark" ? "sun" : "moon"
                );

                icon.setAttribute("aria-hidden", "true");
                container.replaceChildren(icon);
            }
        );

        themeButtons.forEach((button) => {
            const label = selectedTheme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode";

            button.setAttribute("aria-label", label);
            button.setAttribute("title", label);
            button.setAttribute(
                "aria-pressed",
                String(selectedTheme === "dark")
            );
        });

        renderIcons();
    }

    let savedTheme = "light";

    try {
        savedTheme =
            localStorage.getItem("paw-haven-theme") || "light";
    } catch (error) {
        // Use the light theme when storage is unavailable.
    }

    applyTheme(savedTheme);

    themeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const nextTheme =
                root.dataset.theme === "dark" ? "light" : "dark";

            applyTheme(nextTheme);

            try {
                localStorage.setItem("paw-haven-theme", nextTheme);
            } catch (error) {
                // Theme remains active for the current page.
            }
        });
    });

    // --------------------------------------------------
    // MOBILE NAVIGATION
    // --------------------------------------------------

  const menuToggle = document.querySelector("[data-menu-toggle]");
const mainNav = document.querySelector(".main-nav");

/* Add Login inside the mobile navigation */
if (mainNav && !mainNav.querySelector(".mobile-login-link")) {
    const headerLogin = document.querySelector(
        '.site-header .header-actions a.btn[href="login.html"]'
    );

    if (headerLogin) {
        const mobileLogin = headerLogin.cloneNode(true);

        mobileLogin.classList.add("mobile-login-link");
        mobileLogin.textContent = "Login";
        mobileLogin.setAttribute("aria-label", "Login");

        mainNav.appendChild(mobileLogin);
    }
}
    function closeMobileMenu() {
        if (!menuToggle || !mainNav) return;

        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");

        const icon = document.createElement("i");
        icon.setAttribute("data-lucide", "menu");
        icon.setAttribute("aria-hidden", "true");
        menuToggle.replaceChildren(icon);

        renderIcons();
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", (event) => {
            event.stopPropagation();

            const isOpen = mainNav.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));

            const icon = document.createElement("i");
            icon.setAttribute(
                "data-lucide",
                isOpen ? "x" : "menu"
            );
            icon.setAttribute("aria-hidden", "true");

            menuToggle.replaceChildren(icon);
            renderIcons();
        });

        mainNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                if (window.innerWidth <= 1024) {
                    closeMobileMenu();
                }
            });
        });

        document.addEventListener("click", (event) => {
            if (
                mainNav.classList.contains("open") &&
                !mainNav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMobileMenu();
            }
        });

        document.addEventListener("keydown", (event) => {
            if (
                event.key === "Escape" &&
                mainNav.classList.contains("open")
            ) {
                closeMobileMenu();
                menuToggle.focus();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 1024) {
                closeMobileMenu();
            }
        });
    }

    // --------------------------------------------------
    // HOME DROPDOWN
    // --------------------------------------------------

    document.querySelectorAll(".nav-dropdown-toggle").forEach(
        (button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();

                const dropdown = button.closest(".nav-dropdown");
                if (!dropdown) return;

                const isOpen = dropdown.classList.toggle("open");

                button.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );
            });
        }
    );

    document.addEventListener("click", (event) => {
        document.querySelectorAll(".nav-dropdown.open").forEach(
            (dropdown) => {
                if (!dropdown.contains(event.target)) {
                    dropdown.classList.remove("open");

                    dropdown.querySelector(".nav-dropdown-toggle")
                        ?.setAttribute("aria-expanded", "false");
                }
            }
        );
    });

    // --------------------------------------------------
    // PASSWORD VISIBILITY
    // --------------------------------------------------

    document.querySelectorAll("[data-password-toggle]").forEach(
        (button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();

                const inputId = button.getAttribute(
                    "data-password-toggle"
                );

                const input = document.getElementById(inputId);
                if (!input) return;

                const showPassword = input.type === "password";
                input.type = showPassword ? "text" : "password";

                const icon = document.createElement("i");

                icon.setAttribute(
                    "data-lucide",
                    showPassword ? "eye-off" : "eye"
                );

                icon.setAttribute("aria-hidden", "true");
                button.replaceChildren(icon);

                button.setAttribute(
                    "aria-label",
                    showPassword ? "Hide password" : "Show password"
                );

                button.setAttribute(
                    "title",
                    showPassword ? "Hide password" : "Show password"
                );

                renderIcons();
            });
        }
    );

    // --------------------------------------------------
    // DASHBOARD NOTIFICATIONS
    // --------------------------------------------------

    const notifToggle = document.getElementById("notif-toggle");
    const notifDropdown = document.getElementById("notif-dropdown");

    if (notifToggle && notifDropdown) {
        notifToggle.addEventListener("click", (event) => {
            event.stopPropagation();
            notifDropdown.classList.toggle("show");
        });

        document.addEventListener("click", (event) => {
            if (
                !notifDropdown.contains(event.target) &&
                !notifToggle.contains(event.target)
            ) {
                notifDropdown.classList.remove("show");
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                notifDropdown.classList.remove("show");
            }
        });
    }

    // --------------------------------------------------
    // DASHBOARD CAMERA SWITCHER
    // --------------------------------------------------

    document.querySelectorAll(".cam-btn").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".cam-btn").forEach((item) => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            const label = document.getElementById("active-cam-label");

            if (label) {
                label.textContent = button.textContent.trim();
            }

            const image = document.getElementById("cam-stream-img");
            const source = button.getAttribute("data-cam-src");

            if (image && source) {
                image.src = source;
            }
        });
    });

    // --------------------------------------------------
    // DASHBOARD SIDEBAR
    // --------------------------------------------------

    const sidebar = document.querySelector("[data-sidebar]");
    const sidebarToggle = document.querySelector("[data-sidebar-toggle]");
    const sidebarBackdrop = document.querySelector(
        "[data-sidebar-backdrop]"
    );

    function closeSidebar() {
        sidebar?.classList.remove("open");
        sidebarBackdrop?.classList.remove("show");
        sidebarToggle?.setAttribute("aria-expanded", "false");
    }

    if (sidebar && sidebarToggle) {
        sidebarToggle.addEventListener("click", () => {
            const isOpen = sidebar.classList.toggle("open");

            sidebarBackdrop?.classList.toggle("show", isOpen);
            sidebarToggle.setAttribute("aria-expanded", String(isOpen));
        });

        sidebarBackdrop?.addEventListener("click", closeSidebar);

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeSidebar();
            }
        });
    }

    // --------------------------------------------------
    // AOS SMOOTH ANIMATIONS
    // --------------------------------------------------

    function showElementsWithoutAOS() {
        document.querySelectorAll("[data-aos]").forEach((element) => {
            element.removeAttribute("data-aos");
            element.removeAttribute("data-aos-duration");
            element.removeAttribute("data-aos-delay");
            element.removeAttribute("data-aos-once");
            element.removeAttribute("data-aos-easing");
            element.style.opacity = "1";
            element.style.transform = "none";
        });
    }

    function prepareSiteWideMotion() {
        const main = document.querySelector("main");
        if (!main) return;

        const prepareHeroEntrance = (hero) => {
            hero.setAttribute("data-ph-hero", "");
            hero.classList.add("ph-hero-motion");
            // The reference uses a sequenced entrance inside each hero, rather
            // than moving the whole hero as one block.
            ["data-aos", "data-aos-duration", "data-aos-delay", "data-aos-easing"].forEach((attribute) => {
                hero.removeAttribute(attribute);
            });

            const copy = hero.querySelector(
                ".hero-copy, .home2-hero-content, .services-hero-copy, .facilities-hero-copy, .contact-hero-copy, .about-hero-copy, .page-hero-copy, [class*='hero-copy'], [class*='hero-content']"
            ) || (hero.classList.contains("page-hero") ? hero.querySelector(".container") : null);
            const visual = hero.querySelector(
                ".hero-visual, .home2-hero-video, .services-hero-media, .facilities-hero-media, .contact-hero-media, .about-hero-visual, [class*='hero-media'], [class*='hero-visual']"
            ) || hero.querySelector(":scope > .hero-image, :scope > img.hero-image");
            const clearAos = (element) => {
                if (!element) return;
                ["data-aos", "data-aos-duration", "data-aos-delay", "data-aos-easing"].forEach((attribute) => {
                    element.removeAttribute(attribute);
                });
            };

            if (copy) {
                const steps = [
                    copy.querySelector(".eyebrow, .section-kicker, [class*='eyebrow']"),
                    copy.querySelector("h1"),
                    copy.querySelector("p"),
                    copy.querySelector(".hero-actions, .services-hero-actions, .facilities-hero-actions, .contact-hero-badges, [class*='hero-actions'], [class*='hero-badges']"),
                    copy.querySelector(".hero-trust, .hero-caption, .hero-bottom, [class*='hero-trust'], [class*='hero-caption']")
                ].filter(Boolean);

                [...new Set(steps)].forEach((element, index) => {
                    clearAos(element);
                    element.setAttribute("data-ph-hero-step", String(index));
                    element.style.setProperty("--ph-hero-delay", `${index * 130}ms`);
                });
            }

            if (visual) {
                clearAos(visual);
                visual.setAttribute("data-ph-hero-visual", "");
                const image = visual.querySelector("img, video");
                if (image && image.tagName === "IMG") {
                    clearAos(image);
                    image.setAttribute("data-ph-hero-image", "");
                }
                const note = visual.querySelector(".hero-floating, .contact-floating-pill, [class*='floating-note'], [class*='image-caption']");
                if (note) {
                    clearAos(note);
                    note.setAttribute("data-ph-hero-note", "");
                }
            }
        };

        const isCard = (element) => element.tagName === "ARTICLE" || Array.from(element.classList || []).some((name) =>
            name === "card" || name.endsWith("-card") || name.endsWith("card") ||
            name === "panel" || name.endsWith("-panel") || name.endsWith("-tile") ||
            name === "gallery-item" || name.endsWith("-gallery-item")
        );
        const cards = Array.from(main.querySelectorAll("article, [class]"))
            .filter(isCard)
            .filter((element) => !element.parentElement?.closest("[data-ph-motion-card]"));

        cards.forEach((card) => {
            if (card.parentElement?.closest("[data-ph-motion-card]")) return;
            const siblings = Array.from(card.parentElement?.children || []).filter(isCard);
            const siblingIndex = Math.max(0, siblings.indexOf(card));
            card.setAttribute("data-ph-motion-card", "");

            if (!card.hasAttribute("data-aos")) {
                card.setAttribute("data-aos", "fade-up");
                card.setAttribute("data-aos-duration", "700");
                card.setAttribute("data-aos-easing", "cubic-bezier(0.22, 1, 0.36, 1)");
            }
            if (!card.hasAttribute("data-aos-delay") && siblingIndex > 0) {
                card.setAttribute("data-aos-delay", String(Math.min(siblingIndex * 90, 270)));
            }
        });

        main.querySelectorAll("img").forEach((image) => {
            if (image.closest(".brand, .brand-logo, .brand-mark, .avatar, .review-avatar, .profile-avatar, .dash-avatar, [aria-hidden='true']")) return;
            image.setAttribute("data-ph-motion-image", "");
            if (!image.hasAttribute("data-aos") && !image.closest("[data-aos], [data-ph-motion-card]")) {
                image.setAttribute("data-aos", "fade-in");
                image.setAttribute("data-aos-duration", "760");
                image.setAttribute("data-aos-easing", "cubic-bezier(0.22, 1, 0.36, 1)");
            }
        });

        main.querySelectorAll(":scope > section[class*='hero'], :scope > section.hero").forEach(prepareHeroEntrance);

        // Hero headings on compact dashboard subpages use the same entrance
        // rhythm while preserving their existing layout and content.
        main.querySelectorAll("section[class*='hero']").forEach((hero) => {
            if (!hero.hasAttribute("data-ph-hero")) prepareHeroEntrance(hero);
        });

        const heroObserver = "IntersectionObserver" in window
            ? new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("ph-hero-ready");
                    observer.unobserve(entry.target);
                });
            }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" })
            : null;

        main.querySelectorAll("[data-ph-hero]").forEach((hero) => {
            if (heroObserver) heroObserver.observe(hero);
            else hero.classList.add("ph-hero-ready");
        });
    }

    if (!reducedMotion) {
        prepareSiteWideMotion();
    }
    if (reducedMotion) {
        // Respect accessibility settings and keep all content visible.
        showElementsWithoutAOS();
    } else if (window.AOS && typeof window.AOS.init === "function") {
        window.AOS.init({
            duration: 760,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            once: true,
            offset: 45,
            delay: 0,
            mirror: false,
            anchorPlacement: "top-bottom",
            disable: false,
            startEvent: "DOMContentLoaded"
        });

        window.addEventListener("load", () => {
            if (window.AOS && typeof window.AOS.refreshHard === "function") {
                window.AOS.refreshHard();
            }
        }, { once: true });

        requestAnimationFrame(() => {
            if (window.AOS && typeof window.AOS.refresh === "function") {
                window.AOS.refresh();
            }
        });
    } else if ("IntersectionObserver" in window) {
        // Keep scroll reveals working even if the animation CDN is unavailable.
        const fallbackElements = Array.from(document.querySelectorAll("[data-aos]"));
        const fallbackObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                requestAnimationFrame(() => {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "none";
                });
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

        fallbackElements.forEach((element) => {
            const motion = element.getAttribute("data-aos") || "fade-up";
            const duration = Number(element.getAttribute("data-aos-duration")) || 760;
            const delay = Number(element.getAttribute("data-aos-delay")) || 0;
            const initialTransform = motion.includes("zoom")
                ? "scale(.96)"
                : motion.includes("down")
                    ? "translate3d(0, -22px, 0)"
                    : motion.includes("left")
                        ? "translate3d(22px, 0, 0)"
                        : motion.includes("right")
                            ? "translate3d(-22px, 0, 0)"
                            : motion.includes("up")
                                ? "translate3d(0, 22px, 0)"
                                : "none";
            element.style.opacity = "0";
            element.style.transform = initialTransform;
            element.style.transition = `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`;
            fallbackObserver.observe(element);
        });
    } else {
        // If neither animation system is available, never leave content hidden.
        showElementsWithoutAOS();
    }

    // --------------------------------------------------
    // HOME 2 VIDEO
    // --------------------------------------------------

    const heroVideo = document.querySelector(".home2-hero-video");

    if (heroVideo) {
        heroVideo.muted = true;
        heroVideo.playsInline = true;

        function playVideo() {
            const playback = heroVideo.play();

            if (playback && typeof playback.catch === "function") {
                playback.catch(() => {
                    // Keep the poster visible if autoplay is blocked.
                });
            }
        }

        heroVideo.addEventListener("canplay", playVideo, {
            once: true
        });

        if (heroVideo.readyState >= 2) {
            playVideo();
        }
    }

    // --------------------------------------------------
    // ABOUT PAGE COUNT-UP METRICS
    // --------------------------------------------------

    const statNumbers = document.querySelectorAll(
        ".about-stats-section .stat-quad-num"
    );

    if (
        statNumbers.length &&
        "IntersectionObserver" in window
    ) {
        const observer = new IntersectionObserver(
            (entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const element = entry.target;
                    const original = element.textContent.trim();

                    const numeric = Number(
                        original.replace(/[^0-9.]/g, "")
                    );

                    const suffix = original.replace(/[0-9., ]/g, "");

                    if (!Number.isFinite(numeric) || numeric <= 0) {
                        currentObserver.unobserve(element);
                        return;
                    }

                    const start = performance.now();
                    const duration = 1200;
                    const decimals = original.includes(".") ? 1 : 0;

                    function tick(now) {
                        const progress = Math.min(
                            (now - start) / duration,
                            1
                        );

                        const eased = 1 - Math.pow(1 - progress, 3);
                        const value = numeric * eased;

                        element.textContent =
                            value.toLocaleString("en-US", {
                                maximumFractionDigits: decimals,
                                minimumFractionDigits: decimals
                            }) + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(tick);
                        } else {
                            element.textContent = original;
                        }
                    }

                    requestAnimationFrame(tick);
                    currentObserver.unobserve(element);
                });
            },
            { threshold: 0.35 }
        );

        statNumbers.forEach((element) => {
            observer.observe(element);
        });
    }

    // --------------------------------------------------
    // DEMO FORMS
    // --------------------------------------------------

    document.querySelectorAll("[data-demo-form]").forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!form.reportValidity()) return;

            const status = form.querySelector(".form-status");

            if (status) {
                status.textContent =
                    "Thank you! Your request has been recorded in this demo.";
            }

            form.reset();
        });
    });

    // --------------------------------------------------
    // HEADER SHADOW
    // --------------------------------------------------

    const header = document.querySelector(".site-header");

    function updateHeader() {
        header?.classList.toggle("scrolled", window.scrollY > 12);
    }

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    // --------------------------------------------------
    // COPYRIGHT YEAR
    // --------------------------------------------------

    document.querySelectorAll("[data-current-year]").forEach(
        (element) => {
            element.textContent = String(new Date().getFullYear());
        }
    );

    // --------------------------------------------------
    // BACK TO TOP
    // --------------------------------------------------

    document.querySelectorAll("[data-back-to-top]").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: reducedMotion ? "auto" : "smooth"
            });
        });
    });

    // --------------------------------------------------
    // PRINT
    // --------------------------------------------------

    document.querySelectorAll("[data-print]").forEach((button) => {
        button.addEventListener("click", () => {
            window.print();
        });
    });
});

/* Dashboard webcam switcher moved out of dashboard.html */
// Webcam switcher simulator
            document.addEventListener('DOMContentLoaded', () => {
                const img = document.getElementById('webcam-img');
                const buttons = document.querySelectorAll('.cam-btn');
                const feeds = {
                    meadow: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=1200&q=88',
                    suite: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=1200&q=88',
                    pool: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=88'
                };
                buttons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        buttons.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        const cam = btn.dataset.cam;
                        if (feeds[cam] && img) {
                            img.src = feeds[cam];
                        }
                    });
                });
            });

            
    // --------------------------------------------------


/* =========================================
   ADD COMPACT LOGIN LINK TO MOBILE MENU
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const mainNav = document.querySelector(".site-header .main-nav");

    const headerLogin = document.querySelector(
        '.site-header .header-actions a[href="login.html"]'
    );

    if (!mainNav || !headerLogin) return;

    /* Avoid adding Login more than once */
    if (mainNav.querySelector(".mobile-login-link")) return;

    const mobileLogin = document.createElement("a");

    mobileLogin.href = headerLogin.href;
    mobileLogin.className = "mobile-login-link";
    mobileLogin.textContent = "Login";
    mobileLogin.setAttribute("aria-label", "Login");

    mainNav.appendChild(mobileLogin);
});

