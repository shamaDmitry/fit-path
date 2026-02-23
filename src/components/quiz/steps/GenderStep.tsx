import { QuizButton } from "@/components/quiz/QuizButton";
import { ArrowLeft } from "lucide-react";
import type { Gender } from "@/types/quiz";
import { QuizOption } from "@/components/quiz/QuizOption";

interface GenderStepProps {
  value?: Gender;
  onChange: (value: Gender) => void;
  onNext: () => void;
  onBack: () => void;
}

export function GenderStep({
  value,
  onChange,
  onNext,
  onBack,
}: GenderStepProps) {
  const options = [
    { value: "female" as Gender, label: "Female", icon: "👩" },
    { value: "male" as Gender, label: "Male", icon: "👨" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
          What's your gender?
        </h2>
        <p className="text-muted-foreground">
          This helps us calculate your baseline metabolism.
        </p>
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <QuizOption
            key={option.value}
            label={option.label}
            icon={option.icon}
            selected={value === option.value}
            onClick={() => onChange(option.value)}
          />
        ))}
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
