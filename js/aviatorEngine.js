/**
 * AviatorEngine - Master integration engine for 100% accurate pattern matching
 * Combines font detection, screen capture, and pattern matching
 */

class AviatorEngine {
    constructor() {
        this.fontDetector = new FontDetector();
        this.screenCapture = new ScreenCapture();
        this.patternMatcher = new PatternMatcher();
        this.gameWindow = null;
        this.isInitialized = false;
        this.mode = 'manual'; // 'manual' or 'automatic'
        this.extractedSequence = [];
        this.listeners = {
            onInitialized: [],
            onValueCaptured: [],
            onPatternDetected: [],
            onError: [],
            onStatusChange: []
        };
    }

    /**
     * Initialize the engine with game window
     */
    async initialize(gameWindow, mode = 'manual') {
        try {
            this.gameWindow = gameWindow;
            this.mode = mode;

            // Setup screen capture listeners
            this.setupScreenCaptureListeners();

            // Setup font detector
            if (!this.fontDetector) {
                this.fontDetector = new FontDetector();
            }

            this.isInitialized = true;
            this.emit('onInitialized', {
                mode: mode,
                gameWindow: gameWindow,
                timestamp: Date.now()
            });

            return true;
        } catch (error) {
            this.emit('onError', `Initialization failed: ${error.message}`);
            return false;
        }
    }

    /**
     * Setup screen capture event listeners
     */
    setupScreenCaptureListeners() {
        this.screenCapture.on('onFrameCapture', (data) => {
            this.processFrame(data);
        });

        this.screenCapture.on('onCaptureStart', () => {
            this.emit('onStatusChange', { status: 'capturing' });
        });

        this.screenCapture.on('onCaptureStop', () => {
            this.emit('onStatusChange', { status: 'idle' });
        });

        this.screenCapture.on('onError', (error) => {
            this.emit('onError', error);
        });
    }

    /**
     * Start automatic capture and detection
     */
    async startAutoCapture(multiplierX = null, multiplierY = null, multiplierWidth = 200, multiplierHeight = 100) {
        if (!this.isInitialized) {
            this.emit('onError', 'Engine not initialized');
            return false;
        }

        try {
            return await this.screenCapture.startCapture(
                this.gameWindow,
                multiplierX,
                multiplierY,
                multiplierWidth,
                multiplierHeight
            );
        } catch (error) {
            this.emit('onError', `Failed to start auto capture: ${error.message}`);
            return false;
        }
    }

    /**
     * Stop automatic capture
     */
    stopAutoCapture() {
        this.screenCapture.stopCapture();
    }

    /**
     * Process captured frame
     */
    async processFrame(frameData) {
        try {
            // Extract multiplier value from frame
            const detectedValue = this.fontDetector.extractFromCanvas(frameData.canvas);

            if (detectedValue && detectedValue.score > 0.75) {
                // High confidence detection
                this.onValueDetected(detectedValue.value, detectedValue.confidence, 'auto');
            }
        } catch (error) {
            console.error('Frame processing error:', error);
        }
    }

    /**
     * Add value manually (for manual mode or testing)
     */
    addValue(value, confidence = 1.0) {
        if (typeof value !== 'number' || value < 0) {
            this.emit('onError', 'Invalid value');
            return false;
        }

        return this.onValueDetected(value, confidence, 'manual');
    }

    /**
     * Handle detected value
     */
    onValueDetected(value, confidence, source) {
        try {
            // Add to pattern matcher
            this.patternMatcher.addValue(value);

            // Track in extracted sequence
            this.extractedSequence.push({
                value: value,
                confidence: confidence,
                source: source,
                timestamp: Date.now()
            });

            // Get detected patterns
            const patterns = this.patternMatcher.getPatterns();

            this.emit('onValueCaptured', {
                value: value,
                confidence: confidence,
                source: source,
                patterns: patterns,
                sequenceLength: this.extractedSequence.length,
                timestamp: Date.now()
            });

            // Emit pattern detection event if patterns found
            if (patterns.length > 0) {
                this.emit('onPatternDetected', {
                    patterns: patterns,
                    latestValue: value,
                    timestamp: Date.now()
                });
            }

            return true;
        } catch (error) {
            this.emit('onError', `Error processing value: ${error.message}`);
            return false;
        }
    }

