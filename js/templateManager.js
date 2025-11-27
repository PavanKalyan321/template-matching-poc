/**
 * TemplateManager - Pre-loaded pattern templates for Aviator game
 * Initializes common patterns to improve matching accuracy
 */

class TemplateManager {
    constructor() {
        this.templates = [];
        this.initialized = false;
    }

    /**
     * Initialize all built-in templates
     */
    initializeTemplates() {
        this.templates = [
            // High streak patterns (consecutive values >= 2.0x)
            {
                id: 'high_streak_3',
                name: 'High Streak (3x)',
                type: 'streak',
                subtype: 'high',
                pattern: [2.5, 2.8, 2.3],
                description: 'Three consecutive high values',
                confidence: 0.95,
                frequency: 'common'
            },
            {
                id: 'high_streak_4',
                name: 'High Streak (4x)',
                type: 'streak',
                subtype: 'high',
                pattern: [2.1, 2.4, 2.6, 2.2],
                description: 'Four consecutive high values',
                confidence: 0.90,
                frequency: 'moderate'
            },
            // Low streak patterns (consecutive values < 1.0x)
            {
                id: 'low_streak_3',
                name: 'Low Streak (3x)',
                type: 'streak',
                subtype: 'low',
                pattern: [0.5, 0.7, 0.6],
                description: 'Three consecutive low values (crash within 1.0x)',
                confidence: 0.95,
                frequency: 'common'
            },
            {
                id: 'low_streak_4',
                name: 'Low Streak (4x)',
                type: 'streak',
                subtype: 'low',
                pattern: [0.4, 0.6, 0.5, 0.7],
                description: 'Four consecutive low values',
                confidence: 0.90,
                frequency: 'moderate'
            },
            // Repeating sequences
            {
                id: 'repeating_2',
                name: 'Repeating Pair',
                type: 'sequence',
                subtype: 'repeating',
                pattern: [1.5, 2.0, 1.5, 2.0],
                description: 'Repeating pattern of 2 values',
                confidence: 0.88,
                frequency: 'moderate'
            },
            {
                id: 'repeating_3',
                name: 'Repeating Triplet',
                type: 'sequence',
                subtype: 'repeating',
                pattern: [1.2, 1.8, 2.2, 1.2, 1.8, 2.2],
                description: 'Repeating pattern of 3 values',
                confidence: 0.85,
                frequency: 'occasional'
            },
            // Range patterns - Tight range
            {
                id: 'tight_range_low',
                name: 'Tight Range (Low)',
                type: 'range',
                subtype: 'tight',
                pattern: [0.95, 1.05, 1.00, 1.02, 0.98],
                min: 0.95,
                max: 1.05,
                description: 'Values staying tightly around 1.0x',
                confidence: 0.92,
                frequency: 'common'
            },
            {
                id: 'tight_range_mid',
                name: 'Tight Range (Mid)',
                type: 'range',
                subtype: 'tight',
                pattern: [1.45, 1.55, 1.50, 1.52, 1.48],
                min: 1.45,
                max: 1.55,
                description: 'Values staying tightly around 1.5x',
                confidence: 0.92,
                frequency: 'moderate'
            },
            {
                id: 'tight_range_high',
                name: 'Tight Range (High)',
                type: 'range',
                subtype: 'tight',
                pattern: [2.45, 2.55, 2.50, 2.52, 2.48],
                min: 2.45,
                max: 2.55,
                description: 'Values staying tightly around 2.5x',
                confidence: 0.92,
                frequency: 'occasional'
            },
            // Range patterns - Volatile
            {
                id: 'volatile_range',
                name: 'High Volatility',
                type: 'range',
                subtype: 'volatile',
                pattern: [0.5, 3.2, 0.8, 2.5, 1.2],
                description: 'Wide swings between high and low values',
                confidence: 0.85,
                frequency: 'occasional'
            },
            // Alternating patterns
            {
                id: 'alternating_hl',
                name: 'Alternating High-Low',
                type: 'alternating',
                subtype: 'high-low',
                pattern: [2.5, 0.6, 2.3, 0.7, 2.4, 0.8],
                description: 'Alternating between high and low values',
                confidence: 0.87,
                frequency: 'occasional'
            },
            // Trend patterns - Ascending
            {
                id: 'ascending_mild',
                name: 'Mild Ascending Trend',
                type: 'trend',
                subtype: 'ascending',
                pattern: [1.2, 1.4, 1.6, 1.8, 2.0],
                description: 'Steady increase in values',
                confidence: 0.90,
                frequency: 'moderate'
            },
            {
                id: 'ascending_steep',
                name: 'Steep Ascending Trend',
                type: 'trend',
                subtype: 'ascending',
                pattern: [0.8, 1.2, 1.8, 2.5, 3.2],
                description: 'Rapid increase in values',
                confidence: 0.88,
                frequency: 'occasional'
            },
            // Trend patterns - Descending
            {
                id: 'descending_mild',
                name: 'Mild Descending Trend',
                type: 'trend',
                subtype: 'descending',
                pattern: [2.0, 1.8, 1.6, 1.4, 1.2],
                description: 'Steady decrease in values',
                confidence: 0.90,
                frequency: 'moderate'
            },
            {
                id: 'descending_steep',
                name: 'Steep Descending Trend',
                type: 'trend',
                subtype: 'descending',
                pattern: [3.2, 2.5, 1.8, 1.2, 0.8],
                description: 'Rapid decrease in values',
                confidence: 0.88,
                frequency: 'occasional'
            },
            // Special patterns
            {
                id: 'spike_pattern',
                name: 'Spike Pattern',
                type: 'special',
                subtype: 'spike',
                pattern: [1.0, 1.2, 5.0, 0.9, 1.1],
                description: 'Single high value surrounded by normal values',
                confidence: 0.82,
                frequency: 'occasional'
            },
            {
                id: 'crash_pattern',
                name: 'Crash Below 1x',
                type: 'special',
                subtype: 'crash',
                pattern: [0.1, 0.2, 0.15, 0.3, 0.25],
                description: 'Game crash or instant lose scenarios',
                confidence: 0.98,
                frequency: 'common'
            }
        ];

        this.initialized = true;
        return this.templates;
    }

