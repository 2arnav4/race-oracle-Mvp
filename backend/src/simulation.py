"""
Simulation Core for Race Oracle
Manages race state, events, and weather
"""
import random
from typing import List, Dict, Optional
from physics import Vehicle, Driver, Tire


class Simulation:
    """Main simulation controller"""
    
    def __init__(self):
        self.vehicles: List[Vehicle] = []
        self.track_data: List[Dict] = []
        self.track_name: str = ""
        self.global_weather: str = "Dry"
        self.chaos_level: float = 0.0
        self.is_running: bool = False
        self.simulation_time: float = 0.0
        self.dt: float = 0.05  # 50ms time step
        
    def configure(self, params: Dict):
        """Set up simulation with given parameters"""
        self.track_name = params.get("track", "Monza")
        self.track_data = params.get("track_data", [])
        self.global_weather = params.get("weather", "Dry")
        self.chaos_level = params.get("chaos_level", 0.0)
        
        # Create vehicles from agent configs
        self.vehicles = []
        agents = params.get("agents", [])
        
        # Calculate spacing between cars (about 100m apart)
        spacing_distance = 100.0  # meters
        
        for i, agent_config in enumerate(agents):
            # Create driver
            driver_profile = agent_config.get("driver_profile", {
                "name": f"Driver {i+1}",
                "aggression": 0.8,
                "tire_management": 0.7,
                "consistency": 0.9,
            })
            driver = Driver(driver_profile)
            
            # Create tire
            tire_compound = agent_config.get("tire_compound", "Medium")
            tire = Tire(tire_compound)
            
            # Apply weather effects
            if self.global_weather == "Wet":
                tire.base_grip_multiplier *= 0.7
                
            # Create vehicle with staggered start positions
            start_position = 0
            if self.track_data:
                # Find track index for starting distance
                start_distance = i * spacing_distance
                for idx, point in enumerate(self.track_data):
                    if point["distance"] >= start_distance:
                        start_position = idx
                        break
            
            vehicle = Vehicle(driver, tire, start_position)
            
            # Set initial distance on track
            vehicle.distance_on_track = i * spacing_distance
            
            # Set initial position
            if self.track_data and start_position < len(self.track_data):
                vehicle.pos = [self.track_data[start_position]["x"], self.track_data[start_position]["y"]]
            
            # Give cars initial racing speed (about 200 km/h = 55 m/s)
            vehicle.vel = 55.0 + (random.random() * 5.0)  # 55-60 m/s
            
            self.vehicles.append(vehicle)
            
        self.is_running = True
        self.simulation_time = 0.0
        
    def update(self):
        """Main simulation update loop"""
        if not self.is_running:
            return
            
        # Update all vehicles
        for vehicle in self.vehicles:
            vehicle.update(self.dt, self.track_data)
            
        # Check for random events based on chaos level
        if random.random() < self.chaos_level * 0.001:
            self._trigger_random_event()
            
        self.simulation_time += self.dt
        
    def _trigger_random_event(self):
        """Trigger random race events"""
        if not self.vehicles:
            return
            
        event_type = random.choice(["mechanical", "spin", "puncture"])
        victim = random.choice(self.vehicles)
        
        if event_type == "mechanical":
            victim.status = "DNF - Mechanical"
        elif event_type == "spin":
            victim.vel *= 0.3  # Lose speed
        elif event_type == "puncture":
            victim.tire.current_wear = 0.95  # Severe tire damage
            
    def set_weather(self, weather: str):
        """Change weather conditions"""
        self.global_weather = weather
        
        # Apply weather effects to all tires
        multiplier = 0.7 if weather == "Wet" else 1.0
        for vehicle in self.vehicles:
            base_compound = vehicle.tire.compound
            vehicle.tire = Tire(base_compound)
            if weather == "Wet":
                vehicle.tire.base_grip_multiplier *= multiplier
                
    def set_chaos(self, level: float):
        """Set chaos level (0.0 to 1.0)"""
        self.chaos_level = max(0.0, min(1.0, level))
        
    def stop(self):
        """Stop the simulation"""
        self.is_running = False
        
    def reset(self):
        """Reset simulation state"""
        self.vehicles = []
        self.is_running = False
        self.simulation_time = 0.0
        
    def get_state_snapshot(self) -> Dict:
        """Get current simulation state for broadcasting"""
        return {
            "time": self.simulation_time,
            "track": self.track_name,
            "weather": self.global_weather,
            "chaos_level": self.chaos_level,
            "vehicles": [vehicle.get_telemetry() for vehicle in self.vehicles],
        }
