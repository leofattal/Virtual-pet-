// PixelPal - Shop Scene

class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: CONFIG.SCENES.SHOP });
        this.currentCategory = 'food';
    }

    create() {
        // Create background
        this.createBackground();

        // Create UI elements
        this.createUI();

        // Create shop display
        this.createShopDisplay();

        // Fade in
        this.cameras.main.fadeIn(300, 0, 0, 0);
    }

    createBackground() {
        const bg = this.add.graphics();

        // Shop interior
        bg.fillStyle(CONFIG.COLORS.BG_SHOP, 1);
        bg.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Shelves on wall
        bg.fillStyle(0x5d4037, 1);
        for (let y = 80; y < 400; y += 120) {
            bg.fillRect(20, y, CONFIG.WIDTH - 40, 15);
            // Shelf brackets
            bg.fillStyle(0x4e342e, 1);
            bg.fillRect(40, y, 10, 25);
            bg.fillRect(CONFIG.WIDTH - 50, y, 10, 25);
            bg.fillStyle(0x5d4037, 1);
        }

        // Counter at bottom
        bg.fillStyle(0x6d4c41, 1);
        bg.fillRect(0, CONFIG.HEIGHT - 120, CONFIG.WIDTH, 120);
        bg.fillStyle(0x5d4037, 1);
        bg.fillRect(0, CONFIG.HEIGHT - 120, CONFIG.WIDTH, 10);

        // Shop sign
        bg.fillStyle(0xffca28, 1);
        bg.fillRect(CONFIG.WIDTH / 2 - 100, 10, 200, 50);
        bg.fillStyle(0xffa000, 1);
        bg.fillRect(CONFIG.WIDTH / 2 - 95, 15, 190, 40);

        this.add.text(CONFIG.WIDTH / 2, 35, '🛒 PIXEL SHOP', {
            fontSize: CONFIG.FONT.SIZE_LARGE,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#3d2d4a',
        }).setOrigin(0.5);

        // Decorative items on shelves
        this.drawShelfDecor(bg);
    }

    drawShelfDecor(bg) {
        // Random decorative items on shelves
        const colors = [0xef5350, 0x42a5f5, 0x66bb6a, 0xffca28, 0xce93d8];

        // Top shelf decor
        for (let x = 60; x < CONFIG.WIDTH - 60; x += 80) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            bg.fillStyle(color, 0.3);
            bg.fillRect(x, 55, 30, 25);
        }

        // Second shelf decor
        for (let x = 80; x < CONFIG.WIDTH - 80; x += 100) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            bg.fillStyle(color, 0.3);
            bg.fillCircle(x + 15, 175, 15);
        }
    }

    createUI() {
        // Coin display
        this.coinDisplay = this.add.container(CONFIG.WIDTH - 100, 90);

        const coinBg = this.add.graphics();
        coinBg.fillStyle(0x000000, 0.5);
        coinBg.fillRect(-60, -20, 120, 40);
        this.coinDisplay.add(coinBg);

        const coinIcon = this.add.graphics();
        coinIcon.fillStyle(CONFIG.COLORS.ACCENT, 1);
        coinIcon.fillCircle(-35, 0, 12);
        coinIcon.fillStyle(0xffa000, 1);
        coinIcon.fillCircle(-35, 0, 8);
        this.coinDisplay.add(coinIcon);

        this.coinText = this.add.text(10, 0, `${inventory.coins}`, {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffca28',
        }).setOrigin(0.5);
        this.coinDisplay.add(this.coinText);

        // Create shopping cart
        this.createShoppingCart();

        // Category tabs
        this.createCategoryTabs();

        // Back button
        this.createBackButton();
    }

    createShoppingCart() {
        // Cart position - bottom right of screen
        this.cartX = CONFIG.WIDTH - 120;
        this.cartY = CONFIG.HEIGHT - 140;

        this.cartContainer = this.add.container(this.cartX, this.cartY);

        const cart = this.add.graphics();

        // Cart basket
        cart.fillStyle(0x8d6e63, 1);
        cart.fillRect(-40, -20, 80, 50);
        cart.fillStyle(0x6d4c41, 1);
        cart.fillRect(-35, -15, 70, 40);

        // Cart handle (simplified - just use lines instead of arc)
        cart.lineStyle(4, 0x5d4037);
        cart.lineBetween(-25, -20, -25, -45);
        cart.lineBetween(-25, -45, 25, -45);
        cart.lineBetween(25, -45, 25, -20);

        // Cart wheels
        cart.fillStyle(0x424242, 1);
        cart.fillCircle(-30, 35, 8);
        cart.fillCircle(30, 35, 8);
        cart.fillStyle(0x616161, 1);
        cart.fillCircle(-30, 35, 4);
        cart.fillCircle(30, 35, 4);

        this.cartContainer.add(cart);

        // Cart label
        const label = this.add.text(0, 55, '🛒 Cart', {
            fontSize: '14px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
            backgroundColor: '#00000080',
            padding: { x: 6, y: 3 },
        }).setOrigin(0.5);
        this.cartContainer.add(label);

        // Items in cart counter
        this.cartCountBg = this.add.graphics();
        this.cartCountBg.fillStyle(0xe53935, 1);
        this.cartCountBg.fillCircle(35, -30, 12);
        this.cartCountBg.setVisible(false);
        this.cartContainer.add(this.cartCountBg);

        this.cartCountText = this.add.text(35, -30, '0', {
            fontSize: '12px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);
        this.cartCountText.setVisible(false);
        this.cartContainer.add(this.cartCountText);

        // Track items added to cart this session
        this.cartItemCount = 0;
    }

    animateItemToCart(item, startX, startY) {
        // Create a flying item icon
        const flyingItem = this.add.graphics();
        flyingItem.fillStyle(item.color, 1);
        flyingItem.fillCircle(0, 0, 15);
        flyingItem.x = startX;
        flyingItem.y = startY;
        flyingItem.setDepth(1000);

        // Play cha-ching sound
        soundManager.playChaChing();

        // Animate to cart with arc
        this.tweens.add({
            targets: flyingItem,
            x: this.cartX,
            y: this.cartY - 10,
            scale: 0.5,
            duration: 500,
            ease: 'Quad.easeIn',
            onComplete: () => {
                flyingItem.destroy();

                // Bounce the cart
                this.tweens.add({
                    targets: this.cartContainer,
                    scaleX: 1.2,
                    scaleY: 0.9,
                    duration: 100,
                    yoyo: true,
                });

                // Update cart count
                this.cartItemCount++;
                this.cartCountText.setText(`${this.cartItemCount}`);
                this.cartCountBg.setVisible(true);
                this.cartCountText.setVisible(true);
            },
        });
    }

    createCategoryTabs() {
        const categories = [
            { key: 'food', label: '🍎 Food' },
            { key: 'clothes', label: '👕 Clothes' },
            { key: 'toys', label: '🎾 Toys' },
            { key: 'house', label: '🏠 House' },
        ];

        this.categoryTabs = {};
        const tabY = 90;

        categories.forEach((cat, index) => {
            const tabX = 80 + index * 115;
            const tab = this.add.container(tabX, tabY);

            const bg = this.add.graphics();
            this.drawTab(bg, cat.key === this.currentCategory);

            const text = this.add.text(0, 0, cat.label, {
                fontSize: CONFIG.FONT.SIZE_SMALL,
                fontFamily: CONFIG.FONT.FAMILY,
                color: '#ffffff',
            }).setOrigin(0.5);

            tab.add([bg, text]);
            tab.setSize(110, 35);
            tab.setInteractive({ useHandCursor: true });

            tab.on('pointerdown', () => {
                soundManager.playClick();
                this.selectCategory(cat.key);
            });

            this.categoryTabs[cat.key] = { container: tab, bg, text };
        });
    }

    drawTab(graphics, isActive) {
        graphics.clear();
        if (isActive) {
            graphics.fillStyle(CONFIG.COLORS.ACCENT, 1);
            graphics.fillRect(-55, -17, 110, 34);
        } else {
            graphics.fillStyle(0x555555, 1);
            graphics.fillRect(-55, -17, 110, 34);
        }
    }

    selectCategory(category) {
        this.currentCategory = category;

        // Update tab visuals
        for (const key in this.categoryTabs) {
            const tab = this.categoryTabs[key];
            this.drawTab(tab.bg, key === category);
        }

        // Refresh shop display
        this.refreshShopDisplay();
    }

    createShopDisplay() {
        this.shopContainer = this.add.container(0, 0);
        this.refreshShopDisplay();
    }

    refreshShopDisplay() {
        // Clear existing items
        this.shopContainer.removeAll(true);

        // Get items for current category
        let items = [];
        if (this.currentCategory === 'food') {
            items = Object.values(ITEMS.food);
        } else if (this.currentCategory === 'clothes') {
            items = Object.values(ITEMS.clothes);
        } else if (this.currentCategory === 'toys') {
            items = Object.values(ITEMS.toys);
        } else if (this.currentCategory === 'house') {
            items = Object.values(ITEMS.house);
        }

        // Create item grid
        const startX = 80;
        const startY = 150;
        const cellWidth = 140;
        const cellHeight = 120;
        const columns = 5;

        items.forEach((item, index) => {
            const col = index % columns;
            const row = Math.floor(index / columns);
            const x = startX + col * cellWidth;
            const y = startY + row * cellHeight;

            const cell = this.createShopItem(x, y, item);
            this.shopContainer.add(cell);
        });
    }

    createShopItem(x, y, item) {
        const cell = this.add.container(x, y);
        const width = 120;
        const height = 100;

        // Check if already owned (for clothes, toys, and house items)
        let isOwned = false;
        if (item.category === 'hat' || item.category === 'accessory') {
            isOwned = inventory.ownedClothes.includes(item.id);
        } else if (item.category === 'toy') {
            isOwned = inventory.ownedToys.includes(item.id);
        } else if (item.category === 'house') {
            isOwned = inventory.ownedHouseItems.includes(item.id);
        }
        const canAfford = inventory.canAfford(item.price);

        // Background
        const bg = this.add.graphics();
        bg.fillStyle(isOwned ? 0x4caf50 : (canAfford ? 0x444444 : 0x333333), 1);
        bg.fillRect(0, 0, width, height);
        bg.lineStyle(2, isOwned ? CONFIG.COLORS.SUCCESS : CONFIG.COLORS.PRIMARY);
        bg.strokeRect(0, 0, width, height);
        cell.add(bg);

        // Item icon
        const icon = this.add.graphics();
        icon.fillStyle(item.color, 1);
        if (item.category === 'food' || item.category === 'toy') {
            icon.fillCircle(width / 2, 30, 20);
        } else {
            icon.fillRect(width / 2 - 15, 15, 30, 30);
        }
        cell.add(icon);

        // Item name
        const name = this.add.text(width / 2, 58, item.name, {
            fontSize: '12px',
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#ffffff',
        }).setOrigin(0.5);
        cell.add(name);

        // Price or owned status
        let priceText;
        if (isOwned) {
            priceText = this.add.text(width / 2, 78, '✓ Owned', {
                fontSize: '12px',
                fontFamily: CONFIG.FONT.FAMILY,
                color: '#4caf50',
            }).setOrigin(0.5);
        } else {
            priceText = this.add.text(width / 2, 78, `${item.price} 🪙`, {
                fontSize: '14px',
                fontFamily: CONFIG.FONT.FAMILY,
                color: canAfford ? '#ffca28' : '#888888',
            }).setOrigin(0.5);
        }
        cell.add(priceText);

        // Make interactive if not owned
        if (!isOwned) {
            cell.setSize(width, height);
            // Set interactive with explicit hit area matching the drawn graphics
            cell.setInteractive(
                new Phaser.Geom.Rectangle(0, 0, width, height),
                Phaser.Geom.Rectangle.Contains
            );

            cell.on('pointerover', () => {
                // Safety check - bg might be destroyed during refresh
                if (!bg || !bg.scene) return;
                if (inventory.canAfford(item.price)) {
                    bg.clear();
                    bg.fillStyle(0x555555, 1);
                    bg.fillRect(0, 0, width, height);
                    bg.lineStyle(2, CONFIG.COLORS.ACCENT);
                    bg.strokeRect(0, 0, width, height);
                }
            });

            cell.on('pointerout', () => {
                // Safety check - bg might be destroyed during refresh
                if (!bg || !bg.scene) return;
                bg.clear();
                bg.fillStyle(inventory.canAfford(item.price) ? 0x444444 : 0x333333, 1);
                bg.fillRect(0, 0, width, height);
                bg.lineStyle(2, CONFIG.COLORS.PRIMARY);
                bg.strokeRect(0, 0, width, height);
            });

            cell.on('pointerdown', () => {
                console.log('Clicked on item:', item.name, 'Price:', item.price, 'Current coins:', inventory.coins);
                this.purchaseItem(item, x + 60, y + 40);
            });
        }

        return cell;
    }

    purchaseItem(item, cellX, cellY) {
        console.log('purchaseItem called for:', item.name);
        const result = inventory.purchase(item);
        console.log('Purchase result:', result);

        if (result.success) {
            // Save immediately after purchase
            saveSystem.saveNow();

            // Animate item flying to cart with cha-ching sound
            this.animateItemToCart(item, cellX || CONFIG.WIDTH / 2, cellY || CONFIG.HEIGHT / 2);
            this.coinText.setText(`${inventory.coins}`);
            this.refreshShopDisplay();

            // Show success message
            this.showMessage(`Bought ${item.name}!`, true);
        } else {
            soundManager.playError();
            this.showMessage(result.message, false);
        }
    }

    showPurchaseEffect(item) {
        // Success message
        const msg = this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2, `Bought ${item.name}!`, {
            fontSize: CONFIG.FONT.SIZE_LARGE,
            fontFamily: CONFIG.FONT.FAMILY,
            color: '#4caf50',
            backgroundColor: '#000000cc',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5);

        this.tweens.add({
            targets: msg,
            y: msg.y - 50,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => msg.destroy(),
        });

        // Sparkle effect
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const sparkle = this.add.graphics();
            sparkle.fillStyle(CONFIG.COLORS.ACCENT, 1);
            sparkle.fillCircle(0, 0, 4);
            sparkle.x = CONFIG.WIDTH / 2;
            sparkle.y = CONFIG.HEIGHT / 2;

            this.tweens.add({
                targets: sparkle,
                x: CONFIG.WIDTH / 2 + Math.cos(angle) * 100,
                y: CONFIG.HEIGHT / 2 + Math.sin(angle) * 100,
                alpha: 0,
                duration: 500,
                onComplete: () => sparkle.destroy(),
            });
        }
    }

    showMessage(text, isSuccess = false) {
        const msg = this.add.text(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 - 50, text, {
            fontSize: CONFIG.FONT.SIZE_MEDIUM,
            fontFamily: CONFIG.FONT.FAMILY,
            color: isSuccess ? '#4caf50' : '#ef5350',
            backgroundColor: '#000000cc',
            padding: { x: 20, y: 10 },
        }).setOrigin(0.5).setDepth(1001);

        this.tweens.add({
            targets: msg,
            y: msg.y - 30,
            alpha: 0,
            duration: 1200,
            delay: 300,
            onComplete: () => msg.destroy(),
        });
    }

    createBackButton() {
        const backBtn = this.add.container(70, CONFIG.HEIGHT - 50);

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
