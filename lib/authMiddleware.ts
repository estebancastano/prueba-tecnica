import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { auth } from "./auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function withAuth(
    handler: NextApiHandler,
    rolesRequired: Array<"ADMIN" | "USUARIO"> = ["ADMIN"]
) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            const token = req.cookies["better-auth.session_token"];
            if (!token) return res.status(401).json({ message: "No autorizado. No hay token." });

            // 1️⃣ Obtener sesión desde BetterAuth
            const sessionResult = await auth.api.getSession({
                headers: { cookie: `better-auth.session_token=${token}` },
            });

            const session = sessionResult?.session;
            const userFromSession = sessionResult?.user;

            if (!session || !userFromSession) {
                return res.status(401).json({ message: "No autorizado. Sesión inválida." });
            }

            // 2️⃣ Upsert: crear usuario automáticamente si no existe
            const user = await prisma.user.upsert({
                where: { id: userFromSession.id },
                update: {}, // si ya existe, no hacemos nada
                create: {
                    id: userFromSession.id,
                    name: userFromSession.name || "Sin nombre",
                    email: userFromSession.email!,
                    role: "ADMIN",           // <-- rol por defecto
                    emailVerified: userFromSession.emailVerified || false,
                    phone: null,
                    image: userFromSession.image || null,
                },
            });

            // 3️⃣ Verificar rol
            if (rolesRequired && !rolesRequired.includes(user.role as any)) {
                return res.status(403).json({ message: "No autorizado. Rol insuficiente." });
            }

            // 4️⃣ Adjuntar usuario a la request
            (req as any).user = user;

            return handler(req, res);

        } catch (error) {
            console.error("❌ Error en withAuth:", error);
            return res.status(500).json({ message: "Error interno en autenticación" });
        }
    };
}

