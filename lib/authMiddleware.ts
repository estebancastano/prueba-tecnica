import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { auth } from "./auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Middleware para proteger rutas API con autenticación y roles
export function withAuth(
    handler: NextApiHandler,
    rolesRequired: Array<"ADMIN" | "USUARIO"> = ["ADMIN"]
) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            // Buscar la cookie de sesión de Better Auth
            const cookieName = Object.keys(req.cookies).find((key) =>
                key.includes("better-auth.session_token")
            );

            const token = cookieName ? req.cookies[cookieName] : null;

            if (!token) return res.status(401).json({ message: "No autorizado. No hay token." });

            // Validar sesión con Better Auth
            const sessionResult = await auth.api.getSession({
                headers: { cookie: `${cookieName}=${token}` },
            });

            const session = sessionResult?.session;
            const userFromSession = sessionResult?.user;

            if (!session || !userFromSession)
                return res.status(401).json({ message: "No autorizado. Sesión inválida." });

            // Crear o actualizar usuario en la base de datos
            const user = await prisma.user.upsert({
                where: { id: userFromSession.id },
                update: {}, // No se actualizan campos automáticamente
                create: {
                    id: userFromSession.id,
                    name: userFromSession.name || "Sin nombre",
                    email: userFromSession.email!,
                    role: "ADMIN", // Rol por defecto
                    emailVerified: userFromSession.emailVerified || false,
                    phone: null,
                    image: userFromSession.image || null,
                },
            });

            // Verificar rol permitido
            if (rolesRequired && !rolesRequired.includes(user.role as any))
                return res.status(403).json({ message: "No autorizado. Rol insuficiente." });

            // Adjuntar usuario a la request
            (req as any).user = user;

            // Ejecutar el handler original
            return handler(req, res);
        } catch (error) {
            console.error("❌ Error en withAuth:", error);
            return res.status(500).json({ message: "Error interno en autenticación" });
        }
    };
}
