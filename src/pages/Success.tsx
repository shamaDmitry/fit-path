import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { QuizButton } from "@/components/quiz/QuizButton";
import { supabase } from "@/lib/supabase";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get("session_id");
  const status = sessionId ? "success" : "loading";

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(sessionId));

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchDownloadLink = async () => {
      if (!sessionId) {
        setIsLoading(false);

        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke(
          "get-download-link",
          {
            body: { sessionId },
          },
        );

        console.log({ data, error });

        if (error) {
          throw error;
        }

        if (isMounted) {
          setDownloadUrl(data?.url ?? null);
        }
      } catch (err) {
        if (isMounted) {
          setDownloadError(
            "Your PDF is still being prepared. Please check back soon.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDownloadLink();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

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

          <div className="p-4 bg-slate-100 rounded-lg">
            {isLoading &&
              "Generating your PDF... Check your email in 2 minutes."}
            {!isLoading && downloadUrl && (
              <a
                href={downloadUrl}
                className="text-primary underline font-medium"
                target="_blank"
                rel="noreferrer"
              >
                Download your PDF
              </a>
            )}
            {!isLoading && !downloadUrl && (
              <span className="text-muted-foreground">
                {downloadError ?? "Your PDF will be ready soon."}
              </span>
            )}
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
