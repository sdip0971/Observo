"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MousePointer2, Activity } from "lucide-react";

interface AnalyticsDashboardProps {
  sourceId: string;
}

export function AnalyticsDashboard({ sourceId }: AnalyticsDashboardProps) {
  const [stats, setStats] = useState({
    visitors: 0,
    pageViews: 0,
    events: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      // Get data for the last 24 hours
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      // Query specifically by source_id (Much faster!)
      const { data, error } = await supabase
        .from("events")
        .select("type, payload, created_at")
        .eq("source_id", sourceId)
        .gte("created_at", yesterday.toISOString());

      if (error) {
        console.error("Error fetching stats:", error);
      } else {
        const events = data as any[];

        // Calculate Stats (Client-side aggregation for MVP)
        const pageViews = events.filter((e) => e.type === "page_view").length;
        const totalEvents = events.length;

        // Unique Visitors (Approximate via IP)
        const uniqueVisitors = new Set(
          events.map((e) => e.payload?.request_ip || "unknown")
        ).size;

        setStats({
          visitors: uniqueVisitors,
          pageViews: pageViews,
          events: totalEvents,
        });
      }
      setLoading(false);
    };

    fetchStats();
  }, [sourceId]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Visitors Card */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-100">
            Total Visitors (24h)
          </CardTitle>
          <Users className="h-4 w-4 text-zinc-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {loading ? "..." : stats.visitors}
          </div>
        </CardContent>
      </Card>

      {/* Page Views Card */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-100">
            Page Views (24h)
          </CardTitle>
          <MousePointer2 className="h-4 w-4 text-zinc-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {loading ? "..." : stats.pageViews}
          </div>
        </CardContent>
      </Card>

      {/* Total Events Card */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-zinc-100">
            Total Events (24h)
          </CardTitle>
          <Activity className="h-4 w-4 text-zinc-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {loading ? "..." : stats.events}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
