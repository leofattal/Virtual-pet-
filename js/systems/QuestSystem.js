// PixelPal - Daily Quest System

class QuestSystem {
    constructor() {
        this.dailyQuests = [];
        this.lastQuestDate = null;

        // Quest templates
        this.questTemplates = [
            {
                id: 'feed_3',
                type: 'feed',
                name: 'Meal Time',
                description: 'Feed your pet 3 times',
                target: 3,
                reward: 20,
                icon: '🍎',
            },
            {
                id: 'sleep_2',
                type: 'sleep',
                name: 'Rest Well',
                description: 'Put your pet to sleep 2 times',
                target: 2,
                reward: 15,
                icon: '😴',
            },
            {
                id: 'clean_2',
                type: 'clean',
                name: 'Hygiene Matters',
                description: 'Clean your pet 2 times',
                target: 2,
                reward: 15,
                icon: '🛁',
            },
            {
                id: 'play_minigame_2',
                type: 'minigame',
                name: 'Game Time',
                description: 'Play 2 mini-games',
                target: 2,
                reward: 25,
                icon: '🎮',
            },
            {
                id: 'earn_50_coins',
                type: 'coins',
                name: 'Coin Collector',
                description: 'Earn 50 coins',
                target: 50,
                reward: 30,
                icon: '💰',
            },
            {
                id: 'max_happiness',
                type: 'stat',
                name: 'Happy Pet',
                description: 'Get happiness to 100',
                target: 100,
                statName: 'happiness',
                reward: 25,
                icon: '😊',
            },
            {
                id: 'all_stats_50',
                type: 'allstats',
                name: 'Well Balanced',
                description: 'Get all stats above 50',
                target: 50,
                reward: 40,
                icon: '💯',
            },
            {
                id: 'buy_item',
                type: 'shop',
                name: 'Shopping Spree',
                description: 'Buy something from the shop',
                target: 1,
                reward: 15,
                icon: '🛍️',
            },
            {
                id: 'use_toy',
                type: 'toy',
                name: 'Playtime',
                description: 'Use a toy',
                target: 1,
                reward: 10,
                icon: '🎾',
            },
            {
                id: 'change_outfit',
                type: 'outfit',
                name: 'Fashion Show',
                description: 'Change your pet\'s outfit',
                target: 1,
                reward: 10,
                icon: '👗',
            },
        ];

        this.listeners = [];
    }

    // Generate 3 random daily quests
    generateDailyQuests() {
        const today = this.getTodayString();

        // Already generated quests for today
        if (this.lastQuestDate === today && this.dailyQuests.length > 0) {
            return this.dailyQuests;
        }

        // Generate new quests
        this.dailyQuests = [];
        this.lastQuestDate = today;

        // Shuffle templates and pick 3
        const shuffled = [...this.questTemplates].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 3);

        this.dailyQuests = selected.map(template => ({
            ...template,
            progress: 0,
            completed: false,
            claimed: false,
        }));

        return this.dailyQuests;
    }

    // Update quest progress
    updateQuest(type, amount = 1, extraData = null) {
        let updated = false;

        this.dailyQuests.forEach(quest => {
            if (quest.completed) return;

            if (quest.type === type) {
                quest.progress += amount;

                if (quest.progress >= quest.target) {
                    quest.progress = quest.target;
                    quest.completed = true;
                    updated = true;
                }
            }

            // Special handling for stat quests
            if (quest.type === 'stat' && type === 'stat_check' && extraData) {
                if (extraData[quest.statName] >= quest.target) {
                    quest.progress = quest.target;
                    quest.completed = true;
                    updated = true;
                }
            }

            // All stats quest
            if (quest.type === 'allstats' && type === 'stat_check' && extraData) {
                const allAbove = Object.values(extraData).every(val => val >= quest.target);
                if (allAbove) {
                    quest.progress = quest.target;
                    quest.completed = true;
                    updated = true;
                }
            }
        });

        if (updated) {
            this.notifyListeners();
        }
    }

    // Claim quest reward
    claimQuest(questId) {
        const quest = this.dailyQuests.find(q => q.id === questId);

        if (!quest || !quest.completed || quest.claimed) {
            return null;
        }

        // Give reward
        inventory.addCoins(quest.reward);
        quest.claimed = true;

        this.notifyListeners();

        return { coins: quest.reward };
    }

    // Check if all quests are completed
    allQuestsCompleted() {
        return this.dailyQuests.length > 0 &&
               this.dailyQuests.every(q => q.completed);
    }

    // Get unclaimed completed quests
    getUnclaimedQuests() {
        return this.dailyQuests.filter(q => q.completed && !q.claimed);
    }

    // Get active (not completed) quests
    getActiveQuests() {
        return this.dailyQuests.filter(q => !q.completed);
    }

    // Helper: Get today's date as string
    getTodayString() {
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }

    // Save data
    getSaveData() {
        return {
            dailyQuests: this.dailyQuests,
            lastQuestDate: this.lastQuestDate,
        };
    }

    // Load data
    loadFromSave(saveData) {
        if (saveData.quests) {
            this.dailyQuests = saveData.quests.dailyQuests || [];
            this.lastQuestDate = saveData.quests.lastQuestDate || null;
        }

        // Generate quests if it's a new day
        this.generateDailyQuests();
    }

    // Event listeners
    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback());
    }
}

// Global quest system instance
const questSystem = new QuestSystem();
