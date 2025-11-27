# Aviator Game URLs - Live Testing

## Demo Game URL (You Provided)

```
https://demo.aviatrix.bet/?cid=cricazaprod&isDemo=true&lang=en&sessionToken=
```

**Status**: ✅ Ready for testing
**Type**: Demo/Sandbox
**Mode**: Play Money
**Region**: International

---

## How to Use with Pattern Matcher

### Step 1: Copy Game URL
The URL you found is:
```
https://demo.aviatrix.bet/?cid=cricazaprod&isDemo=true&lang=en&sessionToken=
```

### Step 2: In Main App
1. Open `http://localhost:8000`
2. Click "🎮 Open Aviator Game"
3. This opens the default game
4. OR replace the URL:

```javascript
// In browser console:
await window.app.openGameWindow('https://demo.aviatrix.bet/?cid=cricazaprod&isDemo=true&lang=en&sessionToken=');
```

### Step 3: Start Capture
1. Game opens in new window
2. Click "🔴 Start Auto Capture"
3. System auto-extracts multiplier values
4. Patterns detect in real-time

### Step 4: Monitor
1. Watch monitor.html
2. See values extract
3. See patterns detect
4. Check statistics

---

## Multiplier Region Configuration

For this specific game, the multiplier display is typically:
- **Position**: Top-center of game area
- **X**: 50% from left
- **Y**: 10% from top
- **Width**: 200px
- **Height**: 100px

### If Auto-Detection Fails

Adjust region in console:
```javascript
window.app.engine.screenCapture.setMultiplierRegion(
    x,      // pixels from left
    y,      // pixels from top
    width,  // region width
    height  // region height
);

// Example for this game:
window.app.engine.screenCapture.setMultiplierRegion(100, 50, 200, 100);
```

---

## Known Game URLs

### Demo/Sandbox (Play Money)
```
https://demo.aviatrix.bet/?cid=cricazaprod&isDemo=true&lang=en&sessionToken=
```
- ✅ No real money
- ✅ Perfect for testing
- ✅ Full features
- ✅ Recommended for pattern matching testing

### Live Games (Real Money)
These require accounts and may have:
- Age restrictions
- Geographic restrictions
- Account requirements
- Real money transactions

⚠️ Use demo version for pattern matcher testing!

---

## Testing Workflow with Live Game

### Step 1: Setup (5 minutes)
```
1. Open main app: http://localhost:8000
2. Open monitor: http://localhost:8000/monitor.html
3. Set game URL (console or button)
4. Everything ready
```

### Step 2: Start Testing (Real-time)
```
1. Click "🎮 Open Aviator Game"
2. Game opens with live multipliers
3. Click "🔴 Start Auto Capture"
4. Watch multiplier extraction
5. Watch pattern detection
6. Monitor dashboard updates
```

### Step 3: Play & Analyze
```
1. Play game normally
2. System extracts values automatically
3. Patterns detect in real-time
4. Monitor shows statistics
5. Capture continues until stopped
```

### Step 4: Stop & Export
```
1. Click "⏹ Stop Auto Capture"
2. Review all detected patterns
3. Export comprehensive report
4. Analyze results
```

---

## Accuracy Testing

### What to Verify

1. **Font Detection**
```javascript
// Check accuracy
const stats = window.app.engine.fontDetector.getStatistics();
console.log(stats.averageConfidence); // Should be 0.95+
```

2. **Value Extraction**
```javascript
// Get extracted values
const values = window.app.engine.getRecentValues(20);
console.log(values); // Compare with game display
```

3. **Pattern Detection**
```javascript
// Get detected patterns
const patterns = window.app.engine.getPatterns();
patterns.forEach(p => {
    console.log(p.type, p.description);
});
```

4. **Overall Accuracy**
```javascript
// Export full report
const report = window.app.engine.exportReport();
console.log(report);
```

---

## Expected Performance

### Font Detection
- **Speed**: <50ms per value
- **Accuracy**: 95%+
- **Confidence**: 0.8-1.0

### Pattern Detection
- **Streaks**: 100% accuracy
- **Sequences**: 90%+ accuracy
- **Ranges**: 95%+ accuracy
- **Trends**: 100% accuracy

### Overall
- **Detection Latency**: <100ms
- **System Accuracy**: 95%+
- **CPU Usage**: 5-15%
- **Memory**: 10-20MB

---

## Troubleshooting Live Game

