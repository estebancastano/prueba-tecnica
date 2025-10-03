import { auth } from "@/lib/auth";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("Testing auth configuration...");
    console.log("Base URL:", process.env.BETTER_AUTH_URL);
    console.log("GitHub Client ID:", process.env.GITHUB_CLIENT_ID);
    console.log("Secret exists:", !!process.env.BETTER_AUTH_SECRET);
    
    res.status(200).json({ 
      message: "Auth config loaded",
      basePath: "/api/auth",
      baseURL: process.env.BETTER_AUTH_URL
    });
  } catch (error) {
    console.error("Auth config error:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}