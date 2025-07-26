/**
 * XenoTic - Audio Manager
 * Handles sound effects and audio feedback for the game
 */

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.masterVolume = 0.3;
        this.soundEnabled = true;
        
        this.initializeAudio();
        this.loadSettings();
    }
    
    /**
     * Initialize Web Audio API
     */
    async initializeAudio() {
        try {
            // Initialize AudioContext on first user interaction
            document.addEventListener('click', this.createAudioContext.bind(this), { once: true });
            document.addEventListener('keydown', this.createAudioContext.bind(this), { once: true });
            document.addEventListener('touchstart', this.createAudioContext.bind(this), { once: true });
        } catch (error) {
            console.warn('Audio initialization failed:', error);
        }
    }
    
    /**
     * Create AudioContext (must be called after user interaction)
     */
    async createAudioContext() {
        if (this.audioContext) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            await this.generateSounds();
        } catch (error) {
            console.warn('AudioContext creation failed:', error);
        }
    }
    
    /**
     * Generate procedural sound effects
     */
    async generateSounds() {
        if (!this.audioContext) return;
        
        this.sounds = {
            move: this.generateMoveSound(),
            aiMove: this.generateAIMoveSound(),
            win: this.generateWinSound(),
            lose: this.generateLoseSound(),
            draw: this.generateDrawSound(),
            hover: this.generateHoverSound(),
            click: this.generateClickSound(),
            hint: this.generateHintSound()
        };
    }
    
    /**
     * Generate move sound effect
     */
    generateMoveSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.15);
        };
    }
    
    /**
     * Generate AI move sound effect
     */
    generateAIMoveSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.2, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.2);
        };
    }
    
    /**
     * Generate win sound effect
     */
    generateWinSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            // Play ascending chord
            const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.4, this.audioContext.currentTime + 0.05);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.8);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.8);
                }, index * 100);
            });
        };
    }
    
    /**
     * Generate lose sound effect
     */
    generateLoseSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            // Play descending notes
            const frequencies = [400, 350, 300, 250];
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.type = 'sawtooth';
                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime + 0.05);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.3);
                }, index * 150);
            });
        };
    }
    
    /**
     * Generate draw sound effect
     */
    generateDrawSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.2, this.audioContext.currentTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.2, this.audioContext.currentTime + 0.3);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.6);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.6);
        };
    }
    
    /**
     * Generate hover sound effect
     */
    generateHoverSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.1, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.05);
        };
    }
    
    /**
     * Generate click sound effect
     */
    generateClickSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(500, this.audioContext.currentTime + 0.05);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.15, this.audioContext.currentTime + 0.005);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.05);
        };
    }
    
    /**
     * Generate hint sound effect
     */
    generateHintSound() {
        return () => {
            if (!this.soundEnabled || !this.audioContext) return;
            
            // Play two-tone chime
            [880, 1760].forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                    
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.25, this.audioContext.currentTime + 0.05);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.4);
                }, index * 100);
            });
        };
    }
    
    /**
     * Play move sound
     */
    static playMoveSound() {
        if (window.audioManager && window.audioManager.sounds.move) {
            window.audioManager.sounds.move();
        }
    }
    
    /**
     * Play AI move sound
     */
    static playAIMoveSound() {
        if (window.audioManager && window.audioManager.sounds.aiMove) {
            window.audioManager.sounds.aiMove();
        }
    }
    
    /**
     * Play win sound
     */
    static playWinSound() {
        if (window.audioManager && window.audioManager.sounds.win) {
            window.audioManager.sounds.win();
        }
    }
    
    /**
     * Play lose sound
     */
    static playLoseSound() {
        if (window.audioManager && window.audioManager.sounds.lose) {
            window.audioManager.sounds.lose();
        }
    }
    
    /**
     * Play draw sound
     */
    static playDrawSound() {
        if (window.audioManager && window.audioManager.sounds.draw) {
            window.audioManager.sounds.draw();
        }
    }
    
    /**
     * Play hover sound
     */
    static playHoverSound() {
        if (window.audioManager && window.audioManager.sounds.hover) {
            window.audioManager.sounds.hover();
        }
    }
    
    /**
     * Play click sound
     */
    static playClickSound() {
        if (window.audioManager && window.audioManager.sounds.click) {
            window.audioManager.sounds.click();
        }
    }
    
    /**
     * Play hint sound
     */
    static playHintSound() {
        if (window.audioManager && window.audioManager.sounds.hint) {
            window.audioManager.sounds.hint();
        }
    }
    
    /**
     * Toggle sound on/off
     */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.saveSettings();
        return this.soundEnabled;
    }
    
    /**
     * Set master volume
     */
    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.saveSettings();
    }
    
    /**
     * Get current volume
     */
    getVolume() {
        return this.masterVolume;
    }
    
    /**
     * Check if sound is enabled
     */
    isSoundEnabled() {
        return this.soundEnabled;
    }
    
    /**
     * Save audio settings to localStorage
     */
    saveSettings() {
        const settings = {
            volume: this.masterVolume,
            soundEnabled: this.soundEnabled
        };
        localStorage.setItem('xenotic-audio-settings', JSON.stringify(settings));
    }
    
    /**
     * Load audio settings from localStorage
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('xenotic-audio-settings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.masterVolume = settings.volume ?? 0.3;
                this.soundEnabled = settings.soundEnabled ?? true;
            }
        } catch (error) {
            console.warn('Failed to load audio settings:', error);
        }
    }
    
    /**
     * Create audio settings UI
     */
    createAudioSettingsUI() {
        const settingsHtml = `
            <div class="audio-settings">
                <h4><i class="fas fa-volume-up"></i> Audio Settings</h4>
                <div class="setting-item">
                    <label for="soundToggle">Sound Effects:</label>
                    <input type="checkbox" id="soundToggle" ${this.soundEnabled ? 'checked' : ''}>
                </div>
                <div class="setting-item">
                    <label for="volumeSlider">Volume:</label>
                    <input type="range" id="volumeSlider" min="0" max="1" step="0.1" value="${this.masterVolume}">
                    <span id="volumeValue">${Math.round(this.masterVolume * 100)}%</span>
                </div>
            </div>
        `;
        
        return settingsHtml;
    }
    
    /**
     * Setup audio settings event listeners
     */
    setupAudioSettingsListeners() {
        const soundToggle = document.getElementById('soundToggle');
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValue = document.getElementById('volumeValue');
        
        if (soundToggle) {
            soundToggle.addEventListener('change', (e) => {
                this.soundEnabled = e.target.checked;
                this.saveSettings();
                
                // Play test sound if enabled
                if (this.soundEnabled) {
                    AudioManager.playClickSound();
                }
            });
        }
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.masterVolume = parseFloat(e.target.value);
                if (volumeValue) {
                    volumeValue.textContent = `${Math.round(this.masterVolume * 100)}%`;
                }
                this.saveSettings();
                
                // Play test sound
                AudioManager.playClickSound();
            });
        }
    }
}

// Initialize Audio Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.audioManager = new AudioManager();
    
    // Add subtle hover sounds to interactive elements
    document.addEventListener('mouseenter', (e) => {
        if (e.target.matches('button:not(:disabled)') || 
            e.target.matches('.board-cell:not(.occupied)') ||
            e.target.matches('.control-select')) {
            // Add small delay to prevent too many rapid sounds
            if (!e.target.dataset.hoverSoundTimeout) {
                e.target.dataset.hoverSoundTimeout = 'true';
                AudioManager.playHoverSound();
                setTimeout(() => {
                    delete e.target.dataset.hoverSoundTimeout;
                }, 100);
            }
        }
    }, true);
    
    // Add click sounds to buttons
    document.addEventListener('click', (e) => {
        if (e.target.matches('button') || e.target.closest('button')) {
            AudioManager.playClickSound();
        }
    });
});
