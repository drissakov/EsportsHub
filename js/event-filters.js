// Assignment 6 tournament search, extended with filters for the final project.
jQuery(function ($) {
    const controls = document.getElementById('event-controls');
    const $search = $('#event-search-input');
    const $suggestions = $('#event-search-suggestions');
    const $game = $('#event-game');
    const $format = $('#event-format');
    const $status = $('#event-search-status');
    const $clear = $('#event-clear');
    const storageKey = 'esportshub-event-filters';
    const defaults = { query: '', game: 'all', format: 'all' };

    function compact(text) {
        return text.trim().replace(/\s+/g, ' ');
    }

    const cards = $('#tournament-cards > .event').map(function () {
        const $card = $(this);
        return {
            element: this,
            game: this.dataset.game,
            format: this.dataset.format,
            title: compact($card.find('h3').text()),
            fields: $card.find('h3, .event-content > small, .event-meta > span').map(function () {
                const text = compact(this.textContent);
                return { element: this, text, searchable: text.toLowerCase() };
            }).get()
        };
    }).get();

    if (!controls || !cards.length) return;

    const games = $game.find('option').map(function () { return this.value; }).get();
    const formats = $format.find('option').map(function () { return this.value; }).get();

    function readSavedFilters() {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey));
            return {
                query: typeof saved?.query === 'string' ? saved.query : defaults.query,
                game: games.includes(saved?.game) ? saved.game : defaults.game,
                format: formats.includes(saved?.format) ? saved.format : defaults.format
            };
        } catch {
            return defaults;
        }
    }

    function saveFilters(filters) {
        try {
            localStorage.setItem(storageKey, JSON.stringify(filters));
        } catch {
            // The filters still work when browser storage is unavailable.
        }
    }

    function setControls({ query, game, format }) {
        $search.val(query);
        $game.val(game);
        $format.val(format);
    }

    function getFilters() {
        return {
            query: compact($search.val()),
            game: $game.val(),
            format: $format.val()
        };
    }

    function markMatches(card, pattern) {
        card.fields.forEach(({ element, text }) => {
            const $field = $(element);
            if (!pattern) {
                $field.text(text);
                return;
            }
            $field.empty();
            text.split(pattern).forEach((part, index) => {
                $field.append(index % 2
                    ? $('<mark>').addClass('search-highlight').text(part)
                    : document.createTextNode(part));
            });
        });
    }

    let visibleCards = [];

    function render() {
        const { query, game, format } = getFilters();
        const needle = query.toLowerCase();
        visibleCards = cards.filter((card) =>
            (game === 'all' || card.game === game) &&
            (format === 'all' || card.format === format) &&
            card.fields.some((field) => field.searchable.includes(needle))
        );

        // Escape regex punctuation because the search treats every character literally.
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = query && visibleCards.length ? new RegExp('(' + escaped + ')', 'gi') : null;

        cards.forEach((card) => {
            const visible = visibleCards.includes(card);
            card.element.hidden = !visible;
            markMatches(card, visible ? pattern : null);
        });

        const message = visibleCards.length === cards.length
            ? `Showing all ${cards.length} sample tournaments.`
            : `Showing ${visibleCards.length} of ${cards.length} sample tournaments.`;
        $status.text(visibleCards.length
            ? message
            : 'No tournaments match. Try a different search or clear the filters.');
    }

    function closeSuggestions() {
        $suggestions.prop('hidden', true);
    }

    function showSuggestions() {
        const needle = getFilters().query.toLowerCase();
        $suggestions.empty();
        if (!needle) {
            closeSuggestions();
            return;
        }

        const matches = visibleCards.filter((card) => card.title.toLowerCase().includes(needle));
        matches.forEach(({ title }) => {
            $('<button>').attr('type', 'button')
                .addClass('event-search-suggestion')
                .text(title)
                .appendTo($suggestions);
        });
        $suggestions.prop('hidden', !matches.length);
    }

    function linkedCard() {
        return cards.find((card) => '#' + card.element.id === location.hash);
    }

    function revealLinkedCard() {
        const target = linkedCard();
        if (!target?.element.hidden) return;

        // Open shared event links even when a saved filter would hide the target.
        setControls(defaults);
        render();
        target.element.scrollIntoView();
    }

    function updateFilters() {
        saveFilters(getFilters());
        render();

        // Once filters are edited, the saved choices take precedence on reload.
        const url = new URL(location.href);
        if (url.searchParams.has('game') || linkedCard()) {
            url.searchParams.delete('game');
            if (linkedCard()) url.hash = 'event-list';
            try {
                history.replaceState(history.state, '', url);
            } catch {
                // Some file previews restrict URL updates.
            }
        }
    }

    $search.on('input', function () {
        updateFilters();
        showSuggestions();
    }).on('focus', showSuggestions);
    $game.add($format).on('change', function () {
        updateFilters();
        closeSuggestions();
    });
    $clear.on('click', function () {
        setControls(defaults);
        updateFilters();
        $search.trigger('focus');
    });

    $suggestions.on('click', '.event-search-suggestion', function () {
        $search.val($(this).text()).trigger('focus');
        updateFilters();
        closeSuggestions();
    });
    $search.closest('.event-search').on('keydown', function (event) {
        if (event.key === 'Escape' && !$suggestions.prop('hidden')) {
            event.preventDefault();
            $search.trigger('focus');
            closeSuggestions();
        }
    }).on('focusout', function (event) {
        if (!this.contains(event.relatedTarget)) closeSuggestions();
    });
    $(window).on('hashchange', revealLinkedCard);

    const linkedGame = new URLSearchParams(location.search).get('game');
    if (games.includes(linkedGame)) {
        const filters = { ...defaults, game: linkedGame };
        setControls(filters);
        saveFilters(filters);
    } else {
        setControls(readSavedFilters());
    }
    controls.hidden = false;
    render();
    revealLinkedCard();
});
