// PixelPal - Work Scene

class WorkScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENES.WORK });
    }

    create() {
        // Background - office/work building
        this.createBackground();

        // Create UI
        this.createUI();

        // Create job options
        this.createJobBoard();

        // Instructions
        this.add.text(CONFIG.WIDTH / 2, 30, 'Choose a job to earn coins!', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            backgroundColor: '#00000080',
            padding: { x: 10, y: 5 },
        }).setOrigin(0.5);

        // Track if currently working
        this.isWorking = false;

        // Fade in
        this.cameras.main.fadeIn(300, 0, 0, 0);
    }

    createBackground() {
        const bg = this.add.graphics();

        // Office walls
        bg.fillStyle(0x9e9e9e, 1);
        bg.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Floor
        bg.fillStyle(0x616161, 1);
        bg.fillRect(0, CONFIG.HEIGHT - 120, CONFIG.WIDTH, 120);

        // Floor tiles
        bg.lineStyle(2, 0x424242, 1);
        for (let x = 0; x < CONFIG.WIDTH; x += 60) {
            bg.lineBetween(x, CONFIG.HEIGHT - 120, x, CONFIG.HEIGHT);
        }
        for (let y = CONFIG.HEIGHT - 120; y < CONFIG.HEIGHT; y += 60) {
            bg.lineBetween(0, y, CONFIG.WIDTH, y);
        }

        // Windows
        for (let i = 0; i < 5; i++) {
            const x = 100 + i * 140;
            const y = 100;
            bg.fillStyle(0x81d4fa, 1);
            bg.fillRect(x, y, 100, 120);
            bg.lineStyle(4, 0x757575);
            bg.strokeRect(x, y, 100, 120);
            bg.lineBetween(x + 50, y, x + 50, y + 120);
            bg.lineBetween(x, y + 60, x + 100, y + 60);
        }

        // Desk
        bg.fillStyle(0x8d6e63, 1);
        bg.fillRect(50, CONFIG.HEIGHT - 200, 200, 15);
        bg.fillRect(50, CONFIG.HEIGHT - 200, 15, 80);
        bg.fillRect(235, CONFIG.HEIGHT - 200, 15, 80);

        // Computer on desk
        bg.fillStyle(0x212121, 1);
        bg.fillRect(100, CONFIG.HEIGHT - 220, 80, 50);
        bg.fillStyle(0x1565c0, 1);
        bg.fillRect(105, CONFIG.HEIGHT - 215, 70, 40);

        // Potted plant
        bg.fillStyle(0x8d6e63, 1);
        bg.fillRect(650, CONFIG.HEIGHT - 150, 40, 30);
        bg.fillStyle(0x66bb6a, 1);
        bg.fillCircle(670, CONFIG.HEIGHT - 160, 30);
        bg.fillCircle(655, CONFIG.HEIGHT - 170, 20);
        bg.fillCircle(685, CONFIG.HEIGHT - 165, 25);
    }

    createJobBoard() {
        // Job board - bulletin board on wall
        const boardX = CONFIG.WIDTH / 2;
        const boardY = 280;

        const board = this.add.graphics();
        board.fillStyle(0x8d6e63, 1);
        board.fillRect(boardX - 350, boardY - 100, 700, 250);
        board.lineStyle(8, 0x6d4c41);
        board.strokeRect(boardX - 350, boardY - 100, 700, 250);

        // Title
        this.add.text(boardX, boardY - 70, 'JOB BOARD', {
            fontSize: '20px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        // Define jobs with different pay rates and durations
        const jobs = [
            {
                id: 'cashier',
                name: '🏪 Cashier',
                coins: 30,
                duration: 5000, // 5 seconds
                energyCost: 10,
                description: 'Quick shift',
            },
            {
                id: 'delivery',
                name: '📦 Delivery',
                coins: 60,
                duration: 10000, // 10 seconds
                energyCost: 20,
                description: 'Medium shift',
            },
            {
                id: 'programmer',
                name: '💻 Programmer',
                coins: 100,
                duration: 15000, // 15 seconds
                energyCost: 30,
                description: 'Long shift',
            },
        ];

        // Create job cards
        jobs.forEach((job, index) => {
            const cardX = boardX - 220 + index * 220;
            const cardY = boardY + 20;

            this.createJobCard(cardX, cardY, job);
        });
    }

    createJobCard(x, y, job) {
        const container = this.add.container(x, y);

        // Card background
        const card = this.add.graphics();
        card.fillStyle(0xffffff, 1);
        card.fillRect(-80, -60, 160, 120);
        card.lineStyle(3, 0xe0e0e0);
        card.strokeRect(-80, -60, 160, 120);

        container.add(card);

        // Job icon/name
        const nameText = this.add.text(0, -40, job.name, {
            fontSize: '16px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#1a1a2e',
            fontStyle: 'bold',
        }).setOrigin(0.5);
        container.add(nameText);

        // Pay info
        const payText = this.add.text(0, -10, `${job.coins} 🪙`, {
            fontSize: '18px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffca28',
            fontStyle: 'bold',
        }).setOrigin(0.5);
        container.add(payText);

        // Duration info
        const durationText = this.add.text(0, 15, job.description, {
            fontSize: '11px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#666666',
        }).setOrigin(0.5);
        container.add(durationText);

        // Energy cost
        const energyText = this.add.text(0, 35, `-${job.energyCost} ⚡`, {
            fontSize: '12px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ff7043',
        }).setOrigin(0.5);
        container.add(energyText);

        // Work button
        const button = this.add.graphics();
        button.fillStyle(0x66bb6a, 1);
        button.fillRect(-60, 45, 120, 30);
        button.lineStyle(2, 0x4caf50);
        button.strokeRect(-60, 45, 120, 30);

        const buttonText = this.add.text(0, 60, 'WORK', {
            fontSize: '14px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        container.add(button);
        container.add(buttonText);

        // Make interactive
        const hitArea = new Phaser.Geom.Rectangle(-60, 45, 120, 30);
        button.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
        button.on('pointerover', () => {
            button.clear();
            button.fillStyle(0x4caf50, 1);
            button.fillRect(-60, 45, 120, 30);
            button.lineStyle(2, 0x388e3c);
            button.strokeRect(-60, 45, 120, 30);
        });
        button.on('pointerout', () => {
            button.clear();
            button.fillStyle(0x66bb6a, 1);
            button.fillRect(-60, 45, 120, 30);
            button.lineStyle(2, 0x4caf50);
            button.strokeRect(-60, 45, 120, 30);
        });
        button.on('pointerdown', () => {
            if (!this.isWorking) {
                this.startJob(job);
            }
        });
    }

    startJob(job) {
        // Check if pet has enough energy
        const currentEnergy = petStats.getAll().energy;
        if (currentEnergy < job.energyCost) {
            this.ui.showToast('⚡ Not enough energy to work!');
            soundManager.playError();
            return;
        }

        this.isWorking = true;
        soundManager.playClick();

        // Deduct energy immediately
        petStats.modifyStat('energy', -job.energyCost);

        // Show working status
        const workingText = this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT - 60, `Working as ${job.name}...`, {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            backgroundColor: '#1565c0',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5);

        // Progress bar
        const progressBg = this.add.graphics();
        progressBg.fillStyle(0x424242, 1);
        progressBg.fillRect(CONFIG.WIDTH / 2 - 150, CONFIG.HEIGHT - 30, 300, 20);

        const progressBar = this.add.graphics();

        // Animate progress bar
        let progress = 0;
        const progressInterval = this.time.addEvent({
            delay: 100,
            callback: () => {
                progress += 100 / (job.duration / 100);
                progressBar.clear();
                progressBar.fillStyle(0x66bb6a, 1);
                progressBar.fillRect(CONFIG.WIDTH / 2 - 150, CONFIG.HEIGHT - 30, (progress / 100) * 300, 20);
            },
            repeat: Math.floor(job.duration / 100),
        });

        // After job duration, give coins
        this.time.delayedCall(job.duration, () => {
            progressInterval.remove();
            progressBar.destroy();
            progressBg.destroy();
            workingText.destroy();

            // Award coins
            inventory.addCoins(job.coins);

            // Show reward
            this.ui.showToast(`💰 Earned ${job.coins} coins!`);

            // Show coin animation
            this.showCoinReward(job.coins);

            this.isWorking = false;
        });
    }

    showCoinReward(amount) {
        // Create floating coins
        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(i * 100, () => {
                const coin = this.add.graphics();
                coin.fillStyle(CONFIG.COLORS.ACCENT, 1);
                coin.fillCircle(0, 0, 15);
                coin.fillStyle(0xffa000, 1);
                coin.fillCircle(0, 0, 10);

                coin.x = CONFIG.WIDTH / 2 + (Math.random() - 0.5) * 100;
                coin.y = CONFIG.HEIGHT / 2;

                this.tweens.add({
                    targets: coin,
                    y: coin.y - 150,
                    alpha: 0,
                    scale: 1.5,
                    duration: 1000,
                    ease: 'Quad.easeOut',
                    onComplete: () => coin.destroy(),
                });
            });
        }
    }

    createUI() {
        this.ui = new UIManager(this);
        this.ui.createCoinDisplay();

        // Back button
        const backBtn = this.add.graphics();
        backBtn.fillStyle(0x5c6bc0, 1);
        backBtn.fillRect(20, 20, 100, 40);
        backBtn.lineStyle(3, 0x3f51b5);
        backBtn.strokeRect(20, 20, 100, 40);

        const backText = this.add.text(70, 40, '← Back', {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        backBtn.setInteractive(
            new Phaser.Geom.Rectangle(20, 20, 100, 40),
            Phaser.Geom.Rectangle.Contains
        );

        backBtn.on('pointerdown', () => {
            if (!this.isWorking) {
                soundManager.playClick();
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.time.delayedCall(300, () => {
                    this.scene.start(CONFIG.SCENES.HOME);
                });
            }
        });
    }
}
