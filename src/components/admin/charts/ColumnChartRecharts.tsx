"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ColumnChartData {
  date: string;
  value: number;
  count?: number;
}

interface ColumnChartRechartsProps {
  data: ColumnChartData[];
  title?: string;
  color?: string;
  formatValue?: (value: number) => string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  formatValue,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  formatValue?: (value: number) => string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-semibold text-[#1E3A8A]">
          {formatValue ? formatValue(payload[0].value) : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export function ColumnChartRecharts({
  data,
  title,
  color = "#9DC65D",
  formatValue = (val: number): string => val.toString(),
}: ColumnChartRechartsProps) {
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

  const formatXAxis = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (data.length > 30) {
        return date.toLocaleDateString("es-AR", { month: "short" });
      }
      return date.toLocaleDateString("es-AR", { day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-3">
      {title && (
        <h4 className="font-medium text-[#1E3A8A] mb-4 text-center">{title}</h4>
      )}
      <ResponsiveContainer width="100%" height={280}>
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 10, left: 0, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E5E7EB"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 10, fill: "#8B4513" }}
            axisLine={{ stroke: "#E5E7EB" }}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 11, fill: "#8B4513" }}
            axisLine={false}
            tickLine={false}
            width={55}
          />
          <Tooltip content={<CustomTooltip formatValue={formatValue} />} />
          <Bar
            dataKey="value"
            fill={color}
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
