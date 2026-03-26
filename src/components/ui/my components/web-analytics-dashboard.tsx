"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/config/supabase";
import useUser from "@/hooks/useUser";
import { Source } from "@/types";
import { Snippet } from "@/components/ui/my components/snippet"; // Move Snippet import here
import { AnalyticsDashboard } from "@/components/ui/my components/analytic-dashboard"; // We will create this next
import { TopPagesList } from "@/components/ui/my components/analytics/top-page-list";
import { TopReferrersList } from "@/components/ui/my components/analytics/top-reffers";
import { TrafficChart } from "@/components/ui/my components/analytics/traffic-chart";
import { TopDevicesList } from "@/components/ui/my components/analytics/top-devices";
import { CustomEventsList } from "@/components/ui/my components/analytics/custom-events";
import { ActiveVisitorsCard } from "@/components/ui/my components/active-user";
import { PerformanceWidget } from "@/components/ui/my components/analytics/performanc-widget";
import { SourceSettings } from "@/components/ui/my components/settings";

interface SourceDetailsPageProp {
projectId : string,
sourceId:string,
}
export default function SourceDetailsPage({projectId ,sourceId}:SourceDetailsPageProp ) {

  const { user } = useUser();
  const router = useRouter();

  const [source, setSource] = useState<Source | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSource = async () => {
      try {
        setLoading(true);
        // Fetch source and verify it belongs to the project
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
    return <div className="p-10 text-zinc-500">Loading analytics...</div>;
  if (!source) return null;

  return (
    <div className="min-h-screen  bg-zinc-950 text-zinc-100 p-6 lg:p-10 pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            className="w-fit text-zinc-400 hover:text-zinc-100 pl-0 hover:bg-transparent"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {source.name}
              </h1>
              <p className="text-zinc-400 mt-1">{source.domain}</p>
            </div>

            <SourceSettings source={source} projectId={projectId as string} />
          </div>
        </div>
        {/* Active Users */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-1">
            <ActiveVisitorsCard sourceId={sourceId as string} />
          </div>
          <div className="md:col-span-2">
            {/* Pass the full source object so we can read the scores */}
            {source && <PerformanceWidget source={source} />}
          </div>
          {/* You can move the other stats cards here if you want a cleaner layout */}
        </div>

        {/* 1. Analytics Dashboard (The Charts) */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Overview</h2>
          <AnalyticsDashboard sourceId={sourceId as string} />
        </div>

        {/* 2. Main Chart (NEW) */}
        <TrafficChart sourceId={sourceId as string} />

        <div className="grid gap-4 md:grid-cols-2">
          <TopPagesList sourceId={sourceId as string} />
          <TopReferrersList sourceId={sourceId as string} />
          <TopDevicesList sourceId={sourceId as string} />
          <CustomEventsList sourceId={sourceId as string} />
        </div>

        {/* 2. Integration Snippet (Specific to this source) */}
        <div className="pt-8 border-t border-zinc-800 space-y-4">
          <h2 className="text-lg font-semibold text-white">Integration</h2>
          <Snippet writeKey={source.write_key} />
        </div>
      </div>
    </div>
  );
}
