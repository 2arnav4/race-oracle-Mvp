import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function LapTimeChart({ lapData }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={lapData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="lap" />
        <YAxis label={{ value: "Lap Time (s)", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Line type="monotone" dataKey="time" stroke="#00ffd1" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
