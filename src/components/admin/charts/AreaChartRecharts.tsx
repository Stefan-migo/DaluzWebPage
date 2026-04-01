"use client";

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface DataPoint {
  date: string;
  value: number;
  count?: number;
}

interface AreaChartRechartsProps {
  data: DataPoint[];
  title?: string;
  color?: string;
  formatValue?: (value: number) => string;
  showGrid?: boolean;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  formatValue,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
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

export function AreaChartRecharts({
  data,
  title,
  color = "#9DC65D",
  formatValue = (val) => val.toString(),
  showGrid = true,
}: AreaChartRechartsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-2">
        <p className="text-lg font-medium">No hay datos para mostrar</p>
        <p className="text-sm text-center max-w-md">
          No se encontraron datos para el período seleccionado.
        </p>
      </div>
    );
  }

  const formatXAxis = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (data.length > 30) {
        return date.toLocaleDateString("es-AR", {
          month: "short",
          day: "numeric",
        });
      }
      return date.toLocaleDateString("es-AR", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return dateStr;
    }
  };

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

  const avg = data.reduce((sum, item) => sum + item.value, 0) / data.length;

  return (
    <div className="space-y-4">
      {title && (
        <h4 className="font-medium text-[#1E3A8A] text-center">{title}</h4>
      )}

      <ResponsiveContainer width="100%" height={280}>
        <RechartsAreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient
              id={`areaGradient-${color.replace("#", "")}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="50%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
          )}
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 11, fill: "#8B4513" }}
            axisLine={{ stroke: "#E5E7EB" }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 11, fill: "#8B4513" }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip content={<CustomTooltip formatValue={formatValue} />} />
          {avg > 0 && (
            <ReferenceLine
              y={avg}
              stroke="#D4A853"
              strokeDasharray="5 5"
              strokeWidth={1}
            />
          )}
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#areaGradient-${color.replace("#", "")})`}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </RechartsAreaChart>
      </ResponsiveContainer>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
        <div className="text-center p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-[#8B4513] mb-1">Promedio</p>
          <p className="font-bold text-sm text-[#1E3A8A]">
            {formatValue(
              Math.round(
                data.reduce((sum, item) => sum + item.value, 0) / data.length,
              ),
            )}
          </p>
        </div>
        <div className="text-center p-2 bg-[#9DC65D]/10 rounded-lg border border-[#9DC65D]/20">
          <p className="text-xs text-[#8B4513] mb-1">Máximo</p>
          <p className="font-bold text-sm text-[#9DC65D]">
            {formatValue(Math.max(...data.map((d) => d.value)))}
          </p>
        </div>
        <div className="text-center p-2 bg-red-50 rounded-lg border border-red-100">
          <p className="text-xs text-[#8B4513] mb-1">Mínimo</p>
          <p className="font-bold text-sm text-red-600">
            {formatValue(Math.min(...data.map((d) => d.value)))}
          </p>
        </div>
      </div>
    </div>
  );
}
