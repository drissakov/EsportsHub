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
// Task 3: highlight every match in searchable tournament text.
$(document).ready(function () {
  const $search = $("#event-search-input");
  const $fields = $("#event-list .event-list .event")
    .find("h3, .event-content > small, .event-meta > span");

  if (!$search.length || !$fields.length) return;

  // Keep the original text so highlights never accumulate.
  const originals = $fields.map(function () {
    return {
      element: this,
      text: $(this).text()
    };
  }).get();

  function highlightMatches() {
    const query = $search.val().trim();

    // Treat characters such as +, (, and . as ordinary search text.
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = query
      ? new RegExp("(" + escapedQuery + ")", "gi")
      : null;

    originals.forEach(function (item) {
      const $element = $(item.element);
      $element.empty();

      if (!pattern) {
        $element.text(item.text);
        return;
      }

      const parts = item.text.split(pattern);

      parts.forEach(function (part, index) {
        if (index % 2 === 1) {
          $("<mark>")
            .addClass("search-highlight")
            .text(part)
            .appendTo($element);
        } else {
          $element.append(document.createTextNode(part));
        }
      });
    });
  }

  $search.on("input", highlightMatches);
  highlightMatches();
});
// Task 4: show how far the page has been scrolled.
$(document).ready(function () {
  const $progress = $("<div>")
    .addClass("scroll-progress")
    .attr({
      role: "progressbar",
      "aria-label": "Page scroll progress",
      "aria-valuemin": "0",
      "aria-valuemax": "100",
      "aria-valuenow": "0"
    })
    .prependTo("body");

  const $fill = $("<div>")
    .addClass("scroll-progress-fill")
    .appendTo($progress);

  let updateScheduled = false;

  function updateProgress() {
    const page = document.documentElement;
    const scrollableHeight = page.scrollHeight - page.clientHeight;
    const scrollTop = $(window).scrollTop();

    const ratio = scrollableHeight > 0
      ? Math.min(1, Math.max(0, scrollTop / scrollableHeight))
      : 1;

    $fill.css("transform", `scaleX(${ratio})`);
    $progress.attr("aria-valuenow", Math.round(ratio * 100));

    updateScheduled = false;
  }

  function scheduleUpdate() {
    if (updateScheduled) return;

    updateScheduled = true;
    window.requestAnimationFrame(updateProgress);
  }

  $(window).on("scroll resize load", scheduleUpdate);

  // Recalculate when filtering or expanding content changes page height.
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(document.body);
  }

  updateProgress();
});
// Task 5: animate counts of the content featured on the home page.
$(document).ready(function () {
  const $stats = $(".home-stats");
  if (!$stats.length) return;

  const counters = $stats.find(".stat-number").map(function () {
    const $number = $(this);
    const selector = $number.attr("data-count-selector");
    const target = $(selector).length;

    $number.text(target);

    return {
      $number: $number,
      target: target
    };
  }).get();

  function animateCounters() {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    counters.forEach(function (counter) {
      if (reduceMotion) {
        counter.$number.text(counter.target);
        return;
      }

      counter.$number.text("0");

      $({ count: 0 }).animate(
        { count: counter.target },
        {
          duration: 1400,
          easing: "swing",
          step: function (value) {
            counter.$number.text(Math.floor(value));
          },
          complete: function () {
            counter.$number.text(counter.target);
          }
        }
      );
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      if (entries.some(function (entry) {
        return entry.isIntersecting;
      })) {
        observer.disconnect();
        animateCounters();
      }
    }, { threshold: 0.5 });

    observer.observe($stats[0]);
  } else {
    animateCounters();
  }
});