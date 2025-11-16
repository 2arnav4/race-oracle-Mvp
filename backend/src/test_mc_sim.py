from monte_carlo_simulation import RaceConfig, run_race_scenarios, analyze_results

def test_soft_tire_rainy_silverstone():
    config = RaceConfig(
        circuit_length=5.89, num_laps=7, track_temp=39, humidity=81, wind_speed=10,
        tire_compound="Soft", tire_degradation_rate=0.10, fuel_load=70, engine_power_mode="Push",
        driver_skill=0.89, driver_aggression=0.65, reliability_score=0.95, safety_car_prob=0.09
    )
    results = run_race_scenarios(config, n_scenarios=100)
    analysis = analyze_results(results)
    print("Soft tire, rain-prone Silverstone test:", analysis)

def test_hard_tire_perfect_conditions():
    config = RaceConfig(
        circuit_length=5.89, num_laps=7, track_temp=24, humidity=48, wind_speed=11,
        tire_compound="Hard", tire_degradation_rate=0.05, fuel_load=70, engine_power_mode="Normal",
        driver_skill=0.97, driver_aggression=0.5, reliability_score=0.99, safety_car_prob=0.01
    )
    results = run_race_scenarios(config, n_scenarios=100)
    analysis = analyze_results(results)
    print("Hard tire, perfect weather test:", analysis)

if __name__ == "__main__":
    test_soft_tire_rainy_silverstone()
    test_hard_tire_perfect_conditions()
