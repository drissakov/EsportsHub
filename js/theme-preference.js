// Apply the stored theme before the styles load to avoid a light flash on navigation.
(() => {
    try {
        const night = localStorage.getItem('esportshub-theme') === 'night';
        document.documentElement.dataset.theme = night ? 'night' : 'day';
        document.documentElement.dataset.bsTheme = night ? 'dark' : 'light';
    } catch {
        // Use the default light palette when storage is unavailable.
    }
})();
