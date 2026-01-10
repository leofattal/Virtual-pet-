// PixelPal - Main Game Entry Point

// Wait for DOM to load
window.addEventListener('load', () => {
    // Initialize global game state
    window.gameHighScores = {};
    window.totalGamesPlayed = 0;

    // Phaser game configuration
    const config = {
        type: Phaser.AUTO,
        width: CONFIG.WIDTH,
        height: CONFIG.HEIGHT,
        parent: 'game-container',
        backgroundColor: CONFIG.COLORS.BG_HOME,
        pixelArt: true,
        roundPixels: true,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            min: {
                width: 400,
                height: 300,
            },
            max: {
                width: 1600,
                height: 1200,
            },
        },
        scene: [
            LoginScene,
            BootScene,
            NamingScene,
            HomeScene,
            KitchenScene,
            BedroomScene,
            ClosetScene,
            PlaygroundScene,
            ArcadeScene,
            FlappyScene,
            MazeScene,
            ClickerScene,
            ShopScene,
            BathroomScene,
            FuneralScene,
            WorkScene,
        ],
    };

    // Create game instance
    const game = new Phaser.Game(config);

    // Handle visibility change (pause/resume)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Game is hidden, save state
            saveSystem.save({
                petStats: petStats,
                inventory: inventory,
                highScores: window.gameHighScores,
                totalGamesPlayed: window.totalGamesPlayed,
            });
        }
    });

    // Handle before unload (save on close)
    window.addEventListener('beforeunload', () => {
        saveSystem.save({
            petStats: petStats,
            inventory: inventory,
            highScores: window.gameHighScores,
            totalGamesPlayed: window.totalGamesPlayed,
        });
    });

    // Debug: Expose game to console
    window.pixelPalGame = game;
    window.pixelPalDebug = {
        addCoins: (amount) => {
            inventory.addCoins(amount);
            console.log(`Added ${amount} coins. Total: ${inventory.coins}`);
        },
        setStats: (hunger, energy, happiness, cleanliness) => {
            petStats.hunger = hunger ?? petStats.hunger;
            petStats.energy = energy ?? petStats.energy;
            petStats.happiness = happiness ?? petStats.happiness;
            petStats.cleanliness = cleanliness ?? petStats.cleanliness;
            petStats.notifyListeners();
            console.log('Stats updated:', petStats.getAll());
        },
        resetSave: () => {
            saveSystem.deleteSave();
            location.reload();
        },
        unlockAllClothes: () => {
            Object.values(ITEMS.clothes).forEach(item => {
                if (!inventory.ownedClothes.includes(item.id)) {
                    inventory.ownedClothes.push(item.id);
                }
            });
            console.log('All clothes unlocked!');
        },
        giveFood: () => {
            Object.values(ITEMS.food).forEach(item => {
                inventory.addItem(item.id, 5);
            });
            console.log('Added 5 of each food item!');
        },
    };

    console.log('%c🎮 PixelPal Loaded!', 'color: #64b5f6; font-size: 20px; font-weight: bold;');
    console.log('%cDebug commands available via window.pixelPalDebug', 'color: #b0b0b0;');
});
