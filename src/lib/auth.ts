import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import prisma from './prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      async profile(profile, tokens) {
        let email = profile.email;
        if (!email && tokens.access_token) {
          try {
            const emailRes = await fetch('https://api.github.com/user/emails', {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
                'User-Agent': 'cosmodex-auth',
              },
            });
            if (emailRes.ok) {
              const emails = await emailRes.json();
              const primaryEmail =
                emails.find((e: { primary: boolean; verified: boolean; email: string }) => e.primary && e.verified) ??
                emails.find((e: { primary: boolean; email: string }) => e.primary) ??
                emails[0];
              if (primaryEmail) {
                email = primaryEmail.email;
              }
            }
          } catch (err) {
            console.error('Failed to fetch GitHub email:', err);
          }
        }
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: email ?? null,
          image: profile.avatar_url,
        };
      },
    }),
  ],

  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account, profile }) {
      const emailVal = profile?.email || user?.email;
      if (account && emailVal) {
        const email = emailVal.trim().toLowerCase();
        const existingUser = await prisma.users.findUnique({
          where: { email },
          select: { id: true, auth_provider: true },
        });

        if (existingUser) {
          const provider = account.provider.toLowerCase();
          const existingProvider = existingUser.auth_provider?.toLowerCase();
          if (existingProvider && existingProvider !== provider) {
            const prettyProvider =
              existingProvider === 'email'
                ? 'email/password'
                : existingProvider === 'github'
                  ? 'GitHub'
                  : 'Google';
            return `/onboarding?error=This email is already registered using ${prettyProvider}. Please sign in using that method.`;
          }
        }
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { provider?: string }).provider = token.provider as string | undefined;
      }
      return session;
    },
  },

  session: {
    strategy: 'jwt',
  },
};

export default NextAuth(authOptions);
