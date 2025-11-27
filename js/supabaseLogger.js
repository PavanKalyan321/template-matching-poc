/**
 * SupabaseLogger - Handles logging of patterns to Supabase database
 * Uses the Supabase JavaScript client library
 */

class SupabaseLogger {
    constructor(config) {
        this.config = config;
        this.client = null;
        this.isConnected = false;
        this.tableName = 'aviator_patterns';
    }

    /**
     * Initialize Supabase client
     */
    async initialize() {
        try {
            if (!this.config || !this.config.url || !this.config.anonKey) {
                throw new Error('Supabase configuration missing. Please check config.js');
            }

            // Load Supabase client library from CDN
            if (!window.supabase) {
                await this.loadSupabaseLibrary();
            }

            // Create Supabase client
            this.client = window.supabase.createClient(
                this.config.url,
                this.config.anonKey
            );

            // Test connection
            await this.testConnection();

            this.isConnected = true;
            return { success: true, message: 'Connected to Supabase successfully' };
        } catch (error) {
            this.isConnected = false;
            return { success: false, message: error.message };
        }
    }

    /**
     * Load Supabase library from CDN
     */
    loadSupabaseLibrary() {
        return new Promise((resolve, reject) => {
            if (window.supabase) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Supabase library'));
            document.head.appendChild(script);
        });
    }

    /**
     * Test database connection
     */
    async testConnection() {
        try {
            const { error } = await this.client
                .from(this.tableName)
                .select('id')
                .limit(1);

            if (error) throw error;
            return true;
        } catch (error) {
            throw new Error(`Connection test failed: ${error.message}`);
        }
    }

    /**
     * Log a single pattern to Supabase
     */
    async logPattern(pattern) {
        if (!this.isConnected) {
            return { success: false, message: 'Not connected to Supabase' };
        }

        try {
            const record = {
                pattern_type: pattern.type,
                pattern_subtype: pattern.subtype || null,
                description: pattern.description,
                values: pattern.values,
                length: pattern.length || pattern.values.length,
                metadata: {
                    startIndex: pattern.startIndex,
                    endIndex: pattern.endIndex,
                    min: pattern.min,
                    max: pattern.max,
                    range: pattern.range,
                    average: pattern.average,
                    previousSequence: pattern.previousSequence
                },
                detected_at: new Date().toISOString()
            };

            const { data, error } = await this.client
                .from(this.tableName)
                .insert([record])
                .select();

            if (error) throw error;

            return {
                success: true,
                message: `Pattern logged successfully (ID: ${data[0].id})`,
                data: data[0]
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to log pattern: ${error.message}`
            };
        }
    }

    /**
     * Log multiple patterns at once
     */
    async logPatterns(patterns) {
        if (!this.isConnected) {
            return { success: false, message: 'Not connected to Supabase' };
        }

        if (!patterns || patterns.length === 0) {
            return { success: false, message: 'No patterns to log' };
        }

        try {
            const records = patterns.map(pattern => ({
                pattern_type: pattern.type,
                pattern_subtype: pattern.subtype || null,
                description: pattern.description,
                values: pattern.values,
                length: pattern.length || pattern.values.length,
                metadata: {
                    startIndex: pattern.startIndex,
                    endIndex: pattern.endIndex,
                    min: pattern.min,
                    max: pattern.max,
                    range: pattern.range,
                    average: pattern.average,
                    previousSequence: pattern.previousSequence
                },
                detected_at: new Date().toISOString()
            }));

            const { data, error } = await this.client
                .from(this.tableName)
                .insert(records)
                .select();

            if (error) throw error;

            return {
                success: true,
                message: `${data.length} pattern(s) logged successfully`,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to log patterns: ${error.message}`
            };
        }
    }

    /**
     * Get recent patterns from database
     */
    async getRecentPatterns(limit = 50) {
        if (!this.isConnected) {
            return { success: false, message: 'Not connected to Supabase' };
        }

        try {
            const { data, error } = await this.client
                .from(this.tableName)
                .select('*')
                .order('detected_at', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return {
                success: true,
                data: data,
                count: data.length
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to fetch patterns: ${error.message}`
            };
        }
    }

    /**
     * Get patterns by type
     */
    async getPatternsByType(type, limit = 50) {
        if (!this.isConnected) {
            return { success: false, message: 'Not connected to Supabase' };
        }

        try {
            const { data, error } = await this.client
                .from(this.tableName)
                .select('*')
                .eq('pattern_type', type)
                .order('detected_at', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return {
                success: true,
                data: data,
                count: data.length
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to fetch patterns: ${error.message}`
            };
        }
    }

    /**
     * Get statistics from logged patterns
     */
    async getStatistics() {
        if (!this.isConnected) {
            return { success: false, message: 'Not connected to Supabase' };
        }

        try {
            const { data, error } = await this.client
                .from(this.tableName)
                .select('pattern_type, pattern_subtype');

            if (error) throw error;

            // Calculate statistics
            const typeCount = {};
            data.forEach(record => {
                const type = record.pattern_type;
                typeCount[type] = (typeCount[type] || 0) + 1;
            });

            return {
                success: true,
                totalPatterns: data.length,
                patternTypes: typeCount
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to get statistics: ${error.message}`
            };
        }
    }

    /**
     * Delete old patterns (optional cleanup)
     */
    async deleteOldPatterns(daysOld = 30) {
        if (!this.isConnected) {
            return { success: false, message: 'Not connected to Supabase' };
        }

        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);

            const { data, error } = await this.client
                .from(this.tableName)
                .delete()
                .lt('detected_at', cutoffDate.toISOString())
                .select();

            if (error) throw error;

            return {
                success: true,
                message: `Deleted ${data.length} old pattern(s)`,
                deletedCount: data.length
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to delete patterns: ${error.message}`
            };
        }
    }

    /**
     * Check connection status
     */
    isReady() {
        return this.isConnected;
    }
}

// Make available globally
window.SupabaseLogger = SupabaseLogger;
