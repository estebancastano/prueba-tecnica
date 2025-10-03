// pages/api/movimientos/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/authMiddleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = (req as any).user;

    if (!user) return res.status(401).json({ message: "No autorizado. Usuario no encontrado." });

    if (req.method === "GET") {
        const movimientos = await prisma.movimiento.findMany({
            where: user.role === "ADMIN" ? {} : { userId: user.id },
            include: { usuario: true },
        });
        return res.json(movimientos);
    }

    if (req.method === "POST") {
        const { concepto, monto, fecha, tipo } = req.body;

        if (!concepto || !monto || !fecha || !tipo) {
            return res.status(400).json({ message: "Faltan datos obligatorios." });
        }

        const nuevoMovimiento = await prisma.movimiento.create({
            data: {
                concepto,
                monto,
                fecha: new Date(fecha),
                tipo,
                userId: user.id,
            },
        });

        return res.status(201).json(nuevoMovimiento);
    }

    res.status(405).json({ message: "Método no permitido" });
}


export default withAuth(handler, ["USUARIO", "ADMIN"]);
