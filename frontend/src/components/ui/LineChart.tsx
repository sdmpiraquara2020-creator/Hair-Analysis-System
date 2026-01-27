import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

interface LineChartProps {
  data: { date: string; total: number }[];
}

export default function LineChart({ data }: LineChartProps) {
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <ReLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
          />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}
