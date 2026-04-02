import Stripe from "stripe";

const isMock = process.env.MOCK_STRIPE === "true";

export const stripe = isMock 
  ? {
      checkout: {
        sessions: {
          create: async (params: any) => {
            console.log("MOCK STRIPE: Creating checkout session", params);
            return {
              url: params.success_url,
              id: "mock_session_id"
            };
          }
        }
      },
      webhooks: {
        constructEvent: () => {
          throw new Error("Webhooks are not supported in MOCK mode. Use manual triggers.");
        }
      }
    } as unknown as Stripe
  : new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2024-04-10",
      typescript: true
    });

