// PixelPal - Playground Scene

class PlaygroundScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENES.PLAYGROUND });
    }

    create() {
        // Create background
        this.createBackground();

        // Define equipment zones BEFORE creating equipment
        // These are the drop zones where players can drag the pet
        const groundY = CONFIG.HEIGHT - 180;
        this.equipmentZones = {
            swing: { x: 120, y: groundY - 60, radius: 70 },
            slide: { x: 280, y: groundY - 70, radius: 80 },
            trampoline: { x: 450, y: groundY - 40, radius: 70 },
            museum: { x: 580, y: groundY - 90, radius: 70 },
            snowhill: { x: 710, y: groundY - 50, radius: 70 },
        };

        // Create playground equipment
        this.createSwing();
        this.createSlide();
        this.createTrampoline();
        this.createMuseum();
        this.createSnowHill();

        // Create draggable pet - standing on the ground
        this.petHomeX = 400;
        this.petHomeY = groundY - 30; // Standing on grass
        this.createDraggablePet();

        // Create UI
        this.createUI();

        // Instructions
        this.instructions = this.add.text(CONFIG.WIDTH / 2, 30, 'Drag your pet to the equipment!', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            backgroundColor: '#00000080',
            padding: { x: 10, y: 5 },
        }).setOrigin(0.5);

        // Highlight indicators (hidden by default)
        this.createHighlights();

        // Fade in
        this.cameras.main.fadeIn(300, 0, 0, 0);
    }

    createBackground() {
        const bg = this.add.graphics();

        // Sky
        bg.fillStyle(0x87ceeb, 1);
        bg.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Sun
        bg.fillStyle(0xffeb3b, 1);
        bg.fillCircle(650, 80, 50);
        bg.fillStyle(0xfff59d, 0.5);
        bg.fillCircle(650, 80, 70);

        // Clouds
        this.drawCloud(bg, 100, 60, 1);
        this.drawCloud(bg, 300, 100, 0.8);
        this.drawCloud(bg, 550, 50, 0.6);

        // Ground (grass)
        bg.fillStyle(0x4caf50, 1);
        bg.fillRect(0, CONFIG.HEIGHT - 180, CONFIG.WIDTH, 180);

        // Grass details
        bg.fillStyle(0x66bb6a, 1);
        for (let x = 0; x < CONFIG.WIDTH; x += 20) {
            const height = 10 + Math.random() * 10;
            bg.fillRect(x, CONFIG.HEIGHT - 180 - height, 4, height);
        }

        // Flowers
        const flowerColors = [0xf06292, 0xffeb3b, 0x42a5f5, 0xce93d8];
        for (let i = 0; i < 15; i++) {
            const x = 50 + Math.random() * (CONFIG.WIDTH - 100);
            const y = CONFIG.HEIGHT - 160 + Math.random() * 40;
            bg.fillStyle(flowerColors[Math.floor(Math.random() * flowerColors.length)], 1);
            bg.fillCircle(x, y, 5);
            bg.fillStyle(0xffeb3b, 1);
            bg.fillCircle(x, y, 2);
        }

        // Fence in background
        bg.fillStyle(0x8d6e63, 1);
        for (let x = 0; x < CONFIG.WIDTH; x += 40) {
            bg.fillRect(x, CONFIG.HEIGHT - 220, 8, 50);
        }
        bg.fillRect(0, CONFIG.HEIGHT - 210, CONFIG.WIDTH, 8);
        bg.fillRect(0, CONFIG.HEIGHT - 190, CONFIG.WIDTH, 8);
    }

    drawCloud(graphics, x, y, scale) {
        graphics.fillStyle(0xffffff, 0.9);
        graphics.fillCircle(x, y, 25 * scale);
        graphics.fillCircle(x + 30 * scale, y, 30 * scale);
        graphics.fillCircle(x + 60 * scale, y, 25 * scale);
        graphics.fillCircle(x + 15 * scale, y - 15 * scale, 20 * scale);
        graphics.fillCircle(x + 45 * scale, y - 15 * scale, 20 * scale);
    }

    createHighlights() {
        this.highlights = {};

        // Create glowing circles for each equipment zone
        for (const key in this.equipmentZones) {
            const zone = this.equipmentZones[key];
            const highlight = this.add.graphics();
            highlight.lineStyle(4, 0xffeb3b, 0.8);
            highlight.strokeCircle(zone.x, zone.y, zone.radius);
            highlight.fillStyle(0xffeb3b, 0.1);
            highlight.fillCircle(zone.x, zone.y, zone.radius);
            highlight.setVisible(false);
            this.highlights[key] = highlight;
        }
    }

    createSwing() {
        const groundY = CONFIG.HEIGHT - 180; // Ground level (top of grass)
        const swingX = 150;
        const frameHeight = 150;
        const topY = groundY - frameHeight;
        const ropeLength = 90;

        // Swing frame - two A-frames connected by a horizontal bar (side view)
        const frame = this.add.graphics();

        // Back A-frame (darker, further away)
        frame.lineStyle(8, 0x6d4c41);
        frame.lineBetween(swingX - 40, groundY + 5, swingX - 20, topY);
        frame.lineBetween(swingX + 40, groundY + 5, swingX + 20, topY);

        // Top horizontal bar connecting the frames
        frame.lineStyle(10, 0x8d6e63);
        frame.lineBetween(swingX - 25, topY, swingX + 25, topY);

        // Front A-frame legs (lighter, closer)
        frame.lineStyle(8, 0x8d6e63);
        frame.lineBetween(swingX - 45, groundY + 5, swingX - 20, topY);
        frame.lineBetween(swingX + 45, groundY + 5, swingX + 20, topY);

        // Swing seat container - pivot point at top bar
        // The pet will be added to this container so it swings together
        this.swingSeat = this.add.container(swingX, topY);

        // Ropes/chains hanging down from pivot
        const ropes = this.add.graphics();
        ropes.lineStyle(3, 0x5d4037);
        ropes.lineBetween(-15, 0, -15, ropeLength);
        ropes.lineBetween(15, 0, 15, ropeLength);

        // Seat at bottom of ropes
        const seat = this.add.graphics();
        seat.fillStyle(0x3e2723, 1);
        seat.fillRect(-20, ropeLength - 5, 40, 8);

        this.swingSeat.add([ropes, seat]);

        this.swingX = swingX;
        this.swingY = topY;
        this.swingRopeLength = ropeLength;

        // Label
        this.add.text(swingX, groundY + 30, 'Swing', {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            backgroundColor: '#00000080',
            padding: { x: 5, y: 2 },
        }).setOrigin(0.5);
    }

    createSlide() {
        const groundY = CONFIG.HEIGHT - 180; // Ground level
        const platformHeight = 140; // How tall the platform is
        const platformTop = groundY - platformHeight;
        const slideX = 280;

        const slide = this.add.graphics();

        // Ladder legs - go into ground
        slide.fillStyle(0x5d4037, 1);
        slide.fillRect(slideX - 70, platformTop, 12, platformHeight + 15);
        slide.fillRect(slideX - 40, platformTop, 12, platformHeight + 15);

        // Ladder rungs
        slide.fillStyle(0x6d4c41, 1);
        for (let y = platformTop + 25; y < groundY - 10; y += 30) {
            slide.fillRect(slideX - 72, y, 46, 6);
        }

        // Platform at top
        slide.fillStyle(0x5d4037, 1);
        slide.fillRect(slideX - 80, platformTop - 8, 90, 12);

        // Platform support beam
        slide.fillStyle(0x4e342e, 1);
        slide.fillRect(slideX - 75, platformTop, 5, platformHeight + 10);

        // Slide surface - goes from platform to ground
        const slideEndX = slideX + 130;
        slide.fillStyle(0xef5350, 1);
        slide.beginPath();
        slide.moveTo(slideX, platformTop);
        slide.lineTo(slideEndX, groundY + 5);
        slide.lineTo(slideEndX + 25, groundY + 5);
        slide.lineTo(slideX + 25, platformTop);
        slide.closePath();
        slide.fill();

        // Slide side rails
        slide.fillStyle(0xc62828, 1);
        // Top rail piece
        slide.fillRect(slideX - 2, platformTop - 12, 30, 15);
        // Left rail going down
        slide.lineStyle(6, 0xc62828);
        slide.lineBetween(slideX - 2, platformTop, slideEndX - 2, groundY + 5);
        // Right rail going down
        slide.lineBetween(slideX + 27, platformTop, slideEndX + 27, groundY + 5);

        // Store slide positions for animation
        this.slideStartX = slideX + 12;
        this.slideStartY = platformTop - 15;
        this.slideEndX = slideEndX + 12;
        this.slideEndY = groundY - 20;

        // Label
        this.add.text(slideX + 40, groundY + 30, 'Slide', {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            backgroundColor: '#00000080',
            padding: { x: 5, y: 2 },
        }).setOrigin(0.5);
    }

    createTrampoline() {
        const groundY = CONFIG.HEIGHT - 180; // Ground level
        const trampolineX = 450;
        const frameHeight = 35; // Height of frame above ground
        const surfaceY = groundY - frameHeight;

        const trampoline = this.add.graphics();

        // Frame/legs - planted in ground
        trampoline.fillStyle(0x424242, 1);
        // Left legs (front and back for 3D effect)
        trampoline.fillRect(trampolineX - 58, surfaceY + 10, 8, frameHeight + 10);
        trampoline.fillRect(trampolineX - 48, surfaceY + 12, 6, frameHeight + 8);
        // Right legs
        trampoline.fillRect(trampolineX + 50, surfaceY + 10, 8, frameHeight + 10);
        trampoline.fillRect(trampolineX + 42, surfaceY + 12, 6, frameHeight + 8);

        // Metal frame ring
        trampoline.lineStyle(6, 0x37474f);
        trampoline.strokeEllipse(trampolineX, surfaceY + 8, 130, 25);

        // Springs connecting frame to surface
        trampoline.lineStyle(2, 0x757575);
        for (let angle = 0; angle < 360; angle += 30) {
            const rad = angle * Math.PI / 180;
            const outerX = trampolineX + Math.cos(rad) * 62;
            const outerY = surfaceY + 8 + Math.sin(rad) * 10;
            const innerX = trampolineX + Math.cos(rad) * 50;
            const innerY = surfaceY + Math.sin(rad) * 8;
            trampoline.lineBetween(outerX, outerY, innerX, innerY);
        }

        // Bouncy surface (on top)
        trampoline.fillStyle(0x1565c0, 1);
        trampoline.fillEllipse(trampolineX, surfaceY, 110, 20);
        trampoline.fillStyle(0x1976d2, 1);
        trampoline.fillEllipse(trampolineX, surfaceY, 90, 14);
        // Surface pattern
        trampoline.lineStyle(1, 0x0d47a1, 0.3);
        trampoline.strokeEllipse(trampolineX, surfaceY, 70, 10);
        trampoline.strokeEllipse(trampolineX, surfaceY, 40, 6);

        this.trampolineX = trampolineX;
        this.trampolineY = surfaceY; // Where pet bounces from

        // Label
        this.add.text(trampolineX, groundY + 30, 'Trampoline', {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            backgroundColor: '#00000080',
            padding: { x: 5, y: 2 },
        }).setOrigin(0.5);
    }

    createMuseum() {
        const groundY = CONFIG.HEIGHT - 180;
        const museumX = 580;

        const museum = this.add.graphics();

        // Museum building - small cute building
        // Foundation
        museum.fillStyle(0x9e9e9e, 1);
        museum.fillRect(museumX - 50, groundY - 10, 100, 15);

        // Main building body
        museum.fillStyle(0xfff8e1, 1);
        museum.fillRect(museumX - 45, groundY - 100, 90, 90);

        // Roof - triangular pediment
        museum.fillStyle(0x8d6e63, 1);
        museum.beginPath();
        museum.moveTo(museumX - 50, groundY - 100);
        museum.lineTo(museumX, groundY - 140);
        museum.lineTo(museumX + 50, groundY - 100);
        museum.closePath();
        museum.fill();

        // Columns
        museum.fillStyle(0xffffff, 1);
        museum.fillRect(museumX - 38, groundY - 95, 12, 70);
        museum.fillRect(museumX - 6, groundY - 95, 12, 70);
        museum.fillRect(museumX + 26, groundY - 95, 12, 70);

        // Column tops
        museum.fillStyle(0xe0e0e0, 1);
        museum.fillRect(museumX - 40, groundY - 98, 16, 6);
        museum.fillRect(museumX - 8, groundY - 98, 16, 6);
        museum.fillRect(museumX + 24, groundY - 98, 16, 6);

        // Door
        museum.fillStyle(0x5d4037, 1);
        museum.fillRect(museumX - 12, groundY - 50, 24, 40);
        // Door handle
        museum.fillStyle(0xffd700, 1);
        museum.fillCircle(museumX + 6, groundY - 30, 3);

        // Windows
        museum.fillStyle(0x81d4fa, 1);
        museum.fillRect(museumX - 35, groundY - 85, 15, 20);
        museum.fillRect(museumX + 20, groundY - 85, 15, 20);

        // Art icon on building
        museum.fillStyle(0xffeb3b, 1);
        museum.fillRect(museumX - 8, groundY - 125, 16, 12);
        museum.fillStyle(0x4caf50, 1);
        museum.fillCircle(museumX, groundY - 119, 4);

        this.museumX = museumX;
        this.museumY = groundY - 30;

        // Label
        this.add.text(museumX, groundY + 30, '🎨 Museum', {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            backgroundColor: '#00000080',
            padding: { x: 5, y: 2 },
        }).setOrigin(0.5);
    }

    createSnowHill() {
        const groundY = CONFIG.HEIGHT - 180;
        const hillX = 710;

        const snowHill = this.add.graphics();

        // Snow patch background
        snowHill.fillStyle(0xe3f2fd, 1);
        snowHill.fillRect(hillX - 60, groundY - 120, 120, 130);

        // Snowy hill shape
        snowHill.fillStyle(0xffffff, 1);
        snowHill.beginPath();
        snowHill.moveTo(hillX - 55, groundY + 5);
        snowHill.lineTo(hillX - 40, groundY - 80);
        snowHill.lineTo(hillX + 10, groundY - 100);
        snowHill.lineTo(hillX + 55, groundY - 40);
        snowHill.lineTo(hillX + 55, groundY + 5);
        snowHill.closePath();
        snowHill.fill();

        // Snow texture/shadows
        snowHill.fillStyle(0xbbdefb, 0.5);
        snowHill.fillEllipse(hillX - 20, groundY - 50, 30, 15);
        snowHill.fillEllipse(hillX + 20, groundY - 30, 25, 10);

        // Pine tree on hill
        snowHill.fillStyle(0x5d4037, 1);
        snowHill.fillRect(hillX + 30, groundY - 70, 8, 25);
        snowHill.fillStyle(0x2e7d32, 1);
        snowHill.beginPath();
        snowHill.moveTo(hillX + 34, groundY - 110);
        snowHill.lineTo(hillX + 20, groundY - 70);
        snowHill.lineTo(hillX + 48, groundY - 70);
        snowHill.closePath();
        snowHill.fill();
        // Snow on tree
        snowHill.fillStyle(0xffffff, 0.8);
        snowHill.fillCircle(hillX + 28, groundY - 85, 6);
        snowHill.fillCircle(hillX + 40, groundY - 80, 5);

        // Skis and sled at bottom
        // Skis
        snowHill.fillStyle(0x1565c0, 1);
        snowHill.fillRect(hillX - 45, groundY - 15, 25, 4);
        snowHill.fillRect(hillX - 45, groundY - 8, 25, 4);
        // Sled
        snowHill.fillStyle(0xc62828, 1);
        snowHill.fillRect(hillX + 10, groundY - 12, 30, 8);
        snowHill.fillStyle(0x8d6e63, 1);
        snowHill.fillRect(hillX + 12, groundY - 5, 4, 6);
        snowHill.fillRect(hillX + 34, groundY - 5, 4, 6);

        // Snowflakes
        const snowflakePositions = [
            { x: hillX - 30, y: groundY - 90 },
            { x: hillX + 5, y: groundY - 70 },
            { x: hillX - 15, y: groundY - 110 },
        ];
        snowflakePositions.forEach(pos => {
            snowHill.fillStyle(0xffffff, 1);
            snowHill.fillCircle(pos.x, pos.y, 3);
            snowHill.lineStyle(1, 0xffffff);
            snowHill.lineBetween(pos.x - 5, pos.y, pos.x + 5, pos.y);
            snowHill.lineBetween(pos.x, pos.y - 5, pos.x, pos.y + 5);
        });

        this.snowHillX = hillX;
        this.snowHillY = groundY - 100; // Top of hill
        this.snowHillBottomY = groundY - 20;

        // Label
        this.add.text(hillX, groundY + 30, '⛷️ Snow Hill', {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            backgroundColor: '#00000080',
            padding: { x: 5, y: 2 },
        }).setOrigin(0.5);
    }

    createDraggablePet() {
        // Create pet as a container for dragging
        this.petContainer = this.add.container(this.petHomeX, this.petHomeY);

        // Draw the pet graphics
        this.petGraphics = this.add.graphics();
        this.drawMiniPet(this.petGraphics, false);
        this.petContainer.add(this.petGraphics);

        // Add a "drag me" indicator
        this.dragIndicator = this.add.text(0, 40, '↕ Drag me!', {
            fontSize: '12px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            backgroundColor: '#00000080',
            padding: { x: 5, y: 2 },
        }).setOrigin(0.5);
        this.petContainer.add(this.dragIndicator);

        // Animation state - ensure it starts as false
        this.isAnimating = false;

        // Make pet interactive and draggable
        this.petContainer.setSize(60, 60);
        this.petContainer.setInteractive({ useHandCursor: true, draggable: true });

        // Drag events
        this.input.on('dragstart', (pointer, gameObject) => {
            if (gameObject === this.petContainer && !this.isAnimating) {
                soundManager.playClick();
                this.dragIndicator.setVisible(false);

                // Stop the idle bounce animation so it doesn't fight with dragging
                if (this.idleTween) {
                    this.idleTween.stop();
                    this.idleTween = null;
                }

                // Show all highlights
                for (const key in this.highlights) {
                    this.highlights[key].setVisible(true);
                }

                // Scale up slightly when picked up
                this.tweens.add({
                    targets: this.petContainer,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    duration: 100,
                });
            }
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject === this.petContainer && !this.isAnimating) {
                gameObject.x = dragX;
                gameObject.y = dragY;

                // Check if over any equipment zone and highlight it
                this.checkZoneHover(dragX, dragY);
            }
        });

        this.input.on('dragend', (pointer, gameObject) => {
            if (gameObject === this.petContainer && !this.isAnimating) {
                // Hide all highlights
                for (const key in this.highlights) {
                    this.highlights[key].setVisible(false);
                }

                // Reset scale
                this.tweens.add({
                    targets: this.petContainer,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100,
                });

                // Check which equipment zone the pet was dropped on
                const droppedZone = this.getDropZone(gameObject.x, gameObject.y);

                if (droppedZone) {
                    this.activateEquipment(droppedZone);
                } else {
                    // Return to home position
                    this.returnPetHome();
                }
            }
        });

        // Idle bounce animation - store reference so we can stop it
        this.startIdleBounce();
    }

    startIdleBounce() {
        this.idleTween = this.tweens.add({
            targets: this.petContainer,
            y: this.petHomeY - 5,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });
    }

    checkZoneHover(x, y) {
        for (const key in this.equipmentZones) {
            const zone = this.equipmentZones[key];
            const dist = Phaser.Math.Distance.Between(x, y, zone.x, zone.y);

            if (dist < zone.radius) {
                // Highlight this zone more
                this.highlights[key].setAlpha(1);
                this.highlights[key].setScale(1.1);
            } else {
                this.highlights[key].setAlpha(0.5);
                this.highlights[key].setScale(1);
            }
        }
    }

    getDropZone(x, y) {
        for (const key in this.equipmentZones) {
            const zone = this.equipmentZones[key];
            const dist = Phaser.Math.Distance.Between(x, y, zone.x, zone.y);

            if (dist < zone.radius) {
                return key;
            }
        }
        return null;
    }

    activateEquipment(equipment) {
        this.isAnimating = true;

        // Safety timeout - if animation gets stuck, reset after 15 seconds
        this.animationSafetyTimer = this.time.addEvent({
            delay: 15000,
            callback: () => {
                if (this.isAnimating) {
                    console.warn('Animation safety timeout triggered - resetting state');
                    this.forceResetPet();
                }
            },
        });

        switch (equipment) {
            case 'swing':
                this.useSwing();
                break;
            case 'slide':
                this.useSlide();
                break;
            case 'trampoline':
                this.useTrampoline();
                break;
            case 'museum':
                this.useMuseum();
                break;
            case 'snowhill':
                this.useSnowHill();
                break;
        }
    }

    forceResetPet() {
        // Cancel safety timer
        if (this.animationSafetyTimer) {
            this.animationSafetyTimer.remove();
            this.animationSafetyTimer = null;
        }

        // Clear any existing tweens
        this.tweens.killTweensOf(this.petContainer);
        if (this.swingSeat) {
            this.tweens.killTweensOf(this.swingSeat);
        }

        // Clean up flying pet if exists
        if (this.flyingPet) {
            this.flyingPet.destroy();
            this.flyingPet = null;
        }

        // Clean up swing pet if exists
        if (this.swingPet) {
            this.swingSeat.remove(this.swingPet);
            this.swingPet.destroy();
            this.swingPet = null;
        }

        // Reset swing angle
        if (this.swingSeat) {
            this.swingSeat.angle = 0;
        }

        // Reset pet state
        this.drawMiniPet(this.petGraphics, false);
        this.petContainer.x = this.petHomeX;
        this.petContainer.y = this.petHomeY;
        this.petContainer.angle = 0;
        this.petContainer.scaleX = 1;
        this.petContainer.scaleY = 1;
        this.petContainer.setVisible(true);

        // Reset animation state
        this.isAnimating = false;

        // Show drag indicator
        if (this.dragIndicator) {
            this.dragIndicator.setVisible(true);
        }

        // Restart idle bounce
        this.startIdleBounce();
    }

    drawMiniPet(graphics, happy = false) {
        graphics.clear();

        // Body
        graphics.fillStyle(CONFIG.COLORS.PET_BODY, 1);
        graphics.fillCircle(0, 0, 25);

        // Belly
        graphics.fillStyle(CONFIG.COLORS.PET_BELLY, 1);
        graphics.fillCircle(0, 5, 15);

        // Eyes
        graphics.fillStyle(CONFIG.COLORS.PET_EYES, 1);
        if (happy) {
            // Happy eyes (^_^)
            graphics.fillRect(-12, -8, 3, 3);
            graphics.fillRect(-9, -11, 3, 3);
            graphics.fillRect(-6, -8, 3, 3);
            graphics.fillRect(6, -8, 3, 3);
            graphics.fillRect(9, -11, 3, 3);
            graphics.fillRect(12, -8, 3, 3);
        } else {
            graphics.fillRect(-10, -8, 6, 8);
            graphics.fillRect(4, -8, 6, 8);
        }

        // Cheeks
        graphics.fillStyle(CONFIG.COLORS.PET_CHEEKS, 0.6);
        graphics.fillRect(-18, 0, 6, 4);
        graphics.fillRect(12, 0, 6, 4);

        // Ears
        graphics.fillStyle(CONFIG.COLORS.PET_BODY, 1);
        graphics.fillRect(-20, -25, 10, 12);
        graphics.fillRect(10, -25, 10, 12);
    }

    useSwing() {
        soundManager.playHappy();

        // Hide the main pet container - we'll show a pet on the swing seat instead
        this.petContainer.setVisible(false);

        // Create a pet sprite on the swing seat
        this.swingPet = this.add.graphics();
        this.drawMiniPet(this.swingPet, true);
        this.swingPet.y = this.swingRopeLength - 30;
        this.swingSeat.add(this.swingPet);

        // Simple swing animation - swing the whole seat container back and forth
        let swingCount = 0;
        const maxSwings = 4;

        const doSwing = () => {
            if (!this.swingSeat || !this.scene) return;

            swingCount++;
            soundManager.playJump();

            // Swing to the right (positive angle)
            this.tweens.add({
                targets: this.swingSeat,
                angle: 25,
                duration: 400,
                ease: 'Sine.easeOut',
                onComplete: () => {
                    if (!this.swingSeat || !this.scene) return;

                    // Swing to the left (negative angle)
                    this.tweens.add({
                        targets: this.swingSeat,
                        angle: -25,
                        duration: 400,
                        ease: 'Sine.easeInOut',
                        onComplete: () => {
                            if (!this.swingSeat || !this.scene) return;

                            if (swingCount < maxSwings) {
                                doSwing();
                            } else {
                                // Done swinging - return seat to center then give reward
                                this.tweens.add({
                                    targets: this.swingSeat,
                                    angle: 0,
                                    duration: 300,
                                    ease: 'Sine.easeOut',
                                    onComplete: () => {
                                        this.finishSwing();
                                    },
                                });
                            }
                        },
                    });
                },
            });
        };

        doSwing();
    }

    finishSwing() {
        soundManager.playHappy();

        // Clean up the swing pet
        if (this.swingPet) {
            this.swingSeat.remove(this.swingPet);
            this.swingPet.destroy();
            this.swingPet = null;
        }

        // Reset swing angle
        this.swingSeat.angle = 0;

        // Position main pet at swing location and make visible
        this.petContainer.x = this.swingX;
        this.petContainer.y = this.swingY + this.swingRopeLength - 30;
        this.petContainer.setVisible(true);
        this.drawMiniPet(this.petGraphics, true);

        // Show hearts
        for (let i = 0; i < 3; i++) {
            const heart = this.add.text(
                this.petContainer.x - 20 + Math.random() * 40,
                this.petContainer.y - 40,
                '♥',
                { fontSize: '20px', color: '#f06292' }
            );
            this.tweens.add({
                targets: heart,
                y: heart.y - 50,
                alpha: 0,
                duration: 800,
                onComplete: () => heart.destroy(),
            });
        }

        // Give rewards (wrapped in try-catch to prevent listener errors from breaking flow)
        try {
            petStats.play(15);
            inventory.addCoins(5);
        } catch (e) {
            console.warn('Error updating stats:', e);
        }

        // Show coin text
        const coinText = this.add.text(this.petContainer.x, this.petContainer.y - 60, '+5 🪙', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffca28',
            backgroundColor: '#000000aa',
            padding: { x: 8, y: 4 },
        }).setOrigin(0.5);

        this.tweens.add({
            targets: coinText,
            y: coinText.y - 40,
            alpha: 0,
            duration: 1000,
            onComplete: () => coinText.destroy(),
        });

        // Return home after short delay
        this.time.delayedCall(500, () => {
            this.returnPetHome();
        });
    }

    petFlyOff() {
        // Get the current world position of the pet on the swing
        const rad = this.swingSeat.angle * Math.PI / 180;
        const launchX = this.swingX + Math.sin(rad) * this.swingRopeLength;
        const launchY = this.swingY + Math.cos(rad) * this.swingRopeLength - 30;

        // Remove pet from swing
        this.swingSeat.remove(this.swingPet);
        this.swingPet.destroy();

        // Reset swing
        this.tweens.add({
            targets: this.swingSeat,
            angle: 0,
            duration: 1000,
            ease: 'Bounce.easeOut',
        });

        // Create flying pet
        this.flyingPet = this.add.graphics();
        this.drawMiniPetScared(this.flyingPet);
        this.flyingPet.x = launchX;
        this.flyingPet.y = launchY;

        soundManager.playHappy();

        // Show "Wheee!" text
        const wheeText = this.add.text(launchX, launchY - 40, 'WHEEE!', {
            fontSize: '20px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffeb3b',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        // Launch trajectory - arc through the air
        const groundY = CONFIG.HEIGHT - 180;
        const landingX = 300 + Math.random() * 200;
        const landingY = groundY - 30;
        const peakY = 50; // How high it flies

        // Fly through the air with rotation
        this.tweens.add({
            targets: this.flyingPet,
            x: landingX,
            y: { value: landingY, ease: 'Quad.easeIn' },
            angle: 720, // Spin!
            duration: 1200,
            onUpdate: (tween) => {
                // Arc trajectory - go up then down
                const progress = tween.progress;
                const arcY = launchY + (peakY - launchY) * Math.sin(progress * Math.PI);
                if (progress < 0.5) {
                    this.flyingPet.y = arcY;
                }
            },
            onComplete: () => {
                // SPLAT! Land on ground
                soundManager.playClick();

                // Dust cloud effect
                for (let i = 0; i < 8; i++) {
                    const dust = this.add.graphics();
                    dust.fillStyle(0x8d6e63, 0.7);
                    dust.fillCircle(0, 0, 8 + Math.random() * 8);
                    dust.x = landingX;
                    dust.y = landingY + 10;

                    const angle = (i / 8) * Math.PI * 2;
                    this.tweens.add({
                        targets: dust,
                        x: landingX + Math.cos(angle) * 50,
                        y: landingY + Math.sin(angle) * 30,
                        alpha: 0,
                        duration: 500,
                        onComplete: () => dust.destroy(),
                    });
                }

                // Remove wheee text
                if (wheeText && wheeText.active) {
                    wheeText.destroy();
                }

                // Show dizzy pet
                if (this.flyingPet) {
                    this.flyingPet.destroy();
                    this.flyingPet = null;
                }
                this.petContainer.x = landingX;
                this.petContainer.y = landingY;
                this.petContainer.angle = 0;
                this.petContainer.scaleX = 1;
                this.petContainer.scaleY = 1;
                this.drawMiniPetDizzy(this.petGraphics);
                this.petContainer.setVisible(true);

                // Show stars around head
                this.showDizzyStars(landingX, landingY);

                // Make pet dirty from landing!
                petStats.modifyStat('cleanliness', -20);

                // Use time.addEvent for reliable delayed execution
                this.time.addEvent({
                    delay: 1500,
                    callback: () => {
                        // Draw normal pet
                        this.drawMiniPet(this.petGraphics, false);

                        // Show reward feedback (wrapped in try-catch)
                        try {
                            petStats.play(15);
                            soundManager.playHappy();
                            inventory.addCoins(5);
                        } catch (e) {
                            console.warn('Error updating stats:', e);
                        }

                        // Show coin text
                        const coinText = this.add.text(this.petContainer.x, this.petContainer.y - 60, '+5 🪙', {
                            fontSize: CONFIG.FONT.SIZE_MEDIUM,
                            fontFamily: CONFIG.FONT.FAMILY,
                            color: '#ffca28',
                            backgroundColor: '#000000aa',
                            padding: { x: 8, y: 4 },
                        }).setOrigin(0.5);

                        this.tweens.add({
                            targets: coinText,
                            y: coinText.y - 40,
                            alpha: 0,
                            duration: 1000,
                            onComplete: () => coinText.destroy(),
                        });

                        // Return pet home after short delay
                        this.time.addEvent({
                            delay: 500,
                            callback: () => {
                                this.returnPetHome();
                            },
                        });
                    },
                });
            },
        });

        // Wheee text follows pet briefly
        this.tweens.add({
            targets: wheeText,
            x: landingX,
            y: peakY - 20,
            alpha: 0,
            duration: 800,
        });
    }

    showDizzyStars(x, y) {
        // Spinning stars around head
        const stars = [];
        for (let i = 0; i < 4; i++) {
            const star = this.add.text(x, y - 40, '⭐', {
                fontSize: '16px',
            });
            stars.push(star);
        }

        let angle = 0;
        const starTimer = this.time.addEvent({
            delay: 50,
            callback: () => {
                angle += 0.2;
                stars.forEach((star, i) => {
                    const starAngle = angle + (i * Math.PI / 2);
                    star.x = x + Math.cos(starAngle) * 30;
                    star.y = y - 40 + Math.sin(starAngle) * 10;
                });
            },
            repeat: 20,
        });

        this.time.delayedCall(1000, () => {
            stars.forEach(star => star.destroy());
        });
    }

    drawMiniPetScared(graphics) {
        graphics.clear();

        // Body
        graphics.fillStyle(CONFIG.COLORS.PET_BODY, 1);
        graphics.fillCircle(0, 0, 25);

        // Belly
        graphics.fillStyle(CONFIG.COLORS.PET_BELLY, 1);
        graphics.fillCircle(0, 5, 15);

        // Scared eyes - wide open!
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(-8, -6, 8);
        graphics.fillCircle(8, -6, 8);
        graphics.fillStyle(CONFIG.COLORS.PET_EYES, 1);
        graphics.fillCircle(-8, -4, 4);
        graphics.fillCircle(8, -4, 4);
        // Tiny pupils
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(-7, -5, 1);
        graphics.fillCircle(9, -5, 1);

        // Open mouth - screaming!
        graphics.fillStyle(CONFIG.COLORS.PET_EYES, 1);
        graphics.fillCircle(0, 10, 8);
        graphics.fillStyle(0xef5350, 1);
        graphics.fillCircle(0, 10, 5);

        // No cheeks when scared

        // Ears (flattened back)
        graphics.fillStyle(CONFIG.COLORS.PET_BODY, 1);
        graphics.fillRect(-22, -20, 8, 10);
        graphics.fillRect(14, -20, 8, 10);
    }

    drawMiniPetDizzy(graphics) {
        graphics.clear();

        // Body - slightly brown from dirt
        graphics.fillStyle(0x90a4ae, 1);
        graphics.fillCircle(0, 0, 25);

        // Belly
        graphics.fillStyle(0xb0bec5, 1);
        graphics.fillCircle(0, 5, 15);

        // Dizzy swirl eyes
        graphics.lineStyle(2, CONFIG.COLORS.PET_EYES);
        // Left eye spiral
        graphics.beginPath();
        graphics.arc(-8, -6, 4, 0, Math.PI * 3);
        graphics.stroke();
        // Right eye spiral
        graphics.beginPath();
        graphics.arc(8, -6, 4, 0, Math.PI * 3);
        graphics.stroke();

        // Wobbly mouth
        graphics.lineStyle(2, CONFIG.COLORS.PET_EYES);
        graphics.beginPath();
        graphics.moveTo(-6, 12);
        graphics.lineTo(-2, 10);
        graphics.lineTo(2, 14);
        graphics.lineTo(6, 10);
        graphics.stroke();

        // Dirt spots
        graphics.fillStyle(0x6d4c41, 0.6);
        graphics.fillCircle(-12, 8, 4);
        graphics.fillCircle(10, -2, 3);
        graphics.fillCircle(5, 15, 3);

        // Ears
        graphics.fillStyle(0x90a4ae, 1);
        graphics.fillRect(-20, -25, 10, 12);
        graphics.fillRect(10, -25, 10, 12);
    }

    useSlide() {
        soundManager.playClick();

        // Move pet to top of slide
        this.tweens.add({
            targets: this.petContainer,
            x: this.slideStartX,
            y: this.slideStartY - 15,
            duration: 400,
            onComplete: () => {
                if (!this.petContainer || !this.scene) return;

                soundManager.playHappy();
                this.drawMiniPet(this.petGraphics, true);

                // Slide down
                this.tweens.add({
                    targets: this.petContainer,
                    x: this.slideEndX,
                    y: this.slideEndY - 15,
                    duration: 700,
                    ease: 'Quad.easeIn',
                    onComplete: () => {
                        if (!this.petContainer || !this.scene) return;

                        soundManager.playHappy();
                        this.givePlayReward('slide');
                    },
                });
            },
        });
    }

    useTrampoline() {
        soundManager.playClick();

        // Move pet to trampoline
        this.tweens.add({
            targets: this.petContainer,
            x: this.trampolineX,
            y: this.trampolineY - 30,
            duration: 300,
            onComplete: () => {
                if (!this.petContainer || !this.scene) return;

                this.drawMiniPet(this.petGraphics, true);

                // Simple bounce sequence
                let bounceCount = 0;
                const maxBounces = 4;

                const doBounce = () => {
                    if (!this.petContainer || !this.scene) return;

                    bounceCount++;
                    const height = 60 + bounceCount * 20;

                    soundManager.playJump();

                    // Jump up and down
                    this.tweens.add({
                        targets: this.petContainer,
                        y: this.trampolineY - height,
                        duration: 200,
                        ease: 'Quad.easeOut',
                        yoyo: true,
                        onComplete: () => {
                            if (!this.petContainer || !this.scene) return;

                            if (bounceCount < maxBounces) {
                                doBounce();
                            } else {
                                soundManager.playHappy();
                                this.givePlayReward('trampoline');
                            }
                        },
                    });
                };

                doBounce();
            },
        });
    }

    useMuseum() {
        soundManager.playClick();

        // Move pet to museum door
        this.tweens.add({
            targets: this.petContainer,
            x: this.museumX,
            y: this.museumY,
            duration: 400,
            onComplete: () => {
                if (!this.petContainer || !this.scene) return;

                // Pet enters museum (fade out)
                this.tweens.add({
                    targets: this.petContainer,
                    alpha: 0,
                    scaleX: 0.5,
                    scaleY: 0.5,
                    duration: 300,
                    onComplete: () => {
                        if (!this.scene) return;

                        // Show "Visiting museum..." message
                        const visitText = this.add.text(this.museumX, this.museumY - 80, '🎨 Viewing art...', {
                            fontSize: CONFIG.FONT.SIZE_MEDIUM,
                            fontFamily: CONFIG.FONT.FAMILY,
                            color: '#ffffff',
                            backgroundColor: '#7b1fa2',
                            padding: { x: 10, y: 5 },
                        }).setOrigin(0.5);

                        // Show random art pieces floating
                        const artPieces = ['🖼️', '🎭', '🗿', '🏺', '🎨'];
                        artPieces.forEach((art, i) => {
                            this.time.delayedCall(i * 300, () => {
                                if (!this.scene) return;
                                const artText = this.add.text(
                                    this.museumX - 40 + Math.random() * 80,
                                    this.museumY - 120,
                                    art,
                                    { fontSize: '24px' }
                                ).setOrigin(0.5);

                                this.tweens.add({
                                    targets: artText,
                                    y: artText.y - 30,
                                    alpha: 0,
                                    duration: 800,
                                    delay: 200,
                                    onComplete: () => artText.destroy(),
                                });
                            });
                        });

                        // After viewing, exit museum
                        this.time.delayedCall(2000, () => {
                            if (!this.scene) return;
                            visitText.destroy();

                            // Pet exits (fade back in)
                            this.petContainer.x = this.museumX;
                            this.petContainer.y = this.museumY;
                            this.drawMiniPet(this.petGraphics, true);

                            this.tweens.add({
                                targets: this.petContainer,
                                alpha: 1,
                                scaleX: 1,
                                scaleY: 1,
                                duration: 300,
                                onComplete: () => {
                                    soundManager.playHappy();
                                    this.givePlayReward('museum');
                                },
                            });
                        });
                    },
                });
            },
        });
    }

    useSnowHill() {
        soundManager.playClick();

        // Randomly choose skiing or sledding
        const activity = Math.random() < 0.5 ? 'skiing' : 'sledding';

        // Show which activity was chosen
        const activityText = this.add.text(
            this.snowHillX,
            this.snowHillY - 30,
            activity === 'skiing' ? '⛷️ Skiing!' : '🛷 Sledding!',
            {
                fontSize: CONFIG.FONT.SIZE_MEDIUM,
                fontFamily: CONFIG.FONT.FAMILY,
                color: '#ffffff',
                backgroundColor: '#1565c0',
                padding: { x: 8, y: 4 },
            }
        ).setOrigin(0.5);

        this.tweens.add({
            targets: activityText,
            alpha: 0,
            y: activityText.y - 30,
            duration: 1500,
            onComplete: () => activityText.destroy(),
        });

        // Move pet to top of hill
        this.tweens.add({
            targets: this.petContainer,
            x: this.snowHillX - 20,
            y: this.snowHillY + 10,
            duration: 400,
            onComplete: () => {
                if (!this.petContainer || !this.scene) return;

                soundManager.playHappy();
                this.drawMiniPet(this.petGraphics, true);

                // Show equipment on pet
                if (activity === 'skiing') {
                    // Draw skis under pet
                    this.skiGraphics = this.add.graphics();
                    this.skiGraphics.fillStyle(0x1565c0, 1);
                    this.skiGraphics.fillRect(-15, 20, 30, 3);
                    this.skiGraphics.fillRect(-15, 26, 30, 3);
                    this.petContainer.add(this.skiGraphics);
                } else {
                    // Draw sled under pet
                    this.sledGraphics = this.add.graphics();
                    this.sledGraphics.fillStyle(0xc62828, 1);
                    this.sledGraphics.fillRect(-18, 18, 36, 10);
                    this.sledGraphics.fillStyle(0x8d6e63, 1);
                    this.sledGraphics.fillRect(-16, 26, 4, 4);
                    this.sledGraphics.fillRect(12, 26, 4, 4);
                    this.petContainer.add(this.sledGraphics);
                }

                // Slide down the hill!
                soundManager.playJump();

                this.tweens.add({
                    targets: this.petContainer,
                    x: this.snowHillX + 30,
                    y: this.snowHillBottomY,
                    duration: 800,
                    ease: 'Quad.easeIn',
                    onUpdate: () => {
                        // Create snow particles while sliding
                        if (Math.random() < 0.3) {
                            this.createSnowParticle(this.petContainer.x, this.petContainer.y);
                        }
                    },
                    onComplete: () => {
                        if (!this.petContainer || !this.scene) return;

                        // Remove equipment graphics
                        if (this.skiGraphics) {
                            this.petContainer.remove(this.skiGraphics);
                            this.skiGraphics.destroy();
                            this.skiGraphics = null;
                        }
                        if (this.sledGraphics) {
                            this.petContainer.remove(this.sledGraphics);
                            this.sledGraphics.destroy();
                            this.sledGraphics = null;
                        }

                        // Snow spray at bottom
                        for (let i = 0; i < 10; i++) {
                            this.createSnowParticle(
                                this.petContainer.x + (Math.random() - 0.5) * 40,
                                this.petContainer.y
                            );
                        }

                        soundManager.playHappy();
                        this.givePlayReward(activity);
                    },
                });
            },
        });
    }

    createSnowParticle(x, y) {
        const snow = this.add.graphics();
        snow.fillStyle(0xffffff, 0.9);
        snow.fillCircle(0, 0, 3 + Math.random() * 3);
        snow.x = x;
        snow.y = y;

        this.tweens.add({
            targets: snow,
            x: x + (Math.random() - 0.5) * 40,
            y: y - 10 - Math.random() * 20,
            alpha: 0,
            duration: 400,
            onComplete: () => snow.destroy(),
        });
    }

    showDirtPuffs(x, y) {
        // Small dirt/dust particles
        for (let i = 0; i < 5; i++) {
            const dirt = this.add.graphics();
            dirt.fillStyle(0x8d6e63, 0.6);
            dirt.fillCircle(0, 0, 4 + Math.random() * 4);
            dirt.x = x - 20 + Math.random() * 40;
            dirt.y = y;

            this.tweens.add({
                targets: dirt,
                y: y - 20 - Math.random() * 20,
                alpha: 0,
                duration: 400,
                onComplete: () => dirt.destroy(),
            });
        }
    }

    givePlayReward(equipment) {
        if (!this.petContainer || !this.scene) {
            this.isAnimating = false;
            return;
        }

        // Coin rewards based on equipment
        const coinRewards = { swing: 5, slide: 3, trampoline: 4, museum: 6, skiing: 5, sledding: 5 };
        const coinsEarned = coinRewards[equipment] || 3;

        // Wrapped in try-catch to prevent listener errors from breaking flow
        try {
            petStats.play(15);
            inventory.addCoins(coinsEarned);
        } catch (e) {
            console.warn('Error updating stats:', e);
        }

        // Show hearts
        for (let i = 0; i < 3; i++) {
            const heart = this.add.text(
                this.petContainer.x - 20 + Math.random() * 40,
                this.petContainer.y - 40,
                '♥',
                { fontSize: '20px', color: '#f06292' }
            );
            this.tweens.add({
                targets: heart,
                y: heart.y - 50,
                alpha: 0,
                duration: 600,
                onComplete: () => heart.destroy(),
            });
        }

        // Show coin text
        const coinText = this.add.text(this.petContainer.x, this.petContainer.y - 60, `+${coinsEarned} 🪙`, {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffca28',
            backgroundColor: '#000000aa',
            padding: { x: 8, y: 4 },
        }).setOrigin(0.5);

        this.tweens.add({
            targets: coinText,
            y: coinText.y - 40,
            alpha: 0,
            duration: 1000,
            onComplete: () => coinText.destroy(),
        });

        // Return pet home immediately (don't wait)
        this.time.delayedCall(500, () => {
            this.returnPetHome();
        });
    }

    returnPetHome() {
        // Safety check
        if (!this.petContainer || !this.petGraphics) {
            console.warn('Pet container or graphics missing');
            this.isAnimating = false;
            // Cancel safety timer
            if (this.animationSafetyTimer) {
                this.animationSafetyTimer.remove();
                this.animationSafetyTimer = null;
            }
            return;
        }

        this.drawMiniPet(this.petGraphics, false);

        // Reset properties directly first
        this.petContainer.angle = 0;
        this.petContainer.scaleX = 1;
        this.petContainer.scaleY = 1;
        this.petContainer.setVisible(true);

        // Stop any existing tweens on the pet
        this.tweens.killTweensOf(this.petContainer);

        this.tweens.add({
            targets: this.petContainer,
            x: this.petHomeX,
            y: this.petHomeY,
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.isAnimating = false;

                // Cancel safety timer since we completed successfully
                if (this.animationSafetyTimer) {
                    this.animationSafetyTimer.remove();
                    this.animationSafetyTimer = null;
                }

                if (this.dragIndicator) {
                    this.dragIndicator.setVisible(true);
                }
                // Restart idle bounce
                this.startIdleBounce();
            },
        });
    }

    createUI() {
        // Back button
        const backBtn = this.add.container(70, CONFIG.HEIGHT - 40);

        const btnBg = this.add.graphics();
        btnBg.fillStyle(CONFIG.COLORS.PRIMARY, 1);
        btnBg.fillRect(-50, -20, 100, 40);
        btnBg.fillStyle(CONFIG.COLORS.SECONDARY, 1);
        btnBg.fillRect(-46, -16, 92, 32);

        const btnText = this.add.text(0, 0, '← Home', {
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
