// PixelPal - Flappy-Style Mini Game

class FlappyScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENES.FLAPPY });
    }

    init() {
        this.score = 0;
        this.gameOver = false;
        this.gameStarted = false;
        this.pipes = [];
    }

    create() {
        // Create background
        this.createBackground();

        // Create ground
        this.createGround();

        // Create player (bird/pet)
        this.createPlayer();

        // Create UI
        this.createUI();

        // Create pipe group
        this.pipeGroup = this.add.group();

        // Input handlers
        this.input.on('pointerdown', () => this.handleInput());
        this.input.keyboard.on('keydown-SPACE', () => this.handleInput());

        // Start instructions
        this.showStartScreen();

        // Fade in
        this.cameras.main.fadeIn(300, 0, 0, 0);
    }

    createBackground() {
        const bg = this.add.graphics();

        // Sky gradient effect (simplified)
        bg.fillStyle(0x87ceeb, 1);
        bg.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Clouds
        this.clouds = [];
        for (let i = 0; i < 5; i++) {
            const cloud = this.createCloud(
                Math.random() * CONFIG.WIDTH,
                50 + Math.random() * 150,
                0.5 + Math.random() * 0.5
            );
            this.clouds.push(cloud);
        }

        // Sun
        bg.fillStyle(0xffeb3b, 1);
        bg.fillCircle(650, 80, 40);
        bg.fillStyle(0xfff59d, 0.5);
        bg.fillCircle(650, 80, 55);

        // Background hills
        bg.fillStyle(0x81c784, 1);
        for (let x = 0; x < CONFIG.WIDTH + 100; x += 150) {
            bg.fillCircle(x, CONFIG.HEIGHT - 80, 100);
        }
    }

    createCloud(x, y, scale) {
        const cloud = this.add.graphics();
        cloud.fillStyle(0xffffff, 0.9);
        cloud.fillCircle(0, 0, 20 * scale);
        cloud.fillCircle(25 * scale, 0, 25 * scale);
        cloud.fillCircle(50 * scale, 0, 20 * scale);
        cloud.fillCircle(12 * scale, -12 * scale, 18 * scale);
        cloud.fillCircle(38 * scale, -12 * scale, 18 * scale);
        cloud.x = x;
        cloud.y = y;
        cloud.speed = 0.5 + Math.random() * 0.5;
        return cloud;
    }

    createGround() {
        // Ground visual
        this.groundY = CONFIG.HEIGHT - 60;

        const ground = this.add.graphics();
        ground.fillStyle(0x8d6e63, 1);
        ground.fillRect(0, this.groundY, CONFIG.WIDTH, 60);

        // Grass on top
        ground.fillStyle(0x4caf50, 1);
        ground.fillRect(0, this.groundY, CONFIG.WIDTH, 15);

        // Grass blades
        ground.fillStyle(0x66bb6a, 1);
        for (let x = 0; x < CONFIG.WIDTH; x += 15) {
            ground.fillRect(x, this.groundY - 5, 3, 8);
        }
    }

    createPlayer() {
        this.player = this.add.container(150, CONFIG.HEIGHT / 2);

        // Draw pixel bird/pet
        const bird = this.add.graphics();

        // Body
        bird.fillStyle(CONFIG.COLORS.PET_BODY, 1);
        bird.fillCircle(0, 0, 18);

        // Belly
        bird.fillStyle(CONFIG.COLORS.PET_BELLY, 1);
        bird.fillCircle(5, 3, 10);

        // Eye
        bird.fillStyle(CONFIG.COLORS.PET_EYES, 1);
        bird.fillCircle(8, -5, 5);
        bird.fillStyle(0xffffff, 1);
        bird.fillCircle(9, -6, 2);

        // Beak
        bird.fillStyle(0xff9800, 1);
        bird.fillTriangle(15, 0, 25, -3, 25, 5);

        // Wing
        bird.fillStyle(0x42a5f5, 1);
        bird.fillEllipse(-8, 5, 12, 8);

        this.player.add(bird);
        this.playerBird = bird;

        // Physics values
        this.playerVelocity = 0;
        this.gravity = CONFIG.FLAPPY.GRAVITY;
        this.jumpVelocity = CONFIG.FLAPPY.JUMP_VELOCITY;
    }

    createUI() {
        // Score display
        this.scoreText = this.add.text(CONFIG.WIDTH / 2, 40, '0', {
            fontSize: '48px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);
    }

    showStartScreen() {
        this.startScreen = this.add.container(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2);

        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.7);
        bg.fillRect(-150, -100, 300, 200);
        this.startScreen.add(bg);

        const title = this.add.text(0, -60, '🐦 Sky Hop', {
            fontSize: CONFIG.FONT.SIZE_LARGE,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);
        this.startScreen.add(title);

        const instructions = this.add.text(0, 0, 'Tap or press SPACE to fly\nAvoid the pipes!', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#b0b0b0',
            align: 'center',
        }).setOrigin(0.5);
        this.startScreen.add(instructions);

        const tapText = this.add.text(0, 60, '[ Tap to Start ]', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffca28',
        }).setOrigin(0.5);
        this.startScreen.add(tapText);

        // Pulse animation
        this.tweens.add({
            targets: tapText,
            alpha: 0.5,
            duration: 500,
            yoyo: true,
            repeat: -1,
        });
    }

    handleInput() {
        soundManager.resume();

        if (this.gameOver) {
            this.scene.restart();
            return;
        }

        if (!this.gameStarted) {
            this.startGame();
            return;
        }

        // Jump
        this.playerVelocity = this.jumpVelocity;
        soundManager.playJump();

        // Wing flap animation
        this.tweens.add({
            targets: this.player,
            angle: -20,
            duration: 100,
            yoyo: true,
        });
    }

    startGame() {
        this.gameStarted = true;

        // Remove start screen
        if (this.startScreen) {
            this.startScreen.destroy();
        }

        // Start spawning pipes
        this.pipeTimer = this.time.addEvent({
            delay: CONFIG.FLAPPY.PIPE_INTERVAL,
            callback: this.spawnPipe,
            callbackScope: this,
            loop: true,
        });

        // Spawn first pipe
        this.time.delayedCall(500, () => this.spawnPipe());
    }

    spawnPipe() {
        if (this.gameOver) return;

        const gap = CONFIG.FLAPPY.PIPE_GAP;
        const minY = 100;
        const maxY = this.groundY - gap - 100;
        const gapY = Phaser.Math.Between(minY, maxY);

        // Top pipe
        const topPipe = this.createPipe(CONFIG.WIDTH + 50, gapY, true);
        this.pipeGroup.add(topPipe);

        // Bottom pipe
        const bottomPipe = this.createPipe(CONFIG.WIDTH + 50, gapY + gap, false);
        this.pipeGroup.add(bottomPipe);

        // Score zone (invisible)
        const scoreZone = this.add.rectangle(CONFIG.WIDTH + 50 + 30, gapY + gap / 2, 10, gap, 0x000000, 0);
        scoreZone.isScoreZone = true;
        scoreZone.scored = false;
        this.pipeGroup.add(scoreZone);
    }

    createPipe(x, y, isTop) {
        const pipe = this.add.container(x, y);
        const pipeWidth = 60;
        const pipeHeight = isTop ? y : this.groundY - y;

        const pipeGraphics = this.add.graphics();

        // Pipe body
        pipeGraphics.fillStyle(0x4caf50, 1);
        if (isTop) {
            pipeGraphics.fillRect(-pipeWidth/2, -pipeHeight, pipeWidth, pipeHeight);
            // Pipe cap
            pipeGraphics.fillStyle(0x388e3c, 1);
            pipeGraphics.fillRect(-pipeWidth/2 - 5, -15, pipeWidth + 10, 30);
        } else {
            pipeGraphics.fillRect(-pipeWidth/2, 0, pipeWidth, pipeHeight);
            // Pipe cap
            pipeGraphics.fillStyle(0x388e3c, 1);
            pipeGraphics.fillRect(-pipeWidth/2 - 5, -15, pipeWidth + 10, 30);
        }

        // Highlights
        pipeGraphics.fillStyle(0x66bb6a, 1);
        if (isTop) {
            pipeGraphics.fillRect(-pipeWidth/2 + 5, -pipeHeight, 10, pipeHeight);
        } else {
            pipeGraphics.fillRect(-pipeWidth/2 + 5, 0, 10, pipeHeight);
        }

        pipe.add(pipeGraphics);
        pipe.pipeWidth = pipeWidth;
        pipe.pipeHeight = pipeHeight;
        pipe.isTop = isTop;

        return pipe;
    }

    update(time, delta) {
        // Move clouds
        this.clouds.forEach(cloud => {
            cloud.x -= cloud.speed;
            if (cloud.x < -100) {
                cloud.x = CONFIG.WIDTH + 100;
            }
        });

        if (!this.gameStarted || this.gameOver) return;

        // Apply gravity
        this.playerVelocity += this.gravity * (delta / 1000);
        this.player.y += this.playerVelocity * (delta / 1000);

        // Rotate player based on velocity
        this.player.angle = Math.min(90, Math.max(-30, this.playerVelocity * 0.1));

        // Check boundaries
        if (this.player.y < 0) {
            this.player.y = 0;
            this.playerVelocity = 0;
        }

        if (this.player.y > this.groundY - 20) {
            this.endGame();
            return;
        }

        // Move pipes and check collisions
        const pipeSpeed = CONFIG.FLAPPY.PIPE_SPEED * (delta / 1000);

        this.pipeGroup.getChildren().forEach(pipe => {
            pipe.x -= pipeSpeed;

            // Remove off-screen pipes
            if (pipe.x < -100) {
                pipe.destroy();
                return;
            }

            // Check for scoring
            if (pipe.isScoreZone && !pipe.scored && pipe.x < this.player.x) {
                pipe.scored = true;
                this.score++;
                this.scoreText.setText(this.score.toString());
                soundManager.playCollect();
            }

            // Check collision (simplified)
            if (!pipe.isScoreZone) {
                const pipeLeft = pipe.x - pipe.pipeWidth / 2;
                const pipeRight = pipe.x + pipe.pipeWidth / 2;
                const playerLeft = this.player.x - 15;
                const playerRight = this.player.x + 15;

                if (playerRight > pipeLeft && playerLeft < pipeRight) {
                    let pipeTop, pipeBottom;
                    if (pipe.isTop) {
                        pipeTop = 0;
                        pipeBottom = pipe.y;
                    } else {
                        pipeTop = pipe.y;
                        pipeBottom = this.groundY;
                    }

                    const playerTop = this.player.y - 15;
                    const playerBottom = this.player.y + 15;

                    if (playerBottom > pipeTop && playerTop < pipeBottom) {
                        this.endGame();
                    }
                }
            }
        });
    }

    endGame() {
        this.gameOver = true;

        // Stop pipe timer
        if (this.pipeTimer) {
            this.pipeTimer.remove();
        }

        // Play game over sound
        soundManager.playGameOver();

        // Flash screen
        this.cameras.main.flash(200, 255, 100, 100);

        // Update high score
        if (!window.gameHighScores) window.gameHighScores = {};
        if (this.score > (window.gameHighScores.flappy || 0)) {
            window.gameHighScores.flappy = this.score;
        }

        // Award flat 3 coins for playing
        const coinsEarned = 3;
        try {
            inventory.addCoins(coinsEarned);
        } catch (e) {
            console.warn('Error adding coins:', e);
        }

        // Add XP
        try {
            petStats.addXP(Math.max(5, this.score));
        } catch (e) {
            console.warn('Error adding XP:', e);
        }

        // Show game over screen
        this.time.delayedCall(500, () => this.showGameOver(coinsEarned));
    }

    showGameOver(coinsEarned) {
        const gameOverScreen = this.add.container(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2);

        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.8);
        bg.fillRect(-180, -150, 360, 300);
        gameOverScreen.add(bg);

        const title = this.add.text(0, -110, 'Game Over!', {
            fontSize: '32px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ef5350',
        }).setOrigin(0.5);
        gameOverScreen.add(title);

        const scoreLabel = this.add.text(0, -50, 'Score', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#b0b0b0',
        }).setOrigin(0.5);
        gameOverScreen.add(scoreLabel);

        const scoreValue = this.add.text(0, -15, this.score.toString(), {
            fontSize: '48px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);
        gameOverScreen.add(scoreValue);

        const highScore = this.add.text(0, 30, `High Score: ${window.gameHighScores.flappy}`, {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffca28',
        }).setOrigin(0.5);
        gameOverScreen.add(highScore);

        const coins = this.add.text(0, 60, `+${coinsEarned} 🪙`, {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffca28',
        }).setOrigin(0.5);
        gameOverScreen.add(coins);

        // Retry button
        const retryBtn = this.add.container(-70, 110);
        const retryBg = this.add.graphics();
        retryBg.fillStyle(CONFIG.COLORS.SUCCESS, 1);
        retryBg.fillRect(-50, -15, 100, 30);
        const retryText = this.add.text(0, 0, '🔄 Retry', {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);
        retryBtn.add([retryBg, retryText]);
        retryBtn.setSize(100, 30);
        retryBtn.setInteractive({ useHandCursor: true });
        retryBtn.on('pointerdown', (pointer) => {
            pointer.event.stopPropagation();
            soundManager.playClick();
            this.scene.restart();
        });
        gameOverScreen.add(retryBtn);

        // Back to Arcade button
        const backBtn = this.add.container(70, 110);
        const btnBg = this.add.graphics();
        btnBg.fillStyle(CONFIG.COLORS.PRIMARY, 1);
        btnBg.fillRect(-50, -15, 100, 30);
        const btnText = this.add.text(0, 0, '🎮 Arcade', {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);
        backBtn.add([btnBg, btnText]);
        backBtn.setSize(100, 30);
        backBtn.setInteractive({ useHandCursor: true });
        backBtn.on('pointerdown', (pointer) => {
            pointer.event.stopPropagation();
            soundManager.playClick();
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start(CONFIG.SCENES.ARCADE);
            });
        });
        gameOverScreen.add(backBtn);
    }
}
