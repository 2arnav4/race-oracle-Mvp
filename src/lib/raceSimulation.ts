/**
 * Race Oracle — Client-side F1 race simulation engine
 * 2025 F1 Season data · Monza circuit · Monte Carlo–style deterministic simulation
 */

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type TireCompound = "Soft" | "Medium" | "Hard";
export type WeatherCondition = "Dry" | "Wet";

export type AppSettings = {
  glowEffects: boolean;
  showTelemetryOverlay: boolean;
  autoPlayOnSelect: boolean;
  darkMode: boolean;
  reduceMotion: boolean;
  soundEffects: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
  glowEffects: true,
  showTelemetryOverlay: true,
  autoPlayOnSelect: true,
  darkMode: true,
  reduceMotion: false,
  soundEffects: true,
};

export type RaceConfig = {
  circuit: "monza";
  numDrivers: number;
  weather: WeatherCondition;
  chaosLevel: number;
  tireCompound: TireCompound;
};

export const DEFAULT_CONFIG: RaceConfig = {
  circuit: "monza",
  numDrivers: 20,
  weather: "Dry",
  chaosLevel: 0.25,
  tireCompound: "Medium",
};

export type DriverProfile = {
  id: string;
  name: string;
  shortName: string;
  number: number;
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
  description: string;
  num_drivers: number;
  num_laps: number;
  aggression_factor: number;
  pace_factor: number;
  drivers: string[];
};

export type Vehicle = {
  position: number;
  name: string;
  short_name: string;
  driver_id: string;
  number: number;
  team: string;
  color: string;
  speed_kph: number;
  lap: number;
  total_laps: number;
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
  best_lap_time: number;
  finish_time?: number;
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
  total_drivers: number;
  race_progress: number;
};

/* ─── Constants ──────────────────────────────────────────────────────────── */

/** Track length derived from monza_track.json coordinate data */
export const MONZA_TRACK_LENGTH = 57_612.996_821_870_605;

/* ─── 2025 F1 Season — 20 Driver Profiles ────────────────────────────── */

