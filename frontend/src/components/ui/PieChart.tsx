import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

interface PieChartProps {
  data: { name: string; value: number }[];
}

export default function PieChart({ data }: PieChartProps) {
  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <RePieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
}
