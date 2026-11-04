/* Shared background preferences and clock. */
(() => {
    'use strict';

    const root = document.documentElement;

    const backgrounds = {
        day: [
            { name: 'White', color: '#ffffff' },
            { name: 'Soft mint', color: '#edf7ef' },
            { name: 'Soft lavender', color: '#f3effa' },
            { name: 'Warm cream', color: '#fff7df' }
        ],
        night: [
            { name: 'Midnight', color: '#141922' },
            { name: 'Dark forest', color: '#12251e' },
            { name: 'Dark plum', color: '#261a30' },
            { name: 'Dark coffee', color: '#2b211b' }
        ]
    };

    // Remember each theme's selected color during this page visit.
    const backgroundIndexes = {
        day: 0,
        night: 0
    };

    function getTheme() {
        return root.dataset.theme === 'night' ? 'night' : 'day';
    }

    function applyBackground() {
        const theme = getTheme();
        const background = backgrounds[theme][backgroundIndexes[theme]];

        document.body.style.backgroundColor = background.color;

        if (theme === 'night') {
            root.style.setProperty('--night-bg', background.color);
        } else {
            root.style.setProperty('--hub-page-color', background.color);
        }

        document.querySelectorAll('[data-background-name]').forEach((status) => {
            status.textContent = background.name;
        });
    }

    document.querySelectorAll('[data-background-cycle]').forEach((button) => {
        button.disabled = false;
        button.removeAttribute('title');

        button.addEventListener('click', () => {
            const theme = getTheme();

            backgroundIndexes[theme] =
                (backgroundIndexes[theme] + 1) % backgrounds[theme].length;

            applyBackground();
        });
    });

    // Refresh the background when the sun/moon button changes the theme.
    document.addEventListener('esportshub:theme-change', applyBackground);
    applyBackground();

    const clocks = document.querySelectorAll('[data-current-time]');

    if (clocks.length) {
        const formatter = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        document.querySelectorAll('[data-time-zone]').forEach((label) => {
            label.textContent = formatter.resolvedOptions()
                .timeZone.replaceAll('_', ' ');
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

// Assignment 5: one icon switches between day and night.
(() => {
    const root = document.documentElement;
    const header = document.querySelector('.navbar > .container');
    if (!header) return;

    const storageKey = 'esportshub-theme';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'theme-icon-button';

    const icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');

    toggle.append(icon);
    header.append(toggle);

    function applyTheme(theme) {
        const night = theme === 'night';

        root.dataset.theme = night ? 'night' : 'day';
        root.dataset.bsTheme = night ? 'dark' : 'light';

        // Show the action available to the user.
        icon.textContent = night ? '☀' : '☾';

        const label = night
            ? 'Switch to day mode'
            : 'Switch to night mode';

        toggle.setAttribute('aria-label', label);
        toggle.title = label;

        // Let the background component select the matching palette.
        document.dispatchEvent(new Event('esportshub:theme-change'));
    }

    let savedTheme = 'day';

    try {
        savedTheme = localStorage.getItem(storageKey) || 'day';
    } catch {
        // Switching still works when storage is unavailable.
    }

    applyTheme(savedTheme);

    toggle.addEventListener('click', () => {
        const theme = root.dataset.theme === 'night' ? 'day' : 'night';

        applyTheme(theme);

        try {
            localStorage.setItem(storageKey, theme);
        } catch {
            // Keep the selected theme for this page visit.
        }
    });
})();
// Show or hide additional community information.
(() => {
  const button = document.getElementById('community-read-more');
  const details = document.getElementById('community-details');

  if (!button || !details) return;

  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    const showDetails = !expanded;

    details.style.display = showDetails ? 'block' : 'none';
    button.textContent = showDetails ? 'Read Less' : 'Read More';
    button.setAttribute('aria-expanded', String(showDetails));
  });
})();
// Change the main gallery image when a thumbnail is selected.
(() => {
  const gallery = document.getElementById('esports-gallery');
  if (!gallery) return;

  const mainImage = gallery.querySelector('#gallery-main');
  const caption = gallery.querySelector('#gallery-caption');
  const buttons = gallery.querySelectorAll('.gallery-thumbnail');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const thumbnail = button.querySelector('img');

      mainImage.setAttribute('src', thumbnail.getAttribute('src'));
      mainImage.setAttribute('alt', thumbnail.alt);
      caption.textContent = thumbnail.alt;

      buttons.forEach((item) => {
        item.setAttribute('aria-pressed', String(item === button));
      });
    });
  });
})();
// Display a personal greeting when the form is submitted.
(() => {
  const form = document.getElementById('greeting-form');
  const input = document.getElementById('greeting-name');
  const message = document.getElementById('greeting-message');

  if (!form || !input || !message) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = input.value.trim();

    if (!name) {
      message.textContent = 'Please enter your name or nickname.';
      input.focus();
      return;
    }

    message.textContent = `Welcome, ${name}!`;
  });
})();
// Fetch and display a player tip without reloading the page.
(() => {
  const button = document.querySelector('#next-player-tip');
  const content = document.querySelector('#player-tip-text');

  if (!button || !content) return;

  let previousTip = '';

  button.addEventListener('click', async () => {
    button.disabled = true;
    button.textContent = 'Loading…';
    content.setAttribute('aria-busy', 'true');

    try {
      const response = await fetch('js/player-tips.json');

      if (!response.ok) {
        throw new Error('Could not load tips.');
      }

      const tips = await response.json();

      if (
        !Array.isArray(tips) ||
        tips.length === 0 ||
        !tips.every((tip) => typeof tip === 'string' && tip.trim())
      ) {
        throw new Error('Invalid tips data.');
      }

      const alternatives = tips.filter((tip) => tip !== previousTip);
      const choices = alternatives.length ? alternatives : tips;
      const index = Math.floor(Math.random() * choices.length);

      previousTip = choices[index];
      content.textContent = previousTip;
    } catch {
      content.textContent =
        'Could not load a tip. Please try again.';
    } finally {
      content.setAttribute('aria-busy', 'false');
      button.disabled = false;
      button.textContent = 'Next tip';
    }
  });
})();
// Clear the nickname form and restore the default greeting.
(() => {
  const form = document.querySelector('#greeting-form');
  const button = document.querySelector('#reset-greeting');
  const message = document.querySelector('#greeting-message');

  if (!form || !button || !message) return;

  button.addEventListener('click', () => {
    form.querySelectorAll('input').forEach((input) => {
      input.value = '';
    });

    message.textContent = 'Welcome, player!';
    form.querySelector('input').focus();
  });
})();
