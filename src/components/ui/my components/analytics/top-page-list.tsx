"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface TopPage {
  path: string;
  count: number;
}

export function TopPagesList({ sourceId }: { sourceId: string }) {
  const [pages, setPages] = useState<TopPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      // Get last 24h
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { data, error } = await supabase.rpc("get_top_pages", {
        source_id_input: sourceId,
        start_time: yesterday.toISOString(),
      });

      if (!error && data) {
        setPages(data);
      }
      setLoading(false);
    };

    fetchPages();
  }, [sourceId]);

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-100 flex items-center gap-2">
          <FileText className="h-4 w-4 text-indigo-400" />
          Top Pages
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="text-xs text-zinc-500">Loading...</div>
          ) : pages.length === 0 ? (
            <div className="text-xs text-zinc-500">No page views yet.</div>
          ) : (
            pages.map((page) => (
              <div key={page.path} className="flex items-center justify-between text-sm">
                <span className="text-zinc-300 truncate max-w-50" title={page.path}>
                  {page.path}
                </span>
                <span className="font-mono text-zinc-500">{page.count}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}