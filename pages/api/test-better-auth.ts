import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Test 1: Verificar que auth existe
    console.log("✅ Auth object exists:", !!auth);
    console.log("✅ Auth handler exists:", !!auth.handler);
    
    // Test 2: Verificar variables de entorno
    console.log("✅ GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID?.substring(0, 10) + "...");
    console.log("✅ GITHUB_CLIENT_SECRET:", !!process.env.GITHUB_CLIENT_SECRET);
    console.log("✅ BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL);
    
    // Test 3: Verificar base de datos
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    await prisma.$connect();
    const userCount = await prisma.user.count();
    console.log("✅ Database connected. Users:", userCount);
    await prisma.$disconnect();
    
    res.status(200).json({
      success: true,
      auth: !!auth,
      handler: !!auth.handler,
      env: {
        githubClientId: !!process.env.GITHUB_CLIENT_ID,
        githubSecret: !!process.env.GITHUB_CLIENT_SECRET,
        baseURL: process.env.BETTER_AUTH_URL,
      },
      database: {
        connected: true,
        users: userCount,
      },
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown",
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}