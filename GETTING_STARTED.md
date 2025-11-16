# 🏎️ Race Oracle - Getting Started Guide

## What is Race Oracle?

Race Oracle is an F1 race simulation visualizer that shows pre-generated Monte Carlo race scenarios with realistic driver behavior, tire degradation, and live telemetry.

## System Requirements

- **Python**: 3.10 or higher
- **Node.js**: 18 or higher
- **npm**: 9 or higher
- **Browser**: Chrome, Firefox, Safari, or Edge (modern version)

## Installation

### 1. Clone or Download the Project

```bash
git clone <repository-url>
cd race-oracle
```

### 2. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
cd ..
```

### 3. Install Node Dependencies

```bash
npm install
```

## Running the Application

### Option A: Automatic (Recommended)

```bash
./QUICK_START.sh
```

This will:
1. Start the backend on port 8000
2. Install frontend dependencies
3. Start the frontend on port 5173
4. Open the app in your browser

### Option B: Manual (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd backend/src
python3 main.py
```

Wait for:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Wait for:
```
  VITE ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

**Browser:**
Open http://localhost:5173

## Using the Application

### Step 1: Select a Scenario

On the right panel, you'll see 15 pre-generated race scenarios. Each shows:
- Scenario number
- Number of drivers (3-5)
- Number of laps (3-8)
- Aggression factor (80-120%)

Click any scenario to select it.

### Step 2: Play the Race

Click the **"▶ Play"** button at the top center to start the race.

### Step 3: Watch the Race

You'll see:
- **Track**: Monza circuit in the center
- **Cars**: Colored dots moving around the track
- **Info Panel**: Left side shows live positions, speeds, and tire wear
- **Controls**: Top center has play/pause buttons

### Step 4: Control Playback

- **Play/Pause**: Toggle race playback
- **Timeline**: Drag the slider to seek to any time
- **Speed**: Adjust playback speed (shown in right panel)

## Understanding the Display

### Track Visualization
- **Gray circuit**: Monza track layout
- **Colored circles**: Each driver (numbered P1, P2, etc.)
- **Glow effect**: Shows car position clearly

### Info Panel (Left)
- **LIVE POSITIONS**: Current driver positions and speeds
- **TIRE WEAR**: Progress bars showing tire degradation
- **Time**: Current race time and total duration

### Scenario Panel (Right)
- **Scenario list**: All 15 available races
- **Race info**: Time, speed, and timeline slider
- **Selected**: Highlighted in cyan

## Driver Information

### Drivers in the Simulation

| Driver | Aggression | Tire Mgmt | Consistency | Color |
|--------|-----------|-----------|------------|-------|
| Max Verstappen | 95% | 75% | 98% | 🔴 Red |
| Lewis Hamilton | 85% | 90% | 95% | 🔵 Blue |
| Lando Norris | 88% | 80% | 92% | 🟢 Green |
| Charles Leclerc | 92% | 78% | 90% | 🟠 Orange |
| Carlos Sainz | 82% | 85% | 93% | 🟣 Purple |

### What These Mean

**Aggression**: How hard the driver pushes
- High (95%): Faster speeds, later braking, higher risk
- Low (82%): Smoother driving, safer, more consistent

**Tire Management**: How gently they treat tires
- High (90%): Smooth inputs, less wear
- Low (75%): Aggressive, more wear

**Consistency**: How reliable they are
- High (98%): Few mistakes, predictable
- Low (78%): More variation, realistic errors

## Race Scenarios

Each scenario is unique:

### Scenario Variations
- **Drivers**: 3-5 drivers per race
- **Laps**: 3-8 laps per race
- **Aggression**: 80-120% factor affecting all drivers
- **Telemetry**: Realistic lap times and speeds

### What Happens in a Race

1. **Acceleration Phase**: Cars build up speed from start
2. **Racing**: Drivers maintain competitive speeds
3. **Tire Degradation**: Speeds decrease as tires wear
4. **Finish**: Race ends after all laps completed

## Keyboard Shortcuts

- **Space**: Play/Pause
- **Left Arrow**: Seek backward
- **Right Arrow**: Seek forward
- **1-9**: Jump to scenario 1-9

## Troubleshooting

### Backend Won't Start

**Error**: "Address already in use"
```bash
# Kill process on port 8000
lsof -i :8000
kill -9 <PID>
```

**Error**: "Python not found"
```bash
# Install Python 3.10+
# macOS: brew install python@3.10
# Ubuntu: sudo apt install python3.10
# Windows: Download from python.org
```

### Frontend Won't Start

**Error**: "npm not found"
```bash
# Install Node.js from nodejs.org
```

**Error**: "Port 5173 already in use"
```bash
# Kill process on port 5173
lsof -i :5173
kill -9 <PID>
```

### Cars Not Moving

1. Check backend is running (green "Connected" indicator)
2. Select a scenario from right panel
3. Click "Play" button
4. Wait a moment for data to load

### No Scenarios Showing

1. Restart backend: `python3 main.py`
2. Refresh browser: `Ctrl+R` or `Cmd+R`
3. Check browser console for errors: `F12`

## Tips & Tricks

### Best Scenarios to Watch
- **Scenario 0**: Good starting point, 5 drivers
- **Scenario 5**: High aggression, exciting racing
- **Scenario 10**: Mixed drivers, balanced race

### Understanding Tire Wear
- **Green**: Fresh tires, good grip
- **Yellow**: Medium wear, losing grip
- **Red**: High wear, significant speed loss

### Playback Speed
- **50%**: Slow motion, see details
- **100%**: Real-time
- **200%**: Fast forward, see full race quickly

### Timeline Seeking
- Drag slider to jump to any point in race
- Useful for seeing specific moments
- Pauses automatically when seeking

## Advanced Features

### Scenario Data

Each scenario contains:
- Driver profiles with aggression levels
- Realistic lap times
- Tire degradation curves
- Speed profiles through corners
- Telemetry for every 0.5 seconds

### Monte Carlo Simulation

The race data is generated using:
- Base lap times from real F1 data
- Driver consistency variation
- Tire wear modeling
- Speed variation through track sections
- Aggression-based behavior

### Track Data

Monza track includes:
- 5000+ coordinate points
- Real track geometry
- Distance markers
- Elevation data

## Performance

- **20 FPS**: Smooth playback
- **15 scenarios**: Pre-generated and ready
- **Real-time**: No lag or stuttering
- **Responsive**: Instant controls

## Next Steps

1. **Explore Scenarios**: Try different races
2. **Watch Replays**: Seek to interesting moments
3. **Study Drivers**: Notice aggression differences
4. **Analyze Data**: Check tire wear patterns

## Getting Help

### Check Logs

**Backend logs**: Terminal where you ran `python3 main.py`
**Frontend logs**: Browser console (`F12` → Console tab)

### Common Issues

| Issue | Solution |
|-------|----------|
| Cars not moving | Click Play button |
| No scenarios | Restart backend |
| Slow performance | Close other apps |
| Crashes | Refresh browser |

## Keyboard Controls

| Key | Action |
|-----|--------|
| Space | Play/Pause |
| ← | Seek backward |
| → | Seek forward |
| 1-9 | Jump to scenario |
| F12 | Open developer tools |

## System Information

### Tested On
- macOS 12+
- Ubuntu 20.04+
- Windows 10+
- Chrome 90+
- Firefox 88+
- Safari 14+

### Requirements
- 4GB RAM minimum
- 100MB disk space
- Stable internet (for initial load)

## Support

For issues or questions:
1. Check this guide
2. Review IMPLEMENTATION_SUMMARY.md
3. Check browser console for errors
4. Restart both backend and frontend

---

**Enjoy your F1 simulation! 🏁**

For more technical details, see:
- `README.md` - Project overview
- `IMPLEMENTATION_SUMMARY.md` - Technical details
- `backend/README.md` - API documentation
