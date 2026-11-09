/* JavaScript owns the validation and feedback for community forms. */
(() => {
    'use strict';

    const formRules = {
        'contact-form': { fields: {
            name: { kind: 'text', required: true },
            email: { kind: 'email', required: true },
            phone: { kind: 'phone', required: true },
            topic: { kind: 'choice', required: true, values: ['question', 'organizer', 'partnership', 'feedback', 'problem'] },
            message: { kind: 'text', required: true },
        } },
        'registration-form': { accountAction: 'signUp', fields: {
            'registration-name': { kind: 'text', required: true, maxLength: 60 },
            'registration-email': { kind: 'email', required: true },
            'registration-phone': { kind: 'phone', required: true },
            'registration-password': { kind: 'password', required: true },
            'registration-confirm': { kind: 'confirmation', required: true, matches: 'registration-password' },
        } },
        'login-form': { accountAction: 'logIn', fields: {
            'login-email': { kind: 'email', required: true },
            'login-password': { kind: 'login-password', required: true },
        } },
    };

    function initializeValidation() {
        const emailValidator = window.EsportsHubEmail;
        const passwordValidator = window.EsportsHubPassword;
        const auth = window.EsportsHubAuth;
        const contactTopic = document.getElementById('topic');
        document.querySelectorAll('[data-contact-topic]').forEach((link) => {
            link.addEventListener('click', () => {
                contactTopic.value = link.dataset.contactTopic;
                contactTopic.dispatchEvent(new Event('change', { bubbles: true }));
            });
        });

        Object.entries(formRules).forEach(([id, config]) => {
            const form = document.getElementById(id);
            if (!form) return;
            const fields = Object.keys(config.fields).map((fieldId) => form.querySelector(`#${fieldId}`)).filter(Boolean);
            const submitButton = form.querySelector('[data-enable-validation]');
            const ready = submitButton && fields.length === Object.keys(config.fields).length && Boolean(emailValidator?.validate) &&
                (!config.accountAction || Boolean(auth?.[config.accountAction] && passwordValidator)) &&
                (config.accountAction !== 'signUp' || passwordValidator?.available);
            const touched = new Set();
            const edited = new Set();
            let submitted = false;
            let busy = false;
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
                if (rule.kind === 'login-password') {
                    if (!value.trim()) return 'Enter your password.';
                    const { minLength, maxLength } = passwordValidator;
                    const length = Array.from(value).length;
                    return length >= minLength && length <= maxLength
                        ? ''
                        : `Use the ${minLength}–${maxLength}-character password from your local account.`;
                }
                if (rule.kind === 'confirmation') {
                    if (!value) return 'Confirm your password.';
                    const password = form.querySelector(`#${rule.matches}`).value;
                    if (!password) return 'Enter your password before confirming it.';
                    return value === password ? '' : 'Passwords must match exactly.';
                }
                if (rule.kind === 'email') return emailValidator.validate(value, { required: rule.required }).error;
                if (rule.required && !value.trim()) return `${fieldLabel(field)} is required.`;
                if (rule.kind === 'phone' && !/^\+[1-9]\d{7,14}$/.test(value.trim())) {
                    return 'Enter + followed by 8–15 digits, including the country code.';
                }
                if (rule.maxLength && Array.from(value.trim()).length > rule.maxLength) {
                    return `Use at most ${rule.maxLength} characters for ${fieldLabel(field).toLowerCase()}.`;
                }
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

            async function submitAccount() {
                busy = true;
                submitButton.disabled = true;
                form.setAttribute('aria-busy', 'true');
                fields.forEach((field) => { field.readOnly = true; });
                try {
                    const fieldValues = Object.fromEntries(fields.map((field) => [
                        field.id.replace(/^(registration|login)-/, ''), field.value
                    ]));
                    const error = await auth[config.accountAction](fieldValues);
                    if (error) {
                        if (config.accountAction === 'logIn') {
                            const password = form.querySelector('#login-password');
                            password.value = '';
                            password.focus();
                        }
                        summary.textContent = error;
                        return;
                    }

                    fields.filter((field) => field.type === 'password').forEach((field) => { field.value = ''; });
                    submitted = false;
                    touched.clear();
                    edited.clear();
                    clearErrors();
                    if (config.accountAction === 'logIn') {
                        window.location.assign('profile.html');
                        return;
                    }

                    document.getElementById('login-email').value = fieldValues.email;
                    summary.classList.add('validation-success');
                    summary.textContent = 'Demo account created in this browser. Log in with your email and sample password.';
                    summary.focus();
                    document.dispatchEvent(new Event('esportshub:registration-success'));
                } catch {
                    summary.textContent = 'Local account access is unavailable. Open the HTTPS site and allow browser storage.';
                } finally {
                    fields.forEach((field) => { field.readOnly = false; });
                    form.removeAttribute('aria-busy');
                    submitButton.disabled = false;
                    busy = false;
                }
            }

            // HTML constraints are disabled; JavaScript owns every validation rule.
            form.noValidate = true;
            form.addEventListener('submit', (event) => {
                if (busy) {
                    event.preventDefault();
                    return;
                }
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
                    else if (kind === 'text' || kind === 'phone') field.value = field.value.trim();
                });
                const invalidFields = validateAll();
                showErrorSummary(invalidFields);
                if (invalidFields.length) {
                    event.preventDefault();
                    invalidFields[0].focus();
                    return;
                }

                if (config.accountAction) {
                    event.preventDefault();
                    submitAccount();
                } else {
                    // A valid contact submission retains its existing mailto action.
                    summary.classList.add('validation-success');
                    summary.textContent = 'The form is valid. Your configured email app can open a draft; delivery is not confirmed.';
                }
            });
            if (submitButton) submitButton.disabled = !ready;
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeValidation, { once: true });
    else initializeValidation();
})();
