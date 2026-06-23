import { useState, type ReactNode } from "react";
import { Activity, ChevronDown, ChevronUp, CircleDot, Cloud, Flag, Gauge, MapPin, Download, FastForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { RaceConfig, RaceState, Scenario, TireCompound, WeatherCondition } from "@/lib/raceSimulation";

interface ConfigSectionProps {
  title: string;
  icon: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

const ConfigSection = ({ title, icon, isOpen, onToggle, children }: ConfigSectionProps) => (
  <div className="border-b border-border/30">
    <button
      onClick={onToggle}
      className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/20 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <span className="font-semibold text-sm">{title}</span>
      </div>
      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
    </button>
    {isOpen && <div className="px-4 py-3 space-y-4 bg-secondary/10">{children}</div>}
  </div>
);

interface ConfigPanelProps {
  scenarios: Scenario[];
  selectedScenario: number;
  onSelectScenario: (id: number) => void;
  raceState: RaceState;
  onSeek: (time: number) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  config: RaceConfig;
  onConfigChange: <K extends keyof RaceConfig>(key: K, value: RaceConfig[K]) => void;
  playbackSpeed: number;
  onPlaybackSpeedChange: (speed: number) => void;
  onExport: (format: "json" | "csv") => void;
}

const playbackOptions = [0.5, 1, 2, 5, 10, 20];

export const ConfigPanel = ({
  scenarios,
  selectedScenario,
  onSelectScenario,
  raceState,
  onSeek,
  isPlaying,
  onPlayPause,
  config,
  onConfigChange,
  playbackSpeed,
  onPlaybackSpeedChange,
  onExport,
}: ConfigPanelProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    scenarios: true,
    raceInfo: true,
    circuit: true,
    weather: true,
    tires: true,
    export: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((previous) => ({ ...previous, [section]: !previous[section] }));
  };

  const selectedScenarioData = scenarios.find((scenario) => scenario.scenario_id === selectedScenario) ?? scenarios[0];
  const maxDrivers = selectedScenarioData?.num_drivers ?? 5;
  const visibleDrivers = Math.min(config.numDrivers, maxDrivers);

  return (
    <aside className="glass-panel h-screen w-96 border-l border-border/50 flex flex-col overflow-hidden flex-shrink-0">
      <div className="h-16 px-4 border-b border-border/50 flex items-center justify-between flex-shrink-0">
        <h2 className="text-lg font-bold text-primary text-glow">CONFIGURATOR</h2>
        <Button variant="outline" size="sm" className="text-xs border-primary/30 hover:bg-primary/10 hover:text-primary transition-colors" onClick={onPlayPause}>
          {isPlaying ? "PAUSE" : "PLAY"}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <ConfigSection
          title="RACE SCENARIOS"
          icon={<Flag className="h-4 w-4" />}
          isOpen={openSections.scenarios}
          onToggle={() => toggleSection("scenarios")}
        >
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {scenarios.map((scenario) => (
              <button
                key={scenario.scenario_id}
                onClick={() => onSelectScenario(scenario.scenario_id)}
                className={`w-full text-left p-2 rounded-lg transition-colors text-xs ${
                  selectedScenario === scenario.scenario_id
                    ? "bg-primary/30 border border-primary text-primary"
                    : "bg-black/30 border border-gray-700 text-gray-300 hover:bg-black/50"
                }`}
              >
                <div className="font-semibold">{scenario.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {scenario.num_drivers} drivers / {scenario.num_laps} laps
                </div>
                <div className="text-xs text-gray-500">
                  Aggression {(scenario.aggression_factor * 100).toFixed(0)}%
                </div>
              </button>
            ))}
          </div>
        </ConfigSection>

        <ConfigSection
          title="RACE INFO"
          icon={<Activity className="h-4 w-4" />}
          isOpen={openSections.raceInfo}
          onToggle={() => toggleSection("raceInfo")}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="glass-panel rounded p-2 space-y-1">
              <div className="text-xs text-muted-foreground">Time</div>
              <div className="text-sm font-bold text-primary">
                {raceState.time.toFixed(1)}s / {raceState.max_time.toFixed(1)}s
              </div>
            </div>
            <div className="glass-panel rounded p-2 space-y-1">
              <div className="text-xs text-muted-foreground">Leader</div>
              <div className="text-sm font-bold text-primary truncate">{raceState.vehicles[0]?.short_name ?? "-"}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Timeline</Label>
            <Slider value={[raceState.time]} onValueChange={(value) => onSeek(value[0])} min={0} max={raceState.max_time} step={0.1} />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Playback Speed</Label>
            <div className="grid grid-cols-3 gap-2">
              {playbackOptions.map((speed) => (
                <Button
                  key={speed}
                  type="button"
                  variant={playbackSpeed === speed ? "default" : "outline"}
                  size="sm"
                  className="text-xs px-1"
                  onClick={() => onPlaybackSpeedChange(speed)}
                >
                  {speed}x
                </Button>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs flex items-center gap-1.5 justify-center mt-2 border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors"
            onClick={() => onSeek(raceState.max_time)}
          >
            <FastForward className="h-3.5 w-3.5" />
            Skip to End (Finish Race)
          </Button>
        </ConfigSection>

        <ConfigSection
          title="CIRCUIT"
          icon={<MapPin className="h-4 w-4" />}
          isOpen={openSections.circuit}
          onToggle={() => toggleSection("circuit")}
        >
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Circuit</Label>
            <Select value={config.circuit} onValueChange={(value) => onConfigChange("circuit", value as RaceConfig["circuit"])}>
              <SelectTrigger className="glass-panel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monza">Monza</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Drivers: {visibleDrivers}
            </Label>
            <Slider
              value={[visibleDrivers]}
              onValueChange={(value) => onConfigChange("numDrivers", value[0])}
              min={2}
              max={maxDrivers}
              step={1}
            />
          </div>
        </ConfigSection>

        <ConfigSection
          title="WEATHER"
          icon={<Cloud className="h-4 w-4" />}
          isOpen={openSections.weather}
          onToggle={() => toggleSection("weather")}
        >
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Condition</Label>
            <Select value={config.weather} onValueChange={(value) => onConfigChange("weather", value as WeatherCondition)}>
              <SelectTrigger className="glass-panel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dry">Dry</SelectItem>
                <SelectItem value="Wet">Wet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Chaos Level: {Math.round(config.chaosLevel * 100)}%
            </Label>
            <Slider
              value={[config.chaosLevel * 100]}
              onValueChange={(value) => onConfigChange("chaosLevel", value[0] / 100)}
              min={0}
              max={100}
              step={5}
            />
          </div>
        </ConfigSection>

        <ConfigSection
          title="TIRE STRATEGY"
          icon={<CircleDot className="h-4 w-4" />}
          isOpen={openSections.tires}
          onToggle={() => toggleSection("tires")}
        >
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Compound</Label>
            <Select value={config.tireCompound} onValueChange={(value) => onConfigChange("tireCompound", value as TireCompound)}>
              <SelectTrigger className="glass-panel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Soft">Soft</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="glass-panel rounded p-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Gauge className="h-4 w-4 text-primary" />
            <span>
              Fastest lap estimate {raceState.vehicles[0]?.estimated_lap_time.toFixed(3) ?? "-"}s
            </span>
          </div>
        </ConfigSection>

        <ConfigSection
          title="EXPORT DATA"
          icon={<Download className="h-4 w-4" />}
          isOpen={openSections.export}
          onToggle={() => toggleSection("export")}
        >
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs flex items-center gap-1.5 justify-center hover:bg-primary/20 hover:text-primary transition-colors border-primary/20"
              onClick={() => onExport("json")}
            >
              <Download className="h-3.5 w-3.5" />
              Export JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs flex items-center gap-1.5 justify-center hover:bg-primary/20 hover:text-primary transition-colors border-primary/20"
              onClick={() => onExport("csv")}
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          </div>
        </ConfigSection>
      </div>
    </aside>
  );
};
