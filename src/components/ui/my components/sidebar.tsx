import { Activity, Command, FolderGit2, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { Button } from "../button";

export const SidebarComponent = ({ onLogout }: { onLogout: () => void }) => (
  <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-800 bg-zinc-950/50 backdrop-blur-xl hidden lg:flex flex-col">
    {/* Header */}
    <div className="flex h-16 items-center border-b border-zinc-800 px-6">
      <div className="flex items-center gap-2 text-indigo-400 font-bold tracking-tight">
        <Command className="h-5 w-5" />
        <span className="text-zinc-100">Observo</span>
      </div>
    </div>

    {/* Navigation */}
    <nav className="flex-1 space-y-1 p-4">
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
      >
        <LayoutDashboard className="h-4 w-4" />
        Overview
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 bg-zinc-900 text-zinc-100 font-medium shadow-inner shadow-black/20"
      >
        <FolderGit2 className="h-4 w-4 text-indigo-400" />
        Projects
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
      >
        <Activity className="h-4 w-4" />
        Activity
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
      >
        <Settings className="h-4 w-4" />
        Settings
      </Button>
    </nav>

    {/* Footer / User Profile */}
    <div className="border-t border-zinc-800 p-4">
      <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500" />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-zinc-200">Engineer</span>
            <span className="text-[10px] text-zinc-500">Pro Plan</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-950/20"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </aside>
);
