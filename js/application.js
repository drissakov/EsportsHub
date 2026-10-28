// Assignment 5: multi-step player application.
(() => {
    const form = document.getElementById('application-form');
    if (!form) return;

    const steps = Array.from(form.querySelectorAll('.application-step'));
    const nameInput = document.getElementById('app-name');
    const emailInput = document.getElementById('app-email');
    const gameInput = document.getElementById('app-game');
    const backButton = document.getElementById('application-back');
    const nextButton = document.getElementById('application-next');
    const submitButton = document.getElementById('application-submit');
    const progress = document.getElementById('application-progress');
    const error = document.getElementById('application-error');
    const result = document.getElementById('application-result');

    // An object stores the current step and the application details.
    const application = {
        step: 0,
        details: {},

        readFields() {
            this.details = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                game: gameInput.selectedOptions[0].textContent
            };
        }
    };

    function showStep(index, moveFocus = true) {
        application.step = index;

        steps.forEach((step, position) => {
            step.hidden = position !== index;
        });

        progress.textContent = `Step ${index + 1} of ${steps.length}`;
        backButton.disabled = index === 0;
        nextButton.hidden = index === steps.length - 1;
        nextButton.disabled = false;
        submitButton.hidden = index !== steps.length - 1;
        submitButton.disabled = false;

        error.textContent = '';
        result.textContent = '';

        if (index === steps.length - 1) {
            for (const [key, value] of Object.entries(application.details)) {
                document.getElementById(`review-${key}`).textContent = value;
            }
        }

        if (moveFocus) steps[index].querySelector('h3').focus();
    }

    function showError(field, message) {
        error.textContent = message;
        field.setAttribute('aria-invalid', 'true');
        field.focus();
        return false;
    }

    function validateStep() {
        if (application.step === 0) {
            const name = nameInput.value.trim();

            if (!name || name.length > 60) {
                return showError(nameInput, 'Enter a player name of 1 to 60 characters.');
            }

            const checked = window.EsportsHubEmail.validate(emailInput.value);

            if (!checked.valid) {
                return showError(emailInput, checked.error);
            }

            nameInput.value = name;
            emailInput.value = checked.value;
        }

        if (application.step === 1 && !gameInput.value) {
            return showError(gameInput, 'Choose a game before continuing.');
        }

        return true;
    }

    function goNext() {
        if (!validateStep()) return;

        application.readFields();
        showStep(Math.min(application.step + 1, steps.length - 1));
    }

    // Named functions passed to event listeners are callbacks.
    nextButton.addEventListener('click', goNext);

    backButton.addEventListener('click', () => {
        showStep(Math.max(application.step - 1, 0));
    });

    [nameInput, emailInput, gameInput].forEach((field) => {
        field.setAttribute('aria-describedby', 'application-error');

        field.addEventListener('input', () => {
            field.removeAttribute('aria-invalid');
            error.textContent = '';
        });
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (application.step < steps.length - 1) {
            goNext();
            return;
        }

        result.textContent =
            `Thanks, ${application.details.name}! Your demo application for ` +
            `${application.details.game} is complete. No data was sent or saved.`;

        submitButton.disabled = true;
        result.tabIndex = -1;
        result.focus();
    });

    showStep(0, false);
})();