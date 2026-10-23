/* Shared single-address validation for the contact, sign-up and subscription forms. */
(() => {
    'use strict';

    const example = 'Enter one complete email address, such as player@example.com.';
    const localCharacters = /^[a-zA-Z0-9.!#$%&'*+\-/=?^_`{|}~]+$/;
    const domainLabel = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

    function validate(rawValue, { required = true } = {}) {
        const invalid = (error) => ({ valid: false, value: '', error });
        if (typeof rawValue !== 'string') return invalid(example);
        // Reject controls before trimming; never silently remove characters inside an address.
        if (/[\u0000-\u001f\u007f-\u009f]/.test(rawValue)) {
            return invalid('Email must not contain control or hidden characters.');
        }
        let start = 0;
        let end = rawValue.length;
        while (start < end && rawValue.charCodeAt(start) === 32) start += 1;
        while (end > start && rawValue.charCodeAt(end - 1) === 32) end -= 1;
        const value = rawValue.slice(start, end);
        if (!value) return required ? invalid('Enter your email address.') : { valid: true, value: '', error: '' };
        if (value.length > 254) return invalid('Use an email address of at most 254 characters.');
        // This browser form supports ASCII mailbox names and ASCII/punycode domains.
        // Quoted names, address lists, display names and SMTPUTF8 addresses are not supported.
        if (/[^\x21-\x7e]/.test(value)) {
            return invalid('Use an email address with ASCII characters and no spaces or hidden characters.');
        }
        const at = value.indexOf('@');
        if (at < 1 || at !== value.lastIndexOf('@') || at === value.length - 1) return invalid(example);
        const local = value.slice(0, at);
        const domain = value.slice(at + 1).toLowerCase();
        if (local.length > 64) return invalid('The part before @ must be at most 64 characters.');
        if (!localCharacters.test(local)) return invalid(example);
        if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) {
            return invalid('The part before @ cannot start or end with a dot or contain consecutive dots.');
        }
        const labels = domain.split('.');
        if (domain.length > 253 || labels.length < 2 || labels.some((label) => label.length > 63 || !domainLabel.test(label))) {
            return invalid('Enter a complete domain, such as example.com; check its dots and hyphens.');
        }
        const suffix = labels[labels.length - 1];
        if (!/^[a-z]{2,63}$/.test(suffix) && !/^xn--[a-z0-9-]{2,59}$/.test(suffix)) {
            return invalid('Use a complete domain suffix, such as .com or .kz.');
        }
        if (labels.some((label) => label.startsWith('xn--'))) {
            try {
                // URL's IDNA parser rejects malformed punycode without a network request.
                if (new URL(`https://${domain}/`).hostname !== domain) return invalid(example);
            } catch {
                return invalid('Check the punycode spelling of the email domain.');
            }
        }
        // A mailbox name can be case-sensitive. Do not remove dots or +tags.
        return { valid: true, value: `${local}@${domain}`, error: '' };
    }

    window.EsportsHubEmail = Object.freeze({ validate });
})();
