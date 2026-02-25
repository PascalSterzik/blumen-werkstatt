/* ==========================================================================
   Blumen Werkstatt: Carina Thiesen
   Zeltingen-Rachtig | Premium JavaScript
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
                if (nav && nav.classList.contains('open')) {
                    nav.classList.remove('open');
                    if (hamburger) hamburger.classList.remove('active');
                }
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

document.querySelectorAll('.fade-in, .stagger-parent').forEach(el => revealObserver.observe(el));

// Stats bar: also observe for stagger
const statsBar = document.querySelector('.stats-bar');
if (statsBar) revealObserver.observe(statsBar);

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

// FAQ Accordion (if present on any page)
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});

// Contact form (if present)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
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
    });
}

// Gallery Lightbox
const lightboxOverlay = document.createElement('div');
lightboxOverlay.className = 'lightbox-overlay';
lightboxOverlay.innerHTML = '<button class="lightbox-close" aria-label="Schliessen">&times;</button><img src="" alt="">';
document.body.appendChild(lightboxOverlay);

const lightboxImg = lightboxOverlay.querySelector('img');
const lightboxClose = lightboxOverlay.querySelector('.lightbox-close');

document.querySelectorAll('.gallery-item img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function closeLightbox() {
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay || e.target === lightboxClose) closeLightbox();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) closeLightbox();
});

// Back to Top Button
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
