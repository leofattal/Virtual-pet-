// PixelPal - Login Scene (Google Sign-In)

class LoginScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoginScene' });
    }

    async create() {
        // Background
        const bg = this.add.graphics();
        bg.fillStyle(0x2d2d44, 1);
        bg.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Animated gradient background
        this.createAnimatedBackground();

        // Game title
        const title = this.add.text(CONFIG.WIDTH / 2, 150, 'PIXEL PAL', {
            fontSize: '64px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#64b5f6',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(CONFIG.WIDTH / 2, 220, 'Your Virtual Pet Companion', {
            fontSize: CONFIG.FONT.SIZE_LARGE,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        // Cute pet preview
        this.createPetPreview();

        // Loading text while checking auth
        const loadingText = this.add.text(CONFIG.WIDTH / 2, 400, 'Checking authentication...', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#b0b0b0',
        }).setOrigin(0.5);

        // Wait for Supabase auth to initialize
        await supabaseClient.authReady;

        // Check if already logged in
        if (supabaseClient.isAuthenticated()) {
            loadingText.destroy();
            this.showWelcomeBack();
        } else {
            loadingText.destroy();
            this.createLoginButton();
        }

        // Add title animation
        this.tweens.add({
            targets: title,
            y: 140,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        // Fade in
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    createAnimatedBackground() {
        // Create floating particles
        for (let i = 0; i < 20; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(0x64b5f6, 0.3);
            particle.fillCircle(0, 0, 3 + Math.random() * 5);

            particle.x = Math.random() * CONFIG.WIDTH;
            particle.y = Math.random() * CONFIG.HEIGHT;

            this.tweens.add({
                targets: particle,
                y: particle.y + 50 + Math.random() * 100,
                x: particle.x + (Math.random() - 0.5) * 50,
                alpha: 0,
                duration: 3000 + Math.random() * 2000,
                repeat: -1,
                delay: Math.random() * 2000,
            });
        }
    }

    createPetPreview() {
        // Draw a cute preview pet
        const petGraphics = this.add.graphics();

        // Body
        petGraphics.fillStyle(CONFIG.COLORS.PET_BODY, 1);
        petGraphics.fillEllipse(CONFIG.WIDTH / 2, 320, 60, 70);

        // Belly
        petGraphics.fillStyle(CONFIG.COLORS.PET_BELLY, 1);
        petGraphics.fillEllipse(CONFIG.WIDTH / 2, 330, 40, 50);

        // Ears
        petGraphics.fillStyle(CONFIG.COLORS.PET_BODY, 1);
        petGraphics.fillCircle(CONFIG.WIDTH / 2 - 25, 290, 15);
        petGraphics.fillCircle(CONFIG.WIDTH / 2 + 25, 290, 15);

        // Eyes
        petGraphics.fillStyle(CONFIG.COLORS.PET_EYES, 1);
        petGraphics.fillCircle(CONFIG.WIDTH / 2 - 15, 310, 5);
        petGraphics.fillCircle(CONFIG.WIDTH / 2 + 15, 310, 5);

        // Mouth
        petGraphics.lineStyle(2, CONFIG.COLORS.PET_EYES);
        petGraphics.arc(CONFIG.WIDTH / 2, 320, 8, 0, Math.PI, false);

        // Cheeks
        petGraphics.fillStyle(CONFIG.COLORS.PET_CHEEKS, 1);
        petGraphics.fillCircle(CONFIG.WIDTH / 2 - 28, 320, 8);
        petGraphics.fillCircle(CONFIG.WIDTH / 2 + 28, 320, 8);

        // Animate bobbing
        this.tweens.add({
            targets: petGraphics,
            y: -10,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });
    }

    createLoginButton() {
        // Info text
        this.add.text(CONFIG.WIDTH / 2, 400, 'Sign in to save your progress', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#b0b0b0',
        }).setOrigin(0.5);

        // Google Sign-In button
        const btnContainer = this.add.container(CONFIG.WIDTH / 2, 460);

        const btnBg = this.add.graphics();
        btnBg.fillStyle(0xffffff, 1);
        btnBg.fillRect(-140, -25, 280, 50);
        btnBg.lineStyle(3, 0xe0e0e0);
        btnBg.strokeRect(-140, -25, 280, 50);

        const googleIcon = this.add.text(-120, 0, '🔐', {
            fontSize: '24px',
        }).setOrigin(0.5);

        const btnText = this.add.text(0, 0, 'Sign in with Google', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#1a1a2e',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        btnContainer.add([btnBg, googleIcon, btnText]);
        btnContainer.setSize(280, 50);
        btnContainer.setInteractive({ useHandCursor: true });

        btnContainer.on('pointerover', () => {
            btnBg.clear();
            btnBg.fillStyle(0xf5f5f5, 1);
            btnBg.fillRect(-140, -25, 280, 50);
            btnBg.lineStyle(3, 0x64b5f6);
            btnBg.strokeRect(-140, -25, 280, 50);
        });

        btnContainer.on('pointerout', () => {
            btnBg.clear();
            btnBg.fillStyle(0xffffff, 1);
            btnBg.fillRect(-140, -25, 280, 50);
            btnBg.lineStyle(3, 0xe0e0e0);
            btnBg.strokeRect(-140, -25, 280, 50);
        });

        btnContainer.on('pointerdown', async () => {
            soundManager.playClick();

            // Show loading state
            btnText.setText('Signing in...');
            btnContainer.disableInteractive();

            // Trigger Google Sign-In
            const result = await supabaseClient.signInWithGoogle();

            if (!result.success) {
                btnText.setText('Sign in with Google');
                btnContainer.setInteractive({ useHandCursor: true });
                alert('Sign-in failed. Please try again.');
            }
            // If successful, the auth state change will handle the transition
        });

        // "Play Offline" button
        const offlineBtn = this.add.container(CONFIG.WIDTH / 2, 530);

        const offlineBg = this.add.graphics();
        offlineBg.fillStyle(0x5c6bc0, 0.3);
        offlineBg.fillRect(-100, -20, 200, 40);

        const offlineText = this.add.text(0, 0, 'Play Offline', {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        offlineBtn.add([offlineBg, offlineText]);
        offlineBtn.setSize(200, 40);
        offlineBtn.setInteractive({ useHandCursor: true });

        offlineBtn.on('pointerdown', () => {
            soundManager.playClick();
            this.startGame();
        });

        offlineBtn.on('pointerover', () => {
            offlineBg.clear();
            offlineBg.fillStyle(0x5c6bc0, 0.5);
            offlineBg.fillRect(-100, -20, 200, 40);
        });

        offlineBtn.on('pointerout', () => {
            offlineBg.clear();
            offlineBg.fillStyle(0x5c6bc0, 0.3);
            offlineBg.fillRect(-100, -20, 200, 40);
        });
    }

    showWelcomeBack() {
        const user = supabaseClient.getUser();

        this.add.text(CONFIG.WIDTH / 2, 400, `Welcome back, ${user.email}!`, {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#66bb6a',
        }).setOrigin(0.5);

        // Continue button
        const btnContainer = this.add.container(CONFIG.WIDTH / 2, 460);

        const btnBg = this.add.graphics();
        btnBg.fillStyle(0x66bb6a, 1);
        btnBg.fillRect(-100, -25, 200, 50);

        const btnText = this.add.text(0, 0, 'Continue', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        btnContainer.add([btnBg, btnText]);
        btnContainer.setSize(200, 50);
        btnContainer.setInteractive({ useHandCursor: true });

        btnContainer.on('pointerdown', () => {
            soundManager.playClick();
            this.startGame();
        });
    }

    async startGame() {
        // Load data from Supabase if authenticated
        if (supabaseClient.isAuthenticated()) {
            const gameData = await supabaseClient.loadAllData();

            if (gameData) {
                // Convert Supabase data to save format
                const saveData = {
                    pet: {
                        stats: gameData.petStats,
                    },
                    inventory: {
                        coins: gameData.inventory.coins,
                        items: gameData.inventory.items,
                        ownedClothes: gameData.inventory.ownedClothes,
                        ownedToys: gameData.inventory.ownedToys,
                        ownedHouseItems: gameData.inventory.ownedHouseItems,
                    },
                    progress: {
                        highScores: gameData.highScores,
                        totalGamesPlayed: gameData.totalGamesPlayed,
                    }
                };

                // Load saved data
                petStats.loadFromSave(saveData);
                inventory.loadFromSave(saveData);
                window.gameHighScores = gameData.highScores || {};
                window.totalGamesPlayed = gameData.totalGamesPlayed || 0;

                console.log('Loaded game data from Supabase');
            }
        }

        // Fade out and start game
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.time.delayedCall(300, () => {
            // Start boot scene to initialize systems
            this.scene.start(CONFIG.SCENES.BOOT);
        });
    }
}
