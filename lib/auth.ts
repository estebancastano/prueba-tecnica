import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Configuración de Better Auth con Prisma y GitHub OAuth
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string, // ID de la app GitHub
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string, // Secret de GitHub
    },
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL as string], // Orígenes confiables
});

// Tipo para el usuario autenticado con rol
export type User = PrismaClient["user"] & {
  role: "ADMIN" | "USUARIO";
};

// Tipo para la sesión de Better Auth
export type Session = typeof auth.$Infer.Session.session;
