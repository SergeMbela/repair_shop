(function () {
    const STORAGE_KEY = 'color-theme';
    const DARK_CLASS = 'dark';

    /**
     * Updates all theme toggle icons on the page.
     * Uses classes to avoid ID duplication issues.
     */
    function updateIcons() {
        const isDark = document.documentElement.classList.contains(DARK_CLASS);

        // Find all dark icons (shown when theme is light, to switch to dark)
        document.querySelectorAll('.theme-toggle-dark-icon').forEach(icon => {
            if (isDark) icon.classList.add('hidden');
            else icon.classList.remove('hidden');
        });

        // Find all light icons (shown when theme is dark, to switch to light)
        document.querySelectorAll('.theme-toggle-light-icon').forEach(icon => {
            if (isDark) icon.classList.remove('hidden');
            else icon.classList.add('hidden');
        });
    }

    /**
     * Toggles the theme between light and dark.
     */
    function toggleTheme() {
        if (document.documentElement.classList.contains(DARK_CLASS)) {
            document.documentElement.classList.remove(DARK_CLASS);
            localStorage.setItem(STORAGE_KEY, 'light');
        } else {
            document.documentElement.classList.add(DARK_CLASS);
            localStorage.setItem(STORAGE_KEY, 'dark');
        }
        updateIcons();
    }

    /**
     * Initializes the theme on page load.
     */
    function initTheme() {
        // 1. Determine initial theme
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && preferDark)) {
            document.documentElement.classList.add(DARK_CLASS);
        } else {
            document.documentElement.classList.remove(DARK_CLASS);
        }

        // 2. Set up event listeners for all theme toggle buttons
        // We look for buttons with IDs used in existing code, but also add a class-based selector for future-proofing
        const toggleSelectors = ['#theme-toggle', '#mobile-theme-toggle', '.theme-toggle-btn'];

        toggleSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(btn => {
                // Remove any existing listeners if possible (though unlikely in this static setup)
                btn.onclick = null;
                btn.addEventListener('click', toggleTheme);
            });
        });

        // 3. Initial icon update
        updateIcons();
    }

    // Run initialization as soon as DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }

    // Also run immediately to avoid flash of unstyled content (FOUC)
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && preferDark)) {
        document.documentElement.classList.add(DARK_CLASS);
    } else {
        document.documentElement.classList.remove(DARK_CLASS);
    }

    // Expose toggleTheme globally just in case inline onclicks are still used
    window.toggleTheme = toggleTheme;
})();
