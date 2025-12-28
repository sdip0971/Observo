"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone } from "lucide-react";

interface DeviceData {
  device: string;
  count: number;
}

export function TopDevicesList({ sourceId }: { sourceId: string }) {
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { data, error } = await supabase.rpc("get_top_devices", {
        source_id_input: sourceId,
        start_time: yesterday.toISOString(),
      });

      if (!error && data) {
        setDevices(data);
      }
      setLoading(false);
    };

    fetchData();
  }, [sourceId]);

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-100 flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-purple-400" />
          Devices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="text-xs text-zinc-500">Loading...</div>
          ) : devices.length === 0 ? (
            <div className="text-xs text-zinc-500">No device data.</div>
          ) : (
            devices.map((item) => (
              <div
                key={item.device}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-zinc-300">{item.device}</span>
                <span className="font-mono text-zinc-500">{item.count}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
