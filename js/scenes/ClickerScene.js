// PixelPal - Clicker Game (Coin Rush)

class ClickerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ClickerScene' });
    }

    create() {
        this.score = 0;
        this.timeLeft = 15; // 15 seconds
        this.gameOver = false;

        // Background
        this.cameras.main.setBackgroundColor(0x1a1a2e);

        // Title
        this.add.text(CONFIG.WIDTH / 2, 40, 'COIN RUSH', {
            fontSize: '32px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffca28',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        // Instructions
        this.add.text(CONFIG.WIDTH / 2, 85, 'Click the coins as fast as you can!', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        // Timer display
        this.timerText = this.add.text(CONFIG.WIDTH / 2, 130, `Time: ${this.timeLeft}s`, {
            fontSize: CONFIG.FONT.SIZE_LARGE,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        // Score display
        this.scoreText = this.add.text(CONFIG.WIDTH / 2, 170, `Coins: ${this.score}`, {
            fontSize: CONFIG.FONT.SIZE_LARGE,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffca28',
        }).setOrigin(0.5);

        // Create clickable area
        this.createClickArea();

        // Start timer
        this.startTimer();

        // Fade in
        this.cameras.main.fadeIn(300, 0, 0, 0);
    }

    createClickArea() {
        // Create a grid of coins that appear and disappear
        this.coins = [];

        for (let i = 0; i < 12; i++) {
            const coin = this.createCoin();
            this.coins.push(coin);
            this.repositionCoin(coin);
        }
    }

    createCoin() {
        const container = this.add.container(0, 0);

        // Coin graphic
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffca28, 1);
        graphics.fillCircle(0, 0, 25);
        graphics.fillStyle(0xffa000, 1);
        graphics.fillCircle(0, 0, 18);
        graphics.lineStyle(3, 0xffd54f);
        graphics.strokeCircle(0, 0, 25);

        container.add(graphics);

        // Make interactive
        container.setSize(50, 50);
        container.setInteractive({ useHandCursor: true });

        container.on('pointerdown', () => {
            if (this.gameOver) return;
            this.clickCoin(container);
        });

        return container;
    }

    repositionCoin(coin) {
        // Random position in the play area
        const padding = 60;
        coin.x = padding + Math.random() * (CONFIG.WIDTH - padding * 2);
        coin.y = 220 + Math.random() * (CONFIG.HEIGHT - 280);

        // Scale variation
        const scale = 0.8 + Math.random() * 0.4;
        coin.setScale(scale);

        // Show with animation
        coin.setAlpha(0);
        this.tweens.add({
            targets: coin,
            alpha: 1,
            scale: scale,
            duration: 200,
            ease: 'Back.easeOut',
        });
    }

    clickCoin(coin) {
        soundManager.playClick();
        this.score++;
        this.scoreText.setText(`Coins: ${this.score}`);

        // Particle effect
        this.createClickParticles(coin.x, coin.y);

        // Reposition coin
        this.repositionCoin(coin);
    }

    createClickParticles(x, y) {
        // Create sparkle effect
        for (let i = 0; i < 5; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(0xffeb3b, 1);
            particle.fillCircle(0, 0, 4);
            particle.x = x;
            particle.y = y;

            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 100;

            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: 0,
                duration: 500,
                onComplete: () => particle.destroy(),
            });
        }
    }

    startTimer() {
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timeLeft--;
                this.timerText.setText(`Time: ${this.timeLeft}s`);

                if (this.timeLeft === 0) {
                    this.endGame();
                }
            },
            repeat: this.timeLeft - 1,
        });
    }

    endGame() {
        this.gameOver = true;

        // Hide all coins
        this.coins.forEach(coin => {
            this.tweens.add({
                targets: coin,
                alpha: 0,
                duration: 300,
            });
        });

        // Calculate reward (1 coin per click)
        const coinReward = this.score;
        inventory.addCoins(coinReward);

        // Check and update high score
        const previousHigh = window.gameHighScores['clicker'] || 0;
        const isNewRecord = this.score > previousHigh;

        if (isNewRecord) {
            window.gameHighScores['clicker'] = this.score;
        }

        window.totalGamesPlayed++;

        // Save progress
        saveSystem.save({
            petStats: petStats,
            inventory: inventory,
            highScores: window.gameHighScores,
            totalGamesPlayed: window.totalGamesPlayed,
        });

        // Show results
        this.time.delayedCall(500, () => {
            this.showResults(coinReward, isNewRecord);
        });
    }

    showResults(coinReward, isNewRecord) {
        // Results panel
        const panel = this.add.graphics();
        panel.fillStyle(0x000000, 0.9);
        panel.fillRect(CONFIG.WIDTH / 2 - 200, CONFIG.HEIGHT / 2 - 150, 400, 300);
        panel.lineStyle(4, 0xffca28);
        panel.strokeRect(CONFIG.WIDTH / 2 - 200, CONFIG.HEIGHT / 2 - 150, 400, 300);

        // Title
        this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 - 100, 'GAME OVER', {
            fontSize: '28px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        // Score
        this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 - 50, `Clicks: ${this.score}`, {
            fontSize: CONFIG.FONT.SIZE_LARGE,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffca28',
        }).setOrigin(0.5);

        // Reward
        this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2, `💰 Earned: ${coinReward} coins`, {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#66bb6a',
        }).setOrigin(0.5);

        // New record
        if (isNewRecord) {
            this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 + 40, '🏆 NEW RECORD!', {
                fontSize: CONFIG.FONT.SIZE_MEDIUM,
                fontFamily: CONFIG.FONT.FAMILY,
                color: '#ffd700',
                fontStyle: 'bold',
            }).setOrigin(0.5);
        }

        // Buttons
        this.createResultButtons();
    }

    createResultButtons() {
        // Play Again button
        const playAgainBtn = this.add.container(CONFIG.WIDTH / 2 - 90, CONFIG.HEIGHT / 2 + 100);

        const playBg = this.add.graphics();
        playBg.fillStyle(0x66bb6a, 1);
        playBg.fillRect(-70, -20, 140, 40);

        const playText = this.add.text(0, 0, 'Play Again', {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        playAgainBtn.add([playBg, playText]);
        playAgainBtn.setSize(140, 40);
        playAgainBtn.setInteractive({ useHandCursor: true });

        playAgainBtn.on('pointerdown', () => {
            soundManager.playClick();
            this.scene.restart();
        });

        // Back button
        const backBtn = this.add.container(CONFIG.WIDTH / 2 + 90, CONFIG.HEIGHT / 2 + 100);

        const backBg = this.add.graphics();
        backBg.fillStyle(0x5c6bc0, 1);
        backBg.fillRect(-70, -20, 140, 40);

        const backText = this.add.text(0, 0, 'Arcade', {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        backBtn.add([backBg, backText]);
        backBtn.setSize(140, 40);
        backBtn.setInteractive({ useHandCursor: true });

        backBtn.on('pointerdown', () => {
            soundManager.playClick();
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start(CONFIG.SCENES.ARCADE);
            });
        });
    }
}
