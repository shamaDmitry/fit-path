import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface QuizOptionProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

export function QuizOption({
  label,
  description,
  icon,
  selected,
  onClick,
}: QuizOptionProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
        "hover:border-primary/50 hover:bg-accent/50",
        selected
          ? "border-primary bg-accent shadow-soft"
          : "border-border bg-card",
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center gap-4 flex-col md:flex-row">
        {icon && (
          <div
            className={cn(
              "size-12 shrink-0 rounded-lg flex items-center justify-center text-2xl",
              selected ? "bg-primary/10" : "bg-muted",
            )}
          >
            {icon}
          </div>
        )}

        <div className="flex-1 text-center md:text-left">
          <p
            className={cn(
              "font-semibold",
              selected ? "text-primary" : "text-foreground",
            )}
          >
            {label}
          </p>

          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>

        <div
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
            selected ? "bg-primary border-primary" : "border-border",
          )}
        >
          {selected && <Check className="w-4 h-4 text-primary-foreground" />}
        </div>
      </div>
    </motion.button>
  );
}
