import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createClient } from "redis";
import { PrismaClient } from "@prisma/client";

export const GET = async () => {
  try {
    // Delete the base64-encoded Node.js Buffer from Redis
    const session = await getServerSession(authOptions);
    const client = await createClient({
      url: "redis://redis:6379",
    })
      .on("error", (err) => console.log("Redis Client Error", err))
      .connect();
    await client.del(session.user.id);
    await client.disconnect();

    // Delete the base64-encoded Node.js Buffer from RDS
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
    return Response.json({ state: false, message: "Deletion Error" });
  }
};
