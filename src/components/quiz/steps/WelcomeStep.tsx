import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { QuizButton } from "@/components/quiz/QuizButton";
import { useNavigate } from "react-router";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="w-20 h-20 gradient-hero rounded-full flex items-center justify-center mx-auto shadow-glow"
      >
        <Sparkles className="w-10 h-10 text-primary-foreground" />
      </motion.div>

      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground mb-3">
          Start Your Transformation
        </h1>

        <p className="text-muted-foreground text-lg">
          Answer a few questions so we can create your personalized weight loss
          plan.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4 *:flex-1 flex-col"
      >
        <QuizButton
          variant="outline"
          onClick={() => navigate("/")}
          className="px-4 gap-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </QuizButton>

        <QuizButton size="lg" onClick={onNext}>
          Let's Get Started
        </QuizButton>
      </motion.div>

      <p className="text-sm text-muted-foreground">
        Takes about 2 minutes • 100% personalized
      </p>
    </div>
  );
}
