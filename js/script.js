// Assignment 6: jQuery features for EsportsHub.
$(document).ready(function () {
  console.log("jQuery is ready!");
});
// Task 1: filter tournaments while the user types.
$(document).ready(function () {
  const $search = $("#event-search-input");
  const $cards = $("#event-list .event-list > .event");
  const $status = $("#event-search-status");

  if (!$search.length || !$cards.length) return;

  function filterTournaments() {
    const query = $search.val().trim().toLowerCase();

    const $matches = $cards.filter(function () {
      const text = $(this)
        .find("h3, .event-content > small, .event-meta")
        .text()
        .replace(/\s+/g, " ")
        .toLowerCase();

      return text.includes(query);
    });

    $cards.hide();
    $matches.show();

    if (!query) {
      $status.text(`Showing all ${$cards.length} tournaments.`);
    } else if (!$matches.length) {
      $status.text("No tournaments found. Try another name, game or city.");
    } else {
      $status.text(
        `Showing ${$matches.length} of ${$cards.length} tournaments.`
      );
    }
  }

  $search.on("input", filterTournaments);
  filterTournaments();
});
// Task 2: autocomplete suggestions from tournament titles.
$(document).ready(function () {
  const $search = $("#event-search-input");
  const $suggestions = $("#event-search-suggestions");
  const $container = $search.closest(".event-search");

  if (!$search.length || !$suggestions.length) return;

  const titles = $("#event-list .event-list .event h3")
    .map(function () {
      return $(this).text().trim();
    })
    .get();

  $search.attr("autocomplete", "off");

  function closeSuggestions() {
    $suggestions.prop("hidden", true);
  }

  function showSuggestions() {
    const query = $search.val().trim().toLowerCase();
    $suggestions.empty();

    if (!query) {
      closeSuggestions();
      return;
    }

    const matches = titles.filter(function (title) {
      return title.toLowerCase().includes(query);
    });

    matches.forEach(function (title) {
      $("<button>")
        .attr("type", "button")
        .addClass("event-search-suggestion")
        .text(title)
        .appendTo($suggestions);
    });

    $suggestions.prop("hidden", matches.length === 0);
  }

  $search.on("input focus", showSuggestions);

  $suggestions.on("click", ".event-search-suggestion", function () {
    const title = $(this).text();

    $search.val(title).trigger("input");
    $search.trigger("focus");
    closeSuggestions();
  });

  $container.on("keydown", function (event) {
    if (event.key === "Escape") {
      $search.trigger("focus");
      closeSuggestions();
    }
  });

  $container.on("focusout", function (event) {
    if (!this.contains(event.relatedTarget)) {
      closeSuggestions();
    }
  });

  $(document).on("click", function (event) {
    if (!$(event.target).closest($container).length) {
      closeSuggestions();
    }
  });
});