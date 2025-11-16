import { LayoutDashboard, Users, BarChart3, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type ViewType = "dashboard" | "drivers" | "analytics" | "settings";

const menuItems: { icon: typeof LayoutDashboard; label: string; view: ViewType }[] = [
  { icon: LayoutDashboard, label: "Dashboard", view: "dashboard" },
  { icon: Users, label: "Drivers", view: "drivers" },
  { icon: BarChart3, label: "Analytics", view: "analytics" },
  { icon: Settings, label: "Settings", view: "settings" },
];

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`glass-panel h-screen transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      } flex flex-col border-r border-border/50`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
        {!collapsed && (
          <h1 className="text-xl font-bold text-glow tracking-tight text-primary">
            RACE ORACLE
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-primary/10 hover:text-primary transition-all ml-auto"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <TooltipProvider>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.view;
            const content = (
              <Button
                variant={isActive ? "default" : "ghost"}
                onClick={() => onViewChange(item.view)}
                className={`w-full justify-start transition-all duration-200 ${
                  isActive
                    ? "bg-primary/20 text-primary hover:bg-primary/30 glow-primary"
                    : "hover:bg-secondary hover:text-primary"
                } ${collapsed ? "justify-center px-0" : ""}`}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className={`h-5 w-5 ${!collapsed && "mr-3"}`} />
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Button>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.label}>
                  <TooltipTrigger asChild>{content}</TooltipTrigger>
                  <TooltipContent side="right" className="glass-panel">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.label}>{content}</div>;
          })}
        </TooltipProvider>
      </nav>

      {/* Footer status */}
      <div className="p-4 border-t border-border/50">
        {!collapsed ? (
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse glow-primary" />
              <span>System Online</span>
            </div>
            <div>Latency: 12ms</div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse glow-primary" />
          </div>
        )}
      </div>
    </aside>
  );
};
