import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Observo",
  description: "Internal workspace for real-time inspection and analysis.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 
   
  return (
    <html lang="en">
      <body
        className={[
          inter.className,
          "min-h-screen",
          "bg-neutral-950",
          "text-neutral-100",
          "antialiased",
        ].join(" ")}
      >
        {/* App Root */}
        <div id="app-root" className="relative md:pr-8 overflow-y-auto min-h-screen w-screen overflow-hidden">
          {children}
        </div>

        {/* Global UI utilities */}
        <Toaster />
      </body>
    </html>
  );
}
