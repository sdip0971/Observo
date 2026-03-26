"use client";

import { useServerMetrics } from "@/hooks/use-Server";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; //

interface ServerDashboardProps {
  sourceId: string;
}

export function ServerDashboard({ sourceId }: ServerDashboardProps) {
  // Look how clean this is now!
  const { metrics, loading, error } = useServerMetrics(sourceId, 24);

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Handle our different states cleanly
  if (loading)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading server telemetry...
      </div>
    );
  if (error)
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (metrics.length === 0)
    return (
      <div className="p-8 text-center text-muted-foreground">
        No server data received yet. Run your bash script!
      </div>
    );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Resources (Last 24 Hours)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={metrics}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="created_at"
                  tickFormatter={formatTime}
                  minTickGap={30}
                />
                <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                <Tooltip
                  labelFormatter={(label) => formatTime(label as string)}
                  formatter={(value: number) => [`${value.toFixed(1)}%`]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cpu_percent"
                  name="CPU Usage"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="memory_percent"
                  name="Memory Usage"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
