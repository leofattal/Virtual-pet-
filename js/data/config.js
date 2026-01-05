// PixelPal - Game Configuration

const CONFIG = {
    // Game dimensions
    WIDTH: 800,
    HEIGHT: 600,

    // Pet stats
    MAX_STAT: 100,
    CRITICAL_STAT: 20,
    STAT_DECAY_RATE: 1,        // Points to decrease
    STAT_DECAY_INTERVAL: 60000, // Every 60 seconds

    // Colors - Pixel art palette
    COLORS: {
        // UI Colors
        PRIMARY: 0x5c6bc0,
        SECONDARY: 0x7986cb,
        ACCENT: 0xffca28,
        DANGER: 0xef5350,
        SUCCESS: 0x66bb6a,

        // Background colors
        BG_HOME: 0x2d2d44,
        BG_PLAYGROUND: 0x4a6741,
        BG_ARCADE: 0x1a1a2e,
        BG_SHOP: 0x3d2d4a,

        // Pet colors
        PET_BODY: 0x64b5f6,
        PET_BELLY: 0xbbdefb,
        PET_CHEEKS: 0xf48fb1,
        PET_EYES: 0x1a1a2e,

        // Stat bar colors
        HUNGER: 0xff7043,
        ENERGY: 0xffee58,
        HAPPINESS: 0xf06292,
        CLEANLINESS: 0x4dd0e1,

        // Text
        TEXT_LIGHT: 0xffffff,
        TEXT_DARK: 0x1a1a2e,
    },

    // Font settings
    FONT: {
        FAMILY: 'Courier New',
        SIZE_LARGE: '24px',
        SIZE_MEDIUM: '18px',
        SIZE_SMALL: '14px',
    },

    // Animation speeds (ms)
    ANIMATION: {
        PET_IDLE: 500,
        PET_ACTION: 200,
        UI_TRANSITION: 300,
    },

    // Mini-game settings
    FLAPPY: {
        GRAVITY: 400,
        JUMP_VELOCITY: -200,
        PIPE_SPEED: 200,
        PIPE_GAP: 150,
        PIPE_INTERVAL: 1500,
    },

    MAZE: {
        TILE_SIZE: 24,
        PLAYER_SPEED: 150,
        GHOST_SPEED: 100,
    },

    // Starting values
    STARTING_COINS: 100,
    STARTING_STATS: {
        hunger: 80,
        energy: 80,
        happiness: 80,
        cleanliness: 80,
    },

    // Scene keys
    SCENES: {
        BOOT: 'BootScene',
        NAMING: 'NamingScene',
        HOME: 'HomeScene',
        BEDROOM: 'BedroomScene',
        KITCHEN: 'KitchenScene',
        CLOSET: 'ClosetScene',
        PLAYGROUND: 'PlaygroundScene',
        ARCADE: 'ArcadeScene',
        FLAPPY: 'FlappyScene',
        MAZE: 'MazeScene',
        SHOP: 'ShopScene',
        BATHROOM: 'BathroomScene',
        FUNERAL: 'FuneralScene',
    },
};
