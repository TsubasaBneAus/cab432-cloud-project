import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createClient } from "redis";
import { PrismaClient } from "@prisma/client";

export const POST = async (req) => {
  // Extract the data of "image" key from the FormData
  const data = await req.formData();
  const image = data.get("image");

  // Convert the image data into a base64-encoded Node.js Buffer
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer).toString("base64");

  // Upload the base64-encoded Node.js Buffer to Redis
  const session = await getServerSession(authOptions);
  const client = await createClient({
    url: "redis://redis:6379",
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
  await client.set(session.user.id, buffer);
  await client.disconnect();

  // Upload the base64-encoded Node.js Buffer to RDS
  const prisma = new PrismaClient();
  await prisma.userImage.update({
    where: {
      userId: session.user.id,
    },
    data: {
      base64Image: buffer,
    },
  });

  return Response.json("The image has been uploaded!");
};
