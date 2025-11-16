# backend/src/simulation/monte_carlo_simulation.py
import numpy as np
import random

class RaceConfig:
    def __init__(self, **kwargs):
        self.circuit_length = kwargs.get("circuit_length", 5.89)
        self.num_laps = kwargs.get("num_laps", 52)
        self.track_temp = kwargs.get("track_temp", 32)
        self.humidity = kwargs.get("humidity", 45)
        self.wind_speed = kwargs.get("wind_speed", 12)
        self.tire_compound = kwargs.get("tire_compound", "Soft")
        self.tire_degradation_rate = kwargs.get("tire_degradation_rate", 0.07)
        self.fuel_load = kwargs.get("fuel_load", 100)
        self.engine_power_mode = kwargs.get("engine_power_mode", "Push")
        self.driver_skill = kwargs.get("driver_skill", 0.95)
        self.driver_aggression = kwargs.get("driver_aggression", 0.7)
        self.reliability_score = kwargs.get("reliability_score", 0.98)
        self.safety_car_prob = kwargs.get("safety_car_prob", 0.03)
        self.sc_event_lap = kwargs.get("sc_event_lap", None)
        self.vsc_event_prob = kwargs.get("vsc_event_prob", 0.02)
        self.red_flag_prob = kwargs.get("red_flag_prob", 0.01)
        self.override_speed = kwargs.get("override_speed", None)

def base_lap_time(config: RaceConfig):
    base = 86.0 * (config.circuit_length / 5.89)
    return base

def weather_penalty(config: RaceConfig):
    penalty = 0.0
    if config.track_temp > 35:
        penalty += 0.13
    if config.humidity > 70 and random.random() < 0.15:
        penalty += 0.6
    if config.wind_speed > 20 and random.random() < 0.09:
        penalty += 0.12
    return penalty

def tire_degradation(lap, config: RaceConfig):
    compound_mult = {"Soft": 0.10, "Medium": 0.07, "Hard": 0.05, "Wet": 0.12}
    rate = compound_mult.get(config.tire_compound, 0.08)
    return lap * rate

def fuel_penalty(lap, config: RaceConfig):
    return (config.fuel_load * (1 - lap / config.num_laps)) * 0.016

def engine_mode_factor(config: RaceConfig):
    modes = {"Push": -0.35, "Conserve": 0.16, "Overtake": -0.25, "Normal": 0.0}
    return modes.get(config.engine_power_mode, 0.0)

def driver_error_prob(config: RaceConfig):
    return max(0.01, 0.12 - config.driver_skill * 0.1 - config.driver_aggression * 0.05)

def reliability_failure(config: RaceConfig):
    return random.random() > config.reliability_score

def session_event(config: RaceConfig, lap):
    events = []
    if lap == config.sc_event_lap or random.random() < config.safety_car_prob:
        events.append("Safety Car")
    if random.random() < config.vsc_event_prob:
        events.append("VSC")
    if random.random() < config.red_flag_prob:
        events.append("Red Flag")
    return events

def run_race_scenarios(config: RaceConfig, n_scenarios=1000):
    results = []
    for scenario in range(n_scenarios):
        lap_times = []
        status = "Finished"
        for lap in range(1, config.num_laps + 1):
            if config.override_speed is not None:
                lap_time = config.circuit_length * 3600 / config.override_speed
            else:
                lap_time = base_lap_time(config)
                lap_time += weather_penalty(config)
                lap_time += tire_degradation(lap, config)
                lap_time += fuel_penalty(lap, config)
                lap_time += engine_mode_factor(config)
            if random.random() < driver_error_prob(config):
                lap_time += random.uniform(0.3, 2.5)
            if reliability_failure(config):
                lap_times.append(None)
                status = f"DNF Lap {lap}"
                break
            events = session_event(config, lap)
            if "Safety Car" in events:
                lap_time += 8.0
            if "VSC" in events:
                lap_time += 4.0
            if "Red Flag" in events:
                status = f"Red Flag Lap {lap}"
                break
            lap_times.append(lap_time)
        results.append({"lap_times": lap_times, "status": status})
    return results

def analyze_results(results):
    finishes = sum(1 for r in results if r["status"] == "Finished")
    total = len(results)
    win_prob = finishes / total
    valid_laps = [l for r in results for l in r["lap_times"] if l is not None]
    avg_lap = np.mean(valid_laps) if valid_laps else None
    fastest_lap = np.min(valid_laps) if valid_laps else None
    return {
        "win_probability": win_prob,
        "avg_lap_time": avg_lap,
        "fastest_lap": fastest_lap
    }
