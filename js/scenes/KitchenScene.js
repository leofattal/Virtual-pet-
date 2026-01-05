// PixelPal - Kitchen Scene (Dining Room)

class KitchenScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENES.KITCHEN });
    }

    create() {
        // Resume audio context on first interaction
        this.input.once('pointerdown', () => {
            soundManager.resume();
        });

        // Create background
        this.createBackground();

        // Create dining table with food
        this.createDiningTable();

        // Create pet
        this.pet = new Pet(this, CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 + 20);

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
                this.refreshFoodTray();
            } catch (e) {
                // Scene may have been destroyed
            }
        };
        petStats.addListener(this.statListener);
        inventory.addListener(this.statListener);

        // Drag states
        this.isDraggingFood = false;

        // Create instruction hint
        this.createDragHints();

        // Scene transition fade in
        this.cameras.main.fadeIn(300, 0, 0, 0);

        // Listen for shutdown event to clean up listeners
        this.events.on('shutdown', this.shutdown, this);
    }

    createBackground() {
        const bg = this.add.graphics();

        // Kitchen wall - warm color
        bg.fillStyle(0x5d4e37, 1);
        bg.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Wallpaper pattern (subtle stripes)
        bg.fillStyle(0x6b5b45, 0.3);
        for (let x = 0; x < CONFIG.WIDTH; x += 40) {
            bg.fillRect(x, 0, 20, CONFIG.HEIGHT - 150);
        }

        // Tile floor
        bg.fillStyle(0xd7ccc8, 1);
        bg.fillRect(0, CONFIG.HEIGHT - 150, CONFIG.WIDTH, 150);

        // Tile pattern (checkerboard)
        bg.fillStyle(0xbcaaa4, 1);
        const tileSize = 50;
        for (let y = CONFIG.HEIGHT - 150; y < CONFIG.HEIGHT; y += tileSize) {
            for (let x = 0; x < CONFIG.WIDTH; x += tileSize) {
                if (((x / tileSize) + (y / tileSize)) % 2 === 0) {
                    bg.fillRect(x, y, tileSize, tileSize);
                }
            }
        }

        // Tile grout lines
        bg.lineStyle(1, 0x8d6e63, 0.5);
        for (let x = 0; x <= CONFIG.WIDTH; x += tileSize) {
            bg.lineBetween(x, CONFIG.HEIGHT - 150, x, CONFIG.HEIGHT);
        }
        for (let y = CONFIG.HEIGHT - 150; y <= CONFIG.HEIGHT; y += tileSize) {
            bg.lineBetween(0, y, CONFIG.WIDTH, y);
        }

        // Kitchen counter on the left
        this.createKitchenCounter(bg);

        // Window on the right
        this.createWindow(bg);

        // Hanging lamp
        this.createHangingLamp();

        // Decorative clock
        this.createClock();
    }

    createKitchenCounter(bg) {
        const counterX = 30;
        const counterY = CONFIG.HEIGHT - 270;
        const counterWidth = 180;
        const counterHeight = 120;

        // Counter base
        bg.fillStyle(0x5d4037, 1);
        bg.fillRect(counterX, counterY, counterWidth, counterHeight);

        // Counter top
        bg.fillStyle(0x8d6e63, 1);
        bg.fillRect(counterX - 5, counterY - 10, counterWidth + 10, 15);

        // Counter doors
        bg.fillStyle(0x6d4c41, 1);
        bg.fillRect(counterX + 10, counterY + 20, 70, 90);
        bg.fillRect(counterX + 95, counterY + 20, 70, 90);

        // Door handles
        bg.fillStyle(0xffc107, 1);
        bg.fillCircle(counterX + 70, counterY + 65, 5);
        bg.fillCircle(counterX + 105, counterY + 65, 5);

        // Items on counter
        // Toaster
        bg.fillStyle(0x9e9e9e, 1);
        bg.fillRect(counterX + 20, counterY - 35, 40, 25);
        bg.fillStyle(0x757575, 1);
        bg.fillRect(counterX + 25, counterY - 32, 12, 10);
        bg.fillRect(counterX + 43, counterY - 32, 12, 10);

        // Fruit bowl
        bg.fillStyle(0x8d6e63, 1);
        bg.fillEllipse(counterX + 130, counterY - 15, 50, 20);
        bg.fillStyle(0xe53935, 1);
        bg.fillCircle(counterX + 120, counterY - 25, 10);
        bg.fillCircle(counterX + 140, counterY - 28, 10);
        bg.fillStyle(0xffeb3b, 1);
        bg.fillCircle(counterX + 130, counterY - 22, 8);
    }

    createWindow(bg) {
        const windowX = CONFIG.WIDTH - 200;
        const windowY = 60;

        // Window frame
        bg.fillStyle(0x87ceeb, 1);
        bg.fillRect(windowX, windowY, 150, 140);

        // Window panes
        bg.lineStyle(8, 0x8d6e63);
        bg.strokeRect(windowX, windowY, 150, 140);
        bg.lineStyle(4, 0x8d6e63);
        bg.lineBetween(windowX + 75, windowY, windowX + 75, windowY + 140);
        bg.lineBetween(windowX, windowY + 70, windowX + 150, windowY + 70);

        // Curtains
        bg.fillStyle(0xef9a9a, 1);
        bg.fillRect(windowX - 15, windowY - 10, 25, 160);
        bg.fillRect(windowX + 140, windowY - 10, 25, 160);

        // Curtain rod
        bg.fillStyle(0x5d4037, 1);
        bg.fillRect(windowX - 20, windowY - 15, 190, 8);

        // Sun through window
        bg.fillStyle(0xffeb3b, 0.6);
        bg.fillCircle(windowX + 40, windowY + 40, 20);
    }

    createHangingLamp() {
        const lampX = CONFIG.WIDTH / 2;
        const lampY = 30;

        const lamp = this.add.graphics();

        // Cord
        lamp.lineStyle(3, 0x424242);
        lamp.lineBetween(lampX, 0, lampX, lampY + 20);

        // Lamp shade
        lamp.fillStyle(0xffeb3b, 0.9);
        lamp.beginPath();
        lamp.moveTo(lampX - 40, lampY + 20);
        lamp.lineTo(lampX + 40, lampY + 20);
        lamp.lineTo(lampX + 25, lampY + 50);
        lamp.lineTo(lampX - 25, lampY + 50);
        lamp.closePath();
        lamp.fill();

        // Lamp glow
        lamp.fillStyle(0xfff59d, 0.3);
        lamp.fillCircle(lampX, lampY + 80, 60);
    }

    createClock() {
        const clockX = 280;
        const clockY = 100;

        const clock = this.add.graphics();

        // Clock body
        clock.fillStyle(0x8d6e63, 1);
        clock.fillCircle(clockX, clockY, 35);
        clock.fillStyle(0xfafafa, 1);
        clock.fillCircle(clockX, clockY, 28);

        // Clock hands
        clock.lineStyle(3, 0x424242);
        clock.lineBetween(clockX, clockY, clockX, clockY - 18); // Hour hand
        clock.lineStyle(2, 0x424242);
        clock.lineBetween(clockX, clockY, clockX + 12, clockY + 8); // Minute hand

        // Clock center
        clock.fillStyle(0x424242, 1);
        clock.fillCircle(clockX, clockY, 3);
    }

    createDiningTable() {
        // Dining table in the center of the room
        const tableX = CONFIG.WIDTH / 2;
        const tableY = CONFIG.HEIGHT - 100;

        this.foodTrayContainer = this.add.container(tableX, tableY);
        this.foodItems = [];

        // Draw wooden dining table
        const table = this.add.graphics();

        // Table shadow
        table.fillStyle(0x000000, 0.2);
        table.fillEllipse(0, 70, 280, 40);

        // Table legs
        table.fillStyle(0x5d4037, 1);
        table.fillRect(-110, 20, 12, 55);
        table.fillRect(98, 20, 12, 55);

        // Table top (thick wooden table)
        table.fillStyle(0x6d4c41, 1);
        table.fillRect(-130, -5, 260, 30);

        // Table top surface
        table.fillStyle(0x8d6e63, 1);
        table.fillRect(-125, -10, 250, 12);

        // Wood grain pattern
        table.lineStyle(1, 0x5d4037, 0.3);
        for (let i = 0; i < 5; i++) {
            table.lineBetween(-120 + i * 50, -8, -120 + i * 50 + 40, -8);
        }

        // Table edge highlight
        table.fillStyle(0xa1887f, 1);
        table.fillRect(-125, -10, 250, 3);

        this.foodTrayContainer.add(table);

        // Draw tablecloth (runner in the middle)
        const cloth = this.add.graphics();
        cloth.fillStyle(0xe57373, 1);
        cloth.fillRect(-100, -15, 200, 20);
        // Checkered pattern
        cloth.fillStyle(0xef9a9a, 1);
        for (let i = 0; i < 10; i++) {
            if (i % 2 === 0) {
                cloth.fillRect(-100 + i * 20, -15, 20, 10);
            } else {
                cloth.fillRect(-100 + i * 20, -5, 20, 10);
            }
        }
        this.foodTrayContainer.add(cloth);

        // Draw plates on the table (up to 4)
        this.platePositions = [
            { x: -80, y: -25 },
            { x: -25, y: -28 },
            { x: 30, y: -28 },
            { x: 85, y: -25 },
        ];

        this.plates = [];
        this.platePositions.forEach((pos, index) => {
            const plate = this.add.graphics();
            // Plate shadow
            plate.fillStyle(0x000000, 0.15);
            plate.fillEllipse(pos.x + 2, pos.y + 4, 40, 14);
            // Plate
            plate.fillStyle(0xfafafa, 1);
            plate.fillEllipse(pos.x, pos.y, 38, 12);
            plate.fillStyle(0xeeeeee, 1);
            plate.fillEllipse(pos.x, pos.y - 2, 30, 9);
            // Plate rim
            plate.lineStyle(1, 0xbdbdbd);
            plate.strokeEllipse(pos.x, pos.y, 38, 12);
            // Decorative rim pattern
            plate.lineStyle(1, 0x90caf9, 0.5);
            plate.strokeEllipse(pos.x, pos.y, 34, 10);
            this.foodTrayContainer.add(plate);
            this.plates.push(plate);
        });

        // Label
        const label = this.add.text(0, 85, '🍽️ Dining Table', {
            fontSize: '12px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#8d6e63',
            backgroundColor: '#00000060',
            padding: { x: 6, y: 2 },
        }).setOrigin(0.5);
        this.foodTrayContainer.add(label);

        // Store table position for food items
        this.tableX = tableX;
        this.tableY = tableY;

        // Populate with owned food
        this.refreshFoodTray();
    }

    refreshFoodTray() {
        // Safety check - ensure scene is still active
        if (!this.sys || !this.sys.isActive()) return;

        // Clear existing food items
        this.foodItems.forEach(item => {
            if (item && item.container) {
                item.container.destroy();
            }
        });
        this.foodItems = [];

        const ownedFood = inventory.getOwnedFood();

        // Show up to 4 food items on plates
        const displayFood = ownedFood.slice(0, 4);

        displayFood.forEach((food, index) => {
            if (this.platePositions && this.platePositions[index]) {
                const platePos = this.platePositions[index];
                const foodX = this.tableX + platePos.x;
                const foodY = this.tableY + platePos.y - 12;
                const foodItem = this.createDraggableFood(foodX, foodY, food);
                this.foodItems.push({
                    container: foodItem,
                    food: food,
                    homeX: foodX,
                    homeY: foodY,
                    plateIndex: index,
                });
            }
        });
    }

    createDraggableFood(x, y, food) {
        const container = this.add.container(x, y);

        // Draw the food icon with detail
        const icon = this.add.graphics();

        switch (food.id) {
            case 'apple':
                icon.fillStyle(0xe53935, 1);
                icon.fillCircle(0, 2, 12);
                icon.fillStyle(0xef5350, 1);
                icon.fillCircle(-4, -2, 5);
                icon.fillStyle(0x5d4037, 1);
                icon.fillRect(-1, -14, 3, 6);
                icon.fillStyle(0x4caf50, 1);
                icon.fillEllipse(5, -12, 6, 4);
                break;

            case 'pizza':
                icon.fillStyle(0xffb74d, 1);
                icon.beginPath();
                icon.moveTo(0, -12);
                icon.lineTo(-10, 10);
                icon.lineTo(10, 10);
                icon.closePath();
                icon.fill();
                icon.fillStyle(0xffee58, 1);
                icon.beginPath();
                icon.moveTo(0, -8);
                icon.lineTo(-7, 7);
                icon.lineTo(7, 7);
                icon.closePath();
                icon.fill();
                icon.fillStyle(0xc62828, 1);
                icon.fillCircle(-2, 0, 3);
                icon.fillCircle(3, 4, 3);
                break;

            case 'candy':
                icon.fillStyle(0xf06292, 1);
                icon.fillCircle(0, 0, 10);
                icon.fillStyle(0xf48fb1, 1);
                icon.beginPath();
                icon.moveTo(-10, 0);
                icon.lineTo(-16, -6);
                icon.lineTo(-16, 6);
                icon.closePath();
                icon.fill();
                icon.beginPath();
                icon.moveTo(10, 0);
                icon.lineTo(16, -6);
                icon.lineTo(16, 6);
                icon.closePath();
                icon.fill();
                icon.fillStyle(0xffffff, 0.5);
                icon.fillRect(-8, -2, 16, 4);
                break;

            case 'soup':
                icon.fillStyle(0x8d6e63, 1);
                icon.fillEllipse(0, 4, 22, 12);
                icon.fillStyle(0xa1887f, 1);
                icon.fillEllipse(0, 0, 20, 10);
                icon.fillStyle(0xffcc80, 1);
                icon.fillEllipse(0, -2, 16, 6);
                icon.fillStyle(0xffffff, 0.6);
                icon.fillCircle(-4, -12, 3);
                icon.fillCircle(2, -14, 3);
                icon.fillCircle(6, -10, 2);
                break;

            case 'carrot':
                icon.fillStyle(0xff7043, 1);
                icon.beginPath();
                icon.moveTo(-6, -8);
                icon.lineTo(6, -8);
                icon.lineTo(2, 12);
                icon.lineTo(-2, 12);
                icon.closePath();
                icon.fill();
                icon.lineStyle(1, 0xe64a19);
                icon.lineBetween(-3, -4, 3, -4);
                icon.lineBetween(-2, 0, 2, 0);
                icon.lineBetween(-1, 4, 1, 4);
                icon.fillStyle(0x4caf50, 1);
                icon.fillRect(-4, -14, 3, 8);
                icon.fillRect(-1, -16, 3, 10);
                icon.fillRect(2, -14, 3, 8);
                break;

            case 'cake':
                icon.fillStyle(0xce93d8, 1);
                icon.fillRect(-10, -4, 20, 14);
                icon.fillStyle(0xf8bbd9, 1);
                icon.fillRect(-10, -8, 20, 6);
                icon.fillStyle(0xf8bbd9, 1);
                icon.fillRect(-8, -2, 4, 4);
                icon.fillRect(4, -2, 4, 6);
                icon.fillStyle(0xe53935, 1);
                icon.fillCircle(0, -12, 4);
                icon.fillStyle(0x4caf50, 1);
                icon.fillRect(-1, -16, 2, 4);
                break;

            case 'cookie':
                // Chocolate chip cookie
                icon.fillStyle(0xd4a373, 1);
                icon.fillCircle(0, 0, 12);
                icon.fillStyle(0xc49a6c, 1);
                icon.fillCircle(0, 0, 10);
                // Chocolate chips
                icon.fillStyle(0x5d4037, 1);
                icon.fillCircle(-4, -3, 2);
                icon.fillCircle(3, -1, 2);
                icon.fillCircle(-2, 4, 2);
                icon.fillCircle(5, 4, 2);
                break;

            case 'sandwich':
                // Layered sandwich
                icon.fillStyle(0xf5deb3, 1);
                icon.fillRect(-12, -10, 24, 6); // Top bread
                icon.fillStyle(0x8bc34a, 1);
                icon.fillRect(-10, -5, 20, 3); // Lettuce
                icon.fillStyle(0xef5350, 1);
                icon.fillRect(-10, -3, 20, 3); // Tomato
                icon.fillStyle(0xffeb3b, 1);
                icon.fillRect(-10, -1, 20, 3); // Cheese
                icon.fillStyle(0x8d6e63, 1);
                icon.fillRect(-10, 1, 20, 4); // Meat
                icon.fillStyle(0xf5deb3, 1);
                icon.fillRect(-12, 4, 24, 6); // Bottom bread
                break;

            case 'icecream':
                // Ice cream cone
                icon.fillStyle(0xd2691e, 1);
                icon.beginPath();
                icon.moveTo(-8, 0);
                icon.lineTo(8, 0);
                icon.lineTo(0, 14);
                icon.closePath();
                icon.fill();
                // Cone pattern
                icon.lineStyle(1, 0xa0522d);
                icon.lineBetween(-6, 2, 2, 10);
                icon.lineBetween(6, 2, -2, 10);
                // Ice cream scoops
                icon.fillStyle(0xfff8dc, 1);
                icon.fillCircle(0, -4, 10);
                icon.fillStyle(0xffe4c4, 1);
                icon.fillCircle(-3, -6, 4);
                break;

            case 'sushi':
                // Sushi roll
                icon.fillStyle(0x1a1a2e, 1); // Nori (seaweed)
                icon.fillCircle(0, 0, 12);
                icon.fillStyle(0xffffff, 1); // Rice
                icon.fillCircle(0, 0, 10);
                icon.fillStyle(0xff6b6b, 1); // Salmon
                icon.fillCircle(0, 0, 6);
                icon.fillStyle(0xff8a80, 1);
                icon.fillCircle(-2, -2, 3);
                break;

            case 'hotdog':
                // Hot dog in bun
                icon.fillStyle(0xf5deb3, 1);
                icon.fillEllipse(0, 2, 24, 10); // Bun
                icon.fillStyle(0xdeb887, 1);
                icon.fillRect(-10, 0, 20, 4); // Bun split
                icon.fillStyle(0xcd5c5c, 1);
                icon.fillRect(-9, -2, 18, 6); // Sausage
                icon.fillStyle(0xffeb3b, 1);
                // Mustard zigzag
                icon.lineStyle(2, 0xffeb3b);
                icon.lineBetween(-7, 0, -4, 2);
                icon.lineBetween(-4, 2, -1, 0);
                icon.lineBetween(-1, 0, 2, 2);
                icon.lineBetween(2, 2, 5, 0);
                icon.lineBetween(5, 0, 7, 2);
                break;

            case 'salad':
                // Fresh salad bowl
                icon.fillStyle(0x8d6e63, 1);
                icon.fillEllipse(0, 4, 24, 10); // Bowl
                icon.fillStyle(0x90ee90, 1);
                icon.fillEllipse(0, -2, 20, 12); // Lettuce
                icon.fillStyle(0x32cd32, 1);
                icon.fillCircle(-5, -4, 4);
                icon.fillCircle(4, -2, 4);
                // Tomato slice
                icon.fillStyle(0xff6347, 1);
                icon.fillCircle(0, 2, 4);
                break;

            case 'donut':
                // Sprinkled donut
                icon.fillStyle(0xff69b4, 1);
                icon.fillCircle(0, 0, 12); // Icing
                icon.fillStyle(0xd4a373, 1);
                icon.fillCircle(0, 3, 12); // Dough showing at bottom
                icon.fillStyle(0xff69b4, 1);
                icon.fillCircle(0, -1, 11); // Icing top
                // Hole
                icon.fillStyle(0xd7ccc8, 1);
                icon.fillCircle(0, 0, 4);
                // Sprinkles
                icon.fillStyle(0xffeb3b, 1);
                icon.fillRect(-6, -5, 3, 2);
                icon.fillStyle(0x42a5f5, 1);
                icon.fillRect(4, -3, 3, 2);
                icon.fillStyle(0x66bb6a, 1);
                icon.fillRect(-3, 4, 3, 2);
                icon.fillStyle(0xef5350, 1);
                icon.fillRect(2, -6, 3, 2);
                break;

            default:
                icon.fillStyle(food.color, 1);
                icon.fillCircle(0, 0, 12);
                break;
        }

        container.add(icon);

        // Quantity badge
        const qty = this.add.text(8, 8, `${food.quantity}`, {
            fontSize: '10px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            backgroundColor: '#e53935',
            padding: { x: 2, y: 0 },
        }).setOrigin(0.5);
        container.add(qty);

        // Make draggable
        container.setSize(30, 30);
        container.setInteractive({ useHandCursor: true, draggable: true });
        container.foodData = food;

        this.input.setDraggable(container);

        container.on('dragstart', () => {
            this.isDraggingFood = true;
            soundManager.playClick();
            container.setScale(1.3);
            container.setDepth(1000);
            this.showPetMouthZone(true);
        });

        container.on('drag', (pointer, dragX, dragY) => {
            container.x = dragX;
            container.y = dragY;
        });

        container.on('dragend', () => {
            this.isDraggingFood = false;
            container.setScale(1);
            container.setDepth(0);
            this.showPetMouthZone(false);

            // Check if dropped on pet's mouth
            const dist = Phaser.Math.Distance.Between(
                container.x, container.y,
                this.pet.container.x, this.pet.container.y - 10
            );

            if (dist < 50) {
                this.feedPetWithDrag(container.foodData, container);
            } else {
                // Return to plate
                const homeData = this.foodItems.find(f => f.container === container);
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

    feedPetWithDrag(food, container) {
        this.tweens.add({
            targets: container,
            x: this.pet.container.x,
            y: this.pet.container.y,
            scaleX: 0,
            scaleY: 0,
            duration: 200,
            onComplete: () => {
                if (inventory.removeItem(food.id)) {
                    try {
                        petStats.feed(food);
                    } catch (e) {
                        console.warn('Error feeding pet:', e);
                    }
                    soundManager.playFeed();
                    this.pet.playFeedAnimation();
                    this.ui.showToast(`Yum! ${food.name}!`);
                    this.showFeedHearts();
                }
            },
        });
    }

    showFeedHearts() {
        for (let i = 0; i < 3; i++) {
            this.time.delayedCall(i * 100, () => {
                const heart = this.add.text(
                    this.pet.container.x - 20 + Math.random() * 40,
                    this.pet.container.y - 50,
                    '♥',
                    { fontSize: '18px', color: '#f06292' }
                );

                this.tweens.add({
                    targets: heart,
                    y: heart.y - 40,
                    alpha: 0,
                    duration: 600,
                    onComplete: () => heart.destroy(),
                });
            });
        }
    }

    showPetMouthZone(show) {
        if (!this.mouthHighlight) {
            this.mouthHighlight = this.add.graphics();
            this.mouthHighlight.setDepth(999);
        }

        this.mouthHighlight.clear();

        if (this.feedMeText) {
            this.feedMeText.destroy();
            this.feedMeText = null;
        }

        if (show) {
            const petX = this.pet.container.x;
            const petY = this.pet.container.y - 10;

            this.mouthHighlight.lineStyle(4, 0x4caf50, 0.9);
            this.mouthHighlight.strokeCircle(petX, petY, 55);
            this.mouthHighlight.lineStyle(2, 0x81c784, 0.6);
            this.mouthHighlight.strokeCircle(petX, petY, 60);
            this.mouthHighlight.fillStyle(0x4caf50, 0.15);
            this.mouthHighlight.fillCircle(petX, petY, 55);

            this.feedMeText = this.add.text(petX, petY - 70, '🍴 Drop here!', {
                fontSize: '14px',
                fontFamily: CONFIG.FONT.FAMILY,
                color: '#ffffff',
                backgroundColor: '#4caf50',
                padding: { x: 8, y: 4 },
            }).setOrigin(0.5).setDepth(1000);

            this.tweens.add({
                targets: this.feedMeText,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 400,
                yoyo: true,
                repeat: -1,
            });
        }
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

        // Closet button (door to closet/dressing room)
        const closetBtn = this.add.container(200, CONFIG.HEIGHT - 40);

        const closetBg = this.add.graphics();
        closetBg.fillStyle(0xce93d8, 1);
        closetBg.fillRect(-50, -18, 100, 36);
        closetBg.lineStyle(2, 0xe1bee7);
        closetBg.strokeRect(-50, -18, 100, 36);

        const closetText = this.add.text(0, 0, '👗 Closet', {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);

        closetBtn.add([closetBg, closetText]);
        closetBtn.setSize(100, 36);
        closetBtn.setInteractive({ useHandCursor: true });

        closetBtn.on('pointerover', () => {
            closetBg.clear();
            closetBg.fillStyle(0xe1bee7, 1);
            closetBg.fillRect(-50, -18, 100, 36);
            closetBg.lineStyle(2, 0xce93d8);
            closetBg.strokeRect(-50, -18, 100, 36);
        });

        closetBtn.on('pointerout', () => {
            closetBg.clear();
            closetBg.fillStyle(0xce93d8, 1);
            closetBg.fillRect(-50, -18, 100, 36);
            closetBg.lineStyle(2, 0xe1bee7);
            closetBg.strokeRect(-50, -18, 100, 36);
        });

        closetBtn.on('pointerdown', () => {
            soundManager.playClick();
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start(CONFIG.SCENES.CLOSET);
            });
        });

        // Shop button
        const shopBtn = this.add.container(CONFIG.WIDTH - 70, CONFIG.HEIGHT - 40);

        const shopBg = this.add.graphics();
        shopBg.fillStyle(CONFIG.COLORS.ACCENT, 1);
        shopBg.fillRect(-50, -18, 100, 36);
        shopBg.lineStyle(2, 0xffd54f);
        shopBg.strokeRect(-50, -18, 100, 36);

        const shopText = this.add.text(0, 0, '🛒 Shop', {
            fontSize: CONFIG.FONT.SIZE_SMALL,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#000000',
        }).setOrigin(0.5);

        shopBtn.add([shopBg, shopText]);
        shopBtn.setSize(100, 36);
        shopBtn.setInteractive({ useHandCursor: true });

        shopBtn.on('pointerover', () => {
            shopBg.clear();
            shopBg.fillStyle(0xffd54f, 1);
            shopBg.fillRect(-50, -18, 100, 36);
            shopBg.lineStyle(2, CONFIG.COLORS.ACCENT);
            shopBg.strokeRect(-50, -18, 100, 36);
        });

        shopBtn.on('pointerout', () => {
            shopBg.clear();
            shopBg.fillStyle(CONFIG.COLORS.ACCENT, 1);
            shopBg.fillRect(-50, -18, 100, 36);
            shopBg.lineStyle(2, 0xffd54f);
            shopBg.strokeRect(-50, -18, 100, 36);
        });

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
            '💡 Drag food to your pet to feed them!', {
            fontSize: '11px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#888888',
        }).setOrigin(0.5);
    }

    shutdown() {
        // Clean up listeners
        petStats.removeListener(this.statListener);
        inventory.removeListener(this.statListener);

        if (this.pet) {
            this.pet.destroy();
        }
        if (this.ui) {
            this.ui.destroy();
        }

        // Clean up food items
        if (this.foodItems) {
            this.foodItems.forEach(item => {
                if (item && item.container) {
                    item.container.destroy();
                }
            });
        }
    }
}
