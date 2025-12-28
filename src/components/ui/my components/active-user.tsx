"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

interface ActiveVisitorsCardProps {
  sourceId: string;
}

export function ActiveVisitorsCard({ sourceId }: ActiveVisitorsCardProps) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchActive = async () => {
      const { data, error } = await supabase.rpc("get_active_users", {
        source_id_input: sourceId,
        minutes_ago: 5, // Users active in last 5 mins
      });

      if (!error) {
        setCount(Number(data));
      }
    };

    // 1. Fetch immediately
    fetchActive();

    // 2. Poll every 10 seconds for "real-time" feel
    const interval = setInterval(fetchActive, 10000);
    return () => clearInterval(interval);
  }, [sourceId]);

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Active Now
          </span>
          <div className="text-2xl font-bold text-white">{count}</div>
        </div>
        <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
          <Users className="h-5 w-5 text-emerald-400" />
        </div>
      </CardContent>
    </Card>
  );
}
