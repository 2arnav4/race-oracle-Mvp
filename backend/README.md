# Race Oracle Backend

Real-time F1 simulation engine with physics-based vehicle dynamics.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
cd src
python main.py
```

Or use the convenience script:
```bash
./run.sh
```

The server will start on `http://localhost:8000`

## API Endpoints

- `GET /` - Health check
- `GET /data/tracks` - List available tracks
- `GET /data/drivers` - Get driver profiles
- `WS /ws/simulation` - WebSocket for simulation control and data streaming

## WebSocket Messages

### Client → Server

**Start Simulation:**
```json
{
  "type": "START_SIM",
  "params": {
    "track_file": "monza_track.json",
    "weather": "Dry",
    "chaos_level": 0.1,
    "agents": [
      {
        "driver_profile": {
          "name": "Max Verstappen",
          "aggression": 0.95,
          "tire_management": 0.75,
          "consistency": 0.98
        },
        "tire_compound": "Soft"
      }
    ]
  }
}
```

**Stop Simulation:**
```json
{
  "type": "STOP_SIM"
}
```

**Change Weather:**
```json
{
  "type": "SET_WEATHER",
  "payload": "Wet"
}
```

**Set Chaos Level:**
```json
{
  "type": "SET_CHAOS",
  "payload": 0.5
}
```

### Server → Client

**Simulation State (broadcasted ~20 times/sec):**
```json
{
  "time": 12.5,
  "track": "Monza",
  "weather": "Dry",
  "chaos_level": 0.1,
  "vehicles": [
    {
      "name": "Max Verstappen",
      "position": [123.4, 567.8],
      "speed_kph": 285.3,
      "lap": 1,
      "tire_compound": "Soft",
      "tire_wear": 12.5,
      "tire_temp": 92.3,
      "status": "Racing"
    }
  ]
}
```

## Architecture

- `physics.py` - Tire model, vehicle dynamics, and driver AI
- `simulation.py` - Simulation controller with event system
- `main.py` - FastAPI server with WebSocket support
