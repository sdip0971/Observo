"use client";

import { useState } from "react";
import { supabase } from "@/config/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, Save, Loader2, Send } from "lucide-react";
import { Project } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface AlertSettingsProps {
  project: Project;
}

export function AlertSettings({ project }: AlertSettingsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

  // Form State
  const [enabled, setEnabled] = useState(project.alerts_enabled ?? true);
  const [discordWebhook, setDiscordWebhook] = useState(
    project.discord_webhook_url || ""
  );
  const [telegramToken, setTelegramToken] = useState(
    project.telegram_bot_token || ""
  );
  const [telegramChatId, setTelegramChatId] = useState(
    project.telegram_chat_id || ""
  );

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("projects")
      .update({
        discord_webhook_url: discordWebhook,
        telegram_bot_token: telegramToken,
        telegram_chat_id: telegramChatId,
        alerts_enabled: enabled,
      })
      .eq("id", project.id);

    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "Alert settings updated." });
    }
  };

  const handleTest = async () => {
    setTesting(true);
    // We intentionally save first to ensure the backend uses the latest credentials
    await handleSave();

    // Call a server action or internal API to trigger a test alert
    // For simplicity, we can simulate it or just show a toast if saved
    toast({
      title: "Configuration Saved",
      description: "Trigger an event to test alerts.",
    });
    setTesting(false);
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-zinc-100">
              <Bell className="h-5 w-5 text-indigo-400" />
              Real-time Alerts
            </CardTitle>
            <CardDescription>
              Receive notifications for traffic spikes and errors.
            </CardDescription>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>
      </CardHeader>

      {enabled && (
        <CardContent className="space-y-6">
          {/* Discord */}
          <div className="space-y-3">
            <Label className="text-zinc-300">Discord Webhook</Label>
            <Input
              value={discordWebhook}
              onChange={(e) => setDiscordWebhook(e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
              className="bg-zinc-950 border-zinc-800 font-mono text-xs"
            />
          </div>

          <div className="h-px bg-zinc-800" />

          {/* Telegram */}
          <div className="space-y-3">
            <Label className="text-zinc-300">Telegram Integration</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-zinc-500">Bot Token</span>
                <Input
                  value={telegramToken}
                  onChange={(e) => setTelegramToken(e.target.value)}
                  placeholder="123456:ABC-DEF..."
                  className="bg-zinc-950 border-zinc-800 font-mono text-xs"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-zinc-500">Chat ID</span>
                <Input
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="-100123456789"
                  className="bg-zinc-950 border-zinc-800 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={testing}
              className="border-zinc-700"
            >
              {testing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
