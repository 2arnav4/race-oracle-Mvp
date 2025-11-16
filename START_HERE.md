# 🏎️ Race Oracle - Quick Start

## Step 1: Start the Backend

Open a terminal and run:

```bash
cd backend/src
python3 main.py
```

You should see:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Keep this terminal open!**

## Step 2: Start the Frontend

Open a **NEW** terminal and run:

```bash
npm run dev
```

You should see:
```
  VITE ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

## Step 3: Open the App

Go to: **http://localhost:5173**

## Step 4: Configure and Run

1. **Configure the simulation** using the right panel:
   - Select circuit (Monza is loaded)
   - Choose weather (Dry/Wet)
   - Select tire compound (Soft/Medium/Hard)
   - Set number of drivers (2-5)
   - Adjust chaos level (0-100%)

2. **Click "START SIMULATION"** button at the bottom of the config panel

3. **Watch the race!** You'll see:
   - Drivers moving around the track
   - Live speeds and positions
   - Tire wear indicators
   - Real-time telemetry

## Controls

- **Start/Stop**: Use the button in the config panel or top center
- **Change Settings**: Modify any setting and click "RESTART SIMULATION"
- **Weather**: Switch between Dry/Wet to see grip changes
- **Chaos**: Higher values = more random events (spins, failures)

## What You're Seeing

- **Colored dots**: Each driver (with position number)
- **Track**: Gray circuit outline (Monza)
- **Info panel**: Live positions, speeds, and tire wear
- **Connection status**: Top left shows if backend is connected

## Troubleshooting

### "Backend not connected"
- Make sure the Python backend is running on port 8000
- Check the backend terminal for errors

### Drivers not moving
- Click "START SIMULATION" in the config panel
- Check browser console (F12) for errors
- Restart both backend and frontend

### Simulation too fast/slow
- This is normal - the simulation runs at real-time physics
- Cars accelerate from 0 and reach racing speeds (~250-300 km/h)

## Tips

- **Soft tires**: Faster but wear out quickly
- **Hard tires**: Slower but last longer
- **Wet weather**: Reduces grip significantly
- **High chaos**: More exciting but unpredictable!

Enjoy your F1 simulation! 🏁
