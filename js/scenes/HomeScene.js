// PixelPal - Home Scene (Main Pet Room)

class HomeScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENES.HOME });
    }

    create() {
        // Check if pet is dead - go to funeral
        if (petStats.isDead) {
            this.scene.start(CONFIG.SCENES.FUNERAL);
            return;
        }

        // Resume audio context on first interaction
        this.input.once('pointerdown', () => {
            soundManager.resume();
        });

        // Create background
        this.createBackground();

        // Create room doors (Kitchen, Bedroom, Closet)
        this.createRoomDoors();

        // Create house items (if purchased)
        this.createHouseItems();

        // Create pet
        this.pet = new Pet(this, CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 + 20);

        // Create UI
        this.ui = new UIManager(this);
        this.ui.createStatBars();
        this.ui.createCoinDisplay();
        this.ui.createLevelDisplay();
        this.ui.createActionButtons();

        // Show pet name
        this.createPetNameDisplay();

        // Add stat listener for UI updates and death check
        this.statListener = () => {
            // Safety check - only update if scene is active
            if (!this.sys || !this.sys.isActive()) return;

            // Check if pet died
            if (petStats.isDead) {
                this.goToFuneral();
                return;
            }

            try {
                this.ui.update();
                this.pet.refresh();
                this.updateNeglectWarning();
            } catch (e) {
                // Scene may have been destroyed
            }
        };
        petStats.addListener(this.statListener);
        inventory.addListener(this.statListener);

        // Current modal/menu (if any)
        this.currentModal = null;

        // Create instruction hint
        this.createDragHints();

        // Scene transition fade in
        this.cameras.main.fadeIn(300, 0, 0, 0);

        // Listen for shutdown event to clean up listeners
        this.events.on('shutdown', this.shutdown, this);

        // Debug: Press R to reset game data
        this.input.keyboard.on('keydown-R', () => {
            if (confirm('Reset all game data? This will delete your save and start fresh.')) {
                saveSystem.deleteSave();
                location.reload();
            }
        });

        // Debug: Show current coins in console
        console.log('HomeScene loaded. Current coins:', inventory.coins, 'Pet name:', petStats.name);
    }

    createPetNameDisplay() {
        // Show pet name above the pet
        this.petNameText = this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 - 60, petStats.name, {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            backgroundColor: '#5c6bc080',
            padding: { x: 10, y: 4 },
        }).setOrigin(0.5);

        // Create thought bubble system
        this.createThoughtBubble();
    }

    createThoughtBubble() {
        // Container for thought bubble
        this.thoughtBubble = this.add.container(CONFIG.WIDTH / 2 + 80, CONFIG.HEIGHT / 2 - 40);
        this.thoughtBubble.setVisible(false);
        this.thoughtBubble.setDepth(100);

        // Bubble background
        const bubbleGraphics = this.add.graphics();
        bubbleGraphics.fillStyle(0xffffff, 0.95);
        bubbleGraphics.fillEllipse(0, 0, 70, 50);
        // Small connecting bubbles
        bubbleGraphics.fillCircle(-30, 25, 8);
        bubbleGraphics.fillCircle(-40, 35, 5);
        this.thoughtBubble.add(bubbleGraphics);

        // Thought icon (will be updated based on need)
        this.thoughtIcon = this.add.text(0, -5, '', {
            fontSize: '28px',
        }).setOrigin(0.5);
        this.thoughtBubble.add(this.thoughtIcon);

        // Check needs every 5 seconds
        this.time.addEvent({
            delay: 5000,
            callback: () => this.checkPetNeeds(),
            loop: true,
        });

        // Initial check
        this.time.delayedCall(2000, () => this.checkPetNeeds());
    }

    checkPetNeeds() {
        if (!this.thoughtBubble || !this.scene || !this.sys.isActive()) return;

        // Get current stats
        const stats = petStats.getAll();

        // Determine what pet needs most (threshold of 30 or below)
        let need = null;
        let icon = '';

        if (stats.hunger <= 30) {
            need = 'hunger';
            icon = '🍎';
        } else if (stats.energy <= 30) {
            need = 'energy';
            icon = '💤';
        } else if (stats.happiness <= 30) {
            need = 'happiness';
            icon = '⚽';
        } else if (stats.cleanliness <= 30) {
            need = 'cleanliness';
            icon = '🛁';
        }

        if (need) {
            this.showThoughtBubble(icon);
        } else {
            this.hideThoughtBubble();
        }
    }

    showThoughtBubble(icon) {
        if (!this.thoughtBubble) return;

        this.thoughtIcon.setText(icon);
        this.thoughtBubble.setVisible(true);

        // Gentle floating animation
        if (!this.thoughtTween || !this.thoughtTween.isPlaying()) {
            this.thoughtTween = this.tweens.add({
                targets: this.thoughtBubble,
                y: this.thoughtBubble.y - 8,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
            });
        }
    }

    hideThoughtBubble() {
        if (!this.thoughtBubble) return;

        this.thoughtBubble.setVisible(false);
        if (this.thoughtTween) {
            this.thoughtTween.stop();
            this.thoughtBubble.y = CONFIG.HEIGHT / 2 - 40;
        }
    }

    createBackground() {
        // Draw room background
        const bg = this.add.graphics();

        // Wall
        bg.fillStyle(CONFIG.COLORS.BG_HOME, 1);
        bg.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Floor
        bg.fillStyle(0x4a3728, 1);
        bg.fillRect(0, CONFIG.HEIGHT - 150, CONFIG.WIDTH, 150);

        // Floor pattern (wooden planks)
        bg.lineStyle(2, 0x3d2d22);
        for (let x = 0; x < CONFIG.WIDTH; x += 80) {
            bg.lineBetween(x, CONFIG.HEIGHT - 150, x, CONFIG.HEIGHT);
        }
        for (let y = CONFIG.HEIGHT - 150; y < CONFIG.HEIGHT; y += 30) {
            bg.lineBetween(0, y, CONFIG.WIDTH, y);
        }

        // Window
        bg.fillStyle(0x87ceeb, 1);
        bg.fillRect(550, 80, 150, 120);
        bg.lineStyle(8, 0x8d6e63);
        bg.strokeRect(550, 80, 150, 120);
        bg.lineStyle(4, 0x8d6e63);
        bg.lineBetween(625, 80, 625, 200);
        bg.lineBetween(550, 140, 700, 140);

        // Sun through window
        bg.fillStyle(0xffeb3b, 0.6);
        bg.fillCircle(600, 120, 25);

        // Decorative shelf
        bg.fillStyle(0x6d4c41, 1);
        bg.fillRect(60, 150, 150, 12);
        bg.fillRect(60, 140, 8, 60);
        bg.fillRect(202, 140, 8, 60);

        // Plant on shelf
        bg.fillStyle(0x8d6e63, 1);
        bg.fillRect(100, 120, 30, 30);
        bg.fillStyle(0x4caf50, 1);
        bg.fillCircle(115, 100, 25);
        bg.fillCircle(100, 110, 15);
        bg.fillCircle(130, 110, 15);

        // Rug
        bg.fillStyle(0x7e57c2, 1);
        bg.fillEllipse(CONFIG.WIDTH / 2, CONFIG.HEIGHT - 100, 300, 80);
        bg.fillStyle(0x9575cd, 1);
        bg.fillEllipse(CONFIG.WIDTH / 2, CONFIG.HEIGHT - 100, 250, 60);
        bg.fillStyle(0xb39ddb, 1);
        bg.fillEllipse(CONFIG.WIDTH / 2, CONFIG.HEIGHT - 100, 180, 40);
    }

    createRoomDoors() {
        // Create doors to different rooms - 2 rows
        // Top row
        this.createDoor(100, '🛏️ Bedroom', CONFIG.SCENES.BEDROOM, 0x7986cb, 0);
        this.createDoor(200, '🍽️ Kitchen', CONFIG.SCENES.KITCHEN, 0xff7043, 0);
        this.createDoor(300, '👗 Closet', CONFIG.SCENES.CLOSET, 0xce93d8, 0);
        this.createDoor(400, '🎮 Arcade', CONFIG.SCENES.ARCADE, 0x4dd0e1, 0);
        this.createDoor(500, '💼 Work', CONFIG.SCENES.WORK, 0x66bb6a, 0);

        // Bottom row - new features
        this.createDoor(250, '🏆 Trophies', CONFIG.SCENES.TROPHY_ROOM, 0xffd700, 100);
        this.createDoor(400, '🌱 Garden', CONFIG.SCENES.GARDEN, 0x8bc34a, 100);
        this.createDoor(550, '🎨 Playground', CONFIG.SCENES.PLAYGROUND, 0x9c27b0, 100);
    }

    createDoor(x, label, sceneKey, accentColor, yOffset = 0) {
        const doorY = CONFIG.HEIGHT - 220 + yOffset;
        const doorContainer = this.add.container(x, doorY);

        const door = this.add.graphics();

        // Shadow
        door.fillStyle(0x000000, 0.2);
        door.fillRoundedRect(-32, -62, 64, 134, 8);

        // Door frame (dark wood)
        door.fillStyle(0x4a3428, 1);
        door.fillRoundedRect(-35, -70, 70, 140, 6);

        // Main door (gradient effect with multiple rectangles)
        door.fillStyle(accentColor, 1);
        door.fillRoundedRect(-30, -65, 60, 130, 4);

        // Door highlight (top lighter)
        door.fillStyle(0xffffff, 0.15);
        door.fillRoundedRect(-30, -65, 60, 40, 4);

        // Door shadow (bottom darker)
        door.fillStyle(0x000000, 0.15);
        door.fillRoundedRect(-30, 25, 60, 40, 4);

        // Decorative window (if not bottom row)
        if (yOffset === 0) {
            door.fillStyle(0xffffff, 0.3);
            door.fillRoundedRect(-20, -50, 40, 30, 4);
            // Window panes
            door.lineStyle(2, accentColor, 0.5);
            door.lineBetween(0, -50, 0, -20);
            door.lineBetween(-20, -35, 20, -35);
        }

        // Door handle (metallic)
        door.fillStyle(0xffd700, 1);
        door.fillCircle(22, 10, 6);
        door.fillStyle(0xffeb3b, 1);
        door.fillCircle(20, 8, 5);

        // Decorative details
        door.lineStyle(2, 0x000000, 0.2);
        door.strokeRoundedRect(-28, -63, 56, 126, 4);

        doorContainer.add(door);

        // Icon above door
        const emoji = label.split(' ')[0]; // Extract emoji
        const iconBg = this.add.graphics();
        iconBg.fillStyle(accentColor, 1);
        iconBg.fillCircle(0, -85, 18);
        iconBg.lineStyle(3, 0xffffff, 0.8);
        iconBg.strokeCircle(0, -85, 18);
        doorContainer.add(iconBg);

        const icon = this.add.text(0, -85, emoji, {
            fontSize: '20px',
        }).setOrigin(0.5);
        doorContainer.add(icon);

        // Room label below
        const labelText = label.substring(emoji.length).trim(); // Remove emoji
        const sign = this.add.text(0, 80, labelText, {
            fontSize: '12px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
        }).setOrigin(0.5);
        doorContainer.add(sign);

        // Glow effect container
        const glowGraphics = this.add.graphics();
        doorContainer.add(glowGraphics);
        doorContainer.setData('glowGraphics', glowGraphics);
        doorContainer.setData('door', door);
        doorContainer.setData('accentColor', accentColor);
        doorContainer.setData('yOffset', yOffset);

        // Make door interactive
        doorContainer.setSize(70, 160);
        doorContainer.setInteractive({ useHandCursor: true });

        doorContainer.on('pointerover', () => {
            // Add glow effect
            glowGraphics.clear();
            glowGraphics.lineStyle(4, accentColor, 0.8);
            glowGraphics.strokeRoundedRect(-32, -67, 64, 134, 6);
            glowGraphics.lineStyle(2, 0xffffff, 0.6);
            glowGraphics.strokeRoundedRect(-34, -69, 68, 138, 6);

            // Scale up slightly
            this.tweens.add({
                targets: doorContainer,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 150,
                ease: 'Back.easeOut',
            });

            // Icon bounce
            this.tweens.add({
                targets: icon,
                y: -90,
                duration: 200,
                yoyo: true,
                ease: 'Quad.easeOut',
            });
        });

        doorContainer.on('pointerout', () => {
            // Remove glow
            glowGraphics.clear();

            // Scale back
            this.tweens.add({
                targets: doorContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 150,
                ease: 'Back.easeIn',
            });
        });

        doorContainer.on('pointerdown', () => {
            soundManager.playClick();

            // Click animation - door opens slightly
            this.tweens.add({
                targets: door,
                x: 5,
                duration: 100,
                yoyo: true,
            });

            // Flash effect
            const flash = this.add.graphics();
            flash.fillStyle(0xffffff, 0.5);
            flash.fillCircle(x, doorY, 50);
            this.tweens.add({
                targets: flash,
                alpha: 0,
                scaleX: 2,
                scaleY: 2,
                duration: 300,
                onComplete: () => flash.destroy(),
            });

            // Transition
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start(sceneKey);
            });
        });

        return doorContainer;
    }

    createDragHints() {
        // Show hint at bottom of screen
        this.hintText = this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT - 20,
            '💡 Click doors to visit rooms! Bedroom to sleep, Kitchen to eat, Closet to dress up', {
            fontSize: '10px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#888888',
        }).setOrigin(0.5);
    }

    handleAction(action) {
        // Close any open modal first
        if (this.currentModal) {
            this.currentModal.destroy();
            this.currentModal = null;
        }

        switch (action) {
            case 'feed':
                this.goToRoom(CONFIG.SCENES.KITCHEN);
                break;
            case 'sleep':
                this.goToRoom(CONFIG.SCENES.BEDROOM);
                break;
            case 'clean':
                this.goToRoom(CONFIG.SCENES.BATHROOM);
                break;
            case 'dress':
                this.goToRoom(CONFIG.SCENES.CLOSET);
                break;
            case 'play':
                this.goToRoom(CONFIG.SCENES.PLAYGROUND);
                break;
            case 'shop':
                this.goToRoom(CONFIG.SCENES.SHOP);
                break;
        }
    }

    goToRoom(sceneKey) {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.time.delayedCall(300, () => {
            this.scene.start(sceneKey);
        });
    }

    goToFuneral() {
        // Disable interactions
        this.input.enabled = false;

        // Dark fade and go to funeral
        this.cameras.main.fadeOut(2000, 0, 0, 0);
        this.time.delayedCall(2000, () => {
            this.scene.start(CONFIG.SCENES.FUNERAL);
        });
    }

    createHouseItems() {
        // Check which house items are owned and display them
        const ownedHouseItems = inventory.ownedHouseItems || [];

        console.log('HomeScene: Creating house items. Owned items:', ownedHouseItems);

        // Position for house items (right side of room)
        const itemPositions = {
            jacuzzi: { x: 680, y: 200 },
            spa: { x: 550, y: 280 },
            pooltable: { x: 100, y: 240 },
            tvgaming: { x: 280, y: 100 },
            bookshelf: { x: 50, y: 100 },
            musicstation: { x: 720, y: 120 },
        };

        ownedHouseItems.forEach(itemId => {
            const item = getItemById(itemId);
            const pos = itemPositions[itemId];

            console.log('Creating house item:', itemId, item, pos);

            if (item && pos) {
                this.createHouseItem(pos.x, pos.y, item);
            }
        });
    }

    createHouseItem(x, y, item) {
        const container = this.add.container(x, y);
        const graphics = this.add.graphics();

        // Draw the item based on its type
        switch (item.id) {
            case 'jacuzzi':
                // Hot tub
                graphics.fillStyle(0x00bcd4, 1);
                graphics.fillEllipse(0, 0, 80, 50);
                graphics.fillStyle(0x0097a7, 1);
                graphics.fillEllipse(0, -5, 70, 40);
                // Bubbles
                for (let i = 0; i < 5; i++) {
                    graphics.fillStyle(0xffffff, 0.5);
                    graphics.fillCircle(-20 + i * 10, -8, 3);
                }
                break;

            case 'spa':
                // Spa station
                graphics.fillStyle(0xce93d8, 1);
                graphics.fillRect(-30, -20, 60, 40);
                graphics.fillStyle(0xba68c8, 1);
                graphics.fillRect(-25, -15, 50, 30);
                break;

            case 'pooltable':
                // Pool table
                graphics.fillStyle(0x4caf50, 1);
                graphics.fillRect(-40, -25, 80, 50);
                graphics.fillStyle(0x388e3c, 1);
                graphics.fillRect(-35, -20, 70, 40);
                // Balls
                graphics.fillStyle(0xffffff, 1);
                graphics.fillCircle(-10, 0, 4);
                graphics.fillStyle(0xf44336, 1);
                graphics.fillCircle(10, 5, 4);
                break;

            case 'tvgaming':
                // TV and console
                graphics.fillStyle(0x212121, 1);
                graphics.fillRect(-35, -25, 70, 50);
                graphics.fillStyle(0x1565c0, 1);
                graphics.fillRect(-30, -20, 60, 40);
                // Controller
                graphics.fillStyle(0x9c27b0, 1);
                graphics.fillRect(-10, 30, 20, 8);
                break;

            case 'bookshelf':
                // Bookshelf
                graphics.fillStyle(0x8d6e63, 1);
                graphics.fillRect(-30, -40, 60, 80);
                // Shelves
                graphics.lineStyle(3, 0x6d4c41);
                graphics.lineBetween(-30, -10, 30, -10);
                graphics.lineBetween(-30, 15, 30, 15);
                // Books
                for (let i = 0; i < 4; i++) {
                    const colors = [0xef5350, 0x42a5f5, 0x66bb6a, 0xffeb3b];
                    graphics.fillStyle(colors[i], 1);
                    graphics.fillRect(-25 + i * 13, -35, 10, 20);
                }
                break;

            case 'musicstation':
                // Music station
                graphics.fillStyle(0xff5722, 1);
                graphics.fillRect(-25, -20, 50, 40);
                // Speakers
                graphics.fillStyle(0x424242, 1);
                graphics.fillCircle(-15, 0, 8);
                graphics.fillCircle(15, 0, 8);
                // Notes
                graphics.fillStyle(0xffd54f, 1);
                graphics.fillCircle(-5, -25, 4);
                graphics.fillCircle(5, -28, 4);
                break;
        }

        container.add(graphics);

        // Label
        const label = this.add.text(0, 45, item.name, {
            fontSize: '10px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            backgroundColor: '#00000080',
            padding: { x: 4, y: 2 },
        }).setOrigin(0.5);
        container.add(label);

        // Make interactive
        container.setSize(80, 80);
        container.setInteractive({ useHandCursor: true });

        container.on('pointerdown', () => {
            this.useHouseItem(item);
        });
    }

    useHouseItem(item) {
        soundManager.playClick();

        // Special case: Gaming Setup opens the Arcade
        if (item.id === 'tvgaming') {
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start(CONFIG.SCENES.ARCADE);
            });
            return;
        }

        // Apply item effects
        const effects = item.effects;
        for (const stat in effects) {
            petStats.modifyStat(stat, effects[stat]);
        }

        // Show feedback
        const effectText = [];
        if (effects.cleanliness) effectText.push(`${effects.cleanliness > 0 ? '+' : ''}${effects.cleanliness} 💧`);
        if (effects.happiness) effectText.push(`${effects.happiness > 0 ? '+' : ''}${effects.happiness} 💖`);
        if (effects.energy) effectText.push(`${effects.energy > 0 ? '+' : ''}${effects.energy} ⚡`);

        this.ui.showToast(`Used ${item.name}! ${effectText.join(' ')}`);

        // Pet animation - jump for joy
        this.tweens.add({
            targets: this.pet.container,
            y: this.pet.container.y - 30,
            duration: 200,
            yoyo: true,
            ease: 'Quad.easeOut',
        });
    }

    updateNeglectWarning() {
        const neglectStatus = petStats.getNeglectStatus();

        // Create or update warning text
        if (!this.neglectWarning) {
            this.neglectWarning = this.add.text(CONFIG.WIDTH / 2, 170, '', {
                fontSize: '14px',
                fontFamily: CONFIG.FONT.FAMILY,
                color: '#ef5350',
                backgroundColor: '#00000080',
                padding: { x: 10, y: 5 },
            }).setOrigin(0.5).setDepth(1000);
        }

        if (neglectStatus.status === 'critical') {
            this.neglectWarning.setText('⚠️ ' + petStats.name + ' is dying! Take care of them NOW!');
            this.neglectWarning.setVisible(true);

            // Flash warning
            if (!this.warningFlash) {
                this.warningFlash = this.tweens.add({
                    targets: this.neglectWarning,
                    alpha: 0.3,
                    duration: 300,
                    yoyo: true,
                    repeat: -1,
                });
            }
        } else if (neglectStatus.status === 'warning') {
            this.neglectWarning.setText('😢 ' + petStats.name + ' is very unhappy...');
            this.neglectWarning.setVisible(true);
            if (this.warningFlash) {
                this.warningFlash.stop();
                this.warningFlash = null;
                this.neglectWarning.setAlpha(1);
            }
        } else if (neglectStatus.status === 'neglected') {
            this.neglectWarning.setText('😟 ' + petStats.name + ' needs attention');
            this.neglectWarning.setVisible(true);
            if (this.warningFlash) {
                this.warningFlash.stop();
                this.warningFlash = null;
                this.neglectWarning.setAlpha(1);
            }
        } else {
            this.neglectWarning.setVisible(false);
            if (this.warningFlash) {
                this.warningFlash.stop();
                this.warningFlash = null;
            }
        }
    }

    showFeedMenu() {
        const ownedFood = inventory.getOwnedFood();

        if (ownedFood.length === 0) {
            this.ui.showToast('No food! Visit the shop.');
            return;
        }

        // Create food selection modal
        this.currentModal = this.add.container(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2);

        // Overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(-CONFIG.WIDTH/2, -CONFIG.HEIGHT/2, CONFIG.WIDTH, CONFIG.HEIGHT);
        overlay.setInteractive(new Phaser.Geom.Rectangle(-CONFIG.WIDTH/2, -CONFIG.HEIGHT/2, CONFIG.WIDTH, CONFIG.HEIGHT), Phaser.Geom.Rectangle.Contains);
        this.currentModal.add(overlay);

        // Modal box
        const box = this.add.graphics();
        box.fillStyle(CONFIG.COLORS.BG_HOME, 1);
        box.fillRect(-250, -180, 500, 360);
        box.lineStyle(4, CONFIG.COLORS.PRIMARY);
        box.strokeRect(-250, -180, 500, 360);
        this.currentModal.add(box);

        // Title
        const title = this.add.text(0, -150, '🍎 Choose Food', {
            fontSize: CONFIG.FONT.SIZE_LARGE,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);
        this.currentModal.add(title);

        // Food grid
        const startX = -200;
        const startY = -80;
        const cellSize = 90;

        ownedFood.forEach((food, index) => {
            const col = index % 4;
            const row = Math.floor(index / 4);
            const x = startX + col * (cellSize + 10);
            const y = startY + row * (cellSize + 10);

            const cell = this.createFoodCell(x, y, food, cellSize);
            this.currentModal.add(cell);
        });

        // Close button
        const closeBtn = this.ui.createButton(0, 140, '✖ Close', () => {
            this.currentModal.destroy();
            this.currentModal = null;
        });
        this.currentModal.add(closeBtn);

        this.currentModal.setDepth(1000);
    }

    createFoodCell(x, y, food, size) {
        const cell = this.add.container(x, y);

        const bg = this.add.graphics();
        bg.fillStyle(0x444444, 1);
        bg.fillRect(0, 0, size, size);
        bg.lineStyle(2, CONFIG.COLORS.PRIMARY);
        bg.strokeRect(0, 0, size, size);
        cell.add(bg);

        // Food icon
        const icon = this.add.graphics();
        icon.fillStyle(food.color, 1);
        icon.fillCircle(size/2, 30, 20);
        cell.add(icon);

        // Name
        const name = this.add.text(size/2, 55, food.name, {
            fontSize: '12px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);
        cell.add(name);

        // Quantity
        const qty = this.add.text(size/2, 75, `x${food.quantity}`, {
            fontSize: '12px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffca28',
        }).setOrigin(0.5);
        cell.add(qty);

        // Make interactive
        cell.setSize(size, size);
        cell.setInteractive({ useHandCursor: true });

        cell.on('pointerover', () => {
            if (!bg || !bg.scene) return;
            bg.clear();
            bg.fillStyle(0x555555, 1);
            bg.fillRect(0, 0, size, size);
            bg.lineStyle(2, CONFIG.COLORS.ACCENT);
            bg.strokeRect(0, 0, size, size);
        });

        cell.on('pointerout', () => {
            if (!bg || !bg.scene) return;
            bg.clear();
            bg.fillStyle(0x444444, 1);
            bg.fillRect(0, 0, size, size);
            bg.lineStyle(2, CONFIG.COLORS.PRIMARY);
            bg.strokeRect(0, 0, size, size);
        });

        cell.on('pointerdown', () => {
            if (inventory.removeItem(food.id)) {
                petStats.feed(food);
                soundManager.playFeed();
                this.pet.playFeedAnimation();
                this.ui.showToast(`Fed ${food.name}!`);

                // Close modal and refresh
                this.currentModal.destroy();
                this.currentModal = null;
            }
        });

        return cell;
    }

    performSleep() {
        if (petStats.energy >= 95) {
            this.ui.showToast('Not tired!');
            return;
        }

        // Darken screen
        const darkness = this.add.graphics();
        darkness.fillStyle(0x000000, 0);
        darkness.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
        darkness.setDepth(500);

        // Fade to dark
        this.tweens.add({
            targets: darkness,
            fillAlpha: 0.8,
            duration: 1000,
            onComplete: () => {
                // Show sleeping animation
                this.pet.playSleepAnimation();
                soundManager.playSleep();

                // Wait then wake up
                this.time.delayedCall(2000, () => {
                    petStats.sleep(50);

                    // Fade back
                    this.tweens.add({
                        targets: darkness,
                        alpha: 0,
                        duration: 1000,
                        onComplete: () => {
                            darkness.destroy();
                            this.ui.showToast('Energy restored!');
                        },
                    });
                });
            },
        });
    }

    performClean() {
        if (petStats.cleanliness >= 95) {
            this.ui.showToast('Already clean!');
            return;
        }

        // Show cleaning animation
        this.pet.playCleanAnimation();
        soundManager.playClean();

        // Apply cleaning after animation
        this.time.delayedCall(500, () => {
            petStats.clean(40);
            this.ui.showToast('Squeaky clean!');
        });
    }

    showDressMenu() {
        const ownedClothes = inventory.ownedClothes;

        // Create dress menu modal
        this.currentModal = this.add.container(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2);

        // Overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(-CONFIG.WIDTH/2, -CONFIG.HEIGHT/2, CONFIG.WIDTH, CONFIG.HEIGHT);
        overlay.setInteractive(new Phaser.Geom.Rectangle(-CONFIG.WIDTH/2, -CONFIG.HEIGHT/2, CONFIG.WIDTH, CONFIG.HEIGHT), Phaser.Geom.Rectangle.Contains);
        this.currentModal.add(overlay);

        // Modal box
        const box = this.add.graphics();
        box.fillStyle(CONFIG.COLORS.BG_HOME, 1);
        box.fillRect(-250, -200, 500, 400);
        box.lineStyle(4, CONFIG.COLORS.PRIMARY);
        box.strokeRect(-250, -200, 500, 400);
        this.currentModal.add(box);

        // Title
        const title = this.add.text(0, -170, '👕 Wardrobe', {
            fontSize: CONFIG.FONT.SIZE_LARGE,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);
        this.currentModal.add(title);

        if (ownedClothes.length === 0) {
            const noItems = this.add.text(0, 0, 'No clothes yet!\nVisit the shop.', {
                fontSize: CONFIG.FONT.SIZE_MEDIUM,
                fontFamily: CONFIG.FONT.FAMILY,
                color: '#aaaaaa',
                align: 'center',
            }).setOrigin(0.5);
            this.currentModal.add(noItems);
        } else {
            // Show owned clothes
            const startX = -200;
            const startY = -100;
            const cellSize = 80;

            ownedClothes.forEach((clothingId, index) => {
                const item = getItemById(clothingId);
                if (!item) return;

                const col = index % 4;
                const row = Math.floor(index / 4);
                const x = startX + col * (cellSize + 20);
                const y = startY + row * (cellSize + 20);

                const cell = this.createClothingCell(x, y, item, cellSize);
                this.currentModal.add(cell);
            });
        }

        // Unequip buttons
        const unequipHat = this.ui.createButton(-80, 140, '🎩 Unequip Hat', () => {
            petStats.unequip('hat');
            this.pet.refresh();
            this.ui.showToast('Hat removed');
        }, 130, 35);
        this.currentModal.add(unequipHat);

        const unequipAcc = this.ui.createButton(80, 140, '✨ Unequip Acc', () => {
            petStats.unequip('accessory');
            this.pet.refresh();
            this.ui.showToast('Accessory removed');
        }, 130, 35);
        this.currentModal.add(unequipAcc);

        // Close button
        const closeBtn = this.ui.createButton(0, 180, '✖ Close', () => {
            this.currentModal.destroy();
            this.currentModal = null;
        });
        this.currentModal.add(closeBtn);

        this.currentModal.setDepth(1000);
    }

    createClothingCell(x, y, item, size) {
        const cell = this.add.container(x, y);

        const isEquipped = petStats.outfit.hat === item.id || petStats.outfit.accessory === item.id;

        const bg = this.add.graphics();
        bg.fillStyle(isEquipped ? 0x4caf50 : 0x444444, 1);
        bg.fillRect(0, 0, size, size);
        bg.lineStyle(2, isEquipped ? CONFIG.COLORS.SUCCESS : CONFIG.COLORS.PRIMARY);
        bg.strokeRect(0, 0, size, size);
        cell.add(bg);

        // Item icon
        const icon = this.add.graphics();
        icon.fillStyle(item.color, 1);
        icon.fillRect(size/2 - 15, 10, 30, 30);
        cell.add(icon);

        // Name
        const name = this.add.text(size/2, 50, item.name, {
            fontSize: '10px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);
        cell.add(name);

        // Equipped indicator
        if (isEquipped) {
            const equipped = this.add.text(size/2, 68, '✓', {
                fontSize: '14px',
                color: '#4caf50',
            }).setOrigin(0.5);
            cell.add(equipped);
        }

        // Make interactive
        cell.setSize(size, size);
        cell.setInteractive({ useHandCursor: true });

        cell.on('pointerdown', () => {
            soundManager.playClick();
            petStats.equip(item);
            this.pet.refresh();
            this.ui.showToast(`Equipped ${item.name}!`);

            // Refresh modal
            this.currentModal.destroy();
            this.showDressMenu();
        });

        return cell;
    }

    shutdown() {
        // Clean up listeners
        petStats.removeListener(this.statListener);
        inventory.removeListener(this.statListener);

        // Clean up thought bubble
        if (this.thoughtTween) {
            this.thoughtTween.stop();
        }

        if (this.pet) {
            this.pet.destroy();
        }
        if (this.ui) {
            this.ui.destroy();
        }
    }
}
