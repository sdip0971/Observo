"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import { Activity, AlertCircle, Clock } from "lucide-react";

export function ProjectHealth({ projectId }: { projectId: string }) {
  const [status, setStatus] = useState<
    "loading" | "live" | "idle" | "inactive"
  >("loading");
  const [lastActive, setLastActive] = useState<Date | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      // 1. Get Sources for this project
      const { data: sources } = await supabase
        .from("sources")
        .select("id")
        .eq("project_id", projectId);

      if (!sources || sources.length === 0) {
        setStatus("inactive");
        return;
      }

      const sourceIds = sources.map((s) => s.id);

      // 2. Get latest event across all sources
      const { data: events } = await supabase
        .from("events")
        .select("created_at")
        .in("source_id", sourceIds)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!events || events.length === 0) {
        setStatus("inactive");
        return;
      }

      const lastTime = new Date(events[0].created_at);
      setLastActive(lastTime);

      const now = new Date();
      const diffMinutes = (now.getTime() - lastTime.getTime()) / 1000 / 60;

      if (diffMinutes < 30) setStatus("live"); // Active in last 30 mins
      else if (diffMinutes < 1440) setStatus("idle"); // Active in last 24h
      else setStatus("inactive");
    };

    checkHealth();
    // Poll every 60 seconds to keep it fresh
    const interval = setInterval(checkHealth, 60000);
    return () => clearInterval(interval);
  }, [projectId]);

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-zinc-600 animate-pulse" />
        <span className="text-xs text-zinc-600">Checking...</span>
      </div>
    );
  }

  if (status === "live") {
    return (
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-medium text-emerald-400">
          Operational
        </span>
      </div>
    );
  }

  if (status === "idle") {
    return (
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-amber-500/50" />
        <span className="text-xs text-amber-500 flex items-center gap-1">
          Idle{" "}
          <span className="text-zinc-600 hidden sm:inline">
            • {timeAgo(lastActive)}
          </span>
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-2 rounded-full bg-zinc-700" />
      <span className="text-xs text-zinc-600">Inactive</span>
    </div>
  );
}

// Helper to format "2h ago"
function timeAgo(date: Date | null) {
  if (!date) return "";
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
