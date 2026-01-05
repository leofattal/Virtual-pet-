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
        // Create doors to different rooms - Kitchen next to Bedroom
        this.createDoor(150, '🛏️ Bedroom', CONFIG.SCENES.BEDROOM, 0x7986cb);
        this.createDoor(300, '🍽️ Kitchen', CONFIG.SCENES.KITCHEN, 0xff7043);
        this.createDoor(500, '👗 Closet', CONFIG.SCENES.CLOSET, 0xce93d8);
        this.createDoor(650, '🎮 Arcade', CONFIG.SCENES.ARCADE, 0x4dd0e1);
    }

    createDoor(x, label, sceneKey, accentColor) {
        const doorY = CONFIG.HEIGHT - 220;
        const doorContainer = this.add.container(x, doorY);

        const door = this.add.graphics();

        // Door frame
        door.fillStyle(0x5d4037, 1);
        door.fillRect(-35, -70, 70, 140);

        // Door
        door.fillStyle(0x8d6e63, 1);
        door.fillRect(-30, -65, 60, 130);

        // Door panels
        door.fillStyle(0x6d4c41, 1);
        door.fillRect(-25, -60, 22, 50);
        door.fillRect(3, -60, 22, 50);
        door.fillRect(-25, 0, 22, 50);
        door.fillRect(3, 0, 22, 50);

        // Door handle
        door.fillStyle(0xffc107, 1);
        door.fillCircle(20, 5, 5);

        // Door sign (colored based on room)
        door.fillStyle(accentColor, 1);
        door.fillRect(-25, -80, 50, 14);

        doorContainer.add(door);

        // Room sign text
        const sign = this.add.text(0, -72, label, {
            fontSize: '10px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);
        doorContainer.add(sign);

        // Make door interactive
        doorContainer.setSize(70, 140);
        doorContainer.setInteractive({ useHandCursor: true });

        doorContainer.on('pointerover', () => {
            door.clear();
            door.fillStyle(0x5d4037, 1);
            door.fillRect(-35, -70, 70, 140);
            door.fillStyle(0xa1887f, 1);
            door.fillRect(-30, -65, 60, 130);
            door.fillStyle(0x8d6e63, 1);
            door.fillRect(-25, -60, 22, 50);
            door.fillRect(3, -60, 22, 50);
            door.fillRect(-25, 0, 22, 50);
            door.fillRect(3, 0, 22, 50);
            door.fillStyle(0xffc107, 1);
            door.fillCircle(20, 5, 5);
            door.fillStyle(accentColor, 1);
            door.fillRect(-25, -80, 50, 14);
        });

        doorContainer.on('pointerout', () => {
            door.clear();
            door.fillStyle(0x5d4037, 1);
            door.fillRect(-35, -70, 70, 140);
            door.fillStyle(0x8d6e63, 1);
            door.fillRect(-30, -65, 60, 130);
            door.fillStyle(0x6d4c41, 1);
            door.fillRect(-25, -60, 22, 50);
            door.fillRect(3, -60, 22, 50);
            door.fillRect(-25, 0, 22, 50);
            door.fillRect(3, 0, 22, 50);
            door.fillStyle(0xffc107, 1);
            door.fillCircle(20, 5, 5);
            door.fillStyle(accentColor, 1);
            door.fillRect(-25, -80, 50, 14);
        });

        doorContainer.on('pointerdown', () => {
            soundManager.playClick();
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start(sceneKey);
            });
        });
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
