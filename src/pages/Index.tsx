import { useState } from "react";
import { Sidebar, ViewType } from "@/components/Sidebar";
import { TrackVisualization } from "@/components/TrackVisualization";
import { ConfigPanel } from "@/components/ConfigPanel";
import { SimulationConfigModal } from "@/components/SimulationConfigModal";
import { DashboardPanel } from "@/components/panels/DashboardPanel";
import { DriversPanel } from "@/components/panels/DriversPanel";
import { AnalyticsPanel } from "@/components/panels/AnalyticsPanel";
import { SettingsPanel } from "@/components/panels/SettingsPanel";

const Index = () => {
  const [showModal, setShowModal] = useState(true);
  const [activeView, setActiveView] = useState<ViewType>("dashboard");

  const handleStartSimulation = (config: {
    laps: number;
    maxSpeed: number;
    aiAgents: number;
  }) => {
    console.log("Starting simulation with config:", config);
    setShowModal(false);
  };

  const renderMainContent = () => {
    switch (activeView) {
      case "dashboard":
        return <TrackVisualization />;
      case "drivers":
        return <DriversPanel />;
      case "analytics":
        return <AnalyticsPanel />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <TrackVisualization />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-hidden">
        {renderMainContent()}
      </main>
      <ConfigPanel />

      {showModal && (
        <SimulationConfigModal
          onStart={handleStartSimulation}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Index;
