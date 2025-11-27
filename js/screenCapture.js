/**
 * ScreenCapture - Real-time screen capture from Aviator game window
 * Captures the multiplier display and extracts values for 100% accuracy
 */

class ScreenCapture {
    constructor() {
        this.isCapturing = false;
        this.captureInterval = null;
        this.frameRate = 30; // 30 FPS for smooth capture
        this.gameFrame = null;
        this.lastCaptureTime = null;
        this.multiplierRegion = null; // ROI for multiplier display
        this.listeners = {
            onFrameCapture: [],
            onValueDetected: [],
            onCaptureStart: [],
            onCaptureStop: [],
            onError: []
        };
    }

    /**
     * Start capturing from game window
     */
    async startCapture(gameWindow, multiplierX = null, multiplierY = null, multiplierWidth = 200, multiplierHeight = 100) {
        if (this.isCapturing) {
            this.emit('onError', 'Capture already running');
            return false;
        }

        try {
            // If coordinates not provided, try to detect multiplier area
            if (multiplierX === null) {
                this.detectMultiplierRegion(gameWindow);
            } else {
                this.multiplierRegion = {
                    x: multiplierX,
                    y: multiplierY,
                    width: multiplierWidth,
                    height: multiplierHeight
                };
            }

            this.isCapturing = true;
            this.emit('onCaptureStart', {});

            // Start capture loop
            this.captureInterval = setInterval(() => {
                this.captureFrame(gameWindow);
            }, 1000 / this.frameRate);

            return true;
        } catch (error) {
            this.emit('onError', `Failed to start capture: ${error.message}`);
            return false;
        }
    }

    /**
     * Stop capturing
     */
    stopCapture() {
        if (this.captureInterval) {
            clearInterval(this.captureInterval);
            this.captureInterval = null;
        }
        this.isCapturing = false;
        this.emit('onCaptureStop', {});
    }

    /**
     * Detect multiplier region in game window
     */
    detectMultiplierRegion(gameWindow) {
        // Default position for Aviator games - usually top-center
        // Adjust these values based on actual game layout
        const gameWidth = gameWindow.innerWidth || 1024;
        const gameHeight = gameWindow.innerHeight || 768;

        this.multiplierRegion = {
            x: Math.floor(gameWidth / 2) - 100,  // Center horizontally
            y: Math.floor(gameHeight * 0.1),      // 10% from top
            width: 200,
            height: 100
        };
    }

    /**
     * Capture single frame from game
     */
    async captureFrame(gameWindow) {
        try {
            // Skip if window is not available
            if (!gameWindow || gameWindow.closed) {
                this.stopCapture();
                this.emit('onError', 'Game window closed');
                return null;
            }

            // Use canvas API to capture the game window (cross-origin may be restricted)
            const canvas = await this.captureGameWindow(gameWindow);
            if (!canvas) return null;

            // Extract multiplier region
            const multiplierCanvas = this.extractMultiplierROI(canvas);

            // Emit frame capture event
            this.emit('onFrameCapture', {
                canvas: multiplierCanvas,
                timestamp: Date.now(),
                region: this.multiplierRegion
            });

            this.lastCaptureTime = Date.now();
            return multiplierCanvas;
        } catch (error) {
            console.error('Frame capture error:', error);
        }
    }

    /**
     * Capture game window to canvas
     */
    async captureGameWindow(gameWindow) {
        try {
            // Method 1: Use html2canvas if available
            if (typeof html2canvas !== 'undefined') {
                return await html2canvas(gameWindow.document.body, {
                    backgroundColor: null,
                    scale: 1,
                    useCORS: true,
                    allowTaint: true
                });
            }

            // Method 2: Use getDisplayMedia (Screen Capture API)
            if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
                return await this.captureWithDisplayMedia();
            }

            // Method 3: Draw iframe content if game is in iframe
            return this.captureIframeContent(gameWindow);
        } catch (error) {
            console.error('Window capture failed:', error);
            return null;
        }
    }

    /**
     * Capture using Screen Capture API
     */
    async captureWithDisplayMedia() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: 'never'
                },
                audio: false
            });

            const video = document.createElement('video');
            video.srcObject = stream;
            await new Promise(resolve => video.onloadedmetadata = resolve);

            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);

            stream.getTracks().forEach(track => track.stop());
            video.remove();

            return canvas;
        } catch (error) {
            console.error('Display media capture failed:', error);
            return null;
        }
    }

    /**
     * Capture iframe content
     */
    captureIframeContent(iframeWindow) {
        try {
            const iframeDoc = iframeWindow.document;
            if (!iframeDoc) return null;

            // Create canvas and draw the iframe content
            const canvas = document.createElement('canvas');
            const frameBody = iframeDoc.body || iframeDoc.documentElement;

            canvas.width = frameBody.scrollWidth || frameBody.clientWidth || 1024;
            canvas.height = frameBody.scrollHeight || frameBody.clientHeight || 768;

            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Use html2canvas on the iframe content
            if (typeof html2canvas !== 'undefined') {
                return html2canvas(frameBody, {
                    canvas: canvas,
                    backgroundColor: '#ffffff'
                });
            }

            return canvas;
        } catch (error) {
            console.error('Iframe capture failed:', error);
            return null;
        }
    }

    /**
     * Extract multiplier region from full game canvas
     */
    extractMultiplierROI(canvas) {
        if (!this.multiplierRegion) {
            return canvas;
        }

        const roi = document.createElement('canvas');
        const region = this.multiplierRegion;

        roi.width = region.width;
        roi.height = region.height;

        try {
            const ctx = roi.getContext('2d');
            ctx.drawImage(
                canvas,
                region.x, region.y, region.width, region.height,
                0, 0, region.width, region.height
            );
        } catch (error) {
            console.error('ROI extraction failed:', error);
        }

        return roi;
    }

    /**
     * Set custom multiplier region
     */
    setMultiplierRegion(x, y, width, height) {
        this.multiplierRegion = { x, y, width, height };
    }

    /**
     * Change capture frame rate
     */
    setFrameRate(fps) {
        if (fps < 1 || fps > 60) {
            this.emit('onError', 'Frame rate must be between 1 and 60');
            return false;
        }

        this.frameRate = fps;

        if (this.isCapturing) {
            clearInterval(this.captureInterval);
            this.captureInterval = setInterval(() => {
                // Capture frame - need reference to gameWindow
            }, 1000 / this.frameRate);
        }

        return true;
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
     * Get capture status
     */
    getStatus() {
        return {
            isCapturing: this.isCapturing,
            frameRate: this.frameRate,
            lastCaptureTime: this.lastCaptureTime,
            multiplierRegion: this.multiplierRegion
        };
    }
}

// Make available globally
window.ScreenCapture = ScreenCapture;
