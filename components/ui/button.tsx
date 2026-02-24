
import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-[#C5A059] text-black hover:bg-white shadow-[0_10px_30px_rgba(197,160,89,0.1)]",
      outline: "bg-transparent border border-white/10 text-white hover:bg-white/5",
      ghost: "bg-transparent text-neutral-500 hover:text-white"
    };
    
    const sizes = {
      sm: "px-4 py-2 text-[8px]",
      md: "px-8 py-4 text-[9px]",
      lg: "px-12 py-5 text-[10px]"
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-luxury uppercase tracking-[0.4em] transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
