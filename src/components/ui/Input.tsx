import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-tikflow-gray-medium">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full h-12 rounded-xl border border-tikflow-gray-light bg-white dark:bg-background px-4 text-[15px] font-medium text-tikflow-accent transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-tikflow-gray-medium focus:border-tikflow-secondary focus:outline-none focus:ring-4 focus:ring-tikflow-secondary/10",
            icon && "pl-11",
            error && "border-tikflow-danger focus:border-tikflow-danger focus:ring-tikflow-danger/10",
            className
          )}
          {...props}
        />
        {error && (
          <span className="mt-1.5 inline-block text-[13px] font-semibold text-tikflow-danger">
            {error}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
