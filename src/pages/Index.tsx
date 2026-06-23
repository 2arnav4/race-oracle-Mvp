import { useEffect, useMemo, useRef, useState } from "react";
import { Sidebar, ViewType } from "@/components/Sidebar";
import { TrackVisualization } from "@/components/TrackVisualization";
import { ConfigPanel } from "@/components/ConfigPanel";
import { DriversPanel } from "@/components/panels/DriversPanel";
import { AnalyticsPanel } from "@/components/panels/AnalyticsPanel";
import { SettingsPanel } from "@/components/panels/SettingsPanel";
import { toast } from "sonner";
import {
  AppSettings,
  buildRaceState,
  DEFAULT_CONFIG,
  DEFAULT_SETTINGS,
  exportRaceData,
  RaceConfig,
  SCENARIOS,
  RaceState,
} from "@/lib/raceSimulation";

const Index = () => {
  const [activeView, setActiveView] = useState<ViewType>("dashboard");
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [config, setConfig] = useState<RaceConfig>(DEFAULT_CONFIG);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  
  // Backend connection state
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [backendRaceState, setBackendRaceState] = useState<RaceState | null>(null);
  
  const socketRef = useRef<WebSocket | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);

  const currentScenario = SCENARIOS[selectedScenario] ?? SCENARIOS[0];

  // Resolve active race state: Backend telemetry or Local client-side simulation
  const raceState = useMemo(() => {
    if (isBackendConnected && backendRaceState) {
      return backendRaceState;
    }
    return buildRaceState(currentScenario, config, currentTime, isPlaying, playbackSpeed);
  }, [isBackendConnected, backendRaceState, currentScenario, config, currentTime, isPlaying, playbackSpeed]);

  /* ── WebSocket Integration ────────────────────────────────────────── */
  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connectBackend = () => {
      console.log("Connecting to FastAPI backend WebSocket...");
      socket = new WebSocket("ws://localhost:8000/ws/simulation");

      socket.onopen = () => {
        console.log("FastAPI backend WebSocket connected!");
        setIsBackendConnected(true);
        toast.success("Connected to FastAPI Backend", {
          description: "Live real-time telemetry streaming is active.",
        });

        // Initialize backend state with current scenario and playback speed
        socket?.send(JSON.stringify({
          type: "SELECT_SCENARIO",
          scenario_id: selectedScenario,
        }));
        socket?.send(JSON.stringify({
          type: "SET_SPEED",
          speed: playbackSpeed,
        }));
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === "SCENARIO_SELECTED") {
            console.log("Backend scenario selected:", data.scenario_id);
          } else if (data.type === "PLAYING") {
            setIsPlaying(true);
          } else if (data.type === "PAUSED") {
            setIsPlaying(false);
          } else if (data.type === "SEEKED") {
            setCurrentTime(data.time);
          } else if (data.type === "SPEED_CHANGED") {
            setPlaybackSpeed(data.speed);
          } else if (data.vehicles && Array.isArray(data.vehicles)) {
            // Receive standard telemetry snapshot
            // Map backend naming to match frontend schema
            const mappedVehicles = data.vehicles.map((v: any, idx: number) => ({
              position: v.position ?? (idx + 1),
              name: v.name,
              short_name: v.short_name ?? v.name.split(" ").pop() ?? "",
              driver_id: v.driver_id ?? "",
              number: v.number ?? (idx + 1),
              team: v.team ?? "Formula 1",
              color: v.color ?? "#fff",
              speed_kph: v.speed_kph ?? v.speed ?? 0,
              lap: v.lap ?? 1,
              total_laps: data.num_laps ?? currentScenario.num_laps,
              track_position: v.track_position ?? 0,
              tire_wear: v.tire_wear ?? 0,
              tire_temp: v.tire_temp ?? 70,
              distance: v.distance ?? 0,
              aggression: v.aggression ?? 0.8,
              tire_management: v.tire_management ?? 0.8,
              consistency: v.consistency ?? 0.8,
              tire_compound: v.tire_compound ?? config.tireCompound,
              status: v.status ?? "Racing",
              gap_to_leader: v.gap_to_leader ?? 0,
              estimated_lap_time: v.estimated_lap_time ?? 80.0,
              best_lap_time: v.best_lap_time ?? 80.0,
            }));

            setBackendRaceState({
              time: data.time ?? 0,
              vehicles: mappedVehicles,
              scenario_id: data.scenario_id ?? selectedScenario,
              scenario_name: data.scenario_name ?? currentScenario.name,
              is_playing: data.is_playing ?? false,
              max_time: data.max_time ?? 400.0,
              playback_speed: data.playback_speed ?? playbackSpeed,
              weather: data.weather ?? config.weather,
              circuit: data.circuit ?? "Monza",
              track_file: "monza_track.json",
              track_length: data.track_length ?? 57612.99,
              num_laps: data.num_laps ?? currentScenario.num_laps,
              tire_compound: data.tire_compound ?? config.tireCompound,
              total_drivers: mappedVehicles.length,
              race_progress: data.race_progress ?? (data.max_time > 0 ? (data.time / data.max_time) * 100 : 0),
            });
            
            setCurrentTime(data.time ?? 0);
            setIsPlaying(data.is_playing ?? false);
          }
        } catch (err) {
          console.error("Failed to parse WebSocket telemetry data:", err);
        }
      };

      socket.onclose = () => {
        console.log("FastAPI backend WebSocket closed. Reconnecting...");
        setIsBackendConnected(false);
        setBackendRaceState(null);
        
        // Try to reconnect in 5 seconds
        reconnectTimeout = setTimeout(connectBackend, 5000);
      };

      socket.onerror = (err) => {
        console.error("WebSocket connection error:", err);
        socket?.close();
      };

      socketRef.current = socket;
    };

    connectBackend();

    return () => {
      if (socket) {
        socket.close();
      }
      clearTimeout(reconnectTimeout);
    };
  }, [selectedScenario]);

  // Sync controls to backend when connection state is active
  useEffect(() => {
    if (isBackendConnected && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "SET_SPEED",
        speed: playbackSpeed,
      }));
    }
  }, [playbackSpeed, isBackendConnected]);

  /* ── Local Animation Loop (Runs when backend is disconnected) ─────── */
  useEffect(() => {
    if (isBackendConnected || !isPlaying) {
      lastFrameTimeRef.current = null;
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      return;
    }

    const tick = (timestamp: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp;
      }

      const deltaSeconds = (timestamp - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = timestamp;

      setCurrentTime((prev) => {
        const next = Math.min(prev + deltaSeconds * playbackSpeed, raceState.max_time);
        if (next >= raceState.max_time) {
          setIsPlaying(false);
          toast.success("Race completed!", {
            description: `All drivers finished the ${currentScenario.name}.`,
          });
        }
        return next;
      });

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [isPlaying, playbackSpeed, raceState.max_time, isBackendConnected, currentScenario.name]);

  // Sync theme changes with system preferences
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.darkMode]);

  /* ── Handlers ───────────────────────────────────────────────────── */
  const onConfigChange = <K extends keyof RaceConfig>(key: K, value: RaceConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    toast.success(`Configuration updated`, {
      description: `${key} changed to ${value}.`,
    });
  };

  const onSettingsChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const playRace = () => {
    if (currentTime >= raceState.max_time) {
      seekToTime(0);
    }
    
    if (isBackendConnected && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "PLAY" }));
    } else {
      setIsPlaying(true);
    }
  };

  const pauseRace = () => {
    if (isBackendConnected && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "PAUSE" }));
    } else {
      setIsPlaying(false);
    }
  };

  const selectScenario = (scenarioId: number) => {
    const index = SCENARIOS.findIndex((s) => s.scenario_id === scenarioId);
    if (index === -1) return;

    setSelectedScenario(index);
    setCurrentTime(0);
    
    if (isBackendConnected && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "SELECT_SCENARIO",
        scenario_id: scenarioId,
      }));
      if (settings.autoPlayOnSelect) {
        setTimeout(() => {
          socketRef.current?.send(JSON.stringify({ type: "PLAY" }));
        }, 300);
      }
    } else {
      if (settings.autoPlayOnSelect) {
        setIsPlaying(true);
      }
    }
  };

  const seekToTime = (time: number) => {
    const targetTime = Math.max(0, Math.min(time, raceState.max_time));
    if (isBackendConnected && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "SEEK",
        time: targetTime,
      }));
    } else {
      setCurrentTime(targetTime);
    }
  };

  const handleExport = (format: "json" | "csv") => {
    exportRaceData(raceState, format);
    toast.success("Race telemetry exported", {
      description: `Downloaded file in ${format.toUpperCase()} format.`,
    });
  };

  /* ── Render ─────────────────────────────────────────────────────── */
  const renderMainContent = () => {
    switch (activeView) {
      case "dashboard":
        return <TrackVisualization raceState={raceState} settings={settings} />;
      case "drivers":
        return <DriversPanel raceState={raceState} />;
      case "analytics":
        return <AnalyticsPanel raceState={raceState} />;
      case "settings":
        return <SettingsPanel settings={settings} onSettingsChange={onSettingsChange} />;
      default:
        return <TrackVisualization raceState={raceState} settings={settings} />;
    }
  };

  const isFinished = currentTime >= raceState.max_time;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <main className="flex-1 overflow-hidden relative">
        {/* Status badges */}
        <div className="absolute top-4 left-4 z-50 flex gap-2">
          {isBackendConnected ? (
            <div className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30 shadow-lg shadow-green-500/10">
              ● FastAPI Backend
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10">
              ● Local Sandbox
            </div>
          )}
          
          {isPlaying && (
            <div className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse shadow-lg shadow-red-500/10">
              LIVE
            </div>
          )}
          
          {isFinished && (
            <div className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shadow-lg shadow-yellow-500/10">
              FINISHED
            </div>
          )}
        </div>

        {/* Play / Pause / Restart */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
          {!isPlaying ? (
            <button
              onClick={playRace}
              className="px-5 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg text-sm font-semibold transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
            >
              {isFinished ? "🔄 Restart Race" : "▶ Play Telemetry"}
            </button>
          ) : (
            <button
              onClick={pauseRace}
              className="px-5 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-yellow-600/20 hover:scale-105 active:scale-95"
            >
              ⏸ Pause Telemetry
            </button>
          )}
        </div>

        {/* Scenario info banner */}
        <div className="absolute top-4 right-[25rem] z-50 bg-black/70 backdrop-blur-md rounded-lg px-4 py-2.5 border border-primary/20 text-xs text-gray-300 shadow-2xl max-w-sm">
          <div className="font-bold text-primary text-glow text-sm truncate">
            {currentScenario.name}
          </div>
          <div className="text-gray-400 mt-0.5 font-medium">
            {raceState.total_drivers} drivers · {currentScenario.num_laps} laps · {raceState.weather}
          </div>
          <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-300"
              style={{ width: `${raceState.race_progress}%` }}
            />
          </div>
        </div>

        {renderMainContent()}
      </main>

      <ConfigPanel
        scenarios={SCENARIOS}
        selectedScenario={currentScenario.scenario_id}
        onSelectScenario={selectScenario}
        raceState={raceState}
        onSeek={seekToTime}
        isPlaying={isPlaying}
        onPlayPause={() => (isPlaying ? pauseRace() : playRace())}
        config={config}
        onConfigChange={onConfigChange}
        playbackSpeed={playbackSpeed}
        onPlaybackSpeedChange={setPlaybackSpeed}
        onExport={handleExport}
      />
    </div>
  );
};

export default Index;
