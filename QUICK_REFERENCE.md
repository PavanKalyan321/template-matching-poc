# Aviator Pattern Matcher - Quick Reference Card

## 🚀 Getting Started (30 seconds)

```bash
1. Open index.html in browser
2. Open browser console (F12)
3. See system initialization messages
4. You're ready to go!
```

---

## 🎮 Using the System

### Option A: Manual Testing
```javascript
// Add values one by one
window.app.engine.addValue(1.50);
window.app.engine.addValue(2.30);
window.app.engine.addValue(0.95);

// See patterns
window.app.engine.getPatterns();
```

### Option B: Bulk Import
```javascript
// Add many values at once
const values = [1.50, 2.30, 0.95, 1.80, 2.45];
window.app.engine.addBulkValues(values);
```

### Option C: Live Game Capture
```javascript
// Open game window
await window.app.openGameWindow();

// Start capturing
await window.app.startAutoCapture();

// Stop when done
window.app.stopAutoCapture();
```

### Option D: UI Buttons
```
Just click the buttons in the interface:
- 🎮 Open Aviator Game
- 🔴 Start Auto Capture
- ⏹ Stop Auto Capture
- Add Value / Add Bulk
```

---

## 📊 Getting Analysis

```javascript
// Get detected patterns
const patterns = window.app.engine.getPatterns();
patterns.forEach(p => {
    console.log(`${p.type}: ${p.description}`);
});

// Get full analysis
const analysis = window.app.engine.analyzeSequence();
console.log(`Total: ${analysis.totalValues}`);
console.log(`Average: ${analysis.average.toFixed(2)}x`);
console.log(`Patterns: ${analysis.totalPatterns}`);

// Export everything
const report = window.app.engine.exportReport();
console.log(JSON.stringify(report, null, 2));
```

---

## 🔤 Font Detection

```javascript
// Check detection stats
const stats = window.app.engine.fontDetector.getStatistics();
console.log(`Confidence: ${(stats.averageConfidence * 100).toFixed(1)}%`);
console.log(`Detections: ${stats.totalExtractions}`);

// View detection history
const history = window.app.engine.fontDetector.getDetectionHistory(5);
history.forEach(h => {
    console.log(`${h.value.toFixed(2)}x (${(h.score * 100).toFixed(1)}%)`);
});
```

---

## ⚙️ Configuration

```javascript
// Change multiplier region (x, y, width, height)
window.app.engine.screenCapture.setMultiplierRegion(100, 50, 300, 120);

// Change capture frame rate (1-60 FPS)
window.app.engine.screenCapture.setFrameRate(30);

// Get current status
const status = window.app.engine.getStatus();
console.log(status);
```

---

## 📈 Pattern Types

| Pattern | Meaning | Example |
|---------|---------|---------|
| **STREAK** | 3+ same values | 2.5, 2.8, 2.3 (HIGH) |
| **SEQUENCE** | Repeating | 1.5, 2.0, 1.5, 2.0 |
| **RANGE** | Values in narrow band | 1.48, 1.50, 1.52 |
| **ALTERNATING** | High-Low-High | 2.5, 0.6, 2.3, 0.7 |
| **TREND** | Rising/falling | 1.0, 1.2, 1.5, 1.8 |

---

## 🎯 Value Classifications

| Class | Range | Example |
|-------|-------|---------|
| **HIGH** | ≥2.0x | 2.5x, 3.0x, 5.0x |
| **MEDIUM** | 1.0-2.0x | 1.5x, 1.8x, 1.9x |
| **LOW** | <1.0x | 0.5x, 0.8x, 0.9x |

---

## 💾 Data Export

```javascript
// Export as JSON
const data = {
    values: window.app.engine.getRecentValues(),
    patterns: window.app.engine.getPatterns(),
    analysis: window.app.engine.analyzeSequence()
};
const json = JSON.stringify(data, null, 2);
console.log(json);

// Copy to clipboard
copy(json);

// Save to file (requires file download)
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'patterns.json';
a.click();
```

---

## 🔄 Event Listeners

