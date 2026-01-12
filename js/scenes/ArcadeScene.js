// PixelPal - Arcade Scene (Game Selection Hub)

class ArcadeScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENES.ARCADE });
    }

    create() {
        // Check if player owns Gaming Setup
        const hasGamingSetup = inventory.ownedHouseItems && inventory.ownedHouseItems.includes('tvgaming');

        if (!hasGamingSetup) {
            // Show error message and return to home
            const errorText = this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2, '🔒 Purchase Gaming Setup from the Shop first!', {
                fontSize: CONFIG.FONT.SIZE_LARGE,
                fontFamily: CONFIG.FONT.FAMILY,
                color: '#ff5252',
                backgroundColor: '#00000080',
                padding: { x: 20, y: 10 },
            }).setOrigin(0.5);

            soundManager.playError();

            this.time.delayedCall(2000, () => {
                this.scene.start(CONFIG.SCENES.HOME);
            });
            return;
        }

        // Create background
        this.createBackground();

        // Create game selection
        this.createGameCards();

        // Create UI
        this.createUI();

        // Fade in
        this.cameras.main.fadeIn(300, 0, 0, 0);
    }

    createBackground() {
        const bg = this.add.graphics();

        // Dark arcade interior
        bg.fillStyle(CONFIG.COLORS.BG_ARCADE, 1);
        bg.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Neon grid floor effect
        bg.lineStyle(1, 0x4a148c, 0.3);
        for (let x = 0; x < CONFIG.WIDTH; x += 40) {
            bg.lineBetween(x, CONFIG.HEIGHT - 200, x, CONFIG.HEIGHT);
        }
        for (let y = CONFIG.HEIGHT - 200; y < CONFIG.HEIGHT; y += 20) {
            bg.lineBetween(0, y, CONFIG.WIDTH, y);
        }

        // Arcade machines in background (silhouettes)
        bg.fillStyle(0x1a1a3e, 1);
        for (let x = 50; x < CONFIG.WIDTH; x += 200) {
            // Machine body
            bg.fillRect(x, 100, 80, 150);
            bg.fillRect(x - 10, 200, 100, 50);
            // Screen glow
            bg.fillStyle(0x4a148c, 0.3);
            bg.fillRect(x + 10, 110, 60, 50);
            bg.fillStyle(0x1a1a3e, 1);
        }

        // Neon sign
        this.createNeonSign();

        // Decorative lights
        this.createLights();
    }

    createNeonSign() {
        // ARCADE text with glow effect
        const signY = 50;

        // Glow
        const glow = this.add.text(CONFIG.WIDTH / 2, signY, '🕹️ ARCADE 🕹️', {
            fontSize: '36px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#e040fb',
        }).setOrigin(0.5);

        // Add flicker effect
        this.tweens.add({
            targets: glow,
            alpha: 0.7,
            duration: 100,
            yoyo: true,
            repeat: -1,
            repeatDelay: 2000,
        });

        // Subtitle
        this.add.text(CONFIG.WIDTH / 2, signY + 40, 'Play games to earn coins!', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#b388ff',
        }).setOrigin(0.5);
    }

    createLights() {
        // String of lights at top
        const colors = [0xef5350, 0xffeb3b, 0x66bb6a, 0x42a5f5, 0xe040fb];

        for (let x = 30; x < CONFIG.WIDTH; x += 50) {
            const colorIndex = Math.floor((x / 50) % colors.length);

            // Light bulb
            const light = this.add.graphics();
            light.fillStyle(colors[colorIndex], 1);
            light.fillCircle(x, 15, 8);

            // Twinkle effect
            this.tweens.add({
                targets: light,
                alpha: 0.4,
                duration: 500 + Math.random() * 500,
                yoyo: true,
                repeat: -1,
                delay: Math.random() * 1000,
            });
        }
    }

    createGameCards() {
        const games = [
            {
                key: 'flappy',
                name: 'Sky Hop',
                description: 'Tap to fly!\nAvoid the pipes.',
                color: 0x42a5f5,
                icon: '🐦',
                scene: CONFIG.SCENES.FLAPPY,
            },
            {
                key: 'maze',
                name: 'Pellet Munch',
                description: 'Eat all pellets!\nAvoid the ghosts.',
                color: 0xffeb3b,
                icon: '👻',
                scene: CONFIG.SCENES.MAZE,
            },
            {
                key: 'memory',
                name: 'Memory Match',
                description: 'Match the pairs!\nTest your memory.',
                color: 0x9c27b0,
                icon: '🧠',
                scene: CONFIG.SCENES.MEMORY_GAME,
            },
            {
                key: 'clicker',
                name: 'Coin Rush',
                description: 'Click fast!\nEarn coins quickly.',
                color: 0xffca28,
                icon: '💰',
                scene: 'ClickerScene',
            },
        ];

        const cardWidth = 240;
        const cardHeight = 280;
        const spacing = 30;
        const startX = CONFIG.WIDTH / 2 - (games.length * cardWidth + (games.length - 1) * spacing) / 2 + cardWidth / 2;
        const cardY = CONFIG.HEIGHT / 2 + 20;

        games.forEach((game, index) => {
            const x = startX + index * (cardWidth + spacing);
            this.createGameCard(x, cardY, game, cardWidth, cardHeight);
        });
    }

    createGameCard(x, y, game, width, height) {
        const card = this.add.container(x, y);

        // Card background
        const bg = this.add.graphics();
        bg.fillStyle(0x2d2d4a, 1);
        bg.fillRect(-width/2, -height/2, width, height);
        bg.lineStyle(4, game.color);
        bg.strokeRect(-width/2, -height/2, width, height);
        card.add(bg);

        // Game icon
        const icon = this.add.text(0, -height/2 + 60, game.icon, {
            fontSize: '64px',
        }).setOrigin(0.5);
        card.add(icon);

        // Game name
        const name = this.add.text(0, -height/2 + 130, game.name, {
            fontSize: CONFIG.FONT.SIZE_LARGE,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);
        card.add(name);

        // Description
        const desc = this.add.text(0, -height/2 + 180, game.description, {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#b0b0b0',
            align: 'center',
        }).setOrigin(0.5);
        card.add(desc);

        // High score
        const highScore = window.gameHighScores?.[game.key] || 0;
        const scoreText = this.add.text(0, -height/2 + 230, `High Score: ${highScore}`, {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffca28',
        }).setOrigin(0.5);
        card.add(scoreText);

        // Play button
        const playBtn = this.add.container(0, height/2 - 50);

        const btnBg = this.add.graphics();
        btnBg.fillStyle(game.color, 1);
        btnBg.fillRect(-60, -20, 120, 40);

        const btnText = this.add.text(0, 0, '▶ PLAY', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#1a1a2e',
        }).setOrigin(0.5);

        playBtn.add([btnBg, btnText]);
        playBtn.setSize(120, 40);
        playBtn.setInteractive({ useHandCursor: true });

        playBtn.on('pointerover', () => {
            if (!btnBg || !btnBg.scene) return;
            btnBg.clear();
            btnBg.fillStyle(0xffffff, 1);
            btnBg.fillRect(-60, -20, 120, 40);
        });

        playBtn.on('pointerout', () => {
            if (!btnBg || !btnBg.scene) return;
            btnBg.clear();
            btnBg.fillStyle(game.color, 1);
            btnBg.fillRect(-60, -20, 120, 40);
        });

        playBtn.on('pointerdown', () => {
            soundManager.playClick();
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start(game.scene);
            });
        });

        card.add(playBtn);

        // Hover effect on whole card
        card.setSize(width, height);
        card.setInteractive();

        card.on('pointerover', () => {
            this.tweens.add({
                targets: card,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 200,
            });
        });

        card.on('pointerout', () => {
            this.tweens.add({
                targets: card,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
            });
        });
    }

    createUI() {
        // Coin display
        const coinDisplay = this.add.container(CONFIG.WIDTH - 100, 30);

        const coinBg = this.add.graphics();
        coinBg.fillStyle(0x000000, 0.5);
        coinBg.fillRect(-60, -15, 120, 30);
        coinDisplay.add(coinBg);

        const coinIcon = this.add.graphics();
        coinIcon.fillStyle(CONFIG.COLORS.ACCENT, 1);
        coinIcon.fillCircle(-35, 0, 10);
        coinDisplay.add(coinIcon);

        const coinText = this.add.text(10, 0, `${inventory.coins}`, {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffca28',
        }).setOrigin(0.5);
        coinDisplay.add(coinText);

        // Back button
        const backBtn = this.add.container(70, CONFIG.HEIGHT - 40);

        const btnBg = this.add.graphics();
        btnBg.fillStyle(CONFIG.COLORS.PRIMARY, 1);
        btnBg.fillRect(-50, -20, 100, 40);

        const btnText = this.add.text(0, 0, '← Back', {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        backBtn.add([btnBg, btnText]);
        backBtn.setSize(100, 40);
        backBtn.setInteractive({ useHandCursor: true });

        backBtn.on('pointerdown', () => {
            soundManager.playClick();
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start(CONFIG.SCENES.HOME);
            });
        });
    }
}
