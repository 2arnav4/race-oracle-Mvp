# Setup Real F1 Data

## Step 1: Install FastF1

```bash
cd backend
pip install fastf1 pandas
```

## Step 2: Fetch Real Track Data

```bash
cd src
python fetch_real_data.py
```

This will:
- Download real GPS coordinates from 2024 Monza race
- Extract actual speed, throttle, brake data
- Analyze track sectors (straights, corners, braking zones)
- Save to `public/tracks/monza_track_real.json`

## Step 3: Restart Backend

```bash
python main.py
```

The backend will automatically use real track data if available!

## What You Get

### Real Track Data
- **Actual GPS coordinates** from F1 cars
- **Real speed profiles** through corners and straights
- **Sector analysis** (DRS zones, braking points, etc.)
- **Complete lap** around full circuit

### Monte Carlo Simulation
- **Realistic lap times** based on real data
- **Driver characteristics** (aggression, tire management)
- **Tire degradation** effects
- **Consistency variation** for realistic racing

## Benefits

✅ **Complete laps** - Cars go around the FULL circuit
✅ **Accurate speeds** - Based on real F1 telemetry
✅ **Realistic racing** - Monte Carlo adds variation
✅ **Multiple scenarios** - Different race outcomes

## Tracks Available

Currently supported:
- Monza (2024)

Can be extended to:
- Spa-Francorchamps
- Silverstone
- Monaco
- Any track with FastF1 data

## How It Works

```
FastF1 API
    ↓
Real GPS coordinates + telemetry
    ↓
Monte Carlo simulation
    ↓
Multiple race scenarios
    ↓
Live visualization
```

## Example Output

```
Fetching Monza 2024 Race data...
✓ Saved 5847 track points
✓ Total track length: 5793.45 meters
✓ Identified 23 track sectors
  - straight: 1234m, avg speed 315 km/h
  - corner: 234m, avg speed 145 km/h
  - medium: 567m, avg speed 245 km/h
```

## Troubleshooting

### Error: "No module named 'fastf1'"
```bash
pip install fastf1
```

### Error: "Session not found"
- Check year and circuit name
- FastF1 only has data from 2018 onwards
- Some sessions may not be available yet

### Slow download
- First time downloads all session data
- Subsequent runs use cache (much faster)
- Cache stored in `backend/src/cache/`
