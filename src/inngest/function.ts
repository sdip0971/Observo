import { sendAlert } from "@/lib/alert";
import { inngest } from "./client";
import { supabase } from "@/config/supabase";

export const checkTrafficMilestone = inngest.createFunction(
  { id: "check-traffic-milestone" },
  { event: "analytics/page-viewed" }, // 👈 Trigger: When a page is viewed
  async ({ event, step }) => {
    const { domain, project_id } = event.data;

    // Step 1: Check Database Count (Retriable logic)
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
          .eq("id", project_id)
          .single();

        await sendAlert({
          projectId: project_id,
          title: "🚀 Traffic Milestone!",
          message: `**${
            project?.name || domain
          }** just hit **${count}** views!`,
          color: 0x00ff00,
        });
      });

      return { milestone: true, count };
    }

    return { milestone: false, count };
  }
);
