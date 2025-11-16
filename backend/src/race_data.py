"""
Pre-generated race data with Monte Carlo simulations
This file contains hardcoded race scenarios for different driver configurations
"""
import json
import random
import math

# Driver profiles with aggression levels
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

def generate_race_telemetry(track_length=5800, num_laps=5, num_drivers=5, aggression_factor=1.0):
    """
    Generate realistic race telemetry using Monte Carlo simulation
    Returns list of telemetry points for each driver over time
    """
    drivers = list(DRIVER_PROFILES.keys())[:num_drivers]
    
    # Base lap times (in seconds) - realistic F1 times
    base_lap_times = {
        "VER": 82.5,  # Fastest
        "HAM": 83.0,
        "NOR": 83.5,
        "LEC": 83.2,
        "SAI": 83.8,
    }
    
    # Generate telemetry for each driver
    race_data = {}
    
    for driver_id in drivers:
        profile = DRIVER_PROFILES[driver_id]
        base_time = base_lap_times[driver_id]
        
        # Apply aggression factor (aggressive drivers are faster but less consistent)
        if profile["aggression"] > 0.9:
            base_time *= 0.98  # 2% faster
        elif profile["aggression"] < 0.8:
            base_time *= 1.02  # 2% slower
            
        telemetry = []
        current_distance = 0
        current_time = 0
        
        # Generate data points every 0.5 seconds
        for lap in range(1, num_laps + 1):
            lap_start_time = current_time
            
            # Simulate lap with variation based on consistency
            consistency_variation = (1.0 - profile["consistency"]) * 2.0
            lap_time = base_time * (1.0 + random.uniform(-consistency_variation, consistency_variation))
            
            # Tire degradation effect
            tire_wear = (lap - 1) * (1.0 - profile["tire_management"]) * 0.15
            lap_time *= (1.0 + tire_wear)
            
            # Generate points throughout the lap
            points_per_lap = int(lap_time * 2)  # 2 points per second
            
            for point_idx in range(points_per_lap):
                progress = point_idx / points_per_lap
                
                # Speed varies through lap (slower in corners, faster on straights)
                # Simulate realistic speed profile
                if progress < 0.3:  # Acceleration zone
                    speed_factor = 0.7 + progress * 1.0
                elif progress < 0.7:  # High speed zone
                    speed_factor = 1.0 + math.sin(progress * math.pi) * 0.3
                else:  # Braking zone
                    speed_factor = 0.8 - (progress - 0.7) * 0.5
                
                # Base speed around 250 km/h
                speed = 250 * speed_factor * (1.0 - tire_wear * 0.5)
                
                # Add aggression effect (aggressive drivers maintain higher speeds)
                speed *= (0.95 + profile["aggression"] * 0.1)
                
                # Distance along track
                distance_increment = (speed / 3.6) * 0.5  # 0.5 second intervals, convert km/h to m/s
                current_distance += distance_increment
                
                # Wrap around track
                track_position = current_distance % track_length
                
                telemetry.append({
                    "time": current_time,
                    "lap": lap,
                    "distance": current_distance,
                    "track_position": track_position,
                    "speed": round(speed, 1),
                    "tire_wear": round(tire_wear * 100, 1),
                    "tire_temp": round(80 + speed * 0.1 + random.uniform(-5, 5), 1),
                })
                
                current_time += 0.5
        
        race_data[driver_id] = telemetry
    
    return race_data, drivers

def generate_multiple_scenarios(num_scenarios=10, track_length=5800):
    """Generate multiple race scenarios with different configurations"""
    scenarios = []
    
    for scenario_idx in range(num_scenarios):
        # Vary number of drivers
        num_drivers = random.randint(3, 5)
        
        # Vary number of laps
        num_laps = random.randint(3, 8)
        
        # Vary aggression factor
        aggression_factor = random.uniform(0.8, 1.2)
        
        race_data, drivers = generate_race_telemetry(
            track_length=track_length,
            num_laps=num_laps,
            num_drivers=num_drivers,
            aggression_factor=aggression_factor
        )
        
        scenarios.append({
            "scenario_id": scenario_idx,
            "num_drivers": num_drivers,
            "num_laps": num_laps,
            "aggression_factor": aggression_factor,
            "drivers": drivers,
            "race_data": race_data,
            "track_length": track_length,
        })
    
    return scenarios

def get_race_snapshot(scenario, time_seconds):
    """Get race state at a specific time"""
    snapshot = {
        "time": time_seconds,
        "vehicles": []
    }
    
    race_data = scenario["race_data"]
    drivers = scenario["drivers"]
    
    for driver_id in drivers:
        telemetry = race_data[driver_id]
        
        # Find telemetry point closest to requested time
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

# Pre-generate scenarios on module load
RACE_SCENARIOS = generate_multiple_scenarios(num_scenarios=15)

if __name__ == "__main__":
    # Test data generation
    scenarios = RACE_SCENARIOS
    print(f"Generated {len(scenarios)} race scenarios")
    
    for scenario in scenarios[:2]:
        print(f"\nScenario {scenario['scenario_id']}: {scenario['num_drivers']} drivers, {scenario['num_laps']} laps")
        
        # Show snapshot at 10 seconds
        snapshot = get_race_snapshot(scenario, 10.0)
        print(f"At {snapshot['time']}s:")
        for vehicle in snapshot["vehicles"]:
            print(f"  {vehicle['name']}: {vehicle['speed_kph']} km/h, Lap {vehicle['lap']}")
