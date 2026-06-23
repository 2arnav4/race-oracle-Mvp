# 🏎️ Race Oracle - F1 Simulation Visualizer

Race Oracle is a real-time Formula 1 race simulation visualizer that combines physics-based vehicle dynamics, AI driver personalities, and real F1 GPS track coordinates. It utilizes Monte Carlo simulation methods to pre-generate and play back dynamic race scenarios, with a high-fidelity visual interface.

---

## 🎯 What We Were Supposed to Build (Project Goals & Scope)

The goal of the Race Oracle MVP is to provide a complete, interactive, and visually stunning telemetry dashboard for F1 race simulations. The application was designed to achieve:

1. **Realistic Track Visualization**: Renders F1 circuits (specifically Monza) with accurate geometry using coordinates mapping. Cars (represented by colored, glowing, and numbered dots) move smoothly along the track line.
2. **Realistic Speed & Telemetry Profiles**: Cars must not travel at constant speed. Instead, speeds must vary realistically (e.g., reaching 340+ km/h on straights, braking down to 80-150 km/h in corners) and degrade progressively as tire wear increases.
3. **Driver Personalities**: AI drivers behave differently based on specific attributes:
   * **Aggression**: Pushes the car harder (higher top speeds, later braking) but increases tire wear and risk of mistakes.
   * **Tire Management**: High ratings preserve tire health, keeping speeds higher later in the stint.
   * **Consistency**: Determines how closely they stick to their optimal lap time profile versus making simulated driving errors.
4. **Monte Carlo Simulations**: Pre-generated race scenarios (15 distinct configs) where each driver's performance varies from lap to lap using statistical distribution curves.
5. **Interactive Controls & Playback**: Users can play, pause, seek through the race timeline, and modify playback speed (e.g., 0.5x, 1x, 2x) in real-time.
6. **FastF1 Data Pipeline**: Integration with the `FastF1` python library to pull real GPS, speed, and braking telemetry from actual Grand Prix sessions.

---

## 🛠️ How It Can Be Fixed / What Was Fixed (Troubleshooting & Core Solutions)

During development, several technical challenges and bugs were resolved to make the MVP fully operational:

### 1. TypeScript Type Errors & Hidden UI controls
* **The Issue**: A mismatch in telemetry and configuration state type definitions caused the frontend typescript compilation to fail, hiding the green **"▶ Play"** button and layout panels.
* **The Fix**: Standardized all telemetry interface definitions in `src/types/` (aligning drivers, vehicles, and playback speed state) and cleaned up duplicate declarations. 

### 2. Python Environment Conflicts (PEP 668)
* **The Issue**: Trying to install packages globally with `pip install` on macOS/Linux throws the `externally-managed-environment` error, preventing dependencies like `FastAPI`, `FastF1`, and `pandas` from being installed.
* **The Fix**: Isolate the environment by building a Python Virtual Environment (`venv`). The README and run scripts have been updated to enforce creating and activating `.venv` before running package installation commands.

### 3. FastF1 Data-Fetching Failure & Cache Latency
* **The Issue**: The FastF1 API downloads large datasets (~hundreds of MBs) directly from F1 databases. This can lead to startup hangs, timeouts, or complete failures if the user is offline or the F1 server is rate-limiting.
* **The Fix**: 
  * Implemented file-based caching for FastF1 sessions in `backend/src/cache/`.
  * Designed a dual-backend fallback system in `backend/src/main.py`. The server attempts to import the real GPS-based F1 simulation (`race_data_real.py`). If it fails or FastF1 isn't installed, it falls back gracefully to a fully local Monte Carlo simulator (`race_data.py`), ensuring the app always starts.

### 4. Overlapping Vehicles & Start-line Grid Spacing
* **The Issue**: Vehicles originally spawned at the exact same track coordinate, causing them to overlap and appear as a single dot on the start line.
* **The Fix**: Added grid-spacing logic in `backend/src/simulation.py` and `backend/src/race_data_real.py` to offset drivers by 100 meters at the start of the race, mimicking a real grid formation.

---

## 📁 Project Directory Structure

