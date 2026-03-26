import { useState, useEffect } from "react";
import { supabase } from "@/config/supabase"; //
import { ServerMetricRow } from "@/types"; //

export function useServerMetrics(sourceId: string, hours: number = 24) {
  const [metrics, setMetrics] = useState<ServerMetricRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {

      setLoading(true);
      setError(null);


      const timeAgo = new Date(
        Date.now() - hours * 60 * 60 * 1000,
      ).toISOString();

      const { data, error } = await supabase
        .from("server_metrics")
        .select("*")
        .eq("source_id", sourceId)
        .gte("created_at", timeAgo)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching server metrics:", error);
        setError(error.message);
      } else {
        setMetrics(data || []);
      }

      setLoading(false);
    }


    if (sourceId) {
      fetchMetrics();
    }
  }, [sourceId, hours]); 

  return { metrics, loading, error };
}
