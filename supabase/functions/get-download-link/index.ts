import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "npm:stripe@^16.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? Deno.env.get("PROJECT_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
    Deno.env.get("SERVICE_ROLE_KEY")!,
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return new Response(JSON.stringify({ error: "sessionId is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const userId = session.client_reference_id;

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing user reference" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("pdf_path")
      .eq("id", userId)
      .single();

    if (profileError) {
      return new Response(JSON.stringify({ error: profileError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log("profile DENO----", profile);

    const pdfPath = profile?.pdf_path as string | undefined;

    console.log("pdfPath DENO----", pdfPath);

    if (!pdfPath) {
      return new Response(
        JSON.stringify({
          error: "PDF not ready",
          profile1: profile,
          pdfPath1: pdfPath,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        },
      );
    }

    const { data: signedData, error: signedError } = await supabaseAdmin.storage
      .from("pdfs")
      .createSignedUrl(pdfPath, 60 * 60 * 24 * 7);

    if (signedError) {
      return new Response(JSON.stringify({ error: signedError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const supabaseUrl = Deno.env.get("BASE_URL") ?? Deno.env.get("PROJECT_URL");

    const rawUrl = signedData?.signedUrl ?? null;
    const url =
      rawUrl && supabaseUrl
        ? rawUrl.replace("http://kong:8000", supabaseUrl)
        : rawUrl;

    return new Response(JSON.stringify({ url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
