import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);
    const prisma = new PrismaClient();
    const res = await prisma.user.delete({
      where: {
        id: session.user.id,
      },
    });

    return Response.json({ state: true, message: "Success" });
  } catch (e) {
    return Response.json({ state: false, message: "Account Deletion Error" });
  }
};
