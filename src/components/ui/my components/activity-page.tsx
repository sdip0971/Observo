"use client";

import { useRouter } from "next/navigation";
import { LogOut, Command, Activity as ActivityIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarComponent } from "@/components/ui/my components/sidebar";
import { ActivityFeed } from "@/components/ui/my components/activity-feed";
import useUser from "@/hooks/useUser";
import { supabase } from "@/config/supabase";

export default function ActivityPage() {
  const router = useRouter();
  const { user, loading } = useUser();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/signin");
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30">
      <div className="fixed inset-0 -z-10 h-full w-full bg-zinc-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />

      {/* Mobile Header */}
      <div className="lg:hidden flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 backdrop-blur px-4">
        <div className="flex items-center gap-2 text-indigo-400 font-bold">
          <Command className="h-5 w-5" /> Observo
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5 text-zinc-500" />
        </Button>
      </div>

      <div className="flex">
        <SidebarComponent onLogoutAction={handleLogout} />

        <main className="flex-1 lg:pl-64 min-h-screen transition-all duration-300">
          <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <ActivityIcon className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                  Activity Feed
                </h1>
                <p className="text-sm text-zinc-400">
                  Real-time events across all your projects.
                </p>
              </div>
            </div>

         
            <ActivityFeed />
          </div>
        </main>
      </div>
    </div>
  );
}
