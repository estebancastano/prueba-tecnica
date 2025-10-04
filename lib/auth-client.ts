import { createAuthClient } from "better-auth/react";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // 📌 En el navegador → usa la URL del dominio actual (funciona local y en Vercel)
    return `${window.location.origin}/api/auth`;
  }

  // 📌 En SSR/Node → usa la variable de entorno si existe
  return `${process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000"}/api/auth`;
};

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
});

export const { signIn, signOut, useSession } = authClient;
