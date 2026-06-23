import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Gauge, Timer, TrendingDown, Trophy } from "lucide-react";
import type { RaceState } from "@/lib/raceSimulation";

interface AnalyticsPanelProps {
  raceState: RaceState;
}

export const AnalyticsPanel = ({ raceState }: AnalyticsPanelProps) => {
  const chartData = raceState.vehicles.map((vehicle, index) => ({
    position: `P${index + 1}`,
    driver: vehicle.short_name,
    speed: Math.round(vehicle.speed_kph),
    tireWear: Number(vehicle.tire_wear.toFixed(1)),
    lapTime: vehicle.estimated_lap_time,
  }));

  const leader = raceState.vehicles[0];
  const fastest = raceState.vehicles.reduce(
    (best, vehicle) => (vehicle.estimated_lap_time < best.estimated_lap_time ? vehicle : best),
    raceState.vehicles[0],
  );
  const averageSpeed =
    raceState.vehicles.reduce((sum, vehicle) => sum + vehicle.speed_kph, 0) / Math.max(raceState.vehicles.length, 1);
  const averageWear =
    raceState.vehicles.reduce((sum, vehicle) => sum + vehicle.tire_wear, 0) / Math.max(raceState.vehicles.length, 1);

  return (
    <div className="h-full w-full p-8 space-y-6 overflow-y-auto bg-gradient-to-br from-[#0a0f1e] via-[#0d1321] to-[#0a0f1e]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-lg p-5 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-sm">
            <span>Leader</span>
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary truncate">{leader?.short_name ?? "-"}</div>
        </div>

        <div className="glass-panel rounded-lg p-5 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-sm">
            <span>Avg Speed</span>
            <Gauge className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary">{Math.round(averageSpeed)} km/h</div>
        </div>

        <div className="glass-panel rounded-lg p-5 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-sm">
            <span>Fastest Estimate</span>
            <Timer className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary">{fastest?.estimated_lap_time.toFixed(3) ?? "-"}s</div>
        </div>

        <div className="glass-panel rounded-lg p-5 space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-sm">
            <span>Avg Tire Wear</span>
            <TrendingDown className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary">{averageWear.toFixed(1)}%</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="glass-panel rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Current Speed</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="driver" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="speed" fill="#00ffd1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Tire Wear</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="driver" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="tireWear" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
