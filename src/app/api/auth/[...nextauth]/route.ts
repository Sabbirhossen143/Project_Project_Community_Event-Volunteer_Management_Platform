
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing in .env.local");
}

const client = new MongoClient(uri);

async function getUsersCollection() {
  await client.connect();
  return client.db("unityvol").collection("users");
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Email and Password",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const users = await getUsersCollection();

        const email = credentials.email.trim().toLowerCase();

        const user = await users.findOne({ email });

        if (!user || typeof user.password !== "string") {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role ?? null,
        };
      },
    }),

    ...(process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            authorization: {
              params: {
                scope: "read:user user:email",
              },
            },
          }),
        ]
      : []),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // Credentials login আগের মতোই থাকবে
      if (
        !account ||
        account.provider === "credentials"
      ) {
        return true;
      }

      if (
        account.provider !== "google" &&
        account.provider !== "github"
      ) {
        return true;
      }

      const email = user.email?.trim().toLowerCase();

      if (!email) {
        return false;
      }

      // Google-এর email verification স্পষ্টভাবে false হলে আটকাবে
      if (
        account.provider === "google" &&
        (profile as { email_verified?: boolean } | undefined)
          ?.email_verified === false
      ) {
        return false;
      }

      const users = await getUsersCollection();

      // আগে থেকে account থাকলে তার Role অপরিবর্তিত রাখবে
      const existingUser = await users.findOne({ email });

      if (existingUser) {
        await users.updateOne(
          { _id: existingUser._id },
          {
            $set: {
              [`oauthProviders.${account.provider}`]:
                account.providerAccountId,
              updatedAt: new Date(),
            },
          }
        );

        return true;
      }

      // নতুন OAuth account MongoDB-তে সংরক্ষণ
      await users.insertOne({
        name: user.name ?? "",
        email,
        role: null,
        authProvider: account.provider,
        oauthProviders: {
          [account.provider]: account.providerAccountId,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }

      // প্রতিবার MongoDB থেকে সর্বশেষ Role নেবে
      if (token.email) {
        const users = await getUsersCollection();

        const dbUser = await users.findOne({
          email: token.email.toLowerCase(),
        });

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role ?? null;
          token.name = dbUser.name ?? token.name;
          token.email = dbUser.email;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as typeof session.user & {
          id?: string;
          role?: string | null;
        };

        sessionUser.id = token.id as string;
        sessionUser.role =
          (token.role as string | null | undefined) ?? null;
        sessionUser.name = token.name ?? null;
        sessionUser.email = token.email ?? null;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
