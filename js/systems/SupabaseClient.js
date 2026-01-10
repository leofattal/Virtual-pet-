// PixelPal - Supabase Client Configuration

class SupabaseClient {
    constructor() {
        // Get environment variables (these will be replaced by your actual values)
        const SUPABASE_URL = 'https://eipbkokogsncrkelpwkj.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcGJrb2tvZ3NuY3JrZWxwd2tqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMDIyNzcsImV4cCI6MjA4MzU3ODI3N30.6f72RJUDjxJN62CuLSmnlin9463QFEfHMq_JQmt2IMU';

        // Initialize Supabase client
        this.client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // Current user
        this.currentUser = null;

        // Auth ready promise
        this.authReady = this.initAuth();
    }

    async initAuth() {
        // Get current session
        const { data: { session } } = await this.client.auth.getSession();

        if (session) {
            this.currentUser = session.user;
            console.log('User already signed in:', this.currentUser.email);
        }

        // Listen for auth changes
        this.client.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                this.currentUser = session.user;
                console.log('User signed in:', this.currentUser.email);

                // Initialize user data in database
                this.initializeUserData();
            } else if (event === 'SIGNED_OUT') {
                this.currentUser = null;
                console.log('User signed out');
            }
        });
    }

    // Sign in with Google
    async signInWithGoogle() {
        const { data, error } = await this.client.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });

        if (error) {
            console.error('Error signing in with Google:', error);
            return { success: false, error };
        }

        return { success: true, data };
    }

    // Sign out
    async signOut() {
        const { error } = await this.client.auth.signOut();

        if (error) {
            console.error('Error signing out:', error);
            return { success: false, error };
        }

        return { success: true };
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get current user
    getUser() {
        return this.currentUser;
    }

    // Initialize user data in database (create tables if they don't exist)
    async initializeUserData() {
        if (!this.currentUser) return;

        const userId = this.currentUser.id;

        try {
            // Check if pet data exists
            const { data: petData } = await this.client
                .from('pet_data')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (!petData) {
                // Create initial pet data
                await this.client.from('pet_data').insert({
                    user_id: userId,
                    pet_name: 'New Pet',
                    level: 1,
                    xp: 0,
                    hunger: 80,
                    energy: 80,
                    happiness: 80,
                    cleanliness: 80,
                    is_dead: false
                });

                console.log('Created initial pet data for user');
            }

            // Check if inventory exists
            const { data: inventoryData } = await this.client
                .from('inventory')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (!inventoryData) {
                // Create initial inventory
                await this.client.from('inventory').insert({
                    user_id: userId,
                    coins: 100,
                    items: {},
                    owned_clothes: [],
                    owned_toys: [],
                    owned_house_items: []
                });

                console.log('Created initial inventory for user');
            }

            // Check if game scores exist
            const { data: scoresData } = await this.client
                .from('game_scores')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (!scoresData) {
                // Create initial game scores
                await this.client.from('game_scores').insert({
                    user_id: userId,
                    game_high_scores: {},
                    total_games_played: 0
                });

                console.log('Created initial game scores for user');
            }
        } catch (error) {
            console.error('Error initializing user data:', error);
        }
    }

    // Save pet data to Supabase
    async savePetData(petStats) {
        if (!this.currentUser) return { success: false, error: 'Not authenticated' };

        const { error } = await this.client
            .from('pet_data')
            .upsert({
                user_id: this.currentUser.id,
                pet_name: petStats.name,
                level: petStats.level,
                xp: petStats.xp,
                hunger: petStats.hunger,
                energy: petStats.energy,
                happiness: petStats.happiness,
                cleanliness: petStats.cleanliness,
                is_dead: petStats.isDead,
                current_hat: petStats.currentHat,
                current_accessory: petStats.currentAccessory
            });

        if (error) {
            console.error('Error saving pet data:', error);
            return { success: false, error };
        }

        return { success: true };
    }

    // Load pet data from Supabase
    async loadPetData() {
        if (!this.currentUser) return null;

        const { data, error } = await this.client
            .from('pet_data')
            .select('*')
            .eq('user_id', this.currentUser.id)
            .single();

        if (error) {
            console.error('Error loading pet data:', error);
            return null;
        }

        return data;
    }

    // Save inventory to Supabase
    async saveInventory(inventory) {
        if (!this.currentUser) return { success: false, error: 'Not authenticated' };

        const { error } = await this.client
            .from('inventory')
            .upsert({
                user_id: this.currentUser.id,
                coins: inventory.coins,
                items: inventory.items,
                owned_clothes: inventory.ownedClothes,
                owned_toys: inventory.ownedToys,
                owned_house_items: inventory.ownedHouseItems
            });

        if (error) {
            console.error('Error saving inventory:', error);
            return { success: false, error };
        }

        return { success: true };
    }

    // Load inventory from Supabase
    async loadInventory() {
        if (!this.currentUser) return null;

        const { data, error } = await this.client
            .from('inventory')
            .select('*')
            .eq('user_id', this.currentUser.id)
            .single();

        if (error) {
            console.error('Error loading inventory:', error);
            return null;
        }

        return data;
    }

    // Save game scores to Supabase
    async saveGameScores(highScores, totalGamesPlayed) {
        if (!this.currentUser) return { success: false, error: 'Not authenticated' };

        const { error } = await this.client
            .from('game_scores')
            .upsert({
                user_id: this.currentUser.id,
                game_high_scores: highScores,
                total_games_played: totalGamesPlayed
            });

        if (error) {
            console.error('Error saving game scores:', error);
            return { success: false, error };
        }

        return { success: true };
    }

    // Load game scores from Supabase
    async loadGameScores() {
        if (!this.currentUser) return null;

        const { data, error } = await this.client
            .from('game_scores')
            .select('*')
            .eq('user_id', this.currentUser.id)
            .single();

        if (error) {
            console.error('Error loading game scores:', error);
            return null;
        }

        return data;
    }

    // Save all game data
    async saveAllData(gameData) {
        if (!this.currentUser) return { success: false, error: 'Not authenticated' };

        try {
            await Promise.all([
                this.savePetData(gameData.petStats),
                this.saveInventory(gameData.inventory),
                this.saveGameScores(gameData.highScores, gameData.totalGamesPlayed)
            ]);

            console.log('All game data saved to Supabase');
            return { success: true };
        } catch (error) {
            console.error('Error saving all data:', error);
            return { success: false, error };
        }
    }

    // Load all game data
    async loadAllData() {
        if (!this.currentUser) return null;

        try {
            const [petData, inventoryData, scoresData] = await Promise.all([
                this.loadPetData(),
                this.loadInventory(),
                this.loadGameScores()
            ]);

            if (!petData || !inventoryData || !scoresData) {
                return null;
            }

            return {
                petStats: {
                    name: petData.pet_name,
                    level: petData.level,
                    xp: petData.xp,
                    hunger: petData.hunger,
                    energy: petData.energy,
                    happiness: petData.happiness,
                    cleanliness: petData.cleanliness,
                    isDead: petData.is_dead,
                    currentHat: petData.current_hat,
                    currentAccessory: petData.current_accessory
                },
                inventory: {
                    coins: inventoryData.coins,
                    items: inventoryData.items,
                    ownedClothes: inventoryData.owned_clothes,
                    ownedToys: inventoryData.owned_toys,
                    ownedHouseItems: inventoryData.owned_house_items
                },
                highScores: scoresData.game_high_scores,
                totalGamesPlayed: scoresData.total_games_played
            };
        } catch (error) {
            console.error('Error loading all data:', error);
            return null;
        }
    }
}

// Create global instance
const supabaseClient = new SupabaseClient();
