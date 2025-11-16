# Race Oracle - Quick Start Guide

## Prerequisites

- Python 3.10+ installed
- Node.js 18+ installed
- Terminal/Command line access

## Step-by-Step Setup

### 1. Install Backend Dependencies

Open a terminal and run:

```bash
cd backend
pip install -r requirements.txt
```

### 2. Start the Backend Server

In the same terminal (from the `backend` directory):

```bash
cd src
python main.py
```

You should see:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Keep this terminal open!**

### 3. Install Frontend Dependencies

Open a **new terminal** window and run:

```bash
npm install
```

### 4. Start the Frontend

In the same terminal:

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### 5. Open the Application

Open your browser and go to: **http://localhost:5173**

### 6. Run Your First Simulation

1. You'll see a configuration modal
2. Set the number of AI agents (try 5)
3. Click "Start Simulation"
4. Watch the drivers race around Monza!

## What You Should See

- **Track**: Gray circuit outline (Monza)
- **Drivers**: 5 colored dots moving around the track
- **Info Panel**: Shows driver names and speeds
- **Real-time Updates**: Positions update ~20 times per second

## Troubleshooting

### Backend won't start
- Make sure Python 3.10+ is installed: `python --version`
- Install dependencies: `pip install -r backend/requirements.txt`
- Check if port 8000 is available

### Frontend shows "Backend not connected"
- Make sure the backend is running on port 8000
- Check the backend terminal for errors
- Try refreshing the browser

### No drivers visible
- Check the browser console (F12) for errors
- Make sure you clicked "Start Simulation"
- Verify the backend terminal shows WebSocket connection

## Testing the Features

### Change Weather
In the browser console (F12), run:
```javascript
// This will be added to the UI later
```

### Adjust Chaos Level
Higher chaos = more random events (mechanical failures, spins)

### Watch Tire Wear
Each driver's tire wear increases over time, affecting their speed

## Next Steps

- Explore the code in `backend/src/physics.py` to see the simulation logic
- Check `src/components/TrackVisualization.tsx` for the rendering
- Modify driver profiles in `backend/src/main.py`
- Add more tracks by creating JSON files in `public/tracks/`

## Need Help?

Check the main README.md for architecture details and the backend/README.md for API documentation.
