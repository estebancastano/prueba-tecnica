import type { NextApiRequest, NextApiResponse } from "next";
import  prisma  from "@/lib/prisma";
import { withAuth } from "@/lib/authMiddleware";
import { Parser } from "json2csv";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Método no permitido" });
    }

    // Obtener todos los movimientos
    const movimientos = await prisma.movimiento.findMany({
        include: { usuario: true },
    });

    // Convertir a CSV
    const fields = ["id", "concepto", "monto", "fecha", "usuario.name"];
    const parser = new Parser({ fields });
    const csv = parser.parse(movimientos);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=report.csv");
    return res.status(200).send(csv);
}

export default withAuth(handler , ["ADMIN"]);
