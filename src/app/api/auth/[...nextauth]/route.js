import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // Add the "id" key of "user" to "session"
    session: async ({ session, user }) => {
      session.user.id = user.id;
      return session;
    },
  },
  events: {
    // Create a record in "UserImage" table
    createUser: async ({ user }) => {
      await prisma.userImage.create({
        data: {
          userId: user.id,
        },
      });
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
