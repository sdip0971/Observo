"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Activity, Globe, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/config/supabase";
import useUser from "@/hooks/useUser";
import { Source } from "@/types";

// 1. Import the Shadcn Tabs components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Existing Web Components
import { Snippet } from "@/components/ui/my components/snippet";
import { AnalyticsDashboard } from "@/components/ui/my components/analytic-dashboard";
import { TopPagesList } from "@/components/ui/my components/analytics/top-page-list";
import { TopReferrersList } from "@/components/ui/my components/analytics/top-reffers";
import { TrafficChart } from "@/components/ui/my components/analytics/traffic-chart";
import { TopDevicesList } from "@/components/ui/my components/analytics/top-devices";
import { CustomEventsList } from "@/components/ui/my components/analytics/custom-events";
import { ActiveVisitorsCard } from "@/components/ui/my components/active-user";
import { PerformanceWidget } from "@/components/ui/my components/analytics/performanc-widget";
import { SourceSettings } from "@/components/ui/my components/settings";

// 2. Import the new Server Dashboard
import { ServerDashboard } from "@/components/ui/my components/server-dashboard";

export default function SourceDashboard() {
  const params = useParams();
  const projectId = params.id as string;
  const sourceId = params.sourceId as string;

  const { user } = useUser();
  const router = useRouter();

  const [source, setSource] = useState<Source | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSource = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("sources")
          .select("*")
          .eq("id", sourceId)
          .eq("project_id", projectId)
          .single();

        if (error) throw error;
        setSource(data);
      } catch (error) {
        console.error("Error loading source:", error);
        router.replace(`/projects/${projectId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSource();
  }, [user, sourceId, projectId, router]);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="flex items-center gap-2 text-indigo-400">
          <Activity className="h-5 w-5 animate-pulse" />
          <span className="text-sm font-medium tracking-tight">
            Initializing Telemetry...
          </span>
        </div>
      </div>
    );

  if (!source) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-6 lg:p-10 pb-20 selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* --- Header Section --- */}
        <div className="flex flex-col gap-6">
          <Button
            variant="ghost"
            className="w-fit text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors pl-0 -ml-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                {source.name}
              </h1>
              <p className="flex items-center gap-2 text-zinc-400 mt-1.5 text-sm font-medium">
                <Globe className="h-4 w-4 text-indigo-400" />
                {source.domain}
              </p>
            </div>
            <div className="self-start sm:self-auto">
              <SourceSettings source={source} projectId={projectId} />
            </div>
          </div>
        </div>

        {/* --- The Tabs --- */}
        <Tabs defaultValue="web" className="space-y-6">
          <TabsList className="bg-zinc-900/50 border border-zinc-800/50 p-1 rounded-lg w-full sm:w-auto flex flex-col sm:flex-row h-auto sm:h-10">
            <TabsTrigger
              value="web"
              className="w-full sm:w-auto text-white data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-400 data-[state=active]:shadow-none transition-all rounded-md flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              Web Analytics
            </TabsTrigger>
            <TabsTrigger
              value="server"
              className="w-full sm:w-auto text-white data-[state=active]:bg-indigo-500/10 data-[state=active]:text-indigo-400 data-[state=active]:shadow-none transition-all rounded-md flex items-center gap-2"
            >
              <Server className="h-4 w-4" />
              Server Health
            </TabsTrigger>
          </TabsList>

          {/* --- TAB 1: Web Analytics --- */}
          <TabsContent
            value="web"
            className="space-y-8 animate-in fade-in-50 duration-500 outline-none"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-1">
                <ActiveVisitorsCard sourceId={sourceId} />
              </div>
              <div className="md:col-span-2">
                <PerformanceWidget source={source} />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-400" />
                Traffic Overview
              </h2>
              <AnalyticsDashboard sourceId={sourceId} />
            </div>

            <TrafficChart sourceId={sourceId} />

            <div className="grid gap-4 md:grid-cols-2">
              <TopPagesList sourceId={sourceId} />
              <TopReferrersList sourceId={sourceId} />
              <TopDevicesList sourceId={sourceId} />
              <CustomEventsList sourceId={sourceId} />
            </div>

            <div className="pt-8 border-t border-zinc-800/50 space-y-4">
              <h2 className="text-lg font-semibold text-white">Integration</h2>
              <Snippet writeKey={source.write_key} />
            </div>
          </TabsContent>

          {/* --- TAB 2: Server Health --- */}
          <TabsContent
            value="server"
            className="space-y-8 animate-in fade-in-50 duration-500 outline-none"
          >
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/50 pb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Server className="h-5 w-5 text-indigo-400" />
                  Server Telemetry
                </h2>

                {/* Beautiful Pulsing Live Indicator */}
                <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  <span className="text-xs font-medium text-indigo-400 uppercase tracking-wider">
                    Live Agent Linked
                  </span>
                </div>
              </div>

              {/* The Graph Component */}
              <ServerDashboard sourceId={sourceId} />
              <div className="pt-8 border-t border-zinc-800/50 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Deploy Agent
                  </h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    Run this command on any Ubuntu/Debian server to instantly
                    start monitoring it. You can run this on as many servers as
                    you want.
                  </p>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500/20 to-purple-500/20 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative flex items-center justify-between bg-zinc-950 border border-zinc-800 p-4 rounded-lg font-mono text-sm">
                    <span className="text-zinc-300 truncate mr-4">
                      <span className="text-indigo-400">curl</span> -sL "
                      {typeof window !== "undefined"
                        ? window.location.origin
                        : ""}
                      /api/agent/install?key={source.write_key}" |{" "}
                      <span className="text-indigo-400">sudo bash</span>
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="shrink-0 bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `curl -sL "${window.location.origin}/api/agent/install?key=${source.write_key}" | sudo bash`,
                        );
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
