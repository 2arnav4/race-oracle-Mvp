export type TireCompound = "Soft" | "Medium" | "Hard";
export type WeatherCondition = "Dry" | "Wet";

export type RaceConfig = {
  circuit: "monza";
  numDrivers: number;
  weather: WeatherCondition;
  chaosLevel: number;
  tireCompound: TireCompound;
};

export type DriverProfile = {
  id: string;
  name: string;
  shortName: string;
  team: string;
  color: string;
  aggression: number;
  tireManagement: number;
  consistency: number;
  baseLapTime: number;
};

export type Scenario = {
  scenario_id: number;
  name: string;
  num_drivers: number;
  num_laps: number;
  aggression_factor: number;
  pace_factor: number;
  drivers: string[];
};

export type Vehicle = {
  name: string;
  short_name: string;
  driver_id: string;
  team: string;
  color: string;
  speed_kph: number;
  lap: number;
  track_position: number;
  tire_wear: number;
  tire_temp: number;
  distance: number;
  aggression: number;
  tire_management: number;
  consistency: number;
  tire_compound: TireCompound;
  status: string;
  gap_to_leader: number;
  estimated_lap_time: number;
};

export type RaceState = {
  time: number;
  vehicles: Vehicle[];
  scenario_id: number;
  scenario_name: string;
  is_playing: boolean;
  max_time: number;
  playback_speed: number;
  weather: WeatherCondition;
  circuit: string;
  track_file: string;
  track_length: number;
  num_laps: number;
  tire_compound: TireCompound;
};

export const MONZA_TRACK_LENGTH = 57612.996821870605;

export const DEFAULT_CONFIG: RaceConfig = {
  circuit: "monza",
  numDrivers: 5,
  weather: "Dry",
  chaosLevel: 0.25,
  tireCompound: "Medium",
};

export const DRIVER_PROFILES: DriverProfile[] = [
  {
    id: "VER",
    name: "Max Verstappen",
    shortName: "M. Verstappen",
    team: "Red Bull",
    color: "#ef4444",
    aggression: 0.95,
    tireManagement: 0.75,
    consistency: 0.98,
    baseLapTime: 82.5,
  },
  {
    id: "HAM",
    name: "Lewis Hamilton",
    shortName: "L. Hamilton",
    team: "Mercedes",
    color: "#3b82f6",
    aggression: 0.85,
    tireManagement: 0.9,
    consistency: 0.95,
    baseLapTime: 83,
  },
  {
    id: "NOR",
    name: "Lando Norris",
    shortName: "L. Norris",
    team: "McLaren",
    color: "#f97316",
    aggression: 0.88,
    tireManagement: 0.8,
    consistency: 0.92,
    baseLapTime: 83.5,
  },
  {
    id: "LEC",
    name: "Charles Leclerc",
    shortName: "C. Leclerc",
    team: "Ferrari",
    color: "#f59e0b",
    aggression: 0.92,
    tireManagement: 0.78,
    consistency: 0.9,
    baseLapTime: 83.2,
  },
  {
    id: "SAI",
    name: "Carlos Sainz",
    shortName: "C. Sainz",
    team: "Ferrari",
    color: "#a855f7",
    aggression: 0.82,
    tireManagement: 0.85,
    consistency: 0.93,
    baseLapTime: 83.8,
  },
];

export const SCENARIOS: Scenario[] = [
  {
    scenario_id: 0,
    name: "Balanced Sprint",
    num_drivers: 5,
    num_laps: 5,
    aggression_factor: 1,
    pace_factor: 1,
    drivers: ["VER", "HAM", "NOR", "LEC", "SAI"],
  },
  {
    scenario_id: 1,
    name: "High Aggression",
    num_drivers: 5,
    num_laps: 6,
    aggression_factor: 1.14,
    pace_factor: 0.985,
    drivers: ["VER", "LEC", "NOR", "HAM", "SAI"],
  },
  {
    scenario_id: 2,
    name: "Tire Management Run",
    num_drivers: 5,
    num_laps: 8,
    aggression_factor: 0.9,
    pace_factor: 1.025,
    drivers: ["HAM", "SAI", "NOR", "VER", "LEC"],
  },
  {
    scenario_id: 3,
    name: "Three Car Shootout",
    num_drivers: 3,
    num_laps: 4,
    aggression_factor: 1.08,
    pace_factor: 0.995,
    drivers: ["VER", "HAM", "LEC"],
  },
  {
    scenario_id: 4,
    name: "Wet Practice",
    num_drivers: 5,
    num_laps: 5,
    aggression_factor: 0.86,
    pace_factor: 1.08,
    drivers: ["NOR", "HAM", "SAI", "LEC", "VER"],
  },
];

const compoundWearRate: Record<TireCompound, number> = {
  Soft: 15.5,
  Medium: 10.5,
  Hard: 7.25,
};

const compoundPaceFactor: Record<TireCompound, number> = {
  Soft: 0.986,
  Medium: 1,
  Hard: 1.018,
};

const driverById = new Map(DRIVER_PROFILES.map((driver) => [driver.id, driver]));

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const modulo = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor;

const gaussian = (x: number, center: number, width: number) => {
  const delta = Math.min(Math.abs(x - center), 1 - Math.abs(x - center));
  return Math.exp(-(delta * delta) / (2 * width * width));
};

