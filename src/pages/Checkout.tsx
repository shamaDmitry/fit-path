import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { validateHealthGoals } from "@/lib/health-calculator";
import { Check, Shield, ArrowLeft, CreditCard, Zap } from "lucide-react";
import type { QuizData } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const plans = [
  {
    id: "monthly",
    name: "Monthly",
    price: 29.99,
    period: "month",
    savings: null,
    priceId: "price_1T4IC2ATPQNp3wNrRzoEo6LF",
    monthsQuantity: 1,
  },
  {
    id: "quarterly",
    name: "3 Months",
    price: 19.99,
    period: "month",
    savings: "Save 33%",
    popular: true,
    priceId: "price_1T4IEgATPQNp3wNr2msS4yWL",
    monthsQuantity: 3,
  },
  {
    id: "annual",
    name: "Annual",
    price: 12.99,
    period: "month",
    savings: "Save 57%",
    priceId: "price_1T4IEgATPQNp3wNrAwrw2Dnb",
    monthsQuantity: 12,
  },
];

const features = [
  "Personalized meal plans",
  "Daily workout routines",
  "Progress tracking dashboard",
  "Expert nutritionist support",
  "1000+ healthy recipes",
  "Community access",
];

export default function Checkout() {
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState(
    "price_1T4IEgATPQNp3wNr2msS4yWL",
  );

  const [quizData] = useState<QuizData | null>(() => {
    const stored = sessionStorage.getItem("quizData");

    return stored ? JSON.parse(stored) : null;
  });

  const [email] = useState<string | null>(() => {
    const stored = sessionStorage.getItem("email");

    return stored ? JSON.parse(stored) : null;
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const validation = useMemo(() => {
    if (!quizData) return null;

    return validateHealthGoals(quizData);
  }, [quizData]);

  const selectedPlanData = plans.find((plan) => plan.priceId === selectedPlan);

  const handleCheckout = async () => {
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout",
        {
          body: {
            email: email,
            priceId: selectedPlanData?.priceId,
            quizData: quizData,
          },
        },
      );

      if (error) {
        console.error("Function error:", error);
        toast.error("Could not initialize checkout. Please try again.", {
          classNames: {
            title: "text-red-600!",
            icon: "text-red-600!",
          },
        });

        return;
      }

      if (data?.url) {
        window.location.href = data?.url;
      }
    } catch (err) {
      console.error("Unexpected error:", err);

      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!quizData || !email) {
      navigate("/quiz");
    }
  }, [quizData, email, navigate]);

  return (
    <div className="min-h-screen gradient-warm">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <Button onClick={() => navigate("/quiz")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Complete Your Plan
            </h1>

            <p className="text-muted-foreground">
              You're one step away from starting your journey
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-8">
          <div className="md:col-span-3 space-y-6">
            {quizData && validation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl shadow-soft p-4 md:p-6 border border-border"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 gradient-hero rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Your Goal</h3>

                    <p className="text-sm text-muted-foreground">
                      Lose{" "}
                      {(quizData.currentWeight || 0) -
                        (quizData.goalWeight || 0)}{" "}
                      {quizData.weightUnit} in {validation.estimatedWeeks} weeks
                    </p>
                  </div>
                </div>
                <div className="bg-accent rounded-xl p-3 text-center">
                  <p className="text-sm text-accent-foreground">
                    "{quizData.motivation}"
                  </p>
                </div>
              </motion.div>
            )}

            <div className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Choose your plan
              </h2>

              <div className="space-y-4">
                {plans.map((plan, index) => {
                  return (
                    <Button
                      asChild
                      className={cn(
                        "w-full h-auto p-4 rounded-xl border-2 text-left transition-all relative hover:bg-accent",
                        {
                          "border-primary bg-accent shadow-soft":
                            selectedPlan === plan.priceId,
                          "border-border bg-card hover:border-primary/50 ":
                            selectedPlan !== plan.priceId,
                        },
                      )}
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.priceId)}
                    >
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {plan.popular && (
                          <span className="absolute -top-3 left-4 px-3 py-1 gradient-hero text-primary-foreground text-xs font-semibold rounded-full">
                            Most Popular
                          </span>
                        )}

                        <div className="flex items-center justify-between w-full gap-2">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedPlan === plan.priceId
                                  ? "border-primary bg-primary"
                                  : "border-border"
                              }`}
                            >
                              {selectedPlan === plan.priceId && (
                                <Check className="w-3 h-3 text-primary-foreground" />
                              )}
                            </div>

                            <div>
                              <p className="font-bold text-foreground text-lg">
                                {plan.name}
                              </p>

                              {plan.savings && (
                                <span className="text-sm text-primary font-medium">
                                  {plan.savings}
                                </span>
                              )}
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-center text-muted-foreground flex items-end gap-1 flex-col md:flex-row md:items-center md:gap-2">
                              <p>Total</p>

                              <p className="text-2xl font-bold text-foreground">
                                ${plan.price * plan.monthsQuantity}
                              </p>
                            </div>

                            <div className="text-right w-full flex items-center gap-1 justify-center flex-col">
                              <span className="text-lg font-normal text-foreground">
                                $ {plan.price} / mo
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    </Button>
                  );
                })}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-2xl shadow-soft p-4 md:p-6 border border-border"
            >
              <h3 className="font-semibold text-foreground mb-4">
                What's included
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-3">
                {features.map((feature) => {
                  return (
                    <div key={feature} className="flex items-center gap-2">
                      <div className="w-5 h-5 gradient-hero rounded-full flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>

                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {selectedPlanData && (
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl shadow-medium p-4 md:p-6 border border-border sticky top-8"
              >
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 pb-4 border-b border-border">
                  <div className="flex justify-between gap-1">
                    <span className="text-muted-foreground">
                      Email for order:
                    </span>

                    <span className="font-medium">{email}</span>
                  </div>

                  <div className="flex justify-between gap-1">
                    <span className="text-muted-foreground">
                      {selectedPlanData?.name} Plan
                    </span>

                    <span className="font-medium">
                      ${selectedPlanData?.price}/mo
                    </span>
                  </div>

                  <div className="flex justify-between gap-1">
                    <span className="text-muted-foreground">Total</span>

                    <span className="font-medium">
                      $
                      {selectedPlanData?.price *
                        selectedPlanData?.monthsQuantity}
                    </span>
                  </div>

                  <div className="flex justify-between gap-1">
                    <span className="text-muted-foreground">
                      7-day free trial
                    </span>

                    <span className="text-primary font-medium">Free</span>
                  </div>
                </div>

                <div className="py-4 border-b border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">
                      Due today
                    </span>

                    <span className="text-2xl font-bold text-primary">
                      $0.00
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mt-1">
                    Then ${selectedPlanData?.price}/month after trial
                  </p>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full disabled:opacity-50"
                  size={"lg"}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Start Free Trial
                    </>
                  )}
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />

                  <span>Cancel anytime. No hidden fees.</span>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    By continuing, you agree to our Terms of Service and Privacy
                    Policy. Your subscription will automatically renew unless
                    cancelled.
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
