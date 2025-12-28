"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2 } from "lucide-react";

interface Referrer {
  referrer: string;
  count: number;
}

export function TopReferrersList({ sourceId }: { sourceId: string }) {
  const [referrers, setReferrers] = useState<Referrer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferrers = async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { data, error } = await supabase.rpc("get_top_referrers", {
        source_id_input: sourceId,
        start_time: yesterday.toISOString(),
      });

      if (!error && data) {
        setReferrers(data);
      }
      setLoading(false);
    };

    fetchReferrers();
  }, [sourceId]);

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-100 flex items-center gap-2">
          <Link2 className="h-4 w-4 text-emerald-400" />
          Top Referrers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="text-xs text-zinc-500">Loading...</div>
          ) : referrers.length === 0 ? (
            <div className="text-xs text-zinc-500">No referrers yet.</div>
          ) : (
            referrers.map((ref) => (
              <div key={ref.referrer} className="flex items-center justify-between text-sm">
                <span className="text-zinc-300 truncate max-w-50" title={ref.referrer}>
                  {ref.referrer.replace('https://', '').replace('http://', '')}
                </span>
                <span className="font-mono text-zinc-500">{ref.count}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}