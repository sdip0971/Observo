"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectHealth } from "@/components/ui/my components/project-health";
import Link from "next/link";
import {
  Plus,
  Search,
  LogOut,
  Command,
  LayoutDashboard,
  Settings,
  Activity,
  MoreVertical,
  FolderGit2,
  Cpu,
  Trash2,
  SettingsIcon,

} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import useUser from "@/hooks/useUser";
import { supabase } from "@/config/supabase";
import { Project } from "@/types";
import { SidebarComponent } from "@/components/ui/my components/sidebar";



const GridPattern = () => (
  <div className="fixed inset-0 -z-10 h-full w-full bg-zinc-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
);


export default function WorkspacePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const [creatingProject, setCreatingProject] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Fetch Projects
  const fetchProjects = async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching projects:", error);
    else setProjects(data ?? []);
  };

  // Create Project
  const createProject = async () => {
    if (creatingProject || !projectName.trim() || !user) return;
    setCreatingProject(true);

    const { error } = await supabase.from("projects").insert({
      name: projectName.trim(),
      owner_id: user.id,
    });

    if (error) {
      console.error("Create project error:", error.message);
    } else {
      setProjectName("");
      setIsCreateOpen(false);
      await fetchProjects();
    }
    setCreatingProject(false);
  };
  const handleDeleteProject = async (projectId: string) => {
    const confirm = window.confirm(
      "Are you sure? This will delete the project and ALL its data permanently."
    );
    if (!confirm) return;

    setProjects(projects.filter((p) => p.id !== projectId));

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      console.error("Error deleting project:", error);

      fetchProjects();
    }
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/signin");
  };

  useEffect(() => {
    if (!user) return;

    setProjectsLoading(true);
    fetchProjects().finally(() => setProjectsLoading(false));
  }, [user]);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30">
      <GridPattern />

      {user && <SidebarComponent onLogoutAction={handleLogout} />}

      <main className="lg:pl-64 min-h-screen transition-all duration-300">
        <div className="lg:hidden flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 backdrop-blur px-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold">
            <Command className="h-5 w-5" /> Observo
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5 text-zinc-500" />
          </Button>
        </div>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Projects
              </h1>
              <p className="text-sm text-zinc-400">
                Manage your active observation targets.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Filter projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-9 bg-zinc-900/50 border-zinc-800 text-sm focus-visible:ring-indigo-500/50"
                />
              </div>

              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)]">
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-950 border-zinc-800 sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-zinc-100">
                      Create Project
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                      Initialize a new container for your signals and events.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-500 uppercase">
                        Project Name
                      </label>
                      <Input
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="e.g. production-api-v2"
                        className="bg-zinc-900 border-zinc-800 focus-visible:ring-indigo-500/50"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setIsCreateOpen(false)}
                      className="text-zinc-400 hover:text-zinc-100"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={createProject}
                      disabled={creatingProject}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white"
                    >
                      {projectsLoading ? "Creating..." : "Create Project"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {projects.length === 0 && !projectsLoading ? (
            <div className="flex h-100 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 text-center">
              <div className="rounded-full bg-zinc-900 p-4 mb-4 ring-1 ring-zinc-800">
                <FolderGit2 className="h-8 w-8 text-zinc-500" />
              </div>
              <h3 className="text-lg font-medium text-zinc-200">
                No projects found
              </h3>
              <p className="mt-1 text-sm text-zinc-500 max-w-xs mx-auto">
                You haven't created any projects yet. Start by creating one to
                track your system.
              </p>
              <Button
                variant="link"
                onClick={() => setIsCreateOpen(true)}
                className="mt-4 text-indigo-400 hover:text-indigo-300"
              >
                Create your first project
              </Button>
            </div>
          ) : (
            // Projects Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <Link key={project.id} href={`/project/${project.id}`}>
                  <div className="group relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all cursor-pointer h-full">
                    {/* Card Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-indigo-400 group-hover:text-indigo-300 group-hover:bg-indigo-500/10 transition-colors">
                          <Cpu className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-zinc-200 group-hover:text-white transition-colors">
                            {project.name}
                          </h3>
                          <div className="mt-1">
                            <ProjectHealth projectId={project.id} />
                          </div>
                        </div>
                      </div>

                      {/* Dropdown Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 -mt-1 -mr-2 text-zinc-500 hover:text-zinc-300"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-zinc-950 border-zinc-800 text-zinc-300 w-48"
                        >
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/project/${project.id}`}
                              className="w-full cursor-pointer focus:bg-zinc-900 focus:text-zinc-100 group flex items-center"
                            >
                              <SettingsIcon className="mr-2 h-4 w-4 text-zinc-500 group-hover:text-zinc-300" />
                              View Details
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-zinc-800" />

                          <DropdownMenuItem
                            className="text-red-400 focus:text-red-300 focus:bg-red-950/20 cursor-pointer flex items-center"
                            onClick={(e) => {
                              e.preventDefault(); // Prevent Link navigation
                              handleDeleteProject(project.id);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-6 pt-4 border-t border-zinc-800/50 flex items-center justify-between text-xs text-zinc-500">
                      <div className="flex items-center gap-2">
                        <Activity className="h-3 w-3" />
                        <span>Monitoring Active</span>
                      </div>
                      <span className="font-mono opacity-50">
                        ID: {project.id.slice(0, 4)}...
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              {/* No Search Results State */}
              {filteredProjects.length === 0 && projects.length > 0 && (
                <div className="col-span-full py-12 text-center text-zinc-500">
                  <p>No projects found matching "{searchQuery}"</p>
                  <Button
                    variant="link"
                    onClick={() => setSearchQuery("")}
                    className="text-indigo-400"
                  >
                    Clear filter
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
