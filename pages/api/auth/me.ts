import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/lib/authMiddleware";

// Endpoint protegido que devuelve los datos del usuario autenticado
async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user = (req as any).user; // Obtener usuario desde el middleware
    res.status(200).json({ user }); // Retornar información del usuario
}

// Exportar el handler envuelto con autenticación y roles permitidos
export default withAuth(handler, ["ADMIN", "USUARIO"]);
