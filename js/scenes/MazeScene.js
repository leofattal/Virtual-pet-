// PixelPal - Maze Mini Game (Pac-Man Style)

class MazeScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENES.MAZE });
    }

    init() {
        this.score = 0;
        this.gameOver = false;
        this.pelletsCollected = 0;
        this.totalPellets = 0;
        this.powerUpActive = false;
        this.lives = 3;
    }

    create() {
        // Maze configuration
        this.tileSize = CONFIG.MAZE.TILE_SIZE;
        this.mazeOffsetX = 100;
        this.mazeOffsetY = 80;

        // Create maze
        this.createMaze();

        // Create player
        this.createPlayer();

        // Create ghosts
        this.createGhosts();

        // Create UI
        this.createUI();

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        // Fade in
        this.cameras.main.fadeIn(300, 0, 0, 0);
    }

    createMaze() {
        // Maze layout (0 = wall, 1 = path, 2 = pellet, 3 = power pellet)
        // Ghost box has exit at top (row 10, col 12)
        this.mazeLayout = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,2,2,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,2,0],
            [0,2,0,0,0,2,0,0,0,0,0,2,0,2,0,0,0,0,0,2,0,0,0,2,0],
            [0,3,0,0,0,2,0,0,0,0,0,2,0,2,0,0,0,0,0,2,0,0,0,3,0],
            [0,2,0,0,0,2,0,0,0,0,0,2,0,2,0,0,0,0,0,2,0,0,0,2,0],
            [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
            [0,2,0,0,0,2,0,2,0,0,0,0,0,0,0,0,0,2,0,2,0,0,0,2,0],
            [0,2,0,0,0,2,0,2,0,0,0,0,0,0,0,0,0,2,0,2,0,0,0,2,0],
            [0,2,2,2,2,2,0,2,2,2,2,1,1,1,2,2,2,2,0,2,2,2,2,2,0],
            [0,0,0,0,0,2,0,0,0,0,1,1,1,1,1,0,0,0,0,2,0,0,0,0,0],
            [0,0,0,0,0,2,0,1,1,1,1,1,1,1,1,1,1,1,0,2,0,0,0,0,0],
            [0,0,0,0,0,2,0,1,0,0,0,1,1,1,0,0,0,1,0,2,0,0,0,0,0],
            [1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1],
            [0,0,0,0,0,2,0,1,0,1,1,1,1,1,1,1,0,1,0,2,0,0,0,0,0],
            [0,0,0,0,0,2,0,1,1,1,1,1,1,1,1,1,1,1,0,2,0,0,0,0,0],
            [0,0,0,0,0,2,0,1,0,0,0,0,0,0,0,0,0,1,0,2,0,0,0,0,0],
            [0,2,2,2,2,2,2,2,2,2,2,0,0,0,2,2,2,2,2,2,2,2,2,2,0],
            [0,2,0,0,0,2,0,0,0,0,2,0,0,0,2,0,0,0,0,2,0,0,0,2,0],
            [0,3,2,2,0,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,0,2,2,3,0],
            [0,0,0,2,0,2,0,2,0,0,0,0,0,0,0,0,0,2,0,2,0,2,0,0,0],
            [0,0,0,2,0,2,0,2,0,0,0,0,0,0,0,0,0,2,0,2,0,2,0,0,0],
            [0,2,2,2,2,2,0,2,2,2,2,0,0,0,2,2,2,2,0,2,2,2,2,2,0],
            [0,2,0,0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,2,0],
            [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ];

        // Draw maze
        this.mazeGraphics = this.add.graphics();
        this.pellets = this.add.group();
        this.powerPellets = this.add.group();

        for (let row = 0; row < this.mazeLayout.length; row++) {
            for (let col = 0; col < this.mazeLayout[row].length; col++) {
                const tile = this.mazeLayout[row][col];
                const x = this.mazeOffsetX + col * this.tileSize;
                const y = this.mazeOffsetY + row * this.tileSize;

                if (tile === 0) {
                    // Wall
                    this.mazeGraphics.fillStyle(0x1565c0, 1);
                    this.mazeGraphics.fillRect(x, y, this.tileSize, this.tileSize);
                    this.mazeGraphics.lineStyle(1, 0x1976d2);
                    this.mazeGraphics.strokeRect(x, y, this.tileSize, this.tileSize);
                } else if (tile === 2) {
                    // Pellet
                    const pellet = this.add.graphics();
                    pellet.fillStyle(0xffeb3b, 1);
                    pellet.fillCircle(x + this.tileSize / 2, y + this.tileSize / 2, 4);
                    pellet.gridX = col;
                    pellet.gridY = row;
                    this.pellets.add(pellet);
                    this.totalPellets++;
                } else if (tile === 3) {
                    // Power pellet
                    const powerPellet = this.add.graphics();
                    powerPellet.fillStyle(0xff9800, 1);
                    powerPellet.fillCircle(x + this.tileSize / 2, y + this.tileSize / 2, 8);
                    powerPellet.gridX = col;
                    powerPellet.gridY = row;
                    this.powerPellets.add(powerPellet);
                    this.totalPellets++;

                    // Pulse animation
                    this.tweens.add({
                        targets: powerPellet,
                        alpha: 0.5,
                        duration: 300,
                        yoyo: true,
                        repeat: -1,
                    });
                }
            }
        }
    }

    createPlayer() {
        // Starting position (center-left area)
        this.playerGridX = 12;
        this.playerGridY = 18;

        const x = this.mazeOffsetX + this.playerGridX * this.tileSize + this.tileSize / 2;
        const y = this.mazeOffsetY + this.playerGridY * this.tileSize + this.tileSize / 2;

        this.player = this.add.container(x, y);

        // Draw pac-man style player
        const body = this.add.graphics();
        this.drawPlayer(body, 0);
        this.player.add(body);
        this.playerBody = body;

        // Movement
        this.playerDirection = { x: 0, y: 0 };
        this.nextDirection = { x: 0, y: 0 };
        this.playerSpeed = CONFIG.MAZE.PLAYER_SPEED;

        // Animation timer
        this.mouthOpen = true;
        this.time.addEvent({
            delay: 150,
            callback: () => {
                this.mouthOpen = !this.mouthOpen;
                this.drawPlayer(this.playerBody, this.mouthOpen ? 0 : 1);
            },
            loop: true,
        });
    }

    drawPlayer(graphics, frame) {
        graphics.clear();
        graphics.fillStyle(CONFIG.COLORS.PET_BODY, 1);

        const radius = this.tileSize / 2 - 2;

        if (frame === 0) {
            // Mouth open
            graphics.beginPath();
            graphics.arc(0, 0, radius, 0.25 * Math.PI, 1.75 * Math.PI, false);
            graphics.lineTo(0, 0);
            graphics.closePath();
            graphics.fill();
        } else {
            // Mouth closed
            graphics.fillCircle(0, 0, radius);
        }

        // Eye
        graphics.fillStyle(CONFIG.COLORS.PET_EYES, 1);
        graphics.fillCircle(2, -5, 3);
    }

    createGhosts() {
        this.ghosts = [];

        // Place ghosts in the open area above the ghost box (row 10 has open paths)
        const ghostConfigs = [
            { color: 0xef5350, startX: 11, startY: 10 }, // Red - start in open path
            { color: 0xf06292, startX: 12, startY: 10 }, // Pink - start in open path
            { color: 0x42a5f5, startX: 13, startY: 10 }, // Blue - start in open path
        ];

        ghostConfigs.forEach(config => {
            const x = this.mazeOffsetX + config.startX * this.tileSize + this.tileSize / 2;
            const y = this.mazeOffsetY + config.startY * this.tileSize + this.tileSize / 2;

            const ghost = this.add.container(x, y);

            const body = this.add.graphics();
            this.drawGhost(body, config.color);
            ghost.add(body);

            ghost.gridX = config.startX;
            ghost.gridY = config.startY;
            ghost.color = config.color;
            ghost.body = body;
            ghost.direction = { x: 0, y: 0 };
            ghost.speed = CONFIG.MAZE.GHOST_SPEED;
            ghost.scared = false;

            // Start ghost movement after delay
            this.time.delayedCall(1000 + this.ghosts.length * 500, () => {
                ghost.active = true;
                this.setRandomGhostDirection(ghost);
            });

            this.ghosts.push(ghost);
        });
    }

    drawGhost(graphics, color, scared = false) {
        graphics.clear();

        const ghostColor = scared ? 0x3f51b5 : color;
        graphics.fillStyle(ghostColor, 1);

        // Body (rounded top)
        const size = this.tileSize - 4;
        const halfSize = size / 2;

        // Top arc
        graphics.beginPath();
        graphics.arc(0, -2, halfSize, Math.PI, 0, false);
        graphics.lineTo(halfSize, halfSize - 4);

        // Wavy bottom
        const waveSize = size / 4;
        for (let i = 0; i < 4; i++) {
            const dir = i % 2 === 0 ? 1 : -1;
            graphics.lineTo(halfSize - (i + 1) * waveSize, halfSize - 4 + dir * 4);
        }

        graphics.lineTo(-halfSize, halfSize - 4);
        graphics.closePath();
        graphics.fill();

        // Eyes
        if (scared) {
            graphics.fillStyle(0xffffff, 1);
            graphics.fillRect(-5, -4, 3, 3);
            graphics.fillRect(2, -4, 3, 3);
        } else {
            graphics.fillStyle(0xffffff, 1);
            graphics.fillCircle(-4, -3, 4);
            graphics.fillCircle(4, -3, 4);
            graphics.fillStyle(0x1a1a2e, 1);
            graphics.fillCircle(-3, -2, 2);
            graphics.fillCircle(5, -2, 2);
        }
    }

    setRandomGhostDirection(ghost) {
        const directions = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
        ];

        // Filter valid directions
        const validDirs = directions.filter(dir => {
            const newX = ghost.gridX + dir.x;
            const newY = ghost.gridY + dir.y;
            return this.isValidMove(newX, newY);
        });

        if (validDirs.length > 0) {
            const randomDir = validDirs[Math.floor(Math.random() * validDirs.length)];
            ghost.direction = randomDir;
        }
    }

    createUI() {
        // Score
        this.add.text(20, 20, 'Score:', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        });

        this.scoreText = this.add.text(100, 20, '0', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffca28',
        });

        // Lives display
        this.add.text(20, 50, 'Lives:', {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        });

        this.livesContainer = this.add.container(90, 50);
        this.updateLivesDisplay();

        // Pellets remaining
        this.pelletsText = this.add.text(CONFIG.WIDTH - 150, 20, `Pellets: ${this.totalPellets}`, {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#b0b0b0',
        });

        // Back button
        const backBtn = this.add.container(70, CONFIG.HEIGHT - 30);

        const btnBg = this.add.graphics();
        btnBg.fillStyle(CONFIG.COLORS.PRIMARY, 1);
        btnBg.fillRect(-50, -15, 100, 30);

        const btnText = this.add.text(0, 0, '← Back', {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        backBtn.add([btnBg, btnText]);
        backBtn.setSize(100, 30);
        backBtn.setInteractive({ useHandCursor: true });

        backBtn.on('pointerdown', () => {
            soundManager.playClick();
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start(CONFIG.SCENES.ARCADE);
            });
        });
    }

    updateLivesDisplay() {
        // Clear existing lives display
        this.livesContainer.removeAll(true);

        // Draw pac-man icons for each life
        for (let i = 0; i < this.lives; i++) {
            const lifeIcon = this.add.graphics();
            lifeIcon.fillStyle(CONFIG.COLORS.PET_BODY, 1);
            lifeIcon.beginPath();
            lifeIcon.arc(i * 25, 0, 8, 0.25 * Math.PI, 1.75 * Math.PI, false);
            lifeIcon.lineTo(i * 25, 0);
            lifeIcon.closePath();
            lifeIcon.fill();
            this.livesContainer.add(lifeIcon);
        }
    }

    loseLife() {
        this.lives--;
        this.updateLivesDisplay();

        if (this.lives <= 0) {
            // Game over
            this.endGame();
            return;
        }

        // Flash screen red
        this.cameras.main.flash(200, 255, 100, 100);
        soundManager.playGameOver();

        // Temporarily pause game
        this.gameOver = true;

        // Reset player position after a short delay
        this.time.delayedCall(1000, () => {
            // Reset player to starting position
            this.playerGridX = 12;
            this.playerGridY = 18;
            this.player.x = this.mazeOffsetX + this.playerGridX * this.tileSize + this.tileSize / 2;
            this.player.y = this.mazeOffsetY + this.playerGridY * this.tileSize + this.tileSize / 2;
            this.playerDirection = { x: 0, y: 0 };
            this.nextDirection = { x: 0, y: 0 };

            // Reset ghosts to their starting positions (row 10, in open path)
            const ghostStartPositions = [
                { x: 11, y: 10 },
                { x: 12, y: 10 },
                { x: 13, y: 10 },
            ];

            this.ghosts.forEach((ghost, index) => {
                const startPos = ghostStartPositions[index];
                ghost.gridX = startPos.x;
                ghost.gridY = startPos.y;
                ghost.x = this.mazeOffsetX + ghost.gridX * this.tileSize + this.tileSize / 2;
                ghost.y = this.mazeOffsetY + ghost.gridY * this.tileSize + this.tileSize / 2;
                ghost.direction = { x: 0, y: 0 };
                ghost.scared = false;
                ghost.active = false;
                this.drawGhost(ghost.body, ghost.color, false);

                // Restart ghost movement after delay
                this.time.delayedCall(1000 + index * 500, () => {
                    ghost.active = true;
                    this.setRandomGhostDirection(ghost);
                });
            });

            // Resume game
            this.gameOver = false;
        });
    }

    isValidMove(gridX, gridY) {
        if (gridX < 0 || gridX >= this.mazeLayout[0].length ||
            gridY < 0 || gridY >= this.mazeLayout.length) {
            // Handle tunnel wrapping
            if (gridY === 12 && (gridX < 0 || gridX >= this.mazeLayout[0].length)) {
                return true;
            }
            return false;
        }
        return this.mazeLayout[gridY][gridX] !== 0;
    }

    update(time, delta) {
        if (this.gameOver) return;

        // Handle input
        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.nextDirection = { x: -1, y: 0 };
            this.player.scaleX = -1;
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.nextDirection = { x: 1, y: 0 };
            this.player.scaleX = 1;
        } else if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.nextDirection = { x: 0, y: -1 };
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.nextDirection = { x: 0, y: 1 };
        }

        // Update player movement
        this.updatePlayerMovement(delta);

        // Update ghosts
        this.ghosts.forEach(ghost => {
            if (ghost.active) {
                this.updateGhostMovement(ghost, delta);
            }
        });

        // Check pellet collection
        this.checkPelletCollection();

        // Check ghost collision
        this.checkGhostCollision();

        // Check win condition
        if (this.pelletsCollected >= this.totalPellets) {
            this.winGame();
        }
    }

    updatePlayerMovement(delta) {
        const speed = this.playerSpeed * (delta / 1000);

        // Calculate target position
        const targetX = this.mazeOffsetX + this.playerGridX * this.tileSize + this.tileSize / 2;
        const targetY = this.mazeOffsetY + this.playerGridY * this.tileSize + this.tileSize / 2;

        const dx = targetX - this.player.x;
        const dy = targetY - this.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 2) {
            // At grid center, can change direction
            this.player.x = targetX;
            this.player.y = targetY;

            // Try next direction first
            if (this.nextDirection.x !== 0 || this.nextDirection.y !== 0) {
                const nextX = this.playerGridX + this.nextDirection.x;
                const nextY = this.playerGridY + this.nextDirection.y;

                if (this.isValidMove(nextX, nextY)) {
                    this.playerDirection = { ...this.nextDirection };
                }
            }

            // Move in current direction
            if (this.playerDirection.x !== 0 || this.playerDirection.y !== 0) {
                const newGridX = this.playerGridX + this.playerDirection.x;
                const newGridY = this.playerGridY + this.playerDirection.y;

                if (this.isValidMove(newGridX, newGridY)) {
                    this.playerGridX = newGridX;
                    this.playerGridY = newGridY;

                    // Handle tunnel wrapping
                    if (this.playerGridX < 0) {
                        this.playerGridX = this.mazeLayout[0].length - 1;
                        this.player.x = this.mazeOffsetX + this.playerGridX * this.tileSize + this.tileSize / 2;
                    } else if (this.playerGridX >= this.mazeLayout[0].length) {
                        this.playerGridX = 0;
                        this.player.x = this.mazeOffsetX + this.tileSize / 2;
                    }
                }
            }
        } else {
            // Move towards target
            this.player.x += (dx / dist) * speed;
            this.player.y += (dy / dist) * speed;
        }
    }

    updateGhostMovement(ghost, delta) {
        const speed = (ghost.scared ? ghost.speed * 0.5 : ghost.speed) * (delta / 1000);

        const targetX = this.mazeOffsetX + ghost.gridX * this.tileSize + this.tileSize / 2;
        const targetY = this.mazeOffsetY + ghost.gridY * this.tileSize + this.tileSize / 2;

        const dx = targetX - ghost.x;
        const dy = targetY - ghost.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 2) {
            ghost.x = targetX;
            ghost.y = targetY;

            // Choose new direction at intersections
            const directions = [
                { x: 1, y: 0 },
                { x: -1, y: 0 },
                { x: 0, y: 1 },
                { x: 0, y: -1 },
            ];

            const validDirs = directions.filter(dir => {
                // Don't reverse direction
                if (dir.x === -ghost.direction.x && dir.y === -ghost.direction.y) {
                    return false;
                }
                const newX = ghost.gridX + dir.x;
                const newY = ghost.gridY + dir.y;
                return this.isValidMove(newX, newY);
            });

            if (validDirs.length > 0) {
                // Sometimes chase player, sometimes random
                if (!ghost.scared && Math.random() < 0.3) {
                    // Chase player
                    const playerDx = this.playerGridX - ghost.gridX;
                    const playerDy = this.playerGridY - ghost.gridY;

                    validDirs.sort((a, b) => {
                        const distA = Math.abs(playerDx - a.x) + Math.abs(playerDy - a.y);
                        const distB = Math.abs(playerDx - b.x) + Math.abs(playerDy - b.y);
                        return distA - distB;
                    });
                    ghost.direction = validDirs[0];
                } else {
                    ghost.direction = validDirs[Math.floor(Math.random() * validDirs.length)];
                }
            }

            // Move to next grid
            const newGridX = ghost.gridX + ghost.direction.x;
            const newGridY = ghost.gridY + ghost.direction.y;

            if (this.isValidMove(newGridX, newGridY)) {
                ghost.gridX = newGridX;
                ghost.gridY = newGridY;

                // Handle tunnel wrapping
                if (ghost.gridX < 0) {
                    ghost.gridX = this.mazeLayout[0].length - 1;
                    ghost.x = this.mazeOffsetX + ghost.gridX * this.tileSize + this.tileSize / 2;
                } else if (ghost.gridX >= this.mazeLayout[0].length) {
                    ghost.gridX = 0;
                    ghost.x = this.mazeOffsetX + this.tileSize / 2;
                }
            }
        } else {
            ghost.x += (dx / dist) * speed;
            ghost.y += (dy / dist) * speed;
        }
    }

    checkPelletCollection() {
        // Check regular pellets
        this.pellets.getChildren().forEach(pellet => {
            if (pellet.gridX === this.playerGridX && pellet.gridY === this.playerGridY) {
                pellet.destroy();
                this.score += 10;
                this.pelletsCollected++;
                this.scoreText.setText(this.score.toString());
                this.pelletsText.setText(`Pellets: ${this.totalPellets - this.pelletsCollected}`);
                soundManager.playCollect();
            }
        });

        // Check power pellets
        this.powerPellets.getChildren().forEach(pellet => {
            if (pellet.gridX === this.playerGridX && pellet.gridY === this.playerGridY) {
                pellet.destroy();
                this.score += 50;
                this.pelletsCollected++;
                this.scoreText.setText(this.score.toString());
                this.pelletsText.setText(`Pellets: ${this.totalPellets - this.pelletsCollected}`);
                this.activatePowerUp();
                soundManager.playHappy();
            }
        });
    }

    activatePowerUp() {
        this.powerUpActive = true;

        // Make ghosts scared
        this.ghosts.forEach(ghost => {
            ghost.scared = true;
            this.drawGhost(ghost.body, ghost.color, true);
        });

        // Flash effect
        this.cameras.main.flash(200, 255, 200, 0);

        // Power up duration
        this.time.delayedCall(5000, () => {
            this.powerUpActive = false;
            this.ghosts.forEach(ghost => {
                ghost.scared = false;
                this.drawGhost(ghost.body, ghost.color, false);
            });
        });
    }

    checkGhostCollision() {
        this.ghosts.forEach(ghost => {
            const dx = Math.abs(ghost.x - this.player.x);
            const dy = Math.abs(ghost.y - this.player.y);

            if (dx < this.tileSize * 0.7 && dy < this.tileSize * 0.7) {
                if (ghost.scared) {
                    // Eat ghost
                    this.score += 200;
                    this.scoreText.setText(this.score.toString());
                    soundManager.playCollect();

                    // Reset ghost to open path
                    ghost.gridX = 12;
                    ghost.gridY = 10;
                    ghost.x = this.mazeOffsetX + ghost.gridX * this.tileSize + this.tileSize / 2;
                    ghost.y = this.mazeOffsetY + ghost.gridY * this.tileSize + this.tileSize / 2;
                    ghost.scared = false;
                    this.drawGhost(ghost.body, ghost.color, false);
                } else {
                    // Player caught - lose a life
                    this.loseLife();
                }
            }
        });
    }

    winGame() {
        this.gameOver = true;
        this.score += 500; // Bonus for completing
        soundManager.playLevelUp();

        this.showGameOver(true);
    }

    endGame() {
        this.gameOver = true;
        soundManager.playGameOver();
        this.cameras.main.flash(200, 255, 100, 100);

        this.showGameOver(false);
    }

    showGameOver(won) {
        // Update high score
        if (!window.gameHighScores) window.gameHighScores = {};
        if (this.score > (window.gameHighScores.maze || 0)) {
            window.gameHighScores.maze = this.score;
        }

        // Award coins proportional to score (1 coin per 10 points, minimum 1)
        const coinsEarned = Math.max(1, Math.floor(this.score / 10));
        try {
            inventory.addCoins(coinsEarned);
        } catch (e) {
            console.warn('Error adding coins:', e);
        }

        // Add XP
        try {
            petStats.addXP(Math.max(5, Math.floor(this.score / 10)));
        } catch (e) {
            console.warn('Error adding XP:', e);
        }

        // Show game over screen
        const screen = this.add.container(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2);

        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.9);
        bg.fillRect(-180, -150, 360, 300);
        screen.add(bg);

        const title = this.add.text(0, -110, won ? 'You Win!' : 'Game Over!', {
            fontSize: '32px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: won ? '#66bb6a' : '#ef5350',
        }).setOrigin(0.5);
        screen.add(title);

        const scoreLabel = this.add.text(0, -50, 'Score', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#b0b0b0',
        }).setOrigin(0.5);
        screen.add(scoreLabel);

        const scoreValue = this.add.text(0, -15, this.score.toString(), {
            fontSize: '48px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);
        screen.add(scoreValue);

        const highScore = this.add.text(0, 30, `High Score: ${window.gameHighScores.maze}`, {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffca28',
        }).setOrigin(0.5);
        screen.add(highScore);

        const coins = this.add.text(0, 60, `+${coinsEarned} 🪙`, {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffca28',
        }).setOrigin(0.5);
        screen.add(coins);

        // Buttons
        const retryBtn = this.add.container(-60, 120);
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
        retryBtn.on('pointerdown', () => {
            soundManager.playClick();
            this.scene.restart();
        });
        screen.add(retryBtn);

        const exitBtn = this.add.container(60, 120);
        const exitBg = this.add.graphics();
        exitBg.fillStyle(CONFIG.COLORS.PRIMARY, 1);
        exitBg.fillRect(-50, -15, 100, 30);
        const exitText = this.add.text(0, 0, '🎮 Arcade', {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);
        exitBtn.add([exitBg, exitText]);
        exitBtn.setSize(100, 30);
        exitBtn.setInteractive({ useHandCursor: true });
        exitBtn.on('pointerdown', () => {
            soundManager.playClick();
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start(CONFIG.SCENES.ARCADE);
            });
        });
        screen.add(exitBtn);

        screen.setDepth(1000);
    }
}
