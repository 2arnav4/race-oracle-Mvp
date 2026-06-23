import { Clock, Gauge, ShieldCheck, TrendingUp, User } from "lucide-react";
import type { RaceState } from "@/lib/raceSimulation";

interface DriversPanelProps {
  raceState: RaceState;
}

export const DriversPanel = ({ raceState }: DriversPanelProps) => {
  return (
    <div className="h-full w-full p-8 space-y-6 overflow-y-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-primary text-glow">Drivers</h1>
        <p className="text-muted-foreground">Live field order and driver traits</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {raceState.vehicles.map((driver, index) => (
          <div
            key={driver.driver_id}
            className="glass-panel rounded-lg p-6 space-y-4 hover:glow-primary transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${driver.color}22` }}
                >
                  <User className="h-6 w-6" style={{ color: driver.color }} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-lg truncate">{driver.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{driver.team}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">P{index + 1}</div>
                <div className="text-xs text-muted-foreground">Lap {driver.lap}/{raceState.num_laps}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  Speed
                </span>
                <span className="font-semibold">{Math.round(driver.speed_kph)} km/h</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Gap
                </span>
                <span className="font-semibold">{index === 0 ? "Leader" : `+${driver.gap_to_leader.toFixed(2)}s`}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Tire Care
                </span>
                <span className="font-semibold text-primary">{Math.round(driver.tire_management * 100)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Aggression
                </span>
                <span className="font-semibold text-primary">{Math.round(driver.aggression * 100)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border/30">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{driver.status}</span>
                <span>{driver.tire_wear.toFixed(1)}% tire wear</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
