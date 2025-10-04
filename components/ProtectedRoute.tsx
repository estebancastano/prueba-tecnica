import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import prisma from "@/lib/prisma";

export function withAuth(handler: NextApiHandler, roleRequired: "ADMIN" | "USUARIO" = "ADMIN") {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const sessionId = req.cookies["better-auth-session"];
        if (!sessionId) return res.status(401).json({ message: "No autenticado" });

        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: { user: true },
        });

        if (!session || !session.user) return res.status(401).json({ message: "No autenticado" });
        if (roleRequired && session.user.role !== roleRequired)
            return res.status(403).json({ message: "No autorizado" });

        (req as any).user = session.user;

        return handler(req, res);
    };
}
