import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/authMiddleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = (req as any).user;
    const { id } = req.query; 

    if (!user) return res.status(401).json({ message: "No autorizado. Usuario no encontrado." });

    if (!id || typeof id !== "string") return res.status(400).json({ message: "Id inválido." });

    // 🔹 GET por id
    if (req.method === "GET") {
        const movimiento = await prisma.movimiento.findUnique({
            where: { id },
            include: { usuario: true },
        });

        if (!movimiento) return res.status(404).json({ message: "Movimiento no encontrado." });

        if (user.role !== "ADMIN" && movimiento.userId !== user.id) {
            return res.status(403).json({ message: "No autorizado para ver este movimiento." });
        }

        return res.json(movimiento);
    }

    // 🔹 PUT - actualizar
    if (req.method === "PUT") {
        const { concepto, monto, fecha, tipo } = req.body;

        if (!concepto || !monto || !fecha || !tipo) {
            return res.status(400).json({ message: "Faltan datos obligatorios." });
        }

        const movimiento = await prisma.movimiento.findUnique({ where: { id } });
        if (!movimiento) return res.status(404).json({ message: "Movimiento no encontrado." });
        if (user.role !== "ADMIN" && movimiento.userId !== user.id) {
            return res.status(403).json({ message: "No autorizado para modificar este movimiento." });
        }

        const actualizado = await prisma.movimiento.update({
            where: { id },
            data: {
                concepto,
                monto,
                fecha: new Date(fecha)
            },
        });

        return res.json(actualizado);
    }

    // 🔹 DELETE
    if (req.method === "DELETE") {
        const movimiento = await prisma.movimiento.findUnique({ where: { id } });
        if (!movimiento) return res.status(404).json({ message: "Movimiento no encontrado." });
        if (user.role !== "ADMIN" && movimiento.userId !== user.id) {
            return res.status(403).json({ message: "No autorizado para eliminar este movimiento." });
        }

        await prisma.movimiento.delete({ where: { id } });
        return res.json({ message: "Movimiento eliminado correctamente." });
    }

    res.status(405).json({ message: "Método no permitido" });
}

export default withAuth(handler, ["USUARIO", "ADMIN"]);
