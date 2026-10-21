/* Assignment 4, Task 3: show/close a subscription popup and validate its email. */
(() => {
    'use strict';

    const dialog = document.querySelector('#subscription-dialog');
    const form = document.querySelector('#subscription-form');
    if (!dialog || !form) return;

    const email = form.querySelector('#subscription-email');
    const error = form.querySelector('#subscription-email-error');
    const result = form.querySelector('#subscription-result');
    let openingButton = null;

    function clearFeedback() {
        error.textContent = '';
        result.textContent = '';
        email.removeAttribute('aria-invalid');
    }

    document.querySelectorAll('[data-open-subscription]').forEach((button) => {
        button.addEventListener('click', () => {
            openingButton = button;
            clearFeedback();
            // showModal provides browser-managed focus containment and Escape.
            if (!dialog.open) dialog.showModal();
            email.focus();
        });
    });

    dialog.querySelector('[data-close-subscription]').addEventListener('click', () => dialog.close());

    // Keep Tab inside the form instead of allowing a stop in browser chrome.
    dialog.addEventListener('keydown', (event) => {
        if (event.key !== 'Tab') return;
        const controls = Array.from(dialog.querySelectorAll('button:not(:disabled), input:not(:disabled)'));
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    dialog.addEventListener('click', (event) => {
        // Backdrop clicks target the dialog; clicks on its padding stay inside.
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        const outside = event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom;
        if (outside) dialog.close();
    });

    dialog.addEventListener('close', () => {
        clearFeedback();
        form.reset();
        if (openingButton && openingButton.isConnected) openingButton.focus();
    });

    email.addEventListener('input', clearFeedback);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        clearFeedback();
        email.value = email.value.trim();
        if (!email.value) {
            error.textContent = 'Enter your email address.';
        } else if (!email.validity.valid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            error.textContent = 'Enter a valid email address, such as name@example.com.';
        }
        if (error.textContent) {
            email.setAttribute('aria-invalid', 'true');
            email.focus();
            return;
        }
        form.reset();
        result.textContent = 'Email validated! This demo has not sent or saved a subscription.';
    });
})();
