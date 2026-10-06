import { createClient } from "npm:@supabase/supabase-js@2.105.1";
import Stripe from "npm:stripe@18.5.0";
const env = (key: string) => Deno.env.get(key) || "";
Deno.serve(async (req: Request) => {
  if (req.method !== "POST")
    return new Response("Method not allowed", { status: 405 });
  if (!env("STRIPE_SECRET_KEY") || !env("STRIPE_WEBHOOK_SECRET"))
    return new Response("Not configured", { status: 503 });
  const stripe = new Stripe(env("STRIPE_SECRET_KEY"));
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      await req.text(),
      req.headers.get("stripe-signature") || "",
      env("STRIPE_WEBHOOK_SECRET"),
      undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }
  if (
    [
      "checkout.session.completed",
      "checkout.session.async_payment_succeeded",
    ].includes(event.type)
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid" && session.metadata?.order_id) {
      const db = createClient(
        env("SUPABASE_URL"),
        env("SUPABASE_SERVICE_ROLE_KEY"),
      );
      const { error } = await db.rpc("builder_pay", {
        oid: session.metadata.order_id,
        paid_amount: session.amount_total,
        paid_currency: session.currency,
      });
      if (error) return new Response("Fulfillment failed", { status: 500 });
    }
  }
  return new Response("ok");
});
