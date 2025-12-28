import { supabase } from "@/config/supabase";

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout error:", error);
  }
}
