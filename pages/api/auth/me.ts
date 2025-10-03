// pages/api/auth/me.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/lib/authMiddleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = (req as any).user;
    res.status(200).json({ user });
}

export default withAuth(handler, ["ADMIN", "USUARIO"]);