export const DRIVER_PROFILES: DriverProfile[] = [
  // Red Bull Racing
  { id: "VER", name: "Max Verstappen",    shortName: "M. Verstappen", number: 1,  team: "Red Bull Racing", color: "#3671C6", aggression: 0.95, tireManagement: 0.78, consistency: 0.98, baseLapTime: 79.2 },
  { id: "LAW", name: "Liam Lawson",       shortName: "L. Lawson",     number: 30, team: "Red Bull Racing", color: "#5B9BD5", aggression: 0.82, tireManagement: 0.72, consistency: 0.85, baseLapTime: 79.9 },
  // Scuderia Ferrari
  { id: "HAM", name: "Lewis Hamilton",    shortName: "L. Hamilton",   number: 44, team: "Ferrari",         color: "#E8002D", aggression: 0.85, tireManagement: 0.92, consistency: 0.96, baseLapTime: 79.5 },
  { id: "LEC", name: "Charles Leclerc",   shortName: "C. Leclerc",    number: 16, team: "Ferrari",         color: "#FF4444", aggression: 0.92, tireManagement: 0.76, consistency: 0.91, baseLapTime: 79.4 },
  // Mercedes-AMG Petronas
  { id: "RUS", name: "George Russell",    shortName: "G. Russell",    number: 63, team: "Mercedes",        color: "#27F4D2", aggression: 0.83, tireManagement: 0.84, consistency: 0.93, baseLapTime: 79.7 },
  { id: "ANT", name: "Kimi Antonelli",    shortName: "K. Antonelli",  number: 12, team: "Mercedes",        color: "#00D4AA", aggression: 0.86, tireManagement: 0.68, consistency: 0.82, baseLapTime: 80.1 },
  // McLaren Racing
  { id: "NOR", name: "Lando Norris",      shortName: "L. Norris",     number: 4,  team: "McLaren",         color: "#FF8000", aggression: 0.90, tireManagement: 0.82, consistency: 0.94, baseLapTime: 79.3 },
  { id: "PIA", name: "Oscar Piastri",     shortName: "O. Piastri",    number: 81, team: "McLaren",         color: "#FFB366", aggression: 0.80, tireManagement: 0.84, consistency: 0.93, baseLapTime: 79.6 },
  // Aston Martin Aramco
  { id: "ALO", name: "Fernando Alonso",   shortName: "F. Alonso",     number: 14, team: "Aston Martin",    color: "#229971", aggression: 0.78, tireManagement: 0.94, consistency: 0.96, baseLapTime: 80.3 },
  { id: "STR", name: "Lance Stroll",      shortName: "L. Stroll",     number: 18, team: "Aston Martin",    color: "#2EB586", aggression: 0.75, tireManagement: 0.74, consistency: 0.84, baseLapTime: 80.8 },
  // BWT Alpine
  { id: "GAS", name: "Pierre Gasly",      shortName: "P. Gasly",      number: 10, team: "Alpine",          color: "#FF87BC", aggression: 0.80, tireManagement: 0.78, consistency: 0.88, baseLapTime: 80.5 },
  { id: "DOO", name: "Jack Doohan",       shortName: "J. Doohan",     number: 7,  team: "Alpine",          color: "#FF69A0", aggression: 0.77, tireManagement: 0.70, consistency: 0.80, baseLapTime: 81.0 },
  // Visa Cash App RB
  { id: "TSU", name: "Yuki Tsunoda",      shortName: "Y. Tsunoda",    number: 22, team: "RB",              color: "#6692FF", aggression: 0.88, tireManagement: 0.70, consistency: 0.83, baseLapTime: 80.6 },
  { id: "HAD", name: "Isack Hadjar",      shortName: "I. Hadjar",     number: 6,  team: "RB",              color: "#4477EE", aggression: 0.76, tireManagement: 0.72, consistency: 0.81, baseLapTime: 80.9 },
  // Kick Sauber
  { id: "HUL", name: "Nico Hülkenberg",   shortName: "N. Hülkenberg", number: 27, team: "Sauber",          color: "#52E252", aggression: 0.74, tireManagement: 0.86, consistency: 0.90, baseLapTime: 80.7 },
  { id: "BOR", name: "Gabriel Bortoleto", shortName: "G. Bortoleto",  number: 5,  team: "Sauber",          color: "#3CC83C", aggression: 0.78, tireManagement: 0.70, consistency: 0.79, baseLapTime: 81.2 },
  // MoneyGram Haas
  { id: "BEA", name: "Oliver Bearman",    shortName: "O. Bearman",    number: 87, team: "Haas",            color: "#E1E4E8", aggression: 0.81, tireManagement: 0.72, consistency: 0.82, baseLapTime: 80.9 },
  { id: "OCO", name: "Esteban Ocon",      shortName: "E. Ocon",       number: 31, team: "Haas",            color: "#B6BABD", aggression: 0.79, tireManagement: 0.80, consistency: 0.87, baseLapTime: 80.8 },
  // Williams Racing
  { id: "ALB", name: "Alex Albon",        shortName: "A. Albon",      number: 23, team: "Williams",        color: "#64C4FF", aggression: 0.80, tireManagement: 0.83, consistency: 0.90, baseLapTime: 81.1 },
  { id: "SAI", name: "Carlos Sainz",      shortName: "C. Sainz",      number: 55, team: "Williams",        color: "#4AA3DD", aggression: 0.82, tireManagement: 0.86, consistency: 0.92, baseLapTime: 80.4 },
];

/* ─── Scenarios ──────────────────────────────────────────────────────────── */

