/**
 * Main Application - Aviator X Pattern Matcher
 * Connects UI with PatternMatcher and SupabaseLogger
 */

class AviatorApp {
    constructor() {
        this.patternMatcher = new PatternMatcher();
        this.supabaseLogger = null;
        this.autoLog = true;
        this.enabledPatternTypes = {
            streaks: true,
            sequences: true,
            ranges: true
        };

        this.init();
    }

    async init() {
        // Initialize Supabase if config is available
        await this.initializeSupabase();

        // Setup event listeners
        this.setupEventListeners();

        // Update UI
        this.updateUI();
    }

    async initializeSupabase() {
        const statusElement = document.getElementById('supabaseStatus');

        if (typeof SUPABASE_CONFIG === 'undefined') {
            statusElement.textContent = '⚠️ Configuration Missing';
            statusElement.classList.add('error');
            this.showLogMessage('Please create config.js with your Supabase credentials', 'error');
            return;
        }

        this.supabaseLogger = new SupabaseLogger(SUPABASE_CONFIG);
        const result = await this.supabaseLogger.initialize();

        if (result.success) {
            statusElement.textContent = '✅ Connected to Supabase';
            statusElement.classList.add('connected');
            this.showLogMessage(result.message, 'success');
        } else {
            statusElement.textContent = '❌ Connection Failed';
            statusElement.classList.add('error');
            this.showLogMessage(result.message, 'error');
        }
    }

