// PixelPal - Pet Evolution/Growth System

class EvolutionSystem {
    constructor() {
        this.currentStage = 'baby';
        this.ageInDays = 0;
        this.lastAgeCheck = Date.now();

        this.stages = {
            baby: {
                id: 'baby',
                name: 'Baby',
                minAge: 0,
                icon: '👶',
                description: 'Your pet is just a baby!',
                sizeMultiplier: 0.7,
                statMultiplier: 0.8, // Stats decay 20% slower
            },
            child: {
                id: 'child',
                name: 'Child',
                minAge: 3, // 3 days old
                icon: '🧒',
                description: 'Your pet has grown into a child!',
                sizeMultiplier: 0.9,
                statMultiplier: 1.0,
            },
            teen: {
                id: 'teen',
                name: 'Teen',
                minAge: 7, // 7 days old
                icon: '🧑',
                description: 'Your pet is now a teenager!',
                sizeMultiplier: 1.1,
                statMultiplier: 1.1, // Stats decay 10% faster
            },
            adult: {
                id: 'adult',
                name: 'Adult',
                minAge: 14, // 14 days old
                icon: '👤',
                description: 'Your pet is now fully grown!',
                sizeMultiplier: 1.2,
                statMultiplier: 1.0,
            },
        };
    }

    // Update age (call this on daily check)
    updateAge() {
        const now = Date.now();
        const daysSinceLastCheck = (now - this.lastAgeCheck) / (1000 * 60 * 60 * 24);

        if (daysSinceLastCheck >= 1) {
            this.ageInDays += Math.floor(daysSinceLastCheck);
            this.lastAgeCheck = now;

            // Check if evolved
            const newStage = this.calculateStage();
            if (newStage !== this.currentStage) {
                this.evolve(newStage);
            }
        }
    }

    // Calculate which stage pet should be at
    calculateStage() {
        if (this.ageInDays >= 14) return 'adult';
        if (this.ageInDays >= 7) return 'teen';
        if (this.ageInDays >= 3) return 'child';
        return 'baby';
    }

    // Evolve to new stage
    evolve(newStage) {
        this.currentStage = newStage;
        const stage = this.stages[newStage];

        console.log(`Pet evolved to ${stage.name}!`);

        // Check achievement
        if (newStage === 'adult') {
            achievementSystem.checkAchievement('evolved_pet');
        }

        return stage;
    }

    // Get current stage data
    getCurrentStage() {
        return this.stages[this.currentStage];
    }

    // Get size multiplier for rendering
    getSizeMultiplier() {
        return this.stages[this.currentStage].sizeMultiplier;
    }

    // Get stat decay multiplier
    getStatMultiplier() {
        return this.stages[this.currentStage].statMultiplier;
    }

    // Save data
    getSaveData() {
        return {
            currentStage: this.currentStage,
            ageInDays: this.ageInDays,
            lastAgeCheck: this.lastAgeCheck,
        };
    }

    // Load data
    loadFromSave(saveData) {
        if (saveData.evolution) {
            this.currentStage = saveData.evolution.currentStage || 'baby';
            this.ageInDays = saveData.evolution.ageInDays || 0;
            this.lastAgeCheck = saveData.evolution.lastAgeCheck || Date.now();
        }

        // Update age on load
        this.updateAge();
    }
}

// Global evolution system instance
const evolutionSystem = new EvolutionSystem();
