/* Task 2: native buttons provide mouse, Enter and Space interactions. */
(() => {
    'use strict';
    document.querySelectorAll('[data-accordion-trigger]').forEach((button) => {
        const panel = document.getElementById(button.getAttribute('aria-controls'));
        if (!panel) return;
        // Remove hidden only after the collapsed CSS and accessibility state exist.
        button.setAttribute('aria-expanded', 'false');
        panel.inert = true;
        panel.setAttribute('aria-hidden', 'true');
        panel.hidden = false;
        button.addEventListener('click', () => {
            const expanded = button.getAttribute('aria-expanded') !== 'true';
            button.setAttribute('aria-expanded', String(expanded));
            panel.classList.toggle('is-open', expanded);
            panel.inert = !expanded;
            panel.setAttribute('aria-hidden', String(!expanded));
        });
    });
})();
