"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
  value2?: number;
  label?: string;
}

interface LineChartRechartsProps {
  data: DataPoint[];
  title?: string;
  color?: string;
  color2?: string;
  formatValue?: (value: number) => string;
  showGrid?: boolean;
  showSecondLine?: boolean;
  secondLineLabel?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  formatValue,
  showSecondLine,
}: {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; color: string }>;
  label?: string;
  formatValue?: (value: number) => string;
  showSecondLine?: boolean;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-600">
              {entry.dataKey === "value" ? "Principal" : "Secundaria"}:
            </span>
            <span className="text-sm font-semibold text-[#1E3A8A]">
              {formatValue ? formatValue(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function LineChartRecharts({
  data,
  title,
  color = "#9DC65D",
  color2 = "#D4A853",
  formatValue = (val: number): string => val.toString(),
  showGrid = true,
  showSecondLine = false,
  secondLineLabel = "Comparación",
}: LineChartRechartsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No hay datos para mostrar
      </div>
    );
  }

  const formatYAxis = (value: number) => {
    if (formatValue(1) === "1") {
      return value.toString();
    }
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return formatValue(value);
  };

  return (
    <div className="space-y-4">
      {title && (
        <h4 className="font-medium text-[#1E3A8A] text-center">{title}</h4>
      )}

      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
          )}
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#8B4513" }}
            axisLine={{ stroke: "#E5E7EB" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 11, fill: "#8B4513" }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip
            content={
              <CustomTooltip
                formatValue={formatValue}
                showSecondLine={showSecondLine}
              />
            }
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            dot={{ fill: color, strokeWidth: 2, stroke: "white", r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
            animationDuration={1000}
          />
          {showSecondLine && (
            <Line
              type="monotone"
              dataKey="value2"
              stroke={color2}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: color2, strokeWidth: 2, stroke: "white", r: 3 }}
              activeDot={{ r: 5, strokeWidth: 2 }}
              name={secondLineLabel}
              animationDuration={1000}
            />
          )}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
