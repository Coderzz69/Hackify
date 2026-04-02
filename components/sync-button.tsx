"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SyncButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/github/sync");
      if (!res.ok) {
        setMessage("Sync failed. Try again.");
        return;
      }
      const data = await res.json();
      setMessage(data.cached ? "Using cached GitHub data" : "GitHub data synced");
    } catch (error) {
      setMessage("Sync failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button onClick={handleSync} disabled={loading}>
        {loading ? "Syncing..." : "Sync GitHub"}
      </Button>
      {message && <span className="text-xs text-white/60">{message}</span>}
    </div>
  );
}
