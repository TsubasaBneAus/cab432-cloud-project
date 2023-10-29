import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createClient } from "redis";
import { PrismaClient } from "@prisma/client";

// Delete the base64-encoded Node.js Buffer from RDS
const deleteImageFromRDS = async () => {
  try {
    const session = await getServerSession(authOptions);
    const prisma = new PrismaClient();
    await prisma.userImage.update({
      where: {
        userId: session.user.id,
      },
      data: {
        base64Image: null,
      },
    });

    return Response.json({ state: true, message: "Success" });
  } catch (e) {
    return Response.json({ state: false, message: "Image Deletion Error" });
  }
};

export const DELETE = async () => {
  try {
    // Delete the base64-encoded Node.js Buffer from Redis
    const session = await getServerSession(authOptions);
    const client = await createClient({
      url: "redis://redis:6379",
    })
      .on("error", (e) => {
        throw e;
      })
      .connect();
    await client.del(session.user.id);
    await client.disconnect();

    return deleteImageFromRDS();
  } catch (e) {
    return deleteImageFromRDS();
  }
};
