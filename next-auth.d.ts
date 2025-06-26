import NextAuth, { DefaultSession, DefaultUser, JWT } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id?: number;
      nickname?: string | null;
      email?: string | null;
      image?: string | null;

      role: string;
      accessToken: string;
    };
  }

  interface User extends DefaultUser {
    /** 가입 시 데이터베이스에 저장된 역할 정보 */
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** 로그인 시 발급된 토큰(payload) */
    accessToken?: string;
    role?: string;
  }
}
