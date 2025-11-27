# VS Code Setup Guide - Monitor & Debug Aviator Pattern Matcher

## Quick Setup (3 steps)

### Step 1: Install VS Code Extensions
Press `Ctrl+Shift+X` to open Extensions, then search for and install:

1. **Live Server** (ritwickdey.LiveServer)
   - Right-click index.html → "Open with Live Server"

2. **Debugger for Chrome** (msjsdiag.debugger-for-chrome)
   - For debugging JavaScript

3. **Prettier** (esbenp.prettier-vscode)
   - For code formatting

4. **ES Lint** (dbaeumer.vscode-eslint)
   - For code linting

### Step 2: Start the Web Server
Terminal is already running on port 8000:
```bash
python -m http.server 8000
```

Or use VS Code's built-in Live Server:
- Right-click `index.html`
- Select "Open with Live Server"
- Browser opens automatically at `http://localhost:5500` or `8000`

### Step 3: View the App
Choose one option:

**Option A: View Main App**
- Open browser to `http://localhost:8000`
- Or use Live Server (right-click index.html)

**Option B: View Monitor Dashboard**
- Open browser to `http://localhost:8000/monitor.html`
- Shows live system status and patterns

**Option C: Split View in VS Code**
- Open monitor.html
- Use VS Code's split editor
- View code + preview side-by-side

---

## Debug Configuration

### Debug with Chrome
1. Press `Ctrl+Shift+D` (Debug panel)
2. Click "Chrome - Aviator Pattern Matcher"
3. Press `F5` or click green play button
4. Browser opens with debugger attached

### Debug with Firefox
1. Press `Ctrl+Shift+D`
2. Click "Firefox - Aviator Pattern Matcher"
3. Press `F5`

---

## Monitor Dashboard

Access at: `http://localhost:8000/monitor.html`

### Tabs:
1. **📊 Dashboard** - System status, patterns, statistics
2. **🎯 Application** - Embedded view of main app
3. **💻 Console** - Live console output, test controls

### Features:
- ✅ Real-time engine status
- ✅ Font detection accuracy
- ✅ Screen capture status
- ✅ Pattern detection stats
- ✅ Quick test buttons
- ✅ Sample data loader
- ✅ Report exporter

---

## Console Commands

While viewing the app in browser (F12 console):

### Test System
```javascript
window.QuickStart.runComplete();
```

### Add Values
```javascript
window.app.engine.addValue(1.50);
window.app.engine.addBulkValues([1.50, 2.30, 0.95]);
```

### Get Patterns
```javascript
window.app.engine.getPatterns();
```

### Get Analysis
```javascript
window.app.engine.analyzeSequence();
```

### Export Report
```javascript
window.app.engine.exportReport();
```

### Check Status
```javascript
window.app.engine.getStatus();
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `F5` | Start debugging |
| `Shift+F5` | Stop debugging |
| `Ctrl+Shift+D` | Open Debug panel |
| `F12` | Open browser DevTools |
| `Ctrl+Shift+X` | Extensions |
| `Ctrl+`` | Toggle terminal |
| `Ctrl+Shift+`` | New terminal |

---

## Workflow

### 1. Edit Code in VS Code
```
File → Edit → Save (Auto-save enabled)
```

### 2. View Changes in Browser
```
Browser auto-refreshes (Live Server)
```

### 3. Debug Issues
```
Press F12 → Console tab → See errors/logs
```

### 4. Monitor Progress
```
Open monitor.html → See live updates
```

### 5. Test Features
```
Run console commands or click monitor buttons
```

---

## Port Configuration

### Current Setup:
- **Web Server**: Port 8000
- **Live Server**: Port 5500 (if used)

### Change Port:
Edit `.vscode/settings.json`:
```json
"liveServer.settings.port": 8001
```

---

## File Structure in VS Code

```
template-matching-poc/
├── .vscode/
│   ├── settings.json       ← VS Code config
│   ├── launch.json         ← Debug config
│   └── extensions.json     ← Recommended extensions
├── index.html              ← Main app
├── monitor.html            ← Live dashboard
├── js/
│   ├── app.js
│   ├── fontDetector.js
│   ├── screenCapture.js
│   ├── aviatorEngine.js
│   └── ...
├── css/
│   └── styles.css
└── docs/
    ├── SETUP_GUIDE.md
    ├── START_HERE.md
    └── ...
```

---

## Troubleshooting

### Server Won't Start
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Kill process using port
taskkill /PID <PID> /F

# Restart server
python -m http.server 8000
```

### Browser Shows Blank
- Check console (F12)
- Verify all scripts loaded (Network tab)
- Refresh page (Ctrl+R)

### Debugger Won't Attach
1. Close all Chrome instances
2. VS Code will launch new instance
3. Debugger should attach

### Live Server Not Refreshing
1. Check .vscode/settings.json
2. Restart VS Code
3. Use manual browser refresh (F5)

---

## Recommended Workflow

### Development
1. Open VS Code with project
2. Open Terminal (Ctrl+`)
3. Start server: `python -m http.server 8000`
4. Open browser: `http://localhost:8000`
5. Also open monitor: `http://localhost:8000/monitor.html`
6. Edit code → auto-save → browser refreshes
7. Use F12 for debugging
8. Check monitor for system status

### Testing
1. Add test values in app
2. Watch patterns detect
3. View statistics in monitor
4. Export reports
5. Review console logs

### Debugging
1. Press F5 to start debugger
2. Add breakpoints (click line number)
3. Step through code (F10/F11)
4. Inspect variables
5. Use console for commands

---

## Quick Commands

### Start Fresh
```bash
# Terminal in VS Code
python -m http.server 8000
```

### View App
```
Browser: http://localhost:8000
```

### View Monitor
```
Browser: http://localhost:8000/monitor.html
```

### Debug
```
Press F5 (with launch.json configured)
```

### Console
```
Browser F12 → Console tab
Run: window.app.engine.getStatus()
```

---

## Tips & Tricks

1. **Split Screen**: Open monitor.html in one tab, app in another
2. **DevTools**: Press F12 to see console, network, debugger
3. **Responsive**: Monitor dashboard is fully responsive
4. **Auto-save**: Changes save automatically every 1 second
5. **Auto-refresh**: Live Server auto-refreshes browser on save
6. **Multiple Terminals**: Open multiple terminals (Ctrl+Shift+`)

---

## Next Steps

1. ✅ Install extensions (Step 1)
2. ✅ Server running on 8000 (Step 2)
3. ✅ Open browser tabs (Step 3)
4. Start developing!

---

**You're all set!** 🚀

The setup allows you to:
- Edit code in VS Code
- See changes in browser instantly
- Monitor system status live
- Debug with browser DevTools
- Run console commands
- Export reports

Enjoy! 🎉
