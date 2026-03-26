import { supabase } from "@/config/supabase";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json()
    const { name, host, project_id, reduplication_key } = body
    if (!host || !project_id || !reduplication_key) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    const { data: server, error } = await supabase
      .from("servers")
      .insert({
        name: name || host,
        host: host,
        project_id: project_id,
        reduplication_key: reduplication_key,
        connection_type: "agent", 
        setup_status: "pending",
      })
      .select("id, server_code") 
      .single();

      if(error){
        if (error.code === '23505'){
            if (
              error.message.includes("project_id") &&
              error.message.includes("host")
            ) {
              return NextResponse.json(
                {
                  error: "This server IP is already connected to this project.",
                },
                { status: 409 },
              );
            }
            if (error.message.includes('reduplication_key')) { 
              const { data: existingServer } = await supabase
                .from("servers")
                .select("id, server_code")
                .eq("reduplication_key", reduplication_key)
                .single();
               return NextResponse.json({ server: existingServer }, { status: 200 });
        }
            }

            console.error("Database Insert Error:", error);
            return NextResponse.json(
              { error: "Failed to add server" },
              { status: 500 },
            );

        }
        return NextResponse.json({ server }, { status: 201 });

      }


catch(err){
    console.error("API Route Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
}
}