import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/authMiddleware";
import { Parser } from "json2csv";

// Endpoint para generar reportes CSV de movimientos (solo ADMIN)
async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Método no permitido" });
    }

    // 🔹 Obtener todos los movimientos con información del usuario
    const movimientos = await prisma.movimiento.findMany({
        include: { usuario: true },
    });

    // 🔹 Convertir los movimientos a formato CSV
    const fields = ["id", "concepto", "monto", "fecha", "usuario.name"];
    const parser = new Parser({ fields });
    const csv = parser.parse(movimientos);

    // 🔹 Configurar cabeceras para descarga de CSV
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=report.csv");

    return res.status(200).send(csv);
}

// Exportar handler protegido con rol ADMIN
export default withAuth(handler, ["ADMIN"]);
