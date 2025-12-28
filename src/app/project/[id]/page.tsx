"use client";

import { useEffect, useState } from "react";
import { EventsList } from "@/components/ui/my components/event-list";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import {
  ArrowLeft,
  Plus,
  Globe,
  Key,
  Copy,
  Check,
  Server,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/config/supabase";
import useUser from "@/hooks/useUser";
import { Project, Source } from "@/types";
import { Snippet } from "@/components/ui/my components/snippet";
import Link from "next/link";

const createSourceSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name must be less than 30 characters"),
  domain: z
    .string()
    .trim()
    .min(3, "Domain is required")
    .refine((val) => val.includes("."), {
      message: "Must be a valid domain (e.g. google.com)",
    }),
});

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { user } = useUser();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceDomain, setNewSourceDomain] = useState("");
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState<{ name?: string[]; domain?: string[] }>({});

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", id)
          .single();
        if (projectError) throw projectError;
        setProject(projectData);

        const { data: sourcesData, error: sourcesError } = await supabase
          .from("sources")
          .select("*")
          .eq("project_id", id)
          .order("created_at", { ascending: false });
        if (sourcesError) throw sourcesError;
        setSources(sourcesData || []);
      } catch (error) {
        console.error("Error loading project:", error);
        router.replace("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, id, router]);

  const createSource = async () => {
    if (!user) return;

    const validation = createSourceSchema.safeParse({
      name: newSourceName,
      domain: newSourceDomain,
    });

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
      return;
    }

    setErrors({});
    setCreating(true);

    const { data, error } = await supabase
      .from("sources")
      .insert({
        project_id: id,
        name: validation.data.name,
        domain: validation.data.domain,
      })
      .select()
      .single();

    if (error) {
      console.log("Failed to create source:", error);
    } else if (data) {
      setSources([data, ...sources]);
      setNewSourceName("");
      setNewSourceDomain("");
      setIsCreateOpen(false);
    }
    setCreating(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading)
    return (
      <div className="flex p-10 h-full justify-center items-center text-zinc-500">
        Loading project context...
      </div>
    );
  if (!project) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 lg:p-10 pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            className="w-fit text-zinc-400 hover:text-zinc-100 pl-0 hover:bg-transparent"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workspace
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {project.name}
              </h1>
              <p className="text-zinc-400 mt-1">
                Manage data sources and API keys
              </p>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-500">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Source
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-950 border-zinc-800">
                <DialogHeader>
                  <DialogTitle>Add Data Source</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase">
                      Source Name
                    </label>
                    <Input
                      placeholder="e.g. Marketing Site"
                      value={newSourceName}
                      onChange={(e) => setNewSourceName(e.target.value)}
                      className="bg-zinc-900 border-zinc-800 focus:ring-indigo-500"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-400">{errors.name[0]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase">
                      Domain
                    </label>
                    <Input
                      placeholder="e.g. google.com"
                      value={newSourceDomain}
                      onChange={(e) => setNewSourceDomain(e.target.value)}
                      className="bg-zinc-900 border-zinc-800 focus:ring-indigo-500"
                    />
                    {errors.domain && (
                      <p className="text-xs text-red-400">{errors.domain[0]}</p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={createSource}
                    disabled={creating}
                    className="bg-indigo-600 hover:bg-indigo-500"
                  >
                    {creating ? "Generating Key..." : "Create Source"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4">
          {sources.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 text-center">
              <div className="rounded-full bg-zinc-900 p-4 mb-4 ring-1 ring-zinc-800">
                <Server className="h-8 w-8 text-zinc-500" />
              </div>
              <h3 className="text-lg font-medium text-zinc-200">
                No sources configured
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                Add a source to generate an API Key.
              </p>
            </div>
          ) : (
            sources.map((source) => (
          
                <Link
                  key={source.id}
                  href={`/project/${id}/source/${source.id}`}
                >
                  <div className="flex flex-col  sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-zinc-100">
                            {source.name}
                          </h3>
                          <span className="inline-flex items-center rounded-full bg-emerald-400/10 px-2 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-400/20">
                            Active
                          </span>
                        </div>
                        <p className="text-sm text-zinc-500 font-mono">
                          {source.domain || "No domain configured"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-zinc-950 p-2 pl-4 rounded-lg border border-zinc-800/50">
                      <Key className="h-4 w-4 text-zinc-500" />
                      <code className="font-mono text-sm text-zinc-400">
                        {source.write_key}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-zinc-800 hover:text-white"
                        onClick={() => copyToClipboard(source.write_key)}
                      >
                        {copiedKey === source.write_key ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </Link>
            
            ))
          )}
        </div>

        {sources.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 pt-8 border-t border-zinc-800">
            <Snippet writeKey={sources[0].write_key} />{" "}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-zinc-100">
                Testing Instructions
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                1. Copy the snippet.
                <br />
                2. Paste it into an `index.html` file on your computer.
                <br />
                3. Open that file in your browser.
                <br />
                4. Watch the <b>Live Feed</b> below populate automatically.
              </p>
            </div>
          </div>
        )}

        <div className="pt-8 border-t border-zinc-800">
          <EventsList projectId={id as string} />
        </div>
      </div>
    </div>
  );
}