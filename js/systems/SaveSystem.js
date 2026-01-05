// PixelPal - Save System (LocalStorage)

class SaveSystem {
    constructor() {
        this.storageKey = 'pixelpal_save';
        this.autoSaveInterval = null;
        this.lastSaveTime = 0;
        this.saveThrottleMs = 1000; // Don't save more than once per second
    }

    // Start auto-save timer (saves every 30 seconds)
    startAutoSave() {
        if (this.autoSaveInterval) return;

        this.autoSaveInterval = setInterval(() => {
            this.saveNow();
        }, 30000); // Save every 30 seconds

        // Also save on visibility change (tab switch)
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

        // Save on before unload (closing tab/browser)
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));

        // Save on page hide (mobile background)
        window.addEventListener('pagehide', this.handleBeforeUnload.bind(this));

        console.log('Auto-save started');
    }

    handleVisibilityChange() {
        // Save when tab becomes hidden
        if (document.hidden) {
            this.saveNow();
            console.log('Saved on tab hide');
        }
    }

    handleBeforeUnload() {
        this.saveNow();
        console.log('Saved on page unload');
    }

    // Force save immediately (bypasses throttle)
    saveNow() {
        if (typeof petStats !== 'undefined' && typeof inventory !== 'undefined') {
            this.save({
                petStats: petStats,
                inventory: inventory,
                highScores: window.gameHighScores || {},
                totalGamesPlayed: window.totalGamesPlayed || 0,
            }, true);
        }
    }

    // Save game state (with optional force flag)
    save(gameState, force = false) {
        // Throttle saves unless forced
        const now = Date.now();
        if (!force && now - this.lastSaveTime < this.saveThrottleMs) {
            return true; // Skip this save, too soon
        }

        try {
            const saveData = {
                version: 1,
                timestamp: Date.now(),
                pet: {
                    stats: gameState.petStats.getAll(),
                    outfit: gameState.petStats.outfit || {},
                },
                inventory: {
                    coins: gameState.inventory.coins,
                    items: gameState.inventory.items,
                    ownedClothes: gameState.inventory.ownedClothes,
                },
                progress: {
                    level: gameState.petStats.level || 1,
                    xp: gameState.petStats.xp || 0,
                    xpToNextLevel: gameState.petStats.xpToNextLevel || 100,
                    totalGamesPlayed: gameState.totalGamesPlayed || 0,
                    highScores: gameState.highScores || {},
                },
            };

            localStorage.setItem(this.storageKey, JSON.stringify(saveData));
            this.lastSaveTime = now;
            return true;
        } catch (e) {
            console.error('Failed to save game:', e);
            return false;
        }
    }

    // Load game state
    load() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) return null;

            const saveData = JSON.parse(data);

            // Validate save version
            if (saveData.version !== 1) {
                console.warn('Save version mismatch, starting fresh');
                return null;
            }

            return saveData;
        } catch (e) {
            console.error('Failed to load game:', e);
            return null;
        }
    }

    // Check if save exists
    hasSave() {
        return localStorage.getItem(this.storageKey) !== null;
    }

    // Delete save
    deleteSave() {
        localStorage.removeItem(this.storageKey);
    }

    // Calculate offline time bonus/penalty
    calculateOfflineEffects(saveData) {
        if (!saveData || !saveData.timestamp) return null;

        const now = Date.now();
        const elapsed = now - saveData.timestamp;
        const minutes = Math.floor(elapsed / 60000);

        // Cap at 24 hours (1440 minutes)
        const cappedMinutes = Math.min(minutes, 1440);

        // Stats decay while offline (but slower - 1 point per 5 minutes)
        const decay = Math.floor(cappedMinutes / 5);

        return {
            minutesOffline: minutes,
            statDecay: decay,
        };
    }
}

// Global save system instance
const saveSystem = new SaveSystem();
