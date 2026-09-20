const mainNav = document.getElementById('main-nav');

const heroNameEl = document.querySelector('[data-typed-text]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// The name types itself in, but only once the headline has settled so the
// motion never wins the first fixation. Reduced motion: render instantly.
if (heroNameEl && !prefersReducedMotion)
{
    const fullText = (heroNameEl.getAttribute('data-typed-text') || heroNameEl.textContent || '').trim();
    heroNameEl.setAttribute('aria-label', fullText);
    heroNameEl.textContent = '';
    heroNameEl.classList.add('typing-active');

    let index = 0;
    const typingSpeed = 90;
    const typeNextCharacter = () =>
    {
        if (index <= fullText.length)
        {
            heroNameEl.textContent = fullText.slice(0, index);
            index += 1;
            if (index <= fullText.length)
            {
                setTimeout(typeNextCharacter, typingSpeed);
            }
            else
            {
                heroNameEl.classList.remove('typing-active');
                heroNameEl.textContent = fullText;
            }
        }
    };

    setTimeout(typeNextCharacter, 900);
}

// Fade-in animation observer
const faders = document.querySelectorAll('.fade-in');
const appearOptions = { threshold: 0.2, rootMargin: '0px 0px -50px 0px' };
const appearOnScroll = new IntersectionObserver((entries, observer) =>
{
    entries.forEach(entry =>
    {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
    });
}, appearOptions);
faders.forEach(fader => appearOnScroll.observe(fader));

// A direct anchor-link load (e.g. arriving at #about) jumps the viewport
// straight to the target, so a section in between can go from "below the
// viewport" to "above it" without ever crossing the observer's threshold —
// leaving it stuck at opacity 0 forever. The browser can also apply that
// jump after this script runs, once images finish loading and shift the
// layout, so a one-time check isn't enough: re-check on load and on every
// scroll until nothing is left to reveal.
const revealPassedFaders = () =>
{
    faders.forEach(fader =>
    {
        if (fader.classList.contains('visible')) return;
        if (fader.getBoundingClientRect().top < window.innerHeight)
        {
            fader.classList.add('visible');
            appearOnScroll.unobserve(fader);
        }
    });
};
revealPassedFaders();
window.addEventListener('scroll', revealPassedFaders);

// Fonts and images can still reflow the layout after the jump lands,
// shifting a section past the check above before the browser paints it —
// poll for a moment after load to catch that settling.
window.addEventListener('load', () =>
{
    const deadline = Date.now() + 1500;
    const poll = () =>
    {
        revealPassedFaders();
        if (Date.now() < deadline) requestAnimationFrame(poll);
    };
    requestAnimationFrame(poll);
});

// Create progress bar element
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

// Update progress bar width based on scroll position
window.addEventListener('scroll', function ()
{
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    // The nav is position: sticky at the top of the page; once the page has
    // scrolled past it, let it go slightly translucent with a blur.
    if (mainNav)
    {
        mainNav.classList.toggle('scrolled', scrollTop > 8);
    }
    const scrolled = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    progressBar.style.transform = `scaleX(${scrolled})`;
});

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navLinks = document.getElementById('nav-links');
const navLinkAnchors = document.querySelectorAll('.nav-link[href^="#"]');

navLinkAnchors.forEach(link =>
{
    link.addEventListener('click', event =>
    {
        const targetId = link.getAttribute('href').slice(1);
        const targetSection = document.getElementById(targetId);
        if (!targetSection) return;

        event.preventDefault();

        const navHeight = mainNav ? mainNav.getBoundingClientRect().height : 0;
        const offset = navHeight + 16;
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;
        const scrollTarget = Math.max(targetPosition, 0);

        window.scrollTo({ top: scrollTarget, behavior: 'smooth' });

        if (navLinks && navLinks.classList.contains('show'))
        {
            setMenuOpen(false);
        }
    });
});

function setMenuOpen(open)
{
    if (!navLinks || !mobileMenuToggle) return;
    navLinks.classList.toggle('show', open);
    mobileMenuToggle.setAttribute('aria-expanded', String(open));
    // Swap the icon in place (rather than replacing the markup) so the
    // clicked element stays in the DOM for the outside-click check below.
    const icon = mobileMenuToggle.querySelector('i');
    if (icon)
    {
        icon.classList.toggle('fa-bars', !open);
        icon.classList.toggle('fa-times', open);
    }
}

if (mobileMenuToggle && navLinks)
{
    mobileMenuToggle.addEventListener('click', () =>
    {
        setMenuOpen(!navLinks.classList.contains('show'));
    });

    // Close the menu on Escape or when clicking outside the header
    document.addEventListener('keydown', event =>
    {
        if (event.key === 'Escape') setMenuOpen(false);
    });
    document.addEventListener('click', event =>
    {
        if (mainNav && !mainNav.contains(event.target)) setMenuOpen(false);
    });
}

// Add active class to current section in navigation
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () =>
{
    let current = '';
    sections.forEach(section =>
    {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200)
        {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link =>
    {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current)
        {
            link.classList.add('active');
        }
    });
});