```
race-oracle-Mvp/
├── backend/
│   ├── src/
│   │   ├── main.py              # FastAPI server with WebSockets
│   │   ├── race_data.py         # Fallback Monte Carlo race generator (local physics)
│   │   ├── race_data_real.py    # Monte Carlo race generator using FastF1 track coordinate points
│   │   ├── fetch_real_data.py   # Script to pull GPS & speed data using FastF1 API
│   │   ├── physics.py           # Dynamics engine (Tire grip budget, braking physics)
│   │   └── simulation.py        # Race controller and state broadcaster
│   ├── requirements.txt         # Backend packages list
│   └── SETUP_REAL_DATA.md       # FastF1 data guide
├── public/
│   └── tracks/
│       ├── monza_track.json      # Hardcoded geometric coordinates for Monza
│       └── monza_track_real.json # Real F1 GPS data saved by fetch_real_data.py
├── src/
│   ├── components/
│   │   ├── TrackVisualization.tsx # Canvas/SVG drawing of Monza track and cars
│   │   └── ConfigPanel.tsx        # Scenario selection & playback settings
│   ├── pages/
│   │   └── Index.tsx             # Main dashboard layout and WebSocket hook
│   └── package.json              # Frontend scripts and dependencies
├── QUICK_START.sh                # Automation script to launch both servers
└── README.md                     # Comprehensive project documentation
```

---

## 🚀 Installation & Quick Start

Ensure you have **Python 3.10+** and **Node.js 18+** installed.

### Option A: Automatic Startup (Recommended)

Run the automated script in your terminal from the root folder:
```bash
chmod +x QUICK_START.sh
./QUICK_START.sh
```
This script starts the backend server, installs frontend dependencies, runs the development Vite server, and tells you to open your browser.

---

### Option B: Manual Startup (Step-by-Step)

If you prefer to run the components individually:

#### 1. Set Up the Python Backend
Open a terminal window and run:
```bash
# 1. Navigate to backend directory
cd backend

# 2. Create a virtual environment (fixes PEP 668 restrictions)
python3 -m venv .venv

# 3. Activate the environment
source .venv/bin/activate  # On Windows, use: .venv\Scripts\activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Start the FastAPI server
cd src
python3 main.py
```
You should see:
`Uvicorn running on http://0.0.0.0:8000`

*(Optional)* **Fetch Real F1 Telemetry**:
If you want to download real GPS telemetry for Monza instead of using default points, run this while inside the activated virtual environment:
```bash
python3 fetch_real_data.py
```

#### 2. Set Up the React Frontend
Open a **new terminal window** in the root directory:
```bash
# Install NPM packages
npm install

# Start Vite dev server
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 📊 Telemetry & Physics Calculations

The simulation calculates live positions and telemetry details dynamically:

### 1. Tire Wear Degradation
The tire wear increases each lap based on the driver's tire management profile and compound choice:
$$\text{Wear Per Lap} = (\text{Lap} - 1) \times (1 - \text{Tire Management Skill}) \times 0.15$$

### 2. Speeds in Corners vs. Straights
The baseline speed is obtained from either the track coordinates database (straights vs corner sections) and adjusted based on tire wear and driver aggression:
$$\text{Final Speed} = \text{Base Speed} \times \text{Track Section Factor} \times (1 - \text{Tire Wear} \times 0.5) \times (0.95 + \text{Aggression} \times 0.1)$$

### 3. Track Looping Position
To ensure smooth looping of laps, the position is calculated as:
$$\text{Track Position} = \text{Total Distance Covered} \pmod{\text{Track Length}}$$
The frontend searches the closest coordinates corresponding to this `track_position` to draw the car on the screen.

---

## 🔮 Future Enhancements & Extensions

If you wish to build upon this MVP, here is the technical roadmap:

- [ ] **Pit Stop Implementation**: Add a simulated pit lane segment on the track layout. When tire wear exceeds a specific threshold (e.g., 70%), routing logic should divert the car into the pit lane, freeze its speed to 80 km/h, wait for 3 seconds (tyre change), reset tire wear to 0%, and release it back to the track.
- [ ] **Overtaking Logic**: Introduce safety bubbles around coordinates. If a car's distance matches another car's distance within 15 meters, compare aggression stats. The faster car should deflect slightly off the central ideal line to bypass the slower car.
- [ ] **Dynamic Weather Effects**: Weather shifts from Dry to Wet could trigger an overlay on the map (rain effects) and instantly multiply the grip budget of tires by 0.6x, leading to slower lap times and higher consistency mistakes (spins/yellow flags).
- [ ] **Track Additions**: Use `fetch_real_data.py` to target other tracks by modifying the session query (e.g. `Spa`, `Silverstone`, `Monaco`) and save their coordinate arrays under `public/tracks/`.

---

**Enjoy your F1 Telemetry Visualizer! 🏁**
