/* Assignment 4, Task 1: client-side validation. No values are stored or logged. */
(() => {
    'use strict';

    function initializeValidation() {
        const emailValidator = window.EsportsHubEmail;
        if (!emailValidator) return;
        document.querySelectorAll('form[data-validate-form], form#contact-form').forEach((form) => {
            const fields = Array.from(form.querySelectorAll('input, select, textarea'))
                .filter((field) => !field.disabled && !['hidden', 'submit', 'button'].includes(field.type));
            const isDemo = form.hasAttribute('data-demo-form');
            let submitted = false;
            let summary = form.querySelector('[data-validation-summary]');

            if (!summary) {
                summary = document.createElement('p');
                summary.className = 'validation-summary';
                summary.setAttribute('data-validation-summary', '');
                form.prepend(summary);
            }
            summary.setAttribute('role', 'status');
            summary.setAttribute('aria-live', 'polite');
            summary.setAttribute('aria-atomic', 'true');

            const errors = new Map();
            fields.forEach((field, index) => {
                if (!field.id) field.id = `${form.id || 'validated-form'}-field-${index + 1}`;
                const error = document.createElement('p');
                error.id = `${field.id}-error`;
                error.className = 'field-error';
                error.hidden = true;
                const anchor = field.closest('.input-group') || field;
                anchor.insertAdjacentElement('afterend', error);
                const descriptions = new Set((field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
                descriptions.add(error.id);
                field.setAttribute('aria-describedby', Array.from(descriptions).join(' '));
                errors.set(field, error);
            });

            function fieldLabel(field) {
                return field.labels?.[0]?.textContent.trim() || field.name || 'This field';
            }

            function getError(field) {
                if (field.disabled) return '';
                const value = field.value;
                if (field.type === 'email') {
                    const result = emailValidator.validate(value, { required: field.required });
                    if (!result.valid) return result.error;
                }
                if (field.required && !value.trim()) return `${fieldLabel(field)} is required.`;
                if (!value) return '';
                if (field.maxLength >= 0 && value.length > field.maxLength) {
                    return `Use at most ${field.maxLength} characters for ${fieldLabel(field)}.`;
                }
                if (field.minLength > 0 && value.length < field.minLength) {
                    return field.type === 'password'
                        ? `Use at least ${field.minLength} characters for your password.`
                        : `Use at least ${field.minLength} characters for ${fieldLabel(field)}.`;
                }
                if (field.hasAttribute('data-match')) {
                    const original = form.querySelector(field.getAttribute('data-match'));
                    if (original && value !== original.value) return 'Passwords must match.';
                }
                if (!field.validity.valid) return field.validationMessage || 'Check this field.';
                return '';
            }

            function validateField(field) {
                const message = getError(field);
                const error = errors.get(field);
                error.textContent = message;
                error.hidden = !message;
                if (message) field.setAttribute('aria-invalid', 'true');
                else field.removeAttribute('aria-invalid');
                return message;
            }

            function validateAll() {
                return fields.filter((field) => validateField(field));
            }

            function showErrorSummary(invalidFields) {
                summary.classList.remove('validation-success');
                summary.textContent = invalidFields.length
                    ? `Please correct ${invalidFields.length} ${invalidFields.length === 1 ? 'field' : 'fields'}: ${invalidFields.map(fieldLabel).join(', ')}.`
                    : '';
            }

            function clearSummary() {
                summary.classList.remove('validation-success');
                summary.textContent = '';
            }

            function normalizeEmail(field) {
                const result = emailValidator.validate(field.value, { required: field.required });
                if (result.valid) field.value = result.value;
            }

            fields.forEach((field) => {
                field.addEventListener('input', () => {
                    if (summary.classList.contains('validation-success')) clearSummary();
                    // Recheck confirmation when the original password changes, too.
                    if (submitted) showErrorSummary(validateAll());
                    else if (field.hasAttribute('aria-invalid')) validateField(field);
                });
                field.addEventListener('change', () => {
                    if (summary.classList.contains('validation-success')) clearSummary();
                    if (submitted) showErrorSummary(validateAll());
                });
                field.addEventListener('blur', () => {
                    if (field.type === 'email') normalizeEmail(field);
                    validateField(field);
                    if (submitted) showErrorSummary(validateAll());
                });
            });

            form.addEventListener('reset', () => {
                submitted = false;
                clearSummary();
                fields.forEach((field) => {
                    field.removeAttribute('aria-invalid');
                    const error = errors.get(field);
                    error.textContent = '';
                    error.hidden = true;
                });
            });

            // Keep native HTML validation as the fallback until this enhancement has loaded.
            form.noValidate = true;
            form.addEventListener('submit', (event) => {
                submitted = true;
                fields.forEach((field) => {
                    if (field.disabled) return;
                    if (field.type === 'email') normalizeEmail(field);
                    else if (field.type !== 'password') field.value = field.value.trim();
                });
                const invalidFields = validateAll();
                showErrorSummary(invalidFields);
                if (invalidFields.length) {
                    event.preventDefault();
                    invalidFields[0].focus();
                    return;
                }

                if (isDemo) {
                    event.preventDefault();
                    summary.classList.add('validation-success');
                    summary.textContent = 'Demo validated successfully. No account was created and no data was sent. Password fields have been cleared.';
                    fields.filter((field) => field.type === 'password').forEach((field) => { field.value = ''; });
                    submitted = false;
                } else if (form.id === 'contact-form') {
                    // A valid contact submission retains its existing mailto action.
                    summary.classList.add('validation-success');
                    summary.textContent = 'The form is valid. Your configured email app can open a draft; delivery is not confirmed.';
                }
            });
            form.querySelectorAll('[data-enable-validation]').forEach((button) => { button.disabled = false; });
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeValidation, { once: true });
    else initializeValidation();
})();
