import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    env: {
      hasGithubClientId: !!process.env.GITHUB_CLIENT_ID,
      hasGithubSecret: !!process.env.GITHUB_CLIENT_SECRET,
      hasAuthSecret: !!process.env.BETTER_AUTH_SECRET,
      baseURL: process.env.BETTER_AUTH_URL,
      databaseURL: process.env.DATABASE_URL?.substring(0, 30) + "...",
    },
  });
}