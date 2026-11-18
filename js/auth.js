/* Browser-local player account for the exam demo. */
(() => {
    'use strict';

    if (document.getElementById('contact-form')) {
        function redirectLegacyAccountLink() {
            const { hash, search } = window.location;
            if (hash === '#registration' || hash === '#login') {
                window.location.replace(`account.html${search}${hash}`);
            }
        }

        window.addEventListener('hashchange', redirectLegacyAccountLink);
        redirectLegacyAccountLink();
        return;
    }

    const accountPrefix = 'esportshub:account:v1:';
    const sessionKey = 'esportshub:session:v1';
    const encoder = new TextEncoder();
    const algorithm = 'PBKDF2-SHA256';
    const iterations = 600000;

    function encodeBytes(bytes) {
        return btoa(String.fromCharCode(...bytes));
    }

    async function deriveVerifier(password, salt) {
        // Use the same parameters for account creation and later password checks.
        const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
        const bits = await crypto.subtle.deriveBits({
            name: 'PBKDF2',
            salt,
            iterations,
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
        if (!account || typeof account !== 'object') return null;

        // Accounts saved by the earlier site put the profile and verifier at the same level.
        const legacy = !account.profile;
        const profile = legacy ? { name: account.name, email: account.email, phone: account.phone } : account.profile;
        const passwordCheck = legacy
            ? { algorithm, iterations, saltBase64: account.salt, hashBase64: account.verifier }
            : account.passwordCheck;

        if (profile.email !== email || typeof profile.name !== 'string' || !profile.name ||
            typeof profile.phone !== 'string' || !profile.phone) return null;
        if (passwordCheck?.algorithm !== algorithm || passwordCheck.iterations !== iterations ||
            !/^[A-Za-z0-9+/]{22}==$/.test(passwordCheck.saltBase64) ||
            !/^[A-Za-z0-9+/]{43}=$/.test(passwordCheck.hashBase64)) return null;
        return { profile, passwordCheck, legacy };
    }

    function saveAccount(profile, passwordCheck) {
        // One write keeps the readable profile and the password check consistent.
        localStorage.setItem(accountPrefix + profile.email, JSON.stringify({ profile, passwordCheck }, null, 2));
    }

    async function signUp({ name, email, phone, password }) {
        const key = accountPrefix + email;
        const duplicate = 'This email already has a local account. Log in or use another sample email.';
        if (localStorage.getItem(key) !== null) return duplicate;
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const hashBase64 = await deriveVerifier(password, salt);
        function createAccount() {
            if (localStorage.getItem(key) !== null) return duplicate;
            saveAccount({ name, email, phone }, { algorithm, iterations, saltBase64: encodeBytes(salt), hashBase64 });
            return '';
        }
        // Serialize simultaneous sign-ups for the same address across tabs on supported browsers.
        return navigator.locks ? navigator.locks.request(key, createAccount) : createAccount();
    }

    async function logIn({ email, password }) {
        const invalid = 'The email or password does not match a local account.';
        const account = findAccount(email);
        if (!account) return invalid;
        const { profile, passwordCheck } = account;
        const salt = Uint8Array.from(atob(passwordCheck.saltBase64), (character) => character.charCodeAt(0));
        if (await deriveVerifier(password, salt) !== passwordCheck.hashBase64) return invalid;
        if (account.legacy) saveAccount(profile, passwordCheck);
        localStorage.setItem(sessionKey, email);
        return '';
    }

    window.EsportsHubAuth = Object.freeze({ signUp, logIn });

    const accountView = document.querySelector('[data-account-view]');
    if (accountView) {
        const panels = accountView.querySelectorAll('[data-account-panel]');
        const links = accountView.querySelectorAll('[data-account-mode]');

        function showAccountForm(moveFocus = false) {
            const mode = window.location.hash.slice(1) || 'login';
            const activePanel = Array.from(panels).find((panel) => panel.dataset.accountPanel === mode);
            if (!activePanel) return;

            panels.forEach((panel) => { panel.hidden = panel !== activePanel; });
            links.forEach((link) => {
                if (link.dataset.accountMode === mode) link.setAttribute('aria-current', 'location');
                else link.removeAttribute('aria-current');
            });
            if (moveFocus) activePanel.querySelector('h2').focus({ preventScroll: true });
        }

        window.addEventListener('hashchange', () => showAccountForm(true));
        showAccountForm();
    }

    const profile = document.getElementById('profile-details');
    if (!profile) return;

    const status = document.getElementById('profile-status');
    const logout = document.getElementById('profile-logout');
    const loginUrl = 'account.html#login';

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
            document.getElementById(`profile-${field}`).textContent = account.profile[field];
        }
        document.getElementById('profile-avatar').textContent = Array.from(account.profile.name)[0].toUpperCase();
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
