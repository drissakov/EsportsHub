/* Assignment 4: shared page preferences and a clock. Loaded with defer. */
(() => {
    'use strict';

    // Task 4: cycle a small, readable palette without changing content colors.
    const backgrounds = [
        { name: 'White', color: '#ffffff' },
        { name: 'Soft mint', color: '#edf7ef' },
        { name: 'Soft lavender', color: '#f3effa' },
        { name: 'Warm cream', color: '#fff7df' }
    ];
    let backgroundIndex = 0;
    document.querySelectorAll('[data-background-cycle]').forEach((button) => {
        button.addEventListener('click', () => {
            backgroundIndex = (backgroundIndex + 1) % backgrounds.length;
            const background = backgrounds[backgroundIndex];
            document.body.style.backgroundColor = background.color;
            document.documentElement.style.setProperty('--hub-page-color', background.color);
            document.querySelectorAll('[data-background-name]').forEach((status) => {
                status.textContent = background.name;
            });
        });
    });

    // Task 5: Date supplies the current instant; Intl makes it readable.
    const clocks = document.querySelectorAll('[data-current-time]');
    if (clocks.length) {
        const formatter = new Intl.DateTimeFormat('en-US', {
            month: 'long', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
        });
        document.querySelectorAll('[data-time-zone]').forEach((label) => {
            label.textContent = formatter.resolvedOptions().timeZone.replaceAll('_', ' ');
        });
        const updateClock = () => {
            const now = new Date();
            clocks.forEach((clock) => {
                clock.textContent = formatter.format(now);
                clock.dateTime = now.toISOString();
            });
        };
        updateClock();
        window.setInterval(updateClock, 1000);
        document.addEventListener('visibilitychange', updateClock);
    }
})();
