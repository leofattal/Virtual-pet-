// PixelPal - Achievement System

class AchievementSystem {
    constructor() {
        this.achievements = {
            // Care achievements
            first_feed: {
                id: 'first_feed',
                name: 'First Meal',
                description: 'Feed your pet for the first time',
                icon: '🍎',
                unlocked: false,
                reward: 10,
            },
            feed_master: {
                id: 'feed_master',
                name: 'Master Chef',
                description: 'Feed your pet 50 times',
                icon: '👨‍🍳',
                unlocked: false,
                reward: 50,
                progress: 0,
                target: 50,
            },
            sleep_tight: {
                id: 'sleep_tight',
                name: 'Sleep Tight',
                description: 'Put your pet to sleep 25 times',
                icon: '😴',
                unlocked: false,
                reward: 30,
                progress: 0,
                target: 25,
            },
            squeaky_clean: {
                id: 'squeaky_clean',
                name: 'Squeaky Clean',
                description: 'Clean your pet 30 times',
                icon: '🛁',
                unlocked: false,
                reward: 40,
                progress: 0,
                target: 30,
            },

            // Level achievements
            level_5: {
                id: 'level_5',
                name: 'Getting Started',
                description: 'Reach level 5',
                icon: '⭐',
                unlocked: false,
                reward: 25,
            },
            level_10: {
                id: 'level_10',
                name: 'Experienced Caretaker',
                description: 'Reach level 10',
                icon: '🌟',
                unlocked: false,
                reward: 50,
            },
            level_20: {
                id: 'level_20',
                name: 'Pet Expert',
                description: 'Reach level 20',
                icon: '💫',
                unlocked: false,
                reward: 100,
            },

            // Shopping achievements
            first_purchase: {
                id: 'first_purchase',
                name: 'First Purchase',
                description: 'Buy something from the shop',
                icon: '🛒',
                unlocked: false,
                reward: 15,
            },
            shopaholic: {
                id: 'shopaholic',
                name: 'Shopaholic',
                description: 'Own 20 different items',
                icon: '🛍️',
                unlocked: false,
                reward: 75,
            },
            fashion_icon: {
                id: 'fashion_icon',
                name: 'Fashion Icon',
                description: 'Own 10 clothing items',
                icon: '👗',
                unlocked: false,
                reward: 60,
            },

            // Happiness achievements
            happy_week: {
                id: 'happy_week',
                name: 'Happy Week',
                description: 'Keep happiness above 70 for 7 days',
                icon: '😊',
                unlocked: false,
                reward: 100,
                progress: 0,
                target: 7,
            },
            max_stats: {
                id: 'max_stats',
                name: 'Perfect Care',
                description: 'Get all stats to 100',
                icon: '💯',
                unlocked: false,
                reward: 50,
            },

            // Mini-game achievements
            arcade_fan: {
                id: 'arcade_fan',
                name: 'Arcade Fan',
                description: 'Play 10 mini-games',
                icon: '🎮',
                unlocked: false,
                reward: 35,
                progress: 0,
                target: 10,
            },
            high_scorer: {
                id: 'high_scorer',
                name: 'High Scorer',
                description: 'Score 1000+ in any mini-game',
                icon: '🏆',
                unlocked: false,
                reward: 80,
            },

            // Coin achievements
            coin_collector: {
                id: 'coin_collector',
                name: 'Coin Collector',
                description: 'Earn 500 total coins',
                icon: '💰',
                unlocked: false,
                reward: 50,
            },
            rich_pet: {
                id: 'rich_pet',
                name: 'Rich Pet',
                description: 'Have 1000 coins at once',
                icon: '💎',
                unlocked: false,
                reward: 100,
            },

            // Time achievements
            loyal_friend: {
                id: 'loyal_friend',
                name: 'Loyal Friend',
                description: 'Play for 7 days (login streak)',
                icon: '💖',
                unlocked: false,
                reward: 150,
            },
            dedicated: {
                id: 'dedicated',
                name: 'Dedicated Caretaker',
                description: 'Play for 30 days (login streak)',
                icon: '👑',
                unlocked: false,
                reward: 500,
            },

            // Special achievements
            house_owner: {
                id: 'house_owner',
                name: 'House Owner',
                description: 'Buy a house upgrade item',
                icon: '🏠',
                unlocked: false,
                reward: 100,
            },
            gardener: {
                id: 'gardener',
                name: 'Green Thumb',
                description: 'Harvest 10 plants from your garden',
                icon: '🌱',
                unlocked: false,
                reward: 75,
                progress: 0,
                target: 10,
            },
            evolved_pet: {
                id: 'evolved_pet',
                name: 'All Grown Up',
                description: 'Reach adult evolution stage',
                icon: '🦋',
                unlocked: false,
                reward: 200,
            },
        };

        this.stats = {
            totalFeeds: 0,
            totalSleeps: 0,
            totalCleans: 0,
            totalMiniGamesPlayed: 0,
            totalCoinsEarned: 0,
            daysWithHighHappiness: 0,
            lastHappinessCheck: null,
            totalPlantsHarvested: 0,
        };

        this.listeners = [];
    }

    // Check and unlock achievement
    checkAchievement(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement || achievement.unlocked) return false;

        let shouldUnlock = false;

