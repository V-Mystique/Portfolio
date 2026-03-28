// ============================================================
//  VICTRAL PORTFOLIO — Script
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ── Navbar scroll ──────────────────────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.pageYOffset > 60);
    }, { passive: true });

    // ── Mobile nav toggle ──────────────────────────────────
    const toggle = document.getElementById('navToggle');
    const menu   = document.querySelector('.nav-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('open');
        });
        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => menu.classList.remove('open'));
        });
    }

    // ── Scroll-to-top ──────────────────────────────────────
    const scrollBtn = document.getElementById('scrollTop');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            scrollBtn.classList.toggle('visible', window.pageYOffset > 500);
        }, { passive: true });
        scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ── Smooth anchor scroll ───────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ── Fade-up on scroll ──────────────────────────────────
    const fadeEls = document.querySelectorAll(
        '.disc-card, .feat-item, .tool-group, .chip, ' +
        '.process-step, .tool-item, .tool-item-3d, .spec-card, ' +
        '.art-piece, .game-project-card, .skill-detail-card, ' +
        '.timeline-item, .philosophy-item, .philosophy-card, ' +
        '.pipeline-step, .skill-category-box, .contact-card'
    );
    fadeEls.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = `opacity .65s cubic-bezier(.22,.61,.36,1) ${(i % 6) * 60}ms, transform .65s cubic-bezier(.22,.61,.36,1) ${(i % 6) * 60}ms`;
    });

    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    fadeEls.forEach(el => io.observe(el));

    // ── Art/Portfolio filter ───────────────────────────────
    const filterBtns = document.querySelectorAll('.art-filter-btn');
    const artPieces  = document.querySelectorAll('.art-piece');
    const gamePieces = document.querySelectorAll('.game-project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const items = artPieces.length ? artPieces : gamePieces;
            items.forEach(item => {
                const show = filter === 'all' || item.dataset.category === filter;
                if (show) {
                    item.style.display = 'block';
                    requestAnimationFrame(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    });
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(16px)';
                    setTimeout(() => { item.style.display = 'none'; }, 300);
                }
            });
        });
    });

    // ── Skill bar animation ────────────────────────────────
    const bars = document.querySelectorAll('.proficiency-bar, .skill-fill');
    const barIO = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const w = e.target.style.width;
                e.target.style.width = '0';
                setTimeout(() => { e.target.style.width = w; }, 100);
                barIO.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });
    bars.forEach(b => barIO.observe(b));

    // ── Lightbox fallback ──────────────────────────────────
    if (typeof GLightbox !== 'undefined') {
        GLightbox({ touchNavigation:true, loop:true, slideEffect:'fade', zoomable:true, draggable:true });
    } else {
        document.querySelectorAll('.glightbox').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const img = link.querySelector('img');
                if (!img) return;
                const overlay = document.createElement('div');
                overlay.style.cssText = 'position:fixed;inset:0;background:rgba(12,12,16,.97);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;backdrop-filter:blur(12px);';
                const imgEl = document.createElement('img');
                imgEl.src = img.src; imgEl.alt = img.alt;
                imgEl.style.cssText = 'max-width:90vw;max-height:88vh;object-fit:contain;box-shadow:0 30px 80px rgba(0,0,0,.8);';
                const closeBtn = document.createElement('button');
                closeBtn.textContent = '✕';
                closeBtn.style.cssText = 'position:absolute;top:2rem;right:2rem;background:none;border:1px solid rgba(200,169,110,.4);color:#c8a96e;font-size:1.2rem;width:44px;height:44px;cursor:pointer;';
                overlay.appendChild(imgEl);
                overlay.appendChild(closeBtn);
                document.body.appendChild(overlay);
                const close = () => overlay.remove();
                closeBtn.addEventListener('click', close);
                overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
                document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); }, { once: true });
            });
        });
    }

    // ── Counter animation ──────────────────────────────────
    const counters = document.querySelectorAll('.stat-num, .stat-number');
    const counterIO = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const el = e.target;
                const raw = el.textContent.replace(/\D/g, '');
                const suffix = el.textContent.replace(/\d/g, '');
                if (!raw) return;
                const end = parseInt(raw);
                let current = 0;
                const step = end / 50;
                const timer = setInterval(() => {
                    current = Math.min(current + Math.ceil(step), end);
                    el.textContent = current + suffix;
                    if (current >= end) clearInterval(timer);
                }, 30);
                counterIO.unobserve(el);
            }
        });
    }, { threshold: 0.6 });
    counters.forEach(c => counterIO.observe(c));

    // ── Add loaded class ───────────────────────────────────
    document.body.classList.add('loaded');

    console.log('%c VICTRAL ', 'background:#c8a96e;color:#0c0c10;font-weight:700;font-size:1rem;padding:4px 12px;');
    console.log('%cGame Artist & Designer · Victoria Hujka · victoriahujka@icloud.com', 'color:#c8a96e;');
});