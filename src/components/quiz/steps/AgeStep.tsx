import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { QuizButton } from "@/components/quiz/QuizButton";
import { QuizInput } from "@/components/quiz/QuizInput";

interface AgeStepProps {
  value?: number;
  onChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AgeStep({ value, onChange, onNext, onBack }: AgeStepProps) {
  const [inputValue, setInputValue] = useState(() => value?.toString() || "");
  const [error, setError] = useState("");

  const handleChange = (val: string) => {
    setInputValue(val);

    const num = parseInt(val);

    if (val && (isNaN(num) || num < 18 || num > 100)) {
      setError("Please enter a valid age between 18 and 100");
    } else {
      setError("");
      if (num) onChange(num);
    }
  };

  const isValid = inputValue && !error;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
          How old are you?
        </h2>
        <p className="text-muted-foreground">
          Age affects your metabolic rate and calorie needs.
        </p>
      </div>

      <QuizInput
        type="number"
        placeholder="Enter your age"
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        suffix="years"
        error={error}
        min={18}
        max={100}
      />

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
