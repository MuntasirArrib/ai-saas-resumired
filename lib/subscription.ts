import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const { userId } = auth();
  console.log("checkSubscription - userId:", userId); // Logging userId

  if (!userId) {
    console.error("No userId found");
    return false;
  }

  const userSubscription = await prismadb.userSubscription.findUnique({
    where: {
      userID: userId, // Use userID to match schema
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  console.log("userSubscription:", userSubscription); // Logging userSubscription

  if (!userSubscription) {
    console.error("No userSubscription found");
    return false;
  }

  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  console.log("isValid:", isValid); // Logging isValid

  return !!isValid;
};
