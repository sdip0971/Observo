import { supabase } from "@/config/supabase";

export async function ensureProfile(user: {
  id: string;
  email?: string | null;
}) {
  if (!user?.id) return;

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();


  if (existing) return;

  // Create profile
  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    email: user.email,
  });

  if (error) {
    console.error("Failed to create profile:", error);
    throw error;
  }
}
