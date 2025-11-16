import { useState } from "react";
import { X, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SimulationConfigModalProps {
  onStart: (config: {
    laps: number;
    maxSpeed: number;
    aiAgents: number;
  }) => void;
  onClose: () => void;
}

export const SimulationConfigModal = ({
  onStart,
  onClose,
}: SimulationConfigModalProps) => {
  const [laps, setLaps] = useState(52);
  const [maxSpeed, setMaxSpeed] = useState(320);
  const [aiAgents, setAiAgents] = useState(19);

  const handleStart = () => {
    onStart({ laps, maxSpeed, aiAgents });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
        style={{ backdropFilter: "blur(12px) brightness(0.4)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-panel rounded-lg p-8 w-full max-w-md mx-4 animate-in fade-in zoom-in duration-300 border border-primary/20 glow-primary-strong">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-primary text-glow mb-2">
            RACE ORACLE
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure your simulation parameters
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="laps" className="text-sm font-semibold">
              Number of Laps
            </Label>
            <Input
              id="laps"
              type="number"
              min="1"
              max="100"
              value={laps}
              onChange={(e) => setLaps(parseInt(e.target.value))}
              className="glass-panel border-border/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxSpeed" className="text-sm font-semibold">
              Max Speed (km/h)
            </Label>
            <Input
              id="maxSpeed"
              type="number"
              min="200"
              max="400"
              value={maxSpeed}
              onChange={(e) => setMaxSpeed(parseInt(e.target.value))}
              className="glass-panel border-border/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="aiAgents" className="text-sm font-semibold">
              AI Agents (Competitors)
            </Label>
            <Input
              id="aiAgents"
              type="number"
              min="1"
              max="19"
              value={aiAgents}
              onChange={(e) => setAiAgents(parseInt(e.target.value))}
              className="glass-panel border-border/50 focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-border/50 hover:bg-secondary transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={handleStart}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all glow-primary hover:glow-primary-strong"
          >
            <Rocket className="mr-2 h-4 w-4" />
            Start Simulation
          </Button>
        </div>

        {/* Info footer */}
        <p className="mt-6 text-xs text-center text-muted-foreground">
          Real-time telemetry and AI-driven race simulation
        </p>
      </div>
    </div>
  );
};
