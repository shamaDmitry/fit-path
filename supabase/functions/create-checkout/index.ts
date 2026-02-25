import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);

const supabaseAdmin = createClient(
  Deno.env.get("PROJECT_URL")!,
  Deno.env.get("SERVICE_ROLE_KEY")!, // Use Service Role to bypass RLS
);

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS")
    return new Response("ok", {
      headers: { "Access-Control-Allow-Origin": "*" },
    });

  const { email, priceId, quizData } = await req.json();

  // 1. Create or Get User (Silent Sign-up)
  const { data: userData, error: userError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password: Math.random().toString(36), // Generate temp password
      email_confirm: true,
    });

  // If user exists, we fetch their ID
  let userId = userData?.user?.id;
  if (userError) {
    const { data: existingUser } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single();
    userId = existingUser?.id;
  }

  // 2. Save Quiz Data to Profile
  await supabaseAdmin.from("profiles").upsert({
    id: userId,
    email,
    quiz_results: quizData,
  });

  // 3. Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    subscription_data: { trial_period_days: 7 },
    client_reference_id: userId,
    success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.get("origin")}/pricing`,
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
