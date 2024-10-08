import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/constants";

export const increaseApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userID: userId }, // Use userID
  });

  if (userApiLimit) {
    await prismadb.userApiLimit.update({
      where: { userID: userId }, // Use userID
      data: { count: userApiLimit.count + 1 },
    });
  } else {
    await prismadb.userApiLimit.create({
      data: { userID: userId, count: 1 }, // Use userID
    });
  }
};

export const checkApiLimit = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userID: userId }, // Use userID
  });

  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
    return true;
  } else {
    return false;
  }
};

export const getApiLimitCount = async () => {
  const { userId } = auth();

  if (!userId) {
    return 0;
  }

  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: { userID: userId }, // Use userID
  });

  if (!userApiLimit) {
    return 0;
  }

  return userApiLimit.count;
};
