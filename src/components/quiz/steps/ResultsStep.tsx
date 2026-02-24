import { useMemo } from "react";
import { QuizButton } from "@/components/quiz/QuizButton";
import { WeightChart } from "@/components/quiz/WeightChart";
import {
  ArrowLeft,
  Calendar,
  TrendingDown,
  Target,
  Sparkles,
} from "lucide-react";
import {
  validateHealthGoals,
  generateTrajectoryData,
} from "@/lib/health-calculator";
import { motion } from "framer-motion";
import type { QuizData } from "@/types/quiz";
import { QuizInput } from "@/components/quiz/QuizInput";

interface ResultsStepProps {
  quizData: QuizData;
  onCheckout: () => void;
  onBack: () => void;
  email: string;
  setEmail: (email: string) => void;
}

export function ResultsStep({
  quizData,
  onCheckout,
  onBack,
  email,
  setEmail,
}: ResultsStepProps) {
  const validation = useMemo(() => validateHealthGoals(quizData), [quizData]);
  const trajectoryData = useMemo(
    () => generateTrajectoryData(quizData),
    [quizData],
  );

  const weightToLose =
    (quizData.currentWeight || 0) - (quizData.goalWeight || 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-16 h-16 gradient-hero rounded-full flex items-center justify-center mx-auto shadow-glow"
      >
        <Sparkles className="w-8 h-8 text-primary-foreground" />
      </motion.div>

      <div className="text-center">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
          Your Personalized Plan
        </h2>

        <p className="text-muted-foreground">
          Based on your answers, here's your path to success
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-accent rounded-xl p-4"
        >
          <TrendingDown className="w-6 h-6 text-primary mx-auto mb-2" />

          <p className="text-xl font-bold text-foreground">{weightToLose}</p>

          <p className="text-xs text-muted-foreground">
            {quizData.weightUnit} to lose
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-accent rounded-xl p-4"
        >
          <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />

          <p className="text-xl font-bold text-foreground">
            {validation.estimatedWeeks}
          </p>

          <p className="text-xs text-muted-foreground">weeks</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-accent rounded-xl p-4"
        >
          <Target className="w-6 h-6 text-primary mx-auto mb-2" />

          <p className="text-xl font-bold text-foreground">
            {quizData.goalWeight}
          </p>

          <p className="text-xs text-muted-foreground">
            {quizData.weightUnit} goal
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-xl border border-border p-4"
      >
        <h3 className="font-semibold text-foreground mb-2">
          Your Weight Journey
        </h3>

        <WeightChart
          data={trajectoryData}
          goalWeight={quizData.goalWeight || 0}
          unit={quizData.weightUnit}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-secondary rounded-xl p-4 text-center"
      >
        <p className="text-secondary-foreground font-medium">
          "{quizData.motivation}"
        </p>

        <p className="text-sm text-muted-foreground mt-1">— Your motivation</p>
      </motion.div>

      <div>
        <QuizInput
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            return setEmail(e.target.value);
          }}
        />
      </div>

      <div className="flex gap-3">
        <QuizButton variant="outline" onClick={onBack} className="px-4">
          <ArrowLeft className="w-5 h-5" />
        </QuizButton>

        <QuizButton size="lg" onClick={onCheckout} disabled={!email}>
          Start My Journey
        </QuizButton>
      </div>
    </div>
  );
}
