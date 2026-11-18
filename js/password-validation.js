/* Registration checks the exact password the player typed. */
(() => {
    'use strict';

    const minLength = 8;
    const maxLength = 128;

    function validate(value) {
        let error = '';
        if (typeof value !== 'string' || !value.trim()) {
            error = 'Enter a password.';
        } else if (value.length > maxLength * 2 || Array.from(value).length > maxLength) {
            error = `Use at most ${maxLength} characters for your password.`;
        } else if (Array.from(value).length < minLength) {
            error = `Use at least ${minLength} characters for your password.`;
        } else if (/[\u0000-\u001f\u007f-\u009f\ud800-\udfff]/u.test(value)) {
            error = 'Use printable characters for your password.';
        } else if (!/\p{L}/u.test(value) || !/\p{Nd}/u.test(value)) {
            error = 'Include at least one letter and one number.';
        }
        return { valid: !error, error };
    }

    window.EsportsHubPassword = Object.freeze({ validate });
})();
