import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { createClient } from "redis";
import { PrismaClient } from "@prisma/client";

// Delete a user account from RDS
const deleteUserFromRDS = async () => {
  try {
    const session = await getServerSession(authOptions);
    const prisma = new PrismaClient();
    const deleteUser = await prisma.user.delete({
      where: {
        id: session.user.id,
      },
    });
    console.log(deleteUser);
  
    return Response.json({ state: true, message: "Success" });
  } catch (e) {
    return Response.json({ state: false, message: "Account Deletion Error" });
  }

}

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

    return deleteUserFromRDS();
  } catch (e) {
    return deleteUserFromRDS();
  }
};
