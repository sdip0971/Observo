import Link from "next/link";
import { 
  ArrowRight, 
  Activity, 
  Radar, 
  Layers, 
  Terminal, 
  Cpu, 
  Network, 
  Zap,
  Command,
  Github 
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Visual Components ---

const GridPattern = () => (
  <div className="absolute inset-0 -z-10 h-full w-full bg-zinc-950 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]">
    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-77.5 w-77.5 rounded-full bg-indigo-500 opacity-20 blur-[100px]" />
  </div>
);

const MockTerminalWindow = () => (
  <div className="relative w-full max-w-150 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/80 shadow-2xl backdrop-blur-sm">
    <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/50 px-4 py-3">
      <div className="flex gap-1.5">
        <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
        <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/50" />
      </div>
      <div className="ml-2 flex items-center gap-2 rounded-md bg-zinc-950 px-2 py-0.5 text-[10px] text-zinc-400 font-mono border border-zinc-800">
        <Terminal className="h-3 w-3" />
        obs_daemon --watch
      </div>
    </div>
    
    <div className="p-4 space-y-2 font-mono text-xs">
      <div className="flex gap-2 text-zinc-500">
        <span className="select-none">09:24:01</span>
        <span className="text-indigo-400 font-bold">INFO</span>
        <span>Initializing observer agent v2.4...</span>
      </div>
      <div className="flex gap-2 text-zinc-500">
        <span className="select-none">09:24:02</span>
        <span className="text-green-400 font-bold">SUCCESS</span>
        <span>Connected to main cluster (us-east-1)</span>
      </div>
      <div className="flex gap-2 text-zinc-500">
        <span className="select-none">09:24:03</span>
        <span className="text-indigo-400 font-bold">INFO</span>
        <span>Monitoring 14 active flows...</span>
      </div>
      <div className="flex gap-2 text-zinc-500 pl-4 border-l border-zinc-800 ml-1">
         <span className="text-zinc-600">└─</span>
         <span className="text-zinc-300">Packet #8492 captured</span>
         <span className="text-zinc-600 text-[10px] ml-auto">12ms</span>
      </div>
       <div className="mt-2 text-indigo-500 animate-pulse">_</div>
    </div>
  </div>
);

// --- Main Page Component ---

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30">
      
      <GridPattern />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400">
                <Command className="h-5 w-5" />
                <span className="font-bold text-zinc-100 text-sm tracking-tight">Observo</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
                <Link href="/login" className="text-zinc-400 hover:text-white transition-colors">Log in</Link>
                <Link href="/login" className="bg-zinc-100 text-zinc-900 px-3 py-1.5 rounded-md font-medium hover:bg-zinc-200 transition-colors">Sign up</Link>
            </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-32 pb-20">
        
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs font-medium text-zinc-400 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          System Workspace v2.0 Live
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left: Copy */}
          <div className="space-y-8 max-w-2xl">
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              System behavior, <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-indigo-400">
                observed live.
              </span>
            </h1>

            <p className="text-lg text-zinc-400 leading-relaxed">
              Observo allows you to inspect events, flows, and signals as they happen. 
              Stop guessing with static dashboards—start seeing the <span className="text-zinc-200 font-medium">real execution path</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] transition-all hover:shadow-[0_0_25px_-5px_rgba(79,70,229,0.6)] text-base">
                  Enter Workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

            
              <Link href="https://github.com" target="_blank" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-12 px-8 border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </Link>
            </div>
            
            
            <div className="pt-8 border-t border-zinc-800/50">
                <p className="text-1xl text-zinc-500 mb-4 font-mono uppercase tracking-wider">Seamless integration with your Application</p>
                {/* <div className="flex flex-wrap gap-2">
                    {['Node.js', 'Python', 'Docker', 'Kubernetes', 'PostgreSQL'].map((tech) => (
                      <span key={tech} className="inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900/50 px-2 py-1 text-xs font-medium text-zinc-400 ring-1 ring-inset ring-zinc-500/10">
                        {tech}
                      </span>
                    ))}
                </div> */}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative mx-auto w-full lg:max-w-none flex justify-center lg:justify-end">
            <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-indigo-500 to-purple-600 opacity-20 blur-3xl" />
            <MockTerminalWindow />
            
            <div className="absolute -right-4 -bottom-6 hidden xl:block animate-bounce animation-duration-[3s]">
                 <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/90 p-3 backdrop-blur shadow-xl">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-400">
                        <Zap className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-white">Real-time</div>
                        <div className="text-xs text-zinc-400">Sub-ms latency</div>
                    </div>
                 </div>
            </div>
          </div>
        </div>

  
        <div id="features" className="mt-32 border-t border-zinc-900 pt-20">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-semibold text-white tracking-tight">Full-stack visibility</h2>
            <p className="mt-4 text-zinc-400 text-lg">Everything you need to debug distributed systems without the headache of configuration.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Capability
              icon={<Activity />}
              title="Live Signals"
              desc="Events, errors, and state transitions streamed directly to your workspace in real time."
            />
            <Capability
              icon={<Radar />}
              title="Focused Inspection"
              desc="Drill into individual flows with surgical precision without the noise of global dashboards."
            />
            <Capability
              icon={<Layers />}
              title="Structured Views"
              desc="Automatically map dependencies, execution paths, and outcomes for every request."
            />
            <Capability
              icon={<Cpu />}
              title="Resource Monitor"
              desc="Track CPU and memory usage across your microservices with granular breakdown."
            />
             <Capability
              icon={<Network />}
              title="Network Topology"
              desc="Visualize how your services communicate and identify bottlenecks instantly."
            />
             <Capability
              icon={<Terminal />}
              title="CLI Integration"
              desc="Pipe logs directly from your terminal into Observo with a single command."
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function Capability({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/20 p-6 hover:bg-zinc-900/40 transition-all hover:border-zinc-700">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800/50 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 transition-colors">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
      <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );
}