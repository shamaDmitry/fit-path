import { QuizOption } from "../QuizOption";
import { QuizButton } from "../QuizButton";
import { ArrowLeft } from "lucide-react";
import type { ActivityLevel } from "@/types/quiz";

interface ActivityStepProps {
  value?: ActivityLevel;
  onChange: (value: ActivityLevel) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ActivityStep({
  value,
  onChange,
  onNext,
  onBack,
}: ActivityStepProps) {
  const options = [
    {
      value: "sedentary" as ActivityLevel,
      label: "Sedentary",
      description: "Little or no exercise, desk job",
      icon: "🪑",
    },
    {
      value: "light" as ActivityLevel,
      label: "Lightly Active",
      description: "Light exercise 1-3 days/week",
      icon: "🚶",
    },
    {
      value: "moderate" as ActivityLevel,
      label: "Moderately Active",
      description: "Moderate exercise 3-5 days/week",
      icon: "🏃",
    },
    {
      value: "active" as ActivityLevel,
      label: "Very Active",
      description: "Hard exercise 6-7 days/week",
      icon: "💪",
    },
    {
      value: "very_active" as ActivityLevel,
      label: "Athlete",
      description: "Professional/competitive athlete",
      icon: "🏆",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
          What's your activity level?
        </h2>
        <p className="text-muted-foreground">
          This helps us tailor your calorie recommendations.
        </p>
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          return (
            <QuizOption
              key={option.value}
              label={option.label}
              description={option.description}
              icon={option.icon}
              selected={value === option.value}
              onClick={() => onChange(option.value)}
            />
          );
        })}
      </div>

      <div className="flex gap-3">
        <QuizButton variant="outline" onClick={onBack} className="px-4">
          <ArrowLeft className="w-5 h-5" />
        </QuizButton>

        <QuizButton size="lg" onClick={onNext} disabled={!value}>
          Continue
        </QuizButton>
      </div>
    </div>
  );
}
