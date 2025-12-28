"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ChartData {
  time: string;
  originalTime: number; // Keep timestamp for sorting
  visitors: number;
}

export function TrafficChart({ sourceId }: { sourceId: string }) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // 1. Fetch Data from DB
      const { data: rawData, error } = await supabase.rpc(
        "get_events_over_time",
        {
          source_id_input: sourceId,
          start_time: twentyFourHoursAgo.toISOString(),
          interval_minutes: 60,
        }
      );

      if (!error && rawData) {
        // 2. Create a Map for O(1) lookup
        const dataMap = new Map();
        rawData.forEach((item: any) => {
          // Normalize DB time to nearest hour timestamp
          const date = new Date(item.bucket);
          dataMap.set(date.getTime(), Number(item.count));
        });

        // 3. Generate all 24 hours (Zero-Fill)
        const filledData: ChartData[] = [];
        for (let i = 0; i <= 24; i++) {
          const timePoint = new Date(
            twentyFourHoursAgo.getTime() + i * 60 * 60 * 1000
          );
          // Zero out minutes/seconds/ms to match bucket logic
          timePoint.setMinutes(0, 0, 0);

          const timestamp = timePoint.getTime();

          filledData.push({
            time: timePoint.toLocaleTimeString([], {
              hour: "numeric",
              hour12: true,
            }), // "10 AM"
            originalTime: timestamp,
            visitors: dataMap.get(timestamp) || 0, // Use DB value or 0
          });
        }

        setData(filledData);
      }
      setLoading(false);
    };

    fetchData();
  }, [sourceId]);

  return (
    
    <Card className="bg-zinc-900 border-zinc-800 col-span-2">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-100 flex items-center gap-2">
          <BarChart className="h-4 w-4 text-indigo-400" />
          Traffic (Last 24 Hours)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-75 w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
              Loading chart...
            </div>
          ) : data.every((d) => d.visitors === 0) ? (
            <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
              No traffic data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient
                    id="colorVisitors"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={30}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#e4e4e7" }}
                  labelStyle={{ color: "#a1a1aa", marginBottom: "4px" }}
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVisitors)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}