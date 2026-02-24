import { QuizButton } from "@/components/quiz/QuizButton";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DietaryStepProps {
  value?: string[];
  onChange: (value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const options = [
  { id: "none", label: "No restrictions", icon: "🍽️" },
  { id: "vegetarian", label: "Vegetarian", icon: "🥗" },
  { id: "vegan", label: "Vegan", icon: "🌱" },
  { id: "gluten-free", label: "Gluten-free", icon: "🌾" },
  { id: "dairy-free", label: "Dairy-free", icon: "🥛" },
  { id: "keto", label: "Keto / Low-carb", icon: "🥑" },
];

export function DietaryStep({
  value = [],
  onChange,
  onNext,
  onBack,
}: DietaryStepProps) {
  const toggleOption = (id: string) => {
    if (id === "none") {
      onChange(["none"]);
      return;
    }

    const newValue = value.filter((v) => v !== "none");

    if (newValue.includes(id)) {
      onChange(newValue.filter((v) => v !== id));
    } else {
      onChange([...newValue, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
          Any dietary preferences?
        </h2>

        <p className="text-muted-foreground">
          Select all that apply to personalize your meal suggestions.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = value.includes(option.id);

          return (
            <Button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all h-auto relative text-foreground",
                {
                  "border-primary bg-accent hover:text-primary-foreground":
                    isSelected,
                  "border-border bg-card hover:border-primary/50": !isSelected,
                },
              )}
            >
              <span className="text-2xl">{option.icon}</span>

              <span className={cn("text-sm font-medium")}>{option.label}</span>

              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 gradient-hero rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </Button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <QuizButton variant="outline" onClick={onBack} className="px-4">
          <ArrowLeft className="w-5 h-5" />
        </QuizButton>

        <QuizButton size="lg" onClick={onNext} disabled={value.length === 0}>
          Continue
        </QuizButton>
      </div>
    </div>
  );
}
