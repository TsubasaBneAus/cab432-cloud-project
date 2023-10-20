import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createClient } from "redis";
import { PrismaClient } from "@prisma/client";

// Check if the image is stored in RDS
const checkRDS = async () => {
  try {
    // Fetch the base64-encoded Node.js Buffer from RDS
    const session = await getServerSession(authOptions);
    const prisma = new PrismaClient();
    const result = await prisma.userImage.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    // Check if the buffer is not empty
    if (result.base64Image.length != 0) {
      return Response.json({
        state: true,
        message: "Success",
        image: result.base64Image,
      });
    } else {
      return Response.json({ state: true, message: "Success", image: null });
    }
  } catch (e) {
    return Response.json({ state: false, message: "Downloading Error", image: null });
  }
};

export const GET = async () => {
  try {
    // Fetch the base64-encoded Node.js Buffer from Redis
    const session = await getServerSession(authOptions);
    const client = await createClient({
      url: "redis://redis:6379",
    })
      .on("error")
      .connect();
    const buffer = await client.get(session.user.id);
    await client.disconnect();

    // Check if the buffer is not empty
    if (buffer) {
      return Response.json({ state: true, message: "Success", image: buffer });
    } else {
      return checkRDS();
    }
  } catch (e) {
    return checkRDS();
  }
};
