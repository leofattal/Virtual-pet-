// PixelPal - UI Manager

class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.elements = {};
    }

    // Create stat bars at top of screen
    createStatBars(x = 20, y = 20) {
        const stats = [
            { key: 'hunger', label: '🍎 Hunger', color: CONFIG.COLORS.HUNGER },
            { key: 'energy', label: '⚡ Energy', color: CONFIG.COLORS.ENERGY },
            { key: 'happiness', label: '💖 Happy', color: CONFIG.COLORS.HAPPINESS },
            { key: 'cleanliness', label: '✨ Clean', color: CONFIG.COLORS.CLEANLINESS },
        ];

        this.elements.statBars = {};

        stats.forEach((stat, index) => {
            const barY = y + index * 35;

            // Label
            const label = this.scene.add.text(x, barY, stat.label, {
                fontSize: CONFIG.FONT.SIZE_SMALL,
                fontFamily: CONFIG.FONT.FAMILY,
                color: '#ffffff',
            });
            label.setDepth(1000); // Ensure labels are on top

            // Background bar
            const bgBar = this.scene.add.graphics();
            bgBar.fillStyle(0x333333, 1);
            bgBar.fillRect(x + 85, barY, 120, 20);
            // Add border to make bars more visible
            bgBar.lineStyle(2, 0x666666, 1);
            bgBar.strokeRect(x + 85, barY, 120, 20);
            bgBar.setDepth(1000); // Ensure bars are on top

            // Fill bar
            const fillBar = this.scene.add.graphics();
            fillBar.setDepth(1001); // Fill bars on top of background bars

            // Store references
            this.elements.statBars[stat.key] = {
                label,
                bgBar,
                fillBar,
                color: stat.color,
                x: x + 85,
                y: barY,
            };

            // Initialize the fill bar immediately with current value
            const currentValue = petStats.getAll()[stat.key] || 0;
            const initialWidth = (currentValue / CONFIG.MAX_STAT) * 116;
            fillBar.fillStyle(stat.color, 1);
            fillBar.fillRect(x + 85 + 2, barY + 2, initialWidth, 16);
        });

        // Also update after a short delay to ensure everything is loaded
        this.scene.time.delayedCall(100, () => {
            this.updateStatBars();
        });
    }

    // Update stat bar fills
    updateStatBars() {
        // Safety check - ensure scene is still active
        if (!this.scene || !this.scene.sys || !this.scene.sys.isActive()) return;
        if (!this.elements.statBars) return;

        try {
            const stats = petStats.getAll();

            for (const key in this.elements.statBars) {
                const bar = this.elements.statBars[key];
                if (!bar || !bar.fillBar) continue;

                // Check if fillBar still exists in scene
                if (!bar.fillBar.scene || !bar.fillBar.active) {
                    console.warn('Stat bar fillBar not active for', key);
                    continue;
                }

                const value = stats[key] || 0;
                const fillWidth = (value / CONFIG.MAX_STAT) * 116;

                bar.fillBar.clear();
                bar.fillBar.fillStyle(bar.color, 1);
                bar.fillBar.fillRect(bar.x + 2, bar.y + 2, fillWidth, 16);
            }
        } catch (e) {
            console.error('Error updating stat bars:', e);
        }
    }

    // Create coin display
    createCoinDisplay(x = 650, y = 20) {
        const coinIcon = this.scene.add.graphics();
        coinIcon.fillStyle(CONFIG.COLORS.ACCENT, 1);
        coinIcon.fillCircle(x, y + 10, 12);
        coinIcon.fillStyle(0xffa000, 1);
        coinIcon.fillCircle(x, y + 10, 8);
        coinIcon.setDepth(1000);

        this.elements.coinText = this.scene.add.text(x + 20, y, `${inventory.coins}`, {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffca28',
        });
        this.elements.coinText.setDepth(1000);

        this.elements.coinIcon = coinIcon;
    }

    // Update coin display
    updateCoinDisplay() {
        // Safety check - ensure scene is still active and element exists
        if (!this.scene || !this.scene.sys || !this.scene.sys.isActive()) return;
        try {
            if (this.elements.coinText && this.elements.coinText.active) {
                this.elements.coinText.setText(`${inventory.coins}`);
            }
        } catch (e) {
            // Text element may have been destroyed
        }
    }

    // Create level display
    createLevelDisplay(x = 650, y = 55) {
        this.elements.levelText = this.scene.add.text(x, y, `Lv.${petStats.level}`, {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        });
        this.elements.levelText.setDepth(1000);

        // XP bar
        const bgBar = this.scene.add.graphics();
        bgBar.fillStyle(0x333333, 1);
        bgBar.fillRect(x, y + 25, 100, 10);
        bgBar.setDepth(1000);

        this.elements.xpBar = this.scene.add.graphics();
        this.elements.xpBar.setDepth(1001);
        this.elements.xpBarX = x;
        this.elements.xpBarY = y + 25;

        this.updateLevelDisplay();
    }

    // Update level display
    updateLevelDisplay() {
        // Safety check - ensure scene is still active
        if (!this.scene || !this.scene.sys || !this.scene.sys.isActive()) return;

        try {
            if (this.elements.levelText && this.elements.levelText.active) {
                this.elements.levelText.setText(`Lv.${petStats.level}`);
            }

            if (this.elements.xpBar && this.elements.xpBar.active) {
                const xpPercent = petStats.xp / petStats.xpToNextLevel;
                this.elements.xpBar.clear();
                this.elements.xpBar.fillStyle(0x9c27b0, 1);
                this.elements.xpBar.fillRect(
                    this.elements.xpBarX + 2,
                    this.elements.xpBarY + 2,
                    xpPercent * 96,
                    6
                );
            }
        } catch (e) {
            // Elements may have been destroyed
        }
    }

    // Create bottom action buttons (simplified - most actions are via room doors now)
    createActionButtons() {
        const buttons = [
            { key: 'clean', label: '🛁 Clean', x: 200 },
            { key: 'play', label: '⚽ Playground', x: 400 },
            { key: 'shop', label: '🛒 Shop', x: 600 },
        ];

        this.elements.actionButtons = {};
        const buttonY = CONFIG.HEIGHT - 60;

        buttons.forEach(btn => {
            const button = this.createButton(btn.x, buttonY, btn.label, () => {
                this.onActionButton(btn.key);
            });
            this.elements.actionButtons[btn.key] = button;
        });
    }

    // Create a pixel-style button
    createButton(x, y, label, callback, width = 100, height = 40) {
        const container = this.scene.add.container(x, y);

        // Button background
        const bg = this.scene.add.graphics();
        bg.fillStyle(CONFIG.COLORS.PRIMARY, 1);
        bg.fillRect(-width/2, -height/2, width, height);
        bg.fillStyle(CONFIG.COLORS.SECONDARY, 1);
        bg.fillRect(-width/2 + 4, -height/2 + 4, width - 8, height - 12);

        // Button text
        const text = this.scene.add.text(0, 0, label, {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        container.add([bg, text]);

        // Make interactive
        container.setSize(width, height);
        container.setInteractive({ useHandCursor: true });

        container.on('pointerover', () => {
            if (!bg || !bg.scene) return;
            bg.clear();
            bg.fillStyle(CONFIG.COLORS.SECONDARY, 1);
            bg.fillRect(-width/2, -height/2, width, height);
            bg.fillStyle(CONFIG.COLORS.PRIMARY, 1);
            bg.fillRect(-width/2 + 4, -height/2 + 4, width - 8, height - 12);
        });

        container.on('pointerout', () => {
            if (!bg || !bg.scene) return;
            bg.clear();
            bg.fillStyle(CONFIG.COLORS.PRIMARY, 1);
            bg.fillRect(-width/2, -height/2, width, height);
            bg.fillStyle(CONFIG.COLORS.SECONDARY, 1);
            bg.fillRect(-width/2 + 4, -height/2 + 4, width - 8, height - 12);
        });

        container.on('pointerdown', () => {
            soundManager.playClick();
            callback();
        });

        return container;
    }

    // Handle action button clicks
    onActionButton(action) {
        if (this.scene.handleAction) {
            this.scene.handleAction(action);
        }
    }

    // Create navigation buttons (for going back, etc)
    createNavButton(x, y, label, callback) {
        return this.createButton(x, y, label, callback, 120, 40);
    }

    // Create a modal/popup
    createModal(title, content, buttons = []) {
        const modal = this.scene.add.container(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2);

        // Darken background
        const overlay = this.scene.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(-CONFIG.WIDTH/2, -CONFIG.HEIGHT/2, CONFIG.WIDTH, CONFIG.HEIGHT);
        modal.add(overlay);

        // Modal box
        const box = this.scene.add.graphics();
        box.fillStyle(CONFIG.COLORS.BG_HOME, 1);
        box.fillRect(-200, -150, 400, 300);
        box.lineStyle(4, CONFIG.COLORS.PRIMARY);
        box.strokeRect(-200, -150, 400, 300);
        modal.add(box);

        // Title
        const titleText = this.scene.add.text(0, -120, title, {
            fontSize: CONFIG.FONT.SIZE_LARGE,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);
        modal.add(titleText);

        // Content
        if (typeof content === 'string') {
            const contentText = this.scene.add.text(0, -20, content, {
                fontSize: CONFIG.FONT.SIZE_MEDIUM,
                fontFamily: CONFIG.FONT.FAMILY,
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: 350 },
            }).setOrigin(0.5);
            modal.add(contentText);
        }

        // Buttons
        buttons.forEach((btn, index) => {
            const buttonX = (index - (buttons.length - 1) / 2) * 120;
            const button = this.createButton(buttonX, 100, btn.label, () => {
                modal.destroy();
                if (btn.callback) btn.callback();
            });
            modal.add(button);
        });

        modal.setDepth(1000);
        return modal;
    }

    // Show toast notification
    showToast(message, duration = 2000) {
        const toast = this.scene.add.container(CONFIG.WIDTH / 2, 100);

        const bg = this.scene.add.graphics();
        bg.fillStyle(0x333333, 0.9);
        bg.fillRect(-150, -20, 300, 40);
        toast.add(bg);

        const text = this.scene.add.text(0, 0, message, {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);
        toast.add(text);

        toast.setDepth(1001);
        toast.alpha = 0;

        this.scene.tweens.add({
            targets: toast,
            alpha: 1,
            y: 120,
            duration: 200,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.scene.time.delayedCall(duration, () => {
                    this.scene.tweens.add({
                        targets: toast,
                        alpha: 0,
                        y: 100,
                        duration: 200,
                        onComplete: () => toast.destroy(),
                    });
                });
            },
        });
    }

    // Create item grid for shop/inventory
    createItemGrid(items, x, y, columns = 4, onSelect) {
        const grid = this.scene.add.container(x, y);
        const cellSize = 80;
        const padding = 10;

        items.forEach((item, index) => {
            const col = index % columns;
            const row = Math.floor(index / columns);
            const cellX = col * (cellSize + padding);
            const cellY = row * (cellSize + padding);

            const cell = this.createItemCell(cellX, cellY, item, cellSize, () => {
                onSelect(item);
            });
            grid.add(cell);
        });

        return grid;
    }

    // Create single item cell
    createItemCell(x, y, item, size, onClick) {
        const cell = this.scene.add.container(x, y);

        // Background
        const bg = this.scene.add.graphics();
        bg.fillStyle(0x444444, 1);
        bg.fillRect(0, 0, size, size);
        bg.lineStyle(2, CONFIG.COLORS.PRIMARY);
        bg.strokeRect(0, 0, size, size);
        cell.add(bg);

        // Item icon (colored square)
        const icon = this.scene.add.graphics();
        icon.fillStyle(item.color, 1);
        icon.fillRect(size/2 - 20, 10, 40, 40);
        cell.add(icon);

        // Price or quantity
        const priceText = item.price !== undefined
            ? `${item.price}🪙`
            : item.quantity !== undefined
                ? `x${item.quantity}`
                : '';

        if (priceText) {
            const price = this.scene.add.text(size/2, size - 15, priceText, {
                fontSize: CONFIG.FONT.SIZE_SMALL,
                fontFamily: CONFIG.FONT.FAMILY,
                color: '#ffca28',
            }).setOrigin(0.5);
            cell.add(price);
        }

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
            soundManager.playClick();
            onClick();
        });

        return cell;
    }

    // Update all UI elements
    update() {
        // Safety check - ensure scene is still active before updating
        if (!this.scene || !this.scene.sys || !this.scene.sys.isActive()) return;

        try {
            this.updateStatBars();
            this.updateCoinDisplay();
            this.updateLevelDisplay();
        } catch (e) {
            // Scene may have been destroyed during update
        }
    }

    // Destroy all UI elements
    destroy() {
        for (const key in this.elements) {
            const element = this.elements[key];
            if (element && element.destroy) {
                element.destroy();
            } else if (typeof element === 'object') {
                for (const subKey in element) {
                    if (element[subKey] && element[subKey].destroy) {
                        element[subKey].destroy();
                    }
                }
            }
        }
        this.elements = {};
    }
}
