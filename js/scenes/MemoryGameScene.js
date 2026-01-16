// PixelPal - Memory Card Matching Game

class MemoryGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MemoryGame' });
    }

    create() {
        this.score = 0;
        this.moves = 0;
        this.matchesFound = 0;
        this.totalPairs = 8;
        this.firstCard = null;
        this.secondCard = null;
        this.canFlip = true;
        this.gameStartTime = Date.now();

        // Create background
        this.createBackground();

        // Title
        this.add.text(CONFIG.WIDTH / 2, 30, '🧠 Memory Match', {
            fontSize: CONFIG.FONT.SIZE_LARGE,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        // Score display
        this.scoreText = this.add.text(CONFIG.WIDTH / 2, 60, 'Moves: 0 | Matches: 0/8', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        // Create card grid
        this.createCardGrid();

        // Back button
        this.createBackButton();

        // Fade in
        this.cameras.main.fadeIn(300, 0, 0, 0);
    }

    createBackground() {
        const bg = this.add.graphics();
        bg.fillStyle(0x2d3561, 1);
        bg.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Decorative pattern
        for (let i = 0; i < 20; i++) {
            bg.fillStyle(0x3d4571, 0.3);
            bg.fillCircle(
                Math.random() * CONFIG.WIDTH,
                Math.random() * CONFIG.HEIGHT,
                10 + Math.random() * 20
            );
        }
    }

    createCardGrid() {
        // Card symbols (emoji pairs)
        const symbols = ['🍎', '🌟', '🎮', '🎨', '🎵', '🏆', '🎁', '💎'];

        // Create pairs
        const cards = [];
        symbols.forEach(symbol => {
            cards.push({ symbol, id: Math.random() });
            cards.push({ symbol, id: Math.random() });
        });

        // Shuffle
        Phaser.Utils.Array.Shuffle(cards);

        // Grid layout (4x4)
        const cols = 4;
        const rows = 4;
        const cardWidth = 80;
        const cardHeight = 100;
        const spacing = 15;
        const startX = (CONFIG.WIDTH - (cols * cardWidth + (cols - 1) * spacing)) / 2;
        const startY = 110;

        this.cards = [];

        cards.forEach((cardData, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = startX + col * (cardWidth + spacing);
            const y = startY + row * (cardHeight + spacing);

            const card = this.createCard(x, y, cardWidth, cardHeight, cardData.symbol, cardData.id);
            this.cards.push(card);
        });
    }

    createCard(x, y, width, height, symbol, id) {
        const container = this.add.container(x, y);

        // Card back
        const back = this.add.graphics();
        back.fillStyle(0x5c6bc0, 1);
        back.fillRoundedRect(0, 0, width, height, 8);
        back.lineStyle(3, 0x7986cb, 1);
        back.strokeRoundedRect(0, 0, width, height, 8);

        // Pattern on back
        back.fillStyle(0x7986cb, 1);
        for (let i = 0; i < 3; i++) {
            back.fillCircle(width / 2, 20 + i * 30, 8);
        }

        // Card front
        const front = this.add.graphics();
        front.fillStyle(0xffffff, 1);
        front.fillRoundedRect(0, 0, width, height, 8);
        front.lineStyle(3, 0xe0e0e0, 1);
        front.strokeRoundedRect(0, 0, width, height, 8);

        // Symbol
        const symbolText = this.add.text(width / 2, height / 2, symbol, {
            fontSize: '40px',
        }).setOrigin(0.5);

        container.add([back, front, symbolText]);

        // Hide front initially
        front.setVisible(false);
        symbolText.setVisible(false);

        // Card data
        container.setData('symbol', symbol);
        container.setData('id', id);
        container.setData('flipped', false);
        container.setData('matched', false);
        container.setData('back', back);
        container.setData('front', front);
        container.setData('symbolText', symbolText);

        // Make interactive
        container.setSize(width, height);
        container.setInteractive({ useHandCursor: true });

        container.on('pointerdown', () => {
            this.flipCard(container);
        });

        return container;
    }

    flipCard(card) {
        if (!this.canFlip) return;
        if (card.getData('flipped')) return;
        if (card.getData('matched')) return;

        // Flip animation
        card.getData('back').setVisible(false);
        card.getData('front').setVisible(true);
        card.getData('symbolText').setVisible(true);
        card.setData('flipped', true);

        soundManager.playClick();

        // Check for match
        if (!this.firstCard) {
            this.firstCard = card;
        } else if (!this.secondCard) {
            this.secondCard = card;
            this.moves++;
            this.updateScoreDisplay();

            // Check if cards match
            this.canFlip = false;

            this.time.delayedCall(600, () => {
                this.checkMatch();
            });
        }
    }

    checkMatch() {
        const symbol1 = this.firstCard.getData('symbol');
        const symbol2 = this.secondCard.getData('symbol');
        const id1 = this.firstCard.getData('id');
        const id2 = this.secondCard.getData('id');

        if (symbol1 === symbol2 && id1 !== id2) {
            // Match!
            this.firstCard.setData('matched', true);
            this.secondCard.setData('matched', true);

            // Visual feedback
            this.tweens.add({
                targets: [this.firstCard, this.secondCard],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
                yoyo: true,
            });

            this.matchesFound++;
            this.score += 100;
            this.updateScoreDisplay();

            soundManager.playLevelUp();

            // Check if game complete
            if (this.matchesFound >= this.totalPairs) {
                this.time.delayedCall(800, () => {
                    this.gameComplete();
                });
            }
        } else {
            // No match - flip back
            this.time.delayedCall(300, () => {
                this.firstCard.getData('back').setVisible(true);
                this.firstCard.getData('front').setVisible(false);
                this.firstCard.getData('symbolText').setVisible(false);
                this.firstCard.setData('flipped', false);

                this.secondCard.getData('back').setVisible(true);
                this.secondCard.getData('front').setVisible(false);
                this.secondCard.getData('symbolText').setVisible(false);
                this.secondCard.setData('flipped', false);
            });
        }

        this.firstCard = null;
        this.secondCard = null;
        this.canFlip = true;
    }

    updateScoreDisplay() {
        this.scoreText.setText(`Moves: ${this.moves} | Matches: ${this.matchesFound}/${this.totalPairs}`);
    }

    gameComplete() {
        const timeTaken = Math.floor((Date.now() - this.gameStartTime) / 1000);

        // Calculate bonus based on moves (fewer moves = better)
        let bonus = Math.max(0, 200 - this.moves * 10);
        const totalScore = this.score + bonus;

        // Award coins
        const coins = Math.floor(totalScore / 10);
        inventory.addCoins(coins);

        // Record achievement
        achievementSystem.recordMiniGame();
        achievementSystem.recordScore(totalScore);

        // Show completion screen
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.8);
        overlay.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
        overlay.setDepth(100);

        const container = this.add.container(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2);
        container.setDepth(101);

        const box = this.add.graphics();
        box.fillStyle(0x2d3561, 1);
        box.fillRoundedRect(-150, -120, 300, 240, 10);
        box.lineStyle(4, 0x5c6bc0, 1);
        box.strokeRoundedRect(-150, -120, 300, 240, 10);
        container.add(box);

        const titleText = this.add.text(0, -80, '🎉 Perfect Match!', {
            fontSize: CONFIG.FONT.SIZE_LARGE,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffd700',
        }).setOrigin(0.5);
        container.add(titleText);

        const statsText = this.add.text(0, -30,
            `Moves: ${this.moves}\nTime: ${timeTaken}s\nScore: ${totalScore}\n+${coins} coins`, {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            align: 'center',
        }).setOrigin(0.5);
        container.add(statsText);

        // Play again button
        const playAgainBtn = this.createButton(0, 60, '🔄 Play Again', () => {
            this.scene.restart();
        });
        container.add(playAgainBtn);

        // Back to arcade button
        const backBtn = this.createButton(0, 100, '← Back to Arcade', () => {
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start(CONFIG.SCENES.ARCADE);
            });
        });
        container.add(backBtn);
    }

    createButton(x, y, text, callback) {
        const container = this.add.container(x, y);

        const bg = this.add.graphics();
        bg.fillStyle(0x5c6bc0, 1);
        bg.fillRoundedRect(-80, -18, 160, 36, 8);

        const label = this.add.text(0, 0, text, {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        container.add([bg, label]);
        container.setSize(160, 36);
        container.setInteractive({ useHandCursor: true });

        container.on('pointerdown', () => {
            soundManager.playClick();
            callback();
        });

        return container;
    }

    createBackButton() {
        const buttonX = CONFIG.WIDTH / 2;
        const buttonY = CONFIG.HEIGHT - 32.5;
        const buttonWidth = 120;
        const buttonHeight = 35;

        const button = this.add.graphics();
        button.fillStyle(CONFIG.COLORS.PRIMARY, 1);
        button.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 8);
        button.setPosition(buttonX, buttonY);

        this.add.text(buttonX, buttonY, '← Back', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        // Use a zone for reliable hit detection
        const hitZone = this.add.zone(buttonX, buttonY, buttonWidth, buttonHeight);
        hitZone.setInteractive({ useHandCursor: true });

        hitZone.on('pointerover', () => {
            button.clear();
            button.fillStyle(0x5a9bd4, 1);
            button.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 8);
        });

        hitZone.on('pointerout', () => {
            button.clear();
            button.fillStyle(CONFIG.COLORS.PRIMARY, 1);
            button.fillRoundedRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, 8);
        });

        hitZone.on('pointerdown', () => {
            soundManager.playClick();
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start(CONFIG.SCENES.ARCADE);
            });
        });
    }
}
