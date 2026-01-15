// PixelPal - Garden/Farm Scene

class GardenScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Garden' });
    }

    create() {
        console.log('GardenScene: create() called');

        try {
            // Create background
            this.createBackground();
            console.log('GardenScene: background created');

            // Title
            this.add.text(CONFIG.WIDTH / 2, 30, '🌱 Garden', {
                fontSize: CONFIG.FONT.SIZE_LARGE,
                fontFamily: CONFIG.FONT.FAMILY,
                color: '#ffffff',
            }).setOrigin(0.5);

            // Instructions
            this.add.text(CONFIG.WIDTH / 2, 60, 'Plant seeds and grow food for your pet!', {
                fontSize: CONFIG.FONT.SIZE_SMALL,
                fontFamily: CONFIG.FONT.FAMILY,
                color: '#cccccc',
            }).setOrigin(0.5);

            // Create garden plots
            this.createGardenPlots();
            console.log('GardenScene: garden plots created');

            // Create seed shop button
            this.createSeedShopButton();
            console.log('GardenScene: seed shop button created');

            // Back button
            this.createBackButton();
            console.log('GardenScene: back button created');

            // Update timer for plant growth
            this.time.addEvent({
                delay: 10000, // Check every 10 seconds
                callback: () => this.updatePlants(),
                loop: true,
            });

            // Fade in
            this.cameras.main.fadeIn(300, 0, 0, 0);

            console.log('GardenScene: fully loaded');
        } catch (error) {
            console.error('GardenScene: Error in create():', error);
            // Show error on screen
            this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2,
                'Error loading Garden scene\nCheck console for details', {
                fontSize: '18px',
                fontFamily: CONFIG.FONT.FAMILY,
                color: '#ff0000',
                align: 'center',
            }).setOrigin(0.5);
        }
    }

    createBackground() {
        const bg = this.add.graphics();

        // Sky
        bg.fillStyle(0x87ceeb, 1);
        bg.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT / 2);

        // Ground
        bg.fillStyle(0x8d6e63, 1);
        bg.fillRect(0, CONFIG.HEIGHT / 2, CONFIG.WIDTH, CONFIG.HEIGHT / 2);

        // Grass
        bg.fillStyle(0x66bb6a, 1);
        bg.fillRect(0, CONFIG.HEIGHT / 2, CONFIG.WIDTH, 30);

        // Sun
        bg.fillStyle(0xffeb3b, 1);
        bg.fillCircle(680, 100, 40);
        bg.fillStyle(0xffd54f, 0.5);
        bg.fillCircle(680, 100, 50);

        // Clouds
        bg.fillStyle(0xffffff, 0.8);
        bg.fillCircle(150, 120, 25);
        bg.fillCircle(170, 115, 30);
        bg.fillCircle(190, 120, 25);

        bg.fillCircle(450, 100, 25);
        bg.fillCircle(470, 95, 30);
        bg.fillCircle(490, 100, 25);

        // Fence
        bg.lineStyle(4, 0x8d6e63);
        for (let x = 0; x < CONFIG.WIDTH; x += 40) {
            bg.lineBetween(x, CONFIG.HEIGHT / 2 + 25, x, CONFIG.HEIGHT / 2 + 60);
        }
        bg.lineBetween(0, CONFIG.HEIGHT / 2 + 35, CONFIG.WIDTH, CONFIG.HEIGHT / 2 + 35);
        bg.lineBetween(0, CONFIG.HEIGHT / 2 + 50, CONFIG.WIDTH, CONFIG.HEIGHT / 2 + 50);
    }

    createGardenPlots() {
        // Initialize garden system
        if (!this.registry.has('gardenPlots')) {
            const plots = [];
            for (let i = 0; i < 6; i++) {
                plots.push({
                    id: i,
                    plant: null,
                    plantedAt: null,
                    growthStage: 0,
                });
            }
            this.registry.set('gardenPlots', plots);
        }

        const plots = this.registry.get('gardenPlots');

        // Create visual plots (2 rows of 3)
        const startX = 150;
        const startY = 280;
        const spacing = 150;

        this.plotContainers = [];

        plots.forEach((plot, index) => {
            const col = index % 3;
            const row = Math.floor(index / 3);
            const x = startX + col * spacing;
            const y = startY + row * 130;

            const container = this.createPlot(x, y, plot);
            this.plotContainers.push(container);
        });
    }

    createPlot(x, y, plotData) {
        const container = this.add.container(x, y);

        // Plot soil
        const soil = this.add.graphics();
        soil.fillStyle(0x6d4c41, 1);
        soil.fillRect(-50, -20, 100, 40);
        soil.lineStyle(2, 0x5d3c31);
        soil.strokeRect(-50, -20, 100, 40);
        container.add(soil);

        // Plant display
        const plantDisplay = this.add.container(0, -40);
        container.add(plantDisplay);

        // Make interactive
        container.setSize(100, 60);
        container.setInteractive({ useHandCursor: true });

        container.setData('plotData', plotData);
        container.setData('plantDisplay', plantDisplay);

        container.on('pointerdown', () => {
            this.interactWithPlot(plotData, container);
        });

        // Draw current state
        this.updatePlotVisual(container, plotData);

        return container;
    }

    updatePlotVisual(container, plotData) {
        const plantDisplay = container.getData('plantDisplay');
        plantDisplay.removeAll(true);

        if (!plotData.plant) {
            // Empty plot - show + sign
            const plusSign = this.add.text(0, 0, '+', {
                fontSize: '30px',
                fontFamily: CONFIG.FONT.FAMILY,
                color: '#888888',
            }).setOrigin(0.5);
            plantDisplay.add(plusSign);
        } else {
            // Show plant based on growth stage
            const plant = this.drawPlant(plotData.plant, plotData.growthStage);
            plantDisplay.add(plant);

            // Show harvest icon if ready
            if (plotData.growthStage >= 3) {
                const harvestIcon = this.add.text(0, -40, '✨', {
                    fontSize: '20px',
                }).setOrigin(0.5);
                plantDisplay.add(harvestIcon);

                this.tweens.add({
                    targets: harvestIcon,
                    y: -45,
                    duration: 500,
                    yoyo: true,
                    repeat: -1,
                });
            }
        }
    }

    drawPlant(plantType, stage) {
        const graphics = this.add.graphics();

        switch (stage) {
            case 0:
                // Seed (just planted)
                graphics.fillStyle(0x8d6e63, 1);
                graphics.fillCircle(0, 15, 4);
                break;

            case 1:
                // Sprout
                graphics.fillStyle(0x66bb6a, 1);
                graphics.fillRect(-2, 5, 4, 15);
                graphics.fillCircle(0, 0, 6);
                break;

            case 2:
                // Growing
                graphics.fillStyle(0x4caf50, 1);
                graphics.fillRect(-3, -10, 6, 30);
                graphics.fillCircle(-8, -5, 8);
                graphics.fillCircle(8, -5, 8);
                graphics.fillCircle(0, -12, 8);
                break;

            case 3:
                // Fully grown - show fruit/vegetable
                graphics.fillStyle(0x4caf50, 1);
                graphics.fillRect(-4, -15, 8, 35);
                graphics.fillCircle(-10, -8, 10);
                graphics.fillCircle(10, -8, 10);
                graphics.fillCircle(0, -18, 10);

                // Fruit (apple-like)
                graphics.fillStyle(0xe53935, 1);
                graphics.fillCircle(-12, -12, 8);
                graphics.fillCircle(12, -10, 8);
                graphics.fillCircle(0, -20, 8);
                break;
        }

        return graphics;
    }

    interactWithPlot(plotData, container) {
        if (!plotData.plant) {
            // Plant seeds
            this.showSeedSelection(plotData, container);
        } else if (plotData.growthStage >= 3) {
            // Harvest
            this.harvestPlant(plotData, container);
        } else {
            // Show growth info
            this.showGrowthInfo(plotData);
        }
    }

    showSeedSelection(plotData, container) {
        // For simplicity, plant apple seeds
        // In a full implementation, you'd show a seed selection menu
        plotData.plant = 'apple';
        plotData.plantedAt = Date.now();
        plotData.growthStage = 0;

        this.updatePlotVisual(container, plotData);
        this.showMessage('Planted apple seeds! 🌱');

        soundManager.playClick();
    }

    harvestPlant(plotData, container) {
        // Add food item to inventory
        inventory.addItem(plotData.plant, 1);

        // Record harvest for achievement
        achievementSystem.recordHarvest();

        // Clear plot
        plotData.plant = null;
        plotData.plantedAt = null;
        plotData.growthStage = 0;

        this.updatePlotVisual(container, plotData);
        this.showMessage('Harvested! +1 🍎');

        soundManager.playLevelUp();

        // Show harvest particles
        for (let i = 0; i < 5; i++) {
            const particle = this.add.text(
                container.x + (Math.random() - 0.5) * 50,
                container.y - 50,
                '✨',
                { fontSize: '20px' }
            );

            this.tweens.add({
                targets: particle,
                y: particle.y - 40,
                alpha: 0,
                duration: 800,
                onComplete: () => particle.destroy(),
            });
        }
    }

    updatePlants() {
        const plots = this.registry.get('gardenPlots');
        let updated = false;

        plots.forEach((plot, index) => {
            if (plot.plant && plot.growthStage < 3) {
                const timeElapsed = Date.now() - plot.plantedAt;
                const minutesElapsed = timeElapsed / (1000 * 60);

                // Growth stages: 0=seed, 1=sprout(2min), 2=growing(4min), 3=ready(6min)
                if (minutesElapsed >= 6 && plot.growthStage < 3) {
                    plot.growthStage = 3;
                    updated = true;
                } else if (minutesElapsed >= 4 && plot.growthStage < 2) {
                    plot.growthStage = 2;
                    updated = true;
                } else if (minutesElapsed >= 2 && plot.growthStage < 1) {
                    plot.growthStage = 1;
                    updated = true;
                }

                if (updated && this.plotContainers[index]) {
                    this.updatePlotVisual(this.plotContainers[index], plot);
                }
            }
        });
    }

    showGrowthInfo(plotData) {
        const timeElapsed = Date.now() - plotData.plantedAt;
        const minutesElapsed = Math.floor(timeElapsed / (1000 * 60));

        let message = '';
        switch (plotData.growthStage) {
            case 0:
                message = `Seed planted ${minutesElapsed}m ago. Sprouting in ${2 - minutesElapsed}m`;
                break;
            case 1:
                message = `Sprouted! Growing in ${4 - minutesElapsed}m`;
                break;
            case 2:
                message = `Almost ready! ${6 - minutesElapsed}m until harvest`;
                break;
        }

        this.showMessage(message);
    }

    showMessage(text) {
        if (this.messageText) {
            this.messageText.destroy();
        }

        this.messageText = this.add.text(CONFIG.WIDTH / 2, 100, text, {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            backgroundColor: '#00000080',
            padding: { x: 10, y: 5 },
        }).setOrigin(0.5);

        this.tweens.add({
            targets: this.messageText,
            alpha: 0,
            duration: 2000,
            delay: 1000,
            onComplete: () => {
                if (this.messageText) this.messageText.destroy();
            },
        });
    }

    createSeedShopButton() {
        const buttonX = 20;
        const buttonY = CONFIG.HEIGHT - 50;
        const buttonWidth = 120;
        const buttonHeight = 35;

        const button = this.add.graphics();
        button.fillStyle(0x66bb6a, 1);
        button.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
        button.lineStyle(2, 0x4caf50, 1);
        button.strokeRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);

        const text = this.add.text(buttonX + buttonWidth / 2, buttonY + buttonHeight / 2, '🌾 Seeds', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        // Create proper interactive zone
        const hitArea = new Phaser.Geom.Rectangle(buttonX, buttonY, buttonWidth, buttonHeight);
        button.setInteractive({ hitArea: hitArea, hitAreaCallback: Phaser.Geom.Rectangle.Contains, useHandCursor: true });

        button.on('pointerover', () => {
            button.clear();
            button.fillStyle(0x81c784, 1);
            button.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
            button.lineStyle(2, 0x66bb6a, 1);
            button.strokeRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
        });

        button.on('pointerout', () => {
            button.clear();
            button.fillStyle(0x66bb6a, 1);
            button.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
            button.lineStyle(2, 0x4caf50, 1);
            button.strokeRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
        });

        button.on('pointerdown', () => {
            soundManager.playClick();
            this.showMessage('Seeds are free! Just click empty plots to plant.');
        });
    }

    createBackButton() {
        const buttonX = CONFIG.WIDTH - 140;
        const buttonY = CONFIG.HEIGHT - 50;
        const buttonWidth = 120;
        const buttonHeight = 35;

        const button = this.add.graphics();
        button.fillStyle(CONFIG.COLORS.PRIMARY, 1);
        button.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
        button.lineStyle(2, CONFIG.COLORS.SECONDARY, 1);
        button.strokeRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);

        const text = this.add.text(buttonX + buttonWidth / 2, buttonY + buttonHeight / 2, '← Home', {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        // Create proper interactive zone
        const hitArea = new Phaser.Geom.Rectangle(buttonX, buttonY, buttonWidth, buttonHeight);
        button.setInteractive({ hitArea: hitArea, hitAreaCallback: Phaser.Geom.Rectangle.Contains, useHandCursor: true });

        button.on('pointerover', () => {
            button.clear();
            button.fillStyle(CONFIG.COLORS.SECONDARY, 1);
            button.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
            button.lineStyle(2, CONFIG.COLORS.PRIMARY, 1);
            button.strokeRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
        });

        button.on('pointerout', () => {
            button.clear();
            button.fillStyle(CONFIG.COLORS.PRIMARY, 1);
            button.fillRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
            button.lineStyle(2, CONFIG.COLORS.SECONDARY, 1);
            button.strokeRoundedRect(buttonX, buttonY, buttonWidth, buttonHeight, 8);
        });

        button.on('pointerdown', () => {
            soundManager.playClick();
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start(CONFIG.SCENES.HOME);
            });
        });
    }
}
