import { Activity, Gauge, Users, Flag } from "lucide-react";

export const DashboardPanel = () => {
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
          <div className="text-3xl font-bold text-primary">23 / 52</div>
          <div className="text-xs text-muted-foreground">44% Complete</div>
        </div>

        <div className="glass-panel rounded-lg p-6 space-y-3 hover:glow-primary transition-all">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">AVG SPEED</span>
            <Gauge className="h-5 w-5 text-primary" />
          </div>
          <div className="text-3xl font-bold text-primary">287 km/h</div>
          <div className="text-xs text-green-400">↑ 3.2% from last lap</div>
        </div>

        <div className="glass-panel rounded-lg p-6 space-y-3 hover:glow-primary transition-all">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">ACTIVE DRIVERS</span>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="text-3xl font-bold text-primary">18 / 20</div>
          <div className="text-xs text-yellow-400">2 DNF</div>
        </div>

        <div className="glass-panel rounded-lg p-6 space-y-3 hover:glow-primary transition-all">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">INCIDENTS</span>
            <Flag className="h-5 w-5 text-primary" />
          </div>
          <div className="text-3xl font-bold text-primary">3</div>
          <div className="text-xs text-muted-foreground">1 Safety Car</div>
        </div>
      </div>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Race Progress</h3>
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            Chart visualization will be added here
          </div>
        </div>

        <div className="glass-panel rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-4">Top Performers</h3>
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            Leaderboard visualization will be added here
          </div>
        </div>
      </div>
    </div>
  );
};
