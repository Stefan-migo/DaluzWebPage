"use client";

import { useMemo } from "react";
import { ArrowDown } from "lucide-react";

interface FunnelStep {
  name: string;
  value: number;
  icon?: React.ReactNode;
}

interface FunnelChartProps {
  data: FunnelStep[];
  title?: string;
  colors?: string[];
}

export function FunnelChart({
  data,
  title,
  colors = ["#9DC65D", "#7FB3D3", "#D4A853", "#C9A0DC", "#E88D8D"],
}: FunnelChartProps) {
  const { maxValue, stepsWithPercentages, hasData } = useMemo(() => {
    if (!data || data.length === 0) {
      return { maxValue: 0, stepsWithPercentages: [], hasData: false };
    }

    const max = Math.max(...data.map((d) => d.value));
    const steps = data.map((step, index) => ({
      ...step,
      percentage: max > 0 ? (step.value / max) * 100 : 0,
      dropoff:
        index > 0 && data[index - 1].value > 0
          ? (
              ((data[index - 1].value - step.value) / data[index - 1].value) *
              100
            ).toFixed(1)
          : null,
    }));

    return {
      maxValue: max,
      stepsWithPercentages: steps,
      hasData: data.some((d) => d.value > 0),
    };
  }, [data]);

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-tierra-media space-y-2">
        <p className="text-lg font-medium">
          No hay datos de funnel para mostrar
        </p>
        <p className="text-sm text-center max-w-md">
          Una vez que los usuarios comiencen a interactuar con el sitio, el
          funnel de conversión mostrará los datos aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title && (
        <h4 className="font-medium text-azul-profundo text-center">{title}</h4>
      )}

      <div className="space-y-2">
        {stepsWithPercentages.map((step, index) => (
          <div key={step.name} className="relative">
            {/* Step bar */}
            <div
              className="h-12 rounded-lg flex items-center px-4 transition-all duration-500"
              style={{
                width: `${Math.max(step.percentage, 10)}%`,
                backgroundColor: colors[index % colors.length],
                marginLeft: `${(100 - step.percentage) / 2}%`,
              }}
            >
              <div className="flex items-center justify-between w-full text-white">
                <div className="flex items-center gap-2">
                  {step.icon}
                  <span className="font-medium">{step.name}</span>
                </div>
                <span className="font-bold">
                  {step.value.toLocaleString("es-AR")}
                </span>
              </div>
            </div>

            {/* Drop-off indicator */}
            {step.dropoff && (
              <div className="flex items-center justify-center mt-1 text-sm">
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-red-500 font-medium">
                  {step.dropoff}%
                </span>
                <span className="text-tierra-media ml-1">abandono</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-tierra-media mb-1">
            Tasa Conversión Global
          </p>
          <p className="font-bold text-lg text-verde-suave">
            {maxValue > 0 && data.length > 0
              ? ((data[data.length - 1].value / data[0].value) * 100).toFixed(2)
              : "0.00"}
            %
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-tierra-media mb-1">Mayor Drop-off</p>
          <p className="font-bold text-lg text-red-500">
            {stepsWithPercentages.length > 1
              ? Math.max(
                  ...stepsWithPercentages
                    .filter((_, i) => i > 0)
                    .map((s) => parseFloat(s.dropoff || "0")),
                ).toFixed(1)
              : "0"}
            %
          </p>
        </div>
      </div>
    </div>
  );
}
