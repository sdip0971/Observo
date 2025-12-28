"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import { AnalyticsEvent } from "@/types";
import { RefreshCw, Activity, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EventsList({ projectId }: { projectId: string }) {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);

    
    const { data, error } = await supabase
      .from("events")
      .select(
        `
        *,
        sources ( name, domain )
      `
      )
      .eq("sources.project_id", projectId)
      // Filter by sources belonging to this project (via the relationship)
      // Note: RLS handles security, but we still need to filter by project logic if needed.
      // However, simplified RLS usually allows viewing all owned events.
      // For performance, we'll rely on the fact that we are viewing a specific project context.
      // A more optimized query would filter by source_id list, but this is fine for now.
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Error fetching events:", error);
    } else {
     
      setEvents((data as any[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, [projectId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-semibold text-white">Live Feed</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchEvents}
          className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        {events.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            Waiting for events...
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-4 hover:bg-zinc-900/60 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white font-mono">
                        {event.type}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {event.sources?.name || "Unknown Source"}
                      </span>
                    </div>

     
                    <div className="mt-2 text-xs font-mono text-zinc-400 bg-black/40 p-2 rounded border border-zinc-800/50 w-full overflow-x-auto">
                      {JSON.stringify(event.payload, null, 2)}
                    </div>
                  </div>

                  <span className="text-xs text-zinc-600 whitespace-nowrap">
                    {new Date(event.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
