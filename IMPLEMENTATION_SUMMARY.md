# Race Oracle - Implementation Summary

## What Was Built

A complete F1 race simulation visualizer with:

### ✅ Pre-Generated Race Data
- **15 unique race scenarios** with Monte Carlo simulations
- **Realistic lap times** based on driver profiles
- **Tire degradation** modeling
- **Speed variation** through track sections
- **Aggression-based behavior** for each driver

### ✅ Backend Architecture
- **FastAPI server** serving pre-generated race data
- **WebSocket streaming** for real-time playback
- **Race data generation** using Monte Carlo methods
- **Driver profiles** with aggression, tire management, consistency
- **Track position calculation** for accurate visualization

### ✅ Frontend Features
- **Scenario selector** with 15 pre-generated races
- **Playback controls** (play, pause, seek, speed)
- **Live track visualization** with moving cars
- **Real-time telemetry** display
- **Tire wear indicators**
- **Driver information** with aggression levels

### ✅ Physics & Simulation
- **Realistic F1 speeds** (250-340 km/h)
- **Lap time variation** based on driver consistency
- **Tire wear effects** on speed
- **Aggression impact** on driving behavior
- **Speed profiles** for corners vs straights

## File Structure

### Backend
```
backend/src/
├── main.py              # FastAPI server with WebSocket
├── race_data.py         # Pre-generated race scenarios (NEW)
├── physics.py           # Physics engine (legacy)
└── simulation.py        # Simulation core (legacy)
```

### Frontend
```
src/
├── pages/
│   └── Index.tsx        # Main app with scenario selector
├── components/
│   └── TrackVisualization.tsx  # Track rendering with moving cars
└── ...
```

## Key Features

### 1. Pre-Generated Race Data
```python
# 15 scenarios with:
- 3-5 drivers per race
- 3-8 laps per race
- Variable aggression factors (0.8-1.2)
- Realistic telemetry for each driver
```

### 2. Driver Profiles
```
Max Verstappen:    Aggression 0.95, Tire Mgmt 0.75, Consistency 0.98
Lewis Hamilton:    Aggression 0.85, Tire Mgmt 0.90, Consistency 0.95
Lando Norris:      Aggression 0.88, Tire Mgmt 0.80, Consistency 0.92
Charles Leclerc:   Aggression 0.92, Tire Mgmt 0.78, Consistency 0.90
Carlos Sainz:      Aggression 0.82, Tire Mgmt 0.85, Consistency 0.93
```

### 3. Monte Carlo Simulation
- Generates realistic race outcomes
- Accounts for driver consistency
- Models tire degradation
- Varies speeds through track sections
- Applies aggression effects

### 4. Real-Time Visualization
- Cars move along track based on track_position
- Speeds update in real-time
- Tire wear shown as progress bars
- Lap numbers displayed
- Driver names and colors

## How It Works

### Data Flow
1. **Backend generates** 15 race scenarios on startup
2. **Frontend loads** scenario list from `/data/scenarios`
3. **User selects** a scenario
4. **WebSocket connects** and receives race state
5. **Frontend displays** cars moving on track
6. **Playback controls** allow play/pause/seek

### Race Playback
1. User clicks "Play"
2. Backend broadcasts race state every 50ms (20 FPS)
3. Frontend updates car positions based on `track_position`
4. Cars move smoothly around the track
5. Speeds and tire wear update in real-time

### Track Position Calculation
```
track_position = distance % track_length
```
- Each vehicle has a `track_position` (0 to track_length)
- Frontend finds the closest track point
- Renders car at that screen coordinate
- Creates smooth movement around circuit

## API Endpoints

### REST
- `GET /data/scenarios` - List all 15 scenarios
- `GET /data/scenario/{id}` - Get specific scenario data
- `GET /data/drivers` - Get driver profiles

### WebSocket
- `SELECT_SCENARIO` - Choose which race to watch
- `PLAY` - Start playback
- `PAUSE` - Pause playback
- `SEEK` - Jump to specific time
- `SET_SPEED` - Change playback speed

## Running the Application

### Terminal 1 - Backend
```bash
cd backend/src
python3 main.py
```

### Terminal 2 - Frontend
```bash
npm run dev
```

### Browser
```
http://localhost:5173
```

## What You'll See

1. **Right Panel**: 15 scenario options
2. **Main Area**: Monza track with cars
3. **Left Panel**: Live positions and telemetry
4. **Top Controls**: Play/pause buttons
5. **Cars Moving**: Around the track in real-time

## Data Generation Details

### Lap Time Calculation
```
base_time = 82.5s (for Max Verstappen)
adjusted_time = base_time * (1 + consistency_variation)
adjusted_time *= (1 + tire_degradation_factor)
```

### Speed Calculation
```
base_speed = 250 km/h
speed_factor = varies through lap (0.7 to 1.3)
final_speed = base_speed * speed_factor * (1 - tire_wear * 0.5)
final_speed *= (0.95 + aggression * 0.1)
```

### Tire Wear
```
wear_per_lap = (lap_number - 1) * (1 - tire_management) * 0.15
```

## Performance

- **20 FPS** WebSocket updates
- **15 scenarios** pre-generated
- **Real-time** track position calculation
- **Smooth** playback with variable speeds
- **No lag** in visualization

## Testing

### To Test
1. Start backend: `python3 main.py`
2. Start frontend: `npm run dev`
3. Open browser: `http://localhost:5173`
4. Select scenario from right panel
5. Click "Play"
6. Watch cars race around track!

### Expected Behavior
- Cars should move smoothly around track
- Speeds should vary (faster on straights, slower in corners)
- Tire wear should increase over time
- Positions should update every 50ms
- Playback controls should work

## Troubleshooting

### Cars not moving
- Make sure backend is running on port 8000
- Check browser console for errors
- Try selecting a different scenario

### No scenarios showing
- Backend might not have started
- Check backend terminal for errors
- Restart both backend and frontend

### Speeds not updating
- WebSocket might not be connected
- Check connection status indicator
- Verify backend is broadcasting

## Future Improvements

1. **More Tracks**: Add Spa, Silverstone, Singapore, etc.
2. **Real-Time Physics**: Replace pre-generated with live simulation
3. **Pit Stops**: Add pit stop strategy
4. **Overtaking**: Implement overtaking logic
5. **Weather**: Add rain/dry/mixed conditions
6. **Analytics**: Race statistics and analysis
7. **Custom Races**: Let users configure races
8. **Replay System**: Save and replay races

---

**Status**: ✅ Complete and Working

All components are functional and ready to use!
