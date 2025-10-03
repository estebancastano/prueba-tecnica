import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/authMiddleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 🔹 Solo ADMIN puede usar este endpoint
    if (req.method === "GET") {
        const usuarios = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                image: true,
                emailVerified: true,
            },
        });
        return res.json(usuarios);
    }

    res.status(405).json({ message: "Método no permitido" });
}

export default withAuth(handler, ["ADMIN"]);
