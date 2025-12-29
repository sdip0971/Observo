import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { checkTrafficMilestone } from "@/inngest/function";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    checkTrafficMilestone, // 👈 Register your function here
  ],
});
