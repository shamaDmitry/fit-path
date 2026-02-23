import { AlertTriangle, Info, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface WarningBannerProps {
  type: "warning" | "error" | "success" | "info";
  title?: string;
  messages: string[];
}

const icons = {
  warning: AlertTriangle,
  error: AlertTriangle,
  success: CheckCircle,
  info: Info,
};

const styles = {
  warning: "bg-warning/10 border-warning/20 text-warning",
  error: "bg-destructive/10 border-destructive/20 text-destructive",
  success: "bg-success/10 border-success/20 text-success",
  info: "bg-primary/10 border-primary/20 text-primary",
};

export function WarningBanner({ type, title, messages }: WarningBannerProps) {
  const Icon = icons[type];

  if (messages.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-xl border p-4", styles[type])}
    >
      <div className="flex gap-3">
        <Icon className="w-5 h-5 shrink-0 mt-0.5" />

        <div className="space-y-1">
          {title && <p className="font-semibold">{title}</p>}

          {messages.map((msg, i) => (
            <p key={i} className="text-sm opacity-90">
              {msg}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
