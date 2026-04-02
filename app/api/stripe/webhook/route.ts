import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export async function POST(req: Request) {
  await getServerSession(authOptions);
  const body = await req.text();
  const signature = headers().get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return new Response("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const recruiterId = session.metadata?.recruiterId;
      if (recruiterId) {
        await prisma.subscription.upsert({
          where: { recruiterId },
          update: {
            stripeCustomerId: String(session.customer || ""),
            plan: "pro",
            status: "ACTIVE"
          },
          create: {
            recruiterId,
            stripeCustomerId: String(session.customer || ""),
            plan: "pro",
            status: "ACTIVE"
          }
        });
      }
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const recruiterId = subscription.metadata?.recruiterId;
      if (recruiterId) {
        await prisma.subscription.upsert({
          where: { recruiterId },
          update: {
            status: subscription.status === "active" ? "ACTIVE" : "PAST_DUE",
            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
          },
          create: {
            recruiterId,
            stripeCustomerId: String(subscription.customer || ""),
            plan: "pro",
            status: subscription.status === "active" ? "ACTIVE" : "PAST_DUE",
            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
          }
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const recruiterId = subscription.metadata?.recruiterId;
      if (recruiterId) {
        await prisma.subscription.updateMany({
          where: { recruiterId },
          data: {
            status: "CANCELED"
          }
        });
      }
      break;
    }
    default:
      break;
  }

  return new Response("ok", { status: 200 });
}
