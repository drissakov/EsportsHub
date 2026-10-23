/* Password checks run locally; values are never sent to an external service. */
(() => {
    'use strict';
    const MIN_LENGTH = 15;
    const MAX_LENGTH = 128;
    const strength = window.EsportsHubStrength;
    // Published tutorial phrases must not become passwords, even if an estimator rates them highly.
    const knownExamples = new Set(['correcthorsebatterystaple', 'thisisaverystrongpassword',
        'thisisaverylongpassword', 'passwordpasswordpassword', 'letmeinletmeinletmein']);
    const knownExamplePhrases = ['correct horse battery staple', 'this is a very strong password',
        'this is a very long password', 'password password password', 'let me in let me in let me in'];

    function validate(value, userInputs = []) {
        const invalid = (error) => ({ valid: false, error });
        if (typeof value !== 'string' || !value) return invalid('Enter a password.');
        if (value.length > MAX_LENGTH * 2) return invalid(`Use at most ${MAX_LENGTH} characters for your password.`);
        if (/^\s+$/u.test(value)) return invalid('Enter a password.');
        const length = Array.from(value).length;
        if (length < MIN_LENGTH) return invalid(`Use at least ${MIN_LENGTH} characters for your password.`);
        if (length > MAX_LENGTH) return invalid(`Use at most ${MAX_LENGTH} characters for your password.`);
        if (/[\u0000-\u001f\u007f-\u009f]/u.test(value) || /[\ud800-\udfff]/u.test(value)) {
            return invalid('Use printable characters without control characters or broken Unicode.');
        }
        const comparison = value.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
        if (knownExamples.has(comparison)) return invalid('Do not reuse a published example password. Choose your own unrelated phrase.');
        if (!strength || typeof strength.estimate !== 'function') return invalid('The form is unavailable. Reload the page and try again.');
        // Treat published examples as known guesses, including suffixes and other predictable edits.
        const context = [...knownExamples, ...knownExamplePhrases, ...(Array.isArray(userInputs)
            ? userInputs.filter((item) => typeof item === 'string').slice(0, 20).map((item) => item.slice(0, 128))
            : [])];
        try {
            const result = strength.estimate(value, context);
            if (!Number.isInteger(result.score) || result.score < 0 || result.score > 4) {
                return invalid('The form is unavailable. Reload the page and try again.');
            }
            if (result.score < 4) {
                return invalid('Choose a less predictable password. Use a longer phrase with unrelated words; avoid common passwords, repeats, keyboard patterns, your name and email.');
            }
            // Never trim, lowercase, truncate or normalize the actual password or confirmation.
            return { valid: true, error: '', score: result.score };
        } catch {
            return invalid('The form is unavailable. Reload the page and try again.');
        }
    }

    window.EsportsHubPassword = Object.freeze({ validate,
        available: Boolean(strength && typeof strength.estimate === 'function'),
        minLength: MIN_LENGTH, maxLength: MAX_LENGTH });
})();
