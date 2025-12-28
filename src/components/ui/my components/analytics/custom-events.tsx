"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

interface CustomEvent {
  event_name: string;
  count: number;
}

export function CustomEventsList({ sourceId }: { sourceId: string }) {
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { data, error } = await supabase.rpc("get_custom_events", {
        source_id_input: sourceId,
        start_time: yesterday.toISOString(),
      });

      if (!error && data) {
        setEvents(data);
      }
      setLoading(false);
    };

    fetchData();
  }, [sourceId]);

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-100 flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-400" />
          Custom Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="text-xs text-zinc-500">Loading...</div>
          ) : events.length === 0 ? (
            <div className="text-xs text-zinc-500">No custom events yet.</div>
          ) : (
            events.map((e) => (
              <div
                key={e.event_name}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-zinc-300 font-mono text-xs bg-zinc-800/50 px-2 py-1 rounded">
                  {e.event_name}
                </span>
                <span className="font-mono text-zinc-500">{e.count}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
