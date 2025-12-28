"use server";

import { supabase } from "@/config/supabase";

export async function checkPerformance(sourceId: string, url: string) {
  try {
    const API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY;
    if (!API_KEY) throw new Error("Missing Google API Key");

    // Ensure URL has protocol
    const targetUrl = url.startsWith("http") ? url : `https://${url}`;
    const encodedUrl = encodeURIComponent(targetUrl);

    // We request all categories: Performance, Accessibility, Best Practices, SEO
    const apiUrl = `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodedUrl}&key=${API_KEY}&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo`;

    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`Google API Error: ${res.statusText}`);

    const data = await res.json();
    const lighthouse = data.lighthouseResult;

    if (!lighthouse) throw new Error("No data returned from Google");

    // Extract Scores (0-100)
    const updates = {
      performance_score: Math.round(
        lighthouse.categories.performance.score * 100
      ),
      accessibility_score: Math.round(
        lighthouse.categories.accessibility.score * 100
      ),
      best_practices_score: Math.round(
        lighthouse.categories["best-practices"].score * 100
      ),
      seo_score: Math.round(lighthouse.categories.seo.score * 100),

      // Core Web Vitals
      first_contentful_paint: Math.round(
        lighthouse.audits["first-contentful-paint"].numericValue
      ),
      largest_contentful_paint: Math.round(
        lighthouse.audits["largest-contentful-paint"].numericValue
      ),
      total_blocking_time: Math.round(
        lighthouse.audits["total-blocking-time"].numericValue
      ),
      cumulative_layout_shift:
        lighthouse.audits["cumulative-layout-shift"].numericValue,
      speed_index: Math.round(lighthouse.audits["speed-index"].numericValue),

      last_performance_check: new Date().toISOString(),
    };

    // Save to Database
    const { error } = await supabase
      .from("sources")
      .update(updates)
      .eq("id", sourceId);

    if (error) throw error;

    return { success: true, data: updates };
  } catch (error: any) {
    console.error("Performance Check Failed:", error);
    return { success: false, error: error.message };
  }
}
