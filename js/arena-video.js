(() => {
    const video = document.getElementById('arena-video');
    const toggle = document.querySelector('.arena-video-toggle');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    async function playVideo() {
        if (!video.getAttribute('src')) video.src = video.dataset.source;
        try {
            await video.play();
        } catch {
            // The poster remains available when browser autoplay is blocked.
        }
    }

    function updateToggle() {
        toggle.textContent = video.paused ? 'Play video' : 'Pause video';
    }

    video.addEventListener('play', updateToggle);
    video.addEventListener('pause', updateToggle);
    video.addEventListener('error', () => { toggle.hidden = true; });
    toggle.addEventListener('click', () => {
        if (video.paused) playVideo();
        else video.pause();
    });
    reduceMotion.addEventListener('change', (event) => {
        if (event.matches) video.pause();
    });

    toggle.hidden = false;
    if (!reduceMotion.matches) playVideo();
})();
