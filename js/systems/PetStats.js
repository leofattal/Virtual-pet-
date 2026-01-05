// PixelPal - Pet Stats System

class PetStats {
    constructor() {
        this.name = 'Pixel'; // Default pet name
        this.hunger = CONFIG.STARTING_STATS.hunger;
        this.energy = CONFIG.STARTING_STATS.energy;
        this.happiness = CONFIG.STARTING_STATS.happiness;
        this.cleanliness = CONFIG.STARTING_STATS.cleanliness;

        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;

        this.outfit = {
            hat: null,
            accessory: null,
        };

        this.hairBrushed = false; // Track if hair has been brushed today

        // Neglect and death system
        this.isDead = false;
        this.neglectStartTime = null; // When pet first became critically unhappy
        this.lastInteractionTime = Date.now();

        this.decayTimer = null;
        this.neglectCheckTimer = null;
        this.listeners = [];
    }

    // Set pet name
    setName(name) {
        this.name = name || 'Pixel';
        this.notifyListeners();
    }

    // Start stat decay timer
    startDecay() {
        if (this.decayTimer) return;

        this.decayTimer = setInterval(() => {
            this.decay();
        }, CONFIG.STAT_DECAY_INTERVAL);

        // Also start neglect checking (check every 10 seconds)
        this.startNeglectCheck();
    }

    // Start neglect monitoring
    startNeglectCheck() {
        if (this.neglectCheckTimer) return;

        this.neglectCheckTimer = setInterval(() => {
            this.checkNeglect();
        }, 10000); // Check every 10 seconds
    }

    // Check if pet is being neglected
    checkNeglect() {
        if (this.isDead) return;

        const avgStat = (this.hunger + this.energy + this.happiness + this.cleanliness) / 4;

        // If average stats are critically low (below 15), start neglect timer
        if (avgStat < 15) {
            if (!this.neglectStartTime) {
                this.neglectStartTime = Date.now();
                console.log('Pet neglect started - stats critically low');
            }

            const neglectDuration = Date.now() - this.neglectStartTime;
            const neglectMinutes = neglectDuration / 60000;

            // After 30 minutes of neglect - pet gets very sad
            // After 60 minutes of neglect - pet dies
            if (neglectMinutes >= 60) {
                this.die();
            }
        } else {
            // Stats improved, reset neglect timer
            if (this.neglectStartTime) {
                console.log('Pet no longer neglected - stats improved');
                this.neglectStartTime = null;
            }
        }
    }

    // Get neglect status for UI display
    getNeglectStatus() {
        if (this.isDead) return { status: 'dead', minutesNeglected: 0 };
        if (!this.neglectStartTime) return { status: 'ok', minutesNeglected: 0 };

        const neglectMinutes = (Date.now() - this.neglectStartTime) / 60000;

        if (neglectMinutes >= 30) {
            return { status: 'critical', minutesNeglected: neglectMinutes };
        } else if (neglectMinutes >= 15) {
            return { status: 'warning', minutesNeglected: neglectMinutes };
        }

        return { status: 'neglected', minutesNeglected: neglectMinutes };
    }

    // Pet dies from neglect
    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.stopDecay();

        console.log('Pet has died from neglect :(');

