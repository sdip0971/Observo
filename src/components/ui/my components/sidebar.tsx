"use client"
import { Activity, Command, FolderGit2, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { Button } from "../button";
import useUser from "@/hooks/useUser";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SidebarComponent = ({ onLogoutAction }: { onLogoutAction: () => void }) =>{ 
  const {user} = useUser()
const pathname = usePathname();
  
  const getLinkClass = (path: string, strict = false) => {
    const isActive = strict ? pathname === path : pathname.startsWith(path);

    return `w-full justify-start gap-2 transition-all ${
      isActive
        ? "bg-zinc-900 text-zinc-100 font-medium shadow-inner shadow-black/20"
        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
    }`;
  };
  
  
  return (
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
       
        <Link href="/dashboard">
          <Button variant="ghost" className={getLinkClass("/dashboard")}>
            <FolderGit2 className="h-4 w-4 text-indigo-400" />
            Projects
          </Button>
        </Link>
        <Link href="/activity">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-zinc-400"
          >
            <Activity className="h-4 w-4" />
            Activity
          </Button>
        </Link>
        <Link href="/settings">
          <Button variant="ghost" className={getLinkClass("/settings")}>
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </Link>
      </nav>

      <div className="border-t border-zinc-800/60 bg-zinc-950/60 p-3 backdrop-blur">
        <div
          className="
          flex items-center justify-between gap-3
          rounded-xl
          border border-zinc-800/70
          bg-linear-to-b from-zinc-900/70 to-zinc-950/70
          px-3 py-2
          shadow-sm
        "
        >
          {/* User Info */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar – PURE DIV (NO next/image) */}
            <div
              className="
              h-9 w-9 rounded-full
              bg-linear-to-br from-indigo-500 via-purple-500 to-fuchsia-500
              ring-2 ring-zinc-900
              shadow-inner
              flex items-center justify-center
              text-xs font-semibold text-white
            "
            >
              {(user?.email?.[0] || user?.id?.[0] || "U").toUpperCase()}
            </div>

            {/* Text */}
            <div className="flex flex-col min-w-0">
              <span className="truncate text-xs font-medium text-zinc-200">
                {user?.email || user?.phone || user?.id || "Unknown user"}
              </span>
              <span className="text-[10px] text-zinc-500">Logged in</span>
            </div>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogoutAction}
            className="
            h-8 w-8 rounded-md
            text-zinc-400
            transition
            hover:bg-red-500/10
            hover:text-red-400
            active:scale-95
          "
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
