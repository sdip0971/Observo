"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/config/supabase";
import { Source } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, RefreshCw, Trash2, AlertTriangle } from "lucide-react";

interface SourceSettingsProps {
  source: Source;
  projectId: string;
}

export function SourceSettings({ source, projectId }: SourceSettingsProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form States
  const [name, setName] = useState(source.name);
  const [domain, setDomain] = useState(source.domain || "");

  // 1. Update Details
  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("sources")
      .update({ name, domain })
      .eq("id", source.id);

    if (error) {
      console.error("Error updating source:", error);
    } else {
      setIsOpen(false);
      router.refresh(); // Refresh to show new name
    }
    setLoading(false);
  };

  // 2. Regenerate Key (Security Rotation)
  const handleRegenerateKey = async () => {
    const confirm = window.confirm(
      "Are you sure? The old key will stop working immediately."
    );
    if (!confirm) return;

    setLoading(true);
    // Generate a simple new key (in real apps, use a stronger crypto logic)
    const newKey = `sk_${
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    }`;

    const { error } = await supabase
      .from("sources")
      .update({ write_key: newKey })
      .eq("id", source.id);

    if (error) {
      console.error("Error rotating key:", error);
    } else {
      setIsOpen(false);
      router.refresh();
    }
    setLoading(false);
  };

  // 3. Delete Source (Destructive)
  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure? All events for this source will be deleted permanently."
    );
    if (!confirm) return;

    setLoading(true);
    const { error } = await supabase
      .from("sources")
      .delete()
      .eq("id", source.id);

    if (error) {
      console.error("Error deleting source:", error);
      setLoading(false);
    } else {
      // Redirect back to project page
      router.push(`/projects/${projectId}`);
      router.refresh();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Source Settings</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Manage configuration for <strong>{source.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* General Settings */}
          <div className="space-y-3">
            <Label className="text-xs font-medium text-zinc-500 uppercase">
              General
            </Label>
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-zinc-300">
                Display Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-900 border-zinc-800 focus:ring-indigo-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="domain" className="text-zinc-300">
                Domain
              </Label>
              <Input
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="bg-zinc-900 border-zinc-800 focus:ring-indigo-500"
              />
            </div>
            <Button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <div className="h-px bg-zinc-800 w-full" />

          {/* Danger Zone */}
          <div className="space-y-3">
            <Label className="text-xs font-medium text-red-500 uppercase flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Danger Zone
            </Label>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={handleRegenerateKey}
                disabled={loading}
                className="w-full justify-start border-zinc-800 hover:bg-zinc-900 text-zinc-300"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Rotate API Key
              </Button>

              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
                className="w-full justify-start bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Source
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
