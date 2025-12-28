import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ server-only
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { write_key, type, payload } = body;

    if (!write_key || !type) {
      return NextResponse.json(
        { error: "Missing write_key or type" },
        { status: 400 }
      );
    }

    // 1️⃣ Validate source
    const { data: source, error: sourceError } = await supabase
      .from("sources")
      .select("id")
      .eq("write_key", write_key)
      .single();

    if (sourceError || !source) {
      return NextResponse.json({ error: "Invalid write key" }, { status: 401 });
    }

    // 2️⃣ Insert event
    const { error: insertError } = await supabase.from("events").insert({
      source_id: source.id,
      type,
      payload: payload ?? {},
    });

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Event ingestion error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
