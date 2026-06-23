"""
Physics Engine for Race Oracle
Implements tire model, vehicle dynamics, and driver AI
"""
import math
import random
from typing import Dict, List, Tuple


class Tire:
    """Tire model with wear, temperature, and grip calculations"""
    
    COMPOUNDS = {
        "Soft": {"base_grip": 1.15, "degradation_rate": 0.08, "optimal_temp": 95},
        "Medium": {"base_grip": 1.0, "degradation_rate": 0.05, "optimal_temp": 90},
        "Hard": {"base_grip": 0.9, "degradation_rate": 0.03, "optimal_temp": 85},
    }
    
    def __init__(self, compound: str = "Medium"):
        self.compound = compound
        self.specs = self.COMPOUNDS.get(compound, self.COMPOUNDS["Medium"])
        self.base_grip_multiplier = self.specs["base_grip"]
        self.degradation_rate = self.specs["degradation_rate"]
        self.optimal_temp = self.specs["optimal_temp"]
        self.current_temp = 70.0
        self.current_wear = 0.0  # 0.0 to 1.0
        
    def get_current_grip(self) -> float:
        """Calculate current grip based on wear and temperature"""
        # Wear penalty
        wear_factor = 1.0 - (self.current_wear * 0.4)
        
        # Temperature factor (optimal at target temp)
        temp_diff = abs(self.current_temp - self.optimal_temp)
        temp_factor = max(0.7, 1.0 - (temp_diff / 50.0))
        
        return self.base_grip_multiplier * wear_factor * temp_factor
    
    def update_wear(self, distance_km: float, sliding_factor: float = 0.0):
        """Update tire wear based on distance and sliding"""
        base_wear = distance_km * self.degradation_rate * 0.001
        sliding_wear = sliding_factor * 0.002
        self.current_wear = min(1.0, self.current_wear + base_wear + sliding_wear)
        
    def update_temperature(self, speed: float, lateral_force: float):
        """Update tire temperature based on usage"""
        target_temp = self.optimal_temp + (speed * 0.1) + (lateral_force * 5.0)
        # Gradual temperature change
        self.current_temp += (target_temp - self.current_temp) * 0.05


class Driver:
    """AI Driver with personality traits"""
    
    def __init__(self, profile: Dict):
        self.name = profile.get("name", "Unknown")
        self.aggression = profile.get("aggression", 0.8)
        self.tire_management = profile.get("tire_management", 0.7)
        self.consistency = profile.get("consistency", 0.9)
        
    def get_commands(self, vehicle, track_data: List, target_speed: float) -> Tuple[float, float, float]:
        """
        Returns (throttle, brake, steer) commands
        throttle: 0.0 to 1.0
        brake: 0.0 to 1.0
        steer: -1.0 to 1.0
        """
        current_speed = vehicle.vel
        
        # Speed control with aggression modifier
        speed_diff = target_speed * (0.95 + self.aggression * 0.1) - current_speed
        
        # Throttle/brake logic
        if speed_diff > 5:
            throttle = min(1.0, speed_diff / 50.0)
            brake = 0.0
        elif speed_diff < -5:
            throttle = 0.0
            brake = min(1.0, abs(speed_diff) / 80.0 * (1.2 - self.aggression * 0.2))
        else:
            throttle = 0.3
            brake = 0.0
            
        # Smooth inputs for tire management
        smoothing = self.tire_management
        throttle *= (0.7 + smoothing * 0.3)
        brake *= (0.7 + smoothing * 0.3)
        
        # Add consistency variation
        if random.random() > self.consistency:
            throttle *= random.uniform(0.9, 1.1)
            brake *= random.uniform(0.9, 1.1)
            
        # Steering (simplified - follow track)
        steer = self._calculate_steering(vehicle, track_data)
        
        return throttle, brake, steer
    
    def _calculate_steering(self, vehicle, track_data: List) -> float:
        """Calculate steering input to follow track"""
        if not track_data or len(track_data) < 2:
            return 0.0
            
        # Look ahead on track
        current_idx = vehicle.track_index
        lookahead_idx = (current_idx + 5) % len(track_data)
        
        target_point = track_data[lookahead_idx]
        current_point = track_data[current_idx]
        
        # Calculate desired heading
        dx = target_point["x"] - current_point["x"]
        dy = target_point["y"] - current_point["y"]
        desired_heading = math.atan2(dy, dx)
        
        # Steering correction
        heading_error = desired_heading - vehicle.heading
        # Normalize to -pi to pi
        while heading_error > math.pi:
            heading_error -= 2 * math.pi
        while heading_error < -math.pi:
            heading_error += 2 * math.pi
            
        steer = max(-1.0, min(1.0, heading_error * 2.0))
        return steer