export const SCENARIOS: Scenario[] = [
  {
    scenario_id: 0,
    name: "Italian GP Sprint",
    description: "Full 20-driver sprint race at Monza. 5 laps, standard conditions.",
    num_drivers: 20,
    num_laps: 5,
    aggression_factor: 1.0,
    pace_factor: 1.0,
    drivers: ["VER", "NOR", "LEC", "HAM", "PIA", "RUS", "LAW", "ANT", "ALO", "SAI", "GAS", "TSU", "HUL", "STR", "OCO", "BEA", "HAD", "DOO", "ALB", "BOR"],
  },
  {
    scenario_id: 1,
    name: "Championship Showdown",
    description: "Top 10 drivers pushing hard for championship points. 8 laps, high aggression.",
    num_drivers: 10,
    num_laps: 8,
    aggression_factor: 1.12,
    pace_factor: 0.99,
    drivers: ["VER", "NOR", "LEC", "HAM", "PIA", "RUS", "SAI", "ALO", "GAS", "TSU"],
  },
  {
    scenario_id: 2,
    name: "Monza Monsoon",
    description: "Unpredictable wet conditions with 15 drivers. High drama potential.",
    num_drivers: 15,
    num_laps: 6,
    aggression_factor: 0.88,
    pace_factor: 1.06,
    drivers: ["VER", "NOR", "HAM", "LEC", "PIA", "RUS", "SAI", "ALO", "GAS", "TSU", "ANT", "OCO", "HUL", "BEA", "ALB"],
  },
  {
    scenario_id: 3,
    name: "Three Way Shootout",
    description: "VER vs NOR vs LEC — 4 flat-out laps, maximum aggression.",
    num_drivers: 3,
    num_laps: 4,
    aggression_factor: 1.18,
    pace_factor: 0.985,
    drivers: ["VER", "NOR", "LEC"],
  },
  {
    scenario_id: 4,
    name: "Tire Strategy Duel",
    description: "12-lap marathon where tire management decides the winner.",
    num_drivers: 8,
    num_laps: 12,
    aggression_factor: 0.92,
    pace_factor: 1.01,
    drivers: ["HAM", "VER", "ALO", "PIA", "SAI", "RUS", "HUL", "NOR"],
  },
  {
    scenario_id: 5,
    name: "Midfield Battle",
    description: "The tight midfield pack battles for the minor points.",
    num_drivers: 10,
    num_laps: 6,
    aggression_factor: 1.06,
    pace_factor: 1.02,
    drivers: ["GAS", "TSU", "ALO", "STR", "OCO", "HUL", "BEA", "ALB", "HAD", "DOO"],
  },
  {
    scenario_id: 6,
    name: "Next Gen Challenge",
    description: "The rookies and young guns prove themselves on track.",
    num_drivers: 6,
    num_laps: 5,
    aggression_factor: 1.05,
    pace_factor: 1.03,
    drivers: ["ANT", "LAW", "DOO", "HAD", "BOR", "BEA"],
  },
];

/* ─── Internals ──────────────────────────────────────────────────────────── */

const compoundWearRate: Record<TireCompound, number> = { Soft: 15.5, Medium: 10.5, Hard: 7.25 };
const compoundPaceFactor: Record<TireCompound, number> = { Soft: 0.986, Medium: 1, Hard: 1.018 };

const driverById = new Map(DRIVER_PROFILES.map((d) => [d.id, d]));

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const modulo = (v: number, d: number) => ((v % d) + d) % d;

const gaussian = (x: number, center: number, width: number) => {
  const delta = Math.min(Math.abs(x - center), 1 - Math.abs(x - center));
  return Math.exp(-(delta * delta) / (2 * width * width));
};

/** Speed profile around one lap — Monza corners and straights (km/h) */
const trackSpeedProfile = (progress: number) => {
  const cornerDips =
    gaussian(progress, 0.08, 0.028) * 160 +
    gaussian(progress, 0.24, 0.034) * 120 +
    gaussian(progress, 0.47, 0.042) * 135 +
    gaussian(progress, 0.70, 0.032) * 110 +
    gaussian(progress, 0.88, 0.030) * 150;
  const straightBoost = Math.sin(progress * Math.PI * 4 - 0.6) * 12;
  return clamp(318 + straightBoost - cornerDips, 92, 342);
};

/** Compute a driver's nominal lap time for a given scenario + config */
const driverLapTime = (driver: DriverProfile, scenario: Scenario, config: RaceConfig) => {
  const weather = config.weather === "Wet" ? 1.18 : 1;
  const aggr = 1 - (driver.aggression - 0.82) * 0.045 * scenario.aggression_factor;
  return driver.baseLapTime * scenario.pace_factor * compoundPaceFactor[config.tireCompound] * weather * aggr;
};

