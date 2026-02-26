import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "npm:stripe@^16.0.0";

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
      console.log("profile", profile);
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});

// async function sendWelcomeEmailWithPDF(email: string, quizData: any) {
//   const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

//   await fetch("https://api.resend.com/emails", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${RESEND_API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       from: "Your App <hello@yourdomain.com>",
//       to: email,
//       subject: "Your Personalized Weight Loss Plan is Here!",
//       html: "<p>Thank you for subscribing. Please find your custom plan attached.</p>",
//       // attachments: [{ filename: 'plan.pdf', content: generatedPdfBuffer }]
//     }),
//   });
// }
