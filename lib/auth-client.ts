import { createAuthClient } from "better-auth/react";

const getAuthBase = () => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/api/auth`;
  }

  // esto es una URL dinámica para local y producción
  const origin = process.env.NEXT_PUBLIC_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${origin.replace(/\/$/, "")}/api/auth`;
};

export const authClient = createAuthClient({
  baseURL: getAuthBase(),
});

export const { signIn, signOut, useSession } = authClient;
