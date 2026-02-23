import { useState, useCallback } from "react";
import { useNavigate } from "react-router";

import type { QuizData } from "@/types/quiz";
import { QuizContainer } from "@/components/quiz/QuizContainer";

const TOTAL_STEPS = 10;

export default function Quiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [quizData, setQuizData] = useState<QuizData>({
    weightUnit: "lbs",
    heightUnit: "in",
  });

  const goNext = useCallback(() => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS + 1));
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const updateData = useCallback(
    <K extends keyof QuizData>(key: K, value: QuizData[K]) => {
      setQuizData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const goToCheckout = useCallback(() => {
    sessionStorage.setItem("quizData", JSON.stringify(quizData));

    navigate("/checkout");
  }, [quizData, navigate]);

  const renderStep = () => {
    switch (step) {
      case 1:
        // return <WelcomeStep onNext={goNext} />;
        return <div>welcome</div>;
      case 2:
        return (
          // <GenderStep
          //   value={quizData.gender}
          //   onChange={(v) => updateData("gender", v)}
          //   onNext={goNext}
          //   onBack={goBack}
          // />
          <div>gender</div>
        );
      // case 3:
      //   return (
      //     <AgeStep
      //       value={quizData.age}
      //       onChange={(v) => updateData("age", v)}
      //       onNext={goNext}
      //       onBack={goBack}
      //     />
      //   );
      // case 4:
      //   return (
      //     <HeightStep
      //       value={quizData.heightValue}
      //       unit={quizData.heightUnit}
      //       onValueChange={(v) => updateData("heightValue", v)}
      //       onUnitChange={(u) => updateData("heightUnit", u)}
      //       onNext={goNext}
      //       onBack={goBack}
      //     />
      //   );
      // case 5:
      //   return (
      //     <CurrentWeightStep
      //       value={quizData.currentWeight}
      //       unit={quizData.weightUnit}
      //       onValueChange={(v) => updateData("currentWeight", v)}
      //       onUnitChange={(u) => updateData("weightUnit", u)}
      //       onNext={goNext}
      //       onBack={goBack}
      //     />
      //   );
      // case 6:
      //   return (
      //     <GoalWeightStep
      //       quizData={quizData}
      //       onGoalChange={(v) => updateData("goalWeight", v)}
      //       onNext={goNext}
      //       onBack={goBack}
      //     />
      //   );
      // case 7:
      //   return (
      //     <ActivityStep
      //       value={quizData.activityLevel}
      //       onChange={(v) => updateData("activityLevel", v)}
      //       onNext={goNext}
      //       onBack={goBack}
      //     />
      //   );
      // case 8:
      //   return (
      //     <PaceStep
      //       value={quizData.goalPace}
      //       quizData={quizData}
      //       onChange={(v) => updateData("goalPace", v)}
      //       onNext={goNext}
      //       onBack={goBack}
      //     />
      //   );
      // case 9:
      //   return (
      //     <MotivationStep
      //       value={quizData.motivation}
      //       onChange={(v) => updateData("motivation", v)}
      //       onNext={goNext}
      //       onBack={goBack}
      //     />
      //   );
      // case 10:
      //   return (
      //     <DietaryStep
      //       value={quizData.dietaryPreferences}
      //       onChange={(v) => updateData("dietaryPreferences", v)}
      //       onNext={goNext}
      //       onBack={goBack}
      //     />
      //   );
      // case 11:
      //   return (
      //     <ResultsStep
      //       quizData={quizData}
      //       onCheckout={goToCheckout}
      //       onBack={goBack}
      //     />
      //   );
      default:
        // return <WelcomeStep onNext={goNext} />;
        return <div>welcome</div>;
    }
  };

  return (
    <QuizContainer
      currentStep={Math.min(step, TOTAL_STEPS)}
      totalSteps={TOTAL_STEPS}
      direction={direction}
    >
      {renderStep()}
    </QuizContainer>
  );
}
