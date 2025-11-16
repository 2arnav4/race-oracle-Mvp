import { Clock, Zap, TrendingUp } from "lucide-react";

interface DriverData {
  position: number;
  name: string;
  team: string;
  lapTime: string;
  delta: string;
  sectors: [string, string, string];
  isPlayer?: boolean;
}

const mockDriverData: DriverData[] = [
  {
    position: 1,
    name: "L. Hamilton",
    team: "Mercedes",
    lapTime: "1:26.382",
    delta: "0.000",
    sectors: ["purple", "green", "green"],
    isPlayer: true,
  },
  {
    position: 2,
    name: "M. Verstappen",
    team: "Red Bull",
    lapTime: "1:26.491",
    delta: "+0.109",
    sectors: ["green", "purple", "yellow"],
  },
  {
    position: 3,
    name: "C. Leclerc",
    team: "Ferrari",
    lapTime: "1:26.573",
    delta: "+0.191",
    sectors: ["yellow", "green", "purple"],
  },
  {
    position: 4,
    name: "S. Perez",
    team: "Red Bull",
    lapTime: "1:26.688",
    delta: "+0.306",
    sectors: ["green", "green", "green"],
  },
  {
    position: 5,
    name: "C. Sainz",
    team: "Ferrari",
    lapTime: "1:26.799",
    delta: "+0.417",
    sectors: ["yellow", "yellow", "green"],
  },
];

const getSectorColor = (sector: string) => {
  switch (sector) {
    case "purple":
      return "bg-purple-500";
    case "green":
      return "bg-green-500";
    case "yellow":
      return "bg-yellow-500";
    default:
      return "bg-muted";
  }
};

export const TelemetryPanel = () => {
  return (
    <aside className="glass-panel h-screen w-80 border-l border-border/50 flex flex-col">
      {/* Header */}
      <div className="h-16 px-4 border-b border-border/50 flex items-center justify-between">
        <h2 className="text-lg font-bold text-primary text-glow">
          LIVE TIMING
        </h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>LAP 23/52</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 p-4 border-b border-border/50">
        <div className="glass-panel rounded p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Zap className="h-3 w-3" />
            <span>AVG SPEED</span>
          </div>
          <div className="text-xl font-bold text-primary">287 km/h</div>
        </div>
        <div className="glass-panel rounded p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <TrendingUp className="h-3 w-3" />
            <span>FASTEST LAP</span>
          </div>
          <div className="text-xl font-bold text-primary">1:26.382</div>
        </div>
      </div>

      {/* Timing tower */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {mockDriverData.map((driver) => (
            <div
              key={driver.position}
              className={`glass-panel rounded p-3 transition-all duration-200 ${
                driver.isPlayer
                  ? "bg-primary/10 border border-primary/30 glow-primary"
                  : "hover:bg-secondary/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm ${
                      driver.isPlayer
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {driver.position}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{driver.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {driver.team}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-semibold">
                    {driver.lapTime}
                  </div>
                  <div
                    className={`text-xs font-mono ${
                      driver.delta === "0.000"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {driver.delta}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                {driver.sectors.map((sector, idx) => (
                  <div
                    key={idx}
                    className={`h-1 flex-1 rounded ${getSectorColor(sector)}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-border/50 text-xs text-muted-foreground space-y-1">
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-purple-500" />
          <span>Personal Best</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-green-500" />
          <span>Sector Improvement</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-yellow-500" />
          <span>Sector Slower</span>
        </div>
      </div>
    </aside>
  );
};
