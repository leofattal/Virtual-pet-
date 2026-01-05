// PixelPal - Sound Manager (Web Audio API)

class SoundManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.volume = 0.3;
    }

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }

    // Resume audio context (needed after user interaction)
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Play a simple beep/boop sound
    playTone(frequency, duration, type = 'square') {
        if (!this.enabled || !this.audioContext) return;

        this.resume();

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Preset sounds
    playFeed() {
        this.playTone(523, 0.1); // C5
        setTimeout(() => this.playTone(659, 0.1), 100); // E5
        setTimeout(() => this.playTone(784, 0.15), 200); // G5
    }

    playSleep() {
        this.playTone(392, 0.3, 'sine'); // G4
        setTimeout(() => this.playTone(330, 0.4, 'sine'), 300); // E4
        setTimeout(() => this.playTone(262, 0.5, 'sine'), 600); // C4
    }

    playClean() {
        for (let i = 0; i < 4; i++) {
            setTimeout(() => this.playTone(800 + Math.random() * 400, 0.05, 'sine'), i * 80);
        }
    }

    playHappy() {
        this.playTone(523, 0.1); // C5
        setTimeout(() => this.playTone(659, 0.1), 80); // E5
        setTimeout(() => this.playTone(784, 0.1), 160); // G5
        setTimeout(() => this.playTone(1047, 0.2), 240); // C6
    }

    playCoin() {
        this.playTone(988, 0.08); // B5
        setTimeout(() => this.playTone(1319, 0.15), 80); // E6
    }

    // Cha-ching! Cash register sound for purchases
    playChaChing() {
        // First part: coins dropping
        this.playTone(1200, 0.05, 'sine');
        setTimeout(() => this.playTone(1400, 0.05, 'sine'), 40);
        setTimeout(() => this.playTone(1600, 0.05, 'sine'), 80);
        // Second part: register ding
        setTimeout(() => this.playTone(2000, 0.15, 'sine'), 120);
        setTimeout(() => this.playTone(2500, 0.2, 'sine'), 180);
    }

    playClick() {
        this.playTone(600, 0.05, 'square');
    }

    playError() {
        this.playTone(200, 0.15, 'sawtooth');
        setTimeout(() => this.playTone(150, 0.2, 'sawtooth'), 150);
    }

    playJump() {
        this.playTone(400, 0.1);
        setTimeout(() => this.playTone(600, 0.1), 50);
    }

    playCollect() {
        this.playTone(880, 0.08);
        setTimeout(() => this.playTone(1100, 0.1), 60);
    }

    playGameOver() {
        this.playTone(400, 0.2);
        setTimeout(() => this.playTone(300, 0.2), 200);
        setTimeout(() => this.playTone(200, 0.3), 400);
    }

    playLevelUp() {
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.15), i * 100);
        });
    }

    // Toggle sound on/off
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }
}

// Global sound manager instance
const soundManager = new SoundManager();
