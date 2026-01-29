interface LineChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
  width?: number;
  height?: number;
}

export function LineChart({
  data,
  width = 800,
  height = 220,
}: LineChartProps) {
  if (data.length === 0) {
    return null;
  }

  const padding = 24;
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  const points = data.map((point, index) => {
    const x =
      padding +
      (index / (data.length - 1 || 1)) * (width - padding * 2);

    const y =
      height -
      padding -
      (point.value / maxValue) * (height - padding * 2);

    return `${x},${y}`;
  });

  return (
    <svg width={width} height={height}>
      {/* eixo horizontal */}
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="#ddd"
      />

      {/* eixo vertical */}
      <line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={height - padding}
        stroke="#ddd"
      />

      {/* linha do gráfico */}
      <polyline
        fill="none"
        stroke="#000"
        strokeWidth={2}
        points={points.join(' ')}
      />

      {/* pontos */}
      {points.map((point, index) => {
        const [x, y] = point.split(',');
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r={3}
            fill="#000"
          />
        );
      })}
    </svg>
  );
}
