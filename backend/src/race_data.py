"""
Pre-generated F1 race data with Monte Carlo simulations.
Synchronized 2025 F1 Grid Drivers and Scenarios to match the frontend.
"""
import random
import math

# Synchronized 2025 F1 Grid - 20 Driver Profiles
DRIVER_PROFILES = {
    "VER": {"name": "Max Verstappen",    "short_name": "M. Verstappen", "number": 1,  "team": "Red Bull Racing", "color": "#3671C6", "aggression": 0.95, "tire_management": 0.78, "consistency": 0.98, "base_lap_time": 79.2},
    "LAW": {"name": "Liam Lawson",       "short_name": "L. Lawson",     "number": 30, "team": "Red Bull Racing", "color": "#5B9BD5", "aggression": 0.82, "tire_management": 0.72, "consistency": 0.85, "base_lap_time": 79.9},
    "HAM": {"name": "Lewis Hamilton",    "short_name": "L. Hamilton",   "number": 44, "team": "Ferrari",         "color": "#E8002D", "aggression": 0.85, "tire_management": 0.92, "consistency": 0.96, "base_lap_time": 79.5},
    "LEC": {"name": "Charles Leclerc",   "short_name": "C. Leclerc",    "number": 16, "team": "Ferrari",         "color": "#FF4444", "aggression": 0.92, "tire_management": 0.76, "consistency": 0.91, "base_lap_time": 79.4},
    "RUS": {"name": "George Russell",    "short_name": "G. Russell",    "number": 63, "team": "Mercedes",        "color": "#27F4D2", "aggression": 0.83, "tire_management": 0.84, "consistency": 0.93, "base_lap_time": 79.7},
    "ANT": {"name": "Kimi Antonelli",    "short_name": "K. Antonelli",  "number": 12, "team": "Mercedes",        "color": "#00D4AA", "aggression": 0.86, "tire_management": 0.68, "consistency": 0.82, "base_lap_time": 80.1},
    "NOR": {"name": "Lando Norris",      "short_name": "L. Norris",     "number": 4,  "team": "McLaren",         "color": "#FF8000", "aggression": 0.90, "tire_management": 0.82, "consistency": 0.94, "base_lap_time": 79.3},
    "PIA": {"name": "Oscar Piastri",     "short_name": "O. Piastri",    "number": 81, "team": "McLaren",         "color": "#FFB366", "aggression": 0.80, "tire_management": 0.84, "consistency": 0.93, "base_lap_time": 79.6},
    "ALO": {"name": "Fernando Alonso",   "short_name": "F. Alonso",     "number": 14, "team": "Aston Martin",    "color": "#229971", "aggression": 0.78, "tire_management": 0.94, "consistency": 0.96, "base_lap_time": 80.3},
    "STR": {"name": "Lance Stroll",      "short_name": "L. Stroll",     "number": 18, "team": "Aston Martin",    "color": "#2EB586", "aggression": 0.75, "tire_management": 0.74, "consistency": 0.84, "base_lap_time": 80.8},
    "GAS": {"name": "Pierre Gasly",      "short_name": "P. Gasly",      "number": 10, "team": "Alpine",          "color": "#FF87BC", "aggression": 0.80, "tire_management": 0.78, "consistency": 0.88, "base_lap_time": 80.5},
    "DOO": {"name": "Jack Doohan",       "short_name": "J. Doohan",     "number": 7,  "team": "Alpine",          "color": "#FF69A0", "aggression": 0.77, "tire_management": 0.70, "consistency": 0.80, "base_lap_time": 81.0},
    "TSU": {"name": "Yuki Tsunoda",      "short_name": "Y. Tsunoda",    "number": 22, "team": "RB",              "color": "#6692FF", "aggression": 0.88, "tire_management": 0.70, "consistency": 0.83, "base_lap_time": 80.6},
    "HAD": {"name": "Isack Hadjar",      "short_name": "I. Hadjar",     "number": 6,  "team": "RB",              "color": "#4477EE", "aggression": 0.76, "tire_management": 0.72, "consistency": 0.81, "base_lap_time": 80.9},
    "HUL": {"name": "Nico Hülkenberg",   "short_name": "N. Hülkenberg", "number": 27, "team": "Sauber",          "color": "#52E252", "aggression": 0.74, "tire_management": 0.86, "consistency": 0.90, "base_lap_time": 80.7},
    "BOR": {"name": "Gabriel Bortoleto", "short_name": "G. Bortoleto",  "number": 5,  "team": "Sauber",          "color": "#3CC83C", "aggression": 0.78, "tire_management": 0.70, "consistency": 0.79, "base_lap_time": 81.2},
    "BEA": {"name": "Oliver Bearman",    "short_name": "O. Bearman",    "number": 87, "team": "Haas",            "color": "#E1E4E8", "aggression": 0.81, "tire_management": 0.72, "consistency": 0.82, "base_lap_time": 80.9},
    "OCO": {"name": "Esteban Ocon",      "short_name": "E. Ocon",       "number": 31, "team": "Haas",            "color": "#B6BABD", "aggression": 0.79, "tire_management": 0.80, "consistency": 0.87, "base_lap_time": 80.8},
    "ALB": {"name": "Alex Albon",        "short_name": "A. Albon",      "number": 23, "team": "Williams",        "color": "#64C4FF", "aggression": 0.80, "tire_management": 0.83, "consistency": 0.90, "base_lap_time": 81.1},
    "SAI": {"name": "Carlos Sainz",      "short_name": "C. Sainz",      "number": 55, "team": "Williams",        "color": "#4AA3DD", "aggression": 0.82, "tire_management": 0.86, "consistency": 0.92, "base_lap_time": 80.4},
}

