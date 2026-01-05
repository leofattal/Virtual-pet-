# PixelPal - Virtual Pet Game

A browser-based virtual pet game inspired by Tamagotchi, featuring pixel art aesthetics, care mechanics, and arcade mini-games.

## How to Play

1. Open `index.html` in a web browser
2. Care for your pet by feeding, sleeping, and cleaning
3. Visit the playground for fun activities
4. Play arcade games to earn coins
5. Buy food, clothes, and toys in the shop

## Features

- **Pet Care**: Feed, sleep, clean, and dress your pixel pet
- **Stats System**: Hunger, Energy, Happiness, and Cleanliness decay over time
- **Playground**: Interactive swing, slide, and trampoline
- **Arcade Games**:
  - Sky Hop (Flappy-style game)
  - Pellet Munch (Pac-Man-style maze)
- **Shop**: Buy food, clothing, and toys with earned coins
- **Persistence**: Game saves automatically to LocalStorage

## Tech Stack

- Phaser 3 (game framework)
- Vanilla JavaScript
- HTML5 Canvas
- Web Audio API (sound effects)
- LocalStorage (save system)

## Project Structure

```
/
├── index.html              # Game entry point
├── css/style.css           # Styling
├── js/
│   ├── main.js             # Phaser config
│   ├── scenes/             # Game scenes
│   ├── objects/            # Pet & UI classes
│   ├── systems/            # Stats, inventory, save
│   └── data/               # Config & item data
└── prd.md                  # This file
```

## Debug Commands

Open browser console and use:
- `pixelPalDebug.addCoins(100)` - Add coins
- `pixelPalDebug.giveFood()` - Give all food items
- `pixelPalDebug.unlockAllClothes()` - Unlock all clothing
- `pixelPalDebug.setStats(100, 100, 100, 100)` - Max all stats
- `pixelPalDebug.resetSave()` - Reset game save
