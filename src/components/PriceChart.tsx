import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import type { PriceEntry } from "@/api/types";

export default function PriceChart({
  prices,
  strokeColor = "#C8922A",
  height = 220,
  showAxes = true,
}: {
  prices: PriceEntry[];
  strokeColor?: string;
  height?: number;
  showAxes?: boolean;
}) {
  const data = prices
    .slice()
    .sort((a, b) => a.dateObserved.localeCompare(b.dateObserved))
    .map((p) => ({ date: p.dateObserved, price: p.price }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
        {showAxes && <CartesianGrid stroke="rgba(61,43,31,0.08)" vertical={false} />}
        {showAxes && (
          <XAxis
            dataKey="date"
            stroke="#7A6F60"
            tick={{ fontSize: 11 }}
            tickFormatter={(d) => d?.slice(5) ?? ""}
          />
        )}
        {showAxes && (
          <YAxis
            stroke="#7A6F60"
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => `$${v}`}
            width={42}
          />
        )}
        {showAxes && (
          <Tooltip
            formatter={(v: number) => [`$${v.toFixed(2)}`, "price"]}
            labelStyle={{ color: "#2C2418" }}
            contentStyle={{
              background: "white",
              border: "1px solid rgba(61,43,31,0.15)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
        )}
        <Line
          type="monotone"
          dataKey="price"
          stroke={strokeColor}
          strokeWidth={2}
          dot={{ r: 3, fill: strokeColor }}
          activeDot={{ r: 5 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
