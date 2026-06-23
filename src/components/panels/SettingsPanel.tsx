import { useEffect } from "react";
import { Settings as SettingsIcon, Monitor, Bell, Shield, Database, Sparkles, Volume2, HelpCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { AppSettings } from "@/lib/raceSimulation";

interface SettingsPanelProps {
  settings: AppSettings;
  onSettingsChange: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

export const SettingsPanel = ({ settings, onSettingsChange }: SettingsPanelProps) => {
  // Sync dark mode class on document element
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings.darkMode]);

  const handleToggle = <K extends keyof AppSettings>(key: K, label: string) => {
    const nextVal = !settings[key];
    onSettingsChange(key, nextVal as AppSettings[K]);
    
    if (nextVal) {
      toast.success(`${label} enabled`, {
        description: `Successfully activated ${label.toLowerCase()} in preferences.`,
      });
    } else {
      toast.info(`${label} disabled`, {
        description: `Successfully deactivated ${label.toLowerCase()} in preferences.`,
      });
    }
  };

  const handleResetSettings = () => {
    onSettingsChange("glowEffects", true);
    onSettingsChange("showTelemetryOverlay", true);
    onSettingsChange("autoPlayOnSelect", true);
    onSettingsChange("darkMode", true);
    onSettingsChange("reduceMotion", false);
    onSettingsChange("soundEffects", true);
    toast.success("Settings reset to defaults", {
      description: "All configurations have been restored to their initial F1 MVP values.",
    });
  };

  const handleClearCache = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: "Clearing circuit and driver data cache...",
        success: "Cache cleared successfully",
        error: "Failed to clear cache",
      }
    );
  };

  return (
    <div className="h-full w-full p-8 space-y-6 overflow-y-auto bg-gradient-to-br from-[#0a0f1e] via-[#0d1321] to-[#0a0f1e]">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-primary text-glow flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-primary animate-spin-slow" />
          Settings
        </h1>
        <p className="text-muted-foreground">Configure your Race Oracle live telemetry dashboard and simulation engine</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6 max-w-3xl">
        {/* Display Settings */}
        <div className="glass-panel rounded-lg p-6 space-y-4 border border-primary/10">
          <div className="flex items-center gap-3 mb-2">
            <Monitor className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-primary">Display & Visuals</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm cursor-pointer" htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-xs text-muted-foreground">Use premium dark theme across the application</p>
              </div>
              <Switch 
                id="dark-mode" 
                checked={settings.darkMode} 
                onCheckedChange={() => handleToggle("darkMode", "Dark Mode")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm cursor-pointer" htmlFor="glow-effects">Glow Effects</Label>
                <p className="text-xs text-muted-foreground">Enable neon glow animations for F1 cars on track</p>
              </div>
              <Switch 
                id="glow-effects" 
                checked={settings.glowEffects} 
                onCheckedChange={() => handleToggle("glowEffects", "Glow Effects")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm cursor-pointer" htmlFor="telemetry-overlay">Telemetry Overlay</Label>
                <p className="text-xs text-muted-foreground">Show live positions and tire wear overlay on track view</p>
              </div>
              <Switch 
                id="telemetry-overlay" 
                checked={settings.showTelemetryOverlay} 
                onCheckedChange={() => handleToggle("showTelemetryOverlay", "Telemetry Overlay")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm cursor-pointer" htmlFor="reduce-motion">Reduce Motion</Label>
                <p className="text-xs text-muted-foreground">Minimize UI transitions and track rendering frame rate</p>
              </div>
              <Switch 
                id="reduce-motion" 
                checked={settings.reduceMotion} 
                onCheckedChange={() => handleToggle("reduceMotion", "Reduce Motion")}
              />
            </div>
          </div>
        </div>

        {/* Behavior & Simulation */}
        <div className="glass-panel rounded-lg p-6 space-y-4 border border-primary/10">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-primary">Simulation & Audio</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm cursor-pointer" htmlFor="auto-play">Auto-play on Scenario Select</Label>
                <p className="text-xs text-muted-foreground">Immediately start the race animation when a new scenario is selected</p>
              </div>
              <Switch 
                id="auto-play" 
                checked={settings.autoPlayOnSelect} 
                onCheckedChange={() => handleToggle("autoPlayOnSelect", "Auto-play")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm cursor-pointer" htmlFor="sound-effects">Sound Effects</Label>
                <p className="text-xs text-muted-foreground">Play telemetry pings and notification alerts during the race</p>
              </div>
              <Switch 
                id="sound-effects" 
                checked={settings.soundEffects} 
                onCheckedChange={() => handleToggle("soundEffects", "Sound Effects")}
              />
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="glass-panel rounded-lg p-6 space-y-4 border border-primary/10">
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-primary">System Information</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="glass-panel rounded p-2.5">
              <span className="text-muted-foreground block">Application Name</span>
              <span className="font-semibold text-white mt-0.5 block">Race Oracle MVP</span>
            </div>
            <div className="glass-panel rounded p-2.5">
              <span className="text-muted-foreground block">Version / Season</span>
              <span className="font-semibold text-white mt-0.5 block">v1.0 (2025 F1 Season)</span>
            </div>
            <div className="glass-panel rounded p-2.5">
              <span className="text-muted-foreground block">Simulated Circuit</span>
              <span className="font-semibold text-white mt-0.5 block">Autodromo Nazionale Monza</span>
            </div>
            <div className="glass-panel rounded p-2.5">
              <span className="text-muted-foreground block">Total Drivers in Pool</span>
              <span className="font-semibold text-white mt-0.5 block">20 F1 Grid Drivers</span>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="glass-panel rounded-lg p-6 space-y-4 border border-primary/10">
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-primary">Data Management</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" className="justify-center text-xs" onClick={handleClearCache}>
              Clear Simulation Cache
            </Button>
            <Button 
              variant="outline" 
              className="justify-center text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleResetSettings}
            >
              Reset All Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
