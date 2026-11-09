// Dota 2 ratings from the public OpenDota teams endpoint.
(() => {
    'use strict';

    const section = document.getElementById('dota-ratings');
    if (!section) return;

    const status = document.getElementById('dota-ratings-status');
    const list = document.getElementById('dota-ratings-list');
    const retry = document.getElementById('dota-ratings-retry');
    const endpoint = 'https://api.opendota.com/api/teams';
    const ratingFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
    const recordFormat = new Intl.NumberFormat('en-US');

    function usableTeams(payload) {
        if (!Array.isArray(payload)) return [];

        return payload.filter((team) =>
            Number.isSafeInteger(team?.team_id) && team.team_id > 0 &&
            typeof team.name === 'string' && team.name.trim() &&
            Number.isFinite(team.rating) &&
            Number.isSafeInteger(team.wins) && team.wins >= 0 &&
            Number.isSafeInteger(team.losses) && team.losses >= 0
        ).sort((a, b) => b.rating - a.rating).slice(0, 5);
    }

    function createTeamRow(team, index) {
        const row = document.createElement('li');
        row.className = 'dota-team';

        const rank = document.createElement('span');
        rank.className = 'dota-team-rank';
        rank.textContent = '#' + (index + 1);
        rank.setAttribute('aria-hidden', 'true');

        const details = document.createElement('div');
        const name = document.createElement('a');
        name.className = 'dota-team-name';
        name.href = 'https://www.opendota.com/teams/' + team.team_id;
        name.textContent = team.name.trim();
        name.dir = 'auto';

        const record = document.createElement('span');
        record.className = 'dota-team-record';
        record.textContent = `${recordFormat.format(team.wins)} wins · ${recordFormat.format(team.losses)} losses`;
        details.append(name, record);

        const rating = document.createElement('div');
        rating.className = 'dota-team-rating';
        const ratingValue = document.createElement('strong');
        ratingValue.textContent = ratingFormat.format(team.rating);
        const ratingLabel = document.createElement('span');
        ratingLabel.textContent = 'Rating';
        rating.append(ratingValue, ratingLabel);

        row.append(rank, details, rating);
        return row;
    }

    async function loadRatings() {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 8000);

        retry.hidden = true;
        status.textContent = 'Loading team ratings…';
        list.setAttribute('aria-busy', 'true');

        try {
            const response = await fetch(endpoint, {
                signal: controller.signal,
                credentials: 'omit'
            });
            if (!response.ok) throw new Error('OpenDota returned HTTP ' + response.status);

            const teams = usableTeams(await response.json());
            if (!teams.length) throw new Error('OpenDota returned no usable teams');

            list.replaceChildren(...teams.map(createTeamRow));
            status.textContent = teams.length === 1
                ? 'Showing 1 team from OpenDota.'
                : `Showing ${teams.length} teams from OpenDota.`;
        } catch {
            status.textContent = 'Team ratings are temporarily unavailable. Please try again.';
            retry.hidden = false;
        } finally {
            window.clearTimeout(timeout);
            list.removeAttribute('aria-busy');
        }
    }

    retry.addEventListener('click', () => {
        loadRatings();
        status.focus();
    });

    // Request ratings only when the reader approaches the live data panel.
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            if (!entries.some((entry) => entry.isIntersecting)) return;
            observer.disconnect();
            loadRatings();
        }, { rootMargin: '300px' });
        observer.observe(section);
    } else {
        loadRatings();
    }
})();
