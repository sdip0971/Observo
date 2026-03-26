import { sendAlert } from "@/lib/alert";
import { inngest } from "./client";
import { supabase } from "@/config/supabase";
import { createClient } from "@supabase/supabase-js";
import { exec } from "child_process";
import { NodeSSH } from "node-ssh";


const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export const processPageView = inngest.createFunction(
  { id: "process-page-view" },
  { event: "analytics/page-viewed" },
  async ({ event, step }) => {
    const {
      projectId,
      domain,
      url,
      referrer,
      city,
      country,
      region,
      browser,
      device,
      os,
    } = event.data;

    await step.run("record-page-view", async () => {
      const { error } = await supabase.from("page_views").insert({
        domain: domain,
        page: url || "unknown",
        referrer: referrer || null,
        city: city || "Unknown",
        country: country || "Unknown",
        region: region || "Unknown",
        browser_name: browser || "Unknown",
        device_type: device || "Unknown",
        operating_system: os || "Unknown",
      });

      if (error) throw error;
      return { success: true };
    });

    const count = await step.run("get-page-view-count", async () => {
      const { count } = await supabase
        .from("page_views")
        .select("*", { count: "exact", head: true })
        .eq("domain", domain);
      return count || 0;
    });

    if (count > 0 && count % 100 === 0) {
      await step.run("send-notifications", async () => {
        const { data: project } = await supabase
          .from("projects")
          .select("name")
          .eq("id", projectId)
          .single();

        await sendAlert({
          projectId: projectId,
          title: "Traffic Milestone!",
          message: `**${
            project?.name || domain
          }** just hit **${count}** views!`,
          color: 0x00ff00,
        });
      });
    }

    return { count };
  },
);
export const processServerMetrics = inngest.createFunction(
  { id: "process-server-metrics" },
  { event: "server/metrics-received" },
  async ({ event, step }) => {
    const {
      projectId,
      sourceId,
      serverName,
      cpuPercent,
      memoryPercent,
      diskPercent,
      uptime,
    } = event.data;

    await step.run("record-server-metrics", async () => {
      const { error } = await supabaseAdmin.from("server_metrics").insert({
        source_id: sourceId,
        server_name: serverName,
        cpu_percent: cpuPercent,
        memory_percent: memoryPercent,
        disk_percent: diskPercent,
        uptime: uptime,
      });

      if (error) throw error;
      return { success: true };
    });


    if (cpuPercent > 90) {
      await step.run("send-cpu-alert", async () => {
        // Fetch the friendly project name from the database
        const { data: project } = await supabase
          .from("projects")
          .select("name")
          .eq("id", projectId)
          .single();

        // Use your existing alert system to ping Discord/Telegram
        await sendAlert({
          projectId: projectId,
          title: "🚨 Critical Server Alert: High CPU!",
          message: `**${project?.name || "Your Project"}** - Server **${serverName}** is experiencing extremely high CPU load (**${cpuPercent}%**).`,
          color: 0xff0000, // Red hex code for danger
        });
      });
    }

    // You can add more alert conditions here later!
    // e.g., if (diskPercent > 95) { send disk full alert }
  },
);
export const connectserverViaSSH = inngest.createFunction(
  { id: "connnect-server-ssh" },
  { event: "server/install.started" },
  async ({ event, step }) => { 
    const { serverId } = event.data;
    const { server, privateKey } = await step.run(
      "fetch-credentials",
      async () => {
        const { data: serverInfo, error: serverError } = await supabase
          .from("servers")
          .select("host, username, server_code, vault_secret_id")
          .eq("id", serverId)
          .single();
        if (serverError || !serverInfo) throw new Error("Server not found");
        const { data: keyData, error: keyError } = await supabase.rpc(
          "get_decrypted_secret",
          { secret_id: serverInfo.vault_secret_id },
        );

        if (keyError || !keyData) throw new Error("Failed to decrypt SSH key");

        return { server: serverInfo, privateKey: keyData };
      },
    );
  const sshResult = await step.run("execute-ssh-install", async () => {
      const ssh = new NodeSSH();
      
      try {
        await ssh.connect({
          host: server.host,
          username: server.username, 
          privateKey: privateKey,
          readyTimeout: 20000, 
        });

      
        const installCommand = `sudo curl -sL "https://observo-xi.vercel.app//api/v1/install?token=${server.server_code}" | sudo bash`;
        
        const result = await ssh.execCommand(installCommand);
        
        ssh.dispose();

        if (result.code !== 0) {
          throw new Error(`SSH Command Failed: ${result.stderr}`);
        }

        return result.stdout;
      } catch (error: any) {
        ssh.dispose();

        throw new Error(`SSH Connection Failed: ${error.message}`);
      }
    });

   
    await step.run("update-db-status", async () => {
      await supabase
        .from("servers")
        .update({ setup_status: "success" })
        .eq("id", serverId);
    });

    return { message: "Installation complete", sshResult };
  }
);