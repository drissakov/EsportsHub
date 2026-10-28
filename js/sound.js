// Assignment 5: a short match notification sound.
(() => {
    const button = document.getElementById('sound-preview');
    const message = document.getElementById('sound-message');
    if (!button || !message) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
        message.textContent = 'Sound preview is not supported in this browser.';
        return;
    }

    let audioContext;
    let playing = false;
    button.disabled = false;

    button.addEventListener('click', async () => {
        if (playing) return;

        playing = true;
        button.disabled = true;
        message.textContent = 'Playing match alert…';

        let oscillator;
        let volume;

        try {
            if (!audioContext || audioContext.state === 'closed') {
                audioContext = new AudioContextClass();
            }

            await audioContext.resume();

            if (audioContext.state !== 'running') {
                throw new Error('Audio is unavailable.');
            }

            oscillator = audioContext.createOscillator();
            volume = audioContext.createGain();

            const now = audioContext.currentTime;

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(660, now);
            oscillator.frequency.setValueAtTime(880, now + 0.18);

            // Fade in and out to avoid abrupt clicks.
            volume.gain.setValueAtTime(0, now);
            volume.gain.linearRampToValueAtTime(0.08, now + 0.02);
            volume.gain.setValueAtTime(0.08, now + 0.30);
            volume.gain.linearRampToValueAtTime(0, now + 0.42);

            oscillator.connect(volume);
            volume.connect(audioContext.destination);

            oscillator.onended = () => {
                oscillator.disconnect();
                volume.disconnect();
                playing = false;
                button.disabled = false;
                message.textContent = 'Preview finished. Play it again anytime.';
            };

            oscillator.start(now);
            oscillator.stop(now + 0.45);
        } catch {
            oscillator?.disconnect();
            volume?.disconnect();
            playing = false;
            button.disabled = false;
            message.textContent = 'Could not play the sound. Please try again.';
        }
    });
})();