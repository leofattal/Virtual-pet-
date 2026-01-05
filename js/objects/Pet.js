// PixelPal - Pet Object

class Pet {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.sprite = null;
        this.hatSprite = null;
        this.accessorySprite = null;

        this.currentState = 'neutral';
        this.animationTimer = null;
        this.bobOffset = 0;

        this.create();
    }

    create() {
        // Create pet container
        this.container = this.scene.add.container(this.x, this.y);

        // Create main pet sprite
        this.sprite = this.scene.add.graphics();
        this.container.add(this.sprite);

        // Draw initial pet
        this.drawPet();

        // Start idle animation
        this.startIdleAnimation();
    }

    drawPet() {
        this.sprite.clear();

        const state = petStats.getState();
        this.currentState = state;

        // Get colors based on state
        const colors = this.getStateColors(state);

        // Body (main oval shape made of pixels)
        this.sprite.fillStyle(colors.body, 1);
        this.drawPixelOval(0, 0, 40, 50);

        // Belly
        this.sprite.fillStyle(colors.belly, 1);
        this.drawPixelOval(0, 8, 25, 30);

        // Eyes
        this.sprite.fillStyle(colors.eyes, 1);
        this.drawEyes(state);

        // Mouth
        this.drawMouth(state);

        // Cheeks (blush)
        this.sprite.fillStyle(colors.cheeks, 0.6);
        this.sprite.fillRect(-28, 8, 8, 6);
        this.sprite.fillRect(20, 8, 8, 6);

        // Ears
        this.sprite.fillStyle(colors.body, 1);
        this.sprite.fillRect(-30, -35, 12, 16);
        this.sprite.fillRect(18, -35, 12, 16);

        // Inner ears
        this.sprite.fillStyle(colors.cheeks, 1);
        this.sprite.fillRect(-28, -32, 8, 10);
        this.sprite.fillRect(20, -32, 8, 10);

        // Draw equipped items
        this.drawOutfit();
    }

    drawPixelOval(cx, cy, rx, ry) {
        // Draw pixelated oval shape
        const pixelSize = 4;
        for (let y = -ry; y <= ry; y += pixelSize) {
            for (let x = -rx; x <= rx; x += pixelSize) {
                const nx = x / rx;
                const ny = y / ry;
                if (nx * nx + ny * ny <= 1) {
                    this.sprite.fillRect(cx + x - pixelSize/2, cy + y - pixelSize/2, pixelSize, pixelSize);
                }
            }
        }
    }

    drawEyes(state) {
        const eyeY = -8 + this.bobOffset;

        switch (state) {
            case 'sleepy':
                // Closed/droopy eyes
                this.sprite.fillRect(-18, eyeY, 12, 4);
                this.sprite.fillRect(6, eyeY, 12, 4);
                break;

            case 'happy':
                // Happy curved eyes (^_^)
                this.sprite.fillRect(-18, eyeY - 4, 4, 4);
                this.sprite.fillRect(-14, eyeY - 8, 4, 4);
                this.sprite.fillRect(-10, eyeY - 4, 4, 4);

                this.sprite.fillRect(6, eyeY - 4, 4, 4);
                this.sprite.fillRect(10, eyeY - 8, 4, 4);
                this.sprite.fillRect(14, eyeY - 4, 4, 4);
                break;

            case 'sad':
            case 'hungry':
                // Sad eyes (worried)
                this.sprite.fillRect(-16, eyeY, 8, 8);
                this.sprite.fillRect(8, eyeY, 8, 8);
                // Tear drop for sad
                if (state === 'sad') {
                    this.sprite.fillStyle(0x81d4fa, 1);
                    this.sprite.fillRect(-6, eyeY + 12, 4, 6);
                }
                break;

            default:
                // Normal eyes
                this.sprite.fillRect(-16, eyeY, 8, 10);
                this.sprite.fillRect(8, eyeY, 8, 10);

                // Eye shine
                this.sprite.fillStyle(0xffffff, 1);
                this.sprite.fillRect(-14, eyeY + 2, 4, 4);
                this.sprite.fillRect(10, eyeY + 2, 4, 4);
        }
    }

    drawMouth(state) {
        this.sprite.fillStyle(CONFIG.COLORS.PET_EYES, 1);
        const mouthY = 18 + this.bobOffset;

        switch (state) {
            case 'happy':
                // Big smile
                this.sprite.fillRect(-10, mouthY, 20, 4);
                this.sprite.fillRect(-14, mouthY - 4, 4, 4);
                this.sprite.fillRect(10, mouthY - 4, 4, 4);
                break;

            case 'sad':
            case 'hungry':
                // Frown
                this.sprite.fillRect(-8, mouthY + 4, 16, 4);
                this.sprite.fillRect(-12, mouthY, 4, 4);
                this.sprite.fillRect(8, mouthY, 4, 4);
                break;

            case 'sleepy':
                // Small o for sleeping
                this.sprite.fillRect(-4, mouthY, 8, 8);
                this.sprite.fillStyle(CONFIG.COLORS.PET_BELLY, 1);
                this.sprite.fillRect(-2, mouthY + 2, 4, 4);
                break;

            default:
                // Neutral small smile
                this.sprite.fillRect(-6, mouthY, 12, 4);
        }
    }

    drawOutfit() {
        // Draw hat if equipped
        if (petStats.outfit.hat) {
            const item = getItemById(petStats.outfit.hat);
            if (item) {
                this.drawHat(item);
            }
        }

        // Draw accessory if equipped
        if (petStats.outfit.accessory) {
            const item = getItemById(petStats.outfit.accessory);
            if (item) {
                this.drawAccessory(item);
            }
        }
    }

    drawHat(item) {
        const hatY = -45 + this.bobOffset;

        this.sprite.fillStyle(item.color, 1);

        switch (item.id) {
            case 'hat_red':
                // Baseball cap
                this.sprite.fillRect(-20, hatY, 40, 12);
                this.sprite.fillRect(-24, hatY + 8, 48, 6);
                break;

            case 'hat_wizard':
                // Wizard hat (triangle)
                for (let i = 0; i < 30; i += 4) {
                    const width = 36 - i;
                    this.sprite.fillRect(-width/2, hatY - i, width, 4);
                }
                // Star
                this.sprite.fillStyle(0xffeb3b, 1);
                this.sprite.fillRect(-2, hatY - 18, 4, 4);
                break;

            case 'hat_crown':
                // Crown
                this.sprite.fillRect(-20, hatY + 4, 40, 10);
                this.sprite.fillRect(-18, hatY - 4, 8, 8);
                this.sprite.fillRect(-4, hatY - 8, 8, 12);
                this.sprite.fillRect(10, hatY - 4, 8, 8);
                // Jewels
                this.sprite.fillStyle(0xe53935, 1);
                this.sprite.fillRect(0, hatY, 4, 4);
                break;

            case 'hat_bow':
                // Ribbon bow
                this.sprite.fillRect(-16, hatY + 8, 12, 10);
                this.sprite.fillRect(4, hatY + 8, 12, 10);
                this.sprite.fillRect(-4, hatY + 10, 8, 6);
                break;
        }
    }

    drawAccessory(item) {
        this.sprite.fillStyle(item.color, 1);

        switch (item.id) {
            case 'glasses':
                // Sunglasses
                const glassY = -6 + this.bobOffset;
                this.sprite.fillRect(-22, glassY - 2, 18, 14);
                this.sprite.fillRect(4, glassY - 2, 18, 14);
                this.sprite.fillRect(-4, glassY + 2, 8, 4);
                break;

            case 'scarf':
                // Scarf around neck
                const scarfY = 35 + this.bobOffset;
                this.sprite.fillRect(-25, scarfY, 50, 10);
                this.sprite.fillRect(15, scarfY + 10, 12, 25);
                break;

            case 'wings':
                // Angel wings (behind pet)
                const wingY = -10 + this.bobOffset;
                // Left wing
                this.sprite.fillStyle(item.color, 0.8);
                for (let i = 0; i < 3; i++) {
                    this.sprite.fillRect(-50 - i * 8, wingY + i * 10, 20, 15);
                }
                // Right wing
                for (let i = 0; i < 3; i++) {
                    this.sprite.fillRect(30 + i * 8, wingY + i * 10, 20, 15);
                }
                break;

            case 'backpack':
                // Backpack (side view)
                const bpY = 0 + this.bobOffset;
                this.sprite.fillRect(30, bpY, 20, 35);
                this.sprite.fillStyle(0x6d4c41, 1);
                this.sprite.fillRect(32, bpY + 5, 16, 8);
                break;
        }
    }

    getStateColors(state) {
        const baseColors = {
            body: CONFIG.COLORS.PET_BODY,
            belly: CONFIG.COLORS.PET_BELLY,
            cheeks: CONFIG.COLORS.PET_CHEEKS,
            eyes: CONFIG.COLORS.PET_EYES,
        };

        // Modify colors based on state
        switch (state) {
            case 'sleepy':
                return { ...baseColors, body: 0x90caf9 }; // Lighter blue
            case 'sad':
                return { ...baseColors, body: 0x7986cb }; // Purple-blue
            case 'hungry':
                return { ...baseColors, cheeks: 0xffab91 }; // Orange-ish
            case 'dirty':
                return { ...baseColors, body: 0x8d6e63, belly: 0xa1887f }; // Brownish
            default:
                return baseColors;
        }
    }

    startIdleAnimation() {
        // Bob up and down
        let direction = 1;

        this.animationTimer = this.scene.time.addEvent({
            delay: 300,
            callback: () => {
                this.bobOffset += direction * 2;
                if (this.bobOffset >= 4 || this.bobOffset <= -4) {
                    direction *= -1;
                }
                this.drawPet();
            },
            loop: true,
        });
    }

    stopIdleAnimation() {
        if (this.animationTimer) {
            this.animationTimer.remove();
            this.animationTimer = null;
        }
    }

    // Animation for feeding
    playFeedAnimation() {
        const originalY = this.container.y;

        this.scene.tweens.add({
            targets: this.container,
            y: originalY - 10,
            duration: 150,
            yoyo: true,
            repeat: 2,
            ease: 'Bounce.easeOut',
        });
    }

    // Animation for sleeping
    playSleepAnimation() {
        // Zzz bubbles
        for (let i = 0; i < 3; i++) {
            this.scene.time.delayedCall(i * 500, () => {
                const z = this.scene.add.text(
                    this.x + 30 + i * 10,
                    this.y - 40 - i * 20,
                    'Z',
                    {
                        fontSize: 16 + i * 4,
                        fontFamily: CONFIG.FONT.FAMILY,
                        color: '#ffffff',
                    }
                );

                this.scene.tweens.add({
                    targets: z,
                    y: z.y - 30,
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => z.destroy(),
                });
            });
        }
    }

    // Animation for cleaning
    playCleanAnimation() {
        // Sparkles
        for (let i = 0; i < 6; i++) {
            this.scene.time.delayedCall(i * 100, () => {
                const angle = (i / 6) * Math.PI * 2;
                const sparkle = this.scene.add.graphics();
                sparkle.fillStyle(0xffffff, 1);
                sparkle.fillRect(-3, -3, 6, 6);
                sparkle.x = this.x + Math.cos(angle) * 50;
                sparkle.y = this.y + Math.sin(angle) * 50;

                this.scene.tweens.add({
                    targets: sparkle,
                    x: this.x + Math.cos(angle) * 80,
                    y: this.y + Math.sin(angle) * 80,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => sparkle.destroy(),
                });
            });
        }
    }

    // Animation for happiness/play
    playHappyAnimation() {
        // Hearts
        for (let i = 0; i < 3; i++) {
            this.scene.time.delayedCall(i * 200, () => {
                const heart = this.scene.add.text(
                    this.x - 30 + Math.random() * 60,
                    this.y - 60,
                    '♥',
                    {
                        fontSize: '20px',
                        color: '#f06292',
                    }
                );

                this.scene.tweens.add({
                    targets: heart,
                    y: heart.y - 40,
                    alpha: 0,
                    duration: 800,
                    onComplete: () => heart.destroy(),
                });
            });
        }

        // Bounce
        this.scene.tweens.add({
            targets: this.container,
            scaleX: 1.1,
            scaleY: 0.9,
            duration: 100,
            yoyo: true,
            repeat: 2,
        });
    }

    // Update pet appearance
    refresh() {
        // Safety check - ensure scene and sprite are still valid
        if (!this.scene || !this.scene.sys || !this.scene.sys.isActive()) return;
        if (!this.sprite || !this.sprite.active) return;

        try {
            this.drawPet();
        } catch (e) {
            // Pet may have been destroyed
        }
    }

    // Move pet to position
    moveTo(x, y, duration = 500) {
        return new Promise(resolve => {
            this.scene.tweens.add({
                targets: this.container,
                x: x,
                y: y,
                duration: duration,
                ease: 'Power2',
                onComplete: resolve,
            });
        });
    }

    // Clean up
    destroy() {
        this.stopIdleAnimation();
        if (this.container) {
            this.container.destroy();
        }
    }
}
