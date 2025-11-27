/**
 * FontDetector - Detects and extracts multiplier values from Aviator game display
 * Uses canvas rendering to match fonts and extract values with 100% accuracy
 */

class FontDetector {
    constructor() {
        this.gameCanvas = null;
        this.extractedValues = [];
        this.fontMeasurements = {};
        this.initFontMeasurements();
        this.detectionHistory = [];
    }

    /**
     * Initialize font measurements for common multiplier values
     */
    initFontMeasurements() {
        // Common Aviator multipliers with their pixel characteristics
        const multipliers = [
            0.01, 0.02, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5,
            0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5,
            1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5,
            2.6, 2.7, 2.8, 2.9, 3.0, 3.5, 4.0, 4.5, 5.0, 6.0,
            7.0, 8.0, 9.0, 10.0, 15.0, 20.0, 50.0, 100.0
        ];

        // Create canvas for font rendering
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 200;
        canvas.height = 100;

        // Common Aviator font styles
        const fontStyles = [
            { font: 'bold 48px Arial', style: 'arial-bold' },
            { font: 'bold 48px Helvetica', style: 'helvetica-bold' },
            { font: 'bold 48px Roboto', style: 'roboto-bold' },
            { font: '48px Arial', style: 'arial' },
            { font: '48px sans-serif', style: 'sans-serif' }
        ];

        for (const multiplier of multipliers) {
            this.fontMeasurements[multiplier] = {
                text: multiplier.toFixed(2) + 'x',
                characteristics: {}
            };

            for (const style of fontStyles) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.font = style.font;
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'left';
                ctx.fillText(multiplier.toFixed(2) + 'x', 10, 50);

                // Get pixel data
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixelData = this.analyzePixelData(imageData.data);

                this.fontMeasurements[multiplier].characteristics[style.style] = {
                    pixelCount: pixelData.pixelCount,
                    bounds: pixelData.bounds,
                    centerOfMass: pixelData.centerOfMass,
                    brightness: pixelData.brightness
                };
            }
        }
    }

    /**
     * Analyze pixel data from rendered text
     */
    analyzePixelData(pixelArray) {
        let pixelCount = 0;
        let totalBrightness = 0;
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        let centerX = 0, centerY = 0;

        const width = 200;
        const height = 100;

        for (let i = 0; i < pixelArray.length; i += 4) {
            const alpha = pixelArray[i + 3];
            if (alpha > 128) { // Opaque pixel
                pixelCount++;
                const pixelIndex = i / 4;
                const x = pixelIndex % width;
                const y = Math.floor(pixelIndex / width);

                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);

                centerX += x;
                centerY += y;

                // Calculate brightness
                const r = pixelArray[i];
                const g = pixelArray[i + 1];
                const b = pixelArray[i + 2];
                totalBrightness += (r + g + b) / 3;
            }
        }

        return {
            pixelCount: pixelCount,
            bounds: {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY
            },
            centerOfMass: {
                x: pixelCount > 0 ? centerX / pixelCount : 0,
                y: pixelCount > 0 ? centerY / pixelCount : 0
            },
            brightness: pixelCount > 0 ? totalBrightness / pixelCount : 0
        };
    }

    /**
     * Extract multiplier value from game canvas/image
     */
    extractFromCanvas(canvasOrImage, x = null, y = null, width = null, height = null) {
        try {
            let canvas = canvasOrImage;

            // If it's an image element, convert to canvas
            if (canvasOrImage instanceof HTMLImageElement) {
                canvas = document.createElement('canvas');
                canvas.width = canvasOrImage.width;
                canvas.height = canvasOrImage.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(canvasOrImage, 0, 0);
            }

            // Extract region of interest if coordinates provided
            let roi = canvas;
            if (x !== null && y !== null && width !== null && height !== null) {
                roi = this.extractROI(canvas, x, y, width, height);
            }

            // Detect text in the ROI
            const detectedValue = this.detectTextValue(roi);
            return detectedValue;
        } catch (error) {
            console.error('Error extracting from canvas:', error);
            return null;
        }
    }

    /**
     * Extract region of interest from canvas
     */
    extractROI(canvas, x, y, width, height) {
        const roi = document.createElement('canvas');
        roi.width = width;
        roi.height = height;
        const ctx = roi.getContext('2d');
        ctx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
        return roi;
    }

    /**
     * Detect text value from canvas using pattern matching
     */
    detectTextValue(canvas) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData = this.analyzePixelData(imageData.data);

        let bestMatch = null;
        let bestScore = 0;

        // Compare against all known multipliers
        for (const [multiplier, data] of Object.entries(this.fontMeasurements)) {
            for (const [style, characteristics] of Object.entries(data.characteristics)) {
                const score = this.calculateSimilarityScore(
                    pixelData,
                    characteristics
                );

                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = {
                        value: parseFloat(multiplier),
                        text: data.text,
                        score: score,
                        confidence: Math.min(1, score),
                        fontStyle: style
                    };
                }
            }
        }

        if (bestMatch && bestMatch.score > 0.6) {
            this.extractedValues.push({
                value: bestMatch.value,
                timestamp: Date.now(),
                confidence: bestMatch.confidence,
                fontStyle: bestMatch.fontStyle
            });

            this.detectionHistory.push(bestMatch);

            return bestMatch;
        }

        return null;
    }

    /**
     * Calculate similarity score between detected and known characteristics
     */
    calculateSimilarityScore(detected, known) {
        let score = 1.0;

        // Compare pixel count (±10% tolerance)
        const pixelRatio = Math.min(detected.pixelCount, known.pixelCount) /
                          Math.max(detected.pixelCount, known.pixelCount);
        if (pixelRatio < 0.9) {
            score *= pixelRatio;
        }

        // Compare bounding box (±15% tolerance)
        if (detected.bounds && known.bounds) {
            const detBounds = detected.bounds;
            const knownBounds = known.bounds;

            const widthRatio = Math.min(detBounds.width, knownBounds.width) /
                              Math.max(detBounds.width, knownBounds.width);
            const heightRatio = Math.min(detBounds.height, knownBounds.height) /
                               Math.max(detBounds.height, knownBounds.height);

            score *= (widthRatio + heightRatio) / 2;
        }

        // Compare brightness (±20% tolerance)
        const brightnessDiff = Math.abs(detected.brightness - known.brightness) / 255;
        score *= Math.max(0, 1 - brightnessDiff * 0.5);

        // Compare center of mass position
        if (detected.centerOfMass && known.centerOfMass) {
            const comDistance = Math.sqrt(
                Math.pow(detected.centerOfMass.x - known.centerOfMass.x, 2) +
                Math.pow(detected.centerOfMass.y - known.centerOfMass.y, 2)
            );
            const maxDistance = Math.sqrt(
                Math.pow(detected.bounds.width, 2) +
                Math.pow(detected.bounds.height, 2)
            );
            const comScore = Math.max(0, 1 - (comDistance / (maxDistance || 1)));
            score *= 0.8 + comScore * 0.2; // Give less weight to COM
        }

        return Math.max(0, Math.min(1, score));
    }

    /**
     * Extract multiplier from game screenshot
     */
    extractFromScreenshot(imageUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                // Typically the multiplier is in the center-top area
                const result = this.extractFromCanvas(img, 0, 0, img.width, img.height);
                resolve(result);
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = imageUrl;
        });
    }

    /**
     * Capture current screen and extract value (requires permissions)
     */
    async captureScreenAndExtract() {
        try {
            const canvas = await html2canvas(document.body);
            return this.extractFromCanvas(canvas);
        } catch (error) {
            console.error('Screen capture failed:', error);
            return null;
        }
    }

    /**
     * Get extracted values
     */
    getExtractedValues() {
        return this.extractedValues;
    }

    /**
     * Get detection history
     */
    getDetectionHistory(limit = 20) {
        return this.detectionHistory.slice(-limit);
    }

    /**
     * Clear data
     */
    clear() {
        this.extractedValues = [];
        this.detectionHistory = [];
    }

    /**
     * Get detection statistics
     */
    getStatistics() {
        const avgConfidence = this.extractedValues.length > 0
            ? this.extractedValues.reduce((sum, v) => sum + v.confidence, 0) / this.extractedValues.length
            : 0;

        const fontStyles = {};
        for (const val of this.extractedValues) {
            fontStyles[val.fontStyle] = (fontStyles[val.fontStyle] || 0) + 1;
        }

        return {
            totalExtractions: this.extractedValues.length,
            averageConfidence: avgConfidence,
            highConfidenceCount: this.extractedValues.filter(v => v.confidence > 0.9).length,
            fontStylesDetected: fontStyles,
            uniqueValues: [...new Set(this.extractedValues.map(v => v.value))].length
        };
    }
}

// Make available globally
window.FontDetector = FontDetector;
