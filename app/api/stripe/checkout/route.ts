import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as any)?.role;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (role !== "RECRUITER") {
    return new Response("Forbidden", { status: 403 });
  }


  const isMock = process.env.MOCK_STRIPE === "true";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (isMock) {
    // In mock mode, we bypass Stripe and directly update the subscription in the DB
    await prisma.subscription.upsert({
      where: { recruiterId: userId },
      update: {
        plan: "pro",
        status: "ACTIVE",
        stripeCustomerId: "mock_customer_id",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      create: {
        recruiterId: userId,
        plan: "pro",
        status: "ACTIVE",
        stripeCustomerId: "mock_customer_id",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });

    return Response.json({ url: `${appUrl}/recruiter?success=1` });
  }

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    return new Response("Missing Stripe price id", { status: 500 });
  }

  const recruiter = await prisma.user.findUnique({
    where: { id: userId }
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: recruiter?.email || undefined,
    subscription_data: {
      metadata: {
        recruiterId: userId
      }
    },
    success_url: `${appUrl}/recruiter?success=1`,
    cancel_url: `${appUrl}/recruiter?canceled=1`,
    metadata: {
      recruiterId: userId
    }
  });

  return Response.json({ url: checkoutSession.url });
}

