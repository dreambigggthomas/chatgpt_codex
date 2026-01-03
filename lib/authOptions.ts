import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (credentials?.password && adminPassword && credentials.password === adminPassword) {
          return { id: 'admin', name: 'Admin' };
        }
        return null;
      }
    })
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/admin/login'
  }
} satisfies Parameters<typeof NextAuth>[0];
