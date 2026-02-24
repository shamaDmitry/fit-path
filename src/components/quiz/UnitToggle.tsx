import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface UnitToggleProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function UnitToggle<T extends string>({
  options,
  value,
  onChange,
}: UnitToggleProps<T>) {
  return (
    <div className="inline-flex bg-muted rounded-lg p-1">
      {options.map((option) => (
        <Button
          variant={"ghost"}
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "relative px-4 py-2 text-sm font-medium rounded-md transition-colors",
            value === option.value
              ? "text-primary-foreground hover:text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {value === option.value && (
            <motion.div
              layoutId="unit-toggle"
              className="absolute inset-0 gradient-hero rounded-md"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10">{option.label}</span>
        </Button>
      ))}
    </div>
  );
}
