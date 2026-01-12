// PixelPal - Trophy Room Scene (Achievement Display)

class TrophyRoomScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TrophyRoom' });
    }

    create() {
        // Create background
        this.createBackground();

        // Title
        this.add.text(CONFIG.WIDTH / 2, 30, '🏆 Trophy Room', {
            fontSize: CONFIG.FONT.SIZE_LARGE,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffd700',
        }).setOrigin(0.5);

        // Progress text
        const progress = achievementSystem.getProgress();
        const unlocked = achievementSystem.getUnlockedAchievements().length;
        const total = Object.keys(achievementSystem.achievements).length;

        this.add.text(CONFIG.WIDTH / 2, 60, `${unlocked}/${total} Achievements (${progress}%)`, {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        // Progress bar
        this.createProgressBar(progress);

        // Back button
        this.createBackButton();

        // Achievement grid
        this.createAchievementGrid();

        // Fade in
        this.cameras.main.fadeIn(300, 0, 0, 0);
    }

    createBackground() {
        const bg = this.add.graphics();

        // Dark elegant background
        bg.fillStyle(0x1a1a2e, 1);
        bg.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Floor
        bg.fillStyle(0x0f0f1e, 1);
        bg.fillRect(0, CONFIG.HEIGHT - 150, CONFIG.WIDTH, 150);

        // Spotlight effect
        for (let i = 0; i < 3; i++) {
            const x = 200 + i * 200;
            bg.fillStyle(0xffd700, 0.05);
            bg.fillCircle(x, 100, 100);
        }

        // Decorative shelves
        bg.fillStyle(0x2d2d44, 1);
        bg.fillRect(50, 110, CONFIG.WIDTH - 100, 10);
        bg.fillRect(50, 300, CONFIG.WIDTH - 100, 10);
    }

    createProgressBar(progress) {
        const barWidth = 300;
        const barHeight = 20;
        const x = CONFIG.WIDTH / 2 - barWidth / 2;
        const y = 85;

        // Background
        const bg = this.add.graphics();
        bg.fillStyle(0x333333, 1);
        bg.fillRect(x, y, barWidth, barHeight);

        // Progress fill
        const fill = this.add.graphics();
        fill.fillStyle(0xffd700, 1);
        fill.fillRect(x, y, (barWidth * progress) / 100, barHeight);

        // Border
        const border = this.add.graphics();
        border.lineStyle(2, 0xffffff, 1);
        border.strokeRect(x, y, barWidth, barHeight);
    }

    createAchievementGrid() {
        const achievements = Object.values(achievementSystem.achievements);

        const startX = 60;
        const startY = 140;
        const cellWidth = 160;
        const cellHeight = 120;
        const cols = 4;

        // Create scrollable container
        const scrollContainer = this.add.container(0, 0);

        achievements.forEach((achievement, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = startX + col * cellWidth;
            const y = startY + row * cellHeight;

            const card = this.createAchievementCard(x, y, achievement);
            scrollContainer.add(card);
        });

        // Simple scroll with mouse wheel (if needed)
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            const newY = scrollContainer.y - deltaY * 0.3;
            const maxScroll = -(Math.ceil(achievements.length / cols) * cellHeight - 400);
            scrollContainer.y = Phaser.Math.Clamp(newY, maxScroll, 0);
        });
    }

    createAchievementCard(x, y, achievement) {
        const card = this.add.container(x, y);

        const isUnlocked = achievement.unlocked;

        // Card background
        const bg = this.add.graphics();
        if (isUnlocked) {
            bg.fillStyle(0x2d4a2c, 1);
            bg.lineStyle(3, 0x4caf50, 1);
        } else {
            bg.fillStyle(0x2a2a2a, 1);
            bg.lineStyle(2, 0x555555, 1);
        }
        bg.fillRoundedRect(0, 0, 140, 100, 8);
        bg.strokeRoundedRect(0, 0, 140, 100, 8);
        card.add(bg);

        // Icon
        const iconText = this.add.text(70, 25, achievement.icon, {
            fontSize: '32px',
        }).setOrigin(0.5);

        if (!isUnlocked) {
            iconText.setAlpha(0.3);
        }
        card.add(iconText);

        // Achievement name
        const name = this.add.text(70, 55, achievement.name, {
            fontSize: '11px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: isUnlocked ? '#ffffff' : '#777777',
            align: 'center',
            wordWrap: { width: 130 },
        }).setOrigin(0.5);
        card.add(name);

        // Description or progress
        let bottomText = '';
        if (isUnlocked) {
            bottomText = `+${achievement.reward} coins`;
        } else if (achievement.target) {
            bottomText = `${achievement.progress || 0}/${achievement.target}`;
        } else {
            bottomText = '???';
        }

        const desc = this.add.text(70, 78, bottomText, {
            fontSize: '10px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: isUnlocked ? '#ffd700' : '#666666',
            align: 'center',
        }).setOrigin(0.5);
        card.add(desc);

        // Unlock glow effect
        if (isUnlocked) {
            const glow = this.add.graphics();
            glow.fillStyle(0xffd700, 0.15);
            glow.fillRoundedRect(-5, -5, 150, 110, 8);
            card.addAt(glow, 0);

            // Subtle pulse animation
            this.tweens.add({
                targets: glow,
                alpha: 0.05,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
            });
        }

        // Make interactive for tooltip
        card.setSize(140, 100);
        card.setInteractive();

        card.on('pointerover', () => {
            this.showTooltip(achievement, x + 70, y + 110);
        });

        card.on('pointerout', () => {
            this.hideTooltip();
        });

        return card;
    }

    showTooltip(achievement, x, y) {
        if (this.tooltip) {
            this.tooltip.destroy();
        }

        this.tooltip = this.add.container(x, y);

        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.9);
        bg.fillRoundedRect(-80, 0, 160, 50, 5);
        this.tooltip.add(bg);

        const text = this.add.text(0, 25, achievement.description, {
            fontSize: '10px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 150 },
        }).setOrigin(0.5);
        this.tooltip.add(text);

        this.tooltip.setDepth(1000);
    }

    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.destroy();
            this.tooltip = null;
        }
    }

    createBackButton() {
        const button = this.add.graphics();
        button.fillStyle(CONFIG.COLORS.PRIMARY, 1);
        button.fillRoundedRect(CONFIG.WIDTH / 2 - 60, CONFIG.HEIGHT - 50, 120, 35, 8);

        const text = this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT - 32.5, '← Back', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        const container = this.add.container(0, 0);
        container.add([button, text]);
        container.setSize(120, 35);
        container.setInteractive({ useHandCursor: true });

        container.on('pointerdown', () => {
            soundManager.playClick();
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start(CONFIG.SCENES.HOME);
            });
        });
    }
}
