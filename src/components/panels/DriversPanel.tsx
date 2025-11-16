import { User, Trophy, Clock, TrendingUp } from "lucide-react";

const mockDrivers = [
  { id: 1, name: "Lewis Hamilton", team: "Mercedes", position: 1, points: 387, status: "racing" },
  { id: 2, name: "Max Verstappen", team: "Red Bull", position: 2, points: 365, status: "racing" },
  { id: 3, name: "Charles Leclerc", team: "Ferrari", position: 3, points: 312, status: "racing" },
  { id: 4, name: "Sergio Perez", team: "Red Bull", position: 4, points: 298, status: "racing" },
  { id: 5, name: "Carlos Sainz", team: "Ferrari", position: 5, points: 276, status: "racing" },
];

export const DriversPanel = () => {
  return (
    <div className="h-full w-full p-8 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-primary text-glow">Drivers</h1>
        <p className="text-muted-foreground">Driver profiles and performance analytics</p>
      </div>

      {/* Driver Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockDrivers.map((driver) => (
          <div
            key={driver.id}
            className="glass-panel rounded-lg p-6 space-y-4 hover:glow-primary transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{driver.name}</h3>
                  <p className="text-sm text-muted-foreground">{driver.team}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">P{driver.position}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Points
                </span>
                <span className="font-semibold">{driver.points}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Status
                </span>
                <span className="font-semibold capitalize text-green-400">{driver.status}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Form
                </span>
                <span className="font-semibold text-primary">Excellent</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border/30">
              <div className="text-xs text-muted-foreground">
                Last lap: <span className="text-primary font-semibold">1:26.{Math.floor(Math.random() * 900 + 100)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional placeholder */}
      <div className="glass-panel rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Driver Comparison</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          Detailed driver comparison charts will be added here
        </div>
      </div>
    </div>
  );
};
