"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Result = {
  id: string;
  username: string | null;
  publicSlug: string;
  avatarUrl: string | null;
  contactEmail: string | null;
  overallScore: number;
  skills: any;
};

export function RecruiterSearch({
  subscribed,
  initialSaved
}: {
  subscribed: boolean;
  initialSaved: string[];
}) {
  const [skill, setSkill] = useState("TypeScript");
  const [minScore, setMinScore] = useState("80");
  const [results, setResults] = useState<Result[]>([]);
  const [saved, setSaved] = useState<string[]>(initialSaved);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/recruiter/search?skill=${encodeURIComponent(skill)}&minScore=${minScore}`
    );
    if (!res.ok) {
      setResults([]);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setResults(data.results || []);
    setLoading(false);
  };

  const toggleSave = async (developerId: string) => {
    await fetch("/api/recruiter/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ developerId })
    });
    setSaved((prev) =>
      prev.includes(developerId)
        ? prev.filter((id) => id !== developerId)
        : [...prev, developerId]
    );
  };

  const handleCheckout = async () => {
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <h2 className="text-lg font-semibold">Search developers</h2>
        <div className="grid gap-3 md:grid-cols-[1fr_120px_auto]">
          <Input
            placeholder="Skill (e.g. TypeScript)"
            value={skill}
            onChange={(event) => setSkill(event.target.value)}
          />
          <Input
            placeholder="Min score"
            value={minScore}
            onChange={(event) => setMinScore(event.target.value)}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
        {!subscribed && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/60">
            Unlock contact info and full profiles with the $29/month plan.
            <div className="mt-2">
              <Button onClick={handleCheckout}>Upgrade</Button>
            </div>
          </div>
        )}
      </Card>

      <div className="grid gap-4">
        {results.map((result) => (
          <Card key={result.id} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">
                  {result.username || result.publicSlug}
                </p>
                <p className="text-xs text-white/60">
                  Hackify Score: {Math.round(result.overallScore)}
                </p>
              </div>
              <Button variant="secondary" onClick={() => toggleSave(result.id)}>
                {saved.includes(result.id) ? "Saved" : "Save"}
              </Button>
            </div>
            <div className="text-xs text-white/60">
              {subscribed
                ? `Profile: /profile/${result.publicSlug} | Contact: ${result.contactEmail || "hidden"}`
                : "Upgrade to view full profile and contact info."}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
