import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const colors = ["#00ffd1", "#ff6b00", "#ff016b", "#b001ff"];
export function TireWearPieChart({ tireWearData }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={tireWearData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {tireWearData.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
