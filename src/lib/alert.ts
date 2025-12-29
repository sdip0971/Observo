import { supabase } from "@/config/supabase";

interface AlertPayload {
  projectId: string;
  title: string;
  message: string;
  color?: number; // For Discord Embed Color (e.g. 0xFF0000 for red)
}

export async function sendAlert({
  projectId,
  title,
  message,
  color = 5763719,
}: AlertPayload) {
  try {
    // 1. Fetch credentials securely
    const { data: project, error } = await supabase
      .from("projects")
      .select(
        "discord_webhook_url, telegram_bot_token, telegram_chat_id, alerts_enabled"
      )
      .eq("id", projectId)
      .single();

    if (error || !project || !project.alerts_enabled) return;

    const alertPromises = [];

    // 2. Queue Discord Alert
    if (project.discord_webhook_url) {
      alertPromises.push(
        fetch(project.discord_webhook_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [
              {
                title: title,
                description: message,
                color: color,
                footer: { text: "Observo Analytics" },
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        }).catch((err) => console.error("Discord Alert Failed:", err))
      );
    }

    // 3. Queue Telegram Alert
    if (project.telegram_bot_token && project.telegram_chat_id) {
      const telegramUrl = `https://api.telegram.org/bot${project.telegram_bot_token}/sendMessage`;
      alertPromises.push(
        fetch(telegramUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: project.telegram_chat_id,
            text: `🚨 *${title}*\n\n${message}`,
            parse_mode: "Markdown",
          }),
        }).catch((err) => console.error("Telegram Alert Failed:", err))
      );
    }

    // 4. Execute all alerts in parallel (non-blocking)
    await Promise.allSettled(alertPromises);
  } catch (err) {
    console.error("Alert System Error:", err);
  }
}
