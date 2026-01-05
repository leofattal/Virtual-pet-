// PixelPal - Bathroom Scene

class BathroomScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENES.BATHROOM });
    }

    create() {
        // Create background
        this.createBackground();

        // Create bathtub
        this.createBathtub();

        // Create multiple soap types
        this.createSoaps();

        // Create rubber ducky
        this.createRubberDucky();

        // Create shower
        this.createShower();

        // Create toilet
        this.createToilet();

        // Create toothbrush
        this.createToothbrush();

        // Create draggable pet
        this.createDraggablePet();

        // Create UI
        this.createUI();

        // Create instructions
        this.instructions = this.add.text(CONFIG.WIDTH / 2, 30, 'Drag your pet to the tub! Use soap for extra clean!', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            backgroundColor: '#00000080',
            padding: { x: 10, y: 5 },
        }).setOrigin(0.5);

        // State - ensure clean initialization
        this.isAnimating = false;
        this.petInTub = false;
        this.animationSafetyTimer = null;

        // Fade in
        this.cameras.main.fadeIn(300, 0, 0, 0);
    }

    createBackground() {
        const bg = this.add.graphics();

        // Bathroom walls - light blue tiles
        bg.fillStyle(0x81d4fa, 1);
        bg.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Tile grid pattern
        bg.lineStyle(1, 0x4fc3f7, 0.5);
        for (let x = 0; x < CONFIG.WIDTH; x += 40) {
            bg.lineBetween(x, 0, x, CONFIG.HEIGHT - 150);
        }
        for (let y = 0; y < CONFIG.HEIGHT - 150; y += 40) {
            bg.lineBetween(0, y, CONFIG.WIDTH, y);
        }

        // Floor tiles - checkered pattern
        for (let x = 0; x < CONFIG.WIDTH; x += 40) {
            for (let y = CONFIG.HEIGHT - 150; y < CONFIG.HEIGHT; y += 40) {
                const isWhite = ((x / 40) + ((y - (CONFIG.HEIGHT - 150)) / 40)) % 2 === 0;
                bg.fillStyle(isWhite ? 0xffffff : 0xe0e0e0, 1);
                bg.fillRect(x, y, 40, 40);
            }
        }

        // Bathroom window
        bg.fillStyle(0xb3e5fc, 1);
        bg.fillRect(550, 60, 120, 100);
        bg.lineStyle(6, 0xffffff);
        bg.strokeRect(550, 60, 120, 100);
        bg.lineBetween(610, 60, 610, 160);
        bg.lineBetween(550, 110, 670, 110);

        // Towel rack
        bg.fillStyle(0x8d6e63, 1);
        bg.fillRect(50, 100, 10, 80);
        bg.fillRect(130, 100, 10, 80);
        bg.fillStyle(0x6d4c41, 1);
        bg.fillRect(45, 100, 100, 8);

        // Towel hanging
        bg.fillStyle(0xf48fb1, 1);
        bg.fillRect(60, 108, 70, 50);
        bg.fillStyle(0xf06292, 1);
        bg.fillRect(65, 115, 60, 8);
        bg.fillRect(65, 135, 60, 8);

        // Mirror
        bg.fillStyle(0xffffff, 0.8);
        bg.fillEllipse(350, 100, 80, 100);
        bg.lineStyle(6, 0xbdbdbd);
        bg.strokeEllipse(350, 100, 80, 100);

        // Shelf under mirror
        bg.fillStyle(0xffffff, 1);
        bg.fillRect(280, 155, 140, 10);

        // Toothbrush holder on shelf
        bg.fillStyle(0x90caf9, 1);
        bg.fillRect(300, 135, 25, 20);
        bg.fillStyle(0xef5350, 1);
        bg.fillRect(305, 115, 4, 25);
        bg.fillStyle(0x66bb6a, 1);
        bg.fillRect(315, 115, 4, 25);
    }

    createBathtub() {
        const tubX = 400;
        const tubY = CONFIG.HEIGHT - 220;

        this.bathtubContainer = this.add.container(tubX, tubY);

        const tub = this.add.graphics();

        // Tub body (porcelain white)
        tub.fillStyle(0xffffff, 1);
        // Main tub shape
        tub.fillRect(-150, -30, 300, 100);
        // Rounded top edges
        tub.fillCircle(-150, 20, 50);
        tub.fillCircle(150, 20, 50);

        // Tub interior (with water)
        tub.fillStyle(0x4fc3f7, 0.8);
        tub.fillRect(-140, -20, 280, 70);

        // Water ripples
        tub.lineStyle(2, 0x81d4fa, 0.6);
        for (let i = 0; i < 5; i++) {
            tub.beginPath();
            tub.moveTo(-130 + i * 60, -10);
            tub.lineTo(-100 + i * 60, -5);
            tub.lineTo(-70 + i * 60, -10);
            tub.stroke();
        }

        // Bubbles in the water
        tub.fillStyle(0xffffff, 0.9);
        const bubblePositions = [
            { x: -100, y: -25, r: 12 },
            { x: -80, y: -30, r: 8 },
            { x: -60, y: -22, r: 10 },
            { x: -20, y: -28, r: 14 },
            { x: 0, y: -20, r: 8 },
            { x: 40, y: -25, r: 12 },
            { x: 70, y: -30, r: 10 },
            { x: 100, y: -22, r: 8 },
            { x: 120, y: -28, r: 6 },
        ];
        bubblePositions.forEach(b => {
            tub.fillCircle(b.x, b.y, b.r);
            // Bubble shine
            tub.fillStyle(0xe3f2fd, 1);
            tub.fillCircle(b.x - b.r/3, b.y - b.r/3, b.r/3);
            tub.fillStyle(0xffffff, 0.9);
        });

        // Tub rim
        tub.fillStyle(0xeeeeee, 1);
        tub.fillRect(-155, -35, 310, 10);

        // Faucet
        tub.fillStyle(0xbdbdbd, 1);
        tub.fillRect(130, -70, 20, 40);
        tub.fillStyle(0x9e9e9e, 1);
        tub.fillRect(125, -80, 30, 15);
        // Faucet spout
        tub.fillRect(110, -75, 20, 8);
        // Handles
        tub.fillStyle(0xef5350, 1);
        tub.fillCircle(115, -90, 8);
        tub.fillStyle(0x42a5f5, 1);
        tub.fillCircle(155, -90, 8);

        // Tub feet (claw foot style)
        tub.fillStyle(0xbdbdbd, 1);
        tub.fillRect(-160, 65, 20, 25);
        tub.fillRect(140, 65, 20, 25);

        this.bathtubContainer.add(tub);

        // Define tub zone for dragging
        this.tubZone = { x: tubX, y: tubY - 10, radius: 120 };
    }

    createSoaps() {
        // Define soap types with their properties
        this.soapTypes = [
            { id: 'regular', name: 'Pink Soap', color: 0xf8bbd9, highlight: 0xfce4ec, bonus: 3, x: 100 },
            { id: 'galaxy', name: 'Galaxy Soap', color: 0x7b1fa2, highlight: 0xce93d8, bonus: 5, x: 170, special: 'galaxy' },
            { id: 'rainbow', name: 'Rainbow Soap', color: 0xff5722, highlight: 0xffccbc, bonus: 5, x: 240, special: 'rainbow' },
        ];

        this.soapContainers = [];
        const soapY = CONFIG.HEIGHT - 120;

        this.soapTypes.forEach((soapType, index) => {
            const soapContainer = this.add.container(soapType.x, soapY);

            const soap = this.add.graphics();

            // Soap dish
            soap.fillStyle(0xffffff, 1);
            soap.fillEllipse(0, 10, 50, 12);
            soap.fillStyle(0xeeeeee, 1);
            soap.fillEllipse(0, 8, 40, 8);

            // Soap bar
            if (soapType.special === 'galaxy') {
                // Galaxy soap - purple with stars
                soap.fillStyle(0x1a1a2e, 1);
                soap.fillRect(-18, -13, 36, 22);
                soap.fillStyle(soapType.color, 1);
                soap.fillRect(-16, -11, 32, 18);
                // Stars
                soap.fillStyle(0xffffff, 1);
                soap.fillCircle(-8, -5, 2);
                soap.fillCircle(5, -8, 1.5);
                soap.fillCircle(10, 0, 2);
                soap.fillCircle(-5, 3, 1);
                soap.fillStyle(0xce93d8, 0.6);
                soap.fillCircle(0, -3, 6);
            } else if (soapType.special === 'rainbow') {
                // Rainbow soap - striped
                const stripeColors = [0xff5722, 0xffeb3b, 0x4caf50, 0x2196f3, 0x9c27b0];
                soap.fillStyle(0xffffff, 1);
                soap.fillRect(-18, -13, 36, 22);
                stripeColors.forEach((color, i) => {
                    soap.fillStyle(color, 1);
                    soap.fillRect(-16, -11 + i * 3.6, 32, 3.6);
                });
            } else {
                // Regular pink soap
                soap.fillStyle(soapType.color, 1);
                soap.fillRect(-18, -13, 36, 22);
                soap.fillStyle(soapType.highlight, 1);
                soap.fillRect(-14, -10, 8, 16);
            }

            // Soap bubbles on top
            soap.fillStyle(0xffffff, 0.8);
            soap.fillCircle(-8, -16, 4);
            soap.fillCircle(4, -17, 3);
            soap.fillCircle(12, -15, 3);

            soapContainer.add(soap);

            // Label
            const label = this.add.text(0, 32, soapType.name, {
                fontSize: '10px',
                fontFamily: CONFIG.FONT.FAMILY,
                color: '#ffffff',
                backgroundColor: '#00000080',
                padding: { x: 3, y: 1 },
            }).setOrigin(0.5);
            soapContainer.add(label);

            // Make soap draggable
            soapContainer.setSize(50, 45);
            soapContainer.setInteractive({ useHandCursor: true, draggable: true });
            soapContainer.soapType = soapType;
            soapContainer.homeX = soapType.x;
            soapContainer.homeY = soapY;

            this.input.setDraggable(soapContainer);

            soapContainer.on('dragstart', () => {
                soundManager.playClick();
                soapContainer.setScale(1.2);
                soapContainer.setDepth(100);
            });

            soapContainer.on('drag', (pointer, dragX, dragY) => {
                soapContainer.x = dragX;
                soapContainer.y = dragY;
            });

            soapContainer.on('dragend', () => {
                soapContainer.setScale(1);
                soapContainer.setDepth(0);

                // Check if dropped on pet in tub
                if (this.petInTub && this.petContainer) {
                    const dist = Phaser.Math.Distance.Between(
                        soapContainer.x, soapContainer.y,
                        this.petContainer.x, this.petContainer.y
                    );

                    if (dist < 80) {
                        this.useSoapOnPet(soapContainer);
                        return;
                    }
                }

                // Return soap home
                this.tweens.add({
                    targets: soapContainer,
                    x: soapContainer.homeX,
                    y: soapContainer.homeY,
                    duration: 200,
                });
            });

            this.soapContainers.push(soapContainer);
        });
    }

    createRubberDucky() {
        const duckyX = 650;
        const duckyY = CONFIG.HEIGHT - 130;

        this.duckyContainer = this.add.container(duckyX, duckyY);

        const ducky = this.add.graphics();

        // Ducky body
        ducky.fillStyle(0xffeb3b, 1);
        ducky.fillCircle(0, 0, 25);

        // Ducky head
        ducky.fillCircle(-5, -25, 18);

        // Beak
        ducky.fillStyle(0xff9800, 1);
        ducky.fillTriangle(-25, -25, -10, -30, -10, -20);

        // Eye
        ducky.fillStyle(0x1a1a2e, 1);
        ducky.fillCircle(-12, -28, 4);
        ducky.fillStyle(0xffffff, 1);
        ducky.fillCircle(-13, -29, 1);

        // Wing
        ducky.fillStyle(0xfdd835, 1);
        ducky.fillEllipse(12, 0, 15, 12);

        // Tail feathers
        ducky.fillStyle(0xfdd835, 1);
        ducky.fillRect(20, -5, 10, 8);

        this.duckyContainer.add(ducky);

        // Label
        const label = this.add.text(0, 40, 'Ducky!', {
            fontSize: '12px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffeb3b',
            backgroundColor: '#00000080',
            padding: { x: 4, y: 2 },
        }).setOrigin(0.5);
        this.duckyContainer.add(label);

        // Make ducky draggable
        this.duckyContainer.setSize(50, 60);
        this.duckyContainer.setInteractive({ useHandCursor: true, draggable: true });

        this.duckyHomeX = duckyX;
        this.duckyHomeY = duckyY;

        this.input.setDraggable(this.duckyContainer);

        this.duckyContainer.on('dragstart', () => {
            soundManager.playClick();
            this.duckyContainer.setScale(1.2);
            this.duckyContainer.setDepth(100);
        });

        this.duckyContainer.on('drag', (pointer, dragX, dragY) => {
            this.duckyContainer.x = dragX;
            this.duckyContainer.y = dragY;
        });

        this.duckyContainer.on('dragend', () => {
            this.duckyContainer.setScale(1);
            this.duckyContainer.setDepth(0);

            // Check if dropped in tub
            const dist = Phaser.Math.Distance.Between(
                this.duckyContainer.x, this.duckyContainer.y,
                this.tubZone.x, this.tubZone.y
            );

            if (dist < this.tubZone.radius) {
                // Ducky goes in tub!
                this.putDuckyInTub();
            } else {
                // Return ducky home
                this.tweens.add({
                    targets: this.duckyContainer,
                    x: this.duckyHomeX,
                    y: this.duckyHomeY,
                    duration: 200,
                });
            }
        });
    }

    putDuckyInTub() {
        soundManager.playHappy();

        // Move ducky to float in tub
        const floatX = this.tubZone.x + 60;
        const floatY = this.tubZone.y - 30;

        this.tweens.add({
            targets: this.duckyContainer,
            x: floatX,
            y: floatY,
            duration: 300,
            onComplete: () => {
                // Make ducky bob in water
                this.duckyBobTween = this.tweens.add({
                    targets: this.duckyContainer,
                    y: floatY - 5,
                    angle: { from: -10, to: 10 },
                    duration: 800,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut',
                });

                // Quack!
                this.showQuack();
            },
        });
    }

    createShower() {
        const showerX = 720;
        const showerY = 120;

        const shower = this.add.graphics();

        // Shower head pipe from ceiling
        shower.fillStyle(0xbdbdbd, 1);
        shower.fillRect(showerX - 5, 0, 10, 80);

        // Shower head
        shower.fillStyle(0x9e9e9e, 1);
        shower.fillEllipse(showerX, showerY, 40, 15);
        shower.fillStyle(0xbdbdbd, 1);
        shower.fillEllipse(showerX, showerY - 5, 35, 10);

        // Shower holes
        shower.fillStyle(0x616161, 0.5);
        for (let x = -12; x <= 12; x += 6) {
            for (let y = -3; y <= 3; y += 6) {
                shower.fillCircle(showerX + x, showerY + y, 2);
            }
        }

        // Shower curtain rod
        shower.fillStyle(0x8d6e63, 1);
        shower.fillRect(showerX - 60, 50, 120, 6);

        // Shower curtain (partial)
        shower.fillStyle(0xb3e5fc, 0.7);
        shower.fillRect(showerX + 30, 56, 30, 150);
        shower.fillStyle(0x81d4fa, 0.5);
        shower.fillRect(showerX + 35, 56, 8, 150);
        shower.fillRect(showerX + 50, 56, 8, 150);

        // Click zone for shower - make it interactive
        const showerZone = this.add.zone(showerX, showerY + 50, 80, 100);
        showerZone.setInteractive({ useHandCursor: true });

        // Label
        this.add.text(showerX, 210, '🚿 Shower', {
            fontSize: '11px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            backgroundColor: '#00000080',
            padding: { x: 4, y: 2 },
        }).setOrigin(0.5);

        // Water drops container (hidden initially)
        this.showerDrops = [];
        this.showerActive = false;

        showerZone.on('pointerdown', () => {
            if (!this.showerActive) {
                this.startShower(showerX, showerY);
            }
        });
    }

    startShower(x, y) {
        this.showerActive = true;
        soundManager.playClean();

        // Create water drops falling
        const dropTimer = this.time.addEvent({
            delay: 50,
            callback: () => {
                const drop = this.add.graphics();
                drop.fillStyle(0x4fc3f7, 0.8);
                drop.fillEllipse(0, 0, 4, 8);
                drop.x = x - 15 + Math.random() * 30;
                drop.y = y + 10;

                this.tweens.add({
                    targets: drop,
                    y: CONFIG.HEIGHT - 150,
                    alpha: 0,
                    duration: 600,
                    onComplete: () => drop.destroy(),
                });
            },
            repeat: 30,
        });

        // Show refreshing message
        this.time.delayedCall(800, () => {
            this.ui.showToast('💧 Refreshing shower!');
            try {
                petStats.modifyStat('cleanliness', 10);
                petStats.modifyStat('happiness', 5);
            } catch (e) {
                console.warn('Error updating stats:', e);
            }
        });

        // End shower
        this.time.delayedCall(1800, () => {
            this.showerActive = false;
        });
    }

    createToilet() {
        const toiletX = 50;
        const toiletY = CONFIG.HEIGHT - 200;

        const toilet = this.add.graphics();

        // Toilet base
        toilet.fillStyle(0xffffff, 1);
        toilet.fillRect(toiletX - 25, toiletY, 50, 60);

        // Toilet bowl
        toilet.fillStyle(0xffffff, 1);
        toilet.fillEllipse(toiletX, toiletY - 5, 50, 25);
        toilet.fillStyle(0x81d4fa, 0.5);
        toilet.fillEllipse(toiletX, toiletY - 5, 40, 18);

        // Toilet seat
        toilet.fillStyle(0xeeeeee, 1);
        toilet.fillEllipse(toiletX, toiletY - 8, 48, 22);
        toilet.lineStyle(2, 0xbdbdbd);
        toilet.strokeEllipse(toiletX, toiletY - 8, 48, 22);

        // Toilet lid (up)
        toilet.fillStyle(0xffffff, 1);
        toilet.fillRect(toiletX - 22, toiletY - 50, 44, 45);
        toilet.lineStyle(2, 0xbdbdbd);
        toilet.strokeRect(toiletX - 22, toiletY - 50, 44, 45);

        // Toilet tank
        toilet.fillStyle(0xffffff, 1);
        toilet.fillRect(toiletX - 20, toiletY - 90, 40, 42);
        toilet.lineStyle(2, 0xbdbdbd);
        toilet.strokeRect(toiletX - 20, toiletY - 90, 40, 42);

        // Flush handle
        toilet.fillStyle(0xbdbdbd, 1);
        toilet.fillRect(toiletX + 20, toiletY - 80, 15, 5);
        toilet.fillCircle(toiletX + 35, toiletY - 78, 5);

        // Make toilet interactive
        const toiletZone = this.add.zone(toiletX, toiletY - 30, 60, 80);
        toiletZone.setInteractive({ useHandCursor: true });

        // Label
        this.add.text(toiletX, toiletY + 70, '🚽 Toilet', {
            fontSize: '11px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            backgroundColor: '#00000080',
            padding: { x: 4, y: 2 },
        }).setOrigin(0.5);

        toiletZone.on('pointerdown', () => {
            this.flushToilet(toiletX, toiletY);
        });
    }

    flushToilet(x, y) {
        soundManager.playClick();

        // Flush animation - water swirl
        const swirlColors = [0x4fc3f7, 0x81d4fa, 0xb3e5fc];

        for (let i = 0; i < 8; i++) {
            this.time.delayedCall(i * 50, () => {
                const swirl = this.add.graphics();
                swirl.fillStyle(swirlColors[i % swirlColors.length], 0.7);
                swirl.fillCircle(0, 0, 5);
                swirl.x = x;
                swirl.y = y - 5;

                const angle = (i / 8) * Math.PI * 4;
                const radius = 15 - i * 1.5;

                this.tweens.add({
                    targets: swirl,
                    x: x + Math.cos(angle) * radius,
                    y: y - 5 + Math.sin(angle) * radius * 0.5,
                    scaleX: 0,
                    scaleY: 0,
                    duration: 500,
                    onComplete: () => swirl.destroy(),
                });
            });
        }

        // Show message
        this.time.delayedCall(300, () => {
            const flushText = this.add.text(x, y - 60, '💨 Flush!', {
                fontSize: '14px',
                fontFamily: CONFIG.FONT.FAMILY,
                color: '#4fc3f7',
            }).setOrigin(0.5);

            this.tweens.add({
                targets: flushText,
                y: flushText.y - 30,
                alpha: 0,
                duration: 800,
                onComplete: () => flushText.destroy(),
            });
        });
    }

    createToothbrush() {
        const brushX = 350;
        const brushY = 175;

        this.toothbrushContainer = this.add.container(brushX, brushY);

        const brush = this.add.graphics();

        // Toothbrush handle
        brush.fillStyle(0x42a5f5, 1);
        brush.fillRect(-4, 0, 8, 50);
        brush.fillStyle(0x2196f3, 1);
        brush.fillRect(-3, 5, 6, 40);

        // Brush head
        brush.fillStyle(0xffffff, 1);
        brush.fillRect(-6, -15, 12, 18);

        // Bristles
        brush.fillStyle(0xbbdefb, 1);
        for (let x = -4; x <= 4; x += 4) {
            brush.fillRect(x - 1, -13, 2, 10);
        }

        this.toothbrushContainer.add(brush);

        // Make interactive
        this.toothbrushContainer.setSize(20, 70);
        this.toothbrushContainer.setInteractive({ useHandCursor: true });

        // Label
        const label = this.add.text(0, 60, '🪥 Brush', {
            fontSize: '10px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            backgroundColor: '#00000080',
            padding: { x: 3, y: 1 },
        }).setOrigin(0.5);
        this.toothbrushContainer.add(label);

        this.toothbrushContainer.on('pointerdown', () => {
            this.brushTeeth();
        });
    }

    brushTeeth() {
        soundManager.playClick();

        // Animate toothbrush
        this.tweens.add({
            targets: this.toothbrushContainer,
            x: this.toothbrushContainer.x + 5,
            duration: 100,
            yoyo: true,
            repeat: 5,
        });

        // Show sparkles coming from toothbrush
        for (let i = 0; i < 8; i++) {
            this.time.delayedCall(i * 80, () => {
                const sparkle = this.add.graphics();
                sparkle.fillStyle(0xffffff, 1);
                sparkle.fillRect(-2, -2, 4, 4);

                sparkle.x = this.toothbrushContainer.x + (Math.random() - 0.5) * 20;
                sparkle.y = this.toothbrushContainer.y - 10;

                this.tweens.add({
                    targets: sparkle,
                    y: sparkle.y - 30,
                    alpha: 0,
                    angle: 180,
                    duration: 400,
                    onComplete: () => sparkle.destroy(),
                });
            });
        }

        // Give cleanliness bonus
        this.time.delayedCall(400, () => {
            try {
                petStats.modifyStat('cleanliness', 15);
                inventory.addCoins(1);
            } catch (e) {
                console.warn('Error updating stats:', e);
            }

            this.ui.showToast('✨ Sparkling clean teeth! +1 🪙');
        });
    }

    showQuack() {
        const quack = this.add.text(this.duckyContainer.x, this.duckyContainer.y - 50, 'QUACK!', {
            fontSize: '16px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffeb3b',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        this.tweens.add({
            targets: quack,
            y: quack.y - 30,
            alpha: 0,
            duration: 800,
            onComplete: () => quack.destroy(),
        });
    }

    createDraggablePet() {
        // Pet starts outside the tub
        this.petHomeX = 200;
        this.petHomeY = CONFIG.HEIGHT - 280;

        this.petContainer = this.add.container(this.petHomeX, this.petHomeY);

        this.petGraphics = this.add.graphics();
        this.drawMiniPet(this.petGraphics, false);
        this.petContainer.add(this.petGraphics);

        // Drag indicator
        this.dragIndicator = this.add.text(0, 45, 'Drag to tub!', {
            fontSize: '11px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            backgroundColor: '#00000080',
            padding: { x: 4, y: 2 },
        }).setOrigin(0.5);
        this.petContainer.add(this.dragIndicator);

        // Make draggable
        this.petContainer.setSize(60, 70);
        this.petContainer.setInteractive({ useHandCursor: true, draggable: true });

        this.input.setDraggable(this.petContainer);

        // Idle bounce
        this.startIdleBounce();

        this.petContainer.on('dragstart', () => {
            if (this.isAnimating) return;

            soundManager.playClick();
            if (this.idleTween) {
                this.idleTween.stop();
            }
            this.petContainer.setScale(1.1);
            this.dragIndicator.setVisible(false);
            this.showTubHighlight(true);
        });

        this.petContainer.on('drag', (pointer, dragX, dragY) => {
            if (this.isAnimating) return;
            this.petContainer.x = dragX;
            this.petContainer.y = dragY;
        });

        this.petContainer.on('dragend', () => {
            if (this.isAnimating) return;

            this.petContainer.setScale(1);
            this.showTubHighlight(false);

            // Check if dropped in tub
            const dist = Phaser.Math.Distance.Between(
                this.petContainer.x, this.petContainer.y,
                this.tubZone.x, this.tubZone.y
            );

            if (dist < this.tubZone.radius && !this.petInTub) {
                this.putPetInTub();
            } else if (!this.petInTub) {
                // Return home
                this.tweens.add({
                    targets: this.petContainer,
                    x: this.petHomeX,
                    y: this.petHomeY,
                    duration: 300,
                    ease: 'Back.easeOut',
                    onComplete: () => {
                        this.startIdleBounce();
                        this.dragIndicator.setVisible(true);
                    },
                });
            }
        });
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

    showTubHighlight(show) {
        if (!this.tubHighlight) {
            this.tubHighlight = this.add.graphics();
        }

        this.tubHighlight.clear();

        if (show) {
            this.tubHighlight.lineStyle(4, 0x4fc3f7, 0.8);
            this.tubHighlight.strokeCircle(this.tubZone.x, this.tubZone.y, this.tubZone.radius);
            this.tubHighlight.fillStyle(0x4fc3f7, 0.15);
            this.tubHighlight.fillCircle(this.tubZone.x, this.tubZone.y, this.tubZone.radius);
        }
    }

    putPetInTub() {
        this.isAnimating = true;
        this.petInTub = true;

        soundManager.playClick();

        // Safety timeout - if animation gets stuck, reset after 15 seconds
        this.animationSafetyTimer = this.time.addEvent({
            delay: 15000,
            callback: () => {
                if (this.isAnimating) {
                    console.warn('Bathroom animation safety timeout triggered');
                    this.forceResetPet();
                }
            },
        });

        // Splash animation
        this.showSplash();

        // Move pet into tub
        this.tweens.add({
            targets: this.petContainer,
            x: this.tubZone.x - 40,
            y: this.tubZone.y - 20,
            scaleX: 0.9,
            scaleY: 0.9,
            duration: 400,
            onComplete: () => {
                // Draw happy wet pet
                this.drawMiniPetWet(this.petGraphics);
                soundManager.playHappy();

                // Instructions
                this.instructions.setText('Use soap on pet for extra cleaning power!');

                // Start cleaning after delay
                this.time.delayedCall(1500, () => {
                    this.performBasicClean();
                });
            },
        });
    }

    forceResetPet() {
        // Cancel safety timer
        if (this.animationSafetyTimer) {
            this.animationSafetyTimer.remove();
            this.animationSafetyTimer = null;
        }

        // Clear any existing tweens
        this.tweens.killTweensOf(this.petContainer);

        // Reset pet state
        this.drawMiniPet(this.petGraphics, false);
        this.petContainer.x = this.petHomeX;
        this.petContainer.y = this.petHomeY;
        this.petContainer.scaleX = 1;
        this.petContainer.scaleY = 1;

        // Reset flags
        this.isAnimating = false;
        this.petInTub = false;

        // Show drag indicator
        if (this.dragIndicator) {
            this.dragIndicator.setVisible(true);
        }

        // Restart idle bounce
        this.startIdleBounce();

        this.instructions.setText('Drag your pet to the tub! Use soap for extra clean!');
    }

    showSplash() {
        // Water droplets flying out
        for (let i = 0; i < 12; i++) {
            const drop = this.add.graphics();
            drop.fillStyle(0x4fc3f7, 1);
            drop.fillCircle(0, 0, 4 + Math.random() * 4);
            drop.x = this.tubZone.x + (Math.random() - 0.5) * 100;
            drop.y = this.tubZone.y - 30;

            const angle = -Math.PI/2 + (Math.random() - 0.5) * Math.PI;
            const speed = 100 + Math.random() * 100;

            this.tweens.add({
                targets: drop,
                x: drop.x + Math.cos(angle) * speed,
                y: drop.y + Math.sin(angle) * speed + 100,
                alpha: 0,
                duration: 600,
                ease: 'Quad.easeOut',
                onComplete: () => drop.destroy(),
            });
        }
    }

    useSoapOnPet(soapContainer) {
        soundManager.playClean();

        const soapType = soapContainer.soapType;

        // Soap animation
        this.tweens.add({
            targets: soapContainer,
            x: this.petContainer.x,
            y: this.petContainer.y,
            scaleX: 0,
            scaleY: 0,
            duration: 300,
            onComplete: () => {
                // Reset soap
                soapContainer.setScale(1);
                soapContainer.x = soapContainer.homeX;
                soapContainer.y = soapContainer.homeY;

                // Show bubbles based on soap type
                if (soapType.special === 'galaxy') {
                    this.showGalaxyBubbles();
                } else if (soapType.special === 'rainbow') {
                    this.showRainbowBubbles();
                } else {
                    this.showSoapBubbles();
                }

                // Extra cleaning! Bonus coins based on soap type!
                const bonusCoins = soapType.bonus;
                try {
                    petStats.clean(30);
                    inventory.addCoins(bonusCoins);
                } catch (e) {
                    console.warn('Error updating stats:', e);
                }

                // Show coin reward
                const coinText = this.add.text(this.petContainer.x + 50, this.petContainer.y - 40, `+${bonusCoins} 🪙`, {
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
                    duration: 1500,
                    onComplete: () => coinText.destroy(),
                });

                const messages = {
                    regular: 'Extra squeaky clean!',
                    galaxy: '✨ Magical galaxy clean!',
                    rainbow: '🌈 Rainbow sparkle clean!',
                };
                this.ui.showToast(messages[soapType.id] || 'Extra squeaky clean!');
            },
        });
    }

    showGalaxyBubbles() {
        // Galaxy-themed bubbles with stars
        for (let i = 0; i < 20; i++) {
            this.time.delayedCall(i * 40, () => {
                const isstar = Math.random() < 0.3;
                const bubble = this.add.graphics();

                if (isstar) {
                    // Star particle
                    bubble.fillStyle(0xffffff, 1);
                    bubble.fillRect(-3, -3, 6, 6);
                    bubble.fillStyle(0xce93d8, 0.8);
                    bubble.fillCircle(0, 0, 2);
                } else {
                    // Purple/blue galaxy bubble
                    const colors = [0x7b1fa2, 0x4a148c, 0x311b92, 0xce93d8];
                    bubble.fillStyle(colors[Math.floor(Math.random() * colors.length)], 0.8);
                    const size = 6 + Math.random() * 10;
                    bubble.fillCircle(0, 0, size);
                    bubble.fillStyle(0xffffff, 0.5);
                    bubble.fillCircle(-size/3, -size/3, size/4);
                }

                bubble.x = this.petContainer.x - 35 + Math.random() * 70;
                bubble.y = this.petContainer.y - 20 + Math.random() * 40;

                this.tweens.add({
                    targets: bubble,
                    y: bubble.y - 60 - Math.random() * 40,
                    x: bubble.x + (Math.random() - 0.5) * 50,
                    alpha: 0,
                    angle: 360,
                    duration: 1200 + Math.random() * 500,
                    onComplete: () => bubble.destroy(),
                });
            });
        }
    }

    showRainbowBubbles() {
        // Rainbow colored bubbles
        const rainbowColors = [0xff5722, 0xffeb3b, 0x4caf50, 0x2196f3, 0x9c27b0];

        for (let i = 0; i < 20; i++) {
            this.time.delayedCall(i * 40, () => {
                const bubble = this.add.graphics();
                const color = rainbowColors[i % rainbowColors.length];

                bubble.fillStyle(color, 0.9);
                const size = 8 + Math.random() * 10;
                bubble.fillCircle(0, 0, size);
                bubble.fillStyle(0xffffff, 0.6);
                bubble.fillCircle(-size/3, -size/3, size/3);

                bubble.x = this.petContainer.x - 35 + Math.random() * 70;
                bubble.y = this.petContainer.y - 20 + Math.random() * 40;

                this.tweens.add({
                    targets: bubble,
                    y: bubble.y - 55 - Math.random() * 45,
                    x: bubble.x + (Math.random() - 0.5) * 60,
                    alpha: 0,
                    scaleX: 1.5,
                    scaleY: 1.5,
                    duration: 1000 + Math.random() * 500,
                    onComplete: () => bubble.destroy(),
                });
            });
        }
    }

    showSoapBubbles() {
        for (let i = 0; i < 15; i++) {
            this.time.delayedCall(i * 50, () => {
                const bubble = this.add.graphics();
                bubble.fillStyle(0xffffff, 0.8);
                const size = 8 + Math.random() * 12;
                bubble.fillCircle(0, 0, size);
                bubble.fillStyle(0xe3f2fd, 1);
                bubble.fillCircle(-size/3, -size/3, size/4);

                bubble.x = this.petContainer.x - 30 + Math.random() * 60;
                bubble.y = this.petContainer.y - 20 + Math.random() * 40;

                this.tweens.add({
                    targets: bubble,
                    y: bubble.y - 50 - Math.random() * 50,
                    x: bubble.x + (Math.random() - 0.5) * 40,
                    alpha: 0,
                    duration: 1000 + Math.random() * 500,
                    onComplete: () => bubble.destroy(),
                });
            });
        }
    }

    performBasicClean() {
        // Earn coins for bath time!
        const coinsEarned = 2;
        try {
            petStats.clean(20);
            inventory.addCoins(coinsEarned);
        } catch (e) {
            console.warn('Error updating stats:', e);
        }

        // Show sparkles
        this.showCleanSparkles();

        // Show coin reward
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
            duration: 1500,
            onComplete: () => coinText.destroy(),
        });

        this.ui.showToast('Clean and fresh!');

        // After cleaning, pet gets out
        this.time.delayedCall(1500, () => {
            this.petExitTub();
        });
    }

    showCleanSparkles() {
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const sparkle = this.add.graphics();
            sparkle.fillStyle(0xffffff, 1);
            sparkle.fillRect(-4, -4, 8, 8);
            sparkle.x = this.petContainer.x + Math.cos(angle) * 30;
            sparkle.y = this.petContainer.y + Math.sin(angle) * 30;

            this.tweens.add({
                targets: sparkle,
                x: sparkle.x + Math.cos(angle) * 40,
                y: sparkle.y + Math.sin(angle) * 40,
                alpha: 0,
                angle: 360,
                duration: 500,
                onComplete: () => sparkle.destroy(),
            });
        }
    }

    petExitTub() {
        soundManager.playClick();

        // Jump out animation
        this.tweens.add({
            targets: this.petContainer,
            x: this.petHomeX,
            y: this.petHomeY,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.petInTub = false;
                this.isAnimating = false;

                // Cancel safety timer since we completed successfully
                if (this.animationSafetyTimer) {
                    this.animationSafetyTimer.remove();
                    this.animationSafetyTimer = null;
                }

                // Draw normal pet (clean now!)
                this.drawMiniPet(this.petGraphics, true);
                this.dragIndicator.setVisible(true);
                this.startIdleBounce();

                this.instructions.setText('All clean! Drag pet to tub again or go home.');
            },
        });
    }

    drawMiniPet(graphics, happy = false) {
        graphics.clear();

        // Body
        graphics.fillStyle(CONFIG.COLORS.PET_BODY, 1);
        graphics.fillCircle(0, 0, 28);

        // Belly
        graphics.fillStyle(CONFIG.COLORS.PET_BELLY, 1);
        graphics.fillCircle(0, 5, 17);

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
            graphics.fillRect(-12, -8, 7, 9);
            graphics.fillRect(5, -8, 7, 9);
        }

        // Cheeks
        graphics.fillStyle(CONFIG.COLORS.PET_CHEEKS, 0.6);
        graphics.fillRect(-20, 2, 7, 5);
        graphics.fillRect(13, 2, 7, 5);

        // Ears
        graphics.fillStyle(CONFIG.COLORS.PET_BODY, 1);
        graphics.fillRect(-22, -28, 11, 14);
        graphics.fillRect(11, -28, 11, 14);
    }

    drawMiniPetWet(graphics) {
        graphics.clear();

        // Body (slightly darker when wet)
        graphics.fillStyle(0x4fc3f7, 1);
        graphics.fillCircle(0, 0, 28);

        // Belly
        graphics.fillStyle(0xb3e5fc, 1);
        graphics.fillCircle(0, 5, 17);

        // Happy eyes (enjoying bath)
        graphics.fillStyle(CONFIG.COLORS.PET_EYES, 1);
        graphics.fillRect(-12, -8, 3, 3);
        graphics.fillRect(-9, -11, 3, 3);
        graphics.fillRect(-6, -8, 3, 3);
        graphics.fillRect(6, -8, 3, 3);
        graphics.fillRect(9, -11, 3, 3);
        graphics.fillRect(12, -8, 3, 3);

        // Rosy cheeks
        graphics.fillStyle(0xf48fb1, 0.7);
        graphics.fillRect(-20, 2, 7, 5);
        graphics.fillRect(13, 2, 7, 5);

        // Water droplets on head
        graphics.fillStyle(0x81d4fa, 0.8);
        graphics.fillCircle(-15, -20, 4);
        graphics.fillCircle(5, -25, 3);
        graphics.fillCircle(18, -18, 4);

        // Wet ears (droopy)
        graphics.fillStyle(0x4fc3f7, 1);
        graphics.fillRect(-22, -25, 11, 14);
        graphics.fillRect(11, -25, 11, 14);

        // Bubbles on head
        graphics.fillStyle(0xffffff, 0.9);
        graphics.fillCircle(-10, -30, 6);
        graphics.fillCircle(0, -32, 5);
        graphics.fillCircle(12, -28, 4);
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

        // Toast container for messages
        this.ui = {
            showToast: (message) => {
                const toast = this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT - 80, message, {
                    fontSize: CONFIG.FONT.SIZE_MEDIUM,
                    fontFamily: CONFIG.FONT.FAMILY,
                    color: '#ffffff',
                    backgroundColor: '#4caf50',
                    padding: { x: 15, y: 8 },
                }).setOrigin(0.5).setDepth(1000);

                this.tweens.add({
                    targets: toast,
                    y: toast.y - 30,
                    alpha: 0,
                    duration: 1500,
                    delay: 1000,
                    onComplete: () => toast.destroy(),
                });
            },
        };
    }
}
