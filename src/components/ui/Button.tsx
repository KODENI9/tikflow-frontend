import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl";
    
    const variants = {
      primary: "bg-tikflow-secondary text-tikflow-black shadow-sm hover:bg-tikflow-secondary-light",
      secondary: "bg-tikflow-primary text-tikflow-black shadow-sm hover:bg-tikflow-primary-dark",
      outline: "border border-tikflow-gray-light bg-transparent text-tikflow-black hover:bg-tikflow-gray-light/50",
      ghost: "bg-transparent text-tikflow-black hover:bg-tikflow-primary/20",
    };
    
    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-[15px]",
      lg: "h-14 px-8 text-lg",
      icon: "size-10",
    };

    return (
      <motion.button
        whileHover={{ scale: props.disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: props.disabled || isLoading ? 1 : 0.98 }}
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