class Vehicle:
    """Vehicle agent with physics simulation"""
    
    def __init__(self, driver: Driver, tire: Tire, start_position: int = 0):
        self.driver = driver
        self.tire = tire
        
        # State
        self.pos = [0.0, 0.0]  # x, y position
        self.vel = 0.0  # speed in m/s
        self.accel = 0.0
        self.heading = 0.0  # radians
        self.track_index = start_position
        self.distance_on_track = 0.0
        self.current_lap = 1
        
        # Physics constants
        self.mass = 798.0  # kg (F1 car with driver)
        self.max_engine_force = 8000.0  # N
        self.max_brake_force = 15000.0  # N
        self.drag_coefficient = 0.7
        self.downforce_coefficient = 3.5
        
        # Status
        self.status = "Racing"
        
    def update(self, dt: float, track_data: List):
        """Main physics update tick"""
        if self.status != "Racing" or not track_data:
            return
            
        # Get AI commands
        target_speed = self._get_target_speed(track_data)
        throttle, brake, steer = self.driver.get_commands(self, track_data, target_speed)
        
        # Calculate forces
        engine_force = throttle * self.max_engine_force
        brake_force = brake * self.max_brake_force
        drag_force = 0.5 * self.drag_coefficient * (self.vel ** 2)
        
        # Net longitudinal force
        net_force = engine_force - brake_force - drag_force
        self.accel = net_force / self.mass
        
        # Update velocity
        self.vel = max(0.0, self.vel + self.accel * dt)
        
        # Grip budget (mechanical + aero)
        mechanical_grip = self.tire.get_current_grip() * 9.81 * self.mass
        aero_downforce = self.downforce_coefficient * (self.vel ** 2)
        grip_budget = mechanical_grip + aero_downforce
        
        # Lateral force for cornering
        lateral_force_requested = abs(steer) * self.vel * 500.0
        lateral_force = min(lateral_force_requested, grip_budget * 0.7)
        
        # Sliding detection
        sliding_factor = 0.0
        if lateral_force_requested > grip_budget * 0.7:
            sliding_factor = (lateral_force_requested - grip_budget * 0.7) / grip_budget
            self.vel *= 0.98  # Speed loss from sliding
            
        # Update tire
        distance_km = self.vel * dt / 1000.0
        self.tire.update_wear(distance_km, sliding_factor)
        self.tire.update_temperature(self.vel, lateral_force / 1000.0)
        
        # Update heading
        if self.vel > 1.0:
            turn_rate = steer * 0.5 * (lateral_force / (self.mass * self.vel))
            self.heading += turn_rate * dt
        
        # Update position along track
        distance_moved = self.vel * dt
        self.distance_on_track += distance_moved
        
        # Get total track length
        total_track_length = track_data[-1]["distance"]
        
        # Lap completion
        if self.distance_on_track >= total_track_length:
            self.distance_on_track -= total_track_length
            self.current_lap += 1
            
        # Find current track segment (binary search for efficiency)
        # For now, simple linear search
        for i in range(len(track_data)):
            if track_data[i]["distance"] >= self.distance_on_track:
                self.track_index = i
                self.pos = [track_data[i]["x"], track_data[i]["y"]]
                
                # Update heading from track
                if i < len(track_data) - 1:
                    next_point = track_data[i + 1]
                    dx = next_point["x"] - track_data[i]["x"]
                    dy = next_point["y"] - track_data[i]["y"]
                    self.heading = math.atan2(dy, dx)
                break
    
    def _get_target_speed(self, track_data: List) -> float:
        """Get target speed for current track section"""
        if not track_data:
            return 80.0
            
        # Look ahead for corners
        lookahead = 20
        current_idx = self.track_index
        
        # Base speed for straights (F1 cars can reach ~340 km/h = 94 m/s)
        base_speed = 90.0  # m/s (~324 km/h)
        
        # Reduce speed in corners based on curvature
        if current_idx + lookahead < len(track_data):
            next_points = track_data[current_idx:min(current_idx + lookahead, len(track_data))]
            if len(next_points) >= 3:
                # Calculate curvature approximation
                p1 = next_points[0]
                p2 = next_points[len(next_points)//2]
                p3 = next_points[-1]
                
                dx1 = p2["x"] - p1["x"]
                dy1 = p2["y"] - p1["y"]
                dx2 = p3["x"] - p2["x"]
                dy2 = p3["y"] - p2["y"]
                
                # Calculate angle change
                angle1 = math.atan2(dy1, dx1)
                angle2 = math.atan2(dy2, dx2)
                angle_change = abs(angle2 - angle1)
                
                # Normalize angle
                if angle_change > math.pi:
                    angle_change = 2 * math.pi - angle_change
                    
                # Reduce speed for corners (more aggressive reduction)
                # Sharp corners (angle > 0.5 rad) need much slower speeds
                if angle_change > 0.5:
                    corner_factor = max(0.3, 1.0 - angle_change * 1.5)
                elif angle_change > 0.2:
                    corner_factor = max(0.6, 1.0 - angle_change * 0.8)
                else:
                    corner_factor = 1.0
                    
                base_speed *= corner_factor
        
        return base_speed
    
    def get_telemetry(self) -> Dict:
        """Get current telemetry data"""
        return {
            "name": self.driver.name,
            "position": self.pos,
            "speed_kph": self.vel * 3.6,
            "speed_ms": self.vel,
            "lap": self.current_lap,
            "distance": self.distance_on_track,
            "tire_compound": self.tire.compound,
            "tire_wear": round(self.tire.current_wear * 100, 1),
            "tire_temp": round(self.tire.current_temp, 1),
            "status": self.status,
            "heading": self.heading,
        }