/** Estimate total race duration so we know when to stop */
const estimateMaxTime = (scenario: Scenario, config: RaceConfig) => {
  const ids = scenario.drivers.slice(0, Math.min(config.numDrivers, scenario.num_drivers));
  const drivers = ids.map((id) => driverById.get(id)).filter(Boolean) as DriverProfile[];
  const slowest = drivers.reduce((s, d) => Math.max(s, driverLapTime(d, scenario, config)), 88);
  // Add a 15% buffer so the slowest car finishes all laps before time runs out
  return slowest * scenario.num_laps * 1.15;
};

/* ─── Public API ─────────────────────────────────────────────────────────── */

/**
 * Pure function: given scenario + config + wall-clock time → full race state.
 * No side effects, no async, fully deterministic.
 */
export const buildRaceState = (
  scenario: Scenario,
  config: RaceConfig,
  time: number,
  isPlaying: boolean,
  playbackSpeed: number,
): RaceState => {
  const maxTime = estimateMaxTime(scenario, config);
  const t = clamp(time, 0, maxTime);
  const driverIds = scenario.drivers.slice(0, Math.min(config.numDrivers, scenario.num_drivers));
  const weatherSpeedFactor = config.weather === "Wet" ? 0.82 : 1;
  const weatherWearFactor = config.weather === "Wet" ? 1.18 : 1;
  const gridSpacing = 350;

  const vehicles = driverIds
    .map((driverId, idx) => {
      const drv = driverById.get(driverId);
      if (!drv) return null;

      const lapTime = driverLapTime(drv, scenario, config);

      /* ── Tire wear ──────────────────────────────────────────────── */
      const wearRate = compoundWearRate[config.tireCompound];
      const mgmtFactor = 1.15 - drv.tireManagement * 0.45;
      const tireWear = clamp((t / lapTime) * wearRate * mgmtFactor * weatherWearFactor, 0, 98);

      /* ── Distance covered (tire degradation slows the car) ────── */
      const avgTirePenalty = 1 + (tireWear * 0.5) * 0.002;

      // Deterministic pace variation per driver (creates battles & overtakes)
      const seed = drv.baseLapTime * 1000 + drv.aggression * 100 + scenario.scenario_id * 7;
      const pv1 = Math.sin(t * 0.052 + seed) * 0.008;
      const pv2 = Math.sin(t * 0.021 + seed * 1.7) * 0.005;
      const cv  = Math.sin(t * 0.11 + drv.consistency * 10 + idx) * (1 - drv.consistency) * 0.015;
      const totalPaceVar = 1 + (pv1 + pv2 + cv) * scenario.aggression_factor;

      const effectiveLap = lapTime * avgTirePenalty * totalPaceVar;
      const raceDistance = (t / effectiveLap) * MONZA_TRACK_LENGTH - idx * gridSpacing;

      const totalRaceDistance = scenario.num_laps * MONZA_TRACK_LENGTH;
      const finishTime = ((totalRaceDistance + idx * gridSpacing) / MONZA_TRACK_LENGTH) * effectiveLap;
      const isFinished = t >= finishTime;

      const completedDistance = isFinished ? totalRaceDistance : Math.max(0, raceDistance);
      const lap = isFinished ? scenario.num_laps : clamp(Math.floor(completedDistance / MONZA_TRACK_LENGTH) + 1, 1, scenario.num_laps);

      /* ── Track position & display speed ─────────────────────── */
      const trackPosition = isFinished ? 0 : modulo(completedDistance, MONZA_TRACK_LENGTH);
      const progress = trackPosition / MONZA_TRACK_LENGTH;

      const chaosWave = Math.sin(t * 0.37 + idx * 1.73 + scenario.scenario_id) * config.chaosLevel;
      const tireSpeedFactor = 1 - tireWear * 0.0035;
      const aggrSpeedFactor = 0.96 + drv.aggression * 0.075 * scenario.aggression_factor;

      const speed = isFinished ? 0 : clamp(
        trackSpeedProfile(progress) * weatherSpeedFactor * tireSpeedFactor * aggrSpeedFactor * (1 + chaosWave * 0.035),
        config.weather === "Wet" ? 70 : 82,
        config.weather === "Wet" ? 288 : 346,
      );

      const status = isFinished
        ? "Finished"
        : (config.chaosLevel > 0.72 && Math.sin(t * 0.21 + idx * 2.4) > 0.965
            ? "Recovering"
            : "Racing");

      return {
        position: 0,
        name: drv.name,
        short_name: drv.shortName,
        driver_id: drv.id,
        number: drv.number,
        team: drv.team,
        color: drv.color,
        speed_kph: +speed.toFixed(1),
        lap,
        total_laps: scenario.num_laps,
        track_position: trackPosition,
        tire_wear: +tireWear.toFixed(1),
        tire_temp: isFinished ? 70.0 : +(78 + speed * 0.075 + tireWear * 0.42 + (config.weather === "Wet" ? -8 : 0)).toFixed(1),
        distance: completedDistance,
        aggression: drv.aggression,
        tire_management: drv.tireManagement,
        consistency: drv.consistency,
        tire_compound: config.tireCompound,
        status,
        gap_to_leader: 0,
        estimated_lap_time: +(lapTime * (1 + tireWear * 0.0025)).toFixed(3),
        best_lap_time: +(lapTime * (0.998 + (1 - drv.consistency) * 0.01)).toFixed(3),
        finish_time: finishTime,
      } satisfies Vehicle;
    })
    .filter(Boolean) as Vehicle[];

  // Sort by distance covered — most distance = P1
  // If finished, sort by finish time (earlier finish time = ahead)
  vehicles.sort((a, b) => {
    if (a.status === "Finished" && b.status === "Finished") {
      return (a.finish_time ?? 0) - (b.finish_time ?? 0);
    }
    return b.distance - a.distance;
  });

  const leader = vehicles[0];
  const leaderDist = leader?.distance ?? 0;
  const leaderSpeed = leader?.speed_kph ?? 200;

  const ranked = vehicles.map((v, i) => {
    let gap = 0;
    if (i > 0) {
      if (v.status === "Finished" && leader?.status === "Finished") {
        gap = +((v.finish_time ?? 0) - (leader.finish_time ?? 0)).toFixed(3);
      } else {
        gap = +((leaderDist - v.distance) / Math.max(leaderSpeed / 3.6, 1)).toFixed(3);
      }
    }
    return {
      ...v,
      position: i + 1,
      gap_to_leader: gap,
    };
  });

  return {
    time: t,
    vehicles: ranked,
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
    total_drivers: driverIds.length,
    race_progress: maxTime > 0 ? +clamp((t / maxTime) * 100, 0, 100).toFixed(1) : 0,
  };
};

