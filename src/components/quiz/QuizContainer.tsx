import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface QuizContainerProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  direction: number;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

export function QuizContainer({
  children,
  currentStep,
  totalSteps,
  direction,
}: QuizContainerProps) {
  return (
    <div className="min-h-screen gradient-warm flex flex-col">
      <div className="w-full max-w-lg mx-auto px-4 pt-8">
        {/* <QuizProgress currentStep={currentStep} totalSteps={totalSteps} /> */}
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="bg-card rounded-2xl shadow-medium p-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
