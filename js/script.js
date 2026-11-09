// Assignment 6: jQuery features for EsportsHub.
$(document).ready(function () {
  console.log("jQuery is ready!");
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
// Task 7: show a temporary notification after application success.
$(document).ready(function () {
    const $notification = $("<div>")
        .addClass("hub-toast")
        .attr({
            role: "status",
            "aria-live": "polite",
            "aria-atomic": "true"
        })
        .hide()
        .appendTo("body");

    $(document).on("esportshub:application-success", function () {
        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        $notification
            .stop(true, true)
            .hide()
            .text("✓ Demo application completed successfully!")
            .fadeIn(reducedMotion ? 0 : 250)
            .delay(3500)
            .fadeOut(reducedMotion ? 0 : 400);
    });
});
// Task 8: copy a direct link to a tournament.
$(document).ready(function () {
    $("#event-list .event-list > .event").each(function () {
        const $event = $(this);
        const eventId = $event.attr("id");
        const title = $event.find("h3").text().trim();
        const $actions = $event.find(".event-actions");

        if (!eventId || !$actions.length) return;

        const link = new URL("events.html#" + encodeURIComponent(eventId), location.href).href;

        const $wrapper = $("<span>").addClass("event-copy");

        const $button = $("<button>")
            .attr({
                type: "button",
                "aria-label": "Copy link to " + title
            })
            .addClass("btn btn-outline-primary event-copy-button");

        const $icon = $("<span>")
            .attr("aria-hidden", "true")
            .text("⧉");

        const $label = $("<span>").text("Copy link");

        const $tooltip = $("<span>")
            .addClass("event-copy-tooltip")
            .attr("role", "status");

        $button.append($icon, $label);
        $wrapper.append($button, $tooltip).appendTo($actions);

        let resetTimer;
        let copying = false;

        $button.on("click", async function () {
            if (copying) return;

            copying = true;
            window.clearTimeout(resetTimer);
            $tooltip.removeClass("is-visible").text("");
            $button.prop("disabled", true);

            try {
                if (!navigator.clipboard?.writeText) {
                    throw new Error("Clipboard is unavailable");
                }

                await navigator.clipboard.writeText(link);

                $icon.text("✓");
                $label.text("Copied");
                $tooltip.text("Copied to clipboard!");
            } catch {
                $icon.text("⧉");
                $label.text("Copy link");
                $tooltip.text("Could not copy. Please try on the HTTPS website.");
            } finally {
                copying = false;
                $button.prop("disabled", false);
                $tooltip.addClass("is-visible");

                resetTimer = window.setTimeout(function () {
                    $icon.text("⧉");
                    $label.text("Copy link");
                    $tooltip.removeClass("is-visible").text("");
                }, 2500);
            }
        });
    });
});
// Task 9: load player images when they enter the viewport.
$(document).ready(function () {
  let $pendingImages = $("img.jquery-lazy[data-src]");

  if (!$pendingImages.length) return;

  function loadVisibleImages() {
    const viewportTop = $(window).scrollTop();
    const viewportBottom = viewportTop + $(window).height();

    $pendingImages.each(function () {
      const $image = $(this);
      const imageTop = $image.offset().top;
      const imageBottom = imageTop + $image.outerHeight();

      const isVisible =
        imageTop < viewportBottom && imageBottom > viewportTop;

      if (isVisible) {
        $image
          .attr("src", $image.attr("data-src"))
          .removeAttr("data-src")
          .removeClass("jquery-lazy");
      }
    });

    $pendingImages = $pendingImages.filter("[data-src]");

    if (!$pendingImages.length) {
      $(window).off(".playerLazyLoading");
    }
  }

  $(window).on(
    "scroll.playerLazyLoading resize.playerLazyLoading load.playerLazyLoading",
    loadVisibleImages
  );

  loadVisibleImages();
});
