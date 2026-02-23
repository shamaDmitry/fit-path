import { useState, useMemo } from "react";
import { QuizInput } from "@/components/quiz/QuizInput";
import { QuizButton } from "@/components/quiz/QuizButton";
import { ArrowLeft } from "lucide-react";
import type { QuizData } from "@/types/quiz";
import { validateHealthGoals } from "@/lib/health-calculator";
import { WarningBanner } from "@/components/quiz/WarningBanner";

interface GoalWeightStepProps {
  quizData: QuizData;
  onGoalChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function GoalWeightStep({
  quizData,
  onGoalChange,
  onNext,
  onBack,
}: GoalWeightStepProps) {
  const [inputValue, setInputValue] = useState(
    quizData.goalWeight?.toString() || "",
  );
  const [error, setError] = useState("");

  const validation = useMemo(() => {
    return validateHealthGoals({
      ...quizData,
      goalWeight: parseFloat(inputValue) || undefined,
    });
  }, [quizData, inputValue]);

  const handleChange = (val: string) => {
    setInputValue(val);
    const num = parseFloat(val);

    if (val && isNaN(num)) {
      setError("Please enter a valid number");
    } else {
      setError("");
      if (num) onGoalChange(num);
    }
  };

  const isValid = inputValue && !error && validation.isValid;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
          What's your goal weight?
        </h2>
        <p className="text-muted-foreground">
          Set a realistic target we can work towards together.
        </p>
      </div>

      <QuizInput
        type="number"
        placeholder={`Enter your goal weight`}
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        suffix={quizData.weightUnit}
        error={error}
      />

      {quizData.currentWeight && inputValue && (
        <div className="bg-muted/50 rounded-xl p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Your healthy weight range
          </p>
          <p className="text-lg font-semibold text-foreground">
            {validation.minHealthyWeight} - {validation.maxHealthyWeight}{" "}
            {quizData.weightUnit}
          </p>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <WarningBanner
          type={validation.isValid ? "warning" : "error"}
          messages={validation.warnings}
        />
      )}

      {validation.suggestions.length > 0 && validation.isValid && (
        <WarningBanner type="success" messages={validation.suggestions} />
      )}

      <div className="flex gap-3">
        <QuizButton variant="outline" onClick={onBack} className="px-4">
          <ArrowLeft className="w-5 h-5" />
        </QuizButton>
        <QuizButton size="lg" onClick={onNext} disabled={!isValid}>
          Continue
        </QuizButton>
      </div>
    </div>
  );
}
