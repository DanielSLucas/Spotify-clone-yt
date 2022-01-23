/* eslint-disable no-return-await */
import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import SpotifyProvider from 'next-auth/providers/spotify';
import spotifyApi, { LOGIN_URL } from '../../../lib/spotify';

interface Token extends JWT {
  accessToken: string;
  refreshToken: string;
  username: string;
  accessTokenExpires: number;
  error?: string;
}

async function refreshAccessToken(token: Token): Promise<Token> {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET as string,
      authorization: LOGIN_URL,
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      const customToken = token as Token;
      // initial sign in
      if (account && user) {
        return {
          ...customToken,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: (account.expires_at as number) * 1000, // *1000 to get time in milliseconds
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < customToken.accessTokenExpires) {
        return token;
      }

      // Access token has expired, so we nessd to refresh it...
      return await refreshAccessToken(customToken);
    },

    async session({ session, token }) {
      const customToken = token as Token;

      Object.assign(session, {
        user: {
          ...session.user,
          accessToken: customToken.accessToken,
          refreshToken: customToken.refreshToken,
          username: customToken.username,
        },
      });

      return session;
    },
  },
});
