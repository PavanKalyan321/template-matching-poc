/**
 * PatternMatcher - Core pattern detection engine for Aviator X crash game
 * Detects various patterns including streaks, sequences, and range patterns
 */

class PatternMatcher {
    constructor() {
        this.values = [];
        this.patterns = [];
        this.thresholds = {
            high: 2.0,    // Values >= 2.0x are considered high
            medium: 1.0,  // Values >= 1.0x are considered medium
            low: 1.0      // Values < 1.0x are considered low
        };
        this.minSequenceLength = 3; // Minimum length for pattern detection
    }

    /**
     * Add a new crash value to the history
     */
    addValue(value) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error('Invalid value: must be a positive number');
        }
        this.values.push(value);
        this.detectPatterns();
        return this.values;
    }

    /**
     * Add multiple values at once
     */
    addBulkValues(values) {
        if (!Array.isArray(values)) {
            throw new Error('Values must be an array');
        }
        values.forEach(value => {
            if (typeof value === 'number' && value >= 0) {
                this.values.push(value);
            }
        });
        this.detectPatterns();
        return this.values;
    }

    /**
     * Get recent values (last n values)
     */
    getRecentValues(count = 10) {
        return this.values.slice(-count);
    }

    /**
     * Calculate statistics
     */
    getStats() {
        if (this.values.length === 0) {
            return {
                count: 0,
                average: 0,
                min: 0,
                max: 0,
                median: 0
            };
        }

        const sorted = [...this.values].sort((a, b) => a - b);
        const sum = this.values.reduce((acc, val) => acc + val, 0);

        return {
            count: this.values.length,
            average: sum / this.values.length,
            min: sorted[0],
            max: sorted[sorted.length - 1],
            median: sorted[Math.floor(sorted.length / 2)]
        };
    }

    /**
     * Classify a value as high, medium, or low
     */
    classifyValue(value) {
        if (value >= this.thresholds.high) return 'high';
        if (value >= this.thresholds.medium) return 'medium';
        return 'low';
    }

    /**
     * Main pattern detection logic
     */
    detectPatterns() {
        this.patterns = [];

        // Only detect patterns if we have enough values
        if (this.values.length < this.minSequenceLength) {
            return this.patterns;
        }

        // Detect different types of patterns
        this.detectStreaks();
        this.detectRepeatingSequences();
        this.detectRangePatterns();
        this.detectAlternatingPatterns();
        this.detectTrendPatterns();

        // Sort patterns by timestamp (most recent first)
        this.patterns.sort((a, b) => b.timestamp - a.timestamp);

        return this.patterns;
    }

    /**
     * Detect streaks of consecutive high or low values
     */
    detectStreaks() {
        if (this.values.length < this.minSequenceLength) return;

        let currentStreak = [];
        let currentType = null;

        for (let i = this.values.length - 1; i >= 0; i--) {
            const value = this.values[i];
            const type = this.classifyValue(value);

            if (type === currentType) {
                currentStreak.unshift({ value, index: i });
            } else {
                if (currentStreak.length >= this.minSequenceLength) {
                    this.patterns.push({
                        type: 'streak',
                        subtype: currentType,
                        values: currentStreak.map(s => s.value),
                        length: currentStreak.length,
                        startIndex: currentStreak[0].index,
                        endIndex: currentStreak[currentStreak.length - 1].index,
                        description: `${currentType.toUpperCase()} streak of ${currentStreak.length} values`,
                        timestamp: Date.now()
                    });
                }
                currentStreak = [{ value, index: i }];
                currentType = type;
            }
        }

        // Check final streak
        if (currentStreak.length >= this.minSequenceLength) {
            this.patterns.push({
                type: 'streak',
                subtype: currentType,
                values: currentStreak.map(s => s.value),
                length: currentStreak.length,
                startIndex: currentStreak[0].index,
                endIndex: currentStreak[currentStreak.length - 1].index,
                description: `${currentType.toUpperCase()} streak of ${currentStreak.length} values`,
                timestamp: Date.now()
            });
        }
    }

    /**
     * Detect repeating sequences of values
     */
    detectRepeatingSequences() {
        const minPatternLength = 2;
        const maxPatternLength = Math.floor(this.values.length / 2);

        for (let len = minPatternLength; len <= maxPatternLength; len++) {
            const recentSequence = this.values.slice(-len);
            const beforeSequence = this.values.slice(-len * 2, -len);

            if (beforeSequence.length === len) {
                const matches = this.sequencesMatch(recentSequence, beforeSequence, 0.1); // 10% tolerance

                if (matches) {
                    this.patterns.push({
                        type: 'sequence',
                        subtype: 'repeating',
                        values: recentSequence,
                        length: len,
                        description: `Repeating sequence of ${len} values detected`,
                        previousSequence: beforeSequence,
                        timestamp: Date.now()
                    });
                    break; // Found a repeating pattern, no need to check longer ones
                }
            }
        }
    }

    /**
     * Check if two sequences match within a tolerance
     */
    sequencesMatch(seq1, seq2, tolerance = 0.1) {
        if (seq1.length !== seq2.length) return false;

        for (let i = 0; i < seq1.length; i++) {
            const diff = Math.abs(seq1[i] - seq2[i]);
            const avg = (seq1[i] + seq2[i]) / 2;
            if (diff / avg > tolerance) return false;
        }
        return true;
    }

    /**
     * Detect patterns within specific ranges
     */
    detectRangePatterns() {
        const recentValues = this.values.slice(-this.minSequenceLength * 2);

        // Check if values are staying within a tight range
        if (recentValues.length >= this.minSequenceLength) {
            const min = Math.min(...recentValues);
            const max = Math.max(...recentValues);
            const range = max - min;
            const avg = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;

            // If range is less than 30% of average, it's a tight range pattern
            if (range / avg < 0.3 && recentValues.length >= this.minSequenceLength) {
                this.patterns.push({
                    type: 'range',
                    subtype: 'tight',
                    values: recentValues,
                    min: min,
                    max: max,
                    range: range,
                    average: avg,
                    description: `Tight range pattern: values between ${min.toFixed(2)}x and ${max.toFixed(2)}x`,
                    timestamp: Date.now()
                });
            }

            // Check for wide range (volatility)
            if (range / avg > 1.0 && recentValues.length >= this.minSequenceLength) {
                this.patterns.push({
                    type: 'range',
                    subtype: 'volatile',
                    values: recentValues,
                    min: min,
                    max: max,
                    range: range,
                    average: avg,
                    description: `High volatility: range of ${range.toFixed(2)}x (${min.toFixed(2)}x to ${max.toFixed(2)}x)`,
                    timestamp: Date.now()
                });
            }
        }
    }

    /**
     * Detect alternating high/low patterns
     */
    detectAlternatingPatterns() {
        if (this.values.length < this.minSequenceLength) return;

        const recentValues = this.values.slice(-6); // Check last 6 values
        const classifications = recentValues.map(v => this.classifyValue(v));

        let isAlternating = true;
        for (let i = 1; i < classifications.length; i++) {
            if (classifications[i] === classifications[i - 1]) {
                isAlternating = false;
                break;
            }
        }

        if (isAlternating && recentValues.length >= 4) {
            this.patterns.push({
                type: 'alternating',
                subtype: 'high-low',
                values: recentValues,
                length: recentValues.length,
                description: `Alternating pattern detected over ${recentValues.length} values`,
                timestamp: Date.now()
            });
        }
    }

    /**
     * Detect trend patterns (ascending or descending)
     */
    detectTrendPatterns() {
        if (this.values.length < this.minSequenceLength) return;

        const recentValues = this.values.slice(-5); // Check last 5 values

        let ascending = true;
        let descending = true;

        for (let i = 1; i < recentValues.length; i++) {
            if (recentValues[i] <= recentValues[i - 1]) ascending = false;
            if (recentValues[i] >= recentValues[i - 1]) descending = false;
        }

        if (ascending) {
            this.patterns.push({
                type: 'trend',
                subtype: 'ascending',
                values: recentValues,
                length: recentValues.length,
                description: `Ascending trend: ${recentValues[0].toFixed(2)}x → ${recentValues[recentValues.length - 1].toFixed(2)}x`,
                timestamp: Date.now()
            });
        }

        if (descending) {
            this.patterns.push({
                type: 'trend',
                subtype: 'descending',
                values: recentValues,
                length: recentValues.length,
                description: `Descending trend: ${recentValues[0].toFixed(2)}x → ${recentValues[recentValues.length - 1].toFixed(2)}x`,
                timestamp: Date.now()
            });
        }
    }

    /**
     * Get all detected patterns
     */
    getPatterns() {
        return this.patterns;
    }

    /**
     * Get patterns by type
     */
    getPatternsByType(type) {
        return this.patterns.filter(p => p.type === type);
    }

    /**
     * Clear all data
     */
    clear() {
        this.values = [];
        this.patterns = [];
    }

    /**
     * Export data as JSON
     */
    export() {
        return {
            values: this.values,
            patterns: this.patterns,
            stats: this.getStats(),
            timestamp: Date.now()
        };
    }

    /**
     * Import data from JSON
     */
    import(data) {
        if (data.values && Array.isArray(data.values)) {
            this.values = data.values;
            this.detectPatterns();
        }
    }
}

// Make available globally
window.PatternMatcher = PatternMatcher;
