import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.username === 'staff' && credentials?.password === 'reliable123') {
          return {
            id: "1",
            name: "Staff Member",
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-at-least-32-chars",
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = token;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };