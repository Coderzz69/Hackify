"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ChallengeClient({
  task
}: {
  task: {
    id: string;
    title: string;
    description: string;
    targetSkill: string;
  };
}) {
  const [code, setCode] = useState("// Paste your solution here\n");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, taskId: task.id })
      });
      if (!res.ok) {
        setResult({ error: "Evaluation failed. Try again." });
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Evaluation failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <h2 className="text-xl font-semibold">{task.title}</h2>
        <p className="text-sm text-white/70">{task.description}</p>
        <p className="text-xs uppercase text-accent">Target Skill: {task.targetSkill}</p>
      </Card>

      <div className="rounded-2xl border border-white/10 bg-white/5">
        <Editor
          height="420px"
          defaultLanguage="typescript"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "var(--font-jetbrains)"
          }}
        />
      </div>

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Evaluating..." : "Submit for Evaluation"}
      </Button>

      {result?.evaluation && (
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Score</h3>
            <span className="text-2xl font-semibold text-accent">
              {Math.round(result.evaluation.score)}
            </span>
          </div>
          <div className="grid gap-2 text-sm text-white/70">
            <p>Correctness: {result.evaluation.breakdown.correctness}</p>
            <p>Efficiency: {result.evaluation.breakdown.efficiency}</p>
            <p>Readability: {result.evaluation.breakdown.readability}</p>
            <p>Best Practices: {result.evaluation.breakdown.bestPractices}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            {result.evaluation.feedback}
          </div>
        </Card>
      )}

      {result?.error && (
        <p className="text-sm text-red-400">{result.error}</p>
      )}
    </div>
  );
}
