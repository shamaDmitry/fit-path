import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { QuizButton } from "@/components/quiz/QuizButton";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get("session_id");
  const status = sessionId ? "success" : "loading";

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="flex justify-center flex-col items-center gap-2 mb-4 text-success">
            <span className="capitalize text-lg font-bold">{status}</span>

            <CheckCircle2 size={64} />
          </div>

          <CardTitle className="text-2xl">Welcome to the Program!</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your 7-day free trial has started. We are generating your
            personalized weight loss plan right now.
          </p>

          <div className="p-4 bg-slate-100 rounded-lg animate-pulse">
            Generating your PDF... Check your email in 2 minutes.
          </div>

          <QuizButton
            onClick={() => navigate("/")}
            className="px-4 gap-1 w-full"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </QuizButton>
        </CardContent>
      </Card>
    </div>
  );
}
