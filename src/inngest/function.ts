import { sendAlert } from "@/lib/alert";
import { inngest } from "./client";
import { supabase } from "@/config/supabase";

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
  }
);