```javascript
// Listen for detected values
window.app.engine.on('onValueCaptured', (data) => {
    console.log(`Value: ${data.value}, Confidence: ${data.confidence}`);
});

// Listen for patterns
window.app.engine.on('onPatternDetected', (data) => {
    console.log(`Found ${data.patterns.length} patterns!`);
});

// Listen for status changes
window.app.engine.on('onStatusChange', (status) => {
    console.log(`Status: ${status.status}`);
});

// Listen for errors
window.app.engine.on('onError', (error) => {
    console.error(`Error: ${error}`);
});
```

---

## 🧪 Testing

```javascript
// Quick test with data
const testData = [1.50, 2.30, 0.95, 1.80, 2.45];
window.app.engine.addBulkValues(testData);

// Verify patterns detected
const patterns = window.app.engine.getPatterns();
console.log(`✅ ${patterns.length} patterns detected`);

// Check accuracy
const stats = window.app.engine.fontDetector.getStatistics();
console.log(`✅ Font detection: ${(stats.averageConfidence * 100).toFixed(1)}%`);
```

---

## 🐛 Troubleshooting

```javascript
// Check if system ready
if (!window.app) {
    console.error('App not initialized');
}

// Verify engine
if (!window.app.engine.isInitialized) {
    console.error('Engine not initialized');
}

// Check game window
if (!window.app.gameWindow || window.app.gameWindow.closed) {
    console.error('Game window closed');
}

// View full status
console.log(window.app.engine.getStatus());

// Export report for debugging
console.log(window.app.engine.exportReport());
```

---

## 📞 Common Commands

```javascript
// Clear all data
window.app.engine.clear();

// Get recent values (last 20)
window.app.engine.getRecentValues(20);

// Get patterns by type
window.app.engine.getPatternsByType('streak');
window.app.engine.getPatternsByType('sequence');
window.app.engine.getPatternsByType('range');

// Get extraction sequence
window.app.engine.getExtractedSequence(50);

// Get all system info
console.table(window.app.engine.getStatus());

// Get full analysis
console.table(window.app.engine.analyzeSequence());
```

---

## 🎬 Complete Workflow Example

```javascript
// 1. Add test data
const testValues = [
    1.50, 2.30, 0.95, 1.80, 2.45,
    1.20, 3.10, 0.50, 2.15, 1.85
];
window.app.engine.addBulkValues(testValues);

// 2. Get analysis
const analysis = window.app.engine.analyzeSequence();
console.log(`Analyzed ${analysis.totalValues} values`);
console.log(`Found ${analysis.totalPatterns} patterns`);

// 3. Show patterns
const patterns = window.app.engine.getPatterns();
patterns.forEach((p, i) => {
    console.log(`${i+1}. ${p.type.toUpperCase()}: ${p.description}`);
});

// 4. Get stats
const stats = window.app.engine.fontDetector.getStatistics();
console.log(`Detection confidence: ${(stats.averageConfidence * 100).toFixed(1)}%`);

// 5. Export
const report = window.app.engine.exportReport();
console.log('Full report:', report);
```

---

## 📱 UI Button Commands

| Button | Action |
|--------|--------|
| Add Value | `window.app.addSingleValue()` |
| Add Bulk Values | `window.app.addBulkValues()` |
| Clear History | `window.app.clearHistory()` |
| 🎮 Open Game | `window.app.openGameWindow()` |
| 🔴 Start Capture | `window.app.startAutoCapture()` |
| ⏹ Stop Capture | `window.app.stopAutoCapture()` |
| Log Patterns | `window.app.logCurrentPatterns()` |

---

## ✅ System Check

```javascript
// Run this to verify everything works:
console.log('✓ App:', !!window.app);
console.log('✓ Engine:', !!window.app.engine);
console.log('✓ FontDetector:', !!window.app.engine.fontDetector);
console.log('✓ ScreenCapture:', !!window.app.engine.screenCapture);
console.log('✓ PatternMatcher:', !!window.app.engine.patternMatcher);
console.log('Status:', window.app.engine.getStatus());
```

---

## 📚 Full Documentation

- **SETUP_GUIDE.md** - Complete setup & configuration
- **IMPLEMENTATION_SUMMARY.md** - Architecture & features
- **QUICK_REFERENCE.md** - This file

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: Production Ready ✅
