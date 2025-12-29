"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import { Activity, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import useUser from "@/hooks/useUser";

interface GlobalEvent {
  id: string;
  type: string;
  payload: any;
  created_at: string;
  sources: {
    name: string;
    projects: {
      name: string;
    };
  };
}

export function ActivityFeed() {
  const { user } = useUser();
  const [events, setEvents] = useState<GlobalEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGlobalEvents = async () => {
    if (!user) return;
    setLoading(true);

    // Fetch events where the project owner is the current user
    // We join events -> sources -> projects
    const { data, error } = await supabase
      .from("events")
      .select(
        `
        *,
        sources!inner (
          name,
          projects!inner (
            name,
            owner_id
          )
        )
      `
      )
      .eq("sources.projects.owner_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching activity:", error);
    } else {
      setEvents((data as any[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGlobalEvents();
  }, [user]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-400" />
          Global Activity
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchGlobalEvents}
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
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
            <Layers className="h-12 w-12 mb-4 opacity-20" />
            <p>No recent activity across your projects.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-4 hover:bg-zinc-900/60 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Event Info */}
                  <div className="flex items-start gap-4">
                    <div className="mt-1 h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm text-white font-medium">
                          {event.type}
                        </span>
                        <span className="text-xs text-zinc-500">on</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {event.sources?.projects?.name} /{" "}
                          {event.sources?.name}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-zinc-500 max-w-md truncate">
                        {JSON.stringify(event.payload)}
                      </div>
                    </div>
                  </div>

                  {/* Right: Time */}
                  <span className="text-xs text-zinc-600 font-mono whitespace-nowrap pl-6 sm:pl-0">
                    {new Date(event.created_at).toLocaleString()}
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
