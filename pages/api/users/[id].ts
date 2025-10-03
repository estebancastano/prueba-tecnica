import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/authMiddleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    if (!id || typeof id !== "string") return res.status(400).json({ message: "Id inválido." });

    // 🔹 PUT - actualizar nombre y rol
    if (req.method === "PUT") {
        const { name, role } = req.body;

        if (!name || !role) {
            return res.status(400).json({ message: "Faltan campos obligatorios: name y role." });
        }

        const usuario = await prisma.user.findUnique({ where: { id } });
        if (!usuario) return res.status(404).json({ message: "Usuario no encontrado." });

        try {
            const actualizado = await prisma.user.update({
                where: { id },
                data: { name, role },
            });
            return res.json(actualizado);
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            return res.status(500).json({ message: "Error interno al actualizar usuario." });
        }
    }

    // 🔹 DELETE - eliminar usuario
    if (req.method === "DELETE") {
        const usuario = await prisma.user.findUnique({ where: { id } });
        if (!usuario) return res.status(404).json({ message: "Usuario no encontrado." });

        try {
            await prisma.user.delete({ where: { id } });
            return res.json({ message: "Usuario eliminado correctamente." });
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            return res.status(500).json({ message: "Error interno al eliminar usuario." });
        }
    }

    res.status(405).json({ message: "Método no permitido" });
}

// 🔹 Solo ADMIN puede acceder
export default withAuth(handler, ["ADMIN"]);
