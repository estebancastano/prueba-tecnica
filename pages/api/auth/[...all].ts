import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/lib/auth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const protocol = req.headers["x-forwarded-proto"] || "http";
        const host = req.headers.host || "localhost:3000";
        const fullUrl = `${protocol}://${host}${req.url}`;

        console.log("📍 Full URL:", fullUrl);

        const headers = new Headers();
        Object.entries(req.headers).forEach(([key, value]) => {
            if (value) {
                headers.set(key, Array.isArray(value) ? value[0] : value);
            }
        });

        let body = undefined;
        if (req.method !== "GET" && req.method !== "HEAD") {
            body = JSON.stringify(req.body);
        }

        const request = new Request(fullUrl, {
            method: req.method,
            headers,
            body,
        });

        const response = await auth.handler(request);
        const responseBody = await response.text();

        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        res.status(response.status);

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
        console.error("❌ Auth handler error:", error);
        res.status(500).json({
            error: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined,
        });
    }
}
