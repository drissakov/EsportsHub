/* Assignment 4: all validation rules and feedback are controlled by JavaScript. */
(() => {
    'use strict';

    const formRules = {
        'contact-form': { fields: {
            name: { kind: 'text', required: true },
            email: { kind: 'email', required: true },
            topic: { kind: 'choice', required: true, values: ['question', 'organizer', 'partnership', 'feedback', 'problem'] },
            message: { kind: 'text', required: true },
        } },
        'registration-form': { demo: true, fields: {
            'registration-name': { kind: 'text', required: true },
            'registration-email': { kind: 'email', required: true },
            'registration-password': { kind: 'password', required: true },
            'registration-confirm': { kind: 'confirmation', required: true, matches: 'registration-password' },
        } },
    };

    function initializeValidation() {
        const emailValidator = window.EsportsHubEmail;
        const passwordValidator = window.EsportsHubPassword;
        Object.entries(formRules).forEach(([id, config]) => {
            const form = document.getElementById(id);
            if (!form) return;
            const fields = Object.keys(config.fields).map((fieldId) => form.querySelector(`#${fieldId}`)).filter(Boolean);
            const ready = fields.length === Object.keys(config.fields).length && Boolean(emailValidator?.validate) &&
                (!config.demo || Boolean(passwordValidator?.available));
            const touched = new Set();
            const edited = new Set();
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
                const rule = config.fields[field.id];
                const value = field.value;
                if (rule.kind === 'password') return passwordValidator.validate(value, passwordContext()).error;
                if (rule.kind === 'confirmation') {
                    if (!value) return 'Confirm your password.';
                    const password = form.querySelector(`#${rule.matches}`).value;
                    if (!password) return 'Enter your password before confirming it.';
                    return value === password ? '' : 'Passwords must match exactly.';
                }
                if (rule.kind === 'email') return emailValidator.validate(value, { required: rule.required }).error;
                if (rule.required && !value.trim()) return `${fieldLabel(field)} is required.`;
                if (rule.kind === 'choice' && !rule.values.includes(value)) return 'Choose a topic from the list.';
                return '';
            }

            function passwordContext() {
                const name = (form.querySelector('#registration-name')?.value || '').slice(0, 128);
                const email = (form.querySelector('#registration-email')?.value || '').slice(0, 254);
                const mailbox = email.split('@')[0];
                return ['EsportsHub', name, email, mailbox, ...name.split(/\s+/), ...mailbox.split(/[._+\-]/)]
                    .filter((item) => item.length >= 3).slice(0, 20);
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

            function clearErrors() {
                fields.forEach((field) => {
                    field.removeAttribute('aria-invalid');
                    errors.get(field).textContent = '';
                    errors.get(field).hidden = true;
                });
            }

            function normalizeEmail(field) {
                const result = emailValidator.validate(field.value, { required: config.fields[field.id].required });
                if (result.valid) field.value = result.value;
            }

            function recheckDependencies(field) {
                const password = form.querySelector('#registration-password');
                const confirmation = form.querySelector('#registration-confirm');
                if (password && ['registration-name', 'registration-email'].includes(field.id) && password.value) {
                    touched.add(password);
                    validateField(password);
                }
                if (confirmation && field === password && (confirmation.value || touched.has(confirmation))) {
                    touched.add(confirmation);
                    validateField(confirmation);
                }
            }

            fields.forEach((field) => {
                function onEdit() {
                    if (!ready) return;
                    edited.add(field);
                    if (summary.classList.contains('validation-success')) clearSummary();
                    if (submitted) showErrorSummary(validateAll());
                    else {
                        if (touched.has(field)) validateField(field);
                        recheckDependencies(field);
                    }
                }
                field.addEventListener('input', onEdit);
                field.addEventListener('change', onEdit);
                field.addEventListener('blur', () => {
                    if (!ready) return;
                    const kind = config.fields[field.id].kind;
                    // Success clears both secrets; focusing an untouched cleared field must not undo it.
                    if (summary.classList.contains('validation-success') && ['password', 'confirmation'].includes(kind) && !field.value && !edited.has(field)) return;
                    if (kind === 'email') normalizeEmail(field);
                    touched.add(field);
                    const message = validateField(field);
                    if (message && summary.classList.contains('validation-success')) clearSummary();
                    recheckDependencies(field);
                    if (submitted) showErrorSummary(validateAll());
                });
            });

            form.addEventListener('reset', () => {
                submitted = false;
                touched.clear();
                edited.clear();
                clearSummary();
                clearErrors();
            });

            // HTML constraints are disabled; JavaScript owns every validation rule.
            form.noValidate = true;
            form.addEventListener('submit', (event) => {
                if (!ready) {
                    event.preventDefault();
                    clearSummary();
                    summary.textContent = 'The form is unavailable. Reload the page and try again.';
                    return;
                }
                submitted = true;
                fields.forEach((field) => {
                    touched.add(field);
                    const kind = config.fields[field.id].kind;
                    if (kind === 'email') normalizeEmail(field);
                    else if (kind === 'text') field.value = field.value.trim();
                });
                const invalidFields = validateAll();
                showErrorSummary(invalidFields);
                if (invalidFields.length) {
                    event.preventDefault();
                    invalidFields[0].focus();
                    return;
                }

                if (config.demo) {
                    event.preventDefault();
                    summary.classList.add('validation-success');
                    summary.textContent = 'Demo validated successfully. No account was created and no data was sent. Password fields have been cleared.';
                    fields.filter((field) => ['password', 'confirmation'].includes(config.fields[field.id].kind)).forEach((field) => { field.value = ''; });
                    submitted = false;
                    touched.clear();
                    edited.clear();
                    clearErrors();
                    document.dispatchEvent(new Event('esportshub:registration-success'));
                } else if (form.id === 'contact-form') {
                    // A valid contact submission retains its existing mailto action.
                    summary.classList.add('validation-success');
                    summary.textContent = 'The form is valid. Your configured email app can open a draft; delivery is not confirmed.';
                }
            });
            form.querySelectorAll('[data-enable-validation]').forEach((button) => { button.disabled = !ready; });
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeValidation, { once: true });
    else initializeValidation();
})();
