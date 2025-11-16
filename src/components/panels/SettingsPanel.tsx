import { Settings as SettingsIcon, Monitor, Bell, Shield, Database } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const SettingsPanel = () => {
  return (
    <div className="h-full w-full p-8 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-primary text-glow">Settings</h1>
        <p className="text-muted-foreground">Configure your Race Oracle experience</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6 max-w-3xl">
        {/* Display Settings */}
        <div className="glass-panel rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Monitor className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-primary">Display</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Dark Mode</Label>
                <p className="text-xs text-muted-foreground">Use dark theme across the application</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Glow Effects</Label>
                <p className="text-xs text-muted-foreground">Enable neon glow animations</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Reduce Motion</Label>
                <p className="text-xs text-muted-foreground">Minimize animations for accessibility</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-panel rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-primary">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Race Incidents</Label>
                <p className="text-xs text-muted-foreground">Notify on crashes and safety cars</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Position Changes</Label>
                <p className="text-xs text-muted-foreground">Alert on overtakes and position loss</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Pit Stops</Label>
                <p className="text-xs text-muted-foreground">Notify on pit entry and exit</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="glass-panel rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-primary">Data & Privacy</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Telemetry Collection</Label>
                <p className="text-xs text-muted-foreground">Allow collection of race telemetry data</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Analytics</Label>
                <p className="text-xs text-muted-foreground">Help improve Race Oracle with usage data</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="glass-panel rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-primary">Data Management</h3>
          </div>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Export Race Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Clear Cache
            </Button>
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
              Reset All Settings
            </Button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="bg-primary hover:bg-primary/80 text-primary-foreground glow-primary">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
