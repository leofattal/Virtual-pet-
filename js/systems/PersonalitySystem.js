// PixelPal - Pet Personality System

class PersonalitySystem {
    constructor() {
        this.traits = [];
        this.favoriteFoods = [];
        this.favoriteToys = [];

        // Available personality traits
        this.availableTraits = [
            {
                id: 'energetic',
                name: 'Energetic',
                description: 'Your pet loves to play and stays active!',
                icon: '⚡',
                effects: {
                    playBonus: 1.5, // 50% more happiness from playing
                    energyDecay: 1.2, // Uses energy 20% faster
                },
            },
            {
                id: 'sleepy',
                name: 'Sleepyhead',
                description: 'Your pet loves naps and sleeps deeply',
                icon: '😴',
                effects: {
                    sleepBonus: 1.5, // 50% more energy from sleep
                    energyDecay: 0.8, // Uses energy 20% slower
                },
            },
            {
                id: 'foodie',
                name: 'Foodie',
                description: 'Your pet absolutely loves food!',
                icon: '🍔',
                effects: {
                    foodBonus: 1.5, // 50% more happiness from food
                    hungerDecay: 1.3, // Gets hungry 30% faster
                },
            },
            {
                id: 'neat',
                name: 'Neat Freak',
                description: 'Your pet loves being clean',
                icon: '✨',
                effects: {
                    cleanBonus: 1.5, // 50% more happiness when clean
                    cleanlinessDecay: 1.2, // Gets dirty 20% faster
                },
            },
            {
                id: 'fashionable',
                name: 'Fashionista',
                description: 'Your pet loves dressing up!',
                icon: '👗',
                effects: {
                    outfitBonus: 10, // +10 happiness when wearing outfit
                },
            },
            {
                id: 'curious',
                name: 'Curious',
                description: 'Your pet loves exploring new things',
                icon: '🔍',
                effects: {
                    xpBonus: 1.3, // 30% more XP from actions
                },
            },
            {
                id: 'calm',
                name: 'Calm',
                description: 'Your pet is peaceful and content',
                icon: '😌',
                effects: {
                    happinessDecay: 0.8, // Happiness decreases 20% slower
                },
            },
            {
                id: 'playful',
                name: 'Playful',
                description: 'Your pet loves toys and games',
                icon: '🎮',
                effects: {
                    toyBonus: 1.5, // 50% more happiness from toys
                    minigameBonus: 1.2, // 20% more coins from minigames
                },
            },
        ];
    }

    // Generate random personality (called when creating new pet)
    generatePersonality() {
        // Pick 2-3 random traits
        const numTraits = 2 + Math.floor(Math.random() * 2); // 2 or 3 traits
        const shuffled = [...this.availableTraits].sort(() => Math.random() - 0.5);
        this.traits = shuffled.slice(0, numTraits);

        // Pick favorite foods (3 random)
        const allFoods = Object.keys(ITEMS.food);
        this.favoriteFoods = [];
        for (let i = 0; i < 3; i++) {
            const food = Phaser.Utils.Array.GetRandom(allFoods);
            if (!this.favoriteFoods.includes(food)) {
                this.favoriteFoods.push(food);
            }
        }

        // Pick favorite toys (2 random)
        const allToys = Object.keys(ITEMS.toys);
        this.favoriteToys = [];
        for (let i = 0; i < 2; i++) {
            const toy = Phaser.Utils.Array.GetRandom(allToys);
            if (!this.favoriteToys.includes(toy)) {
                this.favoriteToys.push(toy);
            }
        }

        console.log('Generated personality:', this.traits.map(t => t.name));
        console.log('Favorite foods:', this.favoriteFoods);
        console.log('Favorite toys:', this.favoriteToys);
    }

    // Check if item is favorite
    isFavoriteFood(foodId) {
        return this.favoriteFoods.includes(foodId);
    }

    isFavoriteToy(toyId) {
        return this.favoriteToys.includes(toyId);
    }

    // Get bonus multiplier for food
    getFoodBonus(foodId) {
        let bonus = 1.0;

        // Check if foodie trait
        if (this.hasTrait('foodie')) {
            bonus *= 1.5;
        }

        // Check if favorite food (extra 50% bonus)
        if (this.isFavoriteFood(foodId)) {
            bonus *= 1.5;
        }

        return bonus;
    }

    // Get bonus multiplier for toy
    getToyBonus(toyId) {
        let bonus = 1.0;

        // Check if playful trait
        if (this.hasTrait('playful')) {
            bonus *= 1.5;
        }

        // Check if favorite toy
        if (this.isFavoriteToy(toyId)) {
            bonus *= 1.5;
        }

        return bonus;
    }

    // Get bonus for play activities
    getPlayBonus() {
        return this.hasTrait('energetic') ? 1.5 : 1.0;
    }

    // Get bonus for sleep
    getSleepBonus() {
        return this.hasTrait('sleepy') ? 1.5 : 1.0;
    }

    // Get bonus for cleaning
    getCleanBonus() {
        return this.hasTrait('neat') ? 1.5 : 1.0;
    }

    // Get XP bonus
    getXPBonus() {
        return this.hasTrait('curious') ? 1.3 : 1.0;
    }

    // Get minigame coin bonus
    getMinigameBonus() {
        return this.hasTrait('playful') ? 1.2 : 1.0;
    }

    // Get outfit happiness bonus
    getOutfitBonus() {
        return this.hasTrait('fashionable') ? 10 : 0;
    }

    // Check if has specific trait
    hasTrait(traitId) {
        return this.traits.some(t => t.id === traitId);
    }

    // Get stat decay multipliers
    getDecayMultipliers() {
        return {
            hunger: this.hasTrait('foodie') ? 1.3 : 1.0,
            energy: this.hasTrait('energetic') ? 1.2 : (this.hasTrait('sleepy') ? 0.8 : 1.0),
            happiness: this.hasTrait('calm') ? 0.8 : 1.0,
            cleanliness: this.hasTrait('neat') ? 1.2 : 1.0,
        };
    }

    // Get personality summary text
    getPersonalitySummary() {
        if (this.traits.length === 0) return 'Your pet has a unique personality!';

        const traitNames = this.traits.map(t => t.name).join(', ');
        return `Your pet is: ${traitNames}`;
    }

    // Save personality
    getSaveData() {
        return {
            traits: this.traits.map(t => t.id),
            favoriteFoods: this.favoriteFoods,
            favoriteToys: this.favoriteToys,
        };
    }

    // Load personality
    loadFromSave(saveData) {
        if (saveData.personality) {
            // Restore traits
            if (saveData.personality.traits) {
                this.traits = saveData.personality.traits
                    .map(id => this.availableTraits.find(t => t.id === id))
                    .filter(t => t !== undefined);
            }

            this.favoriteFoods = saveData.personality.favoriteFoods || [];
            this.favoriteToys = saveData.personality.favoriteToys || [];
        } else {
            // First time - generate personality
            this.generatePersonality();
        }
    }
}

// Global personality system instance
const personalitySystem = new PersonalitySystem();
