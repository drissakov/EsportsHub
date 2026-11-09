/* Browser-local player account for the exam demo. */
(() => {
    'use strict';

    const accountPrefix = 'esportshub:account:v1:';
    const sessionKey = 'esportshub:session:v1';
    const encoder = new TextEncoder();

    function encodeBytes(bytes) {
        return btoa(String.fromCharCode(...bytes));
    }

    async function deriveVerifier(password, salt) {
        // Use the same parameters for account creation and later password checks.
        const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
        const bits = await crypto.subtle.deriveBits({
            name: 'PBKDF2',
            salt,
            iterations: 600000,
            hash: 'SHA-256'
        }, key, 256);
        return encodeBytes(new Uint8Array(bits));
    }

    function findAccount(email) {
        const stored = localStorage.getItem(accountPrefix + email);
        if (!stored) return null;
        let account;
        try {
            account = JSON.parse(stored);
        } catch {
            return null;
        }
        if (account?.email !== email || !['name', 'phone', 'salt', 'verifier']
            .every((key) => typeof account[key] === 'string' && account[key])) return null;
        return account;
    }

    async function signUp({ name, email, phone, password }) {
        const duplicate = 'This email already has a local account. Log in or use another sample email.';
        if (findAccount(email)) return duplicate;
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const verifier = await deriveVerifier(password, salt);
        // Check again after the asynchronous derivation in case another tab created the account.
        if (findAccount(email)) return duplicate;
        localStorage.setItem(accountPrefix + email, JSON.stringify({
            name, email, phone, salt: encodeBytes(salt), verifier
        }));
        return '';
    }

    async function logIn({ email, password }) {
        const invalid = 'The email or password does not match a local account.';
        const account = findAccount(email);
        if (!account) return invalid;
        const salt = Uint8Array.from(atob(account.salt), (character) => character.charCodeAt(0));
        if (await deriveVerifier(password, salt) !== account.verifier) return invalid;
        localStorage.setItem(sessionKey, email);
        return '';
    }

    window.EsportsHubAuth = Object.freeze({ signUp, logIn });

    const profile = document.getElementById('profile-details');
    if (!profile) return;

    const status = document.getElementById('profile-status');
    const logout = document.getElementById('profile-logout');
    const loginUrl = 'contact.html#login';

    function renderProfile() {
        let account;
        try {
            const email = localStorage.getItem(sessionKey);
            account = email && findAccount(email);
        } catch {
            profile.hidden = true;
            status.textContent = 'Your profile is unavailable. Allow browser storage and reload this page.';
            return;
        }

        if (!account) {
            profile.hidden = true;
            window.location.replace(loginUrl);
            return;
        }

        // Treat stored names and contact details as plain text.
        for (const field of ['name', 'email', 'phone']) {
            document.getElementById(`profile-${field}`).textContent = account[field];
        }
        document.getElementById('profile-avatar').textContent = Array.from(account.name)[0].toUpperCase();
        status.textContent = '';
        profile.hidden = false;
    }

    logout.addEventListener('click', () => {
        try {
            localStorage.removeItem(sessionKey);
            renderProfile();
        } catch {
            status.textContent = 'Could not log out. Allow browser storage and try again.';
        }
    });

    window.addEventListener('pageshow', (event) => {
        if (event.persisted) renderProfile();
    });
    window.addEventListener('storage', (event) => {
        if (event.key === null || event.key === sessionKey || event.key.startsWith(accountPrefix)) renderProfile();
    });
    renderProfile();
})();
