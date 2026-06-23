# 🏎️ Race Oracle - F1 Simulation Visualizer

Race Oracle is a real-time Formula 1 race simulation visualizer that combines physics-based vehicle dynamics, AI driver personalities, and real F1 GPS track coordinates. It runs entirely in the browser with a high-fidelity visual interface.

---

## 🎯 Features

1. **Realistic Track Visualization**: Renders the Monza circuit with accurate geometry using real GPS coordinates. Cars (represented by colored, glowing, and numbered dots) move smoothly along the track line.
2. **Realistic Speed & Telemetry Profiles**: Cars travel at variable speeds — reaching 340+ km/h on straights, braking down to 80–150 km/h in corners — with progressive tire degradation.
3. **Driver Personalities**: 5 real F1 drivers (Verstappen, Hamilton, Norris, Leclerc, Sainz) with unique attributes:
   * **Aggression**: Pushes the car harder (higher top speeds, later braking) but increases tire wear.
   * **Tire Management**: High ratings preserve tire health, keeping speeds higher later in the stint.
   * **Consistency**: Determines how closely they stick to their optimal lap time profile.
4. **5 Race Scenarios**: Balanced Sprint, High Aggression, Tire Management Run, Three Car Shootout, and Wet Practice.
5. **Interactive Controls & Playback**: Play, pause, seek through the race timeline, and modify playback speed (0.5x, 1x, 2x) in real-time.
6. **Configurable Conditions**: Switch weather (Dry/Wet), tire compounds (Soft/Medium/Hard), driver count, and chaos level on the fly.

---

## 📁 Project Directory Structure

```
race-oracle-Mvp/
├── public/
│   └── tracks/
│       ├── monza_track.json       # Geometric coordinates for Monza
│       └── monza_track_real.json  # Real F1 GPS data
├── src/
│   ├── components/
│   │   ├── TrackVisualization.tsx  # SVG drawing of Monza track and cars
│   │   ├── ConfigPanel.tsx        # Scenario selection & playback settings
│   │   ├── Sidebar.tsx            # Navigation sidebar
│   │   ├── panels/
│   │   │   ├── DriversPanel.tsx   # Driver details and stats
│   │   │   ├── AnalyticsPanel.tsx # Race analytics and charts
│   │   │   └── SettingsPanel.tsx  # App settings
│   │   └── ui/                    # shadcn/ui component library
│   ├── lib/
│   │   └── raceSimulation.ts      # Client-side physics engine & simulation
│   ├── pages/
│   │   ├── Index.tsx              # Main dashboard layout
│   │   └── NotFound.tsx           # 404 page
│   ├── hooks/                     # React hooks
│   ├── App.tsx                    # App root with routing
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Design system & theme
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

---

## 🚀 Quick Start

Ensure you have **Node.js 18+** installed.

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open **[http://localhost:8080](http://localhost:8080)** in your browser, click **Play**, and watch the race!

---

## 📊 Telemetry & Physics Calculations

The simulation calculates live positions and telemetry details dynamically in the browser:

### 1. Tire Wear Degradation
The tire wear increases each lap based on the driver's tire management profile and compound choice:
$$\text{Wear Per Lap} = (Lap - 1) \times (1 - \text{Tire Management Skill}) \times 0.15$$

### 2. Speeds in Corners vs. Straights
The baseline speed is obtained from a track speed profile (Gaussian corner dips) and adjusted based on tire wear and driver aggression:
$$\text{Final Speed} = \text{Base Speed} \times \text{Track Section Factor} \times (1 - \text{Tire Wear} \times 0.5) \times (0.95 + \text{Aggression} \times 0.1)$$

### 3. Track Looping Position
To ensure smooth looping of laps, the position is calculated as:
$$\text{Track Position} = \text{Total Distance Covered} \pmod{\text{Track Length}}$$
The frontend searches the closest coordinates corresponding to this `track_position` to draw the car on the screen.

---

## 🔮 Future Enhancements

- [ ] **Pit Stop Implementation**: Divert cars into a pit lane when tire wear exceeds a threshold, freeze speed, reset tires, and release.
- [ ] **Overtaking Logic**: Safety bubbles around cars with aggression-based passing maneuvers.
- [ ] **Dynamic Weather Effects**: Real-time weather shifts affecting grip and lap times.
- [ ] **Track Additions**: Add more circuits (Spa, Silverstone, Monaco) using GPS coordinate data.

---

**Enjoy your F1 Telemetry Visualizer! 🏁**