### Issue: Game Won't Open
```
1. Check popup blocker
2. Try different game URL
3. Use browser URL directly
4. Check browser console for errors
```

### Issue: Multiplier Not Detected
```
1. Adjust region coordinates
2. Check game is fully loaded
3. Verify multiplier is visible
4. Check confidence threshold
```

### Issue: Wrong Values Extracted
```
1. Verify region covers multiplier
2. Check font style matches
3. Lower confidence threshold
4. Try different frame rate
```

### Issue: Patterns Not Detecting
```
1. Need minimum 3 values
2. Check pattern criteria met
3. Verify pattern types enabled
4. Run system test
```

---

## Advanced Configuration

### Change Multiplier Region

For different game layouts:
```javascript
// Get current region
const region = window.app.engine.screenCapture.status.multiplierRegion;
console.log(region);

// Find correct position:
// 1. Take screenshot
// 2. Identify multiplier area
// 3. Measure position in pixels
// 4. Set region:
window.app.engine.screenCapture.setMultiplierRegion(x, y, w, h);
```

### Adjust Frame Rate

For performance optimization:
```javascript
// Default: 30 FPS
// Change to 60 FPS (faster, more CPU)
window.app.engine.screenCapture.setFrameRate(60);

// Change to 15 FPS (slower, less CPU)
window.app.engine.screenCapture.setFrameRate(15);

// Range: 1-60 FPS
```

### Custom Detection Threshold

In aviatorEngine.js (line ~150):
```javascript
if (detectedValue.score > 0.75) {  // ← Change 0.75
    this.onValueDetected(detectedValue.value, ...);
}
```

- Higher (0.9) = stricter, fewer detections
- Lower (0.6) = lenient, more detections
- 0.75 = balanced (recommended)

---

## Live Game Session Example

### Timeline:
```
14:00 - System initialized
14:02 - Game window opened
14:03 - Auto-capture started
14:05 - Extracted: 1.50, 2.30, 0.95, 1.80, 2.45
14:06 - Patterns detected:
        - HIGH STREAK (2.30, 2.45)
        - TIGHT RANGE (1.50-1.80)
14:08 - 8 total values processed
14:09 - 3 patterns detected
14:10 - Statistics: Avg=1.76x, Min=0.95, Max=2.45
14:10 - Auto-capture stopped
14:10 - Report exported
```

---

## Best Practices

### Before Testing
1. ✅ Open app in browser
2. ✅ Open monitor dashboard
3. ✅ Check console (F12)
4. ✅ Set correct game URL
5. ✅ Verify regions configured

### During Testing
1. ✅ Play game normally
2. ✅ Don't minimize window
3. ✅ Monitor console for errors
4. ✅ Watch detection in real-time
5. ✅ Verify accuracy matches game

### After Testing
1. ✅ Stop auto-capture
2. ✅ Export report
3. ✅ Review statistics
4. ✅ Verify patterns
5. ✅ Save data if needed

---

## Expected Results

After 10 game rounds with live capture:

```
Values Extracted: 10+
Patterns Detected: 3-8
Detection Accuracy: 95%+
Font Confidence: 0.85-0.98
Processing Time: <100ms per value
CPU Usage: 5-15%
```

---

## Quick Start

### Right Now:
```
1. Open: http://localhost:8000
2. Open: http://localhost:8000/monitor.html
3. Click "🎮 Open Aviator Game"
   (Uses default or custom URL)
4. Click "🔴 Start Auto Capture"
5. Play game
6. Watch values & patterns detect
```

### Console Command:
```javascript
// If you need to use custom URL:
await window.app.openGameWindow('https://demo.aviatrix.bet/?cid=cricazaprod&isDemo=true&lang=en&sessionToken=');

// Then:
await window.app.startAutoCapture();

// Monitor in other tab: http://localhost:8000/monitor.html
```

---

## Resources

- **Main App**: http://localhost:8000
- **Monitor Dashboard**: http://localhost:8000/monitor.html
- **Game URL**: https://demo.aviatrix.bet/?cid=cricazaprod&isDemo=true&lang=en&sessionToken=
- **Documentation**: See other .md files in project
- **Console Commands**: Press F12 → Console tab

---

## Support

If issues occur:
1. Check console (F12) for errors
2. Review SETUP_GUIDE.md for troubleshooting
3. Check QUICK_REFERENCE.md for commands
4. Review this file for game-specific tips

---

**Ready to test with live games!** 🚀
