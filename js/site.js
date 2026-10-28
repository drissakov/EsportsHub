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
// Assignment 5: keyboard navigation.
(() => {
    const menu = document.querySelector('#mainNavigation');
    if (!menu) return;

    const links = Array.from(menu.querySelectorAll('.nav-link'));

    menu.addEventListener('keydown', (event) => {
        const currentIndex = links.indexOf(document.activeElement);
        if (currentIndex === -1) return;

        let nextIndex;

        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                nextIndex = (currentIndex + 1) % links.length;
                break;

            case 'ArrowLeft':
            case 'ArrowUp':
                nextIndex = (currentIndex - 1 + links.length) % links.length;
                break;

            default:
                return;
        }

        event.preventDefault();
        links[nextIndex].focus();
    });
})();
// Assignment 5: interactive site rating.
(() => {
    const ratingSection = document.querySelector('#site-rating');
    if (!ratingSection) return;

    const stars = ratingSection.querySelectorAll('.rating-star');
    const message = document.getElementById('rating-message');

    stars.forEach((button) => {
        button.addEventListener('click', () => {
            const rating = Number(button.dataset.rating);

            stars.forEach((star) => {
                const value = Number(star.dataset.rating);

                star.classList.toggle('is-selected', value <= rating);
                star.setAttribute('aria-pressed', String(value === rating));
            });

            message.textContent = `Thanks! Your rating: ${rating} out of 5.`;
        });
    });
})();