/* ─── Data export ────────────────────────────────────────────────────────── */

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportRaceData = (raceState: RaceState, format: "json" | "csv" = "json") => {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const slug = raceState.scenario_name.replace(/\s+/g, "_").toLowerCase();

  if (format === "json") {
    const payload = {
      exported_at: new Date().toISOString(),
      scenario: raceState.scenario_name,
      circuit: raceState.circuit,
      weather: raceState.weather,
      tire_compound: raceState.tire_compound,
      total_laps: raceState.num_laps,
      race_time_s: raceState.time,
      race_progress_pct: raceState.race_progress,
      standings: raceState.vehicles.map((v) => ({
        position: v.position,
        driver: v.name,
        driver_id: v.driver_id,
        number: v.number,
        team: v.team,
        lap: v.lap,
        speed_kph: v.speed_kph,
        tire_wear_pct: v.tire_wear,
        tire_temp_c: v.tire_temp,
        gap_to_leader_s: v.gap_to_leader,
        estimated_lap_time_s: v.estimated_lap_time,
        best_lap_time_s: v.best_lap_time,
        status: v.status,
      })),
    };
    downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }), `race_oracle_${slug}_${ts}.json`);
  } else {
    const hdr = ["Position","Driver","#","Team","Lap","Speed km/h","Tire Wear %","Tire Temp °C","Gap s","Est Lap s","Best Lap s","Status"];
    const rows = raceState.vehicles.map((v) =>
      [v.position, `"${v.name}"`, v.number, `"${v.team}"`, v.lap, v.speed_kph, v.tire_wear, v.tire_temp, v.gap_to_leader, v.estimated_lap_time, v.best_lap_time, `"${v.status}"`].join(","),
    );
    downloadBlob(new Blob([[hdr.join(","), ...rows].join("\n")], { type: "text/csv" }), `race_oracle_${slug}_${ts}.csv`);
  }
};
