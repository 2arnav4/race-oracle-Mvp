import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TrackVisualization } from "@/components/TrackVisualization";
import { ConfigPanel } from "@/components/ConfigPanel";
import { SimulationConfigModal } from "@/components/SimulationConfigModal";

const Index = () => {
  const [showModal, setShowModal] = useState(true);

  const handleStartSimulation = (config: {
    laps: number;
    maxSpeed: number;
    aiAgents: number;
  }) => {
    console.log("Starting simulation with config:", config);
    setShowModal(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <TrackVisualization />
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
