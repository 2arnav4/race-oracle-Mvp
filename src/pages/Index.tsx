import { useEffect, useMemo, useRef, useState } from "react";
import { Sidebar, ViewType } from "@/components/Sidebar";
import { TrackVisualization } from "@/components/TrackVisualization";
import { ConfigPanel } from "@/components/ConfigPanel";
import { DriversPanel } from "@/components/panels/DriversPanel";
import { AnalyticsPanel } from "@/components/panels/AnalyticsPanel";
import { SettingsPanel } from "@/components/panels/SettingsPanel";
import {
  buildRaceState,
  DEFAULT_CONFIG,
  RaceConfig,
  SCENARIOS,
} from "@/lib/raceSimulation";

const Index = () => {
  const [activeView, setActiveView] = useState<ViewType>("dashboard");
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [config, setConfig] = useState<RaceConfig>(DEFAULT_CONFIG);
  const frameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);

  const currentScenario = SCENARIOS[selectedScenario] ?? SCENARIOS[0];

  const raceState = useMemo(
    () => buildRaceState(currentScenario, config, currentTime, isPlaying, playbackSpeed),
    [config, currentScenario, currentTime, isPlaying, playbackSpeed],
  );

  useEffect(() => {
    if (!isPlaying) {
      lastFrameTimeRef.current = null;
      return;
    }

    const tick = (timestamp: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp;
      }

      const deltaSeconds = (timestamp - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = timestamp;

      setCurrentTime((time) => {
        const nextTime = Math.min(time + deltaSeconds * playbackSpeed, raceState.max_time);
        if (nextTime >= raceState.max_time) {
          setIsPlaying(false);
        }
        return nextTime;
      });

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, raceState.max_time]);

  const onConfigChange = <K extends keyof RaceConfig>(key: K, value: RaceConfig[K]) => {
    setConfig((previous) => ({ ...previous, [key]: value }));
  };

  const playRace = () => {
    if (currentTime >= raceState.max_time) {
      setCurrentTime(0);
    }
    setIsPlaying(true);
  };

  const pauseRace = () => setIsPlaying(false);

  const selectScenario = (scenarioId: number) => {
    const index = SCENARIOS.findIndex((scenario) => scenario.scenario_id === scenarioId);
    if (index === -1) return;

    setSelectedScenario(index);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const seekToTime = (time: number) => {
    setCurrentTime(Math.max(0, Math.min(time, raceState.max_time)));
  };

  const renderMainContent = () => {
    switch (activeView) {
      case "dashboard":
        return <TrackVisualization raceState={raceState} />;
      case "drivers":
        return <DriversPanel raceState={raceState} />;
      case "analytics":
        return <AnalyticsPanel raceState={raceState} />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <TrackVisualization raceState={raceState} />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <main className="flex-1 overflow-hidden relative">
        <div className="absolute top-4 left-4 z-50 flex gap-2">
          <div className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
            Local Demo
          </div>

          {isPlaying && (
            <div className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse">
              Playing
            </div>
          )}
        </div>

        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
          {!isPlaying ? (
            <button
              onClick={playRace}
              className="px-4 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg text-sm font-medium transition-colors"
            >
              Play
            </button>
          ) : (
            <button
              onClick={pauseRace}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Pause
            </button>
          )}
        </div>

        <div className="absolute top-4 right-96 z-50 bg-black/70 backdrop-blur-md rounded-lg px-4 py-2 border border-primary/20 text-xs text-gray-300">
          <div>
            {currentScenario.name}: {raceState.vehicles.length} drivers, {currentScenario.num_laps} laps
          </div>
          <div className="text-gray-500">
            {raceState.weather} / {raceState.tire_compound} / {(raceState.playback_speed * 100).toFixed(0)}%
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
      />
    </div>
  );
};

export default Index;
