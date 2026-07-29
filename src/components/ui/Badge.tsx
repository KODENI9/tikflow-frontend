import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "warning" | "error" | "neutral" | "primary";
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "neutral", children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider";
    
    const variants = {
      success: "bg-tikflow-accent/10 text-tikflow-accent",
      warning: "bg-tikflow-warning/10 text-tikflow-warning",
      error: "bg-tikflow-danger/10 text-tikflow-danger",
      neutral: "bg-tikflow-gray-light/50 text-tikflow-gray-dark",
      primary: "bg-tikflow-primary/10 text-tikflow-primary-dark",
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Badge.displayName = "Badge";