    /**
     * Get all templates
     */
    getTemplates() {
        if (!this.initialized) {
            this.initializeTemplates();
        }
        return this.templates;
    }

    /**
     * Get templates by type
     */
    getTemplatesByType(type) {
        return this.templates.filter(t => t.type === type);
    }

    /**
     * Get templates by frequency
     */
    getTemplatesByFrequency(frequency) {
        return this.templates.filter(t => t.frequency === frequency);
    }

    /**
     * Get a template by ID
     */
    getTemplate(id) {
        return this.templates.find(t => t.id === id);
    }

    /**
     * Match a detected pattern against templates
     */
    matchPattern(detectedPattern) {
        const matches = [];

        for (const template of this.templates) {
            const score = this.calculateMatchScore(detectedPattern, template);
            if (score > 0.6) { // Threshold for match
                matches.push({
                    template: template,
                    score: score,
                    templateId: template.id,
                    templateName: template.name
                });
            }
        }

        // Sort by score descending
        matches.sort((a, b) => b.score - a.score);
        return matches;
    }

    /**
     * Calculate similarity score between detected pattern and template
     */
    calculateMatchScore(detected, template) {
        // Match based on type and subtype first
        if (detected.type !== template.type) return 0;
        if (detected.subtype && template.subtype && detected.subtype !== template.subtype) {
            return 0.3; // Partial match
        }

        // For range patterns, check min/max overlap
        if (detected.type === 'range' && template.min && template.max) {
            if (detected.min !== undefined && detected.max !== undefined) {
                const detectedRange = detected.max - detected.min;
                const templateRange = template.max - template.min;
                const overlapRatio = Math.min(detectedRange, templateRange) / Math.max(detectedRange, templateRange);
                return Math.min(0.95, 0.5 + overlapRatio * 0.45);
            }
        }

        // For value-based patterns, check sequence similarity
        if (detected.values && template.pattern) {
            const similarity = this.calculateSequenceSimilarity(
                detected.values,
                template.pattern
            );
            return Math.min(0.95, template.confidence * similarity);
        }

        return 0.7; // Default match for type-based matches
    }

    /**
     * Calculate similarity between two value sequences
     */
    calculateSequenceSimilarity(seq1, seq2) {
        if (!seq1 || !seq2 || seq1.length === 0 || seq2.length === 0) {
            return 0;
        }

        // If lengths differ significantly, lower score
        const lengthRatio = Math.min(seq1.length, seq2.length) / Math.max(seq1.length, seq2.length);
        if (lengthRatio < 0.6) return lengthRatio * 0.5; // Very different lengths

        // Compare values with tolerance
        const minLen = Math.min(seq1.length, seq2.length);
        let totalDifference = 0;

        for (let i = 0; i < minLen; i++) {
            const val1 = seq1[i];
            const val2 = seq2[i];
            const avgVal = (val1 + val2) / 2;

            if (avgVal === 0) {
                totalDifference += 0;
            } else {
                const percentDiff = Math.abs(val1 - val2) / avgVal;
                totalDifference += Math.min(1, percentDiff);
            }
        }

        const avgDifference = totalDifference / minLen;
        const similarity = Math.max(0, 1 - avgDifference);

        return similarity * lengthRatio;
    }

    /**
     * Export templates as JSON
     */
    export() {
        return {
            templates: this.templates,
            count: this.templates.length,
            initialized: this.initialized,
            timestamp: Date.now()
        };
    }

    /**
     * Clear templates
     */
    clear() {
        this.templates = [];
        this.initialized = false;
    }
}

// Make available globally
window.TemplateManager = TemplateManager;
