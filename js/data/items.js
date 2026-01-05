// PixelPal - Item Definitions

const ITEMS = {
    // Food items
    food: {
        apple: {
            id: 'apple',
            name: 'Apple',
            price: 5,
            category: 'food',
            effects: { hunger: 15, happiness: 5 },
            color: 0xe53935,
            description: 'A healthy red apple',
        },
        pizza: {
            id: 'pizza',
            name: 'Pizza',
            price: 15,
            category: 'food',
            effects: { hunger: 30, happiness: 15, cleanliness: -5 },
            color: 0xffb74d,
            description: 'Delicious cheesy pizza',
        },
        candy: {
            id: 'candy',
            name: 'Candy',
            price: 8,
            category: 'food',
            effects: { hunger: 5, happiness: 25, cleanliness: -10 },
            color: 0xf06292,
            description: 'Sweet and sugary treat',
        },
        soup: {
            id: 'soup',
            name: 'Soup',
            price: 10,
            category: 'food',
            effects: { hunger: 25, happiness: 10, energy: 5 },
            color: 0xffcc80,
            description: 'Warm and comforting soup',
        },
        carrot: {
            id: 'carrot',
            name: 'Carrot',
            price: 4,
            category: 'food',
            effects: { hunger: 10, happiness: 3 },
            color: 0xff7043,
            description: 'Crunchy orange carrot',
        },
        cake: {
            id: 'cake',
            name: 'Cake',
            price: 25,
            category: 'food',
            effects: { hunger: 20, happiness: 35, cleanliness: -15 },
            color: 0xce93d8,
            description: 'Birthday cake slice!',
        },
        cookie: {
            id: 'cookie',
            name: 'Cookie',
            price: 6,
            category: 'food',
            effects: { hunger: 8, happiness: 15 },
            color: 0xd4a373,
            description: 'Chocolate chip cookie',
        },
        sandwich: {
            id: 'sandwich',
            name: 'Sandwich',
            price: 12,
            category: 'food',
            effects: { hunger: 35, happiness: 10 },
            color: 0xf5deb3,
            description: 'Tasty lunch sandwich',
        },
        icecream: {
            id: 'icecream',
            name: 'Ice Cream',
            price: 18,
            category: 'food',
            effects: { hunger: 10, happiness: 30, cleanliness: -8 },
            color: 0xfff8dc,
            description: 'Cool vanilla cone',
        },
        sushi: {
            id: 'sushi',
            name: 'Sushi',
            price: 22,
            category: 'food',
            effects: { hunger: 28, happiness: 20 },
            color: 0xff6b6b,
            description: 'Fresh sushi roll',
        },
        hotdog: {
            id: 'hotdog',
            name: 'Hot Dog',
            price: 10,
            category: 'food',
            effects: { hunger: 22, happiness: 12, cleanliness: -5 },
            color: 0xf4a460,
            description: 'Classic hot dog',
        },
        salad: {
            id: 'salad',
            name: 'Salad',
            price: 8,
            category: 'food',
            effects: { hunger: 12, happiness: 5, energy: 10 },
            color: 0x90ee90,
            description: 'Fresh green salad',
        },
        donut: {
            id: 'donut',
            name: 'Donut',
            price: 7,
            category: 'food',
            effects: { hunger: 10, happiness: 20, cleanliness: -5 },
            color: 0xff69b4,
            description: 'Sprinkled donut',
        },
    },

    // Clothing items
    clothes: {
        // Hats
        hat_red: {
            id: 'hat_red',
            name: 'Red Cap',
            price: 30,
            category: 'hat',
            color: 0xe53935,
            description: 'A sporty red cap',
        },
        hat_wizard: {
            id: 'hat_wizard',
            name: 'Wizard Hat',
            price: 50,
            category: 'hat',
            color: 0x7e57c2,
            description: 'Magical wizard hat',
        },
        hat_crown: {
            id: 'hat_crown',
            name: 'Crown',
            price: 100,
            category: 'hat',
            color: 0xffd54f,
            description: 'A royal crown',
        },
        hat_bow: {
            id: 'hat_bow',
            name: 'Bow',
            price: 25,
            category: 'hat',
            color: 0xf06292,
            description: 'Cute ribbon bow',
        },

        // Accessories
        glasses: {
            id: 'glasses',
            name: 'Glasses',
            price: 20,
            category: 'accessory',
            color: 0x1a1a2e,
            description: 'Cool shades',
        },
        scarf: {
            id: 'scarf',
            name: 'Scarf',
            price: 35,
            category: 'accessory',
            color: 0x42a5f5,
            description: 'Cozy blue scarf',
        },
        wings: {
            id: 'wings',
            name: 'Angel Wings',
            price: 80,
            category: 'accessory',
            color: 0xffffff,
            description: 'Beautiful angel wings',
        },
        backpack: {
            id: 'backpack',
            name: 'Backpack',
            price: 40,
            category: 'accessory',
            color: 0x8d6e63,
            description: 'Handy backpack',
        },
        // More hats
        hat_beanie: {
            id: 'hat_beanie',
            name: 'Beanie',
            price: 28,
            category: 'hat',
            color: 0x4caf50,
            description: 'Cozy winter beanie',
        },
        hat_tophat: {
            id: 'hat_tophat',
            name: 'Top Hat',
            price: 75,
            category: 'hat',
            color: 0x1a1a2e,
            description: 'Fancy top hat',
        },
        hat_pirate: {
            id: 'hat_pirate',
            name: 'Pirate Hat',
            price: 55,
            category: 'hat',
            color: 0x2d2d2d,
            description: 'Arrr! Pirate hat',
        },
        hat_bunny: {
            id: 'hat_bunny',
            name: 'Bunny Ears',
            price: 35,
            category: 'hat',
            color: 0xffc0cb,
            description: 'Cute bunny ears',
        },
        hat_chef: {
            id: 'hat_chef',
            name: 'Chef Hat',
            price: 40,
            category: 'hat',
            color: 0xffffff,
            description: 'Professional chef hat',
        },
        // More accessories
        bowtie: {
            id: 'bowtie',
            name: 'Bow Tie',
            price: 25,
            category: 'accessory',
            color: 0xef5350,
            description: 'Dapper bow tie',
        },
        cape: {
            id: 'cape',
            name: 'Hero Cape',
            price: 60,
            category: 'accessory',
            color: 0xd32f2f,
            description: 'Superhero cape',
        },
        necklace: {
            id: 'necklace',
            name: 'Necklace',
            price: 45,
            category: 'accessory',
            color: 0xffd700,
            description: 'Golden necklace',
        },
        headphones: {
            id: 'headphones',
            name: 'Headphones',
            price: 55,
            category: 'accessory',
            color: 0x9e9e9e,
            description: 'Cool headphones',
        },
        flower: {
            id: 'flower',
            name: 'Flower',
            price: 15,
            category: 'accessory',
            color: 0xff69b4,
            description: 'Pretty flower',
        },
    },

    // Toys (increase happiness when used)
    toys: {
        ball: {
            id: 'ball',
            name: 'Ball',
            price: 15,
            category: 'toy',
            effects: { happiness: 20 },
            color: 0x42a5f5,
            description: 'Bouncy play ball',
        },
        teddy: {
            id: 'teddy',
            name: 'Teddy Bear',
            price: 45,
            category: 'toy',
            effects: { happiness: 30 },
            color: 0x8d6e63,
            description: 'Cuddly teddy bear',
        },
        kite: {
            id: 'kite',
            name: 'Kite',
            price: 35,
            category: 'toy',
            effects: { happiness: 25 },
            color: 0xef5350,
            description: 'Colorful flying kite',
        },
        bubbles: {
            id: 'bubbles',
            name: 'Bubbles',
            price: 10,
            category: 'toy',
            effects: { happiness: 15 },
            color: 0x81d4fa,
            description: 'Fun soap bubbles',
        },
        soccerball: {
            id: 'soccerball',
            name: 'Soccer Ball',
            price: 25,
            category: 'toy',
            effects: { happiness: 25, energy: -10 },
            color: 0xffffff,
            description: 'Play soccer!',
        },
        racecar: {
            id: 'racecar',
            name: 'Race Car',
            price: 40,
            category: 'toy',
            effects: { happiness: 30 },
            color: 0xd32f2f,
            description: 'Zoom zoom!',
        },
        robot: {
            id: 'robot',
            name: 'Robot Toy',
            price: 55,
            category: 'toy',
            effects: { happiness: 35 },
            color: 0x9e9e9e,
            description: 'Beep boop robot',
        },
        puzzlebox: {
            id: 'puzzlebox',
            name: 'Puzzle Box',
            price: 30,
            category: 'toy',
            effects: { happiness: 20 },
            color: 0xff9800,
            description: 'Brain teaser fun',
        },
        jumprope: {
            id: 'jumprope',
            name: 'Jump Rope',
            price: 12,
            category: 'toy',
            effects: { happiness: 18, energy: -8 },
            color: 0xe91e63,
            description: 'Skip and jump!',
        },
        drum: {
            id: 'drum',
            name: 'Drum',
            price: 35,
            category: 'toy',
            effects: { happiness: 28 },
            color: 0xf44336,
            description: 'Bang bang music!',
        },
        doll: {
            id: 'doll',
            name: 'Doll',
            price: 38,
            category: 'toy',
            effects: { happiness: 25 },
            color: 0xffcc80,
            description: 'Cute playtime doll',
        },
    },
};

// Helper to get all items as flat array
function getAllItems() {
    const all = [];
    for (const category in ITEMS) {
        for (const itemId in ITEMS[category]) {
            all.push(ITEMS[category][itemId]);
        }
    }
    return all;
}

// Helper to get item by ID
function getItemById(id) {
    for (const category in ITEMS) {
        if (ITEMS[category][id]) {
            return ITEMS[category][id];
        }
    }
    return null;
}
