import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createClient } from "redis";

export const POST = async (req) => {
  // Extract the data of "image" key from the FormData
  const data = await req.formData();
  const image = data.get("image");

  // Convert the image data into ArrayBuffer
  const arrayBuffer = await image.arrayBuffer();

  // Convert the ArrayBuffer into Node.js Buffer
  const nodejsBuffer = Buffer.from(arrayBuffer);

  // Fetch user's session data
  const session = await getServerSession(authOptions);

  const client = await createClient({
    url: "redis://redis:6379",
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  // const json = session.user;
  // await client.set(session.user.id, JSON.stringify(json));
  // const value = await client.get(session.user.id);
  await client.setBuffer(session.user.id, "buffer", nodejsBuffer);

  await client.disconnect();

  return Response.json(nodejsBuffer);
};
