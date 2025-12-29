import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { z } from "zod";



function corsHeaders(req: NextRequest) {
  // If origin is null (e.g. from a local file), allow it by returning "null"
  // Otherwise reflect the request origin
  const origin = req.headers.get("origin") || "*";

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true", // Required for sendBeacon
  };
}

// 1. Define the Validation Schema
const ingestionSchema = z.object({
  // write_key can be in body, but we primarily look in headers.
  // We validate it exists later in logic, but if passed in body, it must be string.
  write_key: z.string().optional(),

  // Event Type: e.g. "page_view", "click", "error"
  // Enforce length to prevent spamming huge type names
  type: z
    .string()
    .min(1, "Event type is required")
    .max(50, "Event type too long"),

  // Payload: Must be a JSON object. We default to empty object if missing.
  payload: z.record(z.any(),z.any()).optional().default({}),
});

// Init Supabase Admin (Service Role)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    
  try {

    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 200, headers: corsHeaders(req) });
    }
    const bodyRaw = await req.json();
    const headersList = await headers();

    // 2. VALIDATE INPUT (The step we were missing)
    const validation = ingestionSchema.safeParse(bodyRaw);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation Error", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { type, payload, write_key: bodyKey } = validation.data;

    // 3. Extract Write Key (Header takes priority -> then Body)
    const writeKey =
      headersList.get("authorization")?.replace("Bearer ", "") || bodyKey;

    if (!writeKey) {
      return NextResponse.json({ error: "Missing write_key" }, { status: 401 });
    }

    // 4. Verify Source exists
    const { data: source, error: sourceError } = await supabaseAdmin
      .from("sources")
      .select("id")
      .eq("write_key", writeKey)
      .single();

    if (sourceError || !source) {
      return NextResponse.json(
        { error: "Invalid write_key" },
        { status: 403, headers: corsHeaders(req) }
      );
    }

    // 5. Insert Validated Data
    const { error: insertError } = await supabaseAdmin.from("events").insert({
      source_id: source.id,
      type: type,
      payload: {
        ...payload, 
        // Enriched Metadata
        request_ip: headersList.get("x-forwarded-for") || "unknown",
        user_agent: headersList.get("user-agent"),
        received_at: new Date().toISOString(),
      },
    });

    if (insertError) throw insertError;

    return NextResponse.json({ success: true }, { status: 202,headers:corsHeaders(req) });
  } catch (error) {
    console.error("Ingestion Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders(req) }
    );
  }
}

export async function OPTIONS(req:NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers:corsHeaders(req)
  });
}