const trackSpeedProfile = (progress: number) => {
  const cornerDips =
    gaussian(progress, 0.08, 0.028) * 160 +
    gaussian(progress, 0.24, 0.034) * 120 +
    gaussian(progress, 0.47, 0.042) * 135 +
    gaussian(progress, 0.7, 0.032) * 110 +
    gaussian(progress, 0.88, 0.03) * 150;

  const straightBoost = Math.sin(progress * Math.PI * 4 - 0.6) * 12;
  return clamp(318 + straightBoost - cornerDips, 92, 342);
};

const driverLapTime = (driver: DriverProfile, scenario: Scenario, config: RaceConfig) => {
  const weatherFactor = config.weather === "Wet" ? 1.18 : 1;
  const aggressionFactor = 1 - (driver.aggression - 0.82) * 0.045 * scenario.aggression_factor;
  return driver.baseLapTime * scenario.pace_factor * compoundPaceFactor[config.tireCompound] * weatherFactor * aggressionFactor;
};

const estimateMaxTime = (scenario: Scenario, config: RaceConfig) => {
  const selectedDrivers = scenario.drivers
    .slice(0, Math.min(config.numDrivers, scenario.num_drivers))
    .map((id) => driverById.get(id))
    .filter(Boolean) as DriverProfile[];

  const slowestLap = selectedDrivers.reduce(
    (slowest, driver) => Math.max(slowest, driverLapTime(driver, scenario, config)),
    88,
  );

  return slowestLap * scenario.num_laps + 6;
};

export const buildRaceState = (
  scenario: Scenario,
  config: RaceConfig,
  time: number,
  isPlaying: boolean,
  playbackSpeed: number,
): RaceState => {
  const maxTime = estimateMaxTime(scenario, config);
  const clampedTime = clamp(time, 0, maxTime);
  const driverIds = scenario.drivers.slice(0, Math.min(config.numDrivers, scenario.num_drivers));
  const weatherSpeedFactor = config.weather === "Wet" ? 0.82 : 1;
  const weatherWearFactor = config.weather === "Wet" ? 1.18 : 1;
  const gridSpacing = 420;

  const vehicles = driverIds
    .map((driverId, index) => {
      const driver = driverById.get(driverId);
      if (!driver) return null;

      const lapTime = driverLapTime(driver, scenario, config);
      const tireWear =
        clamp(
          (clampedTime / lapTime) *
            compoundWearRate[config.tireCompound] *
            (1.12 - driver.tireManagement * 0.42) *
            weatherWearFactor,
          0,
          96,
        );

      const raceDistance = (clampedTime / lapTime) * MONZA_TRACK_LENGTH - index * gridSpacing;
      const trackPosition = modulo(raceDistance, MONZA_TRACK_LENGTH);
      const progress = trackPosition / MONZA_TRACK_LENGTH;
      const chaosWave = Math.sin(clampedTime * 0.37 + index * 1.73 + scenario.scenario_id) * config.chaosLevel;
      const consistencyWave = Math.sin(clampedTime * 0.11 + driver.consistency * 10 + index) * (1 - driver.consistency);
      const tireSpeedFactor = 1 - tireWear * 0.0038;
      const aggressionSpeedFactor = 0.96 + driver.aggression * 0.075 * scenario.aggression_factor;

      const speed = clamp(
        trackSpeedProfile(progress) *
          weatherSpeedFactor *
          tireSpeedFactor *
          aggressionSpeedFactor *
          (1 + chaosWave * 0.035 + consistencyWave * 0.08),
        config.weather === "Wet" ? 70 : 82,
        config.weather === "Wet" ? 288 : 346,
      );

      const completedDistance = Math.max(0, raceDistance);
      const lap = clamp(Math.floor(completedDistance / MONZA_TRACK_LENGTH) + 1, 1, scenario.num_laps);
      const status = config.chaosLevel > 0.72 && Math.sin(clampedTime * 0.21 + index * 2.4) > 0.965 ? "Recovering" : "Racing";

      return {
        name: driver.name,
        short_name: driver.shortName,
        driver_id: driver.id,
        team: driver.team,
        color: driver.color,
        speed_kph: Number(speed.toFixed(1)),
        lap,
        track_position: trackPosition,
        tire_wear: Number(tireWear.toFixed(1)),
        tire_temp: Number((78 + speed * 0.075 + tireWear * 0.42 + (config.weather === "Wet" ? -8 : 0)).toFixed(1)),
        distance: completedDistance,
        aggression: driver.aggression,
        tire_management: driver.tireManagement,
        consistency: driver.consistency,
        tire_compound: config.tireCompound,
        status,
        gap_to_leader: 0,
        estimated_lap_time: Number((lapTime * (1 + tireWear * 0.0025)).toFixed(3)),
      } satisfies Vehicle;
    })
    .filter(Boolean) as Vehicle[];

  vehicles.sort((a, b) => b.distance - a.distance);
  const leaderDistance = vehicles[0]?.distance ?? 0;

  const rankedVehicles = vehicles.map((vehicle) => ({
    ...vehicle,
    gap_to_leader: Number(((leaderDistance - vehicle.distance) / Math.max(vehicle.speed_kph / 3.6, 1)).toFixed(3)),
  }));

  return {
    time: clampedTime,
    vehicles: rankedVehicles,
    scenario_id: scenario.scenario_id,
    scenario_name: scenario.name,
    is_playing: isPlaying,
    max_time: maxTime,
    playback_speed: playbackSpeed,
    weather: config.weather,
    circuit: "Monza",
    track_file: "monza_track.json",
    track_length: MONZA_TRACK_LENGTH,
    num_laps: scenario.num_laps,
    tire_compound: config.tireCompound,
  };
};