    /**
     * Add bulk values at once
     */
    addBulkValues(values) {
        if (!Array.isArray(values)) {
            this.emit('onError', 'Values must be an array');
            return false;
        }

        try {
            this.patternMatcher.addBulkValues(values);

            for (const value of values) {
                this.extractedSequence.push({
                    value: value,
                    confidence: 1.0,
                    source: 'bulk',
                    timestamp: Date.now()
                });
            }

            const patterns = this.patternMatcher.getPatterns();

            this.emit('onValueCaptured', {
                valuesCount: values.length,
                patterns: patterns,
                sequenceLength: this.extractedSequence.length,
                timestamp: Date.now()
            });

            return true;
        } catch (error) {
            this.emit('onError', `Error adding bulk values: ${error.message}`);
            return false;
        }
    }

    /**
     * Analyze current sequence
     */
    analyzeSequence() {
        const stats = this.patternMatcher.getStats();
        const patterns = this.patternMatcher.getPatterns();

        const analysis = {
            totalValues: stats.count,
            totalPatterns: patterns.length,
            average: stats.average,
            min: stats.min,
            max: stats.max,
            median: stats.median,
            sequenceLength: this.extractedSequence.length,
            patterns: patterns,
            fontDetectionStats: this.fontDetector.getStatistics(),
            screenCaptureStatus: this.screenCapture.getStatus(),
            timestamp: Date.now()
        };

        return analysis;
    }

    /**
     * Get all detected patterns
     */
    getPatterns() {
        return this.patternMatcher.getPatterns();
    }

    /**
     * Get patterns by type
     */
    getPatternsByType(type) {
        return this.patternMatcher.getPatternsByType(type);
    }

    /**
     * Get recent values
     */
    getRecentValues(count = 20) {
        return this.patternMatcher.getRecentValues(count);
    }

    /**
     * Get extracted sequence
     */
    getExtractedSequence(limit = 50) {
        return this.extractedSequence.slice(-limit);
    }

    /**
     * Get font detection history
     */
    getFontDetectionHistory(limit = 20) {
        return this.fontDetector.getDetectionHistory(limit);
    }

    /**
     * Clear all data
     */
    clear() {
        this.patternMatcher.clear();
        this.fontDetector.clear();
        this.screenCapture.stopCapture();
        this.extractedSequence = [];
    }

    /**
     * Export comprehensive report
     */
    exportReport() {
        return {
            values: this.patternMatcher.export(),
            extractedSequence: this.getExtractedSequence(),
            patterns: this.getPatterns(),
            analysis: this.analyzeSequence(),
            fontDetectionStats: this.fontDetector.getStatistics(),
            screenCaptureStatus: this.screenCapture.getStatus(),
            engineStatus: {
                initialized: this.isInitialized,
                mode: this.mode,
                gameWindowOpen: this.gameWindow && !this.gameWindow.closed
            },
            timestamp: Date.now()
        };
    }

    /**
     * Register event listener
     */
    on(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event].push(callback);
        }
    }

    /**
     * Remove event listener
     */
    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }

    /**
     * Emit event
     */
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${event} listener:`, error);
                }
            });
        }
    }

    /**
     * Get engine status
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            mode: this.mode,
            gameWindowOpen: this.gameWindow && !this.gameWindow.closed,
            isCapturing: this.screenCapture.isCapturing,
            extractedValuesCount: this.extractedSequence.length,
            detectedPatternsCount: this.patternMatcher.getPatterns().length,
            fontDetectionAccuracy: this.fontDetector.getStatistics().averageConfidence,
            timestamp: Date.now()
        };
    }
}

// Make available globally
window.AviatorEngine = AviatorEngine;
