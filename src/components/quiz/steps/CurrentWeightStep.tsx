import { useState } from "react";
import { QuizInput } from "@/components/quiz/QuizInput";
import { QuizButton } from "@/components/quiz/QuizButton";
import { UnitToggle } from "@/components/quiz/UnitToggle";
import { ArrowLeft } from "lucide-react";
import type { WeightUnit } from "@/types/quiz";

interface CurrentWeightStepProps {
  value?: number;
  unit: WeightUnit;
  onValueChange: (value: number) => void;
  onUnitChange: (unit: WeightUnit) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CurrentWeightStep({
  value,
  unit,
  onValueChange,
  onUnitChange,
  onNext,
  onBack,
}: CurrentWeightStepProps) {
  const [inputValue, setInputValue] = useState(value?.toString() || "");
  const [error, setError] = useState("");

  const getValidRange = () => {
    return unit === "lbs"
      ? { min: 80, max: 600, label: "80-600 lbs" }
      : { min: 35, max: 275, label: "35-275 kg" };
  };

  const handleChange = (val: string) => {
    setInputValue(val);
    const num = parseFloat(val);
    const range = getValidRange();

    if (val && (isNaN(num) || num < range.min || num > range.max)) {
      setError(`Please enter a valid weight (${range.label})`);
    } else {
      setError("");
      if (num) onValueChange(num);
    }
  };

  const handleUnitChange = (newUnit: WeightUnit) => {
    const currentVal = parseFloat(inputValue);
    if (currentVal) {
      const converted =
        newUnit === "kg"
          ? Math.round(currentVal * 0.453592)
          : Math.round(currentVal / 0.453592);

      setInputValue(converted.toString());
      onValueChange(converted);
    }

    onUnitChange(newUnit);
    setError("");
  };

  const isValid = inputValue && !error;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
          What's your current weight?
        </h2>

        <p className="text-muted-foreground">
          Be honest — this is your starting point for success.
        </p>
      </div>

      <div className="flex justify-center">
        <UnitToggle
          options={[
            { value: "kg" as WeightUnit, label: "Kilograms" },
            { value: "lbs" as WeightUnit, label: "Pounds" },
          ]}
          value={unit}
          onChange={handleUnitChange}
        />
      </div>

      <QuizInput
        type="number"
        placeholder={`Enter weight in ${unit}`}
        value={inputValue}
        onChange={(e) => handleChange(e.target.value)}
        suffix={unit}
        error={error}
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
