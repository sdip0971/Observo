"use client";
import { supabase } from "@/config/supabase";
import useUser from "@/hooks/useUser";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock, Command, Activity, Zap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ensureProfile } from "@/lib/profile-trigger";



const GridPattern = () => (
  <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]">
    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-77.5 w-77.5 rounded-full bg-indigo-500 opacity-20 blur-[100px]" />
  </div>
);

const SystemStatus = () => (
  <div className="relative rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 backdrop-blur-md">
    <div className="flex items-center gap-3 border-b border-zinc-800 pb-3 mb-3">
      <div className="flex gap-1.5">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
      </div>
      <span className="text-[10px] font-mono text-zinc-500">SYSTEM_MONITOR_V2</span>
    </div>
    <div className="space-y-2 font-mono text-[10px] text-zinc-400">
      <div className="flex justify-between items-center">
        <span> UPTIME</span>
        <span className="text-green-400">99.99%</span>
      </div>
      <div className="flex justify-between items-center">
        <span> LATENCY</span>
        <span className="text-indigo-400">12ms</span>
      </div>
      <div className="flex justify-between items-center">
        <span> EVENTS</span>
        <span className="text-zinc-300">8,402/s</span>
      </div>
      <div className="h-1 w-full bg-zinc-800 rounded-full mt-2 overflow-hidden">
        <motion.div 
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-full bg-linear-to-r from-indigo-500 to-purple-500" 
        />
      </div>
    </div>
  </div>
);


export default function SignIn() {
  const router = useRouter();
  const { user, loading } = useUser();
  

  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  if (loading || !user) return;

  const run = async () => {
    await ensureProfile(user);
    router.replace("/dashboard");
  };

  run();
}, [user, loading, router]);


const handleEmailAuth = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  setError(null);

  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    }
  } catch (err: any) {
    setError(err.message ?? "Authentication failed");
  } finally {
    setSubmitting(false);
  }
};

const signInWithProvider = async (provider: "google" | "github") => {
  try {
    setSubmitting(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
       redirectTo:process.env.NEXT_PUBLIC_APP_URL 
      ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
      : `${window.location.origin}/dashboard`
      },
    });

    if (error) throw error;

  
  } catch (err) {
    console.error("OAuth sign-in error:", err);
    setError("An error occurred during sign in. Please try again.");
    setSubmitting(false);
  }
};



  if (loading || user) return null;

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center bg-zinc-950 text-zinc-100 overflow-hidden selection:bg-indigo-500/30">
      <GridPattern />

      <div className="w-full max-w-250 grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 shadow-2xl backdrop-blur-xl lg:min-h-150">
        <div className="relative hidden lg:flex flex-col justify-between bg-zinc-900/20 p-10 border-r border-zinc-800/50">
          <div className="z-10">
            <div className="flex items-center gap-2 text-indigo-400 mb-6">
              <Command className="h-6 w-6" />
              <span className="font-bold tracking-tight text-zinc-100">
                Observo
              </span>
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white mb-4">
              Detailed insights <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
                for complex systems.
              </span>
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-[320px]">
              Monitor execution flows, inspect live events, and debug
              distributed systems in real-time.
            </p>
          </div>

          <div className="z-10 mt-12 w-full max-w-70">
            <SystemStatus />
          </div>

          <div className="mt-8 flex items-center gap-4 text-[10px] text-zinc-500 font-mono">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> SOC2 Compliant
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" /> E2E Encryption
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center p-8 lg:p-12 relative">
          <div className="absolute top-8 right-8 lg:hidden">
            <Command className="h-6 w-6 text-indigo-500" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm mx-auto space-y-6"
            >
              <div className="space-y-1 text-center lg:text-left">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {mode === "signin" ? "Welcome back" : "Create an account"}
                </h2>
                <p className="text-sm text-zinc-400">
                  {mode === "signin"
                    ? "Enter your credentials to access your workspace."
                    : "Enter your details to get started with Observo."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  disabled={submitting}
                  onClick={() => signInWithProvider("github")}
                  variant="outline"
                  className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-100 transition-all"
                >
                  <Image
                    src="/github.svg"
                    alt="GitHub"
                    width={16}
                    height={16}
                    className="mr-2 opacity-70"
                  />
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  disabled={submitting}
                  onClick={() => signInWithProvider("google")}
                  className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-100 transition-all"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-950 px-2 text-zinc-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                    className="bg-zinc-950/50 border-zinc-800 focus-visible:ring-indigo-500/50 text-zinc-100 placeholder:text-zinc-600"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={submitting}
                    className="bg-zinc-950/50 border-zinc-800 focus-visible:ring-indigo-500/50 text-zinc-100 placeholder:text-zinc-600"
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-xs text-red-400 bg-red-950/20 p-2 rounded border border-red-900/50 flex items-center gap-2"
                  >
                    <Activity className="h-3 w-3" />
                    {error}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] transition-all hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.6)]"
                  disabled={submitting}
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <span className="flex items-center gap-2">
                      {mode === "signin" ? "Sign In" : "Create Account"}{" "}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="text-center text-sm">
                <span className="text-zinc-500">
                  {mode === "signin"
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                </span>
                <Button
                  onClick={() =>
                    setMode(mode === "signin" ? "signup" : "signin")
                  }
                  className="font-medium text-indigo-400 hover:text-indigo-300 underline-offset-4 hover:underline transition-colors"
                >
                  {mode === "signin" ? "Sign up" : "Log in"}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}