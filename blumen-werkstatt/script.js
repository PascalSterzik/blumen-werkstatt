/* ==========================================================================
   Blumen Werkstatt: Premium JavaScript
   ========================================================================== */

// Mobile Navigation
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('open');
        hamburger.classList.toggle('active');
    });
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            hamburger.classList.remove('active');
        });
    });
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('open') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
            nav.classList.remove('open');
            hamburger.classList.remove('active');
        }
    });
}

// Header: shadow on scroll + hide-on-scroll-down / show-on-scroll-up
const header = document.getElementById('header');
const scrollProgress = document.querySelector('.scroll-progress');
let lastScroll = 0;
let ticking = false;

function onScroll() {
    const currentScroll = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Header shadow
    if (header) {
        header.classList.toggle('scrolled', currentScroll > 20);

        // Hide/show nav on scroll direction
        if (currentScroll > 100) {
            if (currentScroll > lastScroll + 5) {
                header.classList.add('nav-hidden');
            } else if (currentScroll < lastScroll - 5) {
                header.classList.remove('nav-hidden');
            }
        } else {
            header.classList.remove('nav-hidden');
        }
    }

    // Scroll progress bar
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

// Scroll reveal with stagger support
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
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in, .stagger-parent, .vine-divider').forEach(el => revealObserver.observe(el));

// Petal fall animation on CTA banner scroll
const petalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const petalFall = entry.target.querySelector('.petal-fall');
            if (petalFall) petalFall.classList.add('petal-fall-visible');
            petalObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.cta-banner').forEach(el => petalObserver.observe(el));

// Gallery Lightbox
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item img, .lightbox-trigger');
    if (galleryItems.length === 0) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<button class="lightbox-close" aria-label="Schließen">&times;</button><img src="" alt="">';
    document.body.appendChild(overlay);

    const overlayImg = overlay.querySelector('img');
    const closeBtn = overlay.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            overlayImg.src = item.src || item.querySelector('img')?.src;
            overlayImg.alt = item.alt || '';
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target === closeBtn) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
}
initLightbox();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Contact form (client-side only, no backend)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Wird gesendet...';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = 'Nachricht gesendet ✓';
            btn.style.background = 'var(--sage-dark)';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
                contactForm.reset();
            }, 3000);
        }, 1200);
    });
}

// Back-to-top button
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
