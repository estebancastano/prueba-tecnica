import type { NextApiRequest, NextApiResponse } from "next";
import swaggerJsdoc from "swagger-jsdoc";

// Configuración de Swagger para la documentación de la API
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Movimientos y Usuarios",
            version: "1.0.0",
            description: "API para gestión de movimientos, usuarios y reportes",
        },
        servers: [
            { url: "http://localhost:3000/api", description: "Servidor local" },
        ],
        components: {
            // 🔹 Esquemas de datos para Movimientos y Usuarios
            schemas: {
                Movimiento: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "123456" },
                        concepto: { type: "string", example: "Venta de producto X" },
                        monto: { type: "number", example: 150000 },
                        tipo: { type: "string", enum: ["INGRESO", "EGRESO"], example: "INGRESO" },
                        fecha: { type: "string", format: "date-time", example: "2025-10-03T10:30:00.000Z" },
                        userId: { type: "string", example: "12345678-abcd-1234-abcd-1234567890ab" },
                    },
                },
                Usuario: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "12345678-abcd-1234-abcd-1234567890ab" },
                        name: { type: "string", example: "Juan Pérez" },
                        email: { type: "string", example: "juan@example.com" },
                        phone: { type: "string", example: "3001234567" },
                        role: { type: "string", enum: ["ADMIN", "USUARIO"], example: "ADMIN" },
                        createdAt: { type: "string", format: "date-time", example: "2025-10-03T12:00:00.000Z" },
                        updatedAt: { type: "string", format: "date-time", example: "2025-10-03T12:15:00.000Z" },
                        image: { type: "string", nullable: true, example: null },
                        emailVerified: { type: "boolean", example: false },
                    },
                },
            },
        },
        // 🔹 Rutas de Movimientos, Usuarios y Reportes
        paths: {
            "/movements": {
                get: {
                    summary: "Obtener todos los movimientos",
                    tags: ["Movimientos"],
                    responses: {
                        200: {
                            description: "Lista de movimientos",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: { $ref: "#/components/schemas/Movimiento" },
                                    },
                                },
                            },
                        },
                    },
                },
                post: {
                    summary: "Crear un nuevo movimiento",
                    tags: ["Movimientos"],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Movimiento" },
                                example: {
                                    concepto: "Venta de producto X",
                                    monto: 150000,
                                    tipo: "INGRESO",
                                    fecha: "2025-10-03T10:30:00.000Z",
                                    userId: "12345678-abcd-1234-abcd-1234567890ab",
                                },
                            },
                        },
                    },
                    responses: {
                        201: { description: "Movimiento creado" },
                    },
                },
            },

            "/movements/{id}": {
                get: {
                    summary: "Obtener un movimiento por ID",
                    tags: ["Movimientos"],
                    parameters: [
                        { name: "id", in: "path", required: true, schema: { type: "string" } },
                    ],
                    responses: {
                        200: { description: "Movimiento encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Movimiento" } } } },
                        404: { description: "No encontrado" },
                    },
                },
                put: {
                    summary: "Actualizar un movimiento",
                    tags: ["Movimientos"],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    requestBody: {
                        required: true,
                        content: { "application/json": { schema: { $ref: "#/components/schemas/Movimiento" } } },
                    },
                    responses: { 200: { description: "Movimiento actualizado" } },
                },
                delete: {
                    summary: "Eliminar un movimiento",
                    tags: ["Movimientos"],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Movimiento eliminado" } },
                },
            },

            "/users": {
                get: {
                    summary: "Obtener todos los usuarios",
                    tags: ["Usuarios"],
                    responses: {
                        200: { description: "Lista de usuarios", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Usuario" } } } } },
                    },
                },
            },

            "/users/{id}": {
                put: {
                    summary: "Actualizar un usuario",
                    tags: ["Usuarios"],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Usuario" } } } },
                    responses: { 200: { description: "Usuario actualizado" } },
                },
                delete: {
                    summary: "Eliminar un usuario",
                    tags: ["Usuarios"],
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Usuario eliminado" } },
                },
            },

            "/reports": {
                get: {
                    summary: "Generar y descargar CSV de movimientos",
                    tags: ["Reportes"],
                    responses: {
                        200: { description: "CSV generado", content: { "text/csv": { schema: { type: "string", format: "binary" } } } },
                    },
                },
            },
        },

    },
    apis: [], 
};

const swaggerSpec = swaggerJsdoc(options);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(swaggerSpec);
}
