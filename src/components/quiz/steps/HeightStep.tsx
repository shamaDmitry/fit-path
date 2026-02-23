import { useState } from "react";
import { QuizInput } from "@/components/quiz/QuizInput";
import { QuizButton } from "@/components/quiz/QuizButton";
import { ArrowLeft } from "lucide-react";
import type { HeightUnit } from "@/types/quiz";
import { UnitToggle } from "@/components/quiz/UnitToggle";

interface HeightStepProps {
  value?: number;
  unit: HeightUnit;
  onValueChange: (value: number) => void;
  onUnitChange: (unit: HeightUnit) => void;
  onNext: () => void;
  onBack: () => void;
}

export function HeightStep({
  value,
  unit,
  onValueChange,
  onUnitChange,
  onNext,
  onBack,
}: HeightStepProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const getValidRange = () => {
    return unit === "in"
      ? { min: 48, max: 96, label: "48-96 inches" }
      : { min: 120, max: 245, label: "120-245 cm" };
  };

  const handleChange = (val: string) => {
    setInputValue(val);

    const num = parseFloat(val);
    const range = getValidRange();

    if (val && (isNaN(num) || num < range.min || num > range.max)) {
      setError(`Please enter a valid height (${range.label})`);
    } else {
      setError("");
      if (num) onValueChange(num);
    }
  };

  const handleUnitChange = (newUnit: HeightUnit) => {
    const currentVal = parseFloat(inputValue);

    if (currentVal) {
      const converted =
        newUnit === "cm"
          ? Math.round(currentVal * 2.54)
          : Math.round(currentVal / 2.54);

      setInputValue(converted.toString());
      onValueChange(converted);
    }

    onUnitChange(newUnit);
    setError("");
  };

  const displayValue = inputValue || (value ? value.toString() : "");
  const isValid = displayValue && !error;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
          What's your height?
        </h2>

        <p className="text-muted-foreground">
          We'll use this to calculate your ideal weight range.
        </p>
      </div>

      <div className="flex justify-center">
        <UnitToggle
          options={[
            { value: "in" as HeightUnit, label: "Inches" },
            { value: "cm" as HeightUnit, label: "Centimeters" },
          ]}
          value={unit}
          onChange={handleUnitChange}
        />
      </div>

      <QuizInput
        type="number"
        placeholder={`Enter height in ${unit === "in" ? "inches" : "centimeters"}`}
        value={displayValue}
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
