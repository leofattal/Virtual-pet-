// PixelPal - Pet Naming Scene (First-time setup)

class NamingScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENES.NAMING });
    }

    create() {
        // Create background
        this.createBackground();

        // Create UI elements
        this.createUI();

        // Fade in
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    createBackground() {
        const bg = this.add.graphics();

        // Gradient-like background
        bg.fillStyle(0x1a1a2e, 1);
        bg.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Stars
        bg.fillStyle(0xffffff, 0.8);
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * CONFIG.WIDTH;
            const y = Math.random() * CONFIG.HEIGHT;
            const size = Math.random() * 2 + 1;
            bg.fillCircle(x, y, size);
        }

        // Sparkles animation
        this.sparkles = [];
        for (let i = 0; i < 10; i++) {
            const sparkle = this.add.graphics();
            sparkle.fillStyle(0xffeb3b, 0.8);
            sparkle.fillRect(-2, -2, 4, 4);
            sparkle.x = Math.random() * CONFIG.WIDTH;
            sparkle.y = Math.random() * CONFIG.HEIGHT;
            this.sparkles.push(sparkle);

            this.tweens.add({
                targets: sparkle,
                alpha: 0.2,
                duration: 500 + Math.random() * 1000,
                yoyo: true,
                repeat: -1,
            });
        }
    }

    createUI() {
        // Title
        const title = this.add.text(CONFIG.WIDTH / 2, 80, 'Welcome to PixelPal!', {
            fontSize: '32px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        // Subtitle
        const subtitle = this.add.text(CONFIG.WIDTH / 2, 120, 'Give your new friend a name!', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#b0b0b0',
        }).setOrigin(0.5);

        // Draw the pet preview
        this.createPetPreview();

        // Name input container
        this.createNameInput();

        // Start button
        this.createStartButton();
    }

    createPetPreview() {
        const petContainer = this.add.container(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 - 40);

        const pet = this.add.graphics();

        // Body
        pet.fillStyle(CONFIG.COLORS.PET_BODY, 1);
        pet.fillCircle(0, 0, 50);

        // Belly
        pet.fillStyle(CONFIG.COLORS.PET_BELLY, 1);
        pet.fillCircle(0, 10, 30);

        // Eyes
        pet.fillStyle(0xffffff, 1);
        pet.fillCircle(-15, -10, 12);
        pet.fillCircle(15, -10, 12);
        pet.fillStyle(CONFIG.COLORS.PET_EYES, 1);
        pet.fillCircle(-12, -8, 6);
        pet.fillCircle(18, -8, 6);
        pet.fillStyle(0xffffff, 1);
        pet.fillCircle(-10, -10, 2);
        pet.fillCircle(20, -10, 2);

        // Cheeks
        pet.fillStyle(CONFIG.COLORS.PET_CHEEKS, 0.6);
        pet.fillCircle(-30, 5, 8);
        pet.fillCircle(30, 5, 8);

        // Smile
        pet.lineStyle(3, CONFIG.COLORS.PET_EYES);
        pet.beginPath();
        pet.arc(0, 5, 15, 0.2, Math.PI - 0.2);
        pet.stroke();

        // Ears
        pet.fillStyle(CONFIG.COLORS.PET_BODY, 1);
        pet.fillTriangle(-35, -40, -45, -70, -20, -50);
        pet.fillTriangle(35, -40, 45, -70, 20, -50);
        pet.fillStyle(CONFIG.COLORS.PET_CHEEKS, 1);
        pet.fillTriangle(-33, -45, -40, -60, -25, -50);
        pet.fillTriangle(33, -45, 40, -60, 25, -50);

        petContainer.add(pet);

        // Idle animation
        this.tweens.add({
            targets: petContainer,
            y: petContainer.y - 5,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        // Hearts around pet
        for (let i = 0; i < 3; i++) {
            this.time.addEvent({
                delay: i * 1500 + 500,
                callback: () => this.showHeart(petContainer.x, petContainer.y),
                loop: true,
            });
        }
    }

    showHeart(x, y) {
        const heart = this.add.text(
            x - 40 + Math.random() * 80,
            y - 30,
            '♥',
            { fontSize: '20px', color: '#f06292' }
        );

        this.tweens.add({
            targets: heart,
            y: heart.y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => heart.destroy(),
        });
    }

    createNameInput() {
        // Input background
        const inputBg = this.add.graphics();
        inputBg.fillStyle(0x2d2d44, 1);
        inputBg.fillRect(CONFIG.WIDTH / 2 - 150, CONFIG.HEIGHT / 2 + 80, 300, 50);
        inputBg.lineStyle(3, CONFIG.COLORS.PRIMARY);
        inputBg.strokeRect(CONFIG.WIDTH / 2 - 150, CONFIG.HEIGHT / 2 + 80, 300, 50);

        // Default name text
        this.nameText = this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 + 105, 'Pixel', {
            fontSize: CONFIG.FONT.SIZE_LARGE,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        // Current name value
        this.petName = 'Pixel';

        // Cursor blink
        this.cursor = this.add.text(CONFIG.WIDTH / 2 + 35, CONFIG.HEIGHT / 2 + 105, '|', {
            fontSize: CONFIG.FONT.SIZE_LARGE,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffca28',
        }).setOrigin(0.5);

        this.tweens.add({
            targets: this.cursor,
            alpha: 0,
            duration: 500,
            yoyo: true,
            repeat: -1,
        });

        // Instructions
        this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 + 145, 'Type a name (max 12 characters)', {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#888888',
        }).setOrigin(0.5);

        // Keyboard input
        this.input.keyboard.on('keydown', (event) => {
            if (event.key === 'Backspace') {
                this.petName = this.petName.slice(0, -1);
            } else if (event.key.length === 1 && this.petName.length < 12) {
                // Only allow letters, numbers, and spaces
                if (/^[a-zA-Z0-9 ]$/.test(event.key)) {
                    this.petName += event.key;
                }
            }

            // Update display
            this.nameText.setText(this.petName || 'Pixel');
            this.updateCursorPosition();
        });
    }

    updateCursorPosition() {
        const textWidth = this.nameText.width;
        this.cursor.x = CONFIG.WIDTH / 2 + textWidth / 2 + 5;
    }

    createStartButton() {
        const btnContainer = this.add.container(CONFIG.WIDTH / 2, CONFIG.HEIGHT - 100);

        const btnBg = this.add.graphics();
        btnBg.fillStyle(CONFIG.COLORS.SUCCESS, 1);
        btnBg.fillRect(-100, -25, 200, 50);
        btnBg.lineStyle(3, 0x81c784);
        btnBg.strokeRect(-100, -25, 200, 50);

        const btnText = this.add.text(0, 0, 'Start Adventure!', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        btnContainer.add([btnBg, btnText]);
        btnContainer.setSize(200, 50);
        btnContainer.setInteractive({ useHandCursor: true });

        btnContainer.on('pointerover', () => {
            btnBg.clear();
            btnBg.fillStyle(0x81c784, 1);
            btnBg.fillRect(-100, -25, 200, 50);
            btnBg.lineStyle(3, CONFIG.COLORS.ACCENT);
            btnBg.strokeRect(-100, -25, 200, 50);
        });

        btnContainer.on('pointerout', () => {
            btnBg.clear();
            btnBg.fillStyle(CONFIG.COLORS.SUCCESS, 1);
            btnBg.fillRect(-100, -25, 200, 50);
            btnBg.lineStyle(3, 0x81c784);
            btnBg.strokeRect(-100, -25, 200, 50);
        });

        btnContainer.on('pointerdown', () => {
            soundManager.playClick();
            this.startGame();
        });

        // Pulse animation
        this.tweens.add({
            targets: btnContainer,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });
    }

    startGame() {
        // Set the pet name
        const finalName = this.petName.trim() || 'Pixel';
        petStats.setName(finalName);

        // Save immediately
        saveSystem.saveNow();

        // Transition to home
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
            this.scene.start(CONFIG.SCENES.HOME);
        });
    }
}
