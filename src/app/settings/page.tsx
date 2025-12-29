"use client";

import { useRouter } from "next/navigation";
import { LogOut, User, Mail, Shield, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarComponent } from "@/components/ui/my components/sidebar";
import useUser from "@/hooks/useUser";
import { supabase } from "@/config/supabase";
import SettingsDash from "@/components/ui/my components/setting-dashboard";

export default function SettingsPage() {

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30">
     <SettingsDash/>
    </div>
  );
}
