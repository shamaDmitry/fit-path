import type { WeightDataPoint } from "@/types/quiz";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface WeightChartProps {
  data: WeightDataPoint[];
  goalWeight: number;
  unit: string;
}

export function WeightChart({ data, goalWeight, unit }: WeightChartProps) {
  if (data.length === 0) return null;

  const maxWeight = Math.max(...data.map((d) => d.weight));
  const minWeight = Math.min(goalWeight * 0.95, ...data.map((d) => d.weight));

  return (
    <div className="w-full h-64 mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

          <XAxis
            dataKey="label"
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
          />

          <YAxis
            domain={[Math.floor(minWeight), Math.ceil(maxWeight)]}
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            tickFormatter={(value) => `${value}`}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              boxShadow: "var(--shadow-soft)",
            }}
            labelStyle={{ color: "var(--foreground)" }}
            formatter={(value) => [`${value ?? ""} ${unit}`, "Weight"]}
          />

          <ReferenceLine
            y={goalWeight}
            stroke="var(--primary)"
            strokeDasharray="15 10"
            label={{
              value: `Goal: ${goalWeight} ${unit}`,
              position: "insideBottom",
              fill: "var(--primary)",
              fontSize: 12,
            }}
          />

          <Line
            type="monotone"
            dataKey="weight"
            stroke="var(--primary)"
            strokeWidth={1}
            dot={{ fill: "var(--primary)", strokeWidth: 0, r: 2 }}
            activeDot={{ fill: "var(--primary)", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
