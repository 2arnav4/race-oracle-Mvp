"""
FastAPI Server with WebSocket for Race Oracle
Serves pre-generated race data
"""
import asyncio
import json
from pathlib import Path
from typing import Dict, List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from race_data import RACE_SCENARIOS, get_race_snapshot, DRIVER_PROFILES

app = FastAPI(title="Race Oracle API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()


@app.get("/")
async def root():
    return {"message": "Race Oracle API", "status": "running", "scenarios": len(RACE_SCENARIOS)}


@app.get("/data/tracks")
async def get_tracks():
    """Get list of available tracks"""
    tracks_dir = Path("../public/tracks")
    if not tracks_dir.exists():
        return JSONResponse({"tracks": []})
    
    track_files = list(tracks_dir.glob("*_track.json"))
    tracks = []
    
    for track_file in track_files:
        try:
            with open(track_file, 'r') as f:
                data = json.load(f)
                tracks.append({
                    "name": data.get("track_name", track_file.stem),
                    "file": track_file.name,
                    "length": data.get("total_length", 0),
                })
        except:
            pass
    
    return {"tracks": tracks}


@app.get("/data/drivers")
async def get_drivers():
    """Get driver profiles"""
    return {"drivers": DRIVER_PROFILES}


@app.get("/data/scenarios")
async def get_scenarios():
    """Get available race scenarios"""
    scenarios_list = []
    for scenario in RACE_SCENARIOS:
        scenarios_list.append({
            "scenario_id": scenario["scenario_id"],
            "num_drivers": scenario["num_drivers"],
            "num_laps": scenario["num_laps"],
            "aggression_factor": scenario["aggression_factor"],
            "drivers": [DRIVER_PROFILES[d]["name"] for d in scenario["drivers"]],
        })
    return {"scenarios": scenarios_list}


@app.get("/data/scenario/{scenario_id}")
async def get_scenario_data(scenario_id: int):
    """Get full data for a specific scenario"""
    if scenario_id < 0 or scenario_id >= len(RACE_SCENARIOS):
        return JSONResponse({"error": "Scenario not found"}, status_code=404)
    
    scenario = RACE_SCENARIOS[scenario_id]
    
    # Load track data
    track_path = Path("../public/tracks/monza_track.json")
    track_data = {}
    if track_path.exists():
        with open(track_path, 'r') as f:
            track_data = json.load(f)
    
    return {
        "scenario_id": scenario["scenario_id"],
        "num_drivers": scenario["num_drivers"],
        "num_laps": scenario["num_laps"],
        "aggression_factor": scenario["aggression_factor"],
        "drivers": scenario["drivers"],
        "track": track_data,
        "race_data": scenario["race_data"],
    }


# Simulation playback state
class PlaybackState:
    def __init__(self):
        self.scenario_id = 0
        self.current_time = 0.0
        self.is_playing = False
        self.playback_speed = 1.0
        self.max_time = 0.0
    
    def get_max_time(self):
        """Get total duration of current scenario"""
        scenario = RACE_SCENARIOS[self.scenario_id]
        max_time = 0.0
        for driver_id in scenario["drivers"]:
            telemetry = scenario["race_data"][driver_id]
            if telemetry:
                max_time = max(max_time, telemetry[-1]["time"])
        return max_time

playback = PlaybackState()


@app.websocket("/ws/simulation")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for simulation playback"""
    global playback
    
    await manager.connect(websocket)
    
    try:
        while True:
            # Receive messages from client
            data = await websocket.receive_json()
            message_type = data.get("type")
            
            if message_type == "SELECT_SCENARIO":
                scenario_id = data.get("scenario_id", 0)
                if 0 <= scenario_id < len(RACE_SCENARIOS):
                    playback.scenario_id = scenario_id
                    playback.current_time = 0.0
                    playback.is_playing = False
                    playback.max_time = playback.get_max_time()
                    
                    await websocket.send_json({
                        "type": "SCENARIO_SELECTED",
                        "scenario_id": scenario_id,
                        "max_time": playback.max_time,
                    })
            
            elif message_type == "PLAY":
                playback.is_playing = True
                await websocket.send_json({"type": "PLAYING"})
            
            elif message_type == "PAUSE":
                playback.is_playing = False
                await websocket.send_json({"type": "PAUSED"})
            
            elif message_type == "SEEK":
                playback.current_time = data.get("time", 0.0)
                await websocket.send_json({"type": "SEEKED", "time": playback.current_time})
            
            elif message_type == "SET_SPEED":
                playback.playback_speed = data.get("speed", 1.0)
                await websocket.send_json({"type": "SPEED_CHANGED", "speed": playback.playback_speed})
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)


# Background task to broadcast race state
async def broadcast_loop():
    """Continuously broadcast race state to all connected clients"""
    while True:
        try:
            if playback.is_playing and RACE_SCENARIOS:
                # Update time
                playback.current_time += 0.05 * playback.playback_speed
                
                # Check if we've reached the end
                if playback.current_time >= playback.max_time:
                    playback.current_time = playback.max_time
                    playback.is_playing = False
                
                # Get race snapshot
                scenario = RACE_SCENARIOS[playback.scenario_id]
                snapshot = get_race_snapshot(scenario, playback.current_time)
                
                # Add metadata
                snapshot["scenario_id"] = playback.scenario_id
                snapshot["is_playing"] = playback.is_playing
                snapshot["max_time"] = playback.max_time
                snapshot["playback_speed"] = playback.playback_speed
                
                await manager.broadcast(snapshot)
            
            await asyncio.sleep(0.05)  # 20 FPS
        except Exception as e:
            print(f"Broadcast error: {e}")
            await asyncio.sleep(0.05)


# Start broadcast loop on startup
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(broadcast_loop())


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
