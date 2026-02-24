import { QuizOption } from "@/components/quiz/QuizOption";
import { QuizButton } from "@/components/quiz/QuizButton";
import { ArrowLeft } from "lucide-react";
import { WarningBanner } from "@/components/quiz/WarningBanner";
import type { GoalPace, QuizData } from "@/types/quiz";

interface PaceStepProps {
  value?: GoalPace;
  quizData: QuizData;
  onChange: (value: GoalPace) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PaceStep({
  value,
  quizData,
  onChange,
  onNext,
  onBack,
}: PaceStepProps) {
  const getWeeklyLoss = (pace: GoalPace) => {
    const rates = { slow: 0.5, moderate: 1, aggressive: 1.5 };

    const rate =
      quizData.weightUnit === "kg" ? rates[pace] * 0.45 : rates[pace];

    return Math.round(rate * 10) / 10;
  };

  const options = [
    {
      value: "slow" as GoalPace,
      label: "Slow & Steady",
      description: `~${getWeeklyLoss("slow")} ${quizData.weightUnit}/week — Most sustainable`,
      icon: "🐢",
    },
    {
      value: "moderate" as GoalPace,
      label: "Moderate",
      description: `~${getWeeklyLoss("moderate")} ${quizData.weightUnit}/week — Balanced approach`,
      icon: "🎯",
    },
    {
      value: "aggressive" as GoalPace,
      label: "Aggressive",
      description: `~${getWeeklyLoss("aggressive")} ${quizData.weightUnit}/week — Requires dedication`,
      icon: "🚀",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
          How fast do you want to lose weight?
        </h2>
        <p className="text-muted-foreground">
          Slower progress is often more sustainable long-term.
        </p>
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <QuizOption
            key={option.value}
            label={option.label}
            description={option.description}
            icon={option.icon}
            selected={value === option.value}
            onClick={() => onChange(option.value)}
          />
        ))}
      </div>

      {value === "aggressive" && (
        <WarningBanner
          type="warning"
          messages={[
            "Aggressive weight loss requires significant lifestyle changes and may be harder to maintain.",
            "Consider consulting with a healthcare provider before starting.",
          ]}
        />
      )}

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