        // Notify listeners about death
        this.notifyListeners();
    }

    // Reset pet after funeral (start fresh)
    resetAfterDeath() {
        this.isDead = false;
        this.name = 'Pixel';
        this.hunger = CONFIG.STARTING_STATS.hunger;
        this.energy = CONFIG.STARTING_STATS.energy;
        this.happiness = CONFIG.STARTING_STATS.happiness;
        this.cleanliness = CONFIG.STARTING_STATS.cleanliness;
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;
        this.outfit = { hat: null, accessory: null };
        this.hairBrushed = false;
        this.neglectStartTime = null;
        this.lastInteractionTime = Date.now();

        // Reset inventory coins
        inventory.coins = 0;
        inventory.items = {};
        inventory.ownedClothes = [];

        // Clear save data
        saveSystem.deleteSave();

        this.notifyListeners();
    }

    // Record player interaction (resets neglect tracking)
    recordInteraction() {
        this.lastInteractionTime = Date.now();
    }

    // Stop stat decay
    stopDecay() {
        if (this.decayTimer) {
            clearInterval(this.decayTimer);
            this.decayTimer = null;
        }
        if (this.neglectCheckTimer) {
            clearInterval(this.neglectCheckTimer);
            this.neglectCheckTimer = null;
        }
    }

    // Decay all stats
    decay() {
        if (this.isDead) return;

        this.hunger = Math.max(0, this.hunger - CONFIG.STAT_DECAY_RATE);
        this.energy = Math.max(0, this.energy - CONFIG.STAT_DECAY_RATE);
        this.happiness = Math.max(0, this.happiness - CONFIG.STAT_DECAY_RATE);
        this.cleanliness = Math.max(0, this.cleanliness - CONFIG.STAT_DECAY_RATE);

        this.notifyListeners();
    }

    // Apply offline decay
    applyOfflineDecay(amount) {
        this.hunger = Math.max(0, this.hunger - amount);
        this.energy = Math.max(0, this.energy - amount);
        this.happiness = Math.max(0, this.happiness - amount);
        this.cleanliness = Math.max(0, this.cleanliness - amount);
        this.notifyListeners();
    }

    // Modify a stat
    modifyStat(stat, amount) {
        if (this[stat] === undefined) return;

        this[stat] = Math.max(0, Math.min(CONFIG.MAX_STAT, this[stat] + amount));
        this.notifyListeners();
    }

    // Feed the pet
    feed(foodItem) {
        if (foodItem.effects) {
            for (const stat in foodItem.effects) {
                this.modifyStat(stat, foodItem.effects[stat]);
            }
        }
        this.addXP(5);
        // Earn coins for feeding!
        inventory.addCoins(1);
    }

    // Put pet to sleep (restore energy)
    sleep(amount = 50) {
        this.modifyStat('energy', amount);
        this.addXP(3);
        // Earn coins for good rest!
        inventory.addCoins(3);
    }

    // Clean the pet
    clean(amount = 40) {
        this.modifyStat('cleanliness', amount);
        this.addXP(3);
    }

    // Play with pet (from playground)
    play(amount = 20) {
        this.modifyStat('happiness', amount);
        this.modifyStat('energy', -5); // Playing uses some energy
        this.addXP(5);
    }

    // Use a toy
    useToy(toy) {
        if (toy.effects) {
            for (const stat in toy.effects) {
                this.modifyStat(stat, toy.effects[stat]);
            }
        }
        this.addXP(3);
    }

    // Add XP and check for level up
    addXP(amount) {
        this.xp += amount;

        while (this.xp >= this.xpToNextLevel) {
            this.xp -= this.xpToNextLevel;
            this.level++;
            this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);
            this.onLevelUp();
        }

        this.notifyListeners();
    }

    // Level up callback
    onLevelUp() {
        // Restore some stats on level up
        this.hunger = Math.min(CONFIG.MAX_STAT, this.hunger + 20);
        this.energy = Math.min(CONFIG.MAX_STAT, this.energy + 20);
        this.happiness = Math.min(CONFIG.MAX_STAT, this.happiness + 20);
        this.cleanliness = Math.min(CONFIG.MAX_STAT, this.cleanliness + 20);

        soundManager.playLevelUp();
    }

    // Equip clothing item
    equip(item) {
        if (item.category === 'hat') {
            this.outfit.hat = item.id;
        } else if (item.category === 'accessory') {
            this.outfit.accessory = item.id;
        }
        this.notifyListeners();
    }

    // Unequip item
    unequip(slot) {
        if (this.outfit[slot]) {
            this.outfit[slot] = null;
            this.notifyListeners();
        }
    }

    // Get current pet state
    getState() {
        // Determine mood based on stats
        const avgStat = (this.hunger + this.energy + this.happiness + this.cleanliness) / 4;

        if (this.energy < CONFIG.CRITICAL_STAT) return 'sleepy';
        if (this.hunger < CONFIG.CRITICAL_STAT) return 'hungry';
        if (this.happiness < CONFIG.CRITICAL_STAT) return 'sad';
        if (this.cleanliness < CONFIG.CRITICAL_STAT) return 'dirty';
        if (avgStat > 70) return 'happy';

        return 'neutral';
    }

    // Get all stats as object
    getAll() {
        return {
            name: this.name,
            hunger: this.hunger,
            energy: this.energy,
            happiness: this.happiness,
            cleanliness: this.cleanliness,
            level: this.level,
            xp: this.xp,
            hairBrushed: this.hairBrushed,
        };
    }

    // Load stats from save
    loadFromSave(saveData) {
        if (saveData.pet && saveData.pet.stats) {
            const stats = saveData.pet.stats;
            this.name = stats.name ?? 'Pixel';
            this.hunger = stats.hunger ?? CONFIG.STARTING_STATS.hunger;
            this.energy = stats.energy ?? CONFIG.STARTING_STATS.energy;
            this.happiness = stats.happiness ?? CONFIG.STARTING_STATS.happiness;
            this.cleanliness = stats.cleanliness ?? CONFIG.STARTING_STATS.cleanliness;
            this.level = stats.level ?? 1;
            this.xp = stats.xp ?? 0;
            this.hairBrushed = stats.hairBrushed ?? false;
        }

        // Load level progress from progress section
        if (saveData.progress) {
            this.level = saveData.progress.level ?? this.level;
            this.xp = saveData.progress.xp ?? this.xp;
            this.xpToNextLevel = saveData.progress.xpToNextLevel ?? 100;
        }

        if (saveData.pet && saveData.pet.outfit) {
            this.outfit = saveData.pet.outfit;
        }

        this.notifyListeners();
    }

    // Check if this is a new game (no name set yet)
    isNewGame() {
        return !saveSystem.hasSave();
    }

    // Event listener system
    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this));
    }
}

// Global pet stats instance
const petStats = new PetStats();
