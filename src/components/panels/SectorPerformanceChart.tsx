import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function SectorPerformanceChart({ sectorData }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={sectorData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="sector" />
        <YAxis label={{ value: "Sector Time (s)", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Hamilton" fill="#00ffd1" />
        <Bar dataKey="Verstappen" fill="#ff6b00" />
        <Bar dataKey="Leclerc" fill="#b001ff" />
      </BarChart>
    </ResponsiveContainer>
  );
}
