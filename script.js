const themeStorageKey = 'sb-theme';
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

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
