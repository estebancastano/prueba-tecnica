// pages/api/movimientos/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/authMiddleware";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = (req as any).user;

    if (!user) return res.status(401).json({ message: "No autorizado. Usuario no encontrado." });

    if (req.method === "GET") {
        const all = req.query.all === "true";

        // 🗓️ Rango de fechas
        const fechaInicio = req.query.fechaInicio
            ? new Date(req.query.fechaInicio as string)
            : new Date(new Date().setDate(new Date().getDate() - 30));
        fechaInicio.setHours(0, 0, 0, 0); // inicio del día

        const fechaFin = req.query.fechaFin
            ? new Date(req.query.fechaFin as string)
            : new Date();
        fechaFin.setHours(23, 59, 59, 999); // fin del día

        const filtroFechas = {
            fecha: {
                gte: fechaInicio,
                lte: fechaFin,
            },
        };

        // ✅ Si piden todos los movimientos (sin paginación)
        if (all) {
            const movimientos = await prisma.movimiento.findMany({
                where: filtroFechas,
                include: { usuario: true },
                orderBy: { fecha: "asc" },
            });

            // 💰 Calcular total global también aquí
            const totalGlobalResult = await prisma.movimiento.aggregate({
                _sum: { monto: true },
                where: filtroFechas,
            });
            const totalGlobal = totalGlobalResult._sum.monto || 0;

            return res.json({ movimientos, totalGlobal });
        }

        // 📄 Modo paginado normal
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const movimientos = await prisma.movimiento.findMany({
            skip,
            take: limit,
            where: filtroFechas,
            include: { usuario: true },
            orderBy: { fecha: "asc" },
        });

        const total = await prisma.movimiento.count({ where: filtroFechas });

        const totalGlobalResult = await prisma.movimiento.aggregate({
            _sum: { monto: true },
            where: filtroFechas,
        });

        const totalGlobal = totalGlobalResult._sum.monto || 0;

        return res.json({ movimientos, total, totalGlobal });
    }

    if (req.method === "POST") {
        const { concepto, monto, fecha } = req.body;

        if (!concepto || !monto || !fecha) {
            return res.status(400).json({ message: "Faltan datos obligatorios." });
        }

        const nuevoMovimiento = await prisma.movimiento.create({
            data: {
                concepto,
                monto: parseFloat(monto),
                fecha: new Date(fecha),
                userId: user.id,
            },
        });

        return res.status(201).json(nuevoMovimiento);
    }

    res.status(405).json({ message: "Método no permitido" });
}

export default withAuth(handler, ["USUARIO", "ADMIN"]);
