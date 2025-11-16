"""
Monte Carlo race simulation using REAL F1 track data from FastF1
Combines real track coordinates with simulated race scenarios
"""
import json
import random
import math
from pathlib import Path

# Driver profiles (same as before)
DRIVER_PROFILES = {
    "VER": {
        "name": "Max Verstappen",
        "aggression": 0.95,
        "tire_management": 0.75,
        "consistency": 0.98,
        "color": "#ef4444"
    },
    "HAM": {
        "name": "Lewis Hamilton",
        "aggression": 0.85,
        "tire_management": 0.90,
        "consistency": 0.95,
        "color": "#3b82f6"
    },
    "NOR": {
        "name": "Lando Norris",
        "aggression": 0.88,
        "tire_management": 0.80,
        "consistency": 0.92,
        "color": "#22c55e"
    },
    "LEC": {
        "name": "Charles Leclerc",
        "aggression": 0.92,
        "tire_management": 0.78,
        "consistency": 0.90,
        "color": "#f59e0b"
    },
    "SAI": {
        "name": "Carlos Sainz",
        "aggression": 0.82,
        "tire_management": 0.85,
        "consistency": 0.93,
        "color": "#a855f7"
    }
}


def load_real_track_data(track_file='monza_track_real.json'):
    """Load real track data from FastF1"""
    track_path = Path('../public/tracks') / track_file
    
    if not track_path.exists():
        # Fallback to original track
        track_path = Path('../public/tracks/monza_track.json')
    
    with open(track_path, 'r') as f:
        return json.load(f)


def generate_race_with_real_track(track_data, num_laps=5, num_drivers=5):
    """
    Generate Monte Carlo race simulation using REAL track coordinates
    """
    drivers = list(DRIVER_PROFILES.keys())[:num_drivers]
    track_length = track_data['total_length']
    track_points = track_data['points']
    
    # Base lap times (realistic for Monza)
    base_lap_times = {
        "VER": 82.5,
        "HAM": 83.0,
        "NOR": 83.5,
        "LEC": 83.2,
        "SAI": 83.8,
    }
    
    race_data = {}
    
    for driver_id in drivers:
        profile = DRIVER_PROFILES[driver_id]
        base_time = base_lap_times[driver_id]
        
        # Apply aggression to base time
        if profile["aggression"] > 0.9:
            base_time *= 0.98
        elif profile["aggression"] < 0.8:
            base_time *= 1.02
        
        telemetry = []
        current_time = 0
        
        for lap in range(1, num_laps + 1):
            # Lap time with consistency variation
            consistency_var = (1.0 - profile["consistency"]) * 2.0
            lap_time = base_time * (1.0 + random.uniform(-consistency_var, consistency_var))
            
            # Tire degradation
            tire_wear = (lap - 1) * (1.0 - profile["tire_management"]) * 0.15
            lap_time *= (1.0 + tire_wear)
            
            # Generate telemetry points for this lap
            # Use real track points as reference
            points_per_lap = len(track_points)
            time_per_point = lap_time / points_per_lap
            
            for point_idx in range(points_per_lap):
                track_point = track_points[point_idx]
                
                # Use real track speed as baseline
                base_speed = track_point.get('speed', 250)
                
                # Apply driver characteristics
                speed = base_speed * (0.95 + profile["aggression"] * 0.1)
                speed *= (1.0 - tire_wear * 0.5)
                
                # Add consistency variation
                if random.random() > profile["consistency"]:
                    speed *= random.uniform(0.95, 1.05)
                
                # Calculate distance along track
                track_position = track_point['distance']
                total_distance = (lap - 1) * track_length + track_position
                
                telemetry.append({
                    "time": current_time,
                    "lap": lap,
                    "distance": total_distance,
                    "track_position": track_position,
                    "speed": round(speed, 1),
                    "tire_wear": round(tire_wear * 100, 1),
                    "tire_temp": round(80 + speed * 0.1 + random.uniform(-5, 5), 1),
                    "x": track_point['x'],
                    "y": track_point['y'],
                })
                
                current_time += time_per_point
        
        race_data[driver_id] = telemetry
    
    return race_data, drivers


def generate_multiple_scenarios_real(num_scenarios=10):
    """Generate multiple race scenarios using REAL track data"""
    
    # Load real track
    track_data = load_real_track_data()
    
    scenarios = []
    
    for scenario_idx in range(num_scenarios):
        num_drivers = random.randint(3, 5)
        num_laps = random.randint(3, 8)
        
        race_data, drivers = generate_race_with_real_track(
            track_data=track_data,
            num_laps=num_laps,
            num_drivers=num_drivers
        )
        
        scenarios.append({
            "scenario_id": scenario_idx,
            "num_drivers": num_drivers,
            "num_laps": num_laps,
            "aggression_factor": random.uniform(0.8, 1.2),
            "drivers": drivers,
            "race_data": race_data,
            "track_length": track_data['total_length'],
            "track_name": track_data['track_name'],
        })
    
    return scenarios


def get_race_snapshot(scenario, time_seconds):
    """Get race state at specific time"""
    snapshot = {
        "time": time_seconds,
        "vehicles": []
    }
    
    race_data = scenario["race_data"]
    drivers = scenario["drivers"]
    
    for driver_id in drivers:
        telemetry = race_data[driver_id]
        
        # Find closest telemetry point
        closest_point = None
        for point in telemetry:
            if point["time"] <= time_seconds:
                closest_point = point
            else:
                break
        
        if closest_point:
            profile = DRIVER_PROFILES[driver_id]
            snapshot["vehicles"].append({
                "name": profile["name"],
                "driver_id": driver_id,
                "color": profile["color"],
                "speed_kph": closest_point["speed"],
                "lap": closest_point["lap"],
                "track_position": closest_point["track_position"],
                "tire_wear": closest_point["tire_wear"],
                "tire_temp": closest_point["tire_temp"],
                "distance": closest_point["distance"],
                "aggression": profile["aggression"],
            })
    
    return snapshot


# Generate scenarios on module load
print("Loading REAL track data and generating Monte Carlo scenarios...")
RACE_SCENARIOS = generate_multiple_scenarios_real(num_scenarios=15)
print(f"✓ Generated {len(RACE_SCENARIOS)} scenarios using REAL F1 track data")


if __name__ == "__main__":
    scenarios = RACE_SCENARIOS
    print(f"\nGenerated {len(scenarios)} race scenarios with REAL track data")
    
    for scenario in scenarios[:3]:
        print(f"\nScenario {scenario['scenario_id']}: {scenario['num_drivers']} drivers, {scenario['num_laps']} laps")
        print(f"  Track: {scenario['track_name']}, Length: {scenario['track_length']:.0f}m")
        
        snapshot = get_race_snapshot(scenario, 10.0)
        print(f"  At {snapshot['time']}s:")
        for vehicle in snapshot["vehicles"]:
            print(f"    {vehicle['name']}: {vehicle['speed_kph']:.0f} km/h, Lap {vehicle['lap']}")