        // Check if achievement conditions are met
        if (achievement.target) {
            // Progress-based achievement
            if (achievement.progress >= achievement.target) {
                shouldUnlock = true;
            }
        } else {
            // Instant achievement (will be manually triggered)
            shouldUnlock = true;
        }

        if (shouldUnlock) {
            this.unlockAchievement(achievementId);
            return true;
        }

        return false;
    }

    // Unlock achievement and give reward
    unlockAchievement(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement || achievement.unlocked) return;

        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();

        // Give coin reward
        if (achievement.reward) {
            inventory.addCoins(achievement.reward);
        }

        // Notify listeners (for UI updates)
        this.notifyListeners(achievement);

        console.log(`Achievement unlocked: ${achievement.name} (+${achievement.reward} coins)`);

        return achievement;
    }

    // Record a feed action
    recordFeed() {
        this.stats.totalFeeds++;

        // Check first feed
        if (this.stats.totalFeeds === 1) {
            this.checkAchievement('first_feed');
        }

        // Update feed master progress
        if (this.achievements.feed_master) {
            this.achievements.feed_master.progress = this.stats.totalFeeds;
            this.checkAchievement('feed_master');
        }
    }

    // Record a sleep action
    recordSleep() {
        this.stats.totalSleeps++;

        if (this.achievements.sleep_tight) {
            this.achievements.sleep_tight.progress = this.stats.totalSleeps;
            this.checkAchievement('sleep_tight');
        }
    }

    // Record a clean action
    recordClean() {
        this.stats.totalCleans++;

        if (this.achievements.squeaky_clean) {
            this.achievements.squeaky_clean.progress = this.stats.totalCleans;
            this.checkAchievement('squeaky_clean');
        }
    }

    // Record mini-game played
    recordMiniGame() {
        this.stats.totalMiniGamesPlayed++;

        if (this.achievements.arcade_fan) {
            this.achievements.arcade_fan.progress = this.stats.totalMiniGamesPlayed;
            this.checkAchievement('arcade_fan');
        }
    }

    // Record mini-game score
    recordScore(score) {
        if (score >= 1000) {
            this.checkAchievement('high_scorer');
        }
    }

    // Record harvest
    recordHarvest() {
        this.stats.totalPlantsHarvested++;

        if (this.achievements.gardener) {
            this.achievements.gardener.progress = this.stats.totalPlantsHarvested;
            this.checkAchievement('gardener');
        }
    }

    // Check level achievements
    checkLevelAchievements(level) {
        if (level >= 5) this.checkAchievement('level_5');
        if (level >= 10) this.checkAchievement('level_10');
        if (level >= 20) this.checkAchievement('level_20');
    }

    // Check coin achievements
    checkCoinAchievements(currentCoins, totalEarned) {
        this.stats.totalCoinsEarned = totalEarned;

        if (currentCoins >= 1000) {
            this.checkAchievement('rich_pet');
        }

        if (totalEarned >= 500) {
            this.checkAchievement('coin_collector');
        }
    }

    // Check if all stats are maxed
    checkMaxStats(stats) {
        if (stats.hunger >= 100 && stats.energy >= 100 &&
            stats.happiness >= 100 && stats.cleanliness >= 100) {
            this.checkAchievement('max_stats');
        }
    }

    // Check daily happiness (called once per day)
    checkDailyHappiness(happiness) {
        const today = new Date().toDateString();

        if (this.stats.lastHappinessCheck !== today) {
            this.stats.lastHappinessCheck = today;

            if (happiness >= 70) {
                if (this.achievements.happy_week) {
                    this.achievements.happy_week.progress++;
                    this.checkAchievement('happy_week');
                }
            } else {
                // Reset streak if happiness dropped
                if (this.achievements.happy_week) {
                    this.achievements.happy_week.progress = 0;
                }
            }
        }
    }

    // Get all unlocked achievements
    getUnlockedAchievements() {
        return Object.values(this.achievements).filter(a => a.unlocked);
    }

    // Get locked achievements
    getLockedAchievements() {
        return Object.values(this.achievements).filter(a => !a.unlocked);
    }

    // Get achievement progress percentage
    getProgress() {
        const total = Object.keys(this.achievements).length;
        const unlocked = this.getUnlockedAchievements().length;
        return Math.floor((unlocked / total) * 100);
    }

    // Save achievements
    getSaveData() {
        return {
            achievements: this.achievements,
            stats: this.stats,
        };
    }

    // Load achievements
    loadFromSave(saveData) {
        if (saveData.achievements) {
            // Merge saved achievements with current definitions
            for (const id in saveData.achievements) {
                if (this.achievements[id]) {
                    this.achievements[id].unlocked = saveData.achievements[id].unlocked;
                    this.achievements[id].unlockedAt = saveData.achievements[id].unlockedAt;
                    if (saveData.achievements[id].progress !== undefined) {
                        this.achievements[id].progress = saveData.achievements[id].progress;
                    }
                }
            }
        }

        if (saveData.stats) {
            this.stats = { ...this.stats, ...saveData.stats };
        }
    }

    // Event listener system
    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    notifyListeners(achievement) {
        this.listeners.forEach(callback => callback(achievement));
    }
}

// Global achievement system instance
const achievementSystem = new AchievementSystem();
