"use client";

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PieChartData {
  label: string;
  value: number;
  color?: string;
}

interface PieChartRechartsProps {
  data: PieChartData[];
  title?: string;
  showLegend?: boolean;
  showPercentage?: boolean;
}

const DEFAULT_COLORS = [
  "#9DC65D", // verde-suave
  "#1E3A8A", // azul-profundo
  "#D4A853", // dorado
  "#8B4513", // tierra-media
  "#AE0000", // rojo DA LUZ
  "#4A7C59", // verde oscuro
  "#6366F1", // indigo
  "#EC4899", // pink
];

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: PieChartData }>;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 mb-1">{data.label}</p>
        <p className="text-sm font-semibold text-[#1E3A8A]">
          {data.value.toLocaleString("es-AR")}
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = (props: {
  payload?: Array<{ value: string; color: string }>;
}) => {
  const { payload } = props;
  if (!payload) return null;
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-[#8B4513]">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export function PieChartRecharts({
  data,
  title,
  showLegend = true,
  showPercentage = true,
}: PieChartRechartsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No hay datos para mostrar
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
    percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : "0",
  }));

  return (
    <div className="space-y-4">
      {title && (
        <h4 className="font-medium text-[#1E3A8A] text-center">{title}</h4>
      )}

      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={280}>
          <RechartsPieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              animationDuration={800}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="white"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {showLegend && <Legend content={<CustomLegend />} />}
          </RechartsPieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="text-center -mt-8">
          <span className="text-2xl font-bold text-[#1E3A8A]">
            {total.toLocaleString("es-AR")}
          </span>
          <span className="text-xs text-[#8B4513] block">Total</span>
        </div>
      </div>

      {/* Data table */}
      {showPercentage && (
        <div className="space-y-2 pt-2 border-t border-gray-100">
          {chartData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium truncate">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#1E3A8A]">
                  {item.value.toLocaleString("es-AR")}
                </span>
                <span className="text-xs text-[#8B4513]">
                  ({item.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
