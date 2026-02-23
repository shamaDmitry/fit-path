import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface QuizInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  suffix?: string;
}

const QuizInput = forwardRef<HTMLInputElement, QuizInputProps>(
  ({ className, label, error, suffix, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              "w-full px-4 py-3 text-lg rounded-xl border-2 bg-card transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "placeholder:text-muted-foreground",
              error ? "border-destructive" : "border-border",
              suffix && "pr-16",
              className,
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>
    );
  },
);

QuizInput.displayName = "QuizInput";

export { QuizInput };
