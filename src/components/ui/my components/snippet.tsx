"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SnippetProps {
  writeKey: string;
}

export function Snippet({ writeKey }: SnippetProps) {
  const [copied, setCopied] = useState(false);

  const snippetCode = `<script 
  defer 
  data-write-key="${writeKey}" 
  data-endpoint="${window.location.origin}/api/v1/ingest" 
  src="${window.location.origin}/tracking-script.js"
></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-100">
          <Terminal className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-medium">Integration Snippet</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="h-7 text-xs border-zinc-800 text-zinc-400 hover:text-zinc-100 bg-transparent hover:bg-zinc-900"
        >
          {copied ? (
            <Check className="h-3 w-3 mr-1.5 text-emerald-400" />
          ) : (
            <Copy className="h-3 w-3 mr-1.5" />
          )}
          {copied ? "Copied" : "Copy Code"}
        </Button>
      </div>

      <div className="relative group">
        <pre className="overflow-x-auto rounded-lg border border-zinc-800 bg-black/50 p-4">
          <code className="text-xs font-mono text-zinc-400 whitespace-pre-wrap break-all">
            {snippetCode}
          </code>
        </pre>
      </div>

      <p className="text-xs text-zinc-500">
        Paste this into the{" "}
        <code className="bg-zinc-900 px-1 rounded text-zinc-400">
          &lt;head&gt;
        </code>{" "}
        of your website.
      </p>
    </div>
  );
}
