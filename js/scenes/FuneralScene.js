// PixelPal - Funeral Scene (Pet Death)

class FuneralScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENES.FUNERAL });
    }

    create() {
        // Create dark, somber background
        this.createBackground();

        // Create coffin
        this.createCoffin();

        // Create deceased pet (draggable)
        this.createDeceasedPet();

        // Create dirt pile
        this.createDirtPile();

        // Create UI text
        this.createUI();

        // Track funeral stages
        this.petInCoffin = false;
        this.dirtAdded = 0;
        this.funeralComplete = false;

        // Scene transition fade in
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    createBackground() {
        const bg = this.add.graphics();

        // Dark night sky
        bg.fillStyle(0x1a1a2e, 1);
        bg.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Stars (dim)
        bg.fillStyle(0xffffff, 0.3);
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * CONFIG.WIDTH;
            const y = Math.random() * (CONFIG.HEIGHT / 2);
            bg.fillCircle(x, y, 1);
        }

        // Moon (crescent, sad)
        bg.fillStyle(0xc5cae9, 0.6);
        bg.fillCircle(650, 80, 40);
        bg.fillStyle(0x1a1a2e, 1);
        bg.fillCircle(670, 70, 35);

        // Ground (cemetery)
        bg.fillStyle(0x2d2d2d, 1);
        bg.fillRect(0, CONFIG.HEIGHT - 150, CONFIG.WIDTH, 150);

        // Grass tufts
        bg.fillStyle(0x1b5e20, 0.6);
        for (let x = 0; x < CONFIG.WIDTH; x += 30) {
            bg.fillTriangle(x, CONFIG.HEIGHT - 150, x + 10, CONFIG.HEIGHT - 165, x + 20, CONFIG.HEIGHT - 150);
        }

        // Tombstones in background
        this.createTombstone(bg, 100, CONFIG.HEIGHT - 200, 'RIP');
        this.createTombstone(bg, 600, CONFIG.HEIGHT - 190, '♥');

        // Wilted flowers
        bg.fillStyle(0x5d4037, 1);
        bg.fillRect(550, CONFIG.HEIGHT - 180, 3, 30);
        bg.fillStyle(0x7b1fa2, 0.5);
        bg.fillCircle(551, CONFIG.HEIGHT - 185, 8);
    }

    createTombstone(bg, x, y, text) {
        // Tombstone
        bg.fillStyle(0x616161, 1);
        bg.fillRect(x - 25, y, 50, 60);
        bg.fillStyle(0x757575, 1);
        bg.beginPath();
        bg.arc(x, y, 25, Math.PI, 0);
        bg.fill();

        // Add text later as Phaser text
        this.add.text(x, y + 20, text, {
            fontSize: '14px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#9e9e9e',
        }).setOrigin(0.5);
    }

    createCoffin() {
        const coffinX = CONFIG.WIDTH / 2;
        const coffinY = CONFIG.HEIGHT - 100;

        this.coffinContainer = this.add.container(coffinX, coffinY);

        const coffin = this.add.graphics();

        // Coffin hole (grave)
        coffin.fillStyle(0x1a1a1a, 1);
        coffin.fillRect(-70, -10, 140, 50);

        // Coffin body
        coffin.fillStyle(0x5d4037, 1);
        coffin.beginPath();
        coffin.moveTo(-60, -30);
        coffin.lineTo(-40, -50);
        coffin.lineTo(40, -50);
        coffin.lineTo(60, -30);
        coffin.lineTo(60, 20);
        coffin.lineTo(-60, 20);
        coffin.closePath();
        coffin.fill();

        // Coffin rim
        coffin.lineStyle(3, 0x8d6e63);
        coffin.beginPath();
        coffin.moveTo(-60, -30);
        coffin.lineTo(-40, -50);
        coffin.lineTo(40, -50);
        coffin.lineTo(60, -30);
        coffin.lineTo(60, 20);
        coffin.lineTo(-60, 20);
        coffin.closePath();
        coffin.stroke();

        // Coffin interior (lighter)
        coffin.fillStyle(0xbcaaa4, 1);
        coffin.beginPath();
        coffin.moveTo(-50, -25);
        coffin.lineTo(-35, -40);
        coffin.lineTo(35, -40);
        coffin.lineTo(50, -25);
        coffin.lineTo(50, 10);
        coffin.lineTo(-50, 10);
        coffin.closePath();
        coffin.fill();

        // Pillow
        coffin.fillStyle(0xfafafa, 1);
        coffin.fillEllipse(-25, -20, 30, 15);

        // Cross on coffin
        coffin.fillStyle(0xffc107, 1);
        coffin.fillRect(-3, -45, 6, 15);
        coffin.fillRect(-8, -40, 16, 5);

        this.coffinContainer.add(coffin);

        // Drop zone for pet
        this.coffinZone = {
            x: coffinX,
            y: coffinY - 10,
            width: 100,
            height: 60,
        };

        // Label
        this.coffinLabel = this.add.text(coffinX, coffinY + 50, '⬇️ Drag pet here', {
            fontSize: '12px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#9e9e9e',
        }).setOrigin(0.5);
    }

    createDeceasedPet() {
        const petX = 150;
        const petY = CONFIG.HEIGHT / 2;

        this.petContainer = this.add.container(petX, petY);

        const pet = this.add.graphics();

        // Ghostly/faded pet body
        pet.fillStyle(0x9e9e9e, 0.8);
        pet.fillCircle(0, 0, 40);

        // Belly (faded)
        pet.fillStyle(0xbdbdbd, 0.6);
        pet.fillCircle(0, 8, 25);

        // Closed eyes (X X)
        pet.lineStyle(3, 0x424242);
        pet.lineBetween(-20, -8, -10, -2);
        pet.lineBetween(-20, -2, -10, -8);
        pet.lineBetween(10, -8, 20, -2);
        pet.lineBetween(10, -2, 20, -8);

        // Sad mouth
        pet.lineStyle(2, 0x424242);
        pet.beginPath();
        pet.arc(0, 15, 10, Math.PI + 0.3, -0.3);
        pet.stroke();

        // Halo
        pet.lineStyle(2, 0xffd54f, 0.6);
        pet.strokeEllipse(0, -50, 30, 10);

        // Ears (droopy)
        pet.fillStyle(0x9e9e9e, 0.8);
        pet.fillTriangle(-30, -30, -40, -55, -18, -40);
        pet.fillTriangle(30, -30, 40, -55, 18, -40);

        this.petContainer.add(pet);

        // Pet name
        const nameText = this.add.text(0, 55, petStats.name, {
            fontSize: '14px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#757575',
        }).setOrigin(0.5);
        this.petContainer.add(nameText);

        // Make pet draggable
        this.petContainer.setSize(80, 100);
        this.petContainer.setInteractive({ useHandCursor: true, draggable: true });

        this.input.setDraggable(this.petContainer);

        this.petContainer.on('dragstart', () => {
            this.petContainer.setScale(1.1);
            this.showCoffinHighlight(true);
        });

        this.petContainer.on('drag', (pointer, dragX, dragY) => {
            this.petContainer.x = dragX;
            this.petContainer.y = dragY;
        });

        this.petContainer.on('dragend', () => {
            this.petContainer.setScale(1);
            this.showCoffinHighlight(false);

            // Check if dropped in coffin
            if (this.isInCoffin(this.petContainer.x, this.petContainer.y)) {
                this.placePetInCoffin();
            }
        });
    }

    showCoffinHighlight(show) {
        if (!this.coffinHighlight) {
            this.coffinHighlight = this.add.graphics();
        }

        this.coffinHighlight.clear();

        if (show && !this.petInCoffin) {
            this.coffinHighlight.lineStyle(3, 0x7986cb, 0.8);
            this.coffinHighlight.strokeRect(
                this.coffinZone.x - this.coffinZone.width / 2,
                this.coffinZone.y - this.coffinZone.height / 2,
                this.coffinZone.width,
                this.coffinZone.height
            );
        }
    }

    isInCoffin(x, y) {
        return x > this.coffinZone.x - this.coffinZone.width / 2 &&
               x < this.coffinZone.x + this.coffinZone.width / 2 &&
               y > this.coffinZone.y - this.coffinZone.height / 2 &&
               y < this.coffinZone.y + this.coffinZone.height / 2;
    }

    placePetInCoffin() {
        if (this.petInCoffin) return;

        this.petInCoffin = true;
        this.coffinLabel.destroy();

        // Animate pet into coffin
        this.tweens.add({
            targets: this.petContainer,
            x: this.coffinZone.x,
            y: this.coffinZone.y,
            scaleX: 0.7,
            scaleY: 0.7,
            angle: -90,
            duration: 500,
            onComplete: () => {
                // Disable dragging
                this.petContainer.disableInteractive();

                // Show dirt instruction
                this.dirtLabel.setText('⬇️ Drag dirt to cover');

                // Play sad sound
                soundManager.playGameOver();
            },
        });
    }

    createDirtPile() {
        const dirtX = CONFIG.WIDTH - 150;
        const dirtY = CONFIG.HEIGHT / 2 + 50;

        this.dirtPile = this.add.container(dirtX, dirtY);

        const dirt = this.add.graphics();

        // Dirt mound
        dirt.fillStyle(0x5d4037, 1);
        dirt.fillEllipse(0, 20, 100, 40);
        dirt.fillStyle(0x4e342e, 1);
        dirt.fillEllipse(0, 0, 80, 50);

        // Dirt texture
        dirt.fillStyle(0x3e2723, 1);
        for (let i = 0; i < 10; i++) {
            const rx = -30 + Math.random() * 60;
            const ry = -15 + Math.random() * 30;
            dirt.fillCircle(rx, ry, 3 + Math.random() * 5);
        }

        // Shovel
        dirt.fillStyle(0x8d6e63, 1);
        dirt.fillRect(40, -40, 8, 60);
        dirt.fillStyle(0x616161, 1);
        dirt.beginPath();
        dirt.moveTo(30, 20);
        dirt.lineTo(58, 20);
        dirt.lineTo(54, 45);
        dirt.lineTo(34, 45);
        dirt.closePath();
        dirt.fill();

        this.dirtPile.add(dirt);

        // Create draggable dirt pieces
        this.dirtPieces = [];
        for (let i = 0; i < 3; i++) {
            const piece = this.createDraggableDirt(dirtX - 20 + i * 20, dirtY - 30);
            this.dirtPieces.push(piece);
        }

        // Label
        this.dirtLabel = this.add.text(dirtX, dirtY + 60, 'Place pet in coffin first', {
            fontSize: '11px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#8d6e63',
        }).setOrigin(0.5);
    }

    createDraggableDirt(x, y) {
        const container = this.add.container(x, y);

        const dirt = this.add.graphics();
        dirt.fillStyle(0x5d4037, 1);
        dirt.fillCircle(0, 0, 15);
        dirt.fillStyle(0x4e342e, 1);
        dirt.fillCircle(-3, -3, 5);
        dirt.fillCircle(5, 2, 4);

        container.add(dirt);
        container.setSize(35, 35);
        container.setInteractive({ useHandCursor: true, draggable: true });
        container.homeX = x;
        container.homeY = y;

        this.input.setDraggable(container);

        container.on('dragstart', () => {
            container.setScale(1.2);
            container.setDepth(100);
        });

        container.on('drag', (pointer, dragX, dragY) => {
            container.x = dragX;
            container.y = dragY;
        });

        container.on('dragend', () => {
            container.setScale(1);
            container.setDepth(0);

            // Check if dropped on coffin (only if pet is in coffin)
            if (this.petInCoffin && this.isInCoffin(container.x, container.y)) {
                this.addDirt(container);
            } else {
                // Return to pile
                this.tweens.add({
                    targets: container,
                    x: container.homeX,
                    y: container.homeY,
                    duration: 200,
                });
            }
        });

        return container;
    }

    addDirt(dirtContainer) {
        // Animate dirt falling into grave
        this.tweens.add({
            targets: dirtContainer,
            y: this.coffinZone.y + 20,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                dirtContainer.destroy();
                this.dirtAdded++;

                // Draw dirt covering coffin
                this.drawDirtCover();

                if (this.dirtAdded >= 3) {
                    this.completeFuneral();
                }
            },
        });
    }

    drawDirtCover() {
        if (!this.dirtCover) {
            this.dirtCover = this.add.graphics();
            this.dirtCover.setDepth(50);
        }

        const coverHeight = this.dirtAdded * 20;
        this.dirtCover.clear();
        this.dirtCover.fillStyle(0x5d4037, 1);
        this.dirtCover.fillRect(
            this.coffinZone.x - 60,
            this.coffinZone.y + 30 - coverHeight,
            120,
            coverHeight
        );

        // Dirt texture
        this.dirtCover.fillStyle(0x4e342e, 1);
        for (let i = 0; i < this.dirtAdded * 3; i++) {
            const rx = this.coffinZone.x - 50 + Math.random() * 100;
            const ry = this.coffinZone.y + 25 - Math.random() * coverHeight;
            this.dirtCover.fillCircle(rx, ry, 3 + Math.random() * 4);
        }
    }

    completeFuneral() {
        if (this.funeralComplete) return;
        this.funeralComplete = true;

        this.dirtLabel.setText('Rest in peace...');

        // Add flowers on grave
        const flower = this.add.text(this.coffinZone.x, this.coffinZone.y - 20, '🌹', {
            fontSize: '24px',
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: flower,
            alpha: 1,
            duration: 1000,
        });

        // Add tombstone
        this.time.delayedCall(1500, () => {
            this.createFinalTombstone();
        });

        // Show restart button after delay
        this.time.delayedCall(3000, () => {
            this.showRestartButton();
        });
    }

    createFinalTombstone() {
        const x = this.coffinZone.x;
        const y = this.coffinZone.y - 60;

        const tombstone = this.add.graphics();
        tombstone.fillStyle(0x757575, 1);
        tombstone.fillRect(x - 40, y, 80, 70);
        tombstone.beginPath();
        tombstone.arc(x, y, 40, Math.PI, 0);
        tombstone.fill();

        tombstone.setAlpha(0);
        this.tweens.add({
            targets: tombstone,
            alpha: 1,
            duration: 1000,
        });

        // Pet name on tombstone
        const nameText = this.add.text(x, y + 10, petStats.name, {
            fontSize: '16px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5).setAlpha(0);

        const ripText = this.add.text(x, y + 35, 'R.I.P.', {
            fontSize: '12px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#e0e0e0',
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: [nameText, ripText],
            alpha: 1,
            duration: 1000,
            delay: 500,
        });
    }

    showRestartButton() {
        const btnContainer = this.add.container(CONFIG.WIDTH / 2, CONFIG.HEIGHT - 50);

        const btnBg = this.add.graphics();
        btnBg.fillStyle(0x5c6bc0, 1);
        btnBg.fillRect(-100, -25, 200, 50);
        btnBg.lineStyle(3, 0x7986cb);
        btnBg.strokeRect(-100, -25, 200, 50);

        const btnText = this.add.text(0, 0, '🔄 Start New Journey', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        btnContainer.add([btnBg, btnText]);
        btnContainer.setSize(200, 50);
        btnContainer.setInteractive({ useHandCursor: true });

        btnContainer.setAlpha(0);
        this.tweens.add({
            targets: btnContainer,
            alpha: 1,
            duration: 500,
        });

        btnContainer.on('pointerover', () => {
            btnBg.clear();
            btnBg.fillStyle(0x7986cb, 1);
            btnBg.fillRect(-100, -25, 200, 50);
            btnBg.lineStyle(3, 0x9fa8da);
            btnBg.strokeRect(-100, -25, 200, 50);
        });

        btnContainer.on('pointerout', () => {
            btnBg.clear();
            btnBg.fillStyle(0x5c6bc0, 1);
            btnBg.fillRect(-100, -25, 200, 50);
            btnBg.lineStyle(3, 0x7986cb);
            btnBg.strokeRect(-100, -25, 200, 50);
        });

        btnContainer.on('pointerdown', () => {
            soundManager.playClick();
            this.restartGame();
        });
    }

    restartGame() {
        // Reset everything
        petStats.resetAfterDeath();

        // Fade out and go to naming scene
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.time.delayedCall(1000, () => {
            this.scene.start(CONFIG.SCENES.NAMING);
        });
    }

    createUI() {
        // Title
        this.add.text(CONFIG.WIDTH / 2, 40, 'Goodbye, ' + petStats.name + '...', {
            fontSize: '28px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#9e9e9e',
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(CONFIG.WIDTH / 2, 80, 'Your pet passed away from neglect', {
            fontSize: '14px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#757575',
        }).setOrigin(0.5);

        // Instructions
        this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT - 180, 'Hold a funeral to say goodbye', {
            fontSize: '12px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#616161',
        }).setOrigin(0.5);
    }
}