    setupEventListeners() {
        // Add single value
        document.getElementById('addValue').addEventListener('click', () => {
            this.addSingleValue();
        });

        // Enter key on input
        document.getElementById('crashValue').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addSingleValue();
            }
        });

        // Add bulk values
        document.getElementById('addBulk').addEventListener('click', () => {
            this.addBulkValues();
        });

        // Clear history
        document.getElementById('clearHistory').addEventListener('click', () => {
            this.clearHistory();
        });

        // Pattern type toggles
        document.getElementById('enableStreaks').addEventListener('change', (e) => {
            this.enabledPatternTypes.streaks = e.target.checked;
            this.updatePatternDisplay();
        });

        document.getElementById('enableSequences').addEventListener('change', (e) => {
            this.enabledPatternTypes.sequences = e.target.checked;
            this.updatePatternDisplay();
        });

        document.getElementById('enableRanges').addEventListener('change', (e) => {
            this.enabledPatternTypes.ranges = e.target.checked;
            this.updatePatternDisplay();
        });

        // Auto-log toggle
        document.getElementById('autoLog').addEventListener('change', (e) => {
            this.autoLog = e.target.checked;
        });

        // Manual log
        document.getElementById('manualLog').addEventListener('click', () => {
            this.logCurrentPatterns();
        });
    }

    addSingleValue() {
        const input = document.getElementById('crashValue');
        const value = parseFloat(input.value);

        if (isNaN(value) || value < 0) {
            alert('Please enter a valid positive number');
            return;
        }

        try {
            this.patternMatcher.addValue(value);
            input.value = '';
            this.updateUI();

            // Auto-log new patterns if enabled
            if (this.autoLog && this.supabaseLogger && this.supabaseLogger.isReady()) {
                const newPatterns = this.patternMatcher.getPatterns();
                if (newPatterns.length > 0) {
                    // Log only the most recent pattern
                    this.supabaseLogger.logPattern(newPatterns[0]);
                }
            }
        } catch (error) {
            alert('Error adding value: ' + error.message);
        }
    }

    addBulkValues() {
        const input = document.getElementById('bulkInput');
        const text = input.value.trim();

        if (!text) {
            alert('Please enter some values');
            return;
        }

        // Parse comma-separated values
        const values = text.split(',')
            .map(v => parseFloat(v.trim()))
            .filter(v => !isNaN(v) && v >= 0);

        if (values.length === 0) {
            alert('No valid values found');
            return;
        }

        try {
            this.patternMatcher.addBulkValues(values);
            input.value = '';
            this.updateUI();
            this.showLogMessage(`Added ${values.length} values`, 'success');

            // Auto-log if enabled
            if (this.autoLog && this.supabaseLogger && this.supabaseLogger.isReady()) {
                this.logCurrentPatterns();
            }
        } catch (error) {
            alert('Error adding values: ' + error.message);
        }
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all data?')) {
            this.patternMatcher.clear();
            this.updateUI();
            this.showLogMessage('History cleared', 'info');
        }
    }

    async logCurrentPatterns() {
        if (!this.supabaseLogger || !this.supabaseLogger.isReady()) {
            this.showLogMessage('Supabase not connected', 'error');
            return;
        }

        const patterns = this.patternMatcher.getPatterns();
        if (patterns.length === 0) {
            this.showLogMessage('No patterns to log', 'info');
            return;
        }

        const result = await this.supabaseLogger.logPatterns(patterns);
        this.showLogMessage(result.message, result.success ? 'success' : 'error');
    }

    updateUI() {
        this.updateValuesDisplay();
        this.updateStats();
        this.updatePatternDisplay();
    }

    updateValuesDisplay() {
        const container = document.getElementById('recentValues');
        const recentValues = this.patternMatcher.getRecentValues(20);

        if (recentValues.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #6c757d; padding: 20px;">No values yet. Add some crash values to start.</p>';
            return;
        }

        container.innerHTML = recentValues
            .reverse()
            .map(value => {
                const className = this.patternMatcher.classifyValue(value);
                return `<span class="value-chip ${className}">${value.toFixed(2)}x</span>`;
            })
            .join('');
    }

    updateStats() {
        const stats = this.patternMatcher.getStats();
        document.getElementById('totalCount').textContent = stats.count;
        document.getElementById('avgValue').textContent = stats.average.toFixed(2);
    }

    updatePatternDisplay() {
        const container = document.getElementById('patternsDisplay');
        let patterns = this.patternMatcher.getPatterns();

        // Filter based on enabled pattern types
        patterns = patterns.filter(pattern => {
            if (pattern.type === 'streak' && !this.enabledPatternTypes.streaks) return false;
            if (pattern.type === 'sequence' && !this.enabledPatternTypes.sequences) return false;
            if (pattern.type === 'range' && !this.enabledPatternTypes.ranges) return false;
            return true;
        });

        if (patterns.length === 0) {
            container.innerHTML = '<p class="no-patterns">No patterns detected yet. Add more values to start analyzing.</p>';
            return;
        }

        container.innerHTML = patterns
            .slice(0, 10) // Show only top 10 patterns
            .map(pattern => this.renderPattern(pattern))
            .join('');
    }

    renderPattern(pattern) {
        const typeClass = pattern.type;
        const icon = this.getPatternIcon(pattern.type);

        return `
            <div class="pattern-item ${typeClass}">
                <h3>${icon} ${pattern.type.toUpperCase()}: ${pattern.subtype || ''}</h3>
                <p><strong>Description:</strong> ${pattern.description}</p>
                <p><strong>Length:</strong> ${pattern.length || pattern.values.length} values</p>
                <div class="pattern-values">
                    ${pattern.values.map(v => `<span>${v.toFixed(2)}x</span>`).join('')}
                </div>
            </div>
        `;
    }

    getPatternIcon(type) {
        const icons = {
            'streak': '🔥',
            'sequence': '🔄',
            'range': '📊',
            'alternating': '⚡',
            'trend': '📈'
        };
        return icons[type] || '🎯';
    }

    showLogMessage(message, type = 'info') {
        const container = document.getElementById('logStatus');
        const messageDiv = document.createElement('div');
        messageDiv.className = `log-message ${type}`;
        messageDiv.textContent = `${new Date().toLocaleTimeString()}: ${message}`;

        container.insertBefore(messageDiv, container.firstChild);

        // Remove old messages (keep only last 5)
        while (container.children.length > 5) {
            container.removeChild(container.lastChild);
        }

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AviatorApp();
});
