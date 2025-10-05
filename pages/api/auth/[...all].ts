import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/lib/auth";

// Handler de autenticación que conecta Next.js API routes con Better Auth
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        // Construir la URL completa de la petición
        const protocol = req.headers["x-forwarded-proto"] || "http";
        const host = req.headers.host || "localhost:3000";
        const fullUrl = `${protocol}://${host}${req.url}`;

        console.log("📍 Full URL:", fullUrl);

        // Mapear headers de Next.js a Headers nativo
        const headers = new Headers();
        Object.entries(req.headers).forEach(([key, value]) => {
            if (value) {
                headers.set(key, Array.isArray(value) ? value[0] : value);
            }
        });

        // Preparar body si no es GET o HEAD
        let body = undefined;
        if (req.method !== "GET" && req.method !== "HEAD") {
            body = JSON.stringify(req.body);
        }

        // Crear objeto Request nativo para Better Auth
        const request = new Request(fullUrl, {
            method: req.method,
            headers,
            body,
        });

        // Ejecutar handler de Better Auth
        const response = await auth.handler(request);
        const responseBody = await response.text();

        // Pasar headers de la respuesta al cliente
        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        // Establecer status code
        res.status(response.status);

        // Parsear respuesta como JSON si es posible, sino enviar como texto
        if (responseBody) {
            try {
                const json = JSON.parse(responseBody);
                res.json(json); 
            } catch {
                res.send(responseBody); 
            }
        } else {
            res.end(); 
        }
    } catch (error) {
        // Manejo de errores
        console.error("❌ Auth handler error:", error);
        res.status(500).json({
            error: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined,
        });
    }
}
