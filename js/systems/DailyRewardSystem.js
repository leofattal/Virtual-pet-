// PixelPal - Daily Reward & Streak System

class DailyRewardSystem {
    constructor() {
        this.lastLoginDate = null;
        this.currentStreak = 0;
        this.longestStreak = 0;
        this.totalLoginDays = 0;
        this.hasClaimedToday = false;

        // Daily reward tiers (increases with streak)
        this.rewardTiers = [
            { day: 1, coins: 10, bonus: null },
            { day: 2, coins: 15, bonus: null },
            { day: 3, coins: 20, bonus: { item: 'apple', qty: 1 } },
            { day: 4, coins: 25, bonus: null },
            { day: 5, coins: 30, bonus: { item: 'cookie', qty: 2 } },
            { day: 6, coins: 35, bonus: null },
            { day: 7, coins: 50, bonus: { item: 'cake', qty: 1, extraCoins: 20 } },
            { day: 8, coins: 60, bonus: null },
            { day: 9, coins: 70, bonus: null },
            { day: 10, coins: 80, bonus: { item: 'sushi', qty: 2 } },
            { day: 11, coins: 90, bonus: null },
            { day: 12, coins: 100, bonus: null },
            { day: 13, coins: 110, bonus: null },
            { day: 14, coins: 150, bonus: { item: 'pizza', qty: 3, extraCoins: 50 } },
        ];

        this.listeners = [];
    }

    // Check if it's a new day and update streak
    checkDailyLogin() {
        const today = this.getTodayString();
        const yesterday = this.getYesterdayString();

        // First time playing
        if (!this.lastLoginDate) {
            this.lastLoginDate = today;
            this.currentStreak = 1;
            this.totalLoginDays = 1;
            this.hasClaimedToday = false;
            return { isNewDay: true, streakBroken: false };
        }

        // Already logged in today
        if (this.lastLoginDate === today) {
            return { isNewDay: false, streakBroken: false };
        }

        // New day - check if streak continues
        if (this.lastLoginDate === yesterday) {
            // Streak continues!
            this.currentStreak++;
            this.totalLoginDays++;
        } else {
            // Streak broken :(
            this.currentStreak = 1;
            this.totalLoginDays++;
        }

        // Update longest streak
        if (this.currentStreak > this.longestStreak) {
            this.longestStreak = this.currentStreak;
        }

        // Check login streak achievements
        if (this.currentStreak >= 7) {
            achievementSystem.checkAchievement('loyal_friend');
        }
        if (this.currentStreak >= 30) {
            achievementSystem.checkAchievement('dedicated');
        }

        this.lastLoginDate = today;
        this.hasClaimedToday = false;

        return { isNewDay: true, streakBroken: this.currentStreak === 1 };
    }

    // Claim today's reward
    claimDailyReward() {
        if (this.hasClaimedToday) {
            return null;
        }

        const streakDay = ((this.currentStreak - 1) % this.rewardTiers.length) + 1;
        const reward = this.rewardTiers[streakDay - 1];

        // Give coins
        inventory.addCoins(reward.coins);

        let totalCoins = reward.coins;
        const items = [];

        // Give bonus items
        if (reward.bonus) {
            if (reward.bonus.item) {
                inventory.addItem(reward.bonus.item, reward.bonus.qty || 1);
                items.push({ id: reward.bonus.item, qty: reward.bonus.qty || 1 });
            }
            if (reward.bonus.extraCoins) {
                inventory.addCoins(reward.bonus.extraCoins);
                totalCoins += reward.bonus.extraCoins;
            }
        }

        this.hasClaimedToday = true;

        const claimedReward = {
            day: streakDay,
            currentStreak: this.currentStreak,
            coins: totalCoins,
            items: items,
        };

        this.notifyListeners(claimedReward);

        return claimedReward;
    }

    // Can claim reward today?
    canClaimToday() {
        return !this.hasClaimedToday;
    }

    // Get current reward preview
    getTodayReward() {
        const streakDay = ((this.currentStreak - 1) % this.rewardTiers.length) + 1;
        return this.rewardTiers[streakDay - 1];
    }

    // Get upcoming rewards preview
    getUpcomingRewards(count = 7) {
        const upcoming = [];
        for (let i = 0; i < count; i++) {
            const day = ((this.currentStreak + i - 1) % this.rewardTiers.length) + 1;
            upcoming.push({
                dayOffset: i,
                reward: this.rewardTiers[day - 1],
            });
        }
        return upcoming;
    }

    // Helper: Get today's date as string
    getTodayString() {
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }

    // Helper: Get yesterday's date as string
    getYesterdayString() {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }

    // Save data
    getSaveData() {
        return {
            lastLoginDate: this.lastLoginDate,
            currentStreak: this.currentStreak,
            longestStreak: this.longestStreak,
            totalLoginDays: this.totalLoginDays,
            hasClaimedToday: this.hasClaimedToday,
        };
    }

    // Load data
    loadFromSave(saveData) {
        if (saveData.dailyRewards) {
            this.lastLoginDate = saveData.dailyRewards.lastLoginDate || null;
            this.currentStreak = saveData.dailyRewards.currentStreak || 0;
            this.longestStreak = saveData.dailyRewards.longestStreak || 0;
            this.totalLoginDays = saveData.dailyRewards.totalLoginDays || 0;
            this.hasClaimedToday = saveData.dailyRewards.hasClaimedToday || false;
        }
    }

    // Event listeners
    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    notifyListeners(reward) {
        this.listeners.forEach(callback => callback(reward));
    }
}

// Global daily reward system instance
const dailyRewardSystem = new DailyRewardSystem();
