"use client";

import { useState } from "react";
import { Gauge, Zap, Search, Shield, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkPerformance } from "@/action/actions";
import { Source } from "@/types";

// Helper for the circular score
function ScoreCircle({ score, label, icon: Icon, color }: any) {
  const circumference = 2 * Math.PI * 30; // Radius 30
  const offset = circumference - ((score || 0) / 100) * circumference;

  // Color logic
  let scoreColor = "text-red-500";
  if (score >= 50) scoreColor = "text-yellow-500";
  if (score >= 90) scoreColor = "text-emerald-500";
  if (!score) scoreColor = "text-zinc-700";

  return (
    <div className="flex flex-col items-center gap-2 ">
      <div className="relative h-20 w-20 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-zinc-800"
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ${scoreColor}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-xl font-bold ${scoreColor}`}>
            {score ?? "-"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
    </div>
  );
}

export function PerformanceWidget({ source }: { source: Source }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(source);

  const handleRunTest = async () => {
    if (!source.domain) return alert("Please set a domain in settings first.");

    setLoading(true);
    const result = await checkPerformance(source.id, source.domain);

    if (result.success && result.data) {
      setData({ ...source, ...result.data });
    } else {
      alert("Test failed: " + result.error);
    }
    setLoading(false);
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-zinc-100 flex items-center gap-2">
          <Gauge className="h-4 w-4 text-orange-400" />
          Web Vitals (Mobile)
        </CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={handleRunTest}
          disabled={loading}
          className="h-8 border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin mr-2" />
          ) : (
            <Play className="h-3 w-3 mr-2" />
          )}
          {loading ? "Testing..." : "Run Test"}
        </Button>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
          <ScoreCircle
            score={data.performance_score}
            label="Performance"
            icon={Zap}
          />
          <ScoreCircle
            score={data.accessibility_score}
            label="Accessibility"
            icon={Gauge}
          />
          <ScoreCircle
            score={data.best_practices_score}
            label="Best Practices"
            icon={Shield}
          />
          <ScoreCircle score={data.seo_score} label="SEO" icon={Search} />
        </div>

        {data.last_performance_check && (
          <p className="text-xs text-center text-zinc-600 mt-2">
            Last checked:{" "}
            {new Date(data.last_performance_check).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
