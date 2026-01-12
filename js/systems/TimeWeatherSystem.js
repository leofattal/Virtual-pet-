// PixelPal - Time & Weather System

class TimeWeatherSystem {
    constructor() {
        this.currentHour = new Date().getHours();
        this.currentWeather = 'sunny';

        this.weatherTypes = ['sunny', 'cloudy', 'rainy', 'night'];

        this.updateTimer = null;
    }

    // Start time/weather updates
    start(scene) {
        this.scene = scene;
        this.updateTimeOfDay();

        // Update every minute
        if (this.updateTimer) {
            this.updateTimer.remove();
        }

        this.updateTimer = scene.time.addEvent({
            delay: 60000, // 1 minute
            callback: () => this.updateTimeOfDay(),
            loop: true,
        });
    }

    // Stop updates
    stop() {
        if (this.updateTimer) {
            this.updateTimer.remove();
            this.updateTimer = null;
        }
    }

    // Update time of day
    updateTimeOfDay() {
        this.currentHour = new Date().getHours();

        // Determine weather based on time (simplified)
        if (this.currentHour >= 20 || this.currentHour < 6) {
            this.currentWeather = 'night';
        } else if (Math.random() < 0.2) {
            this.currentWeather = 'rainy';
        } else if (Math.random() < 0.3) {
            this.currentWeather = 'cloudy';
        } else {
            this.currentWeather = 'sunny';
        }
    }

    // Get sky color based on time/weather
    getSkyColor() {
        const hour = this.currentHour;

        // Night
        if (hour >= 20 || hour < 6) {
            return 0x1a1a2e;
        }

        // Dawn/dusk
        if (hour >= 6 && hour < 8) {
            return 0xff9a76; // Orange sunrise
        }
        if (hour >= 18 && hour < 20) {
            return 0xff7e5f; // Orange sunset
        }

        // Day
        if (this.currentWeather === 'rainy') {
            return 0x607d8b; // Gray
        }
        if (this.currentWeather === 'cloudy') {
            return 0x90a4ae; // Light gray
        }

        return 0x87ceeb; // Sunny blue
    }

    // Get lighting overlay color
    getLightingOverlay() {
        const hour = this.currentHour;

        if (hour >= 20 || hour < 6) {
            return { color: 0x000033, alpha: 0.6 }; // Dark blue night
        }

        if (hour >= 6 && hour < 8) {
            return { color: 0xff6b35, alpha: 0.2 }; // Dawn
        }

        if (hour >= 18 && hour < 20) {
            return { color: 0xff7043, alpha: 0.25 }; // Dusk
        }

        return { color: 0xffffff, alpha: 0 }; // No overlay
    }

    // Check if it's nighttime
    isNight() {
        return this.currentHour >= 20 || this.currentHour < 6;
    }

    // Check if it's daytime
    isDay() {
        return this.currentHour >= 6 && this.currentHour < 20;
    }

    // Get time greeting
    getTimeGreeting() {
        const hour = this.currentHour;

        if (hour < 6) return 'Good night';
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        if (hour < 22) return 'Good evening';
        return 'Good night';
    }

    // Get weather icon
    getWeatherIcon() {
        switch (this.currentWeather) {
            case 'sunny': return '☀️';
            case 'cloudy': return '☁️';
            case 'rainy': return '🌧️';
            case 'night': return '🌙';
            default: return '☀️';
        }
    }

    // Save data
    getSaveData() {
        return {
            lastUpdateTime: Date.now(),
        };
    }

    // Load data (just triggers update)
    loadFromSave(saveData) {
        this.updateTimeOfDay();
    }
}

// Global time/weather system instance
const timeWeatherSystem = new TimeWeatherSystem();
