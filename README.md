# 🏎️ Race Oracle - F1 Simulation Visualizer

A real-time Formula 1 race simulation visualizer with pre-generated Monte Carlo race scenarios, AI driver personalities, and live telemetry.

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### 1. Start Backend

```bash
cd backend/src
python3 main.py
```

You should see:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 2. Start Frontend

Open a **new terminal**:

```bash
npm install  # First time only
npm run dev
```

You should see:
```
  VITE ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### 3. Open Browser

Go to: **http://localhost:5173**

## 🎮 How to Use

1. **Select a Scenario** - Choose from 15 pre-generated race scenarios on the right panel
2. **Click Play** - Start the race simulation
3. **Watch the Race** - See drivers racing around Monza with realistic physics
4. **Adjust Playback** - Use the timeline to seek, pause, or change speed

## 📊 What You'll See

- **Track Visualization**: Monza circuit with real coordinates
- **Live Positions**: All drivers with current speeds and lap numbers
- **Tire Wear**: Real-time tire degradation visualization
- **Driver Info**: Names, aggression levels, and performance metrics
- **Playback Controls**: Play, pause, seek, and speed adjustment

## 🏁 Features

### Pre-Generated Race Data
- **15 unique race scenarios** with different configurations
- **Monte Carlo simulations** for realistic race outcomes
- **Variable driver counts** (3-5 drivers per scenario)
- **Variable lap counts** (3-8 laps per scenario)
- **Aggression factors** affecting driver behavior

### Driver Profiles
Each driver has unique characteristics:

| Driver | Aggression | Tire Mgmt | Consistency |
|--------|-----------|-----------|------------|
| Max Verstappen | 0.95 | 0.75 | 0.98 |
| Lewis Hamilton | 0.85 | 0.90 | 0.95 |
| Lando Norris | 0.88 | 0.80 | 0.92 |
| Charles Leclerc | 0.92 | 0.78 | 0.90 |
| Carlos Sainz | 0.82 | 0.85 | 0.93 |

### Physics Simulation
- **Realistic lap times** based on driver profiles
- **Tire degradation** affecting speed over time
- **Speed variation** through corners and straights
- **Aggression effects** on driving behavior
- **Consistency variation** for realistic mistakes

## 📁 Project Structure

```
race-oracle/
├── backend/
│   ├── src/
│   │   ├── main.py              # FastAPI server
│   │   ├── race_data.py         # Pre-generated race scenarios
│   │   ├── physics.py           # Physics engine (legacy)
│   │   └── simulation.py        # Simulation core (legacy)
│   ├── requirements.txt
│   └── README.md
├── src/
│   ├── components/
│   │   ├── TrackVisualization.tsx
│   │   └── ConfigPanel.tsx
│   ├── pages/
│   │   └── Index.tsx
│   └── ...
├── public/
│   └── tracks/
│       └── monza_track.json
└── README.md
```

## 🔧 API Endpoints

### REST Endpoints

- `GET /` - Health check
- `GET /data/tracks` - Available tracks
- `GET /data/drivers` - Driver profiles
- `GET /data/scenarios` - List all race scenarios
- `GET /data/scenario/{scenario_id}` - Get specific scenario data

### WebSocket Endpoint

`WS /ws/simulation` - Real-time race playback

**Messages:**

```json
// Select scenario
{"type": "SELECT_SCENARIO", "scenario_id": 0}

// Playback control
{"type": "PLAY"}
{"type": "PAUSE"}
{"type": "SEEK", "time": 10.5}
{"type": "SET_SPEED", "speed": 1.5}

// Receive race state
{
  "time": 10.5,
  "vehicles": [
    {
      "name": "Max Verstappen",
      "speed_kph": 285.3,
      "lap": 2,
      "track_position": 1234.5,
      "tire_wear": 12.5,
      "aggression": 0.95
    }
  ],
  "scenario_id": 0,
  "is_playing": true,
  "max_time": 450.0,
  "playback_speed": 1.0
}
```

## 📈 Race Data Generation

The `race_data.py` module generates realistic race scenarios using:

1. **Base lap times** from real F1 data
2. **Driver profiles** with aggression, tire management, and consistency
3. **Monte Carlo simulation** for realistic variation
4. **Tire degradation** modeling
5. **Speed profiles** through corners and straights

### Generating New Scenarios

```python
from race_data import generate_multiple_scenarios

scenarios = generate_multiple_scenarios(num_scenarios=20)
```

## 🎯 Understanding the Simulation

### Aggression Impact
- **High aggression (0.95)**: Faster speeds, later braking, higher risk
- **Low aggression (0.82)**: Smoother inputs, better tire management

### Tire Management
- **High management (0.90)**: Smoother driving, less wear
- **Low management (0.75)**: More aggressive, faster wear

### Consistency
- **High consistency (0.98)**: Fewer mistakes, predictable
- **Low consistency (0.80)**: More variation, realistic errors

## 🚀 Performance

- **20 FPS** WebSocket updates
- **15 pre-generated scenarios** ready to play
- **Real-time track position** calculation
- **Smooth playback** with variable speeds

## 🔮 Future Enhancements

- [ ] More tracks (Spa, Silverstone, Singapore, etc.)
- [ ] Pit stop strategy simulation
- [ ] Overtaking and collision detection
- [ ] Weather effects (rain, dry, mixed)
- [ ] Custom race configuration
- [ ] Race replay and analysis
- [ ] Statistics and leaderboards
- [ ] Real-time physics simulation (instead of pre-generated)

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Feel free to:
- Add new tracks
- Improve physics simulation
- Add new features
- Report bugs

---

**Enjoy your F1 simulation! 🏁**
