// Sound preview and successful demo registration notification.
(() => {
    const button = document.getElementById('sound-preview');
    const message = document.getElementById('sound-message');

    const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
        if (message) {
            message.textContent =
                'Sound is not supported in this browser.';
        }
        return;
    }

    let audioContext;
    let playing = false;

    if (button) {
        button.disabled = false;
    }

    async function playNotification() {
        // Prevent overlapping sounds.
        if (playing) return;

        playing = true;

        if (button) button.disabled = true;
        if (message) {
            message.textContent = 'Playing notification…';
        }

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

            // Smooth volume changes prevent abrupt clicks.
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

                if (button) button.disabled = false;
                if (message) {
                    message.textContent =
                        'Notification finished. You can preview it again.';
                }
            };

            oscillator.start(now);
            oscillator.stop(now + 0.45);
        } catch {
            oscillator?.disconnect();
            volume?.disconnect();

            playing = false;

            if (button) button.disabled = false;
            if (message) {
                message.textContent =
                    'Could not play the sound. Please try again.';
            }
        }
    }

    if (button) {
        button.addEventListener('click', playNotification);
    }

    // The validation code sends this event only after success.
    document.addEventListener(
        'esportshub:registration-success',
        playNotification
    );
})();