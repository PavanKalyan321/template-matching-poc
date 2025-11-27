/**
 * GameWindow - Live Aviator game integration
 * Handles connection to live game and real-time data capture
 */

class GameWindow {
    constructor() {
        this.gameWindow = null;
        this.isConnected = false;
        this.gameUrl = 'https://pin-up.game/'; // Default Aviator game URL
        this.listeners = {
            onValueCaptured: [],
            onConnectionChange: [],
            onError: []
        };
        this.capturedValues = [];
        this.lastCaptureTime = null;
        this.minValueCaptureInterval = 500; // Minimum ms between captures
    }

    /**
     * Open game window
     */
    openGameWindow(url = null) {
        try {
            const targetUrl = url || this.gameUrl;
            this.gameWindow = window.open(targetUrl, 'aviator_game', 'width=1024,height=768,scrollbars=yes');

            if (!this.gameWindow) {
                this.emit('onError', 'Could not open game window. Check popup blocker.');
                return false;
            }

            // Setup communication channel
            this.setupCommunication();
            this.isConnected = true;
            this.emit('onConnectionChange', { connected: true });
            return true;
        } catch (error) {
            this.emit('onError', `Error opening game window: ${error.message}`);
            return false;
        }
    }

    /**
     * Setup communication between game window and main window
     */
    setupCommunication() {
        window.addEventListener('message', (event) => {
            // Only accept messages from trusted sources
            if (event.origin !== window.location.origin) {
                // For cross-origin, you may need to adjust this
            }

            if (event.data && event.data.type === 'AVIATOR_VALUE') {
                this.handleGameValue(event.data.value);
            }
        });
    }

    /**
     * Handle incoming game value
     */
    handleGameValue(value) {
        // Debounce captures
        const now = Date.now();
        if (this.lastCaptureTime && now - this.lastCaptureTime < this.minValueCaptureInterval) {
            return;
        }

        this.lastCaptureTime = now;
        this.capturedValues.push({
            value: value,
            timestamp: now
        });

        this.emit('onValueCaptured', {
            value: value,
            timestamp: now,
            capturedCount: this.capturedValues.length
        });
    }

    /**
     * Send message to game window (if it supports receiving messages)
     */
    sendToGame(data) {
        if (!this.gameWindow || this.gameWindow.closed) {
            this.isConnected = false;
            this.emit('onConnectionChange', { connected: false });
            return false;
        }

        try {
            this.gameWindow.postMessage(data, window.location.origin);
            return true;
        } catch (error) {
            this.emit('onError', `Error sending message to game: ${error.message}`);
            return false;
        }
    }

    /**
     * Request current game data
     */
    requestGameData() {
        this.sendToGame({
            type: 'REQUEST_GAME_DATA',
            timestamp: Date.now()
        });
    }

    /**
     * Inject value capture script into game
     */
    injectCaptureScript() {
        if (!this.gameWindow || this.gameWindow.closed) {
            this.emit('onError', 'Game window not available');
            return false;
        }

        try {
            // This script runs in the game window context
            const captureScript = `
                (function() {
                    // Listen for crash values (adjust selectors based on actual game HTML)
                    const originalFetch = window.fetch;
                    window.fetch = function(...args) {
                        const result = originalFetch.apply(this, args);
                        result.then(response => {
                            if (args[0].includes('api') && args[0].includes('crash')) {
                                response.clone().json().then(data => {
                                    if (data.crash_value) {
                                        window.parent.postMessage({
                                            type: 'AVIATOR_VALUE',
                                            value: data.crash_value
                                        }, '*');
                                    }
                                });
                            }
                        });
                        return result;
                    };

                    // Monitor WebSocket messages
                    const originalWebSocket = window.WebSocket;
                    window.WebSocket = function(...args) {
                        const ws = new originalWebSocket(...args);
                        const originalSend = ws.send;
                        ws.addEventListener('message', (event) => {
                            try {
                                const data = JSON.parse(event.data);
                                if (data.crash_value) {
                                    window.parent.postMessage({
                                        type: 'AVIATOR_VALUE',
                                        value: data.crash_value
                                    }, '*');
                                }
                            } catch (e) {}
                        });
                        return ws;
                    };

                    console.log('Aviator pattern capture script injected');
                })();
            `;

            this.gameWindow.eval(captureScript);
            return true;
        } catch (error) {
            this.emit('onError', `Could not inject capture script: ${error.message}`);
            return false;
        }
    }

    /**
     * Check if game window is still open
     */
    isGameWindowOpen() {
        return this.gameWindow && !this.gameWindow.closed;
    }

    /**
     * Close game window
     */
    closeGameWindow() {
        if (this.gameWindow && !this.gameWindow.closed) {
            this.gameWindow.close();
        }
        this.isConnected = false;
        this.emit('onConnectionChange', { connected: false });
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
     * Get captured values
     */
    getCapturedValues() {
        return this.capturedValues;
    }

    /**
     * Clear captured values
     */
    clearCapturedValues() {
        this.capturedValues = [];
    }

    /**
     * Get connection status
     */
    getStatus() {
        return {
            isConnected: this.isConnected,
            windowOpen: this.isGameWindowOpen(),
            capturedCount: this.capturedValues.length,
            lastCaptureTime: this.lastCaptureTime
        };
    }
}

// Make available globally
window.GameWindow = GameWindow;
