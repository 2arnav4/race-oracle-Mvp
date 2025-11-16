import { useState } from "react";
import { 
  MapPin, Cloud, CircleDot, Fuel, Users, Wrench, 
  Flag, Activity, Shuffle, ChevronDown, ChevronUp 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ConfigSectionProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
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
    {isOpen && <div className="px-4 py-3 space-y-3 bg-secondary/10">{children}</div>}
  </div>
);

export const ConfigPanel = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    circuit: true,
    weather: false,
    tires: false,
    fuel: false,
    drivers: false,
    reliability: false,
    events: false,
    live: false,
    simulation: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside className="glass-panel h-screen w-96 border-l border-border/50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-16 px-4 border-b border-border/50 flex items-center justify-between flex-shrink-0">
        <h2 className="text-lg font-bold text-primary text-glow">
          CONFIGURATOR
        </h2>
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs"
        >
          RESET ALL
        </Button>
      </div>

      {/* Scrollable config sections */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {/* Circuit Selection */}
        <ConfigSection
          title="CIRCUIT"
          icon={<MapPin className="h-4 w-4" />}
          isOpen={openSections.circuit}
          onToggle={() => toggleSection("circuit")}
        >
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Select Circuit</Label>
            <Select defaultValue="silverstone">
              <SelectTrigger className="glass-panel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="silverstone">Silverstone</SelectItem>
                <SelectItem value="monaco">Monaco</SelectItem>
                <SelectItem value="spa">Spa-Francorchamps</SelectItem>
                <SelectItem value="monza">Monza</SelectItem>
                <SelectItem value="suzuka">Suzuka</SelectItem>
                <SelectItem value="custom">Build Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </ConfigSection>

        {/* Weather Conditions */}
        <ConfigSection
          title="WEATHER CONDITIONS"
          icon={<Cloud className="h-4 w-4" />}
          isOpen={openSections.weather}
          onToggle={() => toggleSection("weather")}
        >
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Condition</Label>
              <Select defaultValue="sunny">
                <SelectTrigger className="glass-panel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunny">☀️ Sunny</SelectItem>
                  <SelectItem value="cloudy">☁️ Cloudy</SelectItem>
                  <SelectItem value="rain">🌧️ Rain</SelectItem>
                  <SelectItem value="storm">⛈️ Storm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Track Temperature: 32°C</Label>
              <Slider defaultValue={[32]} min={10} max={60} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Humidity: 45%</Label>
              <Slider defaultValue={[45]} min={0} max={100} step={5} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Wind Speed: 12 km/h</Label>
              <Slider defaultValue={[12]} min={0} max={50} step={2} />
            </div>
          </div>
        </ConfigSection>

        {/* Tire Strategy */}
        <ConfigSection
          title="TIRE STRATEGY"
          icon={<CircleDot className="h-4 w-4" />}
          isOpen={openSections.tires}
          onToggle={() => toggleSection("tires")}
        >
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Compound</Label>
              <Select defaultValue="medium">
                <SelectTrigger className="glass-panel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soft">🔴 Soft</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="hard">⚪ Hard</SelectItem>
                  <SelectItem value="inter">🟢 Intermediate</SelectItem>
                  <SelectItem value="wet">🔵 Wet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Tire Age: 8 laps</Label>
              <Slider defaultValue={[8]} min={0} max={40} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Degradation Rate: 1.2x</Label>
              <Slider defaultValue={[12]} min={5} max={30} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Pit Window: Lap 18-22</Label>
              <div className="flex gap-2">
                <Slider defaultValue={[18]} min={1} max={52} step={1} className="flex-1" />
                <Slider defaultValue={[22]} min={1} max={52} step={1} className="flex-1" />
              </div>
            </div>
          </div>
        </ConfigSection>

        {/* Fuel & Power */}
        <ConfigSection
          title="FUEL & POWER"
          icon={<Fuel className="h-4 w-4" />}
          isOpen={openSections.fuel}
          onToggle={() => toggleSection("fuel")}
        >
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Fuel Load: 78%</Label>
              <Slider defaultValue={[78]} min={20} max={100} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Power Mode</Label>
              <Select defaultValue="balanced">
                <SelectTrigger className="glass-panel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="overtake">Overtake</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">ERS Deployment: Auto</Label>
              <Select defaultValue="auto">
                <SelectTrigger className="glass-panel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="hotlap">Hotlap</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </ConfigSection>

        {/* Driver Profiles */}
        <ConfigSection
          title="DRIVER PROFILES"
          icon={<Users className="h-4 w-4" />}
          isOpen={openSections.drivers}
          onToggle={() => toggleSection("drivers")}
        >
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Skill Level: 87</Label>
              <Slider defaultValue={[87]} min={50} max={100} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Aggression: 65</Label>
              <Slider defaultValue={[65]} min={0} max={100} step={5} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Consistency: 92</Label>
              <Slider defaultValue={[92]} min={50} max={100} step={1} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Risk Profile</Label>
              <Select defaultValue="calculated">
                <SelectTrigger className="glass-panel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="calculated">Calculated</SelectItem>
                  <SelectItem value="aggressive">Aggressive</SelectItem>
                  <SelectItem value="reckless">Reckless</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </ConfigSection>

        {/* Reliability Factors */}
        <ConfigSection
          title="RELIABILITY"
          icon={<Wrench className="h-4 w-4" />}
          isOpen={openSections.reliability}
          onToggle={() => toggleSection("reliability")}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Engine Failures</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Brake Issues</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Gearbox Problems</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Suspension Damage</Label>
              <Switch />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Failure Rate: 8%</Label>
              <Slider defaultValue={[8]} min={0} max={30} step={1} />
            </div>
          </div>
        </ConfigSection>

        {/* Session Events */}
        <ConfigSection
          title="SESSION EVENTS"
          icon={<Flag className="h-4 w-4" />}
          isOpen={openSections.events}
          onToggle={() => toggleSection("events")}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Safety Car</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Virtual Safety Car</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Red Flag</Label>
              <Switch />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Event Probability: 25%</Label>
              <Slider defaultValue={[25]} min={0} max={100} step={5} />
            </div>
            <Button variant="outline" size="sm" className="w-full">
              TRIGGER EVENT NOW
            </Button>
          </div>
        </ConfigSection>

        {/* Live Race Variables */}
        <ConfigSection
          title="LIVE RACE CONTROL"
          icon={<Activity className="h-4 w-4" />}
          isOpen={openSections.live}
          onToggle={() => toggleSection("live")}
        >
          <div className="space-y-3">
            <div className="glass-panel rounded p-2 space-y-1">
              <div className="text-xs text-muted-foreground">Current Speed</div>
              <div className="text-lg font-bold text-primary">287 km/h</div>
            </div>
            <div className="glass-panel rounded p-2 space-y-1">
              <div className="text-xs text-muted-foreground">Gap to Leader</div>
              <div className="text-lg font-bold text-yellow-400">+2.341s</div>
            </div>
            <div className="glass-panel rounded p-2 space-y-1">
              <div className="text-xs text-muted-foreground">Position</div>
              <div className="text-lg font-bold text-primary">P3</div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Override Speed</Label>
              <Slider defaultValue={[287]} min={100} max={350} step={5} />
            </div>
          </div>
        </ConfigSection>

        {/* Monte Carlo Simulation */}
        <ConfigSection
          title="MONTE CARLO SIMULATION"
          icon={<Shuffle className="h-4 w-4" />}
          isOpen={openSections.simulation}
          onToggle={() => toggleSection("simulation")}
        >
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Scenarios: 1000</Label>
              <Slider defaultValue={[1000]} min={100} max={10000} step={100} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Predict Crashes</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Strategy Outcomes</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Tire Wear Modeling</Label>
              <Switch defaultChecked />
            </div>
            <Button className="w-full bg-primary hover:bg-primary/80 text-primary-foreground glow-primary">
              RUN SIMULATION
            </Button>
            <div className="glass-panel rounded p-2 space-y-1">
              <div className="text-xs text-muted-foreground">Win Probability</div>
              <div className="text-lg font-bold text-primary">42.7%</div>
            </div>
          </div>
        </ConfigSection>
      </div>

      {/* Footer Actions */}
      <div className="h-16 px-4 border-t border-border/50 flex items-center gap-2 flex-shrink-0">
        <Button variant="outline" size="sm" className="flex-1">
          REPLAY
        </Button>
        <Button className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground">
          APPLY
        </Button>
      </div>
    </aside>
  );
};
