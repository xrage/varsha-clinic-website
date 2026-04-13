/* Varsha Dental Clinic — vanilla JS */
(function () {
    'use strict';

    const $  = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

    /* ---- Year in footer ---- */
    const yr = $('#yr');
    if (yr) yr.textContent = new Date().getFullYear();

    /* ---- Clinic open/closed badge (IST, Thursday closed) ---- */
    const badge = $('#hoursBadge');
    const badgeTitle = $('#hoursBadgeTitle');
    const badgeSub = $('#hoursBadgeSub');
    if (badge && badgeTitle && badgeSub) {
        // Work in Asia/Kolkata regardless of viewer timezone
        const parts = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Kolkata',
            weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
        }).formatToParts(new Date());
        const get = k => parts.find(p => p.type === k)?.value;
        const day = get('weekday');           // e.g., "Thu"
        const hour = parseInt(get('hour'), 10);
        const min  = parseInt(get('minute'), 10);
        const now  = hour * 60 + min;
        const open  = 11 * 60;       // 11:00
        const close = 21 * 60;       // 21:00
        const isThursday = day === 'Thu';
        const isOpenNow = !isThursday && now >= open && now < close;
        const isClosingSoon = isOpenNow && (close - now) <= 60;

        if (isThursday) {
            badge.dataset.status = 'closed';
            badgeTitle.textContent = 'Closed today';
            badgeSub.textContent = 'Open Friday at 11:00 AM';
        } else if (isOpenNow && isClosingSoon) {
            badge.dataset.status = 'closing-soon';
            badgeTitle.textContent = 'Closing soon';
            badgeSub.textContent = 'Open until 9:00 PM';
        } else if (isOpenNow) {
            badge.dataset.status = 'open';
            badgeTitle.textContent = 'Open now';
            badgeSub.textContent = '11:00 AM to 9:00 PM';
        } else if (now < open) {
            badge.dataset.status = 'closed';
            badgeTitle.textContent = 'Opens at 11:00 AM';
            badgeSub.textContent = 'Currently closed';
        } else {
            badge.dataset.status = 'closed';
            badgeTitle.textContent = 'Closed for today';
            const tomorrow = day === 'Wed' ? 'Friday' : 'tomorrow';
            badgeSub.textContent = `Opens ${tomorrow} at 11:00 AM`;
        }
    }

    /* ---- Mobile nav toggle ---- */
    const nav = $('#primaryNav');
    const toggle = $('#navToggle');
    if (nav && toggle) {
        toggle.addEventListener('click', () => {
            const open = nav.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        });
        // Close on link click (mobile)
        $$('.nav__link, .nav__cta', nav).forEach(a => {
            a.addEventListener('click', () => {
                if (window.innerWidth <= 880) {
                    nav.classList.remove('is-open');
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.setAttribute('aria-label', 'Open menu');
                }
            });
        });
    }

    /* ---- Header shadow on scroll ---- */
    const header = $('.header');
    const totop  = $('.totop');
    const onScroll = () => {
        const y = window.scrollY;
        if (header) header.classList.toggle('is-scrolled', y > 8);
        if (totop)  totop.classList.toggle('is-visible', y > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---- Scroll spy for nav links ---- */
    const links = $$('.nav__link');
    const sections = links
        .map(l => {
            const id = l.getAttribute('href');
            return id && id.startsWith('#') ? document.getElementById(id.slice(1)) : null;
        })
        .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
        const setActive = (id) => {
            links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + id));
        };
        const io = new IntersectionObserver((entries) => {
            // Pick the entry most in view
            const visible = entries
                .filter(e => e.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (visible) setActive(visible.target.id);
        }, { rootMargin: '-40% 0px -55% 0px', threshold: [0, .25, .5, .75, 1] });
        sections.forEach(s => io.observe(s));
    }

    /* ---- Smooth-scroll fallback (CSS handles modern, this fixes focus) ---- */
    $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (id.length > 1) {
                const target = document.getElementById(id.slice(1));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    target.setAttribute('tabindex', '-1');
                    target.focus({ preventScroll: true });
                }
            }
        });
    });
})();
