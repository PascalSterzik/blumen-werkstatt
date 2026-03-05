/* ==========================================================================
   Blumen Werkstatt: Carina Thiesen
   Zeltingen-Rachtig | Premium JavaScript v2.0
   ========================================================================== */

/* 1. Mobile Navigation */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen);
    });
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('open') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
            nav.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

/* 2. Header: shadow on scroll + hide/show on scroll direction */
const header = document.getElementById('header');
const scrollProgress = document.querySelector('.scroll-progress');
let lastScroll = 0;
let ticking = false;

function onScroll() {
    const currentScroll = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (header) {
        header.classList.toggle('scrolled', currentScroll > 20);

        if (currentScroll > 100) {
            if (currentScroll > lastScroll + 5) {
                header.classList.add('nav-hidden');
                if (nav && nav.classList.contains('open')) {
                    nav.classList.remove('open');
                    if (hamburger) {
                        hamburger.classList.remove('active');
                        hamburger.setAttribute('aria-expanded', 'false');
                    }
                }
            } else if (currentScroll < lastScroll - 5) {
                header.classList.remove('nav-hidden');
            }
        } else {
            header.classList.remove('nav-hidden');
        }
    }

    if (scrollProgress && docHeight > 0) {
        const progress = (currentScroll / docHeight) * 100;
        scrollProgress.style.width = progress + '%';
    }

    lastScroll = currentScroll;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
    }
}, { passive: true });

/* 3. Scroll reveal with stagger support */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Stagger children
            if (entry.target.classList.contains('stagger-parent')) {
                const children = entry.target.children;
                Array.from(children).forEach((child, i) => {
                    child.style.transitionDelay = (i * 0.12) + 's';
                });
            }

            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in, .stagger-parent').forEach(el => {
    revealObserver.observe(el);
});

// Stats bar stagger
const statsBar = document.querySelector('.stats-bar');
if (statsBar) revealObserver.observe(statsBar);

/* 4. Smooth scroll for anchor links */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id === '#' || id === '#main') return;
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* 5. FAQ Accordion */
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const isOpen = item.classList.contains('open');
        const isExpanded = question.getAttribute('aria-expanded') === 'true';

        // Close all others
        document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('open');
            const q = i.querySelector('.faq-question');
            if (q) q.setAttribute('aria-expanded', 'false');
        });

        // Toggle current
        if (!isOpen) {
            item.classList.add('open');
            question.setAttribute('aria-expanded', 'true');
        }
    });
});

/* 6. Contact form (Formspree integration) */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        // If form has a real Formspree action, let it submit naturally
        const action = contactForm.getAttribute('action');
        if (action && action.includes('formspree.io') && !action.includes('placeholder')) {
            // Real Formspree: handle via fetch for better UX
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Wird gesendet...';
            btn.disabled = true;

            fetch(action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    btn.textContent = 'Nachricht gesendet \u2713';
                    btn.style.background = 'var(--sage-dark)';
                    contactForm.reset();
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.disabled = false;
                        btn.style.background = '';
                    }, 4000);
                } else {
                    throw new Error('Formspree error');
                }
            })
            .catch(() => {
                btn.textContent = 'Fehler beim Senden';
                btn.style.background = '#dc2626';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                }, 3000);
            });
        } else {
            // Placeholder: simulate for demo
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Wird gesendet...';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = 'Nachricht gesendet \u2713';
                btn.style.background = 'var(--sage-dark)';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                    contactForm.reset();
                }, 3000);
            }, 1200);
        }
    });
}

/* 7. Gallery Lightbox (upgraded with navigation) */
const galleryImages = document.querySelectorAll('.gallery-item img');
let lightboxImages = [];
let currentLightboxIndex = 0;

if (galleryImages.length > 0) {
    // Create lightbox elements
    const lightboxOverlay = document.createElement('div');
    lightboxOverlay.className = 'lightbox-overlay';
    lightboxOverlay.innerHTML = `
        <button class="lightbox-close" aria-label="Schließen">&times;</button>
        <button class="lightbox-nav lightbox-prev" aria-label="Vorheriges Bild">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <img src="" alt="">
        <button class="lightbox-nav lightbox-next" aria-label="Nächstes Bild">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <div class="lightbox-counter"></div>
    `;
    document.body.appendChild(lightboxOverlay);

    const lightboxImg = lightboxOverlay.querySelector('img');
    const lightboxClose = lightboxOverlay.querySelector('.lightbox-close');
    const lightboxPrev = lightboxOverlay.querySelector('.lightbox-prev');
    const lightboxNext = lightboxOverlay.querySelector('.lightbox-next');
    const lightboxCounter = lightboxOverlay.querySelector('.lightbox-counter');

    function updateLightbox(index) {
        // Only use visible images (for gallery filter support)
        const visibleItems = document.querySelectorAll('.gallery-item:not([style*="display: none"]) img');
        lightboxImages = Array.from(visibleItems);
        if (lightboxImages.length === 0) return;

        currentLightboxIndex = Math.max(0, Math.min(index, lightboxImages.length - 1));
        const img = lightboxImages[currentLightboxIndex];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${lightboxImages.length}`;

        // Hide nav if only 1 image
        const showNav = lightboxImages.length > 1;
        lightboxPrev.style.display = showNav ? '' : 'none';
        lightboxNext.style.display = showNav ? '' : 'none';
    }

    function openLightbox(img) {
        const visibleItems = document.querySelectorAll('.gallery-item:not([style*="display: none"]) img');
        lightboxImages = Array.from(visibleItems);
        const index = lightboxImages.indexOf(img);
        updateLightbox(index >= 0 ? index : 0);
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightboxOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Click on gallery images
    galleryImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => openLightbox(img));
    });

    // Navigation
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        const newIndex = currentLightboxIndex > 0 ? currentLightboxIndex - 1 : lightboxImages.length - 1;
        updateLightbox(newIndex);
    });
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        const newIndex = currentLightboxIndex < lightboxImages.length - 1 ? currentLightboxIndex + 1 : 0;
        updateLightbox(newIndex);
    });

    // Close
    lightboxClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });
    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightboxOverlay.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
            const newIndex = currentLightboxIndex > 0 ? currentLightboxIndex - 1 : lightboxImages.length - 1;
            updateLightbox(newIndex);
        }
        if (e.key === 'ArrowRight') {
            const newIndex = currentLightboxIndex < lightboxImages.length - 1 ? currentLightboxIndex + 1 : 0;
            updateLightbox(newIndex);
        }
    });
}

/* 8. Gallery Filter (for galerie.html) */
const filterBtns = document.querySelectorAll('.gallery-filter-btn');
if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            const items = document.querySelectorAll('.gallery-item[data-category]');

            items.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = '';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    requestAnimationFrame(() => {
                        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    });
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/* 9. Back to Top Button */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
