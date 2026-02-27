import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "npm:stripe@^16.0.0";
import { PDFDocument, rgb, StandardFonts } from "npm:pdf-lib";
import { Buffer } from "node:buffer";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? Deno.env.get("PROJECT_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
    Deno.env.get("SERVICE_ROLE_KEY")!,
);

serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

  let event;

  try {
    // 1. Verify the request is legit
    const body = await req.text();

    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      webhookSecret,
      undefined,
      cryptoProvider,
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);

    return new Response(err.message, { status: 400 });
  }

  // 2. Handle the successful payment
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const customerEmail = session.customer_email;

    if (userId) {
      // Update user in Supabase
      await supabaseAdmin
        .from("profiles")
        .update({ is_subscriber: true })
        .eq("id", userId);

      // Fetch the quiz data to generate the PDF
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("quiz_results")
        .eq("id", userId)
        .single();

      // 3. Generate PDF and Send Email
      const pdfBytes = await generateCustomPDF(profile?.quiz_results);

      await sendEmailWithPDF(customerEmail, pdfBytes);
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});

async function generateCustomPDF(quizData: any) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Draw Header
  page.drawText("Your Personalized Weight Loss Plan", {
    x: 50,
    y: 700,
    size: 24,
    font: boldFont,
    color: rgb(0.1, 0.4, 0.8),
  });

  // Add personalized data (fallback text if quizData is empty)
  const introText = quizData
    ? `Based on your answers, here is your 12-week roadmap.`
    : `Welcome to your new healthy lifestyle.`;
  page.drawText(introText, { x: 50, y: 650, size: 14, font });

  page.drawText("• Daily Calorie Goal: Calculated for healthy deficit", {
    x: 50,
    y: 600,
    size: 12,
    font,
  });
  page.drawText("• Hydration: Drink at least 2.5L of water daily", {
    x: 50,
    y: 570,
    size: 12,
    font,
  });
  page.drawText("• Activity: 10,000 steps + 3 strength workouts/week", {
    x: 50,
    y: 540,
    size: 12,
    font,
  });

  return await pdfDoc.save();
}

async function sendEmailWithPDF(email: string, pdfBytes: Uint8Array) {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
  const pdfBase64 = Buffer.from(pdfBytes).toString("base64");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Fit Path <onboarding@resend.dev>",
      to: email,
      subject: "Your Personal Weight Loss Plan is Here! 🚀",
      html: "<p>Thank you for starting your free trial! Your custom 12-week plan is attached below.</p>",
      attachments: [
        {
          filename: "My_Weight_Loss_Plan.pdf",
          content: pdfBase64,
        },
      ],
    }),
  });

  if (!res.ok) console.error("Email failed to send", await res.text());
}
