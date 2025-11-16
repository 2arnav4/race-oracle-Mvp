import { useEffect, useState } from "react";

type TrackPoint = { x: number; y: number; z: number; distance: number };
type TrackData = {
  track_name: string;
  total_length: number;
  points: TrackPoint[];
};

interface Vehicle {
  name: string;
  driver_id: string;
  color: string;
  speed_kph: number;
  lap: number;
  track_position: number;
  tire_wear: number;
  tire_temp: number;
  distance: number;
  aggression: number;
}

interface RaceState {
  time: number;
  vehicles: Vehicle[];
  scenario_id: number;
  is_playing: boolean;
  max_time: number;
  playback_speed: number;
}

interface TrackVisualizationProps {
  raceState: RaceState | null;
}

export const TrackVisualization = ({ raceState }: TrackVisualizationProps) => {
  const [track, setTrack] = useState<TrackData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load Track JSON
  useEffect(() => {
    fetch("/tracks/monza_track.json")
      .then((response) => {
        if (!response.ok) throw new Error("Track JSON not found!");
        return response.json();
      })
      .then((data) => setTrack(data))
      .catch((err) => setError(err.message));
  }, []);

  const normalizeCoordinates = () => {
    if (!track) return { minX: 0, maxX: 1, minY: 0, maxY: 1 };
    
    const xs = track.points.map(p => p.x);
    const ys = track.points.map(p => p.y);
    
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  };

  const toScreenCoords = (x: number, y: number, width: number, height: number) => {
    const bounds = normalizeCoordinates();
    const padding = 60;
    
    const scaleX = (width - padding * 2) / (bounds.maxX - bounds.minX);
    const scaleY = (height - padding * 2) / (bounds.maxY - bounds.minY);
    const scale = Math.min(scaleX, scaleY);
    
    // Center the track
    const trackWidth = (bounds.maxX - bounds.minX) * scale;
    const trackHeight = (bounds.maxY - bounds.minY) * scale;
    const offsetX = (width - trackWidth) / 2;
    const offsetY = (height - trackHeight) / 2;
    
    const screenX = (x - bounds.minX) * scale + offsetX;
    const screenY = (y - bounds.minY) * scale + offsetY;
    
    return { x: screenX, y: screenY };
  };

  const vehicles = raceState?.vehicles || [];
  const trackLength = track?.total_length || 5800;

  // Convert track position to screen coordinates
  const getVehicleScreenPosition = (trackPosition: number) => {
    if (!track || track.points.length === 0) return { x: 0, y: 0 };
    
    // Find the point on track closest to this position
    let closestPoint = track.points[0];
    let minDiff = Math.abs(track.points[0].distance - trackPosition);
    
    for (const point of track.points) {
      const diff = Math.abs(point.distance - trackPosition);
      if (diff < minDiff) {
        minDiff = diff;
        closestPoint = point;
      }
    }
    
    return toScreenCoords(closestPoint.x, closestPoint.y, 1200, 900);
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#0a0f1e] via-[#0d1321] to-[#0a0f1e] flex items-center justify-center">
      {!track && !error && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading track data...</p>
        </div>
      )}
      {error && (
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">Error loading track</p>
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      )}

      {track && (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* No Race Message */}
          {!raceState && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-sm">
              <div className="text-center bg-black/80 rounded-2xl p-8 border border-primary/30 max-w-md">
                <div className="text-6xl mb-4">🏎️</div>
                <h3 className="text-2xl font-bold text-primary mb-2">Ready to Race</h3>
                <p className="text-gray-400 mb-6">
                  Select a scenario from the right panel and click "Play" to begin
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span>Waiting for race start...</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Info Panel */}
          <div className="absolute top-20 left-8 z-10 bg-black/70 backdrop-blur-md rounded-xl p-4 border border-primary/20 shadow-2xl max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <h2 className="text-lg font-bold text-primary">
                {track.track_name}
              </h2>
            </div>
            
            {raceState && (
              <div className="text-xs text-gray-300 mb-3 space-y-1 pb-3 border-b border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-400">Time:</span>
                  <span className="font-mono font-medium">{raceState.time.toFixed(1)}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Speed:</span>
                  <span className="font-medium">{(raceState.playback_speed * 100).toFixed(0)}%</span>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-400 mb-2">LIVE POSITIONS</div>
              {vehicles.length === 0 && (
                <div className="text-xs text-gray-500 italic">No drivers on track</div>
              )}
              {vehicles.map((vehicle, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm bg-black/30 rounded-lg p-2 hover:bg-black/50 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className="text-xs font-bold text-gray-400 w-6">P{idx + 1}</div>
                    <div
                      className="w-3 h-3 rounded-full shadow-lg"
                      style={{
                        backgroundColor: vehicle.color,
                        boxShadow: `0 0 8px ${vehicle.color}`,
                      }}
                    />
                    <span className="text-white font-medium text-xs flex-1">{vehicle.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-primary font-bold text-sm">
                      {Math.round(vehicle.speed_kph)}
                    </div>
                    <div className="text-xs text-gray-400">km/h</div>
                  </div>
                </div>
              ))}
            </div>
            
            {vehicles.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="text-xs font-semibold text-gray-400 mb-2">TIRE WEAR</div>
                {vehicles.slice(0, 3).map((vehicle, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: vehicle.color }}
                    />
                    <div className="flex-1 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all"
                        style={{ width: `${vehicle.tire_wear}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-10 text-right">
                      {Math.round(vehicle.tire_wear)}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Track SVG - Centered and larger */}
          <svg className="w-[90%] h-[90%]" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid meet">
            {/* Track background glow */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Draw track path */}
            <path
              d={
                track.points
                  .map((point, i) => {
                    const { x, y } = toScreenCoords(point.x, point.y, 1200, 900);
                    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                  })
                  .join(" ") + " Z"
              }
              fill="none"
              stroke="#1f2937"
              strokeWidth="40"
              opacity="0.8"
            />
            <path
              d={
                track.points
                  .map((point, i) => {
                    const { x, y } = toScreenCoords(point.x, point.y, 1200, 900);
                    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                  })
                  .join(" ") + " Z"
              }
              fill="none"
              stroke="#374151"
              strokeWidth="35"
              opacity="0.6"
            />

            {/* Draw vehicles */}
            {vehicles.map((vehicle, idx) => {
              const screen = getVehicleScreenPosition(vehicle.track_position);

              return (
                <g key={idx} filter="url(#glow)">
                  {/* Vehicle outer glow */}
                  <circle cx={screen.x} cy={screen.y} r="16" fill={vehicle.color} opacity="0.2" />
                  <circle cx={screen.x} cy={screen.y} r="12" fill={vehicle.color} opacity="0.4" />
                  {/* Vehicle */}
                  <circle
                    cx={screen.x}
                    cy={screen.y}
                    r="7"
                    fill={vehicle.color}
                    stroke="white"
                    strokeWidth="2.5"
                  />
                  {/* Position number */}
                  <text
                    x={screen.x}
                    y={screen.y + 3}
                    textAnchor="middle"
                    fill="white"
                    fontSize="8"
                    fontWeight="bold"
                  >
                    {idx + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
};
