import { Activity, Gauge, Users, Flag } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Example chart data (replace with your real simulation data)
const defaultLapData = [
  { lap: 21, time: 85.9 },
  { lap: 22, time: 86.2 },
  { lap: 23, time: 86.3 },
  { lap: 24, time: 86.0 }
];

// Example leaderboard data (replace with your real simulation data)
const defaultLeaderboard = [
  { position: 1, name: "Hamilton", laps: 23, time: "1:26.382" },
  { position: 2, name: "Verstappen", laps: 23, time: "1:26.491" },
  { position: 3, name: "Leclerc", laps: 23, time: "1:26.573" }
];

// This panel expects dashboardData OR uses defaults
export const DashboardPanel = ({ dashboardData }) => {
  // If there's no injected dashboard data yet, fall back to template demo data
  const {
    currentLap = 23,
    totalLaps = 52,
    avgSpeed = 287,
    speedDelta = "+3.2%",
    activeDrivers = 18,
    totalDrivers = 20,
    dnfCount = 2,
    incidentCount = 3,
    safetyCarCount = 1,
    lapData = defaultLapData,
    leaderboard = defaultLeaderboard
  } = dashboardData || {};

  return (
    <div className="h-full w-full p-8 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-primary text-glow">Dashboard</h1>
        <p className="text-muted-foreground">Race overview and real-time statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-lg p-6 space-y-3 hover:glow-primary transition-all">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">CURRENT LAP</span>
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div className="text-3xl font-bold text-primary">{currentLap} / {totalLaps}</div>
          <div className="text-xs text-muted-foreground">{Math.round(100 * currentLap / totalLaps)}% Complete</div>
        </div>

        <div className="glass-panel rounded-lg p-6 space-y-3 hover:glow-primary transition-all">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">AVG SPEED</span>
            <Gauge className="h-5 w-5 text-primary" />
          </div>
          <div className="text-3xl font-bold text-primary">{avgSpeed} km/h</div>
          <div className="text-xs text-green-400">↑ {speedDelta} from last lap</div>
        </div>

        <div className="glass-panel rounded-lg p-6 space-y-3 hover:glow-primary transition-all">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">ACTIVE DRIVERS</span>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="text-3xl font-bold text-primary">{activeDrivers} / {totalDrivers}</div>
          <div className="text-xs text-yellow-400">{dnfCount} DNF</div>
        </div>

        <div className="glass-panel rounded-lg p-6 space-y-3 hover:glow-primary transition-all">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">INCIDENTS</span>
            <Flag className="h-5 w-5 text-primary" />
          </div>
          <div className="text-3xl font-bold text-primary">{incidentCount}</div>
          <div className="text-xs text-muted-foreground">{safetyCarCount} Safety Car</div>
        </div>
      </div>

      {/* Race Progress Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Race Progress</h3>
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={lapData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="lap" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="time" stroke="#00ffd1" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="glass-panel rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Top Performers</h3>
          <div className="h-48 flex flex-col items-center justify-center">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="text-green-400">POS</th>
                  <th className="text-green-400">Driver</th>
                  <th className="text-green-400">Laps</th>
                  <th className="text-green-400">Best Lap</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((d) => (
                  <tr key={d.position}>
                    <td>{d.position}</td>
                    <td className="font-bold text-primary">{d.name}</td>
                    <td>{d.laps}</td>
                    <td>{d.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
