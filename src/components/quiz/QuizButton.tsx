import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, MouseEventHandler } from "react";

interface QuizButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "default" | "lg";
}

export function QuizButton({
  className,
  variant = "primary",
  size = "default",
  children,
  disabled,
  ...props
}: QuizButtonProps) {
  const baseStyles =
    "cursor-pointer inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "gradient-hero text-primary-foreground shadow-soft hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline:
      "border-2 border-border bg-transparent text-foreground hover:bg-accent",
  };

  const sizes = {
    default: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg w-full",
  };

  return (
    <motion.button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      onClick={props.onClick as MouseEventHandler<HTMLButtonElement>}
      type={props.type}
    >
      {children}
    </motion.button>
  );
}
