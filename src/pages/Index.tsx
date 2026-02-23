import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  TrendingDown,
  Users,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router";

const stats = [
  { value: "2M+", label: "Success Stories" },
  { value: "15lbs", label: "Avg Weight Lost" },
  { value: "94%", label: "Keep it Off" },
];

const benefits = [
  "Personalized meal plans based on your preferences",
  "Science-backed weight loss strategies",
  "Expert support from certified nutritionists",
  "Track your progress with smart analytics",
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-warm overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-6xl mx-auto px-4 pt-12 pb-20">
          {/* Nav */}
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-16"
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 gradient-hero rounded-xl flex items-center justify-center shadow-glow">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>

              <span className="font-heading text-xl font-bold text-foreground">
                FitPath
              </span>
            </div>

            <Button
              onClick={() => navigate("/quiz")}
              className="text-primary font-medium hover:underline"
            >
              Take the Quiz →
            </Button>
          </motion.nav>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full">
                <TrendingDown className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-accent-foreground">
                  Science-backed weight loss
                </span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Your personalized path to a{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  healthier you
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg">
                Take our 2-minute quiz to get a customized weight loss plan
                designed specifically for your body, lifestyle, and goals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={() => navigate("/quiz")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 gradient-hero text-primary-foreground font-semibold rounded-xl shadow-soft hover:shadow-glow transition-all flex items-center justify-center gap-2"
                >
                  Start Free Quiz
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <button className="px-8 py-4 bg-card border-2 border-border text-foreground font-semibold rounded-xl hover:bg-accent transition-all">
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <p className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10">
                <div className="bg-card rounded-3xl shadow-medium p-8 border border-border">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 gradient-hero rounded-full flex items-center justify-center shadow-glow">
                      <Users className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-heading text-lg font-semibold text-foreground">
                        Join 2M+ members
                      </p>
                      <p className="text-muted-foreground">
                        Transforming their lives
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {benefits.map((benefit, i) => (
                      <motion.div
                        key={benefit}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-accent rounded-xl"
                      >
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    onClick={() => navigate("/quiz")}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="w-full mt-6 py-4 gradient-hero text-primary-foreground font-semibold rounded-xl shadow-soft hover:shadow-glow transition-all"
                  >
                    Get My Free Plan
                  </motion.button>
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-secondary rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur border-t border-border">
          <button
            onClick={() => navigate("/quiz")}
            className="w-full py-4 gradient-hero text-primary-foreground font-semibold rounded-xl shadow-soft flex items-center justify-center gap-2"
          >
            Start Free Quiz
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
