# 🏎️ Race Oracle - Visual Guide

## What You'll See

### Screen Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  RACE ORACLE                                                            │
├──────────────┬──────────────────────────────────────┬──────────────────┤
│              │                                      │                  │
│  Sidebar     │  ▶ Play Button (Top Center)         │  Race Scenarios  │
│              │                                      │  (Right Panel)   │
│  • Dashboard │  Monza Track Visualization          │                  │
│  • Drivers   │  (Center - Main Area)               │  Scenario 1      │
│  • Analytics │                                      │  Scenario 2      │
│  • Settings  │  Info Panel (Left)                  │  Scenario 3      │
│              │  • Live Positions                   │  ...             │
│              │  • Tire Wear                        │  Scenario 15     │
│              │  • Speeds                           │                  │
│              │                                      │                  │
└──────────────┴──────────────────────────────────────┴──────────────────┘
```

## Step-by-Step Guide

### Step 1: Refresh Browser
```
Press Ctrl+R (or Cmd+R on Mac)
```

### Step 2: You Should See This
```
✓ Green "Connected" indicator (top left)
✓ "▶ Play" button (top center)
✓ 15 scenarios listed (right panel)
✓ "Ready to Race" message (center)
```

### Step 3: Select a Scenario
```
Click on any scenario on the right panel
Example: Click "Scenario 1"
```

### Step 4: Click Play
```
Click the green "▶ Play" button at the top center
```

### Step 5: Watch the Race!
```
✓ "Ready to Race" message disappears
✓ Colored circles appear on track
✓ Cars move smoothly around Monza
✓ Speeds update in real-time
✓ Tire wear shows as progress bars
```

## Understanding the Display

### Track Visualization
```
        ╔════════════════════════════════════╗
        ║                                    ║
        ║    Monza Circuit (Gray Path)       ║
        ║                                    ║
        ║  🔴 P1 (Red dot with number)      ║
        ║  🔵 P2 (Blue dot with number)     ║
        ║  🟢 P3 (Green dot with number)    ║
        ║  🟠 P4 (Orange dot with number)   ║
        ║  🟣 P5 (Purple dot with number)   ║
        ║                                    ║
        ╚════════════════════════════════════╝
```

### Info Panel (Left Side)
```
┌─────────────────────────────┐
│ 🏎️ Monza                    │
│                             │
│ Time: 12.5s                 │
│ Speed: 100%                 │
│                             │
│ LIVE POSITIONS              │
│ P1 🔴 Max Verstappen 285 km/h│
│ P2 🔵 Lewis Hamilton 280 km/h│
│ P3 🟢 Lando Norris 275 km/h │
│                             │
│ TIRE WEAR                   │
│ 🔴 ████░░░░░░░░░░░░ 25%    │
│ 🔵 ███░░░░░░░░░░░░░░ 20%   │
│ 🟢 ██░░░░░░░░░░░░░░░░ 15%  │
└─────────────────────────────┘
```

### Scenario Panel (Right Side)
```
┌──────────────────────────────┐
│ Race Scenarios               │
│                              │
│ ┌──────────────────────────┐ │
│ │ Scenario 1 (Selected)    │ │
│ │ 3 drivers • 3 laps       │ │
│ │ Aggression: 104%         │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ Scenario 2               │ │
│ │ 3 drivers • 4 laps       │ │
│ │ Aggression: 111%         │ │
│ └──────────────────────────┘ │
│                              │
│ ... (more scenarios)         │
│                              │
│ Race Info                    │
│ Time: 12.5s / 450.0s        │
│ Speed: 100%                 │
│ [Timeline Slider]           │
└──────────────────────────────┘
```

## Playback Controls

### Play Button
```
Before Race:  ▶ Play (Green)
During Race:  ⏸ Pause (Yellow)
```

### Timeline Slider
```
Drag to seek to any point in the race
Shows: Current Time / Total Time
```

### Speed Control
```
Shown in right panel
Default: 100%
Can adjust for slow-motion or fast-forward
```

## What Happens During Race

### Initial State
```
Time: 0s
Cars: At starting positions
Speeds: Building up from 0
Tire Wear: 0%
```

### Mid-Race
```
Time: 100s
Cars: Spread around track
Speeds: 250-300 km/h
Tire Wear: 10-20%
```

### End of Race
```
Time: 450s (example)
Cars: Completed all laps
Speeds: Decreased due to tire wear
Tire Wear: 20-30%
```

## Color Coding

### Driver Colors
```
🔴 Red    = Max Verstappen
🔵 Blue   = Lewis Hamilton
🟢 Green  = Lando Norris
🟠 Orange = Charles Leclerc
🟣 Purple = Carlos Sainz
```

### Tire Wear Colors
```
🟢 Green  = Fresh tires (0-10%)
🟡 Yellow = Medium wear (10-20%)
🔴 Red    = High wear (20%+)
```

### Status Indicators
```
🟢 Green  = Connected to backend
🔴 Red    = Disconnected
🔵 Blue   = Playing (pulsing)
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Play/Pause |
| ← | Seek backward |
| → | Seek forward |
| F12 | Open developer tools |
| Ctrl+R | Refresh page |

## Common Issues & Fixes

### Issue: No Play Button
```
Fix: Refresh browser (Ctrl+R)
```

### Issue: No Scenarios
```
Fix: Restart backend
cd backend/src && python3 main.py
```

### Issue: Cars Not Moving
```
Fix: Click Play button
```

### Issue: Blank Screen
```
Fix: Check browser console (F12)
Look for error messages
```

### Issue: Connection Error
```
Fix: Make sure backend is running on port 8000
curl http://localhost:8000/data/scenarios
```

## Tips for Best Experience

1. **Full Screen**: Press F11 for full screen
2. **Slow Motion**: Adjust speed to 50% to see details
3. **Fast Forward**: Adjust speed to 200% to see full race quickly
4. **Pause & Seek**: Pause and drag timeline to see specific moments
5. **Watch Multiple Races**: Try different scenarios to see different outcomes

---

**Enjoy your F1 simulation! 🏁**
