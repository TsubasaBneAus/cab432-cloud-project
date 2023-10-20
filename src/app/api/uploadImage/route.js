import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createClient } from "redis";
import { PrismaClient } from "@prisma/client";

// Upload the base64-encoded Node.js Buffer to RDS
const uploadImageToRDS = async (buffer) => {
  try {
    // throw Error;
    const session = await getServerSession(authOptions);
    const prisma = new PrismaClient();
    await prisma.userImage.update({
      where: {
        userId: session.user.id,
      },
      data: {
        base64Image: buffer,
      },
    });

    return Response.json({ state: true, message: "Success" });
  } catch (e) {
    return Response.json({ state: false, message: "Image Uploading Error" });
  }
};

export const POST = async (req) => {
  // Extract the data of "image" key from the FormData
  const data = await req.json();
  const buffer = data.image;

  try {
    // Upload the base64-encoded Node.js Buffer to Redis
    const session = await getServerSession(authOptions);
    const client = await createClient({
      url: "redis://redis:6379",
    })
      .on("error", (e) => {
        throw e;
      })
      .connect();
    await client.set(session.user.id, buffer);
    await client.disconnect();

    return uploadImageToRDS(buffer);
  } catch (e) {;
    return uploadImageToRDS(buffer);
  }
};
