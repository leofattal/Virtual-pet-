// PixelPal - Closet/Dressing Room Scene

class ClosetScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENES.CLOSET });
    }

    create() {
        // Resume audio context on first interaction
        this.input.once('pointerdown', () => {
            soundManager.resume();
        });

        // Create background
        this.createBackground();

        // Create wardrobe
        this.createWardrobe();

        // Create mirror area
        this.createMirror();

        // Create pet
        this.pet = new Pet(this, CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 + 30);

        // Create hairbrush
        this.createHairbrush();

        // Create clothes rack
        this.createClothesRack();

        // Create UI
        this.ui = new UIManager(this);
        this.ui.createStatBars();
        this.ui.createCoinDisplay();
        this.ui.createLevelDisplay();
        this.createNavigationButtons();

        // Add stat listener for UI updates
        this.statListener = () => {
            if (!this.sys || !this.sys.isActive()) return;
            try {
                this.ui.update();
                this.pet.refresh();
            } catch (e) {}
        };
        petStats.addListener(this.statListener);
        inventory.addListener(this.statListener);

        // Drag states
        this.isDraggingClothing = false;
        this.isDraggingBrush = false;

        // Create hints
        this.createDragHints();

        // Scene transition fade in
        this.cameras.main.fadeIn(300, 0, 0, 0);

        // Listen for shutdown event
        this.events.on('shutdown', this.shutdown, this);
    }

    createBackground() {
        const bg = this.add.graphics();

        // Fancy closet room - pink/lavender theme
        bg.fillStyle(0x3d2d4a, 1);
        bg.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Wallpaper pattern (diamonds)
        bg.fillStyle(0x4a3557, 0.5);
        for (let y = 0; y < CONFIG.HEIGHT - 120; y += 40) {
            for (let x = (y % 80 === 0) ? 0 : 20; x < CONFIG.WIDTH; x += 40) {
                bg.fillRect(x - 5, y, 10, 10);
            }
        }

        // Wooden floor
        bg.fillStyle(0x5d4037, 1);
        bg.fillRect(0, CONFIG.HEIGHT - 120, CONFIG.WIDTH, 120);

        // Floor pattern
        bg.fillStyle(0x6d4c41, 1);
        for (let x = 0; x < CONFIG.WIDTH; x += 80) {
            bg.fillRect(x, CONFIG.HEIGHT - 120, 40, 120);
        }

        // Fancy rug
        bg.fillStyle(0xce93d8, 1);
        bg.fillEllipse(CONFIG.WIDTH / 2, CONFIG.HEIGHT - 70, 300, 70);
        bg.fillStyle(0xe1bee7, 1);
        bg.fillEllipse(CONFIG.WIDTH / 2, CONFIG.HEIGHT - 70, 240, 55);
        bg.fillStyle(0xf3e5f5, 1);
        bg.fillEllipse(CONFIG.WIDTH / 2, CONFIG.HEIGHT - 70, 160, 35);
    }

    createWardrobe() {
        const wardrobeX = 100;
        const wardrobeY = CONFIG.HEIGHT - 220;

        // Store wardrobe position for later
        this.wardrobeX = wardrobeX;
        this.wardrobeY = wardrobeY;

        // Create wardrobe container for interactivity
        this.wardrobeContainer = this.add.container(wardrobeX, wardrobeY);

        const wardrobe = this.add.graphics();

        // Main wardrobe cabinet
        wardrobe.fillStyle(0x5d4037, 1);
        wardrobe.fillRect(-60, -100, 120, 180);

        // Wardrobe doors
        wardrobe.fillStyle(0x8d6e63, 1);
        wardrobe.fillRect(-55, -95, 52, 170);
        wardrobe.fillRect(3, -95, 52, 170);

        // Door details
        wardrobe.fillStyle(0x6d4c41, 1);
        wardrobe.fillRect(-50, -90, 42, 75);
        wardrobe.fillRect(8, -90, 42, 75);
        wardrobe.fillRect(-50, -5, 42, 70);
        wardrobe.fillRect(8, -5, 42, 70);

        // Door handles
        wardrobe.fillStyle(0xffc107, 1);
        wardrobe.fillCircle(-12, 20, 5);
        wardrobe.fillCircle(12, 20, 5);

        // Top decoration
        wardrobe.fillStyle(0x4e342e, 1);
        wardrobe.fillRect(-65, -105, 130, 10);

        // Crown molding
        wardrobe.fillStyle(0x6d4c41, 1);
        wardrobe.beginPath();
        wardrobe.moveTo(-70, -105);
        wardrobe.lineTo(0, -120);
        wardrobe.lineTo(70, -105);
        wardrobe.closePath();
        wardrobe.fill();

        // Wardrobe legs
        wardrobe.fillStyle(0x3e2723, 1);
        wardrobe.fillRect(-55, 80, 10, 15);
        wardrobe.fillRect(45, 80, 10, 15);

        this.wardrobeContainer.add(wardrobe);

        // Label
        const label = this.add.text(0, 105, '👗 Click to Open', {
            fontSize: '11px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#b0b0b0',
            backgroundColor: '#00000060',
            padding: { x: 4, y: 2 },
        }).setOrigin(0.5);
        this.wardrobeContainer.add(label);

        // Make wardrobe interactive
        this.wardrobeContainer.setSize(130, 200);
        this.wardrobeContainer.setInteractive({ useHandCursor: true });

        this.wardrobeContainer.on('pointerover', () => {
            wardrobe.clear();
            // Redraw with highlight
            wardrobe.fillStyle(0x6d4c41, 1);
            wardrobe.fillRect(-60, -100, 120, 180);
            wardrobe.fillStyle(0x9d7e6d, 1);
            wardrobe.fillRect(-55, -95, 52, 170);
            wardrobe.fillRect(3, -95, 52, 170);
            wardrobe.fillStyle(0x7d5c4b, 1);
            wardrobe.fillRect(-50, -90, 42, 75);
            wardrobe.fillRect(8, -90, 42, 75);
            wardrobe.fillRect(-50, -5, 42, 70);
            wardrobe.fillRect(8, -5, 42, 70);
            wardrobe.fillStyle(0xffd54f, 1);
            wardrobe.fillCircle(-12, 20, 6);
            wardrobe.fillCircle(12, 20, 6);
            wardrobe.fillStyle(0x5e433e, 1);
            wardrobe.fillRect(-65, -105, 130, 10);
            wardrobe.fillStyle(0x7d5c4b, 1);
            wardrobe.beginPath();
            wardrobe.moveTo(-70, -105);
            wardrobe.lineTo(0, -120);
            wardrobe.lineTo(70, -105);
            wardrobe.closePath();
            wardrobe.fill();
            wardrobe.fillStyle(0x4e3733, 1);
            wardrobe.fillRect(-55, 80, 10, 15);
            wardrobe.fillRect(45, 80, 10, 15);
        });

        this.wardrobeContainer.on('pointerout', () => {
            if (this.wardrobeOpen) return;
            wardrobe.clear();
            // Redraw normal
            wardrobe.fillStyle(0x5d4037, 1);
            wardrobe.fillRect(-60, -100, 120, 180);
            wardrobe.fillStyle(0x8d6e63, 1);
            wardrobe.fillRect(-55, -95, 52, 170);
            wardrobe.fillRect(3, -95, 52, 170);
            wardrobe.fillStyle(0x6d4c41, 1);
            wardrobe.fillRect(-50, -90, 42, 75);
            wardrobe.fillRect(8, -90, 42, 75);
            wardrobe.fillRect(-50, -5, 42, 70);
            wardrobe.fillRect(8, -5, 42, 70);
            wardrobe.fillStyle(0xffc107, 1);
            wardrobe.fillCircle(-12, 20, 5);
            wardrobe.fillCircle(12, 20, 5);
            wardrobe.fillStyle(0x4e342e, 1);
            wardrobe.fillRect(-65, -105, 130, 10);
            wardrobe.fillStyle(0x6d4c41, 1);
            wardrobe.beginPath();
            wardrobe.moveTo(-70, -105);
            wardrobe.lineTo(0, -120);
            wardrobe.lineTo(70, -105);
            wardrobe.closePath();
            wardrobe.fill();
            wardrobe.fillStyle(0x3e2723, 1);
            wardrobe.fillRect(-55, 80, 10, 15);
            wardrobe.fillRect(45, 80, 10, 15);
        });

        this.wardrobeContainer.on('pointerdown', () => {
            soundManager.playClick();
            this.toggleWardrobePanel();
        });

        this.wardrobeOpen = false;
    }

    createMirror() {
        const mirrorX = CONFIG.WIDTH - 120;
        const mirrorY = CONFIG.HEIGHT - 260;

        const mirror = this.add.graphics();

        // Mirror frame
        mirror.fillStyle(0xffc107, 1);
        mirror.fillRect(mirrorX - 50, mirrorY - 80, 100, 160);

        // Mirror surface
        mirror.fillStyle(0xb3e5fc, 1);
        mirror.fillRect(mirrorX - 42, mirrorY - 72, 84, 144);

        // Mirror reflection shine
        mirror.fillStyle(0xffffff, 0.3);
        mirror.fillRect(mirrorX - 38, mirrorY - 68, 20, 130);

        // Frame details
        mirror.lineStyle(3, 0xe6a800);
        mirror.strokeRect(mirrorX - 46, mirrorY - 76, 92, 152);

        // Decorative top
        mirror.fillStyle(0xffc107, 1);
        mirror.fillCircle(mirrorX, mirrorY - 85, 15);
        mirror.fillStyle(0xe6a800, 1);
        mirror.fillCircle(mirrorX, mirrorY - 85, 8);

        // Label
        this.add.text(mirrorX, mirrorY + 95, '🪞 Mirror', {
            fontSize: '11px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#b0b0b0',
            backgroundColor: '#00000060',
            padding: { x: 4, y: 2 },
        }).setOrigin(0.5);
    }

    createHairbrush() {
        const brushX = 250;
        const brushY = CONFIG.HEIGHT - 160;

        this.brushContainer = this.add.container(brushX, brushY);

        const brush = this.add.graphics();

        // Brush head (main part - centered at 0,0)
        brush.fillStyle(0x5d4037, 1);
        brush.fillEllipse(0, 0, 30, 20);

        // Bristles on the brush head
        brush.fillStyle(0x3e2723, 1);
        for (let x = -10; x <= 10; x += 5) {
            for (let y = -4; y <= 4; y += 4) {
                brush.fillRect(x - 1, y - 2, 2, 6);
            }
        }

        // Brush handle (extending down from head)
        brush.fillStyle(0x8d6e63, 1);
        brush.fillRect(-8, 12, 16, 30);
        brush.fillStyle(0xa1887f, 1);
        brush.fillRect(-6, 14, 12, 25);

        // Handle end detail
        brush.fillStyle(0x6d4c41, 1);
        brush.fillRect(-6, 38, 12, 4);

        this.brushContainer.add(brush);

        // Label
        const label = this.add.text(0, 45, '🪮 Brush', {
            fontSize: '10px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#b0b0b0',
        }).setOrigin(0.5);
        this.brushContainer.add(label);

        // Make draggable
        this.brushContainer.setSize(40, 50);
        this.brushContainer.setInteractive({ useHandCursor: true, draggable: true });

        this.input.setDraggable(this.brushContainer);

        this.brushContainer.on('dragstart', () => {
            this.isDraggingBrush = true;
            soundManager.playClick();
            this.brushContainer.setScale(1.2);
            this.brushContainer.setDepth(1000);
            this.showPetBrushZone(true);
        });

        this.brushContainer.on('drag', (pointer, dragX, dragY) => {
            this.brushContainer.x = dragX;
            this.brushContainer.y = dragY;
        });

        this.brushContainer.on('dragend', () => {
            this.isDraggingBrush = false;
            this.brushContainer.setScale(1);
            this.brushContainer.setDepth(0);
            this.showPetBrushZone(false);

            // Check if dropped on pet
            const dist = Phaser.Math.Distance.Between(
                this.brushContainer.x, this.brushContainer.y,
                this.pet.container.x, this.pet.container.y
            );

            if (dist < 60) {
                this.brushPet();
            }

            // Return brush to home
            this.tweens.add({
                targets: this.brushContainer,
                x: brushX,
                y: brushY,
                duration: 200,
            });
        });
    }

    showPetBrushZone(show) {
        if (!this.brushHighlight) {
            this.brushHighlight = this.add.graphics();
            this.brushHighlight.setDepth(999);
        }

        this.brushHighlight.clear();

        if (this.brushText) {
            this.brushText.destroy();
            this.brushText = null;
        }

        if (show) {
            const petX = this.pet.container.x;
            const petY = this.pet.container.y;

            this.brushHighlight.lineStyle(4, 0xce93d8, 0.9);
            this.brushHighlight.strokeCircle(petX, petY, 60);
            this.brushHighlight.fillStyle(0xce93d8, 0.15);
            this.brushHighlight.fillCircle(petX, petY, 60);

            this.brushText = this.add.text(petX, petY - 80, '🪮 Brush here!', {
                fontSize: '14px',
                fontFamily: CONFIG.FONT.FAMILY,
                color: '#ffffff',
                backgroundColor: '#ce93d8',
                padding: { x: 8, y: 4 },
            }).setOrigin(0.5).setDepth(1000);

            this.tweens.add({
                targets: this.brushText,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 400,
                yoyo: true,
                repeat: -1,
            });
        }
    }

    brushPet() {
        // Play brushing animation
        this.pet.playCleanAnimation();
        soundManager.playClean();

        // Show sparkles
        for (let i = 0; i < 8; i++) {
            this.time.delayedCall(i * 100, () => {
                const sparkle = this.add.text(
                    this.pet.container.x - 30 + Math.random() * 60,
                    this.pet.container.y - 40 + Math.random() * 40,
                    '✨',
                    { fontSize: '16px' }
                );

                this.tweens.add({
                    targets: sparkle,
                    y: sparkle.y - 30,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => sparkle.destroy(),
                });
            });
        }

        // Update stats
        this.time.delayedCall(500, () => {
            try {
                petStats.hairBrushed = true;
                petStats.modifyStat('happiness', 10);
            } catch (e) {
                console.warn('Error updating stats:', e);
            }
            this.ui.showToast(petStats.name + ' looks fabulous!');
        });
    }

    createClothesRack() {
        // Clothes will now be shown when wardrobe is opened
        this.clothesItems = [];
        this.wardrobePanelOpen = false;
    }

    toggleWardrobePanel() {
        if (this.wardrobePanelOpen) {
            this.closeWardrobePanel();
        } else {
            this.openWardrobePanel();
        }
    }

    openWardrobePanel() {
        this.wardrobePanelOpen = true;
        this.wardrobeOpen = true;

        // Create panel overlay
        this.wardrobePanel = this.add.container(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2);
        this.wardrobePanel.setDepth(2000);

        // Background overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(-CONFIG.WIDTH / 2, -CONFIG.HEIGHT / 2, CONFIG.WIDTH, CONFIG.HEIGHT);
        this.wardrobePanel.add(overlay);

        // Panel background
        const panelBg = this.add.graphics();
        panelBg.fillStyle(0x3d2d4a, 1);
        panelBg.fillRect(-200, -180, 400, 360);
        panelBg.lineStyle(4, 0xce93d8);
        panelBg.strokeRect(-200, -180, 400, 360);
        this.wardrobePanel.add(panelBg);

        // Title
        const title = this.add.text(0, -150, '👗 Your Wardrobe', {
            fontSize: '20px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);
        this.wardrobePanel.add(title);

        // Get owned clothes
        const ownedClothes = inventory.ownedClothes;

        if (ownedClothes.length === 0) {
            const noClothes = this.add.text(0, 0, 'No clothes yet!\nVisit the shop to buy some.', {
                fontSize: '16px',
                fontFamily: CONFIG.FONT.FAMILY,
                color: '#888888',
                align: 'center',
            }).setOrigin(0.5);
            this.wardrobePanel.add(noClothes);
        } else {
            // Display clothes in a grid
            const startX = -150;
            const startY = -100;
            const cellWidth = 90;
            const cellHeight = 100;
            const columns = 4;

            ownedClothes.forEach((clothingId, index) => {
                const item = getItemById(clothingId);
                if (!item) return;

                const col = index % columns;
                const row = Math.floor(index / columns);
                const x = startX + col * cellWidth + cellWidth / 2;
                const y = startY + row * cellHeight + cellHeight / 2;

                const clothingCell = this.createWardrobeClothingItem(x, y, item);
                this.wardrobePanel.add(clothingCell);
            });
        }

        // Currently equipped section
        const equippedTitle = this.add.text(0, 100, 'Currently Wearing:', {
            fontSize: '12px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#b0b0b0',
        }).setOrigin(0.5);
        this.wardrobePanel.add(equippedTitle);

        // Show equipped items
        const hatItem = petStats.outfit.hat ? getItemById(petStats.outfit.hat) : null;
        const accItem = petStats.outfit.accessory ? getItemById(petStats.outfit.accessory) : null;

        const equippedText = this.add.text(0, 125,
            `Hat: ${hatItem ? hatItem.name : 'None'} | Accessory: ${accItem ? accItem.name : 'None'}`, {
            fontSize: '11px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ce93d8',
        }).setOrigin(0.5);
        this.wardrobePanel.add(equippedText);

        // Close button
        const closeBtn = this.add.container(0, 155);
        const closeBg = this.add.graphics();
        closeBg.fillStyle(CONFIG.COLORS.PRIMARY, 1);
        closeBg.fillRect(-50, -15, 100, 30);
        const closeText = this.add.text(0, 0, '✕ Close', {
            fontSize: '14px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);
        closeBtn.add([closeBg, closeText]);
        closeBtn.setSize(100, 30);
        closeBtn.setInteractive({ useHandCursor: true });
        closeBtn.on('pointerdown', () => {
            soundManager.playClick();
            this.closeWardrobePanel();
        });
        this.wardrobePanel.add(closeBtn);

        // Animate panel in
        this.wardrobePanel.setScale(0.8);
        this.wardrobePanel.setAlpha(0);
        this.tweens.add({
            targets: this.wardrobePanel,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 200,
            ease: 'Back.easeOut',
        });
    }

    createWardrobeClothingItem(x, y, item) {
        const container = this.add.container(x, y);

        // Background
        const isEquipped = petStats.outfit.hat === item.id || petStats.outfit.accessory === item.id;
        const bg = this.add.graphics();
        bg.fillStyle(isEquipped ? 0x4caf50 : 0x555555, 1);
        bg.fillRect(-35, -40, 70, 80);
        bg.lineStyle(2, isEquipped ? 0x66bb6a : 0x777777);
        bg.strokeRect(-35, -40, 70, 80);
        container.add(bg);

        // Icon
        const icon = this.add.graphics();
        icon.fillStyle(item.color, 1);
        if (item.slot === 'hat') {
            icon.fillRect(-15, -20, 30, 20);
            icon.fillRect(-20, -2, 40, 8);
        } else {
            icon.fillRect(-12, -25, 24, 30);
            icon.fillRect(-18, -20, 10, 20);
            icon.fillRect(8, -20, 10, 20);
        }
        container.add(icon);

        // Name
        const name = this.add.text(0, 20, item.name, {
            fontSize: '10px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);
        container.add(name);

        // Equipped indicator
        if (isEquipped) {
            const equipped = this.add.text(0, 32, '✓ Worn', {
                fontSize: '9px',
                fontFamily: CONFIG.FONT.FAMILY,
                color: '#4caf50',
            }).setOrigin(0.5);
            container.add(equipped);
        }

        // Make interactive
        container.setSize(70, 80);
        container.setInteractive({ useHandCursor: true });

        container.on('pointerover', () => {
            bg.clear();
            bg.fillStyle(isEquipped ? 0x66bb6a : 0x666666, 1);
            bg.fillRect(-35, -40, 70, 80);
            bg.lineStyle(2, 0xce93d8);
            bg.strokeRect(-35, -40, 70, 80);
        });

        container.on('pointerout', () => {
            bg.clear();
            bg.fillStyle(isEquipped ? 0x4caf50 : 0x555555, 1);
            bg.fillRect(-35, -40, 70, 80);
            bg.lineStyle(2, isEquipped ? 0x66bb6a : 0x777777);
            bg.strokeRect(-35, -40, 70, 80);
        });

        container.on('pointerdown', () => {
            soundManager.playClick();
            if (isEquipped) {
                // Unequip
                petStats.unequip(item.slot);
                this.ui.showToast('Removed ' + item.name);
            } else {
                // Equip
                petStats.equip(item);
                this.ui.showToast('Equipped ' + item.name + '!');
            }
            this.pet.refresh();
            // Refresh the panel
            this.closeWardrobePanel();
            this.openWardrobePanel();
        });

        return container;
    }

    closeWardrobePanel() {
        if (!this.wardrobePanel) return;

        this.wardrobePanelOpen = false;
        this.wardrobeOpen = false;

        this.tweens.add({
            targets: this.wardrobePanel,
            scaleX: 0.8,
            scaleY: 0.8,
            alpha: 0,
            duration: 150,
            onComplete: () => {
                this.wardrobePanel.destroy();
                this.wardrobePanel = null;
            },
        });
    }

    createDraggableClothing(x, y, item) {
        const container = this.add.container(x, y);

        const icon = this.add.graphics();
        icon.fillStyle(item.color, 1);

        // Draw different shapes based on clothing type
        if (item.slot === 'hat') {
            icon.fillRect(-12, -10, 24, 15);
            icon.fillRect(-15, 3, 30, 5);
        } else {
            icon.fillRect(-10, -12, 20, 24);
            icon.fillRect(-15, -10, 8, 15);
            icon.fillRect(7, -10, 8, 15);
        }

        container.add(icon);

        // Make draggable
        container.setSize(35, 35);
        container.setInteractive({ useHandCursor: true, draggable: true });
        container.itemData = item;

        this.input.setDraggable(container);

        container.on('dragstart', () => {
            this.isDraggingClothing = true;
            soundManager.playClick();
            container.setScale(1.3);
            container.setDepth(1000);
            this.showPetClothingZone(true);
        });

        container.on('drag', (pointer, dragX, dragY) => {
            container.x = dragX;
            container.y = dragY;
        });

        container.on('dragend', () => {
            this.isDraggingClothing = false;
            container.setScale(1);
            container.setDepth(0);
            this.showPetClothingZone(false);

            // Check if dropped on pet
            const dist = Phaser.Math.Distance.Between(
                container.x, container.y,
                this.pet.container.x, this.pet.container.y
            );

            if (dist < 60) {
                this.equipClothingWithDrag(container.itemData, container);
            } else {
                // Return to rack
                const homeData = this.clothesItems.find(c => c.container === container);
                if (homeData) {
                    this.tweens.add({
                        targets: container,
                        x: homeData.homeX,
                        y: homeData.homeY,
                        duration: 200,
                    });
                }
            }
        });

        return container;
    }

    showPetClothingZone(show) {
        if (!this.clothingHighlight) {
            this.clothingHighlight = this.add.graphics();
        }

        this.clothingHighlight.clear();

        if (show) {
            this.clothingHighlight.lineStyle(3, 0xce93d8, 0.8);
            this.clothingHighlight.strokeCircle(this.pet.container.x, this.pet.container.y, 60);
            this.clothingHighlight.fillStyle(0xce93d8, 0.1);
            this.clothingHighlight.fillCircle(this.pet.container.x, this.pet.container.y, 60);
        }
    }

    equipClothingWithDrag(item, container) {
        // Animate clothing onto pet
        this.tweens.add({
            targets: container,
            x: this.pet.container.x,
            y: this.pet.container.y - 30,
            scaleX: 0.5,
            scaleY: 0.5,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                soundManager.playClick();
                try {
                    petStats.equip(item);
                } catch (e) {
                    console.warn('Error equipping:', e);
                }
                this.pet.refresh();
                this.ui.showToast('Equipped ' + item.name + '!');

                // Show sparkles
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2;
                    const sparkle = this.add.graphics();
                    sparkle.fillStyle(0xffeb3b, 1);
                    sparkle.fillRect(-3, -3, 6, 6);
                    sparkle.x = this.pet.container.x + Math.cos(angle) * 30;
                    sparkle.y = this.pet.container.y - 30 + Math.sin(angle) * 30;

                    this.tweens.add({
                        targets: sparkle,
                        x: sparkle.x + Math.cos(angle) * 30,
                        y: sparkle.y + Math.sin(angle) * 30,
                        alpha: 0,
                        duration: 400,
                        onComplete: () => sparkle.destroy(),
                    });
                }

                // Reset container position
                const homeData = this.clothesItems.find(c => c.container === container);
                if (homeData) {
                    container.setScale(1);
                    container.setAlpha(1);
                    container.x = homeData.homeX;
                    container.y = homeData.homeY;
                }
            },
        });
    }

    createNavigationButtons() {
        // Back to Home button
        const backBtn = this.add.container(70, CONFIG.HEIGHT - 40);

        const btnBg = this.add.graphics();
        btnBg.fillStyle(CONFIG.COLORS.PRIMARY, 1);
        btnBg.fillRect(-50, -18, 100, 36);
        btnBg.lineStyle(2, 0x7986cb);
        btnBg.strokeRect(-50, -18, 100, 36);

        const btnText = this.add.text(0, 0, '🏠 Home', {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        backBtn.add([btnBg, btnText]);
        backBtn.setSize(100, 36);
        backBtn.setInteractive({ useHandCursor: true });

        backBtn.on('pointerover', () => {
            btnBg.clear();
            btnBg.fillStyle(0x7986cb, 1);
            btnBg.fillRect(-50, -18, 100, 36);
            btnBg.lineStyle(2, CONFIG.COLORS.ACCENT);
            btnBg.strokeRect(-50, -18, 100, 36);
        });

        backBtn.on('pointerout', () => {
            btnBg.clear();
            btnBg.fillStyle(CONFIG.COLORS.PRIMARY, 1);
            btnBg.fillRect(-50, -18, 100, 36);
            btnBg.lineStyle(2, 0x7986cb);
            btnBg.strokeRect(-50, -18, 100, 36);
        });

        backBtn.on('pointerdown', () => {
            soundManager.playClick();
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start(CONFIG.SCENES.HOME);
            });
        });

        // Shop button
        const shopBtn = this.add.container(CONFIG.WIDTH - 70, CONFIG.HEIGHT - 40);

        const shopBg = this.add.graphics();
        shopBg.fillStyle(CONFIG.COLORS.ACCENT, 1);
        shopBg.fillRect(-50, -18, 100, 36);

        const shopText = this.add.text(0, 0, '🛒 Shop', {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#000000',
        }).setOrigin(0.5);

        shopBtn.add([shopBg, shopText]);
        shopBtn.setSize(100, 36);
        shopBtn.setInteractive({ useHandCursor: true });

        shopBtn.on('pointerdown', () => {
            soundManager.playClick();
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start(CONFIG.SCENES.SHOP);
            });
        });
    }

    createDragHints() {
        this.hintText = this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT - 10,
            '💡 Drag clothes to dress up | Drag brush to groom your pet!', {
            fontSize: '10px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#888888',
        }).setOrigin(0.5);
    }

    shutdown() {
        petStats.removeListener(this.statListener);
        inventory.removeListener(this.statListener);

        if (this.pet) {
            this.pet.destroy();
        }
        if (this.ui) {
            this.ui.destroy();
        }

        // Clean up clothes items
        if (this.clothesItems) {
            this.clothesItems.forEach(item => {
                if (item && item.container) {
                    item.container.destroy();
                }
            });
        }
    }
}
