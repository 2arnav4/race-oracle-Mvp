import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TrackVisualization = () => {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));

  return (
    <div className="relative h-full flex flex-col items-center justify-center p-8">
      {/* Track SVG */}
      <div
        className="relative transition-transform duration-300"
        style={{ transform: `scale(${zoom / 100})` }}
      >
        <svg
          width="600"
          height="400"
          viewBox="0 0 600 400"
          className="drop-shadow-2xl"
        >
          {/* Outer glow */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#00FFD1", stopOpacity: 0.8 }} />
              <stop offset="50%" style={{ stopColor: "#00FFD1", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#00FFD1", stopOpacity: 0.8 }} />
            </linearGradient>
          </defs>

          {/* Background shadow */}
          <path
            d="M 100 200 Q 150 100, 300 100 Q 450 100, 500 200 Q 550 300, 300 300 Q 150 300, 100 200 Z"
            fill="none"
            stroke="rgba(0, 255, 209, 0.1)"
            strokeWidth="30"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Main track */}
          <path
            d="M 100 200 Q 150 100, 300 100 Q 450 100, 500 200 Q 550 300, 300 300 Q 150 300, 100 200 Z"
            fill="none"
            stroke="url(#trackGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            className="animate-pulse"
            style={{ animationDuration: "3s" }}
          />

          {/* Start/Finish line */}
          <g>
            <line
              x1="95"
              y1="190"
              x2="95"
              y2="210"
              stroke="#00FFD1"
              strokeWidth="4"
              filter="url(#glow)"
            />
            <text
              x="95"
              y="180"
              fill="#00FFD1"
              fontSize="12"
              fontWeight="600"
              textAnchor="middle"
              fontFamily="Montserrat"
            >
              START
            </text>
          </g>

          {/* Sector markers */}
          <circle cx="300" cy="100" r="5" fill="#00FFD1" filter="url(#glow)" />
          <circle cx="500" cy="200" r="5" fill="#00FFD1" filter="url(#glow)" />
          <circle cx="300" cy="300" r="5" fill="#00FFD1" filter="url(#glow)" />
        </svg>

        {/* Track name label */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
          <h3 className="text-xl font-bold text-primary text-glow tracking-wider">
            SILVERSTONE CIRCUIT
          </h3>
          <p className="text-xs text-muted-foreground mt-1">5.891 km • 52 laps</p>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-8 right-8 glass-panel rounded-lg p-2 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomOut}
          className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="text-sm font-semibold text-primary w-12 text-center">
          {zoom}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomIn}
          className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Ambient grid lines */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#00FFD1"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
};
