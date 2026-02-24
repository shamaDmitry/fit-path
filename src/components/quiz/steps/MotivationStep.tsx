import { useState } from "react";
import { QuizButton } from "@/components/quiz/QuizButton";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MotivationStepProps {
  value?: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const suggestions = [
  "Feel more confident",
  "Improve my health",
  "Have more energy",
  "Look better",
  "Set a good example",
  "Upcoming event",
];

export function MotivationStep({
  value,
  onChange,
  onNext,
  onBack,
}: MotivationStepProps) {
  const [customValue, setCustomValue] = useState(value || "");

  const handleSuggestionClick = (suggestion: string) => {
    setCustomValue(suggestion);
    onChange(suggestion);
  };

  const handleInputChange = (val: string) => {
    setCustomValue(val);
    onChange(val);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
          What motivates you to lose weight?
        </h2>

        <p className="text-muted-foreground">
          We'll remind you of this when things get tough.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            onClick={() => handleSuggestionClick(suggestion)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              customValue === suggestion
                ? "gradient-hero text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {suggestion}
          </Button>
        ))}
      </div>

      <Textarea
        value={customValue}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Or write your own motivation..."
        className="w-full px-4 py-3 text-base rounded-xl border-2 border-border bg-card transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground resize-none h-24"
      />

      <div className="flex gap-3">
        <QuizButton variant="outline" onClick={onBack} className="px-4">
          <ArrowLeft className="w-5 h-5" />
        </QuizButton>

        <QuizButton size="lg" onClick={onNext} disabled={!customValue.trim()}>
          Continue
        </QuizButton>
      </div>
    </div>
  );
}