# Synchronized Scenarios
SCENARIOS_TEMPLATES = [
    {
        "scenario_id": 0,
        "name": "Italian GP Sprint",
        "description": "Full 20-driver sprint race at Monza. 5 laps, standard conditions.",
        "num_drivers": 20,
        "num_laps": 5,
        "aggression_factor": 1.0,
        "pace_factor": 1.0,
        "drivers": ["VER", "NOR", "LEC", "HAM", "PIA", "RUS", "LAW", "ANT", "ALO", "SAI", "GAS", "TSU", "HUL", "STR", "OCO", "BEA", "HAD", "DOO", "ALB", "BOR"],
    },
    {
        "scenario_id": 1,
        "name": "Championship Showdown",
        "description": "Top 10 drivers pushing hard for championship points. 8 laps, high aggression.",
        "num_drivers": 10,
        "num_laps": 8,
        "aggression_factor": 1.12,
        "pace_factor": 0.99,
        "drivers": ["VER", "NOR", "LEC", "HAM", "PIA", "RUS", "SAI", "ALO", "GAS", "TSU"],
    },
    {
        "scenario_id": 2,
        "name": "Monza Monsoon",
        "description": "Unpredictable wet conditions with 15 drivers. High drama potential.",
        "num_drivers": 15,
        "num_laps": 6,
        "aggression_factor": 0.88,
        "pace_factor": 1.06,
        "drivers": ["VER", "NOR", "HAM", "LEC", "PIA", "RUS", "SAI", "ALO", "GAS", "TSU", "ANT", "OCO", "HUL", "BEA", "ALB"],
    },
    {
        "scenario_id": 3,
        "name": "Three Way Shootout",
        "description": "VER vs NOR vs LEC — 4 flat-out laps, maximum aggression.",
        "num_drivers": 3,
        "num_laps": 4,
        "aggression_factor": 1.18,
        "pace_factor": 0.985,
        "drivers": ["VER", "NOR", "LEC"],
    },
    {
        "scenario_id": 4,
        "name": "Tire Strategy Duel",
        "description": "12-lap marathon where tire management decides the winner.",
        "num_drivers": 8,
        "num_laps": 12,
        "aggression_factor": 0.92,
        "pace_factor": 1.01,
        "drivers": ["HAM", "VER", "ALO", "PIA", "SAI", "RUS", "HUL", "NOR"],
    },
    {
        "scenario_id": 5,
        "name": "Midfield Battle",
        "description": "The tight midfield pack battles for the minor points.",
        "num_drivers": 10,
        "num_laps": 6,
        "aggression_factor": 1.06,
        "pace_factor": 1.02,
        "drivers": ["GAS", "TSU", "ALO", "STR", "OCO", "HUL", "BEA", "ALB", "HAD", "DOO"],
    },
    {
        "scenario_id": 6,
        "name": "Next Gen Challenge",
        "description": "The rookies and young guns prove themselves on track.",
        "num_drivers": 6,
        "num_laps": 5,
        "aggression_factor": 1.05,
        "pace_factor": 1.03,
        "drivers": ["ANT", "LAW", "DOO", "HAD", "BOR", "BEA"],
    },
]

MONZA_TRACK_LENGTH = 57612.996821870605

