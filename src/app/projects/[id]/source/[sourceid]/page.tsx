"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/config/supabase";
import useUser from "@/hooks/useUser";
import { Source } from "@/types";
import { Snippet } from "@/components/ui/my components/snippet"; // Move Snippet import here
import { AnalyticsDashboard } from "@/components/ui/my components/analytic-dashboard";// We will create this next

export default function SourceDetailsPage() {
  const params = useParams();
  const { id: projectId, sourceId } = params;
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 lg:p-10 pb-20">
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
            <Button variant="outline" className="border-zinc-800 text-zinc-400">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* 1. Analytics Dashboard (The Charts) */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Overview</h2>
          <AnalyticsDashboard sourceId={sourceId as string} />
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
