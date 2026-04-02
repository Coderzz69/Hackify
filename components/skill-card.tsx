import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SkillCard({
  name,
  score,
  trend,
  lastVerified
}: {
  name: string;
  score: number;
  trend: "rising" | "stable" | "declining";
  lastVerified: string;
}) {
  const trendLabel =
    trend === "rising" ? "^" : trend === "declining" ? "v" : "-";

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold">{name}</h4>
        <Badge className="border-primary/40 bg-primary/10 text-primary">
          {trendLabel} {trend}
        </Badge>
      </div>
      <div className="text-3xl font-semibold">{Math.round(score)}</div>
      <p className="text-xs text-white/60">
        Last verified {new Date(lastVerified).toLocaleDateString()}
      </p>
    </Card>
  );
}
