"""
Fetch real F1 data from FastF1 API
Gets actual track coordinates and telemetry from real races
"""
import fastf1
import json
import numpy as np
from pathlib import Path

# Enable cache for faster loading
import os
cache_dir = os.path.join(os.path.dirname(__file__), 'cache')
os.makedirs(cache_dir, exist_ok=True)
fastf1.Cache.enable_cache(cache_dir)

def fetch_track_data(year=2023, circuit='Monza', session_type='Race'):
    """
    Fetch real track coordinates from FastF1
    Returns track points with actual GPS coordinates
    """
    print(f"Fetching {circuit} {year} {session_type} data...")
    
    # Load session
    session = fastf1.get_session(year, circuit, session_type)
    session.load()
    
    # Get fastest lap for track coordinates
    # Use first driver's first valid lap
    drivers = session.laps['Driver'].unique()
    telemetry = None
    
    for driver in drivers[:5]:  # Try first 5 drivers
        try:
            driver_laps = session.laps[session.laps['Driver'] == driver]
            if len(driver_laps) > 0:
                # Get first lap with telemetry
                for idx in range(min(3, len(driver_laps))):
                    try:
                        lap = driver_laps.iloc[idx]
                        telemetry = lap.get_telemetry()
                        if len(telemetry) > 100:  # Valid telemetry
                            print(f"Using {driver}'s lap {idx+1} for track data")
                            break
                    except:
                        continue
                if telemetry is not None and len(telemetry) > 100:
                    break
        except Exception as e:
            print(f"Error with driver {driver}: {e}")
            continue
    
    if telemetry is None or len(telemetry) == 0:
        raise ValueError("Could not find any valid telemetry data")
    
    # Extract coordinates
    track_points = []
    total_distance = 0

    telemetry.reset_index(drop=True, inplace=True)  # ensures index = 0..N

    for idx, row in enumerate(telemetry.itertuples()):
        if idx > 0:
            prev = telemetry.iloc[idx - 1]
            dx = row.X - prev["X"]
            dy = row.Y - prev["Y"]
            segment_distance = np.sqrt(dx**2 + dy**2)
            total_distance += segment_distance

        track_points.append({
            "x": float(row.X),
            "y": float(row.Y),
            "z": float(getattr(row, "Z", 0)),
            "distance": float(total_distance),
            "speed": float(row.Speed),
            "throttle": float(row.Throttle),
            "brake": float(row.Brake),
        })

    
    track_data = {
        'track_name': circuit,
        'year': year,
        'total_length': float(total_distance),
        'points': track_points
    }
    
    # Save to file
    output_dir = Path(__file__).parent.parent.parent / 'public' / 'tracks'
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_file = output_dir / f'{circuit.lower()}_track_real.json'
    with open(output_file, 'w') as f:
        json.dump(track_data, f, indent=2)
    
    print(f"✓ Saved {len(track_points)} track points to {output_file}")
    print(f"✓ Total track length: {total_distance:.2f} meters")
    
    return track_data


def fetch_driver_telemetry(year=2024, circuit='Monza', driver_code='VER'):
    """
    Fetch real driver telemetry from FastF1
    Returns actual speed, throttle, brake data
    """
    print(f"Fetching {driver_code} telemetry from {circuit} {year}...")
    
    session = fastf1.get_session(year, circuit, 'Race')
    session.load()
    
    # Get driver laps
    driver_laps = session.laps.pick_driver(driver_code)
    
    telemetry_data = []
    
    for lap_num, lap in driver_laps.iterrows():
        if lap['LapTime'] is not None:
            lap_telemetry = lap.get_telemetry()
            
            for i, row in lap_telemetry.iterrows():
                telemetry_data.append({
                    'lap': int(lap['LapNumber']),
                    'time': float(row['Time'].total_seconds()),
                    'speed': float(row['Speed']),
                    'throttle': float(row['Throttle']),
                    'brake': float(row['Brake']),
                    'x': float(row['X']),
                    'y': float(row['Y']),
                })
    
    print(f"✓ Fetched {len(telemetry_data)} telemetry points for {driver_code}")
    
    return telemetry_data


def analyze_track_sectors(track_data):
    """
    Analyze track to identify corners, straights, braking zones
    This helps Monte Carlo simulation be more realistic
    """
    points = track_data['points']
    
    # Calculate speed profile
    speeds = [p['speed'] for p in points]
    avg_speed = np.mean(speeds)
    
    # Identify sectors
    sectors = []
    current_sector = {'type': 'unknown', 'start': 0, 'speeds': []}
    
    for i, point in enumerate(points):
        speed = point['speed']
        
        # Classify based on speed
        if speed > avg_speed * 1.2:
            sector_type = 'straight'
        elif speed < avg_speed * 0.7:
            sector_type = 'corner'
        else:
            sector_type = 'medium'
        
        if sector_type != current_sector['type']:
            if len(current_sector['speeds']) > 10:
                sectors.append({
                    'type': current_sector['type'],
                    'start_idx': current_sector['start'],
                    'end_idx': i,
                    'avg_speed': np.mean(current_sector['speeds']),
                    'length': points[i]['distance'] - points[current_sector['start']]['distance']
                })
            
            current_sector = {'type': sector_type, 'start': i, 'speeds': [speed]}
        else:
            current_sector['speeds'].append(speed)
    
    print(f"✓ Identified {len(sectors)} track sectors")
    for sector in sectors[:5]:
        print(f"  - {sector['type']}: {sector['length']:.0f}m, avg speed {sector['avg_speed']:.0f} km/h")
    
    return sectors


if __name__ == '__main__':
    # Fetch Monza track data
    print("=" * 60)
    print("FETCHING REAL F1 DATA FROM FASTF1")
    print("=" * 60)
    
    try:
        # Get track coordinates
        track_data = fetch_track_data(year=2023, circuit='Monza', session_type='Race')
        
        # Analyze track
        sectors = analyze_track_sectors(track_data)
        
        # Save sector analysis
        track_data['sectors'] = sectors
        output_file = Path('../public/tracks/monza_track_real.json')
        with open(output_file, 'w') as f:
            json.dump(track_data, f, indent=2)
        
        print("\n" + "=" * 60)
        print("✓ REAL F1 DATA FETCHED SUCCESSFULLY!")
        print("=" * 60)
        print(f"Track: {track_data['track_name']}")
        print(f"Length: {track_data['total_length']:.2f} meters")
        print(f"Points: {len(track_data['points'])}")
        print(f"Sectors: {len(sectors)}")
        
    except Exception as e:
        print(f"\n❌ Error fetching data: {e}")
        print("\nNote: You need to install fastf1:")
        print("  pip install fastf1")
