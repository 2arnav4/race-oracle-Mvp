import { BarChart3, LineChart, PieChart, TrendingUp } from "lucide-react";

export const AnalyticsPanel = () => {
  return (
    <div className="h-full w-full p-8 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-primary text-glow">Analytics</h1>
        <p className="text-muted-foreground">Performance metrics and data insights</p>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary">Lap Time Analysis</h3>
            <LineChart className="h-5 w-5 text-primary" />
          </div>
          <div className="h-64 flex items-center justify-center text-muted-foreground border border-border/30 rounded">
            Lap time trend chart will be displayed here
          </div>
        </div>

        <div className="glass-panel rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary">Sector Performance</h3>
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div className="h-64 flex items-center justify-center text-muted-foreground border border-border/30 rounded">
            Sector comparison bar chart will be displayed here
          </div>
        </div>

        <div className="glass-panel rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary">Tire Wear Distribution</h3>
            <PieChart className="h-5 w-5 text-primary" />
          </div>
          <div className="h-64 flex items-center justify-center text-muted-foreground border border-border/30 rounded">
            Tire wear pie chart will be displayed here
          </div>
        </div>

        <div className="glass-panel rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary">Speed Traces</h3>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="h-64 flex items-center justify-center text-muted-foreground border border-border/30 rounded">
            Speed trace overlay will be displayed here
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="glass-panel rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Session Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">1:26.382</div>
            <div className="text-xs text-muted-foreground">Fastest Lap</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">287.3</div>
            <div className="text-xs text-muted-foreground">Avg Speed (km/h)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">95.2%</div>
            <div className="text-xs text-muted-foreground">Consistency</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">42</div>
            <div className="text-xs text-muted-foreground">Overtakes</div>
          </div>
        </div>
      </div>
    </div>
  );
};
