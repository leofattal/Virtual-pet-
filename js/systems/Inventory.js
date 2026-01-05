// PixelPal - Inventory System

class Inventory {
    constructor() {
        this.coins = CONFIG.STARTING_COINS;
        this.items = {}; // { itemId: quantity }
        this.ownedClothes = []; // Array of owned clothing item IDs
        this.listeners = [];
        console.log('Inventory initialized with', this.coins, 'coins');
    }

    // Add coins
    addCoins(amount) {
        this.coins += amount;
        soundManager.playCoin();
        this.notifyListeners();
    }

    // Spend coins (returns true if successful)
    spendCoins(amount) {
        if (this.coins >= amount) {
            this.coins -= amount;
            this.notifyListeners();
            return true;
        }
        soundManager.playError();
        return false;
    }

    // Check if can afford
    canAfford(amount) {
        return this.coins >= amount;
    }

    // Add item to inventory
    addItem(itemId, quantity = 1) {
        if (!this.items[itemId]) {
            this.items[itemId] = 0;
        }
        this.items[itemId] += quantity;
        this.notifyListeners();
    }

    // Remove item from inventory (returns true if successful)
    removeItem(itemId, quantity = 1) {
        if (this.items[itemId] && this.items[itemId] >= quantity) {
            this.items[itemId] -= quantity;
            if (this.items[itemId] <= 0) {
                delete this.items[itemId];
            }
            this.notifyListeners();
            return true;
        }
        return false;
    }

    // Check if has item
    hasItem(itemId, quantity = 1) {
        return this.items[itemId] && this.items[itemId] >= quantity;
    }

    // Get item quantity
    getItemQuantity(itemId) {
        return this.items[itemId] || 0;
    }

    // Purchase item
    purchase(item) {
        console.log('Attempting to purchase:', item.name, 'for', item.price, 'coins. Current coins:', this.coins);

        if (!this.canAfford(item.price)) {
            console.log('Cannot afford! Coins:', this.coins, 'Price:', item.price);
            return { success: false, message: 'Not enough coins!' };
        }

        this.spendCoins(item.price);

        // Clothes are permanent purchases
        if (item.category === 'hat' || item.category === 'accessory') {
            if (this.ownedClothes.includes(item.id)) {
                // Refund if already owned
                this.addCoins(item.price);
                return { success: false, message: 'Already owned!' };
            }
            this.ownedClothes.push(item.id);
        } else {
            // Consumables go to inventory
            this.addItem(item.id);
        }

        console.log('Purchase successful! Remaining coins:', this.coins);
        soundManager.playClick();
        return { success: true, message: `Bought ${item.name}!` };
    }

    // Check if clothing is owned
    ownsClothing(itemId) {
        return this.ownedClothes.includes(itemId);
    }

    // Get all owned food items
    getOwnedFood() {
        const food = [];
        for (const itemId in this.items) {
            const item = getItemById(itemId);
            if (item && item.category === 'food') {
                food.push({ ...item, quantity: this.items[itemId] });
            }
        }
        return food;
    }

    // Get all owned toys
    getOwnedToys() {
        const toys = [];
        for (const itemId in this.items) {
            const item = getItemById(itemId);
            if (item && item.category === 'toy') {
                toys.push({ ...item, quantity: this.items[itemId] });
            }
        }
        return toys;
    }

    // Load from save
    loadFromSave(saveData) {
        if (saveData.inventory) {
            // Use nullish coalescing but also check for valid number
            const savedCoins = saveData.inventory.coins;
            this.coins = (typeof savedCoins === 'number' && savedCoins >= 0) ? savedCoins : CONFIG.STARTING_COINS;
            this.items = saveData.inventory.items ?? {};
            this.ownedClothes = saveData.inventory.ownedClothes ?? [];
            console.log('Inventory loaded from save:', this.coins, 'coins, items:', this.items);
        }
        this.notifyListeners();
    }

    // Event listener system
    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this));
    }
}

// Global inventory instance
const inventory = new Inventory();
