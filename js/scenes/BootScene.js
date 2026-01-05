// PixelPal - Boot Scene (Asset Loading & Initialization)

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENES.BOOT });
    }

    preload() {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Loading text
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading PixelPal...', {
            fontSize: CONFIG.FONT.SIZE_LARGE,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        // Progress bar background
        const progressBg = this.add.graphics();
        progressBg.fillStyle(0x333333, 1);
        progressBg.fillRect(width / 2 - 150, height / 2, 300, 30);

        // Progress bar fill
        const progressBar = this.add.graphics();

        // Update progress bar
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(CONFIG.COLORS.PRIMARY, 1);
            progressBar.fillRect(width / 2 - 145, height / 2 + 5, 290 * value, 20);
        });

        // Generate all pixel art textures
        this.generateTextures();
    }

    generateTextures() {
        // We'll generate textures programmatically
        // This creates canvas textures that can be used as sprites

        // Pet textures are drawn directly in the Pet class using graphics
        // Here we create some utility textures

        // Button texture
        this.createButtonTexture();

        // Food item textures
        this.createFoodTextures();

        // Background patterns
        this.createBackgroundTextures();
    }

    createButtonTexture() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        // Default button
        graphics.fillStyle(CONFIG.COLORS.PRIMARY, 1);
        graphics.fillRect(0, 0, 100, 40);
        graphics.fillStyle(CONFIG.COLORS.SECONDARY, 1);
        graphics.fillRect(4, 4, 92, 28);

        graphics.generateTexture('button', 100, 40);
        graphics.destroy();
    }

    createFoodTextures() {
        // Apple
        this.createFoodTexture('food_apple', (g) => {
            g.fillStyle(0xe53935, 1);
            g.fillCircle(16, 18, 12);
            g.fillStyle(0x4caf50, 1);
            g.fillRect(14, 2, 4, 8);
            g.fillStyle(0x2e7d32, 1);
            g.fillRect(18, 4, 6, 4);
        });

        // Pizza
        this.createFoodTexture('food_pizza', (g) => {
            g.fillStyle(0xffb74d, 1);
            g.fillTriangle(16, 4, 4, 28, 28, 28);
            g.fillStyle(0xe53935, 1);
            g.fillCircle(12, 18, 4);
            g.fillCircle(20, 20, 3);
            g.fillCircle(16, 24, 3);
        });

        // Candy
        this.createFoodTexture('food_candy', (g) => {
            g.fillStyle(0xf06292, 1);
            g.fillCircle(16, 16, 10);
            g.fillStyle(0xffffff, 0.5);
            g.fillRect(8, 14, 16, 4);
            g.fillStyle(0xf06292, 1);
            g.fillRect(2, 14, 6, 4);
            g.fillRect(24, 14, 6, 4);
        });

        // Soup
        this.createFoodTexture('food_soup', (g) => {
            g.fillStyle(0x8d6e63, 1);
            g.fillRect(4, 12, 24, 16);
            g.fillRect(0, 10, 32, 4);
            g.fillStyle(0xffcc80, 1);
            g.fillRect(6, 14, 20, 10);
            // Steam
            g.fillStyle(0xffffff, 0.5);
            g.fillRect(10, 4, 2, 6);
            g.fillRect(16, 2, 2, 8);
            g.fillRect(22, 4, 2, 6);
        });
    }

    createFoodTexture(key, drawFunc) {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        drawFunc(graphics);
        graphics.generateTexture(key, 32, 32);
        graphics.destroy();
    }

    createBackgroundTextures() {
        // Home background pattern
        const homeBg = this.make.graphics({ x: 0, y: 0, add: false });
        homeBg.fillStyle(CONFIG.COLORS.BG_HOME, 1);
        homeBg.fillRect(0, 0, 32, 32);
        // Add subtle pattern
        homeBg.fillStyle(0x3d3d54, 1);
        homeBg.fillRect(0, 0, 4, 4);
        homeBg.fillRect(16, 16, 4, 4);
        homeBg.generateTexture('bg_home_tile', 32, 32);
        homeBg.destroy();

        // Playground grass pattern
        const grassBg = this.make.graphics({ x: 0, y: 0, add: false });
        grassBg.fillStyle(CONFIG.COLORS.BG_PLAYGROUND, 1);
        grassBg.fillRect(0, 0, 32, 32);
        grassBg.fillStyle(0x5a8751, 1);
        grassBg.fillRect(4, 8, 4, 8);
        grassBg.fillRect(20, 16, 4, 8);
        grassBg.fillRect(12, 24, 4, 6);
        grassBg.generateTexture('bg_grass_tile', 32, 32);
        grassBg.destroy();
    }

    create() {
        // Initialize sound manager
        soundManager.init();

        // Load saved game if exists
        this.loadGame();

        // Start pet stat decay
        petStats.startDecay();

        // Start auto-save system (saves on tab switch, every 30 sec, etc.)
        saveSystem.startAutoSave();

        // Add stat listeners for immediate saves on changes
        petStats.addListener(() => {
            // Auto-save on stat changes
            this.saveGame();
        });

        inventory.addListener(() => {
            // Auto-save on inventory changes
            this.saveGame();
        });

        // Check if this is a new game (no save data)
        const isNewGame = !saveSystem.hasSave();

        // Transition to appropriate scene
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
            if (isNewGame) {
                // New game - go to naming screen
                this.scene.start(CONFIG.SCENES.NAMING);
            } else {
                // Returning player - go to home
                this.scene.start(CONFIG.SCENES.HOME);
            }
        });
    }

    loadGame() {
        const saveData = saveSystem.load();

        console.log('Loading game, save data:', saveData);
        console.log('Current inventory coins before load:', inventory.coins);

        if (saveData) {
            // Load pet stats
            petStats.loadFromSave(saveData);

            // Load inventory
            inventory.loadFromSave(saveData);

            // Load high scores and games played
            if (saveData.progress) {
                window.gameHighScores = saveData.progress.highScores || {};
                window.totalGamesPlayed = saveData.progress.totalGamesPlayed || 0;
                console.log('Loaded high scores:', window.gameHighScores);
            }

            // Apply offline decay
            const offlineEffects = saveSystem.calculateOfflineEffects(saveData);
            if (offlineEffects && offlineEffects.statDecay > 0) {
                petStats.applyOfflineDecay(offlineEffects.statDecay);
                console.log(`Applied ${offlineEffects.statDecay} stat decay for ${offlineEffects.minutesOffline} minutes offline`);
            }

            // Mark that this is a returning player
            this.isReturningPlayer = true;
        } else {
            console.log('No save data found, using fresh start with', inventory.coins, 'coins');
            this.isReturningPlayer = false;
        }

        console.log('Final inventory coins after load:', inventory.coins);
    }

    saveGame() {
        saveSystem.save({
            petStats: petStats,
            inventory: inventory,
            highScores: window.gameHighScores || {},
            totalGamesPlayed: window.totalGamesPlayed || 0,
        });
    }
}