def generate_race_telemetry(scenario, track_length=57612.996821870605):
    """
    Generate deterministic race telemetry for the selected scenario's drivers.
    Returns telemetry dictionary mapping driver_id -> list of time points.
    """
    num_laps = scenario["num_laps"]
    drivers = scenario["drivers"]
    aggression_factor = scenario["aggression_factor"]
    pace_factor = scenario["pace_factor"]
    grid_spacing = 350.0  # Spacing in meters between cars on grid
    
    race_data = {}
    
    for idx, driver_id in enumerate(drivers):
        profile = DRIVER_PROFILES[driver_id]
        base_lap = profile["base_lap_time"]
        
        # Calculate nominal lap time
        aggr_mod = 1.0 - (profile["aggression"] - 0.82) * 0.045 * aggression_factor
        lap_time = base_lap * pace_factor * aggr_mod
        
        # Tire wear specs (Medium compound equivalent)
        wear_rate = 10.5
        mgmt_factor = 1.15 - profile["tire_management"] * 0.45
        
        telemetry = []
        
        # Estimate total crossing time (deterministic end)
        total_race_dist = num_laps * track_length
        # Effective lap with progressive wear penalty incorporated
        effective_lap = lap_time * (1.0 + (wear_rate * mgmt_factor * num_laps * 0.5) * 0.002)
        finish_time = ((total_race_dist + idx * grid_spacing) / track_length) * effective_lap
        
        # Sampling rate: 1.0 second intervals for network efficiency
        dt = 1.0
        t = 0.0
        
        while t <= finish_time + 5.0:  # Add a small buffer past crossing
            # Current tire wear
            tire_wear = min(98.0, (t / lap_time) * wear_rate * mgmt_factor * 0.05) # progressive wear
            tire_penalty = 1.0 + (tire_wear * 0.5) * 0.002
            
            # Sinusoidal pace variation per driver (battles/overtakes)
            seed = base_lap * 1000 + profile["aggression"] * 100 + scenario["scenario_id"] * 7
            pv1 = math.sin(t * 0.052 + seed) * 0.008
            pv2 = math.sin(t * 0.021 + seed * 1.7) * 0.005
            cv = math.sin(t * 0.11 + profile["consistency"] * 10 + idx) * (1.0 - profile["consistency"]) * 0.015
            total_pace_var = 1.0 + (pv1 + pv2 + cv) * aggression_factor
            
            current_effective_lap = lap_time * tire_penalty * total_pace_var
            race_distance = (t / current_effective_lap) * track_length - idx * grid_spacing
            
            is_finished = t >= finish_time
            completed_distance = total_race_dist if is_finished else max(0.0, race_distance)
            
            lap = num_laps if is_finished else min(num_laps, int(completed_distance / track_length) + 1)
            track_position = 0.0 if is_finished else (completed_distance % track_length)
            
            # Simple speed profile
            progress = track_position / track_length
            corner_dips = (
                math.exp(-((progress - 0.08)**2) / 0.001) * 160 +
                math.exp(-((progress - 0.24)**2) / 0.002) * 120 +
                math.exp(-((progress - 0.47)**2) / 0.003) * 135 +
                math.exp(-((progress - 0.70)**2) / 0.001) * 110 +
                math.exp(-((progress - 0.88)**2) / 0.002) * 150
            )
            speed = max(82.0, 318.0 - corner_dips) * (1.0 - tire_wear * 0.003)
            
            speed_kph = 0.0 if is_finished else speed
            status = "Finished" if is_finished else "Racing"
            
            telemetry.append({
                "time": t,
                "lap": lap,
                "distance": completed_distance,
                "track_position": track_position,
                "speed": round(speed_kph, 1),
                "tire_wear": round(tire_wear, 1),
                "tire_temp": round(70.0 if is_finished else (78.0 + speed * 0.075 + tire_wear * 0.42), 1),
                "status": status,
                "finish_time": finish_time
            })
            t += dt
            
        race_data[driver_id] = telemetry
        
    return race_data

def build_all_scenarios():
    """Construct all 7 scenarios with full high-fidelity simulated telemetry"""
    scenarios = []
    for template in SCENARIOS_TEMPLATES:
        sc = {
            "scenario_id": template["scenario_id"],
            "name": template["name"],
            "description": template["description"],
            "num_drivers": template["num_drivers"],
            "num_laps": template["num_laps"],
            "aggression_factor": template["aggression_factor"],
            "pace_factor": template["pace_factor"],
            "drivers": template["drivers"],
            "track_length": MONZA_TRACK_LENGTH,
        }
        # Simulate telemetry
        telemetry, drivers = template["drivers"], template["drivers"]
        sc["race_data"] = generate_race_telemetry(sc, MONZA_TRACK_LENGTH)
        scenarios.append(sc)
    return scenarios

# Generate high-fidelity telemetry on module load
RACE_SCENARIOS = build_all_scenarios()

def get_race_snapshot(scenario, time_seconds):
    """Get synchronized race standings at a specific timestamp"""
    snapshot = {
        "time": time_seconds,
        "vehicles": []
    }
    
    race_data = scenario["race_data"]
    drivers = scenario["drivers"]
    
    for driver_id in drivers:
        telemetry = race_data[driver_id]
        
        # Binary search or linear search for closest time stamp
        closest_point = telemetry[0]
        for point in telemetry:
            if point["time"] <= time_seconds:
                closest_point = point
            else:
                break
                
        profile = DRIVER_PROFILES[driver_id]
        snapshot["vehicles"].append({
            "name": profile["name"],
            "short_name": profile["short_name"],
            "driver_id": driver_id,
            "number": profile["number"],
            "team": profile["team"],
            "color": profile["color"],
            "speed_kph": closest_point["speed"],
            "lap": closest_point["lap"],
            "track_position": closest_point["track_position"],
            "tire_wear": closest_point["tire_wear"],
            "tire_temp": closest_point["tire_temp"],
            "distance": closest_point["distance"],
            "aggression": profile["aggression"],
            "tire_management": profile["tire_management"],
            "consistency": profile["consistency"],
            "status": closest_point["status"],
            "finish_time": closest_point["finish_time"]
        })
        
    return snapshot

if __name__ == "__main__":
    print(f"✓ Synchronized {len(RACE_SCENARIOS)} high-fidelity scenarios and 20 driver profiles.")
