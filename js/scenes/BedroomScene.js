// PixelPal - Bedroom Scene (Sleep area)

class BedroomScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENES.BEDROOM });
    }

    create() {
        // Resume audio context on first interaction
        this.input.once('pointerdown', () => {
            soundManager.resume();
        });

        // Create background
        this.createBackground();

        // Create the bed
        this.createBed();

        // Create pet
        this.pet = new Pet(this, CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 + 50);

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
            } catch (e) {
                // Scene may have been destroyed
            }
        };
        petStats.addListener(this.statListener);
        inventory.addListener(this.statListener);

        // Create drop zone for bed
        this.createDropZone();

        // Create hints
        this.createDragHints();

        // Scene transition fade in
        this.cameras.main.fadeIn(300, 0, 0, 0);

        // Listen for shutdown event
        this.events.on('shutdown', this.shutdown, this);
    }

    createBackground() {
        // Track if it's night mode (light on = night, light off = morning)
        this.isNightMode = false;

        this.bgGraphics = this.add.graphics();
        this.drawBackground();

        // Create clickable lamp for light toggle
        this.createLampSwitch();
    }

    drawBackground() {
        const bg = this.bgGraphics;
        bg.clear();

        if (this.isNightMode) {
            // Night mode - dark cozy bedroom
            bg.fillStyle(0x1a1a2e, 1);
            bg.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

            // Subtle wallpaper pattern (darker)
            bg.fillStyle(0x222238, 0.5);
            for (let y = 0; y < CONFIG.HEIGHT; y += 30) {
                for (let x = (y % 60 === 0) ? 0 : 15; x < CONFIG.WIDTH; x += 30) {
                    bg.fillCircle(x, y, 3);
                }
            }
        } else {
            // Morning mode - bright bedroom
            bg.fillStyle(0x5d6d7e, 1);
            bg.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

            // Subtle wallpaper pattern (lighter)
            bg.fillStyle(0x6d7d8e, 0.5);
            for (let y = 0; y < CONFIG.HEIGHT; y += 30) {
                for (let x = (y % 60 === 0) ? 0 : 15; x < CONFIG.WIDTH; x += 30) {
                    bg.fillCircle(x, y, 3);
                }
            }
        }

        // Wooden floor
        bg.fillStyle(0x4a3728, 1);
        bg.fillRect(0, CONFIG.HEIGHT - 120, CONFIG.WIDTH, 120);

        // Floor planks
        bg.lineStyle(2, 0x3d2d22);
        for (let x = 0; x < CONFIG.WIDTH; x += 100) {
            bg.lineBetween(x, CONFIG.HEIGHT - 120, x, CONFIG.HEIGHT);
        }
        for (let y = CONFIG.HEIGHT - 120; y < CONFIG.HEIGHT; y += 40) {
            bg.lineBetween(0, y, CONFIG.WIDTH, y);
        }

        // Window (morning or night)
        this.drawWindow(bg);

        // Nightstand with lamp
        this.drawNightstand(bg);

        // Rug
        bg.fillStyle(0x5c6bc0, 1);
        bg.fillEllipse(CONFIG.WIDTH / 2, CONFIG.HEIGHT - 70, 250, 60);
        bg.fillStyle(0x7986cb, 1);
        bg.fillEllipse(CONFIG.WIDTH / 2, CONFIG.HEIGHT - 70, 200, 45);
        bg.fillStyle(0x9fa8da, 1);
        bg.fillEllipse(CONFIG.WIDTH / 2, CONFIG.HEIGHT - 70, 140, 30);
    }

    drawWindow(bg) {
        const windowX = CONFIG.WIDTH - 180;
        const windowY = 80;

        if (this.isNightMode) {
            // Night window - dark sky with stars and moon
            bg.fillStyle(0x1a1a2e, 1);
            bg.fillRect(windowX, windowY, 120, 100);

            // Stars in window
            bg.fillStyle(0xffffff, 0.8);
            bg.fillCircle(windowX + 25, windowY + 20, 2);
            bg.fillCircle(windowX + 90, windowY + 35, 2);
            bg.fillCircle(windowX + 45, windowY + 70, 1);
            bg.fillCircle(windowX + 100, windowY + 80, 2);
            bg.fillCircle(windowX + 70, windowY + 25, 1);
            bg.fillCircle(windowX + 55, windowY + 40, 2);

            // Moon
            bg.fillStyle(0xfff9c4, 1);
            bg.fillCircle(windowX + 30, windowY + 65, 15);
            bg.fillStyle(0x1a1a2e, 1);
            bg.fillCircle(windowX + 25, windowY + 60, 12);

            // Dark purple curtains
            bg.fillStyle(0x4a235a, 0.9);
            bg.fillRect(windowX - 15, windowY - 10, 20, 120);
            bg.fillRect(windowX + 115, windowY - 10, 20, 120);
        } else {
            // Morning window - bright blue sky with sun
            bg.fillStyle(0x87ceeb, 1);
            bg.fillRect(windowX, windowY, 120, 100);

            // Sun
            bg.fillStyle(0xffeb3b, 1);
            bg.fillCircle(windowX + 80, windowY + 30, 18);
            bg.fillStyle(0xfff59d, 0.4);
            bg.fillCircle(windowX + 80, windowY + 30, 28);

            // Fluffy clouds
            bg.fillStyle(0xffffff, 0.9);
            bg.fillCircle(windowX + 25, windowY + 60, 12);
            bg.fillCircle(windowX + 40, windowY + 58, 10);
            bg.fillCircle(windowX + 32, windowY + 52, 10);

            bg.fillCircle(windowX + 95, windowY + 75, 8);
            bg.fillCircle(windowX + 105, windowY + 73, 7);

            // Light pink curtains
            bg.fillStyle(0xf8bbd9, 0.8);
            bg.fillRect(windowX - 15, windowY - 10, 20, 120);
            bg.fillRect(windowX + 115, windowY - 10, 20, 120);
        }

        // Window frame
        bg.lineStyle(6, 0x5d4037);
        bg.strokeRect(windowX, windowY, 120, 100);
        bg.lineStyle(3, 0x5d4037);
        bg.lineBetween(windowX + 60, windowY, windowX + 60, windowY + 100);
        bg.lineBetween(windowX, windowY + 50, windowX + 120, windowY + 50);
    }

    drawNightstand(bg) {
        const standX = 100;
        const standY = CONFIG.HEIGHT - 180;

        // Nightstand
        bg.fillStyle(0x5d4037, 1);
        bg.fillRect(standX - 30, standY, 60, 60);
        bg.fillStyle(0x6d4c41, 1);
        bg.fillRect(standX - 25, standY + 5, 50, 25);
        bg.fillStyle(0xffc107, 1);
        bg.fillCircle(standX, standY + 17, 3);

        // Lamp base
        bg.fillStyle(0x424242, 1);
        bg.fillRect(standX - 5, standY - 30, 10, 30);

        // Lamp shade
        if (this.isNightMode) {
            // Lamp ON - glowing yellow
            bg.fillStyle(0xffeb3b, 1);
            bg.beginPath();
            bg.moveTo(standX - 20, standY - 30);
            bg.lineTo(standX + 20, standY - 30);
            bg.lineTo(standX + 12, standY - 55);
            bg.lineTo(standX - 12, standY - 55);
            bg.closePath();
            bg.fill();

            // Lamp glow effect
            bg.fillStyle(0xfff59d, 0.25);
            bg.fillCircle(standX, standY - 20, 80);
        } else {
            // Lamp OFF - gray shade
            bg.fillStyle(0x9e9e9e, 1);
            bg.beginPath();
            bg.moveTo(standX - 20, standY - 30);
            bg.lineTo(standX + 20, standY - 30);
            bg.lineTo(standX + 12, standY - 55);
            bg.lineTo(standX - 12, standY - 55);
            bg.closePath();
            bg.fill();
        }
    }

    createLampSwitch() {
        const standX = 100;
        const standY = CONFIG.HEIGHT - 180;

        // Create interactive zone over the lamp
        this.lampButton = this.add.container(standX, standY - 40);

        const hitArea = this.add.graphics();
        hitArea.fillStyle(0x000000, 0); // Invisible
        hitArea.fillRect(-25, -25, 50, 50);

        this.lampButton.add(hitArea);
        this.lampButton.setSize(50, 50);
        this.lampButton.setInteractive({ useHandCursor: true });

        // Light toggle label
        this.lightLabel = this.add.text(standX, standY - 70, '💡 Click lamp', {
            fontSize: '10px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#888888',
        }).setOrigin(0.5);

        this.lampButton.on('pointerdown', () => {
            soundManager.playClick();
            this.toggleLight();
        });

        this.lampButton.on('pointerover', () => {
            this.lightLabel.setColor('#ffeb3b');
            this.lightLabel.setText(this.isNightMode ? '☀️ Turn Off' : '🌙 Turn On');
        });

        this.lampButton.on('pointerout', () => {
            this.lightLabel.setColor('#888888');
            this.lightLabel.setText('💡 Click lamp');
        });
    }

    toggleLight() {
        this.isNightMode = !this.isNightMode;

        // Flash effect
        this.cameras.main.flash(100, 255, 255, 200);

        // Redraw background
        this.drawBackground();

        // Update label
        if (this.isNightMode) {
            this.ui.showToast('Lights on - Goodnight!');
        } else {
            this.ui.showToast('Good morning!');
        }
    }

    createBed() {
        const bedX = CONFIG.WIDTH / 2;
        const bedY = CONFIG.HEIGHT - 200;

        this.bedContainer = this.add.container(bedX, bedY);

        const bed = this.add.graphics();

        // Bed frame (large cozy bed)
        bed.fillStyle(0x5d4037, 1);

        // Headboard
        bed.fillRect(-120, -80, 240, 20);
        bed.fillRect(-130, -100, 20, 120);
        bed.fillRect(110, -100, 20, 120);

        // Headboard detail
        bed.fillStyle(0x6d4c41, 1);
        bed.fillRect(-115, -75, 230, 12);

        // Bed base
        bed.fillStyle(0x4e342e, 1);
        bed.fillRect(-130, 10, 260, 30);

        // Mattress
        bed.fillStyle(0xffffff, 1);
        bed.fillRect(-120, -60, 240, 75);

        // Blanket
        bed.fillStyle(0x7986cb, 1);
        bed.fillRect(-120, -40, 240, 55);

        // Blanket pattern (stripes)
        bed.fillStyle(0x5c6bc0, 1);
        for (let x = -110; x < 120; x += 40) {
            bed.fillRect(x, -35, 20, 45);
        }

        // Pillows
        bed.fillStyle(0xfff9c4, 1);
        bed.fillRect(-100, -75, 70, 30);
        bed.fillRect(30, -75, 70, 30);
        bed.fillStyle(0xfff59d, 1);
        bed.fillRect(-95, -70, 60, 20);
        bed.fillRect(35, -70, 60, 20);

        // Bed legs
        bed.fillStyle(0x3e2723, 1);
        bed.fillRect(-130, 35, 15, 20);
        bed.fillRect(115, 35, 15, 20);

        this.bedContainer.add(bed);

        // Label
        const label = this.add.text(0, 70, 'Drag ' + petStats.name + ' here to sleep', {
            fontSize: '12px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#b0b0b0',
            backgroundColor: '#00000080',
            padding: { x: 6, y: 2 },
        }).setOrigin(0.5);
        this.bedContainer.add(label);

        // Bed zone for dropping pet
        this.bedZone = { x: bedX, y: bedY - 20, radius: 100 };
    }

    createDropZone() {
        // Make the pet draggable to bed
        this.pet.container.setSize(80, 100);
        this.pet.container.setInteractive({ useHandCursor: true, draggable: true });

        this.input.setDraggable(this.pet.container);

        this.pet.container.on('dragstart', () => {
            soundManager.playClick();
            this.pet.stopIdleAnimation();
            this.pet.container.setScale(1.1);
            this.showBedZone(true);
        });

        this.pet.container.on('drag', (pointer, dragX, dragY) => {
            this.pet.container.x = dragX;
            this.pet.container.y = dragY;
        });

        this.pet.container.on('dragend', () => {
            this.pet.container.setScale(1);
            this.showBedZone(false);

            // Check if dropped on bed
            const dist = Phaser.Math.Distance.Between(
                this.pet.container.x, this.pet.container.y,
                this.bedZone.x, this.bedZone.y
            );

            if (dist < this.bedZone.radius) {
                this.putPetToBed();
            } else {
                // Return to center
                this.tweens.add({
                    targets: this.pet.container,
                    x: CONFIG.WIDTH / 2,
                    y: CONFIG.HEIGHT / 2 + 50,
                    duration: 300,
                    ease: 'Back.easeOut',
                    onComplete: () => {
                        this.pet.startIdleAnimation();
                    },
                });
            }
        });
    }

    showBedZone(show) {
        if (!this.bedHighlight) {
            this.bedHighlight = this.add.graphics();
        }

        this.bedHighlight.clear();

        if (show) {
            this.bedHighlight.lineStyle(4, 0x81d4fa, 0.8);
            this.bedHighlight.strokeCircle(this.bedZone.x, this.bedZone.y, this.bedZone.radius);
            this.bedHighlight.fillStyle(0x81d4fa, 0.15);
            this.bedHighlight.fillCircle(this.bedZone.x, this.bedZone.y, this.bedZone.radius);
        }
    }

    putPetToBed() {
        if (petStats.energy >= 95) {
            this.ui.showToast(petStats.name + ' is not tired!');
            this.tweens.add({
                targets: this.pet.container,
                x: CONFIG.WIDTH / 2,
                y: CONFIG.HEIGHT / 2 + 50,
                duration: 300,
                onComplete: () => this.pet.startIdleAnimation(),
            });
            return;
        }

        // Move pet to bed
        this.tweens.add({
            targets: this.pet.container,
            x: this.bedZone.x,
            y: this.bedZone.y,
            angle: -90,
            scaleX: 0.8,
            scaleY: 0.8,
            duration: 500,
            onComplete: () => {
                // Darken screen
                const darkness = this.add.graphics();
                darkness.fillStyle(0x000000, 0);
                darkness.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
                darkness.setDepth(500);

                // Zzz text
                const zzzText = this.add.text(this.bedZone.x + 50, this.bedZone.y - 50, 'Zzz...', {
                    fontSize: '24px',
                    fontFamily: CONFIG.FONT.FAMILY,
                    color: '#ffffff',
                }).setDepth(501);

                this.tweens.add({
                    targets: zzzText,
                    y: zzzText.y - 20,
                    alpha: 0.5,
                    duration: 800,
                    yoyo: true,
                    repeat: 2,
                });

                // Fade to dark
                this.tweens.add({
                    targets: darkness,
                    fillAlpha: 0.8,
                    duration: 800,
                    onComplete: () => {
                        this.pet.playSleepAnimation();
                        soundManager.playSleep();

                        // Wait then wake up
                        this.time.delayedCall(2500, () => {
                            try {
                                petStats.sleep(50);
                            } catch (e) {
                                console.warn('Error updating stats:', e);
                            }

                            zzzText.destroy();

                            // Fade back and return pet
                            this.tweens.add({
                                targets: darkness,
                                alpha: 0,
                                duration: 800,
                                onComplete: () => {
                                    darkness.destroy();

                                    // Return pet to center
                                    this.tweens.add({
                                        targets: this.pet.container,
                                        x: CONFIG.WIDTH / 2,
                                        y: CONFIG.HEIGHT / 2 + 50,
                                        angle: 0,
                                        scaleX: 1,
                                        scaleY: 1,
                                        duration: 500,
                                        onComplete: () => {
                                            this.pet.startIdleAnimation();
                                            this.ui.showToast(petStats.name + ' feels refreshed!');
                                        },
                                    });
                                },
                            });
                        });
                    },
                });
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
            // Save before leaving
            saveSystem.saveNow();
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start(CONFIG.SCENES.HOME);
            });
        });
    }

    createDragHints() {
        this.hintText = this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT - 15,
            '💡 Drag your pet to the bed to rest and restore energy!', {
            fontSize: '11px',
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
    }
}
