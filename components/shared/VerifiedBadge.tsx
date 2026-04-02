import { Check } from "lucide-react";
import { cn } from "@/utils/cn"; // Will adjust if this is placed somewhere else

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-accent/30 text-accent text-xs font-semibold shadow-[0_0_15px_rgba(0,245,160,0.15)]",
        className
      )}
    >
      <Check size={14} className="text-accent" />
      <span>Verified by Hackify</span>
    </div>
  );
}
