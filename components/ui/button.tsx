import * as React from "react";
import { cn } from "@/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

const styles: Record<string, string> = {
  primary:
    "bg-primary text-white hover:bg-primary/90 shadow-glow border border-primary/40",
  secondary:
    "bg-white/10 text-white hover:bg-white/20 border border-white/10",
  ghost: "bg-transparent text-white hover:bg-white/10 border border-white/10"
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition",
          styles[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
