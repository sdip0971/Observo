import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { processPageView } from "@/inngest/function";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processPageView // 👈 Register your function here
  ],
});
