// PixelPal - Stats History Tracking System

class StatsHistorySystem {
    constructor() {
        this.history = [];
        this.maxHistoryLength = 100; // Keep last 100 data points
        this.lastRecordTime = Date.now();
    }

    // Record current stats (call every hour or on significant changes)
    recordStats() {
        const now = Date.now();

        // Only record if at least 10 minutes have passed
        if (now - this.lastRecordTime < 600000) return;

        const stats = petStats.getAll();

        this.history.push({
            timestamp: now,
            hunger: stats.hunger,
            energy: stats.energy,
            happiness: stats.happiness,
            cleanliness: stats.cleanliness,
            level: stats.level,
            coins: inventory.coins,
        });

        // Trim history if too long
        if (this.history.length > this.maxHistoryLength) {
            this.history = this.history.slice(-this.maxHistoryLength);
        }

        this.lastRecordTime = now;
    }

    // Get history for a specific stat
    getStatHistory(statName) {
        return this.history.map(entry => ({
            timestamp: entry.timestamp,
            value: entry[statName],
        }));
    }

    // Get average stat over time period
    getAverageStat(statName, hours = 24) {
        const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
        const relevantHistory = this.history.filter(entry => entry.timestamp >= cutoffTime);

        if (relevantHistory.length === 0) return 0;

        const sum = relevantHistory.reduce((acc, entry) => acc + entry[statName], 0);
        return Math.round(sum / relevantHistory.length);
    }

    // Get total playtime in hours
    getTotalPlaytime() {
        if (this.history.length === 0) return 0;

        const firstRecord = this.history[0].timestamp;
        const lastRecord = this.history[this.history.length - 1].timestamp;
        const milliseconds = lastRecord - firstRecord;

        return Math.floor(milliseconds / (1000 * 60 * 60)); // Hours
    }

    // Get statistics summary
    getStatsSummary() {
        if (this.history.length === 0) {
            return {
                avgHappiness: 0,
                avgEnergy: 0,
                avgHunger: 0,
                avgCleanliness: 0,
                playtime: 0,
            };
        }

        return {
            avgHappiness: this.getAverageStat('happiness', 168), // 7 days
            avgEnergy: this.getAverageStat('energy', 168),
            avgHunger: this.getAverageStat('hunger', 168),
            avgCleanliness: this.getAverageStat('cleanliness', 168),
            playtime: this.getTotalPlaytime(),
        };
    }

    // Save data
    getSaveData() {
        return {
            history: this.history,
            lastRecordTime: this.lastRecordTime,
        };
    }

    // Load data
    loadFromSave(saveData) {
        if (saveData.statsHistory) {
            this.history = saveData.statsHistory.history || [];
            this.lastRecordTime = saveData.statsHistory.lastRecordTime || Date.now();
        }
    }
}

// Global stats history system instance
const statsHistory = new StatsHistorySystem();
