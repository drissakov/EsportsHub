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