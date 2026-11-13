const menuBtn = document.getElementById('nav-btn');
const nav = document.getElementById('nav');
const navOverlay = document.getElementById('nav-overlay');
const desktopNav = window.matchMedia('(min-width: 900px)');
let overlayHideTimeout;

const syncNavLayout = () => {
    window.clearTimeout(overlayHideTimeout);

    if (desktopNav.matches) {
        nav.classList.remove('nav-visible');
        nav.setAttribute('aria-hidden', 'false');
        navOverlay.classList.remove('overlay-visible');
        navOverlay.hidden = true;
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Open navigation menu');
        document.body.classList.remove('nav-open');
        return;
    }

    nav.setAttribute('aria-hidden', 'true');
};

const closeNav = (restoreFocus = true) => {
    nav.classList.remove('nav-visible');
    nav.setAttribute('aria-hidden', 'true');
    navOverlay.classList.remove('overlay-visible');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open navigation menu');
    document.body.classList.remove('nav-open');
    window.clearTimeout(overlayHideTimeout);
    overlayHideTimeout = window.setTimeout(() => {
        navOverlay.hidden = true;
    }, 250);

    if (restoreFocus) {
        menuBtn.focus();
    }
};

const openNav = () => {
    window.clearTimeout(overlayHideTimeout);
    navOverlay.hidden = false;
    nav.classList.add('nav-visible');
    nav.setAttribute('aria-hidden', 'false');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Close navigation menu');
    document.body.classList.add('nav-open');
    window.requestAnimationFrame(() => navOverlay.classList.add('overlay-visible'));
    nav.querySelector('a').focus();
};

syncNavLayout();
desktopNav.addEventListener('change', syncNavLayout);

menuBtn.addEventListener('click', () => {
    if (menuBtn.getAttribute('aria-expanded') === 'true') {
        closeNav(false);
    } else {
        openNav();
    }
});

navOverlay.addEventListener('click', () => closeNav());
nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeNav(false));
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
        closeNav();
    }
});

const sectionsToReveal = [...document.querySelectorAll('main > section')];
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

if ('IntersectionObserver' in window && !motionPreference.matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -32px 0px'
    });

    sectionsToReveal.forEach((section) => {
        section.classList.add('scroll-reveal');
        revealObserver.observe(section);
        section.addEventListener('focusin', () => {
            section.classList.add('is-visible');
            revealObserver.unobserve(section);
        }, { once: true });
    });

    motionPreference.addEventListener('change', (event) => {
        if (event.matches) {
            revealObserver.disconnect();
            sectionsToReveal.forEach((section) => section.classList.add('is-visible'));
        }
    });
}

const leadForm = document.getElementById('lead-form');

leadForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(leadForm);
    const subject = encodeURIComponent('Free digital storefront request');
    const body = encodeURIComponent(
        `Name: ${formData.get('name')}\nEmail: ${formData.get('email')}`
    );

    window.location.href = `mailto:rheyyanjulestanawan@gmail.com?subject=${subject}&body=${body}`;
});
