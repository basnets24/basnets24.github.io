const themeStorageKey = 'sb-theme';
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const mainNav = document.getElementById('main-nav');

const themeStorage = (() =>
{
    try
    {
        const testKey = '__theme-check';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return localStorage;
    }
    catch (error)
    {
        return null;
    }
})();

const getStoredTheme = () => themeStorage ? themeStorage.getItem(themeStorageKey) : null;
const setStoredTheme = value =>
{
    if (!themeStorage) return;
    if (value) themeStorage.setItem(themeStorageKey, value);
    else themeStorage.removeItem(themeStorageKey);
};

const applyTheme = theme =>
{
    const desired = theme === 'light' ? 'light' : 'dark';
    document.body.dataset.theme = desired;
    if (themeToggle)
    {
        themeToggle.setAttribute('aria-label', desired === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
        themeToggle.innerHTML = desired === 'light'
            ? '<i class="fas fa-moon"></i>'
            : '<i class="fas fa-sun"></i>';
    }
};

const storedTheme = getStoredTheme();
if (storedTheme)
{
    applyTheme(storedTheme);
}
else
{
    applyTheme('dark');
}

if (themeToggle)
{
    themeToggle.addEventListener('click', () =>
    {
        const nextTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
        setStoredTheme(nextTheme);
        applyTheme(nextTheme);
    });
}

const handleSystemThemeChange = event =>
{
    if (!getStoredTheme())
    {
        applyTheme(event.matches ? 'dark' : 'light');
    }
};

if (typeof prefersDark.addEventListener === 'function')
{
    prefersDark.addEventListener('change', handleSystemThemeChange);
}
else if (typeof prefersDark.addListener === 'function')
{
    prefersDark.addListener(handleSystemThemeChange);
}

const heroNameEl = document.querySelector('[data-typed-text]');
if (heroNameEl)
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

    setTimeout(typeNextCharacter, 450);
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

// Create progress bar element
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

// Update progress bar width based on scroll position
window.addEventListener('scroll', function ()
{
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    // Add scrolled class to nav when page is scrolled
    if (mainNav)
    {
        if (scrollTop > 50)
        {
            mainNav.classList.add('scrolled');
        } else
        {
            mainNav.classList.remove('scrolled');
        }
    }
    const scrolled = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = scrolled + '%';
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
            navLinks.classList.remove('show');
            if (mobileMenuToggle)
            {
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
});

if (mobileMenuToggle && navLinks)
{
    mobileMenuToggle.addEventListener('click', () =>
    {
        navLinks.classList.toggle('show');
        mobileMenuToggle.innerHTML = navLinks.classList.contains('show')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    // Close menu when clicking a link
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
