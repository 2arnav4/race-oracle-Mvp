import { useState, useEffect, useRef } from "react";
import { Sidebar, ViewType } from "@/components/Sidebar";
import { TrackVisualization } from "@/components/TrackVisualization";
import { ConfigPanel } from "@/components/ConfigPanel";
import { SimulationConfigModal } from "@/components/SimulationConfigModal";
import { DashboardPanel } from "@/components/panels/DashboardPanel";
import { DriversPanel } from "@/components/panels/DriversPanel";
import { AnalyticsPanel } from "@/components/panels/AnalyticsPanel";
import { SettingsPanel } from "@/components/panels/SettingsPanel";

type Vehicle = {
  name: string;
  driver_id: string;
  color: string;
  speed_kph: number;
  lap: number;
  track_position: number;
  tire_wear: number;
  tire_temp: number;
  distance: number;
  aggression: number;
};

type RaceState = {
  time: number;
  vehicles: Vehicle[];
  scenario_id: number;
  is_playing: boolean;
  max_time: number;
  playback_speed: number;
};

type Scenario = {
  scenario_id: number;
  num_drivers: number;
  num_laps: number;
  aggression_factor: number;
  drivers: string[];
};

const Index = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeView, setActiveView] = useState<ViewType>("dashboard");
  const [raceState, setRaceState] = useState<RaceState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  // 🆕 CONFIG STATE
  const [config, setConfig] = useState({
    circuit: "monza",
    numDrivers: 5,
    weather: "Dry",
    chaosLevel: 0.25,
    tireCompound: "Medium",
  });

  // 🆕 CONFIG HANDLER
  const onConfigChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // Load scenarios on mount
  useEffect(() => {
    const loadScenarios = async () => {
      try {
        const res = await fetch("http://localhost:8000/data/scenarios");
        const data = await res.json();
        console.log("Scenarios loaded:", data);
        setScenarios(data.scenarios || []);
      } catch (err) {
        console.error("Failed to load scenarios:", err);
      }
    };
    loadScenarios();
  }, []);

  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/simulation");

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);

      // Auto-select and play first scenario
      if (scenarios.length > 0) {
        ws.send(JSON.stringify({
          type: "SELECT_SCENARIO",
          scenario_id: selectedScenario,
        }));

        setTimeout(() => {
          ws.send(JSON.stringify({ type: "PLAY" }));
          setIsPlaying(true);
        }, 500);
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "SCENARIO_SELECTED") {
        console.log("Scenario selected:", data.scenario_id);
      } else if (!data.type) {
        // Race state update
        setRaceState(data);
      }
    };

    ws.onerror = (error) => console.error("WebSocket error:", error);

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    socketRef.current = ws;
    return () => ws.close();
  }, [scenarios, selectedScenario]);

  const playRace = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.send(JSON.stringify({ type: "PLAY" }));
      setIsPlaying(true);
    }
  };

  const pauseRace = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.send(JSON.stringify({ type: "PAUSE" }));
      setIsPlaying(false);
    }
  };

  const selectScenario = (scenarioId: number) => {
    setSelectedScenario(scenarioId);

    if (socketRef.current && isConnected) {
      socketRef.current.send(JSON.stringify({
        type: "SELECT_SCENARIO",
        scenario_id: scenarioId,
      }));

      setTimeout(() => {
        socketRef.current?.send(JSON.stringify({ type: "PLAY" }));
        setIsPlaying(true);
      }, 500);
    }
  };

  const seekToTime = (time: number) => {
    if (socketRef.current && isConnected) {
      socketRef.current.send(JSON.stringify({
        type: "SEEK",
        time: time,
      }));
    }
  };

  const currentScenario = scenarios[selectedScenario];

  const renderMainContent = () => {
    switch (activeView) {
      case "dashboard": return <TrackVisualization raceState={raceState} />;
      case "drivers": return <DriversPanel />;
      case "analytics": return <AnalyticsPanel />;
      case "settings": return <SettingsPanel />;
      default: return <TrackVisualization raceState={raceState} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <main className="flex-1 overflow-hidden relative">

        {/* Connection & Status Indicators */}
        <div className="absolute top-4 left-4 z-50 flex gap-2">
          <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
            isConnected 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {isConnected ? '● Connected' : '● Disconnected'}
          </div>

          {isPlaying && (
            <div className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse">
              ● Playing
            </div>
          )}
        </div>

        {/* Playback Controls */}
        {isConnected && scenarios.length > 0 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
            {!isPlaying ? (
              <button
                onClick={playRace}
                className="px-4 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg text-sm font-medium transition-colors"
              >
                ▶ Play
              </button>
            ) : (
              <button
                onClick={pauseRace}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                ⏸ Pause
              </button>
            )}
          </div>
        )}

        {/* Scenario Info */}
        {scenarios.length > 0 && currentScenario && (
          <div className="absolute top-4 right-96 z-50 bg-black/70 backdrop-blur-md rounded-lg px-4 py-2 border border-primary/20 text-xs text-gray-300">
            <div>Scenario {currentScenario.scenario_id + 1}: {currentScenario.num_drivers} drivers, {currentScenario.num_laps} laps</div>
            <div className="text-gray-500">Aggression: {(currentScenario.aggression_factor * 100).toFixed(0)}%</div>
          </div>
        )}

        {renderMainContent()}
      </main>

      {/* RIGHT SIDEBAR PANEL */}
      <ConfigPanel 
        scenarios={scenarios}
        selectedScenario={selectedScenario}
        onSelectScenario={selectScenario}
        raceState={raceState}
        onSeek={seekToTime}
        isPlaying={isPlaying}
        onPlayPause={() => isPlaying ? pauseRace() : playRace()}
        config={config}
        onConfigChange={onConfigChange}
      />
    </div>
  );
};

export default Index;
